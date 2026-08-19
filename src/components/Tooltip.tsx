/**
 * Accessible tooltip component for acronyms and terminology
 * Provides explanations on hover and keyboard focus
 */

import { useState, useRef } from 'react';

interface TooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export function Tooltip({ term, definition, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  return (
    <span
      className="tooltip-container"
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="button"
      aria-label={`${term}: ${definition}`}
      aria-describedby={isVisible ? `tooltip-${term}` : undefined}
    >
      <span className="tooltip-trigger">{children}</span>
      {isVisible && (
        <span
          id={`tooltip-${term}`}
          className="tooltip-content"
          role="tooltip"
          aria-live="polite"
        >
          <strong>{term}:</strong> {definition}
        </span>
      )}
    </span>
  );
}