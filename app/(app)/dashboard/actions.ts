'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { NextStepMode } from '@/lib/dashboard/data';

/** How the dashboard should choose what to offer next. Validated here as well
    as by the CHECK constraint: the column refuses a bad value either way, but
    a returned message is more use than a constraint violation. */
export async function setNextStepMode(mode: NextStepMode): Promise<{ ok: boolean; error?: string }> {
  if (mode !== 'assessment' && mode !== 'sequential') {
    return { ok: false, error: 'Unknown mode' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not signed in' };

  const { error } = await supabase
    .from('profiles')
    .update({ next_step_mode: mode })
    .eq('id', user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/dashboard');
  return { ok: true };
}
