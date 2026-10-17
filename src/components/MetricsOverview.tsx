'use client';

import React from 'react';
import { Star, GitFork, Code2, GitCommit, FolderGit } from 'lucide-react';
import { formatNumber, getLanguageColor } from '@/lib/utils';
import { Card, CardContent } from './ui/card';

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
      bgColor: 'bg-amber-500/10',
      description: 'Across all public repositories',
    },
    {
      label: 'Total Forks',
      value: formatNumber(totalForks),
      rawValue: totalForks,
      icon: GitFork,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      description: 'Community forks & adaptations',
    },
    {
      label: 'Primary Stack',
      value: topLanguage || 'N/A',
      isLanguage: true,
      icon: Code2,
      iconColor: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      description: 'Most frequent language',
    },
    {
      label: '30-Day Commits',
      value: formatNumber(recentCommitCount30d),
      rawValue: recentCommitCount30d,
      icon: GitCommit,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      description: 'Recent public commit velocity',
    },
    {
      label: 'Public Repos',
      value: totalRepos.toString(),
      rawValue: totalRepos,
      icon: FolderGit,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Active projects indexed',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card key={idx} className="relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {m.label}
                </span>
                <div className={`p-2 rounded-lg ${m.bgColor} ${m.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                {m.isLanguage && topLanguage && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getLanguageColor(topLanguage) }}
                  />
                )}
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                  {m.value}
                </div>
              </div>

              <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                {m.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
