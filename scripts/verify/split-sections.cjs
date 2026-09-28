#!/usr/bin/env node
// Run the production splitter (lib/lessons/split-sections.ts) over a payload
// and print what it produces. Used to confirm a module's section count and
// titles before and after an ingest, rather than trusting a generator's own
// simulated splitter.
//
//   node scripts/verify/split-sections.cjs <payload.json>
//
// Accepts either the shape ingest-module.mjs writes ({ body_blocks: [...] })
// or a bare array of blocks.

const { readFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const Module = require('node:module');
const { resolve, join } = require('node:path');

const repoRoot = resolve(__dirname, '..', '..');
const req = createRequire(join(repoRoot, 'package.json'));
const { transform } = req('sucrase');

const tsPath = join(repoRoot, 'lib', 'lessons', 'split-sections.ts');
const { code } = transform(readFileSync(tsPath, 'utf8'), {
  transforms: ['typescript', 'imports'],
});
const m = new Module('split-sections');
m._compile(code, tsPath.replace(/\.ts$/, '.js'));
const { splitBlocksBySection } = m.exports;

const input = process.argv[2];
if (!input) {
  console.error('usage: node scripts/verify/split-sections.cjs <payload.json>');
  process.exit(1);
}
const parsed = JSON.parse(readFileSync(input, 'utf8'));
const blocks = Array.isArray(parsed) ? parsed : parsed.body_blocks;
if (!Array.isArray(blocks)) {
  console.error('ABORT: no body_blocks array in ' + input);
  process.exit(1);
}

const r = splitBlocksBySection(blocks);
console.log('frontMatter blocks:', r.frontMatter.length);
console.log('sections:', r.sections.length);
r.sections.forEach((s, i) =>
  console.log(
    `  ${i + 1}. "${s.title}" — ${s.blocks.length} blocks, reading ~${s.readingMinutes} min, ` +
      `scorecard=${s.hasScorecard}, assignment=${s.hasAssignment}`
  )
);
console.log('total in sections:', r.sections.reduce((a, s) => a + s.blocks.length, 0));
