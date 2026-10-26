# P0-14 — Automated Smoke Test Integration

**Status:** Integration guard added; awaiting GitHub Actions verification.

## Changes

- Added `scripts/ci-test-integration-check.mjs` to verify that all 10 browser-test scripts are both syntax-checked and executed by `.github/workflows/content-audit.yml`.
- Added the integration guard to the workflow so future edits cannot silently remove a browser test command or its syntax check without failing CI.
- Added the guard itself to the JavaScript syntax-check command.

## Verification

The guard covers Weather API race/response validation, Time page integration, Discover search and edge cases, interactive controls, service-worker registration, offline/cache recovery, multi-page smoke testing, and responsive layout testing.

The final status will be updated after GitHub Actions runs against the integration change.

## Limitations

This check verifies workflow wiring and script syntax coverage; it does not replace the browser tests themselves, which are run as separate workflow steps. Deployed-site verification remains separately tracked under P0-02.
