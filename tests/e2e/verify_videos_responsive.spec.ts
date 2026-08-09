import { test, expect } from '@playwright/test';

test('Videos page responsive at 375x812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/videos');
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
  expect(rect?.width).toBeLessThanOrEqual(375);
  const iframe = modal.locator('iframe');
  await expect(iframe).toBeVisible();
  const iframeRect = await iframe.boundingBox();
  expect(iframeRect?.width).toBeLessThanOrEqual(375);
});

test('Videos page responsive at 390x844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/videos');
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
  expect(rect?.width).toBeLessThanOrEqual(390);
  const iframe = modal.locator('iframe');
  await expect(iframe).toBeVisible();
  const iframeRect = await iframe.boundingBox();
  expect(iframeRect?.width).toBeLessThanOrEqual(390);
});

test('Videos page responsive at 393x852', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/videos');
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
  expect(rect?.width).toBeLessThanOrEqual(393);
  const iframe = modal.locator('iframe');
  await expect(iframe).toBeVisible();
  const iframeRect = await iframe.boundingBox();
  expect(iframeRect?.width).toBeLessThanOrEqual(393);
});
