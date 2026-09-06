'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setNextStepMode } from '@/app/(app)/dashboard/actions';
import type { NextStepMode as Mode } from '@/lib/dashboard/data';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";

export function NextStepModeToggle({ current, lang }: { current: Mode; lang: 'en' | 'fr' }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const choose = (mode: Mode) => {
    setError(null);
    startTransition(async () => {
      const res = await setNextStepMode(mode);
      if (!res.ok) { setError(res.error ?? 'Could not save'); return; }
      setOpen(false);
      router.refresh();
    });
  };

  const options: { mode: Mode; title: string; body: string }[] = lang === 'en'
    ? [
        { mode: 'assessment', title: 'Follow my assessment',
          body: 'Offer the module that works on my weakest pillar first. The assessment has already been taken; this honours what it found.' },
        { mode: 'sequential', title: 'Follow the module order',
          body: 'Walk the numbered arc from the beginning. Each module still stands alone, but they are ordered for a reason.' },
      ]
    : [
        { mode: 'assessment', title: 'Suivre mon évaluation',
          body: 'Proposer d’abord le module qui travaille mon pilier le plus faible. L’évaluation est déjà faite ; ceci en respecte le résultat.' },
        { mode: 'sequential', title: 'Suivre l’ordre des modules',
          body: 'Parcourir le programme dans l’ordre. Chaque module reste autonome, mais leur ordre a une raison.' },
      ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 cursor-pointer border-none bg-transparent p-0 text-[12.5px] font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800"
        style={{ fontFamily: 'inherit' }}
      >
        {lang === 'en' ? 'Change how modules are recommended' : 'Modifier la façon dont les modules sont recommandés'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-[18px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>
              {lang === 'en' ? 'How should we choose what’s next?' : 'Comment choisir la suite ?'}
            </h3>
            <p className="mb-5 text-[13.5px] text-gray-500">
              {lang === 'en'
                ? 'Both paths cover the same twelve modules. This only changes the order they are offered in.'
                : 'Les deux chemins couvrent les mêmes douze modules. Seul l’ordre proposé change.'}
            </p>

            <div className="flex flex-col gap-3">
              {options.map((o) => {
                const active = o.mode === current;
                return (
                  <button
                    key={o.mode}
                    type="button"
                    onClick={() => choose(o.mode)}
                    disabled={pending}
                    className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-colors disabled:opacity-60 ${
                      active ? 'border-[#F9250E] bg-[#F9250E]/[0.04]' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'inherit' }}
                  >
                    <p className="flex items-center gap-2 text-[14.5px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>
                      {o.title}
                      {active && <span className="text-[11px] font-bold uppercase tracking-wider text-[#F9250E]">
                        {lang === 'en' ? 'current' : 'actuel'}
                      </span>}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.6] text-gray-600">{o.body}</p>
                  </button>
                );
              })}
            </div>

            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{error}</p>}

            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-gray-600"
              style={{ fontFamily: 'inherit' }}
            >
              {lang === 'en' ? 'Close' : 'Fermer'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
