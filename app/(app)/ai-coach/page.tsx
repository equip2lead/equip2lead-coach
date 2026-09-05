'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { switchLanguage } from '@/lib/language';
import { useAuth } from '@/lib/hooks/useAuth';

const SendIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const SparkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

type Message = { id: number; role: 'user' | 'assistant'; text: string };

const suggestions: Record<string, { en: string[]; fr: string[] }> = {
  leadership: {
    en: ['Help me prepare for a difficult conversation', 'How do I delegate more effectively?', 'I want to develop my team — where do I start?', 'What does my assessment say about my leadership style?'],
    fr: ['Aidez-moi à préparer une conversation difficile', 'Comment mieux déléguer ?', 'Je veux développer mon équipe', 'Que dit mon évaluation sur mon style de leadership ?'],
  },
  ministry: {
    en: ['How do I avoid burnout in ministry?', 'Help me write a calling statement', 'How can I improve my preaching?', 'What are my ministry blind spots?'],
    fr: ['Comment éviter le burnout en ministère ?', 'Aidez-moi avec ma déclaration d\'appel', 'Comment améliorer ma prédication ?', 'Quels sont mes angles morts ?'],
  },
  marriage: {
    en: ['How do we communicate better as a couple?', 'We struggle with conflict resolution', 'Help us plan weekly rituals together', 'What does our assessment reveal about trust?'],
    fr: ['Comment mieux communiquer en couple ?', 'Nous avons du mal avec les conflits', 'Aidez-nous à planifier des rituels', 'Que révèle notre évaluation sur la confiance ?'],
  },
  entrepreneur: {
    en: ['Help me clarify my offer', 'How do I price my services?', 'I need a 90-day growth plan', 'What are my biggest business blind spots?'],
    fr: ['Aidez-moi à clarifier mon offre', 'Comment fixer mes prix ?', 'J\'ai besoin d\'un plan de croissance', 'Quels sont mes angles morts business ?'],
  },
  personal: {
    en: ['Help me discover my purpose', 'I want to build better habits', 'How do I improve my emotional intelligence?', 'What does my assessment say about my growth areas?'],
    fr: ['Aidez-moi à découvrir mon but', 'Je veux construire de meilleures habitudes', 'Comment améliorer mon intelligence émotionnelle ?', 'Que dit mon évaluation ?'],
  },
};

export default function AiCoachPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [coachContext, setCoachContext] = useState<any>(null);
  const [trackSlug, setTrackSlug] = useState('leadership');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [conversationId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep ref in sync for beforeunload
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Save session memories on unload
  const saveMemories = useCallback(() => {
    const msgs = messagesRef.current;
    if (!journeyId || msgs.length < 2) return;
    const payload = JSON.stringify({
      journeyId,
      conversationId,
      messages: msgs.map(m => ({ role: m.role, content: m.text })),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/memory', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/memory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
    }
  }, [journeyId, conversationId]);

  useEffect(() => {
    window.addEventListener('beforeunload', saveMemories);
    return () => window.removeEventListener('beforeunload', saveMemories);
  }, [saveMemories]);

  // Load user's coaching data
  useEffect(() => {
    if (!user) return;
    async function loadContext() {
      const { data: journey } = await supabase.from('journeys')
        .select('id, track_id, pre_assessment_data, tracks(slug, name_en, name_fr)')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false }).limit(1).single();
      if (!journey) return;

      const slug = (journey.tracks as any)?.slug || 'leadership';
      setTrackSlug(slug);
      setJourneyId(journey.id);

      const [scoresRes, planRes, profileRes] = await Promise.all([
        supabase.from('pillar_scores').select('pillar_id, score, sub_domain_scores, pillars(name_en)').eq('journey_id', journey.id),
        supabase.from('coaching_plans').select('focus_areas, coach_lens_summary').eq('journey_id', journey.id).single(),
        supabase.from('profiles').select('full_name').eq('id', user!.id).single(),
      ]);

      const ctx: any = {
        journeyId: journey.id,
        trackId: journey.track_id,
        trackNameFr: (journey.tracks as any)?.name_fr,
        trackName: (journey.tracks as any)?.name_en || slug,
        userName: profileRes.data?.full_name || user!.email?.split('@')[0] || 'there',
        lang,
        pillarScores: (scoresRes.data || []).map((s: any) => ({
          name: s.pillars?.name_en || 'Pillar',
          score: s.score,
          subScores: s.sub_domain_scores,
        })),
        focusAreas: planRes.data?.focus_areas || [],
        coachLensSummary: planRes.data?.coach_lens_summary || '',
        preAssessment: journey.pre_assessment_data || {},
      };
      setCoachContext(ctx);

      // Welcome message
      const welcomeName = ctx.userName.split(' ')[0];
      const hasScores = ctx.pillarScores.length > 0;
      let welcome = '';
      if (lang === 'fr') {
        welcome = `Bonjour ${welcomeName} ! 👋 Je suis votre Coach IA Equip2Lead, formé sur le cadre du Dr. Ekobena.\n\n`;
        if (hasScores) {
          const lowest = [...ctx.pillarScores].sort((a: any, b: any) => a.score - b.score)[0];
          welcome += `D'après votre évaluation en **${ctx.trackName}**, votre pilier le plus faible est **${lowest.name}** (${lowest.score}/5). C'est là que nous concentrerons notre travail.\n\n`;
        }
        welcome += `Comment puis-je vous aider aujourd'hui ?`;
      } else {
        welcome = `Hello ${welcomeName}! 👋 I'm your Equip2Lead AI Coach, trained on Dr. Ekobena's framework.\n\n`;
        if (hasScores) {
          const lowest = [...ctx.pillarScores].sort((a: any, b: any) => a.score - b.score)[0];
          welcome += `Based on your **${ctx.trackName}** assessment, your growth area is **${lowest.name}** (${lowest.score}/5). That's where we'll focus our work together.\n\n`;
        }
        welcome += `How can I help you today?`;
      }
      setMessages([{ id: 0, role: 'assistant', text: welcome }]);
    }
    loadContext();
  }, [user?.id, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.text })),
          context: { ...coachContext, lang },
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: data.reply }]);

      // Update streak in background
      if (journeyId) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ journeyId }),
        }).catch(() => {});
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        text: lang === 'fr' ? 'Désolé, une erreur est survenue. Veuillez réessayer.' : 'Sorry, something went wrong. Please try again.',
      }]);
    }
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line: string, i: number) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="mb-1.5 last:mb-0" dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  const trackSuggestions = suggestions[trackSlug] || suggestions.leadership;
  const t = {
    title: lang === 'en' ? 'AI Coach' : 'Coach IA',
    subtitle: lang === 'en' ? "Trained on Dr. Ekobena's framework" : 'Formé sur le cadre du Dr. Ekobena',
    placeholder: lang === 'en' ? 'Ask your coach anything...' : 'Posez votre question...',
    typing: lang === 'en' ? 'Coach is thinking...' : 'Le coach réfléchit...',
    disclaimer: lang === 'en' ? 'AI coaching complements but does not replace professional guidance.' : "Le coaching IA complète mais ne remplace pas l'accompagnement professionnel.",
    suggestLabel: lang === 'en' ? 'Suggested topics' : 'Sujets suggérés',
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 max-md:px-4 h-16 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => { saveMemories(); router.push('/dashboard'); }} className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {lang === 'en' ? 'Dashboard' : 'Tableau de bord'}
          </button>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F9250E] flex items-center justify-center"><SparkIcon /></div>
            <div>
              <h1 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.title}</h1>
              <p className="text-[11px] text-gray-400">{t.subtitle}</p>
            </div>
          </div>
        </div>
        <button onClick={() => switchLanguage(lang === 'en' ? 'fr' : 'en', user!.id, supabase, setLang)} className="px-2.5 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>🌐 {lang === 'en' ? 'FR' : 'EN'}</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[700px] mx-auto flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[14.5px] leading-[1.65] ${msg.role === 'user' ? 'bg-[#F9250E] text-white rounded-br-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[12px] text-gray-400 ml-2">{t.typing}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="max-w-[700px] mx-auto">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t.suggestLabel}</p>
            <div className="flex flex-wrap gap-2">
              {(lang === 'en' ? trackSuggestions.en : trackSuggestions.fr).map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 font-medium cursor-pointer hover:border-[#F9250E] hover:text-[#F9250E] transition-all" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-[700px] mx-auto flex gap-3 items-end">
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={t.placeholder} rows={1}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FAFB] text-[14.5px] text-gray-900 outline-none resize-none focus:border-[#F9250E] transition-all placeholder:text-gray-400"
            style={{ fontFamily: 'inherit', maxHeight: '120px' }} />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-[#F9250E] flex items-center justify-center text-white cursor-pointer border-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:bg-[#E0200B] shrink-0">
            <SendIcon />
          </button>
        </div>
        <p className="max-w-[700px] mx-auto text-center text-[11px] text-gray-300 mt-2">{t.disclaimer}</p>
      </div>
    </div>
  );
}
