'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
};

export function Modal({ open, onClose, title, children, width = 'md' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxW = width === 'sm' ? 'max-w-[400px]' : width === 'lg' ? 'max-w-[720px]' : 'max-w-[520px]';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-[#111118] rounded-2xl border border-neutral-800 p-6 w-full ${maxW} animate-[fadeUp_0.15s_ease]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[17px] font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white bg-transparent border-none cursor-pointer p-1"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
