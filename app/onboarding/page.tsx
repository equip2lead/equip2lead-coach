'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

type Track = { id: string; slug: string; name_en: string; name_fr: string; sort_order: number };
type Pillar = { id: string; name_en: string; name_fr: string; sort_order: number };

const trackMeta: Record<string, { emoji: string; desc_en: string; desc_fr: string }> = {
  leadership: {
    emoji: '\u{1F3C6}',
    desc_en: 'Develop your character, influence and leadership impact',
    desc_fr: 'D\u00e9veloppez votre caract\u00e8re, votre influence et votre impact',
  },
  ministry: {
    emoji: '\u{26EA}',
    desc_en: 'Grow in your calling, spiritual depth and ministry skills',
    desc_fr: 'Grandissez dans votre appel, votre profondeur spirituelle et vos comp\u00e9tences',
  },
  marriage: {
    emoji: '\u{1F48D}',
    desc_en: 'Build a healthy, God-centred, lasting marriage',
    desc_fr: 'Construisez un mariage sain, centr\u00e9 sur Dieu et durable',
  },
  entrepreneur: {
    emoji: '\u{1F4BC}',
    desc_en: 'Build your business with purpose and integrity',
    desc_fr: 'Construisez votre entreprise avec vision et int\u00e9grit\u00e9',
  },
  personal: {
    emoji: '\u{1F331}',
    desc_en: 'Discover who you are and who you\u2019re becoming',
    desc_fr: 'D\u00e9couvrez qui vous \u00eates et qui vous devenez',
  },
};

const featureCards = [
  { emoji: '\u{1F4CB}', title_en: 'Assessment', title_fr: '\u00c9valuation', desc_en: 'Answer questions to map your strengths and growth areas across 5 pillars', desc_fr: 'R\u00e9pondez aux questions pour cartographier vos forces et axes de progr\u00e8s sur 5 piliers' },
  { emoji: '\u{1F4DA}', title_en: 'Lessons', title_fr: 'Le\u00e7ons', desc_en: 'Work through 60+ lessons at your own pace, organized by pillar', desc_fr: 'Parcourez plus de 60 le\u00e7ons \u00e0 votre rythme, organis\u00e9es par pilier' },
  { emoji: '\u{1F916}', title_en: 'AI Coach', title_fr: 'Coach IA', desc_en: 'Chat with your personal coach anytime, in French or English', desc_fr: 'Discutez avec votre coach personnel \u00e0 tout moment, en fran\u00e7ais ou en anglais' },
  { emoji: '\u{1F4C8}', title_en: 'Progress', title_fr: 'Progression', desc_en: 'Track your growth week by week with streaks and badges', desc_fr: 'Suivez votre croissance semaine apr\u00e8s semaine avec des s\u00e9ries et des badges' },
];

const i18n = {
  en: {
    headline: 'Welcome to Equip2Lead Coach \u2014 choose the track you want to start on',
    subtext: 'Choose the track you want to start on. Each track gives you a personalized assessment, coaching plan, and AI coach focused on that area of your life.',
    next: 'Next',
    back: 'Back',
    howItWorks: 'Here\u2019s how it works',
    assessmentHeadline: 'First, let\u2019s understand where you are',
    assessmentSubtext: (trackName: string) => `Your assessment takes about 10 minutes. It maps your current level across 5 pillars of ${trackName}. There are no right or wrong answers \u2014 just honest reflection.`,
    pillarsHeading: '5 Pillars You\u2019ll Be Assessed On',
    loadingPillars: 'Loading pillars...',
    startAssessment: 'Start My Assessment',
    starting: 'Starting...',
  },
  fr: {
    headline: 'Bienvenue sur Equip2Lead Coach \u2014 choisissez le parcours sur lequel vous souhaitez commencer',
    subtext: 'Choisissez le parcours sur lequel vous souhaitez commencer. Chaque parcours vous offre une \u00e9valuation personnalis\u00e9e, un plan de coaching et un coach IA ax\u00e9 sur ce domaine de votre vie.',
    next: 'Suivant',
    back: 'Retour',
    howItWorks: 'Voici comment \u00e7a fonctionne',
    assessmentHeadline: 'D\u2019abord, comprenons o\u00f9 vous en \u00eates',
    assessmentSubtext: (trackName: string) => `Votre \u00e9valuation prend environ 10 minutes. Elle cartographie votre niveau actuel sur les 5 piliers de ${trackName}. Il n\u2019y a pas de bonnes ou mauvaises r\u00e9ponses \u2014 juste une r\u00e9flexion honn\u00eate.`,
    pillarsHeading: '5 Piliers \u00e9valu\u00e9s',
    loadingPillars: 'Chargement...',
    startAssessment: 'Commencer mon \u00e9valuation',
    starting: 'D\u00e9marrage...',
  },
} as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [step, setStep] = useState(1);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // Load profile language, check journey, fetch tracks
  useEffect(() => {
    if (!user) return;
    async function check() {
      // Read preferred language from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user!.id)
        .single();
      const profileLang = profile?.preferred_language === 'fr' ? 'fr' : 'en';
      setLang(profileLang);

      // Redirect if user already has a journey
      const { data: journey } = await supabase.from('journeys')
        .select('id')
        .eq('user_id', user!.id)
        .limit(1)
        .maybeSingle();
      if (journey) {
        router.replace('/dashboard');
        return;
      }

      const { data: trackData } = await supabase.from('tracks')
        .select('id, slug, name_en, name_fr, sort_order')
        .order('sort_order');
      setTracks(trackData || []);
      setLoading(false);
    }
    check();
  }, [user?.id]);

  // Fetch pillars when track is selected
  useEffect(() => {
    if (!selectedTrack) return;
    const track = tracks.find(t => t.slug === selectedTrack);
    if (!track) return;
    async function loadPillars() {
      const { data } = await supabase.from('pillars')
        .select('id, name_en, name_fr, sort_order')
        .eq('track_id', track!.id)
        .order('sort_order');
      setPillars(data || []);
    }
    loadPillars();
  }, [selectedTrack]);

  const handleStart = async () => {
    if (!selectedTrack || starting) return;
    setStarting(true);

    if (user) {
      await supabase.from('profiles').update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      }).eq('id', user.id);
    }

    router.push(`/intake?track=${selectedTrack}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0C]">
        <div className="w-6 h-6 border-2 border-gray-700 border-t-[#F9250E] rounded-full animate-spin" />
      </div>
    );
  }

  const t = i18n[lang];
  const selectedTrackObj = tracks.find(tr => tr.slug === selectedTrack);
  const selectedTrackName = selectedTrackObj ? (lang === 'fr' ? selectedTrackObj.name_fr : selectedTrackObj.name_en) : '';

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top bar — logo only, no language toggle */}
      <div className="flex items-center px-8 max-md:px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[16px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
          <span className="text-[17px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>Equip<span className="text-[#F9250E]">2</span>Lead</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-[#F9250E]' : s < step ? 'w-6 bg-[#F9250E]/40' : 'w-6 bg-gray-800'}`} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 max-md:px-4 pb-12">
        <div className="w-full max-w-[720px]">

          {/* ═══ STEP 1 — Choose Your Track ═══ */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <h1 className="text-[32px] max-md:text-[24px] font-extrabold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t.headline}
                </h1>
                <p className="text-[15px] text-gray-400 max-w-[500px] mx-auto leading-[1.6]">
                  {t.subtext}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {tracks.map(track => {
                  const meta = trackMeta[track.slug] || trackMeta.leadership;
                  const isSelected = selectedTrack === track.slug;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setSelectedTrack(track.slug)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 bg-transparent cursor-pointer text-left transition-all hover:bg-white/5 ${isSelected ? 'border-[#F9250E] bg-[#F9250E]/5' : 'border-gray-800 hover:border-gray-700'}`}
                      style={{ fontFamily: 'inherit' }}
                    >
                      <span className="text-[32px] shrink-0">{meta.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {lang === 'fr' ? track.name_fr : track.name_en}
                        </h3>
                        <p className="text-[13px] text-gray-500 mt-0.5">
                          {lang === 'fr' ? meta.desc_fr : meta.desc_en}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-[#F9250E] bg-[#F9250E]' : 'border-gray-700'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => { if (selectedTrack) setStep(2); }}
                  disabled={!selectedTrack}
                  className="px-8 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: selectedTrack ? '0 4px 16px rgba(249,37,14,0.25)' : 'none' }}
                >
                  {t.next} &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 2 — How It Works ═══ */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <h1 className="text-[32px] max-md:text-[24px] font-extrabold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t.howItWorks}
                </h1>
              </div>

              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                {featureCards.map((card, i) => (
                  <div key={i} className="rounded-2xl border border-gray-800 p-6 bg-[#111118]">
                    <span className="text-[32px] block mb-3">{card.emoji}</span>
                    <h3 className="text-[16px] font-bold text-white mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {lang === 'fr' ? card.title_fr : card.title_en}
                    </h3>
                    <p className="text-[13px] text-gray-400 leading-[1.6]">
                      {lang === 'fr' ? card.desc_fr : card.desc_en}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-gray-700 bg-transparent cursor-pointer text-[14px] font-semibold text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  &larr; {t.back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
                >
                  {t.next} &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3 — Assessment Intro ═══ */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <h1 className="text-[32px] max-md:text-[24px] font-extrabold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t.assessmentHeadline}
                </h1>
                <p className="text-[15px] text-gray-400 max-w-[540px] mx-auto leading-[1.6]">
                  {t.assessmentSubtext(selectedTrackName)}
                </p>
              </div>

              {/* Pillar list */}
              <div className="rounded-2xl border border-gray-800 bg-[#111118] p-6 mb-8">
                <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                  {t.pillarsHeading}
                </h3>
                <div className="flex flex-col gap-3">
                  {pillars.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#F9250E]/10 flex items-center justify-center text-[12px] font-bold text-[#F9250E]">{i + 1}</div>
                      <span className="text-[15px] text-white font-medium">{lang === 'fr' ? p.name_fr : p.name_en}</span>
                    </div>
                  ))}
                  {pillars.length === 0 && (
                    <p className="text-[13px] text-gray-600">{t.loadingPillars}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl border border-gray-700 bg-transparent cursor-pointer text-[14px] font-semibold text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  &larr; {t.back}
                </button>
                <button
                  onClick={handleStart}
                  disabled={starting}
                  className="px-8 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
                >
                  {starting ? t.starting : t.startAssessment} &rarr;
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
