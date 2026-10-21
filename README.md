# Everyday Oddities

**The extraordinary hiding in ordinary things.**

A bilingual (English/Hindi), responsive science-discovery website built with plain HTML, CSS and JavaScript for GitHub Pages. No build step is required.

## Pages
- Home: `index.html`
- Discovery and search: `explore.html`
- Experiments: `experiments.html`
- About: `about.html`
- Topics: `physics.html`, `food.html`, `water.html`, `light.html`, `materials.html`, `sound.html`
- Articles: individual pages in `articles/`

## Features
- English/Hindi language toggle
- Responsive mobile navigation and layouts
- Search and category filters on Discover
- Dark mode
- Reader feedback page that prepares a reviewable GitHub issue; submissions are not stored by the static site
- Interactive mini-experiments
- Local SVG illustrations for the three featured homepage story cards
- PWA manifest and service-worker cache for offline fallback; offline mode should still be verified in a browser
- No external script files or downloaded font files are required by the site code
- Some Explore-page images and the homepage hero bubble artwork still load from external image hosts. Nine science articles now include links to further reading. The exact user-provided bubble PNG has not yet been added to the repository, so that specific asset task remains open.

## Run locally
Open `index.html` in a browser. No package installation is required. For best PWA testing, serve the folder through a local HTTP server rather than opening the file directly.

## Publish on GitHub Pages
In repository **Settings → Pages → Build and deployment**, select **Deploy from a branch**, branch `main`, folder `/(root)`, then save.

Expected URL: https://pkdiv6548.github.io/Everyday/
