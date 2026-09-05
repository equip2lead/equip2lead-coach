'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ScorecardBlock } from '@/lib/lesson-blocks';

type Latest = { score: number; score_max: number; created_at: string };

const DEBOUNCE_MS = 500;

function formatDate(iso: string, lang: 'en' | 'fr') {
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function Scorecard({
  block, moduleId, journeyId, lang,
}: {
  block: ScorecardBlock;
  moduleId: string;
  journeyId: string | null;
  lang: 'en' | 'fr';
}) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [latest, setLatest] = useState<Record<string, Latest>>({});
  const [values, setValues] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // One timer per item, so dragging one slider never cancels another's pending
  // write.
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoaded(true); return; }
      setUserId(user.id);

      // Newest first, then keep the first row seen per item: that is the
      // "latest score for this item" the index exists to serve.
      const { data } = await supabase
        .from('lesson_scorecard_ratings')
        .select('item_key, score, score_max, created_at')
        .eq('user_id', user.id)
        .eq('lesson_module_id', moduleId)
        .eq('scorecard_key', block.scorecard_key)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      const newest: Record<string, Latest> = {};
      for (const row of data ?? []) {
        const r = row as unknown as { item_key: string } & Latest;
        if (!newest[r.item_key]) {
          newest[r.item_key] = { score: r.score, score_max: r.score_max, created_at: r.created_at };
        }
      }
      setLatest(newest);
      setValues(Object.fromEntries(Object.entries(newest).map(([k, v]) => [k, v.score])));
      setLoaded(true);
    }

    load();
    return () => {
      cancelled = true;
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [moduleId, block.scorecard_key]);

  const commit = useCallback(
    async (itemKey: string, score: number, max: number) => {
      if (!userId) return;

      // The table is append-only, so every write is permanent history. Writing
      // a value identical to the one already recorded would turn a record of
      // what someone decided into a log of them touching a slider, so an
      // unchanged score is simply not written.
      if (latest[itemKey]?.score === score) return;

      setSaving((s) => ({ ...s, [itemKey]: true }));
      const { error } = await supabase.from('lesson_scorecard_ratings').insert({
        user_id: userId,
        lesson_module_id: moduleId,
        scorecard_key: block.scorecard_key,
        item_key: itemKey,
        score,
        score_max: max,
        journey_id: journeyId,
      });
      setSaving((s) => ({ ...s, [itemKey]: false }));

      if (!error) {
        setLatest((l) => ({
          ...l,
          [itemKey]: { score, score_max: max, created_at: new Date().toISOString() },
        }));
      }
    },
    [userId, latest, moduleId, block.scorecard_key, journeyId]
  );

  const onChange = (itemKey: string, score: number, max: number) => {
    setValues((v) => ({ ...v, [itemKey]: score }));
    clearTimeout(timers.current[itemKey]);
    // Debounced on the settled value: dragging 1 -> 8 records 8, not every
    // number in between.
    timers.current[itemKey] = setTimeout(() => commit(itemKey, score, max), DEBOUNCE_MS);
  };

  return (
    <section className="my-10 rounded-2xl border border-gray-200 bg-white p-6 max-md:p-5 shadow-sm">
      <h3
        className="text-[19px] font-bold text-gray-900 mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {block.title}
      </h3>
      <p className="text-[13px] text-gray-500 mb-6">
        {block.instruction ??
          (lang === 'en'
            ? 'Rate yourself honestly. Your answers are private and save automatically.'
            : 'Évaluez-vous honnêtement. Vos réponses sont privées et enregistrées automatiquement.')}
      </p>

      <div className="flex flex-col gap-6">
        {block.items.map((item) => {
          const min = item.min ?? 1;
          const max = item.max;
          const prior = latest[item.key];
          const value = values[item.key] ?? prior?.score ?? Math.ceil((min + max) / 2);
          const pct = ((value - min) / (max - min)) * 100;

          return (
            <div key={item.key}>
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <label
                  htmlFor={`sc-${block.scorecard_key}-${item.key}`}
                  className="text-[14.5px] font-semibold text-gray-800"
                >
                  {item.label}
                </label>
                <span
                  className="text-[15px] font-bold tabular-nums text-[#F9250E]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {loaded ? value : '—'}<span className="text-gray-400 font-medium">/{max}</span>
                </span>
              </div>

              <input
                id={`sc-${block.scorecard_key}-${item.key}`}
                type="range"
                min={min}
                max={max}
                step={1}
                value={value}
                disabled={!loaded}
                onChange={(e) => onChange(item.key, Number(e.target.value), max)}
                aria-describedby={prior ? `sc-hint-${block.scorecard_key}-${item.key}` : undefined}
                className="w-full h-1.5 appearance-none rounded-full bg-gray-200 accent-[#F9250E] cursor-pointer disabled:cursor-wait"
                style={{
                  background: `linear-gradient(to right, #F9250E 0%, #F9250E ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
                }}
              />

              <div className="mt-1.5 flex items-center justify-between gap-3 min-h-[16px]">
                <span
                  id={`sc-hint-${block.scorecard_key}-${item.key}`}
                  className="text-[11.5px] text-gray-400"
                >
                  {item.helpText ??
                    (prior
                      ? `${lang === 'en' ? 'Last rated' : 'Dernière évaluation'} ${formatDate(prior.created_at, lang)}: ${prior.score}/${prior.score_max}`
                      : '')}
                </span>
                {saving[item.key] && (
                  <span className="text-[11.5px] text-gray-400">
                    {lang === 'en' ? 'Saving…' : 'Enregistrement…'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
