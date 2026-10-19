import { useState, useMemo } from 'react'
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
import { Menu, X, ChevronDown, ChevronRight, Zap, MapPin } from 'lucide-react'
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
    const newResult = simulateScenario(newConfig)
    setResult(newResult)
    // Reset to peak hour of new scenario
    let peakHour = 0
    let peakDemand = 0
    newResult.hours.forEach((h, i) => {
      if (h.totalDemandMW > peakDemand) {
        peakDemand = h.totalDemandMW
        peakHour = i
      }
    })
    setSelectedHour(peakHour)
  }

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

          <main className="main-content">
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
            <SiteExplorer />
          </main>
        </div>
      )}
    </div>
  )
}

export default App
