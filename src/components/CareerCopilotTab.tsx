'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BookMarked,
  CalendarDays,
  Copy,
  Check,
  RefreshCw,
  Award,
  Code2,
  ArrowRight,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import {
  GitHubRepo,
  GitHubEvent,
  RepoSummaryOutput,
  CVBulletPointsOutput,
  ReadmeRecommendationsOutput,
  WeeklyReportOutput,
} from '@/lib/schemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CareerCopilotTabProps {
  repos: GitHubRepo[];
  events: GitHubEvent[];
  username: string;
  initialSelectedRepo?: string | null;
}

export function CareerCopilotTab({
  repos,
  events,
  username,
  initialSelectedRepo,
}: CareerCopilotTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'cv' | 'summary' | 'readme' | 'weekly'>('cv');
  const [selectedRepoName, setSelectedRepoName] = useState<string>(
    initialSelectedRepo || (repos.length > 0 ? repos[0].name : '')
  );
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Result stores
  const [cvResult, setCvResult] = useState<CVBulletPointsOutput | null>(null);
  const [summaryResult, setSummaryResult] = useState<RepoSummaryOutput | null>(null);
  const [readmeResult, setReadmeResult] = useState<ReadmeRecommendationsOutput | null>(null);
  const [weeklyResult, setWeeklyResult] = useState<WeeklyReportOutput | null>(null);

  const selectedRepo = repos.find((r) => r.name === selectedRepoName) || repos[0];

  const quickRoles = [
    'Senior Full-Stack Engineer',
    'Frontend Architect',
    'Backend / Systems Engineer',
    'DevOps / Platform Engineer',
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async (type: 'cv' | 'summary' | 'readme' | 'weekly') => {
    if (!selectedRepo && type !== 'weekly') return;
    setLoading(true);

    try {
      const payload: Record<string, unknown> = { type };
      if (type === 'cv') {
        payload.repo = selectedRepo;
        payload.role = targetRole;
      } else if (type === 'summary' || type === 'readme') {
        payload.repo = selectedRepo;
      } else if (type === 'weekly') {
        payload.username = username;
        payload.events = events;
        payload.repos = repos;
      }

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Copilot request failed: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        if (type === 'cv') setCvResult(json.data);
        if (type === 'summary') setSummaryResult(json.data);
        if (type === 'readme') setReadmeResult(json.data);
        if (type === 'weekly') setWeeklyResult(json.data);
      }
    } catch (err) {
      console.error('Error generating with Copilot:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Segment Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/60 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.06] overflow-x-auto scrollbar-none w-fit max-w-full">
        <button
          type="button"
          onClick={() => setActiveSubTab('cv')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'cv'
              ? 'bg-white dark:bg-white/[0.1] text-zinc-950 dark:text-white shadow-xs font-semibold border border-black/5 dark:border-white/[0.1]'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-indigo-500" />
          <span>CV Bullets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('summary')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'summary'
              ? 'bg-white dark:bg-white/[0.1] text-zinc-950 dark:text-white shadow-xs font-semibold border border-black/5 dark:border-white/[0.1]'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-500" />
          <span>Architecture Summary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('readme')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'readme'
              ? 'bg-white dark:bg-white/[0.1] text-zinc-950 dark:text-white shadow-xs font-semibold border border-black/5 dark:border-white/[0.1]'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
          <span>README Optimizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('weekly')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'weekly'
              ? 'bg-white dark:bg-white/[0.1] text-zinc-950 dark:text-white shadow-xs font-semibold border border-black/5 dark:border-white/[0.1]'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 text-purple-500" />
          <span>Weekly Report</span>
        </button>
      </div>

      {/* Control Strip for Repo & Role Selection */}
      {activeSubTab !== 'weekly' && repos.length > 0 && (
        <div className="panel-surface specular-top rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Repo selector */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">
                Target Repo:
              </span>
              <select
                value={selectedRepoName}
                onChange={(e) => setSelectedRepoName(e.target.value)}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer min-w-[180px]"
              >
                {repos.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.stargazers_count} ★, {r.language || 'Code'})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Role input (CV tab) */}
            {activeSubTab === 'cv' && (
              <div className="flex items-center gap-2 flex-1">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400 shrink-0 hidden sm:block" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Target Role (e.g. Senior Frontend Architect)"
                  className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-full"
                />
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => handleGenerate(activeSubTab)}
            disabled={loading}
            className="gap-2 shrink-0 font-semibold"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{loading ? 'Synthesizing...' : 'Generate with AI'}</span>
          </Button>
        </div>
      )}

      {/* Role Suggestions Pills */}
      {activeSubTab === 'cv' && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs text-zinc-500">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
            Quick Roles:
          </span>
          <div className="flex items-center gap-1.5">
            {quickRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  targetRole === role
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 1: CV BULLET POINTS */}
      {activeSubTab === 'cv' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                Evidence-Based CV Resume Bullets
              </CardTitle>
              <Badge variant="indigo" className="text-xs">
                Grounded in Real Code
              </Badge>
            </div>
            <CardDescription>
              Tailored resume bullets highlighting quantifiable impact, active action verbs, and demonstrated technical skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!cvResult ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Ready to Craft Verifiable Resume Points
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
                  Select a repository and target role above, then click Generate to extract verifiable achievements from real commit metadata.
                </p>
                <Button size="sm" onClick={() => handleGenerate('cv')} disabled={loading}>
                  Generate Now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-white/[0.06] pb-2.5">
                  <span className="font-medium">
                    Target: <strong className="text-zinc-900 dark:text-zinc-100">{cvResult.roleTitle}</strong> • Project: <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{cvResult.repoName}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    className="gap-1.5"
                    onClick={() =>
                      handleCopy(
                        cvResult.bullets.map((b) => `• ${b.text}`).join('\n'),
                        'all-cv'
                      )
                    }
                  >
                    {copiedId === 'all-cv' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'all-cv' ? 'Copied All' : 'Copy All Bullets'}</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {cvResult.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] hover:border-indigo-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed flex-1 font-normal">
                          • {bullet.text}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopy(`• ${bullet.text}`, `bullet-${idx}`)}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md cursor-pointer"
                          title="Copy bullet"
                        >
                          {copiedId === `bullet-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-zinc-200/50 dark:border-white/[0.05] flex-wrap gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          Metric: {bullet.metricOrImpact}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {bullet.skillsDemonstrated.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-[10px] font-mono border border-zinc-200/60 dark:border-white/[0.05]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SUBTAB 2: REPOSITORY SUMMARY */}
      {activeSubTab === 'summary' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-500" />
              Architecture & Repository Summary
            </CardTitle>
            <CardDescription>
              Concise technical distillation for portfolios, tech interviews, and presentation decks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!summaryResult ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                <Code2 className="w-8 h-8 text-cyan-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Analyze Repository Architecture
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
                  Select a repository and generate a concise architectural breakdown with core stacks and highlights.
                </p>
                <Button size="sm" onClick={() => handleGenerate('summary')} disabled={loading}>
                  Generate Summary
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                      Executive Summary
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleCopy(summaryResult.summary, 'summary-text')}
                      className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'summary-text' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'summary-text' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                    {summaryResult.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06]">
                    <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2.5">
                      Architecture Highlights
                    </h5>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {summaryResult.architectureHighlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06]">
                    <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2.5">
                      Core Tech Stack & Topics
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {summaryResult.primaryTechStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs font-mono">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-4 mb-2">
                      Key Features
                    </h5>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {summaryResult.keyFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SUBTAB 3: README RECOMMENDATIONS */}
      {activeSubTab === 'readme' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-emerald-500" />
              README Optimization Guide
            </CardTitle>
            <CardDescription>
              Increase repository engagement and developer onboarding with professional README templates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!readmeResult ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                <BookMarked className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Analyze README Gaps
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
                  Get high-impact suggestions, missing documentation sections, and copy-paste markdown installation templates.
                </p>
                <Button size="sm" onClick={() => handleGenerate('readme')} disabled={loading}>
                  Analyze Documentation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200">
                  <p className="font-semibold mb-1">Documentation Assessment:</p>
                  <p className="leading-relaxed">{readmeResult.overallAssessment}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06]">
                    <h5 className="text-xs font-semibold text-amber-500 mb-2">
                      Missing Documentation Sections
                    </h5>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {readmeResult.missingSections.map((sec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{sec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06]">
                    <h5 className="text-xs font-semibold text-emerald-500 mb-2">Quick Wins</h5>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {readmeResult.quickWins.map((win, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Snippets */}
                <div className="space-y-3">
                  <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Ready-to-Embed Markdown Templates
                  </h5>
                  {readmeResult.sampleSnippets.map((snip, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden bg-zinc-950 text-zinc-100 text-xs"
                    >
                      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900 border-b border-zinc-800">
                        <span className="font-mono text-zinc-300 text-[11px]">{snip.heading}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(snip.markdownContent, `snip-${i}`)}
                          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {copiedId === `snip-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === `snip-${i}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3.5 overflow-x-auto font-mono text-[11px] text-zinc-300 leading-relaxed selection:bg-indigo-500">
                        {snip.markdownContent}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SUBTAB 4: WEEKLY DEV REPORT */}
      {activeSubTab === 'weekly' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-500" />
                Weekly Engineering Velocity Report
              </CardTitle>
              <Button
                size="sm"
                onClick={() => handleGenerate('weekly')}
                disabled={loading}
                className="gap-1.5 font-semibold"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Weekly Report</span>
              </Button>
            </div>
            <CardDescription>
              Summarizes recent code commits and repository actions for standups, sprint reviews, or portfolio journals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!weeklyResult ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                <CalendarDays className="w-8 h-8 text-purple-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Ready to Synthesize Weekly Velocity
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
                  Click Generate to aggregate your recorded push events, pull requests, and commit updates into a structured progress report.
                </p>
                <Button size="sm" onClick={() => handleGenerate('weekly')} disabled={loading}>
                  Generate Report
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                      Summary Period: {weeklyResult.period} ({weeklyResult.totalEventsAnalyzed} events)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `# Weekly Engineering Report - @${username}\n\n${weeklyResult.commitSummary}\n\n## Accomplishments\n${weeklyResult.keyAccomplishments.map((a) => `- ${a}`).join('\n')}\n\n## Focus Next Week\n${weeklyResult.focusAreasNextWeek.map((f) => `- ${f}`).join('\n')}`,
                          'weekly-report'
                        )
                      }
                      className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'weekly-report' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'weekly-report' ? 'Copied Full Report' : 'Copy Markdown'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                    {weeklyResult.commitSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06]">
                    <h5 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2.5">
                      Key Accomplishments
                    </h5>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {weeklyResult.keyAccomplishments.map((acc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{acc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06]">
                    <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2.5">
                      Recommended Focus Next Week
                    </h5>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {weeklyResult.focusAreasNextWeek.map((foc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{foc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
