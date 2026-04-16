'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

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
type Lesson = { id: string; title: string; sub_domain: string; difficulty: string; pillar_id: string; sort_order: number };
type Progress = { document_id: string; status: string };

export default function MyTrackPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(true);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [trackName, setTrackName] = useState('');
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);

      const { data: journey } = await supabase.from('journeys')
        .select('id, track_id, tracks(slug, name_en, name_fr)')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false }).limit(1).single();
      if (!journey) { setLoading(false); return; }

      setJourneyId(journey.id);
      const track = journey.tracks as any;
      setTrackName(lang === 'fr' ? (track?.name_fr || track?.name_en) : (track?.name_en || ''));

      const [pillarsRes, lessonsRes, progressRes] = await Promise.all([
        supabase.from('pillars')
          .select('id, name_en, name_fr, sort_order, slug')
          .eq('track_id', journey.track_id)
          .order('sort_order'),
        supabase.from('knowledge_documents')
          .select('id, title, sub_domain, difficulty, pillar_id, sort_order')
          .eq('track_id', journey.track_id)
          .eq('language', lang)
          .order('sort_order'),
        supabase.from('lesson_progress')
          .select('document_id, status')
          .eq('journey_id', journey.id),
      ]);

      setPillars(pillarsRes.data || []);
      setLessons(lessonsRes.data || []);
      setProgress(progressRes.data || []);
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

  const completedIds = new Set(progress.filter(p => p.status === 'completed').map(p => p.document_id));
  const startedIds = new Set(progress.filter(p => p.status === 'started').map(p => p.document_id));

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
        <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>
          &#x1F310; {lang === 'en' ? 'FR' : 'EN'}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 max-md:px-4 py-8">
        {pillars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[15px] text-gray-400">{lang === 'en' ? 'No content available yet.' : 'Pas encore de contenu disponible.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pillars.map((pillar, pi) => {
              const color = pillarColors[pi % pillarColors.length];
              const pillarLessons = lessons.filter(l => l.pillar_id === pillar.id);
              const completedCount = pillarLessons.filter(l => completedIds.has(l.id)).length;
              const totalCount = pillarLessons.length;
              const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              const isExpanded = expandedPillar === pillar.id;

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
                      </h3>
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
                        const isComplete = completedIds.has(lesson.id);
                        const isStarted = startedIds.has(lesson.id);
                        const diff = difficultyLabels[lesson.difficulty] || difficultyLabels.beginner;
                        return (
                          <Link
                            key={lesson.id}
                            href={`/my-track/lesson/${lesson.id}`}
                            className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-b-0 no-underline group"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isComplete ? 'bg-green-100 text-green-600' : isStarted ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-300'}`}>
                              {isComplete ? <CheckIcon /> : <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium text-gray-800 truncate group-hover:text-[#F9250E] transition-colors">
                                {lesson.title}
                              </p>
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
                      <p className="text-[13px] text-gray-400">{lang === 'en' ? 'No lessons available for this pillar yet.' : 'Pas encore de le\u00e7ons pour ce pilier.'}</p>
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
