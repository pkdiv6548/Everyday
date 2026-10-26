import fs from 'node:fs';

const source = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const checks = [
  ['Search query is synchronized to URL', /if\(query\)params\.set\('q',query\);else params\.delete\('q'\)/],
  ['Category filter is synchronized to URL', /if\(activeFilter&&activeFilter!=='all'\)params\.set\('category',activeFilter\);else params\.delete\('category'\)/],
  ['Sort mode is synchronized to URL', /if\(sort!=='featured'\)params\.set\('sort',sort\);else params\.delete\('sort'\)/],
  ['Search query is restored from URL', /if\(search&&params\.has\('q'\)\)search\.value=params\.get\('q'\)/],
  ['Category is restored from URL', /const requestedCategory=\(params\.get\('category'\)\|\|'all'\)\.toLocaleLowerCase\(\)/],
  ['Supported sort values are restored', /\['featured','az','za'\]\.includes\(requestedSort\)/],
  ['Reset clears the search field', /if\(search\)search\.value='';activeFilter='all'/],
  ['Reset restores Featured sorting', /sortControl\.value='featured';sortControl\.dispatchEvent\(new Event\('change'\)\)/],
  ['Search and sort state is reapplied after initialization', /if\(sortControl&&\['featured','az','za'\]\.includes\(requestedSort\)\)[\s\S]{0,180}filterStories\(\)/]
];
const failed = [];
for (const [label, pattern] of checks) {
  if (!pattern.test(source)) failed.push(label);
  else console.log('PASS:', label);
}
if (failed.length) {
  console.error('Explore state regression checks failed:', failed.join('; '));
  process.exitCode = 1;
} else {
  console.log(`Explore state regression checks passed: ${checks.length}/${checks.length}`);
}
