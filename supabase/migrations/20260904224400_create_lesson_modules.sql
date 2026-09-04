-- Rich, block-structured authored curriculum.
--
-- Deliberately a new table rather than columns on knowledge_documents. That
-- table is the RAG corpus: it carries on_document_insert_queue_embedding and
-- on_document_update_requeue_embedding, so a 489-block module written there
-- would queue itself for vector embedding and pollute what the AI Coach
-- retrieves from. The two are different kinds of thing — one is retrieved,
-- the other is read — and they now live apart.
--
-- Bilingual via paired columns rather than one row per language, matching
-- tracks and pillars. A week in coaching_plans.plan_data points at one
-- module_id, so a module has to be a single row that carries both languages.

CREATE TABLE lesson_modules (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stable human identity. Block ids are hashed from it, so it must never
  -- change once a module has been loaded and read against.
  slug                        TEXT NOT NULL,

  track_id                    UUID NOT NULL REFERENCES tracks(id),
  pillar_id                   UUID          REFERENCES pillars(id),
  module_number               INTEGER,

  title_en                    TEXT NOT NULL,
  title_fr                    TEXT,
  subtitle_en                 TEXT,
  subtitle_fr                 TEXT,

  -- Flat LessonBlock[] per lib/lesson-blocks.ts. NULL on the _fr side means
  -- "not translated yet" — the reader is told so rather than shown English.
  body_blocks                 JSONB,
  body_blocks_fr              JSONB,

  estimated_duration_minutes  INTEGER,
  cover_image_url             TEXT,
  cover_image_alt             TEXT,

  difficulty                  TEXT NOT NULL DEFAULT 'beginner',

  -- Provenance: which RAG document this module was authored from.
  -- SET NULL, not CASCADE — losing the source must never delete the module.
  source_document_id          UUID REFERENCES knowledge_documents(id) ON DELETE SET NULL,

  is_published                BOOLEAN NOT NULL DEFAULT false,
  sort_order                  INTEGER,

  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT lesson_modules_slug_key UNIQUE (slug),

  CONSTRAINT lesson_modules_difficulty_ck
    CHECK (difficulty IN ('beginner','intermediate','advanced')),

  -- The renderer maps over these, so a non-array is a runtime crash rather
  -- than a bad render. Cheap to enforce here, and deliberately shallow:
  -- block shapes are validated in the application, so adding a block type
  -- never needs a migration.
  CONSTRAINT lesson_modules_blocks_are_arrays_ck CHECK (
    (body_blocks    IS NULL OR jsonb_typeof(body_blocks)    = 'array') AND
    (body_blocks_fr IS NULL OR jsonb_typeof(body_blocks_fr) = 'array')
  ),

  -- Can't publish an empty module.
  CONSTRAINT lesson_modules_published_has_body_ck
    CHECK (NOT is_published OR body_blocks IS NOT NULL),

  CONSTRAINT lesson_modules_module_number_ck
    CHECK (module_number IS NULL OR module_number > 0)
);

-- One "Module 1" per track, but modules may exist unnumbered while drafting.
CREATE UNIQUE INDEX lesson_modules_track_number_idx
  ON lesson_modules (track_id, module_number)
  WHERE module_number IS NOT NULL;

CREATE INDEX lesson_modules_track_pillar_idx
  ON lesson_modules (track_id, pillar_id);

CREATE INDEX lesson_modules_browse_idx
  ON lesson_modules (track_id, sort_order)
  WHERE is_published;

-- Same shape as coaching_plans, journeys, knowledge_documents and profiles:
-- a BEFORE UPDATE trigger on the shared update_updated_at().
CREATE TRIGGER set_lesson_modules_updated_at
  BEFORE UPDATE ON lesson_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE lesson_modules IS
  'Rich, block-structured authored curriculum. Distinct from knowledge_documents, which is the RAG corpus.';
COMMENT ON COLUMN lesson_modules.slug IS
  'Immutable. Block ids are hashed from it; changing it orphans scroll anchors.';
COMMENT ON COLUMN lesson_modules.body_blocks IS
  'Ordered array of typed lesson blocks (English), flat shape per lib/lesson-blocks.ts.';
COMMENT ON COLUMN lesson_modules.body_blocks_fr IS
  'French blocks. NULL means not yet translated — the reader is told so rather than shown English.';
COMMENT ON COLUMN lesson_modules.source_document_id IS
  'The knowledge_documents row this module was authored from. Provenance only; no content dependency.';

ALTER TABLE lesson_modules ENABLE ROW LEVEL SECURITY;

-- Published curriculum is readable by everyone, the same shape as
-- read_active_knowledge_documents. Admins additionally see drafts so a module
-- can be previewed in the real renderer before it goes live.
CREATE POLICY lesson_modules_select ON lesson_modules FOR SELECT
  USING (is_published = true OR is_admin());

-- Authoring is admin-only. There is no author-owns-module concept here.
CREATE POLICY lesson_modules_insert ON lesson_modules FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY lesson_modules_update ON lesson_modules FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());

-- super_admin rather than admin: deleting a module cascades away every
-- rating and every submission attached to it.
CREATE POLICY lesson_modules_delete ON lesson_modules FOR DELETE
  USING (is_super_admin());
