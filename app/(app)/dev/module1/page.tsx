import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlockRenderer } from '@/components/lessons/BlockRenderer';
import { parseBlocks, type LessonBlock, type UnknownBlock } from '@/lib/lesson-blocks';

// Temporary harness for 5.2a: renders Module 1's real stored blocks so the
// renderer can be reviewed against actual content rather than a fixture.
// Deleted once /lessons/[id] renders modules for real in 5.2c.
//
// super_admin only, and notFound() rather than redirect() so the route does
// not advertise its own existence to anyone else.

export const dynamic = 'force-dynamic';

const MODULE_ID = '2218e390-31b4-4c6f-9661-0f021da728df';

/** One synthetic block per type the authored file happens not to use, so the
   harness exercises all twelve plus the unknown-block path. Appended after
   the real content; nothing synthetic is ever written to the database. */
const SYNTHETIC: Array<LessonBlock | UnknownBlock> = [
  { id: 'dev-h', type: 'heading', level: 2, text: 'Renderer harness — types not present in Module 1' },
  { id: 'dev-p', type: 'paragraph', text: 'Everything above is Module 1 as stored. Everything below is synthetic, added only to exercise the remaining block types: **video_embed**, **image**, a *captioned* table, a titled callout, the two unused callout variants, and an unknown block.' },
  { id: 'dev-tip', type: 'callout', variant: 'tip', title: 'Tip variant', text: 'Green. Unused by Module 1 but defined in the type union.' },
  { id: 'dev-scr', type: 'callout', variant: 'scripture', title: 'Scripture variant', text: 'Purple. Also unused by Module 1.' },
  { id: 'dev-bad', type: 'callout', variant: 'chartreuse' as never, text: 'Unrecognised variant — must fall back to note grey rather than disappear.' },
  { id: 'dev-vid', type: 'video_embed', youtubeId: 'aqz-KE-bpKQ', title: 'youtube-nocookie embed, lazy-loaded' },
  { id: 'dev-img', type: 'image', url: '/images/leadership.jpg', alt: 'Leadership track cover image', caption: 'Image block with caption' },
  { id: 'dev-unknown', type: 'carousel', slides: 3 } as UnknownBlock,
];

export default async function DevModule1Page() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from('profiles').select('role, preferred_language').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') notFound();

  const lang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';

  const { data: mod } = await supabase
    .from('lesson_modules')
    .select('id, title_en, subtitle_en, module_number, difficulty, estimated_duration_minutes, body_blocks, is_published')
    .eq('id', MODULE_ID)
    .maybeSingle();
  if (!mod) notFound();

  const { data: journey } = await supabase
    .from('journeys').select('id').eq('user_id', user.id)
    .order('started_at', { ascending: false }).limit(1).maybeSingle();

  const real = parseBlocks(mod.body_blocks);
  const blocks = [...real, ...SYNTHETIC];

  const counts = real.reduce<Record<string, number>>((a, b) => ((a[b.type] = (a[b.type] || 0) + 1), a), {});

  return (
    <div className="bg-white">
      <header className="border-b border-gray-200 bg-[#0B0B0C] px-8 py-6 max-md:px-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#F9250E]">Dev harness · super_admin only</p>
        <h1 className="mt-1 text-[24px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {mod.title_en}
        </h1>
        <p className="mt-1 text-[13px] text-gray-400">
          {mod.subtitle_en} · {mod.difficulty} · {mod.estimated_duration_minutes} min ·{' '}
          {mod.is_published ? 'published' : 'draft'} · {real.length} stored blocks + {SYNTHETIC.length} synthetic
        </p>
        <p className="mt-2 font-mono text-[11px] text-gray-500">
          {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join('  ')}
        </p>
      </header>

      <article className="px-8 py-12 max-md:px-4">
        <BlockRenderer blocks={blocks} moduleId={mod.id} journeyId={journey?.id ?? null} lang={lang} />
      </article>
    </div>
  );
}
