'use client';

import { useState } from 'react';
import { SideRail } from './SideRail';
import { RightRail } from './RightRail';
import { MenuIcon } from './icons';

export type ShellData = {
  userId: string | null;
  isAdmin: boolean;
  preferredLanguage: 'en' | 'fr';
  journeyId: string | null;
  journeyStatus: string | null;
  trackSlug: string;
  trackNameEn: string;
  trackNameFr: string;
  trackColor: string;
  trackIcon: string;
  scoredCount: number;
  totalPillars: number;
};

export function AppShell({ data, children }: { data: ShellData; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [switchWarn, setSwitchWarn] = useState(false);

  // Language lives here rather than in each page. Seeded from
  // profiles.preferred_language by the server layout, so a French reader now
  // gets French on arrival instead of English until they re-toggle.
  const [lang, setLang] = useState<'en' | 'fr'>(data.preferredLanguage);

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <SideRail
        data={data}
        lang={lang}
        setLang={setLang}
        open={open}
        onNavigate={() => setOpen(false)}
        onBlockedSwitch={() => setSwitchWarn(true)}
      />

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 shell:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* The rail is fixed, so the content column is offset rather than
          flowed beside it. Pages keep their own full-bleed layouts; the shell
          deliberately imposes no max-width here — the 900px reading column is
          a lesson-page concern and ships with the renderer in 5.2. */}
      <div className="shell:ml-[260px] flex min-h-screen">
        <main className="flex-1 min-w-0">{children}</main>
        <RightRail />
      </div>

      {/* Fixed rather than living inside a page's header, so it works over
          whatever background the current route paints. Its own dark pill
          gives it contrast on the white pages as well as the coloured hero. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={lang === 'en' ? 'Open navigation' : 'Ouvrir la navigation'}
        className="shell:hidden fixed top-3 left-3 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0B0B0C]/85 text-white shadow-lg backdrop-blur-sm cursor-pointer"
      >
        <MenuIcon />
      </button>

      {switchWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={() => setSwitchWarn(false)}>
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-[18px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? 'You have an active track' : 'Vous avez un parcours actif'}
            </h3>
            <p className="mb-6 text-[14px] leading-[1.7] text-gray-600">
              {lang === 'en'
                ? 'Complete your current coaching journey before starting a new one. Contact support if you need to switch.'
                : "Terminez votre parcours actuel avant d'en commencer un nouveau. Contactez le support si vous devez changer."}
            </p>
            <button
              onClick={() => setSwitchWarn(false)}
              className="w-full cursor-pointer rounded-xl border-none bg-[#F9250E] px-6 py-3 text-[14px] font-bold text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {lang === 'en' ? 'Got it' : 'Compris'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
