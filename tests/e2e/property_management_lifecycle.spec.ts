import { test, expect } from '@playwright/test';

test.describe('Property Management Lifecycle & Dashboard QA', () => {
  const baseUrl = process.env.TEST_TARGET_URL || 'http://localhost:3001';

  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitBtn = page.locator('button[type="submit"], button:has-text("Intră în cont"), button:has-text("Sign in")');

    if (await emailInput.isVisible()) {
      await emailInput.fill('testadmin.aixos@gmail.com');
      await passwordInput.fill('TestAdmin123456!');
      await submitBtn.click();
      // Wait until redirected away from /login
      await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    }
  });

  test('Properties Dashboard renders header, create CTA, and filter tabs', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard/properties`, { waitUntil: 'networkidle' });

    // Header & Create button
    const pageHeading = page.locator('h1:has-text("Proprietăți"), h1:has-text("Properties")');
    await expect(pageHeading.first()).toBeVisible({ timeout: 15000 });

    const createLink = page.locator('a[href="/dashboard/properties/create"]');
    await expect(createLink.first()).toBeVisible();

    // Check filter tabs
    const allTab = page.locator('button:has-text("Toate"), button:has-text("All Properties")');
    await expect(allTab.first()).toBeVisible();
  });

  test('Property Creation Wizard loads all 4 steps navigation', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard/properties/create`, { waitUntil: 'networkidle' });

    // Step 1 title & category
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible({ timeout: 15000 });
    await titleInput.fill('E2E Test Luxury Residence');

    const nextBtn = page.locator('button:has-text("Următorul"), button:has-text("Next")');
    await nextBtn.click();

    // Step 2: Location
    const cityInput = page.locator('input[name="city"]');
    await expect(cityInput).toBeVisible({ timeout: 15000 });
    await cityInput.fill('București');
    await nextBtn.click();

    // Step 3: Pricing & specs
    const priceInput = page.locator('input[name="price"]');
    await expect(priceInput).toBeVisible({ timeout: 15000 });
    await priceInput.fill('850000');
    await nextBtn.click();

    // Step 4: Media gallery
    const fileInput = page.locator('input[type="file"]#image-upload');
    await expect(fileInput).toBeAttached({ timeout: 15000 });
  });

  test('Admin Properties Management renders table and search filter', async ({ page }) => {
    await page.goto(`${baseUrl}/admin/properties`, { waitUntil: 'networkidle' });

    const heading = page.locator('h1:has-text("Administrare Proprietăți"), h1:has-text("Proprietăți")');
    await expect(heading.first()).toBeVisible({ timeout: 15000 });

    const searchInput = page.locator('input[placeholder*="Caută"]');
    await expect(searchInput).toBeVisible();
  });
});
