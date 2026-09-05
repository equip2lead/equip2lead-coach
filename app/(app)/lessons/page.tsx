'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { switchLanguage } from '@/lib/language';

const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];
const difficultyLabels: Record<string, { en: string; fr: string; color: string }> = {
  beginner: { en: 'Foundation', fr: 'Fondation', color: '#059669' },
  intermediate: { en: 'Application', fr: 'Application', color: '#D97706' },
  advanced: { en: 'Mastery', fr: 'Maîtrise', color: '#F9250E' },
};

const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>;
const BookIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;

type LessonRow = {
  document_id: string;
  title: string;
  content: string;
  pillar_id: string;
  pillar_name_en: string;
  pillar_name_fr: string;
  pillar_sort_order: number;
  sub_domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  source: string | null;
  author: string | null;
  is_completed: boolean;
  is_started: boolean;
  is_recommended: boolean;
  pillar_score: string;
  lesson_order: number;
};

type PillarGroup = {
  pillar_id: string;
  name_en: string;
  name_fr: string;
  sort_order: number;
  score: number;
  lessons: (LessonRow & { status: 'started' | 'completed' | 'skipped' | null })[];
};

function getPillarContext(score: number, lang: 'en' | 'fr'): { text: string; color: string } | null {
  if (!score) return null;
  if (score < 3.0) return {
    text: lang === 'fr' ? 'Zone prioritaire — votre évaluation indique un besoin ici' : 'Priority area — your assessment shows this needs attention',
    color: '#DC2626',
  };
  if (score < 4.0) return {
    text: lang === 'fr' ? 'Zone de croissance — continuez à développer cette compétence' : 'Growth area — continue developing this skill',
    color: '#D97706',
  };
  return {
    text: lang === 'fr' ? 'Point fort — construisez sur cette base' : 'Strength — build on this foundation',
    color: '#059669',
  };
}

export default function LessonsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackName, setTrackName] = useState('');
  const [pillarGroups, setPillarGroups] = useState<PillarGroup[]>([]);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    (async () => {
      try {
        console.log('[lessons] STEP 1 mounting, user.id:', user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('preferred_language')
          .eq('id', user.id)
          .single();
        const userLang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';
        setLang(userLang);
        console.log('[lessons] STEP 2 language:', userLang);

        const { data: allJourneys } = await supabase
          .from('journeys')
          .select('id, track_id, status, started_at')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });
        console.log('[lessons] STEP 3 ALL journeys for user:', allJourneys);

        const { data: journey, error: journeyErr } = await supabase
          .from('journeys')
          .select('id, track_id, status, tracks(slug, name_en, name_fr)')
          .eq('user_id', user.id)
          .in('status', ['active', 'paused'])
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        console.log('[lessons] STEP 4 journey selected:', journey, 'error:', journeyErr);

        if (journeyErr) throw journeyErr;
        if (!journey) {
          console.warn('[lessons] no in-progress journey — redirecting to /my-track');
          router.replace('/my-track');
          return;
        }

        const track = (journey as any).tracks;
        setTrackName(userLang === 'fr' ? track?.name_fr || track?.name_en || '' : track?.name_en || '');

        console.log('[lessons] STEP 5 calling get_personalized_lessons with p_journey_id:', journey.id);

        const [rpcRes, progressRes] = await Promise.all([
          supabase.rpc('get_personalized_lessons', { p_journey_id: journey.id }),
          supabase.from('lesson_progress').select('document_id, status').eq('journey_id', journey.id),
        ]);

        console.log('[lessons] STEP 6 RPC error:', rpcRes.error);
        console.log('[lessons] STEP 7 RPC lessons count:', rpcRes.data?.length);
        console.log('[lessons] STEP 8 RPC first 2 lessons:', rpcRes.data?.slice(0, 2));
        console.log('[lessons] STEP 9 unique pillar_ids in RPC:', Array.from(new Set((rpcRes.data || []).map((l: any) => l.pillar_id))));

        if (rpcRes.error) throw rpcRes.error;

        const progressMap = new Map<string, 'started' | 'completed' | 'skipped'>();
        (progressRes.data || []).forEach((p: any) => {
          if (p.status) progressMap.set(p.document_id, p.status);
        });

        const lessons: LessonRow[] = rpcRes.data || [];
        const groupMap = new Map<string, PillarGroup>();
        for (const l of lessons) {
          if (!groupMap.has(l.pillar_id)) {
            groupMap.set(l.pillar_id, {
              pillar_id: l.pillar_id,
              name_en: l.pillar_name_en,
              name_fr: l.pillar_name_fr,
              sort_order: Number(l.pillar_sort_order) || 0,
              score: parseFloat(l.pillar_score) || 0,
              lessons: [],
            });
          }
          groupMap.get(l.pillar_id)!.lessons.push({
            ...l,
            status:
              progressMap.get(l.document_id) ??
              (l.is_completed ? 'completed' : l.is_started ? 'started' : null),
          });
        }

        const grouped = Array.from(groupMap.values())
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((g) => ({
            ...g,
            lessons: g.lessons.sort(
              (a, b) => (Number(a.lesson_order) || 0) - (Number(b.lesson_order) || 0)
            ),
          }));

        console.log('[lessons] STEP 10 grouped pillars:', grouped.map((g) => ({ name: g.name_en, count: g.lessons.length })));

        setPillarGroups(grouped);
        if (grouped.length) setExpandedPillar(grouped[0].pillar_id);
        setLoading(false);
      } catch (err) {
        console.error('[lessons] fatal error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lessons');
        setLoading(false);
      }
    })();
  }, [authLoading, user?.id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#F9250E] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-6 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div>
          <p className="text-[16px] text-red-600 font-semibold mb-3">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[13px] font-semibold text-[#F9250E] bg-transparent border-none cursor-pointer underline"
            style={{ fontFamily: 'inherit' }}
          >
            {lang === 'fr' ? 'Retour au tableau de bord' : 'Back to dashboard'}
          </button>
        </div>
      </div>
    );
  }

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
                {lang === 'en' ? 'Lessons' : 'Leçons'}
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
        {pillarGroups.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[15px] text-gray-400">
              {lang === 'en' ? 'No lessons available yet for your track.' : 'Pas encore de leçons disponibles pour votre parcours.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pillarGroups.map((g, pi) => {
              const color = pillarColors[pi % pillarColors.length];
              const completedCount = g.lessons.filter((l) => l.status === 'completed' || l.status === 'skipped').length;
              const totalCount = g.lessons.length;
              const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              const isExpanded = expandedPillar === g.pillar_id;
              const ctx = getPillarContext(g.score, lang);

              return (
                <div key={g.pillar_id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedPillar(isExpanded ? null : g.pillar_id)}
                    className="w-full flex items-center gap-4 p-5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-gray-50"
                    style={{ fontFamily: 'inherit' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-bold shrink-0" style={{ background: `${color}12`, color }}>
                      {g.sort_order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-gray-900 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {lang === 'fr' ? g.name_fr : g.name_en}
                        {g.score > 0 && <span className="ml-2 text-[12px] font-bold" style={{ color }}>{g.score.toFixed(1)}/5</span>}
                      </h3>
                      {ctx && (
                        <p className="text-[11px] font-medium mt-0.5" style={{ color: ctx.color }}>{ctx.text}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden max-w-[200px]">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="text-[12px] font-semibold text-gray-400 shrink-0">
                          {completedCount}/{totalCount} {lang === 'en' ? 'lessons' : 'leçons'}
                        </span>
                      </div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {isExpanded && g.lessons.length > 0 && (
                    <div className="border-t border-gray-100 px-5 pb-4">
                      {g.lessons.map((lesson) => {
                        const isComplete = lesson.status === 'completed';
                        const isStarted = lesson.status === 'started';
                        const isSkipped = lesson.status === 'skipped';
                        const diff = difficultyLabels[lesson.difficulty] || difficultyLabels.beginner;
                        return (
                          <Link
                            key={lesson.document_id}
                            href={`/lessons/${lesson.document_id}`}
                            className={`flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-b-0 no-underline group ${isSkipped ? 'opacity-50' : ''}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isComplete ? 'bg-green-100 text-green-600' : isSkipped ? 'bg-gray-100 text-gray-400' : isStarted ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-300'}`}>
                              {isComplete ? <CheckIcon /> : isSkipped ? <span className="text-[11px]">&mdash;</span> : <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-[14px] font-medium truncate transition-colors ${isSkipped ? 'text-gray-500 line-through' : 'text-gray-800 group-hover:text-[#F9250E]'}`}>
                                  {lesson.title}
                                </p>
                                {isSkipped && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[9px] font-bold uppercase tracking-wider text-gray-500 shrink-0">
                                    {lang === 'fr' ? 'Connu' : 'Known'}
                                  </span>
                                )}
                                {lesson.is_recommended && !isComplete && !isSkipped && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-[#F9250E]/10 text-[9px] font-bold uppercase tracking-wider text-[#F9250E] shrink-0">
                                    {lang === 'fr' ? 'Recommandé' : 'Recommended'}
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
