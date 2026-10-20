import type { SourceCitation } from './siteExplorerData';

export type FacilityVisionSceneId =
  | 'st-johns-neighborhood'
  | 'st-johns-landscape'
  | 'st-johns-facility'
  | 'indiantown-energy-reuse'
  | 'indiantown-landscape-stewardship';

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
];

export function getFacilityVisionProfile(siteId: string): FacilityVisionProfile | undefined {
  return FACILITY_VISION_PROFILES.find(profile => profile.siteId === siteId);
}
