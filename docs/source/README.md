# Source material

Original documents this project was built from, kept here so they stay tracked
rather than drifting untracked at the repository root. **Nothing in this folder
is a generator target.** These are inputs, not reproductions of production — see
`scripts/content/README.md` for the generators, every one of which reproduces a
live `lesson_modules` row exactly.

## `fire-bible-institute-lessons.json`

The **FIRE Bible Institute "Spiritual Leadership" course, Yaoundé, Cameroon** —
Dr. Denis Ekobena's own institute curriculum, compiled from Maxwell's *21
Irrefutable Laws of Leadership*, J. Oswald Sanders' *Spiritual Leadership*, and
Irvine's *The Authentic Leader*.

Twelve lessons, 82,604 characters of English lesson prose, keyed by `level`
(1-5) and `material_sort_order` rather than by module:

```
[{ level, material_sort_order, material_title_en_lookup,
   lesson_content_en, lesson_content_fr,
   assignment_prompt_en, assignment_prompt_fr, chars }]
```

`lesson_content_fr` is null in all twelve; `assignment_prompt_fr` is populated in
all twelve. The shape targets a materials/lessons ingest pipeline, not the
`lesson_modules` one this repo's generators use.

**It is unpublished source material, not a generator target.** No block in it has
ever appeared in `lesson_modules`, and the Leadership Track was written
independently rather than from it. There is no live row for a generator to
reproduce, so writing one would be inventing content rather than recovering it.

Its full text was ingested into `knowledge_documents` on 2026-09-30 so the AI
Coach can retrieve it — previously only condensed syllabus summaries were there.

### Coverage against the shipped Leadership Track

Eleven of the twelve lessons already have coverage in the shipped modules, under
different framing and different examples — the track was not written from this
file, so the overlap is thematic rather than textual:

| Lesson | Shipped coverage |
|---|---|
| 1 — Introductory Leadership Concepts | Modules 0 and 1 |
| 2 — Five Levels of Leadership | Module 5 — Levels & Laws |
| 4 — Visionary Leadership | Module 4 — Vision & Strategic Direction |
| 5 — Leadership Development | Module 9 — Coaching & Developing People |
| 6 — Biblical Leadership (servanthood) | Module 8 — Servant Leadership |
| 11 — Communication and Motivation | Module 7 — Communication |
| 25 — The Law of Empowerment | Modules 6 and 9 |
| 26 — The Law of Reproduction | Modules 9 and 12 |
| 30 — The Law of Priorities | Module 5 |
| 34 — The Law of Legacy | Module 12 — Leadership Legacy |
| 37 — Conclusion | Module 12 |
| **36 — Budgets and Financial Matters** | **no module covers this** |

**Lesson 36 is the one genuine gap.** No module in the twelve-module Leadership
Track touches budgets or financial stewardship. (A French `knowledge_documents`
row does mention it alongside servant leadership, so it is not wholly absent from
the platform — but it has no module.) If a future module or track needs a
subject, this is the one with source material already written and no home.

### Ingested into `knowledge_documents` (2026-09-30)

All twelve lessons were ingested as full English text, one row per lesson,
`category = 'fbi-spiritual-leadership-en-lessons'`, sort_order 320-331. Each row
opens with an attribution header naming the institute, lesson number, course
level, Dr. Denis Ekobena as author and the three core texts, and ends with that
lesson's English and French assignment prompts. `lesson_content_fr` is null in
all twelve, so the lesson bodies are English only.

The eight pre-existing FIRE documents were **left standing, unmodified** — see
the shipping log entry for why.

**These twelve rows have no embedding.** Retrieval is vector-based, so until
embeddings are generated they will not surface in AI Coach search.
