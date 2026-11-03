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
ok('154 blocks', blocks.length === 154, String(blocks.length));
const expectedId = (i, t) => 'b_' + createHash('sha256').update(`${payload.slug}|${i}|${t}`).digest('hex').slice(0, 12);
ok('every id is sha256(slug|index|type)', blocks.every((b, i) => b.id === expectedId(i, b.type)));
ok('ids are unique', new Set(blocks.map((b) => b.id)).size === 154);
const count = (t) => blocks.filter((b) => b.type === t).length;
ok('1 scorecard, keyed', count('scorecard') === 1 && blocks.find((b) => b.type === 'scorecard').scorecard_key === 'marriage_module0_eight_doors');
ok('1 assignment, key a1', count('assignment_prompt') === 1 && blocks.find((b) => b.type === 'assignment_prompt').assignment_key === 'a1');
ok('1 quiz', count('quiz') === 1);
const videos = blocks.filter((b) => b.type === 'video_embed');
ok('2 videos, Meg Jay then Waldinger', videos.length === 2 && videos[0].youtubeId === 'vhhgI4tSMwc' && videos[1].youtubeId === '8KkKuTCFvzI');
ok('Meg Jay title as given', videos[0].title === 'Why 30 is not the new 20 | Meg Jay | TED');
const jay = blocks.indexOf(videos[0]);
ok('Meg Jay block order', blocks[jay - 2].type === 'callout' && blocks[jay - 2].text.startsWith('Lack of preparation is the reason') && blocks[jay - 1].type === 'paragraph' && blocks[jay - 1].text.startsWith('The psychologist Meg Jay') && blocks[jay + 1].variant === 'tip' && blocks[jay + 1].text.startsWith('About 15 minutes.') && blocks[jay + 2].text === 'A Throw-Away Age');
const images = blocks.filter((b) => b.type === 'image');
ok('6 real images, in order, at their paths', images.length === 6 && images.every((b, i) => b.url === `/images/marriage/module-0/MM0-${i + 1}.png`));
ok('every image has alt text', images.every((b) => b.alt && b.alt.length > 40));
ok('every image file exists and is a PNG', images.every((b) => readFileSync(`public${b.url}`).subarray(1, 4).toString() === 'PNG'));

console.log('\nPlaceholders stay visible');
const callouts = blocks.filter((b) => b.type === 'callout').map((b) => b.text);
const imgs = callouts.filter((t) => t.startsWith('[IMAGE PLACEHOLDER'));
ok('no image placeholders left', imgs.length === 0);
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
ok('every block accounted for', frontMatter.length + sections.reduce((n, s) => n + s.blocks.length, 0) === 154);
const has = (i, t) => sections[i].blocks.some((b) => b.type === t);
ok('Meg Jay in section 1', sections[0].blocks.some((b) => b.youtubeId === 'vhhgI4tSMwc'));
ok('Waldinger still in section 6', sections[5].blocks.some((b) => b.youtubeId === '8KkKuTCFvzI'));
ok('scorecard in section 7', has(6, 'scorecard') && sections[6].hasScorecard);
ok('assignment in section 9', has(8, 'assignment_prompt') && sections[8].hasAssignment);
ok('quiz present', sections.some((s) => s.blocks.some((b) => b.type === 'quiz')));

console.log('\nPrivacy wording');
const allText = JSON.stringify(blocks);
ok('no "nobody sees" or "read only by you"', !/nobody sees|read only by you|only you can/i.test(allText));
ok('scorecard intro says the partner can\'t see it', allText.includes('be honest: your partner can\'t see this.'));
ok('assignment says the partner can\'t see it', allText.includes('Write honestly: your partner can\'t see this, and a mentor reads it only if you choose to share it.'));

console.log('\nByline and greeting');
const compile = (file, strip) => {
  const shimPath = join(dir, file.split('/').pop());
  writeFileSync(shimPath, strip(readFileSync(file, 'utf8')));
  execFileSync('npx', ['tsc', shimPath, '--outDir', dir, '--target', 'es2020', '--module', 'es2020', '--skipLibCheck'], { stdio: 'inherit' });
  return import(pathToFileURL(shimPath.replace(/\.ts$/, '.js')).href);
};
const { moduleAuthor } = await compile('lib/lessons/byline.ts', (s) => s);
ok('this module credits both authors', moduleAuthor(frontMatter) === 'Dr. Denis & Arit Ekobena', moduleAuthor(frontMatter));
const para = (text) => [{ type: 'paragraph', text }];
ok('Leadership Module 0 form', moduleAuthor(para('By Dr. Denis Ekobena · Equip2Lead Coach')) === 'Dr. Denis Ekobena');
ok('Leadership Module 1-12 form', moduleAuthor(para('Module 1 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach')) === 'Dr. Denis Ekobena');
ok('no byline falls back', moduleAuthor(para('Stand by me')) === 'Dr. Denis Ekobena');
ok('"by" inside a sentence is not a byline', moduleAuthor(para('Written with care. By the end you will know.')) === 'Dr. Denis Ekobena');

const { greetingFor } = await compile('lib/dashboard/greetings.ts', (s) => s.replace(/^import type .*$/m, 'type NextStepMode = any;'));
const days = Array.from({ length: 6 }, (_, i) => new Date(Date.UTC(2026, 0, i + 1)));
const oriented = (lang, track) => days.flatMap((d) => greetingFor('oriented', lang, 'assessment', d, track).lines);
ok('Marriage greeting, English', oriented('en', 'marriage').includes('You know why you came. That is more than most couples can say on their wedding day.'));
ok('Marriage greeting no longer says leaders', !oriented('en', 'marriage').concat(oriented('fr', 'marriage')).some((l) => /most leaders|plupart des leaders/.test(l)));
ok('Leadership greeting unchanged', oriented('en', 'leadership').includes('You know why you came. That is more than most leaders can say.'));
ok('Other tracks unchanged', oriented('en', 'ministry').includes('You know why you came. That is more than most leaders can say.'));
ok('Marriage greeting, French, plural', oriented('fr', 'marriage').includes('Vous savez pourquoi vous êtes venus. C’est plus que la plupart des couples ne peuvent en dire le jour de leur mariage.'));
const returning = (lang, track) => days.flatMap((d) => greetingFor('returning', lang, 'assessment', d, track).lines);
ok('Marriage return line, English', returning('en', 'marriage').includes('Love isn’t lost in the gap. It’s found in the return.'));
ok('Marriage return line, French', returning('fr', 'marriage').includes('L’amour ne se perd pas dans l’absence. Il se retrouve dans le retour.'));
ok('Marriage return line no longer says leadership', !returning('en', 'marriage').concat(returning('fr', 'marriage')).some((l) => /leadership/i.test(l)));
ok('Leadership return line unchanged', returning('en', 'leadership').includes('Leadership isn’t lost in the gap. It’s found in the return.') && returning('fr', 'leadership').includes('Le leadership ne se perd pas dans l’interruption. Il se trouve dans le retour.'));
ok('Other tracks keep the return line', returning('en', 'ministry').includes('Leadership isn’t lost in the gap. It’s found in the return.'));

const outIdx = process.argv.indexOf('--out');
if (outIdx !== -1) copyFileSync(payloadPath, process.argv[outIdx + 1]);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
