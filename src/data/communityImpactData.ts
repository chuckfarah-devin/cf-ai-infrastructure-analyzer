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
          text: 'The active proposal includes on-site natural-gas reciprocating generation, and public reporting has documented community concern about continuous industrial noise.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County planning records; Suncoast Searchlight', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'DCIP has stated that noise impacts would be mitigated, but specific measures and independently reviewed performance have not been published.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'DCIP public statements reported in local coverage', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'No verified ambient baseline, final equipment inventory, receptor analysis, or enforceable operating limit is available in the current research.',
          evidenceType: 'unresolved',
          confidence: 'unknown',
        },
        {
          text: 'Potential conditions could require independent nighttime measurements, equipment-specific modeling, testing-hour restrictions, and post-opening compliance reports.',
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
          text: 'County records and reporting identify limited water infrastructure, wetlands and surface waters in the broader proposal area, and unresolved cooling-water disposal questions.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County planning records; Suncoast Searchlight', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'DCIP has stated that reclaimed wastewater and wells could supply cooling and has described closed-loop cooling.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'DCIP public materials and statements', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'Permitted source capacity, withdrawal, consumption, well yield, reclaimed-water availability, drought response, and wastewater disposition remain unresolved.',
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
          text: 'The initial phase reuses a former industrial site, while the proposed expansion extends into a broader rural agricultural setting.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County planning records; Suncoast Searchlight', date: '2025', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'No independently verified viewshed, nighttime photometric plan, equipment-screening plan, or binding native-landscape commitment has been identified.',
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
          text: 'The initial site is accessed from NE Roan Street, and the proposed project scale expanded substantially beyond the original plant footprint.',
          evidenceType: 'documented',
          confidence: 'verified',
          source: { label: 'DeSoto County planning records; DeSoto County Plant site listing', date: '2025', url: 'https://www.desotocountyplant.com/' },
        },
        {
          text: 'Published tax and employment figures are county or developer projections, not guaranteed community outcomes.',
          evidenceType: 'developer-statement',
          confidence: 'verified',
          source: { label: 'County estimates and DCIP public materials reported in coverage', date: '2025–2026', url: 'https://suncoastsearchlight.org/desoto-county-data-center-florida/' },
        },
        {
          text: 'Construction traffic, road capacity, emergency response, utility-upgrade responsibility, tax terms, and enforceable community benefits remain unresolved.',
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
