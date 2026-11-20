/**
 * "Check for Updates" — live headline discovery for a project profile.
 *
 * Fetches recent headlines from the GDELT public API on demand and renders
 * them as UNVERIFIED items, visually separate from the curated, source-checked
 * project record. Nothing fetched here modifies project data.
 */

import { useEffect, useRef, useState } from 'react';
import { Newspaper, ExternalLink, AlertTriangle, LoaderCircle } from 'lucide-react';
import {
  fetchProjectNews,
  PROJECT_NEWS_QUERIES,
  NewsServiceError,
  type NewsArticle,
} from '../data/projectNewsQueries';

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'results'; articles: NewsArticle[]; searchedAt: Date }
  | { status: 'empty'; searchedAt: Date }
  | { status: 'error'; message: string; retryable: boolean };

const RETRYABLE: NewsServiceError['kind'][] = ['rate-limited', 'timeout', 'network', 'http'];

// Module-level cooldown: GDELT rate-limits per IP (~1 request per 5s), so the
// guard must survive project switches and component remounts.
let lastFetchAt = 0;

export function ProjectNewsUpdates({ projectId }: { projectId: string }) {
  const query = PROJECT_NEWS_QUERIES[projectId];
  const [state, setState] = useState<FetchState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  // Switching projects: cancel any in-flight request and drop stale results
  // so a previous project's headlines never appear under a new profile.
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ status: 'idle' });
  }, [projectId]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!query) return null;

  const checkForUpdates = async () => {
    if (state.status === 'loading') return;
    if (Date.now() - lastFetchAt < 5000) {
      setState({
        status: 'error',
        message: 'Please wait a few seconds between searches — the public news service limits request frequency.',
        retryable: true,
      });
      return;
    }
    lastFetchAt = Date.now();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);
    setState({ status: 'loading' });
    let timedOut = false;
    try {
      const result = await fetchProjectNews(query, controller.signal);
      if (controller !== abortRef.current) return; // superseded by a newer request
      setState(
        result.articles.length === 0
          ? { status: 'empty', searchedAt: result.searchedAt }
          : { status: 'results', articles: result.articles, searchedAt: result.searchedAt },
      );
    } catch (error) {
      if (controller !== abortRef.current || (error instanceof DOMException && error.name === 'AbortError' && !timedOut)) {
        return; // deliberately aborted by a project switch or unmount — ignore
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        setState({
          status: 'error',
          message: 'The news service did not respond within 15 seconds. Try again in a moment.',
          retryable: true,
        });
      } else if (error instanceof NewsServiceError) {
        setState({ status: 'error', message: error.message, retryable: RETRYABLE.includes(error.kind) });
      } else {
        setState({
          status: 'error',
          message: 'The news service could not be reached — it may be rate-limiting requests or temporarily unavailable. Wait a moment and try again.',
          retryable: true,
        });
      }
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const searchedLabel =
    state.status === 'results' || state.status === 'empty'
      ? state.searchedAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      : null;

  return (
    <div className="site-detail-section project-news-section">
      <h4><Newspaper size={15} /> Check for Updates</h4>
      <p className="project-news-note">
        Live headline search for {query.description}, via the free GDELT public news index.
        Dates shown are when GDELT first indexed each article, not publisher dates.
        Results are <strong>unverified — not yet reviewed</strong> and do not change the curated record above.
      </p>

      {state.status === 'idle' && (
        <button type="button" className="news-check-btn" onClick={checkForUpdates}>
          <Newspaper size={14} /> Check for Updates
        </button>
      )}

      {state.status === 'loading' && (
        <p className="news-status"><LoaderCircle size={14} className="environmental-loading" /> Searching recent coverage…</p>
      )}

      {state.status === 'empty' && (
        <p className="news-status">No recent headlines matched this query (searched {searchedLabel}). This does not prove nothing is happening — only that the index returned no matching articles.</p>
      )}

      {state.status === 'error' && (
        <p className="news-status news-error"><AlertTriangle size={12} /> {state.message}</p>
      )}

      {state.status === 'results' && (
        <>
          <p className="news-status">Searched {searchedLabel} — {state.articles.length} headline{state.articles.length === 1 ? '' : 's'} found.</p>
          <ul className="news-results">
            {state.articles.map((a, i) => (
              <li key={i} className="news-item">
                <span className="news-badge-unverified">Unverified — not yet reviewed</span>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="news-title">
                  {a.title} <ExternalLink size={10} />
                </a>
                <span className="news-meta">{a.outlet} · indexed {a.date}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {(state.status === 'results' || state.status === 'empty' || (state.status === 'error' && state.retryable)) && (
        <button type="button" className="news-check-btn news-check-again" onClick={checkForUpdates}>
          Search again
        </button>
      )}
    </div>
  );
}
