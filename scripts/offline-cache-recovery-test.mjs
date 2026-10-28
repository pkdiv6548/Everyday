import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const failures = [];
try {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => failures.push(error.message));

  await page.goto(base + '/offline.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    const obsolete = await caches.open('everyday-oddities-obsolete-test');
    await obsolete.put('/obsolete-test-entry', new Response('stale cache entry'));
  });

  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, { timeout: 15000 });
  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    return keys.some(key => key.startsWith('everyday-oddities-'));
  }, { timeout: 15000 });

  const cacheState = await page.evaluate(async () => {
    const keys = (await caches.keys()).filter(key => key.startsWith('everyday-oddities-'));
    const entries = await Promise.all(keys.map(async key => ({
      key,
      urls: (await (await caches.open(key)).keys()).map(request => new URL(request.url).pathname)
    })));
    return { keys, entries };
  });
  assert.ok(cacheState.keys.length >= 1, 'Expected the site cache to be created');
  const cachedPaths = cacheState.entries.flatMap(entry => entry.urls);
  assert.ok(cachedPaths.some(path => path.endsWith('/index.html') || path.endsWith('/Everyday/')), 'Homepage should be available in cache');
  assert.ok(cachedPaths.some(path => path.endsWith('/offline.html')), 'Offline fallback should be precached');
  assert.ok(cachedPaths.some(path => path.endsWith('/styles.css')), 'Core stylesheet should be precached for offline rendering');
  assert.ok(cachedPaths.some(path => path.endsWith('/app.js')), 'Core application script should be precached');
  assert.ok(!cacheState.keys.includes('everyday-oddities-obsolete-test'), 'Service Worker activation should delete obsolete site cache versions');

  await page.goto(base + '/articles/why-sky-blue.html', { waitUntil: 'domcontentloaded' });
  assert.match(await page.title(), /sky|blue|Everyday|Oddities/i, 'Cached article should render online before going offline');
  await context.setOffline(true);
  await page.goto(base + '/articles/why-sky-blue.html', { waitUntil: 'domcontentloaded' });
  assert.ok(await page.locator('body').innerText().then(text => text.trim().length > 0), 'Previously cached article should remain readable offline');

  await page.goto(base + '/p0-12-deliberately-uncached-test-route.html', { waitUntil: 'domcontentloaded' });
  const fallbackText = await page.locator('body').innerText();
  assert.match(fallbackText, /offline|इंटरनेट|जिज्ञासा/i, 'Uncached navigation offline should return the offline fallback');

  await context.setOffline(false);
  await page.goto(base + '/experiments.html', { waitUntil: 'domcontentloaded' });
  assert.ok(await page.title(), 'A normal page should load again after connectivity is restored');
  assert.deepEqual(failures, [], `Unexpected page runtime errors: ${JSON.stringify(failures)}`);
  await context.close();
  console.log('PASS — offline/cache recovery: cache installed, offline fallback precached, cached article usable offline, uncached navigation shows fallback, and navigation works after reconnect.');
} finally {
  await browser.close();
}
