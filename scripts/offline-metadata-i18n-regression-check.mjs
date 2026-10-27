import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('offline.html', 'utf8');
assert.ok(page.includes('document.title=chosen==="hi"?"आप ऑफ़लाइन हैं | Everyday Oddities":"You\'re offline | Everyday Oddities"'),
  'offline page title follows the selected language');
assert.ok(page.includes('description.content=chosen==="hi"?"एवरीडे ऑडिटीज़ का ऑफ़लाइन पेज। पहले देखे गए पेज खोलने या दोबारा कनेक्ट करने का प्रयास करें।":"Offline fallback for Everyday Oddities."'),
  'offline page meta description follows the selected language');
assert.ok(page.includes('root.lang=chosen'),
  'offline page updates the document language');
assert.ok(page.includes('button.setAttribute("aria-label",chosen==="en"?"हिंदी में बदलें":"Switch to English")'),
  'language toggle has a localized accessible name');
console.log('Offline page metadata and language accessibility regression checks passed.');
