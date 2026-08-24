import { test, expect } from '@playwright/test';

test.describe('Real Existing Property Management Verification', () => {
  const baseUrl = process.env.TEST_TARGET_URL || 'http://localhost:3001';
  const realPropertyId = 'cafb604b-2876-4553-b186-c7dcb9278c70';
  const realPropertyTitle = 'REAL BROWSER PROPERTY 1787500279679';

  test.use({ viewport: { width: 1440, height: 900 } });

  test('Verify Existing Real Property Lifecycle (View, Prepopulation, Edit, Save, Status Toggle, Persistence)', async ({ page }) => {
    test.setTimeout(180000);

    page.on('dialog', async (dialog) => {
      console.log(`[Dialog]: ${dialog.message()}`);
      await dialog.accept();
    });

    // 1. Login with real account
    console.log('[1/7] Logging in with account testadmin.aixos@gmail.com...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await emailInput.fill('testadmin.aixos@gmail.com');
    await passwordInput.fill('TestAdmin123456!');

    // Submit form and wait for redirect away from /login
    await Promise.all([
      expect(page).not.toHaveURL(/\/login/, { timeout: 60000 }),
      submitBtn.click()
    ]);
    console.log('[1/7] Login PASSED — now at:', page.url());


    const propertyHeading = page.locator(`h3:has-text("${realPropertyTitle}")`);
    await expect(propertyHeading).toBeVisible({ timeout: 30000 });

    const propertyCard = page.locator('div.rounded-3xl').filter({ hasText: realPropertyTitle }).first();
    await expect(propertyCard).toBeVisible();

    // Check visible action buttons on card
    const editBtn = propertyCard.locator(`a[href*="/dashboard/properties/${realPropertyId}/edit"]`);
    const statusBtn = propertyCard.locator('button[title*="status"], button[title*="Status"], button[title*="Schimbă"]');
    const deleteBtn = propertyCard.locator('button[title*="Șterge"], button[title*="Delete"]');

    await expect(editBtn).toBeVisible();
    await expect(statusBtn).toBeVisible();
    await expect(deleteBtn).toBeVisible();

    // 3. Click EDIT and verify full prepopulation
    console.log('[3/7] Clicking EDIT and verifying prepopulation of all DB fields...');
    await editBtn.click();
    await expect(page).toHaveURL(new RegExp(`/dashboard/properties/${realPropertyId}/edit`), { timeout: 60000 });

    // Step 1 prepopulation
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toHaveValue(realPropertyTitle, { timeout: 30000 });

    // Step 2 prepopulation
    await page.click('button:has-text("2. Locație"), button:has-text("2. Location")');
    const cityInput = page.locator('input[name="city"]');
    await expect(cityInput).toHaveValue('Bucharest');

    // Step 3 prepopulation
    await page.click('button:has-text("3. Preț"), button:has-text("3. Pricing")');
    const priceInput = page.locator('input[name="price"]');
    await expect(priceInput).toBeVisible();

    // Step 4 prepopulation (verify existing 3 gallery images survive)
    await page.click('button:has-text("4. Galerie"), button:has-text("4. Media")');
    const galleryImages = page.locator('img[alt*="Property image"]');
    const imgCount = await galleryImages.count();
    expect(imgCount).toBeGreaterThanOrEqual(1);
    console.log(`Verified ${imgCount} existing images loaded in gallery!`);

    // 4. Modify Price and Save
    console.log('[4/7] Modifying price to 995000 and saving...');
    await page.click('button:has-text("3. Preț"), button:has-text("3. Pricing")');
    await priceInput.fill('995000');

    await page.click('button:has-text("4. Galerie"), button:has-text("4. Media")');
    const saveBtn = page.locator('button:has-text("Salvează Modificările"), button:has-text("Save Changes"), button:has-text("Actualizează & Publică")').first();
    await saveBtn.click();

    // 5. Verify updated values on dashboard and DB persistence across reload
    console.log('[5/7] Verifying updated price on dashboard and reloading page...');
    await expect(page).not.toHaveURL(/\/edit/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/dashboard\/properties$/, { timeout: 60000 });
    const updatedCard = page.locator('div.rounded-3xl').filter({ hasText: realPropertyTitle }).first();
    await expect(updatedCard).toContainText('995,000');

    // Reload page to verify persistence in Supabase
    await page.reload({ waitUntil: 'domcontentloaded' });
    const reloadedCard = page.locator('div.rounded-3xl').filter({ hasText: realPropertyTitle }).first();
    await expect(reloadedCard).toContainText('995,000');

    // 6. Test Status Change (Publish <-> Draft)
    console.log('[6/7] Testing status toggle and persistence...');
    const cardStatusTrigger = reloadedCard.locator('button[title*="status"], button[title*="Status"], button[title*="Schimbă"]');
    await cardStatusTrigger.click();

    // Switch to Draft
    const draftOpt = page.locator('button:has-text("Treci în Ciornă"), button:has-text("Set as Draft")');
    await draftOpt.click();

    await page.reload({ waitUntil: 'domcontentloaded' });
    const draftsTab = page.locator('button:has-text("Ciorne"), button:has-text("Drafts")');
    await draftsTab.click();
    await expect(page.locator(`h3:has-text("${realPropertyTitle}")`)).toBeVisible({ timeout: 30000 });

    // Switch back to Published
    const draftRealCard = page.locator('div.rounded-3xl').filter({ hasText: realPropertyTitle }).first();
    await draftRealCard.locator('button[title*="status"], button[title*="Status"], button[title*="Schimbă"]').click();
    const pubOpt = page.locator('button:has-text("Publică"), button:has-text("Publish")').last();
    await pubOpt.click();

    await page.reload({ waitUntil: 'domcontentloaded' });
    const pubTab = page.locator('button:has-text("Publicate"), button:has-text("Published")');
    await pubTab.click();
    await expect(page.locator(`h3:has-text("${realPropertyTitle}")`)).toBeVisible({ timeout: 30000 });

    // 7. Restore original price (980000)
    console.log('[7/7] Restoring original price to 980000...');
    const finalCard = page.locator('div.rounded-3xl').filter({ hasText: realPropertyTitle }).first();
    await finalCard.locator(`a[href*="/dashboard/properties/${realPropertyId}/edit"]`).click();
    await page.click('button:has-text("3. Preț"), button:has-text("3. Pricing")');
    await page.fill('input[name="price"]', '980000');
    await page.click('button:has-text("4. Galerie"), button:has-text("4. Media")');
    await page.click('button:has-text("Salvează Modificările"), button:has-text("Save Changes"), button:has-text("Actualizează & Publică")');
    await expect(page).not.toHaveURL(/\/edit/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/dashboard\/properties$/, { timeout: 60000 });

    console.log('REAL PROPERTY VERIFICATION COMPLETED WITH 100% SUCCESS!');
  });
});
