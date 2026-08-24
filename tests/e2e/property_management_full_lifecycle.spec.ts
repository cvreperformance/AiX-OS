import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Property Management Full Lifecycle E2E — Live Functional Verification', () => {
  const baseUrl = process.env.TEST_TARGET_URL || 'http://localhost:3001';
  const fixturePath = path.join(__dirname, 'fixtures', 'sample_normal.jpg');
  const timestamp = Date.now();
  const testPropertyTitle = `E2E Live Test Penthouse ${timestamp}`;
  const updatedPropertyTitle = `Updated Penthouse ${timestamp}`;

  test.use({ viewport: { width: 1440, height: 900 } });

  test('Full Lifecycle: CREATE -> VIEW -> EDIT -> SAVE -> STATUS CHANGE -> PERSISTENCE -> DELETE -> DB VERIFY', async ({ page }) => {
    test.setTimeout(90000);

    page.on('dialog', async (dialog) => {
      console.log(`[Browser Dialog]: ${dialog.message()}`);
      await dialog.accept();
    });

    // A. Login
    console.log('[1/8] Logging in...');
    await page.goto(`${baseUrl}/dashboard/properties`, { waitUntil: 'domcontentloaded' });
    if (page.url().includes('/login')) {
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitBtn = page.locator('button[type="submit"], button:has-text("Intră în cont"), button:has-text("Sign in")');

      if (await emailInput.isVisible()) {
        await emailInput.fill('testadmin.aixos@gmail.com');
        await passwordInput.fill('TestAdmin123456!');
        await submitBtn.click();
        await expect(page).not.toHaveURL(/\/login/, { timeout: 30000 });
      }
    }

    // B. Navigate to Create Property
    console.log('[2/8] Creating new property via wizard...');
    await page.goto(`${baseUrl}/dashboard/properties/create`, { waitUntil: 'networkidle' });

    // Step 1: Basic Info
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible({ timeout: 15000 });
    await titleInput.fill(testPropertyTitle);

    const descInput = page.locator('textarea[name="description"]');
    await descInput.fill('Penthouse exclusivist cu vedere panoramică și finisaje de lux.');

    const nextBtn = page.locator('button:has-text("Următorul"), button:has-text("Next")');
    await nextBtn.click();

    // Step 2: Location
    const cityInput = page.locator('input[name="city"]');
    await expect(cityInput).toBeVisible({ timeout: 10000 });
    await cityInput.fill('București');
    await page.fill('input[name="district"]', 'Sector 1');
    await page.fill('input[name="neighborhood"]', 'Herăstrău');
    await page.fill('input[name="address"]', 'Șoseaua Nordului 10');
    await nextBtn.click();

    // Step 3: Pricing & Tech Details
    const priceInput = page.locator('input[name="price"]');
    await expect(priceInput).toBeVisible({ timeout: 10000 });
    await priceInput.fill('950000');
    await page.fill('input[name="usable_area"]', '220');
    await page.fill('input[name="rooms"]', '4');
    await page.fill('input[name="bedrooms"]', '3');
    await page.fill('input[name="bathrooms"]', '3');
    await page.fill('input[name="year_built"]', '2024');
    await nextBtn.click();

    // Step 4: Media Gallery & Upload
    const fileInput = page.locator('input[type="file"]#image-upload');
    await expect(fileInput).toBeAttached({ timeout: 10000 });
    await fileInput.setInputFiles([fixturePath]);

    // Wait for image preview and upload spinner to complete
    const previewImg = page.locator('img[alt*="Property image 1"]');
    await expect(previewImg.first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.animate-spin')).toHaveCount(0, { timeout: 15000 });

    await page.waitForTimeout(500);

    // Publish
    const publishBtn = page.locator('button:has-text("Publică Acum"), button:has-text("Publish Now"), button:has-text("Publică")').last();
    await publishBtn.click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard\/properties/, { timeout: 15000 });

    // C. Verify Property on Dashboard
    console.log('[3/8] Verifying property appears on dashboard...');
    const cardTitle = page.locator(`h3:has-text("${testPropertyTitle}")`);
    await expect(cardTitle).toBeVisible({ timeout: 15000 });

    // Find the property card container using class filter
    const propertyCard = page.locator('div.rounded-3xl').filter({ hasText: testPropertyTitle }).first();
    await expect(propertyCard).toBeVisible();

    // Verify Action Buttons: Edit, More (Status), Delete
    const editBtn = propertyCard.locator('a[href*="/edit"]').first();
    const statusBtn = propertyCard.locator('button[title*="status"], button[title*="Status"], button[title*="Schimbă"]');
    const deleteBtn = propertyCard.locator('button[title*="Șterge"], button[title*="Delete"]');

    await expect(editBtn).toBeVisible();
    await expect(statusBtn).toBeVisible();
    await expect(deleteBtn).toBeVisible();

    // D. Edit Property Flow
    console.log('[4/8] Opening Edit page and verifying pre-population...');
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();
    await expect(page).toHaveURL(/\/dashboard\/properties\/[a-f0-9-]+\/edit/, { timeout: 20000 });

    // Verify form pre-population
    const editTitleInput = page.locator('input[name="title"]');
    await expect(editTitleInput).toHaveValue(testPropertyTitle, { timeout: 10000 });

    const editPriceInput = page.locator('input[name="price"]');
    // Navigate to step 3 to check price
    await page.click('button:has-text("3. Preț"), button:has-text("3. Pricing")');
    await expect(editPriceInput).toHaveValue('950000');

    // Modify Title & Price
    await page.click('button:has-text("1. Info"), button:has-text("1. Basic")');
    await editTitleInput.fill(updatedPropertyTitle);

    await page.click('button:has-text("3. Preț"), button:has-text("3. Pricing")');
    await editPriceInput.fill('1050000');

    // Check Step 4 gallery images survive edit
    await page.click('button:has-text("4. Galerie"), button:has-text("4. Media")');
    const existingGalleryImg = page.locator('img[alt*="Property image 1"]');
    await expect(existingGalleryImg.first()).toBeVisible({ timeout: 10000 });

    // Save changes
    console.log('[5/8] Saving edited changes...');
    const saveBtn = page.locator('button:has-text("Salvează Modificările"), button:has-text("Save Changes"), button:has-text("Actualizează & Publică")').first();
    await saveBtn.click();

    // Verify redirect to dashboard and updated values
    await expect(page).toHaveURL(/\/dashboard\/properties/, { timeout: 15000 });
    const updatedCardTitle = page.locator(`h3:has-text("${updatedPropertyTitle}")`);
    await expect(updatedCardTitle).toBeVisible({ timeout: 15000 });

    // E. Status Change Flow
    console.log('[6/8] Testing status change and persistence across reloads...');
    const updatedCard = page.locator('div.rounded-3xl').filter({ hasText: updatedPropertyTitle }).first();
    const cardStatusMenuTrigger = updatedCard.locator('button[title*="status"], button[title*="Status"], button[title*="Schimbă"]');
    await cardStatusMenuTrigger.click();

    // Switch to Draft
    const draftOption = page.locator('button:has-text("Treci în Ciornă"), button:has-text("Set as Draft")');
    await draftOption.click();

    // Reload page and check Draft tab
    await page.reload({ waitUntil: 'domcontentloaded' });
    const draftsTab = page.locator('button:has-text("Ciorne"), button:has-text("Drafts")');
    await draftsTab.click();
    await expect(page.locator(`h3:has-text("${updatedPropertyTitle}")`)).toBeVisible({ timeout: 10000 });

    // Switch back to Published
    const draftCard = page.locator('div.rounded-3xl').filter({ hasText: updatedPropertyTitle }).first();
    await draftCard.locator('button[title*="status"], button[title*="Status"], button[title*="Schimbă"]').click();
    const publishOption = page.locator('button:has-text("Publică"), button:has-text("Publish")').last();
    await publishOption.click();

    // Reload page and check Published tab
    await page.reload({ waitUntil: 'domcontentloaded' });
    const publishedTab = page.locator('button:has-text("Publicate"), button:has-text("Published")');
    await publishedTab.click();
    await expect(page.locator(`h3:has-text("${updatedPropertyTitle}")`)).toBeVisible({ timeout: 10000 });

    // F. Delete Property Flow
    console.log('[7/8] Testing Delete modal and permanent deletion...');
    const finalCard = page.locator('div.rounded-3xl').filter({ hasText: updatedPropertyTitle }).first();
    const cardDeleteBtn = finalCard.locator('button[title*="Șterge"], button[title*="Delete"]');
    await cardDeleteBtn.click();

    // Confirm Modal appears
    const deleteModal = page.locator('div:has-text("Confirmă Ștergerea"), div:has-text("Confirm Deletion")').last();
    await expect(deleteModal).toBeVisible();

    // Test Cancel
    const cancelBtn = page.locator('button:has-text("Anulează"), button:has-text("Cancel")');
    await cancelBtn.click();
    await expect(deleteModal).toBeHidden();
    await expect(page.locator(`h3:has-text("${updatedPropertyTitle}")`)).toBeVisible();

    // Open Delete modal again and Confirm Delete
    await cardDeleteBtn.click();
    await expect(deleteModal).toBeVisible();

    const confirmDeleteBtn = page.locator('button:has-text("Șterge Definitiv"), button:has-text("Delete Permanently")');
    await confirmDeleteBtn.click();

    // Verify property disappears from UI
    await expect(page.locator(`h3:has-text("${updatedPropertyTitle}")`)).toBeHidden({ timeout: 10000 });

    // Reload page to verify backend persistence (must remain gone)
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`h3:has-text("${updatedPropertyTitle}")`)).toBeHidden();

    console.log('[8/8] FULL LIFECYCLE COMPLETED SUCCESSFULLY!');
  });
});
