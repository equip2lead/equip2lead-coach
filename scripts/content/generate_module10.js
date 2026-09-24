// Module 10 — "Feedback & Managing Performance"
// Original content throughout, synthesizing staged library material
// (Toolkit's 3x3 model and accountability content, the book's
// six-question feedback framework), plus independently verified
// external material (Kim Scott's Radical Candor).

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

// ─── SECTION 1 — The Conversation You've Been Avoiding ─────────────────────

const section1 = {
  section_number: 1,
  title: "The Conversation You've Been Avoiding",
  blocks: [
    heading(2, "Feedback & Managing Performance"),
    paragraph("Module 10 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 10 — the module built around the specific conversation most leaders keep postponing."),
    callout("info", "Who this is for: Every leader who completed Modules 1-9. You know how to develop people who are growing. This module is for the harder case — someone who isn't."),
    callout("info", "Core promise: By the end of this module, you'll have a real structure for giving feedback that actually lands, and a way to tell the difference between a coaching problem and a performance problem — because they require different responses."),
    callout("info", "Time commitment: Roughly 75-85 minutes of reading and reflection, plus assignment work."),
    callout("info", "This module draws on a real, independently verified source: Kim Scott's Radical Candor framework, developed from her own management experience at Google and Apple."),
    callout("info", "Who this is for, once more, plainly: leaders who've already built the skill to coach someone growing, and now need the harder skill of addressing someone who isn't."),
    divider(),
    heading(2, "The Conversation You've Been Avoiding"),
    paragraph("Almost every leader can name a specific conversation they've been putting off — a piece of direct feedback, a performance issue that needs to be named plainly, a pattern that's been tolerated for months longer than it should have been. Module 9 covered coaching someone who's genuinely growing. This module covers what happens when growth has stalled, and the leader has to say something harder than a question."),
    callout("tip", "The delay itself has a cost that's easy to underestimate. Every week a real performance issue goes unnamed, the person involved assumes silence means it's not actually a problem — which means the eventual conversation, whenever it finally happens, lands as a much bigger surprise than it should."),
    paragraph("Kim Scott, who managed teams at Google and later taught leadership at Apple, tells a story in her own book about an employee she calls \"Bob\" — well-liked, earnest, and consistently underperforming. For ten months, she gave him only gentle, encouraging feedback, softening every real critique because it felt kinder. She eventually had to fire him. As he walked out, he turned and asked her one question: \"Why didn't anyone tell me?\""),
    videoEmbed("O9hDTLo5rLA", "How to Lead With Radical Candor | Kim Scott | TEDxPortland"),
    paragraph("In that talk, Scott opens with the exact question this module is built around: how do you say what you mean without being mean? Her answer isn't a script. It's the two-axis framework this section has already introduced — care personally, challenge directly — applied to real, specific workplace moments rather than left as an abstract principle."),
    callout("warning", "Scott later named this pattern \"ruinous empathy\" — caring about someone's feelings so much that you withhold the direct feedback they actually need to improve. It feels like kindness in the moment. It's frequently the opposite: ten months Bob could have spent either improving or finding a role that genuinely fit him, spent instead not knowing there was a problem at all."),
    paragraph("Scott's own conclusion, drawn directly from that experience: the softened feedback hadn't actually protected Bob's feelings. It had protected her own comfort, at his expense, for ten real months. That distinction is worth sitting with, because it reframes the whole avoidance instinct — the leader who delays a hard conversation to be kind is very often being kind to themselves, not to the person they're protecting."),
    callout("warning", "This reframe is uncomfortable precisely because it's accurate. Checking it honestly requires asking, in the moment of hesitation, who the delay is actually protecting — and sitting with the answer even when it isn't the one that feels better."),
    callout("tip", "This module isn't arguing for harshness as the alternative to avoidance. It's arguing for timeliness. The same feedback, delivered ten months earlier, would have been kind in a way the delayed version never could be — because it would have left Bob time to actually do something with it."),
    image({
      type: "flat editorial illustration, muted navy/gold palette",
      content: "Two chairs facing each other across a small table, one chair empty and slightly pulled back, the other occupied — a conversation that hasn't started yet, but is clearly about to",
      width: 1200,
      height: 675
    }),
    paragraph("Everything in this module follows from that reframe. A leader who's genuinely avoiding a hard conversation to protect someone else's feelings is rare. A leader avoiding it to protect their own comfort is common — and worth naming honestly before the module moves any further."),
    callout("info", "The rest of this module gives you specific tools for the conversation itself — a feedback model, a six-question structure, and a way to tell when the conversation needs to move from coaching to something more direct."),
    paragraph("None of these tools remove the discomfort of having the conversation. What they do is remove the excuse of not knowing how to structure it — which, for most leaders, turns out to be a significant part of why the conversation kept getting postponed in the first place."),
    callout("tip", "Worth naming plainly before moving on: the discomfort itself never fully goes away, even for leaders who've had hundreds of these conversations. What changes with practice is the delay between noticing the issue and actually addressing it — not the discomfort of addressing it."),
    paragraph("That's actually good news, in a specific way: waiting to feel ready before having the conversation is waiting for something that may never arrive. The skill this module teaches isn't becoming comfortable with the discomfort. It's acting despite it, consistently, on a shorter timeline than avoidance would naturally allow."),
    callout("info", "Four real tools follow: a feedback model simple enough to actually use, a six-question conversation structure, a way to build accountability into the environment rather than enforce it after the fact, and a clear way to recognize when coaching has stopped working."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Name the specific conversation you've been postponing right now. How long have you actually been avoiding it?",
      ]
    ),
  ]
};

// ─── SECTION 2 — A Feedback Model Simple Enough to Actually Use ────────────

const section2 = {
  section_number: 2,
  title: "A Feedback Model Simple Enough to Actually Use",
  blocks: [
    heading(2, "A Feedback Model Simple Enough to Actually Use"),
    paragraph("Most feedback fails not because the content is wrong, but because the structure is either missing entirely or too complicated to actually remember in the moment. A simple three-part structure removes that excuse."),
    table(
      ["Part", "What it actually covers"],
      [
        ["Three things done well", "Specific, not generic — \"the way you handled that client call\" rather than \"good job this week\""],
        ["Three things to improve", "Named plainly, without softening them into something unrecognizable"],
        ["Three actions for next time", "Concrete enough that both people would describe them the same way afterward"],
      ]
    ),
    callout("warning", "The number three matters more than it looks like it should. One strength feels like a consolation prize. Ten feels like a performance review nobody has time to actually absorb. Three is enough to be real without being overwhelming — for both people in the conversation."),
    paragraph("This model is really Scott's two axes made mechanical. The three strengths are where care personally shows up concretely — genuine, specific recognition, not a warm-up before the real point. The three improvements are where challenge directly happens — named plainly, not buried. A leader who only ever fills out the first third of this model is drifting toward ruinous empathy without noticing. A leader who only fills out the second third is drifting toward the opposite failure — feedback that's accurate but landed without any evidence the leader actually values the person receiving it."),
    callout("tip", "The third part of the model — three actions for next time — is the one most often skipped entirely, and it's the one that actually determines whether the conversation changes anything. Strengths and weaknesses without a next action is just an assessment. The action is what makes it feedback rather than commentary."),
    paragraph("Notice, too, that the actions belong to the person receiving feedback, not the leader delivering it. A leader who writes all three actions themselves and simply announces them has quietly turned the conversation back into a one-way process — the same failure question five in Section 3 exists specifically to prevent."),
    callout("tip", "This model works equally well in a two-minute hallway conversation or a scheduled sit-down — the format isn't what matters. What matters is that all three parts actually happen, in that order, every time it's used."),
    paragraph("Order matters more than it might seem. Leading with what needs to improve, before establishing that the leader has actually noticed what's working, tends to land as criticism rather than feedback — even when the same three improvements would have landed fine in the other order."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of the last time you gave someone feedback. Did it actually follow a structure, or was it improvised in the moment?",
      ]
    ),
  ]
};

// ─── SECTION 3 — Six Questions That Replace a Performance Review ───────────

const section3 = {
  section_number: 3,
  title: "Six Questions That Replace a Performance Review",
  blocks: [
    heading(2, "Six Questions That Replace a Performance Review"),
    paragraph("A formal annual review, delivered once a year, is usually too infrequent to actually change anything — by the time it happens, the patterns it addresses are already months old. Six questions, asked far more regularly, do more real work than the review most organizations still treat as the primary feedback mechanism."),
    paragraph("Notice the actual progression across the six: alignment first, then recognition, then correction, then support, then the leader's own accountability, then genuine dialogue. Skipping any one of them leaves a real gap — a leader who asks the first four well but never the fifth is still, underneath a good process, running a one-directional relationship."),
    paragraph("A short version of this in practice: rather than \"How's it going?\" — vague enough that most people answer \"fine\" reflexively — try asking each of the six in turn, briefly, over the course of one real conversation. The difference in what actually gets said is usually immediate and noticeable to both people in the room."),
    table(
      ["Vague version", "What it usually gets back"],
      [
        ["\"How's it going?\"", "\"Fine, thanks.\""],
        ["\"Any feedback for me?\"", "\"No, I think we're good.\""],
        ["\"Are we good?\"", "\"Yeah, all good.\""],
      ]
    ),
    paragraph("None of the vague versions are dishonest exactly — they're just too broad to actually surface anything real. The six questions below work because each one is narrow enough that a reflexive \"fine\" doesn't quite answer it."),
    numbered("Are we headed in the same direction? Alignment first, before anything else gets discussed.", 1),
    numbered("What's going well? Not flattery — genuine, specific recognition of what's actually working.", 2),
    numbered("What can improve? Named directly, without burying it inside praise.", 3),
    numbered("How can I help? A real offer, not a rhetorical one — followed through on.", 4),
    numbered("Where can I improve? The leader's own turn to receive feedback, not just give it.", 5),
    numbered("What do you think? The question that turns a monologue into an actual conversation.", 6),
    paragraph("Not every conversation needs all six. A quick check-in might only need the first two. A genuine course-correction probably needs all six, in order, without skipping ahead to the questions that feel more comfortable."),
    callout("tip", "Notice question five specifically. A leader who only ever asks the other five questions is still running feedback as a one-way process — information flowing down, never up. Question five is what makes it a real conversation instead of a review with extra steps."),
    paragraph("These six questions don't need a formal meeting to work. Some of the most useful versions of this conversation happen in five minutes, walking somewhere together, rather than scheduled as a sit-down review. The structure matters more than the setting — a leader who asks all six questions informally, regularly, is doing more real feedback work than one who asks none of them at a perfectly scheduled quarterly review."),
    callout("warning", "A leader who only asks these questions once a year, at a formal review, is really running the same broken system this section opened by criticizing — just with better-sounding questions attached to it. Frequency is what makes this structure actually work. A single well-designed conversation, repeated once annually, changes almost nothing."),
    paragraph("A reasonable cadence for most working relationships: something close to weekly for the first four questions, and something closer to monthly for the full six, including the harder fifth and sixth. Adjust based on the actual relationship — someone newer to a role usually needs the fuller version more often than someone who's been doing the work for years."),
    callout("info", "None of these cadences are fixed rules. They're starting points — adjust based on what actually works for the specific people involved, and revisit the cadence itself periodically rather than assuming it's still right forever."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "When did you last genuinely ask someone you lead where you could improve — and actually receive the answer without defending yourself?",
      ]
    ),
  ]
};

// ─── SECTION 4 — Building a Culture of Accountability ──────────────────────

const section4 = {
  section_number: 4,
  title: "Building a Culture of Accountability",
  blocks: [
    heading(2, "Building a Culture of Accountability"),
    paragraph("Accountability gets treated as something a leader enforces on other people. In practice, it only actually works as something a leader builds into the environment — a set of conditions where people hold themselves to a standard because the standard is genuinely shared, not imposed from above."),
    paragraph("This starts with the leader's own visible behavior. A leader who holds others accountable while quietly excusing their own missed commitments is building a culture of resentment, not accountability. The standard has to apply first, and most visibly, to the person setting it."),
    callout("warning", "A common failure mode: accountability gets treated as something that only shows up after something has already gone wrong — a corrective measure rather than a standing expectation. Real accountability cultures clarify expectations clearly enough, up front, that most problems never reach the point of needing correction at all."),
    paragraph("Module 6 covered two real examples worth returning to here specifically, because accountability and trust are really the same discipline viewed from different angles. Feuerstein kept paying his employees for ninety days not because a policy required it, but because he'd effectively held himself accountable to a standard nobody was forcing on him. Burke's Tylenol recall worked as crisis management precisely because Johnson & Johnson had a genuine, pre-existing culture of taking responsibility rather than deflecting it — the recall wasn't an aberration from their normal behavior, it was consistent with it."),
    callout("tip", "This is the actual test for whether an organization has a real accountability culture or just an accountability policy: does the standard hold up specifically in the moment it's most expensive to keep, or does it quietly bend the moment enforcing it costs something real?"),
    paragraph("A practical version of the same test, scaled down to an individual leader: think of the last time someone on your team missed a real commitment. Did the consequence you'd described in advance actually happen, or did the moment arrive and the standard quietly softened because enforcing it felt uncomfortable? Most leaders can answer this honestly if they actually stop to check — and most don't like what they find the first time they do."),
    callout("warning", "One inconsistency doesn't destroy an accountability culture on its own. What destroys it is the pattern becoming predictable — people learning, correctly, that the standard only applies when enforcing it happens to be convenient."),
    paragraph("This connects directly to Module 6's Trust Equation from earlier in the track: Consistency, one of its four components, is really this same idea applied to expectations rather than promises. A leader whose standards hold in the expensive moments is trusted with real authority precisely because the standard has already been tested and proven reliable."),
    callout("tip", "A quick test worth running honestly: name your team's actual standards, then name the last time each one was tested by something genuinely inconvenient. A standard that's never been tested isn't yet a real standard — it's just a stated intention."),
    callout("tip", "Accountability, trust, and feedback turn out to be three names for closely related work, not three separate skills. A leader strong in one and weak in the others usually discovers the weak one eventually undermines the strong ones."),
    paragraph("This is why the four sections in this module aren't really four separate topics. They're four angles on one discipline: telling the truth, on time, in a structure the other person can actually use, and holding the resulting standard consistently enough that the truth-telling itself becomes something people can rely on rather than something that arrives unpredictably."),
    callout("info", "Section 5 takes this discipline to its hardest edge: what happens when the truth has already been told, repeatedly, and nothing has changed."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of a standard you hold your team to. Do you visibly hold yourself to the same one, or is there a quiet exception for yourself?",
      ]
    ),
  ]
};

// ─── SECTION 5 — When Coaching Isn't Enough ─────────────────────────────────

const section5 = {
  section_number: 5,
  title: "When Coaching Isn't Enough",
  blocks: [
    heading(2, "When Coaching Isn't Enough"),
    paragraph("Module 9's whole approach assumed genuine growth was underway — questions instead of answers, patience instead of urgency. That approach has a real limit. When the same issue has been coached repeatedly with no real change, the leader is facing a different problem than the one coaching is built to solve, and continuing to coach it is often just a more comfortable way of continuing to avoid it."),
    paragraph("Kim Scott's framework, introduced in Section 1, has a name for the opposite failure too — not ruinous empathy, but the two axes that actually define good feedback: genuinely caring about the person, and being willing to challenge them directly. Most leaders are strong on one axis and weak on the other. A leader who only challenges, without visible care, produces feedback people resent rather than use. A leader who only cares, without ever directly challenging, produces exactly the ten months Bob lost. Neither axis alone is enough."),
    table(
      ["Signal", "What it usually means"],
      [
        ["The same feedback keeps repeating with no change", "This has moved past a skill gap into a will or fit problem"],
        ["The person seems surprised by feedback that's been given before", "The earlier feedback wasn't actually clear, or wasn't actually heard"],
        ["Other team members have started quietly compensating", "The cost of inaction has already spread beyond the one person involved"],
      ]
    ),
    callout("warning", "This is the conversation most leaders delay longest, because it requires abandoning the comfortable story that one more coaching conversation will finally work. Sometimes it will. The skill this section is actually asking for is recognizing, honestly, when it already hasn't — repeatedly — and acting on that instead of hoping the next attempt is different."),
    paragraph("The conversation itself doesn't need to be harsh to be direct. It needs three things a coaching conversation doesn't require: a clear statement of the specific gap, a clear and reasonable timeline for closing it, and clear, stated consequences if it isn't closed. All three, said plainly, in the same conversation."),
    table(
      ["Coaching conversation", "Performance conversation"],
      [
        ["Open-ended, exploratory", "Specific, direct"],
        ["No fixed deadline", "A real, stated timeline"],
        ["No stated consequence", "Consequences named plainly, in advance"],
        ["Goal: the person discovers the answer", "Goal: the gap actually closes, discovery or not"],
      ]
    ),
    paragraph("Neither column is the right approach in general. Each is right for a specific situation, and the actual leadership skill this module is asking for is correctly diagnosing which situation you're in before choosing which column to run."),
    callout("tip", "A rough guide for the diagnosis: if this is the first or second time the issue has come up, run the coaching column. If it's the third or later, and the previous attempts genuinely used the same structure, it's time for the performance column instead."),
    paragraph("This isn't a punishment for the person, even though it can feel that way to deliver. It's actually the more respectful move — treating someone as capable of hearing a direct statement of fact and responding to it like an adult, rather than continuing to manage around the problem as though they couldn't handle being told."),
    callout("tip", "Kim Scott's Bob would very likely have preferred the direct version, delivered early, even if it stung more in the moment. His actual question on the way out wasn't \"why was that so hard to hear\" — it was why nobody told him at all."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Is there a performance issue you've coached repeatedly with no real change? What would actually naming that plainly — gap, timeline, consequence — sound like?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Closing & Assignment ───────────────────────────────────────

const section6 = {
  section_number: 6,
  title: "Closing & Assignment",
  blocks: [
    heading(2, "Closing & Assignment"),
    paragraph("This module gave you what most leadership training skips: not just how to encourage people who are already growing, but how to actually name what isn't working, structure feedback simply enough to use it consistently, and recognize the specific point where coaching stops being the right tool."),
    paragraph("The goal underneath every tool in this module was never to be liked for being nice. It was to be trusted for being honest, consistently, in a way that actually helped people do better work and build fuller careers because of it."),
    table(
      ["Tool", "When to use it"],
      [
        ["The 3x3 model", "Any specific feedback conversation, formal or informal"],
        ["The six questions", "Regular check-ins, replacing the annual review"],
        ["The accountability test", "Ongoing — checking whether your own standards hold under real cost"],
        ["Gap, timeline, consequence", "When coaching has already been tried, repeatedly, with no change"],
      ]
    ),
    paragraph("Kim Scott's Bob asked one real question on his way out the door: why didn't anyone tell him? Every tool in this module — the 3x3, the six questions, the accountability standard, the gap-timeline-consequence structure — exists to make sure that question never has to be asked about anyone you lead."),
    callout("info", "This module closes out the Performance Leadership pillar. Module 11 opens the final pillar — Multiplication & Impact — with a different question entirely: not how you develop the people directly in front of you, but what you leave behind once you're no longer in the room at all."),
    pullQuote("The kindest thing you can do for someone struggling isn't silence. It's telling them clearly enough, soon enough, that they actually have time to do something about it."),
    videoPlaceholder("2-3 min closing from Denis — on a feedback conversation he personally delayed too long, and what the delay actually cost."),
    divider(),
    heading(3, "Before the Assignment"),
    paragraph("The scorecard below isn't a grade — nobody sees it but you. Its only purpose is naming, honestly, where you actually stand on the four things this module has been building."),
    scorecard("Feedback & Accountability Self-Audit", "module10_feedback_accountability", [
      { key: "frequency", label: "Frequency — I give real feedback regularly, not just at formal reviews", max: 10, helpText: "When did you last give someone specific feedback outside of a scheduled review?" },
      { key: "directness", label: "Directness — I name what needs to improve plainly, not softened past recognition", max: 10, helpText: "Could the last person you gave feedback to accurately repeat back what you actually said?" },
      { key: "receiving", label: "Receiving — I genuinely ask where I need to improve, and actually hear the answer", max: 10, helpText: "When did you last ask someone you lead for feedback on yourself?" },
      { key: "escalation", label: "Escalation — I recognize when coaching has stopped working and act differently", max: 10, helpText: "Is there a repeated issue you're still coaching that actually needs a harder conversation?" },
    ]),
    assignmentPrompt(
      "Week 10 Assignment",
      "This assignment asks you to actually run the feedback conversation you've been postponing, using the tools from this module rather than improvising it.",
      [
        {
          number: 1,
          heading: "Name the Postponed Conversation",
          guidance: "Name the specific feedback conversation you've been avoiding — real names, real specifics, not a hypothetical."
        },
        {
          number: 2,
          heading: "Build the 3x3",
          guidance: "For that specific person, write out three genuine strengths, three specific areas to improve, and three concrete next actions."
        },
        {
          number: 3,
          heading: "Diagnose: Coaching or Performance?",
          guidance: "Using Section 5's signals, decide honestly whether this is still a coaching conversation or has moved into a performance conversation requiring a gap, timeline, and consequence."
        },
        {
          number: 4,
          heading: "Have the Conversation",
          guidance: "Schedule and have the actual conversation within the next two weeks. Afterward, write honestly about what happened — not what you planned to say, what actually occurred."
        },
        {
          number: 5,
          heading: "Ask for Feedback on Yourself",
          guidance: "In that same conversation or a separate one, genuinely ask someone you lead where you could improve. Write down what they said, even if it was hard to hear."
        }
      ],
      200,
      800
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6];

const module10 = {
  module_number: 10,
  title: "Feedback & Managing Performance",
  subtitle: "The Conversation You've Been Avoiding",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "Two chairs facing each other, a conversation about to start",
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

console.log(`Module 10 — "${module10.title}"`);
console.log(`Simulated splitter produced ${simSections.length} sections (expect 6):`);
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

fs.writeFileSync('module10_leadership.json', JSON.stringify(module10, null, 2));
console.log(`\nWritten to module10_leadership.json`);
