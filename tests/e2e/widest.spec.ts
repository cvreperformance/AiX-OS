import { test, expect } from '@playwright/test';

test.describe('Widest element measurement', () => {
  const viewports = [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 393, height: 852 },
  ];

  for (const vp of viewports) {
    test(`Viewport ${vp.width}x${vp.height}`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize(vp);
      // Navigate with minimal waiting to avoid masking persistent requests
      await page.goto('/videos', { waitUntil: 'domcontentloaded' });
      // waitForLoadState removed – waiting for main ensures page ready
      // Ensure the main container is rendered before measuring
      await page.waitForSelector('main');

      const result = await page.evaluate(() => {
        let maxW = 0;
        let maxEl: Element | null = null;
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > maxW) {
            maxW = rect.width;
            maxEl = el;
          }
        });
        if (!maxEl) return null;
        const rect = (maxEl as Element).getBoundingClientRect();
        const styles = window.getComputedStyle(maxEl as Element);
        const parent = (maxEl as Element).parentElement;
        return {
          tag: (maxEl as Element).tagName,
          id: (maxEl as Element).id,
          className: (maxEl as Element).className,
          parentTag: parent?.tagName,
          parentId: parent?.id,
          parentClass: parent?.className,
          outerHTML: (maxEl as Element).outerHTML.slice(0, 300),
          width: rect.width,
          left: rect.left,
          right: rect.right,
          position: styles.position,
          transform: styles.transform,
          computedStyles: {
            overflowX: styles.overflowX,
            overflowY: styles.overflowY,
            display: styles.display,
          },
        };
      });

      console.log('VIEWPORT', vp.width, 'x', vp.height);
      console.log('TAG:', result?.tag);
      console.log('ID:', result?.id);
      console.log('CLASS:', result?.className);
      console.log('PARENT TAG:', result?.parentTag);
      console.log('PARENT ID:', result?.parentId);
      console.log('PARENT CLASS:', result?.parentClass);
      console.log('OUTER HTML:', result?.outerHTML);
      console.log('WIDTH:', result?.width);
      console.log('LEFT:', result?.left);
      console.log('RIGHT:', result?.right);
      console.log('POSITION:', result?.position);
      console.log('TRANSFORM:', result?.transform);
      console.log('COMPUTED STYLES:', result?.computedStyles);

      // Allow 1px tolerance for sub‑pixel rounding
      expect(result?.width).toBeLessThanOrEqual(vp.width + 1);
    });
  }
});

/** Utility to generate a unique selector for debugging */
function getUniqueSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const path = [];
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(/\s+/).filter(Boolean).join('.');
      selector += `.${classes}`;
    }
    const siblings = el.parentElement?.children;
    if (siblings && siblings.length > 1) {
      const index = Array.from(siblings).indexOf(el) + 1;
      selector += `:nth-child(${index})`;
    }
    path.unshift(selector);
    el = el.parentElement!;
  }
  return path.join(' > ');
}
