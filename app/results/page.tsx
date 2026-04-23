'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { switchLanguage } from '@/lib/language';
import UserMenu from '@/components/UserMenu';
import { Logo } from '@/components/Logo';

const pillarColors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];

const trackNames: Record<string, { en: string; fr: string }> = {
  leadership: { en: 'Leadership Profile', fr: 'Profil de Leadership' },
  ministry: { en: 'Ministry Profile', fr: 'Profil Minist\u00e9riel' },
  marriage: { en: 'Marriage Profile', fr: 'Profil Conjugal' },
  entrepreneur: { en: 'Entrepreneur Profile', fr: 'Profil Entrepreneurial' },
  personal: { en: 'Personal Development Profile', fr: 'Profil de D\u00e9veloppement Personnel' },
};

type DimScore = { name_en: string; name_fr: string; score: number };
type PillarResult = {
  name_en: string;
  name_fr: string;
  sort_order: number;
  score: number;
  dims: DimScore[];
};

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackSlug = searchParams.get('track') || 'leadership';
  const supabase = createClient();
  const { user } = useAuth();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [results, setResults] = useState<PillarResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);

      // Get track
      const { data: track } = await supabase
        .from('tracks').select('id').eq('slug', trackSlug).single();
      if (!track) { setNoData(true); setLoading(false); return; }

      // Get journey
      const { data: journey } = await supabase
        .from('journeys').select('id')
        .eq('user_id', user!.id).eq('track_id', track.id).single();
      if (!journey) { setNoData(true); setLoading(false); return; }

      // Get pillars
      const { data: pillars } = await supabase
        .from('pillars').select('id, name_en, name_fr, sort_order')
        .eq('track_id', track.id).order('sort_order');
      if (!pillars) { setNoData(true); setLoading(false); return; }

      // Get scores
      const { data: scores } = await supabase
        .from('pillar_scores').select('pillar_id, score, sub_domain_scores')
        .eq('journey_id', journey.id);

      // Get sub_domains for name mapping
      const pillarIds = pillars.map(p => p.id);
      const { data: subDomains } = await supabase
        .from('sub_domains').select('id, pillar_id, name_en, name_fr, slug, sort_order')
        .in('pillar_id', pillarIds).order('sort_order');

      // Build results
      const built: PillarResult[] = pillars.map(p => {
        const sc = scores?.find(s => s.pillar_id === p.id);
        const pDims = subDomains?.filter(d => d.pillar_id === p.id) || [];
        const subScores = sc?.sub_domain_scores || {};

        const dims: DimScore[] = pDims.map(d => {
          const slug = d.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return {
            name_en: d.name_en,
            name_fr: d.name_fr,
            score: subScores[slug] || subScores[d.slug] || 0,
          };
        });

        return {
          name_en: p.name_en, name_fr: p.name_fr,
          sort_order: p.sort_order,
          score: sc ? Number(sc.score) : 0,
          dims,
        };
      });

      setResults(built);
      setNoData(built.every(r => r.score === 0));
      setLoading(false);
    }
    load();
  }, [user?.id, trackSlug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading results...</div>;
  }

  const scoredResults = results.filter(r => r.score > 0);
  const overall = scoredResults.length > 0
    ? (scoredResults.reduce((a, p) => a + p.score, 0) / scoredResults.length).toFixed(1)
    : '0.0';
  const strongest = scoredResults.length > 0 ? scoredResults.reduce((max, p) => p.score > max.score ? p : max, scoredResults[0]) : null;
  const weakest = scoredResults.length > 0 ? scoredResults.reduce((min, p) => p.score < min.score ? p : min, scoredResults[0]) : null;
  const tName = trackNames[trackSlug] || trackNames.leadership;

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 max-md:px-5 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="no-underline inline-block">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => switchLanguage(lang === 'en' ? 'fr' : 'en', user!.id, supabase, setLang)} className="px-2.5 py-1 rounded-md bg-transparent border-[1.5px] border-gray-200 cursor-pointer text-[11px] font-semibold text-gray-500" style={{ fontFamily: 'inherit' }}>🌐 {lang === 'en' ? 'FR' : 'EN'}</button>
          <UserMenu />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gray-900 px-8 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(249,37,14,0.06), transparent 60%)' }} />
        <div className="relative z-[2] max-w-[600px] mx-auto">
          <div className="text-[10.5px] font-bold text-[#F9250E] uppercase tracking-[2px] mb-4">{lang === 'en' ? 'YOUR RESULTS' : 'VOS R\u00c9SULTATS'}</div>
          <h1 className="text-[36px] max-md:text-[28px] font-extrabold text-white tracking-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tName[lang]}</h1>
          {noData ? (
            <p className="text-gray-400 mt-4">{lang === 'en' ? 'Complete your assessment to see results' : 'Compl\u00e9tez votre \u00e9valuation pour voir les r\u00e9sultats'}</p>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mt-4">
              <span className="text-[42px] font-extrabold text-white">{overall}</span>
              <span className="text-[14px] text-gray-400">/5.0</span>
            </div>
          )}
        </div>
      </div>

      {!noData && (
        <div className="max-w-[820px] mx-auto px-6 py-10">
          {/* Quick Insights */}
          {strongest && weakest && (
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-10">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-2">{lang === 'en' ? 'Strongest Pillar' : 'Pilier le plus fort'}</div>
                <div className="text-[20px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? strongest.name_en : strongest.name_fr}</div>
                <div className="text-[28px] font-extrabold text-green-600 mt-1">{strongest.score.toFixed(1)}/5</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">{lang === 'en' ? 'Growth Priority' : 'Priorit\u00e9 de croissance'}</div>
                <div className="text-[20px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? weakest.name_en : weakest.name_fr}</div>
                <div className="text-[28px] font-extrabold text-red-600 mt-1">{weakest.score.toFixed(1)}/5</div>
              </div>
            </div>
          )}

          {/* Pillar Scores */}
          <h2 className="text-[20px] font-extrabold text-gray-900 mb-6 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? 'Pillar Breakdown' : 'D\u00e9tail par Pilier'}</h2>
          <div className="flex flex-col gap-4">
            {results.map((pillar, pi) => (
              <div key={pi} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold" style={{ background: `${pillarColors[pi % 5]}15`, color: pillarColors[pi % 5] }}>{pillar.sort_order}</div>
                    <h3 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lang === 'en' ? pillar.name_en : pillar.name_fr}</h3>
                  </div>
                  {pillar.score > 0 ? (
                    <span className="text-[22px] font-extrabold" style={{ color: pillarColors[pi % 5] }}>{pillar.score.toFixed(1)}</span>
                  ) : (
                    <span className="text-[13px] text-gray-300 italic">{lang === 'en' ? 'Not scored' : 'Non \u00e9valu\u00e9'}</span>
                  )}
                </div>
                {pillar.score > 0 && pillar.dims.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {pillar.dims.map((dim, di) => (
                      <div key={di} className="flex items-center gap-3">
                        <span className="text-[13px] text-gray-600 flex-1 min-w-0">{lang === 'en' ? dim.name_en : dim.name_fr}</span>
                        <div className="w-32 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(dim.score / 5) * 100}%`, background: pillarColors[pi % 5] }} />
                        </div>
                        <span className="text-[12px] font-bold text-gray-500 w-8 text-right">{dim.score > 0 ? dim.score.toFixed(1) : '-'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-10 py-4 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] transition-all hover:-translate-y-px"
              style={{ boxShadow: '0 4px 16px rgba(249,37,14,0.25)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {lang === 'en' ? 'Go to Dashboard \u2192' : 'Aller au Tableau de bord \u2192'}
            </button>
          </div>
        </div>
      )}

      {noData && (
        <div className="max-w-[820px] mx-auto px-6 py-10 text-center">
          <button onClick={() => router.push(`/pillar-overview?track=${trackSlug}`)}
            className="px-10 py-4 rounded-xl border-none cursor-pointer text-[15px] font-bold text-white bg-[#F9250E] transition-all hover:-translate-y-px"
            style={{ boxShadow: '0 4px 16px rgba(249,37,14,0.25)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {lang === 'en' ? 'Start Assessment \u2192' : 'Commencer l\u2019\u00e9valuation \u2192'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
