'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Tag,
} from 'lucide-react';
import { GitHubRepo } from '@/lib/schemas';
import { formatNumber, timeAgo, getLanguageColor } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('stars');
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
        if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        if (sortBy === 'forks') return (b.forks_count || 0) - (a.forks_count || 0);
        if (sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        return 0;
      });
  }, [repos, searchQuery, selectedLanguage, sortBy, hideForks]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories, topics, or descriptions..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language filter */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 text-xs text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer shadow-xs"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'All' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 text-xs text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer shadow-xs"
            >
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* Hide Forks Checkbox */}
          <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer select-none ml-1 px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            <input
              type="checkbox"
              checked={hideForks}
              onChange={(e) => setHideForks(e.target.checked)}
              className="rounded-md border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Hide forks</span>
          </label>
        </div>
      </div>

      {/* Repositories Counter */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Showing <strong>{filteredRepos.length}</strong> of {repos.length} repositories
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-indigo-500 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No matching repositories found
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Try adjusting your search filters or language selection.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => {
            const hasLicense = Boolean(repo.license?.name || repo.license?.spdx_id);
            const hasDescription = Boolean(repo.description && repo.description.trim().length > 0);

            return (
              <Card
                key={repo.id}
                className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
              >
                <CardHeader className="p-4 sm:p-5 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate flex items-center gap-1.5"
                        >
                          <span className="truncate">{repo.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </a>
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

                      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                        {hasDescription ? (
                          repo.description
                        ) : (
                          <span className="italic text-zinc-400 dark:text-zinc-500">
                            No description provided.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                          #{topic}
                        </span>
                      ))}
                      {repo.topics.length > 4 && (
                        <span className="text-[10px] text-zinc-400 self-center">
                          +{repo.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0">
                  {/* Stats and Badges */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 pt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {/* Language */}
                      {repo.language && (
                        <div className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span>{repo.language}</span>
                        </div>
                      )}

                      {/* Stars */}
                      <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>{formatNumber(repo.stargazers_count)}</span>
                      </div>

                      {/* Forks */}
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{formatNumber(repo.forks_count)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      {hasLicense ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title={`License: ${repo.license?.name}`}>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{repo.license?.spdx_id || 'License'}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-500" title="Missing open-source license">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>No License</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>Updated {timeAgo(repo.updated_at)}</span>
                    </div>
                  </div>

                  {/* Quick Action Bar */}
                  <div className="mt-3 pt-2.5 border-t border-dashed border-zinc-100 dark:border-zinc-800/60 flex items-center justify-end gap-1.5">
                    {onSelectRepoForHealth && (
                      <button
                        onClick={() => onSelectRepoForHealth(repo.name)}
                        className="text-[11px] font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-500/10 hover:text-indigo-500 text-zinc-600 dark:text-zinc-300 transition-colors flex items-center gap-1"
                        title="Analyze health & recommendations"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Health
                      </button>
                    )}
                    {onSelectRepoForAI && (
                      <button
                        onClick={() => onSelectRepoForAI(repo.name)}
                        className="text-[11px] font-medium px-2 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-1"
                        title="Generate CV bullet points & summary"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Copilot
                      </button>
                    )}
                    {onSelectRepoForCard && (
                      <button
                        onClick={() => onSelectRepoForCard(repo.name)}
                        className="text-[11px] font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors flex items-center gap-1"
                        title="Generate README card"
                      >
                        <Tag className="w-3 h-3" />
                        Badge
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
