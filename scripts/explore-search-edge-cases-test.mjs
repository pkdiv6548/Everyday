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

  await search.fill('StArS');
  assert.ok(await visibleCount() > 0, 'Search should match results regardless of keyword casing');
  assert.equal(await emptyState.isVisible(), false, 'Mixed-case matching should hide the no-results message');

  await search.fill('');
  assert.equal(await visibleCount(), await cards.count(), 'An empty query should restore all story cards');
  assert.equal(await emptyState.isVisible(), false, 'An empty query should hide the no-results message');
  assert.equal(new URL(page.url()).searchParams.has('q'), false, 'An empty query should remove q from the URL');

  await search.fill('sky & stars');
  assert.equal(new URL(page.url()).searchParams.get('q'), 'sky & stars', 'Queries containing spaces and ampersands should survive URL encoding');

  assert.deepEqual(errors, [], 'Discover edge-case search tests should not produce unexpected browser errors');
  console.log('PASS — Discover search edge cases: zero results, empty-state visibility, result counter, recovery, encoded query strings, and runtime errors.');
} finally {
  await browser.close();
}
