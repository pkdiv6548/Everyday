# Remaining work — Everyday Oddities

Last checked: 2026-10-26

## Verified fixes
- Corrected the static HTML audit so it ignores HTML fragments assembled inside inline JavaScript strings.
- Corrected local image validation to ignore query strings and fragments when checking asset existence.
- Replaced the duplicate Discover-card image for `why-rain-smells` and gave its article a separate local cover illustration.
- Aligned the Weather heading with the seven-day forecast requested by the API.
- Bumped the service-worker cache to `everyday-oddities-v56` after the latest story-data changes.
- Moved 485 generic-template records out of the active story library and preserved them in `data/stories-review-queue.json`.
- Replaced 296 repeated generic takeaways in active records with topic-specific notes derived from the corresponding explanation.
- Preserved 6 duplicate cross-catalog records in `data/stories-duplicate-review.json` and removed them from the active dynamic list; their bespoke static article cards remain active.
- Added audit checks for generic boilerplate and duplicate slugs across the static and dynamic catalogs.

## Current catalog baseline
- Active dynamic records: 467; unique dynamic slugs: 467.
- Static Discover cards: 55.
- Unique combined catalog slugs: 522, with no cross-catalog duplicate slugs.
- Records held out for review: 485 generic-template records and 6 duplicate-slug records.
- Active story-data JavaScript: approximately 573 KB, down from approximately 1.27 MB before the cleanup.
- Latest inspected content-audit run passed JavaScript syntax, local-path/image checks and story-integrity checks. The report still shows 19/19 categories below the 50-record target; this is a content-completeness gap, not a broken-path or duplicate-integrity error.

## Minimum category target — still incomplete
The target is 50 distinct, reviewed stories per category (950 category assignments minimum). The latest coverage report shows:

| Category | Current | Target | Still needed |
|---|---:|---:|---:|
| Human Body | 29 | 50 | 21 |
| Space & Universe | 24 | 50 | 26 |
| Nature & Wildlife | 34 | 50 | 16 |
| Science Explained | 32 | 50 | 18 |
| Psychology & Mind | 25 | 50 | 25 |
| History & Civilizations | 29 | 50 | 21 |
| Technology & AI | 32 | 50 | 18 |
| Everyday Mysteries | 26 | 50 | 24 |
| Earth & Weather | 30 | 50 | 20 |
| Food Science | 33 | 50 | 17 |
| Optical Illusions | 30 | 50 | 20 |
| Micro World | 25 | 50 | 25 |
| Materials & Objects | 26 | 50 | 24 |
| Geography & World | 33 | 50 | 17 |
| Mathematics & Numbers | 25 | 50 | 25 |
| Plants & Botany | 33 | 50 | 17 |
| Inventions & Discoveries | 22 | 50 | 28 |
| Unsolved Questions | 26 | 50 | 24 |
| Future & Career Intelligence | 30 | 50 | 20 |

The 485 held-out records need topic-specific answers, explanations, takeaways, credible sources and manual image-relevance checks before they can return to the public catalog. The six duplicate records must be reviewed against their existing static articles before any reuse.

## Remaining work — in priority order
1. Confirm the newest GitHub Actions audit passes on the final cache-version commit and the latest GitHub Pages deployment succeeds.
2. Rewrite held-out stories in reviewed batches; do not restore generic placeholder content just to reach the 50-per-category target.
3. Review active stories for near-duplicates, shallow or repeated explanations, title/content mismatch, source reliability, review dates and full Hindi/English parity.
4. Manually review image relevance, alt text, licensing/provenance and API-sourced media.
5. Browser-test Discover search, category filters, sorting/reset/empty states, Hindi toggle, dark mode, navigation and mobile layouts.
6. Browser-test Weather for valid/invalid city input, API failure/retry, location permission denial, forecast date/units and responsive layout.
7. Test all Experiments interactions, explanations, keyboard controls and safety notes.
8. Test PWA installation, offline fallback, stale-cache upgrades and recovery after reconnecting.
9. Measure performance (active story data, image loading and Core Web Vitals) on desktop and mobile.
10. Audit keyboard navigation, visible focus, contrast, alt text, reduced-motion behavior, page metadata, canonical URLs and sitemap.
11. Run a small approved staging load test before considering larger concurrency; do not run high-volume tests against GitHub Pages without capacity approval.

## Reporting rule
Mark an item resolved only after a reproducible check passes. Keep automated results, manual editorial review and real-browser tests clearly separated.
