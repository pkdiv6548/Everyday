import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ serviceWorkers: 'block' });
const errors = [];
try {
  const validPage = await context.newPage();
  validPage.on('pageerror', error => errors.push(error.message));
  await validPage.goto('http://127.0.0.1:4173/story.html?slug=why-sky-blue', { waitUntil: 'domcontentloaded' });
  await validPage.waitForURL('**/articles/why-sky-blue.html', { timeout: 10000 });
  assert.match(await validPage.locator('main h1').textContent(), /sky blue/i, 'A valid static article slug should open its article page');
  assert.ok(await validPage.locator('.article-content').count(), 'A valid slug should render readable article content');

  const invalidPage = await context.newPage();
  invalidPage.on('pageerror', error => errors.push(error.message));
  await invalidPage.goto('http://127.0.0.1:4173/story.html?slug=not-a-real-story', { waitUntil: 'domcontentloaded' });
  await invalidPage.waitForSelector('.story-route-fallback');
  assert.equal((await invalidPage.locator('main h1').textContent()).trim(), 'Story not found');
  assert.equal(await invalidPage.locator('.story-route-fallback a[href="explore.html"]').count(), 1, 'Invalid slug should offer a Discover fallback');
  assert.equal(invalidPage.url().includes('/articles/'), false, 'Invalid slug must not redirect to an unrelated route');

  const malformedPage = await context.newPage();
  malformedPage.on('pageerror', error => errors.push(error.message));
  await malformedPage.goto('http://127.0.0.1:4173/story.html?slug=..%2Findex', { waitUntil: 'domcontentloaded' });
  await malformedPage.waitForSelector('.story-route-fallback');
  assert.equal((await malformedPage.locator('main h1').textContent()).trim(), 'Story not found', 'Malformed slug must be rejected safely');

  const missingPage = await context.newPage();
  missingPage.on('pageerror', error => errors.push(error.message));
  await missingPage.goto('http://127.0.0.1:4173/story.html', { waitUntil: 'domcontentloaded' });
  await missingPage.waitForSelector('.story-route-fallback');
  assert.equal((await missingPage.locator('main h1').textContent()).trim(), 'Story not found', 'Missing slug should render a helpful fallback');

  assert.deepEqual(errors, [], 'Story routes should not produce uncaught browser errors');
  console.log('PASS — story routes: valid static article slug redirects to content; unknown, malformed, and missing slugs show a safe Discover fallback.');
} finally {
  await browser.close();
}
