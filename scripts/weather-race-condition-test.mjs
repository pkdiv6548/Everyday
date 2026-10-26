import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ serviceWorkers: 'block' });
const page = await context.newPage();
let releaseSlowGeo;
let releaseSlowForecast;
let signalSlowGeoStarted;
let signalSlowForecastStarted;
const slowGeoStarted = new Promise(resolve => { signalSlowGeoStarted = resolve; });
const slowForecastStartedPromise = new Promise(resolve => { signalSlowForecastStarted = resolve; });
const slowGeoGate = new Promise(resolve => { releaseSlowGeo = resolve; });
const slowForecastGate = new Promise(resolve => { releaseSlowForecast = resolve; });
let slowForecastStarted = false;
const forecastCalls = [];
const days = Array.from({length:7},(_,i)=>`2026-10-${String(27+i).padStart(2,'0')}`);
const forecast = (temperature) => ({
  current: { time:'2026-10-27T12:00', temperature_2m:temperature, relative_humidity_2m:40, apparent_temperature:temperature, is_day:1, precipitation:0, weather_code:1, wind_speed_10m:10 },
  daily: { time:days, weather_code:Array(7).fill(1), temperature_2m_max:Array(7).fill(temperature+3), temperature_2m_min:Array(7).fill(temperature-5), sunrise:Array(7).fill('2026-10-27T06:30'), sunset:Array(7).fill('2026-10-27T17:45') }
});
try {
  await page.route('https://geocoding-api.open-meteo.com/**', async route => {
    const name = new URL(route.request().url()).searchParams.get('name');
    if (name === 'SlowGeo') { signalSlowGeoStarted(); await slowGeoGate; }
    const coords = {
      SlowGeo: [11,21], FastGeo: [12,22],
      SlowForecast: [13,23], FastForecast: [14,24]
    }[name] || [15,25];
    await route.fulfill({ json: { results: [{ name, latitude:coords[0], longitude:coords[1], country:'Test' }] } });
  });
  await page.route('https://api.open-meteo.com/**', async route => {
    const url = new URL(route.request().url());
    const latitude = Number(url.searchParams.get('latitude'));
    forecastCalls.push(latitude);
    if (latitude === 13) {
      slowForecastStarted = true;
      signalSlowForecastStarted();
      await slowForecastGate;
      await route.fulfill({ json: forecast(13) });
      return;
    }
    await route.fulfill({ json: forecast(latitude === 12 ? 22 : latitude === 14 ? 44 : 33) });
  });

  await page.addInitScript(() => { Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition() {} } }); });
  await page.goto('http://127.0.0.1:4173/weather.html', { waitUntil:'domcontentloaded' });
  const city = page.locator('#city-input');
  const submit = page.locator('#weather-form button[type="submit"]');
  const search = async name => { await city.fill(name); await submit.click(); };

  await search('SlowGeo');
  await slowGeoStarted;
  await search('FastGeo');
  await page.waitForFunction(() => document.querySelector('#place-name').textContent.includes('FastGeo'));
  releaseSlowGeo();
  await page.waitForTimeout(150);
  assert.match(await page.locator('#place-name').textContent(), /FastGeo/, 'Late geocoding response must not replace newer city');
  assert.equal(forecastCalls.includes(11), false, 'Stale geocoding result must not trigger forecast request');

  await search('SlowForecast');
  await slowForecastStartedPromise;
  await search('FastForecast');
  await page.waitForFunction(() => document.querySelector('#place-name').textContent.includes('FastForecast'));
  releaseSlowForecast();
  await page.waitForTimeout(150);
  assert.match(await page.locator('#place-name').textContent(), /FastForecast/, 'Late forecast response must not replace newer city');
  assert.equal(await page.locator('#current-temp').textContent(), '44°C', 'Newer forecast temperature must remain visible');

  await page.locator('#use-location').click();
  assert.equal(await page.locator('#weather-results').isHidden(), true, 'Location lookup should hide previous forecast immediately');
  assert.equal(await page.locator('#weather-form').evaluate(el => el.classList.contains('weather-loading')), true, 'Location lookup should indicate pending state');
  console.log('PASS — stale-response protection: late geocoding and forecast responses cannot overwrite newer city results; location lookup hides prior forecast and shows pending state.');
} finally {
  await browser.close();
}
