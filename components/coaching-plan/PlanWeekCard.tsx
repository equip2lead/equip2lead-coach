import Link from 'next/link';
import type { PlanModuleLink } from '@/lib/coaching-plan/data';
import { exerciseLabel, localized, type PlanWeek } from '@/lib/coaching-plan/parse';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";

export function PlanWeekCard({
  week, currentWeek, lang, module,
}: {
  week: PlanWeek;
  currentWeek: number;
  lang: 'en' | 'fr';
  module: PlanModuleLink | null;
}) {
  const en = lang === 'en';
  const isCurrent = week.week === currentWeek;
  const isPast = week.week < currentWeek;
  const description = localized(lang, week.descEn, week.descFr);

  return (
    <article
      aria-current={isCurrent ? 'step' : undefined}
      className={`rounded-2xl bg-white p-6 max-md:p-5 ${isCurrent ? 'border-2 border-[#F9250E]/40 shadow-sm' : 'border border-gray-200'}`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[14px] font-bold tabular-nums ${
            isCurrent ? 'bg-[#F9250E] text-white' : isPast ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
          }`}
          style={{ fontFamily: DISPLAY }}
        >
          {isPast ? '✓' : week.week}
        </span>

        <div className="min-w-0 flex-1">
          <p className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <span>{en ? `Week ${week.week}` : `Semaine ${week.week}`}</span>
            {week.focus && <span className="font-medium text-gray-400">· {week.focus}</span>}
            {isCurrent && (
              <span className="rounded-full bg-[#F9250E]/10 px-2 py-0.5 text-[9.5px] text-[#F9250E]">
                {en ? 'This week' : 'Cette semaine'}
              </span>
            )}
          </p>
          <h3 className="text-[17px] font-bold leading-snug text-gray-900" style={{ fontFamily: DISPLAY }}>
            {localized(lang, week.titleEn, week.titleFr)}
          </h3>
          {description && <p className="mt-1.5 text-[14.5px] leading-[1.6] text-gray-600">{description}</p>}

          {week.exercises.length > 0 && (
            <ul className="mt-4 flex list-none flex-col gap-2 p-0">
              {week.exercises.map((x, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-2 text-[14px] leading-[1.5] text-gray-700">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">{exerciseLabel(x.type, lang)}</span>
                  <span className="min-w-0">{localized(lang, x.titleEn, x.titleFr)}</span>
                </li>
              ))}
            </ul>
          )}

          {(module || isCurrent) && (
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold">
              {module && (
                <Link href={`/lessons/${module.id}`} className="text-[#F9250E] no-underline hover:underline">
                  {module.moduleNumber != null ? `Module ${module.moduleNumber}: ` : ''}{module.title} →
                </Link>
              )}
              {isCurrent && (
                <Link href="/weekly-checkin" className="text-gray-600 no-underline hover:underline">
                  {en ? 'Weekly check-in →' : 'Bilan hebdomadaire →'}
                </Link>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
