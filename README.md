# Florida AI Grid Demonstrator — MVP (Release 1)

An interactive web application that illustrates how coordinated distributed energy resources (solar, EV batteries, home storage) might reshape Florida's grid demand in the context of AI data-center growth.

> **Important:** This is an **illustrative scenario-based demonstrator**, not a production grid-planning or power-flow model. All resource sizes, demand curves, and efficiency values are illustrative defaults. No results should be used for interconnection studies, resource adequacy filings, or investment decisions without independent engineering analysis.

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later

### Install
```bash
cd cf-ai-infrastructure-analyzer
npm install
```

### Run (development)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests
```bash
npm test -- --run
```

### Build for production
```bash
npm run build
```
Output is placed in `dist/`.

---

## What it models

The demonstrator simulates a 24-hour Florida grid day with configurable:

| Parameter | Description |
|---|---|
| EV fleet size and V2G participation | Vehicle-to-grid discharge during peak hours |
| Distributed (rooftop) solar | Behind-the-meter generation |
| Utility-scale solar | Front-of-meter generation |
| Home battery systems | Residential storage (e.g., Powerwall-class) |
| AI data-center load | Incremental constant load added to system |
| Operating mode | **Traditional** (no VPP coordination) vs **Coordinated** (peak-shaving VPP dispatch) |
| Hurricane / island mode | Grid-disconnected critical-load operation |

### Coordinated dispatch strategy (MVP)

1. A 24-hour baseline net-grid-load curve is computed before any storage dispatch.
2. The top 20% of hours (by baseline load) are classified as peak-dispatch hours.
3. Battery energy is reserved for those peak hours; off-peak deficits are met by the grid.
4. Solar surplus charges batteries throughout the day.
5. Post-peak recovery charging is pre-planned and allocated to the lowest-load hours first, using the dispatch-only peak as a ceiling — preventing recovery from recreating the original system peak.
6. Terminal SOC (50%) is restored when physically possible within the ceiling constraint. Any shortfall is reported.

### Key metrics
- **Peak Net Grid Load** — residual utility supply requirement after DER contribution
- **Grid Capacity Released** — Traditional peak − Coordinated peak (MW)
- **Campus Equivalents** — illustrative comparison: capacity released ÷ assumed campus size
- **SOC** — State of Charge tracked with 95 % round-trip efficiency

---

## Project structure

```
src/
  simulation/       Pure TypeScript engine (no React dependencies)
    engine.ts       Three-tier simulation core
    storage.ts      Battery charge/discharge physics
    solarCurve.ts   Illustrative Florida solar factor curve
    demandCurve.ts  Illustrative Florida residential demand curve
    types.ts        Shared type definitions
    engine.test.ts  Unit tests (Vitest)
    engine.diagnostic.test.ts  SOC conservation and comparison tests
  components/       React UI components
    Controls.tsx    Scenario input controls
    SummaryPanel.tsx  Key metrics display
    Charts.tsx      Recharts visualizations
    AssumptionsPanel.tsx  Model assumptions and sources
    Tooltip.tsx     Accessible acronym tooltips
  data/
    floridaDefaults.ts  Default Florida scenario configuration
docs/
  technical-spec.md
  assumptions-and-sources.md
```

---

## Built with

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build/dev server)
- [Vitest](https://vitest.dev/) (unit tests)
- [Recharts](https://recharts.org/) (data visualization)
- Specification-driven, AI-assisted development (Devin / Claude / Windsurf)

---

## Status

**Release 1 — MVP complete.** See [`docs/technical-spec.md`](docs/technical-spec.md) for the full model specification and [`docs/assumptions-and-sources.md`](docs/assumptions-and-sources.md) for data sources and caveats.
