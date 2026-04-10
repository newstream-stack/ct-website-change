# CT-Website-Change (News Media Platform)

基於 Vite + React + TypeScript 構建的新聞媒體前端專案。核心需求：文章展示、分類導覽、響應式 (Mobile First)、深淺色模式切換。

## 🛠 Tech Stack
- React 18 (Vite)
- TypeScript (Strict)
- Tailwind CSS v4
- Font Awesome (CDN)
- Motion (Animations)

## 📁 Project Structure (AI Navigation Map)
- `src/components/`: 核心 UI
  - `Header.tsx`: 頂部導覽列 (含深淺切換、全螢幕選單觸發、水平滾動分類)。
  - `ActionPage.tsx` / `ArticleDetail.tsx`: 文章內頁主要視圖。
  - `HomeAccordion.tsx`: 首頁折疊式新聞列表。
  - `CategoryList.tsx`: 分類清單展示。
  - `ProductGallery.tsx`: 圖庫與專題展示。
  - `FullscreenMenu.tsx`: 手機版側邊選單。
- `src/data.ts`: **Core Data**。包含靜態分類、Mock Data 與全域 TypeScript Interfaces。修改 UI 前必查。
- `src/App.tsx`: 路由與佈局容器。
- `src/index.css`: Tailwind 指令與全域 CSS 變數 (深色主題基準)。

## 💡 Rules for AI Agent
1. **Component:** 僅使用 React Functional Components。
2. **Typing:** 嚴格 TS，禁止 `any`。所有共用型別統一從 `src/data.ts` 引入。
3. **Styling:** 嚴格使用 Tailwind CSS。桌面版特殊排版僅使用 `md:` (≧768px) 斷點覆寫。
4. **Context:** 變動 `Header.tsx` 時，絕對不可破壞 `isDarkMode` 切換邏輯。

## 🎯 Current Focus
- 修復手機版觸控設備對 `:hover` 產生的異常預設樣式。
- 優化新聞分類的 Mobile 互動 (左右滑動、折疊)。
- 為未來串接真實 RESTful API 預留乾淨的資料注入點。