'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { switchLanguage } from '@/lib/language';
import { Logo } from '@/components/Logo';

const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;

type Track = {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  sort_order: number;
};

const trackMeta: Record<string, { color: string; icon: string; tagline_en: string; tagline_fr: string }> = {
  leadership: {
    color: '#F9250E',
    icon: '👑',
    tagline_en: 'Lead with clarity, character, and confidence',
    tagline_fr: 'Diriger avec clarté, caractère et confiance',
  },
  ministry: {
    color: '#2563EB',
    icon: '📖',
    tagline_en: 'Serve with purpose, sustain with wisdom',
    tagline_fr: 'Servir avec un but, durer avec sagesse',
  },
  marriage: {
    color: '#DB2777',
    icon: '❤️',
    tagline_en: 'Build a thriving partnership',
    tagline_fr: 'Bâtir un partenariat florissant',
  },
  entrepreneur: {
    color: '#EA580C',
    icon: '🚀',
    tagline_en: 'Build a Kingdom-minded business',
    tagline_fr: 'Bâtir une entreprise au cœur du Royaume',
  },
  personal: {
    color: '#059669',
    icon: '🌱',
    tagline_en: 'Grow as the person God designed you to be',
    tagline_fr: 'Grandir comme la personne que Dieu a conçue',
  },
};

export default function MyTrackPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [activeTrackName, setActiveTrackName] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [switchModalTrack, setSwitchModalTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    (async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user.id)
        .single();
      const userLang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';
      setLang(userLang);

      const [tracksRes, journeyRes] = await Promise.all([
        supabase
          .from('tracks')
          .select('id, slug, name_en, name_fr, sort_order')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('journeys')
          .select('id, track_id, current_week, status')
          .eq('user_id', user.id)
          .in('status', ['active', 'paused'])
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      const ts: Track[] = tracksRes.data || [];
      setTracks(ts);

      const j = journeyRes.data;
      if (j) {
        setActiveTrackId(j.track_id);
        setCurrentWeek(j.current_week || 1);
        const t = ts.find((x) => x.id === j.track_id);
        if (t) setActiveTrackName(userLang === 'fr' ? t.name_fr : t.name_en);
      }

      setLoading(false);
    })();
  }, [authLoading, user?.id]);

  const handleLockedClick = (track: Track) => {
    if (!activeTrackId) {
      // Brand-new user with no journey — start assessment for this track
      router.push(`/track-selection?slug=${track.slug}`);
      return;
    }
    setSwitchModalTrack(track);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#F9250E] rounded-full animate-spin" />
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
          <Logo size="sm" />
        </div>
        <button onClick={() => switchLanguage(lang === 'en' ? 'fr' : 'en', user!.id, supabase, setLang)} className="px-2.5 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>
          &#x1F310; {lang === 'en' ? 'FR' : 'EN'}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 max-md:px-4 py-8">
        <div className="mb-8">
          <h1 className="text-[26px] font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {lang === 'en' ? 'My Track' : 'Mon Parcours'}
          </h1>
          <p className="text-[14px] text-gray-500">
            {activeTrackId
              ? (lang === 'en' ? 'Your active coaching journey and other available tracks.' : 'Votre parcours actif et les autres parcours disponibles.')
              : (lang === 'en' ? 'Choose a track to begin your coaching journey.' : 'Choisissez un parcours pour commencer.')}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {tracks.map((track) => {
            const meta = trackMeta[track.slug] || { color: '#6B7280', icon: '✨', tagline_en: '', tagline_fr: '' };
            const isActive = activeTrackId === track.id;
            const isLocked = activeTrackId !== null && !isActive;
            const name = lang === 'fr' ? track.name_fr : track.name_en;
            const tagline = lang === 'fr' ? meta.tagline_fr : meta.tagline_en;

            return (
              <div
                key={track.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${isActive ? 'border-[#F9250E]/30' : 'border-gray-200'}`}
                style={isActive ? { boxShadow: '0 4px 24px rgba(249,37,14,0.08)' } : undefined}
              >
                <div className="p-6 max-md:p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] shrink-0" style={{ background: `${meta.color}15` }}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Status badge */}
                      <div className="mb-2">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {lang === 'en' ? 'Active' : 'Actif'}
                          </span>
                        ) : isLocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                            <LockIcon />
                            {lang === 'en' ? 'Locked' : 'Verrouillé'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                            {lang === 'en' ? 'Available' : 'Disponible'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {name}
                      </h3>
                      <p className="text-[13px] text-gray-500 mb-3">{tagline}</p>
                      <div className="text-[12px] text-gray-400 mb-4">
                        {isActive ? (
                          <>
                            {lang === 'en' ? '5 pillars · ' : '5 piliers · '}
                            {lang === 'en' ? `Week ${currentWeek} of 12` : `Semaine ${currentWeek} sur 12`}
                          </>
                        ) : (
                          <>{lang === 'en' ? '5 pillars · 12-week plan' : '5 piliers · plan de 12 semaines'}</>
                        )}
                      </div>

                      {isActive ? (
                        <button
                          onClick={() => router.push('/lessons')}
                          className="px-5 py-2.5 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
                        >
                          {lang === 'en' ? 'Continue lessons →' : 'Continuer les leçons →'}
                        </button>
                      ) : isLocked ? (
                        <button
                          onClick={() => handleLockedClick(track)}
                          className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white cursor-pointer text-[13px] font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {lang === 'en' ? 'Take assessment to unlock' : 'Passer l\'évaluation pour débloquer'}
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push(`/track-selection?slug=${track.slug}`)}
                          className="px-5 py-2.5 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white hover:-translate-y-px transition-all"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: meta.color, boxShadow: `0 4px 16px ${meta.color}40` }}
                        >
                          {lang === 'en' ? 'Start assessment' : 'Commencer l\'évaluation'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Track-switch modal */}
      {switchModalTrack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSwitchModalTrack(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-8 max-md:p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 text-gray-500">
              <LockIcon />
            </div>
            <h2 className="text-[22px] font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'fr' ? 'Un seul parcours à la fois' : 'One track at a time'}
            </h2>
            <p className="text-[14px] text-gray-600 leading-[1.6] mb-6">
              {lang === 'fr'
                ? `Vous travaillez actuellement sur ${activeTrackName}. Pour passer à ${switchModalTrack.name_fr}, terminez votre parcours actuel ou contactez le support.`
                : `You're currently working on ${activeTrackName}. To switch to ${switchModalTrack.name_en}, finish your current track or contact support.`}
            </p>
            <div className="flex gap-3 max-md:flex-col">
              <button
                onClick={() => setSwitchModalTrack(null)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-[13px] font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
              <a
                href={`mailto:contact@equip2lead.coach?subject=${encodeURIComponent(
                  lang === 'fr'
                    ? `Demande de changement de parcours: ${switchModalTrack.name_fr}`
                    : `Track switch request: ${switchModalTrack.name_en}`
                )}`}
                className="flex-1 rounded-xl bg-[#F9250E] py-3 text-center text-[13px] font-bold text-white no-underline hover:bg-[#d91f0c] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
              >
                {lang === 'fr' ? 'Contacter le support' : 'Contact support'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
