'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  GitFork,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Tag,
  X,
  Globe,
} from 'lucide-react';
import { GitHubRepo } from '@/lib/schemas';
import { formatNumber, timeAgo, getLanguageColor } from '@/lib/utils';
import { Badge } from './ui/badge';

interface RepoExplorerProps {
  repos: GitHubRepo[];
  onSelectRepoForAI?: (repoName: string) => void;
  onSelectRepoForHealth?: (repoName: string) => void;
  onSelectRepoForCard?: (repoName: string) => void;
}

export function RepoExplorer({
  repos,
  onSelectRepoForAI,
  onSelectRepoForHealth,
  onSelectRepoForCard,
}: RepoExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('updated');
  const [hideForks, setHideForks] = useState(false);

  // Available unique languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return ['All', ...Array.from(langs).sort()];
  }, [repos]);

  // Filtered and sorted repos
  const filteredRepos = useMemo(() => {
    return repos
      .filter((r) => {
        if (hideForks && r.fork) return false;
        if (selectedLanguage !== 'All' && r.language !== selectedLanguage) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchDesc = r.description ? r.description.toLowerCase().includes(q) : false;
          const matchTopic = r.topics ? r.topics.some((t) => t.toLowerCase().includes(q)) : false;
          if (!matchName && !matchDesc && !matchTopic) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          const diff = (b.stargazers_count || 0) - (a.stargazers_count || 0);
          if (diff !== 0) return diff;
          // Tie-breaker: latest live/updated repo first
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        if (sortBy === 'forks') {
          const diff = (b.forks_count || 0) - (a.forks_count || 0);
          if (diff !== 0) return diff;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        if (sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        return 0;
      });
  }, [repos, searchQuery, selectedLanguage, sortBy, hideForks]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="panel-surface specular-top rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, topics, or stack..."
            className="w-full h-9 pl-9 pr-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-white/[0.04] text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Filter className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'All' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars' | 'forks')}
              className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
            >
              <option value="updated">Recently Updated (Live)</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
            </select>
          </div>

          {/* Hide Forks Checkbox */}
          <label className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer select-none px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors">
            <input
              type="checkbox"
              checked={hideForks}
              onChange={(e) => setHideForks(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Hide forks</span>
          </label>
        </div>
      </div>

      {/* Repositories Counter */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Showing <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{filteredRepos.length}</strong> of{' '}
          <span className="font-mono">{repos.length}</span> repositories
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div className="panel-surface rounded-2xl p-12 text-center">
          <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No matching repositories found
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Try adjusting your search query or language filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo, repoIndex) => {
            const hasLicense = Boolean(repo.license?.name || repo.license?.spdx_id);
            const hasDescription = Boolean(repo.description && repo.description.trim().length > 0);
            const isLiveActive = repoIndex === 0 || (new Date().getTime() - new Date(repo.updated_at).getTime() < 14 * 24 * 60 * 60 * 1000);
            const hasHomepage = Boolean(repo.homepage && repo.homepage.startsWith('http'));

            return (
              <div
                key={repo.id}
                className="panel-surface specular-top panel-interactive rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Header Row: Title + Stats */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate flex items-center gap-1.5"
                        >
                          <span className="truncate">{repo.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-zinc-400" />
                        </a>
                        {isLiveActive && !repo.archived && !repo.fork && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Live</span>
                          </span>
                        )}
                        {hasHomepage && (
                          <a
                            href={repo.homepage!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-1.5 py-0.2 rounded-md transition-colors"
                            title={`Live Site: ${repo.homepage}`}
                          >
                            <Globe className="w-3 h-3" />
                            <span>Demo</span>
                          </a>
                        )}
                        {repo.fork && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                            Fork
                          </Badge>
                        )}
                        {repo.archived && (
                          <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                            Archived
                          </Badge>
                        )}
                      </div>

                      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                        {hasDescription ? (
                          repo.description
                        ) : (
                          <span className="italic text-zinc-400 dark:text-zinc-500">
                            No description provided.
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Star & Fork Counters */}
                    <div className="flex items-center gap-2 shrink-0 text-xs">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-mono font-semibold tabular-nums">
                          {formatNumber(repo.stargazers_count)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400">
                        <GitFork className="w-3 h-3 text-zinc-400" />
                        <span className="font-mono tabular-nums">
                          {formatNumber(repo.forks_count)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Topics Chips */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-white/[0.05]"
                        >
                          #{topic}
                        </span>
                      ))}
                      {repo.topics.length > 4 && (
                        <span className="text-[10px] text-zinc-400 self-center font-mono">
                          +{repo.topics.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Row: Language, License, Updated + Action Buttons */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    {/* Primary Language */}
                    {repo.language && (
                      <div className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span>{repo.language}</span>
                      </div>
                    )}

                    {/* License status */}
                    {hasLicense ? (
                      <span
                        className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]"
                        title={`License: ${repo.license?.name}`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{repo.license?.spdx_id || 'License'}</span>
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1 text-amber-500 font-medium text-[11px]"
                        title="Missing open-source license"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>No License</span>
                      </span>
                    )}

                    <span className="text-zinc-400 text-[11px]">
                      {timeAgo(repo.updated_at)}
                    </span>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex items-center gap-1">
                    {hasHomepage && (
                      <a
                        href={repo.homepage!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                        title={`Open live site: ${repo.homepage}`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Site</span>
                      </a>
                    )}
                    {onSelectRepoForHealth && (
                      <button
                        type="button"
                        onClick={() => onSelectRepoForHealth(repo.name)}
                        className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Audit health & hygiene"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Health</span>
                      </button>
                    )}
                    {onSelectRepoForAI && (
                      <button
                        type="button"
                        onClick={() => onSelectRepoForAI(repo.name)}
                        className="px-2 py-1 rounded-md text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Generate CV bullet points & summary"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Copilot</span>
                      </button>
                    )}
                    {onSelectRepoForCard && (
                      <button
                        type="button"
                        onClick={() => onSelectRepoForCard(repo.name)}
                        className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Generate README badge"
                      >
                        <Tag className="w-3 h-3" />
                        <span>Card</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
