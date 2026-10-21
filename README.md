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
- Interactive mini-experiments
- Local SVG illustrations for featured homepage story cards
- PWA manifest and service-worker cache for offline fallback
- No external scripts or font files are required by the site code
- Note: the homepage hero's soap-bubble artwork currently uses an external image URL; it has not yet been replaced with the exact user-provided PNG asset.

## Run locally
Open `index.html` in a browser. No package installation is required. For best PWA testing, serve the folder through a local HTTP server rather than opening the file directly.

## Publish on GitHub Pages
In repository **Settings → Pages → Build and deployment**, select **Deploy from a branch**, branch `main`, folder `/(root)`, then save.

Expected URL: https://pkdiv6548.github.io/Everyday/
