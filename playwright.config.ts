import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', testIgnore: /epaper-rest\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', testIgnore: /epaper-rest\.spec\.ts/, use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    {
      name: 'epaper-rest',
      testMatch: /epaper-rest\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:3002' },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      // REST mode is only used by epaper-rest.spec.ts, which stubs every /api/* call via page.route —
      // it never reaches a real backend, but exercising USE_MOCK_API=false is required to prove that
      // requests actually happen over the network (mock-mode functions never call fetch at all).
      command: 'VITE_USE_MOCK_API=false VITE_API_BASE_URL=http://127.0.0.1:3002 npx vite --port=3002 --host=0.0.0.0',
      url: 'http://127.0.0.1:3002',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
