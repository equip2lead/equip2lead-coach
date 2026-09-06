'use client';

import { useEffect, useState } from 'react';

// The one thing on this page the server cannot know. Profiles carry no
// timezone, so a server-rendered "Good morning" would be UTC morning — wrong
// for most of the world and confidently so. This reads the reader's own clock
// after hydration.
//
// Renders the neutral form first so the sentence is complete and correct
// before hydration, rather than flashing an empty gap.

export function TimeOfDay({ lang, name }: { lang: 'en' | 'fr'; name: string }) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    const en = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const fr = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
    setGreeting(lang === 'en' ? en : fr);
  }, [lang]);

  const fallback = lang === 'en' ? 'Hello' : 'Bonjour';
  return <>{greeting ?? fallback}, {name}.</>;
}
