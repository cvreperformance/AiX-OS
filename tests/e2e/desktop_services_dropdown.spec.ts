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

      // Verify bounding box fits inside viewport and is visually centered
      const measurements = await page.evaluate(() => {
        const menu = document.getElementById('services-mega-menu');
        if (!menu) return null;
        const rect = menu.getBoundingClientRect();
        const computed = window.getComputedStyle(menu);
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          right: rect.right,
          bottom: rect.bottom,
          maxHeight: computed.maxHeight,
          position: computed.position,
          transform: computed.transform,
        };
      });

      if (box && measurements) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 5);
        const menuCenter = box.x + box.width / 2;
        const vpCenter = vp.width / 2;
        const centerDiff = Math.abs(menuCenter - vpCenter);

        console.log(`[MEASUREMENT ${vp.width}x${vp.height}] LEFT: ${box.x.toFixed(1)}px | RIGHT: ${(box.x + box.width).toFixed(1)}px | CENTER: ${menuCenter.toFixed(1)}px | VIEWPORT CENTER: ${vpCenter.toFixed(1)}px | CENTER DIFF: ${centerDiff.toFixed(1)}px | HEIGHT: ${measurements.height.toFixed(1)}px | MAXHEIGHT: ${measurements.maxHeight}`);

        expect(centerDiff).toBeLessThanOrEqual(2);
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
