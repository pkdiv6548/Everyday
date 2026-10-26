# P0-05 — Browser Runtime Error Audit

- Repository: `pkdiv6548/Everyday`
- Branch: `main`
- Task status: **TEST COVERAGE IMPROVED; latest CI run pending**
- Scope: review browser smoke-test instrumentation and existing Time-page integration test; add console-error collection to the multi-page browser smoke test.

## What was inspected

- `scripts/site-smoke-test.mjs`
- `scripts/time-page-browser-test.mjs`
- `.github/workflows/content-audit.yml`
- Recent GitHub Actions run/job metadata.

## Findings

1. The multi-page smoke test already captured uncaught JavaScript exceptions through Playwright's `pageerror` event.
2. The Time-page browser integration test already captured both `console.error` messages and uncaught page errors, then asserted that its collected errors were empty before the deliberate API-failure test.
3. The multi-page smoke test did **not** collect browser console errors. That meant some runtime errors logged via `console.error` could go unreported by that test.
4. No confirmed browser runtime error was established from this source review alone. The live website could not be independently opened through the available browsing/network path in the earlier deployment check; do not interpret that limitation as evidence that the website is down.

## Change made

Updated `scripts/site-smoke-test.mjs` to collect browser console errors while visiting its existing nine routes. It filters out common browser network-resource failure messages (which are tracked separately by the response/local-asset checks) and records other console errors as failures. The existing final assertion will fail the smoke test if these runtime-console errors are present.

- Commit: `4822d3b28c195b506a535e2c2ae6f5094f4674fc`
- [GitHub Actions run for the change](https://github.com/pkdiv6548/Everyday/actions/runs/40410371212)
- The run was in progress when checked; therefore, the newly added console-error assertion is **not yet marked verified by CI**.

## Current conclusion

P0-05 found and addressed a **runtime-error detection coverage gap**, not a confirmed application runtime defect. The latest CI run should be reviewed for the result of the expanded multi-page smoke test. No application feature code or UI was changed.
