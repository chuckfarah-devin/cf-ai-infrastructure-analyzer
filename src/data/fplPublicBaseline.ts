export const FPL_PUBLIC_BASELINE_DATE = 'December 31, 2025';
export const FPL_OWNED_GENERATION_MW = 35_963;
export const FPL_DEMONSTRATION_PEAK_MW = 6_000;
export const FPL_SCALE_FACTOR = FPL_DEMONSTRATION_PEAK_MW / FPL_OWNED_GENERATION_MW;

export const fplPublishedCapacityMW = {
  primarilyNaturalGas: 24_314,
  nuclear: 3_502,
  utilitySolar: 7_932,
  otherGeneration: 215,
  wind: 0,
  purchasedPower: 244,
  // Storage is power capacity, not generation: 409 MW included in the resource
  // presentation plus approximately 582 MW of co-located battery projects.
  batteryStorage: 991,
  standaloneBatteryStorage: 409,
  colocatedBatteryStorage: 582
} as const;

export const FPL_ILLUSTRATIVE_BATTERY_DURATION_HOURS = 4;

export function scaleFplCapacity(capacityMW: number): number {
  return capacityMW * FPL_SCALE_FACTOR;
}

export const fplScaledCapacityMW = {
  primarilyNaturalGas: scaleFplCapacity(fplPublishedCapacityMW.primarilyNaturalGas),
  nuclear: scaleFplCapacity(fplPublishedCapacityMW.nuclear),
  utilitySolar: scaleFplCapacity(fplPublishedCapacityMW.utilitySolar),
  otherGeneration: scaleFplCapacity(fplPublishedCapacityMW.otherGeneration),
  wind: scaleFplCapacity(fplPublishedCapacityMW.wind),
  purchasedPower: scaleFplCapacity(fplPublishedCapacityMW.purchasedPower),
  batteryStorage: scaleFplCapacity(fplPublishedCapacityMW.batteryStorage)
} as const;

export const fplPublicBaselineSources = [
  {
    title: 'NextEra Energy / FPL 2025 Form 10-K',
    reportingDate: FPL_PUBLIC_BASELINE_DATE,
    url: 'https://www.investor.nexteraenergy.com/~/media/Files/N/NEE-IR/NEE%202025%2010-K.pdf'
  },
  {
    title: 'FPL Generation Portfolio',
    reportingDate: FPL_PUBLIC_BASELINE_DATE,
    url: 'https://www.investor.nexteraenergy.com/~/media/Files/N/NEE-IR/investor-materials/supplemental-resources/generation-portfolios/2026/FPL_NextEra%20Energy%20Resources%20Generation%20Portfolios_03312026.pdf'
  },
  {
    title: 'FPL 2026–2035 Ten-Year Power Plant Site Plan',
    reportingDate: FPL_PUBLIC_BASELINE_DATE,
    url: 'https://www.fpl.com/content/dam/fplgp/us/en/about/pdf/ten-year-site-plan.pdf'
  }
] as const;
