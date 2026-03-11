'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import UserMenu from '@/components/UserMenu';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [prefLang, setPrefLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState('user');
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: profile } = await supabase
        .from('profiles').select('full_name, email, preferred_language, role, created_at')
        .eq('id', user!.id).single();
      if (profile) {
        setFullName(profile.full_name || '');
        setEmail(profile.email || user!.email || '');
        setPrefLang(profile.preferred_language || 'en');
        setRole(profile.role || 'user');
        setCreatedAt(profile.created_at || '');
      }
    }
    load();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    await supabase.from('profiles').update({
      full_name: fullName,
      preferred_language: prefLang,
    }).eq('id', user!.id);

    // Also update auth metadata
    await supabase.auth.updateUser({
      data: { full_name: fullName, first_name: fullName.split(' ')[0], last_name: fullName.split(' ').slice(1).join(' ') },
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const t = {
    en: {
      title: 'Settings', subtitle: 'Manage your profile and preferences',
      profile: 'Profile', name: 'Full Name', email: 'Email',
      emailNote: 'Contact support to change your email',
      language: 'Preferred Language', save: 'Save Changes', saved: 'Saved!',
      account: 'Account', role: 'Role', joined: 'Joined',
      back: 'Dashboard', langLabel: 'FR',
    },
    fr: {
      title: 'Param\u00e8tres', subtitle: 'G\u00e9rez votre profil et vos pr\u00e9f\u00e9rences',
      profile: 'Profil', name: 'Nom complet', email: 'Email',
      emailNote: 'Contactez le support pour changer votre email',
      language: 'Langue pr\u00e9f\u00e9r\u00e9e', save: 'Enregistrer', saved: 'Enregistr\u00e9 !',
      account: 'Compte', role: 'R\u00f4le', joined: 'Inscrit le',
      back: 'Tableau de bord', langLabel: 'EN',
    },
  }[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 max-md:px-5 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 no-underline transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t.back}
          </Link>
          <div className="w-px h-8 bg-gray-200" />
          <h1 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className="px-2.5 py-1 rounded-md bg-transparent border-[1.5px] border-gray-200 cursor-pointer text-[11px] font-semibold text-gray-500" style={{ fontFamily: 'inherit' }}>🌐 {t.langLabel}</button>
          <UserMenu />
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.title}</h2>
          <p className="text-[14px] text-gray-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="text-[16px] font-bold text-gray-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.profile}</h3>

          <div className="flex flex-col gap-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F9250E] flex items-center justify-center text-[22px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {fullName ? fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
              <div>
                <div className="text-[16px] font-semibold text-gray-900">{fullName || 'No name set'}</div>
                <div className="text-[13px] text-gray-400">{email}</div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{t.name}</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[14.5px] text-gray-900 outline-none focus:border-[#F9250E] focus:shadow-[0_0_0_3px_rgba(249,37,14,0.06)] transition-all"
                style={{ fontFamily: 'inherit' }} placeholder="Denis Ekobena" />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{t.email}</label>
              <input value={email} disabled
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-[14.5px] text-gray-500 outline-none cursor-not-allowed"
                style={{ fontFamily: 'inherit' }} />
              <p className="text-[11px] text-gray-400 mt-1">{t.emailNote}</p>
            </div>

            {/* Language */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{t.language}</label>
              <div className="flex gap-3">
                {[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Fran\u00e7ais' }].map(opt => (
                  <button key={opt.value} onClick={() => setPrefLang(opt.value)}
                    className={`flex-1 py-3 rounded-xl border-[1.5px] cursor-pointer text-[14px] font-semibold transition-all ${prefLang === opt.value ? 'border-[#F9250E] bg-red-50/50 text-[#F9250E]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-white bg-[#F9250E] hover:bg-[#E0200B] transition-all disabled:opacity-60"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {saving ? '...' : t.save}
            </button>
            {saved && <span className="text-[13px] font-semibold text-green-600">{t.saved}</span>}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.account}</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-gray-500">{t.role}</span>
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${role === 'admin' ? 'bg-purple-100 text-purple-700' : role === 'coach' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-[13px] text-gray-500">{t.joined}</span>
              <span className="text-[13px] text-gray-700">{createdAt ? new Date(createdAt).toLocaleDateString() : '-'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-[13px] text-gray-500">Email</span>
              <span className="text-[13px] text-gray-700">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
