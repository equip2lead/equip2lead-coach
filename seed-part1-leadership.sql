-- ════════════════════════════════════════════════════════════════
-- EQUIP2LEAD — COMPLETE SEED DATA
-- All 5 Tracks · 25 Pillars · 106 Dimensions · 434 Questions
-- ════════════════════════════════════════════════════════════════

-- Clear existing data (in reverse dependency order)
DELETE FROM questions;
DELETE FROM sub_domains;
DELETE FROM pillars;
DELETE FROM tracks;

-- ═══════════════════════════════════════════════════════
-- TRACKS
-- ═══════════════════════════════════════════════════════

INSERT INTO tracks (id, slug, name_en, name_fr, description_en, description_fr, icon, color, sort_order) VALUES
('11111111-0000-0000-0000-000000000001', 'leadership',
 'Leadership Coaching', 'Coaching en Leadership',
 'Develop your leadership across 5 Pillars and 21 dimensions — from personal mastery and directional clarity to relational intelligence, team performance, and multiplication & impact.',
 'Développez votre leadership à travers 5 Piliers et 21 dimensions — de la maîtrise personnelle à l''intelligence relationnelle, la performance d''équipe et la multiplication de l''impact.',
 'crown', '#F9250E', 1),

('11111111-0000-0000-0000-000000000002', 'ministry',
 'Ministry Coaching', 'Coaching Ministériel',
 'Navigate 5 Pillars of ministry effectiveness — calling clarity, spiritual formation, preaching & teaching, pastoral care, and long-term sustainability — across 21 diagnostic dimensions.',
 'Naviguez à travers 5 Piliers d''efficacité ministérielle — clarté d''appel, formation spirituelle, prédication, soin pastoral et durabilité — sur 21 dimensions diagnostiques.',
 'bookmark', '#2563EB', 2),

('11111111-0000-0000-0000-000000000003', 'marriage',
 'Marriage Coaching', 'Coaching Conjugal',
 'Each spouse completes their intake individually across 5 Pillars and 21 relational dimensions. The platform analyses both sets of answers together. Separate intakes, combined insights.',
 'Chaque conjoint complète l''évaluation individuellement à travers 5 Piliers et 21 dimensions relationnelles. La plateforme analyse les deux ensembles ensemble.',
 'heart', '#DB2777', 3),

('11111111-0000-0000-0000-000000000004', 'entrepreneur',
 'Entrepreneur Coaching', 'Coaching Entrepreneurial',
 'Brutally honest diagnostics across 5 Pillars — revenue clarity, offer strategy, pricing discipline, financial stewardship, and execution. Kingdom principles + business fundamentals, 21 dimensions deep.',
 'Diagnostics à travers 5 Piliers — clarté de revenus, stratégie d''offre, discipline de prix, gestion financière et exécution. Principes du Royaume + fondamentaux business, 21 dimensions.',
 'rocket', '#EA580C', 4),

('11111111-0000-0000-0000-000000000005', 'personal-development',
 'Personal Development', 'Développement Personnel',
 'The entry-level discovery track for anyone seeking growth and purpose. 5 foundational Pillars that reveal your strengths and can graduate you into specialised coaching tracks.',
 'Le parcours découverte pour tous. 5 Piliers fondamentaux qui révèlent vos forces et vous orientent vers les parcours spécialisés.',
 'sprout', '#059669', 5);


-- ═══════════════════════════════════════════════════════
-- LEADERSHIP TRACK — PILLARS & DIMENSIONS & QUESTIONS
-- ═══════════════════════════════════════════════════════

-- LP1: Personal Leadership
INSERT INTO pillars (id, track_id, slug, name_en, name_fr, description_en, description_fr, sort_order) VALUES
('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'personal-leadership',
 'Personal Leadership', 'Leadership Personnel',
 'Leading Yourself First — The Person. Inner mastery pillar.',
 'Se diriger soi-même — La Personne. Pilier de maîtrise intérieure.', 1);

INSERT INTO sub_domains (id, pillar_id, slug, name_en, name_fr, sort_order) VALUES
('33333333-0001-0001-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'self-awareness', 'Self-Awareness', 'Conscience de soi', 1),
('33333333-0001-0002-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'emotional-intelligence', 'Emotional Intelligence', 'Intelligence Émotionnelle', 2),
('33333333-0001-0003-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'leading-yourself', 'Leading Yourself', 'Se Diriger Soi-Même', 3),
('33333333-0001-0004-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'leadership-styles', 'Leadership Styles', 'Styles de Leadership', 4),
('33333333-0001-0005-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'decision-making', 'Decision-Making', 'Prise de Décision', 5);

INSERT INTO questions (sub_domain_id, text_en, text_fr, sort_order) VALUES
-- Self-Awareness
('33333333-0001-0001-0000-000000000001', 'I can clearly identify my top 3 strengths and top 3 weaknesses as a leader.', 'Je peux clairement identifier mes 3 principales forces et faiblesses en tant que leader.', 1),
('33333333-0001-0001-0000-000000000001', 'I regularly seek honest feedback from others about my leadership style.', 'Je sollicite régulièrement des retours honnêtes sur mon style de leadership.', 2),
('33333333-0001-0001-0000-000000000001', 'I understand how my personality type affects the way I lead.', 'Je comprends comment mon type de personnalité affecte ma façon de diriger.', 3),
('33333333-0001-0001-0000-000000000001', 'I am aware of my emotional triggers and how they impact my decisions.', 'Je suis conscient de mes déclencheurs émotionnels et de leur impact sur mes décisions.', 4),
-- Emotional Intelligence
('33333333-0001-0002-0000-000000000001', 'I can remain calm and composed when under pressure or facing criticism.', 'Je peux rester calme et posé sous pression ou face à la critique.', 1),
('33333333-0001-0002-0000-000000000001', 'I am able to read the emotions of others and respond appropriately.', 'Je suis capable de lire les émotions des autres et d''y répondre de manière appropriée.', 2),
('33333333-0001-0002-0000-000000000001', 'I manage frustration and anger constructively rather than reactively.', 'Je gère la frustration et la colère de manière constructive plutôt que réactive.', 3),
('33333333-0001-0002-0000-000000000001', 'I show genuine empathy when team members face personal challenges.', 'Je fais preuve d''une empathie sincère lorsque mes coéquipiers font face à des défis personnels.', 4),
-- Leading Yourself
('33333333-0001-0003-0000-000000000001', 'I consistently follow through on commitments I make to myself and others.', 'Je tiens constamment les engagements que je prends envers moi-même et les autres.', 1),
('33333333-0001-0003-0000-000000000001', 'I have daily disciplines (reading, prayer, exercise, reflection) that I maintain.', 'J''ai des disciplines quotidiennes (lecture, prière, exercice, réflexion) que je maintiens.', 2),
('33333333-0001-0003-0000-000000000001', 'My private life reflects the same standards I hold publicly.', 'Ma vie privée reflète les mêmes standards que j''affiche publiquement.', 3),
('33333333-0001-0003-0000-000000000001', 'I take ownership of my mistakes rather than blaming others or circumstances.', 'Je prends la responsabilité de mes erreurs plutôt que de blâmer les autres.', 4),
-- Leadership Styles
('33333333-0001-0004-0000-000000000001', 'I adapt my leadership approach depending on the situation and the person.', 'J''adapte mon approche de leadership selon la situation et la personne.', 1),
('33333333-0001-0004-0000-000000000001', 'I know when to be directive and when to step back and empower others.', 'Je sais quand être directif et quand laisser les autres prendre les rênes.', 2),
('33333333-0001-0004-0000-000000000001', 'I can identify whether a team member needs coaching, support, or delegation.', 'Je peux identifier si un membre a besoin de coaching, de soutien ou de délégation.', 3),
('33333333-0001-0004-0000-000000000001', 'I am comfortable leading in both structured and ambiguous environments.', 'Je suis à l''aise pour diriger dans des environnements structurés comme ambigus.', 4),
-- Decision-Making
('33333333-0001-0005-0000-000000000001', 'I make decisions confidently even when I don''t have all the information.', 'Je prends des décisions avec confiance même sans avoir toutes les informations.', 1),
('33333333-0001-0005-0000-000000000001', 'I consider the long-term consequences of my decisions, not just short-term wins.', 'Je considère les conséquences à long terme, pas seulement les gains immédiats.', 2),
('33333333-0001-0005-0000-000000000001', 'I involve the right people in decisions without being paralysed by consensus.', 'J''implique les bonnes personnes sans être paralysé par le consensus.', 3),
('33333333-0001-0005-0000-000000000001', 'I can explain the reasoning behind my decisions clearly to my team.', 'Je peux expliquer clairement le raisonnement derrière mes décisions.', 4),
('33333333-0001-0005-0000-000000000001', 'I learn from past decisions and adjust my approach accordingly.', 'J''apprends de mes décisions passées et j''ajuste mon approche.', 5);

-- LP2: Directional Leadership
INSERT INTO pillars (id, track_id, slug, name_en, name_fr, description_en, description_fr, sort_order) VALUES
('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'directional-leadership',
 'Directional Leadership', 'Leadership Directionnel',
 'Where Are We Going? — The Principles. Results and clarity pillar.',
 'Où allons-nous ? — Les Principes. Pilier de résultats et clarté.', 2);

INSERT INTO sub_domains (id, pillar_id, slug, name_en, name_fr, sort_order) VALUES
('33333333-0002-0001-0000-000000000001', '22222222-0002-0000-0000-000000000001', 'vision', 'Vision', 'Vision', 1),
('33333333-0002-0002-0000-000000000001', '22222222-0002-0000-0000-000000000001', 'strategic-planning', 'Strategic Planning & Execution', 'Planification Stratégique', 2),
('33333333-0002-0003-0000-000000000001', '22222222-0002-0000-0000-000000000001', 'goal-setting', 'Goal Setting (SMART)', 'Fixation d''Objectifs (SMART)', 3),
('33333333-0002-0004-0000-000000000001', '22222222-0002-0000-0000-000000000001', 'accountability', 'Accountability & Ownership', 'Responsabilité', 4);

INSERT INTO questions (sub_domain_id, text_en, text_fr, sort_order) VALUES
('33333333-0002-0001-0000-000000000001', 'I have a clear, compelling vision for where I am leading my team or organisation.', 'J''ai une vision claire et convaincante de la direction dans laquelle je mène mon équipe.', 1),
('33333333-0002-0001-0000-000000000001', 'I can articulate my vision in a way that excites and inspires others.', 'Je peux articuler ma vision d''une manière qui inspire les autres.', 2),
('33333333-0002-0001-0000-000000000001', 'My daily actions are aligned with my long-term vision.', 'Mes actions quotidiennes sont alignées avec ma vision à long terme.', 3),
('33333333-0002-0001-0000-000000000001', 'I regularly revisit and refine my vision based on new insights.', 'Je revisite et affine régulièrement ma vision.', 4),
('33333333-0002-0002-0000-000000000001', 'I have a documented plan with clear milestones for achieving my goals.', 'J''ai un plan documenté avec des jalons clairs.', 1),
('33333333-0002-0002-0000-000000000001', 'I can break down big goals into actionable steps with timelines.', 'Je peux décomposer de grands objectifs en étapes actionnables.', 2),
('33333333-0002-0002-0000-000000000001', 'I regularly review progress against my plan and make adjustments.', 'Je révise régulièrement les progrès par rapport à mon plan.', 3),
('33333333-0002-0002-0000-000000000001', 'I distinguish between urgent tasks and strategically important ones.', 'Je distingue entre tâches urgentes et stratégiquement importantes.', 4),
('33333333-0002-0003-0000-000000000001', 'I set specific, measurable goals rather than vague intentions.', 'Je fixe des objectifs spécifiques et mesurables.', 1),
('33333333-0002-0003-0000-000000000001', 'My goals have clear deadlines and I track my progress regularly.', 'Mes objectifs ont des délais clairs et je suis mes progrès.', 2),
('33333333-0002-0003-0000-000000000001', 'I set goals that stretch me but are still realistic and achievable.', 'Je fixe des objectifs ambitieux mais réalistes.', 3),
('33333333-0002-0003-0000-000000000001', 'I write my goals down and review them at least weekly.', 'J''écris mes objectifs et les révise au moins chaque semaine.', 4),
('33333333-0002-0004-0000-000000000001', 'I have an accountability partner or mentor who challenges me regularly.', 'J''ai un partenaire de responsabilité qui me challenge régulièrement.', 1),
('33333333-0002-0004-0000-000000000001', 'I hold myself to the same standards I expect from others.', 'Je me tiens aux mêmes standards que j''attends des autres.', 2),
('33333333-0002-0004-0000-000000000001', 'When a project fails, I look inward first before pointing outward.', 'Quand un projet échoue, je regarde d''abord en moi-même.', 3),
('33333333-0002-0004-0000-000000000001', 'I create systems of accountability within my team, not just for myself.', 'Je crée des systèmes de responsabilité au sein de mon équipe.', 4);

-- LP3: Relational Leadership
INSERT INTO pillars (id, track_id, slug, name_en, name_fr, description_en, description_fr, sort_order) VALUES
('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'relational-leadership',
 'Relational Leadership', 'Leadership Relationnel',
 'How We Lead People — The Process. Culture pillar.',
 'Comment nous dirigeons — Le Processus. Pilier de culture.', 3);

INSERT INTO sub_domains (id, pillar_id, slug, name_en, name_fr, sort_order) VALUES
('33333333-0003-0001-0000-000000000001', '22222222-0003-0000-0000-000000000001', 'communication', 'Communication', 'Communication', 1),
('33333333-0003-0002-0000-000000000001', '22222222-0003-0000-0000-000000000001', 'team-building', 'Team Building', 'Constitution d''Équipe', 2),
('33333333-0003-0003-0000-000000000001', '22222222-0003-0000-0000-000000000001', 'conflict-resolution', 'Conflict Resolution', 'Résolution de Conflits', 3),
('33333333-0003-0004-0000-000000000001', '22222222-0003-0000-0000-000000000001', 'servant-leadership', 'Servant Leadership', 'Leadership Serviteur', 4);

INSERT INTO questions (sub_domain_id, text_en, text_fr, sort_order) VALUES
('33333333-0003-0001-0000-000000000001', 'I communicate clearly and concisely, avoiding ambiguity.', 'Je communique clairement et de manière concise.', 1),
('33333333-0003-0001-0000-000000000001', 'I listen actively — I seek to understand before being understood.', 'J''écoute activement — je cherche à comprendre avant d''être compris.', 2),
('33333333-0003-0001-0000-000000000001', 'I tailor my communication style depending on my audience.', 'J''adapte mon style de communication selon mon audience.', 3),
('33333333-0003-0001-0000-000000000001', 'I give direct, honest communication even when the message is uncomfortable.', 'Je communique directement même quand le message est inconfortable.', 4),
('33333333-0003-0001-0000-000000000001', 'I create space for others to voice their opinions and concerns.', 'Je crée un espace pour que les autres expriment leurs opinions.', 5),
('33333333-0003-0002-0000-000000000001', 'I intentionally invest in building trust within my team.', 'J''investis intentionnellement dans la confiance au sein de mon équipe.', 1),
('33333333-0003-0002-0000-000000000001', 'I understand the strengths of each team member and position them accordingly.', 'Je comprends les forces de chaque membre et les positionne en conséquence.', 2),
('33333333-0003-0002-0000-000000000001', 'I celebrate team wins and give credit where it''s due.', 'Je célèbre les victoires d''équipe et donne le crédit mérité.', 3),
('33333333-0003-0002-0000-000000000001', 'I actively work to create a culture where people feel safe to contribute.', 'Je travaille à créer une culture où les gens se sentent en sécurité.', 4),
('33333333-0003-0003-0000-000000000001', 'I address conflict directly rather than avoiding it or hoping it resolves itself.', 'J''aborde les conflits directement plutôt que de les éviter.', 1),
('33333333-0003-0003-0000-000000000001', 'I can mediate disagreements between team members fairly.', 'Je peux arbitrer les désaccords de manière équitable.', 2),
('33333333-0003-0003-0000-000000000001', 'I separate the person from the problem when navigating conflict.', 'Je sépare la personne du problème lors d''un conflit.', 3),
('33333333-0003-0003-0000-000000000001', 'I seek win-win outcomes rather than just winning the argument.', 'Je cherche des résultats gagnant-gagnant.', 4),
('33333333-0003-0004-0000-000000000001', 'I regularly ask my team ''How can I help you succeed?''', 'Je demande régulièrement à mon équipe « Comment puis-je vous aider ? »', 1),
('33333333-0003-0004-0000-000000000001', 'I prioritise the growth and wellbeing of my team over my own advancement.', 'Je priorise la croissance de mon équipe sur mon propre avancement.', 2),
('33333333-0003-0004-0000-000000000001', 'I lead by example — I don''t ask others to do what I wouldn''t do myself.', 'Je dirige par l''exemple — je ne demande pas ce que je ne ferais pas.', 3),
('33333333-0003-0004-0000-000000000001', 'I use my position to serve others, not to gain power or status.', 'J''utilise ma position pour servir, pas pour gagner du pouvoir.', 4);

-- LP4: Performance Leadership
INSERT INTO pillars (id, track_id, slug, name_en, name_fr, description_en, description_fr, sort_order) VALUES
('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'performance-leadership',
 'Performance Leadership', 'Leadership de Performance',
 'Driving Standards — Execution discipline pillar.',
 'Élever les standards — Pilier de discipline d''exécution.', 4);

INSERT INTO sub_domains (id, pillar_id, slug, name_en, name_fr, sort_order) VALUES
('33333333-0004-0001-0000-000000000001', '22222222-0004-0000-0000-000000000001', 'delegation', 'Delegation', 'Délégation', 1),
('33333333-0004-0002-0000-000000000001', '22222222-0004-0000-0000-000000000001', 'feedback-performance', 'Feedback & Performance Management', 'Feedback & Gestion de Performance', 2),
('33333333-0004-0003-0000-000000000001', '22222222-0004-0000-0000-000000000001', 'managing-underperformance', 'Managing Underperformance', 'Gestion de la Sous-Performance', 3),
('33333333-0004-0004-0000-000000000001', '22222222-0004-0000-0000-000000000001', 'difficult-conversations', 'Difficult Conversations', 'Conversations Difficiles', 4);

INSERT INTO questions (sub_domain_id, text_en, text_fr, sort_order) VALUES
('33333333-0004-0001-0000-000000000001', 'I delegate tasks based on people''s strengths, not just availability.', 'Je délègue selon les forces des personnes, pas juste leur disponibilité.', 1),
('33333333-0004-0001-0000-000000000001', 'I give clear instructions and expected outcomes when I delegate.', 'Je donne des instructions claires et des résultats attendus quand je délègue.', 2),
('33333333-0004-0001-0000-000000000001', 'I trust my team to execute without micromanaging the process.', 'Je fais confiance à mon équipe sans micro-gérer.', 3),
('33333333-0004-0001-0000-000000000001', 'I follow up on delegated tasks without hovering over people.', 'Je fais le suivi des tâches déléguées sans harceler les gens.', 4),
('33333333-0004-0002-0000-000000000001', 'I give constructive feedback regularly, not just during annual reviews.', 'Je donne des retours constructifs régulièrement.', 1),
('33333333-0004-0002-0000-000000000001', 'I balance positive recognition with honest developmental feedback.', 'J''équilibre reconnaissance positive et retours de développement.', 2),
('33333333-0004-0002-0000-000000000001', 'I create a culture where feedback flows in both directions.', 'Je crée une culture où le feedback circule dans les deux sens.', 3),
('33333333-0004-0002-0000-000000000001', 'I use specific examples when giving feedback, not generalisations.', 'J''utilise des exemples spécifiques, pas des généralisations.', 4),
('33333333-0004-0003-0000-000000000001', 'I address underperformance early rather than letting it build up.', 'J''aborde la sous-performance tôt plutôt que de la laisser s''accumuler.', 1),
('33333333-0004-0003-0000-000000000001', 'I distinguish between a skill gap and a motivation gap when someone underperforms.', 'Je distingue entre un manque de compétence et un manque de motivation.', 2),
('33333333-0004-0003-0000-000000000001', 'I document performance issues and create improvement plans.', 'Je documente les problèmes de performance et crée des plans d''amélioration.', 3),
('33333333-0004-0003-0000-000000000001', 'I am willing to make tough personnel decisions when necessary.', 'Je suis prêt à prendre des décisions difficiles concernant le personnel.', 4),
('33333333-0004-0004-0000-000000000001', 'I can have hard conversations without becoming emotional or aggressive.', 'Je peux avoir des conversations difficiles sans devenir émotionnel ou agressif.', 1),
('33333333-0004-0004-0000-000000000001', 'I prepare for difficult conversations rather than winging them.', 'Je me prépare pour les conversations difficiles.', 2),
('33333333-0004-0004-0000-000000000001', 'I am direct but respectful when delivering unwelcome news.', 'Je suis direct mais respectueux quand je délivre de mauvaises nouvelles.', 3),
('33333333-0004-0004-0000-000000000001', 'I follow up after difficult conversations to check on the person and the outcome.', 'Je fais le suivi après les conversations difficiles.', 4);

-- LP5: Multiplication & Impact
INSERT INTO pillars (id, track_id, slug, name_en, name_fr, description_en, description_fr, sort_order) VALUES
('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'multiplication-impact',
 'Multiplication & Impact', 'Multiplication & Impact',
 'Beyond You — Expansion pillar.',
 'Au-delà de vous — Pilier d''expansion.', 5);

INSERT INTO sub_domains (id, pillar_id, slug, name_en, name_fr, sort_order) VALUES
('33333333-0005-0001-0000-000000000001', '22222222-0005-0000-0000-000000000001', 'coaching', 'Coaching', 'Coaching', 1),
('33333333-0005-0002-0000-000000000001', '22222222-0005-0000-0000-000000000001', 'mentoring', 'Mentoring', 'Mentorat', 2),
('33333333-0005-0003-0000-000000000001', '22222222-0005-0000-0000-000000000001', 'developing-leaders', 'Developing Leaders', 'Développer des Leaders', 3),
('33333333-0005-0004-0000-000000000001', '22222222-0005-0000-0000-000000000001', 'legacy', 'Legacy', 'Héritage', 4);

INSERT INTO questions (sub_domain_id, text_en, text_fr, sort_order) VALUES
('33333333-0005-0001-0000-000000000001', 'I regularly coach others by asking powerful questions rather than just giving answers.', 'Je coache régulièrement en posant des questions puissantes.', 1),
('33333333-0005-0001-0000-000000000001', 'I help people discover their own solutions instead of creating dependency on me.', 'J''aide les gens à découvrir leurs propres solutions.', 2),
('33333333-0005-0001-0000-000000000001', 'I invest time in one-on-one development conversations with emerging leaders.', 'J''investis du temps dans des conversations individuelles de développement.', 3),
('33333333-0005-0001-0000-000000000001', 'I can identify someone''s potential even before they see it themselves.', 'Je peux identifier le potentiel de quelqu''un avant qu''il ne le voie.', 4),
('33333333-0005-0002-0000-000000000001', 'I have mentees who I am intentionally pouring into.', 'J''ai des mentorés dans lesquels j''investis intentionnellement.', 1),
('33333333-0005-0002-0000-000000000001', 'I share my failures and lessons learned, not just my successes.', 'Je partage mes échecs et leçons, pas seulement mes succès.', 2),
('33333333-0005-0002-0000-000000000001', 'I connect my mentees with other resources and people who can help them grow.', 'Je connecte mes mentorés avec d''autres ressources.', 3),
('33333333-0005-0002-0000-000000000001', 'I adjust my mentoring approach based on each person''s unique needs and stage.', 'J''adapte mon approche de mentorat selon les besoins de chacun.', 4),
('33333333-0005-0003-0000-000000000001', 'I actively identify and develop future leaders within my team or organisation.', 'J''identifie et développe activement les futurs leaders.', 1),
('33333333-0005-0003-0000-000000000001', 'I give emerging leaders real responsibility and authority, not just tasks.', 'Je donne aux leaders émergents de vraies responsabilités.', 2),
('33333333-0005-0003-0000-000000000001', 'I have a leadership pipeline — people at different stages of development.', 'J''ai un pipeline de leadership — des personnes à différents stades.', 3),
('33333333-0005-0003-0000-000000000001', 'I measure my success by the leaders I produce, not just the results I deliver.', 'Je mesure mon succès par les leaders que je produis.', 4),
('33333333-0005-0004-0000-000000000001', 'I regularly think about the long-term impact of my leadership beyond my tenure.', 'Je pense régulièrement à l''impact à long terme de mon leadership.', 1),
('33333333-0005-0004-0000-000000000001', 'I am building something that will outlast me, not just something that depends on me.', 'Je construis quelque chose qui me survivra.', 2),
('33333333-0005-0004-0000-000000000001', 'I document my leadership principles and frameworks for others to learn from.', 'Je documente mes principes de leadership pour que d''autres apprennent.', 3),
('33333333-0005-0004-0000-000000000001', 'I invest in institutions and systems, not just individual relationships.', 'J''investis dans des institutions et systèmes, pas seulement des relations.', 4);
