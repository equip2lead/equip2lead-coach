// Marriage Module 10 — "Children & Fertility"
// Ported on 2026-11-05 from build_module10_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module10.js
//
// Writes module10_marriage.json to the current directory.
//
// No edits from the authored source. Its privacy wording already says the partner cannot
// see the reflections, ratings and assignment. Video check on 2026-11-05: the Becky Thompson
// video is on Focus on the Family's channel, 24:23 long, Part 1 of the 20 February 2018 broadcast.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-10/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Children & Fertility"),
    paragraph("Module 10 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis and Arit: why children are a heritage and not an accessory, why \"we both want children\" is not yet an agreement, and why the couple whose children do not come is already a complete family before God."),
    callout("info", "Who this is for: Everyone on this track. Courting and engaged couples need to agree about children before the wedding, including what they will do if children do not come. Married couples will find help for the season they are in: waiting, expecting, raising young children, or grieving a loss."),
    callout("info", "Core promise: By the end of this module you will know the questions to settle before the first child, how to decide family planning together, how to protect your marriage when a baby arrives, how to raise children as one, how to carry infertility and loss together without blame, and the other ways God builds a family."),
    callout("info", "Time commitment: About 75 minutes of reading and reflection, plus 30 minutes for the assignment. If you are waiting for a child or grieving one, Sections 6 and 7 were written for you; read them when you are ready."),
    callout("warning", "A word of care. If you are carrying the pain of childlessness, miscarriage or the loss of a child, this module may touch it. Take it slowly. You do not have to read it alone, and you do not have to read it today."),
    divider(),
  ],
};

// ─── A Heritage From the Lord ───
const section1 = {
  section_number: 1,
  title: "A Heritage From the Lord",
  blocks: [
    heading(2, "Section 1 — A Heritage From the Lord"),
    image("/images/marriage/module-10/MM10-1.png", "A young African father sits on the grass in a sunlit garden, lifting his laughing toddler daughter into the air, while the mother sits nearby on the grass smiling up at them. No readable text appears in the image."),
    callout("scripture", "\"Children are a heritage from the Lord, offspring a reward from him.\" — Psalm 127:3"),
    paragraph("Children are not an accessory to marriage. Scripture calls them a heritage and a reward, and the first blessing God ever spoke over human beings was \"be fruitful and increase in number\" (Genesis 1:28). Through children God lets a man and a woman share in the creation of eternal souls. And children are also sleepless nights, school fees and sacrifice upon sacrifice, wrapped in a joy nobody can explain to you beforehand."),
    heading(3, "Guests and the Household"),
    paragraph("Look carefully at how Genesis words the covenant: a man leaves his father and mother, is united to his wife, and they become one flesh. Your children will come out of your flesh, and yet Scripture never says you are one flesh with your children. It says it about your spouse, and only about your spouse."),
    pullQuote("Your children are the most beloved guests you will ever have. Your spouse is the household."),
    paragraph("Raise them well and your children will leave, and that is not a tragedy but the goal. Your spouse will still be sitting across the table. That is why a strong marriage is not a cost to your children; it is the greatest gift you can give them. Children in homes where their parents' bond is visibly secure tend to carry less stress, and it shows in their schoolwork, their emotions and their sense of safety. Marriages that become entirely child-centred, where the children are the only shared project and the only conversation, often discover too late that nothing else was holding them together."),
    divider(),
  ],
};

// ─── The Conversation Before the Cradle ───
const section2 = {
  section_number: 2,
  title: "The Conversation Before the Cradle",
  blocks: [
    heading(2, "Section 2 — The Conversation Before the Cradle"),
    paragraph("\"We both want children\" is not yet an agreement. Couples assume it is, and then discover after the wedding that one wanted two children and the other wanted six, one wanted to start at once and the other wanted to wait until the business was stable. Settle the questions while it is easy."),
    table([
      "Our family conversation",
      "What we agree"
    ], [
      [
        "Do we both want children, and roughly how many?",
        ""
      ],
      [
        "When would we hope to begin, and why that season?",
        ""
      ],
      [
        "If conception delays: what is our agreement about medical help, patience and trusting God together?",
        ""
      ],
      [
        "Family planning: what approach will we take, with our doctor and our counsel?",
        ""
      ],
      [
        "Discipline: what is our united approach, so that no child can ever divide us?",
        ""
      ],
      [
        "Faith at home: how will we disciple our children in prayer, the Word, church and example?",
        ""
      ],
      [
        "Adoption or fostering: is it something either of us would consider, now or one day?",
        ""
      ]
    ]),
    callout("tip", "Your medical homework belongs here too. Both of you should know your genotype from a recent laboratory test, and your family health history on both sides. If you are both AS, take proper medical and pastoral counsel together before your wedding, because the odds for each pregnancy do not improve with the second child or the fourth."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Have we actually agreed about children, or only assumed we agree?",
      "What did I see in my own family about how children were raised, and what do I want to do differently?",
      "Which question in the table have we been avoiding?"
    ]),
    divider(),
  ],
};

// ─── Family Planning: Decide It Before It Decides You ───
const section3 = {
  section_number: 3,
  title: "Family Planning: Decide It Before It Decides You",
  blocks: [
    heading(2, "Section 3 — Family Planning: Decide It Before It Decides You"),
    paragraph("This question divides sincere believers, and you should know that before you discover it in your own bedroom. Some couples use nothing at all and receive whatever comes. Some object to particular methods. Many Christians use fertility awareness, reading the wife's cycle. Others use hormonal methods. Some, after several children, decide that they are done."),
    paragraph("Here is my own position, clearly labelled as mine and not as a word from the Lord. My wife and I have used contraception, and I have no objection to it or to family planning. Scripture nowhere forbids a couple from deciding the number and spacing of their children, and a couple who plan are not refusing a gift from God; they are stewarding one. Whatever you choose, choose it together, choose it with a clear conscience on both sides, and choose within what each of you can genuinely hold before God."),
    table([
      "Three things that matter more than the method",
      "Why"
    ], [
      [
        "That you agree",
        "A wife quietly using something her husband knows nothing about, or a husband pressing a method his wife's conscience cannot carry, has a problem no method will solve. The deception or the pressure will outlast the pills."
      ],
      [
        "That her voice weighs more",
        "Every method is carried in a woman's body. She lives with the side effects, the cycle tracking or the pregnancy. A husband who overrides his wife here has not led; he has helped himself."
      ],
      [
        "That you get real information, not folklore",
        "Methods differ a great deal in how reliable they are in ordinary use, and the gap between a method in theory and a method in a real marriage is where many surprises are born. Ask a doctor, not an aunt, a friend or the internet."
      ]
    ]),
    pullQuote("A couple who plan their family are not refusing God's gift. They are stewarding it."),
    divider(),
  ],
};

// ─── When the Baby Comes ───
const section4 = {
  section_number: 4,
  title: "When the Baby Comes",
  blocks: [
    heading(2, "Section 4 — When the Baby Comes"),
    paragraph("A baby changes everything, including the marriage. In a study of 82 newlywed couples followed for several years, the psychologists Alyson Shapiro, John Gottman and Sybil Carrère found that 67 per cent of wives who became mothers reported a decline in their satisfaction with their marriage in the years after the first baby. Among wives who did not have children over the same period, 49 per cent reported a decline."),
    paragraph("What made the difference? The couples who came through strongest were the ones with a strong marital friendship: they kept building fondness and affection, they stayed aware of each other's lives, and they treated problems as things to solve together. Wives' satisfaction rose and fell with their husbands' affection and attentiveness."),
    callout("info", "The lesson is not that children harm marriages. It is that the first years with a baby are a season when friendship must be protected on purpose, because nothing in the season will protect it for you."),
    table([
      "In the first year",
      "What protects the marriage"
    ], [
      [
        "Exhaustion",
        "Share the nights. A husband who carries more of the home in these months is not helping his wife; he is doing his own work."
      ],
      [
        "Distance",
        "Ten minutes a day of real conversation that is not about the baby. Ask how she is, not only how the child is."
      ],
      [
        "Intimacy",
        "Gentleness, patience and medical advice after the birth, and the many kinds of closeness that ask nothing of a tired body."
      ],
      [
        "Visitors and helpers",
        "Agree together who comes, for how long, and who decides. A new mother needs rest more than she needs a full house."
      ]
    ]),
    paragraph("Becky Thompson, a mother of three young children and author of Love Unending, talks with Focus on the Family about how the constant demands of parenting can leave husbands and wives disconnected, and the small daily choices that bring them back to each other: going first instead of waiting for your spouse to change, greeting each other warmly, and making room to listen."),
    videoEmbed("_b5gpnDZvFo", "Prioritizing Your Marriage in the Midst of Motherhood (Part 1) | Becky Thompson | Focus on the Family"),
    callout("tip", "About 24 minutes. Her setting is American, but the drift she describes happens in every home with young children. As you listen, choose one small habit you will practise this week."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "If we have children, what am I doing to protect our friendship, not only our parenting?",
      "Husbands: what do I carry at home in the season of a new baby? Wives: what do I need and have not said?",
      "When did we last talk for ten minutes about something other than the children?"
    ]),
    divider(),
  ],
};

// ─── Raising Them as One ───
const section5 = {
  section_number: 5,
  title: "Raising Them as One",
  blocks: [
    heading(2, "Section 5 — Raising Them as One"),
    callout("scripture", "\"These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.\" — Deuteronomy 6:6–7"),
    paragraph("Faith is not handed to children in a single sermon. It is passed on at the table, on the road to school, at bedtime, and in what they watch their parents do when nobody is applauding. The home is the first church a child ever attends."),
    callout("scripture", "\"Fathers, do not exasperate your children; instead, bring them up in the training and instruction of the Lord.\" — Ephesians 6:4"),
    paragraph("Scripture places the weight of spiritual instruction on fathers, not because mothers are less capable, but because men are accountable. When a father is silent or absent, someone else must carry what was his, and Scripture never intended a wife or a child to make up for an absent man."),
    table([
      "Raise them as one",
      "Why"
    ], [
      [
        "Agree on discipline in private, before the moment comes",
        "Parents who are not united raise children who learn to rule the house by dividing it. No child should ever find space between the two of you."
      ],
      [
        "Never undermine each other in front of the children",
        "Disagree behind a closed door, then return with one voice."
      ],
      [
        "Bless them at the door",
        "Before they leave the house each morning, a word of blessing and a short prayer. A home where blessings are spoken at the door is a home the enemy finds hard to divide."
      ],
      [
        "Let them see you love each other",
        "The marriage your children watch is the marriage they will copy."
      ]
    ]),
    callout("warning", "A word to men, plainly. In many of our communities a man is still measured by how many children carry his name, whether or not he raises them. A man who fathers children he does not raise has not proved his strength. He has shown that he can begin what he will not carry, which is the opposite of manhood as Scripture defines it."),
    divider(),
  ],
};

// ─── When Children Do Not Come ───
const section6 = {
  section_number: 6,
  title: "When Children Do Not Come",
  blocks: [
    heading(2, "Section 6 — When Children Do Not Come"),
    image("/images/marriage/module-10/MM10-2.png", "An African husband and wife pray together in the pews of a quiet church, his arm around her shoulders and her head bowed against him, their hands clasped and their eyes closed. Soft light falls through a window behind them, and a closed book rests on the pew in front. No readable text appears in the image."),
    paragraph("Some couples marry and wait, and the months become years. If that is you, hear this first: a childless couple is a complete family before God while they wait. You are not a marriage on hold. You are a marriage."),
    paragraph("You are also far from alone. In 2023 the World Health Organization reported that about one in six adults worldwide, around 17.5 per cent, experience infertility at some point in their lives, in rich and poor countries alike. The WHO describes infertility as a disease of the male or the female reproductive system, and it names the stigma that so often comes with it."),
    pullQuote("In our culture the blame for childlessness falls on the wife almost automatically, and very often it is not hers to carry. Decide now that it will be ours, whatever the cause turns out to be."),
    table([
      "Agree this together",
      "Why"
    ], [
      [
        "We will both be tested",
        "Infertility can come from the husband, the wife, both, or no cause anyone can find. Sending only the wife to the doctor is not wisdom; it is blame with a prescription."
      ],
      [
        "We will seek good medicine and keep praying",
        "Prayer and medicine are not rivals. Hannah prayed, and God answered. Today God also works through doctors."
      ],
      [
        "We will not allow relatives to judge, pressure or interfere",
        "This is the two of you before God. A family that blames a wife has stepped outside its place."
      ],
      [
        "We will never take a shortcut",
        "No second wife, no \"outside child\", no secret arrangement. Sarah's shortcut with Hagar brought pain that echoed for generations (Genesis 16)."
      ],
      [
        "We will keep loving each other in the waiting",
        "The waiting is not wasted. It is still your marriage, and it still deserves joy."
      ]
    ]),
    callout("scripture", "\"In her deep anguish Hannah prayed to the Lord, weeping bitterly.\" — 1 Samuel 1:10"),
    paragraph("Hannah did not hide her pain, and she did not manufacture her own answer. She poured out her soul before the Lord. And notice her husband Elkanah's question: \"Don't I mean more to you than ten sons?\" (1 Samuel 1:8). It was a clumsy question, but it carried a true thing: she was loved for herself, not for what she could produce."),
    callout("note", "Husbands: your wife needs to hear, often and in front of your family, that she is loved and chosen for herself, and that you are in this with her. Your silence when relatives speak against her is not neutrality. It is permission."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "If we are waiting, have we both been tested, or has the burden fallen on one of us?",
      "What have relatives said, and have we agreed together how to answer?",
      "What would it look like to keep joy alive in our marriage while we wait?"
    ]),
    divider(),
  ],
};

// ─── When a Pregnancy Is Lost ───
const section7 = {
  section_number: 7,
  title: "When a Pregnancy Is Lost",
  blocks: [
    heading(2, "Section 7 — When a Pregnancy Is Lost"),
    paragraph("Miscarriage is far more common than most couples are told, and so it is grieved in silence far more often than it should be. In 2021 The Lancet published a major review: about 15 per cent of recognised pregnancies end in miscarriage, and about one woman in ten has had at least one. A miscarriage is almost never caused by anything the mother did."),
    pullQuote("A child lost early is still a child loved. The grief is real, and it is allowed."),
    table([
      "Grieving well together",
      "How"
    ], [
      [
        "Name the loss",
        "Do not let anyone, including yourselves, treat it as nothing. Some couples give the child a name and pray over that name."
      ],
      [
        "Remember that husbands grieve too",
        "Often differently and more quietly. Ask each other how you are, and let the answers be different."
      ],
      [
        "Get medical care and follow-up",
        "For her body, and for the questions you will have about future pregnancies."
      ],
      [
        "Let the church carry you",
        "Tell your pastor or a trusted couple. A loss grieved alone grows heavier."
      ],
      [
        "Do not rush",
        "There is no deadline for grief, and no rule about when to try again. Decide together, with your doctor."
      ]
    ]),
    callout("scripture", "\"The Lord is close to the brokenhearted and saves those who are crushed in spirit.\" — Psalm 34:18"),
    divider(),
  ],
};

// ─── Other Ways God Builds a Family ───
const section8 = {
  section_number: 8,
  title: "Other Ways God Builds a Family",
  blocks: [
    heading(2, "Section 8 — Other Ways God Builds a Family"),
    image("/images/marriage/module-10/MM10-3.png", "An African couple sit on a sofa in a cosy living room in the evening, reading a picture book with a young boy between them. The boy points at the page and all three smile. Any words on the page are too blurred to read."),
    paragraph("God has always built families in more than one way. Moses was raised by Pharaoh's daughter. Esther was raised by her cousin Mordecai. And every believer is in God's family by adoption: \"he predestined us for adoption to sonship through Jesus Christ\" (Ephesians 1:5). Adoption is not God's second-best. It is how He brought you home."),
    paragraph("On our continent, children have long been raised by aunts, grandparents and older siblings, and many couples already raise a relative's child. Formal adoption, fostering, guardianship and spiritual parenting are all ways a marriage can pour its love into the next generation."),
    table([
      "If you consider adoption or fostering",
      "Why"
    ], [
      [
        "Talk about it early, long before you need it",
        "Talking about it in a calm season is very different from reaching for it in a desperate one"
      ],
      [
        "Both of you must truly want it",
        "A child should never be brought home to satisfy one spouse or to quiet relatives"
      ],
      [
        "Follow the law",
        "Proper legal adoption or guardianship protects the child, the birth family and you"
      ],
      [
        "Love the child as your own, and tell the truth",
        "In an age-appropriate way, a child deserves to know their story. Secrets about origins tend to surface at the worst time"
      ]
    ]),
    callout("note", "Not every couple who cannot have children is called to adopt, and that is not a failure of faith. Some will pour their love into nephews and nieces, students, a church's young people or a ministry. A marriage without children of its own can still be wonderfully fruitful."),
    divider(),
  ],
};

// ─── Sons and Daughters Alike ───
const section9 = {
  section_number: 9,
  title: "Sons and Daughters Alike",
  blocks: [
    heading(2, "Section 9 — Sons and Daughters Alike"),
    paragraph("In many of our families the pressure does not stop at having children. It continues until there is a son. Wives are blamed, mocked and threatened with a second wife because they \"only\" give birth to girls."),
    callout("info", "Here is a fact of biology that every family should know. A baby's sex is determined by the father: by whether his sperm carries an X or a Y chromosome. A wife cannot \"fail\" to give her husband a son. If blame were ever logical, it would not land on her, and it is never logical."),
    paragraph("And Scripture honours daughters. When the five daughters of Zelophehad came before Moses asking for their father's inheritance, God Himself said, \"What Zelophehad's daughters are saying is right\" (Numbers 27:7), and the law of Israel was changed for them. A daughter is not a consolation prize. She is a heritage from the Lord, exactly as a son is."),
    pullQuote("Every child is a heritage from the Lord. No child is a disappointment to Him, and none should be a disappointment to you."),
    divider(),
  ],
};

// ─── Ready for the Next Generation? ───
const section10 = {
  section_number: 10,
  title: "Ready for the Next Generation?",
  blocks: [
    heading(2, "Ready for the Next Generation?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate what you believe and are preparing for."),
    scorecard("Ready for the Next Generation?", "marriage_module10_children", [
      {
        "key": "agree",
        "max": 10,
        "label": "We have truly agreed about children: whether, how many and when",
        "helpText": "Or have we only assumed?"
      },
      {
        "key": "planning",
        "max": 10,
        "label": "Our family planning is agreed by both of us, with good medical information",
        "helpText": "Does her voice carry the weight it should?"
      },
      {
        "key": "friendship",
        "max": 10,
        "label": "Our friendship is protected, not only our parenting",
        "helpText": "When did we last talk about something other than the children?"
      },
      {
        "key": "united",
        "max": 10,
        "label": "We discipline and disciple our children as one",
        "helpText": "Can a child find space between us?"
      },
      {
        "key": "noblame",
        "max": 10,
        "label": "If children are delayed or lost, we carry it together, with no blame",
        "helpText": "Have we both been tested, if we are waiting?"
      },
      {
        "key": "family",
        "max": 10,
        "label": "We do not let relatives judge, pressure or interfere in this area",
        "helpText": "Have we agreed how to answer them?"
      },
      {
        "key": "alike",
        "max": 10,
        "label": "I value sons and daughters alike, and say so",
        "helpText": "What do I say when others prefer a son?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the conversation to have first, this week. If it touches grief or waiting, have it gently, and with a pastor or counsellor if you need one."),
    divider(),
  ],
};

// ─── Module 10 Assignment — The Family We Hope For ───
const section11 = {
  section_number: 11,
  title: "Module 10 Assignment — The Family We Hope For",
  blocks: [
    heading(2, "Module 10 Assignment — The Family We Hope For"),
    assignmentPrompt({
      "title": "Module 10 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If you are grieving a loss or a long wait, you may skip any prompt that is too painful today and come back to it later.",
      "word_min": 200,
      "word_max": 800,
      "prompts": [
        {
          "number": 1,
          "heading": "Our Family Conversation",
          "guidance": "Courting, engaged or married: complete the table in Section 2 with your partner. Write where you already agreed, where you discovered a difference, and what you decided. Single: complete it for yourself, so you know what you will bring to a future conversation."
        },
        {
          "number": 2,
          "heading": "Family Planning",
          "guidance": "Write what each of you believes about family planning, what you have agreed, and what you still need to ask a doctor. If you are married and have never discussed this openly, write how you will begin."
        },
        {
          "number": 3,
          "heading": "If Children Do Not Come",
          "guidance": "Write the agreement you will make, or have made, about what you will do if children are delayed: testing, medicine, prayer, how you will answer relatives, and whether you would consider adoption. If you are already waiting, write one thing you need from your partner that you have not yet said.",
          "example": "Example: \"We will both be tested at the same clinic, and when my mother asks, my husband will answer for both of us: we are trusting God together, and it is ours to carry.\""
        },
        {
          "number": 4,
          "heading": "The Home Our Children Will Remember",
          "guidance": "Describe the home you want your children to grow up in: how faith is passed on, how discipline works, how the two of you love each other in front of them. Name one practice from Section 5 you will begin, or continue, this month."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Children & Fertility", [
      {
        "id": "q1",
        "prompt": "According to Section 1, what is the relationship between your children and your spouse?",
        "options": [
          {
            "id": "a",
            "text": "Children always come first"
          },
          {
            "id": "b",
            "text": "Children are beloved guests; your spouse is the household"
          },
          {
            "id": "c",
            "text": "They are equal"
          },
          {
            "id": "d",
            "text": "The spouse matters only until children arrive"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Scripture says you are one flesh with your spouse. A strong marriage is the greatest gift to your children."
      },
      {
        "id": "q2",
        "prompt": "According to Section 3, which three things matter more than the family planning method you choose?",
        "options": [
          {
            "id": "a",
            "text": "Cost, convenience and tradition"
          },
          {
            "id": "b",
            "text": "That you agree, that her voice weighs more, and that you get real medical information"
          },
          {
            "id": "c",
            "text": "What the relatives think"
          },
          {
            "id": "d",
            "text": "The husband's preference alone"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Every method is carried in a woman's body, and folklore is not medicine."
      },
      {
        "id": "q3",
        "prompt": "What did Shapiro, Gottman and Carrère find protected marriages after the first baby?",
        "options": [
          {
            "id": "a",
            "text": "Having more money"
          },
          {
            "id": "b",
            "text": "Living near family"
          },
          {
            "id": "c",
            "text": "A strong marital friendship"
          },
          {
            "id": "d",
            "text": "Having the baby later"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 4: fondness, attentiveness and solving problems together made couples resilient."
      },
      {
        "id": "q4",
        "prompt": "Why must parents agree on discipline in private?",
        "options": [
          {
            "id": "a",
            "text": "Because children should never be disciplined"
          },
          {
            "id": "b",
            "text": "Because children who find space between their parents learn to rule the house by dividing it"
          },
          {
            "id": "c",
            "text": "Because only the father disciplines"
          },
          {
            "id": "d",
            "text": "Because it saves time"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: no child should ever find space between the two of you."
      },
      {
        "id": "q5",
        "prompt": "According to the WHO, how common is infertility?",
        "options": [
          {
            "id": "a",
            "text": "Very rare"
          },
          {
            "id": "b",
            "text": "About 1 in 6 adults experience it in their lifetime"
          },
          {
            "id": "c",
            "text": "Only a problem in wealthy countries"
          },
          {
            "id": "d",
            "text": "Always caused by the wife"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 6: it can come from the husband, the wife, both, or no identifiable cause."
      },
      {
        "id": "q6",
        "prompt": "Which of these does the module say a couple must never do when children do not come?",
        "options": [
          {
            "id": "a",
            "text": "Seek medical help"
          },
          {
            "id": "b",
            "text": "Pray together"
          },
          {
            "id": "c",
            "text": "Take a shortcut such as a second wife or an \"outside child\""
          },
          {
            "id": "d",
            "text": "Consider adoption"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 6: Sarah's shortcut with Hagar brought pain that echoed for generations."
      },
      {
        "id": "q7",
        "prompt": "Who determines a baby's sex?",
        "options": [
          {
            "id": "a",
            "text": "The mother"
          },
          {
            "id": "b",
            "text": "The father, through whether his sperm carries an X or a Y chromosome"
          },
          {
            "id": "c",
            "text": "The family"
          },
          {
            "id": "d",
            "text": "The timing of the pregnancy"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 9: a wife cannot \"fail\" to give her husband a son."
      },
      {
        "id": "q8",
        "prompt": "How does Scripture describe every believer's place in God's family?",
        "options": [
          {
            "id": "a",
            "text": "By birth into a Christian family"
          },
          {
            "id": "b",
            "text": "By adoption through Jesus Christ"
          },
          {
            "id": "c",
            "text": "By marriage"
          },
          {
            "id": "d",
            "text": "By church membership"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 8: adoption is not God's second-best. It is how He brought you home (Ephesians 1:5)."
      }
    ]),
    divider(),
  ],
};

// ─── Module 10 Complete ───
const section12 = {
  section_number: 12,
  title: "Module 10 Complete",
  blocks: [
    heading(2, "Module 10 Complete"),
    image("/images/marriage/module-10/MM10-4.png", "Three generations of an African family walk along a red-earth village road at sunset. The grandparents hold the hands of a small boy and a small girl, and the parents walk behind them arm in arm. No readable text appears in the image."),
    videoPlaceholder("2-3 min closing from Denis and Arit: what their own children taught them about marriage, a word to couples who are waiting, and a prayer for every home that hopes for the next generation."),
    paragraph("You have seen that children are a heritage and that your spouse remains the household, settled the conversation before the cradle, learned to decide family planning together, prepared to protect your marriage when a baby comes, learned to raise children as one, and learned to carry infertility and loss together without blame. You have also seen the other ways God builds a family, and that sons and daughters are a heritage alike."),
    paragraph("Module 11 turns to the commitments, habits and traditions that carry a relationship from courtship into a covenant that lasts."),
    callout("info", "Next: Module 11 — From Courtship to Covenant. Before you begin, finish your assignment, and if you are courting or engaged, complete the family conversation in Section 2 together this week."),
  ],
};

// ─── Assemble ───

const module10 = {
  module_number: 10,
  slug: "children-and-fertility",
  title: "Children & Fertility",
  subtitle: "The Conversation Before the Cradle, Family Planning, Raising Children as One, and When Children Do Not Come",
  track_slug: "marriage",
  pillar: "intimacy-sexuality",
  pillar_id: "00000000-0000-0000-0002-000000000014",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 105,
  sort_order: 10,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12],
};

const total = module10.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 10 — "${module10.title}"`);
module10.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module10_marriage.json", JSON.stringify(module10, null, 2));
console.log("\nWritten to module10_marriage.json");
