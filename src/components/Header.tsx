'use client';

import React, { useState } from 'react';
import { Search, Activity, Sun, Moon, Github, Sparkles, RefreshCw } from 'lucide-react';
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
    setSearchInput('shadcn');
    if (onResetHome) {
      onResetHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Home Link */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
          title="Return to Home Dashboard"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-900 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent group-hover:opacity-90">
                DevPulse
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
              GitHub Intelligence & Career Assistant
            </p>
          </div>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleFormSubmit} className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search GitHub username (e.g. shadcn, torvalds)..."
              disabled={isLoading}
              className="w-full h-10 pl-10 pr-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !searchInput.trim()}
                className="h-7 px-3 text-xs rounded-lg"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-zinc-600 dark:text-zinc-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </Button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Quick Sample Profile Pills */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/40 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto py-0.5">
          <span className="font-medium shrink-0">Try exploring:</span>
          {(['shadcn', 'torvalds', 'leerob', 'gaearon', 'octocat'] as const).map((user) => (
            <button
              key={user}
              onClick={() => handleSampleClick(user)}
              className="px-2.5 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-[11px] font-medium"
            >
              @{user}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
