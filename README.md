# PowerGrid AI — Florida AI Grid Demonstrator

An interactive, educational web application exploring how Florida's grid
might respond to AI data-center growth — and how previously developed
industrial sites could be responsibly evaluated for reuse.

> **[Live Demo — Version 2 Preview](https://chuckfarah-devin.github.io/cf-ai-infrastructure-analyzer-preview/)**
> The enhanced preview adds the four-site explorer, environmental GIS,
> and Responsible Design Vision galleries. This is a development preview,
> not the stable production release.
>
> **[Stable Release 1](https://chuckfarah-devin.github.io/cf-ai-infrastructure-analyzer/)**
> The original production deployment.

## Overview

PowerGrid AI is an educational demonstrator — not an engineering or
planning tool. It helps explain how electricity moves from generation
through grid infrastructure to consumers, how coordinated distributed
energy resources might reduce peak demand, and how former industrial
sites are evaluated when communities consider redevelopment.

## Features

- **Energy Flow** — interactive hourly simulation with Scenario
  Presets and Simulation Controls: Generation Sources (conventional
  fleet plus utility and distributed solar), Storage Resources
  (home batteries and EV vehicle-to-grid charge/discharge), and an
  adjustable AI Data Center Load. Two Energy Strategy modes —
  **Traditional** and **Coordinated** — are compared side by side,
  with an illustrative financial dashboard (demand charges, avoided
  capacity value, customer cost).
- **Site Explorer** — four Florida case studies (St. Johns River Power
  Park, DeSoto County Plant, Indiantown Cogeneration, Escambia Wood
  Treating) illustrating different questions about AI infrastructure,
  energy-site reuse, and conditional redevelopment. Not all four are
  proposed data centers.
- **Environmental GIS** — satellite basemaps plus public
  environmental-context layers: mapped wetlands (USFWS National
  Wetlands Inventory, FDEP-hosted service), effective flood hazards
  (FEMA National Flood Hazard Layer), conservation lands (Florida
  Natural Areas Inventory / FDEP), aquatic preserves (FDEP Division
  of State Lands), and a NOAA Composite Shoreline reference
  (FDEP-hosted extract). Data originates with those agencies; FDEP
  and FEMA host the public services the app queries.
- **Responsible Design Vision** — ten conceptual illustrations across
  the four sites, each labeled *Illustrative Concept — Not a Site Plan*
  with evidence notes distinguishing documented public records,
  developer statements, unresolved questions, and proposed protections.
- **Community Impact & Protection** — evidence-qualified assessments
  currently available for St. Johns and DeSoto; Indiantown and
  Escambia are planned.

## Technology stack

React · TypeScript · Vite · Vitest · Recharts · MapLibre GL ·
public GIS services (FDEP, FEMA, USFWS, NOAA, FNAI data) ·
ArcGIS basemap styles

## Development approach

AI-assisted, specification-driven, incremental development with
automated testing (56-test suite) and staged human review checkpoints.
Site data carries explicit confidence classifications separating
verified public records from inference and unresolved questions.

## Limitations

- Simulations are **illustrative scenario models** — not engineering
  forecasts, interconnection studies, or investment analyses.
- Mapped environmental context is not a parcel-level site
  determination.
- Architectural illustrations are conceptual education aids, **not
  site plans**, and imply no approval, availability, or suitability.
- Nothing here endorses any specific development; site-readiness
  claims require independent engineering, environmental, and legal
  review.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test -- --run  # 56 tests
npm run build      # production build → dist/
```

Satellite basemaps require a `VITE_ARCGIS_API_KEY` in `.env.local`
(an ArcGIS developer key scoped to basemap styles); the app degrades
gracefully without it. Environmental overlay layers use public
services and need no key.

## Documentation

- `docs/technical-spec.md` — simulation model specification
- `docs/assumptions-and-sources.md` — data sources and caveats

## License

© 2026 Chuck Farah. All rights reserved — see [`LICENSE`](LICENSE).
This project is shared publicly for education and portfolio
demonstration; no general reuse license is granted. Third-party
libraries, datasets, and imagery retain their own licenses — see
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). Developed with
AI assistance under human direction and review.
