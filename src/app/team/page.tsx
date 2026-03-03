'use client';

import { Users, Cpu, Wifi, WifiOff, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarBg: string;
  status: 'active' | 'idle' | 'offline';
  device: string;
  model: string;
  lastSeen?: string;
  parentId?: string;
}

const agents: Agent[] = [
  {
    id: '1',
    name: 'Marty Muncy',
    role: 'Head of Agents',
    avatar: 'M',
    avatarBg: 'bg-gradient-to-br from-emerald-400 to-cyan-500',
    status: 'active',
    device: 'AWS EC2 (ip-172-31-5-119)',
    model: 'claude-opus-4-5',
    lastSeen: 'now',
  },
  {
    id: '2',
    name: 'MARA',
    role: 'CRM Agent',
    avatar: '💜',
    avatarBg: 'bg-purple-500',
    status: 'active',
    device: 'AWS EC2',
    model: 'claude-sonnet-4',
    lastSeen: '5 min ago',
    parentId: '1',
  },
];

const missionStatement = `Build and operate an autonomous AI-powered organization that grows Municibid, launches Surplus.com and Surplus.ai, and produces measurable value 24/7.`;

const statusStyles: Record<string, { dot: string; text: string }> = {
  active: { dot: 'bg-green-500', text: 'text-green-600' },
  idle: { dot: 'bg-yellow-500', text: 'text-yellow-600' },
  offline: { dot: 'bg-gray-400', text: 'text-gray-500' },
};

function AgentCard({ agent, isSubAgent = false }: { agent: Agent; isSubAgent?: boolean }) {
  const status = statusStyles[agent.status];

  return (
    <div className={clsx(
      'bg-white rounded-xl border border-gray-200 p-6',
      isSubAgent && 'ml-12 relative before:absolute before:left-[-24px] before:top-1/2 before:w-6 before:h-px before:bg-gray-200'
    )}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className={clsx(
            'w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold',
            agent.avatarBg
          )}>
            {agent.avatar}
          </div>
          <div className={clsx(
            'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
            status.dot
          )} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.role}</p>
            </div>
            <span className={clsx('text-sm font-medium capitalize', status.text)}>
              {agent.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Cpu className="w-4 h-4" />
              <span className="truncate">{agent.device}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Wifi className="w-4 h-4" />
              <span>{agent.model}</span>
            </div>
          </div>

          {agent.lastSeen && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              Last seen: {agent.lastSeen}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const primaryAgents = agents.filter(a => !a.parentId);
  const subAgents = agents.filter(a => a.parentId);

  return (
    <div className="p-8">
      {/* Mission Statement */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-sm font-medium uppercase tracking-wider opacity-80 mb-2">Mission Statement</h2>
        <p className="text-xl font-medium leading-relaxed">{missionStatement}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">Agent organization and status</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">{agents.filter(a => a.status === 'active').length} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-600">{agents.filter(a => a.status === 'idle').length} Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-600">{agents.filter(a => a.status === 'offline').length} Offline</span>
          </div>
        </div>
      </div>

      {/* Org Chart */}
      <div className="space-y-4">
        {primaryAgents.map((agent) => (
          <div key={agent.id}>
            <AgentCard agent={agent} />
            {subAgents
              .filter(sub => sub.parentId === agent.id)
              .map(sub => (
                <AgentCard key={sub.id} agent={sub} isSubAgent />
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}
