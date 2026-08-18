/**
 * Diagnostic tests for investigating reported issues
 */

import { describe, it, expect } from 'vitest'
import { simulateScenario } from './engine'
import type { ScenarioConfig } from './types'

describe('Diagnostic Tests for Reported Issues', () => {
  describe('SOC Energy Conservation', () => {
    it('should maintain hour-by-hour SOC energy conservation', () => {
      const config: ScenarioConfig = {
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
        batteryChargingEfficiency: 0.95,
        batteryDischargingEfficiency: 0.95,
        operatingMode: 'coordinated',
        hurricaneMode: false,
        criticalLoadPercent: 0.3,
        initialSOCPercent: 0.5,
        minimumSOCPercent: 0.2,
        terminalSOCPercent: 0.5
      }

      const result = simulateScenario(config)

      // Calculate total capacity directly from config
      const participatingEVs = config.totalEVs * config.evParticipationRate
      const totalEVStorageKWh = participatingEVs * config.averageEVBatteryKWh
      const usableEVStorageKWh = totalEVStorageKWh * config.evAvailableCapacityPercent
      const usableEVStorageMWh = usableEVStorageKWh / 1000
      const homeStorageKWh = config.homeBatteryCount * config.homeBatteryKWh
      const homeStorageMWh = homeStorageKWh / 1000
      const totalUsableStorageMWh = usableEVStorageMWh + homeStorageMWh

      const initialSOCMWh = totalUsableStorageMWh * config.initialSOCPercent

      // Verify hour-by-hour energy conservation
      let calculatedSOC = initialSOCMWh

      for (const hour of result.hours) {
        // Apply physics: charge adds, discharge removes
        const chargeEnergyMWh = hour.batteryChargeMW * config.batteryChargingEfficiency
        const dischargeEnergyMWh = hour.batteryDischargeMW / config.batteryDischargingEfficiency
        calculatedSOC = calculatedSOC + chargeEnergyMWh - dischargeEnergyMWh

        // Allow small rounding errors (0.01 MWh)
        expect(Math.abs(hour.batteryStateOfChargeMWh - calculatedSOC)).toBeLessThan(0.01)
      }

      console.log('Initial SOC MWh:', initialSOCMWh)
      console.log('Terminal SOC MWh:', result.hours[23].batteryStateOfChargeMWh)
      console.log('Minimum SOC MWh:', result.hours.reduce((min, h) => Math.min(min, h.batteryStateOfChargeMWh), Infinity))
      console.log('Total Charge MWh:', result.hours.reduce((sum, h) => sum + h.batteryChargeMW, 0))
      console.log('Total Discharge MWh:', result.hours.reduce((sum, h) => sum + h.batteryDischargeMW, 0))
    })

    it('should enforce deterministic SOC discharge constraint', () => {
      const config: ScenarioConfig = {
        totalEVs: 0,
        evParticipationRate: 0,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 0,
        utilitySolarMW: 0,
        homeBatteryCount: 1000,
        homeBatteryKWh: 1000,
        homeChargePowerKW: 5000,
        homeDischargePowerKW: 5000,
        aiLoadMW: 1000,
        batteryChargingEfficiency: 0.95,
        batteryDischargingEfficiency: 0.95,
        operatingMode: 'coordinated',
        hurricaneMode: false,
        criticalLoadPercent: 0.3,
        initialSOCPercent: 0.5,
        minimumSOCPercent: 0.2,
        terminalSOCPercent: 0.5
      }

      const result = simulateScenario(config)

      // Verify the deterministic discharge constraint test
      // Capacity = 1000 MWh, initial SOC = 500 MWh, minimum SOC = 200 MWh
      // Available for discharge = 500 - 200 = 300 MWh
      // With 95% discharge efficiency, max discharge = 300 * 0.95 = 285 MW
      // Demand = residential + AI = 2000 + 1000 = 3000 MW for all hours
      // Coordinated peak-shaving discharges during hours 16-19
      // Hour 16: max discharge by power = 3000 MW, but max by energy = 285 MW
      // Battery should discharge 285 MW and end at 200 MWh

      expect(result.hours[16].batteryDischargeMW).toBeCloseTo(285, 1)
      expect(result.hours[16].batteryStateOfChargeMWh).toBeCloseTo(200, 1)
    })
  })

  describe('Traditional vs Coordinated', () => {
    it('should calculate effective grid capacity released correctly', () => {
      const config: ScenarioConfig = {
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
        batteryChargingEfficiency: 0.95,
        batteryDischargingEfficiency: 0.95,
        operatingMode: 'coordinated',
        hurricaneMode: false,
        criticalLoadPercent: 0.3,
        initialSOCPercent: 0.5,
        minimumSOCPercent: 0.2,
        terminalSOCPercent: 0.5
      }

      const coordinatedResult = simulateScenario(config)
      const traditionalConfig = { ...config, operatingMode: 'traditional' as const }
      const traditionalResult = simulateScenario(traditionalConfig)

      const expectedRelease = traditionalResult.summary.peakNetGridLoadMW - coordinatedResult.summary.peakNetGridLoadMW

      console.log('Traditional peak:', traditionalResult.summary.peakNetGridLoadMW)
      console.log('Coordinated peak:', coordinatedResult.summary.peakNetGridLoadMW)
      console.log('Grid capacity released:', coordinatedResult.summary.effectiveGridCapacityReleasedMW)
      console.log('Expected release:', expectedRelease)

      expect(coordinatedResult.summary.effectiveGridCapacityReleasedMW).toBe(expectedRelease)
      expect(coordinatedResult.summary.equivalentAICampuses500MW).toBe(expectedRelease / 500)
      expect(coordinatedResult.summary.equivalentAICampuses1GW).toBe(expectedRelease / 1000)
    })
  })
})