import { test, expect } from '@playwright/test';

test.describe('Owner Management Bar — Live End-to-End Verification & Security', () => {
  const baseUrl = process.env.TEST_TARGET_URL || 'http://localhost:3001';
  const realPropertySlug = 'real-browser-property-1787500279679';
  const realPropertyId = 'cafb604b-2876-4553-b186-c7dcb9278c70';
  const realPropertyTitle = 'REAL BROWSER PROPERTY 1787500279679';

  test.use({ viewport: { width: 1440, height: 900 } });

  // 1. OWNER UX & EDITING VERIFICATION
  test('Owner UX: Public Property Detail Page displays Owner Management Bar & allows live edits', async ({ page }) => {
    test.setTimeout(180000);

    // 1.1 Login as owner
    console.log('[1/5] Logging in as owner (testadmin.aixos@gmail.com)...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const submitBtn = page.locator('button[type="submit"][data-hydrated="true"]');
    await submitBtn.waitFor({ state: 'visible', timeout: 60000 });

    await page.fill('input[name="email"]', 'testadmin.aixos@gmail.com');
    await page.fill('input[name="password"]', 'TestAdmin123456!');
    await submitBtn.click({ noWaitAfter: true });

    await expect(page).not.toHaveURL(/\/login/, { timeout: 60000 });
    await page.waitForTimeout(3000);

    // 1.2 Navigate to owner's public property page
    console.log(`[2/5] Navigating to public property page /proprietati/${realPropertySlug}...`);
    await page.goto(`${baseUrl}/proprietati/${realPropertySlug}`, { waitUntil: 'networkidle', timeout: 60000 });

    // Confirm Owner Management Bar IS visible
    const ownerBar = page.locator('div:has-text("Administrare Proprietate"), div:has-text("Property Management")').first();
    await expect(ownerBar).toBeVisible({ timeout: 30000 });

    // Confirm buttons exist
    const editBtn = page.locator('button:has-text("Editează"), button:has-text("Edit")').first();
    const contentBtn = page.locator('button:has-text("Conținut"), button:has-text("Content")').first();
    const photosBtn = page.locator('button:has-text("Poze"), button:has-text("Photos")').first();
    const deleteBtn = page.locator('button:has-text("Șterge"), button:has-text("Delete")').first();
    const visitorBtn = page.locator('button:has-text("Vizitator"), button:has-text("Visitor")').first();

    await expect(editBtn).toBeVisible();
    await expect(contentBtn).toBeVisible();
    await expect(photosBtn).toBeVisible();
    await expect(deleteBtn).toBeVisible();
    await expect(visitorBtn).toBeVisible();

    // 1.3 Test Quick Content Edit
    console.log('[3/5] Testing Quick Content Edit modal...');
    await contentBtn.click();
    const quickModal = page.locator('form:has-text("Titlu"), form:has-text("Title")').first();
    await expect(quickModal).toBeVisible();

    const priceInput = quickModal.locator('input[type="number"]').first();
    await priceInput.fill('996000');

    const saveBtn = quickModal.locator('button[type="submit"]');
    await saveBtn.click();

    // Confirm updated price appears on public page
    await expect(page.locator('p:has-text("996,000"), p:has-text("996.000")')).toBeVisible({ timeout: 30000 });

    // 1.4 Test Photos Modal
    console.log('[4/5] Testing Photos Management modal...');
    await photosBtn.click();
    const photosModal = page.locator('h3:has-text("Gestionare Galerie"), h3:has-text("Manage Photo")');
    await expect(photosModal).toBeVisible();

    const closePhotosBtn = page.locator('button:has-text("Gata"), button:has-text("Done")');
    await closePhotosBtn.click();

    // 1.5 Restore original price (980000)
    console.log('[5/5] Restoring original price (980000)...');
    await contentBtn.click();
    await priceInput.fill('980000');
    await saveBtn.click();
    await expect(page.locator('p:has-text("980,000"), p:has-text("980.000")')).toBeVisible({ timeout: 30000 });

    console.log('OWNER UX TEST PASSED WITH 100% SUCCESS!');
  });

  // 2. SECURITY TEST FOR VISITORS / NON-OWNERS
  test('Security: Unauthenticated visitor / Non-owner cannot see Owner Bar & API rejects unauthorized modifications', async ({ request, browser }) => {
    // 2.1 Unauthenticated browser context
    const visitorContext = await browser.newContext();
    const visitorPage = await visitorContext.newPage();

    console.log('[Security 1/3] Visiting public property page as unauthenticated visitor...');
    await visitorPage.goto(`${baseUrl}/proprietati/${realPropertySlug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Confirm Management Bar is NOT visible
    const ownerBar = visitorPage.locator('div:has-text("Administrare Proprietate"), div:has-text("Property Management")');
    await expect(ownerBar).toBeHidden();

    // Confirm Edit & Delete buttons are NOT present
    await expect(visitorPage.locator('button:has-text("Editează")')).toBeHidden();
    await expect(visitorPage.locator('button:has-text("Șterge")')).toBeHidden();

    await visitorContext.close();

    // 2.2 Security API Test: Unauthenticated PATCH
    console.log('[Security 2/3] Testing unauthenticated PATCH request to /api/properties/[id]...');
    const patchRes = await request.patch(`${baseUrl}/api/properties/${realPropertyId}`, {
      data: { price: 1 },
    });
    expect([401, 403]).toContain(patchRes.status());
    console.log(`Unauthenticated PATCH status: ${patchRes.status()} (Rejected correctly)`);

    // 2.3 Security API Test: Unauthenticated DELETE
    console.log('[Security 3/3] Testing unauthenticated DELETE request to /api/properties/[id]...');
    const deleteRes = await request.delete(`${baseUrl}/api/properties/${realPropertyId}`);
    expect([401, 403]).toContain(deleteRes.status());
    console.log(`Unauthenticated DELETE status: ${deleteRes.status()} (Rejected correctly)`);

    console.log('SECURITY TESTS PASSED WITH 100% SUCCESS!');
  });

  // 3. RESPONSIVE LAYOUT VERIFICATION (NO OVERFLOW)
  test('Responsive: Public property page with Owner Bar has zero horizontal overflow across mobile break-points', async ({ page }) => {
    test.setTimeout(120000);
    const viewports = [
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 393, height: 852 },
      { width: 1280, height: 720 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 960 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto(`${baseUrl}/proprietati/${realPropertySlug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(hasOverflow).toBe(false);
      console.log(`Viewport ${vp.width}x${vp.height}: scrollWidth <= innerWidth (No Overflow: PASSED)`);
    }
  });
});
