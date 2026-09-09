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
