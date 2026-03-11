'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

/* ── Icons ── */
const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>;
const SparkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const i18n = {
  en: {
    back: 'Dashboard',
    week: 'Week 2 Check-in',
    subtitle: '~3 minutes · 5 steps',
    steps: ['Emotional Pulse', 'Goal Review', 'Progress', 'Reflection', 'Commitment'],
    // Step 1: Mood
    moodTitle: 'How are you feeling this week?',
    moodSub: 'Be honest — this helps your AI Coach personalise your plan.',
    moods: [
      { emoji: '😫', label: 'Struggling', color: '#DC2626' },
      { emoji: '😐', label: 'Low energy', color: '#D97706' },
      { emoji: '🙂', label: 'Stable', color: '#2563EB' },
      { emoji: '💪', label: 'Growing', color: '#059669' },
      { emoji: '🔥', label: 'On fire', color: '#7C3AED' },
    ],
    // Step 2: Goals
    goalsTitle: 'Did you complete this week\'s activities?',
    goalsSub: 'Check the ones you completed.',
    goals: [
      { title: 'Practice the 3-Second Reset', desc: 'Pause 3 seconds before reacting to triggers.' },
      { title: 'Journal: Frustration Log', desc: 'Write down 2 moments where frustration surfaced.' },
      { title: 'Reflection Prompt', desc: '"What would my team say is my default reaction under pressure?"' },
      { title: 'Real Conversation', desc: 'Ask a team member how you come across under stress.' },
    ],
    // Step 3: Scale
    scaleTitle: 'How would you rate your progress on emotional regulation?',
    scaleSub: 'Compared to last week.',
    scaleLabels: ['No progress', 'A little', 'Some growth', 'Good progress', 'Breakthrough'],
    // Step 4: Reflection
    reflectTitle: 'What was your biggest insight or challenge this week?',
    reflectPlaceholder: 'Share what stood out to you — a moment, a realisation, or a struggle...',
    // Step 5: Commitment
    commitTitle: 'What\'s your specific commitment for next week?',
    commitPlaceholder: 'Write one specific, actionable commitment...',
    // Navigation
    next: 'Continue',
    submit: 'Complete Check-in',
    // Completion
    doneTitle: 'Check-in Complete! 🎉',
    doneSub: 'Your responses have been recorded. Here\'s your adjusted plan for next week:',
    adaptiveTitle: 'Adaptive Plan — Week 3',
    adaptiveItems: [
      '✅ Continue 3-Second Reset (you\'re building the habit)',
      '📝 Simplified journaling: 1 entry instead of 2',
      '🌅 Added: Morning 5-minute reflection before work',
      '💬 New: Ask a second team member for feedback',
    ],
    dashboardBtn: 'Go to Dashboard',
    coachBtn: 'Talk to AI Coach',
    langLabel: 'FR',
  },
  fr: {
    back: 'Tableau de bord',
    week: 'Bilan Semaine 2',
    subtitle: '~3 minutes · 5 étapes',
    steps: ['Pulse émotionnel', 'Bilan des objectifs', 'Progrès', 'Réflexion', 'Engagement'],
    moodTitle: 'Comment vous sentez-vous cette semaine ?',
    moodSub: 'Soyez honnête — cela aide votre Coach IA à personnaliser votre plan.',
    moods: [
      { emoji: '😫', label: 'En difficulté', color: '#DC2626' },
      { emoji: '😐', label: 'Peu d\'énergie', color: '#D97706' },
      { emoji: '🙂', label: 'Stable', color: '#2563EB' },
      { emoji: '💪', label: 'En croissance', color: '#059669' },
      { emoji: '🔥', label: 'En feu', color: '#7C3AED' },
    ],
    goalsTitle: 'Avez-vous complété les activités de cette semaine ?',
    goalsSub: 'Cochez celles que vous avez complétées.',
    goals: [
      { title: 'Pratiquer le Reset 3 Secondes', desc: 'Pause de 3 secondes avant de réagir.' },
      { title: 'Journal: Log de Frustration', desc: 'Notez 2 moments de frustration.' },
      { title: 'Question de Réflexion', desc: '"Quelle est ma réaction par défaut sous pression ?"' },
      { title: 'Conversation Réelle', desc: 'Demandez un retour à un membre de votre équipe.' },
    ],
    scaleTitle: 'Comment évaluez-vous vos progrès en régulation émotionnelle ?',
    scaleSub: 'Par rapport à la semaine dernière.',
    scaleLabels: ['Aucun progrès', 'Un peu', 'Quelques progrès', 'Bon progrès', 'Percée'],
    reflectTitle: 'Quelle a été votre plus grande leçon ou défi cette semaine ?',
    reflectPlaceholder: 'Partagez ce qui vous a marqué — un moment, une réalisation ou une difficulté...',
    commitTitle: 'Quel est votre engagement spécifique pour la semaine prochaine ?',
    commitPlaceholder: 'Écrivez un engagement spécifique et actionnable...',
    next: 'Continuer',
    submit: 'Terminer le bilan',
    doneTitle: 'Bilan terminé ! 🎉',
    doneSub: 'Vos réponses ont été enregistrées. Voici votre plan ajusté pour la semaine prochaine :',
    adaptiveTitle: 'Plan Adaptatif — Semaine 3',
    adaptiveItems: [
      "✅ Continuer le Reset 3 Secondes (vous créez l'habitude)",
      '📝 Journaling simplifié: 1 entrée au lieu de 2',
      '🌅 Ajouté: 5 minutes de réflexion matinale avant le travail',
      '💬 Nouveau: Demander un feedback à un deuxième membre',
    ],
    dashboardBtn: 'Aller au Tableau de bord',
    coachBtn: 'Parler au Coach IA',
    langLabel: 'EN',
  },
};

export default function WeeklyCheckinPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [goals, setGoals] = useState<boolean[]>([false, false, false, false]);
  const [scale, setScale] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [commitment, setCommitment] = useState('');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [weekNum, setWeekNum] = useState(1);
  const t = i18n[lang];

  // Load journey
  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: j } = await supabase
        .from('journeys').select('id, current_week')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(1).single();
      if (j) {
        setJourneyId(j.id);
        setWeekNum(j.current_week || 1);
      }
    }
    load();
  }, [user?.id]);

  const canContinue = () => {
    if (step === 0) return mood !== null;
    if (step === 1) return true;
    if (step === 2) return scale !== null;
    if (step === 3) return reflection.trim().length > 0;
    if (step === 4) return commitment.trim().length > 0;
    return false;
  };

  const saveCheckin = async () => {
    if (!journeyId) return;
    const moodLabels = ['struggling', 'low', 'stable', 'growing', 'on_fire'];
    await supabase.from('weekly_checkins').upsert({
      journey_id: journeyId,
      week_number: weekNum,
      mood: moodLabels[mood || 0],
      goals_completed: goals.map((g, i) => g ? i : null).filter(v => v !== null),
      progress_rating: scale,
      reflection,
      commitment,
    }, { onConflict: 'journey_id,week_number' });

    // Increment week
    await supabase.from('journeys').update({
      current_week: weekNum + 1,
      updated_at: new Date().toISOString(),
    }).eq('id', journeyId);
  };

  const handleNext = async () => {
    if (step < 4) setStep(step + 1);
    else if (step === 4) {
      await saveCheckin();
      setStep(5);
    }
  };

  const progress = step < 5 ? ((step + 1) / 5) * 100 : 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Header ── */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 max-md:px-4">
        <div className="h-16 flex items-center justify-between max-w-[640px] mx-auto w-full">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
            <BackIcon /> {t.back}
          </button>
          <div className="text-center">
            <h1 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? `Week ${weekNum} Check-in` : `Bilan Semaine ${weekNum}`}</h1>
            <p className="text-[11px] text-gray-400">{t.subtitle}</p>
          </div>
          <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md bg-transparent border-[1.5px] border-gray-200 cursor-pointer text-[11px] font-semibold text-gray-500" style={{ fontFamily: 'inherit' }}>🌐 {t.langLabel}</button>
        </div>
        {/* Progress bar */}
        {step < 5 && (
          <div className="max-w-[640px] mx-auto w-full pb-3">
            <div className="flex gap-1.5 mb-2">
              {t.steps.map((s, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-[#F9250E]' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-[11px] text-gray-400 text-center">{t.steps[step]} ({step + 1}/5)</p>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex items-start justify-center px-6 max-md:px-4 py-10">
        <div className="w-full max-w-[540px]">

          {/* STEP 0: Mood */}
          {step === 0 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-2 tracking-tight text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.moodTitle}</h2>
              <p className="text-[14px] text-gray-500 text-center mb-10">{t.moodSub}</p>
              <div className="flex justify-center gap-4 max-md:gap-3 flex-wrap">
                {t.moods.map((m, i) => (
                  <button key={i} onClick={() => setMood(i)}
                    className={`flex flex-col items-center gap-2 w-[90px] py-5 rounded-2xl border-2 cursor-pointer transition-all ${mood === i ? 'scale-110 shadow-lg' : 'hover:scale-105 hover:-translate-y-1'}`}
                    style={{ borderColor: mood === i ? m.color : '#E5E7EB', background: mood === i ? `${m.color}08` : 'white', fontFamily: 'inherit' }}>
                    <span className="text-[32px]">{m.emoji}</span>
                    <span className="text-[11px] font-semibold" style={{ color: mood === i ? m.color : '#6B7280' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Goals */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-2 tracking-tight text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.goalsTitle}</h2>
              <p className="text-[14px] text-gray-500 text-center mb-8">{t.goalsSub}</p>
              <div className="flex flex-col gap-3">
                {t.goals.map((g, i) => (
                  <button key={i} onClick={() => { const next = [...goals]; next[i] = !next[i]; setGoals(next); }}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border-[1.5px] cursor-pointer transition-all text-left ${goals[i] ? 'border-green-400 bg-green-50/50' : 'border-gray-200 bg-white hover:border-gray-300'}`} style={{ fontFamily: 'inherit' }}>
                    <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${goals[i] ? 'bg-green-500 text-white' : 'border-2 border-gray-300'}`}>
                      {goals[i] && <CheckIcon />}
                    </div>
                    <div>
                      <h4 className={`text-[14px] font-semibold ${goals[i] ? 'text-green-700' : 'text-gray-900'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{g.title}</h4>
                      <p className="text-[12.5px] text-gray-500 mt-0.5">{g.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Scale */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-2 tracking-tight text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.scaleTitle}</h2>
              <p className="text-[14px] text-gray-500 text-center mb-10">{t.scaleSub}</p>
              <div className="flex justify-center gap-3 max-md:gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setScale(n)}
                    className={`flex flex-col items-center gap-2 w-[80px] max-md:w-[60px] py-5 rounded-2xl border-2 cursor-pointer transition-all ${scale === n ? 'border-[#F9250E] bg-red-50/50 scale-110' : 'border-gray-200 bg-white hover:border-gray-300 hover:scale-105'}`} style={{ fontFamily: 'inherit' }}>
                    <span className={`text-[28px] max-md:text-[22px] font-extrabold ${scale === n ? 'text-[#F9250E]' : 'text-gray-400'}`}>{n}</span>
                    <span className="text-[10px] font-medium text-gray-500 leading-tight text-center px-1">{t.scaleLabels[n - 1]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Reflection */}
          {step === 3 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-2 tracking-tight text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.reflectTitle}</h2>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder={t.reflectPlaceholder}
                rows={6}
                className="w-full mt-6 px-5 py-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none resize-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.06)] transition-all placeholder:text-gray-400 leading-[1.7]"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
          )}

          {/* STEP 4: Commitment */}
          {step === 4 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-2 tracking-tight text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.commitTitle}</h2>
              <textarea
                value={commitment}
                onChange={e => setCommitment(e.target.value)}
                placeholder={t.commitPlaceholder}
                rows={4}
                className="w-full mt-6 px-5 py-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none resize-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.06)] transition-all placeholder:text-gray-400 leading-[1.7]"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
          )}

          {/* STEP 5: Complete */}
          {step === 5 && (
            <div className="animate-[fadeIn_0.3s_ease] text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" className="w-10 h-10"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-[28px] font-extrabold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.doneTitle}</h2>
              <p className="text-[14px] text-gray-500 mb-8">{t.doneSub}</p>

              {/* Adaptive Plan Card */}
              <div className="bg-gray-900 rounded-2xl p-6 text-left mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.12), transparent 70%)' }} />
                <div className="relative z-[2]">
                  <div className="flex items-center gap-2 mb-4">
                    <SparkIcon />
                    <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.adaptiveTitle}</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {t.adaptiveItems.map((item, i) => (
                      <p key={i} className="text-[13.5px] text-gray-300 leading-[1.6]">{item}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={() => router.push('/dashboard')}
                  className="px-8 py-3.5 rounded-xl bg-[#F9250E] border-none cursor-pointer text-[14px] font-bold text-white hover:bg-[#E0200B] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}>
                  {t.dashboardBtn}
                </button>
                <button onClick={() => router.push('/ai-coach')}
                  className="px-8 py-3.5 rounded-xl bg-gray-900 border-none cursor-pointer text-[14px] font-bold text-white hover:bg-gray-800 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t.coachBtn}
                </button>
              </div>
            </div>
          )}

          {/* Continue Button */}
          {step < 5 && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`px-10 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white transition-all ${canContinue() ? 'bg-[#F9250E] hover:bg-[#E0200B] hover:-translate-y-px' : 'bg-gray-300 cursor-not-allowed'}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: canContinue() ? '0 4px 16px rgba(249,37,14,0.25)' : 'none' }}
              >
                {step === 4 ? t.submit : t.next}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
