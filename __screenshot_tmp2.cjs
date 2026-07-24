const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto('http://localhost:3001/?category=%E6%9C%80%E6%96%B0%E6%96%87%E7%AB%A0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // close any modal/close buttons
  const closeButtons = await page.locator('button:has(svg), button.close, [aria-label="close"], [aria-label="Close"]').all();
  for (const btn of await page.$$('button')) {
    const text = await btn.innerText().catch(() => '');
  }
  await page.keyboard.press('Escape').catch(() => {});
  // try clicking any X icon buttons near top
  const xButtons = await page.locator('button').all();
  for (const b of xButtons) {
    try {
      const box = await b.boundingBox();
      if (box && box.width < 60 && box.height < 60) {
        await b.click({ timeout: 500 }).catch(() => {});
      }
    } catch (e) {}
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/private/tmp/claude-502/-Users-work-Desktop-codeing-ct-website-change/0269f491-481a-4601-bf3b-705591410154/scratchpad/category-list2.png' });
  await browser.close();
})();
