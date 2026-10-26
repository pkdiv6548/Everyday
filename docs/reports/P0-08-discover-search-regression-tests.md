# P0-08 — Discover/Search Regression Tests

- Repository: `pkdiv6548/Everyday`
- Status: **PASS — browser regression test and full CI workflow succeeded**
- Verified commit: `ba8b40360632e8c9ca2ea517eb9ac5fd98a53ce2`
- Successful run: [GitHub Actions 40411437127](https://github.com/pkdiv6548/Everyday/actions/runs/40411437127)

## Coverage added

Created `scripts/explore-search-browser-test.mjs` and added it to `.github/workflows/content-audit.yml`. The browser test verifies:

1. Discover renders story cards.
2. Search narrows the visible story list and writes the query to the URL.
3. Search and category filters combine correctly.
4. Category state is synchronized to the URL.
5. A–Z and Z–A sort order is correct.
6. Search, category and sort state restore after navigation/reload.
7. Unsupported category/sort values fall back safely while valid search state remains.
8. Clear filters restores the full story list, Featured sorting, All stories, and a clean query string.
9. The tested interactions do not emit unexpected browser runtime errors.

## CI verification

The GitHub Actions run completed with overall **success**. Its logs explicitly show:

- `PASS — Discover/search regressions: matching, combined filters, A–Z/Z–A ordering, URL synchronization and restoration, invalid URL values, reset, and runtime errors.`
- `PASS — interactive controls: mobile navigation open/close, theme toggle, language toggle, Discover search/filter/sort/reset, URL state, accessibility state, and browser runtime errors.`
- Multi-page site smoke tests passed on nine routes and five viewport widths per route.
- Existing Time-page browser integration tests passed.
- Local paths/content audit and category coverage/story-integrity audit steps completed successfully.

During test development, CI exposed a defect in the new test harness: Playwright serialized DOM nodes into plain objects, while the assertion initially expected live DOM properties. The test was corrected to return explicit `category` and `title` values, and a subsequent run passed. This was a test-code defect; it did not establish an application defect.

## Limitations

- This is an automated test of Discover search/filter/sort and URL-state behavior, not a manual audit of every page or control.
- The separate P0-02 live deployment verification task remains on HOLD as requested. The successful workflow's deployed-route smoke step is useful CI evidence but does not change that task's status.
