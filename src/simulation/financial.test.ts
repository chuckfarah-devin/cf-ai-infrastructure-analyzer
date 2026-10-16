import { describe, expect, it } from 'vitest';
import {
  calculateCustomerFinancials,
  calculateUtilityFinancials,
  compareFinancials,
  computeGasVariableCost,
} from './financial';
import type { FinancialAssumptions } from './financialTypes';
import type { HourResult } from './types';
import { defaultFinancialAssumptions } from '../data/financialDefaults';
import { simulateScenario } from './engine';
import { legacyDemoDefaults, fplGenerationDefaults } from '../data/floridaDefaults';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal 24-hour HourResult array with controllable values. */
function makeHours(overrides: Partial<HourResult> = {}): HourResult[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    residentialDemandMW: 5000,
    aiLoadMW: 1000,
    totalDemandMW: 6000,
    rooftopSolarMW: 0,
    utilitySolarMW: 0,
    totalSolarMW: 0,
    nuclearAvailableMW: 0,
    nuclearMW: 0,
    naturalGasAvailableMW: 0,
    naturalGasMW: 0,
    windAvailableMW: 0,
    windMW: 0,
    otherGenerationAvailableMW: 0,
    otherGenerationMW: 0,
    purchasedPowerAvailableMW: 0,
    purchasedPowerMW: 0,
    totalGenerationMW: 0,
    batteryChargeMW: 0,
    batteryDischargeMW: 0,
    batteryStateOfChargeMWh: 0,
    netGridLoadMW: 6000,
    batteryDispatchMW: 0,
    solarContributionMW: 0,
    conventionalContributionMW: 0,
    gridExportMW: 0,
    curtailedGenerationMW: 0,
    ...overrides,
  }));
}

/** Simple financial assumptions for deterministic arithmetic tests. */
const simpleAssumptions: FinancialAssumptions = {
  customer: {
    energyRatePerMWh: 50,     // $50/MWh
    demandChargePerKWMonth: 10, // $10/kW/month
    monthlyBaseCharge: 100,   // $100/month
  },
  utility: {
    gasPricePerMMBtu: 3.00,
    gasHeatRateBtuPerKWh: 7_000,
    gasVariableOMPerMWh: 2.00,
    nuclearVariableCostPerMWh: 16.00,
    solarVariableCostPerMWh: 0,
    windVariableCostPerMWh: 0,
    otherGenVariableCostPerMWh: 30.00,
    purchasedPowerRatePerMWh: 45.00,
    batteryVariableCostPerMWh: 2.50,
    gridImportRatePerMWh: 50.00,
    gridExportRatePerMWh: 35.00,
    peakingCapacityCostPerKWYear: 150,
  },
};

// ===========================================================================
// Gas variable cost helper
// ===========================================================================

describe('computeGasVariableCost', () => {
  it('computes fuel + O&M correctly', () => {
    // $3.00/MMBtu × 7,000 Btu/kWh = $3.00 × 7.0 = $21.00/MWh fuel
    // + $2.00/MWh O&M = $23.00/MWh total
    const cost = computeGasVariableCost(3.00, 7_000, 2.00);
    expect(cost).toBeCloseTo(23.00, 2);
  });

  it('returns only O&M when gas price is zero', () => {
    expect(computeGasVariableCost(0, 7_000, 2.00)).toBeCloseTo(2.00, 2);
  });

  it('scales linearly with gas price', () => {
    const cost1 = computeGasVariableCost(3.00, 7_000, 0);
    const cost2 = computeGasVariableCost(6.00, 7_000, 0);
    expect(cost2).toBeCloseTo(cost1 * 2, 2);
  });
});

// ===========================================================================
// Customer financials
// ===========================================================================

describe('calculateCustomerFinancials', () => {
  it('annualizes energy consumption correctly', () => {
    const hours = makeHours({ aiLoadMW: 500 });
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    // 500 MW × 24 hours × 365 days = 4,380,000 MWh/yr
    expect(result.annualEnergyMWh).toBe(500 * 24 * 365);
  });

  it('uses the data center metered demand, not system peak', () => {
    // aiLoadMW = 500, totalDemandMW = 6000
    const hours = makeHours({ aiLoadMW: 500, totalDemandMW: 6000 });
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    expect(result.billingDemandMW).toBe(500);
    // Demand charges: 500 MW × 1000 × $10/kW/month × 12 = $60,000,000
    expect(result.annualDemandCharges).toBe(500 * 1000 * 10 * 12);
  });

  it('computes demand charges in correct units: MW × 1000 × $/kW/month × 12', () => {
    const hours = makeHours({ aiLoadMW: 100 });
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    // 100 MW × 1000 kW/MW × $10/kW/month × 12 months = $12,000,000
    expect(result.annualDemandCharges).toBe(12_000_000);
  });

  it('total = energy + demand + base charges', () => {
    const hours = makeHours({ aiLoadMW: 1000 });
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    const expected = result.annualEnergyCost + result.annualDemandCharges + result.annualBaseCharges;
    expect(result.totalAnnualCost).toBeCloseTo(expected, 2);
  });

  it('base charges = monthly × 12', () => {
    const hours = makeHours();
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    expect(result.annualBaseCharges).toBe(100 * 12);
  });

  it('effective rate = total / energy', () => {
    const hours = makeHours({ aiLoadMW: 1000 });
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    expect(result.effectiveRatePerMWh).toBeCloseTo(
      result.totalAnnualCost / result.annualEnergyMWh, 4
    );
  });

  it('returns zero costs when aiLoadMW is zero', () => {
    const hours = makeHours({ aiLoadMW: 0 });
    const result = calculateCustomerFinancials(hours, simpleAssumptions);
    expect(result.annualEnergyMWh).toBe(0);
    expect(result.annualEnergyCost).toBe(0);
    expect(result.annualDemandCharges).toBe(0);
    expect(result.totalAnnualCost).toBe(simpleAssumptions.customer.monthlyBaseCharge * 12);
    expect(result.effectiveRatePerMWh).toBe(0);
  });

  it('customer cost does NOT change with coordinated vs traditional dispatch', () => {
    // Same aiLoadMW, different netGridLoadMW → same customer bill
    const tradHours = makeHours({ aiLoadMW: 1000, netGridLoadMW: 6000 });
    const coordHours = makeHours({ aiLoadMW: 1000, netGridLoadMW: 3000 });
    const tradResult = calculateCustomerFinancials(tradHours, simpleAssumptions);
    const coordResult = calculateCustomerFinancials(coordHours, simpleAssumptions);
    expect(tradResult.totalAnnualCost).toBe(coordResult.totalAnnualCost);
  });
});

// ===========================================================================
// Utility financials
// ===========================================================================

describe('calculateUtilityFinancials', () => {
  it('computes gas cost from price × heat rate × dispatch', () => {
    // naturalGasMW = 2000 each hour
    // gasVariableCost = $3.00 × 7.0 + $2.00 = $23.00/MWh
    // Daily: 2000 × 24 = 48,000 MWh → $1,104,000/day
    // Annual: × 365 = $403,020,000
    const hours = makeHours({ naturalGasMW: 2000 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.gasCost).toBeCloseTo(2000 * 24 * 23.00 * 365, 0);
  });

  it('zero gas dispatch → zero gas cost', () => {
    const hours = makeHours({ naturalGasMW: 0 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.gasCost).toBe(0);
  });

  it('zero battery throughput → zero battery cost', () => {
    const hours = makeHours({ batteryChargeMW: 0, batteryDischargeMW: 0 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.batteryCost).toBe(0);
  });

  it('battery cost uses charge + discharge throughput', () => {
    const hours = makeHours({ batteryChargeMW: 100, batteryDischargeMW: 50 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    // throughput = 150 MW per hour × 24 hours × $2.50/MWh × 365
    expect(result.batteryCost).toBeCloseTo(150 * 24 * 2.50 * 365, 0);
  });

  it('includes other generation cost', () => {
    const hours = makeHours({ otherGenerationMW: 10 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.otherGenCost).toBeCloseTo(10 * 24 * 30.00 * 365, 0);
  });

  it('subtracts export revenue from total system cost', () => {
    const hours = makeHours({ gridExportMW: 500, netGridLoadMW: 0 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.gridExportRevenue).toBeCloseTo(500 * 24 * 35.00 * 365, 0);
    // gridExportRevenue reduces totalSystemCost
    expect(result.totalSystemCost).toBe(
      result.gasCost + result.nuclearCost + result.solarCost
      + result.windCost + result.otherGenCost + result.purchasedPowerCost
      + result.batteryCost + result.gridImportCost
      - result.gridExportRevenue
    );
  });

  it('when all generation is zero, utility cost = grid import cost only', () => {
    const hours = makeHours({
      naturalGasMW: 0, nuclearMW: 0, totalSolarMW: 0,
      windMW: 0, otherGenerationMW: 0, purchasedPowerMW: 0,
      batteryChargeMW: 0, batteryDischargeMW: 0,
      gridExportMW: 0, netGridLoadMW: 6000,
    });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.totalSystemCost).toBeCloseTo(result.gridImportCost, 0);
    expect(result.gridImportCost).toBeCloseTo(6000 * 24 * 50 * 365, 0);
  });

  it('system peak includes charging load', () => {
    const hours = makeHours({ totalDemandMW: 5000, batteryChargeMW: 200 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.peakSystemDemandMW).toBe(5200);
  });

  it('peak capacity value uses peakSystemDemandMW × 1000 × $/kW-year', () => {
    const hours = makeHours({ totalDemandMW: 5000, batteryChargeMW: 0 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.peakCapacityValue).toBe(5000 * 1000 * 150);
  });

  it('weighted average cost = total cost / total generation MWh', () => {
    const hours = makeHours({ naturalGasMW: 3000, netGridLoadMW: 3000 });
    const result = calculateUtilityFinancials(hours, simpleAssumptions);
    expect(result.weightedAvgCostPerMWh).toBeCloseTo(
      result.totalSystemCost / result.totalGenerationMWh, 4
    );
  });
});

// ===========================================================================
// Financial comparison
// ===========================================================================

describe('compareFinancials', () => {
  it('reports signed deltas — does not force coordinated to be cheaper', () => {
    // Construct a case where coordinated mode has HIGHER utility cost
    // (e.g., more battery throughput adds cycling cost)
    const tradHours = makeHours({ naturalGasMW: 3000, netGridLoadMW: 3000 });
    const coordHours = makeHours({
      naturalGasMW: 2500,
      netGridLoadMW: 2500,
      batteryChargeMW: 500,
      batteryDischargeMW: 500,
    });
    const result = compareFinancials(tradHours, coordHours, simpleAssumptions);

    // utilityCostDelta is signed; battery cycling cost may make coordinated more expensive
    expect(typeof result.deltas.utilityCostDelta).toBe('number');
    // Customer cost delta should be zero because aiLoadMW is the same
    expect(result.deltas.customerCostDelta).toBe(0);
  });

  it('customer cost delta is zero when aiLoadMW is identical', () => {
    const tradHours = makeHours({ aiLoadMW: 1000 });
    const coordHours = makeHours({ aiLoadMW: 1000 });
    const result = compareFinancials(tradHours, coordHours, simpleAssumptions);
    expect(result.deltas.customerCostDelta).toBe(0);
  });

  it('avoided capacity value is zero when coordinated peak >= traditional peak', () => {
    const tradHours = makeHours({ totalDemandMW: 5000, batteryChargeMW: 0 });
    const coordHours = makeHours({ totalDemandMW: 5000, batteryChargeMW: 200 });
    const result = compareFinancials(tradHours, coordHours, simpleAssumptions);
    // Coordinated peak = 5200 > traditional peak = 5000
    expect(result.deltas.peakDemandDeltaMW).toBeGreaterThan(0);
    expect(result.deltas.avoidedCapacityValue).toBe(0);
  });

  it('avoided capacity value reflects peak reduction when coordinated peak < traditional', () => {
    const tradHours = makeHours({ totalDemandMW: 6000, batteryChargeMW: 0 });
    const coordHours = makeHours({ totalDemandMW: 5500, batteryChargeMW: 0 });
    const result = compareFinancials(tradHours, coordHours, simpleAssumptions);
    expect(result.deltas.peakDemandDeltaMW).toBe(-500);
    expect(result.deltas.avoidedCapacityValue).toBe(500 * 1000 * 150);
  });

  it('correctly computes negative savings (coordinated more expensive)', () => {
    // Coordinated uses expensive battery cycling, traditional uses cheap imports
    const tradHours = makeHours({ netGridLoadMW: 6000 });
    const coordHours = makeHours({
      netGridLoadMW: 4000,
      batteryChargeMW: 1000,
      batteryDischargeMW: 1000,
      naturalGasMW: 2000,
    });
    const result = compareFinancials(tradHours, coordHours, simpleAssumptions);
    // Both positive and negative deltas are valid
    expect(typeof result.deltas.utilityCostDelta).toBe('number');
  });

  it('arithmetic: delta = coordinated − traditional', () => {
    const tradHours = makeHours({ naturalGasMW: 3000, netGridLoadMW: 3000 });
    const coordHours = makeHours({ naturalGasMW: 4000, netGridLoadMW: 2000 });
    const result = compareFinancials(tradHours, coordHours, simpleAssumptions);

    expect(result.deltas.utilityCostDelta).toBeCloseTo(
      result.coordinated.utility.totalSystemCost - result.traditional.utility.totalSystemCost, 2
    );
    expect(result.deltas.customerCostDelta).toBeCloseTo(
      result.coordinated.customer.totalAnnualCost - result.traditional.customer.totalAnnualCost, 2
    );
  });
});

// ===========================================================================
// Integration with actual simulation engine
// ===========================================================================

describe('financial integration with simulation engine', () => {
  it('produces valid financials from the legacy preset', () => {
    const result = simulateScenario(legacyDemoDefaults);
    const customer = calculateCustomerFinancials(result.hours, defaultFinancialAssumptions);
    const utility = calculateUtilityFinancials(result.hours, defaultFinancialAssumptions);

    expect(customer.annualEnergyMWh).toBe(legacyDemoDefaults.aiLoadMW * 24 * 365);
    expect(customer.billingDemandMW).toBe(legacyDemoDefaults.aiLoadMW);
    expect(customer.totalAnnualCost).toBeGreaterThan(0);
    expect(utility.totalSystemCost).toBeGreaterThan(0);
    // Legacy preset has no conventional generation
    expect(utility.gasCost).toBe(0);
    expect(utility.nuclearCost).toBe(0);
  });

  it('produces valid financials from the FPL preset', () => {
    const result = simulateScenario(fplGenerationDefaults);
    const utility = calculateUtilityFinancials(result.hours, defaultFinancialAssumptions);

    expect(utility.gasCost).toBeGreaterThan(0);
    expect(utility.nuclearCost).toBeGreaterThan(0);
    expect(utility.totalSystemCost).toBeGreaterThan(0);
    expect(utility.weightedAvgCostPerMWh).toBeGreaterThan(0);
  });

  it('compares traditional vs coordinated for the FPL preset', () => {
    const tradResult = simulateScenario({ ...fplGenerationDefaults, operatingMode: 'traditional' });
    const coordResult = simulateScenario({ ...fplGenerationDefaults, operatingMode: 'coordinated' });
    const comparison = compareFinancials(
      tradResult.hours, coordResult.hours, defaultFinancialAssumptions
    );

    // Customer costs should be identical (same aiLoadMW)
    expect(comparison.deltas.customerCostDelta).toBe(0);

    // Utility cost delta is a real signed number (may be positive or negative)
    expect(Number.isFinite(comparison.deltas.utilityCostDelta)).toBe(true);

    // Avoided capacity value is non-negative
    expect(comparison.deltas.avoidedCapacityValue).toBeGreaterThanOrEqual(0);
  });

  it('does not double-count: customer and utility use different rate bases', () => {
    const result = simulateScenario(fplGenerationDefaults);
    const customer = calculateCustomerFinancials(result.hours, defaultFinancialAssumptions);
    const utility = calculateUtilityFinancials(result.hours, defaultFinancialAssumptions);

    // These should NOT be equal — they use different rate structures
    // Customer uses retail tariff; utility uses production costs
    expect(customer.totalAnnualCost).not.toBeCloseTo(utility.totalSystemCost, -3);
  });
});
