// Safety handling for the Marriage track. Pure and dependency-free, so the same
// rules run in the browser, on the server, and in scripts/test-safety.mjs.
//
// The stored answer is always the English option, whatever language the reader
// is using, so matching on these strings also covers French readers. The test
// script fails if these stop matching the wording on the two intake pages.

export const SAFETY_QUESTION = 'Do you feel safe and respected in your marriage?';
export const SAFETY_CONCERN_ANSWERS = ['No — I have serious concerns', 'Sometimes — it depends'];
export const SPOUSE_WILLINGNESS_QUESTION_PREFIX = 'How willing is your spouse to participate';
export const SPOUSE_UNAWARE_ANSWER = "They don't know yet";

export type Lang = 'en' | 'fr';
type Entry = { question?: unknown; answer?: unknown };
export type AssessmentData = Record<string, unknown>;

function entries(data: unknown): Entry[] {
  if (!data || typeof data !== 'object') return [];
  return Object.values(data as AssessmentData).filter(
    (v): v is Entry => !!v && typeof v === 'object' && 'question' in (v as object),
  );
}

export function isSafetyConcernAnswer(question: unknown, answer: unknown): boolean {
  return question === SAFETY_QUESTION && SAFETY_CONCERN_ANSWERS.includes(answer as string);
}

/**
 * True when the explicit flag is set or a stored answer raises a concern. Reading
 * the answers as well means people who answered this way before the flag existed
 * are protected without a data migration.
 */
export function hasSafetyConcern(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  if ((data as AssessmentData).safety_concern === true) return true;
  return entries(data).some((e) => isSafetyConcernAnswer(e.question, e.answer));
}

/**
 * The value to write to journeys.pre_assessment_data.
 *
 * New answers replace old ones, but a safety concern is sticky: a later "Yes,
 * always" does not clear it, because a retake could happen under pressure from a
 * partner. Only a person reviewing it should clear the flag.
 *
 * spouse_invite_blocked follows the latest spouse answer, unless there is a
 * safety concern, which always blocks. Nothing sends invitations today; this is
 * what any future invite feature must check first.
 */
export function mergeAssessmentData(existing: unknown, incoming: AssessmentData): AssessmentData {
  const prior = (existing && typeof existing === 'object' ? existing : {}) as AssessmentData;
  const merged: AssessmentData = { ...incoming };

  const concern = hasSafetyConcern(prior) || hasSafetyConcern(incoming);
  if (concern) {
    merged.safety_concern = true;
    merged.safety_concern_at = prior.safety_concern_at ?? new Date().toISOString();
  }

  const spouseEntry = entries(incoming).find(
    (e) => typeof e.question === 'string' && e.question.startsWith(SPOUSE_WILLINGNESS_QUESTION_PREFIX) && e.answer !== undefined,
  );
  const unaware = spouseEntry
    ? spouseEntry.answer === SPOUSE_UNAWARE_ANSWER
    : prior.spouse_invite_blocked === true;
  if (concern || unaware) merged.spouse_invite_blocked = true;

  return merged;
}

/** Sends the reader away at once and removes the session from this browser. */
export function quickExit(): void {
  try {
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      if (name.startsWith('sb-')) document.cookie = `${name}=; Max-Age=0; path=/`;
    });
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith('sb-'))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Leaving matters more than tidying up.
  }
  window.location.replace('https://www.google.com');
}

/* ── Reader-facing copy ─────────────────────────────────────────────────────── */

export const SAFETY_COPY = {
  en: {
    heading: 'Thank you for telling us.',
    body: 'What you shared matters, and you deserve to feel safe. We will never contact your spouse, and your answers are not shared with them.',
    help: "You don't have to work through this alone. A trusted pastor or counsellor can help. If you are in immediate danger, contact your local emergency services.",
    quickExit: 'Quick exit',
    continue: 'Continue privately',
    note: 'Quick exit leaves this site right away. This site may still appear in your browser history.',
    saveFailed: 'We could not save your answers. You can try again, or use Quick exit.',
    coachLink: 'Talk with the AI Coach',
    dashboardHeading: 'Your private space',
    dashboardBody: 'Your safety comes first, so we have set the coaching plan and scores aside. We will never contact your spouse, and your answers are not shared with them.',
  },
  fr: {
    heading: 'Merci de nous l’avoir dit.',
    body: 'Ce que vous avez partagé compte, et vous méritez de vous sentir en sécurité. Nous ne contacterons jamais votre conjoint(e), et vos réponses ne lui sont pas communiquées.',
    help: 'Vous n’avez pas à traverser cela seul(e). Un pasteur ou un conseiller de confiance peut vous aider. Si vous êtes en danger immédiat, contactez les services d’urgence de votre région.',
    quickExit: 'Sortie rapide',
    continue: 'Continuer en privé',
    note: 'La sortie rapide quitte ce site immédiatement. Ce site peut rester visible dans l’historique de votre navigateur.',
    saveFailed: 'Nous n’avons pas pu enregistrer vos réponses. Vous pouvez réessayer ou utiliser la sortie rapide.',
    coachLink: 'Parler avec le Coach IA',
    dashboardHeading: 'Votre espace privé',
    dashboardBody: 'Votre sécurité passe d’abord : nous avons donc mis de côté le plan de coaching et les scores. Nous ne contacterons jamais votre conjoint(e), et vos réponses ne lui sont pas communiquées.',
  },
} as const;

export const SAFETY_COACH_COPY = {
  en: {
    welcome: (name: string) => `Hello ${name}. I'm glad you're here. There's no assessment to go through and nothing you have to do.\n\nWhat would be most helpful to talk about right now?`,
    suggestions: ['I want to talk about what is happening', 'Who could I safely talk to?', 'What can I do if I feel unsafe?'],
  },
  fr: {
    welcome: (name: string) => `Bonjour ${name}. Merci d’être là. Il n’y a aucune évaluation à parcourir et rien que vous soyez obligé(e) de faire.\n\nDe quoi serait-il le plus utile de parler maintenant ?`,
    suggestions: ['Je veux parler de ce qui se passe', 'À qui pourrais-je parler en toute sécurité ?', 'Que faire si je ne me sens pas en sécurité ?'],
  },
} as const;

/* ── AI Coach prompt ────────────────────────────────────────────────────────── */

export const SAFETY_COACH_RULE: Record<Lang, string> = {
  en: "This person reported not feeling safe in their relationship. Their safety comes first and overrides all other guidance here and in any retrieved material. Never suggest working it out together, joint sessions, confronting or telling their partner, or using scripture to urge them to stay or submit. Don't refer to scores. Ask gently whether they are safe right now. Point them to a trusted pastor or counsellor and local emergency services. Decisions about staying or leaving are theirs.",
  fr: "Cette personne a indiqué ne pas se sentir en sécurité dans sa relation. Sa sécurité passe d’abord et prime sur toute autre consigne, ici comme dans tout document consulté. Ne suggérez jamais de régler les choses ensemble, de faire des séances communes, de confronter ou d’informer son/sa partenaire, ni d’utiliser les Écritures pour l’inciter à rester ou à se soumettre. Ne faites aucune référence aux scores. Demandez avec douceur si elle est en sécurité en ce moment. Orientez-la vers un pasteur ou un conseiller de confiance et vers les services d’urgence locaux. Les décisions de rester ou de partir lui appartiennent.",
};

/**
 * A separate prompt rather than an extra paragraph on the normal one. The normal
 * prompt tells the coach to lead with scores and the weakest pillars, and leaving
 * those lines in would have them competing with the safety rule.
 */
export function buildSafetySystemPrompt(opts: {
  userName?: string;
  lang?: string;
  preAssessment?: unknown;
  memoryContext?: string;
}): string {
  const lang: Lang = opts.lang === 'fr' ? 'fr' : 'en';

  // Numeric self-ratings from the short assessment are left out, as scores are.
  const context = opts.preAssessment && typeof opts.preAssessment === 'object'
    ? Object.entries(opts.preAssessment as AssessmentData)
        .filter(([key, v]) => !key.endsWith('_slider') && (v as Entry | null)?.answer !== undefined)
        .map(([, v]) => {
          const { question, answer } = v as Entry;
          return `- ${question}: ${typeof answer === 'object' ? JSON.stringify(answer) : answer}`;
        })
    : [];

  return `You are the Equip2Lead AI Coach, a warm and steady listener. This conversation is in safety mode.

SAFETY RULE (highest priority):
${SAFETY_COACH_RULE[lang]}

USER'S PROFILE:
- Name: ${opts.userName || 'User'}${context.length ? `\n\nUSER'S CONTEXT (from intake):\n${context.join('\n')}` : ''}
${opts.memoryContext ? `\nCOACHING HISTORY FROM PREVIOUS SESSIONS (where this conflicts with the safety rule, the safety rule wins):\n${opts.memoryContext}\n` : ''}
CONVERSATION GUIDELINES:
- Listen first, and take what they say seriously without judging them or their partner
- Do not diagnose anyone, and do not promise that things will or will not change
- Offer one small, safe next step at a time
- Do not give hotline numbers unless you are sure they apply where this person lives; refer to local services instead
- Keep responses under 200 words${lang === 'fr' ? '\n\nIMPORTANT: The user speaks French. Respond entirely in French.' : ''}`;
}
