// Module 0 — "Starting Point — Welcome to Your Journey"
// Reverse-engineered from the live row on 2026-09-29. Module 0 predates the
// generator pattern: its blocks were authored directly as JSON and then edited
// in the database (the five real images, the video, the quiz). This file was
// rebuilt from production so the module is reproducible like every other one,
// and it is verified byte-for-byte against the live row — not a JSON dump, but
// the same helper-based structure as generate_module1..12.
//
// Three shapes here do not appear in any other module's generator. They are
// reproduced faithfully rather than normalised away:
//   * assignmentPrompt carries a submit_label ("Submit and Begin").
//   * pullQuote takes an optional attribution; five of six omit it.
//   * Section headings carry the literal "Section N — " prefix, which the
//     splitter strips for display. Modules 2-12 use bare titles instead.

const fs = require('fs');

const heading = (level, text) => ({ type: "heading", data: { level, text } });
const paragraph = (text) => ({ type: "paragraph", data: { text } });
const divider = () => ({ type: "divider", data: {} });
const callout = (variant, text) => ({ type: "callout", data: { variant, text } });
const image = (url, alt) => ({ type: "image", data: { url, alt } });
const videoEmbed = (youtubeId, title) => ({ type: "video_embed", data: { youtubeId, title } });
const table = (headers, rows) => ({ type: "table", data: { headers, rows } });
const reflectionQuestions = (title, questions) => ({ type: "reflection_questions", data: { title, questions } });
const quiz = (scope, title, questions) => ({ type: "quiz", data: { scope, title, questions } });

// Unlike Modules 2-12, this one emits attribution only when there is one —
// the live blocks distinguish between absent and present, and normalising the
// five bare quotes to attribution: null would not reproduce production.
const pullQuote = (text, attribution) =>
  attribution === undefined
    ? { type: "pull_quote_card", data: { text } }
    : { type: "pull_quote_card", data: { text, attribution } };

// submit_label is unique to this module's assignment block.
const assignmentPrompt = ({ title, instructions, prompts, word_min, word_max, submit_label }) => ({
  type: "assignment_prompt",
  data: { title, instructions, prompts, word_min, word_max, submit_label },
});

// ─── SECTION 1 — Why You're Here and What Leadership Really Is ───────────────
const section1 = {
  section_number: 1,
  title: "Why You're Here and What Leadership Really Is",
  blocks: [
    heading(2, "Starting Point — Welcome to Your Journey"),
    paragraph("By Dr. Denis Ekobena · Equip2Lead Coach"),
    videoEmbed("b8B5T7qoovM", "Higher Level Leadership: Raising Standards | Denis Ekobena — temporary placeholder video, real per-section recordings to follow"),
    callout("info", "This is the foundational orientation every user sees before beginning their track. It sets the definition of leadership, the framework of the program, and what will be asked of you over the coming twelve modules. Take your time with it."),
    callout("info", "Time commitment: About 45 minutes of reading + 20 minutes of first-assignment work. You can do this in one sitting or spread it across two or three."),
    divider(),
    heading(2, "Section 1 — Why You're Here and What Leadership Really Is"),
    image("/images/module-0/threshold-door.png", "A person standing at the threshold of an open door, looking out at a sunrise and a winding path"),
    paragraph("If you are reading this, one of two things is true."),
    paragraph("Either you already know you were called to lead — and you're looking for a program that will actually take you deeper than the surface teaching most leadership content offers."),
    paragraph("Or something in your life — a role, a responsibility, a burden of influence you did not ask for — has revealed to you that you need to grow. And you're serious about it."),
    paragraph("Either way, welcome. You are in the right place."),
    paragraph("This program was not built for people who want to sound like leaders. It was built for people who want to become leaders — the kind whose influence lasts, whose character holds under pressure, and whose fruit remains long after they leave the room."),
    paragraph("That is a different journey than most leadership programs offer. And it takes different tools."),
    heading(3, "What Is Leadership? — The Definition That Frames Everything"),
    paragraph("Before we begin, we have to agree on what leadership actually is. Most people cannot define it clearly. They confuse it with position, personality, or performance. So let's settle this from the start."),
    paragraph("Here is the definition this entire program is built on:"),
    pullQuote("Leadership is influence — the ability of one person to inspire, guide, and develop others toward a shared purpose."),
    paragraph("Let me break that apart, because every word matters."),
    paragraph("Leadership is influence. John Maxwell has said it, and after 40 years of studying leaders across nations and industries, I have found no better definition. Leadership is not a title. It is not a position. It is not a personality type. It is not being loud or being in charge. Leadership is influence — the measurable effect you have on others."),
    paragraph("The ability of one person. Leadership starts with one — you. Not the team. Not the culture. Not the organization. You. If you cannot lead one person (yourself), you cannot lead a hundred."),
    paragraph("To inspire, guide, and develop others. Real leaders do three things simultaneously: they inspire (they set fire in others), they guide (they show the way), and they develop (they build the person for the long run). Leaders who only inspire produce excited people who go nowhere. Leaders who only guide produce compliant followers. Leaders who develop others produce more leaders."),
    paragraph("Toward a shared purpose. Leadership without direction is just personality. Direction without shared ownership is dictatorship. Real leadership pulls people toward something bigger than themselves — and gets them to want it too."),
    callout("info", "If you internalize nothing else from this section, internalize this: you are leading whenever your words, actions, or example cause someone to think, act, or become better. That means you are already a leader. The question is not whether you lead — it is how well you lead."),
    heading(3, "Other Voices, Landing in the Same Place"),
    paragraph("This definition doesn't stand alone. Serious thinkers across completely different fields — a Holocaust-era management theorist, an FBI-consulted missiologist, a WWII field marshal — have circled the same territory from angles that share nothing but the conclusion."),
    callout("tip", "Peter Drucker, the management theorist whose work shaped how nearly every modern organization thinks about itself, put the distinction bluntly: \"Management is doing things right; leadership is doing the right things.\" Warren Bennis, who spent a career studying what actually separates leaders from managers, called it \"the capacity to translate vision into reality.\" British Field Marshal Bernard Montgomery, writing from an entirely different world of urgency, framed it as the blend of will strong enough to rally people around a shared purpose, and character substantial enough to earn their trust. Missiologist J. Robert Clinton described it as a process where one person's influence moves others' thinking and action toward goals meant to benefit leader and followers together — never the leader alone."),
    pullQuote("\"Leadership is the ability to make a difference in the moment.\" —Denis Ekobena"),
    paragraph("That last one is where this program actually starts — not borrowed from someone else's book, but tested across years of leading in contexts where a single moment, handled well or badly, genuinely changed what came next."),
    heading(3, "The Three Ways Leadership Is Used — Only One Is Real"),
    paragraph("There are only three ways any leader can use influence over people. Watch for these in yourself and in others."),
    heading(4, "1. Leadership TO People — Exploitation"),
    paragraph("The leader uses people to accomplish their agenda, then discards them. Common in politics, some businesses, and unfortunately, some ministries. It produces results in the short term and destruction in the long term. The people leave depleted. The leader is remembered as effective — and toxic."),
    heading(4, "2. Leadership FOR People — Paternalism"),
    paragraph("The leader does everything for their people, keeping them dependent. It looks kind. It feels heroic. But it produces followers who cannot function without the leader — and a leader who quietly needs the dependency to feel valuable. It creates a large ministry with small people."),
    heading(4, "3. Leadership THROUGH People — The Real Thing"),
    paragraph("The leader develops others so that everyone grows. Power is shared. Authority is distributed. The leader's greatest joy is watching others surpass them."),
    pullQuote("Only secure leaders give their power to others."),
    paragraph("This program is built entirely to help you become a THROUGH-people leader. You cannot become one by accident. It requires the inner work you will do in the twelve modules ahead."),
    reflectionQuestions(
      "Before You Move On",
      [
        "Which of the three (TO / FOR / THROUGH) most describes how you currently use influence with the people you lead? Be honest — not aspirational.",
        "Who in your life has led you THROUGH — investing in you so you grew into more? What did they do differently?",
        "If a member of your team described how you lead to a stranger, would they describe someone who exploits, protects, or develops? Why?",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 2 — The Framework: Know → Be → Do ───────────────────────────────
const section2 = {
  section_number: 2,
  title: "The Framework: Know → Be → Do",
  blocks: [
    heading(2, "Section 2 — The Framework: Know → Be → Do"),
    image("/images/module-0/tree-roots-fruit.png", "A tree shown in cross-section, its root system spreading below ground and fruit hanging above"),
    paragraph("Every world-class program has a signature framework that everything hangs on. Ours is three words. Remember them. You will hear them again in every module."),
    heading(3, "KNOW — You must know yourself, know God, and know your calling."),
    paragraph("Before you do anything, you must know. Self-awareness. Identity. Purpose. The leader who does not know who they are will be shaped by whoever is loudest around them. This is the foundation — and where most leaders skip a step."),
    heading(3, "BE — Before you do, you must become."),
    paragraph("Being precedes doing. Character precedes competence. The person you are becoming determines the leader you will be. A gifted person with poor character will eventually collapse under the weight of their gift. A person of deep character with modest gifts will steadily grow in influence for a lifetime."),
    heading(3, "DO — What you do must flow from who you are."),
    paragraph("Only after knowing and becoming can your doing be sustainable. Actions that flow from character produce fruit that lasts. Actions that flow from performance produce results that die when you leave the room."),
    paragraph("This is the arc of the entire twelve-module program. Every module fits somewhere on this arc."),
    pullQuote("KNOW → BE → DO — the pathway of Christ-centered leadership formation.", "Dr. Denis Ekobena"),
    heading(3, "Why This Order Matters"),
    paragraph("Most leadership training in the world today is built backwards. It starts with DO — techniques, tactics, skills, hacks. It teaches you what to do without asking who you are. That works for a season. It produces results. It also produces the burnt-out, morally compromised, publicly-fallen leaders you have watched come apart on the news."),
    paragraph("The order matters because being always leaks into doing. What you are on the inside eventually shows up on the outside. You can pretend for a season, but you cannot pretend forever."),
    paragraph("So we start where it actually starts: with knowing. Then we build being. Then — and only then — we build doing."),
    reflectionQuestions(
      "Before You Move On",
      [
        "Which of the three (Know / Be / Do) do you currently invest the most time in developing? Which do you invest the least?",
        "Think of a leader you know who has fallen publicly. Looking back, where did they invest — Know, Be, or Do? What was missing?",
        "If you had to give yourself a score out of 10 on each — how self-aware are you (Know), how solid is your character (Be), how effective is your leadership execution (Do)?",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 3 — The Five Pillars and the Twelve-Module Journey ──────────────
const section3 = {
  section_number: 3,
  title: "The Five Pillars and the Twelve-Module Journey",
  blocks: [
    heading(2, "Section 3 — The Five Pillars and the Twelve-Module Journey"),
    image("/images/module-0/five-pillars.png", "Five stone pillars beneath a pediment reading LEADERSHIP, each carved with one of Character, Knowledge, Skills, Opportunity and Impact"),
    paragraph("Your assessment measured you across five pillars. These pillars are the map of the entire leadership landscape. Every leader has some strength and some weakness in each. The goal is not perfection — it is growth in every pillar."),
    heading(3, "Pillar 1 — Personal Leadership (Leading Yourself)"),
    paragraph("Self-awareness, self-discipline, emotional intelligence, personal accountability, character. Modules 1, 2, 3 in this track."),
    heading(3, "Pillar 2 — Directional Leadership (Vision & Strategy)"),
    paragraph("Vision, strategic thinking, decision-making, goal-setting, direction. Modules 4, 5."),
    heading(3, "Pillar 3 — Relational Leadership (Leading People)"),
    paragraph("Trust, communication, influence, empathy, conflict resolution. Modules 6, 7, 8."),
    heading(3, "Pillar 4 — Performance Leadership (Executing With Excellence)"),
    paragraph("Delegation, coaching, feedback, managing performance, developing others. Modules 9, 10."),
    heading(3, "Pillar 5 — Multiplication & Impact (Leaving a Legacy)"),
    paragraph("Multiplying leaders, building teams, servant leadership, legacy, kingdom impact. Modules 11, 12."),
    paragraph("Your assessment score will highlight where you should probably start — but the entire path is open to you."),
    heading(3, "The Twelve Modules at a Glance"),
    paragraph("Here is the full arc. Each module stands alone — you can start with any of them based on your assessment or your own sense of where you need to grow."),
    table(
      ["#", "Module", "Pillar", "Core Question"],
      [
        ["1", "The Leader Within", "Personal", "Who am I when nobody is watching?"],
        ["2", "Character in the Dark", "Personal", "What am I made of?"],
        ["3", "Emotional Intelligence", "Personal", "Can I manage myself under pressure?"],
        ["4", "The Power of Vision", "Directional", "Where am I going and why?"],
        ["5", "The 5 Levels & Laws of Leadership", "Directional", "How do I decide well when it matters?"],
        ["6", "Building Trust", "Relational", "Do people trust me — really?"],
        ["7", "Communication That Connects", "Relational", "Am I heard, or just loud?"],
        ["8", "Servant Leadership — The Jesus Model", "Relational", "Am I leading for me, or for them?"],
        ["9", "Coaching & Developing People", "Performance", "Am I making people better?"],
        ["10", "Feedback & Managing Performance", "Performance", "Can I have the conversation I've been avoiding?"],
        ["11", "Kouzes & Posner — 5 Practices", "Multiplication", "What practices define exemplary leaders?"],
        ["12", "Leadership Legacy", "Multiplication", "What am I leaving behind?"],
      ]
    ),
    paragraph("Each module contains: a rich reading of six to seven sections, reflection questions, an introductory video, an embedded video from a world-class leader, a signature assignment you will submit, and materials you can print and take with you."),
    heading(3, "How This Program Works"),
    paragraph("The AI has read your assessment. Based on your scores, it will recommend where to start. These are the modules where you have the greatest opportunity to grow right now."),
    paragraph("But you are not locked in. You can browse the full library at any time. If you feel called to a specific module, take it. The AI's recommendations are a starting point, not a cage."),
    paragraph("The AI Coach is with you throughout. As you read, questions will surface. Confusions will emerge. You'll want to think out loud. That is what the AI Coach is for. It is trained on my teaching, my books, and this curriculum. It will not replace human wisdom — but it will help you think, apply, and stay engaged 24 hours a day, in English or French."),
    paragraph("Every module has an assignment you will submit. This is not busywork. Writing crystallizes thinking. Every assignment you submit is stored in your journey — you can look back three months later and see how much you have grown."),
    paragraph("You are on your own timeline. Some people finish a module a week. Some take a month per module. There is no shame in slow. The only shame is stopping."),
    reflectionQuestions(
      "Before You Move On",
      [
        "Look at the five pillars. Which one do you already know is your greatest strength? Give one concrete example.",
        "Which pillar do you already know is your greatest area for growth? Give one concrete example of how it has cost you.",
        "Look at the twelve module titles. Which one do you feel most drawn to right now — before the AI recommends anything?",
        "Which one do you feel most resistant to? That resistance often points to exactly where you need to go.",
      ]
    ),
    divider(),
  ]
};

// ─── SECTION 4 — The Slow-Cooker Principle and What This Program Costs You ───
const section4 = {
  section_number: 4,
  title: "The Slow-Cooker Principle and What This Program Costs You",
  blocks: [
    heading(2, "Section 4 — The Slow-Cooker Principle and What This Program Costs You"),
    image("/images/module-0/bread-rising.png", "Bread dough rising under a cloth in a ceramic bowl on a wooden table"),
    heading(3, "The Slow-Cooker Principle"),
    paragraph("Before you begin, understand this:"),
    pullQuote("Leadership is not a microwave experience. God prepares leaders in a slow-cooker."),
    paragraph("Moses spent forty years in the wilderness before he led Israel out of Egypt. David spent thirteen years running from Saul before he sat on the throne. Joseph went from pit to slavery to prison before the palace. Jesus spent thirty years in preparation for three years of ministry."),
    paragraph("The pattern is not accidental. It is the way God builds leaders who last."),
    paragraph("Do not rush this program. Do not read Module 1 in one sitting and skip to Module 12. The transformation you are looking for happens slowly, in the daily practice of leading yourself well."),
    paragraph("You are in a slow-cooker. Let it cook you."),
    heading(3, "What This Program Costs You"),
    paragraph("Not money. Something more valuable."),
    paragraph("It will cost you honesty. You cannot fake your way through this. If you write the reflection answers to impress me or to impress yourself, you will get nothing from it. The program only works if you tell the truth."),
    paragraph("It will cost you comfort. Every module will surface something in you that needs to change. Some of it will be hard to look at. That is not a bug — it is the entire point."),
    paragraph("It will cost you time. Roughly 90 to 120 minutes of reading per module, plus 30 to 60 minutes of assignment work. Twelve modules equals around 25 hours of serious engagement, spread over however long you take. This is a small investment for the transformation on offer."),
    paragraph("It will cost you the illusion that you are already there. The most dangerous leader is the one who thinks they have arrived. This program is built to keep humbling you — because a humble leader keeps growing."),
    heading(3, "The Ultimate Test"),
    paragraph("Every world-class program has a test of success. Ours is this:"),
    pullQuote("The ultimate test of leadership is not what happens when you are present. It is what happens when you are gone."),
    paragraph("At the end of Module 12, you will look back on the twelve modules and ask yourself the questions that actually matter:"),
    paragraph("Am I becoming the kind of leader whose influence outlives their presence?"),
    paragraph("Are the people I lead growing into more of who God made them to be — or shrinking to fit the shape of my need to control them?"),
    paragraph("If I disappeared tomorrow, would what I built stand — or would it collapse?"),
    paragraph("These questions cannot be answered by charisma. They cannot be answered by talent. They can only be answered by the character you build in the hidden years — and by whether you keep doing the inner work long after you have to."),
    paragraph("This program is a return to that work."),
    heading(3, "A Final Word Before You Begin"),
    paragraph("I have taught these principles for over two decades — in churches in Yaoundé, in boardrooms in Charlotte, in leadership schools across francophone and anglophone Africa, in ministry training centers on three continents. I have watched hundreds of leaders walk this path. I have watched some finish and change everything about how they lead. I have watched others start strong and drift away."),
    paragraph("The difference is not intelligence. It is not talent. It is not opportunity. The difference is daily engagement."),
    paragraph("The leaders who transform are the ones who keep showing up — module after module, week after week, honest reflection after honest reflection — even when it's uncomfortable, even when they'd rather not."),
    paragraph("Show up. That is the only requirement."),
    paragraph("Welcome to Equip2Lead Coach. The world needs the leader you are becoming."),
    paragraph("— Dr. Denis Ekobena"),
    divider(),
  ]
};

// ─── SECTION 5 — Your First Assignment — Set Your Intention Before You Begin ───
const section5 = {
  section_number: 5,
  title: "Your First Assignment — Set Your Intention Before You Begin",
  blocks: [
    heading(2, "Your First Assignment — Set Your Intention Before You Begin"),
    image("/images/module-0/journal-morning.png", "An open journal with a pen resting on it, a mug reading DISCIPLINE CREATES FREEDOM and stacked books, on a wooden desk in morning light"),
    paragraph("Before you open Module 1 (or whichever module the AI recommends first), spend twenty minutes with the questions below. Write your answers. Do not just think them."),
    paragraph("Save your answers. You will return to them at the end of Module 12. What you write today will surprise you then."),
    quiz(
      "module_review",
      "Module Review: Starting Point",
      [
        {
          id: "q1",
          prompt: "According to this module's definition, what is leadership fundamentally?",
          options: [
            { id: "a", text: "Position and authority" },
            { id: "b", text: "Influence — the ability to inspire, guide, and develop others toward a shared purpose" },
            { id: "c", text: "Being the most talented person in the room" },
            { id: "d", text: "Managing tasks efficiently" },
          ],
          correct_option_id: "b",
          explanation: "This is the module's opening definition, framing everything that follows.",
        },
        {
          id: "q2",
          prompt: "Of the three ways leadership gets used, which does this module identify as \"the real thing\"?",
          options: [
            { id: "a", text: "Leadership TO people (exploitation)" },
            { id: "b", text: "Leadership FOR people (paternalism)" },
            { id: "c", text: "Leadership THROUGH people" },
            { id: "d", text: "All three are equally valid" },
          ],
          correct_option_id: "c",
          explanation: "The module frames the first two as distortions and the third as the only sustainable form.",
        },
        {
          id: "q3",
          prompt: "In the KNOW → BE → DO framework, what comes first?",
          options: [
            { id: "a", text: "Doing the work" },
            { id: "b", text: "Knowing yourself, God, and your calling" },
            { id: "c", text: "Building your public image" },
            { id: "d", text: "Setting organizational goals" },
          ],
          correct_option_id: "b",
          explanation: "The framework's order is deliberate — the module argues that action without a foundation of knowing and being doesn't last.",
        },
        {
          id: "q4",
          prompt: "What does the \"Slow-Cooker Principle\" teach about leadership formation?",
          options: [
            { id: "a", text: "Leadership can be rushed if you're talented enough" },
            { id: "b", text: "God prepares leaders slowly, not instantly — leadership is not a microwave experience" },
            { id: "c", text: "Only formal training produces real leaders" },
            { id: "d", text: "Age is the only factor in leadership readiness" },
          ],
          correct_option_id: "b",
          explanation: "Matches the module's own framing exactly.",
        },
        {
          id: "q5",
          prompt: "According to this module, what is the \"ultimate test\" of leadership?",
          options: [
            { id: "a", text: "How much you accomplish while present" },
            { id: "b", text: "What happens when you are gone" },
            { id: "c", text: "Your title or position" },
            { id: "d", text: "How many people follow you" },
          ],
          correct_option_id: "b",
          explanation: "This closes the module's opening argument — leadership is measured by what outlasts the leader, not by what happens under their direct supervision.",
        },
      ]
    ),
    assignmentPrompt({
      title: "Set Your Intention",
      instructions: "Answer all five questions honestly, in first person. This is between you and God — and your future self. Take your time. This is the foundation of everything that follows.",
      prompts: [
        { number: 1, heading: "Why did you come to this program?", guidance: "Not the polite answer. The real one. What is the pressure, the ache, the calling, the crisis that made you enroll? What did you hope this would give you?" },
        { number: 2, heading: "What kind of leader are you today?", guidance: "Describe yourself honestly — strengths and weaknesses. If a member of your team wrote this description, what would they say that you would find hard to read?" },
        { number: 3, heading: "What kind of leader do you want to become in the next twelve months?", guidance: "Be specific. Not \"a better leader\" — but the actual traits, capacities, and character that need to grow in you." },
        { number: 4, heading: "What is standing between those two versions of you?", guidance: "Name the obstacle honestly. Is it a habit? A fear? A wound? A relationship? A season? A pattern of thinking? Something else?" },
        { number: 5, heading: "What are you willing to do — really — to close that gap?", guidance: "This is the commitment question. What price are you willing to pay? What are you willing to give up, take on, confront, or change? Vague answers here produce vague transformation." },
      ],
      word_min: 200,
      word_max: 600,
      submit_label: "Submit and Begin",
    }),
    callout("info", "When you submit, the AI Coach will read your answers and use them to shape how it coaches you throughout the twelve modules. Your first module recommendation will appear on your dashboard. Welcome to the work."),
    divider(),
    heading(3, "Starting Point Complete"),
    paragraph("You have just laid the foundation. The AI Coach now knows why you're here, who you are, and what you're willing to commit to. Your first module is ready when you are."),
    paragraph("Do not rush to Module 1. Let what you have written settle. Then return to your dashboard and begin."),
    paragraph("Welcome to formation. This is where all real leadership begins."),
    paragraph("— Dr. Denis Ekobena"),
  ]
};

// ─── Assemble ───────────────────────────────────────────────────────────────

const module0 = {
  module_number: 0,
  title: "Starting Point — Welcome to Your Journey",
  subtitle: "Before You Begin: The Foundation for Everything That Follows",
  track_slug: "leadership",
  is_starting_point: true,
  difficulty: "beginner",
  estimated_duration_minutes: 45,
  cover_image_alt: "A single doorway opening onto a path leading through morning light",
  sections: [section1, section2, section3, section4, section5],
};

const total = module0.sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`Module 0 — "${module0.title}"`);
module0.sections.forEach((s) => console.log(`  ${s.section_number}. ${s.title} (${s.blocks.length} blocks)`));
console.log(`\nTotal blocks: ${total}`);

fs.writeFileSync("module0_leadership.json", JSON.stringify(module0, null, 2));
console.log("\nWritten to module0_leadership.json");
