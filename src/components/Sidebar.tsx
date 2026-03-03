'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FolderKanban, 
  Brain, 
  FileText, 
  Users,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Task Board', href: '/tasks', icon: CheckSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Memory', href: '/memory', icon: Brain },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Team', href: '/team', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1a2e] text-[#e4e4e7] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#2a2a4e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Mission Control</h1>
            <p className="text-xs text-[#71717a]">OpenClaw Operations</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-[#0f3460] text-white' 
                  : 'text-[#a1a1aa] hover:bg-[#16213e] hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Agent Status */}
      <div className="px-4 py-4 border-t border-[#2a2a4e]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a2e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Marty</p>
            <p className="text-xs text-[#71717a]">Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
