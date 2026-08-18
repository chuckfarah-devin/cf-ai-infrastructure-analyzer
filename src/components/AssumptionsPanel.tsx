/**
 * Assumptions and Limitations Panel
 * Provides transparency about simulation assumptions and data sources
 */

import React from 'react';

export function AssumptionsPanel() {
  return (
    <div className="assumptions-panel">
      <h2>Assumptions & Limitations</h2>

      <div className="assumptions-content">
        <div className="assumption-section">
          <h3>Scope & Purpose</h3>
          <p>
            This demonstrator illustrates how distributed energy resources (DERs) can support AI datacenter demand
            in Florida. It is designed for policy advocacy and portfolio demonstration, not operational planning.
          </p>
        </div>

        <div className="assumption-section">
          <h3>Key Assumptions</h3>
          <ul>
            <li><strong>Demand Curve:</strong> Illustrative Florida residential demand pattern (normalized 0-1 scale)</li>
            <li><strong>Solar Profile:</strong> Simplified daily solar curve based on typical Florida insolation</li>
            <li><strong>EV Participation:</strong> Adjustable rate representing VPP enrollment</li>
            <li><strong>Battery Availability:</strong> Portion of EV/home battery capacity available for grid services</li>
            <li><strong>Efficiency:</strong> 95% round-trip efficiency for charging/discharging</li>
            <li><strong>Coordinated Mode:</strong> Conceptual VPP orchestration (not currently deployed at scale)</li>
          </ul>
        </div>

        <div className="assumption-section">
          <h3>Florida Context</h3>
          <ul>
            <li><strong>Rooftop Solar:</strong> ~5,000 MW distributed solar (illustrative - replace with actual FPL data)</li>
            <li><strong>Utility Solar:</strong> ~2,000 MW utility-scale solar (illustrative - replace with actual FPL data)</li>
            <li><strong>EV Adoption:</strong> 1M EVs in Florida (state-level estimate)</li>
            <li><strong>Home Batteries:</strong> 250k home batteries (Tesla Powerwall-style deployment)</li>
          </ul>
        </div>

        <div className="assumption-section">
          <h3>Technical Limitations</h3>
          <ul>
            <li><strong>No Spatial Resolution:</strong> Single-node model (no geographic distribution)</li>
            <li><strong>No Transmission Constraints:</strong> Assumes unlimited grid capacity</li>
            <li><strong>No Interhour Constraints:</strong> Each hour calculated independently</li>
            <li><strong>Simplified DER Physics:</strong> Linear charge/discharge curves</li>
            <li><strong>No Weather Variation:</strong> Fixed solar profile (no cloud cover variability)</li>
            <li><strong>No Demand Response:</strong> Fixed load profiles (no load shifting)</li>
          </ul>
        </div>

        <div className="assumption-section">
          <h3>Mode Differences</h3>
          <ul>
            <li><strong>Traditional Mode:</strong> Represents current-state operation without VPP coordination</li>
            <li><strong>Coordinated Mode:</strong> Conceptual VPP operation with intelligent DER dispatch</li>
            <li><strong>Hurricane Mode:</strong> Island operation with grid disconnection and critical load prioritization</li>
          </ul>
        </div>

        <div className="assumption-section">
          <h3>Data Sources</h3>
          <ul>
            <li>Replace illustrative demand curve with actual FPL hourly load data</li>
            <li>Replace solar profile with actual Florida insolation measurements</li>
            <li>Validate EV adoption figures with Florida DMV registration data</li>
            <li>Update battery deployment figures with utility interconnection data</li>
          </ul>
        </div>

        <div className="assumption-section">
          <h3>Future Enhancements</h3>
          <ul>
            <li>Add weather-dependent solar variability</li>
            <li>Incorporate transmission constraints and congestion modeling</li>
            <li>Add spatial resolution with regional demand patterns</li>
            <li>Include demand response and load shifting capabilities</li>
            <li>Add economic analysis (costs, savings, ROI)</li>
            <li>Integrate with real-time grid data APIs</li>
          </ul>
        </div>

        <div className="assumption-section warning">
          <h3>Disclaimer</h3>
          <p>
            This tool is for educational and advocacy purposes only. Results should not be used for operational
            planning, investment decisions, or regulatory filings without validation with actual data and
            regulatory approval.
          </p>
        </div>
      </div>
    </div>
  );
}