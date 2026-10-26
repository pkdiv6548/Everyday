# P0-03 — Page Inventory

- Repository: `pkdiv6548/Everyday`
- Branch inspected: `main`
- Scope: inventory from `README.md`, `scripts/site-smoke-test.mjs`, and HTML paths referenced by `sw.js`.
- Status: **PARTIALLY VERIFIED**. This is a source-based inventory; live HTTP/browser reachability was not tested, and the service-worker precache list may not include every HTML file in the repository.

## Main and utility pages

| Page | Purpose inferred from repository documentation / route name | Evidence |
|---|---|---|
| `index.html` | Home | README; smoke test; service-worker precache |
| `explore.html` | Discover/search stories | README; smoke test; service-worker precache |
| `categories.html` | Topic directory | README; smoke test; service-worker precache |
| `weather.html` | Weather / forecast | README; smoke test; service-worker precache |
| `time.html` | Time utility | Smoke test; service-worker precache |
| `future.html` | Future technology, careers and learning plans | README; smoke test; service-worker precache |
| `experiments.html` | Interactive experiments | README; smoke test; service-worker precache |
| `about.html` | About | README; smoke test; service-worker precache |
| `feedback.html` | Feedback | README; service-worker precache |
| `data-lab.html` | Data lab (route name only; detailed purpose not verified) | Service-worker precache |
| `offline.html` | Offline fallback | Service-worker precache |
| `story.html` | Story/detail route (route name only; detailed behavior not verified) | Service-worker precache |

## Topic pages

- `physics.html`
- `food.html`
- `water.html`
- `light.html`
- `materials.html`
- `sound.html`

These are listed in README and referenced in the service-worker precache.

## Individual article pages referenced by service-worker source

- `articles/banana-browns.html`
- `articles/bread-rises.html`
- `articles/fingers-wrinkle.html`
- `articles/leaves-change-colour.html`
- `articles/lightning-thunder.html`
- `articles/metal-feels-cold.html`
- `articles/microwave-works.html`
- `articles/mirror-left-right.html`
- `articles/moon-phases.html`
- `articles/plants-follow-light.html`
- `articles/popcorn-pops.html`
- `articles/rainbow-bubbles.html`
- `articles/smell-of-rain.html`
- `articles/stars-twinkle.html`
- `articles/static-electricity.html`
- `articles/voice-recording.html`
- `articles/water-weird.html`
- `articles/why-apples-turn-brown.html`
- `articles/why-cats-purr.html`
- `articles/why-chameleons-change-colour.html`
- `articles/why-chilli-feels-hot.html`
- `articles/why-ears-pop.html`
- `articles/why-fingerprints-unique.html`
- `articles/why-flamingos-pink.html`
- `articles/why-fog-forms.html`
- `articles/why-geckos-climb-walls.html`
- `articles/why-glass-transparent.html`
- `articles/why-goosebumps.html`
- `articles/why-ice-cracks.html`
- `articles/why-ice-expands.html`
- `articles/why-iron-rusts.html`
- `articles/why-leaves-green.html`
- `articles/why-lightning-can-strike-twice.html`
- `articles/why-magnets-attract.html`
- `articles/why-onions-make-you-cry.html`
- `articles/why-planets-shine.html`
- `articles/why-pressure-cooks-faster.html`
- `articles/why-pupils-change-size.html`
- `articles/why-rain-smells.html`
- `articles/why-rainbows-are-arcs.html`
- `articles/why-salt-melts-ice.html`
- `articles/why-shadows-change-length.html`
- `articles/why-sky-blue.html`
- `articles/why-snow-sounds-quiet.html`
- `articles/why-snowflakes-six-sided.html`
- `articles/why-sound-echoes.html`
- `articles/why-space-is-silent.html`
- `articles/why-stars-have-colours.html`
- `articles/why-static-worse-winter.html`
- `articles/why-sun-warms-earth.html`
- `articles/why-sunflowers-track-sun.html`
- `articles/why-sunrise-colours.html`
- `articles/why-sweat-cools-body.html`
- `articles/why-wood-floats.html`
- `articles/why-yawning-spreads.html`

## Inventory summary

- 12 main/utility routes identified from the source references above.
- 6 topic pages identified.
- 54 article paths referenced by the service-worker source.
- Total unique HTML route paths identified in these sources: 72 (including the root path `/` only as a route alias is not counted separately here).
- `scripts/site-smoke-test.mjs` explicitly smoke-tests 9 routes: `/`, `categories.html`, `explore.html`, `weather.html`, `time.html`, `future.html`, `experiments.html`, `about.html`, and `articles/why-sky-blue.html`.

## Findings / follow-up items

1. The smoke-test route list covers only a subset of the source-derived inventory. This is not by itself a defect, but it leaves other pages outside that test's direct route loop.
2. The service-worker list is a cache/precache reference, not a canonical file-system listing. The full repository HTML file count and any unreferenced HTML files remain **unverified** in this task.
3. This task did not test internal link targets, page rendering, JavaScript runtime behavior, or live deployment status; those belong to later audit tasks.
4. README identifies the site as plain HTML/CSS/JavaScript with no build step, which is consistent with the listed static page structure.

## Sources inspected

- `README.md`
- `scripts/site-smoke-test.mjs`
- `sw.js` (cache version found in source: `everyday-oddities-v97`)

No application code or site behavior was changed in this task.
