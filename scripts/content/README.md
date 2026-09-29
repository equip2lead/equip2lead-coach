# Module content generators

One generator per lesson module. Each builds the module's `body_blocks` as JSON;
`scripts/ingest-module.mjs` validates that JSON and emits the row loaded into
`lesson_modules`.

```
node scripts/content/generate_moduleN.js     # writes moduleN_leadership.json to cwd
```

## These must stay in step with the database

Content has repeatedly been edited straight into Supabase — images swapped in,
videos replaced, quizzes inserted, sections rewritten. A generator that has not
been updated to match will silently undo all of it if its output is re-ingested
wholesale. That happened twice with Module 5 on 2026-09-15.

**Before re-ingesting a module, diff the generator's output against the live row
and reconcile rather than overwrite.** All four generators here were verified
against production on 2026-09-16 and produce it exactly, block for block.

`scripts/verify/check-generators.sh` does that diff for every generator here, in
one command, against a snapshot it fetches from the database itself. It exits
non-zero if any generator has drifted.

## The `image()` helper

```js
image({ url, alt })                                   // a real image block
image({ type, content, width, height })               // an [IMAGE PLACEHOLDER] callout
```

Both shapes are supported on purpose: art that has not been produced yet keeps
emitting a placeholder, and folding a finished image in is a two-line change at
the call site rather than a helper rewrite.

## Commit a generator the day its module ships

Module 6's generator was committed in the same pass as its ingest, which is the
pattern to keep. Modules 2-5 were left in `~/Downloads` for days or weeks and
every one of them had silently drifted by the time anyone checked.

## Every published module is covered

As of 2026-09-29 all thirteen published rows — Modules 0 through 12 — have a
generator here, and `scripts/verify/check-generators.sh` reproduces every one of
them exactly. There are no exceptions left.

Modules 0 and 1 predate the pattern: their blocks were authored directly as JSON
and then edited in the database. Both generators were reverse-engineered from
the live rows and verified byte-for-byte against them, ids included. They are
real generators rather than dumps, but they are reconstructions of production
rather than the original authoring source.

`module1_leadership_track_blocks.json` at the repository root is **stale and
should not be used**: 489 blocks against production's 403, 106 of them no longer
live and 21 live blocks missing entirely. It was deliberately not used as a
source or a reference when rebuilding Module 1.

A handful of shapes in Modules 0 and 1 appear in no later module and are
reproduced rather than normalised — `quote` blocks with optional attribution,
scorecards without `helpText`, assignment `submit_label` and per-prompt
`example`, and literal "Section N — " heading prefixes. Each is commented where
it occurs.
