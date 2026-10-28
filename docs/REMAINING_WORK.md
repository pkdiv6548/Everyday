- PWA reliability: service-worker installation precaches in batches of 40 and tolerates individual asset failures with `Promise.allSettled`. Current cache version is `everyday-oddities-v102`; CI now verifies stale-cache cleanup, core-shell precaching, offline fallback, cached article access and recovery after reconnect.

- Added a translated accessible group label to Discover’s topic-filter buttons so assistive technology identifies the filter controls as one named group.
- Bumped the service-worker cache to `everyday-oddities-v84` after the Discover accessibility update.

- Fixed Discover reset consistency: Clear search & filters now resets the sort dropdown to Featured order and restores the original story order.
- Fixed Discover sorting after language changes: when A–Z or Z–A is selected, switching language now reapplies the sort using the currently displayed titles.
- Fixed Discover sorting reset: choosing Featured order now restores the original card sequence instead of preserving a prior A–Z/Z–A order.

# Remaining work — Everyday Oddities

Last checked: 2026-10-28

## Verified fixes
- Added `scripts/image-relevance-audit.mjs` to produce a heuristic candidate list for article covers whose alt text and local filename weakly overlap the article title. The report explicitly requires manual visual confirmation; it does not automatically label images as wrong. The check is now included in CI. Service-worker cache bumped to `everyday-oddities-v94`.
- Added `scripts/explore-state-check.mjs` and wired it into GitHub Actions to regression-check Discover URL persistence for search (`q`), category, sorting, restoring query state on load, and reset behavior. Cache bumped to `everyday-oddities-v93` so deployed clients can pick up current assets.
- Corrected the static HTML audit so it ignores HTML fragments assembled inside inline JavaScript strings.
- Corrected local image validation to ignore query strings and fragments when checking asset existence.
- Replaced the duplicate Discover-card image for `why-rain-smells` and gave its article a separate local cover illustration.
- Aligned the Weather heading with the seven-day forecast requested by the API.
- - Moved 485 generic-template records out of the active story library and preserved them in `data/stories-review-queue.json`.
- Replaced 296 repeated generic takeaways in active records with topic-specific notes derived from the corresponding explanation.
- Rewrote and republished 61 records with topic-specific bilingual answers, explanations and takeaways.
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
- Active dynamic records: 573; unique dynamic slugs: 573 (CI run 40640134273).
- Static Discover cards: 55.
- Unique combined catalog slugs: 628, with no cross-catalog duplicate slugs.
- Records held out for review: 424 generic-template records and 6 duplicate-slug records.
- Active story-data JavaScript: approximately 580 KB by source-character count (UTF-8 byte size differs), down substantially from the pre-cleanup catalog.
- Latest inspected content-audit run (40640134273) passed syntax, local-path/image and story-integrity checks with 0 content-integrity issues. Category coverage is 650/950 assignments; 17/19 categories remain below target. This is a content-completeness gap, not a broken-path or duplicate-integrity error.

#

## Latest automated content baseline — 2026-10-28
- The latest reviewed batch (2026-10-26) added 10 topic-specific bilingual stories (5 Earth & Weather, 5 Optical Illusions) with 10 unique local SVG illustrations in commit `de8cab058edcc3d6235f1e2d52196e1371d40210`.
- Latest automated audit (CI run 40640134273) reports 573 unique dynamic slugs, 55 static cards, 628 combined slugs and 0 content-integrity issues. Category coverage is 650/950; Earth & Weather and Optical Illusions meet 50/50, while 17 categories remain below target, leaving 300 category assignments. Source-by-source editorial verification remains separate.
- CI and GitHub Pages deployment passed for this batch. The new source URLs are attached to each story; source-by-source editorial verification remains a separate requirement.

# Minimum category target — still incomplete
The target is 50 distinct, reviewed stories per category (950 category assignments minimum). The latest CI recalculation (run 40640134273) reports 650/950 category assignments, leaving 300 assignments; 17/19 categories remain below target. Earth & Weather and Optical Illusions are at 50/50. Latest coverage report:

| Category | Current | Target | Still needed |
|---|---:|---:|---:|
| Human Body | 34 | 50 | 16 |
| Space & Universe | 33 | 50 | 17 |
| Nature & Wildlife | 34 | 50 | 16 |
| Science Explained | 32 | 50 | 18 |
| Psychology & Mind | 32 | 50 | 18 |
| History & Civilizations | 31 | 50 | 19 |
| Technology & AI | 34 | 50 | 16 |
| Everyday Mysteries | 31 | 50 | 19 |
| Earth & Weather | 50 | 50 | 0 |
| Food Science | 33 | 50 | 17 |
| Optical Illusions | 50 | 50 | 0 |
| Micro World | 32 | 50 | 18 |
| Materials & Objects | 31 | 50 | 19 |
| Geography & World | 35 | 50 | 15 |
| Mathematics & Numbers | 32 | 50 | 18 |
| Plants & Botany | 33 | 50 | 17 |
| Inventions & Discoveries | 31 | 50 | 19 |
| Unsolved Questions | 31 | 50 | 19 |
| Future & Career Intelligence | 31 | 50 | 19 |
| **Total category assignments** | **650** | **950** | **300** |

The 424 remaining generic-template records need topic-specific answers, explanations, takeaways, credible sources and manual image-relevance checks before they can return to the public catalog. The six duplicate records must be reviewed against their existing static articles before any reuse.

- Added stale-request guards to weather geocoding and forecast requests so older searches cannot trigger unnecessary follow-up requests or overwrite the current result.

- Discover: Search, combined category filtering, A–Z/Z–A sorting, URL state restoration, invalid query parameters, empty results and reset behavior pass automated browser tests (CI run 40640134273).

- Discover accessibility: search accessible name/placeholder and sort label follow the selected language. Browser tests also verify language/theme preference persistence, keyboard navigation and skip-link behavior (CI run 40637020094).

## Remaining work — in priority order
1. Merge reviewed fixes in a controlled order, then confirm the latest GitHub Pages deployment and rerun smoke tests against the deployed site.
2. Rewrite held-out stories in reviewed batches; do not restore generic placeholder content just to reach the 50-per-category target.
3. Review active stories for near-duplicates, shallow or repeated explanations, title/content mismatch, source reliability, review dates and full Hindi/English parity.
4. Manually review image relevance, alt text, licensing/provenance and API-sourced media.
5. Re-run Discover, keyboard-navigation, dark-mode, and responsive browser suites after merge/deployment; current CI covers 73 content pages for dark mode and 63 routes for responsive layout.
6. Re-run Weather city disambiguation, API-failure, permission, forecast-unit and race-condition tests after merge/deployment.
7. Test all Experiments interactions, explanations, keyboard controls and safety notes.
8. Test PWA installation on real target devices/browsers; automated CI now covers offline fallback, stale-cache cleanup, core assets and reconnect recovery.
9. Measure performance (active story data, image loading and Core Web Vitals) on desktop and mobile.
10. Audit keyboard navigation, visible focus, contrast, alt text, reduced-motion behavior, page metadata, canonical URLs and sitemap.
11. Run a small approved staging load test before considering larger concurrency; do not run high-volume tests against GitHub Pages without capacity approval.

## Reporting rule
Mark an item resolved only after a reproducible check passes. Keep automated results, manual editorial review and real-browser tests clearly separated.
