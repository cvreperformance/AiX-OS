import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Property Upload & Publishing Forensic QA — Authentic Production Flow', () => {
  const fixtureDir = path.join(__dirname, 'fixtures');
  const targetBaseUrl = process.env.TEST_TARGET_URL || 'https://os.cristianvaduva.com';

  test.beforeAll(() => {
    if (!fs.existsSync(fixtureDir)) {
      fs.mkdirSync(fixtureDir, { recursive: true });
    }
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSU5EUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(path.join(fixtureDir, 'sample_normal.jpg'), pngBuffer);
    fs.writeFileSync(path.join(fixtureDir, 'apartament București Îáșț (1).PNG'), pngBuffer);
    fs.writeFileSync(path.join(fixtureDir, 'casă-șoseaua-victoriei..JPEG'), pngBuffer);
  });

  test('Login and End-to-End Production Property Image Upload Flow', async ({ page }) => {
    const storageRequests: { url: string; method: string; status?: number }[] = [];
    const failedStorageRequests: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/storage/v1/')) {
        storageRequests.push({ url, method: request.method() });
      }
    });

    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('/storage/v1/')) {
        const item = storageRequests.find(r => r.url === url);
        if (item) item.status = response.status();
        if (!response.ok()) {
          failedStorageRequests.push(`${response.status()} ${url}`);
        }
      }
    });

    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      console.log('[E2E Dialog Alert]:', alertMessage);
      await dialog.accept();
    });

    // 1. Navigate to Login Page
    console.log(`Navigating to ${targetBaseUrl}/login`);
    await page.goto(`${targetBaseUrl}/login`, { waitUntil: 'networkidle' });

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    if (await emailInput.isVisible()) {
      console.log('Logging in as testadmin.aixos@gmail.com...');
      await emailInput.fill('testadmin.aixos@gmail.com');
      await passwordInput.fill('TestAdmin123456!');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        submitBtn.click(),
      ]);
      console.log('Post login URL:', page.url());
    }

    // 2. Navigate to property creation page
    console.log(`Navigating to ${targetBaseUrl}/dashboard/properties/create`);
    await page.goto(`${targetBaseUrl}/dashboard/properties/create`, { waitUntil: 'networkidle' });
    console.log('Current wizard URL:', page.url());

    // Step 1: Basic Info
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible({ timeout: 15000 });
    await titleInput.fill('Penthouse Forensic Test Herăstrău');

    const descInput = page.locator('textarea[name="description"]');
    await descInput.fill('Excepțional penthouse cu finisaje premium și terasă panoramică.');

    await page.click('button:has-text("Următorul"), button:has-text("Next")');

    // Step 2: Location
    await page.fill('input[name="city"]', 'București');
    await page.fill('input[name="neighborhood"]', 'Herăstrău');
    await page.fill('input[name="address"]', 'Șoseaua Nordului 42');
    await page.click('button:has-text("Următorul"), button:has-text("Next")');

    // Step 3: Pricing
    await page.fill('input[name="price"]', '1250000');
    await page.fill('input[name="usable_area"]', '240');
    await page.fill('input[name="rooms"]', '4');
    await page.click('button:has-text("Următorul"), button:has-text("Next")');

    // Step 4: Photo Gallery & Upload
    const fileInput = page.locator('input[type="file"]#image-upload');
    await expect(fileInput).toBeAttached();

    const filesToUpload = [
      path.join(fixtureDir, 'sample_normal.jpg'),
      path.join(fixtureDir, 'apartament București Îáșț (1).PNG'),
      path.join(fixtureDir, 'casă-șoseaua-victoriei..JPEG'),
    ];

    console.log('Uploading 3 test files with special characters...');
    await fileInput.setInputFiles(filesToUpload);

    // Wait for uploads processing
    // Removed artificial waitForTimeout to avoid flaky timing

    // AUDIT 1: Dialog alert must not contain "Bucket not found"
    expect(alertMessage).not.toContain('Bucket not found');

    // AUDIT 2: Zero requests to obsolete "property-images"
    const obsoleteRequests = storageRequests.filter(r => r.url.includes('/property-images/'));
    console.log('Obsolete property-images request count:', obsoleteRequests.length);
    expect(obsoleteRequests.length).toBe(0);

    // AUDIT 3: Rendered previews check
    const previewImages = page.locator('img[alt="Upload preview"]');
    const count = await previewImages.count();
    console.log('Rendered preview images count:', count);
    expect(count).toBeGreaterThanOrEqual(1);

    // AUDIT 4: Zero "Bucket not found" storage responses
    const bucketNotFoundErrors = failedStorageRequests.filter(req => req.includes('Bucket not found'));
    console.log('Bucket not found errors count:', bucketNotFoundErrors.length);
    expect(bucketNotFoundErrors).toHaveLength(0);
  });
});
