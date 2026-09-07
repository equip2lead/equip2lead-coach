'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ModuleCard } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

// pillars.color is null for every row, so colour comes from sort order — the
// same five the rest of the app already uses.
const PILLAR_COLORS = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];
const pillarColor = (sortOrder: number | null) =>
  PILLAR_COLORS[((sortOrder ?? 1) - 1) % PILLAR_COLORS.length];

type Status = ModuleCard['status'];
const ALL_STATUSES: Status[] = ['in_progress', 'not_started', 'completed'];

/** Filters live in the URL so a filtered view can be returned to, shared, or
    reloaded without resetting — the grid is a place, not a transient state. */
function parseList(value: string | null): string[] {
  return value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

export function ModuleGrid({
  modules, recommendedId, lang,
}: {
  modules: ModuleCard[];
  recommendedId: string | null;
  lang: 'en' | 'fr';
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pillarOpen, setPillarOpen] = useState(false);

  const activePillars = parseList(params.get('pillar'));
  const activeStatusesRaw = parseList(params.get('status')) as Status[];
  const activeStatuses = activeStatusesRaw.filter((s) => ALL_STATUSES.includes(s));

  const pillars = useMemo(() => {
    const seen = new Map<string, { slug: string; name: string; sortOrder: number | null }>();
    for (const m of modules) {
      if (m.pillarSlug && m.pillarName && !seen.has(m.pillarSlug)) {
        seen.set(m.pillarSlug, { slug: m.pillarSlug, name: m.pillarName, sortOrder: m.pillarSortOrder });
      }
    }
    return Array.from(seen.values()).sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  }, [modules]);

  const setParam = useCallback((key: string, values: string[]) => {
    const next = new URLSearchParams(params.toString());
    if (values.length === 0) next.delete(key);
    else next.set(key, values.join(','));
    const qs = next.toString();
    router.replace(qs ? `/dashboard?${qs}` : '/dashboard', { scroll: false });
  }, [params, router]);

  const togglePillar = (slug: string) =>
    setParam('pillar', activePillars.includes(slug)
      ? activePillars.filter((p) => p !== slug)
      : [...activePillars, slug]);

  const toggleStatus = (s: Status) =>
    setParam('status', activeStatuses.includes(s)
      ? activeStatuses.filter((x) => x !== s)
      : [...activeStatuses, s]);

  const reset = () => router.replace('/dashboard', { scroll: false });

  // An empty filter set means "everything", not "nothing" — a reader who has
  // turned every chip off is asking to see the whole grid again, not an empty
  // page.
  const visible = modules.filter((m) => {
    const pillarOk = activePillars.length === 0 || (m.pillarSlug != null && activePillars.includes(m.pillarSlug));
    const statusOk = activeStatuses.length === 0 || activeStatuses.includes(m.status);
    return pillarOk && statusOk;
  });

  const t = {
    heading: lang === 'en' ? 'Your journey' : 'Votre parcours',
    allPillars: lang === 'en' ? 'All pillars' : 'Tous les piliers',
    in_progress: lang === 'en' ? 'In progress' : 'En cours',
    not_started: lang === 'en' ? 'Not started' : 'Non commencé',
    completed: lang === 'en' ? 'Completed' : 'Terminé',
    none: lang === 'en' ? 'No modules match these filters.' : 'Aucun module ne correspond à ces filtres.',
    reset: lang === 'en' ? 'Reset' : 'Réinitialiser',
    startingPoint: lang === 'en' ? 'Starting point' : 'Point de départ',
    recommended: lang === 'en' ? 'Recommended next' : 'Recommandé ensuite',
    begin: lang === 'en' ? 'Begin' : 'Commencer',
    cont: lang === 'en' ? 'Continue' : 'Continuer',
    review: lang === 'en' ? 'Review' : 'Revoir',
    sections: lang === 'en' ? 'sections' : 'sections',
  };

  const statusLabel: Record<Status, string> = {
    in_progress: t.in_progress, not_started: t.not_started, completed: t.completed,
  };

  return (
    <section className="px-8 pb-12 max-md:px-5">
      <div className="mx-auto max-w-[900px]">
        {/* Header + filters */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
            {t.heading}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Shown from the first pillar onward. Hiding it until a second
                appears would mean the control arrives unannounced the day
                Module 2 lands in a different pillar. */}
            {pillars.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPillarOpen((o) => !o)}
                  aria-expanded={pillarOpen}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                  style={{ fontFamily: 'inherit' }}
                >
                  {activePillars.length === 0
                    ? t.allPillars
                    : `${activePillars.length} ${lang === 'en' ? 'selected' : 'sélectionnés'}`}
                  <span aria-hidden="true" className={`text-[9px] transition-transform ${pillarOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {pillarOpen && (
                  <div className="absolute right-0 z-30 mt-1.5 w-[240px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    {pillars.map((p) => {
                      const on = activePillars.includes(p.slug);
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => togglePillar(p.slug)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                          style={{ fontFamily: 'inherit' }}
                        >
                          <span
                            aria-hidden="true"
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold text-white ${on ? 'border-transparent' : 'border-gray-300'}`}
                            style={on ? { background: pillarColor(p.sortOrder) } : undefined}
                          >
                            {on ? '✓' : ''}
                          </span>
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {ALL_STATUSES.map((s) => {
              const on = activeStatuses.length === 0 || activeStatuses.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    activeStatuses.includes(s)
                      ? 'border-[#F9250E] bg-[#F9250E]/8 text-[#F9250E]'
                      : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: 'inherit' }}
                >
                  {statusLabel[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-[14.5px] text-gray-500">{t.none}</p>
            <button
              onClick={reset}
              className="mt-3 cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-[#F9250E] underline underline-offset-2"
              style={{ fontFamily: 'inherit' }}
            >
              {t.reset}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {visible.map((m) => {
              const isRecommended = m.id === recommendedId && !m.isStartingPoint;
              const accent =
                m.isStartingPoint ? 'border-emerald-500/35'
                : m.status === 'in_progress' || isRecommended ? 'border-[#F9250E]/35'
                : 'border-gray-200';

              const action =
                m.status === 'completed' ? t.review
                : m.status === 'in_progress' ? t.cont
                : t.begin;

              return (
                <Link
                  key={m.id}
                  href={`/lessons/${m.id}`}
                  className={`flex flex-col rounded-2xl border-2 bg-white p-5 no-underline transition-shadow hover:shadow-md ${accent}`}
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    {m.isStartingPoint ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
                        <span aria-hidden="true">🚪</span>{t.startingPoint}
                      </span>
                    ) : (
                      <span className="text-[15px] font-bold tabular-nums text-gray-300" style={{ fontFamily: DISPLAY }}>
                        {String(m.moduleNumber ?? 0).padStart(2, '0')}
                      </span>
                    )}

                    {/* Only numbered modules carry this. On the starting point
                        it would say twice what the green label already says,
                        in a card with room for one idea. */}
                    {isRecommended && (
                      <span className="rounded-full bg-[#F9250E] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
                        ▶ {t.recommended}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[15.5px] font-bold leading-snug text-gray-900" style={{ fontFamily: SERIF }}>
                    {m.title}
                  </h3>
                  {m.subtitle && (
                    <p className="mt-1 text-[12.5px] leading-snug text-gray-500">
                      {m.subtitle.length > 60 ? `${m.subtitle.slice(0, 60).trimEnd()}…` : m.subtitle}
                    </p>
                  )}

                  {m.pillarName && !m.isStartingPoint && (
                    <p
                      className="mt-2.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: pillarColor(m.pillarSortOrder) }}
                    >
                      {m.pillarName}
                    </p>
                  )}

                  <p className="mt-3 text-[11.5px] text-gray-500">
                    {m.status === 'completed' && <span className="text-emerald-600">✅ {t.completed}</span>}
                    {m.status === 'in_progress' && (
                      <span className="text-[#F9250E]">
                        ⏸ {t.in_progress} · {m.completedSections.length}/{m.sectionCount} {t.sections}
                      </span>
                    )}
                    {m.status === 'not_started' && (
                      <span className="text-gray-400">○ {t.not_started} · {m.sectionCount} {t.sections}</span>
                    )}
                  </p>

                  <span
                    className={`mt-4 text-[12.5px] font-bold ${m.isStartingPoint ? 'text-emerald-600' : 'text-[#F9250E]'}`}
                    style={{ fontFamily: DISPLAY }}
                  >
                    {action} →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
