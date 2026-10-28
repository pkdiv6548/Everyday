import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) errors.push(message.text());
});

try {
  await page.goto('http://127.0.0.1:4173/explore.html', { waitUntil: 'domcontentloaded' });
  const search = page.locator('#story-search');
  const cards = page.locator('.explore-grid .story-card[data-category]');
  const visibleCount = () => cards.evaluateAll(items => items.filter(item => !item.hidden).length);
  const emptyState = page.locator('.empty-state');

  assert.ok(await cards.count() > 0, 'Discover should have story cards initially');

  await search.fill('no-such-story-term-9f4c2');
  assert.equal(await visibleCount(), 0, 'A query with no matches should hide every story card');
  assert.equal(await emptyState.isVisible(), true, 'No-results message should be visible for an empty search');
  assert.match(await page.locator('#story-results').textContent(), /0/, 'Results status should report zero matches');

  await search.fill('sky');
  assert.ok(await visibleCount() > 0, 'A matching query should recover results');
  assert.equal(await emptyState.isVisible(), false, 'No-results message should hide when results return');

  await search.fill('sky & stars');
  assert.equal(new URL(page.url()).searchParams.get('q'), 'sky & stars', 'Queries containing spaces and ampersands should survive URL encoding');

  const encodedQueryUrl = page.url();
  await page.locator('#explore-search button[type="submit"]').click();
  assert.equal(page.url(), encodedQueryUrl, 'Submitting a special-character query should not navigate away');
  assert.equal(await search.inputValue(), 'sky & stars', 'Button submission should preserve the exact query');

  await search.fill('sky');
  const matchingQueryUrl = page.url();
  assert.ok(await visibleCount() > 0, 'A matching query should show results before submission');
  await page.locator('#explore-search button[type="submit"]').click();
  assert.equal(page.url(), matchingQueryUrl, 'Search-button submission should filter in place without navigating away');
  assert.equal(await search.inputValue(), 'sky', 'Button submission should preserve a matching query');
  assert.ok(await visibleCount() > 0, 'Matching results should remain usable after button submission');

  await search.press('Enter');
  assert.equal(page.url(), matchingQueryUrl, 'Submitting search with Enter should not trigger a full-page navigation');
  assert.equal(await search.inputValue(), 'sky', 'Enter submission should preserve the matching query');
  assert.ok(await visibleCount() > 0, 'Matching results should remain usable after Enter submission');

  assert.deepEqual(errors, [], 'Discover edge-case search tests should not produce unexpected browser errors');
  console.log('PASS — Discover search edge cases: zero results, empty-state visibility, result counter, recovery, encoded query strings, and runtime errors.');
} finally {
  await browser.close();
}
