// Marriage Module 5 — "Words & Conflict"
// Ported on 2026-11-04 from build_module5_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module5.js
//
// Writes module5_marriage.json to the current directory.
//
// Matches the revised source Denis ran from Claude chat. Its privacy wording already says the
// partner cannot see the reflections, ratings and assignment. oEmbed check on 2026-11-04:
// the Four Horsemen video is on The Gottman Institute's channel and the Smalley video is on
// Focus on the Family's. The only Marriage Course candidate was on a local church channel,
// so that slot and its tip are left out, as the builder does for "none". Rhino and hedgehog
// and the Nicky and Sila Lee credit remain in the text.

const fs = require('fs');

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const divider = () => ({ type: "divider", data: {} });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const reflectionQuestions = (title, questions) => ({ type: "reflection_questions", data: { title, questions } });
const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });
const assignmentPrompt = (fields) => ({ type: "assignment_prompt", data: fields });
const quiz = (scope, title, questions) => ({ type: "quiz", data: { scope, title, questions } });

// Art and video not produced yet stay visible as callouts. Images will go in
// public/images/marriage/module-5/MM5-1..3.png.
const imagePlaceholder = (ref, brief) => callout("note", `[IMAGE PLACEHOLDER — ${ref}] ${brief}`);
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Words & Conflict"),
    paragraph("Module 5 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why most marriages are not destroyed by one great betrayal but by ten thousand small conversations, and why talking, listening and fighting well are skills that can be learned."),
    callout("info", "Who this is for: Everyone on this track. If you are courting or engaged, this module gives you the tools before you need them. If you are married, it names the patterns you may already be caught in, and shows you the way out. If you are single, practise these skills in your family and friendships now; they are the same skills."),
    callout("info", "Core promise: By the end of this module you will know your own communication wiring and your partner's, how to listen so that someone feels understood, the four patterns that predict a marriage's collapse and their antidotes, a five-step path through any disagreement, and how to heal the hurts you will inevitably cause each other."),
    callout("info", "Time commitment: About 85 minutes of reading and reflection, plus 30 minutes for the assignment. If you have a partner on this track, the listening exercise in Section 2 is meant to be done together."),
    divider(),
  ],
};

// ─── Two Cultures, One House ───
const section1 = {
  section_number: 1,
  title: "Two Cultures, One House",
  blocks: [
    heading(2, "Section 1 — Two Cultures, One House"),
    imagePlaceholder("MM5-1", "Content: Two African families seated at two separate dinner tables in contrasting homes, one loud and animated with everyone talking at once, the other quiet and still, a young man and young woman visible one in each, warm evening light. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Everyone says couples must \"communicate\", but few ever define it. Communication is two skills, not one: talking honestly and listening well. Most of us are untrained in both."),
    paragraph("Here is something nobody warns you about. It is only once you are married that you discover your way of seeing things is not the universal way of seeing things. You assumed your whole life that any reasonable person processes the world roughly as you do. You were wrong, and you are about to live with the evidence."),
    heading(3, "Two Questions About Your Wiring"),
    paragraph("The Christian counsellor Walter Trobisch, and many teachers after him, described common communication wirings. They are really two separate questions rather than four boxes. Answer both about yourself, then about the person you love, and say the answers out loud to each other."),
    table([
      "The question",
      "One way",
      "The other way",
      "What goes wrong between them"
    ], [
      [
        "How do you process?",
        "Outward: you think out loud, and silence feels like distance. What others hear is your working, not your conclusion.",
        "Inward: you organise your thoughts first and speak only when they are finished. Being rushed to talk feels like pressure.",
        "The out-loud processor treats every sentence as a position to defend; the inward processor's silence is read as a verdict. Each reads the other correctly in their own language and wrongly in the other's."
      ],
      [
        "How do you decide?",
        "Analytically: methodically, weighing every angle, arriving slowly and carefully.",
        "Intuitively: on a strong inner sense, sometimes leaping to a conclusion the other is still building.",
        "The analytical partner feels the intuitive one is reckless; the intuitive partner feels the analytical one is a brake with no engine. Each is right about the other's risk and blind to their own."
      ]
    ]),
    paragraph("Picture a husband who announces conclusions and a wife who wants to walk the road (Module 4 tells our own story of exactly this). Neither wiring is right or wrong, mature or immature. They are different instruments, and a marriage is meant to be a duet, not a contest over whose instrument is the real music."),
    heading(3, "The Home That Shaped You"),
    paragraph("Your parents taught you how a household communicates, and they taught you by demonstration, not instruction. You absorbed it without ever examining it. When you marry, two communication cultures move into one house. If you do not name them and consciously build a third one, your own, you will each keep judging the other by the rules of a home the other never lived in."),
    table([
      "Ask each other before the wedding (or now, if you are married)",
      "What it reveals"
    ], [
      [
        "When your parents disagreed, what happened? Did they argue in front of you, or did the house go cold for three days?",
        "Your instinct in conflict"
      ],
      [
        "Was affection spoken out loud in your home, or assumed?",
        "What you expect to hear, and what you may forget to say"
      ],
      [
        "When someone was angry, how did you know?",
        "The signals you watch for and the ones you send"
      ],
      [
        "Did people say what they meant, or did you learn to read what sat underneath the sentence?",
        "Whether you speak directly or in hints"
      ],
      [
        "Who apologised first, and how?",
        "Whether you know how to repair at all"
      ]
    ]),
    pullQuote("You will do what was done to you, or you will do the violent opposite of it. Neither is a decision until you have named it."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Am I an outward or inward processor? Analytical or intuitive? What about the person closest to me?",
      "What did my family teach me about disagreement without anyone saying a word?",
      "Which rule from my family's house do I expect my partner to follow, even though they never lived there?"
    ]),
    divider(),
  ],
};

// ─── Listen to Understand ───
const section2 = {
  section_number: 2,
  title: "Listen to Understand",
  blocks: [
    heading(2, "Section 2 — Listen to Understand"),
    callout("scripture", "\"My dear brothers and sisters, take note of this: everyone should be quick to listen, slow to speak and slow to become angry.\" — James 1:19"),
    paragraph("Be honest: most of us do not listen. We wait to talk, composing our reply while the other person is still speaking. Real listening lets the other person finish. It puts your own agenda aside and works to see the matter through their eyes, especially when they feel differently from you."),
    pullQuote("Most people do not listen to understand. They listen to reply."),
    table([
      "The habit that blocks listening",
      "What the speaker hears"
    ], [
      [
        "Interrupting",
        "\"What you are saying matters less than what I am about to say.\""
      ],
      [
        "Drifting: the phone, the television, your own thoughts",
        "\"You are not worth my full attention.\""
      ],
      [
        "Rushing to give advice",
        "\"I want to fix this so we can stop talking about it.\""
      ],
      [
        "Quick reassurance: \"Don't worry, it will be fine\"",
        "\"Your feelings make me uncomfortable.\""
      ],
      [
        "Defending yourself in the first minute",
        "\"I would rather win than understand you.\""
      ]
    ]),
    callout("tip", "Practise this, literally, this week. One of you speaks about something weighing on them for a few minutes. The other only listens, then reflects back what they heard, feelings included: \"What I hear you saying is... and it sounds like you feel...\" Keep going until the speaker says, \"Yes, that is it. You have understood me.\" Then change places. It will feel awkward the first time. Do it anyway. Being truly heard is one of the deepest ways a human being feels loved."),
    heading(3, "The Second Question"),
    paragraph("Brothers, hear this especially. The first sentence your wife says is almost never the real complaint. It is the safest version of it, the one she has decided she can risk. \"You are never home\" is an opening. Underneath it is something more specific and more costly to say: that she is carrying the evenings alone, or that she no longer knows how to reach you, or that she is afraid of what the children are learning. The second question is where that lives: \"What is it like for you on those evenings?\""),
    paragraph("A man who defends himself after the first sentence never reaches the second one, and can spend thirty years answering openings. Defending is not the same as disagreeing. You are entitled to disagree. Defending is treating her words as an accusation to dismiss rather than information to understand."),
    pullQuote("When something stings, ask one question before you make one statement. The question itself is the message: I would rather understand you than win this."),
    heading(3, "What They Cannot Say"),
    paragraph("In a calm hour, when nothing is wrong, ask your partner: \"What is it that you cannot say to me?\" Then stop talking. Let the silence be as long as it needs to be. Most of what you need to hear in your marriage is on the other side of a minute you did not fill. Expect the first answer to be small: they are testing the water with something they can afford to lose. What you do with that small answer decides whether you will ever hear the large one."),
    table([
      "When they finally say it",
      "Why"
    ], [
      [
        "Do not explain yourself in the first sixty seconds",
        "Your explanation may even be correct. It is still the thing that closes the door."
      ],
      [
        "Thank them, out loud, for saying something that was frightening to say",
        "Honesty that is punished is never offered again"
      ],
      [
        "Change something within the week",
        "Gratitude with no action teaches them that honesty is merely absorbed"
      ]
    ]),
    callout("warning", "A spouse's silence is not peace. It is a bill being deferred, and in many marriages it falls due years later, all at once. And if your spouse can only get your full attention by being upset, you are not dealing with an emotional person. You are training one."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Which listening habit in the table is mine?",
      "When did I last ask a second question instead of defending myself?",
      "Is there something I cannot say to the person closest to me? What would make it safe to say?"
    ]),
    divider(),
  ],
};

// ─── Words That Build, Words That Break ───
const section3 = {
  section_number: 3,
  title: "Words That Build, Words That Break",
  blocks: [
    heading(2, "Section 3 — Words That Build, Words That Break"),
    callout("scripture", "\"The tongue has the power of life and death.\" — Proverbs 18:21"),
    callout("scripture", "\"Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up according to their needs, that it may benefit those who listen.\" — Ephesians 4:29"),
    paragraph("Many marriages are not damaged by cruelty but by a sharp tongue in a tired mouth. The research says the same thing Scripture does. The psychologist John Gottman, after decades of observing couples in conflict, identified four patterns of communication so destructive that he called them the Four Horsemen. Every couple slips into them sometimes. The danger is when they become the normal way you speak to each other."),
    table([
      "The horseman",
      "What it sounds like",
      "The antidote",
      "What the antidote sounds like"
    ], [
      [
        "Criticism: attacking the person instead of the problem",
        "\"You never think about anyone but yourself.\"",
        "Gentle start-up: name your feeling and a specific need",
        "\"I felt hurt when you made plans without asking me. I need us to decide weekends together.\""
      ],
      [
        "Contempt: speaking from superiority, with mockery, sarcasm or eye-rolling",
        "\"Oh, of course. The great man has spoken.\"",
        "Build a culture of appreciation and respect",
        "\"Thank you for staying calm with the children today. I noticed.\""
      ],
      [
        "Defensiveness: protecting yourself instead of hearing them",
        "\"It's not my fault. You're the one who...\"",
        "Take responsibility, even for part of it",
        "\"You're right that I forgot. I'm sorry.\""
      ],
      [
        "Stonewalling: shutting down and withdrawing",
        "Silence, turning away, leaving the room with no word",
        "Physiological self-soothing: take a real break to calm down, then come back",
        "\"I'm too upset to talk well. Give me twenty minutes and I'll come back.\""
      ]
    ]),
    paragraph("Of the four, Gottman's institute names contempt as the greatest predictor of divorce. Contempt says, \"I am above you.\" It is the opposite of honour, and Scripture commands honour in marriage over and over. If contempt has crept into your home, it is the first horseman to fight."),
    videoEmbed("1o30Ps-_8is", "Four Horsemen of the Apocalypse | The Gottman Institute"),
    callout("tip", "As you watch, identify your own most common horseman, not your partner's. Then practise its antidote once this week, on purpose."),
    pullQuote("Contempt says \"I am above you\". Honour says \"you are worth my best words\"."),
    divider(),
  ],
};

// ─── Conflict Is Not Failure ───
const section4 = {
  section_number: 4,
  title: "Conflict Is Not Failure",
  blocks: [
    heading(2, "Section 4 — Conflict Is Not Failure"),
    imagePlaceholder("MM5-2", "Content: A young African couple sitting on opposite ends of a sofa after a disagreement, both looking down, a small gap between them, a single lamp lighting the room, the mood heavy but not hopeless. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Settle this in your heart now: conflict is not a sign that you married wrong. Conflict is inevitable, because marriage is two different people, from two different histories, with two different sets of desires and a shared portion of ordinary human selfishness, living in one house with one bed, one budget and one calendar. Put plainly: if you have courted for more than six months with no misunderstanding, someone is pretending."),
    pullQuote("The question is never whether you will disagree. It is whether you have the tools to disagree without destroying anything."),
    callout("scripture", "\"In your anger do not sin: Do not let the sun go down while you are still angry.\" — Ephesians 4:26"),
    paragraph("Notice that Scripture separates the anger from the sinning. Anger itself is not sin. What damages a marriage is what we do with it."),
    heading(3, "Rhinos and Hedgehogs"),
    paragraph("Nicky and Sila Lee, who created The Marriage Course now used by churches around the world, offer a picture no couple forgets. When hurt, some of us are rhinos and some of us are hedgehogs."),
    table([
      "",
      "The rhino",
      "The hedgehog"
    ], [
      [
        "When hurt",
        "Charges: voice raised, words sharpened, straight at the other person",
        "Rolls up: goes quiet, withdraws, hides behind spikes of silence"
      ],
      [
        "How it wounds",
        "Openly and quickly",
        "Slowly and invisibly"
      ],
      [
        "What it resolves",
        "Nothing",
        "Nothing"
      ],
      [
        "What to learn",
        "To slow down, lower the volume and speak to the problem, not the person",
        "To come out, name what you feel, and stay in the conversation"
      ]
    ]),
    paragraph("Both are failures. Know which animal you are. If you are not sure, the person who loves you can tell you in one second. Then begin learning to air disagreement like neither of them: honestly, calmly, in the open."),
    heading(3, "The Mover and the Leaver"),
    paragraph("In nearly every marriage, conflict sorts two people into a mover and a leaver. One moves toward the problem: wants it settled now, raises it again, presses. The other moves away: needs room, goes quiet, leaves the room. The trap is that each instinct provokes the other. The more one presses, the further the other retreats; the further one retreats, the harder the other presses. Neither of you is doing anything wrong. Together you are building a machine."),
    callout("tip", "Agree this rule now, while you are calm: either of you may call a pause, and whoever calls it must name the time you will come back to it. \"I need an hour. Let's talk at eight.\" The pause protects the one who needs room. The named time protects the one who needs resolution. That single agreement will save you a hundred bad nights."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Am I a rhino or a hedgehog? A mover or a leaver?",
      "What happened the last time I was angry with the person closest to me? Did I sin in my anger?",
      "Which of the Four Horsemen shows up most often in my words?"
    ]),
    divider(),
  ],
};

// ─── A Path Through Every Disagreement ───
const section5 = {
  section_number: 5,
  title: "A Path Through Every Disagreement",
  blocks: [
    heading(2, "Section 5 — A Path Through Every Disagreement"),
    paragraph("Learn a simple path for the disagreement itself, and walk it every time."),
    table([
      "Step",
      "What to do",
      "What it sounds like"
    ], [
      [
        "1. Put the issue in front of you, not between you",
        "You are on the same side of the table. The problem is on the other side. It is never me against you, but us against it.",
        "\"We have a problem with how we spend Sundays. Let's solve it together.\""
      ],
      [
        "2. Speak in \"I\", not \"you always\"",
        "\"I\" invites understanding. \"You always\" invites a defence lawyer.",
        "\"I felt hurt when the decision was made without me,\" not \"You never consult me.\""
      ],
      [
        "3. Take turns, and truly listen",
        "Use everything from Section 2: let them finish, reflect back, ask the second question.",
        "\"So what you're saying is... Did I get that right?\""
      ],
      [
        "4. Look for solutions together",
        "Put several options on the table before judging any of them.",
        "\"What are three ways we could handle this?\""
      ],
      [
        "5. Choose one, try it, review it",
        "If it fails, try another. If you cannot find one at all, bring in the wise third voice you agreed on in advance.",
        "\"Let's try this for a month and talk again.\""
      ]
    ]),
    pullQuote("You are on the same side of the table. The problem is on the other side. A couple that forgets this wins arguments and loses years."),
    heading(3, "The 10 O'clock Rule"),
    paragraph("One of the most practical gifts in the Lees' course is what they call the 10 o'clock rule: either of you may pause an argument that is running late into the night and postpone it to a better hour, and the other must honour the pause. Nothing is ever resolved at midnight. Tired people do not seek solutions. They seek victories, and they say things at midnight that mornings cannot take back."),
    heading(3, "Do Not Load the Wagon"),
    paragraph("Here is the warning that must always go with the pause: a paused fight must be finished, not stored. Some couples never truly resolve anything. They load each unresolved offence onto a wagon, quietly, month after month, until one day, in some small disagreement about nothing, the whole wagon is unloaded at once: ancient grievances, expired arguments, wounds from three years ago. That is not peace. It is deferred war, and the person buried under the wagon never saw it coming."),
    callout("info", "So when you pause, set the time and place to finish it, and finish it. The 10 o'clock rule ends the midnight fight. Refusing to load the wagon ends the ten-year one."),
    videoEmbed("5vWkzB2oBuY", "Why The Happiest Couples Still Fight | Greg and Erin Smalley"),
    callout("tip", "About 30 minutes. Greg and Erin Smalley lead Focus on the Family's marriage ministry. As you watch, look for one practical habit you can add to the five steps above."),
    divider(),
  ],
};

// ─── Arit's Turn: The Quiet Hour ───
const section6 = {
  section_number: 6,
  title: "Arit's Turn: The Quiet Hour",
  blocks: [
    heading(2, "Section 6 — Arit's Turn: The Quiet Hour"),
    videoPlaceholder("2-3 min from Arit (and Denis): what the quiet after an apology really means, and the four-second answer it is waiting for."),
    paragraph("When my husband apologises and I am still quiet an hour later, he used to think I was punishing him. I was not. Let me tell you what is in that hour, because I think most husbands imagine it is anger."),
    paragraph("Two things are happening at once. The first is that I am deciding. Sometimes the words are enough; it depends on the weight of the thing. But there are times when saying the words is not enough, and in that quiet I am reflecting, working out how I move forward from here. I have not finished yet. That is all the silence is on the inside."),
    paragraph("The second is that the quiet is asking you something. It is asking: do you see me? Do you feel me? Not punishment, and not strategy. A question, in the only language left once the words have already been spent."),
    paragraph("And the answer it is looking for is not another sentence. I was expecting him to come to me. To close the distance. To hold me. You do not have to say anything at all. Just be there. What arrives instead, too often, is a transaction: I have said the sentence, so that should take care of it. It would have been easier for me to say, \"I need more than words.\" But it did not feel right to have to ask for more than words."),
    pullQuote("The quiet is not a wall. It is a question: do you see me? And the answer it is waiting for is not a sentence. It is someone crossing the room."),
    heading(3, "Denis Adds One Thing"),
    paragraph("I know how a man reads that the first time. It sounds like a test: she will not tell me what she wants, I am expected to guess, and if I guess wrong I lose. That reading is unfair to her, and it lets me off. She has just told you exactly what the answer is: cross the room and hold her. It costs about four seconds. The reason she will not ask is not manipulation. It is that a comfort she has to request stops being evidence that you wanted to give it. So do not stand there having said the sentence, waiting for her to release you. Move."),
    callout("note", "This is Arit's experience, and many wives will recognise it. Your partner may need something different after a conflict: space, a walk, a meal together, a prayer. Do not guess. In a calm hour, ask: \"After we have hurt each other, what helps you feel close again?\" Then do it."),
    divider(),
  ],
};

// ─── The Process That Heals Hurt ───
const section7 = {
  section_number: 7,
  title: "The Process That Heals Hurt",
  blocks: [
    heading(2, "Section 7 — The Process That Heals Hurt"),
    paragraph("Even with every tool in this module, you will hurt each other. Not might: will. Two imperfect people in covenant guarantee it. The wounds you carry into marriage are the subject of Module 2. This is what to do with the wounds you cause inside it. The process has three movements, and none may be skipped."),
    table([
      "Movement",
      "What it means",
      "The trap to avoid"
    ], [
      [
        "1. Talk about the hurt",
        "Say so, soon, plainly, without theatre",
        "Hurt that is not spoken does not evaporate. It compounds into self-pity and resentment."
      ],
      [
        "2. Say sorry, really sorry",
        "Take responsibility for your own wrong words and actions",
        "The escape hatch: \"I'm sorry if you were offended\" is not an apology. It is an accusation in a costume."
      ],
      [
        "3. Forgive",
        "Face the wrong fully, feel what it cost, then choose to release it rather than hold it against them",
        "Waiting to feel forgiving. Forgiveness is a choice before it is ever a feeling; the feelings follow, sometimes slowly."
      ]
    ]),
    table([
      "Forgiveness is not...",
      "Forgiveness is..."
    ], [
      [
        "Forgetting that it happened",
        "Choosing not to use it as a weapon"
      ],
      [
        "Pretending it did not matter",
        "Admitting it mattered, and releasing it anyway"
      ],
      [
        "Refusing to confront wrong behaviour",
        "Confronting it, and refusing to hold it over the person for ever"
      ],
      [
        "A one-time event for every hurt",
        "Sometimes a process: some hurts must be forgiven again each time they resurface"
      ]
    ]),
    callout("scripture", "\"Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.\" — Colossians 3:13"),
    callout("tip", "A small habit from the Lees, as small as a mustard seed: every so often, ask each other, \"Is there anything you need to forgive me for?\" That one question keeps short accounts. It sweeps the house before the dust becomes a hill."),
    pullQuote("Love keeps no record of wrongs. Forgiveness is how the record is cleared."),
    divider(),
  ],
};

// ─── Ban One Word ───
const section8 = {
  section_number: 8,
  title: "Ban One Word",
  blocks: [
    heading(2, "Section 8 — Ban One Word"),
    paragraph("Now the commitment that crowns the rest. Agree together, solemnly and in so many words, that the word divorce will never be spoken in your house. Not hurled in an argument, not whispered as a threat, not entertained as a quiet fantasy in a hard season."),
    paragraph("This is not pretending that hard seasons will not come. Every real marriage passes through valleys. It is something far more powerful: removing the exit, so that the only door left is the one marked \"fix it\". This is covenant thinking, the very thing that separates a covenant from a contract. A contract has exit clauses. A covenant burns them."),
    pullQuote("When divorce is an option, every conflict is an audition for it. Ban the word, and the same conflicts become problems you solve together."),
    callout("warning", "But not this. Banning the word divorce never means staying within reach of violence or abuse. Repair assumes two people who both want the marriage whole. Where one person is deliberately and repeatedly harming the other, the language of repair does not apply. If that is your situation, speak to a trusted pastor or counsellor, and contact local emergency services if you are in danger."),
    divider(),
  ],
};

// ─── How Do I Speak and Fight? ───
const section9 = {
  section_number: 9,
  title: "How Do I Speak and Fight?",
  blocks: [
    heading(2, "How Do I Speak and Fight?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate yourself in your closest relationships."),
    scorecard("How Do I Speak and Fight?", "marriage_module5_words", [
      {
        "key": "wiring",
        "max": 10,
        "label": "I know my communication wiring and my partner's, and I respect the difference",
        "helpText": "Outward or inward? Analytical or intuitive?"
      },
      {
        "key": "listen",
        "max": 10,
        "label": "I listen to understand, not to reply",
        "helpText": "When did you last reflect back before answering?"
      },
      {
        "key": "second",
        "max": 10,
        "label": "I ask a second question before I defend myself",
        "helpText": "What was the last opening you answered instead of exploring?"
      },
      {
        "key": "horsemen",
        "max": 10,
        "label": "Criticism, contempt, defensiveness and stonewalling are rare in my words",
        "helpText": "Which horseman is yours?"
      },
      {
        "key": "anger",
        "max": 10,
        "label": "I am angry without sinning: neither rhino nor hedgehog",
        "helpText": "What did your last argument look like?"
      },
      {
        "key": "finish",
        "max": 10,
        "label": "When I pause a conflict, I come back and finish it",
        "helpText": "Is your wagon loaded?"
      },
      {
        "key": "forgive",
        "max": 10,
        "label": "I apologise without excuses and forgive without keeping score",
        "helpText": "Is there anything you are still holding?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the skill to practise first, this week, on purpose."),
    divider(),
  ],
};

// ─── Module 5 Assignment — Talk, Listen, Fight Well, Forgive ───
const section10 = {
  section_number: 10,
  title: "Module 5 Assignment — Talk, Listen, Fight Well, Forgive",
  blocks: [
    heading(2, "Module 5 Assignment — Talk, Listen, Fight Well, Forgive"),
    assignmentPrompt({
      "title": "Module 5 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If conflict in your relationship ever involves threats, violence or fear, skip Prompt 3 and speak to a trusted pastor or counsellor first.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "Two Cultures",
          "guidance": "Answer the five questions about your family's communication culture in Section 1. Then describe the third culture you want to build in your own home: how you will disagree, how you will show affection, and how you will apologise. Married: describe the culture you actually have, and one change you will make."
        },
        {
          "number": 2,
          "heading": "The Listening Exercise",
          "guidance": "Do the listening exercise from Section 2 with your partner, or with a close friend or family member if you are single. Write what it was like to listen without replying, and what it was like to be fully heard. What did you understand that you had missed before?"
        },
        {
          "number": 3,
          "heading": "My Horseman and My Animal",
          "guidance": "Name your most common horseman, and whether you are a rhino or a hedgehog, a mover or a leaver. Describe a recent conflict where it showed. Rewrite one thing you said using the antidote, and write the pause rule you will agree with your partner, including how you will name the time to come back.",
          "example": "Example: \"Instead of 'You never help me', I will say 'I'm exhausted tonight and I need help with the children.'\""
        },
        {
          "number": 4,
          "heading": "Short Accounts",
          "guidance": "Ask your partner (or someone close to you): \"Is there anything you need to forgive me for?\" Write what they said and how you responded. Then write one hurt you are still holding, and what releasing it would look like. If it is too heavy to release alone, name the pastor or counsellor you will talk to."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Words & Conflict", [
      {
        "id": "q1",
        "prompt": "Why do couples so often misread each other's communication?",
        "options": [
          {
            "id": "a",
            "text": "One of them is always wrong"
          },
          {
            "id": "b",
            "text": "They are wired differently and grew up in different communication cultures, and each judges the other by their own rules"
          },
          {
            "id": "c",
            "text": "Men and women cannot understand each other"
          },
          {
            "id": "d",
            "text": "They do not love each other enough"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: two cultures move into one house. Name them, and build a third one together."
      },
      {
        "id": "q2",
        "prompt": "What does it mean to listen to understand rather than to reply?",
        "options": [
          {
            "id": "a",
            "text": "Staying silent until they finish, then giving your answer"
          },
          {
            "id": "b",
            "text": "Letting them finish, seeing it through their eyes, and reflecting back what you heard, feelings included"
          },
          {
            "id": "c",
            "text": "Agreeing with everything"
          },
          {
            "id": "d",
            "text": "Giving good advice quickly"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 2: keep going until they say, \"Yes, you have understood me.\""
      },
      {
        "id": "q3",
        "prompt": "Which of Gottman's Four Horsemen is named as the greatest predictor of divorce?",
        "options": [
          {
            "id": "a",
            "text": "Criticism"
          },
          {
            "id": "b",
            "text": "Contempt"
          },
          {
            "id": "c",
            "text": "Defensiveness"
          },
          {
            "id": "d",
            "text": "Stonewalling"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: contempt says \"I am above you\". Its antidote is a culture of appreciation and respect."
      },
      {
        "id": "q4",
        "prompt": "What is the difference between the rhino and the hedgehog?",
        "options": [
          {
            "id": "a",
            "text": "The rhino is always right"
          },
          {
            "id": "b",
            "text": "The rhino charges when hurt; the hedgehog withdraws. Both fail to resolve anything."
          },
          {
            "id": "c",
            "text": "The hedgehog is the mature one"
          },
          {
            "id": "d",
            "text": "There is no difference"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: learn to air disagreement like neither of them: honestly, calmly, in the open."
      },
      {
        "id": "q5",
        "prompt": "What protects both the mover and the leaver in a conflict?",
        "options": [
          {
            "id": "a",
            "text": "Never discussing problems"
          },
          {
            "id": "b",
            "text": "Either may call a pause, and whoever calls it names the time to come back"
          },
          {
            "id": "c",
            "text": "The mover always wins"
          },
          {
            "id": "d",
            "text": "Writing letters instead of talking"
          }
        ],
        "correct_option_id": "b",
        "explanation": "The pause protects the one who needs room; the named time protects the one who needs resolution."
      },
      {
        "id": "q6",
        "prompt": "What is the first step on the path through a disagreement?",
        "options": [
          {
            "id": "a",
            "text": "Decide who is right"
          },
          {
            "id": "b",
            "text": "Put the issue in front of you, not between you: us against the problem"
          },
          {
            "id": "c",
            "text": "Call a family member"
          },
          {
            "id": "d",
            "text": "List every past mistake"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: you are on the same side of the table."
      },
      {
        "id": "q7",
        "prompt": "In Arit's Turn, what is the quiet after an apology really asking?",
        "options": [
          {
            "id": "a",
            "text": "For a longer apology"
          },
          {
            "id": "b",
            "text": "For a gift"
          },
          {
            "id": "c",
            "text": "\"Do you see me?\" The answer is someone crossing the room"
          },
          {
            "id": "d",
            "text": "To be left alone for a week"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 6: the quiet is not a wall. It is a question."
      },
      {
        "id": "q8",
        "prompt": "Why is \"I'm sorry if you were offended\" not an apology?",
        "options": [
          {
            "id": "a",
            "text": "It is too short"
          },
          {
            "id": "b",
            "text": "It places the problem in the other person's reaction instead of taking responsibility"
          },
          {
            "id": "c",
            "text": "It should be said in writing"
          },
          {
            "id": "d",
            "text": "It is fine as an apology"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 7: it is an accusation in a costume."
      }
    ]),
    divider(),
  ],
};

// ─── Module 5 Complete ───
const section11 = {
  section_number: 11,
  title: "Module 5 Complete",
  blocks: [
    heading(2, "Module 5 Complete"),
    imagePlaceholder("MM5-3", "Content: A young African husband and wife sitting side by side at a table facing a single sheet of paper together, both pointing at it and smiling slightly, sunlight through a window, conveying 'us against the problem'. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1600×900."),
    videoPlaceholder("2-3 min closing from Denis and Arit: an argument they still laugh about, the rule that has saved them most often, and a prayer over couples whose words have become weapons."),
    paragraph("You have named your wiring and your family's culture, learned to listen until someone feels understood, met the Four Horsemen and their antidotes, found a path through any disagreement, heard what the quiet hour is asking, and learned the three movements that heal hurt. Words and conflict will not disappear from your home. But they no longer have to destroy it."),
    paragraph("Module 6 turns to how two people actually run a shared life: roles, work, headship and partnership, and who does what when there is only one house and one calendar."),
    callout("info", "Next: Module 6 — Roles & Work. Before you begin, finish your assignment, and agree your pause rule with your partner this week."),
  ],
};

// ─── Assemble ───

const module5 = {
  module_number: 5,
  slug: "words-and-conflict",
  title: "Words & Conflict",
  subtitle: "Listening, Fighting Well, and the Process That Heals Hurt",
  track_slug: "marriage",
  pillar: "communication-connection",
  pillar_id: "00000000-0000-0000-0002-000000000012",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 115,
  sort_order: 5,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11],
};

const total = module5.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 5 — "${module5.title}"`);
module5.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module5_marriage.json", JSON.stringify(module5, null, 2));
console.log("\nWritten to module5_marriage.json");
