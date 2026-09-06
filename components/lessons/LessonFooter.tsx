'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { markSectionComplete } from '@/app/(app)/lessons/[id]/actions';

export function LessonFooter({
  moduleId, current, total, alreadyComplete, assignmentPending = false, lang,
}: {
  moduleId: string;
  current: number;
  total: number;
  alreadyComplete: boolean;
  /** This section asks for work that has not been handed in. */
  assignmentPending?: boolean;
  lang: 'en' | 'fr';
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState(false);

  const isLast = current >= total;
  const prevHref = current > 1 ? `/lessons/${moduleId}/${current - 1}` : null;

  const onContinue = () => {
    // Ask once. An unanswered assignment is easy to walk past on a page this
    // long, and the reader may simply not have noticed it.
    if (assignmentPending && !warn) { setWarn(true); return; }
    setWarn(false);
    setError(null);
    startTransition(async () => {
      const res = await markSectionComplete(moduleId, current, total);
      if (!res.ok) { setError(res.error); return; }
      // The last section returns to the overview, where finishing is legible
      // as a finished module rather than as a page that simply stopped.
      router.push(isLast ? `/lessons/${moduleId}` : `/lessons/${moduleId}/${current + 1}`);
      router.refresh();
    });
  };

  const label = pending
    ? (lang === 'en' ? 'Saving…' : 'Enregistrement…')
    : isLast
      ? (lang === 'en' ? 'Complete Module ✓' : 'Terminer le module ✓')
      : (lang === 'en' ? 'Mark Complete & Continue →' : 'Terminer et continuer →');

  return (
    <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      {error && (
        <p role="alert" className="border-b border-red-100 bg-red-50 px-6 py-2 text-center text-[12.5px] text-red-700">
          {error}
        </p>
      )}
      <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-6 py-3.5 max-md:px-4">
        {prevHref ? (
          <Link
            href={prevHref}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-[13.5px] font-semibold text-gray-600 no-underline transition-colors hover:bg-gray-50 max-md:px-3"
          >
            ← <span className="max-md:hidden">{lang === 'en' ? 'Previous section' : 'Section précédente'}</span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="cursor-not-allowed rounded-xl border border-gray-100 px-4 py-2.5 text-[13.5px] font-semibold text-gray-300 max-md:px-3"
          >
            ← <span className="max-md:hidden">{lang === 'en' ? 'Previous section' : 'Section précédente'}</span>
          </span>
        )}

        <span className="shrink-0 text-[12.5px] font-medium text-gray-500 tabular-nums">
          {lang === 'en' ? `Section ${current} of ${total}` : `Section ${current} sur ${total}`}
          {alreadyComplete && <span className="ml-2 text-emerald-600">✓</span>}
        </span>

        <button
          type="button"
          onClick={onContinue}
          disabled={pending}
          className="rounded-xl border-none bg-[#F9250E] px-5 py-2.5 text-[13.5px] font-bold text-white transition-transform hover:-translate-y-px disabled:cursor-wait disabled:opacity-60 max-md:px-3.5 max-md:text-[12.5px]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
        >
          {label}
        </button>
      </div>

      {warn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={() => setWarn(false)}>
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-[18px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? 'Unfinished assignment' : 'Devoir inachevé'}
            </h3>
            <p className="mb-6 text-[14px] leading-[1.7] text-gray-600">
              {lang === 'en'
                ? 'You have an unfinished assignment on this section. Continue anyway?'
                : 'Vous avez un devoir inachevé dans cette section. Continuer quand même ?'}
            </p>
            <div className="flex gap-3 max-md:flex-col">
              <button
                onClick={() => setWarn(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-gray-600"
                style={{ fontFamily: 'inherit' }}
              >
                {lang === 'en' ? 'Cancel' : 'Annuler'}
              </button>
              <button
                onClick={onContinue}
                className="flex-1 rounded-xl border-none bg-[#F9250E] px-4 py-2.5 text-[13.5px] font-bold text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lang === 'en' ? 'Continue without submitting' : 'Continuer sans soumettre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
