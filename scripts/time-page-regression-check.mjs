import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('time.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
const serviceWorker = readFileSync('sw.js', 'utf8');

const checks = [
  ['dark-mode world-clock button has explicit contrasting colors', /body\.dark-mode \.clock-form button\{background:var\(--lime\);color:#17332f/.test(page)],
  ['world clock has a ticking render function', /function renderWorldClocks\(\)/.test(page) && /setInterval\(localClock,1000\)/.test(page)],
  ['public-data refresh includes the world clock', /Promise\.allSettled\(\[loadWorldTime\(\),loadSun\(\)/.test(page)],
  ['world-clock requests are guarded against duplicates', /let worldRequestActive=false/.test(page)],
  ['SunriseSunset attribution backlink is present', /href="https:\/\/sunrisesunset\.io\//.test(page)],
  ['holiday integration uses the v4 route', /\/api\/v4\/Holidays\/IN\//.test(page)],
  ['page copy does not falsely claim API response caching', /does not claim to cache those responses/.test(page)],
  ['solar failure clears stale values', /values cleared to avoid showing stale data/.test(page)],
  ['currency, earthquake and holiday rows use safe DOM rendering', page.includes("$('#currency-list').replaceChildren") && page.includes("$('#earthquake-list').replaceChildren") && page.includes("$('#holiday-list').replaceChildren")],
  ['dynamic language-change event is emitted and handled', app.includes("new CustomEvent('eo:languagechange'") && page.includes("addEventListener('eo:languagechange'")],
  ['world-clock select has localized accessible labels', /data-hi-aria-label="समय क्षेत्र"/.test(page)],
  ['provider links are available for all live-data cards', page.includes('href="https://hourora.app/en/developers"') && page.includes('href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson"') && page.includes('href="https://frankfurter.dev/"') && page.includes('href="https://nagerholidays.com/api"')],
  ['Time page is in the service-worker precache list', /'\.\/time\.html'/.test(serviceWorker)],
  ['page has canonical and Open Graph metadata', page.includes('rel="canonical"') && page.includes('property="og:title"') && page.includes('property="og:url"')],
];

for (const [name, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'} — ${name}`);
}
assert.ok(checks.every(([, passed]) => passed), 'One or more Time page regression checks failed.');
