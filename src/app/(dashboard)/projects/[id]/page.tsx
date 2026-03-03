'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckSquare, CheckCircle2, FileText, Calendar, TrendingUp, Edit2, Trash2, Clock } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  business_line: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  completed_at: string | null;
  project_id: string;
}

interface Document {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: '', progress: 0 });

  useEffect(() => {
    if (params.id) {
      fetchProject();
      fetchTasks();
      fetchDocuments();
    }
  }, [params.id]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setEditForm({
          name: data.name,
          description: data.description || '',
          status: data.status,
          progress: data.progress
        });
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.filter((t: Task & { project_id: string }) => t.project_id === params.id));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.filter((d: Document & { project_id: string }) => d.project_id === params.id));
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  }

  async function handleSave() {
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setProject(updated);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-zinc-800 rounded w-2/3 mb-8"></div>
          <div className="h-32 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <p className="text-zinc-400">Project not found</p>
        <Link href="/projects" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Back button */}
      <Link 
        href="/projects" 
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6 mb-6">
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-4 py-2 text-white text-xl font-semibold focus:outline-none focus:border-indigo-500"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={3}
              className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-4 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500"
              placeholder="Project description..."
            />
            <div className="flex gap-4">
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-sm">Progress:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.progress}
                  onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-zinc-400 text-sm">%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                <p className="text-zinc-400">{project.description || 'No description'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-[#1f1f23] rounded-lg transition-colors"
                  title="Edit project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <span className="text-zinc-500 text-sm">
                {project.business_line?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-400">Progress</span>
                <span className="text-white font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 bg-[#1f1f23] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-zinc-500 mt-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Updated {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* What's Been Done - Completed Tasks */}
      {tasks.filter(t => t.status === 'done').length > 0 && (
        <div className="bg-[#12121a] border border-emerald-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">What's Been Done</h2>
            <span className="text-emerald-400 text-sm">({tasks.filter(t => t.status === 'done').length} completed)</span>
          </div>
          
          <div className="space-y-2">
            {tasks
              .filter(t => t.status === 'done')
              .sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())
              .map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-300">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    {task.assignee && (
                      <span>{task.assignee}</span>
                    )}
                    {task.completed_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Active Tasks */}
      <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Active Tasks</h2>
          <span className="text-zinc-500 text-sm">({tasks.filter(t => t.status !== 'done').length})</span>
        </div>
        
        {tasks.filter(t => t.status !== 'done').length === 0 ? (
          <p className="text-zinc-500 text-sm">No active tasks. All caught up! 🎉</p>
        ) : (
          <div className="space-y-2">
            {tasks
              .filter(t => t.status !== 'done')
              .map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-[#1a1a24] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      task.status === 'in_progress' ? 'bg-amber-400' : 'bg-zinc-500'
                    }`} />
                    <span className="text-white">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      task.status === 'in_progress' 
                        ? 'bg-amber-500/10 text-amber-400' 
                        : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {task.status === 'in_progress' ? 'In Progress' : 'Backlog'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <span className="text-zinc-500 text-sm">{task.assignee}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <span className="text-zinc-500 text-sm">({documents.length})</span>
        </div>
        
        {documents.length === 0 ? (
          <p className="text-zinc-500 text-sm">No documents linked to this project yet.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 bg-[#1a1a24] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span className="text-white">{doc.title}</span>
                </div>
                <span className="text-zinc-500 text-sm">{doc.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
