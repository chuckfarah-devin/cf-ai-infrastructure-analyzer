/**
 * Financial calculation engine for the Florida AI Grid Demonstrator.
 *
 * Pure TypeScript — no React dependencies. Consumes HourResult[] from the
 * existing simulation engine plus FinancialAssumptions.
 *
 * Two separate perspectives:
 *   calculateCustomerFinancials  — AI data center electricity bill.
 *   calculateUtilityFinancials   — Generation/delivery operating costs.
 *
 * Customer and utility costs use different rate bases and must NEVER be summed.
 * Avoided peak-capacity value is reported separately from operating savings.
 *
 * Annualization: daily values × 365.
 * This is an order-of-magnitude estimate from a single representative day.
 */

import type { HourResult } from './types';
import type {
  FinancialAssumptions,
  CustomerFinancials,
  UtilityFinancials,
  FinancialComparison,
} from './financialTypes';

const DAYS_PER_YEAR = 365;
const MONTHS_PER_YEAR = 12;

// ---------------------------------------------------------------------------
// Helper: compute gas variable cost from price, heat rate, and O&M
// ---------------------------------------------------------------------------

export function computeGasVariableCost(
  gasPricePerMMBtu: number,
  gasHeatRateBtuPerKWh: number,
  gasVariableOMPerMWh: number
): number {
  // fuel cost: $/MMBtu × Btu/kWh / 1,000,000 Btu/MMBtu × 1,000 kWh/MWh = $/MWh
  const gasFuelCostPerMWh = gasPricePerMMBtu * gasHeatRateBtuPerKWh / 1_000;
  return gasFuelCostPerMWh + gasVariableOMPerMWh;
}

// ---------------------------------------------------------------------------
// Customer Financials — AI Data Center Bill
// ---------------------------------------------------------------------------

export function calculateCustomerFinancials(
  hours: HourResult[],
  assumptions: FinancialAssumptions
): CustomerFinancials {
  const { customer } = assumptions;

  // The data center's metered demand is its own load (aiLoadMW).
  // It does NOT change with system-wide coordinated dispatch.

  // Billing demand: the data center's own peak metered demand.
  // In the current model, aiLoadMW is constant across all hours.
  const billingDemandMW = Math.max(...hours.map(h => h.aiLoadMW), 0);

  // Annual energy: daily consumption × 365
  const dailyEnergyMWh = hours.reduce((sum, h) => sum + h.aiLoadMW, 0); // 24 hours × MW = MWh
  const annualEnergyMWh = dailyEnergyMWh * DAYS_PER_YEAR;

  // Energy cost
  const annualEnergyCost = annualEnergyMWh * customer.energyRatePerMWh;

  // Demand charges: billingDemandMW × 1000 kW/MW × $/kW/month × 12 months
  const annualDemandCharges = billingDemandMW * 1_000 * customer.demandChargePerKWMonth * MONTHS_PER_YEAR;

  // Fixed base charges
  const annualBaseCharges = customer.monthlyBaseCharge * MONTHS_PER_YEAR;

  const totalAnnualCost = annualEnergyCost + annualDemandCharges + annualBaseCharges;

  const effectiveRatePerMWh = annualEnergyMWh > 0
    ? totalAnnualCost / annualEnergyMWh
    : 0;

  return {
    annualEnergyMWh,
    annualEnergyCost,
    billingDemandMW,
    annualDemandCharges,
    annualBaseCharges,
    totalAnnualCost,
    effectiveRatePerMWh,
  };
}

// ---------------------------------------------------------------------------
// Utility Financials — System Operating Costs
// ---------------------------------------------------------------------------

export function calculateUtilityFinancials(
  hours: HourResult[],
  assumptions: FinancialAssumptions
): UtilityFinancials {
  const { utility } = assumptions;

  const gasVariableCostPerMWh = computeGasVariableCost(
    utility.gasPricePerMMBtu,
    utility.gasHeatRateBtuPerKWh,
    utility.gasVariableOMPerMWh
  );

  // Daily totals (MWh for 1-hour intervals → MW values = MWh)
  let dailyGasMWh = 0;
  let dailyNuclearMWh = 0;
  let dailySolarMWh = 0;
  let dailyWindMWh = 0;
  let dailyOtherGenMWh = 0;
  let dailyPurchasedPowerMWh = 0;
  let dailyBatteryThroughputMWh = 0;
  let dailyGridImportMWh = 0;
  let dailyGridExportMWh = 0;
  let peakSystemDemandMW = 0;

  for (const h of hours) {
    dailyGasMWh += h.naturalGasMW;
    dailyNuclearMWh += h.nuclearMW;
    dailySolarMWh += h.totalSolarMW;
    dailyWindMWh += h.windMW;
    dailyOtherGenMWh += h.otherGenerationMW;
    dailyPurchasedPowerMWh += h.purchasedPowerMW;
    dailyBatteryThroughputMWh += h.batteryChargeMW + h.batteryDischargeMW;
    dailyGridImportMWh += h.netGridLoadMW;
    dailyGridExportMWh += h.gridExportMW;

    // System peak includes base demand + charging load
    const systemDemand = h.totalDemandMW + h.batteryChargeMW;
    if (systemDemand > peakSystemDemandMW) {
      peakSystemDemandMW = systemDemand;
    }
  }

  // Annualize
  const gasCost = dailyGasMWh * gasVariableCostPerMWh * DAYS_PER_YEAR;
  const nuclearCost = dailyNuclearMWh * utility.nuclearVariableCostPerMWh * DAYS_PER_YEAR;
  const solarCost = dailySolarMWh * utility.solarVariableCostPerMWh * DAYS_PER_YEAR;
  const windCost = dailyWindMWh * utility.windVariableCostPerMWh * DAYS_PER_YEAR;
  const otherGenCost = dailyOtherGenMWh * utility.otherGenVariableCostPerMWh * DAYS_PER_YEAR;
  const purchasedPowerCost = dailyPurchasedPowerMWh * utility.purchasedPowerRatePerMWh * DAYS_PER_YEAR;
  const batteryCost = dailyBatteryThroughputMWh * utility.batteryVariableCostPerMWh * DAYS_PER_YEAR;
  const gridImportCost = dailyGridImportMWh * utility.gridImportRatePerMWh * DAYS_PER_YEAR;
  const gridExportRevenue = dailyGridExportMWh * utility.gridExportRatePerMWh * DAYS_PER_YEAR;

  const totalSystemCost = gasCost + nuclearCost + solarCost + windCost
    + otherGenCost + purchasedPowerCost + batteryCost + gridImportCost
    - gridExportRevenue;

  // Total generation = owned + purchased + imports (all supply sources)
  const totalGenerationMWh = (dailyGasMWh + dailyNuclearMWh + dailySolarMWh
    + dailyWindMWh + dailyOtherGenMWh + dailyPurchasedPowerMWh
    + dailyGridImportMWh) * DAYS_PER_YEAR;

  const weightedAvgCostPerMWh = totalGenerationMWh > 0
    ? totalSystemCost / totalGenerationMWh
    : 0;

  // Avoided capacity value — purely informational, kept separate
  const peakCapacityValue = peakSystemDemandMW * 1_000 * utility.peakingCapacityCostPerKWYear;

  return {
    gasCost,
    nuclearCost,
    solarCost,
    windCost,
    otherGenCost,
    purchasedPowerCost,
    batteryCost,
    gridImportCost,
    gridExportRevenue,
    totalSystemCost,
    totalGenerationMWh,
    weightedAvgCostPerMWh,
    peakSystemDemandMW,
    peakCapacityValue,
  };
}

// ---------------------------------------------------------------------------
// Financial Comparison — Traditional vs. Coordinated
// ---------------------------------------------------------------------------

export function compareFinancials(
  traditionalHours: HourResult[],
  coordinatedHours: HourResult[],
  assumptions: FinancialAssumptions
): FinancialComparison {
  const tradCustomer = calculateCustomerFinancials(traditionalHours, assumptions);
  const tradUtility = calculateUtilityFinancials(traditionalHours, assumptions);
  const coordCustomer = calculateCustomerFinancials(coordinatedHours, assumptions);
  const coordUtility = calculateUtilityFinancials(coordinatedHours, assumptions);

  // Signed deltas: negative = coordinated is cheaper
  const customerCostDelta = coordCustomer.totalAnnualCost - tradCustomer.totalAnnualCost;
  const utilityCostDelta = coordUtility.totalSystemCost - tradUtility.totalSystemCost;
  const peakDemandDeltaMW = coordUtility.peakSystemDemandMW - tradUtility.peakSystemDemandMW;

  // Avoided capacity value from peak reduction (only if peak is reduced)
  const avoidedCapacityValue = peakDemandDeltaMW < 0
    ? Math.abs(peakDemandDeltaMW) * 1_000 * assumptions.utility.peakingCapacityCostPerKWYear
    : 0;

  return {
    traditional: { customer: tradCustomer, utility: tradUtility },
    coordinated: { customer: coordCustomer, utility: coordUtility },
    deltas: {
      customerCostDelta,
      utilityCostDelta,
      peakDemandDeltaMW,
      avoidedCapacityValue,
    },
  };
}
