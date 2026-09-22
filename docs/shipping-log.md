# Shipping log

## 2026-09-05 — Session B production ship

Starting Point (Module 0) live at app.equip2lead.coach.
Module 1 (The Leader Within) live with section-based navigation.
Persistent app shell shipped (disjoint navigation fixed).

Schema changes in production:
- lesson_modules table
- lesson_scorecard_ratings table
- lesson_assignment_submissions table
- lesson_progress.metadata JSONB column
- lesson_progress.lesson_module_id column
- lesson_modules.is_starting_point column

Content in production:
- Module 0: Starting Point (123 blocks, 5 sections, is_starting_point=true)
- Module 1: The Leader Within (489 blocks, 7 sections)

Not yet built:
- Assignment submission form (5.2d)
- module_id link from plan_data.weeks[n] to Module 1 (5.2e)
- Modules 2-12 (content pending)
- Video and image assets (Denis to record/curate)
- French translations (human, not machine)

## 2026-09-07 — Phase 5.3 Coach's Office dashboard

Complete redesign of /dashboard shipped to app.equip2lead.coach.

Six blocks: greeting, next step, what you've written, module grid, pillars, closing quote.
Denis's voice throughout. No gamification.
State-aware greeting variants (6 states, 3-4 copy variants each, day-of-year rotation).
Assessment vs Sequential mode toggle (profiles.next_step_mode column).
Module grid with pillar and status filters, URL persistence.
Read/Revise routing via ?view=submission and ?view=edit.
Draft integrity rules: newer beats submission, older shows banner, none creates from submission.

Fixed: PostgREST zero-row DELETE silent-success. Delete now .select()s and errors explicitly.

Old dashboard archived as _dashboard-legacy.tsx.

Migrations in production:
- profiles.next_step_mode TEXT DEFAULT 'assessment' CHECK IN ('assessment', 'sequential')

## 2026-09-08 — Module 2 "Character in the Dark"

Live at app.equip2lead.coach. Data-only ship — no code change, no deploy.

lesson_modules id 8fb09718-38c0-4978-abf4-93a1ca95c1af, slug character-in-the-dark.
181 blocks, 8 sections, module_number 2, sort_order 2, is_starting_point false.
Pillar: Personal Leadership. Difficulty: foundation -> beginner. Duration: 90 min.

Blocks: paragraph 84, heading 32, callout 31, divider 15, reflection_questions 6,
table 6, pull_quote_card 5, video_embed 1, assignment_prompt 1 (assignment_key a1,
4 prompts, 200-600 words).

Verified in production: all 8 sections render with correct titles, the Brené Brown
embed loads (youtube-nocookie/iCvmsMzlF7o, confirmed not restricted), the Section 8
assignment form loads with textarea and word counter, and the dashboard grid shows
Module 2 beside Module 0 and Module 1.

Ingestion integrity: body_blocks had to be appended in 21 chunks because the SQL
transport rejected payloads above ~3KB. Verified afterwards by md5 of the jsonb
canonical form against the locally transformed file — exact match, 181/181 distinct
block ids.

knowledge_documents sources used (read-only, unmodified):
- 18c8d987 Leadership Character — Charisma vs Character, Leader Preparation (all 6 chapters, now fully spent)
- b105f64c Never Give Up — Perseverance, Resilience and Personal Transformation (now fully spent)
- 265a1995 / fcc7de5d FIRE Bible Institute — Spiritual Leadership Curriculum + Syllabus
- e4dbc9b1 Leadership Development 2.0 — Trust, Integrity, Teamwork and Conflict
Plus external web-verified citations (Maxwell, Covey, Kouzes & Posner, US Army ADP 6-22,
Munroe, Brown) — see MODULE_2_FINAL.md for the full provenance tracker.

Pending assets, shipped visible as placeholder callouts, not faked:
- 2 videos pending recording (module intro; Section 5 "Before We Go Further")
- 6 images pending generation (Sections 1, 3, 4, 5, 6, 8)

Not done, awaiting decision:
- plan_data week link. Week 1 -> Module 1 was already linked (5.2e complete). Weeks 2-12
  are open, but Week 2's AI-generated theme is "Confronting the Legacy You Are Currently
  Building" / focus Multiplication & Impact, which does not match a character module.
  Week 8 ("Turning Self-Awareness Into Consistent Leadership Practice", focus Personal
  Leadership) is the better thematic fit. Not written either way.

## 2026-09-08 — Module 3 "Emotional Intelligence: The Leader's Inner Edge"

Live at app.equip2lead.coach. Data-only ship — no code change, no deploy.

lesson_modules id ee5f6ddf-7cc8-4855-9b7b-af4b11600e9c,
slug emotional-intelligence-the-leader-s-inner-edge.
115 blocks, 8 sections, module_number 3, sort_order 3, is_starting_point false.
Pillar: Personal Leadership. Difficulty: beginner. Duration: 80 min.

Blocks: paragraph 41, callout 27, heading 19, divider 11, reflection_questions 7,
table 5, pull_quote_card 2, video_embed 2, assignment_prompt 1 (assignment_key a1,
4 prompts, 200-600 words).

Sections: 1 What Is Emotional Intelligence · 2 Self-Awareness · 3 Self-Regulation ·
4 Motivation · 5 Empathy · 6 Social Skills · 7 The Six Leadership Styles ·
8 EQ Is Learnable (assignment).

Videos, both verified embeddable and confirmed rendering in production:
- 1Evwgu369Jw — "Brené Brown on Empathy", RSA Shorts (Section 5)
- r3wyCxHtGd0 — "Daniel Goleman: Why Aren't We All Good Samaritans?", TED (Section 5)

Verified in production: all 8 sections render with titles matching the authored
JSON exactly, both video embeds load with real thumbnails, the Section 8 assignment
form loads with textarea/word counter/toolbar, and the dashboard grid shows Module 3
alongside Modules 0, 1 and 2.

Ingestion integrity: body_blocks appended in 16 guarded chunks (SQL transport
rejects payloads above ~3KB), then verified by md5 of the jsonb canonical form
against the locally transformed file — exact match, 115/115 distinct block ids.

Pending assets, shipped visible as placeholder callouts, not faked:
- 2 videos pending recording (module intro; Section 3 self-regulation)
- 4 images pending generation (Sections 1, 3, 5, 8)
- 1 mood_checkin interactive block, Section 2 — NOT BUILT. Currently a callout
  placeholder. Spec in MOOD_CHECKIN_SPEC.md. Investigation done (see below);
  implementation deferred to a follow-up PR.

mood_checkin investigation (per spec's "check before building anything new"):
The existing Check-in nav item points at /weekly-checkin, backed by the
weekly_checkins table, which does have a mood column — but it is a different
kind of check-in. Its enum checkin_mood is a 5-point valence scale
{struggling, flat, okay, good, on_fire}, keyed one row per (journey_id,
week_number). The spec's mood_checkin is six qualitative states
(Steady/Stretched/Frustrated/Numb/Hopeful/Overwhelmed) that do not map onto a
valence scale, is momentary rather than weekly, and is section-scoped. Reusing
weekly_checkins would corrupt weekly progress data and flatten the vocabulary.
Recommendation: keep separate, and per the spec's own guidance store nothing —
which means no table and no migration, just a client-side component.

Shipped deliberately unlinked. Decision 2026-09-09: no plan_data week link for
Module 3, and Module 2 stays in Week 8. Only weeks 1/8/12 carry the Personal
Leadership tag in this journey; Week 12 is terminal synthesis (never fresh
content) and Week 2 renders before Week 8, so Module 3's own "assumes you've
already done the character work" line would point at content not yet reached.
Standing rule adopted for all future linking: a week is eligible only if its
focus tag matches the module's pillar AND it is neither the journey's first nor
last week; fill eligible weeks in ascending module -> ascending week order; if
none is eligible, ship unlinked.

Confirmed the same day that unlinked does not mean invisible: the dashboard grid,
the /lessons list, the module overview and the section page all query
lesson_modules by track_id + is_published, and none of them read plan_data.
pickNextStep() likewise works from the modules array alone. A week link only
drives the weekly "Week N of 12" card.

Pre-existing bug found during the mood_checkin investigation, NOT fixed here
(out of scope, flagged only): app/weekly-checkin/page.tsx:155 sends
moodLabels = ['struggling','low','stable','growing','on_fire'], but the
checkin_mood enum is {struggling,flat,okay,good,on_fire}. Three of the five
options ('low','stable','growing') are not valid enum values, so those upserts
fail. The result is not checked, and the journey week is incremented immediately
afterwards regardless — so a user picking any of the middle three moods would
silently lose their check-in while the week still advances. weekly_checkins is
currently empty (0 rows), so this has never fired in production yet.

Perf debt now due, not fixed here: /lessons still pulls full body_blocks for every
published module to derive section counts. At four modules that is ~196KB per load
(25.3 + 92.0 + 45.6 + 33.5 KB) and the page is visibly degraded — multi-second
spinner, and two 45s CDP evaluation timeouts plus one error frame while verifying.
The note added 2026-09-05 set the trigger at ~5 modules; on this evidence it is
worth acting at 4. See docs/perf-debt.md.

## 2026-09-09 — Video placeholders filled across Modules 0-3 (TEMPORARY / DEMO)

Data-only. Nine `callout` placeholders replaced with real `video_embed` blocks so
the application can be reviewed end to end. **None of these are final creative
decisions.** Two categories, both provisional:

**Personal placeholders (5)** — all point at one existing Denis video as a
stand-in until per-section recordings exist. Title carries the caveat inline:
"… — temporary placeholder video, real per-section recordings to follow".

| Module | idx | was | now |
|---|---|---|---|
| 0 | 2   | b_6e4bf2200cd4 callout | b_37b2779eaf3d b8B5T7qoovM |
| 1 | 8   | b_3154fdd1456f callout | b_c700fceaa0ad b8B5T7qoovM |
| 1 | 226 | b_8e5c710eccef callout | b_22be40f5dc91 b8B5T7qoovM |
| 2 | 78  | b_98d503c27fbd callout | b_26670d9c5c7b b8B5T7qoovM |
| 3 | 40  | b_4e487b971e6a callout | b_548f7adcd367 b8B5T7qoovM |

**External embeds (4), Module 1 only** — third-party talks chosen to fill the
slot, NOT vetted as the final pick for each section. Every one matches an option
the original placeholder text itself named, so they are plausible stand-ins
rather than arbitrary:

| idx | was | now | placeholder had asked for |
|---|---|---|---|
| 57  | b_9e5ca1afa8f0 | b_78373b42f23f lmyZMtPVodo — Simon Sinek, TED | "Groeschel OR Sinek 'Why Good Leaders Make You Feel Safe'" |
| 128 | b_8af36deb7d6c | b_f17167aee9d9 b5RlVhaT-DA — Craig Groeschel | "Sinek 'Millennial Question' OR Groeschel on self-leadership" |
| 284 | b_5e44a0fca156 | b_498cfc91dc0a iCvmsMzlF7o — Brené Brown, TED | "Brené Brown TED 'The Power of Vulnerability'" |
| 390 | b_24b047c6c3e5 | b_558bbfeabce0 pD0c1PWWgPg — John Maxwell | "morning routines from a respected leader (John Maxwell, …)" |

Block ids change because the id is sha256(slug|index|type) and the type moved
from callout to video_embed. Hash reproduction was checked against all nine
live ids before writing: every recomputed old id matched production exactly.

Embeddability verified before going live (oEmbed 200 + youtube-nocookie 200 +
no restriction markers), with author and title confirmed on each:
lmyZMtPVodo TED · b5RlVhaT-DA Craig Groeschel · pD0c1PWWgPg Maxwell Leadership.
iCvmsMzlF7o and b8B5T7qoovM were already verified and live.

Patched, not re-ingested — nine single-block jsonb_set writes, each guarded on
the old block id. Counts and uniqueness intact afterwards: M0 123/123,
M1 489/489, M2 181/181, M3 115/115, and zero VIDEO PLACEHOLDER text remaining
anywhere. All nine confirmed rendering in production.

Still outstanding after this pass: 21 image placeholders (M0 5, M1 6, M2 6,
M3 4) and the single mood_checkin interactive block in M3 Section 2.

## 2026-09-09 — Module 1 Section 4 condensed into a doorway to Module 3

Data-only. Module 1's EQ section predated Module 3 and duplicated it: it taught
all five Goleman domains in full, the Fruit-of-the-Spirit convergence, EQ Is
Learnable, and carried its own five-domain scorecard. Module 3 now covers every
one of those in more depth. Section 4 becomes the doorway; Module 3 does the work.

Kept unchanged, idx 224-238: section heading, image placeholder, welcome video,
the Goleman 67% research, the IQ/EQ pull quote, the "brilliant pastors" passage,
"What Emotional Intelligence Actually Is", ending on "Goleman identified five
core domains… Weakness in any one will surface in your leadership".

Replaced idx 239-280 (42 blocks: Domains 1-5, Fruit of the Spirit, EQ Is
Learnable, the scorecard and reflection questions) with a single tip callout
pointing at Module 3 and naming what waits there.

Kept unchanged: the divider, and Section 5 onward.

Module 1: 489 -> 448 blocks, 7 sections unchanged, Section 4 now 3 min (was 6).

Regenerated rather than patched, because removing 42 blocks reshuffles every
index after the edit and block ids are sha256(slug|index|type). Every one of the
448 ids was then recomputed and verified against that formula in the database:
448/448 match, 448 distinct, 0 wrong. This replaces the usual md5-against-a-
fresh-transform check, which is no longer available for Module 1 — production
has legitimately diverged from any source file since the nine video swaps, so
there is nothing left to diff against. Verifying the id invariant directly is
the stronger check anyway: it is exactly what a fresh ingest guarantees.

Scorecards: `goleman_five_domains` (was idx 279) removed, as intended. The other
two survive untouched — `four_pillars_self_leadership` still at idx 220 in
Section 3, `eight_areas_character` moved 437 -> 396 with the shift. Assignment
`a1` moved 475 -> 434. Those keys are independent of block ids, so nothing was
orphaned, and lesson_scorecard_ratings and lesson_assignment_submissions were
both empty in any case.

Backup: the pre-change 489-block array was held in `_m1_s4_backup_20260909`
(md5 e086fd64fc4cc01e088aafc9dd764e19) as the only copy of the 42 removed
blocks. Dropped 2026-09-09 after a visual pass of the rendered section and
Denis's own independent query check. No backup tables remain in the schema.

Visual confirmation: Section 4 renders as "SECTION 4 OF 7 · 3 MIN", ~2,300px
tall. The new block renders correctly as a tip callout — green rule, pale green
fill, lightbulb icon — with its full text untruncated, followed by the divider
and the section footer. No Domain headings, Fruit-of-the-Spirit passage, EQ Is
Learnable block or scorecard remain on the page.

**Current baseline for future comparison (2026-09-09):**

| Module | blocks | sections | videos | scorecards | image placeholders |
|---|---|---|---|---|---|
| 0 | 123 | 5 | 1 | 0 | 5 |
| 1 | 448 | 7 | 7 | 2 | 6 |
| 2 | 181 | 8 | 3 | 0 | 6 |
| 3 | 115 | 8 | 4 | 0 | 4 |

All ids distinct within each module; zero video placeholders remain anywhere.

## 2026-09-09 — Module 3 Five-Domain Self-Audit becomes a real scorecard

Data-only. Module 3's closing self-audit was a `table` block — five domains and
a diagnostic question each, readable but not answerable. It is now a `scorecard`
block using the same mechanism as Module 1's two, so the reader rates each
domain and the answers persist to lesson_scorecard_ratings.

idx 110, `b_6a5b5580dcca` (table) -> `b_61dae82d4ab4` (scorecard).
title "Where Are You Now?", matching Module 1's heading for this mechanism.
scorecard_key `module3_eq_domains`, items self_awareness / self_regulation /
motivation / empathy / social_skills, each out of 10.

Key collision checked before use: only two scorecard keys existed anywhere
(`four_pillars_self_leadership`, `eight_areas_character`), neither of them this.
The item key `self_awareness` is reused from Module 1's Section 3 scorecard,
which is safe because ratings are keyed on (lesson_module_id, scorecard_key,
item_key) — all three, not item_key alone.

**This took two passes, and the log should say so.** The first pass carried over
only key/max/label as specified, which silently dropped the five diagnostic
questions the table had held in its second column. That mattered beyond the loss
itself: the callout immediately after the block reads "Whichever question made
you pause the longest just before answering…", and with the questions gone it
referred to nothing on the page. The second pass restored all five verbatim as
per-item `helpText`. Each was then compared character-for-character against the
pre-change copy — five of five identical in text, length and order, matched to
the correct label. The callout reads correctly again.

Module 3 stays at 115 blocks and 8 sections: one block replaced by one block, so
no index shifted. Verified by the same exhaustive method used for Module 1 —
every id recomputed as sha256(slug|index|type) and compared in the database:
115/115 match, 0 wrong, 115 distinct. Tables in Module 3: 5 -> 4. Section 8 now
reads 4 min, was 5.

Confirmed live and rendering: five sliders scored /10, each with its question
beneath it. Loading the page creates no rating rows — the component saves only
on interaction — so lesson_scorecard_ratings is still empty.

Backup `_m3_scorecard_backup_20260909` (115 blocks, md5
3ef8dbd005fdce6e958ae9c1bea9080d) held the only copy of the five questions
between the two passes, and was the source they were restored from. Dropped
after the visual confirmation. No backup tables remain in the schema.

**Current baseline (2026-09-09, supersedes the table above):**

| Module | blocks | sections | videos | scorecards | tables | image placeholders |
|---|---|---|---|---|---|---|
| 0 | 123 | 5 | 1 | 0 | 1 | 5 |
| 1 | 448 | 7 | 7 | 2 | 1 | 6 |
| 2 | 181 | 8 | 3 | 0 | 6 | 6 |
| 3 | 115 | 8 | 4 | 1 | 4 | 4 |

## 2026-09-10 — Module 1 Section 5 trimmed to a doorway into Module 2

Data-only. Section 5 taught the Enemies of the Heart, GOLD/GIRLS/GLORY and the
Six Ways to Avoid Moral Failure — all of which Module 2 covers at greater depth.
idx 294-344 (51 blocks) replaced with one tip callout pointing there.

Kept untouched: idx 241-293 (heading, image placeholder, video, opening framing,
"Broken Leaders God Used", the Jacob narrative, the Four-Step Process) and
Section 6 onward. That material is thematically adjacent to Module 2 but is
different prose, not duplicate text.

Module 1: 448 -> 398 blocks, 7 sections unchanged, Section 5 now 8 min (was 12).
Verified by exhaustive id recompute: 398/398 match sha256(slug|index|type),
0 wrong, 398 distinct. Two scorecards, seven videos and the assignment all
survive; zero references to GOLD or "Enemies of the Heart" remain in the module.

**The duplication claim needed correcting first.** The brief described the range
as word-for-word identical to Module 2. A text-field comparison put it at 19 of
51 — but that was measuring wrong, because Module 2 holds the GOLD/GIRLS/GLORY
warning signs inside a table's `rows`, which no text-to-text comparison can
match. Comparing text fields and table cells together, with bullet markers
normalised, gives 30 of 51 covered and 21 genuinely absent from Module 2. Those
21 were harvested verbatim before deletion rather than lost, for Denis to fold
into Module 2 where they are stronger than what is there — the pride entry
naming it "the sin of Lucifer" being the clearest example.

**The reflection block needed trimming too, and this is the third instance of
the same pattern today.** idx 345 asked six questions, three of which referred
to material being deleted: the eight Enemies of the Heart, "Gold, Girls, and
Glory", and the six guardrails. Trimmed to Q1/Q2/Q6 — the three that stand on
the kept material — by dropping the other three rather than rewording them.
Same failure mode as the Section 4 callout and the Module 3 scorecard helpText:
removing a block breaks the thing that referenced it one block later, not at the
site of the edit.

BACKUP, still in place: `_m1_s5_backup_20260910` (448 blocks, md5
e851c091e0a409c1dc8b257be985317a) holds the only copy of the 51 removed blocks,
including the 21 harvested lines. Keep until the harvest has been placed into
Module 2, then drop.

**Current baseline (2026-09-10, supersedes earlier tables):**

| Module | blocks | sections | videos | scorecards | tables | image placeholders |
|---|---|---|---|---|---|---|
| 0 | 123 | 5 | 1 | 0 | 1 | 5 |
| 1 | 398 | 7 | 7 | 2 | 1 | 6 |
| 2 | 181 | 8 | 3 | 0 | 6 | 6 |
| 3 | 115 | 8 | 4 | 1 | 4 | 4 |

## 2026-09-10 — One harvested line placed into Module 2 Section 5

Data-only, additive. The closing line from Module 1's deleted Section 5 material
now sits in Module 2, immediately after item 6 of the Six Ways to Avoid Moral
Failure and before the divider and reflection questions:

"These are not signs of weakness. They are signs of wisdom. The strongest
leaders I know have the strictest guardrails — not because they are the most
tempted, but because they know how much would be lost."

Module 2: 181 -> 182 blocks, 8 sections unchanged, Section 5 now 7 min (was 6).
Inserting shifts every index after the insertion point, so all ids were
recomputed and verified: 182/182 match sha256(slug|index|type), 0 wrong, 182
distinct. Three videos and the assignment untouched. Confirmed live and reading
in the right place.

No backup was taken for this one, unlike the destructive edits: a pure insert is
undone by deleting the block it added.

`_m1_s5_backup_20260910` dropped. Of the 21 lines harvested from Module 1's
Section 5, this is the one Denis chose to keep; the other 20 went with the
backup, which is the decision recorded rather than an oversight. No backup
tables remain in the schema.

**Current baseline (2026-09-10):**

| Module | blocks | sections | videos | scorecards | tables | image placeholders |
|---|---|---|---|---|---|---|
| 0 | 123 | 5 | 1 | 0 | 1 | 5 |
| 1 | 398 | 7 | 7 | 2 | 1 | 6 |
| 2 | 182 | 8 | 3 | 0 | 6 | 6 |
| 3 | 115 | 8 | 4 | 1 | 4 | 4 |

## 2026-09-10 — Eleven quiz blocks inserted across Modules 0-3

Data-only, additive. First content for the `quiz` block type shipped earlier
today (type + `Quiz.tsx` + `KNOWN_BLOCK_TYPES` + ingest validation, commits
cac9717 and 7562e3c). Seven `video_check` quizzes sit directly under the video
they ask about; four `module_review` quizzes sit directly above each module's
assignment. 38 questions total, every one with four options, a
`correct_option_id` and an explanation.

| Quiz | Module | Landed at | Sits after / before |
|---|---|---|---|
| VC1 Sinek | 1 | 58 | video `lmyZMtPVodo` |
| VC2 Groeschel | 1 | 130 | video `b5RlVhaT-DA` |
| VC3 Brown | 1 | 246 | video `iCvmsMzlF7o` |
| VC4 Maxwell | 1 | 303 | video `pD0c1PWWgPg` |
| MR2 | 1 | 388 | before assignment (389) |
| VC5 Brown | 2 | 164 | video `iCvmsMzlF7o` |
| MR3 | 2 | 182 | before assignment (183) |
| VC6 RSA Brown | 3 | 60 | video `1Evwgu369Jw` |
| VC7 Goleman | 3 | 69 | video `r3wyCxHtGd0` |
| MR4 | 3 | 116 | before assignment (117) |
| MR1 | 0 | 115 | before assignment (116) |

Positions were resolved by content match at insert time, not from the indices
in the spec — six of the eleven had moved since the spec was written, by as much
as 91 blocks, because of the Section 4 and Section 5 trims earlier today.
Inserts ran in descending order within each module so that a pending position
never shifted under a completed one, and every statement carried a guard on
both `jsonb_array_length` and the target video's id, making a retry a no-op
rather than a double insert.

Blocks: 0: 123 -> 124, 1: 398 -> 403, 2: 182 -> 184, 3: 115 -> 118. Section
counts unchanged everywhere — no level-2 heading was added or removed, and each
quiz landed inside an existing section. Videos, scorecards, tables and image
placeholders all unchanged.

Ids: 11 inserts reshuffled 432 of the 829 blocks, so all four modules were
regenerated and verified exhaustively against
`'b_'||substr(encode(sha256(convert_to(slug||'|'||index||'|'||type,'UTF8')),'hex'),1,12)`:
124/124, 403/403, 184/184, 118/118 match, 0 wrong, and every id distinct within
its module. `assignment_key` (`a1` x4) and the three `scorecard_key` values
survived intact — the rewrite touched only `{id}`.

Validation, run against the live rows rather than the source files: all 11 have
a scope in {video_check, module_review}, 0 questions with a `correct_option_id`
that names no option, 0 with fewer than two options, 0 empty prompts, 0 missing
explanations, 0 duplicate question ids, 0 duplicate option ids.

**Flagged, not fixed — Video Check 4 (Maxwell).** Denis noted this one had a
lighter research pass. The video `pD0c1PWWgPg` is 5,037 seconds — about 84
minutes, not the 5-8 minute talk the original placeholder described — and its
YouTube description is boilerplate promo with no content summary. I cannot watch
video, so I could not check the two questions against what is actually said.
Both are hedged away from specific video claims ("A central theme in Maxwell's
*teaching*...", "According to *this approach to* morning routines..."), so they
hold up even against an 84-minute compilation, but they are not verified.

**Fixed in the same pass — quiz text now counts toward reading time**
(commit `4a33466`). `countWords` in `lib/lessons/split-sections.ts` walked a
block's `questions` array with a string-only handler. That is right for
`reflection_questions` and wrong for `quiz`, whose questions are objects, so a
quiz counted as nothing but its title. It now branches on the entry's shape
rather than the block's type — so it stays right for whichever block type
reuses the key next — and counts prompt, every option and the explanation,
because a reader reads all of it. Malformed entries are ignored rather than
thrown on.

Verified by running the pre-fix and post-fix functions side by side over the
four live modules. Ten of the eleven quiz-bearing sections gained a minute or
two; the eleventh (Module 2 Section 7) was already far enough past a `Math.ceil`
boundary not to move. **No section without a quiz changed by a single minute**,
which is the regression proof that the `reflection_questions` string path is
untouched. Module totals: 0: 17 -> 19, 1: 51 -> 56, 2: 31 -> 33, 3: 24 -> 28
minutes. Section counts unchanged. These are the fallback estimates, used only
where a module has no authored `estimated_duration_minutes`.

Quiz content is real, not placeholder, but was written against the module text
rather than reviewed by Denis question by question.

**Current baseline (2026-09-10):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | image placeholders |
|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 |
| 2 | 184 | 8 | 3 | 0 | 6 | 2 | 6 |
| 3 | 118 | 8 | 4 | 1 | 4 | 3 | 4 |

## 2026-09-10 — Module 2 Section 1 and Module 3 Section 3 deepened

Data-only, from `SECTION1_DEEPENING_PATCH.md`. Six edits: four insertions, two
replacements. Every target was resolved by matching the current text rather than
by the spec's index numbers — both modules had shifted repeatedly today. As it
turned out all six spec indices were still accurate, but that was luck, not
method: the quiz pass earlier had moved six of eleven targets by up to 91 blocks.

**Module 2, Section 1 — "What You Are in the Dark" (19 -> 27 blocks):**

1. New paragraph after the "Character is what you are in the dark" pull quote —
   integrity from Latin *integer*, undivided; the opposite of integrity as
   fragmentation rather than dishonesty.
2. New paragraph after the straw-house paragraph — the third house, sticks.
   Half-built character as a slower version of the same ending.
3. New paragraph after the existing Covey paragraph, which is unchanged — the
   Four Human Endowments (self-awareness, conscience, imagination, independent
   will) as what makes the Character Ethic choosable at all.
4. The one-sentence Army paragraph replaced by five blocks: a rewritten opener
   that puts the doctrine's ordering in the foreground, an h3, a lead-in line, a
   five-row table of the components, and a closing tip on ADP 6-22 defining
   discipline as holding to standard "even in the absence of immediate
   supervision."
5. The Munroe callout replaced by two blocks: a tighter callout carrying his
   actual line ("Let your success be carried by your character") and a new
   paragraph on the alarm-system image — two doors, and the inward one being the
   one that gets breached first.

**Module 3, Section 3 — "Self-Regulation" (20 -> 21 blocks):**

6. New paragraph after the existing Marcus Aurelius intro — the nightly practice,
   *Meditations* as *To Himself*, and the dichotomy-of-control line, framing
   self-regulation as an audit he ran rather than a trait he had.

Module 2: 184 -> 192 blocks, 8 sections unchanged, Section 1 now 7 min (was 4),
module total 33 -> 36 min. Tables 6 -> 7. Module 3: 118 -> 119 blocks, 8 sections
unchanged; Section 3 stays at 4 min — 130 words was not enough to cross a
`Math.ceil` boundary — and the module total stays 28.

Executed in descending index order within Module 2 so no pending position moved
under a completed one, each statement guarded on both `jsonb_array_length` and
the target's own text, and each block built with `jsonb_build_object` rather than
a JSON string literal, so the embedded double quotes in the Army and Munroe
copy needed no escaping. Ids for both modules regenerated and verified
exhaustively: 192/192 and 119/119 match sha256(slug|index|type), 0 wrong, all
distinct. The other two modules were re-checked in the same pass and are also
0 stale. Videos, scorecards, quizzes, assignments and image placeholders
unchanged in both.

**Checked, because this is the failure mode that keeps recurring** — an edit
breaking the block *after* it, not at the edit site. Three back-references were
verified to still resolve: "Gifts are given freely" now follows the etymology
paragraph and starts fresh; the Army opener follows the new Covey paragraph and
needs nothing from it; and Module 3's "His core insight was the same one this
section opened with" still refers to Marcus Aurelius across the inserted
paragraph, which ends on him.

Both issues this pass raised were fixed immediately after — see the entry below.

**Current baseline (2026-09-10):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | image placeholders |
|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 |
| 2 | 192 | 8 | 3 | 0 | 7 | 2 | 6 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 |

## 2026-09-10 — Module 2 Section 1: divider and the "four voices" sentence

Data-only, content-anchored, closing the two issues the deepening pass flagged
rather than carrying them.

1. A bare `divider` inserted between the Army treatment's closing tip callout
   and the Munroe callout. Same pattern the module already uses between
   sub-sections — the back-to-back tip repetition is broken without changing
   either block's type or a word of either.
2. Module 2 idx 21: "A bestselling secular researcher, a
   pastor-turned-leadership-author, and the most rigorously trained organization
   on earth landed on the exact same conclusion, independently of each other."
   replaced with a version that counts four and names the fourth — "Four voices
   from completely different worlds ... a leadership researcher who's already
   spoken in this section, a bestselling secular researcher, a
   pastor-turned-leadership-author, and the most rigorously trained institution
   on earth." The paragraph's opening sentence is untouched; the swap was done
   with a SQL `replace()` on the old sentence so the rest stayed verbatim rather
   than being retyped.

Module 2: 192 -> 193 blocks, 8 sections unchanged, Section 1 now 28 blocks
(was 27), still 7 min — a divider carries no words. Dividers 15 -> 16. Ids
regenerated and verified exhaustively: 193/193 match sha256(slug|index|type),
0 wrong, 193 distinct; the other three modules re-checked in the same pass and
also 0 stale.

3. Follow-up in the same session, closing the ordering note this entry
   originally carried: the list was reordered from Maxwell, Covey, Munroe, Army
   to Maxwell, Covey, Army, Munroe so it tracks the order the section actually
   presents them, rather than grouping people before institution. Same
   `replace()` method, tail only. No block was added, removed or retyped, so no
   index moved and every id stayed valid without a recompute — `b_cc28e94b6734`
   at idx 21 before and after. Re-verified anyway: 193/193 match, 0 wrong.

   Denis's instruction wrote the new tail with `and` before both the third and
   fourth items. Shipped with the single serial `and` a four-item list takes —
   "a bestselling secular researcher, the most rigorously trained institution on
   earth, and a pastor-turned-leadership-author" — since the reordering, not the
   double conjunction, was plainly the intent.

**Current baseline (2026-09-10):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | image placeholders |
|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 |

## 2026-09-10 — Video Check 4 video swapped

Data-only, field-level. Module 1 idx 302's `video_embed` moves from
`pD0c1PWWgPg` ("My Morning Routine for Mindfulness & Growth") to `nKpQOc-9urs`
("Success is Inevitable When You Spend Your Day Doing These 5 Things Everyday! |
John Maxwell"), title updated to match. Denis confirmed length and content on
his end; this closes the flag raised when the quiz content shipped, where the
old pick turned out to be an 84-minute compilation rather than the 5-8 minute
talk the placeholder described.

The Video Check 4 quiz at idx 303 is unchanged. Both its questions were written
hedged to generic Maxwell themes rather than to specific moments, which is what
makes them survive the swap — the hedging was a mitigation for an unverifiable
video and turns out to have been the right call for a different reason.

Embeddability: YouTube oEmbed returns 200 with title and author
("Maxwell Leadership") matching, so the video is public and embeddable. Runtime
could NOT be re-derived — the nocookie embed page no longer inlines the player
config that yielded `lengthSeconds` for the old pick earlier today, so length
rests on Denis's confirmation rather than on a check of mine.

Two `jsonb_set` calls on `{302,youtubeId}` and `{302,title}`, guarded on array
length, the old video id and the quiz sitting at 303. No block added, removed or
retyped, so no index moved and no id recompute was needed — idx 302 stays
`b_a86b77df72db`. Verified with the exhaustive check anyway: 403/403 match
sha256(slug|index|type), 0 wrong, 403 distinct, and the other three modules 0
stale in the same pass. `pD0c1PWWgPg` now appears nowhere in any module.

**Current baseline (2026-09-10):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | image placeholders |
|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 |

## 2026-09-14 — Module 4 "Vision & Strategic Direction" ingested

126 blocks, 9 sections, 7 blocks of front matter. Row
`d1471ffe-4966-40dd-b192-a9356ed2d0df`, slug `vision-strategic-direction`,
module_number 4, sort_order 4, difficulty `beginner`,
estimated_duration_minutes 85, is_starting_point false, leadership track.

**Input shape differed from Modules 2 and 3.** `module4_leadership.json` nests
its blocks under `sections[].blocks` rather than one flat `blocks` array, so it
could not be fed to `scripts/ingest-module.mjs` directly. Rather than loosen the
ingest script, a scratchpad adapter concatenated the nine sections in order and
built the `new_row_data` envelope; the real script then ran unmodified and did
all the validation. Concatenation is lossless here because each section already
carries its own H2 as its first block. Result: 126 in / 126 out, 126 distinct
ids, no problems, assignment key `a1`, all 27 callout variants legal.

**Section count verified against the real splitter, not the authored structure.**
Denis's own simulation said 9 sections; `splitBlocksBySection` agrees, and all
nine titles match character-for-character. The first group — module title H2,
byline, welcome video, three info callouts, divider — becomes front matter, the
same shape Modules 0-3 have. The assignment sits inside "Closing & Assignment"
rather than splitting off, because that section has its own H2.

**Content verified against the ingest output after loading.** The row was
created empty and filled with 18 appends, each guarded on
`jsonb_array_length` so a retry is a no-op. Live vs. ingest output:
`md5` of every block's type+text is identical (`b7c2c18a…`), as are separate
hashes of all 17 table rows, all 10 reflection questions and all 4 assignment
prompts. Ids: 126/126 match sha256(slug|index|type), 0 wrong, 126 distinct.
2 videos, 4 tables, 3 image placeholders, 1 assignment.

**Videos verified (STEP 2).** Both are Denis's own, sourced from
denisekobena.com/podcast, and both were still put through the standard check:

| id | oEmbed | author | title returned |
|---|---|---|---|
| `nxTedtvYfFM` | 200 | Denis Ekobena | The Power of Vision 1 - Denis Ekobena |
| `UN4G3ZIkohY` | 200 | Denis Ekobena | The Power of Vision 2 - Denis Ekobena |

`youtube-nocookie.com/embed/<id>` returns 200 for both. A deliberately invalid
id returns 400 on the same endpoint, so a 200 is a real signal rather than a
blanket response. YouTube renders the separator as a hyphen where the module
uses a pipe; the module's own title text is what displays, so no change made.

Reading-time estimate from the splitter is 28 minutes against the authored 85.
That gap is normal here and not a defect — Modules 1-3 run 56/120, 36/90 and
28/80 — because `countWords` measures prose only, while the authored figure
includes reflection and assignment work. `estimated_duration_minutes` is what
the UI shows whenever it is set.

**Pending, not blocking:** 3 image placeholders (specs in the source file), and
two further videos from the same "Power of Vision" series for Sections 4 and 7
once links are available.

**Published 2026-09-14** after verification, with a slug-scoped, block-count-
guarded, `is_published = false` idempotent UPDATE returning its row. Verified
live through the app's own code paths afterwards, reading as an ordinary
signed-out client rather than through SQL: all 126 blocks compare identical to
the ingest output block by block, ids 126/126, the splitter gives 9 sections
with correct titles and headingIds, routes `/1`-`/9` resolve and `/10` does not,
and every one of the nine block types Module 4 uses has a `case` in
`BlockRenderer` — the check that matters, since the renderer returns `null` for
an unhandled type in production rather than erroring.

Dashboard grid, queried with the same filter and ordering `lib/dashboard/data.ts`
uses, returns five modules with Module 4 last:

| | duration | sections | blocks | pillar |
|---|---|---|---|---|
| M0 Starting Point | 45 | 5 | 124 | Personal Leadership |
| M1 The Leader Within | 120 | 7 | 403 | Personal Leadership |
| M2 Character in the Dark | 90 | 8 | 193 | Personal Leadership |
| M3 Emotional Intelligence | 80 | 8 | 119 | Personal Leadership |
| M4 Vision & Strategic Direction | 85 | 9 | 126 | Directional Leadership |

Module 4 is the first module on a pillar other than Personal Leadership, so it
is also the first to add a second option to the pillar filter on `/lessons`.

Assignment form inputs present and well-formed: `assignment_key` a1, word range
200-600, four prompts each carrying number, heading and guidance, the first with
an example. Welcome video `nxTedtvYfFM` sits in front matter — so it appears on
the module preview screen and nowhere else, matching Modules 0-3 — and
`UN4G3ZIkohY` sits inside Section 1.

## 2026-09-14 — Week 8 linked to Module 2, and why it was missing

`coaching_plans` row `2747cf17-9c4c-44e6-9e5e-ba4b4f31059d`, journey
`900e6eeb-…`, week index 7: `module_id` added, pointing at Module 2
(`8fb09718-…`). Linked weeks in that plan 1 -> 2.

**The link had never been written.** It looked like a silent revert and was not
one. Three independent lines of evidence:

1. This log's own Module 2 entry (2026-09-08) lists the week link under "Not
   done, awaiting decision" — "Week 8 … is the better thematic fit. **Not
   written either way.**"
2. `coaching_plans` carries `set_plans_updated_at`, a `BEFORE UPDATE … FOR EACH
   ROW` trigger running `NEW.updated_at = NOW()` unconditionally, so any
   successful write bumps the column. Before this edit it read
   **2026-09-06 07:44:53** — two days *before* the Module 2 ingestion. Nothing
   had written to the row since.
3. That timestamp rules out every silent-revert mechanism at once: a plan
   regeneration, a migration, an RLS reset or a later overwrite would each have
   been an UPDATE and each would have moved `updated_at`.

The edit itself then bumped `updated_at` to 2026-09-14 07:27:55, confirming the
trigger behaves as the evidence assumed.

**What made it look linked:** the Module 3 entry the next day reads "Module 2
stays in Week 8", which describes the *proposal* being left standing while
Module 3 was refused a link, but reads as though a link existed. That sentence
is the source of the error, and it propagated for six days.

The write touched one key. `week`, `focus`, `desc_en`, `desc_fr`, `title_en`,
`title_fr` and all three `exercises` are byte-identical, because `jsonb_set` was
pointed at `{weeks,7,module_id}` rather than at the object. Guards: row id, 12
weeks, `weeks->7->>'week' = '8'`, and `not (… ? 'module_id')` so a re-run is a
no-op instead of a silent overwrite.

Journey state is now mixed by design, not by accident: Week 1 -> Module 1,
Week 8 -> Module 2, Modules 3 and 4 unlinked because no eligible week exists for
either. Module 4's case is the cleanest the standing rule has seen — its pillar
is Directional Leadership and **no week in any plan_data row anywhere carries
that focus**, so there was nothing to choose between.

**Current baseline (2026-09-14):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | image placeholders | week link |
|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | — |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | Week 1 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | Week 8 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | unlinked |
| 4 | 126 | 9 | 2 | 0 | 4 | 0 | 3 | unlinked |

## 2026-09-14 — Module 0's five image placeholders replaced with real images

Five `callout` placeholders become five `image` blocks. Module 0 is the first
module with real artwork; Modules 1-4 still carry 6/6/4/3 placeholders between
them.

**Schema already existed.** `ImageBlock` — `{ type: 'image', url, alt, caption? }`
— was defined in `lib/lesson-blocks.ts` and handled by `BlockRenderer` (renders a
`<figure>` with a lazy `<img>` and an optional `<figcaption>`), it had simply
never been used. The `[IMAGE PLACEHOLDER]` callout was always a stand-in for this
type, not a convention in its own right, so nothing new was added.

**Assets.** `/public/images/module-0/`, 11MB across five PNGs, served as static
files. No Supabase Storage bucket exists in this project and a static path under
`/public` is the plain Next.js answer. Named for what they show
(`threshold-door`, `tree-roots-fruit`, `five-pillars`, `bread-rising`,
`journal-morning`) rather than by position, so reordering a section cannot strand
a file called `M0-3`.

The files arrived in `/public` as `M0-1.png` … `M0-5.png`, not in the
`images/` folder the brief named. Each was opened and matched against its
description by content rather than by filename — the order happened to line up,
but that was confirmed, not assumed.

| Section | Placeholder replaced | File |
|---|---|---|
| 1 — Why You're Here | threshold of an open door | `threshold-door.png` |
| 2 — Know → Be → Do | tree with roots, trunk and fruit | `tree-roots-fruit.png` |
| 3 — The Five Pillars | five stone pillars supporting a temple | `five-pillars.png` |
| 4 — The Slow-Cooker Principle | bread rising in a bowl | `bread-rising.png` |
| 5 — Your First Assignment | open notebook with a pen | `journal-morning.png` |

Matched on placeholder text, not index. Each `alt` describes what is actually in
the frame, including the words visible in it, rather than repeating the
placeholder's art direction — a reader on a screen reader should get the image,
not the brief.

Module 0 stays at 124 blocks and 5 sections: five blocks replaced one for one.
Changing a block's `type` changes its id, so ids were regenerated and verified
exhaustively — 124/124 match sha256(slug|index|type), 0 wrong, 124 distinct.
Callouts 21 -> 16, images 0 -> 5, image placeholders 5 -> 0. The other four
modules were re-checked in the same pass and are also 0 stale.

Verified live after deploy, not just as files: all five return HTTP 200 with
`content-type: image/png` and byte counts identical to the local files, and on
each of the five section pages the `<img>` reports `complete=true` with a decoded
`naturalWidth` of 1672 inside a `<figure>` — a 404 would decode to 0x0 and still
report a tag in the HTML.

**Known and accepted, not a defect:** these are photorealistic and bake English
text into the artwork ("LEARN GROW LEAD MAKE A DIFFERENCE", the carved pillar
labels, "DISCIPLINE CREATES FREEDOM"), which is not the flat, text-free editorial
convention Modules 2-4's placeholders specify. Denis chose this deliberately. The
one real consequence is that baked-in English cannot follow a `lang === 'fr'`
switch; parked for a French-localization revisit.

**Current baseline (2026-09-14):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image placeholders |
|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 0 | 6 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 0 | 6 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 0 | 4 |
| 4 | 126 | 9 | 2 | 0 | 4 | 0 | 0 | 3 |

## 2026-09-14 — Modules 2, 3 and 4 image placeholders replaced with real images

Thirteen `callout` placeholders become thirteen `image` blocks: 6 in Module 2,
4 in Module 3, 3 in Module 4. With Module 0 done earlier today, **only Module 1
still carries placeholders** (6 of them), and its six files are already sitting
in `/public` as `M1-1.png` … `M1-6.png`, unclaimed.

**Module 4's images were present after all.** The brief said to check and stop if
absent; `M4-1..3.png` were in `/public`, matching its three placeholders, so it
went ahead with the other two.

All thirteen were opened and matched against their placeholder's own `Content:`
description rather than trusted by filename. They did line up in numeric order,
but that was confirmed, not assumed — and it is worth noting the placeholders
specify "flat editorial illustration" while several of the delivered files are
photorealistic with baked-in English text, the same accepted departure recorded
for Module 0.

| Module | Placeholder | File |
|---|---|---|
| 2 | iceberg, charisma above / character below | `iceberg-charisma-character.png` |
| 2 | hourglass, crown above / staff below | `hourglass-david-moses.png` |
| 2 | five figures with mended vessels | `mended-vessels.png` |
| 2 | three doors GOLD / GIRLS / GLORY | `three-doors.png` |
| 2 | seven pride icons | `seven-faces-of-pride.png` |
| 2 | eagle above a stormy sea | `eagle-above-storm.png` |
| 3 | doorway onto a room, one figure apart | `competence-doorway.png` |
| 3 | the gap between two clock hands | `the-pause.png` |
| 3 | interlocking hands in a circle | `ubuntu-circle.png` |
| 3 | fruit tree with roots below the soil | `fruit-tree-roots.png` |
| 4 | sculptor's hand against marble | `sculptor-marble.png` |
| 4 | eight-step staircase, icons only | `eight-step-staircase.png` |
| 4 | balloon with seven small punctures | `balloon-seven-leaks.png` |

Each `alt` describes what is actually in the frame, including every word visible
in the artwork — the iceberg's sixteen labelled traits, the GOLD/GIRLS/GLORY door
signs, "I am because we are", Matthew 7:17. A reader on a screen reader gets the
image, not the art brief.

**Ordering fixed from the Module 0 pass.** Assets were committed, pushed and
confirmed live — all thirteen returning HTTP 200, `image/png`, byte counts
identical to the local files — *before* a single block was changed. Module 0's
swap went database-first and production briefly served image blocks whose files
404'd. There was no such window this time.

Block counts unchanged: Module 2 stays 193, Module 3 stays 119, Module 4 stays
126, each a one-for-one replacement. Section counts unchanged. Changing a block's
`type` changes its id, so all three were regenerated and verified exhaustively —
193/193, 119/119 and 126/126 match sha256(slug|index|type), 0 wrong, all distinct.
Modules 0 and 1 re-checked in the same pass, also 0 stale. Zero malformed image
blocks (every one has both `url` and `alt`), zero placeholders left in the three.

Live render confirmed per image, not per file: each `<img>` was loaded in the
browser and reported a decoded `naturalWidth` — 1672x941, 2172x724, 1942x809 or
2243x701 depending on the source aspect. A 404 decodes to 0x0 while still
appearing in the HTML, so the tag alone proves nothing.

**Current baseline (2026-09-14):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image placeholders |
|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 0 | 6 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 |
| 4 | 126 | 9 | 2 | 0 | 4 | 0 | 3 | 0 |

## 2026-09-14 — Module 1 images, and the last placeholder on the track

Six `callout` placeholders become six `image` blocks. **This closes image
placeholders across the whole Leadership track: 0 remain in any of Modules 0-4.**

| Section | Placeholder | File |
|---|---|---|
| 2 — Who Am I? | mirror in soft morning light | `mirror-self-reflection.png` |
| 3 — Four Pillars | four stone pillars | `four-pillars.png` |
| 4 — EQ doorway | still lake at sunrise | `still-lake-sunrise.png` |
| 5 — Facing weaknesses | Jacob wrestling the angel, bronze | `jacob-wrestling-angel.png` |
| 6 — Daily rhythm | morning routine: coffee, Bible, journal | `morning-routine.png` |
| 7 — Assignment | open leather journal, fountain pen | `leather-journal.png` |

The placeholder at idx 244 offered a choice — "a bronze sculpture of Jacob
wrestling with the angel, OR a strong tree with visible scars where it has
healed". The delivered file is the sculpture, so that is what the alt text
describes; the alternative was not silently carried over.

All six were opened and matched against the placeholder's own wording. Alt text
records every word visible in the frame, and in this module that is a lot of
words — the desk scenes carry book spines (KNOW YOURSELF, GROW DAILY, LEAD WITH
PURPOSE, HOLY BIBLE, GRATITUDE JOURNAL, A BETTER LEADER), mugs (PRAY READ REFLECT
GROW, GOOD IDEAS BUILD GREAT TOMORROWS), framed cards and full handwritten lists.
A screen-reader user gets the scene, not a one-line summary of it.

Module 1 stays at 403 blocks and 7 sections — six one-for-one replacements. Ids
regenerated and verified: 403/403 match sha256(slug|index|type), 0 wrong, 403
distinct. Assets were pushed and confirmed live (HTTP 200, `image/png`, byte
counts identical to local) before any block changed, so there was no window where
the database referenced files that did not exist.

**Track-wide check, run across every block type rather than only callouts:** the
string "IMAGE PLACEHOLDER" now appears **0 times in all five modules**. 24 real
images total, none malformed — every one carries both `url` and `alt`. All five
modules 0 stale ids in the same pass.

**Current baseline (2026-09-14):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image placeholders |
|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 |
| 4 | 126 | 9 | 2 | 0 | 4 | 0 | 3 | 0 |

Remaining known content gaps on the track: none for images. Two further "Power of
Vision" videos for Module 4 Sections 4 and 7 are still pending links, and
Module 1's seven videos remain temporary/demo picks rather than final.

## 2026-09-15 — Module 4's last two videos

Two `video_embed` blocks inserted, closing Module 4's video gaps. Both are
Denis's own, from the same "Power of Vision" series as `nxTedtvYfFM` and
`UN4G3ZIkohY` already live in this module.

| id | title | Section | Landed at |
|---|---|---|---|
| `asktl-pPcUM` | The Power of Vision 6 | 4 — The 8-Step Vision Process | idx 51 |
| `bKYZw2C1ltw` | The Power of Vision 8 | 7 — Seven Vision Killers | idx 94 |

Verified before insert despite the first-party precedent: oEmbed 200 for both,
titles and author ("Denis Ekobena") matching, `youtube-nocookie.com/embed/<id>`
200, and an invalid control id returning 400 so the 200 carries information.

**Placement in Section 4** — after the eighth numbered step *and* after the
"Steps 1-4 are discernment, steps 5-8 are stewardship" callout that closes the
list, immediately before the "Four Questions" h3. Splitting the list from its own
summary callout would have been the obvious mistake; the video now follows the
complete unit and precedes the next sub-topic.

**Placement in Section 7 — the brief's stated anchor did not exist.** It asked
for "after the vision-killers table and before the Kodak case study callout", but
the Kodak case study *opens* the section (h3 at 87, paragraphs 88-89, warning
callout 90) and the table comes after it at 92. What does sit after the table is
a Kodak *callback* — "Look back at the first two rows of that table. That's
Kodak's whole story in two words." Reading the instruction against that block
makes it satisfiable, so the video went after the table and its pull quote and
before the Scripture-anchors callout, leaving the Kodak callback further down
intact. Guards asserted the table, the pull quote and the Scripture callout were
all where expected before the write.

Module 4: 126 -> 128 blocks, 9 sections unchanged, videos 2 -> 4. These are net
insertions rather than placeholder swaps, so every index after each one shifted;
ids regenerated and verified exhaustively — 128/128 match sha256(slug|index|type),
0 wrong, 128 distinct. The other four modules re-checked in the same pass, also
0 stale. No `video_embed` anywhere on the track is missing a `youtubeId`.

Both confirmed rendering live, not merely present in the markup: each is a real
`youtube-nocookie.com/embed/<id>` iframe at 720x405 with the correct caption, and
both load their actual YouTube thumbnails. The Section 4 thumbnail happens to show
the slide "PRAY — Ask God to put the pieces...", which is step 1 of the very list
it sits under — independent confirmation the video matches the section.

**Current baseline (2026-09-15):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image placeholders |
|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 |
| 4 | 128 | 9 | 4 | 0 | 4 | 0 | 3 | 0 |

Remaining known content gap on the track: Module 1's seven videos are still
temporary/demo picks rather than final. Images and Module 4's videos are done.

## 2026-09-15 — Sinek's "Start with Why" added to Module 4 Section 5

`u4ZoJKF_VuA` — "Start with Why: How Great Leaders Inspire Action | Simon Sinek |
TEDxPugetSound" — inserted at idx 66, Section 5 "Modeling the Way & Inspiring a
Shared Vision". Module 4's first third-party video, matching the mix Modules 1
and 3 already use.

Verified before insert: oEmbed 200, author "TEDx Talks",
`youtube-nocookie.com/embed/<id>` 200, and an invalid control id returning 400.

**Placement matched the brief exactly**, unlike the Section 7 insert the day
before. The "Inspiring a Shared Vision" subsection runs h3 (63), paragraph (64)
and the "great leaders are effective communicators of vision" warning callout
(65); the Kelleher case study opens at the h3 "What Modeling the Way Actually
Looks Like" (66). The video went between them, so it closes the subsection on
communicating vision and hands off to the worked example. Confirmed in the
rendered DOM rather than only in the block array: the `<figure>`'s previous
sibling is that warning callout and its next sibling is the Kelleher h3.

Worth noting the talk is a good fit for where it landed — Sinek's argument is
that people follow the why rather than the what, which is precisely what the
paragraph above it says about connecting a vision to what people already care
about.

Not a duplicate: Module 1 carries a different Sinek talk (`lmyZMtPVodo`, "Why
Good Leaders Make You Feel Safe"). A track-wide check confirms `u4ZoJKF_VuA`
appears exactly once.

Module 4: 128 -> 129 blocks, 9 sections unchanged, videos 4 -> 5. A net insertion
shifts every later index, so ids were regenerated and verified exhaustively —
129/129 match sha256(slug|index|type), 0 wrong, 129 distinct. The other four
modules re-checked in the same pass, also 0 stale, and no `video_embed` anywhere
on the track lacks a `youtubeId`.

**Current baseline (2026-09-15):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image placeholders |
|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 |

Remaining known content gap on the track: Module 1's seven videos are still
temporary/demo picks rather than final.

## 2026-09-15 — Module 5 "Levels & Laws" ingested

90 blocks, 8 sections, 7 blocks of front matter. Row
`605512bd-62d3-4b2c-92e0-e87e721c9919`, slug `levels-laws`, module_number 5,
sort_order 5, difficulty `beginner`, estimated_duration_minutes 80, pillar
`directional-leadership`, leadership track, published.

**90 blocks, not the 91 the brief specified, and no videos at all.** Worth
recording plainly, because the source file never changed across three attempts.
`module5_leadership.json` stayed byte-identical throughout — same mtime
(2026-09-15 10:07:42), same md5 `dab96996547a54e0564a1a0415a97cf8`, 32528 bytes
— while successive briefs described a corrected file with the dead video
removed, a `scorecard_key` added, and a second video inserted. None of those
edits reached disk; `generate_module5.js` was checked too and also carries only
the single original `videoEmbed` and no `scorecard_key`.

Two of the three described corrections are unambiguous transcription, so they
were applied to a scratchpad copy rather than bouncing the ingest a third time:

- the dead `aPwXeg8ThWI` video block removed (91 -> 90)
- `scorecard_key: "module5_five_levels"` added to the single scorecard

The third could not be: the T.D. Jakes video `uwZdmnlVNbE` is not in the file and
no brief said which section it belongs to. Module 5 therefore ships with **zero**
`video_embed` blocks. Adding it later is a net insertion, the same operation used
for Module 4's Sections 4, 5 and 7.

**Video verification.** `aPwXeg8ThWI` (Maxwell, "5 Levels of Leadership") is
dead and was re-confirmed dead on the day of ingest: oEmbed 404 on three
consecutive attempts, watch page reporting
`playabilityStatus: {"status":"ERROR","reason":"Video unavailable"}`, against a
known-good control returning 200 and a malformed-id control returning 400. It had
been sourced by convergent citation across four independent sources, which is a
reminder that citations propagate each other's errors. `uwZdmnlVNbE` (T.D. Jakes,
"Stay Steady in Life's Storms") verified clean — oEmbed 200 x3, channel
"TBN: Full Sermons & Teachings" (@TBNFullSermons), playabilityStatus OK, 2270s
(~38 min). Its provenance is stronger than the brief assumed; its length is worth
weighing against sections that run 2-3 minutes each.

**A correction to this log's own earlier entries:** the
`youtube-nocookie.com/embed/<id>` check reported alongside oEmbed in every prior
video entry returns **200 for any well-formed id**, including one invented for the
test. It never carried information. Every earlier verdict was decided by oEmbed
and stands, but that second line was decorative and should not be relied on.

Section counts verified against the real `splitBlocksBySection`, not the
authored structure: 8 sections, all eight titles matching character-for-character,
front matter of 7 blocks (title, byline, video placeholder, three info callouts,
divider). The scorecard lands in §4 "The Pinnacle", the assignment in §8.

Loaded via 12 guarded appends, each asserting `jsonb_array_length` so a retry is
a no-op. Live content verified against the ingest output by md5 of every block's
type and text — `037eab7564046dba6339c264f2abcb85`, identical. Ids: 90/90 match
sha256(slug|index|type), 0 wrong, 90 distinct. `scorecard_key module5_five_levels`
and `assignment_key a1` both present.

Verified live after publish: all eight sections render with correct titles and
"Section N of 8"; the scorecard renders as five working sliders with live values
and the "saves automatically" note; the assignment form renders with all four
prompt headings, its rich-text editor and the 200-600 word target; the dashboard
grid returns six modules with Levels & Laws last.

**Week linking:** pillar `directional-leadership`, and no week in any
`coaching_plans` row carries that focus, so Module 5 **ships unlinked** — the
same clean case as Modules 3 and 4, settled in an earlier pass and unchanged.

**Open on this module:** 2 image placeholders (§2 the two-doors illustration,
§4 the five ascending steps) and 2 **video** placeholders (a 3-4 min intro in
front matter, a 2-3 min closing in §8) — the video placeholders are worth noting
because the brief mentioned only the image ones. Section 1 has no video after the
dead ID was dropped. Section 3 (People Development) has none by design: its real
depth belongs to the future Module 9 (Coaching & Developing) rather than being
squeezed in here.

### Reconciled the same day — the corrected file arrived

The corrected `module5_leadership.json` landed at 14:54:45 (md5
`53fcaa5c110d464ac8d80fa7fa27876c`, 32588 bytes, 91 blocks) after Module 5 was
already published at 90. Rather than drop and re-ingest — which would have
discarded a live row and its id — the corrected file was diffed against the live
row. **Exactly one real difference:** the T.D. Jakes `video_embed` at file index
63. The only other hunk was `assignment_key: "a1"`, which the ingest script
derives rather than reading from source, so it appears on the live side only.
Every other block matched byte-for-byte, which confirms the two reconstructed
corrections had been right.

One guarded `jsonb_insert` at index 63 plus an id recompute brought the row to
91 blocks. The live row's type+text md5 is now `3ec031a91bae91aee77c9c54a2552c17`
— **identical to the corrected source file**, so the published module is the
authored module, not a reconstruction of it. Ids 91/91, 0 wrong, 91 distinct.

Placement is the file's own and reads well: the video sits directly after §5's
**Fear** subsection, and the sermon is titled "...Conquer Fear That Holds You
Back". Verified rendering live — a real `youtube-nocookie.com/embed/uwZdmnlVNbE`
iframe at 720x405 loading its TBN thumbnail, and sections still split 8/8 with
titles unchanged.

Module 5 is therefore 91 blocks with 1 video, not the 90/0 recorded above.

**Current baseline (2026-09-15):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 91 | 8 | 1 | 1 | 1 | 0 | 0 | 2 | 2 |

## 2026-09-15 — Module 5's two images, closing image placeholders track-wide

Two `callout` placeholders become two `image` blocks. **With these, every module
on the Leadership track carries zero image placeholders: 0 in all of 0-5.**

| Section | Placeholder | File |
|---|---|---|
| 2 — Position & Permission | two office doors, one closed, one ajar | `position-permission-doors.png` |
| 4 — The Pinnacle | five ascending stone steps | `ascending-stone-steps.png` |

The brief pointed at `~/Desktop/Equip2lead/images/`, which does not exist — the
files were in `public/images/` as `M5-1.png` and `M5-2.png`, the same mismatch as
the Module 0 pass. Both were opened and matched against the placeholder text
rather than trusted by filename, then renamed for content.

Image 1 carries POSITION and PERMISSION on the door plaques as literal signage.
That is the track's already-accepted departure from the no-baked-in-text
convention, first flagged at Module 0 and parked for the French-localization
pass; it is recorded in the alt text and is not raised again here as a defect.

Module 5 stays at 91 blocks and 8 sections — two one-for-one replacements.
Changing a block's `type` changes its id, so ids were regenerated and verified
exhaustively: 91/91 match sha256(slug|index|type), 0 wrong, 91 distinct, 0
malformed image blocks. The other five modules were re-checked in the same pass
and are also 0 stale. Assets were pushed and confirmed live (HTTP 200,
`image/png`, byte counts identical to local) before any block changed, so no
window existed where the database referenced files that were not yet served.

**A measurement note worth keeping.** The first live check reported
`naturalWidth 0x0` for the doors image, which looks exactly like a 404. It was
not: the `<img>` carries `loading="lazy"`, sat about 700px below the fold, and
the `window.scrollTo` used to bring it into view does not move this layout's
actual scroll container. Forcing the load returned 1672x941 immediately. The
lesson for future passes is that `naturalWidth` is only evidence once the image
is genuinely in view — otherwise a correct lazy-loaded image and a broken one
report the same number.

**Still open on Module 5:** the 2 video placeholders only — a 3-4 min intro in
front matter and a 2-3 min closing in §8, both pending Denis's own recordings.
Section 1 has no video after the dead Maxwell ID was dropped; Section 3 has none
by design, its depth belonging to the future Module 9.

**Current baseline (2026-09-15):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 91 | 8 | 1 | 1 | 1 | 0 | 2 | 0 | 2 |

## 2026-09-15 — Module 5 reconciled again: 91 -> 103 blocks

`module5_leadership.json` regenerated at 16:09:41 (md5
`ce8dcab84e656b44708bad02b2de34c4`, 39690 bytes, 103 blocks). Diffed against the
live row rather than re-ingested, same reasoning as the previous reconciliation.

**12 new blocks across 7 insertion points**, applied in descending index order so
no pending position moved under a completed one, each guarded on
`jsonb_array_length` plus the anchor block's own type and text:

| Live idx | Added | Where it lands |
|---|---|---|
| 15 | Drew Dudley video + framing paragraph | §1, after the French & Raven convergence callout |
| 38 | Ryan Gottfredson video + framing paragraph | §3, after the Level 4 practical-shift paragraph |
| 50 | Frances Hesselbein paragraph | §4, under The Rule of Five |
| 54 | 2 paragraphs on dormant capacity | §5 opening |
| 74 | Ursula Burns paragraph | §6, closing the Law of Process |
| 76 | Indra Nooyi paragraph | §6, closing the Law of Sacrifice |
| 83 | 3 paragraphs: a second "two leaders" illustration, Howard Schultz, Brian Chesky | §7 |

The brief predicted 8 named additions; the actual diff carried 12 blocks. Three
beyond the list: the two dormant-capacity paragraphs opening §5, and a second
"two leaders" illustration in §7 alongside Schultz and Chesky. The brief had
flagged that possibility and asked for the real diff to be trusted over the
estimate, which is what happened.

**One regression refused.** The regenerated file still carries the two
`[IMAGE PLACEHOLDER]` callouts in §2 and §4 — its generator predates this
morning's image swap. Applying the file wholesale would have reverted both real
images to placeholders. The diff was therefore filtered: new blocks applied,
image placeholders on the file side dropped, and the live `image` blocks kept.
An assertion in the diff script confirmed nothing else was being discarded from
the live side. The Hesselbein paragraph, which the file places immediately before
the §4 image, was inserted ahead of the surviving image rather than replacing it.

**Videos verified before insert**, both previously unchecked here: `uAy6EawKKME`
oEmbed 200, author TED-Ed, "Everyday leadership - Drew Dudley"; `Rth6apF1mng`
oEmbed 200, author TEDx Talks, matching title. Malformed-id control returned 400
in the same run.

`scorecard_key` in the regenerated source is `module5_five_levels` — identical to
what was patched in on the earlier round, so no conflict and no second fix.

Module 5: 91 -> 103 blocks, 8 sections unchanged, videos 1 -> 3, images 2,
0 image placeholders, 2 video placeholders. Ids regenerated and verified:
103/103 match sha256(slug|index|type), 0 wrong, 103 distinct.

**Content equivalence checked against the file, allowing for the deliberate
divergence.** A raw md5 could not match, because live intentionally holds two
`image` blocks where the file holds two placeholders. Substituting the live image
blocks into the file at those two positions gives
`99021ccf2e92579288697cc0f1f0a862` — identical to live — and a field-by-field
comparison across all 103 blocks reports zero structural differences.

Verified live: all 8 sections render with correct titles and "Section N of 8";
both new videos are real `youtube-nocookie` iframes at 720x405 loading their
TED-Ed and TEDx thumbnails, each in its specified position; both images still
render; sidebar reading times updated to reflect the new content (§1 and §5 now
3 min, §7 now 4 min).

**Current baseline (2026-09-15):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 124 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 103 | 8 | 3 | 1 | 1 | 0 | 2 | 0 | 2 |

**Standing risk worth naming:** `generate_module5.js` does not know about edits
made directly to the database — the image swap was invisible to it, and would
have been reverted by a wholesale re-ingest. Any future regeneration needs the
same diff-and-filter treatment, or the generator needs the image blocks folded
back into it.

## 2026-09-16 — Module 5's images folded back into the generator

`generate_module5.js` was still emitting `[IMAGE PLACEHOLDER]` callouts for the
two images that went live on 15 September, which is what forced the previous
reconciliation to be a filtered diff rather than a straight apply. The generator
now produces the images themselves.

The `image()` helper became conditional rather than being replaced outright:

```js
const image = (spec) =>
  spec.url
    ? { type: "image", data: { url: spec.url, alt: spec.alt } }
    : imagePlaceholder(`${spec.type}. Content: ${spec.content} Dimensions: …`);
```

Passing `{ url, alt }` emits a real `image` block; passing the older
`{ type, content, width, height }` art-direction spec still emits a placeholder
callout. That matters because other modules' generators use the same shape for
art that genuinely has not been produced yet — narrowing the helper to images
only would have broken them.

The two call sites in §2 and §4 now carry the live URLs and the live alt text
verbatim, including the POSITION and PERMISSION plaque wording.

**Verified by regenerating rather than by reading the edit.** A fresh
`node generate_module5.js` reports `Pending images: 0` (was 2) and its 103 blocks
diff against the live row with **zero differences, field for field** — not just
matching type and text, but every key on every block. Both `type+text` md5s are
`99021ccf2e92579288697cc0f1f0a862`. The regenerated file contains 2 `image`
blocks and 0 image placeholders.

No database write was involved: the live row already held the correct content,
and this only brings the generator into line with it. `module5_leadership.json`
was regenerated as a side effect, moving to md5
`b7e1e13b421bd583103e0a7a049da102` — the first time that file has been a complete
match for production.

**The generator is still not in this repository.** It lives at
`~/Downloads/generate_module5.js`, untracked, which is precisely the condition
that let it drift out of sync with the database twice in one day. This entry
records the fix; it does not make the fix durable. Tracking the generators
alongside the content they produce would.

## 2026-09-16 — All four module generators tracked and reconciled

`generate_module2.js` through `generate_module5.js` now live at
`scripts/content/`, alongside a README stating the constraint that makes them
safe to use. Until today all four sat untracked in `~/Downloads`.

**Every one had drifted from production**, because content has repeatedly been
edited straight into Supabase and the generators never learned about it. Measured
before any fix, as generated-blocks vs live-blocks:

| Module | Generated | Live | Diff hunks | What had drifted |
|---|---|---|---|---|
| 2 | 181 | 193 | 16 | welcome + §5 videos, 6 images, the whole §1 deepening (etymology, stick house, Covey endowments, the five-block Army treatment, Munroe split in two), the "four voices" rewrite, the harvested guardrail line, 2 heading renames, 2 quizzes |
| 3 | 115 | 119 | 10 | 4 images, §3 video, the Marcus Aurelius nightly-practice paragraph, the table-to-scorecard conversion, 3 quizzes |
| 4 | 126 | 129 | 6 | 3 images, and the Vision 6 / Sinek / Vision 8 videos |
| 5 | 103 | 103 | 0 | already reconciled earlier today |

Re-ingesting any of them wholesale would have silently reverted all of it.

**Two generators existed twice.** `~/Downloads` held both
`generate_module2.js` and `generate_module2 (1).js`, and the same for Module 3.
Rather than guess from filenames or timestamps, each candidate was run and diffed
against production: for Module 2 the `(1)` copy came back at 16 hunks against the
other's 33, and for Module 3 at 10 against 11. The closer copy was taken as
canonical in both cases. The JSON files on disk had in fact been produced by the
*older* copies, so filename order would have chosen wrong.

Each generator was then edited until a fresh run reproduced its live row exactly.
Final state, all verified by regenerating from the tracked path and comparing
every field of every block — not by reading the edits:

```
M2  live 193 | generated 193 | zero differences
M3  live 119 | generated 119 | zero differences
M4  live 129 | generated 129 | zero differences
M5  live 103 | generated 103 | zero differences
```

The `image()` helper was made conditional in all four rather than replaced:
`image({url, alt})` emits a real image block, `image({type, content, width,
height})` still emits a placeholder. Art that genuinely has not been produced yet
keeps working, and folding a finished image in stays a two-line change.

**Three mistakes worth recording, all caught by the diff rather than by review.**
A regex rewriting image call sites matched its own output and put all three of
Module 4's images in the first slot. A quiz insertion anchored on a following
`divider`, which has no text, and landed inside Module 3's `assignmentPrompt(`
call, shifting its arguments. And Module 2's two video placeholders were mapped
against all three live videos instead of the two the generator did not already
emit, so both got the wrong one. In each case block counts or field comparison
caught it immediately; none reached the database, which was never written to
during any of this.

**Not covered:** Modules 0 and 1 have no generator — their blocks were authored
directly as JSON, and only Module 0's is tracked. They cannot drift the same way,
but they also cannot be regenerated.

## 2026-09-16 — Three content additions from library review

Original writing throughout; no third-party text reproduced. The named
thinkers are paraphrased or quoted only in short attributed fragments.

**Module 0 — "Other Voices, Landing in the Same Place", 5 blocks at idx 24.**
Inserted between the "you are already leading" callout and "The Three Ways
Leadership Is Used", so the definition is corroborated before the taxonomy that
depends on it. An h3, a framing paragraph, a tip callout gathering Drucker,
Bennis, Montgomery and Clinton, a pull quote carrying Denis's own definition, and
a closing paragraph that lands the section on it. The sequence is deliberate: the
borrowed voices come first, Denis's line last, so the module's own definition is
the one the reader leaves with.

Module 0: 124 -> 129 blocks, 5 sections unchanged, pull quotes 5 -> 6.

**Module 5 — "Two Lists", 6 blocks at idx 32**, Section 2 "Position &
Permission". An h3, three short exercise paragraphs, the paragraph that resolves
them, and a closing tip.

Placement needed a judgment call the brief left open. It asked for "after the
existing Muswaggon case study, before the section's closing divider", but those
are not adjacent — Muswaggon ends at idx 27 and the divider is at 32, with the
whole "Level 2 — Permission" subsection and the two-doors image in between.
Inserting immediately after Muswaggon would have split that subsection from its
own lead-in. The exercise went immediately before the divider instead, which
satisfies the more precise half of the instruction and is where the content
belongs: "Two Lists" argues that influence is not fame, which is a Level 2 claim,
so it reads as the section's closing beat rather than an interruption of it.

Module 5: 103 -> 109 blocks, 8 sections unchanged.

Both modules: ids regenerated and verified exhaustively — 129/129 and 109/109
match sha256(slug|index|type), 0 wrong, all distinct. No section counts moved; no
level-2 heading was added.

**The generator caught its own drift, which is the point of tracking it.**
Module 5's edit made `scripts/content/generate_module5.js` stale immediately —
a re-ingest would have silently deleted "Two Lists". The six blocks were folded
into the generator in the same pass, and all four generators were then re-run and
re-diffed: M2 193, M3 119, M4 129, M5 109, **zero differences each**. Module 0 has
no generator and cannot be kept in step this way.

**Banked, not inserted: `docs/banked/nine-habits.md`.** 435 words of original
writing on nine self-development habits, received this session and deliberately
not placed. It is not tied to any built module and belongs with Module 9
(Coaching & Developing) when that exists, rather than being wedged into a module
it does not serve. Copied into the repository so it is versioned rather than
living only in `~/Downloads`, which is the failure mode the generators just
demonstrated.

**Current baseline (2026-09-16):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 129 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 109 | 8 | 3 | 1 | 1 | 0 | 2 | 0 | 2 |

## 2026-09-17 — Module 6 "Building Trust" ingested

100 blocks, 8 sections, 7 blocks of front matter. Row
`8b3e1dbe-fdf1-45aa-b6bb-95bea5ee7541`, slug `building-trust`, module_number 6,
sort_order 6, difficulty `beginner`, estimated_duration_minutes 80, pillar
`relational-leadership`, leadership track, published.

**Pillar determined from the product, not inferred.** The file carried no pillar.
Module 0's own curriculum map settles it outright — Section 3 lists "Pillar 3 —
Relational Leadership (Leading People): Trust, communication, influence, empathy,
conflict resolution. **Modules 6, 7, 8.**" Trust is the first word of the pillar's
own description and Module 6 is named in its module list. The same passage
retroactively confirms the earlier calls: Modules 1-3 Personal, Modules 4-5
Directional.

Validation clean on the first run: 100 in / 100 out, 100 distinct ids, all 14
callout variants legal, headings levels 2-3 only, `scorecard_key`
`module6_trust_equation` present with `helpText` on all four items, assignment
key `a1`. This is the first module to arrive needing no schema corrections at
all — no missing scorecard_key, no dead video ids, no envelope problems.

Section count verified against the real `splitBlocksBySection`, all eight titles
matching character-for-character, front matter of 7 blocks. The scorecard lands
in §7 "The Delegation Test", the assignment in §8.

Loaded via 15 guarded appends. Live content verified against the ingest output by
md5 of every block's type and text — `80cba03493a550522a2eb3284e203627`,
identical. Ids 100/100 match sha256(slug|index|type), 0 wrong, 100 distinct.

Verified live after publish: all eight sections render with correct titles and
"Section N of 8"; the Trust Self-Audit renders as four working sliders **with the
per-item helpText showing beneath each**, which is the first use of that field in
production; the assignment form renders all five prompt headings, the worked
example, and the 200-700 word target; the dashboard grid returns seven modules
with Building Trust last, and Relational Leadership now appears as a pillar label
for the first time.

**Generator committed the same day**, per the brief and the lesson from Modules
2-5: `scripts/content/generate_module6.js`. Verified from its tracked path — a
fresh run reproduces the live row with zero differences. All five tracked
generators re-checked in the same pass:

```
M2 193 | M3 119 | M4 129 | M5 109 | M6 100   — zero differences each
```

**Week linking: not acted on, awaiting confirmation.** Options below.

**Pending on this module:** 1 image placeholder (§1, the stone arch with TRUST in
the keystone) and 2 video placeholders (a 3-4 min intro in front matter, a 2-3
min closing in §8). No videos to verify this pass.

**Current baseline (2026-09-17):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 129 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 109 | 8 | 3 | 1 | 1 | 0 | 2 | 0 | 2 |
| 6 | 100 | 8 | 0 | 1 | 2 | 0 | 0 | 1 | 2 |

## 2026-09-17 — Week 9 linked to Module 6

`coaching_plans` row `2747cf17-9c4c-44e6-9e5e-ba4b4f31059d`, week index 8:
`module_id` added, pointing at Module 6 Building Trust
(`8b3e1dbe-…`). Linked weeks in that plan 2 -> 3.

**Week 9 rather than Week 3, deliberately.** Four weeks carry the Relational
Leadership focus — 3, 6, 9 and 11 — and all four are eligible under the standing
rule: tag match, neither first nor last, none already taken. Ascending order
points at Week 3. It was refused for the same reason Week 2 was refused for
Module 3: Module 6's front matter reads "Every leader who completed Modules 1-5",
and Week 3 renders before Week 8, which holds Module 2. A reader following the
weeks in order would meet Module 6 before a module it explicitly assumes. Week 9
is the first relational week that sits after Week 8, so the dependency resolves.

The week's own content makes it a better fit than sequence alone would suggest:
its focus is servant leadership and its three exercises are about asking what a
team member needs, noticing when you led for your own comfort, and removing an
obstacle without taking over. Module 6 ends on exactly that — sharing real
authority rather than delegating tasks.

The write touched one key. `week`, `focus`, `desc_en`, `desc_fr`, `title_en`,
`title_fr` and all three `exercises` are byte-identical, because `jsonb_set` was
pointed at `{weeks,8,module_id}` rather than at the object. Guards: row id, 12
weeks, `weeks->8->>'week' = '9'`, focus match, and `not (… ? 'module_id')` so a
re-run is a no-op rather than a silent overwrite.

Journey state now:

| Week | Focus | Module |
|---|---|---|
| 1 | Personal Leadership | 1 — The Leader Within |
| 8 | Personal Leadership | 2 — Character in the Dark |
| 9 | Relational Leadership | 6 — Building Trust |

Modules 3, 4 and 5 remain unlinked: no week carries Emotional Intelligence's or
Directional Leadership's focus at all.

## 2026-09-18 — Module 7 "Communication" ingested

98 blocks, 7 sections, 7 blocks of front matter. Row
`caae197a-488f-4de5-9a8d-7ad7a97da3ad`, slug `communication`, module_number 7,
sort_order 7, difficulty `beginner`, estimated_duration_minutes 80, pillar
`relational-leadership`, leadership track, published.

Pillar carried over from Module 0's curriculum map without rediscovery, as the
brief specified — Pillar 3 covers Modules 6, 7 and 8 by that map's own listing.

Validation clean on the first run, as with Module 6: 98 in / 98 out, 98 distinct
ids, all 19 callout variants legal, `scorecard_key` `module7_seven_principles`
with `helpText` on all four items, assignment key `a1`. Real splitter confirms
7 sections, all titles matching character-for-character, front matter of 7
blocks. Scorecard lands in §3, assignment in §7.

Loaded via 15 guarded appends. Live content verified against the ingest output by
md5 of every block's type and text — `92edd5259e560c0ac742fe598d73cd16`,
identical. Ids 98/98 match sha256(slug|index|type), 0 wrong, 98 distinct.

**One correction to the brief: the module has 3 tables, not 2.** They sit in §1
(what was sent vs what arrived), §3 (the seven principles) and §6 (actually
listening vs waiting to talk). All three render. Worth noting only so the count
in the next reference table isn't carried forward wrong.

Verified live after publish: all seven sections render with correct titles and
"Section N of 7"; the Communication Self-Audit renders as four working sliders
with all four helpText lines visible; the assignment form renders all five prompt
headings, the rich-text editor and the 200-700 word target; the closing pull
quote renders; the dashboard grid returns eight modules with Communication last.

**Generator committed the same day**: `scripts/content/generate_module7.js`.
All six tracked generators re-verified against production in the same pass:

```
M2 193 | M3 119 | M4 129 | M5 109 | M6 100 | M7 98   — zero differences each
```

**Week linking: ships unlinked. Decided 2026-09-18.** The dependency check the
brief asked for changes the answer. Four weeks carry Relational Leadership —
3, 6, 9 and 11. Week 9 is taken by Module 6. Weeks 3 and 6 match the tag but
render *before* Week 9, and Module 7's front matter requires Modules 1-6, so a
reader working in week order would meet Module 7 before Module 6 — the same
inversion that sent Module 6 to Week 9 rather than Week 3. That leaves exactly
one option:

| Week | Focus | Verdict |
|---|---|---|
| 3 | Relational Leadership | tag match, renders before Week 9 — dependency-unsafe |
| 6 | Relational Leadership | tag match, renders before Week 9 — dependency-unsafe |
| 9 | Relational Leadership | taken by Module 6 |
| **11** | **Relational Leadership** | **eligible and dependency-safe** |

Week 11 is also the last relational week available, and Module 8 shares this
pillar. Denis's decision: **hold Week 9's precedent and leave Module 7
unlinked** rather than spend the last relational week on it. The standing rule
already says to ship unlinked rather than force a fit; this extends it one step
further — a week that is technically eligible can still be the wrong one to
spend, when a later module in the same pillar has no alternative.

Module 7 therefore joins Modules 3, 4 and 5 as deliberately unlinked. Journey
state is unchanged: Week 1 -> Module 1, Week 8 -> Module 2, Week 9 -> Module 6.

**Pending on this module:** 2 image placeholders (§1 the distorting speech
bubble, §2 the radio set) and 2 video placeholders (3-4 min intro in front
matter, 2-3 min closing in §7). No videos to verify this pass.

**Current baseline (2026-09-18):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 129 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 109 | 8 | 3 | 1 | 1 | 0 | 2 | 0 | 2 |
| 6 | 100 | 8 | 0 | 1 | 2 | 0 | 0 | 1 | 2 |
| 7 | 98 | 7 | 0 | 1 | 3 | 0 | 0 | 2 | 2 |

## 2026-09-21 — Module 8 "Servant Leadership" ingested

100 blocks, 7 sections, 9 blocks of front matter. Row
`40dd8e0c-979a-4ec2-a8cb-74bc7f615127`, slug `servant-leadership`,
module_number 8, sort_order 8, difficulty `beginner`,
estimated_duration_minutes 80, pillar `relational-leadership`, leadership
track, published. Subtitle "What All of It Was Actually For".

Pillar carried over from Module 0's curriculum map without rediscovery, as the
brief specified — Pillar 3 covers Modules 6, 7 and 8 by that map's own listing.
**With Module 8 live, the Relational Leadership pillar is complete.**

Validation clean on the first run, as with Modules 6 and 7: 100 in / 100 out,
100 distinct ids, all 24 callout variants legal, `scorecard_key`
`module8_servant_leadership` with `helpText` on all four items, assignment key
`a1`. Real splitter confirms 7 sections, all titles matching
character-for-character, front matter of 9 blocks — six callouts, more than any
prior module. The level-2 heading at idx 0 is the module title and stays in
front matter; the seven section headings are "The Inversion", "Ten
Characteristics", "A Different Kind of Fifth Level", "What Leaders Are to
People", "Nine Lenses on One Leader", "The Cost of Serving" and "Closing &
Assignment".

Loaded via 18 guarded appends. Live content verified against the ingest output
by md5 of every block's type and text — `dc52e725fe2f57c9f1e052116d9f31d4`,
identical. Ids 100/100 match sha256(slug|index|type), 0 wrong, 100 distinct.

**One correction to the brief: the module has 5 tables, not 2.** Same class of
miscount as Module 7's (3, not 2). All five render.

The Collins clarification the brief flagged reads correctly. The warning callout
distinguishing Collins's "Level 5 Leadership" from Module 5's "Five Levels" sits
directly under the §3 heading, before the first Collins paragraph, so the reader
meets the disambiguation before the ambiguous term. No edit needed.

**Two content-ordering issues found during load, reported but not fixed** (both
are authoring order, not ingest defects, and fixing either means editing prose):

1. **Greenleaf is introduced after he is cited.** Block ~14 refers to
   "Greenleaf's test" and block 15 opens "Greenleaf himself drew a sharp
   line…", but the block that actually introduces him — "The management writer
   Robert Greenleaf coined the term…" — is block 17. The reader meets the test
   and the man two blocks before either is identified.
2. **"Coach Bru" is named only on second reference.** Block ~82 says "Coach
   Bru's recruit didn't perform a single dramatic act…", but §1 introduces him
   only as "A college lacrosse coach" and never gives the name.

Verified live after publish: all seven sections render with correct titles and
"Section N of 7"; the scorecard renders as four working sliders with all four
helpText lines visible; the assignment form renders all five prompt headings and
the 200-800 word target; the closing pull quote renders; the dashboard grid
returns nine modules with Servant Leadership last.

**Generator committed the same day**: `scripts/content/generate_module8.js` —
not left in Downloads, same drift-prevention as every module since 5. All seven
tracked generators re-verified against production in the same pass (the
scratchpad diff helper had been cleared between sessions and was rebuilt for
this):

```
M2 193 | M3 119 | M4 129 | M5 109 | M6 100 | M7 98 | M8 100 — zero differences each
```

**Pending on this module:** 2 image placeholders and 2 video placeholders (3-4
min intro in front matter, closing in §7). No videos to verify this pass.

**Week linking: options presented, nothing written. Awaiting confirmation.**
Four weeks carry the Relational Leadership focus — 3, 6, 9 and 11. Week 9 is
taken by Module 6, leaving 3, 6 and 11 eligible under the standing rule (focus
matches pillar; neither first nor last week). All three descriptions name the
same servant-leadership gap (3.3/5), so topical fit does not separate them.

The dependency check does. Module 8's front matter says "Every leader who
completed Modules 1-7", and a further callout names Modules 3, 5, 6 and 7 as
reappearing. By Week 3 the journey has surfaced one module (Week 1 -> Module 1);
by Week 6, still one. Only Week 11 sits behind every module the plan currently
links — Week 1 -> Module 1, Week 8 -> Module 2, Week 9 -> Module 6 — which is
the closest the plan can come to the stated prerequisite. Week 11 is also the
week deliberately held open when Module 7 was refused it on 2026-09-18,
specifically reserved for whichever pillar-3 module needed it most.

Recommendation: **Week 11 -> Module 8.** Not executed.

**Current baseline (2026-09-21):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 129 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 109 | 8 | 3 | 1 | 1 | 0 | 2 | 0 | 2 |
| 6 | 100 | 8 | 0 | 1 | 2 | 0 | 0 | 1 | 2 |
| 7 | 98 | 7 | 0 | 1 | 3 | 0 | 0 | 2 | 2 |
| 8 | 100 | 7 | 0 | 1 | 5 | 0 | 0 | 2 | 2 |

## 2026-09-21 — Module 8 authoring-order fixes reconciled, Week 11 linked

**1. The two prose bugs are fixed in production.** Both were reported at
ingest and are now corrected from the authoritative generator rather than
patched in the database by hand — same reconciliation method as Modules 5, 6
and 7.

The corrected file arrived as `~/Downloads/generate_module8 (1).js`. Worth
noting for next time: `generate_module8.js` in the same folder was byte-identical
(md5 `cb486b231752bf28cab631c825442b41`) to the copy already committed on
2026-09-21, so the plain filename was the stale one. Verified by md5 before
touching anything, the same check that caught three no-op Module 5 briefs.

Diff against the live row: **exactly 8 blocks differ, indices 11-18.** Still 100
blocks, still 7 sections, nothing added or removed. Comparing blocks by content
alone (ignoring ids) shows 99 of 100 identical and one changed — the lacrosse
paragraph gaining "— Coach Bru —" and "The coach met" becoming "Coach Bru met".
Everything else at 11-18 is pure reordering.

Section 1 before -> after:

```
10  paragraph  Every model this track has covered...      10  paragraph  Every model this track has covered...
11  heading3   A Seventeen-Year-Old's Decision            11  paragraph  The management writer Robert Greenleaf...
12  paragraph  A college lacrosse coach inherited...      12  callout    This test is uncomfortable...
13  paragraph  All through the following fall...          13  heading3   A Seventeen-Year-Old's Decision
14  callout    Notice what this wasn't...                 14  paragraph  A college lacrosse coach - Coach Bru -...
15  paragraph  Greenleaf himself drew a sharp line...     15  paragraph  All through the following fall...
16  paragraph  There's a practical marker...              16  callout    Notice what this wasn't...
17  paragraph  The management writer Robert Greenleaf...  17  paragraph  Greenleaf himself drew a sharp line...
18  callout    This test is uncomfortable...              18  paragraph  There's a practical marker...
```

Greenleaf is now introduced at idx 11, ahead of both references to him — the tip
at 16 ("the exact inversion Greenleaf's test is built to detect") and the
paragraph at 17 ("Greenleaf himself drew a sharp line"). Coach Bru is named at
idx 14, on first mention, so the second reference in §6 now resolves.

Applied as **8 separately guarded `jsonb_set` calls**, one per index, each
guarded on the full old text at that index plus `jsonb_array_length = 100`.
Retrying any of them is a no-op. Ids were recomputed by the ingest script
because 7 of the 8 indices changed type; no user data keys on block ids, so the
re-id is safe — ratings key on `(scorecard_key, item_key)` and submissions on
`assignment_key`, both untouched.

Re-verified after the writes: 100 blocks, 100 distinct ids, 0 stale against
sha256(slug|index|type), content md5 `a520351706b73db565cfb8731eb77bfe` —
identical to the corrected generator's ingest output.

All seven tracked generators re-run against a freshly fetched live snapshot
after this landed:

```
M2 193 | M3 119 | M4 129 | M5 109 | M6 100 | M7 98 | M8 100 — zero differences each
```

**2. Week 11 -> Module 8. Written 2026-09-21.** The slot deliberately held open
on 2026-09-18 when Module 7 was refused it now goes to the pillar-3 module that
needed it. Guarded on week 11, focus Relational Leadership, no existing
`module_id`, and 12 weeks — so a re-run is a no-op.

```
BEFORE  week 11  Relational Leadership  "Leading Others Before Leading Yourself Last"  module_id: absent   (3 links)
AFTER   week 11  Relational Leadership  "Leading Others Before Leading Yourself Last"  module_id: 40dd8e0c (4 links)
```

Journey `2747cf17` now reads: Week 1 -> Module 1, Week 8 -> Module 2,
Week 9 -> Module 6, Week 11 -> Module 8. **The Relational Leadership pillar is
complete end to end: 6 -> Week 9, 7 -> deliberately unlinked, 8 -> Week 11.**

Still pending on Module 8: 2 image placeholders and 2 video placeholders.

## 2026-09-22 — Module 9 "Coaching & Developing People" ingested

100 blocks, 7 sections, 7 blocks of front matter. Row
`db7d180f-c63a-4021-ac7a-0874d1f2e5da`, slug `coaching-developing-people`,
module_number 9, sort_order 9, difficulty `beginner`,
estimated_duration_minutes 80, pillar `performance-leadership`, leadership
track, published. Subtitle "The Mechanics of Multiplication".

**This opens the Performance Leadership pillar** — the fourth of the five in
Module 0's curriculum map, previously holding zero modules. Pillar assignment
confirmed against that map on 2026-09-21: Pillar 4 "Executing With Excellence"
covers Modules 9 and 10 only; Modules 11 and 12 belong to Pillar 5,
Multiplication & Impact. Worth recording because the assumption going in was
that 9-12 formed a single pillar; the map says otherwise, in both its prose
("Delegation, coaching, feedback, managing performance, developing others.
Modules 9, 10.") and its at-a-glance table.

Validation clean on the first run, as with Modules 6, 7 and 8: 100 in / 100
out, 100 distinct ids, all 24 callout variants legal, `scorecard_key`
`module9_coaching_developing` with `helpText` on all four items, assignment key
`a1`. The supplied `module9_leadership.json` is byte-identical to what
`generate_module9.js` produces (md5 `7f585509fbafb087dce2cc2707f52207`),
checked before anything was loaded.

Real splitter confirms 7 sections with titles matching character-for-character:
The Real Multiplier, The Five-Step Process, Three Foundational Skills, A
Conversation You Can Actually Have, Nine Habits That Actually Build Leadership,
Paul and Timothy, Closing & Assignment. Front matter of 7 blocks. Scorecard and
assignment both land in §7.

Loaded via 16 guarded appends. **One append (chunk 7) returned a closed-socket
error mid-run**; the row was still at 43 blocks, so the write had not landed and
the same statement was re-sent and succeeded. This is exactly what the
`jsonb_array_length` guard exists for — a retry after an ambiguous transport
failure is either a no-op or the intended write, never a double-append.

Live content verified against the ingest output by md5 of every block's type and
text — `3f0c7917fbcde8c2b1fc47bde669078c`, identical. Ids 100/100 match
sha256(slug|index|type), 0 wrong, 100 distinct.

**One correction to the brief: the module has 3 tables, not 2.** They sit in §2
(the five stages), §4 (managing vs coaching responses) and §5 (the nine habits).
All three render. This is the third brief in a row to undercount tables —
Module 7 said 2 and had 3, Module 8 said 2 and had 5.

Verified live after publish: the module overview carries the new PERFORMANCE
LEADERSHIP badge and lists all 7 sections with correct reading times; every
section renders "Section N of 7"; all three tables render, including the
three-column one in §4 with its quoted strings intact; the scorecard renders as
four working sliders with all four helpText lines visible; the assignment form
renders all five prompt headings, the rich-text editor and the 200-800 word
target; the dashboard grid returns ten modules with Coaching & Developing People
last, card 09, labelled PERFORMANCE LEADERSHIP.

The dashboard pillar filter picked up a fourth option, "Performance Leadership",
with no code change — it derives its options from the live modules. Escape
closed the dropdown and returned focus to the button, so the b364001 fix still
holds.

**Generator committed the same day**: `scripts/content/generate_module9.js`.
All eight tracked generators re-verified against production in the same pass:

```
M2 193 | M3 119 | M4 129 | M5 109 | M6 100 | M7 98 | M8 100 | M9 100 — zero differences each
```

**Week linking: ships unlinked. Confirmed directly, not assumed.** Every week in
both plan rows was read. Journey `2747cf17` carries three focus values only —
Personal Leadership (weeks 1, 8, 12), Relational Leadership (3, 6, 9, 11) and
Multiplication & Impact (2, 4, 5, 7, 10). **No week carries Performance
Leadership at all.** The other plan row, `104dac0a`, uses an entirely different
tagging scheme (`listening-empathy`, `spiritual-value-alignment`,
`appreciation-affirmation`) with zero links and no pillar names, so it offers
nothing either. Under the standing rule — a week is eligible only if its focus
tag matches the module's pillar — there is no eligible week, and the rule says
ship unlinked rather than force a fit. Module 9 joins Modules 3, 4, 5 and 7.

Journey state unchanged: Week 1 -> Module 1, Week 8 -> Module 2,
Week 9 -> Module 6, Week 11 -> Module 8.

**Pending on this module:** 1 image placeholder (§1, the candle lighting a
second candle) and 2 video placeholders (3-4 min intro in front matter, 2-3 min
closing in §7). No videos to verify this pass.

**Open question, not acted on:** §5 "Nine Habits That Actually Build Leadership"
covers the same ground as `docs/banked/nine-habits.md`, the 435 words of
original writing banked on 2026-09-16 specifically for Module 9. The shipped
section renders the nine as a two-column table rather than prose. The banked
file is therefore either superseded or still worth folding in as expansion —
Denis's call, nothing changed either way.

**Current baseline (2026-09-22):**

| Module | blocks | sections | videos | scorecards | tables | quizzes | images | image ph | video ph |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 129 | 5 | 1 | 0 | 1 | 1 | 5 | 0 | 0 |
| 1 | 403 | 7 | 7 | 2 | 1 | 5 | 6 | 0 | 0 |
| 2 | 193 | 8 | 3 | 0 | 7 | 2 | 6 | 0 | 0 |
| 3 | 119 | 8 | 4 | 1 | 4 | 3 | 4 | 0 | 0 |
| 4 | 129 | 9 | 5 | 0 | 4 | 0 | 3 | 0 | 0 |
| 5 | 109 | 8 | 3 | 1 | 1 | 0 | 2 | 0 | 2 |
| 6 | 100 | 8 | 0 | 1 | 2 | 0 | 0 | 1 | 2 |
| 7 | 98 | 7 | 0 | 1 | 3 | 0 | 0 | 2 | 2 |
| 8 | 100 | 7 | 0 | 1 | 5 | 0 | 0 | 2 | 2 |
| 9 | 100 | 7 | 0 | 1 | 3 | 0 | 0 | 1 | 2 |

## 2026-09-22 — Module 9 §5 expanded with the banked Nine Habits piece

100 -> 110 blocks. `docs/banked/nine-habits.md`, banked on 2026-09-16 and
flagged as an open question at ingest, is now folded in as genuine additional
content. The table stays as the compact overview; the fuller prose sits
underneath it.

The banked file was read fresh before use rather than trusted to the earlier
log summary. Two things that check turned up, both of which changed the work:

1. The file's closing line — "None of these nine require a title. All nine
   require the same thing: doing them on a day nobody's checking." — was
   **already live verbatim** as the tip callout directly under the table. It was
   not duplicated. Because the expansion goes in above that callout, the callout
   now closes the habit list instead of the table, which is the position it
   holds in the banked file itself. No block was moved to achieve this.
2. The file opens with framing not present anywhere in the module — leadership
   as physical conditioning rather than a trait. That became the bridging
   paragraph at idx 73, so the nine numbered paragraphs don't dangle off the
   bottom of a table.

Ten blocks inserted at idx 73: one bridge plus nine habit paragraphs, numbered
"1." through "9." to match the form §4 already uses for its five questions. The
existing "Pick one, not all nine at once" and "Notice the connection to
everything else in this module" paragraphs stay, now after the expanded list, as
the brief specified.

Diff against the live row before applying: **a pure insertion.** Blocks 0-72
byte-identical, blocks 73-82 new, and all 27 remaining blocks content-identical
shifted by exactly 10 — zero incidental edits anywhere.

Applied as 10 guarded `jsonb_insert` calls, each guarded on the running array
length (100, 101, … 109), so a retry at any point is a no-op. Ids were then
recomputed for the whole array in a single statement from
sha256(slug|index|type) — a no-op for blocks 0-72 and the fix for the 27
shifted ones. That statement is itself idempotent, since it derives ids rather
than assigning them. Nothing keys on block ids; the scorecard and assignment
keys are untouched.

Re-verified after the writes: 110 blocks, 110 distinct ids, 0 stale, content md5
`1109e34c04dd20b02ac0571f67c62538` — identical to the expanded generator's
ingest output. Still 3 tables, 1 scorecard, 1 assignment, 1 image placeholder,
2 video placeholders.

Splitter unchanged in shape: 7 sections, same titles, front matter still 7
blocks. §5 grows 10 -> 20 blocks and 3 -> 5 minutes; the module total goes
80 min by the row's stored estimate, which was not changed.

Verified live: §5 renders the table, then the bridge, then all nine numbered
paragraphs in order, then the callout, then the existing closing paragraphs —
"SECTION 5 OF 7 · 5 MIN".

All eight tracked generators re-verified against production after this landed:

```
M2 193 | M3 119 | M4 129 | M5 109 | M6 100 | M7 98 | M8 100 | M9 110 — zero differences each
```

`docs/banked/nine-habits.md` is left in place as the source record. Module 9's
row in the baseline table above should now read 110 blocks.
