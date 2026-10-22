import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const plan = JSON.parse(fs.readFileSync(path.join(root, 'data/category-plan.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'stories-extra.js'), 'utf8');
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
const counts = new Map();
const slugs = new Set();
const images = new Map();
const issues = [];
for (const item of records) {
  const [slug, category, title, titleHi, answer, answerHi, body, bodyHi, takeaway, takeawayHi, image, alt, sourceUrl] = item;
  if (slugs.has(slug)) issues.push('Duplicate slug: ' + slug);
  slugs.add(slug);
  counts.set(category, (counts.get(category) || 0) + 1);
  if (!image || !alt || !sourceUrl) issues.push('Missing image/alt/source: ' + slug);
  if (image) {
    if (!images.has(image)) images.set(image, []);
    images.get(image).push(slug);
    if (image.startsWith('assets/') && !fs.existsSync(path.join(root, image))) issues.push('Missing local image: ' + slug + ' -> ' + image);
  }
  if ([title, titleHi, answer, answerHi, body, bodyHi, takeaway, takeawayHi].some(x => typeof x !== 'string' || x.trim().length < 12)) {
    issues.push('Incomplete bilingual content: ' + slug);
  }
  if (sourceUrl && !/^https:\/\//.test(sourceUrl)) issues.push('Source URL must use HTTPS: ' + slug);
}
for (const [image, items] of images) if (items.length > 1) issues.push('Repeated image: ' + image + ' used by ' + items.join(', '));

const mapping = {
  'human-body': ['body'],
  'space-universe': ['space'],
  'nature-wildlife': ['nature'],
  'science-explained': ['physics', 'sound'],
  'psychology-mind': ['psychology'],
  'history-civilizations': ['history'],
  'technology-ai': ['technology'],
  'everyday-mysteries': ['water'],
  'earth-weather': ['earth'],
  'food-science': ['food'],
  'optical-illusions': ['light'],
  'micro-world': ['micro'],
  'materials-objects': ['materials'],
  'geography-world': ['geography'],
  'mathematics-numbers': ['math'],
  'plants-botany': ['plants'],
  'inventions-discoveries': ['inventions'],
  'unsolved-questions': ['unsolved'],
  'future-career-intelligence': ['future']
};
console.log('Dynamic story records:', records.length);
console.log('Unique slugs:', slugs.size);
console.log('Unique image sources:', images.size);
console.log('Stories per planned category (minimum target: ' + plan.minimumStoriesPerCategory + '):');
let gaps = 0;
for (const category of plan.categories) {
  const tags = mapping[category.id] || [];
  const count = tags.reduce((sum, tag) => sum + (counts.get(tag) || 0), 0);
  const gap = Math.max(0, plan.minimumStoriesPerCategory - count);
  if (gap) gaps++;
  console.log(' - ' + category.name + ': ' + count + '/' + plan.minimumStoriesPerCategory + (gap ? ' (needs ' + gap + ' more)' : ' (target met)'));
}
console.log('Categories below minimum:', gaps + '/' + plan.categories.length);
console.log('Content integrity issues:', issues.length);
for (const issue of issues) console.warn('CONTENT ISSUE:', issue);
if (issues.length) process.exitCode = 1;
