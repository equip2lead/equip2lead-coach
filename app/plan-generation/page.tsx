'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { Logo } from '@/components/Logo';

type Phase = 'metadata' | 'weeks-1-3' | 'weeks-4-6' | 'weeks-7-9' | 'weeks-10-12';

const PHASES: { id: Phase; label_en: string; label_fr: string }[] = [
  { id: 'metadata', label_en: 'Analyzing your assessment...', label_fr: 'Analyse de votre évaluation...' },
  { id: 'weeks-1-3', label_en: 'Building Foundation phase (Weeks 1–3)...', label_fr: 'Phase Fondation (Semaines 1–3)...' },
  { id: 'weeks-4-6', label_en: 'Building Development phase (Weeks 4–6)...', label_fr: 'Phase Développement (Semaines 4–6)...' },
  { id: 'weeks-7-9', label_en: 'Building Mastery phase (Weeks 7–9)...', label_fr: 'Phase Maîtrise (Semaines 7–9)...' },
  { id: 'weeks-10-12', label_en: 'Building Integration phase (Weeks 10–12)...', label_fr: 'Phase Intégration (Semaines 10–12)...' },
];

function PlanGenerationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackSlug = searchParams.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<{ phaseIdx: number; msg: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const runningRef = useRef(false);

  const runGeneration = useCallback(async () => {
    if (!user || runningRef.current) return;
    runningRef.current = true;
    setError(null);
    setDone(false);

    try {
      // 1. Language
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user.id)
        .single();
      const userLang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';
      setLang(userLang);

      // 2. Resolve track and journey
      const { data: track } = await supabase
        .from('tracks')
        .select('id')
        .eq('slug', trackSlug)
        .single();
      if (!track) throw new Error('Track not found');

      const { data: journey } = await supabase
        .from('journeys')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', track.id)
        .single();
      if (!journey) throw new Error('Journey not found');
      setJourneyId(journey.id);

      // 3. Skip if plan already complete
      const { data: existing } = await supabase
        .from('coaching_plans')
        .select('plan_data')
        .eq('journey_id', journey.id)
        .maybeSingle();
      const existingWeeks = (existing?.plan_data as any)?.weeks;
      if (existing && Array.isArray(existingWeeks) && existingWeeks.length === 12) {
        setDone(true);
        setCurrentPhaseIdx(PHASES.length);
        setTimeout(() => router.push('/dashboard'), 600);
        return;
      }

      // 4. Run phases sequentially, starting from currentPhaseIdx (allows retry)
      for (let i = currentPhaseIdx; i < PHASES.length; i++) {
        setCurrentPhaseIdx(i);
        const phase = PHASES[i].id;
        const res = await fetch('/api/plan-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ journey_id: journey.id, phase }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Phase ${phase} failed (${res.status})`);
        }
      }

      setCurrentPhaseIdx(PHASES.length);
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      console.error('[PlanGeneration] error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError({ phaseIdx: currentPhaseIdx, msg: message });
    } finally {
      runningRef.current = false;
    }
  // currentPhaseIdx intentionally excluded: it's mutated inside the loop and
  // we read it as initial value for retry on attempt change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase, trackSlug, router, attempt]);

  useEffect(() => {
    if (!user) return;
    runGeneration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, attempt]);

  const errorPhaseLabel = error
    ? (lang === 'en' ? PHASES[error.phaseIdx]?.label_en : PHASES[error.phaseIdx]?.label_fr)
    : '';

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

      <div className="relative z-10 max-w-[520px] w-full px-6 text-center">
        <div className="flex items-center justify-center mb-12">
          <Logo size="md" onDark />
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
                {lang === 'en' ? 'Generation paused' : 'Génération interrompue'}
              </h2>
              <p className="text-white/60 text-[13px] max-w-[400px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {errorPhaseLabel}
              </p>
              <p className="text-white/40 text-[12px] mt-2 max-w-[400px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {error.msg}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAttempt((a) => a + 1)}
                className="px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white bg-[#F9250E] transition-all hover:-translate-y-px"
                style={{ boxShadow: '0 4px 24px rgba(249,37,14,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'en' ? 'Retry from this phase' : 'Reprendre cette phase'}
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

            <div className="flex flex-col gap-3 mb-12 text-left">
              {PHASES.map((p, i) => {
                const isActive = i === currentPhaseIdx && !done;
                const isDone = i < currentPhaseIdx || done;
                const isFuture = i > currentPhaseIdx && !done;
                return (
                  <div
                    key={p.id}
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
                      className={`text-[13.5px] font-medium transition-colors ${
                        isDone ? 'text-white' : isActive ? 'text-[#F9250E] font-semibold' : 'text-white/30'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {lang === 'en' ? p.label_en : p.label_fr}
                    </span>
                  </div>
                );
              })}
            </div>

            {done && (
              <div className="flex flex-col items-center gap-3 animate-[fadeUp_0.5s_ease_0.3s_both]">
                <h2 className="text-white text-[18px] font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {lang === 'en' ? 'Your coaching journey is ready' : 'Votre parcours de coaching est prêt'}
                </h2>
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
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
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
