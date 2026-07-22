# CLAUDE.md — ct-website-change (IMPACT 論壇報)

## 專案概述

IMPACT 論壇報的前端重設計原型。SPA 架構，**沒有 React Router**，路由邏輯集中在 `src/routing.ts`（純函式，`App.tsx` 呼叫）。

> 目前沒有接真實後端，但 `src/api/` 層刻意寫成「假裝在打真實 REST API」的形狀（見下方「API 層」），方便未來直接把 mock 換成真的 fetch。**不要把這層當成純裝飾拿掉或簡化**。

---

## Tech Stack

| 層級 | 技術 |
|------|------|
| 框架 | React 19 + TypeScript |
| 打包 | Vite |
| 樣式 | **Tailwind CSS v4** + Vanilla CSS (`src/index.css`) |
| 字體 | Google Fonts：Noto Sans TC、Noto Serif TC、Oswald、Playfair Display |
| Icon | Font Awesome 6 (CDN，`index.html` 引入) |

> ⚠️ 使用的是 **Tailwind v4**，不是 v3。`@theme` 取代舊版 `tailwind.config.js`，自訂 CSS 變數直接寫在 `index.css` 的 `@theme {}` block。
>
> ⚠️ Tailwind v4 沒有內建 `xs:` breakpoint。寫 `hidden xs:block` 這種 class 不會報錯，但也永遠不會生效（等同一直 `hidden`）。要嘛用 `sm:`，要嘛在 `@theme` 自訂。

---

## 路由 / 頁面架構

`src/routing.ts` 的 `readRoute(search)` / `buildRouteUrl(pathname, route)` 負責 URL ⇄ `AppRoute` 物件的雙向轉換，`App.tsx` 用 `window.history.pushState` 同步、`popstate` 支援瀏覽器上一頁/下一頁。

`AppRoute` 欄位：`category`、`articleId`、`tag`、`author`、`planId`、`productId`、`subCategory`、`paymentType`、`paymentReference`。對應 query string：`?category=xxx&article=123&tag=...&author=...&plan=1&product=1&sub=...`，或付款結果頁專用的 `?payment=order&reference=...`（互斥，出現 `payment` 時其他參數一律清空、`category` 強制為 `'付款結果'`）。

大多數頁面元件是 `lazy()` 動態載入，包在 `<Suspense fallback={<RouteFallback />}>` 裡；找不到對應分類/文章/標籤/作者時顯示 `<NotFoundPage>`（404）。

```
route (AppRoute)
    │
    ├── currentAuthor（無 articleId）        → <AuthorResultsPage>
    ├── currentTag（無 author/articleId）     → <TagResultsPage>
    ├── '首頁'                              → <HomeAccordion>
    ├── '專欄'                              → <ColumnPage>
    ├── '影響力聯盟'                         → <ImpactAlliancePage>
    ├── '信仰知識庫'                         → <KnowledgeBasePage>
    ├── NEWS_CATEGORIES（其餘分類）           → <CategoryList>
    ├── 任何分類 + articleId                 → <ArticleDetail>（優先權最高，會覆蓋上述分類頁）
    ├── '信仰好物' + 無 productId             → <ProductGallery>
    ├── '信仰好物' + productId               → <ProductDetail>
    ├── '訂報'                              → <ActionPage>
    ├── '奉獻' + 無 planId                   → <DonationGallery>
    ├── '奉獻' + planId                     → <DonationPlanDetail>
    ├── '會員中心'                           → <LoginPage>
    ├── '會員招募'                           → <MembershipPage>
    ├── '會員專區'                           → <MemberDashboard>（未登入時 fallback 回 <LoginPage>）
    ├── '活動報名'                           → <EventRegistrationPage>
    ├── '全版閱讀'                           → <EpaperPage>
    ├── '客戶服務' / '申請合作' / '論壇Line貼圖' / '祝福卡申辦/捐款'
    │                                      → CustomerService / Partnership / LineStickers / BlessingCard
    ├── '關於我們' / '新聞連絡' / '我要投稿' / '版權隱私權聲明' / '財務報表'
    │                                      → 對應靜態頁（About/Contact/Submit/Privacy/Financial）
    ├── '付款結果' + paymentType             → <PaymentResultPage>
    ├── 以上皆不符（isUnknownRoute）          → <NotFoundPage>（404）
    └── (全域，不受 category 影響)            → <SplashAd>、<Header>、<Footer>、
                                              <CartDrawer>、<SearchModal>
```

`main` 用 `key={\`${currentCategory}-${currentArticleId}-${currentTag}-${currentAuthor}\`}` 強制切換頁面時重新掛載（避免不同文章/標籤/作者頁之間 state 殘留）。

`FloatingImageAd` + `FloatingDonateButton`（兩個 fixed 元件，取代舊版單一 `GlobalBottomAd`）在以下分類**不顯示**（`App.tsx` 的 `BOTTOM_AD_EXCLUDED_CATEGORIES`）：
`訂報`、`奉獻`、`信仰好物`、`會員中心`、`會員招募`、`會員專區`、`活動報名`、`全版閱讀`、`關於我們`、`新聞連絡`、`我要投稿`、`申請合作`、`客戶服務`、`論壇Line貼圖`、`祝福卡申辦/捐款`、`版權隱私權聲明`、`財務報表`。

登入狀態用 `useAuth()` hook。session 可存在 `localStorage`（登入時勾選「記住我」）或 `sessionStorage`（不勾選），兩者互斥，寫入前會清掉另一個（見 `src/utils/authStorage.ts`）；多分頁登出用 `BroadcastChannel`（`src/utils/authEvents.ts`）同步。每次切換 `currentCategory` 都會 `refreshUser()`。

---

## 目錄結構

```
src/
├── App.tsx                    # 路由渲染、購物車 state、登入狀態、URL 同步
├── routing.ts                 # readRoute / buildRouteUrl（URL ⇄ AppRoute 純函式）
├── main.tsx
├── index.css                  # 全域 CSS：@theme、Accordion 動畫、RWD
├── types.ts                   # re-export，實際型別在 src/types/*.ts
├── types/
│   ├── news.ts                 # NewsItem、AdItem、Columnist、AllianceMember、ActionPlan
│   ├── donation.ts             # Plan、DonationFormPayload
│   ├── member.ts                # Member、DonationRecord、SubscriptionRecord、MemberStats
│   ├── auth.ts                  # AuthUser 與登入/註冊 request-response
│   ├── product.ts                # Product、CartItem、Order
│   ├── event.ts                  # 活動報名相關型別
│   ├── membership.ts             # 會員招募方案型別
│   ├── epaper.ts                  # 全版閱讀（電子報）型別
│   └── payment.ts                  # 付款結果頁型別
├── data/                        # 核心內容資料（JSON + index.ts 匯出）
│   ├── index.ts                  # 匯出 NEWS_CATEGORIES / MOCK_NEWS / MOCK_ADS / ALLIANCE_MEMBERS / COLUMNISTS / MOCK_PRODUCTS
│   ├── forumSubCategories.ts     # 「基督教論壇報」分類的子分類清單（Header 下拉選單用）
│   └── news.json / ads.json / alliance_members.json / columnists.json / products.json / content.json / subscription.json
├── mocks/                       # 個別頁面專用的假資料（非核心內容模型）
│   ├── accordionPanels.ts       # HomeAccordion 的 featured 影片/廣告
│   ├── donationPlans.ts
│   ├── member.ts                 # MOCK_MEMBER（會員中心用）
│   ├── events.ts                 # 活動報名假資料
│   ├── epaper.ts                 # 全版閱讀假資料
│   └── membershipPlans.ts        # 會員招募方案假資料
├── api/                          # 模擬 REST API 的呼叫層（見下方「API 層」）
│   ├── client.ts                 # apiGet/apiPost/apiPut/apiDel，含 401 自動登出
│   ├── config.ts                  # USE_MOCK_API（讀 VITE_USE_MOCK_API）
│   ├── validators.ts              # assertApiData 與各型別的 type guard（isNewsItems 等）
│   ├── auth.ts                    # login/register/socialLogin，內含 dev 測試帳號
│   ├── savedArticles.ts           # 收藏文章：登入時打 API，訪客/mock 模式 fallback 到 localStorage
│   └── news.ts / ads.ts / home.ts / alliance.ts / columnists.ts / plans.ts / member.ts
│       / products.ts / subscriptions.ts / events.ts / membership.ts / epaper.ts
│       / orders.ts / payments.ts
├── hooks/
│   ├── useAuth.ts                # 讀 auth session、跨分頁同步（BroadcastChannel）
│   ├── useAsyncData.ts           # 統一處理 loading/error/retry/AbortController
│   ├── useCarousel.ts
│   └── useYouTubePlayer.ts
├── utils/
│   ├── storage.ts                # readJsonStorage / writeJsonStorage（帶 type guard 驗證的 storage 存取）
│   ├── authStorage.ts             # auth_token/auth_user 的 localStorage⇄sessionStorage 讀寫
│   ├── authEvents.ts              # BroadcastChannel 跨分頁登出通知
│   └── navigation.ts              # getSafeExternalUrl 等外部連結安全檢查
├── components/
│   ├── Header.tsx                 # Fixed 頂部導覽，含 header ad bar + 導覽/CTA 列 + category bar
│   ├── Footer.tsx
│   ├── FloatingImageAd.tsx        # Fixed 底部圖片廣告（取代舊版 GlobalBottomAd）
│   ├── FloatingDonateButton.tsx   # Fixed 底部奉獻按鈕
│   ├── SplashAd.tsx               # 進站全螢幕贊助彈窗（SVG 版面，桌機/手機不同排版）
│   ├── InlineArticleBanner.tsx    # 文章內文中段廣告卡（可傳 className 覆蓋預設 margin）
│   ├── NativeAdCard.tsx
│   ├── StickySidebarAd.tsx
│   ├── SummitBanner.tsx
│   ├── FeaturedCarousel.tsx
│   ├── AsyncPageState.tsx         # 統一的 loading / error 畫面（配 useAsyncData 用）
│   ├── AppErrorBoundary.tsx       # 全域 React error boundary
│   ├── SearchModal.tsx / CartDrawer.tsx / ReceiptModal.tsx
│   ├── ProductDetail.tsx / PlanCard.tsx / DonationPlanDetail.tsx
│   └── ColumnPage.tsx
└── pages/
    ├── HomeAccordion.tsx          # 首頁核心：全螢幕手風琴 + carousel
    ├── CategoryList.tsx           # 分類文章列表
    ├── ArticleDetail.tsx          # 文章閱讀頁（詳見下方專節）
    ├── TagResultsPage.tsx / AuthorResultsPage.tsx  # 標籤／作者搜尋結果頁
    ├── ActionPage.tsx             # 訂報頁
    ├── ProductGallery.tsx         # 信仰好物頁（橫向 scroll gallery）
    ├── DonationGallery.tsx        # 奉獻方案列表
    ├── LoginPage.tsx / MembershipPage.tsx / MemberDashboard.tsx
    ├── EventRegistrationPage.tsx / ImpactAlliancePage.tsx / KnowledgeBasePage.tsx
    ├── EpaperPage.tsx             # 全版閱讀
    ├── PaymentResultPage.tsx      # 付款結果（訂單/會員/奉獻/活動共用）
    ├── CustomerServicePage.tsx / PartnershipPage.tsx / LineStickersPage.tsx / BlessingCardPage.tsx
    └── AboutPage.tsx / ContactPage.tsx / SubmitPage.tsx / PrivacyPage.tsx / FinancialPage.tsx
```

---

## API 層（`src/api/`）

這層是刻意做出來的「未來可以無痛換真後端」介面，**寫新功能時要延續這個慣例**：

- 核心內容 API 統一使用非同步簽名，並透過 `VITE_USE_MOCK_API`（`api/config.ts` 的 `USE_MOCK_API`）切換 mock / REST，例如：
  ```ts
  // GET /api/news/{id}/recommended
  export async function getRecommended(id: number, limit = 4, options?: ApiRequestOptions): Promise<NewsItem[]> {
    return USE_MOCK_API
      ? MOCK_NEWS.filter((n) => n.id !== id).slice(0, limit)
      : apiGet<NewsItem[]>(`/api/news/${id}/recommended?limit=${limit}`, options);
  }
  ```
  頁面使用 `useAsyncData` 統一處理 loading、error、retry 與 AbortController。
- 打真實 REST 的分支要用 `api/validators.ts` 的 `assertApiData(data, typeGuard, label)` 驗證回應形狀，不要直接信任 `apiGet<T>()` 的型別斷言。
- `client.ts` 提供 `apiGet/apiPost/apiPut/apiDel`，統一處理 Authorization、timeout、204、JSON/文字錯誤與 401 `auth:expired` 事件。
- `auth.ts` 有一組 **dev 測試帳號**（`test@ct.org.tw` / `impact2024`）；在 mock mode 使用本地資料，`VITE_USE_MOCK_API=false` 時呼叫正式登入、註冊、社群登入與登出端點。
- 有些「個人化但非核心內容」的功能（例如收藏文章 `api/savedArticles.ts`）採混合模式：已登入時打真實 API，訪客或 mock 模式則 fallback 到 `localStorage`。寫類似功能時可參考這個模式，而不是整個功能都繞過 `api/` 層。
- 前後端端點、request-response 與尚未定案項目記錄於 `docs/api-contract.md`，串接前需共同確認。
- `data/`（核心內容：新聞、廣告、聯盟成員、專欄作家、商品）與 `mocks/`（個別頁面專用假資料：首頁精選影片、奉獻方案、會員個人資料、活動、電子報）是分開的兩個目錄，寫新頁面時先判斷資料屬於哪一種再決定放哪裡。

---

## 主題系統

**目前只有單一（淺色）主題，沒有 dark mode 切換**（舊版有 `.dark` class + toggle，已於後續版本移除）。CSS 變數（`index.css` 的 `@layer base`）：

```css
:root {
  --bg-base: 253 252 250;   /* 米白 */
  --text-base: 10 10 10;
}
```

在 Tailwind 使用：`bg-theme-bg`、`text-theme-text`、`border-theme-text/10` 等，**即使沒有 dark mode 也要繼續用這組 token**（不要硬寫 `bg-white`/`text-black`），保留未來重新加回主題切換的彈性。

### 品牌色
- `--color-brand-red: #9C1B23` → Tailwind class: `bg-brand-red`、`text-brand-red`

---

## 固定 Header 高度（RWD 關鍵）

Header 是 `position: fixed; z-index: 40`。各頁面的 **top padding 必須清過 header**。

Header 由三段組成：頂部廣告條（`getAd('header')`，可能不顯示）→ Logo + 導覽/CTA 列 → Category bar（`showCategoryBar` 時才顯示）。三段疊加後在手機上實測需要約 **190px** 才能清乾淨；不要自己重新逐行加總估算，直接沿用下面的安全值。

### 各頁面 top padding 規範

| Component | Mobile | Desktop |
|-----------|--------|---------|
| `HomeAccordion` | **動態**（ResizeObserver 量測 header 高度） | `md:pt-0`（圖片從頂部滿版） |
| `CategoryList`（標準版型） | `pt-[190px]` | `md:pt-48` |
| `CategoryList`（首頁精選版型） | `pt-[190px]` | `md:pt-[190px]` |
| `ActionPage` | `pt-[190px]` | `md:pt-0` |
| `ProductGallery` | `pt-[190px]` | `md:pt-32` |
| `ArticleDetail` | `pt-[190px]` | `md:pt-32`（見下方專節） |

> ⚠️ **不要用 `pt-16`（64px）或 `pt-24`（96px）當手機 header 清除值**，會跑版。安全值為 `pt-[190px]`。這個 class 在 `pages/` 底下幾乎每個靜態頁都能看到，新頁面直接沿用即可。

---

## ArticleDetail — 文章頁結構

文章頁**由上到下**的順序（不要把廣告插到圖片/標題前面，會讓使用者滑到標題前先看到廣告）：

1. 主圖：`aspect-[832/470]`、`object-cover`、有邊框 + 圓角（**不是滿版**，跟廣告/標題共用同一組左右 padding，視覺上才會對齊一致）
2. 分類標籤 + 標題（`h1`）+ 作者/日期 meta row
3. （進入雙欄 grid 後）左欄：贊助商廣告（`getAd('infeed')`，樣式沿用整站的「Premium Sponsorship」視覺語言：`bg-theme-text` 深底、brand-red 直條、serif 粗體標題、紅色 CTA）→ Share／收藏列 → 內文（`article.content` 或 `firstPart` + 文中插播的 `randomAd` + `secondPart`）
4. 右欄：「熱門文章」編號列表（`getRecommended(articleId, 5)`）+ `getAd('sidebar')`
5. 「推薦文章 / UP NEXT」grid（`getRecommended(articleId)`，預設 4 筆）
6. 「Back to Index」全螢幕黑底 CTA

### 收藏（Bookmark）功能
- 透過 `api/savedArticles.ts`（`getArticleSavedStatus` / `saveArticle` / `removeSavedArticle`）：已登入且非 mock 模式時打真實 API，訪客或 mock 模式則落地到 `localStorage` key `impact_saved_articles`（`number[]`，文章 id）。**不要**繞過這層直接讀寫 `localStorage`。
- 切換時用共用的 `toastMessage` state 跳提示（跟複製連結分享共用同一個 toast UI，不要各自寫一份）。
- `isSaved` 用 `useEffect`／非同步請求依 `article.id` 重新計算，**不要**只用 lazy `useState` 初始化，否則同一個掛載中切換文章（不同 `articleId` prop）狀態不會更新。

> 圖片、標題、廣告都包在同一個 `max-w-[90rem] mx-auto` + 同一組 `px-5 sm:px-6 md:px-12 lg:px-20`容器裡，**不要**再拆成多層各自宣告 padding 的 div，之前這樣做造成間距重複、版面「怪怪的」。

---

## HomeAccordion — 核心元件

面板內容從 `getNewsByCategory` 依 `HOME_ACCORDION_CATEGORIES`（`['最新文章', '基督教論壇報', '專欄', '人物見證', '生活情報']`）動態組成，並在第 4 個分類（人物見證）後插入「影片專區」面板與一個 `getAccordionAd` 廣告面板（`buildPanels()`，見 `HomeAccordion.tsx`）——**不是**固定寫死某幾個文章 id，換 `MOCK_NEWS` 資料時面板會自動跟著變。

### 動態 Header 高度
用 `useLayoutEffect` + `ResizeObserver` 監聽 `<header>` 的 `offsetHeight`，手機版（`innerWidth < 768`）把量到的高度寫進 container 的 inline `paddingTop`；桌機版不用 padding（圖片滿版從頂部開始）。**不要改回 `pt-[Npx]` 的靜態寫法**，會在不同裝置上跑版。

### Accordion CSS 動畫原理
- 所有面板都是 flexbox 子元素（`display: flex; flex-direction: row`）
- `flex` 屬性變化驅動展開/收合動畫（非 `width/height` 過渡）
- Active panel: `flex: 7`，inactive: `flex: 1`，CSS `transition: flex 0.65s cubic-bezier(...)`
- **不要用 `width:` 過渡**，會破壞動畫

### 圖片 Grayscale 邏輯
- **Active panel** 的 carousel 圖片：`opacity-100`（全彩）
- **Inactive panel** 圖片：`opacity-50 md:opacity-80 md:grayscale`
  - 手機（<640px）：50% 不透明彩色（無 grayscale，因 CSS override: `filter: none !important`）
  - 桌機/平板（md+）：80% 不透明 + 灰階
- hover 後還原：`group-hover:opacity-100 group-hover:grayscale-0`

### 漸層遮罩
```css
/* Active panel — 雙向漸層（上暗 + 下暗，中間透明）*/
.accordion-vignette {
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 28%,
    transparent 45%, transparent 52%,
    rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.92) 100%
  );
}
/* Inactive panel */
bg-black/50 sm:bg-black/35 md:bg-black/25
```

### Desktop Hover 行為（純 CSS）
- `accordion-container:hover .accordion-panel.active:not(:hover)` → 收縮 + 隱藏 content-expanded
- `.accordion-panel:hover` → 展開（`flex: 7 !important`）+ 顯示 content-expanded
- **不要加 JS hover handler**，已全部用 CSS 處理

### 內容固定高度（防止切換文章時版面位移）
```tsx
// Title — 固定最小高度
<div className="min-h-[5.5rem] md:min-h-[8.5rem] lg:min-h-[10rem] overflow-hidden">

// Excerpt — 固定高度
<div className="h-10 md:h-12 overflow-hidden">
```

### 底部 padding（清除 FloatingImageAd / FloatingDonateButton）
底部兩個 fixed 元件疊加後，桌機約 **74px**。content-expanded 的底部 padding 必須大於這個值：
```tsx
// 手機: pb-6 (accordion-container 本身已有 pb-[136px])
// 平板: md:pb-20 (80px > 56px ad)
// 桌機: lg:pb-24 (96px > 74px ad)
```

---

## 底部浮動元件（FloatingImageAd / FloatingDonateButton）

- 兩者皆 `fixed bottom-0`，取代舊版單一 `GlobalBottomAd`；`FloatingImageAd` 吃 `getAd('floating')`。
- 排除清單見上方「路由 / 頁面架構」一節。
- 其他頁面的內容底部必須留足夠 padding 避免被遮。
- 在 Playwright 等工具做**全頁（fullPage）截圖**時，`position: fixed` 元素常會被畫在錯誤的絕對位置、疊在頁面中段內容上——**這是截圖工具的已知瑕疵，不是真的版面 bug**。要驗證 fixed 元素要用一般 viewport 截圖 + 手動 `scrollTo`，不要看 fullPage 截圖。

---

## 資料結構（`src/data/`）

### NewsItem（`src/types/news.ts`）
```ts
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;   // 對應 NEWS_CATEGORIES
  author: string;
  date: string;        // 'APR 11' 格式
  imageUrl: string;    // Unsplash URL 或 ct.org.tw 圖片
  content?: string;    // HTML string，只有 id:1 有真實內容
  subCategory?: string;
}
```

### AdItem
```ts
interface AdItem {
  id: string;
  sponsor: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}
```

### MOCK_ADS slots
`header` | `infeed` | `inline` | `sidebar` | `accordion` | `floating`
（`ArticleDetail` 的贊助商廣告與 `CategoryList` 的 `NativeAdCard` 都吃 `infeed`；`header` 是 Header 頂部那條紅色 CTA 條；`floating` 是 `FloatingImageAd`，跟文章頁廣告是不同東西，不要搞混）

### localStorage / sessionStorage key 慣例
| Key | 存放位置 | 內容 |
|-----|---------|------|
| `impact_cart` | localStorage | 購物車 `CartItem[]` |
| `impact_orders` | localStorage | 已完成訂單 |
| `impact_saved_articles` | localStorage | 收藏文章 id 陣列（`number[]`，見 `api/savedArticles.ts` 的訪客/mock fallback） |
| `auth_token` / `auth_user` / `auth_refresh_token` | localStorage **或** sessionStorage（互斥，依登入時是否勾選「記住我」） | 登入 session（由 `utils/authStorage.ts` 讀寫） |

新功能要做「純前端持久化」時，沿用 `impact_` 前綴命名，並優先透過 `utils/storage.ts` 的 `readJsonStorage`/`writeJsonStorage`（帶 type guard 驗證），不要直接裸接 `JSON.parse(localStorage.getItem(...))`。

---

## 分類系統

```ts
export const NEWS_CATEGORIES = [
  '最新文章', '基督教論壇報', '人物見證', '專欄',
  '影響力聯盟', '生活情報', '信仰知識庫'
];
```

特殊分類（不走 `CategoryList`，由 `App.tsx` 直接分派元件）：
- `'首頁'` → HomeAccordion
- `'專欄'` → ColumnPage
- `'影響力聯盟'` → ImpactAlliancePage
- `'信仰知識庫'` → KnowledgeBasePage
- `'信仰好物'` → ProductGallery / ProductDetail
- `'訂報'` → ActionPage
- `'奉獻'` → DonationGallery / DonationPlanDetail
- `'會員中心'` → LoginPage
- `'會員招募'` → MembershipPage
- `'會員專區'` → MemberDashboard
- `'活動報名'` → EventRegistrationPage
- `'全版閱讀'` → EpaperPage
- `'客戶服務'` / `'申請合作'` / `'論壇Line貼圖'` / `'祝福卡申辦/捐款'` → 對應靜態頁
- `'關於我們'` / `'新聞連絡'` / `'我要投稿'` / `'版權隱私權聲明'` / `'財務報表'` → 對應靜態頁
- `'付款結果'`（透過 `?payment=` query param 進入，非 Header/Footer 導覽項目）→ PaymentResultPage

---

## CSS 命名慣例

| Class | 用途 |
|-------|------|
| `.accordion-container` | 全螢幕 accordion 外框 |
| `.accordion-panel` | 單一面板，`.active` 表示展開 |
| `.accordion-bg` | 面板背景圖片（absolute，100vw × 100dvh） |
| `.accordion-vignette` | Active panel 雙向漸層遮罩 |
| `.content-collapsed` | 面板收合時顯示的數字/分類 |
| `.content-expanded` | 面板展開時顯示的完整內容 |
| `.hide-scrollbar` | 隱藏滾動條 |
| `.article-content` | 文章內文排版（`p`、`h2`、drop-cap） |
| `.gallery-track` | ProductGallery 橫向卷軸 |

---

## 常見地雷

1. **`h-[calc(1.2em*3*2rem)]`** — invalid CSS（`em × rem` 不能相乘），會被瀏覽器忽略。改用 `min-h-[Nrem]`。

2. **CSS mobile override 只移除 `filter: none !important`，不能加 `opacity: 1 !important`**——否則 accordion inactive 面板會強制全彩、看不出未展開狀態。

3. **Desktop hover 行為是純 CSS**，不要在 `onMouseEnter`/`onMouseLeave` 加 React state，會打架。

4. **不要用 `pt-16/24/32` 當手機 header 清除**，手機版 header（含 category bar）實測約需 190px。使用 `pt-[190px]` 或動態量測。

5. **`bg-theme-bg/85` 在 inactive 面板會把圖片洗白**——現在改用 `bg-black/50`，使圖片暗但不失色彩。

6. **`accordion-container` 的 padding-top 是 inline style（ResizeObserver 寫入）**，覆蓋優先度高於 Tailwind class，不要在 className 同時加 `pt-[Npx]` 造成衝突。

7. **Tailwind v4 沒有 `xs:` breakpoint**——寫了不會報錯但永遠不生效，等於一直 `hidden`。改用 `sm:` 或在 `@theme` 自訂。

8. **同一個區塊不要拆成多層各自宣告 padding/max-width 的 div**——容易造成間距疊加、版面「看起來怪怪的」，且改一次要改好幾處。優先合併成單一容器。

9. **驗證 `position: fixed` 元素（Header、FloatingImageAd、FloatingDonateButton）時不要用 Playwright fullPage 截圖**，會被畫在錯誤位置疊在內容上；改用一般 viewport 截圖 + `scrollTo` 驗證。

10. **不要繞過 `utils/authStorage.ts` 直接讀寫 `auth_token`/`auth_user`**——登入 session 依「記住我」勾選會落在 localStorage 或 sessionStorage 其中之一，兩者互斥；直接裸寫容易漏掉清除另一邊，造成殘留 session。

---

## Dev 指令

```bash
npm run dev    # 開發（Vite HMR）
npm run build  # 生產打包
npm run preview # 預覽 dist
```

---

## 設計原則

- **行動優先（Mobile First）**，但 HomeAccordion 的 hover 互動是桌機專屬
- 字體：heading 用 `font-serif`（Noto Serif TC）、UI label 用 `font-display`（Oswald）、內文用 `font-sans`（Noto Sans TC）
- 色調：米白底黑字（單一主題，無 dark mode），品牌紅（#9C1B23）作為 accent
- 圖片盡量保持 `grayscale opacity-70`，hover/active 時轉全彩——這是整站的視覺語言
- 廣告/贊助內容統一走「Premium Sponsorship」視覺語言（`bg-theme-text` 深底 + brand-red 直條 + serif 粗體標題 + 紅色 CTA），**不要**每個廣告位置各自發明新樣式（先前迭代過幾種「滿版圖片疊文字」的設計都被認為不好看，最後收斂到這個方案）
