# Remaining work — Everyday Oddities

Last checked: 2026-10-26

## Verified fixes
- Corrected the static HTML audit so it ignores HTML fragments assembled inside inline JavaScript strings.
- Corrected local image validation to ignore query strings and fragments when checking asset existence.
- Replaced the duplicate Discover-card image for `why-rain-smells` and gave its article a separate local cover illustration.
- Aligned the Weather heading with the seven-day forecast requested by the API.
- Bumped the service-worker cache to `everyday-oddities-v73` after the latest story-data changes.
- Moved 485 generic-template records out of the active story library and preserved them in `data/stories-review-queue.json`.
- Replaced 296 repeated generic takeaways in active records with topic-specific notes derived from the corresponding explanation.
- Rewrote and republished 40 records with topic-specific bilingual answers, explanations and takeaways.
- Preserved 6 duplicate cross-catalog records in `data/stories-duplicate-review.json` and removed them from the active dynamic list; their bespoke static article cards remain active.
- Added audit checks for generic boilerplate and duplicate slugs across the static and dynamic catalogs.
- Corrected the Geography, Plants and Inventions category-card links to their matching Discover filters.
- Added Hindi translations for the headings, descriptions, subtopics and 50-story target labels across all 19 category cards.
- Added a combined Science Explained filter and corrected category links for Science Explained, Everyday Mysteries and Unsolved Questions; verified that all category filter links map to an existing Discover filter.
- Localized Weather API/network failures in Hindi and English, made the geocoding cache language-aware, and prevented stale city/location requests from replacing a newer forecast.
- Static-checked all 10 Experiments buttons: each target exists, each result has English and Hindi text, and no duplicate IDs were found.
- Replaced all 10 external Unsplash experiment-card backgrounds with matching local SVG illustrations already included in the service-worker core cache, removing third-party image requests from the Experiments page.
- Extended the content audit to inspect inline CSS `url(...)` backgrounds as well as `<img src>` attributes, so future external or broken background-image URLs are not silently missed.

## Current catalog baseline
- Active dynamic records: 507; unique dynamic slugs: 507.
- Static Discover cards: 55.
- Unique combined catalog slugs: 562, with no cross-catalog duplicate slugs.
- Records held out for review: 445 generic-template records and 6 duplicate-slug records.
- Active story-data JavaScript: approximately 580 KB by source-character count (UTF-8 byte size differs), down substantially from the pre-cleanup catalog.
- Latest inspected content-audit run passed JavaScript syntax, local-path/image checks and story-integrity checks. The report still shows 19/19 categories below the 50-record target; this is a content-completeness gap, not a broken-path or duplicate-integrity error.

## Minimum category target — still incomplete
The target is 50 distinct, reviewed stories per category (950 category assignments minimum). The latest coverage report shows:

| Category | Current | Target | Still needed |
|---|---:|---:|---:|
| Human Body | 31 | 50 | 19 |
| Space & Universe | 30 | 50 | 20 |
| Nature & Wildlife | 34 | 50 | 16 |
| Science Explained | 32 | 50 | 18 |
| Psychology & Mind | 31 | 50 | 19 |
| History & Civilizations | 31 | 50 | 19 |
| Technology & AI | 34 | 50 | 16 |
| Everyday Mysteries | 28 | 50 | 22 |
| Earth & Weather | 30 | 50 | 20 |
| Food Science | 33 | 50 | 17 |
| Optical Illusions | 30 | 50 | 20 |
| Micro World | 28 | 50 | 22 |
| Materials & Objects | 28 | 50 | 22 |
| Geography & World | 35 | 50 | 15 |
| Mathematics & Numbers | 28 | 50 | 22 |
| Plants & Botany | 33 | 50 | 17 |
| Inventions & Discoveries | 29 | 50 | 21 |
| Unsolved Questions | 28 | 50 | 22 |
| Future & Career Intelligence | 31 | 50 | 19 |

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
