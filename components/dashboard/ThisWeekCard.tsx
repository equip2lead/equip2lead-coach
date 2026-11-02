import Link from 'next/link';
import type { DashboardData } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";

// The way into the coaching plan from the dashboard. Renders nothing until the
// plan is complete.
export function ThisWeekCard({ data }: { data: DashboardData }) {
  const { lang, planThisWeek } = data;
  if (!planThisWeek) return null;
  const en = lang === 'en';

  return (
    <section className="px-8 pb-12 max-md:px-5">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
          {en ? 'Your 12-week plan' : 'Votre plan de 12 semaines'}
        </h2>
        <Link
          href="/coaching-plan"
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-2xl border border-gray-200 bg-white p-6 no-underline transition-shadow hover:shadow-md max-md:p-5"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#F9250E]">
              {en ? `This week · Week ${planThisWeek.week} of 12` : `Cette semaine · Semaine ${planThisWeek.week} sur 12`}
            </span>
            <span className="mt-1 block text-[17px] font-bold leading-snug text-gray-900" style={{ fontFamily: DISPLAY }}>
              {planThisWeek.title}
            </span>
          </span>
          <span className="text-[13px] font-bold text-[#F9250E]" style={{ fontFamily: DISPLAY }}>
            {en ? 'View plan →' : 'Voir le plan →'}
          </span>
        </Link>
      </div>
    </section>
  );
}
