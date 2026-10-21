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
  ArrowRight,
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
  const [username, setUsername] = useState<string>('MdRakibul726');
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
      const timestampParam = forceRefresh ? `&_t=${Date.now()}` : '';
      const url = `/api/github/${encodeURIComponent(userToFetch)}?refresh=${forceRefresh}&demo=${demoOnly}${timestampParam}`;
      const res = await fetch(url, {
        cache: forceRefresh ? 'no-store' : 'default',
        headers: forceRefresh ? { 'Cache-Control': 'no-cache, no-store' } : undefined,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Failed to fetch GitHub profile (${res.status})`);
      }

      setData(json);
      const activeLogin = json.user?.login || userToFetch;
      setUsername(activeLogin);

      // Persist active user to URL and localStorage so reload keeps current profile
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('devpulse_active_user', activeLogin);
          const currentUrl = new URL(window.location.href);
          if (currentUrl.searchParams.get('user') !== activeLogin) {
            currentUrl.searchParams.set('user', activeLogin);
            window.history.replaceState(null, '', currentUrl.toString());
          }
        } catch {
          // ignore storage errors
        }
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while communicating with GitHub.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let initialUser = 'MdRakibul726';
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramUser = urlParams.get('user');
      const cachedUser = localStorage.getItem('devpulse_active_user');
      if (paramUser && paramUser.trim()) {
        initialUser = paramUser.trim();
      } else if (cachedUser && cachedUser.trim()) {
        initialUser = cachedUser.trim();
      }
    }
    setUsername(initialUser);
    fetchProfile(initialUser, true);
  }, [fetchProfile]);

  const handleSearch = (searchedUsername: string) => {
    // When a user searches or clicks Analyze, ALWAYS force refresh to get live repos
    fetchProfile(searchedUsername, true);
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
    fetchProfile('MdRakibul726', true);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
      {/* Ambient Lighting & Micro-Grid Atmosphere */}
      <div className="fixed inset-0 bg-ambient-glow bg-tech-grid pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Header
        onSearch={handleSearch}
        isLoading={loading}
        currentUsername={username}
        onResetHome={handleResetHome}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Loading State Skeleton */}
        {loading && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Skeleton className="h-44 w-full rounded-3xl" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        )}

        {/* Error State with fallback to demo */}
        {!loading && error && (
          <div className="panel-surface specular-top rounded-3xl p-8 text-center max-w-lg mx-auto my-12 border border-rose-500/30">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
              Unable to Fetch GitHub Profile
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-6 leading-relaxed">
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
                <span>Retry</span>
              </Button>
              <Button
                size="sm"
                onClick={() => fetchProfile(username || 'MdRakibul726', false, true)}
                className="gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Demo Profile</span>
              </Button>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && data && (
          <div className="animate-in fade-in duration-300">
            {/* Rate Limit Banner */}
            <RateLimitBanner
              rateLimit={data.rateLimit}
              isDemo={data.isDemo}
              onSwitchToDemo={() => fetchProfile(username, false, true)}
            />

            {/* Profile Hero Header */}
            <ProfileHero
              user={data.user}
              onRefresh={() => fetchProfile(username, true)}
              isRefreshing={loading}
            />

            {/* Main Feature Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="mb-6">
                <TabsTrigger
                  value="overview"
                  icon={<Activity className="w-3.5 h-3.5 text-indigo-500" />}
                >
                  Overview & Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="repos"
                  icon={<FolderGit2 className="w-3.5 h-3.5 text-cyan-500" />}
                >
                  Repositories ({data.repos.length})
                </TabsTrigger>
                <TabsTrigger
                  value="health"
                  icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                >
                  Health Audit
                </TabsTrigger>
                <TabsTrigger
                  value="copilot"
                  icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                >
                  AI Career Copilot
                </TabsTrigger>
                <TabsTrigger
                  value="cards"
                  icon={<Tag className="w-3.5 h-3.5 text-purple-500" />}
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
                      <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Top Starred Repositories
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Most popular open projects by community engagement
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setActiveTab('repos')}
                      className="gap-1.5"
                    >
                      <span>View All ({data.repos.length})</span>
                      <ArrowRight className="w-3 h-3" />
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

      {/* Branded DevPulse Diagnostics Indicator */}
      <DevPulseIndicator
        rateLimit={data?.rateLimit}
        isDemo={data?.isDemo}
        onResetHome={handleResetHome}
      />

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/80 dark:border-white/[0.06] py-8 bg-white/50 dark:bg-[#07090e]/60 backdrop-blur-xl text-xs text-zinc-500 dark:text-zinc-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              DevPulse AI
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">—</span>
            <span className="hidden sm:inline">GitHub Profile Analytics & Career Copilot</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700 hidden md:inline">•</span>
            <span className="hidden md:inline text-zinc-400 font-mono">Next.js 16 + React 19 + TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
