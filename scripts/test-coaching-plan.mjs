#!/usr/bin/env node
// Tests the plan_data parsing in lib/coaching-plan/parse.ts.
//
//   node scripts/test-coaching-plan.mjs
//
// Same approach as test-safety.mjs: compiled with the project's own tsc, so this
// exercises the shipped file.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = mkdtempSync(join(tmpdir(), 'plan-test-'));
execFileSync('npx', ['tsc', 'lib/coaching-plan/parse.ts', '--outDir', out, '--target', 'es2020', '--module', 'es2020', '--skipLibCheck'], { stdio: 'inherit' });
writeFileSync(join(out, 'package.json'), '{"type":"module"}');
const p = await import(pathToFileURL(join(out, 'parse.js')).href);

let pass = 0, fail = 0;
const ok = (name, cond) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); }
};

const week = (n, extra = {}) => ({
  week: n, focus: 'Trust', title_en: `Week ${n} title`, title_fr: `Titre ${n}`, desc_en: 'Desc', desc_fr: 'Déc',
  exercises: [{ type: 'exercise', title_en: 'Do', title_fr: 'Faire' }, { type: 'reflection', title_en: 'Think', title_fr: 'Penser' }, { type: 'practice', title_en: 'Try', title_fr: 'Essayer' }],
  ...extra,
});
const twelve = Array.from({ length: 12 }, (_, i) => week(i + 1));

console.log('\nComplete and incomplete plans');
ok('12 weeks is complete', p.isPlanComplete(p.parseWeeks({ weeks: twelve })));
ok('9 weeks (generation stopped partway) is not', !p.isPlanComplete(p.parseWeeks({ weeks: twelve.slice(0, 9) })));
ok('a repeated week does not count twice', !p.isPlanComplete(p.parseWeeks({ weeks: [...twelve.slice(0, 11), week(1)] })));

console.log('\nBad data from the stored JSON');
for (const [name, value] of [['null', null], ['undefined', undefined], ['a string', 'x'], ['the old array format', [{ week: 1, theme: 'x' }]], ['weeks not an array', { weeks: 'x' }]]) {
  ok(`${name} gives no weeks`, p.parseWeeks(value).length === 0);
}
ok('out-of-range week dropped', p.parseWeeks({ weeks: [week(0), week(13), week(5)] }).length === 1);
ok('non-integer week dropped', p.parseWeeks({ weeks: [week(1.5), week('2')] }).length === 0);
ok('week with no title dropped', p.parseWeeks({ weeks: [week(1, { title_en: '  ' })] }).length === 0);
ok('null entries dropped', p.parseWeeks({ weeks: [null, 7, week(3)] }).length === 1);
ok('bad exercises dropped, good kept', p.parseWeeks({ weeks: [week(1, { exercises: [null, { type: 'exercise' }, { title_en: 'Keep' }] })] })[0].exercises.length === 1);
ok('missing exercises is an empty list', p.parseWeeks({ weeks: [week(1, { exercises: undefined })] })[0].exercises.length === 0);

console.log('\nOrder');
const shuffled = p.parseWeeks({ weeks: [week(3), week(1), week(2)] }).map((w) => w.week);
ok('sorted by week number', JSON.stringify(shuffled) === '[1,2,3]');
ok('a repeated week keeps its last entry', p.parseWeeks({ weeks: [week(1, { title_en: 'Old' }), week(1, { title_en: 'New' })] })[0].titleEn === 'New');

console.log('\nModule links');
ok('module_id is read', p.parseWeeks({ weeks: [week(1, { module_id: 'abc' })] })[0].moduleId === 'abc');
ok('no module_id is null', p.parseWeeks({ weeks: [week(1)] })[0].moduleId === null);

console.log('\nCurrent week');
for (const [input, expected] of [[1, 1], [12, 12], [13, 12], [99, 12], [0, 1], [-3, 1], [null, 1], [undefined, 1], ['5', 1], [NaN, 1]]) {
  ok(`${String(input)} shows as week ${expected}`, p.clampWeek(input) === expected);
}

console.log('\nPhases cover every week exactly once');
const covered = p.PLAN_PHASES.flatMap((ph) => Array.from({ length: ph.to - ph.from + 1 }, (_, i) => ph.from + i));
ok('1 to 12, no gaps or overlaps', JSON.stringify(covered) === JSON.stringify(Array.from({ length: 12 }, (_, i) => i + 1)));

console.log('\nLanguage');
ok('French when stored', p.localized('fr', 'Hello', 'Bonjour') === 'Bonjour');
ok('English when French is missing', p.localized('fr', 'Hello', '') === 'Hello');
ok('English reader gets English', p.localized('en', 'Hello', 'Bonjour') === 'Hello');
ok('exercise label in French', p.exerciseLabel('reflection', 'fr') === 'Réflexion');
ok('unknown exercise type falls back', p.exerciseLabel('other', 'en') === 'Exercise');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
