import Link from 'next/link';
import type { DashboardData } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

function relative(iso: string, lang: 'en' | 'fr'): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return lang === 'en' ? 'today' : "aujourd'hui";
  if (days === 1) return lang === 'en' ? 'yesterday' : 'hier';
  if (days < 30) return lang === 'en' ? `${days} days ago` : `il y a ${days} jours`;
  const months = Math.floor(days / 30);
  return lang === 'en'
    ? `${months} ${months === 1 ? 'month' : 'months'} ago`
    : `il y a ${months} mois`;
}

/**
 * The reader's own words, handed back to them.
 *
 * Renders nothing at all when there is nothing written. An empty state here
 * would be a box explaining that the box is empty — the reader already knows,
 * and the next-step card above is what they should be looking at instead.
 */
export function WhatYouveWritten({ data }: { data: DashboardData }) {
  if (data.submissions.length === 0) return null;

  const { lang } = data;

  return (
    <section className="px-8 pb-12 max-md:px-5">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
          {lang === 'en' ? "What you've written" : 'Ce que vous avez écrit'}
        </h2>

        <div className="flex flex-col gap-3">
          {data.submissions.map((s) => {
            const base = s.sectionNumber
              ? `/lessons/${s.moduleId}/${s.sectionNumber}`
              : `/lessons/${s.moduleId}`;
            return (
              <article key={`${s.moduleId}:${s.assignmentKey}`} className="rounded-2xl border border-[#F9250E]/12 bg-[#F9250E]/[0.03] p-5 max-md:p-4">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-gray-500">
                  <span className="font-semibold text-gray-800" style={{ fontFamily: DISPLAY }}>{s.assignmentTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>v{s.version}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'en' ? 'submitted' : 'soumis'} {relative(s.submittedAt, lang)}</span>
                </p>

                <blockquote className="mt-2.5 text-[15.5px] leading-[1.6] text-gray-700" style={{ fontFamily: SERIF }}>
                  &ldquo;{s.excerpt}&rdquo;
                </blockquote>

                <p className="mt-3.5 flex flex-wrap gap-4 text-[13px] font-semibold">
                  <Link href={`${base}?view=submission`} className="text-[#F9250E] no-underline hover:underline">
                    {lang === 'en' ? 'Read' : 'Lire'} →
                  </Link>
                  <Link href={`${base}?view=edit`} className="text-gray-500 no-underline hover:text-gray-800 hover:underline">
                    {lang === 'en' ? `Revise as v${s.version + 1}` : `Réviser en v${s.version + 1}`} →
                  </Link>
                </p>
              </article>
            );
          })}
        </div>

        {data.submissionCount > data.submissions.length && (
          <div className="group relative mt-4 inline-block">
            <span className="cursor-not-allowed text-[13px] font-semibold text-gray-400">
              {lang === 'en'
                ? `See all your submissions (${data.submissionCount})`
                : `Voir toutes vos soumissions (${data.submissionCount})`} →
            </span>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full mt-1 whitespace-nowrap rounded-md bg-[#1A1A24] px-2.5 py-1.5 text-[11px] font-medium text-gray-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
            >
              {lang === 'en' ? 'Coming soon' : 'Bientôt disponible'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
