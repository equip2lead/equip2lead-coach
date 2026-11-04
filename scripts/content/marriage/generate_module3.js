// Marriage Module 3 — "Choosing Well"
// Ported on 2026-11-03 from build_module3_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module3.js
//
// Writes module3_marriage.json to the current directory.
//
// No edits from the authored source. Its privacy wording already says the partner
// cannot see the reflections, ratings and assignment. The three outside videos passed
// an oEmbed check on 2026-11-03, and their captions are Denis's wording.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-3/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Choosing Well"),
    paragraph("Module 3 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: why the choice of a spouse is the second most important decision of your life after following Christ, and why God gave you a head as well as a heart to make it."),
    callout("info", "Who this is for: Single people who want to choose well, courting and engaged couples who need to test the choice they are making, and married people. If you are married, you have already chosen. Read this module to understand the choice you made, to see your spouse more clearly, and to guide the young people who will one day ask you how to choose."),
    callout("info", "Core promise: By the end of this module you will be able to tell infatuation from love, name the order in which a partner should be weighed, examine nine areas of compatibility, read red flags without explaining them away, and test your choice against fifteen convictions."),
    callout("info", "Time commitment: About 85 minutes of reading and reflection, plus 35 minutes for the assignment. Section 7 asks for a medical conversation that some couples have never had. Do not skip it."),
    divider(),
  ],
};

// ─── Finding, Not Chasing ───
const section1 = {
  section_number: 1,
  title: "Finding, Not Chasing",
  blocks: [
    heading(2, "Section 1 — Finding, Not Chasing"),
    image("/images/marriage/module-3/MM3-1.png", "A young African woman in a wax-print dress and headwrap smiles as she draws water from a village well in the golden early morning, her sleeves rolled up. Camels rest on the dusty ground behind her. No text appears in the image."),
    paragraph("One verse has been read at more weddings, and misunderstood at more of them, than almost any other. Read it slowly, because its key word tells you the posture God expects."),
    callout("scripture", "\"He who finds a wife finds what is good and receives favour from the Lord.\" — Proverbs 18:22"),
    paragraph("Finds. Not hunts. Not chases. Not conquers. Finding and chasing are two very different postures. A person who is chasing is anxious, striving and often blind, because desperation cannot see straight. A person who is finding is walking with God, living their assignment, and paying attention along the way."),
    pullQuote("Chasing is what we do when we do not trust God's timing. Finding is what happens when we do."),
    heading(3, "God Put Adam to Sleep"),
    callout("scripture", "\"So the Lord God caused the man to fall into a deep sleep; and while he was sleeping, he took one of the man's ribs… Then the Lord God made a woman from the rib he had taken out of the man, and he brought her to the man.\" — Genesis 2:21–22"),
    paragraph("Notice how the first marriage was arranged. Adam did not conduct a search, interview candidates, or lobby God for a wife. When God brought her to him, Adam was doing nothing at all. He was asleep. God caused the sleep, God formed the woman, and God brought her to the man. Adam's part was to be where God had placed him, doing what God had given him to do, and then to recognise her when she arrived."),
    paragraph("So to every brother growing frantic about finding a wife: relax. Not laziness. Relax. God is not slow and He is not confused about your situation. Grow, serve, build your character, tend your assignment. A man busy with the will of God is far easier for God to bring a wife to than a man running from woman to woman, hunting."),
    paragraph("Sisters, the same principle applies to you from the other side. That a man \"finds\" does not mean a woman waits passively, like a lost object hoping to be discovered. When Abraham's servant went looking for a wife for Isaac, he did not find Rebekah waiting by a window. He found her at the well, working. When he asked for a drink, she offered to water his ten camels as well, which is hours of hard labour. Covenant came to her in the middle of her assignment."),
    pullQuote("Tend your assignment, and let God do the bringing. What God brings, you will not have to beg for."),
    heading(3, "What You Find Is a Person"),
    paragraph("Read the verse once more and notice what a man finds: a wife. That word rules out several things our culture would happily put in its place, and the warning cuts both ways."),
    table([
      "A man finds a wife, not...",
      "A woman finds a husband, not..."
    ], [
      [
        "A servant: an unpaid worker to cook, clean and bear children while he enjoys himself",
        "A wallet: a provider whose value ends when the money does"
      ],
      [
        "A body: an outlet for appetite, to be discarded when someone more exciting appears",
        "A status symbol: a name or title to be seen beside"
      ],
      [
        "A rival: someone to out-argue, manage and keep small because her gifts threaten him",
        "A saviour: a rescue from poverty, from an unhappy home, or from her own emptiness"
      ]
    ]),
    paragraph("What God offers in marriage is a whole person made in His image, to be loved, honoured and cherished for a lifetime. Everything less is a counterfeit, and counterfeits always disappoint. If you want someone mainly for what they provide, you have not found a spouse. You have found a resource, and resources run out."),
    paragraph("Dr. Myles Munroe, the Bahamian Bible teacher whose books on singleness, dating and marriage shaped a generation of believers across Africa, taught tirelessly that purpose must come before a partner: discover who you are in God and what He has called you to do, and you will know what kind of person can walk with you."),
    videoEmbed("kVkW5Nt9YHE", "Key Dating Advice From Dr. Myles Munroe | Munroe Global"),
    callout("tip", "As you listen, note every point where his counsel echoes this section (purpose first, character over attraction, no desperate chasing) and any point that challenges you personally. Write the one sentence you most need to remember."),
    callout("tip", "If you are married: ask yourself honestly which of these you were really looking for when you chose, and which your spouse may have been looking for. Then look at the person you actually married. The task now is not to choose again, but to keep choosing the whole person in front of you."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Am I finding, or chasing? What does my restlessness reveal about how much I trust God's timing?",
      "Am I looking for a partner, or for a servant, a body, a rival, a wallet or a rescue?",
      "What is the assignment God has given me right now, and am I tending it?"
    ]),
    divider(),
  ],
};

// ─── Three Girls in One Year ───
const section2 = {
  section_number: 2,
  title: "Three Girls in One Year",
  blocks: [
    heading(2, "Section 2 — Three Girls in One Year"),
    videoPlaceholder("2-3 min from Denis: the boarding-school year he was certain he was in love three times, and what it taught him about infatuation."),
    paragraph("Let me tell you about the year I was in love with three different girls. I believed every one of them at the time."),
    paragraph("I was in boarding school, so the holidays meant travelling. I came to Yaoundé for the holidays and there was a girl, and I was certain. This was the one. The certainty rearranged my appetite, my sleep and what I thought about while other people were talking. Then the holidays ended and I went back to my own city, and there was a girl there, and I was certain. Then term began, and three rows over in my classroom sat a girl I saw every single day. I was certain about her too."),
    paragraph("Three girls. Two cities. One year. What did they have in common? Not their faith, their family or their character. I knew almost nothing about their characters, which is exactly the point. What they had in common was that I was near them, they were beautiful, and I was a young man sitting in a room."),
    pullQuote("I was not falling in love three times. I was standing near three people."),
    heading(3, "What the Research Shows"),
    paragraph("That boy is sitting in your church right now, convinced, and nobody has explained to him what is happening in his chest. Psychologists have studied it for decades, and their unglamorous findings fit my story better than I would like."),
    table([
      "Study",
      "What researchers found",
      "What it means for your choice"
    ], [
      [
        "Festinger, Schachter and Back (1950), student housing at MIT",
        "The best predictor of who became friends was not shared interests or temperament. It was how close together people lived.",
        "Nearness manufactures attraction. Being close to someone is not evidence that they are right for you."
      ],
      [
        "Moreland and Beach (1992), a university lecture course",
        "Four similar-looking women attended a class 0, 5, 10 or 15 times and never spoke to anyone. Students rated the one they had seen most as the most attractive, and as the most similar to themselves.",
        "Simply seeing someone often creates a feeling of knowing them. They had never exchanged a word."
      ],
      [
        "Batres and colleagues (2022), over 11,000 people in 45 countries",
        "People rated attractive faces as more trustworthy, intelligent, responsible and emotionally stable.",
        "This is not a Western weakness. It is a human one. Beauty tells you nothing about character."
      ]
    ]),
    paragraph("You may have heard that infatuation \"lasts eighteen months to three years\" and then wears off. I have said it from a pulpit myself. When I went looking for where the figure comes from, I found it does not really come from anywhere solid. It has been repeated so often that it sounds like a measurement. Let it go. Infatuation does not expire on a timetable. It ends when the conditions that manufactured it end: when the holiday finishes, when the term changes, when the beautiful stranger becomes an ordinary person with opinions, a temper and a bad morning."),
    paragraph("Two of my three loves died of distance. The third died of acquaintance."),
    callout("tip", "The test: does this feeling grow when the person is far away and mysterious, and shrink when they are near and ordinary? If it does, the feeling is not really about them. It is about the uncertainty. Love runs the other way. It grows as the person becomes known."),
    heading(3, "Three Ingredients of Love"),
    paragraph("The psychologist Robert Sternberg spent a career mapping what people mean by love. He described three ingredients: intimacy (closeness and being known), passion (attraction and desire) and commitment (a decision to stay). Each combination produces a different kind of \"love\", and seeing them side by side explains a great many marriages."),
    table([
      "What is present",
      "Sternberg's name for it",
      "What it looks like in real life"
    ], [
      [
        "Passion only",
        "Infatuation",
        "Instant, intense, and built on very little knowledge. It can arrive in an evening and leave just as fast."
      ],
      [
        "Intimacy only",
        "Liking",
        "A true friendship, warm and honest, without romance or a promise."
      ],
      [
        "Commitment only",
        "Empty love",
        "A marriage that has kept its vows and lost its warmth. Some arranged beginnings start here and grow."
      ],
      [
        "Intimacy and passion",
        "Romantic love",
        "Close and attracted, but nothing has been promised yet."
      ],
      [
        "Intimacy and commitment",
        "Companionate love",
        "A deep, settled partnership, often seen in long marriages."
      ],
      [
        "Passion and commitment",
        "Fatuous love",
        "The whirlwind engagement: a promise made on fire before the person is known. This is the most dangerous combination for anyone choosing a spouse."
      ],
      [
        "All three",
        "Consummate love",
        "Known, desired and chosen. This is what you are building toward."
      ]
    ]),
    paragraph("Notice the most dangerous row. A covenant made on passion alone, before intimacy has had time to grow, is a promise made to a stranger. The writer Gary Thomas says it bluntly: when you are infatuated, you are relating to someone who does not exist. And Timothy Keller observes that to be loved without being known is comforting but shallow. To be fully known and still loved is what we were made for, and it cannot be had in a single term."),
    heading(3, "Fire You Build"),
    paragraph("Infatuation is not sin. It is not a sign of a weak spirit or a dirty mind. It is a young heart doing what young hearts do. The sin is in acting on the feeling as though it were knowledge: declaring, promising, touching and sometimes marrying on the strength of a certainty built from nearness and a pretty face."),
    paragraph("But do not leave this section thinking that love is only a grim decision once the feelings have died. In 2009 the psychologists Bianca Acevedo and Arthur Aron reviewed 25 studies covering more than 6,000 people. They found that intense romantic love can and does survive in long marriages. What does not survive is the obsessive part: the restlessness, the anxiety, the constant thinking about the other person. The intensity can last for decades. The obsession was never built to."),
    pullQuote("You are not choosing between fire and duty. You are choosing between a fire someone lit under you by accident, and a fire you build."),
    paragraph("The anthropologist Helen Fisher spent years scanning the brains of people who had just fallen intensely in love. In this talk she describes romantic love as one of the most powerful drives in the human brain, closer to hunger and thirst than to an emotion, and she explains why it can override judgement."),
    videoEmbed("OYfoGTIG7pY", "The brain in love | Helen Fisher | TED"),
    callout("tip", "About 16 minutes. Helen Fisher speaks as a scientist, not a pastor, and parts of her talk speak frankly about sex and evolution. Listen for one thing: how strong this drive is. A force that strong is a gift inside covenant, and it is exactly why it must not be allowed to make your choice for you. Your feelings are real. They are not a verdict."),
    pullQuote("Love is not what happens when you are close to someone. It is what is left when you actually know them."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Think of a time you were certain you were in love. Looking back, how much did you actually know about that person's character?",
      "Which of Sternberg's seven kinds of love best describes your current or last relationship?",
      "Does your feeling for this person grow as you know them better, or does it need distance and mystery to survive?"
    ]),
    divider(),
  ],
};

// ─── Time, Desperation and Deciding ───
const section3 = {
  section_number: 3,
  title: "Time, Desperation and Deciding",
  blocks: [
    heading(2, "Section 3 — Time, Desperation and Deciding"),
    paragraph("If love is a decision, it needs evidence to decide on. Evidence takes time."),
    pullQuote("Never trust what time has not tested."),
    paragraph("Charm can be manufactured in an evening. Character cannot. Anyone can be patient for a weekend, generous for a month or spiritual for a season, especially while they are trying to win you. But time is an honest witness. It eventually shows how a person handles disappointment, boredom, pressure, correction and delay. You cannot see any of that in a hurry. The person who is truly right for you will not be lost by waiting. The person who is truly wrong for you will usually be exposed by it."),
    heading(3, "Seven Hours a Day, and a Stranger"),
    paragraph("I will tell you a true story, with the details changed to protect the people involved. A woman courted a man who lived on another continent. For six months they spoke by telephone, sometimes seven hours a day, and then she married him. Only after the wedding did she discover that he was a widower with children, with a past far darker than she could have imagined. The marriage became years of cruelty and deceit while he continued to lead in church on Sundays. She barely escaped with her life."),
    paragraph("Seven hours a day on the telephone, and she had married a stranger. Hours of talking are not the same as time. Time means seeing someone in ordinary life, among their family, under pressure and over seasons. Knowledge and time are not romantic luxuries. They are protection."),
    callout("warning", "If you are in a long-distance relationship, do not let the hours on the phone substitute for the evidence of a life. Before any commitment, see them in their own city, meet their family and their pastor, and ask people who have known them for years. Anyone who resists being known that way has told you something important."),
    heading(3, "Desperation Is a Door"),
    paragraph("The greatest danger in choosing is often not a wicked person. It is a state of heart: desperation. Desperation says, I must have someone, and I must have them now. It is fed by loneliness, by age, by family pressure, by every wedding invitation that arrives, and by the quiet fear of being left behind."),
    paragraph("Desperation does something terrible to judgement. It makes you negotiate. You begin to explain away what you once would have refused. You lower a standard here, silence a warning there, and tell yourself that surely they will change after the wedding."),
    pullQuote("When you are desperate, the enemy will gladly offer you a substitute, and a substitute always arrives wearing the face of an answered prayer."),
    paragraph("A settled heart is your best protection. Someone content in God cannot be stampeded into a bad covenant. Someone desperate can be talked into almost anything. And remember: God has no wristwatch. Your friends may all be married, but they cannot marry your husband or wife for you. It is better to explain to people why you are still waiting than to spend a lifetime explaining why you rushed."),
    heading(3, "Sliding or Deciding"),
    paragraph("Research points the same way. Between 2007 and 2008, the psychologists Galena Rhoades and Scott Stanley began following more than 1,000 unmarried Americans aged 18 to 34. Over the next five years, 418 of them married. In their 2014 report \"Before I Do\", published by the National Marriage Project, they found that among those who had lived together before marriage, the people who said they had made a deliberate decision about that step, rather than drifting into it, went on to report higher-quality marriages. Stanley calls the difference sliding versus deciding. The same report found that people with more previous sexual or live-in partners were less likely to report a high-quality marriage, which is the tape parable from Module 2 seen through a researcher's eyes."),
    table([
      "Sliding",
      "Deciding"
    ], [
      [
        "\"It just happened.\"",
        "\"We talked about it, prayed about it and chose it.\""
      ],
      [
        "Steps are taken because the next step is easy or convenient",
        "Steps are taken because both people have agreed what they mean"
      ],
      [
        "The relationship carries you",
        "You lead the relationship"
      ],
      [
        "Pressure, the calendar or other people set the pace",
        "Conviction sets the pace"
      ]
    ]),
    paragraph("Stanley's explanation is simple: the act of making a decision sets couples up to make stronger commitments. A covenant is the opposite of a slide. It is the most deliberate decision two people can make."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Where in my relationship history have I slid rather than decided?",
      "Is anyone or anything (family, age, friends, the calendar) pushing me to move faster than the evidence allows?",
      "Is there a standard I have quietly begun lowering because I am afraid of being alone?"
    ]),
    divider(),
  ],
};

// ─── The Right Order ───
const section4 = {
  section_number: 4,
  title: "The Right Order",
  blocks: [
    heading(2, "Section 4 — The Right Order"),
    image("/images/marriage/module-3/MM3-2.png", "An open Bible and a spiral notebook on a wooden table beside a window in morning light, with a pen resting between them. The Bible is open at Matthew 6, with the words seek first the kingdom of God highlighted. The notebook is headed The Right Order, with two columns: First, listing God, Character, Calling and Purpose; and Then, listing Relationship, Engagement, Marriage and Family."),
    paragraph("Our generation believes a lie about love: that thinking carefully about a relationship somehow betrays it, and that real love should be all heart. That lie fills counselling rooms. God gave you a heart to love with and a head to judge with, and He expects you to bring both to the most important human decision of your life."),
    pullQuote("The heart asks, \"Do I want this person?\" The head asks, \"Can I build a life with this person?\" A wise marriage answers yes to both."),
    paragraph("And timing matters. Weigh compatibility before you are deeply involved, not after. Once you are emotionally bound and physically entangled, the heart has taken the microphone and the head can no longer be heard."),
    heading(3, "First, the Three Knowings"),
    paragraph("Before you examine anyone else, there is work to do that has nothing to do with the other person. In our teaching we call it the three knowings, and they come in this order."),
    table([
      "The knowing",
      "Why it comes first",
      "The question to ask"
    ], [
      [
        "Know God",
        "Discernment begins with the One above you, not the person in front of you. Without His eyes you will judge as the world judges: by appearance, money and the pressure of the moment.",
        "Am I close enough to God to see this person the way He sees them?"
      ],
      [
        "Know yourself",
        "You cannot judge whether someone fits you if you have never examined the you they must fit. That is building a doorframe without measuring the door.",
        "What is my temperament, my calling and my weakness, and what does each one need beside it?"
      ],
      [
        "Know what you need",
        "What you want and what you need are rarely the same list. Wants are written by your eyes and your culture. Needs are written by your assignment.",
        "If I got everything I want and nothing I need, what would my marriage look like in ten years?"
      ]
    ]),
    callout("scripture", "\"But the Lord said to Samuel, 'Do not consider his appearance or his height, for I have rejected him. The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart.'\" — 1 Samuel 16:7"),
    paragraph("Samuel was a seasoned prophet, and he looked at Jesse's eldest son Eliab and thought, surely this is the one. God corrected him. If a prophet could be deceived by a fine appearance, so can you. Walk closely enough with God to borrow His eyes."),
    table([
      "What I want (written by my eyes)",
      "What I need (written by my assignment)"
    ], [
      [
        "Tall, fine, wealthy, popular",
        "Someone who prays, because my calling depends on prayer"
      ],
      [
        "Exciting and spontaneous",
        "Someone patient, because my temper needs patience beside it"
      ],
      [
        "Impressive to my friends",
        "Someone who believes in my vision and will build it with me"
      ],
      [
        "Someone who agrees with me",
        "Someone whose strength covers my weakness"
      ]
    ]),
    paragraph("Many people stand in ruined marriages today because they got everything they wanted and nothing they needed."),
    heading(3, "Then, Spirit, Soul and Body"),
    paragraph("Once the three knowings are in place, you can weigh another person. Here the order matters enormously, because most people examine these three levels in exactly the wrong sequence."),
    table([
      "Order",
      "Level",
      "What you are really asking"
    ], [
      [
        "First",
        "Spirit: spiritual compatibility",
        "Are we walking in the same direction with God? Not only \"we are both Christians\", but the same convictions, the same reverence for Scripture, the same willingness to obey."
      ],
      [
        "Second",
        "Soul: character and temperament",
        "How does this person behave under pressure? How do they treat a waiter, a junior, their mother, a stranger who can do nothing for them? How do they handle money, anger, correction and boredom?"
      ],
      [
        "Third, and last",
        "Body: physical attraction",
        "Do I delight in this person? Attraction matters, and God is not against it. But it is the least stable of the three. Bodies change, money can vanish overnight and status can collapse in a season."
      ]
    ]),
    callout("scripture", "\"Your beauty… should be that of your inner self, the unfading beauty of a gentle and quiet spirit, which is of great worth in God's sight.\" — 1 Peter 3:3–4"),
    pullQuote("Put first what lasts longest, and last what fades fastest."),
    paragraph("Notice Peter's word: unfading. Everything visible fades. Character deepens. And do not judge the person in front of you by comparing them to someone else: not to a friend's spouse, not to a former partner, and certainly not to the edited lives you scroll past on your phone. Comparison will make you despise a good gift while you chase an illusion."),
    divider(),
  ],
};

// ─── Nine Areas of Compatibility ───
const section5 = {
  section_number: 5,
  title: "Nine Areas of Compatibility",
  blocks: [
    heading(2, "Section 5 — Nine Areas of Compatibility"),
    callout("scripture", "\"Do two walk together unless they have agreed to do so?\" — Amos 3:3"),
    paragraph("Opposites may attract, but it is likeness that endures. Researchers have long observed that people tend to marry partners of similar background, education and religious values, and shared values make the daily work of a shared life far easier. Here are the nine areas to examine before the ring. This module introduces each one. Several have a whole module of their own later in this track."),
    table([
      "Area",
      "The question to ask now",
      "Where this track goes deeper"
    ], [
      [
        "1. Spiritual beliefs",
        "Same Lord, same direction, comparable depth?",
        "This module, below"
      ],
      [
        "2. Values and convictions",
        "Do we live out our faith the same way in small daily decisions?",
        "This module, below"
      ],
      [
        "3. Children",
        "Do we both want children? When, how many, and what if they do not come?",
        "Module 10 — Children & Fertility"
      ],
      [
        "4. Finances",
        "Saver or spender? Generous or tight? Risk-taker or careful?",
        "Module 7 — Money & Obligation"
      ],
      [
        "5. Role expectations",
        "Who does what, and who decides what when we disagree?",
        "Module 6 — Roles & Work"
      ],
      [
        "6. Communication",
        "Can we really talk, and what is our plan when we reach a deadlock?",
        "Module 5 — Words & Conflict"
      ],
      [
        "7. Character and personality",
        "Energy, habits, punctuality, order, dependability: can I live with this rhythm for fifty years?",
        "This module, Section 6"
      ],
      [
        "8. Family and in-laws",
        "What does each of us owe our family, and who expects to be consulted in our home?",
        "Module 8 — Family & In-Laws"
      ],
      [
        "9. Sex and body",
        "Can we speak honestly about sex at all, before the wedding?",
        "Module 9 — Sex & Body"
      ]
    ]),
    heading(3, "Equally Yoked"),
    callout("scripture", "\"Do not be yoked together with unbelievers.\" — 2 Corinthians 6:14"),
    paragraph("God chose a farming image. A yoke joins two oxen side by side to pull one plough. When they are equally matched, the furrows run straight. Yoke a strong ox to a weak one, or a willing ox to a stubborn one, and they do not plough half a field. They go in circles, and the whole work is spoiled. Two people pulling one life are the same. If you are not on the same page spiritually, you will go in circles."),
    paragraph("Pastor Keith Battle puts it memorably: know who your Master is and what your mission is before you select your mate, because a mate who cannot support your mission will give you a mess."),
    paragraph("Someone always raises a hand here: \"Pastor, I know a woman who married an unbeliever, and years later he got gloriously saved.\" Perhaps you do. God is merciful, and I have witnessed such stories myself. But the exception is not the norm, and you do not build your covenant on someone else's miracle. For every testimony of the spouse who got saved, there are many untold stories of believers who spent decades praying alone, worshipping alone and raising children in a divided house. Do not gamble your destiny on the exception."),
    callout("warning", "\"Missionary dating\" (courting an unbeliever in the hope of converting them) builds a covenant on a hope, not a foundation. You cannot be someone's partner and their evangelist at the same time. Let them meet Christ first, through someone else, and let time show whether it is real."),
    heading(3, "Test the Small Scenarios"),
    paragraph("This surprises many believers: two genuinely strong Christians, even from the same church, can still clash every day over how faith is lived out. Doctrine is not the same as daily conviction, and marriage is made of small scenarios. Do not assume you know what the other person believes. Ask, and listen to how they would handle each one."),
    table([
      "Ask each other",
      "What it reveals"
    ], [
      [
        "How will we feed a family well on a tight budget? Do we cook or eat out?",
        "Values, money and discipline"
      ],
      [
        "Is it rude to decline food at a relative's table?",
        "Family culture and boundaries"
      ],
      [
        "What do we watch and read in our home, and what do we refuse?",
        "Convictions about holiness"
      ],
      [
        "What does a good Saturday look like? A good Sunday?",
        "Rhythm, rest and worship"
      ],
      [
        "How do we dress, and does it matter?",
        "Conscience and culture"
      ],
      [
        "Who in our families do we help financially, and how much?",
        "Obligation and generosity"
      ]
    ]),
    callout("tip", "Try this exercise, adapted from the Christian counsellor H. Norman Wright. Each of you, separately, writes down your expectations for roles in marriage: who cooks, who manages money, who disciplines the children, who leads family prayer, who decides when you disagree. Then sit together and compare your papers. The gaps you find on paper are the same gaps that would otherwise have surprised you in the kitchen, the bedroom and the bank."),
    callout("warning", "A word that must be said plainly. Many African men are raised from boyhood to dominate. Talk about this openly before you marry. Biblical headship is sacrificial service, never domination, and biblical submission is offered freely to servant leadership, never forced. Nothing in the teaching of roles ever obliges anyone to stay under violence or abuse. Where there is abuse, safety comes first, and wise counsel immediately."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Of the nine areas, which have we honestly discussed, and which have we been avoiding?",
      "On a scale of 1 to 10, how sure am I that we are equally yoked, not only in belief but in obedience?",
      "Which small scenario do I most fear asking about, and why?"
    ]),
    divider(),
  ],
};

// ─── Seeing Clearly ───
const section6 = {
  section_number: 6,
  title: "Seeing Clearly",
  blocks: [
    heading(2, "Section 6 — Seeing Clearly"),
    image("/images/marriage/module-3/MM3-3.png", "A young African man and woman talk warmly on a wooden bench outside a church in the late afternoon, she with a Bible on her lap and her chin on her hand as she listens. An older couple sit together on a bench in the background. No text appears in the image."),
    paragraph("Dating and courtship are not entertainment that happens to end in a decision. They are the decision, taken slowly, in public, with your eyes open. The great danger of this season is not that you will fail to see the person clearly. It is that you will see them clearly and then quietly overrule what you saw, because what you felt was louder."),
    pullQuote("What is cute at twenty-five is expensive at forty. Attraction opens the door. Discernment decides whether to walk through it."),
    heading(3, "Seven Evidences Worth More Than Your List"),
    paragraph("Stop looking for a list of preferences and start looking for a list of evidences. These apply to men and women alike, and you had better be able to pass them yourself."),
    table([
      "Evidence",
      "How to see it"
    ], [
      [
        "1. A faith they own",
        "Do they pray when no one is watching? Do they know God, or only church? If you stopped reminding, inviting and forwarding sermons, what faith would remain? That is their actual faith."
      ],
      [
        "2. Emotional health, not only warmth",
        "Warmth is easy to see. Health takes longer. Can they be disappointed without punishing you? Can they say the hard thing directly, instead of through silence?"
      ],
      [
        "3. How they handle correction",
        "Correct them gently about something small and watch. Do they consider it, defend against it, or make you pay for it?"
      ],
      [
        "4. How they treat people who can do nothing for them",
        "The waiter, the security guard at the gate, the house help, the junior at church. If they are kind to you and cold to them, you have simply not yet joined the people they are cold to."
      ],
      [
        "5. Their family script",
        "Everyone carries a picture of marriage from the home they grew up in. Are they repeating it, or violently reacting against it, and do they know which?"
      ],
      [
        "6. Their relationship with money and truth",
        "How they spend and how they speak. Faithful in small things means faithful in large ones. Someone who lies easily about small things has told you everything."
      ],
      [
        "7. Whether they are going somewhere",
        "Do they have a vision and an assignment that was moving before you arrived? Two people with nothing to do will not build a home. They will only share a boredom."
      ]
    ]),
    table([
      "Three common misreadings",
      "The truth"
    ], [
      [
        "Mistaking beauty for peace",
        "You are drawn to a face and then tell yourself a story about the character behind it. Beauty is real, and it predicts nothing."
      ],
      [
        "Mistaking expressiveness for depth",
        "Weeping in worship, praying loudly and posting Scripture may be depth, or may be temperament. Depth is measured on a Tuesday, in obedience nobody applauded."
      ],
      [
        "Mistaking availability for readiness",
        "That someone wants you is not evidence that they are ready for you. Many people are ready to be married and not yet ready to be a husband or a wife."
      ]
    ]),
    heading(3, "Red Flags Are Not to Be Explained Away"),
    paragraph("The most dangerous words in a struggling relationship are \"but I love them\", because love misused becomes the excuse that silences every warning. A red flag is God's mercy giving you information early. Do not decorate it. Do not spiritualise it. Do not rename it \"a rough patch\" or \"they are just stressed\". Read it."),
    table([
      "Red flag",
      "What it is telling you"
    ], [
      [
        "They frighten you, even a little",
        "Fear is information, not weakness. If they scare you while dating, marriage will not soften them. It will only hand their worst self a key to your life."
      ],
      [
        "They cannot be corrected",
        "Anyone who turns defensive, cold or explosive when challenged will eventually become controlling."
      ],
      [
        "They control your time, friends, phone or choices, and call it love",
        "Control dressed as care is still control."
      ],
      [
        "They pressure your body and test your boundaries",
        "Someone who will not honour your no is telling you who they are."
      ],
      [
        "They are warm, then cold; present, then gone",
        "Intensity is not stability."
      ],
      [
        "Their words and their life do not match",
        "Secrecy is not privacy. Secrecy is a warning."
      ],
      [
        "They are sorry every time and different no time",
        "Tears are not evidence. Regret weeps. Repentance changes the pattern."
      ]
    ]),
    callout("warning", "If someone you are with frightens you, controls you, watches you or hurts you, please do not wait. You do not need to build a legal case to walk away. Speak to a trusted pastor or counsellor, and contact local emergency services if you are in danger. Peace is permission."),
    heading(3, "Moving, or Not Moving?"),
    paragraph("This teaching has sometimes been used to make people harsh, so let me guard it. Scripture never asked you to marry a finished person. There are none. The question is never \"Have they arrived?\" The question is \"Are they moving, and are they moving without me pushing?\""),
    table([
      "You may wait, if...",
      "You must walk, if..."
    ], [
      [
        "They are moving on their own, compared with themselves twelve months ago",
        "They are not moving at all, or every step is your step"
      ],
      [
        "They own their faith without your engine",
        "They promise to change after the bride price, after the wedding, or after the child comes"
      ],
      [
        "They are accountable to people who are allowed to correct them",
        "They treat your standards as a phase to outlast"
      ],
      [
        "The waiting has a defined end and a defined standard",
        "You are afraid of them"
      ]
    ]),
    paragraph("Walking away from someone who will not move is not a failure of faith. It is the highest exercise of it, because it is the moment you hand them back to the only One who was ever able to change them. You were never their saviour."),
    callout("note", "The rescuer's marriage: choosing someone for their wounds rather than their character, because being their hero feels easier than being their equal, and because a wounded person seems less likely to leave. Men fall into this as often as women. You cannot heal the person you marry. Only Christ can, and usually before the vows, not because of them."),
    paragraph("Alexandra Redcay has worked for nearly two decades in mental health and child welfare, and consults on building healthy relationships. In this TEDx talk she asks why so many people choose partners quickly and emotionally, then ignore the red flags and try to change the person afterward, and why the same painful pattern repeats."),
    videoEmbed("jodhovumkHQ", "Select the right relationship | Alexandra Redcay | TEDxUpperEastSide"),
    callout("tip", "A short talk. Redcay does not speak from a Christian perspective, but her diagnosis matches this section closely: the problem is usually not a lack of good people, but how we select, and what we refuse to see. As you listen, write down any pattern you recognise in your own history."),
    pullQuote("Love is not blind. Love that refuses to see is fear wearing love's face. See clearly, then love bravely."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Which of the seven evidences can I honestly confirm in the person I am considering? Which can I not yet see?",
      "Where have I been calling a red flag \"just a rough patch\"?",
      "Is my peace telling me something my heart keeps overruling?"
    ]),
    divider(),
  ],
};

// ─── The Conversation Nobody Wants First ───
const section7 = {
  section_number: 7,
  title: "The Conversation Nobody Wants First",
  blocks: [
    heading(2, "Section 7 — The Conversation Nobody Wants First"),
    paragraph("There is a conversation that feels entirely unromantic and may matter more than any other in this module, because it can decide whether two people should marry at all. Start with genotype, because in our part of the world it carries a child's whole life inside it."),
    table([
      "If both of you carry the sickle cell trait (AS + AS), with every pregnancy:",
      "Chance"
    ], [
      [
        "A child born with sickle cell disease (SS)",
        "1 in 4"
      ],
      [
        "A child who carries the trait, as you do (AS)",
        "1 in 2"
      ],
      [
        "A child with neither the disease nor the trait (AA)",
        "1 in 4"
      ]
    ]),
    paragraph("Those odds do not improve with the second child or the fourth. They reset, in full, every single time. A couple who have had two healthy children have not escaped anything. They have simply not yet met the quarter."),
    paragraph("Let me say this plainly, because I have watched it go the other way and I have sat with the family afterward. This is not a matter for faith declarations. God is not honoured when two people who know the risk march into it and then ask Him to suspend the genetics He authored. Nothing in Scripture asks you to test God with a child's body."),
    pullQuote("Faith is not refusing to read the result. Faith is being willing to act on what the result says."),
    table([
      "Your medical homework before engagement",
      "Done?"
    ], [
      [
        "Both of you tested for genotype recently, at a laboratory, with the papers in your own hands. Not what your mother once said, and not a test you half remember from age fourteen.",
        "☐"
      ],
      [
        "If you are both AS: proper counsel together, medical and pastoral, before you go any further",
        "☐"
      ],
      [
        "Family health history on both sides: diabetes, blood pressure, mental illness, epilepsy, cancers, anything hereditary",
        "☐"
      ],
      [
        "Any current condition or long-term medication, and an honest conversation about what caring for it may ask of the other person in ten years",
        "☐"
      ],
      [
        "Any past sexual history that has medical consequences, disclosed and tested for",
        "☐"
      ]
    ]),
    paragraph("Couples who discover they are both AS respond in different ways. Some go forward with their eyes open, with counsel and with the means to care for a child who may suffer. Others conclude, before God, that they should not marry each other. Both are honest. What is not honest is going ahead without knowing."),
    callout("info", "The duty to disclose. If you know something about your health that would change this person's decision, they are entitled to know it before the vows, not after. Module 2 said this about your past. It is just as true about your body. What you discover early, you can deal with. What you hide from deals with you."),
    callout("note", "Children, fertility and family planning each have a full module later in this track (Module 10). For now, settle one question: if children do not come easily, will we carry it together, whatever the cause? In our culture the blame for childlessness falls on the wife almost automatically, and very often it is not hers to carry. Decide now that it will be ours."),
    divider(),
  ],
};

// ─── The Fifteen Convictions ───
const section8 = {
  section_number: 8,
  title: "The Fifteen Convictions",
  blocks: [
    heading(2, "Section 8 — The Fifteen Convictions"),
    paragraph("Now we go deeper than compatibility, to conviction. Conviction is your anchor in the storm. It is what you return to when doubt and fear arrive, the memory that steadies you when you have options and reasons to give up. Feelings will not survive the third year of a hard season. Conviction will. Before you commit, walk through these fifteen questions slowly, and do not move on from any of them until you can answer with a settled heart."),
    table([
      "Conviction",
      "The question",
      "A word of warning"
    ], [
      [
        "1. God's leading",
        "Am I sure God is leading me into this?",
        "Do not hang your destiny on dreams, visions and prophecies alone. Depend on God's Word, settled inner peace and the counsel of proven spiritual leaders."
      ],
      [
        "2. Conversion",
        "Is this person truly a child of God, in life and not only in vocabulary?",
        "Check for fruit, not charisma. Someone who prays for hours but still explodes in anger may yet become violent."
      ],
      [
        "3. Love",
        "Is this self-giving love, or desire wearing love's clothes?",
        "Can it stand time, distance, difficulty and delay without demanding payment?"
      ],
      [
        "4. Character",
        "Can I live with who they are today, not who I hope they will become?",
        "People rarely improve after marriage, because the courtship performance ends. Never marry a project."
      ],
      [
        "5. Trust",
        "Are they honest and faithful in small things?",
        "Small things are where truth is cheapest and most revealing."
      ],
      [
        "6. Observation",
        "Have I seen them in ordinary life, under pressure, with family, when they lose, when they are told no?",
        "Love is blind, but marriage is an eye-opener. Open your eyes now, while it still costs little."
      ],
      [
        "7. Knowledge",
        "Do I know their history, family, finances, faith and wounds?",
        "A covenant deserves all the information."
      ],
      [
        "8. Time",
        "Have we given this enough time?",
        "Marry like lightning and you may end up with thunder."
      ],
      [
        "9. Friendship",
        "Are we truly friends? Do we laugh, forgive quickly and talk for hours?",
        "Marry your friend. Do not marry a stranger."
      ],
      [
        "10. Agreement",
        "Have we agreed on church, where to live, children, health and the place of in-laws?",
        "If you have no voice in this relationship, leave. A covenant has two voices, or it is not a covenant."
      ],
      [
        "11. Medical",
        "Have we done the medical homework in Section 7?",
        "Do not \"faith\" everything."
      ],
      [
        "12. Prayer",
        "Have I prayed genuinely open to hearing no?",
        "Not praying for God to bless what I have already decided."
      ],
      [
        "13. Counsel",
        "Have I received counsel from people with proven wisdom, healthy marriages and no stake in flattering me?",
        "Allow your pastor and your parents into the decision."
      ],
      [
        "14. Training",
        "Have we actually prepared: premarital counselling, books, honest study?",
        "You would not fly with a pilot who never trained. Six months of premarital preparation is a reasonable minimum."
      ],
      [
        "15. Conflict",
        "Have we had real disagreements and learned to resolve them?",
        "If you have been together more than six months and never had a misunderstanding, one of you is pretending."
      ]
    ]),
    paragraph("Do not go into a marriage if you still have doubts. Do not be afraid of what people will say. It is your life and your destiny. Do not play with it."),
    heading(3, "Three Good Endings"),
    paragraph("In our premarital course we tell every couple at the start that the course has three good endings, not one: proceed with wisdom, pause for growth, or separate in peace. All three are success. An engagement that pauses so that something can heal has not failed. A courtship that ends because the convictions could not be answered has done exactly what courtship is for."),
    pullQuote("A cancelled wedding is infinitely cheaper than a broken covenant."),
    callout("tip", "If you are married: these fifteen convictions are not a test you can fail after the fact. You have made your covenant, and God holds you to it and holds it for you. Use the list to find the areas that were never settled before you married, and settle them now, together, with help where you need it. Many couples build in marriage the convictions they skipped in courtship."),
    divider(),
  ],
};

// ─── Am I Choosing Well? ───
const section9 = {
  section_number: 9,
  title: "Am I Choosing Well?",
  blocks: [
    heading(2, "Am I Choosing Well?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are not in a relationship, rate how ready you are to apply each one. If you are married, rate how true each one is of your marriage now."),
    scorecard("Am I Choosing Well?", "marriage_module3_choosing", [
      {
        "key": "finding",
        "max": 10,
        "label": "I am finding, not chasing: tending my assignment rather than hunting for a partner",
        "helpText": "How much of your energy goes into searching rather than growing?"
      },
      {
        "key": "infatuation",
        "max": 10,
        "label": "I can tell the difference between infatuation and love in my own heart",
        "helpText": "Does the feeling grow as you know the person better?"
      },
      {
        "key": "time",
        "max": 10,
        "label": "I am letting time test this relationship rather than rushing it",
        "helpText": "Who or what is setting the pace?"
      },
      {
        "key": "order",
        "max": 10,
        "label": "I weigh spirit first, character second and attraction last",
        "helpText": "Which one did you actually notice first?"
      },
      {
        "key": "yoked",
        "max": 10,
        "label": "We are equally yoked in faith and in obedience",
        "helpText": "Same Lord, same direction, comparable depth?"
      },
      {
        "key": "areas",
        "max": 10,
        "label": "We have honestly discussed all nine areas of compatibility",
        "helpText": "Which area have you been avoiding?"
      },
      {
        "key": "redflags",
        "max": 10,
        "label": "I am not explaining away any red flag",
        "helpText": "Is there a warning you keep renaming?"
      },
      {
        "key": "medical",
        "max": 10,
        "label": "We have done the medical homework, genotype included",
        "helpText": "Have you both seen current laboratory results?"
      }
    ]),
    callout("tip", "Look at your lowest score. That is the conversation to have, or the work to do, before your next step."),
    divider(),
  ],
};

// ─── Module 3 Assignment — See Clearly, Choose Deliberately ───
const section10 = {
  section_number: 10,
  title: "Module 3 Assignment — See Clearly, Choose Deliberately",
  blocks: [
    heading(2, "Module 3 Assignment — See Clearly, Choose Deliberately"),
    assignmentPrompt({
      "title": "Module 3 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If anything you write raises a concern about your safety, speak to a trusted pastor or counsellor before you take any other step.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "Finding or Chasing?",
          "guidance": "Describe your honest posture toward marriage right now. Are you finding or chasing? What is the assignment God has given you in this season, and what would tending it faithfully look like this month? Married: describe the posture you had when you chose your spouse, and what you were really looking for."
        },
        {
          "number": 2,
          "heading": "Want and Need",
          "guidance": "Write two columns. In the first, list five things you want in a spouse. In the second, list five things your calling, temperament and weaknesses actually need beside them. Circle the items on the first list that a person could have without having anything on the second.",
          "example": "Example: \"Want: someone exciting. Need: someone patient, because my temper flares quickly.\""
        },
        {
          "number": 3,
          "heading": "The Nine-Area Audit",
          "guidance": "Courting or engaged: go through the nine areas of compatibility in Section 5. For each one, write one sentence on what you know and one on what you have not yet discussed. Name the two areas you will discuss first, and when. Single: write the question you will ask about each area when the time comes. Married: name the area you never examined before the wedding, and one step you will take to settle it together."
        },
        {
          "number": 4,
          "heading": "Convictions and Red Flags",
          "guidance": "Read the fifteen convictions in Section 8 and the red flags in Section 6. Write down every conviction you cannot yet answer with a settled heart, and any red flag you have been explaining away. For each, write the next honest step: a conversation, a test, a counsellor, more time, or a decision. If you can answer all fifteen and see no red flags, write who has confirmed that judgement for you."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Choosing Well", [
      {
        "id": "q1",
        "prompt": "What does the word \"finds\" in Proverbs 18:22 teach about choosing a spouse?",
        "options": [
          {
            "id": "a",
            "text": "Search harder and more widely"
          },
          {
            "id": "b",
            "text": "Walk with God and tend your assignment, rather than anxiously chasing"
          },
          {
            "id": "c",
            "text": "Wait passively and do nothing"
          },
          {
            "id": "d",
            "text": "Let your family choose for you"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: Adam was asleep and Rebekah was at work. Chasing is what we do when we do not trust God's timing."
      },
      {
        "id": "q2",
        "prompt": "What did Denis's \"three girls in one year\" have in common?",
        "options": [
          {
            "id": "a",
            "text": "Their strong faith"
          },
          {
            "id": "b",
            "text": "Their families knew each other"
          },
          {
            "id": "c",
            "text": "He was near them and they were beautiful, but he barely knew their characters"
          },
          {
            "id": "d",
            "text": "They were all from Yaoundé"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 2: nearness and beauty manufacture certainty. Love grows as a person becomes known."
      },
      {
        "id": "q3",
        "prompt": "In Sternberg's model, why is \"fatuous love\" the most dangerous combination for someone choosing a spouse?",
        "options": [
          {
            "id": "a",
            "text": "It has no passion"
          },
          {
            "id": "b",
            "text": "It makes a commitment on passion before intimacy, so the promise is made to a stranger"
          },
          {
            "id": "c",
            "text": "It is only friendship"
          },
          {
            "id": "d",
            "text": "It never lasts more than a month"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Passion plus commitment without intimacy is the whirlwind engagement."
      },
      {
        "id": "q4",
        "prompt": "What did the \"Before I Do\" research find about sliding versus deciding?",
        "options": [
          {
            "id": "a",
            "text": "It makes no difference"
          },
          {
            "id": "b",
            "text": "Couples who slid had happier marriages"
          },
          {
            "id": "c",
            "text": "People who made a deliberate decision about a major step, rather than drifting into it, reported higher-quality marriages"
          },
          {
            "id": "d",
            "text": "Only wedding size mattered"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 3: the act of deciding sets couples up to make stronger commitments."
      },
      {
        "id": "q5",
        "prompt": "In what order should a potential spouse be weighed?",
        "options": [
          {
            "id": "a",
            "text": "Attraction, character, faith"
          },
          {
            "id": "b",
            "text": "Faith, attraction, character"
          },
          {
            "id": "c",
            "text": "Spirit first, character second, physical attraction last"
          },
          {
            "id": "d",
            "text": "Money, family, faith"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 4: put first what lasts longest, and last what fades fastest."
      },
      {
        "id": "q6",
        "prompt": "What does the image of the yoke in 2 Corinthians 6:14 teach?",
        "options": [
          {
            "id": "a",
            "text": "Marriage is a burden"
          },
          {
            "id": "b",
            "text": "Two people unequally matched in faith end up going in circles instead of ploughing straight"
          },
          {
            "id": "c",
            "text": "Husbands should carry all the weight"
          },
          {
            "id": "d",
            "text": "Farming is a good career"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: same Lord, same direction, comparable depth. Do not build on someone else's miracle."
      },
      {
        "id": "q7",
        "prompt": "Which of these is a sign you must walk away rather than wait?",
        "options": [
          {
            "id": "a",
            "text": "They are growing on their own compared with a year ago"
          },
          {
            "id": "b",
            "text": "They are accountable to people who can correct them"
          },
          {
            "id": "c",
            "text": "They promise to change after the wedding, and you are afraid of them"
          },
          {
            "id": "d",
            "text": "They are not yet perfect"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 6: someone who changes only under the pressure of losing you has negotiated, not changed. Fear is information."
      },
      {
        "id": "q8",
        "prompt": "If both partners are AS, what is the chance of a child with sickle cell disease in each pregnancy?",
        "options": [
          {
            "id": "a",
            "text": "1 in 4, every pregnancy"
          },
          {
            "id": "b",
            "text": "1 in 4 for the first child only"
          },
          {
            "id": "c",
            "text": "1 in 10"
          },
          {
            "id": "d",
            "text": "None, if the couple prays"
          }
        ],
        "correct_option_id": "a",
        "explanation": "Section 7: the odds reset in full with every pregnancy. Faith is acting on what the result says."
      }
    ]),
    divider(),
  ],
};

// ─── Module 3 Complete ───
const section11 = {
  section_number: 11,
  title: "Module 3 Complete",
  blocks: [
    heading(2, "Module 3 Complete"),
    image("/images/marriage/module-3/MM3-4.png", "A young African couple, seen from behind, walk side by side along a red-earth path between green fields toward the rising sun, not touching, with long shadows stretching behind them. No text appears in the image."),
    videoPlaceholder("2-3 min closing from Denis and Arit: how they knew, what they tested, and a prayer for wisdom over everyone making this choice."),
    paragraph("You have learned to tell infatuation from love, to let time test what feelings promise, to weigh spirit, soul and body in the right order, to examine nine areas honestly, to read red flags without excuses, and to test your choice against fifteen convictions. That is not cold. That is love with its eyes open."),
    paragraph("Module 4 turns from choosing a person to loving one. If marriage is God's idea, He is the one who can teach us how to love, and most of us have far more to learn than we think."),
    callout("info", "Next: Module 4 — Teach Me How to Love. Before you begin, finish your assignment. If you are courting or engaged, book the genotype test this week if you have not already."),
  ],
};

// ─── Assemble ───

const module3 = {
  module_number: 3,
  slug: "choosing-well",
  title: "Choosing Well",
  subtitle: "Infatuation, Compatibility, and the Convictions Before the Ring",
  track_slug: "marriage",
  pillar: "personal-foundation",
  pillar_id: "00000000-0000-0000-0002-000000000011",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 120,
  sort_order: 3,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11],
};

const total = module3.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 3 — "${module3.title}"`);
module3.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module3_marriage.json", JSON.stringify(module3, null, 2));
console.log("\nWritten to module3_marriage.json");
