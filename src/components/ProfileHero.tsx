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
} from 'lucide-react';
import { GitHubUser } from '@/lib/schemas';
import { formatDate, formatNumber } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProfileHeroProps {
  user: GitHubUser;
}

export function ProfileHero({ user }: ProfileHeroProps) {
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
    <div className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 shadow-sm overflow-hidden mb-6">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-zinc-100 dark:ring-zinc-800 shadow-md">
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center" title="Active developer">
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          {/* User Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {user.name || user.login}
              </h1>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                @{user.login}
              </a>
              <Badge variant="outline" className="text-[11px]">
                Public Profile
              </Badge>
            </div>

            {user.bio && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Metadata Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500 dark:text-zinc-400">
              {user.company && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  {user.company}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {user.location}
                </span>
              )}
              {blogUrl && (
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="truncate max-w-[180px]">{user.blog}</span>
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-zinc-400" />
                  @{user.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Social Stats */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-1.5 text-xs">
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300 p-2 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/60 border border-zinc-200/40 dark:border-zinc-700/40">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{formatNumber(user.followers)}</strong> followers
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
            <div>
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{user.following}</strong> following
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
            <div className="flex items-center gap-1">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{user.public_repos}</strong> repos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
