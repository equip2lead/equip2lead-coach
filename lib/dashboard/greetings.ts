// Denis-voiced greeting copy, keyed by what the reader's data actually says
// about them.
//
// Variants rotate by day-of-year rather than at random: two visits on the same
// day say the same thing, which is what makes the page feel like a place
// rather than a slot machine. The line changes tomorrow.

export type GreetingState =
  | 'new'            // nothing done yet
  | 'oriented'       // starting point finished, no numbered module begun
  | 'recent'         // submitted something in the last 7 days
  | 'returning'      // 7-30 days quiet
  | 'long_absence'   // 30+ days quiet
  | 'active';        // reading, nothing submitted recently

export type GreetingCopy = {
  /** Rendered above the body. The time-of-day word is filled in client-side. */
  salutation: 'welcome' | 'welcome_back' | 'time_of_day';
  lines: string[];
  cta: string;
};

/** Deterministic per day, so the same day reads the same. */
export function pickVariant<T>(variants: T[], date = new Date()): T {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  return variants[dayOfYear % variants.length];
}

type Bank = Record<GreetingState, { en: string[][]; fr: string[][] }>;

// Each entry is one complete variant: an array of paragraph lines.
const BANK: Bank = {
  new: {
    en: [
      ["You're at the beginning. That's the honest place to start.", 'Your Starting Point is ready when you are.'],
      ['Everything here starts with one decision: to be honest about where you actually are.', 'Your Starting Point is ready when you are.'],
      ['No one arrives at this already formed. That is rather the point.', 'Your Starting Point is ready when you are.'],
    ],
    fr: [
      ['Vous êtes au commencement. C’est l’endroit honnête où débuter.', 'Votre Point de départ vous attend.'],
      ['Tout commence par une décision : être honnête sur votre situation réelle.', 'Votre Point de départ vous attend.'],
      ['Personne n’arrive ici déjà formé. C’est précisément l’intérêt.', 'Votre Point de départ vous attend.'],
    ],
  },
  oriented: {
    en: [
      ['You’ve set your intention. Now the work begins.', 'Your first module was chosen from what your assessment revealed.'],
      ['The intention is written. What follows is the slower part.', 'Your first module was chosen from what your assessment revealed.'],
      ['You know why you came. That is more than most leaders can say.', 'Your first module was chosen from what your assessment revealed.'],
    ],
    fr: [
      ['Vous avez posé votre intention. Le travail commence maintenant.', 'Votre premier module a été choisi d’après votre évaluation.'],
      ['L’intention est écrite. Ce qui suit est la part la plus lente.', 'Votre premier module a été choisi d’après votre évaluation.'],
      ['Vous savez pourquoi vous êtes venu. C’est plus que la plupart des leaders.', 'Votre premier module a été choisi d’après votre évaluation.'],
    ],
  },
  recent: {
    en: [
      ['Writing it down is what makes it yours.', 'Take a breath before the next module — the slow-cooker rewards patience.'],
      ['That answer will read differently to you in three months. Keep it.', 'Take a breath before the next module — the slow-cooker rewards patience.'],
      ['Honest work on the page tends to become honest work in the room.', 'Take a breath before the next module — the slow-cooker rewards patience.'],
      ['You did the part most people skip.', 'Take a breath before the next module — the slow-cooker rewards patience.'],
    ],
    fr: [
      ['L’écrire, c’est ce qui vous l’approprie.', 'Respirez avant le module suivant — la cuisson lente récompense la patience.'],
      ['Cette réponse vous parlera autrement dans trois mois. Gardez-la.', 'Respirez avant le module suivant — la cuisson lente récompense la patience.'],
      ['Un travail honnête sur la page devient un travail honnête dans la salle.', 'Respirez avant le module suivant — la cuisson lente récompense la patience.'],
      ['Vous avez fait la partie que la plupart évitent.', 'Respirez avant le module suivant — la cuisson lente récompense la patience.'],
    ],
  },
  returning: {
    en: [
      ['Leadership isn’t lost in the gap. It’s found in the return.'],
      ['The gap is not the failure. Not returning would be.'],
      ['Formation survives interruption. It does not survive abandonment.'],
    ],
    fr: [
      ['Le leadership ne se perd pas dans l’interruption. Il se trouve dans le retour.'],
      ['L’interruption n’est pas l’échec. Ne pas revenir le serait.'],
      ['La formation survit à l’interruption. Elle ne survit pas à l’abandon.'],
    ],
  },
  long_absence: {
    en: [
      ['The doors haven’t closed. Your work is still here waiting.'],
      ['Nothing has been lost. Everything you wrote is where you left it.'],
      ['However long it has been, the next step is the same size as it always was.'],
    ],
    fr: [
      ['Les portes ne se sont pas fermées. Votre travail vous attend toujours.'],
      ['Rien n’a été perdu. Tout ce que vous avez écrit est là où vous l’avez laissé.'],
      ['Quel qu’ait été le délai, la prochaine étape est de la même taille qu’avant.'],
    ],
  },
  active: {
    en: [
      ['You’re in the middle of it. That is where most of the forming happens.'],
      ['Steady is the whole method. Keep going.'],
      ['The reading matters less than the returning. You’ve returned.'],
    ],
    fr: [
      ['Vous êtes en plein dedans. C’est là que la formation se fait.'],
      ['La régularité est toute la méthode. Continuez.'],
      ['La lecture compte moins que le retour. Vous êtes revenu.'],
    ],
  },
};

const SALUTATION: Record<GreetingState, GreetingCopy['salutation']> = {
  new: 'welcome',
  oriented: 'time_of_day',
  recent: 'time_of_day',
  returning: 'welcome_back',
  long_absence: 'welcome_back',
  active: 'time_of_day',
};

const CTA: Record<GreetingState, { en: string; fr: string }> = {
  new:          { en: 'Begin Starting Point',      fr: 'Commencer le Point de départ' },
  oriented:     { en: 'Begin',                     fr: 'Commencer' },
  recent:       { en: 'Continue where you left off', fr: 'Reprendre où vous en étiez' },
  returning:    { en: 'Pick up where you paused',  fr: 'Reprendre où vous vous êtes arrêté' },
  long_absence: { en: 'Return to your journey',    fr: 'Revenir à votre parcours' },
  active:       { en: 'Continue where you left off', fr: 'Reprendre où vous en étiez' },
};

export function greetingFor(state: GreetingState, lang: 'en' | 'fr', date = new Date()): GreetingCopy {
  return {
    salutation: SALUTATION[state],
    lines: pickVariant(BANK[state][lang], date),
    cta: CTA[state][lang],
  };
}

/** Which of the six states this reader is in. Order matters: the more
    specific a state is about what just happened, the earlier it is tested. */
export function greetingState(input: {
  hasAnyActivity: boolean;
  daysSinceActivity: number | null;
  startingPointComplete: boolean;
  hasBegunNumberedModule: boolean;
  lastActivityKind: 'submitted' | 'read' | null;
}): GreetingState {
  if (!input.hasAnyActivity) return 'new';
  if (input.daysSinceActivity !== null && input.daysSinceActivity >= 30) return 'long_absence';
  if (input.daysSinceActivity !== null && input.daysSinceActivity >= 7) return 'returning';
  if (input.startingPointComplete && !input.hasBegunNumberedModule) return 'oriented';
  if (input.lastActivityKind === 'submitted') return 'recent';
  return 'active';
}
