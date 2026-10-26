import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const routes = [
  '/', '/categories.html', '/explore.html', '/weather.html', '/time.html',
  '/future.html', '/experiments.html', '/about.html',
  '/articles/why-sky-blue.html'
];
const widths = [320, 375, 768, 1024, 1440];
const browser = await chromium.launch({ headless: true });
const failures = [];
const report = [];
try {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => failures.push({ type: 'pageerror', page: page.url(), message: error.message }));
  page.on('response', response => {
    if (response.status() >= 400 && new URL(response.url()).origin === new URL(base).origin) {
      failures.push({ type: 'local-http-error', status: response.status(), url: response.url() });
    }
  });
  for (const route of routes) {
    const errorsBefore = failures.length;
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    assert.ok(await page.title(), `Missing document title on ${route}`);
    assert.ok(await page.locator('body').count(), `Body missing on ${route}`);
    const mainCount = await page.locator('main').count();
    if (route !== '/articles/why-sky-blue.html') assert.ok(mainCount > 0, `Main landmark missing on ${route}`);
    const missingAlt = await page.locator('img:not([alt])').count();
    assert.equal(missingAlt, 0, `Images without alt attribute on ${route}: ${missingAlt}`);
    const brokenImages = await page.locator('img').evaluateAll(imgs => imgs
      .filter(img => img.complete && img.naturalWidth === 0)
      .map(img => img.getAttribute('src')));
    assert.deepEqual(brokenImages, [], `Broken loaded images on ${route}: ${JSON.stringify(brokenImages)}`);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(50);
      const layout = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll('body *')].map(el => {
          const rect = el.getBoundingClientRect();
          return { tag: el.tagName.toLowerCase(), id: el.id, className: typeof el.className === 'string' ? el.className : '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), display: getComputedStyle(el).display };
        }).filter(el => el.width > 0 && el.right > viewport + 1 && el.display !== 'none').sort((a,b) => b.right-a.right).slice(0,8);
        return { viewport, document: document.documentElement.scrollWidth, title: document.title, offenders };
      });
      report.push({ route, width, documentWidth: layout.document, overflow: layout.document > layout.viewport + 1, offenders: layout.offenders });
    }
    const navLinks = await page.locator('.main-nav a').count();
    assert.ok(navLinks > 0, `Primary navigation links missing on ${route}`);
    if (failures.length > errorsBefore) {
      throw new Error(`Local HTTP/page errors while opening ${route}: ${JSON.stringify(failures.slice(errorsBefore))}`);
    }
  }
  const overflows = report.filter(item => item.overflow);
  if (overflows.length) {
    console.error('RESPONSIVE OVERFLOW CANDIDATES:', JSON.stringify(overflows));
    failures.push(...overflows.map(item => ({ type: 'horizontal-overflow', ...item })));
  }
  assert.deepEqual(failures, [], `Site smoke test failures: ${JSON.stringify(failures)}`);
  console.log(`PASS — site smoke test: ${routes.length} routes, ${widths.length} viewport widths per route, local HTTP errors, image loading/alt attributes, primary navigation, and horizontal overflow.`);
} finally {
  await browser.close();
}
