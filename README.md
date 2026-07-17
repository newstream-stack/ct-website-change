# CT-Website-Change (News Media Platform)

基於 Vite + React + TypeScript 構建的新聞媒體前端專案。核心需求：文章展示、分類導覽與響應式 Mobile First 介面。

## 🛠 Tech Stack
- React 19 (Vite)
- TypeScript
- Tailwind CSS v4
- Font Awesome (CDN)

## 📁 Project Structure (AI Navigation Map)
- `src/components/`: 核心 UI
  - `Header.tsx`: 頂部導覽列與水平滾動分類。
- `src/pages/`: 首頁、文章、分類、商品、會員與一般資訊頁。
- `src/data/`: 靜態分類與 Mock Data。
- `src/api/`: 非同步資料存取介面，可在 mock 與 REST API 間切換。
- `src/types/`: 共用 TypeScript 型別。
- `src/App.tsx`: 路由與佈局容器。
- `src/index.css`: Tailwind 指令與全域 CSS 變數。

## API mode

複製 `.env.example` 建立環境設定。後端尚未就緒時使用：

```env
VITE_USE_MOCK_API=true
```

切換正式 API 時設定：

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.example.com
```

頁面透過 `useAsyncData` 統一處理載入、錯誤、重試與取消請求。
TypeScript 已啟用 strict mode；金流與帳號交易使用後端 API，付款結果以後端 webhook 為準。

前後端端點與資料格式草案請參考 [`docs/api-contract.md`](docs/api-contract.md)。
資安措施與部署標頭請參考 [`docs/security.md`](docs/security.md)。

## Development checks

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

單元測試使用 Node 內建 test runner；E2E 使用 Playwright，涵蓋桌面與手機 Chromium。
GitHub Actions 會在 push 與 pull request 自動執行型別、單元測試、production build、套件漏洞掃描與 E2E；失敗時保留 Playwright trace、影片與截圖。

## 💡 Rules for AI Agent
1. **Component:** 僅使用 React Functional Components。
2. **Typing:** 使用 TypeScript；所有共用型別統一從 `src/types/` 引入。
3. **Styling:** 嚴格使用 Tailwind CSS。桌面版特殊排版僅使用 `md:` (≧768px) 斷點覆寫。

## 🎯 Current Focus
- 與後端確認 [`docs/api-contract.md`](docs/api-contract.md) 後切換正式 API。
- 補齊後端付款 webhook、OAuth redirect 與 refresh token 策略。
