# Everyday Site Smoke-Test Report

**Date:** 2026-10-26  
**Repository:** `pkdiv6548/Everyday`  
**Branch:** `main`  
**Audit workflow:** [Run 40346028974](https://github.com/pkdiv6548/Everyday/actions/runs/40346028974)  
**Latest deployment for the tested site content:** [Run 40345685946](https://github.com/pkdiv6548/Everyday/actions/runs/40345685946)

## Scope

Automated Chromium smoke tests were run against both the checked-out site served locally and the deployed GitHub Pages site.

Routes:
- Homepage (`/`)
- `categories.html`
- `explore.html`
- `weather.html`
- `time.html`
- `future.html`
- `experiments.html`
- `about.html`
- `articles/why-sky-blue.html`

Viewport widths: **320, 375, 768, 1024 and 1440 CSS pixels**.

## Results

| Check | Result | Notes |
|---|---|---|
| Core route navigation | PASS | All 9 routes opened in Chromium. |
| Local HTTP errors on tested routes/assets | PASS | No same-origin HTTP errors detected. |
| Document titles and page landmarks | PASS | Titles exist; main landmark exists on non-article routes. |
| Image alt attributes | PASS | No missing `alt` attributes detected on tested routes. |
| Loaded image failures | PASS | No broken images detected among images that had completed loading during the check. |
| Primary navigation presence | PASS | Primary navigation links exist on tested routes. |
| Horizontal overflow | PASS | No document-wide horizontal overflow detected at the five viewport widths after the tablet footer fix. |
| Time page browser integration | PASS | Mocked API success/failure, language switching, keyboard focus, dark theme, responsive widths and offline reload. |
| Direct production route smoke test | PASS | Same route and viewport checks completed against GitHub Pages from the CI browser. |
| Homepage screenshots | CAPTURED | Mobile (375px) and desktop (1440px) screenshots uploaded as a workflow artifact. |

## Fix found during this audit

The first multi-page browser run detected **33px horizontal overflow at 768px** across the shared pages. The overflow came from the shared footer links, not the navigation header. A tablet-specific footer wrapping rule was added to `styles.css` for 651–820px. The repeated browser run then passed at all tested widths.

A compact tablet navigation rule was also added so the full navigation switches to a menu before it can exceed the available header width.

## Evidence and limits

- The smoke-test script is `scripts/site-smoke-test.mjs`.
- The workflow runs the smoke test locally and against `https://pkdiv6548.github.io/Everyday`.
- Mobile and desktop homepage screenshots are available in the **site-smoke-screenshots** artifact attached to the audit workflow run.
- This is a smoke test, not a full visual/editorial audit. It does not prove every user flow, every API response, all keyboard/screen-reader behavior, all lazy-loaded images, or every story's factual quality. Those remain separate tasks.
