// Module 3 — "Emotional Intelligence: The Leader's Inner Edge"
// Built directly in the CORRECTED production schema (learned from Module 2's
// four ingestion blockers), so no second round-trip should be needed.

const fs = require('fs');

// ─── Block helpers — production-verified schema ────────────────────────────

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const divider = () => ({ type: "divider", data: {} });

// Allowed variants only: note | info | warning | tip | scripture
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

// Corrected schema: {youtubeId, title} only
const videoEmbed = (youtubeId, title) => ({
  type: "video_embed",
  data: { youtubeId, title }
});

const videoPlaceholder = (description) => callout("note", `[VIDEO PLACEHOLDER — pending recording] ${description}`);
const imagePlaceholder = (description) => callout("note", `[IMAGE PLACEHOLDER — pending generation] ${description}`);
// A real image once its file exists, a placeholder until then — see
// generate_module5.js for the same helper and the reasoning behind it.
const image = (spec) =>
  spec.url
    ? { type: "image", data: { url: spec.url, alt: spec.alt } }
    : imagePlaceholder(`${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);
const recommendedLink = (title, url_hint, note) => callout("info", `${title} — ${url_hint}. ${note}`);

// ─── SECTION 1 — What Is Emotional Intelligence ────────────────────────────

const section1 = {
  section_number: 1,
  title: "What Is Emotional Intelligence",
  blocks: [
    // Module front matter — same pattern as Module 2
    heading(2, "Emotional Intelligence: The Leader's Inner Edge"),
    paragraph("Module 3 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary welcome video, real per-module recordings to follow"),
    callout("info", "Who this is for: Every leader who completed Modules 1 and 2. This module assumes you've already done the character work — now it asks whether you can actually read and manage what's happening inside you in real time, not just in principle."),
    callout("info", "Core promise: By the end of this module, you'll be able to name which of the five domains of emotional intelligence is genuinely your weakest — not the one you'd guess, the one your own patterns actually reveal — and have a concrete practice to strengthen it."),
    callout("info", "Time commitment: Roughly 70-80 minutes of reading and reflection, plus assignment work. Five domains, one section each — don't rush past the ones that feel obvious. Those are often the ones worth the most attention."),
    divider(),
    // Section 1 content
    heading(2, "What Is Emotional Intelligence"),
    paragraph("Daniel Goleman defines emotional intelligence as the ability to recognize, understand, manage, and effectively use your own emotions and the emotions of others. It sounds soft. The research behind it is not."),
    callout("tip", "IQ gets you hired. EQ gets you promoted — and keeps you there."),
    paragraph("Goleman and the Hay Group's research found that emotional intelligence accounts for 67% of the abilities deemed necessary for superior leadership performance. Not 67% of \"soft skills.\" Sixty-seven percent of what actually separates leaders who perform at the highest level from everyone else."),
    paragraph("Technical skill still matters — but it functions as a threshold competency, not a differentiator. It's the minimum required to be in the room. Once you're in the room, everyone around you also cleared that bar. What determines whether you lead well from there almost never shows up on a resume."),
    callout("tip", "Every leader in this room already has the technical competence to do the job. The room stops being sorted by competence the moment everyone in it has it. What sorts it after that is EQ."),
    image({
      url: "/images/module-3/competence-doorway.png",
      alt: "An open door marked COMPETENCE giving onto a bright room of seated people facing forward, with one figure standing alone at the far end. Text at the left reads \"Skills get you in the room. Character takes you further.\"; at the right, \"Same room. Different journey.\""
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of the most technically skilled leader you've ever worked under who still struggled to actually lead people. What was missing?",
        "If you had to guess, before reading the rest of this module, which of the five domains would you privately name as your weakest?"
      ]
    ),
  ]
};

// ─── SECTION 2 — Self-Awareness ─────────────────────────────────────────────

const section2 = {
  section_number: 2,
  title: "Self-Awareness",
  blocks: [
    heading(2, "Self-Awareness"),
    callout("note", "[INTERACTIVE PLACEHOLDER — pending Claude Code implementation] mood_checkin block. See MOOD_CHECKIN_SPEC.md for schema. Renders before any section content — reader selects a current mood, sees a one-line reflection tied to the module, then proceeds."),
    paragraph("The first domain, and the one every other domain depends on: knowing your own emotions as they happen — not an hour later, not in hindsight, as they happen."),
    table(
      ["Signs of high self-awareness", "Signs of low self-awareness"],
      [
        ["You can name what you're feeling accurately, in the moment", "You are often surprised by your own reactions"],
        ["You know your strengths and limitations honestly", "Others describe you differently than you describe yourself"],
        ["You have a strong sense of your own values and purpose", "You cannot explain why you made certain decisions"],
        ["You are not defensive when receiving feedback", "Feedback tends to trigger justification before reflection"],
      ]
    ),
    callout("tip", "Self-awareness is the foundation every other EQ competency stands on. You cannot manage what you cannot see. You cannot regulate an emotion you haven't yet noticed you're having."),
    paragraph("This is worth sitting with rather than skimming past. Most leaders assume they're self-aware because they think about themselves often. Self-awareness isn't the frequency of self-reflection — it's the accuracy of it. A leader can journal every night and still be the last person in the room to notice they're the common denominator in every conflict."),
    heading(3, "Why the Gap Is Bigger Than You'd Guess"),
    paragraph("Organizational psychologist Tasha Eurich's research, published in Harvard Business Review, found that roughly 95% of people believe they're self-aware. Somewhere between 10% and 15% actually are. That gap doesn't close with seniority — it often widens, because the higher someone rises, the fewer people around them feel safe enough to say what they're actually seeing."),
    callout("warning", "Executive coach Marshall Goldsmith identified a specific pattern he calls \"adding too much value\": a leader who cannot let an idea pass without improving on it. It reads, from the inside, as diligence and high standards. It reads, from everyone else's seat, as a signal that their thinking is never quite good enough on its own. The leader experiencing this rarely names it in themselves — it shows up first as everyone else's ideas needing work."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "When did someone last describe your reaction to something in a way that surprised you — because it didn't match how you experienced yourself in that moment?",
        "Right now, without overthinking it: what are you actually feeling? Can you name it more specifically than 'fine' or 'stressed'?"
      ]
    ),
  ]
};

// ─── SECTION 3 — Self-Regulation ────────────────────────────────────────────

const section3 = {
  section_number: 3,
  title: "Self-Regulation",
  blocks: [
    heading(2, "Self-Regulation"),
    paragraph("Self-regulation is managing your emotions rather than being managed by them. This is not the same as suppressing them. Suppression just delays the bill — it doesn't cancel it. Self-regulation is processing an emotion wisely, in real time, without either exploding or stuffing it down."),
    pullQuote("Between stimulus and response there is a space. In that space is your power."),
    paragraph("Self-regulation is the disciplined use of that space. It's what happens in the half-second between the thing that happened and the thing you do about it — and for most leaders, under real pressure, that half-second is exactly where control gets lost."),
    heading(3, "What It Looks Like"),
    bullet("Thinking before acting — not eliminating the reaction, just not leading with it. The reaction can still happen internally. What changes is what gets to leave your mouth first."),
    bullet("Creating an environment of trust and fairness, because people can feel whether a leader's mood is the operating system of the room — and they will manage around it if it is, wasting energy on your temperature instead of the actual work."),
    bullet("Being comfortable with ambiguity and change, instead of needing certainty to feel calm. A leader who needs to feel certain before they can feel steady will manufacture false certainty just to get the feeling back."),
    bullet("Not compromising your values under pressure — pressure is precisely when values get tested, not when they're irrelevant. A value you'll only keep when it's convenient was never actually a value. It was a preference."),
    callout("warning", "In high-pressure, high-stakes environments, leaders who cannot self-regulate make reactive decisions that damage teams and relationships. The leader who erupts publicly loses authority immediately — not eventually, immediately. People stop hearing the content of what you say and start managing your mood instead."),
    heading(3, "It Doesn't Have to Be an Eruption"),
    paragraph("Self-regulation failures don't always look like shouting. In 2026, Standard Chartered CEO Bill Winters described employees being replaced by AI as \"lower-value human capital\" — in public, on the record. The words themselves were the failure, not his volume or tone. When the backlash came, he posted an apology on LinkedIn — but alongside it, he reposted the full original remarks, unedited. The apology read as defensive rather than genuine, and the damage compounded instead of closing."),
    callout("tip", "Notice where the actual failure happened. Not in a single unguarded sentence under pressure — plenty of leaders have one of those. The failure was in the response to the response: reposting the very words that caused the harm, instead of pausing long enough to actually hear what had landed wrong. Self-regulation isn't only about the first reaction. It's about whether you can regulate the second one too, once you're already on the defensive."),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary placeholder video, real per-section recordings to follow"),
    heading(3, "This Problem Is Not New"),
    paragraph("Marcus Aurelius, Roman Emperor for nearly two decades, admitted in his own private writings that he struggled with a quick temper. He wasn't handed calm — he built it, deliberately, using what became known as Stoic philosophy, roughly eighteen centuries before Goleman published a word on emotional intelligence."),
    paragraph("The practice itself was simple, and he did it nightly. Meditations wasn't written for an audience — its original title was To Himself, a private notebook he filled during military campaigns, reviewing that day's actions against the standard he'd set for himself: where he'd lost his temper, where he'd let someone else's behavior dictate his own, where he'd have done better. His anchor line, the one his whole practice was built to reinforce: \"You have power over your mind — not outside events.\" Self-regulation, in his hands, wasn't a personality trait he was born with. It was a nightly audit he ran on himself for the rest of his life."),
    callout("tip", "His core insight was the same one this section opened with: calm isn't the absence of strength. It's what strength actually looks like under provocation. A Roman emperor with the power to have anyone in the empire killed on a whim still concluded that rage was weakness dressed up as authority — not the other way around."),
    image({
      url: "/images/module-3/the-pause.png",
      alt: "A close view of a clock face where two hands have almost met, the narrow gap between them marked \"The Pause\". The hand behind is labelled Stimulus, the one ahead Response. Text reads \"A small space makes a big difference\" and \"Pause. Think. Choose.\""
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of the last time you reacted to something at full intensity. Looking back, where in that half-second could you have used the space instead of skipping it?",
        "Who around you has learned to manage your mood instead of trusting your judgment? What would it take for that to change?"
      ]
    ),
  ]
};

// ─── SECTION 4 — Motivation ──────────────────────────────────────────────────

const section4 = {
  section_number: 4,
  title: "Motivation",
  blocks: [
    heading(2, "Motivation"),
    paragraph("The third domain is about what's actually driving you underneath the visible goals — internal values, or external rewards. Both can produce the same behavior for a while. Only one of them survives contact with real adversity."),
    paragraph("Emotionally intelligent leaders are motivated by a deep desire to achieve for the sake of achievement itself, a commitment to goals even in the face of failure, and an optimism and resilience that doesn't depend on things going well to stay intact."),
    callout("warning", "When money, title, and recognition become the primary motivators, a leader's integrity is at risk. Not certainly compromised — at risk. External motivators aren't evil. They just can't be load-bearing."),
    paragraph("Burnout is epidemic among leaders who are externally motivated — driven primarily by approval, recognition, or position. It makes sense once you see the mechanism: external rewards are unreliable and inconsistent by nature, so a leader who depends on them for fuel is running on a supply they don't control. Internally motivated leaders outlast and outlead them every time, not because they're more disciplined, but because their fuel source doesn't require anyone else's cooperation."),
    heading(3, "What the Mechanism Actually Costs"),
    paragraph("Nadya Okamoto, entrepreneur and co-founder of the period-care company August, has spoken publicly about burning out badly enough to end up in emergency rooms and eventually residential rehab. Speaking later on the World Economic Forum's Meet the Leader podcast, she named the mechanism plainly: when your drive depends on external validation, you need a constant, unsustainable supply of it just to keep functioning."),
    callout("tip", "Her own words: if you're intrinsically motivated, you don't need as much of the external stuff. The leaders who recover from burnout well aren't usually the ones who found more approval. They're the ones who stopped needing as much of it."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "If the recognition for your current role disappeared tomorrow but the work itself stayed exactly the same, would you keep doing it with the same energy?",
        "Name one goal you are currently pursuing. Underneath it, honestly, is the deeper driver achievement itself, or what achieving it would get you from other people?"
      ]
    ),
  ]
};

// ─── SECTION 5 — Empathy ─────────────────────────────────────────────────────

const section5 = {
  section_number: 5,
  title: "Empathy",
  blocks: [
    heading(2, "Empathy"),
    paragraph("Empathy is understanding the emotional makeup of others and responding skillfully to it. It is not sympathy. Sympathy is feeling what someone else feels — a private, internal experience. Empathy is understanding what someone else feels, accurately enough to actually respond to it. You can have deep sympathy and still lead badly, because sympathy doesn't require you to do anything with what you're feeling. Empathy does."),
    videoEmbed("1Evwgu369Jw", "Brené Brown on Empathy | RSA Shorts (animated)"),
    { type: "quiz", data: {"scope": "video_check", "title": "Quick Check: Empathy vs. Sympathy", "questions": [{"id": "q1", "prompt": "According to this animated short, what is the key difference between empathy and sympathy?", "options": [{"id": "a", "text": "Empathy is more emotional, sympathy is more logical"}, {"id": "b", "text": "Empathy means connecting with the feeling underneath someone's experience by \"climbing down\" into it with them; sympathy stays at a distance"}, {"id": "c", "text": "Sympathy requires more effort than empathy"}, {"id": "d", "text": "They are simply two words for the same response"}], "explanation": "The short's central image — climbing down into someone's hole rather than shouting encouragement from the top — is exactly this section's point: empathy requires proximity, not just good intentions.", "correct_option_id": "b"}, {"id": "q2", "prompt": "What does the video suggest rarely helps someone who is struggling?", "options": [{"id": "a", "text": "Sitting with them in silence"}, {"id": "b", "text": "Responses that immediately try to silver-line the situation (\"at least...\")"}, {"id": "c", "text": "Acknowledging their feelings directly"}, {"id": "d", "text": "Asking what they need"}], "explanation": "The short calls out \"at least\" statements as a common, well-intentioned but ultimately unhelpful reflex.", "correct_option_id": "b"}]} },
    heading(3, "What Empathetic Leaders Do"),
    bullet("Listen attentively before responding — not while composing their response. There's a specific, familiar feeling of being talked at by someone who's already decided what they'll say next. People know the difference immediately."),
    bullet("Read group and individual emotional dynamics, not just individual words. What's said in a meeting and what's actually happening in the room are frequently two different conversations."),
    bullet("Recognize cultural differences in emotional expression, rather than assuming their own culture's norms are universal. Restraint isn't always disengagement. Directness isn't always disrespect."),
    bullet("Develop and retain people, because people stay where they feel genuinely seen — not just managed. Compensation buys tenure. Being seen buys loyalty, and loyalty is what survives the moment a better offer shows up."),
    callout("tip", "Ubuntu — \"I am because we are\" — is an empathy-based worldview at the root of much African leadership culture. It says a leader's identity is inseparable from the community they lead, not positioned above it."),
    paragraph("A related Zulu greeting, sawubona, translates roughly as \"I see you\" — not a polite formality, but a claim: I see you, specifically, not just your role or your usefulness to me. The traditional reply, ngikhona, means \"I am here.\" The exchange implies something worth sitting with: identity, in this frame, is partly constituted by being seen. It's a compact, everyday enactment of exactly what this section has spent several paragraphs defining."),
    videoEmbed("r3wyCxHtGd0", "Daniel Goleman: Why Aren't We All Good Samaritans? | TED"),
    { type: "quiz", data: {"scope": "video_check", "title": "Quick Check: Why Aren't We All Good Samaritans?", "questions": [{"id": "q1", "prompt": "In the Princeton seminary study Goleman describes, what caused divinity students to walk past someone in visible distress, even on their way to give a sermon on the Good Samaritan?", "options": [{"id": "a", "text": "They genuinely lacked compassion"}, {"id": "b", "text": "They were rushed — being in a hurry, not a lack of caring, was the deciding factor"}, {"id": "c", "text": "They didn't notice the person at all"}, {"id": "d", "text": "The study found no significant effect"}], "explanation": "This is the section's key mechanism — empathy failures are often about attention and urgency, not character, which is exactly why this section frames empathy as requiring deliberate focus.", "correct_option_id": "b"}, {"id": "q2", "prompt": "What does Goleman suggest about the relationship between noticing someone's distress and actually acting on it?", "options": [{"id": "a", "text": "Noticing automatically leads to action"}, {"id": "b", "text": "There is a real gap between registering someone's need and doing something about it — closing that gap takes deliberate attention"}, {"id": "c", "text": "Compassion is an innate trait some people simply lack"}, {"id": "d", "text": "Acting on compassion always requires significant resources"}], "explanation": "Most people have the capacity to notice; the leadership skill is building the habit of actually closing the gap between noticing and acting.", "correct_option_id": "b"}]} },
    paragraph("Goleman's own research explains why empathy so often fails at exactly the moment it's needed most: it isn't usually a character defect, it's misdirected attention. A famous study at Princeton's seminary found that divinity students — preparing to preach on the parable of the Good Samaritan, of all topics — still walked past a person in visible distress on their way to give the sermon, if they were rushed. Compassion didn't disappear. Focus did."),
    paragraph("This matters for a specific reason: African leaders who lose empathy lose their cultural authority, not just their positional authority. A title can survive a leader who stops listening. A community's trust rarely does."),
    image({
      url: "/images/module-3/ubuntu-circle.png",
      alt: "Seen from above, nine people of different ages and skin tones stand in a ring with their hands stacked together at the centre. No one is raised above the others. Text reads \"Ubuntu — I am because we are\", \"People. Purpose. Together.\" and \"A stronger tomorrow belongs to all.\""
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "When did you last catch yourself composing your response while someone else was still talking?",
        "Who on your team would say you genuinely see them — not just manage them? Who would hesitate before answering that?"
      ]
    ),
  ]
};

// ─── SECTION 6 — Social Skills ────────────────────────────────────────────────

const section6 = {
  section_number: 6,
  title: "Social Skills",
  blocks: [
    heading(2, "Social Skills"),
    paragraph("The fifth domain is the culmination of the other four — self-awareness, self-regulation, motivation, and empathy all converging into the actual ability to manage relationships and build networks of trust. You cannot fake your way to strong social skills without the first four domains underneath; what you get instead is charm, which works right up until it's tested."),
    paragraph("Leaders with strong social skills build rapport easily, communicate persuasively, manage conflict constructively, lead change without destroying the relationships change usually threatens, and build teams that stay inspired past the initial excitement."),
    table(
      ["Key social skill", "What it actually requires"],
      [
        ["Influence", "Moving people without needing to command them — the difference between people following because they must and following because they want to"],
        ["Communication", "Being understood, not just being heard — a message that was technically said but not actually received has accomplished nothing"],
        ["Conflict management", "Resolving tension without avoiding it or escalating it — most leaders default to one of those two failure modes under pressure"],
        ["Change catalyst", "Leading transitions without triggering unnecessary resistance — people rarely resist change itself; they resist feeling like it was done to them rather than with them"],
        ["Building bonds", "Cultivating relationships that outlast the immediate task — the difference between a network and a contact list"],
        ["Teamwork & collaboration", "Working toward shared goals without needing sole credit — visible in what a leader says in the room afterward, not what they say to your face"],
      ]
    ),
    heading(3, "What It Looks Like When It Works"),
    paragraph("In 2016, Microsoft's own experimental chatbot, Tay, was manipulated by users into posting racist and offensive content within hours of launch, and had to be shut down publicly. It was the kind of failure that invites a leader to look for someone to blame. CEO Satya Nadella instead sent the engineering team a message making clear his support hadn't changed, and reframing the moment as one to learn and improve from rather than one to be punished for."),
    callout("tip", "Notice what that response actually did. It didn't excuse the failure or pretend it hadn't happened. It communicated something more useful under pressure: that the team's value to him hadn't changed because of one bad outcome. Engineers who feel safe after a visible failure keep taking the kind of risks that produce real innovation. Engineers who get blamed stop taking any risk at all — which quietly costs far more than the original mistake did."),
    callout("tip", "Notice the order this module has followed. Social skills come last, not first, because they're an output, not an input. A leader who tries to build social skills without doing the first four domains' work is building a network on a foundation they haven't actually laid."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the six social skills above, which would the people who work most closely with you say is genuinely your strongest? Which would they hesitate to name?",
      ]
    ),
  ]
};

// ─── SECTION 7 — The Six Leadership Styles ────────────────────────────────────

const section7 = {
  section_number: 7,
  title: "The Six Leadership Styles",
  blocks: [
    heading(2, "The Six Leadership Styles"),
    paragraph("Before there were six practical styles, there were three competing theories about where leadership even comes from. Worth a minute, because each one is still alive somewhere in how people talk about leaders today."),
    table(
      ["Theory", "The claim", "Where it stands now"],
      [
        ["The Great Man Theory", "Great leaders are destined by fate to fulfill their purpose — leadership as a kind of chosen inheritance", "Largely discredited"],
        ["The Trait Theory", "\"Great leaders are born, not made\" — leadership as a fixed bundle of inherited traits", "Recognized as incomplete"],
        ["Transformational Leadership", "Leaders and followers interact and transform each other; it's the followers' transformation that matters most", "Current dominant model — and the one this whole module has been building toward"],
      ]
    ),
    callout("tip", "Notice the shift across all three: leadership moves from something you're born with, to something you're destined for, to something that happens between people. Emotional intelligence — the entire subject of this module — only makes sense once leadership is understood as relational rather than inherited."),
    paragraph("Goleman's research found that leaders with high emotional intelligence naturally draw on multiple leadership styles, moving between them as the situation demands. Leaders with low EQ default to one style regardless of what the moment actually calls for — usually whichever style is most comfortable for them personally, not most effective for the people in front of them."),
    table(
      ["Style", "What it does"],
      [
        ["Visionary", "Moves people toward a shared dream — most effective when a clear direction is needed"],
        ["Coaching", "Develops people for the future — most effective when someone is capable but needs growth"],
        ["Affiliative", "Creates harmony and emotional bonds — most effective when a team is fractured or grieving"],
        ["Democratic", "Builds consensus through participation — most effective when buy-in matters more than speed"],
        ["Pacesetting", "Expects excellence and self-direction — most effective with an already highly competent team, used sparingly elsewhere"],
        ["Commanding", "Demands immediate compliance — most effective only in genuine crisis, damaging almost everywhere else"],
      ]
    ),
    callout("warning", "Pacesetting and Commanding are the two styles most leaders overuse, because they feel the most like \"leading.\" They're also the two styles with the narrowest window of actual effectiveness. Used outside a crisis or an already-elite team, both quietly erode the trust the other four domains built."),
    paragraph("The test of EQ here isn't which style you're best at. It's whether you can tell, in the moment, which style the actual situation is asking for — and whether you're flexible enough to use it even when it isn't your natural default."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Which of the six styles do you reach for by default, regardless of the situation? When was the last time that default was actually the wrong call?",
      ]
    ),
  ]
};

// ─── SECTION 8 — EQ Is Learnable + Biblical Foundation ────────────────────────

const section8 = {
  section_number: 8,
  title: "EQ Is Learnable",
  blocks: [
    heading(2, "EQ Is Learnable"),
    paragraph("Unlike IQ, which is relatively fixed across a lifetime, emotional intelligence can be developed at any age. This isn't motivational language — it's neurological. The brain's limbic system, which governs emotional response, learns through practice, feedback, and motivation. It does not learn through reading alone, which is worth admitting plainly in a module you are, in fact, reading."),
    heading(3, "What Development Actually Requires"),
    bullet("Honest self-assessment — feedback from people who will actually tell you the truth, not just the people most comfortable to ask"),
    bullet("Intentional practice of new behaviors — not insight, practice. Insight is where this starts, not where it ends"),
    bullet("A supportive environment — one where trying a new response and getting it wrong doesn't cost you standing"),
    bullet("Sustained repetition over time — neurological rewiring takes months, not days. If a technique hasn't stuck after one attempt, that isn't failure. That's the normal timeline."),
    divider(),
    heading(3, "Where This Converges With Everything Before It"),
    paragraph("Proverbs 16:32 says a patient person is better than a warrior, and one with self-control is better than one who takes a city. Proverbs 29:11 puts the same idea more bluntly: fools give full vent to their rage, but the wise bring calm in the end."),
    paragraph("Galatians 5:22-23 lists the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. Read that list again next to the five domains this module just walked through — self-awareness, self-regulation, motivation, empathy, social skills. They aren't parallel ideas that happen to rhyme."),
    callout("tip", "Three completely independent traditions arrived at the same place. Goleman's research, decades of controlled study, published in 1995. Scripture, thousands of years earlier, naming the same qualities as fruit. And Marcus Aurelius, back in Section 3, a Roman emperor with no access to either, working it out through sheer disciplined observation of his own temper. When a modern psychologist, an ancient text, and a pagan philosopher all describe the same shape from three different starting points, that's not coincidence. That's a description of how people actually work."),
    pullQuote("The fruit of the Spirit is emotional intelligence, produced supernaturally in the yielded believer."),
    callout("tip", "EQ development and spiritual formation are not competing paths. They converge. What Goleman's research calls a trainable competency, Scripture calls fruit — something grown, not manufactured, through sustained connection to the source."),
    divider(),
    heading(3, "The Five-Domain Self-Audit"),
    paragraph("Before the assignment, one honest pass across all five domains at once — not to judge yourself, just to notice, clearly, where the real gap actually sits."),
    { type: "scorecard", data: {
      title: "Where Are You Now?",
      scorecard_key: "module3_eq_domains",
      items: [
        {"key": "self_awareness", "max": 10, "label": "Self-Awareness", "helpText": "Has anyone described my reaction to something in a way that genuinely surprised me, in the last month?"},
        {"key": "self_regulation", "max": 10, "label": "Self-Regulation", "helpText": "When did I last say or do something under pressure that I had to walk back afterward?"},
        {"key": "motivation", "max": 10, "label": "Motivation", "helpText": "If all recognition for my work vanished tomorrow, would my effort actually stay the same?"},
        {"key": "empathy", "max": 10, "label": "Empathy", "helpText": "Who on my team would hesitate before saying I truly see them, not just manage them?"},
        {"key": "social_skills", "max": 10, "label": "Social Skills", "helpText": "Which of the six social skills would the people closest to me name as my weakest, not my strongest?"},
      ]
    } },
    callout("warning", "Whichever question made you pause the longest just before answering — that's usually the honest one. Not the one with the most dramatic answer. The one you had to sit with."),
    image({
      url: "/images/module-3/fruit-tree-roots.png",
      alt: "A fruit tree in cross-section, ripe fruit on its branches and a wide root system spreading through the soil toward water below. Text reads \"Healthy leadership bears fruit\", \"Deep roots. Healthy growth. A brighter tomorrow.\", icons for Character, People, Service and Impact, the line \"Stay connected to the source\", and Matthew 7:17, \"A good tree bears good fruit.\""
    }),
    divider(),
    { type: "quiz", data: {"scope": "module_review", "title": "Module Review: Emotional Intelligence", "questions": [{"id": "q1", "prompt": "According to Goleman's research cited in this module, what percentage of what separates great leaders from average ones is attributed to emotional intelligence?", "options": [{"id": "a", "text": "25%"}, {"id": "b", "text": "50%"}, {"id": "c", "text": "67%"}, {"id": "d", "text": "90%"}], "explanation": "Section 1's opening statistic, the research foundation for the whole module.", "correct_option_id": "c"}, {"id": "q2", "prompt": "What are the five domains of emotional intelligence this module is built around?", "options": [{"id": "a", "text": "Vision, Strategy, Execution, Trust, Legacy"}, {"id": "b", "text": "Self-Awareness, Self-Regulation, Motivation, Empathy, Social Skills"}, {"id": "c", "text": "IQ, EQ, SQ, PQ, AQ"}, {"id": "d", "text": "Confidence, Humility, Courage, Patience, Wisdom"}], "explanation": "The module's core structure, one section per domain.", "correct_option_id": "b"}, {"id": "q3", "prompt": "In the Bill Winters case study, what specifically caused the backlash to compound rather than resolve?", "options": [{"id": "a", "text": "He never apologized at all"}, {"id": "b", "text": "He apologized, but also reposted the original remarks that caused the harm, unedited"}, {"id": "c", "text": "He blamed his PR team publicly"}, {"id": "d", "text": "He resigned immediately"}], "explanation": "Section 3's point about self-regulation applying to the response to the response, not just the first reaction.", "correct_option_id": "b"}, {"id": "q4", "prompt": "What does the module identify as the \"one pillar that can't be faked\" in the Four Pillars of Trust?", "options": [{"id": "a", "text": "Consistency"}, {"id": "b", "text": "Competence"}, {"id": "c", "text": "Character"}, {"id": "d", "text": "Communication"}], "explanation": "Section 2's argument — the other three can be demonstrated or practiced; character is revealed only in private decisions.", "correct_option_id": "c"}, {"id": "q5", "prompt": "According to Marcus Aurelius's example in this module, what did he conclude about calm versus rage in leadership?", "options": [{"id": "a", "text": "Rage is a legitimate tool for maintaining authority"}, {"id": "b", "text": "Calm isn't the absence of strength — it's what strength actually looks like under provocation"}, {"id": "c", "text": "Emotional expression should always be suppressed entirely"}, {"id": "d", "text": "Only philosophers need to worry about self-regulation"}], "explanation": "Section 3's ancient-tradition convergence point.", "correct_option_id": "b"}, {"id": "q6", "prompt": "What does the module say is the relationship between Goleman's research, Scripture, and Stoic philosophy on emotional intelligence?", "options": [{"id": "a", "text": "They contradict each other and only one can be correct"}, {"id": "b", "text": "Three independent traditions — modern psychology, ancient Scripture, and ancient philosophy — arrived at the same conclusion"}, {"id": "c", "text": "Only Scripture is a reliable source on this topic"}, {"id": "d", "text": "Stoicism and Christianity are historically identical"}], "explanation": "Section 8's closing convergence argument, the module's capstone point.", "correct_option_id": "b"}]} },
    assignmentPrompt(
      "Week 3 Assignment",
      "This assignment asks you to test your guess from Section 1 against reality, then install one specific practice. Write honestly — this isn't graded on eloquence, it's read by a mentor who wants to help you close the actual gap, not the one you assumed you had.",
      [
        {
          number: 1,
          heading: "Test Your Guess",
          guidance: "In Section 1, you privately guessed which of the five domains was your weakest. Ask one person who knows you well which domain they would name. Write down what they said, and whether it matched your guess.",
          example: "Example: \"I guessed Self-Regulation. My co-lead said Empathy — she said I listen to respond, not to understand.\""
        },
        {
          number: 2,
          heading: "Name One Real Moment",
          guidance: "Describe one specific, recent moment where the domain your colleague named (not necessarily your own guess) actually showed up and cost you something — a decision, a relationship, a team member's trust."
        },
        {
          number: 3,
          heading: "Install One Practice",
          guidance: "Choose one concrete, repeatable practice you will use for the next two weeks to strengthen that specific domain. Not a general intention — an actual behavior you can point to on a specific day.",
          example: "Example: \"For self-regulation: before responding to any frustrating email, I will wait 10 minutes and reread it once before replying.\""
        },
        {
          number: 4,
          heading: "Name the Style Shift",
          guidance: "Looking at the Six Leadership Styles from Section 7, which style do you overuse? Which underused style would actually serve your team better this month, and in what specific situation will you try it?"
        }
      ],
      200,
      600
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7, section8];

const module3 = {
  module_number: 3,
  title: "Emotional Intelligence: The Leader's Inner Edge",
  subtitle: "The Leader's Inner Edge",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "A calm, still water surface reflecting a stormy sky above it",
  sections: sections.map(s => ({
    section_number: s.section_number,
    title: s.title,
    blocks: s.blocks
  }))
};

// ─── Structural self-validation (H2 = section boundary, matches production splitter) ──

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

console.log(`Module 3 — "${module3.title}"`);
console.log(`Simulated splitter produced ${simSections.length} sections (expect 8):`);
simSections.forEach((s, i) => console.log(`  ${i+1}. ${s.title} (${s.blocks.length} blocks)`));

const variants = new Set(flat.filter(b => b.type === "callout").map(b => b.data.variant));
const allowed = new Set(["note","info","warning","tip","scripture"]);
const unknown = [...variants].filter(v => !allowed.has(v));
console.log(`\nCallout variants used: ${[...variants].join(", ")}`);
console.log(`Unknown variants: ${unknown.length ? unknown.join(", ") : "NONE"}`);

const totalBlocks = flat.length;
console.log(`\nTotal blocks: ${totalBlocks}`);
console.log(`Reflection question blocks: ${flat.filter(b=>b.type==="reflection_questions").length}`);
console.log(`Assignment prompt blocks: ${flat.filter(b=>b.type==="assignment_prompt").length}`);
console.log(`Pending images: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[IMAGE PLACEHOLDER")).length}`);
console.log(`Pending videos: ${flat.filter(b=>b.type==="callout" && b.data.text.startsWith("[VIDEO PLACEHOLDER")).length}`);

fs.writeFileSync('module3_leadership.json', JSON.stringify(module3, null, 2));
console.log(`\nWritten to module3_leadership.json`);
