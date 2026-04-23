'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ToastProvider, useToast } from '@/components/admin/Toast';
import { relativeTime } from '@/lib/admin/constants';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 50;

type Filter = 'unhandled' | 'handled' | 'all';

const topicLabel: Record<string, string> = {
  general: 'General question',
  partnership: 'Partnership',
  billing: 'Billing',
  press: 'Press',
  feedback: 'Feedback',
  other: 'Other',
};

export default function InboxPageWrapper() {
  return (
    <ToastProvider>
      <InboxPage />
    </ToastProvider>
  );
}

function InboxPage() {
  const supabase = createClient();
  const { showToast } = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('unhandled');
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('admin_list_contact_submissions', {
      filter_handled: filter,
      limit_n: PAGE_SIZE,
      offset_n: page * PAGE_SIZE,
    });
    if (error) {
      showToast('error', error.message);
      setLoading(false);
      return;
    }
    setRows(data || []);
    setTotal(data?.[0]?.total_count ?? 0);
    setLoading(false);
  }, [filter, page]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function markHandled(id: string) {
    setBusyId(id);
    const { error } = await supabase.rpc('admin_mark_contact_handled', { submission_id: id });
    setBusyId(null);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', 'Marked as handled');
    router.refresh();
    fetchRows();
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-[1100px] mx-auto px-8 max-md:px-5 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-[22px] font-bold text-white">Inbox</h1>
        <div className="text-[12px] text-neutral-500">{total.toLocaleString()} in view</div>
      </div>

      <div className="flex gap-1 mb-6 bg-[#111118] border border-neutral-800 rounded-xl p-1 w-fit">
        {(['unhandled', 'handled', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-[12px] font-semibold capitalize transition-colors ${
              filter === f ? 'bg-[#F9250E]/15 text-white' : 'text-neutral-400 hover:text-white bg-transparent'
            } border-none cursor-pointer`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-[14px]">No submissions.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r: any) => {
            const expanded = expandedId === r.id;
            const topic = topicLabel[r.topic] || r.topic;
            const failed = r.resend_status === 'failed';
            const waPhone = r.phone ? r.phone.replace(/\D/g, '') : '';
            return (
              <div key={r.id} className="bg-[#111118] border border-neutral-800 rounded-2xl overflow-hidden">
                {failed && (
                  <div className="bg-red-900/30 border-b border-red-800 px-5 py-2 text-[11px] text-red-200">
                    Auto-reply failed. Please contact manually.
                  </div>
                )}
                <button
                  onClick={() => setExpandedId(expanded ? null : r.id)}
                  className="w-full text-left px-5 py-4 bg-transparent border-none cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[14px] font-semibold text-white">{r.name}</span>
                        <span className="text-[12px] text-neutral-500">· {r.email}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 capitalize">
                          {topic}
                        </span>
                        <StatusIcon status={r.resend_status} />
                        {r.handled_at && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 border border-green-700">
                            HANDLED
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-neutral-400 line-clamp-2">{r.message}</p>
                    </div>
                    <span className="text-[11px] text-neutral-500 whitespace-nowrap">{relativeTime(r.created_at)}</span>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-neutral-800 px-5 py-4 bg-[#0B0B0C]">
                    <p className="text-[13.5px] text-neutral-200 whitespace-pre-wrap leading-[1.65] mb-4">{r.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`mailto:${r.email}?subject=${encodeURIComponent('Re: Your message to Equip2Lead')}`}
                        className="px-3 py-1.5 rounded-lg bg-[#F9250E] text-white text-[11px] font-semibold no-underline"
                      >
                        Reply by email
                      </a>
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}`}
                          target="_blank"
                          rel="noopener"
                          className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-[11px] font-semibold no-underline"
                        >
                          WhatsApp
                        </a>
                      )}
                      {!r.handled_at && (
                        <button
                          disabled={busyId === r.id}
                          onClick={() => markHandled(r.id)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-transparent text-neutral-200 text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {busyId === r.id ? 'Saving…' : 'Mark handled'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-6 text-[12px] text-neutral-500">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-transparent text-neutral-300 cursor-pointer disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-transparent text-neutral-300 cursor-pointer disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string | null }) {
  if (status === 'sent') return <span className="text-green-400 text-[11px]" title="Auto-reply sent">✓ sent</span>;
  if (status === 'failed') return <span className="text-red-400 text-[11px]" title="Auto-reply failed">✗ failed</span>;
  if (status === 'skipped') return <span className="text-neutral-500 text-[11px]">skipped</span>;
  return null;
}
