'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ToastProvider, useToast } from '@/components/admin/Toast';
import { Modal } from '@/components/admin/Modal';
import { relativeTime } from '@/lib/admin/constants';

type Filter = 'pending' | 'accepted' | 'revoked' | 'expired' | 'all';

export default function InvitesPageWrapper() {
  return (
    <ToastProvider>
      <InvitesPage />
    </ToastProvider>
  );
}

function InvitesPage() {
  const supabase = createClient();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const [filter, setFilter] = useState<Filter>('pending');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<any | null>(null);
  const [revoking, setRevoking] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('admin_list_invites', {
      filter_status: filter,
      limit_n: 200,
      offset_n: 0,
    });
    if (error) {
      showToast('error', error.message);
      setLoading(false);
      return;
    }
    setRows(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);

    const { data, error } = await supabase.rpc('admin_create_invite', {
      target_email: email.trim(),
      target_role: role,
      message: message.trim() || null,
    });
    if (error) {
      setSending(false);
      showToast('error', error.message);
      return;
    }

    const resp = await fetch('/api/admin/invites/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invite_id: data.invite_id,
        email: data.email,
        role,
        message: message.trim() || null,
      }),
    });

    setSending(false);

    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}));
      showToast('error', body.error || 'Email send failed — invite created but not emailed');
    } else {
      showToast('success', `Invite sent to ${data.email}`);
      setEmail('');
      setMessage('');
      setRole('user');
    }
    fetchRows();
  }

  async function copyLink(id: string) {
    const url = `https://app.equip2lead.coach/accept-invite?id=${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast('error', 'Clipboard unavailable');
    }
  }

  async function handleRevoke() {
    if (!revokeTarget) return;
    setRevoking(true);
    const { error } = await supabase.rpc('admin_revoke_invite', { invite_id: revokeTarget.id });
    setRevoking(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', 'Invite revoked');
    setRevokeTarget(null);
    fetchRows();
  }

  return (
    <div className="max-w-[1100px] mx-auto px-8 max-md:px-5 py-8">
      <h1 className="text-[22px] font-bold text-white mb-6">Invites</h1>

      <form
        onSubmit={handleSend}
        className="bg-[#111118] border border-neutral-800 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-start"
      >
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 md:col-span-2">
          <label className="text-[12px] text-neutral-400">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="person@example.com"
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none focus:border-[#F9250E]"
            />
          </label>
          <label className="text-[12px] text-neutral-400">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
            >
              <option value="user">User</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <label className="text-[12px] text-neutral-400 md:col-span-2">
          Personal message (optional)
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Looking forward to having you on the platform."
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none resize-none"
          />
        </label>
        <button
          type="submit"
          disabled={sending}
          className="self-end px-5 py-2.5 rounded-xl bg-[#F9250E] text-white text-[13px] font-bold border-none cursor-pointer disabled:opacity-60 md:row-span-2"
        >
          {sending ? 'Sending…' : 'Send invite →'}
        </button>
      </form>

      <div className="flex gap-1 mb-4 bg-[#111118] border border-neutral-800 rounded-xl p-1 w-fit flex-wrap">
        {(['pending', 'accepted', 'revoked', 'expired', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-colors border-none cursor-pointer ${
              filter === f ? 'bg-[#F9250E]/15 text-white' : 'text-neutral-400 hover:text-white bg-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-[14px]">No invites.</div>
      ) : (
        <div className="bg-[#111118] border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['Email', 'Role', 'Invited by', 'Sent', 'Expires', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => {
                  const expired = r.expires_at && new Date(r.expires_at) < new Date() && r.status === 'pending';
                  const effectiveStatus = expired ? 'expired' : r.status;
                  return (
                    <tr key={r.id} className="border-b border-neutral-800/50">
                      <td className="px-5 py-3 text-[13px] text-white">{r.email}</td>
                      <td className="px-5 py-3 text-[12px] text-neutral-300 capitalize">{r.invited_role}</td>
                      <td className="px-5 py-3 text-[12px] text-neutral-400">{r.invited_by_email || '—'}</td>
                      <td className="px-5 py-3 text-[12px] text-neutral-400 whitespace-nowrap">{r.sent_at ? relativeTime(r.sent_at) : 'not sent'}</td>
                      <td className="px-5 py-3 text-[12px] text-neutral-400 whitespace-nowrap">
                        {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill status={effectiveStatus} />
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {r.status === 'pending' && !expired && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => copyLink(r.id)}
                              className="text-[11px] px-2.5 py-1 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 cursor-pointer"
                            >
                              {copiedId === r.id ? 'Copied ✓' : 'Copy link'}
                            </button>
                            <button
                              onClick={() => setRevokeTarget(r)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-red-900/40 text-red-300 border-none cursor-pointer"
                            >
                              Revoke
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!revokeTarget} onClose={() => setRevokeTarget(null)} title="Revoke invite" width="sm">
        <p className="text-[13px] text-neutral-300 mb-4">
          Revoke the pending invite for <strong>{revokeTarget?.email}</strong>? The link will stop working.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setRevokeTarget(null)} className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 cursor-pointer">
            Cancel
          </button>
          <button
            disabled={revoking}
            onClick={handleRevoke}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold cursor-pointer disabled:opacity-60"
          >
            {revoking ? 'Revoking…' : 'Revoke'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-900/30 text-amber-300 border-amber-700',
    accepted: 'bg-green-900/30 text-green-300 border-green-700',
    revoked: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    expired: 'bg-red-900/30 text-red-300 border-red-700',
  };
  const cls = map[status] || 'bg-neutral-800 text-neutral-400 border-neutral-700';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>{status}</span>;
}
