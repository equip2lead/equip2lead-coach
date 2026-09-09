# Performance debt

Known costs we accepted deliberately, with the trigger that should make us pay them down.

- **Lesson list downloads full `body_blocks` per module for section count** — replace with a generated column or an RPC. (`app/(app)/lessons/page.tsx`, added 2026-09-05; Module 1 alone is ~92KB.) **Trigger reached 2026-09-09 at 4 modules, not the ~5 originally guessed:** the page now pulls ~196KB per load (25.3 + 92.0 + 45.6 + 33.5 KB) and is visibly degraded — multi-second spinner, two 45s CDP evaluation timeouts and one error frame while verifying Module 3. Act before Module 4.
- **Dashboard filter URL params flash unfiltered grid for one frame before hydration** — `useSearchParams` inside Suspense behaviour: the server renders the grid unfiltered, the client applies `?pillar=`/`?status=` on hydration. Cosmetic, not functional; the settled state is correct. Fix if it becomes a complaint. (`components/dashboard/ModuleGrid.tsx`, added 2026-09-08.)
