import Link from 'next/link';
import { QuickExitButton } from '@/components/safety/SafetyScreen';
import { SAFETY_COPY, type Lang } from '@/lib/safety';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";

// Takes the place of the whole dashboard while a safety concern is on the
// journey: no scores, no plan, no couple-focused modules.
export function SafetySupportCard({ lang }: { lang: Lang }) {
  const t = SAFETY_COPY[lang];
  return (
    <section className="px-8 py-14 max-md:px-5 max-md:py-20">
      <div className="mx-auto max-w-[620px] rounded-2xl border border-gray-200 bg-white p-8 max-md:p-6">
        <h1 className="mb-4 text-[24px] font-extrabold text-gray-900" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          {t.dashboardHeading}
        </h1>
        <p className="mb-4 text-[15.5px] leading-[1.7] text-gray-700">{t.dashboardBody}</p>
        <p className="mb-7 text-[15.5px] leading-[1.7] text-gray-700">{t.help}</p>
        <div className="flex flex-wrap items-center gap-3">
          <QuickExitButton lang={lang} />
          <Link
            href="/ai-coach"
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-[14px] font-semibold text-gray-700 no-underline transition-colors hover:bg-gray-50"
            style={{ fontFamily: DISPLAY }}
          >
            {t.coachLink}
          </Link>
        </div>
        <p className="mt-5 text-[13px] leading-[1.6] text-gray-500">{t.note}</p>
      </div>
    </section>
  );
}
