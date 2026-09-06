import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { parseBlocks, type AssignmentPromptBlock } from '@/lib/lesson-blocks';
import { splitBlocksBySection } from '@/lib/lessons/split-sections';

// Everything the dashboard reads, in one pass.
//
// One function rather than six because the blocks share almost all of their
// inputs — modules, progress and submissions each feed two or three of them —
// and fetching per block would multiply the same queries across the page.

export type NextStepMode = 'assessment' | 'sequential';

export type ModuleCard = {
  id: string;
  slug: string;
  moduleNumber: number | null;
  isStartingPoint: boolean;
  title: string;
  subtitle: string | null;
  pillarId: string | null;
  pillarName: string | null;
  pillarSlug: string | null;
  pillarSortOrder: number | null;
  difficulty: string;
  minutes: number;
  sectionCount: number;
  completedSections: number[];
  status: 'not_started' | 'in_progress' | 'completed';
};

export type SubmissionCard = {
  moduleId: string;
  moduleTitle: string;
  assignmentKey: string;
  assignmentTitle: string;
  sectionNumber: number | null;
  version: number;
  submittedAt: string;
  excerpt: string;
};

export type PillarScore = {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  sortOrder: number;
  weakestSubDomain: { name: string; score: number } | null;
};

export type NextStep =
  | { kind: 'module'; module: ModuleCard; reason: string }
  | { kind: 'all_done' };

export type DashboardData = {
  firstName: string;
  lang: 'en' | 'fr';
  nextStepMode: NextStepMode;
  journeyId: string | null;
  trackName: string;
  modules: ModuleCard[];
  submissions: SubmissionCard[];
  submissionCount: number;
  pillars: PillarScore[];
  assessmentTakenAt: string | null;
  /** Most recent submission or section completion, whichever is later. Null
      for a reader who has not done anything yet. */
  lastActivityAt: string | null;
  lastActivityKind: 'submitted' | 'read' | null;
  nextStep: NextStep;
};

/** Strip markdown to a plain-text preview. */
function excerpt(body: string, chars = 100): string {
  const plain = body
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length <= chars ? plain : `${plain.slice(0, chars).trimEnd()}…`;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, preferred_language, next_step_mode')
    .eq('id', user.id)
    .single();

  const lang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';
  const nextStepMode: NextStepMode = profile?.next_step_mode === 'sequential' ? 'sequential' : 'assessment';
  const firstName =
    (profile?.full_name?.trim().split(/\s+/)[0]) ||
    (profile?.email?.split('@')[0]) ||
    (lang === 'en' ? 'there' : 'vous');

  const { data: journey } = await supabase
    .from('journeys')
    .select('id, track_id, tracks(name_en, name_fr)')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const journeyId = journey?.id ?? null;
  const track = journey?.tracks as unknown as { name_en: string; name_fr: string } | null;
  const trackName = (lang === 'en' ? track?.name_en : track?.name_fr) || track?.name_en || '';

  /* ── modules + progress ─────────────────────────────────────────────────── */
  const { data: modRows } = journey?.track_id
    ? await supabase
        .from('lesson_modules')
        .select('id, slug, module_number, is_starting_point, title_en, title_fr, subtitle_en, subtitle_fr, difficulty, estimated_duration_minutes, body_blocks, pillar_id, pillars(name_en, name_fr, slug, sort_order)')
        .eq('track_id', journey.track_id)
        .eq('is_published', true)
        .order('is_starting_point', { ascending: false })
        .order('module_number', { ascending: true, nullsFirst: false })
    : { data: [] };

  const { data: progressRows } = journeyId
    ? await supabase
        .from('lesson_progress')
        .select('lesson_module_id, status, metadata, completed_at')
        .eq('journey_id', journeyId)
        .not('lesson_module_id', 'is', null)
    : { data: [] };

  const progressByModule = new Map<string, { completed: number[]; status: string; completedAt: string | null }>();
  for (const row of progressRows ?? []) {
    const r = row as { lesson_module_id: string; status: string; metadata: unknown; completed_at: string | null };
    const raw = (r.metadata as { sections_completed?: unknown } | null)?.sections_completed;
    const completed = Array.isArray(raw) ? raw.filter((n): n is number => Number.isInteger(n)) : [];
    progressByModule.set(r.lesson_module_id, { completed, status: r.status, completedAt: r.completed_at });
  }

  // Section boundaries and assignment titles both come from the blocks, so
  // they are derived once here and reused by the grid and the submissions list.
  const assignmentTitles = new Map<string, { title: string; sectionNumber: number }>();

  const modules: ModuleCard[] = (modRows ?? []).map((m) => {
    const row = m as unknown as {
      id: string; slug: string; module_number: number | null; is_starting_point: boolean;
      title_en: string; title_fr: string | null; subtitle_en: string | null; subtitle_fr: string | null;
      difficulty: string; estimated_duration_minutes: number | null; body_blocks: unknown;
      pillar_id: string | null;
      pillars: { name_en: string; name_fr: string; slug: string; sort_order: number } | null;
    };

    const { sections } = splitBlocksBySection(parseBlocks(row.body_blocks));
    for (const s of sections) {
      for (const b of s.blocks) {
        if (b.type === 'assignment_prompt') {
          const a = b as AssignmentPromptBlock;
          assignmentTitles.set(`${row.id}:${a.assignment_key}`, { title: a.title, sectionNumber: s.number });
        }
      }
    }

    const prog = progressByModule.get(row.id);
    const completedSections = (prog?.completed ?? []).filter((n) => n >= 1 && n <= sections.length);
    const status: ModuleCard['status'] =
      completedSections.length >= sections.length && sections.length > 0 ? 'completed'
      : completedSections.length > 0 ? 'in_progress'
      : 'not_started';

    return {
      id: row.id,
      slug: row.slug,
      moduleNumber: row.module_number,
      isStartingPoint: row.is_starting_point,
      title: (lang === 'en' ? row.title_en : row.title_fr) || row.title_en,
      subtitle: (lang === 'en' ? row.subtitle_en : row.subtitle_fr) || row.subtitle_en,
      pillarId: row.pillar_id,
      pillarName: row.pillars ? (lang === 'en' ? row.pillars.name_en : row.pillars.name_fr) : null,
      pillarSlug: row.pillars?.slug ?? null,
      pillarSortOrder: row.pillars?.sort_order ?? null,
      difficulty: row.difficulty,
      minutes: row.estimated_duration_minutes ?? sections.reduce((n, s) => n + s.readingMinutes, 0),
      sectionCount: sections.length,
      completedSections,
      status,
    };
  });

  /* ── submissions ────────────────────────────────────────────────────────── */
  // Keyed by (module, assignment) rather than assignment_key alone: 'a1' is
  // only unique within a module, so grouping on it would fold Module 0's
  // intention and Module 1's manifesto into one entry.
  const { data: subRows } = await supabase
    .from('lesson_assignment_submissions')
    .select('lesson_module_id, assignment_key, version, body, submitted_at')
    .eq('user_id', user.id)
    .eq('status', 'submitted')
    .order('submitted_at', { ascending: false });

  const seen = new Set<string>();
  const allSubmissions: SubmissionCard[] = [];
  for (const row of subRows ?? []) {
    const r = row as { lesson_module_id: string; assignment_key: string; version: number; body: string; submitted_at: string };
    const key = `${r.lesson_module_id}:${r.assignment_key}`;
    if (seen.has(key)) continue;          // ordered newest first, so this is the latest version
    seen.add(key);
    const meta = assignmentTitles.get(key);
    const mod = modules.find((m) => m.id === r.lesson_module_id);
    allSubmissions.push({
      moduleId: r.lesson_module_id,
      moduleTitle: mod?.title ?? '',
      assignmentKey: r.assignment_key,
      assignmentTitle: meta?.title ?? (lang === 'en' ? 'Assignment' : 'Devoir'),
      sectionNumber: meta?.sectionNumber ?? null,
      version: r.version,
      submittedAt: r.submitted_at,
      excerpt: excerpt(r.body ?? ''),
    });
  }

  /* ── pillars ────────────────────────────────────────────────────────────── */
  // Scored per journey, not per user: pillar_scores has no user_id, so the
  // journey is the only route from this reader to their scores.
  const { data: scoreRows } = journeyId
    ? await supabase
        .from('pillar_scores')
        .select('pillar_id, score, max_score, sub_domain_scores, computed_at, pillars(name_en, name_fr, sort_order)')
        .eq('journey_id', journeyId)
    : { data: [] };

  const pillars: PillarScore[] = (scoreRows ?? [])
    .map((row) => {
      const r = row as unknown as {
        pillar_id: string; score: string; max_score: string; sub_domain_scores: Record<string, number> | null;
        pillars: { name_en: string; name_fr: string; sort_order: number } | null;
      };
      const subs = Object.entries(r.sub_domain_scores ?? {});
      subs.sort((a, b) => a[1] - b[1]);
      return {
        id: r.pillar_id,
        name: r.pillars ? (lang === 'en' ? r.pillars.name_en : r.pillars.name_fr) : '',
        score: Number(r.score),
        maxScore: Number(r.max_score) || 5,
        sortOrder: r.pillars?.sort_order ?? 99,
        weakestSubDomain: subs.length ? { name: subs[0][0], score: subs[0][1] } : null,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const assessmentTakenAt =
    (scoreRows?.[0] as unknown as { computed_at?: string } | undefined)?.computed_at ?? null;

  /* ── last activity ──────────────────────────────────────────────────────── */
  const lastSubmittedAt = allSubmissions[0]?.submittedAt ?? null;
  const lastCompletedAt = (progressRows ?? [])
    .map((r) => (r as { completed_at: string | null }).completed_at)
    .filter((d): d is string => !!d)
    .sort()
    .pop() ?? null;

  let lastActivityAt: string | null = null;
  let lastActivityKind: DashboardData['lastActivityKind'] = null;
  if (lastSubmittedAt || lastCompletedAt) {
    if (!lastCompletedAt || (lastSubmittedAt && lastSubmittedAt >= lastCompletedAt)) {
      lastActivityAt = lastSubmittedAt; lastActivityKind = 'submitted';
    } else {
      lastActivityAt = lastCompletedAt; lastActivityKind = 'read';
    }
  }

  return {
    firstName, lang, nextStepMode, journeyId, trackName,
    modules,
    submissions: allSubmissions.slice(0, 5),
    submissionCount: allSubmissions.length,
    pillars, assessmentTakenAt,
    lastActivityAt, lastActivityKind,
    nextStep: pickNextStep(modules, pillars, nextStepMode, lang),
  };
}

/**
 * Which module to offer next.
 *
 * The starting point always comes first while it is unfinished — it is the
 * orientation the rest assumes, in either mode.
 *
 * In assessment mode the weakest pillar leads. Where no unfinished module
 * belongs to that pillar the search falls through to the next-weakest rather
 * than giving up, because "nothing to recommend" is a worse answer than "the
 * next most useful thing". Sequential mode simply walks the numbers.
 */
export function pickNextStep(
  modules: ModuleCard[], pillars: PillarScore[], mode: NextStepMode, lang: 'en' | 'fr'
): NextStep {
  const unfinished = modules.filter((m) => m.status !== 'completed');
  if (unfinished.length === 0) return { kind: 'all_done' };

  const start = unfinished.find((m) => m.isStartingPoint);
  if (start) {
    return {
      kind: 'module',
      module: start,
      reason: lang === 'en'
        ? 'The orientation the rest of the programme assumes. It sets the definition of leadership everything else builds on.'
        : "L'orientation que suppose le reste du programme. Elle pose la définition du leadership sur laquelle tout repose.",
    };
  }

  const numbered = unfinished.filter((m) => !m.isStartingPoint);
  if (numbered.length === 0) return { kind: 'all_done' };

  const byNumber = [...numbered].sort(
    (a, b) => (a.moduleNumber ?? 9999) - (b.moduleNumber ?? 9999)
  );

  if (mode === 'sequential') {
    const m = byNumber[0];
    const prior = modules.find((x) => !x.isStartingPoint && (x.moduleNumber ?? 0) === (m.moduleNumber ?? 0) - 1);
    return {
      kind: 'module',
      module: m,
      reason: lang === 'en'
        ? `You're on Module ${m.moduleNumber} of the arc.${prior ? ` Building on ${prior.title}.` : ' The first step in the sequence.'}`
        : `Vous êtes au Module ${m.moduleNumber} du parcours.${prior ? ` Dans la continuité de ${prior.title}.` : ' La première étape de la séquence.'}`,
    };
  }

  // assessment: weakest pillar first, falling through to the next-weakest.
  const weakestFirst = [...pillars].sort((a, b) => a.score - b.score);
  for (const p of weakestFirst) {
    const match = byNumber.find((m) => m.pillarId === p.id);
    if (!match) continue;
    const sub = p.weakestSubDomain;
    const pretty = sub ? sub.name.replace(/[-_]+/g, ' ').trim() : null;
    return {
      kind: 'module',
      module: match,
      reason: lang === 'en'
        ? `Your ${p.name} sits at ${p.score.toFixed(1)}/${p.maxScore.toFixed(0)}${pretty ? `, and ${pretty} is the weakest part of it at ${sub!.score.toFixed(1)}` : ''}. This module works on exactly that.`
        : `Votre ${p.name} est à ${p.score.toFixed(1)}/${p.maxScore.toFixed(0)}${pretty ? `, et ${pretty} en est la partie la plus faible à ${sub!.score.toFixed(1)}` : ''}. Ce module travaille précisément cela.`,
    };
  }

  // No module maps to any scored pillar yet — offer the next number rather
  // than nothing.
  const m = byNumber[0];
  return {
    kind: 'module',
    module: m,
    reason: lang === 'en'
      ? `Next in the arc while the library grows toward your weakest pillars.`
      : `La suite du parcours, en attendant que la bibliothèque couvre vos piliers les plus faibles.`,
  };
}
