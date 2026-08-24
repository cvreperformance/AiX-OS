import { test, expect } from '@playwright/test';

test.describe('Videos page responsive UI', () => {
  const viewports = [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 393, height: 852 },
  ];

  for (const vp of viewports) {
    test(`Responsive at ${vp.width}x${vp.height}`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      const menuButton = page.locator('button[aria-label="Main Menu"], button[aria-label="Meniu Principal"]');
      await page.waitForSelector('button[aria-label="Main Menu"], button[aria-label="Meniu Principal"]', { state: 'visible' });
      await menuButton.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      const videoLink = page.locator('#mobile-menu a[href="/videos"]').first();
      await expect(videoLink).toBeVisible();
      await videoLink.click();
      await expect(page).toHaveURL(/\/videos/);

      // Ensure video modal is not open initially
      await expect(page.locator('[aria-labelledby="modal-video-title"]')).not.toBeVisible();

      // Click first video card to open modal
      const firstCard = page.locator('article').first();
      await firstCard.click();
      await page.waitForSelector('[aria-labelledby="modal-video-title"]', { state: 'visible' });

      const modal = page.locator('[aria-labelledby="modal-video-title"]');
      await expect(modal).toBeVisible();

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth);

      // Ensure grid is single column on mobile
      const gridColumns = await page.evaluate(() => {
        const grid = document.querySelector('.grid');
        if (!grid) return null;
        const style = window.getComputedStyle(grid);
        return style.getPropertyValue('grid-template-columns').split(' ').length;
      });
      expect(gridColumns).toBe(1);

      // Card width check
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.width).toBeLessThanOrEqual(vp.width);
    });
  }
});
