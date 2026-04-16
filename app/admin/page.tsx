'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

const trackColors: Record<string, string> = {
  leadership: '#F9250E', ministry: '#2563EB', marriage: '#DB2777',
  entrepreneur: '#EA580C', personal: '#059669',
};
const trackIcons: Record<string, string> = {
  leadership: '\u{1F451}', ministry: '\u{1F4D6}', marriage: '\u{2764}\uFE0F',
  entrepreneur: '\u{1F680}', personal: '\u{1F331}',
};

type Tab = 'overview' | 'users' | 'content' | 'gaps';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState('');

  // Overview
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [contentStats, setContentStats] = useState<any[]>([]);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Content
  const [tracks, setTracks] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [docForm, setDocForm] = useState({ track_id: '', pillar_id: '', title: '', content: '', language: 'en', difficulty: 'beginner', sub_domain: '', source: '', author: '' });
  const [saving, setSaving] = useState(false);

  // Gaps
  const [gaps, setGaps] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    async function init() {
      const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user!.id).single();
      if (profile?.role !== 'super_admin') {
        router.replace('/dashboard');
        return;
      }
      setAuthorized(true);
      setUserName(profile.full_name || user!.email?.split('@')[0] || 'Admin');
      await loadTab('overview');
    }
    init();
  }, [user?.id]);

  async function loadTab(t: Tab) {
    setLoading(true);
    if (t === 'overview') {
      const [statsRes, cStatsRes] = await Promise.all([
        supabase.rpc('get_platform_stats'),
        supabase.rpc('get_content_stats'),
      ]);
      setPlatformStats(statsRes.data);
      setContentStats(cStatsRes.data || []);
    } else if (t === 'users') {
      const { data } = await supabase.rpc('get_user_overview');
      setUsers(data || []);
    } else if (t === 'content') {
      const [tRes, pRes] = await Promise.all([
        supabase.from('tracks').select('id, slug, name_en').order('sort_order'),
        supabase.from('pillars').select('id, name_en, track_id, sort_order').order('sort_order'),
      ]);
      setTracks(tRes.data || []);
      setPillars(pRes.data || []);
      // Reload content stats for the content tab
      const { data: cs } = await supabase.rpc('get_content_stats');
      setContentStats(cs || []);
    } else if (t === 'gaps') {
      const { data } = await supabase.rpc('get_top_knowledge_gaps', { p_limit: 20 });
      setGaps(data || []);
    }
    setLoading(false);
  }

  function switchTab(t: Tab) {
    setTab(t);
    loadTab(t);
  }

  async function handleSaveDoc() {
    if (!docForm.track_id || !docForm.pillar_id || !docForm.title || !docForm.content) return;
    setSaving(true);
    const res = await fetch('/api/admin/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docForm),
    });
    if (res.ok) {
      const { id } = await res.json();
      // Trigger embedding
      fetch('/api/admin/documents/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      }).catch(() => {});
      setShowAddDoc(false);
      setDocForm({ track_id: '', pillar_id: '', title: '', content: '', language: 'en', difficulty: 'beginner', sub_domain: '', source: '', author: '' });
      loadTab('content');
    }
    setSaving(false);
  }

  function prefillDocFromGap(gap: any) {
    setDocForm({
      track_id: gap.track_id || '',
      pillar_id: '',
      title: gap.query || gap.suggested_topic || '',
      content: '',
      language: 'en',
      difficulty: 'beginner',
      sub_domain: '',
      source: '',
      author: '',
    });
    setShowAddDoc(true);
    setTab('content');
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0C]">
        <div className="w-6 h-6 border-2 border-gray-700 border-t-[#F9250E] rounded-full animate-spin" />
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'content', label: 'Content' },
    { id: 'gaps', label: 'Gaps' },
  ];

  const statCards = platformStats ? [
    { label: 'Total Users', value: platformStats.total_users ?? 0, color: '#2563EB' },
    { label: 'Active Journeys', value: platformStats.active_journeys ?? 0, color: '#059669' },
    { label: 'Completed Journeys', value: platformStats.completed_journeys ?? 0, color: '#7C3AED' },
    { label: 'Lessons Completed', value: platformStats.lessons_completed ?? 0, color: '#D97706' },
    { label: 'Active Streaks', value: platformStats.active_streaks ?? 0, color: '#F9250E' },
    { label: 'Badges Earned', value: platformStats.badges_earned ?? 0, color: '#DB2777' },
    { label: 'Coaching Memories', value: platformStats.coaching_memories ?? 0, color: '#EA580C' },
    { label: 'Knowledge Gaps', value: platformStats.knowledge_gaps ?? 0, color: '#DC2626' },
    { label: 'Weekly Check-ins', value: platformStats.weekly_checkins ?? 0, color: '#0891B2' },
    { label: 'Knowledge Base Docs', value: 298, color: '#6366F1' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0B0B0C]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top nav */}
      <div className="bg-[#111118] border-b border-gray-800 px-8 max-md:px-5 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F9250E] flex items-center justify-center text-[14px] font-extrabold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>E</div>
            <span className="text-[15px] font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif" }}>Equip<span className="text-[#F9250E]">2</span>Lead</span>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <span className="text-[14px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-gray-400">{userName}</span>
          <button onClick={signOut} className="text-[12px] text-gray-500 hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>Log out</button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-[#111118] border-b border-gray-800 px-8 max-md:px-5">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={`px-5 py-3 text-[13px] font-semibold cursor-pointer border-none transition-all ${tab === t.id ? 'text-white border-b-2 border-b-[#F9250E] bg-transparent' : 'text-gray-500 hover:text-gray-300 bg-transparent'}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: tab === t.id ? '2px solid #F9250E' : '2px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 max-md:px-5 py-8">
        {loading && <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-gray-700 border-t-[#F9250E] rounded-full animate-spin" /></div>}

        {/* ═══ OVERVIEW ═══ */}
        {!loading && tab === 'overview' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
              {statCards.map((s, i) => (
                <div key={i} className="bg-[#111118] rounded-2xl border border-gray-800 p-5">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{s.label}</div>
                  <div className="text-[28px] font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
                </div>
              ))}
            </div>

            {contentStats.length > 0 && (
              <div className="bg-[#111118] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Content Coverage</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {['Track', 'Language', 'Total Docs', 'Embedded', '% Complete'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contentStats.map((row: any, i: number) => {
                      const pct = row.total_docs > 0 ? Math.round((row.embedded_count / row.total_docs) * 100) : 0;
                      return (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="px-6 py-3 text-[13px] text-white font-medium">{row.track_name || row.track_slug}</td>
                          <td className="px-6 py-3 text-[13px] text-gray-400">{row.language?.toUpperCase()}</td>
                          <td className="px-6 py-3 text-[13px] text-gray-300">{row.total_docs}</td>
                          <td className="px-6 py-3 text-[13px] text-gray-300">{row.embedded_count}</td>
                          <td className="px-6 py-3">
                            <span className={`text-[13px] font-bold ${pct === 100 ? 'text-green-400' : pct > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {pct === 100 && <span className="mr-1">&#x2705;</span>}
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {!loading && tab === 'users' && (
          <div>
            <div className="relative mb-6">
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-800 bg-[#111118] text-[14px] text-white outline-none focus:border-[#F9250E] transition-all placeholder:text-gray-600"
                style={{ fontFamily: 'inherit' }} />
            </div>
            <div className="bg-[#111118] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {['User', 'Role', 'Track', 'Lang', 'Week', 'Lessons', 'Streak', 'Joined', 'Last Active'].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u: any) => {
                      const roleBadge = u.role === 'super_admin'
                        ? 'bg-amber-900/30 text-amber-400 border border-amber-700'
                        : u.role === 'admin'
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                        : 'bg-gray-800 text-gray-400 border border-gray-700';
                      const trackSlug = u.track_slug || '';
                      const tColor = trackColors[trackSlug] || '#6B7280';
                      return (
                        <tr key={u.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[11px] font-bold text-white">
                                {(u.full_name || u.email || '?').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-white">{u.full_name || 'No name'}</div>
                                <div className="text-[11px] text-gray-500">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${roleBadge}`}>{u.role || 'user'}</span>
                          </td>
                          <td className="px-5 py-4">
                            {trackSlug ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tColor }} />
                                <span className="text-[13px] text-gray-300 capitalize">{trackSlug}</span>
                              </div>
                            ) : <span className="text-[12px] text-gray-600">-</span>}
                          </td>
                          <td className="px-5 py-4"><span className="text-[13px] text-gray-400">{u.preferred_language === 'fr' ? '\u{1F1EB}\u{1F1F7}' : '\u{1F1EC}\u{1F1E7}'}</span></td>
                          <td className="px-5 py-4"><span className="text-[13px] text-gray-400">{u.current_week ? `${u.current_week}/12` : '-'}</span></td>
                          <td className="px-5 py-4"><span className="text-[13px] text-gray-300">{u.lessons_completed ?? 0}</span></td>
                          <td className="px-5 py-4">
                            {(u.current_streak ?? 0) > 0
                              ? <span className="text-[13px] text-orange-400">&#x1F525; {u.current_streak}</span>
                              : <span className="text-[12px] text-gray-600">-</span>}
                          </td>
                          <td className="px-5 py-4"><span className="text-[12px] text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</span></td>
                          <td className="px-5 py-4"><span className="text-[12px] text-gray-500">{u.last_activity ? new Date(u.last_activity).toLocaleDateString() : '-'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && <div className="text-center py-8 text-gray-600 text-[14px]">No users found</div>}
            </div>
          </div>
        )}

        {/* ═══ CONTENT ═══ */}
        {!loading && tab === 'content' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Knowledge Base</h2>
              <button onClick={() => setShowAddDoc(true)}
                className="px-5 py-2.5 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}>
                + Add Document
              </button>
            </div>

            {tracks.map(track => {
              const trackPillars = pillars.filter(p => p.track_id === track.id);
              const trackRows = contentStats.filter((r: any) => (r.track_slug || r.track_name) === track.slug || r.track_slug === track.slug);
              const totalDocs = trackRows.reduce((a: number, r: any) => a + (r.total_docs || 0), 0);
              const embeddedDocs = trackRows.reduce((a: number, r: any) => a + (r.embedded_count || 0), 0);
              return (
                <div key={track.id} className="bg-[#111118] rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[20px]">{trackIcons[track.slug] || '\u{1F4CB}'}</span>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{track.name_en}</h3>
                      <p className="text-[12px] text-gray-500">{totalDocs} docs ({embeddedDocs} embedded)</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {trackPillars.map(p => {
                      const pDocs = contentStats.filter((r: any) => r.pillar_id === p.id);
                      const pTotal = pDocs.reduce((a: number, r: any) => a + (r.total_docs || 0), 0);
                      return (
                        <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-b-0">
                          <span className="text-[13px] text-gray-400 flex-1">{p.name_en}</span>
                          <span className="text-[12px] font-semibold text-gray-500">{pTotal} docs</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ GAPS ═══ */}
        {!loading && tab === 'gaps' && (
          <div>
            <h2 className="text-[18px] font-bold text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top Knowledge Gaps</h2>
            <div className="bg-[#111118] rounded-2xl border border-gray-800 overflow-hidden">
              {gaps.length > 0 ? (
                <div className="flex flex-col">
                  {gaps.map((g: any, i: number) => {
                    const sim = g.similarity ?? 0;
                    const simColor = sim < 0.5 ? '#DC2626' : sim < 0.7 ? '#D97706' : '#059669';
                    const trackSlug = g.track_slug || '';
                    return (
                      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-800/50 last:border-b-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[12px] font-bold text-gray-400 shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-white truncate">{g.query || g.suggested_topic}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {trackSlug && (
                              <span className="text-[11px] text-gray-500 capitalize">{trackIcons[trackSlug] || ''} {trackSlug}</span>
                            )}
                            <span className="text-[11px] text-gray-600">{g.last_asked ? new Date(g.last_asked).toLocaleDateString() : ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-[14px] font-bold text-white">{g.frequency || g.hit_count || 1}x</span>
                            <div className="text-[10px] text-gray-600">asked</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[13px] font-bold" style={{ color: simColor }}>{(sim * 100).toFixed(0)}%</span>
                            <div className="text-[10px] text-gray-600">match</div>
                          </div>
                          <button onClick={() => prefillDocFromGap(g)}
                            className="px-3 py-1.5 rounded-lg border border-gray-700 bg-transparent text-[11px] font-semibold text-gray-400 hover:text-white hover:border-gray-600 cursor-pointer transition-all" style={{ fontFamily: 'inherit' }}>
                            Create Lesson
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">No knowledge gaps logged yet.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Add Document Modal ═══ */}
      {showAddDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setShowAddDoc(false)}>
          <div className="bg-[#111118] rounded-2xl border border-gray-800 p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] font-bold text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add Knowledge Document</h3>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Track *</label>
                  <select value={docForm.track_id} onChange={e => setDocForm(f => ({ ...f, track_id: e.target.value, pillar_id: '' }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }}>
                    <option value="">Select track</option>
                    {tracks.map(t => <option key={t.id} value={t.id}>{t.name_en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Pillar *</label>
                  <select value={docForm.pillar_id} onChange={e => setDocForm(f => ({ ...f, pillar_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }}>
                    <option value="">Select pillar</option>
                    {pillars.filter(p => p.track_id === docForm.track_id).map(p => <option key={p.id} value={p.id}>{p.name_en}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Title *</label>
                <input value={docForm.title} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }} />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Content *</label>
                <textarea value={docForm.content} onChange={e => setDocForm(f => ({ ...f, content: e.target.value }))} rows={8}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none resize-none" style={{ fontFamily: 'inherit' }} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Language</label>
                  <select value={docForm.language} onChange={e => setDocForm(f => ({ ...f, language: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }}>
                    <option value="en">English</option>
                    <option value="fr">Fran\u00e7ais</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Difficulty</label>
                  <select value={docForm.difficulty} onChange={e => setDocForm(f => ({ ...f, difficulty: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Sub-domain</label>
                  <input value={docForm.sub_domain} onChange={e => setDocForm(f => ({ ...f, sub_domain: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Source</label>
                  <input value={docForm.source} onChange={e => setDocForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Author</label>
                  <input value={docForm.author} onChange={e => setDocForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-[#0B0B0C] text-[13px] text-white outline-none" style={{ fontFamily: 'inherit' }} />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={handleSaveDoc} disabled={saving || !docForm.track_id || !docForm.pillar_id || !docForm.title || !docForm.content}
                  className="flex-1 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}>
                  {saving ? 'Saving...' : 'Save & Embed'}
                </button>
                <button onClick={() => setShowAddDoc(false)}
                  className="px-6 py-3 rounded-xl border border-gray-700 bg-transparent cursor-pointer text-[13px] font-semibold text-gray-400 hover:text-white transition-all" style={{ fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
