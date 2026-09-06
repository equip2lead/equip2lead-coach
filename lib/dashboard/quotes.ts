// Denis's own lines, drawn from the authored modules rather than invented for
// the dashboard, so the closing word is the same voice the lessons are in.
//
// Rotated by ISO week: the quote holds for a week, long enough to be read
// rather than skimmed past, and different enough over time not to become
// wallpaper.

export type Quote = { en: string; fr: string };

export const QUOTES: Quote[] = [
  {
    en: 'Leadership is not a microwave experience. God prepares leaders in a slow-cooker.',
    fr: 'Le leadership n’est pas une expérience au micro-ondes. Dieu prépare les leaders à la cuisson lente.',
  },
  {
    en: 'Your gifts will take you where your character cannot keep you.',
    fr: 'Vos dons vous mèneront là où votre caractère ne pourra vous garder.',
  },
  {
    en: 'The ultimate test of leadership is not what happens when you are present. It is what happens when you are gone.',
    fr: 'Le test ultime du leadership n’est pas ce qui se passe en votre présence, mais ce qui se passe après votre départ.',
  },
  {
    en: 'Only secure leaders give their power to others.',
    fr: 'Seuls les leaders sûrs d’eux donnent leur pouvoir aux autres.',
  },
  {
    en: 'God cannot rename what you refuse to name.',
    fr: 'Dieu ne peut renommer ce que vous refusez de nommer.',
  },
  {
    en: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    fr: 'Vous ne vous élevez pas au niveau de vos objectifs. Vous tombez au niveau de vos systèmes.',
  },
  {
    en: 'Self-leadership is not built in retreats. It is built in mornings.',
    fr: 'L’auto-leadership ne se construit pas dans les retraites. Il se construit le matin.',
  },
  {
    en: 'Insight without practice is entertainment.',
    fr: 'La compréhension sans la pratique n’est que divertissement.',
  },
  {
    en: 'Your identity is not what you can do. It is whose you are.',
    fr: 'Votre identité n’est pas ce que vous savez faire. C’est à qui vous appartenez.',
  },
  {
    en: 'Leadership begins with the person in the mirror.',
    fr: 'Le leadership commence avec la personne dans le miroir.',
  },
];

/** ISO week number, so the quote is stable for seven days. */
export function quoteForWeek(date = new Date()): Quote {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return QUOTES[week % QUOTES.length];
}
