# Everyday Oddities — Master Audit Tracker

Last updated: 2026-10-26  
Repository: `pkdiv6548/Everyday`  
Tracking branch: `main`

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
| T04 | 1 — Critical checks | P0 | Verify English/Hindi toggle and translation parity | Primary UI and story text change correctly; remaining untranslated content is logged | Pending |
| T05 | 1 — Critical checks | P1 | Inspect dark mode, responsive layout, and visual defects | No confirmed high-impact layout/theme issue remains; tested viewport sizes are recorded | Pending |
| T06 | 2 — Content | P1 | Recalculate coverage for all 19 categories | Counts and gaps are generated from current files and match the documented baseline | Pending |
| T07 | 2 — Content | P1 | Review the 424 held-out generic-template story records | Each record is accepted, rewritten, or kept unpublished with a reason; no filler is republished to inflate counts | Pending |
| T08 | 2 — Content | P1 | Review 6 held-out duplicate-slug records | Each duplicate has a documented disposition and active catalogs remain free of slug collisions | Pending |
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
