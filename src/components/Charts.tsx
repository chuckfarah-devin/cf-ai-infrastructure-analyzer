/**
 * Chart components for visualizing simulation results
 * Uses Recharts for interactive data visualization
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface HourResult {
  hour: number;
  residentialDemandMW: number;
  aiLoadMW: number;
  totalDemandMW: number;
  rooftopSolarMW: number;
  utilitySolarMW: number;
  totalSolarMW: number;
  batteryChargeMW: number;
  batteryDischargeMW: number;
  batteryStateOfChargeMWh: number;
  netGridLoadMW: number;
  batteryDispatchMW: number;
  solarContributionMW: number;
  gridExportMW: number;
}

interface ChartsProps {
  hours: HourResult[];
  operatingMode: 'traditional' | 'coordinated';
}

export function Charts({ hours, operatingMode }: ChartsProps) {
  const chartData = hours.map(h => ({
    hour: `Hour ${h.hour}`,
    residentialDemand: h.residentialDemandMW,
    aiLoad: h.aiLoadMW,
    totalDemand: h.totalDemandMW,
    rooftopSolar: h.rooftopSolarMW,
    utilitySolar: h.utilitySolarMW,
    totalSolar: h.totalSolarMW,
    batteryCharge: h.batteryChargeMW,
    batteryDischarge: h.batteryDischargeMW,
    batterySOC: h.batteryStateOfChargeMWh,
    netGridLoad: h.netGridLoadMW,
    gridExport: h.gridExportMW
  }));

  return (
    <div className="charts-container">
      <h2>Hourly Simulation Results</h2>

      <div className="chart-section">
        <h3>Demand vs Solar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="residentialDemand"
              stackId="demand"
              name="Residential Demand"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="aiLoad"
              stackId="demand"
              name="AI Load"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="rooftopSolar"
              stackId="solar"
              name="Rooftop Solar"
              fill="#ffc658"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="utilitySolar"
              stackId="solar"
              name="Utility Solar"
              fill="#ff7300"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Battery State of Charge</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="batterySOC"
              name="Battery SOC (MWh)"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Battery Charge/Discharge</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="batteryCharge" name="Charge (MW)" fill="#82ca9d" />
            <Bar dataKey="batteryDischarge" name="Discharge (MW)" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Net Grid Load</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="netGridLoad"
              name="Net Grid Load (MW)"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            {operatingMode === 'traditional' && (
              <Area
                type="monotone"
                dataKey="gridExport"
                name="Grid Export (MW)"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}