import fs from 'node:fs';

const workflowPath = '.github/workflows/content-audit.yml';
const workflow = fs.readFileSync(workflowPath, 'utf8');

const browserTests = [
  'scripts/weather-race-condition-test.mjs',
  'scripts/weather-api-validation-test.mjs',
  'scripts/time-page-browser-test.mjs',
  'scripts/explore-search-browser-test.mjs',
  'scripts/explore-search-edge-cases-test.mjs',
  'scripts/interactive-controls-test.mjs',
  'scripts/service-worker-registration-test.mjs',
  'scripts/offline-cache-recovery-test.mjs',
  'scripts/site-smoke-test.mjs',
  'scripts/responsive-smoke-test.mjs'
];

const missing = browserTests.filter((path) => {
  const commandPresent = workflow.includes(`node ${path}`);
  const syntaxPresent = workflow.includes(`node --check ${path}`);
  return !commandPresent || !syntaxPresent;
});

if (missing.length) {
  console.error('Browser test integration is incomplete. Each test must be executed and syntax-checked in the workflow:');
  for (const path of missing) console.error(`- ${path}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: all ${browserTests.length} browser test scripts are syntax-checked and executed by the content-audit workflow.`);
}
