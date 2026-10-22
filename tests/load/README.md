# Load testing (manual only)

This repository contains a k6 profile for staged load tests. It is **not run by CI** and has not been executed against production.

Before running:
1. Confirm you own/control the target and have permission to generate traffic.
2. Check the hosting provider's acceptable-use, rate and bandwidth limits. GitHub Pages is shared static hosting; a 10,000-VU test may be inappropriate there.
3. Prefer a staging mirror or a dedicated load-test host. Start at low concurrency and stop if errors, latency or bandwidth rise sharply.
4. Install k6, then run a low-load trial first:

```sh
k6 run --vus 10 --duration 30s -e BASE_URL=https://pkdiv6548.github.io/Everyday tests/load/k6-site.js
```

The committed staged profile ramps to 10,000 virtual users and is intentionally not a default command. Do not run that profile on production without explicit capacity planning and provider approval. k6 virtual users are not the same thing as 10,000 real simultaneous humans. Record p95 latency, error rate, requests/second, bandwidth, cache behaviour and Core Web Vitals separately.
