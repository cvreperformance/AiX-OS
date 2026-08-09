import { test, expect } from '@playwright/test';

async function checkResponsive(page, viewportWidth) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
  expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth);
  const columns = await page.evaluate(() => {
    const grid = document.querySelector('.grid');
    if (!grid) return null;
    const style = window.getComputedStyle(grid);
    return style.getPropertyValue('grid-template-columns').split(' ').length;
  });
  expect(columns).toBe(1);
  const firstCard = page.locator('article').first();
  await firstCard.click();
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();
  const rect = await modal.boundingBox();
  expect(rect?.width).toBeLessThanOrEqual(viewportWidth);
  const iframe = modal.locator('iframe');
  await expect(iframe).toBeVisible();
  const iframeRect = await iframe.boundingBox();
  expect(iframeRect?.width).toBeLessThanOrEqual(viewportWidth);
}

test.describe('Videos page navigation and responsiveness', () => {
  const viewports = [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 393, height: 852 },
  ];
  for (const vp of viewports) {
    test(`Responsive at ${vp.width}x${vp.height}`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize(vp);
      await page.goto('http://localhost:3001/');
      const menuButton = page.locator('button[aria-label="Main Menu"], button[aria-label="Meniu Principal"]');
      await menuButton.click();
      await page.waitForTimeout(3000);
      const videoLink = page.locator('#mobile-menu a[href="/videos"]');
      await page.evaluate(() => {
  const link = document.querySelector('#mobile-menu a[href="/videos"]') as HTMLElement;
  if (link) link.click();
});
      await expect(page).toHaveURL(/\/videos/);
      await checkResponsive(page, vp.width);
    });
  }
});
