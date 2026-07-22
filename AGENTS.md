# AGENTS.md — ct-website-change Code Review Guide

## 用途

本文件主要供 code review 使用。目標是確認變更能否安全上線，不是逐行解釋或挑出所有差異。審查範圍只限目前的 git diff；除非差異直接依賴既有程式，否則不要評論未修改的程式碼。

專案是 IMPACT 論壇報的 React 19 + TypeScript SPA，使用 Vite、Tailwind CSS v4 與 Vanilla CSS。目前預設使用 mock API，可透過環境變數切換 REST 後端。

## Review 原則

- 先理解變更目的，再判斷差異是否違反目的或既有契約；「和舊程式不同」本身不是問題。
- 審查深度應與風險成比例。認證、付款、資料寫入、路由與部署可深入檢查；純文案或局部視覺調整不需擴張審查範圍。
- 假設作者是有經驗的工程師，只提出會阻擋正式部署的問題。
- 優先檢查 correctness、security、reliability、performance、edge cases、error handling 與 backward compatibility。
- 忽略格式、命名、個人風格與非必要重構。
- 每個問題都必須能由目前 diff 與可見程式碼直接證明，不要推測未知實作。
- 優先避免誤報；不要為了證明有做 review 而逐檔評論、窮舉假設情境或提出低價值意見。
- 不要求保留已被本次需求刻意改變的舊行為；只有違反明確需求、契約或造成核心流程失效時才提出。
- 確認問題是由目前差異引入、擴大或暴露；不要把既有問題當成本次變更的缺陷。
- 取得足夠證據確認沒有部署阻擋後即可停止，不必為了找到 finding 繼續擴大搜索。
- 找不到會阻擋正式部署的問題時，直接核准。

### Review 輸出格式

- Findings 優先，依嚴重度排序。
- 每項 finding 說明觸發條件、實際影響，並附上修改行的檔案連結。
- 嚴重度：
  - `P0`：會造成大規模中斷、資料遺失或重大資安事故。
  - `P1`：會阻擋部署，或讓核心流程在合理使用情境下失效。
- 不要把測試缺口本身當成 bug；只有在差異造成既有必要檢查失敗，或缺少測試會掩蓋可證明的正式環境問題時才提出。
- 若沒有 findings，回覆核准並簡述已執行的檢查。

## 審查所需架構背景

### 路由

- 專案沒有 React Router。`src/routing.ts` 負責解析及產生 query string，`src/App.tsx` 負責頁面切換與 `pushState`。
- 支援 `category`、`article`、`tag`、`author`、`plan`、`product`、`payment`、`reference` 與瀏覽器上一頁。
- URL 輸入必須經過 `readRoute()` 驗證，不可直接信任 query string。
- 修改導航時，檢查 URL、React state、上一頁/下一頁及登入後返回路徑是否一致。
- 同一元件在不同 category 間重用時，檢查篩選、分頁、輪播等 local state 是否需要重設。

### 資料與 API

- 頁面應透過 `src/api/` 存取資料，不應直接 import mock JSON。
- `VITE_USE_MOCK_API=false` 時必須提供有效的 `VITE_API_BASE_URL`；正式環境必須使用 HTTPS。
- REST 回應必須經 `src/api/validators.ts` 做 runtime validation，不能只使用 TypeScript assertion。
- 非同步頁面應維持 loading、error、retry、AbortSignal 與 stale request 防護；新增平行請求時要確認單一非關鍵請求失敗是否會拖垮整頁。
- Mock 與 REST 模式的回傳語意必須一致，尤其是排序、篩選、空資料及錯誤狀態。

### 認證與儲存

- 認證狀態可能存於 sessionStorage 或 localStorage；讀取 token 與 user、登出及 401 清除流程必須使用一致來源。
- Storage 操作應走 `src/utils/storage.ts` 或認證專用封裝，並處理 storage 不可用、資料損壞與跨分頁狀態。
- 修改登入導頁時，確認登入成功後記憶體中的 user state 會立即刷新，不能只寫入 storage。
- Refresh token 不可暴露給前端 JavaScript，應由 Secure、HttpOnly cookie 傳遞。

### 付款與外部內容

- `payment`、`reference` 與第三方回跳參數是不可信輸入；付款成功只能由後端查詢或 webhook 確認。
- 不可只依前端 query 顯示付款成功、清空購物車或授予會員權限。
- 外部 HTML 顯示前必須經 DOMPurify sanitize。
- 外部導頁必須使用 `getSafeExternalUrl` 或 `redirectToExternalUrl`，不可直接信任 API 或 query 提供的 URL。

### UI 與 RWD 高風險區域

- Tailwind 使用 v4；自訂 token 位於 `src/index.css` 的 `@theme`，不是 `tailwind.config.js`。
- Header 是 fixed。一般內容頁手機版需保留約 `pt-[190px]`；不要用 `pt-16`、`pt-24` 或 `pt-32` 清除完整手機 Header。
- `HomeAccordion` 手機版 header 間距由 ResizeObserver 動態量測並以 inline `paddingTop` 套用，不應再疊加 Tailwind `pt-*`。
- `HomeAccordion` 手機版面板垂直展開；桌面版以 CSS `flex` transition 與 hover 控制。不要加入 JS hover state 或改用 `width` transition。
- `GlobalBottomAd` 為 fixed bottom 元件。新增或修改頁面時，確認內容 bottom padding 足夠，並檢查 `App.tsx` 的排除條件。
- 改動 Header、選單或分類頁時，要驗證滑鼠、觸控、click-outside、選定項目與實際路由/篩選結果一致。

### 部署不變條件

- Vite `base: './'` 是子路徑部署需求，不可改回絕對 `/`。
- 正式部署需使用最新 `dist/`，並保留相對 asset URL。
- CSP 位於 `index.html`；新增外部字型、圖片、影片、iframe 或 API 網域時，確認 CSP 同步允許且範圍不過寬。
- API 契約見 `docs/api-contract.md`，部署與安全要求見 `docs/security.md`。

## 變更類型檢查表

### 路由／導航

- 直接開啟 URL、程式內導航、重新整理及瀏覽器上一頁結果是否一致？
- 是否保留或清除不相容的 route fields？
- 未知或惡意 query 是否被安全拒絕？

### 列表／篩選／輪播

- category 或資料集改變後，index、filter、pagination 是否仍在有效範圍？
- 空陣列、少量資料、重複 ID 與請求失敗是否安全？
- 選單顯示的選項是否真的傳入路由或篩選邏輯，而非全部導向同一結果？

### 登入／會員

- 登入、註冊、社群登入、登出及 401 是否同步更新 UI 與 storage？
- 「記住我」是否正確切換持久與分頁 session，並清除另一份舊資料？
- 未登入使用者是否無法進入受保護內容？登入後是否返回正確且可信的站內路由？

### API／非同步

- AbortError、逾時、非 JSON 回應、4xx/5xx 與 malformed payload 是否有明確處理？
- 可選資料失敗時是否合理降級？必要資料失敗時是否顯示可重試錯誤？
- 新增的多次 API 呼叫是否造成明顯的 N+1、重複請求或正式環境負載問題？

### 視覺／互動

- 手機與桌面是否都不被 fixed Header 或 Bottom Ad 遮住？
- 新增 dropdown、modal、drawer 是否能關閉，且不會被 overflow 或 z-index 隱藏？
- 可互動元素是否能以鍵盤操作，並具備必要的 label？

## 驗證指令

基本檢查：

```bash
npm run lint
npm test
npm run build
```

路由、表單、Header、登入、互動或部署相關差異，再執行：

```bash
npm run test:e2e
```

- 若檢查因 sandbox、瀏覽器或環境限制無法執行，需明確說明，不可宣稱通過。
- 區分由本次差異造成的失敗、既有失敗及環境失敗。
- CI 在 push / pull request 會重跑 lint、單元測試、build、E2E 與 `npm audit`；必要檢查失敗即視為部署阻擋。
