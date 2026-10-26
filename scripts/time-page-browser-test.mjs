import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
const page = await context.newPage();
const requests = [];
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', error => consoleErrors.push(error.message));

await page.route('https://api.sunrisesunset.io/**', route => {
  requests.push(route.request().url());
  return route.fulfill({ json: { results: { sunrise: '06:20:00', sunset: '17:45:00', day_length: '11:25:00', date: '2026-10-26' } } });
});
await page.route('https://earthquake.usgs.gov/**', route => {
  requests.push(route.request().url());
  return route.fulfill({ json: { features: [{ properties: { place: 'Test location', time: 1793000000000, mag: 4.2 } }] } });
});
await page.route('https://api.frankfurter.dev/**', route => {
  requests.push(route.request().url());
  return route.fulfill({ json: [{ date: '2026-10-23', base: 'EUR', quote: 'INR', rate: 102.5 }, { date: '2026-10-23', base: 'EUR', quote: 'USD', rate: 1.16 }] });
});
await page.route('https://nagerholidays.com/**', route => {
  requests.push(route.request().url());
  return route.fulfill({ json: [{ date: '2026-11-01', name: 'Test Holiday', countryCode: 'IN' }] });
});

try {
  await page.goto('http://127.0.0.1:4173/time.html', { waitUntil: 'domcontentloaded' });
  await Promise.all([page.waitForSelector('#currency-list .data-row'), page.waitForSelector('#earthquake-list .data-row'), page.waitForSelector('#holiday-list .data-row')]);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('skip-link')), true, 'Keyboard focus should start at the skip link');
  assert.equal(await page.locator('#zone-select').getAttribute('aria-label'), 'Time zone');
  assert.notEqual(await page.locator('#local-clock').textContent(), '--:--:--');
  assert.equal(await page.locator('#sunrise').textContent(), '06:20:00');
  assert.equal(await page.locator('#currency-list').getByText('1 EUR → INR').count(), 1);
  assert.equal(await page.locator('#holiday-list').getByText('Test Holiday').count(), 1);
  assert.equal(await page.locator('#quick-zones').getByText('Sydney · Australia').count(), 1);

  const requestsBeforeLanguageChange = requests.length;
  await page.locator('.lang-toggle').click();
  await page.waitForFunction(() => document.documentElement.lang === 'hi');
  assert.equal(requests.length, requestsBeforeLanguageChange, 'Changing language must not refetch APIs');
  assert.equal(await page.locator('#local-clock-heading').textContent(), 'आपके डिवाइस का समय');

  await page.locator('.theme-toggle').click();
  assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dark-mode')), true);

  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(80);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(overflow, false, `Unexpected horizontal overflow at viewport width ${width}px`);
  }

  await page.route('https://api.frankfurter.dev/**', route => route.abort());
  await page.locator('#refresh-data').click();
  await page.waitForFunction(() => document.querySelector('#currency-status').textContent.includes('unavailable') || document.querySelector('#currency-status').textContent.includes('उपलब्ध नहीं'));
  assert.notEqual(await page.locator('#currency-list').textContent(), '');
  assert.deepEqual(consoleErrors, [], 'Browser should not report console/page errors');
  const offlineContext = await browser.newContext({ serviceWorkers: 'allow' });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto('http://127.0.0.1:4173/time.html', { waitUntil: 'domcontentloaded' });
  await Promise.race([offlinePage.evaluate(() => navigator.serviceWorker.ready.then(() => true)), new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker did not become ready')), 20000))]);
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await offlinePage.title(), 'Time & Open Data | Everyday Oddities', 'Time page should reload from the service-worker cache offline');
  await offlineContext.setOffline(false);
  await offlineContext.close();
  console.log('PASS — Time page browser integration: mocked API success, language-switch request count, keyboard focus, dark theme, responsive widths, API failure state, and offline reload.');
} finally {
  await browser.close();
}
