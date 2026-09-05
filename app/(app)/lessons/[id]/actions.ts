'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type Result = { ok: true; completed: number[]; moduleDone: boolean } | { ok: false; error: string };

/**
 * Record a section as complete.
 *
 * Read-modify-write on a JSONB array, which is a lost-update race if two tabs
 * finish two sections at once. It is deliberately not guarded with a lock:
 * the write is idempotent and additive, the partial unique index guarantees
 * one row per (journey, module), and the cost of the race is a checkmark that
 * needs re-clicking rather than anything lost. A transaction here would buy
 * correctness nobody would notice at the price of a round trip on every
 * section.
 */
export async function markSectionComplete(
  moduleId: string, sectionNumber: number, totalSections: number
): Promise<Result> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not signed in' };

  const { data: journey } = await supabase
    .from('journeys').select('id, track_id').eq('user_id', user.id)
    .order('started_at', { ascending: false }).limit(1).maybeSingle();
  if (!journey) return { ok: false, error: 'No active journey' };

  const { data: mod } = await supabase
    .from('lesson_modules').select('pillar_id').eq('id', moduleId).maybeSingle();

  const { data: existing } = await supabase
    .from('lesson_progress').select('id, metadata')
    .eq('journey_id', journey.id).eq('lesson_module_id', moduleId).maybeSingle();

  const before = Array.isArray((existing?.metadata as { sections_completed?: unknown })?.sections_completed)
    ? ((existing!.metadata as { sections_completed: unknown[] }).sections_completed
        .filter((n): n is number => Number.isInteger(n) && (n as number) > 0))
    : [];

  const completed = Array.from(new Set(before.concat(sectionNumber))).sort((a, b) => a - b);
  const moduleDone = completed.length >= totalSections;

  const row = {
    journey_id: journey.id,
    lesson_module_id: moduleId,
    pillar_id: mod?.pillar_id ?? null,
    status: moduleDone ? 'completed' : 'started',
    metadata: { sections_completed: completed },
    // Only stamped when the whole module is done — a per-section timestamp
    // would make "when did you finish this" mean something different here
    // than it does for every legacy row in the table.
    completed_at: moduleDone ? new Date().toISOString() : null,
  };

  const { error } = existing
    ? await supabase.from('lesson_progress').update(row).eq('id', existing.id)
    : await supabase.from('lesson_progress').insert(row);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/lessons/${moduleId}`, 'layout');
  revalidatePath('/lessons');

  return { ok: true, completed, moduleDone };
}
