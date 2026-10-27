import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const formStart = html.indexOf('<form class="newsletter-form"');
const formEnd = html.indexOf('</form>', formStart);
assert.ok(formStart >= 0 && formEnd > formStart, 'homepage newsletter form exists');
const form = html.slice(formStart, formEnd + '</form>'.length);
const handlerStart = app.indexOf("const form=$('.newsletter-form');");
const handlerEnd = app.indexOf("const exploreForm=", handlerStart);
assert.ok(handlerStart >= 0 && handlerEnd > handlerStart, 'newsletter submit handler exists');
const handler = app.slice(handlerStart, handlerEnd);
const checks = [
  ['newsletter stays explicitly marked as demo in English and Hindi', form.includes('Demo only: no email is collected, saved, or sent.') && form.includes('यह केवल डेमो है')],
  ['email input uses email validation and autocomplete', form.includes('type="email"') && form.includes('autocomplete="email"') && form.includes('required')],
  ['privacy/demo explanation is programmatically associated with the form', form.includes('aria-describedby="newsletter-demo-note newsletter-status"') && form.includes('id="newsletter-demo-note"')],
  ['submission feedback is announced accessibly', form.includes('id="newsletter-status" class="newsletter-status" role="status" aria-live="polite" hidden')],
  ['status message explicitly says no subscription was created', form.includes('no subscription was created') && form.includes('कोई सदस्यता नहीं बनी')],
  ['submit handler never resets or clears the email field', !handler.includes('form.reset()') && !handler.includes('.value=') && !handler.includes('.value =')],
  ['demo submit handler does not send network requests or persist email', !handler.includes('fetch(') && !handler.includes('localStorage') && !handler.includes('XMLHttpRequest')],
  ['status is displayed without claiming that a subscription succeeded', handler.includes('Demo only — no subscription was created.') && handler.includes('कोई सदस्यता नहीं बनी')],
  ['status message has a readable layout', css.includes('.newsletter-status')],
];
for (const [name, passed] of checks) console.log((passed ? 'PASS' : 'FAIL') + ' — ' + name);
assert.ok(checks.every(([, passed]) => passed), 'One or more newsletter safety checks failed.');
