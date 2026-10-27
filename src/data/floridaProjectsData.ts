/**
 * Florida Projects — curated, evidence-qualified profiles of documented
 * Florida infrastructure projects (data centers and related facilities).
 *
 * Phase 1 scope: three launch profiles, read-only presentation. No
 * simulation inputs — documented figures are displayed with their exact
 * semantic meaning (e.g., IT load vs. facility demand) and are NOT wired
 * into ScenarioConfig. Pipeline/infrastructure profiles are deferred
 * pending official route geometry.
 *
 * Verification date for all records: October 26, 2026.
 */

import type { ConfidenceLevel, SourceCitation } from './siteExplorerData';

/** What a reported MW figure actually describes — never interchangeable. */
export type CapacityMeaning =
  | 'facility-demand'   // total metered facility electricity demand
  | 'it-load'           // customer IT equipment load only (below facility draw)
  | 'service-request'   // utility service capacity requested (≠ consumption)
  | 'nameplate'         // generation nameplate (≠ continuous output)
  | 'unknown';

export type ProjectRole = 'demand' | 'supply' | 'storage' | 'context';

/** Marker precision — drives whether a precise pin is allowed. */
export type LocationPrecision =
  | 'parcel'    // parcel/mapped boundary documented
  | 'address'   // street address documented; marker near address, still labeled approximate
  | 'area'      // corridor/area documented only — explicitly approximate area marker
  | 'offmap';   // county-level or worse — no marker

export interface CapacityFigure {
  valueMW?: number;
  meaning: CapacityMeaning;
  /** e.g. "Phase 1" vs "full buildout" */
  phase?: string;
  label: string;
  confidence: ConfidenceLevel;
  source?: SourceCitation;
  note?: string;
}

export interface ProjectMilestone {
  date: string;          // ISO or labeled date
  event: string;
  /** Who attests to it — distinguishes record types. */
  evidence: 'agency-record' | 'developer-claim' | 'news-report';
  source?: SourceCitation;
}

export interface FloridaProject {
  id: string;
  name: string;
  roles: ProjectRole[];           // multi-component support (e.g., demand + on-site generation)
  roleLabel: string;
  county: string;
  city: string;
  precision: LocationPrecision;
  coordinates: { lat: number; lon: number } | null;  // null when offmap
  coordinateNote: string;         // always shown; justifies or limits the marker
  classificationLabel: string;
  markerColor: string;

  overview: string;               // 2-3 sentence description
  status: string;                 // current verified status line
  statusConfidence: ConfidenceLevel;
  statusSource?: SourceCitation;

  capacities: CapacityFigure[];
  waterContext?: string;
  milestones: ProjectMilestone[];
  unresolved: string[];
  sources: SourceCitation[];      // key sources, linked in profile
  whyIncluded: string;

  /** Satellite/env screening only when precision supports a real location. */
  supportsEnvironmentalContext: boolean;
}

const VERIFY_DATE = 'Oct 26, 2026';

// ── Fort Meade Data Center Campus ────────────────────────────
const fortMeade: FloridaProject = {
  id: 'fort-meade',
  name: 'Fort Meade Data Center Campus',
  roles: ['demand'],
  roleLabel: 'Data Center — adds electricity demand',
  county: 'Polk',
  city: 'Fort Meade (unincorporated area, west of US-98)',
  precision: 'parcel',
  coordinates: { lat: 27.779, lon: -81.826 },
  coordinateNote:
    'Marker at the centroid of the eight Polk County parcel IDs listed in the county\'s ad valorem exemption record for Fort Meade DC LLC (Legistar file 25-1989: parcels in Sections 8, 9, 16, 17, 21 of T31S R25E). Parcel geometry located in the Polk County Property Appraiser GIS (gis.polk-county.net); combined footprint roughly 27.7625–27.7954°N, −81.8424 to −81.8097°W, northwest of downtown west of US 17/98. Marker is the parcel centroid, not a boundary display.',
  classificationLabel: 'Approved Development Agreement — Permits Pending',
  markerColor: '#f59e0b',

  overview:
    'A proposed hyperscale data center campus by Stonebridge (through Fort Meade DC LLC) on roughly 1,300 acres of former phosphate mine and farmland along US-98 — a reuse of mined land, not undisturbed land. City commissioners unanimously approved a 20-year development agreement in April 2026; the project still requires water, environmental, and other permits before construction.',
  status:
    'Development agreement approved April 2026; land use and PUD zoning approved June 2025; construction contingent on SWFWMD water permit and other agency approvals.',
  statusConfidence: 'verified',
  statusSource: { label: 'WUSF / DCD reporting on city action and SWFWMD letter', date: 'Apr 15–21, 2026' },

  capacities: [
    {
      meaning: 'unknown',
      label: 'Electrical demand — no MW figure appears in the public records reviewed',
      confidence: 'unknown',
      note: 'Duke Energy would serve the site (city itself is FMPA-served). Do not infer capacity from floor area.',
    },
    {
      meaning: 'service-request',
      label: 'Water: up to 50,000 gallons/day from the city — potable uses; developer claims closed-loop cooling for operations',
      confidence: 'inferred',
      source: { label: 'WFLA / Tampa Bay 28 coverage of Apr 14, 2026 commission meeting', date: 'Apr 2026' },
      note: 'SWFWMD ruled the city cannot serve the project under existing infrastructure; a new permit application is required.',
    },
  ],
  waterContext: 'SWFWMD jurisdiction; city water supply requires a new district-approved permit under December 2025 rules.',
  milestones: [
    { date: 'Jun 2025', event: 'Land use and PUD zoning approvals (approximately 1,300 acres rezoned industrial)', evidence: 'news-report', source: { label: 'DCD', url: 'https://www.datacenterdynamics.com/en/news/plans-to-build-1300-acre-data-center-in-fort-meade-florida-gets-go-ahead-from-officials/', date: 'Apr 21, 2026' } },
    { date: 'Apr 14, 2026', event: 'City Commission unanimously approves 20-year development agreement', evidence: 'news-report', source: { label: 'WFLA', url: 'https://www.wfla.com/news/polk-county/city-of-fort-meade-unanimously-approves-ai-hyperscale-data-center-off-us-98/', date: 'Apr 2026' } },
    { date: 'Apr 2026', event: 'SWFWMD notifies city that existing water infrastructure cannot serve the project; new permit required', evidence: 'agency-record', source: { label: 'WUSF', url: 'https://www.wusf.org/environment/2026-04-15/fort-meade-ai-data-center-project-hits-roadblock-over-new-water-rules', date: 'Apr 15, 2026' } },
    { date: 'Developer claim', event: 'Phased opening targeted around 2028; ~$2.6B project; ~500 jobs by 2031; ~$100M/yr ad valorem plus $10M immediate contribution', evidence: 'developer-claim', source: { label: 'WFLA / FOX 13 meeting coverage', date: 'Apr 2026' } },
  ],
  unresolved: [
    'Site footprint is established by parcel list, but the development agreement\'s legal description and site-plan exhibits were not reviewed directly; internal phasing within the parcels is undocumented',
    'Developer site lists access from SR-630/US-17 — likely the entrance road on the east side; the parcels themselves sit west of US 17/98 per county records',
    'Total electrical demand (MW) — no figure in records reviewed',
    'SWFWMD water permit outcome; whether construction schedule survives the water ruling',
    'End user/operator identity',
    'Phosphate-mining legacy conditions and any remediation obligations on the site',
  ],
  sources: [
    { label: 'Polk County Legistar file 25-1989 — ad valorem exemption ordinance listing project parcels (location evidence)', url: 'https://polkcountyfl.legistar.com/LegislationDetail.aspx?FullText=1&GUID=DB771FE9-5D47-4CA5-A316-C3E973EEAD7F&ID=7715047', date: 'Nov 4, 2025' },
    { label: 'Polk County Property Appraiser GIS — parcel service (parcel geometry used for marker)', url: 'https://gis.polk-county.net/server/rest/services/Map_Property_Appraiser/MapServer/1' },
    { label: 'WUSF — water-rule roadblock', url: 'https://www.wusf.org/environment/2026-04-15/fort-meade-ai-data-center-project-hits-roadblock-over-new-water-rules', date: 'Apr 15, 2026' },
    { label: 'Fort Meade Data Center — developer project site (access description differs from news reports)', url: 'https://fortmeadedatacenter.wixsite.com/fort-meade-data-cent' },
    { label: 'DCD — development agreement approval', url: 'https://www.datacenterdynamics.com/en/news/plans-to-build-1300-acre-data-center-in-fort-meade-florida-gets-go-ahead-from-officials/', date: 'Apr 21, 2026' },
    { label: 'WFLA — commission approval', url: 'https://www.wfla.com/news/polk-county/city-of-fort-meade-unanimously-approves-ai-hyperscale-data-center-off-us-98/', date: 'Apr 2026' },
  ],
  whyIncluded:
    'Florida’s first approved hyperscale-scale data center agreement: a brownfield reuse case showing both the scale of AI-driven demand growth and how water permitting can gate an otherwise-approved project.',
  // Parcel-verified: the county exemption record lists the project parcels and
  // the Property Appraiser GIS locates them, so site-level screening is justified.
  supportsEnvironmentalContext: true,
};

// ── Project Tango / Central Park Commerce Center ─────────────
const projectTango: FloridaProject = {
  id: 'project-tango',
  name: 'Project Tango (Central Park Commerce Center)',
  roles: ['demand'],
  roleLabel: 'Data Center — adds electricity demand',
  county: 'Palm Beach',
  city: 'Loxahatchee area (unincorporated), 20125 Southern Blvd',
  precision: 'parcel',
  coordinates: { lat: 26.6916, lon: -80.3696 },
  coordinateNote:
    'Marker at the centroid of the nine parcel control numbers recorded in the county\'s Project Tango record (PCNs in Sections 29 and 32, T43S R40E), each located in the Palm Beach County parcel GIS (pbcmaps.pbcgov.org). Combined footprint roughly 26.6855–26.6976°N, −80.3735 to −80.3658°W, north of Southern Boulevard beside the L-8 Canal. Marker is the parcel centroid, not a boundary display.',
  classificationLabel: 'Partially Approved — Administrative Approval Within Master Plan',
  markerColor: '#f59e0b',

  overview:
    'A data-center conversion inside the already-approved Central Park Commerce Center master plan, on a site with existing industrial use documented in a Phase I environmental site assessment (asphalt plant, concrete batch plants, FPL equipment laydown). County commissioners denied a major expansion in July 2026, but zoning staff administratively approved ~698,000 sq ft of data-center space in October 2026 using capacity already inside the existing approval — a case study in how approvals persist inside earlier entitlements.',
  status:
    'Data-center space administratively approved Oct 7, 2026 (~698,000 sq ft within the existing master plan); larger expansion denied by commissioners Jul 15, 2026; county-wide moratorium on new ≥50 MW data-center applications adopted separately.',
  statusConfidence: 'verified',
  statusSource: { label: 'PBC Zoning Division application record ABN/DRO-2026-01058; WPBF/WFLX reporting', date: 'Oct 2026' },

  capacities: [
    {
      meaning: 'unknown',
      label: 'Electrical demand for the currently approved plan — not stated in county records',
      confidence: 'unknown',
      note: 'A draft water-usage table for the DENIED expansion listed four phases of 150/100/100/100 MW (450 MW). That figure does not describe the approved plan. A 600 MW figure circulating in news coverage is not found in any county record reviewed.',
    },
  ],
  waterContext: 'Approved plan requires closed-loop cooling; site sits beside FPL’s West County Energy Center (existing major water/power infrastructure context).',
  milestones: [
    { date: 'Jan 2025', event: 'Master plan most recently modified/approved (2.02M sq ft MUPD/EDC uses)', evidence: 'agency-record', source: { label: 'PBC Zoning — Project Tango page', url: 'https://discover.pbc.gov/pzb/zoning/Pages/Project_Tango.aspx' } },
    { date: 'Jul 15, 2026', event: 'Commissioners deny expanded plan (5-1)', evidence: 'agency-record', source: { label: 'WFLX / PBC record', url: 'https://www.wflx.com/2026/10/21/palm-beach-county-said-no-project-tango-expansion-data-center-space-still-triples/', date: 'Oct 21, 2026' } },
    { date: 'Oct 7, 2026', event: 'Staff administratively approve ~698,000 sq ft data-center space within existing approval — no public hearing; includes 850-ft buffer from Arden, sound studies, noise monitoring, closed-loop cooling', evidence: 'agency-record', source: { label: 'WPBF', url: 'https://www.wpbf.com/article/palm-beach-county-zoning-data-center-project-tango/74209499', date: 'Oct 2026' } },
    { date: 'Oct 2026', event: 'County adopts one-year moratorium on new ≥50 MW data-center applications (does not undo existing approvals)', evidence: 'news-report', source: { label: 'CBS12', url: 'https://cbs12.com/news/local/palm-beach-county-pauses-large-ai-data-centers-one-year-moratorium-smaller-project-tango-plan-remains-approved', date: 'Oct 2026' } },
  ],
  unresolved: [
    'Electrical demand of the currently approved plan — no MW figure in county records',
    'Whether WPB Logistics Owner proceeds with a separate warehouse-to-data-center conversion',
    'How the county moratorium interacts with future phases',
    'End user/operator identity',
  ],
  sources: [
    { label: 'Palm Beach County Zoning Division — Project Tango record (location, parcel control numbers, applications)', url: 'https://discover.pbc.gov/pzb/zoning/Pages/Project_Tango.aspx' },
    { label: 'PBC parcel GIS — parcels layer used to locate the nine recorded parcels', url: 'https://pbcmaps.pbcgov.org/arcgis/rest/services/test/ParcelsLayer_and_Table/MapServer/0' },
    { label: 'PBC — Phase I Environmental Site Assessment (existing industrial use)', url: 'https://discover.pbc.gov/pzb/zoning/Hearings-Meetings-BCC/F-21_Phase%201%20Environmental%20Site%20Assessment_6-8-2026.pdf', date: 'Jun 2026' },
    { label: 'WPBF — Oct 7 administrative approval', url: 'https://www.wpbf.com/article/palm-beach-county-zoning-data-center-project-tango/74209499', date: 'Oct 2026' },
    { label: 'CBS12 — county moratorium', url: 'https://cbs12.com/news/local/palm-beach-county-pauses-large-ai-data-centers-one-year-moratorium-smaller-project-tango-plan-remains-approved', date: 'Oct 2026' },
  ],
  whyIncluded:
    'Shows how data-center capacity can be approved administratively inside earlier entitlements — and how community protection conditions (buffers, sound studies, closed-loop cooling) get attached to approvals.',
  supportsEnvironmentalContext: true,
};

// ── Iron Mountain MIA-1 ──────────────────────────────────────
const mia1: FloridaProject = {
  id: 'iron-mountain-mia1',
  name: 'Iron Mountain MIA-1',
  roles: ['demand'],
  roleLabel: 'Data Center — adds electricity demand',
  county: 'Miami-Dade',
  city: 'Miami (Westview, 2925 NW 120th Terrace)',
  precision: 'address',
  coordinates: { lat: 25.888, lon: -80.215 },
  coordinateNote:
    'Address-level marker from the operator-published street address (2925 NW 120th Terrace, Westview). Marker is approximate at address level; not a property boundary.',
  classificationLabel: 'Current operating status unverified',
  markerColor: '#2563eb',

  overview:
    'Iron Mountain’s first Miami data center: a purpose-built 150,000 sq ft Tier III colocation facility on the company’s own former storage site — a reuse case rather than greenfield. Topped out in 2025 and phasing into operation through 2026.',
  status:
    'Under construction / commissioning per operator disclosures; topped out September 2025; capacity phasing through 2026. Not independently confirmed operational in public records reviewed.',
  statusConfidence: 'inferred',
  statusSource: { label: 'Iron Mountain product page; DCD construction coverage', date: 'verified Oct 26, 2026' },

  capacities: [
    {
      valueMW: 16,
      meaning: 'it-load',
      phase: 'full buildout',
      label: '16 MW customer IT load capacity, on 26 MVA total redundant operational power',
      confidence: 'verified',
      source: { label: 'Iron Mountain — Miami data center page', url: 'https://www.ironmountain.com/data-centers/locations/na/miami' },
      note: 'IT load only — the facility’s total metered demand (including cooling and power overhead) is not published and is not the same figure.',
    },
  ],
  waterContext: 'No water-use figure published; operator claims 100% renewable-energy matching.',
  milestones: [
    { date: 'Nov 2023', event: 'Project announced', evidence: 'developer-claim', source: { label: 'DCD', url: 'https://www.datacenterdynamics.com/en/news/iron-mountain-breaks-ground-on-first-data-center-in-miami/' } },
    { date: 'Feb 2025', event: 'Groundbreaking', evidence: 'news-report', source: { label: 'DCD', url: 'https://www.datacenterdynamics.com/en/news/iron-mountain-breaks-ground-on-first-data-center-in-miami/' } },
    { date: 'Sep 2025', event: 'Facility topped out', evidence: 'developer-claim', source: { label: 'DCD', url: 'https://www.datacenterdynamics.com/en/news/iron-mountain-tops-outs-miami-data-center/', date: 'Sep 2025' } },
  ],
  unresolved: [
    'Total facility metered demand (MW) — only IT load is published',
    'Operational/commissioning completion — last confirmed milestone is topping-out',
    'Actual utility service agreement with Florida Power & Light',
  ],
  sources: [
    { label: 'Iron Mountain — MIA-1 product page', url: 'https://www.ironmountain.com/data-centers/locations/na/miami' },
    { label: 'DCD — topping-out coverage', url: 'https://www.datacenterdynamics.com/en/news/iron-mountain-tops-outs-miami-data-center/', date: 'Sep 2025' },
  ],
  whyIncluded:
    'A completed/reuse counterpoint to speculative proposals — and the clearest illustration of why “16 MW IT load” is not the same as total facility demand.',
  supportsEnvironmentalContext: true,
};

export const FLORIDA_PROJECTS: FloridaProject[] = [fortMeade, projectTango, mia1];

export const VERIFICATION_DATE = VERIFY_DATE;
