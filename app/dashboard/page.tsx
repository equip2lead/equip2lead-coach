'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import ProgressDashboard from '@/components/ProgressDashboard';

/* ── Icons ── */
const ChatIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const CalIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
const BarIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const SwitchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>;
const SparkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const BookIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const CheckSmall = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;

const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];
const trackMeta: Record<string, { color: string; icon: string }> = {
  leadership: { color: '#F9250E', icon: '👑' },
  ministry: { color: '#2563EB', icon: '📖' },
  marriage: { color: '#DB2777', icon: '❤️' },
  entrepreneur: { color: '#EA580C', icon: '🚀' },
  personal: { color: '#059669', icon: '🌱' },
};

type PillarScore = { pillar_id: string; score: number; sub_domain_scores: Record<string, number> };
type PillarInfo = { id: string; name_en: string; name_fr: string; sort_order: number };
type WeekPlan = { week: number; title_en: string; title_fr: string; desc_en: string; desc_fr: string; focus: string; exercises: { type: string; title_en: string; title_fr: string }[] };
type PlanData = { weeks: WeekPlan[]; vision_en: string; vision_fr: string; weakest_pillar_en: string; weakest_pillar_fr: string; strongest_pillar_en: string; strongest_pillar_fr: string; overall_score: number };

function ProgressRing({ score, size = 120, strokeWidth = 8, color }: { score: number; size?: number; strokeWidth?: number; color: string }) {
  const r = (size - strokeWidth) / 2, c = 2 * Math.PI * r;
  const [off, setOff] = useState(c);
  useEffect(() => { setTimeout(() => setOff(c - (score / 5) * c), 300); }, [c, score]);
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}/>
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<'overview' | 'plan' | 'lens' | 'coach'>('overview');
  const [loading, setLoading] = useState(true);

  // Data
  const [journey, setJourney] = useState<any>(null);
  const [pillars, setPillars] = useState<PillarInfo[]>([]);
  const [scores, setScores] = useState<PillarScore[]>([]);
  const [plan, setPlan] = useState<{ focus_areas: any[]; coach_lens_summary: string; plan_data: PlanData } | null>(null);
  const [checkinCount, setCheckinCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSwitchWarn, setShowSwitchWarn] = useState(false);

  const handleSwitchTrack = () => {
    setSidebarOpen(false);
    if (!journey || journey.status === 'completed') {
      router.push('/track-selection');
    } else {
      setShowSwitchWarn(true);
    }
  };

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  const initials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      // Check admin
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single();
      if (profile?.role === 'admin') setIsAdmin(true);

      const { data: j } = await supabase.from('journeys')
        .select('id, track_id, current_week, status, tracks(slug, name_en, name_fr)')
        .eq('user_id', user!.id).order('started_at', { ascending: false }).limit(1).single();
      if (!j) { setLoading(false); return; }
      setJourney(j);

      const [pillarsRes, scoresRes, planRes, checkinsRes, streakRes] = await Promise.all([
        supabase.from('pillars').select('id, name_en, name_fr, sort_order').eq('track_id', j.track_id).order('sort_order'),
        supabase.from('pillar_scores').select('pillar_id, score, sub_domain_scores').eq('journey_id', j.id),
        supabase.from('coaching_plans').select('focus_areas, coach_lens_summary, plan_data').eq('journey_id', j.id).maybeSingle(),
        supabase.from('weekly_checkins').select('id').eq('journey_id', j.id),
        supabase.from('streaks').select('current_streak, longest_streak').eq('journey_id', j.id).maybeSingle(),
      ]);

      setPillars(pillarsRes.data || []);
      setScores((scoresRes.data || []).map((s: any) => ({ ...s, score: Number(s.score) })));
      if (planRes.data) setPlan(planRes.data as any);
      setCheckinCount(checkinsRes.data?.length || 0);
      setCurrentStreak(streakRes.data?.current_streak ?? 0);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</div>;
  }

  const track = journey?.tracks as any;
  const trackSlug = track?.slug || 'leadership';
  const trackColor = trackMeta[trackSlug]?.color || '#F9250E';
  const trackIcon = trackMeta[trackSlug]?.icon || '👑';
  const trackName = track ? (lang === 'en' ? track.name_en : track.name_fr) : '';
  const scoredCount = scores.length;
  const totalPillars = pillars.length || 5;
  const allScored = scoredCount >= totalPillars;
  const overall = scoredCount > 0 ? scores.reduce((a, s) => a + s.score, 0) / scoredCount : 0;
  const currentWeek = journey?.current_week || 1;
  const hasPlan = !!plan;
  const focusArea = plan?.focus_areas?.[0];
  const weekPlan = plan?.plan_data?.weeks?.find((w: WeekPlan) => w.week === currentWeek);

  const tabs = [
    { id: 'overview' as const, en: 'Overview', fr: 'Aper\u00e7u', icon: <HomeIcon /> },
    { id: 'plan' as const, en: '12-Week Plan', fr: 'Plan 12 semaines', icon: <BookIcon /> },
    { id: 'lens' as const, en: 'Coach Lens', fr: 'Coach Lens', icon: <EyeIcon /> },
    { id: 'coach' as const, en: 'AI Coach', fr: 'Coach IA', icon: <SparkIcon /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#0B0B0C] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 pt-7 pb-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[16px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
            <span className="text-[17px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>Equip<span className="text-[#F9250E]">2</span>Lead</span>
          </Link>
        </div>
        {journey && (
          <div className="mx-4 mb-4 px-4 py-3 rounded-xl" style={{ background: `${trackColor}15`, border: `1px solid ${trackColor}25` }}>
            <div className="flex items-center gap-2.5">
              <span className="text-[18px]">{trackIcon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-white truncate">{trackName}</div>
                <div className="text-[10px] text-gray-500">{scoredCount}/{totalPillars} pillars</div>
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 px-4 flex flex-col gap-1">
          {[
            { icon: <HomeIcon />, label: lang === 'en' ? 'Dashboard' : 'Tableau de bord', href: '/dashboard', active: true },
            { icon: <BookIcon />, label: lang === 'en' ? 'My Track' : 'Mon parcours', href: '/my-track', active: false },
            { icon: <ChatIcon />, label: lang === 'en' ? 'AI Coach' : 'Coach IA', href: '/ai-coach', active: false },
            { icon: <CalIcon />, label: lang === 'en' ? 'Check-in' : 'Bilan', href: '/weekly-checkin', active: false },
            { icon: <BarIcon />, label: lang === 'en' ? 'Results' : 'R\u00e9sultats', href: `/results?track=${trackSlug}`, active: false },
            ...(isAdmin ? [{ icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>, label: 'Admin', href: '/admin', active: false }] : []),
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>, label: lang === 'en' ? 'Settings' : 'Param\u00e8tres', href: '/settings', active: false },
          ].map((item, i) => (
            <Link key={i} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium no-underline transition-colors ${item.active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
              {item.icon}{item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-6 mt-auto flex flex-col gap-1">
          <button onClick={handleSwitchTrack} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer w-full text-left" style={{ fontFamily: 'inherit' }}><SwitchIcon />{lang === 'en' ? 'Switch Track' : 'Changer'}</button>
          <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer w-full text-left" style={{ fontFamily: 'inherit' }}>🌐 {lang === 'en' ? 'FR' : 'EN'}</button>
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer w-full text-left" style={{ fontFamily: 'inherit' }}><LogOutIcon />{lang === 'en' ? 'Log out' : 'D\u00e9connexion'}</button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-[260px]">
        {/* No journey state */}
        {!journey && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center py-20 px-6">
              <div className="text-[48px] mb-4">🎯</div>
              <h2 className="text-[24px] font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'No active track' : 'Aucun parcours actif'}</h2>
              <p className="text-[15px] text-gray-500 mb-8 max-w-[400px] mx-auto">{lang === 'en' ? 'Choose a coaching track to begin your journey.' : 'Choisissez un parcours pour commencer.'}</p>
              <button onClick={() => router.push('/track-selection')} className="px-8 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all" style={{ boxShadow: '0 4px 16px rgba(249,37,14,0.25)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {lang === 'en' ? 'Choose a Track' : 'Choisir un parcours'} &rarr;
              </button>
            </div>
          </div>
        )}

        {journey && (<>
        {/* Hero Banner */}
        <div className="relative overflow-hidden" style={{ background: trackColor }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.15), transparent 60%)' }} />
          <div className="relative z-[2] px-8 max-md:px-5 pt-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden bg-transparent border-none cursor-pointer text-white/80 p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-bold text-white cursor-pointer" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{initials}</div>
              </div>
            </div>
            <div className="max-w-[1100px] mx-auto">
              <p className="text-white/60 text-[12px] font-semibold uppercase tracking-wider mb-1">{trackName}</p>
              <h1 className="text-[28px] max-md:text-[22px] font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Welcome' : 'Bienvenue'}, {userName}</h1>
              <p className="text-white/60 text-[14px]">{lang === 'en' ? `Week ${currentWeek} of 12` : `Semaine ${currentWeek} sur 12`}{weekPlan ? ` \u2014 ${lang === 'en' ? weekPlan.title_en : weekPlan.title_fr}` : ''}</p>
            </div>
          </div>
          {/* Stats row */}
          <div className="relative z-[2] max-w-[1100px] mx-auto px-8 max-md:px-5 -mb-12">
            <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'en' ? 'OVERALL SCORE' : 'SCORE GLOBAL'}</div>
                <div className="relative w-16 h-16 mx-auto">
                  <ProgressRing score={overall} size={64} strokeWidth={5} color={trackColor} />
                  <span className="absolute inset-0 flex items-center justify-center text-[16px] font-extrabold text-gray-900">{overall.toFixed(1)}</span>
                </div>
                <div className="text-[12px] text-gray-500 mt-2">/5.0</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'en' ? 'PROGRESS' : 'PROGRESSION'}</div>
                <div className="text-[28px] font-extrabold text-gray-900 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{Math.round((currentWeek / 12) * 100)}%</div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden mt-2 mx-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(currentWeek / 12) * 100}%`, background: trackColor }} />
                </div>
                <div className="text-[12px] text-gray-500 mt-2">{lang === 'en' ? `Week ${currentWeek} of 12` : `Semaine ${currentWeek} sur 12`}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'en' ? 'FOCUS AREA' : 'PRIORIT\u00c9'}</div>
                <div className="text-[20px] max-md:text-[16px] font-extrabold text-gray-900 mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {focusArea ? focusArea.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : (lang === 'en' ? 'Complete assessment' : '\u00c9valuation')}
                </div>
                <div className="text-[12px] text-gray-500 mt-1">{lang === 'en' ? 'Primary priority' : 'Priorit\u00e9 principale'}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">CHECK-INS</div>
                <div className="text-[36px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{checkinCount}</div>
                <div className="text-[12px] text-gray-500 mt-1">{lang === 'en' ? 'Completed' : 'Compl\u00e9t\u00e9s'}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'en' ? 'STREAK' : 'S\u00c9RIE'}</div>
                <div className="text-[36px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {currentStreak > 0 ? <><span className="text-[28px]">&#x1F525;</span> {currentStreak}</> : <span className="text-[20px] font-bold text-gray-300">&#x1F525;</span>}
                </div>
                <div className="text-[12px] text-gray-500 mt-1">
                  {currentStreak > 0
                    ? (lang === 'en' ? 'Day Streak' : 'Jours de Suite')
                    : (lang === 'en' ? 'Start Today' : "Commencez Aujourd'hui")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="pt-16 px-8 max-md:px-5 pb-12 max-w-[1100px] mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => t.id === 'coach' ? router.push('/ai-coach') : setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-[10px] text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all border-none ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t.icon} {lang === 'en' ? t.en : t.fr}
              </button>
            ))}
          </div>

          {/* ═══ TAB: Overview ═══ */}
          {tab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Weekly Focus */}
              {weekPlan && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ background: `${trackColor}10`, color: trackColor }}>{lang === 'en' ? `Week ${currentWeek}` : `Semaine ${currentWeek}`}</span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? weekPlan.title_en : weekPlan.title_fr}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{lang === 'en' ? weekPlan.desc_en : weekPlan.desc_fr}</p>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => router.push('/ai-coach')} className="flex items-center gap-2 px-5 py-3 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white transition-all hover:-translate-y-px" style={{ background: trackColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <SparkIcon /> {lang === 'en' ? 'Talk to AI Coach' : 'Parler au Coach IA'}
                    </button>
                    <button onClick={() => router.push('/weekly-checkin')} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer text-[13px] font-semibold text-gray-700 transition-all hover:-translate-y-px" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <CheckSmall /> {lang === 'en' ? 'Weekly Check-in' : 'Bilan hebdomadaire'}
                    </button>
                  </div>
                </div>
              )}

              {/* Vision */}
              {plan?.plan_data?.vision_en && (
                <div className="rounded-2xl p-6" style={{ background: '#1a1a1e' }}>
                  <div className="text-[10px] font-bold uppercase tracking-[2px] mb-3" style={{ color: trackColor }}>{lang === 'en' ? '12-MONTH VISION' : 'VISION 12 MOIS'}</div>
                  <p className="text-[16px] text-white/90 leading-[1.7] italic" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    &ldquo;{lang === 'en' ? plan.plan_data.vision_en : plan.plan_data.vision_fr}&rdquo;
                  </p>
                </div>
              )}

              {/* Pillar Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Pillar Breakdown' : 'D\u00e9tail par Pilier'}</h3>
                  <Link href={`/results?track=${trackSlug}`} className="text-[12px] font-semibold no-underline hover:underline" style={{ color: trackColor }}>{lang === 'en' ? 'View full results' : 'Voir les r\u00e9sultats'}</Link>
                </div>
                <div className="flex flex-col gap-3">
                  {pillars.map((p, i) => {
                    const sc = scores.find(s => s.pillar_id === p.id);
                    const c = pillarColors[i % 5];
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ background: `${c}12`, color: c }}>{p.sort_order}</div>
                        <span className="flex-1 text-[13px] text-gray-700 truncate">{lang === 'en' ? p.name_en : p.name_fr}</span>
                        {sc ? (<>
                          <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(sc.score/5)*100}%`, background: c, transition: 'width 0.8s ease' }}/></div>
                          <span className="text-[12px] font-bold w-8 text-right" style={{ color: c }}>{sc.score.toFixed(1)}</span>
                        </>) : <span className="text-[11px] text-gray-300 italic">{lang === 'en' ? 'Not scored' : 'Non \u00e9valu\u00e9'}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Dashboard — streaks, pillar progress, badges */}
              <ProgressDashboard journeyId={journey.id} lang={lang} />

              {/* No plan yet */}
              {!hasPlan && allScored && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                  <p className="text-gray-500 mb-4">{lang === 'en' ? 'Your coaching plan hasn\'t been generated yet.' : 'Votre plan n\'a pas encore \u00e9t\u00e9 g\u00e9n\u00e9r\u00e9.'}</p>
                  <button onClick={() => router.push(`/plan-generation?track=${trackSlug}`)} className="px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white" style={{ background: trackColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {lang === 'en' ? 'Generate Plan' : 'G\u00e9n\u00e9rer le plan'} &rarr;
                  </button>
                </div>
              )}
              {!allScored && (
                <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: `${trackColor}06`, border: `1.5px solid ${trackColor}15` }}>
                  <PlayIcon />
                  <div className="flex-1">
                    <h4 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Continue Assessment' : 'Continuer l\'\u00e9valuation'}</h4>
                    <p className="text-[13px] text-gray-500">{scoredCount}/{totalPillars} {lang === 'en' ? 'pillars completed' : 'piliers compl\u00e9t\u00e9s'}</p>
                  </div>
                  <button onClick={() => router.push(`/pillar-overview?track=${trackSlug}`)} className="px-5 py-2.5 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white" style={{ background: trackColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Continue' : 'Continuer'} &rarr;</button>
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB: 12-Week Plan ═══ */}
          {tab === 'plan' && (
            <div className="flex flex-col gap-4">
              {plan?.plan_data?.weeks ? plan.plan_data.weeks.map((w: WeekPlan) => {
                const isCurrent = w.week === currentWeek;
                const isPast = w.week < currentWeek;
                const isFuture = w.week > currentWeek;
                return (
                  <div key={w.week} className={`bg-white rounded-2xl border p-5 transition-all ${isCurrent ? 'border-2 shadow-md' : 'border-gray-200'}`} style={isCurrent ? { borderColor: trackColor } : {}}>
                    <div className="flex items-center gap-3">
                      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold ${isPast ? 'bg-green-100 text-green-600' : isCurrent ? 'text-white' : 'bg-gray-100 text-gray-400'}`} style={isCurrent ? { background: trackColor } : {}}>
                        {isPast ? <CheckSmall /> : w.week}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-[15px] font-bold ${isFuture ? 'text-gray-400' : 'text-gray-900'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? w.title_en : w.title_fr}</h4>
                          {isCurrent && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ background: `${trackColor}15`, color: trackColor }}>{lang === 'en' ? 'Current' : 'Actuel'}</span>}
                        </div>
                        <p className={`text-[13px] mt-0.5 ${isFuture ? 'text-gray-300' : 'text-gray-500'}`}>{lang === 'en' ? w.desc_en : w.desc_fr}</p>
                      </div>
                      {isFuture && <LockIcon />}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-12 text-gray-400">
                  <p>{lang === 'en' ? 'Complete all 5 pillars to generate your 12-week plan.' : 'Compl\u00e9tez les 5 piliers pour g\u00e9n\u00e9rer votre plan.'}</p>
                  <button onClick={() => router.push(`/pillar-overview?track=${trackSlug}`)} className="mt-4 px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white" style={{ background: trackColor }}>
                    {lang === 'en' ? 'Continue Assessment' : 'Continuer l\'\u00e9valuation'} &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB: Coach Lens ═══ */}
          {tab === 'lens' && (
            <div className="flex flex-col gap-6">
              {plan ? (<>
                {/* Overall Score */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center">
                  <ProgressRing score={overall} size={160} strokeWidth={12} color={trackColor} />
                  <div className="mt-4 text-center">
                    <span className="text-[40px] font-extrabold text-gray-900">{overall.toFixed(1)}</span>
                    <span className="text-[16px] text-gray-400 ml-1">/5.0</span>
                  </div>
                  <p className="text-[13px] text-gray-500 mt-1">{lang === 'en' ? 'Overall Score' : 'Score Global'}</p>
                </div>

                {/* Strengths & Growth */}
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-2">{lang === 'en' ? 'Strongest Pillar' : 'Point fort'}</div>
                    <div className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? plan.plan_data.strongest_pillar_en : plan.plan_data.strongest_pillar_fr}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">{lang === 'en' ? 'Growth Priority' : 'Priorit\u00e9'}</div>
                    <div className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? plan.plan_data.weakest_pillar_en : plan.plan_data.weakest_pillar_fr}</div>
                  </div>
                </div>

                {/* Coach Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Coach Lens Summary</h3>
                  <p className="text-[14.5px] text-gray-600 leading-[1.75]">{plan.coach_lens_summary}</p>
                </div>

                {/* Focus Areas */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Top 3 Focus Areas' : 'Top 3 Priorit\u00e9s'}</h3>
                  <div className="flex flex-col gap-3">
                    {plan.focus_areas.map((f: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold" style={{ background: `${pillarColors[i]}12`, color: pillarColors[i] }}>{i + 1}</div>
                        <div className="flex-1">
                          <h4 className="text-[14px] font-semibold text-gray-800 capitalize">{f.name.replace(/-/g, ' ')}</h4>
                          <p className="text-[12px] text-gray-500">{lang === 'en' ? f.pillar_en : f.pillar_fr}</p>
                        </div>
                        <span className="text-[14px] font-bold" style={{ color: pillarColors[i] }}>{f.score}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>) : (
                <div className="text-center py-12 text-gray-400">
                  <p>{lang === 'en' ? 'Complete your assessment to see your Coach Lens analysis.' : 'Compl\u00e9tez l\'\u00e9valuation pour voir l\'analyse Coach Lens.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
        </>)}
      </main>

      {/* Switch Track Warning Modal */}
      {showSwitchWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-[460px] w-full shadow-2xl">
            <div className="text-[28px] mb-3">⚠️</div>
            <h3 className="text-[20px] font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? 'Finish your current track first' : "Terminez d'abord votre parcours actuel"}
            </h3>
            <p className="text-[14px] text-gray-600 leading-[1.6] mb-6">
              {lang === 'en'
                ? <>Complete your <strong>{trackName}</strong> coaching journey before starting a new one. You're on <strong>Week {currentWeek} of 12</strong>.</>
                : <>Terminez votre parcours <strong>{trackName}</strong> avant d'en commencer un nouveau. Vous êtes à la <strong>semaine {currentWeek} sur 12</strong>.</>}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowSwitchWarn(false)}
                className="w-full py-3 rounded-xl bg-[#F9250E] border-none cursor-pointer text-[14px] font-bold text-white hover:-translate-y-px transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
              >
                {lang === 'en' ? 'Continue Current Track' : 'Continuer le parcours actuel'}
              </button>
              <button
                onClick={() => { setShowSwitchWarn(false); router.push('/track-selection'); }}
                className="w-full py-2.5 bg-transparent border-none cursor-pointer text-[12.5px] font-semibold text-gray-400 hover:text-gray-600 transition-colors underline"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'en' ? 'Switch anyway' : 'Changer quand même'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
