// Marriage Module 2 — "Know Yourself, Heal Yourself"
// Ported on 2026-11-03 from build_module2_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module2.js
//
// Writes module2_marriage.json to the current directory.
//
// Edits from the authored source, all approved by Denis:
//
// - The assignment no longer opens "This assignment is private", because admins can
//   read submissions. It says the partner can't see it.
// - "Shame or Guilt?" closes Section 3: a heading, a paragraph, the Brené Brown video
//   and a tip, in Denis's wording, after an oEmbed check of psN1DORYYV0.
// - The T.D. Jakes video closes "Section 6" before the final tip, with a paragraph and a
//   tip in Denis's wording. oEmbed check of MxPEBPrZq-4 on 2026-11-04: on TBN's channel,
//   which Denis accepted for this slot.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-2/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Know Yourself, Heal Yourself"),
    paragraph("Module 2 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why the most important person you bring into a marriage is not your partner but yourself, and why healing is not a delay on the road to covenant but the road itself."),
    callout("info", "Who this is for: Every person on this track, single, engaged or married. This module is about you, not your partner. If you are married, resist the urge to read it with your spouse in mind. Read it with yourself in mind."),
    callout("info", "Core promise: By the end of this module you will know why you want marriage (or why you stay in it), what you are carrying into it, and the path to begin healing what still hurts."),
    callout("info", "Time commitment: About 80 minutes of reading and reflection, plus 30 minutes for the assignment. Sections 4 to 6 may stir old memories. Go at your own pace."),
    callout("warning", "A word of care before you begin. This module touches painful subjects, including childhood hurt and abuse. You decide what to write and what to share; your partner cannot see your reflections or answers. If anything here stirs something you cannot carry alone, stop and speak to a trusted pastor or trained counsellor. That is not weakness. It is wisdom."),
    divider(),
  ],
};

// ─── Why Do You Want to Marry? ───
const section1 = {
  section_number: 1,
  title: "Why Do You Want to Marry?",
  blocks: [
    heading(2, "Section 1 — Why Do You Want to Marry?"),
    image("/images/marriage/module-2/MM2-1.png", "Two scenes side by side at dusk: a young African man and a young African woman, each sitting alone by a window in a separate room, chin on hand, looking out thoughtfully at the sunset. No text appears in the image."),
    paragraph("Before you ask whether this is the right person, ask a harder question: why do you want to be married at all? Most people have never answered it honestly, even to themselves."),
    paragraph("Some reasons can carry the weight of a lifelong covenant. Others look like love but are really something else wearing its clothes."),
    table([
      "Reasons that will not hold",
      "What is really driving it"
    ], [
      [
        "To escape my parents' control, or an unhappy home",
        "Escape"
      ],
      [
        "Because being chosen will finally make me feel worth something",
        "A poor self-image"
      ],
      [
        "To rescue or fix the other person",
        "Marrying a project, not a partner"
      ],
      [
        "Because all my friends are married, or I fear being called an old bachelor or an old maid",
        "Fear of being left out"
      ],
      [
        "Because I am afraid of being alone",
        "Fear"
      ],
      [
        "Because I am still hurting from my last relationship",
        "The rebound"
      ],
      [
        "Because I am afraid of hurting them if I say no",
        "Pressure"
      ],
      [
        "Because I am pregnant, or because we have already slept together",
        "Obligation"
      ]
    ]),
    paragraph("None of these is love. Each one is fear, pressure or escape dressed up as love, and a marriage built on fear tends to live its whole life afraid."),
    table([
      "Reasons that can carry a covenant"
    ], [
      [
        "After prayer and wise counsel, I am convinced it is God's will for me to marry this particular person."
      ],
      [
        "Companionship: the good, God-given longing to share life with another person."
      ],
      [
        "To meet each other's needs and build something together: two lives, and often two callings, becoming one mission."
      ],
      [
        "To enjoy intimacy as God intends it: fully, joyfully and without shame, inside the safety of covenant."
      ]
    ]),
    pullQuote("Marry from fullness, faith and calling, never from fear, pressure or lack."),
    heading(3, "Arit's Prayer"),
    paragraph("Arit tells a story from her secondary-school years that has shaped how we counsel couples ever since. About two years into secondary school she began praying, very specifically, that she would marry a man who loved God more than he loved her."),
    paragraph("People assume that prayer was piety. Arit says it was closer to arithmetic. Girls she had sat beside since primary school were disappearing from her class, pregnant and out of school, while the boys carried on. And when she looked at the married women around her who were suffering, the root seemed to be the same again and again: their husbands did not fear God."),
    paragraph("Her reasoning was simple. A man's love for you can be outbid: by someone younger, by a hard season, by the ordinary tiredness of the years. But a man who fears God keeps his promise not because of what you are, but because of who God is. That does not change with your figure, your mood or your age."),
    pullQuote("Love for you can be outbid. A person's love for God is the one thing in them that does not depend on you."),
    callout("tip", "If you are married: the question for you is not \"why did I marry?\" but \"why do I stay, and what am I staying for?\" Stay for the covenant you made before God, and build toward the marriage you both want. That reason holds even when feelings do not."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Which reason on the first list, if you are honest, has some grip on you?",
      "If you are not yet married: would you still want to marry this person if every reason on the first list were taken away?",
      "If you are married: what is the strongest reason you stay today? Is it one that can carry the next twenty years?"
    ]),
    divider(),
  ],
};

// ─── Become the List You Are Looking For ───
const section2 = {
  section_number: 2,
  title: "Become the List You Are Looking For",
  blocks: [
    heading(2, "Section 2 — Become the List You Are Looking For"),
    paragraph("Most single people carry a list. Sometimes it is only in their head; sometimes it is written down. Tall, kind, funny, successful, good-looking, spiritual. There is nothing wrong with knowing what you hope for. But inside that list is a trap that very few people notice. Let us walk into it on purpose."),
    heading(3, "The Mirror Exercise"),
    table([
      "Step",
      "What to do"
    ], [
      [
        "1",
        "Write eight qualities you want in a husband or wife. Do not edit yourself."
      ],
      [
        "2",
        "Now write eight character qualities your spouse would actually be getting in you."
      ],
      [
        "3",
        "Read Galatians 5:22–23: the fruit of the Spirit."
      ],
      [
        "4",
        "Count how many of those nine qualities appear on your first list, and how many on your second."
      ]
    ]),
    callout("scripture", "\"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.\" — Galatians 5:22–23"),
    paragraph("Here is the trap. Most people fill the first list with words like tall, successful, good-looking and spiritual, and the second with whatever flattering words come to mind. But the qualities that decide whether a marriage thrives (patience, kindness, faithfulness, gentleness, self-control) often appear on neither list."),
    paragraph("We want to receive a patient, gentle, faithful spouse without ever becoming a patient, gentle, faithful person. You cannot ask for qualities you are not willing to grow. Otherwise, who exactly do you expect to suffer for the ones you lack?"),
    pullQuote("Do not spend all your energy searching for the right person. Spend it becoming one."),
    paragraph("That is what marriageability really means. It is not how attractive or impressive you are. It is whether you are becoming the kind of person worth being married to: the kind of character God can build a home on."),
    callout("tip", "Married? Do the exercise anyway, with one change. For step 1, write the eight qualities you wish your spouse had more of. For step 2, write what your spouse is actually living with in you. Then ask God which fruit He wants to grow in you first, before you ask Him to grow anything in them."),
    divider(),
  ],
};

// ─── What You Carry, You Bring ───
const section3 = {
  section_number: 3,
  title: "What You Carry, You Bring",
  blocks: [
    heading(2, "Section 3 — What You Carry, You Bring"),
    paragraph("Here is a hard truth, spoken in love: the wedding day washes nothing. Marriage is not a laundry."),
    paragraph("Many single people quietly believe that marriage itself will fix what is broken: that the loneliness will heal the wound, the ring will end the habit, the new love will silence the old voices. It will not. Whatever is unhealed in you on your wedding day comes with you into the marriage."),
    table([
      "What someone carries",
      "How it shows up in marriage"
    ], [
      [
        "A betrayal that was never healed",
        "Searching a faithful spouse's phone"
      ],
      [
        "A father who crushed with criticism",
        "Hearing his voice in a spouse's innocent suggestion"
      ],
      [
        "A secret debt",
        "A discovery that wounds twice: once for the debt, once for the hiding"
      ],
      [
        "A home where love was withdrawn as punishment",
        "Going silent for days after every disagreement"
      ]
    ]),
    pullQuote("Marriage does not erase what you carry. It hands what you carry to another person."),
    heading(3, "You Are Not Dating Your Ex"),
    paragraph("What you carry does not wait for the wedding. It shows up in courtship first. Here is a pattern I see constantly. A woman's last relationship ended in betrayal. Now a different man, with a different heart, does one small thing that faintly resembles the old one, and every alarm goes off. She searches, accuses, tests. He is bewildered, standing in a battle he never started."),
    paragraph("If you recognise yourself, the road back begins with one honest sentence, said first to yourself and then, if you can, to the person beside you: \"I am sorry that happened to me, but you are not the one who did it.\" If you cannot stop reacting even after naming it, treat that as a warning light. The wound underneath has not yet healed."),
    heading(3, "The Parable of the Tape"),
    image("/images/marriage/module-2/MM2-2.png", "Close-up of two hands holding up a strip of clear adhesive tape, its sticky side carrying lint and threads in several colours from the fabrics behind it. No text appears in the image."),
    paragraph("When I teach young people, I use a simple roll of tape. Press a piece firmly onto someone's sleeve, and it holds fast. Peel it off and press it onto a second person: it still sticks, but less. A third person, and a fourth, and soon it barely holds at all."),
    paragraph("Look closely at that tape and you notice something else. It does not come away clean. It carries fibres from every fabric it has touched, and presses them onto the next one."),
    paragraph("The human heart works in a similar way. God designed us to bond: that is what \"cleave\" in Genesis 2:24 means, to cling and hold fast to one person. But every relationship in which we give ourselves away, heart and especially body, and are then torn off, costs something of that power to cleave. And we carry residue into the next relationship: comparisons, suspicions, habits and memories that the next person never earned."),
    paragraph("Scripture shows us such a heart. The woman Jesus met at the well in Samaria had had five husbands, and the man she was living with was not her husband. Five times pressed, five times torn away."),
    heading(3, "But You Are Not Tape"),
    paragraph("If you were tape, the story would end there. Nothing can restore a used piece of tape. But you are not tape. You are a person made in the image of a God who specialises in restoring what has been spent."),
    paragraph("Jesus knew the Samaritan woman's whole story; He told it to her Himself. Yet He did not recoil. He offered her living water, and she ran back to her town as one of the first people to tell others about Him. Matthew opens his Gospel with the family line of Jesus, and deliberately names Rahab, a woman with a past, among His ancestors. God does not merely tolerate redeemed people. He writes them into His story."),
    callout("scripture", "\"Therefore, if anyone is in Christ, the new creation has come: the old has gone, the new is here!\" — 2 Corinthians 5:17"),
    pullQuote("Your past may explain you. In Christ, it no longer defines you."),
    paragraph("Grace is not a lesser ticket to a second-class marriage. But grace is also not pretending. It does not ask you to act as though nothing happened. It asks you to bring what happened into the light, where it can be healed."),
    heading(3, "Shame or Guilt?"),
    paragraph("The researcher Brené Brown has spent years studying shame, and her second TED talk draws a distinction that helps anyone carrying a past. Guilt says, \"I did something bad.\" Shame says, \"I am bad.\" Guilt can lead to repentance and change. Shame tends to drive people into hiding, which is exactly where wounds stay unhealed."),
    videoEmbed("psN1DORYYV0", "Listening to shame | Brené Brown | TED"),
    callout("tip", "About 20 minutes. Listen for her conclusion that empathy is the antidote to shame. That is why this module keeps pointing you toward a safe person, not only toward private effort: shame loses its grip when it is spoken to someone who responds with compassion. It is also the gospel's pattern: Jesus met the Samaritan woman's story with an offer, not a verdict."),
    divider(),
  ],
};

// ─── The Wound Is the Interpretation ───
const section4 = {
  section_number: 4,
  title: "The Wound Is the Interpretation",
  blocks: [
    heading(2, "Section 4 — The Wound Is the Interpretation"),
    paragraph("Two brothers can live through the same storm. One bends and recovers. The other breaks and carries it for twenty years. We do not all have the same strength of soul at the same moment."),
    pullQuote("A wound is not only what happened to you. It is what your heart decided about it."),
    paragraph("That has two consequences. Stop measuring someone else's pain on your scale. And stop dismissing your own because \"other people had it worse.\" A wound is real to the person carrying it."),
    heading(3, "Naming the Wound"),
    paragraph("You cannot heal a wound you have not named. Here are the most common ones Arit and I meet in counselling, in men and women alike. As you read, notice which ones are yours."),
    table([
      "The wound",
      "What it often looks like",
      "What the heart may have decided"
    ], [
      [
        "The father wound",
        "A father who died, left, was present but absent, never said \"I love you\" or \"I am proud of you\", or rejected you",
        "\"I am not enough.\" Some go looking for a parent in a partner."
      ],
      [
        "The wound of abuse",
        "Something was done to your body or your heart as a child or young person, often by someone trusted, often never spoken of",
        "\"It was my fault.\" \"My body is not mine.\" \"No one can be trusted.\""
      ],
      [
        "The witness wound",
        "Nothing was done to you, but you watched: a father who beat your mother, a marriage at war",
        "\"I will never be like him.\" \"Marriage is a battlefield.\""
      ],
      [
        "The betrayal wound",
        "The partner who cheated, the friend who used you, the engagement that collapsed and left you to face the questions alone",
        "\"Love ends in humiliation.\" \"Keep a door open.\""
      ],
      [
        "The inherited wound",
        "Patterns running down a family line: anger, unfaithfulness, alcohol, unforgiveness",
        "\"This is just how our family is.\""
      ]
    ]),
    callout("tip", "About the witness wound: the vow \"I will never be like him\" does not protect you. Only healing does. Some people become their parents by imitation, and others by unhealed reaction, arriving at the very place they swore they would never go."),
    callout("warning", "If you were abused, hear this clearly: it was not your fault. Healing from abuse usually needs skilled, patient help as well as prayer, and it should begin before covenant, not be left for marriage to fix."),
    heading(3, "What the Research Shows"),
    paragraph("Medicine has arrived at a similar conclusion from a completely different direction. Between 1995 and 1997, the US Centers for Disease Control and Prevention and the health provider Kaiser Permanente surveyed more than 17,000 adults about their childhood experiences and their adult health. It became known as the Adverse Childhood Experiences (ACE) Study."),
    table([
      "Finding",
      "What it means"
    ], [
      [
        "Nearly two-thirds of adults reported at least one adverse childhood experience",
        "Childhood wounds are common, not rare. You are not unusual for carrying one."
      ],
      [
        "More than one in five reported three or more",
        "Many people carry several wounds at once."
      ],
      [
        "The more adverse experiences, the higher the risk of poor health and wellbeing later",
        "What happens in childhood keeps working in adulthood, whether or not we talk about it."
      ]
    ]),
    paragraph("The paediatrician Nadine Burke Harris, who later served as California's Surgeon General, became one of the leading voices explaining what the ACE Study means for children and families. Her talk, first given at TEDMED in 2014, is one of the clearest introductions available."),
    videoEmbed("95ovIJ3dsNk", "How childhood trauma affects health across a lifetime | Nadine Burke Harris | TED"),
    callout("tip", "As you watch, notice two things. First, how ordinary the wounds she describes are. Second, her insistence that this is not destiny: what is named and treated early can change. That is the same hope the gospel offers, from a different angle."),
    paragraph("Burke Harris speaks as a doctor, not a pastor, and her talk is about the body, not marriage. But the lesson carries straight into your home. What you lived through as a child does not stay in childhood. It comes with you into adulthood, and into the way you love, fight and trust. The good news, in medicine and in Scripture, is that it can be named and healed."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Which of the five wounds did you recognise as yours? Write it down in one plain sentence.",
      "What did your heart decide about yourself, about men or women, or about marriage because of it?",
      "Is there anything you have never told anyone? You do not need to tell it here. Simply notice that it is there."
    ]),
    divider(),
  ],
};

// ─── The Faces of an Unhealed Heart ───
const section5 = {
  section_number: 5,
  title: "The Faces of an Unhealed Heart",
  blocks: [
    heading(2, "Section 5 — The Faces of an Unhealed Heart"),
    videoPlaceholder("2-3 min from Denis: how unhealed wounds hide behind behaviour that is often praised, and the story of Reuben, the gifted firstborn who was \"unstable as water\"."),
    paragraph("Unhealed wounds rarely look like sadness. They wear armour, and much of that armour is admired. That is why people can be applauded for the very things that are quietly destroying their homes."),
    table([
      "The face",
      "What it looks like",
      "What it may be protecting"
    ], [
      [
        "The one who never talks",
        "\"I'm fine.\" Feelings are classified information, even to themselves.",
        "Silence learned early, when speaking was unsafe"
      ],
      [
        "The one who explodes",
        "\"I'm not emotional\", until a small offence sets off a large explosion",
        "Years of feelings pressed down and never managed"
      ],
      [
        "The conqueror",
        "Seeks affirmation through romantic or sexual attention",
        "A father wound or rejection, treated with the wrong medicine"
      ],
      [
        "The workaholic",
        "Always busy, always tired, rarely present. The family gets the money and loses the person.",
        "Fear of what the silence would say if they ever stopped"
      ],
      [
        "The one behind the wall",
        "\"No one can hurt me. I depend on myself.\"",
        "A heart that decided closeness is dangerous"
      ],
      [
        "The performer at church",
        "Serves in everything, prays loudly, cannot rest in grace",
        "Working for God's approval instead of from it"
      ]
    ]),
    paragraph("These faces are not only male. Women wear them too, sometimes in different clothes. The question is not which one fits your partner. It is which one, honestly, fits you."),
    heading(3, "The Seed and the Firstborn"),
    paragraph("God built reproduction into creation: plants yielding seed according to their kind. The enemy, who can create nothing, imitates the design. He does not need to plant a whole tree in your life. One violation, one rejection, one lie believed in childhood is enough, because a seed left alone grows and reproduces."),
    callout("scripture", "\"Reuben, you are my firstborn, my might, the first sign of my strength, excelling in honour, excelling in power. Turbulent as the waters, you will no longer excel.\" — Genesis 49:3–4"),
    paragraph("Reuben had everything position and gifting could give: the firstborn's rank, strength, honour and power. One phrase disqualified him. \"Turbulent as the waters\", or as older translations put it, \"unstable as water\". His desires were a river with no banks. When they rose, he could not govern them, and he went as far as sleeping with his father's concubine."),
    paragraph("Reuben is a warning written for gifted people. Talent and position cannot cover an unhealed, ungoverned heart forever. Sooner or later, the heart shows up in the home."),
    divider(),
  ],
};

// ─── The Path of Healing ───
const section6 = {
  section_number: 6,
  title: "The Path of Healing",
  blocks: [
    heading(2, "Section 6 — The Path of Healing"),
    image("/images/marriage/module-2/MM2-3.png", "A man with a backpack, seen from behind, walks a well-trodden path up a green African hillside at sunrise, with light breaking through the clouds ahead. No text appears in the image."),
    paragraph("How does a person actually heal? Not by time: time buries wounds, it does not close them. Not by marriage: marriage presses on wounds. Not by success: a promotion has never yet closed a father wound. Healing is a path, and it has seven steps."),
    table([
      "Step",
      "What it means",
      "A question to ask yourself"
    ], [
      [
        "1. Become aware",
        "Stop running. Turn and face it.",
        "What makes me react this way, and when did the pattern begin?"
      ],
      [
        "2. Accept what you find",
        "\"I'm fine\" is the anthem of people who are not fine.",
        "Can I say: something in me is broken, and I need help?"
      ],
      [
        "3. Bring it to the Healer",
        "Jesus came to heal the broken-hearted (Luke 4:18).",
        "Have I brought this specific wound to God, by name?"
      ],
      [
        "4. Forgive and release",
        "Forgiving does not say it was small. It refuses to carry it into your future.",
        "Whom do I need to release, including myself?"
      ],
      [
        "5. Choose vulnerability again",
        "Walls manage disappointment and starve you of love.",
        "Whom will I trust with this, knowing they could hurt me?"
      ],
      [
        "6. Talk to burden bearers",
        "Part of healing happens in the telling (James 5:16).",
        "Who is safe, wise and able to carry this with me?"
      ],
      [
        "7. Renew your mind",
        "Replace the lies the wound taught you with what God says (Romans 12:2).",
        "What lie have I believed, and what is the truth?"
      ]
    ]),
    callout("scripture", "\"Therefore confess your sins to each other and pray for each other so that you may be healed.\" — James 5:16"),
    heading(3, "Everything Is Not Only Prayer"),
    paragraph("Some wounds need a wise counsellor as well as prayer, and seeking one is not a lack of faith. This is especially true of deep wounds: abuse, trauma, the losses that shaped your childhood. God heals, and very often He heals through trained, patient, godly people He has placed in His church for exactly this purpose."),
    paragraph("And give it time. Do not run from the wreckage of one relationship straight to the altar of the next. A rebound feels like healing but is usually only anaesthetic, and anaesthetic wears off, often after the vows."),
    pullQuote("Healing is not a delay on the road to your covenant. It is the road."),
    paragraph("Bishop T.D. Jakes has preached for decades to people carrying wounds, and in this message he makes the same point this section makes: healing has its own pace, and trying to rush it only drives the wound deeper."),
    videoEmbed("MxPEBPrZq-4", "You Can't Rush the Healing Process | T.D. Jakes"),
    callout("tip", "Listen for what he says about the time healing takes. Then ask yourself honestly: is there a wound I have been trying to hurry past, or cover with a new relationship, instead of letting God heal it?"),
    callout("tip", "Who you marry will give you a good marriage. Who you choose to become will give you a great one. In counselling rooms we meet many couples who know exactly what to do to fix their marriage, and do not do it, because underneath the knowing is a sea of unhealed emotion pulling the strings."),
    divider(),
  ],
};

// ─── Telling the Truth ───
const section7 = {
  section_number: 7,
  title: "Telling the Truth",
  blocks: [
    heading(2, "Section 7 — Telling the Truth"),
    paragraph("Everyone in this module is quietly asking the same question: do I have to tell them? For anything that materially affects the covenant, the answer is yes. Courtship exists to establish truth. A covenant built over a hidden past is built on a fault line. It may stand for years, but the day the ground moves, everything on it cracks at once, and what breaks the marriage is rarely the past itself. It is the hiding."),
    table([
      "What must be told before engagement",
      "How"
    ], [
      [
        "A previous marriage",
        "Plainly, with the circumstances"
      ],
      [
        "Children, wherever they are",
        "Plainly, with your responsibilities to them"
      ],
      [
        "Your sexual past",
        "The fact and the weight of it, in honest outline, not wounding detail"
      ],
      [
        "Significant health matters",
        "Including anything your past makes medically relevant, and your genotype"
      ],
      [
        "Serious debt",
        "The real figure"
      ],
      [
        "Anything legal",
        "Plainly"
      ],
      [
        "Any struggle that is still alive",
        "Honestly, with the help and accountability you have in place"
      ]
    ]),
    paragraph("This does not mean narrating every memory, or telling everything on a first meeting. The truth is owed to serious courtship, not to curiosity. A wise pastor or counsellor can help you judge how much detail serves the truth and how much only causes pain."),
    paragraph("And here is the mercy hidden inside that frightening honesty: their response is information you need. If someone walks away when they meet your repented, healing past, they have answered a question far better answered before the vows than after. The one who hears the true story and stays is not marrying an image that will crack one day. They are marrying you."),
    pullQuote("Anyone who cannot love the true story of you should not be trusted with the rest of it."),
    callout("note", "Married, and carrying a secret your spouse does not know? This needs care, not a sudden confession at midnight. Speak first to a pastor or counsellor you trust, who can help you prepare to tell the truth in a way that heals rather than only wounds, and who can stand with you both afterwards."),
    divider(),
  ],
};

// ─── A Word to Each Carrier ───
const section8 = {
  section_number: 8,
  title: "A Word to Each Carrier",
  blocks: [
    heading(2, "Section 8 — A Word to Each Carrier"),
    table([
      "If you are...",
      "Hear this"
    ], [
      [
        "A single mother or father",
        "Your child is not baggage. Your child is a blessing with a name and a face. Marry only someone who embraces your child, not just you, and watch how they treat your child when there is nothing to gain."
      ],
      [
        "Divorced",
        "Walk closely with pastoral counsel. Before you consider marrying again, understand what happened in the first covenant, including your own part in it, so you carry wisdom forward instead of wounds."
      ],
      [
        "Someone who was abused",
        "It was not your fault, and healing with skilled help must come before covenant. Unhealed wounds tend to choose familiar pain: if someone frightens or controls you, that fear is information, not weakness."
      ],
      [
        "Carrying a secret",
        "The covenant you want cannot live alongside the secret you keep. One of them has to die. Choose the secret, and bring it into the light with wise help."
      ]
    ]),
    callout("warning", "If anyone you are with, or married to, frightens you, controls you, watches you or hurts you, please do not wait. Speak to a trusted pastor or counsellor, and contact local emergency services if you are in danger. Nothing in this track asks you to stay within reach of harm."),
    pullQuote("Come carrying something? Come to Christ first. He does not receive you in spite of what you carry. He receives you in order to take it from you."),
    divider(),
  ],
};

// ─── What Am I Carrying? ───
const section9 = {
  section_number: 9,
  title: "What Am I Carrying?",
  blocks: [
    heading(2, "What Am I Carrying?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. Answer as you are, not as you hope to be."),
    scorecard("What Am I Carrying?", "marriage_module2_carrying", [
      {
        "key": "motives",
        "max": 10,
        "label": "My reasons for marriage (or for staying) come from faith and fullness, not fear or escape",
        "helpText": "Which reason from the first list still has a grip on you?"
      },
      {
        "key": "marriageability",
        "max": 10,
        "label": "I am actively growing the character I hope to find in a spouse",
        "helpText": "Which fruit of the Spirit are you deliberately growing right now?"
      },
      {
        "key": "named",
        "max": 10,
        "label": "I have named my wounds honestly, before God and at least one trusted person",
        "helpText": "Have you said it out loud to anyone?"
      },
      {
        "key": "forgiven",
        "max": 10,
        "label": "I have forgiven those who hurt me, and released myself",
        "helpText": "Is there a name you still cannot say without heat?"
      },
      {
        "key": "projection",
        "max": 10,
        "label": "I do not punish my partner for what someone else did",
        "helpText": "When did you last react to your partner as if they were someone else?"
      },
      {
        "key": "honesty",
        "max": 10,
        "label": "My partner knows everything that materially affects our covenant",
        "helpText": "Is there anything on the \"must be told\" list they do not yet know?"
      },
      {
        "key": "help",
        "max": 10,
        "label": "Where I need help beyond prayer, I am getting it",
        "helpText": "Is there a wound you have been treating with time alone?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is where your healing work begins this week."),
    divider(),
  ],
};

// ─── Module 2 Assignment — Name It, Release It, Tell It ───
const section10 = {
  section_number: 10,
  title: "Module 2 Assignment — Name It, Release It, Tell It",
  blocks: [
    heading(2, "Module 2 Assignment — Name It, Release It, Tell It"),
    assignmentPrompt({
      "title": "Module 2 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. If any prompt takes you somewhere too painful to write about alone, stop, and take it to a trusted pastor or counsellor instead. That counts as completing it.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "Your Honest Reason",
          "guidance": "Engaged or courting: in your own words, why do you want to marry this person? Then name any reason from the first list in Section 1 that is also in the mix. Married: why do you stay, and what are you staying for? Name one reason that will still hold in twenty years."
        },
        {
          "number": 2,
          "heading": "Your Mirror List",
          "guidance": "Complete the mirror exercise from Section 2. Write your two lists of eight, count the fruit of the Spirit on each, and name the one fruit you will deliberately grow over the next month. Describe one situation this week where you will practise it.",
          "example": "Example: \"Patience. When she is late on Saturday, I will not sigh or check my watch. I will greet her first.\""
        },
        {
          "number": 3,
          "heading": "Name the Wound and the Lie",
          "guidance": "Name one wound from Section 4 that you carry, in one plain sentence. Then write the lie it taught you, and the truth from Scripture that answers it. Finish with the name of one person you need to forgive, and one sentence of release."
        },
        {
          "number": 4,
          "heading": "One Truth to Tell",
          "guidance": "Engaged or courting: is there anything on the \"must be told\" list in Section 7 that the person you may marry does not yet know? If so, write when and with whose help you will tell them. Married: is there one truth your spouse needs to hear from you? Write the name of the pastor or counsellor you will speak to first. If there is nothing, write what has made honesty possible between you, and thank God for it."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Know Yourself, Heal Yourself", [
      {
        "id": "q1",
        "prompt": "What do most of the wrong reasons for marriage in Section 1 have in common?",
        "options": [
          {
            "id": "a",
            "text": "They are about money"
          },
          {
            "id": "b",
            "text": "They are fear, pressure or escape dressed up as love"
          },
          {
            "id": "c",
            "text": "They come from parents"
          },
          {
            "id": "d",
            "text": "They are about physical attraction"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Marry from fullness, faith and calling, never from fear, pressure or lack."
      },
      {
        "id": "q2",
        "prompt": "Why did Arit pray for a man who loved God more than he loved her?",
        "options": [
          {
            "id": "a",
            "text": "Because it sounded spiritual"
          },
          {
            "id": "b",
            "text": "Because love for a person can be outbid, but a person's fear of God does not depend on you"
          },
          {
            "id": "c",
            "text": "Because her parents told her to"
          },
          {
            "id": "d",
            "text": "Because she did not want to be loved"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: a man who fears God keeps his promise because of who God is, not because of what you are."
      },
      {
        "id": "q3",
        "prompt": "What is the point of the mirror exercise in Section 2?",
        "options": [
          {
            "id": "a",
            "text": "To find a better spouse"
          },
          {
            "id": "b",
            "text": "To see that we want qualities in a spouse that we are not growing in ourselves"
          },
          {
            "id": "c",
            "text": "To memorise Galatians 5"
          },
          {
            "id": "d",
            "text": "To compare yourself with friends"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Become the list you are looking for."
      },
      {
        "id": "q4",
        "prompt": "What does the parable of the tape illustrate?",
        "options": [
          {
            "id": "a",
            "text": "That past relationships cost something of our ability to bond and leave residue on the next one"
          },
          {
            "id": "b",
            "text": "That people cannot change"
          },
          {
            "id": "c",
            "text": "That marriage is fragile"
          },
          {
            "id": "d",
            "text": "That gifts should be wrapped carefully"
          }
        ],
        "correct_option_id": "a",
        "explanation": "Section 3, followed by the good news: you are not tape, and God restores."
      },
      {
        "id": "q5",
        "prompt": "According to Section 4, what is a wound?",
        "options": [
          {
            "id": "a",
            "text": "Only the event that happened"
          },
          {
            "id": "b",
            "text": "What happened, and what your heart decided about it"
          },
          {
            "id": "c",
            "text": "Something only children experience"
          },
          {
            "id": "d",
            "text": "A sign of weak faith"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Two people can go through the same storm and carry it very differently."
      },
      {
        "id": "q6",
        "prompt": "What did the CDC-Kaiser ACE Study find?",
        "options": [
          {
            "id": "a",
            "text": "Childhood experiences have no effect on adult life"
          },
          {
            "id": "b",
            "text": "Adverse childhood experiences are common, and more of them is linked to higher risk to health and wellbeing later"
          },
          {
            "id": "c",
            "text": "Only rich children are affected"
          },
          {
            "id": "d",
            "text": "Trauma always heals with time"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Nearly two-thirds of over 17,000 adults reported at least one, and risk rose with each additional experience."
      },
      {
        "id": "q7",
        "prompt": "Why should you tell the person you may marry about things that materially affect the covenant?",
        "options": [
          {
            "id": "a",
            "text": "Because the law requires it"
          },
          {
            "id": "b",
            "text": "Because what breaks a marriage is usually the hiding, and their response is information you need before the vows"
          },
          {
            "id": "c",
            "text": "To make them feel sorry for you"
          },
          {
            "id": "d",
            "text": "You should not tell them"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 7: anyone who cannot love the true story of you should not be trusted with the rest of it."
      }
    ]),
    divider(),
  ],
};

// ─── Module 2 Complete ───
const section11 = {
  section_number: 11,
  title: "Module 2 Complete",
  blocks: [
    heading(2, "Module 2 Complete"),
    image("/images/marriage/module-2/MM2-4.png", "A cracked clay pot mended with seams of gold sits on a wooden windowsill in the light of the rising sun, a small green plant in a basket beside it. No text appears in the image."),
    videoPlaceholder("2-3 min closing from Denis (and Arit, if possible): a prayer of healing over those carrying something, and an invitation to take the first step this week."),
    paragraph("You have looked honestly at why you want marriage, who you are becoming, and what you carry. That is the hardest work in this whole track, and you did not skip it."),
    paragraph("Module 3 turns from you to the choice itself: how to choose wisely, how to see the person in front of you clearly, and how to tell the difference between chemistry and character."),
    callout("info", "Next: Module 3 — Choosing Well. Before you begin, finish your assignment. If you named a wound that needs more than this module can give, make the appointment with a pastor or counsellor this week."),
  ],
};

// ─── Assemble ───

const module2 = {
  module_number: 2,
  slug: "know-yourself-heal-yourself",
  title: "Know Yourself, Heal Yourself",
  subtitle: "Motives, Marriageability, and the Path of Healing",
  track_slug: "marriage",
  pillar: "personal-foundation",
  pillar_id: "00000000-0000-0000-0002-000000000011",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 110,
  sort_order: 2,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11],
};

const total = module2.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 2 — "${module2.title}"`);
module2.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module2_marriage.json", JSON.stringify(module2, null, 2));
console.log("\nWritten to module2_marriage.json");
