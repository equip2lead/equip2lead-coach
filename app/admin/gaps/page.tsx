'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { trackIcons } from '@/lib/admin/constants';

export default function GapsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('get_top_knowledge_gaps', { p_limit: 20 });
      setGaps(data || []);
      setLoading(false);
    })();
  }, []);

  function createLesson(gap: any) {
    const query = gap.query || gap.suggested_topic || '';
    router.push(`/admin/content?prefill_title=${encodeURIComponent(query)}&prefill_track=${gap.track_id || ''}`);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 max-md:px-5 py-8">
      <h1 className="text-[22px] font-bold text-white mb-6">Top Knowledge Gaps</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#111118] rounded-2xl border border-neutral-800 overflow-hidden">
          {gaps.length > 0 ? (
            <div className="flex flex-col">
              {gaps.map((g: any, i: number) => {
                const sim = g.similarity ?? 0;
                const simColor = sim < 0.5 ? '#DC2626' : sim < 0.7 ? '#D97706' : '#059669';
                const trackSlug = g.track_slug || '';
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-neutral-800/50 last:border-b-0">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-[12px] font-bold text-neutral-400 shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-white truncate">{g.query || g.suggested_topic}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {trackSlug && (
                          <span className="text-[11px] text-neutral-500 capitalize">
                            {trackIcons[trackSlug] || ''} {trackSlug}
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-600">
                          {g.last_asked ? new Date(g.last_asked).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[14px] font-bold text-white">{g.frequency || g.hit_count || 1}x</span>
                        <div className="text-[10px] text-neutral-600">asked</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[13px] font-bold" style={{ color: simColor }}>
                          {(sim * 100).toFixed(0)}%
                        </span>
                        <div className="text-[10px] text-neutral-600">match</div>
                      </div>
                      <button
                        onClick={() => createLesson(g)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-transparent text-[11px] font-semibold text-neutral-400 hover:text-white hover:border-neutral-600 cursor-pointer transition-all"
                      >
                        Create Lesson
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-600">No knowledge gaps logged yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
