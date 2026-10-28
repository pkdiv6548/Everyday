# Data Lab API Attribution and Provider Policy Audit

**Reviewed:** 2026-10-28  
**Scope:** Data Lab primary providers and fallbacks used by `data-lab.html`  
**Status:** Operational review, not legal advice. Re-check provider terms before commercial deployment or a material change in use.

## Executive summary

The page has source labels for its 20 UI panels, and several components already show per-item source links, authors, credits, or license labels. A source label alone is not sufficient for every dataset or image: licenses can vary by individual record, and API access terms do not necessarily license the underlying content.

### Highest-priority actions

1. **Open-Meteo:** make the source attribution a clickable link and include the CC BY 4.0 license link near displayed weather/air-quality data. The free API tier is intended for non-commercial use; commercial use requires the appropriate plan.
2. **Art Institute of Chicago / The Met fallback:** display collection images only when the specific record is marked public domain/open access. Keep the source-record link and artist/institution credit.
3. **iNaturalist:** its API has request limits and photos have their own licensing status. The current image buttons set blank image-credit and source fields; expose the photo attribution/license and link to the taxon/observation record, or do not show an image when rights metadata cannot be confirmed.
4. **Open Food Facts:** product images currently have blank credit/source fields and no product-record link. Add contributor/source attribution and the product link; document the database and image licenses separately.
5. **Wikipedia:** the history panel's source label says no outbound links are provided. Add per-result source-page links and attribution for excerpts. Wikipedia text is not a blanket public-domain dataset.
6. **Open Library:** follow its human-facing discovery guidance, cache where possible, identify the app when feasible, and avoid high-volume or high-traffic commercial-backend use. Browser-side requests cannot set a custom User-Agent header; review a server-side proxy or provider approval if usage grows.
7. **Providers whose specific API terms were not confirmed in this review** (notably the ISS position API, Spaceflight News API, classic GDELT DOC API, and DuckDuckGo fallback): keep visible attribution and source links, avoid republishing full third-party content, and confirm current terms before commercial use.

## Provider-by-provider matrix

| Provider / UI panel | Usage, attribution, and rights notes | Current implementation / action |
|---|---|---|
| NASA APOD — `nasa-status` | NASA imagery may generally be used factually when NASA is acknowledged and no endorsement is implied. Individual items may contain third-party copyrighted material; the item's copyright/credit field controls. The current APOD endpoint is the new WordPress API, not the retiring legacy endpoint. | The panel displays title, explanation, date, and `copyright`/`credit` when supplied. Preserve the item-specific credit and source link; do not assume every asset is NASA-owned. |
| NASA Image and Video Library — `nasaimages-status` | NASA media can include third-party material; check each asset's metadata. NASA's name/logo must not imply endorsement. | The card shows a NASA source label and some center/creator metadata. Improve mapping of per-asset creator/copyright fields and keep the NASA item-detail link. |
| Open-Meteo forecast and air quality — `weather-api-status`, `air-status` | API data is CC BY 4.0 and requires appropriate credit, a license link, and indication of changes where applicable. Free API usage is for non-commercial use within the published daily volume; commercial use requires the appropriate commercial plan. | Current panel source labels are plain text. Add a clickable Open-Meteo attribution and CC BY 4.0 link beside both forecast and air-quality output. |
| GBIF — `life-status` | License is record/dataset-specific: CC0, CC BY, or CC BY-NC may apply. CC BY requires attribution; CC BY-NC excludes commercial use. GBIF asks users to respect API limits and dataset-specific terms. | The panel has a general GBIF source label and warns that occurrence data can have separate licenses, but does not expose a license/record link for each displayed species. Add record/source links and preserve license metadata before presenting individual occurrence records. |
| USGS earthquake feed — `quake-status` | USGS-authored data is generally public domain, but not every image or third-party item on USGS pages is. Do not use USGS logos to imply official endorsement. | Keep the USGS source label and event-detail links. Check rights separately if third-party media are ever added. |
| Wikimedia Commons — `commons-status` | Each file has its own license and attribution requirements. For CC BY/CC BY-SA, retain author/creator, source, license link, and note modifications; ShareAlike conditions may apply to adaptations. | Results already show author and license metadata and open image details. Verify that the file page and license link remain accessible for every result; never treat Commons as one blanket license. |
| ISS position API — `iss-status` | Provider-specific licensing/usage terms were not confirmed during this review. Use restrained request volume and identify the provider. | Panel source label exists. Add a clickable provider/source link and confirm current terms before commercial use. |
| Spaceflight News API — `space-status` | API-specific commercial/reuse terms were not confirmed during this review. Headlines and metadata should not be treated as a license to republish full article text or images. | The UI links to the original article and labels the provider. Keep article links and do not add full-text scraping. Confirm current API terms before commercial use. |
| OpenAlex — `research-status` | OpenAlex states that its data is CC0. Individual linked scholarly works may have their own copyright and access/license conditions; a metadata record does not license the paper itself. | The UI links to the paper/source record. Keep metadata and full-text licensing separate; do not imply that all linked papers are reusable. |
| Frankfurter — `currency-api-status` | Frankfurter's code is MIT, but rate data comes from central banks/official providers and upstream provider terms may apply. Rates may be delayed, missing, revised, or blended; they are not guaranteed financial/accounting advice. | The panel displays a source/date label. Keep the rate date and provider/source link visible; do not present rates as guaranteed or authoritative for tax/accounting decisions. |
| Wikipedia — `history-status`, `knowledge-status` | Wikipedia text is generally under CC BY-SA 4.0 and GFDL, subject to project-specific exceptions. Reuse requires attribution and license information; adaptations may have ShareAlike obligations. | The history panel currently says there are no outbound links in results. Add per-article source links and attribution for displayed extracts. Keep excerpts brief and do not present them as original Everyday content. |
| Wikidata — `facts-status` | Wikidata structured data is CC0. Attribution is not required by CC0, but source links are good practice. Other Wikidata namespaces may use different terms. | Labels/descriptions and IDs are shown. Add entity links to make provenance verifiable. |
| iNaturalist — `inat-status` | Keep API traffic within published limits (aim for about one request per second, and below the published daily threshold). Individual photos may have different licenses; photo host/domain can indicate licensing status. API access does not make all photos freely reusable. | The current result image metadata sets blank `data-api-credit` and `data-api-source`. Add photo attribution/license and source links, or suppress the image when its rights cannot be verified. |
| Open Library — `books-status` and book fallback | Open Library asks for human-facing, time-sensitive requests, caching, app identification, and no bulk harvesting or high-traffic commercial-backend use. Published default limits are low (1 request/second for unidentified use). Book metadata and cover-image rights should be considered separately. | The panel links to individual book records, which is good. Cache where possible and review usage requirements before increasing volume; cover images should not be assumed to be universally reusable. |
| Open Food Facts — `food-status` | Open Food Facts data is open data, but database and image reuse can have different license requirements. Its documentation asks for a custom identifying User-Agent and use-case registration; product photos require per-source/license care. | Product image cards currently set blank credit/source metadata and do not link to the product record. Add product-record links and contributor/license attribution; account for browser restrictions on setting User-Agent if request volume grows. |
| Gutendex / Project Gutenberg — `gut-status` | Gutendex is a catalog API; a book's copyright status depends on the specific record and jurisdiction. A book that is public domain in the United States may not be public domain elsewhere. | UI warns that copyright status depends on country and links to the book record. Keep the copyright field where available and avoid asserting that every listed book is public domain worldwide. |
| Art Institute of Chicago — `art-status` | Art Institute artwork metadata is generally CC0, while description fields can be CC BY 4.0; images must be assessed by the record's public-domain/rights fields. API guidance recommends responsible query volume and a project-identifying header where feasible. | Current code filters on `image_id` but does not require `is_public_domain === true` before displaying an image. Filter to eligible public-domain/open-access images and retain artist, institution, and artwork-record link. |
| The Met — art fallback | The Met Open Access collection makes designated public-domain images available; the API is subject to museum terms and request-rate guidance. Do not infer that every collection object/image is Open Access. | Verify the fallback filters for the public-domain flag and retains the collection record link and artist/source credit before displaying an image. |
| GDELT DOC 2.0 — `events-status` | This page uses the classic GDELT DOC 2.0 endpoint; do not confuse its policy with the separately branded GDELT Cloud product. Specific classic DOC API commercial terms were not confirmed in this review. Respect throttling and link to publishers. | The UI displays headline/source/date and links to the publisher, not full article text. Keep this behavior and do not republish full news articles. |
| Google News RSS fallback — `events-status` | Google News helps users discover brief descriptions and links to publisher sites; publisher content remains the publisher's. The RSS feed's own usage/copyright statement should be checked before production/commercial use. | Current UI uses headline/source metadata and original links. Do not store or display full article text; confirm RSS terms for the intended deployment. |
| Hacker News fallback — `events-status` | The official HN API exposes public story metadata. The official API documentation states there is currently no rate limit, but linked article content remains third-party content. | UI displays story title/link as a fallback. Keep the original link and avoid reproducing the linked article body. |
| DuckDuckGo Instant Answer fallback — `facts-status` | Specific reuse/commercial terms for the exact fallback endpoint were not confirmed during this review. | Keep source attribution and add a link to the original result/provider where possible. Confirm terms before commercial use. |
| USDA FoodData Central fallback — `food-status` | USDA data is often public information, but individual data fields/images can have third-party rights or specific source conditions. Keep the source identifiable. | The status can identify USDA as fallback, but individual food cards do not currently link to a USDA record. Add source-record links and keep provider identity visible when this fallback supplies the results. |

## Official references reviewed

- [NASA APIs / APOD migration](https://api.nasa.gov/) and [NASA Images and Media Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)
- [Open-Meteo license and terms](https://open-meteo.com/en/pricing)
- [GBIF terms of use](https://www.gbif.org/terms) and [GBIF data user agreement](https://www.gbif.org/terms/data-user)
- [Wikimedia Commons reuse guidance](https://commons.wikimedia.org/wiki/Commons:REUSE) and [Wikimedia Foundation terms](https://foundation.wikimedia.org/wiki/Terms_of_Use)
- [OpenAlex API reference](https://help.openalex.org/api/) and [data licenses](https://help.openalex.org/data/licenses/)
- [Frankfurter license and provider terms](https://frankfurter.dev/license/)
- [iNaturalist developer guidance](https://www.inaturalist.org/pages/developers) and [API recommended practices](https://www.inaturalist.org/pages/api+recommended+practices)
- [Open Library API usage guidelines](https://openlibrary.org/developers/api)
- [Open Food Facts API documentation](https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/)
- [Gutendex API documentation](https://github.com/garethbjohnson/gutendex)
- [Art Institute of Chicago API documentation](https://api.artic.edu/docs/)
- [The Met Collection API](https://metmuseum.github.io/) and [museum terms](https://www.metmuseum.org/de/policies/terms-and-conditions)
- [Hacker News API](https://github.com/HackerNews/API)
- [Google News terms](https://www.google.com/intl/en_us/terms_google_news.html)
- [USGS earthquake data and usage](https://www.usgs.gov/programs/earthquake-hazards/earthquakes)

## Follow-up checklist

- [ ] Make Open-Meteo attribution and CC BY 4.0 license clickable on both panels.
- [ ] Filter Art Institute and Met fallback images by public-domain/open-access status.
- [ ] Add iNaturalist per-photo attribution/license/source link or suppress unverified images.
- [ ] Add Open Food Facts product-record links and contributor/license attribution.
- [ ] Add source-page links for Wikipedia history excerpts and Wikidata facts.
- [ ] Add source-record links for GBIF and USDA fallback records.
- [ ] Confirm current terms for ISS, Spaceflight News API, classic GDELT DOC API, and DuckDuckGo before commercial use.
- [ ] Re-check this matrix whenever a provider, endpoint, fallback, or deployment model changes.
