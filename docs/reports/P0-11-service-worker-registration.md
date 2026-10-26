# P0-11 — Service Worker Registration Audit

**Status:** PASS — automated verification completed successfully in GitHub Actions run 40413260524.  
**Scope:** Registration path, scope, duplicate registration behavior, and graceful rendering when service workers are blocked.

## Findings

- `app.js` has one shared registration call. It chooses `../sw.js` for pages under `/articles/` and `./sw.js` for root-level pages.
- Registration is deferred until the window `load` event and uses `updateViaCache: 'none'`; it requests an update after registration.
- Registration errors are caught so a failed service-worker setup does not throw an unhandled rejection into the page UI.
- The browser registration API deduplicates registrations for the same script and scope. A browser test now navigates from the home page to an article and checks that only one matching registration exists.
- The new browser test checks that registration uses a same-origin directory scope and that ordinary page content still renders when service workers are blocked.
- The existing site smoke test explicitly blocks service workers, so it cannot validate real registration. This dedicated test uses a separate context with service workers allowed.

## Automated coverage added

File: `scripts/service-worker-registration-test.mjs`

1. Visit the home page and an article page.
2. Confirm `sw.js` is registered from both route types.
3. Check the scope remains same-origin and directory-based.
4. Check navigating between pages does not create duplicate registrations.
5. Confirm page title/body remain usable when service workers are blocked.
6. Fail on unexpected page runtime errors.

The test is added to the JavaScript syntax-check list and to the CI browser-test sequence.

## Verification limits

This test runs in a local HTTP server/Chromium context. It validates path selection and browser registration mechanics, but it does not establish that the current GitHub Pages deployment is reachable or that a real user's existing cache upgrades correctly. P0-02 remains on HOLD. Cache/offline recovery and update lifecycle are separate follow-up work in P0-12.

## Result

**PASS — registration path, scope, duplicate-registration check, and graceful rendering checks completed successfully in GitHub Actions.**
