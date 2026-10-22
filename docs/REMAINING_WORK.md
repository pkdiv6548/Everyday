# Remaining work — Everyday Oddities

Last checked: 2026-10-22

## Verified on the current main branch
- GitHub Pages build/deployment workflow: passed for commit `f89897cd196140ae34b3df5ef3ed45fe8907040f`.
- Content-audit workflow: passed for the same commit.
- JavaScript syntax checks, local-path checks, image alt checks and duplicate image-path checks passed in that workflow.
- The home-page soap-bubble image is now a local SVG and is included in the service-worker cache.
- 55 static Discover cards and 62 dynamic story records are present; the audit reported 116 distinct combined slugs.

## Content target is not complete
The roadmap defines 19 main categories with at least 50 distinct reviewed stories per category (minimum 950 stories overall). The latest category audit counted existing static cards and dynamic records as follows:

| Category | Current count | Minimum | Still needed |
|---|---:|---:|---:|
| Human Body | 10 | 50 | 40 |
| Space & Universe | 7 | 50 | 43 |
| Nature & Wildlife | 16 | 50 | 34 |
| Science Explained | 15 | 50 | 35 |
| Psychology & Mind | 2 | 50 | 48 |
| History & Civilizations | 2 | 50 | 48 |
| Technology & AI | 3 | 50 | 47 |
| Everyday Mysteries | 10 | 50 | 40 |
| Earth & Weather | 13 | 50 | 37 |
| Food Science | 12 | 50 | 38 |
| Optical Illusions | 14 | 50 | 36 |
| Micro World | 2 | 50 | 48 |
| Materials & Objects | 9 | 50 | 41 |
| Geography & World | 1 | 50 | 49 |
| Mathematics & Numbers | 2 | 50 | 48 |
| Plants & Botany | 12 | 50 | 38 |
| Inventions & Discoveries | 1 | 50 | 49 |
| Unsolved Questions | 6 | 50 | 44 |
| Future & Career Intelligence | 2 | 50 | 48 |

Counts are from the repository audit, not a claim of 950 fully reviewed articles. Every new story must have distinct, useful content, a relevant unique image, alt text and a source; generated filler or unrelated/reused images must not be counted as complete.

## Remaining validation
1. Add and editorially review the missing stories in batches, starting with the categories with the largest gaps.
2. Manually check story-image relevance and licensing; automated path checks cannot determine visual relevance.
3. Test navigation, search, language toggle, dark mode, PWA install/offline fallback and mobile layouts in a real browser.
4. Run only a small, approved staging load test first. Do not ramp to 10,000 virtual users against GitHub Pages without explicit hosting approval and capacity planning.
5. Confirm the final deployment and re-run the content audit after the editorial work is complete.
