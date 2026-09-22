// Module 9 — "Coaching & Developing People"
// Original content throughout, synthesizing library material (Toolkit,
// Denis's own book, session cards, banked Nine Habits piece).

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

// ─── SECTION 1 — The Real Multiplier ────────────────────────────────────────

const section1 = {
  section_number: 1,
  title: "The Real Multiplier",
  blocks: [
    heading(2, "Coaching & Developing People"),
    paragraph("Module 9 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 9 — why this is the module where the last eight modules either start compounding or quietly stay capped at whatever one person can personally do."),
    callout("info", "Who this is for: Every leader who completed Modules 1-8. You've built character, vision, trust, communication, and the posture of serving rather than being served. This module gives you the actual mechanics."),
    callout("info", "Core promise: By the end of this module, you'll have a specific, repeatable process for developing someone else's capability — not just good intentions about it."),
    callout("info", "Time commitment: Roughly 75-85 minutes of reading and reflection, plus assignment work."),
    divider(),
    heading(2, "The Real Multiplier"),
    paragraph("Module 5 introduced Level 4 — People Development — as the level most leaders never reach, because it requires trading direct control for something slower and far less visible. Module 8 argued that developing people was the actual point of everything else. Neither module explained how to actually do it. This one does."),
    paragraph("The math is worth stating plainly. A leader who only produces results personally is capped at whatever one person, working alone, can accomplish. A leader who develops three other people who can each produce at even a fraction of that leader's own level has already multiplied their real output past what any amount of personal effort could reach. Training gives someone tools. Development changes the person using them — and it's the second one, not the first, that actually compounds."),
    callout("tip", "Training and development get treated as synonyms, and they aren't. Training adds a skill. Development changes how someone sees themselves and what they're capable of. A leader can train someone in an afternoon. Developing them takes months, and it's the only one of the two that survives the leader leaving the room."),
    paragraph("A quick way to tell which one you're actually doing: training ends when the person can perform the task. Development ends when the person no longer needs you present to perform it well, make good judgment calls about it, and eventually teach someone else to do the same."),
    callout("info", "This module draws on real, verified examples across two very different worlds — Silicon Valley executive coaching and a decades-long college basketball program — plus a two-thousand-year-old letter that got there first."),
    callout("tip", "None of the three have anything in common professionally. All three converge on the same conclusion this module has been building toward."),
    image({
      type: "flat editorial illustration, muted navy/gold palette",
      content: "A single lit candle touching a second unlit candle, both now burning equally bright — no loss of light in the original flame",
      width: 1200,
      height: 675
    }),
    paragraph("Everything in this module follows from that image directly. Real development doesn't diminish the person doing the developing. It multiplies what one person alone could ever produce — and it's the only investment a leader can make that keeps compounding after the leader has moved on to something else entirely."),
    callout("tip", "Six sections follow, and every one of them is really an answer to the same question from a different angle: what does the candle-lighting actually look like in practice, step by step, conversation by conversation?"),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Name one person you're currently leading. Are you training them, developing them, or neither — honestly?",
        "Name someone who had a genuine impact on you as a leader — a real mentor, not just an influence. What specifically did they do that made the difference?",
      ]
    ),
  ]
};

// ─── SECTION 2 — The Five-Step Process ──────────────────────────────────────

const section2 = {
  section_number: 2,
  title: "The Five-Step Process",
  blocks: [
    heading(2, "The Five-Step Process"),
    paragraph("Development that actually works follows a specific, observable sequence — not a single moment of delegation, but five distinct stages, each one handing over a little more real responsibility than the last."),
    table(
      ["Stage", "What actually happens"],
      [
        ["I do, you watch", "The leader performs the task while the other person observes closely — not passively, but paying attention to the specific decisions being made"],
        ["I do, you help", "The leader still leads, but now hands over real pieces of the task"],
        ["You do, I help", "The other person leads for the first time, with the original leader present as a safety net, not a director"],
        ["You do, I watch", "The other person leads alone. The leader is present only to observe and give feedback afterward"],
        ["You do, someone else watches", "The person who was developed is now developing someone else — the actual proof the process worked"],
      ]
    ),
    callout("warning", "Most leaders stop at stage two. Handing someone real leadership of a task — stage three onward — feels riskier, because it genuinely is: real mistakes become possible that weren't possible when the leader was still fully in control. That risk is not a flaw in the process. It's the actual mechanism by which capability transfers."),
    paragraph("There's no fixed timeline for moving between stages. Some people move through all five in weeks. Others need months at a single stage before they're genuinely ready for the next one — and forcing the transition early because the calendar says it's time tends to produce exactly the failure a leader was trying to avoid by controlling the pace in the first place."),
    callout("tip", "The actual signal to move stages isn't time elapsed. It's whether the person has started making the same judgment calls the leader would make, without being told — that's the real evidence readiness has arrived, not a date on a calendar."),
    paragraph("John Wooden coached UCLA's basketball program to ten national championships in twelve years, including seven in a row — a record no program before or since has matched. What's less often noted is what his own players say about him decades later. Kareem Abdul-Jabbar and Bill Walton, two of the most decorated players in basketball history, both describe Wooden less as a coach who won games and more as someone who built them as people, and both remained close to him for the rest of his life. Wooden was reportedly less interested in talking about winning at all than in whether players were doing the actual work in front of them well."),
    paragraph("The distinction matters for this module specifically: Wooden wasn't developing players to win championships for him. He was developing them in a way that kept producing results — in their careers, their character, their own later mentorship of others — long after they'd stopped playing for him."),
    callout("tip", "The pattern is visible in outline even without knowing Wooden's exact internal practice structure: players who spent years being developed by him went on, in multiple documented cases, to become mentors and coaches themselves — the same fifth stage this section describes, showing up a generation later."),
    paragraph("Notice what the fifth stage requires that the first four don't: it isn't complete until the person you developed has developed someone else. A leader who trains one person brilliantly, who then never trains anyone themselves, has produced a single generation of capability rather than a compounding one."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "For the person you named in Section 1 — which of these five stages are you actually at with them, honestly, not where you'd like to be?",
      ]
    ),
  ]
};

// ─── SECTION 3 — Three Foundational Skills ──────────────────────────────────

const section3 = {
  section_number: 3,
  title: "Three Foundational Skills",
  blocks: [
    heading(2, "Three Foundational Skills"),
    paragraph("Coaching, treated as a specific discipline rather than a leadership vibe, rests on three skills. Each one is teachable, and each one is commonly assumed rather than actually practiced."),
    heading(3, "Manager or Coach?"),
    paragraph("The pull toward managing instead of coaching is strongest exactly when a leader is most experienced — because experience is precisely what makes it tempting to just solve the problem directly rather than walk someone else through solving it themselves. A manager controls the work: what to focus on, how much time to spend, which direction to go. A coach does something different, even when the underlying knowledge is identical."),
    paragraph("The distinction is easiest to see through an ordinary athletic scene: if a coach watches a player struggling with a specific skill, the coach doesn't step onto the field and perform the skill correctly to demonstrate it. The coach works with the player to help them see the actual deficit themselves, then works through it together. The coach only steps in directly when the player genuinely can't move forward on their own — and even then, as a last resort, not a first instinct."),
    callout("tip", "This is uncomfortable specifically for leaders who are good at the underlying work. Watching someone struggle through a problem you could solve in thirty seconds is genuinely harder than just solving it — which is exactly why so many leaders default to managing instead of coaching, even when they'd say they believe in developing people."),
    heading(3, "Active Listening"),
    paragraph("Module 7 already covered this in depth, and it's worth restating here specifically: coaching is impossible without it. A leader who's already forming advice while the other person is still explaining their situation isn't coaching — they're waiting for permission to tell someone what to do."),
    heading(3, "Powerful Questions"),
    paragraph("The specific discipline of asking rather than telling — not because telling is wrong, but because a question forces the other person to actually do the thinking, which is the only way the thinking becomes theirs. A few question types are worth avoiding specifically: leading questions that already contain the answer (\"Don't you think you should...\"), closed questions that only need a yes or no, and questions that carry a hidden judgment (\"What made you think that was a good idea?\"). Open, genuinely curious questions — \"What have you already considered?\" \"What would you do if you knew you couldn't fail?\" — do the actual work."),
    heading(3, "Goal-Setting"),
    paragraph("A coaching conversation with no destination is just a supportive conversation — valuable, but not development. The goal doesn't need to come from the leader. Often the best coaching goal is one the person being coached arrives at themselves, with the leader's questions doing the work of clarifying it rather than supplying it."),
    paragraph("Two more things worth naming about coaching specifically, since they're easy to overlook. First, it genuinely can't be run as a single fixed script applied identically to everyone — the same question that unlocks real insight for one person lands flat for another, and a leader who coaches everyone the same way is really just running a routine, not actually paying attention to the individual in front of them. Second, coaching isn't a single conversation. It's a relationship that includes real follow-up — checking back on the goal that was set, not moving on and assuming it happened."),
    heading(3, "The Most Common Failure Mode"),
    paragraph("Ask experienced leaders what derails coaching relationships most often, and one answer comes up more than any other: the leader stops actually listening once they think they already understand the problem. The questions keep getting asked, but they stop being genuine — they become a technique for steering someone toward a conclusion the leader already reached, rather than a real search for what the other person actually thinks."),
    callout("warning", "This is worth checking honestly, because it's easy to miss from the inside. A leader can be technically following every step in this module — asking questions instead of giving answers, working through the five-step process — while still not actually coaching, because the questions have quietly become a more polite way of telling."),
    paragraph("A real check: after asking a question, notice whether you're actually curious about the answer, or already know which answer you're hoping for. If it's the second one, the question wasn't really a question."),
    callout("tip", "This failure mode is worth watching for specifically because it doesn't feel like a failure from the inside. It feels like patience."),
    callout("tip", "A 2001 study on the impact of executive coaching found an average return of 5.7 times the initial investment, with the most commonly reported gains being improved working relationships — not, notably, a specific technical skill. The thing coaching actually changes first is how people relate to each other, not what they know."),
    paragraph("Bill Campbell started his career as a college football coach, not a businessman, and carried the same instinct into Silicon Valley for the next four decades. For fifteen years he met weekly with Google's CEO and senior leadership, walked the building's hallways, and sat in on meetings — not to direct anything, but to develop the people running them. He worked closely with Steve Jobs through Apple's return from near-bankruptcy. Larry Page, Sergey Brin, Sheryl Sandberg, and Jeff Bezos all credited him directly with their own growth as leaders."),
    paragraph("What's notable isn't just who he coached. It's that most people outside those companies had never heard his name while he was alive. He wasn't building a personal brand around the executives he developed — he was actually developing them, which is a different activity entirely, and one that doesn't require anyone watching to be worth doing."),
    callout("tip", "This connects to something Campbell was known for saying: a leader can hand off almost every operational task to someone else and the organization keeps running fine. Coaching is the one exception. It has no substitute and no shortcut — it only exists in the actual time two specific people spend together, one of them genuinely paying attention to the other."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these three skills, which do you actually practice, and which do you assume you're doing well without ever having checked?",
      ]
    ),
  ]
};

// ─── SECTION 4 — A Conversation You Can Actually Have ───────────────────────

const section4 = {
  section_number: 4,
  title: "A Conversation You Can Actually Have",
  blocks: [
    heading(2, "A Conversation You Can Actually Have"),
    paragraph("Most leaders avoid coaching conversations not because they don't value development, but because they don't have a structure to hold onto when the conversation gets uncomfortable. Five questions, asked in sequence, are usually enough."),
    numbered("What happened? Get the facts on the table first, without judgment attached yet.", 1),
    numbered("What do you think caused it? Their own diagnosis, not yours — offered first.", 2),
    numbered("What have you learned? This is where real development actually happens, if it happens at all.", 3),
    numbered("What could you do differently? Still their answer, not a list of instructions.", 4),
    numbered("What will you do next? A real commitment, specific enough to actually check on later.", 5),
    callout("tip", "Notice what's missing from this list: the leader's own opinion about what went wrong. It can come in eventually, usually after question three, and usually as a question rather than a verdict — \"Have you considered...\" rather than \"You should have...\""),
    paragraph("This structure works for genuine setbacks and genuine successes equally well — it isn't only a tool for when something went wrong. Run the same five questions after a real win, and the person walks away understanding exactly what they did right specifically enough to repeat it on purpose next time, rather than just feeling generally good about the outcome."),
    paragraph("This same discipline applies to obstacles, not just mistakes already made. When someone brings a leader a genuine roadblock, the instinct to remove it personally is strong — and usually wrong. The more useful move is helping the person actually see the obstacle clearly enough to work through it themselves, stepping in directly only when they truly can't move forward on their own. A leader who removes every obstacle personally is training their team to bring every obstacle to them, permanently, rather than developing anyone's capacity to handle the next one alone."),
    table(
      ["Someone brings you a problem", "Managing response", "Coaching response"],
      [
        ["\"I don't know how to fix this\"", "Fix it yourself", "\"What have you already tried?\""],
        ["\"This isn't working\"", "Tell them what to do instead", "\"What do you think is actually causing it?\""],
        ["\"I need your decision\"", "Make the decision for them", "\"What would you decide, and why?\""],
      ]
    ),
    paragraph("Trust underneath all of this can't be instructed into existence, the same way a coach can't simply tell a team to trust each other and expect it to happen. It has to be built through the actual conditions the leader creates — including being visibly willing to try something new and fail at it themselves. A leader who's never been seen attempting something risky and getting it wrong makes it much harder for anyone else to feel safe doing the same."),
    paragraph("This closes the loop back to Module 6 directly: the trust behaviors covered there — saying the real thing, naming the avoided problem, fixing mistakes visibly — are the actual mechanism that makes every coaching conversation in this module possible at all. Coaching without trust already in place isn't coaching. It's just an uncomfortable conversation neither person actually wants to be in."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of a recent moment you gave someone a verdict instead of asking these five questions. What might they have discovered themselves if you'd asked instead?",
      ]
    ),
  ]
};

// ─── SECTION 5 — Nine Habits ─────────────────────────────────────────────────

const section5 = {
  section_number: 5,
  title: "Nine Habits That Actually Build Leadership",
  blocks: [
    heading(2, "Nine Habits That Actually Build Leadership"),
    paragraph("Everything in this module so far describes how to develop someone else. It's worth pausing on a related question: what actually builds a leader's own capacity to do this well in the first place? Nine habits, built through repetition rather than insight."),
    table(
      ["Habit", "What it actually requires"],
      [
        ["Know what's happening inside you", "Real honesty about your own reactions and triggers — the raw material everything else is built from"],
        ["Notice emotion without being run by it", "The difference isn't feeling less. It's whether the feeling makes the decision, or you do"],
        ["Ask for the feedback that stings", "Most people ask \"how am I doing?\" and mean \"tell me I'm doing well\" — ask the harder question instead"],
        ["Move before you're told to", "Waiting for permission to solve an obvious problem is the most common way capable people stay stuck"],
        ["Let someone see your blind spots", "Not a friend who's nice to you — someone whose job is specifically to notice what you can't"],
        ["Set a real target", "\"Get better at leading\" isn't a goal. A goal has an edge you can measure yourself against"],
        ["Treat every rep as practice", "Including the failed ones — mine them for the lesson instead of just moving past them"],
        ["Check the scoreboard on purpose", "A goal with no way to track progress produces the same result as no goal at all"],
        ["Stay honest about your mistakes", "Especially when no one's watching closely enough to catch you not being"],
      ]
    ),
    paragraph("The table is the compact version. Each of the nine is worth a little more than a row, because leadership isn't a trait you either have or don't — it's closer to physical conditioning, built through specific repeatable habits rather than a single insight. Each of the nine below is a habit in exactly that sense: something practiced, not something possessed."),
    paragraph("1. Know what's actually happening inside you. Leaders who last stay unusually honest with themselves about their own reactions — what triggers them, what they're avoiding, what they're actually feeling as opposed to what they're performing. This isn't introspection for its own sake. It's the raw material everything else in this list is built from."),
    paragraph("2. Notice your emotions without being run by them. Frustration and disappointment are normal, and a leader who claims not to feel them is usually just not noticing. The difference between a leader who lasts and one who doesn't is rarely the absence of the feeling — it's whether the feeling makes the decision, or the leader does."),
    paragraph("3. Ask for the feedback that actually stings. Most people ask \"how am I doing?\" and mean \"tell me I'm doing well.\" Leaders worth following ask the harder question — specifically what isn't working — and then say thank you, rather than explaining why the feedback is wrong."),
    paragraph("4. Move before you're told to. Waiting for permission to solve an obvious problem is the single most common way capable people stay stuck at the level they're already at."),
    paragraph("5. Let someone else see what you can't see in yourself. Every leader who's kept growing past their first few years has had someone in their corner whose job was specifically to notice their blind spots — not a friend who's nice to them, someone who's honest with them."),
    paragraph("6. Set a real target, not a vague hope. \"Get better at leading\" isn't a goal. A goal has an edge you can actually measure yourself against."),
    paragraph("7. Treat every rep as practice, including the failed ones. Skill comes from repetition, and repetition includes the attempts that didn't work. The leaders who improve fastest are the ones who mine their failures for the lesson instead of just moving past them."),
    paragraph("8. Check the scoreboard on purpose. A goal with no way to track progress produces the same result as no goal at all — you find out you missed it only once it's too late to adjust."),
    paragraph("9. Stay honest about your own mistakes, even when no one's watching closely. The leaders people trust most aren't the ones who never get anything wrong. They're the ones who admit it plainly when they do, without waiting to be caught."),
    callout("tip", "None of these nine require a title. All nine require the same thing: doing them on a day nobody's checking."),
    paragraph("Pick one, not all nine at once. A leader who tries to build all nine habits simultaneously usually abandons all nine within a month. A leader who genuinely builds one habit at a time, for a real stretch of weeks before adding the next, actually ends up with all nine eventually — just slower, and slower turns out to be the version that actually sticks."),
    callout("tip", "This mirrors the Five-Step Process from Section 2 exactly, applied to yourself instead of someone else you're developing. You don't skip from stage one to stage five in your own growth any more than you'd expect someone else to."),
    paragraph("That symmetry is worth sitting with before moving to this module's final section: the same patience this module keeps asking you to extend to the people you're developing is the patience you'll need to extend to yourself while building these nine habits."),
    paragraph("Notice the connection to everything else in this module: a leader who hasn't built these nine habits in themselves is trying to coach someone else toward a standard they haven't actually met. The five-step process, the three skills, the five-question conversation — all of it works better, and rings more true, coming from someone who's visibly still practicing the same discipline they're asking someone else to build."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these nine, which one — if you actually built it into a weekly habit — would change the most about your leadership six months from now?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Paul and Timothy ────────────────────────────────────────────

const section6 = {
  section_number: 6,
  title: "Paul and Timothy",
  blocks: [
    heading(2, "Paul and Timothy"),
    paragraph("Paul's instruction to Timothy in his second letter describes something close to a complete theory of multiplication in a single sentence: what Timothy had learned from Paul, he was to entrust to reliable people who would then be able to teach others also. That's four generations named in one verse — Paul, Timothy, the people Timothy would teach, and the people those people would go on to teach."),
    paragraph("Notice what the instruction doesn't say. It doesn't say Timothy should simply repeat what Paul taught him word for word to as many people as possible. It says he should entrust it to people qualified to teach it themselves — the same fifth stage from Section 2, made explicit two thousand years earlier. Development was never complete when the student understood. It was complete when the student could develop someone else."),
    callout("warning", "This is a genuinely high bar, worth naming honestly: most leaders are comfortable stopping at \"I taught them well.\" Paul's instruction to Timothy stops nowhere short of \"they can now teach others well.\" That's a different, harder standard — and it's the one this whole module has actually been building toward."),
    paragraph("Bill Campbell's real measure wasn't the individual brilliance of any single executive he coached — it was that Google itself began teaching his principles to its own emerging leaders after he died, which means his coaching outlived him by design, not accident. John Wooden's real measure wasn't ten championships — it was that Kareem Abdul-Jabbar and Bill Walton kept his standard alive for decades in how they led and mentored others themselves. Paul's instruction to Timothy is the same test, two thousand years earlier: development isn't finished at understanding. It's finished at multiplication."),
    callout("tip", "A practical version of this same test: ask yourself who, specifically, learned to coach from watching you coach. Not who you helped. Who's now doing for someone else what you did for them."),
    paragraph("For most leaders, the honest answer to that question is a shorter list than they'd like it to be. That's not a failure — it's simply the actual starting point, and starting points are what the rest of this module has been trying to give you something to do with."),
    callout("scripture", "Paul's confidence in Timothy wasn't blind optimism — it was built on years of watching him actually do the work first. The instruction to entrust it further only came after that record existed."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the people you've genuinely developed, how many are currently developing someone else? If the honest answer is none, what's actually stopping that fourth generation from starting?",
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
    paragraph("This module gave you what Modules 5 and 8 argued for but never fully explained: a specific process for developing someone else, three foundational skills underneath it, a five-question conversation structure, and Paul's own two-thousand-year-old standard for when development is actually finished. None of it works as theory. It only works as repetition."),
    paragraph("Two very different figures ran through this module — a football coach turned Silicon Valley legend, and a basketball coach who built ten championships and, more importantly, two lifelong mentees. Neither one had a title that required them to coach the way they did. Both did it anyway, for decades, on ordinary days nobody was checking."),
    pullQuote("You don't build a legacy by being the best in the room. You build it by making sure the room doesn't need you anymore."),
    paragraph("The math from Section 1 is worth returning to at the very end: a leader who never develops anyone stays capped at their own personal output for their entire career. A leader who actually runs the process in this module — imperfectly, slowly, with real setbacks along the way — starts producing more than they ever could have alone, and keeps producing it long after they've moved on to something else."),
    paragraph("Module 10 picks up the piece this module leaves open: what happens in the conversation when development isn't the issue, and performance genuinely has to be addressed directly."),
    videoPlaceholder("2-3 min closing from Denis — on someone he personally developed who's now developing someone else, and what that fourth generation actually took to reach."),
    divider(),
    scorecard("Coaching & Developing Self-Audit", "module9_coaching_developing", [
      { key: "listening", label: "Active Listening — I ask before I advise", max: 10, helpText: "In your last three coaching conversations, did you ask more than you told?" },
      { key: "questions", label: "Powerful Questions — I ask open questions, not leading ones", max: 10, helpText: "Could you name three genuinely open questions you've asked this month?" },
      { key: "stage", label: "Process — I'm actually moving people through the five stages, not stuck at delegation", max: 10, helpText: "Name the specific stage you're at with the person you're developing right now." },
      { key: "multiplication", label: "Multiplication — the people I've developed are developing others", max: 10, helpText: "How many fourth-generation developers can you actually name?" },
    ]),
    assignmentPrompt(
      "Week 9 Assignment",
      "This assignment asks you to run the Five-Step Process on someone real, starting this week, with an actual plan rather than a general intention.",
      [
        {
          number: 1,
          heading: "Choose Your Person",
          guidance: "Name one specific person you are going to deliberately develop over the next 30 days — not hypothetically, someone real, with a real next step."
        },
        {
          number: 2,
          heading: "Locate the Stage",
          guidance: "Using Section 2's five stages, name honestly where you actually are with this person right now, and what the next stage would concretely look like."
        },
        {
          number: 3,
          heading: "Plan the Conversation",
          guidance: "Using Section 4's five questions, plan out how you'll actually run your next real coaching conversation with this person — not a script, but real specifics for each question."
        },
        {
          number: 4,
          heading: "Define the Fourth Generation",
          guidance: "Applying Paul's standard from Section 6: what would it actually look like for this specific person to eventually develop someone else? Name what capability they'd need to have reached."
        },
        {
          number: 5,
          heading: "Pick One Habit",
          guidance: "Of the Nine Habits in Section 5, which one will you actually practice this week — not intend to, practice — and how will you know if you actually did?"
        }
      ],
      200,
      800
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7];

const module9 = {
  module_number: 9,
  title: "Coaching & Developing People",
  subtitle: "The Mechanics of Multiplication",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "One lit candle touching an unlit candle, both now equally bright",
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

console.log(`Module 9 — "${module9.title}"`);
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

fs.writeFileSync('module9_leadership.json', JSON.stringify(module9, null, 2));
console.log(`\nWritten to module9_leadership.json`);
