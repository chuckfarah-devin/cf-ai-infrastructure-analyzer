import { describe, expect, it } from 'vitest';
import {
  FPL_ILLUSTRATIVE_BATTERY_DURATION_HOURS,
  FPL_OWNED_GENERATION_MW,
  FPL_SCALE_FACTOR,
  fplPublishedCapacityMW,
  fplScaledCapacityMW,
  scaleFplCapacity
} from '../data/fplPublicBaseline';
import { fplGenerationDefaults, legacyDemoDefaults } from '../data/floridaDefaults';
import { simulateScenario } from './engine';

describe('Public FPL baseline', () => {
  it('reconciles published owned generation categories exactly', () => {
    const total =
      fplPublishedCapacityMW.primarilyNaturalGas +
      fplPublishedCapacityMW.nuclear +
      fplPublishedCapacityMW.utilitySolar +
      fplPublishedCapacityMW.otherGeneration;

    expect(total).toBe(35_963);
    expect(total).toBe(FPL_OWNED_GENERATION_MW);
  });

  it('keeps purchased power separate from owned generation', () => {
    expect(fplPublishedCapacityMW.purchasedPower).toBe(244);
    expect(FPL_OWNED_GENERATION_MW).not.toBe(
      FPL_OWNED_GENERATION_MW + fplPublishedCapacityMW.purchasedPower
    );
  });

  it('reconciles battery storage without counting it as generation', () => {
    expect(
      fplPublishedCapacityMW.standaloneBatteryStorage +
      fplPublishedCapacityMW.colocatedBatteryStorage
    ).toBe(fplPublishedCapacityMW.batteryStorage);
    expect(fplPublishedCapacityMW.batteryStorage).toBe(991);
    expect(fplGenerationDefaults.utilityBatteryEnergyMWh).toBeCloseTo(
      fplScaledCapacityMW.batteryStorage * FPL_ILLUSTRATIVE_BATTERY_DURATION_HOURS
    );
  });

  it('applies one common scale factor to every public portfolio resource', () => {
    expect(FPL_SCALE_FACTOR).toBeCloseTo(6000 / 35_963, 12);
    expect(fplGenerationDefaults.naturalGasCapacityMW).toBeCloseTo(
      scaleFplCapacity(fplPublishedCapacityMW.primarilyNaturalGas)
    );
    expect(fplGenerationDefaults.nuclearCapacityMW).toBeCloseTo(
      scaleFplCapacity(fplPublishedCapacityMW.nuclear)
    );
    expect(fplGenerationDefaults.utilitySolarMW).toBeCloseTo(
      scaleFplCapacity(fplPublishedCapacityMW.utilitySolar)
    );
    expect(fplGenerationDefaults.otherGenerationCapacityMW).toBeCloseTo(
      scaleFplCapacity(fplPublishedCapacityMW.otherGeneration)
    );
    expect(fplGenerationDefaults.purchasedPowerCapacityMW).toBeCloseTo(
      scaleFplCapacity(fplPublishedCapacityMW.purchasedPower)
    );
  });

  it('preserves the legacy demo resource values', () => {
    expect(legacyDemoDefaults.distributedSolarMW).toBe(3150);
    expect(legacyDemoDefaults.utilitySolarMW).toBe(2000);
    expect(legacyDemoDefaults.nuclearCapacityMW).toBe(0);
    expect(legacyDemoDefaults.naturalGasCapacityMW).toBe(0);
    expect(legacyDemoDefaults.otherGenerationCapacityMW).toBe(0);
    expect(legacyDemoDefaults.purchasedPowerCapacityMW).toBe(0);
    expect(legacyDemoDefaults.utilityBatteryPowerMW).toBe(0);
    expect(legacyDemoDefaults.presetId).toBe('legacy');
  });

  it('keeps installed, available, and dispatched generation within limits', () => {
    const result = simulateScenario(fplGenerationDefaults);

    for (const hour of result.hours) {
      expect(hour.nuclearAvailableMW).toBeLessThanOrEqual(fplGenerationDefaults.nuclearCapacityMW!);
      expect(hour.nuclearMW).toBeLessThanOrEqual(hour.nuclearAvailableMW);
      expect(hour.naturalGasAvailableMW).toBeLessThanOrEqual(fplGenerationDefaults.naturalGasCapacityMW!);
      expect(hour.naturalGasMW).toBeLessThanOrEqual(hour.naturalGasAvailableMW);
      expect(hour.otherGenerationAvailableMW).toBeLessThanOrEqual(fplGenerationDefaults.otherGenerationCapacityMW!);
      expect(hour.otherGenerationMW).toBeLessThanOrEqual(hour.otherGenerationAvailableMW);
      expect(hour.purchasedPowerAvailableMW).toBeLessThanOrEqual(fplGenerationDefaults.purchasedPowerCapacityMW!);
      expect(hour.purchasedPowerMW).toBeLessThanOrEqual(hour.purchasedPowerAvailableMW);
      expect(hour.windMW).toBe(0);
    }
  });

  it('balances every FPL baseline hour without counting storage as generation', () => {
    const result = simulateScenario({ ...fplGenerationDefaults, operatingMode: 'coordinated' });

    for (const hour of result.hours) {
      const supply =
        hour.totalGenerationMW +
        hour.purchasedPowerMW +
        hour.batteryDischargeMW +
        hour.netGridLoadMW;
      const uses =
        hour.totalDemandMW +
        hour.batteryChargeMW +
        hour.gridExportMW +
        hour.curtailedGenerationMW;

      expect(Math.abs(supply - uses)).toBeLessThan(0.01);
    }
  });

  it('does not mutate either preset when a simulation runs', () => {
    const legacyBefore = JSON.stringify(legacyDemoDefaults);
    const fplBefore = JSON.stringify(fplGenerationDefaults);

    simulateScenario({ ...fplGenerationDefaults, operatingMode: 'coordinated' });
    simulateScenario({ ...legacyDemoDefaults, operatingMode: 'traditional' });

    expect(JSON.stringify(legacyDemoDefaults)).toBe(legacyBefore);
    expect(JSON.stringify(fplGenerationDefaults)).toBe(fplBefore);
  });
});
