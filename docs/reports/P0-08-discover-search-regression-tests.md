# P0-08 — Discover/Search Regression Tests

- **Status:** Additional edge-case coverage added; final CI verification for the latest change is pending.
- **Repository:** `pkdiv6548/Everyday`
- **Date:** 2026-10-27

## Existing verified coverage
The existing browser regression test `scripts/explore-search-browser-test.mjs` covers search matching, combined category filters, A–Z/Z–A sorting, URL synchronization/restoration, invalid URL values, reset behavior, and unexpected browser runtime errors.

The prior full CI run [40411437127](https://github.com/pkdiv6548/Everyday/actions/runs/40411437127) completed successfully for the existing tests and site smoke tests. This run predates the additional edge-case test below.

## New edge-case coverage
Added `scripts/explore-search-edge-cases-test.mjs` to test:
1. A query with no matches hides all story cards.
2. The no-results message becomes visible.
3. The results status reports zero matches.
4. A matching query restores results and hides the empty state.
5. A query containing spaces and an ampersand is preserved correctly through URL encoding.
6. These interactions do not emit unexpected browser runtime errors.

Updated `.github/workflows/content-audit.yml` to syntax-check the new test and execute it in a dedicated Playwright step.

## Current verification
- Confirmed the new test file exists on the default branch.
- Confirmed the workflow contains both the syntax-check command and dedicated edge-case test step.
- The prior run's success does **not** verify the newly added step. Latest-change CI completion and its result must still be checked before marking all of P0-08 as fully PASS.

## Boundaries
No live manual browser session against GitHub Pages is claimed here. P0-02 live deployment verification remains on HOLD as requested.
