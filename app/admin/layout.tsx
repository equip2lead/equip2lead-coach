import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?redirect=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  let unhandledCount = 0;
  try {
    const { data } = await supabase.rpc('admin_list_contact_submissions', {
      filter_handled: 'unhandled',
      limit_n: 1,
      offset_n: 0,
    });
    unhandledCount = data?.[0]?.total_count ?? 0;
  } catch {}

  return (
    <AdminShell
      role={profile.role}
      displayName={profile.full_name || profile.email?.split('@')[0] || 'Admin'}
      unhandledCount={unhandledCount}
    >
      {children}
    </AdminShell>
  );
}
