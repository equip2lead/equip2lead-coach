// Denis-voiced greeting copy, keyed by what the reader's data actually says
// about them.
//
// Variants rotate by day-of-year rather than at random: two visits on the same
// day say the same thing, which is what makes the page feel like a place
// rather than a slot machine. The line changes tomorrow.

import type { NextStepMode } from './data';

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
  /** The last line hands off to the next-step card below. There is no button
      here: two scarlet primaries pointing at the same URL, a screen apart,
      compete rather than guide. The sentence does the routing. */
  lines: string[];
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
  // The handoff line is appended by greetingFor, because it is the one
  // sentence here that explains *why* this module is next — and that reason
  // changes with the reader's chosen mode. See ORIENTED_HANDOFF.
  oriented: {
    en: [
      ['You’ve set your intention. Now the work begins.'],
      ['The intention is written. What follows is the slower part.'],
      ['You know why you came. That is more than most leaders can say.'],
    ],
    fr: [
      ['Vous avez posé votre intention. Le travail commence maintenant.'],
      ['L’intention est écrite. Ce qui suit est la part la plus lente.'],
      ['Vous savez pourquoi vous êtes venu. C’est plus que la plupart des leaders.'],
    ],
  },
  recent: {
    en: [
      ['Writing it down is what makes it yours.', 'Take a breath before the next module — the slow-cooker rewards patience. It’s waiting below.'],
      ['That answer will read differently to you in three months. Keep it.', 'The next module is below when you’re ready — the slow-cooker rewards patience.'],
      ['Honest work on the page tends to become honest work in the room.', 'Your next step is below. There’s no hurry to it.'],
      ['You did the part most people skip.', 'Here’s what comes next, whenever you want it.'],
    ],
    fr: [
      ['L’écrire, c’est ce qui vous l’approprie.', 'Respirez avant le module suivant — il vous attend ci-dessous.'],
      ['Cette réponse vous parlera autrement dans trois mois. Gardez-la.', 'Le module suivant est ci-dessous, quand vous serez prêt.'],
      ['Un travail honnête sur la page devient un travail honnête dans la salle.', 'Votre prochaine étape est ci-dessous. Rien ne presse.'],
      ['Vous avez fait la partie que la plupart évitent.', 'Voici la suite, quand vous le voudrez.'],
    ],
  },
  returning: {
    en: [
      ['Leadership isn’t lost in the gap. It’s found in the return.', 'Here’s where you were.'],
      ['The gap is not the failure. Not returning would be.', 'Your next step is below, unchanged.'],
      ['Formation survives interruption. It does not survive abandonment.', 'Let’s pick it up here.'],
    ],
    fr: [
      ['Le leadership ne se perd pas dans l’interruption. Il se trouve dans le retour.', 'Voici où vous en étiez.'],
      ['L’interruption n’est pas l’échec. Ne pas revenir le serait.', 'Votre prochaine étape vous attend ci-dessous.'],
      ['La formation survit à l’interruption. Elle ne survit pas à l’abandon.', 'Reprenons ici.'],
    ],
  },
  long_absence: {
    en: [
      ['The doors haven’t closed. Your work is still here waiting.', 'Start again from here.'],
      ['Nothing has been lost. Everything you wrote is where you left it.', 'This is where you stopped.'],
      ['However long it has been, the next step is the same size as it always was.', 'It’s below.'],
    ],
    fr: [
      ['Les portes ne se sont pas fermées. Votre travail vous attend toujours.', 'Reprenez ici.'],
      ['Rien n’a été perdu. Tout ce que vous avez écrit est là où vous l’avez laissé.', 'C’est ici que vous vous êtes arrêté.'],
      ['Quel qu’ait été le délai, la prochaine étape est de la même taille qu’avant.', 'Elle est ci-dessous.'],
    ],
  },
  active: {
    en: [
      ['You’re in the middle of it. That is where most of the forming happens.', 'Here’s where you left off.'],
      ['Steady is the whole method. Keep going.', 'Your next step is below.'],
      ['The reading matters less than the returning. You’ve returned.', 'Pick it up here.'],
    ],
    fr: [
      ['Vous êtes en plein dedans. C’est là que la formation se fait.', 'Voici où vous vous êtes arrêté.'],
      ['La régularité est toute la méthode. Continuez.', 'Votre prochaine étape est ci-dessous.'],
      ['La lecture compte moins que le retour. Vous êtes revenu.', 'Reprenez ici.'],
    ],
  },
};

/** The only line in the bank that claims a *reason* the next module is next.
    In sequential mode the assessment did not choose it — the numbering did —
    so the sentence has to move with the mode or it becomes a small lie told
    on the most-read screen in the app. */
const ORIENTED_HANDOFF: Record<NextStepMode, { en: string; fr: string }> = {
  assessment: {
    en: 'Your first module was chosen from what your assessment revealed.',
    fr: 'Votre premier module a été choisi d’après votre évaluation.',
  },
  sequential: {
    en: 'You’re walking the arc — Module 1 is where it begins.',
    fr: 'Vous suivez l’arc — le Module 1 en est le commencement.',
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

export function greetingFor(
  state: GreetingState,
  lang: 'en' | 'fr',
  mode: NextStepMode = 'assessment',
  date = new Date(),
): GreetingCopy {
  const lines = pickVariant(BANK[state][lang], date);
  return {
    salutation: SALUTATION[state],
    lines: state === 'oriented' ? [...lines, ORIENTED_HANDOFF[mode][lang]] : lines,
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
