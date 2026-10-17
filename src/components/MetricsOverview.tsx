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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card
            key={idx}
            className="relative overflow-hidden group hover:border-indigo-500/40 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 cursor-default"
          >
            {/* Top Specular Line Accent */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent group-hover:via-indigo-500/50 transition-colors" />

            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {m.label}
                </span>
                <div className={`p-2 rounded-xl ${m.bgColor} ${m.iconColor} group-hover:scale-110 transition-transform duration-200 shadow-xs ring-1 ring-black/5 dark:ring-white/10`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                {m.isLanguage && topLanguage && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: getLanguageColor(topLanguage) }}
                  />
                )}
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono truncate">
                  {m.value}
                </div>
              </div>

              <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 truncate font-medium">
                {m.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
