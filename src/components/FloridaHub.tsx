/**
 * Florida geographic hub with FPL service territory overlay.
 *
 * State boundary: U.S. Census Bureau cartographic boundary (states-10m.json,
 * 2017 edition via us-atlas v3). FIPS 12, 354-point mainland + Keys.
 *
 * FPL territory: Approximate county-based overlay. FPL serves 43 of Florida's
 * 67 counties. Sub-county boundaries are not publicly available in
 * machine-readable form. Labeled "Approximate."
 *
 * Sources:
 *   - Census Bureau TIGER/Line cartographic boundaries
 *   - FPL Transmission Service Territory (consent-agreement-map.pdf)
 *   - Florida PSC General Service Area Map, August 19, 2024
 */

import {
  FLORIDA_MAINLAND_PATH,
  FLORIDA_KEYS_PATH,
  FPL_NORTHWEST_PATH,
  FPL_MAIN_PATH,
  FLORIDA_VIEWBOX,
  TOWER_POSITION,
} from '../assets/florida-outline';

interface FloridaHubProps {
  totalLoadMW: number;
  batteryChargeMW: number;
  selectedHour: number;
  presetLabel: string;
  mapSvgRef?: React.Ref<SVGSVGElement>;
}

function formatMW(value: number): string {
  return `${Math.round(value).toLocaleString()} MW`;
}

export function FloridaHub({ totalLoadMW, batteryChargeMW, selectedHour, mapSvgRef }: FloridaHubProps) {
  const systemDemand = totalLoadMW + batteryChargeMW;

  return (
    <div className="florida-hub" role="img" aria-label={`Florida power grid showing ${formatMW(systemDemand)} system demand at ${selectedHour}:00`}>
      <svg
        ref={mapSvgRef}
        viewBox={FLORIDA_VIEWBOX}
        className="florida-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fpl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a3a5c" />
            <stop offset="100%" stopColor="#2d5a8c" />
          </linearGradient>
          <filter id="fl-shadow">
            <feDropShadow dx="1.5" dy="2" stdDeviation="4" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Full state — light gray base for non-FPL areas */}
        <path
          d={FLORIDA_MAINLAND_PATH}
          fill="#c8d3df"
          stroke="#8a98a8"
          strokeWidth="1.2"
          filter="url(#fl-shadow)"
        />
        <path
          d={FLORIDA_KEYS_PATH}
          fill="#c8d3df"
          stroke="#8a98a8"
          strokeWidth="1"
        />

        {/* FPL Northwest territory overlay (deep blue) */}
        <path
          d={FPL_NORTHWEST_PATH}
          fill="url(#fpl-grad)"
          stroke="#4a6a8a"
          strokeWidth="0.5"
          opacity="0.9"
        />

        {/* FPL Main territory overlay (deep blue) */}
        <path
          d={FPL_MAIN_PATH}
          fill="url(#fpl-grad)"
          stroke="#4a6a8a"
          strokeWidth="0.5"
          opacity="0.9"
        />

        {/* Transmission tower (simplified lattice) */}
        <g transform={`translate(${TOWER_POSITION.x - 8}, ${TOWER_POSITION.y - 20})`} opacity="0.85">
          <line x1="4" y1="30" x2="12" y2="30" stroke="#4a5a70" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="30" x2="7" y2="6" stroke="#4a5a70" strokeWidth="1.3" />
          <line x1="11" y1="30" x2="9" y2="6" stroke="#4a5a70" strokeWidth="1.3" />
          <line x1="6" y1="22" x2="10" y2="22" stroke="#4a5a70" strokeWidth="0.8" />
          <line x1="6.5" y1="15" x2="9.5" y2="15" stroke="#4a5a70" strokeWidth="0.8" />
          <line x1="8" y1="6" x2="8" y2="1" stroke="#4a5a70" strokeWidth="1.2" />
          <line x1="3" y1="7" x2="8" y2="5" stroke="#4a5a70" strokeWidth="0.8" />
          <line x1="13" y1="7" x2="8" y2="5" stroke="#4a5a70" strokeWidth="0.8" />
          <path d="M 3,7 Q 0,10 -1,9" fill="none" stroke="#6a7a8a" strokeWidth="0.4" />
          <path d="M 13,7 Q 16,10 17,9" fill="none" stroke="#6a7a8a" strokeWidth="0.4" />
        </g>
        <circle cx={TOWER_POSITION.x} cy={TOWER_POSITION.y - 18} r="2" fill="#4ade80" className="tower-pulse" />
      </svg>

      {/* Demand info panel — fully opaque, high contrast */}
      <div className="florida-info-panel">
        <div className="florida-info-title">FPL Service Territory &mdash; Illustrative Model</div>
        <div className="florida-info-demand">{formatMW(systemDemand)}</div>
        <div className="florida-info-sub">System Demand &middot; {selectedHour}:00</div>
        {batteryChargeMW > 0 && (
          <div className="florida-info-charge">Incl. {formatMW(batteryChargeMW)} storage charging</div>
        )}
      </div>

      {/* Map legend */}
      <div className="florida-legend">
        <div className="florida-legend-item">
          <span className="florida-legend-swatch florida-legend-fpl" />
          <span>Approx. FPL Territory (43 counties)</span>
        </div>
        <div className="florida-legend-item">
          <span className="florida-legend-swatch florida-legend-other" />
          <span>Other FL Utilities</span>
        </div>
      </div>
    </div>
  );
}
