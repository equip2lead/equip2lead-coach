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
    blocks: 150,
    images: 4,
    scorecardKey: 'marriage_module1_covenant',
    videos: [
      {
        id: "GQI72THyO5I", section: 1, title: "Book of Genesis Summary: A Complete Animated Overview (Part 1) | BibleProject",
        after: 'If you would like to see the whole sweep', before: 'divider',
        tip: "About 8 minutes. Watch for two moments: the creation of man and woman together as God's image, and what the fall does to their relationship in Genesis 3. Everything this track teaches about marriage is an attempt to return, by grace, to the first picture.",
      },
      {
        id: "cRptjonzx0o", section: 6, title: "Marriage: It's a Covenant, Not a Contract | Dr. Tony Evans",
        after: 'Dr. Tony Evans, who led Oak Cliff', before: 'heading',
        tip: "As you watch, compare what he says with the table above. Then ask yourself honestly: in the way I think and speak about marriage, am I living by covenant or by contract?",
      },
      {
      id: 'C9THu0PZwwk', section: 7, title: 'The Meaning of Marriage | Timothy Keller | Talks at Google',
      tip: "Optional: this is Tim Keller's full talk on his book The Meaning of Marriage, about an hour long. You can finish this module without it. Watch it when you have time, and listen for how he describes covenant: the promise that makes love stable instead of fragile.",
      },
    ],
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
    blocks: 132,
    images: 4,
    scorecardKey: 'marriage_module2_carrying',
    videos: [
      {
        id: 'psN1DORYYV0', section: 3, title: 'Listening to shame | Brené Brown | TED',
        tip: "About 20 minutes. Listen for her conclusion that empathy is the antidote to shame. That is why this module keeps pointing you toward a safe person, not only toward private effort: shame loses its grip when it is spoken to someone who responds with compassion. It is also the gospel's pattern: Jesus met the Samaritan woman's story with an offer, not a verdict.",
      },
      { id: '95ovIJ3dsNk', section: 4, title: 'How childhood trauma affects health across a lifetime | Nadine Burke Harris | TED' },
      {
        id: 'MxPEBPrZq-4', section: 6, title: "You Can't Rush the Healing Process | T.D. Jakes",
        after: 'Bishop T.D. Jakes has preached for decades', before: 'callout',
        tip: "Listen for what he says about the time healing takes. Then ask yourself honestly: is there a wound I have been trying to hurry past, or cover with a new relationship, instead of letting God heal it?",
      },
    ],
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
  3: {
    slug: 'choosing-well',
    title: 'Choosing Well',
    subtitle: "Infatuation, Compatibility, and the Convictions Before the Ring",
    duration: 120,
    sortOrder: 3,
    blocks: 169,
    images: 4,
    scorecardKey: 'marriage_module3_choosing',
    videos: [
      { id: "kVkW5Nt9YHE", section: 1, title: "Key Dating Advice From Dr. Myles Munroe | Munroe Global" },
      { id: "OYfoGTIG7pY", section: 2, title: "The brain in love | Helen Fisher | TED" },
      { id: "jodhovumkHQ", section: 6, title: "Select the right relationship | Alexandra Redcay | TEDxUpperEastSide" },
    ],
    sections: [
      "Section 1 — Finding, Not Chasing",
      "Section 2 — Three Girls in One Year",
      "Section 3 — Time, Desperation and Deciding",
      "Section 4 — The Right Order",
      "Section 5 — Nine Areas of Compatibility",
      "Section 6 — Seeing Clearly",
      "Section 7 — The Conversation Nobody Wants First",
      "Section 8 — The Fifteen Convictions",
      "Am I Choosing Well?",
      "Module 3 Assignment — See Clearly, Choose Deliberately",
      "Module 3 Complete",
    ],
    privacy: 'Your partner cannot see this assignment. Write honestly.',
    keep: [
      'Your partner cannot see these ratings.',
      'speak to a trusted pastor or counsellor before you take any other step',
    ],
  },
  4: {
    slug: 'teach-me-how-to-love',
    title: 'Teach Me How to Love',
    subtitle: 'Agape, the Three Levels of Love, and the Deposits That Keep It Alive',
    pillarSlug: 'communication-connection',
    pillarId: '00000000-0000-0000-0002-000000000012',
    duration: 110,
    sortOrder: 4,
    blocks: 136,
    images: 3,
    scorecardKey: 'marriage_module4_loving',
    // No official Gottman video was found, so his research is cited in the text only.
    videos: [
      {
        id: '_FYvr-UsAGI', section: 6, title: 'The Five Love Languages | Dr. Gary Chapman | 100 Huntley Street',
        tip: "As you listen, ask two questions: which language do I speak most naturally, and which does my partner (or the person closest to me) most need? If you are married or engaged, do not guess. Ask them, write down what they say, and believe it, even if it is not what you would have wanted.",
      },
    ],
    sections: [
      'Section 1 — Lord, Teach Me How to Love',
      'Section 2 — The Slow Drift',
      'Section 3 — Four Words for Love',
      'Section 4 — Love in Verbs',
      'Section 5 — The Three Levels of Love',
      'Section 6 — Learning the Person You Actually Married',
      'Section 7 — Love Can Be Grown',
      'Section 8 — When Love Goes Cold',
      'Section 9 — Seven Deposits',
      'Section 10 — The Teacher Himself',
      'How Am I Loving?',
      'Module 4 Assignment — Learn Love, Then Give It',
      'Module 4 Complete',
    ],
    privacy: 'Your partner cannot see this assignment.',
    keep: [
      'Your partner cannot see these ratings.',
      'speak to a trusted pastor or counsellor before you work thr',
      'which is the whole message of Module 1',
    ],
  },
  5: {
    slug: 'words-and-conflict',
    title: 'Words & Conflict',
    subtitle: 'Listening, Fighting Well, and the Process That Heals Hurt',
    pillarSlug: 'communication-connection',
    pillarId: '00000000-0000-0000-0002-000000000012',
    duration: 115,
    sortOrder: 5,
    blocks: 115,
    images: 3,
    scorecardKey: 'marriage_module5_words',
    // The only Marriage Course candidate was not on an official channel.
    videos: [
      {
        id: '1o30Ps-_8is', section: 3, title: 'Four Horsemen of the Apocalypse | The Gottman Institute',
        tip: "As you watch, identify your own most common horseman, not your partner's. Then practise its antidote once this week, on purpose.",
      },
      {
        id: '5vWkzB2oBuY', section: 5, title: 'Why The Happiest Couples Still Fight | Greg and Erin Smalley',
        tip: "About 30 minutes. Greg and Erin Smalley lead Focus on the Family's marriage ministry. As you watch, look for one practical habit you can add to the five steps above.",
      },
    ],
    sections: ["Section 1 — Two Cultures, One House", "Section 2 — Listen to Understand", "Section 3 — Words That Build, Words That Break", "Section 4 — Conflict Is Not Failure", "Section 5 — A Path Through Every Disagreement", "Section 6 — Arit's Turn: The Quiet Hour", "Section 7 — The Process That Heals Hurt", "Section 8 — Ban One Word", "How Do I Speak and Fight?", "Module 5 Assignment — Talk, Listen, Fight Well, Forgive", "Module 5 Complete"],
    privacy: 'Your partner cannot see this assignment. Write honestly.',
    keep: [
      'Your partner cannot see these ratings.',
      'skip Prompt 3 and speak to a trusted pastor or counsellor first',
      'Nicky and Sila Lee',
      'Module 4 tells our own story of exactly this',
    ],
  },
  6: {
    slug: 'roles-and-work',
    title: 'Roles & Work',
    subtitle: 'Headship, Submission, Love and Respect, and Who Carries What',
    pillarSlug: 'partnership-roles',
    pillarId: '00000000-0000-0000-0002-000000000013',
    duration: 110,
    sortOrder: 6,
    blocks: 115,
    images: 4,
    videoPlaceholders: 2,
    scorecardKey: 'marriage_module6_roles',
    videos: [
      { id: "Gy_tHy6_KHc", section: 2, title: "The Husband and Wife's Role in Marriage | Dr. Myles Munroe", after: "Dr. Myles Munroe taught a generation of ", before: "reflection_questions", tip: "As you listen, write down one responsibility he names that you have never thought of as part of your role. Then compare it with the job description above." },
      { id: "N1otteFv6zw", section: 5, title: "Love and Respect in Marriage and Family | Dr. Emerson Eggerichs", after: "Dr. Emerson Eggerichs and his wife Sarah", before: "pull_quote_card", tip: "As you watch, notice one way you may be sending your partner a message you never intended. Then ask them, this week, what makes them feel most loved and most respected." },
    ],
    sections: ["Section 1 — Equal in Worth, Distinct in Calling", "Section 2 — Headship Is Responsibility, Not Superiority", "Section 3 — He Decides, With Her", "Section 4 — Submission: What It Is and What It Has Never Been", "Section 5 — Love and Respect", "Section 6 — Both of You Were Made to Work", "Section 7 — Who Carries What", "Are We Partners?", "Module 6 Assignment — Build Your Partnership", "Module 6 Complete"],
    privacy: 'Your partner cannot see this assignment. Write honestly.',
    keep: [
      'Your partner cannot see these ratings.',
      'skip the prompts and speak to a trusted pastor or counsellor first',
      'Nothing taught here ever requires anyone to remain in reach of violence, control or abuse.',
      'contact local emergency services if you are in danger',
      'Dr. Emerson Eggerichs, author of Love and Respect, pictures a wife seeing the world through pink sunglasses',
    ],
  },
};

const N = Number(process.argv[2]);
const want = EXPECT[N];
if (!want) { console.error('usage: test-marriage-module.mjs <1|2|3|4|5|6> [--out <file>]'); process.exit(2); }

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
ok('pillar', payload.pillar_slug === (want.pillarSlug ?? 'personal-foundation') && gen.pillar_id === (want.pillarId ?? '00000000-0000-0000-0002-000000000011'));
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
const videos = blocks.filter((b) => b.type === 'video_embed');
ok(`${want.videos.length} video(s), the verified ones, in order`, videos.length === want.videos.length && want.videos.every((v, i) => videos[i].youtubeId === v.id && videos[i].title === v.title));
want.videos.filter((v) => v.after).forEach((v) => {
  const at = blocks.findIndex((b) => b.youtubeId === v.id);
  ok(`paragraph directly before ${v.id}`, blocks[at - 1].type === 'paragraph' && blocks[at - 1].text.startsWith(v.after));
  ok(`${v.before} closes the addition after ${v.id}`, blocks[at + 2].type === v.before);
});
want.videos.filter((v) => v.tip).forEach((v) => {
  const next = blocks[blocks.findIndex((b) => b.youtubeId === v.id) + 1];
  ok(`tip callout directly after ${v.id}`, next.type === 'callout' && next.variant === 'tip' && next.text === v.tip);
});
if (want.images) {
  const images = blocks.filter((b) => b.type === 'image');
  ok(`${want.images} real images, in order, at their paths`, images.length === want.images && images.every((b, i) => b.url === `/images/marriage/module-${N}/MM${N}-${i + 1}.png`));
  ok('every image has alt text', images.every((b) => b.alt && b.alt.length > 40));
  ok('every image file exists and is a PNG', images.every((b) => {
    const f = readFileSync(resolve(repo, 'public' + b.url));
    return f.subarray(1, 4).toString() === 'PNG';
  }));
} else {
  ok('no real image blocks yet', count('image') === 0);
}
if (N === 5) ok('no unofficial candidate or dummy id', !/rcXD7HMYlJM|"youtubeId":"(none|X|Y|Z)"|Marriage Course is a Christian course/.test(JSON.stringify(blocks)));
if (N === 4) ok('no unofficial candidate or empty Gottman slot', !/kCUkBO7F_dY|pFtkQw0OWq0|"youtubeId":"none"/.test(JSON.stringify(blocks)));
ok('no verification note left in the content', !JSON.stringify(blocks).includes('EXTERNAL VIDEO') && !JSON.stringify(blocks).includes('Claude Code'));
const quiz = blocks.find((b) => b.type === 'quiz');
ok('every quiz answer is a real option', quiz.questions.every((q) => q.options.some((o) => o.id === q.correct_option_id)));

console.log('\nImages and placeholders');
const callouts = blocks.filter((b) => b.type === 'callout').map((b) => b.text);
const imgs = callouts.filter((t) => t.startsWith('[IMAGE PLACEHOLDER'));
const imageCount = want.imagePlaceholders ?? 4;
if (want.images) ok('no image placeholders left', imgs.length === 0);
else ok(`${imageCount} image placeholders, MM${N}-1 to MM${N}-${imageCount}`, imgs.length === imageCount && Array.from({ length: imageCount }, (_, k) => k + 1).every((n) => imgs.some((t) => t.startsWith(`[IMAGE PLACEHOLDER — MM${N}-${n}]`))));
const videoPlaceholders = want.videoPlaceholders ?? 3;
ok(`${videoPlaceholders} video placeholders`, callouts.filter((t) => t.startsWith('[VIDEO PLACEHOLDER')).length === videoPlaceholders);

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
want.videos.forEach((v) => ok(`${v.id} in section ${v.section}`, sections[v.section - 1].blocks.some((b) => b.youtubeId === v.id)));
if (N === 2) {
  const s3 = sections[2].blocks;
  const at = s3.findIndex((b) => b.type === 'heading' && b.text === 'Shame or Guilt?');
  ok('Shame or Guilt? closes Section 3, level 3, in order', at > 0 && s3[at].level === 3
    && s3[at - 1].text.startsWith('Grace is not a lesser ticket')
    && s3[at + 1].type === 'paragraph' && s3[at + 1].text.startsWith('The researcher Brené Brown')
    && s3[at + 2].youtubeId === 'psN1DORYYV0' && s3[at + 3].variant === 'tip'
    && s3[at + 4].type === 'divider' && at + 5 === s3.length);
}
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
