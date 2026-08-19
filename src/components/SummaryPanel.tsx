/**
 * Summary panel displaying key simulation metrics
 * Shows peak grid load, DER contributions, and capacity released
 */


import { Tooltip } from './Tooltip';

interface SummaryPanelProps {
  summary: {
    peakNetGridLoadMW: number;
    totalDistributedSolarMWh: number;
    totalBatteryDispatchMWh: number;
    minimumSOCMWh: number;
    terminalSOCMWh: number;
    minimumSOCPercent: number;
    terminalSOCPercent: number;
    effectiveGridCapacityReleasedMW: number;
    equivalentAICampuses500MW: number;
    equivalentAICampuses1GW: number;
  };
  operatingMode: 'traditional' | 'coordinated';
}

const CAMPUS_DISCLAIMER =
  'Campus equivalents are illustrative comparisons based on modeled peak net-grid-load reduction. ' +
  'They do not imply guaranteed datacenter interconnection capacity or eliminate the need for ' +
  'generation, transmission, distribution, and reliability studies.';

function capacityStatusLabel(releasedMW: number): string {
  if (releasedMW >= 1000) return 'Gigawatt-scale modeled impact';
  if (releasedMW >= 500)  return 'AI-campus-scale impact';
  if (releasedMW >= 250)  return 'Meaningful infrastructure-scale reduction';
  if (releasedMW >= 100)  return 'Modest peak reduction';
  return 'Limited capacity impact';
}

function campus500Tooltip(equivalents: number, releasedMW: number): string {
  if (equivalents === 0) {
    return 'No equivalent 500-MW AI campus is supported under the current scenario. ' +
      'The modeled solar, EV, and battery resources do not reduce peak net grid load enough to release 500 MW of effective capacity. ' +
      CAMPUS_DISCLAIMER;
  }
  return `${equivalents.toFixed(1)} equivalent 500-MW AI campus${equivalents !== 1 ? 'es' : ''} based on ` +
    `${releasedMW.toFixed(0)} MW Grid Capacity Released ÷ 500 MW assumed campus size. ` +
    CAMPUS_DISCLAIMER;
}

function campus1GWTooltip(equivalents: number, releasedMW: number): string {
  if (equivalents === 0) {
    return 'No equivalent 1-GW AI campus is supported under the current scenario. ' +
      'The modeled coordinated resources do not reduce peak net grid load enough to release 1,000 MW of effective capacity. ' +
      CAMPUS_DISCLAIMER;
  }
  return `${equivalents.toFixed(1)} equivalent 1-GW AI campus${equivalents !== 1 ? 'es' : ''} based on ` +
    `${releasedMW.toFixed(0)} MW Grid Capacity Released ÷ 1,000 MW assumed campus size. ` +
    CAMPUS_DISCLAIMER;
}

export function SummaryPanel({ summary, operatingMode }: SummaryPanelProps) {
  return (
    <div className="summary-panel">
      <h2>Simulation Results</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>
            <Tooltip term="Net Grid Load" definition="Electricity that must still be supplied by the grid after modeled solar, batteries, and other distributed resources are accounted for">
              Peak Net Grid Load
            </Tooltip>
          </h3>
          <div className="metric-value">
            <Tooltip term="MW" definition="Megawatt, a unit of instantaneous electrical power">
              {summary.peakNetGridLoadMW.toFixed(1)} MW
            </Tooltip>
          </div>
          <div className="metric-label">Maximum grid demand</div>
        </div>

        <div className="metric-card">
          <h3>Distributed Solar</h3>
          <div className="metric-value">
            <Tooltip term="MWh" definition="Megawatt-hour, a unit of electrical energy">
              {summary.totalDistributedSolarMWh.toFixed(1)} MWh
            </Tooltip>
          </div>
          <div className="metric-label">Daily rooftop solar generation</div>
        </div>

        <div className="metric-card">
          <h3>Battery Dispatch</h3>
          <div className="metric-value">
            <Tooltip term="MWh" definition="Megawatt-hour, a unit of electrical energy">
              {summary.totalBatteryDispatchMWh.toFixed(1)} MWh
            </Tooltip>
          </div>
          <div className="metric-label">Total battery discharge</div>
        </div>

        <div className="metric-card">
          <h3>
            <Tooltip term="SOC" definition="State of Charge - the amount of energy stored in a battery relative to its capacity">
              Minimum SOC
            </Tooltip>
          </h3>
          <div className="metric-value">{(summary.minimumSOCPercent * 100).toFixed(1)}%</div>
          <div className="metric-label">
            <Tooltip term="MWh" definition="Megawatt-hour, a unit of electrical energy">
              {summary.minimumSOCMWh.toFixed(1)} MWh
            </Tooltip>
          </div>
        </div>

        <div className="metric-card">
          <h3>
            <Tooltip term="SOC" definition="State of Charge - the amount of energy stored in a battery relative to its capacity">
              Terminal SOC
            </Tooltip>
          </h3>
          <div className="metric-value">{(summary.terminalSOCPercent * 100).toFixed(1)}%</div>
          <div className="metric-label">
            <Tooltip term="MWh" definition="Megawatt-hour, a unit of electrical energy">
              {summary.terminalSOCMWh.toFixed(1)} MWh
            </Tooltip>
          </div>
        </div>

        {operatingMode === 'coordinated' && (
          <>
            <div className="metric-card highlight">
              <h3>Grid Capacity Released</h3>
              <div className="metric-value">
                <Tooltip term="MW" definition="Megawatt, a unit of instantaneous electrical power">
                  {summary.effectiveGridCapacityReleasedMW.toFixed(1)} MW
                </Tooltip>
              </div>
              <div className="metric-label">Peak reduction vs Traditional</div>
              <div className="metric-status">{capacityStatusLabel(summary.effectiveGridCapacityReleasedMW)}</div>
            </div>

            <div className="metric-card highlight">
              <h3>
                <Tooltip
                  term="500-MW Campus Equivalents"
                  definition={campus500Tooltip(summary.equivalentAICampuses500MW, summary.effectiveGridCapacityReleasedMW)}
                >
                  500-MW Campus Equivalents
                </Tooltip>
              </h3>
              <div className="metric-value">{summary.equivalentAICampuses500MW.toFixed(1)}</div>
              <div className="metric-label">Grid Capacity Released ÷ 500 MW</div>
            </div>

            <div className="metric-card highlight">
              <h3>
                <Tooltip
                  term="1-GW Campus Equivalents"
                  definition={campus1GWTooltip(summary.equivalentAICampuses1GW, summary.effectiveGridCapacityReleasedMW)}
                >
                  1-GW Campus Equivalents
                </Tooltip>
              </h3>
              <div className="metric-value">{summary.equivalentAICampuses1GW.toFixed(1)}</div>
              <div className="metric-label">Grid Capacity Released ÷ 1,000 MW</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}