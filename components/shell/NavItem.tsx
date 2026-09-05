'use client';

import Link from 'next/link';
import { LockIcon } from './icons';
import type { NavItemDef } from '@/lib/shell/nav';

// Active/idle classes are the ones the dashboard sidebar used, kept verbatim
// so the extracted rail is visually identical to the one it replaces.
const BASE = 'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium no-underline transition-colors';
const ACTIVE = 'bg-white/10 text-white';
const IDLE = 'text-gray-500 hover:text-gray-300 hover:bg-white/5';

export function NavItem({
  item, label, active, onNavigate,
}: {
  item: NavItemDef;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.Icon;

  // Disabled items stay visible rather than being hidden: the reader can see
  // what is coming. Rendered as a button so it is still focusable and can
  // announce itself, but it goes nowhere.
  if (item.enabled === false) {
    return (
      <div className="relative group">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={`${BASE} w-full text-left bg-transparent border-none text-gray-600 cursor-not-allowed`}
          style={{ fontFamily: 'inherit' }}
        >
          <Icon />
          <span className="flex-1">{label}</span>
          <span className="text-gray-700"><LockIcon /></span>
        </button>
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 whitespace-nowrap rounded-md bg-[#1A1A24] px-2.5 py-1.5 text-[11px] font-medium text-gray-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          Coming soon
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`${BASE} ${active ? ACTIVE : IDLE}`}
    >
      <Icon />
      <span className="flex-1">{label}</span>
      {item.badge && (
        <span className="rounded-full bg-[#F9250E] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
