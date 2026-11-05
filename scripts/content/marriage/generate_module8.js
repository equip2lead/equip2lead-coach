// Marriage Module 8 — "Family & In-Laws"
// Ported on 2026-11-04 from build_module8_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module8.js
//
// Writes module8_marriage.json to the current directory.
//
// Matches the live row, including Denis's rewording of the video intro and tip. Its privacy wording already says the partner cannot
// see the reflections, ratings and assignment. oEmbed check on 2026-11-05: the Ted Cunningham
// video is on Focus on the Family's channel, 26:58 long. Its caption is the real title, tidied.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-8/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Family & In-Laws"),
    paragraph("Module 8 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why in our part of the world you never marry only a person, why leaving your father and mother is not dishonour, and why the phone call from home has ended more young marriages than money."),
    callout("info", "Who this is for: Everyone on this track. Courting and engaged couples need to know, before the ring, how their two families will fit around one new home. Married couples need to check whose voice really settles decisions in their house. Parents and older relatives reading this will find a word for them in Section 8."),
    callout("info", "Core promise: By the end of this module you will understand what leaving means and what it does not mean, how to honour both families without handing your home to either, how to hold a decision when family pressure comes, how to agree who may live with you, how to share the work of caring for two families, and what to do when family involvement becomes harm."),
    callout("info", "Time commitment: About 80 minutes of reading and reflection, plus 35 minutes for the assignment. If you have a partner on this track, the family checklist in Section 2 is meant to be done together."),
    callout("warning", "A word of care. In some homes, relatives do more than interfere: they threaten, control or harm. Nothing in this module asks you to submit to that. If it describes your situation, read Section 9 first, and speak to a trusted pastor or counsellor on your own."),
    divider(),
  ],
};

// ─── Leaving Is Not Dishonour ───
const section1 = {
  section_number: 1,
  title: "Leaving Is Not Dishonour",
  blocks: [
    heading(2, "Section 1 — Leaving Is Not Dishonour"),
    image("/images/marriage/module-8/MM8-1.png", "An African bride and groom, hand in hand and smiling at each other, step out through the gate of a family compound on their wedding day. Behind them in the courtyard, their parents smile and wave, in warm late-afternoon light. No readable text appears in the image."),
    callout("scripture", "\"That is why a man leaves his father and mother and is united to his wife, and they become one flesh.\" — Genesis 2:24"),
    paragraph("Before Scripture says the two become one flesh, it says the man leaves his father and mother. In the West that verse costs almost nothing: children leave home at eighteen and rarely come back. Here it costs a great deal, because leaving can sound like ingratitude, and it seems to collide with a holy duty that no marriage ever cancels."),
    callout("scripture", "\"Honour your father and your mother, so that you may live long in the land the Lord your God is giving you.\" — Exodus 20:12"),
    paragraph("Both commands stand. So we have to define leaving precisely, because the imprecision is what wounds families."),
    pullQuote("Leaving is a transfer of authority. It is not a withdrawal of honour."),
    table([
      "What does not change on your wedding day",
      "What does change"
    ], [
      [
        "You still love your parents",
        "Their voice no longer settles matters inside your home"
      ],
      [
        "You still honour, visit and care for them",
        "Your spouse becomes your first loyalty, before them"
      ],
      [
        "You still seek their counsel",
        "Their counsel is given when it is asked for, and weighed by the two of you"
      ],
      [
        "You may still live on the same compound",
        "Your household is now a new first family, and theirs becomes the extended one"
      ]
    ]),
    paragraph("Here is the whole test, and it is simple. When there is a decision about your household (where you live, how you spend, how you raise your children, whether someone moves in), whose word ends the discussion? If the answer is your mother, then in the sense Scripture means, you have not yet left, however far away you may be living."),
    paragraph("A man who has never truly left cannot fully weave his life into his wife's, because part of him is still woven somewhere else. The same is true of a woman. The cleaving can only go as deep as the leaving."),
    paragraph("Pastor Ted Cunningham, founding pastor of Woodland Hills Family Church in Branson, Missouri, talks with Focus on the Family about Genesis 2:24: why a newly married couple must leave their families emotionally, relationally and financially, and how parents can support the new home instead of competing with it."),
    videoEmbed("xF3s0h_ZIWA", "The Importance of Leaving and Cleaving | Ted Cunningham | Focus on the Family"),
    callout("tip", "About 27 minutes. His setting is American, where leaving is easier than here. As you listen, translate it: in your own family, what would leaving well look like without any loss of honour?"),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "When a decision about my household has to be made, whose voice really settles it?",
      "Is there any way in which I have not yet left my father and mother?",
      "What honour do I want to keep showing my parents for the rest of their lives?"
    ]),
    divider(),
  ],
};

// ─── You Marry a Household ───
const section2 = {
  section_number: 2,
  title: "You Marry a Household",
  blocks: [
    heading(2, "Section 2 — You Marry a Household"),
    paragraph("You are not marrying an individual. You are marrying into a household, and in our part of the world that household has standing, opinions and claims. Bride price, ceremonies, a brother who may need a room, a sister's school fees, a mother with an opinion and the right to voice it: these are not footnotes. They are part of the marriage."),
    paragraph("So examine the family before the ring, not after. The question is not whether the families are perfect. None is. The question is simpler: when the two families pull in opposite directions, do the two of you already know which way you will move?"),
    table([
      "Ask before the ring (or now, if you are married)",
      "What it reveals"
    ], [
      [
        "Who in either family expects to be consulted on decisions inside our home?",
        "Where pressure will come from"
      ],
      [
        "What happened the last time you and your mother disagreed about something that mattered?",
        "Whether you have ever held a position against her"
      ],
      [
        "Is there a relative who may one day need to live with us?",
        "A commitment that is often assumed and never spoken"
      ],
      [
        "What traditional rites and obligations apply to us, and have both families agreed them?",
        "Where culture, cost and expectation may collide"
      ],
      [
        "What does each family believe about a wife's role, children and work?",
        "Whose expectations you will be measured against"
      ]
    ]),
    heading(3, "Where Do You Foresee Tension?"),
    paragraph("Each of you, separately, tick every area where you can already foresee tension with either family. Then compare. Where you both ticked the same area, agree together the boundary you will keep and the honour you will show."),
    table([
      "Area of possible tension",
      "Mine",
      "Yours"
    ], [
      [
        "How often and how long visits will be, theirs to us and ours to them",
        "",
        ""
      ],
      [
        "Money: how much support, to whom, and who decides",
        "",
        ""
      ],
      [
        "Interference in our decisions: housing, work, church, children",
        "",
        ""
      ],
      [
        "Holidays and festivals: whose family, which years",
        "",
        ""
      ],
      [
        "Expectations about children: timing, number, names, upbringing",
        "",
        ""
      ],
      [
        "A parent's difficulty in releasing a son or daughter",
        "",
        ""
      ],
      [
        "Differences of tribe, culture, language or church between the families",
        "",
        ""
      ]
    ]),
    callout("tip", "Do not try to solve every area in one evening. Choose the two that carry the most heat, and agree one sentence about each that you will both say to your families if the question comes."),
    divider(),
  ],
};

// ─── The Phone Call From Home ───
const section3 = {
  section_number: 3,
  title: "The Phone Call From Home",
  blocks: [
    heading(2, "Section 3 — The Phone Call From Home"),
    paragraph("Now the hardest one in our context, and the one that destroys more young marriages here than money does. A husband agrees something with his wife. It is settled; she relaxes and begins to plan. Then his mother calls, or his uncle visits, or the family group chat lights up, and by evening the decision has quietly reversed."),
    paragraph("He does not see what he has done. He will say he is honouring his parents, and in a culture where that is a sacred duty the explanation sounds unanswerable. But consider what his wife has actually learned. She has learned that an agreement with her husband is provisional. She has learned that there is a higher court she cannot appear in. And she has learned that when the pressure comes, she is the one who will be asked to give way, because she is the one who is safe to disappoint."),
    pullQuote("A man who cannot hold a decision in front of his mother has not yet left his father and mother, whatever address he is living at."),
    callout("note", "The same is true in the other direction. A wife whose mother, sister or aunt can reverse what she agreed with her husband has not yet left either. Most of the time this pattern runs through the husband's family in our culture, but it can run through either."),
    heading(3, "Three Habits That Hold a Decision"),
    table([
      "Habit",
      "What it looks like"
    ], [
      [
        "Each of you speaks to your own family",
        "He handles his relatives and she handles hers. Never send your spouse to deliver a decision your family will not like, and never leave them to face your family alone over something you both agreed."
      ],
      [
        "Say \"we decided\", and mean it",
        "Not \"she does not want to\" or \"he will not allow it\". That is handing your spouse to your family to be dealt with while you stand clear."
      ],
      [
        "Absorb the displeasure; do not pass it on",
        "Your family's disappointment is yours to carry, not your spouse's to pay for in the weeks afterwards."
      ]
    ]),
    paragraph("And keep one sentence ready for every request that arrives without warning: \"We will discuss it and come back to you.\" It honours the person asking. It protects the two of you. And it means no decision about your home is ever made on a phone call, by one of you alone, under pressure."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Has a decision between us ever been reversed after a call or visit from family? What did my partner learn from it?",
      "Do I speak to my own family myself, or do I send my partner?",
      "Which sentence will I say the next time a family request arrives without warning?"
    ]),
    divider(),
  ],
};

// ─── Honour From Inside the Wall ───
const section4 = {
  section_number: 4,
  title: "Honour From Inside the Wall",
  blocks: [
    heading(2, "Section 4 — Honour From Inside the Wall"),
    paragraph("Leaving well does not mean keeping your families at a distance. It means building a wall around your marriage and then honouring your families generously from inside it: with gratitude, visits, gifts, care and respect. What you must never do is honour them through holes in the wall."),
    table([
      "Agree these now",
      "Why"
    ], [
      [
        "Nothing about your marriage is discussed with your parents before it is settled between you",
        "What you tell them cannot be untold. They will remember your worst week long after you have forgiven each other for it."
      ],
      [
        "Never complain about your spouse to your family",
        "You will forgive your spouse. Your family often will not."
      ],
      [
        "Defend each other in your own family's hearing",
        "What you allow to be said about your spouse in their absence is what your family will believe about them permanently."
      ],
      [
        "Treat both families by the same rule",
        "If his mother may visit for a month, so may hers. If one family receives support, the other is considered fairly."
      ],
      [
        "Decide together the level of contact, visits and support for each family",
        "A boundary one spouse set alone is not a boundary. It is a grievance waiting to be discovered."
      ]
    ]),
    pullQuote("Let no cracks in your marriage be visible to your relatives. Fix them inside the house, with help if you need it."),
    callout("tip", "When you need counsel about your marriage, choose someone who can help you both: a pastor, a mature married couple, a trained counsellor. A parent hears only one side, loves only one of you by blood, and is the hardest person in the world to be neutral."),
    divider(),
  ],
};

// ─── In-Laws, for Better and for Worse ───
const section5 = {
  section_number: 5,
  title: "In-Laws, for Better and for Worse",
  blocks: [
    heading(2, "Section 5 — In-Laws, for Better and for Worse"),
    image("/images/marriage/module-8/MM8-2.png", "An older African woman and a younger African woman laugh together as they cook in a bright outdoor kitchen, the older one showing the younger how to season a large pot, while a child watches with her chin on her hand. No readable text appears in the image."),
    paragraph("In-law tension is common almost everywhere in the world. When the Cambridge psychologist Terri Apter studied 49 couples and 156 other family members, three in four couples described problems with an in-law. The most difficult relationship, by far, was between a wife and her husband's mother; the relationship between a mother-in-law and her son-in-law was difficult in only about one case in seven. Apter's explanation was that the two women often feel they are competing for the same place: the central woman in one man's family."),
    paragraph("Research also shows how much these relationships matter. The University of Michigan psychologist Terri Orbuch has followed married couples for more than twenty-five years. When a husband reported a close relationship with his wife's parents, the couple's risk of divorce over the following sixteen years was about 20 per cent lower. When a wife reported a close relationship with her husband's parents, the risk was about 20 per cent higher. Orbuch's explanation was that many wives found it harder to set boundaries with in-laws they were close to, and over time experienced the closeness as interference in their marriage and their parenting."),
    callout("info", "These are American and British studies, and our families are structured differently. But the lessons travel. Husbands: draw near to your wife's family; it strengthens your marriage. Wives: you may love your husband's family deeply, and you still need boundaries, agreed with your husband and held by him."),
    heading(3, "Three In-Law Stories From Scripture"),
    table([
      "Story",
      "What it teaches"
    ], [
      [
        "Ruth and Naomi (Ruth 1:16–17)",
        "An in-law relationship can become one of the deepest loves of a life. \"Where you go I will go, and where you stay I will stay.\" A mother-in-law can be a gift."
      ],
      [
        "Moses and Jethro (Exodus 18)",
        "A wise father-in-law gives counsel when he sees a need, and Moses listens and decides. Jethro then goes home. Good in-law counsel is offered, weighed, and released."
      ],
      [
        "Jacob and Laban (Genesis 29–31)",
        "An in-law can exploit: changing the terms, using the marriage for his own gain. Jacob finally leaves with his wives and children. Honour never requires you to stay in reach of exploitation."
      ]
    ]),
    pullQuote("A good mother-in-law is one of God's great gifts to a young marriage. A good daughter-in-law is one of His great gifts to an older one."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Which in-law relationship in my life is the easiest, and which the hardest? Why?",
      "Husbands: how close am I to my wife's parents? Wives: have we agreed the boundaries with my husband's family?",
      "Which of the three Scripture stories is closest to my situation?"
    ]),
    divider(),
  ],
};

// ─── Who Lives in Your House? ───
const section6 = {
  section_number: 6,
  title: "Who Lives in Your House?",
  blocks: [
    heading(2, "Section 6 — Who Lives in Your House?"),
    paragraph("A great many of our homes are not two people. There is a relative who came for three weeks and has stayed three years. A cousin sent from the village to stay and be useful. A niece being raised with you so she can attend a better school. A house help, a nanny, or a boy who does the compound. No Western marriage book will prepare you for this, because their homes do not work this way. Ours do."),
    callout("warning", "The rule that protects every other rule: no parent or relative moves into your home unless both of you have agreed, and agreed for how long. Say the second part aloud at the time, because nobody can say it later."),
    heading(3, "If There Will Be Help in Your Home"),
    paragraph("Four things go wrong when this is never discussed. Nobody agreed who instructs her, so she takes instructions from two people who have not spoken to each other. She becomes the reason neither of you ever learns to run the house, so the day she leaves, the home stops working. Your children learn how human beings are valued from how you speak to her, long before they can recite a verse. And nobody thinks carefully about a husband and a young woman under one roof."),
    paragraph("I say that last one plainly and without accusing anybody. It is one of the most common sources of catastrophe I have sat with in ministry: not because most men are monsters, but because closeness, secrecy and power work slowly on ordinary people. A couple who will not discuss this before marrying is not being pure. They are being naive."),
    callout("scripture", "\"If I have denied justice to any of my servants, whether male or female, when they had a grievance against me, what will I do when God confronts me? What will I answer when called to account? Did not he who made me in the womb make them?\" — Job 31:13–15"),
    table([
      "Settle together",
      "The standard"
    ], [
      [
        "Who gives instructions",
        "One instructor, agreed between you"
      ],
      [
        "Pay and conditions",
        "A wage, hours, days off and notice, agreed and kept as you would want your own employer to keep them"
      ],
      [
        "Dignity",
        "She has a name and she eats what you eat: not the leftovers, not a lesser pot, not standing in the kitchen while the family sits"
      ],
      [
        "Safety",
        "She is not alone overnight in the house with the husband, there are no private financial arrangements, and a wife may say she is uncomfortable without being told she is jealous"
      ],
      [
        "A young relative",
        "She is a child in your care before she is a pair of hands: she goes to school, she has rest, and one day her mother will ask you what became of her"
      ]
    ]),
    callout("tip", "Learn the work of your own home before you hire it out. A household where nobody knows how the work is done is a household that stops the day the helper leaves, and two adults who cannot run their own home are hostage to whoever can."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Is anyone living with us, or likely to, whom we have never properly agreed on together?",
      "If there is help in our home, have we settled the five standards?",
      "What would our children learn about human worth from how we treat the people who serve us?"
    ]),
    divider(),
  ],
};

// ─── Carrying Two Families ───
const section7 = {
  section_number: 7,
  title: "Carrying Two Families",
  blocks: [
    heading(2, "Section 7 — Carrying Two Families"),
    image("/images/marriage/module-8/MM8-3.png", "A young African husband and wife sit at a dining table in soft morning light with a calendar open between them. He writes on it while she points to a date, with a phone and a wrapped gift beside them. The writing on the calendar is too small to read."),
    paragraph("Ask most couples who writes the get-well message, who remembers the birthdays, who proposes that you cook food and go and sit with the bereaved, and the honest answer is that nobody decided. It landed on the wife, it stays there for forty years, and the family credits her husband for it. Decide it instead, in writing."),
    table([
      "Agree",
      "How"
    ], [
      [
        "One calendar for both families",
        "Birthdays, anniversaries, memorials, and the anniversary of a death, which in our culture can matter as much as a birthday. Both of you can see it; both of you write in it."
      ],
      [
        "Each of you owns your own blood",
        "He calls his mother; she calls hers. No one outsources being a good son or daughter to their spouse."
      ],
      [
        "What your household does when there is a death",
        "In the first hours, the first week, at the funeral, and three months later when the crowd has gone home and the widow is alone. The visit nobody makes is the one remembered longest."
      ],
      [
        "How your home receives people",
        "How often, whether guests may come unannounced, and the minimum anyone who knocks will receive, whatever your mood."
      ]
    ]),
    paragraph("Keep a visitor shelf in the house: drinks, biscuits, something that can be put in front of a guest in ninety seconds. And lower your standard so that the door can actually open. Most homes are inhospitable not because people are unkind, but because they believe hosting requires a feast, and so they never host at all. Tea and bread offered warmly in a swept room has fed more real fellowship on this continent than every elaborate spread ever laid."),
    callout("note", "If one of you is not naturally a people person, settle it now. That spouse is usually not cold; company simply costs them more. Agree a rhythm rather than a mood, agree that nobody is brought home without a call first, and agree an hour when the one who tires may withdraw."),
    divider(),
  ],
};

// ─── A Word to Parents ───
const section8 = {
  section_number: 8,
  title: "A Word to Parents",
  blocks: [
    heading(2, "Section 8 — A Word to Parents"),
    paragraph("Parents and older relatives read these lessons too, so this section is for you. When your son or daughter marries, something real happens to your household as well as to theirs. Their new home becomes the immediate family, and yours becomes the extended one. That is not a demotion and not a rejection. It is the design, and you did it to your own parents."),
    pullQuote("The sentence that ruins so many young marriages is \"that is not how we do things in this family\". The gentle answer is that they are no longer only in your family. They have started one."),
    paragraph("Fathers, a moment is coming for some of you at the front of a church when you will place your daughter's hand into the hand of another man. Understand what you are and are not doing. You are not handing over a possession; she is a daughter of God and was never property. What you release is first place. From that day you are no longer the man she consults first, and your counsel will be given when it is asked for. That is a real loss, and it is also obedience, and it is the making of her marriage."),
    table([
      "How to be a gift to your children's marriage",
      "Why it matters"
    ], [
      [
        "Give counsel when it is asked for, and then let them decide",
        "Like Jethro: offer, then release"
      ],
      [
        "Speak well of your son-in-law or daughter-in-law, especially in their absence",
        "Your words shape how the whole family treats them"
      ],
      [
        "Never ask one spouse to keep a secret from the other",
        "You would be asking them to break their covenant for you"
      ],
      [
        "Ask before you visit, and before you send anyone to live with them",
        "Their home is theirs to open"
      ],
      [
        "Pray for their marriage by name",
        "It is the greatest gift you can give them, and it costs nothing"
      ]
    ]),
    divider(),
  ],
};

// ─── When Family Becomes Harm ───
const section9 = {
  section_number: 9,
  title: "When Family Becomes Harm",
  blocks: [
    heading(2, "Section 9 — When Family Becomes Harm"),
    paragraph("Everything so far assumes families of goodwill, who overstep in the ordinary ways families do. But in some homes, relatives do more than interfere. A mother-in-law who rules the daughter-in-law's kitchen and body. An uncle who summons a family council to judge a wife. Relatives who demand that she obey them as she would her husband, or who blame her alone when children do not come."),
    callout("warning", "Submission in marriage never transfers to in-laws, uncles or a family council. A wife's covenant is with her husband, under God. No relative inherits authority over her by marrying into her life."),
    paragraph("And if you are in danger in your marriage, you may hear particular pressures from family. You may be told that leaving means the bride price must be refunded, and that your family cannot pay it, so you cannot go. Before you let that decide your life, take proper legal advice: a bride-price refund is a customary expectation, not an automatic legal debt, and what relatives assert about it may simply not be the law. You may be told to think of what people will say. People will say a great deal for a season, and then they will say something else about somebody else, and you will still have your life."),
    table([
      "If family involvement has become harm",
      "What to do"
    ], [
      [
        "Tell one person outside the family this week",
        "A pastor, a trained counsellor, or a mature woman who can keep a confidence and will not go and confront anyone without your agreement."
      ],
      [
        "Do not try to resolve it in a family meeting first",
        "When there is control or violence, a gathering of relatives can become a court where the weaker person is judged. Seek help alone first."
      ],
      [
        "Safety comes before reputation",
        "Getting out of reach of harm is immediate and protective, and it decides nothing yet about the future of the marriage."
      ],
      [
        "Pastors: see the person alone, and believe them",
        "Do not put the two of them in a room together and mediate where there is violence. It can endanger the one being harmed."
      ]
    ]),
    callout("warning", "Nothing in this track, not honour, not submission, not covenant, has ever been a reason to stay where you are being harmed. If you are afraid, speak to a trusted pastor or counsellor this week. If you are in danger, contact your local emergency services."),
    divider(),
  ],
};

// ─── Two Families, One Home ───
const section10 = {
  section_number: 10,
  title: "Two Families, One Home",
  blocks: [
    heading(2, "Two Families, One Home"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate how ready you are to practise each one."),
    scorecard("Two Families, One Home", "marriage_module8_family", [
      {
        "key": "leaving",
        "max": 10,
        "label": "Decisions about our household are settled by the two of us, not by my family",
        "helpText": "Whose word ended the last big discussion?"
      },
      {
        "key": "honour",
        "max": 10,
        "label": "I honour my parents generously, from inside the wall of my marriage",
        "helpText": "When did I last show them gratitude?"
      },
      {
        "key": "hold",
        "max": 10,
        "label": "I hold what we agree, even when family pressure comes",
        "helpText": "Has a decision ever reversed after a phone call?"
      },
      {
        "key": "own",
        "max": 10,
        "label": "I speak to my own family myself and never send my partner",
        "helpText": "Who delivered the last hard message?"
      },
      {
        "key": "defend",
        "max": 10,
        "label": "I never complain about my partner to my family, and I defend them in their absence",
        "helpText": "What does my family believe about my partner?"
      },
      {
        "key": "house",
        "max": 10,
        "label": "Everyone who lives in our home is there by our joint agreement, with clear terms",
        "helpText": "Have we said how long?"
      },
      {
        "key": "carry",
        "max": 10,
        "label": "The care of both families is shared fairly between us",
        "helpText": "Who remembers the birthdays and visits the bereaved?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the family conversation to have first, this week, between the two of you before anyone else."),
    divider(),
  ],
};

// ─── Module 8 Assignment — Build the Wall, Open the Gate ───
const section11 = {
  section_number: 11,
  title: "Module 8 Assignment — Build the Wall, Open the Gate",
  blocks: [
    heading(2, "Module 8 Assignment — Build the Wall, Open the Gate"),
    assignmentPrompt({
      "title": "Module 8 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If family involvement in your relationship has become control, threats or harm, skip Prompts 2 and 3 and speak to a trusted pastor or counsellor on your own first.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "Have I Left?",
          "guidance": "Using the test in Section 1, describe whose voice settles decisions about your household today. Name one way you have truly left your father and mother, and one way you have not yet left. Single: describe what leaving well would look like for you and your family."
        },
        {
          "number": 2,
          "heading": "Our Family Map",
          "guidance": "Courting, engaged or married: complete the tension checklist in Section 2 with your partner. For the two areas with the most heat, write the boundary you will keep, the honour you will show, and the sentence you will both say to your families. Single: complete it for your own family and imagine a future spouse beside you."
        },
        {
          "number": 3,
          "heading": "The Next Phone Call",
          "guidance": "Describe a family request or pressure you expect in the next year: a visit, a relative who may move in, money, a ceremony, children. Write exactly how the two of you will handle it, using the three habits in Section 3 and the rule about who lives in your house.",
          "example": "Example: \"If my brother asks to stay with us while he looks for work, I will say we will discuss it and come back to him. If we agree, we will agree for three months, and I will tell him so myself.\""
        },
        {
          "number": 4,
          "heading": "A Sentence Your In-Laws Would Love to Read",
          "guidance": "Write to your partner (or, if single, to a future spouse): \"What I already appreciate about your family is... and one thing I commit to, in honouring them, is...\" If you are courting or married, share it with your partner this week."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Family & In-Laws", [
      {
        "id": "q1",
        "prompt": "According to this module, what is leaving your father and mother?",
        "options": [
          {
            "id": "a",
            "text": "Moving far away from your parents"
          },
          {
            "id": "b",
            "text": "A transfer of authority, not a withdrawal of honour"
          },
          {
            "id": "c",
            "text": "No longer helping your parents"
          },
          {
            "id": "d",
            "text": "Something only men must do"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: you still honour your parents; what changes is whose voice settles matters in your home."
      },
      {
        "id": "q2",
        "prompt": "What is the simple test of whether you have left?",
        "options": [
          {
            "id": "a",
            "text": "How far away you live"
          },
          {
            "id": "b",
            "text": "How often you visit"
          },
          {
            "id": "c",
            "text": "Whose word ends the discussion on a decision about your household"
          },
          {
            "id": "d",
            "text": "Whether you still send money home"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 1: if the answer is your mother, you have not yet left, whatever your address."
      },
      {
        "id": "q3",
        "prompt": "What does a wife learn when a decision is reversed after a phone call from home?",
        "options": [
          {
            "id": "a",
            "text": "That her husband honours his parents"
          },
          {
            "id": "b",
            "text": "That agreements with her husband are provisional, and she is the one safe to disappoint"
          },
          {
            "id": "c",
            "text": "Nothing important"
          },
          {
            "id": "d",
            "text": "That she should call her own mother"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: there is a higher court she cannot appear in."
      },
      {
        "id": "q4",
        "prompt": "Which sentence does the module recommend for any family request that arrives without warning?",
        "options": [
          {
            "id": "a",
            "text": "\"Ask my wife.\""
          },
          {
            "id": "b",
            "text": "\"Yes, of course.\""
          },
          {
            "id": "c",
            "text": "\"We will discuss it and come back to you.\""
          },
          {
            "id": "d",
            "text": "\"My husband will not allow it.\""
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 3: it honours the person asking and protects the two of you."
      },
      {
        "id": "q5",
        "prompt": "Why should you never complain about your spouse to your family?",
        "options": [
          {
            "id": "a",
            "text": "It is rude"
          },
          {
            "id": "b",
            "text": "You will forgive your spouse, but your family often will not"
          },
          {
            "id": "c",
            "text": "Families never give advice"
          },
          {
            "id": "d",
            "text": "It is only a problem for wives"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: honour your families from inside the wall, never through holes in it."
      },
      {
        "id": "q6",
        "prompt": "What did Terri Orbuch's long-term study find about husbands who were close to their wife's parents?",
        "options": [
          {
            "id": "a",
            "text": "Their risk of divorce was about 20 per cent lower"
          },
          {
            "id": "b",
            "text": "It made no difference"
          },
          {
            "id": "c",
            "text": "Their risk of divorce was higher"
          },
          {
            "id": "d",
            "text": "They argued more with their wives"
          }
        ],
        "correct_option_id": "a",
        "explanation": "Section 5: husbands, draw near to your wife's family. Wives, keep agreed boundaries even with in-laws you love."
      },
      {
        "id": "q7",
        "prompt": "What is the rule that protects who lives in your home?",
        "options": [
          {
            "id": "a",
            "text": "Relatives may always stay as long as they need"
          },
          {
            "id": "b",
            "text": "The husband decides alone"
          },
          {
            "id": "c",
            "text": "No one moves in unless both of you agree, and agree for how long"
          },
          {
            "id": "d",
            "text": "Only the wife's relatives may stay"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 6: say the \"how long\" aloud at the time, because nobody can say it later."
      },
      {
        "id": "q8",
        "prompt": "Does a wife's submission in marriage transfer to her in-laws or a family council?",
        "options": [
          {
            "id": "a",
            "text": "Yes, to her husband's parents"
          },
          {
            "id": "b",
            "text": "Yes, to the eldest uncle"
          },
          {
            "id": "c",
            "text": "Only after children are born"
          },
          {
            "id": "d",
            "text": "No, never"
          }
        ],
        "correct_option_id": "d",
        "explanation": "Section 9: her covenant is with her husband, under God. No relative inherits authority over her."
      }
    ]),
    divider(),
  ],
};

// ─── Module 8 Complete ───
const section12 = {
  section_number: 12,
  title: "Module 8 Complete",
  blocks: [
    heading(2, "Module 8 Complete"),
    image("/images/marriage/module-8/MM8-4.png", "A large African family of three generations gathers around a long outdoor table for a Sunday meal under a mango tree, with a young married couple seated side by side and the grandparents smiling beside them. No readable text appears in the image."),
    videoPlaceholder("2-3 min closing from Denis and Arit: how they learned to leave well while honouring both families, one family moment they handled badly and what they learned, and a prayer for couples caught between two households."),
    paragraph("You have learned that leaving is a transfer of authority and not a withdrawal of honour, examined the household you are marrying into, learned to hold a decision when the phone call from home comes, agreed how to honour your families from inside the wall, looked honestly at in-law relationships, settled who may live in your home, shared the work of carrying two families, and learned what to do when family involvement becomes harm."),
    paragraph("Module 9 turns to the most private part of your covenant: the body, desire and sex, and how to talk honestly about what neither of you has yet said."),
    callout("info", "Next: Module 9 — Sex & Body. Before you begin, finish your assignment, and agree with your partner the sentence you will both use the next time a family request arrives without warning."),
  ],
};

// ─── Assemble ───

const module8 = {
  module_number: 8,
  slug: "family-and-in-laws",
  title: "Family & In-Laws",
  subtitle: "Leaving Without Dishonour, the Phone Call From Home, Who Lives in Your House, and Carrying Two Families",
  track_slug: "marriage",
  pillar: "partnership-roles",
  pillar_id: "00000000-0000-0000-0002-000000000013",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 110,
  sort_order: 8,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12],
};

const total = module8.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 8 — "${module8.title}"`);
module8.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module8_marriage.json", JSON.stringify(module8, null, 2));
console.log("\nWritten to module8_marriage.json");
