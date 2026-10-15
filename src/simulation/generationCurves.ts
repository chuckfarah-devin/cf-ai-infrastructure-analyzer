/**
 * ILLUSTRATIVE availability curves for conventional generation sources
 * These are simplified deterministic profiles, not validated FPL data.
 */

/**
 * Nuclear: approximately steady baseload across all hours.
 * Returns the same availability factor for every hour.
 */
export function getNuclearAvailability(_hour: number, availabilityPercent = 0.95): number {
  return availabilityPercent;
}

/**
 * Natural gas: dispatchable, but modeled here with a mild daily profile
 * representing typical combined-cycle economics (higher during peak demand).
 */
export function getNaturalGasAvailability(hour: number, availabilityPercent = 1.0): number {
  // ILLUSTRATIVE: slight ramp between shoulder and peak hours
  const gasProfile: Record<number, number> = {
    0: 0.85, 1: 0.85, 2: 0.85, 3: 0.85, 4: 0.85, 5: 0.90,
    6: 0.92, 7: 0.95, 8: 0.97, 9: 0.98, 10: 0.98, 11: 0.97,
    12: 0.96, 13: 0.96, 14: 0.97, 15: 0.98, 16: 0.99, 17: 1.00,
    18: 1.00, 19: 0.99, 20: 0.97, 21: 0.93, 22: 0.90, 23: 0.87
  };
  return availabilityPercent * (gasProfile[hour] ?? 0.95);
}

/**
 * Wind: availability-driven with a diurnal profile.
 * ILLUSTRATIVE: higher overnight/early morning, lower mid-day.
 */
export function getWindAvailability(hour: number, capacityFactor = 0.35): number {
  const windProfile: Record<number, number> = {
    0: 1.20, 1: 1.25, 2: 1.30, 3: 1.25, 4: 1.15, 5: 1.05,
    6: 0.95, 7: 0.85, 8: 0.75, 9: 0.70, 10: 0.65, 11: 0.60,
    12: 0.55, 13: 0.60, 14: 0.65, 15: 0.70, 16: 0.75, 17: 0.85,
    18: 0.95, 19: 1.05, 20: 1.10, 21: 1.15, 22: 1.20, 23: 1.20
  };
  // Normalize so the average across 24 hours equals the supplied capacity factor
  const raw = windProfile[hour] ?? 1.0;
  const averageRaw = 0.925; // approximate mean of the profile above
  return capacityFactor * (raw / averageRaw);
}
