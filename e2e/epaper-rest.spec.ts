import { expect, test, type Page, type Route } from '@playwright/test';

async function closeSplash(page: Page) {
  const closeButton = page
    .getByRole('dialog', { name: '贊助廣告' })
    .getByRole('button', { name: '關閉廣告' });
  if (await closeButton.isVisible()) await closeButton.click();
}

// This spec runs against the REST-mode dev server (see the "epaper-rest" project in
// playwright.config.ts). Unlike the default mock-API server used by app.spec.ts, USE_MOCK_API is
// false here, so every src/api/*.ts call goes over the network and can be observed/stubbed with
// page.route. That's required to actually catch a regression where an epaper data hook fires
// before its auth/subscription gate — in mock mode those functions read local data and never
// touch the network, so a network-request assertion there can never fail.

const LOGGED_IN_USER = { id: 'u1', name: '測試會員', email: 'test@example.com' };

function jsonRoute(route: Route, status: number, body: unknown) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

async function loginAs(page: Page, user: typeof LOGGED_IN_USER) {
  await page.addInitScript((u) => {
    sessionStorage.setItem('auth_token', 'fake-token');
    sessionStorage.setItem('auth_user', JSON.stringify(u));
  }, user);
}

async function stubApi(page: Page, handlers: {
  me?: (route: Route) => Promise<void> | void;
  issues?: (route: Route) => Promise<void> | void;
  issue?: (route: Route, issueNumber: number) => Promise<void> | void;
}) {
  // Match on the request pathname, not a glob: a glob like '**/api/**' also matches Vite's own
  // dev-server module requests (e.g. /src/api/auth.ts), 404-ing those breaks the module graph and
  // the app never renders. Real REST calls all resolve to an absolute /api/... pathname.
  const isApiPath = (url: URL) => url.pathname.startsWith('/api/');

  // Broad fallback first: anything under /api/* that isn't explicitly stubbed (header ads, home
  // featured content, etc.) resolves immediately as "not found" instead of hanging on a real
  // fetch that will never answer, which would otherwise blow past the default request timeout.
  await page.route(isApiPath, (route) => jsonRoute(route, 404, { message: 'not stubbed in test' }));

  if (handlers.me) await page.route((url) => url.pathname === '/api/me', (route) => handlers.me!(route));
  if (handlers.issues) await page.route((url) => url.pathname === '/api/epaper/issues', (route) => handlers.issues!(route));
  if (handlers.issue) {
    await page.route(
      (url) => /^\/api\/epaper\/issues\/\d+$/.test(url.pathname),
      (route) => handlers.issue!(route, Number(route.request().url().match(/\/api\/epaper\/issues\/(\d+)$/)![1])),
    );
  }
}

function trackApiRequests(page: Page, pattern: RegExp) {
  const seen: string[] = [];
  page.on('request', (request) => {
    const { pathname } = new URL(request.url());
    if (pattern.test(pathname)) seen.push(pathname);
  });
  return seen;
}

const activeMember = {
  name: '測試會員',
  displayName: '測試會員',
  email: 'test@example.com',
  address: '台北市',
  subscription: { plan: '訂閱方案', price: 300, nextBillingDate: '2026-08-01', status: 'active' },
};

test('未登入不會呼叫 /api/me 或 /api/epaper/*，並顯示登入提示', async ({ page }) => {
  const seen = trackApiRequests(page, /^\/api\/(me|epaper\/)/);
  await stubApi(page, {});

  await page.goto('/?category=%E5%85%A8%E7%89%88%E9%96%B1%E8%AE%80');
  await expect(page.getByRole('heading', { name: '請先登入會員' })).toBeVisible();
  expect(seen).toEqual([]);
});

test('已登入但未訂閱時顯示訂閱提示，且不會呼叫期數 API', async ({ page }) => {
  const seen = trackApiRequests(page, /^\/api\/epaper\//);
  await loginAs(page, LOGGED_IN_USER);
  await stubApi(page, {
    me: (route) => jsonRoute(route, 200, { ...activeMember, subscription: { ...activeMember.subscription, status: 'expired' } }),
  });

  await page.goto('/?category=%E5%85%A8%E7%89%88%E9%96%B1%E8%AE%80');
  await expect(page.getByRole('heading', { name: '訂閱後即可閱讀全版' })).toBeVisible();
  expect(seen).toEqual([]);
});

test('訂閱中的會員可翻頁、切換期數並重置到第一頁', async ({ page }) => {
  await loginAs(page, LOGGED_IN_USER);
  await stubApi(page, {
    me: (route) => jsonRoute(route, 200, activeMember),
    issues: (route) => jsonRoute(route, 200, [
      { issueNumber: 2, dateLabel: '第 2 期' },
      { issueNumber: 1, dateLabel: '第 1 期' },
    ]),
    issue: (route, issueNumber) => jsonRoute(route, 200, {
      issueNumber,
      dateLabel: `第 ${issueNumber} 期`,
      pages: issueNumber === 2
        ? [{ pageNumber: 1, imageUrl: 'https://example.com/2-1.jpg' }, { pageNumber: 2, imageUrl: 'https://example.com/2-2.jpg' }]
        : [{ pageNumber: 1, imageUrl: 'https://example.com/1-1.jpg' }],
    }),
  });

  await page.goto('/?category=%E5%85%A8%E7%89%88%E9%96%B1%E8%AE%80');
  await closeSplash(page);
  const issueToggle = page.getByRole('button', { name: /第 \d+ 期/ }).first();
  await expect(issueToggle).toHaveText('第 2 期');
  await expect(page.getByText('1 / 2')).toBeVisible();

  await page.getByRole('button', { name: '下一頁' }).first().click();
  await expect(page.getByText('2 / 2')).toBeVisible();

  await issueToggle.click();
  await page.getByRole('button', { name: '第 1 期', exact: true }).click();
  await expect(issueToggle).toHaveText('第 1 期');
  await expect(page.getByText('1 / 1')).toBeVisible();
});

test('期數清單為空時顯示對應訊息而非永久 Loading', async ({ page }) => {
  await loginAs(page, LOGGED_IN_USER);
  await stubApi(page, {
    me: (route) => jsonRoute(route, 200, activeMember),
    issues: (route) => jsonRoute(route, 200, []),
  });

  await page.goto('/?category=%E5%85%A8%E7%89%88%E9%96%B1%E8%AE%80');
  await expect(page.getByText('目前沒有可閱讀的期數')).toBeVisible();
  await expect(page.getByRole('button', { name: '重新載入' })).toBeVisible();
});

for (const status of [403, 404, 500]) {
  test(`期數內容 API 回傳 ${status} 時顯示錯誤而非永久 Loading`, async ({ page }) => {
    await loginAs(page, LOGGED_IN_USER);
    await stubApi(page, {
      me: (route) => jsonRoute(route, 200, activeMember),
      issues: (route) => jsonRoute(route, 200, [{ issueNumber: 1, dateLabel: '第 1 期' }]),
      issue: (route) => jsonRoute(route, status, { message: '模擬錯誤' }),
    });

    await page.goto('/?category=%E5%85%A8%E7%89%88%E9%96%B1%E8%AE%80');
    await expect(page.getByText('資料載入失敗')).toBeVisible();
    await expect(page.getByRole('button', { name: '重新載入' })).toBeVisible();
  });
}
