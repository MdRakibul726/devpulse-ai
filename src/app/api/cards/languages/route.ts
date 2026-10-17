import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubDashboardData, getDemoProfile } from '@/lib/github';
import { LanguageDistributionItem } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || 'shadcn';
  const theme = searchParams.get('theme') || 'dark';

  const themes: Record<
    string,
    { bg: string; border: string; title: string; text: string; subtext: string }
  > = {
    dark: {
      bg: '#090d16',
      border: '#1e293b',
      title: '#38bdf8',
      text: '#e2e8f0',
      subtext: '#94a3b8',
    },
    light: {
      bg: '#ffffff',
      border: '#e2e8f0',
      title: '#0f172a',
      text: '#1e293b',
      subtext: '#64748b',
    },
    cyberpunk: {
      bg: '#000b1e',
      border: '#00ffcc',
      title: '#00ffcc',
      text: '#ffffff',
      subtext: '#38bdf8',
    },
    radical: {
      bg: '#141321',
      border: '#fe428e',
      title: '#fe428e',
      text: '#a9fef7',
      subtext: '#b3a1e6',
    },
  };

  const currentTheme = themes[theme] || themes.dark;
  let languages: LanguageDistributionItem[] = [];
  let displayName = username;

  const result = await fetchGitHubDashboardData(username);
  if (result.data) {
    languages = result.data.languages;
    displayName = result.data.user.name || result.data.user.login;
  } else {
    const demo = getDemoProfile(username);
    if (demo) {
      languages = demo.languages;
      displayName = demo.user.name || demo.user.login;
    }
  }

  const topLangs = languages.slice(0, 5);
  const totalBarWidth = 435;

  let progressBarsSvg = '';
  let currentX = 30;

  topLangs.forEach((lang) => {
    const width = Math.max(4, Math.round((lang.percentage / 100) * totalBarWidth));
    progressBarsSvg += `<rect x="${currentX}" y="65" width="${width}" height="10" rx="4" fill="${lang.color}" />\n`;
    currentX += width + 2;
  });

  const legendItemsSvg = topLangs
    .map((lang, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 35 + col * 220;
      const y = 105 + row * 24;

      return `<g transform="translate(${x}, ${y})">
      <circle cx="5" cy="-3" r="5" fill="${lang.color}" />
      <text x="18" y="0" class="legend-text">${lang.name}</text>
      <text x="160" y="0" class="legend-percent">${lang.percentage}%</text>
    </g>`;
    })
    .join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="175" viewBox="0 0 495 175" fill="none" role="img" aria-labelledby="langDesc">
  <title>${displayName}'s Most Used Languages</title>
  <desc id="langDesc">Language breakdown for ${displayName}: ${topLangs.map((l) => `${l.name} (${l.percentage}%)`).join(', ')}</desc>
  <style>
    .header { font: 700 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${currentTheme.title}; }
    .legend-text { font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${currentTheme.text}; }
    .legend-percent { font: 500 12px 'SF Mono', Consolas, monospace; fill: ${currentTheme.subtext}; }
  </style>
  <rect x="0.5" y="0.5" width="494" height="174" rx="14" fill="${currentTheme.bg}" stroke="${currentTheme.border}" />
  
  <text x="30" y="38" class="header">${displayName}'s Top Languages</text>
  <line x1="25" y1="52" x2="470" y2="52" stroke="${currentTheme.border}" stroke-width="1" />

  <!-- Stacked Progress Bar -->
  ${progressBarsSvg}

  <!-- Legend -->
  ${legendItemsSvg}
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    },
  });
}
