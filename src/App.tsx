import { useState } from 'react'
import { simulateScenario } from './simulation/engine'
import { floridaDefaults } from './data/floridaDefaults'
import type { ScenarioConfig } from './simulation/types'
import { Controls } from './components/Controls'
import { SummaryPanel } from './components/SummaryPanel'
import { Charts } from './components/Charts'
import { AssumptionsPanel } from './components/AssumptionsPanel'
import './index.css'

function App() {
  const [config, setConfig] = useState<ScenarioConfig>(floridaDefaults)
  const [result, setResult] = useState(() => simulateScenario(config))
  const [showAssumptions, setShowAssumptions] = useState(false)

  const handleConfigChange = (newConfig: ScenarioConfig) => {
    setConfig(newConfig)
    setResult(simulateScenario(newConfig))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Florida AI Grid Demonstrator</h1>
        <p>Interactive simulation of distributed energy resources supporting AI datacenter demand</p>
        <button
          className="assumptions-toggle"
          onClick={() => setShowAssumptions(!showAssumptions)}
        >
          {showAssumptions ? 'Hide' : 'Show'} Assumptions & Limitations
        </button>
      </header>

      {showAssumptions && <AssumptionsPanel />}

      <div className="app-content">
        <aside className="sidebar">
          <Controls config={config} onConfigChange={handleConfigChange} />
        </aside>

        <main className="main-content">
          <SummaryPanel summary={result.summary} operatingMode={config.operatingMode} />
          <Charts hours={result.hours} operatingMode={config.operatingMode} />
        </main>
      </div>
    </div>
  )
}

export default App
