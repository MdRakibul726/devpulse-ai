'use client';

import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Palette,
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
    { id: 'light', label: 'Light Clean', bg: 'bg-white', border: 'border-slate-300' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', bg: 'bg-[#000b1e]', border: 'border-cyan-400' },
    { id: 'radical', label: 'Radical Vibrant', bg: 'bg-[#141321]', border: 'border-pink-500' },
  ] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-500" />
              Dynamic README Card Studio
            </CardTitle>
            <Badge variant="purple" className="text-xs font-mono">
              Vector SVG
            </Badge>
          </div>
          <CardDescription>
            High-DPI dynamic SVG cards that automatically stay synchronized with your GitHub activity.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          {/* Customization Workbench Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-white/[0.02]">
            {/* Card Type */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                Card Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCardType('stats')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    cardType === 'stats'
                      ? 'border-indigo-500 bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.07]'
                  }`}
                >
                  Stats Pulse
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('languages')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    cardType === 'languages'
                      ? 'border-indigo-500 bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.07]'
                  }`}
                >
                  Languages Breakdown
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                Theme Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      theme === t.id
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-white/[0.08] text-zinc-950 dark:text-white font-semibold'
                        : 'border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className={`w-3.5 h-3.5 rounded-full ${t.bg} border ${t.border} shadow-xs shrink-0`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live SVG Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500">
                Live SVG Preview
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={cardEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Raw SVG</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 sm:p-8 rounded-2xl bg-zinc-100/70 dark:bg-black/30 border border-zinc-200/80 dark:border-white/[0.06] overflow-x-auto shadow-inner">
              <img
                src={cardEndpoint}
                alt={`${username}'s DevPulse Card`}
                className="max-w-full rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Embed Code Snippets */}
          <div className="space-y-4">
            {/* Markdown */}
            <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden bg-[#0a0d14] text-zinc-100 shadow-md">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#10141f] border-b border-white/[0.08] text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="font-semibold text-zinc-300">Markdown — GitHub Profile README</span>
                </div>
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-zinc-300 hover:text-white hover:bg-white/10 gap-1.5 cursor-pointer"
                  onClick={() => handleCopy(markdownSnippet, 'markdown')}
                >
                  {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'markdown' ? 'Copied' : 'Copy Markdown'}</span>
                </Button>
              </div>
              <pre className="p-4 font-mono text-xs text-indigo-300 overflow-x-auto selection:bg-indigo-500 selection:text-white">
                {markdownSnippet}
              </pre>
            </div>

            {/* HTML */}
            <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden bg-[#0a0d14] text-zinc-100 shadow-md">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#10141f] border-b border-white/[0.08] text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="font-semibold text-zinc-300">HTML — Portfolio & Website Embed</span>
                </div>
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-zinc-300 hover:text-white hover:bg-white/10 gap-1.5 cursor-pointer"
                  onClick={() => handleCopy(htmlSnippet, 'html')}
                >
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'html' ? 'Copied' : 'Copy HTML'}</span>
                </Button>
              </div>
              <pre className="p-4 font-mono text-xs text-cyan-300 overflow-x-auto selection:bg-indigo-500 selection:text-white">
                {htmlSnippet}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
