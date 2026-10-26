# Third-Party Notices

PowerGrid AI — Florida AI Grid Demonstrator uses the following
third-party software, datasets, and imagery. Each remains the property
of its respective owners and is subject to its own license terms.

## Runtime software libraries

The browser application bundles code from these libraries:

| Package | Version | License | Copyright |
|---|---|---|---|
| react | 18.3.1 | MIT | Facebook, Inc. and its affiliates |
| react-dom | 18.3.1 | MIT | Facebook, Inc. and its affiliates |
| recharts | 3.10.1 | MIT | recharts contributors |
| maplibre-gl | 6.13.0 | BSD-3-Clause | MapLibre contributors (with portions from Mapbox GL JS, Mapbox, Inc.) |
| lucide-react | 0.460.0 | ISC | Lucide Contributors 2022; portions © Cole Bemis 2013–2022 (Feather, MIT) |

The deployed bundle also includes bundled transitive dependencies —
including Mapbox-derived utilities (`@mapbox/*`, `pbf`, `earcut`,
`kdbush`, `quickselect`, `tinyqueue`, `potpack`, `gl-matrix`), d3
modules (`d3-*`, `internmap`), Redux Toolkit/redux packages, and other
support libraries — all licensed under MIT, ISC, or BSD terms.
Complete, authoritative license texts ship inside each published
package and are available via the public npm registry.

Build tooling (Vite, Vitest, TypeScript, and their dependencies) is
used at development time and is not distributed with the application.

## Data and imagery attribution

### Basemap imagery
Satellite basemap tiles and style services are provided by
**Esri / ArcGIS Basemap Styles service** under the Esri terms of use
and its attribution requirements. On-map attribution is rendered by
the application. Imagery © Esri and its data providers.

### Public environmental datasets (accessed via public GIS services)

| Layer | Original data provider | Hosting service |
|---|---|---|
| Mapped Wetlands | U.S. Fish & Wildlife Service, National Wetlands Inventory | FDEP-hosted Florida service |
| Effective Flood Hazards | FEMA National Flood Hazard Layer | FEMA hazards.fema.gov |
| Conservation Lands | Florida Natural Areas Inventory / FDEP | FDEP ArcGIS services |
| Aquatic Preserves | Florida DEP Division of State Lands | FDEP ArcGIS open data |
| Shoreline Reference | NOAA Composite Shoreline | FDEP-hosted extract |

These layers are drawn from public government and institutional data
sources. Inclusion does not imply endorsement by any agency, utility,
or data provider. Nothing in this project is affiliated with or
endorsed by NextEra Energy, Florida Power & Light, JEA, or any other
utility or company referenced in site research.

## AI-assisted development

This project was developed with AI assistance (Devin/Cognition and
other tools) under human direction and review. Site research draws on
cited public records; see in-app evidence notes and
`docs/assumptions-and-sources.md` for sources and confidence
classifications.
