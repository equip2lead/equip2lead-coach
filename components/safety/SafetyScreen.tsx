'use client';

import { quickExit, SAFETY_COPY, type Lang } from '@/lib/safety';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";

export function QuickExitButton({ lang, className = '' }: { lang: Lang; className?: string }) {
  return (
    <button
      type="button"
      onClick={quickExit}
      className={`cursor-pointer rounded-xl border-none bg-gray-900 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-black ${className}`}
      style={{ fontFamily: DISPLAY }}
    >
      {SAFETY_COPY[lang].quickExit}
    </button>
  );
}

/**
 * Shown straight after a safety concern is reported. Quick exit always works,
 * even when saving failed or is still in progress.
 */
export function SafetyScreen({
  lang, onContinue, saving = false, saveFailed = false,
}: {
  lang: Lang;
  onContinue: () => void;
  saving?: boolean;
  saveFailed?: boolean;
}) {
  const t = SAFETY_COPY[lang];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white px-6 py-10" role="dialog" aria-modal="true" aria-labelledby="safety-heading" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="w-full max-w-[560px]">
        <h1 id="safety-heading" className="mb-5 text-[28px] font-extrabold leading-tight text-gray-900 max-md:text-[24px]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          {t.heading}
        </h1>
        <p className="mb-4 text-[16px] leading-[1.7] text-gray-700">{t.body}</p>
        <p className="mb-8 text-[16px] leading-[1.7] text-gray-700">{t.help}</p>

        {saveFailed && (
          <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">{t.saveFailed}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <QuickExitButton lang={lang} />
          <button
            type="button"
            onClick={onContinue}
            disabled={saving}
            className="cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-3 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
            style={{ fontFamily: DISPLAY }}
          >
            {t.continue}
          </button>
        </div>
        <p className="mt-5 text-[13px] leading-[1.6] text-gray-500">{t.note}</p>
      </div>
    </div>
  );
}
