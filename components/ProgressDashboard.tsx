'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  journeyId: string;
  lang: 'en' | 'fr';
};

type StreakData = {
  current_streak: number;
  longest_streak: number;
};

type PillarProgress = {
  pillar_id: string;
  pillar_name_en: string;
  pillar_name_fr: string;
  pct_complete: number;
  score: number | null;
  sort_order: number;
};

type Badge = {
  id: string;
  emoji: string;
  name_en: string;
  name_fr: string;
  earned_at: string;
};

const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];

const t = (lang: string, en: string, fr: string) => lang === 'fr' ? fr : en;

export default function ProgressDashboard({ journeyId, lang }: Props) {
  const supabase = createClient();
  const [streak, setStreak] = useState<StreakData>({ current_streak: 0, longest_streak: 0 });
  const [pillars, setPillars] = useState<PillarProgress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!journeyId) return;

    async function load() {
      setLoading(true);

      const [progressRes, streakRes, badgesRes] = await Promise.all([
        supabase.rpc('get_journey_progress', { p_journey_id: journeyId }),
        supabase.from('streaks').select('current_streak, longest_streak').eq('journey_id', journeyId).single(),
        supabase
          .from('user_badges')
          .select('earned_at, badges(id, emoji, name_en, name_fr)')
          .eq('journey_id', journeyId)
          .order('earned_at', { ascending: true }),
      ]);

      // Pillar progress + scores
      if (progressRes.data) {
        const rows = (progressRes.data as any[]).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setPillars(rows.map(r => ({
          pillar_id: r.pillar_id,
          pillar_name_en: r.pillar_name_en ?? r.pillar_name ?? 'Pillar',
          pillar_name_fr: r.pillar_name_fr ?? r.pillar_name ?? 'Pilier',
          pct_complete: r.pct_complete ?? 0,
          score: r.score ?? null,
          sort_order: r.sort_order ?? 0,
        })));
      }

      // Streak
      if (streakRes.data) {
        setStreak({
          current_streak: streakRes.data.current_streak ?? 0,
          longest_streak: streakRes.data.longest_streak ?? 0,
        });
      }

      // Badges
      if (badgesRes.data) {
        setBadges(badgesRes.data.map((row: any) => ({
          id: row.badges?.id ?? '',
          emoji: row.badges?.emoji ?? '',
          name_en: row.badges?.name_en ?? '',
          name_fr: row.badges?.name_fr ?? '',
          earned_at: row.earned_at,
        })));
      }

      setLoading(false);
    }

    load();
  }, [journeyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#F9250E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Streak card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[32px] leading-none">&#x1F525;</span>
            <div>
              <p className="text-[24px] font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {streak.current_streak} {t(lang, streak.current_streak === 1 ? 'day' : 'days', streak.current_streak === 1 ? 'jour' : 'jours')}
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                {t(lang, 'Current streak', 'Serie en cours')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-bold text-gray-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {streak.longest_streak}
            </p>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              {t(lang, 'Best', 'Record')}
            </p>
          </div>
        </div>
      </div>

      {/* Pillar progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {t(lang, 'Pillar Progress', 'Progression par pilier')}
        </h3>
        <div className="flex flex-col gap-4">
          {pillars.map((p, i) => {
            const color = pillarColors[i % pillarColors.length];
            return (
              <div key={p.pillar_id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-gray-700">
                    {lang === 'fr' ? p.pillar_name_fr : p.pillar_name_en}
                  </span>
                  <div className="flex items-center gap-3">
                    {p.score !== null && (
                      <span className="text-[12px] font-bold px-2 py-0.5 rounded-md" style={{ color, background: `${color}12` }}>
                        {p.score.toFixed(1)}/5
                      </span>
                    )}
                    <span className="text-[12px] font-semibold text-gray-400">
                      {Math.round(p.pct_complete)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(p.pct_complete, 100)}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
          {pillars.length === 0 && (
            <p className="text-[13px] text-gray-400 text-center py-4">
              {t(lang, 'No pillar data yet', 'Pas encore de donnees')}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {t(lang, 'Badges Earned', 'Badges obtenus')}
        </h3>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                title={lang === 'fr' ? b.name_fr : b.name_en}
              >
                <span className="text-[28px] leading-none">{b.emoji}</span>
                <span className="text-[10px] font-semibold text-gray-500 text-center max-w-[72px] truncate">
                  {lang === 'fr' ? b.name_fr : b.name_en}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400 text-center py-4">
            {t(lang, 'Complete exercises to earn badges!', 'Completez des exercices pour obtenir des badges !')}
          </p>
        )}
      </div>
    </div>
  );
}
