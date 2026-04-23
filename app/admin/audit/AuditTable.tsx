'use client';

import { useMemo } from 'react';
import { relativeTime } from '@/lib/admin/constants';

type Row = {
  id: string;
  created_at: string;
  action: string;
  actor_id: string | null;
  actor_email: string | null;
  target_user_id: string | null;
  target_email: string | null;
  details: any;
};

const actionColor: Record<string, string> = {
  user_deleted: 'bg-red-900/40 text-red-300 border-red-700',
  user_banned: 'bg-orange-900/40 text-orange-300 border-orange-700',
  user_unbanned: 'bg-blue-900/40 text-blue-300 border-blue-700',
  role_changed: 'bg-amber-900/40 text-amber-300 border-amber-700',
  invite_created: 'bg-blue-900/40 text-blue-300 border-blue-700',
  invite_sent: 'bg-blue-900/30 text-blue-200 border-blue-800',
  invite_accepted: 'bg-green-900/40 text-green-300 border-green-700',
  invite_revoked: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  viewed: 'bg-neutral-800 text-neutral-400 border-neutral-700',
};

function formatDetails(action: string, details: any): string {
  if (!details) return '—';
  switch (action) {
    case 'role_changed':
      return `${details.old_role || '?'} → ${details.new_role || '?'}`;
    case 'user_banned':
      if (details.duration_days === null || details.duration_days === undefined) {
        return details.reason ? `Banned indefinitely: ${details.reason}` : 'Banned indefinitely';
      }
      return details.reason
        ? `Banned for ${details.duration_days} days: ${details.reason}`
        : `Banned for ${details.duration_days} days`;
    case 'user_unbanned':
      return 'Unbanned';
    case 'user_deleted':
      return details.reason ? `Reason: ${details.reason}` : 'Deleted';
    case 'invite_created':
      return `Invited as ${details.role || 'user'}`;
    case 'invite_sent':
      return details.email_id ? `Email id: ${details.email_id}` : 'Sent';
    case 'invite_accepted':
      return details.invited_by_email
        ? `Accepted (invited by ${details.invited_by_email})`
        : 'Accepted';
    case 'invite_revoked':
      return 'Revoked invite';
    default:
      try {
        return JSON.stringify(details);
      } catch {
        return String(details);
      }
  }
}

function toCsv(rows: Row[]): string {
  const header = ['created_at', 'action', 'actor_email', 'target_email', 'details'];
  const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.created_at,
        r.action,
        r.actor_email,
        r.target_email,
        formatDetails(r.action, r.details),
      ]
        .map(escape)
        .join(',')
    );
  }
  return lines.join('\n');
}

export function AuditTable({ rows }: { rows: Row[] }) {
  const csv = useMemo(() => toCsv(rows), [rows]);

  function exportCsv() {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={exportCsv}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 hover:text-white hover:border-neutral-500 cursor-pointer transition-colors"
        >
          Export CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="bg-[#111118] border border-neutral-800 rounded-2xl px-6 py-12 text-center text-neutral-500 text-[14px]">
          No audit entries yet.
        </div>
      ) : (
        <div className="bg-[#111118] rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['When', 'Action', 'Actor', 'Target', 'Details'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const colorClass = actionColor[r.action] || 'bg-neutral-800 text-neutral-300 border-neutral-700';
                  return (
                    <tr key={r.id} className="border-b border-neutral-800/50">
                      <td className="px-5 py-3 text-[12px] text-neutral-400 whitespace-nowrap">
                        {relativeTime(r.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
                          {r.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-neutral-300">{r.actor_email || '—'}</td>
                      <td className="px-5 py-3 text-[12px] text-neutral-300">{r.target_email || '—'}</td>
                      <td className="px-5 py-3 text-[12px] text-neutral-400">{formatDetails(r.action, r.details)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
