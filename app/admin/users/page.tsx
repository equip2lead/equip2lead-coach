'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { roleBadgeClass, tierBadgeClass, relativeTime, trackColors } from '@/lib/admin/constants';

export default function UsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('admin_list_users', {
        search: null,
        filter_role: null,
        filter_tier: null,
        limit_n: 100,
        offset_n: 0,
      });
      setUsers(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = users.filter(
    (u: any) =>
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-8 max-md:px-5 py-8">
      <h1 className="text-[22px] font-bold text-white mb-6">Users</h1>

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-[#111118] text-[14px] text-white outline-none focus:border-[#F9250E] transition-all placeholder:text-neutral-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#111118] rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['User', 'Role', 'Tier', 'Track', 'Week', 'Streak', 'Last Active'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: any) => {
                  const role = u.role || 'user';
                  const tier = u.subscription_tier || 'free';
                  const trackSlug = u.track_slug || '';
                  const tColor = trackColors[trackSlug] || '#6B7280';
                  return (
                    <tr key={u.user_id} className="border-b border-neutral-800/50 hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-white">
                            {(u.full_name || u.email || '?').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-white">{u.full_name || 'No name'}</div>
                            <div className="text-[11px] text-neutral-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${roleBadgeClass[role]}`}>{role}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tierBadgeClass[tier]}`}>{tier}</span>
                      </td>
                      <td className="px-5 py-4">
                        {trackSlug ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: tColor }} />
                            <span className="text-[13px] text-neutral-300 capitalize">{trackSlug}</span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[13px] text-neutral-400">{u.current_week ? `${u.current_week}/12` : '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        {(u.current_streak ?? 0) > 0 ? (
                          <span className="text-[13px] text-orange-400">🔥 {u.current_streak}</span>
                        ) : (
                          <span className="text-[12px] text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] text-neutral-500">{relativeTime(u.last_activity)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-neutral-600 text-[14px]">No users found</div>}
        </div>
      )}
    </div>
  );
}
