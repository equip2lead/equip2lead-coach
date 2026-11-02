import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCoachingPlanData } from '@/lib/coaching-plan/data';
import { PlanWeekCard } from '@/components/coaching-plan/PlanWeekCard';
import { PLAN_PHASES, TOTAL_WEEKS } from '@/lib/coaching-plan/parse';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

export const dynamic = 'force-dynamic';

export default async function CoachingPlanPage() {
  const data = await getCoachingPlanData();
  if (!data) redirect('/auth?redirect=%2Fcoaching-plan');
  // Checked here on the server as well as in the app shell, so a flagged reader's
  // plan is never sent to the browser at all.
  if (data.safetyConcern) redirect('/dashboard');
  if (!data.journeyId) redirect('/track-selection');

  const { lang } = data;
  const en = lang === 'en';
  const heading = en ? 'Your 12-week plan' : 'Votre plan de 12 semaines';

  if (data.state !== 'ready') {
    const needsAssessment = data.state === 'needs_assessment';
    const href = needsAssessment
      ? `/pillar-overview?track=${data.trackSlug ?? ''}`
      : `/plan-generation?track=${data.trackSlug ?? ''}`;
    return (
      <div className="min-h-screen bg-[#F9FAFB] px-8 py-14 max-md:px-5 max-md:py-20">
        <div className="mx-auto max-w-[620px] rounded-2xl border border-gray-200 bg-white p-8 max-md:p-6">
          <h1 className="mb-3 text-[24px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>{heading}</h1>
          <p className="mb-6 text-[16px] leading-[1.65] text-gray-700" style={{ fontFamily: SERIF }}>
            {needsAssessment
              ? (en ? 'Your plan is built from your assessment. Finish it, and your 12 weeks will be ready.' : 'Votre plan est construit à partir de votre évaluation. Terminez-la, et vos 12 semaines seront prêtes.')
              : (en ? 'Your assessment is done, but your plan isn’t finished yet.' : 'Votre évaluation est terminée, mais votre plan n’est pas encore prêt.')}
          </p>
          <Link href={href} className="inline-block rounded-xl bg-[#F9250E] px-6 py-3 text-[14px] font-bold text-white no-underline" style={{ fontFamily: DISPLAY }}>
            {needsAssessment
              ? (en ? 'Continue your assessment →' : 'Continuer votre évaluation →')
              : (en ? 'Finish your plan →' : 'Terminer votre plan →')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-8 py-14 max-md:px-5 max-md:py-20">
      <div className="mx-auto max-w-[800px]">
        <p className="mb-1 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>{data.trackName}</p>
        <h1 className="text-[32px] font-bold leading-[1.2] text-gray-900 max-md:text-[26px]" style={{ fontFamily: DISPLAY }}>{heading}</h1>
        <p className="mt-2 text-[15px] font-semibold text-[#F9250E]">
          {en ? `Week ${data.currentWeek} of ${TOTAL_WEEKS}` : `Semaine ${data.currentWeek} sur ${TOTAL_WEEKS}`}
        </p>

        {data.vision && (
          <section className="mt-8 rounded-2xl bg-[#0B0B0C] p-7 max-md:p-5">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400" style={{ fontFamily: DISPLAY }}>
              {en ? 'Your 12-month vision' : 'Votre vision à 12 mois'}
            </h2>
            <p className="whitespace-pre-line text-[16px] leading-[1.7] text-white/90" style={{ fontFamily: SERIF }}>{data.vision}</p>
          </section>
        )}

        {data.coachSummary && (
          <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-7 max-md:p-5">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
              {en ? 'Coach’s summary' : 'Synthèse du coach'}
            </h2>
            <p className="whitespace-pre-line text-[15.5px] leading-[1.7] text-gray-700" style={{ fontFamily: SERIF }}>{data.coachSummary}</p>
          </section>
        )}

        {PLAN_PHASES.map((phase) => (
          <section key={phase.en} className="mt-10">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
              {en ? phase.en : phase.fr}
              <span className="ml-2 font-medium normal-case tracking-normal text-gray-400">
                {en ? `Weeks ${phase.from}–${phase.to}` : `Semaines ${phase.from}–${phase.to}`}
              </span>
            </h2>
            <div className="flex flex-col gap-3">
              {data.weeks
                .filter((w) => w.week >= phase.from && w.week <= phase.to)
                .map((w) => (
                  <PlanWeekCard
                    key={w.week}
                    week={w}
                    currentWeek={data.currentWeek}
                    lang={lang}
                    module={w.moduleId ? data.modules[w.moduleId] ?? null : null}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
