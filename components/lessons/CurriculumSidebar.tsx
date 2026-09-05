'use client';

import { useState } from 'react';
import Link from 'next/link';

export type CurriculumEntry = { number: number; shortTitle: string; readingMinutes: number };

/**
 * The module's table of contents, pinned beside the reading column.
 *
 * Dark like the app rail so the two read as one navigation surface rather than
 * two competing ones, and separated from it by a hairline rather than a gap.
 * Below the shell breakpoint it collapses to a summary strip: on a phone the
 * reader wants the lesson, not the map.
 */
export function CurriculumSidebar({
  moduleId, moduleTitle, sections, current, completed, lang,
}: {
  moduleId: string;
  moduleTitle: string;
  sections: CurriculumEntry[];
  current: number;
  completed: number[];
  lang: 'en' | 'fr';
}) {
  const [open, setOpen] = useState(false);
  const done = (n: number) => completed.includes(n);

  const list = (
    <ol className="flex list-none flex-col gap-0.5 p-0">
      {sections.map((s) => {
        const isCurrent = s.number === current;
        return (
          <li key={s.number}>
            <Link
              href={`/lessons/${moduleId}/${s.number}`}
              onClick={() => setOpen(false)}
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex items-start gap-3 border-l-2 px-4 py-3 no-underline transition-colors ${
                isCurrent
                  ? 'border-[#F9250E] bg-white/[0.07] text-white'
                  : 'border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
              }`}
            >
              <span aria-hidden="true" className="mt-[3px] shrink-0 text-[12px] leading-none">
                {done(s.number)
                  ? <span className="text-emerald-400">✓</span>
                  : <span className={isCurrent ? 'text-[#F9250E]' : 'text-gray-600'}>○</span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium leading-[1.35]">
                  {s.number}. {s.shortTitle}
                </span>
                <span className="mt-0.5 block text-[11px] text-gray-500">
                  {s.readingMinutes} {lang === 'en' ? 'min' : 'min'}
                  {done(s.number) && ` · ${lang === 'en' ? 'complete' : 'terminé'}`}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Desktop rail */}
      <nav
        className="hidden shell:flex w-[280px] shrink-0 flex-col self-start sticky top-0 max-h-screen overflow-y-auto border-r border-white/10 bg-[#0B0B0C] py-6"
        aria-label={lang === 'en' ? 'Module contents' : 'Contenu du module'}
      >
        <div className="px-4 pb-4">
          <Link href={`/lessons/${moduleId}`} className="text-[11px] font-bold uppercase tracking-wider text-[#F9250E] no-underline hover:underline">
            ← {lang === 'en' ? 'Module overview' : 'Aperçu du module'}
          </Link>
          <h2 className="mt-2 text-[14.5px] font-bold leading-snug text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {moduleTitle}
          </h2>
          <p className="mt-1 text-[11.5px] text-gray-500">
            {completed.length}/{sections.length} {lang === 'en' ? 'sections complete' : 'sections terminées'}
          </p>
        </div>
        {list}
      </nav>

      {/* Below the shell breakpoint: a summary strip that opens the same list */}
      <div className="shell:hidden sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0C]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent px-4 py-3 text-left"
          style={{ fontFamily: 'inherit' }}
        >
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-white">{moduleTitle}</span>
            <span className="block text-[11px] text-gray-500">
              {lang === 'en' ? 'Section' : 'Section'} {current} {lang === 'en' ? 'of' : 'sur'} {sections.length} ·{' '}
              {completed.length} {lang === 'en' ? 'complete' : 'terminées'}
            </span>
          </span>
          <span aria-hidden="true" className={`shrink-0 text-[11px] text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {open && <div className="max-h-[60vh] overflow-y-auto pb-2">{list}</div>}
      </div>
    </>
  );
}
