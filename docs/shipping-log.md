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
