'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { roleBadgeClass, tierBadgeClass, relativeTime, trackColors } from '@/lib/admin/constants';
import { UserDetailDrawer } from '@/components/admin/UserDetailDrawer';
import { Modal } from '@/components/admin/Modal';
import { ToastProvider, useToast } from '@/components/admin/Toast';

const PAGE_SIZE = 50;

export default function UsersPageWrapper() {
  return (
    <ToastProvider>
      <UsersPage />
    </ToastProvider>
  );
}

function UsersPage() {
  const supabase = createClient();
  const router = useRouter();
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<any | null>(null);
  const [actionKind, setActionKind] = useState<'role' | 'ban' | 'unban' | 'delete' | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [menuForId, setMenuForId] = useState<string | null>(null);

  const [newRole, setNewRole] = useState('user');
  const [banDays, setBanDays] = useState<number | null>(30);
  const [banReason, setBanReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUserId(user?.id ?? null));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, roleFilter, tierFilter]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('admin_list_users', {
      search: debouncedSearch || null,
      filter_role: roleFilter === 'all' ? null : roleFilter,
      filter_tier: tierFilter === 'all' ? null : tierFilter,
      limit_n: PAGE_SIZE,
      offset_n: page * PAGE_SIZE,
    });
    if (error) {
      if (/unauthori[sz]ed/i.test(error.message)) {
        router.replace('/dashboard');
        return;
      }
      showToast('error', error.message);
      setLoading(false);
      return;
    }
    setUsers(data || []);
    setTotalCount(data?.[0]?.total_count ?? 0);
    setLoading(false);
  }, [debouncedSearch, roleFilter, tierFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    function onClick() {
      setMenuForId(null);
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function openAction(u: any, kind: 'role' | 'ban' | 'unban' | 'delete') {
    setActionTarget(u);
    setActionKind(kind);
    setNewRole(u.role || 'user');
    setBanDays(30);
    setBanReason('');
    setDeleteReason('');
    setDeleteConfirmEmail('');
  }

  function closeAction() {
    setActionTarget(null);
    setActionKind(null);
  }

  async function submitRoleChange() {
    if (!actionTarget) return;
    setActionBusy(true);
    const { error } = await supabase.rpc('admin_change_role', {
      target_id: actionTarget.user_id,
      new_role: newRole,
    });
    setActionBusy(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', `Role changed to ${newRole}`);
    closeAction();
    fetchUsers();
  }

  async function submitBan() {
    if (!actionTarget) return;
    setActionBusy(true);
    const { error } = await supabase.rpc('admin_ban_user', {
      target_id: actionTarget.user_id,
      duration_days: banDays,
      reason: banReason || null,
    });
    setActionBusy(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', banDays ? `User suspended for ${banDays} days` : 'User suspended indefinitely');
    closeAction();
    fetchUsers();
  }

  async function submitUnban() {
    if (!actionTarget) return;
    setActionBusy(true);
    const { error } = await supabase.rpc('admin_unban_user', { target_id: actionTarget.user_id });
    setActionBusy(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', 'User unbanned');
    closeAction();
    fetchUsers();
  }

  async function submitDelete() {
    if (!actionTarget) return;
    setActionBusy(true);
    const { error } = await supabase.rpc('admin_delete_user', {
      target_id: actionTarget.user_id,
      reason: deleteReason || 'admin delete',
    });
    setActionBusy(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', 'User deleted');
    closeAction();
    fetchUsers();
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 max-md:px-5 py-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-[22px] font-bold text-white">Users</h1>
        <div className="text-[12px] text-neutral-500">{totalCount.toLocaleString()} total</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-[#111118] text-[14px] text-white outline-none focus:border-[#F9250E] transition-all placeholder:text-neutral-600"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-[#111118] text-[13px] text-white outline-none focus:border-[#F9250E]"
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="coach">Coach</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super admin</option>
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-[#111118] text-[13px] text-white outline-none focus:border-[#F9250E]"
        >
          <option value="all">All tiers</option>
          <option value="free">Free</option>
          <option value="growth">Growth</option>
          <option value="transform">Transform</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-[#F9250E] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-[#111118] rounded-2xl border border-neutral-800 overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    {['User', 'Role', 'Tier', 'Track', 'Week', 'Streak', 'Last Active', ''].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => {
                    const role = u.role || 'user';
                    const tier = u.subscription_tier || 'free';
                    const trackSlug = u.track_slug || '';
                    const tColor = trackColors[trackSlug] || '#6B7280';
                    const isSelf = u.user_id === currentUserId;
                    return (
                      <tr
                        key={u.user_id}
                        className="border-b border-neutral-800/50 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setDrawerUserId(u.user_id)}
                            className="flex items-center gap-3 bg-transparent border-none cursor-pointer text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-white">
                              {(u.full_name || u.email || '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-white flex items-center gap-2">
                                {u.full_name || 'No name'}
                                {u.is_banned && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-700">
                                    BANNED
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-500">{u.email}</div>
                            </div>
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${roleBadgeClass[role]}`}>{role}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tierBadgeClass[tier]}`}>{tier}</span>
                        </td>
                        <td className="px-5 py-4">
                          {trackSlug ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: tColor }} />
                              <span className="text-[13px] text-neutral-300 capitalize">{trackSlug}</span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[13px] text-neutral-400">{u.current_week ? `${u.current_week}/12` : '—'}</span>
                        </td>
                        <td className="px-5 py-4">
                          {(u.current_streak ?? 0) > 0 ? (
                            <span className="text-[13px] text-orange-400">🔥 {u.current_streak}</span>
                          ) : (
                            <span className="text-[12px] text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[12px] text-neutral-500">{relativeTime(u.last_activity)}</span>
                        </td>
                        <td className="px-5 py-4 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuForId(menuForId === u.user_id ? null : u.user_id);
                            }}
                            className="text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer px-2 py-1 rounded"
                            aria-label="User actions"
                          >
                            ⋯
                          </button>
                          {menuForId === u.user_id && (
                            <div
                              className="absolute right-4 top-full mt-1 z-20 bg-[#1a1a24] border border-neutral-800 rounded-xl shadow-xl min-w-[180px] py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MenuButton onClick={() => { setMenuForId(null); setDrawerUserId(u.user_id); }}>View details</MenuButton>
                              {!isSelf && (
                                <>
                                  <MenuButton onClick={() => { setMenuForId(null); openAction(u, 'role'); }}>Change role</MenuButton>
                                  {u.is_banned ? (
                                    <MenuButton onClick={() => { setMenuForId(null); openAction(u, 'unban'); }}>Unban user</MenuButton>
                                  ) : (
                                    <MenuButton onClick={() => { setMenuForId(null); openAction(u, 'ban'); }}>Suspend user</MenuButton>
                                  )}
                                  <div className="my-1 border-t border-neutral-800" />
                                  <MenuButton danger onClick={() => { setMenuForId(null); openAction(u, 'delete'); }}>
                                    Delete user
                                  </MenuButton>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <div className="text-center py-8 text-neutral-600 text-[14px]">No users found</div>}
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {users.map((u: any) => {
              const role = u.role || 'user';
              const tier = u.subscription_tier || 'free';
              const isSelf = u.user_id === currentUserId;
              return (
                <div key={u.user_id} className="bg-[#111118] rounded-2xl border border-neutral-800 p-4">
                  <button
                    onClick={() => setDrawerUserId(u.user_id)}
                    className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-white">
                      {(u.full_name || u.email || '?').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-white truncate">{u.full_name || 'No name'}</div>
                      <div className="text-[11px] text-neutral-500 truncate">{u.email}</div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadgeClass[role]}`}>{role}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tierBadgeClass[tier]}`}>{tier}</span>
                    {u.is_banned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-700">BANNED</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-neutral-500">
                    {u.track_slug && <span className="capitalize">{u.track_slug}</span>}
                    {u.current_week && <span>Wk {u.current_week}/12</span>}
                    <span className="ml-auto">{relativeTime(u.last_activity)}</span>
                  </div>
                  {!isSelf && (
                    <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center gap-2 flex-wrap">
                      <button onClick={() => openAction(u, 'role')} className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 border-none cursor-pointer">Role</button>
                      {u.is_banned ? (
                        <button onClick={() => openAction(u, 'unban')} className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 border-none cursor-pointer">Unban</button>
                      ) : (
                        <button onClick={() => openAction(u, 'ban')} className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 border-none cursor-pointer">Suspend</button>
                      )}
                      <button onClick={() => openAction(u, 'delete')} className="text-[11px] px-2.5 py-1 rounded-lg bg-red-900/40 text-red-300 border-none cursor-pointer ml-auto">Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 text-[12px] text-neutral-500">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-transparent text-neutral-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-transparent text-neutral-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <UserDetailDrawer userId={drawerUserId} onClose={() => setDrawerUserId(null)} />

      <Modal open={actionKind === 'role'} onClose={closeAction} title={`Change role — ${actionTarget?.full_name || actionTarget?.email || ''}`}>
        <div className="flex flex-col gap-4">
          <label className="text-[12px] text-neutral-400">
            New role
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
            >
              <option value="user">User</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </select>
          </label>
          <div className="flex gap-2 justify-end">
            <button onClick={closeAction} className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 cursor-pointer">
              Cancel
            </button>
            <button
              disabled={actionBusy}
              onClick={submitRoleChange}
              className="px-4 py-2 rounded-lg bg-[#F9250E] text-white font-semibold cursor-pointer disabled:opacity-60"
            >
              {actionBusy ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={actionKind === 'ban'} onClose={closeAction} title={`Suspend user — ${actionTarget?.full_name || actionTarget?.email || ''}`}>
        <div className="flex flex-col gap-4">
          <label className="text-[12px] text-neutral-400">
            Duration
            <select
              value={banDays ?? 'null'}
              onChange={(e) => setBanDays(e.target.value === 'null' ? null : Number(e.target.value))}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="null">Indefinite</option>
            </select>
          </label>
          <label className="text-[12px] text-neutral-400">
            Reason
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              placeholder="Optional — shown in audit log"
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none resize-none"
            />
          </label>
          <div className="flex gap-2 justify-end">
            <button onClick={closeAction} className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 cursor-pointer">
              Cancel
            </button>
            <button
              disabled={actionBusy}
              onClick={submitBan}
              className="px-4 py-2 rounded-lg bg-[#F9250E] text-white font-semibold cursor-pointer disabled:opacity-60"
            >
              {actionBusy ? 'Saving…' : 'Suspend'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={actionKind === 'unban'} onClose={closeAction} title="Unban user" width="sm">
        <div className="flex flex-col gap-4">
          <p className="text-[13px] text-neutral-300">
            Lift the suspension for <strong>{actionTarget?.email}</strong>?
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={closeAction} className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 cursor-pointer">
              Cancel
            </button>
            <button
              disabled={actionBusy}
              onClick={submitUnban}
              className="px-4 py-2 rounded-lg bg-[#F9250E] text-white font-semibold cursor-pointer disabled:opacity-60"
            >
              {actionBusy ? 'Saving…' : 'Unban'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={actionKind === 'delete'} onClose={closeAction} title="Delete user" width="md">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-[13px] text-red-100">
            This permanently deletes <strong>{actionTarget?.email}</strong> and cascades to all their data (journeys, scores, lessons, memories). This cannot be undone.
          </div>
          <label className="text-[12px] text-neutral-400">
            Reason (required)
            <input
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
            />
          </label>
          <label className="text-[12px] text-neutral-400">
            Type the user's email to confirm
            <input
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder={actionTarget?.email}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-neutral-700 bg-[#0B0B0C] text-[13px] text-white outline-none"
            />
          </label>
          <div className="flex gap-2 justify-end">
            <button onClick={closeAction} className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 cursor-pointer">
              Cancel
            </button>
            <button
              disabled={actionBusy || deleteConfirmEmail.trim().toLowerCase() !== (actionTarget?.email || '').toLowerCase() || !deleteReason.trim()}
              onClick={submitDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold cursor-pointer disabled:opacity-40"
            >
              {actionBusy ? 'Deleting…' : 'Delete permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MenuButton({
  onClick,
  children,
  danger,
}: {
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-[12px] bg-transparent border-none cursor-pointer transition-colors ${
        danger ? 'text-red-400 hover:bg-red-900/20' : 'text-neutral-200 hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}
