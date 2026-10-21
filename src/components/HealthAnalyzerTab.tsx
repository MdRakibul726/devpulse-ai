'use client';

import React, { useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { GitHubRepo } from '@/lib/schemas';
import { analyzeProjectHealth } from '@/lib/health';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface HealthAnalyzerTabProps {
  repos: GitHubRepo[];
  highlightRepo?: string | null;
}

export function HealthAnalyzerTab({ repos, highlightRepo }: HealthAnalyzerTabProps) {
  const report = useMemo(() => analyzeProjectHealth(repos), [repos]);

  const statusConfig = {
    Good: {
      color: 'text-emerald-500',
      strokeColor: '#10b981',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: 'success' as const,
      grade: 'A',
      icon: ShieldCheck,
      description: 'Your repositories demonstrate strong open source hygiene, active documentation, and licensing.',
    },
    'Needs Attention': {
      color: 'text-amber-500',
      strokeColor: '#f59e0b',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      badge: 'warning' as const,
      grade: 'B-',
      icon: AlertTriangle,
      description: 'Several repositories lack descriptions, open-source licenses, or have become stale over 6 months.',
    },
    'At Risk': {
      color: 'text-rose-500',
      strokeColor: '#f43f5e',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      badge: 'danger' as const,
      grade: 'C',
      icon: ShieldAlert,
      description: 'High proportion of repositories without documentation, open-source licenses, or recent activity.',
    },
  }[report.overallStatus];

  const StatusIcon = statusConfig.icon;

  // Percentage calculations
  const documentedPercentage = report.totalReposAnalyzed > 0
    ? Math.round((report.documentedRepos / report.totalReposAnalyzed) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Overview Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score Radial Meter */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Repository Health Index
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant={statusConfig.badge} className="px-2.5 py-0.5 font-semibold">
                Grade {statusConfig.grade}
              </Badge>
            </div>
          </div>

          <div className="my-6 flex items-center gap-6">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="transparent"
                  className="text-zinc-200/80 dark:text-white/[0.06]"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke={statusConfig.strokeColor}
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * (1 - report.score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono tracking-tight text-zinc-950 dark:text-white tabular-nums">
                  {report.score}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">/ 100</span>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                {report.overallStatus}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {statusConfig.description}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-white/[0.05] text-[11px] text-zinc-400 font-medium">
            Based on {report.totalReposAnalyzed} original repos (excluding forks)
          </div>
        </Card>

        {/* Actionable Recommendations Summary */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Actionable Hygiene Recommendations
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-normal">
              Prioritized suggestions to elevate your portfolio quality for engineering recruiters and collaborators:
            </p>

            <ul className="space-y-2">
              {report.actionableRecommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-200 p-2.5 rounded-xl bg-zinc-100/60 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05] hover:border-indigo-500/30 transition-colors"
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="font-medium leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-zinc-100 dark:border-white/[0.05] text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-wider block">
                With Description
              </span>
              <p className="font-bold font-mono text-zinc-900 dark:text-zinc-100 text-sm mt-0.5 tabular-nums">
                {report.documentedRepos} / {report.totalReposAnalyzed}
                <span className="text-[10px] text-zinc-400 font-normal ml-1">({documentedPercentage}%)</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-wider block">
                Missing License
              </span>
              <p className="font-bold font-mono text-amber-500 text-sm mt-0.5 tabular-nums">
                {report.missingLicensesCount} repos
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-wider block">
                Untagged Topics
              </span>
              <p className="font-bold font-mono text-zinc-700 dark:text-zinc-300 text-sm mt-0.5 tabular-nums">
                {report.missingTopicsCount} repos
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-wider block">
                Dormant &gt;180d
              </span>
              <p className="font-bold font-mono text-purple-500 text-sm mt-0.5 tabular-nums">
                {report.staleReposCount} repos
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Issues Breakdown List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Repository-Specific Health Flags
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {report.issues.length} {report.issues.length === 1 ? 'flag' : 'flags'}
            </Badge>
          </div>
          <CardDescription>
            Detailed diagnostics and specific remediations for each indexed repository.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {report.issues.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                All repositories in top health!
              </p>
              <p className="text-zinc-400 mt-1">
                Every repository contains a description, open-source license, and tags.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {report.issues.map((issue, idx) => {
                const isSelected = highlightRepo && issue.repo.toLowerCase() === highlightRepo.toLowerCase();
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                        : 'border-zinc-200/70 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {issue.type === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        )}
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                          {issue.repo}
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {issue.message}
                        </span>
                      </div>
                      <Badge
                        variant={issue.type === 'warning' ? 'warning' : 'secondary'}
                        className="text-[10px] py-0 shrink-0"
                      >
                        {issue.type}
                      </Badge>
                    </div>

                    <p className="text-zinc-500 dark:text-zinc-400 pl-5.5 leading-relaxed">
                      💡 <strong className="text-zinc-700 dark:text-zinc-300">Suggestion:</strong> {issue.suggestion}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
