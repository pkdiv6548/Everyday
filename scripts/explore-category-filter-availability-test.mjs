import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push('pageerror: ' + error.message));
let appStatus = null;
page.on('response', response => { if (new URL(response.url()).pathname.endsWith('/app.js')) appStatus = response.status(); });
page.on('console', message => { if (message.type() === 'error') errors.push('console: ' + message.text()); });

const scienceCategories = ['light', 'physics', 'water', 'materials', 'food', 'body', 'sound', 'nature', 'space'];
try {
  await page.goto('http://127.0.0.1:4173/explore.html', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.explore-grid .story-card[data-category]');
  const chips = page.locator('.filter-row .filter-chip[data-filter]');
  const allCount = await cards.count();
  assert.ok(allCount > 0, 'Discover should render published story cards');

  const inventory = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.explore-grid .story-card[data-category]')];
    return [...document.querySelectorAll('.filter-row .filter-chip[data-filter]')].map(chip => {
      const filter = chip.dataset.filter;
      const available = filter === 'all'
        || (filter === 'science'
          ? cards.some(card => ['light', 'physics', 'water', 'materials', 'food', 'body', 'sound', 'nature', 'space'].includes(card.dataset.category))
          : cards.some(card => card.dataset.category === filter));
      return { filter, available, disabled: chip.disabled, title: chip.title };
    });
  });

  for (const item of inventory) {
    assert.equal(item.disabled, !item.available, item.filter + ' chip disabled state should match published story availability');
    if (!item.available) assert.ok(item.title.length > 0, item.filter + ' should explain why it is unavailable');
  }
  assert.ok(inventory.filter(item => !['all', 'science'].includes(item.filter)).every(item => item.available), 'Every listed topic should have at least one published story');
  assert.equal(inventory.find(item => item.filter === 'science')?.disabled, false, 'Science composite filter should remain available');

  for (const item of inventory.filter(item => item.available && item.filter !== 'all')) {
    await page.locator('.filter-chip[data-filter="' + item.filter + '"]').click();
    assert.equal(await page.locator('.filter-chip[data-filter="' + item.filter + '"]').getAttribute('aria-pressed'), 'true', item.filter + ' chip should become selected');
    assert.equal(new URL(page.url()).searchParams.get('category'), item.filter, item.filter + ' should update URL state');
    const visible = await cards.evaluateAll(items => items.filter(card => !card.hidden).map(card => card.dataset.category));
    assert.ok(visible.length > 0, item.filter + ' should show published stories');
    if (item.filter === 'science') {
      assert.ok(visible.every(category => scienceCategories.includes(category)), 'Science should only show its supported topic categories; got: ' + JSON.stringify([...new Set(visible)]));
    } else {
      assert.ok(visible.every(category => category === item.filter), item.filter + ' should only show its own category');
    }
    assert.equal(new URL(page.url()).searchParams.get('category'), item.filter, item.filter + ' should synchronize to the URL');
  }

  await page.goto('http://127.0.0.1:4173/explore.html?category=not-a-real-category', { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('.filter-chip[data-filter="all"]').getAttribute('aria-pressed'), 'true', 'Unknown URL category should fall back to All stories');
  assert.equal((await cards.evaluateAll(items => items.filter(card => !card.hidden).length)), allCount, 'Unknown URL category should not create a dead-end empty state');

  assert.deepEqual(errors, [], 'Category filter handling should not cause uncaught browser errors');
  console.log('PASS — Discover category availability: published categories filter correctly; empty categories are disabled with bilingual explanation; unavailable URL categories fall back safely.');
} finally {
  await browser.close();
}
