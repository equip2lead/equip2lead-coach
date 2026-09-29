// Module 12 — "Leadership Legacy"
// The final module of the 12-module track. Original content throughout,
// synthesizing Denis's own first-party material (Ministry Multiplication
// document, the Cameroon story), the Toolkit's Steve Jobs succession
// material and Legacy Statement exercise, and properly-attributed
// external material (Firestone, Maxwell's progression paraphrased
// rather than quoted, Paul/Timothy already used in Module 9 but given
// a new angle here).

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
const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const videoPlaceholder = (description) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${description}`);
const image = (spec) => callout("note", `[IMAGE PLACEHOLDER — pending generation] ${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });

// ─── SECTION 1 — What Remains ───────────────────────────────────────────────

const section1 = {
  section_number: 1,
  title: "What Remains",
  blocks: [
    heading(2, "Leadership Legacy"),
    paragraph("Module 12 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to the final module — why everything this track has built only matters in light of one question."),
    callout("info", "Who this is for: Every leader who completed Modules 1-11. This is the last module of the track, and it asks the question every previous one has been quietly building toward."),
    callout("info", "Core promise: By the end of this module, you'll have a real, checkable test for your own legacy, and a written statement of the specific one you're actually building."),
    callout("info", "Time commitment: Roughly 75-85 minutes of reading and reflection, plus assignment work."),
    divider(),
    heading(2, "What Remains"),
    paragraph("Eleven modules have built real capability — character, vision, trust, communication, service, coaching, feedback, and the practices that hold all of it together. None of them answer the one question that actually determines whether any of it mattered: what happens to all of it once you're no longer the one holding it up?"),
    paragraph("This isn't a morbid question, and it isn't really about death or retirement specifically. It's about a much more ordinary and immediate test: if you were unexpectedly unavailable next month — a new opportunity, an illness, simply moved on — would what you built keep standing, or would it need you specifically to continue existing?"),
    callout("warning", "Most leaders never ask this question directly, because the honest answer is uncomfortable. It's far more comfortable to stay indispensable, quietly, than to build something that could genuinely survive without you — even though indispensability is usually described as a compliment rather than what it actually is: a structural weakness with your name on it."),
    paragraph("This module is built around six ways of approaching that same underlying question, each from a different angle — a framework for the progression, a checkable test, real examples of leaders who took it seriously at very different scales, and a practical tool for actually writing down the answer rather than just thinking about it."),
    callout("tip", "None of what follows is abstract theory. Every section is anchored to something that actually happened — a decision someone genuinely made, at real cost, that either proved or failed this module's central claim."),
    image({
      type: "flat editorial illustration, muted navy/gold palette",
      content: "A single tree with roots visibly extending underground into several smaller young trees growing nearby, all connected by the same root system",
      width: 1200,
      height: 675
    }),
    paragraph("That image is worth sitting with before moving on. The original tree doesn't shrink by feeding the ones growing from its own roots. It's still standing, still whole — it's simply no longer the only tree in the picture, and the forest doesn't depend on it alone anymore."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Honestly: if you disappeared from your current role next month, what would actually collapse, and what would keep running?",
      ]
    ),
  ]
};

// ─── SECTION 2 — Achievement, Significance, Legacy ──────────────────────────

const section2 = {
  section_number: 2,
  title: "Achievement, Significance, Legacy",
  blocks: [
    heading(2, "Achievement, Significance, Legacy"),
    paragraph("Leadership development, followed all the way through, tends to move through three distinct stages, and it's worth naming them plainly because most leaders get comfortable at the first or second and never notice there's a third."),
    table(
      ["Stage", "What it actually is"],
      [
        ["Achievement", "What you can personally accomplish, using your own skill and effort"],
        ["Significance", "What you accomplish by developing other people who can then accomplish real things themselves"],
        ["Legacy", "What continues to happen after you, because you built something — capability, culture, people — that no longer depends on your presence"],
      ]
    ),
    paragraph("Most leaders spend an entire career moving between the first two stages, back and forth, without ever reaching the third — not because the third is impossible, but because it requires a specific kind of patience the first two don't. Achievement can be checked this quarter. Significance can be checked this year. Legacy often can't be checked at all until well after the leader who built it has moved on to something else, which is exactly why so few leaders ever prioritize it."),
    callout("tip", "Notice the progression isn't really about getting bigger. It's about getting less necessary, in the specific sense that matters: the work no longer requires you personally in order to keep happening well."),
    paragraph("This maps directly onto Module 5's levels, revisited one final time: Production is achievement. People Development is significance. Legacy is what's left once the people you developed have developed people of their own, several generations past anything you did personally. It's the same climb Module 5 described, carried out to its actual conclusion rather than stopping at the level most leaders consider the finish line."),
    paragraph("The clearest example of this third stage, taken to its full extreme, is one this track has returned to repeatedly from different angles: Jesus never wrote a book, never built a building, never held any formal office. He led for roughly three years, investing that time in twelve specific, ordinary people rather than managing crowds. He proved the depth of what he'd built by leaving — and what he'd built kept growing for two thousand years afterward, across every nation, without him personally present for any of it."),
    callout("scripture", "True leaders make themselves unnecessary. They measure greatness by what happens when they are gone — not by what they personally accomplish while they're still in the room."),
    paragraph("No leader in this track's examples reaches that specific scale, and that's not the point of including it. It's the outer boundary of what the progression actually makes possible — a reminder that the ceiling on legacy isn't set by circumstance or resources nearly as often as it's set by whether a leader ever seriously aimed at it."),
    paragraph("Most of this track lives in the first two stages, and that's appropriate — Modules 1 through 11 build the actual capability that makes achievement and significance possible at all. This final module exists because a track that stopped at significance would be leaving out the stage that actually determines whether anything survives the leader who built it."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Honestly locate yourself: are you currently operating mostly in achievement, significance, or legacy — and is that where you actually want to be?",
      ]
    ),
  ]
};

// ─── SECTION 3 — The Collapse Test ──────────────────────────────────────────

const section3 = {
  section_number: 3,
  title: "The Collapse Test",
  blocks: [
    heading(2, "The Collapse Test"),
    paragraph("There's a specific, checkable question worth asking honestly about anything you currently lead: what would happen to it if you left tomorrow? If the honest answer is that it would collapse, that's a real signal — not that you've failed, but that what you've built so far depends on your person rather than on systems, vision, and people who've genuinely been developed to carry it."),
    callout("warning", "This test has no partial credit. \"It would struggle for a while but recover\" is a meaningfully different answer from \"it would collapse entirely,\" and both are different from \"it would barely notice.\" Answer specifically, not generously toward yourself."),
    paragraph("This same test applies at any scale a leader operates at — a single team, a department, an entire organization, a family business, a ministry. The scale changes what collapsing actually looks like. The test itself doesn't change at all."),
    paragraph("Paul's instruction to Timothy, already covered in Module 9 from a coaching angle, is really the oldest known version of this same test, applied at the level of an entire movement rather than one relationship: what he'd taught Timothy was to be entrusted to people qualified to teach it themselves — a chain built explicitly to survive Paul's own absence, because it was never actually about Paul."),
    callout("tip", "Denis's own material on church multiplication makes the same point in blunter, more immediate language: a ministry that measures its success by attendance rather than by the number of leaders it has actually developed and released is optimizing for exactly the wrong number."),
    paragraph("Harvey Firestone, who built one of the twentieth century's major manufacturing companies, put the same standard in a single sentence worth sitting with directly: \"The growth and development of people is the highest calling of leadership.\" Not production. Not personal achievement. The people — because they're the only part of what a leader builds that can actually continue on its own."),
    table(
      ["Source", "Era", "Same conclusion, different words"],
      [
        ["Paul", "1st century", "Entrust it to people qualified to teach others also"],
        ["Firestone", "20th century", "The growth and development of people is the highest calling of leadership"],
        ["Denis's own material", "21st century", "A ministry measured by attendance rather than leaders developed is optimizing for the wrong number"],
      ]
    ),
    paragraph("Three sources, three eras, three completely different contexts — a first-century missionary, a twentieth-century industrialist, and a twenty-first-century ministry document — arriving at the identical conclusion independently. That convergence is itself worth taking seriously. This isn't a niche opinion about leadership. It's one of the few things nearly every serious tradition of leadership thought actually agrees on."),
    table(
      ["Answer", "What it actually signals"],
      [
        ["Collapse entirely", "Everything currently depends on you specifically — the most common answer, and the least comfortable to admit"],
        ["Struggle, then recover", "Real capability exists, but hasn't yet been fully entrusted to anyone else"],
        ["Barely notice", "You've actually done the work this module is asking for — rare, and worth naming honestly if it's true"],
      ]
    ),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Run the collapse test honestly on your current leadership. Which answer is actually true — collapse, struggle, or barely notice?",
      ]
    ),
  ]
};

// ─── SECTION 4 — When the Founder Leaves ────────────────────────────────────

const section4 = {
  section_number: 4,
  title: "When the Founder Leaves",
  blocks: [
    heading(2, "When the Founder Leaves"),
    paragraph("Steve Jobs built Apple twice — once as a young founder, and once again after returning in 1997 to a company that was months from bankruptcy. What's less often discussed is the deliberate work he did in his final years specifically to make sure the company wouldn't collapse without him a second time."),
    paragraph("Notice that phrase: a second time. Jobs had already personally lived through what happens when a company loses the person whose judgment it had come to depend on — he was forced out of Apple in 1985, and the company drifted under a series of other leaders for over a decade before nearly collapsing entirely, which is what brought him back in 1997. He had direct, personal knowledge of exactly what this module's collapse test looks like when it actually fails, even if the failure took years to fully show up."),
    paragraph("He established Apple University, an internal program built specifically to teach Apple's own decision-making culture to rising leaders — not just product knowledge, but the actual reasoning behind how the company made hard calls. He worked closely with Tim Cook for years before his death, in a real, sustained handoff rather than a sudden transition. The goal was explicit: a company whose culture and judgment didn't live only in one person's head."),
    callout("tip", "Notice what this required Jobs to accept, given his own well-documented intensity and control over every detail of the company: genuinely letting go, in specific, bounded ways, long before he had to. Building something that survives you usually requires releasing real control while you're still capable of holding onto it — which is exactly the moment it feels least necessary to do."),
    paragraph("Apple's continued success in the years after his death in 2011 is itself part of the evidence, and the actual numbers are worth stating plainly rather than left vague. Apple's market value stood at roughly $350 billion when Jobs died. It crossed $3 trillion a little over a decade later — meaning the overwhelming majority of the value Apple has ever created happened after the person most associated with its genius was no longer there to create it. A company built entirely around one irreplaceable person doesn't usually survive that person's departure intact, let alone grow nearly tenfold. Apple, imperfectly and with real debate about whether it changed too much or too little, didn't just survive — it kept building, which is closer to what Jobs was actually trying to leave behind in his final years than any single product."),
    callout("tip", "It's worth being precise about what this evidence actually proves and doesn't. It doesn't prove Jobs was unimportant, or that any leader's absence automatically produces growth. It proves that the specific, deliberate work of building capability into other people — rather than keeping it locked in one person's judgment — is what allowed Apple's growth to continue at all."),
    callout("warning", "Worth naming honestly: this required Jobs to accept, at the height of his own influence, that his personal judgment would eventually stop being the thing holding the company together. Most leaders never reach that level of influence in the first place. Fewer still voluntarily start planning for its absence while they still have it."),
    paragraph("Jobs is a single, famous case. It's worth checking whether the same pattern holds more broadly, across leaders whose names most people wouldn't recognize."),
    paragraph("Leadership researcher Roselinde Torres spent twenty-five years directly observing leaders in the room where real decisions get made, and distilled what separated the genuinely great ones into three specific questions, all of them oriented toward what happens after the present moment rather than during it."),
    videoEmbed("aUYSDEYdmzw", "What It Takes to Be a Great Leader | Roselinde Torres | TED"),
    paragraph("Her other two questions are worth naming alongside the third: how diverse is your network of relationships, genuinely, not just in appearance — and where are you personally looking to anticipate the next significant change before it's already obvious to everyone else? Neither question is about the leader's own skill. Both are about whether the leader has built the kind of relationships and attention that will keep working after the leader's own view of the world stops being current."),
    paragraph("One of her three questions is worth pulling out directly, because it's the same question Jobs answered with Apple University and the multi-year handoff to Cook: are you willing to abandon a practice that made you successful, in favor of something that hasn't been proven yet? Most leaders can name what made them successful. Far fewer are willing to let go of it deliberately, on their own timeline, before they're forced to."),
    callout("tip", "Notice that this isn't really a question about strategy. It's a question about identity — whether a leader's sense of who they are is tied to the specific way they've always done things, or to the actual outcome they're trying to build. Only one of those two allows for genuine change."),
    paragraph("Neither Jobs nor Torres's research subjects made this change all at once. Both describe it as a sustained practice — years, not a single decision — which matches everything else this module has been arguing. Legacy isn't a decision made once at the end of a career. It's a habit practiced, imperfectly, for as long as the career lasts."),
    callout("tip", "This section's two examples span a company most people have used and a body of research most people have never heard of. The scale of recognition isn't what makes an example worth including. Whether it's real and independently verifiable is."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "What's one piece of control or knowledge you're currently holding onto that you could start deliberately transferring now, while it's still your choice rather than an emergency?",
      ]
    ),
  ]
};

// ─── SECTION 5 — A Decision Made in Advance ─────────────────────────────────

const section5 = {
  section_number: 5,
  title: "A Decision Made in Advance",
  blocks: [
    heading(2, "A Decision Made in Advance"),
    paragraph("Years into a stable, established life and career, Denis made a decision that looked, from the outside, like giving something up rather than building toward anything: moving his family from the United States to Cameroon to plant churches and build Bible schools. It cost real comfort, real security, and required real courage to actually go through with."),
    callout("tip", "The decision wasn't really about relocation. It was a legacy decision made years before the word would have applied — choosing to build something in a place and among people who needed it, rather than staying somewhere the outcome was already comfortable and secure."),
    paragraph("Every leader reading this has their own version of that decision available, at whatever scale actually fits their situation. It rarely announces itself as a legacy decision in the moment. It usually just looks like choosing the harder, less secure option because building something that outlasts you requires it."),
    paragraph("It's worth naming honestly that this decision doesn't always work out the way it's hoped, and that uncertainty is part of what makes it a genuine legacy decision rather than a safe bet dressed up as one. What makes it worth making isn't a guaranteed outcome. It's that staying safe guarantees nothing gets built at all."),
    callout("tip", "The scale of the decision matters less than whether it's actually made. A legacy decision isn't defined by how dramatic it looks from the outside — moving continents, in Denis's case — but by whether it was chosen specifically because it would build something that outlasts the person choosing it."),
    paragraph("This is the piece a framework can never fully capture: legacy isn't only built through the systematic work of Sections 2 through 6. It's also built through a handful of specific, harder-than-necessary choices, made at real personal cost, that a spreadsheet would never recommend and a five-part structure can't quite reduce to a checklist."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Is there a decision in front of you right now that you've been avoiding specifically because the secure option is more comfortable than the one that would actually build something lasting?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Writing Your Legacy Statement ──────────────────────────────

const section6 = {
  section_number: 6,
  title: "Writing Your Legacy Statement",
  blocks: [
    heading(2, "Writing Your Legacy Statement"),
    paragraph("A legacy that's never been named specifically tends to stay accidental — whatever happens to accumulate, rather than what was actually intended. A legacy statement is a short, specific, written answer to what you actually want to remain, built now rather than assembled retroactively by whoever's left to describe it."),
    table(
      ["Part", "What it actually asks"],
      [
        ["Statement", "In one or two sentences, what do you want said about your leadership in twenty years?"],
        ["Who", "Specific people, not a category — who are you actually developing to carry this forward?"],
        ["What's transferring", "The specific skills, values, or authority you're actually handing over, not just hoping they absorb"],
        ["What must change", "What in how you currently lead has to change for the legacy to actually outlast you"],
        ["90-day commitment", "What you're doing right now, concretely, in the next three months — not someday"],
      ]
    ),
    callout("warning", "A legacy statement that only describes what you hope happens isn't actually a legacy statement — it's a wish. The \"what must change\" and \"90-day commitment\" parts are what make it real, because they force the honest question of whether you're actually doing anything yet, or just hoping the legacy assembles itself eventually."),
    paragraph("A worked example, at real scale rather than abstract: \"I want to develop three specific leaders currently on my team who can each run this program without me, starting with weekly one-on-ones focused specifically on decision-making rather than task updates.\" That's short, specific, and immediately checkable — anyone reading it could tell you in three months whether it actually happened."),
    paragraph("Notice that the five parts of this structure map directly onto the rest of the module. The statement is Section 2's achievement-significance-legacy progression, compressed into one sentence. Who and what's transferring are the collapse test from Section 3, made concrete. What must change is Jobs' and Torres's willingness to abandon what already worked, from Section 4. The 90-day commitment is Denis's own decision from Section 5, scaled down to something achievable this quarter rather than requiring a move across continents."),
    table(
      ["A wish", "A legacy statement"],
      [
        ["\"I want to leave a lasting impact.\"", "\"I want to develop three named leaders who can run this without me.\""],
        ["No timeline", "Starting this week, checkable in three months"],
        ["Nobody could tell you whether it happened", "Anyone reading it could verify it later"],
      ]
    ),
    paragraph("This distinction matters more at the end of a track than anywhere else in it. Eleven modules of genuine capability can still produce a leader who never writes any of this down — who intends well, thinks about it occasionally, and never actually commits anything to paper that someone else could hold them to."),
    paragraph("In 1888, Alfred Nobel opened a French newspaper and found his own obituary. A reporting error had confused him with his brother, who had actually died, and the notice described Nobel's life's work — the invention of dynamite — in unflattering terms he hadn't chosen and couldn't yet correct. Seven years later, he signed a will directing the overwhelming majority of his fortune toward prizes recognizing work that benefited humanity, rather than leaving his estate to accumulate under his existing reputation. The Nobel Prizes exist because a man was given the rare, uncomfortable experience of reading what his legacy currently looked like — while he still had time left to change it."),
    callout("tip", "Most leaders never get that specific jolt. This module is, in effect, offering it anyway: the chance to read your own likely legacy honestly, in writing, while there's still real time to change what it actually says."),
    paragraph("This is worth returning to Section 3's collapse test directly: the honest measure was never how large the legacy statement sounds. It's whether the ministry, the team, the organization would collapse or continue if the leader who wrote it disappeared tomorrow. A legacy statement that passes that test is real. One that only sounds impressive isn't."),
    callout("tip", "Write it today, imperfectly, rather than waiting for a version that feels finished. A rough legacy statement you actually act on beats a polished one that stays in a drawer."),
    paragraph("This is the last real tool this track hands you. Everything after it is the actual work — the same work every real example in this module was doing, one ordinary decision at a time, long before anyone thought to call it a legacy."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Draft one honest sentence right now: \"I want to be remembered for developing ___, so that ___ can continue after me.\"",
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
    paragraph("Twelve modules end here. Character that holds up in the dark. A vision worth following. The levels and laws that determine how far influence actually reaches. Trust built through ordinary, costly consistency. Communication that actually lands. Service that inverts the usual order of who exists for whom. Coaching that multiplies rather than just produces. Feedback that names what's true, on time. Challenge and celebration, held together rather than traded off. And now, the question every one of the previous eleven modules was quietly building toward."),
    paragraph("If this were only a list of skills, it would end here with a summary. It isn't. Every module in this track built toward a single underlying claim: leadership that stays centered on the leader eventually fails everyone it was supposed to serve, and leadership that genuinely serves outlasts the leader who practiced it."),
    pullQuote("When your leadership season is over, who will be better because you were there?"),
    paragraph("That question doesn't have a single right answer, and it isn't meant to be answered once and filed away. It's meant to be asked again, honestly, at every stage of whatever you lead next — because the answer changes as you do, and the only real failure is never asking it at all."),
    paragraph("Every real person in this track's twelve modules shared one thing in common, whatever their era or field: none of them built something that mattered by staying focused on themselves. Feuerstein's ninety days of payroll, Semler's shared salaries, Wooden's decades of mentees, Ash's public recognition, Hastings' willingness to cannibalize his own success, Torres's willingness to abandon what already worked, a first-century movement built explicitly to survive its founder's absence — every one of them points the same direction this closing question points. Away from the leader. Toward what the leader leaves behind."),
    callout("tip", "Different scales, different centuries, different languages entirely — the same direction, every single time. That consistency across everything this track has covered is itself the strongest evidence for the module's own central claim."),
    paragraph("None of them got there by accident, and none of them arrived instantly. Every real example across all twelve modules of this track took years, involved real setbacks, and required the same basic discipline: choosing, repeatedly, to build something bigger than themselves rather than something that simply depended on them."),
    paragraph("Nobel read his own obituary and had seven years left to change what it said. Most leaders don't get that specific warning. This module, and the twelve-week track it closes, is the closest thing most of us will get — a chance to look honestly at what's actually being built, while there's still real time left to change it."),
    videoPlaceholder("3-4 min closing from Denis — his own honest answer to the closing question, and what he's still working to make more true."),
    divider(),
    heading(3, "Before the Final Assignment"),
    paragraph("This scorecard is the last one in the track. Nobody sees it but you, and it isn't meant to produce a comfortable number — it's meant to give you an honest, specific place to actually start."),
    callout("info", "If you've completed the scorecards in earlier modules, this is worth comparing against them directly. Growth across a track like this rarely announces itself. It usually only becomes visible when you actually stop and check the record against where you started."),
    callout("info", "This closes the track. Whatever you build from here is no longer a lesson — it's the actual leadership this whole track was preparing you to practice."),
    scorecard("Legacy Self-Audit", "module12_legacy", [
      { key: "collapse", label: "The Collapse Test — what I lead would survive my absence", max: 10, helpText: "Honestly: collapse, struggle, or barely notice?" },
      { key: "developing", label: "Developing Others — I can name specific people I'm preparing to carry this forward", max: 10, helpText: "Name them. If you can't, that's the honest score." },
      { key: "releasing", label: "Releasing Control — I'm actively transferring real authority, not just tasks", max: 10, helpText: "What have you actually released in the last month?" },
      { key: "named", label: "Named Intention — I have a specific, written answer for what I want to remain", max: 10, helpText: "Have you actually written it down, or only thought about it?" },
    ]),
    assignmentPrompt(
      "Week 12 Assignment — Final Assignment of the Track",
      "This is the final assignment of the leadership track. It asks you to write your actual legacy statement, run the collapse test honestly, and commit to one concrete action.",
      [
        {
          number: 1,
          heading: "Run the Collapse Test",
          guidance: "Honestly, in writing: what would happen to what you currently lead if you were unexpectedly unavailable starting tomorrow? Collapse, struggle, or barely notice — and why?"
        },
        {
          number: 2,
          heading: "Write Your Legacy Statement",
          guidance: "Using Section 6's five-part structure — statement, who, what's transferring, what must change, 90-day commitment — write your actual legacy statement. Be specific. Name real people if you can."
        },
        {
          number: 3,
          heading: "Name One Transfer",
          guidance: "Name one specific piece of authority, knowledge, or control you will deliberately transfer to someone else in the next 30 days — not someday, this month."
        },
        {
          number: 4,
          heading: "Look Back Across the Track",
          guidance: "Of the eleven modules before this one, which single idea has actually changed how you lead the most? Be specific about what changed and how you know."
        },
        {
          number: 5,
          heading: "Answer the Closing Question",
          guidance: "In your own words, right now, honestly: when your leadership season is over, who will be better because you were there?"
        }
      ],
      250,
      900
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7];

const module12 = {
  module_number: 12,
  title: "Leadership Legacy",
  subtitle: "What Remains When You're No Longer in the Room",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 85,
  cover_image_alt: "A tree with roots extending into several smaller young trees, all connected",
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

console.log(`Module 12 — "${module12.title}"`);
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
console.log(`Scorecard blocks: ${flat.filter(b=>b.type==="scorecard").length}`);
console.log(`Pending images: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[IMAGE PLACEHOLDER")).length}`);
console.log(`Pending videos: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[VIDEO PLACEHOLDER")).length}`);

fs.writeFileSync('module12_leadership.json', JSON.stringify(module12, null, 2));
console.log(`\nWritten to module12_leadership.json`);
