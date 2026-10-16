/**
 * Three featured charts: Supply Mix (donut), Hourly Generation Profile, Total Load Profile.
 *
 * Supply Mix distinguishes owned generation, purchased power, grid imports,
 * rooftop solar, and battery discharge — no double-counting.
 * Battery discharge is NOT classified as newly generated energy.
 * Only consumer categories that exist in HourResult are shown.
 */

import {
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import type { HourResult } from '../simulation/types';

interface FeaturedChartsProps {
  hours: HourResult[];
  selectedHour: number;
}

// Color palette matching the rest of the dashboard
const SUPPLY_COLORS: Record<string, string> = {
  'Utility Solar': '#f59e0b',
  'Rooftop Solar': '#f97316',
  'Nuclear': '#8b5cf6',
  'Natural Gas': '#ef4444',
  'Wind': '#06b6d4',
  'Other Gen': '#78716c',
  'Purchased Power': '#0f766e',
  'Battery Discharge': '#22c55e',
  'Grid Imports': '#64748b',
};

function formatMW(value: number): string {
  return `${Math.round(value).toLocaleString()} MW`;
}

export function FeaturedCharts({ hours, selectedHour }: FeaturedChartsProps) {
  const hour = hours[selectedHour];
  if (!hour) return null;

  // ── Supply Mix (donut) ─────────────────────────────────────
  // Accurately accounts for all supply sources at the selected hour.
  const gridImports = Math.max(0, hour.netGridLoadMW);

  const supplySlices = [
    { name: 'Utility Solar', value: hour.utilitySolarMW },
    { name: 'Rooftop Solar', value: hour.rooftopSolarMW },
    { name: 'Nuclear', value: hour.nuclearMW },
    { name: 'Natural Gas', value: hour.naturalGasMW },
    { name: 'Wind', value: hour.windMW },
    { name: 'Other Gen', value: hour.otherGenerationMW },
    { name: 'Purchased Power', value: hour.purchasedPowerMW },
    { name: 'Battery Discharge', value: hour.batteryDischargeMW },
    { name: 'Grid Imports', value: gridImports },
  ].filter(s => s.value > 0.5); // hide negligible slices

  const totalSupply = supplySlices.reduce((sum, s) => sum + s.value, 0);

  // ── Generation Profile (stacked area, 24-hour) ────────────
  const genData = hours.map(h => ({
    hour: `${h.hour}:00`,
    hourNum: h.hour,
    'Natural Gas': h.naturalGasMW,
    'Nuclear': h.nuclearMW,
    'Utility Solar': h.utilitySolarMW,
    'Rooftop Solar': h.rooftopSolarMW,
    'Wind': h.windMW,
    'Other Gen': h.otherGenerationMW,
    'Purchased Power': h.purchasedPowerMW,
    'Grid Imports': Math.max(0, h.netGridLoadMW),
  }));

  // Only show series that have non-zero values
  const genSeries = [
    'Natural Gas', 'Nuclear', 'Utility Solar', 'Rooftop Solar',
    'Wind', 'Other Gen', 'Purchased Power', 'Grid Imports'
  ].filter(key => genData.some(d => (d as unknown as Record<string, number>)[key] > 0.5));

  // ── Load Profile (stacked area, 24-hour) ───────────────────
  // Only categories from the simulation model — no invented categories
  const loadData = hours.map(h => ({
    hour: `${h.hour}:00`,
    hourNum: h.hour,
    'Residential': h.residentialDemandMW,
    'AI Data Centers': h.aiLoadMW,
    'EV & Storage Charging': h.batteryChargeMW,
    'Grid Exports': h.gridExportMW,
  }));

  const LOAD_COLORS: Record<string, string> = {
    'Residential': '#3b82f6',
    'AI Data Centers': '#10b981',
    'EV & Storage Charging': '#f59e0b',
    'Grid Exports': '#64748b',
  };

  const loadSeries = [
    'Residential', 'AI Data Centers', 'EV & Storage Charging', 'Grid Exports'
  ].filter(key => loadData.some(d => (d as unknown as Record<string, number>)[key] > 0.5));

  return (
    <div className="featured-charts">
      {/* Supply Mix Donut */}
      <div className="featured-chart-card">
        <h3>Supply Mix at Selected Hour</h3>
        <div className="donut-wrapper">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={supplySlices}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={1}
                dataKey="value"
                stroke="none"
              >
                {supplySlices.map((s) => (
                  <Cell key={s.name} fill={SUPPLY_COLORS[s.name] ?? '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatMW(Number(value)), '']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center total overlay */}
          <div className="donut-center">
            <div className="donut-total">{formatMW(totalSupply)}</div>
            <div className="donut-label">Total Supply</div>
          </div>
        </div>
        {/* Compact legend */}
        <div className="donut-legend">
          {supplySlices.map(s => (
            <div key={s.name} className="donut-legend-item">
              <span className="donut-swatch" style={{ background: SUPPLY_COLORS[s.name] ?? '#94a3b8' }} />
              <span className="donut-legend-name">{s.name}</span>
              <span className="donut-legend-value">{formatMW(s.value)} ({Math.round((s.value / totalSupply) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Generation Profile */}
      <div className="featured-chart-card">
        <h3>Hourly Generation Profile</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={genData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10 }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`}
              width={40}
            />
            <Tooltip
              formatter={(value) => [formatMW(Number(value)), '']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {genSeries.map(key => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="gen"
                fill={SUPPLY_COLORS[key] ?? '#94a3b8'}
                stroke={SUPPLY_COLORS[key] ?? '#94a3b8'}
                fillOpacity={0.7}
              />
            ))}
            <ReferenceLine
              x={`${selectedHour}:00`}
              stroke="#333"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              label={{ value: 'Now', position: 'top', fontSize: 10, fill: '#333' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Total Load Profile */}
      <div className="featured-chart-card">
        <h3>Total Load Profile</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={loadData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10 }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`}
              width={40}
            />
            <Tooltip
              formatter={(value) => [formatMW(Number(value)), '']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {loadSeries.map(key => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="load"
                fill={LOAD_COLORS[key] ?? '#94a3b8'}
                stroke={LOAD_COLORS[key] ?? '#94a3b8'}
                fillOpacity={0.7}
              />
            ))}
            <ReferenceLine
              x={`${selectedHour}:00`}
              stroke="#333"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              label={{ value: 'Now', position: 'top', fontSize: 10, fill: '#333' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
