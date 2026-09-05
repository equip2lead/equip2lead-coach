import type { LessonBlock, UnknownBlock } from '@/lib/lesson-blocks';

type AnyBlock = LessonBlock | UnknownBlock;

export type LessonSection = {
  /** 1-based, and what appears in the URL: /lessons/<id>/<number>. */
  number: number;
  /** The heading as authored, e.g. "Section 3 — The Four Pillars of Self-Leadership". */
  title: string;
  /** The same with its "Section N —" or "Assignment —" prefix removed, for
      places too narrow to carry the prefix. Falls back to the full title. */
  shortTitle: string;
  /** Id of the heading that opened the section, for anchors. */
  headingId: string | null;
  blocks: AnyBlock[];
  /** Rounded up, minimum 1. */
  readingMinutes: number;
  hasScorecard: boolean;
  hasAssignment: boolean;
};

export type SplitResult = {
  /** Everything before the first section — the module title and its intro
      callouts. Belongs on the module overview page, not inside a section. */
  frontMatter: AnyBlock[];
  sections: LessonSection[];
};

/** Matches "Section 1 —", "Section 12 -", "Section 3 –", "SECTION 4:" and so
    on. Used to label and to strip a prefix, never as the sole way to find a
    boundary — see the note on splitting below. */
const SECTION_PREFIX = /^\s*section\s+(\d+)\s*[—–:.-]*\s*/i;
const ASSIGNMENT_PREFIX = /^\s*(assignment|devoir)\s*[—–:.-]*\s*/i;

const WORDS_PER_MINUTE = 200;

function isH2(b: AnyBlock): boolean {
  return b.type === 'heading' && (b as { level?: number }).level === 2;
}

function headingText(b: AnyBlock): string {
  return typeof (b as { text?: unknown }).text === 'string' ? (b as { text: string }).text : '';
}

/** Rough on purpose. It exists to set expectations ("about 6 minutes"), and a
    word count is a better guide than a block count for that. */
function countWords(blocks: AnyBlock[]): number {
  let words = 0;
  const add = (s: unknown) => {
    if (typeof s === 'string') words += s.trim().split(/\s+/).filter(Boolean).length;
  };

  for (const b of blocks) {
    const any = b as Record<string, unknown>;
    add(any.text);
    add(any.instructions);
    add(any.title);
    if (Array.isArray(any.questions)) any.questions.forEach(add);
    if (Array.isArray(any.rows)) {
      (any.rows as unknown[][]).forEach((row) => Array.isArray(row) && row.forEach(add));
    }
    if (Array.isArray(any.prompts)) {
      (any.prompts as Array<Record<string, unknown>>).forEach((p) => {
        add(p.heading); add(p.guidance); add(p.example);
      });
    }
  }
  return words;
}

/**
 * Divide a module's blocks into the units a reader moves through.
 *
 * Splitting is on every level-2 heading rather than on a "Section N" pattern.
 * The heading level is the structure the author already expressed, so it keeps
 * working when a section is titled "Assignment — …" or "Conclusion" or gets
 * renamed in French, none of which a "Section \d+" test survives. The prefix
 * patterns above are used only for labelling.
 *
 * The one extra boundary is an assignment_prompt that no level-2 heading
 * introduced: an assignment is always its own unit, even in a module whose
 * author forgot to give it a heading.
 *
 * Blocks before the first boundary become frontMatter. In practice that is the
 * module title and its opening callouts, which belong on the overview page.
 */
export function splitBlocksBySection(blocks: AnyBlock[]): SplitResult {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return { frontMatter: [], sections: [] };
  }

  const groups: AnyBlock[][] = [];
  let current: AnyBlock[] = [];
  // Whether any level-2 heading has opened the current group. If one has, it
  // titles this unit and the assignment inside belongs to it — whatever the
  // heading's wording. Only an assignment that no heading introduced needs a
  // boundary of its own.
  //
  // An earlier version tested the heading text against ASSIGNMENT_PREFIX
  // instead. That looked equivalent and was not: Module 0's assignment is
  // headed "Your First Assignment — Set Your Intention Before You Begin",
  // which does not start with the word, so the prompt split away from its own
  // heading and left an untitled section behind. Heading level is the signal;
  // heading wording is not.
  let currentHasHeading = false;

  for (const block of blocks) {
    const boundary =
      isH2(block) ||
      (block.type === 'assignment_prompt' && !currentHasHeading && current.length > 0);

    if (boundary && current.length > 0) {
      groups.push(current);
      current = [];
      currentHasHeading = false;
    }
    if (isH2(block)) currentHasHeading = true;
    current.push(block);
  }
  if (current.length > 0) groups.push(current);

  // The opening group is front matter when its heading is the module's own
  // title rather than a section — i.e. it looks like neither "Section N" nor
  // "Assignment". A module that dives straight into Section 1 keeps all of its
  // groups as sections and simply has no front matter.
  let frontMatter: AnyBlock[] = [];
  let sectionGroups = groups;

  const first = groups[0];
  if (first && groups.length > 1) {
    const head = first.find(isH2);
    const looksLikeSection =
      head && (SECTION_PREFIX.test(headingText(head)) || ASSIGNMENT_PREFIX.test(headingText(head)));
    if (!head || !looksLikeSection) {
      frontMatter = first;
      sectionGroups = groups.slice(1);
    }
  }

  const sections = sectionGroups.map((group, i) => {
    const head = group.find(isH2);
    const title = head ? headingText(head) : `Section ${i + 1}`;
    const shortTitle =
      title.replace(SECTION_PREFIX, '').replace(ASSIGNMENT_PREFIX, '').trim() || title;

    return {
      number: i + 1,
      title,
      shortTitle,
      headingId: head ? head.id : null,
      blocks: group,
      readingMinutes: Math.max(1, Math.ceil(countWords(group) / WORDS_PER_MINUTE)),
      hasScorecard: group.some((b) => b.type === 'scorecard'),
      hasAssignment: group.some((b) => b.type === 'assignment_prompt'),
    };
  });

  return { frontMatter, sections };
}

/** Convenience for the section route, which is given a 1-based number from
    the URL and must tolerate anything a reader can type into it. */
export function getSection(blocks: AnyBlock[], sectionNumber: number): LessonSection | null {
  const { sections } = splitBlocksBySection(blocks);
  return sections.find((s) => s.number === sectionNumber) ?? null;
}
