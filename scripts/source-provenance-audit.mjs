#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'articles');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(name => name.endsWith('.html')).sort() : [];
const findings = [];
const genericSourceText = /scientific reference|learn more|click here|source link|further information/i;
const genericAltText = /^(image|photo|picture|illustration related to|image of|illustration of)\\b/i;
for (const name of files) {
  const file = path.join(dir, name);
  const html = fs.readFileSync(file, 'utf8');
  const rel = 'articles/' + name;
  const sourceBlock = html.match(/<section\\b[^>]*class=["'][^"']*source-list[^"']*["'][^>]*>([\\s\\S]*?)<\\/section>/i);
  if (!sourceBlock) {
    findings.push({type:'missing-source-section',file:rel,detail:'No dedicated Sources & further reading section found; manually verify claims and references.'});
  } else {
    const links = [...sourceBlock[1].matchAll(/<a\\b([^>]*?)href=["']([^"']+)["']([^>]*)>([\\s\\S]*?)<\\/a>/gi)];
    if (!links.length) findings.push({type:'source-section-without-links',file:rel,detail:'Source section contains no links.'});
    for (const link of links) {
      const href = link[2].trim();
      const label = link[4].replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').trim();
      if (!/^https?:\\/\\//i.test(href)) findings.push({type:'non-http-source-link',file:rel,detail:href});
      if (genericSourceText.test(label)) findings.push({type:'generic-source-label',file:rel,detail:label || href});
      if (/example\\.com|placeholder|TODO|replace-this/i.test(href + ' ' + label)) findings.push({type:'placeholder-source',file:rel,detail:href + ' — ' + label});
    }
  }
  const images = [...html.matchAll(/<img\\b([^>]*?)>/gi)];
  for (const image of images) {
    const attrs = image[1];
    const alt = attrs.match(/(?:^|\\s)alt\\s*=\\s*(["'])(.*?)\\1/i)?.[2]?.trim();
    if (alt && genericAltText.test(alt)) findings.push({type:'generic-alt-candidate',file:rel,detail:alt});
  }
  if (/<img\\b[^>]*class=["'][^"']*article-cover[^"']*["'][^>]*>/i.test(html) && !/image-credit|photo credit|image source|illustration by/i.test(html)) {
    findings.push({type:'missing-visible-cover-credit-candidate',file:rel,detail:'Cover has no obvious visible credit text; verify ownership/licence and attribution requirements.'});
  }
}
console.log('Story source/provenance review candidates:', findings.length);
const counts = {};
for (const item of findings) counts[item.type] = (counts[item.type] || 0) + 1;
console.log('Candidate counts by type:', JSON.stringify(counts));
for (const item of findings) console.log(`[${item.type}] ${item.file}: ${item.detail}`);
console.log('This is a heuristic review queue, not proof of an actual licensing or factual error. Human verification is required before changing publication status.');
