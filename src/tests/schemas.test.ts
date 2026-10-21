import { describe, it, expect } from 'vitest';
import {
  UsernameSchema,
  GitHubUserSchema,
  RateLimitInfoSchema,
  LanguageDistributionItemSchema,
} from '../lib/schemas';

describe('UsernameSchema', () => {
  it('accepts valid GitHub usernames', () => {
    const valid = ['shadcn', 'torvalds', 'lee-rob', 'dev123', 'a', 'a-b-c'];
    for (const name of valid) {
      const res = UsernameSchema.safeParse(name);
      expect(res.success).toBe(true);
    }
  });

  it('rejects invalid GitHub usernames', () => {
    const invalid = [
      '', // empty
      '-starts-with-hyphen',
      'ends-with-hyphen-',
      'has spaces',
      'special@chars!',
      'a'.repeat(40), // > 39 chars
    ];
    for (const name of invalid) {
      const res = UsernameSchema.safeParse(name);
      expect(res.success).toBe(false);
    }
  });
});

describe('GitHubUserSchema', () => {
  it('validates a standard GitHub user profile', () => {
    const rawUser = {
      login: 'octocat',
      id: 1,
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      html_url: 'https://github.com/octocat',
      name: 'The Octocat',
      company: 'GitHub',
      blog: 'https://github.blog',
      location: 'San Francisco',
      bio: 'Building open source tools',
      public_repos: 8,
      public_gists: 2,
      followers: 4000,
      following: 0,
      created_at: '2008-01-14T04:33:35Z',
      updated_at: '2026-01-14T04:33:35Z',
    };

    const res = GitHubUserSchema.safeParse(rawUser);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.login).toBe('octocat');
      expect(res.data.public_repos).toBe(8);
    }
  });
});

describe('RateLimitInfoSchema', () => {
  it('correctly validates rate limit metadata', () => {
    const rateLimit = {
      limit: 60,
      remaining: 45,
      reset: 1700000000,
      resetDate: '10:00:00 AM',
      used: 15,
      isExceeded: false,
    };

    const res = RateLimitInfoSchema.safeParse(rateLimit);
    expect(res.success).toBe(true);
  });
});

describe('LanguageDistributionItemSchema', () => {
  it('validates language percentage and count', () => {
    const item = {
      name: 'TypeScript',
      count: 24,
      percentage: 80,
      color: '#3178c6',
    };

    const res = LanguageDistributionItemSchema.safeParse(item);
    expect(res.success).toBe(true);
  });
});
