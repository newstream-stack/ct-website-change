# CLAUDE.md — ct-website-change (IMPACT 論壇報)

## 專案概述

IMPACT 論壇報的前端重設計原型。SPA 架構，無後端，所有路由/狀態皆在前端。

---

## Tech Stack

| 層級 | 技術 |
|------|------|
| 框架 | React 18 + TypeScript |
| 打包 | Vite |
| 樣式 | **Tailwind CSS v4** + Vanilla CSS (`src/index.css`) |
| 字體 | Google Fonts：Noto Sans TC、Noto Serif TC、Oswald、Playfair Display |
| Icon | Font Awesome 6 (CDN，`index.html` 引入) |

> ⚠️ 使用的是 **Tailwind v4**，不是 v3。`@theme` 取代舊版 `tailwind.config.js`，自訂 CSS 變數直接寫在 `index.css` 的 `@theme {}` block。

---

## 路由 / 頁面架構

路由是純前端 state，**沒有 React Router**。`App.tsx` 管理所有狀態：

```
currentCategory (string) + currentArticleId (number | null)
    │
    ├── '首頁' + no article → <HomeAccordion>
    ├── NEWS_CATEGORIES + no article → <CategoryList>
    ├── any + articleId → <ArticleDetail>
    ├── '信仰好物' → <ProductGallery>
    └── '訂報' | '奉獻' → <ActionPage>
```

URL 通過 `window.history.pushState` 同步（`?category=xxx&article=123`），支援瀏覽器上一頁。

---

## 目錄結構

```
src/
├── App.tsx              # 路由邏輯 + 全域主題切換
├── main.tsx
├── index.css            # 全域 CSS：@theme、Accordion 動畫、RWD
├── data.ts              # MockData：NewsItem[]、AdItem、分類設定
├── components/
│   ├── Header.tsx           # Fixed 頂部導覽，含 mobile actions bar + category bar
│   ├── GlobalBottomAd.tsx   # Fixed 底部廣告條
│   ├── FullscreenMenu.tsx   # 手機全螢幕選單
│   ├── InlineArticleBanner.tsx
│   ├── NativeAdCard.tsx
│   └── StickySidebarAd.tsx
└── pages/
    ├── HomeAccordion.tsx    # 首頁核心：全螢幕手風琴 + carousel
    ├── CategoryList.tsx     # 分類文章列表
    ├── ArticleDetail.tsx    # 文章閱讀頁
    ├── ActionPage.tsx       # 訂報 / 奉獻頁
    ├── ProductGallery.tsx   # 信仰好物頁（橫向 scroll gallery）
    ├── LoginPage.tsx
    ├── MemberDashboard.tsx
    ├── EventRegistrationPage.tsx
    ├── ImpactAlliancePage.tsx
    ├── MembershipPage.tsx
    └── DonationGallery.tsx
```

---

## 主題系統

### CSS 變數（`index.css` 的 `@layer base`）

```css
:root {
  --bg-base: 255 255 255;   /* light mode */
  --text-base: 10 10 10;
}
.dark {
  --bg-base: 10 10 10;      /* dark mode */
  --text-base: 255 255 255;
}
```

在 Tailwind 使用：`bg-theme-bg`、`text-theme-text`、`border-theme-text/10` 等。

### 品牌色
- `--color-brand-red: #C62828` → Tailwind class: `bg-brand-red`、`text-brand-red`

### Dark mode 切換
`App.tsx` 的 `toggleTheme` 在 `document.documentElement` 上加/移除 `.dark` class。

---

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
  const header = document.querySelector('header') as HTMLElement | null;
  const applyPt = () => {
    const c = containerRef.current;
    if (!c) return;
    if (window.innerWidth < 768) {
      c.style.paddingTop = `${header?.offsetHeight ?? 170}px`;
    } else {
      c.style.paddingTop = '';
    }
  };
  applyPt();
  const ro = header ? new ResizeObserver(applyPt) : null;
  if (ro && header) ro.observe(header);
  window.addEventListener('resize', applyPt, { passive: true });
  return () => { ro?.disconnect(); window.removeEventListener('resize', applyPt); };
}, []);
```
**不要改回 `pt-[Npx]` 的靜態寫法**，會在不同裝置上跑版。

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

### 底部 padding（清除 GlobalBottomAd）
GlobalBottomAd 是 `fixed bottom-0`，高度：`md:py-4` 時約 **74px**。
content-expanded 的底部 padding 必須大於這個值：
```tsx
// 手機: pb-6 (accordion-container 本身已有 pb-[136px])
// 平板: md:pb-20 (80px > 56px ad)
// 桌機: lg:pb-24 (96px > 74px ad)
```

---

## GlobalBottomAd

- `fixed bottom-0 z-50`，高度估算：手機 ~56px，桌機 ~74px
- **`GlobalBottomAd` 不在 `訂報`、`奉獻`、`信仰好物` 頁顯示**（`App.tsx` 第 125 行）
- 其他頁面的內容底部必須留足夠 padding 避免被遮

---

## 資料結構（`src/data.ts`）

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
  content?: string; // HTML string，只有 id:1 有真實內容
}
```

### MOCK_NEWS 分組
Accordion 每個面板對應 5 筆，共 5 面板（+ 1 個 AD 面板）：
- Panel 1（index 0）：最新文章，items id 1,7,8,9,10
- Panel 2（index 1）：專欄，items id 2,11,12,13,14
- Panel 3（index 2）：人物見證，items id 3,15,16,17,18
- Panel 4（index 3）：生活情報，items id 4,19,20,21,22
- Panel 5（index 4）：信仰知識庫，items id 5,23,24,25,6

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
- `'信仰好物'` → ProductGallery
- `'訂報'` | `'奉獻'` → ActionPage
- `'會員中心'` → 目前無實作（placeholder）

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

6. **`accordion-container` 的 padding-top 是 inline style（ResizeObserver 寫入）**，覆蓋優先度高於 Tailwind class，不要在 className 同時加 `pt-[Npx]` 造成衝突。

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
- 色調：白底黑字 light mode，黑底白字 dark mode，品牌紅（#C62828）作為 accent
- 圖片盡量保持 `grayscale opacity-70`，hover/active 時轉全彩——這是整站的視覺語言
