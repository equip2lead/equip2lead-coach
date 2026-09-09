# Performance debt

Known costs we accepted deliberately, with the trigger that should make us pay them down.

- ~~**Lesson list downloads full `body_blocks` per module for section count**~~ — **fixed 2026-09-09.** The list was a client component selecting `body_blocks` for every published module purely to derive a section count and a reading-time fallback: ~196KB to the browser at four modules (25.3 + 92.0 + 45.6 + 33.5), growing per module, and by Module 3 the page showed a multi-second spinner and repeated evaluation timeouts. Now summarised by `app/api/lesson-modules/summary/route.ts`, which runs the same `splitBlocksBySection` server-side and returns counts only — **1.3KB**. Deliberately not a stored column or a SQL re-implementation: either would be a second definition of "what a section is", free to drift from the renderer. Deriving stays in one place; only the location moved.

- **Dashboard filter URL params flash unfiltered grid for one frame before hydration** — `useSearchParams` inside Suspense behaviour: the server renders the grid unfiltered, the client applies `?pillar=`/`?status=` on hydration. Cosmetic, not functional; the settled state is correct. Fix if it becomes a complaint. (`components/dashboard/ModuleGrid.tsx`, added 2026-09-08.)
