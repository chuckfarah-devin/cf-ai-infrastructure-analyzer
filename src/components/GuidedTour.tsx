/**
 * GuidedTour — a five-step, user-paced overlay walkthrough.
 *
 * Steps: Today's approach → Smarter coordination → Watch the day →
 * Look at the place → What's this telling me?
 *
 * The panel never advances on its own. It explains what the tour is
 * changing and restores the user's settings, hour, and view on exit.
 */

import { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, ChevronLeft, Play, RotateCcw, Compass, HelpCircle } from 'lucide-react';
import type { TourDiff } from '../data/guidedTour';

export interface TourStepContent {
  title: string;
  takeaway: string;
  explanation: string;
  /** Optional "Explain this" disclosure text (definitions, limitations). */
  detail?: string;
  /** Optional action buttons specific to this step. */
  action?: React.ReactNode;
}

interface GuidedTourProps {
  step: number;           // 0..4
  content: TourStepContent;
  diffs?: TourDiff[];     // shown on the coordination step
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  onRestart: () => void;
}

export function GuidedTour({ step, content, diffs, onNext, onBack, onExit, onRestart }: GuidedTourProps) {
  const [showDetail, setShowDetail] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isLast = step === 4;

  // Focus the panel when the step changes; Escape exits the tour.
  useEffect(() => {
    panelRef.current?.focus();
    setShowDetail(false);
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  return (
    <div
      className="guided-tour-panel"
      role="dialog"
      aria-modal="false"
      aria-label={`Guided tour, step ${step + 1} of 5: ${content.title}`}
      ref={panelRef}
      tabIndex={-1}
    >
      <div className="tour-banner">
        <span className="tour-step-count">Step {step + 1} of 5</span>
        <span className="tour-temporary">Guided demo — your settings will be restored</span>
        <button type="button" className="tour-exit" onClick={onExit} aria-label="Exit tour">
          <X size={14} />
        </button>
      </div>

      <h3 className="tour-title">{content.title}</h3>
      <p className="tour-takeaway">{content.takeaway}</p>
      <p className="tour-explanation">{content.explanation}</p>

      {diffs && diffs.length > 0 && (
        <div className="tour-diffs">
          {diffs.map((d, i) => (
            <div key={i} className="tour-diff">
              <span className="tour-diff-value">{d.label}</span>
              <span className="tour-diff-scope">{d.scope}</span>
            </div>
          ))}
        </div>
      )}

      {content.action}

      {content.detail && (
        <button
          type="button"
          className="tour-explain-toggle"
          onClick={() => setShowDetail(v => !v)}
          aria-expanded={showDetail}
        >
          <HelpCircle size={13} /> {showDetail ? 'Hide explanation' : 'Explain this'}
        </button>
      )}
      {showDetail && content.detail && <p className="tour-detail">{content.detail}</p>}

      <div className="tour-controls">
        <div className="tour-dots" aria-hidden="true">
          {[0, 1, 2, 3, 4].map(i => (
            <span key={i} className={`tour-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
          ))}
        </div>
        <div className="tour-buttons">
          {step > 0 && (
            <button type="button" className="tour-btn tour-btn-back" onClick={onBack}>
              <ChevronLeft size={14} /> Back
            </button>
          )}
          {isLast ? (
            <>
              <button type="button" className="tour-btn tour-btn-secondary" onClick={onRestart}>
                <RotateCcw size={13} /> Restart tour
              </button>
              <button type="button" className="tour-btn tour-btn-primary" onClick={onExit}>
                <Compass size={14} /> Explore on my own
              </button>
            </>
          ) : (
            <button type="button" className="tour-btn tour-btn-primary" onClick={onNext}>
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Step-3 playback trigger — explicit user action, pauses on advance/exit. */
export function TourPlayButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="tour-btn tour-btn-play" onClick={onToggle} aria-pressed={playing}>
      {playing ? 'Pause the day' : <><Play size={13} /> Play through the day</>}
    </button>
  );
}
