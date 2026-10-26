# P0-12 — Offline and Cache Recovery

**Status:** Test and CI integration added; final result pending GitHub Actions.

## Existing implementation reviewed

- The service worker uses cache version `everyday-oddities-v97`.
- During installation it attempts to precache core pages and assets in batches of 40. Individual precache failures are tolerated using `Promise.allSettled`, so one missing asset should not abort the whole install.
- During activation, older caches whose names begin with `everyday-oddities-` are deleted and clients are claimed.
- For same-origin page navigations, the worker attempts a network request first, caches successful responses, and falls back to a cached request, then `offline.html`, then `index.html`.
- For non-page GET requests, the worker checks cache first and then uses the network, caching successful responses.

## Automated coverage added

File: `scripts/offline-cache-recovery-test.mjs`

1. Wait for the service worker to control the page and create a versioned cache.
2. Verify the homepage and `offline.html` are present in cache.
3. Load a known article while online, then verify it remains readable after switching the browser context offline.
4. Navigate to a deliberately nonexistent, uncached path offline and verify the offline fallback is shown.
5. Restore network access and verify a normal page loads again.
6. Fail on unexpected page runtime errors.

The test is wired into `.github/workflows/content-audit.yml` and added to the JavaScript syntax-check sequence.

## Limitations

This is a local Chromium test, not a direct test of the currently deployed GitHub Pages instance. It exercises browser offline emulation and the worker's fallback path, but does not simulate every possible browser cache eviction, storage quota, or device-specific PWA lifecycle condition. P0-02 remains on HOLD.

## Result

Awaiting GitHub Actions run for the test integration commit. Do not mark this audit PASS until that run completes successfully.
