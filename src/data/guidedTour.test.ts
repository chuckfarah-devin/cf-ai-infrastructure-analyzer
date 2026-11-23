import { describe, it, expect } from 'vitest';
import { computeTourDiffs, TOUR_HOUR, TOUR_SITE_ID } from './guidedTour';
import type { HourResult } from '../simulation/types';

const hour = (over: Partial<HourResult>): HourResult => ({
  totalDemandMW: 0, totalGenerationMW: 0, netGridLoadMW: 0,
  batteryChargeMW: 0, batteryDischargeMW: 0, gridExportMW: 0,
  curtailedGenerationMW: 0, ...over,
} as HourResult);

describe('guidedTour', () => {
  it('computes signed MW differences at the tour hour', () => {
    const diffs = computeTourDiffs(
      hour({ netGridLoadMW: 870, batteryDischargeMW: 0 }),
      hour({ netGridLoadMW: 0, batteryDischargeMW: 2064 }),
    );
    expect(diffs).toHaveLength(2);
    expect(diffs[0].deltaMW).toBe(-870);
    expect(diffs[0].label).toBe('-870 MW');
    expect(diffs[1].deltaMW).toBe(2064);
    expect(diffs[1].label).toBe('+2064 MW');
  });

  it('reports non-improvements honestly (no hidden negatives)', () => {
    const diffs = computeTourDiffs(
      hour({ netGridLoadMW: 100, batteryDischargeMW: 50 }),
      hour({ netGridLoadMW: 200, batteryDischargeMW: 0 }),
    );
    expect(diffs[0].label).toBe('+100 MW');
    expect(diffs[1].label).toBe('-50 MW');
  });

  it('uses a deterministic tour hour and documented brownfield site', () => {
    expect(TOUR_HOUR).toBe(18);
    expect(TOUR_SITE_ID).toBe('st-johns');
  });
});
