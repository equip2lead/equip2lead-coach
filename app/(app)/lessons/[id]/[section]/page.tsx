import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlockRenderer } from '@/components/lessons/BlockRenderer';
import type { AssignmentView } from '@/components/lessons/AssignmentForm';
import { CurriculumSidebar } from '@/components/lessons/CurriculumSidebar';
import { LessonFooter } from '@/components/lessons/LessonFooter';
import { parseBlocks } from '@/lib/lesson-blocks';
import { splitBlocksBySection } from '@/lib/lessons/split-sections';
import { getModuleProgress } from '@/lib/lessons/progress';

export const dynamic = 'force-dynamic';

export default async function SectionPage({
  params, searchParams,
}: {
  params: { id: string; section: string };
  searchParams: { view?: string };
}) {
  // Anything other than the two known values is treated as absent rather than
  // as an error: a mangled link should still show the reader their assignment.
  const view: AssignmentView =
    searchParams.view === 'submission' || searchParams.view === 'edit' ? searchParams.view : null;

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

  // Whether this section asks for work the reader has not handed in. The
  // footer uses it to ask once before moving on, rather than letting an
  // unanswered assignment slip past unnoticed.
  let assignmentPending = false;
  if (section.hasAssignment) {
    const keys = section.blocks
      .filter((b) => b.type === 'assignment_prompt')
      .map((b) => (b as { assignment_key?: string }).assignment_key)
      .filter((k): k is string => !!k);
    if (keys.length > 0) {
      const { count } = await supabase
        .from('lesson_assignment_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('lesson_module_id', mod.id)
        .in('assignment_key', keys)
        .neq('status', 'draft');
      assignmentPending = (count ?? 0) < keys.length;
    }
  }

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
            sectionNumber={section.number}
            totalSections={sections.length}
            view={view}
          />
        </article>

        <LessonFooter
          moduleId={mod.id}
          current={section.number}
          total={sections.length}
          alreadyComplete={progress.completed.includes(section.number)}
          assignmentPending={assignmentPending}
          lang={lang}
        />
      </div>
    </div>
  );
}
