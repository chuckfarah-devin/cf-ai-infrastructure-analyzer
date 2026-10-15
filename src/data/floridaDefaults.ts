/**
 * Default scenario values for the Florida AI Grid Demonstrator
 * All values are ILLUSTRATIVE unless otherwise noted
 */

import type { ScenarioConfig } from '../simulation/types';

/**
 * Common system parameters shared by all presets.
 */
const commonSystemDefaults = {
  batteryChargingEfficiency: 0.95,
  batteryDischargingEfficiency: 0.95,
  operatingMode: 'traditional' as const,
  hurricaneMode: false,
  criticalLoadPercent: 0.3,
  initialSOCPercent: 0.5,
  minimumSOCPercent: 0.2,
  terminalSOCPercent: 0.5
};

/**
 * Legacy demo preset: distributed solar, rooftop PV, EV VPP, and home batteries only.
 * This preserves the original v1.0.0 scenario and keeps conventional generation at zero.
 */
export const legacyDemoDefaults: ScenarioConfig = {
  totalEVs: 450400,
  evParticipationRate: 0.20,
  averageEVBatteryKWh: 70,
  evAvailableCapacityPercent: 0.20,
  evChargePowerKW: 7.2,
  evDischargePowerKW: 7.2,

  distributedSolarMW: 3150,
  utilitySolarMW: 2000,

  homeBatteryCount: 250000,
  homeBatteryKWh: 13.5,
  homeChargePowerKW: 5,
  homeDischargePowerKW: 5,

  aiLoadMW: 1000,

  // Conventional generation disabled in the legacy demo preset
  nuclearCapacityMW: 0,
  naturalGasCapacityMW: 0,
  windCapacityMW: 0,
  nuclearAvailabilityPercent: 0.95,
  naturalGasAvailabilityPercent: 1.0,
  windCapacityFactor: 0.35,

  ...commonSystemDefaults
};

/**
 * Illustrative FPL-style generation preset.
 * Adds nuclear baseload and dispatchable natural gas to the legacy DER mix.
 * Wind is set to zero to reflect limited onshore wind resource in Florida.
 * All values are ILLUSTRATIVE and are not verified real-time FPL data.
 */
export const fplGenerationDefaults: ScenarioConfig = {
  totalEVs: 450400,
  evParticipationRate: 0.20,
  averageEVBatteryKWh: 70,
  evAvailableCapacityPercent: 0.20,
  evChargePowerKW: 7.2,
  evDischargePowerKW: 7.2,

  distributedSolarMW: 3150,
  utilitySolarMW: 2000,

  homeBatteryCount: 250000,
  homeBatteryKWh: 13.5,
  homeChargePowerKW: 5,
  homeDischargePowerKW: 5,

  aiLoadMW: 1000,

  // ILLUSTRATIVE conventional generation capacities
  nuclearCapacityMW: 3500,
  naturalGasCapacityMW: 12000,
  windCapacityMW: 0,
  nuclearAvailabilityPercent: 0.95,
  naturalGasAvailabilityPercent: 1.0,
  windCapacityFactor: 0.35,

  ...commonSystemDefaults
};

/**
 * Backward-compatible default export for existing imports.
 */
export const floridaDefaults: ScenarioConfig = legacyDemoDefaults;

/**
 * Named preset collection for the UI scenario picker.
 */
export const scenarioPresets: { id: string; label: string; config: ScenarioConfig }[] = [
  { id: 'legacy', label: 'Legacy Demo (DERs only)', config: legacyDemoDefaults },
  { id: 'fpl', label: 'Illustrative FPL Generation Mix', config: fplGenerationDefaults }
];
