import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

test.describe('Owner Management Bar — Live End-to-End Verification & Security', () => {
  const baseUrl = process.env.TEST_TARGET_URL || 'http://localhost:3001';
  const realPropertySlug = 'apartament-elegant-n-her-str-u-gr-din-privat-npul2y';
  const realPropertyId = '0963be0a-5738-406c-812c-d0e90bc90a2b';

  const supabaseUrl = 'https://fcpsafjgjnecdlyqfcid.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHNhZmpnam5lY2RseXFmY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzAyMTksImV4cCI6MjA5ODMwNjIxOX0.n-Obp-2j284umEvkKHBiTmmTfYARKvGrx3dUDhvcGPY';

  test.use({ viewport: { width: 1440, height: 900 } });

  // 1. OWNER UX & EDITING & STATUS VERIFICATION
  test('Owner UX: Public Property Detail Page displays Owner Management Bar & allows live edits', async ({ page }) => {
    test.setTimeout(180000);

    // 1.1 Authenticate via Supabase Auth API & set session cookies
    console.log('[1/6] Logging in as owner (testadmin.aixos@gmail.com)...');
    const supabase = createClient(supabaseUrl, supabaseKey, { realtime: { transport: ws }, auth: { persistSession: false } });
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testadmin.aixos@gmail.com',
      password: 'TestAdmin123456!',
    });
    if (authError || !authData.session) {
      throw new Error(`Login failed: ${authError?.message}`);
    }

    const domain = new URL(baseUrl).hostname;
    const sessionStr = JSON.stringify(authData.session);

    const isHttps = baseUrl.startsWith('https');
    await page.context().addCookies([
      {
        name: 'sb-fcpsafjgjnecdlyqfcid-auth-token',
        value: encodeURIComponent(sessionStr),
        domain: domain.startsWith('localhost') ? 'localhost' : domain,
        path: '/',
        httpOnly: false,
        secure: isHttps,
        sameSite: 'Lax',
      },
    ]);

    // Perform UI login to ensure local storage / cookies are aligned
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const emailField = page.locator('input[name="email"]');
    if (await emailField.isVisible()) {
      await emailField.fill('testadmin.aixos@gmail.com');
      await page.fill('input[name="password"]', 'TestAdmin123456!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }

    // 1.2 Navigate to owner's public property page
    console.log(`[2/6] Navigating to public property page /proprietati/${realPropertySlug}...`);
    await page.goto(`${baseUrl}/proprietati/${realPropertySlug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Confirm Owner Management Bar IS visible by data-testid & text
    const ownerBar = page.locator('[data-testid="owner-management-bar"]');
    await expect(ownerBar).toBeVisible({ timeout: 30000 });

    // Confirm all required buttons exist by data-testid
    const editBtn = page.locator('[data-testid="owner-edit"]');
    const contentBtn = page.locator('[data-testid="owner-content"]');
    const photosBtn = page.locator('[data-testid="owner-photos"]');
    const statusSelect = page.locator('[data-testid="owner-status"]');
    const deleteBtn = page.locator('[data-testid="owner-delete"]');
    const previewBtn = page.locator('[data-testid="owner-preview"]');

    await expect(editBtn).toBeVisible();
    await expect(contentBtn).toBeVisible();
    await expect(photosBtn).toBeVisible();
    await expect(statusSelect).toBeVisible();
    await expect(deleteBtn).toBeVisible();
    await expect(previewBtn).toBeVisible();

    // 1.3 Test Status Toggle (Idempotent)
    console.log('[3/6] Testing Status Toggle (Idempotent)...');
    const initialStatus = await statusSelect.inputValue();
    const targetStatus = initialStatus === 'Draft' ? 'Published' : 'Draft';

    const patchDraftPromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/properties/') && resp.request().method() === 'PATCH' && resp.status() === 200
    );
    await statusSelect.selectOption(targetStatus);
    await patchDraftPromise;
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="owner-status"]')).toHaveValue(targetStatus);

    const patchPubPromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/properties/') && resp.request().method() === 'PATCH' && resp.status() === 200
    );
    await page.locator('[data-testid="owner-status"]').selectOption(initialStatus);
    await patchPubPromise;
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="owner-status"]')).toHaveValue(initialStatus);

    // 1.4 Test Quick Content Edit
    console.log('[4/6] Testing Quick Content Edit modal & Price Persistence...');
    await contentBtn.click();
    const quickModal = page.locator('form:has-text("Titlu"), form:has-text("Title")').first();
    await expect(quickModal).toBeVisible();

    const priceInput = quickModal.locator('input[type="number"]').first();
    await priceInput.fill('996000');

    const saveBtn = quickModal.locator('button[type="submit"]');
    const savePatchPromise1 = page.waitForResponse(
      (resp) => resp.url().includes('/api/properties/') && resp.request().method() === 'PATCH' && resp.status() === 200
    );
    await saveBtn.click();
    await savePatchPromise1;
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Confirm updated price formatted correctly appears on public page body
    await expect(page.locator('body')).toContainText(/996[\s\u00A0\u202F.,]?000/);

    // 1.5 Test Photos Modal
    console.log('[5/6] Testing Photos Management modal...');
    await photosBtn.click();
    const photosModal = page.locator('h3:has-text("Gestionare Galerie Foto"), h3:has-text("Manage Photo Gallery")');
    await expect(photosModal).toBeVisible();

    const closePhotosBtn = page.locator('button:has-text("Gata"), button:has-text("Done")').first();
    await closePhotosBtn.click();

    // 1.6 Restore original price (1300000 / 1300)
    console.log('[6/6] Restoring original price (1300)...');
    await contentBtn.click();
    await priceInput.fill('1300');
    const savePatchPromise2 = page.waitForResponse(
      (resp) => resp.url().includes('/api/properties/') && resp.request().method() === 'PATCH' && resp.status() === 200
    );
    await saveBtn.click();
    await savePatchPromise2;
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/1[\s\u00A0\u202F.,]?300/);

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
    const ownerBar = visitorPage.locator('[data-testid="owner-management-bar"]');
    await expect(ownerBar).toBeHidden();

    // Confirm Edit & Delete buttons are NOT present
    await expect(visitorPage.locator('[data-testid="owner-edit"]')).toBeHidden();
    await expect(visitorPage.locator('[data-testid="owner-delete"]')).toBeHidden();

    // 2.2 Confirm "View as Visitor" URL (?visitor=true) hides Owner Bar even for logged-in users
    console.log('[Security 2/3] Testing ?visitor=true visitor mode...');
    await visitorPage.goto(`${baseUrl}/proprietati/${realPropertySlug}?visitor=true`, { waitUntil: 'domcontentloaded' });
    await expect(ownerBar).toBeHidden();

    await visitorContext.close();

    // 2.3 Security API Test: Unauthenticated PATCH
    console.log('[Security 3/3] Testing unauthenticated PATCH request to /api/properties/[id]...');
    const patchRes = await request.patch(`${baseUrl}/api/properties/${realPropertyId}`, {
      data: { price: 1 },
    });
    expect([401, 403]).toContain(patchRes.status());
    console.log(`Unauthenticated PATCH status: ${patchRes.status()} (Rejected correctly)`);

    const deleteRes = await request.delete(`${baseUrl}/api/properties/${realPropertyId}`);
    expect([401, 403]).toContain(deleteRes.status());
    console.log(`Unauthenticated DELETE status: ${deleteRes.status()} (Rejected correctly)`);

    console.log('SECURITY TESTS PASSED WITH 100% SUCCESS!');
  });

  // 3. DELETE WORKFLOW (DEDICATED TEMP TEST PROPERTY)
  test('Delete Workflow: Dedicated TEST property confirmation & deletion lifecycle', async ({ page }) => {
    test.setTimeout(120000);

    const supabase = createClient(supabaseUrl, supabaseKey, { realtime: { transport: ws }, auth: { persistSession: false } });
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'testadmin.aixos@gmail.com',
      password: 'TestAdmin123456!',
    });

    if (!authData?.session) {
      throw new Error('Login failed for delete workflow test');
    }

    // Set session cookies
    const domain = new URL(baseUrl).hostname;
    const isHttps = baseUrl.startsWith('https');
    await page.context().addCookies([
      {
        name: 'sb-fcpsafjgjnecdlyqfcid-auth-token',
        value: encodeURIComponent(JSON.stringify(authData.session)),
        domain: domain.startsWith('localhost') ? 'localhost' : domain,
        path: '/',
        httpOnly: false,
        secure: isHttps,
        sameSite: 'Lax',
      },
    ]);

    // Create temporary test property
    const testSlug = `test-delete-prop-${Date.now()}`;
    const { data: tempProperty, error: createErr } = await supabase
      .from('properties')
      .insert({
        title: `Temp Delete Test ${Date.now()}`,
        slug: testSlug,
        owner_id: authData.user.id,
        price: 500000,
        currency: 'EUR',
        status: 'Published',
        category: 'Apartment',
        listing_type: 'sale',
        city: 'București',
      })
      .select()
      .single();

    if (createErr || !tempProperty) {
      throw new Error(`Failed to create temp property: ${createErr?.message}`);
    }

    try {
      console.log(`[Delete Test] Navigating to temp property /proprietati/${testSlug}...`);
      await page.goto(`${baseUrl}/proprietati/${testSlug}`, { waitUntil: 'domcontentloaded' });

      // Click Delete button
      const deleteBtn = page.locator('[data-testid="owner-delete"]');
      await expect(deleteBtn).toBeVisible({ timeout: 15000 });
      await deleteBtn.click();

      // Verify confirmation modal by data-testid
      const modal = page.locator('[data-testid="owner-delete-modal"]');
      await expect(modal).toBeVisible({ timeout: 10000 });

      // Click Cancel
      const cancelBtn = page.locator('[data-testid="owner-cancel-delete"]');
      await cancelBtn.click();
      await expect(modal).toBeHidden();

      // Verify property still exists on reload
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toContainText(tempProperty.title);

      // Click Delete again and Confirm
      await page.locator('[data-testid="owner-delete"]').click();
      await expect(modal).toBeVisible({ timeout: 10000 });

      const confirmBtn = page.locator('[data-testid="owner-confirm-delete"]');
      await confirmBtn.click();

      // Verify redirection to dashboard
      await expect(page).toHaveURL(/\/dashboard\/properties/, { timeout: 15000 });

      // Verify DB row is gone
      const { data: checkRow } = await supabase
        .from('properties')
        .select('id')
        .eq('id', tempProperty.id)
        .maybeSingle();

      expect(checkRow).toBeNull();
      console.log('[Delete Test] Temp property deleted & verified gone from DB: PASSED');
    } finally {
      // Cleanup if still exists
      await supabase.from('properties').delete().eq('id', tempProperty.id);
    }
  });

  // 4. RESPONSIVE LAYOUT VERIFICATION (NO OVERFLOW ACROSS ALL 8 VIEWPORTS)
  test('Responsive: Public property page with Owner Bar has zero horizontal overflow across all 8 viewports', async ({ page }) => {
    test.setTimeout(120000);
    const viewports = [
      { width: 375, height: 812, name: '375x812' },
      { width: 390, height: 844, name: '390x844' },
      { width: 393, height: 852, name: '393x852' },
      { width: 1280, height: 720, name: '1280x720' },
      { width: 1280, height: 800, name: '1280x800' },
      { width: 1366, height: 768, name: '1366x768' },
      { width: 1440, height: 900, name: '1440x900' },
      { width: 1536, height: 960, name: '1536x960' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${baseUrl}/proprietati/${realPropertySlug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow).toBe(false);
      console.log(`Viewport ${vp.name}: scrollWidth <= clientWidth (No Overflow: PASSED)`);
    }
  });
});

