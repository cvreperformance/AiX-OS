import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', {waitUntil: 'networkidle2'});
  // Hover over the Services button (text might be 'Servicii' or 'Platform Services')
  const buttonSelector = 'a[href="#"]:contains("Servicii"), button:contains("Servicii"), *:contains("Servicii")';
  // Use XPath to find element containing the text Servicii
  const [button] = await page.$x("//a[contains(., 'Servicii') or //button[contains(., 'Servicii')]]");
  if (button) {
    await button.hover();
    await page.waitForTimeout(300); // wait for menu to appear
    // Find MegaMenu wrapper by class
    const menus = await page.$x("//div[contains(@class, 'top-full') and contains(@class, 'left-1/2')]");
    console.log('Menus found:', menus.length);
    if (menus.length > 0) {
      const menu = menus[0];
      const computed = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          transform: style.transform,
          overflow: style.overflow,
          overflowX: style.overflowX,
          overflowY: style.overflowY,
          zIndex: style.zIndex,
          position: style.position,
          clipPath: style.clipPath,
          filter: style.filter,
          backdropFilter: style.backdropFilter,
          pointerEvents: style.pointerEvents,
          width: style.width,
          height: style.height,
          top: style.top,
          left: style.left,
        };
      }, menu);
      console.log('Computed style:', JSON.stringify(computed, null, 2));
      const outerHTML = await page.evaluate(el => el.outerHTML.slice(0,200), menu);
      console.log('OuterHTML snippet:', outerHTML);
    }
  } else {
    console.log('Button not found');
  }
  await browser.close();
})();
