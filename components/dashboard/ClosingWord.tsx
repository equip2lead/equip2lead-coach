import { quoteForWeek } from '@/lib/dashboard/quotes';

const SERIF = "Georgia, 'Libre Baskerville', serif";

// The page ends on Denis's voice rather than on a control. Nothing to click,
// nothing to decide — a sentence to leave with.
export function ClosingWord({ lang }: { lang: 'en' | 'fr' }) {
  const quote = quoteForWeek();

  return (
    <section className="px-8 pb-20 pt-6 max-md:px-5 max-md:pb-14">
      <figure className="mx-auto max-w-[620px] text-center">
        <blockquote className="text-[19px] max-md:text-[17px] italic leading-[1.6] text-gray-500" style={{ fontFamily: SERIF }}>
          &ldquo;{lang === 'en' ? quote.en : quote.fr}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-[12.5px] font-semibold uppercase tracking-wider text-gray-400">
          — Dr. Denis Ekobena
        </figcaption>
      </figure>
    </section>
  );
}
