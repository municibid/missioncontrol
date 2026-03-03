'use client';

import { useState } from 'react';
import { FolderKanban, Plus, ExternalLink, CheckSquare, FileText, Brain } from 'lucide-react';
import { clsx } from 'clsx';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  businessLine: 'municibid' | 'surplus_com' | 'surplus_ai' | 'personal';
  tasksCount: number;
  docsCount: number;
  lastActivity: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'MARA CRM Development',
    description: 'RFP module, intelligence engine, outreach platform, sales enablement',
    status: 'active',
    progress: 35,
    businessLine: 'municibid',
    tasksCount: 12,
    docsCount: 8,
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    name: 'Surplus.com 2.0',
    description: 'Vercel + Neon Postgres migration, government surplus meta-search',
    status: 'active',
    progress: 20,
    businessLine: 'surplus_com',
    tasksCount: 6,
    docsCount: 3,
    lastActivity: '1 day ago',
  },
  {
    id: '3',
    name: 'Surplus.ai Platform',
    description: 'AI-agent-driven marketplace, Command Line Marketplace concept',
    status: 'active',
    progress: 10,
    businessLine: 'surplus_ai',
    tasksCount: 4,
    docsCount: 5,
    lastActivity: '3 days ago',
  },
  {
    id: '4',
    name: 'Municibid 20th Anniversary',
    description: '20 Days of Municibid campaign, prize structures, marketing automation',
    status: 'active',
    progress: 5,
    businessLine: 'municibid',
    tasksCount: 8,
    docsCount: 2,
    lastActivity: '1 week ago',
  },
  {
    id: '5',
    name: 'AI Strategy Consulting',
    description: 'Trade business vertical, contractor/HVAC/plumbing targeting',
    status: 'paused',
    progress: 15,
    businessLine: 'municibid',
    tasksCount: 3,
    docsCount: 1,
    lastActivity: '2 weeks ago',
  },
];

const businessLineColors: Record<string, string> = {
  municibid: 'bg-blue-500',
  surplus_com: 'bg-green-500',
  surplus_ai: 'bg-purple-500',
  personal: 'bg-gray-500',
};

const businessLineLabels: Record<string, string> = {
  municibid: 'Municibid',
  surplus_com: 'Surplus.com',
  surplus_ai: 'Surplus.ai',
  personal: 'Personal',
};

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx('w-3 h-3 rounded-full', businessLineColors[project.businessLine])} />
          <span className="text-xs text-gray-500">{businessLineLabels[project.businessLine]}</span>
        </div>
        <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', statusStyles[project.status])}>
          {project.status}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.name}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-700">{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <CheckSquare className="w-4 h-4" />
          <span>{project.tasksCount} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{project.docsCount} docs</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
        Last activity: {project.lastActivity}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all' 
    ? mockProjects 
    : mockProjects.filter(p => p.businessLine === filter || p.status === filter);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Track progress across all initiatives</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'municibid', label: 'Municibid' },
          { id: 'surplus_com', label: 'Surplus.com' },
          { id: 'surplus_ai', label: 'Surplus.ai' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === f.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
