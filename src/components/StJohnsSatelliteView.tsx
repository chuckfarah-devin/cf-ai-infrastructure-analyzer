import { useEffect, useRef, useState } from 'react';
import { AttributionControl, ErrorEvent as MapErrorEvent, Map, Marker, NavigationControl, Popup, setWorkerUrl } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, ExternalLink, Info, MapPin } from 'lucide-react';
import type { CandidateSite } from '../data/siteExplorerData';

setWorkerUrl(maplibreWorkerUrl);

interface SiteSatelliteViewProps {
  site: CandidateSite;
  onBack: () => void;
}

export default function SiteSatelliteView({ site, onBack }: SiteSatelliteViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
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
    const styleUrl = `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?token=${encodeURIComponent(apiKey)}`;
    const map = new Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [site.coordinates.lon, site.coordinates.lat],
      zoom: 14,
      minZoom: 8,
      maxZoom: 19,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new AttributionControl({ compact: true }), 'bottom-right');

    const markerElement = document.createElement('div');
    markerElement.className = 'satellite-site-marker';
    markerElement.style.backgroundColor = site.markerColor;
    markerElement.setAttribute('aria-label', 'Approximate Site Location — Not a Property Boundary');

    const marker = new Marker({ element: markerElement, anchor: 'bottom' })
      .setLngLat([site.coordinates.lon, site.coordinates.lat])
      .setPopup(
        new Popup({ offset: 22, closeButton: false }).setHTML(
          '<strong>Approximate Site Location</strong><br><span>Not a Property Boundary</span>',
        ),
      )
      .addTo(map);

    marker.togglePopup();

    map.on('error', (event: MapErrorEvent) => {
      const message = event.error?.message ?? '';
      if (message.includes('401') || message.includes('403') || message.includes('token')) {
        setMapError('The ArcGIS basemap could not be authorized. Check the key privileges and allowed referrers.');
      }
    });

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [site.coordinates.lat, site.coordinates.lon, site.markerColor]);

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
          <h3 id="satellite-view-title">{site.name} — Satellite View</h3>
          <p>{site.city}, {site.county} County · Interactive site context from Esri World Imagery.</p>
        </div>
        <span className={`satellite-classification ${site.classification}`}>{site.classificationLabel}</span>
      </div>

      <div className="satellite-location-notice">
        <MapPin size={16} />
        <div>
          <strong>Approximate Site Location — Not a Property Boundary</strong>
          <span>The marker represents the documented general facility location only. No parcel or redevelopment boundary is shown.</span>
        </div>
      </div>

      <div className="satellite-research-context">
        <strong>Research context</strong>
        <span>{site.whyIncluded}</span>
      </div>

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
