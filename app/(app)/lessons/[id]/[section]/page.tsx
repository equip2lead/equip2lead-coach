import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlockRenderer } from '@/components/lessons/BlockRenderer';
import { CurriculumSidebar } from '@/components/lessons/CurriculumSidebar';
import { LessonFooter } from '@/components/lessons/LessonFooter';
import { parseBlocks } from '@/lib/lesson-blocks';
import { splitBlocksBySection } from '@/lib/lessons/split-sections';
import { getModuleProgress } from '@/lib/lessons/progress';

export const dynamic = 'force-dynamic';

export default async function SectionPage({ params }: { params: { id: string; section: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: mod } = await supabase
    .from('lesson_modules')
    .select('id, title_en, title_fr, body_blocks, is_published, module_number, is_starting_point')
    .eq('id', params.id)
    .maybeSingle();
  if (!mod) notFound();

  const { data: profile } = await supabase
    .from('profiles').select('preferred_language, role').eq('id', user.id).single();
  const lang: 'en' | 'fr' = profile?.preferred_language === 'fr' ? 'fr' : 'en';

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  if (!mod.is_published && !isAdmin) notFound();

  const { sections } = splitBlocksBySection(parseBlocks(mod.body_blocks));

  // A section number out of range sends the reader to the overview rather than
  // to a 404: the module exists, that page of it does not.
  const n = Number(params.section);
  if (!Number.isInteger(n) || n < 1 || n > sections.length) redirect(`/lessons/${mod.id}`);
  const section = sections[n - 1];

  const { data: journey } = await supabase
    .from('journeys').select('id').eq('user_id', user.id)
    .order('started_at', { ascending: false }).limit(1).maybeSingle();

  const progress = await getModuleProgress(journey?.id ?? null, mod.id);
  const title = (lang === 'en' ? mod.title_en : mod.title_fr) || mod.title_en;

  return (
    <div className="flex min-h-screen bg-white max-shell:flex-col">
      <CurriculumSidebar
        moduleId={mod.id}
        moduleTitle={title}
        moduleNumber={mod.module_number}
        isStartingPoint={mod.is_starting_point}
        sections={sections.map((s) => ({ number: s.number, shortTitle: s.shortTitle, readingMinutes: s.readingMinutes }))}
        current={section.number}
        completed={progress.completed}
        lang={lang}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <article className="flex-1 px-8 pb-16 pt-10 max-md:px-4">
          <p className="mx-auto mb-2 w-full max-w-[720px] text-[11.5px] font-bold uppercase tracking-wider text-[#F9250E]">
            {lang === 'en' ? `Section ${section.number} of ${sections.length}` : `Section ${section.number} sur ${sections.length}`}
            {section.readingMinutes ? ` · ${section.readingMinutes} min` : ''}
          </p>

          <BlockRenderer
            blocks={section.blocks}
            moduleId={mod.id}
            journeyId={journey?.id ?? null}
            lang={lang}
          />
        </article>

        <LessonFooter
          moduleId={mod.id}
          current={section.number}
          total={sections.length}
          alreadyComplete={progress.completed.includes(section.number)}
          lang={lang}
        />
      </div>
    </div>
  );
}
