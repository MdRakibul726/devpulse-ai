import { describe, it, expect } from 'vitest';
import { analyzeProjectHealth } from '../lib/health';
import { GitHubRepo } from '../lib/schemas';

describe('Project Health Analyzer', () => {
  it('correctly reports healthy repositories with full documentation and licenses', () => {
    const perfectRepos: Partial<GitHubRepo>[] = [
      {
        name: 'awesome-tool',
        description: 'A production grade utility for microservices',
        fork: false,
        license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: '' },
        topics: ['microservices', 'typescript', 'tools'],
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString(),
        archived: false,
      },
    ];

    const report = analyzeProjectHealth(perfectRepos as GitHubRepo[]);
    expect(report.score).toBe(100);
    expect(report.documentedRepos).toBe(1);
    expect(report.missingLicensesCount).toBe(0);
    expect(report.missingTopicsCount).toBe(0);
    expect(report.staleReposCount).toBe(0);
    expect(report.actionableRecommendations[0]).toContain('Excellent repository hygiene');
  });

  it('identifies missing descriptions, missing licenses, and stale projects', () => {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();
    const problematicRepos: Partial<GitHubRepo>[] = [
      {
        name: 'undocumented-project',
        description: null,
        fork: false,
        license: null,
        topics: [],
        updated_at: oneYearAgo,
        pushed_at: oneYearAgo,
        archived: false,
      },
    ];

    const report = analyzeProjectHealth(problematicRepos as GitHubRepo[]);
    expect(report.score).toBeLessThan(60);
    expect(report.overallStatus).toBe('At Risk');
    expect(report.missingLicensesCount).toBe(1);
    expect(report.missingTopicsCount).toBe(1);
    expect(report.staleReposCount).toBe(1);
    expect(report.issues.length).toBeGreaterThanOrEqual(3);

    const descIssue = report.issues.find((i) => i.message.includes('description'));
    expect(descIssue).toBeDefined();
    expect(descIssue?.suggestion).toContain('undocumented-project');
  });

  it('ignores forks when calculating project health scores', () => {
    const forkOnly: Partial<GitHubRepo>[] = [
      {
        name: 'upstream-fork',
        description: null,
        fork: true,
        license: null,
        topics: [],
        updated_at: new Date().toISOString(),
        archived: false,
      },
    ];

    const report = analyzeProjectHealth(forkOnly as GitHubRepo[]);
    expect(report.issues.length).toBe(0);
  });
});
