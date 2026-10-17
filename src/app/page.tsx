'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  FolderGit2,
  ShieldCheck,
  Sparkles,
  Tag,
  AlertCircle,
  RefreshCw,
  Github,
  Search,
} from 'lucide-react';
import { DashboardData } from '@/lib/schemas';
import { Header } from '@/components/Header';
import { ProfileHero } from '@/components/ProfileHero';
import { MetricsOverview } from '@/components/MetricsOverview';
import { LanguageChart } from '@/components/LanguageChart';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { RepoExplorer } from '@/components/RepoExplorer';
import { HealthAnalyzerTab } from '@/components/HealthAnalyzerTab';
import { CareerCopilotTab } from '@/components/CareerCopilotTab';
import { ReadmeCardGeneratorTab } from '@/components/ReadmeCardGeneratorTab';
import { RateLimitBanner } from '@/components/RateLimitBanner';
import { DevPulseIndicator } from '@/components/DevPulseIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Home() {
  const [username, setUsername] = useState<string>('shadcn');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [highlightRepoForAction, setHighlightRepoForAction] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userToFetch: string, forceRefresh = false, demoOnly = false) => {
    if (!userToFetch.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const url = `/api/github/${encodeURIComponent(userToFetch)}?refresh=${forceRefresh}&demo=${demoOnly}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Failed to fetch GitHub profile (${res.status})`);
      }

      setData(json);
      setUsername(json.user?.login || userToFetch);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile('shadcn');
  }, [fetchProfile]);

  const handleSearch = (searchedUsername: string) => {
    fetchProfile(searchedUsername);
  };

  const handleSelectRepoForAI = (repoName: string) => {
    setHighlightRepoForAction(repoName);
    setActiveTab('copilot');
  };

  const handleSelectRepoForHealth = (repoName: string) => {
    setHighlightRepoForAction(repoName);
    setActiveTab('health');
  };

  const handleSelectRepoForCard = (repoName: string) => {
    setHighlightRepoForAction(repoName);
    setActiveTab('cards');
  };

  const handleResetHome = () => {
    setActiveTab('overview');
    setHighlightRepoForAction(null);
    fetchProfile('shadcn');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#090b10] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        onSearch={handleSearch}
        isLoading={loading}
        currentUsername={username}
        onResetHome={handleResetHome}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State Skeleton */}
        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
          </div>
        )}

        {/* Error State with fallback to demo */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center max-w-xl mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
              Unable to load GitHub Profile
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-1 mb-6 leading-relaxed">
              {error}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProfile(username, true)}
                className="gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </Button>
              <Button
                size="sm"
                onClick={() => fetchProfile('shadcn', false, true)}
                className="gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Demo Profile
              </Button>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && data && (
          <div>
            {/* Rate Limit Banner */}
            <RateLimitBanner
              rateLimit={data.rateLimit}
              isDemo={data.isDemo}
              onSwitchToDemo={() => fetchProfile(username, false, true)}
            />

            {/* Profile Hero Header */}
            <ProfileHero user={data.user} />

            {/* Main Feature Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="mb-6">
                <TabsTrigger
                  value="overview"
                  icon={<Activity className="w-4 h-4 text-indigo-500" />}
                >
                  Overview & Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="repos"
                  icon={<FolderGit2 className="w-4 h-4 text-cyan-500" />}
                >
                  Repositories ({data.repos.length})
                </TabsTrigger>
                <TabsTrigger
                  value="health"
                  icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                >
                  Health Analyzer
                </TabsTrigger>
                <TabsTrigger
                  value="copilot"
                  icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                >
                  AI Career Copilot
                </TabsTrigger>
                <TabsTrigger
                  value="cards"
                  icon={<Tag className="w-4 h-4 text-purple-500" />}
                >
                  README Cards
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: OVERVIEW */}
              <TabsContent value="overview" className="space-y-6">
                {/* 5 KPI Metric Cards */}
                <MetricsOverview
                  totalStars={data.totalStars}
                  totalForks={data.totalForks}
                  topLanguage={data.topLanguage}
                  recentCommitCount30d={data.recentCommitCount30d}
                  totalRepos={data.repos.length}
                />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LanguageChart languages={data.languages} />
                  <ActivityTimeline activity={data.activityTimeline} />
                </div>

                {/* Top Repositories Preview */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        Top Starred Repositories
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Most popular projects by community engagement
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('repos')}
                      className="text-xs"
                    >
                      View All {data.repos.length} Repositories
                    </Button>
                  </div>

                  <RepoExplorer
                    repos={data.repos.slice(0, 4)}
                    onSelectRepoForAI={handleSelectRepoForAI}
                    onSelectRepoForHealth={handleSelectRepoForHealth}
                    onSelectRepoForCard={handleSelectRepoForCard}
                  />
                </div>
              </TabsContent>

              {/* TAB 2: REPOSITORIES */}
              <TabsContent value="repos">
                <RepoExplorer
                  repos={data.repos}
                  onSelectRepoForAI={handleSelectRepoForAI}
                  onSelectRepoForHealth={handleSelectRepoForHealth}
                  onSelectRepoForCard={handleSelectRepoForCard}
                />
              </TabsContent>

              {/* TAB 3: PROJECT HEALTH */}
              <TabsContent value="health">
                <HealthAnalyzerTab
                  repos={data.repos}
                  highlightRepo={highlightRepoForAction}
                />
              </TabsContent>

              {/* TAB 4: AI COPILOT */}
              <TabsContent value="copilot">
                <CareerCopilotTab
                  repos={data.repos}
                  events={data.recentEvents}
                  username={data.user.login}
                  initialSelectedRepo={highlightRepoForAction}
                />
              </TabsContent>

              {/* TAB 5: README CARDS */}
              <TabsContent value="cards">
                <ReadmeCardGeneratorTab username={data.user.login} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Branded DevPulse Indicator (Custom DevTools) */}
      <DevPulseIndicator
        rateLimit={data?.rateLimit}
        isDemo={data?.isDemo}
        onResetHome={handleResetHome}
      />

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm text-xs text-zinc-500 dark:text-zinc-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              DevPulse AI
            </span>
            <span>—</span>
            <span>GitHub Profile Analytics & AI Career Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Production Portfolio Architecture</span>
            <span>•</span>
            <span>Next.js 16 + React 19 + TypeScript + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
