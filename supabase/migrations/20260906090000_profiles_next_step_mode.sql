-- How the dashboard picks the module to offer next.
--
-- 'assessment' honours what the assessment found: the weakest pillar first.
-- 'sequential' walks the numbered arc in order. Both are defensible ways to
-- move through a curriculum, and which one a reader wants is about them
-- rather than about the content, so it is a setting rather than a rule.
--
-- Defaults to 'assessment' because the assessment has already been taken and
-- its result is the more informative of the two.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS next_step_mode TEXT NOT NULL DEFAULT 'assessment';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_next_step_mode_ck;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_next_step_mode_ck
  CHECK (next_step_mode IN ('assessment', 'sequential'));

COMMENT ON COLUMN profiles.next_step_mode IS
  'Dashboard next-step strategy: assessment (weakest pillar first) or sequential (by module number).';
