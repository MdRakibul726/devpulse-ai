import { GitHubRepo, HealthReport, HealthIssue } from './schemas';

export function analyzeProjectHealth(repos: GitHubRepo[]): HealthReport {
  if (!repos || repos.length === 0) {
    return {
      score: 100,
      overallStatus: 'Good',
      documentedRepos: 0,
      totalReposAnalyzed: 0,
      staleReposCount: 0,
      missingLicensesCount: 0,
      missingTopicsCount: 0,
      actionableRecommendations: ['Create or import repositories to begin analyzing project health.'],
      issues: [],
    };
  }

  const issues: HealthIssue[] = [];
  let missingDescriptions = 0;
  let missingLicenses = 0;
  let missingTopics = 0;
  let staleRepos = 0;
  let documentedRepos = 0;

  const now = new Date();
  const ONE_EIGHTY_DAYS_MS = 180 * 24 * 60 * 60 * 1000;

  for (const repo of repos) {
    if (repo.fork) continue; // Don't penalize user for upstream fork settings

    // 1. Description check
    const hasDesc = Boolean(repo.description && repo.description.trim().length > 5);
    if (!hasDesc) {
      missingDescriptions++;
      issues.push({
        type: 'warning',
        repo: repo.name,
        message: 'Missing repository description',
        suggestion: `Add a concise 1-2 sentence description explaining what "${repo.name}" does to help recruiters and contributors quickly understand the project.`,
      });
    } else {
      documentedRepos++;
    }

    // 2. License check
    const hasLicense = Boolean(repo.license && (repo.license.spdx_id || repo.license.name));
    if (!hasLicense) {
      missingLicenses++;
      issues.push({
        type: 'warning',
        repo: repo.name,
        message: 'No open-source license detected',
        suggestion: `Add an open-source license (such as MIT or Apache-2.0) to explicitly grant rights for developers to inspect, fork, or use your code.`,
      });
    }

    // 3. Topics / tags check
    const hasTopics = Boolean(repo.topics && repo.topics.length >= 2);
    if (!hasTopics) {
      missingTopics++;
      issues.push({
        type: 'info',
        repo: repo.name,
        message: 'Few or no GitHub repository topics',
        suggestion: `Tag "${repo.name}" with relevant technologies (e.g. ${repo.language ? repo.language.toLowerCase() : 'library'}, api, web) to increase discoverability in GitHub Explore.`,
      });
    }

    // 4. Staleness check (> 180 days without push)
    const lastPush = repo.pushed_at ? new Date(repo.pushed_at) : new Date(repo.updated_at);
    const isStale = now.getTime() - lastPush.getTime() > ONE_EIGHTY_DAYS_MS;
    if (isStale && !repo.archived) {
      staleRepos++;
      issues.push({
        type: 'info',
        repo: repo.name,
        message: `Inactive for over 6 months (last pushed ${lastPush.toLocaleDateString()})`,
        suggestion: `If "${repo.name}" is a completed reference project, consider adding a status badge or archiving the repository to signal maintenance status clearly.`,
      });
    }
  }

  const nonForkRepos = repos.filter((r) => !r.fork);
  const totalAnalyzed = nonForkRepos.length > 0 ? nonForkRepos.length : repos.length;

  // Calculate evidence-based score
  let calculatedScore = 100;
  if (totalAnalyzed > 0) {
    const descPenalty = (missingDescriptions / totalAnalyzed) * 35;
    const licensePenalty = (missingLicenses / totalAnalyzed) * 35;
    const topicsPenalty = (missingTopics / totalAnalyzed) * 15;
    const stalePenalty = (staleRepos / totalAnalyzed) * 15;
    calculatedScore = Math.max(10, Math.round(100 - (descPenalty + licensePenalty + topicsPenalty + stalePenalty)));
  }

  let overallStatus: 'Good' | 'Needs Attention' | 'At Risk' = 'Good';
  if (calculatedScore < 60) {
    overallStatus = 'At Risk';
  } else if (calculatedScore < 80) {
    overallStatus = 'Needs Attention';
  }

  // Actionable high-priority recommendations
  const actionableRecommendations: string[] = [];
  if (missingDescriptions > 0) {
    actionableRecommendations.push(
      `Add descriptions to ${missingDescriptions} repositories so visitors immediately understand each project's purpose.`
    );
  }
  if (missingLicenses > 0) {
    actionableRecommendations.push(
      `Add open-source licenses to ${missingLicenses} repositories to establish clear copyright and permissions for your portfolio.`
    );
  }
  if (missingTopics > 0) {
    actionableRecommendations.push(
      `Add technology tags/topics to ${missingTopics} repositories to showcase your tech stack directly in GitHub search.`
    );
  }
  if (staleRepos > 0) {
    actionableRecommendations.push(
      `Review ${staleRepos} dormant projects: either publish a dependency maintenance update or mark them as archived/stable.`
    );
  }
  if (actionableRecommendations.length === 0) {
    actionableRecommendations.push(
      'Excellent repository hygiene! All analyzed repositories feature descriptions, licenses, and tags.'
    );
  }

  return {
    score: calculatedScore,
    overallStatus,
    documentedRepos,
    totalReposAnalyzed: totalAnalyzed,
    staleReposCount: staleRepos,
    missingLicensesCount: missingLicenses,
    missingTopicsCount: missingTopics,
    actionableRecommendations,
    issues,
  };
}
