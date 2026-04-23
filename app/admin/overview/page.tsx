'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function OverviewPage() {
  const supabase = createClient();
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [contentStats, setContentStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [statsRes, cStatsRes] = await Promise.all([
        supabase.rpc('get_platform_stats'),
        supabase.rpc('get_content_stats'),
      ]);
      setPlatformStats(statsRes.data);
      setContentStats(cStatsRes.data || []);
      setLoading(false);
    })();
  }, []);

  const statCards = platformStats
    ? [
        { label: 'Total Users', value: platformStats.total_users ?? 0 },
        { label: 'Active Journeys', value: platformStats.active_journeys ?? 0 },
        { label: 'Completed Journeys', value: platformStats.completed_journeys ?? 0 },
        { label: 'Lessons Completed', value: platformStats.lessons_completed ?? 0 },
        { label: 'Active Streaks', value: platformStats.active_streaks ?? 0 },
        { label: 'Badges Earned', value: platformStats.badges_earned ?? 0 },
        { label: 'Coaching Memories', value: platformStats.coaching_memories ?? 0 },
        { label: 'Knowledge Gaps', value: platformStats.knowledge_gaps ?? 0 },
        { label: 'Weekly Check-ins', value: platformStats.weekly_checkins ?? 0 },
      ]
    : [];

  return (
    <div className="max-w-[1200px] mx-auto px-8 max-md:px-5 py-8">
      <h1 className="text-[22px] font-bold text-white mb-6">Overview</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="bg-[#111118] rounded-2xl border border-neutral-800 p-5">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">{s.label}</div>
                <div className="text-[28px] font-extrabold text-white">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </div>
              </div>
            ))}
          </div>

          {contentStats.length > 0 && (
            <div className="bg-[#111118] rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800">
                <h3 className="text-[15px] font-bold text-white">Content Coverage</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      {['Track', 'Language', 'Total Docs', 'Embedded', '% Complete'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contentStats.map((row: any, i: number) => {
                      const pct = row.total_docs > 0 ? Math.round((row.embedded_count / row.total_docs) * 100) : 0;
                      return (
                        <tr key={i} className="border-b border-neutral-800/50">
                          <td className="px-6 py-3 text-[13px] text-white font-medium">{row.track_name || row.track_slug}</td>
                          <td className="px-6 py-3 text-[13px] text-neutral-400">{row.language?.toUpperCase()}</td>
                          <td className="px-6 py-3 text-[13px] text-neutral-300">{row.total_docs}</td>
                          <td className="px-6 py-3 text-[13px] text-neutral-300">{row.embedded_count}</td>
                          <td className="px-6 py-3">
                            <span className={`text-[13px] font-bold ${pct === 100 ? 'text-green-400' : pct > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
