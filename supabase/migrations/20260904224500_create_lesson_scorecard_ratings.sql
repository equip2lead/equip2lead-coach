-- In-lesson scorecard ratings. Append-only: one row per rating event, never
-- updated, so "you rated Self-Discipline 4/10 in September" stays true
-- forever.
--
-- Deliberately NOT the existing pillar_scores table. That one holds
-- assessment output — computed, journey-scoped, one row per pillar. This one
-- holds a person rating themselves inside a lesson. Same word, different
-- thing, and overloading the table would make "your score" ambiguous.
--
-- Keyed on user_id rather than journey_id. Journeys can be completed,
-- abandoned and restarted, and a journey-scoped key would cascade a person's
-- rating history away — the exact history this table exists to keep. The
-- person outlives the journey.
--
-- scorecard_key and item_key come from the block payload, not from the block
-- id. Block ids are hashed from (slug, index, type), so inserting a paragraph
-- re-ids everything after it; payload keys survive that. Nothing in this
-- table depends on a block id.

CREATE TABLE lesson_scorecard_ratings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_module_id  UUID NOT NULL REFERENCES lesson_modules(id) ON DELETE CASCADE,

  scorecard_key     TEXT NOT NULL,
  item_key          TEXT NOT NULL,

  score             INTEGER NOT NULL,
  score_max         INTEGER NOT NULL DEFAULT 10,

  -- Provenance only. SET NULL rather than CASCADE so deleting a journey
  -- never destroys the history this table exists for.
  journey_id        UUID REFERENCES journeys(id) ON DELETE SET NULL,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT lesson_scorecard_ratings_max_ck
    CHECK (score_max BETWEEN 2 AND 100),

  -- Range is validated against this row's own score_max, so a scorecard can
  -- mix a /10 and a /5 item without a second table.
  CONSTRAINT lesson_scorecard_ratings_score_ck
    CHECK (score >= 1 AND score <= score_max)
);

-- The read the UI does on every lesson open: "latest score for this item",
-- to pre-fill the slider. DESC makes it an index-only lookup, not a sort.
CREATE INDEX lesson_scorecard_ratings_latest_idx
  ON lesson_scorecard_ratings (user_id, lesson_module_id, scorecard_key, item_key, created_at DESC);

-- The AI Coach read: everything this person has ever rated, newest first.
CREATE INDEX lesson_scorecard_ratings_history_idx
  ON lesson_scorecard_ratings (user_id, created_at DESC);

COMMENT ON TABLE lesson_scorecard_ratings IS
  'Append-only. One row per rating event; correcting a score means recording a new one. Never UPDATE.';
COMMENT ON COLUMN lesson_scorecard_ratings.scorecard_key IS
  'ScorecardBlock.scorecard_key from the block payload. Independent of block ids by design.';
COMMENT ON COLUMN lesson_scorecard_ratings.item_key IS
  'ScorecardBlock.items[].key from the block payload. Independent of block ids by design.';
COMMENT ON COLUMN lesson_scorecard_ratings.journey_id IS
  'Which journey this was rated during. Provenance only — history is user-scoped and survives journey deletion.';

-- No updated_at and no trigger: an append-only table has nothing to update.

ALTER TABLE lesson_scorecard_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY lesson_scorecard_ratings_select ON lesson_scorecard_ratings FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Nobody rates on someone else's behalf, admins included. A self-assessment
-- attributed to you that you did not enter is worse than no score at all.
CREATE POLICY lesson_scorecard_ratings_insert ON lesson_scorecard_ratings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- No UPDATE policy and no DELETE policy, deliberately. With RLS enabled and
-- no policy for a command, that command is refused. Immutability is enforced
-- by the database rather than by everyone remembering.
