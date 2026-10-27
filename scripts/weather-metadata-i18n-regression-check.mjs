import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('weather.html', 'utf8');
assert.match(page, /const updateWeatherMetadata=\(\)=>\{document\.title=hi\(\)\?'मौसम और पृथ्वी \| Everyday Oddities':'Weather & Earth \| Everyday Oddities'/,
  'Weather document title is localized based on the active language');
assert.match(page, /description\.content=hi\(\)\?'Open-Meteo मौसम डेटा के साथ वर्तमान मौसम और सात दिनों का पूर्वानुमान देखें।'\s*:'Explore current conditions and a short forecast with Open-Meteo weather data\.'/,
  'Weather meta description is localized based on the active language');
assert.match(page, /window\.addEventListener\('eo:languagechange',updateWeatherMetadata\)/,
  'Weather metadata updates when the shared language-change event fires');
console.log('Weather page metadata language regression checks passed.');
