# P0-13 — Responsive Smoke Tests

**Status:** Test added; awaiting GitHub Actions verification.

## Scope

New test: `scripts/responsive-smoke-test.mjs`

The test checks nine representative routes:
- Homepage
- Categories
- Discover
- Weather
- Time & Earth
- Future
- Experiments
- About
- A representative article

At 17 viewport widths (320, 360, 375, 390, 430, 650, 651, 768, 820, 821, 850, 851, 900, 1024, 1280, 1440 and 1920 CSS pixels), it checks document/body horizontal overflow and whether the site header stays inside the viewport. This produces 153 route/viewport layout checks.

It also tests that the compact mobile/tablet navigation opens, exposes links, and closes after selecting a link at seven widths: 320, 375, 650, 651, 768, 820 and 850 pixels.

The test is integrated into `.github/workflows/content-audit.yml` and its syntax check.

## Limitations

This is an automated Chromium smoke test, not a substitute for manual testing on real Android/iOS devices, touch behavior, browser zoom, assistive technology, or all pages and dynamic states. The existing broader smoke test still checks five viewport widths on nine routes. P0-02 deployed-site verification remains on HOLD.

## Result

Awaiting GitHub Actions completion. Mark PASS only after the dedicated responsive test passes.
