// Shown where a track's lesson modules would be, for tracks with none published
// yet. The modules are the only thing it speaks for: a track's library lessons,
// AI Coach and coaching plan carry on as usual around it.
export function LessonsComingSoon({ lang }: { lang: 'en' | 'fr' }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center max-md:p-6">
      <p className="text-[17px] leading-[1.6] text-gray-700" style={{ fontFamily: "Georgia, 'Libre Baskerville', serif" }}>
        {lang === 'en'
          ? 'Your lessons are being prepared — coming soon.'
          : 'Vos leçons sont en cours de préparation — bientôt disponibles.'}
      </p>
    </div>
  );
}
