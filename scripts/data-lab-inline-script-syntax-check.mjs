#!/usr/bin/env node
/**
 * Parse every inline JavaScript block in data-lab.html.
 * Endpoint health checks alone cannot detect a syntax error that stops all API loaders.
 */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const file = "data-lab.html";
const html = readFileSync(file, "utf8");
const blocks = [...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script\\s*>/gi)]
  .filter((match) => !/\\bsrc\\s*=/i.test(match[1]))
  .map((match) => match[2])
  .filter((source) => source.trim());

if (blocks.length === 0) {
  console.error("FAIL: no inline JavaScript blocks found in data-lab.html");
  process.exit(1);
}

for (const [index, source] of blocks.entries()) {
  try {
    new vm.Script(source, { filename: `${file}:inline-script-${index + 1}` });
  } catch (error) {
    console.error(`FAIL: ${file} inline script ${index + 1} does not parse`);
    throw error;
  }
}

console.log(`PASS: ${blocks.length} inline JavaScript block(s) in ${file} parse successfully.`);
