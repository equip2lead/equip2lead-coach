import type { SupabaseClient } from '@supabase/supabase-js';
import { mergeAssessmentData, type AssessmentData } from '@/lib/safety';

/**
 * Saves intake answers to journeys.pre_assessment_data and reports whether it
 * worked. The stored value is re-read first: writing without it could erase a
 * safety flag, so a failed read stops the save. An update blocked by row-level
 * security returns no error and no rows, so the row count is checked as well.
 */
export async function saveAssessmentData(
  supabase: SupabaseClient,
  journeyId: string,
  incoming: AssessmentData,
): Promise<boolean> {
  const { data: current, error: readError } = await supabase
    .from('journeys')
    .select('pre_assessment_data')
    .eq('id', journeyId)
    .single();
  if (readError || !current) return false;

  const { data: updated, error } = await supabase
    .from('journeys')
    .update({
      pre_assessment_data: mergeAssessmentData(current.pre_assessment_data, incoming),
      updated_at: new Date().toISOString(),
    })
    .eq('id', journeyId)
    .select('id');
  return !error && (updated?.length ?? 0) > 0;
}
