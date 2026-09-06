import Link from 'next/link';
import { NextStepModeToggle } from './NextStepMode';
import { SectionsIcon, ClockIcon, TargetIcon } from '@/components/shell/icons';
import type { DashboardData } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

export function NextStep({ data }: { data: DashboardData }) {
  const { lang, nextStep, nextStepMode } = data;

  const heading = lang === 'en' ? 'Your next step' : 'Votre prochaine étape';

  if (nextStep.kind === 'all_done') {
    return (
      <section className="px-8 pb-12 max-md:px-5">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
            {heading}
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 max-md:p-6">
            <p className="text-[17px] leading-[1.6] text-gray-700" style={{ fontFamily: SERIF }}>
              {lang === 'en'
                ? 'You’ve finished everything currently available. Module 2 is coming soon.'
                : 'Vous avez terminé tout ce qui est disponible. Le Module 2 arrive bientôt.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const m = nextStep.module;
  const done = m.completedSections.length;
  const started = done > 0;
  const pillarLabel = m.isStartingPoint
    ? (lang === 'en' ? 'Starting Point' : 'Point de départ')
    : m.pillarName;

  return (
    <section className="px-8 pb-12 max-md:px-5">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
          {heading}
        </h2>

        <div className="rounded-2xl border border-gray-200 border-l-4 border-l-[#F9250E] bg-white p-8 max-md:p-6">
          <h3 className="text-[24px] max-md:text-[20px] font-bold leading-[1.25] text-gray-900" style={{ fontFamily: DISPLAY }}>
            {m.title}
          </h3>
          {m.subtitle && <p className="mt-1.5 text-[15px] text-gray-500">{m.subtitle}</p>}

          <p className="mt-4 text-[16px] leading-[1.65] text-gray-700" style={{ fontFamily: SERIF }}>
            {nextStep.reason}
          </p>

          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-gray-500">
            <span className="inline-flex items-center gap-1.5"><SectionsIcon />{m.sectionCount} {lang === 'en' ? 'sections' : 'sections'}</span>
            <span className="inline-flex items-center gap-1.5"><ClockIcon />{m.minutes} min</span>
            {pillarLabel && <span className="inline-flex items-center gap-1.5"><TargetIcon />{pillarLabel}</span>}
          </p>

          <Link
            href={`/lessons/${m.id}`}
            className="mt-6 inline-block rounded-xl bg-[#F9250E] px-7 py-3.5 text-[15px] font-bold text-white no-underline transition-transform hover:-translate-y-px"
            style={{ fontFamily: DISPLAY, boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
          >
            {started
              ? `${lang === 'en' ? 'Continue' : 'Continuer'} → ${done}/${m.sectionCount} ${lang === 'en' ? 'sections done' : 'sections faites'}`
              : `${lang === 'en' ? 'Begin' : 'Commencer'} →`}
          </Link>
        </div>

        {/* Only offered once there is a numbered module to order. While the
            starting point is the answer, the mode makes no difference and the
            control would be a decision without a consequence. */}
        {!m.isStartingPoint && <NextStepModeToggle current={nextStepMode} lang={lang} />}
      </div>
    </section>
  );
}
