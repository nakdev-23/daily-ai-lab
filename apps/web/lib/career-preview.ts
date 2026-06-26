// Free preview policy for Pro career paths. A signed-in Free user may learn the
// first N steps of any Pro path (steps 1..N are plain lessons — the first
// checkpoint/project sits at step 6), then hits a contextual paywall. Steps still
// count against the daily free quota, so this never bypasses the lesson cap.
//
// Plain module (no "server-only") so both server pages and client components
// (paths grid, daily-limit) can import it.
export const FREE_CAREER_PREVIEW_STEPS = 3

export type UpgradeReason = "path_locked" | "daily_limit"

/** Build a contextual /upgrade URL. Callers may pass a path slug + step so the
 *  upgrade page can show a path-specific pitch instead of the generic one. */
export function pathUpgradeHref(slug: string, step: number, reason: UpgradeReason = "path_locked") {
  return `/upgrade?path=${encodeURIComponent(slug)}&step=${step}&reason=${reason}`
}
