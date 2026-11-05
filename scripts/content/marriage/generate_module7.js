// Marriage Module 7 — "Money & Obligation"
// Ported on 2026-11-04 from build_module7_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module7.js
//
// Writes module7_marriage.json to the current directory.
//
// Matches the live row. Its privacy wording already says the partner cannot see the
// reflections, ratings and assignment. oEmbed checks: the money video is on Rachel Cruze's own
// channel (2026-11-04), and the debt video in Section 4 is on Mecklenburg Community Church's
// (2026-11-05). The Munroe slot is dropped. The intro credits the church, not a named speaker.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-7/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Money & Obligation"),
    paragraph("Module 7 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why money is where a marriage's heart becomes visible, why African couples carry obligations most marriage books never mention, and why the budget conversation belongs before the wedding, not after the first crisis."),
    callout("info", "Who this is for: Everyone on this track. Courting and engaged couples need to put every number on the table before the wedding. Married couples need to check whether their money is serving their covenant, or quietly dividing it. Single people can start now: the habits you build with your own money are the habits you will bring."),
    callout("info", "Core promise: By the end of this module you will know your own money story, the three numbers every adult should be able to write down, what must be disclosed before a wedding, how to think about debt, how to carry family obligations together instead of in secret, how to build a first budget, and how to recognise when money has become a weapon."),
    callout("info", "Time commitment: About 85 minutes of reading and reflection, plus 40 minutes for the assignment. Section 6 is a practical budget exercise to complete together if you have a partner on this track."),
    callout("warning", "A word of care. Section 8 is about economic abuse: money used to control a partner. If money is already a source of fear in your relationship, read that section first, and speak to a trusted pastor or counsellor on your own, not together with your partner."),
    divider(),
  ],
};

// ─── Where Your Treasure Is ───
const section1 = {
  section_number: 1,
  title: "Where Your Treasure Is",
  blocks: [
    heading(2, "Section 1 — Where Your Treasure Is"),
    image("/images/marriage/module-7/MM7-1.png", "An African husband and wife sit at a kitchen table in the evening under a warm hanging lamp, leaning in and talking calmly, with an open notebook, a calculator and a small pile of receipts between them. No readable text appears in the image."),
    callout("scripture", "\"For where your treasure is, there your heart will be also.\" — Matthew 6:21"),
    paragraph("Ask counsellors anywhere in the world what couples fight about most, and money is at or near the top of every list. But listen closely to those fights and you notice something. They are almost never about money. They are about trust, control, fear and expectations nobody said out loud. Money is simply the place where the heart becomes visible."),
    paragraph("That is why Jesus spoke so often about money and possessions. Not because God needs our money, but because what we do with it tells the truth about what we love. In a marriage, the same is true twice over: what two people do with their money tells the truth about whether they have really become one."),
    heading(3, "What the Research Shows"),
    paragraph("In 2012 the researchers Jeffrey Dew, Sonya Britt and Sandra Huston studied 4,574 American couples followed over several years, with answers from both husbands and wives. They compared many kinds of disagreement: about housework, time together, sex, in-laws and money. For wives and husbands alike, disagreements about money were the strongest predictor of divorce."),
    callout("info", "The lesson is not that money destroys marriages. It is that unresolved money conflict does. Money disagreements tend to come back again and again, because they sit on top of deeper questions about security and control. A couple who learns to talk about money honestly has learned to talk about almost anything."),
    heading(3, "Your Money Story"),
    paragraph("Every one of us grew up in a house with a money culture, and we absorbed it the way we absorbed our mother tongue: without choosing it. Some homes were peaceful about money. Some were tense, or secret, or always short. In some, one person controlled every coin. In others, money disappeared into relatives and nobody ever said how much."),
    table([
      "Ask each other",
      "What it reveals"
    ], [
      [
        "Was money peaceful, tense, secret or scarce in the home you grew up in?",
        "The emotion you attach to money before you have said a word"
      ],
      [
        "Who controlled the money, and did everyone know how much there was?",
        "What you expect about openness and control"
      ],
      [
        "What happened when the money ran out before the month did?",
        "How you behave under financial pressure"
      ],
      [
        "How much went to the extended family, and who decided?",
        "What you assume about obligation"
      ],
      [
        "Are you naturally a spender or a saver? A risk-taker or cautious?",
        "Where the two of you will pull in different directions"
      ]
    ]),
    paragraph("Differences here are not sins. A saver and a spender can build a very good marriage; they balance each other. What damages a marriage is not the difference. It is the difference that was never named, so that each person judges the other by the rules of a house the other never lived in."),
    pullQuote("Money does not change who you are. It reveals who you are, and marriage reveals it in front of a witness."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "What did the home I grew up in teach me about money without anyone saying it?",
      "Am I a spender or a saver? A risk-taker or cautious? What about the person I love?",
      "What emotion rises in me when money is mentioned: peace, fear, shame, or control?"
    ]),
    divider(),
  ],
};

// ─── One Covenant, One Purse ───
const section2 = {
  section_number: 2,
  title: "One Covenant, One Purse",
  blocks: [
    heading(2, "Section 2 — One Covenant, One Purse"),
    callout("scripture", "\"Be sure you know the condition of your flocks, give careful attention to your herds.\" — Proverbs 27:23"),
    paragraph("Marriage is a surrender of personal rights for the good of the other, and nowhere does that surrender pinch like money. In covenant, your money becomes their money, even if you earned it. Neither husband nor wife should make a major purchase without the full agreement of the other. That is what \"one flesh\" looks like on a bank statement."),
    paragraph("Couples arrange their accounts in different ways. Some have one joint account. Some keep two accounts and a shared one for the household. Scripture does not prescribe the plumbing. What it rules out is a hidden life: money the other person does not know about, debts they cannot see, decisions they discover afterwards. Separate accounts can be wise. Secret accounts are not."),
    pullQuote("Train your mouths to say \"our money\", never \"my money\" and \"your money\". The pronoun is the first budget decision you make."),
    heading(3, "Agency Is Not Independence"),
    paragraph("Here is the other side, and the church has often missed it. One-flesh money does not mean one person knows everything and the other knows nothing. A spouse who has never been allowed to understand the household's finances does not stop needing money. They simply cannot tell the difference between a partner who manages the money and a partner who controls them."),
    paragraph("So both of you need what we call financial agency: knowing what you own, what you owe, and what you would do if the income in your home stopped tomorrow. That is not a separate life or a plan to leave. It is the ordinary competence of an adult, and it makes both of you harder to deceive, including by yourselves."),
    heading(3, "Your Three Numbers"),
    table([
      "The number",
      "What to write down"
    ], [
      [
        "1. What you own",
        "Everything in your name, and everything you would keep if this season ended: savings, land, a business, a car, money owed to you."
      ],
      [
        "2. What you owe",
        "Every debt, to every person and institution, including the family loans nobody calls debts. The amount, the person, and when it ends."
      ],
      [
        "3. What has a claim on you",
        "School fees for a younger sibling, a parent's medication, the amount that goes home every month. Not shameful, and in most of our families not negotiable. Simply facts."
      ]
    ]),
    callout("tip", "Write your three numbers this week, in your own handwriting. Most people have never done it, and most are surprised by what they find in both directions. A question about the family finances is not an accusation, and anyone who treats an ordinary question as one has told you something you needed to know."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Could I write my three numbers today without guessing?",
      "Is there anything in our finances I do not know, or do not want my partner to know?",
      "Do I say \"our money\", or do I still think of what I earn as mine?"
    ]),
    divider(),
  ],
};

// ─── Nothing Hidden ───
const section3 = {
  section_number: 3,
  title: "Nothing Hidden",
  blocks: [
    heading(2, "Section 3 — Nothing Hidden"),
    paragraph("Money is the second most common thing couples fight about, and the first most common thing they hide. In 2021 a poll by the Harris Poll for the National Endowment for Financial Education asked American adults who had ever combined finances with a partner whether they had ever deceived that partner about money. Forty-three per cent said yes: a hidden purchase, a hidden account, a hidden bill, or a lie about debt or earnings. Of the people touched by it, 85 per cent said it had affected their relationship, and about one in six said it had led to separated finances or divorce."),
    pullQuote("Financial infidelity is still infidelity. It breaks the same thing: the promise that there is nothing between us that the other cannot see."),
    heading(3, "Five Things to Say Out Loud Before the Wedding"),
    table([
      "Disclose",
      "Why it cannot wait"
    ], [
      [
        "What each of you earns, and how steady it is",
        "You cannot plan a household on an income you have been guessing at"
      ],
      [
        "What each of you owes, in full, including to family",
        "A debt discovered after the wedding wounds twice: once for the debt, once for the hiding"
      ],
      [
        "What each of you sends home, and whether it is expected to continue",
        "This is the commitment that most often surprises a new spouse"
      ],
      [
        "What each of you believes about a wife working",
        "Many couples are assuming opposite things and have never said either"
      ],
      [
        "What happens to money if one of you cannot work for a year",
        "Illness, job loss and pregnancy are not rare. Agree the plan while nobody is afraid"
      ]
    ]),
    paragraph("Someone who will not have this conversation before the wedding will not have it after. And someone who avoids it is not being trusting. They are postponing, and the bill for postponement always arrives."),
    callout("note", "Married, and carrying a money secret your spouse does not know about? Do not confess it in the middle of an argument or at midnight. Speak first to a pastor or counsellor you trust, who can help you tell the truth in a way that heals rather than only wounds, and who can help you both afterwards. And bring it into the light soon: hidden debts grow."),
    divider(),
  ],
};

// ─── Debt and What It Does ───
const section4 = {
  section_number: 4,
  title: "Debt and What It Does",
  blocks: [
    heading(2, "Section 4 — Debt and What It Does"),
    callout("scripture", "\"The rich rule over the poor, and the borrower is slave to the lender.\" — Proverbs 22:7"),
    paragraph("Scripture does not forbid borrowing. It describes what borrowing does: it hands a measure of authority over your life to someone else. So the wisdom is not \"never borrow\". It is this: know what the debt is for, know when it ends, and never carry a debt whose purpose you cannot state in one sentence."),
    table([
      "Questions to ask before any debt",
      "Why"
    ], [
      [
        "What is this for, in one sentence?",
        "If you cannot say it plainly, you are borrowing for a feeling"
      ],
      [
        "Does it build something, or only buy something?",
        "A loan for a tool that earns is different from a loan for a celebration that ends"
      ],
      [
        "When does it end, and what does it cost in total?",
        "Many debts are affordable monthly and ruinous overall"
      ],
      [
        "Do we both agree, in writing?",
        "In covenant, a debt one of you takes on is a debt you both carry"
      ],
      [
        "What happens if the income stops?",
        "Every debt assumes a future. Ask what it does if the future changes"
      ]
    ]),
    paragraph("Mecklenburg Community Church in Charlotte, North Carolina, gave a whole message to debt in its series Paycheck to Paycheck: what debt does to a household, and how to break the cycle of living from one pay cheque to the next."),
    videoEmbed("01uvpY9X5cc", "Debt | Paycheck to Paycheck | Mecklenburg Community Church"),
    callout("tip", "Optional, about 33 minutes: watch it when you have time. The setting is American, and the message opens with the popular dream of retiring early. Listen past that for what it says about debt, then apply it to your own currency, family obligations and season."),
    heading(3, "The Ruinous Wedding"),
    callout("scripture", "\"Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?\" — Luke 14:28"),
    paragraph("There is one debt I beg you to refuse, and I say it as an African pastor who has watched it swallow too many young couples: the ruinous wedding. The halls, the outfits, the convoys, the crowds that must be fed, ceremony upon ceremony, too often paid for with borrowed money. A couple begins covenant life carrying a debt they took on to impress people who went home after the party."),
    pullQuote("Do not spend the foundation money on the decoration. No one who matters will remember the size of your feast. Everyone will see the size of your marriage."),
    paragraph("Honour your families and your culture as far as wisdom allows. Then let your pastor, your elders and the budget you build in Section 6 set the limit, and keep it."),
    heading(3, "Debt That Was Never Yours"),
    paragraph("There is a second kind of debt that must be named carefully, because it often arrives dressed as love: debt taken in your name, for someone else's purpose, with your signature and their benefit. The loan for his business. The card opened because her credit was poor. The money borrowed from your own relatives for a project you were told would be repaid by March."),
    paragraph("Researchers call this coerced debt. In 2019 Adrienne Adams, Angela Littwin and McKenzie Javorka studied around 2,000 women who called the US National Domestic Violence Hotline: more than half of them, 52 per cent, had experienced coerced debt. It is one of the most common reasons a person cannot leave a situation they need to leave, because the debt outlives the relationship and follows them for years."),
    callout("warning", "If reading that paragraph made your stomach move, do not skip Section 8."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Is there a debt in my life whose purpose I cannot state in one sentence?",
      "Is there debt in my name that was never really mine?",
      "If we are planning a wedding, is our budget or the crowd setting its size?"
    ]),
    divider(),
  ],
};

// ─── The Family Purse ───
const section5 = {
  section_number: 5,
  title: "The Family Purse",
  blocks: [
    heading(2, "Section 5 — The Family Purse"),
    image("/images/marriage/module-7/MM7-2.png", "A young African husband and wife sit close together on a sofa, smiling as she holds up a phone and he points toward it, his arm resting on the sofa behind her. The phone faces away from the viewer, so its screen cannot be seen. No readable text appears in the image."),
    paragraph("Most marriage books were written for couples whose money is their own and whose relatives have no claim on it. That is not the marriage most of our couples are entering. A mother's medication. A younger brother's school fees. A cousin who will need help. A father in the village who expects his son abroad to send something every month. In our part of the world, these are not footnotes. They are the marriage."),
    callout("scripture", "\"Honour your father and your mother.\" — Exodus 20:12"),
    paragraph("Supporting parents and extended family is honourable, and Scripture commands it. Jesus rebuked religious people who used a spiritual excuse, \"it is Corban, devoted to God\", to avoid helping their own father and mother (Mark 7:11–12). A believer who abandons his parents has not become holy. He has become disobedient."),
    paragraph("But Scripture also says a man leaves his father and mother and is united to his wife (Genesis 2:24). After the wedding there is a new first household. Family support does not stop; it changes hands. It is no longer one person's private decision. It becomes a decision of the couple."),
    pullQuote("Support to family is honourable. Support to family that your spouse does not know about, or did not agree to, is the quietest and longest fight a marriage can have."),
    table([
      "Agree together",
      "What it sounds like"
    ], [
      [
        "Who you support, and how much, as a line in the budget",
        "\"We send this amount to my mother and this amount to your father each month.\""
      ],
      [
        "A standing figure for emergencies, and a ceiling above which you consult",
        "\"For a death, a birth or a hospital bill, either of us may give up to this amount. Above it, we decide together.\""
      ],
      [
        "Each of you owns your own family",
        "He handles requests from his relatives; she handles hers. Neither hands their family to the other as an administrative task."
      ],
      [
        "How you will say no",
        "\"We have already given this month. We will help next month.\" Agree the sentence before you need it."
      ],
      [
        "What you will not do",
        "No secret transfers. No promise to a relative that your spouse hears about later."
      ]
    ]),
    callout("tip", "A death costs money immediately. So does a birth, and a hospital admission. A couple who has never agreed the figure will have their first serious fight in the worst week of somebody else's life. Agree it now. Who may come to live with you, and how decisions about your families are made, are the subject of Module 8."),
    paragraph("If you live abroad and send money home, a further warning belongs here. A marriage two thousand miles wide can become an arrangement between two strangers who exchange sums of money, while everyone praises the one who sends. Provision is honourable. It is never a substitute for presence, and it never replaces the covenant at home."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Does my partner know exactly who I support, and how much?",
      "Have we agreed a figure for family emergencies, or will we discover our disagreement at a funeral?",
      "Is there a family expectation I have never told my partner about because I fear their answer?"
    ]),
    divider(),
  ],
};

// ─── Build the Budget Together ───
const section6 = {
  section_number: 6,
  title: "Build the Budget Together",
  blocks: [
    heading(2, "Section 6 — Build the Budget Together"),
    paragraph("A budget is not a cage. It is the two of you telling your money where to go, before your families, your cravings and your emergencies tell it for you. Two people who can build a budget in peacetime can survive almost any financial storm. Two people who cannot discuss money before the wedding will discuss it after, in the worst possible way."),
    heading(3, "Four Works of Money"),
    table([
      "The work",
      "What it means",
      "The question to agree"
    ], [
      [
        "Give",
        "Giving to God's work and to the poor, first and on purpose",
        "How much, or what percentage, do we give?"
      ],
      [
        "Live",
        "The real cost of your household: housing, food, transport, health, communication",
        "What does our life actually cost each month?"
      ],
      [
        "Support",
        "Your obligations to parents and extended family, budgeted and agreed by both",
        "Who do we support, and how much?"
      ],
      [
        "Save",
        "Money set aside for emergencies and for the future you are building",
        "What do we save each month, even if it is small?"
      ]
    ]),
    callout("scripture", "\"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.\" — 2 Corinthians 9:7"),
    heading(3, "Our Money Decisions"),
    table([
      "Decide in writing",
      "Our agreement"
    ], [
      [
        "Joint account, separate accounts, or both?",
        ""
      ],
      [
        "Who keeps the records: accounts, bills, documents?",
        ""
      ],
      [
        "The amount either of us may spend without consulting the other",
        ""
      ],
      [
        "Our giving to God's work and the poor (amount or percentage)",
        ""
      ],
      [
        "Our monthly savings target",
        ""
      ],
      [
        "Support to parents and family: how much, to whom, decided how?",
        ""
      ],
      [
        "The debts each of us brings in, named, and the plan to repay them",
        ""
      ]
    ]),
    heading(3, "Four Rules for Talking About Money Without Fighting"),
    table([
      "Rule",
      "What it means"
    ], [
      [
        "Make it a no-blame zone",
        "Money is a shared resource to manage, not a weapon and not a verdict on anyone's worth."
      ],
      [
        "Agree a personal amount",
        "A small monthly sum each of you may spend freely, with no explanation. A little freedom protects the shared budget from resentment."
      ],
      [
        "Agree the one number",
        "The amount above which no purchase is made unless you both say yes. Below it, trust each other. This one figure prevents more money fights than any budget."
      ],
      [
        "Pause if it heats up",
        "If a money talk becomes a shouting match, stop and return to it within a day. Never make a major financial decision while angry or afraid."
      ]
    ]),
    callout("tip", "A simple tool if spending keeps slipping away: the envelope method. Choose the categories where money disappears, such as food, eating out, transport and clothes. At the start of each month put the agreed amount for each into its own envelope, or its own mobile money wallet. When an envelope is empty, that category is finished until next month. It works because you can see the money leaving."),
    paragraph("Dave Ramsey and his daughter Rachel Cruze have helped millions of couples, many of them believers, get out of debt and build a budget together. Their setting is American, but their principles of giving, saving, avoiding debt and agreeing as a couple travel well."),
    videoEmbed("lLslQ64COOQ", "Avoid These 5 Money Conflicts in Your Marriage | Rachel Cruze"),
    callout("tip", "As you watch, look for one habit you can adopt this month. Then translate it into your own context: your currency, your family obligations, your way of saving."),
    heading(3, "If One of You Runs a Business"),
    paragraph("Many of our households live on a business as much as on a salary, and very often the business is the wife's. That is not a modern idea. The woman of Proverbs 31 assesses a field, buys it and plants a vineyard from her own earnings. In sub-Saharan Africa today, according to the Global Entrepreneurship Monitor's 2016/17 women's report, about a quarter of adult women are starting or running a new business, among the highest rates in the world. And the African Development Bank estimates that women's businesses on the continent face a financing gap of about 42 billion dollars."),
    table([
      "Practice",
      "Why it matters"
    ], [
      [
        "Separate the business money from the household money from the first sale",
        "Nobody can assess, or lend to, a business whose money cannot be told apart from the household's"
      ],
      [
        "Keep records a stranger could read",
        "A notebook is enough to start: what came in, what went out, what is owed"
      ],
      [
        "Register it when you can",
        "An unregistered business is invisible to most serious sources of capital"
      ],
      [
        "Agree how the business and the household relate",
        "How much of the profit comes home, how much goes back into the business, and who decides"
      ]
    ]),
    divider(),
  ],
};

// ─── When the Money Changes ───
const section7 = {
  section_number: 7,
  title: "When the Money Changes",
  blocks: [
    heading(2, "Section 7 — When the Money Changes"),
    paragraph("A season will come, perhaps in your first year, when the money in your house changes shape. He loses his job. A contract ends and nothing comes for eleven months. Her business begins to grow and she is suddenly earning more than he is. You would expect the arithmetic to be simple: whoever has free hours does more at home. Sometimes that is exactly what happens."),
    paragraph("But counsellors and researchers have noticed a sadder pattern, and it is strongest where the expectation that a man must provide is strongest. A man who feels he is failing as a provider often withdraws from the home instead of stepping into it, because doing what he thinks of as a woman's work while not bringing money feels like losing his manhood twice in one day. At the same time his wife quietly takes on more, partly to spare his pride. Between them they build the most unequal arrangement their marriage has ever had, in the very season it can least afford one."),
    paragraph("So agree it now, while you are both earning and nobody is ashamed. An agreement made in a good season is worth ten made in a bad one."),
    table([
      "Say to each other, before you need it",
      "Why"
    ], [
      [
        "\"If either of us is not earning, our hours belong to the household.\"",
        "Time is a form of provision. A man at home who runs the house well and frees his wife to earn has not stopped providing. He has changed currency."
      ],
      [
        "\"Neither of us will carry extra just to protect the other's pride.\"",
        "That buys peace this month and pays for it with ten years of resentment."
      ],
      [
        "\"Money will never become a weapon between us, not once, not even in an argument.\"",
        "A sentence about who paid for what can take years to stop echoing."
      ]
    ]),
    callout("scripture", "\"For the love of money is a root of all kinds of evil.\" — 1 Timothy 6:10"),
    paragraph("A man is not defined by his salary, his career or his possessions, and neither is a woman. A godly person works hard but does not worship work, earns but is not identified by earnings, and provides without replacing God with provision. The season the money changes is the season you find out what was ruling your heart."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "If my income stopped tomorrow, how would I feel, and how would I behave at home?",
      "Have we agreed what happens to our hours and our roles if one of us cannot earn?",
      "Have I ever used money as a weapon in an argument: who paid, who owes, who provides?"
    ]),
    divider(),
  ],
};

// ─── When Money Becomes a Weapon ───
const section8 = {
  section_number: 8,
  title: "When Money Becomes a Weapon",
  blocks: [
    heading(2, "Section 8 — When Money Becomes a Weapon"),
    paragraph("There is a form of abuse that leaves no bruise and is almost never preached about. It is called economic abuse: controlling a partner's money and the things money buys, such as food, transport, clothing, a place to live and the ability to work. It rarely arrives as cruelty. It arrives as management, as wisdom about her spending, even as headship, and people watching from outside often praise it."),
    paragraph("Most research on economic abuse comes from Britain and the United States; the African data has barely been gathered, which is itself part of the problem. Do not read the percentages below as measurements of your street. Read the pattern, because the pattern travels."),
    table([
      "What the research shows",
      "Source"
    ], [
      [
        "95 per cent of women who experience domestic abuse also report economic abuse",
        "Surviving Economic Abuse, UK, 2019"
      ],
      [
        "Women who experience economic abuse are five times more likely to experience physical abuse",
        "Outlaw, 2009"
      ],
      [
        "More than half of women experiencing domestic abuse said they had no money, so could not leave",
        "Women's Aid for the Trades Union Congress, UK, 2015"
      ],
      [
        "One in four reports economic abuse continuing after leaving the abuser",
        "Sharp-Jeffs, 2015"
      ],
      [
        "A third of victims tell no one at all",
        "Sharp-Jeffs, 2015"
      ]
    ]),
    paragraph("Read that last line again. A third tell nobody: not a pastor, not a mother, not a friend. So if this is happening to you, your silence is not evidence that it is not serious. It is the most predictable symptom of the thing itself."),
    heading(3, "The Pattern"),
    paragraph("None of these signs proves anything on its own. Together they form a pattern worth taking seriously. Most victims are women, but men can experience this too."),
    table([
      "Signs of economic control"
    ], [
      [
        "You must account for ordinary spending in a way your partner does not."
      ],
      [
        "You were pushed to stop working, and it did not feel like your choice."
      ],
      [
        "There is debt in your name that you did not want."
      ],
      [
        "You do not know what is in the accounts, and asking causes a scene."
      ],
      [
        "You have no money of your own at all."
      ],
      [
        "What you earn becomes household money, while what your partner earns remains theirs to allocate."
      ],
      [
        "Money is given and withdrawn as a reward or a punishment."
      ]
    ]),
    heading(3, "If This Is Your Relationship"),
    table([
      "Step",
      "What to do"
    ], [
      [
        "1. Tell one person this week",
        "One mature person outside the relationship: a pastor, a trained counsellor, or an older woman who can keep a confidence and will not go and confront your partner. Breaking the silence changes more than anything else."
      ],
      [
        "2. Do not raise it with your partner first, or in a joint session",
        "Control is not a disagreement to be mediated. A conversation with both of you in the room can give your partner information and leave you with the consequences afterwards. Speak to someone alone first."
      ],
      [
        "3. Know your own numbers, quietly",
        "Your three numbers. Where your identity documents are. What is in your name. What you would need to be somewhere else for a week. This is not disloyalty; it is the information anyone needs in an emergency."
      ],
      [
        "4. If there is fear, safety comes first",
        "Before the marriage, before the family's reputation, before what people will say, and before any teaching you have heard about submission or covenant."
      ]
    ]),
    callout("warning", "Nothing in this track, not covenant, not submission, not forgiveness, has ever been a reason to stay where you are being harmed. If you are afraid, speak to someone who can act this week: a trusted pastor or counsellor. If you are in danger, contact your local emergency services."),
    divider(),
  ],
};

// ─── Arit's Turn: The One on the Plane ───
const section9 = {
  section_number: 9,
  title: "Arit's Turn: The One on the Plane",
  blocks: [
    heading(2, "Section 9 — Arit's Turn: The One on the Plane"),
    image("/images/marriage/module-7/MM7-3.png", "An African woman in her forties sits by an aeroplane window at dawn, her chin on her hand, smiling thoughtfully at the clouds. A notebook lies open on her lap with a family photograph on its cover. No readable text appears in the image."),
    videoPlaceholder("2-3 min from Arit: the prayer she prayed as a girl, the cost she did not see coming, and why she would not trade it for money."),
    paragraph("When I was in secondary school I prayed for a man who loved God more than he loved me. God answered that prayer exactly. What I did not read in it was what came attached."),
    paragraph("Serving God has meant sacrifice, financially and as a family. People assume my husband's work took him away from us. It is the other way round: I am the one who goes. I have gone for my doctorate, to keep my professional licence current, and at times for work. Behind all of it is the same arithmetic. Somebody has to raise the funds. Somebody has to keep the qualifications alive. Somebody has to think about the years after these ones. So there have been seasons when our family lived on two continents, and I was the one on the plane."),
    paragraph("I have not enjoyed it. Missing holidays. Missing anniversaries. My children growing up without me there all the time. And there have been seasons when the financial burden felt like a lot to carry, and most of it was on me. My prayer through those years was always the same: Lord, open doors for him to do what he loves and be able to live from it."),
    paragraph("I will say the thing a pastor's wife is not supposed to say out loud. If I could have had financial ease and still served God, that would have been nice. It would have. But I will not trade what I have for money. I would not."),
    pullQuote("Money is a real weight in a marriage, and it is allowed to be honest about. But it is not the thing you trade the marriage for."),
    callout("note", "Denis adds: the honesty in Arit's words is the point. A couple can carry a heavy financial season well when both of them are allowed to say what it costs. What breaks marriages is not the burden. It is the burden nobody is allowed to name."),
    divider(),
  ],
};

// ─── How Do We Handle Money? ───
const section10 = {
  section_number: 10,
  title: "How Do We Handle Money?",
  blocks: [
    heading(2, "How Do We Handle Money?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate how you handle your own money now."),
    scorecard("How Do We Handle Money?", "marriage_module7_money", [
      {
        "key": "story",
        "max": 10,
        "label": "I understand my money story and my partner's, and we have talked about them",
        "helpText": "Spender or saver? Peaceful or anxious?"
      },
      {
        "key": "numbers",
        "max": 10,
        "label": "I can write my three numbers without guessing",
        "helpText": "What I own, what I owe, what has a claim on me"
      },
      {
        "key": "hidden",
        "max": 10,
        "label": "Nothing about my finances is hidden from my partner",
        "helpText": "Is there a purchase, account or debt they do not know about?"
      },
      {
        "key": "debt",
        "max": 10,
        "label": "Every debt I carry has a purpose I can state and an end date",
        "helpText": "Which debt would I struggle to explain?"
      },
      {
        "key": "family",
        "max": 10,
        "label": "Our support to family is agreed by both of us and in the budget",
        "helpText": "Have we agreed the emergency figure?"
      },
      {
        "key": "budget",
        "max": 10,
        "label": "We have a written budget that both of us helped build",
        "helpText": "When did we last look at it together?"
      },
      {
        "key": "weapon",
        "max": 10,
        "label": "Money is never used as a weapon or a means of control in our relationship",
        "helpText": "Is anyone afraid to ask about money?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the money conversation to have first, this week. If your lowest score is the last one, read Section 8 again and speak to someone you trust on your own."),
    divider(),
  ],
};

// ─── Module 7 Assignment — Put It on the Table ───
const section11 = {
  section_number: 11,
  title: "Module 7 Assignment — Put It on the Table",
  blocks: [
    heading(2, "Module 7 Assignment — Put It on the Table"),
    assignmentPrompt({
      "title": "Module 7 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If money is a source of fear or control in your relationship, skip Prompts 3 and 4 and speak to a trusted pastor or counsellor on your own first.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "My Money Story",
          "guidance": "Describe the money culture of the home you grew up in: peaceful, tense, secret or scarce, and who controlled it. Name one habit you want to keep and one you must leave behind. Then describe how your partner's money story differs from yours, or, if you are single, what you would want a future spouse to know about yours."
        },
        {
          "number": 2,
          "heading": "My Three Numbers",
          "guidance": "Write your three numbers: what you own, what you owe, and what has a claim on you. You do not need to write the amounts here if you prefer not to; write what is in each list and how it felt to write it. Name anything you discovered that surprised you.",
          "example": "Example: \"I owe more to my uncle than I had admitted to myself, and I send home more each month than I have ever told her.\""
        },
        {
          "number": 3,
          "heading": "Our First Budget",
          "guidance": "Engaged or married: complete the decisions table in Section 6 together, then draft a monthly budget using the four works: give, live, support and save. Write down the one number above which neither of you will spend without the other, and your agreed figure for family emergencies. Single: build your own monthly budget using the same four works."
        },
        {
          "number": 4,
          "heading": "What Must Be Said",
          "guidance": "Engaged or courting: go through the five things in Section 3 and write which ones you have fully disclosed and which you have not, and when you will. Married: write the one money conversation you have been avoiding, and when and how you will have it. If there is a secret, write the name of the pastor or counsellor you will speak to first."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Money & Obligation", [
      {
        "id": "q1",
        "prompt": "According to Section 1, what are money fights usually really about?",
        "options": [
          {
            "id": "a",
            "text": "Not having enough money"
          },
          {
            "id": "b",
            "text": "Trust, control, fear and unspoken expectations"
          },
          {
            "id": "c",
            "text": "Bad luck"
          },
          {
            "id": "d",
            "text": "The cost of living"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: money is where the heart becomes visible."
      },
      {
        "id": "q2",
        "prompt": "What did Dew, Britt and Huston's 2012 study of 4,574 couples find?",
        "options": [
          {
            "id": "a",
            "text": "Arguments about housework were the strongest predictor of divorce"
          },
          {
            "id": "b",
            "text": "Money made no difference"
          },
          {
            "id": "c",
            "text": "Disagreements about money were the strongest predictor of divorce, for husbands and wives"
          },
          {
            "id": "d",
            "text": "Wealthy couples never divorce"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 1: unresolved money conflict, not money itself, is the danger."
      },
      {
        "id": "q3",
        "prompt": "What are the three numbers every adult should be able to write down?",
        "options": [
          {
            "id": "a",
            "text": "Salary, rent and savings"
          },
          {
            "id": "b",
            "text": "What you own, what you owe, and what has a claim on you"
          },
          {
            "id": "c",
            "text": "Bank balance, tithe and budget"
          },
          {
            "id": "d",
            "text": "Income, tax and pension"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 2: financial agency is the ordinary competence of an adult, not a plan to leave."
      },
      {
        "id": "q4",
        "prompt": "Which of these is the module's test for any debt?",
        "options": [
          {
            "id": "a",
            "text": "Never borrow at all"
          },
          {
            "id": "b",
            "text": "Borrow whenever the monthly payment is affordable"
          },
          {
            "id": "c",
            "text": "Know what it is for in one sentence, know when it ends, and agree it together"
          },
          {
            "id": "d",
            "text": "Let the husband decide alone"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 4: the borrower is slave to the lender, so borrow only with eyes open."
      },
      {
        "id": "q5",
        "prompt": "How should a married couple handle support to parents and extended family?",
        "options": [
          {
            "id": "a",
            "text": "Stop it after the wedding"
          },
          {
            "id": "b",
            "text": "Each spouse decides privately for their own family"
          },
          {
            "id": "c",
            "text": "Budget it and agree it together, with a figure for emergencies"
          },
          {
            "id": "d",
            "text": "Let the relatives decide how much"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 5: support is honourable; secret or unagreed support is the quietest, longest fight."
      },
      {
        "id": "q6",
        "prompt": "What is \"the one number\"?",
        "options": [
          {
            "id": "a",
            "text": "The amount above which neither of you spends without the other's agreement"
          },
          {
            "id": "b",
            "text": "Your total savings"
          },
          {
            "id": "c",
            "text": "The tithe percentage"
          },
          {
            "id": "d",
            "text": "The cost of the wedding"
          }
        ],
        "correct_option_id": "a",
        "explanation": "Section 6: this one figure prevents more money fights than any budget."
      },
      {
        "id": "q7",
        "prompt": "What did the 2019 study of women calling the US National Domestic Violence Hotline find?",
        "options": [
          {
            "id": "a",
            "text": "Coerced debt is rare"
          },
          {
            "id": "b",
            "text": "52 per cent had experienced coerced debt"
          },
          {
            "id": "c",
            "text": "Only men experience coerced debt"
          },
          {
            "id": "d",
            "text": "Debt has nothing to do with abuse"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: debt taken in your name for someone else's purpose can trap a person for years."
      },
      {
        "id": "q8",
        "prompt": "If money is being used to control you, what is the first step this module recommends?",
        "options": [
          {
            "id": "a",
            "text": "Confront your partner immediately"
          },
          {
            "id": "b",
            "text": "Raise it in a joint counselling session"
          },
          {
            "id": "c",
            "text": "Tell one mature, trusted person outside the relationship this week"
          },
          {
            "id": "d",
            "text": "Say nothing and pray"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 8: a third of victims tell no one. Breaking the silence changes more than anything else."
      }
    ]),
    divider(),
  ],
};

// ─── Module 7 Complete ───
const section12 = {
  section_number: 12,
  title: "Module 7 Complete",
  blocks: [
    heading(2, "Module 7 Complete"),
    image("/images/marriage/module-7/MM7-4.png", "An African couple in their fifties stand together at the gate of a modest, well-kept family home at sunset, his arm around her shoulder, both content, with a small vegetable garden beside them. No readable text appears in the image."),
    videoPlaceholder("2-3 min closing from Denis and Arit: the money conversation they wish they had had earlier, how they carry family obligations together, and a prayer for couples under financial pressure."),
    paragraph("You have looked at your money story, written your three numbers, named what must be disclosed, learned to weigh debt, agreed how to carry your families together, built a first budget, prepared for the season the money changes, and learned to recognise when money becomes a weapon. Money will never stop being a subject in your marriage. But it no longer has to be a secret, or a battlefield."),
    paragraph("Module 8 turns to the people behind so many of these obligations: your families, your in-laws, and how a new household honours both while leaving both."),
    callout("info", "Next: Module 8 — Family & In-Laws. Before you begin, finish your assignment, and agree your one number and your family emergency figure with your partner this week."),
  ],
};

// ─── Assemble ───

const module7 = {
  module_number: 7,
  slug: "money-and-obligation",
  title: "Money & Obligation",
  subtitle: "Your Money Story, Debt, Family Obligations, the First Budget, and When Money Becomes a Weapon",
  track_slug: "marriage",
  pillar: "partnership-roles",
  pillar_id: "00000000-0000-0000-0002-000000000013",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 115,
  sort_order: 7,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12],
};

const total = module7.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 7 — "${module7.title}"`);
module7.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module7_marriage.json", JSON.stringify(module7, null, 2));
console.log("\nWritten to module7_marriage.json");
