'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BookIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#DB2777" strokeWidth="2" className="w-[13px] h-[13px]"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const BoltIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className="w-[13px] h-[13px]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;

const tracks = [
  { slug: 'leadership', color: '#F9250E', bg: 'rgba(249,37,14,0.08)',
    icon: <svg viewBox="0 0 24 24" stroke="#F9250E" fill="none" strokeWidth="1.8" className="w-[26px] h-[26px]"><path d="M12 2L5 12l3 1-2 7 8-6-3-1z"/><path d="M12 2l7 10-3 1 2 7-8-6 3-1z"/></svg> },
  { slug: 'ministry', color: '#2563EB', bg: 'rgba(37,99,235,0.08)',
    icon: <svg viewBox="0 0 24 24" stroke="#2563EB" fill="none" strokeWidth="1.8" className="w-[26px] h-[26px]"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> },
  { slug: 'marriage', color: '#DB2777', bg: 'rgba(219,39,119,0.08)', extra: 'couples',
    icon: <svg viewBox="0 0 24 24" stroke="#DB2777" fill="none" strokeWidth="1.8" className="w-[26px] h-[26px]"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { slug: 'entrepreneur', color: '#EA580C', bg: 'rgba(234,88,12,0.08)',
    icon: <svg viewBox="0 0 24 24" stroke="#EA580C" fill="none" strokeWidth="1.8" className="w-[26px] h-[26px]"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> },
  { slug: 'personal', color: '#059669', bg: 'rgba(5,150,105,0.08)', extra: 'starter',
    icon: <svg viewBox="0 0 24 24" stroke="#059669" fill="none" strokeWidth="1.8" className="w-[26px] h-[26px]"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
];

const i18n = {
  en: {
    step: 'Step 1 of 3', title: 'Choose your coaching track',
    sub: "Select the area where you'd like to grow. Your track determines the assessment questions and coaching plan you'll receive.",
    tracks: [
      { name: 'Leadership Coaching', tagline: 'Lead with clarity, character, and confidence',
        desc: 'For emerging leaders, managers, executives, and anyone who leads people. 5 Pillars and 21 dimensions of leadership growth.',
        tags: ['Self-Awareness', 'Vision', 'Communication', 'Decision-Making'], moreTags: 5 },
      { name: 'Ministry Coaching', tagline: 'Serve with purpose, sustain with wisdom',
        desc: 'For pastors, church planters, ministry leaders, and missionaries. 5 Pillars from calling clarity through sustainability.',
        tags: ['Calling Clarity', 'Spiritual Formation', 'Preaching', 'Discipleship'], moreTags: 6 },
      { name: 'Marriage Coaching', tagline: 'Build a marriage that lasts and thrives',
        desc: 'For couples \u2014 married, engaged, or rebuilding. Each spouse completes intake individually. 5 Pillars, 20 dimensions.',
        tags: ['Friendship & Intimacy', 'Communication', 'Conflict & Repair', 'Trust'], moreTags: 6 },
      { name: 'Entrepreneur Coaching', tagline: 'Build a business that serves and scales',
        desc: 'For business owners, founders, and marketplace leaders. 5 Pillars and 21 dimensions of business diagnostics.',
        tags: ['Revenue Diagnostics', 'Offer Clarity', 'Pricing Strategy', 'Sales & Marketing'], moreTags: 5 },
      { name: 'Personal Development', tagline: "Discover who you are and grow into who you're meant to be",
        desc: 'The discovery track \u2014 for anyone seeking growth in purpose, identity, habits, and life design. 5 Pillars, 23 dimensions.',
        tags: ['Purpose & Identity', 'Emotional Intelligence', 'Habits & Discipline', 'Relationships'], moreTags: 3 },
    ],
    dims: ['5 pillars \u00b7 21 dimensions', '5 pillars \u00b7 21 dimensions', '5 pillars \u00b7 20 dimensions', '5 pillars \u00b7 21 dimensions', '5 pillars \u00b7 23 dimensions'],
    duration: '12 weeks', couples: 'Both spouses', starter: 'Starter track',
    learnMore: 'Learn more',
    marriageNote: 'Both you and your spouse will complete separate intake questionnaires. The platform will then analyse your combined responses to generate a shared coaching plan. Your partner will receive an email invitation.',
    btn: 'Continue to Assessment \u2192', langLabel: 'FR',
  },
  fr: {
    step: '\u00c9tape 1 sur 3', title: 'Choisissez votre parcours',
    sub: 'S\u00e9lectionnez le parcours dans lequel vous souhaitez grandir. Chaque parcours utilise 5 Piliers et des dimensions diagnostiques.',
    tracks: [
      { name: 'Coaching Leadership', tagline: 'Dirigez avec clart\u00e9, caract\u00e8re et confiance',
        desc: 'Pour les leaders \u00e9mergents, gestionnaires et cadres. 5 Piliers et 21 dimensions de croissance en leadership.',
        tags: ['Conscience de soi', 'Vision', 'Communication', 'Prise de d\u00e9cision'], moreTags: 5 },
      { name: 'Coaching Minist\u00e8re', tagline: 'Servir avec vision, durer avec sagesse',
        desc: "Pour pasteurs, planteurs et missionnaires. 5 Piliers de l'appel \u00e0 la durabilit\u00e9, 21 dimensions.",
        tags: ['Clart\u00e9 d\'appel', 'Formation spirituelle', 'Pr\u00e9dication', 'Discipulat'], moreTags: 6 },
      { name: 'Coaching Mariage', tagline: 'B\u00e2tir un mariage qui dure et qui s\'\u00e9panouit',
        desc: 'Pour les couples \u2014 mari\u00e9s, fianc\u00e9s ou en reconstruction. 5 Piliers, 20 dimensions relationnelles.',
        tags: ['Amiti\u00e9 & Intimit\u00e9', 'Communication', 'Conflit & R\u00e9paration', 'Confiance'], moreTags: 6 },
      { name: 'Coaching Entrepreneur', tagline: 'Construire une entreprise qui sert et qui grandit',
        desc: 'Pour propri\u00e9taires, fondateurs et leaders du march\u00e9. 5 Piliers et 21 dimensions de diagnostics business.',
        tags: ['Diagnostics Revenus', 'Clart\u00e9 Offre', 'Strat\u00e9gie Prix', 'Ventes & Marketing'], moreTags: 5 },
      { name: 'D\u00e9veloppement Personnel', tagline: 'D\u00e9couvrez qui vous \u00eates et devenez qui vous devez \u00eatre',
        desc: 'Le parcours d\u00e9couverte \u2014 croissance en identit\u00e9, habitudes et projet de vie. 5 Piliers, 23 dimensions.',
        tags: ['But & Identit\u00e9', 'Intelligence \u00e9motionnelle', 'Habitudes', 'Relations'], moreTags: 3 },
    ],
    dims: ['5 piliers \u00b7 21 dimensions', '5 piliers \u00b7 21 dimensions', '5 piliers \u00b7 20 dimensions', '5 piliers \u00b7 21 dimensions', '5 piliers \u00b7 23 dimensions'],
    duration: '12 semaines', couples: 'Les deux conjoints', starter: "Parcours d'entr\u00e9e",
    learnMore: 'En savoir plus',
    marriageNote: "Vous et votre conjoint remplirez des questionnaires s\u00e9par\u00e9s. La plateforme analysera vos r\u00e9ponses combin\u00e9es.",
    btn: "Continuer vers l'\u00e9valuation \u2192", langLabel: 'EN',
  },
};

import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import UserMenu from '@/components/UserMenu';

export default function TrackSelectionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [activeComplete, setActiveComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const t = i18n[lang];

  // Load user's active journey + admin status
  useEffect(() => {
    if (!user) return;
    async function load() {
      // Check admin role
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user!.id).single();
      if (profile?.role === 'admin') setIsAdmin(true);

      const { data: j } = await supabase
        .from('journeys')
        .select('track_id, status, tracks(slug)')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();
      if (j) {
        const slug = (j.tracks as any)?.slug;
        setActiveTrack(slug);
        setSelected(slug);
        setActiveComplete(j.status === 'completed' || j.status === 'plan_generated');
      }
    }
    load();
  }, [user?.id]);

  const handleContinue = () => {
    if (!selected) return;
    // Admins can freely switch tracks
    if (isAdmin) {
      if (activeTrack === selected) {
        router.push(`/dashboard`);
      } else {
        router.push(`/intake?track=${selected}`);
      }
      return;
    }
    if (activeTrack && activeTrack !== selected && !activeComplete) {
      setShowWarning(true);
      return;
    }
    // If returning to active/completed track, go to dashboard; new track starts intake
    if (activeTrack === selected && activeComplete) {
      router.push(`/dashboard`);
    } else if (activeTrack === selected) {
      router.push(`/intake?track=${selected}`);
    } else {
      router.push(`/intake?track=${selected}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 max-md:px-5 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#F9250E] flex items-center justify-center text-[15px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
          <div className="text-[16px] font-bold text-gray-800" style={{ fontFamily: "'Libre Baskerville', serif" }}>Equip<span className="text-[#F9250E]">2</span>Lead</div>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md bg-transparent border-[1.5px] border-gray-200 cursor-pointer text-[11px] font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all" style={{ fontFamily: 'inherit' }}>🌐 {t.langLabel}</button>
          <UserMenu />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[960px] mx-auto px-6 py-12 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(249,37,14,0.06)', border: '1px solid rgba(249,37,14,0.12)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#F9250E]" />
            <span className="text-[11px] font-bold text-[#F9250E] uppercase tracking-[1.5px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.step}</span>
          </div>
          <h1 className="text-[clamp(28px,4vw,40px)] font-extrabold text-gray-900 mb-3 tracking-tight leading-[1.15]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.title}</h1>
          <p className="text-[16px] text-gray-500 max-w-[520px] mx-auto leading-[1.6]">{t.sub}</p>
        </div>

        <div className="flex flex-col gap-4">
          {tracks.map((track, i) => {
            const td = t.tracks[i];
            const isSelected = selected === track.slug;
            return (
              <div key={track.slug}>
                <div
                  onClick={() => setSelected(track.slug)}
                  className={`bg-white border-[1.5px] rounded-2xl px-8 py-6 max-md:px-5 flex items-center gap-6 cursor-pointer transition-all ${isSelected ? 'border-[#F9250E] shadow-[0_0_0_3px_rgba(249,37,14,0.08)]' : 'border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'}`}
                  style={isSelected ? { background: 'rgba(249,37,14,0.015)' } : {}}
                >
                  <div className="shrink-0 w-14 h-14 rounded-[14px] flex items-center justify-center" style={{ background: track.bg }}>{track.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[17px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{td.name}</h3>
                      {activeTrack === track.slug && !activeComplete && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(249,37,14,0.1)', color: '#F9250E' }}>
                          {lang === 'en' ? 'Active' : 'Actif'}
                        </span>
                      )}
                      {activeTrack === track.slug && activeComplete && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                          {lang === 'en' ? 'Complete' : 'Termin\u00e9'}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-medium mb-1.5" style={{ color: track.color }}>{td.tagline}</p>
                    <p className="text-[14px] text-gray-500 leading-[1.55] mb-2.5">{td.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {td.tags.slice(0, 3).map((tag: string, ti: number) => (
                        <span key={ti} className="px-2 py-0.5 rounded-full text-[10.5px] font-medium border" style={{ borderColor: `${track.color}20`, color: track.color, background: `${track.color}06` }}>{tag}</span>
                      ))}
                      {td.tags.length > 3 && <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium text-gray-400 bg-gray-50">+{td.moreTags} more</span>}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold text-gray-400"><BookIcon /> {t.dims[i]}</span>
                      <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold text-gray-400"><ClockIcon /> {t.duration}</span>
                    </div>
                  </div>
                  <div className="shrink-0 max-md:hidden">
                    <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#F9250E]' : 'border-gray-300'}`}>
                      <div className={`w-[10px] h-[10px] rounded-full bg-[#F9250E] transition-transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                    </div>
                  </div>
                </div>
                {track.slug === 'marriage' && selected === 'marriage' && (
                  <div className="flex gap-3 items-start mt-3 px-5 py-4 rounded-xl" style={{ background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.12)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#DB2777" strokeWidth="2" className="w-[18px] h-[18px] shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <p className="text-[13px] text-[#9D174D] leading-[1.6]">{t.marriageNote}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-10 py-4 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white transition-all ${selected ? 'bg-[#F9250E] hover:bg-[#E0200B] hover:-translate-y-px' : 'bg-gray-300 cursor-not-allowed'}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: selected ? '0 4px 16px rgba(249,37,14,0.25)' : 'none' }}
          >
            {activeTrack === selected && !activeComplete
              ? (lang === 'en' ? 'Continue Assessment \u2192' : 'Continuer l\u2019\u00e9valuation \u2192')
              : t.btn}
          </button>
        </div>

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl p-8 max-w-[440px] w-full shadow-2xl">
              <div className="text-[24px] mb-3">\u26a0\ufe0f</div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {lang === 'en' ? 'Track in progress' : 'Parcours en cours'}
              </h3>
              <p className="text-[14px] text-gray-500 leading-[1.6] mb-6">
                {lang === 'en'
                  ? 'You have an active coaching track that isn\u2019t finished yet. Please complete your current track before starting a new one.'
                  : 'Vous avez un parcours actif non termin\u00e9. Veuillez terminer votre parcours actuel avant d\u2019en commencer un nouveau.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setShowWarning(false); setSelected(activeTrack); }}
                  className="flex-1 py-3 rounded-xl bg-[#F9250E] border-none cursor-pointer text-[14px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {lang === 'en' ? 'Continue current track' : 'Continuer le parcours actuel'}
                </button>
                <button onClick={() => setShowWarning(false)}
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer text-[14px] font-semibold text-gray-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {lang === 'en' ? 'Cancel' : 'Annuler'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
