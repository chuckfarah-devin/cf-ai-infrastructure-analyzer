/**
 * V2 Energy Flow visualization with Florida outline hub,
 * animated flow paths, and particle animation.
 *
 * Layout: generation cards (left) → Florida hub (center) → consumer cards (right)
 * Storage rail below the hub.
 *
 * Connector paths are positioned using DOM ref measurements so they
 * visually connect to the actual rendered Florida map edges and card edges,
 * regardless of layout/font/zoom differences.
 */

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  Sun, Home, Atom, Flame, Wind, Battery, Car, Server,
  ArrowRight, ArrowLeft, Factory, Cable
} from 'lucide-react';
import type { ScenarioConfig, HourResult } from '../simulation/types';
import { FPL_PUBLIC_BASELINE_DATE, FPL_SCALE_FACTOR } from '../data/fplPublicBaseline';
import { FloridaHub } from './FloridaHub';

interface EnergyFlowProps {
  config: ScenarioConfig;
  hours: HourResult[];
  selectedHour: number;
  onHourChange: (hour: number) => void;
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

function lineWidthPx(value: number, max: number): number {
  if (max <= 0) return 2;
  return Math.max(2, Math.min(3.5, 2 + (value / max) * 1.5));
}

function curvedPathPx(x1: number, y1: number, x2: number, y2: number): string {
  const bend = Math.abs(x2 - x1) * 0.45;
  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}

/** Measure an element's center-Y and right/left edge relative to a container */
function relativePos(el: HTMLElement, container: HTMLElement) {
  const elRect = el.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  return {
    cx: elRect.left + elRect.width / 2 - cRect.left,
    cy: elRect.top + elRect.height / 2 - cRect.top,
    left: elRect.left - cRect.left,
    right: elRect.right - cRect.left,
    top: elRect.top - cRect.top,
    bottom: elRect.bottom - cRect.top,
    width: elRect.width,
    height: elRect.height,
  };
}

export function EnergyFlow({ config, hours, selectedHour, onHourChange }: EnergyFlowProps) {
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
    hour.batteryDischargeMW,
    1
  );

  // ── Refs for DOM measurement ──────────────────────────────
  const diagramRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const demandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mapSvgRef = useRef<SVGSVGElement>(null);
  const storageRailRef = useRef<HTMLDivElement>(null);

  // Connector state — pixel-based paths computed from DOM measurements
  const [connectors, setConnectors] = useState<
    { d: string; color: string; width: number; id: string }[]
  >([]);
  const [junctions, setJunctions] = useState<{ x: number; y: number }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  // Stable key for connector recomputation — avoids array-reference churn
  const genKeys = generationRows.map(r => r.key + ':' + Math.round(r.value)).join(',');
  const demKeys = demandRows.map(r => r.key + ':' + Math.round(r.value)).join(',');
  const chargeMW = hour.batteryChargeMW;
  const dischargeMW = hour.batteryDischargeMW;

  const computeConnectors = useCallback(() => {
    const diagram = diagramRef.current;
    const mapSvg = mapSvgRef.current;
    if (!diagram || !mapSvg) return;

    const dRect = diagram.getBoundingClientRect();
    if (dRect.width === 0 || dRect.height === 0) return;
    const mPos = relativePos(mapSvg as unknown as HTMLElement, diagram);

    // Florida map bounding box within the SVG (viewBox 0 0 400 386)
    const viewBoxW = 400;
    const viewBoxH = 386;
    const mapAR = viewBoxW / viewBoxH;
    const elAR = mPos.width / mPos.height;

    let geoOffX = 0, geoOffY = 0, geoScale = 1;
    if (elAR > mapAR) {
      geoScale = mPos.height / viewBoxH;
      geoOffX = (mPos.width - viewBoxW * geoScale) / 2;
    } else {
      geoScale = mPos.width / viewBoxW;
      geoOffY = (mPos.height - viewBoxH * geoScale) / 2;
    }

    const geoToPx = (vx: number, vy: number) => ({
      x: mPos.left + geoOffX + vx * geoScale,
      y: mPos.top + geoOffY + vy * geoScale,
    });

    // Junction points on the Florida map boundary
    // West coast (Tampa Bay area, ~viewBox x=250, y=160)
    const westJunction = geoToPx(230, 145);
    // East coast (Space Coast area, ~viewBox x=345, y=120)
    const eastJunction = geoToPx(345, 120);

    const newConnectors: { d: string; color: string; width: number; id: string }[] = [];
    const newJunctions: { x: number; y: number }[] = [];
    let idx = 0;

    // Source cards → west coast junction
    sourceRefs.current.forEach((el, i) => {
      if (!el || i >= generationRows.length) return;
      const pos = relativePos(el, diagram);
      const row = generationRows[i];
      newConnectors.push({
        d: curvedPathPx(pos.right, pos.cy, westJunction.x, westJunction.y),
        color: resourceConfig[row.key].color,
        width: lineWidthPx(row.value, maxFlowMW),
        id: `conn-${idx++}`,
      });
    });
    newJunctions.push(westJunction);

    // East coast junction → demand cards
    demandRefs.current.forEach((el, i) => {
      if (!el || i >= demandRows.length) return;
      const pos = relativePos(el, diagram);
      const row = demandRows[i];
      newConnectors.push({
        d: curvedPathPx(eastJunction.x, eastJunction.y, pos.left, pos.cy),
        color: demandConfig[row.key].color,
        width: lineWidthPx(row.value, maxFlowMW),
        id: `conn-${idx++}`,
      });
    });
    newJunctions.push(eastJunction);

    // Storage connectors — route from BELOW the info panel to the storage rail
    // Use the bottom of the flow-center column (below the info panel and legend)
    // instead of the tip of the peninsula, to avoid crossing the panel text.
    const storageRail = storageRailRef.current;
    if (storageRail) {
      const sPos = relativePos(storageRail, diagram);
      const storageTargetY = sPos.top;
      const storageTargetX = sPos.cx;

      // Start point: center-bottom of the Florida hub column, below the info panel
      // Find the flow-center element
      const flowCenter = diagram.querySelector('.flow-center') as HTMLElement | null;
      const hubBottom = flowCenter
        ? relativePos(flowCenter, diagram).bottom
        : mPos.bottom + 60;
      const hubCenterX = mPos.left + mPos.width / 2;

      if (chargeMW > 0) {
        newConnectors.push({
          d: curvedPathPx(hubCenterX - 10, hubBottom, storageTargetX - 20, storageTargetY),
          color: '#f59e0b',
          width: lineWidthPx(chargeMW, maxFlowMW),
          id: `conn-${idx++}`,
        });
      }
      if (dischargeMW > 0) {
        newConnectors.push({
          d: curvedPathPx(storageTargetX + 20, storageTargetY, hubCenterX + 10, hubBottom),
          color: '#22c55e',
          width: lineWidthPx(dischargeMW, maxFlowMW),
          id: `conn-${idx++}`,
        });
      }
    }

    setConnectors(newConnectors);
    setJunctions(newJunctions);
    setSvgSize({ w: dRect.width, h: dRect.height });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genKeys, demKeys, chargeMW, dischargeMW, maxFlowMW]);

  // Recompute on data change and on resize
  useEffect(() => {
    computeConnectors();
    window.addEventListener('resize', computeConnectors);
    return () => window.removeEventListener('resize', computeConnectors);
  }, [computeConnectors]);

  // Recompute after a short delay to catch layout shifts
  useEffect(() => {
    const t = setTimeout(computeConnectors, 150);
    return () => clearTimeout(t);
  }, [computeConnectors, selectedHour]);

  const imports = Math.max(0, hour.netGridLoadMW);
  const exports = hour.gridExportMW;
  const energyBalance =
    hour.totalGenerationMW + hour.purchasedPowerMW + hour.batteryDischargeMW + imports -
    (hour.totalDemandMW + hour.batteryChargeMW + exports + hour.curtailedGenerationMW);

  const presetLabel = config.presetId === 'fpl-public' ? 'FPL Public Portfolio' : 'Illustrative Model';

  return (
    <div className="energy-flow v2">
      <div className="energy-flow-header">
        <div>
          <h2>
            {config.presetId === 'fpl-public'
              ? 'Florida Energy Flow \u2014 From Generation to AI Infrastructure'
              : 'Florida Energy Flow \u2014 From Generation to AI Infrastructure'}
          </h2>
          {config.presetId === 'fpl-public' && (
            <p className="energy-flow-disclaimer">
              Public capacities as of {FPL_PUBLIC_BASELINE_DATE}, scaled to {(FPL_SCALE_FACTOR * 100).toFixed(2)}%. Illustrative dispatch only.
            </p>
          )}
        </div>
        <div className="hour-selector">
          <label>
            Time of Day:
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
            />
            <span className="hour-display">{selectedHour}:00</span>
          </label>
        </div>
      </div>

      <div className="energy-flow-body" ref={diagramRef}>
        {/* SVG connector overlay — pixel-based, measured from DOM */}
        {svgSize.w > 0 && (
          <svg
            className="flow-connectors"
            viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              {connectors.map((c) => (
                <marker
                  key={`arrow-${c.id}`}
                  id={`arrow-${c.id}`}
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0,0.5 8,3 0,5.5" fill={c.color} opacity="0.8" />
                </marker>
              ))}
            </defs>

            {connectors.map((c) => (
              <g key={c.id}>
                <path
                  className="flow-path"
                  d={c.d}
                  stroke={c.color}
                  strokeWidth={c.width}
                  markerEnd={`url(#arrow-${c.id})`}
                />
                <circle r="3" fill={c.color} opacity="0.85" className="flow-particle">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path={c.d} />
                </circle>
              </g>
            ))}

            {/* Junction dots on the Florida map */}
            {junctions.map((j, i) => (
              <circle key={`jct-${i}`} cx={j.x} cy={j.y} r="4" fill="#4a5ea8" opacity="0.6" className="junction-dot" />
            ))}
          </svg>
        )}

        {/* 3-column grid: sources | Florida hub | consumers */}
        <div className="energy-flow-diagram v2-diagram">
          {/* Generation sources (left column) */}
          <div className="flow-column flow-sources">
            <h3>Generation Sources</h3>
            {generationRows.map((row, i) => {
              const cfg = resourceConfig[row.key];
              const Icon = cfg.icon;
              return (
                <div
                  key={row.key}
                  ref={(el) => { sourceRefs.current[i] = el; }}
                  className="flow-node flow-source-node"
                  style={{ borderColor: cfg.color }}
                >
                  <div className="flow-node-icon" style={{ color: cfg.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="flow-node-body">
                    <div className="flow-node-label">{cfg.label}</div>
                    <div className="flow-node-value">{formatMW(row.value)}</div>
                    {row.installed !== null && row.installed > 0 && (
                      <div className="flow-node-capacity">
                        Avail {formatMW(row.available ?? 0)} of {formatMW(row.installed)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Florida Hub (center) */}
          <div className="flow-center">
            <FloridaHub
              totalLoadMW={hour.totalDemandMW}
              batteryChargeMW={hour.batteryChargeMW}
              selectedHour={selectedHour}
              presetLabel={presetLabel}
              mapSvgRef={mapSvgRef}
            />
          </div>

          {/* Consumers (right column) */}
          <div className="flow-column flow-demands">
            <h3>Consumers</h3>
            {demandRows.map((row, i) => {
              const cfg = demandConfig[row.key];
              const Icon = cfg.icon;
              return (
                <div
                  key={row.key}
                  ref={(el) => { demandRefs.current[i] = el; }}
                  className="flow-node flow-demand-node"
                  style={{ borderColor: cfg.color }}
                >
                  <div className="flow-node-icon" style={{ color: cfg.color }}>
                    <Icon size={20} />
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

        {/* Storage rail */}
        <div className="flow-storage-rail" ref={storageRailRef}>
          <h4>Storage Resources</h4>
          <div className="flow-storage-row">
            {(config.utilityBatteryPowerMW ?? 0) > 0 && (
              <div className="flow-storage-node" style={{ borderColor: storageConfig.utilityBattery.color }}>
                <Battery size={18} />
                <span>{storageConfig.utilityBattery.label}</span>
                <strong>{formatMW(utilityDischargeMW)} / {formatMW(utilityChargeMW)}</strong>
                <small>Discharge / Charge</small>
              </div>
            )}
            <div className="flow-storage-node" style={{ borderColor: storageConfig.residentialBattery.color }}>
              <Home size={18} />
              <span>{storageConfig.residentialBattery.label}</span>
              <strong>{formatMW(homeDischargeMW)} / {formatMW(homeChargeMW)}</strong>
              <small>Discharge / Charge</small>
            </div>
            <div className="flow-storage-node" style={{ borderColor: storageConfig.evBattery.color }}>
              <Car size={18} />
              <span>{storageConfig.evBattery.label}</span>
              <strong>{formatMW(evDischargeMW)} / {formatMW(evChargeMW)}</strong>
              <small>Discharge / Charge</small>
            </div>
          </div>
        </div>
      </div>

      <div className="energy-flow-footer">
        <span>Balance: {Math.abs(energyBalance) < 0.01 ? '\u2713 Balanced' : `\u0394 ${energyBalance.toFixed(2)} MW`}</span>
        <span>Imports: {formatMW(imports)}</span>
        <span>Exports: {formatMW(exports)}</span>
        <span>Curtailment: {formatMW(hour.curtailedGenerationMW)}</span>
      </div>
    </div>
  );
}
