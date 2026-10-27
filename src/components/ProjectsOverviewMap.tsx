/**
 * Statewide geographic overview map for Florida Projects.
 * MapLibre + ArcGIS imagery basemap (same service as the satellite view).
 * Markers reflect each project's documented location precision:
 * parcel/address projects get pins; area-level projects get an
 * explicitly labeled approximate marker; county-only projects are
 * excluded from the map entirely.
 * No environmental layers load here — screening runs only after a
 * specific site is opened.
 */

import { useEffect, useRef, useState } from 'react';
import {
  ErrorEvent as MapErrorEvent,
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { FloridaProject } from '../data/floridaProjectsData';

setWorkerUrl(maplibreWorkerUrl);

interface ProjectsOverviewMapProps {
  projects: FloridaProject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FLORIDA_CENTER: [number, number] = [-81.7, 28.3];

export default function ProjectsOverviewMap({ projects, selectedId, onSelect }: ProjectsOverviewMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
    if (!apiKey || !containerRef.current) {
      setMapError('ArcGIS basemap access is not configured for this environment.');
      return;
    }

    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container: containerRef.current,
        style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?token=${encodeURIComponent(apiKey)}`,
        center: FLORIDA_CENTER,
        zoom: 5.6,
        attributionControl: { compact: true },
      });
      const mappable = projects.filter(p => p.coordinates);
      if (mappable.length > 0) {
        const bounds = new LngLatBounds();
        mappable.forEach(p => bounds.extend([p.coordinates!.lon, p.coordinates!.lat]));
        map.on('load', () => map.fitBounds(bounds, { padding: 90, maxZoom: 9, duration: 0 }));
      }
    } catch {
      setMapError('The map could not be initialized.');
      return;
    }
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.on('error', (e: MapErrorEvent) => {
      const message = e?.error?.message ?? '';
      if (message.includes('401') || message.includes('403') || message.includes('token')) {
        setMapError('The ArcGIS basemap could not be authorized. Check the key privileges and allowed referrers.');
      }
    });

    for (const project of projects) {
      if (!project.coordinates) continue;
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `project-map-marker precision-${project.precision}`;
      el.style.backgroundColor = project.markerColor;
      el.setAttribute('aria-label', `${project.name} — ${project.coordinateNote}`);
      el.title = `${project.name} — ${project.precision === 'area' ? 'Approximate area' : 'Approximate location'}`;
      el.addEventListener('click', () => onSelect(project.id));
      const marker = new Marker({ element: el })
        .setLngLat([project.coordinates.lon, project.coordinates.lat])
        .addTo(map);
      markersRef.current.set(project.id, marker);
    }

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle('selected', id === selectedId);
    });
  }, [selectedId]);

  if (mapError) {
    return (
      <div className="projects-map-fallback" role="status">
        <p>{mapError}</p>
        <p>Select a project from the list to view its profile.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="projects-overview-map"
      role="application"
      aria-label="Florida satellite map with documented project locations"
    />
  );
}
