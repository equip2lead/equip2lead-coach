// Module 11 — "Challenge and Celebrate"
// Focused reframe of Kouzes & Posner's Five Practices: three practices
// (Model the Way, Inspire a Shared Vision, Enable Others to Act) are
// already substantively covered by Modules 2, 4, and 6 — this module
// covers the two genuinely new ones in depth, with the other three as
// brief callbacks, then synthesizes all five.

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
// Same conditional shape as Modules 2-5: a spec with a url emits a real image
// block, one without still emits the [IMAGE PLACEHOLDER] callout. Folding a
// finished image in is a two-line change at the call site.
const image = (spec) =>
  spec.url
    ? { type: "image", data: { url: spec.url, alt: spec.alt } }
    : callout("note", `[IMAGE PLACEHOLDER — pending generation] ${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });

// ─── SECTION 1 — Five Practices, Three Already Yours ────────────────────────

const section1 = {
  section_number: 1,
  title: "Five Practices, Three Already Yours",
  blocks: [
    heading(2, "Challenge and Celebrate"),
    paragraph("Module 11 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 11 — the two practices this track hasn't given you yet, and why they've been saved for last."),
    callout("info", "Who this is for: Every leader who completed Modules 1-10."),
    callout("info", "Core promise: By the end of this module, you'll have two practices this track hasn't covered yet, and a complete picture of how all five fit together."),
    callout("info", "Time commitment: Roughly 70-80 minutes of reading and reflection, plus assignment work."),
    divider(),
    heading(2, "Five Practices, Three Already Yours"),
    paragraph("Leadership researchers James Kouzes and Barry Posner, already cited three separate times in this track, identified five practices that show up consistently in leaders their research participants described as genuinely exemplary. Rather than introduce all five as if this were the first time you'd encountered any of them, it's worth being honest about what's already happened: three of the five have been the actual subject of entire modules already, under this track's own vocabulary rather than theirs."),
    paragraph("The research behind this isn't a single survey. Kouzes and Posner began asking one question in 1983 — what were you actually doing as a leader on the day you performed at your personal best? — and kept asking it for more than three decades, across thousands of interviews and roughly 75,000 written responses. One specific finding from that body of research is worth sitting with directly: teams led by people who frequently practice all five showed engagement levels reported as high as 22.8 times greater than teams led by people who rarely did. Not a small edge. A different category of team entirely."),
    callout("tip", "Notice what the research question itself assumes: that leadership at its best is a describable pattern of specific behaviors, not an innate trait some people simply have. Thirty years of data answering \"what were you actually doing\" rather than \"what kind of person are you\" is itself a quiet argument that leadership is built, not born — the same argument this entire track has been making from Module 1 onward."),
    paragraph("Kouzes and Posner put the same point directly: \"Leadership is an observable set of skills and abilities. Leadership is everyone's business.\" They also made a claim worth connecting straight back to Module 2 — that learning to lead is really about discovering what you actually value, and that nobody leads others well until they've first led themselves through a genuine struggle with competing values."),
    table(
      ["Practice", "Where it already lives in this track"],
      [
        ["Model the Way", "Module 2 — Character in the Dark"],
        ["Inspire a Shared Vision", "Module 4 — Vision & Strategic Direction, in full"],
        ["Enable Others to Act", "Module 6 — the Semco case study, at length"],
        ["Challenge the Process", "Not yet covered — this module, Section 2"],
        ["Encourage the Heart", "Not yet covered — this module, Section 3"],
      ]
    ),
    callout("tip", "This isn't a coincidence, and it isn't padding to say so. Kouzes and Posner's research and this track's own architecture converged independently on much of the same territory — which is itself a form of confirmation. The two gaps are where this module actually needs to do new work."),
    paragraph("It's worth naming honestly why a module built this way still deserves its own place in the track, rather than folding into an appendix. Challenging the process and encouraging the heart aren't smaller versions of Modules 2, 4, and 6. They're genuinely distinct disciplines, and the fact that three of five practices overlap with earlier material doesn't make the remaining two any less real."),
    callout("tip", "One more honest note before moving on: this track built toward Kouzes and Posner's five practices without setting out to copy them. That two independent efforts — thirty years of academic research and this track's own architecture — landed in nearly the same place is itself a form of evidence that these five things actually matter, not just that one influenced the other."),
    paragraph("With the overlap named plainly and the research grounding established, the rest of this module does its actual work: two practices, two real examples, and then all five brought back together at the end."),
    image({
      url: "/images/module-11/M11-1.png",
      alt: "Five dial gauges mounted in a row on a single panel, three turned fully up, two still reading low.",
      type: "flat editorial illustration, muted navy/gold palette",
      content: "Five simple dial gauges mounted in a row on a single panel, three already turned fully up, two still turned low",
      width: 1200,
      height: 675
    }),
    paragraph("This module could have pretended the other three were new material, padding out the familiar shape every other module has followed. Instead it names the overlap honestly and spends its actual effort on the two dials that genuinely still need turning up."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Before reading further: which of the five practices do you suspect is your weakest, and why haven't you already done something about it?",
      ]
    ),
  ]
};

// ─── SECTION 2 — Challenge the Process ──────────────────────────────────────

const section2 = {
  section_number: 2,
  title: "Challenge the Process",
  blocks: [
    heading(2, "Challenge the Process"),
    paragraph("Kouzes and Posner's research found that exemplary leaders actively search out opportunities to change, grow, innovate, and improve — and that they treat setbacks as learning opportunities rather than reasons to retreat to what already worked. This is a genuinely different posture from simply being open to change when it's forced on you. It's initiating the search for a better way before anything has actually broken."),
    paragraph("Kouzes and Posner break this practice into two specific commitments, and it helps to keep them separate. The first is to search for opportunities: actively looking beyond your own routine for ways to grow, innovate, and improve. The second is to experiment and take risks: generating small wins, and treating mistakes as learning rather than as evidence to hide."),
    table(
      ["Commitment", "What it looks like in practice"],
      [
        ["Search for opportunities", "Asking what could be better before anything is broken, and looking outside your own team and industry for ideas"],
        ["Experiment and take risks", "Running small, survivable tests, and discussing openly what was learned from an attempt that didn't work"],
      ]
    ),
    heading(3, "A Different Way of Working"),
    paragraph("Modern software teams developed a specific philosophy for this, worth borrowing even for leaders who will never write a line of code. Agile methodology rests on a short list of commitments that amount to a practical version of challenging the process."),
    table(
      ["Commitment", "What it actually means"],
      [
        ["Modeling a learning culture", "Treating what didn't work as information, not failure to be hidden"],
        ["People over process", "A process exists to serve the people using it — when it stops doing that, change the process, not the people"],
        ["Responding to change", "Planning is useful; rigid adherence to the plan once reality has changed is not"],
        ["Comfort with uncertainty", "Waiting for full certainty before acting is itself a decision — usually the wrong one"],
      ]
    ),
    callout("tip", "Four practical team habits make these commitments real rather than aspirational: simplicity (do the smallest thing that actually works), communication (make problems visible early, not after they've compounded), respect (disagreement is data, not disloyalty), and courage (say the uncomfortable thing before it becomes an emergency)."),
    paragraph("These four habits sound reasonable in the abstract. What they actually require in practice is a specific, uncomfortable willingness: questioning something that's currently working, before it's forced on you by circumstance. That's a genuinely different posture than problem-solving, and the clearest real example of it operates at a scale most leaders never face directly."),
    heading(3, "Challenging Your Own Success"),
    paragraph("The hardest version of this practice isn't challenging a process that's already failing. It's challenging one that's still working. In 2007, Netflix's DVD-by-mail business was profitable and still growing — there was no crisis forcing a change, no customer demanding one. Reed Hastings launched a streaming service anyway, deliberately cannibalizing the business that was making the company money, because he believed physical media's future was limited even though nothing in the present numbers said so yet."),
    paragraph("The pivot wasn't smooth. In 2011, an attempt to formally split the DVD and streaming businesses into separate services — remembered as the Qwikster episode — badly misjudged how customers would react, and the company lost a significant share of its stock value and a real number of subscribers within months. Hastings didn't retreat back to the safer, still-profitable DVD model. He kept pushing toward streaming, publicly acknowledging the stumble rather than hiding it, and the company recovered to define the entire industry that came after it."),
    callout("warning", "Worth being honest about the risk here, not just the triumphant ending: this kind of challenge can fail. Netflix's own leadership has described the transition as genuinely frightening in the moment, with real periods where the company's survival was in doubt. Challenging a working process isn't a guaranteed win dressed up as a virtue — it's a real risk, taken because the alternative risk, standing still while the ground shifts, was judged to be worse."),
    videoEmbed("IrGkeGExJfw", "Co-CEO Reed Hastings on Netflix's Culture | WeAreNetflix Podcast"),
    paragraph("Hastings describes the actual mechanism in his own words in this conversation, not the streaming pivot specifically but the underlying discipline that made pivots like it survivable: a culture built to surface disagreement early rather than let it stay quiet until a decision is already locked in. Challenging the process, in his account, isn't a single bold decision — it's an ongoing habit of the whole organization, built long before any specific challenge shows up."),
    callout("tip", "This connects directly to Module 10's whole argument: a culture that surfaces disagreement early is really a culture that's already practicing the hard feedback conversation, at scale, before any single conversation becomes urgent."),
    paragraph("Organizational psychologist Adam Grant studies the other side of the same discipline: what people who consistently produce genuinely new ideas actually do differently. His TED talk opens with a story against himself. A student asked him to invest in a start-up that he and three friends were about to launch, and Grant declined. The founders had lined up backup jobs, and the day before launch the company still had no functioning website, which mattered because the entire business was a website. The company was Warby Parker, and Grant spends the rest of the talk explaining why he was so wrong."),
    videoEmbed("fxbCHn6gE3U", "The Surprising Habits of Original Thinkers | Adam Grant | TED"),
    paragraph("His central finding cuts against the romantic picture of the lone visionary. Original thinkers, in his research, aren't braver or more certain than everyone else. Behind the scenes they feel the same fear and doubt, and they manage it differently. Grant separates two kinds of doubt: self-doubt is paralyzing and makes you freeze, while idea doubt is energizing because it pushes you to test, experiment, and refine. Originals also produce far more attempts, which is why the greatest originals turn out to be the people who fail most often. For a leader, the implication is practical. An organization that punishes every failed experiment is quietly ensuring it will produce very few original ones, and a team that treats doubt about an idea as a reason to test it, rather than a reason to stay silent, has something useful to do with its uncertainty."),
    callout("warning", "Hold this honestly against the Qwikster stumble earlier in this section. The lesson isn't to stop experimenting after a failure, and it isn't to bet everything on one experiment either. It's to keep the cost of any single failed attempt low enough that trying again stays possible."),
    paragraph("Notice how much of this echoes earlier modules under different names. Module 6's accountability content and this module's \"people over process\" are close cousins. Module 10's insistence on naming a problem early rather than late is exactly what \"communication\" here is asking for. Challenging the process was never actually a new skill — it's several skills this track has already built, aimed specifically at the status quo rather than at an individual conversation."),
    callout("tip", "A useful diagnostic for your own leadership: name one thing your team does that would genuinely surprise a smart outsider seeing it for the first time — not because it's bad, but because there's no real reason for it beyond \"that's how we've always done it.\" That's usually where challenging the process should actually start."),
    paragraph("Start small. Neither Netflix's pivot nor an agile team's daily habits began at full scale — both started as a single experiment, tested before it became a company-wide commitment. Challenging the process doesn't require betting the whole organization on the first attempt."),
    heading(3, "Three Questions Before You Change Anything"),
    paragraph("Challenging a process isn't the same as replacing it. Before changing anything, three questions keep the challenge useful rather than reckless."),
    table(
      ["Question", "What it protects you from"],
      [
        ["Why do we actually do it this way?", "Discarding something that exists for a real reason you've forgotten"],
        ["If we were starting today, would we build it this way?", "Defending a process purely because it's familiar"],
        ["What's the smallest test that would tell us?", "Betting the whole team on an untested idea"],
      ]
    ),
    callout("tip", "The second question is the one leaders skip most often, because it requires pretending the current process doesn't already exist. It's also the question that most reliably separates a process that earns its place from one that's merely inherited."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Name one process or habit in your own leadership that exists purely because \"it's always been done that way.\" What would it actually cost to question it?",
      ]
    ),
  ]
};

// ─── SECTION 3 — Encourage the Heart ────────────────────────────────────────

const section3 = {
  section_number: 3,
  title: "Encourage the Heart",
  blocks: [
    heading(2, "Encourage the Heart"),
    paragraph("The fifth practice is the one leaders most often treat as optional — a nice-to-have once the real work is done, rather than a real discipline in its own right. Kouzes and Posner's research says the opposite: genuine, specific recognition is one of the most reliable predictors of sustained effort, because people who feel truly seen for real contributions keep contributing at a level people who feel merely used do not."),
    paragraph("Mary Kay Ash built an entire company, starting in 1963 with five thousand dollars, around exactly this practice as a deliberate strategy rather than a personality quirk. She personally crowned top performers as \"Queens of Seminar\" on stage, in front of the whole company, with genuine ceremony — kissing their hands, placing roses in their laps. The company's top sellers earned a specific, unmistakable status symbol: a pink Cadillac, awarded publicly, that told everyone who saw it on the road exactly what its driver had accomplished."),
    paragraph("A Harvard Business School professor who studied her methods called her \"an opportunity-generating machine,\" and one thing he noted specifically is worth sitting with: her recognition system explicitly rewarded people regardless of their starting position. Women who had never led anything more demanding than a household ended up managing thousands of people, because the recognition ladder was built on actual results, not credentials or seniority."),
    callout("tip", "One observation about her methods is worth sitting with directly: effective recognition, on this analysis, has to be public, specific, frequent, and tangible to actually work — a private, generic \"good job\" doesn't do what a public, specific ceremony does, even when the underlying accomplishment is identical."),
    paragraph("This wasn't only about grand annual ceremonies. Ash was also known for something much smaller and more frequent: handwritten personal notes to individual performers, and a habit — reported directly by former employees — of giving her full, genuine attention to whoever she was speaking with, regardless of their position in the company, as though they were the only person in the room."),
    callout("tip", "Notice the pairing: the grand public ceremony and the small private note aren't competing approaches. They're the same practice at two different scales, and Ash apparently never treated the smaller one as optional just because the larger one existed."),
    paragraph("This is where most leaders quietly fail — not at the grand gesture, which is rare enough that it's easy to plan for and do well once, but at the small, frequent version, which requires noticing real contributions often enough that noticing itself becomes a habit rather than an occasional event."),
    callout("warning", "Worth distinguishing clearly: this isn't flattery, and it isn't a participation trophy. The recognition Ash built her culture around was specifically tied to real accomplishment, publicly verified — the Cadillac wasn't given for showing up, it was earned by outselling everyone else in a specific, measurable way. Generic praise and genuine recognition aren't the same practice, and only one of them actually works."),
    paragraph("Most leaders default to private, generic recognition specifically because it's easier — a quick private word costs almost nothing, while a genuine public ceremony requires real planning and a willingness to make a fuss over someone else's success in front of everyone. Ash's whole company was built on the bet that the harder version was worth the cost. The evidence, decades later, suggests she was right."),
    table(
      ["Generic praise", "Genuine recognition"],
      [
        ["\"Great job this quarter, everyone.\"", "\"You personally closed the deal that kept us afloat in March.\""],
        ["Said once, in passing", "Said specifically, in front of people who matter to the recipient"],
        ["Costs nothing", "Costs real planning and real attention"],
      ]
    ),
    paragraph("None of this requires a company big enough to give out cars. The pink Cadillac was Ash's specific version at her specific scale. Every leader has their own version available — a public mention in the right meeting, a specific note copied to the right people, a moment set aside deliberately rather than squeezed into a hallway. The scale changes. The discipline of doing it specifically and publicly doesn't."),
    callout("tip", "A practical starting point: pick the next team meeting on your calendar, and plan one specific, genuine recognition into it in advance, rather than hoping a natural moment for it comes up organically. It usually doesn't, unless someone actually plans for it."),
    paragraph("The research on recognition is unusually consistent, and unusually ignored. Behavioral economist Dan Ariely built a well-known TED talk around experiments on what actually drives effort at work. His conclusion is that pay alone doesn't do it: people work hardest when they feel they're making progress and that the work matters to someone."),
    videoEmbed("5aH2Ppjpcho", "What Makes Us Feel Good About Our Work? | Dan Ariely | TED"),
    paragraph("Gallup's recognition research, conducted with Workhuman, puts numbers on what Mary Kay Ash acted on by instinct. Across data collected from 2022 to 2024, only about 22 percent of employees said they get the right amount of recognition for their work — and the figure didn't improve over those years, even as senior leaders became far more likely to say recognition matters. Leaders say they believe in it. Their teams aren't feeling it."),
    callout("tip", "The same research, which followed nearly 3,500 employees from 2022 to 2024, found that quality matters, not just quantity. Well-recognized employees were 45 percent less likely to have changed organizations two years later. Employees whose recognition met at least four of Gallup's five pillars of strategic recognition were 65 percent less likely to be actively looking or watching for another job, and far more likely to be engaged: 90 percent, compared with 10 percent among employees whose recognition met none of the pillars."),
    paragraph("Separately, Gallup's engagement guidance boils effective recognition down to three attributes, and they match the distinction this section has been drawing between generic praise and the real thing: it has to feel authentic, it has to name the value of the work and the person doing it, and it has to connect to what actually matters to that individual."),
    paragraph("Kouzes and Posner also break this practice into two commitments. The first is to recognize individual contributions by showing appreciation for excellence. The second is to celebrate the values and victories of the whole group by building a genuine spirit of community. One is about the individual. The other is about what the team collectively chooses to honor, which quietly tells everyone what actually counts here."),
    heading(3, "Where Recognition Goes Wrong"),
    table(
      ["Common failure", "Why it backfires"],
      [
        ["Recognizing only the same few people", "Everyone else concludes that effort in their role goes unseen"],
        ["Recognizing only final results", "Quiet, essential work, and the people doing it, never gets named"],
        ["Waiting for a formal occasion", "The moment that mattered has passed by the time anyone mentions it"],
        ["Recognition that flatters the leader", "People can tell when praise is really about the person giving it"],
      ]
    ),
    callout("warning", "None of these failures come from bad intentions. They come from treating recognition as an occasional event instead of a habit, which is the same gap Gallup's data shows: leaders say they value recognition, and employees still aren't feeling it."),
    image({
      url: "/images/module-11/M11-2.png",
      alt: "A handwritten thank-you note pinned to a corkboard beside a small gold trophy in warm light.",
      type: "flat editorial illustration, warm gold and navy palette",
      content: "A single handwritten thank-you note pinned to a corkboard beside a small gold trophy, soft warm light, no faces — recognition at two scales, the personal note and the public award",
      width: 1200,
      height: 675
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of the last genuine accomplishment on your team. Was it recognized specifically and publicly, or did it pass by with a generic acknowledgment — or none at all?",
      ]
    ),
  ]
};

// ─── SECTION 4 — All Five, Together ─────────────────────────────────────────

const section4 = {
  section_number: 4,
  title: "All Five, Together",
  blocks: [
    heading(2, "All Five, Together"),
    paragraph("With all five practices now covered somewhere in this track, it's worth seeing them side by side rather than scattered across ten modules — because exemplary leadership, in Kouzes and Posner's own research, was never any single one of these practiced well. It was a leader who was at least reasonably strong across all five, since weakness in any one tends to undermine the others."),
    table(
      ["Practice", "This track's version", "Where"],
      [
        ["Model the Way", "Character that holds up when nobody's watching", "Module 2"],
        ["Inspire a Shared Vision", "A vision worth following, communicated clearly", "Module 4"],
        ["Challenge the Process", "Actively searching for a better way before anything breaks", "Module 11"],
        ["Enable Others to Act", "Real power shared, not tasks delegated", "Module 6"],
        ["Encourage the Heart", "Specific, public, genuine recognition", "Module 11"],
      ]
    ),
    paragraph("Reading this table left to right, a rough order emerges too, even though Kouzes and Posner never presented it as a strict sequence: character comes first, because nothing else holds without it. Vision gives character a direction. Challenging the process and enabling others to act are how the vision actually moves. Encouraging the heart is what makes the whole thing sustainable long enough to matter — the practice most likely to get quietly dropped once the other four are already demanding real attention."),
    heading(3, "Reading the Dials"),
    table(
      ["Practice", "When it's strong", "When it's neglected"],
      [
        ["Model the Way", "People can predict how you'll behave under pressure", "Your stated values and your actual choices have quietly drifted apart"],
        ["Inspire a Shared Vision", "Team members describe where you're headed in their own words", "Everyone is busy and no one can say what it's all for"],
        ["Challenge the Process", "Small experiments are routine, and failures get discussed openly", "\"We've always done it this way\" goes unquestioned for years"],
        ["Enable Others to Act", "Decisions get made below you, and you find out afterward", "Everything routes through you and moves at your speed"],
        ["Encourage the Heart", "People can name the last time their work was specifically recognized", "Good work passes without comment, and people wonder whether anyone noticed"],
      ]
    ),
    paragraph("Most leaders, reading a table like this honestly, recognize themselves in the right-hand column of at least one row. That isn't a verdict. It's the most useful piece of information in the module: a specific place to start."),
    callout("tip", "A leader strong in vision and character but weak in recognition will eventually burn out a talented team that never feels seen. A leader strong in recognition but weak in challenging the process will run a happy team quietly falling behind. The five practices aren't a checklist to complete once — they're five dials that all need to stay turned up at the same time."),
    paragraph("Notice, too, that Hastings and Ash represent opposite ends of this module's own two practices, and neither one alone would have been enough. A leader who only challenged the process, the way Hastings did, without ever genuinely celebrating people the way Ash did, would burn through talented teams even while making the right strategic calls. A leader who only celebrated people without ever challenging anything would run a beloved, slowly obsolete organization. The five practices need each other precisely because none of them, alone, produces what all five together actually build."),
    callout("info", "The scorecard in the closing section scores all five together, not just the two new ones — worth running honestly rather than skipping straight to the practices this module just covered."),
    paragraph("This is also the natural point in the track to look back rather than just forward. Eleven modules in, the honest question isn't whether you've mastered any single practice — almost no one does, permanently. It's whether all five are currently getting real, ongoing attention, or whether one or two have quietly been neglected while the others got easier to focus on."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Looking at all five together: which is genuinely your strongest, and which have you been quietly avoiding because it doesn't come naturally?",
      ]
    ),
  ]
};

// ─── SECTION 5 — Closing & Assignment ───────────────────────────────────────

const section5 = {
  section_number: 5,
  title: "Closing & Assignment",
  blocks: [
    heading(2, "Closing & Assignment"),
    paragraph("This module didn't introduce a new theory of leadership. It closed out a research framework this track had already been building toward from a different direction, and gave you the two practices — challenging the process, and genuinely celebrating people — that hadn't been named directly yet."),
    paragraph("Hastings never stopped questioning a business model that was working. Ash never stopped making sure people felt genuinely seen for what they'd actually accomplished. Neither practice canceled the other out — in each of their organizations, both were happening at once, which is the actual argument this whole module has been making."),
    pullQuote("Question everything that works. Celebrate everyone who's actually earned it. Neither one is optional, and neither one replaces the other."),
    heading(3, "Go Deeper"),
    paragraph("Everything in this module rests on sources you can read or watch yourself. If one of the two new practices landed harder than the others, these are the best places to keep going."),
    table(
      ["Resource", "Why it's worth your time"],
      [
        ["Kouzes & Posner, The Leadership Challenge", "The full research behind all five practices, including the case studies and assessment tools"],
        ["Adam Grant, \"The Surprising Habits of Original Thinkers\" (TED)", "How people who generate original ideas actually work — and why they fail so often"],
        ["Reed Hastings, WeAreNetflix Podcast interview", "The culture behind Netflix's willingness to challenge its own success"],
        ["Dan Ariely, \"What Makes Us Feel Good About Our Work?\" (TED)", "The behavioral evidence that progress and recognition drive effort more than pay alone"],
        ["Gallup Workplace, \"Employee Retention Depends on Getting Recognition Right\"", "Current data on how the quality of recognition affects whether people stay"],
      ]
    ),
    paragraph("Twelve modules almost complete now. Module 12 closes the track with the one question none of the previous eleven have asked directly: what happens after you, once you're no longer the one holding any of this together."),
    videoPlaceholder("2-3 min closing from Denis — on a time he challenged a process that badly needed challenging, and what it actually cost him to do it."),
    divider(),
    scorecard("Five Practices Self-Audit", "module11_five_practices", [
      { key: "model", label: "Model the Way — my character holds up when nobody's watching", max: 10, helpText: "Cross-reference: Module 2's self-audit." },
      { key: "vision", label: "Inspire a Shared Vision — my team could describe our vision in their own words", max: 10, helpText: "Cross-reference: Module 4's self-audit." },
      { key: "challenge", label: "Challenge the Process — I actively search for a better way before something breaks", max: 10, helpText: "When did you last question a process nobody else was questioning?" },
      { key: "enable", label: "Enable Others to Act — I share real power, not just tasks", max: 10, helpText: "Cross-reference: Module 6's self-audit." },
      { key: "encourage", label: "Encourage the Heart — I recognize real accomplishment specifically and publicly", max: 10, helpText: "When did you last publicly and specifically recognize someone's real accomplishment?" },
    ]),
    assignmentPrompt(
      "Week 11 Assignment",
      "This assignment asks you to actually practice the two new practices this module introduced, not just reflect on them.",
      [
        {
          number: 1,
          heading: "Challenge One Process",
          guidance: "Name one process or habit on your team that exists mostly because \"it's always been done that way.\" Propose one specific, small change to test it."
        },
        {
          number: 2,
          heading: "Plan a Real Recognition",
          guidance: "Name one specific, real accomplishment on your team that hasn't been properly recognized yet. Plan exactly how you'll recognize it — specifically and publicly, not generically."
        },
        {
          number: 3,
          heading: "Score Yourself Honestly",
          guidance: "Using the scorecard above, score yourself on all five practices. Which score surprised you, and why?"
        },
        {
          number: 4,
          heading: "Name Your Weakest Dial",
          guidance: "Of the five practices, which one is genuinely your weakest? What's one specific thing you'll do about it in the next two weeks?"
        },
        {
          number: 5,
          heading: "One Leader, All Five",
          guidance: "Name a real leader you know personally — not a public figure — who genuinely practices all five well. What specifically do they do differently from a leader who's only strong in two or three?"
        }
      ],
      200,
      800
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5];

const module11 = {
  module_number: 11,
  title: "Challenge and Celebrate",
  subtitle: "The Two Practices This Track Hasn't Given You Yet",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 75,
  cover_image_alt: "Five dials on a single panel, all turned partway up",
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

console.log(`Module 11 — "${module11.title}"`);
console.log(`Simulated splitter produced ${simSections.length} sections (expect 5):`);
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

fs.writeFileSync('module11_leadership.json', JSON.stringify(module11, null, 2));
console.log(`\nWritten to module11_leadership.json`);
