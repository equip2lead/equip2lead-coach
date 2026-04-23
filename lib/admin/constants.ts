export const trackColors: Record<string, string> = {
  leadership: '#F9250E',
  ministry: '#2563EB',
  marriage: '#DB2777',
  entrepreneur: '#EA580C',
  personal: '#059669',
};

export const trackIcons: Record<string, string> = {
  leadership: '\u{1F451}',
  ministry: '\u{1F4D6}',
  marriage: '\u{2764}️',
  entrepreneur: '\u{1F680}',
  personal: '\u{1F331}',
};

export const roleBadgeClass: Record<string, string> = {
  super_admin: 'bg-red-900/30 text-red-400 border border-red-700',
  admin: 'bg-amber-900/30 text-amber-400 border border-amber-700',
  coach: 'bg-blue-900/30 text-blue-400 border border-blue-700',
  user: 'bg-gray-800 text-gray-400 border border-gray-700',
};

export const tierBadgeClass: Record<string, string> = {
  free: 'bg-gray-800 text-gray-400 border border-gray-700',
  growth: 'bg-blue-900/30 text-blue-400 border border-blue-700',
  transform: 'bg-red-900/30 text-red-400 border border-red-700',
};

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return new Date(iso).toLocaleDateString();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
