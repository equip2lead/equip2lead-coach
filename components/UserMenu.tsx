'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  const initials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('role').eq('id', user.id).single().then(({ data }) => {
      if (data?.role === 'admin') setIsAdmin(true);
    });
  }, [user?.id]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const items = [
    { label: 'Dashboard', href: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
    { label: 'My Track', href: '/track-selection', icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' },
    { label: 'AI Coach', href: '/ai-coach', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { label: 'Settings', href: '/settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  ];

  if (isAdmin) {
    items.push({ label: 'Admin', href: '/admin', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' });
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-[#F9250E] flex items-center justify-center text-[13px] font-bold text-white cursor-pointer border-none transition-all hover:shadow-md"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden z-50 animate-[menuIn_0.15s_ease]">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-[13px] font-semibold text-gray-900">{userName}</div>
            <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
          </div>

          {/* Links */}
          <div className="py-1">
            {items.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 no-underline transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-gray-400"><path d={item.icon}/></svg>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button onClick={() => { setOpen(false); signOut(); }}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 w-full bg-transparent border-none cursor-pointer transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Log out
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
