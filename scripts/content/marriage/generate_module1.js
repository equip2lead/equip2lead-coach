// Marriage Module 1 — "Marriage Was God's Idea"
// Ported on 2026-11-03 from build_module1_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module1.js
//
// Writes module1_marriage.json to the current directory.
//
// Edits from the authored source, all approved by Denis:
//
// - The module title is a level 2 heading, not level 1. ingest-module.mjs rejects
//   levels outside 2-4 and the renderer has no level 1. The splitter still files it
//   under front matter, so this module has 12 sections.
// - The assignment no longer says "read only by you", because admins can read
//   submissions. It says the partner can't see it.
// - The [EXTERNAL VIDEO] callout in Section 7 is now the video it proposed, after an
//   oEmbed check: Timothy Keller at Talks at Google, C9THu0PZwwk, embeddable. A tip
//   callout follows it, added by Denis, because the talk runs about an hour.
// - Section 1 closes with BibleProject's Genesis overview (GQI72THyO5I), and Section 6
//   has Dr. Tony Evans on covenant (cRptjonzx0o), each with a paragraph and a tip in
//   Denis's wording. The Evans video is on Lakepointe Church's channel, its own
//   recording of Marriage Night 2023, where Dr. Evans was the guest speaker. Denis
//   accepted that on 2026-11-03.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-1/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Marriage Was God's Idea"),
    paragraph("Module 1 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why every conversation about marriage has to begin with the One who invented it, and what changes when a couple stops treating marriage as their own idea."),
    callout("info", "Who this is for: Every couple on this track. If you are engaged or courting, this module lays the foundation you will build on. If you are married, it is the plumb line you measure what you have built against."),
    callout("info", "Core promise: By the end of this module you will be able to say, in your own words, what marriage is, what it is for, and why it is a covenant and not a contract. You will also know which of the three \"totals\" of marriage you find hardest to give."),
    callout("info", "Time commitment: Roughly 70 minutes of reading and reflection, plus 30 minutes for the assignment. Sections 5 and 6 are the heart of this module. Do not rush them."),
    divider(),
  ],
};

// ─── It Began With Him ───
const section1 = {
  section_number: 1,
  title: "It Began With Him",
  blocks: [
    heading(2, "Section 1 — It Began With Him"),
    image("/images/marriage/module-1/MM1-1.png", "A garden path at first light: two sets of bare footprints side by side in the damp earth, running between dewy grass and a stream that catches the sunrise. No text appears in the image."),
    paragraph("Before we can prepare for marriage, we need to settle two questions: what marriage is, and who has the right to define it. Scripture answers both on its very first pages."),
    callout("scripture", "\"The Lord God said, 'It is not good for the man to be alone. I will make a helper suitable for him.'\" — Genesis 2:18"),
    paragraph("Read it slowly and notice who is speaking. It is not Adam. Adam did not look around the garden, feel the need for a wife and ask for one. God looked at the man, made His own assessment, and called his situation \"not good.\" Marriage began as God's observation and God's provision."),
    paragraph("That has a simple consequence. If we did not invent marriage, it is not ours to redefine. We received it. Our task is not to decide what marriage should be, but to discover what it already is and to build it the way its Designer intended."),
    pullQuote("We did not invent marriage. We received it. That is why it is not ours to redefine."),
    heading(3, "Before the Fall, and for Everyone"),
    paragraph("Notice also when this happens. God gives marriage before sin enters the world, before shame, before any plan of rescue was needed. Marriage was not a repair patched in after humanity broke. It was part of the original design, woven into creation itself."),
    paragraph("Because it comes before the church and before redemption, marriage belongs to the whole human race, not only to believers. Every man and woman was made able to taste its goodness. That is why even people who do not yet know God can build marriages full of real joy and faithfulness, and why Christians have no monopoly on the gift."),
    callout("scripture", "\"Enjoy life with your wife, whom you love, all the days of this meaningless life that God has given you under the sun.\" — Ecclesiastes 9:9"),
    paragraph("The Teacher in Ecclesiastes calls a good marriage a portion: a share of real good in a hard world. In the same breath he reminds us that life under the sun is labour. Marriage is a gift, but never an effortless one. You will spend the rest of this track learning how to work the gift well."),
    paragraph("If you would like to see the whole sweep of these opening chapters at once, BibleProject's animated overview of Genesis 1 to 11 is one of the clearest available. It shows God creating a good world, giving humans, male and female, the dignity of bearing His image and ruling it with Him, and then how quickly that partnership was broken when humanity chose to define good and evil for itself."),
    videoEmbed("GQI72THyO5I", "Book of Genesis Summary: A Complete Animated Overview (Part 1) | BibleProject"),
    callout("tip", "About 8 minutes. Watch for two moments: the creation of man and woman together as God's image, and what the fall does to their relationship in Genesis 3. Everything this track teaches about marriage is an attempt to return, by grace, to the first picture."),
    divider(),
  ],
};

// ─── Alone Is Not the Same as Lonely ───
const section2 = {
  section_number: 2,
  title: "Alone Is Not the Same as Lonely",
  blocks: [
    heading(2, "Section 2 — Alone Is Not the Same as Lonely"),
    paragraph("Here is a detail most people read straight past. When God said it was not good for the man to be alone, Adam was not lonely."),
    paragraph("He walked with God in the cool of the day. He had perfect fellowship with his Creator, meaningful work naming the animals, and a garden without one flaw in it. If anyone in history had reason to feel complete on his own, it was Adam."),
    table([
      "",
      "Lonely",
      "Alone"
    ], [
      [
        "What it means",
        "Feeling sad for lack of company",
        "Being without a partner to share the work and the wonder"
      ],
      [
        "Adam's situation",
        "No: he had unbroken fellowship with God",
        "Yes: he had no one beside him in the assignment"
      ],
      [
        "What marriage answers",
        "Not its primary purpose",
        "Its first purpose: a shared assignment"
      ]
    ]),
    paragraph("So why did God call Adam's solitude \"not good\"? Because God knew something we keep forgetting: a shared assignment is stronger than a solitary one."),
    callout("scripture", "\"Two are better than one, because they have a good return for their labour.\" — Ecclesiastes 4:9"),
    pullQuote("Marriage was never meant to cure loneliness. It was meant to multiply purpose."),
    heading(3, "Come to It Full"),
    paragraph("This matters enormously in practice. Many people marry mainly to escape loneliness, and loneliness makes a weak foundation for a covenant. A person who cannot be content alone with God will not suddenly become content by adding a spouse."),
    paragraph("Marriage is not the cure for an empty life. It is the multiplying of a full one. Come to it full, and it overflows. Come to it empty, hoping your spouse will fill you, and you will slowly drain the very person you married."),
    callout("tip", "If you are married and recognise yourself here, do not despair. Many of us married partly to fill a gap. The answer is not regret. It is to begin drawing from God what you have been demanding from your spouse. Watch what that does to the pressure in your home."),
    reflectionQuestions("Before You Move On — Just For You", [
      "Be honest: how much of your desire for marriage (or your expectations within it) is really a desire to stop feeling lonely?",
      "What purpose could the two of you carry together that neither of you could carry alone?"
    ]),
    divider(),
  ],
};

// ─── Taken From His Side ───
const section3 = {
  section_number: 3,
  title: "Taken From His Side",
  blocks: [
    heading(2, "Section 3 — Taken From His Side"),
    paragraph("When God made the woman, He did not form her from the dust as He had formed the man. He took her from the man's own body, from his side."),
    callout("scripture", "\"This is now bone of my bones and flesh of my flesh; she shall be called 'woman', for she was taken out of man.\" — Genesis 2:23"),
    paragraph("Teachers in the church have pointed this out for centuries. She was not taken from his head, as though she were made to rule over him. She was not taken from his feet, as though she were made to be walked on. She was taken from his side, near his heart, to stand beside him as his equal and to be dear to him."),
    paragraph("\"Bone of my bones and flesh of my flesh\" is the language of equality. A man and a woman are equal in value and dignity, even as they carry different responsibilities in marriage. We will spend Module 6 on those responsibilities. For now, settle the foundation they rest on."),
    pullQuote("She was made for his side, not his feet: to walk with him through life, not beneath him."),
    callout("warning", "Any teaching about marriage that turns one spouse into a master and the other into a servant has already wandered out of the garden. That includes teaching that sounds very spiritual."),
    divider(),
  ],
};

// ─── What Is Marriage? ───
const section4 = {
  section_number: 4,
  title: "What Is Marriage?",
  blocks: [
    heading(2, "Section 4 — What Is Marriage?"),
    paragraph("Marriage exists in every known society on earth. So it is worth asking how the world defines it, because the answer depends entirely on who is doing the defining."),
    table([
      "Lens",
      "How it defines marriage",
      "What it captures",
      "What it misses"
    ], [
      [
        "The dictionary",
        "A union of spouses, recognised by law; a close, intimate bond",
        "The basic facts",
        "Why it exists at all"
      ],
      [
        "The law",
        "A civil contract creating rights over property, children, inheritance and next of kin",
        "Protection and obligation",
        "Love, faithfulness, God"
      ],
      [
        "Anthropology",
        "A culturally approved union that creates rights and duties between two people and their families",
        "That marriage takes many forms worldwide",
        "What the best form is"
      ],
      [
        "African culture",
        "The joining of two families, even two communities, often sealed with bride price and negotiation",
        "That marriage is never only private",
        "That the couple must still become one"
      ]
    ]),
    paragraph("Each lens is true as far as it goes. Together they show marriage as a legal contract, a social union and, for those who look higher, a sacred covenant. But every one of them describes marriage from the outside. They tell us what marriage does. None of them tells us what marriage is for. For that, you have to ask the One who designed it."),
    heading(3, "Three Ways People Build a Marriage"),
    table([
      "Model",
      "How roles work",
      "Its strength",
      "Its danger"
    ], [
      [
        "The Western model",
        "Largely undefined; worked out case by case according to personality, status and income",
        "Freedom and flexibility",
        "Confusion, endless negotiation and quiet resentment"
      ],
      [
        "The African traditional model (at its worst)",
        "Husband as chief; wife valued mainly for children, labour and service",
        "Clarity and stability",
        "A wife reduced to a worker for her husband's comfort"
      ],
      [
        "The Christian model",
        "Covenant partnership under God: two equals with distinct, God-given responsibilities",
        "Order with love; equality with structure",
        "Being preached and not practised"
      ]
    ]),
    paragraph("A word of fairness about our own context. Many traditional African marriages are warm, mutual and deeply loving, and that middle row does not describe them all. But wherever the arrangement hardens into chief and worker, it falls short of God's design."),
    paragraph("The biblical vision is neither role-less confusion nor rigid hierarchy. It is the marriage described in Ephesians 5: a husband called to lead the way Christ leads, by laying down his life, and a wife who is an honoured partner, never a servant. Culture keeps handing us copies. Scripture hands us the original."),
    divider(),
  ],
};

// ─── Leave, Cleave, One Flesh, Unashamed ───
const section5 = {
  section_number: 5,
  title: "Leave, Cleave, One Flesh, Unashamed",
  blocks: [
    heading(2, "Section 5 — Leave, Cleave, One Flesh, Unashamed"),
    videoPlaceholder("2-3 min from Denis: the four movements of Genesis 2:24–25, and why the order (leave, then cleave, then one flesh) is not decoration but architecture."),
    paragraph("God gives His own definition of marriage in one dense sentence at the dawn of history."),
    callout("scripture", "\"That is why a man leaves his father and mother and is united to his wife, and they become one flesh. Adam and his wife were both naked, and they felt no shame.\" — Genesis 2:24–25"),
    paragraph("Folded into those two verses are four movements. Together they tell us what marriage really is."),
    table([
      "Movement",
      "What it means",
      "What it looks like in practice"
    ], [
      [
        "1. Leave",
        "A public break from your first family and the forming of a new one",
        "Your spouse's voice now comes before your parents' voice in decisions about your home"
      ],
      [
        "2. Cleave",
        "To be joined, held fast, glued: the language of a vow made to be kept",
        "You stop keeping a way out, even in your own head"
      ],
      [
        "3. One flesh",
        "Two lives fused into one shared life: body, history, family, money, future",
        "\"Mine\" and \"yours\" slowly become \"ours\""
      ],
      [
        "4. Naked and unashamed",
        "Total transparency: fully known and still fully loved",
        "No secret accounts, no hidden past, no private life your spouse may not enter"
      ]
    ]),
    paragraph("The French theologian Henri Blocher, in his study of the opening chapters of Genesis, describes marriage as a covenant in which a man and a woman give themselves to each other without holding back, to share one life and to be known by each other without covering. The world can describe the shell of marriage. Only Scripture shows its soul."),
    heading(3, "The Three Totals"),
    paragraph("Those four movements produce a marriage marked by three \"totals\". Each one collides head-on with something our culture worships."),
    table([
      "The total",
      "What it asks",
      "The idol it confronts"
    ], [
      [
        "Total commitment",
        "No back door. The covenant is for life.",
        "Personal fulfilment: \"stay only while you are happy\""
      ],
      [
        "Total unity",
        "Everything shared: time, money, body, future",
        "Personal freedom: \"keep your own rights and your own life\""
      ],
      [
        "Total vulnerability",
        "Nothing hidden. You are fully known.",
        "Self-protection: \"stay guarded, never be fully seen\""
      ]
    ]),
    paragraph("This is why marriage feels so costly to the modern heart. Our culture worships fulfilment, freedom and self-protection, and marriage asks us to lay all three on the altar. Many couples struggle precisely here: they want the blessing of covenant while holding on to the very idols covenant asks them to give up."),
    heading(3, "The Only Relationship That Grows Inward"),
    paragraph("Genesis 2:24 places the two great human relationships side by side, parent and child, husband and wife, and shows that they are designed to move in opposite directions."),
    table([
      "",
      "Parent and child",
      "Husband and wife"
    ], [
      [
        "Where it starts",
        "Total dependence: a baby cannot survive an hour alone",
        "Two independent adults from different homes"
      ],
      [
        "Where it is meant to go",
        "Outward, toward independence",
        "Inward, toward deeper interdependence"
      ],
      [
        "What success looks like",
        "The child can stand without the parent",
        "Two people who increasingly need, trust and rely on each other"
      ]
    ]),
    pullQuote("Parents raise children to need them less. Spouses are called to need each other more."),
    paragraph("That is why the modern ideal of the \"independent marriage\" (two self-sufficient people sharing a roof, with separate accounts, separate plans and an exit always open) is not an improvement on God's design. It contradicts it. To marry while guarding your independence is like planting a tree and refusing to let it take root."),
    callout("scripture", "\"Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.\" — Ecclesiastes 4:12"),
    callout("tip", "This also explains why the leaving matters so much. A man who has never truly left his parents cannot fully weave his life into his wife's, because part of him is still woven somewhere else. The cleaving can only go as deep as the leaving. Module 8 deals with in-laws in detail. For now, settle the order: leave, then cleave, then one flesh."),
    reflectionQuestions("Before You Move On — Just For You", [
      "Of the three totals (commitment, unity, vulnerability), which do you find hardest to give? What are you protecting?",
      "Is there anything in your life your partner may not enter: an account, a phone, a friendship, a part of your past?",
      "If you are married: whose voice, honestly, carries more weight in your decisions today, your spouse's or your family's?"
    ]),
    divider(),
  ],
};

// ─── Covenant, Not Contract ───
const section6 = {
  section_number: 6,
  title: "Covenant, Not Contract",
  blocks: [
    heading(2, "Section 6 — Covenant, Not Contract"),
    image("/images/marriage/module-1/MM1-2.png", "An elderly woman in glasses and a wax-print headwrap smiles as she sews a tear in colourful African cloth, with a sewing tin of thread and a pincushion beside her and afternoon light coming through the window. No text appears in the image."),
    paragraph("Of all the words that describe marriage, Scripture chooses one with special care."),
    callout("scripture", "\"She is your partner, the wife of your marriage covenant.\" — Malachi 2:14"),
    paragraph("A covenant is not a contract, and the difference is everything."),
    table([
      "",
      "Contract",
      "Covenant"
    ], [
      [
        "Built on",
        "Distrust: protection in case the other fails",
        "Commitment: a promise for when the other fails"
      ],
      [
        "Its logic",
        "\"I will do my part as long as you do yours.\"",
        "\"I have given myself to you, and I am not leaving.\""
      ],
      [
        "When terms are broken",
        "The deal is off",
        "The work begins"
      ],
      [
        "Who witnesses it",
        "The parties and the law",
        "The couple, the community and God"
      ],
      [
        "How long it lasts",
        "Until the conditions fail",
        "For life"
      ]
    ]),
    callout("scripture", "\"Therefore what God has joined together, let no one separate.\" — Mark 10:9"),
    pullQuote("Marriage is not a deal you leave when the terms disappoint. It is a covenant you keep even when they do."),
    paragraph("Dr. Tony Evans, who led Oak Cliff Bible Fellowship in Dallas for nearly fifty years and whose teaching on the family is heard across Africa, preached a whole message on this one distinction: why God designed marriage as a covenant and not a deal."),
    videoEmbed("cRptjonzx0o", "Marriage: It's a Covenant, Not a Contract | Dr. Tony Evans"),
    callout("tip", "As you watch, compare what he says with the table above. Then ask yourself honestly: in the way I think and speak about marriage, am I living by covenant or by contract?"),
    heading(3, "Repairers in a Replacement Age"),
    paragraph("There is a reason covenant sounds strange to modern ears. We may be the first generations in history raised almost entirely without repair."),
    paragraph("When your grandmother's wrapper tore, she mended it. When your grandfather's radio stopped working, he took it to a man in the market who opened it up and fixed it. Shoes were resoled, pots were patched, tools were sharpened. To own something was to maintain it."),
    paragraph("That world is mostly gone. When a phone cracks, we upgrade. When a shirt fades, we replace it. Many appliances are now designed so that buying new is cheaper than fixing old. Decades ago the writer Alvin Toffler warned that a society of throw-away products would eventually produce throw-away relationships: that the habit of replacing instead of repairing would not stay in the marketplace, but follow us home."),
    paragraph("He was right. A generation trained to replace everything it owns will be tempted to replace everyone it loves. When the marriage cracks, the culture whispers what it says about the phone: this one has problems; a newer model will serve you better. Advertising trains our hearts for that whisper every day, teaching us to stare at what we lack instead of giving thanks for what we have."),
    callout("scripture", "\"But godliness with contentment is great gain.\" — 1 Timothy 6:6"),
    paragraph("People are not products, and covenant is not a subscription. In marriage two have become one flesh, so separating them is not like returning goods to a shop. It is like tearing something living. Ask anyone who has been through divorce: the paperwork ends quickly, but the tearing goes on for years, in two hearts and in the children who carry pieces of both."),
    paragraph("The couples whose marriages last did not find a spouse without defects. No such person exists, and neither of you married one. Lasting couples are simply repairers in a replacement age. They go back to the torn place with needle and thread (conversation, confession, forgiveness) again and again, until mending becomes the culture of their home."),
    pullQuote("Covenant is the settled decision, made before God, that this relationship will be repaired and never replaced."),
    callout("warning", "An important word of care. To repair is not the same as to endure abuse. Mending assumes two people who both want the cloth whole. Where one person is deliberately and repeatedly harming the other and will not stop, the language of repair does not apply, and nothing in this track asks anyone to remain within reach of that harm. If that is your situation, please speak to a trusted pastor or counsellor, and contact local emergency services if you are in danger."),
    divider(),
  ],
};

// ─── The Third Strand ───
const section7 = {
  section_number: 7,
  title: "The Third Strand",
  blocks: [
    heading(2, "Section 7 — The Third Strand"),
    paragraph("On 3 May 2021, Bill and Melinda Gates announced that they were ending their marriage after 27 years. Their joint statement spoke of their children and of the work they would continue together through their foundation, and asked for privacy as they began a new chapter."),
    paragraph("This is not a story told to judge them. We do not know what happened inside that marriage, and it is not ours to know. It is told because of what it shows about the rest of us. Here was one of the wealthiest couples in history, with every resource money can buy: the best advisers, homes on several continents, people paid to solve every practical problem. And the marriage still came apart after more than a quarter of a century."),
    paragraph("As a pastor, I watch more struggling marriages than I can count. If billions cannot hold a home together, a young couple might fairly ask: what hope do we have?"),
    heading(3, "A Cord of Three Strands"),
    paragraph("Here is the answer, and it is the thesis of this whole track. The hope was never in the resources."),
    table([
      "What a couple relies on",
      "Strands",
      "What happens under strain"
    ], [
      [
        "Money and resources",
        "One strand",
        "Snaps when the strain is not financial"
      ],
      [
        "Chemistry and compatibility",
        "Two strands",
        "Frays as feelings fade and people change"
      ],
      [
        "God woven into the covenant",
        "Three strands",
        "\"Not quickly broken\": it holds when the first two are tested"
      ]
    ]),
    paragraph("A marriage missing the third strand is not made safe because the first two are made of gold. The One who invented marriage is the only One who can keep it."),
    heading(3, "We Vow to God"),
    paragraph("The two greatest commandments, given through Moses and confirmed by Jesus, are to love God and to love one another. Notice the word: commandments. Not suggestions or moods. God does not command what cannot be chosen, which means love, in His economy, is something you decide to do."),
    paragraph("That is why we make vows at the altar. Strong feelings may bring us there, but feelings will not survive every ordinary Tuesday of a long marriage, so we do not vow our feelings. We vow our choices. And look carefully at what happens: we make our vow to God, about our spouse. The vow is vertical before it is horizontal."),
    pullQuote("Two people moving toward the same God are, without noticing it, moving toward each other."),
    videoEmbed("C9THu0PZwwk", "The Meaning of Marriage | Timothy Keller | Talks at Google"),
    callout("tip", "Optional: this is Tim Keller's full talk on his book The Meaning of Marriage, about an hour long. You can finish this module without it. Watch it when you have time, and listen for how he describes covenant: the promise that makes love stable instead of fragile."),
    reflectionQuestions("Before You Move On — Just For You", [
      "If you are honest, what are you relying on to hold your relationship together: money, chemistry, or God?",
      "What does the third strand actually look like in your relationship this week, in practice, not in theory?"
    ]),
    divider(),
  ],
};

// ─── When Are You Actually Married? ───
const section8 = {
  section_number: 8,
  title: "When Are You Actually Married?",
  blocks: [
    heading(2, "Section 8 — When Are You Actually Married?"),
    image("/images/marriage/module-1/MM1-3.png", "Three scenes side by side. A couple in traditional African dress hold hands at a customary marriage ceremony as their families applaud. A couple sign a register beneath a sign reading CIVIL REGISTRY and the flag of Cameroon. A couple kneel at a church altar as a minister raises a hand in blessing beneath a lit cross."),
    paragraph("Across Africa a fair and practical question comes up again and again. When exactly is a couple married in the eyes of God? When the bride price has been paid and the traditional rites are done? When the marriage is registered by the state? Or only after the church wedding?"),
    paragraph("Scripture does not prescribe one ceremony. It records weddings (Jesus Himself attended one at Cana), but it never commands a single form. What it does insist on are the elements we have already seen: a public leaving, a covenant vow, and two lives joined before God and the community. It also commands believers to honour the laws and authorities of their land."),
    table([
      "Ceremony",
      "What it honours",
      "Why it matters"
    ], [
      [
        "Traditional marriage",
        "The two families and the community",
        "Marriage joins households, not only individuals"
      ],
      [
        "Civil (legal) marriage",
        "The authorities God has placed over us",
        "Protection for spouse and children: property, inheritance, next of kin"
      ],
      [
        "Church wedding / blessing",
        "God and His people",
        "The covenant is made before God and witnessed by the church"
      ]
    ]),
    paragraph("So the wise path is not to set the three against each other, but to honour them together: complete what your community and your government recognise as marriage, and seal it all as a covenant before God."),
    heading(3, "\"We Are Basically Married\""),
    paragraph("Here is the practical point for anyone preparing. Do not begin living as married, or sharing a bed, before that public covenant has been made. Privately deciding \"we are basically married\" is not the same as being married. By God's design, covenant is public."),
    paragraph("The research points the same way. In 2009, psychologists Galena Rhoades, Scott Stanley and Howard Markman at the University of Denver published a study of what they called the pre-engagement cohabitation effect. Couples who moved in together before they were engaged had a higher chance of divorce, and reported lower satisfaction in their marriages, than couples who waited until they were engaged or married."),
    paragraph("Their explanation is worth hearing. Some couples who move in together without a clear decision to marry end up sliding into marriage, partly because they are already living together and it has become harder to separate. In other words, the marriage happened by drift instead of by decision."),
    pullQuote("A covenant is decided. It is never something you slide into."),
    callout("note", "Many couples in our cities live together while they save for bride price and three ceremonies. If that is you, this is not a word of condemnation. It is an invitation to make your decision on purpose, in daylight, with counsel, and to ask your families and your church to help make marriage reachable instead of endlessly delayed. Module 12 returns to this."),
    divider(),
  ],
};

// ─── A Living Picture ───
const section9 = {
  section_number: 9,
  title: "A Living Picture",
  blocks: [
    heading(2, "Section 9 — A Living Picture"),
    paragraph("There is one more layer to God's definition, and it is the highest of all."),
    callout("scripture", "\"The two will become one flesh. This is a profound mystery, but I am talking about Christ and the church.\" — Ephesians 5:31–32"),
    paragraph("Every Christian marriage is meant to show, in miniature, how Christ loves His people: sacrificially, faithfully, permanently. When a husband and wife keep covenant through hardship, forgive each other, and simply refuse to quit, they preach a wordless sermon about the gospel. To marry is never a small or merely private thing. It is to accept the honour of displaying God's love in front of a watching world."),
    paragraph("And one last truth to keep us humble: marriage is a school. It is a lifelong classroom in which two imperfect people are shaped in patience, selflessness, forgiveness and grace. Nobody graduates. You will still be learning to love well on your fiftieth anniversary. That is exactly why preparation, and continued learning, matter."),
    heading(3, "A Definition to Carry With You"),
    callout("info", "Marriage is a social and legal union and a sacred covenant, made under God in the presence of His people: a permanent, faithful bond between one man and one woman, in which the two become one flesh, and through which God meets many needs at once: to love and be loved, for friendship and companionship, for intimacy, and for raising the next generation."),
    table([
      "Part of the definition",
      "What it means for you"
    ], [
      [
        "Social and legal union",
        "The community and the state recognise it; it is public"
      ],
      [
        "Covenant under God",
        "Heaven witnesses it; your vow is first made to Him"
      ],
      [
        "Permanent and faithful",
        "It is meant to last, and it is for two only"
      ],
      [
        "One flesh",
        "It is the deepest human union there is"
      ],
      [
        "Meets many needs at once",
        "It is about far more than romance"
      ]
    ]),
    paragraph("Everything else in this track hangs on that one definition. Come back to it whenever you lose your bearings."),
    divider(),
  ],
};

// ─── Your Covenant Check ───
const section10 = {
  section_number: 10,
  title: "Your Covenant Check",
  blocks: [
    heading(2, "Your Covenant Check"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today, not as you hope it will be. If you are engaged, rate what you are already practising. If you are married, rate how you are actually living."),
    scorecard("Covenant or Contract?", "marriage_module1_covenant", [
      {
        "key": "commitment",
        "max": 10,
        "label": "Total commitment — I keep no back door, not even in my thoughts",
        "helpText": "When things are hard, do you ever rehearse leaving?"
      },
      {
        "key": "unity",
        "max": 10,
        "label": "Total unity — I share my time, money and future without a private reserve",
        "helpText": "Is there anything you still call \"mine alone\"?"
      },
      {
        "key": "vulnerability",
        "max": 10,
        "label": "Total vulnerability — my partner knows me fully, including my past and my struggles",
        "helpText": "What would you be afraid for them to find out?"
      },
      {
        "key": "leaving",
        "max": 10,
        "label": "Leaving — my partner's voice comes before my family's in decisions about our home",
        "helpText": "Who did you consult first on the last big decision?"
      },
      {
        "key": "third_strand",
        "max": 10,
        "label": "The third strand — God is actively woven into our relationship, not just named in it",
        "helpText": "When did you last pray together, apart from meals?"
      },
      {
        "key": "repair",
        "max": 10,
        "label": "Repair — when something tears between us, I go back and mend it",
        "helpText": "Is there a torn place you have been avoiding?"
      }
    ]),
    callout("tip", "Your lowest score is your first assignment. You will find it again in the prompts below."),
    divider(),
  ],
};

// ─── Module 1 Assignment — Write Your Covenant ───
const section11 = {
  section_number: 11,
  title: "Module 1 Assignment — Write Your Covenant",
  blocks: [
    heading(2, "Module 1 Assignment — Write Your Covenant"),
    assignmentPrompt({
      "title": "Module 1 Assignment",
      "instructions": "This week you will put your understanding of covenant into your own words and into one concrete action. Answer the version that fits your season. Write honestly: your partner can't see this, and a mentor reads it only if you choose to share it.",
      "word_min": 250,
      "word_max": 800,
      "prompts": [
        {
          "number": 1,
          "heading": "Define It in Your Own Words",
          "guidance": "Without looking back at the module, write your own definition of marriage in three or four sentences. Then compare it with the definition in Section 9. What did you leave out, and why do you think you left it out?"
        },
        {
          "number": 2,
          "heading": "Name the Total You Hold Back",
          "guidance": "Which of the three totals (commitment, unity, vulnerability) is hardest for you to give? Describe one specific way you are holding it back right now. Engaged: what would giving it look like before the wedding? Married: what would giving it look like this month?",
          "example": "Example: \"Unity. I still keep a savings account my fiancé doesn't know about, 'just in case'.\""
        },
        {
          "number": 3,
          "heading": "Draft a Covenant Statement Together",
          "guidance": "If your partner is also on this track, write this one together, out loud, then each enter the agreed version here. Complete these sentences: \"We believe God is joining us so that... Our home will exist to... In ten years, we want our marriage to be known for...\" Keep it short enough to memorise. If you are doing this track alone, draft your own and share it with your partner this week."
        },
        {
          "number": 4,
          "heading": "Mend One Torn Place",
          "guidance": "Married: name one place where something has torn between you and was never properly mended. Write what you will say to begin repairing it, and when. Engaged: name one area where you already tend to withdraw rather than repair, and write the rule you will practise instead."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Marriage Was God's Idea", [
      {
        "id": "q1",
        "prompt": "In Genesis 2:18, who first said that it was not good for the man to be alone?",
        "options": [
          {
            "id": "a",
            "text": "Adam, after naming the animals"
          },
          {
            "id": "b",
            "text": "God, by His own assessment"
          },
          {
            "id": "c",
            "text": "The woman"
          },
          {
            "id": "d",
            "text": "The angels"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: marriage began as God's observation and provision, so it is not ours to redefine."
      },
      {
        "id": "q2",
        "prompt": "According to Section 2, what was marriage first meant to do?",
        "options": [
          {
            "id": "a",
            "text": "Cure loneliness"
          },
          {
            "id": "b",
            "text": "Multiply purpose through a shared assignment"
          },
          {
            "id": "c",
            "text": "Provide financial security"
          },
          {
            "id": "d",
            "text": "Satisfy family expectations"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Adam was alone but not lonely. Marriage multiplies a full life; it does not fill an empty one."
      },
      {
        "id": "q3",
        "prompt": "What are the four movements of Genesis 2:24–25, in order?",
        "options": [
          {
            "id": "a",
            "text": "Meet, court, marry, settle"
          },
          {
            "id": "b",
            "text": "Leave, cleave, one flesh, naked and unashamed"
          },
          {
            "id": "c",
            "text": "Love, honour, obey, cherish"
          },
          {
            "id": "d",
            "text": "Cleave, leave, unashamed, one flesh"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: the order is architecture. The cleaving can only go as deep as the leaving."
      },
      {
        "id": "q4",
        "prompt": "Which idol does \"total vulnerability\" confront?",
        "options": [
          {
            "id": "a",
            "text": "Personal fulfilment"
          },
          {
            "id": "b",
            "text": "Personal freedom"
          },
          {
            "id": "c",
            "text": "Self-protection"
          },
          {
            "id": "d",
            "text": "Wealth"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Commitment confronts fulfilment, unity confronts freedom, and vulnerability confronts self-protection."
      },
      {
        "id": "q5",
        "prompt": "What is the key difference between a contract and a covenant?",
        "options": [
          {
            "id": "a",
            "text": "A covenant is written; a contract is spoken"
          },
          {
            "id": "b",
            "text": "A contract ends when terms are broken; a covenant is kept when they are"
          },
          {
            "id": "c",
            "text": "There is no real difference"
          },
          {
            "id": "d",
            "text": "A contract involves God; a covenant does not"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 6: a contract protects you if the other fails; a covenant commits you for when they do."
      },
      {
        "id": "q6",
        "prompt": "What did the 2009 University of Denver study find about couples who lived together before engagement?",
        "options": [
          {
            "id": "a",
            "text": "They had stronger marriages"
          },
          {
            "id": "b",
            "text": "There was no difference"
          },
          {
            "id": "c",
            "text": "They had a higher chance of divorce and lower satisfaction than couples who waited"
          },
          {
            "id": "d",
            "text": "They married sooner and happier"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 8: the researchers suggested many such couples slide into marriage instead of deciding."
      },
      {
        "id": "q7",
        "prompt": "In the cord of three strands, what is the third strand?",
        "options": [
          {
            "id": "a",
            "text": "Money"
          },
          {
            "id": "b",
            "text": "Children"
          },
          {
            "id": "c",
            "text": "God woven into the covenant"
          },
          {
            "id": "d",
            "text": "The extended family"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 7: resources and chemistry fray under strain. The One who invented marriage is the only One who can keep it."
      }
    ]),
    divider(),
  ],
};

// ─── Module 1 Complete ───
const section12 = {
  section_number: 12,
  title: "Module 1 Complete",
  blocks: [
    heading(2, "Module 1 Complete"),
    image("/images/marriage/module-1/MM1-4.png", "A thick rope braided from three strands, gold, red and cream, is tied around a weathered wooden post on a riverbank at sunset, holding a small wooden boat steady in the current. No text appears in the image."),
    videoPlaceholder("2-3 min closing from Denis: which of the three totals he and Arit found hardest in their own early marriage, and what giving it cost and gave them."),
    paragraph("You now know where marriage came from, what it is for, and why it is a covenant rather than a contract. You have named the total you find hardest to give, and the torn place you need to mend."),
    paragraph("Module 2 turns from the design to the person who brings it to life: you. Before you can build a marriage, you have to know, and often heal, the one who is building it."),
    callout("info", "Next: Module 2 — Know Yourself, Heal Yourself. Before you begin, finish your assignment and, if your partner is on this track, read your covenant statements aloud to each other."),
  ],
};

// ─── Assemble ───

const module1 = {
  module_number: 1,
  slug: "marriage-was-gods-idea",
  title: "Marriage Was God's Idea",
  subtitle: "Design, Covenant, and the Cord of Three Strands",
  track_slug: "marriage",
  pillar: "personal-foundation",
  pillar_id: "00000000-0000-0000-0002-000000000011",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 100,
  sort_order: 1,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12],
};

const total = module1.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 1 — "${module1.title}"`);
module1.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module1_marriage.json", JSON.stringify(module1, null, 2));
console.log("\nWritten to module1_marriage.json");
