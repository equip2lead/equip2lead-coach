#!/usr/bin/env node
// Checks a numbered Marriage module end to end without touching the database:
// runs the real generator, the real ingest script and the real splitter over its
// output. Module 0 has its own script, because it also covers the byline and the
// greetings.
//
//   node scripts/test-marriage-module.mjs <N> [--out <payload.json>]
//
// --out keeps the validated payload, which is what gets loaded into lesson_modules.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const EXPECT = {
  1: {
    slug: 'marriage-was-gods-idea',
    title: "Marriage Was God's Idea",
    subtitle: 'Design, Covenant, and the Cord of Three Strands',
    duration: 100,
    sortOrder: 1,
    blocks: 144,
    scorecardKey: 'marriage_module1_covenant',
    video: {
      id: 'C9THu0PZwwk', section: 7, title: 'The Meaning of Marriage | Timothy Keller | Talks at Google',
      tip: "Optional: this is Tim Keller's full talk on his book The Meaning of Marriage, about an hour long. You can finish this module without it. Watch it when you have time, and listen for how he describes covenant: the promise that makes love stable instead of fragile.",
    },
    sections: [
      'Section 1 — It Began With Him',
      'Section 2 — Alone Is Not the Same as Lonely',
      'Section 3 — Taken From His Side',
      'Section 4 — What Is Marriage?',
      'Section 5 — Leave, Cleave, One Flesh, Unashamed',
      'Section 6 — Covenant, Not Contract',
      'Section 7 — The Third Strand',
      'Section 8 — When Are You Actually Married?',
      'Section 9 — A Living Picture',
      'Your Covenant Check',
      'Module 1 Assignment — Write Your Covenant',
      'Module 1 Complete',
    ],
    privacy: "Write honestly: your partner can't see this, and a mentor reads it only if you choose to share it.",
    keep: [],
  },
  2: {
    slug: 'know-yourself-heal-yourself',
    title: 'Know Yourself, Heal Yourself',
    subtitle: 'Motives, Marriageability, and the Path of Healing',
    duration: 110,
    sortOrder: 2,
    blocks: 125,
    scorecardKey: 'marriage_module2_carrying',
    video: { id: '95ovIJ3dsNk', section: 4, title: 'How childhood trauma affects health across a lifetime | Nadine Burke Harris | TED' },
    sections: [
      'Section 1 — Why Do You Want to Marry?',
      'Section 2 — Become the List You Are Looking For',
      'Section 3 — What You Carry, You Bring',
      'Section 4 — The Wound Is the Interpretation',
      'Section 5 — The Faces of an Unhealed Heart',
      'Section 6 — The Path of Healing',
      'Section 7 — Telling the Truth',
      'Section 8 — A Word to Each Carrier',
      'What Am I Carrying?',
      'Module 2 Assignment — Name It, Release It, Tell It',
      'Module 2 Complete',
    ],
    privacy: 'Your partner cannot see this assignment. Write honestly.',
    keep: [
      'A word of care before you begin.',
      'Nothing in this track asks you to stay within reach of harm.',
      'That counts as completing it.',
    ],
  },
};

const N = Number(process.argv[2]);
const want = EXPECT[N];
if (!want) { console.error('usage: test-marriage-module.mjs <1|2> [--out <file>]'); process.exit(2); }

const repo = process.cwd();
const dir = mkdtempSync(join(tmpdir(), `marriage-m${N}-`));

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${extra}`); }
};

/* ── generator -> ingest ──────────────────────────────────────────────────── */
execFileSync('node', [resolve(repo, `scripts/content/marriage/generate_module${N}.js`)], { cwd: dir, stdio: 'ignore' });
const gen = JSON.parse(readFileSync(join(dir, `module${N}_marriage.json`), 'utf8'));

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
ok(`module_number ${N}`, payload.module_number === N);
ok('slug', payload.slug === want.slug, payload.slug);
ok('title', payload.title_en === want.title);
ok('subtitle', payload.subtitle_en === want.subtitle);
ok('pillar', payload.pillar_slug === 'personal-foundation' && gen.pillar_id === '00000000-0000-0000-0002-000000000011');
ok('not a starting point', payload.is_starting_point === false);
ok('difficulty', payload.difficulty === 'beginner');
ok('duration', payload.estimated_duration_minutes === want.duration);
ok('sort_order', payload.sort_order === want.sortOrder);

console.log('\nBlocks');
ok(`${want.blocks} blocks`, blocks.length === want.blocks, String(blocks.length));
const expectedId = (i, t) => 'b_' + createHash('sha256').update(`${payload.slug}|${i}|${t}`).digest('hex').slice(0, 12);
ok('every id is sha256(slug|index|type)', blocks.every((b, i) => b.id === expectedId(i, b.type)));
ok('ids are unique', new Set(blocks.map((b) => b.id)).size === blocks.length);
const count = (t) => blocks.filter((b) => b.type === t).length;
ok('1 scorecard, keyed', count('scorecard') === 1 && blocks.find((b) => b.type === 'scorecard').scorecard_key === want.scorecardKey);
ok('1 assignment, key a1', count('assignment_prompt') === 1 && blocks.find((b) => b.type === 'assignment_prompt').assignment_key === 'a1');
ok('1 quiz', count('quiz') === 1);
const video = blocks.find((b) => b.type === 'video_embed');
ok('1 video, the verified one', count('video_embed') === 1 && video.youtubeId === want.video.id && video.title === want.video.title);
if (want.video.tip) {
  const next = blocks[blocks.indexOf(video) + 1];
  ok('tip callout directly after the video', next.type === 'callout' && next.variant === 'tip' && next.text === want.video.tip);
}
ok('no real image blocks yet', count('image') === 0);
ok('no verification note left in the content', !JSON.stringify(blocks).includes('EXTERNAL VIDEO') && !JSON.stringify(blocks).includes('Claude Code'));
const quiz = blocks.find((b) => b.type === 'quiz');
ok('every quiz answer is a real option', quiz.questions.every((q) => q.options.some((o) => o.id === q.correct_option_id)));

console.log('\nPlaceholders stay visible');
const callouts = blocks.filter((b) => b.type === 'callout').map((b) => b.text);
const imgs = callouts.filter((t) => t.startsWith('[IMAGE PLACEHOLDER'));
ok(`4 image placeholders, MM${N}-1 to MM${N}-4`, imgs.length === 4 && [1, 2, 3, 4].every((n) => imgs.some((t) => t.startsWith(`[IMAGE PLACEHOLDER — MM${N}-${n}]`))));
ok('3 video placeholders', callouts.filter((t) => t.startsWith('[VIDEO PLACEHOLDER')).length === 3);

/* ── the real splitter ────────────────────────────────────────────────────── */
const src = readFileSync('lib/lessons/split-sections.ts', 'utf8').replace(/^import type .*$/m, '');
const shim = join(dir, 'split-sections.ts');
writeFileSync(shim, `type LessonBlock = any; type UnknownBlock = any;\n${src}`);
execFileSync('npx', ['tsc', shim, '--outDir', dir, '--target', 'es2020', '--module', 'es2020', '--skipLibCheck'], { stdio: 'inherit' });
writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
const { splitBlocksBySection } = await import(pathToFileURL(join(dir, 'split-sections.js')).href);
const { frontMatter, sections } = splitBlocksBySection(blocks);

console.log('\nReal splitter');
ok(`${want.sections.length} sections`, sections.length === want.sections.length, String(sections.length));
ok('title is in front matter, at level 2', frontMatter[0].text === want.title && frontMatter[0].level === 2);
want.sections.forEach((t, i) => ok(`section ${i + 1}: ${t}`, sections[i]?.title === t, sections[i]?.title));
ok('every block accounted for', frontMatter.length + sections.reduce((n, s) => n + s.blocks.length, 0) === blocks.length);
ok(`video in section ${want.video.section}`, sections[want.video.section - 1].blocks.some((b) => b.type === 'video_embed'));
const scoreSection = want.sections.length - 3;
ok('scorecard section', sections[scoreSection].hasScorecard);
ok('assignment section', sections[scoreSection + 1].hasAssignment);
ok('quiz present', sections.some((s) => s.blocks.some((b) => b.type === 'quiz')));

console.log('\nPrivacy and care wording');
const allText = JSON.stringify(blocks);
ok('no absolute privacy claim', !/nobody sees|read only by you|only you can|assignment is private/i.test(allText));
ok('assignment wording', blocks.find((b) => b.type === 'assignment_prompt').instructions.includes(want.privacy));
want.keep.forEach((t) => ok(`kept: "${t}"`, allText.includes(t)));
ok('byline credits both authors', frontMatter[1].text.includes('By Dr. Denis & Arit Ekobena'));

const outIdx = process.argv.indexOf('--out');
if (outIdx !== -1) copyFileSync(payloadPath, process.argv[outIdx + 1]);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
