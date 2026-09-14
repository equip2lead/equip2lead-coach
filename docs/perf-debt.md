# Known debt

Things we chose not to fix yet, with the trigger that should make us pay them down.
Performance costs first, then behaviour we have accepted for now.

## Performance

- ~~**Lesson list downloads full `body_blocks` per module for section count**~~ — **fixed 2026-09-09.** The list was a client component selecting `body_blocks` for every published module purely to derive a section count and a reading-time fallback: ~196KB to the browser at four modules (25.3 + 92.0 + 45.6 + 33.5), growing per module, and by Module 3 the page showed a multi-second spinner and repeated evaluation timeouts. Now summarised by `app/api/lesson-modules/summary/route.ts`, which runs the same `splitBlocksBySection` server-side and returns counts only — **1.3KB**. Deliberately not a stored column or a SQL re-implementation: either would be a second definition of "what a section is", free to drift from the renderer. Deriving stays in one place; only the location moved.

- **Dashboard filter URL params flash unfiltered grid for one frame before hydration** — `useSearchParams` inside Suspense behaviour: the server renders the grid unfiltered, the client applies `?pillar=`/`?status=` on hydration. Cosmetic, not functional; the settled state is correct. Fix if it becomes a complaint. (`components/dashboard/ModuleGrid.tsx`, added 2026-09-08.)

## Behaviour

Found 2026-09-14 while exercising the dashboard pillar filter with two real
options for the first time (Module 4 being the first module outside Personal
Leadership). Neither is urgent; both were left deliberately.

- **Module 0's card is matched by the Personal Leadership filter but shows no
  pillar label.** `is_starting_point` cards are labelled by what they are —
  a "Starting point" badge — rather than by pillar, which is right: Module 0
  comes before the series rather than being its first entry. But the filter
  reads `pillarSlug`, and Module 0 genuinely is `personal-leadership`, so
  filtering by that pillar returns a card that never says "Personal
  Leadership". Invisible while one pillar existed. The fix is a decision, not
  a patch — either show the pillar on starting-point cards, or exclude them
  from pillar filtering — and the second would surprise anyone who filtered
  expecting to see everything in that pillar. (`components/dashboard/ModuleGrid.tsx`.)

- **`/lessons/<id>/<n>` returns 200 for an out-of-range or non-numeric `n`.**
  `/99` and `/abc` both render a "Course content" fallback rather than a 404.
  Verified identical on Modules 2 and 4, so this predates Module 4 and is not a
  regression. Costs nothing today — nothing links to those URLs — but a real
  404 would be more honest, and a soft-200 on a bad path is the kind of thing
  that hides a broken link later rather than surfacing it.
  (`app/(app)/lessons/[id]/[section]/page.tsx`.)
