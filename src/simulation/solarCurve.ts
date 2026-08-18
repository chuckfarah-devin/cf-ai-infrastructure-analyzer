/**
 * Solar generation curve for the Florida AI Grid Demonstrator
 * ILLUSTRATIVE: Normalized solar generation curve
 */

export function getSolarFactor(hour: number): number {
  // ILLUSTRATIVE: Normalized solar generation curve
  const solarCurve: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0.05, 7: 0.15, 8: 0.30, 9: 0.50,
    10: 0.70, 11: 0.85, 12: 0.95, 13: 1.0,
    14: 0.90, 15: 0.75, 16: 0.55, 17: 0.30,
    18: 0.10, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0
  };
  return solarCurve[hour] || 0;
}
