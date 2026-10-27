/**
 * Default scenario values for the Florida AI Grid Demonstrator
 * All values are ILLUSTRATIVE unless otherwise noted
 */

import type { ScenarioConfig } from '../simulation/types';
import {
  FPL_ILLUSTRATIVE_BATTERY_DURATION_HOURS,
  FPL_SCALE_FACTOR,
  fplScaledCapacityMW
} from './fplPublicBaseline';

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

  // Utility portfolio resources disabled in the legacy demo preset
  nuclearCapacityMW: 0,
  naturalGasCapacityMW: 0,
  windCapacityMW: 0,
  otherGenerationCapacityMW: 0,
  purchasedPowerCapacityMW: 0,
  nuclearAvailabilityPercent: 0.95,
  naturalGasAvailabilityPercent: 1.0,
  windCapacityFactor: 0.35,
  otherGenerationAvailabilityPercent: 0.85,
  purchasedPowerAvailabilityPercent: 1.0,
  utilityBatteryPowerMW: 0,
  utilityBatteryEnergyMWh: 0,
  presetId: 'legacy',

  ...commonSystemDefaults
};

/**
 * Public FPL Portfolio — Scaled Illustrative Dispatch.
 * Published December 31, 2025 FPL capacities are scaled by one common factor
 * to the demonstrator's 6,000 MW peak. Dispatch is illustrative, not FPL practice.
 */
export const fplGenerationDefaults: ScenarioConfig = {
  totalEVs: 450400,
  evParticipationRate: 0.20,
  averageEVBatteryKWh: 70,
  evAvailableCapacityPercent: 0.20,
  evChargePowerKW: 7.2,
  evDischargePowerKW: 7.2,

  distributedSolarMW: 3150,
  utilitySolarMW: fplScaledCapacityMW.utilitySolar,

  homeBatteryCount: 250000,
  homeBatteryKWh: 13.5,
  homeChargePowerKW: 5,
  homeDischargePowerKW: 5,

  aiLoadMW: 1000,

  nuclearCapacityMW: fplScaledCapacityMW.nuclear,
  naturalGasCapacityMW: fplScaledCapacityMW.primarilyNaturalGas,
  windCapacityMW: fplScaledCapacityMW.wind,
  otherGenerationCapacityMW: fplScaledCapacityMW.otherGeneration,
  purchasedPowerCapacityMW: fplScaledCapacityMW.purchasedPower,
  nuclearAvailabilityPercent: 0.95,
  naturalGasAvailabilityPercent: 1.0,
  windCapacityFactor: 0.35,
  otherGenerationAvailabilityPercent: 0.85,
  purchasedPowerAvailabilityPercent: 1.0,
  utilityBatteryPowerMW: fplScaledCapacityMW.batteryStorage,
  utilityBatteryEnergyMWh: fplScaledCapacityMW.batteryStorage * FPL_ILLUSTRATIVE_BATTERY_DURATION_HOURS,
  presetId: 'fpl-public',
  portfolioScaleFactor: FPL_SCALE_FACTOR,

  ...commonSystemDefaults
};

/**
 * App default: fresh visits load the public FPL portfolio preset.
 * The legacy illustrative preset remains selectable in the scenario picker.
 */
export const floridaDefaults: ScenarioConfig = fplGenerationDefaults;

/**
 * Named preset collection for the UI scenario picker.
 */
export const scenarioPresets: { id: string; label: string; config: ScenarioConfig }[] = [
  { id: 'legacy', label: 'Legacy Demo (DERs only)', config: legacyDemoDefaults },
  { id: 'fpl-public', label: 'Public FPL Portfolio — Scaled', config: fplGenerationDefaults }
];
