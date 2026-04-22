'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

type Phase = 'analyzing' | 'generating' | 'finalizing' | 'done';

type ApiWeek = {
  week: number;
  theme: string;
  focus_area: string;
  exercises: string[];
  key_question: string;
};

type ApiResult = {
  coachLens: string;
  weeklyPlan: ApiWeek[];
  twelveMonthVision: string;
};

const stepLabels = {
  en: {
    analyzing: 'Analyzing your scores...',
    generating: 'Building your 12-week plan...',
    finalizing: 'Almost ready...',
    done: 'Your coaching journey is ready',
  },
  fr: {
    analyzing: 'Analyse de vos scores...',
    generating: 'Construction de votre plan 12 semaines...',
    finalizing: 'Presque prêt...',
    done: 'Votre parcours de coaching est prêt',
  },
};

const phaseOrder: Phase[] = ['analyzing', 'generating', 'finalizing', 'done'];

function PlanGenerationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackSlug = searchParams.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [phase, setPhase] = useState<Phase>('analyzing');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const runningRef = useRef(false);

  const runGeneration = useCallback(async () => {
    if (!user || runningRef.current) return;
    runningRef.current = true;
    setError(null);
    setPhase('analyzing');

    try {
      // Load profile language preference
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user.id)
        .single();
      const userLang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';
      setLang(userLang);

      // Resolve track
      const { data: track } = await supabase
        .from('tracks')
        .select('id, name_en, name_fr')
        .eq('slug', trackSlug)
        .single();
      if (!track) throw new Error('Track not found');

      // Resolve journey
      const { data: journey } = await supabase
        .from('journeys')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', track.id)
        .single();
      if (!journey) throw new Error('Journey not found');

      // If plan already exists, skip straight to dashboard
      const { data: existing } = await supabase
        .from('coaching_plans')
        .select('id')
        .eq('journey_id', journey.id)
        .maybeSingle();
      if (existing) {
        setPhase('done');
        router.push('/dashboard');
        return;
      }

      // Pillar scores
      const { data: scores } = await supabase
        .from('pillar_scores')
        .select('pillar_id, score, sub_domain_scores')
        .eq('journey_id', journey.id);
      if (!scores || scores.length === 0) throw new Error('No assessment scores found');

      const pillarIds = scores.map((s) => s.pillar_id);
      const { data: pillars } = await supabase
        .from('pillars')
        .select('id, name_en, name_fr, sort_order')
        .in('id', pillarIds)
        .order('sort_order');

      const trackName = userLang === 'fr' ? track.name_fr : track.name_en;

      const pillarScores = scores.map((sc) => {
        const p = pillars?.find((pp) => pp.id === sc.pillar_id);
        return {
          name: p ? (userLang === 'fr' ? p.name_fr : p.name_en) : 'Unknown',
          score: Number(sc.score),
          subScores: (sc.sub_domain_scores as Record<string, number>) || undefined,
        };
      });

      // Top 3 weakest sub-domains
      const allSubs: { name: string; score: number; pillar_en: string; pillar_fr: string }[] = [];
      scores.forEach((sc) => {
        const p = pillars?.find((pp) => pp.id === sc.pillar_id);
        if (sc.sub_domain_scores && p) {
          Object.entries(sc.sub_domain_scores as Record<string, number>).forEach(([name, score]) => {
            allSubs.push({ name, score: score as number, pillar_en: p.name_en, pillar_fr: p.name_fr });
          });
        }
      });
      allSubs.sort((a, b) => a.score - b.score);
      const focusAreasRaw = allSubs.slice(0, 3);
      const focusAreasApi = focusAreasRaw.map((s) => ({
        name: s.name,
        score: s.score,
        pillar: userLang === 'fr' ? s.pillar_fr : s.pillar_en,
      }));

      // Weakest/strongest pillar + overall
      const sortedPillars = scores
        .map((sc) => ({ ...sc, pillar: pillars?.find((p) => p.id === sc.pillar_id) }))
        .sort((a, b) => Number(a.score) - Number(b.score));
      const weakest = sortedPillars[0]?.pillar;
      const strongest = sortedPillars[sortedPillars.length - 1]?.pillar;
      const overallScore = scores.reduce((a, s) => a + Number(s.score), 0) / scores.length;

      // Call Claude
      setPhase('generating');
      const res = await fetch('/api/plan-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyId: journey.id,
          trackName,
          pillarScores,
          focusAreas: focusAreasApi,
          lang: userLang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const ai: ApiResult = await res.json();

      // Persist — map AI shape to dashboard-expected schema
      setPhase('finalizing');

      const focusAreasStored = focusAreasRaw.map((s) => ({
        name: s.name,
        score: s.score,
        pillar_en: s.pillar_en,
        pillar_fr: s.pillar_fr,
      }));

      const weeks = ai.weeklyPlan.map((w) => ({
        week: w.week,
        title_en: w.theme,
        title_fr: w.theme,
        desc_en: w.key_question,
        desc_fr: w.key_question,
        focus: w.focus_area,
        exercises: w.exercises.map((ex) => ({
          type: 'exercise',
          title_en: ex,
          title_fr: ex,
        })),
      }));

      const { error: upsertErr } = await supabase.from('coaching_plans').upsert(
        {
          journey_id: journey.id,
          focus_areas: focusAreasStored,
          coach_lens_summary: ai.coachLens,
          plan_data: {
            weeks,
            vision_en: ai.twelveMonthVision,
            vision_fr: ai.twelveMonthVision,
            weakest_pillar_en: weakest?.name_en || '',
            weakest_pillar_fr: weakest?.name_fr || '',
            strongest_pillar_en: strongest?.name_en || '',
            strongest_pillar_fr: strongest?.name_fr || '',
            overall_score: overallScore,
            generated_lang: userLang,
          },
        },
        { onConflict: 'journey_id' }
      );

      if (upsertErr) throw new Error(upsertErr.message || 'Failed to save plan');

      await supabase
        .from('journeys')
        .update({ status: 'plan_generated', updated_at: new Date().toISOString() })
        .eq('id', journey.id);

      setPhase('done');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      console.error('[PlanGeneration] Error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      runningRef.current = false;
    }
  }, [user, supabase, trackSlug, router]);

  useEffect(() => {
    if (!user) return;
    runGeneration();
  }, [user?.id, attempt]);

  const labels = stepLabels[lang];
  const currentIndex = phaseOrder.indexOf(phase);
  const done = phase === 'done';

  return (
    <div
      className="min-h-screen bg-[#0B0B0C] flex items-center justify-center relative overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.08), transparent 65%)', filter: 'blur(100px)' }}
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.05), transparent 60%)', filter: 'blur(80px)' }}
      />

      <div className="relative z-10 max-w-[480px] w-full px-6 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-16">
          <div
            className="w-10 h-10 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[18px] font-extrabold text-white"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            E
          </div>
          <span className="text-[19px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Equip<span className="text-[#F9250E]">2</span>Lead
          </span>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-5 animate-[fadeUp_0.4s_ease]">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F9250E" strokeWidth="2.5" className="w-10 h-10">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h2 className="text-white text-[20px] font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {lang === 'en' ? 'Plan generation failed' : 'Échec de la génération'}
              </h2>
              <p className="text-white/60 text-[13px] max-w-[360px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {error}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAttempt((a) => a + 1)}
                className="px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white bg-[#F9250E] transition-all hover:-translate-y-px"
                style={{ boxShadow: '0 4px 24px rgba(249,37,14,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'en' ? 'Retry' : 'Réessayer'}
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-xl cursor-pointer text-[14px] font-semibold text-white/70 bg-transparent border border-white/15 transition-all hover:text-white hover:border-white/30"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'en' ? 'Back to dashboard' : 'Retour au tableau'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-20 h-20 mx-auto mb-10">
              {!done ? (
                <div className="w-20 h-20 rounded-full border-[3px] border-white/10 flex items-center justify-center animate-pulse">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F9250E"
                    strokeWidth="2"
                    className="w-8 h-8 animate-spin"
                    style={{ animationDuration: '3s' }}
                  >
                    <path d="M12 2v4m0 12v4m-8-10H0m24 0h-4m-2.3-5.7l2.8-2.8M3.5 20.5l2.8-2.8M20.5 20.5l-2.8-2.8M3.5 3.5l2.8 2.8" />
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#F9250E] flex items-center justify-center animate-[scaleIn_0.4s_ease]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-10 h-10">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-12">
              {phaseOrder.map((p, i) => {
                const isActive = i === currentIndex && !done;
                const isDone = i < currentIndex || done;
                const isFuture = i > currentIndex && !done;
                const isLast = i === phaseOrder.length - 1;
                return (
                  <div
                    key={p}
                    className={`flex items-center gap-3 transition-all duration-500 ${isFuture ? 'opacity-30' : 'opacity-100'}`}
                  >
                    <div
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isDone ? 'bg-[#F9250E]' : isActive ? 'border-2 border-[#F9250E]' : 'border border-white/20'
                      }`}
                    >
                      {isDone && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3.5 h-3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {isActive && <div className="w-2 h-2 rounded-full bg-[#F9250E] animate-pulse" />}
                    </div>
                    <span
                      className={`text-[14px] font-medium transition-colors ${
                        isDone ? 'text-white' : isActive ? 'text-[#F9250E] font-semibold' : 'text-white/30'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {isLast && done ? (
                        <span className="text-[#F9250E] font-bold">{labels[p]}</span>
                      ) : (
                        labels[p]
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {done && (
              <div className="flex flex-col items-center gap-3 animate-[fadeUp_0.5s_ease_0.3s_both]">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-10 py-4 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] transition-all hover:-translate-y-px"
                  style={{ boxShadow: '0 4px 24px rgba(249,37,14,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {lang === 'en' ? 'Enter Your Dashboard' : 'Accéder au Tableau de bord'} &rarr;
                </button>
                <p className="text-white/30 text-[12px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {lang === 'en' ? 'Redirecting automatically...' : 'Redirection automatique...'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => setLang((l) => (l === 'en' ? 'fr' : 'en'))}
        className="absolute top-6 right-7 px-3 py-1.5 rounded-lg border border-white/10 bg-transparent text-[11px] font-semibold text-white/50 cursor-pointer hover:border-white/20 hover:text-white/70 transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        🌐 {lang === 'en' ? 'FR' : 'EN'}
      </button>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function PlanGenerationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
          <div className="text-white/50" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Loading...
          </div>
        </div>
      }
    >
      <PlanGenerationContent />
    </Suspense>
  );
}
