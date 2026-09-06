import Link from 'next/link';
import type { DashboardData } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const RETAKE_AFTER_DAYS = 30;

// pillars.color is null for every row, so the bars take the track's colour
// rather than a per-pillar one. When those get populated this becomes the
// fallback rather than the rule.
const TRACK_COLOR = '#F9250E';

export function YourPillars({ data }: { data: DashboardData }) {
  const { lang, pillars, assessmentTakenAt } = data;
  if (pillars.length === 0) return null;

  const daysSince = assessmentTakenAt
    ? Math.floor((Date.now() - new Date(assessmentTakenAt).getTime()) / 86_400_000)
    : null;
  const canRetake = daysSince === null || daysSince >= RETAKE_AFTER_DAYS;
  const daysUntilRetake = daysSince === null ? 0 : Math.max(0, RETAKE_AFTER_DAYS - daysSince);

  return (
    <section className="px-8 pb-12 max-md:px-5">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
          {lang === 'en' ? 'Your pillars' : 'Vos piliers'}
        </h2>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 max-md:p-5">
          <ul className="flex list-none flex-col gap-4 p-0">
            {pillars.map((p) => {
              const pct = Math.max(0, Math.min(100, (p.score / p.maxScore) * 100));
              return (
                <li key={p.id} className="flex items-center gap-4 max-md:flex-wrap max-md:gap-y-1.5">
                  <span className="w-[190px] shrink-0 text-[14px] text-gray-700 max-md:w-full">{p.name}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 max-md:order-3 max-md:w-full max-md:flex-none">
                    <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: TRACK_COLOR }} />
                  </span>
                  <span
                    className="w-[74px] shrink-0 text-right text-[13.5px] font-bold tabular-nums text-gray-800 max-md:w-auto max-md:text-left"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {p.score.toFixed(1)}
                    <span className="font-medium text-gray-400"> / {p.maxScore.toFixed(1)}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 border-t border-gray-100 pt-4 text-[12.5px] text-gray-500">
            {daysSince !== null && (
              <>
                {lang === 'en'
                  ? `Assessment taken ${daysSince} ${daysSince === 1 ? 'day' : 'days'} ago`
                  : `Évaluation passée il y a ${daysSince} ${daysSince === 1 ? 'jour' : 'jours'}`}
                {' · '}
              </>
            )}
            {canRetake ? (
              <Link href="/pre-assessment" className="font-semibold text-[#F9250E] no-underline hover:underline">
                {lang === 'en' ? 'Retake' : 'Repasser'} →
              </Link>
            ) : (
              <span className="text-gray-400">
                {lang === 'en'
                  ? `Retake in ${daysUntilRetake} ${daysUntilRetake === 1 ? 'day' : 'days'}`
                  : `Repasser dans ${daysUntilRetake} ${daysUntilRetake === 1 ? 'jour' : 'jours'}`}
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
