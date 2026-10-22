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
const storyCoverSources = new Map();
const externalImages = new Map();
const extraStoryImages = new Map();
const extraStoryCounts = new Map();
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
      if (rel.startsWith('articles/') && /\barticle-cover\b/.test(attrs)) {
        let key = normalized;
        try { const parsed = new URL(normalized.replaceAll('&amp;', '&')); key = parsed.origin + parsed.pathname; } catch {}
        if (!storyCoverSources.has(key)) storyCoverSources.set(key, []);
        storyCoverSources.get(key).push(rel);
      }
    }
  }
}

const extraStoriesPath = path.join(root, 'stories-extra.js');
if (fs.existsSync(extraStoriesPath)) {
  const source = fs.readFileSync(extraStoriesPath, 'utf8');
  const assignment = source.indexOf('window.EO_EXTRA_STORIES=');
  const start = source.indexOf('[', assignment);
  let depth = 0, inString = false, escaped = false, end = -1;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (start >= 0 && end > start) {
    const records = JSON.parse(source.slice(start, end));
    console.log('Extra story records:', records.length);
    for (const record of records) {
      const [slug, category, , , , , , , , , image] = record;
      extraStoryCounts.set(category, (extraStoryCounts.get(category) || 0) + 1);
      const key = image.startsWith('assets/') ? image : 'unsplash:' + image;
      if (!extraStoryImages.has(key)) extraStoryImages.set(key, []);
      extraStoryImages.get(key).push(slug);
      if (image.startsWith('assets/') && !fs.existsSync(path.join(root, image))) {
        issues.push({ type: 'missing-story-image-asset', file: 'stories-extra.js', value: image });
      }
    }
    console.log('Extra story records by topic:', Object.fromEntries([...extraStoryCounts.entries()].sort()));
    console.log('Topics below 50 extra-story records:', [...new Set(records.map(r => r[1]))].filter(topic => (extraStoryCounts.get(topic) || 0) < 50).length);
  } else {
    issues.push({ type: 'story-data-parse-error', file: 'stories-extra.js', value: 'Could not locate story array' });
  }
}
const duplicateExtraImages = [...extraStoryImages.entries()].filter(([, slugs]) => new Set(slugs).size > 1);
console.log('Repeated images across extra-story records:', duplicateExtraImages.length);
for (const [image, slugs] of duplicateExtraImages) console.warn('DUPLICATE EXTRA STORY IMAGE:', image, '=>', slugs.join(', '));

const duplicateImages = [...storyCoverSources.entries()].filter(([, files]) => new Set(files).size > 1);
const articleCount = htmlFiles.filter(file => file.replaceAll(path.sep, '/').includes('/articles/')).length;
console.log('Everyday content audit');
console.log('HTML pages:', htmlFiles.length);
console.log('Article pages:', articleCount);
console.log('Unique image source strings:', imageSources.size);
console.log('Repeated main story images (URL query parameters ignored):', duplicateImages.length);
console.log('Externally hosted image source strings (review for local asset/licence):', externalImages.size);
for (const [src, files] of duplicateImages) console.warn('DUPLICATE STORY COVER:', src, '=>', [...new Set(files)].join(', '));
for (const [src, files] of externalImages) console.warn('EXTERNAL IMAGE REVIEW:', src, '=>', [...new Set(files)].join(', '));
console.log('Missing image alt attributes:', issues.filter(x => x.type === 'missing-alt').length);
console.log('Broken local paths:', issues.filter(x => x.type === 'broken-local-path').length);
console.log('Missing story image assets:', issues.filter(x => x.type === 'missing-story-image-asset').length);
for (const issue of issues) console.warn(issue.type.toUpperCase() + ':', issue.file, issue.value || issue.src);
// This is a reporting audit, not a publication gate yet: existing content needs a baseline cleanup.
if (process.env.STRICT_CONTENT_AUDIT === '1' && issues.some(x => ['broken-local-path','missing-story-image-asset','story-data-parse-error'].includes(x.type))) process.exitCode = 1;
