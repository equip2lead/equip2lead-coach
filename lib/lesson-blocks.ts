// The shape of structured lesson content stored in lesson_modules.body_blocks
// (and body_blocks_fr).
//
// Two rules shape everything here:
//
// 1. Forward compatibility. Content is data, and data outlives the code that
//    reads it. A lesson authored with a block type this build has never heard
//    of must render the blocks it *does* understand and quietly skip the rest
//    — never blank the page. Adding a block type is a content change, not a
//    migration.
//
// 2. Store the identity, not the URL. Video blocks hold a YouTube id rather
//    than an embed URL so the origin is ours to choose (youtube-nocookie) and
//    an author cannot paste a link that points anywhere else.
//
// This file and scripts/ingest-module.mjs must agree on the callout variants
// and on the scorecard/assignment key names. Ingestion is what writes the
// payload; this is what reads it back.

/** Every block carries a stable id so anchors and scroll positions can refer
    to one without depending on array index. Ids are hashed at ingestion from
    (module slug, index, type), so inserting a block re-ids everything after
    it — which is exactly why no user data is keyed on them. Scorecard ratings
    key on (scorecard_key, item_key) and submissions on assignment_key, both
    read from the payload below. */
interface BlockBase {
  id: string;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  level: 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  /** Inline markdown only — bold, italic, links. No block syntax: that is
      what the other block types are for. */
  text: string;
}

export interface QuoteBlock extends BlockBase {
  type: 'quote';
  text: string;
  attribution?: string;
}

export interface PullQuoteCardBlock extends BlockBase {
  type: 'pull_quote_card';
  text: string;
  attribution?: string;
}

export interface TableBlock extends BlockBase {
  type: 'table';
  /** Rendered as <th scope="col">. A table with no headers is still valid;
      it just loses its header row. */
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface VideoEmbedBlock extends BlockBase {
  type: 'video_embed';
  /** The bare YouTube id, e.g. 'dQw4w9WgXcQ' — not a URL. Embedded via
      youtube-nocookie.com. */
  youtubeId: string;
  title?: string;
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export interface ReflectionQuestionsBlock extends BlockBase {
  type: 'reflection_questions';
  /** The authored files use this as a real heading ("Before You Move On —
      Sit With These Questions"), not as a lead-in sentence. */
  title?: string;
  questions: string[];
}

/** "Rate yourself /10" rows. Answers live in lesson_scorecard_ratings — the
    block defines the instrument, not the response. */
export interface ScorecardBlock extends BlockBase {
  type: 'scorecard';
  title: string;
  instruction?: string;
  /** Author-assigned and stable, deliberately NOT derived from `id`, so
      re-importing content cannot orphan a reader's rating history. */
  scorecard_key: string;
  items: Array<{
    /** Matches lesson_scorecard_ratings.item_key. */
    key: string;
    label: string;
    max: number;
    /** Defaults to 1 in the renderer. */
    min?: number;
    helpText?: string;
  }>;
}

export interface CalloutBlock extends BlockBase {
  type: 'callout';
  /** Drives colour and icon only. An unrecognised variant falls back to
      'note' rather than disappearing. */
  variant: CalloutVariant;
  title?: string;
  text: string;
}

export interface DividerBlock extends BlockBase {
  type: 'divider';
}

/** Self-contained: the prompt text lives in the block, not in a column
    elsewhere, so a lesson renders standalone. */
export interface AssignmentPromptBlock extends BlockBase {
  type: 'assignment_prompt';
  /** Stable key for lesson_assignment_submissions.assignment_key. Assigned
      by ordinal at ingestion ('a1', 'a2', …) and independent of `id`. */
  assignment_key: string;
  title: string;
  instructions: string;
  prompts: Array<{
    number: number;
    heading: string;
    guidance: string;
    example?: string;
  }>;
  word_min?: number;
  word_max?: number;
  submit_label?: string;
}

export type CalloutVariant = 'note' | 'info' | 'warning' | 'tip' | 'scripture';

export const CALLOUT_VARIANTS: ReadonlySet<string> = new Set<CalloutVariant>([
  'note', 'info', 'warning', 'tip', 'scripture',
]);

export type LessonBlock =
  | HeadingBlock
  | ParagraphBlock
  | QuoteBlock
  | PullQuoteCardBlock
  | TableBlock
  | VideoEmbedBlock
  | ImageBlock
  | ReflectionQuestionsBlock
  | ScorecardBlock
  | CalloutBlock
  | DividerBlock
  | AssignmentPromptBlock;

export type LessonBlockType = LessonBlock['type'];

/** A block whose `type` this build does not implement. Kept rather than
    dropped so the renderer can decide: skip silently in production, surface
    loudly in development. */
export interface UnknownBlock extends BlockBase {
  type: string;
  [key: string]: unknown;
}

export const KNOWN_BLOCK_TYPES: ReadonlySet<string> = new Set<LessonBlockType>([
  'heading', 'paragraph', 'quote', 'pull_quote_card', 'table',
  'video_embed', 'image', 'reflection_questions', 'scorecard',
  'callout', 'divider', 'assignment_prompt',
]);

export function isKnownBlock(block: LessonBlock | UnknownBlock): block is LessonBlock {
  return KNOWN_BLOCK_TYPES.has(block.type);
}

/** Permissive on purpose: anything array-shaped with a string `type` is worth
    handing to the renderer, which decides per block what it can draw. */
export function parseBlocks(value: unknown): Array<LessonBlock | UnknownBlock> {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (b): b is LessonBlock | UnknownBlock =>
      !!b && typeof b === 'object' && typeof (b as { type?: unknown }).type === 'string'
  );
}

export function normaliseCalloutVariant(variant: unknown): CalloutVariant {
  return typeof variant === 'string' && CALLOUT_VARIANTS.has(variant)
    ? (variant as CalloutVariant)
    : 'note';
}
