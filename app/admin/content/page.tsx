'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackIcons } from '@/lib/admin/constants';

export default function ContentPage() {
  const supabase = createClient();
  const [tracks, setTracks] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [contentStats, setContentStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [docForm, setDocForm] = useState({
    track_id: '',
    pillar_id: '',
    title: '',
    content: '',
    language: 'en',
    difficulty: 'beginner',
    sub_domain: '',
    source: '',
    author: '',
  });

  async function load() {
    setLoading(true);
    const [tRes, pRes, cs] = await Promise.all([
      supabase.from('tracks').select('id, slug, name_en').order('sort_order'),
      supabase.from('pillars').select('id, name_en, track_id, sort_order').order('sort_order'),
      supabase.rpc('get_content_stats'),
    ]);
    setTracks(tRes.data || []);
    setPillars(pRes.data || []);
    setContentStats(cs.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSaveDoc() {
    if (!docForm.track_id || !docForm.pillar_id || !docForm.title || !docForm.content) return;
    setSaving(true);
    const res = await fetch('/api/admin/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docForm),
    });
    if (res.ok) {
      const { id } = await res.json();
      fetch('/api/admin/documents/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      }).catch(() => {});
      setShowAddDoc(false);
      setDocForm({
        track_id: '',
        pillar_id: '',
        title: '',
        content: '',
        language: 'en',
        difficulty: 'beginner',
        sub_domain: '',
        source: '',
        author: '',
      });
      load();
    }
    setSaving(false);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 max-md:px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-bold text-white">Content</h1>
        <button
          onClick={() => setShowAddDoc(true)}
          className="px-5 py-2.5 rounded-xl border-none cursor-pointer text-[13px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all"
          style={{ boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
        >
          + Add Document
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {tracks.map((track) => {
            const trackPillars = pillars.filter((p) => p.track_id === track.id);
            const trackRows = contentStats.filter((r: any) => r.track_slug === track.slug);
            const totalDocs = trackRows.reduce((a: number, r: any) => a + (r.total_docs || 0), 0);
            const embeddedDocs = trackRows.reduce((a: number, r: any) => a + (r.embedded_count || 0), 0);
            return (
              <div key={track.id} className="bg-[#111118] rounded-2xl border border-neutral-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[20px]">{trackIcons[track.slug] || '📋'}</span>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-white">{track.name_en}</h3>
                    <p className="text-[12px] text-neutral-500">
                      {totalDocs} docs ({embeddedDocs} embedded)
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {trackPillars.map((p) => {
                    const pDocs = contentStats.filter((r: any) => r.pillar_id === p.id);
                    const pTotal = pDocs.reduce((a: number, r: any) => a + (r.total_docs || 0), 0);
                    return (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-neutral-800/50 last:border-b-0">
                        <span className="text-[13px] text-neutral-400 flex-1">{p.name_en}</span>
                        <span className="text-[12px] font-semibold text-neutral-500">{pTotal} docs</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setShowAddDoc(false)}
        >
          <div
            className="bg-[#111118] rounded-2xl border border-neutral-800 p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[20px] font-bold text-white mb-6">Add Knowledge Document</h3>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Track *">
                  <select
                    value={docForm.track_id}
                    onChange={(e) => setDocForm((f) => ({ ...f, track_id: e.target.value, pillar_id: '' }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  >
                    <option value="">Select track</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name_en}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Pillar *">
                  <select
                    value={docForm.pillar_id}
                    onChange={(e) => setDocForm((f) => ({ ...f, pillar_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  >
                    <option value="">Select pillar</option>
                    {pillars
                      .filter((p) => p.track_id === docForm.track_id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name_en}
                        </option>
                      ))}
                  </select>
                </Field>
              </div>

              <Field label="Title *">
                <input
                  value={docForm.title}
                  onChange={(e) => setDocForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                />
              </Field>

              <Field label="Content *">
                <textarea
                  value={docForm.content}
                  onChange={(e) => setDocForm((f) => ({ ...f, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none resize-none"
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Language">
                  <select
                    value={docForm.language}
                    onChange={(e) => setDocForm((f) => ({ ...f, language: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select
                    value={docForm.difficulty}
                    onChange={(e) => setDocForm((f) => ({ ...f, difficulty: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </Field>
                <Field label="Sub-domain">
                  <input
                    value={docForm.sub_domain}
                    onChange={(e) => setDocForm((f) => ({ ...f, sub_domain: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Source">
                  <input
                    value={docForm.source}
                    onChange={(e) => setDocForm((f) => ({ ...f, source: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  />
                </Field>
                <Field label="Author">
                  <input
                    value={docForm.author}
                    onChange={(e) => setDocForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
                  />
                </Field>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSaveDoc}
                  disabled={saving || !docForm.track_id || !docForm.pillar_id || !docForm.title || !docForm.content}
                  className="flex-1 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white bg-[#F9250E] hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save & Embed'}
                </button>
                <button
                  onClick={() => setShowAddDoc(false)}
                  className="px-6 py-3 rounded-xl border border-neutral-700 bg-transparent cursor-pointer text-[13px] font-semibold text-neutral-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
