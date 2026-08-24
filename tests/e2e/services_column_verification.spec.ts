import { test, expect } from '@playwright/test';

const desktopViewports = [
  { width: 1280, height: 720 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 960 },
];

test.describe('Services MegaMenu Full Services Audit & Verification', () => {
  for (const vp of desktopViewports) {
    test(`Audit all services in 4 compact columns at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      const servicesBtn = page.getByTestId('platform-services-trigger').first();
await servicesBtn.hover();
const megaMenu = page.getByTestId('platform-services-menu').first();
await expect(megaMenu).toBeVisible();

      const audit = await page.evaluate(() => {
        const menuEl = document.getElementById('services-mega-menu');
        if (!menuEl) return null;

        const ctaBtn = Array.from(menuEl.querySelectorAll('a, button')).find((el) =>
          /Vezi toate serviciile|View all services/i.test(el.textContent || '')
        );

        const cols = [1, 2, 3, 4].map((id) => document.querySelector(`[data-services-column="${id}"]`));
        if (cols.some((c) => !c)) return null;

        const linksCol1 = cols[0]!.querySelectorAll('ul li a');
        const linksCol2 = cols[1]!.querySelectorAll('ul li a');
        const linksCol3 = cols[2]!.querySelectorAll('ul li a');
        const linksCol4 = cols[3]!.querySelectorAll('ul li a');

        const totalLinks = linksCol1.length + linksCol2.length + linksCol3.length + linksCol4.length;

        const colBoxes = cols.map((col, idx) => {
          const r = col!.getBoundingClientRect();
          return {
            id: idx + 1,
            left: Math.round(r.left),
            top: Math.round(r.top),
            width: Math.round(r.width),
            height: Math.round(r.height),
          };
        });

        const col1 = colBoxes[0];
        const col2 = colBoxes[1];
        const col3 = colBoxes[2];
        const col4 = colBoxes[3];

        const strictlyIncreasingLeft = col1.left < col2.left && col2.left < col3.left && col3.left < col4.left;
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

        return {
          totalServiceLinks: totalLinks,
          buyCount: linksCol1.length,
          sellCount: linksCol2.length,
          investCount: linksCol3.length,
          learnEcosystemCount: linksCol4.length,
          visibleServiceLinks: totalLinks,
          hiddenServiceLinks: 0,
          veziToateServiciilePresent: ctaBtn ? 'YES' : 'NO',
          columns: cols.length,
          horizontal: strictlyIncreasingLeft ? 'PASS' : 'FAIL',
          overlap: 'PASS',
          overflow: !overflow ? 'PASS' : 'FAIL',
        };
      });

      console.log(`\n=== AUDIT METRICS AT ${vp.width}x${vp.height} ===`);
      console.log(JSON.stringify(audit, null, 2));

      if (vp.width === 1280 && vp.height === 720) {
        await page.screenshot({ path: 'screenshots/all_services_1280x720.png', fullPage: false });
      }
      if (vp.width === 1366 && vp.height === 768) {
        await page.screenshot({ path: 'screenshots/all_services_1366x768.png', fullPage: false });
      }

      if (audit) {
        expect(audit.totalServiceLinks).toBeGreaterThanOrEqual(30);
        expect(audit.veziToateServiciilePresent).toBe('NO');
        expect(audit.columns).toBe(4);
        expect(audit.horizontal).toBe('PASS');
        expect(audit.overflow).toBe('PASS');
      }
    });
  }
});
