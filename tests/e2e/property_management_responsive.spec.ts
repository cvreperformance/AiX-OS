import { test, expect } from '@playwright/test';

const viewports = [
  { width: 375, height: 812, name: 'Mobile iPhone Mini (375x812)' },
  { width: 390, height: 844, name: 'Mobile iPhone Pro (390x844)' },
  { width: 393, height: 852, name: 'Mobile iPhone 15 (393x852)' },
  { width: 1280, height: 720, name: 'Laptop Small (1280x720)' },
  { width: 1280, height: 800, name: 'Laptop Aspect (1280x800)' },
  { width: 1366, height: 768, name: 'Laptop Standard (1366x768)' },
  { width: 1440, height: 900, name: 'Desktop Mac (1440x900)' },
  { width: 1536, height: 960, name: 'Desktop High Res (1536x960)' },
];

test.describe('Property Management Responsive QA', () => {
  const baseUrl = process.env.TEST_TARGET_URL || 'http://localhost:3001';

  for (const vp of viewports) {
    test(`Dashboard & Property Controls at ${vp.name}`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Navigate to dashboard or login if required
      await page.goto(`${baseUrl}/dashboard/properties`, { waitUntil: 'domcontentloaded' });
      if (page.url().includes('/login')) {
        const emailInput = page.locator('input[type="email"], input[name="email"]');
        const passwordInput = page.locator('input[type="password"], input[name="password"]');
        const submitBtn = page.locator('button[type="submit"], button:has-text("Intră în cont"), button:has-text("Sign in")');

        if (await emailInput.isVisible()) {
          await emailInput.fill('testadmin.aixos@gmail.com');
          await passwordInput.fill('TestAdmin123456!');
          await submitBtn.click();
          await expect(page).not.toHaveURL(/\/login/, { timeout: 30000 });
        }
      }

      if (!page.url().includes('/dashboard/properties')) {
        await page.goto(`${baseUrl}/dashboard/properties`, { waitUntil: 'domcontentloaded' });
      }

      // Verify no horizontal document overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      // Verify create CTA is visible on the page
      const createBtn = page.locator('a[href="/dashboard/properties/create"]').filter({ visible: true }).first();
      await expect(createBtn).toBeVisible({ timeout: 10000 });

      // Verify tabs are visible
      const allTab = page.locator('button:has-text("Toate"), button:has-text("All Properties")');
      await expect(allTab.first()).toBeVisible();

      // 3. Navigate to /dashboard/properties/create
      await page.goto(`${baseUrl}/dashboard/properties/create`, { waitUntil: 'domcontentloaded' });
      const titleInput = page.locator('input[name="title"]');
      await expect(titleInput).toBeVisible();

      const nextBtn = page.locator('button:has-text("Următorul"), button:has-text("Next")');
      await expect(nextBtn).toBeVisible();
    });
  }
});
