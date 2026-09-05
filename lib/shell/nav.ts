import type { ComponentType } from 'react';
import {
  HomeIcon, PlayIcon, BookIcon, ChatIcon, CalIcon,
  BarIcon, TrendIcon, SettingsIcon, AdminIcon,
} from '@/components/shell/icons';

export type NavItemDef = {
  key: string;
  href: string;
  en: string;
  fr: string;
  Icon: ComponentType;
  /** Rendered as a small pill beside the label. */
  badge?: string;
  /** false ⇒ greyed out with a "coming soon" tooltip rather than hidden, so
      the shape of what is coming stays visible. */
  enabled?: boolean;
  /** Only shown to admins. */
  adminOnly?: boolean;
  /** Marks a nav item active for any route beneath it, e.g. /lessons/<id>
      keeps Lessons highlighted. */
  matchPrefix?: boolean;
};

/** `trackSlug` feeds the Results query string; it comes from
    journeys.tracks.slug and falls back the same way the dashboard does. */
export function buildNav(trackSlug: string): NavItemDef[] {
  return [
    { key: 'dashboard', href: '/dashboard',    en: 'Dashboard', fr: 'Tableau de bord', Icon: HomeIcon },
    { key: 'my-track',  href: '/my-track',     en: 'My Track',  fr: 'Mon Parcours',    Icon: PlayIcon },
    { key: 'lessons',   href: '/lessons',      en: 'Lessons',   fr: 'Leçons',          Icon: BookIcon, matchPrefix: true },
    { key: 'ai-coach',  href: '/ai-coach',     en: 'AI Coach',  fr: 'Coach IA',        Icon: ChatIcon, badge: 'NEW' },
    { key: 'checkin',   href: '/weekly-checkin', en: 'Check-in', fr: 'Bilan',          Icon: CalIcon },
    { key: 'results',   href: `/results?track=${trackSlug}`, en: 'Results', fr: 'Résultats', Icon: BarIcon },
    { key: 'progress',  href: '/progress',     en: 'Progress',  fr: 'Progression',     Icon: TrendIcon, enabled: false },
    { key: 'settings',  href: '/settings',     en: 'Settings',  fr: 'Paramètres',      Icon: SettingsIcon },
    { key: 'admin',     href: '/admin',        en: 'Admin',     fr: 'Admin',           Icon: AdminIcon, adminOnly: true, matchPrefix: true },
  ];
}

/** Compares against the pathname only — a nav href carrying a query string
    (Results) would never match otherwise. */
export function isNavItemActive(item: NavItemDef, pathname: string): boolean {
  const path = item.href.split('?')[0];
  return item.matchPrefix ? pathname === path || pathname.startsWith(`${path}/`) : pathname === path;
}
