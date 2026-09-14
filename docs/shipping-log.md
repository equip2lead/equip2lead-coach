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
