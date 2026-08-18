// Storage Power Capability (separate from energy capacity)
export interface StoragePowerCapability {
  maxChargePowerMW: number;      // Maximum aggregate charge power (MW)
  maxDischargePowerMW: number;   // Maximum aggregate discharge power (MW)
}

// Storage Energy Capacity
export interface StorageEnergyCapacity {
  totalUsableCapacityMWh: number; // Total usable storage capacity (MWh)
  currentChargeMWh: number;       // Current state of charge (MWh)
}

// Scenario Configuration
export interface ScenarioConfig {
  // EV Parameters
  totalEVs: number;                    // ILLUSTRATIVE: 100,000 - 3,000,000
  evParticipationRate: number;         // ILLUSTRATIVE: 0 - 1 (0-100%)
  averageEVBatteryKWh: number;         // ILLUSTRATIVE: 40 - 120 kWh
  evAvailableCapacityPercent: number;  // ILLUSTRATIVE: 0 - 0.5 (0-50%)
  evChargePowerKW: number;             // ILLUSTRATIVE: Per-EV charge power (kW)
  evDischargePowerKW: number;          // ILLUSTRATIVE: Per-EV discharge power (kW)

  // Solar Parameters
  distributedSolarMW: number;          // ILLUSTRATIVE: 0 - 15,000 MW
  utilitySolarMW: number;              // ILLUSTRATIVE: 0 - 20,000 MW

  // Home Battery Parameters
  homeBatteryCount: number;            // ILLUSTRATIVE: 0 - 2,000,000
  homeBatteryKWh: number;              // ILLUSTRATIVE: 5 - 50 kWh
  homeChargePowerKW: number;           // ILLUSTRATIVE: Per-battery charge power (kW)
  homeDischargePowerKW: number;        // ILLUSTRATIVE: Per-battery discharge power (kW)

  // AI Infrastructure
  aiLoadMW: number;                    // ILLUSTRATIVE: 0 - 5,000 MW

  // System Parameters
  batteryChargingEfficiency: number;   // ILLUSTRATIVE: 0 - 1 (default 0.95)
  batteryDischargingEfficiency: number; // ILLUSTRATIVE: 0 - 1 (default 0.95)
  operatingMode: 'traditional' | 'coordinated';
  hurricaneMode: boolean;
  criticalLoadPercent: number;        // ILLUSTRATIVE: Critical load % for hurricane mode (default 0.3)
  initialSOCPercent: number;          // ILLUSTRATIVE: Starting SOC % (default 0.5)
  minimumSOCPercent: number;          // ILLUSTRATIVE: Minimum operating reserve % (default 0.2)
  terminalSOCPercent: number;         // ILLUSTRATIVE: Desired ending SOC % (default 0.5)
}

// Hourly Simulation Result
export interface HourResult {
  hour: number;                        // 0-23

  // Demand
  residentialDemandMW: number;
  aiLoadMW: number;
  totalDemandMW: number;

  // Generation
  rooftopSolarMW: number;
  utilitySolarMW: number;
  totalSolarMW: number;

  // Storage
  batteryChargeMW: number;             // Positive when charging (MW)
  batteryDischargeMW: number;          // Positive when discharging (MW)
  batteryStateOfChargeMWh: number;     // Current storage level (MWh)

  // Grid Interaction
  netGridLoadMW: number;               // Residual utility supply requirement after DER contribution (MW)
  batteryDispatchMW: number;          // Total battery discharge to grid (MW)
  solarContributionMW: number;         // Total solar reducing grid load (MW)
  gridExportMW: number;                // Excess sent back to grid (MW)

  // Hurricane Mode Specific
  residentialUnmetLoadMW?: number;     // Residential load not served (MW)
  estimatedBackupHours?: number;       // Hours of backup available
}

// Core Simulation Result (without comparative calculations)
export interface CoreSimulationResult {
  config: ScenarioConfig;
  hours: HourResult[];                 // Array of 24 HourResult objects
  totalUsableStorageMWh: number;       // Total usable storage capacity (MWh)
}

// Complete Simulation Result with summary
export interface SimulationResult {
  config: ScenarioConfig;
  hours: HourResult[];                 // Array of 24 HourResult objects
  summary: {
    peakNetGridLoadMW: number;
    totalDistributedSolarMWh: number;
    totalBatteryDispatchMWh: number;
    minimumSOCMWh: number;
    terminalSOCMWh: number;
    minimumSOCPercent: number;
    terminalSOCPercent: number;
    effectiveGridCapacityReleasedMW: number; // Reduction in peak net grid load
    equivalentAICampuses500MW: number;        // ILLUSTRATIVE comparison
    equivalentAICampuses1GW: number;          // ILLUSTRATIVE comparison
  };
}
