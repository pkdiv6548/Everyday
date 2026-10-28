import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  '/', '/categories.html', '/explore.html', '/weather.html', '/time.html',
  '/future.html', '/experiments.html', '/about.html',
  '/articles/why-sky-blue.html'
];
const widths = [320, 360, 375, 390, 430, 650, 651, 768, 820, 821, 850, 851, 900, 1024, 1280, 1440, 1920];
const articleWidths = [320, 375, 768, 1024, 1440];
const articleRoutes = fs.readdirSync(new URL('../articles/', import.meta.url))
  .filter(file => file.endsWith('.html'))
  .map(file => '/articles/' + file)
  .filter(route => !routes.includes(route));
const routeChecks = [
  ...routes.map(route => ({ route, widths })),
  ...articleRoutes.map(route => ({ route, widths: articleWidths }))
];
const failures = [];
const results = [];
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => failures.push({ type: 'pageerror', url: page.url(), message: error.message }));

  for (const { route, widths: routeWidths } of routeChecks) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    assert.ok(await page.locator('body').count(), `Body missing: ${route}`);
    assert.ok(await page.locator('.site-header').count(), `Header missing: ${route}`);
    for (const width of routeWidths) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(25);
      const layout = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const header = document.querySelector('.site-header');
        const headerRect = header?.getBoundingClientRect();
        const overflowItems = [...document.querySelectorAll('body *')].map(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return { tag: el.tagName.toLowerCase(), id: el.id, className: typeof el.className === 'string' ? el.className : '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), display: style.display, position: style.position };
        }).filter(item => item.width > 0 && item.right > viewport + 1 && item.display !== 'none' && item.position !== 'fixed' && item.position !== 'absolute').sort((a,b) => b.right-a.right).slice(0,5);
        return {
          viewport,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          headerWithinViewport: !!headerRect && headerRect.left >= -1 && headerRect.right <= viewport + 1,
          overflowItems
        };
      });
      const overflow = layout.documentWidth > width + 1 || layout.bodyWidth > width + 1;
      results.push({ route, width, overflow, ...layout });
      if (overflow) failures.push({ type: 'horizontal-overflow', route, width, documentWidth: layout.documentWidth, bodyWidth: layout.bodyWidth, offenders: layout.overflowItems });
      if (!layout.headerWithinViewport) failures.push({ type: 'header-out-of-bounds', route, width });
    }
  }

  // Check the compact navigation at phone and tablet breakpoints, including both sides of the breakpoint.
  for (const width of [320, 375, 650, 651, 768, 820, 850]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    const toggle = page.locator('.menu-toggle');
    await toggle.waitFor({ state: 'visible' });
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `Menu should open at ${width}px`);
    assert.ok(await page.locator('.main-nav.open a:visible').count() > 0, `Menu links should be visible at ${width}px`);
    const firstLink = page.locator('.main-nav.open a:visible').first();
    await firstLink.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `Menu should close after navigation at ${width}px`);
  }

  if (failures.length) {
    console.error('RESPONSIVE FAILURES:', JSON.stringify(failures, null, 2));
    throw new Error(`Responsive smoke test failed with ${failures.length} issue(s).`);
  }
  const layoutCheckCount = routes.length * widths.length + articleRoutes.length * articleWidths.length;
  console.log(`PASS — responsive smoke test: ${routes.length} core routes × ${widths.length} widths plus ${articleRoutes.length} additional article routes × ${articleWidths.length} widths (${layoutCheckCount} layout checks), plus 7 mobile/tablet menu open-close checks; no horizontal overflow or header bounds failures.`);
} finally {
  await browser.close();
}
