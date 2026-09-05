-- A module that comes before the numbered curriculum rather than inside it.
--
-- Marked with a flag rather than inferred from module_number = 0, because
-- "this is where you begin" is editorial and should be set deliberately. A
-- track could one day open with something numbered 1, or carry an unnumbered
-- orientation piece, and neither should depend on a magic number.

ALTER TABLE lesson_modules
  ADD COLUMN IF NOT EXISTS is_starting_point BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN lesson_modules.is_starting_point IS
  'Sorts above the numbered modules and is offered first. Editorial, not derived from module_number.';

-- The original CHECK was `module_number IS NULL OR module_number > 0`, written
-- when 1 was the lowest number anyone had asked for. Module 0 is a real
-- number in this curriculum, not a placeholder, so the floor moves to 0.
--
-- Still excludes negatives: a module numbered -1 would be a mistake, and the
-- constraint is here to catch mistakes rather than to express taste.
ALTER TABLE lesson_modules DROP CONSTRAINT IF EXISTS lesson_modules_module_number_ck;
ALTER TABLE lesson_modules
  ADD CONSTRAINT lesson_modules_module_number_ck
  CHECK (module_number IS NULL OR module_number >= 0);

-- Ordering the lessons list: starting points first, then by number. Indexed
-- because that is the sort the list actually performs.
CREATE INDEX IF NOT EXISTS lesson_modules_ordering_idx
  ON lesson_modules (track_id, is_starting_point DESC, module_number)
  WHERE is_published;

-- At most one starting point per track. Two would leave "sorts to the top"
-- with no defined answer, and the list would pick one arbitrarily rather than
-- surfacing the mistake. Cheaper to catch here than to notice in production.
CREATE UNIQUE INDEX IF NOT EXISTS lesson_modules_one_starting_point_idx
  ON lesson_modules (track_id)
  WHERE is_starting_point;
