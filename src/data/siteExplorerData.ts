/**
 * AI Data Center Site Explorer — Florida candidate site data.
 *
 * Guiding principle: prioritize redevelopment of existing power-generation
 * and industrial sites over undisturbed natural land.
 *
 * Each fact is annotated with a data-confidence classification:
 *   - verified:     From an authoritative public dataset with citation
 *   - inferred:     Logically derived from verified data
 *   - unknown:      Data not available from public sources
 *   - illustrative: Estimate based on published benchmarks
 *
 * Site classifications:
 *   - redevelopment_opportunity: Site is or may be available for new use
 *   - active_proposal:          An active data-center or redevelopment project exists
 *   - case_study:               Educational example; not necessarily available
 */

export type ConfidenceLevel = 'verified' | 'inferred' | 'unknown' | 'illustrative';

export type SiteClassification =
  | 'redevelopment_opportunity'
  | 'active_proposal'
  | 'case_study';

export interface SourceCitation {
  label: string;
  url?: string;
  date?: string;
}

export interface AnnotatedFact {
  value: string;
  confidence: ConfidenceLevel;
  source?: SourceCitation;
  note?: string;
}

export interface EnvironmentalTradeoff {
  category: string;
  potentialBenefit: string;
  potentialImpact: string;
  investigationNeeded: string;
  confidence: ConfidenceLevel;
}

/** A single item in the Community & Environmental Overview cards. */
export interface OverviewItem {
  text: string;
  status: 'documented' | 'possible' | 'unknown';
}

/** One of the four Community & Environmental Overview cards. */
export interface OverviewCard {
  items: OverviewItem[];
}

/** Community & Environmental Overview for one site. */
export interface CommunityEnvironmentalOverview {
  landHabitat: OverviewCard;
  waterEnvironment: OverviewCard;
  neighborhoodProtection: OverviewCard;
  communityBenefits: OverviewCard;
  keyQuestionsBeforeApproval: string[];
}

export interface CandidateSite {
  id: string;
  name: string;
  classification: SiteClassification;
  classificationLabel: string;
  county: string;
  city: string;
  coordinates: { lat: number; lon: number };
  coordinateSource: SourceCitation;
  /** Position on the Census-based Florida SVG (viewBox 0 0 400 386) */
  svgPosition: { x: number; y: number };
  markerColor: string;

  // Core profile
  formerUse: AnnotatedFact;
  currentStatus: AnnotatedFact;
  ownership: AnnotatedFact;
  acreage: AnnotatedFact;
  legacyCapacityMW: AnnotatedFact;
  retirementDate: AnnotatedFact;
  existingInfrastructure: AnnotatedFact[];
  keyUncertainties: string[];
  whyIncluded: string;

  // Community & Environmental Overview (four-card structure)
  communityOverview: CommunityEnvironmentalOverview;

  // Community & environmental tradeoffs (detailed)
  tradeoffs: EnvironmentalTradeoff[];
}

// ─────────────────────────────────────────────────────────────────
// Site 1: St. Johns River Power Park / Gateway Commerce Center
// ─────────────────────────────────────────────────────────────────
const stJohns: CandidateSite = {
  id: 'st-johns',
  name: 'St. Johns River Power Park',
  classification: 'redevelopment_opportunity',
  classificationLabel: 'Potential Redevelopment Opportunity',
  county: 'Duval',
  city: 'Jacksonville',
  coordinates: { lat: 30.4281, lon: -81.548331 },
  coordinateSource: { label: 'Florida DEP storage-tank facility inspection record, 11201 New Berlin Road', date: 'Sep 2016' },
  svgPosition: { x: 314.2, y: 42.3 },
  markerColor: '#3b82f6',

  formerUse: {
    value: '1,252 MW coal-fired power plant (Units 1 & 2), jointly owned by JEA and FPL.',
    confidence: 'verified',
    source: { label: 'EIA Form 860', url: 'https://www.eia.gov/electricity/data/eia860/', date: '2024' },
  },
  currentStatus: {
    value: 'Coal plant demolished (cooling towers imploded June 2018, structures removed). JEA board approved a $1.57B, 675 MW natural gas combined-cycle plant on ~40 acres (Aug 2025). Remaining ~960 acres marketed as "Gateway Commerce Center" for industrial/logistics redevelopment. Planning commission approved zoning exception Nov 2025.',
    confidence: 'verified',
    source: { label: 'Jacksonville Times-Union; JEA Board records', date: 'Aug–Nov 2025' },
  },
  ownership: {
    value: 'JEA (city-owned utility, Jacksonville)',
    confidence: 'verified',
    source: { label: 'JEA public records', date: '2024' },
  },
  acreage: {
    value: '~2,000 acres total; ~1,000 acres developable. JEA board declared surplus Nov 2023. ~40 acres committed to new gas plant.',
    confidence: 'verified',
    source: { label: 'JEA board materials; Jacksonville Times-Union', date: 'Mar 2024' },
  },
  legacyCapacityMW: {
    value: '1,252 MW (retired coal generation)',
    confidence: 'verified',
    source: { label: 'EIA Form 860', date: '2024' },
  },
  retirementDate: {
    value: 'Coal plant ceased operations 2018',
    confidence: 'verified',
    source: { label: 'JEA press releases', date: '2018' },
  },
  existingInfrastructure: [
    {
      value: 'Legacy transmission interconnection sized for 1,252 MW generation. New 675 MW gas plant will consume a significant portion.',
      confidence: 'verified',
      source: { label: 'JEA board filings', date: '2025' },
      note: 'Legacy generation capacity does NOT imply available interconnection capacity for new load. Interconnection study required.',
    },
    {
      value: 'Rail line through property',
      confidence: 'verified',
      source: { label: 'Jacksonville Times-Union site reporting', date: 'Mar 2024' },
    },
    {
      value: 'Road access from New Berlin Road; proposed new Blount Island Boulevard from Heckscher Drive',
      confidence: 'verified',
      source: { label: 'JEA site plan / FDOT', date: '2024' },
    },
    {
      value: 'Adjacent to JaxPort Blount Island Terminal and I-295',
      confidence: 'verified',
      source: { label: 'Jacksonville Times-Union', date: 'Mar 2024' },
    },
  ],
  keyUncertainties: [
    'How much grid interconnection capacity remains after the 675 MW gas plant is built on-site.',
    'Whether any portion of the ~960 remaining acres is being marketed specifically for data center use, or exclusively for logistics/warehousing.',
    'Environmental condition of the former coal plant footprint (coal combustion residuals, ash ponds).',
    'Timeline and terms of JEA\'s RFP process for remaining acreage.',
  ],
  whyIncluded: 'Largest genuine redevelopment opportunity among retired Florida power plants. Active planning by JEA with both new generation and industrial reuse on the same 2,000-acre site. Demonstrates the complexity of mixed brownfield redevelopment.',

  communityOverview: {
    landHabitat: {
      items: [
        { text: 'Former 1,252 MW coal plant demolished — reuses previously developed industrial land rather than undisturbed habitat.', status: 'documented' },
        { text: 'Site is adjacent to St. Johns River and coastal marshes; thoughtful design could maintain wildlife corridors along the river margin.', status: 'possible' },
        { text: 'Native Florida landscaping (live oak, slash pine, sabal palm) could provide visual screening along Heckscher Drive and New Berlin Road.', status: 'possible' },
        { text: 'Whether coal combustion residuals (ash) remain on-site and require remediation before development is not established from public records.', status: 'unknown' },
      ],
    },
    waterEnvironment: {
      items: [
        { text: 'Modern stormwater systems on the redeveloped site would likely improve runoff quality compared to the former coal plant operations.', status: 'possible' },
        { text: 'Coal combustion residual contamination and ash pond status require Phase I/II Environmental Site Assessment.', status: 'unknown' },
        { text: 'Data center cooling requires significant water volumes; consumptive use permit from SJRWMD would be needed.', status: 'documented' },
        { text: 'Reclaimed water availability for cooling has not been publicly evaluated.', status: 'unknown' },
      ],
    },
    neighborhoodProtection: {
      items: [
        { text: 'Large industrial development could increase truck traffic on Heckscher Drive and New Berlin Road.', status: 'documented' },
        { text: '24/7 data center operations generate continuous noise from cooling systems and backup generators.', status: 'documented' },
        { text: 'A state-funded traffic impact study was proposed for the Gateway Commerce Center area.', status: 'documented' },
        { text: 'Visual impact on residential areas to the west requires assessment and landscape screening plan.', status: 'unknown' },
      ],
    },
    communityBenefits: {
      items: [
        { text: 'JEA has described the site as a "once in a generation" economic development opportunity for Jacksonville\'s Northside.', status: 'documented' },
        { text: 'Potential for construction employment, permanent operations jobs, and increased local tax revenue.', status: 'possible' },
        { text: 'JEA\'s Gateway Commerce Center RFP process could include enforceable community benefit commitments.', status: 'possible' },
        { text: 'Specific job counts, tax revenue projections, and community benefit terms have not been published.', status: 'unknown' },
      ],
    },
    keyQuestionsBeforeApproval: [
      'What is the environmental condition of the former coal plant footprint? Has a Phase I/II ESA been completed?',
      'How much grid interconnection capacity remains after the 675 MW gas plant is built?',
      'What specific traffic mitigation measures will be required for Heckscher Drive and New Berlin Road?',
      'What enforceable community benefit commitments (local hiring, noise limits, visual screening) will be included in the RFP?',
      'How will water supply for data center cooling be sourced — municipal, reclaimed, or groundwater — and at what volume?',
      'What native landscaping and habitat restoration requirements will be imposed as conditions of development approval?',
    ],
  },

  tradeoffs: [
    {
      category: 'Brownfield remediation',
      potentialBenefit: 'Redevelopment of a demolished coal plant site avoids greenfield disturbance. Cleanup of coal combustion residuals would improve environmental conditions.',
      potentialImpact: 'If CCR (coal ash) contamination is present, remediation costs could be significant. Construction could disturb settled contaminants.',
      investigationNeeded: 'Phase I/II Environmental Site Assessment for coal combustion residual contamination, ash pond status, and groundwater conditions.',
      confidence: 'inferred',
    },
    {
      category: 'Native landscaping & visual screening',
      potentialBenefit: 'Opportunity to establish native Florida tree screening (live oak, slash pine, sabal palm) as visual buffers for adjacent communities and along Heckscher Drive.',
      potentialImpact: 'Large-scale industrial or data center structures may alter the visual character of the area even with screening.',
      investigationNeeded: 'Visual impact assessment and landscape plan addressing views from Heckscher Drive, New Berlin Road, and residential areas to the west.',
      confidence: 'illustrative',
    },
    {
      category: 'Habitat & wildlife corridors',
      potentialBenefit: 'Site is near the St. Johns River and coastal marshes. Thoughtful site design could maintain or create wildlife movement corridors along the river margin.',
      potentialImpact: 'Development of all 960+ acres could fragment habitat connectivity between the river and upland areas.',
      investigationNeeded: 'USFWS consultation for threatened/endangered species. NWI wetland delineation. Evaluation of existing wildlife use patterns on the cleared site.',
      confidence: 'inferred',
    },
    {
      category: 'Stormwater management',
      potentialBenefit: 'Modern stormwater systems on the redeveloped site would likely improve runoff quality compared to the former coal plant operations.',
      potentialImpact: 'Large impervious surfaces (data center buildings, parking) increase runoff volume if not properly managed.',
      investigationNeeded: 'FEMA flood zone verification at specific development parcels. SJRWMD stormwater permit requirements.',
      confidence: 'inferred',
    },
    {
      category: 'Community economic impact',
      potentialBenefit: 'JEA has described the site as a "once in a generation" economic development opportunity for Jacksonville\'s Northside. Potential for construction jobs, permanent operations jobs, and increased tax revenue.',
      potentialImpact: 'Large industrial development could increase truck traffic on Heckscher Drive and New Berlin Road. Noise from 24/7 operations.',
      investigationNeeded: 'Traffic impact study (state-funded transportation study was proposed). Community engagement on noise, traffic, and economic expectations.',
      confidence: 'verified',
    },
    {
      category: 'Water demand',
      potentialBenefit: 'Existing water infrastructure from the former power plant may reduce the cost of new water supply connections.',
      potentialImpact: 'Data center cooling requires significant water volumes. Duval County water resources may need evaluation.',
      investigationNeeded: 'Consumptive use permit assessment from SJRWMD. Evaluation of reclaimed water availability.',
      confidence: 'inferred',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Site 2: DeSoto County Plant / DCIP Group
// ─────────────────────────────────────────────────────────────────
const desoto: CandidateSite = {
  id: 'desoto',
  name: 'DeSoto County Plant (DCIP Group)',
  classification: 'active_proposal',
  classificationLabel: 'Active Data Center Proposal',
  county: 'DeSoto',
  city: 'Arcadia',
  coordinates: { lat: 27.223170, lon: -81.811582 },
  coordinateSource: { label: 'DeSoto County Plant LLC public site listing, 3800 NE Roan Street', date: '2025' },
  svgPosition: { x: 301.1, y: 223.2 },
  markerColor: '#f59e0b',

  formerUse: {
    value: '~340 MW natural gas turbine plant (two GE 60 Hz gas turbines). Formerly DeSoto County Generating Co LLC. Electricity sold to FPL under a seven-year contract that was not renewed.',
    confidence: 'verified',
    source: { label: 'DeSoto County Plant LLC website; EIA records', date: '2025' },
  },
  currentStatus: {
    value: 'Gas turbines removed. Site purchased by DeSoto County Plant LLC. DCIP Group received zoning approval for Phase 1 (34 acres) in March 2025 for an AI data center. Expansion applications filed for 825+ total acres. DeSoto County commissioners considered a temporary moratorium on data center applications due to scale of proposal. Phase 1 target: 80 MW Tier III campus with on-site natural gas reciprocating engines.',
    confidence: 'verified',
    source: { label: 'DeSoto County planning records; Suncoast Searchlight investigative reporting', date: 'Mar–Jun 2025' },
  },
  ownership: {
    value: 'DeSoto County Plant LLC / DCIP Group',
    confidence: 'verified',
    source: { label: 'DeSoto County property records; DCIP Group website', date: '2025' },
  },
  acreage: {
    value: '34 acres initially rezoned. Expansion to 825+ acres proposed.',
    confidence: 'verified',
    source: { label: 'DeSoto County planning records; Suncoast Searchlight', date: '2025' },
  },
  legacyCapacityMW: {
    value: '~340 MW (retired gas generation; turbines removed)',
    confidence: 'verified',
    source: { label: 'DeSoto County Plant LLC website; EIA records' },
  },
  retirementDate: {
    value: 'FPL contract not renewed; exact date unconfirmed. Turbines subsequently removed.',
    confidence: 'inferred',
    note: 'EIA records show retirement; exact date varies by source.',
  },
  existingInfrastructure: [
    {
      value: 'Florida Gas Transmission pipeline directly adjacent (50 lbs/sec at base load, capacity for three GE 60 Hz turbines). Gas preheating facility on-site.',
      confidence: 'verified',
      source: { label: 'DeSoto County Plant LLC website', date: '2025' },
    },
    {
      value: 'FPL Whidden Substation adjacent to the plant.',
      confidence: 'verified',
      source: { label: 'DeSoto County Plant LLC website', date: '2025' },
    },
    {
      value: '1.5 million gallon diesel fuel storage tank with unloading station.',
      confidence: 'verified',
      source: { label: 'DeSoto County Plant LLC website', date: '2025' },
    },
    {
      value: 'Three-phase electric power on-site.',
      confidence: 'verified',
      source: { label: 'DeSoto County Plant LLC website', date: '2025' },
    },
  ],
  keyUncertainties: [
    'Whether the moratorium on data center applications was enacted by DeSoto County.',
    'Whether Phase 1 construction has begun.',
    'Whether DCIP\'s claimed 4 GW expansion capacity is technically feasible or aspirational marketing.',
    'DCIP Group proposes islanded (off-grid) power generation — regulatory and environmental implications are unclear.',
    'Community water-use concerns: 14% of site contains wetlands and surface waters per county planning documents.',
  ],
  whyIncluded: 'The only Florida site with an active, publicly documented data center redevelopment proposal on a former power plant. Real-world case study demonstrating both the opportunity and the community-compatibility challenges of brownfield-first AI infrastructure.',

  communityOverview: {
    landHabitat: {
      items: [
        { text: 'Initial 34-acre Phase 1 reuses the former gas plant footprint, avoiding new greenfield disturbance.', status: 'documented' },
        { text: 'The 825+ acre expansion extends well beyond the original plant into agricultural land, diminishing the brownfield-first advantage.', status: 'documented' },
        { text: '14% of the site contains wetlands and surface waters per county planning documents.', status: 'documented' },
        { text: 'Wetland delineation and USFWS consultation for listed species have not been completed for the expansion area.', status: 'unknown' },
      ],
    },
    waterEnvironment: {
      items: [
        { text: 'DCIP states they will use reclaimed wastewater and wells for cooling rather than municipal water supply.', status: 'documented' },
        { text: 'DeSoto County has limited water infrastructure for a facility of this scale per county statements.', status: 'documented' },
        { text: 'Disposal of used cooling water is unresolved per county public statements.', status: 'documented' },
        { text: 'Consumptive use permit from SWFWMD has not been obtained.', status: 'unknown' },
      ],
    },
    neighborhoodProtection: {
      items: [
        { text: 'Gas-fired reciprocating engines and data center cooling systems generate continuous noise.', status: 'documented' },
        { text: 'On-site natural gas power generation will produce CO2, NOx, and other emissions. Suncoast Searchlight reported concerns about emissions scale.', status: 'documented' },
        { text: 'DCIP has stated they will mitigate noise impacts, but specific measures have not been published.', status: 'documented' },
        { text: 'Distance to nearest residences and ambient noise baseline have not been publicly assessed.', status: 'unknown' },
      ],
    },
    communityBenefits: {
      items: [
        { text: 'DeSoto County estimates $30M+ annual tax revenue from the project.', status: 'documented' },
        { text: 'DCIP cites 25 jobs in Phase 1 with growth potential — relatively few permanent jobs for the physical scale of the project.', status: 'documented' },
        { text: 'DeSoto County has significant budget challenges that the tax revenue could help address.', status: 'documented' },
        { text: 'Community benefit agreement terms and enforceable commitments have not been publicly documented.', status: 'unknown' },
      ],
    },
    keyQuestionsBeforeApproval: [
      'What specific water source, volume, and disposal plan has been permitted for data center cooling at each phase?',
      'What are the projected CO2 and NOx emissions at full build-out, and how do they compare to existing county emissions?',
      'Was the county moratorium on data center applications enacted, and what conditions were imposed?',
      'What enforceable noise limits will apply, and what is the baseline ambient noise level at the nearest residences?',
      'How will wetlands (14% of site) be protected during the 825-acre expansion?',
      'What binding community benefit commitments (local hiring, tax guarantees, infrastructure improvements) will the county require?',
      'Has an independent economic impact assessment been completed beyond the developer\'s own projections?',
    ],
  },

  tradeoffs: [
    {
      category: 'Brownfield reuse vs. expansion',
      potentialBenefit: 'Reusing a decommissioned gas plant site avoids new greenfield disturbance on the initial 34-acre footprint.',
      potentialImpact: 'The 825+ acre expansion extends well beyond the original plant footprint into agricultural land, diminishing the brownfield-first advantage.',
      investigationNeeded: 'Land-use history for parcels beyond the original plant boundary. Wetland delineation for the 14% of the site identified as wetlands/surface waters.',
      confidence: 'verified',
    },
    {
      category: 'Air quality & emissions',
      potentialBenefit: 'DCIP proposes closed-loop cooling, potentially reducing water discharge impacts compared to older once-through cooling systems.',
      potentialImpact: 'On-site natural gas power generation (reciprocating engines, potentially scaling to turbines) will produce CO2, NOx, and other emissions. Suncoast Searchlight reported concerns that emissions could rival those of small nations at full scale.',
      investigationNeeded: 'Air quality permit assessment. Greenhouse gas emissions modeling at proposed build-out phases.',
      confidence: 'verified',
    },
    {
      category: 'Water resources',
      potentialBenefit: 'DCIP states they will use reclaimed wastewater and wells for cooling rather than municipal water supply.',
      potentialImpact: 'DeSoto County has limited water infrastructure for a facility of this scale. Disposal of used cooling water is unresolved per county statements.',
      investigationNeeded: 'Consumptive use permit from SWFWMD. Evaluation of reclaimed water capacity. Cooling water discharge plan.',
      confidence: 'verified',
    },
    {
      category: 'Community economic impact',
      potentialBenefit: 'County estimates $30M+ annual tax revenue. DCIP cites 25 jobs in Phase 1 with growth potential. DeSoto County has significant budget challenges that the project could help address.',
      potentialImpact: 'Relatively few permanent jobs for a project of this physical scale. Community concerns about industrialization of a rural agricultural area.',
      investigationNeeded: 'Independent economic impact assessment. Community benefit agreement terms.',
      confidence: 'verified',
    },
    {
      category: 'Noise',
      potentialBenefit: 'DCIP has stated they will mitigate noise impacts.',
      potentialImpact: 'Gas-fired reciprocating engines and data center cooling systems generate continuous noise. Nearest residential areas need assessment.',
      investigationNeeded: 'Noise impact study with ambient baseline measurements. Distance to nearest residences.',
      confidence: 'inferred',
    },
    {
      category: 'Habitat & wetlands',
      potentialBenefit: 'Sensitive design around existing wetlands (14% of site) could preserve natural water features.',
      potentialImpact: 'Expansion beyond the original plant footprint could impact wetlands and wildlife habitat in rural DeSoto County.',
      investigationNeeded: 'NWI wetland delineation. USFWS consultation for listed species. Stormwater management plan.',
      confidence: 'verified',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Site 3: Indiantown Cogeneration Plant
// ─────────────────────────────────────────────────────────────────
const indiantown: CandidateSite = {
  id: 'indiantown',
  name: 'Indiantown Cogeneration Plant',
  classification: 'case_study',
  classificationLabel: 'Educational Case Study — Utility-Led Reuse',
  county: 'Martin',
  city: 'Indiantown',
  coordinates: { lat: 27.038889, lon: -80.5125 },
  coordinateSource: { label: 'Florida DEP Conditions of Certification PA 90-31, 13303 SW Silver Fox Lane', date: '2019' },
  svgPosition: { x: 366, y: 233.6 },
  markerColor: '#22c55e',

  formerUse: {
    value: '330 MW (nameplate) / 395 MW (EIA capacity) coal-fired cogeneration plant. Built circa 1992.',
    confidence: 'verified',
    source: { label: 'FL DEP site certification PA 90-31; EIA Form 860', date: '2024' },
  },
  currentStatus: {
    value: 'FPL purchased the plant in 2017 specifically to retire it. Formally closed Dec 31, 2020 (FPL\'s last coal plant). 495-foot stack and coal chute imploded 2021. FPL built the Monarch Solar Energy Center on land southwest of the demolished plant, using existing grid infrastructure. FPL stated it will "explore opportunities to use parts of the plant site for future clean energy solutions."',
    confidence: 'verified',
    source: { label: 'FPL press releases (2020, 2021, 2023); FL DEP records', date: '2023' },
  },
  ownership: {
    value: 'Florida Power & Light Company (NextEra Energy subsidiary)',
    confidence: 'verified',
    source: { label: 'FL DEP site certification', date: '2024' },
  },
  acreage: {
    value: 'Plant footprint approximately 200+ acres. Exact boundary requires county parcel verification.',
    confidence: 'inferred',
    note: 'Estimated from satellite imagery and DEP certification boundaries. Not independently verified at the parcel level.',
  },
  legacyCapacityMW: {
    value: '330–395 MW (retired coal generation)',
    confidence: 'verified',
    source: { label: 'FL DEP (330 MW nameplate); EIA-860 (395 MW)', date: '2024' },
  },
  retirementDate: {
    value: 'December 31, 2020',
    confidence: 'verified',
    source: { label: 'FPL press release', date: 'Jan 2021' },
  },
  existingInfrastructure: [
    {
      value: 'Grid interconnection from coal plant era. FPL is using portions for solar connections.',
      confidence: 'verified',
      source: { label: 'FPL press release on Monarch Solar Energy Center', date: '2023' },
    },
    {
      value: 'Adjacent to the active FPL Martin Power Plant (2,150 MW gas combined-cycle + 75 MW solar).',
      confidence: 'verified',
      source: { label: 'FL DEP site certification PA 89-27; EIA-860', date: '2024' },
    },
    {
      value: 'SW Warfield Boulevard / SR 76 access.',
      confidence: 'verified',
      source: { label: 'FL DEP site certification address', date: '2024' },
    },
  ],
  keyUncertainties: [
    'Site is owned by FPL/NextEra with stated clean-energy reuse plans. Almost certainly not available for third-party data center development.',
    'Exact acreage and remaining demolition status need county-level parcel verification.',
    'Coal combustion residual contamination status is unknown from public records.',
    'Whether FPL plans additional solar or other clean energy beyond Monarch Solar Energy Center.',
  ],
  whyIncluded: 'Educational case study demonstrating a utility-led coal-to-solar transition on a brownfield site. Shows how the brownfield-first principle is already being applied in Florida by the site owner. Not presented as an available development opportunity.',

  communityOverview: {
    landHabitat: {
      items: [
        { text: 'FPL demolished the coal plant and is reusing the site for the Monarch Solar Energy Center — a direct brownfield-to-solar transition.', status: 'documented' },
        { text: 'Portions of the former plant footprint not used for solar could potentially be restored to native Florida habitat.', status: 'possible' },
        { text: 'If FPL pursues maximum solar build-out on available land, habitat restoration opportunities may be limited.', status: 'possible' },
        { text: 'Site-specific ecological assessment of cleared land and NWI wetland status have not been published.', status: 'unknown' },
      ],
    },
    waterEnvironment: {
      items: [
        { text: 'Solar energy centers do not require cooling water, eliminating one of coal generation\'s largest environmental impacts.', status: 'documented' },
        { text: 'Coal combustion residual contamination status for the former plant footprint is unknown from public records.', status: 'unknown' },
        { text: 'FL DEP cleanup records and CCR Rule compliance for the former coal facility should be evaluated.', status: 'unknown' },
      ],
    },
    neighborhoodProtection: {
      items: [
        { text: 'Solar energy centers produce no combustion noise, emissions, or truck traffic — significant improvement over the former coal operations.', status: 'documented' },
        { text: 'Visual character of the area changes from industrial power plant to low-profile solar arrays.', status: 'documented' },
        { text: 'Adjacent to the active FPL Martin Power Plant (2,150 MW gas combined-cycle), which remains an industrial neighbor.', status: 'documented' },
      ],
    },
    communityBenefits: {
      items: [
        { text: 'Solar energy center generates property tax revenue for Martin County.', status: 'documented' },
        { text: 'FPL press materials describe Martin County as a "great success story" for coal-to-solar transition.', status: 'documented' },
        { text: 'Solar facilities create fewer permanent local jobs than the former coal plant operations did.', status: 'documented' },
        { text: 'Comparison of local tax revenue and employment before (coal) and after (solar) has not been independently published.', status: 'unknown' },
      ],
    },
    keyQuestionsBeforeApproval: [
      'What is the contamination status of the former coal plant footprint? Have coal combustion residuals been fully remediated?',
      'How much additional solar or clean energy capacity could be sited on the remaining former plant acreage?',
      'What is the net change in local tax revenue and employment from the coal-to-solar transition?',
      'Are there opportunities for native habitat restoration on portions of the site not needed for solar arrays?',
      'What long-term groundwater monitoring, if any, is required for the former coal plant area?',
    ],
  },

  tradeoffs: [
    {
      category: 'Coal-to-solar transition',
      potentialBenefit: 'FPL\'s reuse of the coal plant\'s grid interconnection for the Monarch Solar Energy Center demonstrates practical brownfield-first thinking — existing infrastructure reduces cost and avoids new land disturbance.',
      potentialImpact: 'Solar development requires significant acreage. Whether the full former coal plant footprint is usable for solar depends on contamination status.',
      investigationNeeded: 'Phase I/II ESA for coal combustion residuals. Evaluation of how much additional solar capacity could be sited on the remaining footprint.',
      confidence: 'verified',
    },
    {
      category: 'Brownfield remediation',
      potentialBenefit: 'Demolition of the coal plant and stack (2021) is a significant step. Proper remediation of the former coal footprint would improve environmental conditions in the Village of Indiantown.',
      potentialImpact: 'If coal combustion residuals were not fully remediated during demolition, long-term groundwater monitoring may be needed.',
      investigationNeeded: 'FL DEP cleanup records. CCR Rule compliance status for the former coal facility.',
      confidence: 'inferred',
    },
    {
      category: 'Community economic transition',
      potentialBenefit: 'The solar energy center generates tax revenue and demonstrates economic life after coal closure. FPL press materials highlight Martin County as a "great success story."',
      potentialImpact: 'Solar facilities create fewer permanent local jobs than the former coal plant did. Net community economic impact depends on property tax revenue from solar vs. coal.',
      investigationNeeded: 'Comparison of local tax revenue and employment before (coal) and after (solar).',
      confidence: 'inferred',
    },
    {
      category: 'Native habitat restoration',
      potentialBenefit: 'Portions of the former plant site not used for solar could be restored to native Florida habitat, benefiting local ecosystems in rural Martin County.',
      potentialImpact: 'If FPL pursues maximum solar build-out on available land, restoration opportunities may be limited.',
      investigationNeeded: 'Site-specific ecological assessment of cleared land. NWI wetland status. USFWS consultation.',
      confidence: 'illustrative',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Site 4: Escambia Wood Treating / Mid-Town Commerce Park
// ─────────────────────────────────────────────────────────────────
const escambia: CandidateSite = {
  id: 'escambia',
  name: 'Escambia Wood Treating / Mid-Town Commerce Park',
  classification: 'redevelopment_opportunity',
  classificationLabel: 'Potential Redevelopment Opportunity',
  county: 'Escambia',
  city: 'Pensacola',
  coordinates: { lat: 30.4553, lon: -87.2317 },
  coordinateSource: { label: 'EPA NPL location data, 3910 North Palafox Street', date: '2008' },
  svgPosition: { x: 30.1, y: 40.8 },
  markerColor: '#8b5cf6',

  formerUse: {
    value: 'Wood-treating (creosote and pentachlorophenol) manufacturing facility. Operated 1942–1982 by Escambia Wood Treating Company.',
    confidence: 'verified',
    source: { label: 'EPA Superfund Site Profile; NPL listing 1994', url: 'https://www.epa.gov/superfund-redevelopment/superfund-sites-reuse-florida', date: '2024' },
  },
  currentStatus: {
    value: 'EPA Superfund site. Soil cleanup completed 2010. EPA issued Ready for Reuse Determination in 2013 for commercial and industrial use. 70 acres transferred to Escambia County in 2018 for Mid-Town Commerce Park development. Groundwater cleanup (OU-2) funded by Infrastructure Investment and Jobs Act ($40M, 2021). Land use restricted by recorded restrictive covenants to commercial/industrial/manufacturing only.',
    confidence: 'verified',
    source: { label: 'EPA Region 4 Annual Report 2018; EPA Ready for Reuse Determination 2013; EPA OIG Report', date: '2013–2024' },
  },
  ownership: {
    value: '~70 acres: Escambia County. ~15 acres: City of Pensacola. ~15 acres: EPA (OU-2 groundwater treatment area).',
    confidence: 'verified',
    source: { label: 'EPA Five-Year Review; EPA Region 4 records', date: '2022' },
  },
  acreage: {
    value: '~100 acres total (31.8-acre former facility + ~70 acres former residential areas).',
    confidence: 'verified',
    source: { label: 'EPA Superfund site documentation', date: '2022' },
  },
  legacyCapacityMW: {
    value: 'N/A — Industrial manufacturing site, not a power plant.',
    confidence: 'verified',
  },
  retirementDate: {
    value: 'Wood treating operations ceased 1982. Company filed bankruptcy 1991.',
    confidence: 'verified',
    source: { label: 'EPA Superfund site profile', date: '2024' },
  },
  existingInfrastructure: [
    {
      value: 'Water, sewer, electric, and natural gas utilities available.',
      confidence: 'verified',
      source: { label: 'EPA Ready for Reuse Fact Sheet', date: '2013' },
    },
    {
      value: 'Adjacent to railroad access.',
      confidence: 'verified',
      source: { label: 'EPA Ready for Reuse Fact Sheet', date: '2013' },
    },
    {
      value: '1.4 miles to I-110. Within 5 miles of Port of Pensacola, Pensacola International Airport, and I-10.',
      confidence: 'verified',
      source: { label: 'EPA Ready for Reuse Fact Sheet', date: '2013' },
    },
    {
      value: 'Population within 1 mile: 8,188; within 3 miles: 69,735; within 5 miles: 148,797.',
      confidence: 'verified',
      source: { label: 'EPA Ready for Reuse Fact Sheet', date: '2013' },
    },
  ],
  keyUncertainties: [
    'Whether groundwater cleanup (OU-2) is complete or still active. IIJA funding was allocated in 2021.',
    'Whether any parcels have been sold or developed since the 2018 transfer to Escambia County.',
    'The site has no legacy power-generation interconnection — electrical capacity for a data center would need to be established from utility service lines.',
    'EPA OIG report (2024) noted insufficient engineering controls and poorly enforced institutional controls at the site.',
    'Restrictive covenants prohibit residential use, recreation, mining, and agriculture. Groundwater use is prohibited.',
  ],
  whyIncluded: 'The only non-power-plant site in the shortlist. Demonstrates the full brownfield lifecycle: contamination, 400+ household relocation, EPA Superfund cleanup, Ready for Reuse certification, and county-led redevelopment planning. Tests the Environmental Restoration & Community Compatibility framework with a site where remediation and community displacement are documented realities.',

  communityOverview: {
    landHabitat: {
      items: [
        { text: 'Redevelopment of a contaminated, vacant industrial site avoids any new greenfield disturbance.', status: 'documented' },
        { text: 'EPA soil cleanup completed 2010. Ready for Reuse Determination issued 2013 for commercial/industrial use.', status: 'documented' },
        { text: 'Native Florida landscaping could transform a blighted site into an attractive commerce park, improving the neighborhood aesthetic.', status: 'possible' },
        { text: 'Restrictive covenants require compatible surface cover; landscaping must be coordinated with EPA institutional controls.', status: 'documented' },
      ],
    },
    waterEnvironment: {
      items: [
        { text: 'Groundwater contamination (creosote, PCP, dioxins) remains under active remediation funded by IIJA ($40M, 2021).', status: 'documented' },
        { text: 'A containment cell on OU-1 requires ongoing surface protection; construction must not damage it.', status: 'documented' },
        { text: '33+ groundwater monitoring wells on-site must remain accessible and undisturbed.', status: 'documented' },
        { text: 'Groundwater use on-site is prohibited by EPA restrictive covenants.', status: 'documented' },
        { text: 'Status of OU-2 groundwater cleanup completion is not confirmed from public records.', status: 'unknown' },
      ],
    },
    neighborhoodProtection: {
      items: [
        { text: 'Population within 1 mile: 8,188 — this is an urban location requiring careful attention to neighborhood impacts.', status: 'documented' },
        { text: '400+ households were permanently relocated due to contamination — redevelopment must be sensitive to this community history.', status: 'documented' },
        { text: 'Restrictive covenants prohibit residential use, recreation, mining, and agriculture on the site.', status: 'documented' },
        { text: 'EPA OIG report (2024) noted insufficient engineering controls and poorly enforced institutional controls.', status: 'documented' },
      ],
    },
    communityBenefits: {
      items: [
        { text: 'EPA estimated full buildout of Mid-Town Commerce Park could support 1,700+ jobs and $132M annual employee income.', status: 'documented' },
        { text: 'County estimated $4.4M in annual local tax revenue at full buildout.', status: 'documented' },
        { text: 'Redevelopment could restore economic vitality to a neighborhood that lost 400+ households.', status: 'possible' },
        { text: 'Environmental justice screening (EJScreen) and a community benefit agreement are appropriate given the site history.', status: 'possible' },
        { text: 'Whether any parcels have been sold or developed since the 2018 transfer to Escambia County is unconfirmed.', status: 'unknown' },
      ],
    },
    keyQuestionsBeforeApproval: [
      'What is the current status of OU-2 groundwater cleanup? Is remediation on schedule?',
      'How will construction activities be coordinated with the existing containment cell and 33+ monitoring wells?',
      'What community engagement has been conducted with residents and former residents who were displaced?',
      'Have the institutional control enforcement gaps identified in the EPA OIG report (2024) been addressed?',
      'What specific environmental justice considerations apply, and has an EJScreen analysis been completed?',
      'What enforceable community benefit commitments (local hiring, job training, neighborhood improvements) will be required?',
      'Unlike retired power plant sites, there is no legacy high-voltage interconnection — what is the utility capacity for the Pensacola distribution network?',
    ],
  },

  tradeoffs: [
    {
      category: 'Brownfield remediation & restoration',
      potentialBenefit: 'Soil cleanup is complete (2010). Redevelopment under the Mid-Town Commerce Park plan would bring economic activity to a site that has been contaminated and vacant for decades. EPA estimated full buildout could support 1,700+ jobs and $132M annual income.',
      potentialImpact: 'Groundwater contamination (creosote, PCP, dioxins) remains under active remediation. A containment cell on OU-1 requires ongoing surface protection. Construction activity must be compatible with the remedy.',
      investigationNeeded: 'Status of OU-2 groundwater cleanup. Compliance with EPA restrictive covenants. Evaluation of containment cell integrity and buffer zones.',
      confidence: 'verified',
    },
    {
      category: 'Community justice & displacement',
      potentialBenefit: 'Redevelopment of the site as a commerce park could begin to restore economic vitality to a neighborhood that lost 400+ households to contamination-related relocation.',
      potentialImpact: 'The surrounding community experienced decades of contamination exposure and displacement. Redevelopment must be sensitive to this history and provide tangible community benefits.',
      investigationNeeded: 'Community engagement with residents and former residents. Environmental justice screening (EJScreen). Community benefit agreement appropriate to the site\'s history.',
      confidence: 'verified',
    },
    {
      category: 'Stormwater & groundwater protection',
      potentialBenefit: 'Modern stormwater systems required for any new development would improve surface water management. Impervious surfaces over remediated soil can serve as an additional protective layer.',
      potentialImpact: 'Construction must not damage the containment cell or interfere with groundwater monitoring wells (33+ wells on site).',
      investigationNeeded: 'Site-specific engineering review for compatibility with EPA remedy. NWFWMD stormwater permit requirements.',
      confidence: 'verified',
    },
    {
      category: 'Electrical infrastructure',
      potentialBenefit: 'Utility services (including electric) are available at the site. Proximity to I-110 and Pensacola urban area provides access to Gulf Power/FPL distribution network.',
      potentialImpact: 'Unlike retired power plant sites, there is no legacy high-voltage transmission interconnection. Establishing data-center-scale power delivery would require new substation or feeder construction.',
      investigationNeeded: 'Utility capacity assessment from Gulf Power/FPL for the Pensacola distribution network. Feasibility of establishing sufficient power delivery to the site.',
      confidence: 'inferred',
    },
    {
      category: 'Native landscaping & visual improvement',
      potentialBenefit: 'Redevelopment offers a chance to transform a blighted industrial site into a visually attractive commerce park with native Florida landscaping, improving the neighborhood aesthetic.',
      potentialImpact: 'Industrial development without adequate landscaping standards could replicate the visual blight of the former industrial use.',
      investigationNeeded: 'Escambia County landscape requirements. Compatibility with EPA institutional controls regarding surface cover.',
      confidence: 'illustrative',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Export all sites
// ─────────────────────────────────────────────────────────────────
export const CANDIDATE_SITES: CandidateSite[] = [
  stJohns,
  desoto,
  indiantown,
  escambia,
];
