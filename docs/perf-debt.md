# Performance debt

Known costs we accepted deliberately, with the trigger that should make us pay them down.

- **Lesson list downloads full `body_blocks` per module for section count** — replace with a generated column or an RPC when module count reaches ~5. (`app/(app)/lessons/page.tsx`, added 2026-09-05; Module 1 alone is ~110KB.)
- **Dashboard filter URL params flash unfiltered grid for one frame before hydration** — `useSearchParams` inside Suspense behaviour: the server renders the grid unfiltered, the client applies `?pillar=`/`?status=` on hydration. Cosmetic, not functional; the settled state is correct. Fix if it becomes a complaint. (`components/dashboard/ModuleGrid.tsx`, added 2026-09-08.)
