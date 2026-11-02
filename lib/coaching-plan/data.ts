import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { hasSafetyConcern } from '@/lib/safety';
import { clampWeek, isPlanComplete, parseWeeks, type PlanWeek } from './parse';

export type PlanModuleLink = { id: string; title: string; moduleNumber: number | null };

export type CoachingPlanData = {
  lang: 'en' | 'fr';
  journeyId: string | null;
  safetyConcern: boolean;
  trackSlug: string | null;
  trackName: string;
  /** Which screen to show: the plan, or where to go to get one. */
  state: 'ready' | 'needs_assessment' | 'needs_generation';
  currentWeek: number;
  vision: string;
  coachSummary: string;
  weeks: PlanWeek[];
  /** Published modules in this track, by id. A week's link shows only if found here. */
  modules: Record<string, PlanModuleLink>;
};

/** Reads only. Uses the same "newest journey" as the dashboard, so the two agree. */
export async function getCoachingPlanData(): Promise<CoachingPlanData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_language')
    .eq('id', user.id)
    .single();
  const lang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';

  const { data: journey, error: journeyError } = await supabase
    .from('journeys')
    .select('id, track_id, current_week, pre_assessment_data, tracks(slug, name_en, name_fr)')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  // Without the journey the safety flag is unknown, so this must not read as
  // "no journey" and carry on.
  if (journeyError) throw new Error(`Could not load journey: ${journeyError.message}`);

  const track = journey?.tracks as unknown as { slug: string; name_en: string; name_fr: string } | null;
  const base = {
    lang,
    journeyId: journey?.id ?? null,
    safetyConcern: hasSafetyConcern(journey?.pre_assessment_data),
    trackSlug: track?.slug ?? null,
    trackName: (lang === 'fr' ? track?.name_fr : track?.name_en) || track?.name_en || '',
    currentWeek: clampWeek(journey?.current_week),
  };
  const empty = { vision: '', coachSummary: '', weeks: [], modules: {} };

  if (!journey || base.safetyConcern) return { ...base, ...empty, state: 'needs_assessment' };

  const [{ data: plan, error: planError }, { count: scored }, { count: pillars }, { data: moduleRows }] = await Promise.all([
    supabase.from('coaching_plans').select('plan_data, coach_lens_summary').eq('journey_id', journey.id).maybeSingle(),
    supabase.from('pillar_scores').select('id', { count: 'exact', head: true }).eq('journey_id', journey.id),
    supabase.from('pillars').select('id', { count: 'exact', head: true }).eq('track_id', journey.track_id),
    supabase.from('lesson_modules').select('id, title_en, title_fr, module_number').eq('track_id', journey.track_id).eq('is_published', true),
  ]);
  // A failed read must not look like a missing plan: that screen offers to
  // regenerate, which would overwrite the plan and cost an AI run.
  if (planError) throw new Error(`Could not load plan: ${planError.message}`);

  const weeks = parseWeeks(plan?.plan_data);
  if (!isPlanComplete(weeks)) {
    const assessed = (scored ?? 0) > 0 && (scored ?? 0) >= (pillars ?? 1);
    return { ...base, ...empty, state: assessed ? 'needs_generation' : 'needs_assessment' };
  }

  const modules: Record<string, PlanModuleLink> = {};
  for (const m of moduleRows ?? []) {
    modules[m.id] = {
      id: m.id,
      title: (lang === 'fr' ? m.title_fr : m.title_en) || m.title_en || '',
      moduleNumber: m.module_number,
    };
  }

  const planData = plan?.plan_data as { vision_en?: unknown; vision_fr?: unknown } | null;
  const visionEn = typeof planData?.vision_en === 'string' ? planData.vision_en : '';
  const visionFr = typeof planData?.vision_fr === 'string' ? planData.vision_fr : '';

  return {
    ...base,
    state: 'ready',
    vision: lang === 'fr' ? visionFr || visionEn : visionEn,
    coachSummary: plan?.coach_lens_summary ?? '',
    weeks,
    modules,
  };
}
