import { test, expect } from '@playwright/test';

test.describe('Real Estate News Navigation Verification', () => {
  test('Desktop MegaMenu includes Real Estate News and Intelligence Newsroom with correct navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Trigger MegaMenu
    const servicesBtn = page.getByTestId('platform-services-trigger').first();
    await servicesBtn.hover();
    const megaMenu = page.getByTestId('platform-services-menu').first();
    await expect(megaMenu).toBeVisible();

    // 1. Verify Real Estate News link in MegaMenu
    const realEstateNewsLink = megaMenu.locator('a[href="/stiri"]');
    await expect(realEstateNewsLink).toBeVisible();
    await expect(realEstateNewsLink).toHaveText(/Real Estate News/i);

    // 2. Verify Intelligence Newsroom link in MegaMenu
    const newsroomLink = megaMenu.locator('a[href="/newsroom"]');
    await expect(newsroomLink).toBeVisible();
    await expect(newsroomLink).toHaveText(/Intelligence Newsroom/i);

    // 3. Verify exactly one /stiri link in MegaMenu (no duplicate)
    const stiriLinksCount = await megaMenu.locator('a[href="/stiri"]').count();
    expect(stiriLinksCount).toBe(1);

    // 4. Verify 4 columns layout
    const cols = await megaMenu.locator('[data-services-column]').count();
    expect(cols).toBe(4);

    // 5. Test navigation to /stiri
    await realEstateNewsLink.click();
    await expect(page).toHaveURL(/\/stiri/);
    await expect(page.locator('h1')).toContainText(/Piața Imobiliară/i);
  });

  test('Mobile Drawer exposes Real Estate News under Learn category', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Open mobile menu
    const menuBtn = page.locator('button[aria-label="Meniu Principal"], button[aria-label="Main Menu"]').first();
    await menuBtn.click();

    // Find and expand "Învață" / "Learn" category
    const learnCategoryBtn = page.locator('button').filter({ hasText: /Învață|Learn/i }).first();
    await expect(learnCategoryBtn).toBeVisible();
    await learnCategoryBtn.click();

    // Verify Real Estate News link is visible in the drawer
    const mobileStiriLink = page.locator('a[href="/stiri"]').first();
    await expect(mobileStiriLink).toBeVisible();
    await expect(mobileStiriLink).toContainText(/Real Estate News/i);

    // Test clicking navigation to /stiri on mobile
    await mobileStiriLink.click();
    await expect(page).toHaveURL(/\/stiri/);
    await expect(page.locator('h1')).toContainText(/Piața Imobiliară/i);
  });

  test('Intelligence Newsroom /newsroom remains fully functional', async ({ page }) => {
    await page.goto('/newsroom');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/newsroom/);
    await expect(page.locator('body')).toBeVisible();
  });
});
