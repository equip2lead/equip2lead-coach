import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

type Phase = 'metadata' | 'weeks-1-3' | 'weeks-4-6' | 'weeks-7-9' | 'weeks-10-12';
const VALID_PHASES: Phase[] = ['metadata', 'weeks-1-3', 'weeks-4-6', 'weeks-7-9', 'weeks-10-12'];

const PHASE_THEMES: Record<Exclude<Phase, 'metadata'>, { theme: string; description_en: string; description_fr: string }> = {
  'weeks-1-3': {
    theme: 'foundation',
    description_en: 'Self-awareness, baseline, identity. Establish honest self-knowledge and the inner posture for the journey.',
    description_fr: 'Conscience de soi, ligne de base, identité. Établir une connaissance honnête de soi et la posture intérieure pour le parcours.',
  },
  'weeks-4-6': {
    theme: 'development',
    description_en: 'Skill-building on the weakest pillar. Targeted growth, deliberate practice, structured exercises.',
    description_fr: 'Développement de compétences sur le pilier le plus faible. Croissance ciblée, pratique délibérée, exercices structurés.',
  },
  'weeks-7-9': {
    theme: 'mastery',
    description_en: 'Consistency, depth, integration. Move from doing to embodying — make new behaviors second nature.',
    description_fr: 'Constance, profondeur, intégration. Passer du faire à l’incarner — rendre les nouveaux comportements naturels.',
  },
  'weeks-10-12': {
    theme: 'integration',
    description_en: 'Compound practice, multiplication, sustaining. Weave the work into life rhythms and start lifting others.',
    description_fr: 'Pratique composée, multiplication, durabilité. Tisser le travail dans les rythmes de vie et commencer à élever les autres.',
  },
};

type Pillar = { id: string; name_en: string; name_fr: string; sort_order: number };
type Score = { pillar_id: string; score: number; sub_domain_scores: Record<string, number> | null };

type Context = {
  journey: { id: string; track_id: string };
  language: 'en' | 'fr';
  trackName: string;
  pillars: Pillar[];
  scores: Score[];
  weakest: Pillar | null;
  strongest: Pillar | null;
  overallScore: number;
  focusAreas: { name: string; score: number; pillar_en: string; pillar_fr: string }[];
};

async function loadJourneyContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  journeyId: string,
  userId: string
): Promise<Context | null> {
  const { data: journey } = await supabase
    .from('journeys')
    .select('id, user_id, track_id, tracks(name_en, name_fr, slug)')
    .eq('id', journeyId)
    .single();
  if (!journey || journey.user_id !== userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_language')
    .eq('id', userId)
    .single();
  const language: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';

  const track = (journey as any).tracks;
  const trackName = language === 'fr' ? track?.name_fr || track?.name_en : track?.name_en || '';

  const { data: scoreRows } = await supabase
    .from('pillar_scores')
    .select('pillar_id, score, sub_domain_scores')
    .eq('journey_id', journeyId);
  const scores: Score[] = (scoreRows || []).map((s: any) => ({
    pillar_id: s.pillar_id,
    score: Number(s.score),
    sub_domain_scores: s.sub_domain_scores,
  }));

  const pillarIds = scores.map((s) => s.pillar_id);
  const { data: pillarRows } = pillarIds.length
    ? await supabase
        .from('pillars')
        .select('id, name_en, name_fr, sort_order')
        .in('id', pillarIds)
        .order('sort_order')
    : { data: [] };
  const pillars: Pillar[] = (pillarRows || []) as Pillar[];

  const sorted = scores
    .map((s) => ({ score: s, pillar: pillars.find((p) => p.id === s.pillar_id) || null }))
    .filter((x) => x.pillar)
    .sort((a, b) => a.score.score - b.score.score);
  const weakest = sorted[0]?.pillar ?? null;
  const strongest = sorted[sorted.length - 1]?.pillar ?? null;
  const overallScore =
    scores.length > 0 ? scores.reduce((a, s) => a + s.score, 0) / scores.length : 0;

  const subs: { name: string; score: number; pillar_en: string; pillar_fr: string }[] = [];
  for (const s of scores) {
    const p = pillars.find((pp) => pp.id === s.pillar_id);
    if (!p || !s.sub_domain_scores) continue;
    for (const [name, score] of Object.entries(s.sub_domain_scores)) {
      subs.push({ name, score: Number(score), pillar_en: p.name_en, pillar_fr: p.name_fr });
    }
  }
  subs.sort((a, b) => a.score - b.score);
  const focusAreas = subs.slice(0, 3);

  return {
    journey: { id: journey.id, track_id: journey.track_id },
    language,
    trackName,
    pillars,
    scores,
    weakest,
    strongest,
    overallScore,
    focusAreas,
  };
}

function scoresBlock(ctx: Context): string {
  return ctx.scores
    .map((s) => {
      const p = ctx.pillars.find((pp) => pp.id === s.pillar_id);
      const name = p ? (ctx.language === 'fr' ? p.name_fr : p.name_en) : 'Unknown';
      const subs = s.sub_domain_scores
        ? ' — ' +
          Object.entries(s.sub_domain_scores)
            .map(([k, v]) => `${k}: ${Number(v).toFixed(1)}/5`)
            .join(', ')
        : '';
      return `- ${name}: ${s.score.toFixed(1)}/5${subs}`;
    })
    .join('\n');
}

function focusBlock(ctx: Context): string {
  return ctx.focusAreas
    .map((f, i) => {
      const pillarName = ctx.language === 'fr' ? f.pillar_fr : f.pillar_en;
      return `${i + 1}. ${f.name.replace(/-/g, ' ')} (${f.score.toFixed(1)}/5, pillar: ${pillarName})`;
    })
    .join('\n');
}

async function callClaude(prompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('AI service not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[plan-generate] Claude API error:', errText);
    throw new Error(`AI service returned ${res.status}`);
  }

  const data = await res.json();
  const text: string = data.content?.[0]?.text || '';
  if (!text) throw new Error('Empty AI response');
  return text;
}

function extractJson(text: string): any {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');
  const slice = first !== -1 && last !== -1 && last > first ? candidate.slice(first, last + 1) : candidate;
  return JSON.parse(slice);
}

async function generateMetadata(ctx: Context): Promise<{
  vision_en: string;
  vision_fr: string;
  coach_lens_summary: string;
}> {
  const prompt = `You are Dr. Denis Ekobena's AI coaching system. Based on this user's assessment, produce a vision and coach lens.

TRACK: ${ctx.trackName}

USER SCORES:
${scoresBlock(ctx)}

TOP 3 FOCUS AREAS (weakest sub-dimensions):
${focusBlock(ctx)}

Produce three pieces of output:
1. coach_lens_summary — 3 to 5 sentences in ${ctx.language === 'fr' ? 'French' : 'English'}. A direct, insightful summary of where this person is. Reference the actual pillar names and scores. No fluff.
2. vision_en — 1 to 2 paragraphs in English. What this person will look like in 12 months if they complete this journey.
3. vision_fr — 1 to 2 paragraphs in French. The French equivalent of vision_en (translate, don't merely localize).

Respond ONLY with valid JSON, no markdown fences, no commentary:
{
  "coach_lens_summary": "string",
  "vision_en": "string",
  "vision_fr": "string"
}`;

  const text = await callClaude(prompt, 1800);
  const parsed = extractJson(text);
  if (!parsed.coach_lens_summary || !parsed.vision_en || !parsed.vision_fr) {
    throw new Error('Invalid metadata shape from AI');
  }
  return parsed;
}

type WeekItem = {
  week: number;
  focus: string;
  title_en: string;
  title_fr: string;
  desc_en: string;
  desc_fr: string;
  exercises: { type: string; title_en: string; title_fr: string }[];
};

async function generateWeeks(
  ctx: Context,
  fromWeek: number,
  toWeek: number,
  phase: Exclude<Phase, 'metadata'>
): Promise<{ weeks: WeekItem[] }> {
  const phaseInfo = PHASE_THEMES[phase];
  const weakestEn = ctx.weakest?.name_en || 'the weakest pillar';
  const weakestFr = ctx.weakest?.name_fr || 'le pilier le plus faible';
  const strongestEn = ctx.strongest?.name_en || 'the strongest pillar';
  const strongestFr = ctx.strongest?.name_fr || 'le pilier le plus fort';
  const count = toWeek - fromWeek + 1;

  const prompt = `You are Dr. Denis Ekobena's AI coaching system. Generate exactly ${count} weeks of a 12-week coaching plan.

TRACK: ${ctx.trackName}
PHASE: ${phaseInfo.theme} (weeks ${fromWeek}-${toWeek})
PHASE INTENT (EN): ${phaseInfo.description_en}
PHASE INTENT (FR): ${phaseInfo.description_fr}

USER SCORES:
${scoresBlock(ctx)}

WEAKEST PILLAR: ${weakestEn} / ${weakestFr} — emphasize in early phases
STRONGEST PILLAR: ${strongestEn} / ${strongestFr} — leverage in later phases

TOP 3 FOCUS AREAS:
${focusBlock(ctx)}

Generate weeks ${fromWeek} through ${toWeek}. Each week MUST contain:
- week (integer, exactly the week number, in range ${fromWeek}-${toWeek})
- focus (short string, the dominant pillar or theme this week, e.g. "Personal Leadership")
- title_en (string, 4-8 words, English)
- title_fr (string, 4-8 words, French translation of title_en)
- desc_en (string, 1-2 sentences in English describing what this week is about)
- desc_fr (string, 1-2 sentences in French — translation of desc_en)
- exercises (array of EXACTLY 3 items, each with: type ("exercise" | "reflection" | "practice"), title_en, title_fr)

Be concrete and specific. Reference the user's scores and weakest/strongest pillars where it adds insight. No filler.

Respond ONLY with valid JSON, no markdown fences, no commentary:
{
  "weeks": [
    {
      "week": ${fromWeek},
      "focus": "string",
      "title_en": "string",
      "title_fr": "string",
      "desc_en": "string",
      "desc_fr": "string",
      "exercises": [
        {"type": "exercise", "title_en": "string", "title_fr": "string"},
        {"type": "reflection", "title_en": "string", "title_fr": "string"},
        {"type": "practice", "title_en": "string", "title_fr": "string"}
      ]
    }
  ]
}`;

  const text = await callClaude(prompt, 2800);
  const parsed = extractJson(text);
  if (!parsed.weeks || !Array.isArray(parsed.weeks) || parsed.weeks.length !== count) {
    throw new Error(`Expected ${count} weeks, got ${parsed.weeks?.length ?? 0}`);
  }
  for (const w of parsed.weeks) {
    if (
      typeof w.week !== 'number' ||
      w.week < fromWeek ||
      w.week > toWeek ||
      !w.title_en ||
      !w.title_fr ||
      !Array.isArray(w.exercises)
    ) {
      throw new Error('Invalid week shape');
    }
  }
  return { weeks: parsed.weeks as WeekItem[] };
}

async function upsertPlanPhase(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ctx: Context,
  phase: Phase,
  result: any
): Promise<void> {
  const { data: existing } = await supabase
    .from('coaching_plans')
    .select('focus_areas, coach_lens_summary, plan_data')
    .eq('journey_id', ctx.journey.id)
    .maybeSingle();

  const existingPlanData = (existing?.plan_data as any) || {};
  const existingWeeks: WeekItem[] = Array.isArray(existingPlanData.weeks) ? existingPlanData.weeks : [];

  let focus_areas = existing?.focus_areas ?? null;
  let coach_lens_summary = existing?.coach_lens_summary ?? null;
  let nextPlanData = { ...existingPlanData };

  // Pillar metadata is always rewritten from current ctx (cheap, derived)
  nextPlanData.weakest_pillar_en = ctx.weakest?.name_en || '';
  nextPlanData.weakest_pillar_fr = ctx.weakest?.name_fr || '';
  nextPlanData.strongest_pillar_en = ctx.strongest?.name_en || '';
  nextPlanData.strongest_pillar_fr = ctx.strongest?.name_fr || '';
  nextPlanData.overall_score = ctx.overallScore;
  nextPlanData.generated_lang = ctx.language;

  if (phase === 'metadata') {
    coach_lens_summary = result.coach_lens_summary;
    nextPlanData.vision_en = result.vision_en;
    nextPlanData.vision_fr = result.vision_fr;
    focus_areas = ctx.focusAreas.map((f) => ({
      name: f.name,
      score: f.score,
      pillar_en: f.pillar_en,
      pillar_fr: f.pillar_fr,
    }));
    if (!Array.isArray(nextPlanData.weeks)) nextPlanData.weeks = existingWeeks;
  } else {
    const newWeeks: WeekItem[] = result.weeks;
    const newWeekNumbers = new Set(newWeeks.map((w) => w.week));
    const merged = [
      ...existingWeeks.filter((w) => !newWeekNumbers.has(w.week)),
      ...newWeeks,
    ].sort((a, b) => a.week - b.week);
    nextPlanData.weeks = merged;
  }

  const upsertRow: Record<string, any> = {
    journey_id: ctx.journey.id,
    plan_data: nextPlanData,
    updated_at: new Date().toISOString(),
  };
  if (focus_areas !== null) upsertRow.focus_areas = focus_areas;
  if (coach_lens_summary !== null) upsertRow.coach_lens_summary = coach_lens_summary;

  const { error: upsertErr } = await supabase
    .from('coaching_plans')
    .upsert(upsertRow, { onConflict: 'journey_id' });
  if (upsertErr) throw new Error(upsertErr.message || 'Failed to save plan phase');
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const journey_id: string | undefined = body.journey_id || body.journeyId;
    const phase: Phase | undefined = body.phase;

    if (!journey_id || !phase || !VALID_PHASES.includes(phase)) {
      return NextResponse.json({ error: 'invalid params' }, { status: 400 });
    }

    const ctx = await loadJourneyContext(supabase, journey_id, user.id);
    if (!ctx) return NextResponse.json({ error: 'journey not found' }, { status: 404 });
    if (ctx.scores.length === 0) {
      return NextResponse.json({ error: 'No assessment scores found' }, { status: 400 });
    }

    let result: any;
    switch (phase) {
      case 'metadata':
        result = await generateMetadata(ctx);
        break;
      case 'weeks-1-3':
        result = await generateWeeks(ctx, 1, 3, 'weeks-1-3');
        break;
      case 'weeks-4-6':
        result = await generateWeeks(ctx, 4, 6, 'weeks-4-6');
        break;
      case 'weeks-7-9':
        result = await generateWeeks(ctx, 7, 9, 'weeks-7-9');
        break;
      case 'weeks-10-12':
        result = await generateWeeks(ctx, 10, 12, 'weeks-10-12');
        break;
    }

    await upsertPlanPhase(supabase, ctx, phase, result);

    return NextResponse.json({ ok: true, phase, data: result });
  } catch (err) {
    console.error('[plan-generate] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    );
  }
}
