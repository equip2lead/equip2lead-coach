// Module 7 — "Communication"
// Original content throughout, plus properly-attributed material from
// Leader Breakthru's freely-licensed "Communicating Vision" resource
// (Terry B. Walling, derived from the teaching of Dr. J. Robert Clinton).

const fs = require('fs');

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const divider = () => ({ type: "divider", data: {} });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });
const reflectionQuestions = (title, questions) => ({ type: "reflection_questions", data: { title, questions } });
const assignmentPrompt = (title, instructions, prompts, word_min, word_max) => ({
  type: "assignment_prompt", data: { title, instructions, prompts, word_min, word_max }
});
const numbered = (text, n) => paragraph(`${n}. ${text}`);
const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const videoPlaceholder = (description) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${description}`);
const image = (spec) => callout("note", `[IMAGE PLACEHOLDER — pending generation] ${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });

// ─── SECTION 1 — Why Communication Determines Everything Else ─────────────

const section1 = {
  section_number: 1,
  title: "Why Communication Determines Everything Else",
  blocks: [
    heading(2, "Communication"),
    paragraph("Module 7 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 7 — why every module before this one only matters if it can actually be communicated."),
    callout("info", "Who this is for: Every leader who completed Modules 1-6. You've built character, named vision, understood the levels, and built trust — this module draws directly on Module 6's trust behaviors and Module 3's empathy work. None of it reaches anyone without this."),
    callout("info", "Core promise: By the end of this module, you'll know the specific skills that separate leaders whose message actually lands from leaders who are simply talking, and you'll have a real vocabulary for diagnosing which one you currently are."),
    callout("info", "Time commitment: Roughly 75-85 minutes of reading and reflection, plus assignment work."),
    divider(),
    heading(2, "Why Communication Determines Everything Else"),
    paragraph("A leader can have real vision, real character, and real trust already built, and still fail — because none of it does anything until it's actually transmitted to another person, in a form they can receive. Vision unspoken is a private feeling. Trust that's never actually expressed in words and action is invisible to the people it's meant to reach."),
    paragraph("This is why communication sits this late in the track rather than first. It isn't the foundation — character and trust are. It's the delivery system. A leader with weak character and strong communication skills is simply persuasive in the wrong direction, faster. A leader with strong character and weak communication skills is trustworthy and invisible. Both are incomplete."),
    callout("tip", "Most communication failures aren't intelligence failures or even effort failures. They're translation failures — the leader genuinely knows what they mean, and genuinely said something, but what arrived on the other end wasn't what was sent."),
    paragraph("The gap has a specific, predictable shape. A leader speaking from inside their own head has months or years of context the listener doesn't have — the reasoning that led to a decision, the alternatives already ruled out, the worry underneath the confidence. None of that travels automatically. Say the conclusion without the context, and a listener fills the gap with their own guess about what's missing, which is rarely the actual answer."),
    paragraph("This is why two people can walk out of the exact same meeting having heard two different things, both convinced they were listening carefully. They were. They just each filled the same gap differently."),
    paragraph("This module is built around a simple corrective: seven principles for what to actually check before speaking, nine channels for making sure a message actually spreads, and one discipline — listening — that most leadership training treats as an afterthought and this module treats as half the subject."),
    table(
      ["What the leader sent", "What often actually arrived"],
      [
        ["\"This needs to happen soon\"", "A specific deadline that was never actually stated"],
        ["\"I have some concerns about this plan\"", "This plan is being rejected"],
        ["\"Let's revisit this next quarter\"", "This isn't a priority, or never was"],
        ["Silence after a proposal", "Either full agreement or total rejection — never simply 'still thinking'"],
      ]
    ),
    paragraph("Every row in that table shares the same fix: say the specific thing rather than the comfortable, ambiguous version of it. Ambiguity feels safer in the moment because it commits to less. It's actually more costly, because someone else fills in the gap you left, and they rarely fill it in with what you actually meant."),
    image({
      type: "flat editorial illustration, muted navy/gold palette",
      content: "Two figures facing each other, a simple speech-bubble shape passing between them, but the shape visibly changes form mid-transit — starting as a clean circle, arriving as a jagged, distorted version of itself",
      width: 1200,
      height: 675
    }),
    paragraph("What follows is organized around that same asymmetry — most of it about sending a message well, a smaller but equally important part about receiving one."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of a recent moment you were sure you'd communicated something clearly, and later discovered you hadn't. What actually happened between what you said and what they heard?",
      ]
    ),
  ]
};

// ─── SECTION 2 — Communication vs. Connection ──────────────────────────────

const section2 = {
  section_number: 2,
  title: "Communication vs. Connection",
  blocks: [
    heading(2, "Communication vs. Connection"),
    paragraph("There's a real difference between saying something accurately and actually reaching the person you said it to, and leaders who only ever practice the first one wonder for years why their words don't seem to move anyone."),
    paragraph("Communication is the transfer of information. Connection is the transfer of something the other person can actually feel is meant for them, specifically, not for an audience in general. A leader can deliver a technically perfect explanation that nobody remembers by Friday, and a leader can say something imperfect and halting that a team quotes back for years — because one of them connected and the other only communicated."),
    callout("warning", "This isn't an argument for style over substance, or charisma over content. A leader who connects without saying anything true is a different problem entirely — manipulation dressed as warmth. The actual goal is both at once: something true, delivered in a way the listener can actually receive it as meant for them."),
    paragraph("Franklin Roosevelt gave his first radio address to the nation eight days after taking office in March 1933, in the middle of a banking collapse severe enough that a quarter of the country was out of work. He could have simply announced the policy response. Instead, he opened by saying he wanted to talk for a few minutes about banking, addressing the country as friends rather than citizens receiving an official briefing. A CBS press release later called it a \"fireside chat,\" and the name stuck because it described exactly what listeners felt they were getting."),
    paragraph("The informality wasn't accidental or effortless. Each address went through roughly a dozen drafts. Roosevelt even had a dental bridge made specifically to eliminate a slight whistle in his speech that was audible over radio — a level of care applied to a medium most leaders of his era treated as a one-way announcement system, not a conversation. Listeners wrote back by the thousands, addressing their letters to him personally, the way you'd write to someone who'd actually spoken to you rather than at you."),
    callout("tip", "Over twelve years, Roosevelt gave roughly thirty of these broadcasts — not weekly, not constantly, but chosen deliberately, at moments that actually mattered. That restraint is itself a communication principle: a leader who connects on every single occasion eventually connects on none of them, because the audience stops being able to tell which moments are genuinely significant."),
    paragraph("Notice what actually made the difference wasn't the medium itself — radio existed before Roosevelt, and plenty of other public figures used it purely as a one-way announcement channel. The difference was a specific decision about who he was actually talking to: not a nation in the abstract, but the specific family sitting in their living room, worried about their own savings and their own jobs. Connection isn't a technique layered onto communication. It's what happens when a leader actually addresses the person instead of the audience."),
    paragraph("A leader speaking to a group of five hundred faces a real choice each time they open their mouth: address the crowd as a category, or address it as five hundred individuals who each happen to be in the same room. The words can be identical. Only one version actually lands as though it was meant for the person hearing it."),
    callout("tip", "One practical marker: connected communication tends to use \"you,\" specifically and often. Merely-communicated messages tend to hide behind \"we,\" \"the organization,\" or \"people\" — technically accurate, and somehow addressed to no one at all."),
    image({
      type: "flat editorial illustration, warm gold and navy palette",
      content: "An old radio set glowing warmly in a dim room, with a single silhouetted family gathered close around it — intimate scale, not a crowd or broadcast tower",
      width: 1200,
      height: 675
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of the best communicator you've personally been led by. What did they actually do differently from someone who was merely clear?",
      ]
    ),
  ]
};

// ─── SECTION 3 — The 7 Principles ───────────────────────────────────────────

const section3 = {
  section_number: 3,
  title: "The 7 Principles of Powerful Communication",
  blocks: [
    heading(2, "The 7 Principles of Powerful Communication"),
    paragraph("Communication, treated as a real leadership skill rather than a personality trait, breaks down into specific practices — each one answering a different question about what's actually being said and why."),
    table(
      ["Principle", "The question it answers"],
      [
        ["Timing", "When should this actually be said — not just when it's convenient to say it"],
        ["Audience Orientation", "What does this specific listener already know, need, and fear — not what would I want to hear"],
        ["Creativity", "Is this being said in a way predictable enough to be ignored"],
        ["Comprehension", "Why does this matter — is the reasoning actually shared, or just the conclusion"],
        ["Transparency", "What is this actually going to cost, and has that cost been named honestly"],
        ["Visualization", "Can the listener actually picture this, or only hear about it"],
        ["Conviction", "Does this land as something the leader has genuinely settled themselves, or as a performance of settledness"],
      ]
    ),
    heading(3, "Visualization in Practice"),
    paragraph("On August 28, 1963, Martin Luther King Jr. addressed a crowd gathered at the Lincoln Memorial with a speech built almost entirely around a single technique: instead of describing an abstract policy goal, he described a specific, physical, sensory future — concrete scenes an audience could actually picture happening, rather than a concept they had to take on faith. Communication scholars still study this speech specifically for that reason. The goal wasn't racial equality as a policy position. It was racial equality as something you could see in your mind, in enough physical detail that it stopped being theoretical."),
    paragraph("That's the actual mechanism behind Visualization as a leadership principle. A listener can agree with a proposal intellectually and still not be moved by it, because agreement lives in a different part of the mind than imagination does. A leader who wants people to actually act, not just nod, has to give them something specific enough to picture — not just something correct enough to accept."),
    paragraph("In practice, this rarely requires anything close to King's skill. It just requires a leader to notice the difference between saying \"we need to improve customer service\" and describing an actual customer, in an actual moment, having an actual experience that's different from the one they're having now. The second version is harder to say and far easier to remember."),
    paragraph("This is also the most underused of the seven principles in ordinary business communication, precisely because abstraction feels safer. A specific picture can be wrong in a way a vague statement never can be. Leaders who avoid specificity are often, without quite admitting it, avoiding the risk of being provably incorrect — at the cost of ever actually being remembered."),
    callout("warning", "Worth naming honestly: this specific principle is the hardest to practice under pressure, precisely because vague language feels safer in the exact moments — high-stakes announcements, defensive conversations — when specificity would matter most."),
    callout("tip", "Notice these seven questions in Module 6's own language: Timing and Transparency are trust behaviors. Audience Orientation is empathy from Module 3. Conviction is character showing through, not separate from it. Communication doesn't introduce new virtues — it's where every virtue this track has already built finally becomes visible to someone else."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these seven, which do you genuinely practice, and which do you skip because it's harder?",
      ]
    ),
    scorecard("Communication Self-Audit", "module7_seven_principles", [
      { key: "timing", label: "Timing — I say things when they need to be said, not just when convenient", max: 10, helpText: "How often do you sit on something important longer than you should?" },
      { key: "audience", label: "Audience Orientation — I speak to what the listener actually needs, not just what I want to say", max: 10, helpText: "Could the last three people you led describe what you actually meant, not just what you said?" },
      { key: "transparency", label: "Transparency — I name the real cost, not just the benefit", max: 10, helpText: "When did you last tell someone something would cost more than they wanted to hear?" },
      { key: "conviction", label: "Conviction — what I say reflects something I've genuinely settled myself", max: 10, helpText: "Is there anything you currently say with confidence that you haven't actually resolved internally?" },
    ]),
  ]
};

// ─── SECTION 4 — Naming the Cost Before You Say It ─────────────────────────

const section4 = {
  section_number: 4,
  title: "Naming the Cost Before You Say It",
  blocks: [
    heading(2, "Naming the Cost Before You Say It"),
    paragraph("Of the seven principles, Transparency is the one most leaders quietly skip — not because they're being dishonest, but because naming the real cost of a decision out loud feels like it will weaken support for the decision. It's usually the opposite."),
    paragraph("A vision or a decision communicated without its cost named honestly produces a specific, delayed failure: people say yes to something they didn't fully understand, discover the actual cost later, on their own, and feel misled — even if nothing false was technically said. The absence of the cost was the misleading part."),
    callout("warning", "This connects directly to Module 6's Consistency behavior. A leader who's honest about cost when it's convenient and quiet about it when it isn't is training people to distrust every announcement equally, because they can no longer tell which version they're getting."),
    paragraph("Winston Churchill became Prime Minister on May 10, 1940, at the worst possible moment to inherit the job — Germany had just invaded the Low Countries, his own party had genuine reservations about him, and Norway and Denmark had already fallen. Three days later, addressing the House of Commons for the first time as leader, he didn't minimize any of it. He told them plainly: \"I have nothing to offer but blood, toil, tears and sweat.\""),
    paragraph("He could have opened with reassurance instead — most new leaders facing a skeptical audience do exactly that. He named the actual cost first, before asking for anything, and the confidence vote that followed passed unanimously. The transparency didn't cost him support. It was the reason he had any."),
    paragraph("There's a real reason this works, not just a historical coincidence. An audience that's already braced for difficulty and hears it named directly relaxes into trust — the leader isn't hiding anything, so whatever comes next can be taken at face value. An audience given only reassurance has to wonder what wasn't said, and that wondering never fully goes away, even after the good news turns out to be true."),
    paragraph("In practice, this means resisting a specific temptation: leading with the good news to soften what follows. Naming the cost first, even briefly, before getting to anything reassuring, is what actually earns the right to be believed when the reassurance comes."),
    callout("tip", "A simple test before delivering any significant message: if you removed every sentence that makes this sound easier than it actually is, what would be left? That's usually the version worth leading with."),
    paragraph("This principle is uncomfortable precisely because it asks a leader to give up a real short-term advantage — softer news lands more easily in the room — for a longer-term one that only shows up later, when the same audience is deciding whether to believe the next thing this leader says."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of the last significant thing you asked your team to do. Did you name what it would actually cost them, or only what it would accomplish?",
      ]
    ),
  ]
};

// ─── SECTION 5 — Nine Ways to Actually Spread a Message ────────────────────

const section5 = {
  section_number: 5,
  title: "Nine Ways to Actually Spread a Message",
  blocks: [
    heading(2, "Nine Ways to Actually Spread a Message"),
    paragraph("Leadership development researcher Terry B. Walling, building on the teaching of Dr. J. Robert Clinton, identified nine specific channels a leader actually needs to move any real message through an organization — not nine equally-weighted options, but nine that work together, because no single channel reaches everyone."),
    paragraph("None of these nine are complicated on their own. What's actually hard is using more than one or two of them consistently, since most leaders default to whichever channel is most comfortable and stop there."),
    numbered("Tell a story. A story survives being repeated in a way a mission statement never does.", 1),
    numbered("Have a short version ready. If you can't say it in the time it takes to cross a room, you haven't finished thinking it through.", 2),
    numbered("Use more than one medium. Different people actually absorb information differently — relying on only one channel means silently excluding everyone the channel doesn't reach.", 3),
    numbered("Have the one-on-one conversation, not just the group announcement. A message heard only in a crowd never quite feels aimed at any one person in it.", 4),
    numbered("Find the people who'll carry it for you. A message repeated only by its original source has a ceiling. A message other people start repeating on their own has none.", 5),
    numbered("Say it outside the room it started in. A vision that only exists internally has already limited what it can become.", 6),
    numbered("Make something memorable. A phrase, an image, something that outlives the meeting it was said in.", 7),
    numbered("Keep pointing at the progress. A vision mentioned once and never referenced again quietly teaches people it wasn't actually important.", 8),
    numbered("Match your own behavior to what you're saying. This is the one that actually determines whether any of the other eight work at all.", 9),
    callout("tip", "That ninth one is worth sitting with alone. A leader who does the first eight well and fails the ninth has built an excellent delivery system for a message nobody actually believes."),
    paragraph("Several of these nine are already visible elsewhere in this module, which is worth noticing rather than treating as coincidence. Roosevelt's fireside chats were channel three in action — using a medium, radio, that reached people no other channel of his era could touch. King's speech was channel seven — a single image memorable enough to outlive the afternoon it was delivered. None of these leaders were following a checklist. They were doing, under real pressure, what this list simply names afterward."),
    paragraph("A leader doesn't need all nine for every message. A minor process update might only need channel two and channel four. A genuine organizational vision probably needs six or seven of them working together, sustained over months, not delivered once and considered finished."),
    callout("tip", "A quick self-check worth running on your last major announcement: how many of these nine channels did it actually use? Most leaders, checking honestly for the first time, find they relied on one or two and assumed that was enough."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these nine, which do you rely on almost exclusively, and which have you never tried?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Listening Is the Other Half ───────────────────────────────

const section6 = {
  section_number: 6,
  title: "Listening Is the Other Half",
  blocks: [
    heading(2, "Listening Is the Other Half"),
    paragraph("Everything so far in this module has been about transmission — getting a message out clearly. Half of communication is the opposite direction, and it's the half most leadership training quietly skips, because talking is the visible half and listening looks like doing nothing."),
    paragraph("Real listening isn't waiting for your turn to speak again. It's the specific discipline of trying to understand what's actually being said, including what's underneath the words, before responding to any of it. A leader who's already forming their reply while the other person is still talking isn't listening. They're just being patient about talking."),
    callout("warning", "This connects back to Module 6's coaching material and forward to whatever this track eventually covers on developing others: a leader who can't listen well can't actually find out what someone else needs, which means every attempt to develop or support them is a guess dressed up as help."),
    paragraph("Nelson Mandela credited his own listening discipline to watching his father lead tribal council meetings as a child. The elders would sit in a circle, and his father would listen to every one of them in turn, without interrupting, asking questions only to understand more clearly what was actually being said — never to argue or redirect. Only once everyone had spoken did he offer his own view, and even then, he wove in what the others had actually said rather than simply announcing a decision he'd already made before the meeting started."),
    paragraph("Mandela carried this pattern into his own leadership decades later, and it's worth noticing what it actually required of him: real patience, and a willingness to genuinely not know the answer yet when the meeting began. A leader who already knows what they're going to decide isn't listening in that meeting. They're just waiting for it to end."),
    paragraph("There's a simple, uncomfortable test for which kind of leader you actually are: notice what you're doing while someone else is talking. If you're already composing your response, you're the second kind. If you're genuinely trying to understand something you don't yet fully understand, you're the first. Most leaders can tell the difference the moment they actually check."),
    table(
      ["Actually listening", "Waiting to talk"],
      [
        ["Can restate the other person's point in their own words", "Can restate their own point, slightly rephrased"],
        ["Asks a question because something is genuinely unclear", "Asks a question to steer back to what they wanted to say"],
        ["Can be genuinely surprised by what they hear", "Has already decided how the conversation ends"],
        ["Goes quiet sometimes, without filling the silence", "Fills every pause, often before the other person finishes"],
      ]
    ),
    paragraph("None of these four pairs require a personality change. They require noticing, in the moment, which column you're actually operating from — and that noticing alone changes the answer more often than any technique layered on top of it would."),
    callout("tip", "One habit worth adopting deliberately: before responding in a difficult conversation, silently restate what the other person just said, in your own head, before saying anything else. If you can't do it accurately, you weren't actually listening yet."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "In your last difficult conversation, were you actually listening, or were you waiting?",
      ]
    ),
  ]
};

// ─── SECTION 7 — Closing & Assignment ───────────────────────────────────────

const section7 = {
  section_number: 7,
  title: "Closing & Assignment",
  blocks: [
    heading(2, "Closing & Assignment"),
    paragraph("Communication isn't a soft skill layered on top of real leadership — it's the delivery mechanism for everything real leadership has already built. Vision, character, trust: none of it reaches anyone without this, and none of the seven principles or nine channels in this module matter if the last one — matching behavior to words — isn't actually true."),
    paragraph("Four real moments run through this module, and each one demonstrates a different half of the same skill. Roosevelt chose warmth over formality and built genuine connection across a medium most leaders of his era used only to make announcements. Churchill chose honesty over reassurance on his very first day in the hardest job of his life, and it earned him the confidence a softer opening never would have. King gave an audience something they could actually picture, not just a position to agree with. And Mandela's father showed him that the most important part of communication often isn't the talking at all — it's genuinely not knowing your answer yet when the conversation begins."),
    paragraph("None of these four had the advantage of a perfect message. What they had in common was refusing to let the difficulty of communicating something true talk them into communicating something easier instead."),
    paragraph("That's a genuinely learnable discipline, not a talent some leaders happen to have and others don't. Every principle in this module — timing, transparency, visualization, listening — is a specific, practiceable skill. You won't get all seven right this week. Start with the one you already know is your weakest, and let the rest follow."),
    pullQuote("What you know and never say helps no one. What you say and never mean to helps no one either. Somewhere between those two is the actual work of this module."),
    paragraph("Module 8 picks up from here with a specific question this one has been building toward without naming it directly: once your message actually reaches someone, what are you leading them toward — yourself, or something bigger than you?"),
    videoPlaceholder("2-3 min closing from Denis — on a time his own communication failed to connect, and what he learned from watching it not land."),
    divider(),
    assignmentPrompt(
      "Week 7 Assignment",
      "This assignment asks you to run a real message you actually need to deliver through this module's framework, and to be honest about where you currently fall short.",
      [
        {
          number: 1,
          heading: "Name a Real Message",
          guidance: "Name one specific thing you need to communicate to someone in the next two weeks — a decision, a piece of feedback, a vision update. Be specific enough that someone else could picture the actual conversation."
        },
        {
          number: 2,
          heading: "Run It Through the Seven Principles",
          guidance: "For the message you named, answer honestly: have you thought through the right timing, the specific audience, and — the one leaders skip most — the actual cost you need to name transparently?"
        },
        {
          number: 3,
          heading: "Choose Your Channels",
          guidance: "Of the nine channels in Section 5, which two or three will you actually use for this message, and why those specifically rather than just defaulting to an announcement?"
        },
        {
          number: 4,
          heading: "Name Your Listening Gap",
          guidance: "Think of a real recent conversation where you were preparing your response instead of actually listening. What did you likely miss?"
        },
        {
          number: 5,
          heading: "Make It Memorable",
          guidance: "Take the message you named in Question 1 and rewrite the single most important sentence of it so someone could actually picture it, the way Section 3 described — not just understand it."
        }
      ],
      200,
      700
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7];

const module7 = {
  module_number: 7,
  title: "Communication",
  subtitle: "Making Everything Else Actually Reach Someone",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "Two figures with a speech bubble passing between them",
  sections: sections.map(s => ({ section_number: s.section_number, title: s.title, blocks: s.blocks }))
};

// ─── Structural self-validation ────────────────────────────────────────────

const flat = sections.flatMap(s => s.blocks);
let titleConsumed = false;
let simSections = [];
let current = null;
for (const b of flat) {
  const isH2 = b.type === "heading" && b.data.level === 2;
  if (isH2 && !titleConsumed) { titleConsumed = true; continue; }
  if (isH2) { if (current) simSections.push(current); current = { title: b.data.text, blocks: [] }; continue; }
  if (current) current.blocks.push(b);
}
if (current) simSections.push(current);

console.log(`Module 7 — "${module7.title}"`);
console.log(`Simulated splitter produced ${simSections.length} sections (expect 7):`);
simSections.forEach((s, i) => console.log(`  ${i+1}. ${s.title} (${s.blocks.length} blocks)`));

const variants = new Set(flat.filter(b => b.type === "callout").map(b => b.data.variant));
const allowed = new Set(["note","info","warning","tip","scripture"]);
const unknown = [...variants].filter(v => !allowed.has(v));
console.log(`\nCallout variants used: ${[...variants].join(", ")}`);
console.log(`Unknown variants: ${unknown.length ? unknown.join(", ") : "NONE"}`);
console.log(`\nTotal blocks: ${flat.length}`);
console.log(`Reflection question blocks: ${flat.filter(b=>b.type==="reflection_questions").length}`);
console.log(`Assignment prompt blocks: ${flat.filter(b=>b.type==="assignment_prompt").length}`);
console.log(`Pending images: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[IMAGE PLACEHOLDER")).length}`);
console.log(`Pending videos: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[VIDEO PLACEHOLDER")).length}`);

fs.writeFileSync('module7_leadership.json', JSON.stringify(module7, null, 2));
console.log(`\nWritten to module7_leadership.json`);
