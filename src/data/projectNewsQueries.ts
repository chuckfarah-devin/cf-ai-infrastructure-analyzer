/**
 * "Check for Updates" — live headline discovery via the GDELT DOC 2 API.
 *
 * GDELT returns raw news headlines only. Nothing retrieved here is verified,
 * reviewed, or merged into curated project records — the UI labels every item
 * "Unverified — not yet reviewed" and keeps it visually separate from the
 * source-checked milestones in floridaProjectsData.ts.
 *
 * Service notes: free public API, no key required, CORS-enabled
 * (Access-Control-Allow-Origin: *), rate limit ~1 request per 5 seconds per IP.
 */

export interface NewsQuery {
  projectId: string;
  /** GDELT query string (phrases in quotes, implicit AND between terms). */
  query: string;
  /** Human-readable description of what the query targets, shown in the UI. */
  description: string;
  /** Google News search terms for the external "Search latest coverage" link. */
  googleNewsQuery: string;
}

export interface NewsArticle {
  url: string;
  title: string;
  /** Display date, parsed from GDELT seendate (UTC). */
  date: string;
  /** Domain of the publishing outlet, e.g. "cbs12.com". */
  outlet: string;
}

export interface NewsQueryResult {
  articles: NewsArticle[];
  searchedAt: Date;
}

interface GdeltArticle {
  url?: string;
  title?: string;
  seendate?: string;
  domain?: string;
}

export const PROJECT_NEWS_QUERIES: Record<string, NewsQuery> = {
  'project-tango': {
    projectId: 'project-tango',
    query: '"Project Tango" "Palm Beach"',
    description: 'coverage mentioning Project Tango / Central Park Commerce Center and Palm Beach County',
    googleNewsQuery: '"Project Tango" "Palm Beach" data center',
  },
  'fort-meade': {
    projectId: 'fort-meade',
    query: '"Fort Meade" "data center"',
    description: 'coverage mentioning Fort Meade and a data center',
    // "Florida" disambiguates from Fort Meade, Maryland.
    googleNewsQuery: '"Fort Meade" Florida "data center"',
  },
  'iron-mountain-mia1': {
    projectId: 'iron-mountain-mia1',
    query: '"Iron Mountain" Miami "data center"',
    description: 'coverage mentioning Iron Mountain, Miami, and a data center',
    googleNewsQuery: '"Iron Mountain" Miami "data center"',
  },
};

/** External Google News search URL — always available, no fetch required. */
export function googleNewsSearchUrl(query: NewsQuery): string {
  const params = new URLSearchParams({
    q: query.googleNewsQuery,
    hl: 'en-US',
    gl: 'US',
    ceid: 'US:en',
  });
  return `https://news.google.com/search?${params.toString()}`;
}

const GDELT_ENDPOINT = 'https://api.gdeltproject.org/api/v2/doc/doc';
const MAX_RECORDS = 25;

export function buildNewsQueryUrl(query: NewsQuery): string {
  const params = new URLSearchParams({
    query: query.query,
    mode: 'artlist',
    maxrecords: String(MAX_RECORDS),
    format: 'json',
    sort: 'datedesc',
    sourcelang: 'english',
  });
  return `${GDELT_ENDPOINT}?${params.toString()}`;
}

function parseSeenDate(seendate: string | undefined): Date | null {
  // GDELT format: YYYYMMDDTHHMMSSZ
  const m = seendate?.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname}`.toLowerCase().replace(/\/$/, '');
  } catch {
    return url.toLowerCase();
  }
}

/** Parse, deduplicate (URL → title), and sort newest-first. Pure — unit-tested. */
export function parseGdeltResponse(payload: unknown, searchedAt: Date): NewsQueryResult {
  const raw = (payload as { articles?: GdeltArticle[] })?.articles;
  if (!Array.isArray(raw)) return { articles: [], searchedAt };

  const seen = new Set<string>();
  const items: { article: NewsArticle; ts: number }[] = [];

  for (const a of raw) {
    if (!a?.url || !a?.title) continue;
    const key = normalizeUrl(a.url) || a.title.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    const parsed = parseSeenDate(a.seendate);
    items.push({
      article: {
        url: a.url,
        title: a.title.trim(),
        // seendate is when GDELT first indexed the article — not the
        // publisher's publication date — and is labeled as such in the UI.
        date: parsed
          ? parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'Date unknown',
        outlet: a.domain ?? 'unknown outlet',
      },
      ts: parsed?.getTime() ?? 0,
    });
  }

  items.sort((x, y) => y.ts - x.ts);
  return { articles: items.map(i => i.article), searchedAt };
}

export class NewsServiceError extends Error {
  kind: 'http' | 'rate-limited' | 'timeout' | 'network' | 'format';
  constructor(kind: NewsServiceError['kind'], message: string) {
    super(message);
    this.kind = kind;
  }
}

export async function fetchProjectNews(
  query: NewsQuery,
  signal: AbortSignal,
): Promise<NewsQueryResult> {
  const response = await fetch(buildNewsQueryUrl(query), { signal });
  if (response.status === 429) {
    throw new NewsServiceError(
      'rate-limited',
      'The public news service is rate-limited right now (one request per few seconds). Wait a moment and try again.',
    );
  }
  if (!response.ok) {
    throw new NewsServiceError('http', `The news service returned HTTP ${response.status}.`);
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new NewsServiceError('format', 'The news service returned an unexpected response format.');
  }
  return parseGdeltResponse(payload, new Date());
}
