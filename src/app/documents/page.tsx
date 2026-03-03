'use client';

import { useState } from 'react';
import { Search, FileText, Copy, Eye, Download, Filter, Plus } from 'lucide-react';
import { clsx } from 'clsx';

type DocCategory = 'prd' | 'architecture' | 'newsletter' | 'marketing' | 'research' | 'planning' | 'report' | 'other';

interface Document {
  id: string;
  title: string;
  category: DocCategory;
  format: 'markdown' | 'html' | 'text';
  preview: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Mission Control PRD',
    category: 'prd',
    format: 'markdown',
    preview: 'A custom-built, locally hosted Next.js dashboard that serves as the centralized command center for OpenClaw agent operations...',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03',
  },
  {
    id: '2',
    title: 'Webflow Subdirectory Setup Guide',
    category: 'architecture',
    format: 'markdown',
    preview: 'Instructions for serving Webflow pages at municibid.com/info/* using Cloudflare Workers or Azure Front Door...',
    createdAt: '2026-03-02',
    updatedAt: '2026-03-02',
  },
  {
    id: '3',
    title: 'WFA Newsletter - Feb 28',
    category: 'newsletter',
    format: 'markdown',
    preview: 'Featured Auctions: MacBook Pro M3, Jaws of Life Rescue Tools, John Deere Backhoe...',
    createdAt: '2026-02-26',
    updatedAt: '2026-02-26',
  },
  {
    id: '4',
    title: 'Weekly Security Report - Mar 2',
    category: 'report',
    format: 'markdown',
    preview: 'Security status: All clear. 0 failed SSH attempts. Gateway bound to localhost. 17 packages need updates...',
    createdAt: '2026-03-02',
    updatedAt: '2026-03-02',
  },
  {
    id: '5',
    title: 'MARA CRM Architecture',
    category: 'architecture',
    format: 'markdown',
    preview: 'MARA is a CRM agent for Municibid seller support built on OpenClaw. Database: Neon PostgreSQL...',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-20',
  },
  {
    id: '6',
    title: 'Surplus.ai Launch Plan',
    category: 'planning',
    format: 'markdown',
    preview: 'Phase 1: Landing page and waitlist. Phase 2: MVP marketplace. Phase 3: Agent ecosystem...',
    createdAt: '2026-02-10',
    updatedAt: '2026-02-18',
  },
];

const categoryColors: Record<DocCategory, string> = {
  prd: 'bg-purple-100 text-purple-700',
  architecture: 'bg-blue-100 text-blue-700',
  newsletter: 'bg-green-100 text-green-700',
  marketing: 'bg-pink-100 text-pink-700',
  research: 'bg-yellow-100 text-yellow-700',
  planning: 'bg-orange-100 text-orange-700',
  report: 'bg-gray-100 text-gray-700',
  other: 'bg-gray-100 text-gray-700',
};

const categoryLabels: Record<DocCategory, string> = {
  prd: 'PRD',
  architecture: 'Architecture',
  newsletter: 'Newsletter',
  marketing: 'Marketing',
  research: 'Research',
  planning: 'Planning',
  report: 'Report',
  other: 'Other',
};

function DocumentCard({ doc }: { doc: Document }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // In real app, would copy full document content
    navigator.clipboard.writeText(doc.preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', categoryColors[doc.category])}>
            {categoryLabels[doc.category]}
          </span>
        </div>
        <span className="text-xs text-gray-400">{doc.format}</span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{doc.preview}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(doc.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className={clsx('w-4 h-4', copied ? 'text-green-500' : 'text-gray-400')} />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'all'>('all');

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                         doc.preview.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Hub</h1>
          <p className="text-gray-500 mt-1">All agent-generated documents in one place</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DocCategory | 'all')}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No documents found</p>
        </div>
      )}
    </div>
  );
}
