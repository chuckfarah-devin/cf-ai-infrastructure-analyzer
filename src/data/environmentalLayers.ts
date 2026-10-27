export type EnvironmentalLayerId = 'wetlands' | 'flood' | 'conservation' | 'aquatic-preserve' | 'shoreline';

export interface EnvironmentalLayerConfig {
  id: EnvironmentalLayerId;
  label: string;
  agency: string;
  coverage: string;
  sourcePage: string;
  sourceDate: string;
  limitation: string;
  queryUrl: string;
  rasterTiles?: string[];
  rasterValidation?: 'image' | 'count';
  /** GeoJSON property rendered as a map symbol label (vector layers only). */
  symbolLabelField?: string;
  color: string;
  geometry: 'polygon' | 'line' | 'raster';
  legendLabel: string;
}

interface SiteCoordinates {
  lat: number;
  lon: number;
}

function contextEnvelope(
  { lat, lon }: SiteCoordinates,
  longitudeRadius: number,
  latitudeRadius: number,
): string {
  return [lon - longitudeRadius, lat - latitudeRadius, lon + longitudeRadius, lat + latitudeRadius]
    .map(value => value.toFixed(6))
    .join(',');
}

function arcGisQuery(serviceUrl: string, outFields: string, envelope: string): string {
  const params = new URLSearchParams({
    where: '1=1',
    geometry: envelope,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    outSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields,
    returnGeometry: 'true',
    maxAllowableOffset: '0.0001',
    geometryPrecision: '5',
    resultRecordCount: '1000',
    f: 'geojson',
  });
  return `${serviceUrl}/query?${params.toString()}`;
}

function arcGisCountQuery(serviceUrl: string, envelope: string): string {
  const params = new URLSearchParams({
    where: '1=1',
    geometry: envelope,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    returnCountOnly: 'true',
    f: 'json',
  });
  return `${serviceUrl}/query?${params.toString()}`;
}

export function getEnvironmentalLayers(coordinates: SiteCoordinates): EnvironmentalLayerConfig[] {
  const detailedEnvelope = contextEnvelope(coordinates, 0.03, 0.025);
  const regionalEnvelope = contextEnvelope(coordinates, 0.04, 0.03);
  return [
    {
      id: 'wetlands',
      label: 'Mapped Wetlands',
      agency: 'USFWS National Wetlands Inventory (FDEP-hosted Florida service)',
      coverage: 'Statewide Florida coverage; source mapping date and completeness vary by project area.',
      sourcePage: 'https://www.fws.gov/program/national-wetlands-inventory/web-mapping-services',
      sourceDate: 'Current public service; national updates are published biannually. Feature vintage varies by mapping project.',
      limitation: 'Screening data only. NWI uses a biological definition and is not a regulatory wetland delineation or jurisdictional determination.',
      queryUrl: arcGisQuery(
        'https://ca.dep.state.fl.us/arcgis/rest/services/Map_Direct/Program_Support/MapServer/6',
        'WETLAND_TYPE,ATTRIBUTE,ACRES',
        detailedEnvelope,
      ),
      color: '#22d3ee',
      geometry: 'polygon',
      legendLabel: 'NWI mapped wetland or deepwater habitat',
    },
    {
      id: 'flood',
      label: 'Effective Flood Hazards',
      agency: 'FEMA National Flood Hazard Layer',
      coverage: 'National coverage where effective digital flood mapping is available.',
      sourcePage: 'https://hazards.fema.gov/femaportal/resources/flood_map_svc.htm',
      sourceDate: 'Current effective NFHL service; revised data is added continuously.',
      limitation: 'Screening context only. Consult the official effective FIRM/FIRMette and site-specific elevation information for a determination.',
      // Vector query against the NFHL "Flood Hazard Zones" layer (S_Fld_Haz_Ar)
      // so zone fills, boundaries, and labels can be rendered readably.
      queryUrl: arcGisQuery(
        'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28',
        'FLD_ZONE,ZONE_SUBTY,SFHA_TF',
        regionalEnvelope,
      ),
      symbolLabelField: 'FLD_ZONE',
      color: '#a855f7',
      geometry: 'polygon',
      legendLabel: 'Fill color shows FEMA risk category: purple = Special Flood Hazard Area / 1% annual chance (zones A, AE, AH, AO, AR, A99, V, VE); amber = moderate risk, 0.2% annual chance (Zone X); pale lavender = minimal-hazard Zone X; dark gray = Zone D, risk undetermined; pale slate = unclassified category — see the FEMA source. Purple lines are zone boundaries; white labels show the zone designation code (e.g., AE, X, “AE FLOODWAY”). Shading does not imply equal risk across zones. Other FEMA annotations such as map-revision records are not displayed.',
    },
    {
      id: 'conservation',
      label: 'Conservation Lands',
      agency: 'FDEP / Florida Natural Areas Inventory',
      coverage: 'Statewide managed conservation lands; inclusion does not establish surveyed ownership boundaries.',
      sourcePage: 'https://www.fnai.org/publications/gis-data',
      sourceDate: 'Florida Conservation Lands, September 2026 edition; normally updated quarterly.',
      limitation: 'Managed-area context only. These polygons do not establish legal ownership, access rights, or surveyed boundaries.',
      queryUrl: arcGisQuery(
        'https://ca.dep.state.fl.us/arcgis/rest/services/Map_Direct/Environment/MapServer/38',
        'MANAME,MANAGING_A,OWNER,PROTSTAT',
        regionalEnvelope,
      ),
      color: '#4ade80',
      geometry: 'polygon',
      legendLabel: 'Managed conservation land',
    },
    {
      id: 'aquatic-preserve',
      label: 'Aquatic Preserve',
      agency: 'Florida DEP Division of State Lands',
      coverage: 'Florida-designated aquatic preserves; inland sites may legitimately return no mapped feature.',
      sourcePage: 'https://ags.dep.state.fl.us/arcgis/rest/services/OpenData/AQUATIC_PRESERVES/MapServer/0',
      sourceDate: 'Current FDEP public service; dataset publication date is not stated in the service metadata.',
      limitation: 'General statutory context. Official legal descriptions and surveyed records control if boundaries differ.',
      queryUrl: arcGisQuery(
        'https://ags.dep.state.fl.us/arcgis/rest/services/OpenData/AQUATIC_PRESERVES/MapServer/0',
        'NAME,COUNTIES,REGION,PRESERVE_MANAGER',
        regionalEnvelope,
      ),
      color: '#818cf8',
      geometry: 'polygon',
      legendLabel: 'FDEP aquatic preserve',
    },
    {
      id: 'shoreline',
      label: 'Shoreline Reference',
      agency: 'NOAA Composite Shoreline, Florida DEP-hosted extract',
      coverage: 'Florida coastal and selected connected-water shoreline features; inland sites may return no feature.',
      sourcePage: 'https://shoreline.noaa.gov/data/datasheets/composite.html',
      sourceDate: 'Multi-temporal NOAA source; feature and service publication dates vary or are not stated.',
      limitation: 'Reference shoreline only. Shorelines change over time and this layer is not a property, ownership, or legal boundary.',
      queryUrl: arcGisCountQuery(
        'https://ca.dep.state.fl.us/arcgis/rest/services/Map_Direct/Program_Support/MapServer/41',
        regionalEnvelope,
      ),
      rasterTiles: [
        'https://ca.dep.state.fl.us/arcgis/rest/services/Map_Direct/Program_Support/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&layers=show%3A41&size=256%2C256&format=png32&transparent=true&f=image',
      ],
      rasterValidation: 'count',
      color: '#ef4444',
      geometry: 'raster',
      legendLabel: 'NOAA composite shoreline reference',
    },
  ];
}
