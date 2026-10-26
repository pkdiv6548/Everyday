import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const plan = JSON.parse(fs.readFileSync(path.join(root, 'data/category-plan.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'stories-extra.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'explore.html'), 'utf8');
const issues = [];
const marker = source.indexOf('window.EO_EXTRA_STORIES=');
const start = source.indexOf('[', marker);
if (marker < 0 || start < 0) throw new Error('Could not find EO_EXTRA_STORIES data');

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
if (end < 0) throw new Error('Could not parse EO_EXTRA_STORIES array');
const records = JSON.parse(source.slice(start, end));
const dynamicByCategory = new Map();
const dynamicSlugs = new Set();
const dynamicImages = new Map();
for (const item of records) {
  const [slug, category, title, titleHi, answer, answerHi, body, bodyHi, takeaway, takeawayHi, image, alt, sourceUrl] = item;
  if (dynamicSlugs.has(slug)) issues.push('Duplicate dynamic slug: ' + slug);
  dynamicSlugs.add(slug);
  dynamicByCategory.set(category, (dynamicByCategory.get(category) || 0) + 1);
  if (!image || !alt || !sourceUrl) issues.push('Missing image/alt/source: ' + slug);
  if (image) {
    if (!dynamicImages.has(image)) dynamicImages.set(image, []);
    dynamicImages.get(image).push(slug);
    if (image.startsWith('assets/') && !fs.existsSync(path.join(root, image))) issues.push('Missing local image: ' + slug + ' -> ' + image);
  }
  if ([title, titleHi, answer, answerHi, body, bodyHi, takeaway, takeawayHi].some(x => typeof x !== 'string' || x.trim().length < 12)) {
    issues.push('Incomplete bilingual content: ' + slug);
  }
  if (sourceUrl && !/^https:\/\//.test(sourceUrl)) issues.push('Source URL must use HTTPS: ' + slug);
}
for (const [image, slugs] of dynamicImages) if (slugs.length > 1) issues.push('Repeated dynamic image: ' + image + ' used by ' + slugs.join(', '));

const staticByTag = new Map();
const staticSlugs = new Set();
const staticImages = new Map();
const cardPattern = /<a class="story-card explore-card"[^>]*data-category="([^"]+)"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let card;
while ((card = cardPattern.exec(html))) {
  const tag = card[1];
  const href = card[2].split(/[?#]/)[0];
  const slug = path.basename(href, '.html');
  if (staticSlugs.has(slug)) issues.push('Duplicate static story link: ' + slug);
  staticSlugs.add(slug);
  staticByTag.set(tag, (staticByTag.get(tag) || 0) + 1);
  const inner = card[3];
  const src = inner.match(/<img[^>]*src="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&') || '';
  const alt = inner.match(/<img[^>]*alt="([^"]*)"/)?.[1] ?? null;
  if (alt === null || !alt.trim()) issues.push('Missing static story image alt: ' + slug);
  if (src) {
    const normalized = src.replaceAll('&amp;', '&');
    if (!staticImages.has(normalized)) staticImages.set(normalized, []);
    staticImages.get(normalized).push(slug);
    if (normalized.startsWith('http://') || normalized.startsWith('https://')) issues.push('External static story image: ' + slug + ' -> ' + normalized);
    else if (!fs.existsSync(path.resolve(root, normalized.split(/[?#]/)[0]))) issues.push('Missing static story image asset: ' + slug + ' -> ' + normalized);
  } else issues.push('Missing static story image: ' + slug);
}
for (const [image, slugs] of staticImages) if (slugs.length > 1) issues.push('Repeated static story image: ' + image + ' used by ' + slugs.join(', '));

const dynamicMapping = {
  'human-body': ['body'], 'space-universe': ['space'], 'nature-wildlife': ['nature'],
  'science-explained': ['physics', 'sound'], 'psychology-mind': ['psychology'],
  'history-civilizations': ['history'], 'technology-ai': ['technology'],
  'everyday-mysteries': ['water'], 'earth-weather': ['earth'], 'food-science': ['food'],
  'optical-illusions': ['light'], 'micro-world': ['micro'], 'materials-objects': ['materials'],
  'geography-world': ['geography'], 'mathematics-numbers': ['math'], 'plants-botany': ['plants'],
  'inventions-discoveries': ['inventions'], 'unsolved-questions': ['unsolved'],
  'future-career-intelligence': ['future']
};
const staticMapping = {
  'human-body': ['body'], 'space-universe': ['space'], 'nature-wildlife': ['nature'],
  'science-explained': ['physics', 'sound'], 'psychology-mind': ['psychology'],
  'history-civilizations': ['history'], 'technology-ai': ['technology'],
  'everyday-mysteries': ['water'], 'earth-weather': ['water'],
  'food-science': ['food'], 'optical-illusions': ['light'], 'micro-world': ['micro'],
  'materials-objects': ['materials'], 'geography-world': ['geography'],
  'mathematics-numbers': ['math'], 'plants-botany': ['nature'],
  'inventions-discoveries': ['inventions'], 'unsolved-questions': ['space'],
  'future-career-intelligence': ['future']
};
console.log('Dynamic story records:', records.length);
console.log('Unique dynamic slugs:', dynamicSlugs.size);
console.log('Static story cards:', staticSlugs.size);
console.log('Unique combined catalog slugs:', new Set([...dynamicSlugs, ...staticSlugs]).size);
console.log('Stories per planned category (minimum target: ' + plan.minimumStoriesPerCategory + '):');
let gaps = 0;
for (const category of plan.categories) {
  const dynamicTags = dynamicMapping[category.id] || [];
  const staticTags = staticMapping[category.id] || [];
  const count = dynamicTags.reduce((sum, tag) => sum + (dynamicByCategory.get(tag) || 0), 0)
    + staticTags.reduce((sum, tag) => sum + (staticByTag.get(tag) || 0), 0);
  const gap = Math.max(0, plan.minimumStoriesPerCategory - count);
  if (gap) gaps++;
  console.log(' - ' + category.name + ': ' + count + '/' + plan.minimumStoriesPerCategory + (gap ? ' (needs ' + gap + ' more)' : ' (target met)'));
}
console.log('Categories below minimum:', gaps + '/' + plan.categories.length);
console.log('Content integrity issues:', issues.length);
for (const issue of issues) console.warn('CONTENT ISSUE:', issue);
if (issues.length) process.exitCode = 1;
