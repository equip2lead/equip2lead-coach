// Marriage Module 4 — "Teach Me How to Love"
// Ported on 2026-11-04 from build_module4_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module4.js
//
// Writes module4_marriage.json to the current directory.
//
// Two changes from the authored source. The Chapman and Gottman videos are left out,
// because no candidate was on an official channel in the oEmbed check of 2026-11-04.
// With the Chapman video gone, its tip now opens "Ask yourself two questions" instead
// of "As you listen, ask two questions". The privacy wording already says the partner
// cannot see the reflections, ratings and assignment.

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
// public/images/marriage/module-4/MM4-1..3.png.
const imagePlaceholder = (ref, brief) => callout("note", `[IMAGE PLACEHOLDER — ${ref}] ${brief}`);
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Teach Me How to Love"),
    paragraph("Module 4 of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min intro from Denis: the prayer that rises from a thousand struggling homes, \"Lord, teach me how to love\", and why the One who invented marriage is the only One qualified to answer it."),
    callout("info", "Who this is for: Everyone on this track. If you are single or courting, this module shows you what love is before you promise it. If you are engaged, it gives you the habits to carry into your marriage. If you are married, and especially if love has grown cold, Section 8 gives you the method Jesus Himself prescribed for getting it back."),
    callout("info", "Core promise: By the end of this module you will know why most of us were never taught to love, the difference between the four kinds of love, the three levels every love story passes through, how to learn the person you actually married, and seven practical deposits you can begin making this week."),
    callout("info", "Time commitment: About 80 minutes of reading and reflection, plus 30 minutes for the assignment. If you have a partner on this track, Section 6 is worth reading together."),
    divider(),
  ],
};

// ─── Lord, Teach Me How to Love ───
const section1 = {
  section_number: 1,
  title: "Lord, Teach Me How to Love",
  blocks: [
    heading(2, "Section 1 — Lord, Teach Me How to Love"),
    imagePlaceholder("MM4-1", "Content: An older African couple sitting close together on a wooden bench under a mango tree, the husband reading aloud from a worn Bible while the wife listens with her hand on his arm, late afternoon light through the leaves. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    paragraph("There is a prayer that rises out of a thousand struggling homes, sometimes whispered, sometimes wept: Lord, teach me how to be married. Teach me how to love. This module takes that prayer seriously, because everything else in this track depends on the answer."),
    paragraph("The logic is simple. If marriage is God's idea, as Module 1 showed, then God is the only one qualified to teach us how to do it. He designed it. He alone knows what it is for and how it works. And because marriage runs on love, God is the only one who can truly teach us how to love."),
    callout("scripture", "\"Whoever does not love does not know God, because God is love.\" — 1 John 4:8"),
    pullQuote("We do not learn love from films, from music, from our friends, or even from our parents. We learn it from God, because God is love."),
    heading(3, "Why We Do Not Know How to Love"),
    paragraph("Let us begin with an honest confession: most of us do not actually know how to love. It is not mainly because we are wicked. It is because we have never seen it."),
    paragraph("Think about who taught you what love looks like. For many of us the classroom was a broken one. You cannot reproduce what you have never seen. A man cannot become a kind of husband he has never once watched. A woman cannot become a kind of wife no one ever modelled for her. So we arrive at the altar carrying our parents' patterns without ever having chosen them, and with the best intentions in the world we hurt the very person we vowed to cherish."),
    table([
      "What some of us saw growing up",
      "What it quietly taught us"
    ], [
      [
        "A single-parent home, with no husband cherishing a wife",
        "\"I don't know what a loving husband looks like.\""
      ],
      [
        "A father who provided money but never affection",
        "\"Love means paying the bills.\""
      ],
      [
        "A parent present in the house and absent in the heart",
        "\"You can live together and still be alone.\""
      ],
      [
        "Love that was shouted, bargained for, or withdrawn as punishment",
        "\"Love has to be earned, and it can be taken away.\""
      ],
      [
        "A marriage that stayed together but had long since gone cold",
        "\"Staying is enough. Warmth is optional.\""
      ]
    ]),
    pullQuote("We do not hurt the ones we love because we are monsters. We hurt them because we were never taught, and we are repeating the only thing we ever saw."),
    paragraph("This is why \"I love you\" is not enough. Sincerity is not the same as skill. A man may sincerely love his wife and still wound her daily, because sincerity without instruction simply repeats the pattern. What you were never taught, you must now be taught, by God."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "What did the marriages I grew up watching teach me about love, without anyone saying it out loud?",
      "Which of those lessons must I now unlearn?",
      "Where do I see my parents' pattern already showing up in how I love?"
    ]),
    divider(),
  ],
};

// ─── The Slow Drift ───
const section2 = {
  section_number: 2,
  title: "The Slow Drift",
  blocks: [
    heading(2, "Section 2 — The Slow Drift"),
    paragraph("There is a pattern so common that you can almost set your watch by it. Name it now, before it happens to you, or so that you can recognise it if it already has."),
    table([
      "In the beginning",
      "After life begins"
    ], [
      [
        "You are gentle with each other",
        "The tone sharpens"
      ],
      [
        "You overlook faults easily",
        "Things you once overlooked now start a war"
      ],
      [
        "You are patient and attentive",
        "Patience thins; you are tired, edgy, easily provoked"
      ],
      [
        "You are quick to forgive",
        "You keep a quiet record"
      ],
      [
        "Your words build",
        "Your words cut"
      ],
      [
        "You cannot bear to be apart",
        "You can barely stand to be in the same room"
      ]
    ]),
    paragraph("Bills arrive. Children arrive. Exhaustion arrives. Disappointment arrives. And slowly, so slowly that neither of you notices the day it happened, the softness goes out of you. Nobody planned it. Nobody announced it. It simply drifted."),
    pullQuote("Love is rarely murdered. It is neglected to death."),
    paragraph("Understand this now: love that is not deliberately fed will die of natural causes. The drift is the default. That is exactly why love must be learned, chosen and practised, not merely felt."),
    heading(3, "What the Research Shows"),
    paragraph("The psychologist John Gottman has spent decades studying what separates marriages that last from marriages that end. One of his most telling findings is about something very small. Every day, partners make what he calls bids: small attempts to connect. A comment about a bird outside the window. A sigh after a hard call. \"Come and look at this.\" The other person either turns toward the bid, by responding with attention, or turns away, by ignoring it or carrying on with what they were doing."),
    table([
      "Newlywed couples, followed for six years",
      "How often they turned toward each other's bids"
    ], [
      [
        "Couples who were still married",
        "86% of the time"
      ],
      [
        "Couples who had divorced",
        "33% of the time"
      ]
    ]),
    paragraph("The difference between those two groups was not one dramatic event. It was thousands of tiny moments of attention or neglect. That is the slow drift, measured."),
    callout("tip", "Gottman speaks as a researcher, not a pastor, but his finding is a picture of Scripture's \"be devoted to one another in love\" (Romans 12:10). This week, notice your partner's bids. Count how many you turn toward and how many you miss. If you are single, notice the bids of the people closest to you. The habit you build now is the habit you will bring."),
    divider(),
  ],
};

// ─── Four Words for Love ───
const section3 = {
  section_number: 3,
  title: "Four Words for Love",
  blocks: [
    heading(2, "Section 3 — Four Words for Love"),
    paragraph("Part of our confusion is language. In English we have one exhausted little word, love, and we make it carry everything. I love my wife. I love my children. I love football. I love mangoes. One word, doing very different jobs, and doing them badly. The Greeks had several words, and the difference between them is the difference between a marriage that lasts and one that does not."),
    table([
      "The Greek word",
      "What it means",
      "Its strength",
      "Its limit"
    ], [
      [
        "Eros",
        "Desire: romantic and physical attraction",
        "God-given and good; Scripture celebrates it in the Song of Songs",
        "It is a love that wants. It rises and falls with feeling, so it can never hold a marriage together on its own."
      ],
      [
        "Storge",
        "Natural affection: the bond of family and belonging",
        "Warm, familiar and comforting",
        "It is comfortable rather than costly, and comfort alone will not carry a covenant through storms."
      ],
      [
        "Philia",
        "Friendship: companionship, loyalty, shared delight",
        "The happiest couples are, above all, friends",
        "It is built on give-and-take. When one partner stops giving, it begins to starve."
      ],
      [
        "Agape",
        "Self-giving love: the love of God Himself",
        "It gives without counting, chooses the other's good even when they do not deserve it, and keeps its promise when the feeling has gone",
        "None. It is the love a marriage is meant to run on."
      ]
    ]),
    paragraph("Most marriages are built almost entirely on eros. Some manage to add a little philia. But the moment attraction fades or the other person stops being easy to love, the whole structure shakes, because it was never resting on agape at all."),
    pullQuote("Eros brought you together. Only agape will keep you together."),
    callout("scripture", "\"But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.\" — Romans 5:8"),
    paragraph("See the shape of agape in that verse. God did not wait until we were lovely, deserving or grateful. He loved us at our worst, and He gave Himself. Agape is not drawn by beauty. It creates beauty. It does not love someone because they are lovely. It loves them, and makes them lovely."),
    divider(),
  ],
};

// ─── Love in Verbs ───
const section4 = {
  section_number: 4,
  title: "Love in Verbs",
  blocks: [
    heading(2, "Section 4 — Love in Verbs"),
    paragraph("So what does agape look like on an ordinary Tuesday? God has not left us guessing. He gave us a description so precise it works like a curriculum. Notice, as you read it, that almost every word is an action, not an emotion."),
    callout("scripture", "\"Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonour others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs… It always protects, always trusts, always hopes, always perseveres. Love never fails.\" — 1 Corinthians 13:4–8"),
    table([
      "Love is...",
      "On an ordinary Tuesday, that means..."
    ], [
      [
        "Patient",
        "When your spouse is slow, forgetful, or repeats the same fault for the tenth time"
      ],
      [
        "Kind",
        "In tone, not only in deed. Many marriages are damaged not by cruelty but by a sharp tongue in a tired mouth."
      ],
      [
        "Not self-seeking",
        "You stop calculating whose turn it is or who gave more"
      ],
      [
        "Not easily angered",
        "You refuse to become the person who explodes"
      ],
      [
        "Keeps no record of wrongs",
        "You do not keep a filing cabinet of past offences to produce in the next argument"
      ],
      [
        "Always perseveres",
        "You stay when staying is hard, and keep doing the loving thing when it brings no reward"
      ]
    ]),
    callout("tip", "Try this now. Read 1 Corinthians 13:4–8 aloud, but put your own name in place of the word \"love\": \"[Your name] is patient. [Your name] is kind. [Your name] keeps no record of wrongs.\" For most of us, the honest answer is: not yet. That is not condemnation. It is a curriculum. It shows you exactly what God wants to teach you."),
    pullQuote("Love is not mainly something you feel. It is something you do, especially on the days you do not feel it."),
    heading(3, "Love Has Emotions, but Love Is Not Emotional"),
    paragraph("Here is a sentence worth memorising before you memorise your vows: love has emotions, but love is not emotional. Feelings ride in the vehicle. They do not drive it. Godly love is a commitment of the will that carries its emotions, rather than being carried by them. It is not based on everything going right, or on always being happy."),
    paragraph("That is also the whole difference between love and infatuation, which Module 3 explored. Infatuation is emotion pretending to be commitment. Love is commitment that has learned to carry emotion. Shallow roots have never yet held a tall tree."),
    heading(3, "Can You Receive Love?"),
    paragraph("One more honest word. Learn not only how to give love, but how to receive it. Some people cannot be filled no matter how faithfully they are loved. Pouring into them is like carrying water in a basket. So ask yourself both questions: Do I know how to love? And do I know how to receive love?"),
    pullQuote("A leaking basket blames every water-carrier it meets."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Is my love mostly eros and philia, or is agape actually growing in me?",
      "Which line of 1 Corinthians 13, with my name in it, is hardest to say honestly?",
      "When someone loves me well, do I receive it, or do I find a reason it does not count?"
    ]),
    divider(),
  ],
};

// ─── The Three Levels of Love ───
const section5 = {
  section_number: 5,
  title: "The Three Levels of Love",
  blocks: [
    heading(2, "Section 5 — The Three Levels of Love"),
    paragraph("Every love story passes through three levels, and most heartbreak comes from not knowing they exist."),
    table([
      "Level",
      "What it feels like",
      "The danger",
      "The way through"
    ], [
      [
        "1. Enchantment",
        "You are on a cloud. They can do no wrong; their flaws are invisible or even adorable.",
        "Mistaking the ignition for the journey. No car crosses a country on the spark alone.",
        "Enjoy it, and do not make lifelong promises from inside it."
      ],
      [
        "2. Disenchantment",
        "The cloud lands. You see the habits, the moods, the family, the flaws that enchantment hid.",
        "Believing that because the feeling faded, the love has failed. Most relationships die here.",
        "Understand that this is not the end of love. It is the end of illusion, and real love can only begin once illusion dies."
      ],
      [
        "3. Maturity",
        "Your feet are on the ground. You see the person completely, and you choose them completely.",
        "Few; but it must be chosen again and again.",
        "Let feelings come and go like weather while the love rests on a decision anchored in covenant."
      ]
    ]),
    pullQuote("Marry at level one and you marry a stranger wrapped in your own imagination. Walk to level three, and you marry with your eyes open."),
    callout("note", "If you are married and living in disenchantment right now, hear this: you have not married the wrong person because the cloud has landed. You have arrived at the place where real love is finally possible. Sections 8 and 9 show you what to do next."),
    divider(),
  ],
};

// ─── Learning the Person You Actually Married ───
const section6 = {
  section_number: 6,
  title: "Learning the Person You Actually Married",
  blocks: [
    heading(2, "Section 6 — Learning the Person You Actually Married"),
    imagePlaceholder("MM4-2", "Content: An African husband and wife at a kitchen table at night, she talking with open hands and he leaning in and listening closely, a notebook and two cups of tea between them, warm lamplight. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1200×675."),
    videoPlaceholder("2-3 min from Denis and Arit together: the mathematician and the woman who wants to walk the road, and what each had to learn about the other."),
    paragraph("God's school of love is not theoretical. Its lessons are taught at close range, by the actual person you marry. Let me show you from my own home."),
    paragraph("I am a mathematician by wiring. I run calculations in my head, work the steps silently, and simply announce the result. And I am a visionary by calling: I often see the end of a matter before most people around me realise there is a matter at all. God has used this again and again in ministry. But you can imagine what it does inside a marriage."),
    paragraph("My wife, Arit, wants to be part of the process. She does not just want the answer handed down; she wants to walk the road with me, to hear the steps, weigh the options and feel the decision forming. I, having already arrived at the end, would grow impatient. Why can't you see what I see? And she pushed back, rightly: \"You are too impatient. I am your wife. I am not one of your projects.\""),
    paragraph("Those words stopped me. In God's school, that moment was not an interruption of my calling. It was the curriculum. I had to learn that her processing out loud is not slowness; it is how God made her, and her questions along the road have caught, more times than I can count, what my leap to the end had missed. She had to learn that my announcing conclusions is not arrogance; it is how God made me. Neither of us needed to become the other. We needed to learn each other."),
    pullQuote("The very gift God put in you can wound the person God gives you, if you love them your way instead of theirs."),
    paragraph("Agape does not demand that the other person become you before it loves them. It studies them. It learns their language. It makes room. You will not marry someone like you. You will marry someone unlike you, and God will use that very difference to teach you how to love."),
    heading(3, "Learning Their Code"),
    paragraph("Dr. Emerson Eggerichs, in his book Love and Respect, offers a picture many couples have found helpful: imagine that a wife sees and hears through pink sunglasses and pink hearing aids, and a husband through blue ones. The colours are not a ranking. They mean only that two people can watch the same event, hear the same sentence, and receive two different messages, because God did not make them the same. We will return to his fuller teaching in Module 6."),
    paragraph("The Christian counsellor Dr. Gary Chapman, drawing on years of counselling couples as a pastor, noticed the same thing from another angle. People tend to give love in the way they most want to receive it, and their spouse often receives love in a completely different way. He described five \"love languages\"."),
    table([
      "Love language",
      "What fills them",
      "What wounds them most"
    ], [
      [
        "Words of affirmation",
        "Spoken appreciation, encouragement, specific praise",
        "Criticism, harsh words, silence"
      ],
      [
        "Quality time",
        "Undivided attention: the phone down, eyes up",
        "Distraction, postponed plans, half-listening"
      ],
      [
        "Receiving gifts",
        "A thoughtful token that says \"I thought of you\"",
        "Forgotten occasions, careless gifts"
      ],
      [
        "Acts of service",
        "Help that lightens their load without being asked",
        "Laziness, broken promises to help"
      ],
      [
        "Physical touch",
        "A hand held, an arm around the shoulder, closeness",
        "Neglect, coldness, physical distance"
      ]
    ]),
    callout("tip", "Ask yourself two questions: which language do I speak most naturally, and which does my partner (or the person closest to me) most need? If you are married or engaged, do not guess. Ask them, write down what they say, and believe it, even if it is not what you would have wanted."),
    heading(3, "Arit's Turn"),
    paragraph("In the early days of our marriage, my husband was not a man who remembered anniversaries. I want to say that carefully, because it would be easy to make it sound like neglect, and it was not. It simply was not in him. For me, a day that has been set apart should be marked, and marked out loud."),
    paragraph("So an anniversary came, early on, and I was expecting something. This was not a wife waiting for a husband to read her mind. I had talked about it. He knew. The day arrived anyway, and his posture was: it is just another day."),
    paragraph("A young wife standing where I stood usually goes one of two ways. She swallows it and tells herself it does not matter, and a small cold thing moves into her heart that will still be there in ten years. Or she makes war, and turns the day she wanted to be happy into a day they both remember for the wrong reason. I did neither. It was a special day to me and it needed to be marked. So we went out, we ate, we made the day memorable, not because he had planned it, but because I was not willing to let it pass unmarked. And I did it again the next year. And the year after that."),
    paragraph("Here is the whole lesson, and it took years. He changed. Not because I shamed him, and not because I finally explained myself well enough. Over time he became used to it, and then he began to look forward to it. The celebrating stopped being mine and became ours. Recently he asked me to name something he does that he thinks is love and I do not receive as love. I could not think of one. After all these years he knows what I like and what I do not. That is not romance. It is a man being taught, slowly, by a wife who kept showing him."),
    pullQuote("A thing that matters to you and not to them is not a thing to go silent about, and not a thing to go to war about. Keep it alive yourself, out loud, for as long as it takes."),
    reflectionQuestions("Before You Move On — Your Partner Cannot See This", [
      "Where am I expecting the person I love to become like me, instead of learning their code?",
      "Which love language do I speak most naturally? Which does my partner most need?",
      "Is there something that matters to me that I have gone silent about, or gone to war about? What would Arit's third way look like?"
    ]),
    divider(),
  ],
};

// ─── Love Can Be Grown ───
const section7 = {
  section_number: 7,
  title: "Love Can Be Grown",
  blocks: [
    heading(2, "Section 7 — Love Can Be Grown"),
    paragraph("If love must be learned, then it can also grow. Some of the strongest evidence comes from places where love is expected to grow rather than to strike like lightning."),
    paragraph("In parts of the world where marriages are still arranged, many couples begin with little romantic feeling at all. In 2013 the psychologist Robert Epstein and his colleagues published two small studies of people in arranged marriages, who came from twelve countries of origin and six religions. On a scale of 1 to 10, the love they remembered feeling when they married averaged around 4 to 5. By the time they were interviewed, it averaged around 8.5 to 9. Asked what had made it grow, they pointed above all to commitment, and to watching their spouse make sacrifices for them."),
    callout("note", "These were small studies, and arranged marriage has its own serious dangers, especially when consent is not freely given. The point is not that arranged marriage is better. It is that love behaves like a garden: it grows where commitment and sacrifice water it."),
    callout("scripture", "\"Husbands, love your wives, just as Christ loved the church and gave himself up for her.\" — Ephesians 5:25"),
    paragraph("Christ's love is defined by sacrifice, and sacrifice, it turns out, is exactly how love grows. Our own continent has always known this. An old Akan proverb from Ghana says: marriage is like a groundnut; you must crack it open to see what is inside. Love is not proven from the outside, in the glow of courtship. It is proven in the opening, in the shared, ordinary, tested life within."),
    heading(3, "The Emotional Bank Account"),
    paragraph("The writer Stephen Covey made famous a picture that many Christian marriage teachers now use: every relationship runs on an emotional bank account. Every act of kindness is a deposit. Every harsh word is a withdrawal. A marriage stays healthy only when the deposits never stop."),
    table([
      "Deposits",
      "Withdrawals"
    ], [
      [
        "Listening to the end",
        "Interrupting, or listening only to reply"
      ],
      [
        "Specific appreciation",
        "Criticism, especially in front of others"
      ],
      [
        "A promise kept",
        "A promise broken"
      ],
      [
        "Unhurried time together",
        "Always \"too busy\""
      ],
      [
        "An apology without excuses",
        "Defending yourself every time"
      ],
      [
        "Praying for them aloud",
        "Complaining about them to others"
      ]
    ]),
    pullQuote("Love, learned in God's school, is less like a firework and more like farming: daily, deliberate, and rewarded at harvest."),
    divider(),
  ],
};

// ─── When Love Goes Cold ───
const section8 = {
  section_number: 8,
  title: "When Love Goes Cold",
  blocks: [
    heading(2, "Section 8 — When Love Goes Cold"),
    paragraph("Everything so far has told you what love is. Now we come to what to do. And we begin where most teaching on this subject never goes."),
    paragraph("Notice that God never once commands a feeling. He commands love, over and over, to husbands, to wives, to neighbours, even to enemies. A command you are unable to obey is not a command at all. So every time God tells you to love, He is telling you to do something you are able to do. Watch the verb that follows \"love\" in Scripture: \"For God so loved the world that he gave.\" \"Christ loved the church and gave himself up for her.\" It is almost always gave."),
    paragraph("And here is the passage I most want to put in your hands. It is the Bible's own answer to the question every married person eventually asks: what do I do when the love is gone? Surprisingly, it is not in a marriage text at all. It is Jesus speaking to a church."),
    callout("scripture", "\"You have forsaken the love you had at first. Consider how far you have fallen! Repent and do the things you did at first.\" — Revelation 2:4–5"),
    paragraph("Read what Jesus does not say. He does not say: work up your feelings. He does not say: wait for the affection to return. He gives three steps, and the third is so practical it could be written on a card."),
    table([
      "The step",
      "What it means",
      "What it sounds like"
    ], [
      [
        "1. Remember",
        "Go back in your mind to the season when love was alive, and ask: what was I doing then that I am not doing now? Answer with actions, not moods.",
        "\"I used to call her in the middle of the day for no reason. I used to ask a question and wait for the whole answer.\""
      ],
      [
        "2. Repent",
        "Call it what it is. Not drift, not a hard season, not the children or the economy. You stopped doing things, and nobody made you stop.",
        "\"I stopped. That was my choice, and I am sorry.\""
      ],
      [
        "3. Do the first works",
        "Do those things again, while you still feel nothing. That is when they are medicine rather than decoration. This is not pretending. It is obedience offered before the feeling returns.",
        "\"Today I will call her at lunch, and tonight I will sit with her with my phone in the other room.\""
      ]
    ]),
    pullQuote("The feeling comes back behind the actions, never in front of them. It has never once led. It has always followed."),
    paragraph("I have watched this in my own house and in many others. The method works in the fourth year and in the fortieth. It also works before you are married, because the habits you carry into a marriage are the habits you will have in it."),
    callout("warning", "A warning for the second week. You will miss a day. Then two. What ends most of these attempts is not the missing. It is the shame that follows, which tells you that you are not the kind of person who keeps things up, and that starting again would be hypocrisy. It would not. The couple who misses three days and starts again on the fourth will outlast the couple who quits after one. There is no better season. There is only the next ordinary Tuesday, and what you do on it."),
    callout("warning", "If love has gone cold because of abuse, unfaithfulness or ongoing harm, this method is not the first step. Safety and honest help come first. Speak to a trusted pastor or counsellor, and contact local emergency services if you are in danger."),
    divider(),
  ],
};

// ─── Seven Deposits ───
const section9 = {
  section_number: 9,
  title: "Seven Deposits",
  blocks: [
    heading(2, "Section 9 — Seven Deposits"),
    paragraph("Here is the short answer, and it is deliberately short, because a practice you can remember beats a system you admire. None of these requires you to feel anything on the morning you do them. That is the point."),
    table([
      "The deposit",
      "How to make it",
      "Why it works"
    ], [
      [
        "1. Pray for them out loud, every day",
        "Not about them: for them, in their hearing. Four minutes, not thirty.",
        "Something happens in a person who hears their own name carried to God by the one who loves them."
      ],
      [
        "2. Say it the day you feel it",
        "The warm thing and the hard thing. Do not let the sun go down on either.",
        "Affection stored up arrives too late to be believed; anger stored up becomes bitterness."
      ],
      [
        "3. Praise something specific, daily",
        "Not \"you are wonderful\". Name the thing: the way she handled your mother on the phone, the way he got up with the baby unasked.",
        "Specific praise is evidence that you were actually watching (Proverbs 31:28–29)."
      ],
      [
        "4. Listen to the end",
        "Stop composing your reply while they are still talking.",
        "Most people do not listen to understand. They listen to reply."
      ],
      [
        "5. Ask how they receive love, and believe the answer",
        "Ask directly. Write it down. Do that, not what you would have wanted.",
        "You are not married to yourself."
      ],
      [
        "6. Do one thing each week that costs you and that they will never see",
        "A hidden sacrifice.",
        "A sacrifice they see is a gift. A sacrifice they never discover is formation: it changes the one who makes it."
      ],
      [
        "7. When it goes cold, go back to the first works",
        "Remember, repent, do the things you did at first.",
        "You will need this one long after you have stopped needing the others."
      ]
    ]),
    pullQuote("A marriage lives on deposits made in ordinary weather by people who were tired."),
    divider(),
  ],
};

// ─── The Teacher Himself ───
const section10 = {
  section_number: 10,
  title: "The Teacher Himself",
  blocks: [
    heading(2, "Section 10 — The Teacher Himself"),
    paragraph("So how do you actually learn a love you have never seen? You go to the only One who has it in perfect supply."),
    callout("scripture", "\"We love because he first loved us.\" — 1 John 4:19"),
    paragraph("This is the whole secret. You cannot give what you have not received. A person who has never truly received the love of God will always, sooner or later, demand love from their spouse as though the spouse were God, and no human being can bear that weight. But a person who is being loved by God has something to give away. They can be patient, because they have been endured. They can forgive, because they have been forgiven. They can give without keeping score, because everything they have was a gift they never earned."),
    paragraph("This is why the deepest preparation for marriage is not a course, a checklist or a book, not even this track. It is your own relationship with God. Sit long enough under the love of Christ, and it begins to change how you speak, how you handle offence, how you give and how you stay. He does not merely command you to love. He supplies what He commands."),
    pullQuote("The greatest gift you will ever bring your spouse is not your affection, your money or your promises. It is the depth of your relationship with the God who is love."),
    callout("scripture", "Pray this, and mean it: \"Lord, I do not know how to love. I never truly saw it. Teach me. Love me until I have something to give, and then teach me how to give it away.\""),
    divider(),
  ],
};

// ─── How Am I Loving? ───
const section11 = {
  section_number: 11,
  title: "How Am I Loving?",
  blocks: [
    heading(2, "How Am I Loving?"),
    paragraph("Rate each statement from 0 to 10 as it is true of you today. Your partner cannot see these ratings. If you are single, rate yourself in your closest relationships: family, friends, church."),
    scorecard("How Am I Loving?", "marriage_module4_loving", [
      {
        "key": "pattern",
        "max": 10,
        "label": "I know which unhealthy patterns of love I inherited, and I am unlearning them",
        "helpText": "Which pattern from your childhood still shows up?"
      },
      {
        "key": "agape",
        "max": 10,
        "label": "My love keeps giving when it is not being rewarded",
        "helpText": "When did you last love without getting anything back?"
      },
      {
        "key": "verbs",
        "max": 10,
        "label": "I can put my name in 1 Corinthians 13 and mostly mean it",
        "helpText": "Which line is hardest?"
      },
      {
        "key": "bids",
        "max": 10,
        "label": "I notice and turn toward the small bids for connection",
        "helpText": "How many did you miss yesterday?"
      },
      {
        "key": "code",
        "max": 10,
        "label": "I love the people closest to me in their language, not only in mine",
        "helpText": "Do you know their love language for certain, or are you guessing?"
      },
      {
        "key": "receive",
        "max": 10,
        "label": "I can receive love without discounting it",
        "helpText": "Do you leak?"
      },
      {
        "key": "deposits",
        "max": 10,
        "label": "I make daily deposits even when I do not feel like it",
        "helpText": "Which of the seven deposits did you make this week?"
      }
    ]),
    callout("tip", "Look at your lowest score. Choose one deposit from Section 9 that would raise it, and begin today."),
    divider(),
  ],
};

// ─── Module 4 Assignment — Learn Love, Then Give It ───
const section12 = {
  section_number: 12,
  title: "Module 4 Assignment — Learn Love, Then Give It",
  blocks: [
    heading(2, "Module 4 Assignment — Learn Love, Then Give It"),
    assignmentPrompt({
      "title": "Module 4 Assignment",
      "instructions": "Your partner cannot see this assignment. Write honestly. Answer the version of each prompt that fits your season: single, courting or engaged, or married. If love in your home has gone cold because of harm or abuse, speak to a trusted pastor or counsellor before you work through Prompt 3.",
      "word_min": 250,
      "word_max": 900,
      "prompts": [
        {
          "number": 1,
          "heading": "The Classroom I Grew Up In",
          "guidance": "Describe the marriage or marriages you watched growing up. Name two lessons about love they taught you without anyone saying it out loud. For each, write the truth from Scripture that must replace it."
        },
        {
          "number": 2,
          "heading": "My Name in 1 Corinthians 13",
          "guidance": "Write out 1 Corinthians 13:4–7 with your own name in place of \"love\". Circle the two lines that are least true of you today. For each, describe one specific situation this week where you will practise it.",
          "example": "Example: \"Denis keeps no record of wrongs. This week, when we disagree, I will not bring up what happened last month.\""
        },
        {
          "number": 3,
          "heading": "Remember, Repent, Do the First Works",
          "guidance": "Married or courting: list five specific things you used to do for your partner that you have stopped doing. Write one honest sentence of repentance. Then choose three of them and write when you will do each again this week. Single: list five ways you showed love when a friendship or family relationship was new, and choose one relationship to apply this to."
        },
        {
          "number": 4,
          "heading": "Learning Their Code",
          "guidance": "Married or engaged: ask your partner directly how they most receive love, and what you do that you think is love but they do not receive as love. Write down their answers word for word, and the one change you will make. Single: write your own love language, how you discovered it, and how you would explain it to a future spouse without demanding it."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Module Review: Teach Me How to Love", [
      {
        "id": "q1",
        "prompt": "According to Section 1, why do most of us not know how to love well?",
        "options": [
          {
            "id": "a",
            "text": "Because we are wicked"
          },
          {
            "id": "b",
            "text": "Because we have never seen it modelled, and we repeat the patterns we grew up with"
          },
          {
            "id": "c",
            "text": "Because love cannot be learned"
          },
          {
            "id": "d",
            "text": "Because we marry the wrong people"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Sincerity is not the same as skill. What you were never taught, you must now be taught by God."
      },
      {
        "id": "q2",
        "prompt": "What did Gottman's research find about newlyweds followed for six years?",
        "options": [
          {
            "id": "a",
            "text": "Couples who stayed married turned toward each other's bids about 86% of the time; divorced couples about 33%"
          },
          {
            "id": "b",
            "text": "Big romantic gestures predicted lasting marriages"
          },
          {
            "id": "c",
            "text": "Arguments predicted divorce"
          },
          {
            "id": "d",
            "text": "There was no difference between the groups"
          }
        ],
        "correct_option_id": "a",
        "explanation": "Section 2: love is rarely murdered. It is neglected to death, one missed bid at a time."
      },
      {
        "id": "q3",
        "prompt": "Which kind of love is meant to hold a marriage together?",
        "options": [
          {
            "id": "a",
            "text": "Eros"
          },
          {
            "id": "b",
            "text": "Storge"
          },
          {
            "id": "c",
            "text": "Philia"
          },
          {
            "id": "d",
            "text": "Agape"
          }
        ],
        "correct_option_id": "d",
        "explanation": "Section 3: eros brought you together. Only agape will keep you together."
      },
      {
        "id": "q4",
        "prompt": "What does \"love has emotions, but love is not emotional\" mean?",
        "options": [
          {
            "id": "a",
            "text": "Love should not feel anything"
          },
          {
            "id": "b",
            "text": "Feelings ride in the vehicle but do not drive it; love is a commitment that carries its emotions"
          },
          {
            "id": "c",
            "text": "Emotional people cannot love"
          },
          {
            "id": "d",
            "text": "Love is only a feeling"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: infatuation is emotion pretending to be commitment; love is commitment that has learned to carry emotion."
      },
      {
        "id": "q5",
        "prompt": "What is disenchantment, the second level of love?",
        "options": [
          {
            "id": "a",
            "text": "Proof you married the wrong person"
          },
          {
            "id": "b",
            "text": "The end of illusion, where real love can finally begin"
          },
          {
            "id": "c",
            "text": "The end of love"
          },
          {
            "id": "d",
            "text": "Something only unhappy couples experience"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: most relationships die here because people think the fading feeling means love has failed."
      },
      {
        "id": "q6",
        "prompt": "What did Denis learn from Arit's words, \"I am your wife. I am not one of your projects\"?",
        "options": [
          {
            "id": "a",
            "text": "That she should think more like him"
          },
          {
            "id": "b",
            "text": "That the gift God put in him could wound her if he loved her his way instead of hers"
          },
          {
            "id": "c",
            "text": "That vision is not important in marriage"
          },
          {
            "id": "d",
            "text": "That they were incompatible"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 6: neither needed to become the other. They needed to learn each other."
      },
      {
        "id": "q7",
        "prompt": "In Revelation 2:4–5, what does Jesus prescribe when love has grown cold?",
        "options": [
          {
            "id": "a",
            "text": "Wait for the feeling to return"
          },
          {
            "id": "b",
            "text": "Find a new start"
          },
          {
            "id": "c",
            "text": "Remember, repent, and do the things you did at first"
          },
          {
            "id": "d",
            "text": "Pray until you feel something"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 8: the feeling comes back behind the actions, never in front of them."
      },
      {
        "id": "q8",
        "prompt": "According to 1 John 4:19, where does our ability to love come from?",
        "options": [
          {
            "id": "a",
            "text": "Our upbringing"
          },
          {
            "id": "b",
            "text": "Our personality"
          },
          {
            "id": "c",
            "text": "God first loved us"
          },
          {
            "id": "d",
            "text": "Our spouse's love for us"
          }
        ],
        "correct_option_id": "c",
        "explanation": "Section 10: you cannot give what you have not received. God supplies what He commands."
      }
    ]),
    divider(),
  ],
};

// ─── Module 4 Complete ───
const section13 = {
  section_number: 13,
  title: "Module 4 Complete",
  blocks: [
    heading(2, "Module 4 Complete"),
    imagePlaceholder("MM4-3", "Content: Close-up of an older African couple's hands, both wearing simple gold wedding rings, his hand resting over hers on a well-worn Bible, soft morning light from a window. Style: photorealistic, warm golden light, matching the Leadership track. Dimensions: 1600×900."),
    videoPlaceholder("2-3 min closing from Denis and Arit: one thing each of them still does for the other that began as a decision and became a delight, and a prayer for couples whose love has grown cold."),
    paragraph("You have looked honestly at what you were taught about love, learned the four words and the three levels, put your own name into 1 Corinthians 13, begun to learn the code of the person you love, and been handed the method Jesus gave for love that has grown cold. That is not a lesson you finish. It is a school you stay in for life."),
    paragraph("Module 5 turns to the place where love is tested most often: our words. How we speak, how we listen, and how we fight will decide whether the love you are learning to give can actually be received."),
    callout("info", "Next: Module 5 — Words & Conflict. Before you begin, finish your assignment, and make at least one of the seven deposits today."),
  ],
};

// ─── Assemble ───

const module4 = {
  module_number: 4,
  slug: "teach-me-how-to-love",
  title: "Teach Me How to Love",
  subtitle: "Agape, the Three Levels of Love, and the Deposits That Keep It Alive",
  track_slug: "marriage",
  pillar: "communication-connection",
  pillar_id: "00000000-0000-0000-0002-000000000012",
  is_starting_point: false,
  difficulty: "beginner",
  estimated_duration_minutes: 110,
  sort_order: 4,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12, section13],
};

const total = module4.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 4 — "${module4.title}"`);
module4.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module4_marriage.json", JSON.stringify(module4, null, 2));
console.log("\nWritten to module4_marriage.json");
