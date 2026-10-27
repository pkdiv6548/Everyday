# P0-14 — Automated Smoke Test Integration

**Status:** PASS — GitHub Actions run `40431105067` completed successfully.

## Changes

- Added `scripts/ci-test-integration-check.mjs` to verify that all 10 browser-test scripts are both syntax-checked and executed by `.github/workflows/content-audit.yml`.
- Added the integration guard to the workflow so future edits cannot silently remove a browser test command or its syntax check without failing CI.
- Added the guard itself to the JavaScript syntax-check command.

## Failure found and corrective change

The first full workflow run failed in `scripts/service-worker-registration-test.mjs`: the test observed no `sw.js` registration from `/`. The cause was that `app.js` waited for the window `load` event before attempting registration, which can be delayed by other page resources. Registration now starts at `DOMContentLoaded` (or immediately if the document is already ready), without blocking page rendering. The fix is in commit `f712e18b4ed03927354997a1d3d1cf8b7cb32809`.

## Verification

GitHub Actions run [40431105067](https://github.com/pkdiv6548/Everyday/actions/runs/40431105067) completed successfully. The workflow passed:
- JavaScript syntax checks and automated browser-test integration guard
- Discover URL-state and search regressions, including edge cases
- Shared runtime selector and Time page regressions/integration
- Weather API race-condition and response-validation tests
- Interactive controls
- Service Worker registration
- Offline/cache recovery
- Multi-page site smoke tests
- Responsive layout smoke tests
- Deployed GitHub Pages route smoke tests
- Local path/image reuse, story-image relevance candidates, media provenance candidates, and category/story integrity audits

## Limitations

This confirms the current automated workflow and the tests it runs; it does not guarantee every browser/device combination is defect-free. P0-02 remains separately tracked as HOLD for its broader live-deployment verification and is not closed by this report.
