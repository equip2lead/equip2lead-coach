'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { switchLanguage } from '@/lib/language';

const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];
const difficultyLabels: Record<string, { en: string; fr: string; color: string }> = {
  beginner: { en: 'Beginner', fr: 'D\u00e9butant', color: '#059669' },
  intermediate: { en: 'Intermediate', fr: 'Interm\u00e9diaire', color: '#D97706' },
  advanced: { en: 'Advanced', fr: 'Avanc\u00e9', color: '#DC2626' },
};

const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>;
const BookIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;

type Pillar = { id: string; name_en: string; name_fr: string; sort_order: number; slug: string };
type Lesson = {
  document_id: string;
  title: string;
  sub_domain: string;
  pillar_id: string;
  lesson_order: number;
  is_recommended: boolean;
  pillar_score: number | null;
  status: 'started' | 'completed' | 'skipped' | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};
type PillarScore = { pillar_id: string; score: number };

function bucketToDifficulty(order: number): 'beginner' | 'intermediate' | 'advanced' {
  if (order < 200) return 'beginner';
  if (order < 300) return 'intermediate';
  return 'advanced';
}

function getPillarContext(score: number | null, lang: string): { text: string; color: string } | null {
  if (score === null) return null;
  if (score < 3.0) return {
    text: lang === 'fr' ? 'Zone prioritaire \u2014 votre \u00e9valuation indique un besoin ici' : 'Priority area \u2014 your assessment shows this needs attention',
    color: '#DC2626',
  };
  if (score < 4.0) return {
    text: lang === 'fr' ? 'Zone de croissance \u2014 continuez \u00e0 d\u00e9velopper cette comp\u00e9tence' : 'Growth area \u2014 continue developing this skill',
    color: '#D97706',
  };
  return {
    text: lang === 'fr' ? 'Point fort \u2014 construisez sur cette base' : 'Strength \u2014 build on this foundation',
    color: '#059669',
  };
}

export default function MyTrackPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [trackName, setTrackName] = useState('');
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [pillarScores, setPillarScores] = useState<PillarScore[]>([]);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [diffFilter, setDiffFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      setLoadError(null);

      const { data: journey, error: journeyErr } = await supabase.from('journeys')
        .select('id, track_id, tracks(slug, name_en, name_fr)')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false }).limit(1).maybeSingle();
      if (journeyErr) console.error('[my-track] journey query error:', journeyErr);
      if (!journey) {
        setLoadError('no_journey');
        setLoading(false);
        return;
      }

      setJourneyId(journey.id);
      const track = journey.tracks as any;
      setTrackName(lang === 'fr' ? (track?.name_fr || track?.name_en) : (track?.name_en || ''));

      const [pillarsRes, lessonsRes, scoresRes, progressRes] = await Promise.all([
        supabase.from('pillars')
          .select('id, name_en, name_fr, sort_order, slug')
          .eq('track_id', journey.track_id)
          .order('sort_order'),
        supabase.rpc('get_personalized_lessons', { p_journey_id: journey.id }),
        supabase.from('pillar_scores')
          .select('pillar_id, score')
          .eq('journey_id', journey.id),
        supabase.from('lesson_progress')
          .select('document_id, status')
          .eq('journey_id', journey.id),
      ]);

      if (lessonsRes.error) console.error('[my-track] get_personalized_lessons error:', lessonsRes.error);
      if (!lessonsRes.data?.length) console.log('[my-track] RPC returned 0 lessons for journey', journey.id, 'sample response:', lessonsRes.data);

      const progressMap = new Map<string, 'started' | 'completed' | 'skipped'>();
      (progressRes.data || []).forEach((p: any) => {
        if (p.status) progressMap.set(p.document_id, p.status);
      });

      const normalized: Lesson[] = (lessonsRes.data || []).map((row: any) => ({
        document_id: row.document_id,
        title: row.title,
        sub_domain: row.sub_domain,
        pillar_id: row.pillar_id,
        lesson_order: Number(row.lesson_order ?? 100),
        is_recommended: !!row.is_recommended,
        pillar_score: row.pillar_score !== null && row.pillar_score !== undefined ? Number(row.pillar_score) : null,
        status:
          progressMap.get(row.document_id) ??
          (row.is_completed ? 'completed' : row.is_started ? 'started' : null),
        difficulty: bucketToDifficulty(Number(row.lesson_order ?? 100)),
      }));

      setPillars(pillarsRes.data || []);
      setLessons(normalized);
      setPillarScores((scoresRes.data || []).map((s: any) => ({ pillar_id: s.pillar_id, score: Number(s.score) })));
      if (pillarsRes.data?.length) setExpandedPillar(pillarsRes.data[0].id);
      setLoading(false);
    }
    load();
  }, [user?.id, lang]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#F9250E] rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError === 'no_journey') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-6 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div>
          <p className="text-[16px] text-gray-700 font-semibold mb-2">
            {lang === 'en' ? 'No active journey' : 'Aucun parcours actif'}
          </p>
          <p className="text-[13.5px] text-gray-500 mb-5">
            {lang === 'en' ? 'Complete onboarding to start a coaching track.' : 'Terminez l’intégration pour démarrer un parcours.'}
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#F9250E] border-none cursor-pointer"
            style={{ fontFamily: 'inherit' }}
          >
            {lang === 'en' ? 'Go to onboarding' : 'Aller à l’intégration'}
          </button>
        </div>
      </div>
    );
  }

  const hasAnyCompleted = lessons.some(l => l.status === 'completed');
  const filteredLessons = diffFilter === 'all' ? lessons : lessons.filter(l => l.difficulty === diffFilter);

  const filterButtons: { key: string; en: string; fr: string }[] = [
    { key: 'all', en: 'All', fr: 'Tous' },
    { key: 'beginner', en: 'Beginner', fr: 'D\u00e9butant' },
    { key: 'intermediate', en: 'Intermediate', fr: 'Interm\u00e9diaire' },
    { key: 'advanced', en: 'Advanced', fr: 'Avanc\u00e9' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 max-md:px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
            <BackIcon />
            {lang === 'en' ? 'Dashboard' : 'Tableau de bord'}
          </button>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <BookIcon />
            <div>
              <h1 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {lang === 'en' ? 'My Track' : 'Mon Parcours'}
              </h1>
              <p className="text-[11px] text-gray-400">{trackName}</p>
            </div>
          </div>
        </div>
        <button onClick={() => switchLanguage(lang === 'en' ? 'fr' : 'en', user!.id, supabase, setLang)} className="px-2.5 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>
          &#x1F310; {lang === 'en' ? 'FR' : 'EN'}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 max-md:px-4 py-8">
        {/* Difficulty filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map(fb => (
              <button
                key={fb.key}
                onClick={() => setDiffFilter(fb.key)}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer border transition-all ${diffFilter === fb.key ? 'bg-[#F9250E] text-white border-[#F9250E]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'fr' ? fb.fr : fb.en}
              </button>
            ))}
          </div>
          {!hasAnyCompleted && (
            <p className="text-[12px] text-gray-400 mt-2 italic">
              {lang === 'en' ? 'New here? Start with Beginner lessons' : 'Nouveau ? Commencez par les le\u00e7ons d\u00e9butant'}
            </p>
          )}
        </div>

        {pillars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[15px] text-gray-400">{lang === 'en' ? 'No content available yet.' : 'Pas encore de contenu disponible.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pillars.map((pillar, pi) => {
              const color = pillarColors[pi % pillarColors.length];
              const pillarLessons = filteredLessons.filter(l => l.pillar_id === pillar.id);
              const allPillarLessons = lessons.filter(l => l.pillar_id === pillar.id);
              const completedCount = allPillarLessons.filter(l => l.status === 'completed').length;
              const totalCount = allPillarLessons.length;
              const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              const isExpanded = expandedPillar === pillar.id;
              const ps = pillarScores.find(s => s.pillar_id === pillar.id);
              const ctx = getPillarContext(ps?.score ?? null, lang);

              return (
                <div key={pillar.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Pillar header */}
                  <button
                    onClick={() => setExpandedPillar(isExpanded ? null : pillar.id)}
                    className="w-full flex items-center gap-4 p-5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-gray-50"
                    style={{ fontFamily: 'inherit' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-bold shrink-0" style={{ background: `${color}12`, color }}>
                      {pillar.sort_order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-gray-900 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {lang === 'fr' ? pillar.name_fr : pillar.name_en}
                        {ps && <span className="ml-2 text-[12px] font-bold" style={{ color }}>{ps.score.toFixed(1)}/5</span>}
                      </h3>
                      {ctx && (
                        <p className="text-[11px] font-medium mt-0.5" style={{ color: ctx.color }}>
                          {ctx.text}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden max-w-[200px]">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="text-[12px] font-semibold text-gray-400 shrink-0">
                          {completedCount}/{totalCount} {lang === 'en' ? 'lessons' : 'le\u00e7ons'}
                        </span>
                      </div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Lesson list */}
                  {isExpanded && pillarLessons.length > 0 && (
                    <div className="border-t border-gray-100 px-5 pb-4">
                      {pillarLessons.map((lesson) => {
                        const isComplete = lesson.status === 'completed';
                        const isStarted = lesson.status === 'started';
                        const diff = difficultyLabels[lesson.difficulty] || difficultyLabels.beginner;
                        return (
                          <Link
                            key={lesson.document_id}
                            href={`/my-track/lesson/${lesson.document_id}`}
                            className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-b-0 no-underline group"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isComplete ? 'bg-green-100 text-green-600' : isStarted ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-300'}`}>
                              {isComplete ? <CheckIcon /> : <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-medium text-gray-800 truncate group-hover:text-[#F9250E] transition-colors">
                                  {lesson.title}
                                </p>
                                {lesson.is_recommended && !isComplete && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-[#F9250E]/10 text-[9px] font-bold uppercase tracking-wider text-[#F9250E] shrink-0">
                                    {lang === 'fr' ? 'Recommand\u00e9' : 'Recommended'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5">{lesson.sub_domain}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: diff.color, background: `${diff.color}10` }}>
                              {lang === 'fr' ? diff.fr : diff.en}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  {isExpanded && pillarLessons.length === 0 && (
                    <div className="border-t border-gray-100 px-5 py-6 text-center">
                      <p className="text-[13px] text-gray-400">
                        {diffFilter !== 'all'
                          ? (lang === 'en' ? `No ${diffFilter} lessons in this pillar.` : `Pas de le\u00e7ons ${diffFilter} dans ce pilier.`)
                          : (lang === 'en' ? 'No lessons available for this pillar yet.' : 'Pas encore de le\u00e7ons pour ce pilier.')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
