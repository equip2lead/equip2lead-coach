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

## Not covered here

Modules 0 and 1 predate this pattern and have no generator — their blocks were
authored directly as JSON. `module0_starting_point_blocks.json` is tracked at
the repository root; Module 1's equivalent is not. Module 0 has since been
edited directly in the database and cannot be regenerated at all.
