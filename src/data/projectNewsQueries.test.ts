import { describe, it, expect } from 'vitest';
import {
  buildNewsQueryUrl,
  googleNewsSearchUrl,
  parseGdeltResponse,
  PROJECT_NEWS_QUERIES,
} from './projectNewsQueries';

describe('projectNewsQueries', () => {
  it('defines a query for each launch project', () => {
    for (const id of ['project-tango', 'fort-meade', 'iron-mountain-mia1']) {
      expect(PROJECT_NEWS_QUERIES[id]).toBeDefined();
      expect(PROJECT_NEWS_QUERIES[id].query.length).toBeGreaterThan(0);
    }
  });

  it('builds a GDELT artlist URL with the encoded query', () => {
    const url = buildNewsQueryUrl(PROJECT_NEWS_QUERIES['project-tango']);
    expect(url).toContain('api.gdeltproject.org/api/v2/doc/doc');
    expect(url).toContain('mode=artlist');
    expect(url).toContain('format=json');
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('query')).toBe('"Project Tango" "Palm Beach"');
  });

  it('builds a correctly encoded Google News search URL per project', () => {
    const url = googleNewsSearchUrl(PROJECT_NEWS_QUERIES['project-tango']);
    expect(url).toContain('https://news.google.com/search?');
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('q')).toBe('"Project Tango" "Palm Beach" data center');
    expect(params.get('hl')).toBe('en-US');
    // disambiguation terms present where configured
    expect(
      new URLSearchParams(googleNewsSearchUrl(PROJECT_NEWS_QUERIES['fort-meade']).split('?')[1]).get('q'),
    ).toContain('Florida');
  });

  it('parses GDELT articles with dates and outlets', () => {
    const result = parseGdeltResponse({
      articles: [
        { url: 'https://cbs12.com/a', title: 'Tango lawsuit', seendate: '20261120T083900Z', domain: 'cbs12.com' },
        { url: 'https://wptv.com/b', title: 'Older story', seendate: '20261021T023000Z', domain: 'wptv.com' },
      ],
    }, new Date('2026-11-20T12:00:00Z'));
    expect(result.articles).toHaveLength(2);
    expect(result.articles[0].outlet).toBe('cbs12.com');
    expect(result.articles[0].date).toContain('Nov');
    // newest first
    expect(result.articles[0].title).toBe('Tango lawsuit');
  });

  it('deduplicates by normalized URL and skips malformed entries', () => {
    const result = parseGdeltResponse({
      articles: [
        { url: 'https://www.cbs12.com/a', title: 'Story', seendate: '20261120T000000Z', domain: 'cbs12.com' },
        { url: 'https://cbs12.com/a/', title: 'Story dup', seendate: '20261120T010000Z', domain: 'cbs12.com' },
        { url: '', title: 'Missing URL' },
        { url: 'https://x.com/b' },
      ],
    }, new Date());
    expect(result.articles).toHaveLength(1);
  });

  it('handles missing/invalid payloads and bad dates gracefully', () => {
    expect(parseGdeltResponse(null, new Date()).articles).toHaveLength(0);
    expect(parseGdeltResponse({ articles: 'nope' }, new Date()).articles).toHaveLength(0);
    const r = parseGdeltResponse(
      { articles: [{ url: 'https://a.com/x', title: 'T', seendate: 'garbage' }] },
      new Date(),
    );
    expect(r.articles[0].date).toBe('Date unknown');
  });
});
