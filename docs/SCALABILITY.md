# Everyday scalability plan

## Target
- Content library: 2,000+ stories with a clean path to 10,000+.
- Traffic: design for cache-friendly delivery and validate capacity with load tests. “10,000 visitors” and “10,000 concurrent users” are different workloads; do not claim either is proven until tested.

## Recommended architecture
1. Static-first pages: pre-render each public story and category page as HTML.
2. CDN: cache HTML where safe, and cache versioned CSS/JS/images for long periods.
3. Media: serve correctly sized AVIF/WebP images with width/height, responsive sources and lazy loading below the fold. Videos should be click-to-play and hosted on a service that supports streaming/CDN delivery.
4. Search: build a compact index from story metadata; move to a dedicated search service only when measurements justify it.
5. Dynamic services: if accounts, cloud bookmarks, CMS or personalized feeds are added, isolate them behind an API and database; use rate limits, timeouts, caching and horizontal scaling where supported.
6. Public APIs: do not call external APIs on every page view. Fetch only after user action where possible, cache results and respect provider quotas/licences.

## Performance acceptance
- Core Web Vitals targets at the 75th percentile: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.
- Test representative journeys with Playwright and run load tests with k6 or an equivalent tool.
- Ramp traffic gradually (for example 100, 500, 1,000, 5,000, then 10,000 virtual users) and monitor p50/p95/p99 latency, error rate, throughput, cache hit ratio, bandwidth and origin saturation.
- Test realistic think time, multiple routes, search and asset requests. A single hot URL test is not sufficient.
- Define a success threshold before testing and record provider/plan limits. Never infer capacity solely from a successful deployment.

## GitHub Pages note
GitHub Pages can serve a static site, but it is not a general-purpose API server and does not give the project a configurable application load balancer. CDN behaviour and bandwidth/usage limits depend on the platform. Verify the current provider terms and use a suitable CDN/hosting plan if measured traffic requires it.

## Public API: Open-Meteo
- The weather page calls Open-Meteo Geocoding and Forecast endpoints only when a user searches or explicitly shares location.
- Per-browser local cache is 30 minutes; this reduces repeat calls on that device but is not a global cache.
- Display attribution next to data: https://open-meteo.com/ . Forecast data is CC BY 4.0; comply with attribution and current usage/pricing terms.
- The provider documents free access for non-commercial use and asks applications exceeding 10,000 API requests/day to contact them. Re-check current terms before monetizing or scaling traffic. If request volume becomes high, consider a server-side cache or self-hosted instance under the applicable licence/terms.
- Provide a clear error state and never present cached data as live without its timestamp.

## Before launch
- Validate all internal links and asset paths.
- Check duplicate story IDs, titles and image hashes.
- Confirm each article's image actually matches its subject.
- Run keyboard, contrast, mobile, offline, language-switch and dark-mode checks.
- Measure real-world Core Web Vitals after deployment; lab scores are not a substitute for field data.
