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

      // Verify exactly ONE MegaMenu container exists and is visible
      const megaMenu = page.locator('header div').filter({ hasText: /Servicii Platformă|Platform Services/i }).first();
      await expect(megaMenu).toBeVisible();

      // Verify bounding box fits inside viewport and is visually centered
      const box = await megaMenu.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 5);
        expect(box.y + box.height).toBeLessThanOrEqual(vp.height + 5);
        const menuCenter = box.x + box.width / 2;
        const vpCenter = vp.width / 2;
        expect(Math.abs(menuCenter - vpCenter)).toBeLessThanOrEqual(2);
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
