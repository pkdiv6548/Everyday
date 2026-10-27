import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  '/', '/categories.html', '/explore.html', '/weather.html', '/time.html',
  '/future.html', '/experiments.html', '/about.html',
  '/articles/why-sky-blue.html'
];
const failures = [];
const browser = await chromium.launch({ headless: true });

function rgb(value) {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] === undefined ? 1 : Number(match[4]) };
}
function luminance(color) {
  const channel = value => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}
function contrast(foreground, background) {
  const fg = rgb(foreground), bg = rgb(background);
  if (!fg || !bg || bg.a === 0 || fg.a === 0) return null;
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

try {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => failures.push({ type: 'pageerror', url: page.url(), message: error.message }));

  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('eo-theme', 'light'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    const toggle = page.locator('.theme-toggle').first();
    await toggle.waitFor({ state: 'visible' });
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dark-mode')), false, `Light theme should initialize on ${route}`);

    const lightBackground = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    await toggle.click();
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dark-mode')), true, `Dark theme should activate on ${route}`);
    assert.equal(await page.evaluate(() => localStorage.getItem('eo-theme')), 'dark', `Dark theme should persist on ${route}`);
    assert.equal(await toggle.getAttribute('aria-pressed'), 'true', `Theme button aria-pressed should be true on ${route}`);
    assert.equal(await toggle.getAttribute('aria-label'), 'Switch to light theme', `Theme button label should describe next action on ${route}`);
    assert.ok(await toggle.locator('svg').count(), `Theme icon SVG should render on ${route}`);

    const themeMetrics = await page.evaluate(() => {
      const colorOf = el => getComputedStyle(el).color;
      const bgOf = el => {
        let current = el;
        while (current) {
          const bg = getComputedStyle(current).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
          current = current.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      const theme = document.querySelector('.theme-toggle');
      const language = document.querySelector('.lang-toggle');
      const primary = document.querySelector('.button-dark');
      return {
        darkBackground: getComputedStyle(document.body).backgroundColor,
        themeIconColor: colorOf(theme),
        themeButtonBackground: getComputedStyle(document.body).backgroundColor,
        languageTextColor: colorOf(language),
        languageBackground: getComputedStyle(document.body).backgroundColor,
        primaryTextColor: primary ? colorOf(primary) : null,
        primaryBackground: primary ? bgOf(primary) : null
      };
    });
    assert.notEqual(themeMetrics.darkBackground, lightBackground, `Body background should change in dark theme on ${route}`);
    const iconContrast = contrast(themeMetrics.themeIconColor, themeMetrics.themeButtonBackground);
    assert.ok(iconContrast !== null && iconContrast >= 3, `Theme icon contrast should be >=3:1 on ${route}, got ${iconContrast} (fg=${themeMetrics.themeIconColor}, bg=${themeMetrics.themeButtonBackground})`);
    const languageContrast = contrast(themeMetrics.languageTextColor, themeMetrics.languageBackground);
    assert.ok(languageContrast !== null && languageContrast >= 4.5, `Language toggle text contrast should be >=4.5:1 on ${route}, got ${languageContrast} (fg=${themeMetrics.languageTextColor}, bg=${themeMetrics.languageBackground})`);
    if (themeMetrics.primaryTextColor) {
      const primaryContrast = contrast(themeMetrics.primaryTextColor, themeMetrics.primaryBackground);
      assert.ok(primaryContrast !== null && primaryContrast >= 4.5, `Primary button contrast should be >=4.5:1 on ${route}, got ${primaryContrast}`);
    }

    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dark-mode')), true, `Dark theme should persist after reload on ${route}`);
    const reloadedToggle = page.locator('.theme-toggle').first();
    await reloadedToggle.click();
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dark-mode')), false, `Light theme should restore after toggle on ${route}`);
    assert.equal(await page.evaluate(() => localStorage.getItem('eo-theme')), 'light', `Light theme should persist on ${route}`);
  }

  assert.deepEqual(failures, [], `Browser runtime errors: ${JSON.stringify(failures)}`);
  console.log(`PASS — dark-mode browser test: ${routes.length} routes; theme toggles both ways, accessible state/icon, persisted preference, and dark-theme control contrast checks passed.`);
} finally {
  await browser.close();
}
