'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden mb-8 border border-zinc-200/90 dark:border-white/[0.08] shadow-xl shadow-black/5 dark:shadow-indigo-950/20">
      {/* Dynamic Background Accent Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-16 w-60 h-60 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with Gradient Frame */}
          <div className="relative group shrink-0">
            <div className="p-[2.5px] rounded-3xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-indigo-600 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[21px] overflow-hidden bg-zinc-900 ring-2 ring-white/20">
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full ring-3 ring-white dark:ring-[#08090d] flex items-center justify-center shadow-xs" title="Active GitHub developer">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* User Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
                {user.name || user.login}
              </h1>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                @{user.login}
              </a>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Public Profile
              </span>
            </div>

            {user.bio && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
                {user.bio}
              </p>
            )}

            {/* Metadata Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500 dark:text-zinc-400">
              {user.company && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  {user.company}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  {user.location}
                </span>
              )}
              {blogUrl && (
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{user.blog}</span>
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                >
                  <Twitter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  @{user.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Social Stats */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3.5 w-full md:w-auto">
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-1.5 text-xs rounded-xl font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-indigo-500/20 shadow-xs cursor-pointer"
                title="Sync latest live data from GitHub API"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs rounded-xl cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-1.5 text-xs rounded-xl font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white shadow-md shadow-indigo-500/25 active:scale-95 cursor-pointer">
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300 p-2.5 sm:px-4 rounded-2xl bg-zinc-100/80 dark:bg-white/[0.04] border border-zinc-200/70 dark:border-white/[0.08] backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                <strong className="text-zinc-900 dark:text-white font-mono text-xs sm:text-sm font-bold">{formatNumber(user.followers)}</strong> followers
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300/80 dark:bg-white/10" />
            <div>
              <span>
                <strong className="text-zinc-900 dark:text-white font-mono text-xs sm:text-sm font-bold">{user.following}</strong> following
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300/80 dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>
                <strong className="text-zinc-900 dark:text-white font-mono text-xs sm:text-sm font-bold">{user.public_repos}</strong> repos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
