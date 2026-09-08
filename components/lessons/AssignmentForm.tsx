'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  saveAssignmentDraft, submitAssignment, startAssignmentRevision, restartAssignmentRevision,
} from '@/app/(app)/lessons/[id]/actions';
import type { AssignmentPromptBlock } from '@/lib/lesson-blocks';

const AUTOSAVE_MS = 30_000;
const DISPLAY = "'Plus Jakarta Sans', sans-serif";
const SERIF = "Georgia, 'Libre Baskerville', serif";

type Row = {
  id: string; version: number; status: string;
  body: string; word_count: number; submitted_at: string | null; updated_at: string;
};

/** Which face of the assignment a link asked for. `null` is the default:
    the open draft if there is one, else the last submission, else a blank
    form. See the `?view=` handling in the section page. */
export type AssignmentView = 'submission' | 'edit' | null;

/** Markdown, not HTML: it is what the rest of the app already renders, it
    survives being read back as plain text, and it costs no editor bundle. */
function countWords(text: string): number {
  return text
    .replace(/[#*_>`-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function renderMarkdown(src: string): string {
  const esc = src
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return esc
    .split(/\n{2,}/)
    .map((para) => {
      const lines = para.split('\n');
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('');
        return `<ul class="list-disc pl-6 my-3 space-y-1">${items}</ul>`;
      }
      const h4 = para.match(/^####\s+([\s\S]*)$/);
      if (h4) return `<h4 class="text-[15px] font-bold mt-5 mb-1.5">${inline(h4[1])}</h4>`;
      const h3 = para.match(/^###\s+([\s\S]*)$/);
      if (h3) return `<h3 class="text-[17px] font-bold mt-6 mb-2">${inline(h3[1])}</h3>`;
      return `<p class="mb-4 leading-[1.7]">${inline(para.replace(/\n/g, '<br/>'))}</p>`;
    })
    .join('');
}

function inline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
}

function timeAgo(iso: number, lang: 'en' | 'fr'): string {
  const secs = Math.max(0, Math.round((Date.now() - iso) / 1000));
  if (secs < 5) return lang === 'en' ? 'just now' : "à l'instant";
  if (secs < 60) return lang === 'en' ? `${secs}s ago` : `il y a ${secs}s`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return lang === 'en' ? `${mins}m ago` : `il y a ${mins} min`;
  return lang === 'en' ? `${Math.round(mins / 60)}h ago` : `il y a ${Math.round(mins / 60)} h`;
}

function formatDate(iso: string, lang: 'en' | 'fr') {
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function AssignmentForm({
  block, moduleId, sectionNumber, totalSections, lang, view = null,
}: {
  block: AssignmentPromptBlock;
  moduleId: string;
  sectionNumber: number;
  totalSections: number;
  lang: 'en' | 'fr';
  view?: AssignmentView;
}) {
  const supabase = createClient();
  const router = useRouter();
  const taRef = useRef<HTMLTextAreaElement>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<number | null>(null);
  const [forceReadOnly, setForceReadOnly] = useState(view === 'submission');
  const [staleDraft, setStaleDraft] = useState(false);
  const [tick, setTick] = useState(0);

  const lastSavedBody = useRef('');

  const draft = rows.find((r) => r.status === 'draft') ?? null;
  const submitted = useMemo(
    () => rows.filter((r) => r.status !== 'draft').sort((a, b) => b.version - a.version),
    [rows]
  );
  const latestSubmitted = submitted[0] ?? null;
  const words = countWords(body);
  const min = block.word_min ?? 0;
  const max = block.word_max ?? null;
  const belowMin = words < min;
  const overMax = max != null && words > max;

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoaded(true); return; }
    const { data } = await supabase
      .from('lesson_assignment_submissions')
      .select('id, version, status, body, word_count, submitted_at, updated_at')
      .eq('user_id', user.id)
      .eq('lesson_module_id', moduleId)
      .eq('assignment_key', block.assignment_key)
      .order('version', { ascending: false });

    const all = (data ?? []) as Row[];
    setRows(all);
    const d = all.find((r) => r.status === 'draft');
    if (d) { setBody(d.body ?? ''); lastSavedBody.current = d.body ?? ''; }
    setLoaded(true);
  }, [moduleId, block.assignment_key]);

  useEffect(() => { load(); }, [load]);

  // Keeps "last saved" honest without re-rendering the editor on every stroke.
  useEffect(() => {
    if (savedAt === null) return;
    const t = setInterval(() => setTick((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, [savedAt]);

  const persist = useCallback(async () => {
    if (body === lastSavedBody.current) return;
    setSaving(true);
    const res = await saveAssignmentDraft(moduleId, block.assignment_key, body, countWords(body));
    setSaving(false);
    if (res.ok) {
      lastSavedBody.current = body;
      setSavedAt(Date.now());
      if (!draft) load();
    } else setError(res.error);
  }, [body, moduleId, block.assignment_key, draft, load]);

  // Autosave only what changed, and only while there is something to save.
  useEffect(() => {
    if (!loaded || latestSubmitted && !draft) return;
    const t = setInterval(persist, AUTOSAVE_MS);
    return () => clearInterval(t);
  }, [loaded, persist, latestSubmitted, draft]);

  // A tab closed mid-sentence should not lose the sentence.
  useEffect(() => {
    const handler = () => { if (body !== lastSavedBody.current) persist(); };
    window.addEventListener('visibilitychange', handler);
    return () => window.removeEventListener('visibilitychange', handler);
  }, [body, persist]);

  const wrap = (before: string, after = before) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const next = body.slice(0, s) + before + body.slice(s, e) + after + body.slice(e);
    setBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    });
  };

  const prefixLine = (prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const lineStart = body.lastIndexOf('\n', s - 1) + 1;
    const next = body.slice(0, lineStart) + prefix + body.slice(lineStart);
    setBody(next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length); });
  };

  const doSubmit = async () => {
    setConfirming(false);
    setBusy(true); setError(null);
    const res = await submitAssignment(
      moduleId, block.assignment_key, body, countWords(body), sectionNumber, totalSections
    );
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    await load();
    setViewingVersion(null);
    router.refresh();
  };

  const doRevise = async () => {
    setBusy(true); setError(null);
    const res = await startAssignmentRevision(moduleId, block.assignment_key);
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    await load();
    setViewingVersion(null);
    setForceReadOnly(false);
  };

  /** Discard the stale draft and seed a fresh one from the last submission. */
  const doDiscardDraft = async () => {
    setBusy(true); setError(null);
    const res = await restartAssignmentRevision(moduleId, block.assignment_key);
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    await load();
    setStaleDraft(false);
    setViewingVersion(null);
    setForceReadOnly(false);
  };

  /**
   * Apply `?view=` once the rows are in, exactly once per mount.
   *
   * `edit` is a request to be editing, so where there is no draft it opens
   * one. Where there already is a draft it opens *that* — half-written work is
   * never silently replaced, even when it predates the last submission. That
   * older case only says the reader has something in flight they may have
   * forgotten, so it is flagged rather than resolved on their behalf.
   */
  const viewApplied = useRef(false);
  useEffect(() => {
    if (!loaded || viewApplied.current) return;
    viewApplied.current = true;
    if (view !== 'edit') return;

    const d = rows.find((r) => r.status === 'draft') ?? null;
    const latest = rows
      .filter((r) => r.status !== 'draft')
      .sort((a, b) => b.version - a.version)[0] ?? null;

    if (d) {
      if (latest?.submitted_at && d.updated_at < latest.submitted_at) setStaleDraft(true);
      return;
    }
    if (latest) doRevise();
  // doRevise is stable for this purpose and re-running on its identity would
  // defeat the once-only guard.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, view, rows]);

  const t = {
    words: lang === 'en' ? 'words' : 'mots',
    of: lang === 'en' ? 'of' : 'sur',
    needMore: (n: number) => lang === 'en' ? `${n} more to reach the minimum` : `${n} de plus pour atteindre le minimum`,
    overBy: (n: number) => lang === 'en' ? `${n} over the maximum` : `${n} au-dessus du maximum`,
    saving: lang === 'en' ? 'Saving…' : 'Enregistrement…',
    savedAgo: (s: string) => lang === 'en' ? `Last saved ${s}` : `Enregistré ${s}`,
    notSaved: lang === 'en' ? 'Not saved yet' : 'Pas encore enregistré',
    submittedOn: lang === 'en' ? 'Submitted on' : 'Soumis le',
    edit: lang === 'en' ? 'Edit and resubmit' : 'Modifier et resoumettre',
    history: lang === 'en' ? 'Version history' : 'Historique des versions',
    staleDraft: lang === 'en'
      ? 'You have an unsaved draft older than your last submission.'
      : 'Vous avez un brouillon non soumis antérieur à votre dernière soumission.',
    discardDraft: lang === 'en' ? 'Discard draft' : 'Supprimer le brouillon',
    continueDraft: lang === 'en' ? 'Continue with draft' : 'Continuer avec le brouillon',
    version: lang === 'en' ? 'Version' : 'Version',
    latest: lang === 'en' ? 'latest' : 'dernière',
    placeholder: lang === 'en'
      ? 'Write in your own voice. **bold**, *italic*, ### heading, - bullet.'
      : 'Écrivez avec vos mots. **gras**, *italique*, ### titre, - puce.',
  };

  if (!loaded) {
    return <div className="my-8 rounded-2xl border border-gray-200 bg-white p-8 text-[13px] text-gray-400">…</div>;
  }

  const viewing = viewingVersion != null ? submitted.find((r) => r.version === viewingVersion) ?? null : latestSubmitted;
  // ?view=submission asks for the submitted version specifically, so it wins
  // over an open draft — the draft is still there, one click away.
  const readOnly = forceReadOnly ? !!latestSubmitted : (!draft && !!latestSubmitted);

  return (
    <section className="my-10 rounded-2xl border-2 border-[#F9250E]/20 bg-white p-8 max-md:p-5">
      {/* Version history */}
      {submitted.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-gray-400">{t.history}</span>
          {submitted.slice().reverse().map((r) => {
            const active = (viewingVersion ?? latestSubmitted?.version) === r.version;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setViewingVersion(r.version)}
                className={`rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                  active ? 'border-[#F9250E] bg-[#F9250E]/8 text-[#F9250E]' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                v{r.version}
                {r.version === latestSubmitted?.version && <span className="ml-1 text-[10px] font-normal opacity-70">({t.latest})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* The reader arrived at ?view=edit and found work already in flight
          that predates their last submission. Both ways out are one click. */}
      {staleDraft && !readOnly && (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
          <p className="text-[13.5px] leading-[1.5] text-amber-900">{t.staleDraft}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={doDiscardDraft}
              disabled={busy}
              className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60"
              style={{ fontFamily: 'inherit' }}
            >
              {busy ? '…' : t.discardDraft}
            </button>
            <button
              type="button"
              onClick={() => setStaleDraft(false)}
              className="rounded-lg border border-transparent bg-amber-100 px-3 py-1.5 text-[12.5px] font-semibold text-amber-900 transition-colors hover:bg-amber-200"
              style={{ fontFamily: 'inherit' }}
            >
              {t.continueDraft}
            </button>
          </div>
        </div>
      )}

      {/* Read-only: a submitted version, frozen */}
      {readOnly && viewing ? (
        <>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[13px] font-semibold text-emerald-700">
              ✓ {t.submittedOn} {viewing.submitted_at ? formatDate(viewing.submitted_at, lang) : '—'}
              <span className="ml-2 font-normal text-gray-400">· {t.version} {viewing.version} · {viewing.word_count} {t.words}</span>
            </p>
          </div>
          <div
            className="text-[16px] text-gray-800"
            style={{ fontFamily: SERIF }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(viewing.body || '') }}
          />
          <button
            type="button"
            onClick={doRevise}
            disabled={busy}
            className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
            style={{ fontFamily: 'inherit' }}
          >
            {busy ? '…' : t.edit}
          </button>
        </>
      ) : (
        <>
          {/* Toolbar. Markdown syntax rather than a rich-text model: the value
              stays plain text, so it survives storage, export and the AI Coach
              reading it back later. */}
          <div className="mb-2 flex flex-wrap items-center gap-1 border-b border-gray-100 pb-2">
            {[
              { label: 'B', title: 'Bold', cls: 'font-bold', run: () => wrap('**') },
              { label: 'I', title: 'Italic', cls: 'italic', run: () => wrap('*') },
              { label: 'H3', title: 'Heading', cls: 'font-bold text-[11px]', run: () => prefixLine('### ') },
              { label: 'H4', title: 'Subheading', cls: 'font-bold text-[11px]', run: () => prefixLine('#### ') },
              { label: '• List', title: 'Bullet', cls: 'text-[11px]', run: () => prefixLine('- ') },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                title={b.title}
                onClick={b.run}
                className={`h-7 min-w-[28px] rounded-md border border-gray-200 bg-white px-2 text-[12.5px] text-gray-600 transition-colors hover:bg-gray-50 ${b.cls}`}
                style={{ fontFamily: 'inherit' }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <textarea
            ref={taRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={persist}
            placeholder={t.placeholder}
            rows={14}
            className="w-full resize-y rounded-xl border border-gray-200 bg-white p-4 text-[16px] leading-[1.7] text-gray-800 outline-none transition-colors focus:border-[#F9250E]/40"
            style={{ fontFamily: SERIF }}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12.5px] text-gray-500">
              <span className={`font-bold tabular-nums ${belowMin || overMax ? 'text-amber-600' : 'text-emerald-600'}`}>{words}</span>
              {' '}{t.words}
              {min > 0 && <span className="text-gray-400"> · {min}{max ? `–${max}` : '+'} {t.of} target</span>}
              {belowMin && <span className="ml-2 text-amber-600">{t.needMore(min - words)}</span>}
              {overMax && <span className="ml-2 text-amber-600">{t.overBy(words - (max as number))}</span>}
            </p>

            <p className="text-[12px] text-gray-400" aria-live="polite">
              {saving ? t.saving : savedAt ? t.savedAgo(timeAgo(savedAt, lang)) : t.notSaved}
              <span className="hidden">{tick}</span>
            </p>
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{error}</p>
          )}

          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={belowMin || busy}
            className="mt-5 rounded-xl border-none bg-[#F9250E] px-6 py-3 text-[14px] font-bold text-white transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ fontFamily: DISPLAY, boxShadow: '0 4px 16px rgba(249,37,14,0.25)' }}
          >
            {busy ? '…' : (block.submit_label ?? (lang === 'en' ? 'Submit' : 'Soumettre'))}
          </button>
        </>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={() => setConfirming(false)}>
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-[18px] font-bold text-gray-900" style={{ fontFamily: DISPLAY }}>
              {lang === 'en' ? 'Submit this?' : 'Soumettre ceci ?'}
            </h3>
            <p className="mb-6 text-[14px] leading-[1.7] text-gray-600">
              {lang === 'en'
                ? `Once submitted, you can request an edit but this version will be preserved as version ${draft?.version ?? 1}.`
                : `Une fois soumis, vous pourrez demander une modification, mais cette version sera conservée comme version ${draft?.version ?? 1}.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-gray-600"
                style={{ fontFamily: 'inherit' }}
              >
                {lang === 'en' ? 'Cancel' : 'Annuler'}
              </button>
              <button
                onClick={doSubmit}
                className="flex-1 rounded-xl border-none bg-[#F9250E] px-4 py-2.5 text-[13.5px] font-bold text-white"
                style={{ fontFamily: DISPLAY }}
              >
                {block.submit_label ?? (lang === 'en' ? 'Submit' : 'Soumettre')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
