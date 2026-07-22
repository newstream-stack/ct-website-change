# AGENTS.md — ct-website-change (IMPACT 論壇報)

## 專案概述

IMPACT 論壇報的前端重設計原型。SPA 架構，目前以 mock API 運作，並可透過環境設定切換 REST 後端。

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

---

## 路由 / 頁面架構

路由是純前端 state，**沒有 React Router**。`src/routing.ts` 負責解析／產生 query string，`App.tsx` 負責畫面切換：

```
AppRoute
├── category
├── articleId / tag / author
├── planId / productId
└── paymentType / paymentReference
    │
    ├── '首頁' + no article → <HomeAccordion>
    ├── 一般 NEWS_CATEGORIES → <CategoryList>
    ├── '專欄' / '影響力聯盟' / '信仰知識庫' → 各自專用頁
    ├── articleId / tag / author → 文章、標籤或作者結果頁
    ├── '信仰好物' → <ProductGallery> / <ProductDetail>
    ├── '訂報' → <ActionPage>
    ├── '奉獻' → <DonationGallery> / <DonationPlanDetail>
    ├── '會員中心' / '會員招募' / '會員專區' → 登入、招募或會員儀表板
    ├── paymentType → <PaymentResultPage>
    └── 其他特殊分類 → 活動與一般資訊頁
```

URL 透過 `window.history.pushState` 同步，支援 `category`、`article`、`tag`、`author`、`plan`、`product`、`payment`、`reference` 與瀏覽器上一頁。所有輸入都必須經過 `readRoute()` 驗證，不要直接信任 query string。

---

## 目錄結構

```
src/
├── App.tsx              # 頁面切換、購物車與全域 UI 狀態
├── routing.ts           # Query route 解析、驗證與產生
├── main.tsx
├── index.css            # 全域 CSS：@theme、Accordion 動畫、RWD
├── api/                 # Mock / REST 共用的非同步資料存取層
├── components/
│   ├── Header.tsx       # Fixed 頂部導覽，含 mobile actions bar + category bar
│   ├── GlobalBottomAd.tsx
│   └── 共用 UI、Modal、廣告與商品／奉獻詳情元件
├── data/                # JSON mock 內容與 index.ts 匯出
├── hooks/               # 非同步資料、登入、輪播與 YouTube hooks
├── mocks/               # 非 JSON 的會員、活動、方案與首頁 mock
├── pages/
│   ├── HomeAccordion.tsx    # 首頁核心：手風琴 + carousel
│   ├── CategoryList.tsx     # 分類文章列表
│   ├── ArticleDetail.tsx    # 文章閱讀頁
│   ├── ActionPage.tsx       # 訂報方案展示
│   ├── ProductGallery.tsx   # 信仰好物頁（橫向 scroll gallery）
│   └── 會員、奉獻、活動、付款結果與一般資訊頁
├── types/               # 依領域拆分的共用型別；types.ts 為相容 barrel
└── utils/               # 安全導頁、storage 與 auth event 工具
```

根目錄另有 `tests/`（單元測試）、`e2e/`（Playwright）、`docs/`（API／資安文件）及 `.github/workflows/`（CI）。

---

## 主題系統

目前只有單一淺色主題，沒有 dark mode 切換。`theme-*` 命名仍作為設計 token 使用，避免各元件硬寫顏色。

### CSS 變數（`index.css` 的 `@layer base`）

```css
:root {
  --bg-base: 253 252 250;
  --text-base: 10 10 10;
}
```

在 Tailwind 使用：`bg-theme-bg`、`text-theme-text`、`border-theme-text/10` 等。

### 品牌色
- `--color-brand-red: #C62828` → Tailwind class: `bg-brand-red`、`text-brand-red`

## 固定 Header 高度（RWD 關鍵）

Header 是 `position: fixed; z-index: 40`。各頁面的 **top padding 必須清過 header**。

### Header 各行高度（iPhone 15 Pro / 393px 寬）

| 行 | class | 估算高度 |
|----|-------|---------|
| 頂部廣告條 | `py-1.5` | ~26px |
| Logo + 導覽列 | `p-3` | ~60px |
| Mobile actions bar（信仰好物/訂閱/奉獻）| `pb-3.5` | ~34px |
| Category bar（`showCategoryBar` 時）| `py-2.5` | ~39px |
| Header `pb-1` | | ~4px |
| **總計** | | **~163–175px** |

### 各頁面 top padding 規範

| Component | Mobile | Desktop |
|-----------|--------|---------|
| `HomeAccordion` | **動態**（ResizeObserver） | `md:pt-0`（圖片從頂部滿版） |
| `CategoryList` | `pt-[190px]` | `md:pt-48` |
| `ActionPage` | `pt-[190px]` | `md:pt-0` |
| `ProductGallery` | `pt-[190px]` | `md:pt-32` |
| `ArticleDetail` | 無（hero 圖片全螢幕，header 疊在上面是刻意設計） | — |

> ⚠️ **不要用 `pt-16`（64px）或 `pt-24`（96px）當手機 header 清除值**，會跑版。安全值為 `pt-[190px]`。

---

## HomeAccordion — 核心元件

### 動態 Header 高度
```tsx
useLayoutEffect(() => {
  const update = () => {
    const header = document.querySelector('header');
    if (header) setHeaderHeight(header.offsetHeight);
    setIsMobileLayout(window.innerWidth < 768);
  };
  update();
  window.addEventListener('resize', update);
  const observer = new ResizeObserver(update);
  const header = document.querySelector('header');
  if (header) observer.observe(header);
  return () => {
    window.removeEventListener('resize', update);
    observer.disconnect();
  };
}, []);
```
容器透過 `style={{ paddingTop: isMobileLayout ? `${headerHeight}px` : 0 }}` 套用量測值。**不要改回 `pt-[Npx]` 的靜態寫法**，也不要同時加 Tailwind `pt-*` 與 inline padding。

### Accordion RWD 與動畫原理
- 手機（<768px）：面板垂直堆疊，全部顯示 expanded content；每個面板至少 `62dvh`
- 桌機（≥768px）：面板橫向排列，inactive `flex: 1`、active / hover `flex: 7`
- 桌機以 `flex` 屬性變化驅動展開／收合，CSS `transition: flex 0.65s cubic-bezier(...)`
- **不要用 `width:` 過渡，也不要在手機恢復收合式 flex 行為**

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
<div className="min-h-[5.5rem] md:min-h-[10rem] lg:min-h-[12rem] overflow-hidden">

// Excerpt — 手機自動高度，桌機固定高度
<div className="h-auto md:h-[4.5rem] overflow-visible md:overflow-hidden">
```

### 底部 padding（清除 GlobalBottomAd）
GlobalBottomAd 是 `fixed bottom-0`，高度：`md:py-4` 時約 **74px**。
content-expanded 的底部 padding 必須大於這個值：
```tsx
// 手機: accordion-container 本身已有 padding-bottom: 136px
// 平板: md:pb-20 (80px > 56px ad)
// 桌機: lg:pb-24 (96px > 74px ad)
```

---

## GlobalBottomAd

- `fixed bottom-0 z-50`，高度估算：手機 ~56px，桌機 ~74px
- 顯示條件集中在 `App.tsx` 的 `<GlobalBottomAd>` render condition；商務、會員、活動與一般資訊頁目前都排除
- 新增特殊頁面時，必須同步確認是否加入排除清單；不要依賴容易失效的固定行號
- 其他頁面的內容底部必須留足夠 padding 避免被遮

---

## 資料與 API 架構

- `src/data/*.json`：新聞、廣告、商品、專欄作者、聯盟與訂報 mock 資料
- `src/data/index.ts`：靜態資料的型別化匯出與 `NEWS_CATEGORIES`
- `src/mocks/`：首頁影音／廣告、奉獻、活動、會員與會員方案 mock
- `src/api/`：頁面唯一的資料存取入口；頁面不要直接 import mock JSON
- `src/types/`：領域型別；舊引用可暫時透過 `src/types.ts` barrel

### NewsItem
```ts
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string; // 對應 NEWS_CATEGORIES
  author: string;
  date: string;     // 'APR 11' 格式
  imageUrl: string; // Unsplash URL 或 ct.org.tw 圖片
  content?: string; // 顯示前必須經 DOMPurify sanitize
  subCategory?: string;
  tags?: string[];
}
```

### HomeAccordion 面板組合
- 每個 news panel 使用 5 筆文章，最多建立 5 組
- 第 3 個 news panel 後插入 video panel（有影音資料時）
- 第 4 個 news panel 後插入 accordion ad（有廣告資料時）
- 因此完整 mock 通常為 **5 news + 1 video + 1 ad = 7 panels**
- 面板由 `buildPanels()` 動態建立，不要在文件或 UI 寫死文章 ID

### MOCK_ADS slots
`infeed` | `inline` | `sidebar` | `accordion` | `header`

---

## 分類系統

```ts
export const NEWS_CATEGORIES = [
  '最新文章', '基督教論壇報', '人物見證', '專欄',
  '影響力聯盟', '生活情報', '信仰知識庫'
];
```

特殊分類（不走 CategoryList）：
- `'首頁'` → HomeAccordion
- `'專欄'` → ColumnPage
- `'影響力聯盟'` → ImpactAlliancePage
- `'信仰知識庫'` → KnowledgeBasePage
- `'信仰好物'` → ProductGallery / ProductDetail
- `'訂報'` → ActionPage
- `'奉獻'` → DonationGallery / DonationPlanDetail
- `'會員中心'` → LoginPage（登入／註冊）
- `'會員招募'` → MembershipPage
- `'會員專區'` → MemberDashboard；未登入時顯示 LoginPage
- `'活動報名'` 與一般資訊分類 → 各自專用頁
- 付款回跳由 `payment` + `reference` query 進入 PaymentResultPage，前端 query 不可直接判定付款成功

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

4. **不要用 `pt-16/24/32` 當手機 header 清除**，header 在顯示 mobile actions bar + category bar 時高達 ~175px。使用 `pt-[190px]` 或動態量測。

5. **`bg-theme-bg/85` 在 inactive 面板會把圖片洗白**——現在改用 `bg-black/50`，使圖片暗但不失色彩。

6. **`accordion-container` 的 padding-top 由 ResizeObserver → React state → inline style 套用**，覆蓋優先度高於 Tailwind class，不要在 className 同時加 `pt-[Npx]` 造成衝突。

7. **正式 build 預設仍使用 mock API**。只有明確設定 `VITE_USE_MOCK_API=false` 才進 REST；此時必須同時提供有效且正式環境為 HTTPS 的 `VITE_API_BASE_URL`。

8. **Vite `base: './'` 是部署必要設定**，讓 `/assets` 在網域子路徑也能載入。不要改回絕對 `/`，否則部分主機會白畫面。

9. **付款成功只能由後端查詢／webhook 確認**。`payment`、`reference` 或第三方回跳 query 都是不可信輸入，不能單靠前端參數清空購物車或顯示成功。

10. **外部 HTML 與 URL 必須走既有安全工具**。文章 HTML 使用 DOMPurify；外部導頁使用 `getSafeExternalUrl` / `redirectToExternalUrl`；local/session storage 使用 `utils/storage.ts` 的驗證函式。

---

## API、部署與資安

### 前端確認／mock 模式（目前預設）
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=
```

### REST 模式
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.example.com
```

- 頁面只能呼叫 `src/api/`，由 API 層依環境切換 mock / REST
- `useAsyncData` 統一處理 loading、error、retry、AbortSignal 與 stale request
- REST 回應必須經 `src/api/validators.ts` runtime validation，不能只靠 TypeScript assertion
- 正式部署必須上傳最新 `dist/`，並保留相對 asset URL
- CSP 目前寫在 `index.html`；正式主機應再以 HTTP response headers 設定 CSP、HSTS、`X-Content-Type-Options` 等
- API 契約見 `docs/api-contract.md`，部署資安見 `docs/security.md`

---

## Dev 指令

```bash
npm run dev       # 開發（Vite HMR，port 3000）
npm run lint      # TypeScript type check
npm test          # tsx + Node test runner 單元測試
npm run test:e2e  # Playwright 桌機／手機 Chromium E2E
npm run build     # 生產打包
npm run preview   # 預覽 dist（需先 build）
```

提交前至少執行 `npm run lint && npm test && npm run build`；路由、表單、Header、互動或部署相關修改需再跑 `npm run test:e2e`。CI 會在 push / pull request 重跑以上檢查與 `npm audit`。

---

## 設計原則

- **行動優先（Mobile First）**，但 HomeAccordion 的 hover 互動是桌機專屬
- 字體：heading 用 `font-serif`（Noto Serif TC）、UI label 用 `font-display`（Oswald）、內文用 `font-sans`（Noto Sans TC）
- 色調：米白底黑字的單一主題，品牌紅（#C62828）作為 accent
- 圖片盡量保持 `grayscale opacity-70`，hover/active 時轉全彩——這是整站的視覺語言


# Review Rules

Review ONLY the current git diff.

Assume the author is a competent senior engineer.

Do not optimize for the number of review comments.
Optimize for correctness.

Only request changes if the issue would block a production deployment.

Ignore:
- Formatting
- Naming
- Style
- Optional refactoring

Focus on:
- Correctness
- Security
- Reliability
- Performance
- Edge cases
- Error handling
- Backward compatibility

Rules:
- Only report issues supported by evidence in the current diff.
- Do not speculate about code you cannot see.
- Prefer false negatives over false positives.
- Never manufacture review comments.

If there are no production-impacting issues, approve the change.