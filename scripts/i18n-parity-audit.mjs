import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', '.next', 'dist', 'coverage']);
const htmlFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);
const findings = [];
const counts = { pages: htmlFiles.length, missingDocumentLanguage: 0, invalidDocumentLanguage: 0, missingLanguageToggle: 0, missingHindiValue: 0, missingEnglishValue: 0, emptyTranslationValue: 0 };
for (const file of htmlFiles.sort()) {
  const html = readFileSync(file, 'utf8');
  const rel = path.relative(root, file).split(path.sep).join('/');
  const lang = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!lang) {
    counts.missingDocumentLanguage++;
    findings.push({ file: rel, type: 'missing-document-lang', detail: 'Add a valid lang attribute to the html element.' });
  }
  if (!/class=["'][^"']*\blang-toggle\b/.test(html)) {
    counts.missingLanguageToggle++;
    findings.push({ file: rel, type: 'missing-language-toggle', detail: 'No language-switch control found in static markup.' });
  }
  const pairedAttrs = [...html.matchAll(/\bdata-(en|hi)(?:-placeholder|-aria-label)?\s*=\s*(["'])(.*?)\2/gs)];
  const elements = [...html.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)];
  for (const match of elements) {
    const tag = match[1];
    const attrs = match[2];
    const en = /\bdata-en\s*=\s*(["'])(.*?)\1/s.test(attrs);
    const hi = /\bdata-hi\s*=\s*(["'])(.*?)\1/s.test(attrs);
    if (en && !hi) {
      counts.missingHindiValue++;
      findings.push({ file: rel, type: 'missing-data-hi', detail: '<' + tag + '> has data-en without data-hi.' });
    } else if (hi && !en) {
      counts.missingEnglishValue++;
      findings.push({ file: rel, type: 'missing-data-en', detail: '<' + tag + '> has data-hi without data-en.' });
    }
  }
}
console.log('Hindi-English static parity audit');
console.log(JSON.stringify(counts, null, 2));
if (findings.length) {
  console.log('\nFindings (report-only baseline):');
  for (const item of findings) console.log(item.file + ' [' + item.type + '] ' + item.detail);
} else {
  console.log('No static parity findings.');
}
if (process.env.STRICT_I18N_AUDIT === '1' && findings.length) process.exitCode = 1;
