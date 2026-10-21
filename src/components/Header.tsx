'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Github, Sparkles, RefreshCw, X, Command } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  currentUsername: string;
  onResetHome?: () => void;
}

export function Header({ onSearch, isLoading, currentUsername, onResetHome }: HeaderProps) {
  const [searchInput, setSearchInput] = useState(currentUsername || '');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSearchInput(currentUsername || '');
  }, [currentUsername]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleSampleClick = (username: string) => {
    setSearchInput(username);
    onSearch(username);
  };

  const handleHomeClick = () => {
    setSearchInput('MdRakibul726');
    if (onResetHome) {
      onResetHome();
    } else {
      window.location.href = '/';
    }
  };

  const featuredUsers = ['MdRakibul726', 'shadcn', 'torvalds', 'leerob', 'gaearon', 'octocat'] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-white/[0.07] bg-white/80 dark:bg-[#090a0f]/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none select-none shrink-0"
          title="Return to DevPulse Home"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-600/30 group-hover:shadow-md group-hover:shadow-indigo-600/40 transition-all duration-200 border border-white/20">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-[#090a0f]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                DevPulse
              </span>
              <span className="text-[10px] font-mono font-semibold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden md:block">
              GitHub Intelligence Platform
            </p>
          </div>
        </button>

        {/* Search Command Input */}
        <form onSubmit={handleFormSubmit} className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search GitHub profile (e.g. shadcn, torvalds)..."
              disabled={isLoading}
              className="w-full h-9 pl-9 pr-24 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-white/[0.04] text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 dark:focus:border-indigo-500/50 transition-all"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              {searchInput && !isLoading && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <Button
                type="submit"
                size="xs"
                disabled={isLoading || !searchInput.trim()}
                className="h-6 px-2 text-[11px] font-medium"
              >
                {isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>

          {/* GitHub External */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Featured Profiles Strip */}
      <div className="border-t border-zinc-100 dark:border-white/[0.05] bg-zinc-50/70 dark:bg-black/20 px-4 py-1.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 shrink-0 font-semibold">
            Featured:
          </span>
          <div className="flex items-center gap-1.5">
            {featuredUsers.map((user) => {
              const isActive = currentUsername.toLowerCase() === user.toLowerCase();
              return (
                <button
                  key={user}
                  type="button"
                  onClick={() => handleSampleClick(user)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-zinc-200/60 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  @{user}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
