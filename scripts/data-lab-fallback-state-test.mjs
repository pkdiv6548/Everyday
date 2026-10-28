import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
const page = await context.newPage();
const pageErrors = [];

page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.route('https://**/*', async route => {
    const url = new URL(route.request().url());

    // Keep one request pending briefly so the initial loading state can be observed.
    if (url.hostname === 'science.nasa.gov') {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      return;
    }

    // Empty responses exercise the Food panel's no-results/error handling.
    if (url.hostname === 'search.openfoodfacts.org') {
      await route.fulfill({ json: { hits: [] } });
      return;
    }
    if (url.hostname === 'world.openfoodfacts.org') {
      await route.fulfill({ json: { products: [] } });
      return;
    }
    if (url.hostname === 'api.nal.usda.gov') {
      await route.fulfill({ json: { foods: [] } });
      return;
    }

    // Force every Events/news source to fail or return no stories.
    if (url.hostname === 'api.gdeltproject.org') {
      await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
      return;
    }
    if (url.hostname === 'news.google.com' || url.hostname === 'proxy.cors.dev') {
      await route.fulfill({ status: 503, contentType: 'application/xml', body: '<error />' });
      return;
    }
    if (url.hostname === 'hn.algolia.com') {
      await route.fulfill({ json: { hits: [] } });
      return;
    }

    // Other initial providers fail deterministically; their panels should handle this gracefully.
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
  });

  await page.goto('http://127.0.0.1:4173/data-lab.html', {
    waitUntil: 'domcontentloaded',
    timeout: 20000
  });

  const initialNasaStatus = (await page.locator('#nasa-status').textContent() || '').trim();
  assert.equal(initialNasaStatus, 'Loading', 'NASA panel should expose its loading state while its request is pending.');

  await page.locator('#food-query').fill('empty-response-test');
  await page.locator('#food-form button[type="submit"]').click();
  await page.waitForFunction(
    () => document.querySelector('#food-status')?.classList.contains('bad'),
    null,
    { timeout: 10000 }
  );
  assert.match(
    (await page.locator('#food-status').textContent() || ''),
    /unavailable/i,
    'Food panel should show a clear failure status when all providers return empty results.'
  );
  assert.equal(
    await page.locator('#food-results .api-list-result').count(),
    0,
    'Food panel should not render result cards for empty provider responses.'
  );

  await page.locator('#events-query').fill('forced-news-failure-test');
  await page.locator('#events-form button[type="submit"]').click();
  await page.waitForFunction(
    () => document.querySelector('#events-status')?.classList.contains('bad'),
    null,
    { timeout: 15000 }
  );
  assert.match(
    (await page.locator('#events-status').textContent() || ''),
    /unavailable|error|failed/i,
    'Events panel should report failure after GDELT, Google News RSS, proxy, and Hacker News return no usable data.'
  );
  assert.equal(
    await page.locator('#events-results .news-article').count(),
    0,
    'Events panel should not render news cards when every source fails.'
  );

  assert.deepEqual(pageErrors, [], 'Data Lab loading and error-state tests should not produce uncaught browser errors.');
  console.log('PASS — Data Lab loading, empty-response, total-news-failure, and error-state browser tests.');
} finally {
  await browser.close();
}
