'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

/* ═══ CONTEXT QUESTIONS PER TRACK (Phase 1) ═══ */
type CtxSelect = { type: 'select'; en: string; fr: string; tag?: string; tagFr?: string; options: string[]; optionsFr: string[] };
type CtxText = { type: 'text'; en: string; fr: string; tag?: string; tagFr?: string; placeholder?: string };
type CtxMulti = { type: 'multi'; en: string; fr: string; max: number; options: string[]; optionsFr: string[] };
type CtxStep = CtxSelect | CtxText | CtxMulti;

const contextByTrack: Record<string, CtxStep[]> = {
  leadership: [
    { type: 'text', en: 'What is your current leadership role or title?', fr: 'Quel est votre rôle ou titre de leadership actuel ?', tag: 'ABOUT YOU', tagFr: 'À PROPOS DE VOUS', placeholder: 'Type your answer...' },
    { type: 'select', en: 'How many years of leadership experience do you have?', fr: "Combien d'années d'expérience en leadership avez-vous ?", options: ['Less than 1 year','1–3 years','3–7 years','7–15 years','15+ years'], optionsFr: ['Moins de 1 an','1–3 ans','3–7 ans','7–15 ans','15+ ans'] },
    { type: 'select', en: 'How many people do you directly lead?', fr: 'Combien de personnes dirigez-vous directement ?', options: ['None yet','1–5','6–15','16–50','50+'], optionsFr: ['Aucune','1–5','6–15','16–50','50+'] },
  ],
  ministry: [
    { type: 'text', en: 'What is your ministry role or calling?', fr: 'Quel est votre rôle ou appel ministériel ?', tag: 'ABOUT YOUR MINISTRY', tagFr: 'À PROPOS DE VOTRE MINISTÈRE' },
    { type: 'select', en: 'Ministry context?', fr: 'Contexte ministériel ?', options: ['Local church pastor','Church planter','Ministry leader/director','Missionary','Marketplace ministry','Volunteer leader','Exploring my calling'], optionsFr: ['Pasteur local','Planteur d\'église','Responsable ministériel','Missionnaire','Ministère sur le marché','Leader bénévole','Explorer mon appel'] },
    { type: 'select', en: 'Years in ministry?', fr: 'Années en ministère ?', options: ['Exploring/Preparing','Less than 2 years','2–5 years','5–15 years','15+ years'], optionsFr: ['En exploration','Moins de 2 ans','2–5 ans','5–15 ans','15+ ans'] },
  ],
  marriage: [
    { type: 'select', en: 'What is your current marriage status?', fr: 'Statut matrimonial actuel ?', tag: 'ABOUT YOUR MARRIAGE', tagFr: 'À PROPOS DE VOTRE MARIAGE', options: ['Married','Engaged','Separated — hoping to reconcile','Dating seriously'], optionsFr: ['Marié(e)','Fiancé(e)','Séparé(e)','En couple sérieux'] },
    { type: 'select', en: 'How long have you been together?', fr: 'Depuis combien de temps ?', options: ['Less than 1 year','1–3 years','3–7 years','7–15 years','15+ years'], optionsFr: ['Moins de 1 an','1–3 ans','3–7 ans','7–15 ans','15+ ans'] },
    { type: 'select', en: 'Have you done marriage coaching before?', fr: 'Avez-vous déjà fait du coaching conjugal ?', options: ['No, this is our first time','Yes, it helped','Yes, but it didn\'t work','Yes, multiple times'], optionsFr: ['Non, première fois','Oui, ça a aidé','Oui, mais ça n\'a pas marché','Oui, plusieurs fois'] },
  ],
  entrepreneur: [
    { type: 'text', en: 'What is your business name and what do you sell/offer?', fr: 'Nom et offre de votre entreprise ?', tag: 'YOUR BUSINESS', tagFr: 'VOTRE ENTREPRISE' },
    { type: 'select', en: 'Business stage?', fr: 'Stade ?', options: ['Idea stage','Pre-revenue','Under $50K/year','$50K–$250K/year','$250K–$1M/year','$1M+/year'], optionsFr: ['Idée','Pas de revenus','<50K€/an','50K–250K€/an','250K–1M€/an','1M+€/an'] },
    { type: 'select', en: 'How long has the business been operating?', fr: 'Depuis combien de temps ?', options: ['Not yet started','Less than 1 year','1–3 years','3–7 years','7+ years'], optionsFr: ['Pas encore','Moins de 1 an','1–3 ans','3–7 ans','7+ ans'] },
    { type: 'select', en: 'Team size?', fr: 'Taille d\'équipe ?', options: ['Just me','1–3 people','4–10 people','11–50 people','50+'], optionsFr: ['Juste moi','1–3','4–10','11–50','50+'] },
  ],
  personal: [
    { type: 'select', en: 'What best describes where you are in life right now?', fr: 'Où en êtes-vous dans la vie ?', tag: 'ABOUT YOU', tagFr: 'À PROPOS DE VOUS', options: ['In transition','Stuck — I need to grow but don\'t know where to start','Growing — I want to accelerate','Rebuilding — recovering from a setback','Exploring — figuring out who I am'], optionsFr: ['En transition','Bloqué(e)','En croissance','En reconstruction','En exploration'] },
    { type: 'select', en: 'Age range?', fr: 'Tranche d\'âge ?', options: ['18–25','26–35','36–45','46–55','55+'], optionsFr: ['18–25','26–35','36–45','46–55','55+'] },
  ],
};

/* ═══ VISION QUESTIONS PER TRACK (Phase 3) ═══ */
const visionByTrack: Record<string, CtxStep[]> = {
  leadership: [
    { type: 'text', en: 'What is the single biggest leadership challenge you face right now?', fr: 'Quel est le plus grand défi de leadership actuellement ?', tag: 'GROWTH PRIORITIES', tagFr: 'PRIORITÉS DE CROISSANCE' },
    { type: 'multi', en: 'Which 3 domains feel most urgent to develop?', fr: 'Quels 3 domaines sont les plus urgents ?', max: 3, options: ['Self-Awareness','Vision','Communication','Decision-Making','Team Building','Conflict Resolution','Delegation','Resilience','Character','Emotional Intelligence','Accountability','Coaching & Developing Others'], optionsFr: ['Conscience de soi','Vision','Communication','Décision','Équipe','Conflits','Délégation','Résilience','Caractère','Intelligence émotionnelle','Responsabilité','Coaching et développement des autres'] },
    { type: 'text', en: 'What does success look like for you 12 months from now?', fr: 'À quoi ressemble le succès dans 12 mois ?' },
    { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: 'Êtes-vous prêt à investir du temps sérieux ?', options: ['Very ready — I\'ll do whatever it takes','Ready — but I need structure','Curious — let\'s see what this looks like','Skeptical — convince me'], optionsFr: ['Très prêt','Prêt — besoin de structure','Curieux','Sceptique'] },
  ],
  ministry: [
    { type: 'text', en: 'What is the single biggest challenge in your ministry right now?', fr: 'Le plus grand défi dans votre ministère ?', tag: 'GROWTH PRIORITIES', tagFr: 'PRIORITÉS DE CROISSANCE' },
    { type: 'text', en: 'What does fruitful ministry look like for you in 12 months?', fr: 'À quoi ressemble un ministère fructueux dans 12 mois ?' },
    { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: 'Êtes-vous prêt ?', options: ['Very ready — I\'ll do whatever it takes','Ready — but I need structure','Curious — let\'s see','Skeptical — convince me'], optionsFr: ['Très prêt','Prêt','Curieux','Sceptique'] },
  ],
  marriage: [
    { type: 'text', en: 'What is the most important thing you want to address in your marriage right now?', fr: 'La chose la plus importante à traiter ?', tag: 'READINESS & SAFETY', tagFr: 'PRÉPARATION ET SÉCURITÉ' },
    { type: 'select', en: 'Do you feel safe and respected in your marriage?', fr: 'Vous sentez-vous en sécurité ?', options: ['Yes, always','Mostly, with some concerns','Sometimes — it depends','No — I have serious concerns'], optionsFr: ['Oui, toujours','Surtout','Parfois','Non — inquiétudes sérieuses'] },
    { type: 'select', en: 'How willing is your spouse to participate?', fr: 'Votre conjoint(e) est disposé(e) ?', options: ['Very willing','Willing but cautious','Reluctant','They don\'t know yet'], optionsFr: ['Très disposé(e)','Prudent(e)','Réticent(e)','Ne sait pas encore'] },
    { type: 'text', en: 'Describe your marriage in 12 months if this coaching works.', fr: 'Décrivez votre mariage dans 12 mois si ça fonctionne.' },
  ],
  entrepreneur: [
    { type: 'text', en: 'What is the single biggest business challenge you face right now?', fr: 'Le plus grand défi business ?', tag: 'GROWTH PRIORITIES', tagFr: 'PRIORITÉS DE CROISSANCE' },
    { type: 'text', en: 'What does success look like for your business in 12 months?', fr: 'Le succès dans 12 mois ?' },
    { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: 'Êtes-vous prêt ?', options: ['Very ready — I\'ll do whatever it takes','Ready — but I need structure','Curious — let\'s see','Skeptical — convince me'], optionsFr: ['Très prêt','Prêt','Curieux','Sceptique'] },
  ],
  personal: [
    { type: 'text', en: 'What is the biggest thing you want to change about your life?', fr: 'La plus grande chose à changer ?', tag: 'YOUR VISION', tagFr: 'VOTRE VISION' },
    { type: 'multi', en: 'Which 3 areas feel most urgent to develop?', fr: 'Quels 3 domaines les plus urgents ?', max: 3, options: ['Purpose & Identity','Emotional Intelligence','Habits & Discipline','Relationships','Life Design','Mindset','Health & Wellbeing'], optionsFr: ['But & Identité','Intelligence émotionnelle','Habitudes','Relations','Projet de vie','Mentalité','Santé'] },
    { type: 'text', en: 'If this coaching works, what does your life look like in 12 months?', fr: 'Votre vie dans 12 mois ?' },
    { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: 'Êtes-vous prêt(e) ?', options: ['Very ready — I\'ll do whatever it takes','Ready — but I need structure','Curious — let\'s see','Skeptical — convince me'], optionsFr: ['Très prêt(e)','Prêt(e)','Curieux/se','Sceptique'] },
  ],
};

const scaleLabels = {
  en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  fr: ["Pas du tout d'accord", "Pas d'accord", 'Neutre', "D'accord", "Tout à fait d'accord"],
};
const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];

type QData = { id: string; text_en: string; text_fr: string; sort_order: number };
type DimData = { id: string; name_en: string; name_fr: string; questions: QData[] };
type PillarData = { id: string; name_en: string; name_fr: string; sort_order: number; dims: DimData[] };

function IntakeContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const trackSlug = sp.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data
  const [pillars, setPillars] = useState<PillarData[]>([]);
  const [journeyId, setJourneyId] = useState<string | null>(null);

  // Phase: 'context' | 'assessment' | 'vision' | 'complete'
  const [phase, setPhase] = useState<'context' | 'pillar-intro' | 'assessment' | 'vision' | 'saving' | 'complete'>('context');
  const [ctxStep, setCtxStep] = useState(0);
  const [ctxAnswers, setCtxAnswers] = useState<Record<number, any>>({});
  const [visionStep, setVisionStep] = useState(0);
  const [visionAnswers, setVisionAnswers] = useState<Record<number, any>>({});

  // Assessment state
  const [currentPillar, setCurrentPillar] = useState(0);
  const [currentDim, setCurrentDim] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const ctxSteps = contextByTrack[trackSlug] || [];
  const visSteps = visionByTrack[trackSlug] || [];

  // Total questions for progress
  const totalLikert = pillars.reduce((a, p) => a + p.dims.reduce((b, d) => b + d.questions.length, 0), 0);
  const totalSteps = ctxSteps.length + totalLikert + visSteps.length;

  // Current flat position for progress bar
  let currentFlat = 0;
  if (phase === 'context') currentFlat = ctxStep;
  else if (phase === 'pillar-intro' || phase === 'assessment') {
    currentFlat = ctxSteps.length;
    for (let p = 0; p < currentPillar; p++) currentFlat += pillars[p]?.dims.reduce((a, d) => a + d.questions.length, 0) || 0;
    if (pillars[currentPillar]) {
      for (let d = 0; d < currentDim; d++) currentFlat += pillars[currentPillar].dims[d]?.questions.length || 0;
    }
  } else if (phase === 'vision') {
    currentFlat = ctxSteps.length + totalLikert + visionStep;
  } else if (phase === 'complete') currentFlat = totalSteps;

  const progress = totalSteps > 0 ? (currentFlat / totalSteps) * 100 : 0;

  // ── Load ALL pillars + questions ──
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data: track } = await supabase.from('tracks').select('id').eq('slug', trackSlug).single();
        if (!track) { setError('Track not found'); return; }

        const { data: pils } = await supabase.from('pillars').select('id, name_en, name_fr, sort_order').eq('track_id', track.id).order('sort_order');
        if (!pils || pils.length === 0) { setError('No pillars found'); return; }

        const allPillars: PillarData[] = [];
        for (const pil of pils) {
          const { data: dims } = await supabase.from('sub_domains')
            .select('id, name_en, name_fr, sort_order, questions(id, text_en, text_fr, sort_order)')
            .eq('pillar_id', pil.id).order('sort_order');
          allPillars.push({
            ...pil,
            dims: (dims || []).map(d => ({ ...d, questions: (d.questions as any[]).sort((a: any, b: any) => a.sort_order - b.sort_order) })),
          });
        }
        if (cancelled) return;
        setPillars(allPillars);

        // Get or create journey
        let { data: journey } = await supabase.from('journeys').select('id, pre_assessment_data').eq('user_id', user!.id).eq('track_id', track.id).single();
        if (!journey) {
          const { data: nj } = await supabase.from('journeys').insert({ user_id: user!.id, track_id: track.id }).select('id, pre_assessment_data').single();
          journey = nj;
        }
        if (journey) {
          setJourneyId(journey.id);
          // Restore existing Likert answers
          const allQIds = allPillars.flatMap(p => p.dims.flatMap(d => d.questions.map(q => q.id)));
          if (allQIds.length > 0) {
            const { data: existing } = await supabase.from('responses').select('question_id, value').eq('journey_id', journey.id).in('question_id', allQIds);
            if (existing && existing.length > 0) {
              const restored: Record<string, number> = {};
              allPillars.forEach((pil, pi) => pil.dims.forEach((dim, di) => dim.questions.forEach((q, qi) => {
                const found = existing.find(e => e.question_id === q.id);
                if (found) restored[`${pi}-${di}-${qi}`] = found.value;
              })));
              if (!cancelled) setAnswers(restored);
            }
          }
        }
        if (!cancelled) setLoading(false);
      } catch { if (!cancelled) setError('Something went wrong'); }
    }
    load();
    return () => { cancelled = true; };
  }, [trackSlug, user?.id]);

  // ── Save single Likert answer ──
  const saveLikert = async (pi: number, di: number, qi: number, value: number) => {
    if (!journeyId || !pillars[pi]) return;
    const q = pillars[pi].dims[di].questions[qi];
    await supabase.from('responses').upsert({ journey_id: journeyId, question_id: q.id, pillar_id: pillars[pi].id, value }, { onConflict: 'journey_id,question_id' });
  };

  // ── Compute pillar score ──
  const computePillarScore = async (pi: number) => {
    if (!journeyId) return;
    const pil = pillars[pi];
    const subScores: Record<string, number> = {};
    let total = 0, count = 0;
    pil.dims.forEach((dim, di) => {
      let s = 0, c = 0;
      dim.questions.forEach((_, qi) => { const v = answers[`${pi}-${di}-${qi}`]; if (v) { s += v; c++; } });
      const avg = c > 0 ? s / c : 0;
      subScores[dim.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-')] = parseFloat(avg.toFixed(2));
      total += s; count += c;
    });
    const score = count > 0 ? total / count : 0;
    await supabase.from('pillar_scores').upsert({ journey_id: journeyId, pillar_id: pil.id, score: parseFloat(score.toFixed(2)), max_score: 5.00, sub_domain_scores: subScores }, { onConflict: 'journey_id,pillar_id' });
  };

  // ── Save context + vision to journey ──
  const saveAllData = async () => {
    if (!journeyId) return;
    const preData: Record<string, any> = {};
    ctxSteps.forEach((s, i) => { preData[`context_${i}`] = { question: s.en, answer: ctxAnswers[i] }; });
    visSteps.forEach((s, i) => { preData[`vision_${i}`] = { question: s.en, answer: visionAnswers[i] }; });
    await supabase.from('journeys').update({ pre_assessment_data: preData, status: 'completed', updated_at: new Date().toISOString() }).eq('id', journeyId);
  };

  // ── Current sub-domain questions for grouped display ──
  const pil = pillars[currentPillar];
  const dim = pil?.dims[currentDim];
  const color = pillarColors[currentPillar % 5];

  // Check if all questions in current dim are answered
  const dimAllAnswered = dim ? dim.questions.every((_, qi) => answers[`${currentPillar}-${currentDim}-${qi}`] !== undefined) : false;

  // ── Navigation handlers ──
  const nextDim = async () => {
    if (!pil) return;
    if (currentDim < pil.dims.length - 1) {
      setCurrentDim(currentDim + 1);
    } else {
      // Pillar complete — compute score
      await computePillarScore(currentPillar);
      if (currentPillar < pillars.length - 1) {
        setCurrentPillar(currentPillar + 1);
        setCurrentDim(0);
        setPhase('pillar-intro');
      } else {
        // All pillars done — go to vision
        setPhase('vision');
      }
    }
  };

  const prevDim = () => {
    if (currentDim > 0) setCurrentDim(currentDim - 1);
    else if (currentPillar > 0) {
      setCurrentPillar(currentPillar - 1);
      setCurrentDim(pillars[currentPillar - 1].dims.length - 1);
    }
  };

  // ── RENDER ──
  if (loading || pillars.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {error ? <p className="text-red-500">{error}</p> : <div className="text-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#F9250E] rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-400">{lang === 'en' ? 'Loading your assessment...' : 'Chargement...'}</p></div>}
    </div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-[700px] mx-auto flex items-center justify-between">
          <h1 className="text-[15px] font-extrabold tracking-wider text-gray-900" style={{ fontFamily: "'Libre Baskerville', serif" }}>EQUIP2LEAD</h1>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-gray-400">{Math.round(progress)}%</span>
            <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>{lang === 'en' ? 'FR' : 'EN'}</button>
          </div>
        </div>
        <div className="max-w-[700px] mx-auto mt-2"><div className="h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-[#059669] transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[600px]">

        {/* ═══ PHASE 1: CONTEXT ═══ */}
        {phase === 'context' && ctxSteps[ctxStep] && (() => {
          const s = ctxSteps[ctxStep];
          return (
            <div key={`ctx-${ctxStep}`} className="animate-[fadeIn_0.25s_ease]">
              {'tag' in s && s.tag && (
                <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-xl bg-amber-50 border-l-4 border-amber-400">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">{lang === 'en' ? s.tag : (s as any).tagFr || s.tag}</div>
                </div>
              )}
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>{lang === 'en' ? s.en : s.fr}</h2>
              {s.type === 'select' && (
                <div className="flex flex-col gap-3">
                  {s.options.map((opt, i) => (
                    <button key={i} onClick={() => setCtxAnswers(p => ({ ...p, [ctxStep]: opt }))}
                      className={`w-full py-4 px-6 rounded-xl border-[1.5px] text-[15px] font-medium cursor-pointer transition-all text-left ${ctxAnswers[ctxStep] === opt ? 'border-[#F9250E] bg-red-50/30 text-gray-900' : 'border-gray-200 hover:border-gray-300 text-gray-800'}`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {lang === 'en' ? opt : s.optionsFr[i]}
                    </button>
                  ))}
                </div>
              )}
              {s.type === 'text' && (
                <textarea value={ctxAnswers[ctxStep] || ''} onChange={e => setCtxAnswers(p => ({ ...p, [ctxStep]: e.target.value }))}
                  placeholder={s.placeholder || (lang === 'en' ? 'Share your thoughts...' : 'Partagez vos pensées...')} rows={4}
                  className="w-full px-5 py-4 rounded-xl border-[1.5px] border-gray-200 text-[15px] text-gray-900 outline-none resize-none focus:border-[#F9250E] transition-all placeholder:text-gray-400 leading-[1.7]" style={{ fontFamily: 'inherit' }} />
              )}
            </div>
          );
        })()}

        {/* ═══ PILLAR INTRO ═══ */}
        {phase === 'pillar-intro' && pil && (
          <div className="text-center animate-[fadeIn_0.4s_ease]">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-[22px] font-bold" style={{ background: `${color}12`, color }}>{currentPillar + 1}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-gray-400">{lang === 'en' ? 'Pillar' : 'Pilier'} {currentPillar + 1} {lang === 'en' ? 'of' : 'sur'} {pillars.length}</div>
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? pil.name_en : pil.name_fr}</h2>
            <p className="text-[14px] text-gray-500 mb-2">{pil.dims.length} {lang === 'en' ? 'sub-domains' : 'sous-domaines'} · {pil.dims.reduce((a, d) => a + d.questions.length, 0)} {lang === 'en' ? 'questions' : 'questions'}</p>
            <p className="text-[13px] text-gray-400 mb-8">{lang === 'en' ? 'Rate your agreement with each statement 1–5' : 'Évaluez votre accord avec chaque énoncé 1–5'}</p>
            <button onClick={() => setPhase('assessment')} className="px-8 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white hover:-translate-y-px transition-all" style={{ background: color, boxShadow: `0 4px 16px ${color}40`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? 'Begin' : 'Commencer'} →
            </button>
          </div>
        )}

        {/* ═══ PHASE 2: GROUPED LIKERT ═══ */}
        {phase === 'assessment' && dim && (
          <div className="animate-[fadeIn_0.25s_ease]" key={`${currentPillar}-${currentDim}`}>
            {/* Sub-domain header */}
            <div className="mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{lang === 'en' ? pil!.name_en : pil!.name_fr} · {lang === 'en' ? 'Dimension' : 'Dimension'} {currentDim + 1}/{pil!.dims.length}</div>
              <h2 className="text-[22px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? dim.name_en : dim.name_fr}</h2>
            </div>

            {/* All questions for this sub-domain */}
            <div className="flex flex-col gap-5">
              {dim.questions.map((q, qi) => {
                const key = `${currentPillar}-${currentDim}-${qi}`;
                const curVal = answers[key];
                return (
                  <div key={q.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <p className="text-[15px] font-semibold text-gray-800 leading-[1.5] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {lang === 'en' ? q.text_en : q.text_fr}
                    </p>
                    <div className="flex gap-2 max-md:gap-1.5">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button key={val} onClick={() => { setAnswers(p => ({ ...p, [key]: val })); saveLikert(currentPillar, currentDim, qi, val); }}
                          className={`flex-1 py-3 max-md:py-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1 ${curVal === val ? 'scale-[1.03] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                          style={curVal === val ? { borderColor: color, background: `${color}08`, color } : { color: '#6B7280' }}>
                          <span className="text-[18px] max-md:text-[15px] font-bold">{val}</span>
                          <span className="text-[8px] font-semibold uppercase tracking-wider leading-tight text-center px-0.5">{scaleLabels[lang][val - 1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ PHASE 3: VISION ═══ */}
        {phase === 'vision' && visSteps[visionStep] && (() => {
          const s = visSteps[visionStep];
          return (
            <div key={`vis-${visionStep}`} className="animate-[fadeIn_0.25s_ease]">
              {'tag' in s && s.tag && (
                <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-xl bg-blue-50 border-l-4 border-blue-400">
                  <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">{lang === 'en' ? s.tag : (s as any).tagFr || s.tag}</div>
                </div>
              )}
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>{lang === 'en' ? s.en : s.fr}</h2>
              {s.type === 'select' && (
                <div className="flex flex-col gap-3">
                  {s.options.map((opt, i) => (
                    <button key={i} onClick={() => setVisionAnswers(p => ({ ...p, [visionStep]: opt }))}
                      className={`w-full py-4 px-6 rounded-xl border-[1.5px] text-[15px] font-medium cursor-pointer transition-all text-left ${visionAnswers[visionStep] === opt ? 'border-[#F9250E] bg-red-50/30 text-gray-900' : 'border-gray-200 hover:border-gray-300 text-gray-800'}`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? opt : s.optionsFr[i]}</button>
                  ))}
                </div>
              )}
              {s.type === 'text' && (
                <textarea value={visionAnswers[visionStep] || ''} onChange={e => setVisionAnswers(p => ({ ...p, [visionStep]: e.target.value }))}
                  placeholder={lang === 'en' ? 'Share your thoughts...' : 'Partagez vos pensées...'} rows={4}
                  className="w-full px-5 py-4 rounded-xl border-[1.5px] border-gray-200 text-[15px] text-gray-900 outline-none resize-none focus:border-[#F9250E] transition-all placeholder:text-gray-400 leading-[1.7]" style={{ fontFamily: 'inherit' }} />
              )}
              {s.type === 'multi' && (
                <div className="flex flex-col gap-3">
                  {s.options.map((opt, i) => {
                    const sel = (visionAnswers[visionStep] || []) as string[];
                    const isSel = sel.includes(opt); const atMax = sel.length >= s.max && !isSel;
                    return (
                      <button key={i} onClick={() => { if (isSel) setVisionAnswers(p => ({ ...p, [visionStep]: sel.filter(x => x !== opt) })); else if (!atMax) setVisionAnswers(p => ({ ...p, [visionStep]: [...sel, opt] })); }}
                        className={`w-full py-4 px-6 rounded-xl border-[1.5px] text-[15px] font-medium cursor-pointer transition-all text-left flex items-center gap-3 ${isSel ? 'border-[#F9250E] bg-red-50/30 text-gray-900' : atMax ? 'border-gray-100 bg-gray-50 text-gray-400' : 'border-gray-200 hover:border-gray-300 text-gray-800'}`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSel ? 'border-[#F9250E] bg-[#F9250E]' : 'border-gray-300'}`}>
                          {isSel && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        {lang === 'en' ? opt : s.optionsFr[i]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ═══ SAVING ═══ */}
        {phase === 'saving' && (
          <div className="text-center animate-[fadeIn_0.3s_ease]">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#F9250E] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{lang === 'en' ? 'Generating your coaching plan...' : 'Génération de votre plan...'}</p>
          </div>
        )}

        {/* ═══ COMPLETE ═══ */}
        {phase === 'complete' && (
          <div className="text-center animate-[fadeIn_0.5s_ease]">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" className="w-10 h-10"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Assessment Complete!' : 'Évaluation terminée !'}</h2>
            <p className="text-[15px] text-gray-500 mb-8">{lang === 'en' ? 'All pillars scored. Generating your coaching plan...' : 'Tous les piliers évalués. Génération du plan...'}</p>
          </div>
        )}

        </div>
      </div>

      {/* ═══ FOOTER NAV ═══ */}
      {phase !== 'saving' && phase !== 'complete' && phase !== 'pillar-intro' && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
          <div className="max-w-[600px] mx-auto flex items-center justify-between">
            <button onClick={() => {
              if (phase === 'context' && ctxStep > 0) setCtxStep(ctxStep - 1);
              else if (phase === 'assessment') prevDim();
              else if (phase === 'vision' && visionStep > 0) setVisionStep(visionStep - 1);
              else if (phase === 'vision' && visionStep === 0) { setPhase('assessment'); }
            }} disabled={phase === 'context' && ctxStep === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-[14px] font-semibold text-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-gray-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ← {lang === 'en' ? 'Back' : 'Retour'}
            </button>
            <button onClick={async () => {
              if (phase === 'context') {
                const s = ctxSteps[ctxStep];
                const a = ctxAnswers[ctxStep];
                const valid = s.type === 'select' ? a !== undefined : s.type === 'text' ? a?.trim().length > 0 : true;
                if (!valid) return;
                if (ctxStep < ctxSteps.length - 1) setCtxStep(ctxStep + 1);
                else { setPhase('pillar-intro'); }
              } else if (phase === 'assessment') {
                if (!dimAllAnswered) return;
                await nextDim();
              } else if (phase === 'vision') {
                const s = visSteps[visionStep];
                const a = visionAnswers[visionStep];
                const valid = s.type === 'select' ? a !== undefined : s.type === 'text' ? a?.trim().length > 0 : s.type === 'multi' ? a?.length > 0 : true;
                if (!valid) return;
                if (visionStep < visSteps.length - 1) setVisionStep(visionStep + 1);
                else {
                  setPhase('saving');
                  await saveAllData();
                  router.push(`/plan-generation?track=${trackSlug}`);
                }
              }
            }}
              disabled={
                (phase === 'context' && (() => { const s = ctxSteps[ctxStep]; const a = ctxAnswers[ctxStep]; return s?.type === 'select' ? !a : s?.type === 'text' ? !a?.trim() : false; })()) ||
                (phase === 'assessment' && !dimAllAnswered) ||
                (phase === 'vision' && (() => { const s = visSteps[visionStep]; const a = visionAnswers[visionStep]; return s?.type === 'select' ? !a : s?.type === 'text' ? !a?.trim() : s?.type === 'multi' ? !a?.length : false; })())
              }
              className="px-8 py-3 rounded-xl border-none text-[14px] font-bold text-white cursor-pointer transition-all bg-[#F9250E] hover:-translate-y-px disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.2)' }}>
              {phase === 'vision' && visionStep === visSteps.length - 1 ? (lang === 'en' ? 'Generate My Coaching Plan ✦' : 'Générer mon plan ✦') : (lang === 'en' ? 'Continue →' : 'Continuer →')}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</div>}>
      <IntakeContent />
    </Suspense>
  );
}
