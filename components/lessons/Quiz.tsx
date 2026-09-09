'use client';

import { useState } from 'react';
import type { QuizBlock } from '@/lib/lesson-blocks';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";

/**
 * A knowledge check that never blocks anyone.
 *
 * Each question grades the moment it is answered and then stays answered —
 * there is no submit step and no retry, because a second attempt at a question
 * whose answer is already on screen measures nothing. Getting one wrong is
 * meant to send the reader back up the page, which is why the explanation
 * shows either way rather than only on a miss.
 *
 * Nothing is stored. The score exists for the length of the visit and then
 * goes, deliberately: a low-stakes check that quietly built a record of
 * everyone's wrong answers would be a different thing than it claims to be.
 */
export function Quiz({ block, lang }: { block: QuizBlock; lang: 'en' | 'fr' }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = block.questions.length;
  const answered = block.questions.filter((q) => answers[q.id]).length;
  const correct = block.questions.filter(
    (q) => answers[q.id] === q.correct_option_id
  ).length;
  const allAnswered = answered === total;

  const review = block.scope === 'module_review';

  const t = {
    progress: lang === 'en' ? `${answered} of ${total} answered` : `${answered} sur ${total} répondu`,
    score: lang === 'en' ? `You got ${correct} of ${total}.` : `Vous avez ${correct} sur ${total}.`,
    // Deliberately flat in tone at both ends. Praise for a perfect score would
    // make a wrong answer feel like a verdict, and this is not a test.
    allRight: lang === 'en' ? 'All correct.' : 'Tout est correct.',
    someWrong: lang === 'en'
      ? 'Worth rereading the parts you missed before moving on — nothing here blocks you either way.'
      : 'Cela vaut la peine de relire ce que vous avez manqué avant de continuer — rien ne vous bloque ici.',
    correctLabel: lang === 'en' ? 'Correct' : 'Correct',
    incorrectLabel: lang === 'en' ? 'Not quite' : 'Pas tout à fait',
  };

  return (
    <section
      className={`my-10 rounded-2xl border bg-white p-6 max-md:p-5 ${
        review ? 'border-[#F9250E]/30 shadow-sm' : 'border-gray-200'
      }`}
      aria-labelledby={`quiz-${block.id}`}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3
          id={`quiz-${block.id}`}
          className={`font-bold text-gray-900 ${review ? 'text-[20px]' : 'text-[17px]'}`}
          style={{ fontFamily: DISPLAY }}
        >
          {block.title}
        </h3>
        <span className="text-[12px] tabular-nums text-gray-400">{t.progress}</span>
      </div>

      <ol className="flex list-none flex-col gap-7 p-0">
        {block.questions.map((q, qi) => {
          const chosen = answers[q.id];
          const isAnswered = !!chosen;
          const gotIt = chosen === q.correct_option_id;

          return (
            <li key={q.id}>
              <fieldset className="border-none p-0 m-0">
                <legend className="mb-3 text-[15px] font-semibold leading-snug text-gray-900">
                  <span className="mr-1.5 text-gray-400 tabular-nums">{qi + 1}.</span>
                  {q.prompt}
                </legend>

                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    const picked = chosen === opt.id;
                    const isKey = opt.id === q.correct_option_id;

                    // After answering, the right option is always marked — not
                    // only when the reader found it. Showing a miss without
                    // showing the answer leaves them worse off than before.
                    const tone = !isAnswered
                      ? 'border-gray-200 bg-white hover:bg-gray-50'
                      : isKey
                        ? 'border-emerald-500/50 bg-emerald-50'
                        : picked
                          ? 'border-[#F9250E]/45 bg-[#F9250E]/[0.04]'
                          : 'border-gray-200 bg-white opacity-60';

                    return (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[14.5px] leading-snug text-gray-800 transition-colors ${tone} ${
                          isAnswered ? 'cursor-default' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${block.id}-${q.id}`}
                          value={opt.id}
                          checked={picked}
                          disabled={isAnswered}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#F9250E]"
                        />
                        <span className="min-w-0 flex-1">{opt.text}</span>
                        {isAnswered && isKey && (
                          <span aria-hidden="true" className="shrink-0 text-[13px] font-bold text-emerald-600">✓</span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3">
                    <p
                      className={`text-[12.5px] font-bold uppercase tracking-wider ${
                        gotIt ? 'text-emerald-600' : 'text-[#F9250E]'
                      }`}
                    >
                      {gotIt ? t.correctLabel : t.incorrectLabel}
                    </p>
                    {q.explanation && (
                      <p className="mt-1 text-[13.5px] leading-[1.6] text-gray-600">{q.explanation}</p>
                    )}
                  </div>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {allAnswered && (
        <div
          className="mt-7 border-t border-gray-100 pt-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-[14.5px] font-semibold text-gray-800" style={{ fontFamily: DISPLAY }}>
            {t.score}
          </p>
          <p className="mt-1 text-[13px] leading-[1.6] text-gray-500">
            {correct === total ? t.allRight : t.someWrong}
          </p>
        </div>
      )}
    </section>
  );
}
