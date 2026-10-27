import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('weather.html', 'utf8');
const localTimeFunction = page.match(/function localTime\(value\)\s*\{([^}]+)\}/)?.[1];

assert.ok(localTimeFunction, 'weather page defines localTime(value)');
assert.match(localTimeFunction, /hi\(\)\s*\?\s*\(h\s*<\s*12\s*\?\s*'सुबह'\s*:\s*'शाम'\)/,
  'Hindi mode uses Hindi day-period labels for sunrise and sunset');
assert.match(localTimeFunction, /:\s*\(h\s*<\s*12\s*\?\s*'AM'\s*:\s*'PM'\)/,
  'English mode retains AM/PM labels');

console.log('Weather sunrise/sunset language regression checks passed.');
