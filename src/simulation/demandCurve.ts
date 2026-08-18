/**
 * Residential demand curve for the Florida AI Grid Demonstrator
 * ILLUSTRATIVE: Normalized Florida system demand curve
 */

export function getResidentialDemand(hour: number): number {
  // ILLUSTRATIVE: Normalized Florida system demand curve (0-1 scale)
  // NOTE: This is an illustrative scale, not a validated Florida residential demand figure
  // Designed to be replaceable with real FPL hourly load data
  const demandCurve: Record<number, number> = {
    0: 0.4, 1: 0.35, 2: 0.3, 3: 0.3, 4: 0.35, 5: 0.45,
    6: 0.6, 7: 0.75, 8: 0.8, 9: 0.75, 10: 0.7, 11: 0.65,
    12: 0.65, 13: 0.7, 14: 0.75, 15: 0.8, 16: 0.85, 17: 0.95,
    18: 1.0, 19: 0.95, 20: 0.85, 21: 0.75, 22: 0.65, 23: 0.5
  };

  const baseSystemDemandMW = 5000; // ILLUSTRATIVE: Florida system demand scale (adjusted for test)
  return baseSystemDemandMW * (demandCurve[hour] || 0.5);
}
