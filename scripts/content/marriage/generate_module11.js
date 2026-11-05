// Marriage Module 11 — "From Courtship to Covenant"
// Ported on 2026-11-05 from build_module11_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module11.js
//
// Writes module11_marriage.json to the current directory.
//
// No edits from the authored source. Its privacy wording already says the partner cannot
// see the reflections, ratings and assignment. Video check on 2026-11-05: the Ryan and Selena
// Frederick video is on Focus on the Family's channel, 24:14 long, first aired 7 April 2022.

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
// public/images/marriage/module-11/MM11-1..4.png.
const imagePlaceholder = (ref, brief) => callout("note", `[IMAGE PLACEHOLDER — ${ref}] ${brief}`);
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "From Courtship to Covenant"),
    paragraph("Module 11 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis and Arit: why so many couples plan a wedding for a year and a marriage for an afternoon, the habits and traditions they built in their own home, and why prayer is the nail that holds every other plank in place."),
    callout("info", "Who this is for: Everyone on this track. Courting and engaged couples will build the habits and traditions of their future home before the wedding, when it is easiest. Married couples will find a way to rebuild what drifted. Single readers will learn what to look for, and what to practise already in their own life."),
    callout("info", "Core promise: By the end of this module you will know how to prepare a marriage and not only a wedding, how to bring two family cultures into one home, how to set shared goals, which ordinary habits and chosen traditions keep a marriage alive, how to pray together in a way that lasts, and where the limits of covenant lie when a home becomes unsafe."),
    callout("info", "Time commitment: About 80 minutes of reading and reflection, plus 30 minutes for the assignment. Several sections end with something to do together this week; doing them is the real work of this module."),
    divider(),
  ],
};

// ─── Plan the Marriage, Not Only the Wedding ───
const section1 = {
  section_number: 1,
  title: "Plan the Marriage, Not Only the Wedding",
  blocks: [
    heading(2, "Section 1 — Plan the Marriage, Not Only the Wedding"),
    imagePlaceholder("MM11-1", "Content: A young African engaged couple at a kitchen table in the evening, wedding fabric samples and invitation cards pushed to one side, the two of them leaning together over one notebook, writing and smiling. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Watch an engaged couple in the months before their wedding and you will see two full-time project managers. The hall, the outfits, the caterers, the colours, the invitations, the programme, the photographer: months of meetings, budgets and rehearsals for a celebration that will be over in a day. Now ask how much deliberate planning has gone into the marriage that day begins. For many couples the honest answer is almost none."),
    pullQuote("They rehearse the procession and never rehearse a disagreement. They choose the cake and never build a budget."),
    callout("scripture", "\"Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock. The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock.\" — Matthew 7:24–25"),
    paragraph("Notice what Jesus says about the two houses: the storm came to both. The wise builder was not spared the rain; he simply built for it. That is what this module is about. Earlier modules gave you the deep skills: communication and conflict (Module 5), money (Module 7), intimacy (Module 9). This module gives you the structure that holds them together: shared expectations, shared goals, daily habits, chosen traditions and a praying life."),
    table([
      "Wedding planning",
      "Marriage planning"
    ], [
      [
        "Choose the hall",
        "Choose where and how you will talk each day"
      ],
      [
        "Rehearse the procession",
        "Rehearse a disagreement, using the steps from Module 5"
      ],
      [
        "Budget for one day",
        "Budget for every month after it (Module 7)"
      ],
      [
        "Print the programme",
        "Write your goals for five, ten and twenty-five years"
      ],
      [
        "Plan the reception menu",
        "Decide how many meals a week you will eat together at a table"
      ],
      [
        "Book the photographer",
        "Book a mentor couple you will meet with in your first year"
      ]
    ]),
    callout("tip", "If you are engaged, count it honestly this week: how many hours have you spent planning the wedding, and how many preparing the marriage?"),
    divider(),
  ],
};

// ─── Two Normals Under One Roof ───
const section2 = {
  section_number: 2,
  title: "Two Normals Under One Roof",
  blocks: [
    heading(2, "Section 2 — Two Normals Under One Roof"),
    paragraph("Every married person makes the same discovery, usually with a shock: some of your deepest assumptions about life are not universal. You assumed every family eats dinner together at a table; your spouse assumed people eat when they are hungry. You assumed relatives visit every weekend; they assumed twice a year. Neither of you ever said these things aloud, because each of you thought they were simply normal."),
    pullQuote("Marriage is the merging of two \"normals\": two family cultures, two sets of unspoken rules, moving into one house."),
    heading(3, "If His Father Had Married Her Mother"),
    paragraph("Here is a question I love to put to an engaged couple, half joking. Imagine, just for a moment, that his father had married her mother. What would that marriage have been like? Where would they have clashed: over money, over visitors, over how loudly a disagreement may be conducted, over who cooks and who decides? The couple usually laughs, and then goes quiet, because in that imaginary marriage they have suddenly seen something real: their own two inherited normals standing face to face."),
    paragraph("You are not marrying only a person. You are marrying the household that formed them, and they are marrying yours. So name what each of you inherited, keep what is godly, and consciously lay down the rest before the two households collide in your kitchen."),
    table([
      "Put the unspoken rules on the table",
      "Questions to ask each other"
    ], [
      [
        "Meals and food",
        "Do we eat together? Who cooks? Who clears? What happens when one of us is late?"
      ],
      [
        "Visitors and hospitality",
        "Who may visit, how often, for how long, and without warning?"
      ],
      [
        "Rest and Sundays",
        "What does a day off look like? What happens on Sunday after church?"
      ],
      [
        "Noise and disagreement",
        "Were voices raised in your home? Was conflict aired or buried?"
      ],
      [
        "Spending and giving",
        "Was money discussed openly? Who decided? How was giving to God handled?"
      ],
      [
        "Spiritual life at home",
        "Did your parents pray together? Was there a family altar? Who led it?"
      ],
      [
        "Celebrations",
        "How were birthdays, Christmas, New Year and anniversaries marked, if at all?"
      ]
    ]),
    callout("info", "Nothing is too small to discuss. The small things are exactly where the hidden assumptions live."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "If my father had married my partner's mother (or my mother my partner's father), where would they have clashed first?",
      "Which habit from the home that raised me do I most need to keep, and which must I consciously lay down?",
      "Which of the seven areas in the table have we never discussed?"
    ]),
    divider(),
  ],
};

// ─── Me Becomes We ───
const section3 = {
  section_number: 3,
  title: "Me Becomes We",
  blocks: [
    heading(2, "Section 3 — Me Becomes We"),
    paragraph("The single greatest adjustment of marriage is grammatical: the pronoun changes. Your future is no longer a private project. Where you live, what you build, how you spend your years: all of it now passes through another heart."),
    callout("scripture", "\"Do two walk together unless they have agreed to do so?\" — Amos 3:3"),
    paragraph("So sit down together and dream aloud. Where do we want to be in five years, ten, twenty-five? What are we building: which home, which ministry, which education, which impact on our families and our community? Write the goals down, and then read them again together every year. A couple pulling toward the same horizon does not drift apart. Drift is what happens to couples who never chose a horizon at all."),
    pullQuote("Two visions, one mission. Drift is what happens to couples who never chose a horizon."),
    table([
      "Write a goal in each area",
      "In 5 years",
      "In 10 years",
      "In 25 years"
    ], [
      [
        "Our walk with God",
        "",
        "",
        ""
      ],
      [
        "Our home and where we live",
        "",
        "",
        ""
      ],
      [
        "Work, business and education",
        "",
        "",
        ""
      ],
      [
        "Money: debt, saving, giving",
        "",
        "",
        ""
      ],
      [
        "Children and family",
        "",
        "",
        ""
      ],
      [
        "Ministry and service",
        "",
        "",
        ""
      ],
      [
        "Our friendship and health",
        "",
        "",
        ""
      ]
    ]),
    callout("tip", "Choose one date every year, perhaps your wedding anniversary or the first week of January, to take out the page and review it together: what God has done, what changed, and what you will aim for next."),
    divider(),
  ],
};

// ─── A Marriage Is Made of Tuesdays ───
const section4 = {
  section_number: 4,
  title: "A Marriage Is Made of Tuesdays",
  blocks: [
    heading(2, "Section 4 — A Marriage Is Made of Tuesdays"),
    paragraph("A marriage is not made of anniversaries. It is made of Tuesdays: the ordinary evenings, the ordinary meals, the ordinary greetings at the door. The habits you choose in the first months will quietly become the shape of your life together, so choose them deliberately before the concrete of routine sets without you."),
    pullQuote("A marriage is not made of anniversaries. It is made of Tuesdays."),
    heading(3, "Protect Time That Belongs Only to the Two of You"),
    paragraph("In 2012 the sociologists W. Bradford Wilcox and Jeffrey Dew of the National Marriage Project at the University of Virginia published a report called The Date Night Opportunity. Husbands and wives who spent one-on-one time with their spouse at least once a week were about three and a half times more likely to say they were very happy in their marriage than those who did not. Couples who protected regular time together also reported better communication, greater commitment and a more satisfying intimate life."),
    callout("info", "It does not need to cost money. A walk in the evening, tea on the veranda after the children sleep, a long drive with the radio off: what matters is that it is regular, protected like an appointment with a king, and belongs to the two of you alone."),
    table([
      "Daily",
      "Weekly",
      "Yearly"
    ], [
      [
        "Ten unhurried minutes of conversation, phones away",
        "One protected time together, guarded like an appointment",
        "A review of your goals and your marriage, perhaps on your anniversary"
      ],
      [
        "A warm greeting at the door, not a shout from another room",
        "Three or more meals together at a table",
        "A few days away together, even simply, without the children"
      ],
      [
        "A specific thank-you for one small kindness",
        "Worship together, and talk about it afterwards",
        "A visit with your mentor couple"
      ],
      [
        "Prayer together, even four minutes (Section 6)",
        "One shared task done side by side",
        "Renew one tradition and start a new one"
      ]
    ]),
    heading(3, "Set the Table Before You Need To"),
    paragraph("Something happens at a table that happens nowhere else in a house. People face each other, nobody is walking past, and the food between you means somebody prepared it and everybody knows it. In many homes it is being lost: food is collected from the pot and carried away, one person to a screen, one to a bedroom, one standing in the kitchen. Everybody has eaten; nobody has dined. Then ten years later two people wonder why they are strangers sharing a house."),
    table([
      "Set the table",
      "How"
    ], [
      [
        "Decide how many meals a week you will share",
        "Even three a week, facing each other, is a strong start"
      ],
      [
        "Leave the phones away",
        "Not on the table, and not face down beside the plate"
      ],
      [
        "Say grace, and not always the same person",
        "Thanksgiving is a habit worth sharing"
      ],
      [
        "Lay it properly, even for two",
        "A cloth, plates set down before people sit, water on the table. It costs nothing and says: you are worth an occasion"
      ],
      [
        "Keep a plate for whoever is late",
        "A wordless way of saying: this household waits for you"
      ],
      [
        "Share the work",
        "Both set and both clear. If one cooks, the other clears"
      ]
    ]),
    callout("note", "A word to young wives, and to the husbands who love them: no wife should have to ask every evening whether the table needs dressing. Agree the rhythm once, together, and then both of you simply keep it. A home is not built on one person asking permission to serve."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "What are the Tuesdays of our relationship actually made of right now?",
      "When did we last spend time together that belonged only to the two of us?",
      "Which one daily habit will we begin this week?"
    ]),
    divider(),
  ],
};

// ─── Traditions: Giving Your Home a Personality ───
const section5 = {
  section_number: 5,
  title: "Traditions: Giving Your Home a Personality",
  blocks: [
    heading(2, "Section 5 — Traditions: Giving Your Home a Personality"),
    imagePlaceholder("MM11-2", "Content: A young African husband and wife laughing together as they lay a festive table for a holiday meal in their home, a decorated Christmas tree and paper lanterns behind them, warm evening light. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Habits keep a marriage healthy. Traditions give it a personality. Your two families each arrive with their own: how Christmas is kept, how a birthday is marked, who hosts the New Year, what happens when a child is born or a loved one dies. Learn each other's traditions with curiosity, honour what is worth honouring, and then do something many couples never do: choose your own."),
    pullQuote("Habits keep a marriage healthy. Traditions give it a personality. Both are chosen, not inherited."),
    table([
      "Traditions couples choose",
      "What it builds"
    ], [
      [
        "A feast you always host, for family, neighbours or the lonely",
        "A home known for its open door"
      ],
      [
        "How you keep Christmas and Easter",
        "A faith your children can see, smell and remember"
      ],
      [
        "Birthdays with a spoken blessing, not only a cake",
        "Each person hears what God and their family see in them"
      ],
      [
        "First-fruits: thanking God together for the first salary, the first harvest, the new year",
        "A household that remembers who provides"
      ],
      [
        "A family night each week",
        "Children who know there is always a time when everyone is present"
      ],
      [
        "Your anniversary, marked the same way every year",
        "A shared story you keep retelling"
      ],
      [
        "Remembering those who have died, on their day",
        "Honour for the generations that carried you"
      ]
    ]),
    callout("tip", "Traditions do not need money, only intention. Some of the most treasured are the simplest: the same song every Christmas morning, the same walk every anniversary, the same prayer at every birthday."),
    callout("note", "In the first year, expect at least one collision of traditions: whose family you visit at Christmas, which customs are kept at a naming ceremony, what is expected of you at a funeral. Decide these together, in advance, and present your decision to both families as one voice. Module 8 gives you the tools."),
    divider(),
  ],
};

// ─── A Cord of Three Strands ───
const section6 = {
  section_number: 6,
  title: "A Cord of Three Strands",
  blocks: [
    heading(2, "Section 6 — A Cord of Three Strands"),
    imagePlaceholder("MM11-3", "Content: An African husband and wife sitting side by side at a small table in a bright room in the early morning, holding hands with heads bowed in prayer, an open Bible and two cups of tea in front of them. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    callout("scripture", "\"Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.\" — Ecclesiastes 4:12"),
    paragraph("Picture a triangle: God at the top, husband and wife at the two lower corners. As each of you climbs toward God, the distance between you narrows on its own. You cannot draw near to Him without drawing nearer to each other. Every commitment in this module is a plank; prayer is the nails."),
    heading(3, "Why So Few Couples Actually Do It"),
    paragraph("Ask a hundred Christian couples whether they pray together, and nearly all will say yes. Ask when the two of them last prayed alone, out loud, about their own life (not grace over food, not a church service), and the room goes quiet. Something is stopping us, and a method will not survive an obstacle nobody has named."),
    table([
      "What stops couples praying",
      "What is really happening"
    ], [
      [
        "Shame",
        "You cannot pray honestly beside someone you are hiding something from. If prayer between you has quietly stopped, ask first whether something is not being said."
      ],
      [
        "Performance",
        "One prays with more words and confidence. The other hears their own prayer as thin beside it, feels judged, and quietly stops."
      ],
      [
        "Unresolved anger",
        "You cannot pray honestly with someone you are angry with. Many couples choose a third way: they simply stop praying."
      ],
      [
        "Prayer used as a weapon",
        "\"Lord, help him to see that he is being unreasonable.\" The most damaging of all (see below)."
      ],
      [
        "Nobody taught us",
        "Many of us never once saw our parents pray together, alone, as a couple. You cannot easily do what you have never seen."
      ],
      [
        "A man afraid of leading badly",
        "He believes he should lead spiritually, does not feel able, and avoids the place where the gap would show. It looks like indifference. It rarely is."
      ]
    ]),
    heading(3, "How to Actually Do It"),
    table([
      "Practice",
      "Why it works"
    ], [
      [
        "Four minutes, not thirty",
        "Brief and daily outlasts long and occasional. Four minutes is short enough that neither of you can dread it."
      ],
      [
        "Anchor it to something already fixed",
        "After the last meal, when the door is locked, or before you part in the morning. A habit with no anchor gets eaten by everyone else's needs."
      ],
      [
        "Let the shorter prayer set the length",
        "If one prays eight minutes and the other forty seconds, the one praying forty seconds will soon stop. The sustainable prayer is the better one."
      ],
      [
        "Pray for each other in each other's hearing",
        "Something happens in a person who hears the one they love carry their name to God."
      ],
      [
        "When you have no words, pray Scripture",
        "Open a psalm and read it to God as your own. Most people who say they cannot pray mean only that they cannot compose."
      ],
      [
        "When you are angry, pray badly rather than not at all",
        "Thirty stiff, honest seconds is worth more than a beautiful prayer skipped. If you truly cannot, say \"not tonight, but tomorrow\" rather than letting it lapse."
      ]
    ]),
    callout("warning", "One rule protects all the others: never pray at the person beside you. Never say anything to God about them, in their hearing, that you have not already said to their face. \"Lord, help him to be less careless with money\" is not a prayer. It is a rebuke with an audience of one, delivered in the only place where it cannot be answered."),
    callout("note", "Courting and engaged couples: begin now, and guard it. Pray sitting up, in a lit room, at a reasonable hour, never lying down together in a private place. Prayer in this season will also show you things months of courtship had hidden, and occasionally the thing that means you should not marry. Both are mercies."),
    heading(3, "What the Research Found"),
    paragraph("Praying for your partner is one of the few spiritual practices that has been studied carefully. The psychologist Frank Fincham and his colleagues have worked on it for many years. In 2010 the Journal of Personality and Social Psychology published their finding that people who prayed for their partner were less likely to be unfaithful over time, in thought or in action. In the same year Psychological Science published two experiments led by Nathaniel Lambert: people asked to pray for their partner's well-being became more willing to forgive them, and those who prayed daily for four weeks grew in selfless concern for others, which in turn made them more forgiving."),
    callout("info", "We do not pray because it works. We pray because we belong to God. But it is worth knowing that it is very hard to hold a grievance while asking God to bless the person you are holding it against. The two will not sit together for long."),
    paragraph("Ryan and Selena Frederick, the couple behind Fierce Marriage, talk with Focus on the Family about why prayer in marriage is humbling, what gets in the way (busyness, pride and self-reliance), and simple ways to begin: praying for your spouse from head to toe, praying Scripture, and pushing through the awkwardness by holding hands or facing each other."),
    videoEmbed("t7BSJvoKGKc", "Making Prayer a Priority in Your Marriage | Ryan & Selena Frederick | Focus on the Family"),
    callout("tip", "As you listen, note one roadblock that sounds like your home and one practice you will try this week."),
    heading(3, "To the One Whose Partner Will Not Pray"),
    paragraph("Do not nag, do not sigh, and do not compare them with the brother who prays beautifully at the prayer meeting. Nobody has ever been shamed into a life of prayer; a person pressured into it will perform it and resent it. Invite once, warmly, and say exactly what you are asking: four minutes, and you do not have to be good at it. Then keep your own life with God warm, and pray for them every day without announcing it."),
    callout("note", "Brother, hear the other half. She is not asking you to preach, and she is not grading your vocabulary. She is asking you to sit beside her for four minutes and speak to God about your own life in her hearing. If you do not know how to begin, begin with \"Lord, thank you for today\" and stop when you run out. That is a prayer. Do it again tomorrow, and in a year you will not recognise your own home."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "When did we last pray together, alone and out loud, about our own life?",
      "Which of the six obstacles is ours?",
      "Have I ever prayed at my partner instead of for them? What do I need to say to their face instead?"
    ]),
    divider(),
  ],
};

// ─── Keep Learning Together ───
const section7 = {
  section_number: 7,
  title: "Keep Learning Together",
  blocks: [
    heading(2, "Section 7 — Keep Learning Together"),
    paragraph("Most couples look for help only after the problems have arrived. They learn to bail water while the boat is sinking. Wisdom learns to sail before leaving the harbour. Module 0 showed you what the research says about couples who prepare; this section is about the habit of continuing to learn after the wedding."),
    table([
      "Keep learning",
      "How"
    ], [
      [
        "Get trained before the storm",
        "Take a marriage preparation course through your church or a proven programme, and sit under premarital counselling with your pastor or a trained counsellor. The Let's Talk Premarital Course journal turns these modules into questions you answer separately and then compare."
      ],
      [
        "Read together",
        "Keep a small shelf of good marriage books and read them together: a chapter a week, then talk about it over a meal. A couple who study together before the wedding have the habit of learning together after it."
      ],
      [
        "Walk with a mentor couple",
        "A couple further down the road whom you meet with regularly, especially in your first year, and who are allowed to ask you hard questions."
      ],
      [
        "Review your marriage every year",
        "On your anniversary, ask: what is going well, what has drifted, what have we not talked about, and what will we build next?"
      ]
    ]),
    pullQuote("What you learn in peacetime, you will use in the storm."),
    divider(),
  ],
};

// ─── A Covenant Is Not a Cage ───
const section8 = {
  section_number: 8,
  title: "A Covenant Is Not a Cage",
  blocks: [
    heading(2, "Section 8 — A Covenant Is Not a Cage"),
    paragraph("In Module 5 we asked you to ban the word divorce from your house, so that every conflict becomes a problem to solve rather than an audition for leaving. That teaching is true, and it assumes something: two people of goodwill who hurt each other the way ordinary people do, carelessly and selfishly, and then repentantly. There is another kind of house, and it is not rare. In it one person is not failing the other. One person is harming the other, knows it, and will not stop."),
    callout("warning", "If that is the house you are standing in, nothing in this track is an instruction to stay within reach of harm. Speak to a trusted pastor or counsellor on your own this week, and contact local emergency services if you are in danger."),
    table([
      "Where the teaching stops",
      "Why"
    ], [
      [
        "Repair needs two hands",
        "A torn cloth can be mended. A cloth someone is still cutting cannot. No verse in Scripture commands the victim of ongoing cruelty to remain within its reach."
      ],
      [
        "The ban is on a weapon, not a door",
        "What must leave your home is divorce used as a threat to frighten or to win. A wife describing her situation honestly to a pastor, a doctor, a lawyer or her mother is not breaking the covenant. She is telling the truth about what has already happened to it."
      ]
    ]),
    paragraph("In 2002 the Catholic bishops of the United States, who could never be accused of being casual about the permanence of marriage, revised their pastoral letter on violence in the home, When I Call for Help. It contains three sentences that belong in every Christian home."),
    pullQuote("\"Violence and abuse, not divorce, break up a marriage.\" — When I Call for Help"),
    table([
      "From When I Call for Help",
      "What it means"
    ], [
      [
        "\"Violence and abuse, not divorce, break up a marriage.\"",
        "The covenant is broken by the one doing the harm, not by the one who finally names it."
      ],
      [
        "\"No person is expected to stay in an abusive marriage.\"",
        "Leaving the reach of harm is not rebellion against God."
      ],
      [
        "\"Forgiveness is not permission to repeat the abuse.\"",
        "A victim can forgive and still refuse to return to danger."
      ]
    ]),
    heading(3, "Three Questions We Must Stop Mixing"),
    table([
      "The question",
      "What we teach"
    ], [
      [
        "1. Safety",
        "Getting out of reach of harm, to family or to a safe place with the children, is immediate and protective. It decides nothing about the future of the marriage, and it must never be preached as a step toward divorce."
      ],
      [
        "2. The one doing the harm",
        "The question churches ask is, \"Is she allowed to leave?\" The question they should ask is, \"What are we going to do about him?\" A man who beats his wife is not a marriage problem. He is a man under the discipline of the church, and very often a man who has broken the law."
      ],
      [
        "3. Divorce itself",
        "Faithful Christians have differed on this for centuries. But even careful traditions have spoken. In August 2024 the General Presbytery of the Assemblies of God adopted a position paper stating that \"domestic abuse, whether of the spouse, children, or both, can also constitute a breaking of the marriage covenant.\" Take counsel from your pastor and from someone outside your family who has no stake in keeping the peace."
      ]
    ]),
    callout("warning", "A word to pastors and mentors, including myself. Where there is violence, do not put the two of them in a room together to mediate. It is every pastor's instinct, and it is wrong: she must either lie in front of him or tell the truth and then go home with him. See her alone. Believe her. And resist the urge to protect the reputation of the house."),
    table([
      "What a local church can do",
      "How"
    ], [
      [
        "Name a safe person",
        "A mature woman, named publicly, whose phone is answered"
      ],
      [
        "Keep a short list, checked every year",
        "A woman lawyer, a particular hospital, a family who will open a room, a police contact you trust"
      ],
      [
        "Make sure every woman knows",
        "The name and the list should be known without anyone having to ask"
      ]
    ]),
    pullQuote("A covenant is not a cage. The one who breaks it is the one who raises his hand, not the one who finally says what that hand has been doing."),
    divider(),
  ],
};

// ─── Are We Building a Covenant? ───
const section9 = {
  section_number: 9,
  title: "Are We Building a Covenant?",
  blocks: [
    heading(2, "Are We Building a Covenant?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate the habits you are already practising in your own life."),
    scorecard("Are We Building a Covenant?", "marriage_module11_covenant", [
      {
        "key": "prepare",
        "max": 10,
        "label": "We are putting as much effort into preparing the marriage as the wedding",
        "helpText": "Or did the wedding take every hour?"
      },
      {
        "key": "normals",
        "max": 10,
        "label": "We have named the unspoken rules from both our families and agreed our own",
        "helpText": "Which of the seven areas is still silent?"
      },
      {
        "key": "goals",
        "max": 10,
        "label": "We have written shared goals and know where we are heading together",
        "helpText": "Is there a page, or only a feeling?"
      },
      {
        "key": "habits",
        "max": 10,
        "label": "Our ordinary days include protected time, real conversation and shared meals",
        "helpText": "What are our Tuesdays made of?"
      },
      {
        "key": "traditions",
        "max": 10,
        "label": "We are choosing our own traditions, not only inheriting them",
        "helpText": "Which tradition is ours alone?"
      },
      {
        "key": "prayer",
        "max": 10,
        "label": "We pray together, out loud, about our own life, and never at each other",
        "helpText": "When did we last do it?"
      },
      {
        "key": "learning",
        "max": 10,
        "label": "We keep learning: a mentor couple, a shared book, a yearly review",
        "helpText": "Who is allowed to ask us hard questions?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the habit to begin first, this week. Small and daily will outlast large and occasional."),
    divider(),
  ],
};

// ─── Module 11 Assignment — Our Covenant Plan ───
const section10 = {
  section_number: 10,
  title: "Module 11 Assignment — Our Covenant Plan",
  blocks: [
    heading(2, "Module 11 Assignment — Our Covenant Plan"),
    assignmentPrompt({
      "title": "Module 11 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If you are in a relationship, you may each complete it separately and then compare your answers in person.",
      "word_min": 200,
      "word_max": 800,
      "prompts": [
        {
          "number": 1,
          "heading": "Two Normals",
          "guidance": "Using the table in Section 2, describe three unspoken rules from the home that raised you. For each, write whether you will keep it, change it or lay it down, and why. Courting, engaged or married: note where your partner's normal is different."
        },
        {
          "number": 2,
          "heading": "Our Horizon",
          "guidance": "Write at least one goal for five, ten and twenty-five years in three of the areas from Section 3. Say when, each year, you will review them together. Single: write your own goals, and what you hope a future spouse will share with you."
        },
        {
          "number": 3,
          "heading": "Our Tuesdays and Our Traditions",
          "guidance": "Name the daily, weekly and yearly habits you will keep (Section 4), how many meals a week you will share at a table, and one tradition you will make your own (Section 5).",
          "example": "Example: \"Ten minutes on the veranda every evening without phones, Thursday nights for the two of us, and every birthday begins with each of us speaking a blessing over the one being celebrated.\""
        },
        {
          "number": 4,
          "heading": "Our Prayer Life",
          "guidance": "Write honestly where prayer between you stands, which obstacle from Section 6 is yours, and the anchor and time you will use to begin praying together for four minutes a day. If your partner will not pray, write how you will invite them once, warmly, and how you will pray for them daily."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: From Courtship to Covenant", [
      {
        "id": "q1",
        "prompt": "According to Section 1, what do many engaged couples plan carefully and what do they neglect?",
        "options": [
          {
            "id": "a",
            "text": "They plan the marriage and neglect the wedding"
          },
          {
            "id": "b",
            "text": "They plan the wedding for months and the marriage hardly at all"
          },
          {
            "id": "c",
            "text": "They plan neither"
          },
          {
            "id": "d",
            "text": "They plan both equally"
          }
        ],
        "correct_option_id": "b",
        "explanation": "They rehearse the procession and never rehearse a disagreement."
      },
      {
        "id": "q2",
        "prompt": "What does the module mean by \"two normals\"?",
        "options": [
          {
            "id": "a",
            "text": "Two people with ordinary personalities"
          },
          {
            "id": "b",
            "text": "The two family cultures and unspoken rules each spouse brings into marriage"
          },
          {
            "id": "c",
            "text": "Two wedding ceremonies"
          },
          {
            "id": "d",
            "text": "Two incomes"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 2: name what you inherited, keep what is godly, and lay down the rest."
      },
      {
        "id": "q3",
        "prompt": "Why should a couple write down shared goals and review them every year?",
        "options": [
          {
            "id": "a",
            "text": "To impress their families"
          },
          {
            "id": "b",
            "text": "Because a couple pulling toward the same horizon does not drift apart"
          },
          {
            "id": "c",
            "text": "Because the law requires it"
          },
          {
            "id": "d",
            "text": "So that one spouse can control the other"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: drift is what happens to couples who never chose a horizon."
      },
      {
        "id": "q4",
        "prompt": "What did the National Marriage Project's Date Night Opportunity report find?",
        "options": [
          {
            "id": "a",
            "text": "Couple time makes no difference"
          },
          {
            "id": "b",
            "text": "Spouses with weekly one-on-one time were about three and a half times more likely to say they were very happy"
          },
          {
            "id": "c",
            "text": "Only expensive dates help"
          },
          {
            "id": "d",
            "text": "Couples should spend every evening apart"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: it does not need to cost money, only to be regular and protected."
      },
      {
        "id": "q5",
        "prompt": "According to Section 5, what is the difference between habits and traditions?",
        "options": [
          {
            "id": "a",
            "text": "There is no difference"
          },
          {
            "id": "b",
            "text": "Habits keep a marriage healthy; traditions give it a personality"
          },
          {
            "id": "c",
            "text": "Habits are for husbands and traditions are for wives"
          },
          {
            "id": "d",
            "text": "Traditions must always be inherited"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Both are chosen, not inherited."
      },
      {
        "id": "q6",
        "prompt": "Which practice does Section 6 recommend for praying together?",
        "options": [
          {
            "id": "a",
            "text": "Long prayers once a month"
          },
          {
            "id": "b",
            "text": "Four minutes a day, anchored to something already fixed, with the shorter prayer setting the length"
          },
          {
            "id": "c",
            "text": "Only the husband prays"
          },
          {
            "id": "d",
            "text": "Praying about your partner's faults in their hearing"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Brief and daily outlasts long and occasional."
      },
      {
        "id": "q7",
        "prompt": "What did the Lambert and Fincham studies find about praying for a partner?",
        "options": [
          {
            "id": "a",
            "text": "It made no difference"
          },
          {
            "id": "b",
            "text": "It increased forgiveness, and was linked with less unfaithfulness over time"
          },
          {
            "id": "c",
            "text": "It only helped couples who were already happy"
          },
          {
            "id": "d",
            "text": "It increased conflict"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 6: it is very hard to hold a grievance while asking God to bless the person."
      },
      {
        "id": "q8",
        "prompt": "According to Section 8, what breaks a marriage when there is abuse?",
        "options": [
          {
            "id": "a",
            "text": "The victim who tells the truth about it"
          },
          {
            "id": "b",
            "text": "Violence and abuse, not divorce"
          },
          {
            "id": "c",
            "text": "The pastor who hears it"
          },
          {
            "id": "d",
            "text": "Nothing can break it"
          }
        ],
        "correct_option_id": "b",
        "explanation": "When I Call for Help: the one who breaks the covenant is the one doing the harm."
      }
    ]),
    divider(),
  ],
};

// ─── Module 11 Complete ───
const section11 = {
  section_number: 11,
  title: "Module 11 Complete",
  blocks: [
    heading(2, "Module 11 Complete"),
    imagePlaceholder("MM11-4", "Content: An African couple in their sixties walking arm in arm out of a church after renewing their wedding vows, their grown children and grandchildren on the steps around them clapping and smiling, late-afternoon sun. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1600×900."),
    videoPlaceholder("2-3 min closing from Denis and Arit: the habits and traditions that carried their own marriage, what praying together has meant in their home, and a prayer over every couple building a covenant that lasts."),
    paragraph("You have seen how to prepare a marriage and not only a wedding, brought two family cultures into the open, written goals you will pursue together, chosen the habits that make up your Tuesdays and the traditions that will give your home its personality, learned how to pray together in a way that lasts, and seen where the limits of covenant lie when a home becomes unsafe."),
    paragraph("Module 12, the last in this track, asks you to sit down and count the cost: what covenant will truly ask of you, the one cost you should refuse to pay, and the final tests before you build."),
    callout("info", "Next: Module 12 — Counting the Cost. Before you begin, finish your assignment, and pray together for four minutes at least three times this week."),
  ],
};

// ─── Assemble ───

const module11 = {
  module_number: 11,
  slug: "from-courtship-to-covenant",
  title: "From Courtship to Covenant",
  subtitle: "Planning the Marriage, Not Only the Wedding: Shared Goals, Daily Habits, Chosen Traditions and Praying Together",
  track_slug: "marriage",
  pillar: "growth-legacy",
  pillar_id: "00000000-0000-0000-0002-000000000015",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 110,
  sort_order: 11,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11],
};

const total = module11.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 11 — "${module11.title}"`);
module11.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module11_marriage.json", JSON.stringify(module11, null, 2));
console.log("\nWritten to module11_marriage.json");
