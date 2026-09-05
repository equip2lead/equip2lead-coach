-- Let lesson_progress track authored modules as well as RAG documents.
--
-- document_id references knowledge_documents, so a module id could never be
-- written into it: the insert failed the foreign key rather than storing
-- anything wrong, which is the right failure but not a usable one.
--
-- Additive rather than a widened polymorphic column. Dropping the foreign key
-- to let document_id point at either table would cost referential integrity
-- everywhere in exchange for one nullable column here, and deleting a
-- knowledge document would silently orphan progress instead of cascading it.
--
-- A row now points at exactly one of the two, enforced rather than assumed.

ALTER TABLE lesson_progress
  ADD COLUMN IF NOT EXISTS lesson_module_id UUID REFERENCES lesson_modules(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Exactly one target. Without this the table would quietly accept a row that
-- points at both, or at neither, and every reader would have to decide for
-- itself what that meant.
ALTER TABLE lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_one_target_ck;
ALTER TABLE lesson_progress
  ADD CONSTRAINT lesson_progress_one_target_ck
  CHECK (num_nonnulls(document_id, lesson_module_id) = 1);

-- The document side already has UNIQUE (journey_id, document_id). This is its
-- counterpart. Partial because module rows leave document_id null, and NULLs
-- are distinct in a unique index — without the WHERE clause the two halves of
-- the table would not constrain each other correctly.
CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_journey_module_idx
  ON lesson_progress (journey_id, lesson_module_id)
  WHERE lesson_module_id IS NOT NULL;

COMMENT ON COLUMN lesson_progress.lesson_module_id IS
  'Set when this row tracks an authored module. Mutually exclusive with document_id.';
COMMENT ON COLUMN lesson_progress.metadata IS
  'Module progress detail, currently {"sections_completed": [1,2,3]}. Null for legacy document rows.';

-- No RLS change: the existing policies gate on owns_journey(journey_id) OR
-- is_admin(), which is true of a row regardless of which target it points at.
