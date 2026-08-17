# Technical Specification

*Technical specification for the CF AI Infrastructure Analyzer (Florida AI Grid Demonstrator).*

**IMPORTANT EDUCATIONAL DISCLAIMER:** This application is an educational/scenario demonstrator, not an engineering-grade grid planning tool. It is designed to illustrate concepts and explore scenarios using transparent assumptions. All results are conceptual and should not be used for actual utility planning, interconnection decisions, or investment decisions without proper engineering studies and validated data.

## 1. Technology Stack

### Core Technologies
- **Framework:** React 18+
- **Language:** TypeScript 5+
- **Build Tool:** Vite 5+
- **Package Manager:** npm or pnpm

### UI Libraries
- **Styling:** CSS Modules or Tailwind CSS (to be determined)
- **Charts:** Recharts or Chart.js (lightweight, React-friendly)
- **Icons:** Lucide React or similar lightweight icon library

### Development Tools
- **Testing:** Vitest (unit testing), React Testing Library (component testing)
- **Linting:** ESLint with TypeScript support
- **Code Quality:** Prettier for formatting
- **Type Checking:** TypeScript compiler

## 2. Architecture Overview

### Component Structure
```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard container
│   ├── GridDiagram.tsx        # Visual energy-flow diagram
│   ├── ScenarioControls.tsx   # User input controls
│   ├── MetricCard.tsx         # Display key metrics
│   ├── TimeSlider.tsx         # Hour-of-day control
│   ├── EnergyChart.tsx        # 24-hour visualization
│   ├── ScenarioPresets.tsx    # Preset scenario buttons
│   └── AssumptionsPanel.tsx   # Collapsible assumptions info
├── simulation/
│   ├── engine.ts              # Core simulation logic
│   ├── solarCurve.ts          # Solar generation calculations
│   ├── demandCurve.ts         # Residential demand calculations
│   ├── storage.ts             # Battery storage logic
│   └── types.ts               # TypeScript interfaces
├── data/
│   ├── floridaDefaults.ts     # Default scenario values
│   └── assumptions.ts         # Parameter classifications and sources
├── App.tsx                    # Root component
└── main.tsx                   # Application entry point
```

### Separation of Concerns
- **Simulation Engine:** Pure TypeScript, no React dependencies
- **UI Components:** React components that consume simulation results
- **State Management:** React hooks for local state
- **Data Flow:** Unidirectional - controls → simulation → display
- **Assumptions Transparency:** All assumptions visible and replaceable

## 3. Data Structures

### Core Interfaces

```typescript
// Storage Power Capability (separate from energy capacity)
interface StoragePowerCapability {
  maxChargePowerMW: number;      // Maximum aggregate charge power (MW)
  maxDischargePowerMW: number;   // Maximum aggregate discharge power (MW)
}

// Storage Energy Capacity
interface StorageEnergyCapacity {
  totalUsableCapacityMWh: number; // Total usable storage capacity (MWh)
  currentChargeMWh: number;       // Current state of charge (MWh)
}

// Scenario Configuration
interface ScenarioConfig {
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
interface HourResult {
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
interface CoreSimulationResult {
  config: ScenarioConfig;
  hours: HourResult[];                 // Array of 24 HourResult objects
}

// Complete Simulation Result with summary
interface SimulationResult {
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
```

## 4. Simulation Engine

### Three-Tier Architecture (Prevents Recursion)

```typescript
// Tier 1: Core simulation without comparative calculations
function simulateCore(config: ScenarioConfig): CoreSimulationResult {
  // Calculate derived storage values
  const participatingEVs = config.totalEVs * config.evParticipationRate;
  const totalEVStorageKWh = participatingEVs * config.averageEVBatteryKWh;
  const usableEVStorageKWh = totalEVStorageKWh * config.evAvailableCapacityPercent;
  const usableEVStorageMWh = usableEVStorageKWh / 1000; // Convert kWh to MWh

  const homeStorageKWh = config.homeBatteryCount * config.homeBatteryKWh;
  const homeStorageMWh = homeStorageKWh / 1000; // Convert kWh to MWh

  const totalUsableStorageMWh = usableEVStorageMWh + homeStorageMWh;

  // Calculate power capability limits
  const evMaxChargePowerMW = (participatingEVs * config.evChargePowerKW) / 1000;
  const evMaxDischargePowerMW = (participatingEVs * config.evDischargePowerKW) / 1000;
  const homeMaxChargePowerMW = (config.homeBatteryCount * config.homeChargePowerKW) / 1000;
  const homeMaxDischargePowerMW = (config.homeBatteryCount * config.homeDischargePowerKW) / 1000;

  const aggregateMaxChargePowerMW = evMaxChargePowerMW + homeMaxChargePowerMW;
  const aggregateMaxDischargePowerMW = evMaxDischargePowerMW + homeMaxDischargePowerMW;

  // Calculate hourly results
  const hours: HourResult[] = [];
  let currentStorageMWh = totalUsableStorageMWh * config.initialSOCPercent; // Start at initial SOC

  for (let hour = 0; hour < 24; hour++) {
    const result = calculateHour(
      config,
      hour,
      currentStorageMWh,
      totalUsableStorageMWh,
      aggregateMaxChargePowerMW,
      aggregateMaxDischargePowerMW
    );
    hours.push(result);
    currentStorageMWh = result.batteryStateOfChargeMWh;
  }

  return { config, hours };
}

// Tier 2: Single scenario summary (no recursion)
function summarizeSingleScenario(hours: HourResult[], config: ScenarioConfig): SimulationResult['summary'] {
  const peakNetGridLoadMW = Math.max(...hours.map(h => h.netGridLoadMW));
  const totalDistributedSolarMWh = hours.reduce((sum, h) => sum + h.rooftopSolarMW, 0);
  const totalBatteryDispatchMWh = hours.reduce((sum, h) => sum + h.batteryDispatchMW, 0);
  const minimumSOCMWh = hours.reduce((min, h) => Math.min(min, h.batteryStateOfChargeMWh), Infinity);
  const terminalSOCMWh = hours[23].batteryStateOfChargeMWh;
  const totalUsableStorageMWh = hours[0].batteryStateOfChargeMWh / config.initialSOCPercent; // Calculate from initial SOC
  const minimumSOCPercent = minimumSOCMWh / totalUsableStorageMWh;
  const terminalSOCPercent = terminalSOCMWh / totalUsableStorageMWh;

  return {
    peakNetGridLoadMW,
    totalDistributedSolarMWh,
    totalBatteryDispatchMWh,
    minimumSOCMWh,
    terminalSOCMWh,
    minimumSOCPercent,
    terminalSOCPercent,
    effectiveGridCapacityReleasedMW: 0, // Calculated in comparison
    equivalentAICampuses500MW: 0,        // Calculated in comparison
    equivalentAICampuses1GW: 0           // Calculated in comparison
  };
}

// Tier 3: Scenario comparison (avoids recursion)
function compareScenarios(
  traditionalHours: HourResult[],
  coordinatedHours: HourResult[]
): Pick<SimulationResult['summary'], 'effectiveGridCapacityReleasedMW' | 'equivalentAICampuses500MW' | 'equivalentAICampuses1GW'> {
  const traditionalPeakNetGridLoad = Math.max(...traditionalHours.map(h => h.netGridLoadMW));
  const coordinatedPeakNetGridLoad = Math.max(...coordinatedHours.map(h => h.netGridLoadMW));

  const effectiveGridCapacityReleasedMW = Math.max(0, traditionalPeakNetGridLoad - coordinatedPeakNetGridLoad);
  const equivalentAICampuses500MW = effectiveGridCapacityReleasedMW / 500;
  const equivalentAICampuses1GW = effectiveGridCapacityReleasedMW / 1000;

  return {
    effectiveGridCapacityReleasedMW,
    equivalentAICampuses500MW,
    equivalentAICampuses1GW
  };
}

// Main entry point (combines all tiers)
function simulateScenario(config: ScenarioConfig): SimulationResult {
  const coreResult = simulateCore(config);
  const singleSummary = summarizeSingleScenario(coreResult.hours, config);

  // If coordinated mode, compare with traditional
  let comparisonMetrics = {
    effectiveGridCapacityReleasedMW: 0,
    equivalentAICampuses500MW: 0,
    equivalentAICampuses1GW: 0
  };

  if (config.operatingMode === 'coordinated') {
    const traditionalConfig = { ...config, operatingMode: 'traditional' as const };
    const traditionalCore = simulateCore(traditionalConfig);
    comparisonMetrics = compareScenarios(traditionalCore.hours, coreResult.hours);
  }

  return {
    config: coreResult.config,
    hours: coreResult.hours,
    summary: {
      ...singleSummary,
      ...comparisonMetrics
    }
  };
}
```

### Hourly Calculation Logic

```typescript
function calculateHour(
  config: ScenarioConfig,
  hour: number,
  startingStorageMWh: number,
  totalUsableStorageMWh: number,
  maxChargePowerMW: number,
  maxDischargePowerMW
): HourResult {
  // Get inputs for this hour
  const residentialDemand = getResidentialDemand(hour);
  const solarFactor = getSolarFactor(hour);
  const rooftopSolarMW = config.distributedSolarMW * solarFactor;
  const utilitySolarMW = config.utilitySolarMW * solarFactor;

  let batteryChargeMW = 0;
  let batteryDischargeMW = 0;
  let gridExportMW = 0;
  let netGridLoadMW = 0;
  let residentialUnmetLoadMW = 0;

  if (config.hurricaneMode) {
    // HURRICANE/ISLAND MODE
    // Grid disconnected, only distributed resources serve critical residential load
    const criticalLoadMW = residentialDemand * config.criticalLoadPercent;
    const totalAvailableGeneration = rooftopSolarMW;

    if (totalAvailableGeneration >= criticalLoadMW) {
      // Solar can serve all critical load
      const surplus = totalAvailableGeneration - criticalLoadMW;
      // Constrain by both power and energy capacity
      const maxChargeByPower = Math.min(surplus, maxChargePowerMW);
      const maxChargeByEnergy = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      batteryChargeMW = Math.min(maxChargeByPower, maxChargeByEnergy);
      residentialUnmetLoadMW = 0;
    } else {
      // Solar insufficient, discharge batteries
      const deficit = criticalLoadMW - totalAvailableGeneration;
      // Constrain by both power and energy capacity
      const maxDischargeByPower = Math.min(deficit, maxDischargePowerMW);
      const maxDischargeByEnergy = startingStorageMWh * config.batteryDischargingEfficiency;
      batteryDischargeMW = Math.min(maxDischargeByPower, maxDischargeByEnergy);
      residentialUnmetLoadMW = Math.max(0, criticalLoadMW - totalAvailableGeneration - batteryDischargeMW);
    }

    // Calculate new SOC with efficiency
    const storageChangeMWh = calculateStorageChange(
      batteryChargeMW,
      batteryDischargeMW,
      config.batteryChargingEfficiency,
      config.batteryDischargingEfficiency
    );

    const newStorageMWh = Math.max(0, Math.min(
      startingStorageMWh + storageChangeMWh,
      totalUsableStorageMWh
    ));

    // Estimate backup duration based on current storage and critical load
    const avgCriticalDemand = residentialDemand * config.criticalLoadPercent; // Use hourly critical load
    const estimatedBackupHours = newStorageMWh / avgCriticalDemand;

    return {
      hour,
      residentialDemandMW: residentialDemand,
      aiLoadMW: 0, // AI load not served in hurricane mode
      totalDemandMW: residentialDemand,
      rooftopSolarMW,
      utilitySolarMW: 0, // Utility solar not available in island mode
      totalSolarMW: rooftopSolarMW,
      batteryChargeMW,
      batteryDischargeMW,
      batteryStateOfChargeMWh: newStorageMWh,
      netGridLoadMW: 0, // Disconnected from grid
      batteryDispatchMW: batteryDischargeMW,
      solarContributionMW: rooftopSolarMW,
      gridExportMW: 0, // No export in island mode
      residentialUnmetLoadMW,
      estimatedBackupHours
    };
  }

  if (config.operatingMode === 'traditional') {
    // TRADITIONAL GRID MODE
    // Represents current-state operating model without VPP coordination

    // Rooftop solar offsets behind-the-meter residential demand first
    const netResidentialLoad = Math.max(0, residentialDemand - rooftopSolarMW);
    gridExportMW = Math.max(0, rooftopSolarMW - residentialDemand);

    // Utility-scale solar contributes to grid supply (fair comparison)
    const utilityGeneration = utilitySolarMW;

    // Managed/time-shifted EV charging has a current real-world analogue
    // in FPL programs that encourage charging during off-peak periods.
    // Vehicle-to-grid discharge is not assumed as a current Florida/FPL
    // operating capability in Traditional mode.

    // Utility supplies remaining demand (including AI load)
    netGridLoadMW = Math.max(0, netResidentialLoad + config.aiLoadMW - utilityGeneration);

    // Traditional mode: no coordinated battery dispatch
    // Batteries may charge from excess rooftop solar if present (simplified)
    if (gridExportMW > 0 && startingStorageMWh < totalUsableStorageMWh) {
      // Constrain by both power and energy capacity
      const maxChargeByPower = Math.min(gridExportMW, maxChargePowerMW);
      const maxChargeByEnergy = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      batteryChargeMW = Math.min(maxChargeByPower, maxChargeByEnergy);
      gridExportMW -= batteryChargeMW;
    }

  } else {
    // COORDINATED GRID MODE
    // VPP-style orchestration with intelligent DER coordination
    // Includes minimum SOC floor and terminal SOC target for daily sustainability
    // Smart EV charging is grounded in existing managed/off-peak
    // charging concepts.
    // Coordinated V2G discharge and aggregation of EV/home-battery
    // resources into a VPP are modeled as an ILLUSTRATIVE future-state
    // Florida capability, not as an assertion that this operating model
    // is currently available under FPL rules.
    
    const totalSolar = rooftopSolarMW + utilitySolarMW;
    const totalDemand = residentialDemand + config.aiLoadMW;

    // Calculate SOC constraints
    const minimumSOCMWh = totalUsableStorageMWh * config.minimumSOCPercent;
    const terminalSOCMWh = totalUsableStorageMWh * config.terminalSOCPercent;

    // Simple transparent strategy for MVP:
    // Hours 0-18: Normal dispatch subject to minimum SOC floor
    // Hours 19-23: Progressive recharge to meet terminal SOC target
    const isLaterHours = hour >= 19;
    const targetSOCMWh = isLaterHours ? terminalSOCMWh : minimumSOCMWh;
    const availableForDischarge = startingStorageMWh - targetSOCMWh;

    if (totalSolar > totalDemand) {
      // Surplus period: charge batteries
      const surplus = totalSolar - totalDemand;
      // Constrain by both power and energy capacity
      const maxChargeByPower = Math.min(surplus, maxChargePowerMW);
      const maxChargeByEnergy = (totalUsableStorageMWh - startingStorageMWh) / config.batteryChargingEfficiency;
      batteryChargeMW = Math.min(maxChargeByPower, maxChargeByEnergy);
      netGridLoadMW = 0;
      gridExportMW = Math.max(0, surplus - batteryChargeMW);
    } else {
      // Deficit period: discharge batteries (respecting SOC constraints)
      const deficit = totalDemand - totalSolar;
      // Constrain by both power and energy capacity
      const maxDischargeByPower = Math.min(deficit, maxDischargePowerMW);
      const maxDischargeByEnergy = Math.max(0, availableForDischarge) * config.batteryDischargingEfficiency;
      batteryDischargeMW = Math.min(maxDischargeByPower, maxDischargeByEnergy);
      netGridLoadMW = Math.max(0, totalDemand - totalSolar - batteryDischargeMW);
      gridExportMW = 0;
    }
  }

  // Calculate new state of charge with proper efficiency treatment
  const storageChangeMWh = calculateStorageChange(
    batteryChargeMW,
    batteryDischargeMW,
    config.batteryChargingEfficiency,
    config.batteryDischargingEfficiency
  );

  const newStorageMWh = Math.max(0, Math.min(
    startingStorageMWh + storageChangeMWh,
    totalUsableStorageMWh
  ));

  // Calculate DER contributions for metrics
  const batteryDispatchMW = batteryDischargeMW;
  const solarContributionMW = rooftopSolarMW + utilitySolarMW;

  return {
    hour,
    residentialDemandMW: residentialDemand,
    aiLoadMW: config.aiLoadMW,
    totalDemandMW: residentialDemand + config.aiLoadMW,
    rooftopSolarMW,
    utilitySolarMW,
    totalSolarMW: rooftopSolarMW + utilitySolarMW,
    batteryChargeMW,
    batteryDischargeMW,
    batteryStateOfChargeMWh: newStorageMWh,
    netGridLoadMW,
    batteryDispatchMW,
    solarContributionMW,
    gridExportMW
  };
}

// Helper function for storage change calculation
function calculateStorageChange(
  chargeMW: number,
  dischargeMW: number,
  chargingEfficiency: number,
  dischargingEfficiency: number
): number {
  // Energy (MWh) = Power (MW) × 1 hour
  // Apply efficiency in appropriate direction
  const chargeEnergyMWh = chargeMW * chargingEfficiency; // Loss during charging
  const dischargeEnergyMWh = dischargeMW / dischargingEfficiency; // Loss during discharge
  return chargeEnergyMWh - dischargeEnergyMWh;
}
```

## 5. Operating Mode Definitions

### Traditional Grid Mode
Represents a reasonable current-state operating model without VPP coordination:

**Energy Flow Rules:**
- Rooftop solar first offsets behind-the-meter residential demand
- Excess rooftop solar may export to grid (net metering)
- Utility-scale solar contributes to grid supply
- Utility supplies remaining demand (residential + AI)
- EV charging occurs without centralized coordination
- Home batteries primarily serve customer needs
- No VPP-style coordinated dispatch to grid
- Batteries may charge from excess rooftop solar (simplified)
- No terminal SOC constraint (traditional operation)

**Key Characteristics:**
- DERs operate independently
- No intelligent load shifting
- No coordinated battery dispatch
- Represents "business as usual" with some distributed resources

### Coordinated Grid Mode
Demonstrates incremental benefit of intelligent DER coordination:

**Energy Flow Rules:**
- Smart EV charging (shift to favorable periods)
- Coordinated home battery operation
- Coordinated use of participating EV/storage capacity
- Charging during low-demand/high-solar periods
- Discharging during high-demand periods
- VPP-style orchestration of distributed resources
- Utility-scale solar integrated in coordinated dispatch
- **Minimum SOC floor** for operating reserve during daily operations
- **Terminal SOC target** for daily energy sustainability
- Simple transparent strategy: Hours 0-18 normal dispatch, Hours 19-23 progressive recharge
- Battery dispatch respects minimum SOC floor and aims for terminal SOC target

**Key Characteristics:**
- DERs operate as coordinated system
- Intelligent load shifting and storage dispatch
- Optimized timing of battery operations
- Daily energy sustainability (returns to required SOC)
- Represents "future state" with VPP coordination

**Key Difference:** Coordinated mode adds intelligent timing and orchestration of existing DERs, not additional resources. Peak reduction comes from coordination, not from consuming stored energy without replenishment.

## 6. Supporting Functions

### Solar Generation Curve

```typescript
function getSolarFactor(hour: number): number {
  // ILLUSTRATIVE: Normalized solar generation curve
  const solarCurve = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0.05, 7: 0.15, 8: 0.30, 9: 0.50,
    10: 0.70, 11: 0.85, 12: 0.95, 13: 1.0,
    14: 0.90, 15: 0.75, 16: 0.55, 17: 0.30,
    18: 0.10, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0
  };
  return solarCurve[hour] || 0;
}
```

### Residential Demand Curve

```typescript
function getResidentialDemand(hour: number): number {
  // ILLUSTRATIVE: Normalized Florida system demand curve (0-1 scale)
  // NOTE: This is an illustrative scale, not a validated Florida residential demand figure
  // Designed to be replaceable with real FPL hourly load data
  const demandCurve = {
    0: 0.4, 1: 0.35, 2: 0.3, 3: 0.3, 4: 0.35, 5: 0.45,
    6: 0.6, 7: 0.75, 8: 0.8, 9: 0.75, 10: 0.7, 11: 0.65,
    12: 0.65, 13: 0.7, 14: 0.75, 15: 0.8, 16: 0.85, 17: 0.95,
    18: 1.0, 19: 0.95, 20: 0.85, 21: 0.75, 22: 0.65, 23: 0.5
  };

  const baseSystemDemandMW = 20000; // ILLUSTRATIVE: Florida system demand scale
  return baseSystemDemandMW * (demandCurve[hour] || 0.5);
}
```

## 7. Component Specifications

### Dashboard Component
- **Purpose:** Main container for all visualization components
- **State:** Current scenario config, selected hour, operating mode
- **Layout:** Responsive grid layout
- **Responsibilities:** Coordinate child components, manage global state

### GridDiagram Component
- **Purpose:** Visual representation of energy flow between system components
- **Animation:** Animated lines showing power flow direction and magnitude
- **Components:** FPL Grid, Utility Solar, Homes, Distributed Storage, AI Data Center
- **Interactivity:** Highlights change based on current hour and mode

### ScenarioControls Component
- **Purpose:** User input for all scenario parameters
- **Controls:** Sliders with numeric inputs for all numeric parameters
- **Validation:** Ensure values stay within specified ranges
- **Real-time:** Trigger recalculation on any value change

### MetricCard Component
- **Purpose:** Display individual metrics with tooltips
- **Style:** Large, readable numbers suitable for presentation
- **Interactivity:** Hover to show detailed explanations
- **Metrics:** Net Grid Load, Battery Dispatch, Solar Contribution, DER Peak Reduction

### EnergyChart Component
- **Purpose:** 24-hour line chart showing multiple data series
- **Library:** Recharts or Chart.js
- **Series:** Residential demand, solar, net grid load, battery charge/discharge, AI load
- **Interactivity:** Toggle series on/off, hover for details

## 8. Default Scenario Values

```typescript
export const floridaDefaults: ScenarioConfig = {
  // EV Parameters (ILLUSTRATIVE)
  totalEVs: 450400,
  evParticipationRate: 0.20,
  averageEVBatteryKWh: 70,
  evAvailableCapacityPercent: 0.20,
  evChargePowerKW: 7.2,        // ILLUSTRATIVE: Level 2 charging
  evDischargePowerKW: 7.2,     // ILLUSTRATIVE: V2G capability

  // Solar Parameters (ILLUSTRATIVE)
  distributedSolarMW: 3150,
  utilitySolarMW: 0,

  // Home Battery Parameters (ILLUSTRATIVE)
  homeBatteryCount: 0,
  homeBatteryKWh: 13.5,
  homeChargePowerKW: 5,        // ILLUSTRATIVE: Powerwall charge rate
  homeDischargePowerKW: 5,     // ILLUSTRATIVE: Powerwall discharge rate

  // AI Infrastructure (ILLUSTRATIVE)
  aiLoadMW: 1000,

  // System Parameters (ILLUSTRATIVE)
  batteryChargingEfficiency: 0.95,
  batteryDischargingEfficiency: 0.95,
  operatingMode: 'traditional',
  hurricaneMode: false,
  criticalLoadPercent: 0.3,    // ILLUSTRATIVE: 30% of residential load is critical
  initialSOCPercent: 0.5,       // ILLUSTRATIVE: Start at 50% SOC
  minimumSOCPercent: 0.2,       // ILLUSTRATIVE: 20% minimum operating reserve
  terminalSOCPercent: 0.5       // ILLUSTRATIVE: End day at 50% SOC
};
```

## 9. Scenario Presets

### Illustrative Florida Baseline (ILLUSTRATIVE)
```typescript
{
  totalEVs: 450400,
  evParticipationRate: 0.20,
  distributedSolarMW: 3150,
  utilitySolarMW: 0,
  homeBatteryCount: 0,
  aiLoadMW: 1000
}
```

### Moderate VPP (ILLUSTRATIVE)
```typescript
{
  totalEVs: 1000000,
  evParticipationRate: 0.25,
  distributedSolarMW: 5000,
  utilitySolarMW: 2000,
  homeBatteryCount: 250000,
  aiLoadMW: 1000
}
```

### Aggressive 2030 (ILLUSTRATIVE)
```typescript
{
  totalEVs: 2000000,
  evParticipationRate: 0.50,
  distributedSolarMW: 8000,
  utilitySolarMW: 10000,
  homeBatteryCount: 1000000,
  aiLoadMW: 3000
}
```

### No Solar or Distributed Resources (ILLUSTRATIVE)
```typescript
{
  totalEVs: 0,
  evParticipationRate: 0,
  distributedSolarMW: 0,
  utilitySolarMW: 0,    // Utility solar also zeroed for baseline comparison
  homeBatteryCount: 0,
  aiLoadMW: 1000
}
```

**Note:** Utility-scale solar is centralized generation, not a distributed resource. This scenario removes both distributed resources AND utility-scale solar for a clean baseline comparison.

## 10. Performance Requirements

- **Calculation Speed:** Full 24-hour simulation in < 100ms
- **UI Responsiveness:** No lag when adjusting sliders
- **Chart Rendering:** Charts render in < 50ms
- **Animation:** 60fps for energy flow animations
- **Memory Usage:** < 100MB for typical usage

## 11. Testing Strategy

### Simulation Engine Unit Tests
- **MW/MWh Unit Consistency:** Verify energy = power × time calculations
- **Battery SOC Conservation:** Verify storage changes sum correctly over 24h
- **SOC Boundary Conditions:** SOC never below zero, never above capacity
- **Charge/Discharge Power Limits:** Respect max power capabilities
- **Charge/Discharge Energy Limits:** Charge cannot exceed remaining MWh capacity, discharge cannot exceed available SOC
- **Energy Conservation at Boundaries:** Verify energy is conserved when SOC reaches either boundary
- **Round-Trip Efficiency:** Verify efficiency applied correctly
- **Solar Energy Accounting:** Verify solar energy conserved
- **Traditional vs Coordinated:** Verify mode differences are due to coordination only
- **No-DER Scenario:** Verify baseline behavior with zero distributed resources
- **Zero-EV Scenario:** Verify behavior with no EV participation
- **Zero-Solar Scenario:** Verify behavior with no solar generation
- **Maximum Scenario Values:** Verify behavior at parameter limits
- **Hurricane/Island Mode:** Verify island operation logic
- **Hurricane Critical Load:** Verify critical load percentage application
- **Hurricane Backup Duration:** Verify backup duration based on modeled critical load
- **Unmet Load Calculations:** Verify backup duration calculations
- **24-Hour Energy Sanity Checks:** Verify total energy balance
- **No Infinite Recursion:** Verify scenario comparison does not cause recursion
- **Minimum SOC Floor:** Verify SOC never falls below minimumSOCPercent
- **Terminal SOC Target:** Verify coordinated mode finishes approximately at terminalSOCPercent
- **SOC May Fall Below Terminal During Day:** Verify coordinated mode can discharge below terminalSOCPercent during hours 0-18
- **Daily Energy Neutrality:** Verify coordinated mode maintains energy sustainability
- **No Solar or Distributed Resources Preset:** Verify preset semantics (utility solar also zeroed)

### Integration Tests
- Test complete simulation pipeline
- Test scenario preset loading
- Test UI to simulation integration

### Component Tests
- Test individual component rendering
- Test user interactions (sliders, buttons)
- Test state updates and propagation

## 12. Security Considerations

- **No Backend:** All calculations client-side, no server communication
- **Input Validation:** All user inputs validated and sanitized
- **No Secrets:** No API keys or secrets required
- **Content Security:** Standard CSP headers for deployment

## 13. Deployment

### Build Process
```bash
npm run build
```

### Deployment Targets
- **Primary:** Vercel or Netlify (recommended for React/Vite)
- **Alternative:** GitHub Pages
- **Requirements:** Static hosting, no server-side processing

### Environment Variables
None required for v1.0

## 14. Browser Compatibility

- **Primary:** Chrome/Edge (latest)
- **Secondary:** Firefox, Safari (latest versions)
- **Mobile:** Responsive design for tablets (phone support optional)

## 15. Accessibility

- **Keyboard Navigation:** All controls accessible via keyboard
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Color Contrast:** WCAG AA compliance for text
- **Visual Clarity:** Large text suitable for presentation displays

## 16. Future Extension Points

The architecture is designed to support future enhancements with replaceable assumptions:

- **Real Data Integration:** FPL hourly load data, historical solar production
- **Advanced Modeling:** Transmission constraints, generator ramp rates
- **Financial Modeling:** Rate calculations, ROI analysis
- **Geographic Expansion:** County-level analysis, other states
- **Collaboration:** Scenario sharing, save/load functionality
- **EV Charging Profiles:** Realistic charging behavior distributions
- **V2G Availability:** Model-specific V2G capability
- **Utility Tariffs:** Time-of-use pricing, demand charges
- **Distribution Constraints:** Transformer limitations, feeder capacity

## 17. Model Transparency & Replaceability

All assumptions are designed to be:
1. **Visible:** Clearly documented in assumptions.ts
2. **Classified:** Marked as SOURCED, DERIVED, or ILLUSTRATIVE
3. **Replaceable:** Easy to substitute with real data when available
4. **Version-tracked:** Changes to assumptions documented

This ensures the model can evolve from illustrative to data-driven while maintaining the same architecture.

---

**Status:** Final Revision - Ready for review and approval
**Version:** 1.3
**Last Updated:** August 16, 2026
**Model Classification:** Educational/Scenario Demonstrator (not engineering-grade planning tool)
