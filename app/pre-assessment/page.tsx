'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

/* ═══ STEP TYPES ═══ */
type StepSelect = { type: 'select'; en: string; fr: string; tag?: string; tagFr?: string; options: string[]; optionsFr: string[] };
type StepText = { type: 'text'; en: string; fr: string; tag?: string; tagFr?: string; placeholder?: string };
type StepSlider = { type: 'slider'; en: string; fr: string; desc: string; descFr: string; tag?: string; tagFr?: string };
type StepMulti = { type: 'multi'; en: string; fr: string; max: number; options: string[]; optionsFr: string[] };
type Step = StepSelect | StepText | StepSlider | StepMulti;

/* ═══ LEADERSHIP (16 steps) ═══ */
const leadershipFlow: Step[] = [
  { type: 'text', en: 'What is your current leadership role or title?', fr: 'Quel est votre r\u00f4le ou titre de leadership actuel ?', tag: 'ABOUT YOU', tagFr: '\u00c0 PROPOS DE VOUS', placeholder: 'Type your answer...' },
  { type: 'select', en: 'How many years of leadership experience do you have?', fr: "Combien d'ann\u00e9es d'exp\u00e9rience en leadership avez-vous ?", options: ['Less than 1 year', '1\u20133 years', '3\u20137 years', '7\u201315 years', '15+ years'], optionsFr: ['Moins de 1 an', '1\u20133 ans', '3\u20137 ans', '7\u201315 ans', '15+ ans'] },
  { type: 'select', en: 'How many people do you directly lead?', fr: 'Combien de personnes dirigez-vous directement ?', options: ['None yet', '1\u20135', '6\u201315', '16\u201350', '50+'], optionsFr: ['Aucune', '1\u20135', '6\u201315', '16\u201350', '50+'] },
  { type: 'slider', en: 'Self-Awareness', fr: 'Conscience de soi', desc: 'I understand my strengths, weaknesses, and triggers', descFr: 'Je comprends mes forces, faiblesses et d\u00e9clencheurs', tag: 'LEADERSHIP DOMAIN SCORECARD', tagFr: 'CARTE DES DOMAINES DE LEADERSHIP' },
  { type: 'slider', en: 'Vision', fr: 'Vision', desc: 'I can articulate a compelling direction for my team', descFr: 'Je peux articuler une direction convaincante pour mon \u00e9quipe' },
  { type: 'slider', en: 'Communication', fr: 'Communication', desc: 'I communicate clearly and inspire action', descFr: 'Je communique clairement et inspire l\'action' },
  { type: 'slider', en: 'Decision-Making', fr: 'Prise de d\u00e9cision', desc: 'I make timely, wise decisions under pressure', descFr: 'Je prends des d\u00e9cisions sages sous pression' },
  { type: 'slider', en: 'Team Building', fr: '\u00c9quipe', desc: 'I attract, develop, and retain great people', descFr: 'J\'attire, d\u00e9veloppe et retiens les bons talents' },
  { type: 'slider', en: 'Conflict Resolution', fr: 'Gestion de conflits', desc: 'I address tension constructively', descFr: 'Je g\u00e8re les tensions de mani\u00e8re constructive' },
  { type: 'slider', en: 'Delegation', fr: 'D\u00e9l\u00e9gation', desc: 'I empower others rather than doing everything myself', descFr: 'Je responsabilise les autres plut\u00f4t que de tout faire moi-m\u00eame' },
  { type: 'slider', en: 'Resilience', fr: 'R\u00e9silience', desc: 'I recover well from setbacks and sustain my energy', descFr: 'Je me remets bien des revers et maintiens mon \u00e9nergie' },
  { type: 'slider', en: 'Character', fr: 'Caract\u00e8re', desc: 'I lead with integrity even when no one is watching', descFr: 'Je dirige avec int\u00e9grit\u00e9 m\u00eame quand personne ne regarde' },
  { type: 'text', en: 'What is the single biggest leadership challenge you face right now?', fr: 'Quel est le plus grand d\u00e9fi de leadership que vous rencontrez actuellement ?', tag: 'GROWTH PRIORITIES', tagFr: 'PRIORIT\u00c9S DE CROISSANCE' },
  { type: 'multi', en: 'Which 3 domains feel most urgent to develop?', fr: 'Quels 3 domaines sont les plus urgents \u00e0 d\u00e9velopper ?', max: 3, options: ['Self-Awareness', 'Vision', 'Communication', 'Decision-Making', 'Team Building', 'Conflict Resolution', 'Delegation', 'Resilience', 'Character'], optionsFr: ['Conscience de soi', 'Vision', 'Communication', 'Prise de d\u00e9cision', '\u00c9quipe', 'Gestion de conflits', 'D\u00e9l\u00e9gation', 'R\u00e9silience', 'Caract\u00e8re'] },
  { type: 'text', en: 'What does success look like for you 12 months from now?', fr: '\u00c0 quoi ressemble le succ\u00e8s pour vous dans 12 mois ?' },
  { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: '\u00cates-vous pr\u00eat \u00e0 investir du temps s\u00e9rieux dans votre croissance ?', options: ['Very ready \u2014 I\'ll do whatever it takes', 'Ready \u2014 but I need structure', 'Curious \u2014 let\'s see what this looks like', 'Skeptical \u2014 convince me'], optionsFr: ['Tr\u00e8s pr\u00eat \u2014 je ferai tout ce qu\'il faut', 'Pr\u00eat \u2014 mais j\'ai besoin de structure', 'Curieux \u2014 voyons \u00e0 quoi \u00e7a ressemble', 'Sceptique \u2014 convainquez-moi'] },
];

/* ═══ MINISTRY (15 steps) ═══ */
const ministryFlow: Step[] = [
  { type: 'text', en: 'What is your ministry role or calling?', fr: 'Quel est votre r\u00f4le ou appel minist\u00e9riel ?', tag: 'ABOUT YOUR MINISTRY', tagFr: '\u00c0 PROPOS DE VOTRE MINIST\u00c8RE' },
  { type: 'select', en: 'Ministry context?', fr: 'Contexte minist\u00e9riel ?', options: ['Local church pastor', 'Church planter', 'Ministry leader/director', 'Missionary', 'Marketplace ministry', 'Volunteer leader', 'Exploring my calling'], optionsFr: ['Pasteur local', 'Planteur d\'\u00e9glise', 'Responsable minist\u00e9riel', 'Missionnaire', 'Minist\u00e8re sur le march\u00e9', 'Leader b\u00e9n\u00e9vole', 'Explorer mon appel'] },
  { type: 'select', en: 'Years in ministry?', fr: 'Ann\u00e9es en minist\u00e8re ?', options: ['Exploring/Preparing', 'Less than 2 years', '2\u20135 years', '5\u201315 years', '15+ years'], optionsFr: ['En exploration', 'Moins de 2 ans', '2\u20135 ans', '5\u201315 ans', '15+ ans'] },
  { type: 'slider', en: 'Calling Clarity', fr: 'Clart\u00e9 d\'appel', desc: 'I know what God has called me to do', descFr: 'Je sais ce que Dieu m\'a appel\u00e9 \u00e0 faire', tag: 'MINISTRY DOMAIN SCORECARD', tagFr: 'CARTE DES DOMAINES MINIST\u00c9RIELS' },
  { type: 'slider', en: 'Spiritual Formation', fr: 'Formation spirituelle', desc: 'My inner life is healthy and growing', descFr: 'Ma vie int\u00e9rieure est saine et grandit' },
  { type: 'slider', en: 'Preaching & Teaching', fr: 'Pr\u00e9dication et Enseignement', desc: 'I communicate God\'s word effectively', descFr: 'Je communique la Parole de Dieu efficacement' },
  { type: 'slider', en: 'Discipleship', fr: 'Discipulat', desc: 'I multiply leaders and develop people', descFr: 'Je multiplie les leaders et d\u00e9veloppe les gens' },
  { type: 'slider', en: 'Pastoral Care', fr: 'Soin pastoral', desc: 'I shepherd people through real-life issues', descFr: 'Je prends soin des gens dans les probl\u00e8mes de la vie' },
  { type: 'slider', en: 'Vision & Strategy', fr: 'Vision et Strat\u00e9gie', desc: 'I lead with a clear direction', descFr: 'Je dirige avec une direction claire' },
  { type: 'slider', en: 'Administration', fr: 'Administration', desc: 'I manage resources, time, and systems well', descFr: 'Je g\u00e8re bien les ressources, le temps et les syst\u00e8mes' },
  { type: 'slider', en: 'Outreach & Evangelism', fr: '\u00c9vang\u00e9lisation', desc: 'I\'m reaching beyond the existing community', descFr: 'Je touche au-del\u00e0 de la communaut\u00e9 existante' },
  { type: 'slider', en: 'Sustainability', fr: 'Durabilit\u00e9', desc: 'I\'m avoiding burnout and building for the long term', descFr: 'J\'\u00e9vite l\'\u00e9puisement et construis pour le long terme' },
  { type: 'select', en: 'What season are you in?', fr: 'Dans quelle saison \u00eates-vous ?', tag: 'CURRENT SEASON', tagFr: 'SAISON ACTUELLE', options: ['Building/Launching', 'Growing/Expanding', 'Sustaining/Maintaining', 'Transition/Change', 'Recovery/Rebuilding', 'Unclear \u2014 I need help figuring it out'], optionsFr: ['Construction/Lancement', 'Croissance/Expansion', 'Maintien/Stabilit\u00e9', 'Transition/Changement', 'R\u00e9cup\u00e9ration/Reconstruction', 'Pas clair'] },
  { type: 'text', en: 'What is the single biggest challenge in your ministry right now?', fr: 'Quel est le plus grand d\u00e9fi dans votre minist\u00e8re ?', tag: 'GROWTH PRIORITIES', tagFr: 'PRIORIT\u00c9S DE CROISSANCE' },
  { type: 'text', en: 'What does fruitful ministry look like for you in 12 months?', fr: '\u00c0 quoi ressemble un minist\u00e8re fructueux pour vous dans 12 mois ?' },
  { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: '\u00cates-vous pr\u00eat \u00e0 investir du temps s\u00e9rieux ?', options: ['Very ready \u2014 I\'ll do whatever it takes', 'Ready \u2014 but I need structure', 'Curious \u2014 let\'s see what this looks like', 'Skeptical \u2014 convince me'], optionsFr: ['Tr\u00e8s pr\u00eat', 'Pr\u00eat \u2014 besoin de structure', 'Curieux', 'Sceptique'] },
];

/* ═══ MARRIAGE (17 steps) ═══ */
const marriageFlow: Step[] = [
  { type: 'select', en: 'What is your current marriage status?', fr: 'Quel est votre statut matrimonial actuel ?', tag: 'ABOUT YOUR MARRIAGE', tagFr: '\u00c0 PROPOS DE VOTRE MARIAGE', options: ['Married', 'Engaged', 'Separated \u2014 hoping to reconcile', 'Dating seriously'], optionsFr: ['Mari\u00e9(e)', 'Fianc\u00e9(e)', 'S\u00e9par\u00e9(e) \u2014 esp\u00e9rant r\u00e9concilier', 'En couple s\u00e9rieux'] },
  { type: 'select', en: 'How long have you been together?', fr: 'Depuis combien de temps \u00eates-vous ensemble ?', options: ['Less than 1 year', '1\u20133 years', '3\u20137 years', '7\u201315 years', '15+ years'], optionsFr: ['Moins de 1 an', '1\u20133 ans', '3\u20137 ans', '7\u201315 ans', '15+ ans'] },
  { type: 'select', en: 'Have you done any form of marriage coaching or counseling before?', fr: 'Avez-vous d\u00e9j\u00e0 fait du coaching ou conseil conjugal ?', options: ['No, this is our first time', 'Yes, it helped', 'Yes, but it didn\'t work', 'Yes, multiple times'], optionsFr: ['Non, c\'est notre premi\u00e8re fois', 'Oui, \u00e7a a aid\u00e9', 'Oui, mais \u00e7a n\'a pas march\u00e9', 'Oui, plusieurs fois'] },
  { type: 'slider', en: 'Friendship & Intimacy', fr: 'Amiti\u00e9 et Intimit\u00e9', desc: 'We genuinely enjoy each other', descFr: 'Nous appr\u00e9cions sinc\u00e8rement l\'un l\'autre', tag: 'MARRIAGE DOMAIN SCORECARD', tagFr: 'CARTE DES DOMAINES CONJUGAUX' },
  { type: 'slider', en: 'Communication', fr: 'Communication', desc: 'We talk openly and feel heard', descFr: 'Nous parlons ouvertement et nous sentons \u00e9cout\u00e9s' },
  { type: 'slider', en: 'Conflict & Repair', fr: 'Conflit et R\u00e9paration', desc: 'We handle disagreements without damaging the relationship', descFr: 'Nous g\u00e9rons les d\u00e9saccords sans endommager la relation' },
  { type: 'slider', en: 'Trust', fr: 'Confiance', desc: 'I feel safe and secure in our relationship', descFr: 'Je me sens en s\u00e9curit\u00e9 dans notre relation' },
  { type: 'slider', en: 'Partnership & Roles', fr: 'Partenariat et R\u00f4les', desc: 'We share responsibilities and lead together', descFr: 'Nous partageons les responsabilit\u00e9s' },
  { type: 'slider', en: 'Physical Intimacy', fr: 'Intimit\u00e9 physique', desc: 'Our physical connection is healthy and mutual', descFr: 'Notre connexion physique est saine et mutuelle' },
  { type: 'slider', en: 'Shared Vision', fr: 'Vision commune', desc: 'We dream and plan our future together', descFr: 'Nous r\u00eavons et planifions notre avenir ensemble' },
  { type: 'slider', en: 'Spiritual Connection', fr: 'Connexion spirituelle', desc: 'We grow together in faith', descFr: 'Nous grandissons ensemble dans la foi' },
  { type: 'slider', en: 'Finances', fr: 'Finances', desc: 'We manage money as a team', descFr: 'Nous gérons l\'argent en équipe' },
  { type: 'slider', en: 'Parenting Alignment', fr: 'Alignement parental', desc: 'We parent as a united team', descFr: 'Nous \u00e9duquons en \u00e9quipe unie' },
  { type: 'slider', en: 'Personal Wellbeing', fr: 'Bien-être personnel', desc: 'I am emotionally healthy as an individual', descFr: 'Je suis émotionnellement en bonne santé en tant qu\'individu' },
  { type: 'select', en: 'What season are you in?', fr: 'Dans quelle saison \u00eates-vous ?', tag: 'CURRENT SEASON', tagFr: 'SAISON ACTUELLE', options: ['Building/Launching', 'Growing/Expanding', 'Sustaining/Maintaining', 'Transition/Change', 'Recovery/Rebuilding', 'Unclear \u2014 I need help figuring it out'], optionsFr: ['Construction/Lancement', 'Croissance/Expansion', 'Maintien/Stabilit\u00e9', 'Transition/Changement', 'R\u00e9cup\u00e9ration/Reconstruction', 'Pas clair \u2014 j\'ai besoin d\'aide'] },
  { type: 'text', en: 'What is the most important thing you want to address in your marriage right now?', fr: 'Quelle est la chose la plus importante \u00e0 traiter dans votre mariage ?', tag: 'READINESS & SAFETY', tagFr: 'PR\u00c9PARATION ET S\u00c9CURIT\u00c9' },
  { type: 'select', en: 'Do you feel safe and respected in your marriage?', fr: 'Vous sentez-vous en s\u00e9curit\u00e9 et respect\u00e9(e) dans votre mariage ?', options: ['Yes, always', 'Mostly, with some concerns', 'Sometimes \u2014 it depends', 'No \u2014 I have serious concerns'], optionsFr: ['Oui, toujours', 'Surtout, avec quelques inqui\u00e9tudes', 'Parfois \u2014 \u00e7a d\u00e9pend', 'Non \u2014 j\'ai de s\u00e9rieuses inqui\u00e9tudes'] },
  { type: 'select', en: 'How willing is your spouse to participate in coaching?', fr: 'Votre conjoint(e) est-il/elle dispos\u00e9(e) \u00e0 participer ?', options: ['Very willing \u2014 they\'re excited', 'Willing but cautious', 'Reluctant \u2014 I\'m hoping they\'ll come around', 'They don\'t know yet'], optionsFr: ['Tr\u00e8s dispos\u00e9(e) \u2014 enthousiaste', 'Dispos\u00e9(e) mais prudent(e)', 'R\u00e9ticent(e) \u2014 j\'esp\u00e8re qu\'il/elle changera', 'Il/elle ne sait pas encore'] },
  { type: 'text', en: 'Describe your marriage in 12 months if this coaching works.', fr: 'D\u00e9crivez votre mariage dans 12 mois si ce coaching fonctionne.' },
];

/* ═══ ENTREPRENEUR (14 steps) ═══ */
const entrepreneurFlow: Step[] = [
  { type: 'text', en: 'What is your business name and what do you sell/offer?', fr: 'Quel est le nom de votre entreprise et que vendez/offrez-vous ?', tag: 'YOUR BUSINESS', tagFr: 'VOTRE ENTREPRISE' },
  { type: 'select', en: 'Business stage?', fr: 'Stade de l\'entreprise ?', options: ['Idea stage', 'Pre-revenue', 'Under $50K/year', '$50K\u2013$250K/year', '$250K\u2013$1M/year', '$1M+/year'], optionsFr: ['Phase d\'id\u00e9e', 'Pas de revenus', 'Moins de 50K\u20ac/an', '50K\u2013250K\u20ac/an', '250K\u20131M\u20ac/an', '1M+\u20ac/an'] },
  { type: 'select', en: 'How long has the business been operating?', fr: 'Depuis combien de temps l\'entreprise op\u00e8re ?', options: ['Not yet started', 'Less than 1 year', '1\u20133 years', '3\u20137 years', '7+ years'], optionsFr: ['Pas encore d\u00e9marr\u00e9e', 'Moins de 1 an', '1\u20133 ans', '3\u20137 ans', '7+ ans'] },
  { type: 'select', en: 'Team size?', fr: 'Taille de l\'équipe ?', options: ['Just me', '1\u20133 people', '4\u201310 people', '11\u201350 people', '50+'], optionsFr: ['Juste moi', '1\u20133 personnes', '4\u201310 personnes', '11\u201350 personnes', '50+'] },
  { type: 'slider', en: 'Revenue Clarity', fr: 'Clart\u00e9 des revenus', desc: 'I know exactly how my business makes money', descFr: 'Je sais exactement comment mon entreprise gagne de l\'argent', tag: 'BUSINESS DOMAIN SCORECARD', tagFr: 'CARTE DES DOMAINES BUSINESS' },
  { type: 'slider', en: 'Offer Strategy', fr: 'Strat\u00e9gie d\'offre', desc: 'My product or service is clear and compelling', descFr: 'Mon produit ou service est clair et convaincant' },
  { type: 'slider', en: 'Pricing & Sales', fr: 'Prix et Ventes', desc: 'I price with confidence and sell without shame', descFr: 'Je fixe mes prix avec confiance' },
  { type: 'slider', en: 'Financial Stewardship', fr: 'Gestion financi\u00e8re', desc: 'I manage money wisely and plan ahead', descFr: 'Je g\u00e8re l\'argent sagement' },
  { type: 'slider', en: 'Operations & Systems', fr: 'Op\u00e9rations', desc: 'My business runs smoothly, even without me', descFr: 'Mon entreprise fonctionne m\u00eame sans moi' },
  { type: 'slider', en: 'Marketing & Growth', fr: 'Marketing et Croissance', desc: 'People know about my business and it\'s growing', descFr: 'Les gens connaissent mon entreprise' },
  { type: 'slider', en: 'Team & Leadership', fr: '\u00c9quipe et Leadership', desc: 'I build and lead a great team', descFr: 'Je construis et dirige une bonne \u00e9quipe' },
  { type: 'slider', en: 'Mindset & Resilience', fr: 'Mentalité et Résilience', desc: 'I handle uncertainty and setbacks well', descFr: 'Je gère bien l\'incertitude et les revers' },
  { type: 'slider', en: 'Kingdom Impact', fr: 'Impact du Royaume', desc: 'My business serves a purpose beyond profit', descFr: 'Mon entreprise sert un but au-del\u00e0 du profit' },
  { type: 'text', en: 'What is the single biggest business challenge you face right now?', fr: 'Quel est le plus grand d\u00e9fi business actuellement ?', tag: 'GROWTH PRIORITIES', tagFr: 'PRIORIT\u00c9S DE CROISSANCE' },
  { type: 'text', en: 'What does success look like for your business in 12 months?', fr: '\u00c0 quoi ressemble le succ\u00e8s dans 12 mois ?' },
  { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: '\u00cates-vous pr\u00eat ?', options: ['Very ready \u2014 I\'ll do whatever it takes', 'Ready \u2014 but I need structure', 'Curious \u2014 let\'s see', 'Skeptical \u2014 convince me'], optionsFr: ['Tr\u00e8s pr\u00eat', 'Pr\u00eat \u2014 besoin de structure', 'Curieux', 'Sceptique'] },
];

/* ═══ PERSONAL DEVELOPMENT (13 steps) ═══ */
const personalFlow: Step[] = [
  { type: 'select', en: 'What best describes where you are in life right now?', fr: 'Qu\'est-ce qui décrit le mieux où vous en êtes dans la vie ?', tag: 'ABOUT YOU', tagFr: '\u00c0 PROPOS DE VOUS', options: ['In transition \u2014 career, relationship, or identity shift', 'Stuck \u2014 I know I need to grow but don\'t know where to start', 'Growing \u2014 I want to accelerate what\'s already working', 'Rebuilding \u2014 recovering from a setback', 'Exploring \u2014 figuring out who I am and what I want'], optionsFr: ['En transition \u2014 carrière, relation ou identité', 'Bloqué(e) \u2014 je sais que je dois grandir mais je ne sais pas par où commencer', 'En croissance \u2014 je veux accélérer ce qui fonctionne', 'En reconstruction \u2014 je me remets d\'un revers', 'En exploration \u2014 je cherche qui je suis et ce que je veux'] },
  { type: 'select', en: 'Age range?', fr: 'Tranche d\'\u00e2ge ?', tag: 'ABOUT YOU', tagFr: '\u00c0 PROPOS DE VOUS', options: ['18\u201325', '26\u201335', '36\u201345', '46\u201355', '55+'], optionsFr: ['18\u201325', '26\u201335', '36\u201345', '46\u201355', '55+'] },
  { type: 'slider', en: 'Purpose & Identity', fr: 'But et Identit\u00e9', desc: 'I know who I am and why I\'m here', descFr: 'Je sais qui je suis et pourquoi je suis ici', tag: 'LIFE DOMAIN SCORECARD', tagFr: 'CARTE DES DOMAINES DE VIE' },
  { type: 'slider', en: 'Emotional Intelligence', fr: 'Intelligence \u00e9motionnelle', desc: 'I manage my emotions and relate well', descFr: 'Je g\u00e8re mes \u00e9motions et me relate bien' },
  { type: 'slider', en: 'Habits & Discipline', fr: 'Habitudes et Discipline', desc: 'My daily routines support my goals', descFr: 'Mes routines quotidiennes soutiennent mes objectifs' },
  { type: 'slider', en: 'Relationships', fr: 'Relations', desc: 'I have healthy, life-giving connections', descFr: 'J\'ai des connexions saines et vivifiantes' },
  { type: 'slider', en: 'Life Design', fr: 'Projet de vie', desc: 'I am intentional about how I live', descFr: 'Je suis intentionnel dans ma vie' },
  { type: 'slider', en: 'Mindset', fr: 'Mentalit\u00e9', desc: 'I think like someone who is growing and winning', descFr: 'Je pense comme quelqu\'un qui grandit' },
  { type: 'slider', en: 'Health & Wellbeing', fr: 'Sant\u00e9 et Bien-\u00eatre', desc: 'I take care of my body and mind', descFr: 'Je prends soin de mon corps et de mon esprit' },
  { type: 'text', en: 'What is the biggest thing you want to change about your life?', fr: 'Quelle est la plus grande chose que vous voulez changer ?', tag: 'YOUR VISION', tagFr: 'VOTRE VISION' },
  { type: 'multi', en: 'Which 3 areas feel most urgent to develop?', fr: 'Quels 3 domaines sont les plus urgents ?', max: 3, options: ['Purpose & Identity', 'Emotional Intelligence', 'Habits & Discipline', 'Relationships', 'Life Design', 'Mindset', 'Health & Wellbeing'], optionsFr: ['But & Identit\u00e9', 'Intelligence \u00e9motionnelle', 'Habitudes', 'Relations', 'Projet de vie', 'Mentalit\u00e9', 'Sant\u00e9'] },
  { type: 'text', en: 'If this coaching works, what does your life look like in 12 months?', fr: 'Si ce coaching fonctionne, \u00e0 quoi ressemble votre vie dans 12 mois ?' },
  { type: 'select', en: 'How ready are you to invest serious time in growth?', fr: '\u00cates-vous pr\u00eat(e) ?', options: ['Very ready \u2014 I\'ll do whatever it takes', 'Ready \u2014 but I need structure', 'Curious \u2014 let\'s see what this looks like', 'Skeptical \u2014 convince me'], optionsFr: ['Tr\u00e8s pr\u00eat(e)', 'Pr\u00eat(e) \u2014 besoin de structure', 'Curieux/se', 'Sceptique'] },
];

const flowsByTrack: Record<string, Step[]> = { leadership: leadershipFlow, ministry: ministryFlow, marriage: marriageFlow, entrepreneur: entrepreneurFlow, personal: personalFlow };

function PreAssessContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const trackSlug = sp.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const flow = flowsByTrack[trackSlug] || personalFlow;
  const total = flow.length;
  const current = flow[step];
  const progress = ((step + 1) / total) * 100;

  const canContinue = () => {
    const a = answers[step];
    if (!current) return false;
    if (current.type === 'select') return a !== undefined;
    if (current.type === 'text') return a && a.trim().length > 0;
    if (current.type === 'slider') return true;
    if (current.type === 'multi') return a && a.length > 0 && a.length <= current.max;
    return false;
  };

  const setAnswer = (val: any) => setAnswers(prev => ({ ...prev, [step]: val }));

  const handleNext = async () => {
    if (step < total - 1) { setStep(step + 1); return; }
    // Save and navigate
    if (user) {
      const { data: track } = await supabase.from('tracks').select('id').eq('slug', trackSlug).single();
      if (track) {
        let { data: journey } = await supabase.from('journeys').select('id').eq('user_id', user!.id).eq('track_id', track.id).single();
        if (!journey) {
          const { data: nj } = await supabase.from('journeys').insert({ user_id: user!.id, track_id: track.id }).select('id').single();
          journey = nj;
        }
        if (journey) {
          const preData: Record<string, any> = {};
          flow.forEach((s, i) => { preData[`step_${i}_${s.type}`] = { question: s.en, answer: answers[i] }; });
          await supabase.from('journeys').update({ pre_assessment_data: preData, updated_at: new Date().toISOString() }).eq('id', journey.id);
        }
      }
    }
    router.push(`/pillar-overview?track=${trackSlug}`);
  };

  // Initialize slider defaults
  useEffect(() => {
    const defaults: Record<number, any> = {};
    flow.forEach((s, i) => { if (s.type === 'slider' && answers[i] === undefined) defaults[i] = 5; });
    if (Object.keys(defaults).length > 0) setAnswers(prev => ({ ...defaults, ...prev }));
  }, [trackSlug]);

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[600px] mx-auto flex items-center justify-between">
          <h1 className="text-[16px] font-extrabold tracking-wider text-gray-900" style={{ fontFamily: "'Libre Baskerville', serif" }}>EQUIP2LEAD</h1>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-gray-400">{step + 1} / {total}</span>
            <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>{lang === 'en' ? 'FR' : 'EN'}</button>
          </div>
        </div>
        <div className="max-w-[600px] mx-auto mt-3"><div className="h-1 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-[#059669] transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[600px] animate-[fadeIn_0.25s_ease]" key={step}>

          {/* Tag banner */}
          {current && 'tag' in current && current.tag && (
            <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-xl bg-amber-50 border-l-4 border-amber-400">
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">{lang === 'en' ? current.tag : (current as any).tagFr || current.tag}</div>
              {current.type === 'slider' && <div className="text-[13px] text-amber-600 ml-auto">{lang === 'en' ? 'Rate each area 1\u201310' : '\u00c9valuez chaque domaine 1\u201310'}</div>}
            </div>
          )}

          {/* SELECT */}
          {current?.type === 'select' && (
            <>
              <h2 className="text-[26px] max-md:text-[20px] font-extrabold text-gray-900 mb-8 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>{lang === 'en' ? current.en : current.fr}</h2>
              <div className="flex flex-col gap-3">
                {current.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)}
                    className={`w-full py-4 px-6 rounded-xl border-[1.5px] text-[15px] font-medium cursor-pointer transition-all text-left ${answers[step] === opt ? 'border-[#F9250E] bg-red-50/30 text-gray-900' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {lang === 'en' ? opt : current.optionsFr[i]}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* TEXT */}
          {current?.type === 'text' && (
            <>
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>{lang === 'en' ? current.en : current.fr}</h2>
              <textarea value={answers[step] || ''} onChange={e => setAnswer(e.target.value)}
                placeholder={current.placeholder || (lang === 'en' ? 'Share your thoughts...' : 'Partagez vos pens\u00e9es...')} rows={4}
                className="w-full px-5 py-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-[15px] text-gray-900 outline-none resize-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.06)] transition-all placeholder:text-gray-400 leading-[1.7]"
                style={{ fontFamily: 'inherit' }} />
            </>
          )}

          {/* SLIDER */}
          {current?.type === 'slider' && (
            <>
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-2 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {lang === 'en' ? current.en : current.fr} &mdash; <span className="font-normal text-gray-500">{lang === 'en' ? current.desc : current.descFr}</span>
              </h2>
              <div className="mt-10 mb-4">
                <div className="flex justify-between text-[12px] font-medium text-gray-400 mb-2">
                  <span>{lang === 'en' ? 'Needs Work' : '\u00c0 am\u00e9liorer'}</span>
                  <span className="text-[24px] font-extrabold" style={{ color: (answers[step] || 5) >= 7 ? '#059669' : (answers[step] || 5) >= 4 ? '#D97706' : '#DC2626' }}>{answers[step] || 5}</span>
                  <span>{lang === 'en' ? 'Excellent' : 'Excellent'}</span>
                </div>
                <input type="range" min="1" max="10" value={answers[step] || 5}
                  onChange={e => setAnswer(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #D97706 0%, #D97706 ${(((answers[step] || 5) - 1) / 9) * 100}%, #E5E7EB ${(((answers[step] || 5) - 1) / 9) * 100}%, #E5E7EB 100%)` }} />
                <div className="flex justify-between mt-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <span key={n} className={`text-[11px] ${(answers[step] || 5) === n ? 'font-bold text-amber-600' : 'text-gray-300'}`}>{n}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* MULTI SELECT */}
          {current?.type === 'multi' && (
            <>
              <h2 className="text-[24px] max-md:text-[20px] font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>{lang === 'en' ? current.en : current.fr}</h2>
              <div className="flex flex-col gap-3">
                {current.options.map((opt, i) => {
                  const selected = (answers[step] || []) as string[];
                  const isSelected = selected.includes(opt);
                  const atMax = selected.length >= current.max && !isSelected;
                  return (
                    <button key={i} onClick={() => {
                      if (isSelected) setAnswer(selected.filter(s => s !== opt));
                      else if (!atMax) setAnswer([...selected, opt]);
                    }}
                      className={`w-full py-4 px-6 rounded-xl border-[1.5px] text-[15px] font-medium cursor-pointer transition-all text-left flex items-center gap-3 ${isSelected ? 'border-[#F9250E] bg-red-50/30' : atMax ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#F9250E] bg-[#F9250E]' : 'border-gray-300'}`}>
                        {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      {lang === 'en' ? opt : current.optionsFr[i]}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-[600px] mx-auto flex items-center justify-between">
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-[14px] font-semibold text-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-gray-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            &larr; {lang === 'en' ? 'Back' : 'Retour'}
          </button>
          <button onClick={handleNext} disabled={!canContinue()}
            className={`px-8 py-3 rounded-xl border-none text-[14px] font-bold text-white cursor-pointer transition-all ${canContinue() ? 'bg-[#F9250E] hover:-translate-y-px' : 'bg-gray-300 cursor-not-allowed'}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: canContinue() ? '0 4px 16px rgba(249,37,14,0.25)' : 'none' }}>
            {step === total - 1 ? (lang === 'en' ? 'Begin Full Assessment' : 'Commencer l\'\u00e9valuation') : (lang === 'en' ? 'Continue \u2192' : 'Continuer \u2192')}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #D97706; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; }
        input[type="range"]::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: #D97706; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; }
      `}</style>
    </div>
  );
}

export default function PreAssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</div>}>
      <PreAssessContent />
    </Suspense>
  );
}
