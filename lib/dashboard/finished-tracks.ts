/**
 * Tracks whose curriculum is fully written. A reader who completes every
 * published module of one of these has finished the track; on any other track
 * they have only caught up with what exists so far, and more is coming.
 *
 * Kept in code rather than in the database because it changes once per track,
 * by hand, when the last module ships. Add a slug here in the same change that
 * publishes a track's final module.
 */
const FINISHED_TRACKS: ReadonlySet<string> = new Set([
  'marriage', // Module 12, Counting the Cost, live 2026-11-06
]);

export function isTrackFinished(trackSlug: string | null): boolean {
  return trackSlug !== null && FINISHED_TRACKS.has(trackSlug);
}
