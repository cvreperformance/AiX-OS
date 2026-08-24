import { test, expect } from '@playwright/test';

const PROD_URL = 'https://os.cristianvaduva.com';

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 393, height: 852 },
];

const desktopViewports = [
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 960 },
];

test.describe('Live Production Verification', () => {
  for (const vp of mobileViewports) {
    test(`Live Mobile ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto(PROD_URL);
      await page.waitForLoadState('domcontentloaded');

      // Hamburger menu & navigation
      const menuBtn = page.locator('button[aria-label="Main Menu"], button[aria-label="Meniu Principal"]').first();
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();

      const videoLink = page.locator('#mobile-menu a[href="/videos"]').first();
      await expect(videoLink).toBeVisible();
      await videoLink.click();
      await expect(page).toHaveURL(/\/videos/);

      // Grid columns check
      const gridColumns = await page.evaluate(() => {
        const grid = document.querySelector('.grid');
        if (!grid) return null;
        return window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').length;
      });
      expect(gridColumns).toBe(1);

      // Card width & overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

      // Modal initial state & video click
      await expect(page.locator('[role="dialog"]').first()).not.toBeVisible();
      const firstCard = page.locator('article').first();
      await firstCard.click();

      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
      const modalBox = await modal.boundingBox();
      if (modalBox) {
        expect(modalBox.width).toBeLessThanOrEqual(vp.width + 5);
      }
    });
  }

  for (const vp of desktopViewports) {
    test(`Live Desktop ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto(PROD_URL);
      await page.waitForLoadState('domcontentloaded');

      const servicesBtn = page.getByTestId('platform-services-trigger').first();
      await expect(servicesBtn).toBeVisible();
      await servicesBtn.click();
      const megaMenu = page.getByTestId('platform-services-menu').first();
      await expect(megaMenu).toBeVisible();

      const box = await megaMenu.boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 5);
      }

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow).toBe(false);
    });
  }
});
