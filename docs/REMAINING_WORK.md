# Remaining work — Everyday Oddities

Last checked: 2026-10-26

## Verified fixes
- Corrected the static HTML audit so it does not treat HTML fragments inside inline JavaScript strings as real page links or image tags.
- Corrected local image validation to ignore query strings and fragments when checking file existence.
- Replaced the duplicate Discover-card image for `why-rain-smells` and changed that article's cover to a separate local illustration.
- Aligned the Weather page heading with the seven-day forecast actually requested by the API.
- Bumped the service-worker cache key to `everyday-oddities-v54`.
- Removed 485 generic-template records from the active public story library and preserved them in `data/stories-review-queue.json` for later editorial rewriting. These records were not deleted.
- Replaced 296 repeated generic takeaways in the active story records with topic-specific notes derived from the corresponding explanation.
- Added a content-audit rule to flag the generic boilerplate patterns that caused the issue.

## Current catalog baseline
- Active dynamic records: 473 (all have unique slugs).
- Static Discover cards: 55.
- Unique combined catalog slugs: 522.
- Generic-template records held for rewrite: 485.
- Active story-data JavaScript size: approximately 580 KB, down from approximately 1.27 MB.
- The latest successful pre-cleanup audit found no broken local paths, missing local story image assets or duplicate story images. The audit is running again against the cleaned story catalog and the new boilerplate detector.

## Minimum category target — still incomplete
The target is 50 distinct, reviewed stories per category (950 category assignments minimum). The latest coverage calculation after removing generic records showed these gaps:

| Category | Current | Target | Still needed |
|---|---:|---:|---:|
| Human Body | 29 | 50 | 21 |
| Space & Universe | 25 | 50 | 25 |
| Nature & Wildlife | 34 | 50 | 16 |
| Science Explained | 33 | 50 | 17 |
| Psychology & Mind | 25 | 50 | 25 |
| History & Civilizations | 29 | 50 | 21 |
| Technology & AI | 32 | 50 | 18 |
| Everyday Mysteries | 26 | 50 | 24 |
| Earth & Weather | 31 | 50 | 19 |
| Food Science | 33 | 50 | 17 |
| Optical Illusions | 31 | 50 | 19 |
| Micro World | 25 | 50 | 25 |
| Materials & Objects | 28 | 50 | 22 |
| Geography & World | 33 | 50 | 17 |
| Mathematics & Numbers | 25 | 50 | 25 |
| Plants & Botany | 33 | 50 | 17 |
| Inventions & Discoveries | 22 | 50 | 28 |
| Unsolved Questions | 26 | 50 | 24 |
| Future & Career Intelligence | 30 | 50 | 20 |

Counts are catalog coverage, not a claim that every active story has received expert review. The 485 held-out records need topic-specific answers, explanations, takeaways, credible sources and a manual relevance check before they can return to the public catalog.

## Remaining work — in priority order
1. Confirm the newest GitHub Actions content-audit run passes with the boilerplate detector and the latest GitHub Pages deployment succeeds.
2. Rewrite the held-out stories in reviewed batches; do not restore generic placeholder content just to reach the 50-per-category target.
3. Review active stories for near-duplicates, shallow or repeated explanations, title/content mismatch, source reliability, publication/review dates, and full Hindi/English parity.
4. Manually review image relevance, alt text, licensing/provenance and API-sourced media; automated checks cannot determine whether an illustration visually matches a story.
5. Browser-test Discover search, every category filter, sorting/reset/empty states, Hindi toggle, dark mode, navigation and mobile layouts.
6. Browser-test Weather for valid/invalid city input, API failure/retry, location permission denial, forecast date/units and responsive layout.
7. Test all Experiments interactions, explanations, keyboard controls and safety notes.
8. Test PWA installation, offline fallback, stale-cache upgrades and recovery after reconnecting.
9. Measure performance (active story data, image loading and Core Web Vitals) on desktop and mobile.
10. Audit keyboard navigation, visible focus, contrast, alt text, reduced-motion behavior, page metadata, canonical URLs and sitemap.
11. Run a small approved staging load test before considering larger concurrency; do not run high-volume tests against GitHub Pages without capacity approval.

## Reporting rule
Mark an item resolved only after a reproducible check passes. Keep automated results, manual editorial review and real-browser tests clearly separated.
