import 'server-only';
import { createClient } from '@/lib/supabase/server';

/** What lesson_progress.metadata holds for a module row. */
export type ModuleProgressMeta = { sections_completed: number[] };

export type ModuleProgress = {
  completed: number[];
  status: string | null;
  /** The lowest section not yet done, or null when the module is finished. */
  nextSection: (total: number) => number | null;
};

function readCompleted(metadata: unknown): number[] {
  const raw = (metadata as ModuleProgressMeta | null)?.sections_completed;
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.filter((n): n is number => Number.isInteger(n) && n > 0))).sort((a, b) => a - b);
}

export async function getModuleProgress(journeyId: string | null, moduleId: string): Promise<ModuleProgress> {
  const empty: ModuleProgress = { completed: [], status: null, nextSection: (t) => (t > 0 ? 1 : null) };
  if (!journeyId) return empty;

  const supabase = await createClient();
  const { data } = await supabase
    .from('lesson_progress')
    .select('status, metadata')
    .eq('journey_id', journeyId)
    .eq('lesson_module_id', moduleId)
    .maybeSingle();

  if (!data) return empty;
  const completed = readCompleted(data.metadata);

  return {
    completed,
    status: data.status,
    nextSection: (total) => {
      for (let n = 1; n <= total; n++) if (!completed.includes(n)) return n;
      return null;
    },
  };
}

/** Completed-section counts for many modules at once, for the lessons list. */
export async function getModuleProgressMap(
  journeyId: string | null, moduleIds: string[]
): Promise<Record<string, number[]>> {
  if (!journeyId || moduleIds.length === 0) return {};

  const supabase = await createClient();
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_module_id, metadata')
    .eq('journey_id', journeyId)
    .in('lesson_module_id', moduleIds);

  const map: Record<string, number[]> = {};
  for (const row of data ?? []) {
    const r = row as { lesson_module_id: string | null; metadata: unknown };
    if (r.lesson_module_id) map[r.lesson_module_id] = readCompleted(r.metadata);
  }
  return map;
}
