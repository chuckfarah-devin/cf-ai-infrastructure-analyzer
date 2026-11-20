/**
 * "Check for Updates" — external news search link for a project profile.
 *
 * Opens a Google News search for project-specific terms in a new tab.
 * Results there are UNVERIFIED and do not update the curated record.
 *
 * The GDELT live-fetch plumbing (projectNewsQueries.fetchProjectNews and
 * friends) is retained for a future cached/baked implementation but is not
 * wired to the UI — GDELT's error responses arrive without CORS headers,
 * making client-side failure detection unreliable.
 */

import { Newspaper, ExternalLink } from 'lucide-react';
import { PROJECT_NEWS_QUERIES, googleNewsSearchUrl } from '../data/projectNewsQueries';

export function ProjectNewsUpdates({ projectId }: { projectId: string }) {
  const query = PROJECT_NEWS_QUERIES[projectId];
  if (!query) return null;

  return (
    <div className="site-detail-section project-news-section">
      <h4><Newspaper size={15} /> Check for Updates</h4>
      <p className="project-news-note">
        Search the news for {query.description}.
      </p>
      <a
        href={googleNewsSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className="news-search-link"
      >
        <Newspaper size={14} /> Search latest coverage <ExternalLink size={11} />
      </a>
      <p className="project-news-disclaimer">
        Opens Google News. Coverage is unverified and does not update this project record.
      </p>
    </div>
  );
}
