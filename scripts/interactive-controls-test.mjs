import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) errors.push(message.text());
});

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });

  const menu = page.locator('.menu-toggle');
  const nav = page.locator('.main-nav');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true', 'Mobile menu should announce expanded state');
  assert.equal(await nav.evaluate(el => el.classList.contains('open')), true, 'Mobile menu should open');
  await nav.locator('a[href="explore.html"]').click();
  await page.waitForURL('**/explore.html');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false', 'Selecting a navigation link should close the mobile menu');
  assert.equal(await nav.evaluate(el => el.classList.contains('open')), false, 'Navigation panel should close after link selection');

  const theme = page.locator('.theme-toggle');
  const beforeTheme = await page.locator('body').evaluate(el => el.classList.contains('dark-mode'));
  await theme.click();
  assert.notEqual(await page.locator('body').evaluate(el => el.classList.contains('dark-mode')), beforeTheme, 'Theme button should toggle dark mode');
  assert.equal(await theme.getAttribute('aria-pressed'), String(!beforeTheme), 'Theme button aria-pressed should match current state');

  const lang = page.locator('.lang-toggle');
  const beforeLanguage = await page.locator('html').getAttribute('lang');
  await lang.click();
  const afterLanguage = beforeLanguage === 'hi' ? 'en' : 'hi';
  assert.equal(await page.locator('html').getAttribute('lang'), afterLanguage, 'Language button should switch document language');
  assert.equal(await lang.getAttribute('aria-label'), afterLanguage === 'hi' ? 'Switch to English' : 'Switch to Hindi', 'Language button accessible name should match its action');

  const search = page.locator('#story-search');
  const cards = page.locator('.explore-grid .story-card[data-category]');
  const initialCount = await cards.count();
  assert.ok(initialCount > 0, 'Discover page should contain story cards');
  await search.fill('stars');
  const searchedCount = await cards.evaluateAll(items => items.filter(item => !item.hidden).length);
  assert.ok(searchedCount > 0 && searchedCount < initialCount, 'Search should reduce the visible story set');
  assert.match(page.url(), /[?&]q=stars/, 'Search state should be reflected in the URL');

  await page.locator('.filter-chip[data-filter="space"]').click();
  assert.equal(await page.locator('.filter-chip[data-filter="space"]').getAttribute('aria-pressed'), 'true', 'Selected category should announce pressed state');
  const spaceVisible = await cards.evaluateAll(items => items.filter(item => !item.hidden).every(item => item.dataset.category === 'space'));
  assert.equal(spaceVisible, true, 'Combined search/category filtering should only show matching Space stories');

  await page.locator('#story-sort').selectOption('az');
  assert.match(page.url(), /[?&]sort=az/, 'Sort state should be reflected in the URL');
  await page.locator('#clear-filters').click();
  assert.equal(await search.inputValue(), '', 'Clear filters should reset search input');
  assert.equal(await page.locator('#story-sort').inputValue(), 'featured', 'Clear filters should restore Featured sorting');
  assert.equal(await page.locator('.filter-chip[data-filter="all"]').getAttribute('aria-pressed'), 'true', 'Clear filters should reactivate All stories');
  assert.equal(await cards.evaluateAll(items => items.filter(item => !item.hidden).length), initialCount, 'Clear filters should restore all stories');
  assert.equal(new URL(page.url()).search, '', 'Clear filters should remove query parameters');

  const firstStory = page.locator('.explore-grid .story-card[data-category]').first();
  const storyHref = await firstStory.getAttribute('href');
  assert.ok(storyHref && storyHref.startsWith('articles/'), 'Story cards should link to an article route');
  await firstStory.click();
  await page.waitForURL('**/articles/**');
  assert.ok(await page.locator('main h1').textContent(), 'Article route should render a headline');
  assert.ok(await page.locator('.article-content').count(), 'Article route should render readable article content');
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true', 'Mobile menu should open before returning from an article');
  await page.locator('.main-nav a[href="../explore.html"]').click();
  await page.waitForURL('**/explore.html');

  assert.deepEqual(errors, [], 'Navigation and controls should not produce browser runtime errors');
  console.log('PASS — interactive controls: mobile navigation open/close, theme toggle, language toggle, Discover search/filter/sort/reset, URL state, article card/detail/back navigation, accessibility state, and browser runtime errors.');
} finally {
  await browser.close();
}
