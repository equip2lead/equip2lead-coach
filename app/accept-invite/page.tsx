'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-white/50">Loading…</div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteId = searchParams.get('id');
  const supabase = createClient();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'redeeming' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [roleGranted, setRoleGranted] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthed(!!user);
      setAuthChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (!authChecked || !isAuthed || !inviteId || status !== 'idle') return;
    (async () => {
      setStatus('redeeming');
      const { data, error } = await supabase.rpc('redeem_invite', { invite_id_in: inviteId });
      if (error) {
        setStatus('error');
        setMessage(error.message || 'Invite could not be redeemed');
        return;
      }
      if (data?.ok) {
        setRoleGranted(data.role_granted);
        setStatus('ok');
      } else {
        setStatus('error');
        setMessage(data?.error || 'Invite could not be redeemed');
      }
    })();
  }, [authChecked, isAuthed, inviteId, status]);

  if (!inviteId) {
    return <Shell>
      <Error message="No invite id provided." />
    </Shell>;
  }

  if (!authChecked) {
    return (
      <Shell>
        <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin mx-auto" />
      </Shell>
    );
  }

  if (!isAuthed) {
    return (
      <Shell>
        <h1 className="text-white text-[26px] font-serif font-bold mb-3">You're invited to Equip2Lead</h1>
        <p className="text-neutral-400 text-[15px] mb-8 leading-relaxed">
          Create an account or sign in to accept the invitation.
        </p>
        <Link
          href={`/auth?redirect=${encodeURIComponent(`/accept-invite?id=${inviteId}`)}`}
          className="inline-block px-6 py-3 rounded-xl bg-[#F9250E] text-white text-[14px] font-bold no-underline"
          style={{ boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
        >
          Continue to sign in / sign up →
        </Link>
      </Shell>
    );
  }

  if (status === 'redeeming') {
    return (
      <Shell>
        <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-400 text-[14px]">Accepting your invitation…</p>
      </Shell>
    );
  }

  if (status === 'error') {
    return (
      <Shell>
        <Error message={friendlyError(message)} />
        <Link
          href="/dashboard"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl border border-neutral-700 bg-transparent text-neutral-200 text-[13px] font-semibold no-underline"
        >
          Go to dashboard
        </Link>
      </Shell>
    );
  }

  if (status === 'ok') {
    return (
      <Shell>
        <div className="w-20 h-20 rounded-full bg-[#F9250E] flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-10 h-10">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-white text-[26px] font-serif font-bold mb-3">Welcome aboard</h1>
        <p className="text-neutral-400 text-[15px] mb-8 leading-relaxed">
          You've been added{roleGranted && roleGranted !== 'user' ? ` as a ${roleGranted}` : ''}. Your journey starts now.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl bg-[#F9250E] text-white text-[14px] font-bold border-none cursor-pointer"
          style={{ boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
        >
          Go to dashboard →
        </button>
      </Shell>
    );
  }

  return null;
}

function friendlyError(msg: string): string {
  const lower = (msg || '').toLowerCase();
  if (lower.includes('expired')) return 'This invite has expired. Ask whoever invited you to send a new one.';
  if (lower.includes('wrong email') || lower.includes('email mismatch')) return 'This invite was sent to a different email address. Sign in with the invited email.';
  if (lower.includes('already used') || lower.includes('accepted')) return 'This invite has already been used.';
  if (lower.includes('revoked')) return 'This invite was revoked and is no longer valid.';
  if (lower.includes('invalid') || lower.includes('not found')) return 'This invite link is invalid.';
  return msg || 'Something went wrong accepting the invite.';
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center px-6 font-sans">
      <div className="max-w-[480px] w-full text-center">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex items-end gap-[2px]" aria-hidden="true">
            <div className="w-[7px] h-[12px] bg-[#F9250E] rounded-sm" />
            <div className="w-[7px] h-[20px] bg-[#F9250E] rounded-sm" />
            <div className="w-[7px] h-[28px] bg-[#F9250E] rounded-sm" />
          </div>
          <span className="text-white font-serif font-bold text-[18px] tracking-tight">
            equip<span className="text-[#F9250E]">2</span>lead
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-800 bg-red-950/30 px-5 py-4 text-[14px] text-red-200">
      {message}
    </div>
  );
}
