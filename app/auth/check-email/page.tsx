'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const i18n = {
  en: {
    heading: 'Check your inbox',
    sub: 'We sent a confirmation link to your email. Click it to activate your account.',
    spamTitle: 'Note',
    spam: "Our emails may land in your spam folder for the first few weeks. Please check spam and mark as 'Not spam' to help future emails reach your inbox.",
    resend: 'Resend email',
    resending: 'Sending...',
    resent: 'Email sent. Check your inbox.',
    resendError: 'Could not resend. Please try again.',
    back: '← Back to sign in',
    sentTo: 'Sent to',
    langLabel: 'FR',
  },
  fr: {
    heading: 'Vérifiez votre boîte de réception',
    sub: 'Nous avons envoyé un lien de confirmation à votre adresse email. Cliquez dessus pour activer votre compte.',
    spamTitle: 'Note',
    spam: "Nos emails peuvent arriver dans votre dossier spam pendant les premières semaines. Vérifiez votre spam et marquez-les comme « Pas du spam » pour que les prochains emails atteignent votre boîte.",
    resend: "Renvoyer l'email",
    resending: 'Envoi...',
    resent: 'Email envoyé. Vérifiez votre boîte.',
    resendError: "Impossible de renvoyer. Réessayez.",
    back: '← Retour à la connexion',
    sentTo: 'Envoyé à',
    langLabel: 'EN',
  },
};

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const supabase = createClient();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err' | ''>('');

  const t = i18n[lang];

  const handleResend = async () => {
    if (!email || sending) return;
    setSending(true);
    setMsg('');
    setMsgType('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMsg(error.message || t.resendError);
      setMsgType('err');
    } else {
      setMsg(t.resent);
      setMsgType('ok');
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center relative overflow-hidden px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,37,14,0.08), transparent 65%)', filter: 'blur(100px)' }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.05), transparent 60%)', filter: 'blur(80px)' }} />

      {/* Language toggle */}
      <button
        onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
        className="absolute top-6 right-7 px-3 py-1.5 rounded-lg border border-white/10 bg-transparent text-[11px] font-semibold text-white/50 cursor-pointer hover:border-white/20 hover:text-white/70 transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        🌐 {t.langLabel}
      </button>

      <div className="relative z-10 max-w-[480px] w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-14">
          <div className="w-10 h-10 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[18px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
          <span className="text-[19px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Equip<span className="text-[#F9250E]">2</span>Lead
          </span>
        </div>

        {/* Envelope icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(249,37,14,0.1)', border: '1px solid rgba(249,37,14,0.25)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#F9250E" strokeWidth="1.8" className="w-12 h-12">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 6L2 7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] max-md:text-[26px] font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          {t.heading}
        </h1>

        {/* Subtext */}
        <p className="text-[15px] text-white/70 leading-[1.6] mb-2 max-w-[400px] mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {t.sub}
        </p>

        {/* Email shown */}
        {email && (
          <p className="text-[13px] text-white/50 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t.sentTo} <span className="text-[#F9250E] font-semibold">{email}</span>
          </p>
        )}

        {/* Spam warning */}
        <div
          className="mb-8 px-4 py-3.5 rounded-xl flex items-start gap-3 text-left"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className="w-5 h-5 shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="text-[12px] font-bold uppercase tracking-wider text-amber-400 mb-1">{t.spamTitle}</div>
            <p className="text-[13px] text-amber-100/90 leading-[1.55]">{t.spam}</p>
          </div>
        </div>

        {/* Resend status */}
        {msg && (
          <div
            className={`mb-5 px-4 py-2.5 rounded-lg text-[13px] ${msgType === 'ok' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {msg}
          </div>
        )}

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={!email || sending}
          className="px-8 py-3.5 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ boxShadow: '0 4px 24px rgba(249,37,14,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {sending ? t.resending : t.resend}
        </button>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/auth"
            className="text-[13.5px] text-white/50 hover:text-white/80 transition-colors no-underline"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-white/50" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</div>}>
      <CheckEmailContent />
    </Suspense>
  );
}
