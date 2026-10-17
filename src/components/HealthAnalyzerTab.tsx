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
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: 'success' as const,
      icon: ShieldCheck,
      description: 'Your repositories demonstrate strong open source standards and documentation.',
    },
    'Needs Attention': {
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      badge: 'warning' as const,
      icon: AlertTriangle,
      description: 'Several repositories lack descriptions, licenses, or have become stale.',
    },
    'At Risk': {
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      badge: 'danger' as const,
      icon: ShieldAlert,
      description: 'High proportion of repositories without documentation or open-source licenses.',
    },
  }[report.overallStatus];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Overview Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Ring Card */}
        <Card className="p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Health Index
            </span>
            <Badge variant={statusConfig.badge} className="px-3 py-1 font-semibold">{report.overallStatus}</Badge>
          </div>

          <div className="my-5 flex items-center gap-6">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-200 dark:text-zinc-800/80"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * (1 - report.score / 100)}
                  strokeLinecap="round"
                  className={`${statusConfig.color} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white font-mono tracking-tight">
                  {report.score}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">/ 100</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                {report.overallStatus}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-normal">
                {statusConfig.description}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-medium">
            Based on {report.totalReposAnalyzed} original repositories (excluding upstream forks)
          </p>
        </Card>

        {/* Actionable Recommendations Summary */}
        <Card className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                Actionable Improvements
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 font-normal">
              Specific, evidence-based recommendations to elevate your GitHub portfolio visibility to recruiters and engineering managers:
            </p>

            <ul className="space-y-2.5">
              {report.actionableRecommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-200 bg-zinc-50/80 dark:bg-white/[0.03] p-3 rounded-xl border border-zinc-200/60 dark:border-white/[0.06] hover:border-indigo-500/30 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-5 border-t border-zinc-100 dark:border-white/[0.06] text-center text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/[0.05]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">With Desc</span>
              <p className="font-bold font-mono text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                {report.documentedRepos} / {report.totalReposAnalyzed}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/[0.05]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">No License</span>
              <p className="font-bold font-mono text-amber-500 text-sm mt-0.5">{report.missingLicensesCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/[0.05]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">No Topics</span>
              <p className="font-bold font-mono text-zinc-700 dark:text-zinc-300 text-sm mt-0.5">
                {report.missingTopicsCount}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/[0.05]">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Stale &gt;6mo</span>
              <p className="font-bold font-mono text-purple-500 text-sm mt-0.5">{report.staleReposCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Issues Breakdown List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Repository-Specific Health Flags
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {report.issues.length} {report.issues.length === 1 ? 'item' : 'items'} flagged
            </Badge>
          </div>
          <CardDescription>
            Detailed diagnostics and direct guidance for every repository.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {report.issues.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                No health issues found!
              </p>
              <p className="text-zinc-400 mt-1">
                All repositories meet standard open source documentation and license standards.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {report.issues.map((issue, idx) => {
                const isSelected = highlightRepo && issue.repo.toLowerCase() === highlightRepo.toLowerCase();
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        {issue.type === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        )}
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {issue.repo}
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                          {issue.message}
                        </span>
                      </div>
                      <Badge
                        variant={issue.type === 'warning' ? 'warning' : 'secondary'}
                        className="text-[10px] py-0"
                      >
                        {issue.type}
                      </Badge>
                    </div>

                    <p className="text-zinc-500 dark:text-zinc-400 pl-5.5 leading-relaxed">
                      💡 <strong>Suggestion:</strong> {issue.suggestion}
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
