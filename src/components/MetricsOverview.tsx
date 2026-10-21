'use client';

import React from 'react';
import { Star, GitFork, Code2, GitCommit, FolderGit, TrendingUp } from 'lucide-react';
import { formatNumber, getLanguageColor } from '@/lib/utils';

interface MetricsOverviewProps {
  totalStars: number;
  totalForks: number;
  topLanguage: string | null;
  recentCommitCount30d: number;
  totalRepos: number;
}

export function MetricsOverview({
  totalStars,
  totalForks,
  topLanguage,
  recentCommitCount30d,
  totalRepos,
}: MetricsOverviewProps) {
  const metrics = [
    {
      label: 'Total Stars',
      value: formatNumber(totalStars),
      rawValue: totalStars,
      icon: Star,
      iconColor: 'text-amber-500',
      tag: 'Reputation',
      description: 'Community appreciation',
    },
    {
      label: 'Total Forks',
      value: formatNumber(totalForks),
      rawValue: totalForks,
      icon: GitFork,
      iconColor: 'text-indigo-500',
      tag: 'Ecosystem',
      description: 'Downstream adaptations',
    },
    {
      label: 'Primary Stack',
      value: topLanguage || 'N/A',
      isLanguage: true,
      icon: Code2,
      iconColor: 'text-cyan-500',
      tag: 'Core Skill',
      description: 'Most frequent codebase',
    },
    {
      label: '30-Day Commits',
      value: formatNumber(recentCommitCount30d),
      rawValue: recentCommitCount30d,
      icon: GitCommit,
      iconColor: 'text-emerald-500',
      tag: 'Velocity',
      description: 'Recent public pushes',
    },
    {
      label: 'Public Repos',
      value: totalRepos.toString(),
      rawValue: totalRepos,
      icon: FolderGit,
      iconColor: 'text-purple-500',
      tag: 'Inventory',
      description: 'Active open repositories',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="panel-surface specular-top panel-interactive rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                  {m.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] ${m.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                {m.isLanguage && topLanguage && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: getLanguageColor(topLanguage) }}
                  />
                )}
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-mono tabular-nums truncate">
                  {m.value}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-white/[0.05] flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-400 truncate">
                {m.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
