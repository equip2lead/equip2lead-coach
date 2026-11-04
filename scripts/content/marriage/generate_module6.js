// Marriage Module 6 — "Roles & Work"
// Ported on 2026-11-04 from build_module6_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module6.js
//
// Writes module6_marriage.json to the current directory.
//
// No edits from the authored source. Its privacy wording already says the partner cannot
// see the reflections, ratings and assignment. oEmbed check on 2026-11-04: the Munroe video
// is on Munroe Global's channel and the Eggerichs video is on LIFE Today's. Captions are the
// real titles, tidied. The MM6-4 image stays a placeholder until it is saved.

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
// public/images/marriage/module-6/MM6-1..4.png.
const imagePlaceholder = (ref, brief) => callout("note", `[IMAGE PLACEHOLDER — ${ref}] ${brief}`);
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Roles & Work"),
    paragraph("Module 6 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why the words headship and submission make so many people uncomfortable, why both have been badly misused in our homes and churches, and what Scripture actually asks of a husband and a wife."),
    callout("info", "Who this is for: Everyone on this track. Courting and engaged couples need to agree on roles before the wedding, not discover their disagreement in the kitchen. Married couples need to check whether the roles they are living are the ones Scripture describes, or simply the ones they inherited."),
    callout("info", "Core promise: By the end of this module you will understand what headship is and is not, how a husband should make decisions with his wife, what submission is and what it has never been, how love and respect work together, how both of you are called to work, and how to agree who carries what in your home."),
    callout("info", "Time commitment: About 80 minutes of reading and reflection, plus 30 minutes for the assignment. Section 7 is a practical exercise to complete together if you have a partner on this track."),
    callout("warning", "A word of care. The words in this module have been used to hurt people, especially women. Nothing taught here ever requires anyone to remain in reach of violence, control or abuse. If that is your situation, read the warning in Section 4 first, and speak to a trusted pastor or counsellor."),
    divider(),
  ],
};

// ─── Equal in Worth, Distinct in Calling ───
const section1 = {
  section_number: 1,
  title: "Equal in Worth, Distinct in Calling",
  blocks: [
    heading(2, "Section 1 — Equal in Worth, Distinct in Calling"),
    imagePlaceholder("MM6-1", "Content: A young African husband and wife walking side by side up a hillside path at sunrise, carrying a basket between them, each holding one handle, both looking ahead. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    callout("scripture", "\"So God created mankind in his own image, in the image of God he created them; male and female he created them.\" — Genesis 1:27"),
    paragraph("Every conversation about roles has to begin here, or it will go wrong. The man and the woman both carry the image of God, fully and equally. Neither is more valuable. Neither is more spiritual by default. Whatever Scripture says about different responsibilities in marriage, it says nothing about different worth."),
    heading(3, "Not an Assistant: Ezer"),
    paragraph("When God said He would make a \"helper suitable\" for the man, our culture hears something small: an assistant, a supporting role. But the Hebrew word is ezer, and Scripture uses that same word again and again for God Himself, when He comes to rescue and strengthen His people. \"Our help (ezer) comes from the Lord.\" No one imagines a weak or lesser God in that sentence."),
    paragraph("Ezer kenegdo means a strength corresponding to him: face to face, equal in essence, formidable in partnership. When God gives a woman as an ezer, He is not assigning her a small role. He is declaring that she brings a strength the man does not have on his own. And being an ezer never means having no assignment of her own. It means her strength has somewhere to go."),
    pullQuote("She was made a strong ally, never a housemaid. Equal in worth, distinct in calling, one in mission."),
    callout("note", "A word of humility. Godly couples, and godly church traditions, work out the details of roles differently, and sincere believers do not all agree. What follows is how we teach it, from Scripture and from years of pastoral work. Whatever your tradition, two things are not negotiable: equal worth, and the complete rejection of domination and abuse."),
    divider(),
  ],
};

// ─── Headship Is Responsibility, Not Superiority ───
const section2 = {
  section_number: 2,
  title: "Headship Is Responsibility, Not Superiority",
  blocks: [
    heading(2, "Section 2 — Headship Is Responsibility, Not Superiority"),
    callout("scripture", "\"But I want you to realise that the head of every man is Christ, and the head of the woman is man, and the head of Christ is God.\" — 1 Corinthians 11:3"),
    paragraph("Notice the chain. Christ is under the Father, and is not less than God. The husband is under Christ. Headship is not a throne at the top of the house. It is a place of accountability in the middle of it."),
    table([
      "Headship does not mean...",
      "Headship means he stands..."
    ], [
      [
        "He is more valuable",
        "Under Christ's authority, answerable to God for his home"
      ],
      [
        "He is more spiritual by default",
        "Between his family and harm"
      ],
      [
        "He gets the final word because he is male",
        "Between his wife and chaos"
      ],
      [
        "He rules without accountability",
        "Between his children and confusion"
      ]
    ]),
    pullQuote("Headship is not a privilege to enjoy. It is a burden to bear."),
    heading(3, "The Husband's Job Description: Represent Christ"),
    callout("scripture", "\"Husbands, love your wives, just as Christ loved the church and gave himself up for her to make her holy, cleansing her by the washing with water through the word.\" — Ephesians 5:25–26"),
    table([
      "How Christ leads",
      "What it looks like in a husband"
    ], [
      [
        "Through sacrifice, not force",
        "He does not ask, \"How can I be obeyed?\" He asks, \"How can I lay my life down?\""
      ],
      [
        "He protects; He does not threaten",
        "He creates emotional safety and never uses fear, silence, violence or control as tools"
      ],
      [
        "He sanctifies through the Word",
        "He values God's Word, models obedience, and takes responsibility for the spiritual climate of the home"
      ]
    ]),
    pullQuote("Silence is not neutrality. Silence is abdication."),
    callout("warning", "Any man who demands submission without sacrificial love has already disqualified himself from biblical headship. And if a woman feels unsafe with a man, Christ is not being represented, no matter how much Scripture is quoted."),
    paragraph("Dr. Myles Munroe taught a generation of African believers that every role in marriage flows from purpose: you cannot understand what a husband or a wife is for until you understand what God made them for."),
    videoEmbed("Gy_tHy6_KHc", "The Husband and Wife's Role in Marriage | Dr. Myles Munroe"),
    callout("tip", "As you listen, write down one responsibility he names that you have never thought of as part of your role. Then compare it with the job description above."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "What did I see modelled about headship growing up: responsibility, or superiority?",
      "Men: which of the three marks of Christ's leadership (sacrifice, protection, the Word) is weakest in me?",
      "Women: what would make it easier for me to trust a man's leadership?"
    ]),
    divider(),
  ],
};

// ─── He Decides, With Her ───
const section3 = {
  section_number: 3,
  title: "He Decides, With Her",
  blocks: [
    heading(2, "Section 3 — He Decides, With Her"),
    paragraph("Wisdom means the husband makes decisions. Leadership cannot avoid responsibility. But a godly husband decides with his wife, not over her. He seeks God, weighs Scripture, takes her counsel properly, and chooses what aligns with God's will, even when the choice costs him."),
    heading(3, "The Decision Nobody Makes"),
    paragraph("Go into almost any marriage and you will find at least one matter that has been under discussion for two years. Whether to move. Whether to change the child's school. Whether the relative who came for three weeks is ever going to leave. It is raised, it is painful, it is shelved, and six months later it is raised again in exactly the same words."),
    paragraph("Not deciding is a decision. It is a decision in favour of whatever is currently happening. And the cost is not shared equally. He can put it down between conversations. She carries it continuously, because the unresolved thing sits inside her daily planning. A woman living beside a man who will not decide is not living in peace. She is living in suspension."),
    pullQuote("Every decision a man refuses to make is still being made: by the calendar, by whoever shouts loudest, or by his wife, who never asked for it."),
    heading(3, "How to Decide Together"),
    table([
      "Step",
      "What to do"
    ], [
      [
        "1. Write the decision as one question",
        "Most long arguments are two people answering different questions."
      ],
      [
        "2. Give it a date",
        "\"We will decide this by the end of the month.\" A decision with no date is not pending; it is abandoned."
      ],
      [
        "3. Take her counsel properly",
        "Not \"what do you think?\" over your shoulder at eleven at night. Ask for the strongest case for, then the strongest case against, and write both down."
      ],
      [
        "4. Check whether Scripture has already settled it",
        "On honesty, faithfulness, debt and how you treat your parents, there is a command. Weighing what God has settled is shopping for permission."
      ],
      [
        "5. Where Scripture is silent, weigh it at one year and at ten",
        "Most bad decisions are excellent decisions for about six weeks."
      ],
      [
        "6. Ask one older person who has lived the consequence",
        "Not a friend with the same inexperience."
      ],
      [
        "7. Decide, explain why, and set a review date",
        "Tell her the reasoning, not just the verdict, so she stands beside you rather than being informed."
      ]
    ]),
    heading(3, "Why \"Whatever You Think\" Is Not Humility"),
    paragraph("It sounds generous. Occasionally it is. Far more often it transfers the risk (if it goes wrong, the choice was hers), leaves her without a partner (she wanted someone to think with, not someone to agree with everything), and tells her she is alone with the weight. Agreeing with everything is not closeness. It is absence with good manners."),
    paragraph("Hear the difference. Handing a decision to your wife deliberately (\"this is yours, you know it better than I do, decide it and I will stand behind it\") is leadership, and a wise husband does it often. Defaulting to her by saying nothing is escape. She can always tell which one she is receiving."),
    pullQuote("Avoiding a decision is not humility. It is abdication wearing humility's clothes."),
    heading(3, "What the Research Shows"),
    paragraph("In 1998, the psychologist John Gottman and his colleagues at the University of Washington published a study of 130 newlywed couples followed over six years. One of their clearest findings concerned husbands. The newlywed men who ended up in happy, stable marriages were those who accepted influence from their wives: who let their wives' views and requests genuinely shape what they decided."),
    callout("info", "This is exactly what Step 3 asks. Biblical headship is not the refusal to be influenced. A husband who will not let his wife's wisdom change his mind is not leading like Christ, who listened, asked questions and was moved with compassion. You married the best adviser you will ever have. Use her."),
    callout("note", "Decisions and your extended family: a decision agreed with your spouse must not quietly reverse after a phone call from home. Module 8 deals with this in full. For now, settle the principle: after the wedding there is a new first household."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Is there a decision in my life or marriage that has been open for months? What is the one question, and what date will I give it?",
      "Men: do I take my wife's counsel properly, or only ask after I have decided?",
      "Women: do I give my counsel clearly, or do I hint and hope?"
    ]),
    divider(),
  ],
};

// ─── Submission: What It Is and What It Has Never Been ───
const section4 = {
  section_number: 4,
  title: "Submission: What It Is and What It Has Never Been",
  blocks: [
    heading(2, "Section 4 — Submission: What It Is and What It Has Never Been"),
    imagePlaceholder("MM6-2", "Content: An African woman in her thirties standing confidently at a church lectern or community meeting, speaking with authority, her husband seated in the front row listening with visible respect. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("There is no word in the Christian vocabulary that has been used against women more often, or more carelessly, than submission. It has been quoted over women who were being beaten, preached at women who were being cheated on, and used by families who wanted a daughter-in-law who would not speak. If the word has been used to injure you, your reaction is not rebellion. It is memory."),
    paragraph("But the abuse of a thing is never proof against the thing itself. There is a third way between a distorted submission that destroys women and no teaching at all, and it is what Scripture actually says."),
    heading(3, "The Verse Before the Verse"),
    callout("scripture", "\"Submit to one another out of reverence for Christ.\" — Ephesians 5:21"),
    paragraph("Almost everyone can quote Ephesians 5:22. Almost no one quotes the verse directly above it, and it governs everything that follows. Before the roles are ever distinguished, both husband and wife are placed under the same posture. A marriage where only one person yields is a biblical marriage operating with half the instructions missing."),
    pullQuote("Submission is not silence. It is alignment: a household facing one direction. A silent woman is not a submitted woman; she is often only a frightened one."),
    table([
      "Submission is not...",
      "Why"
    ], [
      [
        "Inferiority",
        "She carries the image of God fully (Genesis 1:27). Christ's submission to the Father did not make Him less than God."
      ],
      [
        "Obedience to sin",
        "\"We must obey God rather than human beings\" (Acts 5:29) has no exception for wives."
      ],
      [
        "Owed to all men",
        "Scripture speaks of a wife and her own husband, not men as a category."
      ],
      [
        "The erasure of her vision",
        "If God gave her an assignment before a husband, marriage gives it a second pair of hands."
      ],
      [
        "Endurance of abuse",
        "No woman is asked by God to remain in reach of harm. Get to safety, then get help."
      ],
      [
        "Blind agreement",
        "She may disagree, reason, warn and say the hard thing in private. Abigail did exactly that, and Scripture calls her wise."
      ],
      [
        "Something a man may demand",
        "The moment a man says \"submit to me\", he has revealed he does not have it. Authority that must be announced has already failed."
      ]
    ]),
    paragraph("Notice the order of the text. Before anything is asked of the wife, everything is asked of the husband: to love as Christ loved the church and gave Himself up for her. That is not a request for admiration. It is a demand for death: the death of his preferences, his comfort and his right to be served."),
    pullQuote("Submission is a response to sacrificial leadership, not a substitute for it."),
    heading(3, "Her Strength Was Never the Problem"),
    paragraph("Somewhere along the way a strange idea entered the church: that a godly woman is a soft-spoken woman, and strength in a woman is a defect. Scripture knows nothing of it. The woman of Proverbs 31 is called an eshet chayil, a woman of valour, the same root used of mighty warriors. Deborah judged a nation. Abigail overruled a fool's decision and saved a household. Priscilla corrected a preacher. God has never asked a woman to be weak. Strength that is submitted is not diminished; it is aimed."),
    callout("info", "To single women: you do not submit to a boyfriend or a fiancé. Submission belongs to covenant, not courtship. What you practise now is yielding to God, to His Word, to correction, and to accountable leadership in your local church. A woman who bows to God will never have to be bent by a man."),
    callout("warning", "Markers no culture may move. Submission never requires a woman to remain within reach of violence. It never requires her to be silent about danger to herself or her children. It never requires her to sin, lie or cover a man's sin. It never transfers to in-laws, uncles or a family council. It never means she has no counsel, no friendships, no money of her own and no voice. Anything demanding these things is not the teaching of Scripture. It is bondage with a Bible verse attached. If this describes your home, speak to a trusted pastor or counsellor, and contact local emergency services if you are in danger."),
    divider(),
  ],
};

// ─── Love and Respect ───
const section5 = {
  section_number: 5,
  title: "Love and Respect",
  blocks: [
    heading(2, "Section 5 — Love and Respect"),
    callout("scripture", "\"However, each one of you also must love his wife as he loves himself, and the wife must respect her husband.\" — Ephesians 5:33"),
    paragraph("Module 4 introduced Dr. Emerson Eggerichs' picture of pink and blue sunglasses: a husband and a wife can see the same event and receive two different messages. His fuller insight comes from this verse. Paul commands the husband to love and the wife to respect. Eggerichs observes that these are not random: they speak to what each most needs to feel. Many wives' deepest cry is to feel loved. Many husbands' deepest cry is to feel respected."),
    table([
      "When a wife does not feel loved, she may...",
      "When a husband does not feel respected, he may..."
    ], [
      [
        "React with criticism or complaint",
        "React by withdrawing or going silent"
      ],
      [
        "Feel invisible and unvalued",
        "Feel inadequate and dismissed"
      ],
      [
        "Withhold respect, hoping he will notice",
        "Withhold love, hoping she will notice"
      ]
    ]),
    paragraph("Eggerichs calls this the Crazy Cycle: without love, she reacts without respect; without respect, he reacts without love. Round and round it goes. Someone has to stop it, and Scripture does not wait for the other person to go first. The husband is commanded to love whether or not he feels respected. The wife is commanded to respect whether or not she feels loved. Neither command depends on the other being obeyed."),
    callout("note", "These are general patterns, not laws of nature. Some wives most need respect and some husbands most need love. Use this as a question to ask, not a box to put each other in: \"When do you feel most loved? When do you feel most respected?\""),
    paragraph("Dr. Emerson Eggerichs and his wife Sarah have taught this message to couples around the world through Love and Respect Ministries."),
    videoEmbed("N1otteFv6zw", "Love and Respect in Marriage and Family | Dr. Emerson Eggerichs"),
    callout("tip", "As you watch, notice one way you may be sending your partner a message you never intended. Then ask them, this week, what makes them feel most loved and most respected."),
    pullQuote("Love her as if she always deserves it. Respect him as if he always earns it. Neither of you will, and both of you will be changed."),
    divider(),
  ],
};

// ─── Both of You Were Made to Work ───
const section6 = {
  section_number: 6,
  title: "Both of You Were Made to Work",
  blocks: [
    heading(2, "Section 6 — Both of You Were Made to Work"),
    callout("scripture", "\"The Lord God took the man and put him in the Garden of Eden to work it and take care of it.\" — Genesis 2:15"),
    paragraph("Work came before the fall. It is not the curse; the curse made work painful, but work itself is part of God's good design. Both husband and wife are called to be fruitful, diligent and productive. What differs in a marriage is not whether each works, but how the work of a whole household is shared."),
    heading(3, "The Diligent Man: More Than a Pay Cheque"),
    paragraph("Scripture holds a man to concrete diligence. \"Put your outdoor work in order and get your fields ready; after that, build your house\" (Proverbs 24:27). \"Anyone who does not provide for their relatives, and especially for their own household, has denied the faith\" (1 Timothy 5:8). \"The one who is unwilling to work shall not eat\" (2 Thessalonians 3:10). A man who will not work has a spiritual problem, not merely a financial one."),
    paragraph("Diligence is about primary responsibility, not about whose money is whose. Many couples share one account and both earn. That is good. But a diligent husband makes sure that the household's needs are met and the bills are handled. There should be no surprise that the power was cut because nobody was watching."),
    pullQuote("Manhood is not proven in moments of pleasure, but in seasons of discipline."),
    heading(3, "The Woman of Valour Was in Business"),
    callout("scripture", "\"She considers a field and buys it; out of her earnings she plants a vineyard.\" — Proverbs 31:16"),
    paragraph("Most of us have heard Proverbs 31 preached at a wedding as a list of domestic virtues. Read what is actually happening. She assesses an asset, buys it with her own judgement, and plants it from her own earnings. She makes linen garments and sells them, and supplies sashes to the merchants. This woman is a landowner, a farmer, a manufacturer and a trader. Lydia, a dealer in purple cloth, ran a business, and her house became the first church in Europe. Scripture is far less nervous about a woman with work and money than the church has sometimes been."),
    callout("warning", "If both of you work outside the home, decide together how the work inside the home will be shared. In many homes the wife comes home from a full day's work to a second full shift, while the husband rests. That is not headship. It is the opposite of laying your life down."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Men: am I diligent in the responsibilities that are primarily mine, or does my family live with surprises?",
      "Women: is there an assignment or work God has given me that I have buried to appear more spiritual, or that my partner does not take seriously?",
      "If we both work, who carries the second shift in our home?"
    ]),
    divider(),
  ],
};

// ─── Who Carries What ───
const section7 = {
  section_number: 7,
  title: "Who Carries What",
  blocks: [
    heading(2, "Section 7 — Who Carries What"),
    imagePlaceholder("MM6-3", "Content: A young African couple at a dining table with a large sheet of paper divided into columns, writing and discussing together, a laptop and two cups of coffee beside them, bright morning light. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("Here is one common pattern of primary responsibility. It is not a rigid law, and it is not a list of chores to hand to your wife. It is a picture of what a well-ordered home actually requires, so that the two of you can decide together who carries what. The point is not that one person does everything, but that every area has a clear owner, with both ready to help."),
    table([
      "Responsibility",
      "Primarily husband",
      "Primarily wife",
      "Both"
    ], [
      [
        "Making sure the bills are always covered",
        "✓",
        "",
        ""
      ],
      [
        "Making sure there is always food in the home",
        "",
        "✓",
        ""
      ],
      [
        "Earning income and provision",
        "",
        "",
        "✓"
      ],
      [
        "Home repairs, maintenance and security",
        "✓",
        "",
        ""
      ],
      [
        "Daily order, meals and household routines",
        "",
        "✓",
        ""
      ],
      [
        "Nurture and daily care of the children",
        "",
        "✓",
        ""
      ],
      [
        "Discipline and bringing order",
        "",
        "",
        "✓"
      ],
      [
        "Spiritual leadership and family devotion",
        "✓",
        "",
        ""
      ],
      [
        "Prayer and covering the home",
        "",
        "",
        "✓"
      ],
      [
        "Major family decisions (with her counsel)",
        "✓",
        "",
        ""
      ],
      [
        "Hospitality and the atmosphere of the home",
        "",
        "✓",
        ""
      ],
      [
        "Protecting the family: physical, spiritual, digital",
        "✓",
        "",
        ""
      ]
    ]),
    callout("tip", "Adapt it freely. If the wife is better with numbers, she may manage the budget while the husband remains responsible that it is managed. If the husband cooks better, let him cook. The goal is coverage, not rigidity: a home where neither of you can ever say, \"I thought you were doing that.\""),
    paragraph("A father who is silent or absent forces his wife to carry both roles, and Scripture never intended her to. Children flourish under the union of two voices: a mother's constant nurture and a father's settled, loving authority. Neither voice is small."),
    pullQuote("A diligent spouse is not one who does everything, nor one who controls everything. It is one who makes sure that what they are responsible for is never neglected."),
    divider(),
  ],
};

// ─── Are We Partners? ───
const section8 = {
  section_number: 8,
  title: "Are We Partners?",
  blocks: [
    heading(2, "Are We Partners?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate what you believe and what you are preparing to practise."),
    scorecard("Are We Partners?", "marriage_module6_roles", [
      {
        "key": "worth",
        "max": 10,
        "label": "I treat my partner as fully equal in worth before God",
        "helpText": "Is there any area where I act as if I matter more?"
      },
      {
        "key": "headship",
        "max": 10,
        "label": "Headship in our home looks like sacrifice, protection and the Word, not control",
        "helpText": "Men: what did my leadership cost me this week?"
      },
      {
        "key": "decide",
        "max": 10,
        "label": "Decisions get made, on time, with both voices heard",
        "helpText": "What decision has been open too long?"
      },
      {
        "key": "influence",
        "max": 10,
        "label": "I let my partner's counsel genuinely change my mind",
        "helpText": "When did their wisdom last change a decision?"
      },
      {
        "key": "submission",
        "max": 10,
        "label": "We practise mutual submission, and no one is silenced or afraid",
        "helpText": "Is anyone in our home afraid to speak?"
      },
      {
        "key": "loverespect",
        "max": 10,
        "label": "I give love and respect without waiting for my partner to go first",
        "helpText": "Am I caught in the Crazy Cycle?"
      },
      {
        "key": "carry",
        "max": 10,
        "label": "Every area of our home has a clear owner, and the load is fair",
        "helpText": "Who carries the second shift?"
      }
    ]),
    callout("tip", "Look at your lowest score. Talk about it with your partner, or your mentor if you are single, this week."),
    divider(),
  ],
};

// ─── Module 6 Assignment — Build Your Partnership ───
const section9 = {
  section_number: 9,
  title: "Module 6 Assignment — Build Your Partnership",
  blocks: [
    heading(2, "Module 6 Assignment — Build Your Partnership"),
    assignmentPrompt({
      "title": "Module 6 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If any part of this module describes control, fear or abuse in your relationship, skip the prompts and speak to a trusted pastor or counsellor first.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "What I Inherited",
          "guidance": "Describe the roles you saw in the marriage that raised you: who decided, who worked, who carried the home, who was heard. Which parts do you want to keep, and which must you leave behind because they do not match Scripture?"
        },
        {
          "number": 2,
          "heading": "One Decision, Seven Steps",
          "guidance": "Choose one real decision that is open in your life or relationship. Walk it through the seven steps in Section 3 and write each step. Married or engaged: do it together, and write what your partner's counsel added. Single: do it with a mentor or trusted friend."
        },
        {
          "number": 3,
          "heading": "Love and Respect",
          "guidance": "Ask your partner (or, if single, reflect on yourself): \"When do you feel most loved? When do you feel most respected?\" Write the answers. Then describe one way you may have been sending a message you did not intend, and what you will do differently this week."
        },
        {
          "number": 4,
          "heading": "Our Chart",
          "guidance": "Copy the responsibility chart from Section 7 and fill it in for your own home (or the home you hope to build). Change anything that does not fit you. Mark any area that currently has no clear owner, and any area where the load is unfair. Write the one change you will make first.",
          "example": "Example: \"Bills: husband responsible, wife manages the budget because she is better with numbers. Evening meals: shared on weekdays because we both work.\""
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Roles & Work", [
      {
        "id": "q1",
        "prompt": "What does the Hebrew word ezer, translated \"helper\", tell us about the woman?",
        "options": [
          {
            "id": "a",
            "text": "She is an assistant with a smaller role"
          },
          {
            "id": "b",
            "text": "She brings a strength the man does not have on his own; the same word is used of God helping His people"
          },
          {
            "id": "c",
            "text": "She should not work outside the home"
          },
          {
            "id": "d",
            "text": "She has no assignment of her own"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: a strong ally, never a housemaid."
      },
      {
        "id": "q2",
        "prompt": "What is biblical headship?",
        "options": [
          {
            "id": "a",
            "text": "The husband's right to be obeyed"
          },
          {
            "id": "b",
            "text": "Proof that men are more spiritual"
          },
          {
            "id": "c",
            "text": "Responsibility and accountability before God, exercised through sacrifice, protection and the Word"
          },
          {
            "id": "d",
            "text": "A title with no duties"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 2: headship is not a privilege to enjoy. It is a burden to bear."
      },
      {
        "id": "q3",
        "prompt": "Why is \"whatever you think\" often not humility?",
        "options": [
          {
            "id": "a",
            "text": "It transfers the risk, leaves her without a partner, and tells her she is alone with the weight"
          },
          {
            "id": "b",
            "text": "Because husbands should never ask their wives"
          },
          {
            "id": "c",
            "text": "Because it is rude"
          },
          {
            "id": "d",
            "text": "It is always humility"
          }
        ],
        "correct_option_id": "a",
        "explanation": "Section 3: avoiding a decision is abdication wearing humility's clothes."
      },
      {
        "id": "q4",
        "prompt": "What did Gottman's 1998 study of 130 newlywed couples find about husbands?",
        "options": [
          {
            "id": "a",
            "text": "Husbands who made all decisions alone had the happiest marriages"
          },
          {
            "id": "b",
            "text": "Husbands who accepted influence from their wives ended up in happy, stable marriages"
          },
          {
            "id": "c",
            "text": "Husbands' behaviour made no difference"
          },
          {
            "id": "d",
            "text": "Wives should make all decisions"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: you married the best adviser you will ever have. Use her."
      },
      {
        "id": "q5",
        "prompt": "Which verse comes before \"Wives, submit to your husbands\" and governs it?",
        "options": [
          {
            "id": "a",
            "text": "\"Children, obey your parents\""
          },
          {
            "id": "b",
            "text": "\"Submit to one another out of reverence for Christ\" (Ephesians 5:21)"
          },
          {
            "id": "c",
            "text": "\"Love is patient\""
          },
          {
            "id": "d",
            "text": "\"Be fruitful and multiply\""
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: mutual submission comes first."
      },
      {
        "id": "q6",
        "prompt": "Which of these is submission NEVER?",
        "options": [
          {
            "id": "a",
            "text": "Alignment in one direction"
          },
          {
            "id": "b",
            "text": "A response to sacrificial leadership"
          },
          {
            "id": "c",
            "text": "Remaining in reach of violence or abuse"
          },
          {
            "id": "d",
            "text": "Voluntary"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 4: anything demanding that is bondage with a Bible verse attached."
      },
      {
        "id": "q7",
        "prompt": "What is the Crazy Cycle?",
        "options": [
          {
            "id": "a",
            "text": "A busy family schedule"
          },
          {
            "id": "b",
            "text": "Without love she reacts without respect; without respect he reacts without love"
          },
          {
            "id": "c",
            "text": "Changing roles every year"
          },
          {
            "id": "d",
            "text": "A type of exercise"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: neither command waits for the other person to go first."
      },
      {
        "id": "q8",
        "prompt": "What does Proverbs 31:16 show about the woman of valour?",
        "options": [
          {
            "id": "a",
            "text": "She only works inside the home"
          },
          {
            "id": "b",
            "text": "She assesses and buys a field and plants a vineyard from her own earnings: she is in business"
          },
          {
            "id": "c",
            "text": "She has no money of her own"
          },
          {
            "id": "d",
            "text": "She waits for her husband's instructions"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 6: both of you were made to work."
      }
    ]),
    divider(),
  ],
};

// ─── Module 6 Complete ───
const section10 = {
  section_number: 10,
  title: "Module 6 Complete",
  blocks: [
    heading(2, "Module 6 Complete"),
    imagePlaceholder("MM6-4", "Content: An African husband and wife in their forties working side by side in a small family business or shop, he arranging stock and she speaking with a customer, both visibly at ease and in partnership, warm afternoon light. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1600×900."),
    videoPlaceholder("2-3 min closing from Denis and Arit: how they divide the work of their home and ministry, one thing they had to renegotiate, and a prayer for couples learning to lead and follow like Christ."),
    paragraph("You have seen that man and woman are equal in worth and distinct in calling, that headship is a burden of responsibility and not a throne, that a husband decides with his wife and not over her, what submission is and what it has never been, how love and respect break the Crazy Cycle, and how to agree who carries what. That is not a fixed arrangement. It is a partnership you will keep refining for life."),
    paragraph("Module 7 turns to the subject behind more marriage conflict than almost any other: money, debt and the obligations our families place on us."),
    callout("info", "Next: Module 7 — Money & Obligation. Before you begin, finish your assignment, and fill in your responsibility chart together if you have a partner on this track."),
  ],
};

// ─── Assemble ───

const module6 = {
  module_number: 6,
  slug: "roles-and-work",
  title: "Roles & Work",
  subtitle: "Headship, Submission, Love and Respect, and Who Carries What",
  track_slug: "marriage",
  pillar: "partnership-roles",
  pillar_id: "00000000-0000-0000-0002-000000000013",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 110,
  sort_order: 6,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10],
};

const total = module6.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 6 — "${module6.title}"`);
module6.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module6_marriage.json", JSON.stringify(module6, null, 2));
console.log("\nWritten to module6_marriage.json");
