# Everyday content and media quality rules

## Story records
Each story should have a stable unique ID, slug, title, category, subcategory, summary, full explanation, age-appropriate reading level, keywords, author/editor, sources, published date, reviewed date, image path, image alt text, media licence/source and optional related-story IDs.

## Publication gate
- Each active main category must have at least 50 distinct, reviewed stories before it is considered complete.
- A target count is not the same as published content. Never show a category as having 50 published stories unless 50 reviewed records actually exist.
- Duplicate detection must check stable IDs, normalized titles/slugs and similar subject/explanation—not only exact title matches.
- Each story must have its own unique main image. Detect identical files with SHA-256 and near-duplicates with perceptual hashes; then review image-to-story relevance manually.
- Do not hotlink random image search results. Keep licensed assets locally when practical and record provenance, licence and attribution.
- Never use a misleading generated illustration as if it were a documentary photograph.
- Prefer primary sources and reputable institutions. Separate established findings, ongoing research and forecasts.
- For future/career guidance, include uncertainty, region/context, skill prerequisites and a practical next step. Do not guarantee a job or income.
- For current information, show publication/review dates and update or correct stale facts.

## Editorial depth
Explain the direct answer first, then the mechanism, an everyday example, misconceptions/limits, a practical takeaway where appropriate, and links to trustworthy sources. Use plain language without removing scientific accuracy.

## Accessible media
Use descriptive alt text, responsive image sizes, dimensions to reduce layout shift, captions/transcripts for meaningful video, no autoplay sound, and respect reduced-motion preferences.
