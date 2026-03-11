'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ── Icons ── */
const SendIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const SparkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const MicIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>;

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
};

const i18n = {
  en: {
    title: 'AI Coach',
    subtitle: "Trained on Dr. Ekobena's framework",
    placeholder: 'Ask your coach anything...',
    back: 'Dashboard',
    welcome: "Hello Denis! 👋 I'm your personal AI Coach, trained on Dr. Ekobena's leadership framework.\n\nBased on your assessment, your **Performance Leadership** pillar scored 2.4/5 — particularly in Managing Underperformance (2.0) and Difficult Conversations (2.3).\n\nThis week's focus is on emotional regulation. How are you finding the 3-Second Reset exercise? Or is there something else on your mind?",
    suggestions: [
      "Help me prepare for a difficult conversation with a team member",
      "How do I give constructive feedback without discouraging people?",
      "I'm struggling with delegation — I keep doing everything myself",
      "What does servant leadership look like practically?",
    ],
    suggestLabel: 'Suggested topics',
    langLabel: 'FR',
    typing: 'Coach is thinking...',
    disclaimer: 'AI coaching complements but does not replace professional guidance.',
  },
  fr: {
    title: 'Coach IA',
    subtitle: 'Formé sur le cadre du Dr. Ekobena',
    placeholder: 'Posez votre question au coach...',
    back: 'Tableau de bord',
    welcome: "Bonjour Denis ! 👋 Je suis votre Coach IA personnel, formé sur le cadre de leadership du Dr. Ekobena.\n\nSelon votre évaluation, votre pilier **Leadership de Performance** a obtenu 2.4/5 — en particulier en Gestion de la sous-performance (2.0) et Conversations difficiles (2.3).\n\nLe focus de cette semaine porte sur la régulation émotionnelle. Comment trouvez-vous l'exercice du Reset 3 Secondes ? Ou avez-vous autre chose en tête ?",
    suggestions: [
      "Aidez-moi à préparer une conversation difficile avec un membre de l'équipe",
      "Comment donner un feedback constructif sans décourager les gens ?",
      "J'ai du mal à déléguer — je fais tout moi-même",
      "À quoi ressemble le leadership serviteur concrètement ?",
    ],
    suggestLabel: 'Sujets suggérés',
    langLabel: 'EN',
    typing: 'Le coach réfléchit...',
    disclaimer: "Le coaching IA complète mais ne remplace pas l'accompagnement professionnel.",
  },
};

// Demo responses based on keywords
function getDemoResponse(input: string, lang: 'en' | 'fr'): string {
  const lower = input.toLowerCase();
  if (lang === 'fr') {
    if (lower.includes('difficile') || lower.includes('conversation')) return "Préparer une conversation difficile est l'une des compétences les plus importantes en leadership. Voici le cadre en 4 étapes du Dr. Ekobena :\n\n**1. Clarifiez votre intention**\nAvant la conversation, demandez-vous : \"Quel résultat est-ce que je veux pour cette personne, pas contre elle ?\"\n\n**2. Commencez par l'observation, pas le jugement**\n\"J'ai remarqué que les 3 derniers rapports avaient des retards\" plutôt que \"Tu es toujours en retard.\"\n\n**3. Exprimez l'impact**\n\"Quand les délais ne sont pas respectés, l'équipe doit compenser et cela crée de la frustration.\"\n\n**4. Invitez la collaboration**\n\"Comment pouvons-nous résoudre cela ensemble ?\"\n\nVoulez-vous que nous simulions cette conversation avec votre situation spécifique ?";
    if (lower.includes('feedback')) return "Le feedback constructif est un art. Le Dr. Ekobena utilise la méthode **SBI** :\n\n**S - Situation** : Décrivez quand et où.\n**B - Comportement** : Ce que vous avez observé (faits, pas interprétations).\n**I - Impact** : L'effet sur l'équipe ou le résultat.\n\nExemple : \"Lors de la réunion d'hier (S), quand tu as coupé Marie deux fois (B), elle s'est repliée et n'a plus contribué (I).\"\n\nLa clé : donnez le feedback dans les 24h, en privé, avec respect. Quel feedback devez-vous donner cette semaine ?";
    return "C'est une excellente question. Dans le cadre du Dr. Ekobena, cela touche directement votre parcours de croissance. Pouvez-vous me donner un exemple concret de votre situation ? Cela m'aidera à vous donner des conseils plus ciblés.";
  }
  if (lower.includes('difficult') || lower.includes('conversation')) return "Preparing for difficult conversations is one of the most critical leadership skills. Here's Dr. Ekobena's 4-step framework:\n\n**1. Clarify your intention**\nBefore the conversation, ask yourself: \"What outcome do I want FOR this person, not against them?\"\n\n**2. Start with observation, not judgment**\n\"I noticed the last 3 reports had delays\" rather than \"You're always late.\"\n\n**3. Express the impact**\n\"When deadlines are missed, the team has to compensate and it creates frustration.\"\n\n**4. Invite collaboration**\n\"How can we solve this together?\"\n\nWould you like to role-play this conversation with your specific situation?";
  if (lower.includes('feedback')) return "Constructive feedback is an art. Dr. Ekobena uses the **SBI method**:\n\n**S - Situation**: Describe when and where.\n**B - Behaviour**: What you observed (facts, not interpretations).\n**I - Impact**: The effect on the team or outcome.\n\nExample: \"In yesterday's meeting (S), when you interrupted Marie twice (B), she withdrew and stopped contributing (I).\"\n\nThe key: give feedback within 24 hours, privately, with respect. What feedback do you need to give this week?";
  if (lower.includes('delegat')) return "The struggle with delegation is incredibly common — especially among high-performers who built everything themselves. In Dr. Ekobena's framework, this falls under **Performance Leadership**.\n\nHere's the delegation matrix I recommend:\n\n**Level 1 — Do it exactly as I show you** (new tasks, new people)\n**Level 2 — Research and recommend** (building confidence)\n**Level 3 — Decide and inform me** (growing autonomy)\n**Level 4 — Decide and act** (full trust)\n\nMost leaders stay at Level 1 for too long. Your goal this week: identify ONE task you currently do that someone on your team could handle at Level 2 or 3.\n\nWhat task comes to mind?";
  if (lower.includes('servant')) return "Servant leadership is often misunderstood as being passive or weak. In Dr. Ekobena's framework, it's the opposite — it's the most intentional form of leadership.\n\nPractically, it looks like:\n\n**1. Ask before telling**: \"What do you need from me?\" instead of \"Here's what you should do.\"\n\n**2. Remove obstacles**: Your job is to make your team's job easier, not harder.\n\n**3. Develop people, not just results**: Invest 20% of your leadership time in growing others.\n\n**4. Share credit, absorb blame**: Publicly celebrate your team. Privately own the failures.\n\nWhich of these four areas would make the biggest difference in your leadership right now?";
  return "That's a great question. Within Dr. Ekobena's framework, this connects directly to your growth journey. Can you give me a specific example from your situation? That will help me provide more targeted coaching advice.";
}

export default function AiCoachPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = i18n[lang];

  // Initialize welcome message
  useEffect(() => {
    setMessages([{ id: 0, role: 'assistant', text: t.welcome, timestamp: new Date() }]);
    setShowSuggestions(true);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getDemoResponse(text, lang);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Simple markdown-ish rendering
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="mb-1.5 last:mb-0" dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Header ── */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 max-md:px-4 h-16 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
            <BackIcon /> <span className="max-md:hidden">{t.back}</span>
          </button>
          <div className="w-px h-8 bg-gray-200 max-md:hidden" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-[#F9250E]"><SparkIcon /></div>
            <div>
              <h1 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.title}</h1>
              <p className="text-[11.5px] text-gray-400">{t.subtitle}</p>
            </div>
          </div>
        </div>
        <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md bg-transparent border-[1.5px] border-gray-200 cursor-pointer text-[11px] font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all" style={{ fontFamily: 'inherit' }}>🌐 {t.langLabel}</button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-6 max-md:px-4 py-6">
        <div className="max-w-[740px] mx-auto flex flex-col gap-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-[#F9250E]">
                  <SparkIcon />
                </div>
              )}
              <div className={`max-w-[85%] max-md:max-w-[90%] rounded-2xl px-5 py-4 text-[14.5px] leading-[1.7] ${
                msg.role === 'user'
                  ? 'bg-[#F9250E] text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-[#F9250E]"><SparkIcon /></div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[12px] text-gray-400 ml-2">{t.typing}</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{t.suggestLabel}</p>
              <div className="flex flex-wrap gap-2">
                {t.suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="px-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13px] text-gray-700 cursor-pointer hover:border-[#F9250E] hover:text-[#F9250E] hover:bg-red-50/50 transition-all text-left" style={{ fontFamily: 'inherit' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-6 max-md:px-4 py-4">
        <div className="max-w-[740px] mx-auto">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#F9250E] focus-within:shadow-[0_0_0_3px_rgba(249,37,14,0.06)] transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-[14.5px] text-gray-900 placeholder:text-gray-400 leading-[1.5] max-h-[120px]"
              style={{ fontFamily: 'inherit' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={`shrink-0 w-10 h-10 rounded-xl border-none flex items-center justify-center transition-all cursor-pointer ${
                input.trim() && !isTyping ? 'bg-[#F9250E] text-white hover:bg-[#E0200B]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2.5">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
