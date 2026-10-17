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
            <Badge variant={statusConfig.badge}>{report.overallStatus}</Badge>
          </div>

          <div className="my-4 flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - report.score / 100)}
                  strokeLinecap="round"
                  className={statusConfig.color}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                  {report.score}
                </span>
                <span className="text-[10px] text-zinc-400">/ 100</span>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                {report.overallStatus}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                {statusConfig.description}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400">
            Based on {report.totalReposAnalyzed} original repositories (excluding upstream forks)
          </p>
        </Card>

        {/* Actionable Recommendations Summary */}
        <Card className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Actionable Improvements
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Specific, evidence-based recommendations to elevate your GitHub portfolio visibility to recruiters and engineering managers:
            </p>

            <ul className="space-y-2.5">
              {report.actionableRecommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-center text-xs">
            <div>
              <span className="text-zinc-400 text-[11px]">With Desc</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {report.documentedRepos} / {report.totalReposAnalyzed}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 text-[11px]">No License</span>
              <p className="font-semibold text-amber-500 mt-0.5">{report.missingLicensesCount}</p>
            </div>
            <div>
              <span className="text-zinc-400 text-[11px]">No Topics</span>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                {report.missingTopicsCount}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 text-[11px]">Stale &gt;6mo</span>
              <p className="font-semibold text-purple-500 mt-0.5">{report.staleReposCount}</p>
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
