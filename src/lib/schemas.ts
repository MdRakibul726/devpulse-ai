import { z } from 'zod';

export const UsernameSchema = z
  .string()
  .trim()
  .min(1, 'Username cannot be empty')
  .max(39, 'GitHub username maximum length is 39 characters')
  .regex(
    /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
    'Invalid GitHub username. Must contain only alphanumeric characters or single hyphens, and cannot start or end with a hyphen.'
  );

export const GitHubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  name: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  blog: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  twitter_username: z.string().nullable().optional(),
  public_repos: z.number().default(0),
  public_gists: z.number().default(0),
  followers: z.number().default(0),
  following: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;

export const GitHubLicenseSchema = z
  .object({
    key: z.string().optional(),
    name: z.string().optional(),
    spdx_id: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean().default(false),
  html_url: z.string().url(),
  description: z.string().nullable().optional(),
  fork: z.boolean().default(false),
  stargazers_count: z.number().default(0),
  watchers_count: z.number().default(0),
  language: z.string().nullable().optional(),
  forks_count: z.number().default(0),
  open_issues_count: z.number().default(0),
  topics: z.array(z.string()).default([]),
  license: GitHubLicenseSchema,
  pushed_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  size: z.number().default(0),
  default_branch: z.string().default('main'),
  archived: z.boolean().default(false),
  disabled: z.boolean().optional().default(false),
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

export const GitHubEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  actor: z.object({
    id: z.number(),
    login: z.string(),
    avatar_url: z.string().optional(),
  }),
  repo: z.object({
    id: z.number(),
    name: z.string(),
    url: z.string().optional(),
  }),
  payload: z.record(z.any()).default({}),
  public: z.boolean().default(true),
  created_at: z.string(),
});

export type GitHubEvent = z.infer<typeof GitHubEventSchema>;

export const LanguageDistributionItemSchema = z.object({
  name: z.string(),
  count: z.number(),
  percentage: z.number(),
  color: z.string(),
});

export type LanguageDistributionItem = z.infer<typeof LanguageDistributionItemSchema>;

export const ActivityPointSchema = z.object({
  date: z.string(),
  commits: z.number(),
  pullRequests: z.number(),
  issues: z.number(),
  total: z.number(),
});

export type ActivityPoint = z.infer<typeof ActivityPointSchema>;

export const RateLimitInfoSchema = z.object({
  limit: z.number(),
  remaining: z.number(),
  reset: z.number(),
  resetDate: z.string(),
  used: z.number(),
  isExceeded: z.boolean(),
});

export type RateLimitInfo = z.infer<typeof RateLimitInfoSchema>;

export const DashboardDataSchema = z.object({
  user: GitHubUserSchema,
  repos: z.array(GitHubRepoSchema),
  languages: z.array(LanguageDistributionItemSchema),
  activityTimeline: z.array(ActivityPointSchema),
  recentEvents: z.array(GitHubEventSchema).default([]),
  rateLimit: RateLimitInfoSchema,
  isDemo: z.boolean().default(false),
  totalStars: z.number().default(0),
  totalForks: z.number().default(0),
  topLanguage: z.string().nullable().default(null),
  recentCommitCount30d: z.number().default(0),
  fetchedAt: z.string(),
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;

// Health Analyzer Schemas
export const HealthIssueSchema = z.object({
  type: z.enum(['warning', 'error', 'info']),
  repo: z.string(),
  message: z.string(),
  suggestion: z.string(),
});

export type HealthIssue = z.infer<typeof HealthIssueSchema>;

export const HealthReportSchema = z.object({
  score: z.number().min(0).max(100),
  overallStatus: z.enum(['Good', 'Needs Attention', 'At Risk']),
  documentedRepos: z.number(),
  totalReposAnalyzed: z.number(),
  staleReposCount: z.number(),
  missingLicensesCount: z.number(),
  missingTopicsCount: z.number(),
  actionableRecommendations: z.array(z.string()),
  issues: z.array(HealthIssueSchema),
});

export type HealthReport = z.infer<typeof HealthReportSchema>;

// AI Copilot Schemas
export const RepoSummaryOutputSchema = z.object({
  repoName: z.string(),
  summary: z.string().min(10),
  architectureHighlights: z.array(z.string()),
  primaryTechStack: z.array(z.string()),
  keyFeatures: z.array(z.string()),
});

export type RepoSummaryOutput = z.infer<typeof RepoSummaryOutputSchema>;

export const CVBulletPointsOutputSchema = z.object({
  roleTitle: z.string(),
  repoName: z.string(),
  bullets: z.array(
    z.object({
      text: z.string().min(10),
      metricOrImpact: z.string(),
      skillsDemonstrated: z.array(z.string()),
    })
  ),
});

export type CVBulletPointsOutput = z.infer<typeof CVBulletPointsOutputSchema>;

export const ReadmeRecommendationsOutputSchema = z.object({
  repoName: z.string(),
  overallAssessment: z.string(),
  missingSections: z.array(z.string()),
  quickWins: z.array(z.string()),
  sampleSnippets: z.array(
    z.object({
      heading: z.string(),
      markdownContent: z.string(),
    })
  ),
});

export type ReadmeRecommendationsOutput = z.infer<typeof ReadmeRecommendationsOutputSchema>;

export const WeeklyReportOutputSchema = z.object({
  period: z.string(),
  totalEventsAnalyzed: z.number(),
  commitSummary: z.string(),
  topActiveRepositories: z.array(z.string()),
  keyAccomplishments: z.array(z.string()),
  focusAreasNextWeek: z.array(z.string()),
});

export type WeeklyReportOutput = z.infer<typeof WeeklyReportOutputSchema>;
