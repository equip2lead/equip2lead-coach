// Module 5 — "Levels & Laws"
// Five Levels of Leadership as the spine, three law-concepts as brief
// touchpoints (original explanation + own examples, not reproduced text),
// original content on barriers to potential (no borrowed narrative devices).

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
const bullet = (text) => paragraph(`• ${text}`);
const numbered = (text, n) => paragraph(`${n}. ${text}`);
const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const videoPlaceholder = (description) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${description}`);
const imagePlaceholder = (description) => callout("note", `[IMAGE PLACEHOLDER — pending generation] ${description}`);
// A real image once its file exists, a placeholder until then. Passing
// { url, alt } emits the block the renderer actually wants; passing the old
// { type, content, width, height } art-direction spec still emits a callout,
// so images still pending generation keep working unchanged.
const image = (spec) =>
  spec.url
    ? { type: "image", data: { url: spec.url, alt: spec.alt } }
    : imagePlaceholder(`${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);
const recommendedLink = (title, url_hint, note) => callout("info", `${title} — ${url_hint}. ${note}`);
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });

// ─── SECTION 1 — What Determines How Far You Go ────────────────────────────

const section1 = {
  section_number: 1,
  title: "What Determines How Far You Go",
  blocks: [
    heading(2, "Levels & Laws"),
    paragraph("Module 5 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 5, why leadership isn't one fixed thing you either have or don't, but a series of levels you climb — and why some people rise for decades while others plateau in year two."),
    callout("info", "Who this is for: Every leader who completed Modules 1-4. You've done the inner work and named your vision. This module asks a harder question: what actually determines how far that vision can carry you?"),
    callout("info", "Core promise: By the end of this module, you'll know which of five leadership levels you're actually operating at with each person you lead — not the level you'd like to claim — and what specifically moves you to the next one."),
    callout("info", "Time commitment: Roughly 70-80 minutes of reading and reflection, plus assignment work."),
    divider(),
    heading(2, "What Determines How Far You Go"),
    paragraph("Two leaders can hold the identical title, run the identical size of team, and produce wildly different results over ten years. Same starting resources. Same market. Same opportunity. The gap between them isn't talent, and it usually isn't effort. It's something more specific: their actual capacity to lead — a ceiling that exists whether or not anyone has ever pointed it out to them."),
    callout("tip", "Leadership researcher John Maxwell built a widely used model around exactly this gap, describing leadership not as a single fixed skill but as five distinct levels a person moves through — each one requiring something the last one didn't."),
    paragraph("This module borrows that structure — five levels, each genuinely different from the one before it — and pairs it with a small handful of leadership principles worth knowing by name. Not an exhaustive list. Three that matter enough to slow down for."),
    heading(3, "A Completely Independent Confirmation"),
    paragraph("This isn't only one author's observation. In 1959 — decades before any modern leadership-consulting book on the subject — social psychologists John French and Bertram Raven published academic research identifying five distinct sources of social power, working entirely from psychology, not leadership theory. Their categories map onto this module's levels with real precision."),
    table(
      ["Power base (French & Raven, 1959)", "What it is", "Maps to"],
      [
        ["Legitimate", "The belief that someone has the right to command, based on position or title alone", "Level 1 — Position"],
        ["Coercive / Reward", "Compliance produced by the ability to punish or to give benefit", "Still Level 1 — not yet real influence"],
        ["Referent", "Influence earned through being liked, respected, and trusted", "Level 2 — Permission"],
        ["Expert", "Influence earned through demonstrated skill and credibility", "Level 3 — Production"],
      ]
    ),
    callout("tip", "Two researchers, working from academic psychology with no connection to leadership consulting, independently found the same progression: authority based on title alone is the weakest and least durable form of influence, while authority earned through relationship and demonstrated competence is what actually lasts. Neither knew the other's specific framework when they wrote their own."),
    videoEmbed("uAy6EawKKME", "Everyday Leadership | Drew Dudley | TEDxToronto"),
    paragraph("Worth watching before the rest of this module: the levels ahead aren't reserved for people with titles. Every level in this module — including Permission, the one built entirely on being trusted rather than obeyed — is available to anyone, starting today, with whoever's already in front of them."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of someone you currently lead. If you're honest, why do they actually follow you — because they have to, because they want to, or for some other reason entirely?",
      ]
    ),
  ]
};

// ─── SECTION 2 — Position & Permission ──────────────────────────────────────

const section2 = {
  section_number: 2,
  title: "Position & Permission",
  blocks: [
    heading(2, "Position & Permission"),
    paragraph("The first two levels are where almost every leader starts, and where a real number of leaders also stay — sometimes for an entire career, without ever quite noticing they never left."),
    heading(3, "Level 1 — Position"),
    paragraph("At this level, people follow because they have to. The authority is real, but it comes entirely from the title, not from the person holding it. This isn't a flaw to be ashamed of — everyone starts here, the same way every leader in Scripture started somewhere before their calling was confirmed by results. The danger isn't occupying Level 1. It's mistaking the title for the actual leadership."),
    callout("warning", "A leader who never grows past Position discovers the hard way that authority without influence is borrowed, not owned. Remove the title, and nothing else about their leadership survives the removal."),
    heading(3, "\"I Don't Trust You\""),
    paragraph("A health policy consultant once described leading her first meeting with a group of First Nations leaders in Manitoba, Canada, running it the way she normally did — taking charge, giving instructions, relying on the authority of her experience and expertise. Partway through her presentation, one of the leaders, George Muswaggon of Cross Lake First Nation, spoke up in a calm, matter-of-fact voice: \"I don't trust you.\""),
    paragraph("She kept going, unsure how to respond, but the meeting had already told her something important: expertise and title had bought her a seat at the table, not real followership. Over the months that followed, she stayed present, kept showing up, and earned something the first meeting had made clear she didn't yet have. Muswaggon later explained his caution simply — his people's history meant trust couldn't be given lightly, but he'd watched her over time and decided she'd earned it, and that the trust, once given this way, would hold."),
    callout("tip", "Notice what actually moved her from Level 1 to Level 2. Not a better presentation. Not more credentials. Time, consistency, and enough humility to keep showing up after being told plainly that her authority alone hadn't earned anything yet."),
    heading(3, "Level 2 — Permission"),
    paragraph("People follow at this level because they want to, not because a title requires it. This level is built almost entirely on relationship — trust, genuine care, the accumulated evidence that this leader has the follower's actual interests in view, not just the organization's output."),
    paragraph("The shift from Position to Permission is the first real leadership transition most people ever make, and it's harder than it looks from the outside — because it requires something Position never asked for: being genuinely likable and trustworthy to people who, at this stage, still have every right to walk away."),
    image({
      url: "/images/module-5/position-permission-doors.png",
      alt: "Two wooden office doors side by side in a quiet corridor. The left door is shut, its brass plaque reading POSITION. The right door stands ajar, warm evening light spilling from the meeting room beyond, its plaque reading PERMISSION."
    }),
    heading(3, "Two Lists"),
    paragraph("Take sixty seconds. Write down the names of five people widely recognized as successful in your country right now — public figures, known for their achievement."),
    paragraph("Now take sixty seconds more. Write down five people — no fame required — who personally helped you become who you are. A teacher. A coach. Someone who believed in you before you'd proven anything."),
    paragraph("Which list came faster? Which names do you actually remember without thinking?"),
    paragraph("For most people, the second list. Not because the first list's names are unworthy — because influence and fame turn out to be different currencies. The people who actually shaped you were rarely the most decorated people in the room. They were the ones who paid attention to you specifically, for reasons that had nothing to do with your resume."),
    callout("tip", "That's the whole argument for what leadership actually is. It was never a title. It's what happens between two people when one of them decides the other is worth investing in."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "With the person you named in Section 1 — if your title vanished tomorrow, would they still choose to follow you? What's the honest answer, not the hopeful one?",
      ]
    ),
  ]
};

// ─── SECTION 3 — Production & People Development ───────────────────────────

const section3 = {
  section_number: 3,
  title: "Production & People Development",
  blocks: [
    heading(2, "Production & People Development"),
    heading(3, "Level 3 — Production"),
    paragraph("Here, people follow because of what the leader actually delivers. Real results, visibly produced, over enough time that they stop being luck and start being credibility. This is the level where a leader's word finally starts carrying weight independent of their title or their likability — because the evidence is sitting in plain view."),
    callout("tip", "Production is also where momentum becomes visible to everyone, not just the leader. Teams led by someone operating at this level can feel the difference — problems get solved instead of just discussed, and the whole organization's pace picks up."),
    heading(3, "Level 4 — People Development"),
    paragraph("This is the level most leaders never reach, because it requires giving away the very thing that got them here — direct control over outcomes — in favor of something slower and far less visible: building other leaders. At this level, people follow because of what the leader has invested in them personally, not just what the leader has produced."),
    videoEmbed("Rth6apF1mng", "How to Fix Leadership Development | Ryan Gottfredson | TEDxColeParkStudio"),
    paragraph("Gottfredson's central distinction is worth carrying into the rest of this section: most leadership development only adds skills and knowledge — horizontal growth. Level 4 requires something deeper, closer to what he calls vertical development: actually changing how a leader sees and thinks, not just what they know. Training gives someone tools. Development changes the person using them."),
    paragraph("The practical shift is significant: a Level 4 leader spends the majority of their working time developing others rather than personally producing — reproducing leaders instead of just accumulating results. This is uncomfortable precisely because results at Level 3 were fast and visible, and development at Level 4 is slow and often invisible for months before it pays off."),
    callout("warning", "A leader stuck at Level 3, unwilling to make this trade, eventually hits a hard ceiling — their organization can only ever be as large as what they alone can personally produce or personally supervise. Level 4 is how a leader's actual capacity stops being limited by their own two hands."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of your time this past month, what percentage actually went toward developing someone else's leadership, versus producing results yourself? Guess honestly before you calculate it.",
      ]
    ),
  ]
};

// ─── SECTION 4 — The Pinnacle ────────────────────────────────────────────────

const section4 = {
  section_number: 4,
  title: "The Pinnacle",
  blocks: [
    heading(2, "The Pinnacle"),
    paragraph("The fifth level is rare enough that most leaders will never fully occupy it, and that's worth saying plainly rather than pretending otherwise. At this level, people follow because of who the leader actually is and what their life has produced over time — reputation and legacy, not a single achievement or a single season of results."),
    paragraph("Reaching this level isn't primarily a matter of raw talent, though talent helps. It requires decades of intentional development, sustained long enough that the leader's character and competence have both been tested repeatedly and have both held. There's no shortcut through the first four levels to arrive here directly."),
    pullQuote("What you do daily, over time, becomes your legacy."),
    callout("tip", "One encouraging detail: you don't operate at only one level. You're likely at Level 4 with people you've mentored for years, Level 2 with a new hire who barely knows you yet, and possibly still Level 1 with someone who reports to you only on an organizational chart. The levels aren't a single score — they're a different relationship with every single person you lead."),
    callout("warning", "One sobering detail, worth equal weight: moving up a level takes real time. Falling back down one can happen in a single bad decision, witnessed once, by the wrong person, at the wrong moment. The climb is slow. The fall almost never is."),
    heading(3, "The Rule of Five"),
    paragraph("Level 5 is never reached by a single dramatic decision. It accumulates from small, consistent, unglamorous daily actions — the same discipline theme this track has returned to since Module 1's morning rhythms and Module 2's guardrails. Five levels, and the fifth is built the exact same way the first four were: daily, not dramatically."),
    paragraph("Frances Hesselbein spent eleven years as a volunteer and local council director before becoming CEO of the Girl Scouts of the USA in 1976 — an organization then in its eighth consecutive year of declining membership. Over the following fourteen years she led a genuine turnaround, and by the time she left, membership and diversity had both grown substantially. But what actually marks this as Pinnacle-level leadership isn't the turnaround itself. When asked once to describe her own place in the organization's structure, she didn't draw herself at the top. She placed herself at the center — connected to everyone, elevated above no one. And when she left the Girl Scouts, she spent the following decades doing exactly what this section has described: not managing her own legacy, but building other leaders' capacity to carry the work forward without her."),
    image({
      url: "/images/module-5/ascending-stone-steps.png",
      alt: "Five stone steps climbing a hillside toward a sunrise over a wide valley. The lower steps are dark, lichen-covered and worn; each step above is progressively lighter and less weathered, the topmost almost pale in the sun."
    }),
    divider(),
    scorecard("Where Are You With Your Closest Team?", "module5_five_levels", [
      { key: "position", label: "Level 1 — Position (authority from title alone)", max: 10 },
      { key: "permission", label: "Level 2 — Permission (they want to follow you)", max: 10 },
      { key: "production", label: "Level 3 — Production (your results earn credibility)", max: 10 },
      { key: "people_development", label: "Level 4 — People Development (you're reproducing leaders)", max: 10 },
      { key: "pinnacle", label: "Level 5 — Pinnacle (they follow your legacy, not just you)", max: 10 },
    ]),
  ]
};

// ─── SECTION 5 — What Keeps Potential From Rising ───────────────────────────

const section5 = {
  section_number: 5,
  title: "What Keeps Potential From Rising",
  blocks: [
    heading(2, "What Keeps Potential From Rising"),
    paragraph("Ability that never gets used doesn't announce itself as a problem. A muscle that hasn't been called on in years doesn't hurt — it's simply quiet, fully capable, waiting on a reason nobody's given it yet. Leadership capacity works the same way. Most people carrying real capability aren't short on it. They've just never been asked, or never asked themselves, whether it's actually being used."),
    paragraph("This is worth sitting with, because it reframes the whole question. The issue was never whether the capacity exists. The issue is whether anything is actively preventing its release — and unlike a muscle, which recovers with simple use, a leader's capacity can stay dormant indefinitely if the same few things keep getting in the way, year after year, without ever being named."),
    paragraph("None of the five levels are unreachable because of a lack of raw ability. Most leaders who plateau aren't short on capability — they're carrying something that quietly caps how high that capability can actually take them. Four patterns show up more than any others."),
    heading(3, "Delay"),
    paragraph("The first is simple avoidance dressed up as busyness — the change a leader already knows they need to make, postponed again, because postponing feels safer than the discomfort of actually starting. Nothing about this pattern announces itself as failure. It just looks like always being a little too occupied to begin."),
    heading(3, "Unrealistic Timelines"),
    paragraph("The second shows up as a leader who expects results faster than results are actually built, then quietly concludes the goal wasn't realistic instead of concluding the timeline wasn't. Nearly everything worth reaching at Level 4 or 5 takes longer than the leader wants it to — that isn't the plan failing, that's what the plan actually looks like from the inside."),
    heading(3, "Poor Response to Obstacles"),
    paragraph("The third is what a leader does the moment something blocks their path — whether they spend their energy naming the problem or spend it solving it. Organizations are full of people skilled at identifying what's wrong. They are chronically short on people who pair that same observation with an actual next step."),
    heading(3, "Fear"),
    paragraph("The fourth is the quietest and the heaviest: the specific fear of failing publicly, of being wrong in front of people who are watching, of the risk that moving up actually requires. Every leader who has reached Level 4 or 5 has felt this exact fear. What separates them isn't its absence — it's that they moved while still feeling it, rather than waiting for it to leave first."),
    videoEmbed("uwZdmnlVNbE", "T.D. Jakes: Stay Steady in Life's Storms and Conquer Fear That Holds You Back"),
    callout("tip", "None of these four is dramatic on its own. That's precisely why they're dangerous — a leader rarely notices any single one of them costing anything in the moment. The cost only becomes visible years later, measured against the leader they could have become instead."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the four — delay, unrealistic timelines, poor response to obstacles, fear — which one would the people closest to you name as yours, if they were being completely honest?",
        "What is one specific change you have been postponing, that you will actually act on this week?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Three Laws Worth Knowing ───────────────────────────────────

const section6 = {
  section_number: 6,
  title: "Three Laws Worth Knowing",
  blocks: [
    heading(2, "Three Laws Worth Knowing"),
    paragraph("Maxwell's broader body of work catalogs twenty-one separate leadership principles. This module doesn't walk through all of them — three are worth genuinely understanding, not just being able to name."),
    heading(3, "The Law of the Lid"),
    paragraph("The core claim is simple and uncomfortable: a leader's actual leadership ability sets a hard ceiling on everything else they're capable of — their vision, their team's output, their organization's size. Two people can share identical resources, identical opportunity, identical starting conditions, and produce entirely different results, because one of them has a higher leadership ceiling than the other."),
    paragraph("Saul and David make this concrete. Both were anointed king over the same nation, inheriting comparable resources and opportunity. What actually separated their reigns wasn't circumstance — it was that Saul's own insecurity, impatience, and pride became a ceiling nothing else in his kingdom could rise above, while David, whatever his own failures, kept raising his own lid rather than letting it cap him."),
    heading(3, "The Law of Process"),
    paragraph("Leadership capacity isn't acquired in a single moment of realization. It's built the same way physical strength is — through repeated, unglamorous exertion over real time, with no shortcut that skips the actual repetitions. A leader who wants the capability without the years spent building it is asking for something that, by definition, doesn't exist."),
    paragraph("Ursula Burns joined Xerox in 1980 as a mechanical-engineering summer intern. What followed wasn't a fast track — product development, planning, leading individual business teams through the 1990s, then manufacturing and supply-chain operations, then president in 2007, and finally CEO in 2009 and chairman in 2010. Almost three decades passed between the internship and the boardroom, and every one of those years added something the last one hadn't. By the time the title arrived, the capacity to actually use it had already been built."),
    heading(3, "The Law of Sacrifice"),
    paragraph("Every genuine advance in leadership capacity costs the leader something real to obtain — time that could have gone elsewhere, comfort that has to be given up, certainty traded for risk. Leaders who plateau early are frequently leaders who, at some specific point, weren't willing to pay what the next level actually cost."),
    paragraph("Indra Nooyi led PepsiCo for twelve years, and was candid about what that level of leadership actually required: by her own account, balance was one of the first things to go — not a complaint, a description of the real trade she'd made. What she spent those same twelve years building, alongside her own results, was her successor — giving real candidates real trial assignments and real authority years before any handoff was announced. When she stepped down in 2018, one interviewer later summarized it to her directly: she'd given the oxygen for her successor to succeed. Her own answer: \"Exactly right.\""),
    callout("tip", "Notice the pattern underneath all three: none of them are about talent. They're about ceiling, repetition, and cost — three things almost entirely within a leader's own control, whatever their starting ability happened to be."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Where is your own leadership lid right now — the specific thing about you, not your circumstances, that's currently capping what your team can achieve?",
      ]
    ),
  ]
};

// ─── SECTION 7 — Attitude Sets the Ceiling ──────────────────────────────────

const section7 = {
  section_number: 7,
  title: "Attitude Sets the Ceiling",
  blocks: [
    heading(2, "Attitude Sets the Ceiling"),
    paragraph("Two leaders, identical circumstances, identical setback — and they respond in opposite directions. One treats it as confirmation the whole effort was doomed. The other treats it as information and keeps moving. The circumstance was the same. What differed was entirely internal."),
    paragraph("This matters for every level in this module, because circumstance is rarely the actual variable separating a leader who reaches Level 4 from one who plateaus at Level 2. Both face real setbacks. Both face real seasons where results are slow and support is thin. What changes the outcome is what each of them does with what's happening inside them while it's happening."),
    callout("warning", "This is easy to hear as a platitude and genuinely isn't one. Attitude, in this frame, isn't forced positivity or denial of real difficulty. It's the specific, repeatable choice of what a leader does with a hard fact once it's already true — and that choice is available regardless of how the circumstance turned out."),
    paragraph("Two leaders, same organization, both told in the same week that a major project has been cancelled after months of work. One spends the next month telling anyone who'll listen that leadership never had a real plan to begin with. The other spends the same month asking what's actually salvageable from the work already done, and quietly starts on the next thing. Eighteen months later, one of them is still telling the same story about what went wrong. The other has moved twice as far, on a different project entirely — not because the cancellation hurt less, but because it got a different answer."),
    paragraph("Howard Schultz returned as Starbucks CEO in January 2008 to a company he barely recognized. Years of aggressive over-expansion had pulled it away from what had actually made it successful, and the stock had already fallen roughly 70% from its 2006 peak. The circumstance he inherited wasn't ambiguous — it was public, measurable, and getting worse. His response, later documented in a Harvard Business School case study, wasn't to defend the previous strategy or wait for the market to recover on its own: over the following two years, the company closed roughly 600 underperforming stores and deliberately rebuilt around the identity it had drifted from. The circumstance didn't improve first. The response came first, and the circumstance followed it."),
    paragraph("A different facet of the same principle: in May 2020, Airbnb's CEO Brian Chesky had to tell roughly 1,900 people — a quarter of the company — that their jobs were gone, with travel worldwide at a near-standstill and no honest date for when it would recover. The circumstance was as bad as it looked. What set his response apart wasn't the decision itself, which was largely forced — it was refusing to soften what had actually happened while still treating the people affected by it with real specificity: naming exactly what was ending, why, and what each person would receive on the way out, instead of vague reassurance. Attitude, in a moment like that, isn't optimism. It's the discipline to face what's true and still be the kind of leader worth following through it."),
    paragraph("A frequently cited line, sometimes attributed to psychologist William James, captures the underlying claim: that people can genuinely change their circumstances by changing what happens in their own thinking first — not the reverse. Whatever its exact origin, the claim itself has held up across a century of leadership observation: leaders rarely rise by waiting for their circumstances to improve first. They rise by deciding what they'll do with the circumstances already in front of them."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of your most recent real setback. Did your response to it treat the setback as confirmation you should stop, or as information to adjust and continue? Which one was it, honestly?",
      ]
    ),
  ]
};

// ─── SECTION 8 — Closing & Assignment ───────────────────────────────────────

const section8 = {
  section_number: 8,
  title: "Closing & Assignment",
  blocks: [
    heading(2, "Closing & Assignment"),
    paragraph("Five levels, three laws, four patterns that quietly cap potential, and one internal variable underneath all of it. None of this is about talent you either have or don't. It's about ceiling, repetition, cost, and what you do with what's already true — all of it available to you regardless of where you're starting from."),
    videoPlaceholder("2-3 min closing from Denis — a direct word on which level he'd honestly name himself at with different people in his own life, and why that's not something to be ashamed to say out loud."),
    divider(),
    assignmentPrompt(
      "Week 5 Assignment",
      "This assignment asks you to name your actual level with real people, not your aspirational one, and to name the specific thing capping you right now. Write honestly — this isn't graded on how impressive the answer sounds.",
      [
        {
          number: 1,
          heading: "Map Your Levels",
          guidance: "Name three specific people you currently lead. For each one, honestly name which of the five levels you're actually operating at with them — not the level you'd like to claim."
        },
        {
          number: 2,
          heading: "Name Your Lid",
          guidance: "Of the three laws in Section 6, which one is most active in your leadership right now? Be specific about what your own lid actually is, not a generic answer.",
          example: "Example: \"Law of Sacrifice — I keep protecting my evenings instead of investing them in the two people I say I want to develop.\""
        },
        {
          number: 3,
          heading: "Name Your Pattern",
          guidance: "Of the four barriers to potential in Section 5 — delay, unrealistic timelines, poor response to obstacles, fear — which one is yours? Describe one recent moment it actually cost you something."
        },
        {
          number: 4,
          heading: "One Move This Week",
          guidance: "Name one specific, concrete action you will take this week to move toward Level 4 with one of the three people you named in Question 1 — not a general intention, an actual action with a date attached."
        }
      ],
      200,
      600
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7, section8];

const module5 = {
  module_number: 5,
  title: "Levels & Laws",
  subtitle: "Five Levels, Three Laws, One Ceiling",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "Five weathered stone steps ascending toward a bright horizon",
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

console.log(`Module 5 — "${module5.title}"`);
console.log(`Simulated splitter produced ${simSections.length} sections (expect 8):`);
simSections.forEach((s, i) => console.log(`  ${i+1}. ${s.title} (${s.blocks.length} blocks)`));

const variants = new Set(flat.filter(b => b.type === "callout").map(b => b.data.variant));
const allowed = new Set(["note","info","warning","tip","scripture"]);
const unknown = [...variants].filter(v => !allowed.has(v));
console.log(`\nCallout variants used: ${[...variants].join(", ")}`);
console.log(`Unknown variants: ${unknown.length ? unknown.join(", ") : "NONE"}`);
console.log(`\nTotal blocks: ${flat.length}`);
console.log(`Reflection question blocks: ${flat.filter(b=>b.type==="reflection_questions").length}`);
console.log(`Assignment prompt blocks: ${flat.filter(b=>b.type==="assignment_prompt").length}`);
console.log(`Scorecard blocks: ${flat.filter(b=>b.type==="scorecard").length}`);
console.log(`Pending images: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[IMAGE PLACEHOLDER")).length}`);
console.log(`Pending videos: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[VIDEO PLACEHOLDER")).length}`);

fs.writeFileSync('module5_leadership.json', JSON.stringify(module5, null, 2));
console.log(`\nWritten to module5_leadership.json`);
