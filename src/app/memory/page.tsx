'use client';

import { useState } from 'react';
import { Search, Calendar, Tag, ChevronRight, Brain, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

interface Memory {
  id: string;
  date: string;
  content: string;
  type: 'daily' | 'long_term';
  tags: string[];
  preview: string;
}

const mockDailyMemories: Memory[] = [
  {
    id: '1',
    date: '2026-03-03',
    type: 'daily',
    content: `## Mission Control PRD
- Received PRD from Greg for Mission Control dashboard
- Key modules: Task Board, Calendar, Projects, Memory Browser, Document Hub, Team
- Started building Next.js project with Tailwind
- Focus on Linear-inspired design

## Webflow Migration
- Greg asked about moving info.municibid.com to municibid.com/info/*
- Recommended Cloudflare Workers or Azure Front Door
- Wrote detailed implementation guide`,
    tags: ['mission-control', 'webflow', 'development'],
    preview: 'Mission Control PRD received. Started building the dashboard...',
  },
  {
    id: '2',
    date: '2026-03-02',
    type: 'daily',
    content: `## Weekly Reports
- WFA Monitor: Alert triggered (low open rate 27.74%)
- Weekly Security Report: All clear, 17 packages need updates
- Gmail deliverability issues with WFA newsletter

## SEO Scheduling
- Set up Weekly SEO Report for Mondays 8am PT
- Will run Lighthouse and post to #marty-dev`,
    tags: ['reports', 'wfa', 'seo'],
    preview: 'Weekly reports completed. WFA alert on open rates...',
  },
  {
    id: '3',
    date: '2026-02-26',
    type: 'daily',
    content: `## WFA Newsletter Picks
- Posted 10 picks for Mar 6-13 auctions
- Hero item: MacBook Pro M3 from ME
- Geographic spread: 8 states represented`,
    tags: ['wfa', 'newsletter'],
    preview: 'WFA picks posted. MacBook Pro M3 as hero item...',
  },
];

const mockLongTermMemories: Memory[] = [
  {
    id: 'lt1',
    date: '2026-01-28',
    type: 'long_term',
    content: `## Municibid Tech Stack
- ASP.NET MVC (C#) with Razor views
- Azure SQL + Entity Framework
- Azure App Service hosting
- Customer.io for email marketing
- Intercom for support`,
    tags: ['technical', 'infrastructure'],
    preview: 'Core tech stack: ASP.NET MVC, Azure SQL, Customer.io...',
  },
  {
    id: 'lt2',
    date: '2026-01-28',
    type: 'long_term',
    content: `## Team Members
- Greg Berry: CEO
- Jackie Blaskovich: Customer Success
- Ronald Quiros: Director of Technology (U2DQ7QFPX)
- Jose Pablo Flores: Software Developer
- Sophie Eden: Marketing`,
    tags: ['team', 'people'],
    preview: 'Team directory: Greg, Jackie, Ronald, Jose Pablo, Sophie...',
  },
];

function MemoryCard({ memory, expanded, onToggle }: { memory: Memory; expanded: boolean; onToggle: () => void }) {
  return (
    <div 
      className={clsx(
        'bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all',
        expanded ? 'ring-2 ring-indigo-200' : 'hover:border-gray-300'
      )}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            {new Date(memory.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          {expanded ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-3 rounded-lg">
                {memory.content}
              </pre>
            </div>
          ) : (
            <p className="text-gray-700 text-sm">{memory.preview}</p>
          )}
        </div>
        <ChevronRight className={clsx(
          'w-5 h-5 text-gray-400 transition-transform shrink-0 ml-2',
          expanded && 'rotate-90'
        )} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        {memory.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MemoryPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'daily' | 'long_term'>('daily');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const memories = activeTab === 'daily' ? mockDailyMemories : mockLongTermMemories;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Memory Browser</h1>
        <p className="text-gray-500 mt-1">Browse and search conversation memories</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search memories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('daily')}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
            activeTab === 'daily'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <Calendar className="w-4 h-4" />
          Daily Memories
        </button>
        <button
          onClick={() => setActiveTab('long_term')}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
            activeTab === 'long_term'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <Brain className="w-4 h-4" />
          Long-Term Memory
        </button>
      </div>

      {/* Memory List */}
      <div className="space-y-4">
        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            expanded={expandedId === memory.id}
            onToggle={() => setExpandedId(expandedId === memory.id ? null : memory.id)}
          />
        ))}
      </div>
    </div>
  );
}
