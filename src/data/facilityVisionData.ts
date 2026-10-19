export type FacilityVisionPerspectiveId = 'neighborhood' | 'landscape' | 'facility';

export interface FacilityVisionPerspective {
  id: FacilityVisionPerspectiveId;
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
  perspectives: FacilityVisionPerspective[];
}

export const FACILITY_VISION_PROFILES: FacilityVisionProfile[] = [
  {
    siteId: 'st-johns',
    title: 'Responsible Facility Vision',
    subtitle:
      'Educational design possibilities for AI infrastructure — not a proposed architectural style, site plan, or statement that the site is suitable for redevelopment.',
    perspectives: [
      {
        id: 'neighborhood',
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
        title: 'Facility Design Perspective',
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
];

export function getFacilityVisionProfile(siteId: string): FacilityVisionProfile | undefined {
  return FACILITY_VISION_PROFILES.find(profile => profile.siteId === siteId);
}
