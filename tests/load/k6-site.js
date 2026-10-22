import http from 'k6/http';
import { check, sleep } from 'k6';

// Run only against a site you own/control and only after checking the host's
// acceptable-use limits. Do not start the 10k profile against production by default.
const base = (__ENV.BASE_URL || 'https://pkdiv6548.github.io/Everyday').replace(/\/$/, '');
export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '2m', target: 2500 },
    { duration: '2m', target: 5000 },
    { duration: '2m', target: 10000 },
    { duration: '2m', target: 10000 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500'],
  },
  discardResponseBodies: true,
};
const pages = ['/', '/explore.html', '/categories.html', '/future.html', '/story.html?slug=moon-phases-explained'];
export default function () {
  const path = pages[Math.floor(Math.random() * pages.length)];
  const res = http.get(base + path, { tags: { page: path.split('?')[0] } });
  check(res, { 'HTTP status is 2xx/3xx': r => r.status >= 200 && r.status < 400 });
  sleep(1);
}
