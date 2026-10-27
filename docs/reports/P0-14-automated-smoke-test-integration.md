# P0-14 — Automated Smoke Test Integration

**Status:** Integration guard added; awaiting GitHub Actions verification.

## Changes

- Added `scripts/ci-test-integration-check.mjs` to verify that all 10 browser-test scripts are both syntax-checked and executed by `.github/workflows/content-audit.yml`.
- Added the integration guard to the workflow so future edits cannot silently remove a browser test command or its syntax check without failing CI.
- Added the guard itself to the JavaScript syntax-check command.

## Failure found and corrective change

The first full workflow run failed in `scripts/service-worker-registration-test.mjs`: the test observed no `sw.js` registration from `/`. The cause was that `app.js` waited for the window `load` event before attempting registration, which can be delayed by other page resources. Registration now starts at `DOMContentLoaded` (or immediately if the document is already ready), without blocking page rendering. This change is in commit `f712e18b4ed03927354997a1d3d1cf8b7cb32809` and is being re-verified by GitHub Actions run `40431105067`.

## Verification

The guard covers Weather API race/response validation, Time page integration, Discover search and edge cases, interactive controls, service-worker registration, offline/cache recovery, multi-page smoke testing, and responsive layout testing.

The final status will be updated after GitHub Actions runs against the integration change.

## Limitations

This check verifies workflow wiring and script syntax coverage; it does not replace the browser tests themselves, which are run as separate workflow steps. Deployed-site verification remains separately tracked under P0-02.
