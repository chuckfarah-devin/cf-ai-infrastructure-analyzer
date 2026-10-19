import { useEffect, useRef, useState } from 'react';
import { AttributionControl, ErrorEvent as MapErrorEvent, Map, Marker, NavigationControl, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, ExternalLink, Info, MapPin } from 'lucide-react';

const SITE_LOCATION = { lat: 30.4167, lon: -81.5333 };
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${SITE_LOCATION.lat},${SITE_LOCATION.lon}`;

interface StJohnsSatelliteViewProps {
  onBack: () => void;
}

export default function StJohnsSatelliteView({ onBack }: StJohnsSatelliteViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const accessDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
    if (!apiKey) {
      setMapError('ArcGIS basemap access is not configured for this environment.');
      return;
    }

    const styleUrl = `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?token=${encodeURIComponent(apiKey)}`;
    const map = new Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [SITE_LOCATION.lon, SITE_LOCATION.lat],
      zoom: 14,
      minZoom: 8,
      maxZoom: 19,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: true }), 'top-right');

    const attribution = new AttributionControl({ compact: true });
    map.addControl(attribution, 'bottom-right');

    const markerElement = document.createElement('div');
    markerElement.className = 'satellite-site-marker';
    markerElement.setAttribute('aria-label', 'Approximate Site Location — Not a Property Boundary');

    const marker = new Marker({ element: markerElement, anchor: 'bottom' })
      .setLngLat([SITE_LOCATION.lon, SITE_LOCATION.lat])
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
  }, []);

  return (
    <section className="satellite-view" aria-labelledby="satellite-view-title">
      <div className="satellite-view-toolbar">
        <button type="button" className="satellite-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Florida Overview & Site Profile
        </button>
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="satellite-street-link">
          Open location in Google Maps
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="satellite-view-heading">
        <div>
          <h3 id="satellite-view-title">St. Johns River Power Park — Satellite View</h3>
          <p>Interactive site context from Esri World Imagery. Pan and zoom to explore the surrounding area.</p>
        </div>
        <span className="satellite-proof-badge">Proof of Concept</span>
      </div>

      <div className="satellite-location-notice">
        <MapPin size={16} />
        <div>
          <strong>Approximate Site Location — Not a Property Boundary</strong>
          <span>The marker represents the documented general site location only. No parcel or redevelopment boundary is shown.</span>
        </div>
      </div>

      <div className="satellite-map-frame">
        <div ref={mapContainerRef} className="satellite-map" aria-label="Interactive satellite map of the approximate St. Johns River Power Park location" />
        {mapError && (
          <div className="satellite-map-error" role="alert">
            <Info size={18} />
            <span>{mapError}</span>
          </div>
        )}
      </div>

      <div className="satellite-map-details">
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
        Street View coverage at the approximate site location could not be verified, so the link opens the regular Google Maps location instead.
        This view does not establish site ownership, parcel limits, environmental conditions, development approval, or available interconnection capacity.
      </p>
    </section>
  );
}
