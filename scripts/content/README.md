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

## Not covered here

**Module 1 alone** has no generator. Its blocks were authored directly as JSON;
`module1_leadership_track_blocks.json` sits untracked at the repository root and
has not been checked against the live row, so whether it still matches is
unknown. That is a separate problem from Module 0's and has not been decided.

Module 0 was in the same position until 2026-09-29, when `generate_module0.js`
was reverse-engineered from the live row and verified byte-for-byte against it.
It is a real generator, not a dump — but it is a reconstruction of production
rather than the original source, and three of its shapes (an assignment
`submit_label`, an optional pull-quote `attribution`, and literal "Section N — "
heading prefixes) appear in no other module.
