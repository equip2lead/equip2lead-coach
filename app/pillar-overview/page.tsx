'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import UserMenu from '@/components/UserMenu';
import { Logo } from '@/components/Logo';

const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];

// Full pillar data for all tracks
const trackData: Record<string, { name: { en: string; fr: string }; pillars: { name: { en: string; fr: string }; sub: { en: string; fr: string }; dims: { name: { en: string; fr: string }; qCount: number }[] }[] }> = {
  leadership: {
    name: { en: 'Leadership Coaching', fr: 'Coaching Leadership' },
    pillars: [
      { name: { en: 'Personal Leadership', fr: 'Leadership Personnel' }, sub: { en: 'Leading Yourself First — The Leader as a Person', fr: 'Se diriger soi-même — Le leader en tant que personne' }, dims: [
        { name: { en: 'Self-Awareness', fr: 'Conscience de soi' }, qCount: 4 },
        { name: { en: 'Emotional Intelligence', fr: 'Intelligence émotionnelle' }, qCount: 4 },
        { name: { en: 'Leading Yourself', fr: 'Se diriger soi-même' }, qCount: 4 },
        { name: { en: 'Leadership Styles', fr: 'Styles de leadership' }, qCount: 4 },
        { name: { en: 'Decision-Making', fr: 'Prise de décision' }, qCount: 5 },
      ]},
      { name: { en: 'Directional Leadership', fr: 'Leadership Directionnel' }, sub: { en: 'Where Are We Going? — Results & Clarity', fr: 'Où allons-nous ? — Résultats et clarté' }, dims: [
        { name: { en: 'Vision', fr: 'Vision' }, qCount: 4 },
        { name: { en: 'Strategic Planning & Execution', fr: 'Planification stratégique' }, qCount: 4 },
        { name: { en: 'Goal Setting (SMART)', fr: "Définition d'objectifs" }, qCount: 4 },
        { name: { en: 'Accountability & Ownership', fr: 'Responsabilité' }, qCount: 4 },
      ]},
      { name: { en: 'Relational Leadership', fr: 'Leadership Relationnel' }, sub: { en: 'How We Lead People — Culture Pillar', fr: 'Comment diriger les gens — Pilier de culture' }, dims: [
        { name: { en: 'Communication', fr: 'Communication' }, qCount: 5 },
        { name: { en: 'Team Building', fr: "Construction d'équipe" }, qCount: 4 },
        { name: { en: 'Conflict Resolution', fr: 'Résolution de conflits' }, qCount: 4 },
        { name: { en: 'Servant Leadership', fr: 'Leadership serviteur' }, qCount: 4 },
      ]},
      { name: { en: 'Performance Leadership', fr: 'Leadership de Performance' }, sub: { en: 'Driving Standards — Execution Discipline', fr: "Élever les standards — Discipline d'exécution" }, dims: [
        { name: { en: 'Delegation', fr: 'Délégation' }, qCount: 4 },
        { name: { en: 'Feedback & Performance Management', fr: 'Feedback et performance' }, qCount: 4 },
        { name: { en: 'Managing Underperformance', fr: 'Gestion de la sous-performance' }, qCount: 4 },
        { name: { en: 'Difficult Conversations', fr: 'Conversations difficiles' }, qCount: 4 },
      ]},
      { name: { en: 'Multiplication & Impact', fr: 'Multiplication et Impact' }, sub: { en: 'Beyond You — Expansion Pillar', fr: "Au-delà de vous — Pilier d'expansion" }, dims: [
        { name: { en: 'Coaching', fr: 'Coaching' }, qCount: 4 },
        { name: { en: 'Mentoring', fr: 'Mentorat' }, qCount: 4 },
        { name: { en: 'Developing Leaders', fr: 'Développer des leaders' }, qCount: 4 },
        { name: { en: 'Legacy', fr: 'Héritage' }, qCount: 4 },
      ]},
    ],
  },
  ministry: {
    name: { en: 'Ministry Coaching', fr: 'Coaching Ministériel' },
    pillars: [
      { name: { en: 'Personal Foundation', fr: 'Fondation Personnelle' }, sub: { en: 'The Minister as a Person', fr: 'Le Ministre en tant que Personne' }, dims: [
        { name: { en: 'Calling Clarity', fr: "Clarté d'appel" }, qCount: 4 },
        { name: { en: 'Spiritual Disciplines', fr: 'Disciplines spirituelles' }, qCount: 4 },
        { name: { en: 'Character & Integrity', fr: 'Caractère et Intégrité' }, qCount: 4 },
        { name: { en: 'Emotional & Mental Health', fr: 'Santé émotionnelle et mentale' }, qCount: 5 },
      ]},
      { name: { en: 'Theological & Doctrinal Depth', fr: 'Profondeur Théologique' }, sub: { en: 'Sound doctrine shapes sound ministry', fr: 'La saine doctrine façonne un ministère sain' }, dims: [
        { name: { en: 'Biblical Literacy', fr: 'Connaissance biblique' }, qCount: 4 },
        { name: { en: 'Doctrinal Conviction', fr: 'Conviction doctrinale' }, qCount: 4 },
        { name: { en: 'Contextual Theology', fr: 'Théologie contextuelle' }, qCount: 4 },
        { name: { en: 'Apologetics & Critical Thinking', fr: 'Apologétique et pensée critique' }, qCount: 4 },
      ]},
      { name: { en: 'Ministry Skills', fr: 'Compétences Ministérielles' }, sub: { en: 'How You Serve', fr: 'Comment vous servez' }, dims: [
        { name: { en: 'Preaching & Teaching', fr: 'Prédication et Enseignement' }, qCount: 5 },
        { name: { en: 'Discipleship & Mentoring', fr: 'Discipulat et Mentorat' }, qCount: 4 },
        { name: { en: 'Pastoral Care', fr: 'Soin Pastoral' }, qCount: 4 },
        { name: { en: 'Worship & Creative Arts', fr: 'Adoration et Arts créatifs' }, qCount: 4 },
        { name: { en: 'Evangelism & Outreach', fr: 'Évangélisation' }, qCount: 4 },
      ]},
      { name: { en: 'Organisational Leadership', fr: 'Leadership Organisationnel' }, sub: { en: 'Running the House', fr: 'Gérer la maison' }, dims: [
        { name: { en: 'Vision & Strategic Planning', fr: 'Vision et Planification' }, qCount: 4 },
        { name: { en: 'Team & Volunteer Management', fr: "Gestion d'équipe et bénévoles" }, qCount: 4 },
        { name: { en: 'Financial Stewardship', fr: 'Intendance financière' }, qCount: 4 },
        { name: { en: 'Governance & Administration', fr: 'Gouvernance et Administration' }, qCount: 4 },
      ]},
      { name: { en: 'Sustainability & Multiplication', fr: 'Durabilité et Multiplication' }, sub: { en: 'Ministry that outlives you', fr: 'Un ministère qui vous survivra' }, dims: [
        { name: { en: 'Succession Planning', fr: 'Planification de succession' }, qCount: 4 },
        { name: { en: 'Leader Development', fr: 'Développement de leaders' }, qCount: 4 },
        { name: { en: 'Family & Ministry Balance', fr: 'Équilibre Famille et Ministère' }, qCount: 4 },
        { name: { en: 'Legacy & Kingdom Impact', fr: 'Héritage et Impact du Royaume' }, qCount: 4 },
      ]},
    ],
  },
  marriage: {
    name: { en: 'Marriage Coaching', fr: 'Coaching Conjugal' },
    pillars: [
      { name: { en: 'Personal Foundation', fr: 'Fondation Personnelle' }, sub: { en: 'Me Before We', fr: 'Moi avant Nous' }, dims: [
        { name: { en: 'Self-Awareness', fr: 'Conscience de soi' }, qCount: 4 },
        { name: { en: 'Emotional Intelligence', fr: 'Intelligence émotionnelle' }, qCount: 4 },
        { name: { en: 'Personal Responsibility', fr: 'Responsabilité personnelle' }, qCount: 4 },
        { name: { en: 'Spiritual & Value Alignment', fr: 'Alignement spirituel et valeurs' }, qCount: 4 },
      ]},
      { name: { en: 'Communication & Connection', fr: 'Communication et Connexion' }, sub: { en: 'How We Talk', fr: 'Comment nous communiquons' }, dims: [
        { name: { en: 'Listening & Empathy', fr: 'Écoute et Empathie' }, qCount: 4 },
        { name: { en: 'Conflict Resolution', fr: 'Résolution de conflits' }, qCount: 5 },
        { name: { en: 'Emotional Intimacy', fr: 'Intimité émotionnelle' }, qCount: 4 },
        { name: { en: 'Appreciation & Affirmation', fr: 'Appréciation et Affirmation' }, qCount: 4 },
      ]},
      { name: { en: 'Partnership & Roles', fr: 'Partenariat et Rôles' }, sub: { en: 'How We Function', fr: 'Comment nous fonctionnons' }, dims: [
        { name: { en: 'Decision-Making Together', fr: 'Prise de décision ensemble' }, qCount: 4 },
        { name: { en: 'Financial Partnership', fr: 'Partenariat financier' }, qCount: 4 },
        { name: { en: 'Household & Parenting', fr: 'Ménage et Parentalité' }, qCount: 4 },
        { name: { en: 'Extended Family Boundaries', fr: 'Limites avec la famille élargie' }, qCount: 4 },
      ]},
      { name: { en: 'Intimacy & Sexuality', fr: 'Intimité et Sexualité' }, sub: { en: 'The Private Bond', fr: 'Le lien privé' }, dims: [
        { name: { en: 'Physical Intimacy', fr: 'Intimité physique' }, qCount: 4 },
        { name: { en: 'Sexual Communication', fr: 'Communication sexuelle' }, qCount: 4 },
        { name: { en: 'Romance & Intentionality', fr: 'Romance et Intentionnalité' }, qCount: 4 },
        { name: { en: 'Trust & Fidelity', fr: 'Confiance et Fidélité' }, qCount: 4 },
      ]},
      { name: { en: 'Growth & Legacy', fr: 'Croissance et Héritage' }, sub: { en: 'Where We\'re Going', fr: 'Où nous allons' }, dims: [
        { name: { en: 'Shared Vision & Goals', fr: 'Vision et Objectifs partagés' }, qCount: 4 },
        { name: { en: 'Crisis Resilience', fr: 'Résilience face aux crises' }, qCount: 4 },
        { name: { en: 'Spiritual Partnership', fr: 'Partenariat spirituel' }, qCount: 4 },
        { name: { en: 'Legacy & Impact', fr: 'Héritage et Impact' }, qCount: 4 },
      ]},
    ],
  },
  entrepreneur: {
    name: { en: 'Entrepreneur Coaching', fr: 'Coaching Entrepreneurial' },
    pillars: [
      { name: { en: 'Entrepreneurial Identity', fr: 'Identité Entrepreneuriale' }, sub: { en: 'The Founder', fr: 'Le Fondateur' }, dims: [
        { name: { en: 'Entrepreneurial Mindset', fr: "État d'esprit entrepreneurial" }, qCount: 4 },
        { name: { en: 'Self-Leadership & Discipline', fr: 'Auto-leadership et Discipline' }, qCount: 5 },
        { name: { en: 'Purpose & Calling', fr: 'But et Appel' }, qCount: 4 },
        { name: { en: 'Resilience & Mental Health', fr: 'Résilience et Santé mentale' }, qCount: 4 },
      ]},
      { name: { en: 'Business Foundations', fr: 'Fondations Business' }, sub: { en: 'The Model', fr: 'Le Modèle' }, dims: [
        { name: { en: 'Offer Clarity', fr: "Clarté de l'offre" }, qCount: 4 },
        { name: { en: 'Revenue Model & Pricing', fr: 'Modèle de revenus et Tarification' }, qCount: 5 },
        { name: { en: 'Market Positioning', fr: 'Positionnement marché' }, qCount: 4 },
        { name: { en: 'Legal & Compliance', fr: 'Juridique et Conformité' }, qCount: 4 },
      ]},
      { name: { en: 'Execution & Operations', fr: 'Exécution et Opérations' }, sub: { en: 'The Machine', fr: 'La Machine' }, dims: [
        { name: { en: 'Systems & Processes', fr: 'Systèmes et Processus' }, qCount: 4 },
        { name: { en: 'Product/Service Delivery', fr: 'Livraison de produit/service' }, qCount: 4 },
        { name: { en: 'Financial Management', fr: 'Gestion financière' }, qCount: 5 },
        { name: { en: 'Technology & Tools', fr: 'Technologie et Outils' }, qCount: 4 },
      ]},
      { name: { en: 'Growth & Sales', fr: 'Croissance et Ventes' }, sub: { en: 'The Engine', fr: 'Le Moteur' }, dims: [
        { name: { en: 'Sales Strategy & Pipeline', fr: 'Stratégie de vente' }, qCount: 5 },
        { name: { en: 'Marketing & Brand', fr: 'Marketing et Marque' }, qCount: 4 },
        { name: { en: 'Customer Retention', fr: 'Fidélisation client' }, qCount: 4 },
        { name: { en: 'Partnerships & Networking', fr: 'Partenariats et Réseautage' }, qCount: 4 },
        { name: { en: 'Scaling & Expansion', fr: 'Mise à échelle et Expansion' }, qCount: 4 },
      ]},
      { name: { en: 'Stewardship & Impact', fr: 'Intendance et Impact' }, sub: { en: 'The Legacy', fr: "L'Héritage" }, dims: [
        { name: { en: 'Financial Stewardship', fr: 'Intendance financière' }, qCount: 4 },
        { name: { en: 'Team & Culture Building', fr: "Culture d'équipe" }, qCount: 4 },
        { name: { en: 'Social Impact', fr: 'Impact social' }, qCount: 4 },
        { name: { en: 'Succession & Exit Strategy', fr: 'Succession et Stratégie de sortie' }, qCount: 4 },
      ]},
    ],
  },
  personal: {
    name: { en: 'Personal Development', fr: 'Développement Personnel' },
    pillars: [
      { name: { en: 'Self-Discovery', fr: 'Découverte de soi' }, sub: { en: 'Who Am I?', fr: 'Qui suis-je ?' }, dims: [
        { name: { en: 'Identity & Self-Worth', fr: 'Identité et Valeur personnelle' }, qCount: 4 },
        { name: { en: 'Personality & Strengths', fr: 'Personnalité et Forces' }, qCount: 4 },
        { name: { en: 'Values & Beliefs', fr: 'Valeurs et Croyances' }, qCount: 4 },
        { name: { en: 'Purpose & Calling', fr: 'But et Appel' }, qCount: 5 },
      ]},
      { name: { en: 'Inner Healing', fr: 'Guérison Intérieure' }, sub: { en: 'Becoming Whole', fr: 'Devenir entier' }, dims: [
        { name: { en: 'Identifying Past Wounds', fr: 'Identifier les blessures passées' }, qCount: 4 },
        { name: { en: 'Forgiveness & Release', fr: 'Pardon et Libération' }, qCount: 4 },
        { name: { en: 'Overcoming Shame & Rejection', fr: 'Surmonter la honte et le rejet' }, qCount: 4 },
        { name: { en: 'Breaking Unhealthy Patterns', fr: 'Briser les schémas malsains' }, qCount: 4 },
        { name: { en: 'Restoration & Wholeness', fr: 'Restauration et Plénitude' }, qCount: 4 },
      ]},
      { name: { en: 'Whole-Person Health', fr: 'Santé Globale' }, sub: { en: 'Spirit, Soul & Body', fr: 'Esprit, Âme et Corps' }, dims: [
        { name: { en: 'Spiritual Life', fr: 'Vie spirituelle' }, qCount: 4 },
        { name: { en: 'Emotional Health', fr: 'Santé émotionnelle' }, qCount: 4 },
        { name: { en: 'Mental Wellness', fr: 'Bien-être mental' }, qCount: 4 },
        { name: { en: 'Physical Health', fr: 'Santé physique' }, qCount: 4 },
      ]},
      { name: { en: 'Relational Intelligence', fr: 'Intelligence Relationnelle' }, sub: { en: 'How Do I Connect?', fr: 'Comment je me connecte ?' }, dims: [
        { name: { en: 'Communication Skills', fr: 'Compétences de communication' }, qCount: 4 },
        { name: { en: 'Conflict Management', fr: 'Gestion de conflits' }, qCount: 4 },
        { name: { en: 'Boundaries', fr: 'Limites' }, qCount: 4 },
        { name: { en: 'Community & Belonging', fr: 'Communauté et Appartenance' }, qCount: 4 },
      ]},
      { name: { en: 'Purpose & Productivity', fr: 'But et Productivité' }, sub: { en: 'Am I Moving Forward?', fr: 'Est-ce que j\'avance ?' }, dims: [
        { name: { en: 'Goal Setting & Planning', fr: "Définition d'objectifs" }, qCount: 4 },
        { name: { en: 'Time Management & Discipline', fr: 'Gestion du temps et Discipline' }, qCount: 4 },
        { name: { en: 'Financial Literacy', fr: 'Littératie financière' }, qCount: 4 },
        { name: { en: 'Career & Vocation Clarity', fr: 'Clarté professionnelle' }, qCount: 4 },
        { name: { en: 'Leadership Readiness & Legacy', fr: 'Préparation au leadership et Héritage' }, qCount: 4 },
        { name: { en: 'Learning & Skill Development', fr: 'Apprentissage et Compétences' }, qCount: 4 },
      ]},
    ],
  },
};

const ui = {
  en: { trackLabel: 'COACHING TRACK', blueprint: 'Blueprint', overallLabel: 'Overall Progress', pillars: 'pillars', yourJourney: 'YOUR JOURNEY', masterTitle: 'Master the 5 Pillars', startAssessment: 'Start Assessment', notStarted: 'Not started', recommended: 'Recommended starting point', questions: 'questions', minutes: 'minutes', langLabel: 'FR', back: '← Back to tracks' },
  fr: { trackLabel: 'PARCOURS DE COACHING', blueprint: 'Plan directeur', overallLabel: 'Progression globale', pillars: 'piliers', yourJourney: 'VOTRE PARCOURS', masterTitle: 'Maîtrisez les 5 Piliers', startAssessment: "Commencer l'évaluation", notStarted: 'Non commencé', recommended: 'Point de départ recommandé', questions: 'questions', minutes: 'minutes', langLabel: 'EN', back: '← Retour aux parcours' },
};

function PillarOverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackSlug = searchParams.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [openPillar, setOpenPillar] = useState(0);
  const [scoredPillars, setScoredPillars] = useState<Set<number>>(new Set());
  const [pillarScoreMap, setPillarScoreMap] = useState<Record<number, number>>({});
  const t = ui[lang];
  const track = trackData[trackSlug];

  // Load completion status from Supabase
  useEffect(() => {
    if (!user || !track) return;
    async function load() {
      const { data: trk } = await supabase
        .from('tracks').select('id').eq('slug', trackSlug).single();
      if (!trk) return;

      const { data: journey } = await supabase
        .from('journeys').select('id')
        .eq('user_id', user!.id).eq('track_id', trk.id).single();
      if (!journey) return;

      const { data: pillars } = await supabase
        .from('pillars').select('id, sort_order')
        .eq('track_id', trk.id).order('sort_order');
      if (!pillars) return;

      const { data: scores } = await supabase
        .from('pillar_scores').select('pillar_id, score')
        .eq('journey_id', journey.id);

      const done = new Set<number>();
      const scoreMap: Record<number, number> = {};
      pillars.forEach(p => {
        const sc = scores?.find(s => s.pillar_id === p.id);
        if (sc) {
          done.add(p.sort_order - 1); // 0-indexed
          scoreMap[p.sort_order - 1] = Number(sc.score);
        }
      });
      setScoredPillars(done);
      setPillarScoreMap(scoreMap);

      // All pillars scored — send to plan generation only if no plan exists yet
      if (done.size === track.pillars.length) {
        const { data: existingPlan } = await supabase
          .from('coaching_plans').select('id').eq('journey_id', journey.id).maybeSingle();
        if (!existingPlan) {
          router.replace(`/plan-generation?track=${trackSlug}`);
          return;
        }
      }

      // Auto-open first incomplete pillar
      const firstIncomplete = track.pillars.findIndex((_, i) => !done.has(i));
      if (firstIncomplete >= 0) setOpenPillar(firstIncomplete);
    }
    load();
  }, [user?.id, trackSlug]);

  if (!track) {
    return <div className="min-h-screen flex items-center justify-center">Track not found</div>;
  }

  const totalDims = track.pillars.reduce((a, p) => a + p.dims.length, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 max-md:px-5 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link href="/" className="no-underline inline-block">
            <Logo size="sm" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md bg-transparent border-[1.5px] border-gray-200 cursor-pointer text-[11px] font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all" style={{ fontFamily: 'inherit' }}>🌐 {t.langLabel}</button>
          <UserMenu />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gray-900 relative overflow-hidden px-8 max-md:px-5 py-12 text-center">
        <div className="absolute -top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.08), transparent 65%)', filter: 'blur(80px)' }} />
        <div className="relative z-[2] max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-2 px-[18px] py-[7px] rounded-full border border-white/10 mb-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#F9250E]" style={{ boxShadow: '0 0 8px rgba(249,37,14,0.5)' }} />
            <span className="text-[10.5px] font-semibold text-white/50 uppercase tracking-[1.5px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{track.name[lang]} — {t.trackLabel}</span>
          </div>
          <h1 className="text-[clamp(28px,4vw,40px)] font-extrabold text-white leading-[1.2] tracking-tight mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {track.name[lang]} <em className="not-italic text-[#F9250E]">{t.blueprint}</em>
          </h1>
          <p className="text-[15px] text-[#9CA3AF] leading-[1.65] max-w-[540px] mx-auto">
            5 {t.pillars}. {totalDims} dimensions. {lang === 'en' ? 'Complete each pillar to unlock your Master Profile.' : 'Complétez chaque pilier pour débloquer votre Profil Maître.'}
          </p>
          <div className="mt-8 max-w-[400px] mx-auto">
            <div className="flex justify-between text-[12px] text-gray-400 font-medium mb-2">
              <span>{t.overallLabel}</span><span>{Math.round((scoredPillars.size / 5) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#F9250E] transition-all duration-700" style={{ width: `${(scoredPillars.size / 5) * 100}%` }} />
            </div>
            <div className="text-center mt-3 text-[13px] text-gray-400"><strong className="text-white">{scoredPillars.size}/5</strong> {t.pillars}</div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="max-w-[820px] mx-auto px-6 py-12 pb-20">
        <div className="text-center mb-2">
          <div className="text-[10.5px] font-bold text-[#F9250E] uppercase tracking-[2px] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.yourJourney}</div>
          <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.masterTitle}</h2>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          {track.pillars.map((pillar, pi) => {
            const isOpen = openPillar === pi;
            const color = pillarColors[pi];
            const totalQ = pillar.dims.reduce((a, d) => a + d.qCount, 0);
            const estMin = Math.round(totalQ * 0.4);
            const isDone = scoredPillars.has(pi);
            const pScore = pillarScoreMap[pi];
            const pct = isDone ? 100 : 0;

            return (
              <div key={pi} className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-sm ${isDone ? 'border-green-200' : 'border-gray-200'}`}>
                {/* Header */}
                <div onClick={() => setOpenPillar(isOpen ? -1 : pi)} className="flex items-center gap-4 px-6 py-5 cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[15px] font-bold shrink-0 ${isDone ? 'bg-green-100 text-green-600 border border-green-200' : ''}`} style={isDone ? {} : { background: `${color}11`, color, border: `1px solid ${color}22` }}>
                    {isDone ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg> : pi + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pillar.name[lang]}</h3>
                    <p className="text-[13px] text-gray-500 mt-0.5">{pillar.sub[lang]}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative w-11 h-11">
                      <svg width="44" height="44" className="-rotate-90">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke={isDone ? '#059669' : color} strokeWidth="3" strokeDasharray="113.1" strokeDashoffset={113.1 - (113.1 * pct / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: isDone ? '#059669' : '#9CA3AF' }}>{isDone ? pScore?.toFixed(1) : '0%'}</span>
                    </div>
                    <span className={`text-[11px] font-semibold max-md:hidden ${isDone ? 'text-green-600' : 'text-gray-400'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {isDone ? (lang === 'en' ? 'Complete' : 'Termin\u00e9') : t.notStarted}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Body */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    {pi === 0 && (
                      <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg" style={{ background: 'rgba(249,37,14,0.04)', border: '1px solid rgba(249,37,14,0.1)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#F9250E" strokeWidth="2" className="w-4 h-4 shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        <span className="text-[12px] font-semibold text-[#F9250E]">{t.recommended}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2.5">
                      {pillar.dims.map((dim, di) => (
                        <div key={di} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/70 border border-gray-100">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}11` }}>
                            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[13.5px] font-semibold text-gray-800">{dim.name[lang]}</h4>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium shrink-0">{dim.qCount} {t.questions}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() => router.push(`/intake?track=${trackSlug}&pillar=${pi + 1}`)}
                        className={`px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white transition-all hover:-translate-y-px ${isDone ? 'opacity-80' : ''}`}
                        style={{ background: isDone ? '#059669' : color, boxShadow: `0 4px 16px ${isDone ? '#05966940' : `${color}40`}`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {isDone
                          ? (lang === 'en' ? 'Review Answers \u2192' : 'Revoir les r\u00e9ponses \u2192')
                          : `${t.startAssessment} \u2192`}
                      </button>
                      <span className="text-[12px] text-gray-400 flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        ~{estMin} {t.minutes}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/track-selection" className="text-[14px] text-gray-500 hover:text-[#F9250E] transition-colors no-underline">{t.back}</Link>
        </div>
      </div>
    </div>
  );
}

export default function PillarOverviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PillarOverviewContent />
    </Suspense>
  );
}
