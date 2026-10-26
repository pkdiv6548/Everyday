#!/usr/bin/env node
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const required = [
  {
    name: 'navigation link listeners use the multi-element helper',
    pattern: /\$\$\('\.main-nav a'\)\.forEach\(link=>link\.addEventListener\('click',closeMenu\)\)/,
  },
  {
    name: 'progressive reveal targets use the multi-element helper',
    pattern: /const revealTargets=\$\$\('\.section-heading,\.story-card,\.manifesto-inner,\.category-tile,\.experiment-card,\.hub-card,\.career-card,\.weather-panel,\.hub-hero'\)/,
  },
];
const failures = [];
for (const check of required) {
  if (check.pattern.test(app)) console.log('PASS:', check.name);
  else {
    console.error('FAIL:', check.name);
    failures.push(check.name);
  }
}
if (failures.length) {
  console.error('Selector regression checks failed:', failures.join('; '));
  process.exitCode = 1;
} else {
  console.log('Selector regression checks passed:', required.length);
}
