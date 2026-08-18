/**
 * Storage calculation functions for the Florida AI Grid Demonstrator
 */

/**
 * Helper function for storage change calculation
 * Energy (MWh) = Power (MW) × 1 hour
 * Apply efficiency in appropriate direction
 */
export function calculateStorageChange(
  chargeMW: number,
  dischargeMW: number,
  chargingEfficiency: number,
  dischargingEfficiency: number
): number {
  // When charging: input MW * efficiency = stored MWh (loss during charging)
  const chargeEnergyMWh = chargeMW * chargingEfficiency;
  // When discharging: output MW / efficiency = stored MWh consumed (loss during discharge)
  const dischargeEnergyMWh = dischargeMW / dischargingEfficiency;
  return chargeEnergyMWh - dischargeEnergyMWh;
}
