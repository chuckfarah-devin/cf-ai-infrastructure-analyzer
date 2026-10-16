/**
 * Extract Florida (FIPS 12) from Census Bureau states-10m.json (TopoJSON)
 * and output SVG path data with geographic proportions preserved.
 *
 * Source: topojson/us-atlas v3 (Census Bureau cartographic boundaries, 2017 edition)
 * https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
 *
 * Run: node scripts/extract-florida.mjs
 */

import { readFileSync } from 'fs';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const topo = JSON.parse(readFileSync(join(__dirname, 'states-10m.json'), 'utf8'));

// TopoJSON decoding: quantize transform + arc delta encoding
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map(arc => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

// Find Florida (FIPS "12") in the states collection
const states = topo.objects.states;
const floridaGeom = states.geometries.find(g => g.id === '12');

if (!floridaGeom) {
  console.error('Florida not found!');
  process.exit(1);
}

console.log('Florida geometry type:', floridaGeom.type);
console.log('Number of arcs/rings:', floridaGeom.arcs?.length);

// Decode arcs to coordinate rings
function decodeRing(arcIndices) {
  const coords = [];
  for (const idx of arcIndices) {
    const arc = idx >= 0 ? arcs[idx] : arcs[~idx].slice().reverse();
    // Skip first point of subsequent arcs to avoid duplication
    const start = coords.length === 0 ? 0 : 1;
    for (let i = start; i < arc.length; i++) {
      coords.push(arc[i]);
    }
  }
  return coords;
}

// Get all polygons
let polygons;
if (floridaGeom.type === 'Polygon') {
  polygons = [floridaGeom.arcs.map(ring => decodeRing(ring))];
} else if (floridaGeom.type === 'MultiPolygon') {
  polygons = floridaGeom.arcs.map(poly => poly.map(ring => decodeRing(ring)));
} else {
  console.error('Unexpected geometry type:', floridaGeom.type);
  process.exit(1);
}

// Compute bounding box of all coordinates
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const poly of polygons) {
  for (const ring of poly) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
}

console.log(`Bounding box: lon [${minLon.toFixed(4)}, ${maxLon.toFixed(4)}], lat [${minLat.toFixed(4)}, ${maxLat.toFixed(4)}]`);

// Project to SVG coordinates
// Use Mercator-like projection but preserve aspect ratio at Florida's latitude
const centerLat = (minLat + maxLat) / 2;
const cosLat = Math.cos(centerLat * Math.PI / 180);

const lonRange = maxLon - minLon;
const latRange = maxLat - minLat;

// Target SVG size
const svgWidth = 400;
const svgHeight = svgWidth * (latRange / (lonRange * cosLat));
const padding = 10;

function project(lon, lat) {
  const x = padding + ((lon - minLon) / lonRange) * (svgWidth - 2 * padding);
  // Y is inverted (SVG y goes down, lat goes up)
  const y = padding + ((maxLat - lat) / latRange) * (svgHeight - 2 * padding);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

console.log(`SVG dimensions: ${svgWidth} x ${Math.round(svgHeight)}`);

// Convert to SVG paths, keeping only rings with more than 5 points
// (skip tiny islands)
const svgPaths = [];
let mainlandPath = '';
let mainlandArea = 0;

for (const poly of polygons) {
  for (const ring of poly) {
    if (ring.length < 5) continue;

    // Compute approximate area to identify mainland
    let area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      area += (ring[i][0] - ring[i+1][0]) * (ring[i][1] + ring[i+1][1]);
    }
    area = Math.abs(area) / 2;

    const projected = ring.map(([lon, lat]) => project(lon, lat));
    let d = `M ${projected[0][0]},${projected[0][1]}`;
    for (let i = 1; i < projected.length; i++) {
      d += ` L ${projected[i][0]},${projected[i][1]}`;
    }
    d += ' Z';

    svgPaths.push({ d, area, pointCount: ring.length });

    if (area > mainlandArea) {
      mainlandArea = area;
      mainlandPath = d;
    }
  }
}

// Sort by area descending
svgPaths.sort((a, b) => b.area - a.area);

console.log(`\nFound ${svgPaths.length} rings:`);
svgPaths.forEach((p, i) => {
  console.log(`  Ring ${i}: ${p.pointCount} points, area ~${p.area.toFixed(2)}`);
});

console.log(`\nViewBox: "0 0 ${svgWidth} ${Math.round(svgHeight)}"`);
console.log(`\n// Mainland Florida (largest ring):`);
console.log(`export const FLORIDA_MAINLAND_PATH = '${mainlandPath}';`);

// Include the Keys and larger islands (area > 0.01 of mainland)
const threshold = mainlandArea * 0.001;
const islandPaths = svgPaths.filter(p => p.d !== mainlandPath && p.area > threshold);
console.log(`\n// Florida Keys and significant islands (${islandPaths.length} additional rings):`);
if (islandPaths.length > 0) {
  const combined = islandPaths.map(p => p.d).join(' ');
  console.log(`export const FLORIDA_ISLANDS_PATH = '${combined}';`);
}

// Output the complete combined path
const allSignificant = svgPaths.filter(p => p.area > threshold);
const completePath = allSignificant.map(p => p.d).join(' ');
console.log(`\n// Complete Florida (mainland + keys + significant islands):`);
console.log(`export const FLORIDA_COMPLETE_PATH = '${completePath}';`);
