'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

/* ── Weekly themes based on Dr. Ekobena's framework ── */
const weeklyThemes = {
  en: [
    { week: 1, title: 'Foundation: Where You Stand', desc: 'Understanding your baseline scores and identifying the patterns that shaped your leadership.' },
    { week: 2, title: 'The Inner Game', desc: 'Working on self-awareness, emotional triggers, and the internal narratives that drive your decisions.' },
    { week: 3, title: 'Rewiring Reactions', desc: 'Building new response patterns. Replacing reactive habits with intentional leadership behaviours.' },
    { week: 4, title: 'Vision & Direction', desc: 'Clarifying where you are leading people. Aligning daily actions with your long-term vision.' },
    { week: 5, title: 'The Communication Edge', desc: 'Mastering the art of clarity, active listening, and adapting your message to your audience.' },
    { week: 6, title: 'Building Trust', desc: 'Creating psychological safety in your team. Leading with vulnerability and consistency.' },
    { week: 7, title: 'Mid-Point Reset', desc: 'Reviewing progress, recalibrating goals, and deepening commitment to your growth areas.' },
    { week: 8, title: 'Performance & Accountability', desc: 'Raising standards without destroying morale. Having difficult conversations with grace.' },
    { week: 9, title: 'The Delegation Shift', desc: 'Moving from doing to empowering. Building systems that multiply your impact.' },
    { week: 10, title: 'Developing Others', desc: 'Transitioning from manager to coach. Investing in the next generation of leaders.' },
    { week: 11, title: 'Legacy Thinking', desc: 'Building something that outlasts you. Aligning your leadership with eternal impact.' },
    { week: 12, title: 'The New You', desc: 'Celebrating transformation, setting 12-month vision, and designing your ongoing growth rhythm.' },
  ],
  fr: [
    { week: 1, title: 'Fondation : Votre point de départ', desc: 'Comprendre vos scores de référence et identifier les schémas qui ont façonné votre leadership.' },
    { week: 2, title: 'Le jeu intérieur', desc: 'Travailler sur la conscience de soi, les déclencheurs émotionnels et les récits internes.' },
    { week: 3, title: 'Reconfigurer les réactions', desc: 'Construire de nouveaux schémas de réponse. Remplacer les habitudes réactives.' },
    { week: 4, title: 'Vision et direction', desc: 'Clarifier où vous conduisez les gens. Aligner les actions quotidiennes avec votre vision.' },
    { week: 5, title: "L'avantage communication", desc: "Maîtriser la clarté, l'écoute active et l'adaptation de votre message." },
    { week: 6, title: 'Bâtir la confiance', desc: "Créer la sécurité psychologique. Diriger avec vulnérabilité et cohérence." },
    { week: 7, title: 'Reset mi-parcours', desc: 'Revoir les progrès, recalibrer les objectifs et approfondir les engagements.' },
    { week: 8, title: 'Performance et responsabilité', desc: 'Élever les standards. Avoir des conversations difficiles avec grâce.' },
    { week: 9, title: 'Le virage délégation', desc: "Passer du faire à l'habilitation. Construire des systèmes qui multiplient votre impact." },
    { week: 10, title: 'Développer les autres', desc: 'De manager à coach. Investir dans la prochaine génération de leaders.' },
    { week: 11, title: "Penser l'héritage", desc: 'Construire quelque chose qui vous survit. Aligner votre leadership avec un impact éternel.' },
    { week: 12, title: 'Le nouveau vous', desc: 'Célébrer la transformation et concevoir votre rythme de croissance continue.' },
  ],
};

const steps = {
  en: [
    'Analysing your responses...',
    'Identifying strengths and blind spots...',
    'Generating your Coach Lens Summary...',
    'Building your 12-week personalised plan...',
    'Crafting your 12-month vision statement...',
    'Your coaching journey is ready',
  ],
  fr: [
    'Analyse de vos réponses...',
    'Identification des forces et angles morts...',
    'Génération de votre Résumé Coach Lens...',
    'Construction de votre plan personnalisé 12 semaines...',
    'Rédaction de votre vision 12 mois...',
    'Votre parcours de coaching est prêt',
  ],
};

function PlanGenerationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackSlug = searchParams.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const generatedRef = useRef(false);

  // ── Animate through steps ──
  useEffect(() => {
    if (currentStep >= 5) {
      setDone(true);
      return;
    }
    const delays = [2000, 2500, 3000, 3500, 2000];
    const timer = setTimeout(() => setCurrentStep(prev => prev + 1), delays[currentStep]);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // ── Auto-redirect once animation + plan are both ready ──
  useEffect(() => {
    if (done && planGenerated) {
      const t = setTimeout(() => router.push('/dashboard'), 1500);
      return () => clearTimeout(t);
    }
  }, [done, planGenerated]);

  // ── Generate plan in background ──
  useEffect(() => {
    if (!user || generatedRef.current) return;
    generatedRef.current = true;

    async function generatePlan() {
      try {
        // Get track
        const { data: track } = await supabase
          .from('tracks').select('id, name_en, name_fr').eq('slug', trackSlug).single();
        if (!track) return;

        // Get journey
        const { data: journey } = await supabase
          .from('journeys').select('id')
          .eq('user_id', user!.id).eq('track_id', track.id).single();
        if (!journey) return;

        // Check if plan already exists — if so, nothing to do
        const { data: existing } = await supabase
          .from('coaching_plans').select('id').eq('journey_id', journey.id).single();
        if (existing) return;

        // Get pillar scores
        const { data: scores } = await supabase
          .from('pillar_scores').select('pillar_id, score, sub_domain_scores')
          .eq('journey_id', journey.id);
        if (!scores || scores.length === 0) return;

        // Get pillar names
        const pillarIds = scores.map(s => s.pillar_id);
        const { data: pillars } = await supabase
          .from('pillars').select('id, name_en, name_fr, sort_order')
          .in('id', pillarIds).order('sort_order');

        // Identify top 3 weakest sub-domains
        const allSubs: { name: string; score: number; pillar_en: string; pillar_fr: string }[] = [];
        scores.forEach(sc => {
          const pillar = pillars?.find(p => p.id === sc.pillar_id);
          if (sc.sub_domain_scores && pillar) {
            Object.entries(sc.sub_domain_scores).forEach(([name, score]) => {
              allSubs.push({ name, score: score as number, pillar_en: pillar.name_en, pillar_fr: pillar.name_fr });
            });
          }
        });
        allSubs.sort((a, b) => a.score - b.score);
        const focusAreas = allSubs.slice(0, 3).map(s => ({
          name: s.name,
          score: s.score,
          pillar_en: s.pillar_en,
          pillar_fr: s.pillar_fr,
        }));

        // Find weakest and strongest pillars
        const sortedPillars = scores
          .map(sc => ({ ...sc, pillar: pillars?.find(p => p.id === sc.pillar_id) }))
          .sort((a, b) => Number(a.score) - Number(b.score));
        const weakest = sortedPillars[0]?.pillar;
        const strongest = sortedPillars[sortedPillars.length - 1]?.pillar;
        const overallScore = scores.reduce((a, s) => a + Number(s.score), 0) / scores.length;

        // Generate Coach Lens Summary
        const coachLens = `Based on your assessment (overall score: ${overallScore.toFixed(1)}/5), your strongest area is ${strongest?.name_en || 'N/A'} and your primary growth area is ${weakest?.name_en || 'N/A'}. Your top 3 focus areas for the next 12 weeks are: ${focusAreas.map(f => `${f.name.replace(/-/g, ' ')} (${f.score}/5)`).join(', ')}. Dr. Ekobena recommends starting with the fundamentals — building self-awareness and emotional regulation before tackling strategic and relational dimensions.`;

        // Build 12-week plan
        const themes = weeklyThemes.en;
        const planData = themes.map(w => ({
          week: w.week,
          title_en: w.title,
          title_fr: weeklyThemes.fr[w.week - 1].title,
          desc_en: w.desc,
          desc_fr: weeklyThemes.fr[w.week - 1].desc,
          focus: focusAreas[Math.min(Math.floor((w.week - 1) / 4), 2)]?.name || focusAreas[0]?.name,
          exercises: [
            { type: 'reflection', title_en: 'Daily Reflection', title_fr: 'Réflexion quotidienne' },
            { type: 'practice', title_en: 'Practical Exercise', title_fr: 'Exercice pratique' },
            { type: 'conversation', title_en: 'Real Conversation', title_fr: 'Conversation réelle' },
          ],
        }));

        // Generate 12-month vision
        const vision = `In 12 months, you will have transformed your approach to ${weakest?.name_en?.toLowerCase() || 'leadership'}, built solid foundations in ${focusAreas[0]?.name.replace(/-/g, ' ') || 'self-awareness'}, and developed the confidence and competence to lead with purpose and intentionality in every area of your life.`;

        // Save to database
        await supabase.from('coaching_plans').upsert({
          journey_id: journey.id,
          focus_areas: focusAreas,
          coach_lens_summary: coachLens,
          plan_data: {
            weeks: planData,
            vision_en: vision,
            vision_fr: vision,
            weakest_pillar_en: weakest?.name_en,
            weakest_pillar_fr: weakest?.name_fr,
            strongest_pillar_en: strongest?.name_en,
            strongest_pillar_fr: strongest?.name_fr,
            overall_score: overallScore,
          },
        }, { onConflict: 'journey_id' });

        // Update journey status
        await supabase.from('journeys').update({
          status: 'plan_generated',
          updated_at: new Date().toISOString(),
        }).eq('id', journey.id);

      } catch (err) {
        // Log the real error so you can debug in console/Vercel logs
        console.error('[PlanGeneration] Error:', err);
      } finally {
        // ALWAYS unblock the UI — success, missing data, or error
        setPlanGenerated(true);
      }
    }

    generatePlan();
  }, [user?.id, trackSlug]);

  const stp = steps[lang];

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.08), transparent 65%)', filter: 'blur(100px)' }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.05), transparent 60%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-[480px] w-full px-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-16">
          <div className="w-10 h-10 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[18px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
          <span className="text-[19px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>Equip<span className="text-[#F9250E]">2</span>Lead</span>
        </div>

        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-10">
          {!done ? (
            <div className="w-20 h-20 rounded-full border-[3px] border-white/10 flex items-center justify-center animate-pulse">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F9250E" strokeWidth="2" className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }}>
                <path d="M12 2v4m0 12v4m-8-10H0m24 0h-4m-2.3-5.7l2.8-2.8M3.5 20.5l2.8-2.8M20.5 20.5l-2.8-2.8M3.5 3.5l2.8 2.8"/>
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#F9250E] flex items-center justify-center animate-[scaleIn_0.4s_ease]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-10 h-10"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-12">
          {stp.map((label, i) => {
            const isActive = i === currentStep && !done;
            const isDone = i < currentStep || done;
            const isFuture = i > currentStep && !done;
            const isLast = i === 5;

            return (
              <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${isFuture ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-[#F9250E]' : isActive ? 'border-2 border-[#F9250E]' : 'border border-white/20'}`}>
                  {isDone && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#F9250E] animate-pulse" />}
                </div>
                <span className={`text-[14px] font-medium transition-colors ${isDone ? 'text-white' : isActive ? 'text-[#F9250E] font-semibold' : 'text-white/30'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {isLast && done ? (
                    <span className="text-[#F9250E] font-bold">{label}</span>
                  ) : label}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA — shown when animation done + plan ready */}
        {done && planGenerated && (
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

        {/* Spinner — shown when animation done but plan still saving */}
        {done && !planGenerated && (
          <div className="flex items-center justify-center gap-2 text-white/50 text-[13px]">
            <div className="w-4 h-4 border-2 border-white/30 border-t-[#F9250E] rounded-full animate-spin" />
            {lang === 'en' ? 'Finalising your plan...' : 'Finalisation du plan...'}
          </div>
        )}
      </div>

      {/* Language toggle */}
      <button
        onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
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
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center"><div className="text-white/50" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</div></div>}>
      <PlanGenerationContent />
    </Suspense>
  );
}
