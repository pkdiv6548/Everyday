import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('weather.html', 'utf8');
assert.match(page, /let lastWeatherResult=null;function render\(place,data\)\{lastWeatherResult=\{place,data\}/,
  'weather renderer remembers the latest successful result for language changes');
assert.match(page, /window\.addEventListener\('eo:languagechange',\(\)=>\{if\(lastWeatherResult\)render\(lastWeatherResult\.place,lastWeatherResult\.data\)\}\)/,
  'language changes rerender the current weather result without another API request');
console.log('Weather results language-switch regression checks passed.');
