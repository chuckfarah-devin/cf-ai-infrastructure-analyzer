import { useState, useMemo, useRef } from 'react'
import { simulateScenario } from './simulation/engine'
import { floridaDefaults } from './data/floridaDefaults'
import { defaultFinancialAssumptions } from './data/financialDefaults'
import type { ScenarioConfig } from './simulation/types'
import type { FinancialAssumptions } from './simulation/financialTypes'
import { Controls } from './components/Controls'
import { SummaryPanel } from './components/SummaryPanel'
import { Charts } from './components/Charts'
import { EnergyFlow } from './components/EnergyFlow'
import { MetricRibbon } from './components/MetricRibbon'
import { FeaturedCharts } from './components/FeaturedCharts'
import { FinancialDashboard } from './components/FinancialDashboard'
import { AssumptionsPanel } from './components/AssumptionsPanel'
import { SiteExplorer } from './components/SiteExplorer'
import { Menu, X, ChevronDown, ChevronRight, Zap, MapPin, PlayCircle } from 'lucide-react'
import { GuidedTour, TourPlayButton, type TourStepContent } from './components/GuidedTour'
import { TOUR_HOUR, TOUR_SITE_ID, TOUR_PLAY_START_HOUR, computeTourDiffs } from './data/guidedTour'
import './index.css'

type AppTab = 'energy-flow' | 'site-explorer';

function App() {
  const [config, setConfig] = useState<ScenarioConfig>(floridaDefaults)
  const [result, setResult] = useState(() => simulateScenario(config))
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [financialAssumptions, setFinancialAssumptions] = useState<FinancialAssumptions>(defaultFinancialAssumptions)
  const [showDetailedCharts, setShowDetailedCharts] = useState(false)
  const [activeTab, setActiveTab] = useState<AppTab>('energy-flow')
  // Playback lifted so the guided tour can control and pause it.
  const [isPlaying, setIsPlaying] = useState(false)
  const [tourStep, setTourStep] = useState<number | null>(null)
  const tourSnapshot = useRef<{ config: ScenarioConfig; hour: number; tab: AppTab } | null>(null)

  // Lifted selectedHour state so MetricRibbon, EnergyFlow, and FeaturedCharts share it
  const [selectedHour, setSelectedHour] = useState<number>(() => {
    let peakHour = 0
    let peakDemand = 0
    const hours = simulateScenario(floridaDefaults).hours
    hours.forEach((h, i) => {
      if (h.totalDemandMW > peakDemand) {
        peakDemand = h.totalDemandMW
        peakHour = i
      }
    })
    return peakHour
  })

  const handleConfigChange = (newConfig: ScenarioConfig) => {
    setConfig(newConfig)
    setResult(simulateScenario(newConfig))
    // Preserve selectedHour: strategy/config changes are separate from time
    // selection, and the hour index (0–23) stays valid for every scenario.
  }

  // ── Guided tour ──────────────────────────────────────────
  const tourDiffs = useMemo(() => {
    const t = simulateScenario({ ...floridaDefaults, operatingMode: 'traditional' }).hours[TOUR_HOUR]
    const c = simulateScenario({ ...floridaDefaults, operatingMode: 'coordinated' }).hours[TOUR_HOUR]
    return computeTourDiffs(t, c)
  }, [])

  const applyTourStep = (step: number) => {
    setIsPlaying(false)
    if (step === 0) {
      setActiveTab('energy-flow')
      const c = { ...floridaDefaults, operatingMode: 'traditional' as const }
      setConfig(c); setResult(simulateScenario(c))
      setSelectedHour(TOUR_HOUR)
    } else if (step === 1) {
      const c = { ...floridaDefaults, operatingMode: 'coordinated' as const }
      setConfig(c); setResult(simulateScenario(c))
      setSelectedHour(TOUR_HOUR)
    } else if (step === 2) {
      setActiveTab('energy-flow')
      // Start mid-morning so playback shows the full solar day before the
      // 18:00 evening peak — the comparison step itself stays at 18:00.
      setSelectedHour(TOUR_PLAY_START_HOUR)
    } else if (step === 3) {
      setActiveTab('site-explorer')
    }
    setTourStep(step)
  }

  const startTour = () => {
    tourSnapshot.current = { config, hour: selectedHour, tab: activeTab }
    applyTourStep(0)
  }

  const endTour = () => {
    setIsPlaying(false)
    const snap = tourSnapshot.current
    if (snap) {
      setConfig(snap.config); setResult(simulateScenario(snap.config))
      setSelectedHour(snap.hour); setActiveTab(snap.tab)
    }
    tourSnapshot.current = null
    setTourStep(null)
  }

  const TOUR_STEPS: TourStepContent[] = [
    {
      title: 'Today\u2019s approach',
      takeaway: 'One evening hour under the Traditional strategy.',
      explanation: 'This shows a single simulated hour at the daily demand peak — required demand on the right, supply sources on the left.',
      detail: 'Figures are model outputs for one hour (MW), not measured grid data. The scenario uses the public FPL preset.',
    },
    {
      title: 'Smarter coordination',
      takeaway: 'The same 18:00 hour under Coordinated — identical inputs otherwise.',
      explanation: 'Only the operating strategy changed. The differences below are computed from the model results for this exact hour. A value of 0 MW means no additional grid supply is required in this modeled hour — the system is not off-grid.',
      detail: 'Scope: one hour in one illustrative scenario — not a promise of system-wide results. Storage values are the Coordinated strategy\u2019s modeled discharge at this hour; Traditional contributes none because it does not coordinate storage with the evening peak.',
    },
    {
      title: 'Watch the day',
      takeaway: 'Timing matters—not just how much capacity we build.',
      explanation: 'Starting at 10:00, press play and watch solar build through midday, fade in late afternoon, and demand peak at 18:00. Playback pauses when you advance.',
      action: <TourPlayButton playing={isPlaying} onToggle={() => setIsPlaying(p => !p)} />,
    },
    {
      title: 'Look at the place',
      takeaway: 'Energy choices live on real land.',
      explanation: 'This profile documents the retired St. Johns River Power Park — land, water, habitat, and neighborhood context matter alongside megawatts. Documented conditions are labeled; concept imagery is illustrative, not a plan.',
      detail: 'Profile details come from cited public records; where evidence is missing, items are marked unresolved rather than assumed.',
    },
    {
      title: 'What\u2019s this telling me?',
      takeaway: 'Evaluate energy, land, water, habitat, and community together—before committing to a design.',
      explanation: 'Explore on your own, or run the tour again.',
    },
  ]

  // Traditional-mode hours for financial comparison
  const traditionalHours = useMemo(() => {
    if (config.operatingMode !== 'coordinated') return null
    const traditionalConfig = { ...config, operatingMode: 'traditional' as const }
    return simulateScenario(traditionalConfig).hours
  }, [config])

  const currentHour = result.hours[selectedHour]
  const prevHour = selectedHour > 0 ? result.hours[selectedHour - 1] : null

  return (
    <div className="app v2">
      <header className="app-header">
        <div className="app-header-brand">
          <h1>Florida AI Grid Demonstrator</h1>
          <span className="app-header-subtitle">Building a Smarter, More Resilient Energy Future — Responsibly.</span>
        </div>
        <nav className="app-header-tabs" role="tablist">
          <button
            role="tab"
            className={`header-tab ${activeTab === 'energy-flow' ? 'active' : ''}`}
            aria-selected={activeTab === 'energy-flow'}
            onClick={() => setActiveTab('energy-flow')}
          >
            <Zap size={14} />
            Energy Flow
          </button>
          <button
            role="tab"
            className={`header-tab ${activeTab === 'site-explorer' ? 'active' : ''}`}
            aria-selected={activeTab === 'site-explorer'}
            onClick={() => setActiveTab('site-explorer')}
          >
            <MapPin size={14} />
            Site Explorer
          </button>
        </nav>
        <div className="app-header-actions">
          {activeTab === 'energy-flow' && (
            <button
              className="header-btn"
              onClick={() => setShowControls(!showControls)}
              aria-label={showControls ? 'Hide controls' : 'Show controls'}
            >
              {showControls ? <X size={16} /> : <Menu size={16} />}
              <span>{showControls ? 'Hide' : 'Controls'}</span>
            </button>
          )}
          <button
            className="header-btn"
            onClick={() => setShowAssumptions(!showAssumptions)}
          >
            {showAssumptions ? 'Hide Assumptions' : 'Assumptions'}
          </button>
        </div>
      </header>

      {showAssumptions && <AssumptionsPanel />}

      {activeTab === 'energy-flow' ? (
        <div className={`app-content ${!showControls ? 'controls-collapsed' : ''}`}>
          <aside className={`sidebar ${!showControls ? 'hidden' : ''}`}>
            <Controls config={config} onConfigChange={handleConfigChange} />
          </aside>

          <main className={`main-content ${tourStep !== null ? `tour-step-${tourStep}` : ''}`}>
            {tourStep === null && (
              <div className="tour-entry">
                <button type="button" className="tour-entry-btn" onClick={startTour}>
                  <PlayCircle size={15} /> Take a 60-second tour
                </button>
                <span className="tour-entry-hint">What is this showing me?</span>
              </div>
            )}

            {/* Metric ribbon */}
            {currentHour && (
              <MetricRibbon
                hour={currentHour}
                prevHour={prevHour}
                nuclearCapacityMW={config.nuclearCapacityMW ?? 0}
              />
            )}

            {/* Energy flow visualization */}
            <EnergyFlow
              config={config}
              hours={result.hours}
              selectedHour={selectedHour}
              onHourChange={setSelectedHour}
              isPlaying={isPlaying}
              onPlayingChange={setIsPlaying}
            />

            {/* Three featured charts */}
            <FeaturedCharts hours={result.hours} selectedHour={selectedHour} />

            {/* Summary panel */}
            <SummaryPanel summary={result.summary} operatingMode={config.operatingMode} />

            {/* Collapsible detailed simulation charts */}
            <div className="detailed-charts-toggle">
              <button
                className="collapse-btn"
                onClick={() => setShowDetailedCharts(!showDetailedCharts)}
                aria-expanded={showDetailedCharts}
              >
                {showDetailedCharts ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                Detailed Simulation Charts
              </button>
            </div>
            {showDetailedCharts && (
              <Charts hours={result.hours} operatingMode={config.operatingMode} />
            )}

            {/* Financial dashboard */}
            <FinancialDashboard
              hours={result.hours}
              traditionalHours={traditionalHours}
              operatingMode={config.operatingMode}
              assumptions={financialAssumptions}
              onAssumptionsChange={setFinancialAssumptions}
            />
          </main>
        </div>
      ) : (
        <div className="app-content site-explorer-content">
          <main className="main-content">
            <SiteExplorer key={tourStep !== null ? 'tour' : 'app'} initialSiteId={TOUR_SITE_ID} />
          </main>
        </div>
      )}

      {tourStep !== null && (
        <GuidedTour
          step={tourStep}
          content={TOUR_STEPS[tourStep]}
          diffs={tourStep === 1 ? tourDiffs : undefined}
          onNext={() => applyTourStep(tourStep + 1)}
          onBack={() => applyTourStep(tourStep - 1)}
          onExit={endTour}
          onRestart={() => applyTourStep(0)}
        />
      )}
    </div>
  )
}

export default App
