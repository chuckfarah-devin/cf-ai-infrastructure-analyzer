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
import { FinancialDashboard } from './components/FinancialDashboard'
import { AssumptionsPanel } from './components/AssumptionsPanel'
import { Menu, X } from 'lucide-react'
import './index.css'

function App() {
  const [config, setConfig] = useState<ScenarioConfig>(floridaDefaults)
  const [result, setResult] = useState(() => simulateScenario(config))
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [financialAssumptions, setFinancialAssumptions] = useState<FinancialAssumptions>(defaultFinancialAssumptions)

  const handleConfigChange = (newConfig: ScenarioConfig) => {
    setConfig(newConfig)
    setResult(simulateScenario(newConfig))
  }

  // Compute traditional-mode hours for comparison when in coordinated mode.
  // Memoized to avoid re-running the simulation on every render.
  const traditionalHours = useMemo(() => {
    if (config.operatingMode !== 'coordinated') return null
    const traditionalConfig = { ...config, operatingMode: 'traditional' as const }
    return simulateScenario(traditionalConfig).hours
  }, [config])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-brand">
          <h1>Florida AI Grid Demonstrator</h1>
          <span className="app-header-subtitle">Interactive energy-flow simulation</span>
        </div>
        <div className="app-header-actions">
          <button
            className="header-btn"
            onClick={() => setShowControls(!showControls)}
            aria-label={showControls ? 'Hide controls' : 'Show controls'}
          >
            {showControls ? <X size={18} /> : <Menu size={18} />}
            <span>{showControls ? 'Hide Controls' : 'Controls'}</span>
          </button>
          <button
            className="header-btn"
            onClick={() => setShowAssumptions(!showAssumptions)}
          >
            {showAssumptions ? 'Hide Assumptions' : 'Assumptions'}
          </button>
        </div>
      </header>

      {showAssumptions && <AssumptionsPanel />}

      <div className={`app-content ${!showControls ? 'controls-collapsed' : ''}`}>
        <aside className={`sidebar ${!showControls ? 'hidden' : ''}`}>
          <Controls config={config} onConfigChange={handleConfigChange} />
        </aside>

        <main className="main-content">
          <EnergyFlow config={config} hours={result.hours} />
          <SummaryPanel summary={result.summary} operatingMode={config.operatingMode} />
          <Charts hours={result.hours} operatingMode={config.operatingMode} />
          <FinancialDashboard
            hours={result.hours}
            traditionalHours={traditionalHours}
            operatingMode={config.operatingMode}
            assumptions={financialAssumptions}
            onAssumptionsChange={setFinancialAssumptions}
          />
        </main>
      </div>
    </div>
  )
}

export default App
