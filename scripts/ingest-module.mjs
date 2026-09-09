#!/usr/bin/env node
// Transform an authored module JSON into the flat LessonBlock[] shape stored
// in lesson_modules.body_blocks.
//
// Two things this script will not do: guess, and degrade quietly. Every
// mismatch between the authored file and what the schema expects is an abort
// with the offending value printed, never a silent substitution. A module
// that loads wrong is worse than one that fails to load, because the second
// kind gets noticed.
//
//   node scripts/ingest-module.mjs <file.json> [--out <path>]
//
// Writes the transformed payload to --out (default: stdout summary only).
// Performs no database access; ids are resolved by the caller.

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Widened from the original four to include 'info', which the authored
// content uses 9 times. See KNOWN_CALLOUT_VARIANTS in lib/lesson-blocks.ts —
// the two lists must agree.
const KNOWN_CALLOUT_VARIANTS = new Set(['note', 'info', 'warning', 'tip', 'scripture']);

const KNOWN_BLOCK_TYPES = new Set([
  'heading', 'paragraph', 'quote', 'pull_quote_card', 'table',
  'video_embed', 'image', 'reflection_questions', 'scorecard',
  'callout', 'divider', 'quiz', 'assignment_prompt',
]);

const QUIZ_SCOPES = new Set(['video_check', 'module_review']);

const DIFFICULTY_MAP = { foundation: 'beginner' };
const ALLOWED_DIFFICULTY = new Set(['beginner', 'intermediate', 'advanced']);

function die(msg) {
  console.error(`\n  ABORT: ${msg}\n`);
  process.exit(1);
}

/** Deterministic and stable for a given (slug, position, type). Recomputing
    after a content edit re-ids blocks from the edit point onward, which is
    why no user data is keyed on these — ratings use (scorecard_key, item_key)
    and submissions use assignment_key, both read from the payload. */
function blockId(slug, index, type) {
  return 'b_' + createHash('sha256').update(`${slug}|${index}|${type}`).digest('hex').slice(0, 12);
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const [, , inputPath, ...rest] = process.argv;
if (!inputPath) die('usage: ingest-module.mjs <file.json> [--out <path>]');
const outIdx = rest.indexOf('--out');
const outPath = outIdx !== -1 ? rest[outIdx + 1] : null;

const src = JSON.parse(readFileSync(inputPath, 'utf8'));
const meta = src.new_row_data || {};
const blocks = src.blocks;

if (!Array.isArray(blocks)) die('blocks is not an array');
if (!meta.title) die('new_row_data.title is missing — slug and title_en depend on it');

const slug = slugify(meta.title);

// ── difficulty ──────────────────────────────────────────────────────────────
let difficulty = meta.difficulty;
if (DIFFICULTY_MAP[difficulty]) {
  console.log(`  difficulty: '${difficulty}' -> '${DIFFICULTY_MAP[difficulty]}'`);
  difficulty = DIFFICULTY_MAP[difficulty];
}
if (!ALLOWED_DIFFICULTY.has(difficulty)) {
  die(`difficulty '${meta.difficulty}' is not one of ${[...ALLOWED_DIFFICULTY].join(', ')} and has no mapping`);
}

// ── pillar slug ─────────────────────────────────────────────────────────────
// Authored files use underscores; pillars.slug uses hyphens.
const pillarSlug = meta.pillar ? String(meta.pillar).replace(/_/g, '-') : null;
if (meta.pillar && pillarSlug !== meta.pillar) {
  console.log(`  pillar slug: '${meta.pillar}' -> '${pillarSlug}'`);
}

// ── blocks ──────────────────────────────────────────────────────────────────
const problems = [];
let assignmentOrdinal = 0;
const scorecardKeys = [];

const out = blocks.map((block, index) => {
  const type = block?.type;
  if (!type) { problems.push(`block ${index}: no type`); return null; }
  if (!KNOWN_BLOCK_TYPES.has(type)) problems.push(`block ${index}: unknown type '${type}'`);

  const data = block.data && typeof block.data === 'object' ? block.data : {};
  if (block.data === undefined) problems.push(`block ${index} (${type}): no data envelope`);

  // Unwrap {type, data:{...}} -> flat {id, type, ...data}
  const flat = { id: blockId(slug, index, type), type, ...data };

  if (type === 'callout') {
    if (!KNOWN_CALLOUT_VARIANTS.has(flat.variant)) {
      problems.push(`block ${index} (callout): unknown variant '${flat.variant}'`);
    }
  }

  if (type === 'heading' && ![2, 3, 4].includes(flat.level)) {
    problems.push(`block ${index} (heading): level ${flat.level} outside 2-4`);
  }

  if (type === 'scorecard') {
    if (!flat.scorecard_key) problems.push(`block ${index} (scorecard): no scorecard_key`);
    if (!Array.isArray(flat.items) || flat.items.length === 0) {
      problems.push(`block ${index} (scorecard): no items`);
    } else {
      flat.items.forEach((it, j) => {
        if (!it.key) problems.push(`block ${index} scorecard item ${j}: no key`);
        if (typeof it.max !== 'number') problems.push(`block ${index} scorecard item ${j}: no numeric max`);
      });
    }
    scorecardKeys.push(flat.scorecard_key);
  }

  if (type === 'quiz') {
    // The answer key ships to the browser, so nothing downstream ever
    // re-checks it. A key naming an option that does not exist would grade
    // every attempt wrong, silently and forever — this is the only place it
    // can be caught.
    if (!QUIZ_SCOPES.has(flat.scope)) {
      problems.push(`block ${index} (quiz): scope '${flat.scope}' is not ${[...QUIZ_SCOPES].join(' or ')}`);
    }
    if (!flat.title) problems.push(`block ${index} (quiz): no title`);
    if (!Array.isArray(flat.questions) || flat.questions.length === 0) {
      problems.push(`block ${index} (quiz): no questions`);
    } else {
      const seenQ = new Set();
      flat.questions.forEach((q, j) => {
        if (!q.id) problems.push(`block ${index} quiz question ${j}: no id`);
        else if (seenQ.has(q.id)) problems.push(`block ${index} quiz question ${j}: duplicate id '${q.id}'`);
        else seenQ.add(q.id);

        if (!q.prompt) problems.push(`block ${index} quiz question ${j}: no prompt`);

        if (!Array.isArray(q.options) || q.options.length < 2) {
          problems.push(`block ${index} quiz question ${j}: needs at least 2 options`);
          return;
        }
        const ids = q.options.map((o) => o && o.id);
        if (ids.some((id) => !id)) problems.push(`block ${index} quiz question ${j}: an option has no id`);
        if (q.options.some((o) => !o || !o.text)) problems.push(`block ${index} quiz question ${j}: an option has no text`);
        if (new Set(ids).size !== ids.length) problems.push(`block ${index} quiz question ${j}: duplicate option ids`);
        if (!ids.includes(q.correct_option_id)) {
          problems.push(`block ${index} quiz question ${j}: correct_option_id '${q.correct_option_id}' matches no option`);
        }
      });
    }
  }

  if (type === 'assignment_prompt') {
    // Ordinal among assignment blocks, not global index: stable across
    // paragraph edits elsewhere in the module.
    assignmentOrdinal += 1;
    flat.assignment_key = `a${assignmentOrdinal}`;
    if (!Array.isArray(flat.prompts)) problems.push(`block ${index} (assignment_prompt): prompts is not an array`);
  }

  return flat;
});

if (problems.length) {
  console.error(`\n  ${problems.length} problem(s) found:`);
  for (const p of problems.slice(0, 40)) console.error(`    - ${p}`);
  if (problems.length > 40) console.error(`    ... and ${problems.length - 40} more`);
  die('refusing to emit a module with unresolved problems');
}

if (out.length !== blocks.length) {
  die(`block count changed: ${blocks.length} in, ${out.length} out`);
}

const ids = new Set(out.map((b) => b.id));
if (ids.size !== out.length) die(`block ids are not unique: ${out.length} blocks, ${ids.size} distinct ids`);

// ── report ──────────────────────────────────────────────────────────────────
const byType = out.reduce((a, b) => ((a[b.type] = (a[b.type] || 0) + 1), a), {});
console.log(`
  slug                 ${slug}
  title                ${meta.title}
  subtitle             ${meta.subtitle ?? '—'}
  module_number        ${meta.module_number ?? '—'}
  track slug           ${meta.track ?? '—'}
  pillar slug          ${pillarSlug ?? '—'}
  difficulty           ${difficulty}
  duration (min)       ${meta.estimated_duration_minutes ?? '—'}
  language             ${src.language ?? '—'}
  source title match   ${src.material_title_match ?? '—'}

  blocks in / out      ${blocks.length} / ${out.length}
  distinct block ids   ${ids.size}
  scorecard keys       ${scorecardKeys.join(', ') || '—'}
  assignment keys      ${out.filter((b) => b.assignment_key).map((b) => b.assignment_key).join(', ') || '—'}
  types                ${Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join('  ')}
`);

// new_row_data keys that map straight onto a lesson_modules column and need
// no transform. Listed rather than passed through wholesale so a typo in an
// authored file surfaces as an unmapped field below instead of silently
// travelling to a column that does not exist.
const PASSTHROUGH = {
  subtitle: 'subtitle_en',
  module_number: 'module_number',
  estimated_duration_minutes: 'estimated_duration_minutes',
  cover_image_url: 'cover_image_url',
  cover_image_alt: 'cover_image_alt',
  is_starting_point: 'is_starting_point',
  sort_order: 'sort_order',
};
// Handled above by a transform of their own, so not "unmapped".
const TRANSFORMED = new Set(['title', 'track', 'pillar', 'difficulty']);

const row = {
  slug,
  title_en: meta.title,
  track_slug: meta.track ?? null,
  pillar_slug: pillarSlug,
  difficulty,
  source_title_match: src.material_title_match ?? null,
  language: src.language ?? 'en',
};
for (const [key, column] of Object.entries(PASSTHROUGH)) {
  if (meta[key] !== undefined) row[column] = meta[key];
}

const unmapped = Object.keys(meta).filter((k) => !TRANSFORMED.has(k) && !(k in PASSTHROUGH));
if (unmapped.length) {
  console.log(`  note: new_row_data keys with no column mapping, ignored: ${unmapped.join(', ')}`);
}

console.log(`  starting point       ${row.is_starting_point ? 'yes' : 'no'}`);
console.log(`  source document      ${row.source_title_match ?? '\u2014 (none; new content)'}`);

if (outPath) {
  writeFileSync(outPath, JSON.stringify({ ...row, body_blocks: out }, null, 0));
  console.log(`  wrote ${outPath}\n`);
}
