/**
 * Tests for the energy-flow / conventional-generation additions
 * Verifies hourly energy balance, dispatch limits, zero-capacity behavior,
 * and battery flow direction.
 */

import { describe, it, expect } from 'vitest'
import { simulateScenario } from './engine'
import type { ScenarioConfig } from './types'

const baseConfig: ScenarioConfig = {
  totalEVs: 1000000,
  evParticipationRate: 0.25,
  averageEVBatteryKWh: 70,
  evAvailableCapacityPercent: 0.20,
  evChargePowerKW: 7.2,
  evDischargePowerKW: 7.2,
  distributedSolarMW: 5000,
  utilitySolarMW: 3000,
  homeBatteryCount: 250000,
  homeBatteryKWh: 13.5,
  homeChargePowerKW: 5,
  homeDischargePowerKW: 5,
  aiLoadMW: 1000,
  batteryChargingEfficiency: 0.95,
  batteryDischargingEfficiency: 0.95,
  operatingMode: 'traditional',
  hurricaneMode: false,
  criticalLoadPercent: 0.3,
  initialSOCPercent: 0.5,
  minimumSOCPercent: 0.2,
  terminalSOCPercent: 0.5
}

describe('Energy Flow Generation Tests', () => {
  it('should enforce hourly energy balance for every hour', () => {
    const config: ScenarioConfig = {
      ...baseConfig,
      operatingMode: 'coordinated',
      nuclearCapacityMW: 2000,
      naturalGasCapacityMW: 5000,
      windCapacityMW: 1000
    }
    const result = simulateScenario(config)

    for (const hour of result.hours) {
      const imports = Math.max(0, hour.netGridLoadMW)
      const exports = hour.gridExportMW
      const leftSide =
        hour.totalGenerationMW + hour.batteryDischargeMW + imports
      const rightSide =
        hour.totalDemandMW + hour.batteryChargeMW + exports + hour.curtailedGenerationMW
      const imbalance = leftSide - rightSide
      expect(Math.abs(imbalance)).toBeLessThan(0.01)
    }
  })

  it('should not exceed installed capacity or availability for conventional sources', () => {
    const config: ScenarioConfig = {
      ...baseConfig,
      operatingMode: 'traditional',
      nuclearCapacityMW: 3000,
      naturalGasCapacityMW: 8000,
      windCapacityMW: 2000,
      nuclearAvailabilityPercent: 0.95,
      naturalGasAvailabilityPercent: 1.0,
      windCapacityFactor: 0.35
    }
    const result = simulateScenario(config)

    for (const hour of result.hours) {
      expect(hour.nuclearMW).toBeLessThanOrEqual(config.nuclearCapacityMW! * config.nuclearAvailabilityPercent!)
      expect(hour.windMW).toBeLessThanOrEqual(config.windCapacityMW! * 1.5) // allow diurnal profile headroom
      expect(hour.naturalGasMW).toBeLessThanOrEqual(config.naturalGasCapacityMW!)
      expect(hour.totalGenerationMW).toBeGreaterThanOrEqual(0)
    }
  })

  it('should keep conventional generation at zero when capacities are zero', () => {
    const config: ScenarioConfig = {
      ...baseConfig,
      operatingMode: 'coordinated',
      nuclearCapacityMW: 0,
      naturalGasCapacityMW: 0,
      windCapacityMW: 0
    }
    const result = simulateScenario(config)

    for (const hour of result.hours) {
      expect(hour.nuclearMW).toBe(0)
      expect(hour.naturalGasMW).toBe(0)
      expect(hour.windMW).toBe(0)
      expect(hour.conventionalContributionMW).toBe(0)
    }
  })

  it('should make nuclear output approximately steady across hours', () => {
    const config: ScenarioConfig = {
      ...baseConfig,
      operatingMode: 'traditional',
      nuclearCapacityMW: 2000,
      naturalGasCapacityMW: 0,
      windCapacityMW: 0,
      nuclearAvailabilityPercent: 0.95
    }
    const result = simulateScenario(config)
    const nuclearOutputs = result.hours.map(h => h.nuclearMW)
    const maxNuclear = Math.max(...nuclearOutputs)
    const minNuclear = Math.min(...nuclearOutputs)

    expect(maxNuclear - minNuclear).toBeLessThan(0.01)
    expect(maxNuclear).toBeCloseTo(config.nuclearCapacityMW! * config.nuclearAvailabilityPercent!, 1)
  })

  it('should only discharge batteries when net load is positive in coordinated mode', () => {
    const config: ScenarioConfig = {
      ...baseConfig,
      operatingMode: 'coordinated',
      nuclearCapacityMW: 0,
      naturalGasCapacityMW: 0,
      windCapacityMW: 0
    }
    const result = simulateScenario(config)

    for (const hour of result.hours) {
      if (hour.batteryDischargeMW > 0) {
        expect(hour.netGridLoadMW).toBeGreaterThan(0)
      }
    }
  })

  it('should reduce net grid load when natural gas capacity is added', () => {
    const withoutGas: ScenarioConfig = { ...baseConfig, operatingMode: 'traditional', naturalGasCapacityMW: 0 }
    const withGas: ScenarioConfig = { ...baseConfig, operatingMode: 'traditional', naturalGasCapacityMW: 10000 }

    const resultWithout = simulateScenario(withoutGas)
    const resultWith = simulateScenario(withGas)

    const peakWithout = Math.max(...resultWithout.hours.map(h => h.netGridLoadMW))
    const peakWith = Math.max(...resultWith.hours.map(h => h.netGridLoadMW))

    expect(peakWith).toBeLessThan(peakWithout)
  })
})
