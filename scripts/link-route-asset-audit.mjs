#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const siteOrigin = 'https://pkdiv6548.github.io';
const sitePrefix = '/Everyday';
const ignoredDirs = new Set(['.git', '.github', 'node_modules', 'artifacts']);
const htmlFiles = [];
const allFiles = new Set();
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) {
      const rel = path.relative(root, full).split(path.sep).join('/');
      allFiles.add(rel);
      if (rel.endsWith('.html')) htmlFiles.push({ full, rel });
    }
  }
}
walk(root);
const issues = [];
const fragmentTargets = new Map();
const references = [];
const attrPattern = /\b(href|src|poster|action|data-src|data-href)\s*=\s*(["'])(.*?)\2/gi;
const srcsetPattern = /\bsrcset\s*=\s*(["'])(.*?)\1/gi;
const idPattern = /\b(?:id|name)\s*=\s*(["'])(.*?)\1/gi;
function decodePath(value, source, raw) {
  try { return decodeURIComponent(value); }
  catch { issues.push({ type: 'malformed-url-encoding', source, value: raw }); return value; }
}
for (const item of htmlFiles) {
  const original = fs.readFileSync(item.full, 'utf8');
  const markup = original.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
  const ids = new Set();
  let match;
  idPattern.lastIndex = 0;
  while ((match = idPattern.exec(markup))) ids.add(match[2]);
  fragmentTargets.set(item.rel, ids);
  function addReference(rawValue, kind) {
    const value = rawValue.trim();
    if (!value || /^(?:https?:|mailto:|tel:|javascript:|data:|blob:|sms:|intent:)/i.test(value) || value.startsWith('//')) return;
    references.push({ source: item.rel, value, kind });
  }
  attrPattern.lastIndex = 0;
  while ((match = attrPattern.exec(markup))) addReference(match[3], match[1].toLowerCase());
  srcsetPattern.lastIndex = 0;
  while ((match = srcsetPattern.exec(markup))) {
    for (const candidate of match[2].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) addReference(url, 'srcset');
    }
  }
}
function resolveLocal(rawValue, source) {
  let parsed;
  try { parsed = new URL(rawValue, 'https://local.invalid' + sitePrefix + '/' + source); }
  catch { issues.push({ type: 'malformed-local-url', source, value: rawValue }); return null; }
  let pathname = parsed.pathname;
  const absolute = (() => { try { return new URL(rawValue); } catch { return null; } })();
  if (absolute && absolute.origin === siteOrigin) {
    if (pathname === sitePrefix) pathname = '/';
    else if (pathname.startsWith(sitePrefix + '/')) pathname = pathname.slice(sitePrefix.length);
  } else if (pathname === sitePrefix) pathname = '/';
  else if (pathname.startsWith(sitePrefix + '/')) pathname = pathname.slice(sitePrefix.length);
  const decoded = decodePath(pathname, source, rawValue);
  const isRootRelative = rawValue.startsWith('/') || (absolute && absolute.origin === siteOrigin);
  let target = path.posix.normalize(decoded.replace(/^\//, '')) || 'index.html';
  if (!target || target === '.') target = 'index.html';
  if (target.endsWith('/')) target += 'index.html';
  return { target, fragment: parsed.hash ? decodePath(parsed.hash.slice(1), source, rawValue) : '' };
}
for (const ref of references) {
  const value = ref.value;
  const absolute = (() => { try { return new URL(value); } catch { return null; } })();
  if (absolute && absolute.origin !== siteOrigin) continue;
  if (absolute && absolute.origin === siteOrigin && absolute.pathname !== sitePrefix && !absolute.pathname.startsWith(sitePrefix + '/')) {
    issues.push({ type: 'same-origin-outside-pages-base', source: ref.source, value });
    continue;
  }
  const info = resolveLocal(value, ref.source);
  if (!info) continue;
  if (!allFiles.has(info.target)) {
    issues.push({ type: 'missing-local-target', source: ref.source, value, target: info.target });
    continue;
  }
  if (info.fragment && info.target.endsWith('.html')) {
    const ids = fragmentTargets.get(info.target);
    if (ids && !ids.has(info.fragment)) issues.push({ type: 'missing-fragment-target', source: ref.source, value, target: info.target, fragment: info.fragment });
  }
}
const sitemapPath = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const match of sitemap.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi)) {
    const value = match[1].replaceAll('&amp;', '&').trim();
    let url;
    try { url = new URL(value); } catch { issues.push({ type: 'malformed-sitemap-url', source: 'sitemap.xml', value }); continue; }
    if (url.origin !== siteOrigin || !(url.pathname === sitePrefix || url.pathname.startsWith(sitePrefix + '/'))) continue;
    let target = decodePath(url.pathname.slice(sitePrefix.length).replace(/^\//, '') || 'index.html', 'sitemap.xml', value);
    if (target.endsWith('/')) target += 'index.html';
    if (!allFiles.has(target)) issues.push({ type: 'sitemap-target-missing', source: 'sitemap.xml', value, target });
  }
} else issues.push({ type: 'missing-sitemap', source: '(repository root)', value: 'sitemap.xml' });
if (!allFiles.has('404.html')) issues.push({ type: 'missing-custom-404', source: '(repository root)', value: '404.html' });
const counts = {};
for (const issue of issues) counts[issue.type] = (counts[issue.type] || 0) + 1;
const lines = [
  '# Everyday Link, Route & Asset Audit', '',
  '- Run date: ' + new Date().toISOString(),
  '- HTML files scanned: ' + htmlFiles.length,
  '- Local references scanned: ' + references.length,
  '- Files indexed: ' + allFiles.size,
  '- Findings: ' + issues.length, '',
  '## Findings by type', '',
  ...(Object.keys(counts).length ? Object.entries(counts).sort().map(([type, count]) => '- **' + type + '**: ' + count) : ['- No findings.']),
  '', '## Detailed findings', '',
  ...(issues.length ? issues.map((issue, index) => {
    let line = (index + 1) + '. **' + issue.type + '** — source: ' + issue.source + '; URL/value: ' + (issue.value || '');
    if (issue.target) line += '; resolved target: ' + issue.target;
    if (issue.fragment) line += '; fragment: ' + issue.fragment;
    return line;
  }) : ['No findings.']),
  '', '## Scope and limitations', '',
  '- Static HTML attributes and sitemap paths are checked; URLs constructed dynamically by JavaScript are not fully discoverable by this crawl.',
  '- External websites are not probed for HTTP status. Provider outages, redirects and remote media availability require a separate network/browser check.',
  '- GitHub Pages custom 404 behavior is represented by checking that a root-level 404.html exists; deployed status-code behavior must be verified after publication.',
  '- Query-string routes such as story.html?slug=... are checked for the existence of their base HTML file; dynamic slug validity requires runtime tests.'
];
const report = lines.join('\n') + '\n';
const reportPath = path.join(root, 'artifacts', 'link-audit', 'report.md');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report);
console.log('Everyday link, route & asset audit');
console.log('HTML files scanned:', htmlFiles.length);
console.log('Local references scanned:', references.length);
console.log('Files indexed:', allFiles.size);
console.log('Findings:', issues.length);
for (const [type, count] of Object.entries(counts).sort()) console.log('  ' + type + ': ' + count);
for (const issue of issues) console.warn(issue.type.toUpperCase() + ': source=' + issue.source + ' value=' + (issue.value || '') + ' target=' + (issue.target || ''));
console.log('Report written to artifacts/link-audit/report.md');
if (process.env.STRICT_LINK_AUDIT === '1' && issues.length) process.exitCode = 1;
