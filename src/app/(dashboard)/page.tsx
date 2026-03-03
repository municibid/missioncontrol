'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, Calendar, FolderKanban, FileText, Activity, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface Stats {
  tasks: number;
  projects: number;
  documents: number;
}

interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  target: string;
  details: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ tasks: 0, projects: 0, documents: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, docsRes, activityRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects'),
        fetch('/api/documents'),
        fetch('/api/activity?limit=5'),
      ]);

      const tasks = await tasksRes.json();
      const projects = await projectsRes.json();
      const documents = await docsRes.json();
      const activityData = await activityRes.json();

      setStats({
        tasks: Array.isArray(tasks) ? tasks.filter((t: { status: string }) => t.status !== 'done').length : 0,
        projects: Array.isArray(projects) ? projects.filter((p: { status: string }) => p.status === 'active').length : 0,
        documents: Array.isArray(documents) ? documents.length : 0,
      });
      setActivity(Array.isArray(activityData) ? activityData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const statCards = [
    { name: 'Active Tasks', value: stats.tasks.toString(), change: 'In progress', icon: CheckSquare, href: '/tasks' },
    { name: 'Scheduled Jobs', value: '8', change: 'Cron jobs', icon: Calendar, href: '/calendar' },
    { name: 'Active Projects', value: stats.projects.toString(), change: 'In progress', icon: FolderKanban, href: '/projects' },
    { name: 'Documents', value: stats.documents.toString(), change: 'Total', icon: FileText, href: '/documents' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Marty Mission Control</h1>
        <button 
          onClick={fetchData}
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className={clsx('w-5 h-5', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-[#18181b] rounded-xl border border-[#27272a] p-6 hover:border-indigo-500/50 hover:bg-[#1f1f23] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{stat.change}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Activity className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="space-y-4">
            {activity.length === 0 ? (
              <p className="text-zinc-500 text-sm">No recent activity</p>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {item.agent?.[0]?.toUpperCase() || 'M'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300">
                      <span className="font-medium text-white">{item.agent}</span>
                      {' '}{item.action}{' '}
                      <span className="font-medium text-white">{item.target}</span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{formatTime(item.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Agent Status */}
        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Agent Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Online</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#0f0f13] rounded-lg border border-[#27272a]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-medium text-white">Marty Muncy</p>
                  <p className="text-xs text-zinc-500">Head of Agents</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-zinc-400">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  Last heartbeat: <span className="font-medium text-zinc-300">30 seconds ago</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/tasks?new=true"
                className="p-3 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
              >
                New Task
              </Link>
              <Link
                href="/documents"
                className="p-3 bg-[#27272a] text-zinc-300 rounded-lg text-sm font-medium text-center hover:bg-[#3f3f46] transition-colors"
              >
                View Documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
