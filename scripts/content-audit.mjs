#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredDirs = new Set(['.git', '.github', 'node_modules']);
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);
const issues = [];
const imageSources = new Map();
const externalImages = new Map();
const hrefPattern = /\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi;
const imgPattern = /<img\b([^>]*?)>/gi;
const attr = (text, name) => {
  const match = text.match(new RegExp("(?:^|\\s)" + name + "\\s*=\\s*([\"'])(.*?)\\1", "i"));
  return match ? match[2] : null;
};
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  let match;
  while ((match = hrefPattern.exec(content))) {
    const value = match[2].trim();
    if (!value || value.startsWith('#') || /^(?:https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(value)) continue;
    const clean = decodeURIComponent(value.split(/[?#]/)[0]);
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(file), clean);
    if (resolved.startsWith(root) && !fs.existsSync(resolved)) issues.push({ type: 'broken-local-path', file: rel, value });
  }
  while ((match = imgPattern.exec(content))) {
    const attrs = match[1];
    const src = attr(attrs, 'src') || attr(attrs, 'data-src');
    const alt = attr(attrs, 'alt');
    if (alt === null) issues.push({ type: 'missing-alt', file: rel, src: src || '(no src)' });
    if (src) {
      const normalized = src.trim();
      if (normalized.startsWith('http://') || normalized.startsWith('https://')) { if (!externalImages.has(normalized)) externalImages.set(normalized, []); externalImages.get(normalized).push(rel); }
      if (!imageSources.has(normalized)) imageSources.set(normalized, []);
      imageSources.get(normalized).push(rel);
    }
  }
}
const duplicateImages = [...imageSources.entries()].filter(([, files]) => files.length > 1);
const articleCount = htmlFiles.filter(file => file.replaceAll(path.sep, '/').includes('/articles/')).length;
console.log('Everyday content audit');
console.log('HTML pages:', htmlFiles.length);
console.log('Article pages:', articleCount);
console.log('Unique image source strings:', imageSources.size);
console.log('Repeated image source strings:', duplicateImages.length);
console.log('Externally hosted image source strings (review for local asset/licence):', externalImages.size);
for (const [src, files] of duplicateImages) console.warn('DUPLICATE IMAGE:', src, '=>', [...new Set(files)].join(', '));
for (const [src, files] of externalImages) console.warn('EXTERNAL IMAGE REVIEW:', src, '=>', [...new Set(files)].join(', '));
console.log('Missing image alt attributes:', issues.filter(x => x.type === 'missing-alt').length);
console.log('Broken local paths:', issues.filter(x => x.type === 'broken-local-path').length);
for (const issue of issues) console.warn(issue.type.toUpperCase() + ':', issue.file, issue.value || issue.src);
// This is a reporting audit, not a publication gate yet: existing content needs a baseline cleanup.
if (process.env.STRICT_CONTENT_AUDIT === '1' && issues.some(x => x.type === 'broken-local-path')) process.exitCode = 1;
