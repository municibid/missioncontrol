import { CheckSquare, Calendar, FolderKanban, FileText, Brain, Users, Activity, Clock } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { name: 'Active Tasks', value: '12', change: '+3 today', icon: CheckSquare, href: '/tasks' },
  { name: 'Scheduled Jobs', value: '8', change: 'Next: 2h', icon: Calendar, href: '/calendar' },
  { name: 'Projects', value: '5', change: '2 active', icon: FolderKanban, href: '/projects' },
  { name: 'Documents', value: '47', change: '+5 this week', icon: FileText, href: '/documents' },
];

const recentActivity = [
  { id: 1, action: 'Completed task', target: 'Weekly WFA Newsletter Draft', time: '2 min ago', agent: 'Marty' },
  { id: 2, action: 'Created document', target: 'Webflow Migration Guide', time: '15 min ago', agent: 'Marty' },
  { id: 3, action: 'Updated memory', target: 'Municibid Team Contacts', time: '1 hour ago', agent: 'Marty' },
  { id: 4, action: 'Scheduled cron', target: 'Weekly SEO Report', time: '2 hours ago', agent: 'Marty' },
  { id: 5, action: 'Completed task', target: 'WFA Monitor Check', time: '3 hours ago', agent: 'Marty' },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mission Control</h1>
        <p className="text-gray-500 mt-1">Municibid • Surplus.com • Surplus.ai Operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.change}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  M
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{item.agent}</span>
                    {' '}{item.action}{' '}
                    <span className="font-medium">{item.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Agent Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Agent Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-medium text-gray-900">Marty Muncy</p>
                  <p className="text-xs text-gray-500">Head of Agents</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Last heartbeat: <span className="font-medium">30 seconds ago</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/tasks?new=true"
                className="p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium text-center hover:bg-indigo-100 transition-colors"
              >
                New Task
              </Link>
              <Link
                href="/documents"
                className="p-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-100 transition-colors"
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
