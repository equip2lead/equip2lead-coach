import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getDashboardData } from '@/lib/dashboard/data';
import { Greeting } from '@/components/dashboard/Greeting';
import { NextStep } from '@/components/dashboard/NextStep';
import { WhatYouveWritten } from '@/components/dashboard/WhatYouveWritten';
import { ModuleGrid } from '@/components/dashboard/ModuleGrid';
import { YourPillars } from '@/components/dashboard/YourPillars';
import { ClosingWord } from '@/components/dashboard/ClosingWord';

// The coach's office. Text-forward at the top, browsable in the middle,
// lightly data-informed at the bottom — a server component throughout, with
// client islands only where the browser knows something the server does not.
//

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) redirect('/auth?redirect=%2Fdashboard');

  // A reader with no journey has not chosen a track yet, and every block below
  // is about a track. Sending them to choose one is the only useful answer.
  if (!data.journeyId) redirect('/track-selection');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Greeting data={data} />
      <NextStep data={data} />
      {/* Renders nothing until there is something written. */}
      <WhatYouveWritten data={data} />
      <Suspense fallback={null}>
        <ModuleGrid
          modules={data.modules}
          recommendedId={data.nextStep.kind === 'module' ? data.nextStep.module.id : null}
          lang={data.lang}
        />
      </Suspense>
      <YourPillars data={data} />
      <ClosingWord lang={data.lang} />
    </div>
  );
}
