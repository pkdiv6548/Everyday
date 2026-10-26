# P0-01 — Repository Baseline Verification

**Checked:** 2026-10-27  
**Repository:** `pkdiv6548/Everyday`  
**Default branch:** `main`  
**Visibility:** Public  
**Archived:** No  
**Repository access:** Read/write available to connected GitHub integration  
**Live site:** https://pkdiv6548.github.io/Everyday/

## Result

**Status: PASS WITH DOCUMENTATION GAPS**

The repository is reachable, the `main` branch is available, and the core site/runtime, PWA, and audit files listed below exist. This task verifies repository structure and recorded metadata only; it does **not** claim that the live website or all browser interactions pass. Those are separate P0 tasks.

## Files verified

| File | Result | Notes |
|---|---|---|
| `README.md` | PASS | Main pages, features, audit scripts, and run/deploy guidance documented |
| `index.html` | PASS | Present; 21,430 characters at check time |
| `app.js` | PASS | Present; 14,558 characters at check time |
| `sw.js` | PASS | Present; 66,079 characters at check time |
| `manifest.webmanifest` | PASS | Present |
| `scripts/site-smoke-test.mjs` | PASS | Present |
| `scripts/content-audit.mjs` | PASS | Present |
| `scripts/category-coverage.mjs` | PASS | Present |
| `docs/REMAINING_WORK.md` | PASS | Current audit/remaining-work notes present |
| `.github/workflows/content-audit.yml` | PASS | CI workflow present |

## Confirmed baseline gaps

1. **Service-worker cache version documentation is stale/inconsistent.**
   - `sw.js` currently references `everyday-oddities-v97`.
   - `README.md` mentions v92 in the PWA feature bullet and also references v82/v83 in later historical notes.
   - `docs/REMAINING_WORK.md` records older versions including v94 and v86.
   - This is a documentation-consistency issue; it does not, by itself, prove a cache/runtime failure.

2. **README catalog totals are stale relative to the remaining-work report.**
   - README states 528 active dynamic records and 583 combined unique slugs.
   - `docs/REMAINING_WORK.md` states 538 active dynamic records and 593 combined unique slugs.
   - These values should be reconciled against a fresh audit before updating documentation.

3. **No `package.json` exists at the repository root.**
   - The fetch returned 404 for `package.json`.
   - The README describes a plain HTML/CSS/JavaScript site with no build step, so this is not automatically a defect. CI installs Playwright explicitly with `npm install --no-save playwright`.

4. **Latest commit status endpoint returned no status entries.**
   - The checked commit was `a2e048d326845f89c6e98b212ca6c7ef84c99c25` (latest commit returned by the repository commit search at check time).
   - An empty status list is not equivalent to a failed check and does not prove that the most recent deployment completed successfully. Deployment verification remains a separate task.

## CI workflow baseline

The existing `.github/workflows/content-audit.yml` includes:
- JavaScript syntax checks for site and audit scripts.
- Discover URL-state regression checks.
- Shared runtime selector checks.
- Time-page regression and browser integration checks.
- Multi-page browser smoke tests against local HTTP and the deployed GitHub Pages URL.
- Local path/content checks, image relevance candidates, source/media provenance, and category coverage checks.
- Upload of smoke-test screenshots as workflow artifacts.

## Scope and limitations

- Repository metadata and file existence were checked through the GitHub integration.
- File contents and documented audit history were inspected.
- No repository source files were changed in this task.
- No fresh local execution of Node/Playwright audits was performed in this task.
- No claim is made here that live routes, network/API behavior, PWA offline behavior, accessibility, or responsive layouts have passed. Those require the subsequent dedicated tasks.

## Next step (not executed)

**P0-02 — Live Deployment Verification:** inspect the deployed site and deployment/CI evidence independently. Do not start until P0-01 is accepted.
