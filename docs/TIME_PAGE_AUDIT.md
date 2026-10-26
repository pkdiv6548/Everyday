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
| TME-05 | Mostly implemented in source | Shared language-change event refreshes dynamic Time-page content; date, timezone and source-credit labels use the chosen locale. Some provider-supplied holiday names remain in the provider's English response. Check both languages in browser. |
| TME-06 | Migrated in source | Holiday URLs now use the documented Community API v4 route and response name field; live CORS/response/schema validation remains pending. |
| TME-07 | Implemented in source | Removed the inaccurate claim that API responses are session-cached; this page does not currently implement an API response cache. |
| TME-08 | Implemented in source | Solar values clear on request failure; successful solar response reports its date and update time. |
| TME-09 | Implemented in source | Quick-zone clocks are calculated locally and continue ticking even if the time provider is unavailable. |
| TME-10 | Implemented in source | Added `time.html` to service-worker precache and bumped the cache version to v95; fresh-install/offline browser test pending. |
| TME-11 | Implemented in source; static checks pass | Refresh/world-clock duplicate requests are guarded; each API panel now announces loading, error/success and freshness where available. Verify concurrent failures in browser. |
| TME-12 | Implemented for live lists | Currency, earthquake and holiday values now use DOM nodes and `textContent`; verify malformed provider responses in tests/browser. |
| TME-13 | Partially implemented | Localized selector accessible name and `aria-busy` states added; full keyboard and screen-reader review remains pending. |
| TME-14 | Implemented in source; browser review pending | Provider links added; solar, currency, earthquake and holiday cards expose update/date context. Validate timestamp clarity in browser. |
| TME-15 | Implemented in repository; CI passed | Added `scripts/time-page-regression-check.mjs` and wired it into the content-audit workflow. Latest content-audit run `40333683849` passed on main commit `60b639a8fcf215eae9c3e99214454491f04faef6`. |
| TME-16 | Pending | Requires rendered-browser QA at the specified viewport sizes, themes, languages, and offline/API-failure states. |
| TME-17 | Implemented in source | Added canonical and Open Graph metadata; rendered preview and canonical-target review remain pending. |

## Verification pass — 2026-10-26

Verification was performed against the current repository source and GitHub Actions. The live page could not be fetched by the available browser/web retrieval path (it returned a cache miss), and the public API JSON endpoints were not accessible through that reader. Therefore, do not interpret source checks as live-browser/API acceptance.

| Task | Source / static verification | Runtime verification |
|---|---|---|
| TME-01 | PASS. Dark button foreground/background pair is `#17332f` on `#d9f36a` (computed WCAG contrast approximately **10.95:1**). Dark-mode API error text `#ff9b8e` on `#1e302c` is approximately **6.82:1**. | Browser appearance not checked. |
| TME-02 | PASS. Selected and quick clocks are recalculated from `Date` + IANA time zones on the one-second local clock interval. | Actual ticking/time-zone/DST behavior not browser-tested. |
| TME-03 | PASS. Refresh includes `loadWorldTime()` and disables itself while in flight. | Click behavior not browser-tested. |
| TME-04 | PASS. Visible SunriseSunset.io backlink exists beside solar data; provider documentation explicitly requires a visible backlink. | Link click not browser-tested. |
| TME-05 | PARTIAL. Shared language-change event updates clock/status content; timezone/credit labels and the Hindi caching explanation were checked/fixed. Holiday names from the provider may still be English. | Full page toggle and all dynamic states not browser-tested. |
| TME-06 | PARTIAL. Uses documented v4 route `/api/v4/Holidays/IN/{year}` and reads the v4 `name` field. | Live response, CORS, India data and next-year behavior not verified. |
| TME-07 | PASS. English and Hindi explanatory copy no longer claims API response caching; no cache implementation is claimed. | Manual-refresh request counts not browser-tested. |
| TME-08 | PASS. Solar values clear on failure; success reports source date and last update time. | Forced API failure not browser-tested. |
| TME-09 | PASS. Quick-zone rendering is local and runs on the same one-second clock interval, independent of Hourora success. | Provider outage scenario not browser-tested. |
| TME-10 | PARTIAL. Service-worker precache includes `time.html` and cache version is `everyday-oddities-v95`. | Fresh-install and already-installed offline reload not tested. |
| TME-11 | PARTIAL. Source contains refresh/world-clock concurrency guards and panel loading/error/success statuses. | Concurrent refresh, timeout and partial API outage not runtime-tested. |
| TME-12 | PARTIAL. Currency, earthquake and holiday data rows use DOM nodes and `textContent`; fixed error messages remain static strings. | Malformed payload/injection simulation not runtime-tested. |
| TME-13 | PARTIAL. Status elements use `role=status` and `aria-live=polite`; selector accessible name is localized and loading controls use `aria-busy`. | Keyboard-only, focus, screen-reader and full contrast review not performed. |
| TME-14 | PARTIAL. All five source/provider links are present; solar, currency, earthquake and holiday statuses expose date/update context. | Link navigation and timestamp clarity not browser-tested. |
| TME-15 | PASS. Regression script is wired into CI; latest test step passed on commit `fb336bbe557f1cc9e0bf8f19c243d1a380fe2ea7`. | Automated tests are source-pattern guards, not a browser integration suite. |
| TME-16 | NOT VERIFIED. Responsive CSS has a single-column breakpoint at 700px and explicit dark-mode rules. | Required viewport, visual, keyboard, API-failure and offline checks remain outstanding because rendered-page access was unavailable. |
| TME-17 | PASS at source level. Canonical URL and Open Graph title/description/url metadata exist. | Search/social preview and duplicate-canonical behavior not externally validated. |

### Verification evidence

- Latest regression/content-audit CI run `40333683849` — **passed** on main commit `60b639a8fcf215eae9c3e99214454491f04faef6`.
- Latest GitHub Pages build/deployment run `40333680441` — **completed successfully** on that same main commit. This confirms the Pages deployment workflow completed; it does not substitute for inspecting the rendered live page in a browser.
- Live page retrieval attempt: cache miss. No screenshot, console log, live API response or offline-browser result is available from this pass.

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


## Follow-up implementation — 2026-10-26

The 13 follow-up audit tasks (TIME-A01 through TIME-A13) were addressed in source where feasible:
- Language changes no longer invoke the live-data refresh; they update local clocks and show a localized note that data status was not refreshed.
- Currency and holiday error states use DOM nodes and `textContent`, and their panels show localized loading/error messages.
- Holiday date calculation uses `Intl.DateTimeFormat().formatToParts()` in the India timezone instead of relying on locale output order.
- World clocks now calculate locally without a redundant Hourora network request; quick clocks include all selectable zones, city labels, and timezone offsets.
- The service-worker cache was bumped to v96 and `time.html` is included in its core precache.
- Regression checks were expanded for these behaviors and CI wiring remains in place.

Chromium browser integration is now part of CI. The automated browser test verifies mocked success responses for all four data providers, avoids refetches on language change, checks keyboard focus and the timezone accessible label, toggles Dark Mode, checks 320/375/768/1024/1440 px layouts for horizontal overflow, exercises a deliberately failed currency request, and confirms the cached Time page can reload offline through the service worker. The browser test uses mocked API responses, so it does not establish that third-party APIs are currently reachable or CORS-enabled from every visitor network. Screen-reader/manual assistive-technology testing and external social-preview rendering remain manual checks.
