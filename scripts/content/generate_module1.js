// Module 1 — "The Leader Within — Self-Leadership and Personal Mastery"
// Reverse-engineered from the live row on 2026-09-29, the same way Module 0's
// generator was. Module 1 predates the generator pattern: its blocks were
// authored directly as JSON and have since been edited in the database — six
// real images swapped in, a 51-block section replaced, videos changed.
//
// Built from production, NOT from module1_leadership_track_blocks.json. That
// file is dated 2026-09-05, predates every one of those edits, and was not used
// even as a reference. This file is verified byte-for-byte against the live row.
//
// Five shapes here differ from the conventions Modules 2-12 settled on. All are
// reproduced faithfully rather than normalised:
//   * `quote` blocks, distinct from pull_quote_card, with an optional
//     attribution — 5 of 14 carry one, the other 9 omit the key entirely.
//   * scorecard items carry NO helpText. Every other module's do.
//   * assignment prompts carry an `example` field alongside guidance.
//   * assignmentPrompt carries a submit_label ("Submit Manifesto").
//   * Section headings carry the literal "Section N — " prefix, and the final
//     section is titled "Assignment — …". The splitter strips both for display.

const fs = require('fs');

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const divider = () => ({ type: "divider", data: {} });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });
const image = (url, alt) => ({ type: "image", data: { url, alt } });
const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const reflectionQuestions = (title, questions) => ({ type: "reflection_questions", data: { title, questions } });
const quiz = (scope, title, questions) => ({ type: "quiz", data: { scope, title, questions } });
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });

// This module's scorecards predate helpText, which every later module's carry.
// Emitting an empty helpText here would not reproduce production.
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });

// `quote` is a separate block type from pull_quote_card. Attribution is emitted
// only when there is one — the live blocks omit the key entirely otherwise.
const quote = (text, attribution) =>
  attribution === undefined
    ? { type: "quote", data: { text } }
    : { type: "quote", data: { text, attribution } };

// submit_label and per-prompt `example` are unique to Modules 0 and 1.
const assignmentPrompt = ({ title, instructions, prompts, word_min, word_max, submit_label }) => ({
  type: "assignment_prompt",
  data: { title, instructions, prompts, word_min, word_max, submit_label },
});

// ─── SECTION 1 — Why You Must Lead Yourself First ──────────────────────────
const section1 = {
  section_number: 1,
  title: "Why You Must Lead Yourself First",
  blocks: [
    heading(2, "The Leader Within: Self-Leadership and Personal Mastery"),
    paragraph("Module 1 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary welcome video, real per-module recordings to follow"),
    callout("info", "Who this is for: Any leader — new or experienced — who wants to build leadership on a foundation that lasts. Especially critical for leaders who scored below 4.0 on Personal Leadership in the assessment."),
    callout("info", "Core promise: By the end of this module, you'll have a clear, honest picture of who you are as a leader, know your emotional patterns and how to manage them, and have a daily practice for leading yourself before you attempt to lead others."),
    callout("info", "Time commitment: Roughly 90 minutes of reading + 30 minutes of assignment work."),
    divider(),
    heading(2, "Section 1 — Why You Must Lead Yourself First"),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary placeholder video, real per-section recordings to follow"),
    paragraph("There is a lie most leaders believe, and it takes years to unlearn."),
    paragraph("The lie is this: leadership is something you do to other people. You take a position. You give direction. You cast vision. You manage performance. You build a team. If you get better at these things, you become a better leader."),
    paragraph("There is truth in that. But it is not where leadership begins."),
    paragraph("Leadership begins in a much quieter place. It begins in the person you are when nobody is watching. It begins in how you speak to yourself when you fail. It begins in what you do at 5:30 in the morning, or at 11 at night, when no one will ever see it. It begins in the small, private choices that no team meeting will ever surface."),
    paragraph("Leadership begins with the person in the mirror."),
    heading(3, "The Uncomfortable Law"),
    paragraph("Before you can lead a team, you must lead yourself. Before you can influence others, you must have influence over your own life. Before you can call people to a standard, you must be able to hold yourself to one."),
    paragraph("This is not a spiritual slogan. It is a hard, observable law:"),
    quote("You cannot consistently perform outwardly in a manner that is inconsistent with the way you are inwardly.", "Leading from the Inside Out"),
    paragraph("You can pretend for a season. Maybe even for years. You can perform the calm you do not have. You can teach the discipline you do not practice. You can preach the humility you do not live."),
    paragraph("But you cannot do it consistently."),
    paragraph("Sooner or later, who you are on the inside leaks out. It shows up in a moment of pressure. In a meeting that goes sideways. In a decision made when you are tired. In how you speak to your spouse after a hard day. In an email you should never have sent. In a text message that appears in someone else's phone six months from now."),
    paragraph("The leader who leads only from the outside in is performing. The leader who leads from the inside out is becoming."),
    paragraph("There is no shortcut around this. There is no course, no book, no strategy, no title that will let you skip the inner work. If the inner life is neglected, everything you build on top of it becomes fragile — and eventually, it comes down."),
    heading(3, "The Cost of Skipping This Step"),
    paragraph("We live in a time that has produced a strange kind of leader: highly visible, highly gifted, deeply broken. Leaders who can command a room but cannot regulate their emotions at home. Leaders who can raise millions but cannot sit with themselves in silence for ten minutes. Leaders who inspire thousands to change but cannot change one habit in their own lives."),
    paragraph("Think of the pastors, CEOs, politicians, and celebrities you have watched publicly fall in the last ten years."),
    paragraph("They did not fall because they lacked competence. Competence was never their problem. They fell because no one taught them — or they refused to learn — how to lead themselves."),
    paragraph("Their gifts took them where their character could not keep them."),
    paragraph("There is an old truth I return to often:"),
    quote("Your charisma or gift will lift you up. But your character is what will maintain you up there. Character is what you are in the dark."),
    paragraph("Every leader eventually reaches the altitude where their gifting can no longer sustain the weight. At that altitude, only character holds. And character is not built in the spotlight. It is built in the years of ordinary decisions no one will ever see."),
    pullQuote("Your gifts will take you where your character cannot keep you."),
    heading(3, "What Scripture Shows Us: Moses, Joseph, and the Slow-Cooker Principle"),
    paragraph("The Bible does not present leaders as men and women who arrived fully formed. It shows us people God shaped over decades — often through hidden years no one would have chosen."),
    paragraph("Consider Moses. Born a Hebrew, raised in Pharaoh's palace as Egyptian, belonging to neither world. When he tried to lead in his own strength at age 40, he killed a man and had to flee. God then spent forty years shaping him in the wilderness before he was ready to lead Israel out of Egypt. Forty years of solitude, humility, and formation — for forty years of ministry."),
    paragraph("Consider Joseph. God gave him a vision of leadership as a teenager. But between the dream and the palace came the pit, the slavery in Potiphar's house, and the years in prison. Roughly thirteen years of formation before God trusted him with authority. The pit stripped him of a false identity. Slavery taught him excellence without status. Prison forged his character where no audience could see it. And then — only then — the palace."),
    paragraph("Consider David. Anointed as a teenager, David waited between ten and thirteen years, running from Saul in caves and wilderness, before he ever sat on a throne. The shepherd boy became a king in secret, long before he became one in public."),
    paragraph("The pattern is not accidental. It is the way God builds leaders."),
    quote("Leadership is not a microwave experience — it is a process. God prepares leaders in a slow-cooker."),
    paragraph("Robert Clinton, in his study of hundreds of biblical and modern leaders, identified this pattern as five phases of leader formation:"),
    paragraph("1. Sovereign Foundations — God shapes who you are before you know He is doing it. Your family, culture, gifts, and early experiences are being used."),
    paragraph("2. Inner-Life Growth — Before God works through you, He works in you. Character is formed through trials, obedience, and hidden years."),
    paragraph("3. Ministry Maturing — You step into active leadership. But God is still primarily working in you, refining your skills and faith before granting greater influence."),
    paragraph("4. Life Maturing — Your gifts and calling align with your identity. Leadership is no longer about striving — it is about being fruitful. Deep communion with God becomes the foundation."),
    paragraph("5. Convergence — The highest stage. You are placed into a role that perfectly matches your gifts, experiences, and temperament. Maximum Kingdom impact. Few leaders reach this stage. Many stop at Phase 3 or 4 — because they refuse to keep doing the inner work."),
    callout("warning", "Most leaders want to skip Phase 2. That is where the drop-off happens. That is why so many gifted people never reach convergence — they refuse the slow-cooker. This module is an invitation back into that inner work."),
    heading(3, "The Congruence Test: Who You Are vs. What You Say"),
    paragraph("You have probably experienced this from both sides."),
    paragraph("You have listened to a leader who said all the right words — and something in you did not trust them. You could not name it. You just knew."),
    paragraph("You have also listened to a leader who said very little — and something in you followed them anyway. Something about their presence carried more weight than their words."),
    paragraph("The difference between those two leaders is not talent, or intelligence, or charisma. It is congruence — the alignment between who they are on the inside and how they show up on the outside."),
    paragraph("People can sense that alignment before they can name it. And they will follow it long before they follow a strategy."),
    paragraph("Research confirms what your gut already knows:"),
    quote("A leader's influence is 70% who they are — and only 30% what they say and do."),
    paragraph("Read that again."),
    paragraph("Most leadership training focuses on the 30%. It teaches you what to say, how to structure a meeting, how to give feedback, how to hold a difficult conversation. All useful. All necessary. But it is the smaller half of the equation."),
    paragraph("The 70% — who you are — is what this module is about."),
    videoEmbed("lmyZMtPVodo", "Why Good Leaders Make You Feel Safe | Simon Sinek | TED"),
    quiz(
      "video_check",
      "Quick Check: Why Good Leaders Make You Feel Safe",
      [
        {
          id: "q1",
          prompt: "According to Sinek's talk, what is the leader's primary job?",
          options: [
            { id: "a", text: "To make the best individual decisions for the company" },
            { id: "b", text: "To extend the \"circle of safety\" so people feel protected from threats inside the organization, not just outside it" },
            { id: "c", text: "To set the most ambitious goals possible" },
            { id: "d", text: "To ensure the company outperforms every competitor" },
          ],
          correct_option_id: "b",
          explanation: "Sinek's core argument is that leadership is fundamentally about protecting people, not directing them — a \"circle of safety\" that removes internal threats so people can focus energy on real external threats and opportunities.",
        },
        {
          id: "q2",
          prompt: "Sinek connects trust and cooperation to which biological factor?",
          options: [
            { id: "a", text: "Adrenaline" },
            { id: "b", text: "Cortisol released under threat, versus oxytocin and serotonin released through trust" },
            { id: "c", text: "Dopamine from achieving goals" },
            { id: "d", text: "Testosterone and competitive drive" },
          ],
          correct_option_id: "b",
          explanation: "These aren't abstract feelings — Sinek frames them as measurable chemical responses. Fear/mistrust floods people with cortisol, actively working against cooperation and good judgment.",
        },
        {
          id: "q3",
          prompt: "What does Sinek mean by leaders needing to \"eat last\"?",
          options: [
            { id: "a", text: "Leaders should have humility about food and possessions" },
            { id: "b", text: "A practice where leaders visibly ensure their people are provided for before themselves, as a signal of the circle of safety" },
            { id: "c", text: "Leaders should always be the last to leave the office" },
            { id: "d", text: "A metaphor for patience in decision-making" },
          ],
          correct_option_id: "b",
          explanation: "It's literal in some of his examples but stands for something larger — leaders who visibly sacrifice for their people build the trust that makes the circle of safety real, not just claimed.",
        },
      ]
    ),
    heading(3, "Three Ways Leadership Gets Used — and Only One of Them Is Real"),
    paragraph("There are only three ways a leader can use their influence over people."),
    paragraph("One — Leadership TO people. This is exploitation. The leader uses people to accomplish their agenda, then discards them. Common in politics, some businesses, and unfortunately, some ministries. It produces results in the short term and destruction in the long term."),
    paragraph("Two — Leadership FOR people. This is paternalism. The leader does everything for their people, keeping them dependent. It looks kind. It feels heroic. But it produces followers who cannot function without the leader — and a leader who quietly needs the dependency to feel valuable."),
    paragraph("Three — Leadership THROUGH people. This is the real thing. The leader develops others so that everyone grows. Power is shared. Authority is distributed. The leader's greatest joy is watching others surpass them."),
    quote("Only secure leaders give their power to others."),
    paragraph("You cannot lead THROUGH people if you are still leading FROM your own insecurity. And you cannot address your insecurity without doing the inner work."),
    heading(3, "The Ultimate Test"),
    paragraph("There is one final test of your leadership that matters more than any performance review, any KPI, any Sunday morning attendance number."),
    quote("The ultimate test of leadership is not what happens when you are present. It is what happens when you are gone."),
    paragraph("When you leave the room. When you leave the organization. When you leave this earth."),
    paragraph("Did the people you led grow into more of who God made them to be — or did they shrink to fit the shape of your need to control them?"),
    paragraph("Did the systems you built continue to bear fruit without you — or did they collapse the moment you were no longer holding them together?"),
    paragraph("Did you leave the mission stronger than you found it — or did you consume it?"),
    paragraph("These questions cannot be answered by charisma. They cannot be answered by talent. They can only be answered by the character you built in the hidden years — and by whether you kept doing the inner work long after you no longer had to."),
    reflectionQuestions(
      "Before You Move On — Sit With These Questions",
      [
        "Where in your leadership right now are you performing on the outside what has not yet become true on the inside? Be specific. Name the gap.",
        "If the people you lead could see you when no one else is watching — the version of you at home, in traffic, alone at night — would they still follow you? Why or why not?",
        "What is one area of your inner life you have been avoiding? You already know what it is. Naming it here — even just to yourself — is where the module begins to work on you.",
        "Which of Robert Clinton's five phases best describes where you are right now? Are you in Sovereign Foundations, Inner-Life Growth, Ministry Maturing, Life Maturing, or Convergence? Be honest — not aspirational.",
        "What is one thing you would need to change in order to move to the next phase?",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 2 — Who Am I? The Identity Question ───────────────────────────
const section2 = {
  section_number: 2,
  title: "Who Am I? The Identity Question",
  blocks: [
    heading(2, "Section 2 — Who Am I? The Identity Question"),
    image("/images/module-1/mirror-self-reflection.png", "A man sits at a wooden desk in low morning sun, chin resting on his hand, studying his own face in an oval tilting mirror. Beside him are a potted plant, a pot of pens and a spiral notebook with \"A Better Me, A Greater Tomorrow\" written on the open page. Three stacked books read KNOW YOURSELF, GROW DAILY and LEAD WITH PURPOSE."),
    paragraph("There is a question that every leader must answer before they can lead anyone else."),
    paragraph("It is not \"What should I do?\" It is not \"Where am I going?\" It is not even \"What is my purpose?\""),
    pullQuote("The question is: Who am I?"),
    paragraph("If you cannot answer that question, everything else is guesswork. Your decisions will drift. Your leadership will fluctuate with your mood, your audience, and your circumstances. You will be shaped by whoever is loudest around you — because you have no internal compass to shape you from within."),
    heading(3, "The Four \"First Persons\" of Every Leader"),
    paragraph("I teach leaders that there are four \"first persons\" you must reckon with — long before you ever try to lead anyone else."),
    paragraph("The first person you must know is yourself. Not the version you wish you were. The version you actually are. Your patterns, your triggers, your gifts, your wounds, your default reactions when tired or afraid."),
    paragraph("The first person you must get along with is yourself. Many leaders lead others well but cannot live at peace with themselves. They achieve, achieve, achieve — and yet cannot sit alone in a room for ten minutes without reaching for a screen. That is not high performance. That is running."),
    paragraph("The first person whose problems you must own is yourself. It is easy to see what is wrong with your team, your organization, your marriage, your culture. It is much harder to sit with what is wrong in you — and take responsibility for it without blaming anyone else."),
    paragraph("The first person you must change is yourself. Every leader wants to change their team, their church, their business, their country. Few leaders begin by changing themselves. Yet no lasting change ever flowed from a leader who was unwilling to be changed first."),
    paragraph("Get these four right, and everything else in your leadership becomes possible. Get them wrong, and no amount of skill training will save you."),
    heading(3, "What Scripture Says About Identity"),
    paragraph("The Bible does not treat identity as a self-help question. It treats it as the foundation of everything else."),
    paragraph("Consider Moses. Born a Hebrew, raised as Egyptian royalty, he belonged to neither world. At 40, he tried to lead in his own strength and killed a man. He fled to the wilderness — and there, for another 40 years, God rebuilt his identity from the ground up."),
    paragraph("When Moses finally stood at the burning bush, his first question was an identity question: \"Who am I that I should go to Pharaoh?\" (Exodus 3:11). And God's answer was not a resume of Moses' qualifications. It was a promise: \"I will be with you.\" God grounded Moses' identity not in what Moses could do — but in whose he was."),
    quote("Your identity is not what you can do. It is whose you are."),
    paragraph("Consider Jacob at Peniel (Genesis 32). He wrestled with God through the night, and God asked him a strange question: \"What is your name?\" Jacob had lied about his name once before — to steal his brother's blessing. This time, he told the truth: \"My name is Jacob.\" — which means \"deceiver.\" Only after he owned who he had actually been did God rename him Israel — \"one who wrestles with God.\""),
    quote("God cannot rename what you refuse to name."),
    paragraph("Consider Paul. Before his transformation, he was Saul — a religious man of terrifying certainty, persecuting the church he thought he was defending. On the Damascus road, he was blinded. And in that blindness he had to reckon with who he actually was — before God could send him out as the Paul we know. The apostle who wrote most of the New Testament had to lose his identity before he could receive his real one."),
    paragraph("Every great biblical leader had to have their identity broken and rebuilt before they were entrusted with real leadership. That is not an accident. That is the pattern."),
    heading(3, "The Two Wrong Foundations"),
    paragraph("Most leaders build their identity on one of two wrong foundations. Both will eventually collapse."),
    heading(4, "Wrong Foundation #1: Performance."),
    paragraph("\"I am what I do.\" \"I am my job title.\" \"I am my success.\" \"I am my results.\""),
    paragraph("Performance-based identity is the most common leadership trap on earth. It works — until it doesn't. Until you fail. Until you get fired. Until the ministry closes. Until the business collapses. Until your body breaks down. Until you retire. Then you discover: without the performance, you don't know who you are."),
    paragraph("I have seen too many pastors, executives, and public figures whose identity was so tied to their platform that when the platform disappeared, they nearly disappeared with it. Some never recovered. Some ended their lives."),
    callout("warning", "Do not build your identity on performance. It is sand."),
    heading(4, "Wrong Foundation #2: Approval."),
    paragraph("\"I am what people think of me.\" \"I am my reputation.\" \"I am my Instagram followers.\" \"I am the applause I get on Sunday.\""),
    paragraph("Approval-based identity is the second trap — and it is subtler than performance. It masquerades as humility (\"I just want to serve people\") when it is often desperate need dressed up in ministry language."),
    paragraph("The leader whose identity is built on approval cannot make hard decisions. Cannot deliver difficult truths. Cannot say no to anyone important. Cannot rest, because rest means the applause stops. Cannot lead — because leadership always eventually requires displeasing someone."),
    callout("warning", "Do not build your identity on approval. It is sand too."),
    heading(3, "The Right Foundation: \"In Christ, I Am...\""),
    paragraph("For the Christ-following leader, there is only one foundation that holds under every kind of pressure. It is the identity Scripture gives you — before you did anything, before you achieved anything, before anyone approved of anything."),
    paragraph("In Christ, I am fully accepted. (Romans 15:7) Not because I earned it. Because Jesus did."),
    paragraph("In Christ, I am never alone. (Hebrews 13:5) Not just when the room is full. Even when it is empty."),
    paragraph("In Christ, I am secure and I belong to God. (John 10:28) No power, no failure, no accusation can take that from me."),
    paragraph("In Christ, I am valued and I have a purpose. (Ephesians 2:10) I am God's handiwork, created to do good works He prepared in advance for me to do."),
    paragraph("When your identity is built on this foundation, you can afford to fail. You can afford to be misunderstood. You can afford to be criticized. You can afford to lose the platform, the title, the applause — because none of them were what made you you in the first place."),
    pullQuote("That is the identity of a leader who lasts."),
    heading(3, "Know → Be → Do — The Foundation is Being"),
    paragraph("This brings us back to the Denis Ekobena Framework:"),
    quote("KNOW → BE → DO. You must know who you are before you can be who you were made to be. And you must be who you were made to be before you can do what you were called to do."),
    paragraph("Notice the order. Doing does not come first. Being does not come first. Knowing comes first. And knowing yourself is where every leader either lays a foundation that will hold, or skips a step they will pay for later."),
    paragraph("If you skip the KNOW, your BEING will always be uncertain, and your DOING will always be exhausting."),
    paragraph("Most burnt-out leaders I meet did not burn out from doing too much. They burnt out from doing too much without knowing who they were. They were performing an identity they had never fully sat with. Sooner or later, the performance broke them."),
    callout("warning", "Do not skip this section."),
    reflectionQuestions(
      "Before You Move On — Sit With These Questions",
      [
        "Right now, what have you been unconsciously using as your identity foundation? Performance? Approval? Role? Reputation? Family? Something else? Name it honestly.",
        "What would collapse in your identity if that foundation were suddenly removed? (Loss of job, loss of platform, loss of health, loss of a key relationship?)",
        "Complete this sentence 10 times: \"I am a leader who ___.\" Then read them back. Do they describe an identity — or a performance?",
        "Now complete this sentence 10 times: \"In Christ, I am ___.\" Read them back. Notice the difference.",
        "What is one identity lie you have been believing about yourself that you need to renounce? (Example: \"I am only worth what I produce.\" \"I am not enough.\" \"I am my worst mistake.\" \"I am irreplaceable.\")",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 3 — The Four Pillars of Self-Leadership ───────────────────────
const section3 = {
  section_number: 3,
  title: "The Four Pillars of Self-Leadership",
  blocks: [
    heading(2, "Section 3 — The Four Pillars of Self-Leadership"),
    image("/images/module-1/four-pillars.png", "Four weathered stone columns of an ancient temple, seen from the base of its steps, carrying an entablature above. The sun rises between them over a wide valley. No text appears in the image."),
    videoEmbed("b5RlVhaT-DA", "Becoming a Leader People Love to Follow | Craig Groeschel Leadership Podcast"),
    quiz(
      "video_check",
      "Quick Check: Becoming a Leader People Love to Follow",
      [
        {
          id: "q1",
          prompt: "What distinction does Groeschel draw between a popular leader and a respected one?",
          options: [
            { id: "a", text: "Popular leaders are more effective in a crisis" },
            { id: "b", text: "A popular leader is driven by being liked; a respected leader is driven by serving well, even when it costs them likability" },
            { id: "c", text: "Respected leaders avoid all criticism" },
            { id: "d", text: "There's no real difference between the two" },
          ],
          correct_option_id: "b",
          explanation: "Chasing popularity and genuinely leading well can quietly pull in opposite directions — a leader optimizing for being liked will eventually avoid necessary but unpopular decisions.",
        },
        {
          id: "q2",
          prompt: "According to the talk, what tends to quietly corrupt leadership over time?",
          options: [
            { id: "a", text: "Lack of vision" },
            { id: "b", text: "Pride and the desire for power, dressed up as confidence or decisiveness" },
            { id: "c", text: "Being too collaborative" },
            { id: "d", text: "Spending too much time with the team" },
          ],
          correct_option_id: "b",
          explanation: "The warning is specifically about how pride can disguise itself as strong leadership, making it harder to notice in yourself than in others.",
        },
      ]
    ),
    paragraph("Self-leadership is not a mood. It is not a season. It is not something you do when you feel inspired."),
    paragraph("Self-leadership is a discipline built on four measurable pillars."),
    paragraph("Every leader I have ever coached has some strength in one or two of these pillars — and some weakness in one or two. That is normal. The goal is not perfection in all four. The goal is honest awareness of where you stand, and daily practice to strengthen the ones that are weakest."),
    paragraph("Let me walk you through each pillar. Rate yourself honestly on each one as we go. You will need those numbers in the assignment at the end of the module."),
    heading(3, "Pillar 1 — Self-Awareness"),
    paragraph("The ability to recognize your emotions, strengths, weaknesses, patterns, and triggers as they happen."),
    paragraph("Self-awareness is the foundation of every other pillar. You cannot manage what you cannot see. You cannot fix what you refuse to acknowledge. And you cannot change what you do not know about yourself."),
    heading(4, "Signs of high self-awareness:"),
    paragraph("• You can name what you are feeling accurately, in real time"),
    paragraph("• You know your default reactions under pressure — and you have named them"),
    paragraph("• You have received hard feedback in the last 12 months, and you took it seriously"),
    paragraph("• You have a clear sense of what triggers you emotionally, and why"),
    paragraph("• Others describe you the way you describe yourself"),
    heading(4, "Signs of low self-awareness:"),
    paragraph("• You are often surprised by your own reactions"),
    paragraph("• Others describe you very differently than you describe yourself"),
    paragraph("• You cannot name your emotions — you just feel \"off\" or \"fine\""),
    paragraph("• You have blind spots that others see clearly but you cannot"),
    paragraph("• You avoid feedback, or you dismiss it when you receive it"),
    callout("info", "The African leader's blind spot on self-awareness: In many African cultures — and in many ministry cultures — leaders are expected to project strength and certainty at all times. Admitting a weakness feels like losing authority. So we hide what we do not know, defend what we cannot justify, and lose the very self-awareness that would make us stronger. The strongest African leaders I know are the ones who have unlearned this. They can say \"I don't know\" in a boardroom. They can say \"I was wrong\" from a pulpit. That is not weakness. That is high self-awareness — and it is deeply attractive to the people they lead."),
    heading(3, "Pillar 2 — Self-Discipline"),
    paragraph("The ability to follow through on your commitments when the initial motivation is gone."),
    paragraph("Motivation gets you started. Discipline is what keeps you going."),
    paragraph("Here is a hard truth: nobody who has built anything lasting did it on motivation. They built it on discipline. Motivation is an emotion — it comes and goes. Discipline is a habit — it holds when the emotion is gone."),
    paragraph("Every leader knows this at some level. But most leaders drift back into motivation-based living because it feels easier. Until the motivation runs out. And then they stall, blame the season, and wait for inspiration to return."),
    heading(4, "A leader with self-discipline has the following practices:"),
    paragraph("• A morning routine they keep even on hard days"),
    paragraph("• Written goals they review regularly"),
    paragraph("• Habits of preparation before high-stakes moments (meetings, sermons, difficult conversations)"),
    paragraph("• Clear boundaries around what they will and will not do"),
    paragraph("• The ability to say no to good things, in order to say yes to great ones"),
    heading(4, "A leader without self-discipline shows the following patterns:"),
    paragraph("• Constantly starting projects and abandoning them"),
    paragraph("• Reactive schedule — always responding to whoever shouts loudest"),
    paragraph("• Skipping the fundamentals when tired"),
    paragraph("• Making promises they cannot keep"),
    paragraph("• Blaming circumstances for what is actually a discipline problem"),
    paragraph("James Clear, in Atomic Habits, captures this in one of the most important sentences ever written about leadership:"),
    quote("You do not rise to the level of your goals. You fall to the level of your systems.", "James Clear"),
    paragraph("Read that again. Your goals do not determine your results. Your systems do. Your daily systems. Your habits. Your routines. Your defaults."),
    paragraph("Self-discipline is the act of designing systems that keep you doing the right thing even when you don't feel like it. It is what turns a leader who talks about growth into a leader who actually grows."),
    heading(3, "Pillar 3 — Emotional Regulation"),
    paragraph("The ability to manage your emotions under pressure, rather than being managed by them."),
    paragraph("This is the pillar most leaders talk about the least — and struggle with the most."),
    paragraph("Emotional regulation is not the same as suppressing emotion. Suppression is dangerous. It just delays the eruption. Regulation is different — it is the disciplined processing of emotion in real time, so that your response comes from your values, not your reaction."),
    paragraph("Between what happens to you and how you respond, there is a space. In that space is your power as a leader. Emotional regulation is the discipline of using that space."),
    paragraph("I teach my leaders a simple principle: PAUSE."),
    paragraph("• P — Perceive what you are feeling (name it)"),
    paragraph("• A — Accept that it is what it is (don't fight it)"),
    paragraph("• U — Understand what triggered it (why now?)"),
    paragraph("• S — Select your response (what does wisdom require?)"),
    paragraph("• E — Execute with intention (act, don't react)"),
    paragraph("Between stimulus and response, PAUSE. It takes practice. But it can be learned."),
    heading(4, "Signs of high emotional regulation:"),
    paragraph("• You do not send angry emails in the moment"),
    paragraph("• You do not make major decisions when tired, hungry, or upset"),
    paragraph("• You have a way to process intense emotions before they leak into leadership"),
    paragraph("• People trust you to be steady in a crisis"),
    paragraph("• You do not carry yesterday's frustration into today's meeting"),
    heading(4, "Signs of low emotional regulation:"),
    paragraph("• You explode at people, then apologize afterward"),
    paragraph("• You make decisions from a place of frustration or fear"),
    paragraph("• Your team walks on eggshells around your moods"),
    paragraph("• You cannot recover quickly from setbacks"),
    paragraph("• Your family sees a different (harder) version of you than your congregation does"),
    paragraph("The biblical foundation for emotional regulation is Proverbs 16:32:"),
    quote("Better a patient person than a warrior, one with self-control than one who takes a city.", "Proverbs 16:32"),
    paragraph("Better to master yourself than to conquer nations. Because a leader who conquers nations but cannot master themselves will eventually destroy what they built."),
    heading(3, "Pillar 4 — Personal Accountability"),
    paragraph("The ability to own your results, decisions, and failures — without blaming circumstances or others."),
    paragraph("This is the pillar that separates mature leaders from immature ones. It is not about age or experience. I have met 25-year-olds with more personal accountability than 60-year-old pastors. The difference is a decision — the decision to own your life."),
    heading(4, "Accountable leaders take responsibility for:"),
    paragraph("• Their decisions — good and bad"),
    paragraph("• Their team's results — including the failures"),
    paragraph("• Their own growth — no one else is responsible for it"),
    paragraph("• Their emotional state — they do not blame others for how they feel"),
    paragraph("• Their commitments — they keep them, or they explicitly renegotiate them"),
    heading(4, "Unaccountable leaders sound like this:"),
    paragraph("• \"It's not my fault — the market changed.\""),
    paragraph("• \"I would have succeeded if my team had been better.\""),
    paragraph("• \"The reason I lost my temper is because you provoked me.\""),
    paragraph("• \"I couldn't get to it because I've been so busy.\""),
    paragraph("• \"That failure wasn't really mine to own.\""),
    paragraph("Every one of those sentences is a form of victimhood theater. And here is the hard truth: victims do not lead. They cannot. The moment you become a victim of your circumstances, your influence collapses. Because leadership requires the belief that your choices matter — and victims have already declared that they don't."),
    heading(4, "The Five Key Mindset Shifts of a Self-Led Leader"),
    table(
      ["Area", "The Victim Mindset", "The Leader Mindset"],
      [
        ["Obstacles", "\"It's too hard.\"", "\"What can I learn from this?\""],
        ["Direction", "\"I'll wait to be told.\"", "\"How can I take the lead?\""],
        ["Risk", "\"What if I fail?\"", "\"What if this works?\""],
        ["Perspective", "Short-term gain", "Long-term impact"],
        ["Responsibility", "\"It's their fault.\"", "\"I take responsibility.\""],
      ]
    ),
    paragraph("Read the two columns again. Slowly."),
    paragraph("The left column is where most people live. Comfortable. Predictable. Small. It never risks, and so it never grows."),
    paragraph("The right column is where leaders live. Uncomfortable. Uncertain. Expansive. Every day, dozens of times a day, they choose the right column over the left. That is what personal accountability actually looks like — moment by moment, choice by choice."),
    heading(3, "Your Pillar Scorecard"),
    paragraph("Rate yourself honestly on each pillar. These numbers feed into your assignment at the end of the module — and the AI Coach will reference them in future conversations."),
    scorecard(
      "The Four Pillars of Self-Leadership",
      "four_pillars_self_leadership",
      [
        { key: "self_awareness", label: "Self-Awareness", max: 10 },
        { key: "self_discipline", label: "Self-Discipline", max: 10 },
        { key: "emotional_regulation", label: "Emotional Regulation", max: 10 },
        { key: "personal_accountability", label: "Personal Accountability", max: 10 },
      ]
    ),
    callout("info", "You cannot fix all four at once. But you can fix one. And when you fix the weakest one, the other three get stronger too. That is how self-leadership actually builds — not by trying to be perfect at everything, but by relentlessly improving the one pillar that is currently your weakest."),
    reflectionQuestions(
      "Before You Move On — Sit With These Questions",
      [
        "Which of the four pillars is your greatest strength? Give a concrete example of it from the last 30 days.",
        "Which pillar is your weakest? Give a concrete example of how it has cost you in the last 30 days.",
        "Look at the Five Mindset Shifts table. In which of those five areas do you most often live in the left column? Be honest.",
        "What is one practice you could install tomorrow to begin strengthening your weakest pillar? Not a resolution. A specific, small, daily practice.",
        "Who in your life has permission to tell you the truth about how you are doing on these four pillars? If the answer is \"nobody\" — that itself is a problem to address.",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 4 — Emotional Intelligence: The Inner Edge ────────────────────
const section4 = {
  section_number: 4,
  title: "Emotional Intelligence: The Inner Edge",
  blocks: [
    heading(2, "Section 4 — Emotional Intelligence: The Inner Edge"),
    image("/images/module-1/still-lake-sunrise.png", "A person sits alone at the end of a wooden jetty, arms around their knees, looking out over a completely still mountain lake at sunrise. Mist lies on the surface and the peaks and sky are mirrored in the water. No text appears in the image."),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary placeholder video, real per-section recordings to follow"),
    paragraph("There is a research finding that should change how you think about leadership."),
    paragraph("Daniel Goleman, the psychologist who introduced the world to Emotional Intelligence, studied thousands of leaders across dozens of industries. His finding took years for the leadership world to accept:"),
    quote("Emotional Intelligence accounts for roughly 67% of the abilities that separate great leaders from average ones. Technical skill and IQ account for the remaining 33%."),
    paragraph("Two-thirds of what makes a leader great has nothing to do with how smart they are, how much they know, or how skilled they are. Two-thirds of it is emotional."),
    pullQuote("IQ gets you hired. EQ gets you promoted — and keeps you there."),
    paragraph("I have watched this play out in real life more times than I can count. Brilliant pastors who could exegete Greek but could not have a difficult conversation with their board. Genius entrepreneurs who could build a product but could not stop themselves from destroying their team. Gifted preachers whose messages moved thousands — while their families walked on eggshells at home."),
    paragraph("They were not stopped by lack of talent. They were stopped by lack of emotional intelligence."),
    heading(3, "What Emotional Intelligence Actually Is"),
    paragraph("Emotional Intelligence is the ability to recognize, understand, manage, and effectively use your own emotions and the emotions of others."),
    paragraph("EQ is not being nice. It is not being soft. It is not suppressing what you feel. It is not agreeing with everyone to keep the peace."),
    paragraph("EQ is being smart with emotion. Yours and others'. In real time. Under pressure."),
    paragraph("Goleman identified five core domains of emotional intelligence. Every leader must develop all five. Weakness in any one will surface in your leadership — usually at the worst possible moment."),
    callout("tip", "This module has named the five domains. Module 3 — Emotional Intelligence: The Leader's Inner Edge — is where you'll actually work through them: real case studies (a CEO's public collapse over one careless sentence, an entrepreneur's burnout and recovery, Marcus Aurelius wrestling with his own temper eighteen centuries before Goleman), a domain-by-domain self-audit once each one has actually been explained, and where the research and Scripture converge on this exact point. If EQ turns out to be your growth edge, that's where you'll do something about it."),
    divider(),
  ]
};

// ─── SECTION 5 — Facing Your Weaknesses Without Being Destroyed by Them ────
const section5 = {
  section_number: 5,
  title: "Facing Your Weaknesses Without Being Destroyed by Them",
  blocks: [
    heading(2, "Section 5 — Facing Your Weaknesses Without Being Destroyed by Them"),
    image("/images/module-1/jacob-wrestling-angel.png", "A bronze sculpture on a clifftop at sunrise: a bearded man braced on one knee, gripping the hand of a winged figure who leans into him. Neither has given ground. A valley and river lie below. No text appears in the image."),
    videoEmbed("iCvmsMzlF7o", "The Power of Vulnerability | Brené Brown | TED"),
    quiz(
      "video_check",
      "Quick Check: The Power of Vulnerability",
      [
        {
          id: "q1",
          prompt: "What does Brown identify as the common trait among people with a strong sense of love and belonging?",
          options: [
            { id: "a", text: "They avoid vulnerability entirely" },
            { id: "b", text: "They fully believe they are worthy of love and belonging, and are willing to let themselves be seen" },
            { id: "c", text: "They have fewer difficult emotions than others" },
            { id: "d", text: "They rely primarily on achievement to feel secure" },
          ],
          correct_option_id: "b",
          explanation: "Brown's research found \"whole-hearted\" people share the courage to be imperfect and the willingness to be vulnerable — not the absence of struggle.",
        },
        {
          id: "q2",
          prompt: "What does Brown say happens when we try to numb vulnerability?",
          options: [
            { id: "a", text: "We become more resilient" },
            { id: "b", text: "We can't selectively numb emotion — numbing vulnerability also numbs joy, gratitude, and happiness" },
            { id: "c", text: "Numbing only affects negative emotions" },
            { id: "d", text: "It has no measurable effect on other emotions" },
          ],
          correct_option_id: "b",
          explanation: "One of the talk's central, counterintuitive points — you cannot selectively numb; shutting down the uncomfortable feelings shuts down the good ones too.",
        },
      ]
    ),
    paragraph("This is the hardest section of this module. The one most leaders will want to skim."),
    callout("warning", "Please do not skim it. What you refuse to face here will surface later — in your leadership, in your marriage, in your health, in your ministry. The only question is when. And how much damage it does when it does."),
    paragraph("Every leader has weaknesses. That is not the problem. The problem is what leaders do with their weaknesses. Most leaders hide them. Some deny them. A few — the ones who finish well — face them honestly and build a life around managing them."),
    paragraph("I want you to be in that third group."),
    heading(3, "The Lie That Weakness Must Be Hidden"),
    paragraph("Somewhere in your leadership formation, someone taught you a lie. The lie is this: strong leaders do not have weaknesses. Or if they do, they hide them until they can fix them. Because if people see your weakness, they will lose respect for you and stop following you."),
    paragraph("This lie is not new. It is not African. It is not Western. It is universal. And it is wrong."),
    paragraph("Here is what actually happens when leaders hide their weaknesses:"),
    paragraph("First, the weakness grows in the dark. Because what you hide, you cannot bring into the light of accountability. And what cannot be brought into the light cannot be healed."),
    paragraph("Second, the weakness becomes weaponized against you. Because the enemy of your soul knows exactly what you are hiding — and eventually, someone else will too. Blackmail. Exposure. Sudden collapse. Every public leader who has fallen in a scandal spent years hiding what was true about them. The hiding was the setup for the fall."),
    paragraph("Third, the leader loses the very authority they were trying to protect. Because leaders who cannot admit weakness cannot be trusted. Their people sense the performance. The team walks on eggshells. The family lives with a stranger. And eventually, the platform collapses under the weight of what the leader would not name."),
    pullQuote("The leader who names their weakness in the presence of God and a trusted few is not weakened by it — they are protected by it."),
    paragraph("That is the paradox. And it is one of the deepest truths in Scripture."),
    heading(3, "What Scripture Shows Us: Broken Leaders God Used"),
    paragraph("Every great biblical leader had a fatal weakness. Not one was hidden. God recorded them all."),
    paragraph("Moses — the greatest deliverer in the Old Testament — had a rage problem. He killed a man in his 40s. He struck a rock in anger in his 80s. That anger cost him the Promised Land. God still used him."),
    paragraph("Abraham — the father of faith — lied about his wife twice to save his own skin. He passed off Sarah as his sister to two different kings, endangering the covenant line. God still used him."),
    paragraph("David — a man after God's own heart — committed adultery, arranged a murder to cover it up, and then failed to discipline his own sons. His weakness with women and with his family destroyed his kingdom in his lifetime. God still used him."),
    paragraph("Peter — the rock on which the church would be built — denied Jesus three times on the worst night of his life. Cursed. Swore he never knew the man he had followed for three years. Jesus still used him."),
    paragraph("Paul — the greatest missionary in Christian history — wrote about a \"thorn in the flesh\" he begged God three times to remove. God refused. Paul had to lead with the weakness, not without it."),
    paragraph("Every one of them was used mightily by God — with their weakness, not without it."),
    paragraph("The Bible does not hide these stories. It puts them in the sacred text. Why?"),
    paragraph("Because the greatest lie a leader can believe is that God can only use the version of them without weakness. That is not true. God has always used broken people. He is still doing it. He is doing it in you."),
    callout("info", "But there is a condition. God uses broken leaders who name their brokenness — not those who hide it."),
    heading(3, "The Story of Jacob"),
    paragraph("If there is one story in Scripture that captures how God deals with a leader's weakness, it is Jacob at Peniel (Genesis 32)."),
    paragraph("Jacob was a deceiver. His name literally meant \"one who takes by the heel\" — a swindler. He stole his brother Esau's birthright with soup, then stole his father's blessing with a lie. He fled from home and spent twenty years running from what he had done."),
    paragraph("On his way back to face Esau, Jacob was terrified. He sent gifts ahead. He divided his family into groups so if one group was attacked the other might survive. And that night, alone by the Jabbok river, a Man wrestled with him until daybreak."),
    paragraph("They wrestled all night. Jacob would not let go, even as his hip was dislocated. And finally, the Man asked him a strange question:"),
    quote("What is your name?", "Genesis 32:27"),
    paragraph("The last time Jacob had been asked that question, he had lied — pretending to be Esau to steal his father's blessing. Now, this Man — who Jacob had begun to realize was God Himself — was asking him again."),
    paragraph("\"My name is Jacob.\""),
    paragraph("Deceiver. Swindler. Trickster."),
    paragraph("Only after Jacob named his own weakness — owned who he had actually been — did God rename him Israel: \"one who wrestles with God and prevails.\""),
    paragraph("But Jacob walked away with a limp for the rest of his life."),
    pullQuote("God cannot rename what you refuse to name. And when God does rename you, you may still walk with the limp — the ongoing evidence of the wrestling, so you remember whose strength is actually holding you up."),
    paragraph("Your weakness, faced honestly in God's presence, becomes the very thing that shapes you into who you were meant to be."),
    heading(3, "The Four-Step Process for Facing Your Weakness"),
    paragraph("Here is a framework I have used with hundreds of leaders. It is simple. It is not easy."),
    heading(4, "Step 1 — ADMIT."),
    paragraph("Name the weakness. Not vaguely. Specifically. Not \"I struggle with anger sometimes\" — but \"When my wife questions my decisions in front of my children, I feel humiliated, and I respond with cutting words that I regret later.\""),
    paragraph("Vague confessions produce vague results. Specific admission produces specific transformation."),
    heading(4, "Step 2 — SURRENDER."),
    paragraph("Bring it to God. Not once. Daily. Because the weakness will resurface, and each time it does is another opportunity to surrender it again. Surrender is not a one-time event. It is a daily posture."),
    heading(4, "Step 3 — PRAY."),
    paragraph("Not just for forgiveness. For strength. For the mind of Christ in that specific area. For the fruit of the Spirit — self-control, patience, gentleness — to be produced in you supernaturally, because you cannot produce it in yourself."),
    heading(4, "Step 4 — DISCIPLINE."),
    paragraph("Build the specific practice that addresses your specific weakness. If your weakness is anger, install the daily practice of PAUSE (from Section 3). If your weakness is money, install a strict budget with accountability. If your weakness is lust, install strong internet filters and never travel alone. Discipline is where surrender becomes lived."),
    pullQuote("Admit → Surrender → Pray → Discipline. Every day. For the rest of your life."),
    paragraph("Because your weakness is not a season to survive — it is a reality to manage forever."),
    callout("tip", "This module has named the real enemies — pride, sexual immorality, anger, theft, envy, covetousness, deceit, and bitter speech — and the three things that destroy more leaders than anything else: money, sexual sin, and pride. Module 2 — Character in the Dark — is where you'll actually work through all three in depth: the specific warning signs for each, six practical guardrails to install now, a real story of a leader who didn't, and the private questions that matter more than anyone watching you read them."),
    reflectionQuestions(
      "Before You Move On — Sit With These Questions",
      [
        "What is the one weakness in you that, left unaddressed, is most likely to take you down as a leader? You know what it is. Name it here — even if just to yourself.",
        "Who knows about it? If the answer is \"nobody,\" that is the beginning of the danger. Weakness in the dark grows. Weakness in the light heals.",
        "Is there a confession that needs to happen before you move on in this module? Not to me. To God. And possibly to a trusted spiritual authority in your life. Some things cannot heal in the dark.",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 6 — Your Daily Rhythm of Self-Leadership ──────────────────────
const section6 = {
  section_number: 6,
  title: "Your Daily Rhythm of Self-Leadership",
  blocks: [
    heading(2, "Section 6 — Your Daily Rhythm of Self-Leadership"),
    image("/images/module-1/morning-routine.png", "A wooden desk by a window at sunrise. An open Bible lies at Psalm 1 beside a spiral notebook headed \"Today...\" listing be grateful, seek God's wisdom, take purposeful action and make a positive impact, with notes reading \"A new day, a fresh perspective, a greater purpose\". A mug reads PRAY READ REFLECT GROW; a framed card reads \"A disciplined morning builds a greater tomorrow\"; a wooden block reads FAITH FOCUS DISCIPLINE IMPACT; stacked books read HOLY BIBLE, GRATITUDE JOURNAL and A BETTER LEADER."),
    videoEmbed("nKpQOc-9urs", "Success is Inevitable When You Spend Your Day Doing These 5 Things Everyday! | John Maxwell"),
    quiz(
      "video_check",
      "Quick Check: Building a Growth Routine",
      [
        {
          id: "q1",
          prompt: "A central theme in Maxwell's teaching on daily growth is that transformation comes from:",
          options: [
            { id: "a", text: "One dramatic decision made once" },
            { id: "b", text: "Small, consistent daily disciplines compounded over time" },
            { id: "c", text: "Waiting for motivation to strike" },
            { id: "d", text: "Copying another leader's exact schedule" },
          ],
          correct_option_id: "b",
          explanation: "Maxwell's well-known framing is that leadership growth isn't a single event — it's compounded through small, repeated daily practices.",
        },
        {
          id: "q2",
          prompt: "According to this approach to morning routines, what is the primary purpose of starting the day intentionally?",
          options: [
            { id: "a", text: "To maximize productivity metrics alone" },
            { id: "b", text: "To take ownership of your mindset and priorities before external demands take over" },
            { id: "c", text: "To avoid ever changing your schedule" },
            { id: "d", text: "To impress others with discipline" },
          ],
          correct_option_id: "b",
          explanation: "The core idea is agency — claiming the first part of the day intentionally rather than letting it be dictated by whoever reaches you first.",
        },
      ]
    ),
    pullQuote("Insight without practice is entertainment."),
    paragraph("You have now read five sections of teaching on self-leadership. You have engaged with the identity question, the four pillars, emotional intelligence, and the honest facing of your weaknesses. If you stop here — if you close this module and never build a daily practice around what you have learned — everything so far will fade in about ninety days. That is how the brain works. Insight without practice does not become transformation. It just becomes another thing you once read."),
    pullQuote("Self-leadership is not built in retreats. It is built in mornings."),
    paragraph("Not the mornings when you feel inspired. The mornings when you don't. Because motivation gets you started — and discipline is what keeps you going."),
    paragraph("Let me remind you of the most important sentence in this module. Return to it as often as you need to:"),
    quote("You do not rise to the level of your goals. You fall to the level of your systems.", "James Clear"),
    paragraph("Your goals do not determine your leadership. Your systems do. Your daily systems. Your habits. Your routines. Your defaults. The invisible architecture of your day is what will shape you into who you become."),
    paragraph("This section is about designing that architecture."),
    heading(3, "The Three Rhythms of a Self-Led Leader"),
    paragraph("There is a pattern I have observed in every leader who lasts. They live by three rhythms — daily, weekly, and monthly. Not one of them is optional. Together, they form the operating system of a self-led life."),
    heading(4, "Rhythm 1 — The Daily Morning Practice (5-15 minutes)"),
    paragraph("Before the day owns you, own the day."),
    paragraph("The first hour of your morning shapes the next twelve. If you begin your day reactively — checking messages, responding to crises, scrolling news — you have handed your day to someone else. If you begin it intentionally, you set the tone your leadership will carry until you sleep."),
    paragraph("A basic morning practice includes four elements:"),
    paragraph("1. Silence (2-3 minutes) — before you speak, listen. Before you respond, breathe. Before you produce, be still."),
    paragraph("2. Scripture (5-10 minutes) — one passage, read slowly. Not for a sermon. For yourself. Let it read you."),
    paragraph("3. Prayer (3-5 minutes) — surrender the day. Name the challenges ahead. Ask for wisdom. Confess anything unconfessed from yesterday."),
    paragraph("4. Intention (2 minutes) — write down one thing: \"Today, the most important thing I must do is ___.\" Then do it first, before anything else can claim your attention."),
    callout("warning", "You will feel too busy to do this. You are wrong. The busier you are, the more you need it. The days you cannot afford fifteen minutes are the days that most desperately require them."),
    heading(4, "Rhythm 2 — The Weekly Self-Audit (Sundays, 20-30 minutes)"),
    paragraph("Once a week — I recommend Sunday evening — sit alone with a notebook and answer four questions:"),
    paragraph("1. What went well this week? (Celebrate wins — including small ones)"),
    paragraph("2. Where did I fall short? (Own failures without shame)"),
    paragraph("3. What did I learn? (Extract lessons before they become regrets)"),
    paragraph("4. What must change next week? (Design one small adjustment)"),
    paragraph("This is not journaling for its own sake. It is strategic self-review. It is what turns experience into growth. Because experience alone does not make you a better leader. Reflected-upon experience does."),
    paragraph("Leaders who skip weekly self-audit repeat the same mistakes for years without noticing. Leaders who practice it compound wisdom faster than their peers. Same time. Same challenges. Different trajectory."),
    heading(4, "Rhythm 3 — The Monthly Review with a Trusted Person (60-90 minutes)"),
    paragraph("Once a month, meet with one person who has permission to tell you the truth."),
    paragraph("Not a friend who tells you what you want to hear. Not a subordinate who cannot afford to disagree with you. Not a spouse who is too close to the situation to see it clearly."),
    pullQuote("A mentor. A peer. A coach. A wise older leader. Someone who loves you enough to hurt you when it matters."),
    paragraph("In that meeting, share: your weekly self-audits from the past month; the current state of your four pillars; what you're seeing in yourself — good and bad; where you feel stuck; what you fear; what you need prayer for."),
    paragraph("Then let them speak. Really listen. Don't defend. Don't explain. Receive."),
    pullQuote("Every leader who finishes well has this person in their life. Every leader who falls did not."),
    paragraph("If you do not have this person, finding them is your most urgent leadership task. Not \"when you have time.\" Now."),
    heading(3, "The Eight Areas of Character Development"),
    paragraph("Self-leadership is not just about your morning routine. It is about the health of your whole life. Character develops in eight distinct areas:"),
    paragraph("1. Spiritual Life — Your relationship with God. Prayer, Scripture, worship, silence."),
    paragraph("2. Personal Life — Your relationship with yourself. Rest, growth, health, joy."),
    paragraph("3. Home Life — Your family relationships. Spouse, children, extended family."),
    paragraph("4. Social Life — Your friendships and community. Not networking — real friendship."),
    paragraph("5. Educational Life — Your ongoing learning. Reading, courses, mentorship."),
    paragraph("6. Ministerial Life — Your service and calling. Where you contribute."),
    paragraph("7. Marital Life — The quality of your marriage (if married). Not just fidelity — flourishing."),
    paragraph("8. Financial Life — Your stewardship of resources. Budget, generosity, contentment."),
    paragraph("A self-led leader is honest about all eight areas. Not perfect in all eight — nobody is. But honest."),
    scorecard(
      "The Eight Areas of Character Development",
      "eight_areas_character",
      [
        { key: "spiritual_life", label: "Spiritual Life", max: 10 },
        { key: "personal_life", label: "Personal Life", max: 10 },
        { key: "home_life", label: "Home Life", max: 10 },
        { key: "social_life", label: "Social Life", max: 10 },
        { key: "educational_life", label: "Educational Life", max: 10 },
        { key: "ministerial_life", label: "Ministerial Life", max: 10 },
        { key: "marital_life", label: "Marital Life", max: 10 },
        { key: "financial_life", label: "Financial Life", max: 10 },
      ]
    ),
    callout("info", "Most leaders find they are strong in the areas that get public attention (ministerial, spiritual) and weak in the areas nobody sees (marital, financial, personal). That is precisely the pattern that eventually breaks leaders — because nobody sees the collapse coming until it happens. Fix the weakest area first. Not the most visible one. The weakest one."),
    heading(3, "Vision, Self-Assessment, and Goal-Setting: The Practical Foundation"),
    paragraph("Before this module ends, do this exercise. Do not skim it. Do not save it for later. Do it now, with a notebook and a pen. This is the practical foundation of everything you have just learned."),
    heading(4, "Part 1 — The Vision Exercise"),
    paragraph("Write a one-paragraph personal leadership vision. It should answer three questions:"),
    paragraph("• WHY do I lead? (What is the deep motivation?)"),
    paragraph("• WHAT do I want my leadership to produce in the world? (What is the fruit?)"),
    paragraph("• HOW will I lead? (What are the non-negotiable values?)"),
    paragraph("This is not a mission statement for your organization. It is a mission statement for you as a leader. Write it in the first person. Write it with conviction. Read it aloud when you finish."),
    paragraph("You will return to this paragraph in Module 12. Notice how it changes."),
    heading(4, "Part 2 — The Self-Assessment"),
    paragraph("Write honest answers:"),
    paragraph("• My three greatest leadership strengths are: ___, ___, ___"),
    paragraph("• My three greatest leadership weaknesses are: ___, ___, ___"),
    paragraph("• My most recent leadership success was: ___. What made it work?"),
    paragraph("• My most recent leadership failure was: ___. What did it teach me?"),
    paragraph("• What is one blind spot someone I trust has named in me — that I have not fully accepted?"),
    paragraph("Do not sanitize these. Nobody is grading you. The point is truth."),
    heading(4, "Part 3 — Goal-Setting (SMART Framework)"),
    paragraph("Using the SMART framework — Specific, Measurable, Achievable, Relevant, Time-bound — write:"),
    paragraph("Three short-term leadership goals (next 6 months): 1) ___ 2) ___ 3) ___"),
    paragraph("Two long-term leadership goals (next 2 years): 1) ___ 2) ___"),
    paragraph("For each goal, write the first action step you will take this week. Not this month. This week. Because a goal without an immediate first step is just a wish."),
    heading(3, "The Three Non-Negotiables"),
    paragraph("If you take nothing else from this module, take these three. Install them in your life this week. Do not wait."),
    paragraph("1. Install a daily morning practice. Fifteen minutes. Silence, Scripture, prayer, intention. Every day. Even on hard days. Especially on hard days."),
    paragraph("2. Find your one trusted person. The one who has permission to tell you the truth. Schedule your first monthly meeting within the next 30 days."),
    paragraph("3. Write your Self-Leadership Manifesto (see the Assignment below). Then return to it every 90 days for the rest of your life."),
    paragraph("Everything else in this module is teaching. These three are practices. Teaching without practice is entertainment. Practice is what makes a leader."),
    reflectionQuestions(
      "Before You Move On — Sit With These Questions",
      [
        "What is your current morning practice — if any? How does it compare to what you have just read?",
        "Do you have a weekly self-audit rhythm? If not, when will you start?",
        "Who is your monthly review person? If you cannot name them, that is your first task before finishing this module.",
        "Looking at the 8 Areas of Character — which is your weakest? What is one specific action you will take this month to address it?",
        "Read back your leadership vision paragraph aloud. Does it feel true? Does it feel bold enough? Does it match the leader you are becoming?",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 7 — Assignment — Write Your Self-Leadership Manifesto ─────────
const section7 = {
  section_number: 7,
  title: "Assignment — Write Your Self-Leadership Manifesto",
  blocks: [
    heading(2, "Assignment — Write Your Self-Leadership Manifesto"),
    image("/images/module-1/leather-journal.png", "An open leather-bound journal in warm evening light with a fountain pen resting across it. The left page is headed \"Today...\" and lists be present, seek wisdom, take intentional action, encourage someone and trust the process; the right page reads \"Leadership is a journey of becoming a better you to bring out a better them.\" A mug reads GOOD IDEAS BUILD GREAT TOMORROWS and a framed card reads REFLECT PLAN GROW LEAD REPEAT."),
    paragraph("Everything you have just read has been leading here."),
    paragraph("This assignment is not busywork. It is the crystallization of Module 1. You are going to distill everything — your identity, your pillars, your weaknesses, your daily practice — into a single written document. Your Self-Leadership Manifesto."),
    paragraph("You will return to this document every 90 days for the rest of your leadership life. You will read it aloud when you feel lost. You will revise it as you grow. And on days when the pressure is high and the temptation is strong and you do not know who you are anymore, this manifesto will remind you."),
    pullQuote("Write it now. In one sitting. Do not overthink it."),
    quiz(
      "module_review",
      "Module Review: The Leader Within",
      [
        {
          id: "q1",
          prompt: "What are the four pillars of self-leadership named in this module?",
          options: [
            { id: "a", text: "Vision, Strategy, Execution, Legacy" },
            { id: "b", text: "Self-Awareness, Self-Discipline, Emotional Regulation, Personal Accountability" },
            { id: "c", text: "Faith, Hope, Love, Wisdom" },
            { id: "d", text: "Planning, Delegation, Communication, Review" },
          ],
          correct_option_id: "b",
          explanation: "These are the module's core structure, each with its own scorecard.",
        },
        {
          id: "q2",
          prompt: "What does the module say about the relationship between goals and systems?",
          options: [
            { id: "a", text: "Goals alone determine your leadership trajectory" },
            { id: "b", text: "You do not rise to the level of your goals — you fall to the level of your systems" },
            { id: "c", text: "Systems are less important than motivation" },
            { id: "d", text: "Goals and systems are unrelated" },
          ],
          correct_option_id: "b",
          explanation: "A direct quote from the module, anchoring Section 6's argument for daily rhythms over willpower.",
        },
        {
          id: "q3",
          prompt: "According to the module's identity teaching, what are the two \"wrong foundations\" for a leader's sense of self?",
          options: [
            { id: "a", text: "Faith and community" },
            { id: "b", text: "Performance and approval" },
            { id: "c", text: "Education and experience" },
            { id: "d", text: "Talent and charisma" },
          ],
          correct_option_id: "b",
          explanation: "The module argues both foundations collapse under pressure, unlike identity grounded in who a leader is \"in Christ.\"",
        },
        {
          id: "q4",
          prompt: "In the Four-Step Process for facing weakness, what comes after Admit and Surrender?",
          options: [
            { id: "a", text: "Ignore, then Move on" },
            { id: "b", text: "Pray, then Discipline" },
            { id: "c", text: "Confess publicly, then Resign" },
            { id: "d", text: "Wait, then Reassess" },
          ],
          correct_option_id: "b",
          explanation: "Matches the module's own four-step structure exactly.",
        },
        {
          id: "q5",
          prompt: "What three rhythms does the module recommend every self-led leader build?",
          options: [
            { id: "a", text: "Daily, Weekly, Monthly" },
            { id: "b", text: "Hourly, Daily, Yearly" },
            { id: "c", text: "Weekly, Quarterly, Annual" },
            { id: "d", text: "Only a daily practice is needed" },
          ],
          correct_option_id: "a",
          explanation: "Section 6's core structure — a daily morning practice, a weekly self-audit, and a monthly review with a trusted person.",
        },
        {
          id: "q6",
          prompt: "What does the module say happens to leaders who skip the weekly self-audit?",
          options: [
            { id: "a", text: "They naturally improve anyway" },
            { id: "b", text: "They repeat the same mistakes for years without noticing" },
            { id: "c", text: "They become more spontaneous leaders" },
            { id: "d", text: "There is no meaningful difference" },
          ],
          correct_option_id: "b",
          explanation: "Matches the module's direct claim in Section 6.",
        },
      ]
    ),
    assignmentPrompt({
      title: "Write Your Self-Leadership Manifesto",
      instructions: "Your manifesto must answer four questions in your own words, in your own voice, in whatever order feels right. Write in first person (\"I am a leader who...\"). Be personal, not performative. Be honest, not aspirational. This is between you and God — and your future self.",
      prompts: [
        {
          number: 1,
          heading: "IDENTITY — Who am I as a leader?",
          guidance: "Draw from Section 2. Not what you do. Not your title. Not your role. Who are you, when everything external is stripped away? Ground this in the identity you claimed in Christ — or the deepest values you lead from.",
          example: "I am a leader who was called before I was qualified. My identity is not built on what I achieve or who approves of me — it is grounded in whose I am...",
        },
        {
          number: 2,
          heading: "STRENGTHS — What are my three greatest leadership strengths?",
          guidance: "Draw from Sections 3 and 4. These are the pillars and EQ domains where you scored highest. Name them clearly. Own them without false humility. What has God given you that the world needs?",
          example: "My three greatest strengths are self-awareness — I know my patterns and triggers; empathy — I read others accurately and hold space for them; and personal accountability — I own my results and do not blame...",
        },
        {
          number: 3,
          heading: "WEAKNESS + PLAN — What is my most costly weakness, and how am I addressing it?",
          guidance: "Draw from Section 5. This is the hardest prompt. Name the one weakness that, unaddressed, would most likely take you down as a leader. Then name the specific practice you are installing to address it. Not a resolution. A specific practice.",
          example: "My most costly weakness is my emotional regulation under criticism. When I feel attacked, I react defensively and say things I regret. I am installing three practices to address this: the PAUSE principle before responding, weekly review of high-pressure interactions with my accountability partner, and a rule that I do not respond to any critical email for 24 hours...",
        },
        {
          number: 4,
          heading: "DAILY PRACTICE — What rhythm will I install to keep leading myself well?",
          guidance: "Draw from Section 6. What will your morning practice be? Who is your monthly review person? What is your weekly self-audit rhythm? Be specific. Vague commitments produce vague results.",
          example: "I will install these daily and weekly practices: A 15-minute morning practice at 6:00 AM every day — silence, Scripture, prayer, and written intention. A Sunday evening 30-minute weekly self-audit using four questions. A monthly 90-minute review with [name] on the first Saturday of every month...",
        },
      ],
      word_min: 300,
      word_max: 500,
      submit_label: "Submit Manifesto",
    }),
    callout("info", "Optional closing: Some leaders end their manifesto with a declaration — a single sentence they will read aloud on hard days. Something like: \"I am a leader in formation. I lead from character, not performance. I am not who I was, and I am not yet who I will be. And by God's grace, I will not stop until I have finished the work I was made for.\" Write yours if it feels right. This becomes your line."),
    paragraph("When you have written it, submit it above."),
    paragraph("Your manifesto will be stored securely (only you and your assigned coach can read it), appear on your dashboard as a reference point, be referenced by the AI Coach in future conversations, prompt you to revisit and revise it every 90 days, and be surfaced again at the end of Module 12."),
    pullQuote("Take your time. Write it now. Do not close this module without doing it."),
    paragraph("Because the leaders who transform through this program are the ones who take the assignments seriously. And the leaders who do not — the ones who read and move on — will forget most of what they read within a month."),
    paragraph("This is the moment you decide which kind of leader you will be."),
    divider(),
    heading(3, "Module 1 Complete"),
    paragraph("You have just finished the foundational module of the Leadership Track. Everything that follows — Vision, Trust, Communication, Coaching, Servant Leadership, Legacy — builds on the foundation you have laid here."),
    paragraph("Do not rush to Module 2. Sit with what you have written. Let this module cook you."),
    paragraph("When the AI Coach recommends your next module, it will be based on your assessment scores and where you have room to grow. But you can browse the full library and choose your own path."),
    paragraph("Welcome to self-leadership. This is where all real leadership begins."),
    paragraph("— Dr. Denis Ekobena"),
  ]
};

// ─── Assemble ───────────────────────────────────────────────────────────────

const module1 = {
  module_number: 1,
  title: "The Leader Within — Self-Leadership and Personal Mastery",
  subtitle: "Module 1 of the Leadership Track",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 120,
  cover_image_alt: "A person standing before a mirror in soft morning light",
  sections: [section1, section2, section3, section4, section5, section6, section7],
};

const total = module1.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Module 1 — "${module1.title}"`);
module1.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module1_leadership.json", JSON.stringify(module1, null, 2));
console.log("\nWritten to module1_leadership.json");
