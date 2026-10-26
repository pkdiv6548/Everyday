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
  const base = 'http://127.0.0.1:4173/explore.html';
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const search = page.locator('#story-search');
  const sort = page.locator('#story-sort');
  const cards = page.locator('.explore-grid .story-card[data-category]');
  const visibleCards = () => cards.evaluateAll(items => items.filter(item => !item.hidden));
  const titles = async () => (await visibleCards()).map(item => item.querySelector('h2,h3,.story-title')?.textContent.trim() || item.textContent.trim());

  const allCount = await cards.count();
  assert.ok(allCount > 0, 'Discover should render story cards');

  // Search should match card metadata/content and update URL state.
  await search.fill('stars');
  const searchResults = await visibleCards();
  assert.ok(searchResults.length > 0 && searchResults.length < allCount, 'Search should narrow the story list');
  assert.match(new URL(page.url()).searchParams.get('q') || '', /stars/i, 'Search query should be represented in the URL');

  // Category selection must combine with the current search, not replace it.
  await page.locator('.filter-chip[data-filter="space"]').click();
  assert.equal(await page.locator('.filter-chip[data-filter="space"]').getAttribute('aria-pressed'), 'true');
  const filtered = await visibleCards();
  assert.ok(filtered.length > 0, 'Search + Space category should have matching results');
  assert.ok(filtered.every(item => item.dataset.category === 'space'), 'Every visible result must belong to selected category');
  assert.equal(new URL(page.url()).searchParams.get('category'), 'space', 'Category should be in URL');

  // Sorting should affect state and visible ordering.
  await sort.selectOption('az');
  assert.equal(new URL(page.url()).searchParams.get('sort'), 'az', 'Sort mode should be in URL');
  const azTitles = await titles();
  const normalized = values => values.map(value => value.toLocaleLowerCase());
  assert.deepEqual(normalized(azTitles), [...normalized(azTitles)].sort((a,b) => a.localeCompare(b)), 'A–Z sort should order visible cards by title');

  await sort.selectOption('za');
  const zaTitles = await titles();
  assert.deepEqual(normalized(zaTitles), [...normalized(zaTitles)].sort((a,b) => b.localeCompare(a)), 'Z–A sort should order visible cards by title');

  // Reload the URL to ensure search/category/sort are restored from query parameters.
  const stateUrl = new URL(page.url());
  await page.goto(stateUrl.toString(), { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('#story-search').inputValue(), 'stars', 'Search query should restore after navigation/reload');
  assert.equal(await page.locator('#story-sort').inputValue(), 'za', 'Sort mode should restore after navigation/reload');
  assert.equal(await page.locator('.filter-chip[data-filter="space"]').getAttribute('aria-pressed'), 'true', 'Category should restore after navigation/reload');
  assert.ok((await visibleCards()).every(item => item.dataset.category === 'space'), 'Restored category should filter visible cards');

  // Invalid query values should not break rendering; defaults should be used where appropriate.
  await page.goto(base + '?q=stars&category=not-a-category&sort=invalid', { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('#story-search').inputValue(), 'stars', 'Valid search should restore even with invalid other parameters');
  assert.equal(await page.locator('#story-sort').inputValue(), 'featured', 'Invalid sort should fall back to Featured');
  assert.equal(await page.locator('.filter-chip[data-filter="all"]').getAttribute('aria-pressed'), 'true', 'Invalid category should fall back to All stories');

  // Reset clears all state and restores all story cards.
  await page.locator('#clear-filters').click();
  assert.equal(await page.locator('#story-search').inputValue(), '');
  assert.equal(await sort.inputValue(), 'featured');
  assert.equal(await page.locator('.filter-chip[data-filter="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal((await visibleCards()).length, allCount, 'Reset should restore all story cards');
  assert.equal(new URL(page.url()).search, '', 'Reset should clear URL query parameters');

  assert.deepEqual(errors, [], 'Discover regression test should not produce unexpected browser errors');
  console.log('PASS — Discover/search regressions: matching, combined filters, A–Z/Z–A ordering, URL synchronization and restoration, invalid URL values, reset, and runtime errors.');
} finally {
  await browser.close();
}
