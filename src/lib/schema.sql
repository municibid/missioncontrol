-- Mission Control Database Schema
-- Run this against your Neon PostgreSQL database

-- Tasks table (Task Board)
CREATE TABLE IF NOT EXISTS mc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
  assignee VARCHAR(50) NOT NULL DEFAULT 'unassigned' CHECK (assignee IN ('greg', 'marty', 'mara', 'unassigned')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id UUID REFERENCES mc_projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Activity log (for the live feed)
CREATE TABLE IF NOT EXISTS mc_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES mc_tasks(id) ON DELETE SET NULL,
  agent VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS mc_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  business_line VARCHAR(50) NOT NULL DEFAULT 'municibid' CHECK (business_line IN ('municibid', 'surplus_com', 'surplus_ai', 'personal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Memories table
CREATE TABLE IF NOT EXISTS mc_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'daily' CHECK (type IN ('daily', 'long_term')),
  tags TEXT[] DEFAULT '{}',
  project_id UUID REFERENCES mc_projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS mc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'other' CHECK (category IN ('prd', 'architecture', 'newsletter', 'marketing', 'research', 'planning', 'report', 'other')),
  format VARCHAR(20) NOT NULL DEFAULT 'markdown' CHECK (format IN ('markdown', 'html', 'text')),
  project_id UUID REFERENCES mc_projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agents table (Team org chart)
CREATE TABLE IF NOT EXISTS mc_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  avatar VARCHAR(10) NOT NULL DEFAULT 'M',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'idle', 'offline')),
  device VARCHAR(100),
  model VARCHAR(100),
  parent_id UUID REFERENCES mc_agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scheduled jobs table (for Calendar)
CREATE TABLE IF NOT EXISTS mc_scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cron_expr VARCHAR(100),
  schedule_time TIMESTAMPTZ,
  recurrence VARCHAR(50),
  agent VARCHAR(50) NOT NULL,
  business_line VARCHAR(50) NOT NULL DEFAULT 'municibid',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'disabled')),
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Execution history for scheduled jobs
CREATE TABLE IF NOT EXISTS mc_job_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES mc_scheduled_jobs(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  output TEXT,
  error TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON mc_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON mc_tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_activity_created ON mc_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_date ON mc_memories(date DESC);
CREATE INDEX IF NOT EXISTS idx_documents_category ON mc_documents(category);
CREATE INDEX IF NOT EXISTS idx_jobs_next_run ON mc_scheduled_jobs(next_run_at);

-- Seed initial projects
INSERT INTO mc_projects (name, description, status, progress, business_line) VALUES
  ('MARA CRM Development', 'RFP module, intelligence engine, outreach platform, sales enablement', 'active', 35, 'municibid'),
  ('Surplus.com 2.0', 'Vercel + Neon Postgres migration, government surplus meta-search', 'active', 20, 'surplus_com'),
  ('Surplus.ai Platform', 'AI-agent-driven marketplace, Command Line Marketplace concept', 'active', 10, 'surplus_ai'),
  ('Municibid 20th Anniversary', '20 Days of Municibid campaign, prize structures, marketing automation', 'active', 5, 'municibid'),
  ('AI Strategy Consulting', 'Trade business vertical, contractor/HVAC/plumbing targeting', 'paused', 15, 'municibid')
ON CONFLICT DO NOTHING;

-- Seed agents
INSERT INTO mc_agents (name, role, avatar, status, device, model) VALUES
  ('Marty Muncy', 'Head of Agents', 'M', 'active', 'AWS EC2', 'claude-opus-4-5'),
  ('MARA', 'CRM Agent', '💜', 'active', 'AWS EC2', 'claude-sonnet-4')
ON CONFLICT DO NOTHING;
