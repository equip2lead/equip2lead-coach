// Marriage Module 9 — "Sex & Body"
// Ported on 2026-11-04 from build_module9_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module9.js
//
// Writes module9_marriage.json to the current directory.
//
// No edits from the authored source. Its privacy wording already says the partner cannot
// see the reflections, ratings and assignment. oEmbed check on 2026-11-05: the Juli Slattery
// video is on Focus on the Family's channel, 27:47 long.

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
// public/images/marriage/module-9/MM9-1..4.png.
const imagePlaceholder = (ref, brief) => callout("note", `[IMAGE PLACEHOLDER — ${ref}] ${brief}`);
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Sex & Body"),
    paragraph("Module 9 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis and Arit: why the church has been silent about sex for too long, why that silence handed the subject to the world, and why God's design is better news than anything the world is selling."),
    callout("info", "Who this is for: Everyone on this track. Single and courting readers will find what they are waiting for, and how to guard it. Engaged couples will find the conversation they must have before the wedding night. Married couples will find honest teaching on a part of marriage many have never heard preached. This module speaks plainly but not graphically."),
    callout("info", "Core promise: By the end of this module you will understand why sex is God's idea and what it is for, why it can never be casual, how to draw and keep boundaries before the wedding, what to talk about before the wedding night, what a healthy marriage bed looks like for both husband and wife, how to fight the secret battles, and how restoration works for anyone carrying a past."),
    callout("info", "Time commitment: About 85 minutes of reading and reflection, plus 30 minutes for the assignment. Some sections may stir old memories or present struggles. Go at your own pace."),
    callout("warning", "A word of care. If anything in your sexual history involved force, abuse or a child, it was not your fault, and this module is not asking you to examine it alone. If sex in your relationship involves pressure, threats or force now, read Section 7 first, and speak to a trusted pastor or counsellor on your own."),
    divider(),
  ],
};

// ─── Sex Is God's Idea ───
const section1 = {
  section_number: 1,
  title: "Sex Is God's Idea",
  blocks: [
    heading(2, "Section 1 — Sex Is God's Idea"),
    imagePlaceholder("MM9-1", "Content: A young African husband and wife walking hand in hand along a quiet beach at sunset, barefoot at the water's edge, her head resting against his shoulder, seen from behind at a respectful distance. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Before we can talk about what sex must not be, we have to answer a question almost nobody asks: where did sex come from? It did not come from Hollywood, or from the advertisers who use it to sell perfume and cars. It did not crawl out of the Fall as a regrettable side effect God has been managing ever since. Open the first pages of Scripture and you find something that has embarrassed a silent church for generations: sex is God's idea. He designed it, blessed it, and called it very good."),
    callout("scripture", "\"Adam and his wife were both naked, and they felt no shame.\" — Genesis 2:25"),
    paragraph("Notice the order. Sex appears in Genesis 1 and 2. Sin does not appear until Genesis 3. Sexuality is not a product of the Fall; it is a casualty of it. And the very first words God spoke to human beings, \"Be fruitful and increase in number\" (Genesis 1:28), were a blessing that could not be obeyed without the marriage bed. God is not squeamish about His own creation."),
    pullQuote("Sex is older than sin. The design is older than the distortion."),
    table([
      "Who defines it",
      "How sex is defined",
      "What is missing"
    ], [
      [
        "Biology",
        "The reproductive act",
        "The person"
      ],
      [
        "The modern world",
        "Something two consenting adults do for pleasure",
        "Love, covenant, marriage and God"
      ],
      [
        "God",
        "The sign and seal of a covenant: \"the two become one flesh\" (Genesis 2:24)",
        "Nothing"
      ]
    ]),
    paragraph("The world defines sex by the act. God defines sex by the covenant. Sex in God's design is not merely something a couple does. It is something a couple becomes."),
    heading(3, "Why the Fence Exists"),
    paragraph("On our ministry building site in Cameroon, thick electrical cable runs through the whole property, enough to power an operating theatre, and every metre of it runs inside a protective channel. Nobody looks at the channel and says we must be ashamed of electricity. Everybody understands that the same current that powers the hospital, set loose outside its channel, burns the building down."),
    pullQuote("Sex is not guarded because it is dirty. It is guarded because it is powerful."),
    paragraph("That is what God's boundaries around sex are. The fence is not an insult to the treasure; it is evidence of the treasure. Nobody builds a wall around an empty field."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Where did I first learn what sex was: from the Designer, or from the distortion?",
      "Do I think of sex as something shameful that God tolerates, or as something good that God designed?",
      "What would change if I really believed the fence exists because the treasure is precious?"
    ]),
    divider(),
  ],
};

// ─── What the Gift Is For ───
const section2 = {
  section_number: 2,
  title: "What the Gift Is For",
  blocks: [
    heading(2, "Section 2 — What the Gift Is For"),
    paragraph("If sex is God's idea, only God can tell us what it is for. Scripture gives at least six purposes, and nearly every distortion is simply one of these purposes torn away from the others and worshipped alone."),
    table([
      "Purpose",
      "Scripture",
      "What it means"
    ], [
      [
        "Union",
        "Genesis 2:24",
        "Sex is the covenant sign: two people declaring with their whole bodies, \"I am entirely yours, and you are entirely mine.\""
      ],
      [
        "Knowing",
        "Genesis 4:1",
        "The Hebrew word for Adam's union with Eve is \"knew\". Sex is not the exploration of a body but the unveiling of a person, which is why it needs the safety of covenant."
      ],
      [
        "Pleasure",
        "Proverbs 5:18–19; Song of Songs",
        "God commands a husband toward delight, and devoted a whole book of Scripture to married desire. The pleasure is not an accident the Designer tolerates. It is a gift He intended."
      ],
      [
        "Procreation",
        "Genesis 1:28; Psalm 127:3",
        "Through this gift God shares with human beings a part in the creation of eternal souls. An act that can produce an eternal person is never a small act."
      ],
      [
        "Protection",
        "1 Corinthians 7:2–5",
        "Ongoing intimacy is a God-given guard for both husband and wife in a world full of temptation, and Paul makes the duty mutual."
      ],
      [
        "Proclamation",
        "Ephesians 5:31–32",
        "The one-flesh union pictures Christ joined forever to His people. Every covenant-kept marriage bed preaches that God binds Himself to His people and never leaves."
      ]
    ]),
    pullQuote("Sex preaches. The only question is whether it tells the truth."),
    paragraph("Dr. Juli Slattery, a Christian psychologist and the co-founder of Authentic Intimacy, talks with Focus on the Family about why so many Christian couples have a weak foundation for intimacy: some learned only rules, duty and shame; others absorbed the culture's idea that sex is about personal fulfilment. She calls couples back to covenant love."),
    videoEmbed("5_TynBlqaIk", "Rethinking Godly Sexuality in Your Marriage | Dr. Juli Slattery | Focus on the Family"),
    callout("tip", "As you listen, notice which of the two distorted views she describes is closer to what you were taught. Then write one sentence about what God's design says instead."),
    divider(),
  ],
};

// ─── Why It Is Never Casual ───
const section3 = {
  section_number: 3,
  title: "Why It Is Never Casual",
  blocks: [
    heading(2, "Section 3 — Why It Is Never Casual"),
    paragraph("A pastor once asked a room of young people a simple question: \"When someone pats you on the back, what does it mean?\" Encouragement. \"And a kiss?\" Love. \"And a slap?\" Anger. Then the room went quiet, because the question answered itself. Touch is a language. If the smallest gestures of the body speak, the greatest act of the body does not whisper. It makes vows."),
    pullQuote("There is no such thing as casual sex. There is only covenant sex and counterfeit sex."),
    table([
      "The bond",
      "What happens"
    ], [
      [
        "Physical",
        "Two bodies join. \"One flesh\" is anatomy before it is poetry."
      ],
      [
        "Biochemical",
        "During intimacy the brain releases powerful bonding chemicals that attach you to the person in your arms. That is why a former partner can be so hard to forget. It is glue, doing what glue was designed to do, in a place it was never meant to be applied."
      ],
      [
        "Emotional",
        "To be fully unclothed before another person is to hand them a knowledge of you that cannot be taken back. Within covenant, that builds safety. Outside it, it manufactures counterfeit closeness and then tears it."
      ],
      [
        "Spiritual",
        "Paul says that even a man who unites with a prostitute becomes one body with her (1 Corinthians 6:16). There is no setting on the human soul marked \"casual\"."
      ]
    ]),
    paragraph("You can remove the covenant from sex. You cannot remove the bonding from sex. That is why the boundaries before marriage matter so much, and why the next section is so practical."),
    divider(),
  ],
};

// ─── Drawing the Line Before the Wedding ───
const section4 = {
  section_number: 4,
  title: "Drawing the Line Before the Wedding",
  blocks: [
    heading(2, "Section 4 — Drawing the Line Before the Wedding"),
    callout("scripture", "\"Daughters of Jerusalem, I charge you: Do not arouse or awaken love until it so desires.\" — Song of Songs 8:4"),
    paragraph("Nobody pities a great river for having banks. The banks are the reason it is a river: the reason it flows somewhere, waters fields and carries ships. Take the banks away and you have not freed the water; you have turned a blessing into a flood. Desire is that river. Boundaries are its banks."),
    pullQuote("Purity is not the absence of desire. It is the government of it."),
    paragraph("Where exactly does a courting or engaged couple draw the line? The Christian counsellor H. Norman Wright gave a principle that has served couples for decades: everything that has its natural end in sexual intercourse should be kept for the wedding night. Not only intercourse itself, but everything whose momentum leads there."),
    table([
      "Four rules for the road",
      "Why"
    ], [
      [
        "Decide your boundaries together, in writing, on a clear-headed afternoon",
        "Decisions made during temptation lose. Covenants made before temptation stand."
      ],
      [
        "Govern the places, not only the acts",
        "No midnight visits, no closed doors, no overnight stays, no secret meeting places. The wise do not pray for strength inside the wrong room; they refuse the room."
      ],
      [
        "Involve witnesses",
        "Give your written boundaries to a mentor or married couple you trust, and ask them to check on you regularly. A secret relationship has no banks."
      ],
      [
        "Set the pace, not only the line",
        "Physical affection moves forward easily and almost never moves back. Start far behind your line, and let touch grow with commitment, not with time or opportunity."
      ]
    ]),
    callout("warning", "Digital boundaries are boundaries too. Sexual messages, photos, video calls that undress: \"we have never even touched\" is not a defence, because Jesus located sexual sin in the heart, not the skin (Matthew 5:28). And every image sent can become a permanent record held by someone else."),
    heading(3, "Purity Has No Gender"),
    paragraph("In many of our cultures, and shamefully in many of our churches, purity has been preached as a women's subject. The daughter is guarded and lectured; the son is winked at. Then the same man who spent years taking from other men's future wives goes looking for a virgin to marry. Scripture knows nothing of this double standard: \"each of you should learn to control your own body in a way that is holy and honourable\" (1 Thessalonians 4:4). The Bible's most famous flight from sexual temptation was run by a man: Joseph left his cloak in her hand and his purity intact (Genesis 39:12)."),
    pullQuote("Purity is not a women's subject. It is holy, and holiness has no gender."),
    paragraph("And there is a reason to wait that almost nobody preaches. What you keep before marriage becomes the foundation of trust inside it. If someone could not wait with you, what evidence do you have that they will be faithful to you on every business trip, through every pregnancy and every season of illness? The couple who waited carries a certificate into marriage: each has watched the other master desire for the sake of covenant."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Have we drawn our line in writing, with witnesses, or is our purity being decided by moods, moments and places?",
      "Which place or time in my week is where I am most likely to fall?",
      "Have I believed, even quietly, that purity matters more for women than for men?"
    ]),
    divider(),
  ],
};

// ─── Talk Before the Night ───
const section5 = {
  section_number: 5,
  title: "Talk Before the Night",
  blocks: [
    heading(2, "Section 5 — Talk Before the Night"),
    imagePlaceholder("MM9-2", "Content: An engaged African couple sitting in conversation with an older married couple in a bright, comfortable living room, notebooks and cups of tea on the table, all four leaning in with warm, serious expressions. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Many godly couples arrive at their wedding never having spoken one honest sentence about sex: too holy to discuss it, too human not to expect it. Then they wonder why the first year is hard. Do not attempt that education on the wedding night. Talk now, awkwardly, with the lights on and your clothes on, months before the day, and with a pastor or mature married couple to guide you."),
    table([
      "Talk about",
      "Why it matters"
    ], [
      [
        "What each of you expects",
        "Expectations nobody spoke become disappointments nobody understands"
      ],
      [
        "What each of you fears or does not know",
        "Fear spoken can be met with patience; fear hidden becomes distance"
      ],
      [
        "Your history, in honest outline",
        "The fact and the weight of your past, without wounding detail, so nothing is discovered later"
      ],
      [
        "Your sexual health",
        "Any condition, any past exposure, and testing where your past calls for it. A covenant deserves medical honesty"
      ],
      [
        "How you will keep talking",
        "Agree now that this conversation stays open for life. Intimacy thrives on honesty and starves on guesswork"
      ]
    ]),
    heading(3, "The Wedding-Night \"Proof\""),
    paragraph("Here is a word that may protect a bride from an accusation she cannot answer. In many of our communities a woman's virginity is judged by whether she bleeds on the wedding night, and women have been shamed, accused and even sent back to their families when they did not. Not every woman bleeds the first time, and the absence of blood proves nothing. Bodies differ. In 2018 the UN Human Rights Office, UN Women and the World Health Organization stated together that so-called virginity testing has no scientific or clinical basis, and that no examination can prove whether a woman has had sex."),
    pullQuote("Purity is kept in the heart before God. It is not proven on a sheet."),
    callout("warning", "Let no husband, no mother-in-law and no family ever inspect a sheet and pass a verdict on a woman's honour. Her word is to be believed."),
    divider(),
  ],
};

// ─── Inside the Marriage ───
const section6 = {
  section_number: 6,
  title: "Inside the Marriage",
  blocks: [
    heading(2, "Section 6 — Inside the Marriage"),
    paragraph("If you are single, read this section anyway: it tells you what you are waiting for, and what kind of husband or wife you must become. If you are married, read it slowly, because the church has been silent here too, and many marriage beds are paying for that silence."),
    paragraph("Here is what is rarely said from a pulpit: in many Christian marriages, the wife is not being satisfied. She is present, faithful and willing, and she is lonely in her own bed. Some women carry this for twenty years and tell no one, because they were taught that this part of marriage was for him. That teaching did not come from the Bible."),
    table([
      "What Scripture shows",
      "What it means at home"
    ], [
      [
        "Her desire is spoken as freely as his (Song of Songs 4:16; 7:10)",
        "Her pleasure is part of the design. A theology of sex in which only the husband enjoys it is cultural, not biblical."
      ],
      [
        "\"The husband should fulfil his marital duty to his wife, and likewise the wife to her husband\" (1 Corinthians 7:3–4)",
        "The duty runs both ways. Her claim on him is equal to his claim on her."
      ],
      [
        "\"Be considerate as you live with your wives\" (1 Peter 3:7)",
        "Tenderness in the bedroom begins long before the bedroom: in how he spoke to her that morning and whether he helped carry the load of the home."
      ],
      [
        "The lovers in the Song of Songs spend whole chapters on words before union",
        "Romance is not a technique. It is a way of treating each other, all day."
      ]
    ]),
    paragraph("And a word to the men, plainly, because nobody said it to me and I have had to say it to many men since. A husband can be faithful, hardworking and praying, and still be failing his wife in the bedroom without knowing it. Her satisfaction is not her private business, and it is not a bonus. It is part of your covenant, and it is learned with her: slowly, by asking, by listening, over years. The one man guaranteed never to learn it is the man who assumes he already has."),
    pullQuote("The one technique this module will teach you is this: ask, and listen to the answer."),
    paragraph("Husbands and wives are also often made at different paces. Many men's desire rises quickly and directly; many women's rises more gradually, through safety, tenderness and time. Neither is a defect. In some marriages it is the other way round, and nothing is wrong with that couple either. The point is not a rule about men and women. The point is that you must learn the person you married."),
    callout("tip", "Pain and persistent problems are medical, not spiritual. If intimacy is painful for her again and again, that is not a sign she is unwilling or unspiritual; it is a condition with a name, and it is often treatable. The same is true of common difficulties for men. Pray, and see a doctor. Do not suffer in silence for ten years because nobody told you help exists."),
    divider(),
  ],
};

// ─── "Do Not Deprive" Is Not Permission to Force ───
const section7 = {
  section_number: 7,
  title: "\"Do Not Deprive\" Is Not Permission to Force",
  blocks: [
    heading(2, "Section 7 — \"Do Not Deprive\" Is Not Permission to Force"),
    callout("scripture", "\"Do not deprive each other except perhaps by mutual consent and for a time, so that you may devote yourselves to prayer.\" — 1 Corinthians 7:5"),
    paragraph("Paul's counsel is real: a married couple should not withhold themselves from each other as a weapon or a punishment, and long seasons of absence need to be agreed together. But that same verse has been used as a whip, and it must be said clearly."),
    callout("warning", "\"Do not deprive each other\" is not permission to demand, pressure or force. Love \"does not dishonour others, it is not self-seeking\" (1 Corinthians 13:5). A spouse who takes what has not been given has not exercised a right. They have broken the covenant they claim to be enforcing. If this is happening in your home, it is not a private matter between you and God. Speak to a trusted pastor or counsellor this week, on your own, and contact local emergency services if you are in danger."),
    table([
      "Seasons when desire changes",
      "How love responds"
    ], [
      [
        "Illness, exhaustion, grief",
        "With patience and care, and with the other kinds of closeness that do not ask anything of a tired body"
      ],
      [
        "Pregnancy and the months after a birth",
        "With gentleness, medical advice, and a husband who carries more of the home"
      ],
      [
        "Travel and long distance",
        "With agreed boundaries, honest communication and faithfulness that does not need supervision"
      ],
      [
        "A season when one of you keeps saying no",
        "With a calm conversation about why, and, if it persists, with help from a counsellor or doctor rather than accusation"
      ]
    ]),
    divider(),
  ],
};

// ─── The Secret Battles ───
const section8 = {
  section_number: 8,
  title: "The Secret Battles",
  blocks: [
    heading(2, "Section 8 — The Secret Battles"),
    callout("scripture", "\"But I tell you that anyone who looks at a woman lustfully has already committed adultery with her in his heart.\" — Matthew 5:28"),
    paragraph("Every section so far could be discussed in a Bible study. This one is usually fought alone, at midnight, on a glowing screen, in the one war where the soldier is ashamed to admit there is a war. That is exactly why the enemy wins it so often. Hear the truth first: you are not the only one, and this is not only a men's battle."),
    paragraph("Noticing beauty is not sin; God made beauty, and eyes work. An old saying draws the line well: you cannot stop birds flying over your head, but you can stop them building a nest in your hair. The first glance flies over. The second look builds the nest."),
    pullQuote("The first look is human. The second look is a decision."),
    paragraph("Pornography is the second look industrialised, delivered to the pocket of every adult and child with a phone. It is not harmless entertainment. It trains the reward system God wired for covenant bonding on images, and it teaches lies about sex: performance instead of covenant, bodies without souls. And it is in the pews. In 2024 the Barna Group's study with Pure Desire Ministries found that 61 per cent of American adults view pornography, and among practising Christians 54 per cent do at least occasionally, with more than one in five viewing weekly or daily. Only one in ten said their church offered any help."),
    table([
      "Weapons for the battle",
      "How to use them"
    ], [
      [
        "A covenant with your eyes (Job 31:1)",
        "Make the decision in advance, in writing, before temptation comes"
      ],
      [
        "Radical removal (Matthew 5:29–30)",
        "Delete the apps, unfollow the accounts, install accountability software, and keep the phone out of the bedroom at night"
      ],
      [
        "Accountability (James 5:16)",
        "One trusted believer of your own sex who asks you the hard question every week"
      ],
      [
        "Feed the spirit (Galatians 5:16)",
        "The battle is not won by emptying the mind but by filling it: prayer, the Word, worship, service, a tired body"
      ]
    ]),
    callout("note", "If you are married and discover that your spouse is caught in pornography, it is a real betrayal and your hurt is legitimate. Do not carry it alone, and do not try to become their police. Seek help together from a pastor or Christian counsellor, and help for yourself as well."),
    pullQuote("You are not your sin. You are a child of God at war, and soldiers with wounds are still soldiers."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Where have I welcomed the second look, and what covenant with my eyes will I write this week?",
      "Which lie from pornography have I absorbed about sex, my body, or my future or present spouse?",
      "Who is the one person I will tell, so that this battle is no longer fought in secret?"
    ]),
    divider(),
  ],
};

// ─── Washed, Made New ───
const section9 = {
  section_number: 9,
  title: "Washed, Made New",
  blocks: [
    heading(2, "Section 9 — Washed, Made New"),
    imagePlaceholder("MM9-3", "Content: A young African woman standing at an open window at dawn, eyes closed and face lifted toward the morning light, a Bible held against her chest, with a peaceful expression. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    callout("scripture", "\"'Come now, let us settle the matter,' says the Lord. 'Though your sins are like scarlet, they shall be as white as snow.'\" — Isaiah 1:18"),
    paragraph("Some readers have reached this module carrying a past: a line crossed once, or crossed for years. A young woman once wrote her story for us. She lost her virginity at university, wanting to be like everyone else. Afterwards something in her settled a terrible conclusion: \"I had gone too far. There was no way back now. So what did it matter anymore?\" From there she fell again and again, year after year, until at her lowest she found the courage to ask a leader she trusted for help. Today, she writes, her holiness is her greatest treasure."),
    paragraph("Look at what held her all those years. It was not mainly the strength of her desire. It was the verdict she passed on herself after the first fall: I have gone too far. That lie, not the sin, was the engine of every fall that followed."),
    pullQuote("The enemy's greatest weapon is not the temptation that made you fall. It is the lie that says you cannot rise."),
    table([
      "Five steps of restoration",
      "What it means"
    ], [
      [
        "1. Confess",
        "To God first, completely (1 John 1:9), and then to one trusted, mature believer (James 5:16)"
      ],
      [
        "2. Cut",
        "End what must end: the relationship, the access, the app, the standing appointment with temptation"
      ],
      [
        "3. Be accountable",
        "Give someone godly the right to ask you hard questions, and build that support before the hard evening comes"
      ],
      [
        "4. Make it right",
        "Where your sin wounded others, take responsibility as far as wisdom allows, with counsel"
      ],
      [
        "5. Rebuild",
        "Fill the old empty hours with new things: the Word, worship, friendship, service"
      ]
    ]),
    callout("scripture", "\"And that is what some of you were. But you were washed, you were sanctified, you were justified in the name of the Lord Jesus Christ and by the Spirit of our God.\" — 1 Corinthians 6:11"),
    callout("tip", "If you are courting or engaged and have already crossed the line together, a crossed line is not a burned bridge. Confess it to God together, tighten your boundaries, change your environments, tell your witness, and begin again today."),
    divider(),
  ],
};

// ─── Where Am I With This Gift? ───
const section10 = {
  section_number: 10,
  title: "Where Am I With This Gift?",
  blocks: [
    heading(2, "Where Am I With This Gift?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate yourself as you are now."),
    scorecard("Where Am I With This Gift?", "marriage_module9_intimacy", [
      {
        "key": "design",
        "max": 10,
        "label": "I see sex as God's good design, not something shameful or merely physical",
        "helpText": "Where did I learn what I believe?"
      },
      {
        "key": "boundaries",
        "max": 10,
        "label": "My boundaries are clear, written down, and known to someone who holds me accountable",
        "helpText": "Single, courting or engaged: is the line written?"
      },
      {
        "key": "talk",
        "max": 10,
        "label": "I can talk honestly about sex with my partner, or will be able to before the wedding",
        "helpText": "What have we never said out loud?"
      },
      {
        "key": "mutual",
        "max": 10,
        "label": "I see intimacy in marriage as mutual: both partners' delight, both partners' consent",
        "helpText": "Is this something I give, or only something I receive?"
      },
      {
        "key": "eyes",
        "max": 10,
        "label": "I guard my eyes and my screen, and I am winning the secret battles",
        "helpText": "When did I last welcome the second look?"
      },
      {
        "key": "light",
        "max": 10,
        "label": "I have no secret struggle that someone I trust does not know about",
        "helpText": "Is there one person who knows?"
      },
      {
        "key": "grace",
        "max": 10,
        "label": "I have received God's restoration for my past and no longer believe I have gone too far",
        "helpText": "What verdict have I passed on myself?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the step to take first, this week. If it involves a secret, the first step is telling one trusted person."),
    divider(),
  ],
};

// ─── Module 9 Assignment — The Conversation You Have Not Had ───
const section11 = {
  section_number: 11,
  title: "Module 9 Assignment — The Conversation You Have Not Had",
  blocks: [
    heading(2, "Module 9 Assignment — The Conversation You Have Not Had"),
    assignmentPrompt({
      "title": "Module 9 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly; you do not need to write details you would not want to put on paper. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If any prompt touches abuse or force in your past or present, skip it and speak to a trusted pastor or counsellor instead. That counts as completing it.",
      "word_min": 200,
      "word_max": 800,
      "prompts": [
        {
          "number": 1,
          "heading": "What I Was Taught",
          "guidance": "Describe what you learned about sex growing up, from home, church, friends and screens. Name one lie you absorbed and the truth from this module that replaces it."
        },
        {
          "number": 2,
          "heading": "Our Line",
          "guidance": "Courting or engaged: write the boundaries you will keep until the wedding, the places and times you will avoid, and the name of the witness you will give them to. Single: write the boundaries you will set before your next relationship begins. Married: write one way you will protect your marriage bed from outside threats, including screens.",
          "example": "Example: \"No visits after 9pm, no closed doors, phones charged outside the bedroom, and we will give this page to Pastor and his wife on Sunday.\""
        },
        {
          "number": 3,
          "heading": "The Conversation",
          "guidance": "Engaged: list the topics from Section 5 you have not yet discussed, and when and with whose help you will discuss them. Married: write one thing you have never said to your spouse about your intimate life, and how you will begin that conversation with kindness. Single: write what you want to be able to say honestly to a future spouse."
        },
        {
          "number": 4,
          "heading": "The Secret and the Light",
          "guidance": "If there is a struggle or a past you have never brought into the light, write the first step of restoration you will take, and the name of the one trusted person you will tell. If there is nothing, write what has helped you stay free, and thank God for it."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Sex & Body", [
      {
        "id": "q1",
        "prompt": "According to Section 1, where did sex come from?",
        "options": [
          {
            "id": "a",
            "text": "It is a side effect of the Fall"
          },
          {
            "id": "b",
            "text": "It is God's idea, designed and blessed before sin entered the world"
          },
          {
            "id": "c",
            "text": "It is a human invention"
          },
          {
            "id": "d",
            "text": "It is only for having children"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Sex is older than sin. The design is older than the distortion."
      },
      {
        "id": "q2",
        "prompt": "How does God define sex, compared with the modern world?",
        "options": [
          {
            "id": "a",
            "text": "By the act alone"
          },
          {
            "id": "b",
            "text": "By the covenant: the two become one flesh"
          },
          {
            "id": "c",
            "text": "By whether both people agree"
          },
          {
            "id": "d",
            "text": "By the pleasure involved"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: the world defines sex by the act; God defines it by the covenant."
      },
      {
        "id": "q3",
        "prompt": "Why can sex never be truly casual?",
        "options": [
          {
            "id": "a",
            "text": "Because the church forbids it"
          },
          {
            "id": "b",
            "text": "Because it forms a bond on several levels at once, whether or not people intend it"
          },
          {
            "id": "c",
            "text": "Because it is always shameful"
          },
          {
            "id": "d",
            "text": "It can be casual"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: you can remove the covenant from sex, but not the bonding."
      },
      {
        "id": "q4",
        "prompt": "What is H. Norman Wright's principle for courting and engaged couples?",
        "options": [
          {
            "id": "a",
            "text": "Anything except intercourse is fine"
          },
          {
            "id": "b",
            "text": "Everything that has its natural end in intercourse should be kept for the wedding night"
          },
          {
            "id": "c",
            "text": "Decide in the moment"
          },
          {
            "id": "d",
            "text": "Boundaries are only for women"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: not only the act, but everything whose momentum leads there."
      },
      {
        "id": "q5",
        "prompt": "Does the absence of bleeding on the wedding night prove anything?",
        "options": [
          {
            "id": "a",
            "text": "Yes, it proves she was not a virgin"
          },
          {
            "id": "b",
            "text": "No. Bodies differ, and no examination can prove whether a woman has had sex"
          },
          {
            "id": "c",
            "text": "Only if the family says so"
          },
          {
            "id": "d",
            "text": "Only in some cultures"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: the UN and WHO stated in 2018 that so-called virginity testing has no scientific basis."
      },
      {
        "id": "q6",
        "prompt": "What does 1 Corinthians 7:3–4 teach about the marriage bed?",
        "options": [
          {
            "id": "a",
            "text": "Only the wife has a duty"
          },
          {
            "id": "b",
            "text": "Only the husband's needs matter"
          },
          {
            "id": "c",
            "text": "The duty runs both ways, and each spouse's claim is equal"
          },
          {
            "id": "d",
            "text": "It is not about marriage"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 6: her pleasure is part of the design, and her claim on him equals his on her."
      },
      {
        "id": "q7",
        "prompt": "Does \"do not deprive each other\" give a spouse permission to pressure or force?",
        "options": [
          {
            "id": "a",
            "text": "Yes, within marriage"
          },
          {
            "id": "b",
            "text": "Only the husband"
          },
          {
            "id": "c",
            "text": "Only after a long absence"
          },
          {
            "id": "d",
            "text": "No, never. Taking what has not been given breaks the covenant"
          }
        ],
        "correct_option_id": "d",
        "explanation": "Section 7: love does not dishonour others and is not self-seeking."
      },
      {
        "id": "q8",
        "prompt": "According to Section 9, what kept the young woman falling for years?",
        "options": [
          {
            "id": "a",
            "text": "The strength of her desire"
          },
          {
            "id": "b",
            "text": "The lie that she had gone too far and there was no way back"
          },
          {
            "id": "c",
            "text": "Her friends"
          },
          {
            "id": "d",
            "text": "Her church"
          }
        ],
        "correct_option_id": "b",
        "explanation": "The enemy's greatest weapon is the lie that says you cannot rise."
      }
    ]),
    divider(),
  ],
};

// ─── Module 9 Complete ───
const section12 = {
  section_number: 12,
  title: "Module 9 Complete",
  blocks: [
    heading(2, "Module 9 Complete"),
    imagePlaceholder("MM9-4", "Content: An older African couple sitting close together on a garden bench in the evening, his arm around her shoulders and her hand in his, both smiling softly, a lamp glowing in the window of their home behind them. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1600×900."),
    videoPlaceholder("2-3 min closing from Denis and Arit: why they believe God's design for intimacy is good news, the conversation they wish every couple would have before the wedding, and a prayer of restoration for anyone carrying a past."),
    paragraph("You have seen that sex is God's idea and what it is for, why it is never casual, how to draw and keep boundaries before the wedding, what to talk about before the wedding night, what a healthy marriage bed looks like for both husband and wife, why \"do not deprive\" is never permission to force, how to fight the secret battles, and how restoration works. That is not the end of the subject. It is the beginning of an honest conversation that should last your whole marriage."),
    paragraph("Module 10 turns to what this gift can bring into the world: children, fertility and family planning, and what to do when children do not come."),
    callout("info", "Next: Module 10 — Children & Fertility. Before you begin, finish your assignment, and if you are courting or engaged, give your written boundaries to your witness this week."),
  ],
};

// ─── Assemble ───

const module9 = {
  module_number: 9,
  slug: "sex-and-body",
  title: "Sex & Body",
  subtitle: "God's Design, Boundaries Before the Wedding, Intimacy Inside It, the Secret Battles, and Restoration",
  track_slug: "marriage",
  pillar: "intimacy-sexuality",
  pillar_id: "00000000-0000-0000-0002-000000000014",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 115,
  sort_order: 9,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12],
};

const total = module9.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 9 — "${module9.title}"`);
module9.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module9_marriage.json", JSON.stringify(module9, null, 2));
console.log("\nWritten to module9_marriage.json");
