import { Language } from './types';

const dictionaries = {
  en: {
    nav: { howItWorks: 'How It Works', tracks: 'Tracks', whyUs: 'Why Us', testimonials: 'Testimonials', login: 'Log in', getStarted: 'Get Started →', startNow: 'Start now' },
    hero: {
      label: "Dr. Denis Ekobena's Coaching Framework",
      titlePre: 'Personalised',
      titleHl: 'coaching',
      titlePost: 'that starts\nwith you',
      sub: "We diagnose first, then coach. Every journey is built from your unique answers — powered exclusively by Dr. Ekobena's proven frameworks, available 24/7.",
      cta: 'Start now',
      stats: { domains: 'Pillars per Track', plans: 'Personalised Plans', coach: 'AI Coach Access', tailored: 'Tailored To You' },
    },
    sfs: { title: 'Simplicity. Flexibility. Security.', sub: 'Offer yourself a personalised coaching experience, even without prior coaching.' },
    tracks: {
      go: 'Start now', learn: 'Learn more \u2192',
      leadership: { title: 'Leadership Coaching', tagline: 'Lead with clarity, character, and confidence', desc: 'For emerging leaders, managers, executives, and anyone who leads people. Develop your leadership across 5 Pillars and 21 dimensions \u2014 from personal mastery and directional clarity to relational intelligence, team performance, and multiplication.', tags: ['Self-Awareness', 'Vision', 'Communication', 'Decision-Making', 'Delegation'] },
      ministry: { title: 'Ministry Coaching', tagline: 'Serve with purpose, sustain with wisdom', desc: 'For pastors, church planters, ministry leaders, and missionaries. Navigate 5 Pillars of ministry effectiveness \u2014 calling clarity, spiritual formation, preaching & teaching, pastoral care, and long-term sustainability.', tags: ['Calling Clarity', 'Spiritual Formation', 'Preaching', 'Discipleship', 'Sustainability'] },
      marriage: { title: 'Marriage Coaching', tagline: 'Build a marriage that lasts and thrives', desc: 'For couples \u2014 married, engaged, or rebuilding. Each spouse completes their intake individually across 5 Pillars and 20 relational dimensions. Separate intakes, combined insights.', tags: ['Friendship & Intimacy', 'Communication', 'Conflict & Repair', 'Trust', 'Shared Vision'] },
      entrepreneur: { title: 'Entrepreneur Coaching', tagline: 'Build a business that serves and scales', desc: 'For business owners, founders, and marketplace leaders. Brutally honest diagnostics across 5 Pillars \u2014 revenue clarity, offer strategy, pricing discipline, financial stewardship, and execution.', tags: ['Revenue Diagnostics', 'Offer Clarity', 'Pricing Strategy', 'Sales & Marketing', 'Scaling'] },
      personal: { title: 'Personal Development', tagline: 'Discover who you are and grow into who you\'re meant to be', desc: 'The discovery track \u2014 for anyone seeking growth in purpose, identity, habits, and life design. 5 foundational Pillars that reveal your strengths and graduate you into specialised tracks.', tags: ['Purpose & Identity', 'Emotional Intelligence', 'Habits & Discipline', 'Relationships', 'Career Clarity'] },
    },
    how: {
      label: 'HOW IT WORKS',
      title: 'From assessment to transformation',
      titleEm: 'in four steps',
      sub: 'Unlike generic platforms, Equip2Lead diagnoses your unique situation before delivering a single piece of coaching.',
      steps: [
        { title: 'Choose Your Track', desc: 'Select from 5 coaching tracks \u2014 Leadership, Ministry, Marriage, Entrepreneur, or Personal Development. Each uses 5 Pillars and 20\u201323 dimensions.' },
        { title: 'Complete Your Intake', desc: 'Answer a personalised assessment — one question at a time. Your answers build a unique profile.' },
        { title: 'Get Your Coaching Plan', desc: "Coach Lens Summary, Top 3 Focus Areas, and a 12-week roadmap from Dr. Ekobena's frameworks." },
        { title: 'Grow With Your AI Coach', desc: 'Chat 24/7 with an AI coach that only draws from Equip2Lead materials. Weekly check-ins adapt your plan.' },
      ],
    },
    why: {
      label: 'WHY EQUIP2LEAD',
      title: 'Not another coaching platform.',
      titleEm: 'A personal coaching experience.',
      diffs: [
        { title: 'Diagnose First, Coach Second', desc: 'Every coaching journey begins with a deep personalised assessment — not a generic course.' },
        { title: 'Closed Knowledge System', desc: "Our AI coach draws exclusively from Dr. Ekobena's curated material. No internet, no outside sources." },
        { title: '12-Week Personalised Roadmap', desc: 'Weekly themes, exercises, actions, and accountability — built from your answers.' },
        { title: 'Safe & Confidential', desc: 'Marriage intakes are separate. All data is encrypted. Crisis disclaimers built in.' },
        { title: '24/7 AI Coach Access', desc: 'Chat anytime with a coach that understands your profile, plan, and progress.' },
        { title: 'Adaptive Check-ins', desc: 'Weekly check-ins update your progress and adapt your plan to where you actually are.' },
      ],
    },
    cta: {
      title: 'Your transformation starts with',
      titleSpan: 'one honest conversation.',
      sub: "Choose your coaching track, answer honestly, and let Dr. Ekobena's frameworks build you a personalised plan. It takes less than 15 minutes.",
      btn: 'Choose Your Track & Begin →',
      note: 'Free assessment · No credit card · 10–15 minutes',
    },
    footer: {
      desc: "Personalised coaching powered by Dr. Denis Ekobena's frameworks. African Leadership Development Center.",
      platform: 'Platform', resources: 'Resources', company: 'Company',
      copy: '© 2026 Equip2Lead. All rights reserved.',
      disclaimer: 'Equip2Lead is not a substitute for medical, legal, or therapeutic advice. If you are in crisis, seek local professional help.',
    },
    // Other pages
    auth: {
      signUp: 'Create your account', logIn: 'Welcome back', name: 'Full name', email: 'Email', password: 'Password',
      signUpBtn: 'Create Account', logInBtn: 'Log In', switchToLogin: 'Already have an account?', switchToSignup: "Don't have an account?",
      orContinue: 'Or continue with', google: 'Google',
    },
    trackSelection: {
      title: 'Choose Your Coaching Track',
      sub: 'Select the track where you want to grow. Your track determines the assessment questions and coaching plan.',
      pillars: '5 Pillars \u00b7 20\u201323 dimensions', weeks: '12 weeks', begin: 'Begin Assessment \u2192',
    },
    pillarOverview: {
      title: 'Your 5 Leadership Pillars', sub: "You'll answer questions across each pillar. Takes about 10–15 minutes.",
      start: 'Start Assessment', questions: 'questions',
    },
    intake: {
      pillar: 'Pillar', of: 'of', question: 'Question',
      labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      back: 'Back', next: 'Next', submit: 'Submit Assessment',
    },
    results: {
      title: 'Your Assessment Results', overallScore: 'Overall Score',
      coachLens: 'Coach Lens Summary', focusAreas: 'Top 3 Focus Areas',
      viewPlan: 'View Your 12-Week Plan', startCoaching: 'Start Coaching →',
    },
    dashboard: {
      welcome: 'Welcome back', week: 'Week', of: 'of',
      plan: 'Your Coaching Plan', checkin: 'Weekly Check-in', coach: 'AI Coach',
      thisWeek: "This Week's Focus", exercises: 'Exercises', goals: 'Goals',
      viewAll: 'View all',
    },
    aiCoach: {
      title: 'AI Coach', placeholder: 'Ask your coach anything...', send: 'Send',
      disclaimer: 'Your AI coach draws exclusively from Dr. Ekobena\'s frameworks. Not a substitute for professional advice.',
    },
    checkin: {
      title: 'Weekly Check-in', step: 'Step', of: 'of',
      moodTitle: 'How are you feeling this week?',
      moods: { struggling: 'Struggling', flat: 'Flat', okay: 'Okay', good: 'Good', on_fire: 'On Fire' },
      goalsTitle: 'Goal Review', progressTitle: 'Progress Scale',
      progressLabels: ['No progress', 'Slight', 'Moderate', 'Good', 'Significant growth'],
      reflectionTitle: 'Reflection', reflectionPlaceholder: 'What was your biggest insight or challenge this week?',
      commitmentTitle: 'Commitment', commitmentPlaceholder: 'What is one thing you commit to practising next week?',
      back: 'Back', continue: 'Continue', submit: 'Submit Check-in',
      complete: 'Check-in Complete!', adaptivePlan: 'Your plan has been updated.',
      toDashboard: 'Back to Dashboard', toCoach: 'Discuss with AI Coach',
    },
    common: { loading: 'Loading...', error: 'Something went wrong', retry: 'Try again', save: 'Save', cancel: 'Cancel', back: 'Back' },
  },
  fr: {
    nav: { howItWorks: 'Comment ça marche', tracks: 'Parcours', whyUs: 'Pourquoi nous', testimonials: 'Témoignages', login: 'Connexion', getStarted: 'Commencer →', startNow: 'Commencer' },
    hero: {
      label: 'Le Cadre de Coaching du Dr. Denis Ekobena',
      titlePre: 'Coaching',
      titleHl: 'personnalisé',
      titlePost: 'qui\ncommence par vous',
      sub: "Nous diagnostiquons d'abord, puis nous coachons. Chaque parcours est construit à partir de vos réponses — alimenté par les cadres du Dr. Ekobena, 24h/24.",
      cta: 'Commencer',
      stats: { domains: 'Piliers par parcours', plans: 'Plans personnalisés', coach: 'Accès Coach IA', tailored: 'Adapté à vous' },
    },
    sfs: { title: 'Simplicité. Flexibilité. Sécurité.', sub: 'Offrez-vous une expérience de coaching personnalisée, même sans expérience préalable.' },
    tracks: {
      go: 'Commencer', learn: 'En savoir plus \u2192',
      leadership: { title: 'Coaching en Leadership', tagline: 'Dirigez avec clart\u00e9, caract\u00e8re et confiance', desc: "Pour les leaders \u00e9mergents, gestionnaires et cadres. D\u00e9veloppez votre leadership \u00e0 travers 5 Piliers et 21 dimensions \u2014 de la ma\u00eetrise personnelle \u00e0 l'intelligence relationnelle et la multiplication.", tags: ['Conscience de soi', 'Vision', 'Communication', 'D\u00e9cision', 'D\u00e9l\u00e9gation'] },
      ministry: { title: 'Coaching Minist\u00e9riel', tagline: 'Servir avec vision, durer avec sagesse', desc: "Pour pasteurs, planteurs et missionnaires. Naviguez \u00e0 travers 5 Piliers d'efficacit\u00e9 minist\u00e9rielle \u2014 clart\u00e9 d'appel, formation spirituelle, pr\u00e9dication, soin pastoral et durabilit\u00e9.", tags: ["Clart\u00e9 d'appel", 'Formation spirituelle', 'Pr\u00e9dication', 'Discipulat', 'Durabilit\u00e9'] },
      marriage: { title: 'Coaching Conjugal', tagline: "B\u00e2tir un mariage qui dure et qui s'\u00e9panouit", desc: "Pour les couples \u2014 mari\u00e9s, fianc\u00e9s ou en reconstruction. Chaque conjoint compl\u00e8te individuellement \u00e0 travers 5 Piliers et 20 dimensions relationnelles.", tags: ['Amiti\u00e9 & Intimit\u00e9', 'Communication', 'Conflit & R\u00e9paration', 'Confiance', 'Vision commune'] },
      entrepreneur: { title: 'Coaching Entrepreneurial', tagline: 'Construire une entreprise qui sert et qui grandit', desc: "Pour les propri\u00e9taires, fondateurs et leaders du march\u00e9. Diagnostics \u00e0 travers 5 Piliers \u2014 revenus, strat\u00e9gie d'offre, prix, gestion financi\u00e8re et ex\u00e9cution.", tags: ['Diagnostics Revenus', "Clart\u00e9 d'offre", 'Strat\u00e9gie Prix', 'Ventes & Marketing', 'Croissance'] },
      personal: { title: 'D\u00e9veloppement Personnel', tagline: 'D\u00e9couvrez qui vous \u00eates et devenez qui vous devez \u00eatre', desc: "Le parcours d\u00e9couverte \u2014 pour tous ceux qui cherchent la croissance en identit\u00e9, habitudes et projet de vie. 5 Piliers fondamentaux qui r\u00e9v\u00e8lent vos forces.", tags: ['But & Identit\u00e9', 'Intelligence \u00e9motionnelle', 'Habitudes', 'Relations', 'Carri\u00e8re'] },
    },
    how: {
      label: 'COMMENT ÇA MARCHE',
      title: "De l'évaluation à la transformation",
      titleEm: 'en quatre étapes',
      sub: 'Contrairement aux plateformes génériques, Equip2Lead diagnostique votre situation unique.',
      steps: [
        { title: 'Choisissez votre parcours', desc: 'S\u00e9lectionnez parmi 5 parcours de coaching. Chacun utilise 5 Piliers et 20\u201323 dimensions.' },
        { title: 'Complétez votre évaluation', desc: 'Répondez à un questionnaire adapté — une question à la fois.' },
        { title: 'Recevez votre plan', desc: 'Coach Lens, 3 priorités, plan de 12 semaines.' },
        { title: 'Grandissez avec votre coach', desc: 'Discutez 24h/24 avec un coach IA exclusif.' },
      ],
    },
    why: {
      label: 'POURQUOI EQUIP2LEAD',
      title: 'Pas une plateforme de plus.',
      titleEm: 'Une expérience personnelle.',
      diffs: [
        { title: "Diagnostiquer d'abord", desc: 'Chaque parcours commence par une évaluation approfondie.' },
        { title: 'Connaissances exclusives', desc: 'Notre IA puise exclusivement dans le matériel du Dr. Ekobena.' },
        { title: 'Feuille de route 12 semaines', desc: 'Thèmes, exercices, actions et responsabilisation.' },
        { title: 'Sûr et confidentiel', desc: 'Évaluations séparées. Données chiffrées.' },
        { title: 'Coach IA 24h/24', desc: 'Un coach qui comprend votre profil et progression.' },
        { title: 'Bilans adaptatifs', desc: 'Bilans qui adaptent votre plan en continu.' },
      ],
    },
    cta: {
      title: 'Votre transformation commence par',
      titleSpan: 'une conversation honnête.',
      sub: 'Choisissez votre parcours, répondez honnêtement, et laissez les cadres du Dr. Ekobena construire votre plan.',
      btn: 'Choisir mon parcours →',
      note: 'Gratuit · Sans carte · 10–15 minutes',
    },
    footer: {
      desc: 'Coaching personnalisé par les cadres du Dr. Denis Ekobena. Centre de Développement du Leadership Africain.',
      platform: 'Plateforme', resources: 'Ressources', company: 'Entreprise',
      copy: '© 2026 Equip2Lead. Tous droits réservés.',
      disclaimer: 'Equip2Lead ne remplace pas un avis médical ou thérapeutique.',
    },
    auth: {
      signUp: 'Créez votre compte', logIn: 'Bon retour', name: 'Nom complet', email: 'Email', password: 'Mot de passe',
      signUpBtn: 'Créer un compte', logInBtn: 'Se connecter', switchToLogin: 'Déjà un compte ?', switchToSignup: "Pas encore de compte ?",
      orContinue: 'Ou continuer avec', google: 'Google',
    },
    trackSelection: {
      title: 'Choisissez votre parcours',
      sub: 'Sélectionnez le parcours dans lequel vous souhaitez grandir.',
      pillars: '5 piliers \u00b7 20\u201323 dimensions', weeks: '12 semaines', begin: 'Commencer \u2192',
    },
    pillarOverview: {
      title: 'Vos 5 Piliers de Leadership', sub: 'Vous répondrez à des questions sur chaque pilier. Environ 10–15 minutes.',
      start: "Commencer l'évaluation", questions: 'questions',
    },
    intake: {
      pillar: 'Pilier', of: 'de', question: 'Question',
      labels: ["Pas du tout d'accord", "Pas d'accord", 'Neutre', "D'accord", "Tout à fait d'accord"],
      back: 'Retour', next: 'Suivant', submit: 'Soumettre',
    },
    results: {
      title: 'Vos résultats', overallScore: 'Score global',
      coachLens: 'Résumé Coach Lens', focusAreas: '3 priorités',
      viewPlan: 'Voir votre plan 12 semaines', startCoaching: 'Commencer le coaching →',
    },
    dashboard: {
      welcome: 'Bon retour', week: 'Semaine', of: 'de',
      plan: 'Votre plan', checkin: 'Bilan hebdomadaire', coach: 'Coach IA',
      thisWeek: 'Focus de la semaine', exercises: 'Exercices', goals: 'Objectifs',
      viewAll: 'Voir tout',
    },
    aiCoach: {
      title: 'Coach IA', placeholder: 'Posez votre question...', send: 'Envoyer',
      disclaimer: 'Votre coach IA puise exclusivement dans les cadres du Dr. Ekobena.',
    },
    checkin: {
      title: 'Bilan hebdomadaire', step: 'Étape', of: 'de',
      moodTitle: 'Comment vous sentez-vous cette semaine ?',
      moods: { struggling: 'Difficile', flat: 'Plat', okay: 'Correct', good: 'Bien', on_fire: 'En feu' },
      goalsTitle: 'Revue des objectifs', progressTitle: 'Échelle de progrès',
      progressLabels: ['Aucun progrès', 'Léger', 'Modéré', 'Bon', 'Croissance significative'],
      reflectionTitle: 'Réflexion', reflectionPlaceholder: 'Quel a été votre plus grand défi ou insight cette semaine ?',
      commitmentTitle: 'Engagement', commitmentPlaceholder: 'Que vous engagez-vous à pratiquer la semaine prochaine ?',
      back: 'Retour', continue: 'Continuer', submit: 'Soumettre',
      complete: 'Bilan terminé !', adaptivePlan: 'Votre plan a été mis à jour.',
      toDashboard: 'Retour au tableau de bord', toCoach: 'Discuter avec le Coach IA',
    },
    common: { loading: 'Chargement...', error: 'Une erreur est survenue', retry: 'Réessayer', save: 'Enregistrer', cancel: 'Annuler', back: 'Retour' },
  },
} as const;

export type Dictionary = (typeof dictionaries)['en'];

export function getDictionary(lang: Language) {
  return (dictionaries[lang] || dictionaries.en) as any;
}
