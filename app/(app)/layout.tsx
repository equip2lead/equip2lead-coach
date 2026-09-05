import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell, type ShellData } from '@/components/shell/AppShell';

// Route group: the parentheses keep these URLs exactly as they were —
// /dashboard is still /dashboard. What changes is that the sidebar now lives
// here, above the pages, so it survives navigation instead of being torn down
// and rebuilt by whichever page happens to own it.
//
// Server component on the same pattern as app/admin/layout.tsx: fetch once,
// hand a plain object to the client shell. Fetching here rather than in a
// client effect is what lets the track badge be correct on /lessons and
// /settings, not just on the dashboard.

const trackMeta: Record<string, { color: string; icon: string }> = {
  leadership: { color: '#F9250E', icon: '👑' },
  ministry: { color: '#2563EB', icon: '📖' },
  marriage: { color: '#DB2777', icon: '❤️' },
  entrepreneur: { color: '#EA580C', icon: '🚀' },
  personal: { color: '#059669', icon: '🌱' },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, preferred_language')
    .eq('id', user.id)
    .single();

  const { data: journey } = await supabase
    .from('journeys')
    .select('id, status, track_id, tracks(slug, name_en, name_fr)')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Counts only — the numbers under the track badge. The dashboard still
  // loads the scores themselves; it needs the values, the rail needs a tally.
  let scoredCount = 0;
  let totalPillars = 5;
  if (journey?.id) {
    const [{ count: scored }, { count: total }] = await Promise.all([
      supabase.from('pillar_scores').select('id', { count: 'exact', head: true }).eq('journey_id', journey.id),
      supabase.from('pillars').select('id', { count: 'exact', head: true }).eq('track_id', journey.track_id),
    ]);
    scoredCount = scored ?? 0;
    if (total) totalPillars = total;
  }

  const track = journey?.tracks as unknown as
    { slug: string; name_en: string; name_fr: string } | null | undefined;
  const trackSlug = track?.slug || 'leadership';

  const data: ShellData = {
    userId: user.id,
    isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
    preferredLanguage: profile?.preferred_language === 'fr' ? 'fr' : 'en',
    journeyId: journey?.id ?? null,
    journeyStatus: journey?.status ?? null,
    trackSlug,
    trackNameEn: track?.name_en ?? '',
    trackNameFr: track?.name_fr ?? '',
    trackColor: trackMeta[trackSlug]?.color || '#F9250E',
    trackIcon: trackMeta[trackSlug]?.icon || '👑',
    scoredCount,
    totalPillars,
  };

  return <AppShell data={data}>{children}</AppShell>;
}
