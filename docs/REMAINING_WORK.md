# Remaining work — Everyday Oddities

Last checked: 2026-10-22

## Verified changes
- Added 19 bilingual story records, one for each of the 19 planned categories.
- Added 19 corresponding local SVG illustration files, registered them in the media manifest and added them to the service-worker cache.
- The story library now has 81 dynamic records and 55 static Discover cards; the audit reports 135 distinct combined slugs.
- GitHub Actions content audit passed on commit `ad6c750f92858d8c272618a370b0086ef271d864`: JavaScript syntax passed, local paths passed, no missing alt attributes, no repeated story images, no external image URLs, no missing story image assets, and zero content-integrity errors.
- Latest GitHub Pages deployment for the same commit was still in progress at the time of this update. Follow [deployment status](https://github.com/pkdiv6548/Everyday/actions/runs/39805277980).

## Minimum content target is not complete
The roadmap requires at least 50 distinct stories per category (950 minimum across 19 categories). The latest automated coverage report counts both static Discover cards and dynamic records:

| Category | Current | Target | Still needed |
|---|---:|---:|---:|
| Human Body | 11 | 50 | 39 |
| Space & Universe | 8 | 50 | 42 |
| Nature & Wildlife | 17 | 50 | 33 |
| Science Explained | 16 | 50 | 34 |
| Psychology & Mind | 3 | 50 | 47 |
| History & Civilizations | 3 | 50 | 47 |
| Technology & AI | 4 | 50 | 46 |
| Everyday Mysteries | 11 | 50 | 39 |
| Earth & Weather | 14 | 50 | 36 |
| Food Science | 13 | 50 | 37 |
| Optical Illusions | 15 | 50 | 35 |
| Micro World | 3 | 50 | 47 |
| Materials & Objects | 10 | 50 | 40 |
| Geography & World | 2 | 50 | 48 |
| Mathematics & Numbers | 3 | 50 | 47 |
| Plants & Botany | 13 | 50 | 37 |
| Inventions & Discoveries | 2 | 50 | 48 |
| Unsolved Questions | 7 | 50 | 43 |
| Future & Career Intelligence | 3 | 50 | 47 |

Counts are technical catalog coverage, not a claim that every story has received a full expert editorial review. Each new story must have distinct useful content, a unique relevant image, alt text and a credible source. The new SVGs are original educational illustrations; their topic-specific visual accuracy still needs a manual visual review.

## Remaining validation
1. Continue adding and reviewing the remaining stories in batches, prioritizing categories with the largest gaps.
2. Manually verify that every image actually matches its story and that all factual claims and sources are suitable.
3. Test navigation, search, language toggle, dark mode, PWA install/offline fallback and mobile layouts in a real browser.
4. Run only a small, approved staging load test first. Do not ramp to 10,000 virtual users against GitHub Pages without explicit hosting approval and capacity planning.
5. Confirm the latest Pages deployment succeeds and re-run the content audit after each content batch.
