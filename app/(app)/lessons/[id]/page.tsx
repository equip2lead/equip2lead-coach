import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LegacyDocumentLesson from '@/components/lessons/LegacyDocumentLesson';
import { BlockRenderer } from '@/components/lessons/BlockRenderer';
import { parseBlocks } from '@/lib/lesson-blocks';
import { splitBlocksBySection } from '@/lib/lessons/split-sections';
import { getModuleProgress } from '@/lib/lessons/progress';

// One id space, two content systems. An id is either an authored module or a
// legacy RAG document, so this route resolves which and hands off. Existing
// lessons keep the reader they have always had; nothing about them changes.

export const dynamic = 'force-dynamic';

const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

const DIFFICULTY: Record<string, { en: string; fr: string; color: string }> = {
  beginner: { en: 'Foundation', fr: 'Fondation', color: '#059669' },
  intermediate: { en: 'Application', fr: 'Application', color: '#D97706' },
  advanced: { en: 'Mastery', fr: 'Maîtrise', color: '#F9250E' },
};

export default async function LessonEntryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: mod } = await supabase
    .from('lesson_modules')
    .select('id, title_en, title_fr, subtitle_en, subtitle_fr, module_number, is_starting_point, difficulty, estimated_duration_minutes, cover_image_url, cover_image_alt, body_blocks, is_published, pillar_id, pillars(name_en, name_fr)')
    .eq('id', params.id)
    .maybeSingle();

  // Not a module — hand the id to the reader that has always served it.
  if (!mod) return <LegacyDocumentLesson />;

  const { data: profile } = await supabase
    .from('profiles').select('preferred_language, role').eq('id', user.id).single();
  const lang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  if (!mod.is_published && !isAdmin) notFound();

  const { data: journey } = await supabase
    .from('journeys').select('id').eq('user_id', user.id)
    .order('started_at', { ascending: false }).limit(1).maybeSingle();

  const { frontMatter, sections } = splitBlocksBySection(parseBlocks(mod.body_blocks));
  const progress = await getModuleProgress(journey?.id ?? null, mod.id);
  const next = progress.nextSection(sections.length);
  const done = progress.completed.length;
  const pct = sections.length ? Math.round((done / sections.length) * 100) : 0;

  const title = (lang === 'en' ? mod.title_en : mod.title_fr) || mod.title_en;
  const subtitle = (lang === 'en' ? mod.subtitle_en : mod.subtitle_fr) || mod.subtitle_en;
  const pillar = mod.pillars as unknown as { name_en: string; name_fr: string } | null;
  const diff = DIFFICULTY[mod.difficulty] ?? DIFFICULTY.beginner;
  const totalMinutes = mod.estimated_duration_minutes
    ?? sections.reduce((n, s) => n + s.readingMinutes, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── Hero ── */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[900px] px-8 py-12 max-md:px-5 max-md:py-8">
          <Link href="/lessons" className="text-[12.5px] font-semibold text-gray-500 no-underline hover:text-gray-800">
            ← {lang === 'en' ? 'All lessons' : 'Toutes les leçons'}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* The starting point precedes the numbered curriculum rather
                than opening it, so it is labelled by what it is instead of by
                a number that would file it as the first of the series. */}
            {mod.is_starting_point ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white">
                <span aria-hidden="true">🚪</span>
                {lang === 'en' ? 'Starting Point' : 'Point de départ'}
              </span>
            ) : mod.module_number != null ? (
              <span className="rounded-full bg-[#F9250E] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white">
                {`Module ${mod.module_number}`}
              </span>
            ) : null}
            {pillar && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-gray-600">
                {lang === 'en' ? pillar.name_en : pillar.name_fr}
              </span>
            )}
            <span
              className="rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider"
              style={{ background: `${diff.color}15`, color: diff.color }}
            >
              {lang === 'en' ? diff.en : diff.fr}
            </span>
            {!mod.is_published && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-amber-800">
                {lang === 'en' ? 'Draft' : 'Brouillon'}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-[34px] font-bold leading-[1.2] text-gray-900 max-md:text-[26px]" style={{ fontFamily: DISPLAY }}>
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-[16px] text-gray-500">{subtitle}</p>}

          <p className="mt-4 text-[13.5px] text-gray-500">
            {lang === 'en' ? 'By' : 'Par'} <strong className="font-semibold text-gray-700">Dr. Denis Ekobena</strong>
            {' · '}{sections.length} {lang === 'en' ? 'sections' : 'sections'}
            {' · '}{totalMinutes} min
          </p>

          {sections.length > 0 && (
            <div className="mt-8">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[12.5px] font-semibold text-gray-600">
                  {done}/{sections.length} {lang === 'en' ? 'sections complete' : 'sections terminées'}
                </span>
                <span className="text-[12.5px] font-bold tabular-nums text-[#F9250E]">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#F9250E] transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>

              <Link
                href={`/lessons/${mod.id}/${next ?? 1}`}
                className="mt-6 inline-block rounded-xl bg-[#F9250E] px-7 py-3.5 text-[15px] font-bold text-white no-underline transition-transform hover:-translate-y-px"
                style={{ fontFamily: DISPLAY, boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
              >
                {next === null
                  ? (lang === 'en' ? 'Review Module →' : 'Revoir le module →')
                  : done > 0
                    ? (lang === 'en' ? 'Continue Module →' : 'Continuer le module →')
                    : (lang === 'en' ? 'Start Module →' : 'Commencer le module →')}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ── Front matter: the module's own introduction ── */}
      {frontMatter.length > 1 && (
        <section className="border-b border-gray-200 bg-white/60">
          <div className="mx-auto max-w-[900px] px-8 py-8 max-md:px-5">
            <BlockRenderer
              blocks={frontMatter.filter((b) => b.type !== 'heading')}
              moduleId={mod.id}
              journeyId={journey?.id ?? null}
              lang={lang}
            />
          </div>
        </section>
      )}

      {/* ── Curriculum ── */}
      <section className="mx-auto max-w-[900px] px-8 py-12 max-md:px-5 max-md:py-8">
        <h2 className="mb-5 text-[13px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: DISPLAY }}>
          {lang === 'en' ? 'Course content' : 'Contenu du cours'}
        </h2>

        <ol className="flex list-none flex-col gap-3 p-0">
          {sections.map((s) => {
            const isDone = progress.completed.includes(s.number);
            const isNext = s.number === next;
            return (
              <li key={s.number}>
                <Link
                  href={`/lessons/${mod.id}/${s.number}`}
                  className={`flex items-center gap-4 rounded-2xl border bg-white px-5 py-4 no-underline transition-all hover:-translate-y-px hover:shadow-md ${
                    isNext ? 'border-[#F9250E]/40 shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                      isDone ? 'bg-emerald-50 text-emerald-600' : isNext ? 'bg-[#F9250E] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                    style={{ fontFamily: DISPLAY }}
                  >
                    {isDone ? '✓' : s.number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-semibold leading-snug text-gray-900" style={{ fontFamily: SERIF }}>
                      {s.shortTitle}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-gray-500">
                      {s.readingMinutes} min
                      {s.hasScorecard && ` · ${lang === 'en' ? 'self-assessment' : 'auto-évaluation'}`}
                      {s.hasAssignment && ` · ${lang === 'en' ? 'assignment' : 'devoir'}`}
                      {isDone && ` · ${lang === 'en' ? 'complete' : 'terminé'}`}
                    </span>
                  </span>

                  <span aria-hidden="true" className="shrink-0 text-[15px] text-gray-300">→</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
