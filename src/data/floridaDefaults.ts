/**
 * Default scenario values for the Florida AI Grid Demonstrator
 * All values are ILLUSTRATIVE unless otherwise noted
 */

import type { ScenarioConfig } from '../simulation/types';

export const floridaDefaults: ScenarioConfig = {
  // EV Parameters (ILLUSTRATIVE)
  totalEVs: 450400,
  evParticipationRate: 0.20,
  averageEVBatteryKWh: 70,
  evAvailableCapacityPercent: 0.20,
  evChargePowerKW: 7.2,        // ILLUSTRATIVE: Level 2 charging
  evDischargePowerKW: 7.2,     // ILLUSTRATIVE: V2G capability

  // Solar Parameters (ILLUSTRATIVE)
  distributedSolarMW: 3150,
  utilitySolarMW: 2000, // ILLUSTRATIVE: Utility-scale solar capacity

  // Home Battery Parameters (ILLUSTRATIVE)
  homeBatteryCount: 250000, // ILLUSTRATIVE: Home battery deployment
  homeBatteryKWh: 13.5,
  homeChargePowerKW: 5,        // ILLUSTRATIVE: Powerwall charge rate
  homeDischargePowerKW: 5,     // ILLUSTRATIVE: Powerwall discharge rate

  // AI Infrastructure (ILLUSTRATIVE)
  aiLoadMW: 1000,

  // System Parameters (ILLUSTRATIVE)
  batteryChargingEfficiency: 0.95,
  batteryDischargingEfficiency: 0.95,
  operatingMode: 'traditional',
  hurricaneMode: false,
  criticalLoadPercent: 0.3,    // ILLUSTRATIVE: 30% of residential load is critical
  initialSOCPercent: 0.5,       // ILLUSTRATIVE: Start at 50% SOC per spec v1.3
  minimumSOCPercent: 0.2,       // ILLUSTRATIVE: 20% minimum operating reserve per spec v1.3
  terminalSOCPercent: 0.5       // ILLUSTRATIVE: End day at 50% SOC per spec v1.3
};
