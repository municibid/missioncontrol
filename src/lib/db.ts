import { neon } from '@neondatabase/serverless';

// Database connection - uses the same Neon instance as MARA CRM
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Task status types
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Assignee = 'greg' | 'marty' | 'mara' | 'unassigned';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee: Assignee;
  priority: Priority;
  project_id: string | null;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
}

export interface ActivityLog {
  id: string;
  task_id: string | null;
  agent: string;
  action: string;
  target: string;
  details: string | null;
  created_at: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  business_line: 'municibid' | 'surplus_com' | 'surplus_ai' | 'personal';
  created_at: Date;
  updated_at: Date;
}

export interface Memory {
  id: string;
  date: Date;
  content: string;
  type: 'daily' | 'long_term';
  tags: string[];
  project_id: string | null;
  created_at: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: 'prd' | 'architecture' | 'newsletter' | 'marketing' | 'research' | 'planning' | 'report' | 'other';
  format: 'markdown' | 'html' | 'text';
  project_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'idle' | 'offline';
  device: string | null;
  model: string | null;
  parent_id: string | null;
  created_at: Date;
}
