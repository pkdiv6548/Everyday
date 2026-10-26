# P0-10 — API Race Conditions and Stale Data

**Status:** Implementation and automated regression coverage added. Awaiting full GitHub Actions verification.

## Findings and changes
- The Weather page already uses a monotonically increasing request sequence to ignore responses from superseded city searches.
- Added regression tests that deliberately delay a geocoding response and a forecast response, then issue a newer search. The late responses must not replace the newer city/forecast.
- Fixed a UI state gap in location lookup: the previous forecast is now hidden immediately while location permission/data is pending, and the loading state is shown. Loading state is cleared on success, failure, or unavailable geolocation.
- The test uses deterministic mocked API responses; it does not rely on Open-Meteo uptime.

## Verification plan
- `scripts/weather-race-condition-test.mjs`: delayed geocoding and forecast race scenarios plus pending location UI.
- `scripts/weather-api-validation-test.mjs`: malformed API response, retry, unknown city, and invalid coordinate checks.
- Full audit workflow checks JavaScript syntax and runs the established browser and content audits.

## Limitations
- This audit covers the Weather page's request sequencing and stale display behavior. It does not prove live API uptime or inspect every external API integration for all race conditions.
- P0-02 live deployment verification remains on HOLD as requested.
