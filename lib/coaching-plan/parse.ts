// Reads coaching_plans.plan_data. Pure and dependency-free, so the page, the
// dashboard card and scripts/test-coaching-plan.mjs all share one definition of
// what a complete plan is. plan_data comes from an AI response stored as JSON, so
// nothing about its shape is taken on trust.

export const TOTAL_WEEKS = 12;

export type PlanExercise = { type: string; titleEn: string; titleFr: string };
export type PlanWeek = {
  week: number;
  focus: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  moduleId: string | null;
  exercises: PlanExercise[];
};

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

function parseWeek(raw: unknown): PlanWeek | null {
  if (!raw || typeof raw !== 'object') return null;
  const w = raw as Record<string, unknown>;
  const week = w.week;
  const titleEn = text(w.title_en);
  if (typeof week !== 'number' || !Number.isInteger(week) || week < 1 || week > TOTAL_WEEKS) return null;
  if (!titleEn) return null;

  const exercises = (Array.isArray(w.exercises) ? w.exercises : [])
    .map((e): PlanExercise | null => {
      if (!e || typeof e !== 'object') return null;
      const x = e as Record<string, unknown>;
      const en = text(x.title_en);
      return en ? { type: text(x.type), titleEn: en, titleFr: text(x.title_fr) } : null;
    })
    .filter((e): e is PlanExercise => e !== null);

  return {
    week,
    focus: text(w.focus),
    titleEn,
    titleFr: text(w.title_fr),
    descEn: text(w.desc_en),
    descFr: text(w.desc_fr),
    moduleId: text(w.module_id) || null,
    exercises,
  };
}

/** The valid weeks in order. A repeated week number keeps its last entry. */
export function parseWeeks(planData: unknown): PlanWeek[] {
  const raw = (planData as { weeks?: unknown } | null | undefined)?.weeks;
  if (!Array.isArray(raw)) return [];
  const byNumber = new Map<number, PlanWeek>();
  for (const item of raw) {
    const week = parseWeek(item);
    if (week) byNumber.set(week.week, week);
  }
  return Array.from(byNumber.values()).sort((a, b) => a.week - b.week);
}

/** Complete means all twelve. Generation runs in phases and can stop partway. */
export function isPlanComplete(weeks: PlanWeek[]): boolean {
  return weeks.length === TOTAL_WEEKS;
}

/** The weekly check-in can push current_week to 13, and it can also be unset. */
export function clampWeek(currentWeek: unknown): number {
  const n = typeof currentWeek === 'number' && Number.isFinite(currentWeek) ? Math.floor(currentWeek) : 1;
  return Math.min(TOTAL_WEEKS, Math.max(1, n));
}

export const PLAN_PHASES = [
  { from: 1, to: 3, en: 'Foundation', fr: 'Fondation' },
  { from: 4, to: 6, en: 'Development', fr: 'Développement' },
  { from: 7, to: 9, en: 'Mastery', fr: 'Maîtrise' },
  { from: 10, to: 12, en: 'Integration', fr: 'Intégration' },
] as const;

const EXERCISE_LABELS: Record<string, { en: string; fr: string }> = {
  exercise: { en: 'Exercise', fr: 'Exercice' },
  reflection: { en: 'Reflection', fr: 'Réflexion' },
  practice: { en: 'Practice', fr: 'Pratique' },
};

export function exerciseLabel(type: string, lang: 'en' | 'fr'): string {
  return EXERCISE_LABELS[type]?.[lang] ?? EXERCISE_LABELS.exercise[lang];
}

/** The reader's language, falling back to English where French wasn't stored. */
export function localized(lang: 'en' | 'fr', en: string, fr: string): string {
  return lang === 'fr' ? fr || en : en;
}
