#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'acorn';
import { chromium } from 'playwright';

const html = await readFile('data-lab.html', 'utf8');
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => !/\bsrc\s*=/.test(match[1]));
for (const [index, match] of inlineScripts.entries()) {
  try {
    parse(match[2], { ecmaVersion: 'latest', sourceType: 'script', locations: true });
  } catch (error) {
    console.error(`INLINE_SCRIPT_SYNTAX_ERROR script=${index + 1} line=${error.loc?.line} column=${error.loc?.column}: ${error.message}`);
    throw error;
  }
}

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
  console.log('DATA_LAB_BROWSER_DIAGNOSTIC ' + JSON.stringify({
    apiRequestCount: apiRequests.length,
    apiRequests,
    pageErrors,
    failedRequests,
    badResponses,
    panelStatuses
  }, null, 2));

  assert.equal(pageErrors.length, 0, 'Uncaught browser JavaScript error(s) stopped or disrupted Data Lab initialization.');
  assert.ok(apiRequests.length >= 10, `Expected at least 10 initial API requests, saw ${apiRequests.length}; Data Lab may have stopped before starting its loaders.`);
  console.log('PASS — Data Lab initialized in Chromium; inspect request failures and panel statuses above for provider/network errors.');
} finally {
  await browser.close();
}
