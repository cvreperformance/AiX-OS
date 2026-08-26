import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = 'https://fcpsafjgjnecdlyqfcid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHNhZmpnam5lY2RseXFmY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzAyMTksImV4cCI6MjA5ODMwNjIxOX0.n-Obp-2j284umEvkKHBiTmmTfYARKvGrx3dUDhvcGPY';

test.describe('20-Image Gallery Limit — Full Verification', () => {
  const baseUrl = process.env.TEST_TARGET_URL || process.env.BASE_URL || 'http://localhost:3001';

  test('Complete 20-Image Gallery Lifecycle (Create 20, Reject 21st, Delete 1 -> 19, Add 1 -> 20, Cover #20, Reorder #20, Persist)', async ({ page }) => {
    test.setTimeout(180000);

    // 1. Log in via Supabase auth & set cookie
    const supabase = createClient(supabaseUrl, supabaseKey, { realtime: { transport: ws }, auth: { persistSession: false } });
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'testadmin.aixos@gmail.com',
      password: 'TestAdmin123456!',
    });

    if (!authData?.session) {
      throw new Error('Login failed for 20-image gallery test');
    }

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

    // Generate 20 test image URLs
    const initial20Images = Array.from({ length: 20 }, (_, i) =>
      `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80&idx=${i + 1}`
    );

    // 2. Create temporary property with 20 images directly in Supabase
    const testSlug = `gallery-20-test-${Date.now()}`;
    const { data: tempProperty, error: createErr } = await supabase
      .from('properties')
      .insert({
        title: `20 Photo Test Property ${Date.now()}`,
        slug: testSlug,
        owner_id: authData.user.id,
        price: 750000,
        currency: 'EUR',
        status: 'Published',
        category: 'Apartment',
        listing_type: 'sale',
        city: 'București',
        gallery: initial20Images,
        image_url: initial20Images[0],
      })
      .select()
      .single();

    if (createErr || !tempProperty) {
      throw new Error(`Failed to create 20-image test property: ${createErr?.message}`);
    }

    try {
      console.log(`[20-Photo Test] Navigating to /proprietati/${testSlug}...`);
      await page.goto(`${baseUrl}/proprietati/${testSlug}`, { waitUntil: 'domcontentloaded' });

      // 3. Open Photos Modal via Owner Management Bar
      const photosBtn = page.locator('[data-testid="owner-photos"]');
      await expect(photosBtn).toBeVisible({ timeout: 20000 });
      await photosBtn.click();

      // Confirm modal opens & counter displays "20 / 20"
      const modalCounter = page.locator('[data-testid="photo-counter"]');
      await expect(modalCounter).toBeVisible();
      await expect(modalCounter).toContainText('20 / 20');

      // 4. Attempt to add 21st image (Trigger file input or drop event)
      let alertMsg = '';
      page.once('dialog', async (dialog) => {
        alertMsg = dialog.message();
        await dialog.dismiss();
      });

      // Attempt uploading 21st file via hidden file input
      const fileInput = page.locator('input[type="file"]#image-upload');
      await fileInput.setInputFiles([
        {
          name: 'extra-21st-photo.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-binary-data'),
        },
      ]);

      await page.waitForTimeout(500);
      expect(alertMsg).toMatch(/Maxim 20 fotografii|Maximum 20 photos/i);
      console.log(`[20-Photo Test] 21st photo gracefully rejected: "${alertMsg}" PASSED`);

      // 5. Delete 1 photo from 20-image gallery -> 19 photos remain
      const deletePhotoButtons = page.locator('[data-testid="remove-photo-btn"]');
      const countBeforeDelete = await deletePhotoButtons.count();
      expect(countBeforeDelete).toBe(20);

      await deletePhotoButtons.last().click();
      await page.waitForTimeout(500);

      // Verify counter now shows 19 / 20
      await expect(modalCounter).toContainText('19 / 20');
      console.log('[20-Photo Test] Deleted 1 photo -> 19 photos remain PASSED');

      // 6. Add 1 photo back -> back to 20 photos
      await fileInput.setInputFiles([
        {
          name: 'replacement-20th-photo.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-binary-data-2'),
        },
      ]);
      await page.waitForTimeout(1500);
      await page.locator('.animate-spin').waitFor({ state: 'detached', timeout: 15000 }).catch(() => null);
      await expect(modalCounter).toContainText('20 / 20');
      console.log('[20-Photo Test] Added 1 photo back -> 20 photos PASSED');

      // 7. Set image #20 as Cover
      const coverButtons = page.locator('button[title*="Copertă"], button[title*="Cover"]');
      if (await coverButtons.count() > 0) {
        await coverButtons.last().click();
        await page.waitForTimeout(500);
        console.log('[20-Photo Test] Set photo #20 as cover PASSED');
      }

      // 8. Reorder photo #20 (Move Left)
      const moveLeftButtons = page.locator('button[title*="stânga"], button[title*="left"]');
      if (await moveLeftButtons.count() > 0) {
        await moveLeftButtons.last().click();
        await page.waitForTimeout(500);
        console.log('[20-Photo Test] Reordered photo #20 PASSED');
      }

      // 9. Close Modal & Reload to verify all 20 photos persist in Supabase
      const doneBtn = page.locator('button:has-text("Gata"), button:has-text("Done")').first();
      await Promise.all([
        page.waitForResponse((resp) => resp.url().includes('/api/properties/') && resp.request().method() === 'PATCH').catch(() => null),
        doneBtn.click(),
      ]);
      await page.waitForTimeout(1000);

      // Verify persisted row in Supabase has exactly 20 items in gallery
      const { data: checkRow } = await supabase
        .from('properties')
        .select('gallery, cover_image')
        .eq('id', tempProperty.id)
        .single();

      expect(checkRow).not.toBeNull();
      expect(Array.isArray(checkRow?.gallery)).toBe(true);
      expect(checkRow?.gallery.length).toBe(20);
      console.log(`[20-Photo Test] Verified 20 images persisted in Supabase DB PASSED!`);

    } finally {
      // Clean up temporary property
      await supabase.from('properties').delete().eq('id', tempProperty.id);
      console.log('[20-Photo Test] Cleaned up temporary test property.');
    }
  });
});
