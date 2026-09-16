// Module 4 — "Vision & Strategic Direction"
// Built directly in corrected production schema (learned from Modules 2/3).

const fs = require('fs');

// ─── Block helpers — production-verified schema ────────────────────────────

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const divider = () => ({ type: "divider", data: {} });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });

const reflectionQuestions = (title, questions) => ({
  type: "reflection_questions",
  data: { title, questions }
});

const assignmentPrompt = (title, instructions, prompts, word_min, word_max) => ({
  type: "assignment_prompt",
  data: { title, instructions, prompts, word_min, word_max }
});

const bullet = (text) => paragraph(`• ${text}`);
const numbered = (text, n) => paragraph(`${n}. ${text}`);

const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const videoPlaceholder = (description) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${description}`);
const imagePlaceholder = (description) => callout("note", `[IMAGE PLACEHOLDER — pending generation] ${description}`);
// A real image once its file exists, a placeholder until then — see
// generate_module5.js for the same helper and the reasoning behind it.
const image = (spec) =>
  spec.url
    ? { type: "image", data: { url: spec.url, alt: spec.alt } }
    : imagePlaceholder(`${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);
const recommendedLink = (title, url_hint, note) => callout("info", `${title} — ${url_hint}. ${note}`);

// ─── SECTION 1 — What Vision Actually Is ───────────────────────────────────

const section1 = {
  section_number: 1,
  title: "What Vision Actually Is",
  blocks: [
    // Module front matter
    heading(2, "Vision & Strategic Direction"),
    paragraph("Module 4 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoEmbed("nxTedtvYfFM", "The Power of Vision 1 | Denis Ekobena"),
    callout("info", "Who this is for: Every leader who completed Modules 1-3. You've done the inner work — character, emotional intelligence. This module turns outward: what are you actually building, and can you see it clearly enough to lead others toward it?"),
    callout("info", "Core promise: By the end of this module, you'll have a written vision statement, know the seven specific things most likely to kill it, and have the first concrete goals that turn it from a dream into a plan."),
    callout("info", "Time commitment: Roughly 80-90 minutes of reading and reflection, plus assignment work. Nine sections — vision, then the practices that carry it, then the strategy that executes it."),
    divider(),
    // Section 1 content
    heading(2, "What Vision Actually Is"),
    paragraph("Proverbs 29:18 says it plainly: where there is no vision, the people perish. Not \"struggle.\" Not \"underperform.\" Perish. Scripture doesn't treat vision as a nice-to-have leadership accessory — it treats its absence as fatal."),
    paragraph("Vision is the ability to see clearly, think creatively, and dream — not as escapism, but as the specific mechanism by which a leader gives people something worth the cost of following. Myles Munroe put the distinction bluntly, in a different book than the one Module 2 drew on: the difference between sight and vision is that sight is what your eyes see; vision is what your spirit perceives. Two leaders can stand in the exact same room, looking at the exact same problem, and only one of them is actually leading — because only one of them can see what isn't there yet."),
    callout("tip", "Munroe's own summary of what vision actually costs a person, from that same book: people who changed the world have declared independence from other people's expectations. Every name in the list further down this section paid that price before they paid any other."),
    pullQuote("Vision and goals are inseparable twins. One without the other is either a fantasy or a task list."),
    paragraph("Michelangelo reportedly said he could see the finished statue trapped inside the marble before he ever picked up a chisel — his job was simply removing what didn't belong. That's a genuinely useful model for leadership vision: it's not inventing something from nothing. It's seeing what's already latent — in a person, a team, a community — and having the clarity and nerve to start removing what's in the way."),
    image({
      url: "/images/module-4/sculptor-marble.png",
      alt: "A sculptor holding hammer and chisel against a rough marble block, the figure of a person already emerging from the uncut stone. Text reads \"Great leaders are built, not born.\", \"Character. Discipline. Purpose. Progress.\" and \"People, Potential, Purpose — a better tomorrow.\""
    }),
    videoEmbed("UN4G3ZIkohY", "The Power of Vision 2 | Denis Ekobena"),
    paragraph("One image from that second video is worth carrying forward: an athlete doesn't run aimlessly. Before the race starts, they know exactly two things — the starting line and the finish line. Every stride in between only makes sense in reference to both. Ask yourself the same question Denis puts to his own audience: do you know your finish line? Most leaders can describe where they started. Far fewer can say, specifically, where the race actually ends."),
    paragraph("God told Abraham to look up and count the stars — as many as you can count, so shall your descendants be (Genesis 15:5). Nobody can actually count the stars. That wasn't the point. The point was giving Abraham a mental picture large enough to organize a life around, decades before there was any visible evidence it would come true."),
    heading(3, "You Already Know What This Looks Like"),
    paragraph("Nelson Mandela's vision was a South Africa without apartheid. Martin Luther King Jr.'s was a society where character, not skin color, determined how people were treated. Susan B. Anthony's was a United States where women could vote. Billy Graham's, formed as a young evangelist in the 1940s with a handful of college friends, was stadiums full of people hearing the gospel — a vision that by the end of his life had reached an estimated 210 million people in person, and close to a billion more through radio and television."),
    callout("tip", "None of these visions arrived pre-approved. Each one started as one person's private conviction, decades before it became history everyone now treats as obvious. That's worth remembering the next time your own vision feels too far from where you're currently standing."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "If you had to describe what you actually see — not what you're currently managing, but what you believe could exist — could you say it in one sentence right now?",
        "Where in your leadership are you currently reacting to what's visible, rather than leading toward what isn't yet?"
      ]
    ),
  ]
};

// ─── SECTION 2 — Vision Needs Values and Vitality ──────────────────────────

const section2 = {
  section_number: 2,
  title: "Vision Needs Values and Vitality",
  blocks: [
    heading(2, "Vision Needs Values and Vitality"),
    paragraph("A widely used leadership curriculum frames vision as one of three prerequisites for leadership — and deliberately refuses to let it stand alone. Vision, Values, Vitality. Miss either of the other two, and vision alone doesn't just underperform. It becomes dangerous."),
    table(
      ["Prerequisite", "What it actually does"],
      [
        ["Vision", "The ability to see clearly, think creatively, dream — without it, there's nothing to lead toward"],
        ["Values", "Conscience and ethics are not optional accessories to vision — they're what keeps a compelling vision from becoming a justification for anything"],
        ["Vitality", "The ability to hang in there until the vision is actually implemented — enthusiasm that survives the gap between announcing a vision and living inside its unfinished, unglamorous middle"],
      ]
    ),
    callout("tip", "Notice what this quietly protects against: a leader with vision and vitality but no values is the most dangerous combination on this list, not the most impressive. Charisma and persistence pointed in the wrong direction just get somewhere wrong faster."),
    paragraph("You've already done real work on two of these three in this program. Module 2 was values — character in the dark, the guardrails, what you do when no one's watching. Module 3 touched vitality — self-regulation, motivation that survives when recognition doesn't show up. This module is the third leg of a stool that was never meant to stand on one."),
    heading(3, "What All Three Look Like in One Life"),
    paragraph("In 1787, a young British politician named William Wilberforce decided he would work to abolish Britain's slave trade — a trade generating enormous wealth, defended by nearly every powerful interest in the country. His own words on the decision: \"I determined that I would never rest until I had effected its abolition.\""),
    paragraph("By 1805, his motions had failed eleven times. He received death threats. His health broke down under the strain. Friends in Parliament abandoned the cause when it became politically costly. This went on for twenty years — not twenty years of steady progress, twenty years where the honest, visible evidence repeatedly said he was losing."),
    callout("tip", "Vision alone doesn't explain why Wilberforce didn't quit at failure number six or nine. Values gave him a reason strong enough to survive being wrong about the timeline. Vitality was the actual, physical endurance to keep showing up in a chamber that had already told him no, eleven times, in his own body's declining health. In 1807, the bill finally passed — 283 votes to 16."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the three — Vision, Values, Vitality — which would the people closest to you say is currently your strongest? Which would they hesitate to name?",
      ]
    ),
  ]
};

// ─── SECTION 3 — Where Vision Comes From — Joseph's Dreams ─────────────────

const section3 = {
  section_number: 3,
  title: "Where Vision Comes From — Joseph's Dreams",
  blocks: [
    heading(2, "Where Vision Comes From — Joseph's Dreams"),
    paragraph("Joseph was seventeen when he had two dreams — sheaves of wheat bowing to his sheaf, the sun, moon, and eleven stars bowing to him. He didn't earn those dreams. He didn't strategize his way into them. They were given, whole, before he had done anything to deserve them or any visible means of fulfilling them."),
    paragraph("This is worth sitting with, because it corrects a common distortion: vision is not primarily a productivity technique, something you manufacture through a workshop or a whiteboard session. In its deepest form, it's received. What you do afterward — the interpreting, the testing, the decades of unglamorous middle — that part is entirely yours. But the seed of it, more often than leaders like to admit, comes from somewhere they didn't build."),
    callout("warning", "Joseph told his dream to the wrong audience at the wrong time, and it cost him — his brothers' jealousy, years in a pit and in slavery, before the dream became anything close to reality. A real vision doesn't guarantee an easy path to itself. Sometimes having it is exactly what makes the path harder, for a season."),
    paragraph("What actually carried Joseph from the pit to the palace wasn't a strategic plan drafted the day he had the dream. It was faithfulness in rooms nobody was watching — the same territory Module 2 already covered — combined with never actually letting go of what he'd seen, even when every visible circumstance argued it was fantasy."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Is there a vision you've been carrying that you've quietly stopped believing in, simply because the path to it has taken longer or looked harder than you expected?",
      ]
    ),
  ]
};

// ─── SECTION 4 — The 8-Step Vision Process ─────────────────────────────────

const section4 = {
  section_number: 4,
  title: "The 8-Step Vision Process",
  blocks: [
    heading(2, "The 8-Step Vision Process"),
    paragraph("If vision can be received, it can also be pursued deliberately — the two aren't in tension. Here's a practical sequence for actually getting from \"I sense something\" to a vision you can write down and lead from."),
    numbered("Pray and listen. Before strategy, before brainstorming — quiet enough, long enough, to actually hear something rather than just generate something.", 1),
    numbered("Gather information. What do you know about the need, the people, the landscape you're being called into? Vision divorced from real information becomes fantasy fast.", 2),
    numbered("Look for patterns. What keeps showing up — in your own history, your frustrations, the problems you can't stop noticing? Recurring patterns are often vision trying to get your attention.", 3),
    numbered("Confirm it. Test what you're sensing against Scripture, against wise counsel, against reality. A vision that can't survive scrutiny wasn't ready to be acted on yet.", 4),
    numbered("Write it down. Habakkuk 2:2 — write the vision, make it plain. An unwritten vision is a feeling. A written one is something you can actually be held accountable to.", 5),
    numbered("Own it. Make it genuinely yours, not a borrowed version of someone else's calling that happened to sound impressive.", 6),
    numbered("Share it wisely. Joseph's mistake, corrected — not everyone gets access to your unformed vision. Some people are meant to hear it early. Most aren't.", 7),
    numbered("Give it daily attention. A vision you only revisit in moments of crisis or annual planning isn't actually leading you. It's decoration.", 8),
    callout("tip", "Steps 1-4 are discernment. Steps 5-8 are stewardship. Most leaders who lose their vision don't lose it at step 1 — they lose it at step 8, through simple neglect, not through some dramatic crisis of faith."),
    videoEmbed("asktl-pPcUM", "The Power of Vision 6 | Denis Ekobena"),
    heading(3, "The Four Questions Every Real Vision Answers"),
    paragraph("Once you've written something down, test it against four questions. A vision statement that can't answer all four isn't finished yet, however inspiring it sounds."),
    table(
      ["Question", "What it's actually asking"],
      [
        ["What", "The specific thing or things you're going to do — not the feeling, the actual work"],
        ["Where", "The geography, the place, the specific context this plays out in — not \"everywhere,\" somewhere"],
        ["When", "Timing. A good thing done at the wrong time produces an accident, not a breakthrough"],
        ["How", "Strategy — the actual method or means, not just the destination"],
      ]
    ),
    callout("tip", "A fifth question sits underneath all four: Who are you becoming to carry this? What preparation, what training, what personal growth does this vision require of you specifically — not just of the plan?"),
    image({
      url: "/images/module-4/eight-step-staircase.png",
      alt: "A person climbing a flight of eight ascending steps toward a sunrise over a city. Each step carries a single icon and no text: an ear, an open book, a magnifying glass, a checkmark, a pencil, a hand over a heart, a mouth, and a sun."
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the eight steps, which have you genuinely done, and which have you skipped or assumed you didn't need?",
        "Have you actually written your vision down — not in your head, on an actual page? If not, what's stopped you?"
      ]
    ),
  ]
};

// ─── SECTION 5 — Modeling the Way & Inspiring a Shared Vision ──────────────

const section5 = {
  section_number: 5,
  title: "Modeling the Way & Inspiring a Shared Vision",
  blocks: [
    heading(2, "Modeling the Way & Inspiring a Shared Vision"),
    paragraph("Having a vision and leading people toward it are two different skills, and the gap between them is where most visionary leaders actually fail. James Kouzes and Barry Posner spent decades surveying tens of thousands of leaders and the people who follow them, trying to answer one question: what do the leaders who successfully mobilize people actually do that the ones with equally good ideas don't? They found five specific, repeatable practices — the same research base Module 2 already drew on for its work on trust. The first two of the five are where vision stops being personal conviction and starts becoming leadership."),
    heading(3, "Modeling the Way"),
    paragraph("Before you can credibly ask anyone to follow a vision, you have to clarify your own values and set the example yourself — visibly, first. A leader who casts a vision they don't personally embody isn't inspiring anyone. They're auditioning for the exact kind of hypocrisy Module 2 already warned against."),
    heading(3, "Inspiring a Shared Vision"),
    paragraph("This is the specific skill of envisioning an uplifting future and enlisting others in it — not announcing a vision and hoping people fall in line, but actually connecting your vision to what the people in front of you already care about. A vision that only excites the person who had it isn't shared. It's a monologue."),
    callout("warning", "Great leaders are effective communicators of vision — this isn't a soft skill layered on top of real leadership. In practice, it's one of the most decisive factors separating leaders who build something lasting from leaders who simply had good ideas nobody followed."),
    videoEmbed("u4ZoJKF_VuA", "Start with Why: How Great Leaders Inspire Action | Simon Sinek | TEDxPugetSound"),
    heading(3, "What Modeling the Way Actually Looks Like"),
    paragraph("Herb Kelleher co-founded Southwest Airlines and ran it for decades on a simple conviction: employees who are genuinely put first will put customers first in turn — and a leader who says that but doesn't visibly live it is just another executive with a slogan."),
    paragraph("So Kelleher handled baggage himself during the Thanksgiving rush. He showed up at a hangar at four in the morning with doughnuts for the mechanics. He worked alongside flight attendants, not as a photo opportunity, but because the vision he was casting — people first — meant nothing if the person casting it was exempt from it. His own summary of the whole philosophy: your people come first, and if you treat them right, they'll treat the customers right."),
    callout("tip", "Southwest posted more than 35 consecutive years of profitability in an industry famous for bankrupting even its best-run competitors. That's not a coincidence of a charming personality — it's what happens when the vision and the visible behavior of the person casting it are the same thing, for decades, without exception."),
    heading(3, "The One Practice Most Leaders Skip"),
    paragraph("Kouzes and Posner's fifth practice — Encourage the Heart — gets named constantly and applied rarely. It's not a pep talk. It's the discipline of specifically recognizing real contributions and genuinely celebrating actual victories, building a working culture where people feel like they belong to something, not just employed by it."),
    callout("tip", "Their own summary of the whole five-practice body of research is worth carrying past this section: you can't lead others until you've first led yourself through a struggle with opposing values. Everything Modules 1 and 2 already asked of you turns out to be the actual prerequisite for everything this module is asking now."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "If someone on your team described your vision back to you in their own words, would it sound like your vision — or would you barely recognize it?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Challenging the Process ───────────────────────────────────

const section6 = {
  section_number: 6,
  title: "Challenging the Process",
  blocks: [
    heading(2, "Challenging the Process"),
    paragraph("The third practice is the one most leaders are least comfortable with, because it requires actively disturbing something that currently works well enough — searching for opportunities by questioning the status quo, and being willing to experiment and take risks even though failure is a real, live possibility."),
    paragraph("This is uncomfortable for a specific reason: most organizations and teams reward the appearance of stability. A leader who challenges the process is, by definition, choosing to create short-term friction for the sake of a future the people around them can't yet see as clearly as the leader can."),
    callout("tip", "There's a real difference between challenging the process and simply being disruptive for its own sake. The first is done in service of the vision, with genuine humility about the risk of being wrong. The second is often just restlessness wearing vision's clothes."),
    paragraph("This is also where psychological safety matters most. A leader who challenges the process while punishing others for the honest failures that come from experimentation isn't actually challenging anything — they're just relocating all the risk onto everyone except themselves."),
    heading(3, "The Company That Didn't Repeat Kodak's Mistake"),
    paragraph("Section 7 tells Kodak's story — a company that invented its own future and buried it to protect a profitable present. Netflix faced the identical decision point in 2007, and made the opposite call."),
    paragraph("Their DVD-by-mail business wasn't struggling. It was profitable and still growing. Most leaders in that position defend the winning model. Reed Hastings did the reverse — he moved the company aggressively into streaming, a technology that would directly cannibalize the very business funding the move. At points, DVD executives were reportedly left out of the strategic meetings about the company's future entirely, not out of malice, but because — as Hastings put it — they weren't adding value to the conversation about where the company had to go."),
    callout("tip", "Same fork in the road Kodak stood at. Same fear available to feel, same status quo available to protect. The difference wasn't smarter leadership in some abstract sense — it was a leader willing to actually challenge the process his own company's success was built on, before someone else did it to him."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "What's one part of \"how things are done\" in your current leadership that you privately suspect needs to change, but haven't challenged yet — and what's actually stopping you?",
      ]
    ),
  ]
};

// ─── SECTION 7 — Seven Vision Killers ───────────────────────────────────────

const section7 = {
  section_number: 7,
  title: "Seven Vision Killers",
  blocks: [
    heading(2, "Seven Vision Killers"),
    paragraph("Thomas Edison said vision without execution is hallucination. This section is the execution side's warning label — the seven specific things that kill a real vision before it ever becomes real, none of which announce themselves as the vision's enemy while they're doing it."),
    heading(3, "The Company That Killed Its Own Invention"),
    paragraph("In 1975, a Kodak engineer named Steve Sasson built something nobody had ever built: a working digital camera. He carried it into a room of Kodak's own managers, expecting excitement. What he got, in his own words, was closer to: \"That's cute — but don't tell anyone about it.\""),
    paragraph("Kodak didn't fail to see the future. They built it, inside their own labs, years ahead of anyone else. What killed it wasn't ignorance — it was two of the seven killers this section is about to name, acting together. Fear: digital threatened the film business that funded everything else. Status Quo: film worked, was profitable, and required no one to bet their career on something unproven. To be fair to Kodak's engineers, the 1975 prototype genuinely wasn't ready for consumers either — 0.01 megapixels, stored on cassette tape. But \"not ready yet\" is a reason to keep developing something. Kodak's leadership chose to bury it instead."),
    callout("warning", "By the time Kodak took digital seriously, Sony and Canon already owned the category Kodak had invented first. Kodak filed for bankruptcy in 2012 — undone not by a competitor's better idea, but by its own leadership's unwillingness to act on a vision they were literally holding in their hands."),
    divider(),
    table(
      ["Killer", "How it actually shows up"],
      [
        ["Fear", "F.E.A.R. — False Evidence Appearing Real. Not a single dramatic moment, but a slow accumulation of imagined worst-cases that never get tested against reality"],
        ["Disconnection from the Source", "A vision that started as something received quietly stops being fed by prayer, reflection, or honest counsel — and starts running on momentum alone"],
        ["Wrong Company", "Surrounding yourself with people who either can't see the vision or actively resent it — enthusiasm is contagious, but so is cynicism"],
        ["Status Quo", "The comfort of what already works becomes a stronger pull than the cost of what could be — comfort rarely announces itself as the enemy of vision, it just quietly wins by default"],
        ["Laziness", "Vision without the daily, unglamorous discipline to sustain it — the eighth step from Section 4, neglected"],
        ["Lack of Commitment", "Treating the vision as one option among several rather than the thing everything else gets organized around"],
        ["Lack of Clarity", "A vision vague enough to mean anything ends up meaning nothing — the opposite problem from over-planning, and just as fatal"],
      ]
    ),
    pullQuote("Vision without execution is hallucination."),
    videoEmbed("bKYZw2C1ltw", "The Power of Vision 8 | Denis Ekobena"),
    callout("tip", "Scripture anchors for three of the seven, worth carrying with you: Proverbs 1:33, on fear — whoever listens to wisdom will live in safety, at ease, without dread of harm. Proverbs 13:20, on wrong company — walk with the wise and become wise; a companion of fools suffers for it. Proverbs 6:6-11, on laziness — go to the ant, consider its ways, and be wise. None of these are new problems. They're just old enough that Scripture already named the pattern."),
    callout("tip", "Look back at the first two rows of that table. That's Kodak's whole story in two words — not a lack of vision, a failure to guard it against exactly the two killers it was most exposed to."),
    callout("warning", "Notice these aren't dramatic sabotage. Nobody wakes up and decides to kill their own vision. Each of these seven is a slow leak, not an explosion — which is exactly why they're dangerous. A slow leak doesn't trigger the alarm a sudden puncture would."),
    image({
      url: "/images/module-4/balloon-seven-leaks.png",
      alt: "A hot air balloon descending over a valley at sunrise, with seven small punctures in its fabric numbered 1 to 7 and one enlarged in a detail circle to show how slight it is. Downward arrows mark the loss of altitude. Text reads \"Small leaks. Big impact.\" and \"It's often the little things that bring us down.\""
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the seven vision killers, which one would you privately admit is closest to home for you right now — not the one that sounds most forgivable, the one that's actually true?",
      ]
    ),
  ]
};

// ─── SECTION 8 — From Vision to Strategy: Mission & Goals ──────────────────

const section8 = {
  section_number: 8,
  title: "From Vision to Strategy",
  blocks: [
    heading(2, "From Vision to Strategy"),
    paragraph("Vision is the destination. A mission statement and real goals are what actually get you there — the difference between knowing where you're going and having a way to check, every week, whether you're actually moving."),
    heading(3, "Writing a Mission Statement That Actually Works"),
    paragraph("A good mission statement earns its place by doing real work: it clarifies focus, fosters unity, enhances creativity within boundaries rather than despite them, streamlines effort, and simplifies decision-making. A mission statement that doesn't change how you say no to things isn't actually functioning as one."),
    callout("tip", "Seven tests of a great mission statement, worth running yours against: Does Scripture affirm it? Does your budget reveal it? Does your calendar reflect it? Does your team's actual work match it? Does the community you serve live it? If most of these would embarrass you, the mission statement is decoration, not direction."),
    heading(3, "The Hedgehog Concept"),
    paragraph("Jim Collins studied what separated companies that became genuinely great from companies that stayed merely good, and found something sharper than a mission statement: a single point where three circles overlap. What you are deeply passionate about. What you can actually be best in the world at — not good, best. And what drives your economic engine, the thing that actually sustains the work financially."),
    callout("tip", "Collins's warning matters as much as the framework: operate only at the intersection. Passion without competence is a hobby. Competence without passion burns out. Either without something that sustains it financially eventually stops. Most visions fail not because they're wrong in one circle, but because they were only ever built on one or two of the three."),
    heading(3, "Three Kinds of Planning"),
    paragraph("Section 7 already named the principle: a vision that never becomes execution is hallucination. Execution itself runs on three different time horizons, and most leaders are only comfortable in one of them."),
    table(
      ["Type", "Time horizon", "The trap"],
      [
        ["Strategic", "Five years and beyond", "Easy to romanticize, hard to predict — a strategic plan with no shorter-term plan underneath it stays a document, not a direction"],
        ["Tactical", "One to five years", "Where most real leadership work actually happens — the plans a leader is personally accountable for completing"],
        ["Operational", "Daily and weekly", "The routine, unglamorous tasks that either compound into the tactical plan or quietly drain time away from it"],
      ]
    ),
    callout("tip", "Proverbs 24:3-4: by wisdom a house is built, and through understanding it is established; through knowledge its rooms are filled with rare and beautiful treasures. Notice the order — wisdom builds, understanding establishes, knowledge fills. A vision without any of the three levels of planning underneath it is a house with no rooms yet, no matter how good the initial idea was."),
    heading(3, "Setting Goals That Carry the Vision"),
    paragraph("Vision without goals stays a feeling. The most common framework — SMART goals — asks that each goal be Specific, Measurable, Achievable, Relevant, and Time-bound. Useful, but insufficient alone: SMART goals optimize for what's realistic, which quietly trains leaders to think smaller than their actual vision requires."),
    paragraph("A second framework worth holding alongside it: BOLD goals — goals large enough that achieving them requires you to become a different, more capable leader than the one who set them. SMART keeps a goal honest. BOLD keeps a goal worthy of the vision that produced it. Use both, not one instead of the other."),
    callout("tip", "This isn't only a faith-framed idea. Business researcher Jim Collins spent 25 years studying what separated companies that thrived for decades from ones that didn't, and found a specific pattern in nearly every enduring one: what he calls a BHAG — a Big Hairy Audacious Goal, a 10-to-25-year target so ambitious it seems almost unreasonable when first stated. President Kennedy's 1961 commitment to land a man on the moon before the decade ended is the model example — a goal that, when announced, had no clear technical path to actually achieving it yet."),
    paragraph("Collins's research point matters here specifically: it wasn't the goal's size that mattered most. It was that the goal was clear enough to organize every other decision around. A vague ambition to \"be great someday\" motivates no one. A specific, audacious, dated target — even one you privately don't yet know how to reach — gives a team something to actually build toward."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Write one goal right now, in one sentence, that would genuinely require you to grow to achieve it — not one you already know how to hit.",
      ]
    ),
  ]
};

// ─── SECTION 9 — Closing & Assignment ──────────────────────────────────────

const section9 = {
  section_number: 9,
  title: "Closing & Assignment",
  blocks: [
    heading(2, "Closing & Assignment"),
    paragraph("Nine sections, one argument: vision isn't a slogan on a wall. It's received, tested, written down, protected from seven specific and unglamorous threats, carried by values and vitality, communicated in a way people can actually join, and translated into goals precise enough to check your progress against."),
    paragraph("Ephesians 2:10 calls you God's workmanship — poema in the original Greek, the same root English gets \"poem\" from. A thing made, deliberately, not an accident. You were pre-arranged for something specific before you were born. That's not a metaphor to feel good about. It's the actual claim this whole module has been building toward: your vision isn't something you invented out of nothing. It's something you were made for, that you're now responsible to notice, write down, and walk out."),
    paragraph("Denis wrote his own vision statement as a university student, from Jeremiah 1:11-14 — took it to school, asked friends to sign it, pinned it to his wall. Years later: a Bible school, a church, a clinic, a media studio, and a daycare academy, all in a country he moved to because of what that statement said. Not because the writing was eloquent. Because he kept looking at it."),
    callout("tip", "Vision properly distinguished and named becomes a creation. Not a decoration on a wall — the actual thing you're building toward, every time you look at it again."),
    divider(),
    assignmentPrompt(
      "Week 4 Assignment",
      "This assignment asks you to do what Section 4 named as the step most leaders skip: write your vision down, plainly, and give it the tests this module has provided. This isn't graded on eloquence — it's read by a mentor who wants to help you close the gap between what you sense and what you've actually written.",
      [
        {
          number: 1,
          heading: "Write the Vision",
          guidance: "In one paragraph, write the vision you are actually carrying right now — not the polished, presentable version, the honest one. If you've never written it down before, this is that moment.",
          example: "Example: \"I see a generation of leaders in my community who lead from character rather than performance, who I have personally equipped — not because I recruited a crowd, but because I gave real time to a few.\""
        },
        {
          number: 2,
          heading: "Run the Seven Killers Against It",
          guidance: "Of the seven vision killers from Section 7, which one is the most active threat to this specific vision, right now? Name a concrete, recent example of it showing up."
        },
        {
          number: 3,
          heading: "Write One SMART Goal and One BOLD Goal",
          guidance: "Write one goal that is genuinely Specific, Measurable, Achievable, Relevant, and Time-bound — something you could report progress on in 30 days. Then write one BOLD goal tied to the same vision — one that would require you to grow to reach it."
        },
        {
          number: 4,
          heading: "Choose Who Hears It",
          guidance: "Per Section 3's caution about Joseph sharing his dream with the wrong audience: who is the right person to share this vision with first, and when will you actually tell them?"
        }
      ],
      200,
      600
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9];

const module4 = {
  module_number: 4,
  title: "Vision & Strategic Direction",
  subtitle: "Seeing Clearly, Leading Toward It",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 85,
  cover_image_alt: "A distant mountain range just visible through morning fog",
  sections: sections.map(s => ({
    section_number: s.section_number,
    title: s.title,
    blocks: s.blocks
  }))
};

// ─── Structural self-validation ────────────────────────────────────────────

const flat = sections.flatMap(s => s.blocks);
let titleConsumed = false;
let simSections = [];
let current = null;
for (const b of flat) {
  const isH2 = b.type === "heading" && b.data.level === 2;
  if (isH2 && !titleConsumed) { titleConsumed = true; continue; }
  if (isH2) {
    if (current) simSections.push(current);
    current = { title: b.data.text, blocks: [] };
    continue;
  }
  if (current) current.blocks.push(b);
}
if (current) simSections.push(current);

console.log(`Module 4 — "${module4.title}"`);
console.log(`Simulated splitter produced ${simSections.length} sections (expect 9):`);
simSections.forEach((s, i) => console.log(`  ${i+1}. ${s.title} (${s.blocks.length} blocks)`));

const variants = new Set(flat.filter(b => b.type === "callout").map(b => b.data.variant));
const allowed = new Set(["note","info","warning","tip","scripture"]);
const unknown = [...variants].filter(v => !allowed.has(v));
console.log(`\nCallout variants used: ${[...variants].join(", ")}`);
console.log(`Unknown variants: ${unknown.length ? unknown.join(", ") : "NONE"}`);

console.log(`\nTotal blocks: ${flat.length}`);
console.log(`Reflection question blocks: ${flat.filter(b=>b.type==="reflection_questions").length}`);
console.log(`Assignment prompt blocks: ${flat.filter(b=>b.type==="assignment_prompt").length}`);
console.log(`Pending videos (awaiting Denis's playlist links): ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[VIDEO PLACEHOLDER")).length}`);
console.log(`Pending images: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[IMAGE PLACEHOLDER")).length}`);

fs.writeFileSync('module4_leadership.json', JSON.stringify(module4, null, 2));
console.log(`\nWritten to module4_leadership.json`);
