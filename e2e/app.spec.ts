import { expect, test, type Page } from '@playwright/test';

async function closeSplash(page: Page) {
  const closeButton = page
    .getByRole('dialog', { name: '贊助廣告' })
    .getByRole('button', { name: '關閉廣告' });
  if (await closeButton.isVisible()) await closeButton.click();
}

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:3000)/, (route) => route.abort());
});

test('首頁可載入並顯示文章面板', async ({ page }) => {
  await page.goto('/');
  await closeSplash(page);

  await expect(page.locator('.accordion-panel').first()).toBeVisible();
  await expect(page.getByText('城市綠洲：教會空間改造的社區影響力').first()).toBeVisible();
});

test('分類與文章網址可直接開啟', async ({ page }) => {
  await page.goto('/?category=%E6%9C%80%E6%96%B0%E6%96%87%E7%AB%A0');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: '最新文章', exact: true })).toBeVisible();

  await page.goto('/?category=%E5%9F%BA%E7%9D%A3%E6%95%99%E8%AB%96%E5%A3%87%E5%A0%B1&article=1');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: /從呼召辨識到AI時代神學院裝備/ })).toBeVisible();
});

test('未知路由顯示 404', async ({ page }) => {
  await page.goto('/?category=not-a-real-page');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: '找不到這個頁面' })).toBeVisible();
});

test('未登入不能直接進會員專區', async ({ page }) => {
  await page.goto('/?category=%E6%9C%83%E5%93%A1%E5%B0%88%E5%8D%80');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: '會員登入' })).toBeVisible();
});

test('未登入不能直接進全版閱讀，也不會被要求先進 API', async ({ page }) => {
  const blockedRequests: string[] = [];
  page.on('request', (request) => {
    const { pathname } = new URL(request.url());
    if (/^\/api\/(me|epaper\/)/.test(pathname)) blockedRequests.push(pathname);
  });

  await page.goto('/?category=%E5%85%A8%E7%89%88%E9%96%B1%E8%AE%80');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: '請先登入會員' })).toBeVisible();
  expect(blockedRequests).toEqual([]);
});

test('偽造付款回跳不會被視為成功', async ({ page }) => {
  await page.goto('/?payment=order&reference=FORGED-REFERENCE&status=paid&success=true');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: '等待付款確認' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '交易已確認' })).toHaveCount(0);
});

test('未選擇規格前無法加入購物車', async ({ page }) => {
  await page.goto('/?category=%E4%BF%A1%E4%BB%B0%E5%A5%BD%E7%89%A9&product=1');
  await closeSplash(page);
  await expect(page.getByRole('heading', { name: '【禱告卡片書】信心・盼望・愛的旅程卡' })).toBeVisible();
  await expect(page.getByRole('button', { name: '加入購物車' })).toBeDisabled();
});

test('選擇規格後可加入購物車，且選擇的規格會顯示在購物車中', async ({ page }) => {
  await page.goto('/?category=%E4%BF%A1%E4%BB%B0%E5%A5%BD%E7%89%A9&product=1');
  await closeSplash(page);
  await page.getByRole('button', { name: '信心', exact: true }).click();
  await page.getByRole('button', { name: '加入購物車' }).click();
  await expect(page.getByRole('heading', { name: '購物車 (1)' })).toBeVisible();
  await expect(page.getByText('規格：信心')).toBeVisible();
});

test('購買數量上限依商品庫存而非固定 99', async ({ page }) => {
  await page.goto('/?category=%E4%BF%A1%E4%BB%B0%E5%A5%BD%E7%89%A9&product=2');
  await closeSplash(page);
  const increment = page.getByRole('button', { name: '增加購買數量' });
  for (let i = 0; i < 10; i += 1) {
    if (await increment.isDisabled()) break;
    await increment.click();
  }
  await expect(increment).toBeDisabled();
});

test('手機內容不會被固定 Header 遮住', async ({ page }) => {
  await page.goto('/?category=%E6%9C%80%E6%96%B0%E6%96%87%E7%AB%A0');
  await closeSplash(page);

  const headerBox = await page.locator('header').boundingBox();
  const headingBox = await page.getByRole('heading', { name: '最新文章', exact: true }).boundingBox();
  expect(headerBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 2);
});

test('所有公開頁面都能載入且不發生執行錯誤', async ({ page }) => {
  test.setTimeout(90_000);
  const categories = [
    '首頁',
    '最新文章',
    '基督教論壇報',
    '人物見證',
    '專欄',
    '影響力聯盟',
    '生活情報',
    '信仰知識庫',
    '信仰好物',
    '訂報',
    '奉獻',
    '會員中心',
    '會員招募',
    '活動報名',
    '全版閱讀',
    '關於我們',
    '新聞連絡',
    '我要投稿',
    '版權隱私權聲明',
    '財務報表',
    '客戶服務',
    '申請合作',
    '論壇Line貼圖',
    '祝福卡申辦/捐款',
  ];
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  for (const category of categories) {
    const url = category === '首頁' ? '/' : `/?category=${encodeURIComponent(category)}`;
    await page.goto(url);
    await closeSplash(page);
    await expect(page.locator('main')).toBeAttached();
    await expect(page.getByText('頁面暫時無法顯示')).toHaveCount(0);
  }

  expect(runtimeErrors).toEqual([]);
});

test('註冊時會阻擋不一致的密碼', async ({ page }) => {
  await page.goto('/?category=%E6%9C%83%E5%93%A1%E4%B8%AD%E5%BF%83');
  await closeSplash(page);
  await page.getByRole('button', { name: '立即註冊' }).click();

  await page.getByPlaceholder('真實姓名').fill('測試使用者');
  await page.getByPlaceholder('helloworld@example.com').fill('test@example.com');
  await page.locator('input[type="password"]').nth(0).fill('password123');
  await page.locator('input[type="password"]').nth(1).fill('password456');
  await page.getByPlaceholder('台北市大安區...').fill('台北市測試路一號');
  await page.getByRole('button', { name: /註冊帳號/ }).click();

  await expect(page.getByText('設定密碼與確認密碼不一致')).toBeVisible();
});

test('活動報名未選票種時不會送出', async ({ page }) => {
  await page.goto('/?category=%E6%B4%BB%E5%8B%95%E5%A0%B1%E5%90%8D');
  await closeSplash(page);
  await page.getByPlaceholder('王大明').fill('測試使用者');
  await page.getByPlaceholder('david@example.com').fill('test@example.com');
  await page.getByPlaceholder('0912-345-678').fill('0912-345-678');
  await page.locator('button:visible').filter({ hasText: '確認報名 Checkout' }).click();
  await expect(page.getByText('請先選擇票種')).toBeVisible();
});
