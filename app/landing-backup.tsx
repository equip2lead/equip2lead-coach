'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import type { Language } from '@/lib/types';

/* ─── SVG Icons ─── */
const CrownIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M2 4l3 12h14l3-12-5.5 3L12 2 7.5 7 2 4z"/></svg>
);
const BookmarkIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M18 2H6a2 2 0 00-2 2v16l8-4 8 4V4a2 2 0 00-2-2z"/></svg>
);
const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
);
const RocketIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>
);
const SproutIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
);
const EyeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const CheckCircleIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const CheckIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><polyline points="20 6 9 17 4 12"/></svg>
);
const DollarIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
);
const MapPinIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 2a8 8 0 018 8c0 6-8 12-8 12S4 16 4 10a8 8 0 018-8z"/></svg>
);
const PlusCircleIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
);
const BookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
);
const ChatIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
);
const BarChartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
);
const LockIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
);
const CompassIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);
const ShieldIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const TrendingUpIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
);
const MenuIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" {...p}><path d="M3 12h18M3 6h18M3 18h18"/></svg>
);

/* ─── Fade-on-scroll hook ─── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeUp({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeUp();
  return <div ref={ref} className={`fade-up-on-scroll ${className}`}>{children}</div>;
}

/* ─── Track Data ─── */
const trackImages = [
  '/images/leadership.jpg',
  '/images/ministry.jpg',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&h=800&fit=crop&crop=faces',
  '/images/entrepreneur.jpg',
  '/images/personal.jpg',
];

const trackColors = ['#F9250E', '#2563EB', '#DB2777', '#EA580C', '#059669'];
const trackKeys = ['leadership', 'ministry', 'marriage', 'entrepreneur', 'personal'] as const;

const trackIcons = [CrownIcon, BookmarkIcon, HeartIcon, RocketIcon, SproutIcon];

const floatingCards = [
  { top: { label: 'Self-Awareness', sub: 'Score: 7.2 / 10', Icon: EyeIcon }, bottom: { label: 'Leadership Plan', sub: '12-week roadmap ready', Icon: CheckCircleIcon } },
  { top: { label: 'Calling Clarity', sub: 'Assessment complete', Icon: BookmarkIcon }, bottom: { label: 'Pastoral Health', sub: '3 focus areas identified', Icon: CheckIcon } },
  { top: { label: 'Couple Analysis', sub: 'Both intakes received', Icon: HeartIcon }, bottom: { label: 'Gap Report', sub: '3 areas to strengthen', Icon: CheckIcon } },
  { top: { label: 'Revenue Diagnostic', sub: 'Analysis complete', Icon: DollarIcon }, bottom: { label: 'Execution Plan', sub: '12-week growth roadmap', Icon: CheckIcon } },
  { top: { label: 'Self-Discovery', sub: 'Profile building...', Icon: MapPinIcon }, bottom: { label: 'Growth Path', sub: 'Track recommendation ready', Icon: CheckIcon } },
];

const testimonials = [
  { quote: 'The leadership assessment pinpointed exactly where I was strong and where I was blind. My team noticed the change within weeks.', name: 'Emmanuel Ndayisaba', role: 'VP Operations, Kigali', initial: 'E' },
  { quote: 'For the first time, I felt like someone understood my exact season in ministry. The intake alone was worth more than three coaching sessions.', name: 'Pastor Samuel K.', role: 'Senior Pastor, Nairobi', initial: 'S' },
  { quote: "We were skeptical about AI coaching for our marriage. But the separate intakes revealed gaps we'd never talked about. It saved us.", name: 'David & Grace M.', role: 'Married 11 years, London', initial: 'D' },
  { quote: 'The business diagnostic was brutally honest — and exactly what I needed. My revenue has grown 40% since following the 12-week plan.', name: 'Amara Okonkwo', role: 'Founder & CEO, Lagos', initial: 'A' },
  { quote: "I wasn't sure which track to start with. The personal development intake helped me discover that leadership coaching was exactly what I needed next.", name: 'Fatou Diallo', role: 'Graduate Student, Dakar', initial: 'F' },
];

const howIcons = [PlusCircleIcon, BookIcon, BarChartIcon, ChatIcon];
const whyIcons = [PlusCircleIcon, LockIcon, CompassIcon, ShieldIcon, ChatIcon, TrendingUpIcon];

/* ─── Main Component ─── */
export default function HomePage() {
  const [lang, setLang] = useState<Language>('en');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getDictionary(lang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTracks = useCallback(() => {
    document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }, []);

  const toggleLang = () => setLang(l => l === 'en' ? 'fr' : 'en');

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>

      {/* ────────── HEADER ────────── */}
      <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-400 border-b ${scrolled ? 'bg-white/[0.96] backdrop-blur-[20px] border-gray-200' : 'border-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-7 flex items-center justify-between h-[68px]">
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[16px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
            <div className={`text-[17px] font-bold transition-colors duration-300 ${scrolled ? 'text-gray-800' : 'text-white'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>equip<span className="text-[#F9250E]">2lead</span></div>
          </a>
          <nav className="hidden md:flex items-center gap-7">
            <a href="#how-it-works" className={`text-[13.5px] font-medium no-underline transition-colors ${scrolled ? 'text-gray-500 hover:text-gray-800' : 'text-white/80 hover:text-white'}`}>{t.nav.howItWorks}</a>
            <a href="#tracks" className={`text-[13.5px] font-medium no-underline transition-colors ${scrolled ? 'text-gray-500 hover:text-gray-800' : 'text-white/80 hover:text-white'}`}>{t.nav.tracks}</a>
            <a href="#why" className={`text-[13.5px] font-medium no-underline transition-colors ${scrolled ? 'text-gray-500 hover:text-gray-800' : 'text-white/80 hover:text-white'}`}>{t.nav.whyUs}</a>
            <a href="#testimonials" className={`text-[13.5px] font-medium no-underline transition-colors ${scrolled ? 'text-gray-500 hover:text-gray-800' : 'text-white/80 hover:text-white'}`}>{t.nav.testimonials}</a>
            <div className={`w-px h-5 ${scrolled ? 'bg-gray-200' : 'bg-white/15'}`} />
            <button onClick={toggleLang} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border cursor-pointer text-xs font-semibold ${scrolled ? 'border-gray-200 text-gray-500' : 'border-white/15 text-white/70'}`} style={{ fontFamily: 'inherit', background: 'transparent' }}>🌐 <span>{lang === 'en' ? 'FR' : 'EN'}</span></button>
            <Link href="/auth" className={`px-4 py-2 rounded-lg border-[1.5px] cursor-pointer text-[13px] font-semibold no-underline ${scrolled ? 'border-gray-300 text-gray-700' : 'border-white/20 text-white'}`} style={{ background: 'transparent' }}>{t.nav.login}</Link>
            <button onClick={scrollToTracks} className="px-5 py-[9px] rounded-full bg-[#F9250E] border-none cursor-pointer text-[13px] font-bold text-white inline-flex items-center gap-1.5" style={{ fontFamily: 'inherit' }}>{t.nav.getStarted}</button>
          </nav>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden bg-transparent border-none cursor-pointer p-1"><MenuIcon /></button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-7 py-5 flex flex-col gap-4">
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-gray-800 no-underline">{t.nav.howItWorks}</a>
            <a href="#tracks" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-gray-800 no-underline">{t.nav.tracks}</a>
            <a href="#why" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-gray-800 no-underline">{t.nav.whyUs}</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-gray-800 no-underline">{t.nav.testimonials}</a>
            <button onClick={scrollToTracks} className="w-full text-center px-6 py-3 rounded-full bg-[#F9250E] border-none text-white font-bold text-[15px] cursor-pointer" style={{ fontFamily: 'inherit' }}>{t.nav.getStarted}</button>
          </div>
        )}
      </header>

      {/* ────────── HERO ────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0C0C0F] overflow-hidden text-center">
        <div className="absolute -top-1/4 -right-[10%] w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.13), rgba(249,37,14,0.03) 40%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-[15%] -left-[5%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.04), transparent 65%)', filter: 'blur(50px)' }} />
        <div className="relative z-10 max-w-[900px] px-7 pt-[140px] pb-[120px]">
          <div className="inline-flex items-center gap-2 px-[22px] py-2.5 rounded-full border border-white/10 bg-white/[0.04] mb-9">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F9250E]" />
            <span className="text-xs font-semibold tracking-[1.2px] text-white/80 uppercase">{t.hero.label}</span>
          </div>
          <h1 className="text-white mb-[30px] leading-[1.12]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(42px, 7vw, 86px)', fontWeight: 700 }}>
            {t.hero.titlePre}<br/>
            <span className="bg-[#F9250E] text-white px-[18px] pb-2 rounded-[14px] inline leading-[1.3]" style={{ WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone' as any }}>{t.hero.titleHl}</span> {t.hero.titlePost.split('\n')[0]}<br/>{t.hero.titlePost.split('\n')[1]}
          </h1>
          <p className="text-white/50 leading-[1.75] max-w-[620px] mx-auto mb-10" style={{ fontSize: 'clamp(16px, 2vw, 19px)' }}>{t.hero.sub}</p>
          <button onClick={scrollToTracks} className="px-10 py-4 rounded-full bg-[#F9250E] text-white text-[17px] font-bold border-none cursor-pointer" style={{ fontFamily: 'inherit', boxShadow: '0 6px 30px rgba(249,37,14,0.35)' }}>{t.hero.cta}</button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.04] flex justify-center flex-wrap">
          {[
            { icon: <PlusCircleIcon className="w-5 h-5 opacity-40" />, bold: '5', text: t.hero.stats.domains },
            { icon: <BookIcon className="w-5 h-5 opacity-40" />, bold: '12-wk', text: t.hero.stats.plans },
            { icon: <ChatIcon className="w-5 h-5 opacity-40" />, bold: '24/7', text: t.hero.stats.coach },
            { icon: <BarChartIcon className="w-5 h-5 opacity-40" />, bold: '100%', text: t.hero.stats.tailored },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-10 py-[22px] text-white/80 text-[15px] font-semibold border-r border-white/[0.04] last:border-r-0 max-md:px-5 max-md:py-3.5 max-md:text-[13px]">
              {s.icon}<span><strong className="text-white font-bold">{s.bold}</strong> {s.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ────────── SFS ────────── */}
      <FadeUp>
        <section className="bg-white py-20 px-7 text-center">
          <h2 className="text-gray-900 mb-4 leading-[1.15]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(28px, 4.5vw, 50px)', fontWeight: 700 }}>{t.sfs.title}</h2>
          <p className="text-lg text-gray-500 max-w-[560px] mx-auto leading-[1.7]">{t.sfs.sub}</p>
        </section>
      </FadeUp>

      {/* ────────── TRACKS ────────── */}
      <section id="tracks" className="bg-white">
        {trackKeys.map((key, i) => {
          const color = trackColors[i];
          const Icon = trackIcons[i];
          const fc = floatingCards[i];
          const test = testimonials[i];
          const reversed = i % 2 === 1;
          const trackT = t.tracks[key];

          return (
            <FadeUp key={key}>
              <div className="py-[70px] border-b border-gray-200">
                <div className={`max-w-[1100px] mx-auto px-7 grid md:grid-cols-2 gap-[60px] items-center ${reversed ? 'direction-rtl' : ''}`} style={reversed ? { direction: 'rtl' } : {}}>
                  {/* Text */}
                  <div style={{ direction: 'ltr' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-7 h-7" style={{ color }} />
                      <h3 className="text-gray-900" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700 }}>{trackT.title}</h3>
                    </div>
                    <p className="text-[15px] font-semibold mb-4" style={{ color }}>{(trackT as any).tagline}</p>
                    <p className="text-[16px] text-gray-500 leading-[1.75] mb-5 max-w-[480px]">{trackT.desc}</p>
                    {/* Topic tags */}
                    {(trackT as any).tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {((trackT as any).tags as string[]).map((tag: string, ti: number) => (
                          <span key={ti} className="px-3 py-1.5 rounded-full text-[12px] font-medium border" style={{ borderColor: `${color}25`, color, background: `${color}06` }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-5 flex-wrap">
                      <Link href="/auth" className="px-7 py-3 rounded-full bg-[#F9250E] text-white text-[15px] font-bold no-underline">{t.tracks.go}</Link>
                      <Link href={`/pillar-overview?track=${key}`} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 no-underline hover:text-[#F9250E] transition-colors" style={{ fontFamily: 'inherit' }}>{t.tracks.learn}</Link>
                    </div>
                  </div>
                  {/* Image */}
                  <div className="relative rounded-[20px] overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3.5', direction: 'ltr' }}>
                    <img src={trackImages[i]} alt={trackT.title} className="w-full h-full object-cover" />
                    {/* Top floating card */}
                    <div className="animate-float0 absolute top-[15%] left-[5%] rounded-[16px] px-[18px] py-3.5 flex items-center gap-3 max-w-[230px] z-[2]" style={{ background: color, boxShadow: `0 8px 30px ${color}66` }}>
                      <div className="w-[38px] h-[38px] rounded-[10px] bg-white/20 flex items-center justify-center shrink-0"><fc.top.Icon className="w-[18px] h-[18px]" style={{ color: 'white' }} /></div>
                      <div><p className="text-[13px] font-bold text-white m-0">{fc.top.label}</p><p className="text-[11px] text-white/70 mt-0.5 m-0">{fc.top.sub}</p></div>
                    </div>
                    {/* Bottom floating card */}
                    <div className="animate-float1 absolute bottom-[12%] right-[5%] rounded-[16px] px-[18px] py-3.5 flex items-center gap-3 max-w-[230px] z-[2] bg-white" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
                      <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${color}1A` }}><fc.bottom.Icon className="w-[18px] h-[18px]" style={{ color }} /></div>
                      <div><p className="text-[13px] font-bold text-gray-800 m-0">{fc.bottom.label}</p><p className="text-[11px] text-gray-400 mt-0.5 m-0">{fc.bottom.sub}</p></div>
                    </div>
                  </div>
                </div>
                {/* Testimonial */}
                <div className={`max-w-[580px] mt-10 px-7 ${reversed ? 'ml-auto' : ''}`}>
                  <div className="border border-gray-200 rounded-[16px] px-7 py-6 bg-white">
                    <p className="text-[15px] text-gray-700 leading-[1.75] mb-5 italic">&ldquo;{test.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white text-[16px] font-bold shrink-0" style={{ background: color, fontFamily: "'Libre Baskerville', serif" }}>{test.initial}</div>
                      <div>
                        <p className="text-[14px] font-bold text-gray-900 m-0">{test.name}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5 m-0">{test.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          );
        })}
      </section>

      {/* ────────── HOW IT WORKS ────────── */}
      <section id="how-it-works" className="bg-gray-50 py-[100px] px-7">
        <div className="max-w-[1100px] mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-5 h-0.5 bg-[#F9250E] rounded-sm" />
              <span className="text-[11px] font-bold tracking-[3px] text-[#F9250E]">{t.how.label}</span>
              <div className="w-5 h-0.5 bg-[#F9250E] rounded-sm" />
            </div>
            <h2 className="text-gray-900 mb-4 leading-[1.12]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700 }}>{t.how.title} <em className="not-italic text-[#F9250E]">{t.how.titleEm}</em></h2>
            <p className="text-[17px] text-gray-500 max-w-[540px] mx-auto leading-[1.7]">{t.how.sub}</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.how.steps.map((step, i) => {
              const Icon = howIcons[i];
              return (
                <FadeUp key={i}>
                  <div className="bg-white rounded-[16px] p-9 pb-8 border-[1.5px] border-gray-200 relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#F9250E] hover:shadow-[0_12px_40px_rgba(249,37,14,0.06)] hover:-translate-y-1 group">
                    <span className="absolute -top-3.5 right-2 text-[110px] font-bold text-gray-900/[0.02] leading-none group-hover:text-[#F9250E]/[0.04]" style={{ fontFamily: "'Libre Baskerville', serif" }}>0{i + 1}</span>
                    <div className="w-12 h-12 rounded-xl mb-5 bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-[#FFF1F0]">
                      <Icon className="w-[22px] h-[22px] text-gray-400" />
                    </div>
                    <h3 className="text-[19px] font-bold text-gray-900 mb-2.5" style={{ fontFamily: "'Libre Baskerville', serif" }}>{step.title}</h3>
                    <p className="text-[14px] text-gray-500 leading-[1.7]">{step.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
          <FadeUp className="text-center mt-12">
            <button onClick={scrollToTracks} className="px-8 py-[15px] rounded-full bg-[#F9250E] text-white text-[15px] font-bold border-none cursor-pointer" style={{ fontFamily: 'inherit' }}>{t.hero.cta}</button>
          </FadeUp>
        </div>
      </section>

      {/* ────────── WHY ────────── */}
      <section id="why" className="bg-[#0C0C0F] py-[100px] px-7 relative overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.05), transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0v60M0 60h60' stroke='%23FFFFFF' stroke-width='.3'/%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-5 h-0.5 bg-[#F9250E] rounded-sm" />
              <span className="text-[11px] font-bold tracking-[3px] text-[#F9250E]">{t.why.label}</span>
              <div className="w-5 h-0.5 bg-[#F9250E] rounded-sm" />
            </div>
            <h2 className="text-white mb-4 leading-[1.12]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700 }}>{t.why.title}<br/><em className="not-italic text-[#F9250E]">{t.why.titleEm}</em></h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 relative">
            {t.why.diffs.map((diff, i) => {
              const Icon = whyIcons[i];
              return (
                <FadeUp key={i}>
                  <div className="bg-white/[0.04] border border-white/[0.04] rounded-[16px] p-[30px_26px]">
                    <div className="w-11 h-11 rounded-[11px] mb-[18px] bg-[#F9250E]/[0.08] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#FF4733]" />
                    </div>
                    <h4 className="text-[17px] font-bold text-white mb-2">{diff.title}</h4>
                    <p className="text-[14px] text-white/40 leading-[1.7]">{diff.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── CTA ────────── */}
      <section className="relative overflow-hidden text-center px-7 py-20" style={{ background: 'linear-gradient(135deg, #F9250E, #D91E0A)' }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0v60M0 60h60' stroke='%23FFFFFF' stroke-width='.5'/%3E%3C/svg%3E\")" }} />
        <FadeUp className="relative max-w-[620px] mx-auto">
          <h2 className="text-white mb-4 leading-[1.15]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700 }}>{t.cta.title}<br/><span className="opacity-85">{t.cta.titleSpan}</span></h2>
          <p className="text-[17px] text-white/75 leading-[1.7] mb-9">{t.cta.sub}</p>
          <button onClick={scrollToTracks} className="px-[38px] py-[17px] rounded-full bg-white text-[#F9250E] text-[17px] font-bold border-none cursor-pointer inline-flex items-center gap-2" style={{ fontFamily: 'inherit', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>{t.cta.btn}</button>
          <p className="text-xs text-white/50 mt-5">{t.cta.note}</p>
        </FadeUp>
      </section>

      {/* ────────── FOOTER ────────── */}
      <footer className="bg-[#07070A] pt-16 pb-8 px-7">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#F9250E] flex items-center justify-center text-[13px] font-extrabold text-white">E</div>
                <span className="text-[15px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>equip<span className="text-[#F9250E]">2lead</span></span>
              </div>
              <p className="text-[13px] text-white/25 leading-[1.7] max-w-[250px] mt-3.5">{t.footer.desc}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F9250E] uppercase tracking-[2px] mb-[18px]">{t.footer.platform}</p>
              {['Leadership', 'Ministry', 'Marriage', 'Entrepreneur', 'Personal Dev'].map(s => (
                <a key={s} href="#" className="block text-[13.5px] text-white/[0.28] no-underline py-1">{s}</a>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F9250E] uppercase tracking-[2px] mb-[18px]">{t.footer.resources}</p>
              {[t.nav.howItWorks, 'Knowledge Vault', 'Blog', 'FAQs'].map(s => (
                <a key={s} href="#" className="block text-[13.5px] text-white/[0.28] no-underline py-1">{s}</a>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F9250E] uppercase tracking-[2px] mb-[18px]">{t.footer.company}</p>
              {['About Dr. Ekobena', 'Contact', 'Privacy', 'Terms'].map(s => (
                <a key={s} href="#" className="block text-[13.5px] text-white/[0.28] no-underline py-1">{s}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex flex-wrap justify-between gap-3">
            <p className="text-xs text-white/[0.15]">{t.footer.copy}</p>
            <p className="text-[11px] text-white/[0.10] max-w-[400px]">{t.footer.disclaimer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
