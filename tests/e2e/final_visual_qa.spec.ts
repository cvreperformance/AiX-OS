import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1280, height: 720 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 960 },
];

test.describe('Final Visual QA — Category Card Horizontal Grid Verification', () => {
  for (const vp of viewports) {
    test(`Verify category cards horizontal grid at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Click / Hover Services button
      const servicesBtn = page.getByRole('button', { name: /Servicii|Services/i }).first();
      await servicesBtn.hover();
      const megaMenu = page.getByTestId('platform-services-menu').first();
      await expect(megaMenu).toBeVisible();

      // Measure category cards bounding boxes
      const audit = await page.evaluate(() => {
        const el = document.getElementById('services-mega-menu');
        const header = document.querySelector('header');
        if (!el || !header) return null;

        const cards = Array.from(el.querySelectorAll('.grid > div'));
        const cardBoxes = cards.map((c, idx) => {
          const r = c.getBoundingClientRect();
          return {
            idx: idx + 1,
            left: Math.round(r.left),
            top: Math.round(r.top),
            width: Math.round(r.width),
            height: Math.round(r.height),
          };
        });

        const cat1 = cardBoxes[0];
        const cat2 = cardBoxes[1];
        const cat3 = cardBoxes[2];
        const cat4 = cardBoxes[3];

        const isHorizontalGrid =
          cat2.left > cat1.left &&
          cat3.left > cat2.left &&
          cat4.left > cat3.left;

        return {
          cat1Left: cat1.left,
          cat2Left: cat2.left,
          cat3Left: cat3.left,
          cat4Left: cat4.left,
          horizontalGrid: isHorizontalGrid ? 'PASS' : 'FAIL',
        };
      });

      console.log(`\n=== CATEGORY CARDS GRID AT ${vp.width}x${vp.height} ===`);
      if (audit) {
        console.log(`CATEGORY 1 LEFT: ${audit.cat1Left}px`);
        console.log(`CATEGORY 2 LEFT: ${audit.cat2Left}px`);
        console.log(`CATEGORY 3 LEFT: ${audit.cat3Left}px`);
        console.log(`CATEGORY 4 LEFT: ${audit.cat4Left}px`);
        console.log(`HORIZONTAL GRID: ${audit.horizontalGrid}`);

        expect(audit.cat2Left).toBeGreaterThan(audit.cat1Left);
        expect(audit.cat3Left).toBeGreaterThan(audit.cat2Left);
        expect(audit.cat4Left).toBeGreaterThan(audit.cat3Left);
        expect(audit.horizontalGrid).toBe('PASS');
      }
    });
  }
});
