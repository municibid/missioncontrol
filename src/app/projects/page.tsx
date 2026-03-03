'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckSquare, FileText, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  business_line: string;
  tasks_count: string;
  docs_count: string;
  updated_at: string;
}

const businessLineColors: Record<string, string> = {
  municibid: 'bg-blue-500',
  surplus_com: 'bg-green-500',
  surplus_ai: 'bg-purple-500',
  personal: 'bg-zinc-500',
};

const businessLineLabels: Record<string, string> = {
  municibid: 'Municibid',
  surplus_com: 'Surplus.com',
  surplus_ai: 'Surplus.ai',
  personal: 'Personal',
};

const statusStyles: Record<string, string> = {
  active: 'bg-green-900/50 text-green-300',
  paused: 'bg-yellow-900/50 text-yellow-300',
  completed: 'bg-zinc-800 text-zinc-400',
};

function ProjectCard({ project }: { project: Project }) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  return (
    <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6 hover:border-zinc-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx('w-3 h-3 rounded-full', businessLineColors[project.business_line] || 'bg-zinc-500')} />
          <span className="text-xs text-zinc-500">{businessLineLabels[project.business_line] || project.business_line}</span>
        </div>
        <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', statusStyles[project.status])}>
          {project.status}
        </span>
      </div>

      <h3 className="font-semibold text-white text-lg mb-2">{project.name}</h3>
      <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{project.description || 'No description'}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-zinc-500">Progress</span>
          <span className="font-medium text-zinc-300">{project.progress}%</span>
        </div>
        <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-1">
          <CheckSquare className="w-4 h-4" />
          <span>{project.tasks_count || 0} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{project.docs_count || 0} docs</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#27272a] text-xs text-zinc-600">
        Last activity: {formatTime(project.updated_at)}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.business_line === filter || p.status === filter);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-zinc-500 mt-1">Track progress across all initiatives</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchProjects}
            className="p-2 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={clsx('w-5 h-5', loading && 'animate-spin')} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
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
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:bg-[#27272a] hover:text-white'
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

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No projects found</p>
        </div>
      )}
    </div>
  );
}
