/**
 * Financial Impact Analysis dashboard.
 *
 * Two separate perspectives:
 *   1. AI Data Center Economics — customer electricity bill.
 *   2. Utility / Grid Economics  — generation operating costs.
 *
 * These use different rate bases and are never combined.
 * Avoided peak-capacity value is reported separately from operating-cost savings.
 */

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import type { HourResult } from '../simulation/types';
import type { FinancialAssumptions } from '../simulation/financialTypes';
import {
  calculateCustomerFinancials,
  calculateUtilityFinancials,
  compareFinancials,
  computeGasVariableCost,
} from '../simulation/financial';
import { ChevronDown, ChevronRight, DollarSign } from 'lucide-react';

// ---------------------------------------------------------------------------
// Currency formatting
// ---------------------------------------------------------------------------

function fmtCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '−' : '';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function fmtRate(value: number): string {
  return `$${value.toFixed(2)}/MWh`;
}

function fmtMW(value: number): string {
  return `${value.toFixed(1)} MW`;
}

function fmtMWh(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M MWh`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K MWh`;
  return `${value.toFixed(0)} MWh`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FinancialDashboardProps {
  hours: HourResult[];
  traditionalHours: HourResult[] | null;
  operatingMode: 'traditional' | 'coordinated';
  assumptions: FinancialAssumptions;
  onAssumptionsChange: (assumptions: FinancialAssumptions) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FinancialDashboard({
  hours,
  traditionalHours,
  operatingMode,
  assumptions,
  onAssumptionsChange,
}: FinancialDashboardProps) {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const customer = calculateCustomerFinancials(hours, assumptions);
  const utility = calculateUtilityFinancials(hours, assumptions);

  const isCoordinated = operatingMode === 'coordinated' && traditionalHours !== null;
  const comparison = isCoordinated
    ? compareFinancials(traditionalHours!, hours, assumptions)
    : null;

  // Peak net grid import for reconciliation with Grid Capacity Released
  const peakNetGridImport = Math.max(...hours.map(h => h.netGridLoadMW), 0);
  const tradPeakNetGridImport = traditionalHours
    ? Math.max(...traditionalHours.map(h => h.netGridLoadMW), 0)
    : null;

  // Chart data
  const gasVarCost = computeGasVariableCost(
    assumptions.utility.gasPricePerMMBtu,
    assumptions.utility.gasHeatRateBtuPerKWh,
    assumptions.utility.gasVariableOMPerMWh
  );

  const costBreakdown = [
    { name: 'Natural Gas', cost: utility.gasCost / 1e6 },
    { name: 'Nuclear', cost: utility.nuclearCost / 1e6 },
    { name: 'Solar', cost: utility.solarCost / 1e6 },
    { name: 'Wind', cost: utility.windCost / 1e6 },
    { name: 'Other Gen', cost: utility.otherGenCost / 1e6 },
    { name: 'Purchased', cost: utility.purchasedPowerCost / 1e6 },
    { name: 'Battery', cost: utility.batteryCost / 1e6 },
    { name: 'Imports', cost: utility.gridImportCost / 1e6 },
  ].filter(d => d.cost > 0);

  const comparisonChartData = comparison ? [
    {
      name: 'Customer Cost',
      Traditional: comparison.traditional.customer.totalAnnualCost / 1e6,
      Coordinated: comparison.coordinated.customer.totalAnnualCost / 1e6,
    },
    {
      name: 'Utility Cost',
      Traditional: comparison.traditional.utility.totalSystemCost / 1e6,
      Coordinated: comparison.coordinated.utility.totalSystemCost / 1e6,
    },
  ] : [];

  // Utility savings delta for the summary card
  const utilitySavingsDelta = comparison?.deltas.utilityCostDelta ?? null;

  return (
    <div className="financial-dashboard">
      <h2>
        <DollarSign size={18} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
        Financial Impact Analysis
      </h2>
      <p className="financial-disclaimer">
        Illustrative estimates annualizing one representative 24-hour simulation (daily x 365).
        Not actual FPL bills, rate forecasts, or operating-cost commitments.
      </p>

      {/* ── Summary metric cards ──────────────────────────────── */}
      <div className="fin-summary-row">
        <div className="fin-summary-card">
          <div className="fin-summary-label">AI Data Center Annual Bill</div>
          <div className="fin-summary-value">{fmtCurrency(customer.totalAnnualCost)}</div>
          <div className="fin-summary-sub">{fmtMWh(customer.annualEnergyMWh)} · {fmtRate(customer.effectiveRatePerMWh)} blended</div>
        </div>
        <div className="fin-summary-card">
          <div className="fin-summary-label">Utility Annual Operating Cost</div>
          <div className="fin-summary-value">{fmtCurrency(utility.totalSystemCost)}</div>
          <div className="fin-summary-sub">{fmtRate(utility.weightedAvgCostPerMWh)} weighted avg · {fmtMW(utility.peakSystemDemandMW)} peak</div>
        </div>
        {isCoordinated && utilitySavingsDelta !== null ? (
          <div className={`fin-summary-card ${utilitySavingsDelta < -0.01 ? 'fin-card-savings' : utilitySavingsDelta > 0.01 ? 'fin-card-increase' : 'fin-card-neutral'}`}>
            <div className="fin-summary-label">
              {utilitySavingsDelta < -0.01 ? 'Annualized Utility Savings' : utilitySavingsDelta > 0.01 ? 'Annualized Utility Increase' : 'Utility Cost Change'}
            </div>
            <div className="fin-summary-value">
              {Math.abs(utilitySavingsDelta) < 0.01 ? 'No change' : `${fmtCurrency(Math.abs(utilitySavingsDelta))}/yr`}
            </div>
            <div className="fin-summary-sub">Coordinated vs. traditional operating cost</div>
          </div>
        ) : (
          <div className="fin-summary-card fin-card-neutral">
            <div className="fin-summary-label">Illustrative Capacity Valuation</div>
            <div className="fin-summary-value">{fmtCurrency(utility.peakCapacityValue)}</div>
            <div className="fin-summary-sub">Not avoided cost — {fmtMW(utility.peakSystemDemandMW)} × ${assumptions.utility.peakingCapacityCostPerKWYear}/kW-yr</div>
          </div>
        )}
      </div>

      {/* ── Traditional vs. Coordinated comparison (table left, chart right) */}
      {isCoordinated && comparison && (
        <div className="financial-comparison-row">
          <div className="financial-comparison">
            <h3>Traditional vs. Coordinated</h3>
            <p className="financial-section-note">
              Signed differences. Avoided capacity value is separate from operating-cost savings.
            </p>

            <table className="financial-table financial-comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Trad.</th>
                  <th>Coord.</th>
                  <th>Diff.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Customer Cost</td>
                  <td>{fmtCurrency(comparison.traditional.customer.totalAnnualCost)}</td>
                  <td>{fmtCurrency(comparison.coordinated.customer.totalAnnualCost)}</td>
                  <td className={comparison.deltas.customerCostDelta < 0 ? 'delta-negative' : comparison.deltas.customerCostDelta > 0 ? 'delta-positive' : ''}>
                    {comparison.deltas.customerCostDelta === 0 ? 'No change' : fmtCurrency(comparison.deltas.customerCostDelta)}
                  </td>
                </tr>
                <tr>
                  <td>Utility Cost</td>
                  <td>{fmtCurrency(comparison.traditional.utility.totalSystemCost)}</td>
                  <td>{fmtCurrency(comparison.coordinated.utility.totalSystemCost)}</td>
                  <td className={comparison.deltas.utilityCostDelta < 0 ? 'delta-negative' : comparison.deltas.utilityCostDelta > 0 ? 'delta-positive' : ''}>
                    {fmtCurrency(comparison.deltas.utilityCostDelta)}
                  </td>
                </tr>
                <tr>
                  <td>Peak Demand</td>
                  <td>{fmtMW(comparison.traditional.utility.peakSystemDemandMW)}</td>
                  <td>{fmtMW(comparison.coordinated.utility.peakSystemDemandMW)}</td>
                  <td className={comparison.deltas.peakDemandDeltaMW < 0 ? 'delta-negative' : comparison.deltas.peakDemandDeltaMW > 0 ? 'delta-positive' : ''}>
                    {comparison.deltas.peakDemandDeltaMW === 0
                      ? 'No change'
                      : `${comparison.deltas.peakDemandDeltaMW > 0 ? '+' : ''}${comparison.deltas.peakDemandDeltaMW.toFixed(1)} MW`}
                  </td>
                </tr>
                {tradPeakNetGridImport !== null && (
                  <tr>
                    <td>Peak Grid Import</td>
                    <td>{fmtMW(tradPeakNetGridImport)}</td>
                    <td>{fmtMW(peakNetGridImport)}</td>
                    {(() => {
                      const delta = peakNetGridImport - tradPeakNetGridImport;
                      return (
                        <td className={delta < -0.05 ? 'delta-negative' : delta > 0.05 ? 'delta-positive' : ''}>
                          {Math.abs(delta) < 0.05
                            ? 'No change'
                            : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} MW`}
                        </td>
                      );
                    })()}
                  </tr>
                )}
                <tr className="financial-capacity-row">
                  <td>Avoided Capacity Value</td>
                  <td colSpan={2} className="financial-section-note" style={{ textAlign: 'center', fontSize: '0.65rem' }}>
                    Separate — not realized savings
                  </td>
                  <td className={comparison.deltas.avoidedCapacityValue > 0 ? 'delta-negative' : ''}>
                    {comparison.deltas.avoidedCapacityValue > 0
                      ? fmtCurrency(comparison.deltas.avoidedCapacityValue) + '/yr'
                      : 'None'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Compact delta chart on the right */}
          <div className="financial-comparison-chart">
            <h4>Operating Cost Impact ($M/yr)</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={[
                  {
                    name: 'Customer',
                    delta: comparison.deltas.customerCostDelta / 1e6,
                  },
                  {
                    name: 'Utility',
                    delta: comparison.deltas.utilityCostDelta / 1e6,
                  },
                ]}
                layout="vertical"
                margin={{ left: 60, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => `${v >= 0 ? '+' : ''}$${v.toFixed(0)}M`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  formatter={(value) => {
                    const v = Number(value);
                    return [`${v >= 0 ? '+' : ''}$${v.toFixed(2)}M/yr`, 'Change'];
                  }}
                />
                <Bar
                  dataKey="delta"
                  fill="#667eea"
                  radius={[0, 4, 4, 0]}
                  label={(props: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
                    const x = Number(props.x ?? 0);
                    const y = Number(props.y ?? 0);
                    const w = Number(props.width ?? 0);
                    const h = Number(props.height ?? 0);
                    const value = Number(props.value ?? 0);
                    return (
                      <text
                        x={x + w + (value >= 0 ? 4 : -4)}
                        y={y + h / 2}
                        fill={value < 0 ? '#16a34a' : value > 0 ? '#dc2626' : '#64748b'}
                        fontSize={11}
                        fontWeight={700}
                        textAnchor={value >= 0 ? 'start' : 'end'}
                        dominantBaseline="middle"
                      >
                        {value === 0 ? 'No change' : `${value >= 0 ? '+' : ''}$${value.toFixed(1)}M`}
                      </text>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="financial-section-note" style={{ marginTop: '0.25rem', textAlign: 'center' }}>
              Negative = coordinated saves · Positive = coordinated costs more
            </p>
          </div>
        </div>
      )}

      {/* ── Detail panels: DC Economics + Utility Economics ────── */}
      <div className="financial-perspectives">
        <div className="financial-section">
          <h3>AI Data Center Economics</h3>
          <p className="financial-section-note">
            Illustrative GSLD-2 tariff. Demand charges use the data center's own metered demand ({fmtMW(customer.billingDemandMW)}).
          </p>
          <table className="financial-table">
            <tbody>
              <tr><td>Annual Energy</td><td className="financial-value">{fmtMWh(customer.annualEnergyMWh)}</td></tr>
              <tr><td>Energy Cost</td><td className="financial-value">{fmtCurrency(customer.annualEnergyCost)}</td></tr>
              <tr><td>Demand Charges</td><td className="financial-value">{fmtCurrency(customer.annualDemandCharges)}</td></tr>
              <tr><td>Base Charges</td><td className="financial-value">{fmtCurrency(customer.annualBaseCharges)}</td></tr>
              <tr className="financial-total-row"><td>Total Annual Cost</td><td className="financial-value">{fmtCurrency(customer.totalAnnualCost)}</td></tr>
              <tr><td>Effective Rate</td><td className="financial-value">{fmtRate(customer.effectiveRatePerMWh)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="financial-section">
          <h3>Utility / Grid Economics</h3>
          <p className="financial-section-note">
            System operating costs. Rooftop solar is customer-sited. Battery cycling = throughput O&M only.
          </p>
          <table className="financial-table">
            <tbody>
              {utility.gasCost > 0 && <tr><td>Natural Gas</td><td className="financial-value">{fmtCurrency(utility.gasCost)}</td></tr>}
              {utility.nuclearCost > 0 && <tr><td>Nuclear</td><td className="financial-value">{fmtCurrency(utility.nuclearCost)}</td></tr>}
              {utility.solarCost > 0 && <tr><td>Solar</td><td className="financial-value">{fmtCurrency(utility.solarCost)}</td></tr>}
              {utility.windCost > 0 && <tr><td>Wind</td><td className="financial-value">{fmtCurrency(utility.windCost)}</td></tr>}
              {utility.otherGenCost > 0 && <tr><td>Other Generation</td><td className="financial-value">{fmtCurrency(utility.otherGenCost)}</td></tr>}
              {utility.purchasedPowerCost > 0 && <tr><td>Purchased Power</td><td className="financial-value">{fmtCurrency(utility.purchasedPowerCost)}</td></tr>}
              {utility.batteryCost > 0 && <tr><td>Battery Cycling</td><td className="financial-value">{fmtCurrency(utility.batteryCost)}</td></tr>}
              {utility.gridImportCost > 0 && <tr><td>Grid Imports</td><td className="financial-value">{fmtCurrency(utility.gridImportCost)}</td></tr>}
              {utility.gridExportRevenue > 0 && <tr><td>Export Revenue</td><td className="financial-value" style={{ color: '#16a34a' }}>-{fmtCurrency(utility.gridExportRevenue)}</td></tr>}
              <tr className="financial-total-row"><td>Total System Cost</td><td className="financial-value">{fmtCurrency(utility.totalSystemCost)}</td></tr>
              <tr><td>Weighted Avg Cost</td><td className="financial-value">{fmtRate(utility.weightedAvgCostPerMWh)}</td></tr>
              <tr className="financial-capacity-row">
                <td>Capacity Valuation</td>
                <td className="financial-value">{fmtCurrency(utility.peakCapacityValue)}</td>
              </tr>
            </tbody>
          </table>
          <div className="financial-section-note" style={{ marginTop: '0.3rem' }}>
            Capacity valuation is illustrative — not avoided cost or realized savings.
            Based on {fmtMW(utility.peakSystemDemandMW)} peak x ${assumptions.utility.peakingCapacityCostPerKWYear}/kW-yr.
          </div>
        </div>
      </div>

      {/* ── Collapsible detailed charts ───────────────────────── */}
      <div className="financial-assumptions-toggle">
        <button
          className="assumptions-collapse-btn"
          onClick={() => setShowCharts(!showCharts)}
          aria-expanded={showCharts}
        >
          {showCharts ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          Detailed Financial Charts
        </button>
      </div>
      {showCharts && (
        <div className="financial-charts-panel">
          {costBreakdown.length > 0 && (
            <div className="financial-chart-section">
              <h4>Annual Utility Cost by Source ($M)</h4>
              <ResponsiveContainer width="100%" height={Math.max(120, costBreakdown.length * 32 + 40)}>
                <BarChart data={costBreakdown} layout="vertical" margin={{ left: 70, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v: number) => `$${v.toFixed(0)}M`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={65} tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(value) => [`$${Number(value).toFixed(2)}M`, 'Annual Cost']} />
                  <Bar dataKey="cost" fill="#667eea" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {isCoordinated && comparisonChartData.length > 0 && (
            <div className="financial-chart-section">
              <h4>Annual Cost Comparison ($M)</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={comparisonChartData} margin={{ left: 16, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: number) => `$${v.toFixed(0)}M`} tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(value) => [`$${Number(value).toFixed(2)}M`, '']} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Traditional" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Coordinated" fill="#667eea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── Collapsible financial assumptions ──────────────────── */}
      <div className="financial-assumptions-toggle">
        <button
          className="assumptions-collapse-btn"
          onClick={() => setShowAssumptions(!showAssumptions)}
          aria-expanded={showAssumptions}
        >
          {showAssumptions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          Financial Assumptions
        </button>
      </div>
      {showAssumptions && (
        <FinancialAssumptionsEditor
          assumptions={assumptions}
          onChange={onAssumptionsChange}
          gasVarCost={gasVarCost}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Financial Assumptions Editor (inline, collapsible)
// ---------------------------------------------------------------------------

function FinancialAssumptionsEditor({
  assumptions,
  onChange,
  gasVarCost,
}: {
  assumptions: FinancialAssumptions;
  onChange: (a: FinancialAssumptions) => void;
  gasVarCost: number;
}) {
  const updateCustomer = (field: string, value: number) => {
    onChange({
      ...assumptions,
      customer: { ...assumptions.customer, [field]: value },
    });
  };

  const updateUtility = (field: string, value: number) => {
    onChange({
      ...assumptions,
      utility: { ...assumptions.utility, [field]: value },
    });
  };

  return (
    <div className="financial-assumptions-panel">
      <p className="financial-disclaimer">
        All assumptions are illustrative and user-editable. Sources are documented in the project.
      </p>

      <div className="financial-assumptions-grid">
        <div className="fin-assumption-group">
          <h4>Customer Tariff (GSLD-2 Illustrative)</h4>
          <label>
            All-in Energy Rate ($/MWh)
            <input type="number" value={assumptions.customer.energyRatePerMWh}
              onChange={(e) => updateCustomer('energyRatePerMWh', parseFloat(e.target.value) || 0)} step="1" min="0" />
          </label>
          <label>
            Demand Charge ($/kW/month)
            <input type="number" value={assumptions.customer.demandChargePerKWMonth}
              onChange={(e) => updateCustomer('demandChargePerKWMonth', parseFloat(e.target.value) || 0)} step="0.5" min="0" />
          </label>
          <label>
            Monthly Base Charge ($)
            <input type="number" value={assumptions.customer.monthlyBaseCharge}
              onChange={(e) => updateCustomer('monthlyBaseCharge', parseFloat(e.target.value) || 0)} step="10" min="0" />
          </label>
        </div>

        <div className="fin-assumption-group">
          <h4>Natural Gas</h4>
          <label>
            Gas Price ($/MMBtu)
            <input type="number" value={assumptions.utility.gasPricePerMMBtu}
              onChange={(e) => updateUtility('gasPricePerMMBtu', parseFloat(e.target.value) || 0)} step="0.25" min="0" />
          </label>
          <label>
            Heat Rate (Btu/kWh)
            <input type="number" value={assumptions.utility.gasHeatRateBtuPerKWh}
              onChange={(e) => updateUtility('gasHeatRateBtuPerKWh', parseFloat(e.target.value) || 0)} step="100" min="0" />
          </label>
          <label>
            Variable O&M ($/MWh)
            <input type="number" value={assumptions.utility.gasVariableOMPerMWh}
              onChange={(e) => updateUtility('gasVariableOMPerMWh', parseFloat(e.target.value) || 0)} step="0.5" min="0" />
          </label>
          <div className="fin-computed-value">
            Computed gas cost: {fmtRate(gasVarCost)}
          </div>
        </div>

        <div className="fin-assumption-group">
          <h4>Other Generation Costs</h4>
          <label>
            Nuclear ($/MWh)
            <input type="number" value={assumptions.utility.nuclearVariableCostPerMWh}
              onChange={(e) => updateUtility('nuclearVariableCostPerMWh', parseFloat(e.target.value) || 0)} step="1" min="0" />
          </label>
          <label>
            Other Generation ($/MWh)
            <input type="number" value={assumptions.utility.otherGenVariableCostPerMWh}
              onChange={(e) => updateUtility('otherGenVariableCostPerMWh', parseFloat(e.target.value) || 0)} step="1" min="0" />
          </label>
          <label>
            Purchased Power ($/MWh)
            <input type="number" value={assumptions.utility.purchasedPowerRatePerMWh}
              onChange={(e) => updateUtility('purchasedPowerRatePerMWh', parseFloat(e.target.value) || 0)} step="1" min="0" />
          </label>
        </div>

        <div className="fin-assumption-group">
          <h4>Grid & Storage</h4>
          <label>
            Battery O&M ($/MWh throughput)
            <input type="number" value={assumptions.utility.batteryVariableCostPerMWh}
              onChange={(e) => updateUtility('batteryVariableCostPerMWh', parseFloat(e.target.value) || 0)} step="0.5" min="0" />
          </label>
          <label>
            Grid Import Rate ($/MWh)
            <input type="number" value={assumptions.utility.gridImportRatePerMWh}
              onChange={(e) => updateUtility('gridImportRatePerMWh', parseFloat(e.target.value) || 0)} step="1" min="0" />
          </label>
          <label>
            Grid Export Rate ($/MWh)
            <input type="number" value={assumptions.utility.gridExportRatePerMWh}
              onChange={(e) => updateUtility('gridExportRatePerMWh', parseFloat(e.target.value) || 0)} step="1" min="0" />
          </label>
          <label>
            Peaking Capacity ($/kW-yr)
            <input type="number" value={assumptions.utility.peakingCapacityCostPerKWYear}
              onChange={(e) => updateUtility('peakingCapacityCostPerKWYear', parseFloat(e.target.value) || 0)} step="10" min="0" />
          </label>
        </div>
      </div>
    </div>
  );
}
