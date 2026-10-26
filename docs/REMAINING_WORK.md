# Remaining work — Everyday Oddities

Last checked: 2026-10-26

## Verified fixes in this pass
- Fixed the static HTML audit so it does not interpret HTML fragments inside inline JavaScript strings as real page links or image tags. The content-audit workflow step passed after this change.
- Fixed local story-image validation to ignore URL query strings and fragments when checking whether an asset exists. This prevents a valid asset such as `fingers-wrinkle.svg?v=2` from being reported missing.
- Replaced the duplicated Discover-card illustration for `why-rain-smells` with a separate local rain/monsoon illustration.
- Updated the article cover for `why-rain-smells` so it also uses a different local illustration from `smell-of-rain`.
- Updated README content counts and forecast/cache descriptions; service-worker cache version bumped to v54.

## Current automated catalog baseline
Latest inspected audit output before the unique-card-image correction:
- Dynamic story records: 958; unique dynamic slugs: 958.
- Static Discover cards: 55.
- Unique combined catalog slugs: 1,007.
- All 19 planned categories meet the automated minimum of 50 catalog entries (0/19 below minimum).
- The category audit failed only because two static story cards reused the same image; that duplicate has now been corrected and the workflow is running again.

These are automated catalog counts, not a claim that every story has received expert editorial review. The latest workflow result must be checked after the current commit before declaring the whole audit green.

## Remaining work — in priority order
1. Confirm the newest GitHub Actions content-audit run passes both audit steps and the latest GitHub Pages deployment succeeds.
2. Review dynamic stories for near-duplicates, shallow or repeated explanations, title/content mismatch, reliable citations, publication/review dates, and full Hindi/English parity.
3. Manually review image relevance, alt text, licensing/provenance and any API-sourced media; automated checks cannot judge whether an illustration visually matches a story.
4. Browser-test Discover search, every category filter, sorting/reset/empty states, Hindi toggle, dark mode, navigation and mobile layouts.
5. Browser-test Weather for valid/invalid city input, API failure/retry, location permission denial, forecast date/units and responsive layout.
6. Test all Experiments interactions, explanations, keyboard controls and safety notes.
7. Test PWA installation, offline fallback, stale-cache upgrades and recovery after reconnecting.
8. Run performance checks (bundle size, image loading, Core Web Vitals) on desktop and mobile; optimize the 2 MB-class story data bundle if still present.
9. Audit keyboard navigation, visible focus, contrast, alt text, reduced-motion behavior, page metadata, canonical URLs and sitemap.
10. Run a small approved staging load test before considering larger concurrency; do not run high-volume tests against GitHub Pages without capacity approval.

## Reporting rule
Mark an item as resolved only after a reproducible check passes. Keep automated results, manual editorial review and real-browser tests clearly separated.
