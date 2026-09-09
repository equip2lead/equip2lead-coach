import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseBlocks } from '@/lib/lesson-blocks';
import { splitBlocksBySection } from '@/lib/lessons/split-sections';

export const dynamic = 'force-dynamic';

/**
 * Module cards for the lessons list, summarised server-side.
 *
 * The list needs three numbers per module — how many sections it has, how long
 * it reads, and how many of those sections are done. Only the first two are
 * derived from `body_blocks`, and deriving them in the browser meant shipping
 * every published module's entire block array to the client: about 196KB across
 * four modules, growing with every module authored, to produce two integers.
 *
 * Sections are still derived rather than stored, so an edit to a module's
 * blocks cannot desync a cached count. What changes is only *where* the
 * derivation happens. `splitBlocksBySection` stays the single definition of
 * what a section is — a stored column or a SQL re-implementation would be a
 * second definition, free to drift from the renderer the moment either moved.
 */
export type ModuleSummary = {
  id: string;
  title_en: string | null;
  title_fr: string | null;
  subtitle_en: string | null;
  subtitle_fr: string | null;
  module_number: number | null;
  is_starting_point: boolean;
  /** NOT NULL in the schema, default 'beginner'. */
  difficulty: string;
  estimated_duration_minutes: number | null;
  sectionCount: number;
  /** Sum of the sections' reading estimates, used only when the module has no
      authored duration. */
  fallbackMinutes: number;
};

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  // Same journey selection as the lessons page, so the two cannot disagree
  // about which track the reader is on.
  const { data: journey } = await supabase
    .from('journeys')
    .select('track_id')
    .eq('user_id', user.id)
    .in('status', ['active', 'paused'])
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!journey?.track_id) return NextResponse.json({ modules: [] });

  const { data: rows, error } = await supabase
    .from('lesson_modules')
    .select('id, title_en, title_fr, subtitle_en, subtitle_fr, module_number, is_starting_point, difficulty, estimated_duration_minutes, body_blocks')
    .eq('track_id', journey.track_id)
    .eq('is_published', true)
    .order('is_starting_point', { ascending: false })
    .order('module_number', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const modules: ModuleSummary[] = (rows ?? []).map((m) => {
    const { sections } = splitBlocksBySection(parseBlocks(m.body_blocks));
    return {
      id: m.id,
      title_en: m.title_en,
      title_fr: m.title_fr,
      subtitle_en: m.subtitle_en,
      subtitle_fr: m.subtitle_fr,
      module_number: m.module_number,
      is_starting_point: !!m.is_starting_point,
      difficulty: m.difficulty ?? 'beginner',
      estimated_duration_minutes: m.estimated_duration_minutes,
      sectionCount: sections.length,
      fallbackMinutes: sections.reduce((n, s) => n + s.readingMinutes, 0),
    };
  });

  return NextResponse.json({ modules });
}
