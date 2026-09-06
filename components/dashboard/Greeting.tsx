import Link from 'next/link';
import { TimeOfDay } from './TimeOfDay';
import { greetingFor, greetingState } from '@/lib/dashboard/greetings';
import type { DashboardData } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export function Greeting({ data }: { data: DashboardData }) {
  const { lang, firstName, modules, nextStep } = data;

  const startingPoint = modules.find((m) => m.isStartingPoint);
  const state = greetingState({
    hasAnyActivity: data.lastActivityAt !== null || data.submissionCount > 0,
    daysSinceActivity: daysSince(data.lastActivityAt),
    startingPointComplete: startingPoint?.status === 'completed',
    hasBegunNumberedModule: modules.some((m) => !m.isStartingPoint && m.status !== 'not_started'),
    lastActivityKind: data.lastActivityKind,
  });

  const copy = greetingFor(state, lang);
  const days = daysSince(data.lastActivityAt);

  const href = nextStep.kind === 'module' ? `/lessons/${nextStep.module.id}` : '/lessons';
  const cta =
    state === 'oriented' && nextStep.kind === 'module'
      ? `${copy.cta} ${nextStep.module.title}`
      : copy.cta;

  return (
    <section className="px-8 pt-14 pb-10 max-md:px-5 max-md:pt-10">
      <div className="mx-auto max-w-[900px]">
        <h1
          className="text-[34px] max-md:text-[26px] font-bold leading-[1.2] text-gray-900"
          style={{ fontFamily: DISPLAY }}
        >
          {copy.salutation === 'welcome' && <>{lang === 'en' ? 'Welcome' : 'Bienvenue'}, {firstName}.</>}
          {copy.salutation === 'welcome_back' && <>{lang === 'en' ? 'Welcome back' : 'Content de vous revoir'}, {firstName}.</>}
          {copy.salutation === 'time_of_day' && <TimeOfDay lang={lang} name={firstName} />}
        </h1>

        <div className="mt-5 flex flex-col gap-2.5">
          {/* A returning reader is told how long it has been, in their own
              terms, before the encouragement — otherwise the encouragement
              reads as though nothing happened. */}
          {(state === 'returning' || state === 'long_absence') && days !== null && (
            <p className="text-[18px] max-md:text-[17px] leading-[1.6] text-gray-700" style={{ fontFamily: SERIF }}>
              {lang === 'en'
                ? `It's been ${days} ${days === 1 ? 'day' : 'days'} since you last ${data.lastActivityKind === 'submitted' ? 'submitted' : 'read'}.`
                : `Cela fait ${days} ${days === 1 ? 'jour' : 'jours'} depuis votre dernière ${data.lastActivityKind === 'submitted' ? 'soumission' : 'lecture'}.`}
            </p>
          )}

          {state === 'recent' && data.submissions[0] && (
            <p className="text-[18px] max-md:text-[17px] leading-[1.6] text-gray-700" style={{ fontFamily: SERIF }}>
              {lang === 'en'
                ? `You submitted your ${data.submissions[0].assignmentTitle} ${days === 0 ? 'today' : `${days} ${days === 1 ? 'day' : 'days'} ago`}.`
                : `Vous avez soumis votre ${data.submissions[0].assignmentTitle} ${days === 0 ? "aujourd'hui" : `il y a ${days} ${days === 1 ? 'jour' : 'jours'}`}.`}
            </p>
          )}

          {copy.lines.map((line, i) => (
            <p key={i} className="text-[18px] max-md:text-[17px] leading-[1.6] text-gray-700" style={{ fontFamily: SERIF }}>
              {line}
            </p>
          ))}
        </div>

        <Link
          href={href}
          className="mt-8 inline-block rounded-xl bg-[#F9250E] px-7 py-3.5 text-[15px] font-bold text-white no-underline transition-transform hover:-translate-y-px"
          style={{ fontFamily: DISPLAY, boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
        >
          {cta} →
        </Link>
      </div>
    </section>
  );
}
