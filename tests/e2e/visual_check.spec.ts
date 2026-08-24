import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1280, height: 720 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 960 },
];

test.describe('Visual Check of MegaMenu Centering', () => {
  for (const vp of viewports) {
    test(`Visual audit at ${vp.width}x${vp.height}`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize(vp);
      // Navigate with domcontentloaded to avoid load timeout
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const servicesBtn = page.getByTestId('platform-services-trigger').first();
      await servicesBtn.waitFor({ state: 'visible' });
      await servicesBtn.hover();
      const megaMenu = page.getByTestId('platform-services-menu').first();
      await expect(megaMenu).toBeVisible();

      const metrics = await page.evaluate(() => {
        const el = document.getElementById('services-mega-menu');
        const h = document.querySelector('header');
        if (!el || !h) return null;
        const rect = el.getBoundingClientRect();
        const headerRect = h.getBoundingClientRect();
        const headerBottom = headerRect.height;
        const cards = el.querySelectorAll('.grid > div');
        return {
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          headerBottom: Math.round(headerBottom),
          menuTop: Math.round(rect.top),
          menuLeft: Math.round(rect.left),
          menuRight: Math.round(rect.right),
          menuWidth: Math.round(rect.width),
          menuHeight: Math.round(rect.height),
          horizontalCenterDiff: Math.abs((rect.left + rect.width / 2) - window.innerWidth / 2),
          verticalGap: Math.round(rect.top - headerBottom),
          columnCount: cards.length,
        };
      });

      console.log(`\n=== METRICS FOR ${vp.width}x${vp.height} ===`);
      if (metrics) {
        console.log(`VIEWPORT: ${metrics.viewport}`);
        console.log(`HEADER BOTTOM: ${metrics.headerBottom}`);
        console.log(`MENU TOP: ${metrics.menuTop}`);
        console.log(`MENU LEFT: ${metrics.menuLeft}`);
        console.log(`MENU RIGHT: ${metrics.menuRight}`);
        console.log(`MENU WIDTH: ${metrics.menuWidth}`);
        console.log(`MENU HEIGHT: ${metrics.menuHeight}`);
        console.log(`HORIZONTAL CENTER DIFF: ${metrics.horizontalCenterDiff}`);
        console.log(`VERTICAL GAP: ${metrics.verticalGap}`);
        console.log(`COLUMN COUNT: ${metrics.columnCount}`);
      }

      await page.screenshot({ path: `screenshots/mega_menu_${vp.width}x${vp.height}.png`, fullPage: false });
    });
  }
});
