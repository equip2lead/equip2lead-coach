'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';

const ShieldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ChatIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const BarIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.44 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const i18n = {
  en: {
    leftH: ['Your journey to growth', 'starts ', 'right here'],
    leftSub: 'Join thousands of leaders, ministers, couples, and entrepreneurs transforming their lives through personalised coaching.',
    feat: [
      { t: 'Safe & Confidential', d: 'Your data is encrypted. Separate intakes for couples.' },
      { t: '24/7 AI Coach', d: "Chat anytime with a coach trained on Dr. Ekobena's frameworks." },
      { t: 'Personalised Roadmap', d: '12-week plan built from your unique assessment answers.' },
    ],
    tabSignup: 'Sign Up', tabLogin: 'Log In',
    signupTitle: 'Create your account', signupSub: 'Start your personalised coaching journey today',
    loginTitle: 'Welcome back', loginSub: 'Log in to continue your coaching journey',
    firstName: 'First Name', lastName: 'Last Name', email: 'Email', password: 'Password',
    agree: 'I agree to the Terms & Privacy',
    signupBtn: 'Create Account', loginBtn: 'Log In',
    terms: 'By signing up, you agree to our Terms of Service and Privacy Policy.',
    or: 'or', remember: 'Remember me', forgot: 'Forgot password?',
    haveAccount: 'Already have an account?', loginLink: 'Log in',
    noAccount: "Don't have an account?", signupLink: 'Sign up',
    langLabel: 'FR',
  },
  fr: {
    leftH: ['Votre parcours de croissance', 'commence ', 'ici'],
    leftSub: 'Rejoignez des milliers de leaders, ministres, couples et entrepreneurs qui transforment leur vie grâce au coaching personnalisé.',
    feat: [
      { t: 'Sûr & Confidentiel', d: 'Vos données sont chiffrées. Évaluations séparées pour les couples.' },
      { t: 'Coach IA 24h/24', d: 'Discutez à tout moment avec un coach formé aux cadres du Dr. Ekobena.' },
      { t: 'Feuille de route personnalisée', d: "Plan de 12 semaines construit à partir de vos réponses d'évaluation." },
    ],
    tabSignup: 'Inscription', tabLogin: 'Connexion',
    signupTitle: 'Créez votre compte', signupSub: 'Commencez votre parcours de coaching personnalisé',
    loginTitle: 'Bon retour', loginSub: 'Connectez-vous pour continuer votre parcours',
    firstName: 'Prénom', lastName: 'Nom', email: 'Email', password: 'Mot de passe',
    agree: "J'accepte les Conditions & Politique de confidentialité",
    signupBtn: 'Créer un compte', loginBtn: 'Se connecter',
    terms: 'En vous inscrivant, vous acceptez nos Conditions et notre Politique de confidentialité.',
    or: 'ou', remember: 'Se souvenir de moi', forgot: 'Mot de passe oublié ?',
    haveAccount: 'Déjà un compte ?', loginLink: 'Se connecter',
    noAccount: 'Pas encore de compte ?', signupLink: "S'inscrire",
    langLabel: 'EN',
  },
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/track-selection';
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const t = i18n[lang];
  const isSignup = tab === 'signup';
  const FeatIcons = [ShieldIcon, ChatIcon, BarIcon];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isSignup) {
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;

      let signUpError: any = null;
      for (let attempt = 1; attempt <= 2; attempt++) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
          },
        });

        if (!error) { signUpError = null; break; }

        signUpError = error;
        console.error(`[Signup] attempt ${attempt} error:`, error);

        const isRetryable = !error.message || error.name === 'AuthRetryableFetchError' || /network|fetch|timeout/i.test(error.message);
        if (attempt < 2 && isRetryable) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        break;
      }

      if (signUpError) {
        const msg = signUpError?.message
          || (signUpError as any)?.error_description
          || 'Connection timeout - please try again';
        setError(msg);
        setLoading(false);
        return;
      }

      setSuccess(lang === 'en'
        ? 'Check your email for a confirmation link!'
        : 'Vérifiez votre email pour le lien de confirmation !');
      setLoading(false);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(lang === 'en' ? signInError.message : 'Email ou mot de passe incorrect.');
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
  };

  return (
    <div className="min-h-screen flex max-md:flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Language Toggle */}
      <button
        onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
        className="absolute top-6 right-7 z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg border-[1.5px] border-gray-200 bg-transparent text-xs font-semibold text-gray-500 cursor-pointer hover:border-gray-300 hover:bg-white transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        🌐 <span>{t.langLabel}</span>
      </button>

      {/* ─── LEFT PANEL ─── */}
      <div className="flex-[0_0_45%] max-md:flex-none flex flex-col justify-center items-center bg-[#0B0B0C] relative overflow-hidden px-12 py-[60px] max-md:px-7 max-md:py-10">
        <div className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #5A101055, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-[15%] -left-[15%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #5A101033, transparent 60%)', filter: 'blur(60px)' }} />
        <div className="relative z-[2] max-w-[400px] animate-[fadeIn_0.6s_ease_0.1s_both]">
          <Link href="/" className="flex items-center gap-2.5 no-underline mb-12">
            <div className="w-10 h-10 rounded-[10px] bg-[#F9250E] flex items-center justify-center text-[18px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
            <div className="text-[19px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>Equip<span className="text-[#F9250E]">2</span>Lead</div>
          </Link>
          <h2 className="text-white text-[36px] max-md:text-[28px] font-extrabold leading-[1.15] tracking-tight mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t.leftH[0]}<br/>{t.leftH[1]}<em className="not-italic text-[#F9250E]">{t.leftH[2]}</em>
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#9A9AA0] mb-12 max-md:mb-0">{t.leftSub}</p>
          <div className="flex flex-col gap-5 max-md:hidden">
            {t.feat.map((f, i) => {
              const Icon = FeatIcons[i];
              return (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-[#F9250E]/10 border border-[#F9250E]/15 flex items-center justify-center text-[#F9250E]"><Icon /></div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#CFCFD2] mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.t}</h4>
                    <p className="text-[13px] text-[#6B6B73] leading-[1.5]">{f.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-10 max-md:px-5 max-md:py-8 bg-[#F9FAFB]">
        <div className="w-full max-w-[440px] animate-[fadeIn_0.5s_ease_both]">
          {/* Header */}
          <div className="text-center mb-9">
            <h1 className="text-[26px] font-extrabold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isSignup ? t.signupTitle : t.loginTitle}
            </h1>
            <p className="text-[14.5px] text-gray-500 leading-[1.5]">{isSignup ? t.signupSub : t.loginSub}</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            <button onClick={() => setTab('signup')} className={`flex-1 py-3 rounded-[10px] border-none cursor-pointer text-[14px] font-semibold transition-all ${isSignup ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]' : 'bg-transparent text-gray-500'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.tabSignup}</button>
            <button onClick={() => setTab('login')} className={`flex-1 py-3 rounded-[10px] border-none cursor-pointer text-[14px] font-semibold transition-all ${!isSignup ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]' : 'bg-transparent text-gray-500'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.tabLogin}</button>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3 mb-6 max-md:flex-col">
            <button onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-[10px] border-[1.5px] border-gray-200 bg-white cursor-pointer text-[13.5px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-px transition-all" style={{ fontFamily: 'inherit' }} type="button">
              <GoogleIcon /> Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t.or}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error */}
          {error && error !== '{}' && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{success}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="flex gap-3 max-[480px]:flex-col max-[480px]:gap-0">
                <div className="flex-1 mb-5">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-[7px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.firstName}</label>
                  <input name="firstName" className="w-full px-3.5 py-3 rounded-[10px] border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.08)] transition-all placeholder:text-gray-400" type="text" placeholder="Denis" required style={{ fontFamily: 'inherit' }} />
                </div>
                <div className="flex-1 mb-5">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-[7px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.lastName}</label>
                  <input name="lastName" className="w-full px-3.5 py-3 rounded-[10px] border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.08)] transition-all placeholder:text-gray-400" type="text" placeholder="Ekobena" required style={{ fontFamily: 'inherit' }} />
                </div>
              </div>
            )}
            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-gray-700 mb-[7px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.email}</label>
              <input name="email" className="w-full px-3.5 py-3 rounded-[10px] border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.08)] transition-all placeholder:text-gray-400" type="email" placeholder="you@example.com" required style={{ fontFamily: 'inherit' }} />
            </div>
            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-gray-700 mb-[7px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.password}</label>
              <div className="relative">
                <input name="password" className="w-full px-3.5 py-3 pr-11 rounded-[10px] border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.08)] transition-all placeholder:text-gray-400" type={showPw ? 'text' : 'password'} placeholder="••••••••" minLength={8} required style={{ fontFamily: 'inherit' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {isSignup ? (
              <div className="flex items-center mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-[13.5px] text-gray-600">
                  <input type="checkbox" required className="w-[18px] h-[18px] rounded accent-[#F9250E]" />
                  <span>{t.agree}</span>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-[13.5px] text-gray-600">
                  <input type="checkbox" className="w-[18px] h-[18px] rounded accent-[#F9250E]" />
                  <span>{t.remember}</span>
                </label>
                <a href="#" className="text-[13px] font-semibold text-[#F9250E] no-underline hover:underline">{t.forgot}</a>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[#F9250E] border-none cursor-pointer text-[15px] font-bold text-white transition-all hover:bg-[#E0200B] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}>
              {loading ? '...' : (isSignup ? t.signupBtn : t.loginBtn)}
            </button>

            {isSignup && <p className="text-[12.5px] text-gray-400 text-center leading-[1.6]">{t.terms}</p>}
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[13.5px] text-gray-500">
              {isSignup ? t.haveAccount : t.noAccount}{' '}
              <button onClick={() => setTab(isSignup ? 'login' : 'signup')} className="text-[#F9250E] font-semibold bg-transparent border-none cursor-pointer hover:underline" style={{ fontFamily: 'inherit' }}>
                {isSignup ? t.loginLink : t.signupLink}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
