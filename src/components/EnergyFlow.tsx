import { useMemo, useState } from 'react';
import {
  Sun,
  Home,
  Atom,
  Flame,
  Wind,
  Battery,
  Car,
  Server,
  ArrowRight,
  ArrowLeft,
  Activity,
  Factory,
  Cable
} from 'lucide-react';
import type { ScenarioConfig, HourResult } from '../simulation/types';
import { FPL_PUBLIC_BASELINE_DATE, FPL_SCALE_FACTOR } from '../data/fplPublicBaseline';

interface EnergyFlowProps {
  config: ScenarioConfig;
  hours: HourResult[];
}

const resourceConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  utilitySolar: { label: 'Utility Solar', icon: Sun, color: '#f59e0b' },
  rooftopSolar: { label: 'Rooftop Solar', icon: Home, color: '#f97316' },
  nuclear: { label: 'Nuclear', icon: Atom, color: '#8b5cf6' },
  naturalGas: { label: 'Primarily Natural Gas', icon: Flame, color: '#ef4444' },
  wind: { label: 'Wind', icon: Wind, color: '#06b6d4' },
  otherGeneration: { label: 'Other Generation', icon: Factory, color: '#78716c' },
  purchasedPower: { label: 'Purchased Power', icon: Cable, color: '#0f766e' },
  gridImport: { label: 'Grid Imports', icon: ArrowRight, color: '#64748b' }
};

const demandConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  residential: { label: 'Residential Load', icon: Home, color: '#3b82f6' },
  aiDataCenter: { label: 'AI Data Centers', icon: Server, color: '#10b981' },
  batteryCharging: { label: 'EV & Storage Charging', icon: Battery, color: '#f59e0b' },
  gridExport: { label: 'Grid Exports', icon: ArrowLeft, color: '#64748b' }
};

const storageConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  utilityBattery: { label: 'Utility Batteries', icon: Battery, color: '#22c55e' },
  residentialBattery: { label: 'Residential Batteries', icon: Home, color: '#84cc16' },
  evBattery: { label: 'EV Batteries (V2G)', icon: Car, color: '#06b6d4' }
};

function formatMW(value: number): string {
  return `${Math.round(value).toLocaleString()} MW`;
}

function lineWidthMW(value: number, max: number): number {
  if (max <= 0) return 1;
  return Math.max(1, Math.min(3.5, 1 + (value / max) * 2.5));
}

function curvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const bend = Math.abs(x2 - x1) * 0.55;
  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}

export function EnergyFlow({ config, hours }: EnergyFlowProps) {
  const [selectedHour, setSelectedHour] = useState<number>(() => {
    let peakHour = 0;
    let peakDemand = 0;
    hours.forEach((h, i) => {
      if (h.totalDemandMW > peakDemand) {
        peakDemand = h.totalDemandMW;
        peakHour = i;
      }
    });
    return peakHour;
  });

  const hour = hours[selectedHour];
  if (!hour) return null;

  const storageFractions = useMemo(() => {
    const participatingEVs = config.totalEVs * config.evParticipationRate;
    const evMWh = (participatingEVs * config.averageEVBatteryKWh * config.evAvailableCapacityPercent) / 1000;
    const homeMWh = (config.homeBatteryCount * config.homeBatteryKWh) / 1000;
    const utilityMWh = config.utilityBatteryEnergyMWh || 0;
    const total = evMWh + homeMWh + utilityMWh;
    return total > 0
      ? { ev: evMWh / total, home: homeMWh / total, utility: utilityMWh / total }
      : { ev: 0, home: 0, utility: 0 };
  }, [config]);

  const evChargeMW = hour.batteryChargeMW * storageFractions.ev;
  const homeChargeMW = hour.batteryChargeMW * storageFractions.home;
  const utilityChargeMW = hour.batteryChargeMW * storageFractions.utility;
  const evDischargeMW = hour.batteryDischargeMW * storageFractions.ev;
  const homeDischargeMW = hour.batteryDischargeMW * storageFractions.home;
  const utilityDischargeMW = hour.batteryDischargeMW * storageFractions.utility;

  const gridImportMW = Math.max(0, hour.netGridLoadMW);

  const generationRows = [
    { key: 'utilitySolar', value: hour.utilitySolarMW, installed: config.utilitySolarMW, available: hour.utilitySolarMW },
    { key: 'rooftopSolar', value: hour.rooftopSolarMW, installed: config.distributedSolarMW, available: hour.rooftopSolarMW },
    { key: 'nuclear', value: hour.nuclearMW, installed: config.nuclearCapacityMW ?? 0, available: hour.nuclearAvailableMW },
    { key: 'naturalGas', value: hour.naturalGasMW, installed: config.naturalGasCapacityMW ?? 0, available: hour.naturalGasAvailableMW },
    { key: 'wind', value: hour.windMW, installed: config.windCapacityMW ?? 0, available: hour.windAvailableMW },
    { key: 'otherGeneration', value: hour.otherGenerationMW, installed: config.otherGenerationCapacityMW ?? 0, available: hour.otherGenerationAvailableMW },
    { key: 'purchasedPower', value: hour.purchasedPowerMW, installed: config.purchasedPowerCapacityMW ?? 0, available: hour.purchasedPowerAvailableMW },
    { key: 'gridImport', value: gridImportMW, installed: null, available: null }
  ].filter(row => row.value > 0 || (row.installed !== null && row.installed > 0));

  const demandRows = [
    { key: 'residential', value: hour.residentialDemandMW },
    { key: 'aiDataCenter', value: hour.aiLoadMW },
    { key: 'batteryCharging', value: hour.batteryChargeMW },
    { key: 'gridExport', value: hour.gridExportMW }
  ].filter(row => row.value > 0);

  const maxFlowMW = Math.max(
    hour.totalGenerationMW,
    hour.totalDemandMW,
    ...generationRows.map(r => r.value),
    ...demandRows.map(r => r.value),
    hour.batteryChargeMW,
    hour.batteryDischargeMW
  );

  const gridX = 50;
  const gridY = 38;
  const sourceX = 32;
  const demandX = 68;
  const storageY = 98;

  const sourceYs = generationRows.map((_, i) =>
    generationRows.length === 1 ? 30 : 18 + (i * (gridY - 12) / Math.max(1, generationRows.length - 1))
  );

  const demandYs = demandRows.map((_, i) =>
    demandRows.length === 1 ? 30 : 18 + (i * (gridY - 12) / Math.max(1, demandRows.length - 1))
  );

  const sourceConnectors = generationRows.map((row, i) => ({
    x1: sourceX,
    y1: sourceYs[i],
    x2: gridX,
    y2: gridY,
    value: row.value,
    color: resourceConfig[row.key].color
  }));

  const demandConnectors = demandRows.map((row, i) => ({
    x1: gridX,
    y1: gridY,
    x2: demandX,
    y2: demandYs[i],
    value: row.value,
    color: demandConfig[row.key].color
  }));

  const storageConnectors = [] as { x1: number; y1: number; x2: number; y2: number; value: number; color: string }[];
  if (hour.batteryChargeMW > 0) {
    storageConnectors.push({
      x1: gridX,
      y1: gridY,
      x2: gridX - 12,
      y2: storageY,
      value: hour.batteryChargeMW,
      color: '#f59e0b'
    });
  }
  if (hour.batteryDischargeMW > 0) {
    storageConnectors.push({
      x1: gridX - 12,
      y1: storageY,
      x2: gridX,
      y2: gridY,
      value: hour.batteryDischargeMW,
      color: '#22c55e'
    });
  }

  const imports = Math.max(0, hour.netGridLoadMW);
  const exports = hour.gridExportMW;
  const energyBalance =
    hour.totalGenerationMW + hour.purchasedPowerMW + hour.batteryDischargeMW + imports -
    (hour.totalDemandMW + hour.batteryChargeMW + exports + hour.curtailedGenerationMW);

  return (
    <div className="energy-flow">
      <div className="energy-flow-header">
        <div>
          <h2>{config.presetId === 'fpl-public' ? 'Public FPL Portfolio — Scaled Illustrative Dispatch' : 'Florida Energy Flow'}</h2>
          {config.presetId === 'fpl-public' && (
            <p className="energy-flow-disclaimer">
              Public capacities as of {FPL_PUBLIC_BASELINE_DATE}, scaled uniformly to {(FPL_SCALE_FACTOR * 100).toFixed(2)}%. Primarily Natural Gas includes dual-fuel capability. Illustrative priority dispatch does not reproduce FPL load, reserves, transmission constraints, or actual operations.
            </p>
          )}
        </div>
        <div className="hour-selector">
          <label>
            Hour:
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value, 10))}
            />
            <span>{selectedHour}:00</span>
          </label>
        </div>
      </div>

      <div className="energy-flow-diagram">
        {/* SVG connector overlay */}
        <svg
          className="flow-connectors"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {sourceConnectors.map((c, i) => (
            <path
              key={`source-${i}`}
              className="flow-path"
              d={curvedPath(c.x1, c.y1, c.x2, c.y2)}
              stroke={c.color}
              strokeWidth={lineWidthMW(c.value, maxFlowMW)}
            />
          ))}

          {demandConnectors.map((c, i) => (
            <path
              key={`demand-${i}`}
              className="flow-path"
              d={curvedPath(c.x1, c.y1, c.x2, c.y2)}
              stroke={c.color}
              strokeWidth={lineWidthMW(c.value, maxFlowMW)}
            />
          ))}

          {storageConnectors.map((c, i) => (
            <path
              key={`storage-${i}`}
              className="flow-path"
              d={curvedPath(c.x1, c.y1, c.x2, c.y2)}
              stroke={c.color}
              strokeWidth={lineWidthMW(c.value, maxFlowMW)}
            />
          ))}
        </svg>

        {/* Generation sources (left) */}
        <div className="flow-column flow-sources">
          <h3>Generation Sources</h3>
          {generationRows.map(row => {
            const cfg = resourceConfig[row.key];
            const Icon = cfg.icon;
            return (
              <div key={row.key} className="flow-node flow-source-node" style={{ borderColor: cfg.color }}>
                <div className="flow-node-icon" style={{ color: cfg.color }}>
                  <Icon size={22} />
                </div>
                <div className="flow-node-body">
                  <div className="flow-node-label">{cfg.label}</div>
                  <div className="flow-node-value">{formatMW(row.value)}</div>
                  {row.installed !== null && row.installed > 0 && (
                    <div className="flow-node-capacity">
                      installed {formatMW(row.installed)} · available {formatMW(row.available ?? 0)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center grid hub */}
        <div className="flow-center">
          <div className="flow-grid-hub">
            <div className="flow-grid-icon">
              <Activity size={36} />
            </div>
            <div className="flow-grid-label">Florida Power Grid</div>
            <div className="flow-grid-load">{formatMW(hour.totalDemandMW + hour.batteryChargeMW)}</div>
            <div className="flow-grid-sub">System Demand incl. Storage Charging</div>
          </div>
        </div>

        {/* Consumers (right) */}
        <div className="flow-column flow-demands">
          <h3>Consumers</h3>
          {demandRows.map(row => {
            const cfg = demandConfig[row.key];
            const Icon = cfg.icon;
            return (
              <div key={row.key} className="flow-node flow-demand-node" style={{ borderColor: cfg.color }}>
                <div className="flow-node-icon" style={{ color: cfg.color }}>
                  <Icon size={22} />
                </div>
                <div className="flow-node-body">
                  <div className="flow-node-label">{cfg.label}</div>
                  <div className="flow-node-value">{formatMW(row.value)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage rail (bottom row) */}
      <div className="flow-storage-rail">
        <h4>Storage Resources</h4>
        <div className="flow-storage-row">
          {(config.utilityBatteryPowerMW ?? 0) > 0 && (
            <div className="flow-storage-node" style={{ borderColor: storageConfig.utilityBattery.color }}>
              <Battery size={20} />
              <span>{storageConfig.utilityBattery.label}</span>
              <strong>{formatMW(utilityDischargeMW)} / {formatMW(utilityChargeMW)}</strong>
              <small>Discharge / Charge</small>
            </div>
          )}
          <div className="flow-storage-node" style={{ borderColor: storageConfig.residentialBattery.color }}>
            <Home size={20} />
            <span>{storageConfig.residentialBattery.label}</span>
            <strong>{formatMW(homeDischargeMW)} / {formatMW(homeChargeMW)}</strong>
            <small>Discharge / Charge</small>
          </div>
          <div className="flow-storage-node" style={{ borderColor: storageConfig.evBattery.color }}>
            <Car size={20} />
            <span>{storageConfig.evBattery.label}</span>
            <strong>{formatMW(evDischargeMW)} / {formatMW(evChargeMW)}</strong>
            <small>Discharge / Charge</small>
          </div>
        </div>
      </div>

      <div className="energy-flow-footer">
        <span>Balance check: {Math.abs(energyBalance) < 0.01 ? '✓' : `Δ ${energyBalance.toFixed(2)} MW`}</span>
        <span>Imports: {formatMW(imports)}</span>
        <span>Exports: {formatMW(exports)}</span>
        <span>Curtailment: {formatMW(hour.curtailedGenerationMW)}</span>
      </div>
    </div>
  );
}
