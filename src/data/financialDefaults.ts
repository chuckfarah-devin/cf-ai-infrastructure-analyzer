/**
 * Default financial assumptions for the Florida AI Grid Demonstrator.
 *
 * All values are ILLUSTRATIVE. They are grounded in publicly available data
 * but do not constitute rate forecasts or binding cost estimates.
 *
 * Sources are documented inline. Users can override every value.
 */

import type { FinancialAssumptions } from '../simulation/financialTypes';

// ---------------------------------------------------------------------------
// Customer tariff defaults — based on FPL GSLD-2 (≥2,000 kW), Feb 2025
// ---------------------------------------------------------------------------
//
// Source: FPL "Business rates and clauses — Approved February 2025"
// https://www.fpl.com/content/dam/fplgp/us/en/rates/pdf/bus-eff-feb-2025.pdf
//
// GSLD-2 components (Feb 2025):
//   Base charge:         $258.54/month
//   Demand charge:       $13.76/kW/month
//   Non-fuel energy:     1.713 ¢/kWh
//   Fuel charge:         2.694 ¢/kWh
//   Capacity:            $1.32/kW  (≈ 0.256 ¢/kWh at ~85% LF)
//   Conservation:        $0.51/kW  (≈ 0.10 ¢/kWh)
//   Environmental:       0.256 ¢/kWh
//   Storm protection:    -$0.23/kW (credit)
//   Storm restoration:   0.397 ¢/kWh
//   Transition credit:   -$8.76/kW
//
// Blended all-in energy rate ≈ non-fuel + fuel + environmental + storm restoration
//   = 1.713 + 2.694 + 0.256 + 0.397 ≈ 5.06 ¢/kWh
// Rounded to 50.60 $/MWh for the illustrative default.
//
// Note: capacity, conservation, and storm-protection charges are per-kW and
// would typically be folded into demand charges. For simplicity, the
// illustrative default rolls them into the energy rate.

const GSLD2_ALL_IN_ENERGY_RATE_PER_MWH = 50.60;
const GSLD2_DEMAND_CHARGE_PER_KW_MONTH = 13.76;
const GSLD2_MONTHLY_BASE_CHARGE = 258.54;

// ---------------------------------------------------------------------------
// Utility generation cost defaults
// ---------------------------------------------------------------------------
//
// Natural gas:
//   Henry Hub 2025 annual average: $3.52/MMBtu (EIA/FRED)
//   EIA 2024 combined-cycle heat rate: 7,548 Btu/kWh (EIA Table 8.2)
//   Fuel cost: $3.52 × 7.548 = $26.57/MWh
//   Variable O&M (non-fuel): ~$2.00/MWh (EIA Table 8.4, gas turbine + small scale)
//   Total gas variable cost computed at runtime from gasPricePerMMBtu × gasHeatRateBtuPerKWh / 1e6 + gasVariableOMPerMWh
//
// Nuclear:
//   EIA 2024 IOU average: operation $9.87/MWh + fuel ~$6.37/MWh = ~$16.24/MWh
//   NEI 2025 total generating cost: $36.46/MWh (includes capital amortization).
//   For variable/marginal cost we use operation + fuel ≈ $16.24/MWh.
//   Rounded to $16.00/MWh as illustrative default.
//
// Solar / Wind: $0/MWh variable cost (zero fuel, negligible variable O&M).
//
// Other generation: Illustrative $30/MWh (mixed small units).
//
// Purchased power: Illustrative $45/MWh (PPA blended rate).
//
// Battery throughput: $2.50/MWh (NREL/EIA utility-scale BESS O&M estimates).
//
// Grid imports: Illustrative $50/MWh wholesale purchase rate.
// Grid exports: Illustrative $35/MWh wholesale sale rate (typically below purchase).
//
// Peaking capacity: $150/kW-year avoided cost of new peaking capacity.
//   This is an illustrative benchmark; reported separately from operating costs.

const DEFAULT_GAS_PRICE_PER_MMBTU = 3.52;
const DEFAULT_GAS_HEAT_RATE_BTU_PER_KWH = 7_548;
const DEFAULT_GAS_VARIABLE_OM_PER_MWH = 2.00;
const DEFAULT_NUCLEAR_VARIABLE_COST_PER_MWH = 16.00;
const DEFAULT_SOLAR_VARIABLE_COST_PER_MWH = 0;
const DEFAULT_WIND_VARIABLE_COST_PER_MWH = 0;
const DEFAULT_OTHER_GEN_VARIABLE_COST_PER_MWH = 30.00;
const DEFAULT_PURCHASED_POWER_RATE_PER_MWH = 45.00;
const DEFAULT_BATTERY_VARIABLE_COST_PER_MWH = 2.50;
const DEFAULT_GRID_IMPORT_RATE_PER_MWH = 50.00;
const DEFAULT_GRID_EXPORT_RATE_PER_MWH = 35.00;
const DEFAULT_PEAKING_CAPACITY_COST_PER_KW_YEAR = 150;

// ---------------------------------------------------------------------------
// Assembled defaults
// ---------------------------------------------------------------------------

export const defaultFinancialAssumptions: FinancialAssumptions = {
  customer: {
    energyRatePerMWh: GSLD2_ALL_IN_ENERGY_RATE_PER_MWH,
    demandChargePerKWMonth: GSLD2_DEMAND_CHARGE_PER_KW_MONTH,
    monthlyBaseCharge: GSLD2_MONTHLY_BASE_CHARGE,
  },
  utility: {
    gasPricePerMMBtu: DEFAULT_GAS_PRICE_PER_MMBTU,
    gasHeatRateBtuPerKWh: DEFAULT_GAS_HEAT_RATE_BTU_PER_KWH,
    gasVariableOMPerMWh: DEFAULT_GAS_VARIABLE_OM_PER_MWH,
    nuclearVariableCostPerMWh: DEFAULT_NUCLEAR_VARIABLE_COST_PER_MWH,
    solarVariableCostPerMWh: DEFAULT_SOLAR_VARIABLE_COST_PER_MWH,
    windVariableCostPerMWh: DEFAULT_WIND_VARIABLE_COST_PER_MWH,
    otherGenVariableCostPerMWh: DEFAULT_OTHER_GEN_VARIABLE_COST_PER_MWH,
    purchasedPowerRatePerMWh: DEFAULT_PURCHASED_POWER_RATE_PER_MWH,
    batteryVariableCostPerMWh: DEFAULT_BATTERY_VARIABLE_COST_PER_MWH,
    gridImportRatePerMWh: DEFAULT_GRID_IMPORT_RATE_PER_MWH,
    gridExportRatePerMWh: DEFAULT_GRID_EXPORT_RATE_PER_MWH,
    peakingCapacityCostPerKWYear: DEFAULT_PEAKING_CAPACITY_COST_PER_KW_YEAR,
  },
};

// ---------------------------------------------------------------------------
// Source citations for the UI
// ---------------------------------------------------------------------------

export const financialSourceCitations = [
  {
    parameter: 'Customer energy rate & demand charge',
    source: 'FPL GSLD-2 tariff, PSC-approved February 2025',
    url: 'https://www.fpl.com/content/dam/fplgp/us/en/rates/pdf/bus-eff-feb-2025.pdf',
  },
  {
    parameter: 'Natural gas price',
    source: 'Henry Hub 2025 annual average — EIA / FRED',
    url: 'https://fred.stlouisfed.org/series/AHHNGSP',
  },
  {
    parameter: 'Combined-cycle heat rate',
    source: 'EIA Table 8.2, natural gas combined cycle, 2024',
    url: 'https://www.eia.gov/electricity/annual/html/epa_08_02.html',
  },
  {
    parameter: 'Nuclear variable cost',
    source: 'EIA Table 8.4, nuclear operation + fuel, 2024',
    url: 'https://www.eia.gov/electricity/annual/html/epa_08_04.html',
  },
  {
    parameter: 'Battery throughput cost',
    source: 'NREL Cost Projections for Utility-Scale Battery Storage, 2025 Update',
    url: 'https://www.nrel.gov/docs/fy25osti/93281.pdf',
  },
];
