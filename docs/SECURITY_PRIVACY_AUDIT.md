# Security & Privacy Review — Everyday Oddities

- **Review date:** 2026-10-27
- **Scope:** Public static-site source on `main`, with focus on `app.js`, `feedback.html`, `data-lab.html`, `sw.js`, and repository guidance.
- **Review type:** Source-code review only. This is not a penetration test, dependency audit, browser/network inspection, or proof that no vulnerability exists.
- **Related task:** [Issue #28](https://github.com/pkdiv6548/Everyday/issues/28)

## Summary

No obvious API keys, access tokens, or passwords were identified in the reviewed public files. The current integrations use public third-party APIs and the README explicitly advises not to place secrets in client-side files. This conclusion is limited to the files and patterns reviewed; it does not cover all repository history, every asset, GitHub account settings, or deployed network behavior.

### Findings

| ID | Severity | Finding | Evidence / impact | Recommended action |
|---|---|---|---|---|
| SEC-01 | Medium hardening | External URLs from API responses are HTML-escaped but not consistently scheme-validated before becoming links or image sources. | In `data-lab.html`, `loadEvents()` places API-provided `x.url` in an `href`; `apiImageCard()` places `url` in an `href` and `image` in an image source. The `safe()` helper escapes HTML characters, but escaping alone does not reject non-HTTP(S) URL schemes. Exploitability depends on an upstream response containing an unsafe URL; no live exploit was demonstrated. | Add a URL allowlist helper that parses URLs and permits only approved `https:` (and, where explicitly required, same-origin relative) destinations. Reject invalid URLs and add tests for `javascript:`, `data:`, malformed and valid HTTPS values. |
| SEC-02 | Low / privacy UX | Feedback details are encoded into a GitHub “new issue” URL. | `app.js` builds a URL with the user-provided title/details and redirects the browser to GitHub. `feedback.html` discloses that the user must review the draft and may need a GitHub account. Data is not submitted automatically by the page, but the details become part of a third-party URL and may be visible in browser history or copied/shared links. | Keep the disclosure adjacent to the submit action, advise users not to include sensitive/private information, and consider a provider-backed private feedback path if privacy expectations change. |
| SEC-03 | Low / hardening | Language switching writes `data-en` / `data-hi` attribute values using `innerHTML`. | `app.js` assigns page-authored translation attributes to HTML. The reviewed usage appears to be static repository content; no user-controlled path into these attributes was established. If these attributes are ever populated from remote or user-controlled data, markup injection could become possible. | Prefer `textContent` for plain-text translations. For the small number of intentional markup translations, use an explicit trusted-markup allowlist or render those elements separately. Do not put untrusted content in translation attributes. |
| SEC-04 | Informational | Third-party data providers receive browser requests directly. | `data-lab.html` calls public APIs including NASA, Open-Meteo, GBIF, USGS, Wikimedia Commons, OpenAlex, Wikipedia, Open Library, iNaturalist, Wikidata, GDELT and others. Search terms may be included in query strings for user-initiated searches. | Document providers and their privacy/terms where appropriate; keep queries free of sensitive user data; review provider terms and attribution requirements before commercial use. |
| SEC-05 | Not observed in reviewed files | No obvious embedded API secret found. | A targeted source review did not identify obvious API-key/token/password literals in the sampled public files. This is not equivalent to a complete secret scan. | Run a repository-wide secret scanner and review commit history separately; rotate any credential if one is ever found in public history. |

## Existing positive controls observed

- Feedback form text says no feedback database exists, opens a draft GitHub Issue for user review, and warns that a GitHub account may be required.
- Feedback title and details have client-side length constraints, and the URL is built with `URLSearchParams`.
- Data Lab responses are generally rendered through a `safe()` helper that escapes `& < > " '` before insertion into HTML.
- Several external links opened in new tabs include `rel="noopener noreferrer"`.
- The README states that API secrets must not be stored in client-side files and recommends user-initiated requests and failure handling.
- `app.js` stores only language and theme preferences in `localStorage` in the reviewed paths; no personal profile or authentication data was observed there.

## Not tested / limitations

- No active penetration testing or payload injection was performed against the live site.
- No browser DevTools network capture, security-header measurement, TLS/certificate check, dependency/SCA scan, GitHub secret scanning configuration review, or full Git history scan was completed.
- GitHub Pages has hosting-level limitations for custom response security headers; any proposed header change must be checked against what the host supports.
- API responses and provider behavior can change; findings should be revalidated after code or provider changes.

## Recommended remediation order

1. Validate outbound URLs and image URLs at the point of use (SEC-01).
2. Run a repository/history secret scan and document the result (SEC-05).
3. Keep feedback privacy disclosure clear and add a sensitive-information warning (SEC-02).
4. Replace plain-text translation `innerHTML` use with `textContent` where feasible (SEC-03).
5. Re-run focused tests and document evidence before closing Issue #28.

## Acceptance status

This report records a scoped source review and actionable findings. It does **not** claim that all security issues are resolved or that the site is penetration-tested. SEC-01 and the recommended code hardening remain follow-up implementation work unless separately fixed and tested.
