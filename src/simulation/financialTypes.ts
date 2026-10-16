/**
 * Financial analysis types for the Florida AI Grid Demonstrator.
 *
 * Two separate perspectives:
 *   1. CustomerFinancials — AI data center electricity bill under a retail tariff.
 *   2. UtilityFinancials  — Generation/delivery operating costs from the utility side.
 *
 * These use different rate bases and must NEVER be summed.
 * Avoided peak-capacity value is reported separately from operating-cost savings.
 */

// ---------------------------------------------------------------------------
// Financial Assumptions (all user-editable, with illustrative defaults)
// ---------------------------------------------------------------------------

export interface CustomerRateAssumptions {
  /** All-in energy rate including fuel and clauses ($/MWh) */
  energyRatePerMWh: number;
  /** Monthly demand charge applied to the customer's own metered peak ($/kW/month) */
  demandChargePerKWMonth: number;
  /** Fixed monthly base/service charge ($) */
  monthlyBaseCharge: number;
}

export interface UtilityCostAssumptions {
  /** Natural gas spot price ($/MMBtu) — user-editable sensitivity control */
  gasPricePerMMBtu: number;
  /** Combined-cycle heat rate (Btu/kWh) — documented, user-editable */
  gasHeatRateBtuPerKWh: number;
  /** Gas variable O&M excluding fuel ($/MWh) */
  gasVariableOMPerMWh: number;
  /** Nuclear variable cost including fuel and O&M ($/MWh) */
  nuclearVariableCostPerMWh: number;
  /** Solar variable O&M ($/MWh) — typically ~0 */
  solarVariableCostPerMWh: number;
  /** Wind variable O&M ($/MWh) — typically ~0 */
  windVariableCostPerMWh: number;
  /** Other generation variable cost ($/MWh) */
  otherGenVariableCostPerMWh: number;
  /** Purchased power rate ($/MWh) */
  purchasedPowerRatePerMWh: number;
  /** Battery throughput cost — variable O&M per MWh of charge+discharge ($/MWh) */
  batteryVariableCostPerMWh: number;
  /** Grid import cost — wholesale purchase rate for residual imports ($/MWh) */
  gridImportRatePerMWh: number;
  /** Grid export revenue — wholesale sale rate for surplus exports ($/MWh) */
  gridExportRatePerMWh: number;
  /** Avoided peaking-capacity cost ($/kW-year) — reported separately, never combined with operating savings */
  peakingCapacityCostPerKWYear: number;
}

export interface FinancialAssumptions {
  customer: CustomerRateAssumptions;
  utility: UtilityCostAssumptions;
}

// ---------------------------------------------------------------------------
// Calculated Results
// ---------------------------------------------------------------------------

export interface CustomerFinancials {
  /** AI data center annual energy consumption (MWh/yr) */
  annualEnergyMWh: number;
  /** Annual energy cost at the all-in rate ($/yr) */
  annualEnergyCost: number;
  /** AI data center billing demand for demand charges (MW) */
  billingDemandMW: number;
  /** Annual demand charges: billingDemandMW × 1000 × demandChargePerKWMonth × 12 ($/yr) */
  annualDemandCharges: number;
  /** Annual fixed base charges: monthlyBaseCharge × 12 ($/yr) */
  annualBaseCharges: number;
  /** Total annual electricity cost ($/yr) */
  totalAnnualCost: number;
  /** Effective blended rate: totalAnnualCost / annualEnergyMWh ($/MWh) */
  effectiveRatePerMWh: number;
}

export interface UtilityFinancials {
  /** Natural gas generation fuel + O&M cost ($/yr) */
  gasCost: number;
  /** Nuclear generation O&M + fuel cost ($/yr) */
  nuclearCost: number;
  /** Solar generation variable cost ($/yr) */
  solarCost: number;
  /** Wind generation variable cost ($/yr) */
  windCost: number;
  /** Other generation variable cost ($/yr) */
  otherGenCost: number;
  /** Purchased power cost ($/yr) */
  purchasedPowerCost: number;
  /** Battery cycling cost ($/yr) */
  batteryCost: number;
  /** Grid import cost ($/yr) */
  gridImportCost: number;
  /** Grid export revenue — subtracted from total ($/yr, positive = revenue) */
  gridExportRevenue: number;
  /** Total annual system operating cost net of export revenue ($/yr) */
  totalSystemCost: number;
  /** Total annual owned+purchased generation (MWh/yr) */
  totalGenerationMWh: number;
  /** Weighted average generation cost: totalSystemCost / totalGenerationMWh ($/MWh) */
  weightedAvgCostPerMWh: number;
  /** System peak demand for the modeled day (MW) */
  peakSystemDemandMW: number;
  /** Annualized avoided-capacity value: peakSystemDemandMW × peakingCapacityCostPerKWYear × 1000 ($/yr) */
  peakCapacityValue: number;
}

export interface FinancialComparison {
  traditional: {
    customer: CustomerFinancials;
    utility: UtilityFinancials;
  };
  coordinated: {
    customer: CustomerFinancials;
    utility: UtilityFinancials;
  };
  deltas: {
    /** Signed: coordinated customer cost − traditional customer cost ($/yr). Negative = savings. */
    customerCostDelta: number;
    /** Signed: coordinated utility cost − traditional utility cost ($/yr). Negative = savings. */
    utilityCostDelta: number;
    /** Signed: coordinated peak − traditional peak (MW). Negative = reduction. */
    peakDemandDeltaMW: number;
    /** Avoided capacity value from peak reduction: max(0, −peakDemandDeltaMW) × peakingCapacityCostPerKWYear × 1000 ($/yr).
     *  Reported separately — NOT added to operating-cost savings. */
    avoidedCapacityValue: number;
  };
}
