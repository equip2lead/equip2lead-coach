'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>;
const ChatIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const ArrowLeft = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const ArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;

const difficultyLabels: Record<string, { en: string; fr: string; color: string }> = {
  beginner: { en: 'Beginner', fr: 'D\u00e9butant', color: '#059669' },
  intermediate: { en: 'Intermediate', fr: 'Interm\u00e9diaire', color: '#D97706' },
  advanced: { en: 'Advanced', fr: 'Avanc\u00e9', color: '#DC2626' },
};

type Lesson = {
  id: string;
  title: string;
  content: string;
  sub_domain: string;
  difficulty: string;
  pillar_id: string;
  source: string | null;
  author: string | null;
  sort_order: number;
};

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [pillarName, setPillarName] = useState('');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState<string | null>(null);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  // Reflection state
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionQuestion, setReflectionQuestion] = useState('');
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [savingReflection, setSavingReflection] = useState(false);

  useEffect(() => {
    if (!user || !lessonId) return;
    async function load() {
      setLoading(true);

      const { data: journey } = await supabase.from('journeys')
        .select('id, track_id')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false }).limit(1).single();
      if (!journey) { setLoading(false); return; }
      setJourneyId(journey.id);

      const { data: doc } = await supabase.from('knowledge_documents')
        .select('id, title, content, sub_domain, difficulty, pillar_id, source, author, sort_order')
        .eq('id', lessonId)
        .single();
      if (!doc) { setLoading(false); return; }
      setLesson(doc);

      const { data: pillar } = await supabase.from('pillars')
        .select('name_en, name_fr')
        .eq('id', doc.pillar_id)
        .single();
      if (pillar) setPillarName(lang === 'fr' ? pillar.name_fr : pillar.name_en);

      const { data: prog } = await supabase.from('lesson_progress')
        .select('status')
        .eq('journey_id', journey.id)
        .eq('document_id', lessonId)
        .maybeSingle();
      setIsComplete(prog?.status === 'completed');

      if (!prog) {
        await supabase.from('lesson_progress').upsert({
          journey_id: journey.id,
          document_id: lessonId,
          status: 'started',
          started_at: new Date().toISOString(),
        }, { onConflict: 'journey_id,document_id' });
      }

      const { data: siblings } = await supabase.from('knowledge_documents')
        .select('id, sort_order')
        .eq('pillar_id', doc.pillar_id)
        .eq('track_id', journey.track_id)
        .eq('language', lang)
        .order('sort_order');
      if (siblings) {
        const idx = siblings.findIndex(s => s.id === lessonId);
        setPrevId(idx > 0 ? siblings[idx - 1].id : null);
        setNextId(idx < siblings.length - 1 ? siblings[idx + 1].id : null);
      }

      setLoading(false);
    }
    load();
  }, [user?.id, lessonId, lang]);

  const handleComplete = async () => {
    if (!journeyId || completing) return;
    setCompleting(true);
    try {
      const res = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId, documentId: lessonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsComplete(true);
        if (data.badge_earned) setBadgeEarned(data.badge_earned);

        // Fetch reflection prompt
        setLoadingReflection(true);
        setShowReflection(true);
        try {
          const rRes = await fetch(`/api/lessons/reflection?documentId=${lessonId}&journeyId=${journeyId}&language=${lang}`);
          if (rRes.ok) {
            const rData = await rRes.json();
            setReflectionQuestion(rData.question || '');
          }
        } catch {}
        setLoadingReflection(false);
      }
    } catch {}
    setCompleting(false);
  };

  const handleSaveReflection = async () => {
    if (!journeyId || !reflectionAnswer.trim() || savingReflection) return;
    setSavingReflection(true);
    try {
      await fetch('/api/memory/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyId,
          memoryType: 'breakthrough',
          content: `Lesson: ${lesson?.title}. Reflection: ${reflectionAnswer.trim()}`,
        }),
      });
    } catch {}
    setSavingReflection(false);

    const q = reflectionQuestion
      ? `${lesson?.title} — ${reflectionQuestion}`
      : lesson?.title || '';
    router.push(`/ai-coach?q=${encodeURIComponent(q)}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#F9250E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center">
          <p className="text-[16px] text-gray-500 mb-4">{lang === 'en' ? 'Lesson not found' : 'Le\u00e7on introuvable'}</p>
          <button onClick={() => router.push('/my-track')} className="text-[13px] font-semibold text-[#F9250E] bg-transparent border-none cursor-pointer" style={{ fontFamily: 'inherit' }}>
            &larr; {lang === 'en' ? 'Back to Track' : 'Retour au parcours'}
          </button>
        </div>
      </div>
    );
  }

  const diff = difficultyLabels[lesson.difficulty] || difficultyLabels.beginner;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^### (.+)/, '<h3 class="text-[18px] font-bold text-gray-900 mt-6 mb-2" style="font-family: \'Plus Jakarta Sans\', sans-serif">$1</h3>')
        .replace(/^## (.+)/, '<h2 class="text-[20px] font-bold text-gray-900 mt-8 mb-3" style="font-family: \'Plus Jakarta Sans\', sans-serif">$1</h2>')
        .replace(/^# (.+)/, '<h1 class="text-[24px] font-extrabold text-gray-900 mt-8 mb-3" style="font-family: \'Plus Jakarta Sans\', sans-serif">$1</h1>')
        .replace(/^- (.+)/, '<li class="ml-4 text-[14.5px] text-gray-700 leading-[1.75] list-disc">$1</li>')
        .replace(/^\d+\. (.+)/, '<li class="ml-4 text-[14.5px] text-gray-700 leading-[1.75] list-decimal">$1</li>');

      if (processed.startsWith('<h') || processed.startsWith('<li')) {
        return <div key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="text-[14.5px] text-gray-700 leading-[1.75] mb-2" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 max-md:px-4 h-16 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => router.push('/my-track')} className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
          <BackIcon />
          {lang === 'en' ? 'My Track' : 'Mon Parcours'}
        </button>
        <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md border border-gray-200 bg-transparent text-[11px] font-semibold text-gray-500 cursor-pointer" style={{ fontFamily: 'inherit' }}>
          &#x1F310; {lang === 'en' ? 'FR' : 'EN'}
        </button>
      </div>

      {/* Lesson content */}
      <div className="max-w-[720px] mx-auto px-6 max-md:px-4 py-8">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[12px] font-semibold text-gray-400">{pillarName}</span>
          <span className="text-gray-300">&middot;</span>
          <span className="text-[12px] text-gray-400">{lesson.sub_domain}</span>
          <span className="text-gray-300">&middot;</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ color: diff.color, background: `${diff.color}10` }}>
            {lang === 'fr' ? diff.fr : diff.en}
          </span>
        </div>

        <h1 className="text-[28px] max-md:text-[22px] font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {lesson.title}
        </h1>

        {(lesson.author || lesson.source) && (
          <p className="text-[13px] text-gray-400 mb-6">
            {lesson.author && <>{lang === 'en' ? 'By' : 'Par'} <span className="font-semibold text-gray-500">{lesson.author}</span></>}
            {lesson.author && lesson.source && <span className="mx-1">&middot;</span>}
            {lesson.source && <span className="italic">{lesson.source}</span>}
          </p>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-md:p-5 shadow-sm mb-6">
          {renderContent(lesson.content)}
        </div>

        {/* Badge earned toast */}
        {badgeEarned && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-[28px]">&#x1F3C6;</span>
            <div>
              <p className="text-[14px] font-bold text-amber-800">{lang === 'en' ? 'Badge Earned!' : 'Badge obtenu !'}</p>
              <p className="text-[12px] text-amber-600">{badgeEarned}</p>
            </div>
          </div>
        )}

        {/* Reflection panel — shown after marking complete */}
        {showReflection && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><CheckIcon /></div>
              <h3 className="text-[17px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {lang === 'en' ? 'Lesson Complete!' : 'Le\u00e7on termin\u00e9e !'}
              </h3>
            </div>

            <h4 className="text-[14px] font-bold text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? 'Your Personal Reflection' : 'Votre r\u00e9flexion personnelle'}
            </h4>
            <div className="w-12 h-0.5 bg-green-300 rounded mb-4" />

            {loadingReflection ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                <span className="text-[13px] text-gray-500">{lang === 'en' ? 'Generating your reflection question...' : 'G\u00e9n\u00e9ration de votre question...'}</span>
              </div>
            ) : (
              <>
                {reflectionQuestion && (
                  <p className="text-[14.5px] text-gray-700 leading-[1.65] mb-4 italic">
                    &ldquo;{reflectionQuestion}&rdquo;
                  </p>
                )}

                <textarea
                  value={reflectionAnswer}
                  onChange={e => setReflectionAnswer(e.target.value)}
                  placeholder={lang === 'en' ? 'Write your reflection here...' : '\u00c9crivez votre r\u00e9flexion ici...'}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-[14px] text-gray-800 outline-none resize-none focus:border-green-400 transition-all placeholder:text-gray-400"
                  style={{ fontFamily: 'inherit' }}
                />

                <div className="flex gap-3 flex-wrap mt-4">
                  <button
                    onClick={handleSaveReflection}
                    disabled={!reflectionAnswer.trim() || savingReflection}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
                  >
                    <ChatIcon />
                    {savingReflection
                      ? (lang === 'en' ? 'Saving...' : 'Enregistrement...')
                      : (lang === 'en' ? 'Save & Chat with Coach' : 'Enregistrer et discuter')}
                  </button>
                  {nextId && (
                    <button
                      onClick={() => router.push(`/my-track/lesson/${nextId}`)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer text-[13px] font-semibold text-gray-700 hover:-translate-y-px transition-all"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {lang === 'en' ? 'Next Lesson' : 'Le\u00e7on suivante'}
                      <ArrowRight />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions — only show if reflection panel is NOT showing */}
        {!showReflection && (
          <div className="flex gap-3 flex-wrap mb-8">
            {!isComplete ? (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
              >
                <CheckIcon />
                {completing
                  ? (lang === 'en' ? 'Saving...' : 'Enregistrement...')
                  : (lang === 'en' ? 'Mark as Complete' : 'Marquer comme termin\u00e9')}
              </button>
            ) : (
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-50 border border-green-200 text-[14px] font-bold text-green-700">
                <CheckIcon />
                {lang === 'en' ? 'Completed' : 'Termin\u00e9'}
              </div>
            )}
            <button
              onClick={() => router.push(`/ai-coach?q=${encodeURIComponent(lesson.title)}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer text-[13px] font-semibold text-gray-700 hover:-translate-y-px transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ChatIcon />
              {lang === 'en' ? 'Chat about this lesson' : 'Discuter de cette le\u00e7on'}
            </button>
          </div>
        )}

        {/* Prev / Next — only show if reflection panel is NOT showing */}
        {!showReflection && (
          <div className="flex items-center justify-between">
            {prevId ? (
              <button onClick={() => router.push(`/my-track/lesson/${prevId}`)} className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
                <ArrowLeft />
                {lang === 'en' ? 'Previous Lesson' : 'Le\u00e7on pr\u00e9c\u00e9dente'}
              </button>
            ) : <div />}
            {nextId ? (
              <button onClick={() => router.push(`/my-track/lesson/${nextId}`)} className="flex items-center gap-2 text-[13px] font-semibold text-[#F9250E] hover:text-[#C41E0B] bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: 'inherit' }}>
                {lang === 'en' ? 'Next Lesson' : 'Le\u00e7on suivante'}
                <ArrowRight />
              </button>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  );
}
