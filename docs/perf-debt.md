# Performance debt

Known costs we accepted deliberately, with the trigger that should make us pay them down.

- **Lesson list downloads full `body_blocks` per module for section count** — replace with a generated column or an RPC when module count reaches ~5. (`app/(app)/lessons/page.tsx`, added 2026-09-05; Module 1 alone is ~110KB.)
