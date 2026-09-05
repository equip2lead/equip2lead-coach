'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { NavItem } from './NavItem';
import { RailFooter } from './RailFooter';
import { buildNav, isNavItemActive } from '@/lib/shell/nav';
import type { ShellData } from './AppShell';

export function SideRail({
  data, lang, setLang, open, onNavigate, onBlockedSwitch,
}: {
  data: ShellData;
  lang: 'en' | 'fr';
  setLang: (l: 'en' | 'fr') => void;
  open: boolean;
  onNavigate: () => void;
  onBlockedSwitch: () => void;
}) {
  const pathname = usePathname();
  const nav = buildNav(data.trackSlug).filter((i) => !i.adminOnly || data.isAdmin);

  return (
    <aside
      // Fixed and always mounted. Below the `shell` breakpoint it slides off
      // canvas rather than unmounting, which is the whole point of 5.1: the
      // rail survives every route change instead of being rebuilt by each page.
      className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#0B0B0C] flex flex-col transition-transform duration-300 shell:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label={lang === 'en' ? 'Main navigation' : 'Navigation principale'}
    >
      <div className="px-6 pt-7 pb-4">
        <Link href="/" className="no-underline inline-block">
          <Logo size="sm" onDark />
        </Link>
      </div>

      {data.journeyId && (
        <div
          className="mx-4 mb-4 px-4 py-3 rounded-xl"
          style={{ background: `${data.trackColor}15`, border: `1px solid ${data.trackColor}25` }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[18px]">{data.trackIcon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-white truncate">
                {lang === 'en' ? data.trackNameEn : data.trackNameFr}
              </div>
              <div className="text-[10px] text-gray-500">
                {data.scoredCount}/{data.totalPillars} {lang === 'en' ? 'pillars' : 'piliers'}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            label={lang === 'en' ? item.en : item.fr}
            active={isNavItemActive(item, pathname)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <RailFooter
        lang={lang}
        setLang={setLang}
        userId={data.userId}
        journeyStatus={data.journeyStatus}
        onNavigate={onNavigate}
        onBlockedSwitch={onBlockedSwitch}
      />
    </aside>
  );
}
