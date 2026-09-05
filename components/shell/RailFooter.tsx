'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { switchLanguage } from '@/lib/language';
import { SwitchIcon, LogOutIcon } from './icons';

const BTN = 'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer w-full text-left';

export function RailFooter({
  lang, setLang, userId, journeyStatus, onNavigate, onBlockedSwitch,
}: {
  lang: 'en' | 'fr';
  setLang: (l: 'en' | 'fr') => void;
  userId: string | null;
  journeyStatus: string | null;
  onNavigate: () => void;
  onBlockedSwitch: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  // Same rule the dashboard applied: no active journey (or a finished one)
  // means the track is free to change; otherwise the page shows its warning
  // modal rather than silently navigating away from work in progress.
  const handleSwitchTrack = () => {
    onNavigate();
    if (!journeyStatus || journeyStatus === 'completed') router.push('/track-selection');
    else onBlockedSwitch();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="px-4 pb-6 mt-auto flex flex-col gap-1">
      <button onClick={handleSwitchTrack} className={BTN} style={{ fontFamily: 'inherit' }}>
        <SwitchIcon />{lang === 'en' ? 'Switch Track' : 'Changer'}
      </button>
      <button
        onClick={() => { if (userId) switchLanguage(lang === 'en' ? 'fr' : 'en', userId, supabase, setLang); }}
        className={BTN}
        style={{ fontFamily: 'inherit' }}
      >
        🌐 {lang === 'en' ? 'FR' : 'EN'}
      </button>
      <button onClick={signOut} className={`${BTN} hover:!text-red-400`} style={{ fontFamily: 'inherit' }}>
        <LogOutIcon />{lang === 'en' ? 'Log out' : 'Déconnexion'}
      </button>
    </div>
  );
}
