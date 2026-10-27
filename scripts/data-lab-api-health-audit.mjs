#!/usr/bin/env node
/**
 * Live health check for the public data providers used by data-lab.html.
 * This checks endpoint reachability and minimum response shape, not the visual UI.
 * Set STRICT_API_AUDIT=1 to return a failing exit code when a provider fails.
 */
const timeoutMs = Number(process.env.API_AUDIT_TIMEOUT_MS || 12000);
const retries = 1;

const checks = [
  { name: "NASA astronomy feature", url: "https://science.nasa.gov/wp-json/wp/v2/apod-basic/", ok: d => Array.isArray(d) ? d.length > 0 : !!d && typeof d === "object" },
  { name: "Open-Meteo air quality", url: "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=29.9038&longitude=73.8772&current=european_aqi,us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata", ok: d => !!d && (d.current || d.error === true) },
  { name: "GBIF species search", url: "https://api.gbif.org/v1/species/search?rank=SPECIES&status=ACCEPTED&limit=1&highertaxonKey=1", ok: d => Array.isArray(d.results) },
  { name: "USGS earthquake feed", url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson", ok: d => d.type === "FeatureCollection" && Array.isArray(d.features) },
  { name: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=filetype%3Abitmap%20science&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url", ok: d => !!d.query && !!d.query.pages },
  { name: "ISS position", url: "https://api.wheretheiss.at/v1/satellites/25544", ok: d => Number.isFinite(d.latitude) && Number.isFinite(d.longitude) },
  { name: "Spaceflight News", url: "https://api.spaceflightnewsapi.net/v4/articles/?limit=1&ordering=-published_at", ok: d => Array.isArray(d.results) },
  { name: "OpenAlex research", url: "https://api.openalex.org/works?search=everyday%20science&per-page=1&select=id,title,abstract_inverted_index", ok: d => Array.isArray(d.results) },
  { name: "Open-Meteo forecast", url: "https://api.open-meteo.com/v1/forecast?latitude=29.9038&longitude=73.8772&current=temperature_2m,weather_code&timezone=Asia%2FKolkata&forecast_days=1", ok: d => !!d && (d.current || d.error === true) },
  { name: "Frankfurter currency", url: "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,INR", ok: d => !!d.date && !!d.rates && Number.isFinite(d.rates.USD) },
  { name: "Wikipedia search/extracts", url: "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=Indian%20history&gsrlimit=1&prop=extracts&explaintext=1&exchars=1000", ok: d => !!d.query && !!d.query.pages },
  { name: "iNaturalist taxa", url: "https://api.inaturalist.org/v1/taxa?q=butterfly&per_page=1&rank=species", ok: d => Array.isArray(d.results) },
  { name: "Open Library", url: "https://openlibrary.org/search.json?q=science&limit=1&fields=key,title", ok: d => Array.isArray(d.docs) },
  { name: "Wikidata search", url: "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Solar%20System&language=en&uselang=en&format=json&origin=*&limit=1", ok: d => Array.isArray(d.search) },
  { name: "GDELT news", url: "https://api.gdeltproject.org/api/v2/doc/doc?query=science%20discovery&mode=artlist&format=json&sort=datedesc&maxrecords=2&timespan=7d", ok: d => !!d && (Array.isArray(d.articles) || d.error !== undefined) },
  { name: "Open Food Facts", url: "https://world.openfoodfacts.org/cgi/search.pl?search_terms=oats&search_simple=1&action=process&json=1&page_size=1&fields=product_name", ok: d => Array.isArray(d.products) },
  { name: "Gutendex books", url: "https://gutendex.com/books/?search=science", ok: d => Array.isArray(d.results) },
  { name: "NASA Image Library", url: "https://images-api.nasa.gov/search?q=earth&media_type=image&page_size=1", ok: d => Array.isArray(d.collection?.items) },
  { name: "Art Institute of Chicago", url: "https://api.artic.edu/api/v1/artworks/search?q=landscape&limit=1&fields=id,title,image_id", ok: d => Array.isArray(d.data) },
];

async function probe(check) {
  let lastError = "unknown error";
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const started = Date.now();
    try {
      const response = await fetch(check.url, {
        headers: { Accept: "application/json", "User-Agent": "Everyday-Data-Lab-API-Audit/1.0" },
        signal: controller.signal,
      });
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); }
      catch { throw new Error(`HTTP ${response.status}; non-JSON response`); }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!check.ok(data)) throw new Error("HTTP 200 but response shape is unexpected");
      return { name: check.name, ok: true, status: response.status, ms: Date.now() - started };
    } catch (error) {
      lastError = error?.name === "AbortError" ? `timeout after ${timeoutMs}ms` : (error?.message || String(error));
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 700));
    } finally {
      clearTimeout(timer);
    }
  }
  return { name: check.name, ok: false, error: lastError };
}

const results = [];
for (let i = 0; i < checks.length; i += 4) {
  results.push(...await Promise.all(checks.slice(i, i + 4).map(probe)));
}
const nameWidth = Math.max(...results.map(r => r.name.length));
for (const r of results) {
  const state = r.ok ? `PASS HTTP ${r.status} · ${r.ms}ms` : `FAIL ${r.error}`;
  console.log(`${r.ok ? "✓" : "✗"} ${r.name.padEnd(nameWidth)}  ${state}`);
}
const passed = results.filter(r => r.ok).length;
const failed = results.length - passed;
console.log(`\nData Lab API audit: ${passed}/${results.length} endpoints passed; ${failed} failed.`);
if (failed && process.env.STRICT_API_AUDIT === "1") process.exitCode = 1;
