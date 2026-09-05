'use client';

// Reserved space for the AI Coach panel that ships in Phase 5.5. Empty on
// purpose — it exists now so the three-column arithmetic (260 + 900 + 320)
// is settled before there is anything to put in it.
//
// Only rendered at >=1440px. Below that the coach becomes a floating button,
// because 260 + 900 + 320 does not fit a 1440px laptop viewport without
// squeezing the reading column.
export function RightRail() {
  return (
    <aside
      className="hidden rail:block w-[320px] shrink-0 border-l border-gray-200 bg-white"
      aria-hidden="true"
      data-shell-slot="right-rail"
    />
  );
}
