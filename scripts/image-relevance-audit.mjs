import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleDir = path.join(root, 'articles');
const stop = new Set(['the','and','for','with','from','that','this','does','why','how','what','when','where','are','is','to','of','in','on','a','an','as','by','can','do','your','you','usually','often','many','much','into','about','during','through','change','changes']);
const normalize = (value) => value.toLowerCase().replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]*>/g, ' ').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(word => word.length > 2 && !stop.has(word));
const overlap = (title, alt, src) => {
  const titleWords = new Set(normalize(title));
  const imageWords = new Set([...normalize(alt), ...normalize(path.basename(src, path.extname(src)).replaceAll('-', ' '))]);
  if (!titleWords.size) return 0;
  return [...titleWords].filter(word => imageWords.has(word)).length / titleWords.size;
};
if (!fs.existsSync(articleDir)) {
  console.log('No articles directory found; image relevance audit skipped.');
  process.exit(0);
}
const files = fs.readdirSync(articleDir).filter(file => file.endsWith('.html')).sort();
const candidates = [];
for (const file of files) {
  const html = fs.readFileSync(path.join(articleDir, file), 'utf8');
  const title = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, ' ').trim()
    || html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]*>/g, ' ').trim() || '';
  const image = html.match(/<img\b([^>]*\bclass=["'][^"']*article-cover[^"']*["'][^>]*)>/i)?.[1]
    || html.match(/<img\b([^>]*\bsrc=["'][^"']+["'][^>]*)>/i)?.[1] || '';
  const src = image.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
  const alt = image.match(/\balt=["']([^"']*)["']/i)?.[1] || '';
  if (!src) {
    candidates.push({file, score:0, reason:'No image source found', title, alt, src});
    continue;
  }
  const score = overlap(title, alt, src);
  const genericAltPrefix = /^(?:illustration related to|image related to|photo related to|picture related to)\\s+/i.test(alt.trim());
  if (!alt.trim()) candidates.push({file, score, reason:'Missing/empty alt text', title, alt, src});
  else if (genericAltPrefix) candidates.push({file, score:Number(score.toFixed(2)), reason:'Generic alt-text prefix; rewrite as a direct visual description', title, alt, src});
  else if (score < 0.2) candidates.push({file, score:Number(score.toFixed(2)), reason:'Low title/alt/filename keyword overlap; manual visual review needed', title, alt, src});
}
console.log('Article pages inspected:', files.length);
console.log('Potential image relevance/alt candidates:', candidates.length);
for (const item of candidates) console.log(JSON.stringify(item));
console.log('Note: this is a heuristic candidate list, not proof that an image is irrelevant. Confirm visually before changing assets.');
