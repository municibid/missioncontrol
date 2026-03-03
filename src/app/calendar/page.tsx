'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Pause, Play } from 'lucide-react';
import { clsx } from 'clsx';

interface ScheduledJob {
  id: string;
  name: string;
  time: string;
  date: string;
  recurrence: string;
  agent: string;
  businessLine: 'municibid' | 'surplus_com' | 'surplus_ai' | 'personal';
  status: 'pending' | 'running' | 'completed' | 'failed';
  enabled: boolean;
}

const mockJobs: ScheduledJob[] = [
  { id: '1', name: 'Weekly SEO Report', time: '08:00', date: '2026-03-09', recurrence: 'Every Monday', agent: 'Marty', businessLine: 'municibid', status: 'pending', enabled: true },
  { id: '2', name: 'WFA Newsletter Picks', time: '21:00', date: '2026-03-05', recurrence: 'Every Wednesday', agent: 'Marty', businessLine: 'municibid', status: 'pending', enabled: true },
  { id: '3', name: 'Weekly Security Report', time: '08:00', date: '2026-03-09', recurrence: 'Every Monday', agent: 'Marty', businessLine: 'personal', status: 'pending', enabled: true },
  { id: '4', name: 'WFA Monitor Check', time: '08:00', date: '2026-03-09', recurrence: 'Every Monday', agent: 'Marty', businessLine: 'municibid', status: 'pending', enabled: true },
  { id: '5', name: 'Daily Security Scan', time: '08:00', date: '2026-03-03', recurrence: 'Daily', agent: 'Marty', businessLine: 'personal', status: 'completed', enabled: true },
  { id: '6', name: 'Airbyte Sync Check', time: '18:30', date: '2026-02-12', recurrence: 'One-time', agent: 'Marty', businessLine: 'municibid', status: 'completed', enabled: false },
];

const businessLineColors: Record<string, string> = {
  municibid: 'bg-blue-100 text-blue-700 border-blue-200',
  surplus_com: 'bg-green-100 text-green-700 border-green-200',
  surplus_ai: 'bg-purple-100 text-purple-700 border-purple-200',
  personal: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-gray-400" />,
  running: <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  failed: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-03'));
  
  // Generate days for the week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + i);
    return date;
  });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500 mt-1">Scheduled jobs and automations</p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-medium text-gray-900 min-w-[200px] text-center">
                March 2026
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Week View */}
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dateStr = formatDate(day);
              const dayJobs = mockJobs.filter(j => j.date === dateStr);
              const isToday = dateStr === '2026-03-03';
              
              return (
                <div key={dateStr} className="min-h-[400px]">
                  <div className={clsx(
                    'text-center pb-3 mb-3 border-b',
                    isToday ? 'border-indigo-300' : 'border-gray-200'
                  )}>
                    <p className="text-xs text-gray-500 uppercase">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={clsx(
                      'text-lg font-semibold mt-1',
                      isToday ? 'text-indigo-600' : 'text-gray-900'
                    )}>
                      {day.getDate()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {dayJobs.map((job) => (
                      <div
                        key={job.id}
                        className={clsx(
                          'p-2 rounded-lg border text-xs',
                          businessLineColors[job.businessLine],
                          !job.enabled && 'opacity-50'
                        )}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {statusIcons[job.status]}
                          <span className="font-medium truncate">{job.name}</span>
                        </div>
                        <p className="text-[10px] opacity-75">{job.time} • {job.agent}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Registry Sidebar */}
        <div className="w-96 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <h2 className="font-semibold text-gray-900 mb-4">Cron Job Registry</h2>
          <div className="space-y-3">
            {mockJobs.filter(j => j.enabled).map((job) => (
              <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {statusIcons[job.status]}
                      <h3 className="font-medium text-gray-900 text-sm truncate">{job.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{job.recurrence} at {job.time}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Agent: {job.agent}</p>
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    {job.enabled ? (
                      <Pause className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="mt-2">
                  <span className={clsx(
                    'inline-block px-2 py-0.5 rounded text-[10px] font-medium',
                    businessLineColors[job.businessLine]
                  )}>
                    {job.businessLine.replace('_', '.')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
