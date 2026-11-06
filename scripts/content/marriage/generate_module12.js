// Marriage Module 12 — "Counting the Cost"
// Ported on 2026-11-06 from build_module12_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module12.js
//
// Writes module12_marriage.json to the current directory.
//
// No edits from the authored source. Its privacy wording already says the partner cannot
// see the reflections, ratings and assignment. This is the last module of the Marriage
// Track. It has no external video; the intro and closing stay as video placeholders.

const fs = require('fs');

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const divider = () => ({ type: "divider", data: {} });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });
const pullQuote = (text) => ({ type: "pull_quote_card", data: { text } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const reflectionQuestions = (title, questions) => ({ type: "reflection_questions", data: { title, questions } });
const scorecard = (title, scorecard_key, items) => ({ type: "scorecard", data: { title, scorecard_key, items } });
const assignmentPrompt = (fields) => ({ type: "assignment_prompt", data: fields });
const quiz = (scope, title, questions) => ({ type: "quiz", data: { scope, title, questions } });

// Images are Denis's, used as delivered, in public/images/marriage/module-12/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Counting the Cost"),
    paragraph("Module 12 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis and Arit: why Jesus commands the counting and never discourages the building, what covenant has cost them and why they would pay it again, and a word to everyone finishing this track."),
    callout("info", "Who this is for: Everyone on this track. Single, courting and engaged readers will count the cost of covenant honestly before they pay it, and take the final tests. Married readers will see again what they signed for, and why it is worth it."),
    callout("info", "Core promise: By the end of this module you will understand what Jesus meant when He shocked His disciples, know the true costs of covenant and the one cost to refuse, face the rivals that quietly starve a marriage, take eight honest tests before you build, and be able to answer the last question of this track: are you ready to build, or ready to wait?"),
    callout("info", "Time commitment: About 80 minutes of reading and reflection, plus 30 minutes for the assignment. This is the last module of the Marriage Track. Give it an unhurried evening."),
    divider(),
  ],
};

// ─── The Teaching That Shocked the Disciples ───
const section1 = {
  section_number: 1,
  title: "The Teaching That Shocked the Disciples",
  blocks: [
    heading(2, "Section 1 — The Teaching That Shocked the Disciples"),
    image("/images/marriage/module-12/MM12-1.png", "A young African man and woman sit side by side under a large tree at sunset, looking thoughtfully toward the horizon over open fields and distant hills. He holds a pen to his chin with a notebook on his knee; an open Bible rests on her lap. No readable text appears in the image."),
    paragraph("Jesus once told the crowds who wanted to follow Him to sit down first and estimate the cost, like a man who wants to build a tower (Luke 14:28–30). Notice that He does not discourage the building. He commands the counting. Module 7 used that verse for your budget. This module uses it for the whole covenant."),
    paragraph("Before we count, listen to the most sobering conversation Jesus ever had about marriage. The Pharisees came to test Him: \"Is it lawful for a man to divorce his wife for any and every reason?\" (Matthew 19:3). They asked about exits. He answered about origins."),
    callout("scripture", "\"Haven't you read that at the beginning the Creator 'made them male and female,' and said, 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh'? So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.\" — Matthew 19:4–6"),
    paragraph("When they pressed Him about Moses, Jesus gave the diagnosis behind every broken covenant since: \"Moses permitted you to divorce your wives because your hearts were hard. But it was not this way from the beginning\" (Matthew 19:8). The disease was never the covenant. The disease was the heart."),
    paragraph("Now watch the disciples. They were grown men from a culture where divorce was easy, and when they heard that marriage binds for life, they did not applaud. They staggered: \"If this is the situation between a husband and wife, it is better not to marry\" (Matthew 19:10). They were shocked, which means they had understood correctly."),
    paragraph("Jesus did not soften it. He said, \"Not everyone can accept this word, but only those to whom it has been given\" (Matthew 19:11). Hold on to that phrase, because it is the doorway of hope in a hard passage. Covenant marriage is not sustained by willpower, chemistry or luck. It requires two things, and you must count both."),
    table(["What covenant requires", "What it means"], [
      [
        "Grace from God",
        "The enabling God gives to those who ask Him: the third strand in the cord, the softening of two hearts that would otherwise harden"
      ],
      [
        "Hard work from you",
        "Daily, deliberate, unglamorous work: the kind every module in this track has been assigning you"
      ]
    ]),
    pullQuote("If your view of marriage has never once made you say, \"Then who can do this?\", you have not yet seen marriage as Jesus sees it."),
    divider(),
  ],
};

// ─── The True Costs of Covenant ───
const section2 = {
  section_number: 2,
  title: "The True Costs of Covenant",
  blocks: [
    heading(2, "Section 2 — The True Costs of Covenant"),
    paragraph("So let us sit down and count. These are not reasons to avoid the altar. They are the price written on the tower, and every couple pays them, whether they counted or not."),
    table(["The cost", "What it means"], [
      [
        "Your independence",
        "On your wedding day, the sovereign nation of You dissolves. Its borders open, its currency merges, its foreign policy is now negotiated. You will never again make a major decision that touches only you. This is the cost modern people resent most."
      ],
      [
        "Your comfort",
        "You will be seen fully, daily, without performance. The selfishness that is easy to hide from friends who go home at night has nowhere to hide from a spouse. Marriage is a mirror that follows you from room to room."
      ],
      [
        "Time and labour, for life",
        "A covenant is not a monument you build once. It is a garden you farm for life. The habits of Module 11 are not a honeymoon programme; they are the permanent farming. The year you stop tending is the year the weeds begin."
      ],
      [
        "\"For worse\"",
        "Somewhere in the decades ahead there is a season of worse, with your names on it: a loss, a diagnosis, a failure, a valley. You are not marrying only the radiant person in front of you. You are marrying them in that valley too."
      ]
    ]),
    pullQuote("The vows are not poetry. They are a cost sheet, and covenant means signing for the whole page."),
    paragraph("Read the vows slowly: for better, for worse; for richer, for poorer; in sickness and in health. They do not promise you the first half of each pair. They bind you through the second."),
    heading(3, "The Other Side of the Ledger"),
    paragraph("Having counted all of that, look at what the tower is worth: a companion for every season, a witness to your whole life, a love that has seen everything and stayed, children raised in safety, old age beside your best friend, and a living picture of Christ and His church (Ephesians 5:31–32). The cost is real. The tower is worth more."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Which of the four costs am I most reluctant to pay, and what does that reluctance tell me?",
      "Have I been counting only the better, the richer and the health?",
      "What on the other side of the ledger do I most long for?"
    ]),
    divider(),
  ],
};

// ─── The Cost to Refuse, and the Cost the Church Must Lower ───
const section3 = {
  section_number: 3,
  title: "The Cost to Refuse, and the Cost the Church Must Lower",
  blocks: [
    heading(2, "Section 3 — The Cost to Refuse, and the Cost the Church Must Lower"),
    paragraph("There is one cost we beg you to refuse. Module 7 named it: the ruinous wedding. The halls, the outfits, the convoys, the crowds that must be fed, ceremony upon ceremony, too often paid for with borrowed money. A couple begins covenant life, where money is already the most dangerous battlefield, carrying a debt they took on to impress people who went home after the party."),
    pullQuote("Do not spend the foundation money on the decoration. The wedding is one day; the marriage must outlive everyone who attended it."),
    paragraph("The research points the same way. In 2014 the economists Andrew Francis and Hugo Mialon of Emory University surveyed more than 3,000 Americans who had ever married. Couples whose weddings cost less than $1,000 had the lowest risk of divorce. Among women, those whose weddings cost more than $20,000 had about 1.6 times the risk of those whose weddings cost $5,000 to $10,000. Interestingly, the risk fell as the number of guests rose, up to about two hundred: what protected couples was not the cost of the day but the community that came to it."),
    callout("info", "This is American data, and it shows a pattern, not a cause. A costly wedding does not doom a marriage. But it should make every couple ask what the money is buying, and who it is really for."),
    heading(3, "When the Tradition Holds the Gate Shut"),
    paragraph("Module 1 promised to return to a question our churches must answer. Across our continent, couples live together for years, sharing a bed, a table and often children, while telling the church: we cannot marry yet; the bride price has not been paid; the families have not finished; the ceremonies cost too much. And so cohabitation wears traditional clothing and calls itself patience."),
    table(["Untangle it honestly", "What it means"], [
      [
        "The principle",
        "Living together takes the privileges of marriage while refusing its covenant: intimacy without vows, her womb without her security, his comfort without his commitment. And it is almost always the woman who pays: years, body and children given to a man who remains, before God, family and law, free to leave."
      ],
      [
        "The honour",
        "We honour our traditions. Bride price, rightly understood, declares a woman's worth and joins two families. But a tradition meant to honour covenant must never become the excuse for avoiding covenant. When it delays marriage for years while a couple lives as married, the guard at the gate has been bribed to hold the gate shut."
      ],
      [
        "The way forward",
        "Go to both families and negotiate honestly; many parents soften when approached with respect and a real plan. Simplify the ceremonies. Complete the customary rites and the vows before God and witnesses, and then live together with heaven's full blessing. If a couple can afford to run a household together, they can usually afford a simple marriage. The obstacle is rarely the money. It is the order."
      ]
    ]),
    pullQuote("Cohabitation is fornication with furniture, and the woman almost always pays the rent."),
    paragraph("Scripture prescribes no single ceremony, but it insists on the elements: a public leaving, a covenant vow before God and the community, and honour for the authorities of the land. So map your path through all three, with dates."),
    table(["Our ceremonies", "What is required, and who we will consult", "Our target season"], [
      [
        "1. Family and traditional (bride price, rites)",
        "",
        ""
      ],
      [
        "2. Legal and civil (registration)",
        "",
        ""
      ],
      [
        "3. Church (covenant before God)",
        "",
        ""
      ]
    ]),
    callout("tip", "Our agreement: we will not live as married before we are publicly married."),
    heading(3, "A Word to the Church"),
    paragraph("And now a rebuke, and it is addressed to us, the pastors and parents. We preach purity to young people and then tolerate every obstacle we have built in front of their marrying. Paul's counsel to those who burn with desire was simple: let them marry (1 Corinthians 7:9). We have kept his command and quietly removed his remedy. When bride price must be accumulated for years, when three ceremonies must be funded before anyone will call a couple married, when a young man is told to come back when he owns a house, we have not defended purity. We have priced it out of reach."),
    pullQuote("If your church wants chastity, your church must make marriage reachable."),
    callout("note", "If you are already living together, this is not a word of condemnation. It is an invitation to make your decision on purpose, in daylight, with counsel: go to your pastor together this month, agree a plan and a date, and ask your families to help you keep it."),
    divider(),
  ],
};

// ─── Behind Every Rival: Yourself ───
const section4 = {
  section_number: 4,
  title: "Behind Every Rival: Yourself",
  blocks: [
    heading(2, "Section 4 — Behind Every Rival: Yourself"),
    paragraph("Nobody kills a marriage on purpose. Marriages are very rarely murdered. They are starved, slowly and respectably, by good things given the wrong place. Every rival below is good, and that is what makes them dangerous."),
    table(["The rival", "The truth to carry into marriage", "Where this track teaches it"], [
      [
        "Work",
        "You are not one flesh with your job. Your employer can replace you in weeks. Your spouse cannot replace you; there is no advertisement for that position.",
        "Module 7"
      ],
      [
        "Ministry",
        "A man at church five nights a week while his wife eats alone has chosen a congregation over the person God actually gave him. \"If anyone does not know how to manage his own family, how can he take care of God's church?\" (1 Timothy 3:5). Your home is the first credential of your ministry.",
        "This module"
      ],
      [
        "Your children",
        "They are the most beloved guests you will ever have. Your spouse is the household.",
        "Module 10"
      ],
      [
        "Your parents",
        "Leaving is a transfer of authority, not a withdrawal of honour.",
        "Module 8"
      ]
    ]),
    callout("warning", "Ministry is the most respectable rival of all, and the one pastors are least willing to name. In this generation it is just as often a woman whose business, profession or ministry has become the thing her marriage is fitted around. Read this as written to you, because it is."),
    heading(3, "Givers and Takers"),
    paragraph("Each rival is a symptom. Underneath work, ministry, children and parents lies one root, the oldest in Scripture: I come first. Here is the arithmetic."),
    table(["When...", "The marriage feels like..."], [
      [
        "Two takers marry",
        "A battle. Every conversation is a negotiation, and somebody must lose."
      ],
      [
        "A giver marries a taker",
        "Not a battle, but, to the giver, being used. It is quieter and more dangerous, because it can continue for decades while looking peaceful from outside."
      ],
      [
        "Two givers marry",
        "A blessing. Two people carrying the Spirit of the One who took a towel and washed feet (John 13:4–5) stop competing and start serving."
      ]
    ]),
    callout("scripture", "\"Submit to one another out of reverence for Christ.\" — Ephesians 5:21"),
    paragraph("Some teaching hands the wife one question and the husband another. But Paul begins with an instruction to both, and everything after it sits underneath it. So in the home you are building, both of you ask both questions, every day, until it stops being an exercise and becomes a temperament: How can I serve you today? How can I bless you today?"),
    callout("warning", "This is not an instruction to someone being crushed to give more. If you are engaged to someone who takes and takes and will not be spoken to about it, and above all if there is fear, control or violence, you do not need a longer list of ways to serve. Christlike giving is not the same as being consumed. Do not marry it hoping it will change after the wedding. Speak this week to a pastor or counsellor who can actually help, on your own."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Of the four rivals, which is already the strongest in my life, and what have I done about it?",
      "Am I a giver or a taker? Now imagine my partner answering for me. Would they agree?",
      "Which of the two daily questions do I find harder to ask?"
    ]),
    divider(),
  ],
};

// ─── The Final Tests ───
const section5 = {
  section_number: 5,
  title: "The Final Tests",
  blocks: [
    heading(2, "Section 5 — The Final Tests"),
    image("/images/marriage/module-12/MM12-2.png", "A young African couple sit at a wooden table in a church office with an older pastor in a clerical collar and his wife, who leans toward them, smiling and speaking. An open Bible lies on the table beside a clipboard headed \"Marriage Preparation Checklist\", with a pen resting on it. A wooden cross and bookshelves are behind them."),
    paragraph("Walter Trobisch, the missionary counsellor who spent years among young people in Cameroon, proposed a set of simple tests for couples approaching marriage. Counsellors around the world have adapted them since. Here they are, rebuilt as eight honest questions. Take them one at a time: alone before God first, then together, then with your pastor or mentor couple."),
    table(["The test", "The honest question"], [
      [
        "1. The sharing test",
        "Do I genuinely want to share the rest of my life, all of it and not the edited version, with this person?"
      ],
      [
        "2. The kindness test",
        "When I strip away the attraction and the excitement, do I honestly regard this person as kind?"
      ],
      [
        "3. The strength test",
        "Does our love give me energy and strength, or does it drain me? Love that constantly exhausts you in courtship is telling you about the marriage."
      ],
      [
        "4. The respect test",
        "Do I respect this person's character, judgment and walk with God enough to be shaped by them for fifty years?"
      ],
      [
        "5. The habit test",
        "Do I accept this person exactly as they are today, habits, flaws and family included, knowing that people do not improve after the wedding?"
      ],
      [
        "6. The quarrel test",
        "Have we quarrelled and come through it? Can we admit wrong, apologise without excuses, and forgive?"
      ],
      [
        "7. The interest test",
        "Beneath the romance, do we share enough to be friends: the friendship the Starting Point called the foundation of everything?"
      ],
      [
        "8. The time test",
        "Have we walked through enough seasons together, ordinary, hard and boring ones, to truly know each other? Or are we still two people in a highlight reel?"
      ]
    ]),
    callout("tip", "If you cannot yet answer yes to one of these, that is not a verdict. It is an assignment. It tells you exactly which work remains."),
    callout("note", "Married readers: take the tests too, as a check-up rather than a verdict. Which one would your marriage pass most easily today, and which needs work this year?"),
    divider(),
  ],
};

// ─── Two I Could Not Help ───
const section6 = {
  section_number: 6,
  title: "Two I Could Not Help",
  blocks: [
    heading(2, "Section 6 — Two I Could Not Help"),
    paragraph("I have told you about marriages that were built. Before this track ends, I owe you two that were not, because you should know what I have watched fail before you trust me about what succeeds. The details are changed. The failures are mine."),
    heading(3, "The Kick Under the Table"),
    paragraph("A young man already serving in ministry came with his fiancée for premarital counselling. Some way into a session she began to say something, and he kicked her leg under the table. Not hard. Not angrily. The small, practised kick of a man who has done it before and expects it to work."),
    paragraph("I asked him to step outside and sat with her alone. I nearly did not; everything in a pastor's training says keep the couple together. It was the right instinct to ignore. What came out was his phone: messages with another woman, sexual and pornographic. She had been carrying it, and she had been kicked quiet about it. When I asked what she would do, she said, \"If my guy cheats, I also cheat. He cannot be enjoying himself while I sit here.\" I asked her one question: \"Do you think that cheating is enjoying yourself?\" She had no answer."),
    paragraph("I understood then what I had missed for the whole session. I had been counselling them about a marriage, and neither of them knew what a marriage was. He thought it was something you manage with a kick and a locked phone. She thought it was an account with two columns, where betrayal could be balanced by betrayal. Nobody had ever told either of them otherwise, and I could not install in eight sessions what twenty-five years had not put there. It did not go well."),
    callout("warning", "What this teaches you: if anything in your relationship is being controlled, hidden or kicked quiet, do not wait for the wedding to fix it. Tell someone, on your own, this week. And to every pastor and mentor: where something is being concealed, see her alone."),
    heading(3, "The Sentence I Could Not Come Back From"),
    paragraph("Another couple I walked with for a long time. Over months the wife talked to me about ways her husband had disrespected and hurt her. I did not go looking for any of it, and I never once raised it with him. Then one day he told me I was trying to control his home, because his wife told me things that were \"between a man and his wife\". I told him honestly that I had sent his wife back to him every time. She was not reporting him. She was venting. Sometimes a person needs a place to put something down and say it out loud, and once they have said it they can go home and solve it themselves."),
    paragraph("It made no difference. Once a man has decided you are controlling his home, there is nothing more you can do for him, because the help now has your fingerprints on it. You have to step back and hand him to someone he has not disqualified."),
    pullQuote("A woman venting is not a woman reporting. A husband who makes it treason for his wife to speak to anyone has not protected his home. He has sealed it."),
    callout("note", "For your marriage: when your spouse talks to a pastor, a mentor or a trusted friend, find out which thing they are doing before you decide you have been betrayed. A spouse with nowhere to set a burden down will either carry it until it hardens, or put it down somewhere far worse than a pastor's office."),
    paragraph("I am not telling you these stories so that you will trust me less. Every page of this track was written by a man who has got it wrong, and who would rather you learned from his failures than from your own."),
    divider(),
  ],
};

// ─── Ready to Build, or Ready to Wait ───
const section7 = {
  section_number: 7,
  title: "Ready to Build, or Ready to Wait",
  blocks: [
    heading(2, "Section 7 — Ready to Build, or Ready to Wait"),
    image("/images/marriage/module-12/MM12-3.png", "A young African couple stand hand in hand on a hillside at dawn, seen from behind, looking out over a misty green valley. Beside them, the block foundations of a small house have been laid in red earth, with steel rods rising from the corners and a stack of blocks ready. No readable text appears in the image."),
    callout("scripture", "\"Put your outdoor work in order and get your fields ready; after that, build your house.\" — Proverbs 24:27"),
    paragraph("The ancient farmer understood what the modern couple forgets: preparation comes before construction. First the fields, the slow, unphotographed work of clearing, ploughing and planting, and only then the house. Our generation has reversed the proverb. We build the house first, the wedding, the photographs, the celebration, and hope the fields will plant themselves afterwards. Fields never do."),
    pullQuote("Prepare for the marriage, not the wedding. The wedding needs a planner. The marriage needs a builder."),
    table(["A word to each reader", "The charge"], [
      [
        "To the single",
        "This season is not a waiting room. It is field-preparation season, the most valuable ground you will ever work. Become a whole person now, heal now, and you will bring a whole person to the altar."
      ],
      [
        "To the courting",
        "Slow down and do the work while doing it is still cheap. Every conversation this track has assigned you costs little today and a fortune after the vows."
      ],
      [
        "To the engaged",
        "Your engagement is not a countdown to a party. It is the final term of preparation: the counselling, the budget, the disclosures, the tests. Do not let the wedding machine devour the months that belong to the marriage."
      ],
      [
        "To the married",
        "Every module of this track is still open to you. Pick the one your marriage needs most this year, and work it together."
      ],
      [
        "To parents and pastors",
        "Teach this. Every couple we allow to reach the altar unprepared is a letter of regret we will one day receive."
      ]
    ]),
    heading(3, "If the Answer Is Wait"),
    paragraph("Someone reading this has already counted and already knows: the answer, for now, is wait. Perhaps the healing is not finished, the conviction is not settled, the person is not right, or the foundation is not there. Hear this clearly: choosing to wait, honestly and before God, is not failure. It is the courage of the wise builder who refuses to lay a foundation he cannot finish. Your friends may all be married. They cannot live your marriage, and they will not carry your regrets."),
    pullQuote("Ready to build or ready to wait: both, chosen honestly before God, are victories."),
    heading(3, "Have You Done?"),
    paragraph("\"I do\" is easy to say: two syllables, one breath, spoken in fine clothes before smiling witnesses. But those two syllables are a signature at the bottom of everything this track has taught. Say them only when the work behind them is real, and then say them with your whole heart, with joy and without fear, for as long as you both shall live."),
    callout("info", "One more thing, and it is the most important page in this track. All of this rests on a single foundation: knowing the Teacher Himself. If you have come this far and realise you have never actually met the God whose idea marriage was, never surrendered your life to Jesus Christ, who loved you and gave Himself for you, let this be the day. Before you prepare for any earthly covenant, enter the eternal one: confess your sins, receive His forgiveness, and give Him your life. Then tell a pastor or a believing friend, so that you do not walk on alone."),
    callout("note", "A prayer to pray together, or alone: Father, thank You that marriage was Your idea, and that You have never once abandoned Your own designs. Teach me how to love, truly and sacrificially, in Your school and at Your pace. Heal what I carry. Settle my convictions. Guide my head and my heart together. And when the day comes to say \"I do\", let me say it prepared, whole and unafraid, to the person You have confirmed, in the covenant You designed, for the lifetime You have written. In the name of Jesus, the Teacher and the Bridegroom. Amen."),
    divider(),
  ],
};

// ─── Have I Counted the Cost? ───
const section8 = {
  section_number: 8,
  title: "Have I Counted the Cost?",
  blocks: [
    heading(2, "Have I Counted the Cost?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. Married readers: rate your marriage as it is now."),
    scorecard("Have I Counted the Cost?", "marriage_module12_cost", [
      {
        "key": "permanence",
        "max": 10,
        "label": "I understand covenant as lifelong, and I am asking God daily for the grace to keep it",
        "helpText": "Has marriage ever made me say, \"Then who can do this?\""
      },
      {
        "key": "costs",
        "max": 10,
        "label": "I have honestly counted the costs: independence, comfort, lifelong work and \"for worse\"",
        "helpText": "Which one am I still avoiding?"
      },
      {
        "key": "wedding",
        "max": 10,
        "label": "Our wedding plans protect the marriage and its finances, not the audience",
        "helpText": "Who holds us to the budget?"
      },
      {
        "key": "order",
        "max": 10,
        "label": "We are keeping God's order: we will not live as married before we are publicly married",
        "helpText": "Is there a plan and a date for all three ceremonies?"
      },
      {
        "key": "rivals",
        "max": 10,
        "label": "No rival (work, ministry, children or parents) has taken first place in my life",
        "helpText": "Which is strongest today?"
      },
      {
        "key": "giver",
        "max": 10,
        "label": "I am becoming a giver, asking daily how I can serve and bless",
        "helpText": "Would my partner agree?"
      },
      {
        "key": "tests",
        "max": 10,
        "label": "I can answer yes to all eight final tests, or I know exactly which work remains",
        "helpText": "Which test is my assignment?"
      }
    ]),
    callout("tip", "Look at your lowest score. If you are preparing for marriage, that is the work to finish before you build. If you are married, that is your marriage's assignment for this year."),
    divider(),
  ],
};

// ─── Module 12 Assignment — Counting the Cost ───
const section9 = {
  section_number: 9,
  title: "Module 12 Assignment — Counting the Cost",
  blocks: [
    heading(2, "Module 12 Assignment — Counting the Cost"),
    assignmentPrompt({
      "title": "Module 12 Assignment",
      "instructions": "Your partner cannot see this assignment. This is the last assignment of the Marriage Track, so write slowly and honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married.",
      "word_min": 250,
      "word_max": 1000,
      "prompts": [
        {
          "number": 1,
          "heading": "The Cost I Am Counting",
          "guidance": "Name the cost of covenant from Section 2 you are most reluctant to pay, and why. Then write what you will ask God for, so that you can pay it with joy. Married: name the cost you have found hardest to keep paying, and what would help."
        },
        {
          "number": 2,
          "heading": "Our Path to the Altar",
          "guidance": "Engaged or courting: write your wedding budget limit, who will hold you to it, and your plan and target season for the family, legal and church ceremonies. If you are living together, write the plan and date you will take to your pastor this month. Single: write what kind of wedding you want, and what you refuse to borrow for. Married: write one way you can help a younger couple reach marriage."
        },
        {
          "number": 3,
          "heading": "The Eight Tests",
          "guidance": "Answer each of the eight tests in Section 5 honestly, yes or not yet. For any \"not yet\", write the assignment it gives you and who will help you with it.",
          "example": "Example: \"The quarrel test: not yet. We have never really disagreed. We will choose one real, small disagreement this month and work through it with our mentor couple.\""
        },
        {
          "number": 4,
          "heading": "Build or Wait",
          "guidance": "Having counted everything, write your answer: ready to build, or ready to wait, and why. If married, write what you will build in your marriage over the next year. End with your own prayer to God about the covenant you are preparing for, or the one you are keeping."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Counting the Cost", [
      {
        "id": "q1",
        "prompt": "When the Pharisees asked about divorce, what did Jesus answer about?",
        "options": [
          {
            "id": "a",
            "text": "The grounds for divorce"
          },
          {
            "id": "b",
            "text": "Origins: God's design from the beginning"
          },
          {
            "id": "c",
            "text": "The law of Moses only"
          },
          {
            "id": "d",
            "text": "Nothing; He refused to answer"
          }
        ],
        "correct_option_id": "b",
        "explanation": "They asked about exits; He answered about origins (Matthew 19:4–6)."
      },
      {
        "id": "q2",
        "prompt": "According to Section 1, what two things does covenant marriage require?",
        "options": [
          {
            "id": "a",
            "text": "Money and family approval"
          },
          {
            "id": "b",
            "text": "Grace from God and hard work from you"
          },
          {
            "id": "c",
            "text": "Chemistry and luck"
          },
          {
            "id": "d",
            "text": "A large wedding and a house"
          }
        ],
        "correct_option_id": "b",
        "explanation": "\"Only those to whom it has been given\" (Matthew 19:11), and the daily work every module assigns."
      },
      {
        "id": "q3",
        "prompt": "How does the module describe the wedding vows?",
        "options": [
          {
            "id": "a",
            "text": "Beautiful poetry"
          },
          {
            "id": "b",
            "text": "A cost sheet: covenant means signing for the whole page"
          },
          {
            "id": "c",
            "text": "A tradition with no real meaning"
          },
          {
            "id": "d",
            "text": "Promises that apply only to good times"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 2: the vows bind you through the second half of each pair."
      },
      {
        "id": "q4",
        "prompt": "What did Francis and Mialon's research find about wedding spending?",
        "options": [
          {
            "id": "a",
            "text": "More expensive weddings led to longer marriages"
          },
          {
            "id": "b",
            "text": "Very low-cost weddings were linked to the lowest divorce risk, and more guests to lower risk"
          },
          {
            "id": "c",
            "text": "Cost made no difference at all"
          },
          {
            "id": "d",
            "text": "Only the engagement ring mattered"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: what protected couples was not the cost of the day but the community that came to it."
      },
      {
        "id": "q5",
        "prompt": "According to Section 3, what is usually the real obstacle when a couple lives together while saving for ceremonies?",
        "options": [
          {
            "id": "a",
            "text": "The money"
          },
          {
            "id": "b",
            "text": "The order"
          },
          {
            "id": "c",
            "text": "The church"
          },
          {
            "id": "d",
            "text": "The law"
          }
        ],
        "correct_option_id": "b",
        "explanation": "If a couple can afford to run a household together, they can usually afford a simple marriage."
      },
      {
        "id": "q6",
        "prompt": "What lies behind every rival to a marriage, according to Section 4?",
        "options": [
          {
            "id": "a",
            "text": "Bad luck"
          },
          {
            "id": "b",
            "text": "The in-laws"
          },
          {
            "id": "c",
            "text": "The root of \"I come first\""
          },
          {
            "id": "d",
            "text": "Lack of money"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Two givers make a marriage that feels like a blessing rather than a battle."
      },
      {
        "id": "q7",
        "prompt": "If you cannot yet answer yes to one of the eight final tests, what does that mean?",
        "options": [
          {
            "id": "a",
            "text": "You must break up"
          },
          {
            "id": "b",
            "text": "It is an assignment that shows which work remains"
          },
          {
            "id": "c",
            "text": "Nothing; ignore it"
          },
          {
            "id": "d",
            "text": "You should marry quickly before doubts grow"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: it is not a verdict. It is an assignment."
      },
      {
        "id": "q8",
        "prompt": "What does Section 6 teach about a wife who talks to her pastor?",
        "options": [
          {
            "id": "a",
            "text": "She is betraying her husband"
          },
          {
            "id": "b",
            "text": "A woman venting is not a woman reporting"
          },
          {
            "id": "c",
            "text": "She should never speak to anyone"
          },
          {
            "id": "d",
            "text": "The pastor should confront the husband at once"
          }
        ],
        "correct_option_id": "b",
        "explanation": "A husband who makes it treason for his wife to speak to anyone has sealed his home, not protected it."
      }
    ]),
    divider(),
  ],
};

// ─── Marriage Track Complete ───
const section10 = {
  section_number: 10,
  title: "Marriage Track Complete",
  blocks: [
    heading(2, "Marriage Track Complete"),
    image("/images/marriage/module-12/MM12-4.png", "An African bride and groom walk hand in hand out of a church into bright afternoon sun, smiling at each other. An older man and woman walk just behind them, each with a hand on the couple's shoulders, while family and friends in colourful dress clap and cheer on both sides. No readable text appears in the image."),
    videoPlaceholder("3-4 min closing from Denis and Arit: what they hope every reader carries away from this track, a word for the single, the engaged and the married, and a blessing over every covenant that will be built."),
    paragraph("You have finished the Marriage Track. You have learned where marriage came from and whose idea it was, faced what you carry, chosen wisely, learned to love and to fight well, worked through roles, money and family, talked honestly about the body and the children you may raise, built the habits and traditions of a covenant, and now counted its cost."),
    paragraph("Nobody can ever say of you what so many tired spouses have said of themselves: \"No one ever taught me.\" You have been taught. Now the work is yours, and the grace is God's."),
    callout("info", "What next: Keep your assignments and scorecards; they are your record of this journey. Talk with your Equip2Lead coach about what you have learned and what you will work on first. If you are engaged, work through the Let's Talk Premarital Course with a pastor or mentor couple. If you are married, return to the module your marriage needs most this year."),
    pullQuote("\"I do\" is a signature. Do the work first, and then sign with your whole heart."),
  ],
};

// ─── Assemble ───

const module12 = {
  module_number: 12,
  slug: "counting-the-cost",
  title: "Counting the Cost",
  subtitle: "The Honest Price of Covenant, the Cost to Refuse, the Rivals That Starve a Marriage, and the Final Tests Before You Build",
  track_slug: "marriage",
  pillar: "growth-legacy",
  pillar_id: "00000000-0000-0000-0002-000000000015",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 110,
  sort_order: 12,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10],
};

const total = module12.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 12 — "${module12.title}"`);
module12.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module12_marriage.json", JSON.stringify(module12, null, 2));
console.log("\nWritten to module12_marriage.json");
