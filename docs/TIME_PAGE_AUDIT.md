# Time & Earth page — Deep audit and task plan

- Page: `time.html` — https://pkdiv6548.github.io/Everyday/time.html
- Repository: `pkdiv6548/Everyday`, branch `main`
- Audit date: 2026-10-26
- Audit type: deployed-page source/API-contract audit; browser-render verification is still required.
- Scope: local clock, world clock, sunrise/sunset, earthquakes, currency rates, public holidays, refresh/caching, language switching, dark mode, accessibility, SEO, PWA/offline and regression tests.

## Verification boundary

The deployed page URL could not be loaded in the available browser/web retrieval environment (the fetch returned a cache-miss error, and direct runtime network access was unavailable). Therefore this report does **not** claim visual/browser interaction verification. Findings below are grounded in the current `main` source (`time.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`) and provider documentation. UI appearance, live endpoint responses from the user's browser, viewport behavior and actual offline behavior must be checked in the later browser pass.

## Implementation progress — 2026-10-26

The first priority-ordered implementation pass has been committed. This is **source-level progress**, not a claim that the live page has passed browser acceptance.

| Task IDs | Current status | Evidence / remaining verification |
|---|---|---|
| TME-01 | Implemented in source | Explicit dark-theme lime/dark-text button colors; contrast and appearance still need browser verification. |
| TME-02 | Implemented in source | Selected and quick-zone clocks render from current device time using IANA zone formatting and tick each second. |
| TME-03 | Implemented in source | Refresh now includes the selected world-clock service check; button has a disabled/busy state. |
| TME-04 | Implemented in source | Visible SunriseSunset.io backlink added beside solar data. |
| TME-05 | Implemented in source | Shared language-change event refreshes dynamic Time-page content; date and timezone labels use the chosen locale. Check both languages in browser. |
| TME-06 | Migrated in source | Holiday URLs now use the documented Community API v4 route and response name field; live CORS/response/schema validation remains pending. |
| TME-07 | Implemented in source | Removed the inaccurate claim that API responses are session-cached; this page does not currently implement an API response cache. |
| TME-08 | Implemented in source | Solar values clear on request failure; successful solar response reports its date and update time. |
| TME-09 | Implemented in source | Quick-zone clocks are calculated locally and continue ticking even if the time provider is unavailable. |
| TME-10 | Implemented in source | Added `time.html` to service-worker precache and bumped the cache version to v95; fresh-install/offline browser test pending. |
| TME-11 | Partially implemented | Refresh and world-clock duplicate requests are guarded; consistent per-panel loading and freshness states still need review. |
| TME-12 | Implemented for live lists | Currency, earthquake and holiday values now use DOM nodes and `textContent`; verify malformed provider responses in tests/browser. |
| TME-13 | Partially implemented | Localized selector accessible name and `aria-busy` states added; full keyboard and screen-reader review remains pending. |
| TME-14 | Partially implemented | Provider links added and solar/currency freshness shown; consistent timestamps for every panel remain to be completed. |
| TME-15 | Implemented in repository | Added `scripts/time-page-regression-check.mjs` and wired it into the content-audit workflow; latest CI run is still pending at time of this update. |
| TME-16 | Pending | Requires rendered-browser QA at the specified viewport sizes, themes, languages, and offline/API-failure states. |
| TME-17 | Implemented in source | Added canonical and Open Graph metadata; rendered preview and canonical-target review remain pending. |

## Confirmed source-level findings

1. **Dark-mode “Get time” contrast defect.** The inline button style uses `background:var(--ink);color:#fff`, while the shared dark theme changes `--ink` to a pale color. The button can therefore become pale with white text.
2. **World clock is a snapshot, not a ticking clock.** It displays `d.time` from one request and is not updated on an interval. Quick-zone times are also rendered only when the request succeeds and are not kept ticking.
3. **Refresh button omits the world clock.** `refreshAll()` calls sunrise, earthquake, currency and holiday loaders, but not `loadWorldTime()`.
4. **Required SunriseSunset.io backlink is missing.** The panel says “Data by SunriseSunset.io” in a plain `span`; the provider requires a visible link back wherever its data is displayed.
5. **Dynamic API content is not fully language-reactive.** The shared language switch updates elements carrying `data-en/data-hi`, but dynamically rendered statuses, world-clock date, earthquake dates/empty state, and some labels are not re-rendered when the language changes. The device time zone label and the zone selector's accessible name are English-only.
6. **Caching copy does not match implementation.** The page says API responses are cached in the page session, but the page script has no in-memory response cache or `sessionStorage` cache. A manual refresh repeats the API calls.
7. **Sunrise data can look stale after a failed refresh.** The error path changes the status message but does not clear old sunrise/sunset/day-length values or show a clear “last successful update” timestamp.
8. **Service-worker precache omits `time.html`.** The service worker may cache it after a successful online visit, but a first offline visit cannot rely on this page being in the precache core list.
9. **Holiday API lifecycle needs attention.** The page uses the Nager v3 route. The project’s published documentation lists Community WebApi v3 end-of-life as 2027-01-31 and documents v4 routes; migrate and validate the v4 response shape before the cutoff.
10. **External data rendering should be hardened.** Currency quote labels are interpolated into `innerHTML`; build rows with DOM nodes and `textContent` rather than inserting provider-returned values into HTML strings.
11. **Provider/source credits are not navigable.** In addition to the required sunrise backlink, Hourora, USGS, Frankfurter and holiday source names are plain text rather than links. Add accessible source links where appropriate.
12. **API request state is basic.** The refresh button remains enabled during requests, there is no duplicate-request guard or per-panel loading state, and most API cards do not expose a clear last-updated time.
13. **No dedicated Time-page regression suite exists in the configured content-audit workflow.** Current general audits do not assert the page-specific clock, API, localization, attribution, dark-mode or offline contracts.
14. **SEO metadata is minimal.** The page has a title and description, but no page-specific canonical/Open Graph metadata. Validate whether these are desired for the static-site SEO policy.
15. **Visual and accessibility checks remain unverified.** The actual rendered live page was not inspectable here; responsive layout, keyboard flow, contrast measurements, browser console/network errors and real offline behavior require manual browser checks.

## Task breakdown

Tasks are intentionally granular and ordered by priority/dependency. No application-code fix is included in this audit-plan commit.

| Task ID | Priority | Task | Acceptance criteria |
|---|---|---|---|
| TME-01 | P1 | Fix dark-mode contrast for the world-clock submit button | Button has an explicit dark-theme background/foreground pair with WCAG AA contrast; verify light and dark themes. |
| TME-02 | P1 | Make the selected world clock tick correctly | Display advances each second using the selected IANA time zone; handle timezone/DST changes safely and stop duplicate timers. |
| TME-03 | P1 | Include world time in the “Refresh public data” action | Refresh action updates the selected world-clock response as well as the other data panels; loading/disabled state prevents duplicate requests. |
| TME-04 | P1 | Add required sunrise-data attribution backlink | A visible, accessible link to the provider is adjacent to the sunrise/sunset data and works in both themes. |
| TME-05 | P1 | Complete Hindi/English localization for dynamic content | Switching language updates status messages, world-clock date/offset, earthquake dates/empty/error states, local timezone label, selector label and credits without needing a page reload. |
| TME-06 | P1 | Migrate public-holiday integration from v3 to v4 | Use the documented v4 endpoint and schema; verify India holidays, current/next-year boundary, empty/error response and CORS in browser. |
| TME-07 | P1 | Implement caching or correct the caching promise | Either implement a documented TTL/session cache for suitable API data, or remove the claim that responses are cached; avoid caching current-time data beyond provider guidance. |
| TME-08 | P1 | Prevent stale sunrise/sunset values from appearing current | Show the queried date and last successful update; on failure clearly mark stale data or clear values rather than implying they are current. |
| TME-09 | P2 | Make quick-zone clocks available in fallback and keep them current | Quick zones render even if Hourora is unavailable, use browser timezone calculations, and update continuously; selected zone remains clear. |
| TME-10 | P2 | Add the Time page to the offline/PWA strategy | Decide whether to precache `time.html`; update service-worker core/cache version and verify fresh-install and previously-installed offline behavior. |
| TME-11 | P2 | Standardize API loading, error, retry and request concurrency states | Each panel exposes loading/success/error state; repeated refreshes are deduplicated or disabled; timeouts and partial-provider failure remain isolated. |
| TME-12 | P2 | Render all external API fields safely | Replace interpolated `innerHTML` with DOM creation and `textContent`; validate date, magnitude, rate and response fields before display. |
| TME-13 | P2 | Improve accessible labels and live updates | Labels are localized, live status announcements are concise, focus remains predictable, keyboard operation works, and loading states expose `aria-busy` where appropriate. |
| TME-14 | P2 | Add source/provider links and data freshness labels | Relevant provider names are clickable and accessible; data cards show source/date or “last updated” consistently. |
| TME-15 | P2 | Add Time-page automated regression checks to CI | Tests cover world clock ticking/refresh, endpoint/schema assumptions, localization hooks, required attribution link, safe rendering, and service-worker precache decision. |
| TME-16 | P2 | Complete responsive, visual, and accessibility browser QA | Check widths 320, 375, 768, 1024 and 1440 px; light/dark and Hindi/English; keyboard-only flow, contrast, console/network failures, API failure paths, and offline reload. Record screenshots/results. |
| TME-17 | P3 | Review page-specific SEO metadata | Add canonical and social-preview metadata if consistent with site policy; validate title/description and avoid duplicate canonical targets. |

## Suggested execution order

1. TME-01, TME-04, TME-05 (visible contrast, required attribution and localization).
2. TME-02, TME-03, TME-09 (clock semantics and refresh behavior).
3. TME-06, TME-07, TME-08, TME-11, TME-12, TME-14 (API lifecycle, caching, freshness, reliability and safe rendering).
4. TME-10, TME-13, TME-15 (offline, accessibility and regression guard).
5. TME-16, then TME-17 (browser acceptance and SEO polish).

## Provider references

- SunriseSunset.io requires a visible backlink wherever its data is displayed: https://sunrisesunset.io/api/
- Hourora API documentation describes the current-time endpoint and rate limit: https://hourora.app/en/developers
- Nager.Date project documentation lists Community WebApi v3 end-of-life as 2027-01-31 and v4 as supported: https://github.com/nager/Nager.Date
- Frankfurter documents the `quotes` parameter for filtering currencies: https://frankfurter.dev/
