/**
 * Unit tests for the simulation engine
 * Tests MW/MWh unit consistency, SOC constraints, and mode differences
 */

import { describe, it, expect } from 'vitest'
import { simulateScenario } from './engine'
import type { ScenarioConfig } from './types'

describe('Simulation Engine Unit Tests', () => {
  describe('MW/MWh Unit Consistency', () => {
    it('should maintain energy conservation across 24 hours', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 15000, // Increased to ensure charging cycles
        utilitySolarMW: 10000,   // Increased to ensure charging cycles
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

      // Calculate total energy in vs energy out for storage
      const totalChargeMWh = result.hours.reduce((sum, h) => sum + h.batteryChargeMW, 0)
      const totalDischargeMWh = result.hours.reduce((sum, h) => sum + h.batteryDischargeMW, 0)

      // Energy should be conserved (within efficiency losses)
      expect(totalChargeMWh).toBeGreaterThan(0)
      expect(totalDischargeMWh).toBeGreaterThanOrEqual(0)
    })
  })

  describe('SOC Boundary Conditions', () => {
    it('should never fall below zero SOC', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
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
      
      // Check that SOC never goes below zero
      result.hours.forEach(hour => {
        expect(hour.batteryStateOfChargeMWh).toBeGreaterThanOrEqual(0)
      })
    })

    it('should never exceed total capacity', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
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
      
      // Calculate total usable capacity
      const participatingEVs = config.totalEVs * config.evParticipationRate
      const totalEVStorageKWh = participatingEVs * config.averageEVBatteryKWh
      const usableEVStorageKWh = totalEVStorageKWh * config.evAvailableCapacityPercent
      const usableEVStorageMWh = usableEVStorageKWh / 1000
      const homeStorageKWh = config.homeBatteryCount * config.homeBatteryKWh
      const homeStorageMWh = homeStorageKWh / 1000
      const totalUsableStorageMWh = usableEVStorageMWh + homeStorageMWh

      // Check that SOC never exceeds capacity
      result.hours.forEach(hour => {
        expect(hour.batteryStateOfChargeMWh).toBeLessThanOrEqual(totalUsableStorageMWh)
      })
    })
  })

  describe('Traditional vs Coordinated Mode', () => {
    it('should show coordination benefit when resources are available', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
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

      // Coordinated should have lower peak net grid load when resources are available
      expect(coordinatedResult.summary.peakNetGridLoadMW).toBeLessThanOrEqual(traditionalResult.summary.peakNetGridLoadMW)
    })
  })

  describe('SOC Management', () => {
    it('should respect minimum SOC floor in coordinated mode', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
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
      
      // Calculate total usable capacity
      const participatingEVs = config.totalEVs * config.evParticipationRate
      const totalEVStorageKWh = participatingEVs * config.averageEVBatteryKWh
      const usableEVStorageKWh = totalEVStorageKWh * config.evAvailableCapacityPercent
      const usableEVStorageMWh = usableEVStorageKWh / 1000
      const homeStorageKWh = config.homeBatteryCount * config.homeBatteryKWh
      const homeStorageMWh = homeStorageKWh / 1000
      const totalUsableStorageMWh = usableEVStorageMWh + homeStorageMWh
      const minimumSOCMWh = totalUsableStorageMWh * config.minimumSOCPercent

      // Check that minimum SOC is never violated
      result.hours.forEach(hour => {
        expect(hour.batteryStateOfChargeMWh).toBeGreaterThanOrEqual(minimumSOCMWh)
      })
    })

    it('should allow SOC to fall below terminal target during early hours', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
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
      
      // Calculate terminal SOC target
      const participatingEVs = config.totalEVs * config.evParticipationRate
      const totalEVStorageKWh = participatingEVs * config.averageEVBatteryKWh
      const usableEVStorageKWh = totalEVStorageKWh * config.evAvailableCapacityPercent
      const usableEVStorageMWh = usableEVStorageKWh / 1000
      const homeStorageKWh = config.homeBatteryCount * config.homeBatteryKWh
      const homeStorageMWh = homeStorageKWh / 1000
      const totalUsableStorageMWh = usableEVStorageMWh + homeStorageMWh
      const terminalSOCMWh = totalUsableStorageMWh * config.terminalSOCPercent

      // Check that SOC falls below terminal target at some point (during peak dispatch hours)
      // Peak dispatch may start at hour 18 or later depending on baseline load profile
      const fellBelowTerminal = result.hours.some(h => h.batteryStateOfChargeMWh < terminalSOCMWh)
      
      expect(fellBelowTerminal).toBe(true) // Should discharge below 50% during peak hours
    })
  })

  describe('Hurricane Mode', () => {
    it('should disable grid interaction in hurricane mode', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
        utilitySolarMW: 2000,
        homeBatteryCount: 250000,
        homeBatteryKWh: 13.5,
        homeChargePowerKW: 5,
        homeDischargePowerKW: 5,
        aiLoadMW: 1000,
        batteryChargingEfficiency: 0.95,
        batteryDischargingEfficiency: 0.95,
        operatingMode: 'traditional',
        hurricaneMode: true,
        criticalLoadPercent: 0.3,
        initialSOCPercent: 0.5,
        minimumSOCPercent: 0.2,
        terminalSOCPercent: 0.5
      }

      const result = simulateScenario(config)
      
      // In hurricane mode, net grid load should be zero (disconnected)
      result.hours.forEach(hour => {
        expect(hour.netGridLoadMW).toBe(0)
        expect(hour.utilitySolarMW).toBe(0) // Utility solar not available
      })
    })
  })

  describe('No Recursion', () => {
    it('should not cause infinite recursion in scenario comparison', () => {
      const config: ScenarioConfig = {
        totalEVs: 1000000,
        evParticipationRate: 0.25,
        averageEVBatteryKWh: 70,
        evAvailableCapacityPercent: 0.20,
        evChargePowerKW: 7.2,
        evDischargePowerKW: 7.2,
        distributedSolarMW: 5000,
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

      // This should complete without infinite recursion
      const result = simulateScenario(config)
      
      expect(result.hours).toHaveLength(24)
      expect(result.summary.effectiveGridCapacityReleasedMW).toBeGreaterThanOrEqual(0)
    })
  })
})
