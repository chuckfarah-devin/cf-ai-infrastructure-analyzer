# Assumptions and Sources

*Parameter classifications, model assumptions, and data sources for the CF AI Infrastructure Analyzer.*

## Parameter Classification System

All model parameters are classified as:
- **SOURCED:** Supported by external authoritative sources with citations
- **DERIVED:** Calculated from sourced values using documented methodology
- **ILLUSTRATIVE:** Chosen for scenario exploration, not asserted as forecast/fact

## Model Assumptions

### Educational Purpose Disclaimer
This model is an educational/scenario demonstrator designed to illustrate concepts and explore potential scenarios. It is not an engineering-grade grid planning tool and should not be used for utility planning, interconnection decisions, or investment decisions without proper engineering studies and validated data.

### Core Modeling Assumptions

#### Time Step and Simulation
- **Simulation timestep:** 1 hour
- **Simulation duration:** 24 hours
- **Classification:** ILLUSTRATIVE - Simplified for real-time interaction

#### Solar Generation
- **Solar curve shape:** ILLUSTRATIVE - Simplified daily solar profile
- **Weather variability:** Not modeled in v1.0
- **Geographic variation:** Not modeled in v1.0 (uses single Florida profile)
- **Panel orientation:** Not modeled in v1.0

#### Demand Patterns
- **Residential demand shape:** ILLUSTRATIVE - Simplified daily demand curve
- **Commercial/industrial demand:** Not separately modeled (included in system demand)
- **Weather sensitivity:** Not modeled in v1.0
- **Seasonal variation:** Not modeled in v1.0 (single day profile)

#### Battery Storage
- **Round-trip efficiency:** ILLUSTRATIVE - 95% charging, 95% discharging
- **Degradation:** Not modeled in v1.0
- **Temperature effects:** Not modeled in v1.0
- **Availability:** Assumes 100% availability of participating resources

#### Electric Vehicles
- **V2G capability:** ILLUSTRATIVE - Assumes participating EVs have V2G capability
- **Plug-in availability:** ILLUSTRATIVE - Assumes participating EVs are plugged in when needed
- **Charging behavior:** Simplified in Traditional mode, optimized in Coordinated mode

#### Grid Operations
- **Transmission constraints:** Not modeled in v1.0
- **Distribution constraints:** Not modeled in v1.0
- **Generator ramp rates:** Not modeled in v1.0
- **Spinning reserves:** Not modeled in v1.0
- **Frequency regulation:** Not modeled in v1.0

## Parameter Classifications

### Electric Vehicle Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| totalEVs | 450,400 | ILLUSTRATIVE | SOURCE-NEEDED: Florida EV registration data |
| evParticipationRate | 20% | ILLUSTRATIVE | SOURCE-NEEDED: V2G program participation rates |
| averageEVBatteryKWh | 70 kWh | ILLUSTRATIVE | SOURCE-NEEDED: Average EV battery capacity |
| evAvailableCapacityPercent | 20% | ILLUSTRATIVE | Customer reserve requirement |
| evChargePowerKW | 7.2 kW | ILLUSTRATIVE | Level 2 charging assumption |
| evDischargePowerKW | 7.2 kW | ILLUSTRATIVE | V2G capability assumption |

### Solar Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| distributedSolarMW | 3,150 MW | ILLUSTRATIVE | SOURCE-NEEDED: Florida distributed solar capacity |
| utilitySolarMW | 0 MW | ILLUSTRATIVE | SOURCE-NEEDED: Florida utility-scale solar capacity |

### Home Battery Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| homeBatteryCount | 0 | ILLUSTRATIVE | SOURCE-NEEDED: Florida home battery installations |
| homeBatteryKWh | 13.5 kWh | ILLUSTRATIVE | Typical residential battery capacity |
| homeChargePowerKW | 5 kW | ILLUSTRATIVE | Typical residential battery charge rate |
| homeDischargePowerKW | 5 kW | ILLUSTRATIVE | Typical residential battery discharge rate |

### System Demand Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| baseSystemDemandMW | 20,000 MW | ILLUSTRATIVE | SOURCE-NEEDED: Florida system demand scale |
| demandCurveShape | Normalized profile | ILLUSTRATIVE | SOURCE-NEEDED: Florida hourly demand profile |

### EV Power Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| evChargePowerKW | 7.2 kW | ILLUSTRATIVE | SOURCE-NEEDED: Level 2 charging assumption |
| evDischargePowerKW | 7.2 kW | ILLUSTRATIVE | SOURCE-NEEDED: V2G capability assumption |

### Home Battery Power Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| homeChargePowerKW | 5 kW | ILLUSTRATIVE | SOURCE-NEEDED: Typical residential battery charge rate |
| homeDischargePowerKW | 5 kW | ILLUSTRATIVE | SOURCE-NEEDED: Typical residential battery discharge rate |

### System Operation Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| criticalLoadPercent | 30% | ILLUSTRATIVE | SOURCE-NEEDED: Critical load definition for hurricane mode |
| initialSOCPercent | 50% | ILLUSTRATIVE | Starting SOC for daily simulation |
| minimumSOCPercent | 20% | ILLUSTRATIVE | SOURCE-NEEDED: Minimum operating reserve for battery systems |
| terminalSOCPercent | 50% | ILLUSTRATIVE | SOURCE-NEEDED: Desired ending SOC for daily sustainability |

### AI Datacenter Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| aiLoadMW | 1,000 MW | ILLUSTRATIVE | Scenario exploration value |
| aiLoadProfile | Constant | ILLUSTRATIVE | Simplified for v1.0 |

### System Efficiency Parameters

| Parameter | Default Value | Classification | Source/Notes |
|-----------|---------------|----------------|--------------|
| batteryChargingEfficiency | 95% | ILLUSTRATIVE | SOURCE-NEEDED: Battery charging efficiency |
| batteryDischargingEfficiency | 95% | ILLUSTRATIVE | SOURCE-NEEDED: Battery discharging efficiency |

**Note:** With 95% charging efficiency and 95% discharging efficiency, the implied round-trip efficiency is 0.95 × 0.95 = 0.9025 = 90.25%

## Scenario Preset Classifications

### Illustrative Florida Baseline
- **Classification:** ILLUSTRATIVE
- **Purpose:** Baseline scenario representing approximate current conditions
- **Data Status:** SOURCE-NEEDED for most parameters
- **Note:** Renamed from "Florida Today" until actual Florida/FPL values are sourced

### Moderate VPP
- **Classification:** ILLUSTRATIVE
- **Purpose:** Explore moderate VPP deployment scenario
- **Data Status:** SOURCE-NEEDED for most parameters

### Aggressive 2030
- **Classification:** ILLUSTRATIVE
- **Purpose:** Explore aggressive deployment scenario
- **Data Status:** SOURCE-NEEDED for most parameters

### No Solar or Distributed Resources
- **Classification:** ILLUSTRATIVE
- **Purpose:** Baseline comparison scenario with no DER or utility solar
- **Data Status:** Not applicable (by definition)
- **Note:** Utility-scale solar is centralized generation, not distributed. This scenario removes both distributed resources AND utility-scale solar for a clean baseline comparison.

## Data Sources Needed

### Priority Sources for Future Enhancement

1. **Florida EV Registration Data**
   - Current EV counts by county/region
   - Growth projections
   - Source: Florida DMV, DOE Alternative Fuels Data Center

2. **Florida Solar Capacity Data**
   - Distributed (rooftop) solar capacity
   - Utility-scale solar capacity
   - Source: FPL, Florida PSC, EIA

3. **Florida Battery Storage Data**
   - Home battery installation counts
   - Utility-scale battery capacity
   - Source: FPL, industry reports

4. **Florida Load Data**
   - Hourly system demand profiles
   - Seasonal variations
   - Source: FPL, FERC Form 714

5. **Battery Efficiency Data**
   - Real-world round-trip efficiency
   - Temperature effects
   - Source: Manufacturer specifications, academic studies

6. **EV Charging Behavior**
   - Plug-in timing distributions
   - Charging duration profiles
   - Source: Academic studies, utility pilot programs

7. **V2G Capability**
   - V2G-enabled vehicle models
   - Power capabilities
   - Source: Manufacturer specifications

## Model Limitations

### Current Limitations (v1.0)

1. **Single Day Profile:** Model represents a single day, not seasonal variations
2. **No Weather Effects:** Solar generation assumes clear-sky conditions
3. **No Geographic Detail:** Uses single Florida profile, not county-level
4. **No Transmission Constraints:** Ignores transmission limitations
5. **No Distribution Constraints:** Ignores distribution system limitations
6. **No Generator Constraints:** Ignores power plant operational constraints
7. **Simplified Demand:** Uses normalized demand profile, not real data
8. **Perfect Availability:** Assumes 100% resource availability
9. **No Market Dynamics:** Ignores electricity prices and market structures
10. **No Financial Modeling:** Does not include costs or revenues

### Hurricane Mode Limitations

1. **Critical Load Assumption:** Uses configurable critical load percentage (default 30%) for backup calculations
2. **No Equipment Constraints:** Assumes compatible inverters and transfer switches
3. **No Weather Effects:** Does not model hurricane impact on solar generation
4. **No Grid Restoration:** Does not model grid recovery timeline
5. **Load Profile:** Uses daily demand profile for critical load, not emergency-specific patterns

## Future Data Integration Plan

### Phase 1: Basic Data Integration
- Replace illustrative demand with real FPL hourly load data
- Replace illustrative solar capacity with sourced capacity data
- Add Florida-specific solar generation profiles

### Phase 2: Enhanced Realism
- Add weather data integration
- Add seasonal profiles
- Add geographic variation (county-level)
- Add transmission constraints

### Phase 3: Advanced Modeling
- Add distribution system constraints
- Add generator operational constraints
- Add market dynamics and pricing
- Add financial modeling
- Add reliability metrics

## Documentation Standards

### Version Control
- All assumption changes documented in version history
- Major assumption changes require specification update
- Parameter classification changes logged

### Citation Standards
- SOURCED parameters must include specific citations
- DERIVED parameters must document calculation methodology
- ILLUSTRATIVE parameters must clearly state they are illustrative

### Transparency Requirements
- All assumptions visible in UI assumptions panel
- Model limitations clearly disclosed
- Scenario boundaries explicitly stated

## Florida Operating Context

### Rooftop Solar and Net Metering

Classification: SOURCED

Florida Power & Light supports net metering for qualifying customer-owned renewable generation. Rooftop solar first serves behind-the-meter customer load; excess production may be exported through a bidirectional meter and credited against electricity received from the grid.

Model implication:
- Rooftop solar offsets residential load first.
- Excess rooftop generation may become grid export.
- At night or when solar output is insufficient, residual demand is supplied by the grid.
- Net metering is modeled as an accounting/energy-flow relationship, not physical storage of exported electricity.

### Utility-Scale Battery Energy Shifting

Classification: SOURCED

FPL operates the Manatee Energy Storage Center, rated at approximately 409 MW / 900 MWh, demonstrating utility-scale storage of solar generation for later use during higher-demand periods.

Model implication:
- Energy storage can shift energy from periods of solar surplus/lower grid demand into periods of higher demand.
- Storage is constrained independently by power capability (MW) and energy capacity (MWh).

### Coordinated Distributed Battery / VPP Concept

Classification: SOURCED CONCEPT / ILLUSTRATIVE FLORIDA APPLICATION

Base Power provides a real-world example of aggregating distributed residential batteries into a virtual power plant and dispatching them for grid-balancing services.

Model implication:
- Coordinated mode may aggregate participating EV and home-battery resources as a dispatchable fleet.
- This is a conceptual operating model for Florida, not an assertion that the same retail/VPP business structure currently applies under FPL rules.

### Managed EV Charging

Classification: SOURCED

FPL offers EV charging programs with lower off-peak pricing designed to encourage charging during lower-demand periods.

Model implication:
- Coordinated mode may shift EV charging toward favorable hours.
- V2G discharge remains an illustrative future-state assumption unless separately sourced as available under Florida utility rules.

## Research Background

The initial model concept was informed by an exploratory analysis of:

- FPL rooftop-solar net metering
- daytime solar export versus nighttime grid consumption
- residential battery storage
- Base Power’s distributed-battery VPP model
- managed/off-peak EV charging
- the potential future role of EV batteries as distributed grid resources

The conversational research was used to identify model concepts and questions. Public-facing assumptions are supported separately by cited primary sources wherever possible.

---

**Status:** Updated - Parameter classifications refined with SOC management parameters
**Version:** 1.1
**Last Updated:** August 16, 2026
**Note:** Many parameters currently marked ILLUSTRATIVE/SOURCE-NEEDED - to be replaced with sourced data as available
