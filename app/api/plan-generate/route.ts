import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

type PillarScore = {
  name: string;
  score: number;
  subScores?: Record<string, number>;
};

type FocusArea = {
  name: string;
  score: number;
  pillar?: string;
};

type WeeklyPlanItem = {
  week: number;
  theme: string;
  focus_area: string;
  exercises: string[];
  key_question: string;
};

type ClaudeResult = {
  coachLens: string;
  weeklyPlan: WeeklyPlanItem[];
  twelveMonthVision: string;
};

function buildPrompt(
  trackName: string,
  pillarScores: PillarScore[],
  focusAreas: FocusArea[],
  lang: 'en' | 'fr'
): string {
  const language = lang === 'fr' ? 'French' : 'English';

  const scoresBlock = pillarScores
    .map((p) => {
      const subs = p.subScores
        ? ' — ' +
          Object.entries(p.subScores)
            .map(([k, v]) => `${k}: ${v}/5`)
            .join(', ')
        : '';
      return `- ${p.name}: ${p.score}/5${subs}`;
    })
    .join('\n');

  const focusBlock = focusAreas
    .map(
      (f, i) =>
        `${i + 1}. ${f.name.replace(/-/g, ' ')} (score: ${f.score}/5${f.pillar ? `, pillar: ${f.pillar}` : ''})`
    )
    .join('\n');

  return `You are Dr. Denis Ekobena's AI coaching system. Based on this user's assessment results, generate a personalized coaching plan in ${language}.

TRACK: ${trackName}

USER SCORES:
${scoresBlock}

FOCUS AREAS (3 weakest dimensions):
${focusBlock}

Generate:
1. COACH LENS (2-3 paragraphs): A direct, insightful summary of what these scores reveal about this person. Be specific, not generic. Reference actual pillar names and scores.

2. 12-WEEK PLAN: A JSON array of 12 weeks, each with:
   - week (number)
   - theme (string)
   - focus_area (string)
   - exercises (array of 3 strings — specific, actionable)
   - key_question (string — one powerful coaching question)

3. TWELVE_MONTH_VISION (1 paragraph): What this person will look like in 12 months if they complete this journey.

Respond ONLY with valid JSON, no markdown fences, no commentary:
{
  "coachLens": "string",
  "weeklyPlan": [{"week": 1, "theme": "string", "focus_area": "string", "exercises": ["string", "string", "string"], "key_question": "string"}],
  "twelveMonthVision": "string"
}

All string values must be written in ${language}.`;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) return fenced[1].trim();
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    return trimmed.slice(first, last + 1);
  }
  return trimmed;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { journeyId, trackName, pillarScores, focusAreas, lang } = body as {
      journeyId?: string;
      trackName?: string;
      pillarScores?: PillarScore[];
      focusAreas?: FocusArea[];
      lang?: 'en' | 'fr';
    };

    if (!journeyId || !trackName || !pillarScores?.length || !focusAreas?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: journey, error: journeyErr } = await supabase
      .from('journeys')
      .select('id, user_id')
      .eq('id', journeyId)
      .single();

    if (journeyErr || !journey || journey.user_id !== user.id) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
    }

    const normalizedLang: 'en' | 'fr' = lang === 'fr' ? 'fr' : 'en';
    const prompt = buildPrompt(trackName, pillarScores, focusAreas, normalizedLang);

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('[plan-generate] Claude API error:', errText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const aiData = await aiRes.json();
    const rawText: string = aiData.content?.[0]?.text || '';
    if (!rawText) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    let parsed: ClaudeResult;
    try {
      parsed = JSON.parse(extractJson(rawText));
    } catch (e) {
      console.error('[plan-generate] JSON parse error:', e, 'raw:', rawText.slice(0, 500));
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 502 });
    }

    if (
      !parsed.coachLens ||
      !Array.isArray(parsed.weeklyPlan) ||
      parsed.weeklyPlan.length !== 12 ||
      !parsed.twelveMonthVision
    ) {
      console.error('[plan-generate] Invalid plan shape:', parsed);
      return NextResponse.json({ error: 'Invalid plan shape' }, { status: 502 });
    }

    return NextResponse.json({
      coachLens: parsed.coachLens,
      weeklyPlan: parsed.weeklyPlan,
      twelveMonthVision: parsed.twelveMonthVision,
    });
  } catch (err) {
    console.error('[plan-generate] Internal error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
