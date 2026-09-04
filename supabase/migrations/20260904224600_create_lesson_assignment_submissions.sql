-- Versioned assignment submissions. Editing is always allowed while a
-- response is a draft; submitting freezes it, and revising means recording a
-- new version rather than overwriting the last one.
--
-- User-scoped for the same reason as lesson_scorecard_ratings: a manifesto
-- someone wrote must survive completing or restarting a journey.
--
-- assignment_key comes from the block payload (AssignmentPromptBlock
-- .assignment_key, assigned 'a1', 'a2', ... by ordinal at ingestion), never
-- from a block id. Block ids are hashed from (slug, index, type), so
-- inserting one paragraph re-ids every block after it; keying submitted work
-- on a block id would orphan it on the next content edit.

CREATE TABLE lesson_assignment_submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_module_id  UUID NOT NULL REFERENCES lesson_modules(id) ON DELETE CASCADE,

  assignment_key    TEXT NOT NULL DEFAULT 'a1',

  version           INTEGER NOT NULL DEFAULT 1,
  status            TEXT NOT NULL DEFAULT 'draft',

  body              TEXT NOT NULL DEFAULT '',
  word_count        INTEGER NOT NULL DEFAULT 0,

  -- Optional per-prompt structure keyed by prompts[].number, for when the UI
  -- captures the four manifesto questions separately rather than as one body.
  responses         JSONB,

  submitted_at      TIMESTAMPTZ,
  reviewer_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewer_comment  TEXT,
  reviewed_at       TIMESTAMPTZ,

  -- Provenance only. SET NULL so deleting a journey never destroys the work.
  journey_id        UUID REFERENCES journeys(id) ON DELETE SET NULL,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT las_status_ck  CHECK (status IN ('draft','submitted','reviewed')),
  CONSTRAINT las_version_ck CHECK (version >= 1),
  CONSTRAINT las_words_ck   CHECK (word_count >= 0),

  -- A draft has not been submitted; anything past draft has a submit time.
  CONSTRAINT las_submitted_at_ck CHECK (
    (status = 'draft'                   AND submitted_at IS NULL) OR
    (status IN ('submitted','reviewed') AND submitted_at IS NOT NULL)
  ),
  CONSTRAINT las_reviewed_at_ck
    CHECK (status <> 'reviewed' OR reviewed_at IS NOT NULL),

  CONSTRAINT las_responses_object_ck
    CHECK (responses IS NULL OR jsonb_typeof(responses) = 'object')
);

-- Version history is per (person, module, assignment).
CREATE UNIQUE INDEX las_version_idx
  ON lesson_assignment_submissions (user_id, lesson_module_id, assignment_key, version);

-- At most one open draft. Without this, two autosaves racing each other
-- create two draft rows and "the current draft" stops having a single
-- answer. Submitted and reviewed rows are unaffected, so history stacks up
-- freely underneath.
CREATE UNIQUE INDEX las_one_open_draft_idx
  ON lesson_assignment_submissions (user_id, lesson_module_id, assignment_key)
  WHERE status = 'draft';

CREATE INDEX las_user_recent_idx
  ON lesson_assignment_submissions (user_id, updated_at DESC);

-- Admin review queue.
CREATE INDEX las_review_queue_idx
  ON lesson_assignment_submissions (status, submitted_at DESC)
  WHERE status = 'submitted';

CREATE TRIGGER set_lesson_assignment_submissions_updated_at
  BEFORE UPDATE ON lesson_assignment_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE lesson_assignment_submissions IS
  'Versioned assignment work. Drafts are editable; submitted versions are frozen by RLS. Revising creates a new version.';
COMMENT ON COLUMN lesson_assignment_submissions.version IS
  'Monotonic per (user, module, assignment). Highest version is current; lower versions are frozen history.';
COMMENT ON COLUMN lesson_assignment_submissions.assignment_key IS
  'AssignmentPromptBlock.assignment_key from the block payload. Independent of block ids by design.';

ALTER TABLE lesson_assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY las_select ON lesson_assignment_submissions FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Every row is born a draft. Submitting is an UPDATE; a new version is a new
-- INSERT, which las_one_open_draft_idx permits only once the previous version
-- has left draft.
CREATE POLICY las_insert ON lesson_assignment_submissions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'draft'
    AND submitted_at IS NULL
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  );

-- The freeze. USING inspects the OLD row: an author may edit only while the
-- row is still a draft, so a submitted row is immutable to its author.
-- WITH CHECK inspects the NEW row: the author may move draft -> submitted but
-- never back, never to 'reviewed', and never to another user's id.
CREATE POLICY las_update_author ON lesson_assignment_submissions FOR UPDATE
  USING (user_id = auth.uid() AND status = 'draft')
  WITH CHECK (
    user_id = auth.uid()
    AND status IN ('draft','submitted')
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
  );

-- Reviewers record a comment and mark reviewed. Kept as a separate policy:
-- multiple permissive policies on one command are OR-ed, so the author rule
-- above stays readable instead of growing an admin branch.
CREATE POLICY las_update_admin ON lesson_assignment_submissions FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());

-- An author may abandon a draft. Nothing else is deletable by anyone short of
-- super_admin — deleting submitted work is what makes history untrustworthy.
CREATE POLICY las_delete_own_draft ON lesson_assignment_submissions FOR DELETE
  USING (user_id = auth.uid() AND status = 'draft');

CREATE POLICY las_delete_super ON lesson_assignment_submissions FOR DELETE
  USING (is_super_admin());
