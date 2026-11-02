// Who a module is by, read from the byline its authors wrote in its front matter,
// e.g. "Module 1 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach".
// Reading it from the content means there is no second copy to keep in step.

const BYLINE = /(?:^|·\s*)By\s+(.+?)(?:\s*[·/]\s*|\s*$)/;
const DEFAULT_AUTHOR = 'Dr. Denis Ekobena';

export function moduleAuthor(frontMatter: Array<{ type: string; text?: unknown }>): string {
  for (const block of frontMatter) {
    if (block.type !== 'paragraph' || typeof block.text !== 'string') continue;
    const match = block.text.match(BYLINE);
    if (match) return match[1].trim();
  }
  return DEFAULT_AUTHOR;
}
