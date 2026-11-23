/**
 * Guided tour ("Take a 60-second tour") — deterministic scenario and
 * live-computed comparison metrics.
 *
 * The tour runs on the fpl-public preset at TOUR_HOUR (18:00), the daily
 * demand peak under the Florida scenario. Metrics displayed during the
 * "Smarter coordination" step are computed from actual model output —
 * never hard-coded claims — so they stay honest if the scenario changes.
 */

import type { HourResult } from '../simulation/types';

/** Evening demand peak in the fpl-public scenario (verified: hour 18). */
export const TOUR_HOUR = 18;

/** Start of the "Watch the day" playback step — mid-morning so the full solar curve is visible before the evening peak. */
export const TOUR_PLAY_START_HOUR = 10;

/** Documented brownfield example for the "Look at the place" step. */
export const TOUR_SITE_ID = 'st-johns';

export interface TourDiff {
  /** Short headline, e.g. "−870 MW" */
  label: string;
  /** Scope/unit clarification, e.g. "grid demand at 18:00" */
  scope: string;
  /** Signed MW difference (coordinated − traditional). */
  deltaMW: number;
}

/**
 * Up to two meaningful metric differences between strategies at the same
 * hour, computed from real results. Positive deltas are framed carefully —
 * a negative "improvement" is reported as such rather than hidden.
 */
export function computeTourDiffs(
  traditional: HourResult,
  coordinated: HourResult,
): TourDiff[] {
  const diffs: TourDiff[] = [];

  const gridDelta = coordinated.netGridLoadMW - traditional.netGridLoadMW;
  diffs.push({
    label: `${gridDelta > 0 ? '+' : ''}${Math.round(gridDelta)} MW`,
    scope: `additional grid supply required at ${TOUR_HOUR}:00 (coordinated vs. traditional) — residual utility need after local sources, not total electricity use`,
    deltaMW: gridDelta,
  });

  const storageDelta = coordinated.batteryDischargeMW - traditional.batteryDischargeMW;
  diffs.push({
    label: `${storageDelta > 0 ? '+' : ''}${Math.round(storageDelta)} MW`,
    scope: 'storage discharging at the same hour — shifts energy across hours and depends on earlier charging and modeled availability',
    deltaMW: storageDelta,
  });

  return diffs;
}
