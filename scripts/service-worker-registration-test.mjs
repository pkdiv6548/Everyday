import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const failures = [];
try {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => failures.push(error.message));

  for (const route of ['/', '/articles/why-sky-blue.html']) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    assert.ok(await page.title(), `Page remains usable: missing title at ${route}`);
    await page.waitForFunction(() => 'serviceWorker' in navigator, { timeout: 5000 });
    await page.waitForFunction(async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.some(reg => reg.active && new URL(reg.active.scriptURL).pathname.endsWith('/sw.js'));
    }, { timeout: 15000 }).catch(() => {});
    const info = await page.evaluate(async () => ({
      supported: 'serviceWorker' in navigator,
      registrations: (await navigator.serviceWorker.getRegistrations()).map(reg => ({
        scope: reg.scope,
        activeScript: reg.active?.scriptURL || null,
        installingScript: reg.installing?.scriptURL || null,
        waitingScript: reg.waiting?.scriptURL || null
      }))
    }));
    assert.equal(info.supported, true, 'Service Worker API should be available in secure/local test context');
    const swRegs = info.registrations.filter(reg => [reg.activeScript, reg.installingScript, reg.waitingScript].some(url => url && new URL(url).pathname.endsWith('/sw.js')));
    assert.ok(swRegs.length >= 1, `Expected sw.js registration from ${route}; got ${JSON.stringify(info.registrations)}`);
    for (const reg of swRegs) {
      assert.equal(new URL(reg.scope).origin, new URL(base).origin, 'Service Worker scope must remain same-origin');
      assert.ok(new URL(reg.scope).pathname.endsWith('/'), 'Service Worker scope should be a directory scope');
    }
  }

  const regs = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations())
    .filter(reg => [reg.active?.scriptURL, reg.installing?.scriptURL, reg.waiting?.scriptURL]
      .some(url => url && new URL(url).pathname.endsWith('/sw.js'))).length);
  assert.equal(regs, 1, 'Navigating between root and article pages should not create duplicate registrations');
  assert.deepEqual(failures, [], `Unexpected page runtime errors: ${JSON.stringify(failures)}`);
  await context.close();

  // Registration failure must not prevent the page's ordinary UI from rendering.
  const blockedContext = await browser.newContext({ serviceWorkers: 'block' });
  const blockedPage = await blockedContext.newPage();
  const blockedErrors = [];
  blockedPage.on('pageerror', error => blockedErrors.push(error.message));
  await blockedPage.goto(base + '/', { waitUntil: 'domcontentloaded' });
  assert.ok(await blockedPage.title(), 'Page should still render if Service Worker registration is unavailable');
  assert.ok(await blockedPage.locator('body').isVisible(), 'Body should remain visible if Service Worker registration is unavailable');
  assert.deepEqual(blockedErrors, [], `Page runtime errors when Service Workers are blocked: ${JSON.stringify(blockedErrors)}`);
  await blockedContext.close();

  console.log('PASS — service-worker registration: root/article paths, same-origin directory scope, single registration, and graceful page rendering when service workers are blocked.');
} finally {
  await browser.close();
}
