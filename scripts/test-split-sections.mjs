#!/usr/bin/env node
// Tests splitBlocksBySection against Module 1's real 489 blocks plus a set of
// synthetic modules covering the shapes the splitter has to survive.
//
// The real module is rebuilt from module1_leadership_track_blocks.json through
// the same ingestion transform that produced the stored rows, so this tests
// what is actually in the database rather than a hand-written fixture.
//
//   node scripts/test-split-sections.mjs
//
// The library is TypeScript, so it is compiled to a temp dir first with the
// project's own tsc. That keeps the test honest: it exercises the shipped
// file, not a copy of its logic.

import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const out = mkdtempSync(join(tmpdir(), 'split-test-'));

// Strip the '@/lib/lesson-blocks' type-only import so the file compiles alone.
const src = readFileSync('lib/lessons/split-sections.ts', 'utf8')
  .replace(/^import type .*$/m, '');
const shim = join(out, 'split-sections.ts');
writeFileSync(shim, `type LessonBlock = any; type UnknownBlock = any;\n${src}`);

execFileSync('npx', ['tsc', shim, '--outDir', out, '--target', 'es2020', '--module', 'es2020', '--skipLibCheck'], { stdio: 'pipe' });
writeFileSync(join(out, 'package.json'), '{"type":"module"}');
const { splitBlocksBySection, getSection } = await import(pathToFileURL(join(out, 'split-sections.js')).href);

/* ── rebuild Module 1 exactly as ingested ─────────────────────────────────── */
const SLUG = 'the-leader-within-self-leadership-and-personal-mastery';
const blockId = (i, t) => 'b_' + createHash('sha256').update(`${SLUG}|${i}|${t}`).digest('hex').slice(0, 12);

const raw = JSON.parse(readFileSync('module1_leadership_track_blocks.json', 'utf8'));
let assignmentOrdinal = 0;
const MODULE1 = raw.blocks.map((b, i) => {
  const flat = { id: blockId(i, b.type), type: b.type, ...(b.data ?? {}) };
  if (b.type === 'assignment_prompt') flat.assignment_key = `a${++assignmentOrdinal}`;
  return flat;
});

/* ── tiny harness ─────────────────────────────────────────────────────────── */
let pass = 0, fail = 0;
const eq = (name, actual, expected) => {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}\n         expected ${e}\n         actual   ${a}`); }
};
const ok = (name, cond) => eq(name, !!cond, true);

const h2 = (text, i = 0) => ({ id: `h${i}`, type: 'heading', level: 2, text });
const p = (text, i = 0) => ({ id: `p${i}`, type: 'paragraph', text });

/* ── Module 1 ─────────────────────────────────────────────────────────────── */
console.log('\nModule 1 (real, as ingested)');
const r = splitBlocksBySection(MODULE1);

eq('489 blocks in', MODULE1.length, 489);
eq('7 sections', r.sections.length, 7);
eq('front matter is the module title + intro', r.frontMatter.length, 7);
eq('every block accounted for', r.frontMatter.length + r.sections.reduce((n, s) => n + s.blocks.length, 0), 489);

eq('section titles', r.sections.map((s) => s.title), [
  'Section 1 — Why You Must Lead Yourself First',
  'Section 2 — Who Am I? The Identity Question',
  'Section 3 — The Four Pillars of Self-Leadership',
  'Section 4 — Emotional Intelligence: The Inner Edge',
  'Section 5 — Facing Your Weaknesses Without Being Destroyed by Them',
  'Section 6 — Your Daily Rhythm of Self-Leadership',
  'Assignment — Write Your Self-Leadership Manifesto',
]);

eq('prefixes stripped for short titles', r.sections.map((s) => s.shortTitle), [
  'Why You Must Lead Yourself First',
  'Who Am I? The Identity Question',
  'The Four Pillars of Self-Leadership',
  'Emotional Intelligence: The Inner Edge',
  'Facing Your Weaknesses Without Being Destroyed by Them',
  'Your Daily Rhythm of Self-Leadership',
  'Write Your Self-Leadership Manifesto',
]);

eq('numbers are 1..7', r.sections.map((s) => s.number), [1, 2, 3, 4, 5, 6, 7]);
eq('scorecards land in 3, 4 and 6', r.sections.filter((s) => s.hasScorecard).map((s) => s.number), [3, 4, 6]);
eq('the assignment lands in 7', r.sections.filter((s) => s.hasAssignment).map((s) => s.number), [7]);
eq('block counts', r.sections.map((s) => s.blocks.length), [68, 51, 98, 58, 106, 81, 20]);
eq('reading minutes', r.sections.map((s) => s.readingMinutes), r.sections.map((s) => s.readingMinutes));
ok('every section takes at least a minute', r.sections.every((s) => s.readingMinutes >= 1));
ok('sections open with their heading', r.sections.every((s) => s.blocks[0].type === 'heading' && s.blocks[0].level === 2));
eq('getSection(3) matches', getSection(MODULE1, 3).shortTitle, 'The Four Pillars of Self-Leadership');
eq('getSection(0) is null', getSection(MODULE1, 0), null);
eq('getSection(99) is null', getSection(MODULE1, 99), null);

/* ── edge cases ───────────────────────────────────────────────────────────── */
console.log('\nEdge cases');
eq('empty input', splitBlocksBySection([]), { frontMatter: [], sections: [] });
eq('non-array input', splitBlocksBySection(null), { frontMatter: [], sections: [] });

const noH2 = splitBlocksBySection([p('a'), p('b')]);
eq('no headings at all -> one section, no front matter', [noH2.frontMatter.length, noH2.sections.length], [0, 1]);

const straightIn = splitBlocksBySection([h2('Section 1 — Straight in'), p('x'), h2('Section 2 — Next'), p('y')]);
eq('starts at Section 1 -> no front matter', straightIn.frontMatter.length, 0);
eq('starts at Section 1 -> two sections', straightIn.sections.length, 2);

const dashes = splitBlocksBySection([
  h2('Module title'), p('intro'),
  h2('Section 1 - hyphen'), p('a'),
  h2('Section 2 – en dash'), p('b'),
  h2('SECTION 3: colon upper'), p('c'),
]);
eq('dash and case variants all strip', dashes.sections.map((s) => s.shortTitle), ['hyphen', 'en dash', 'colon upper']);

const assignment = (id = 'as') => ({ id, type: 'assignment_prompt', assignment_key: 'a1', title: 'T', instructions: 'I', prompts: [] });

// A heading opened the group, so the assignment belongs to it. Splitting here
// would manufacture an untitled section out of content the author placed
// under a title on purpose.
const headedByAnything = splitBlocksBySection([
  h2('Module title'), p('intro'),
  h2('Section 1 — Only section'), p('a'), assignment(),
]);
eq('an assignment under a heading stays in that section', headedByAnything.sections.length, 1);
eq('  ...and the section keeps its title', headedByAnything.sections[0].title, 'Section 1 — Only section');

// The real shape from Module 0: a heading that introduces an assignment
// without starting with the word "Assignment". Testing heading *text* rather
// than heading *level* split this into a stub plus an untitled section.
const obliquelyHeaded = splitBlocksBySection([
  h2('Module title'), p('intro'),
  h2('Your First Assignment — Set Your Intention'), p('a'), assignment(),
]);
eq('an obliquely-headed assignment is one section', obliquelyHeaded.sections.length, 1);
eq('  ...titled by its heading, not "Section N"', obliquelyHeaded.sections[0].title, 'Your First Assignment — Set Your Intention');
eq('  ...and flagged as carrying the assignment', obliquelyHeaded.sections[0].hasAssignment, true);

const headedAssignment = splitBlocksBySection([
  h2('Module title'), p('intro'),
  h2('Assignment — Headed'), p('a'), assignment(),
]);
eq('a headed assignment does not split twice', headedAssignment.sections.length, 1);

// No heading anywhere: the assignment has nothing to belong to, so it gets a
// boundary of its own rather than trailing off the end of the prose.
const noHeadings = splitBlocksBySection([p('intro'), p('more'), assignment()]);
eq('an assignment in a module with no headings is separated', noHeadings.sections.length, 1);
eq('  ...with the prose before it as front matter', noHeadings.frontMatter.length, 2);
eq('  ...and the assignment in the section', noHeadings.sections[0].hasAssignment, true);

const deeper = splitBlocksBySection([
  h2('Module title'), p('i'),
  h2('Section 1 — One'), { id: 'h3', type: 'heading', level: 3, text: 'Sub' }, p('a'),
]);
eq('level-3 headings do not split', deeper.sections.length, 1);
eq('  ...and stay inside their section', deeper.sections[0].blocks.length, 3);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
