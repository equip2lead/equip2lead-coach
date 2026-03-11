'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

/* ── Icons ── */
const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const GridIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const ChartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;

const trackColors: Record<string, string> = {
  leadership: '#F9250E', ministry: '#2563EB', marriage: '#DB2777',
  entrepreneur: '#EA580C', personal: '#059669',
};

const trackIcons: Record<string, string> = {
  leadership: '👑', ministry: '📖', marriage: '❤️',
  entrepreneur: '🚀', personal: '🌱',
};

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  journey_count: number;
  journeys: { track_slug: string; status: string; current_week: number; pillar_count: number; overall_score: number | null }[];
};

type TrackStat = {
  slug: string;
  name_en: string;
  user_count: number;
  avg_score: number;
  completed: number;
  active: number;
};

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<'users' | 'tracks' | 'analytics'>('users');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [trackStats, setTrackStats] = useState<TrackStat[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ users: 0, journeys: 0, responses: 0, checkins: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Get all profiles
    const { data: profiles } = await supabase
      .from('profiles').select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false });

    // Get all journeys with track info and scores
    const { data: journeys } = await supabase
      .from('journeys').select('id, user_id, track_id, status, current_week, tracks(slug, name_en)')
      .order('started_at', { ascending: false });

    // Get all pillar scores
    const { data: allScores } = await supabase
      .from('pillar_scores').select('journey_id, score');

    // Get all tracks
    const { data: tracks } = await supabase
      .from('tracks').select('id, slug, name_en').order('sort_order');

    // Count responses and checkins
    const { count: responseCount } = await supabase.from('responses').select('id', { count: 'exact', head: true });
    const { count: checkinCount } = await supabase.from('weekly_checkins').select('id', { count: 'exact', head: true });

    // Build user rows
    const userRows: UserRow[] = (profiles || []).map(p => {
      const userJourneys = (journeys || []).filter(j => j.user_id === p.id);
      const jData = userJourneys.map(j => {
        const jScores = (allScores || []).filter(s => s.journey_id === j.id);
        const avg = jScores.length > 0 ? jScores.reduce((a, s) => a + Number(s.score), 0) / jScores.length : null;
        return {
          track_slug: (j.tracks as any)?.slug || 'unknown',
          status: j.status || 'active',
          current_week: j.current_week || 1,
          pillar_count: jScores.length,
          overall_score: avg,
        };
      });
      return {
        id: p.id, email: p.email, full_name: p.full_name,
        role: p.role || 'user', created_at: p.created_at,
        journey_count: userJourneys.length, journeys: jData,
      };
    });

    // Build track stats
    const tStats: TrackStat[] = (tracks || []).map(t => {
      const tJourneys = (journeys || []).filter(j => j.track_id === t.id);
      const tScores = tJourneys.flatMap(j => (allScores || []).filter(s => s.journey_id === j.id));
      const avg = tScores.length > 0 ? tScores.reduce((a, s) => a + Number(s.score), 0) / tScores.length : 0;
      return {
        slug: t.slug, name_en: t.name_en,
        user_count: tJourneys.length,
        avg_score: avg,
        completed: tJourneys.filter(j => j.status === 'completed' || j.status === 'plan_generated').length,
        active: tJourneys.filter(j => j.status === 'active').length,
      };
    });

    setUsers(userRows);
    setTrackStats(tStats);
    setTotals({
      users: profiles?.length || 0,
      journeys: journeys?.length || 0,
      responses: responseCount || 0,
      checkins: checkinCount || 0,
    });
    setLoading(false);
  }

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 max-md:px-5 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 no-underline transition-colors">
            <BackIcon /> Dashboard
          </Link>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-[14px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
            <div>
              <h1 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Dashboard</h1>
              <p className="text-[11px] text-gray-400">Equip2Lead Platform</p>
            </div>
          </div>
        </div>
        <button onClick={signOut} className="text-[13px] text-gray-500 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>Log out</button>
      </div>

      {/* Stats Row */}
      <div className="max-w-[1200px] mx-auto px-8 max-md:px-5 py-8">
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Total Users', value: totals.users, color: '#2563EB' },
            { label: 'Active Journeys', value: totals.journeys, color: '#059669' },
            { label: 'Responses', value: totals.responses.toLocaleString(), color: '#7C3AED' },
            { label: 'Check-ins', value: totals.checkins, color: '#D97706' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-[28px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { id: 'users' as const, label: 'Users', icon: <UsersIcon /> },
            { id: 'tracks' as const, label: 'Tracks', icon: <GridIcon /> },
            { id: 'analytics' as const, label: 'Analytics', icon: <ChartIcon /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[10px] text-[13px] font-semibold cursor-pointer transition-all border-none ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 text-gray-400">Loading admin data...</div>}

        {/* ═══ Users Tab ═══ */}
        {!loading && tab === 'users' && (
          <div>
            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[14px] text-gray-900 outline-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.06)] transition-all placeholder:text-gray-400"
                style={{ fontFamily: 'inherit' }} />
            </div>

            {/* User Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Track</th>
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pillars</th>
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Week</th>
                      <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const j = u.journeys[0];
                      return (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[11px] font-bold text-white">
                                {u.full_name ? u.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : u.email.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-[13.5px] font-semibold text-gray-900">{u.full_name || 'No name'}</div>
                                <div className="text-[11.5px] text-gray-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                              className={`text-[12px] font-semibold px-2.5 py-1 rounded-full border-none cursor-pointer ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'coach' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                              style={{ fontFamily: 'inherit' }}>
                              <option value="user">User</option>
                              <option value="coach">Coach</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-5 py-4">
                            {j ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[14px]">{trackIcons[j.track_slug] || '📋'}</span>
                                <span className="text-[13px] text-gray-700 capitalize">{j.track_slug}</span>
                              </div>
                            ) : <span className="text-[12px] text-gray-300">No track</span>}
                          </td>
                          <td className="px-5 py-4">
                            {j ? <span className="text-[13px] font-semibold text-gray-700">{j.pillar_count}/5</span> : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-5 py-4">
                            {j?.overall_score ? (
                              <span className="text-[13px] font-bold" style={{ color: j.overall_score >= 3.5 ? '#059669' : j.overall_score >= 2.5 ? '#D97706' : '#DC2626' }}>
                                {j.overall_score.toFixed(1)}
                              </span>
                            ) : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-5 py-4">
                            {j ? <span className="text-[13px] text-gray-600">{j.current_week}/12</span> : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[12px] text-gray-400">{new Date(u.created_at).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && <div className="text-center py-8 text-gray-400 text-[14px]">No users found</div>}
            </div>
          </div>
        )}

        {/* ═══ Tracks Tab ═══ */}
        {!loading && tab === 'tracks' && (
          <div className="grid grid-cols-1 gap-4">
            {trackStats.map(t => (
              <div key={t.slug} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px]" style={{ background: `${trackColors[t.slug]}10` }}>
                    {trackIcons[t.slug] || '📋'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[17px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name_en}</h3>
                    <p className="text-[13px] text-gray-500">{t.user_count} {t.user_count === 1 ? 'user' : 'users'} enrolled</p>
                  </div>
                  {t.avg_score > 0 && (
                    <div className="text-right">
                      <div className="text-[24px] font-extrabold" style={{ color: trackColors[t.slug] }}>{t.avg_score.toFixed(1)}</div>
                      <div className="text-[11px] text-gray-400">avg score</div>
                    </div>
                  )}
                </div>
                <div className="flex gap-6">
                  <div>
                    <span className="text-[20px] font-bold text-green-600">{t.completed}</span>
                    <span className="text-[12px] text-gray-400 ml-1">completed</span>
                  </div>
                  <div>
                    <span className="text-[20px] font-bold text-blue-600">{t.active}</span>
                    <span className="text-[12px] text-gray-400 ml-1">active</span>
                  </div>
                </div>
                {t.user_count > 0 && (
                  <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(t.avg_score / 5) * 100}%`, background: trackColors[t.slug], transition: 'width 0.8s ease' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══ Analytics Tab ═══ */}
        {!loading && tab === 'analytics' && (
          <div className="flex flex-col gap-6">
            {/* Score Distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Score Distribution by Track</h3>
              <div className="flex flex-col gap-3">
                {trackStats.filter(t => t.user_count > 0).map(t => (
                  <div key={t.slug} className="flex items-center gap-3">
                    <span className="text-[14px] w-6">{trackIcons[t.slug]}</span>
                    <span className="text-[13px] text-gray-700 w-32 truncate capitalize">{t.slug}</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(t.avg_score / 5) * 100}%`, background: trackColors[t.slug] }} />
                    </div>
                    <span className="text-[13px] font-bold w-10 text-right" style={{ color: trackColors[t.slug] }}>{t.avg_score > 0 ? t.avg_score.toFixed(1) : '-'}</span>
                    <span className="text-[11px] text-gray-400 w-16 text-right">{t.user_count} users</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Platform Overview</h3>
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Completion Rate</div>
                  <div className="text-[28px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {totals.journeys > 0 ? `${Math.round((trackStats.reduce((a, t) => a + t.completed, 0) / totals.journeys) * 100)}%` : '0%'}
                  </div>
                  <div className="text-[12px] text-gray-500">of journeys have generated plans</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Responses/User</div>
                  <div className="text-[28px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {totals.users > 0 ? Math.round(totals.responses / totals.users) : 0}
                  </div>
                  <div className="text-[12px] text-gray-500">questions answered per user</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Most Popular Track</div>
                  <div className="text-[20px] font-extrabold text-gray-900 capitalize" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {trackStats.sort((a, b) => b.user_count - a.user_count)[0]?.slug || 'None'}
                  </div>
                  <div className="text-[12px] text-gray-500">{trackStats[0]?.user_count || 0} users enrolled</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Engagement</div>
                  <div className="text-[28px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {totals.checkins}
                  </div>
                  <div className="text-[12px] text-gray-500">weekly check-ins completed</div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Signups</h3>
              <div className="flex flex-col gap-3">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[11px] font-bold text-white">
                      {u.full_name ? u.full_name[0].toUpperCase() : u.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-gray-900 truncate">{u.full_name || u.email}</div>
                      <div className="text-[11px] text-gray-400">{new Date(u.created_at).toLocaleDateString()}</div>
                    </div>
                    {u.journeys[0] && (
                      <span className="text-[12px]">{trackIcons[u.journeys[0].track_slug]} {u.journeys[0].track_slug}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
