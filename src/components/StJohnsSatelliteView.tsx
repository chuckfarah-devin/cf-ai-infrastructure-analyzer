import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AttributionControl,
  ErrorEvent as MapErrorEvent,
  type GeoJSONSourceSpecification,
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AlertTriangle, ArrowLeft, ExternalLink, Info, Layers, LoaderCircle, MapPin } from 'lucide-react';
import type { CandidateSite } from '../data/siteExplorerData';
import {
  getEnvironmentalLayers,
  type EnvironmentalLayerConfig,
  type EnvironmentalLayerId,
} from '../data/environmentalLayers';

setWorkerUrl(maplibreWorkerUrl);

/** Structural subset of CandidateSite — also satisfied by FloridaProject adapters. */
export interface SatelliteSite {
  name: string;
  city: string;
  county: string;
  coordinates: { lat: number; lon: number };
  coordinateSource: { label: string; date?: string; url?: string };
  classification: string;
  classificationLabel: string;
  markerColor: string;
  whyIncluded: string;
  /**
   * 'site' (default): documented location marker + environmental screening.
   * 'area': broad-area context view — no precise pin, no environmental
   * screening; used when only a general project area is documented.
   */
  viewMode?: 'site' | 'area';
}

interface SiteSatelliteViewProps {
  site: CandidateSite | SatelliteSite;
  onBack: () => void;
}

interface EnvironmentalGeoJson {
  type: 'FeatureCollection';
  features: unknown[];
  exceededTransferLimit?: boolean;
}

type LayerStatus = 'off' | 'loading' | 'visible' | 'empty' | 'error';

interface LayerState {
  enabled: boolean;
  status: LayerStatus;
  featureCount?: number;
  message?: string;
}

function createInitialLayerStates(layers: EnvironmentalLayerConfig[]): Record<EnvironmentalLayerId, LayerState> {
  return Object.fromEntries(
    layers.map(layer => [layer.id, { enabled: false, status: 'off' as LayerStatus }]),
  ) as Record<EnvironmentalLayerId, LayerState>;
}

function mapLayerIds(id: EnvironmentalLayerId): string[] {
  return [`environment-${id}-fill`, `environment-${id}-outline`, `environment-${id}-line`, `environment-${id}-raster`, `environment-${id}-label`];
}

function removeMapLayer(map: Map, id: EnvironmentalLayerId) {
  mapLayerIds(id).forEach(layerId => {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  });
  const sourceId = `environment-${id}`;
  if (map.getSource(sourceId)) map.removeSource(sourceId);
}

async function fetchEnvironmentalService(url: string, signal: AbortSignal): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fetch(url, { signal });
    } catch (error) {
      lastError = error;
      if (signal.aborted || attempt === 1) throw error;
      await new Promise(resolve => window.setTimeout(resolve, 500));
    }
  }
  throw lastError;
}

function addMapLayer(map: Map, config: EnvironmentalLayerConfig, data?: EnvironmentalGeoJson) {
  const sourceId = `environment-${config.id}`;
  removeMapLayer(map, config.id);

  if (config.geometry === 'raster' && config.rasterTiles) {
    map.addSource(sourceId, {
      type: 'raster',
      tiles: config.rasterTiles,
      tileSize: 256,
      attribution: config.agency,
    });
    map.addLayer({
      id: `environment-${config.id}-raster`,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': 0.72 },
    });
    return;
  }

  if (!data) return;
  map.addSource(sourceId, {
    type: 'geojson',
    data: data as GeoJSONSourceSpecification['data'],
  });

  if (config.geometry === 'polygon') {
    const femaCategories = config.symbolLabelField === 'FLD_ZONE';
    map.addLayer({
      id: `environment-${config.id}-fill`,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': femaCategories
          ? [
              'case',
              // Special Flood Hazard Areas (1% annual chance) — purple
              ['in', ['get', 'FLD_ZONE'], ['literal', ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']]],
              '#a855f7',
              // Undetermined risk — gray
              ['==', ['get', 'FLD_ZONE'], 'D'],
              '#9ca3af',
              // Zone X, moderate risk (0.2% annual chance) — amber
              [
                'all',
                ['==', ['get', 'FLD_ZONE'], 'X'],
                ['in', '0.2 PCT', ['coalesce', ['get', 'ZONE_SUBTY'], '']],
              ],
              '#f59e0b',
              // Zone X, minimal hazard — only when the subtype explicitly
              // records minimal hazard
              [
                'all',
                ['==', ['get', 'FLD_ZONE'], 'X'],
                ['in', 'MINIMAL', ['coalesce', ['get', 'ZONE_SUBTY'], '']],
              ],
              '#ddd6fe',
              // Missing/unrecognized zones or subtypes — neutral slate
              '#cbd5e1',
            ]
          : config.color,
        'fill-opacity': 0.3,
      },
    });
    map.addLayer({
      id: `environment-${config.id}-outline`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': config.color,
        'line-width': 1.5,
        'line-opacity': 0.95,
      },
    });
    if (config.symbolLabelField === 'FLD_ZONE') {
      // FEMA flood zones: white haloed zone codes; floodway zones append FLOODWAY.
      // Symbol layer auto-declutters (text-allow-overlap defaults to false) and
      // only appears at parcel-relevant zooms to avoid regional clutter.
      map.addLayer({
        id: `environment-${config.id}-label`,
        type: 'symbol',
        source: sourceId,
        minzoom: 11,
        layout: {
          'text-field': [
            'concat',
            ['coalesce', ['get', 'FLD_ZONE'], ''],
            ['case', ['==', ['get', 'ZONE_SUBTY'], 'FLOODWAY'], ' FLOODWAY', ''],
          ],
          'text-size': ['interpolate', ['linear'], ['zoom'], 11, 11, 14, 14, 17, 18],
          'text-font': ['Noto Sans Bold'],
          'text-max-width': 8,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#1e1b4b',
          'text-halo-width': 2,
        },
      });
    }
  } else {
    map.addLayer({
      id: `environment-${config.id}-line`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': config.color,
        'line-width': 2.5,
        'line-opacity': 0.95,
      },
    });
  }
}

export default function SiteSatelliteView({ site, onBack }: SiteSatelliteViewProps) {
  const isAreaView = 'viewMode' in site && site.viewMode === 'area';
  const environmentalLayers = useMemo(
    () => getEnvironmentalLayers(site.coordinates),
    [site.coordinates.lat, site.coordinates.lon],
  );
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const layerDataRef = useRef<Partial<Record<EnvironmentalLayerId, EnvironmentalGeoJson>>>({});
  const requestControllersRef = useRef<Partial<Record<EnvironmentalLayerId, AbortController>>>({});
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [layerStates, setLayerStates] = useState(() => createInitialLayerStates(environmentalLayers));
  const accessDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.coordinates.lat},${site.coordinates.lon}`;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
    if (!apiKey) {
      setMapError('ArcGIS basemap access is not configured for this environment.');
      return;
    }

    setMapError(null);
    setMapReady(false);
    const styleUrl = `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?token=${encodeURIComponent(apiKey)}`;
    const isAreaView = 'viewMode' in site && site.viewMode === 'area';
    const map = new Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [site.coordinates.lon, site.coordinates.lat],
      zoom: isAreaView ? 10.5 : 14,
      minZoom: 8,
      maxZoom: 19,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
    map.on('load', () => setMapReady(true));

    let marker: Marker | undefined;
    if (!isAreaView) {
      const markerElement = document.createElement('div');
      markerElement.className = 'satellite-site-marker';
      markerElement.style.backgroundColor = site.markerColor;
      markerElement.setAttribute('aria-label', 'Approximate Site Location — Not a Property Boundary');

      marker = new Marker({ element: markerElement, anchor: 'bottom' })
        .setLngLat([site.coordinates.lon, site.coordinates.lat])
        .setPopup(
          new Popup({ offset: 22, closeButton: false }).setHTML(
            '<strong>Approximate Site Location</strong><br><span>Not a Property Boundary</span>',
          ),
        )
        .addTo(map);

      marker.togglePopup();
    }

    map.on('error', (event: MapErrorEvent) => {
      const message = event.error?.message ?? '';
      if (message.includes('401') || message.includes('403') || message.includes('token')) {
        setMapError('The ArcGIS basemap could not be authorized. Check the key privileges and allowed referrers.');
      }
      const sourceId = (event as MapErrorEvent & { sourceId?: string }).sourceId;
      if (sourceId?.startsWith('environment-')) {
        const id = sourceId.replace('environment-', '') as EnvironmentalLayerId;
        setLayerStates(current => current[id]?.enabled ? {
          ...current,
          [id]: {
            enabled: true,
            status: 'error',
            message: 'The agency map service did not return one or more requested tiles. Turn this layer off and on to retry.',
          },
        } : current);
      }
    });

    return () => {
      Object.values(requestControllersRef.current).forEach(controller => controller?.abort());
      marker?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [site.coordinates.lat, site.coordinates.lon, site.markerColor]);

  const setLayerState = (id: EnvironmentalLayerId, state: LayerState) => {
    setLayerStates(current => ({ ...current, [id]: state }));
  };

  const toggleEnvironmentalLayer = async (config: EnvironmentalLayerConfig) => {
    const map = mapRef.current;
    const current = layerStates[config.id];
    if (!map || !mapReady) return;

    if (current.enabled) {
      requestControllersRef.current[config.id]?.abort();
      delete requestControllersRef.current[config.id];
      removeMapLayer(map, config.id);
      setLayerState(config.id, { enabled: false, status: 'off' });
      return;
    }

    const cached = layerDataRef.current[config.id];
    if (cached) {
      addMapLayer(map, config, cached);
      setLayerState(config.id, { enabled: true, status: 'visible', featureCount: cached.features.length });
      return;
    }

    if (config.geometry === 'raster' && !config.rasterValidation) {
      addMapLayer(map, config);
      setLayerState(config.id, { enabled: true, status: 'visible' });
      return;
    }

    const controller = new AbortController();
    let didTimeout = false;
    const timeout = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, 25000);
    requestControllersRef.current[config.id] = controller;
    setLayerState(config.id, { enabled: true, status: 'loading' });

    try {
      const response = await fetchEnvironmentalService(config.queryUrl, controller.signal);
      if (!response.ok) throw new Error(`Service returned HTTP ${response.status}`);
      if (config.geometry === 'raster') {
        let featureCount: number | undefined;
        if (config.rasterValidation === 'count') {
          const result = await response.json() as { count?: number; error?: { message?: string } };
          if (result.error) throw new Error(result.error.message ?? 'The service returned an error.');
          featureCount = result.count;
          if (!featureCount) {
            setLayerState(config.id, {
              enabled: true,
              status: 'empty',
              featureCount: 0,
              message: 'No mapped shoreline feature was returned for this surrounding context area. This does not establish that no water feature or shoreline exists.',
            });
            return;
          }
        }
        addMapLayer(map, config);
        setLayerState(config.id, { enabled: true, status: 'visible', featureCount });
        return;
      }
      const data = await response.json() as EnvironmentalGeoJson & { error?: { message?: string } };
      if (data.error) throw new Error(data.error.message ?? 'The service returned an error.');
      if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
        throw new Error('The service returned an unexpected data format.');
      }
      if (data.features.length === 0) {
        setLayerState(config.id, {
          enabled: true,
          status: 'empty',
          featureCount: 0,
          message: 'No mapped features were returned for the surrounding context area. This does not prove that the resource is absent.',
        });
        return;
      }

      layerDataRef.current[config.id] = data;
      addMapLayer(map, config, data);
      setLayerState(config.id, {
        enabled: true,
        status: 'visible',
        featureCount: data.features.length,
        message: data.exceededTransferLimit ? 'The service limited this response; additional mapped features may exist.' : undefined,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError' && !didTimeout) return;
      setLayerState(config.id, {
        enabled: true,
        status: 'error',
        message: didTimeout
          ? 'The public GIS service did not respond within 25 seconds. Turn this layer off and on to retry.'
          : error instanceof Error ? error.message : 'The public GIS service could not be loaded.',
      });
    } finally {
      clearTimeout(timeout);
      delete requestControllersRef.current[config.id];
    }
  };

  return (
    <section className="satellite-view" aria-labelledby="satellite-view-title">
      <div className="satellite-view-toolbar">
        <button type="button" className="satellite-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Florida Overview & {site.name} Profile
        </button>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="satellite-street-link">
          Open location in Google Maps
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="satellite-view-heading">
        <div>
          <h3 id="satellite-view-title">{site.name} — {isAreaView ? 'General Area View' : 'Satellite View'}</h3>
          <p>{site.city}, {site.county} County · {isAreaView ? 'Broad-area context' : 'Interactive site context'} from Esri World Imagery.</p>
        </div>
        <span className={`satellite-classification ${site.classification}`}>{site.classificationLabel}</span>
      </div>

      <div className="satellite-location-notice">
        <MapPin size={16} />
        <div>
          {isAreaView ? (
            <>
              <strong>Approximate project area — site boundaries unverified</strong>
              <span>This view centers on the general reported area only. No site pin, parcel boundary, or site-specific environmental screening is shown because the exact project site is not confirmed in the records reviewed.</span>
            </>
          ) : (
            <>
              <strong>Approximate Site Location — Not a Property Boundary</strong>
              <span>The marker represents the documented general facility location only. No parcel or redevelopment boundary is shown.</span>
            </>
          )}
        </div>
      </div>

      <div className="satellite-research-context">
        <strong>Research context</strong>
        <span>{site.whyIncluded}</span>
      </div>

      {!isAreaView && <section className="environmental-context" aria-labelledby="environmental-context-title">
          <div className="environmental-context-heading">
            <Layers size={18} />
            <div>
              <h4 id="environmental-context-title">Verified Environmental Context</h4>
              <p>Optional public GIS layers for the surrounding area. Layers load only when selected.</p>
            </div>
          </div>
          <div className="environmental-layer-list">
            {environmentalLayers.map(config => {
              const state = layerStates[config.id];
              return (
                <div key={config.id} className={`environmental-layer-card status-${state.status}`}>
                  <label className="environmental-layer-toggle">
                    <input
                      type="checkbox"
                      checked={state.enabled}
                      disabled={!mapReady}
                      onChange={() => toggleEnvironmentalLayer(config)}
                    />
                    <span className="environmental-legend-swatch" style={{ backgroundColor: config.color }} />
                    <span>
                      <strong>{config.label}</strong>
                      <small>{config.agency}</small>
                    </span>
                    {state.status === 'loading' && <LoaderCircle size={14} className="environmental-loading" />}
                  </label>
                  {state.status === 'visible' && (
                    <p className="environmental-layer-status">
                      {state.featureCount === undefined
                        ? 'Showing the authoritative agency map service.'
                        : `Showing ${state.featureCount.toLocaleString()} mapped feature${state.featureCount === 1 ? '' : 's'} in the context area.`}
                    </p>
                  )}
                  {state.status === 'empty' && (
                    <p className="environmental-layer-status environmental-layer-warning"><Info size={12} />{state.message}</p>
                  )}
                  {state.status === 'error' && (
                    <p className="environmental-layer-status environmental-layer-error"><AlertTriangle size={12} />Unable to load: {state.message}</p>
                  )}
                  {state.message && state.status === 'visible' && (
                    <p className="environmental-layer-status environmental-layer-warning"><Info size={12} />{state.message}</p>
                  )}
                  <details className="environmental-layer-details">
                    <summary>Source, date & limitations</summary>
                    <p><strong>Legend:</strong> {config.legendLabel}</p>
                    <p><strong>Coverage:</strong> {config.coverage}</p>
                    <p><strong>Date:</strong> {config.sourceDate}</p>
                    <p><strong>Limitation:</strong> {config.limitation}</p>
                    <a href={config.sourcePage} target="_blank" rel="noopener noreferrer">
                      Official agency source <ExternalLink size={11} />
                    </a>
                  </details>
                </div>
              );
            })}
          </div>
          <p className="environmental-context-disclaimer">
            These layers show a fixed surrounding context area for screening and education. They do not identify property boundaries, buildable land, regulatory jurisdiction, or restoration locations. Restoration cannot replace wetland protection or contamination remediation.
          </p>
      </section>}

      <div className="satellite-map-frame">
        <div ref={mapContainerRef} className="satellite-map" aria-label={`Interactive satellite map of the approximate ${site.name} location`} />
        {mapError && (
          <div className="satellite-map-error" role="alert">
            <Info size={18} />
            <span>{mapError}</span>
          </div>
        )}
      </div>

      <div className="satellite-map-details">
        <div>
          <strong>Location source</strong>
          <span>{site.coordinateSource.label}{site.coordinateSource.date ? ` (${site.coordinateSource.date})` : ''}</span>
        </div>
        <div>
          <strong>Imagery and attribution</strong>
          <span>Esri World Imagery. Provider attribution is displayed on the map and may change with location and zoom.</span>
        </div>
        <div>
          <strong>Imagery capture metadata</strong>
          <span>Capture date is not supplied for this location by the Basemap Styles response. No date is inferred.</span>
        </div>
        <div>
          <strong>Map accessed</strong>
          <span>{accessDate}</span>
        </div>
      </div>

      <p className="satellite-view-disclaimer">
        Street View coverage was not independently verified, so the link opens the regular Google Maps location instead. Return to the site profile for documented environmental constraints, community considerations, and key uncertainties. This view does not establish site availability, ownership boundaries, environmental conditions, development approval, or available interconnection capacity.
      </p>
    </section>
  );
}
