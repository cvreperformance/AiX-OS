import { chromium } from "playwright";
import path from "path";

async function runRealUserFlow() {
  console.log("==================================================");
  console.log("PLAYWRIGHT END-TO-END REAL USER PRODUCTION TEST");
  console.log("==================================================");
  console.log("Target: https://os.cristianvaduva.com");

  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 960 },
  });

  const page = await context.newPage();

  const networkLogs = [];
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
      console.error(`[BROWSER CONSOLE ERROR] ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
    console.error(`[BROWSER PAGE ERROR] ${err.message}`);
  });

  page.on("request", (req) => {
    if (req.url().includes("supabase") || req.url().includes("/api/")) {
      networkLogs.push({
        event: "REQUEST",
        method: req.method(),
        url: req.url(),
        postData: req.postData(),
      });
    }
  });

  page.on("response", async (res) => {
    if (res.url().includes("supabase") || res.url().includes("/api/")) {
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = "<unable to read body>";
      }
      networkLogs.push({
        event: "RESPONSE",
        method: res.request().method(),
        url: res.url(),
        status: res.status(),
        body: bodyText,
      });

      if (res.url().includes("/rest/v1/properties") || res.url().includes("/storage/v1/object")) {
        console.log(`[NETWORK ${res.request().method()}] HTTP ${res.status()} -> ${res.url()}`);
        if (res.status() >= 400) {
          console.error(`❌ NETWORK FAILURE BODY: ${bodyText}`);
        }
      }
    }
  });

  try {
    // 1. Open login page
    console.log("\n1. Navigating to https://os.cristianvaduva.com/login ...");
    await page.goto("https://os.cristianvaduva.com/login", { waitUntil: "domcontentloaded" });

    // 2. Submit credentials in real UI form
    console.log("2. Filling and submitting real login form ...");
    await page.fill('input[name="email"]', "testadmin.aixos@gmail.com");
    await page.fill('input[name="password"]', "TestAdmin123456!");
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);

    console.log("✅ LOGIN BUTTON CLICKED! CURRENT URL:", page.url());

    // 3. Navigate to property create page
    console.log("3. Navigating to /dashboard/properties/create ...");
    await page.goto("https://os.cristianvaduva.com/dashboard/properties/create", { waitUntil: "domcontentloaded" });


    const timeStamp = Date.now();
    const testTitle = `REAL BROWSER PROPERTY ${timeStamp}`;

    // STEP 1: Basic Info
    console.log("4. Filling Step 1 (Basic Information) ...");
    await page.waitForSelector('input[name="title"]', { timeout: 15000 });
    await page.fill('input[name="title"]', testTitle);
    await page.fill('textarea[name="description"]', "Real E2E Playwright user flow property creation.");
    await page.selectOption('select[name="category"]', "Apartment");
    await page.selectOption('select[name="listing_type"]', "Sale");

    // Click Next -> Step 2
    console.log("Clicking Next to Step 2 ...");
    await page.click('button:has-text("Următorul"), button:has-text("Next")');
    await page.waitForTimeout(500);

    // STEP 2: Location
    console.log("5. Filling Step 2 (Location) ...");
    await page.fill('input[name="country"]', "Romania");
    await page.fill('input[name="city"]', "Bucharest");
    await page.fill('input[name="district"]', "Sector 1");
    await page.fill('input[name="neighborhood"]', "Herastrau");
    await page.fill('input[name="address"]', "Sos. Nordului 42, Penthouse 8");

    // Click Next -> Step 3
    console.log("Clicking Next to Step 3 ...");
    await page.click('button:has-text("Următorul"), button:has-text("Next")');
    await page.waitForTimeout(500);

    // STEP 3: Details
    console.log("6. Filling Step 3 (Pricing & Technical Details) ...");
    await page.fill('input[name="price"]', "980000");
    await page.selectOption('select[name="currency"]', "EUR");
    await page.fill('input[name="usable_area"]', "160");
    await page.fill('input[name="rooms"]', "4");
    await page.fill('input[name="bedrooms"]', "3");
    await page.fill('input[name="bathrooms"]', "3");

    // Click Next -> Step 4
    console.log("Clicking Next to Step 4 ...");
    await page.click('button:has-text("Următorul"), button:has-text("Next")');
    await page.waitForTimeout(500);

    // STEP 4: Images
    console.log("7. Uploading 3 real images in Step 4 ...");
    const img1 = path.resolve("scratch/img1.jpg");
    const img2 = path.resolve("scratch/img2.jpg");
    const img3 = path.resolve("scratch/img3.jpg");

    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector);
    const fileInput = await page.$(fileInputSelector);
    await fileInput.setInputFiles([img1, img2, img3]);

    console.log("Waiting 6 seconds for images to finish uploading to Supabase Storage ...");
    await page.waitForTimeout(6000);

    // 8. Click Publish Now
    console.log("8. Clicking REAL Publish button ...");
    const publishButton = page.locator('button:has-text("Publică"), button:has-text("Publish Now")').last();
    await publishButton.click();

    console.log("Waiting 6 seconds for database insert and page transition ...");
    await page.waitForTimeout(6000);

    console.log("URL AFTER PUBLISH:", page.url());

    // 9. Inspect network logs for /rest/v1/properties
    const propInserts = networkLogs.filter(l => l.url.includes("/rest/v1/properties"));
    console.log("\n==================================================");
    console.log("CAPTURED /rest/v1/properties REQUESTS:");
    console.log("==================================================");
    console.log(JSON.stringify(propInserts, null, 2));

    // 10. Check Console & Page Errors
    console.log("\n==================================================");
    console.log("CONSOLE & PAGE ERRORS REPORT:");
    console.log("==================================================");
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);

    await browser.close();
  } catch (err) {
    console.error("❌ BROWSER USER FLOW ERROR:", err);
    await browser.close();
    process.exit(1);
  }
}

runRealUserFlow().catch(console.error);
