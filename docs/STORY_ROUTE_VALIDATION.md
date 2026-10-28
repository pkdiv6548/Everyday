# Story slug route validation

**Reviewed:** 2026-10-28

## Behavior

- `story.html?slug=<slug>` accepts only a single lowercase kebab-case slug (input is normalized to lowercase).
- The route checks whether `articles/<slug>.html` exists before redirecting.
- Existing static article slugs open their real article page.
- Missing, malformed, or unknown slugs render a clear “Story not found” fallback with a link back to Discover.
- A failed availability check renders a separate “Story unavailable” message rather than redirecting to an unrelated page.
- Browser regression coverage lives in `scripts/story-route-validation-test.mjs` and is wired into the content-audit workflow.

## Catalog limitation

At the time of review, `story.html` had an empty `#story-detail` container and no slug handler. `stories-extra.js` is an empty file, and the repository has no active published story-catalog data file. The story schema exists, but the review queue is empty and duplicate records are explicitly held for editorial review.

This implementation therefore bridges valid slugs to existing static article pages and safely handles unknown slugs. **It does not restore the missing dynamic story catalog.** Dynamic slugs that do not map to a static article will show the fallback until a reviewed, published catalog is restored. Do not publish generic-template or duplicate-review records merely to make a slug resolve.

## Acceptance checks

- [x] Valid static article slug redirects to the article and renders a headline and article content.
- [x] Unknown slug displays the fallback and a Discover link.
- [x] Malformed slug (including path traversal characters) is rejected without redirect.
- [x] Missing slug displays the fallback.
- [ ] Restore and validate the reviewed dynamic story catalog before enabling dynamic story records.
