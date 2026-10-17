import { describe, it, expect } from 'vitest';
import {
  parseRateLimitHeaders,
  aggregateLanguages,
  aggregateActivityTimeline,
  getDemoProfile,
} from '../lib/github';
import { formatNumber, timeAgo } from '../lib/utils';
import { GitHubRepo, GitHubEvent } from '../lib/schemas';

describe('GitHub data transformations', () => {
  it('correctly aggregates language distribution and percentages', () => {
    const mockRepos: Partial<GitHubRepo>[] = [
      { language: 'TypeScript' },
      { language: 'TypeScript' },
      { language: 'TypeScript' },
      { language: 'Python' },
      { language: null },
    ];

    const result = aggregateLanguages(mockRepos as GitHubRepo[]);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('TypeScript');
    expect(result[0].count).toBe(3);
    expect(result[0].percentage).toBe(75); // 3 / 4 total with language = 75%
    expect(result[1].name).toBe('Python');
    expect(result[1].count).toBe(1);
    expect(result[1].percentage).toBe(25);
  });

  it('handles empty repositories without division by zero', () => {
    const result = aggregateLanguages([]);
    expect(result).toEqual([]);
  });

  it('parses GitHub rate limit headers properly', () => {
    const headers = new Headers({
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '42',
      'x-ratelimit-reset': '1700000000',
      'x-ratelimit-used': '18',
    });

    const info = parseRateLimitHeaders(headers);
    expect(info.limit).toBe(60);
    expect(info.remaining).toBe(42);
    expect(info.used).toBe(18);
    expect(info.isExceeded).toBe(false);
  });

  it('detects rate limit exceeded when remaining is 0', () => {
    const headers = new Headers({
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': '1700000000',
      'x-ratelimit-used': '60',
    });

    const info = parseRateLimitHeaders(headers);
    expect(info.remaining).toBe(0);
    expect(info.isExceeded).toBe(true);
  });

  it('aggregates activity timeline into consecutive days', () => {
    const mockEvents: Partial<GitHubEvent>[] = [
      {
        id: '1',
        type: 'PushEvent',
        created_at: new Date().toISOString(),
        payload: { commits: [{ message: 'init' }, { message: 'update' }] },
      },
      {
        id: '2',
        type: 'PullRequestEvent',
        created_at: new Date().toISOString(),
        payload: {},
      },
    ];

    const timeline = aggregateActivityTimeline(mockEvents as GitHubEvent[]);
    expect(timeline.length).toBe(14);
    const todayKey = new Date().toISOString().slice(5, 10);
    const todayEntry = timeline.find((t) => t.date === todayKey);
    expect(todayEntry).toBeDefined();
    expect(todayEntry!.commits).toBe(2);
    expect(todayEntry!.pullRequests).toBe(1);
    expect(todayEntry!.total).toBe(3);
  });

  it('provides a valid high-fidelity demo profile', () => {
    const demo = getDemoProfile('shadcn');
    expect(demo).not.toBeNull();
    expect(demo?.user.login).toBe('shadcn');
    expect(demo?.repos.length).toBeGreaterThan(0);
    expect(demo?.languages.length).toBeGreaterThan(0);
    expect(demo?.isDemo).toBe(true);
  });
});

describe('Utility formatters', () => {
  it('formats large numbers into readable k/M suffixes', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(1200)).toBe('1.2k');
    expect(formatNumber(10000)).toBe('10k');
    expect(formatNumber(1500000)).toBe('1.5M');
  });

  it('formats relative time ago', () => {
    const recent = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(recent)).toBe('5m ago');

    const twoDaysAgo = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
    expect(timeAgo(twoDaysAgo)).toBe('2d ago');
  });
});
