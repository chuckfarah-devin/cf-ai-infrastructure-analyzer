/**
 * Controls panel for the Florida AI Grid Demonstrator
 * Adjustable parameters for EV participation, solar capacity, AI load, etc.
 */


import { Tooltip } from './Tooltip';
import { scenarioPresets } from '../data/floridaDefaults';
import type { ScenarioConfig } from '../simulation/types';

interface ControlsProps {
  config: ScenarioConfig;
  onConfigChange: (config: ScenarioConfig) => void;
}

function displayCapacity(value: number | undefined): number {
  return Number((value ?? 0).toFixed(1));
}

export function Controls({ config, onConfigChange }: ControlsProps) {
  const handleChange = (field: keyof typeof config, value: number | string | boolean) => {
    let processedValue: number | string | boolean = value;

    // Convert string inputs to numbers for numeric fields
    if (typeof value === 'string' && field !== 'operatingMode') {
      processedValue = parseFloat(value);
    }

    onConfigChange({
      ...config,
      [field]: processedValue
    });
  };

  const handlePresetChange = (presetId: string) => {
    const preset = scenarioPresets.find(p => p.id === presetId);
    if (preset) {
      onConfigChange({ ...preset.config });
    }
  };

  const currentPresetId = config.presetId ?? 'custom';

  return (
    <div className="controls-panel">
      <h2>Simulation Controls</h2>

      <div className="control-section">
        <h3>Scenario Preset</h3>
        <label>
          <select
            value={currentPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            {scenarioPresets.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.label}</option>
            ))}
            <option value="custom" disabled>Custom</option>
          </select>
        </label>
      </div>

      <div className="control-section">
        <h3>Operating Mode</h3>
        <label>
          <input
            type="radio"
            name="operatingMode"
            value="traditional"
            checked={config.operatingMode === 'traditional'}
            onChange={() => handleChange('operatingMode', 'traditional')}
          />
          Traditional (Current State)
        </label>
        <label>
          <input
            type="radio"
            name="operatingMode"
            value="coordinated"
            checked={config.operatingMode === 'coordinated'}
            onChange={() => handleChange('operatingMode', 'coordinated')}
          />
          <Tooltip term="VPP" definition="Virtual Power Plant - a network of decentralized power units that act as a single power plant">
            Coordinated (VPP)
          </Tooltip>
        </label>
      </div>

      <div className="control-section">
        <h3>
          <Tooltip term="EV" definition="Electric Vehicle - vehicles that use one or more electric motors for propulsion">
            Electric Vehicles
          </Tooltip>
        </h3>
        <label>
          Total EVs (thousands)
          <input
            type="number"
            value={config.totalEVs / 1000}
            onChange={(e) => handleChange('totalEVs', parseFloat(e.target.value) * 1000)}
            min="0"
            step="100"
          />
        </label>
        <label>
          Participation Rate
          <input
            type="range"
            value={config.evParticipationRate}
            onChange={(e) => handleChange('evParticipationRate', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{(config.evParticipationRate * 100).toFixed(0)}%</span>
        </label>
        <label>
          Available Capacity
          <input
            type="range"
            value={config.evAvailableCapacityPercent}
            onChange={(e) => handleChange('evAvailableCapacityPercent', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{(config.evAvailableCapacityPercent * 100).toFixed(0)}%</span>
        </label>
      </div>

      <div className="control-section">
        <h3>Solar Capacity</h3>
        <label>
          Distributed Solar (MW)
          <input
            type="number"
            value={displayCapacity(config.distributedSolarMW)}
            onChange={(e) => handleChange('distributedSolarMW', parseFloat(e.target.value))}
            min="0"
            step="100"
          />
        </label>
        <label>
          Utility Solar (MW)
          <input
            type="number"
            value={displayCapacity(config.utilitySolarMW)}
            onChange={(e) => handleChange('utilitySolarMW', parseFloat(e.target.value))}
            min="0"
            step="100"
          />
        </label>
      </div>

      <div className="control-section">
        <h3>Home Batteries</h3>
        <label>
          Home Battery Count (thousands)
          <input
            type="number"
            value={config.homeBatteryCount / 1000}
            onChange={(e) => handleChange('homeBatteryCount', parseFloat(e.target.value) * 1000)}
            min="0"
            step="10"
          />
        </label>
      </div>

      <div className="control-section">
        <h3>AI Data Center Load</h3>
        <label>
          AI Load (MW)
          <input
            type="number"
            value={config.aiLoadMW}
            onChange={(e) => handleChange('aiLoadMW', parseFloat(e.target.value))}
            min="0"
            step="50"
          />
        </label>
      </div>

      <div className="control-section">
        <h3>
          <Tooltip term="Conventional Generation" definition="Centralized generation resources: nuclear baseload, dispatchable natural gas, and variable wind">
            Conventional Generation
          </Tooltip>
        </h3>
        <label>
          Nuclear Capacity (MW)
          <input
            type="number"
            value={displayCapacity(config.nuclearCapacityMW)}
            onChange={(e) => handleChange('nuclearCapacityMW', parseFloat(e.target.value))}
            min="0"
            step="100"
          />
        </label>
        <label>
          Nuclear Availability
          <input
            type="range"
            value={config.nuclearAvailabilityPercent ?? 0.95}
            onChange={(e) => handleChange('nuclearAvailabilityPercent', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{((config.nuclearAvailabilityPercent ?? 0.95) * 100).toFixed(0)}%</span>
        </label>
        <label>
          Primarily Natural Gas (MW)
          <input
            type="number"
            value={displayCapacity(config.naturalGasCapacityMW)}
            onChange={(e) => handleChange('naturalGasCapacityMW', parseFloat(e.target.value))}
            min="0"
            step="100"
          />
        </label>
        <label>
          Gas Availability
          <input
            type="range"
            value={config.naturalGasAvailabilityPercent ?? 1.0}
            onChange={(e) => handleChange('naturalGasAvailabilityPercent', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{((config.naturalGasAvailabilityPercent ?? 1.0) * 100).toFixed(0)}%</span>
        </label>
        <label>
          Wind Capacity (MW)
          <input
            type="number"
            value={displayCapacity(config.windCapacityMW)}
            onChange={(e) => handleChange('windCapacityMW', parseFloat(e.target.value))}
            min="0"
            step="100"
          />
        </label>
        <label>
          Wind Capacity Factor
          <input
            type="range"
            value={config.windCapacityFactor ?? 0.35}
            onChange={(e) => handleChange('windCapacityFactor', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{((config.windCapacityFactor ?? 0.35) * 100).toFixed(0)}%</span>
        </label>
        <label>
          Other Generation (MW)
          <input
            type="number"
            value={displayCapacity(config.otherGenerationCapacityMW)}
            onChange={(e) => handleChange('otherGenerationCapacityMW', parseFloat(e.target.value))}
            min="0"
            step="10"
          />
        </label>
        <label>
          Purchased Power (MW)
          <input
            type="number"
            value={displayCapacity(config.purchasedPowerCapacityMW)}
            onChange={(e) => handleChange('purchasedPowerCapacityMW', parseFloat(e.target.value))}
            min="0"
            step="10"
          />
        </label>
        <label>
          Utility Battery Power (MW)
          <input
            type="number"
            value={displayCapacity(config.utilityBatteryPowerMW)}
            onChange={(e) => handleChange('utilityBatteryPowerMW', parseFloat(e.target.value))}
            min="0"
            step="10"
          />
        </label>
      </div>

      <div className="control-section">
        <h3>Advanced Settings</h3>
        <label>
          Hurricane Mode
          <input
            type="checkbox"
            checked={config.hurricaneMode}
            onChange={(e) => handleChange('hurricaneMode', e.target.checked)}
          />
        </label>
        <label>
          Initial SOC
          <input
            type="range"
            value={config.initialSOCPercent}
            onChange={(e) => handleChange('initialSOCPercent', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{(config.initialSOCPercent * 100).toFixed(0)}%</span>
        </label>
        <label>
          Minimum SOC Floor
          <input
            type="range"
            value={config.minimumSOCPercent}
            onChange={(e) => handleChange('minimumSOCPercent', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{(config.minimumSOCPercent * 100).toFixed(0)}%</span>
        </label>
        <label>
          Terminal SOC Target
          <input
            type="range"
            value={config.terminalSOCPercent}
            onChange={(e) => handleChange('terminalSOCPercent', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.05"
          />
          <span>{(config.terminalSOCPercent * 100).toFixed(0)}%</span>
        </label>
      </div>
    </div>
  );
}