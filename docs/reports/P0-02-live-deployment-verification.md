# P0-02 — Live Deployment Verification

**Checked:** 2026-10-27  
**Repository:** `pkdiv6548/Everyday`  
**Expected deployment:** https://pkdiv6548.github.io/Everyday/

## Result

**Status: PASS — site reachability confirmed by the site owner and automated live-route smoke test.**

The site owner confirmed in this conversation that they opened the live website and it was working. In addition, GitHub Actions run [40431556933](https://github.com/pkdiv6548/Everyday/actions/runs/40431556933) completed the deployed GitHub Pages route smoke-test step successfully on the current report commit. The associated Pages build/deployment run [40431555951](https://github.com/pkdiv6548/Everyday/actions/runs/40431555951) completed its build, status-report, and deploy jobs successfully.

The successful deployed-route smoke test uses Playwright/Chromium to check these nine routes:
- `/`
- `/categories.html`
- `/explore.html`
- `/weather.html`
- `/time.html`
- `/future.html`
- `/experiments.html`
- `/about.html`
- `/articles/why-sky-blue.html`

For each route, it checks document title/body, primary navigation, image alt attributes and loaded-image health, page/console errors and same-origin HTTP errors, and horizontal overflow at five viewport widths (320, 375, 768, 1024 and 1440 px).

## Evidence and limitations

- **Owner confirmation:** user reports opening the live site and confirming it works.
- **Automated live-route check:** PASS in run [40431556933](https://github.com/pkdiv6548/Everyday/actions/runs/40431556933).
- **Pages build/deployment:** PASS in run [40431555951](https://github.com/pkdiv6548/Everyday/actions/runs/40431555951).
- Service Worker registration, offline/cache recovery, and broader responsive behavior are covered in their dedicated audit reports and CI tests.

The audit environment's earlier inability to open the website directly was a tooling/network limitation, not evidence of an outage. This report records the newer successful evidence instead.

This is an automated smoke verification, not a claim that every browser/device combination has been manually tested. Re-run the route smoke test after significant deployment changes.
