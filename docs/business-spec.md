# Florida AI Grid Demonstrator - Business Specification

## Executive Summary

The Florida AI Grid Demonstrator is an interactive web application designed to illustrate how distributed energy resources (DERs) - including rooftop solar, electric vehicle batteries, and home energy storage - could be coordinated to support the rapidly growing demand for AI datacenter infrastructure while reducing stress on Florida's electrical grid.

**Strategic Context:** Florida faces a critical juncture. The state is becoming an attractive location for AI datacenters due to favorable business climate, tax policies, and geographic advantages. However, environmental concerns and utility capacity constraints have created political resistance to new datacenter development. This demonstrator provides a data-driven visualization of how Florida's existing and emerging distributed energy assets could be orchestrated to expand effective grid capacity without solely relying on additional traditional generation.

**Primary Value Proposition:** Transform the conversation from "AI datacenters vs. the grid" to "AI datacenters + distributed energy = grid resilience and capacity expansion."

---

## Problem Statement

### Current Challenges

1. **AI Datacenter Demand Explosion**
   - AI workloads require massive, reliable electrical capacity (typically 500MW - 1GW per campus)
   - Florida is seeing increased interest from major technology companies
   - Current planning timelines suggest 5-10GW of additional AI-related demand within the next decade

2. **Grid Capacity Constraints**
   - Florida's peak demand continues to grow residentially and commercially
   - Traditional generation expansion faces regulatory, environmental, and siting challenges
   - Transmission and distribution infrastructure has inherent limitations
   - Concerns about grid reliability during extreme weather events (hurricanes)

3. **Political & Environmental Resistance**
   - Environmental groups oppose new fossil-fuel generation
   - Residential communities resist new transmission lines and substations
   - Utility capacity concerns used as arguments against datacenter development
   - Lack of clear public understanding of how distributed resources could help

4. **Untapped Distributed Assets**
   - Florida has over 450,000 electric vehicles (growing rapidly)
   - Over 3,150 MW of customer-owned rooftop solar already installed
   - Emerging home battery market (Tesla Powerwall, etc.)
   - These assets currently operate independently, without grid coordination

### The Gap

There is no accessible, visual tool that allows policymakers, utility executives, and the public to explore how coordinated distributed energy resources could meaningfully expand Florida's effective grid capacity for AI infrastructure. The conversation is dominated by abstract arguments rather than concrete scenarios.

---

## Solution Overview

### Product Description

The Florida AI Grid Demonstrator is a browser-based interactive simulation that allows users to:

- Adjust assumptions about EV adoption, solar deployment, and battery storage
- Select between "Traditional Grid" and "Coordinated Grid" operating modes
- See real-time calculations of how distributed resources reduce utility load
- Visualize the 24-hour energy flow across the entire system
- Understand the potential capacity released for AI datacenter infrastructure
- Explore resilience scenarios (hurricane/grid outage mode)

### Key Features

**Interactive Dashboard**
- Single-page application with real-time calculations
- Visual energy-flow diagram showing power movement between grid, solar, homes, storage, and AI datacenters
- Time-of-day slider (0-23 hours) with automatic playback

**Scenario Controls**
- EV fleet size and participation rates
- Solar capacity (distributed rooftop + utility-scale)
- Home battery deployment
- AI datacenter demand levels
- Four preset scenarios (Florida Today, Moderate VPP, Aggressive 2030, No Distributed Resources)

**Operating Modes**
- Traditional Grid: Current operational paradigm
- Coordinated Grid: Future state with intelligent resource orchestration

**Visualizations**
- 24-hour demand/solar/utility/battery/AI load chart
- Before/after coordination comparison
- Peak capacity release metrics
- AI campus equivalence calculations

**Resilience Mode**
- Hurricane/grid outage simulation
- Residential backup duration estimates
- Demonstrates dual-purpose value of distributed storage

**Transparency**
- Collapsible assumptions panel
- Clear disclosure of model limitations
- Educational tooltips for all metrics

### Technical Approach

- **Technology Stack:** React, TypeScript, Vite
- **Architecture:** Clean separation between simulation engine and UI components
- **Deployment:** Browser-based, no backend required (version 1)
- **Performance:** Real-time calculations, smooth animations
- **Accessibility:** Large metrics readable from distance, responsive design

---

## Market Analysis

### Target Audiences

**Primary Audience (Policy & Advocacy)**
- Florida state legislators and their staff
- Florida Public Service Commission (PSC) members
- County and municipal officials involved in economic development
- Environmental organizations and advocacy groups
- Utility executives and planning teams

**Secondary Audience (Industry & Investment)**
- AI/technology companies considering Florida locations
- Renewable energy developers
- Energy storage companies
- Venture capital and private equity firms
- Economic development organizations

**Tertiary Audience (Education & Public)**
- University researchers and students
- Energy policy think tanks
- Technology journalists
- Public interested in energy policy

### Market Context

**Florida Energy Landscape**
- Dominant utility: Florida Power & Light (FPL)
- Rapidly growing solar deployment (both utility and distributed)
- Aggressive EV adoption targets
- Hurricane-prone, driving resilience interest
- Conservative regulatory environment but innovation-friendly

**National AI Infrastructure Trends**
- 24/7 renewable energy requirements from major tech companies
- Datacenter siting increasingly tied to clean energy access
- Grid interconnection delays becoming major bottleneck
- Interest in "behind-the-meter" solutions accelerating

**Competitive Landscape**
- No equivalent Florida-specific tool exists
- Some utilities have internal planning tools (not public)
- Academic research exists but not in accessible interactive form
- Opportunity to define the conversation

---

## Value Proposition

### For Policymakers

**Problem Solved:** Concrete data to inform policy decisions about AI datacenter development and grid modernization.

**Benefits:**
- Move beyond ideological arguments to scenario-based analysis
- Understand leverage points (policy incentives, regulatory changes)
- Quantify potential impact of specific interventions
- Communicate complex energy concepts to constituents
- Demonstrate leadership on innovative grid solutions

### For Utilities

**Problem Solved:** Visualization of how distributed resources could defer or reduce capital expenditure needs.

**Benefits:**
- Explore non-wires alternatives to grid upgrades
- Plan for VPP (Virtual Power Plant) programs
- Understand customer-side resource potential
- Inform regulatory filings and rate cases
- Build public support for innovative programs

### For AI Companies

**Problem Solved:** Evidence that Florida can accommodate their energy needs through innovative grid approaches.

**Benefits:**
- Support siting decisions with data
- Demonstrate commitment to sustainable operations
- Identify partnership opportunities with utilities and DER providers
- Shape regulatory environment through education

### For Environmental Advocates

**Problem Solved:** Path to support AI infrastructure that accelerates renewable deployment rather than fossil fuel expansion.

**Benefits:**
- Frame AI development as catalyst for distributed energy
- Identify policies that maximize renewable integration
- Support solutions that enhance grid resilience
- Move from opposition to constructive engagement

### For Florida Economy

**Problem Solved:** Overcoming grid capacity as barrier to high-value AI industry development.

**Benefits:**
- Attract multi-billion dollar AI infrastructure investments
- Create high-tech jobs
- Position Florida as leader in innovative grid solutions
- Develop exportable expertise in coordinated energy systems

---

## Business Case

### Development Approach

**AI-Assisted Specification-Driven Development using agentic coding tools, with scope and schedule refined after technical specification and initial prototype.**

This project leverages modern AI development tools to accelerate delivery while maintaining high quality. The development process uses:

- **Specification-driven development:** Detailed technical and business specifications guide implementation
- **Agentic coding tools:** AI assistants handle routine implementation, testing, and optimization
- **Iterative refinement:** Scope and schedule are continuously refined based on technical specification validation and initial prototype results
- **Rapid prototyping:** Quick feedback loops to validate assumptions and approach

This approach enables faster development cycles, reduced manual coding overhead, and the ability to explore multiple implementation approaches efficiently.

### Development Investment

**Phase 1 (MVP - 6-8 weeks)**
- Core simulation engine
- Basic dashboard with essential controls
- Traditional vs. Coordinated comparison
- 24-hour visualization
- Hurricane mode
- Estimated effort: AI-assisted development with technical guidance

**Phase 2 (Enhancement - 4-6 weeks)**
- Refined visual design and animations
- Additional scenario presets
- Enhanced assumptions panel
- Mobile responsiveness improvements
- Export functionality (PDF reports, CSV data)

**Phase 3 (Advanced Features - 6-8 weeks)**
- Real FPL load data integration
- County-level analysis
- Financial modeling (rate impacts, investment returns)
- Carbon emission calculations
- Scenario save/load/sharing

### Illustrative Impact & ROI Scenarios

Note: These scenarios illustrate potential economic scale and strategic impact. Figures are directional, not financial projections, and will require validation using cited public data, utility tariffs, infrastructure cost estimates, and formal economic modeling.

**Scenario A: Policy Influence (High Impact)**
- If demonstrator influences approval of a single 1GW AI campus
- Economic impact: $2-5 billion investment, thousands of jobs
- Potential impact: A single large AI datacenter development can represent billions of dollars of capital investment. If the demonstrator materially contributes to policy, infrastructure, or siting decisions, the economic activity influenced could be orders of magnitude larger than the cost of developing the tool.

**Scenario B: Utility Program Adoption (Medium Impact)**
- If utility launches VPP program based on demonstrator insights
- Potential impact: Coordinated DER/VPP programs may defer or reduce portions of generation, transmission, or distribution investment by reducing peak demand. The demonstrator will model these effects, but actual avoided-capital value requires utility-specific engineering and economic analysis.

**Scenario C: Industry Positioning (Strategic Impact)**
- Establishes thought leadership in AI-grid intersection
- Attracts partnerships, speaking opportunities, consulting
- Potential impact: consulting, partnership, speaking, or commercial opportunities

**Scenario D: Portfolio/Resume Value (Personal Impact)**
- Demonstrates full-stack development, domain expertise, strategic thinking
- Differentiates in job market for energy-tech, policy-tech, or AI infrastructure roles
- Potential impact: differentiation for AI infrastructure, product, and technology leadership opportunities.

### Funding Options

**Self-Funded (Portfolio Approach)**
- Low six-figure total investment
- Complete ownership and control
- Flexibility to adapt based on feedback
- Can be used as portfolio piece regardless of commercial success

**Grant-Funded (Policy/Research Approach)**
- DOE ARPA-E or similar innovation grants
- University partnerships
- Focus on research and policy impact
- Requires grant writing overhead

**Industry-Sponsored (Partnership Approach)**
- Utility or AI company sponsorship
- Access to real data and expertise
- Potential conflict of interest concerns
- May limit independent positioning

**Hybrid Approach**
- Initial self-funded MVP
- Use MVP to secure partnerships or grants
- Maintain independence while scaling

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Set up React/TypeScript/Vite project structure
- Define TypeScript interfaces for all data structures
- Implement 24-hour demand curve (Florida residential profile)
- Implement solar generation curve
- Create basic simulation engine skeleton
- Set up automated testing framework

### Phase 2: Core Simulation (Weeks 3-4)
- Implement EV battery calculations
- Implement home battery calculations
- Implement storage charge/discharge logic
- Implement Traditional Grid mode calculations
- Implement Coordinated Grid mode calculations
- Write unit tests for all calculations
- Verify logical behavior across edge cases

### Phase 3: Basic UI (Weeks 5-6)
- Create dashboard layout
- Implement scenario controls (sliders, inputs)
- Implement time-of-day slider
- Create metric card components
- Implement mode toggle (Traditional/Coordinated)
- Connect UI to simulation engine

### Phase 4: Visualizations (Weeks 7-8)
- Implement energy-flow diagram
- Create 24-hour chart (Chart.js or similar)
- Implement before/after comparison view
- Add AI capacity equivalence display
- Implement Hurricane mode UI
- Add smooth animations and transitions

### Phase 5: Polish & Documentation (Weeks 9-10)
- Refine visual design (typography, spacing, colors)
- Implement tooltips for all metrics
- Create assumptions panel
- Add scenario presets
- Write user documentation
- Performance optimization
- Cross-browser testing

### Phase 6: Deployment & Feedback (Weeks 11-12)
- Deploy to hosting platform (Vercel, Netlify, or similar)
- Conduct user testing with target audiences
- Gather feedback and iterate
- Create presentation materials for policymakers
- Prepare demo scenarios for different audiences

---

## Risk Assessment

### Technical Risks

**Risk:** Simulation complexity leads to oversimplification or errors
- **Mitigation:** Transparent assumptions, clear limitations, peer review from energy experts
- **Contingency:** Start simple, add complexity iteratively

**Risk:** Performance issues with real-time calculations
- **Mitigation:** Efficient algorithms, memoization, pre-calculation where possible
- **Contingency:** Debounce slider inputs, show loading states

**Risk:** Chart library limitations
- **Mitigation:** Evaluate multiple libraries (Chart.js, Recharts, D3) early
- **Contingency:** Custom D3 implementation if needed

### Business/Political Risks

**Risk:** Utility pushback on assumptions or methodology
- **Mitigation:** Engage utility experts early, use publicly available data, transparent methodology
- **Contingency:** Frame as educational tool, not engineering study

**Risk:** Misinterpretation or misuse of results
- **Mitigation:** Clear disclaimers, prominent assumptions panel, tooltips on all metrics
- **Contingency:** Version with more guardrails for public use

**Risk:** Political polarization limits adoption
- **Mitigation:** Non-partisan framing, focus on data and scenarios, avoid policy prescriptions
- **Contingency:** Multiple versions for different audiences

### Personal/Career Risks

**Risk:** Portfolio piece seen as too political or controversial
- **Mitigation:** Frame as technical demonstration, emphasize simulation aspects
- **Contingency:** Can position as showing both sides of argument

**Risk:** Over-investment without clear commercial path
- **Mitigation:** Set clear budget limits, phase development, evaluate after MVP
- **Contingency:** Portfolio value exists even without commercial success

---

## Success Metrics

### Technical Metrics
- [ ] Zero TypeScript compilation errors
- [ ] All unit tests passing (target: 80%+ coverage of simulation code)
- [ ] Sub-100ms calculation time for full 24-hour simulation
- [ ] Works across major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile-responsive (usable on tablet, phone optional)

### User Experience Metrics
- [ ] Average time to understand core concept: < 2 minutes
- [ ] Average time to first meaningful scenario change: < 30 seconds
- [ ] User can successfully complete basic scenario exploration without help
- [ ] Visual feedback on all interactions (immediate recalculation)
- [ ] Clear distinction between Traditional and Coordinated modes

### Impact Metrics (If Used for Advocacy)
- [ ] Presented to at least 3 policymakers or their staff
- [ ] Referenced in policy discussion or filing
- [ ] Shared by at least 2 organizations (utility, environmental group, etc.)
- [ ] Demonstrated in at least 1 public meeting or hearing
- [ ] Media coverage or blog posts mentioning the tool

### Portfolio/Career Metrics
- [ ] Included in professional portfolio with case study
- [ ] Discussed in job interviews as example of full-stack development
- [ ] Used as reference for domain expertise in energy-tech
- [ ] Leads to connections or opportunities in energy/AI space

---

## Future Enhancement Opportunities

### Data Integration
- Real FPL hourly load data
- Historical Florida solar production data
- Weather data integration
- County-level analysis and aggregation

### Advanced Modeling
- Transmission constraints
- Distribution transformer limitations
- Generator ramp rates
- Battery degradation over time
- Electricity market pricing

### Expanded Scenarios
- Nuclear generation contribution
- Natural gas generation profiles
- Utility-scale battery facilities
- Data-center flexible workloads
- EV charging behavior distributions

### Collaboration Features
- Scenario save/load
- Scenario sharing (URL-based)
- CSV import/export
- Multi-user scenario comparison
- Annotation and commenting

### Financial Modeling
- Rate impact calculations
- Investment return analysis
- Cost-benefit comparisons
- Carbon pricing integration
- Incentive program modeling

### Geographic Expansion
- Other states with similar challenges (Texas, Arizona, etc.)
- Customizable for different utility territories
- International adaptation potential

---

## Competitive Positioning

### Differentiators

**Florida-Specific**
- Tailored to Florida's regulatory environment
- Florida-specific solar and demand profiles
- Addresses Florida's unique hurricane resilience needs

**Accessible & Transparent**
- No login or account required
- Open methodology and assumptions
- Educational rather than sales-focused

**Dual-Purpose Design**
- Technical accuracy for utility/industry use
- Visual clarity for public/policy communication
- Resilience mode demonstrates broader value

**Future-Proof Architecture**
- Modular design allows incremental enhancement
- Clean separation of concerns
- Can incorporate real data when available

### Barriers to Entry for Competitors

- Domain expertise required (energy systems + policy)
- Understanding of Florida-specific context
- UX design skill for complex data visualization
- Credibility with both technical and policy audiences

---

## Conclusion

The Florida AI Grid Demonstrator represents a unique opportunity to address a genuine challenge at the intersection of technology, energy policy, and economic development. By creating an accessible, data-driven tool that illustrates how distributed energy resources could expand grid capacity for AI infrastructure, this project can:

1. **Advance the policy conversation** from ideological opposition to scenario-based exploration
2. **Demonstrate technical capability** through a sophisticated full-stack application
3. **Create portfolio value** by showing domain expertise and strategic thinking
4. **Potentially influence real outcomes** if used effectively in policy discussions

The development investment is modest relative to potential impact, and the phased approach allows for validation at each stage. Even if the tool never achieves commercial or policy success, the development process itself produces a compelling portfolio piece that demonstrates full-stack development, data visualization, domain expertise, and the ability to translate complex concepts into accessible user experiences.

**Recommendation:** Proceed with Phase 1 (MVP) development, using the detailed technical specification as the implementation guide. Evaluate impact and interest after MVP completion before committing to Phases 2 and 3.

---

## Appendix A: Key Terms

- **DER (Distributed Energy Resources):** Small-scale energy resources located at or near the point of use (solar panels, batteries, EVs)
- **VPP (Virtual Power Plant):** Network of distributed energy resources aggregated to provide grid services
- **Behind-the-meter:** Energy resources on the customer side of the utility meter
- **Vehicle-to-Grid (V2G):** Technology allowing EV batteries to discharge power back to the grid
- **Peak Demand:** Period of highest electricity demand on the grid
- **Capacity:** The maximum power output a system can provide (MW)
- **Energy:** The total amount of electricity produced or consumed over time (MWh)
- **Round-trip Efficiency:** Percentage of energy put into storage that can be retrieved
- **Interconnection:** Physical connection point between a generator and the grid

## Appendix B: Florida Energy Context

**Key Statistics (Approximate)**
- Population: 22+ million
- Peak demand: ~30 GW (varies by utility)
- Solar installed: 7+ GW (utility + distributed)
- EVs: 450,000+ (growing rapidly)
- Major utilities: FPL, Duke Energy Florida, Tampa Electric

**Regulatory Context**
- Florida Public Service Commission (PSC) regulates utilities
- Renewable Portfolio Standard: None (voluntary targets)
- Net metering: Available but policy evolving
- V2G regulations: Not yet established

## Appendix C: AI Datacenter Energy Context

**Typical Specifications**
- Small campus: 100-250 MW
- Medium campus: 500 MW
- Large campus: 1 GW+
- 24/7 operation baseline
- Growth trajectory: 3-5x current demand projected in 5-10 years

**Energy Goals**
- Major tech companies: 24/7 carbon-free energy by 2030
- Preference for locations with existing clean energy
- Interest in innovative grid solutions
- Long-term power purchase agreements (PPAs)

---

*Document Version: 1.0*
*Last Updated: August 16, 2026*
*Author: Chuck Farah*
