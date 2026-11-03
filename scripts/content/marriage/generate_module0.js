// Marriage Module 0 — "Starting Point — Clarity Before Covenant"
// Ported on 2026-11-02 from build_module0_marriage.py into the helper-based shape
// of the Leadership generators, so scripts/verify/check-generators.sh covers it.
//
//   cd <any scratch dir> && node <repo>/scripts/content/marriage/generate_module0.js
//
// Writes module0_marriage.json to the current directory.
//
// One change from the Python builder: the module title is a level 2 heading, not
// level 1. ingest-module.mjs rejects levels outside 2-4 and the renderer has no
// level 1. The splitter files a first level 2 heading with no "Section N" prefix
// under front matter, as it does for Leadership's Module 0, so this module still
// has 10 sections.
//
// The slug is authored rather than derived from the title, because the block ids
// depend on it: sha256(slug|index|type). A Leadership title and a Marriage title
// could otherwise produce the same slug.
//
// The Myles Munroe video, its paragraph and its tip close the first part of Section 2,
// in Denis's wording as run from Claude chat, so the text matches the real video.
// oEmbed check of 5JG0S9jTp78 on 2026-11-04: Munroe Global. The first candidate,
// rfBthtg4D1Y, returned 404, so this is the first that qualified.
// The Meg Jay video, its paragraph and its tip were added to the live row by Denis on
// 2026-11-03, with an UPDATE. Section numbers did not change.

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

// Images are Denis's, used as delivered, in public/images/marriage/module-0/.
const image = (url, alt) => ({ type: "image", data: { url, alt } });

// Video not produced yet stays visible as a callout.
const videoPlaceholder = (brief) => callout("note", `[VIDEO PLACEHOLDER — pending link] ${brief}`);

// ─── Front matter ───
const frontMatter = {
  section_number: 0,
  title: "Front matter",
  blocks: [
    heading(2, "Clarity Before Covenant"),
    paragraph("Starting Point of the Marriage Track · By Dr. Denis & Arit Ekobena / Equip2Lead Coach"),
    videoPlaceholder("3-4 min welcome from Denis (and Arit, if possible): why this journey exists, who it is for, and why it begins with the marriage rather than the wedding."),
    callout("info", "Who this is for: Every couple on this track, wherever you are standing today: in a friendship that is becoming serious, courting, engaged, or already married. The same eight conversations decide a marriage in every season. Only the questions you ask about them change."),
    callout("info", "Core promise: By the end of this Starting Point you will know where you are in the four seasons of a relationship, which of the eight conversations you have truly had and which you have only assumed, and what you are committing to over the next twelve modules."),
    callout("info", "Time commitment: About 45 minutes of reading and 20 minutes for your first assignment. Take it in one sitting or spread it over two evenings."),
    callout("warning", "Your safety comes first. If you are ever afraid of the person you are with, or feel watched, controlled or pressured, this program is not the place to begin. Please speak to a trusted pastor or counsellor, and if you are in danger, contact your local emergency services. Nothing you write here is shared with your partner."),
    divider(),
  ],
};

// ─── The Question Beneath Every Struggling Marriage ───
const section1 = {
  section_number: 1,
  title: "The Question Beneath Every Struggling Marriage",
  blocks: [
    heading(2, "Section 1 — The Question Beneath Every Struggling Marriage"),
    image("/images/marriage/module-0/MM0-1.png", "A woman in a patterned headwrap sits alone at a wooden kitchen table in the evening, her head resting on her hand and her eyes lowered, a cup of tea in front of her. Behind her a doorway opens onto a lamplit, empty living room. No text appears in the image."),
    paragraph("A letter like this one reaches a pastor's desk more often than you would think. The woman who wrote it signed herself simply \"a tired wife.\" She and her husband both worked full days. When they came home, he changed his clothes and went out to relax with his friends. She stayed behind to cook, clean, supervise homework and keep order in a house full of children and relatives."),
    paragraph("Her question was short. \"I earn a salary too. Is it wrong to expect my husband to help me run our home? What are a husband's duties, really? And why do I feel so alone inside my own house?\""),
    paragraph("I have read that letter many times, because it is not really about dishes, or friends, or even about her husband. It is the question that sits underneath almost every marriage that struggles: did either of us understand what we were agreeing to?"),
    paragraph("Her husband probably never prepared to be a husband. He wanted a wife, which is a different thing. And she most likely married a man she had never watched carry the weight of an ordinary week. Two decent people, unprepared, and a home slowly going cold."),
    pullQuote("Most couples spend months preparing for a wedding that lasts one day, and almost no time preparing for a marriage meant to last a lifetime."),
    heading(3, "A Day Versus a Lifetime"),
    paragraph("Think about where the energy goes. The venue, the dress, the guest list, the photographs, the food for three hundred people. Families save for years. Committees meet. Every detail of the ceremony is rehearsed."),
    paragraph("Then two people step into a covenant they have barely discussed. They know the order of the processional. They do not know how they will handle the first month the salary does not stretch, or whose family will be consulted when a decision matters, or what they will do on the night one of them says no."),
    paragraph("We rehearse the party and improvise the marriage. Then we are surprised when the marriage struggles."),
    heading(3, "The Honest Picture"),
    paragraph("You will hear frightening numbers about divorce. Some of them are exaggerated: the claim that seven in ten marriages fail usually confuses the divorces in one year with the marriages in that same year, which is not the same measure at all. I would rather give you the honest picture, because it is sobering enough."),
    paragraph("In the United States, researchers estimate that between four and five of every ten marriages will end in divorce. In some countries divorce remains rare, but marriages that are still legally intact can be cold, lonely or quietly broken. Across much of the world, fewer people are marrying, more are living together instead, and marriage is increasingly treated as something you keep only while it satisfies you."),
    paragraph("When researchers ask couples why their marriages failed, the same reasons come back across very different cultures: weak commitment, constant conflict, unfaithfulness, money pressure, marrying too young, expectations that were never spoken, and, named again and again, a lack of preparation."),
    heading(3, "Does Preparation Actually Make a Difference?"),
    paragraph("It is fair to ask whether any of this works, or whether it is simply a pastor's opinion. The research is encouraging."),
    paragraph("In 2006 the Journal of Family Psychology published one of the largest studies of its kind. The marriage researcher Scott Stanley and his colleagues surveyed a random sample of households across four American states: Oklahoma, Texas, Kansas and Arkansas. Couples who had taken part in premarital education reported more satisfaction and commitment, less conflict, and were about 31 percent less likely to divorce than couples who had not."),
    paragraph("A separate review that combined 23 studies of premarital programmes found roughly a 30 percent improvement in measures of marital strength: better communication, better problem-solving and a stronger sense of partnership in the first years of marriage."),
    table([
      "What the research found",
      "Couples who prepared, compared with those who did not"
    ], [
      [
        "Divorce",
        "About 31 percent less likely (Stanley and colleagues, 2006)"
      ],
      [
        "Satisfaction and commitment",
        "Higher"
      ],
      [
        "Conflict",
        "Lower"
      ],
      [
        "Overall marital strength",
        "Roughly 30 percent stronger (review of 23 studies)"
      ]
    ]),
    callout("note", "An honest note: these studies show that couples who prepare do better, not that a course alone causes it. Couples motivated enough to prepare may already be different. Researchers have looked at that question, and at least one study found that couples who choose preparation are not very different from those who do not, which suggests the preparation itself helps. Either way, the lesson is the same: the couples who take their marriage seriously before it is tested are the ones most likely to still have one when it is."),
    callout("tip", "Lack of preparation is the reason this track exists to confront. Arit and I cannot repair every marriage that has already broken. But we can help you build one that is far less likely to break, or help you rebuild the one you have before it does."),
    paragraph("The psychologist Meg Jay sees the same pattern from a different angle. In her 2013 TED talk, she argues that the years before settling down are not a waiting room. Even though marriage, work and children now come later for many people, the choices that shape them are being made now, and she urges young adults to prepare deliberately instead of drifting."),
    videoEmbed("vhhgI4tSMwc", "Why 30 is not the new 20 | Meg Jay | TED"),
    callout("tip", "About 15 minutes. Meg Jay speaks as a clinical psychologist, not a pastor, and her talk is about the whole of adult life, not only marriage. Listen for her point that the years before you settle down are not wasted time but the time you build on. If you are married, apply it to the season you are in now: the choices you make this year are shaping the next ten."),
    heading(3, "A Throw-Away Age"),
    paragraph("Underneath the statistics is a change in how we think. We live in a consumer culture. When a phone stops pleasing us, we replace it. When a product disappoints, we return it. Very little is expected to last."),
    paragraph("A culture that learns to throw away its possessions eventually learns to throw away its promises. That is not a sermon against modern life. It is a warning that a marriage built only on feeling will be treated like everything else built on feeling: kept while it feels good, discarded when it does not."),
    paragraph("If your marriage is going to last, it has to be built on something stronger than how you feel on a given Tuesday."),
    reflectionQuestions("Before You Move On — Just For You", [
      "If someone close to you described what you are actually preparing for right now (or what you have put most of your energy into since your wedding), would they say the wedding or the marriage?",
      "Which part of the tired wife's letter felt most familiar, either as something you fear or something you already live with?",
      "What have you assumed about marriage that you have never once said out loud to the person you are with?"
    ]),
    divider(),
  ],
};

// ─── Foundations Nobody Photographs ───
const section2 = {
  section_number: 2,
  title: "Foundations Nobody Photographs",
  blocks: [
    heading(2, "Section 2 — Foundations Nobody Photographs"),
    image("/images/marriage/module-0/MM0-2.png", "A building site at sunrise on red earth: concrete foundations and steel reinforcement bars, with no walls yet. A yellow hard hat rests on a plank beside a wheelbarrow and a shovel. No text appears in the image."),
    videoPlaceholder("2-3 min from Denis, ideally filmed on the FIRE headquarters building site in Cameroon: the season when everything went into the ground and nothing could be photographed, and what it taught him about marriage."),
    paragraph("For several years our ministry has been building its headquarters in Cameroon: a church, a school and a hospital on one piece of land. I have stood on that site more times than I can count, and it changed the way I counsel couples."),
    paragraph("For a long season there was nothing to show anyone. Trucks came and went. Money left my hands every week. There was noise and dust and no building. Every bit of work was going down into the ground, not up into the air."),
    paragraph("It would have been easy to be discouraged, and even easier to cut corners. Nobody inspects what gets buried. You could use less cement, skip some of the steel, hurry the work, and for years the building would look exactly like one built properly."),
    paragraph("The difference only appears later, when the walls carry weight, when the rains are heavy, when the ground moves. Buildings do not fall because of what everyone could see. They fall because of what nobody saw."),
    callout("scripture", "\"Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock. The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock.\" — Matthew 7:24–25"),
    pullQuote("A marriage does not collapse because of what everyone can see. It collapses because of what nobody saw."),
    heading(3, "The Wedding Is the Ribbon-Cutting"),
    paragraph("A wedding is the opening ceremony: public, beautiful, photographed from every side. The marriage is the foundation work: slow, hidden, unglamorous and decisive."),
    paragraph("The way you learn to talk now, the way you practise forgiveness now, the honesty you establish now: that is concrete going into the ground. None of your guests will ever see it. Every storm of your life will test it."),
    paragraph("If you are already married, the same is true, only in a different tense. You are not laying a first foundation. You are inspecting the one you have, finding where it was poured thin, and strengthening it while the house is lived in. It is harder work, and it is very possible work, whether you are in the fourth year or the fortieth."),
    paragraph("Dr. Myles Munroe, the Bahamian Bible teacher whose books on singleness and marriage shaped a generation of believers across Africa, taught that singleness is not a waiting room. It is the season God gives you to become whole, to discover your purpose and to build the foundation that a marriage will later rest on. Married or not, his message speaks to the foundation work this section describes."),
    videoEmbed("5JG0S9jTp78", "The Purpose and Priority of Singleness | Dr. Myles Munroe"),
    callout("tip", "As you listen, write down one thing he says that your own foundation still needs. If you are married, apply it in the present tense: what in your foundation needs strengthening now?"),
    heading(3, "It Was God's Idea First"),
    paragraph("Every serious preparation for marriage has to start with the One who invented it."),
    callout("scripture", "\"The Lord God said, 'It is not good for the man to be alone. I will make a helper suitable for him.'\" — Genesis 2:18"),
    paragraph("Marriage was not invented by a culture, a government or a romantic poet. It was not even Adam's idea. God designed it, defined it and gave it its purposes before any of us began rewriting the rules."),
    paragraph("That matters for one simple reason: if marriage is God's design, then He is the one who says what it is and how it works. Not the latest trend, not your parents' disappointments, and not your feelings, which change from week to week. Module 1 is given entirely to this design. For now, hold one idea: you are not inventing marriage. You are learning to build one according to its Maker's plan."),
    pullQuote("Marriage was God's idea before it was ever your desire. Build it His way."),
    reflectionQuestions("Before You Move On — Just For You", [
      "What is one piece of \"foundation work\" in your relationship that you have been tempted to hurry or skip because no one would notice?",
      "If you are married: where do you suspect the concrete was poured thin? If you are not yet married: where do you suspect it might be?"
    ]),
    divider(),
  ],
};

// ─── Four Seasons, in Order ───
const section3 = {
  section_number: 3,
  title: "Four Seasons, in Order",
  blocks: [
    heading(2, "Section 3 — Four Seasons, in Order"),
    image("/images/marriage/module-0/MM0-3.png", "Four stone steps rise through a garden in warm morning light, each more finished than the last, toward an open wooden gate with a lawn beyond it. Pink bougainvillea hangs over the wall. No text appears in the image."),
    paragraph("Let me describe something I see constantly in Cameroon, and I suspect you will recognise it wherever you live. A man tells a woman he would like to marry her. She says yes. From that moment, they introduce each other as fiancé and fiancée, even in church."),
    paragraph("Look at what has actually happened. Two people who hardly know each other are now presenting themselves to everyone as an engaged couple. Nothing has been tested. No friendship has been built. No family has been consulted. There is a feeling, a yes and a title."),
    paragraph("Then the ordinary problems arrive, as they always do, and the relationship breaks. It is no longer two people quietly discovering they are not suited. It is a public engagement falling apart, with all the shame and confusion that brings. They took the title before they had built anything to carry it."),
    pullQuote("A title does not make a relationship. A foundation does, and foundations are built in stages."),
    heading(3, "Why We Say Friendship, Not Dating"),
    paragraph("You will notice that Arit and I avoid the word \"dating.\" That is deliberate. Today the word usually means casual romance, emotional games, and often a physical relationship that treats another person's body as something to explore before any promise has been made."),
    paragraph("A generation or two ago, what our grandparents called keeping company was something else: two people getting to know each other in the open, under the eyes of family and community, with boundaries and with honour. That is what we mean by friendship. It protects the heart, because nothing has been promised that has not been earned. It allows real discovery, because two people who are not entangled can actually see each other. And it honours God, because it treats another person as a trust, not a conquest."),
    heading(3, "The Four Seasons"),
    table([
      "Season",
      "What it is",
      "What it is not",
      "The question it answers"
    ], [
      [
        "1. Friendship",
        "Getting to know each other honestly: questions, observation, prayer, time in ordinary settings",
        "Romantic entanglement, public declarations, physical intimacy",
        "Who is this person, really?"
      ],
      [
        "2. Courtship",
        "Exclusive, intentional and accountable preparation for a possible marriage, with families and mentors involved",
        "A private romance conducted in secret",
        "Could we build a covenant together?"
      ],
      [
        "3. Engagement",
        "A public promise, made after courtship has confirmed character, compatibility and readiness",
        "The start of being serious",
        "Are we ready to make and keep this vow?"
      ],
      [
        "4. Marriage",
        "A covenant for life, built on a tested foundation and still worth checking every few years",
        "The end of the work",
        "Are we still building, or only surviving?"
      ]
    ]),
    paragraph("Notice how the seriousness grows with each season. Friendship carries no obligations: you do not belong to each other, and you are free. Courtship adds exclusivity and accountability: families know, mentors are involved, and secrecy at this stage is itself a warning sign. Engagement is a public promise, which is why it should never be made before the work that makes a promise safe to keep."),
    pullQuote("Engagement is not the beginning of seriousness. It is the fruit of seriousness already proven."),
    heading(3, "If You Are Already Married"),
    paragraph("The seasons do not stop at the wedding. A marriage moves through its own seasons too, and naming them helps."),
    table([
      "Season of marriage",
      "What usually fills it",
      "What it asks of you"
    ], [
      [
        "Planting",
        "The first years: two households becoming one, learning each other's habits, families and money",
        "Lay foundations on purpose instead of by accident"
      ],
      [
        "The years of rain",
        "Children, careers, school fees, ageing parents, ministry demands, often all at once",
        "Keep tending the marriage when everything else is louder"
      ],
      [
        "Harvest",
        "Children standing on their own, pressures easing, a companionship that needs fewer words",
        "Enjoy what you built, and pass it on"
      ]
    ]),
    paragraph("Ask older couples which season was hardest, and many will say the middle: when the children were small, money was short and work was heavy. Children cry when they are hungry. A marriage starves silently. The couples who come through the rainy years well are the ones who protected time, conversation and intimacy deliberately, even when every other demand was shouting."),
    callout("tip", "Wherever you are, this track meets you there. If you are in friendship or courtship, it will help you see clearly before you commit. If you are engaged, it will help you confirm what you are promising. If you are married, it will help you find what has quietly closed since the wedding, and open it again."),
    reflectionQuestions("Before You Move On — Just For You", [
      "Honestly, which season are you in right now? Not which title you are using, but which season the relationship has actually earned.",
      "Did you skip or rush any season? What did that cost, or what might it cost?",
      "If you are married: are you in planting, rain or harvest? What is the rain in your home right now?"
    ]),
    divider(),
  ],
};

// ─── The Eight Doors ───
const section4 = {
  section_number: 4,
  title: "The Eight Doors",
  blocks: [
    heading(2, "Section 4 — The Eight Doors"),
    image("/images/marriage/module-0/MM0-4.png", "A long, warm-lit corridor with eight wooden doors along one wall. The first two stand wide open onto a sitting room and a dining room, the next few are partly open, and the last are closed. No text appears in the image."),
    videoPlaceholder("3-4 min from Denis and Arit together: the Eight Doors, which ones couples most often leave closed, and which door the two of them had to open later than they should have."),
    paragraph("In counselling couples before and after their weddings, Arit and I keep seeing the same thing. Marriages are rarely decided by the big romantic moments. They are decided by a handful of conversations: whether a couple has had them honestly, avoided them, or assumed they agreed without ever checking."),
    paragraph("We call them the Eight Doors. Every one of them leads to a room you will live in together for the rest of your lives. Some couples walk through all eight before the wedding. Most open three or four and leave the rest closed until life forces them open, usually at the worst possible moment."),
    table([
      "Door",
      "The conversation",
      "Where this track opens it"
    ], [
      [
        "1. Faith & covenant",
        "Who leads prayer, what covenant means to each of you, and what happens if one of you cools off spiritually",
        "Module 1"
      ],
      [
        "2. Character & story",
        "Temperament, family of origin, wounds you carry, and what you learned about marriage by watching your parents",
        "Modules 2–3"
      ],
      [
        "3. Words & conflict",
        "How you fight, who leaves the room, and how you repair",
        "Modules 4–5"
      ],
      [
        "4. Roles & work",
        "Whose career moves the family, and who does what at home",
        "Module 6"
      ],
      [
        "5. Money & obligation",
        "Saving and spending, debt, and how much you send home to family each month",
        "Module 7"
      ],
      [
        "6. Family & in-laws",
        "Whose family has a say in your decisions, and who may come to live with you",
        "Module 8"
      ],
      [
        "7. Sex & body",
        "Expectations, history, refusal and health: what neither of you has yet said",
        "Module 9"
      ],
      [
        "8. Children & fertility",
        "How many, when, how you will raise them, and what you will do if children do not come",
        "Module 10"
      ]
    ]),
    heading(3, "Written for Our Context"),
    paragraph("Many marriage programmes were written for couples in very different settings. Ours is written for African couples and for those in the diaspora, and that shows in what we refuse to treat as a footnote."),
    paragraph("In-laws are a full door, not a passing paragraph, because in our part of the world you do not marry an individual. You marry into a household with standing, opinions and claims. Money means obligation, not just budgeting: how much you send to your parents, your siblings' school fees, the cousin who will need help, and whether your partner even knows the figure. And we ask about fertility, because your families certainly will, and because in our culture the blame for childlessness falls on the wife almost automatically, often wrongly."),
    heading(3, "Agreeing by Accident Is Not Agreeing"),
    paragraph("Here is the most important idea in this section. Two people can appear to agree on something simply because they have never discussed it. Each assumes the other sees it the same way. That is not agreement. It is a misunderstanding that has not been discovered yet."),
    paragraph("So for every door we look at three things, not one:"),
    table([
      "What we look at",
      "The question",
      "Why it matters"
    ], [
      [
        "Agreement",
        "How closely do your views actually match?",
        "Shows where you are already aligned"
      ],
      [
        "Discussion",
        "Have you really talked about it, in detail?",
        "Shows the difference between agreeing on purpose and agreeing by accident"
      ],
      [
        "Heat",
        "How charged does the subject feel between you?",
        "Shows which conversations need patience, a mentor, or both"
      ]
    ]),
    callout("warning", "A door where you seem to agree but have never actually talked is not an open door. It is a closed door with the light left on. Those are often the ones that surprise couples most in the first years of marriage."),
    paragraph("You will rate your own doors at the end of this Starting Point. Do not be discouraged by what you find. A closed door is not a verdict against your relationship. It is simply the reason you are here."),
    divider(),
  ],
};

// ─── How This Journey Works ───
const section5 = {
  section_number: 5,
  title: "How This Journey Works",
  blocks: [
    heading(2, "Section 5 — How This Journey Works"),
    paragraph("This track has thirteen parts: this Starting Point and twelve modules, arranged in five pillars. Each pillar builds on the one before."),
    table([
      "Pillar",
      "Modules",
      "What it builds"
    ], [
      [
        "Personal Foundation",
        "1. Marriage Was God's Idea · 2. Know Yourself, Heal Yourself · 3. Choosing Well",
        "The design, the person you bring, and wise choosing"
      ],
      [
        "Communication & Connection",
        "4. Teach Me How to Love · 5. Words & Conflict",
        "Love as a decision, listening, and fighting well"
      ],
      [
        "Partnership & Roles",
        "6. Roles & Work · 7. Money & Obligation · 8. Family & In-Laws",
        "How two lives are run as one household"
      ],
      [
        "Intimacy & Sexuality",
        "9. Sex & Body · 10. Children & Fertility",
        "The body, desire, and the family you may raise"
      ],
      [
        "Growth & Legacy",
        "11. From Courtship to Covenant · 12. Counting the Cost",
        "Habits, traditions, and a marriage that lasts"
      ]
    ]),
    heading(3, "What Each Module Asks of You"),
    paragraph("Every module combines teaching from Scripture and from our own counselling experience with real stories, honest questions and a practical assignment. Some sections are for you alone. Others are designed to be read and discussed together."),
    paragraph("Every assignment is written for your season. If you are engaged or courting, it will ask you to decide things before the wedding. If you are married, it will ask you to look honestly at how things have actually gone and to choose one change. Where an assignment has two versions, answer the one that fits you."),
    heading(3, "Each of You, Separately"),
    paragraph("If you and your partner are both on this track, each of you takes it on your own account, with your own answers. Neither of you can see the other's private reflections or assessment answers. That is deliberate: honest answers only work when nobody is reading over your shoulder."),
    paragraph("The value comes afterwards, in the conversations your answers open. Take those conversations seriously. Put your phones away, face each other, and let the quieter one of you speak first."),
    heading(3, "Walk It With Someone"),
    paragraph("We strongly encourage you not to walk this alone. Ask a pastor, a mature married couple or a trained counsellor to walk beside you, especially through the modules on conflict, money, in-laws and sex. Their job is not to lecture you. It is to ask good questions and to help you see what the two of you cannot see from inside the relationship. Your AI Coach on this platform can help you think between conversations, but it does not replace a real person who knows you."),
    heading(3, "Three Good Endings"),
    paragraph("If you are not yet married, know from the start that this journey has three good endings, and all three are success: to go forward with wisdom, to pause for growth, or, if honesty leads there, to part in peace before a vow is made."),
    pullQuote("A cancelled wedding costs far less than a broken covenant."),
    paragraph("If you are married, the ending we are working toward is simpler: a marriage that is honestly better at the end of these twelve modules than it was at the beginning. Not perfect. Better, and still growing."),
    divider(),
  ],
};

// ─── What This Will Cost You ───
const section6 = {
  section_number: 6,
  title: "What This Will Cost You",
  blocks: [
    heading(2, "Section 6 — What This Will Cost You"),
    paragraph("I will be honest with you, because a programme that promises an easy road is not telling you the truth about marriage."),
    heading(3, "It Will Cost You Honesty"),
    paragraph("There are no wrong answers in this track, only honest ones and dishonest ones, and only the honest ones can help you. Some questions will ask about money you have not mentioned, a past you have not told, or a fear you have not admitted, even to yourself. You will be tempted to answer as the person you hope to be. Answer as the person you are."),
    heading(3, "It Will Cost You Time"),
    paragraph("Some modules will raise dust. You may spend weeks feeling that nothing visible is being built. Do not despise those weeks. That is when the foundation goes in."),
    heading(3, "It Will Cost You Pride"),
    paragraph("You will discover that some of what you thought was your partner's problem is, at least partly, yours. The most useful sentence in any marriage is not \"you always\" but \"I was wrong.\" Learn to say it early."),
    callout("tip", "Who you marry will give you a good marriage. Who you choose to become will give you a great one. This track will spend as much time on the second as on the first."),
    heading(3, "And It Will Repay You"),
    image("/images/marriage/module-0/MM0-5.png", "An elderly African couple laugh together on a wicker seat on a veranda at sunset, her hand resting on his arm. Behind them a child's tricycle and a football lie on the lawn. No text appears in the image."),
    paragraph("Every hour you invest here is an hour you will not spend later repairing what could have been prevented. Couples who prepare well do not avoid every storm. They simply have something under their feet when the storm comes."),
    paragraph("There is a remarkable piece of research that shows what is really at stake. In 1938, Harvard University began following 724 young men: one group of Harvard students, and one group of boys from some of Boston's poorest and most troubled families. Researchers tracked them for the rest of their lives, through careers, marriages, illnesses and old age. It is one of the longest studies of adult life ever carried out, and it now follows their children too."),
    paragraph("Robert Waldinger, the study's fourth director, summarised what eight decades of data revealed. It was not wealth, fame or achievement that predicted a long, healthy life. It was the quality of a person's closest relationships. The men who were most satisfied in their relationships at age 50 were the healthiest at age 80. Those who could truly rely on their partner in hard times kept sharper memories in old age. Loneliness, by contrast, was linked to earlier decline in health and shorter lives."),
    videoEmbed("8KkKuTCFvzI", "What Makes a Good Life? Lessons from the Longest Study on Happiness | Robert Waldinger | TED"),
    callout("tip", "As you watch, listen for one phrase in particular: it is the quality of the relationship, not simply having one, that matters. A marriage can last for decades and still be lonely. That is exactly why this track asks about quality: whether your doors are open, not just whether you are together."),
    paragraph("Waldinger's research is not a Christian study, and it was never designed to prove anything about marriage. That is what makes it striking. Eighty years of secular data arrive at the place Scripture began: it is not good for us to be alone, and the bond between two people who can truly rely on each other shapes the whole of a life."),
    pullQuote("A marriage you invest in now is not only a happier home. Eighty years of research say it may be a longer, healthier life."),
    reflectionQuestions("Before You Move On — Just For You", [
      "Which of the three costs (honesty, time or pride) will be hardest for you, and why?",
      "Is there something you already know you will need to tell your partner before this journey is over?"
    ]),
    divider(),
  ],
};

// ─── Your Eight Doors Today ───
const section7 = {
  section_number: 7,
  title: "Your Eight Doors Today",
  blocks: [
    heading(2, "Your Eight Doors Today"),
    paragraph("Rate each door from 0 to 10. A 10 means you have talked about it openly, in detail, and you genuinely agree. A 0 means you have never discussed it at all. Rate the conversation, not the relationship, and be honest: your partner can't see this."),
    scorecard("Where Are Your Doors Today?", "marriage_module0_eight_doors", [
      {
        "key": "faith",
        "max": 10,
        "label": "Faith & covenant",
        "helpText": "Have you discussed who leads spiritually and what happens if one of you cools off?"
      },
      {
        "key": "character",
        "max": 10,
        "label": "Character & story",
        "helpText": "Does your partner know your family story and the wounds you carry?"
      },
      {
        "key": "conflict",
        "max": 10,
        "label": "Words & conflict",
        "helpText": "Do you know how each of you fights, and how you repair afterwards?"
      },
      {
        "key": "roles",
        "max": 10,
        "label": "Roles & work",
        "helpText": "Have you agreed who does what at home, or only assumed it?"
      },
      {
        "key": "money",
        "max": 10,
        "label": "Money & obligation",
        "helpText": "Does your partner know your debts and what you send to family each month?"
      },
      {
        "key": "family",
        "max": 10,
        "label": "Family & in-laws",
        "helpText": "Have you agreed whose family has a say, and who may come to live with you?"
      },
      {
        "key": "sex",
        "max": 10,
        "label": "Sex & body",
        "helpText": "Can the two of you talk about sex honestly, out loud?"
      },
      {
        "key": "children",
        "max": 10,
        "label": "Children & fertility",
        "helpText": "Have you discussed what you would do if children do not come?"
      }
    ]),
    callout("tip", "Look at your two lowest scores. Those are not failures. They are the doors to open first, and you will reach each of them in the modules ahead."),
    divider(),
  ],
};

// ─── A Final Word Before You Begin ───
const section8 = {
  section_number: 8,
  title: "A Final Word Before You Begin",
  blocks: [
    heading(2, "A Final Word Before You Begin"),
    paragraph("In 2008, a young man of twenty-six sat in a premarital class at his church with a form and a pen. The form asked him why he believed his marriage would succeed, why he wanted to marry at all, why now and why this person. He answered slowly, because he realised nobody had ever made him answer those questions before. He wrote his debts down on paper for the first time."),
    paragraph("That young man was me. I still have those forms. The marriage they prepared me for has since carried churches and Bible schools planted across Africa, children raised, storms weathered and a headquarters rising out of the ground in Cameroon. Through all of it, Arit has been my proof that preparation is never wasted."),
    paragraph("This track is our way of pulling out a chair for you in that same classroom. We are glad you are here."),
    pullQuote("Prepare for the marriage, not just the wedding."),
    divider(),
  ],
};

// ─── Your First Assignment — Set Your Intention ───
const section9 = {
  section_number: 9,
  title: "Your First Assignment — Set Your Intention",
  blocks: [
    heading(2, "Your First Assignment — Set Your Intention"),
    assignmentPrompt({
      "title": "Starting Point Assignment",
      "instructions": "Before Module 1, write down where you are and what you are asking God and this journey to do. Answer the version of each prompt that fits your season. Write honestly: your partner can't see this, and a mentor reads it only if you choose to share it.",
      "word_min": 200,
      "word_max": 700,
      "prompts": [
        {
          "number": 1,
          "heading": "Name Your Season",
          "guidance": "Which of the four seasons are you actually in: friendship, courtship, engagement or marriage? If you are married, which season of marriage: planting, rain or harvest? Describe it in three or four honest sentences.",
          "example": "Example: \"We call ourselves engaged, but if I'm honest we're still in courtship. My family hasn't met hers properly yet.\""
        },
        {
          "number": 2,
          "heading": "Name Your Two Closed Doors",
          "guidance": "From your Eight Doors scorecard, name your two lowest-scoring doors. For each one, write one sentence about why you think that conversation has not happened yet."
        },
        {
          "number": 3,
          "heading": "Why Are You Here?",
          "guidance": "If you are not yet married: why do you want to marry, and why this person? If you are married: what made you start this track now, and what do you most want to be different twelve modules from today?"
        },
        {
          "number": 4,
          "heading": "Choose Your Companion",
          "guidance": "Name one person (a pastor, a mature married couple or a counsellor) you will ask to walk with you through this track. Write down when you will ask them. If you cannot think of anyone, write that too, and we will come back to it in Module 1."
        }
      ]
    }),
    divider(),
    quiz("module_review", "Starting Point Review", [
      {
        "id": "q1",
        "prompt": "According to this Starting Point, what is the quiet crisis of marriage in our time?",
        "options": [
          {
            "id": "a",
            "text": "Couples marry too late"
          },
          {
            "id": "b",
            "text": "Couples prepare for the wedding but not for the marriage"
          },
          {
            "id": "c",
            "text": "Weddings have become too expensive"
          },
          {
            "id": "d",
            "text": "Couples no longer attend church together"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 1: we rehearse the ceremony and improvise the covenant."
      },
      {
        "id": "q2",
        "prompt": "What does the building-site story teach about marriage?",
        "options": [
          {
            "id": "a",
            "text": "Large projects always run over budget"
          },
          {
            "id": "b",
            "text": "What collapses a marriage is usually what nobody saw being built, or skipped, underneath"
          },
          {
            "id": "c",
            "text": "Couples should build a house before marrying"
          },
          {
            "id": "d",
            "text": "Public ceremonies matter more than private habits"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 2: buildings do not fall because of what everyone can see, but because of what nobody saw."
      },
      {
        "id": "q3",
        "prompt": "What are the four seasons of a relationship, in order?",
        "options": [
          {
            "id": "a",
            "text": "Dating, engagement, wedding, marriage"
          },
          {
            "id": "b",
            "text": "Friendship, courtship, engagement, marriage"
          },
          {
            "id": "c",
            "text": "Attraction, romance, commitment, marriage"
          },
          {
            "id": "d",
            "text": "Courtship, friendship, marriage, engagement"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: each season has its own purpose, and the order matters."
      },
      {
        "id": "q4",
        "prompt": "Why does this track use the word \"friendship\" instead of \"dating\"?",
        "options": [
          {
            "id": "a",
            "text": "Dating is forbidden in Scripture"
          },
          {
            "id": "b",
            "text": "Friendship lets two people see each other clearly without entanglement or premature promises"
          },
          {
            "id": "c",
            "text": "Friendship is shorter than dating"
          },
          {
            "id": "d",
            "text": "Families prefer the word"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 3: friendship protects the heart, allows real discovery and honours God."
      },
      {
        "id": "q5",
        "prompt": "What does it mean to \"agree by accident\"?",
        "options": [
          {
            "id": "a",
            "text": "Changing your mind to avoid an argument"
          },
          {
            "id": "b",
            "text": "Appearing to agree only because you have never discussed the subject"
          },
          {
            "id": "c",
            "text": "Agreeing in front of family but not in private"
          },
          {
            "id": "d",
            "text": "Letting a mentor decide for you"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 4: that is a misunderstanding not yet discovered, which is why we measure discussion as well as agreement."
      },
      {
        "id": "q6",
        "prompt": "For couples not yet married, what are the three good endings of this journey?",
        "options": [
          {
            "id": "a",
            "text": "Engagement, wedding, honeymoon"
          },
          {
            "id": "b",
            "text": "Go forward with wisdom, pause for growth, or part in peace before a vow"
          },
          {
            "id": "c",
            "text": "Pass, fail, or retake"
          },
          {
            "id": "d",
            "text": "Marry now, marry later, or never marry"
          }
        ],
        "correct_option_id": "b",
        "explanation": "Section 5: all three are success, because a cancelled wedding costs far less than a broken covenant."
      }
    ]),
    divider(),
  ],
};

// ─── Starting Point Complete ───
const section10 = {
  section_number: 10,
  title: "Starting Point Complete",
  blocks: [
    heading(2, "Starting Point Complete"),
    image("/images/marriage/module-0/MM0-6.png", "Two gold wedding rings rest on an open, well-worn Bible on a wooden table in morning light, beside a lit candle. The left page is headed Ephesians 5 and shows verses 25 to 27, beginning \"Husbands, love your wives, even as Christ also loved the church.\""),
    videoPlaceholder("2-3 min closing from Denis (and Arit, if possible): a blessing over the couples beginning this journey, and why the slow work they are about to do is worth it."),
    paragraph("You now know which season you are in, which doors are open and which are closed, and what this journey will ask of you. That is more clarity than most couples have on their wedding day."),
    paragraph("Module 1 begins where every marriage must begin: with the God who designed it, and what He meant it to be."),
    callout("info", "Next: Module 1 — Marriage Was God's Idea. Before you start it, finish your assignment and, if your partner is also on this track, compare your two lowest doors."),
  ],
};

// ─── Assemble ───

const module0 = {
  module_number: 0,
  slug: "marriage-starting-point-clarity-before-covenant",
  title: "Starting Point — Clarity Before Covenant",
  subtitle: "Before You Begin: The Seasons, the Doors, and the Work Ahead",
  track_slug: "marriage",
  pillar: "personal-foundation",
  pillar_id: "00000000-0000-0000-0002-000000000011",
  is_starting_point: true,
  difficulty: "beginner",
  estimated_duration_minutes: 65,
  sort_order: 0,
  sections: [frontMatter, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10],
};

const total = module0.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Marriage Module 0 — "${module0.title}"`);
module0.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module0_marriage.json", JSON.stringify(module0, null, 2));
console.log("\nWritten to module0_marriage.json");
