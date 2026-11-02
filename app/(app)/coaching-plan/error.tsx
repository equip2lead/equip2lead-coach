'use client';

import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

// Shown when the plan or journey can't be read. It offers a retry and nothing
// else: a failed read says nothing about whether a plan exists, so this must not
// link to plan generation, which would overwrite a plan that is really there.
// Both languages, because the reader's preference is part of what failed to load.
export default function CoachingPlanError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  // reset() alone only re-renders what's already in the browser. The failure
  // happened on the server, so the page has to be fetched again as well.
  const retry = () => startTransition(() => {
    router.refresh();
    reset();
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-8 py-14 max-md:px-5 max-md:py-20">
      <div role="alert" className="mx-auto max-w-[620px] rounded-2xl border border-gray-200 bg-white p-8 max-md:p-6">
        <p className="text-[16px] leading-[1.65] text-gray-700">We couldn’t load your plan just now.</p>
        <p className="mb-6 text-[16px] leading-[1.65] text-gray-700">Nous n’avons pas pu charger votre plan pour le moment.</p>
        <button
          type="button"
          onClick={retry}
          className="cursor-pointer rounded-xl border-none bg-[#F9250E] px-6 py-3 text-[14px] font-bold text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Try again / Réessayer
        </button>
      </div>
    </div>
  );
}
