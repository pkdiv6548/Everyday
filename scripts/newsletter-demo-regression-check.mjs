import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const formMatch = html.match(/<form class="newsletter-form"[\\s\\S]*?<\\/form>/);
assert.ok(formMatch, 'homepage newsletter form exists');
const form = formMatch[0];
const checks = [
  ['newsletter stays explicitly marked as demo in English and Hindi', form.includes('Demo only: no email is collected, saved, or sent.') && form.includes('यह केवल डेमो है')],
  ['email input uses email validation and autocomplete', /type="email"/.test(form) && /autocomplete="email"/.test(form) && /required/.test(form)],
  ['privacy/demo explanation is programmatically associated with the form', /aria-describedby="newsletter-demo-note newsletter-status"/.test(form) && /id="newsletter-demo-note"/.test(form)],
  ['submission feedback is announced accessibly', /id="newsletter-status" class="newsletter-status" role="status" aria-live="polite" hidden/.test(form)],
  ['status message explicitly says no subscription was created', form.includes('no subscription was created') && form.includes('कोई सदस्यता नहीं बनी')],
  ['submit handler never resets or clears the email field', /const form=\$\('\.newsletter-form'\);form\?\.addEventListener\('submit'/.test(app) && !/form\?\.addEventListener\('submit',[\\s\\S]{0,600}?form\\.reset\\(\\)/.test(app)],
  ['demo submit handler does not send network requests or persist email', /const newHandler/.test('') === false && !/newsletter-form[\\s\\S]{0,500}fetch\\(/.test(app) && !/newsletter-form[\\s\\S]{0,500}localStorage\\.setItem/.test(app)],
  ['status is displayed without claiming that a subscription succeeded', app.includes('Demo only — no subscription was created.') && app.includes('कोई सदस्यता नहीं बनी')],
  ['status message has a readable layout', css.includes('.newsletter-status')),
];
for (const [name, passed] of checks) console.log((passed ? 'PASS' : 'FAIL') + ' — ' + name);
assert.ok(checks.every(([, passed]) => passed), 'One or more newsletter safety checks failed.');
