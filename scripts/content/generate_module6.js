// Module 6 — "Building Trust"
// Original content throughout, synthesizing library material (Toolkit,
// session cards, Scripture) with independent web research (Feuerstein).

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

// ─── SECTION 1 — Trust Is the Foundation ───────────────────────────────────

const section1 = {
  section_number: 1,
  title: "Trust Is the Foundation",
  blocks: [
    heading(2, "Building Trust"),
    paragraph("Module 6 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 6 — why every module before this one has quietly depended on something we're only now naming directly."),
    callout("info", "Who this is for: Every leader who completed Modules 1-5. You've built character, named your vision, and understood the levels people actually follow you at. None of it holds without this."),
    callout("info", "Core promise: By the end of this module, you'll know the specific behaviors that build or destroy trust, be able to name your own biggest trust leak, and have a real tool for deciding who to actually hand responsibility to."),
    callout("info", "Time commitment: Roughly 75-85 minutes of reading and reflection, plus assignment work."),
    divider(),
    heading(2, "Trust Is the Foundation"),
    paragraph("Trust is the word every module before this one has been quietly building toward."),
    paragraph("Every level in Module 5's model depended on it without naming it. Permission is trust extended. Production is trust confirmed by results. People Development is trust deep enough to risk investing in someone else's growth. Take trust out from underneath any of it, and the structure doesn't bend — it collapses."),
    paragraph("A leader can survive a bad quarter. A leader can survive a wrong call, a missed goal, an unpopular decision. What a leader cannot survive, long-term, is people concluding they can't be trusted — because once that conclusion is reached, nothing else the leader says carries any weight at all."),
    paragraph("Look back across everything this track has covered so far. Module 1's self-leadership work only matters to other people once it's visible enough for them to actually trust what they're seeing. Module 2's character only functions as leadership currency once someone else knows about it — trust is how the private becomes credible in public. Module 4's vision goes nowhere without people willing to follow it, and following is, definitionally, an act of trust. None of it was ever separate work. This was always the actual subject underneath everything else."),
    callout("tip", "Trust is also asymmetric in a specific, costly way: it is built slowly, in small deposits, over real time — and it can be destroyed in a single moment. That asymmetry alone should change how carefully a leader treats it."),
    paragraph("Volkswagen spent roughly eighty years building a reputation for engineering integrity — the specific, hard-won trust that its numbers could be believed. In September 2015, regulators revealed the company had installed software specifically designed to cheat emissions tests across eleven million vehicles worldwide. The company's own CEO resigned within days. Decades of built trust didn't erode gradually. It collapsed in a single news cycle, because the discovery didn't just reveal one lie — it made every previous claim the company had ever made retroactively suspect."),
    paragraph("That's the actual mechanism behind trust's asymmetry. It isn't that betrayal is emotionally worse than steady faithfulness feels good. It's that one confirmed lie doesn't cost you one data point — it makes a leader re-examine everything that came before it too."),
    paragraph("This module walks through six real leaders and organizations, and it's worth naming honestly upfront: some of them got this right, and at least one of them didn't. Both kinds of example teach the same lesson, from opposite directions."),
    image({
      type: "flat editorial illustration, muted navy/gold palette",
      content: "A single stone arch, keystone visible at the top, with the word TRUST subtly worked into the keystone's shape — the rest of the structure clearly depends on this one piece",
      width: 1200,
      height: 675
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of a leader you personally stopped trusting. Was it one dramatic moment, or a slow accumulation of small ones?",
      ]
    ),
  ]
};

// ─── SECTION 2 — The Trust Equation ─────────────────────────────────────────

const section2 = {
  section_number: 2,
  title: "The Trust Equation",
  blocks: [
    heading(2, "The Trust Equation"),
    paragraph("Trust isn't one thing. It's the product of at least four separate ingredients, and a leader can be strong in some and quietly weak in others without ever noticing which one is actually costing them."),
    table(
      ["Component", "What it actually means"],
      [
        ["Competence", "You're genuinely good at what you do — trust in your judgment isn't the same as trust in your character, and both are required"],
        ["Character", "Your motives are what they appear to be — people aren't wondering what you're really after"],
        ["Consistency", "You're the same person in the same situation twice — predictability is itself a form of trustworthiness"],
        ["Time", "Trust compounds. There's no shortcut past the years it takes to actually accumulate"],
      ]
    ),
    callout("warning", "Notice the trap in this: a leader can be highly competent and still not be trusted, if character is in question. A leader can have great character and still not be trusted, if competence is in question. High performers sometimes assume competence alone should earn trust — it doesn't. All four have to be present."),
    paragraph("Elizabeth Holmes built Theranos into a company valued near $9 billion, raising close to a billion dollars from investors that included Rupert Murdoch and the Walton family, on the strength of exactly one thing: how competent and visionary she appeared. For years, that appearance was enough. It was never backed by working technology, and in January 2022 a federal jury convicted her on four counts of fraud against investors. She was sentenced to just over eleven years in prison."),
    paragraph("The lesson isn't that confidence is dangerous. It's that competence a leader merely projects, rather than competence that's actually real and paired with character, doesn't hold — it just takes longer to be tested than the other three components of trust do."),
    paragraph("Notice, too, that the four components aren't independent of each other in practice — they interact. Consistency is really just Character and Competence, demonstrated repeatedly enough that Time has had a chance to confirm the pattern is real rather than a lucky run. A leader who wants to shortcut the equation by working harder on the visible components — being more competent, performing more consistency — while neglecting the invisible ones underneath will eventually find that the shortcut doesn't actually exist."),
    paragraph("This module keeps returning to real leaders who understood that arithmetic — Feuerstein, Semler, Burke, even Dalio's controversial version of it. None of them were trusted because any single component was extraordinary. They were trusted because all four were actually present, at the same time, for long enough that it stopped being a performance and started being simply who they were."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the four — Competence, Character, Consistency, Time — which is genuinely your weakest with the people you currently lead?",
      ]
    ),
  ]
};

// ─── SECTION 3 — What Actually Builds It ────────────────────────────────────

const section3 = {
  section_number: 3,
  title: "What Actually Builds It",
  blocks: [
    heading(2, "What Actually Builds It"),
    paragraph("Trust isn't only a feeling people have about a leader — it's produced by specific, observable behaviors, which means it can be deliberately practiced rather than just hoped for. Four are worth building into how you actually operate."),
    heading(3, "Say the Real Thing"),
    paragraph("Not brutally, not without care for how it lands — but plainly, without leaving a false impression standing because the true one was inconvenient to state. A leader who consistently tells people what they want to hear is training everyone around them to eventually discount everything they say."),
    paragraph("Ray Dalio built this into the actual structure of Bridgewater Associates, the hedge fund he founded in 1975, rather than leaving it as a personal habit. Starting in the early 1990s, nearly every meeting was recorded and made available to employees. People rated each other's contributions in real time, in the room, on the record. The explicit goal was to make honest disagreement normal enough that the best idea could win regardless of who was senior enough to have said it."),
    callout("warning", "Worth knowing the whole picture, not just the pitch: this same system drew real, documented criticism over the years — complaints about privacy, about a culture some former employees described as harsh rather than merely honest, and the firm itself later softened or removed some of the more extreme practices. Radical honesty built into a system doesn't automatically produce a healthy one. It has to be paired with the same care for people this whole section keeps returning to — plain truth isn't automatically kind truth."),
    heading(3, "Name the Problem Everyone's Avoiding"),
    paragraph("Every team has at least one thing nobody wants to bring up directly — the underperformer no one addresses, the plan everyone privately doubts, the decision that's clearly not working. A leader who names it, carefully but directly, earns something a leader who lets it sit unspoken never does."),
    paragraph("The tell is usually in the hallway conversations. If the same concern keeps surfacing in private, one-on-one, between people who'd never say it out loud in the room together, that's not a minor issue — that's a trust test the leader is currently failing, whether or not anyone's said so directly. Every week that concern stays unnamed in the actual meeting is a week the team quietly learns that this particular leader isn't the one you bring hard things to."),
    heading(3, "Fix It Out Loud When You're Wrong"),
    paragraph("Quietly correcting a mistake protects a leader's image. Correcting it visibly — admitting what happened, not just what changed — protects something more valuable: the team's confidence that they'll actually be told the truth next time something goes wrong."),
    paragraph("In 1982, seven people in the Chicago area died after someone tampered with bottles of Tylenol, lacing capsules with cyanide. Johnson & Johnson hadn't caused the deaths and had no legal obligation to act beyond the affected area — investigators believed the tampering was localized. CEO James Burke made a different call: a voluntary recall of all 31 million bottles nationwide, at a cost of roughly $100 million, alongside a nationwide warning campaign and daily public briefings rather than routing everything through lawyers."),
    paragraph("Tylenol's market share collapsed from 35% to roughly 7% within weeks. Within a year it had fully recovered — not despite the costly, visible response, but because of it. The case became the standard business-school example of crisis response precisely because Burke chose the expensive, public version of doing the right thing over the cheaper, quieter one."),
    heading(3, "Keep the Small Commitments, Not Just the Big Ones"),
    paragraph("A leader who keeps every major promise but is casual about small ones — showing up on time, following through on a minor ask, remembering what they said they'd do — is training people to discount everything they commit to, because they can't tell in advance which category a given promise falls into."),
    paragraph("This is why small commitments carry more diagnostic weight than they seem to deserve. A missed major promise usually has a real, understandable story behind it — circumstances changed, something genuinely got in the way. A missed small one rarely does. There's no good explanation for forgetting a two-line follow-up email three separate times, and everyone watching knows it, whether or not they say so."),
    callout("tip", "None of these four are dramatic. That's exactly the point — trust is built and lost in the ordinary moments a leader isn't thinking of as a trust-building moment at all."),
    paragraph("Notice something across all four examples above: none of them required charisma, and none of them were free. Bridgewater's honesty cost comfort. Burke's recall cost $100 million. Every one of the four behaviors in this section trades something real — ease, image, money, time — for something that doesn't show up on a balance sheet until the day it's the only thing that matters."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these four, which do you genuinely practice, and which do you only intend to?",
        "Of the four real examples in this section — Bridgewater's recorded meetings, the unspoken team problem, the J&J recall, the small broken promise — which one made you think of a specific moment in your own leadership, and what actually happened?",
      ]
    ),
  ]
};

// ─── SECTION 4 — The Cost of Keeping a Commitment ──────────────────────────

const section4 = {
  section_number: 4,
  title: "The Cost of Keeping a Commitment",
  blocks: [
    heading(2, "The Cost of Keeping a Commitment"),
    paragraph("On December 11, 1995, a fire destroyed most of Malden Mills, a textile factory in Lawrence, Massachusetts, employing roughly 3,000 people. The owner, Aaron Feuerstein, had every conventional reason to lay the workforce off while he decided what came next — insurance negotiations, an uncertain rebuild timeline, no obligation beyond what the moment required."),
    paragraph("Instead, he told his employees that night that he was keeping all of them on full pay and benefits while the factory was rebuilt. He kept that commitment for ninety days, at real and significant personal cost. He later explained the decision came directly from his own religious study, not a business calculation."),
    callout("tip", "The story doesn't end simply, and it shouldn't be told as if it does. Malden Mills eventually filed for bankruptcy in 2007 — more than a decade later, for reasons largely unrelated to the fire. Some business analysts still debate whether the decision was, in the narrowest financial sense, the right one. That complexity is worth keeping, not smoothing over: keeping a costly commitment doesn't guarantee the story ends well. It's still what trust actually costs when it's genuine."),
    paragraph("Feuerstein's own words, the night of the fire: \"I'm not throwing 3,000 people out of work two weeks before Christmas.\""),
    paragraph("The decision drew enough national attention that President Clinton cited Feuerstein by name during the 1996 State of the Union Address, holding him up as an example of a different way to lead. That's worth noting for what it reveals about the Consistency component of the Trust Equation specifically: it wasn't the size of the gesture that made it remarkable, it was that everyone who already knew Feuerstein wasn't surprised by it. It matched who he'd already shown himself to be."),
    paragraph("The commitment didn't end with the ninety days, either. When he rebuilt the factory, he built it as a genuinely better workplace than the one that burned — brighter, healthier, at real additional cost to himself, when the cheaper rebuild would have satisfied every obligation he'd actually made. Consistency, in practice, often looks exactly like this: doing more than the letter of the promise required, because the promise was never really the point."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Is there a commitment you're currently keeping that's genuinely costing you something? What would it mean to break it — and what would it mean to your team if you did?",
      ]
    ),
  ]
};

// ─── SECTION 5 — Who You Actually Trust With Responsibility ────────────────

const section5 = {
  section_number: 5,
  title: "Who You Actually Trust With Responsibility",
  blocks: [
    heading(2, "Who You Actually Trust With Responsibility"),
    paragraph("Moses was leading Israel alone — every dispute, every decision, funneled through one exhausted man. His father-in-law Jethro watched this for exactly one day before naming the problem directly: this isn't sustainable, and it isn't wise."),
    paragraph("Jethro's actual advice is worth studying, because it's not just \"delegate more.\" He gave Moses specific criteria for who should receive real authority — not the most available people, not the most eager, but people who met a real standard."),
    table(
      ["Criterion", "What it actually screens for"],
      [
        ["Capable", "Genuine competence — the actual ability to do the thing, not just willingness"],
        ["God-fearing", "Character with real weight behind it — accountable to something beyond the leader's approval"],
        ["Trustworthy", "Won't use delegated authority for private gain — the specific failure mode Jethro names directly is bribery"],
      ]
    ),
    callout("warning", "Notice what's missing from Jethro's list: loyalty to Moses personally, or simple availability. A leader who hands out responsibility based on who's closest or most convenient, rather than who actually meets the standard, is building a structure that will fail exactly where it's tested hardest."),
    paragraph("This isn't only ancient wisdom. Gerard Seijts, a leadership researcher at Ivey Business School, has studied character's actual effect on organizational performance — not as a soft virtue, but as a measurable one. His research found that companies led by CEOs who scored high on character measures averaged a 9.35% return on assets, compared to 1.93% for CEOs who scored low. Nearly five times the performance, and it had nothing to do with credentials, experience, or technical skill."),
    paragraph("Jethro and a modern business school arrived at the identical warning from three thousand years apart: capability without character isn't a stable foundation to build responsibility on. It just takes longer for the weakness to show up in the numbers than it does in the moment of decision."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of someone you currently give real responsibility to. Did they earn that by meeting a real standard, or by simply being available and willing?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Enabling Others to Act ────────────────────────────────────

const section6 = {
  section_number: 6,
  title: "Enabling Others to Act",
  blocks: [
    heading(2, "Enabling Others to Act"),
    paragraph("Leadership researchers James Kouzes and Barry Posner, whose Five Practices framework this track has already drawn on for Vision, identify a fourth practice built entirely on what this module has been building toward. It has two distinct commitments underneath it, and most leaders are only comfortable with one of them."),
    heading(3, "Foster Collaboration"),
    paragraph("Promoting shared goals and building real trust — treating the people around you as partners with a stake in the outcome, not a chain of command to be managed. A leader who only ever gives instructions, even kindly, is still operating alone with extra steps."),
    heading(3, "Strengthen Others"),
    paragraph("Sharing power and discretion — the harder half, and the one this module has really been building toward all along."),
    paragraph("The distinction between fostering collaboration and strengthening others matters in practice. Fostering collaboration can happen while the leader still holds all the actual authority — it's a tone, a way of working together. Strengthening others requires the authority itself to actually move. Delegating a task keeps the decision with the leader and just moves the labor. Sharing power means the other person can now make a real decision, not just execute one the leader already made."),
    paragraph("Ricardo Semler took over his father's manufacturing company, Semco, in Brazil in 1980, at age 21. Over the following two decades he did something most leaders only claim to do: he actually gave the authority away, not just the tasks. Employees set their own salaries — with real safeguards, not a blank check, given access to market-rate data and the company's actual financial performance before making their proposal, in full view of their colleagues. They chose their own working hours. They voted on who their own managers would be."),
    paragraph("It should have been chaos. Instead, revenue grew from roughly $4 million to over $200 million. The mechanism wasn't a lack of standards — it was trust extended with enough real information attached that people could be trusted to use it well."),
    pullQuote("You can't do it alone — and pretending otherwise is the ceiling on everything you'll ever build."),
    callout("tip", "This is also where the whole module closes the loop back to Module 5's levels. A leader who never learns to genuinely share power can reach Production, but can't reach People Development — the fourth level requires giving something real away, and trust is the only thing that makes giving it away survivable."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Where in your leadership are you still delegating tasks while quietly keeping all the actual authority?",
      ]
    ),
  ]
};

// ─── SECTION 7 — The Delegation Test ────────────────────────────────────────

const section7 = {
  section_number: 7,
  title: "The Delegation Test",
  blocks: [
    heading(2, "The Delegation Test"),
    paragraph("Trust extended carelessly isn't trust — it's abdication, and it usually produces a failure that makes the leader more cautious next time, not less. A simple five-question test, asked honestly before handing something real to someone, keeps delegation from becoming either extreme."),
    paragraph("Notice the two failure modes this test is actually designed to prevent, and they sit at opposite ends of the same problem. Under-delegating — a leader who never genuinely lets go, regardless of what Section 5's criteria would say about who's ready — caps the whole organization at whatever one person's personal capacity happens to be. Over-delegating — handing real responsibility to someone before they've met the standard, or without the support the fifth question demands — produces a failure that then gets blamed on the person rather than the process that set them up."),
    numbered("What. What exactly needs to be done — specifically enough that both people would describe it the same way afterward.", 1),
    numbered("Why. Why it actually matters — not just the task, but what it's actually for.", 2),
    numbered("Who. Why this specific person — tested against Section 5's criteria, not just convenience.", 3),
    numbered("When. What the real deadline is, and what happens if it's missed.", 4),
    numbered("How. What support and resources this person actually needs to succeed — which the leader is responsible for making sure they have.", 5),
    callout("tip", "The fifth question is the one leaders skip most often. Handing someone real responsibility without the resources to carry it is a way of setting them up to fail while telling yourself you empowered them."),
    paragraph("This is exactly the discipline underneath Semco's radical version of power-sharing from Section 6. Employees setting their own salaries wasn't a leader simply stepping back — it was Semler making sure every one of the five questions was answered before the authority moved: what a fair salary actually meant, why the company's survival depended on getting it right, who had access to make that call, when the decision needed to happen, and — critically — what information people needed to make it responsibly. Remove the fifth question, real financial transparency, and the same policy would have been reckless instead of remarkable."),
    divider(),
    scorecard("Trust Self-Audit", "module6_trust_equation", [
      { key: "competence", label: "Competence — trusted in your judgment and skill", max: 10, helpText: "Has anyone recently gone around your recommendation rather than trusting it?" },
      { key: "character", label: "Character — trusted that your motives are what they appear", max: 10, helpText: "If people privately guessed why you make the decisions you make, would their guess match your actual reason?" },
      { key: "consistency", label: "Consistency — trusted to be the same person twice", max: 10, helpText: "Would the people who report to you describe your reactions as predictable, or as something they brace for?" },
      { key: "time", label: "Time — trust that's actually been given years to compound", max: 10, helpText: "Is your current trust with this person actually earned over time, or still running on a first impression?" },
    ]),
  ]
};

// ─── SECTION 8 — Closing & Assignment ───────────────────────────────────────

const section8 = {
  section_number: 8,
  title: "Closing & Assignment",
  blocks: [
    heading(2, "Closing & Assignment"),
    paragraph("Trust isn't a soft addition to leadership — it's the load-bearing wall underneath everything the last five modules built. It's produced by specific, ordinary behaviors, not grand gestures, and it's genuinely asymmetric: built in small deposits over real time, capable of being erased in a single confirmed lie, the way Volkswagen learned in one news cycle what eighty years of engineering reputation was actually worth."),
    paragraph("It's tested most clearly by what a leader is willing to keep when keeping it costs something — Feuerstein's ninety days of payroll, Burke's $100 million recall, decisions that made sense only because character was actually driving them rather than a calculation of what would look best. And it's the one thing that makes real delegation survivable rather than reckless — the difference between Jethro's careful criteria and Elizabeth Holmes's investors discovering, years too late, that competence they'd assumed was never real to begin with."),
    paragraph("None of this requires a title. Semco's employees set their own salaries not because Ricardo Semler stopped leading, but because he'd built the specific conditions — real information, real accountability, real trust extended deliberately — that made it safe to let go. That's the actual finish line this module has been pointing toward the whole way through."),
    paragraph("You won't get there by announcing it. You'll get there the same way every leader in this module did — one kept commitment, one honest conversation, one piece of real responsibility actually handed over, repeated long enough that it stops being a strategy and starts being simply who you are."),
    videoPlaceholder("2-3 min closing from Denis — on which of the four trust-building behaviors he's personally had to work hardest at, and why that's worth admitting out loud."),
    divider(),
    assignmentPrompt(
      "Week 6 Assignment",
      "This assignment asks you to run the Delegation Test on something real, and to name your own weakest trust behavior honestly — not the one that sounds most forgivable.",
      [
        {
          number: 1,
          heading: "Name Your Leak",
          guidance: "Of the four trust-building behaviors in Section 3 — saying the real thing, naming the avoided problem, fixing mistakes visibly, keeping small commitments — which is genuinely your weakest? Describe one recent moment it cost you something real."
        },
        {
          number: 2,
          heading: "Run the Trust Equation",
          guidance: "Score yourself honestly on Competence, Character, Consistency, and Time with one specific person you currently lead. Which score would surprise them most if they saw it?"
        },
        {
          number: 3,
          heading: "Run the Delegation Test",
          guidance: "Pick one real piece of responsibility you're considering handing to someone. Answer all five questions — What, Why, Who, When, How — in writing, specifically enough that someone else could follow your reasoning.",
          example: "Example: \"What: owning the weekly team update, start to finish. Why: it's currently a bottleneck only I can clear. Who: Sarah — she's asked good questions in every meeting for six months. When: starting next Monday, first review after two weeks. How: I'll share my current template and sit in silently on the first one.\""
        },
        {
          number: 4,
          heading: "Keep One Commitment On Purpose",
          guidance: "Name one small commitment you've been casual about lately. What will you do this week to keep it visibly, on purpose?"
        },
        {
          number: 5,
          heading: "Name What You're Not Sharing",
          guidance: "Look back at Section 6. What is one piece of real authority — not just a task — that you are currently holding onto, that someone on your team is actually ready for? What's specifically stopping you from handing it over?"
        }
      ],
      200,
      700
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7, section8];

const module6 = {
  module_number: 6,
  title: "Building Trust",
  subtitle: "The Foundation Underneath Everything Else",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "A single stone arch with its keystone visible",
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

console.log(`Module 6 — "${module6.title}"`);
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

fs.writeFileSync('module6_leadership.json', JSON.stringify(module6, null, 2));
console.log(`\nWritten to module6_leadership.json`);
