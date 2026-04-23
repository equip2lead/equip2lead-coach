'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { roleBadgeClass, tierBadgeClass, relativeTime, trackColors } from '@/lib/admin/constants';

type Props = {
  userId: string | null;
  onClose: () => void;
};

export function UserDetailDrawer({ userId, onClose }: Props) {
  const supabase = createClient();
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const { data, error } = await supabase.rpc('admin_get_user_detail', { target_id: userId });
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setDetail(data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) return null;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const profile = detail?.profile;
  const auth = detail?.auth;
  const journeys: any[] = detail?.journeys || [];
  const pillarScores: any[] = detail?.pillar_scores || [];

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute top-0 right-0 h-full w-full md:w-[480px] bg-[#111118] border-l border-neutral-800 overflow-y-auto animate-[slideIn_0.2s_ease]">
        <div className="sticky top-0 z-10 bg-[#111118] border-b border-neutral-800 px-5 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-white">User detail</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white bg-transparent border-none cursor-pointer p-1"
            aria-label="Close drawer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-[13px] text-red-200">
              {error}
            </div>
          ) : !detail ? null : (
            <div className="flex flex-col gap-5">
              <Section title="Profile">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-[14px] font-bold text-white shrink-0">
                    {(profile?.full_name || profile?.email || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-white">{profile?.full_name || 'No name'}</div>
                    <div className="text-[12px] text-neutral-400 truncate">{profile?.email}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadgeClass[profile?.role || 'user']}`}>
                        {profile?.role || 'user'}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {profile?.preferred_language === 'fr' ? '🇫🇷 French' : '🇬🇧 English'}
                      </span>
                    </div>
                  </div>
                </div>
                <KV k="Joined" v={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'} />
              </Section>

              <Section title="Authentication">
                <KV k="Last sign-in" v={relativeTime(auth?.last_sign_in_at)} />
                <KV
                  k="Email confirmed"
                  v={auth?.email_confirmed_at ? <span className="text-green-400">✓ Yes</span> : <span className="text-red-400">✗ No</span>}
                />
                <KV
                  k="Banned until"
                  v={
                    auth?.banned_until && new Date(auth.banned_until) > new Date() ? (
                      <span className="text-red-400 font-semibold">{new Date(auth.banned_until).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )
                  }
                />
                <KV k="Provider" v={auth?.app_metadata?.provider || 'email'} />
              </Section>

              <Section title="Subscription">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tierBadgeClass[profile?.subscription_tier || 'free']}`}>
                    {profile?.subscription_tier || 'free'}
                  </span>
                  {profile?.subscription_status && (
                    <span className="text-[11px] text-neutral-400">{profile.subscription_status}</span>
                  )}
                </div>
                {profile?.stripe_customer_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">Stripe ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] text-neutral-300 font-mono">
                        {profile.stripe_customer_id.slice(0, 14)}…
                      </code>
                      <button
                        onClick={() => copy(profile.stripe_customer_id)}
                        className="text-[10px] text-neutral-400 hover:text-white bg-neutral-800 border-none px-2 py-0.5 rounded cursor-pointer"
                      >
                        {copied ? '✓' : 'copy'}
                      </button>
                    </div>
                  </div>
                )}
                <KV
                  k="Period ends"
                  v={
                    profile?.subscription_current_period_end
                      ? new Date(profile.subscription_current_period_end).toLocaleDateString()
                      : '—'
                  }
                />
              </Section>

              <Section title="Coaching Activity">
                {journeys.length === 0 ? (
                  <div className="text-[12px] text-neutral-500">No journeys yet</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {journeys.map((j: any, i: number) => {
                      const tColor = trackColors[j.track_slug] || '#6B7280';
                      const pct = ((j.current_week || 0) / 12) * 100;
                      return (
                        <div key={i} className="rounded-xl border border-neutral-800 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: tColor }} />
                            <span className="text-[13px] font-semibold text-white capitalize">{j.track_slug}</span>
                            <span className="text-[10px] text-neutral-500 ml-auto">{j.status}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400 mb-1">
                            Week {j.current_week || 0} of 12
                          </div>
                          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F9250E]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 pt-3 border-t border-neutral-800">
                  <KV k="Pillars scored" v={pillarScores.length} />
                  <KV k="Lessons" v={detail?.lessons_completed ?? 0} />
                  <KV k="Messages" v={detail?.messages_count ?? 0} />
                  <KV k="Memories" v={detail?.memories_count ?? 0} />
                  <KV k="Streak" v={(detail?.current_streak ?? 0) + ' days'} />
                </div>
              </Section>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(12px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0B0B0C] p-4">
      <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">{title}</h4>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-neutral-500">{k}</span>
      <span className="text-neutral-200">{v}</span>
    </div>
  );
}
