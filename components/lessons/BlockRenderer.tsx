import { Scorecard } from './Scorecard';
import { AssignmentForm, type AssignmentView } from './AssignmentForm';
import {
  isKnownBlock, normaliseCalloutVariant,
  type CalloutVariant, type LessonBlock, type UnknownBlock,
} from '@/lib/lesson-blocks';

// Server component. Only the scorecard needs a browser — everything else is
// static markup, so the reading experience ships with no JavaScript behind it
// and the assignment form (5.2c) becomes the one other island.

const READING_COLUMN = 'mx-auto w-full max-w-[720px]';
const SERIF = "Georgia, 'Libre Baskerville', serif";
const DISPLAY = "'Plus Jakarta Sans', sans-serif";

/* ── inline markdown ─────────────────────────────────────────────────────────
   Authored paragraphs carry **bold**, *italic* and [links](url) and nothing
   else. Escaping first and only then introducing tags means authored text can
   never inject markup, so this stays safe to feed to dangerouslySetInnerHTML. */
function inlineMarkdown(raw: string): string {
  const escaped = raw
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#F9250E] underline underline-offset-2">$1</a>'
    );
}

function Inline({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return <span className={className} style={style} dangerouslySetInnerHTML={{ __html: inlineMarkdown(text) }} />;
}

/* ── callout variants ─────────────────────────────────────────────────────── */
const CALLOUT: Record<CalloutVariant, { bar: string; bg: string; fg: string; icon: string; label: string }> = {
  note:      { bar: '#9CA3AF', bg: '#F9FAFB', fg: '#374151', icon: '📝', label: 'Note' },
  info:      { bar: '#2563EB', bg: '#EFF6FF', fg: '#1E3A8A', icon: 'ℹ️', label: 'Info' },
  warning:   { bar: '#EA580C', bg: '#FFF7ED', fg: '#7C2D12', icon: '⚠️', label: 'Warning' },
  tip:       { bar: '#059669', bg: '#ECFDF5', fg: '#065F46', icon: '💡', label: 'Tip' },
  scripture: { bar: '#7C3AED', bg: '#F5F3FF', fg: '#4C1D95', icon: '✝️', label: 'Scripture' },
};

export function BlockRenderer({
  blocks, moduleId, journeyId, lang = 'en', sectionNumber, totalSections, view = null,
}: {
  blocks: Array<LessonBlock | UnknownBlock>;
  moduleId: string;
  journeyId: string | null;
  lang?: 'en' | 'fr';
  /** Present on a section page. Absent on the overview, where an assignment
      is shown as a prompt rather than offered for answering. */
  sectionNumber?: number;
  totalSections?: number;
  /** From ?view= on the section URL. Decides which face of the assignment the
      reader lands on, so a link's label and its effect are the same thing. */
  view?: AssignmentView;
}) {
  return (
    <div className="lesson-body">
      {blocks.map((block) => (
        <Block
          key={block.id} block={block} moduleId={moduleId} journeyId={journeyId}
          lang={lang} sectionNumber={sectionNumber} totalSections={totalSections}
          view={view}
        />
      ))}
    </div>
  );
}

function Block({
  block, moduleId, journeyId, lang, sectionNumber, totalSections, view,
}: {
  block: LessonBlock | UnknownBlock;
  moduleId: string;
  journeyId: string | null;
  lang: 'en' | 'fr';
  sectionNumber?: number;
  totalSections?: number;
  view: AssignmentView;
}) {
  // A block type this build has never heard of must not blank the page. In
  // production it is skipped; while authoring it is surfaced loudly, because
  // silently dropping content is the failure that goes unnoticed longest.
  if (!isKnownBlock(block)) {
    if (process.env.NODE_ENV !== 'development') return null;
    return (
      <div className={`${READING_COLUMN} my-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3`}>
        <p className="text-[13px] font-semibold text-amber-900">Unknown block type: {block.type}</p>
        <p className="text-[11.5px] text-amber-700 mt-0.5">
          Skipped in production. Add it to lib/lesson-blocks.ts to render it.
        </p>
      </div>
    );
  }

  switch (block.type) {
    case 'heading': {
      const H = (block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4';
      const size = block.level === 2 ? 'text-[28px] max-md:text-[24px] mt-14 mb-4'
        : block.level === 3 ? 'text-[21px] mt-10 mb-3'
        : 'text-[17px] mt-7 mb-2';
      return (
        <H id={block.id} className={`${READING_COLUMN} ${size} font-bold text-gray-900 leading-tight scroll-mt-24`} style={{ fontFamily: DISPLAY }}>
          {block.text}
        </H>
      );
    }

    case 'paragraph':
      return (
        <p className={`${READING_COLUMN} text-[17px] max-md:text-[16px] leading-[1.6] text-gray-800 mb-5`} style={{ fontFamily: SERIF }}>
          <Inline text={block.text} />
        </p>
      );

    case 'quote':
      return (
        <blockquote className={`${READING_COLUMN} my-8 border-l-4 border-[#F9250E] pl-6 max-md:pl-4`}>
          <p className="text-[18px] max-md:text-[17px] italic leading-[1.6] text-gray-700" style={{ fontFamily: SERIF }}>
            <Inline text={block.text} />
          </p>
          {block.attribution && (
            <footer className="mt-2 text-[13px] font-semibold not-italic text-gray-500">— {block.attribution}</footer>
          )}
        </blockquote>
      );

    case 'pull_quote_card':
      return (
        <aside className={`${READING_COLUMN} my-14 rounded-2xl border border-[#F9250E]/15 bg-[#F9250E]/[0.04] px-10 py-10 max-md:px-6 max-md:py-8 text-center`}>
          <p className="text-[28px] max-md:text-[22px] font-bold leading-[1.35] text-gray-900" style={{ fontFamily: SERIF }}>
            <Inline text={block.text} />
          </p>
          {block.attribution && (
            <p className="mt-4 text-[13px] font-semibold uppercase tracking-wider text-[#F9250E]">{block.attribution}</p>
          )}
        </aside>
      );

    case 'table':
      return (
        <figure className={`${READING_COLUMN} my-10`}>
          {/* Desktop: a real table. */}
          <div className="max-md:hidden overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse text-left">
              {block.headers?.length > 0 && (
                <thead>
                  <tr className="bg-[#F9250E]">
                    {block.headers.map((h, i) => (
                      <th key={i} scope="col" className="px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-white">{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className={r % 2 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, c) => (
                      <td key={c} className="border-t border-gray-100 px-4 py-3 text-[14.5px] leading-[1.6] text-gray-700">
                        <Inline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: one card per row, each cell labelled by its header, so a
              five-column comparison stays readable at 375px instead of
              becoming a horizontal scroll nobody discovers. */}
          <div className="hidden max-md:flex flex-col gap-3">
            {block.rows.map((row, r) => (
              <div key={r} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {row.map((cell, c) => (
                  <div key={c} className="border-b border-gray-100 last:border-b-0 px-4 py-3">
                    {block.headers?.[c] && (
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#F9250E] mb-1">{block.headers[c]}</div>
                    )}
                    <div className="text-[14.5px] leading-[1.6] text-gray-700"><Inline text={cell} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {block.caption && (
            <figcaption className="mt-2 text-center text-[12.5px] text-gray-500">{block.caption}</figcaption>
          )}
        </figure>
      );

    case 'callout': {
      const v = CALLOUT[normaliseCalloutVariant(block.variant)];
      return (
        <div
          className={`${READING_COLUMN} my-6 rounded-r-xl border-l-4 px-5 py-4`}
          style={{ borderColor: v.bar, background: v.bg }}
        >
          <div className="flex gap-3">
            <span aria-hidden="true" className="text-[15px] leading-[1.5] select-none">{v.icon}</span>
            <div className="min-w-0 flex-1">
              {block.title && (
                <p className="mb-1 text-[13.5px] font-bold" style={{ color: v.fg, fontFamily: DISPLAY }}>{block.title}</p>
              )}
              <p className="text-[14.5px] leading-[1.65]" style={{ color: v.fg }}>
                <Inline text={block.text} />
              </p>
            </div>
          </div>
        </div>
      );
    }

    case 'reflection_questions':
      return (
        <section className={`${READING_COLUMN} my-12 rounded-2xl border border-[#F9250E]/12 bg-[#F9250E]/[0.03] px-8 py-8 max-md:px-5 max-md:py-6`}>
          <h3 className="mb-5 text-[17px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>
            {block.title ?? (lang === 'en' ? 'Reflection' : 'Réflexion')}
          </h3>
          <ol className="flex list-none flex-col gap-5 p-0">
            {block.questions.map((q, i) => (
              <li key={i} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F9250E] text-[11.5px] font-bold text-white"
                  style={{ fontFamily: DISPLAY }}
                >
                  {i + 1}
                </span>
                <p className="text-[16px] leading-[1.6] text-gray-800" style={{ fontFamily: SERIF }}>
                  <Inline text={q} />
                </p>
              </li>
            ))}
          </ol>
        </section>
      );

    case 'scorecard':
      return (
        <div className={READING_COLUMN}>
          <Scorecard block={block} moduleId={moduleId} journeyId={journeyId} lang={lang} />
        </div>
      );

    case 'divider':
      return <hr className="mx-auto my-12 w-[40%] border-0 border-t border-[#F9250E]/30" />;

    case 'video_embed':
      return (
        <figure className={`${READING_COLUMN} my-10`}>
          <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(block.youtubeId)}`}
              title={block.title ?? (lang === 'en' ? 'Lesson video' : 'Vidéo de la leçon')}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.title && <figcaption className="mt-2 text-center text-[12.5px] text-gray-500">{block.title}</figcaption>}
        </figure>
      );

    case 'image':
      return (
        <figure className={`${READING_COLUMN} my-10`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.alt} loading="lazy" className="w-full rounded-xl" />
          {block.caption && <figcaption className="mt-2 text-center text-[12.5px] text-gray-500">{block.caption}</figcaption>}
        </figure>
      );

    case 'assignment_prompt':
      // The prompt card states what is being asked; the form beneath it is
      // where it gets answered. On the overview page there is no section to
      // complete, so the prompt is shown without the form rather than
      // offering a submission that would have nowhere to land.
      return (
        <>
        <section className={`${READING_COLUMN} my-12 rounded-2xl border-2 border-[#F9250E]/20 bg-white px-8 py-8 max-md:px-5 max-md:py-6`}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#F9250E]">
            {lang === 'en' ? 'Assignment' : 'Devoir'}
          </p>
          <h3 className="mb-3 text-[22px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>{block.title}</h3>
          <p className="mb-6 text-[15.5px] leading-[1.65] text-gray-700" style={{ fontFamily: SERIF }}>
            <Inline text={block.instructions} />
          </p>

          <ol className="flex list-none flex-col gap-6 p-0">
            {block.prompts.map((p) => (
              <li key={p.number} className="border-l-2 border-gray-200 pl-5">
                <p className="mb-1.5 text-[14px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>
                  {p.number}. {p.heading}
                </p>
                <p className="text-[14.5px] leading-[1.6] text-gray-600"><Inline text={p.guidance} /></p>
                {p.example && (
                  <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-[13.5px] italic leading-[1.6] text-gray-500">
                    {p.example}
                  </p>
                )}
              </li>
            ))}
          </ol>

          {(block.word_min || block.word_max) && (
            <p className="mt-6 text-[12.5px] font-medium text-gray-500">
              {lang === 'en' ? 'Target length' : 'Longueur visée'}: {block.word_min ?? 0}–{block.word_max ?? '∞'}{' '}
              {lang === 'en' ? 'words' : 'mots'}
            </p>
          )}

        </section>
        {sectionNumber != null && totalSections != null && (
          <div className={READING_COLUMN}>
            <AssignmentForm
              block={block}
              moduleId={moduleId}
              sectionNumber={sectionNumber}
              totalSections={totalSections}
              lang={lang}
              view={view}
            />
          </div>
        )}
        </>
      );
  }
}
