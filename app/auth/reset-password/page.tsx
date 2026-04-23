'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
      } else {
        setLinkInvalid(true);
        setError('This password reset link is invalid or has expired. Please request a new one.');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStatus('saving');
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    if (updateErr) {
      setStatus('error');
      setError(updateErr.message);
    } else {
      setStatus('done');
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0C] p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" onDark />
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-[#141417] p-8">
          {status === 'done' ? (
            <>
              <h1 className="mb-3 font-serif text-[22px] font-bold text-white">Password updated</h1>
              <p className="text-neutral-400 text-[14px] leading-[1.6]">Redirecting you to your dashboard…</p>
            </>
          ) : linkInvalid ? (
            <>
              <h1 className="mb-3 font-serif text-[22px] font-bold text-white">Link invalid or expired</h1>
              <p className="mb-6 text-neutral-400 text-[14px] leading-[1.6]">{error}</p>
              <a
                href="/auth"
                className="block rounded-xl bg-[#F9250E] py-3 text-center font-bold text-white no-underline hover:bg-[#E0200B] transition-colors text-[14px]"
              >
                Back to sign in
              </a>
            </>
          ) : !sessionReady ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-3 font-serif text-[22px] font-bold text-white">Set a new password</h1>
              <p className="mb-6 text-neutral-400 text-[14px] leading-[1.6]">Choose a strong password you'll remember.</p>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                minLength={8}
                className="mb-3 w-full rounded-xl border border-neutral-700 bg-[#0B0B0C] px-4 py-3 text-[14px] text-white outline-none focus:border-[#F9250E] placeholder:text-neutral-500"
              />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="mb-4 w-full rounded-xl border border-neutral-700 bg-[#0B0B0C] px-4 py-3 text-[14px] text-white outline-none focus:border-[#F9250E] placeholder:text-neutral-500"
              />
              {error && <p className="mb-4 text-[13px] text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={status === 'saving'}
                className="w-full rounded-xl bg-[#F9250E] py-3 font-bold text-white hover:bg-[#E0200B] disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-[14px] transition-colors"
              >
                {status === 'saving' ? 'Saving…' : 'Set new password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
