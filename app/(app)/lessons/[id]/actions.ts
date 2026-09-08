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

/* ── assignments ─────────────────────────────────────────────────────────── */

type AssignmentResult =
  | { ok: true; id: string; version: number; status: string }
  | { ok: false; error: string };

async function currentUserAndJourney(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, journeyId: null as string | null };
  const { data: journey } = await supabase
    .from('journeys').select('id').eq('user_id', user.id)
    .order('started_at', { ascending: false }).limit(1).maybeSingle();
  return { user, journeyId: journey?.id ?? null };
}

/** Highest version ever used for this assignment, submitted or not. */
async function nextVersion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string, moduleId: string, assignmentKey: string
): Promise<number> {
  const { data } = await supabase
    .from('lesson_assignment_submissions')
    .select('version')
    .eq('user_id', userId).eq('lesson_module_id', moduleId).eq('assignment_key', assignmentKey)
    .order('version', { ascending: false }).limit(1).maybeSingle();
  return (data?.version ?? 0) + 1;
}

/**
 * Write the open draft, creating it on first save.
 *
 * The partial unique index allows one open draft per assignment, so this
 * updates the existing draft rather than inserting beside it. A racing
 * autosave that loses the insert hits that index and is retried as an update,
 * which is the index doing its job rather than an error worth surfacing.
 */
export async function saveAssignmentDraft(
  moduleId: string, assignmentKey: string, body: string, wordCount: number
): Promise<AssignmentResult> {
  const supabase = await createClient();
  const { user, journeyId } = await currentUserAndJourney(supabase);
  if (!user) return { ok: false, error: 'Not signed in' };

  const { data: draft } = await supabase
    .from('lesson_assignment_submissions')
    .select('id, version')
    .eq('user_id', user.id).eq('lesson_module_id', moduleId)
    .eq('assignment_key', assignmentKey).eq('status', 'draft')
    .maybeSingle();

  if (draft) {
    const { error } = await supabase
      .from('lesson_assignment_submissions')
      .update({ body, word_count: wordCount })
      .eq('id', draft.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: draft.id, version: draft.version, status: 'draft' };
  }

  const version = await nextVersion(supabase, user.id, moduleId, assignmentKey);
  const { data: created, error } = await supabase
    .from('lesson_assignment_submissions')
    .insert({
      user_id: user.id, lesson_module_id: moduleId, assignment_key: assignmentKey,
      version, status: 'draft', body, word_count: wordCount, journey_id: journeyId,
    })
    .select('id, version').single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: created.id, version: created.version, status: 'draft' };
}

/**
 * Freeze the open draft as a submitted version.
 *
 * The RLS UPDATE policy inspects the old row, so this only succeeds while the
 * row is still a draft — the freeze is enforced by the database, not by this
 * function remembering to check.
 */
export async function submitAssignment(
  moduleId: string, assignmentKey: string, body: string, wordCount: number,
  sectionNumber: number, totalSections: number
): Promise<AssignmentResult> {
  const supabase = await createClient();
  const { user } = await currentUserAndJourney(supabase);
  if (!user) return { ok: false, error: 'Not signed in' };

  const { data: draft } = await supabase
    .from('lesson_assignment_submissions')
    .select('id, version')
    .eq('user_id', user.id).eq('lesson_module_id', moduleId)
    .eq('assignment_key', assignmentKey).eq('status', 'draft')
    .maybeSingle();
  if (!draft) return { ok: false, error: 'No open draft to submit' };

  const { error } = await supabase
    .from('lesson_assignment_submissions')
    .update({ body, word_count: wordCount, status: 'submitted', submitted_at: new Date().toISOString() })
    .eq('id', draft.id);
  if (error) return { ok: false, error: error.message };

  // Only the first submission completes the section. A revision is a second
  // thought about work already done, not a second piece of work.
  if (draft.version === 1) await markSectionComplete(moduleId, sectionNumber, totalSections);

  revalidatePath(`/lessons/${moduleId}`, 'layout');
  return { ok: true, id: draft.id, version: draft.version, status: 'submitted' };
}

/** Open a new draft seeded from the latest submission, for a revision. */
export async function startAssignmentRevision(
  moduleId: string, assignmentKey: string
): Promise<AssignmentResult> {
  const supabase = await createClient();
  const { user, journeyId } = await currentUserAndJourney(supabase);
  if (!user) return { ok: false, error: 'Not signed in' };

  const { data: existingDraft } = await supabase
    .from('lesson_assignment_submissions')
    .select('id, version').eq('user_id', user.id).eq('lesson_module_id', moduleId)
    .eq('assignment_key', assignmentKey).eq('status', 'draft').maybeSingle();
  if (existingDraft) {
    return { ok: true, id: existingDraft.id, version: existingDraft.version, status: 'draft' };
  }

  const { data: latest } = await supabase
    .from('lesson_assignment_submissions')
    .select('body, word_count').eq('user_id', user.id).eq('lesson_module_id', moduleId)
    .eq('assignment_key', assignmentKey).eq('status', 'submitted')
    .order('version', { ascending: false }).limit(1).maybeSingle();

  const version = await nextVersion(supabase, user.id, moduleId, assignmentKey);
  const { data: created, error } = await supabase
    .from('lesson_assignment_submissions')
    .insert({
      user_id: user.id, lesson_module_id: moduleId, assignment_key: assignmentKey,
      version, status: 'draft',
      body: latest?.body ?? '', word_count: latest?.word_count ?? 0,
      journey_id: journeyId,
    })
    .select('id, version').single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: created.id, version: created.version, status: 'draft' };
}

/**
 * Throw away the open draft and seed a fresh one from the latest submission.
 *
 * Only reachable from the stale-draft banner, where the reader has been shown
 * what they are discarding and has chosen to lose it. The delete is guarded by
 * `las_delete_own_draft`, so the database refuses to remove anything already
 * submitted even if this function asked it to.
 */
export async function restartAssignmentRevision(
  moduleId: string, assignmentKey: string
): Promise<AssignmentResult> {
  const supabase = await createClient();
  const { user } = await currentUserAndJourney(supabase);
  if (!user) return { ok: false, error: 'Not signed in' };

  // .select() so the deleted rows come back: a DELETE that matches nothing is
  // not an error in PostgREST, and without this the next call would hand back
  // the very draft this was meant to throw away — succeeding while doing
  // nothing, which is the failure that hides longest.
  const { data: removed, error: delError } = await supabase
    .from('lesson_assignment_submissions')
    .delete()
    .eq('user_id', user.id).eq('lesson_module_id', moduleId)
    .eq('assignment_key', assignmentKey).eq('status', 'draft')
    .select('id');
  if (delError) return { ok: false, error: delError.message };
  if (!removed || removed.length === 0) {
    return { ok: false, error: 'Could not discard the draft. Nothing was changed.' };
  }

  return startAssignmentRevision(moduleId, assignmentKey);
}
