import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ serviceWorkers: 'block' });
const page = await context.newPage();
const requests = { geocoding: 0, forecast: 0 };
const validForecast = {
  current: { time: '2026-10-27T12:00', temperature_2m: 28, relative_humidity_2m: 40, apparent_temperature: 29, is_day: 1, precipitation: 0, weather_code: 1, wind_speed_10m: 12 },
  daily: {
    time: ['2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-10-31','2026-11-01','2026-11-02'],
    weather_code: [1,2,3,0,61,2,1],
    temperature_2m_max: [31,30,29,32,27,28,30],
    temperature_2m_min: [19,20,18,21,17,18,19],
    sunrise: Array(7).fill('2026-10-27T06:30'),
    sunset: Array(7).fill('2026-10-27T17:45')
  }
};
try {
  await page.route('https://geocoding-api.open-meteo.com/**', async route => {
    requests.geocoding++;
    const url = new URL(route.request().url());
    if (url.searchParams.get('name') === 'NoSuchCity') {
      await route.fulfill({ json: { results: [] } });
      return;
    }
    if (url.searchParams.get('name') === 'NetworkFailure') {
      await route.abort();
      return;
    }
    if (url.searchParams.get('name') === 'BadGeo') {
      await route.fulfill({ json: { results: [{ name: 'BadGeo', latitude: 'not-a-number', longitude: 73 }] } });
      return;
    }
    if (url.searchParams.get('name') === 'AmbiguousCity') {
      await route.fulfill({ json: { results: [
        { name: 'Ambiguous City', admin1: 'North District', country: 'Testland', latitude: 10, longitude: 20 },
        { name: 'Ambiguous City', admin1: 'South District', country: 'Testland', latitude: 30, longitude: 40 }
      ] } });
      return;
    }
    await route.fulfill({ json: { results: [{ name: 'Test City', admin1: 'Test State', country: 'Test Country', latitude: 29.9, longitude: 73.8 }] } });
  });
  await page.route('https://api.open-meteo.com/**', async route => {
    requests.forecast++;
    if (requests.forecast === 1) {
      await route.fulfill({ json: { current: { temperature_2m: 28 }, daily: { time: ['2026-10-27'] } } });
      return;
    }
    await route.fulfill({ json: validForecast });
  });

  await page.goto('http://127.0.0.1:4173/weather.html', { waitUntil: 'domcontentloaded' });
  const city = page.locator('#city-input');
  const submit = page.locator('#weather-form button[type="submit"]');
  await city.fill('Test City');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#weather-status').textContent.includes('temporarily unavailable'));
  assert.equal(requests.forecast, 1, 'Malformed forecast must be requested once and rejected');
  assert.equal(await page.locator('#weather-results').isHidden(), true, 'Malformed forecast must not display partial data');

  await submit.click();
  await page.waitForFunction(() => document.querySelector('#weather-results').hidden === false);
  assert.equal(requests.forecast, 2, 'Malformed forecast must not be cached; retry must request fresh data');
  assert.equal(await page.locator('#forecast-grid .forecast-day').count(), 7, 'A valid response must render seven forecast days');
  assert.equal(await page.locator('#current-temp').textContent(), '28°C', 'Current temperature must use Celsius');
  assert.equal(await page.locator('#high-low').textContent(), '31° / 19°', 'Daily high/low units must be shown consistently');
  const forecastDates = await page.locator('.forecast-day .forecast-date').allTextContents();
  assert.equal(forecastDates.length, 7, 'Each forecast day must have a readable date');
  assert.ok(forecastDates[0].includes('27') && forecastDates[6].includes('2'), 'Forecast dates must cover the expected seven-day range');
  assert.ok((await page.locator('.forecast-day .forecast-temperatures').first().textContent()).includes('31°'), 'Forecast cards must display daily temperature units');

  await city.fill('AmbiguousCity');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#city-options').hidden === false);
  assert.equal(await page.locator('#city-options [data-city-index]').count(), 2, 'Ambiguous city search should show both place choices');
  assert.equal(requests.forecast, 2, 'Ambiguous city search must not request a forecast before the user selects a place');
  await page.locator('#city-options [data-city-index="1"]').click();
  await page.waitForFunction(() => document.querySelector('#weather-results').hidden === false && document.querySelector('#place-name').textContent.includes('South District'));
  assert.equal(requests.forecast, 3, 'Selecting a place should request exactly that location forecast');

  await city.fill('NoSuchCity');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#weather-status').textContent.includes('City not found'));
  assert.equal(await page.locator('#weather-results').isHidden(), true, 'Unknown city must not show stale results');

  await city.fill('BadGeo');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#weather-status').textContent.includes('temporarily unavailable'));
  assert.equal(requests.forecast, 3, 'Invalid geocoding coordinates must not trigger forecast requests');

  await city.fill('NetworkFailure');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#weather-status').textContent.includes('temporarily unavailable'));
  assert.equal(await page.locator('#weather-results').isHidden(), true, 'Network failure must not leave stale forecast visible');
  assert.equal(requests.forecast, 3, 'Failed geocoding request must not trigger forecast requests');

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition(_success, error) { error({ code: 1, message: 'User denied Geolocation' }); } } });
  });
  await page.locator('#use-location').click();
  await page.waitForFunction(() => document.querySelector('#weather-status').textContent.includes('Location was not shared'));
  assert.equal(requests.forecast, 3, 'Denied location permission must not request a forecast');

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: undefined });
  });
  await page.locator('#use-location').click();
  await page.waitForFunction(() => document.querySelector('#weather-status').textContent.includes('Location is not supported'));
  assert.equal(requests.forecast, 3, 'Unsupported geolocation must not request a forecast');

  await page.locator('.lang-toggle').click();
  assert.equal(await page.locator('#weather-form button[type="submit"]').textContent(), 'मौसम देखें');
  console.log('PASS — API response validation: malformed forecast is rejected and not cached, retry succeeds with seven days, unknown city, invalid coordinates, network failure, denied/unsupported location, and Hindi labels are handled safely.');
} finally {
  await browser.close();
}
