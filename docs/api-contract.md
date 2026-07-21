# IMPACT 前後端 API Contract（草案）

此文件是前端目前採用的介面草案，正式串接前需由前後端共同確認。所有時間使用 ISO 8601，金額使用整數新台幣，受保護端點使用 `Authorization: Bearer <token>`。

## 共通規則

- Base URL：`VITE_API_BASE_URL`
- 成功回應目前預期直接回傳資源本身，不額外包 `data`。
- 錯誤回應：`{ "message": "說明", "code": "OPTIONAL_CODE", "fieldErrors": { "field": "說明" } }`
- 列表分頁格式尚未定案；新聞與商品目前暫時預期直接回傳陣列。
- `401` 會清除前端 session 並觸發 `auth:expired`。
- 前端會驗證關鍵 API 回應的資料形狀；後端不可把 HTML、未定義欄位型別或除錯資訊當成成功回應。
- 建立訂單／奉獻等交易端點應支援 Idempotency Key，避免重複付款。
- 正式環境只允許 HTTPS。錯誤訊息不得包含 stack trace、SQL、金流憑證或其他敏感資料。
- 若 API 與前端不同網域，CORS 必須指定確切前端 origin，不可在允許 Cookie／credentials 時使用 `*`。

## Authentication

### `POST /api/auth/login`

Request：`LoginRequest`。Response：`AuthResponse`。

### `POST /api/auth/register`

Request：`RegisterRequest`。Response：`AuthResponse`。

### `POST /api/auth/social-login`

Request：`{ provider: "facebook" | "google" }`。Response 可為 `AuthResponse`，或由後端產生並驗證 OAuth `state`／PKCE 後回傳 `{ "authorizationUrl": "https://..." }`。前端只會導向 HTTP(S) 網址。

### `POST /api/auth/logout`

需 Bearer token。成功可回 `204 No Content`。

`AuthResponse`：

```json
{
  "token": "access-token",
  "expiresAt": "2026-12-31T23:59:59+08:00",
  "user": { "id": "user-id", "name": "姓名", "email": "user@example.com" }
}
```

Access token 目前只保存在該分頁的 `sessionStorage`。Refresh token 不由 JavaScript 保存；建議後端使用 `Secure; HttpOnly; SameSite=Lax/Strict` Cookie，並實作輪替與重用偵測。

## Member

- `GET /api/me` → `Member`
- `PUT /api/me`，body `UpdateMemberRequest` → 更新後的 `Member`
- `GET /api/me/stats` → `MemberStats`
- `GET /api/me/donations` → `DonationRecord[]`
- `GET /api/me/subscription/billing` → `SubscriptionRecord[]`

### Saved articles

- `GET /api/me/saved-articles` → `NewsItem[]`，預設依收藏時間由新到舊
- `GET /api/me/saved-articles/{articleId}/status` → `{ "saved": true }`
- `POST /api/me/saved-articles`，body `{ "articleId": 123 }` → `204 No Content`
- `DELETE /api/me/saved-articles/{articleId}` → `204 No Content`

訪客收藏保留在瀏覽器；登入會員的收藏由後端保存，供跨裝置同步。

Refresh token 的更新端點、Cookie CSRF 防護與輪替策略尚未定案。

- `POST /api/auth/forgot-password`，body `{ "email": "user@example.com" }` → `{ "accepted": true }`
- `POST /api/me/password`，body `{ "currentPassword": "...", "newPassword": "..." }` → `204 No Content`
- `POST /api/me/payment-method/session`，body `{ "returnUrl": "https://..." }` → `{ "managementUrl": "https://payment.example.com/..." }`

忘記密碼不論信箱是否存在都應回相同結果，避免洩漏會員名單。付款方式由金流商的託管頁處理，前端與本 API 都不接收完整卡號或安全碼。

## News

- `GET /api/news`
- `GET /api/news?category={category}`
- `GET /api/news?tag={tag}`
- `GET /api/news?author={author}`
- `GET /api/news/search?q={query}&limit={limit}`
- `GET /api/news/{id}`
- `GET /api/news/{id}/content`
- `GET /api/news/{id}/recommended?limit={limit}`

## Home, ads and editorial directories

- `GET /api/home/featured-videos` → `FeaturedVideo[]`
- `GET /api/home/accordion-ad` → `FeaturedAd`
- `GET /api/ads/{placement}` → `AdItem`
- `GET /api/ads/random` → `AdItem`
- `GET /api/columnists?subCategory={subCategory}` → `Columnist[]`
- `GET /api/alliance/members` → `AllianceMember[]`
- `GET /api/alliance/articles?limit={limit}` → `NewsItem[]`

## Products and newspaper subscription content

- `GET /api/products?limit={limit}`
- `GET /api/products/{id}`
- `GET /api/products/search?q={query}&limit={limit}`
- `GET /api/subscriptions` → `SubscriptionPage`

## Epaper (全版閱讀)

以下兩個端點皆需 Bearer token，僅開放已登入且 `Member.subscription.status === "active"` 的使用者；未登入回 `401`，已登入但未訂閱回 `403`。這個權限檢查**必須在後端執行**——前端的登入/訂閱判斷只是 UI 層的顯示邏輯，不能作為存取控制的唯一防線。

`imageUrl` 必須是短效、不可預測的簽名 URL（例如帶 expiry + signature query string 的 CDN 連結），**不可**是需要另外附加 `Authorization: Bearer` header 才能存取的端點——頁面用一般 `<img src>` 載入頁面圖片，瀏覽器不會、也無法附加 sessionStorage 裡的 token，若 `imageUrl` 要求 Bearer 驗證，圖片一律會 401。簽名 URL 的有效期應足夠涵蓋單次閱讀 session（例如數小時），並在 `issueNumber`/`pageNumber` 之外綁定使用者或訂閱狀態，避免簽名 URL 被分享後長期有效。

- `GET /api/epaper/issues` → `EpaperIssueSummary[]`，依期數新到舊排序，回傳可供選擇的期數清單。

```json
[
  { "issueNumber": 4868, "dateLabel": "2026 年 7 月 18 日 ~ 21 日（週六～二）" }
]
```

- `GET /api/epaper/issues/{issueNumber}` → `EpaperIssue`，回傳單一期數的完整頁面資料。`pages` 至少要有 1 筆；找不到該期數回 `404`。

```json
{
  "issueNumber": 4868,
  "dateLabel": "2026 年 7 月 18 日 ~ 21 日（週六～二）",
  "pages": [
    { "pageNumber": 1, "imageUrl": "https://.../page-1.jpg" }
  ]
}
```

## Product orders

- `POST /api/orders`，建立訂單並取得付款 session
- `GET /api/me/orders` → `Order[]`

建立訂單時，前端會在 request header 傳送 `Idempotency-Key`。後端應以此避免重複建立訂單或重複扣款；商品價格、運費與總額必須由後端重新計算，不接受前端傳入的金額。

```json
{
  "recipient": {
    "name": "收件人",
    "phone": "0912345678",
    "email": "user@example.com",
    "address": "寄送地址"
  },
  "paymentMethod": "credit-card",
  "returnUrl": "https://frontend.example.com/?payment=order",
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

Response：

```json
{
  "order": {
    "orderNumber": "IMPACT-20260717-000001",
    "status": "payment_pending",
    "subtotal": 1200,
    "shippingFee": 0,
    "total": 1200
  },
  "paymentUrl": "https://payment.example.com/session"
}
```

`paymentUrl` 存在時前端會導向金流。訂單狀態使用 `pending | payment_pending | paid | failed | cancelled | refunded`；只有後端收到金流 webhook 後才能設為 `paid`。

## Membership subscriptions

- `GET /api/membership/plans` → `MembershipPlan[]`
- `POST /api/member/subscriptions`，body `{ "planId": "plan-b", "returnUrl": "https://frontend.example.com/?payment=membership" }`

建立會員訂閱時也會傳送 `Idempotency-Key`。Response：

```json
{
  "subscriptionId": "subscription-id",
  "status": "payment_pending",
  "paymentUrl": "https://payment.example.com/session"
}
```

`paymentUrl` 存在時前端會導向金流。只有後端收到金流 webhook 後才能將訂閱設為 `active`，前端不會自行開通會員資格。

## Donation

- `GET /api/plans/{id}` → `Plan`
- `POST /api/donations`，body `DonationFormPayload` → `DonationResponse`

`DonationFormPayload` 應包含 `returnUrl`，供金流完成後回到 `?payment=donation&reference=...`。
建立奉獻時會傳送 `Idempotency-Key`；後端必須以會員／訪客、端點與 key 的組合防止重複建立或扣款。

```json
{
  "success": true,
  "donationId": "donation-id",
  "status": "pending",
  "paymentUrl": "https://payment.example.com/session"
}
```

若有 `paymentUrl`，前端將導向金流頁。最終付款結果必須由後端 webhook 決定，不可只相信瀏覽器跳轉結果。

## Events

- `GET /api/events/{id}` → `EventDetail`，包含活動資訊與可購買票種
- `POST /api/events/{id}/registrations` → `EventRegistrationResponse`

報名 request 只傳 `ticketId` 與參加者資料，票價與剩餘名額由後端驗證。建立報名時會傳送 `Idempotency-Key`。

```json
{
  "ticketId": "standard",
  "returnUrl": "https://frontend.example.com/?payment=event",
  "attendee": {
    "name": "王大明",
    "title": "mr",
    "email": "user@example.com",
    "phone": "0912345678",
    "organization": "所屬單位",
    "remarks": "素食"
  }
}
```

Response：`{ "registrationId": "registration-id", "status": "payment_pending", "paymentUrl": "https://payment.example.com/session" }`。只有免付費活動或後端確認完成付款後才可回傳 `confirmed`。

## Payment result verification

- `GET /api/payments/status?type={order|membership|donation|event}&reference={reference}` → `PaymentStatusResponse`

```json
{
  "type": "order",
  "reference": "IMPACT-20260717-000001",
  "status": "paid",
  "message": "付款完成"
}
```

金流返回時，後端應在原本的 `returnUrl` 加上不可猜測或已簽章的 `reference`。前端會再向上述端點查詢，而且只接受回應中的 `type`、`reference` 與請求完全一致。網址上的 `success`、`status` 等參數永遠不能作為付款成功依據；最終狀態必須來自後端驗證過的金流 webhook。
