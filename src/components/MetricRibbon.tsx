/**
 * Horizontal ribbon of compact metric cards showing current-hour values.
 * Only uses data from the existing HourResult — no invented categories.
 */

import type { HourResult } from '../simulation/types';

interface MetricRibbonProps {
  hour: HourResult;
  prevHour: HourResult | null;
  nuclearCapacityMW: number;
}

function formatMW(value: number): string {
  return `${Math.round(value).toLocaleString()}`;
}

function pctOfGen(value: number, total: number): string {
  if (total <= 0) return '';
  return `${Math.round((value / total) * 100)}% of supply`;
}

function changeBadge(current: number, prev: number | null): { text: string; className: string } | null {
  if (prev === null || prev === 0) return null;
  const pct = ((current - prev) / Math.abs(prev)) * 100;
  if (Math.abs(pct) < 0.5) return null;
  return {
    text: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}% vs prev hr`,
    className: pct > 0 ? 'ribbon-change-up' : 'ribbon-change-down',
  };
}

export function MetricRibbon({ hour, prevHour, nuclearCapacityMW }: MetricRibbonProps) {
  // Total supply = owned generation + purchased power + battery discharge + grid imports
  const totalSupply =
    hour.totalGenerationMW + hour.purchasedPowerMW + hour.batteryDischargeMW + Math.max(0, hour.netGridLoadMW);

  const gridImports = Math.max(0, hour.netGridLoadMW);
  const batteryNet = hour.batteryDischargeMW - hour.batteryChargeMW;
  const nuclearIncluded = nuclearCapacityMW > 0;

  const metrics = [
    {
      label: 'Total Supply',
      value: formatMW(totalSupply),
      unit: 'MW',
      sub: 'Serving modeled demand',
      color: '#4a5ea8',
      change: changeBadge(totalSupply, prevHour ? prevHour.totalGenerationMW + prevHour.purchasedPowerMW + prevHour.batteryDischargeMW + Math.max(0, prevHour.netGridLoadMW) : null),
    },
    {
      label: 'Total Demand',
      value: formatMW(hour.totalDemandMW),
      unit: 'MW',
      sub: 'Grid load',
      color: '#3b82f6',
      change: changeBadge(hour.totalDemandMW, prevHour?.totalDemandMW ?? null),
    },
    {
      label: 'Solar Output',
      value: formatMW(hour.totalSolarMW),
      unit: 'MW',
      sub: pctOfGen(hour.totalSolarMW, totalSupply),
      color: '#f59e0b',
      change: changeBadge(hour.totalSolarMW, prevHour?.totalSolarMW ?? null),
    },
    {
      label: 'Nuclear Output',
      value: nuclearIncluded ? formatMW(hour.nuclearMW) : 'Not included',
      unit: nuclearIncluded ? 'MW' : '',
      sub: nuclearIncluded ? pctOfGen(hour.nuclearMW, totalSupply) : 'in selected preset',
      color: '#8b5cf6',
      change: nuclearIncluded ? changeBadge(hour.nuclearMW, prevHour?.nuclearMW ?? null) : null,
    },
    {
      label: 'Gas Output',
      value: formatMW(hour.naturalGasMW),
      unit: 'MW',
      sub: pctOfGen(hour.naturalGasMW, totalSupply),
      color: '#ef4444',
      change: changeBadge(hour.naturalGasMW, prevHour?.naturalGasMW ?? null),
    },
    {
      label: 'Wind Output',
      value: formatMW(hour.windMW),
      unit: 'MW',
      sub: pctOfGen(hour.windMW, totalSupply),
      color: '#06b6d4',
      change: null,
    },
    {
      label: 'Battery (Net)',
      value: `${batteryNet >= 0 ? '+' : ''}${formatMW(batteryNet)}`,
      unit: 'MW',
      sub: batteryNet > 0 ? 'Discharging' : batteryNet < 0 ? 'Charging' : 'Idle',
      color: '#22c55e',
      change: null,
    },
    {
      label: 'Grid Imports',
      value: formatMW(gridImports),
      unit: 'MW',
      sub: pctOfGen(gridImports, totalSupply),
      color: '#64748b',
      change: null,
    },
  ].filter(m => !(m.label === 'Wind Output' && hour.windMW === 0));

  return (
    <div className="metric-ribbon">
      {metrics.map((m) => (
        <div key={m.label} className="ribbon-card" style={{ borderTopColor: m.color }}>
          <div className="ribbon-label">{m.label}</div>
          <div className="ribbon-value">
            <span className="ribbon-number">{m.value}</span>
            <span className="ribbon-unit">{m.unit}</span>
          </div>
          {m.sub && <div className="ribbon-sub">{m.sub}</div>}
          {m.change && (
            <div className={`ribbon-change ${m.change.className}`}>{m.change.text}</div>
          )}
        </div>
      ))}
    </div>
  );
}
