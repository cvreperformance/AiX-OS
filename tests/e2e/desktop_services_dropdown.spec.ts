import { test, expect } from '@playwright/test';

const desktopViewports = [
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 960 },
];

test.describe('Desktop Services Dropdown UI Audit', () => {
  for (const vp of desktopViewports) {
    test(`Services dropdown at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Locate the Services pillar button in header navigation
      const servicesBtn = page.getByRole('button', { name: /Servicii|Services/i }).first();
      await expect(servicesBtn).toBeVisible();

      // Trigger hover / mouseenter
      await servicesBtn.hover();
      await page.waitForTimeout(300);

      // Verify MegaMenu container exists and is visible
      const megaMenu = page.locator('#services-mega-menu');
      await expect(megaMenu).toBeVisible();
      const box = await megaMenu.boundingBox();

      const headerBottom = 84;

      if (box) {
        // 1. Horizontal Centering
        const horizontalCenter = box.x + box.width / 2;
        const viewportHorizontalCenter = vp.width / 2;
        const horizontalDiff = Math.abs(horizontalCenter - viewportHorizontalCenter);

        // 2. Vertical Centering in Available Area
        const availableTop = headerBottom;
        const availableBottom = vp.height;
        const availableCenter = availableTop + (availableBottom - availableTop) / 2;

        const verticalCenter = box.y + box.height / 2;
        const verticalDiff = Math.abs(verticalCenter - availableCenter);

        console.log(`\n=== VIEWPORT ${vp.width}x${vp.height} ===`);
        console.log(`WIDTH: ${box.width.toFixed(1)}px`);
        console.log(`HORIZONTAL CENTER: ${horizontalDiff <= 2 ? 'PASS' : 'FAIL'} (DIFF: ${horizontalDiff.toFixed(1)}px)`);
        console.log(`VERTICAL CENTER: ${verticalDiff <= 2 ? 'PASS' : 'FAIL'} (DIFF: ${verticalDiff.toFixed(1)}px)`);
        console.log(`TOP: ${box.y.toFixed(1)}px | BOTTOM: ${(box.y + box.height).toFixed(1)}px | HEADER BOTTOM: ${headerBottom.toFixed(1)}px | VP HEIGHT: ${vp.height}px`);

        const availableHeight = availableBottom - availableTop;
        const fitsVertically = box.height <= availableHeight - 30;

        console.log(`FITS VERTICALLY: ${fitsVertically ? 'YES' : 'NO (CLAMPED)'}`);

        expect(horizontalDiff).toBeLessThanOrEqual(2);

        if (fitsVertically) {
          expect(verticalDiff).toBeLessThanOrEqual(2);
        } else {
          expect(box.y).toBeGreaterThanOrEqual(headerBottom + 15);
          expect(box.y + box.height).toBeLessThanOrEqual(vp.height - 15);
        }
      }

      // Verify no horizontal document overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow).toBe(false);

      // Verify category cards
      const cards = megaMenu.locator('.grid > div');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);

      for (let i = 0; i < cardCount; i++) {
        const cBox = await cards.nth(i).boundingBox();
        if (cBox) {
          expect(cBox.width).toBeGreaterThanOrEqual(40);
          expect(cBox.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
  }
});
