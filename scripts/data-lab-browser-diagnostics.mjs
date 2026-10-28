#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const pageErrors = [];
const failedRequests = [];
const badResponses = [];
const apiRequests = [];
const page = await browser.newPage({ serviceWorkers: 'block' });

page.on('pageerror', error => pageErrors.push(error.stack || error.message));
page.on('request', request => {
  const url = request.url();
  if (/^https:\/\//i.test(url) && ['fetch', 'xhr'].includes(request.resourceType())) {
    apiRequests.push({ url, method: request.method() });
  }
});
page.on('requestfailed', request => {
  if (/^https:\/\//i.test(request.url()) && ['fetch', 'xhr'].includes(request.resourceType())) {
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown failure' });
  }
});
page.on('response', response => {
  const request = response.request();
  if (/^https:\/\//i.test(response.url()) && ['fetch', 'xhr'].includes(request.resourceType()) && response.status() >= 400) {
    badResponses.push({ url: response.url(), status: response.status() });
  }
});

try {
  await page.goto('http://127.0.0.1:4173/data-lab.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(18000);
  const panelStatuses = await page.locator('.lab-status').evaluateAll(nodes =>
    nodes.map(node => ({ id: node.id, text: (node.textContent || '').trim(), className: node.className }))
  );
  const panelContent = await page.evaluate(() => Object.fromEntries([
    ['food-status', '#food-results'],
    ['gut-status', '#gut-results'],
    ['nasaimages-status', '#nasaimages-results'],
    ['art-status', '#art-results']
  ].map(([statusId, selector]) => {
    const box = document.querySelector(selector);
    return [statusId, {
      resultCount: box?.querySelectorAll('.api-list-result, .api-image-card, .lab-row, [data-api-image]').length || (box?.querySelectorAll('img').length || 0),
      text: (box?.innerText || '').trim().slice(0, 180)
    }];
  })));
  console.log('DATA_LAB_BROWSER_DIAGNOSTIC ' + JSON.stringify({
    apiRequestCount: apiRequests.length,
    apiRequests,
    pageErrors,
    failedRequests,
    badResponses,
    panelStatuses,
    panelContent
  }, null, 2));

  assert.equal(pageErrors.length, 0, 'Uncaught browser JavaScript error(s) stopped or disrupted Data Lab initialization.');
  assert.ok(apiRequests.length >= 10, `Expected at least 10 initial API requests, saw ${apiRequests.length}; Data Lab may have stopped before starting its loaders.`);

  const requiredPanels = ['food-status', 'gut-status', 'nasaimages-status', 'art-status'];
  for (const id of requiredPanels) {
    const panel = panelStatuses.find(item => item.id === id);
    assert.ok(panel, `Required API panel status element is missing: ${id}`);
    assert.ok(panel.className.includes('lab-status ok'), `Required API panel did not reach a successful state: ${id} (${panel.text})`);
    assert.ok(panelContent[id]?.resultCount > 0, `Required API panel has no rendered result cards: ${id}`);
  }
  console.log('PASS — Data Lab initialized and required fallback panels rendered real result cards in Chromium.');
} finally {
  await browser.close();
}
