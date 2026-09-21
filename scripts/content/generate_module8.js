// Module 8 — "Servant Leadership"
// Original content throughout, synthesizing library material (Toolkit,
// session cards) in original language, with careful differentiation
// between Collins' "Level 5 Leadership" and Maxwell's "Five Levels"
// already used as Module 5's spine — same number, different frameworks.

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

// ─── SECTION 1 — The Inversion ──────────────────────────────────────────────

const section1 = {
  section_number: 1,
  title: "The Inversion",
  blocks: [
    heading(2, "Servant Leadership"),
    paragraph("Module 8 of the Leadership Track · By Dr. Denis Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: welcome to Module 8 — the module that inverts almost everything the previous seven assumed about what leadership is actually for."),
    callout("info", "Who this is for: Every leader who completed Modules 1-7. You've built character, vision, trust, and communication. This module asks what all of it was actually supposed to serve."),
    callout("info", "Core promise: By the end of this module, you'll have a real vocabulary for the difference between using people to build your vision and using your leadership to build people — and an honest read on which one you're currently doing."),
    callout("info", "Note: several sections here reference frameworks and modules covered earlier in this track — Modules 3, 5, 6, and 7 all reappear briefly, since this module is less about new material than about what all the earlier material was actually for."),
    callout("info", "Time commitment: Roughly 75-85 minutes of reading and reflection, plus assignment work."),
    callout("info", "Five real leaders anchor this module: a teenage lacrosse recruit, a restaurant founder, a company lawyer, an ancient craftsman, and Jesus's own contrasting entry into Jerusalem. Different eras, different scales, the same underlying test throughout."),
    divider(),
    heading(2, "The Inversion"),
    paragraph("Every model this track has covered so far — the levels, the trust equation, the seven communication principles — describes how to become more effective at leading. None of them, on their own, answer a more basic question: effective toward what end? A leader can master every skill in this track and still be building something for themselves."),
    paragraph("The management writer Robert Greenleaf coined the term \"servant leadership\" in 1970, but the underlying claim is older than the term: that the leader's actual job is to leave people better off than they found them — not to use their effort as fuel for the leader's own ambition. Greenleaf offered a specific test for telling the two apart, and it's worth sitting with rather than skimming past. The question isn't whether a leader feels like a servant. It's whether the people served actually grow — do they become healthier, wiser, more capable, more likely themselves to serve others — and whether those with the least power around the leader benefit, or at minimum aren't further harmed."),
    callout("warning", "This test is uncomfortable precisely because it's checkable. A leader's own account of their motives is not admissible evidence here. What actually happened to the people around them is."),
    heading(3, "A Seventeen-Year-Old's Decision"),
    paragraph("A college lacrosse coach — Coach Bru — inherited a program that had lost consistently for years. Against the odds, a genuine high school standout — recruited aggressively by far stronger programs — was interested in playing for him. Coach Bru met with the young athlete, offered him a scholarship, and expected an easy yes. The player asked for more time instead, willing only to give a non-binding verbal commitment."),
    paragraph("All through the following fall and winter, other college recruiters kept showing up to watch him play, still hoping he'd change his mind. When spring finally came and the coaches sat down with him again to ask why he'd waited so long, his answer surprised everyone in the room: he'd noticed that as long as he stayed uncommitted, recruiters kept coming back to watch his games — and while they were there, they were also watching his teammates, several of whom had never drawn any real recruiting attention on their own. If he'd signed early, he explained, those scouts would have stopped showing up, and his teammates' one real chance would have gone with them."),
    callout("tip", "Notice what this wasn't: false modesty, or a lack of confidence in his own ability. He was genuinely talented and knew it. What he'd actually done was use the leverage his own talent created to serve people who had none of their own — the exact inversion Greenleaf's test is built to detect."),
    paragraph("Greenleaf himself drew a sharp line between two starting points that can both end up looking like leadership from the outside. One type starts by wanting to serve, and only later, almost as an afterthought, becomes willing to lead if that's what serving actually requires. The other type starts by wanting to lead — sometimes driven by a genuine desire for impact, sometimes by something less examined, like the pull of status or control — and only later picks up the language of service, usually once it's become clear that people respond better to leaders who at least sound like they care. Greenleaf was careful not to draw this as two clean boxes. Most real leaders sit somewhere on a spectrum between the two, and the honest question isn't which box you're in, but which direction you're actually facing today."),
    paragraph("There's a practical marker for telling the two apart in yourself, not just in theory: notice what happens internally when serving someone costs you something with no one watching and no credit coming. The leader-first instinct quietly resents the cost. The servant-first instinct barely notices it as a cost at all."),
    paragraph("S. Truett Cathy founded what became Chick-fil-A in 1946, starting from a small diner in Atlanta after growing up in real poverty during the Depression. As the company grew into thousands of locations, he made one decision that cost the company real, measurable revenue every single week for decades: every restaurant closed on Sundays, so every employee got a guaranteed day of rest, regardless of what it meant for the weekend's sales. He also spent the bulk of his own time not in a corporate office but traveling between individual restaurants, working alongside employees and learning customers by name."),
    paragraph("His own summary of the philosophy was direct: \"The greatest way to influence others is to be a servant.\" Applying Greenleaf's test to this specific decision rather than the general sentiment: did employees actually benefit from a guaranteed day off, at real cost to the company? Measurably, yes — that's exactly the kind of checkable evidence the test asks for, not just a leader's stated intentions."),
    paragraph("Notice what makes this a genuine test rather than a compliment leaders can pay themselves: the decision cost something real and ongoing, not a single symbolic gesture. A policy that costs nothing is not evidence of anything. A policy repeated for decades, at real and compounding cost, is."),
    paragraph("Notice the shape both opening examples share, teenager and CEO alike: neither one announced a philosophy first and then tried to live up to it. Both simply made one specific decision, at real cost, and let the decision speak for itself. That's the actual difference this whole module is built around — not what a leader says about serving others, but what a leader is still willing to do when serving them stops being convenient."),
    paragraph("Every section that follows returns to this same question from a different angle — a different vocabulary, a different tradition, a different named example — but it's the same question each time."),
    image({
      type: "flat editorial illustration, muted navy/gold palette",
      content: "A single crown resting upside-down, now functioning as a simple bowl, water inside it, reflecting light",
      width: 1200,
      height: 675
    }),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Apply Greenleaf's test honestly to your current leadership: are the people you lead actually growing because of you, or are you growing because of them?",
      ]
    ),
  ]
};

// ─── SECTION 2 — Ten Characteristics ────────────────────────────────────────

const section2 = {
  section_number: 2,
  title: "Ten Characteristics",
  blocks: [
    heading(2, "Ten Characteristics"),
    paragraph("Larry Spears, who led the Greenleaf Center for Servant-Leadership for close to two decades, distilled Greenleaf's original writing into ten specific, observable characteristics — not ten virtues to feel, ten behaviors to practice."),
    table(
      ["Characteristic", "What it actually looks like"],
      [
        ["Listening", "Receiving what's said, and what isn't, before responding — already covered in depth in Module 7"],
        ["Empathy", "Accepting people as they are, not as a corrected version you'd prefer to lead"],
        ["Healing", "Recognizing that many people you lead are carrying something broken, and that leadership itself can either add to that or help mend it"],
        ["Awareness", "Genuine self-awareness paired with awareness of the wider situation — not comfortable, since awareness surfaces problems as fast as it surfaces opportunities"],
        ["Persuasion", "Building consensus through influence, not compelling through positional authority"],
        ["Conceptualization", "The discipline of thinking beyond today's operational demands toward a larger, longer purpose"],
        ["Foresight", "Learning from the past and reading the present well enough to anticipate what's actually coming"],
        ["Stewardship", "Holding what's been entrusted to you in trust for others, not as personal property"],
        ["Commitment to growing people", "A deep belief that people have value beyond their measurable output"],
        ["Building community", "Actively working to build genuine community among the people a large institution has otherwise scattered"],
      ]
    ),
    callout("tip", "Notice how many of these ten this track has already covered under different names: Listening is Module 7. Awareness overlaps Module 3's self-awareness domain. Stewardship is close to Module 6's trust behaviors. Servant leadership isn't a separate skill added at the end — it's the orientation that determines what every earlier skill actually gets used for."),
    paragraph("Leadership researchers James Kouzes and Barry Posner, whose Five Practices framework this track has already drawn on twice, made an observation worth sitting with here: the leaders people actually admire, when you ask them directly, consistently describe leaders who kept the spotlight pointed away from themselves. Not leaders who were self-effacing for its own sake, but leaders whose attention stayed genuinely fixed on what the people around them actually needed, rather than on managing how the leader's own contribution would be perceived. Their research point is a practical one, not just a moral one: it's precisely this redirection of attention — off the leader, onto the people being led — that people find themselves drawn to follow, whether or not they could explain why in the moment."),
    table(
      ["Servant-first pattern", "Leader-first pattern"],
      [
        ["Asks what the team needs before deciding what to announce", "Decides what to announce, then manages how the team receives it"],
        ["Credits specific people by name for a win", "Credits \"the team\" in general, keeps specifics vague"],
        ["Takes a hard question seriously even when it's inconvenient", "Redirects a hard question toward a more comfortable topic"],
        ["Notices who hasn't spoken and draws them in", "Notices who's watching and performs for them"],
      ]
    ),
    paragraph("None of these four pairs are visible from a single meeting. They only show up as a pattern, over repeated interactions — which is exactly why they're harder to fake convincingly than a single well-delivered speech about servant leadership ever could be."),
    heading(3, "A Practical Path, Not Just a Description"),
    paragraph("Spears' ten characteristics describe what a servant leader looks like. They don't say how someone actually gets there. Romans 15:1-6 offers something closer to a practical sequence — six specific movements, not a personality a leader either has or doesn't."),
    paragraph("Deny self. Develop others. Accept mistreatment without demanding it be corrected first. Imitate a model worth imitating rather than inventing the standard alone. Take the posture of a student, not an expert, even in your own area of strength. Pursue harmony deliberately, rather than treating conflict as someone else's problem to manage."),
    callout("tip", "Martin Luther King Jr. made the same point in far fewer words: \"Everybody can be great because anybody can serve.\" The bar for this isn't talent, position, or credentials — every single one of the six movements above is available to anyone willing to actually do them."),
    paragraph("That's worth sitting with before moving on. Nothing in this section requires a title, a platform, or a particular season of life to begin practicing."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these ten, which is genuinely your strongest, and which have you never actually thought of as part of leadership at all?",
      ]
    ),
  ]
};

// ─── SECTION 3 — A Different Kind of Fifth Level ────────────────────────────

const section3 = {
  section_number: 3,
  title: "A Different Kind of Fifth Level",
  blocks: [
    heading(2, "A Different Kind of Fifth Level"),
    callout("warning", "A clarification before this section, not after: this is a completely different framework from the Five Levels covered in Module 5. Both happen to use the number five. They describe different things, from different researchers, and shouldn't be merged in your notes."),
    paragraph("Business researcher Jim Collins studied companies that made a genuine, sustained leap from good performance to great performance, and found something he hadn't expected: every one of them was led, at the critical transition, by a specific and unusual kind of executive. He called this a Level 5 Leader, describing a leadership hierarchy of five levels of executive capability — but unlike Module 5's Five Levels, which describes how influence is extended outward toward other people, Collins's hierarchy describes internal character traits that build on each other toward this one rare combination."),
    paragraph("Put plainly: Module 5 asks how far your influence reaches. This section asks what's actually driving you once it does."),
    paragraph("What actually marked these leaders wasn't charisma or force of personality. It was an unusual pairing: real personal humility alongside real professional will. They didn't seek credit, weren't interested in becoming the center of attention, and consistently gave credit for success to other people, to good fortune, or to factors outside themselves — while taking direct personal responsibility when results were poor, rather than blaming circumstances or the team."),
    callout("tip", "One detail Collins found worth naming specifically: these leaders tended to look out the window when explaining success, and in the mirror when explaining failure. Most executives do the exact opposite."),
    paragraph("Collins's own primary example was Darwin Smith, an internal company lawyer named CEO of Kimberly-Clark in 1971 — a choice so unexpected that a board member pulled him aside beforehand specifically to tell him he wasn't fully qualified for the role. Smith's own response, later recounted: \"I know, but I'm going to do the best I can anyway.\""),
    paragraph("He went on to make one of the boldest decisions in the company's history — selling off Kimberly-Clark's traditional paper mills, including the namesake mill in the town of Kimberly, Wisconsin itself, to redirect the company entirely into consumer products. Wall Street analysts called the move a mistake and downgraded the stock. Smith never publicly defended himself or argued back. Twenty years later, having outperformed the general market by roughly four times, Kimberly-Clark owned Scott Paper outright and was beating Procter & Gamble in most of its own product categories. Smith spent his vacations on his own farm, preferring the company of plumbers and electricians to corporate circles, and remained largely unknown outside the industry for the entire two decades he ran one of the most successful transformations in American business history."),
    paragraph("Notice what Smith didn't do at any point in this story: publicly defend the decision, correct the analysts who mocked it, or claim credit once the results proved him right. The silence wasn't passivity. It was the same redirection of attention this whole module keeps returning to — real energy spent on the actual decision, none spent managing how he'd be perceived for making it."),
    callout("tip", "A leader doesn't need to run a Fortune 500 company to practice this. The same instinct shows up in a much smaller decision: whether you correct the record when someone misunderstands your role in a win, or simply let the misunderstanding stand because correcting it would require drawing attention to yourself."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Think of your last real success and your last real failure. Where did you actually point, honestly, when explaining each one?",
      ]
    ),
  ]
};

// ─── SECTION 4 — What Leaders Are to People ─────────────────────────────────

const section4 = {
  section_number: 4,
  title: "What Leaders Are to People",
  blocks: [
    heading(2, "What Leaders Are to People"),
    paragraph("Scripture uses several different images for leadership, and it's worth noticing that none of them describe a position of comfort. Each one names a specific responsibility toward the people being led, not a status to be enjoyed."),
    table(
      ["Image", "What it actually requires"],
      [
        ["Shepherd", "Personal, unglamorous responsibility for the wellbeing of specific people, not an abstract group"],
        ["Teacher", "Investing in someone else's understanding, at the cost of your own time, with no guarantee it's received well"],
        ["Guide", "Going ahead into terrain you already know, so others don't have to face it blind"],
        ["Craftsman", "Slow, careful shaping of something that will outlast the effort put into it — patience as a discipline, not a personality trait"],
    ]
    ),
    callout("warning", "Every one of these four images describes cost, not privilege. A shepherd absorbs risk on behalf of the sheep. A craftsman spends far more time than the finished piece will ever show. None of the four scriptural images for leadership describe someone being served — all four describe someone serving."),
    paragraph("Most leaders naturally default to whichever of these four matches their own personality, and quietly neglect the rest. A leader strong in teaching but weak in shepherding can produce people who understand a great deal and still feel personally unknown. A leader strong in guiding but weak in craftsmanship can move people quickly toward a destination without building anything in them that actually lasts once they arrive."),
    callout("tip", "A quick way to check which one you're neglecting: ask which of the four you'd be embarrassed to have someone you lead rate you on. That discomfort is usually accurate."),
    paragraph("Scripture's own leadership record follows a consistent pattern worth noticing: almost none of its major leaders started as leaders. Moses served his father-in-law Jethro, tending sheep, before ever leading anyone. Joshua served as Moses's assistant for decades before leading Israel himself. Elisha was known simply as the one who poured water on Elijah's hands before succeeding him as prophet. David served Saul as his armor-bearer before eventually becoming king in his place. In every case, the leadership came after the service, not instead of it — and arguably existed only because the service came first."),
    image({
      type: "flat editorial illustration, warm gold and muted brown palette",
      content: "A craftsman's worn hands shaping clay on a wheel, unglamorous and unfinished, no face visible — the work itself is the entire frame",
      width: 1200,
      height: 675
    }),
    paragraph("The Craftsman image has a specific real example worth naming directly: Bezalel, described in Exodus as filled with skill and expertise for every kind of craft, chosen specifically to build the tabernacle. He worked as part of a team alongside a designer named Oholiab, doing exactly what he'd been asked to do, with no independent authority of his own beyond the work itself. Nothing in the text suggests he was seeking recognition. He was simply, completely good at a specific, unglamorous craft, and gave it everything he had — which is exactly what the Craftsman image asks of any leader operating in that mode."),
    paragraph("There's a leadership application easy to miss in this story: not every act of leadership looks like leading. Sometimes the most valuable thing a leader does is the unglamorous, technical work nobody else in the room can actually do well — done thoroughly enough that everyone building alongside them can trust it without checking."),
    callout("tip", "A quick self-check across all four images: which one have you never actually attempted, not because it doesn't fit your role, but because it would genuinely cost you something to practice?"),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these four images, which comes most naturally to you, and which do you actively avoid because of what it would actually cost you?",
      ]
    ),
  ]
};

// ─── SECTION 5 — Nine Lenses on One Leader ──────────────────────────────────

const section5 = {
  section_number: 5,
  title: "Nine Lenses on One Leader",
  blocks: [
    heading(2, "Nine Lenses on One Leader"),
    paragraph("Rather than treating Jesus's leadership as a single theme — usually reduced to \"he served people\" — it's more useful to examine him through the specific leadership functions this track has already covered, one at a time. The pattern that emerges is more demanding than a single virtue."),
    table(
      ["Leadership function", "How it shows up"],
      [
        ["Vision", "A kingdom he described in concrete, repeated images rather than abstract doctrine"],
        ["People Development", "Twelve specific people, chosen deliberately, developed over years rather than delegated to in a single meeting"],
        ["Coaching", "A consistent pattern of responding to questions with questions, forcing his own followers to arrive at understanding rather than simply receiving it"],
        ["Delegation", "Sending the Twelve out to do the actual work themselves, with real authority, before they were fully ready by any conventional measure"],
        ["Feedback", "A direct, named correction of Peter's specific failure, delivered privately, followed immediately by a direct restoration — criticism and belief in the same conversation"],
        ["Conflict", "Open, public confrontation of religious leaders' hypocrisy, while showing consistent patience with his own followers' repeated misunderstanding"],
        ["Servanthood", "Washing the feet of the same disciples he knew would abandon him within hours — service that didn't depend on being deserved"],
        ["Succession", "Deliberately preparing followers to continue the work without him, rather than making the mission dependent on his own continued presence"],
        ["Multiplication", "A movement that was never designed to stay small enough for him to personally manage"],
      ]
    ),
    paragraph("The pattern in that Servanthood row shows up repeatedly, not just once at a final meal. A woman who touched his robe in a crowd, desperate and easily overlooked, stopped him mid-journey rather than being brushed aside as a delay. A blind beggar shouting from the roadside, told by the crowd to be quiet, was stopped for anyway. A tax collector everyone else despised was invited to host him for dinner, in full public view, at real cost to his own reputation. None of these were scheduled appointments. Each one was a genuinely important task interrupted for one specific, inconvenient person."),
    paragraph("Two specific moments illustrate the Conflict row worth naming directly, because they show two sides of the same person rather than contradicting each other. He entered Jerusalem publicly on a borrowed donkey rather than arriving with any of the display a figure of his following could easily have commanded — a deliberate refusal of the usual signals of power. Days later, in the same city, he overturned the tables of money changers operating in the temple, a genuinely forceful, disruptive act of public confrontation. Gentleness and confrontation weren't opposites for him. The same person who chose the least impressive possible entrance was fully capable of turning over furniture when something actually mattered enough to demand it."),
    callout("warning", "A common misreading of servant leadership treats gentleness as the whole model — a leader who never confronts anything, avoids conflict entirely, and calls the avoidance humility. That's not what either example here shows. The real pattern is a leader who reserves confrontation for what actually deserves it, rather than using it constantly or never using it at all."),
    paragraph("The test for telling the two apart isn't whether a leader ever confronts anything — it's what triggers the confrontation. Confrontation aimed at protecting the leader's own position or reputation is the leader-first pattern wearing a different costume. Confrontation aimed at protecting people being genuinely exploited is something else entirely, and it's the pattern actually visible in both examples here."),
    callout("tip", "Notice that this table isn't nine separate virtues — it's nine answers to the same underlying question this whole module has been asking: what was all of it actually for? Every function on this list points the same direction — away from himself, toward the people he was developing."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Of these nine functions, which do you practice well, and which have you never seriously attempted?",
      ]
    ),
  ]
};

// ─── SECTION 6 — The Cost of Serving ────────────────────────────────────────

const section6 = {
  section_number: 6,
  title: "The Cost of Serving",
  blocks: [
    heading(2, "The Cost of Serving"),
    paragraph("Every real example in this module shares something in common that's easy to miss while reading quickly through them: none of them were free. Cathy's Sunday closures cost real, recurring revenue. Smith's mill sales cost him public credibility for years before the results proved him right. Jesus's stopping for individuals cost him time, and his washing feet cost him dignity by the standards of his own culture. Servant leadership that costs the leader nothing isn't servant leadership — it's a leadership style chosen because it happened to be convenient."),
    callout("warning", "This is worth stating plainly because it's the detail most leadership content quietly skips: this module isn't describing a more pleasant way to lead. It's describing a more costly one, whose actual return shows up on a timeline most leaders aren't naturally patient enough to wait for."),
    paragraph("There's a specific reason this matters practically, not just morally. A leader who adopts the language of servant leadership without the actual cost hasn't changed anything — they've just found new vocabulary for the same self-interest. The genuine version is distinguishable by exactly one thing: it's still being practiced in the specific moments when it costs the leader something real, not just in the moments when it happens to look good."),
    table(
      ["What it costs", "What it looks like when it's real"],
      [
        ["Time", "Stopping for one person when a schedule says you shouldn't"],
        ["Credit", "Naming someone else's contribution when you could have claimed it"],
        ["Credibility", "Making an unpopular call and not publicly defending yourself while it's still unproven"],
        ["Comfort", "Doing the unglamorous work personally rather than only delegating it"],
      ]
    ),
    paragraph("None of these four require heroics. They require doing the specific thing that costs something, in a specific moment when the cheaper alternative was genuinely available and nobody would have known the difference. That's a much smaller, much more frequent test than the dramatic examples in this module might suggest — and it's the one that actually matters, because it's the one that comes up every week rather than once in a career."),
    paragraph("Look back across this module's examples with that in mind. Coach Bru's recruit didn't perform a single dramatic act of sacrifice — he made one specific choice, repeated across a full season, that cost him nothing but options he never actually needed. Cathy's cost was recurring and structural, built into how the business operated every single week. Smith's cost was reputational, absorbed silently over years rather than resolved in a single announcement. Different scales, same actual test."),
    callout("tip", "A useful diagnostic for your own leadership: name the last three times you chose the costlier version of serving someone over the cheaper one. If you can't name three from the last month, that's the actual finding — not a reason for shame, just the honest starting point this module is asking you to work from."),
    paragraph("This isn't a test you pass once and finish. Every one of the leaders in this module kept facing the same choice repeatedly, for years, not just at the one dramatic moment their story gets remembered for. The recognizable version of servant leadership is the accumulation of many small, unremarkable decisions, not one large visible one."),
    callout("tip", "If this feels discouraging rather than clarifying, that's worth noticing too. The discouragement usually means the bar felt like a personality requirement rather than a series of specific, repeatable choices — and it's the second one, not the first."),
    divider(),
    reflectionQuestions(
      "Not submitted. Not graded. Just yours.",
      [
        "Name one specific way your own version of \"serving others\" has, so far, cost you nothing. What would the costly version of the same thing actually look like?",
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
    paragraph("This module doesn't add a new skill to the seven modules before it. It asks what all of them were actually for. Greenleaf's test, Spears' ten characteristics, Collins's Level 5 humility, the four scriptural images, and the nine functions visible in Jesus's own leadership all point toward the same uncomfortable, checkable question: are the people you lead actually better off because of you?"),
    paragraph("Five very different figures ran through this module — a teenage lacrosse recruit, a restaurant founder, an internal company lawyer nobody expected to succeed, a Bronze Age craftsman, and Jesus himself entering a city on a borrowed donkey. None of them share an industry, an era, or a personality type. What they share is the one thing this whole module has been measuring: each of them, in their own specific way, kept redirecting attention and resources away from themselves and toward the people around them, even when it cost something real to do it."),
    pullQuote("The test was never how humble you sound. It's what actually happened to the people you led."),
    paragraph("If Modules 1 through 7 answered how to become an effective leader, this module has been arguing that effectiveness was never the actual finish line. It was always the means. What it's for is still what it's always been: whether the people around you are measurably, checkably better off because you led them."),
    paragraph("Module 9 picks up directly from here, with the practical mechanics this module has argued for but not yet taught: how to actually develop someone else — the specific process, not just the posture behind it."),
    videoPlaceholder("2-3 min closing from Denis — a direct, honest answer to Greenleaf's test applied to his own leadership, including where he knows the answer isn't yet what he wants it to be."),
    divider(),
    heading(3, "Before the Assignment"),
    paragraph("The scorecard below isn't a grade — nobody sees it but you. Its only purpose is the same one this whole module has argued for: turning a feeling about your own leadership into something checkable."),
    scorecard("Servant Leadership Self-Audit", "module8_servant_leadership", [
      { key: "listening", label: "Listening — I receive what's said before responding", max: 10, helpText: "How often do you interrupt before someone finishes a real concern?" },
      { key: "stewardship", label: "Stewardship — I treat what I lead as held in trust, not owned", max: 10, helpText: "Would the people you lead describe you as building something for them, or through them for yourself?" },
      { key: "humility", label: "Humility — I point to others in success, to myself in failure", max: 10, helpText: "Where did you actually point after your last real success and your last real failure?" },
      { key: "development", label: "Development — I'm building people who could eventually lead without me", max: 10, helpText: "If you left tomorrow, could the people you've developed actually continue without you?" },
    ]),
    assignmentPrompt(
      "Week 8 Assignment",
      "This assignment asks you to run Greenleaf's test on your own leadership honestly, and to name one specific person you're actually preparing to succeed you in something real.",
      [
        {
          number: 1,
          heading: "Run Greenleaf's Test",
          guidance: "Name one specific person you currently lead. Applying Greenleaf's actual test — are they growing, becoming healthier and more capable, more likely themselves to serve others? — what's the honest answer, not the hopeful one?"
        },
        {
          number: 2,
          heading: "Name Your Strongest and Weakest Characteristic",
          guidance: "Of Spears' ten characteristics in Section 2, name your genuine strongest and your genuine weakest. Describe one recent moment the weak one actually cost you something."
        },
        {
          number: 3,
          heading: "Where Did You Point?",
          guidance: "Describe your most recent real success and your most recent real failure. Where did you actually point when explaining each one — honestly, not as you'd want to have answered?"
        },
        {
          number: 4,
          heading: "Name Your Successor",
          guidance: "Name one specific person you are deliberately preparing to be able to continue your current work without you — not hypothetically, an actual person, with an actual next step you'll take with them this month."
        },
        {
          number: 5,
          heading: "Servant-First or Leader-First?",
          guidance: "Using the practical marker from Section 1 — what happens inside you when serving costs something and no one's watching — answer honestly: which instinct actually showed up the last time you were genuinely tested?"
        }
      ],
      200,
      800
    ),
  ]
};

// ─── Assemble module ────────────────────────────────────────────────────────

const sections = [section1, section2, section3, section4, section5, section6, section7];

const module8 = {
  module_number: 8,
  title: "Servant Leadership",
  subtitle: "What All of It Was Actually For",
  track_slug: "leadership",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 80,
  cover_image_alt: "An upside-down crown functioning as a bowl of water, reflecting light",
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

console.log(`Module 8 — "${module8.title}"`);
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

fs.writeFileSync('module8_leadership.json', JSON.stringify(module8, null, 2));
console.log(`\nWritten to module8_leadership.json`);
