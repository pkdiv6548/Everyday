import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('time.html', 'utf8');
const initialLoadingStates = [
  ['local clock date', /id="local-date"[^>]*data-en="Loading…"[^>]*data-hi="लोड हो रहा है…"/],
  ['sunrise and sunset', /id="sun-status"[^>]*data-en="Loading solar data…"[^>]*data-hi="सौर डेटा लोड हो रहा है…"/],
  ['earthquake feed', /id="earthquake-list"><p class="api-status" data-en="Loading earthquake data…" data-hi="भूकंप का डेटा लोड हो रहा है…">/],
  ['currency rates', /id="currency-list"><p class="api-status" data-en="Loading exchange rates…" data-hi="विनिमय दरें लोड हो रही हैं…">/],
  ['public holidays', /id="holiday-list"><p class="api-status" data-en="Loading holiday data…" data-hi="सार्वजनिक अवकाश लोड हो रहे हैं…">|id="holiday-list"><p class="api-status" data-en="Loading public holidays…" data-hi="सार्वजनिक अवकाश लोड हो रहे हैं…">/],
];
for (const [label, pattern] of initialLoadingStates) {
  assert.match(page, pattern, label + ' has explicit English/Hindi initial loading text');
}
assert.match(page, /window\.addEventListener\('eo:languagechange'/,
  'Time page responds to the shared language-change event');
console.log('Time page initial loading-state language parity checks passed.');
