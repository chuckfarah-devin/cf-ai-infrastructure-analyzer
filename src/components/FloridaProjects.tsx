/**
 * Florida Projects — curated, evidence-qualified profiles of documented
 * Florida infrastructure projects (Phase 1: data centers).
 *
 * Read-only presentation: documented figures are displayed with their
 * exact meaning (IT load ≠ facility demand ≠ service request) and are
 * not wired into the energy simulation. Pipeline/infrastructure
 * profiles are deferred until official route geometry exists.
 *
 * Reuses ConfidenceBadge/FactRow from SiteExplorer and the existing
 * satellite/environmental view for drill-in context.
 */

import { lazy, Suspense, useState } from 'react';
import {
  Satellite, ExternalLink, HelpCircle, AlertTriangle,
  ChevronRight, MapPin, Server, Droplets, CalendarClock, Link2,
} from 'lucide-react';
import { FLORIDA_PROJECTS, type FloridaProject, type CapacityFigure, VERIFICATION_DATE } from '../data/floridaProjectsData';
import { ConfidenceBadge } from './SiteExplorer';
import type { SatelliteSite } from './StJohnsSatelliteView';

const SiteSatelliteView = lazy(() => import('./StJohnsSatelliteView'));
const ProjectsOverviewMap = lazy(() => import('./ProjectsOverviewMap'));

const CAPACITY_MEANING_LABELS: Record<CapacityFigure['meaning'], string> = {
  'facility-demand': 'Total facility demand',
  'it-load': 'IT load only — below total facility demand',
  'service-request': 'Service request — not actual consumption',
  'nameplate': 'Nameplate capacity — not continuous output',
  'unknown': 'Not documented',
};

const EVIDENCE_LABELS = {
  'agency-record': 'Agency record',
  'developer-claim': 'Developer claim',
  'news-report': 'News report',
} as const;

function projectToSatelliteSite(project: FloridaProject, viewMode: 'site' | 'area'): SatelliteSite {
  return {
    name: project.name,
    city: project.city,
    county: project.county,
    coordinates: project.coordinates!,
    coordinateSource: { label: project.coordinateNote, date: `verified ${VERIFICATION_DATE}` },
    classification: 'active_proposal',
    classificationLabel: project.classificationLabel,
    markerColor: project.markerColor,
    whyIncluded: project.whyIncluded,
    viewMode,
  };
}

function CapacityBlock({ figure }: { figure: CapacityFigure }) {
  return (
    <div className="project-capacity">
      <div className="project-capacity-header">
        <ConfidenceBadge level={figure.confidence} />
        <span className="capacity-meaning">{CAPACITY_MEANING_LABELS[figure.meaning]}</span>
      </div>
      <p className="project-capacity-value">
        {figure.valueMW !== undefined ? `${figure.valueMW} MW — ` : ''}{figure.label}
        {figure.phase ? ` (${figure.phase})` : ''}
      </p>
      {figure.source && (
        <div className="site-fact-source">
          Source: {figure.source.label}
          {figure.source.date && <> ({figure.source.date})</>}
          {figure.source.url && (
            <a href={figure.source.url} target="_blank" rel="noopener noreferrer" className="source-link">
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}
      {figure.note && <p className="site-fact-note">{figure.note}</p>}
    </div>
  );
}

function ProjectDetail({ project, onOpenSatellite, onOpenAreaView }: { project: FloridaProject; onOpenSatellite: () => void; onOpenAreaView: () => void }) {
  return (
    <div className="site-detail project-detail">
      <div className="site-detail-header">
        <div>
          <h3>{project.name}</h3>
          <span className="site-detail-location">{project.city}, {project.county} County</span>
        </div>
        <span className="classification-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' }}>
          {project.classificationLabel}
        </span>
      </div>

      <p className="site-detail-why">{project.overview}</p>

      <div className="project-role-line">
        <Server size={14} />
        <span>{project.roleLabel}</span>
      </div>

      <div className="site-action-buttons">
        {project.supportsEnvironmentalContext && project.coordinates && (
          <button type="button" className="satellite-view-btn" onClick={onOpenSatellite}>
            <Satellite size={16} />
            Explore Satellite &amp; Environmental Context
          </button>
        )}
        {!project.supportsEnvironmentalContext && project.coordinates && (
          <button type="button" className="satellite-view-btn satellite-view-btn-area" onClick={onOpenAreaView}>
            <Satellite size={16} />
            View General Area (approximate)
          </button>
        )}
      </div>

      <div className="site-detail-section">
        <h4>Status</h4>
        <p className="project-status">
          <ConfidenceBadge level={project.statusConfidence} /> {project.status}
        </p>
        {project.statusSource && (
          <div className="site-fact-source">
            Source: {project.statusSource.label}
            {project.statusSource.date && <> ({project.statusSource.date})</>}
            {project.statusSource.url && (
              <a href={project.statusSource.url} target="_blank" rel="noopener noreferrer" className="source-link">
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="site-detail-section">
        <h4><MapPin size={15} /> Location precision</h4>
        <p className="project-coordinate-note">{project.coordinateNote}</p>
      </div>

      <div className="site-detail-section">
        <h4><Server size={15} /> Documented capacity</h4>
        {project.capacities.map((figure, i) => <CapacityBlock key={i} figure={figure} />)}
        {project.waterContext && (
          <p className="project-water"><Droplets size={13} /> {project.waterContext}</p>
        )}
      </div>

      <div className="site-detail-section">
        <h4><CalendarClock size={15} /> Dated record</h4>
        <ul className="project-milestones">
          {project.milestones.map((m, i) => (
            <li key={i}>
              <span className={`milestone-evidence milestone-${m.evidence}`}>{EVIDENCE_LABELS[m.evidence]}</span>
              <strong>{m.date}</strong> — {m.event}
              {m.source?.url && (
                <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="source-link">
                  <ExternalLink size={10} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="site-detail-section">
        <h4><AlertTriangle size={15} /> Unresolved questions</h4>
        <ul className="site-uncertainties">
          {project.unresolved.map((u, i) => (
            <li key={i}><HelpCircle size={12} className="uncertainty-icon" />{u}</li>
          ))}
        </ul>
      </div>

      <div className="site-detail-section">
        <h4><Link2 size={15} /> Sources</h4>
        <ul className="project-sources">
          {project.sources.map((s, i) => (
            <li key={i}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}<ExternalLink size={10} /></a>
              ) : s.label}
              {s.date && <span className="source-date"> — {s.date}</span>}
            </li>
          ))}
        </ul>
        <p className="project-verify-date">Records verified {VERIFICATION_DATE}.</p>
      </div>
    </div>
  );
}

export function FloridaProjects() {
  const [selectedId, setSelectedId] = useState(FLORIDA_PROJECTS[0].id);
  const [satelliteMode, setSatelliteMode] = useState<'site' | 'area' | null>(null);
  const selected = FLORIDA_PROJECTS.find(p => p.id === selectedId) ?? FLORIDA_PROJECTS[0];

  if (satelliteMode && selected.coordinates &&
      (satelliteMode === 'area' || selected.supportsEnvironmentalContext)) {
    return (
      <Suspense fallback={<div className="satellite-loading">Loading satellite map…</div>}>
        <SiteSatelliteView
          key={selected.id}
          site={projectToSatelliteSite(selected, satelliteMode)}
          onBack={() => setSatelliteMode(null)}
        />
      </Suspense>
    );
  }

  return (
    <div className="florida-projects">
      <p className="projects-intro">
        Documented Florida infrastructure proposals and facilities — verified against public records
        where available. Markers show location precision; profiles distinguish agency records,
        developer claims, and unresolved questions. Verified {VERIFICATION_DATE}.
      </p>

      <div className="site-explorer-body">
        <div className="site-explorer-map-panel projects-map-panel">
          <Suspense fallback={<div className="satellite-loading">Loading map…</div>}>
            <ProjectsOverviewMap
              projects={FLORIDA_PROJECTS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </Suspense>
          <div className="projects-map-legend">
            <span><span className="legend-dot legend-precise" /> Address / parcel-documented</span>
            <span><span className="legend-dot legend-area" /> Approximate area only</span>
          </div>
        </div>

        <div className="site-comparison-list">
          {FLORIDA_PROJECTS.map(project => (
            <button
              key={project.id}
              className={`site-comparison-item ${project.id === selectedId ? 'selected' : ''}`}
              onClick={() => setSelectedId(project.id)}
            >
              <span className="site-comparison-info">
                <span className="site-comparison-name">{project.name}</span>
                <span className="site-comparison-meta">{project.county} Co. · {project.roleLabel}</span>
              </span>
              <span className="table-classification">{project.classificationLabel}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      </div>

      <ProjectDetail
        project={selected}
        onOpenSatellite={() => setSatelliteMode('site')}
        onOpenAreaView={() => setSatelliteMode('area')}
      />
    </div>
  );
}
