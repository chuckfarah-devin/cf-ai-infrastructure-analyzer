import type { SourceCitation } from './siteExplorerData';

export type FacilityVisionSceneId =
  | 'st-johns-neighborhood'
  | 'st-johns-landscape'
  | 'st-johns-facility'
  | 'indiantown-energy-reuse'
  | 'indiantown-landscape-stewardship'
  | 'desoto-neighborhood'
  | 'desoto-landscape'
  | 'desoto-facility'
  | 'escambia-remedy-first'
  | 'escambia-conditional-reuse';

export type FacilityVisionIconId = 'community' | 'landscape' | 'infrastructure' | 'energy' | 'stewardship' | 'evidence';
export type FacilityVisionGalleryLayout = 'two' | 'three';
export type FacilityVisionEvidenceType = 'documented' | 'developer-statement' | 'potential-protection' | 'unresolved';

export interface FacilityVisionIntroNote {
  icon: FacilityVisionIconId;
  title: string;
  text: string;
}

export interface FacilityVisionEvidenceNote {
  type: FacilityVisionEvidenceType;
  text: string;
  source?: SourceCitation;
}

export interface FacilityVisionPerspective {
  id: string;
  sceneId: FacilityVisionSceneId;
  icon: FacilityVisionIconId;
  title: string;
  subtitle: string;
  designIntent: string;
  ideas: string[];
  limitations: string[];
  questions: string[];
}

export interface FacilityVisionProfile {
  siteId: string;
  title: string;
  subtitle: string;
  galleryLayout: FacilityVisionGalleryLayout;
  introNotes: FacilityVisionIntroNote[];
  evidenceNotes?: FacilityVisionEvidenceNote[];
  perspectives: FacilityVisionPerspective[];
}

export const FACILITY_VISION_PROFILES: FacilityVisionProfile[] = [
  {
    siteId: 'st-johns',
    title: 'Responsible Facility Vision',
    subtitle:
      'Educational design possibilities for AI infrastructure — not a proposed architectural style, site plan, or statement that the site is suitable for redevelopment.',
    galleryLayout: 'three',
    introNotes: [
      {
        icon: 'infrastructure',
        title: 'Architectural character',
        text: 'Warm materials, shaded overhangs, articulated facade sections, fins, and architectural screening reduce generic warehouse-like massing.',
      },
      {
        icon: 'landscape',
        title: 'Landscape integration',
        text: 'Native planting and symbolic habitat connections are design ideas only; environmental suitability and locations require separate verification.',
      },
      {
        icon: 'community',
        title: 'Practical infrastructure',
        text: 'Cooling equipment, electrical systems, service access, and security are acknowledged rather than hidden behind decorative landscaping.',
      },
    ],
    evidenceNotes: [
      {
        type: 'documented',
        text: 'The 1,252 MW coal plant ceased operations in 2018 and was demolished. JEA’s board approved a $1.57B, 675 MW natural-gas combined-cycle plant on ~40 acres of the site in August 2025, and a zoning exception received planning-commission approval in November 2025.',
        source: {
          label: 'JEA board records; Jacksonville Times-Union; EIA Form 860',
          date: '2018–2025',
          url: 'https://www.eia.gov/electricity/data/eia860/',
        },
      },
      {
        type: 'developer-statement',
        text: 'JEA, as owner, is marketing the remaining ~960 acres as “Gateway Commerce Center” for industrial and logistics redevelopment. That is the owner’s reuse direction — not a development approval for any specific tenant or facility type, including data centers.',
        source: {
          label: 'JEA board materials and site marketing',
          date: '2023–2025',
        },
      },
      {
        type: 'unresolved',
        text: 'Not established by public records: remaining grid-interconnection capacity after the new gas plant, whether any acreage is being marketed specifically for data-center use, and the environmental condition of the former coal footprint including coal combustion residuals.',
      },
      {
        type: 'potential-protection',
        text: 'The native screening, shielded lighting, stormwater concepts, and landscape edges in these scenes are design ideas only. No landscape plan, photometric plan, or acoustic analysis has been adopted for this site, and none is implied by the illustrations.',
      },
    ],
    perspectives: [
      {
        id: 'neighborhood',
        sceneId: 'st-johns-neighborhood',
        icon: 'community',
        title: 'Neighborhood Perspective',
        subtitle: 'A public-facing edge with warmth, screening, and visual restraint',
        designIntent:
          'Explore how necessary infrastructure could have a composed architectural presence rather than appearing as an unbroken industrial box.',
        ideas: [
          'Warm earth-tone masonry or textured precast panels could create lower, more grounded facade sections.',
          'Deep shaded overhangs, varied facade bays, and an understated entrance could reduce warehouse-like massing.',
          'Vertical fins, perforated metal screens, and noncombustible wood-look finishes could soften large wall surfaces.',
          'Layered native trees and understory planting could create a greener public-facing edge.',
          'Shielded, downward-directed lighting and screened mechanical areas could reduce visual clutter.',
        ],
        limitations: [
          'No street location, setback, property boundary, residence, distance, or approved landscape plan is depicted.',
          'Vegetation is symbolic and is not represented as a substitute for acoustic engineering or equipment controls.',
          'Facade materials, equipment locations, and lighting details are design ideas only.',
        ],
        questions: [
          'Which verified public viewpoints and sensitive receptors would require analysis?',
          'What landscape buffer, maintenance, and replacement commitments would be enforceable?',
          'What photometric plan and operating hours would control nighttime lighting?',
          'What independent acoustic analysis would determine equipment location and enclosure requirements?',
        ],
      },
      {
        id: 'landscape',
        sceneId: 'st-johns-landscape',
        icon: 'landscape',
        title: 'Landscape & Habitat Perspective',
        subtitle: 'A landscape-integrated campus concept with symbolic habitat connections',
        designIntent:
          'Explore how a large facility could use articulated massing and designed landscape edges while environmental suitability is investigated separately.',
        ideas: [
          'Multiple articulated facade sections and varied roofline treatments could reduce the apparent scale of large buildings.',
          'Native planting, layered edges, and shaded pedestrian areas could soften the transition between development and open landscape.',
          'Stormwater planting is shown only as a conceptual possibility subject to engineering and environmental feasibility.',
          'A dashed habitat-connection symbol illustrates one planning idea; it does not identify an actual corridor or restoration location.',
          'Verified wetlands, flood hazards, conservation lands, aquatic preserves, and shoreline context remain in the separate GIS view.',
        ],
        limitations: [
          'No mapped wetland, parcel, restoration footprint, habitat corridor, buildable area, or development boundary is depicted.',
          'Previously disturbed land is not established as buildable or suitable for redevelopment by this concept.',
          'No wetland impact, mitigation location, stormwater design, or environmental approval is implied.',
        ],
        questions: [
          'What wetland delineation, flood review, ecological survey, and contamination assessment would be required?',
          'Could habitat connections be protected or enhanced without displacing required remediation or wetland protection?',
          'What stormwater approach is technically feasible and permittable at a specific location?',
          'Which areas, if any, are actually suitable for development after site-specific constraints are verified?',
        ],
      },
      {
        id: 'facility',
        sceneId: 'st-johns-facility',
        icon: 'infrastructure',
        title: 'Complete Facility Perspective',
        subtitle: 'Practical infrastructure with architectural articulation and honest utility elements',
        designIntent:
          'Show that data-center buildings, cooling equipment, electrical infrastructure, access, and security can be acknowledged directly while still receiving thoughtful design treatment.',
        ideas: [
          'Modular data halls could use textured panels, warm materials, varied bays, fins, and shaded openings rather than blank warehouse walls.',
          'Cooling equipment could be consolidated behind architectural screening without hiding that the equipment exists.',
          'Electrical infrastructure could be shown honestly within a controlled and landscaped service area.',
          'A controlled entrance, service route, fencing, lighting, and emergency access can be coordinated rather than treated as afterthoughts.',
          'Native landscape areas could soften edges while preserving operational clearance and maintainability.',
        ],
        limitations: [
          'No building count, dimensions, cooling technology, electrical capacity, site layout, or security design is proposed.',
          'Equipment symbols are generic and do not establish engineering, water use, energy supply, interconnection, or permitting feasibility.',
          'Access, safety, and security elements are educational illustrations and are not an operational plan.',
        ],
        questions: [
          'What cooling technology and water source would actually be selected and permitted?',
          'What electrical infrastructure and interconnection capacity would be confirmed by engineering studies?',
          'How would emergency access, fire protection, security, and service circulation be designed?',
          'What architectural and landscape standards would be enforceable through approval conditions?',
        ],
      },
    ],
  },
  {
    siteId: 'indiantown',
    title: 'Responsible Energy-Site Reuse',
    subtitle:
      'Educational design possibilities for utility-led energy-site reuse — not a development proposal, site plan, or statement that the former plant property is available.',
    galleryLayout: 'two',
    introNotes: [
      {
        icon: 'energy',
        title: 'Documented transition context',
        text: 'FPL retired and demolished the coal plant and built Monarch Solar on land southwest of the former plant, reusing portions of existing grid infrastructure.',
      },
      {
        icon: 'stewardship',
        title: 'Stewardship possibilities',
        text: 'Native groundcover, landscape screening, stormwater planting, and habitat connections are design principles—not documented restoration work.',
      },
      {
        icon: 'evidence',
        title: 'Availability not established',
        text: 'The property remains FPL-owned. These scenes do not identify available land, future clean-energy projects, or a third-party development opportunity.',
      },
    ],
    evidenceNotes: [
      {
        type: 'documented',
        text: 'FPL formally retired the plant at the end of 2020, demolished major structures in 2021, and built the Monarch Solar Energy Center nearby using portions of the former plant’s grid infrastructure.',
        source: {
          label: 'FPL news releases and Monarch Solar feature',
          date: '2021–2024',
          url: 'https://newsroom.fpl.com/From-coal-to-solar-FPL-generates-savings-for-customers-with-new-solar-projects',
        },
      },
      {
        type: 'developer-statement',
        text: 'FPL has said it will explore opportunities to use parts of the plant site for future clean-energy solutions; no specific additional use is established by these illustrations.',
        source: {
          label: 'FPL demolition announcement',
          date: 'Jun 2021',
          url: 'https://newsroom.fpl.com/FPL-begins-demolishing-its-last-coal-fired-power-plant-while-advancing-zero-emissions-energy-facilities-in-Florida',
        },
      },
      {
        type: 'unresolved',
        text: 'Former-plant parcel availability, remaining structures, ecological condition, and coal combustion residual or groundwater status are not established by the concept scenes.',
      },
      {
        type: 'potential-protection',
        text: 'Native groundcover, stormwater planting, landscape edges, and habitat connections would require site-specific ecological, contamination, drainage, maintenance, and land-availability review.',
      },
    ],
    perspectives: [
      {
        id: 'energy-reuse',
        sceneId: 'indiantown-energy-reuse',
        icon: 'energy',
        title: 'Coal-to-Solar Reuse',
        subtitle: 'A symbolic transition from retired coal infrastructure to low-profile solar generation',
        designIntent:
          'Explain how existing energy infrastructure can support a cleaner reuse pathway while keeping the documented Monarch Solar location distinct from the former plant footprint.',
        ideas: [
          'A faded industrial silhouette can communicate the former use without recreating a site plan.',
          'Low-profile solar arrays and symbolic grid equipment show the documented transition concept.',
          'Native landscape edges and maintenance paths can soften utility-scale infrastructure without hiding it.',
          'The scene emphasizes energy-site reuse principles rather than proposing a new use for the FPL-owned property.',
        ],
        limitations: [
          'Monarch Solar is documented on land southwest of the former plant; this illustration does not place arrays on the former plant footprint.',
          'No parcel boundary, array layout, interconnection point, available acreage, or redevelopment footprint is depicted.',
          'The image does not establish that the former plant site is available, suitable, or approved for another use.',
        ],
        questions: [
          'Which portions of the former plant property, if any, remain available for future reuse?',
          'What site-specific environmental assessment is required before locating additional energy or habitat features?',
          'What existing switchyard or interconnection components remain suitable for reuse?',
          'What has FPL publicly committed to beyond the existing Monarch Solar Energy Center?',
        ],
      },
      {
        id: 'landscape-stewardship',
        sceneId: 'indiantown-landscape-stewardship',
        icon: 'stewardship',
        title: 'Landscape Stewardship',
        subtitle: 'Possible native landscape, stormwater, and habitat principles around utility-scale solar',
        designIntent:
          'Show how solar infrastructure might be paired with thoughtful landscape stewardship if ecological suitability and land availability are separately verified.',
        ideas: [
          'Native groundcover could reduce a uniform industrial appearance while supporting maintainable landscape edges.',
          'Layered planting and shade trees could screen public views without concealing electrical infrastructure.',
          'Conceptual stormwater planting could be evaluated where soils, drainage, and remediation status allow.',
          'A dashed habitat-connection symbol represents one design question, not a mapped corridor or approved restoration area.',
        ],
        limitations: [
          'No wetland, restoration location, habitat corridor, soil condition, groundwater condition, or ecological suitability is depicted.',
          'The illustration does not show the Monarch Solar array boundary or the former plant footprint.',
          'Vegetation is not represented as a substitute for engineering, remediation, drainage, or operational access requirements.',
        ],
        questions: [
          'What ecological survey and contamination review would be required before establishing native groundcover or habitat areas?',
          'Which drainage and stormwater approaches are compatible with the former industrial site and surrounding landscape?',
          'Could maintenance access, panel spacing, and landscape stewardship coexist at a specific location?',
          'What long-term monitoring or land-management commitments would be appropriate?',
        ],
      },
    ],
  },
  {
    siteId: 'desoto',
    title: 'Responsible Facility Vision',
    subtitle:
      'Educational design possibilities for rural-compatible AI infrastructure — not DCIP’s proposed design, a site plan, or a statement that the pending expansion applications are approved.',
    galleryLayout: 'three',
    introNotes: [
      {
        icon: 'infrastructure',
        title: 'One consistent design idea',
        text: 'The same warm-toned, low-profile, articulated architecture appears in all three scenes so they read as different views of a single concept.',
      },
      {
        icon: 'landscape',
        title: 'Landscape as possibility, not proof',
        text: 'Native screening, stormwater planting, and habitat ideas do not satisfy acoustic limits, establish water supply, or substitute for environmental permits.',
      },
      {
        icon: 'evidence',
        title: 'Approved vs. pending',
        text: 'Only the 34.22-acre Phase 1 PUD is approved, with conditions. The two expansion applications totaling 828.05 acres are pending and are not depicted.',
      },
    ],
    evidenceNotes: [
      {
        type: 'documented',
        text: 'Per the March 24, 2026 BOCC minutes, Ordinance 2026-004 was adopted with conditions including a 55-dBA noise limit at 200 feet from all property lines, a photometric plan showing no light trespass, perimeter buffering, and reclaimed-water feasibility findings due at the improvement-plan stage. These are approval requirements — not demonstrated operational compliance.',
        source: {
          label: 'DeSoto County BOCC minutes, March 24, 2026',
          date: '2026',
          url: 'https://desotobocc.legistar1.com/desotobocc/meetings/2026/3/3776_M_Board_of_County_Commissioners_26-03-24_Meeting_Minutes.pdf',
        },
      },
      {
        type: 'documented',
        text: 'The approved project is limited to 34.22 acres and a maximum 35,134 sq ft facility. Applications RZNE-0086-2026 (274.26 ac) and RZNE-0087-2026 (553.79 ac) are pending public hearings; the July 28, 2026 moratorium exempts them from the pause but does not approve them.',
        source: {
          label: 'DeSoto County Data Center Applications page; Ordinance 2026-016',
          date: '2026',
          url: 'https://desotobocc.com/431/Data-Center-Applications',
        },
      },
      {
        type: 'developer-statement',
        text: 'DCIP describes rural-character design, tree buffers, neutral colors, low-profile structures, closed-loop cooling, and reclaimed or well water. These are applicant statements, not independently verified plans, permits, or performance.',
        source: {
          label: 'DCIP Group FAQ and public materials',
          date: '2025–2026',
          url: 'https://www.dcipgroup.tech/faq',
        },
      },
      {
        type: 'unresolved',
        text: 'Final codified Ordinance 2026-004 text (including Planning Commission conditions 14–15), SWFWMD water-use permitting, state ERP/USACE wetland approvals, and demonstrated noise and lighting compliance all remain unverified.',
      },
    ],
    perspectives: [
      {
        id: 'neighborhood',
        sceneId: 'desoto-neighborhood',
        icon: 'community',
        title: 'Neighborhood Perspective',
        subtitle: 'A rural-facing public edge with warmth, screening, and visual restraint',
        designIntent:
          'Explore how a data facility could present a composed, rural-compatible public face rather than a blank industrial edge.',
        ideas: [
          'Warm earth-tone masonry and textured panels could create lower, grounded facade sections suited to a rural setting.',
          'Shaded overhangs, varied facade bays, and an understated entrance could reduce warehouse-like massing.',
          'Layered native trees and a post-and-rail style frontage could echo the agricultural character of the surrounding landscape.',
          'Shielded, downward-directed lighting could support a no-light-trespass design objective.',
          'Mechanical areas could sit behind architectural screening rather than dominating the public view.',
        ],
        limitations: [
          'No street location, setback, property boundary, residence, distance, or approved landscape plan is depicted.',
          'Vegetation is symbolic and is not represented as satisfying the adopted 55-dBA-at-200-ft noise limit or any acoustic requirement.',
          'Shielded lighting shown here is a design idea; the adopted condition requires a photometric plan demonstrating no light trespass.',
          'Facade materials and equipment locations are design ideas only.',
        ],
        questions: [
          'Can the improvement plan demonstrate the adopted 55-dBA limit and zero light trespass with the actual equipment selected?',
          'Which verified public viewpoints, roads, and residences would require viewshed analysis?',
          'What landscape buffer, maintenance, and replacement commitments would be enforceable?',
          'What independent acoustic analysis would determine equipment siting and enclosure requirements?',
        ],
      },
      {
        id: 'landscape',
        sceneId: 'desoto-landscape',
        icon: 'landscape',
        title: 'Landscape & Habitat Perspective',
        subtitle: 'The same architecture within a symbolic rural Florida landscape',
        designIntent:
          'Place the same hypothetical buildings within a symbolic pasture landscape to explore stormwater and habitat questions without mapping real site features.',
        ideas: [
          'The same articulated, low-profile buildings could sit within a pasture-like setting rather than a cleared industrial pad.',
          'Conceptual stormwater planting is shown as a design possibility subject to engineering and permitting review.',
          'A dashed habitat-connection symbol represents one planning question — not a mapped corridor.',
          'Documented wetlands, flood zones, and the Conservation Overlay District remain in the separate verified GIS view.',
        ],
        limitations: [
          'No mapped wetland, parcel boundary, buildable area, habitat corridor, or development footprint is depicted.',
          'About 14% of the approved Phase 1 site is documented wetlands and surface waters — a record fact, not a mapped feature here.',
          'No wetland impact, mitigation location, stormwater design, or environmental approval is implied; ERP and USACE Section 404 needs are unresolved.',
          'The pending expansion parcels are not shown and are not approved.',
        ],
        questions: [
          'What state ERP and possible USACE Section 404 review would jurisdictional wetland impacts require?',
          'What stormwater approach is technically feasible and permittable on the actual site?',
          'Could habitat connections be maintained without affecting jurisdictional wetlands or surface waters?',
          'How would the pending expansion parcels be evaluated separately if their hearings proceed?',
        ],
      },
      {
        id: 'facility',
        sceneId: 'desoto-facility',
        icon: 'infrastructure',
        title: 'Complete Facility Perspective',
        subtitle: 'The same design honestly showing generation, cooling, and electrical infrastructure',
        designIntent:
          'Show one consistent concept honestly — data halls, on-site generation, cooling equipment, electrical infrastructure, security, and service access acknowledged rather than hidden.',
        ideas: [
          'The same modular data halls could use textured panels, warm materials, fins, and shaded openings rather than blank walls.',
          'On-site generation equipment is shown symbolically — the adopted ordinance restricts it to serving the project only, with no third-party sales.',
          'Cooling equipment could be consolidated behind architectural screening while remaining visibly acknowledged.',
          'Transformers and electrical infrastructure could sit within a controlled, landscaped service yard.',
          'Controlled access, fencing, lighting, and emergency circulation can be coordinated rather than treated as afterthoughts.',
        ],
        limitations: [
          'No building count, generation capacity, cooling technology, fuel storage, or site layout is proposed.',
          'Equipment symbols are generic; they do not establish air permitting, water supply, interconnection, or franchise-compliance feasibility.',
          'Whether on-site-only generation is permissible under the county’s FPL franchise agreement or state law remains unresolved — the county expressly disclaimed any representation on this point.',
          'The pending expansion applications are not depicted and are not approved.',
        ],
        questions: [
          'What cooling technology and water source would actually be permitted — and did the required reclaimed-water feasibility review find usable supply?',
          'What air-quality permits would on-site generation require at the approved scale?',
          'Does the on-site-only generation approach conflict with the county’s FPL franchise agreement or state law?',
          'What architectural and landscape standards would be enforceable through approval conditions?',
        ],
      },
    ],
  },
  {
    siteId: 'escambia',
    title: 'Remedy & Reuse',
    subtitle:
      'Educational illustrations of remedy protection and conditional commercial reuse at a Superfund site — not a development proposal, site plan, or statement that any parcel is buildable or approved.',
    galleryLayout: 'two',
    introNotes: [
      {
        icon: 'evidence',
        title: 'The remedy comes first',
        text: 'The capped containment cell, monitoring wells, access controls, and active groundwater treatment must be maintained indefinitely; the Ready for Reuse determination remains valid only while every recorded restriction is met.',
      },
      {
        icon: 'landscape',
        title: 'Reuse is conditional',
        text: 'Commercial and industrial use is possible only within recorded restrictions — no housing, recreation, or agriculture; strict construction limits apply within the containment-cell footprint and require FDEP plan review.',
      },
      {
        icon: 'community',
        title: 'A displaced community',
        text: 'More than 400 households in Rosewood Terrace, Oak Park, Escambia Arms, Goulding, and Clarinda Triangle were permanently relocated. Reuse conversations owe those residents acknowledgment and a voice.',
      },
    ],
    evidenceNotes: [
      {
        type: 'documented',
        text: 'EPA’s December 3, 2018 Ready for Reuse Determination found the site ready for commercial and industrial use, subject to recorded restrictive covenants. It is an environmental status report — not a permit, a development approval, or a guarantee that any specific use is safe or feasible.',
        source: {
          label: 'EPA RfR Determination, Escambia Wood - Pensacola',
          date: 'Dec 2018',
          url: 'https://semspub.epa.gov/work/04/11120113.pdf',
        },
      },
      {
        type: 'documented',
        text: 'OU-1 soil remedy is short-term protective (2022 Five-Year Review); long-term protectiveness requires monitoring updates and covenants on the former facility parcels. OU-2 groundwater remediation began late 2023 and remains active with no established completion schedule.',
        source: {
          label: 'EPA Fifth Five-Year Review; EPA site profile',
          date: '2022–2024',
          url: 'https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.cleanup&id=0400573',
        },
      },
      {
        type: 'documented',
        text: 'April 2013 recorded covenants restrict the property to commercial, industrial, or manufacturing use and prohibit housing, day care, schools, recreation, mining, and agriculture. Stricter limits — no deep foundations, no deep-rooted vegetation, no infiltration ponds, FDEP construction review — apply within the containment-cell footprint specifically.',
        source: {
          label: 'EPA RfR Determination, Appendix B restrictive covenants',
          date: '2013–2018',
          url: 'https://semspub.epa.gov/work/04/11120113.pdf',
        },
      },
      {
        type: 'developer-statement',
        text: 'January 2026 county committee discussions reported by local media described possible fire-training, transit, animal-shelter, marketable-parcel, and housing concepts pending new soil testing. These are reported directions, not adopted plans; any residential use would require formally amending EPA/FDEP institutional controls.',
        source: {
          label: 'Pensacola News Journal and WEAR coverage of county Committee of the Whole',
          date: 'Jan 2026',
          url: 'https://weartv.com/news/local/escambia-county-calls-for-new-environmental-soil-testing-of-midtown-commerce-park',
        },
      },
      {
        type: 'unresolved',
        text: 'Not confirmed in the public records reviewed: recorded covenants on the former facility parcels (2022 FYR milestone), closure of EPA OIG recommendations 1 and 3 on institutional-control enforcement and physical access, and the outcome of the county’s new soil testing.',
      },
    ],
    perspectives: [
      {
        id: 'remedy-first',
        sceneId: 'escambia-remedy-first',
        icon: 'stewardship',
        title: 'Remedy-First Perspective',
        subtitle: 'Symbolic containment, monitoring, and stewardship obligations',
        designIntent:
          'Explain that the cleanup is a permanent stewardship obligation — soil containment, monitoring, restricted groundwater use, and controlled access come before any reuse.',
        ideas: [
          'A capped containment area must remain intact, monitored, and protected for the long term.',
          'Groundwater monitoring wells and active OU-2 treatment systems need continued access and protection.',
          'Fencing, signage, and access controls are part of what keeps the remedy protective.',
          'Groundwater use and new wells are prohibited within the restricted parcels; the site sits in a groundwater delineation area.',
          'Native grasses and shallow-rooted planting can improve the landscape without threatening the cap.',
        ],
        limitations: [
          'The containment form shown is symbolic; actual cell geometry and parcel boundaries appear only in verified records and the GIS view.',
          'Nothing shown implies remediation is complete — OU-2 groundwater treatment is active.',
          'Controlled access is depicted as a principle, not an approved security design.',
        ],
        questions: [
          'What O&M obligations run with the land forever, and who verifies them?',
          'How would OU-2 treatment systems and monitoring wells be protected during any adjacent activity?',
          'Have the physical-access-control and enforcement gaps identified by the EPA OIG been corrected?',
          'Are covenants now recorded on the former facility parcels as the 2022 FYR required?',
        ],
      },
      {
        id: 'conditional-reuse',
        sceneId: 'escambia-conditional-reuse',
        icon: 'infrastructure',
        title: 'Conditional Redevelopment Perspective',
        subtitle: 'A generic commercial setting shown alongside a protected remedy area',
        designIntent:
          'Illustrate how commercial architecture and landscaping might be approached only where compatible with verified land-use and remediation requirements — the remedy area stays protected and separate.',
        ideas: [
          'Low-rise commercial or industrial buildings with warm materials and landscape edges could replace blight with a composed streetscape.',
          'The protected remedy area is depicted separately — fenced, signed, and unbuilt.',
          'Shallow-rooted landscaping and paved surfaces illustrate constraint-aware design.',
          'Utilities and access are shown generically; real layouts would require FDEP plan review within restricted areas.',
        ],
        limitations: [
          'No area is identified as actually unconstrained, buildable, or approved — this is not a development proposal.',
          'No buildings are shown over the containment area; no housing, recreation, groundwater extraction, or data center is depicted.',
          'The December 2018 Ready for Reuse determination is a status report conditioned on restrictions — not a permit or approval for this or any facility.',
          'January 2026 county concepts are reported discussions only; institutional controls remain in force unless formally amended.',
        ],
        questions: [
          'Which parcels, if any, have recorded restrictions compatible with a proposed use, and what would FDEP review require?',
          'What would the county’s new soil testing and any institutional-control amendments mean for allowable uses?',
          'How would displaced residents and current neighbors shape reuse priorities and community benefits?',
          'What utility capacity exists absent a legacy power interconnection?',
        ],
      },
    ],
  },
];

export function getFacilityVisionProfile(siteId: string): FacilityVisionProfile | undefined {
  return FACILITY_VISION_PROFILES.find(profile => profile.siteId === siteId);
}
