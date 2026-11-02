#!/usr/bin/env node
// Checks Marriage Module 0 end to end without touching the database: runs the
// real generator, the real ingest script and the real splitter over its output.
//
//   node scripts/test-marriage-module0.mjs [--out <payload.json>]
//
// --out keeps the validated payload, which is what gets loaded into lesson_modules.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.cwd();
const dir = mkdtempSync(join(tmpdir(), 'marriage-m0-'));

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${extra}`); }
};

/* ── generator -> ingest ──────────────────────────────────────────────────── */
execFileSync('node', [resolve(repo, 'scripts/content/marriage/generate_module0.js')], { cwd: dir, stdio: 'ignore' });
const gen = JSON.parse(readFileSync(join(dir, 'module0_marriage.json'), 'utf8'));

// Same adapter step as earlier sectioned modules: concatenate the sections and
// wrap them in new_row_data. The ingest script does all the validating.
const envelope = {
  new_row_data: {
    title: gen.title, slug: gen.slug, subtitle: gen.subtitle, module_number: gen.module_number,
    track: gen.track_slug, pillar: gen.pillar, difficulty: gen.difficulty,
    estimated_duration_minutes: gen.estimated_duration_minutes,
    is_starting_point: gen.is_starting_point, sort_order: gen.sort_order,
  },
  language: 'en',
  blocks: gen.sections.flatMap((s) => s.blocks),
};
writeFileSync(join(dir, 'envelope.json'), JSON.stringify(envelope));
const payloadPath = join(dir, 'payload.json');
execFileSync('node', [resolve(repo, 'scripts/ingest-module.mjs'), join(dir, 'envelope.json'), '--out', payloadPath], { stdio: 'ignore' });
const payload = JSON.parse(readFileSync(payloadPath, 'utf8'));
const blocks = payload.body_blocks;

console.log('\nRow');
ok('track', payload.track_slug === 'marriage');
ok('module_number 0', payload.module_number === 0);
ok('slug', payload.slug === 'marriage-starting-point-clarity-before-covenant');
ok('title', payload.title_en === 'Starting Point — Clarity Before Covenant');
ok('subtitle', payload.subtitle_en === 'Before You Begin: The Seasons, the Doors, and the Work Ahead');
ok('pillar', payload.pillar_slug === 'personal-foundation' && gen.pillar_id === '00000000-0000-0000-0002-000000000011');
ok('is_starting_point', payload.is_starting_point === true);
ok('difficulty', payload.difficulty === 'beginner');
ok('duration', payload.estimated_duration_minutes === 65);
ok('sort_order', payload.sort_order === 0);

console.log('\nBlocks');
ok('151 blocks', blocks.length === 151, String(blocks.length));
const expectedId = (i, t) => 'b_' + createHash('sha256').update(`${payload.slug}|${i}|${t}`).digest('hex').slice(0, 12);
ok('every id is sha256(slug|index|type)', blocks.every((b, i) => b.id === expectedId(i, b.type)));
ok('ids are unique', new Set(blocks.map((b) => b.id)).size === 151);
const count = (t) => blocks.filter((b) => b.type === t).length;
ok('1 scorecard, keyed', count('scorecard') === 1 && blocks.find((b) => b.type === 'scorecard').scorecard_key === 'marriage_module0_eight_doors');
ok('1 assignment, key a1', count('assignment_prompt') === 1 && blocks.find((b) => b.type === 'assignment_prompt').assignment_key === 'a1');
ok('1 quiz', count('quiz') === 1);
ok('1 video', count('video_embed') === 1 && blocks.find((b) => b.type === 'video_embed').youtubeId === '8KkKuTCFvzI');
ok('no real image blocks yet', count('image') === 0);

console.log('\nPlaceholders stay visible');
const callouts = blocks.filter((b) => b.type === 'callout').map((b) => b.text);
const imgs = callouts.filter((t) => t.startsWith('[IMAGE PLACEHOLDER'));
ok('6 image placeholders, MM0-1 to MM0-6', imgs.length === 6 && [1, 2, 3, 4, 5, 6].every((n) => imgs.some((t) => t.startsWith(`[IMAGE PLACEHOLDER — MM0-${n}]`))));
ok('4 video placeholders', callouts.filter((t) => t.startsWith('[VIDEO PLACEHOLDER')).length === 4);

/* ── the real splitter ────────────────────────────────────────────────────── */
const src = readFileSync('lib/lessons/split-sections.ts', 'utf8').replace(/^import type .*$/m, '');
const shim = join(dir, 'split-sections.ts');
writeFileSync(shim, `type LessonBlock = any; type UnknownBlock = any;\n${src}`);
execFileSync('npx', ['tsc', shim, '--outDir', dir, '--target', 'es2020', '--module', 'es2020', '--skipLibCheck'], { stdio: 'inherit' });
writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
const { splitBlocksBySection } = await import(pathToFileURL(join(dir, 'split-sections.js')).href);
const { frontMatter, sections } = splitBlocksBySection(blocks);

console.log('\nReal splitter');
ok('10 sections', sections.length === 10, String(sections.length));
ok('title and intro are front matter', frontMatter.length === 8 && frontMatter[0].text === 'Clarity Before Covenant');
const titles = [
  'Section 1 — The Question Beneath Every Struggling Marriage',
  'Section 2 — Foundations Nobody Photographs',
  'Section 3 — Four Seasons, in Order',
  'Section 4 — The Eight Doors',
  'Section 5 — How This Journey Works',
  'Section 6 — What This Will Cost You',
  'Your Eight Doors Today',
  'A Final Word Before You Begin',
  'Your First Assignment — Set Your Intention',
  'Starting Point Complete',
];
titles.forEach((t, i) => ok(`section ${i + 1}: ${t}`, sections[i]?.title === t, sections[i]?.title));
ok('every block accounted for', frontMatter.length + sections.reduce((n, s) => n + s.blocks.length, 0) === 151);
const has = (i, t) => sections[i].blocks.some((b) => b.type === t);
ok('video in section 6', has(5, 'video_embed'));
ok('scorecard in section 7', has(6, 'scorecard') && sections[6].hasScorecard);
ok('assignment in section 9', has(8, 'assignment_prompt') && sections[8].hasAssignment);
ok('quiz present', sections.some((s) => s.blocks.some((b) => b.type === 'quiz')));

const outIdx = process.argv.indexOf('--out');
if (outIdx !== -1) copyFileSync(payloadPath, process.argv[outIdx + 1]);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
