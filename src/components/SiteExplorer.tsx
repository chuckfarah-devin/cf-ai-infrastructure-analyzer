/**
 * AI Data Center Site Explorer — Florida candidate site evaluation.
 *
 * Reuses the Census-based Florida map from the energy flow visualization.
 * Displays selectable site markers, a compact comparison table,
 * and a detailed profile for the selected site.
 */

import { lazy, Suspense, useState } from 'react';
import {
  Building2, AlertTriangle, CheckCircle, HelpCircle,
  Info, ExternalLink, ChevronDown, ChevronRight, Leaf, Users,
  Droplets, Shield, Eye, Zap, TreePine, MessageSquare,
  CircleDot, CircleDashed, CircleHelp, Satellite
} from 'lucide-react';
import {
  FLORIDA_MAINLAND_PATH,
  FLORIDA_KEYS_PATH,
  FLORIDA_VIEWBOX,
  FPL_NORTHWEST_PATH,
  FPL_MAIN_PATH,
} from '../assets/florida-outline';
import {
  CANDIDATE_SITES,
  type CandidateSite,
  type AnnotatedFact,
  type ConfidenceLevel,
  type EnvironmentalTradeoff,
  type CommunityEnvironmentalOverview,
  type OverviewItem,
} from '../data/siteExplorerData';

const StJohnsSatelliteView = lazy(() => import('./StJohnsSatelliteView'));

// ── Confidence badge ─────────────────────────────────────────
function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = {
    verified: { icon: CheckCircle, label: 'Verified Public', color: '#16a34a' },
    inferred: { icon: AlertTriangle, label: 'Inferred', color: '#ca8a04' },
    unknown: { icon: HelpCircle, label: 'Unknown', color: '#6b7280' },
    illustrative: { icon: Info, label: 'Illustrative', color: '#2563eb' },
  }[level];
  const Icon = config.icon;
  return (
    <span className="confidence-badge" style={{ color: config.color }} title={config.label}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
}

// ── Annotated fact display ───────────────────────────────────
function FactRow({ fact, label }: { fact: AnnotatedFact; label: string }) {
  return (
    <div className="site-fact-row">
      <div className="site-fact-header">
        <span className="site-fact-label">{label}</span>
        <ConfidenceBadge level={fact.confidence} />
      </div>
      <div className="site-fact-value">{fact.value}</div>
      {fact.source && (
        <div className="site-fact-source">
          Source: {fact.source.label}
          {fact.source.date && <> ({fact.source.date})</>}
          {fact.source.url && (
            <a href={fact.source.url} target="_blank" rel="noopener noreferrer" className="source-link">
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}
      {fact.note && <div className="site-fact-note">{fact.note}</div>}
    </div>
  );
}

// ── Tradeoff card ────────────────────────────────────────────
const TRADEOFF_ICONS: Record<string, React.ElementType> = {
  'Brownfield remediation': Shield,
  'Brownfield remediation & restoration': Shield,
  'Brownfield reuse vs. expansion': Building2,
  'Native landscaping & visual screening': TreePine,
  'Native landscaping & visual improvement': TreePine,
  'Native habitat restoration': Leaf,
  'Habitat & wildlife corridors': Leaf,
  'Habitat & wetlands': Droplets,
  'Stormwater management': Droplets,
  'Stormwater & groundwater protection': Droplets,
  'Community economic impact': Users,
  'Community economic transition': Users,
  'Community justice & displacement': Users,
  'Water demand': Droplets,
  'Water resources': Droplets,
  'Noise': Eye,
  'Air quality & emissions': AlertTriangle,
  'Coal-to-solar transition': Zap,
  'Electrical infrastructure': Zap,
};

function TradeoffCard({ tradeoff }: { tradeoff: EnvironmentalTradeoff }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = TRADEOFF_ICONS[tradeoff.category] || Info;

  return (
    <div className="tradeoff-card">
      <button
        className="tradeoff-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <Icon size={16} className="tradeoff-icon" />
        <span className="tradeoff-category">{tradeoff.category}</span>
        <ConfidenceBadge level={tradeoff.confidence} />
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {expanded && (
        <div className="tradeoff-body">
          <div className="tradeoff-section tradeoff-benefit">
            <strong>Potential benefit:</strong> {tradeoff.potentialBenefit}
          </div>
          <div className="tradeoff-section tradeoff-impact">
            <strong>Potential impact:</strong> {tradeoff.potentialImpact}
          </div>
          <div className="tradeoff-section tradeoff-investigation">
            <strong>Investigation needed:</strong> {tradeoff.investigationNeeded}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Status indicator for overview items ──────────────────────
function StatusIndicator({ status }: { status: OverviewItem['status'] }) {
  const config = {
    documented: { icon: CircleDot, label: 'Documented', color: '#16a34a' },
    possible: { icon: CircleDashed, label: 'Possible', color: '#2563eb' },
    unknown: { icon: CircleHelp, label: 'Unknown', color: '#94a3b8' },
  }[status];
  const Icon = config.icon;
  return (
    <span className="overview-status" style={{ color: config.color }} title={config.label}>
      <Icon size={14} />
    </span>
  );
}

// ── Community & Environmental Overview ───────────────────────
function CommunityOverview({ overview }: { overview: CommunityEnvironmentalOverview }) {
  const cards: { key: string; title: string; icon: React.ElementType; iconColor: string; card: { items: OverviewItem[] } }[] = [
    { key: 'land', title: 'Land & Habitat', icon: TreePine, iconColor: '#16a34a', card: overview.landHabitat },
    { key: 'water', title: 'Water & Environmental Restoration', icon: Droplets, iconColor: '#2563eb', card: overview.waterEnvironment },
    { key: 'neighborhood', title: 'Neighborhood Protection', icon: Shield, iconColor: '#7c3aed', card: overview.neighborhoodProtection },
    { key: 'community', title: 'Community Benefits', icon: Users, iconColor: '#ea580c', card: overview.communityBenefits },
  ];

  return (
    <div className="community-overview">
      <div className="community-overview-header">
        <h4>Community & Environmental Overview</h4>
        <p className="community-overview-subtitle">
          Brownfield-first, community-benefit infrastructure planning
        </p>
        <div className="overview-status-legend">
          <span className="overview-legend-item">
            <StatusIndicator status="documented" /> Documented
          </span>
          <span className="overview-legend-item">
            <StatusIndicator status="possible" /> Possible
          </span>
          <span className="overview-legend-item">
            <StatusIndicator status="unknown" /> Requires Investigation
          </span>
        </div>
      </div>

      <div className="community-overview-grid">
        {cards.map(({ key, title, icon: CardIcon, iconColor, card }) => (
          <div key={key} className="overview-card">
            <div className="overview-card-header">
              <CardIcon size={18} style={{ color: iconColor }} />
              <h5>{title}</h5>
            </div>
            <ul className="overview-card-items">
              {card.items.map((item, i) => (
                <li key={i} className={`overview-item overview-item-${item.status}`}>
                  <StatusIndicator status={item.status} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="key-questions">
        <div className="key-questions-header">
          <MessageSquare size={16} style={{ color: '#b45309' }} />
          <h5>Key Questions Before Approval</h5>
        </div>
        <p className="key-questions-note">
          Practical questions a county commissioner or planning board could ask a developer about this site.
        </p>
        <ol className="key-questions-list">
          {overview.keyQuestionsBeforeApproval.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ── Classification badge ─────────────────────────────────────
function ClassificationBadge({ site }: { site: CandidateSite }) {
  const colors = {
    redevelopment_opportunity: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    active_proposal: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
    case_study: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  }[site.classification];

  return (
    <span
      className="classification-badge"
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
    >
      {site.classificationLabel}
    </span>
  );
}

// ── Site detail panel ────────────────────────────────────────
function SiteDetail({ site, onOpenSatellite }: { site: CandidateSite; onOpenSatellite: () => void }) {
  return (
    <div className="site-detail">
      <div className="site-detail-header">
        <div>
          <h3>{site.name}</h3>
          <span className="site-detail-location">{site.city}, {site.county} County</span>
        </div>
        <ClassificationBadge site={site} />
      </div>

      <p className="site-detail-why">{site.whyIncluded}</p>

      {site.id === 'st-johns' && (
        <button type="button" className="satellite-view-btn" onClick={onOpenSatellite}>
          <Satellite size={16} />
          Explore Satellite View
        </button>
      )}

      {/* Community & Environmental Overview */}
      <CommunityOverview overview={site.communityOverview} />

      {/* Core profile */}
      <div className="site-detail-section">
        <h4>Site Profile</h4>
        <div className="site-facts-grid">
          <FactRow fact={site.formerUse} label="Former Use" />
          <FactRow fact={site.currentStatus} label="Current Status" />
          <FactRow fact={site.ownership} label="Ownership" />
          <FactRow fact={site.acreage} label="Acreage" />
          <FactRow fact={site.legacyCapacityMW} label="Legacy Capacity" />
          <FactRow fact={site.retirementDate} label="Retirement / Closure" />
        </div>
      </div>

      {/* Infrastructure */}
      <div className="site-detail-section">
        <h4>Existing Infrastructure</h4>
        {site.existingInfrastructure.map((infra, i) => (
          <FactRow key={i} fact={infra} label="" />
        ))}
      </div>

      {/* Key uncertainties */}
      <div className="site-detail-section">
        <h4>Key Uncertainties</h4>
        <ul className="site-uncertainties">
          {site.keyUncertainties.map((u, i) => (
            <li key={i}>
              <HelpCircle size={12} className="uncertainty-icon" />
              {u}
            </li>
          ))}
        </ul>
      </div>

      {/* Community & environmental tradeoffs */}
      <div className="site-detail-section">
        <h4>Community & Environmental Tradeoffs</h4>
        <p className="tradeoff-disclaimer">
          The following identifies potential benefits and impacts based on publicly available information.
          Items classified as "Illustrative" or "Inferred" require site-specific investigation to confirm.
        </p>
        <div className="tradeoff-list">
          {site.tradeoffs.map((t, i) => (
            <TradeoffCard key={i} tradeoff={t} />
          ))}
        </div>
      </div>

      {/* Data confidence legend */}
      <div className="site-detail-section confidence-legend">
        <h4>Data Confidence Classifications</h4>
        <div className="confidence-legend-grid">
          <div><ConfidenceBadge level="verified" /> From an authoritative public dataset with citation.</div>
          <div><ConfidenceBadge level="inferred" /> Logically derived from verified data.</div>
          <div><ConfidenceBadge level="unknown" /> Not available from public sources; requires investigation.</div>
          <div><ConfidenceBadge level="illustrative" /> Estimate based on published benchmarks, not site-specific.</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Site Explorer component ─────────────────────────────
export function SiteExplorer() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(CANDIDATE_SITES[0].id);
  const [viewMode, setViewMode] = useState<'overview' | 'satellite'>('overview');
  const selectedSite = CANDIDATE_SITES.find(s => s.id === selectedSiteId) ?? CANDIDATE_SITES[0];

  if (viewMode === 'satellite') {
    return (
      <div className="site-explorer site-explorer-satellite">
        <Suspense fallback={<div className="satellite-loading">Loading satellite map…</div>}>
          <StJohnsSatelliteView onBack={() => setViewMode('overview')} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="site-explorer">
      <div className="site-explorer-header">
        <div>
          <h2>AI Data Center Site Explorer</h2>
          <p className="site-explorer-subtitle">
            Florida redevelopment opportunities — prioritizing previously developed sites over undisturbed land
          </p>
        </div>
      </div>

      <div className="site-explorer-body">
        {/* Left: Florida map with markers */}
        <div className="site-explorer-map-panel">
          <svg
            viewBox={FLORIDA_VIEWBOX}
            className="site-explorer-map"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Florida map showing candidate site locations"
          >
            {/* State outline */}
            <path d={FLORIDA_MAINLAND_PATH} fill="#e8edf3" stroke="#94a3b8" strokeWidth="1" />
            <path d={FLORIDA_KEYS_PATH} fill="#e8edf3" stroke="#94a3b8" strokeWidth="0.8" />

            {/* Approximate FPL territory */}
            <path d={FPL_NORTHWEST_PATH} fill="#c7d6e8" fillOpacity="0.5" stroke="none" />
            <path d={FPL_MAIN_PATH} fill="#c7d6e8" fillOpacity="0.5" stroke="none" />

            {/* Site markers */}
            {CANDIDATE_SITES.map((site) => {
              const isSelected = site.id === selectedSiteId;
              return (
                <g
                  key={site.id}
                  className={`site-marker ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSiteId(site.id)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  aria-label={`Select ${site.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedSiteId(site.id); }}
                >
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <circle
                      cx={site.svgPosition.x}
                      cy={site.svgPosition.y}
                      r="12"
                      fill="none"
                      stroke={site.markerColor}
                      strokeWidth="1.5"
                      opacity="0.4"
                      className="marker-pulse"
                    />
                  )}
                  {/* Outer ring */}
                  <circle
                    cx={site.svgPosition.x}
                    cy={site.svgPosition.y}
                    r={isSelected ? 8 : 6}
                    fill={site.markerColor}
                    fillOpacity={isSelected ? 0.25 : 0.15}
                    stroke={site.markerColor}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={site.svgPosition.x}
                    cy={site.svgPosition.y}
                    r={isSelected ? 4 : 3}
                    fill={site.markerColor}
                  />
                  {/* Label */}
                  <text
                    x={site.svgPosition.x + (site.svgPosition.x > 200 ? -12 : 12)}
                    y={site.svgPosition.y - 12}
                    textAnchor={site.svgPosition.x > 200 ? 'end' : 'start'}
                    className="marker-label"
                    fill={isSelected ? site.markerColor : '#475569'}
                    fontWeight={isSelected ? 700 : 500}
                    fontSize={isSelected ? '9' : '8'}
                  >
                    {site.city}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map legend */}
          <div className="site-map-legend">
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#c7d6e8' }} />
              Approx. FPL Territory
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#e8edf3' }} />
              Other FL Utilities
            </span>
          </div>

          {/* Compact comparison list */}
          <div className="site-comparison-list">
            {CANDIDATE_SITES.map((site) => (
              <button
                key={site.id}
                className={`site-comparison-item ${site.id === selectedSiteId ? 'selected' : ''}`}
                onClick={() => setSelectedSiteId(site.id)}
              >
                <span className="table-marker" style={{ background: site.markerColor }} />
                <span className="site-comparison-info">
                  <span className="site-comparison-name">{site.name}</span>
                  <span className="site-comparison-meta">
                    {site.county} Co. &middot;{' '}
                    {site.legacyCapacityMW.value === 'N/A — Industrial manufacturing site, not a power plant.'
                      ? 'Manufacturing'
                      : `${site.legacyCapacityMW.value.split(' ')[0]} MW`}
                  </span>
                </span>
                <span className={`table-classification ${site.classification}`}>
                  {site.classification === 'redevelopment_opportunity' ? 'Opportunity'
                    : site.classification === 'active_proposal' ? 'Active'
                    : 'Case Study'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: selected site detail */}
        <div className="site-explorer-detail-panel">
          <SiteDetail site={selectedSite} onOpenSatellite={() => setViewMode('satellite')} />
        </div>
      </div>

      <div className="site-explorer-footer">
        <p>
          <strong>Disclaimer:</strong> This tool identifies potential redevelopment opportunities based on
          publicly available information. It does not constitute a site recommendation, environmental assessment,
          interconnection study, or financial commitment. All sites require independent verification before
          any development decisions.
        </p>
      </div>
    </div>
  );
}
