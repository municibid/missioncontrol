'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Clock, User, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: 'greg' | 'marty' | 'mara';
  priority: Priority;
  createdAt: string;
}

// Mock data - will be replaced with real API calls
const initialTasks: Task[] = [
  { id: '1', title: 'Build Mission Control Task Board', description: 'Create Kanban board with drag and drop', status: 'in_progress', assignee: 'marty', priority: 'high', createdAt: '2026-03-03' },
  { id: '2', title: 'Set up Neon database schema', description: 'Create tables for tasks, projects, memories', status: 'in_progress', assignee: 'marty', priority: 'high', createdAt: '2026-03-03' },
  { id: '3', title: 'Weekly SEO Report automation', description: 'Run Lighthouse checks every Monday', status: 'done', assignee: 'marty', priority: 'medium', createdAt: '2026-03-02' },
  { id: '4', title: 'Review Webflow migration options', description: 'Cloudflare Workers vs Azure Front Door', status: 'review', assignee: 'greg', priority: 'medium', createdAt: '2026-03-02' },
  { id: '5', title: 'MARA CRM - RFP module', description: 'Build RFP tracking and response system', status: 'backlog', assignee: 'marty', priority: 'high', createdAt: '2026-03-01' },
  { id: '6', title: 'Surplus.ai landing page', description: 'Design and build the launch page', status: 'backlog', assignee: 'marty', priority: 'medium', createdAt: '2026-03-01' },
];

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'review', title: 'Review', color: 'bg-yellow-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' },
];

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-200 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const assigneeAvatars: Record<string, { bg: string; letter: string }> = {
  greg: { bg: 'bg-indigo-500', letter: 'G' },
  marty: { bg: 'bg-gradient-to-br from-emerald-400 to-cyan-500', letter: 'M' },
  mara: { bg: 'bg-purple-500', letter: '💜' },
};

function TaskCard({ task }: { task: Task }) {
  const avatar = assigneeAvatars[task.assignee];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h3>
        <button className="text-gray-400 hover:text-gray-600 shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', priorityColors[task.priority])}>
            {task.priority}
          </span>
        </div>
        <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold', avatar.bg)}>
          {avatar.letter}
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { id: 1, agent: 'Marty', action: 'moved', target: 'Task Board', to: 'In Progress', time: '2m ago' },
    { id: 2, agent: 'Marty', action: 'created', target: 'Database Schema', time: '5m ago' },
    { id: 3, agent: 'Marty', action: 'completed', target: 'Weekly SEO Report', time: '1h ago' },
    { id: 4, agent: 'Marty', action: 'updated', target: 'Webflow Guide', time: '2h ago' },
  ];

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 className="font-semibold text-gray-900 mb-4">Activity Feed</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700">
                <span className="font-medium">{activity.agent}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
                {activity.to && <span> → {activity.to}</span>}
              </p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showNewTask, setShowNewTask] = useState(false);

  const getTasksByStatus = (status: TaskStatus) => 
    tasks.filter(task => task.status === status);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-500 mt-1">Manage tasks across all projects</p>
          </div>
          <button 
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex gap-6 p-6 overflow-x-auto">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 min-w-[280px] max-w-[350px]">
              <div className={clsx('rounded-xl p-4 h-full', column.color)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-700">{column.title}</h2>
                  <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus(column.id).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed Sidebar */}
        <ActivityFeed />
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-4">New Task</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Describe the task..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="marty">Marty</option>
                    <option value="greg">Greg</option>
                    <option value="mara">MARA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowNewTask(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
