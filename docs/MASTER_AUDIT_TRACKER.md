# Everyday Oddities — Master Audit Tracker

Last updated: 2026-10-26  
Repository: `pkdiv6548/Everyday`  
Tracking branch: `main`


### Current task status summary (updated 2026-10-26)
- Complete: 4/24 (T01–T02, T06, T08).
- In progress: 4/24 (T03–T05 and T07; browser verification and editorial review remain outstanding).
- Pending/not started: 16/24 (T09–T24).
- Total unfinished tasks, counting both In progress and Pending: 20/24.

## How to use this tracker

- `Pending`: not yet worked through in this staged plan.
- `In progress`: actively being investigated or changed.
- `Fixed in code`: a code/document change exists, but it has not yet been verified in the live browser.
- `Verified`: acceptance criteria were checked and evidence is recorded.
- Do not mark a task `Verified` based on a successful deployment alone. CI, deployment, and real-browser behavior are separate checks.
- Work one task at a time. Record new findings under the matching task before moving on.

## Baseline verified from repository records

- Baseline commit at tracker creation: `6196fcdb477c0a07e562b46bc12ae7d2a157e789`. The latest follow-up fixes are recorded in the execution log below.
- GitHub Actions content audit for that commit: passed — [run 40320456785](https://github.com/pkdiv6548/Everyday/actions/runs/40320456785).
- GitHub Pages deployment for that commit: passed — [run 40320457091](https://github.com/pkdiv6548/Everyday/actions/runs/40320457091).
- Current story catalog baseline recorded in `docs/REMAINING_WORK.md`: 528 active dynamic records, 55 static Discover cards, 583 combined unique slugs, 424 generic-template records held for review and 6 duplicate records held for review.
- The 19-category target is 50 reviewed stories per category (950 category assignments). The recorded category coverage is 605/950, leaving 345 category assignments; every category is below its target.
- Existing fixes noted in `docs/REMAINING_WORK.md` include Discover sorting/reset consistency, search/category URL sync, category link corrections, bilingual UI accessibility labels, Weather stale-request guards, local illustrations for Experiments, and resilient Service Worker precaching.
- Browser verification for Discover interactions, Weather, PWA installation, offline behavior, cache upgrades, accessibility and responsive layouts remains outstanding unless separately evidenced.

## Staged task list

| ID | Stage | Priority | Task | Acceptance criteria | Status |
|---|---|---|---|---|---|
| T01 | 1 — Baseline | P0 | Create and maintain this master pending-issues tracker; verify current branch and CI/deployment state | Tracker exists on main and records evidence, known gaps, and statuses without treating deploy as browser verification | Complete |
| T02 | 1 — Critical checks | P0 | Audit JavaScript syntax, local paths, images, and key HTML pages | Automated checks pass; all discovered failures are logged | Complete |
| T03 | 1 — Critical checks | P0 | Verify navigation, Search, category filters, sorting, reset, and empty states | Expected behavior is confirmed in a browser or each untestable case is clearly marked | In progress |
| T04 | 1 — Critical checks | P0 | Verify English/Hindi toggle and translation parity | Primary UI and story text change correctly; remaining untranslated content is logged | In progress |
| T05 | 1 — Critical checks | P1 | Inspect dark mode, responsive layout, and visual defects | No confirmed high-impact layout/theme issue remains; tested viewport sizes are recorded | In progress |
| T06 | 2 — Content | P1 | Recalculate coverage for all 19 categories | Counts and gaps are generated from current files and match the documented baseline | Complete |
| T07 | 2 — Content | P1 | Review the 424 held-out generic-template story records | Each record is accepted, rewritten, or kept unpublished with a reason; no filler is republished to inflate counts | In progress |
| T08 | 2 — Content | P1 | Review 6 held-out duplicate-slug records | Each duplicate has a documented disposition and active catalogs remain free of slug collisions | Complete |
| T09 | 2 — Content | P1 | Check story-to-image relevance and repeated imagery | Mismatches and duplicates are logged and corrected with appropriate assets | Pending |
| T10 | 2 — Content | P1 | Review factual sources, image alt text, licensing, and provenance | Published stories have credible sources and media metadata; uncertain claims are qualified | Pending |
| T11 | 2 — Content | P1 | Bring each category to at least 50 reviewed stories | All 19 categories meet the target with unique, reviewed stories; no placeholders used | Pending |
| T12 | 3 — APIs/PWA | P1 | Test Weather API input, permissions, failure/retry, dates, and units | Valid and invalid city/network/location scenarios behave correctly in browser tests | Pending |
| T13 | 3 — APIs/PWA | P1 | Audit Service Worker installation, cache updates, and recovery | Install and upgrade flows are tested; failures do not strand users on a broken cache | Pending |
| T14 | 3 — APIs/PWA | P1 | Test offline fallback and cached pages/assets | Documented pages work offline where promised; missing offline capabilities are explicit | Pending |
| T15 | 3 — APIs/PWA | P2 | Test PWA installation and mobile behavior | Installability and core mobile use are verified on supported browsers/devices | Pending |
| T16 | 3 — APIs/PWA | P2 | Test every interactive experiment | Buttons, results, keyboard behavior, bilingual text, and safety notes pass checks | Pending |
| T17 | 4 — Quality | P2 | Run accessibility review | Labels, keyboard access, focus, semantics, contrast, and reduced-motion support are checked | Pending |
| T18 | 4 — Quality | P2 | Review SEO and metadata | Titles, descriptions, canonical/indexing behavior, and page-specific metadata are checked | Pending |
| T19 | 4 — Quality | P2 | Review loading performance and layout stability | Heavy assets, repeated requests, image sizing, and layout shift are measured and prioritized | Pending |
| T20 | 4 — Quality | P2 | Run responsive/regression checks across key pages | Mobile, tablet, and desktop behavior is checked after fixes | Pending |
| T21 | 5 — Release readiness | P2 | Review external resources and API data handling | External requests, attribution, error handling, and client-visible secrets are checked | Pending |
| T22 | 5 — Release readiness | P2 | Assess scalability and the 10,000-concurrent-user goal | A test plan and evidence-based capacity assessment exist; no unsupported capacity claim is made | Pending |
| T23 | 5 — Release readiness | P1 | Run final automated regression audit | Required CI checks pass on the release candidate | Pending |
| T24 | 5 — Release readiness | P1 | Deploy and verify the final release | Latest main commit is deployed and critical live behaviors are manually verified | Pending |

## Task execution log

### T01 — Baseline and tracker
- Confirmed the current main commit recorded in the audit notes: `6196fcdb477c0a07e562b46bc12ae7d2a157e789`.
- Confirmed Content Audit passed: [run 40320456785](https://github.com/pkdiv6548/Everyday/actions/runs/40320456785).
- Confirmed GitHub Pages deployment passed: [run 40320457091](https://github.com/pkdiv6548/Everyday/actions/runs/40320457091).
- Confirmed the content target remains incomplete: 19/19 categories below 50; 345 category assignments recorded as remaining.
- Browser-based verification is not implied by the successful workflows.
- Tracker commit: `739a6f0d86e78ce1e9d6150856a2b7d906d3ca4e`.
- Outcome: T01 complete. T02 started; automated audit details are being inspected.


### T02 — Static technical audit
- Used the successful Content Audit run on commit `6196fcdb477c0a07e562b46bc12ae7d2a157e789`: [run 40320456785](https://github.com/pkdiv6548/Everyday/actions/runs/40320456785).
- JavaScript syntax checks passed for `app.js`, `stories-extra.js`, and `scripts/category-coverage.mjs`.
- Content audit reported: 74 HTML pages, 55 article pages, 528 active dynamic records, 55 static cards, 583 combined unique slugs.
- Audit results: 0 broken local paths, 0 missing story image assets, 0 missing image alt attributes, 0 repeated story cover images, 0 externally hosted image source strings, and 0 content integrity issues.
- Known gap found by the coverage check: 19/19 planned categories remain below the 50-story target; this is tracked in T06/T11, not a syntax/path failure.
- CI also emitted environment deprecation warnings for Node.js 20 / action runtime and a `punycode` deprecation warning; the checks still passed. These warnings should be reviewed separately if they persist.
- Limitation: this is static/CI evidence, not a manual browser test.
- Outcome: T02 complete; T03 started.


### T03 — Interaction/runtime inspection (in progress)
- Static code inspection found a runtime error in the progressive-reveal section: `revealTargets` used the single-element query helper `$` but was subsequently treated as a collection with `.forEach()`. This could throw a `TypeError` and prevent the reveal behavior from initializing.
- Fixed `app.js` to use the multi-element helper `$$` for the selector list. Commit: `54d4d5640f01ca1ecd1c77572b480464795b1ba2`.
- Bumped the Service Worker cache from `everyday-oddities-v85` to `everyday-oddities-v86` so the changed app script is eligible for a fresh cache. Commit: `1602922e73fd1a36955ed1a56d636f3097439ff8`.
- Updated README and remaining-work documentation to v86: commits `d0dcb4891116649bcb2b436a478160a08eaba79d` and `12d6a0fde9741a87c91d831914da30cc443bc76b`.
- Not yet marked fixed/verified: need successful CI on the newest commit, then browser verification of reveal animations, search, filters, sort/reset and language switching.


### Follow-up finding during T03 — bilingual control selectors
- Code inspection found that `setLanguage()` used the single-element selector helper `$` for placeholder and aria-label translation, then called `.forEach()`. This is a second runtime TypeError risk and also would only target one element if it did not throw.
- Fixed both selectors to use `$$` so every matching input/control can receive its English/Hindi placeholder and aria-label. Commit: `56b323e3914c0badc1c48fb6c86201127c1fa43c`.
- Bumped Service Worker cache `v86 → v87` to refresh the updated app script. Commit: `057870730a1307d9c4bcb6821f6882bf4f992add`.
- README updated to v87 in the documentation commit listed by GitHub history.
- T03 remains in progress until current CI/deployment and browser behavior are verified. T04 is now in progress for the dedicated bilingual audit.


### T03 — CI confirmation and science filter fix
- Confirmed the Content Audit and GitHub Pages deployment both succeeded for tracker commit `e329e2cb57c9ed44d225e643b9e6c924987b60b0`: [Content Audit run 40321153917](https://github.com/pkdiv6548/Everyday/actions/runs/40321153917), [Pages deployment run 40321153874](https://github.com/pkdiv6548/Everyday/actions/runs/40321153874).
- Additional static review of `explore.html` found 55 static story cards across nine category values. The “Science explained” chip was only matching `physics` and `sound`, which omitted related categories such as light, water, materials, food science, and human body.
- Expanded the Science explained filter to include `light`, `physics`, `water`, `materials`, `food`, `body`, and `sound`. Commit: `345ecd0b1c9636c91714baf389bce30da20ad059`.
- Bumped Service Worker cache `v87 → v88` so clients can pick up the updated filter logic. Commit: `74de41b073805f9c13bae99dde88a8c691fc8b18`; README cache version updated in the next documentation commit.
- Browser interaction testing remains unverified; the available live-site page fetch did not load through the web viewer, so no claim of manual browser verification is made. T03 stays in progress until browser checks can be completed on the deployed version.


### Follow-up verification — language selector correction
- Re-fetched `app.js` from `main` and confirmed the placeholder and aria-label selectors were still using the single-element helper. The earlier report had incorrectly stated this was fixed; that claim was not verified against the current file.
- Corrected both selectors to use `$$` and verified the exact selectors are present once each in the updated source. Commit: `2d97b663560fa37f68ad236f120e94e449275b92`.
- Bumped Service Worker cache `v88 → v89` to invalidate the previous cached app version. Commit: `5ab01484f98a9c5cba51e2d52e237eb0db64d143`; README updated in the following documentation commit.
- Content audit passed for the prior code revision `a3f1a386`; the audit for this new fix and the Pages deployment for the current head still need to complete.
- Manual browser verification has not been performed, so T04 remains In Progress.


### T05 — dark-mode filter contrast fix
- Confirmed the Pages deployment for tracker revision `2c5d698c` succeeded: [deployment run 40322263563](https://github.com/pkdiv6548/Everyday/actions/runs/40322263563). The content audit for that revision also succeeded: [audit run 40322263810](https://github.com/pkdiv6548/Everyday/actions/runs/40322263810).
- CSS review found a contrast issue: in dark mode, active/hover filter chips inherited a light `var(--ink)` background but forced white text, reducing readability.
- Added a dark-mode override so active/hover filter chips use the lime accent background, dark green text, and matching border. Commit: `5df41168b9c407aa39c4beecd6f23c4bd332229f`.
- Bumped Service Worker cache `v89 → v90` to refresh clients. Commit: `06b82b065e183f43173a93d3ebf97aa3120fa563`; README version updated in the next docs commit.
- The new CSS/cache commits still need their own CI/deployment completion. Visual browser contrast testing remains unverified, so T05 is in progress.


### T03 — Science filter coverage regression fix
- Follow-up source review found the “Science explained” filter included only 7 of the 9 static story-card categories; `nature` and `space` were omitted.
- Expanded the filter list to include both categories. Commit: `6848d1a10095913f85e43830843f75bfaedd0a9a`.
- Added a regression check to `scripts/category-coverage.mjs` that compares the Science filter list against all category values used by static Explore cards. Missing categories now fail the category-coverage audit. Commit: `7570b1f178e4c749288deac2d43d7a3fad4a7d93`.
- Bumped Service Worker cache `v90 → v91` to refresh clients. Commit: `2e095fa2940c9346912f67ea1e4c5241f2e4d1ac`; README updated in `642c2b6fab02ed8d0ac9d2e944c80632b7a6a943`.
- Automated CI is required to confirm the new regression check and deployment. Browser interaction testing is still not verified.


### T03 — Explore sort persistence
- Confirmed the prior latest revision `c7a6bcf1` passed the Content Audit and Pages Deployment: [audit 40322704000](https://github.com/pkdiv6548/Everyday/actions/runs/40322704000), [deployment 40322704451](https://github.com/pkdiv6548/Everyday/actions/runs/40322704451).
- Source review found Explore's sort control did not persist its selection in the URL, so reloading or sharing a filtered URL could lose the chosen sort order.
- Updated `syncExploreUrl()` to set/remove the `sort` query parameter and restore supported values (`featured`, `az`, `za`) on page load. Commit: `5fb4012e093999baf193128e8e67040274282abf`.
- Bumped Service Worker cache `v91 → v92`. Commit: `d0ca3d39a29097c5c82074f0c2d3c16d62f1d447`; README updated in `58343f2ec0be16906003e5fb6d6ae09fdc94c732`.
- Automated audit/deployment for the new changes are pending. Browser-level reload/share testing remains unverified.
- Additional uncovered gap: Explore currently has filter chips for 19 planned categories, but the 55 static cards only cover 9 category values. The other category filters can legitimately return zero cards because the extra-story catalog is not rendered as Explore cards. This needs a dedicated catalogue-integration task rather than disguising the missing coverage.


### T06 — Category coverage recalculated
- Re-ran `scripts/category-coverage.mjs` through the latest successful Content Audit workflow on revision `9f9ffe50ae`: [audit run 40323744340](https://github.com/pkdiv6548/Everyday/actions/runs/40323744340).
- The report confirmed 528 active dynamic records, 55 static Discover cards, 583 unique combined slugs, and zero content-integrity issues.
- Category totals matched `docs/REMAINING_WORK.md`: 605/950 category assignments; 345 assignments still needed; all 19 categories remain below 50 stories.
- T06 acceptance criteria are met because the current counts and gaps are generated and match the documented baseline. This does **not** mean T11’s 50-reviewed-stories-per-category goal is complete.
- The latest Pages deployment also succeeded on the same revision: [deployment run 40323744552](https://github.com/pkdiv6548/Everyday/actions/runs/40323744552).
- Outcome: T06 complete; next content workstream is T07, while T03–T05 still need browser verification.


### T07 — Editorial review batch 1
- Added an explicit review ledger to `data/stories-review-queue.json` for the first 25 of 424 held-out generic-template records.
- All 25 are recorded as `keep-unpublished` because their current explanations still use generic boilerplate and several title templates have grammar/content-quality defects; each has a documented reason and must be rewritten with a topic-specific explanation and credible source before reconsideration.
- Queue remains safely held out of the active public catalog; no placeholder stories were republished.
- Current progress: 25/424 reviewed; 399 records remain to be reviewed. T07 stays in progress.
- Review ledger verified from main: 25 decisions recorded, 424 held-out records retained.


### T07 — Editorial review batch 2
- Screened the next 25 held-out records and recorded explicit `keep-unpublished` dispositions in `data/stories-review-queue.json`.
- Rationale is recorded per slug: generic templated text is not a topic-specific, fact-checked explanation; records must be rewritten bilingually and supported by a reliable topic-level source before publication.
- No held-out record was added to the active public catalog.
- Progress after this batch: 50/424 reviewed; 374 remain. T07 stays in progress.


### T03 — Discover URL-state regression coverage
- Added `scripts/explore-state-check.mjs` with checks for search query (`q`), category, sort mode, restoring URL state, and Clear Filters reset behavior.
- Wired the regression script into `.github/workflows/content-audit.yml`; the workflow now runs its syntax check and regression checks on pushes and pull requests.
- Bumped service-worker cache to `everyday-oddities-v93` so deployed clients refresh updated app assets.
- This improves automated regression coverage, but T03 remains In Progress until the new Actions run passes and interactive browser testing confirms actual behavior.


### T07 — Editorial review batch 3
- Screened records 51–75 from the held-out queue and recorded an explicit disposition and reason for each slug.
- All 25 remain unpublished because the existing copy is generic, not yet a fact-checked topic-specific explanation. This prevents filler content from being used to inflate the public category counts.
- Progress: 75/424 reviewed; 349 remain.


### T07 — Editorial review batch 4
- Screened the next 25 held-out records (records 76–100) and logged each slug's `keep-unpublished` disposition with its reason.
- The active public catalog remains unchanged; no generic filler was reintroduced.
- Progress: 100/424 reviewed; 324 remain.


### T08 — Duplicate-slug dispositions recorded
- Reviewed the six held-out records against the catalog note that their bespoke static article pages remain active.
- Recorded an explicit `keep-unpublished` disposition for each duplicate slug (`moon-phases`, `why-shadows-change-length`, `why-iron-rusts`, `why-salt-melts-ice`, `why-rainbows-are-arcs`, `why-wood-floats`). The static article is the canonical active version; duplicate dynamic records remain held out.
- Updated `data/stories-duplicate-review.json` with review date, count summary, and per-slug decisions. Commit: `747893380d87441f9c2c7f0f34f5e2ca5c98888d`.
- Acceptance check: all 6 held-out duplicate slugs have a documented disposition; no duplicate was reintroduced into the active catalog.
- Outcome: T08 complete.
