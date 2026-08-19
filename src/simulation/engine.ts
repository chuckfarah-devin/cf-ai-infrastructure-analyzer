/**
 * Core simulation engine for the Florida AI Grid Demonstrator
 * Pure TypeScript - no React dependencies
 * Three-tier architecture to prevent recursion
 */

import type { ScenarioConfig, HourResult, CoreSimulationResult, SimulationResult } from './types';
import { getSolarFactor } from './solarCurve';
import { getResidentialDemand } from './demandCurve';
import { calculateStorageChange } from './storage';

/**
 * Tier 1: Core simulation without comparative calculations
 */
function simulateCore(config: ScenarioConfig): CoreSimulationResult {
  // 1. Calculate derived storage values
  const participatingEVs = config.totalEVs * config.evParticipationRate;
  const totalEVStorageKWh = participatingEVs * config.averageEVBatteryKWh;
  const usableEVStorageKWh = totalEVStorageKWh * config.evAvailableCapacityPercent;
  const usableEVStorageMWh = usableEVStorageKWh / 1000; // Convert kWh to MWh

  const homeStorageKWh = config.homeBatteryCount * config.homeBatteryKWh;
  const homeStorageMWh = homeStorageKWh / 1000; // Convert kWh to MWh

  const totalUsableStorageMWh = usableEVStorageMWh + homeStorageMWh;

  // 2. Calculate power capability limits
  const evMaxChargePowerMW = (participatingEVs * config.evChargePowerKW) / 1000;
  const evMaxDischargePowerMW = (participatingEVs * config.evDischargePowerKW) / 1000;
  const homeMaxChargePowerMW = (config.homeBatteryCount * config.homeChargePowerKW) / 1000;
  const homeMaxDischargePowerMW = (config.homeBatteryCount * config.homeDischargePowerKW) / 1000;

  const aggregateMaxChargePowerMW = evMaxChargePowerMW + homeMaxChargePowerMW;
  const aggregateMaxDischargePowerMW = evMaxDischargePowerMW + homeMaxDischargePowerMW;

  // 3. Calculate baseline net grid load without any storage dispatch
  const baselineNetGridLoadMW = Array.from({ length: 24 }, (_, hour) => {
    const residentialDemand = getResidentialDemand(hour);
    const solarFactor = getSolarFactor(hour);
    const rooftopSolarMW = config.distributedSolarMW * solarFactor;
    const utilitySolarMW = config.utilitySolarMW * solarFactor;
    const totalSolar = rooftopSolarMW + utilitySolarMW;
    const totalDemand = residentialDemand + config.aiLoadMW;
    return Math.max(0, totalDemand - totalSolar);
  });

  // 4. Identify peak hours (top 20% of hours with highest baseline net grid load)
  const sortedLoads = [...baselineNetGridLoadMW].sort((a, b) => b - a);
  const peakThreshold = sortedLoads[Math.floor(sortedLoads.length * 0.2) - 1] ?? sortedLoads[0];
  const peakHours = new Set(
    baselineNetGridLoadMW
      .map((load, hour) => ({ load, hour }))
      .filter(({ load }) => load >= peakThreshold && load > 0)
      .map(({ hour }) => hour)
  );

  // 5. Calculate hourly results with peak-aware dispatch
  const baselinePeakMW = Math.max(...baselineNetGridLoadMW);

  // Pre-compute future charging headroom for each hour.
  // futureChargingCapacityMWh[h] = total energy (MWh) chargeable in hours h+1..23
  // without pushing netGridLoad above baselinePeakMW, accounting for charging efficiency.
  const futureChargingCapacityMWh = new Array(24).fill(0);
  for (let h = 22; h >= 0; h--) {
    const headroomMW = Math.max(0, baselinePeakMW - baselineNetGridLoadMW[h + 1]);
    const chargeableMWh = Math.min(aggregateMaxChargePowerMW, headroomMW) * config.batteryChargingEfficiency;
    futureChargingCapacityMWh[h] = futureChargingCapacityMWh[h + 1] + chargeableMWh;
  }

  // --- Pass 1 (coordinated only): dispatch without recovery to find the true dispatch peak ---
  // This lets us set a recovery ceiling that cannot recreate the original traditional peak.
  const scheduledRecoveryMW = new Array(24).fill(0); // default: no recovery

  if (config.operatingMode === 'coordinated') {
    let pass1SOC = totalUsableStorageMWh * config.initialSOCPercent;
    const pass1NetLoads: number[] = [];
    let lastDischargeHour = -1;

    for (let hour = 0; hour < 24; hour++) {
      const r = calculateHour(
        config, hour, pass1SOC, totalUsableStorageMWh,
        aggregateMaxChargePowerMW, aggregateMaxDischargePowerMW,
        peakHours, futureChargingCapacityMWh[hour], 0
      );
      pass1NetLoads.push(r.netGridLoadMW);
      if (r.batteryDischargeMW > 0) lastDischargeHour = hour;
      pass1SOC = r.batteryStateOfChargeMWh;
    }

    const dispatchCeiling = Math.max(...pass1NetLoads); // lowest achievable peak without recovery
    const terminalSOCMWh = totalUsableStorageMWh * config.terminalSOCPercent;
    const recoveryNeededMWh = Math.max(
      0,
      (terminalSOCMWh - pass1SOC) / config.batteryChargingEfficiency
    );

    // Pre-allocate recovery to lowest-baseline hours after last discharge, ceiling = dispatchCeiling
    if (recoveryNeededMWh > 0) {
      const candidates = Array.from({ length: 24 }, (_, h) => h)
        .filter(h => h > lastDischargeHour)
        .sort((a, b) => baselineNetGridLoadMW[a] - baselineNetGridLoadMW[b]);

      let remaining = recoveryNeededMWh;
      for (const h of candidates) {
        if (remaining <= 0) break;
        const headroom = Math.max(0, dispatchCeiling - baselineNetGridLoadMW[h]);
        const maxCharge = Math.min(aggregateMaxChargePowerMW, headroom);
        const allocated = Math.min(maxCharge, remaining);
        scheduledRecoveryMW[h] = allocated;
        remaining -= allocated;
      }
      // If remaining > 0 after all candidates, terminal SOC cannot be reached without
      // exceeding dispatchCeiling. The shortfall will be visible in the reported ending SOC.
    }
  }

  // --- Pass 2: full simulation with pre-planned recovery schedule ---
  const hours: HourResult[] = [];
  let currentStorageMWh = totalUsableStorageMWh * config.initialSOCPercent; // Start at initial SOC

  for (let hour = 0; hour < 24; hour++) {
    const result = calculateHour(
      config,
      hour,
      currentStorageMWh,
      totalUsableStorageMWh,
      aggregateMaxChargePowerMW,
      aggregateMaxDischargePowerMW,
      peakHours,
      futureChargingCapacityMWh[hour],
      scheduledRecoveryMW[hour]
    );
    hours.push(result);
    currentStorageMWh = result.batteryStateOfChargeMWh;
  }

  return { config, hours, totalUsableStorageMWh };
}

/**
 * Hourly calculation logic
 */
function calculateHour(
  config: ScenarioConfig,
  hour: number,
  startingStorageMWh: number,
  totalUsableStorageMWh: number,
  maxChargePowerMW: number,
  maxDischargePowerMW: number,
  peakHours: Set<number>,
  futureChargingCapacityMWh: number = 0,
  scheduledRecoveryChargeMW: number = 0
): HourResult {
  // Get inputs for this hour
  const residentialDemand = getResidentialDemand(hour);
  const solarFactor = getSolarFactor(hour);
  const rooftopSolarMW = config.distributedSolarMW * solarFactor;
  const utilitySolarMW = config.utilitySolarMW * solarFactor;

  let batteryChargeMW = 0;
  let batteryDischargeMW = 0;
  let gridExportMW = 0;
  let netGridLoadMW = 0;
  let residentialUnmetLoadMW = 0;

  if (config.hurricaneMode) {
    // HURRICANE/ISLAND MODE
    // Grid disconnected, only distributed resources serve critical residential load
    const criticalLoadMW = residentialDemand * config.criticalLoadPercent;
    const totalAvailableGeneration = rooftopSolarMW;

    if (totalAvailableGeneration >= criticalLoadMW) {
      // Solar can serve all critical load
      const surplus = totalAvailableGeneration - criticalLoadMW;
      // Constrain by both power and energy capacity
      const maxChargeByPower = Math.min(surplus, maxChargePowerMW);
      const maxChargeByEnergy = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      batteryChargeMW = Math.min(maxChargeByPower, maxChargeByEnergy);
      residentialUnmetLoadMW = 0;
    } else {
      // Solar insufficient, discharge batteries
      const deficit = criticalLoadMW - totalAvailableGeneration;
      // Constrain by both power and energy capacity
      const maxDischargeByPower = Math.min(deficit, maxDischargePowerMW);
      const maxDischargeByEnergy = startingStorageMWh * config.batteryDischargingEfficiency; // Account for efficiency loss
      batteryDischargeMW = Math.min(maxDischargeByPower, maxDischargeByEnergy);
      residentialUnmetLoadMW = Math.max(0, criticalLoadMW - totalAvailableGeneration - batteryDischargeMW);
    }

    // Calculate new SOC with efficiency
    const storageChangeMWh = calculateStorageChange(
      batteryChargeMW,
      batteryDischargeMW,
      config.batteryChargingEfficiency,
      config.batteryDischargingEfficiency
    );

    // Apply physical constraints (0 to capacity) without SOC floor clamping
    const newStorageMWh = Math.max(0, Math.min(
      startingStorageMWh + storageChangeMWh,
      totalUsableStorageMWh
    ));

    // Estimate backup duration based on current storage and critical load
    const avgCriticalDemand = residentialDemand * config.criticalLoadPercent; // Use hourly critical load
    const estimatedBackupHours = newStorageMWh / avgCriticalDemand;

    return {
      hour,
      residentialDemandMW: residentialDemand,
      aiLoadMW: 0, // AI load not served in hurricane mode
      totalDemandMW: residentialDemand,
      rooftopSolarMW,
      utilitySolarMW: 0, // Utility solar not available in island mode
      totalSolarMW: rooftopSolarMW,
      batteryChargeMW,
      batteryDischargeMW,
      batteryStateOfChargeMWh: newStorageMWh,
      netGridLoadMW: 0, // Disconnected from grid
      batteryDispatchMW: batteryDischargeMW,
      solarContributionMW: rooftopSolarMW,
      gridExportMW: 0, // No export in island mode
      residentialUnmetLoadMW,
      estimatedBackupHours
    };
  }

  if (config.operatingMode === 'traditional') {
    // TRADITIONAL GRID MODE
    // Represents current-state operating model without VPP coordination

    // Rooftop solar offsets behind-the-meter residential demand first
    const netResidentialLoad = Math.max(0, residentialDemand - rooftopSolarMW);
    gridExportMW = Math.max(0, rooftopSolarMW - residentialDemand);

    // Utility-scale solar contributes to grid supply (fair comparison)
    const utilityGeneration = utilitySolarMW;

    // Utility supplies remaining demand (including AI load)
    netGridLoadMW = Math.max(0, netResidentialLoad + config.aiLoadMW - utilityGeneration);

    // Traditional mode: no coordinated battery dispatch
    // Batteries may charge from excess rooftop solar if present (simplified)
    if (gridExportMW > 0 && startingStorageMWh < totalUsableStorageMWh) {
      // Constrain by both power and energy capacity
      const maxChargeByPower = Math.min(gridExportMW, maxChargePowerMW);
      const maxChargeByEnergy = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      batteryChargeMW = Math.min(maxChargeByPower, maxChargeByEnergy);
      gridExportMW -= batteryChargeMW;
    }

  } else {
    // COORDINATED GRID MODE
    // VPP-style orchestration with intelligent DER coordination
    // Includes minimum SOC floor and terminal SOC target for daily sustainability

    const totalSolar = rooftopSolarMW + utilitySolarMW;
    const totalDemand = residentialDemand + config.aiLoadMW;

    // Calculate SOC constraints
    const minimumSOCMWh = totalUsableStorageMWh * config.minimumSOCPercent;
    const terminalSOCMWh = totalUsableStorageMWh * config.terminalSOCPercent;

    // Peak-shaving strategy for Coordinated mode per spec v1.3:
    // Battery is preferentially dispatched during peak hours (highest baseline net grid load).
    // Ordinary deficit hours: preserve battery, let grid meet demand.
    // Solar surplus hours: charge batteries.
    // Recovery hours: charge from grid only when not discharging, capped to baseline peak headroom.
    const isPeakHour = peakHours.has(hour);

    // Adjusted dispatch floor: only draw below terminalSOC when future charging headroom can recover it.
    // This prevents unnecessary discharge-then-recovery cycles.
    const energyRecoverablePostDispatch = futureChargingCapacityMWh;
    const adjustedDispatchFloorMWh = Math.max(
      minimumSOCMWh,
      terminalSOCMWh - energyRecoverablePostDispatch
    );
    const availableForDischarge = Math.max(0, startingStorageMWh - adjustedDispatchFloorMWh);

    if (totalSolar > totalDemand) {
      // Surplus period: charge batteries with available solar
      const surplus = totalSolar - totalDemand;
      const maxChargeByPower = Math.min(surplus, maxChargePowerMW);
      const maxChargeByEnergy = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      batteryChargeMW = Math.min(maxChargeByPower, maxChargeByEnergy);
      netGridLoadMW = 0;
      gridExportMW = Math.max(0, surplus - batteryChargeMW);
    } else {
      // Deficit period: discharge only during peak hours, down to adjusted floor
      const deficit = totalDemand - totalSolar;
      if (isPeakHour) {
        const maxDischargeByPower = Math.min(deficit, maxDischargePowerMW);
        const maxDischargeByEnergy = availableForDischarge * config.batteryDischargingEfficiency;
        batteryDischargeMW = Math.min(maxDischargeByPower, maxDischargeByEnergy);
      }
      netGridLoadMW = Math.max(0, totalDemand - totalSolar - batteryDischargeMW);
      gridExportMW = 0;
    }

    // Pre-scheduled recovery charging (mutually exclusive with discharge).
    // Ceiling is already enforced by the pre-allocation in simulateCore (Pass 1).
    if (scheduledRecoveryChargeMW > 0 && batteryDischargeMW === 0) {
      const maxChargeByCapacity = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      const actualRecovery = Math.min(scheduledRecoveryChargeMW, maxChargeByCapacity);
      batteryChargeMW += actualRecovery;
      netGridLoadMW += actualRecovery;
    }

  } // end COORDINATED GRID MODE

  // Calculate new state of charge with proper efficiency treatment
  const storageChangeMWh = calculateStorageChange(
    batteryChargeMW,
    batteryDischargeMW,
    config.batteryChargingEfficiency,
    config.batteryDischargingEfficiency
  );

  // Apply physical constraints (0 to capacity) without SOC floor clamping
  // SOC floor is enforced through discharge decisions, not physics clamping
  const newStorageMWh = Math.max(0, Math.min(
    startingStorageMWh + storageChangeMWh,
    totalUsableStorageMWh
  ));

  // Calculate DER contributions for metrics
  const batteryDispatchMW = batteryDischargeMW;
  const solarContributionMW = rooftopSolarMW + utilitySolarMW;

  return {
    hour,
    residentialDemandMW: residentialDemand,
    aiLoadMW: config.aiLoadMW,
    totalDemandMW: residentialDemand + config.aiLoadMW,
    rooftopSolarMW,
    utilitySolarMW,
    totalSolarMW: rooftopSolarMW + utilitySolarMW,
    batteryChargeMW,
    batteryDischargeMW,
    batteryStateOfChargeMWh: newStorageMWh,
    netGridLoadMW,
    batteryDispatchMW,
    solarContributionMW,
    gridExportMW
  };
}

/**
 * Tier 2: Single scenario summary (no recursion)
 */
function summarizeSingleScenario(
  hours: HourResult[],
  totalUsableStorageMWh: number
): SimulationResult['summary'] {
  const peakNetGridLoadMW = Math.max(...hours.map(h => h.netGridLoadMW));
  const totalDistributedSolarMWh = hours.reduce((sum, h) => sum + h.rooftopSolarMW, 0);
  const totalBatteryDispatchMWh = hours.reduce((sum, h) => sum + h.batteryDispatchMW, 0);
  const minimumSOCMWh = hours.reduce((min, h) => Math.min(min, h.batteryStateOfChargeMWh), Infinity);
  const terminalSOCMWh = hours[23].batteryStateOfChargeMWh;
  const minimumSOCPercent = minimumSOCMWh / totalUsableStorageMWh;
  const terminalSOCPercent = terminalSOCMWh / totalUsableStorageMWh;

  return {
    peakNetGridLoadMW,
    totalDistributedSolarMWh,
    totalBatteryDispatchMWh,
    minimumSOCMWh,
    terminalSOCMWh,
    minimumSOCPercent,
    terminalSOCPercent,
    effectiveGridCapacityReleasedMW: 0, // Calculated in comparison
    equivalentAICampuses500MW: 0,        // Calculated in comparison
    equivalentAICampuses1GW: 0           // Calculated in comparison
  };
}

/**
 * Tier 3: Scenario comparison (avoids recursion)
 */
function compareScenarios(
  traditionalHours: HourResult[],
  coordinatedHours: HourResult[]
): Pick<SimulationResult['summary'], 'effectiveGridCapacityReleasedMW' | 'equivalentAICampuses500MW' | 'equivalentAICampuses1GW'> {
  const traditionalPeakNetGridLoad = Math.max(...traditionalHours.map(h => h.netGridLoadMW));
  const coordinatedPeakNetGridLoad = Math.max(...coordinatedHours.map(h => h.netGridLoadMW));

  const effectiveGridCapacityReleasedMW = Math.max(0, traditionalPeakNetGridLoad - coordinatedPeakNetGridLoad);
  const equivalentAICampuses500MW = effectiveGridCapacityReleasedMW / 500;
  const equivalentAICampuses1GW = effectiveGridCapacityReleasedMW / 1000;

  return {
    effectiveGridCapacityReleasedMW,
    equivalentAICampuses500MW,
    equivalentAICampuses1GW
  };
}

/**
 * Main entry point (combines all tiers)
 */
export function simulateScenario(config: ScenarioConfig): SimulationResult {
  const coreResult = simulateCore(config);
  const singleSummary = summarizeSingleScenario(coreResult.hours, coreResult.totalUsableStorageMWh);

  // If coordinated mode, compare with traditional
  let comparisonMetrics = {
    effectiveGridCapacityReleasedMW: 0,
    equivalentAICampuses500MW: 0,
    equivalentAICampuses1GW: 0
  };

  if (config.operatingMode === 'coordinated') {
    const traditionalConfig = { ...config, operatingMode: 'traditional' as const };
    const traditionalCore = simulateCore(traditionalConfig);
    comparisonMetrics = compareScenarios(traditionalCore.hours, coreResult.hours);
  }

  return {
    config: coreResult.config,
    hours: coreResult.hours,
    summary: {
      ...singleSummary,
      ...comparisonMetrics
    }
  };
}
