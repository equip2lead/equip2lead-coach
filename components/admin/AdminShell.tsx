'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type NavItem = { href: string; label: string; superOnly?: boolean; badge?: number };

type Props = {
  role: string;
  displayName: string;
  unhandledCount?: number;
  children: React.ReactNode;
};

export function AdminShell({ role, displayName, unhandledCount = 0, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isSuper = role === 'super_admin';

  const nav: NavItem[] = [
    { href: '/admin/overview', label: 'Overview' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/content', label: 'Content' },
    { href: '/admin/gaps', label: 'Gaps' },
    { href: '/admin/inbox', label: 'Inbox', badge: unhandledCount > 0 ? unhandledCount : undefined },
    { href: '/admin/invites', label: 'Invites' },
    { href: '/admin/audit', label: 'Audit', superOnly: true },
  ];

  const visible = nav.filter((n) => !n.superOnly || isSuper);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white font-sans">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-neutral-800 bg-[#0B0B0C]">
          <div className="px-5 py-5 border-b border-neutral-800">
            <Link href="/admin/overview" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg bg-[#F9250E] flex items-center justify-center text-[13px] font-extrabold text-white font-serif">
                E
              </div>
              <span className="text-[14px] font-bold text-white font-serif">
                Equip<span className="text-[#F9250E]">2</span>Lead
              </span>
            </Link>
            <div className="text-[11px] text-neutral-500 mt-1 ml-[42px]">Admin</div>
          </div>
          <nav className="flex-1 py-3">
            {visible.map((n) => {
              const active = pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center justify-between px-5 py-2.5 text-[13px] no-underline transition-colors ${
                    active
                      ? 'bg-[#F9250E]/10 text-white border-l-2 border-[#F9250E]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="font-semibold">{n.label}</span>
                  {n.badge !== undefined && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F9250E] text-white min-w-[18px] text-center">
                      {n.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-neutral-800 p-4">
            <div className="text-[12px] text-neutral-400 truncate">{displayName}</div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-0.5">{role}</div>
            <button
              onClick={handleSignOut}
              className="mt-3 text-[11px] text-neutral-500 hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors"
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#0B0B0C] border-b border-neutral-800">
          <div className="flex items-center justify-between px-5 h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F9250E] flex items-center justify-center text-[12px] font-extrabold text-white font-serif">
                E
              </div>
              <span className="text-[13px] font-bold text-white">Admin</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[11px] text-neutral-500 hover:text-red-400 bg-transparent border-none cursor-pointer"
            >
              Log out
            </button>
          </div>
          <div className="overflow-x-auto border-t border-neutral-800">
            <div className="flex gap-1 px-3 py-2 min-w-max">
              {visible.map((n) => {
                const active = pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold no-underline whitespace-nowrap ${
                      active ? 'bg-[#F9250E]/15 text-white' : 'text-neutral-400 bg-transparent'
                    }`}
                  >
                    {n.label}
                    {n.badge !== undefined && (
                      <span className="text-[9px] font-bold px-1.5 rounded-full bg-[#F9250E] text-white">
                        {n.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <main className="flex-1 min-w-0 md:pt-0 pt-[104px]">{children}</main>
      </div>
    </div>
  );
}
