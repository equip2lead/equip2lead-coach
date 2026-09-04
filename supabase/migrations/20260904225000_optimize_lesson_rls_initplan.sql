-- Wrap bare auth.uid() calls in (select auth.uid()) across the six policies
-- introduced by the three preceding migrations.
--
-- A bare auth.uid() in a policy expression is re-evaluated once per candidate
-- row. Wrapped in a scalar subquery it becomes an InitPlan: evaluated once
-- per statement and reused. Same value, same access decision, one call.
--
-- This matters most on lesson_scorecard_ratings, which is append-only and so
-- is the table that grows without bound — a per-row auth.uid() there gets
-- more expensive every time someone rates themselves.
--
-- ALTER POLICY rather than DROP + CREATE: the policy is replaced in place, so
-- there is no instant at which the table sits unprotected.
--
-- Scope is deliberately just these six. The same pattern exists in 25 other
-- policies across the schema that predate this work (lesson_progress,
-- coaching_plans, pillar_scores among them); those are a separate decision
-- and are left exactly as they are.
--
-- is_admin() and is_super_admin() are left as bare calls. They are STABLE and
-- take no arguments, so the planner already evaluates them once per statement;
-- wrapping them would add noise without changing the plan.

-- ── lesson_scorecard_ratings ────────────────────────────────────────────────

ALTER POLICY lesson_scorecard_ratings_select ON lesson_scorecard_ratings
  USING (user_id = (select auth.uid()) OR is_admin());

ALTER POLICY lesson_scorecard_ratings_insert ON lesson_scorecard_ratings
  WITH CHECK (user_id = (select auth.uid()));

-- ── lesson_assignment_submissions ───────────────────────────────────────────

ALTER POLICY las_select ON lesson_assignment_submissions
  USING (user_id = (select auth.uid()) OR is_admin());

ALTER POLICY las_insert ON lesson_assignment_submissions
  WITH CHECK (
    user_id = (select auth.uid())
    AND status = 'draft'
    AND submitted_at IS NULL
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  );

-- The freeze is unchanged: USING still inspects the OLD row and permits edits
-- only while status is 'draft'; WITH CHECK still inspects the NEW row and
-- permits draft -> submitted but never back and never to 'reviewed'.
ALTER POLICY las_update_author ON lesson_assignment_submissions
  USING (user_id = (select auth.uid()) AND status = 'draft')
  WITH CHECK (
    user_id = (select auth.uid())
    AND status IN ('draft','submitted')
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  );

ALTER POLICY las_delete_own_draft ON lesson_assignment_submissions
  USING (user_id = (select auth.uid()) AND status = 'draft');
