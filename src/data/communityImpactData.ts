import type { ConfidenceLevel, SourceCitation } from './siteExplorerData';

export type CommunityEvidenceType = 'documented' | 'developer-statement' | 'potential-protection' | 'unresolved';
export type CommunityImpactCategoryId = 'noise' | 'water' | 'lighting' | 'traffic';

export interface CommunityImpactItem {
  text: string;
  evidenceType: CommunityEvidenceType;
  confidence: ConfidenceLevel;
  source?: SourceCitation;
}

export interface CommunityImpactCategory {
  id: CommunityImpactCategoryId;
  title: string;
  items: CommunityImpactItem[];
}

export interface CommunityImpactProfile {
  siteId: string;
  categories: CommunityImpactCategory[];
}

const stJohns: CommunityImpactProfile = {
  siteId: 'st-johns',
  categories: [
    {
      id: 'noise',
      title: 'Noise & Neighborhood Quiet',
      items: [
        {
          text: 'JEA is planning mixed industrial reuse, including new natural-gas generation on part of the former power-plant property.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'JEA board filings; Jacksonville reporting', date: '2025', url: 'https://www.jacksonville.com/story/news/local/2024/03/06/jea-renews-work-on-redeveloping-st-johns-river-power-park/72771795007/' },
        },
        {
          text: 'No site-specific data-center equipment schedule, acoustic study, nighttime baseline, or enforceable noise commitment has been identified.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'A future review could require independent daytime and nighttime baseline measurements, equipment-specific modeling, and public compliance reporting.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
    {
      id: 'water',
      title: 'Water Use & Protection',
      items: [
        {
          text: 'Florida DEP updated the site groundwater-monitoring requirements after demolition, and JEA maintains coal-combustion-residual compliance records.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'Florida DEP Modification Q; JEA CCR compliance records', date: '2023–2025', url: 'https://www.jea.com/Environment/Compliance_and_Reporting/CCR_Rule_Compliance_Data_and_Information/' },
        },
        {
          text: 'No data-center cooling technology, water source, withdrawal, consumption, or wastewater plan is documented for this site.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'A future approval could require separate reporting of water withdrawn, consumed, and discharged, plus proof that construction will not interfere with monitoring or corrective action.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
    {
      id: 'lighting',
      title: 'Lighting & Visual Impact',
      items: [
        {
          text: 'The redevelopment area is industrial, but existing research identifies views from New Berlin Road, Heckscher Drive, and areas west of the site as requiring evaluation.',
          evidenceType: 'documented',
          confidence: 'inferred',
          source: { label: 'JEA site planning and Jacksonville reporting', date: '2024', url: 'https://www.jacksonville.com/story/news/local/2024/03/06/jea-renews-work-on-redeveloping-st-johns-river-power-park/72771795007/' },
        },
        {
          text: 'No data-center building design, nighttime photometric plan, verified viewshed, or approved landscape-screening plan has been identified.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'Potential conditions could include shielded lighting, equipment screening, and native landscaping compatible with utilities, monitoring wells, safety, and habitat protection.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
    {
      id: 'traffic',
      title: 'Traffic & Community Infrastructure',
      items: [
        {
          text: 'The site uses New Berlin Road, contains rail access, and is near I-295 and JaxPort. A new Blount Island Boulevard connection and transportation study have been proposed.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'JEA site plan; Jacksonville Times-Union; FDOT context', date: '2024', url: 'https://www.jacksonville.com/story/news/local/2024/03/06/jea-renews-work-on-redeveloping-st-johns-river-power-park/72771795007/' },
        },
        {
          text: 'JEA has described Gateway Commerce Center as a major economic-development opportunity for Jacksonville’s Northside.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'JEA statements reported by Jacksonville media', date: '2024', url: 'https://www.jacksonville.com/story/news/local/2024/03/06/jea-renews-work-on-redeveloping-st-johns-river-power-park/72771795007/' },
        },
        {
          text: 'Project-specific construction trips, emergency-response needs, road improvements, tax effects, local hiring, and binding community commitments remain unknown.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'A future agreement could assign road-upgrade costs and make local hiring, workforce training, complaint response, and public reporting enforceable.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
  ],
};

const desoto: CommunityImpactProfile = {
  siteId: 'desoto',
  categories: [
    {
      id: 'noise',
      title: 'Noise & Neighborhood Quiet',
      items: [
        {
          text: 'On March 24, 2026 the Board of County Commissioners adopted Ordinance 2026-004 with conditions including a 55-dBA noise limit at 200 feet from all property lines, per the meeting minutes.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County BOCC minutes, March 24, 2026', date: '2026', url: 'https://desotobocc.legistar1.com/desotobocc/meetings/2026/3/3776_M_Board_of_County_Commissioners_26-03-24_Meeting_Minutes.pdf' },
        },
        {
          text: 'DCIP has stated that noise impacts would be mitigated, but no equipment inventory, acoustic model, or post-opening monitoring requirement has been published.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'DCIP public statements reported in local coverage', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'The adopted limit binds at the improvement-plan stage; no ambient baseline, receptor analysis, or demonstrated operational compliance exists yet.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'Potential follow-on measures could require independent nighttime measurements, equipment-specific modeling, and post-opening compliance reporting for Phase 1 and any expansion.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
    {
      id: 'water',
      title: 'Water Use & Protection',
      items: [
        {
          text: 'County records identify limited water infrastructure and wetlands/surface waters in the proposal area; the adopted moratorium ordinance lists water supply, reclaimed water, and wastewater capacity as unstudied countywide impacts.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County Ordinance 2026-016, Legistar File 26-1906; Development Review Report', date: '2026', url: 'https://desotobocc.legistar.com/LegislationDetail.aspx?GUID=8499016F-34CC-40A8-8083-74099AD0DEFB&ID=8142423&Options=&Search=' },
        },
        {
          text: 'At the March 24, 2026 hearing the board directed DCIP to explore reclaimed-water feasibility with the City of Arcadia and return findings at the improvement-plan stage — a directive to investigate, not proof of availability or use.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County BOCC minutes, March 24, 2026', date: '2026', url: 'https://desotobocc.legistar1.com/desotobocc/meetings/2026/3/3776_M_Board_of_County_Commissioners_26-03-24_Meeting_Minutes.pdf' },
        },
        {
          text: 'DCIP has stated that reclaimed wastewater and wells could supply cooling and has described closed-loop cooling.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'DCIP public materials and statements', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'Permitted source capacity, withdrawal volume, consumption, well yield, reclaimed-water availability, drought response, and wastewater disposition remain unresolved — no SWFWMD permit is documented.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'Potential conditions could require separate metering of withdrawal and consumption, public reporting, drought provisions, and an approved wastewater plan before each phase.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
    {
      id: 'lighting',
      title: 'Lighting & Visual Impact',
      items: [
        {
          text: 'Approved Phase 1 (34.22 acres) reuses the former plant site; two pending applications totaling 828.05 acres extend into a broader rural agricultural setting and are not approved.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County Data Center Applications page', date: '2026', url: 'https://desotobocc.com/431/Data-Center-Applications' },
        },
        {
          text: 'Adopted conditions per the March 24, 2026 minutes require a photometric plan showing no light trespass and perimeter landscape buffering — improvement-plan requirements, not demonstrated nighttime performance.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County BOCC minutes, March 24, 2026', date: '2026', url: 'https://desotobocc.legistar1.com/desotobocc/meetings/2026/3/3776_M_Board_of_County_Commissioners_26-03-24_Meeting_Minutes.pdf' },
        },
        {
          text: 'No independently verified viewshed analysis, published photometric design, or operational monitoring exists yet.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'Potential conditions could include fully shielded lighting, native buffers, equipment screening, and maintenance obligations that remain compatible with wetlands and utilities.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
    {
      id: 'traffic',
      title: 'Traffic & Community Infrastructure',
      items: [
        {
          text: 'The initial site is accessed from NE Roan Street; the two pending expansion applications would grow DCIP-related plans from the 34.22 approved acres to roughly 862 acres total.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County Data Center Applications page', date: '2026', url: 'https://desotobocc.com/431/Data-Center-Applications' },
        },
        {
          text: 'A one-year countywide data-center application moratorium was adopted July 28, 2026 (Ordinance 2026-016), but it exempts the approved Phase 1 project and both pending applications, which continue under normal procedures.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County Ordinance 2026-016, Legistar File 26-1906', date: '2026', url: 'https://desotobocc.legistar.com/LegislationDetail.aspx?GUID=8499016F-34CC-40A8-8083-74099AD0DEFB&ID=8142423&Options=&Search=' },
        },
        {
          text: 'Published tax and employment figures are county or developer projections, not guaranteed community outcomes.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'County estimates and DCIP public materials reported in coverage', date: '2025–2026', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'Construction traffic, road capacity, emergency response, utility-upgrade responsibility, tax terms, and enforceable community benefits remain unresolved; expansion hearings are pending.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'Potential conditions could assign infrastructure costs and establish binding local hiring, training, emergency-response, and public-reporting commitments.',
          evidenceType: 'potential-protection',
          confidence: 'illustrative',
        },
      ],
    },
  ],
};

export const COMMUNITY_IMPACT_PROFILES: CommunityImpactProfile[] = [stJohns, desoto];
