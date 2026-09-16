// Module 2 — "Character in the Dark"
// Generates block-code JSON matching the lesson_body_blocks schema
// used for Module 1 ingestion. Run: node generate_module2.js

const fs = require('fs');

// ─── Block helper functions (mirrors Module 1's generator) ─────────────────

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const quote = (text, attribution) => ({
  type: "quote",
  data: attribution ? { text, attribution } : { text }
});
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });
const divider = () => ({ type: "divider", data: {} });
const reflectionQuestions = (title, questions) => ({
  type: "reflection_questions",
  data: { title, questions }
});
const assignmentPrompt = (title, items) => ({
  type: "assignment_prompt",
  data: { title, items }
});

// Matches production's exact assignment_prompt schema:
// { instructions, prompts: [{number, heading, guidance, example?}], word_min, word_max }
const assignmentPromptV2 = ({ title, instructions, prompts, word_min, word_max }) => ({
  type: "assignment_prompt",
  data: { title, instructions, prompts, word_min, word_max }
});

// Bullets/numbered lists are represented as paragraph blocks with a leading
// marker, matching the pattern found in Module 1's own generated blocks
// (e.g. paragraph("• Financial decisions made in secret from your spouse")).
const bullet = (text) => paragraph(`• ${text}`);
const numbered = (text, n) => paragraph(`${n}. ${text}`);
const boldParagraph = (text) => paragraph(text); // production has no bold flag; kept as plain paragraph

// Matches production's actual video_embed schema: { youtubeId, title }
// (no provider/description fields in production — description gets
// promoted to a following paragraph at the call site instead of silently dropped)
const videoEmbed = (youtubeId, title) => ({
  type: "video_embed",
  data: { youtubeId, title }
});

// Matches Module 0 / Module 1's exact placeholder pattern —
// pending assets are callout blocks, not a custom block type.
const videoPlaceholder = (description) => ({
  type: "callout",
  data: { variant: "note", text: `[VIDEO PLACEHOLDER — pending recording] ${description}` }
});

const imagePlaceholder = (description) => ({
  type: "callout",
  data: { variant: "note", text: `[IMAGE PLACEHOLDER — pending generation] ${description}` }
});

// Keeps the existing image({...}) call sites intact while outputting
// in the same placeholder-callout shape as Module 0/1.
// A real image once its file exists, a placeholder until then — see
// generate_module5.js for the same helper and the reasoning behind it.
const image = (spec) =>
  spec.url
    ? { type: "image", data: { url: spec.url, alt: spec.alt } }
    : imagePlaceholder(`${spec.type}. Content: ${spec.content} Dimensions: ${spec.width}×${spec.height}.`);

const recommendedLink = (title, url_hint, note) => ({
  type: "callout",
  data: { variant: "info", text: `${title} — ${url_hint}. ${note}` }
});

// ─── SECTION 1 — What You Are in the Dark ──────────────────────────────────

const section1 = {
  section_number: 1,
  title: "What You Are in the Dark",
  blocks: [
    // ===== MODULE FRONT MATTER — matches Module 0 / Module 1 pattern =====
    heading(2, "Character in the Dark"),
    paragraph("Module 2 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary welcome video, real per-module recordings to follow"),
    callout("info", "Who this is for: Every leader who completed Module 1. Character work isn't optional or advanced — it's the ground everything else in this program stands on."),
    callout("info", "Core promise: By the end of this module, you'll have named the specific pressure points where your own character is most likely to give way — and installed real, checkable guardrails before you ever need them."),
    callout("info", "Time commitment: Roughly 60 minutes of reading, 20 minutes for the Section 7 video, and 20-30 minutes for the assignment — about 100 minutes total. Section 5 is the heart of this module — don't rush it."),
    divider(),
    // ===== SECTION 1 CONTENT =====
    heading(2, "What You Are in the Dark"),
    paragraph("Your charisma will lift you up. Your character will maintain you up there. Those are not the same skill, and they are not built the same way. Charisma is what a room notices in thirty seconds. Character is what your family, your staff, and your own conscience know about you after thirty years — including the parts nobody ever put on a stage."),
    pullQuote("Character is what you are in the dark."),
    paragraph("The word itself agrees. \"Integrity\" comes from the Latin integer — whole, untouched, undivided. A person of integrity isn't extra virtuous. They're just undivided — the same person in the boardroom and the car afterward with the doors locked, on stage and in the room where no one's watching. The opposite of integrity isn't dishonesty. It's fragmentation — a private self and a public self that have quietly stopped being the same person."),
    paragraph("Gifts are given freely. Character must be earned. Paul lists nine gifts of the Spirit in 1 Corinthians 12 — wisdom, knowledge, faith, healing, miracles, prophecy, discernment, tongues, interpretation. He lists nine fruit of the Spirit in Galatians 5:22-23 — love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. Notice the difference in how you get each list. Gifts are distributed. Fruit is grown. Gifts are temporal — useful for a season, a role, a platform. Fruit is eternal — it is who you actually become."),
    callout("tip", "A leader can have every gift on the first list and still fail, because the first list was never meant to hold the weight the second list carries."),
    heading(3, "The Three Little Pigs Test"),
    paragraph("Three little pigs, three houses — straw, sticks, brick. Same goal. Same wolf. Different materials. The question this module keeps asking, in different forms, is simple: what materials are you building your leadership with? Honesty, integrity, truth, and faithfulness build something that survives the wind. Manipulation, greed, and deception build something that looks identical from the outside, right up until the storm arrives."),
    paragraph("Nobody builds with straw on purpose. They build with straw because it's faster, and the wind hasn't come yet. The wolf in the story never knocks down the brick house — he doesn't even try. He goes straight for the houses built to look finished quickly, because he already knows which ones won't hold."),
    paragraph("The story has a third house this module hasn't mentioned yet — sticks. Not as strong as brick, not as fast as straw. The stick-house leader has done some of the work: real convictions, genuine effort, a character that holds against real pressure. And it still comes down — not because nothing was built, but because it wasn't built to survive the specific wind that eventually comes for every leader. Half-built character is not safety. It's a slower version of the same ending."),
    image({
      url: "/images/module-2/iceberg-charisma-character.png",
      alt: "An iceberg split by the waterline. The small sunlit tip is labelled \"Charisma / Gifts — what people see\", listing Influence, Talent, Opportunity and Platform; the far larger submerged mass is labelled \"Character / Fruit — what truly matters\", listing Integrity, Discipline, Humility, Patience, Faith, Resilience, Love, Consistency, Purpose, Kindness, Endurance, Teachability, Self-Control, Servant Heart, Wisdom and Stewardship. Headings read \"True leadership runs deep\" and \"What's within sustains what's seen.\""
    }),
    recommendedLink(
      "Charisma vs. Character",
      "search: John Maxwell, 'Character vs. Charisma'",
      "Reference only — no single canonical video exists for this exact framing."
    ),
    divider(),
    heading(3, "This Isn't Only a Christian Idea"),
    paragraph("If character-over-charisma sounds like a specifically religious conviction, it's worth knowing it isn't. Four voices from completely different worlds landed on the exact same conclusion, independently of each other: a leadership researcher who's already spoken in this section, a bestselling secular researcher, the most rigorously trained institution on earth, and a pastor-turned-leadership-author."),
    callout("tip", "John Maxwell, after decades studying leaders across business, sports, and government, put it directly: \"Character makes trust possible, and trust is the foundation of leadership.\""),
    paragraph("Stephen Covey reached the same place from a completely different direction. Researching two hundred years of success literature for The 7 Habits of Highly Effective People, he found something he hadn't expected: almost all of it, until the last few decades, focused on what he named the Character Ethic — integrity, humility, courage, patience. What replaced it more recently, he called the Personality Ethic: image, technique, how to seem impressive rather than how to actually be trustworthy. His conclusion was blunt — the Personality Ethic doesn't work without the Character Ethic underneath it. It's the same iceberg from earlier in this section, just named by someone working from no religious framework at all."),
    paragraph("Covey didn't just name the distinction — he argued for what makes the Character Ethic possible in the first place: four capacities he called the human endowments. Self-awareness — the ability to think about your own thinking. Conscience — an inner sense of right and wrong that can be sharpened or numbed depending on what you feed it. Imagination — the ability to picture a better response than your first instinct. Independent will — the capacity to actually act on that better response instead of the reactive one. Miss any one of the four, and the Personality Ethic wins by default — not because character lost the argument, but because nothing in the person was equipped to choose it."),
    paragraph("The clearest secular proof might be the U.S. Army. Its official leadership doctrine (ADP 6-22) organizes every leader attribute into three categories, in this order: Character, Presence, Intellect. Not Intellect first. Character first — ahead of physical bearing, ahead of mental capability, ahead of everything Presence and Intellect measure. This is not a devotional document. It's the training standard for the most tested leadership institution in the world, and it starts in the same place this module does."),
    heading(3, "What the Army Actually Means by Character"),
    paragraph("Five components, and the doctrine defines each one specifically enough to be checkable — not just admirable."),
    table(["Component", "What it actually requires"], [["Army Values & Ethic", "Seven non-negotiable values — Loyalty, Duty, Respect, Selfless Service, Honor, Integrity, Personal Courage — functioning as a shared ethical floor, not a personal preference"], ["Empathy", "Understanding the real impact of your decisions on the people under you, not just on the mission"], ["Warrior / Service Ethos", "A mission-first mentality that refuses to accept defeat — yoked to service, not to personal ambition"], ["Discipline", "Doing the harder right over the easier wrong — specifically defined as holding to standard \"even in the absence of immediate supervision\""], ["Humility", "Deliberately not self-assessed. The doctrine states a leader's humility is \"largely determined by other people\" — you don't get to grade your own"]]),
    callout("tip", "Read that discipline definition again: \"even in the absence of immediate supervision.\" The U.S. Army's official training doctrine defines character, in writing, as what a soldier does when no one is checking. That is this module's entire thesis, stated by an institution with zero religious motivation to agree with it."),
    divider(),
    callout("tip", "Myles Munroe wrote an entire book on this exact subject, titled The Power of Character in Leadership. His own line on it: \"Let your success be carried by your character\" — not the other way around. Success was never built to carry the weight character is supposed to hold."),
    paragraph("Munroe's central image is worth sitting with: character functions like an alarm system, guarding two doors at once. One door faces outward — the pressures, temptations, and dishonest shortcuts the world offers a leader with real influence. The other door faces inward — your own rationalizations, the private arguments you make to yourself for why this one exception is different. Most leaders install a system for the first door and leave the second one completely unguarded. It's almost never the outside door that gets breached first."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Where in your life right now would the people closest to you say your charisma is currently doing more work than your character?",
        "If someone secretly watched everything you did for a week — nothing public, only the private moments — would they describe you the same way your reputation describes you?",
      ]
    ),
  ]
};

// ─── SECTION 2 — Leading From the Inside Out ───────────────────────────────

const section2 = {
  section_number: 2,
  title: "Leading From the Inside Out",
  blocks: [
    heading(2, "Leading From the Inside Out"),
    paragraph("The world does not need more motivated leaders who look good on the outside. It needs leaders who are different on the inside — because you cannot consistently perform outwardly in a way that is inconsistent with who you are inwardly. Not forever. The gap always shows eventually."),
    paragraph("Leading from the outside in is talking the talk without walking it — performance dressed as leadership. Leading from the inside out means the change has already happened in your own life, which is the only reason anyone else can credibly follow you into it. If you try to change from the outside in, what you're producing isn't transformation. It's a performance, and performances end when the audience leaves."),
    callout("tip", "The life of a leader and the life of the organization are not separate things. Whatever the leader consumes, the organization consumes. Your private habits become, eventually, everyone's atmosphere."),
    paragraph("This is not a technique you can pick up in a weekend, a style you can adopt, or a skill you can acquire and move on from. Leadership, in this frame, is a manifestation of the spirit — it begins with an intimate relationship with Christ, matures through the personal, deepening work of character and service, and only then has any multiplying effect on the people around you. Upward, inward, outward — in that order. Not outward first."),
    heading(3, "The One Pillar That Can't Be Faked"),
    paragraph("Trust is the currency of leadership — without it, every other skill you have is worthless to the people you lead. Trust generally rests on four pillars."),
    table(
      ["Pillar", "What it means"],
      [
        ["Consistency", "Doing what you say you will do, every time. People trust what is predictable."],
        ["Competence", "Being capable and skilled in what you lead. Followers trust leaders who know what they're doing."],
        ["Character", "Honesty, integrity, and ethical behavior even when no one is watching."],
        ["Communication", "Clear, honest, timely information. Silence creates confusion; openness builds confidence."],
      ]
    ),
    callout("tip", "Three of these four you can build a resume around. You can demonstrate competence in an interview. You can prove consistency with a track record. You can practice communication as a skill. Character is the one pillar that resists performance entirely — because by definition, it's revealed not in public moments, but in private decisions. It's the only one of the four this module is actually about."),
    heading(3, "The Research Says the Same Thing"),
    paragraph("This isn't just a convenient framing from a leadership book. James Kouzes and Barry Posner spent over three decades surveying more than 75,000 people worldwide on what actually makes them trust a leader enough to follow. Their conclusion, stated as plainly as research findings get: credibility is the foundation of leadership."),
    pullQuote("If you don't believe in the messenger, you won't believe the message."),
    paragraph("They call this the First Law of Leadership. Their Second Law gives it a name simple enough to remember under pressure: DWYSYWD — Do What You Say You Will Do. Not a personality trait. A behavior, repeated, that either builds credibility or quietly spends it."),
    callout("tip", "Maxwell names the same three qualities from a different angle: competence, connection, and character are what a leader must exemplify to build trust. Two of the three you can practice. The third is the one this whole module is about."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the four pillars — Consistency, Competence, Character, Communication — which would the people who work most closely with you say is currently your weakest?",
        "Think of the last promise you made under pressure, just to end a hard conversation. Did you keep it?",
      ]
    ),
  ]
};

// ─── SECTION 3 — The Leader's Heart & Preparation ──────────────────────────

const section3 = {
  section_number: 3,
  title: "The Leader's Heart & Preparation",
  blocks: [
    heading(2, "The Leader's Heart & Preparation"),
    heading(3, "The Leader's Preparation"),
    paragraph("Leadership is not a microwave experience. It's a process — and God tends to run that process in a slow-cooker, not a fast one. David was anointed as king as a boy and didn't sit on the throne for another ten to thirteen years. Moses spent forty years in the wilderness to prepare for forty years of leading a nation out of one. Neither of them would have described the waiting as wasted time, looking back. It was the whole point."),
    callout("tip", "God does not waste experiences. He uses them to make you into the leader you couldn't have become any faster way."),
    heading(3, "The Heart of a Leader"),
    paragraph("The Hebrew word for heart, leb, doesn't just mean emotion. It means the inner man — mind, will, the actual source of who you are. Heart comes before skill, every time, because skill executes whatever the heart has already decided."),
    paragraph("Mark 7:14-23 names the enemies of the heart: pride, sexual immorality, murder, theft, envy, covetousness, deceit, blasphemy. (You'll see most of this list again in Section 5 — that's not an accident. This is the module's real subject, approached from more than one angle.)"),
    heading(3, "How to Guard the Heart"),
    bullet("Give your heart to God — fully, not as a formality. A heart handed over halfway is still a heart running its own agenda underneath the language of surrender."),
    bullet("Search your heart daily (Psalm 139:23-24). Not once at a retreat, not once a year in a crisis — a daily, small, honest look, before anything's gone wrong enough to force it."),
    bullet("Confess the sins of the heart — the ones nobody else would ever catch. If it only counts when someone might find out, it isn't confession. It's damage control."),
    bullet("Fill your heart with good (Philippians 4:8) — what you feed grows. An empty guarded heart doesn't stay empty for long; it fills with whatever's nearest, guarded or not."),
    image({
      url: "/images/module-2/hourglass-david-moses.png",
      alt: "An hourglass with sand mid-fall. A gold crown rests in the upper chamber labelled \"David — anointed young: potential, opportunity, public recognition\"; a shepherd's staff lies in the lower chamber labelled \"Moses — wilderness years: preparation, character, dependence, leadership capacity\". The heading reads \"Different seasons. Same purpose.\""
    }),
    heading(3, "The Prison Has No Audience — And That's the Point"),
    paragraph("Joseph's story might be the original leadership-preparation curriculum. Four stages, in order, none of them skippable: the Pit — where a false identity gets stripped away before anyone's watching. Slavery — where humility and excellence get learned with no promotion attached. Prison — character formation with literally no audience at all, for years, for a crime he didn't commit. Only after all three comes the Palace — authority handed to him in exact proportion to what the first three stages had already built."),
    pullQuote("Your greatest setback is often God's set-up for your comeback."),
    callout("tip", "Notice where the actual formation happens in that sequence. Not the Palace — the Palace is where it gets tested and used. The formation itself happens in the Pit, the Slavery, and especially the Prison — the three stages with the smallest audience Joseph ever had. That's not a coincidence specific to Joseph. That's the pattern this whole module is built on."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "What season of your life most resembles Joseph's Prison — real preparation, with no audience and no promotion attached? What did it actually build in you?",
        "Are you currently in a Pit, Slavery, or Prison season and tempted to rush it — or are you in a Palace season and tempted to forget what built it?",
      ]
    ),
  ]
};

// ─── SECTION 4 — Dealing With Your Weaknesses ──────────────────────────────

const section4 = {
  section_number: 4,
  title: "Dealing With Your Weaknesses",
  blocks: [
    heading(2, "Dealing With Your Weaknesses as a Leader"),
    paragraph("God asked Jacob, \"What is your name?\" Not because He didn't know. He asked so Jacob would have to say it out loud — Jacob, meaning deceiver, meaning the one who grabs the heel, meaning supplanter. God made Jacob confront exactly who he was before He would change who Jacob became."),
    paragraph("A weakness is an area of your life where you lack strength. It is also, almost always, the exact area God chooses to use — because it's already humbled. A leader moves from one revelation of personal weakness to the next, and finds, every single time, that God's strength is waiting right where the weakness was exposed."),
    callout("warning", "A leadership position doesn't create character flaws. It amplifies them. Whatever was small and manageable in private becomes loud and consequential in public."),
    paragraph("This isn't a hypothetical. Scripture's leaders carried real weaknesses: Abraham lied under pressure. David committed adultery. Solomon gave in to pride and greed. Samson couldn't master his own appetite. Peter denied Christ three times, to His face, on the worst night of his life. None of them are remembered only for the failure — but none of them got to skip the failure either."),
    paragraph("Notice something else about that list: not one of them was a beginner when it happened. Abraham had already left everything to follow God. David had already been called a man after God's own heart. The position didn't create the flaw in any of them — it simply gave the flaw somewhere bigger to land."),
    heading(3, "Four Steps to Deal With Weakness"),
    table(
      ["Step", "What it actually looks like"],
      [
        ["1. Admit and identify", "Call it out, specifically, by name — not \"I have some issues,\" but the actual thing"],
        ["2. Surrender completely", "\"My grace is sufficient for you, for my power is made perfect in weakness\" (2 Cor 12:9) — surrender isn't giving up, it's handing over what you couldn't hold anyway"],
        ["3. Pray constantly", "The Holy Spirit helps in our weakness (Rom 8:26) — not a resource you access once and file away"],
        ["4. Build daily discipline", "Your daily agenda is either making you or breaking you. There is no third option"],
      ]
    ),
    callout("tip", "God's dealings with a leader's weakness have a purpose: to shape you into Christ's image, to purify and refine what's genuine, and to clean out what's been hidden."),
    heading(3, "What Actually Qualifies a Leader"),
    paragraph("Scripture is oddly specific about this. Acts 6:3 — when the early church needed leaders, they looked for a good reputation, being full of the Holy Spirit, and wisdom. Notice what's not on that list: talent, charisma, credentials. 1 Timothy 3 goes further — blameless in personal life, managing your own household well, ongoing spiritual development, a good reputation even outside the community of believers."),
    paragraph("Put together, qualification for leadership spans eight distinct areas of a life, not one: spiritual, personal, home, social, educational, ministerial, marital, financial. Weakness in any single one doesn't disqualify you outright — but ignoring any single one eventually will."),
    callout("tip", "The key ingredient underneath all eight is brokenness. \"The Lord is close to the brokenhearted\" (Psalm 34:18). \"A broken and contrite heart, O God, you will not despise\" (Psalm 51:17). Brokenness isn't the opposite of qualification. It's very often the mechanism of it — the same mechanism this section has been describing since its opening line about Jacob."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the eight areas — spiritual, personal, home, social, educational, ministerial, marital, financial — which one would you be most uncomfortable having someone else examine right now?",
        "What is one weakness you have been managing quietly instead of naming out loud to anyone?",
      ]
    ),
    image({
      url: "/images/module-2/mended-vessels.png",
      alt: "Five silhouetted figures in a row, each cradling a cracked clay vessel whose breaks have been mended with gold. Left to right they are labelled Abraham, David, Solomon, Samson and Peter, under the heading \"God uses imperfect people to fulfill extraordinary purposes.\""
    }),
  ]
};

// ─── SECTION 5 — The Three Things You Don't Touch ──────────────────────────

const section5 = {
  section_number: 5,
  title: "The Three Things You Don't Touch",
  blocks: [
    heading(2, "The Three Things You Don't Touch"),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary placeholder video, real per-section recordings to follow"),
    heading(3, "He Already Had Everything"),
    paragraph("In 2006, Ted Haggard was one of the most influential pastors in America — founder of a 14,000-member church, president of an organization representing thirty million evangelicals. Then a paid escort came forward. Haggard denied it. The denial didn't hold. Within days, his own church's overseer board had removed him, and he resigned every leadership position he held. In his own words to his congregation, he called himself \"a deceiver and a liar\" who had given in to what he described as his dark side. The church was left $26 million in debt. A second, separate relationship with a much younger church volunteer surfaced later."),
    callout("warning", "Notice what this wasn't. It wasn't a lack of talent, or teaching, or influence — he had more of all three than almost anyone reading this ever will. What gave way was exactly the thing this module has been building toward: character, in the dark, over years, in rooms nobody else was in."),
    callout("tip", "This section is not asking you to judge him. It's asking you to notice that \"it could never be me\" is precisely the sentence every leader in this position has believed, right up until it wasn't true."),
    divider(),
    heading(3, "The Five-Step Slide"),
    paragraph("Nobody wakes up and decides to fall. It happens in five stages — and by the time you're on step five, steps one through four already happened while you weren't looking."),
    numbered("Comparison — you start measuring your life against someone else's, and quietly deciding you deserve what they have.", 1),
    numbered("Rationalization — you start explaining to yourself why the rules everyone else follows don't quite apply to you. Not this time.", 2),
    numbered("Isolation — you stop letting anyone close enough to ask the hard question, because the true answer has started to feel dangerous.", 3),
    numbered("Regret — you know, privately, that something has already gone wrong. You tell yourself you'll fix it quietly, alone, before anyone finds out.", 4),
    numbered("Bitterness — when it doesn't get fixed quietly — and it never does — what's left curdles into resentment. At the people who trusted you. At the standard itself. At God.", 5),
    callout("warning", "The escape hatch is earlier than you think. By stage three, you've already lost the thing that would have saved you — someone with permission to ask."),
    divider(),
    heading(3, "Eight Enemies of the Heart"),
    paragraph("Mark 7:14-23 lists what actually defiles a person — not what comes from outside, but what comes from within. Eight of these are the ones that quietly take leaders down:"),
    numbered("Pride — the belief that you are indispensable, above correction, beyond accountability.", 1),
    numbered("Sexual immorality — the ancient trap. Rarely starts with sex. Starts with unmet emotional needs.", 2),
    numbered("Anger/Rage — the internal fire that burns down what the leader built. Often disguised as \"passion.\"", 3),
    numbered("Theft — the misappropriation of resources. Rarely blatant. Usually a slow shift.", 4),
    numbered("Envy — the corrosive comparison with other leaders. Looks like ambition. Is actually poison.", 5),
    numbered("Covetousness — the endless craving for what you do not have. Masks itself as vision.", 6),
    numbered("Deceit — the slow erosion of truthfulness. Small lies that grow.", 7),
    numbered("Slander/Bitter Speech — the tongue set on fire. Words that tear down others to elevate yourself.", 8),
    boldParagraph("Ask the hard question: which one of these has the most access to me? That is the one that will take you down, if it is not named and guarded."),
    divider(),
    heading(3, "The Three Things a Leader Must Not Touch"),
    paragraph("Paul told Timothy this in 1 Timothy 6:6-10, and it has echoed through leadership training for generations. There are three things that have destroyed more leaders than anything else. If you can guard these three, you will avoid most of the falls."),
    image({
      url: "/images/module-2/three-doors.png",
      alt: "Three closed doors in a bright marble hallway, no people present. A green door marked GOLD with a dollar sign, gold bars stacked beside it; a pink door marked GIRLS with a heart, roses beside it; a yellow door marked GLORY with a crown, a trophy on a plinth reading Recognition, Fame, Power, Influence. Text reads \"Three temptations. One character test.\" and \"What you choose shapes the leader you become.\""
    }),
    pullQuote("Touch not the GOLD. Touch not the GIRLS. Touch not the GLORY."),
    heading(4, "GOLD — Money."),
    paragraph("\"The love of money is a root of all kinds of evil.\" (1 Timothy 6:10) Note the wording: not money itself, but the love of money. Every leader handles money. The question is whether money begins to handle you."),
    heading(4, "GIRLS — Sexual Sin."),
    paragraph("The oldest trap in the book. And it destroys leaders faster than any other weakness."),
    heading(4, "GLORY — Pride."),
    paragraph("The subtlest of the three, and the deadliest. Because gold and girls have obvious warning signs. Glory does not. It disguises itself as calling, or vision, or \"God is using me.\""),
    table(
      ["", "GOLD (Money)", "GIRLS (Sexual Sin)", "GLORY (Pride)"],
      [
        ["Warning sign 1", "Financial decisions made in secret from your spouse", "Private conversations you'd hide from your spouse", "Needing to be recognized for what you do"],
        ["Warning sign 2", "Mixing personal and ministry funds", "Emotional intimacy with someone other than your spouse", "Resentment when others are honored instead of you"],
        ["Warning sign 3", "Financial \"shortcuts\" you'd never tell your board about", "Travel alone with someone of the opposite sex", "Difficulty submitting to leaders above you"],
        ["Warning sign 4", "Resentment when others earn more than you", "Secret social media accounts", "Inability to receive correction"],
        ["Warning sign 5", "Envy of wealthier leaders", "Unfiltered internet use", "Growing gap between public image and private reality"],
      ]
    ),
    boldParagraph("Guard these three, and you will avoid 90% of the leadership falls you have watched happen. Fail to guard them, and you will eventually join the fallen."),
    divider(),
    heading(3, "Six Ways to Avoid Moral Failure"),
    paragraph("Here are six practical guardrails. Install them. All of them. Now — before you need them."),
    numbered("Commit to God's standards. Not the culture's. Not your organization's. God's. Because when the pressure comes, only the highest standard will hold.", 1),
    numbered("Maintain your marriage. Invest in it daily. A leader whose marriage is thriving is guarded from countless temptations. A leader whose marriage is starving becomes vulnerable to everything.", 2),
    numbered("Manage your mind. What you feed your mind, you become. Guard your media intake. Guard your entertainment. Guard your inputs.", 3),
    numbered("Monitor your media. Filters on every device. Accountability software. No secret accounts. No private browsers.", 4),
    numbered("Minimize opportunities for temptation. Do not travel alone with someone of the opposite sex. Do not meet privately behind closed doors. Do not have secret financial accounts.", 5),
    numbered("Magnify the consequences. Regularly rehearse what would be lost if you fell. Your marriage. Your children's respect. Your ministry. Your reputation. The trust of hundreds of people. Do not soften these consequences. Sit with them.", 6),
    paragraph("These are not signs of weakness. They are signs of wisdom. The strongest leaders I know have the strictest guardrails — not because they are the most tempted, but because they know how much would be lost."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the eight enemies of the heart above, which one has the most access to you right now — and how would you know if it were winning?",
        "Of GOLD, GIRLS, and GLORY, which one do you privately suspect is your weakest guard? What is one specific, checkable habit (not a feeling) that would tell you it's slipping?",
        "Who in your life has permission to ask you directly about this — and when did they last actually ask?",
      ]
    ),
  ]
};

// ─── SECTION 6 — Grace-Full vs Worldly Leadership ──────────────────────────

const section6 = {
  section_number: 6,
  title: "Grace-Full vs Worldly Leadership",
  blocks: [
    heading(2, "Grace-Full vs Worldly Leadership"),
    paragraph("Every leader is being formed by one of two patterns, whether they've named it or not."),
    table(
      ["By the World", "By Christ"],
      [
        ["Self-confidence", "Confidence in God"],
        ["Political savvy", "Spiritual savvy"],
        ["Ambitious", "Humble"],
        ["Commands others", "Serves others"],
        ["Independent", "God-dependent"],
        ["Aggressive", "Meek"],
        ["Puts self first", "Puts others first"],
        ["Acts in self-interest", "Acts in love"],
        ["Trusts in self", "Trusts in God"],
      ]
    ),
    paragraph("Grace-full leaders share a set of qualities that don't come naturally to anyone — they're more concerned with spirit than style, leading from the inside out (Philippians 2:5). They operate covenantal rather than contractual, because trust — not obligation — is the heart of covenant (2 Corinthians 3:6). They view people as ends, never as means (Mark 10:45)."),
    paragraph("They seek significance over mere success (Colossians 3:23), stay responsive as well as responsible (1 Chronicles 29:9), and maximize influence while minimizing the use of raw authority (1 Corinthians 11:1). None of these six qualities is a personality type. Every one of them is a decision, available to whichever kind of leader you decided to become in Section 1 — repeated often enough that it stops feeling like a decision at all."),
    heading(3, "Seven Deadly Sins of Leadership"),
    paragraph("All of these center on the same thing: a self-motivated ego. Conceit and arrogance will kill effective leadership faster than almost anything else."),
    numbered("Haughtiness — an attitude of superiority", 1),
    numbered("Arrogance — an inflated sense of self-importance", 2),
    numbered("Pride — absorbed with self while ignoring others", 3),
    numbered("Disdain — comparing yourself to others, derogatorily", 4),
    numbered("Presumption — claiming privileges beyond your actual rights", 5),
    numbered("Assumption — taking others' words at face value without ever investigating", 6),
    numbered("Vanity — an intense craving for admiration and applause", 7),
    callout("tip", "Mark it well: if you are trying to accomplish anything great, the people doing nothing will criticize you for it. Consider the source. Consider the observation. Practice forgiveness. Then keep building."),
    image({
      url: "/images/module-2/seven-faces-of-pride.png",
      alt: "A row of seven flat icons titled \"Seven Faces of Pride — same root, different expressions\": a raised chin for Haughtiness, an inflated balloon for Arrogance, a hand mirror for Pride, a tipping balance scale for Disdain, a crown for Presumption, a crossed-out ear for Assumption, and an empty trophy for Vanity. A closing line reads \"Guard your heart. Choose humility. James 4:6\""
    }),
    recommendedLink(
      "Craig Groeschel Leadership Podcast",
      "youtube.com/@craiggroeschel",
      "Practical, weekly leadership teaching in a register close to this section's tone. No single episode verified as canonical for this topic, so linked as a channel-level resource."
    ),
    divider(),
    heading(3, "Five Ethical Standards"),
    paragraph("If grace-full leadership is the pattern, here's what it looks like translated into five specific, checkable standards."),
    table(
      ["Standard", "What it actually requires"],
      [
        ["Love", "Agape — other-centered caring, not self-interested transaction"],
        ["Forgiveness & Peace", "Shalom, actively pursued — not just the absence of open conflict"],
        ["Humility & Servanthood", "Using your position to lift others, not yourself"],
        ["Integrity", "Being the same person in every room"],
        ["Purity", "In thought as much as in action"],
      ]
    ),
    paragraph("Ten words worth returning to, drawn from the same tradition: Intimacy. Spiritual Maturity. Love. Character. Faith. Purity. Integrity. Thankfulness. Humility. Community. Not a checklist to complete once — a compass to check against regularly."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of the five ethical standards — Love, Forgiveness & Peace, Humility & Servanthood, Integrity, Purity — which would the person who knows you best say you're currently weakest on?",
        "Would they be surprised you're asking, or would they say they've been waiting for you to notice it yourself?",
      ]
    ),
  ]
};

// ─── SECTION 7 — Rumbling With Vulnerability ───────────────────────────────

const section7 = {
  section_number: 7,
  title: "Rumbling With Vulnerability",
  blocks: [
    heading(2, "Rumbling With Vulnerability"),
    paragraph("Everything in Section 5 is ancient — Paul writing to Timothy two thousand years ago about gold and lust and pride. This section is the same warning, in a modern key, from a researcher who spent a career studying what actually separates leaders who last from leaders who don't."),
    paragraph("Brené Brown's research identifies daring leadership as a set of skills — not a personality trait, not something you're born with, but something 100% teachable, observable, and measurable."),
    heading(3, "Four Skill Sets"),
    numbered("Rumbling with vulnerability — the courage to show up when you cannot control the outcome. Vulnerability is not weakness. It's the birthplace of courage.", 1),
    numbered("Living into your values — naming your values isn't the hard part. Operationalizing them into specific, observable behaviors is.", 2),
    numbered("BRAVING trust — the seven elements that build or break trust, in one memorable acronym.", 3),
    table(
      ["Letter", "Element", "What it actually looks like"],
      [
        ["B", "Boundaries", "You state what's okay and what's not — and hold the line even when it's uncomfortable"],
        ["R", "Reliability", "You do what you say, consistently, not just when it's convenient or being watched"],
        ["A", "Accountability", "You own your mistakes, apologize, and make amends — rather than explaining them away"],
        ["V", "Vault", "You don't share what isn't yours to share. Confidentiality in both directions, not just what people tell you about themselves"],
        ["I", "Integrity", "You choose courage over comfort, and practicing your values over performing them"],
        ["N", "Non-judgment", "People can fall apart, ask for help, or struggle without you silently scoring them for it"],
        ["G", "Generosity", "You extend the most generous interpretation possible to other people's intentions and actions"],
      ]
    ),
    numbered("Learning to rise — resilience through reckoning, rumbling, and revolution. Not bouncing back unchanged. Coming back different, on purpose.", 4),
    pullQuote("Our ability to be daring leaders will never be greater than our capacity for vulnerability."),
    videoEmbed("iCvmsMzlF7o", "The Power of Vulnerability | Brené Brown | TED"),
    { type: "quiz", data: {"scope": "video_check", "title": "Quick Check: Vulnerability and Daring Leadership", "questions": [{"id": "q1", "prompt": "In the context of this module's theme — character revealed in private — how does Brown's talk redefine vulnerability?", "options": [{"id": "a", "text": "As a weakness leaders should hide"}, {"id": "b", "text": "As uncertainty, risk, and emotional exposure — and as the birthplace of courage, not the opposite of it"}, {"id": "c", "text": "As a technique for managing difficult employees"}, {"id": "d", "text": "As something only relevant to personal relationships, not leadership"}], "explanation": "This directly challenges the \"armored leadership\" pattern this module warns against — leaders who perform strength rather than practice the harder, quieter kind of courage vulnerability requires.", "correct_option_id": "b"}, {"id": "q2", "prompt": "Brown connects the fear of vulnerability to what specific leadership risk this module has already named?", "options": [{"id": "a", "text": "Slow decision-making"}, {"id": "b", "text": "The same self-protective instinct that, left unchecked, produces the isolation stage of the Five-Step Slide"}, {"id": "c", "text": "Excessive collaboration"}, {"id": "d", "text": "Difficulty setting goals"}], "explanation": "A leader who can't tolerate feeling exposed will avoid the honest conversations that could catch a problem early — the same isolation this module identified as stage three of the slide toward a fall.", "correct_option_id": "b"}]} },
    paragraph("Brown's original 2010 talk — the research foundation everything in this section builds on. About 20 minutes."),
    paragraph("The greatest barrier to courageous leadership isn't fear. It's how you respond to your fear. Armored leadership — the kind built to look strong — drives perfectionism, fears failure, and uses power over people. Daring leadership shares power and builds psychological safety instead. A leader, in this frame, is simply anyone who takes responsibility for finding the potential in people and processes, and has the courage to actually develop it."),
    callout("tip", "Courage is contagious. Build a culture where brave work, tough conversations, and whole hearts are the expectation — not the exception."),
  ]
};

// ─── SECTION 8 — Resilience, Respect & Assignment ──────────────────────────

const section8 = {
  section_number: 8,
  title: "Resilience, Respect & Assignment",
  blocks: [
    heading(2, "Bouncing Back From Challenges"),
    paragraph("Life is full of challenges. Scripture doesn't promise otherwise — it promises strength to face them. \"I can do all things through Christ who strengthens me\" (Philippians 4:13). \"Those who hope in the Lord will renew their strength. They will soar on wings like eagles\" (Isaiah 40:31)."),
    paragraph("Paul is the case study here — shipwrecked, imprisoned, beaten, persecuted, and never once wavering in his faith or his mission. \"I have fought the good fight, I have finished the race, I have kept the faith\" (2 Timothy 4:7). His resilience wasn't about avoiding difficulty. It was about trusting God through it, every time, without exception."),
    heading(3, "Respect — The Foundation of Strong Relationships"),
    paragraph("\"Do to others as you would have them do to you\" (Luke 6:31). Jesus treated everyone He met — rich or poor, healthy or sick, respected or despised — with the same dignity. At the well, He spoke to the Samaritan woman, breaking every cultural barrier of ethnicity and gender in the process, and it transformed her (John 4:1-26). Even mistreated, He responded with grace, not retaliation (Luke 23:34)."),
    callout("tip", "Respect isn't good manners. It's valuing others the way God already does — regardless of what they've done to earn or not earn it from you."),
    paragraph("Every great leader in Scripture faced obstacles. What set them apart wasn't the absence of difficulty. It was where they placed their trust when the difficulty arrived. \"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go\" (Joshua 1:9)."),
    divider(),
    heading(3, "Better or Bitter"),
    paragraph("Section 5 ended its Five-Step Slide at Bitterness — what's left over when a fall never gets stopped. It's worth naming the fork in the road plainly: your circumstances will always do one of two things to you. Make you better, or make you bitter. Nothing in between, and nothing neutral about the hardship itself — the hardship is the same either way. Only the direction it turns you is a choice."),
    paragraph("\"Bitterness is a spiritual cancer that will destroy you. It is an acid that destroys its own container.\" Terry Gobanga's story makes the alternative concrete: abducted and assaulted on her own wedding day, told medically she would never have children. She remarried. She had two daughters. In her own words: \"You have to keep moving, crawl if you have to. But move towards your destiny because it's waiting.\""),
    callout("tip", "John Maxwell's Law of Awareness: you must know yourself to grow yourself. Three kinds of people move through hardship — the Confused, who don't know what they want. The Frustrated, who know but don't do. The Fulfilled, who know and do. The gap between the second group and the third is almost never information. It's the single decision to move, however small the first step is."),
    image({
      url: "/images/module-2/eagle-above-storm.png",
      alt: "An eagle in full flight above a rough sea, a small sailing ship riding the waves below with lightning in the clouds behind it. Text reads \"Higher through every storm\", \"Same God. Rough seas. Bigger purpose.\" and quotes Acts 27:25."
    }),
    divider(),
    { type: "quiz", data: {"scope": "module_review", "title": "Module Review: Character in the Dark", "questions": [{"id": "q1", "prompt": "What is the central distinction this module draws between charisma and character?", "options": [{"id": "a", "text": "They are the same thing, just different words"}, {"id": "b", "text": "Charisma is what a room notices in thirty seconds; character is what you are in the dark"}, {"id": "c", "text": "Charisma matters more for long-term leadership"}, {"id": "d", "text": "Character is irrelevant if a leader is skilled enough"}], "explanation": "This is Section 1's opening thesis, and the module's title.", "correct_option_id": "b"}, {"id": "q2", "prompt": "In the Ted Haggard case study, what ultimately caused his downfall?", "options": [{"id": "a", "text": "A single public scandal with no warning signs"}, {"id": "b", "text": "A private moral failure that eventually became public, despite his visible influence and success"}, {"id": "c", "text": "A disagreement with his church board"}, {"id": "d", "text": "Financial mismanagement alone"}], "explanation": "The case study is used specifically because his fall wasn't a lack of talent or visible warning — the module's whole argument is that character fails in private, first.", "correct_option_id": "b"}, {"id": "q3", "prompt": "What are the five stages of \"The Five-Step Slide\"?", "options": [{"id": "a", "text": "Comparison, Rationalization, Isolation, Regret, Bitterness"}, {"id": "b", "text": "Pride, Anger, Greed, Envy, Sloth"}, {"id": "c", "text": "Denial, Anger, Bargaining, Depression, Acceptance"}, {"id": "d", "text": "Ambition, Compromise, Exposure, Shame, Recovery"}], "explanation": "Section 5's mechanism for how a fall actually happens, step by step.", "correct_option_id": "a"}, {"id": "q4", "prompt": "According to the module, what are \"the three things a leader must not touch\"?", "options": [{"id": "a", "text": "Power, Fame, and Influence"}, {"id": "b", "text": "Gold, Girls, and Glory"}, {"id": "c", "text": "Pride, Envy, and Wrath"}, {"id": "d", "text": "Time, Money, and Attention"}], "explanation": "Section 5's central framework, from 1 Timothy 6.", "correct_option_id": "b"}, {"id": "q5", "prompt": "What does the module say Stephen Covey's \"Character Ethic vs. Personality Ethic\" distinction demonstrates?", "options": [{"id": "a", "text": "That secular researchers disagree with faith-based leadership teaching"}, {"id": "b", "text": "That a completely secular researcher arrived at essentially the same conclusion as this module, independently"}, {"id": "c", "text": "That personality matters more than character in modern leadership"}, {"id": "d", "text": "That Covey rejected the idea of character-based leadership"}], "explanation": "Part of Section 1's cross-tradition convergence argument.", "correct_option_id": "b"}, {"id": "q6", "prompt": "In Joseph's story (Pit, Slavery, Prison, Palace), where does the module say the real character formation actually happens?", "options": [{"id": "a", "text": "In the Palace, once he has authority"}, {"id": "b", "text": "In the Pit, Slavery, and especially the Prison — the stages with the smallest audience"}, {"id": "c", "text": "Formation only happens after public recognition"}, {"id": "d", "text": "The stages are unrelated to character formation"}], "explanation": "Section 3's argument, tying directly back to the module's opening thesis about character being revealed in the dark.", "correct_option_id": "b"}]} },
    assignmentPromptV2({
      title: "Week 2 Assignment",
      instructions: "This assignment asks you to do four things this week — name a pattern, install a guardrail, make a call, and pick a practical step. Write honestly. This isn't graded on eloquence; it's read by a mentor who wants to actually help you, not by anyone grading style.",
      prompts: [
        {
          number: 1,
          heading: "Name the Enemy With the Most Access",
          guidance: "Of the Eight Enemies of the Heart from Section 5, which one privately has the most access to you right now? Write down one specific moment in the last month where you saw it show up — not in general terms, one real moment.",
          example: "Example: \"Envy showed up on Tuesday when a colleague was promoted and my first honest reaction wasn't happiness for them.\""
        },
        {
          number: 2,
          heading: "Name Your Weakest Guard",
          guidance: "Of GOLD, GIRLS, and GLORY, which is your weakest guard? Write one concrete, checkable habit you will install this week to strengthen it — an actual action with a date attached, not a feeling or an intention.",
          example: "Example: \"Starting Monday, I will not hold closed-door one-on-one meetings without a third person present or the door open.\""
        },
        {
          number: 3,
          heading: "Make the Call",
          guidance: "Call one person who has permission to ask you hard questions. Tell them what you identified in Prompt 1. Ask them to check in with you about it in two weeks. Report back here on how that conversation actually went — what was said, not just that it happened."
        },
        {
          number: 4,
          heading: "Pick the First Step",
          guidance: "Reread the Six Ways to Avoid Moral Failure from Section 5. Which one are you currently weakest on? What is the first practical step you will take today — not eventually — to install it?"
        }
      ],
      word_min: 200,
      word_max: 600
    }),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7, section8];

const module2 = {
  module_number: 2,
  title: "Character in the Dark",
  subtitle: "The Leader's Private Life",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "foundation",
  estimated_duration_minutes: 100,
  cover_image_alt: "Three closed doors in a row, unlit, in a quiet hallway",
  sections: sections.map(s => ({
    section_number: s.section_number,
    title: s.title,
    blocks: s.blocks
  }))
};

const totalBlocks = sections.reduce((sum, s) => sum + s.blocks.length, 0);
const allBlocks = sections.flatMap(s => s.blocks);
const pendingImages = allBlocks.filter(b => b.type === "callout" && b.data.text?.startsWith("[IMAGE PLACEHOLDER")).length;
const pendingVideos = allBlocks.filter(b => b.type === "callout" && b.data.text?.startsWith("[VIDEO PLACEHOLDER")).length;
const realVideos = allBlocks.filter(b => b.type === "video_embed").length;

// Structural self-check, mirroring the real ingest splitter's logic:
// each section must contain exactly one H2 (its own section title),
// since the splitter treats every H2 as a new-section boundary and
// treats index 0 as the module title, not section 1's own heading.
console.log(`\n--- Structural validation (H2 = section boundary) ---`);
let structureOK = true;
sections.forEach((s, i) => {
  const h2Count = s.blocks.filter(b => b.type === "heading" && b.data.level === 2).length;
  const expected = i === 0 ? 2 : 1; // section 1 also carries the module-title H2 as its first block
  const ok = h2Count === expected;
  if (!ok) structureOK = false;
  console.log(`  Section ${s.section_number}: ${h2Count} H2${h2Count !== 1 ? 's' : ''} ${ok ? '✓' : `✗ EXPECTED ${expected}`}`);
});
console.log(structureOK ? '  All sections structurally valid.' : '  ⚠ FIX BEFORE SHIPPING — section count will not match authored count.');

console.log(`\nModule 2 — "${module2.title}"`);
console.log(`Sections: ${sections.length}`);
console.log(`Total blocks: ${totalBlocks}`);
console.log(`Blocks per section: ${sections.map(s => s.blocks.length).join(', ')}`);
console.log(`Pending images (awaiting generation): ${pendingImages}`);
console.log(`Pending videos (awaiting recording): ${pendingVideos}`);
console.log(`Real embedded videos (verified, ready): ${realVideos}`);

fs.writeFileSync('module2_leadership.json', JSON.stringify(module2, null, 2));
console.log(`\nWritten to module2_leadership.json`);
