import {
  GitHubUser,
  GitHubUserSchema,
  GitHubRepo,
  GitHubRepoSchema,
  GitHubEvent,
  GitHubEventSchema,
  DashboardData,
  LanguageDistributionItem,
  ActivityPoint,
  RateLimitInfo,
} from './schemas';
import { getLanguageColor } from './utils';

// In-memory server-side cache
interface CacheEntry {
  data: DashboardData;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute (ensures newly pushed repos appear live)

export function parseRateLimitHeaders(headers: Headers): RateLimitInfo {
  const limit = parseInt(headers.get('x-ratelimit-limit') || '60', 10);
  const remaining = parseInt(headers.get('x-ratelimit-remaining') || '60', 10);
  const reset = parseInt(headers.get('x-ratelimit-reset') || '0', 10);
  const used = parseInt(headers.get('x-ratelimit-used') || '0', 10);

  const resetDate = reset > 0 ? new Date(reset * 1000).toLocaleTimeString() : 'N/A';

  return {
    limit: isNaN(limit) ? 60 : limit,
    remaining: isNaN(remaining) ? 60 : remaining,
    reset: isNaN(reset) ? 0 : reset,
    resetDate,
    used: isNaN(used) ? 0 : used,
    isExceeded: remaining <= 0,
  };
}

function getRequestHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevPulse-AI-App',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  return headers;
}

export function aggregateLanguages(repos: GitHubRepo[]): LanguageDistributionItem[] {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
      total += 1;
    }
  }

  if (total === 0) return [];

  const items = Object.entries(counts).map(([name, count]) => {
    const percentage = Math.round((count / total) * 100);
    return {
      name,
      count,
      percentage,
      color: getLanguageColor(name),
    };
  });

  return items.sort((a, b) => b.count - a.count);
}

export function aggregateActivityTimeline(events: GitHubEvent[]): ActivityPoint[] {
  const dayMap = new Map<string, { commits: number; pullRequests: number; issues: number; total: number }>();

  // Initialize last 14 days
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(5, 10); // MM-DD
    dayMap.set(key, { commits: 0, pullRequests: 0, issues: 0, total: 0 });
  }

  for (const event of events) {
    const eventDate = new Date(event.created_at);
    const key = eventDate.toISOString().slice(5, 10);

    if (dayMap.has(key)) {
      const entry = dayMap.get(key)!;
      if (event.type === 'PushEvent') {
        const commitCount = Array.isArray(event.payload?.commits) ? event.payload.commits.length : 1;
        entry.commits += commitCount;
        entry.total += commitCount;
      } else if (event.type === 'PullRequestEvent') {
        entry.pullRequests += 1;
        entry.total += 1;
      } else if (event.type === 'IssuesEvent') {
        entry.issues += 1;
        entry.total += 1;
      } else {
        entry.total += 1;
      }
    }
  }

  return Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));
}

export async function fetchGitHubDashboardData(
  username: string,
  forceRefresh = false
): Promise<{ data?: DashboardData; error?: string; status?: number; rateLimit?: RateLimitInfo }> {
  const normalizedUser = username.trim().toLowerCase();

  // Check cache
  if (!forceRefresh) {
    const cached = cache.get(normalizedUser);
    if (cached && Date.now() < cached.expiresAt) {
      return { data: cached.data };
    }
  } else {
    cache.delete(normalizedUser);
  }

  // Check if requested demo profile directly
  if (normalizedUser === 'shadcn' || normalizedUser === 'torvalds' || normalizedUser === 'leerob') {
    // If not forcing real fetch and in demo list, or we can fetch real first and fallback
  }

  const headers = getRequestHeaders();
  const fetchOptions: RequestInit = forceRefresh
    ? { cache: 'no-store' }
    : { next: { revalidate: 60 } };

  try {
    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      ...fetchOptions,
    });

    const rateLimit = parseRateLimitHeaders(userRes.headers);

    if (userRes.status === 404) {
      return { error: `GitHub user "${username}" was not found. Please check spelling.`, status: 404, rateLimit };
    }

    if (userRes.status === 403) {
      // Rate limit reached! Check if we can offer demo profile
      const demoFallback = getDemoProfile(username);
      if (demoFallback) {
        demoFallback.rateLimit = rateLimit;
        return { data: demoFallback };
      }
      return {
        error: `GitHub API rate limit exceeded. Reset at ${rateLimit.resetDate}. Try one of our demo profiles below or supply a GITHUB_TOKEN.`,
        status: 403,
        rateLimit,
      };
    }

    if (!userRes.ok) {
      return {
        error: `GitHub API error: ${userRes.status} ${userRes.statusText}`,
        status: userRes.status,
        rateLimit,
      };
    }

    const userDataRaw = await userRes.json();
    const user = GitHubUserSchema.parse(userDataRaw);

    // 2. Fetch public repositories (up to 100 most recently updated, descending)
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&direction=desc`,
      { headers, ...fetchOptions }
    );
    let repos: GitHubRepo[] = [];
    if (reposRes.ok) {
      const reposRaw = await reposRes.json();
      if (Array.isArray(reposRaw)) {
        repos = reposRaw
          .map((r) => {
            const parsed = GitHubRepoSchema.safeParse(r);
            return parsed.success ? parsed.data : null;
          })
          .filter((r): r is GitHubRepo => r !== null);
      }
    }

    // 3. Fetch public events
    const eventsRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=60`,
      {
        headers,
        ...(forceRefresh ? { cache: 'no-store' } : { next: { revalidate: 60 } }),
      }
    );
    let recentEvents: GitHubEvent[] = [];
    if (eventsRes.ok) {
      const eventsRaw = await eventsRes.json();
      if (Array.isArray(eventsRaw)) {
        recentEvents = eventsRaw
          .map((e) => {
            const parsed = GitHubEventSchema.safeParse(e);
            return parsed.success ? parsed.data : null;
          })
          .filter((e): e is GitHubEvent => e !== null);
      }
    }

    // Computations
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const languages = aggregateLanguages(repos);
    const topLanguage = languages.length > 0 ? languages[0].name : null;
    const activityTimeline = aggregateActivityTimeline(recentEvents);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCommitCount30d = recentEvents.reduce((count, ev) => {
      if (ev.type === 'PushEvent' && new Date(ev.created_at) >= thirtyDaysAgo) {
        return count + (Array.isArray(ev.payload?.commits) ? ev.payload.commits.length : 1);
      }
      return count;
    }, 0);

    const dashboardData: DashboardData = {
      user,
      repos,
      languages,
      activityTimeline,
      recentEvents: recentEvents.slice(0, 15),
      rateLimit,
      isDemo: false,
      totalStars,
      totalForks,
      topLanguage,
      recentCommitCount30d,
      fetchedAt: new Date().toISOString(),
    };

    // Cache the successful result
    cache.set(normalizedUser, {
      data: dashboardData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return { data: dashboardData };
  } catch (err) {
    console.error('Error fetching GitHub data:', err);

    // Fallback to demo profile if available
    const demoFallback = getDemoProfile(username);
    if (demoFallback) {
      return { data: demoFallback };
    }

    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred while communicating with GitHub.',
      status: 500,
    };
  }
}

// Built-in Demo Profiles for offline or rate-limited environments
export function getDemoProfile(username: string): DashboardData | null {
  const norm = username.toLowerCase().trim();
  const profile = DEMO_DATA_MAP[norm] || DEMO_DATA_MAP['shadcn'];
  return JSON.parse(JSON.stringify(profile));
}

const DEMO_DATA_MAP: Record<string, DashboardData> = {
  shadcn: {
    user: {
      login: 'shadcn',
      id: 124599,
      avatar_url: 'https://avatars.githubusercontent.com/u/124599?v=4',
      html_url: 'https://github.com/shadcn',
      name: 'shadcn',
      company: '@vercel',
      blog: 'https://ui.shadcn.com',
      location: 'New York, NY',
      email: null,
      bio: 'Design systems engineer. Creator of shadcn/ui and taxonomy.',
      twitter_username: 'shadcn',
      public_repos: 42,
      public_gists: 15,
      followers: 78500,
      following: 28,
      created_at: '2011-09-08T00:00:00Z',
      updated_at: '2026-10-15T12:00:00Z',
    },
    repos: [
      {
        id: 593710214,
        name: 'ui',
        full_name: 'shadcn/ui',
        private: false,
        html_url: 'https://github.com/shadcn/ui',
        description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
        fork: false,
        stargazers_count: 72400,
        watchers_count: 72400,
        language: 'TypeScript',
        forks_count: 5900,
        open_issues_count: 140,
        topics: ['react', 'tailwind', 'radix-ui', 'nextjs', 'components', 'design-system'],
        license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: 'https://api.github.com/licenses/mit' },
        pushed_at: '2026-10-16T18:30:00Z',
        created_at: '2023-01-26T21:00:00Z',
        updated_at: '2026-10-17T08:00:00Z',
        size: 15420,
        default_branch: 'main',
        archived: false,
        disabled: false,
      },
      {
        id: 569842104,
        name: 'taxonomy',
        full_name: 'shadcn/taxonomy',
        private: false,
        html_url: 'https://github.com/shadcn/taxonomy',
        description: 'An open source application built using the new router, server components and everything new in Next.js.',
        fork: false,
        stargazers_count: 18200,
        watchers_count: 18200,
        language: 'TypeScript',
        forks_count: 3100,
        open_issues_count: 35,
        topics: ['nextjs', 'react', 'prisma', 'tailwindcss', 'auth-js'],
        license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: 'https://api.github.com/licenses/mit' },
        pushed_at: '2026-09-20T14:15:00Z',
        created_at: '2022-11-23T16:00:00Z',
        updated_at: '2026-10-16T22:00:00Z',
        size: 8900,
        default_branch: 'main',
        archived: false,
        disabled: false,
      },
      {
        id: 489123849,
        name: 'next-template',
        full_name: 'shadcn/next-template',
        private: false,
        html_url: 'https://github.com/shadcn/next-template',
        description: 'Next.js 14 template with App Router, Tailwind CSS, Lucide Icons, and dark mode.',
        fork: false,
        stargazers_count: 4200,
        watchers_count: 4200,
        language: 'TypeScript',
        forks_count: 620,
        open_issues_count: 12,
        topics: ['nextjs', 'boilerplate', 'starter', 'tailwind'],
        license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: 'https://api.github.com/licenses/mit' },
        pushed_at: '2026-08-10T10:00:00Z',
        created_at: '2022-05-06T12:00:00Z',
        updated_at: '2026-10-14T19:00:00Z',
        size: 3200,
        default_branch: 'main',
        archived: false,
        disabled: false,
      },
      {
        id: 398231201,
        name: 'typography',
        full_name: 'shadcn/typography',
        private: false,
        html_url: 'https://github.com/shadcn/typography',
        description: 'Hand-crafted typographic components and styles for web applications.',
        fork: false,
        stargazers_count: 1950,
        watchers_count: 1950,
        language: 'CSS',
        forks_count: 180,
        open_issues_count: 4,
        topics: ['typography', 'css', 'design'],
        license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: 'https://api.github.com/licenses/mit' },
        pushed_at: '2026-04-12T09:00:00Z',
        created_at: '2021-08-20T10:00:00Z',
        updated_at: '2026-10-11T14:00:00Z',
        size: 1100,
        default_branch: 'main',
        archived: false,
        disabled: false,
      },
    ],
    languages: [
      { name: 'TypeScript', count: 32, percentage: 76, color: '#3178c6' },
      { name: 'JavaScript', count: 5, percentage: 12, color: '#f1e05a' },
      { name: 'CSS', count: 3, percentage: 7, color: '#563d7c' },
      { name: 'HTML', count: 2, percentage: 5, color: '#e34c26' },
    ],
    activityTimeline: [
      { date: '10-04', commits: 5, pullRequests: 2, issues: 1, total: 8 },
      { date: '10-05', commits: 12, pullRequests: 4, issues: 3, total: 19 },
      { date: '10-06', commits: 8, pullRequests: 1, issues: 0, total: 9 },
      { date: '10-07', commits: 15, pullRequests: 6, issues: 2, total: 23 },
      { date: '10-08', commits: 6, pullRequests: 2, issues: 1, total: 9 },
      { date: '10-09', commits: 14, pullRequests: 5, issues: 4, total: 23 },
      { date: '10-10', commits: 9, pullRequests: 3, issues: 1, total: 13 },
      { date: '10-11', commits: 4, pullRequests: 1, issues: 0, total: 5 },
      { date: '10-12', commits: 18, pullRequests: 7, issues: 3, total: 28 },
      { date: '10-13', commits: 11, pullRequests: 3, issues: 2, total: 16 },
      { date: '10-14', commits: 16, pullRequests: 5, issues: 4, total: 25 },
      { date: '10-15', commits: 22, pullRequests: 8, issues: 5, total: 35 },
      { date: '10-16', commits: 14, pullRequests: 4, issues: 2, total: 20 },
      { date: '10-17', commits: 7, pullRequests: 2, issues: 1, total: 10 },
    ],
    recentEvents: [
      {
        id: 'ev-1',
        type: 'PushEvent',
        actor: { id: 124599, login: 'shadcn' },
        repo: { id: 593710214, name: 'shadcn/ui' },
        payload: { commits: [{ message: 'feat: add sidebar collapsible component', sha: '9a8b7c' }] },
        public: true,
        created_at: '2026-10-17T08:30:00Z',
      },
      {
        id: 'ev-2',
        type: 'PullRequestEvent',
        actor: { id: 124599, login: 'shadcn' },
        repo: { id: 593710214, name: 'shadcn/ui' },
        payload: { action: 'closed' },
        public: true,
        created_at: '2026-10-16T19:45:00Z',
      },
      {
        id: 'ev-3',
        type: 'PushEvent',
        actor: { id: 124599, login: 'shadcn' },
        repo: { id: 569842104, name: 'shadcn/taxonomy' },
        payload: { commits: [{ message: 'chore: upgrade Next.js to 16 canary', sha: '1e2d3c' }] },
        public: true,
        created_at: '2026-10-15T14:20:00Z',
      },
    ],
    rateLimit: {
      limit: 60,
      remaining: 58,
      reset: Math.floor(Date.now() / 1000) + 3600,
      resetDate: 'Demo Mode (Full access)',
      used: 2,
      isExceeded: false,
    },
    isDemo: true,
    totalStars: 96750,
    totalForks: 9800,
    topLanguage: 'TypeScript',
    recentCommitCount30d: 176,
    fetchedAt: new Date().toISOString(),
  },
};
