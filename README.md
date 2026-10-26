# Everyday Oddities

**The extraordinary hiding in ordinary things.**

A bilingual (English/Hindi), responsive science and knowledge-discovery website built with plain HTML, CSS and JavaScript for GitHub Pages. No build step is required.

## Main pages
- Home: `index.html`
- Explore/search: `explore.html`
- Topic directory and content roadmap: `categories.html`
- Weather and 7-day forecast: `weather.html`
- Future technology, careers and learning plans: `future.html`
- Interactive experiments: `experiments.html`
- About and feedback: `about.html`, `feedback.html`
- Topic pages: `physics.html`, `food.html`, `water.html`, `light.html`, `materials.html`, `sound.html`
- Individual explainers: `articles/`

## Current features
- English/Hindi language toggle, responsive navigation, dark mode and accessible focus styles
- Search, topic filters (including psychology, technology/AI, maths, micro-world, history and future skills), result count, reset controls and alphabetical sorting on Discover
- Category directory cards link into the corresponding Discover filter, including plants, geography, inventions and unsolved science
- 525 active bilingual dynamic story records and 55 static Discover cards (580 unique combined slugs). A further 427 generic-template records are preserved in `data/stories-review-queue.json`, and 6 duplicate catalog records in `data/stories-duplicate-review.json`; these are held out for review, not deleted.
- Media provenance and licence notes for reviewed image sources in `data/media-manifest.json`
- Interactive mini-experiments and article reading progress/share controls
- PWA manifest and service-worker offline fallback; the current service-worker cache version is v82. Offline behavior and cache updates still require real-browser verification.
- Weather lookup using Open-Meteo Geocoding + Forecast APIs; the page advertises current conditions and a seven-day outlook. API failure states, location permission handling and live forecast accuracy still require browser testing.
- Content/category plan and story-schema in `data/`; editorial image/source and scalability standards in `docs/`

## Open API policy
- Open-Meteo: weather geocoding and forecast. Free endpoint is for non-commercial use and data attribution is required; verify current provider terms before monetization or higher traffic. See https://open-meteo.com/en/terms and https://open-meteo.com/en/docs.
- Keep external requests user-initiated where possible, handle failures, disclose data freshness, and never store API secrets in client-side files.
- For future integrations, prefer documented open-data/open-source APIs (for example Wikimedia Commons for licensed media metadata) and record attribution/licence. Do not use a source image until its subject match and usage rights are verified.

## Content quality and scale
- Content target: at least 50 distinct reviewed stories in each of 19 categories (950 category assignments minimum). After removing generic filler and rewriting ten stories, the current catalog is below this target in all 19 categories; see `docs/REMAINING_WORK.md` for exact gaps. Content quality and image-to-story relevance still require editorial review.
- Each story should have a unique, relevant main image, alt text, source and licence metadata. Missing/mismatched media should be fixed before publication rather than replaced with unrelated imagery.
- See `docs/CONTENT_QUALITY.md` and `docs/SCALABILITY.md` for editorial checks, API limits and load-testing guidance.
- GitHub Actions runs JavaScript syntax checks plus `scripts/content-audit.mjs` to report broken local paths, missing image alt text, repeated article covers, duplicate dynamic-story image identifiers, missing local image assets and externally hosted image URLs. The audit is a technical baseline; unique image paths are checked automatically, but visual relevance still requires editorial review.
- 10,000 daily visitors and 10,000 concurrent users are different workloads. Capacity must be verified by measured load tests; GitHub Pages is static hosting, not an application server.
- `scripts/category-coverage.mjs` counts static Discover cards and dynamic records toward the 50-story category target, and checks bilingual fields, source URLs, unique slugs/images and local assets. `tests/load/` contains a manual k6 plan; it is not run automatically or against production.

- Discover search/category filters keep the URL synchronized with the current view; cache version is `everyday-oddities-v82`.

- Discover search input placeholder and accessible name now switch to Hindi with the site language; the sort control uses its translated visible label as its accessible name. Cache version: `everyday-oddities-v83`.

## Run locally
Open `index.html` in a browser. For service-worker/PWA testing, serve the folder through a local HTTP server.

## Publish on GitHub Pages
In repository **Settings → Pages → Build and deployment**, select **Deploy from a branch**, branch `main`, folder `/(root)`, then save.

Expected URL: https://pkdiv6548.github.io/Everyday/
