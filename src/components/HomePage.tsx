'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  BarChart3,
  Code2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Star,
  Github,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

interface HomePageProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function HomePage({ onSearch, isLoading }: HomePageProps) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const featuredDevelopers = [
    { name: 'MdRakibul726', label: 'Creator Showcase', badge: 'Creator', highlight: true },
    { name: 'shadcn', label: 'UI Architect', badge: 'Popular', highlight: false },
    { name: 'torvalds', label: 'Linux Creator', badge: 'Legend', highlight: false },
    { name: 'leerob', label: 'Next.js Dev', badge: 'Core', highlight: false },
    { name: 'gaearon', label: 'React Pioneer', badge: 'Alum', highlight: false },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Career Copilot',
      tag: 'LLM Powered',
      color: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      borderColor: 'group-hover:border-indigo-500/40',
      iconColor: 'text-indigo-400',
      description:
        'Converts raw git commits and repository activity into quantified STAR-method resume bullet points, elevator pitches, and weekly developer standup reports.',
      highlights: ['Recruiter-ready bullet points', 'Weekly work summary logs', 'Architecture elevator pitches'],
    },
    {
      icon: ShieldCheck,
      title: '360° Repo Health Audit',
      tag: 'Scoring Engine',
      color: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
      description:
        'Audits repositories with an automated scoring algorithm (A+ through F) inspecting README completeness, open source licensing, branch standards, and issue ratios.',
      highlights: ['Automated grade calculation', 'Missing documentation flags', 'Actionable remediation tips'],
    },
    {
      icon: BarChart3,
      title: 'Tech Stack & Velocity',
      tag: 'Real-Time Data',
      color: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderColor: 'group-hover:border-cyan-500/40',
      iconColor: 'text-cyan-400',
      description:
        'Interactive visualizations of your language distribution breakdown, 30-day activity trends, and a deep repository explorer with live search and multi-criteria sorting.',
      highlights: ['Language byte-accurate charts', '30-day commit heatmaps', 'Instant repo search & filter'],
    },
    {
      icon: Code2,
      title: 'Dynamic README Badges',
      tag: 'Live SVG Widgets',
      color: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/40',
      iconColor: 'text-amber-400',
      description:
        'Generate embeddable SVG cards for your GitHub Profile README that update automatically in real-time with Dark, Light, Cyberpunk, and Radical themes.',
      highlights: ['Embeddable in Markdown', 'Zero server configuration', 'Multiple color palettes'],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Search Any Profile',
      desc: 'Enter any public GitHub username. No signup, OAuth tokens, or passwords needed.',
    },
    {
      num: '02',
      title: 'Real-Time Synthesis',
      desc: 'DevPulse fetches live repositories, commits, and languages, validating all data with strict Zod schemas.',
    },
    {
      num: '03',
      title: 'Supercharge Your Career',
      desc: 'Copy tailored resume highlights, inspect health grades, and embed dynamic cards into your portfolio.',
    },
  ];

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6 pb-2">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 shadow-sm shadow-indigo-500/10 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>DevPulse AI • GitHub Intelligence & Career Copilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>

        {/* Master Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
          Turn Raw GitHub Activity Into{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Quantified Career Capital
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          DevPulse AI audits your repositories, synthesizes STAR-method resume achievements from your git activity,
          visualizes tech stack velocity, and generates live dynamic SVG badges for your profile.
        </p>

        {/* Central Search Form */}
        <div className="max-w-xl mx-auto pt-3">
          <form
            onSubmit={handleSubmit}
            className="panel-surface specular-top p-2 rounded-2xl border border-zinc-200/90 dark:border-white/10 shadow-xl flex items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all"
          >
            <div className="pl-3 text-zinc-400">
              <Github className="w-5 h-5 text-indigo-500" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter GitHub username (e.g. MdRakibul726)"
              className="w-full bg-transparent border-0 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="h-10 px-5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shrink-0 shadow-md shadow-indigo-500/20 transition-all"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Profile'}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>

          {/* Quick Starters */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-400">Try Instant Demo:</span>
            {featuredDevelopers.map((dev) => (
              <button
                key={dev.name}
                type="button"
                onClick={() => onSearch(dev.name)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  dev.highlight
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 font-semibold'
                    : 'border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/30'
                }`}
              >
                <span>@{dev.name}</span>
                {dev.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      dev.highlight ? 'bg-indigo-500 text-white' : 'bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {dev.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Showcase Spotlight Banner */}
      <section className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl panel-surface specular-top p-6 sm:p-8 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-cyan-500/[0.05]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                <Star className="w-3 h-3 fill-indigo-500" />
                Featured Creator Portfolio
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Explore @MdRakibul726 in Action
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl">
                See real-time analytics across 10 active repositories, full language distributions, audit grades, and AI resume bullets generated on demand.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => onSearch('MdRakibul726')}
              className="h-11 px-6 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer"
            >
              Launch Creator Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Why Developers Use DevPulse AI
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Everything you need to analyze, optimize, and present your developer work to recruiters and teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className={`group border border-zinc-200/90 dark:border-white/10 ${f.borderColor} transition-all duration-300 hover:shadow-xl relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} pointer-events-none opacity-50`} />
                <CardHeader className="relative pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.08] ${f.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                      {f.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                    {f.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                    {f.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <ul className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
                    {f.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Before & After Comparison */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            The DevPulse Advantage
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Traditional GitHub profiles hide your best engineering work. DevPulse AI brings it forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Traditional */}
          <div className="panel-surface rounded-2xl p-6 border border-rose-500/20 bg-rose-500/[0.02] space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Standard GitHub Profile
            </div>
            <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Repositories are just names and star counts with no architectural explanation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Recruiters spend under 30 seconds and miss your complex technical contributions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>You spend hours trying to write convincing resume bullet points from memory.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Profile README cards from dead third-party servers break and show image errors.</span>
              </li>
            </ul>
          </div>

          {/* With DevPulse AI */}
          <div className="panel-surface specular-top rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/[0.03] space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              With DevPulse AI Intelligence
            </div>
            <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Instant executive summary and primary tech stacks generated for each repository.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>STAR-method resume bullet points tailored to your target engineering roles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>360° health grades assessing README quality, license, and community standards.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Self-hosted, ultra-reliable SVG cards that render natively on GitHub without external downtime.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            How It Works in 3 Steps
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Zero configuration. No installation. Get actionable insights in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="panel-surface specular-top rounded-2xl p-6 border border-zinc-200/90 dark:border-white/10 space-y-3"
            >
              <div className="text-2xl font-black font-mono text-indigo-500/50 dark:text-indigo-400/40">
                {s.num}
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {s.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-10 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
          Ready to Analyze Your GitHub Intelligence?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Enter your username above or launch the creator demo to see all features live.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => onSearch('MdRakibul726')}
            className="h-11 px-6 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Launch Live Demo (@MdRakibul726)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
