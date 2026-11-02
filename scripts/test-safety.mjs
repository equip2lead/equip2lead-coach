#!/usr/bin/env node
// Tests the Marriage track safety rules in lib/safety.ts and checks that the
// wording they match still appears on both intake pages.
//
//   node scripts/test-safety.mjs
//
// Same approach as test-split-sections.mjs: the TypeScript is compiled to a temp
// dir with the project's own tsc, so this exercises the shipped file.

import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = mkdtempSync(join(tmpdir(), 'safety-test-'));
execFileSync('npx', ['tsc', 'lib/safety.ts', '--outDir', out, '--target', 'es2020', '--module', 'es2020', '--skipLibCheck', '--lib', 'es2020,dom'], { stdio: 'inherit' });
writeFileSync(join(out, 'package.json'), '{"type":"module"}');
const s = await import(pathToFileURL(join(out, 'safety.js')).href);

let pass = 0, fail = 0;
const ok = (name, cond) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); }
};

const safety = (answer, key = 'vision_1') => ({ [key]: { question: s.SAFETY_QUESTION, answer } });
const spouse = (answer, question = 'How willing is your spouse to participate?') => ({ vision_2: { question, answer } });

console.log('\nWhich answers raise a concern');
ok('"No — I have serious concerns" does', s.hasSafetyConcern(safety('No — I have serious concerns')));
ok('"Sometimes — it depends" does', s.hasSafetyConcern(safety('Sometimes — it depends')));
ok('"Yes, always" does not', !s.hasSafetyConcern(safety('Yes, always')));
ok('"Mostly, with some concerns" does not', !s.hasSafetyConcern(safety('Mostly, with some concerns')));
ok('the same text on another question does not', !s.hasSafetyConcern({ a: { question: 'Other?', answer: 'Sometimes — it depends' } }));
ok('empty, null and non-object data do not', !s.hasSafetyConcern({}) && !s.hasSafetyConcern(null) && !s.hasSafetyConcern('x'));

console.log('\nBoth save formats, and answers from before the flag existed');
ok('intake keys (vision_1)', s.hasSafetyConcern(safety('Sometimes — it depends', 'vision_1')));
ok('pre-assessment keys (step_16_select)', s.hasSafetyConcern(safety('Sometimes — it depends', 'step_16_select')));
ok('explicit flag alone', s.hasSafetyConcern({ safety_concern: true }));

console.log('\nSaving');
const first = s.mergeAssessmentData({}, safety('No — I have serious concerns'));
ok('a concern sets the flag', first.safety_concern === true);
ok('a concern blocks spouse invites', first.spouse_invite_blocked === true);
ok('a concern records when', typeof first.safety_concern_at === 'string');

const retake = s.mergeAssessmentData(first, safety('Yes, always'));
ok('a later "Yes, always" does not clear the flag', retake.safety_concern === true && s.hasSafetyConcern(retake));
ok('the first date is kept', retake.safety_concern_at === first.safety_concern_at);
ok('invites stay blocked', retake.spouse_invite_blocked === true);
ok('the new answers still replace the old', retake.vision_1.answer === 'Yes, always');

const otherFormat = s.mergeAssessmentData(first, safety('Yes, always', 'step_16_select'));
ok('a retake in the other format keeps the flag', otherFormat.safety_concern === true);
ok('and drops the old keys', otherFormat.vision_1 === undefined);

const legacy = s.mergeAssessmentData(safety('Sometimes — it depends'), safety('Yes, always'));
ok('a concern from before the flag existed also survives a retake', legacy.safety_concern === true);

const clean = s.mergeAssessmentData({}, safety('Yes, always'));
ok('no concern, no flag', clean.safety_concern === undefined && clean.spouse_invite_blocked === undefined);

console.log('\nSpouse invitations');
ok('"They don\'t know yet" blocks', s.mergeAssessmentData({}, spouse(s.SPOUSE_UNAWARE_ANSWER)).spouse_invite_blocked === true);
ok('in the pre-assessment wording too', s.mergeAssessmentData({}, spouse(s.SPOUSE_UNAWARE_ANSWER, 'How willing is your spouse to participate in coaching?')).spouse_invite_blocked === true);
ok('"Very willing" does not', s.mergeAssessmentData({}, spouse('Very willing')).spouse_invite_blocked === undefined);
ok('a block survives a save with no spouse answer', s.mergeAssessmentData({ spouse_invite_blocked: true }, safety('Yes, always')).spouse_invite_blocked === true);
ok('a new answer lifts a block that came only from this question', s.mergeAssessmentData({ spouse_invite_blocked: true }, spouse('Very willing')).spouse_invite_blocked === undefined);
ok('but never one that came from a safety concern', s.mergeAssessmentData(first, spouse('Very willing')).spouse_invite_blocked === true);

console.log('\nAI Coach prompt');
const data = {
  safety_concern: true,
  step_3_slider: { question: 'Trust', answer: 2 },
  vision_1: { question: s.SAFETY_QUESTION, answer: 'Sometimes — it depends' },
};
const en = s.buildSafetySystemPrompt({ userName: 'Sam', lang: 'en', preAssessment: data, memoryContext: 'Past note' });
const fr = s.buildSafetySystemPrompt({ userName: 'Sam', lang: 'fr', preAssessment: data });
ok('English rule included', en.includes(s.SAFETY_COACH_RULE.en));
ok('French rule included', fr.includes(s.SAFETY_COACH_RULE.fr));
ok('French replies requested', fr.includes('Respond entirely in French') && !en.includes('Respond entirely in French'));
ok('numeric self-ratings left out', !en.includes('Trust'));
ok('safety answer kept', en.includes('Sometimes — it depends'));
ok('the flag itself is not listed as an answer', !en.includes('safety_concern'));
ok('memory is labelled as secondary', en.includes('the safety rule wins') && en.includes('Past note'));
for (const line of ['weakest', 'Reference specific scores', 'biblical wisdom', 'KNOWLEDGE BASE']) {
  ok(`no "${line}" instruction from the normal prompt`, !en.includes(line));
}

console.log('\nThe wording matched here is what the pages actually use');
const read = (f) => readFileSync(f, 'utf8').replace(/\\u2014/g, '—').replace(/\\'/g, "'");
for (const page of ['app/intake/page.tsx', 'app/pre-assessment/page.tsx']) {
  const src = read(page);
  ok(`${page}: safety question`, src.includes(s.SAFETY_QUESTION));
  for (const a of s.SAFETY_CONCERN_ANSWERS) ok(`${page}: "${a}"`, src.includes(a));
  ok(`${page}: spouse question`, src.includes(s.SPOUSE_WILLINGNESS_QUESTION_PREFIX));
  ok(`${page}: "${s.SPOUSE_UNAWARE_ANSWER}"`, src.includes(s.SPOUSE_UNAWARE_ANSWER));
}

console.log('\nNothing contacts a spouse');
const emailing = execFileSync('grep', ['-rlE', 'resend\\.emails|emails\\.send', 'app', 'lib', 'components'], { encoding: 'utf8' }).trim().split('\n').sort();
ok(`only the contact form and admin invites send email (${emailing.join(', ')})`,
  JSON.stringify(emailing) === JSON.stringify(['app/api/admin/invites/send/route.ts', 'app/api/contact/route.ts']));
const intakeSrc = read('app/intake/page.tsx') + read('app/pre-assessment/page.tsx') + read('lib/assessment-save.ts');
ok('the intake flows never call an invite or email API', !/invites\/send|admin_create_invite|\/api\/contact/.test(intakeSrc));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
