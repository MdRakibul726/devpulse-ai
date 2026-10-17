'use client';

import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  ExternalLink,
  Code,
  Palette,
  Sparkles,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ReadmeCardGeneratorTabProps {
  username: string;
}

export function ReadmeCardGeneratorTab({ username }: ReadmeCardGeneratorTabProps) {
  const [cardType, setCardType] = useState<'stats' | 'languages'>('stats');
  const [theme, setTheme] = useState<'dark' | 'light' | 'cyberpunk' | 'radical'>('dark');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cardEndpoint = `/api/cards/${cardType}?username=${encodeURIComponent(username)}&theme=${theme}`;
  
  // Construct absolute or relative snippet
  const markdownSnippet = `[![${username}'s DevPulse](${cardEndpoint})](https://github.com/${username})`;
  const htmlSnippet = `<a href="https://github.com/${username}">
  <img src="${cardEndpoint}" alt="${username}'s GitHub DevPulse" />
</a>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const themes = [
    { id: 'dark', label: 'Dark Modern', bg: 'bg-[#090d16]', border: 'border-slate-800' },
    { id: 'light', label: 'Light Clean', bg: 'bg-white', border: 'border-slate-200' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', bg: 'bg-[#000b1e]', border: 'border-cyan-400' },
    { id: 'radical', label: 'Radical Vibrant', bg: 'bg-[#141321]', border: 'border-pink-500' },
  ] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" />
              README Badge & Card Generator
            </CardTitle>
            <Badge variant="indigo" className="text-xs">
              SVG Vector
            </Badge>
          </div>
          <CardDescription>
            Live dynamic SVG cards ready to embed into your GitHub profile README or portfolio website.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customization Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
            {/* Card Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Card Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCardType('stats')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    cardType === 'stats'
                      ? 'border-indigo-600 bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750'
                  }`}
                >
                  GitHub Statistics Pulse
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('languages')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    cardType === 'languages'
                      ? 'border-indigo-600 bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750'
                  }`}
                >
                  Top Languages Breakdown
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Color Palette Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      theme === t.id
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20 text-zinc-900 dark:text-zinc-100 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-750'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className={`w-3 h-3 rounded-full ${t.bg} border ${t.border}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Live Interactive SVG Preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={cardEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
                >
                  <span>Open Raw SVG</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 overflow-x-auto shadow-inner">
              <img
                src={cardEndpoint}
                alt={`${username}'s DevPulse Card`}
                className="max-w-full rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Embed Snippets */}
          <div className="space-y-4">
            {/* Markdown */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950 text-zinc-100">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs">
                <span className="font-semibold text-zinc-300">Markdown (For GitHub Profile README)</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-zinc-300 hover:text-white gap-1.5"
                  onClick={() => handleCopy(markdownSnippet, 'markdown')}
                >
                  {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'markdown' ? 'Copied' : 'Copy Markdown'}</span>
                </Button>
              </div>
              <pre className="p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto">
                {markdownSnippet}
              </pre>
            </div>

            {/* HTML */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950 text-zinc-100">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs">
                <span className="font-semibold text-zinc-300">HTML (For Portfolio / Website Embed)</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-zinc-300 hover:text-white gap-1.5"
                  onClick={() => handleCopy(htmlSnippet, 'html')}
                >
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'html' ? 'Copied' : 'Copy HTML'}</span>
                </Button>
              </div>
              <pre className="p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto">
                {htmlSnippet}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
