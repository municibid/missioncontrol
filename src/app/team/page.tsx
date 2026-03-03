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
  active: { dot: 'bg-green-500', text: 'text-green-400' },
  idle: { dot: 'bg-yellow-500', text: 'text-yellow-400' },
  offline: { dot: 'bg-zinc-500', text: 'text-zinc-500' },
};

function AgentCard({ agent, isSubAgent = false }: { agent: Agent; isSubAgent?: boolean }) {
  const status = statusStyles[agent.status];

  return (
    <div className={clsx(
      'bg-[#18181b] rounded-xl border border-[#27272a] p-6',
      isSubAgent && 'ml-12 relative before:absolute before:left-[-24px] before:top-1/2 before:w-6 before:h-px before:bg-[#27272a]'
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
            'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#18181b]',
            status.dot
          )} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
              <p className="text-sm text-zinc-500">{agent.role}</p>
            </div>
            <span className={clsx('text-sm font-medium capitalize', status.text)}>
              {agent.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <Cpu className="w-4 h-4" />
              <span className="truncate">{agent.device}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Wifi className="w-4 h-4" />
              <span>{agent.model}</span>
            </div>
          </div>

          {agent.lastSeen && (
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
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
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-sm font-medium uppercase tracking-wider opacity-80 mb-2">Mission Statement</h2>
        <p className="text-xl font-medium leading-relaxed">{missionStatement}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-zinc-500 mt-1">Agent organization and status</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-zinc-400">{agents.filter(a => a.status === 'active').length} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-zinc-400">{agents.filter(a => a.status === 'idle').length} Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-500" />
            <span className="text-zinc-400">{agents.filter(a => a.status === 'offline').length} Offline</span>
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
