'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ToastKind = 'success' | 'error' | 'info';
type ToastItem = { id: number; kind: ToastKind; message: string };

type ToastCtx = {
  showToast: (kind: ToastKind, message: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {items.map((t) => {
          const color =
            t.kind === 'success'
              ? 'bg-green-900/40 border-green-700 text-green-100'
              : t.kind === 'error'
              ? 'bg-red-900/40 border-red-700 text-red-100'
              : 'bg-neutral-800 border-neutral-700 text-white';
          return (
            <div
              key={t.id}
              className={`${color} border rounded-xl px-4 py-3 text-[13px] shadow-lg max-w-[360px] pointer-events-auto animate-[fadeUp_0.2s_ease]`}
            >
              {t.message}
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
