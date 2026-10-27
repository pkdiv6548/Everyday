import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('time.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
const serviceWorker = readFileSync('sw.js', 'utf8');

const checks = [
  ['dark-mode world-clock button has explicit contrasting colors', /body\.dark-mode \.clock-form button\{background:var\(--lime\);color:#17332f/.test(page)],
  ['dark-mode API errors use a high-contrast foreground', /body\.dark-mode \.api-error\{color:#ff9b8e!important/.test(page)],
  ['world clock is calculated locally without a redundant time API request', page.includes('Clock updates locally every second.') && !page.includes('https://hourora.app/api/v1/time')],
  ['language switching does not trigger live API refreshes', /addEventListener\('eo:languagechange',\(\)=>\{localClock\(\);renderWorldClocks\(\);setStatus/.test(page) && !/eo:languagechange[^;]*refreshAll\(\)/.test(page)],
  ['language toggle dispatches a language-change event', app.includes("new CustomEvent('eo:languagechange'")],
  ['selected world clock updates every second and localizes dates', /setInterval\(localClock,1000\)/.test(page) && page.includes("Intl.DateTimeFormat(hi()?'hi-IN':'en-IN'")],
  ['quick clocks cover all selectable zones with city labels and offsets', ['Asia/Kolkata','Europe/London','America/New_York','Asia/Tokyo','Australia/Sydney'].every(z=>page.includes(z)) && page.includes("timeZoneName:'shortOffset'")],
  ['public-data refresh does not request an external time API', /Promise\.allSettled\(\[loadWorldTime\(\),loadSun\(\)/.test(page) && !page.includes('https://hourora.app/api/v1/time')],
  ['SunriseSunset attribution backlink is present', /href="https:\/\/sunrisesunset\.io\//.test(page)],
  ['holiday integration uses v4 endpoint, timezone-safe dates, and localized holiday names', page.includes('/api/v4/Holidays/IN/') && page.includes('formatToParts(now)') && page.includes("hi()?(h.localName||h.name||'सार्वजनिक अवकाश')")],
  ['currency API error displays a localized message safely', page.includes("$('#currency-list').replaceChildren(Object.assign(document.createElement('p')") && !page.includes("$('#currency-list').innerHTML")],
  ['holiday API error displays a localized message safely', page.includes("$('#holiday-list').replaceChildren(Object.assign(document.createElement('p')") && !page.includes("$('#holiday-list').innerHTML")],
  ['external API fields use safe DOM rendering for data rows', page.includes("$('#currency-list').replaceChildren") && page.includes("$('#earthquake-list').replaceChildren") && page.includes("$('#holiday-list').replaceChildren")],
  ['all data panels show localized loading states', ['currency-list','earthquake-list','holiday-list'].every(id=>page.includes("$('#"+id+"').replaceChildren(Object.assign(document.createElement('p')"))],
  ['provider links are present for public data cards', page.includes('href="https://sunrisesunset.io/"') && page.includes('href="https://frankfurter.dev/"') && page.includes('href="https://nagerholidays.com/api"') && page.includes('href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson"')],
  ['time page is included in the service-worker precache and cache version is bumped', /const CACHE='everyday-oddities-v98'/.test(serviceWorker) && /'\.\/time\.html'/.test(serviceWorker)],
  ['canonical and Open Graph metadata exist', page.includes('rel="canonical"') && page.includes('property="og:title"') && page.includes('property="og:url"')],
  ['status and refresh controls expose accessible busy/status semantics', page.includes('role="status" aria-live="polite"') && page.includes('aria-busy')],
];

for (const [name, passed] of checks) console.log(`${passed ? 'PASS' : 'FAIL'} — ${name}`);
assert.ok(checks.every(([, passed]) => passed), 'One or more Time page regression checks failed.');
