import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AuditTable } from './AuditTable';

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?redirect=/admin/audit');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'super_admin') {
    redirect('/admin/overview');
  }

  const { data: rows } = await supabase
    .from('super_admin_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div className="max-w-[1200px] mx-auto px-8 max-md:px-5 py-8">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-[22px] font-bold text-white">Audit log</h1>
        <span className="text-[12px] text-neutral-500">{rows?.length ?? 0} most recent entries</span>
      </div>
      <AuditTable rows={rows || []} />
    </div>
  );
}
