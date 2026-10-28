import assert from 'node:assert/strict';

process.env.API_AUDIT_NO_RUN = '1';
process.env.API_AUDIT_TIMEOUT_MS = '1000';
const { probe } = await import('./data-lab-api-health-audit.mjs');
const originalFetch = globalThis.fetch;

try {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response('rate limited', {
      status: 429,
      headers: { 'retry-after': '30' }
    });
  };
  const limited = await probe({ name: 'rate-limited provider', url: 'https://example.test/rate-limit', ok: () => true });
  assert.equal(calls, 1, 'HTTP 429 must not be retried');
  assert.equal(limited.ok, false, 'HTTP 429 should be reported as a provider failure');
  assert.match(limited.error, /HTTP 429/);
  assert.match(limited.error, /Retry-After 30/);

  calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return calls === 1
      ? new Response('{"temporary":"unavailable"}', { status: 503, headers: { 'content-type': 'application/json' } })
      : new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const transient = await probe({ name: 'transient provider', url: 'https://example.test/transient', ok: data => data.ok === true });
  assert.equal(calls, 2, 'A transient HTTP 503 should get only one bounded retry');
  assert.equal(transient.ok, true, 'A transient failure should recover after the bounded retry');

  console.log('PASS — API health audit does not retry HTTP 429, records Retry-After, and retries transient HTTP 503 only once.');
} finally {
  globalThis.fetch = originalFetch;
}
