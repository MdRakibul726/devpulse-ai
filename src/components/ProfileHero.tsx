'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Twitter,
  Calendar,
  Users,
  ExternalLink,
  Copy,
  Check,
  FolderGit2,
  RefreshCw,
} from 'lucide-react';
import { GitHubUser } from '@/lib/schemas';
import { formatDate, formatNumber } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProfileHeroProps {
  user: GitHubUser;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ProfileHero({ user, onRefresh, isRefreshing }: ProfileHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const blogUrl = user.blog
    ? user.blog.startsWith('http')
      ? user.blog
      : `https://${user.blog}`
    : null;

  return (
    <div className="panel-surface specular-top rounded-3xl p-6 sm:p-7 relative overflow-hidden mb-8">
      {/* Subtle architectural gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* User Identity Column */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-3xl">
          {/* Avatar with Status Ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-white/10 shadow-sm">
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0e111a] flex items-center justify-center shadow-xs"
              title="Public active profile"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {user.name || user.login}
              </h1>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                @{user.login}
              </a>
              <Badge variant="success" className="text-[10px] py-0 px-2">
                Verified GitHub Developer
              </Badge>
            </div>

            {user.bio && (
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                {user.bio}
              </p>
            )}

            {/* Meta Tags Row */}
            <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-zinc-500 dark:text-zinc-400">
              {user.company && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300">{user.company}</span>
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300">{user.location}</span>
                </span>
              )}
              {blogUrl && (
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate max-w-[160px]">{user.blog}</span>
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>@{user.twitter_username}</span>
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Joined {formatDate(user.created_at)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Social Metrics */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 w-full lg:w-auto">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10"
                title="Sync live data from GitHub API"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </Button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-1.5 text-xs">
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>

          {/* Social Stats Pill Strip */}
          <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 px-3.5 py-2 rounded-xl bg-zinc-100/70 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.07]">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                <strong className="text-zinc-900 dark:text-white tabular-nums font-mono font-semibold">
                  {formatNumber(user.followers)}
                </strong>{' '}
                followers
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-white/10" />
            <div>
              <span>
                <strong className="text-zinc-900 dark:text-white tabular-nums font-mono font-semibold">
                  {user.following}
                </strong>{' '}
                following
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>
                <strong className="text-zinc-900 dark:text-white tabular-nums font-mono font-semibold">
                  {user.public_repos}
                </strong>{' '}
                repos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
