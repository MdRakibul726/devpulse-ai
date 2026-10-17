import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubDashboardData, getDemoProfile } from '@/lib/github';
import { formatNumber } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || 'shadcn';
  const theme = searchParams.get('theme') || 'dark';

  const themes: Record<
    string,
    { bg: string; border: string; title: string; text: string; accent: string; subtext: string }
  > = {
    dark: {
      bg: '#090d16',
      border: '#1e293b',
      title: '#38bdf8',
      text: '#e2e8f0',
      accent: '#818cf8',
      subtext: '#94a3b8',
    },
    light: {
      bg: '#ffffff',
      border: '#e2e8f0',
      title: '#0f172a',
      text: '#1e293b',
      accent: '#4f46e5',
      subtext: '#64748b',
    },
    cyberpunk: {
      bg: '#000b1e',
      border: '#00ffcc',
      title: '#00ffcc',
      text: '#ffffff',
      accent: '#ff007f',
      subtext: '#38bdf8',
    },
    radical: {
      bg: '#141321',
      border: '#fe428e',
      title: '#fe428e',
      text: '#a9fef7',
      accent: '#f8d847',
      subtext: '#b3a1e6',
    },
  };

  const currentTheme = themes[theme] || themes.dark;

  let totalStars = 0;
  let totalForks = 0;
  let topLang = 'TypeScript';
  let totalRepos = 0;
  let commits30d = 0;
  let displayName = username;

  const result = await fetchGitHubDashboardData(username);
  if (result.data) {
    const d = result.data;
    totalStars = d.totalStars;
    totalForks = d.totalForks;
    topLang = d.topLanguage || 'TypeScript';
    totalRepos = d.repos.length;
    commits30d = d.recentCommitCount30d;
    displayName = d.user.name || d.user.login;
  } else {
    const demo = getDemoProfile(username);
    if (demo) {
      totalStars = demo.totalStars;
      totalForks = demo.totalForks;
      topLang = demo.topLanguage || 'TypeScript';
      totalRepos = demo.repos.length;
      commits30d = demo.recentCommitCount30d;
      displayName = demo.user.name || demo.user.login;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none" role="img" aria-labelledby="descId">
  <title>${displayName}'s GitHub DevPulse</title>
  <desc id="descId">Public GitHub statistics card for ${displayName}: ${formatNumber(totalStars)} stars, ${formatNumber(totalForks)} forks, top language ${topLang}.</desc>
  <style>
    .header { font: 700 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${currentTheme.title}; }
    .label { font: 500 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${currentTheme.subtext}; }
    .value { font: 700 16px 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; fill: ${currentTheme.text}; }
    .pulse-dot { fill: ${currentTheme.accent}; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  </style>
  <rect x="0.5" y="0.5" width="494" height="194" rx="14" fill="${currentTheme.bg}" stroke="${currentTheme.border}" />
  
  <!-- Header with Pulse Indicator -->
  <circle cx="28" cy="32" r="5" class="pulse-dot" />
  <text x="42" y="37" class="header">${displayName}'s GitHub Pulse</text>
  <line x1="25" y1="55" x2="470" y2="55" stroke="${currentTheme.border}" stroke-width="1" />

  <!-- Grid of Statistics -->
  <!-- Col 1 -->
  <g transform="translate(30, 80)">
    <text x="0" y="0" class="label">Total Stars Earned</text>
    <text x="0" y="24" class="value">★ ${formatNumber(totalStars)}</text>
  </g>
  <g transform="translate(30, 140)">
    <text x="0" y="0" class="label">Top Language</text>
    <text x="0" y="24" class="value">⚡ ${topLang}</text>
  </g>

  <!-- Col 2 -->
  <g transform="translate(200, 80)">
    <text x="0" y="0" class="label">Total Forks</text>
    <text x="0" y="24" class="value">⑂ ${formatNumber(totalForks)}</text>
  </g>
  <g transform="translate(200, 140)">
    <text x="0" y="0" class="label">30-Day Commits</text>
    <text x="0" y="24" class="value">● ${formatNumber(commits30d)}</text>
  </g>

  <!-- Col 3 -->
  <g transform="translate(360, 80)">
    <text x="0" y="0" class="label">Public Repos</text>
    <text x="0" y="24" class="value">📁 ${totalRepos}</text>
  </g>
  <g transform="translate(360, 140)">
    <text x="0" y="0" class="label">Powered By</text>
    <text x="0" y="24" class="label" fill="${currentTheme.accent}">DevPulse AI</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    },
  });
}
