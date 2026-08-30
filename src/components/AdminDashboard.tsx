import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Trash2,
  Check,
  LogOut,
  RefreshCw,
  Search,
  Database,
  Copy,
  CheckCircle2,
  Inbox,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ExternalLink,
  User,
  Shield,
  X
} from 'lucide-react';
import {
  fetchContactRequests,
  updateRequestStatus,
  deleteRequest,
  signInWithCredentials
} from '../supabase';
import type { ContactRequest, PortfolioUser } from '../supabase';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  // Auth state
  const [user, setUser] = useState<PortfolioUser | null>(() => {
    const username = localStorage.getItem('admin_username');
    const role = localStorage.getItem('admin_role') as 'admin' | 'guest' | null;
    if (username && role) {
      return { username, role };
    }
    return null;
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data state
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Copied SQL toast state
  const [copiedSql, setCopiedSql] = useState(false);

  // Selected request for details modal
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  const SQL_SCRIPT = `-- Create the contact requests table
create table if not exists contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for contact_requests
alter table contact_requests enable row level security;

-- Drop policies if they already exist (to avoid rerun errors)
drop policy if exists "Allow anonymous inserts" on contact_requests;
drop policy if exists "Allow all access to service_role" on contact_requests;

-- Create policy to allow anyone to insert messages
create policy "Allow anonymous inserts" on contact_requests
  for insert with check (true);

-- Create policy to allow all actions for the service role
create policy "Allow all access to service_role" on contact_requests
  for all using (true) with check (true);

-- Create the users login credentials table
create table if not exists portfolio_users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  password text not null,
  role text default 'guest'::text not null check (role in ('admin', 'guest')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for portfolio_users
alter table portfolio_users enable row level security;

-- Drop policies if they already exist (to avoid rerun errors)
drop policy if exists "Allow all access to service_role" on portfolio_users;

-- Create policy to allow all actions for the service role
create policy "Allow all access to service_role" on portfolio_users
  for all using (true) with check (true);

-- Insert default accounts (username / password / role)
insert into portfolio_users (username, password, role)
values 
  ('admin', 'admin123', 'admin'),
  ('guest', 'guest123', 'guest')
on conflict (username) do nothing;`;

  // Fetch requests on user change
  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);
    setTableMissing(false);

    const res = await fetchContactRequests();
    if (res.success && res.data) {
      setRequests(res.data);
    } else {
      if (res.tableMissing) {
        setTableMissing(true);
      } else {
        setError(res.error || 'Failed to load requests.');
      }
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const res = await signInWithCredentials(username, password);
    if (res.success && res.user) {
      localStorage.setItem('admin_username', res.user.username);
      localStorage.setItem('admin_role', res.user.role);
      setUser(res.user);
    } else {
      if (res.tableMissing) {
        setTableMissing(true);
      } else {
        setLoginError(res.error || 'Invalid credentials or login failed.');
      }
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_role');
    setUser(null);
    setRequests([]);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'read' | 'unread') => {
    if (user?.role !== 'admin') {
      alert('Access Denied: Only Admins can modify requests.');
      return;
    }
    setActionLoadingId(id);
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    const res = await updateRequestStatus(id, newStatus);
    
    if (res.success) {
      setRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } else {
      alert(res.error || 'Failed to update request status.');
    }
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('Access Denied: Only Admins can delete requests.');
      return;
    }
    setActionLoadingId(id);
    const res = await deleteRequest(id);
    
    if (res.success) {
      setRequests(prev => prev.filter(req => req.id !== id));
      setDeleteConfirmId(null);
    } else {
      alert(res.error || 'Failed to delete request.');
    }
    setActionLoadingId(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.subject && req.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalCount = requests.length;
  const unreadCount = requests.filter(r => r.status === 'unread').length;
  const readCount = requests.filter(r => r.status === 'read').length;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateCompact = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return dateStr;
    }
  };

  // ==========================================
  // RENDER LOGIN SCREEN
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0F1524]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center mt-4 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-3 shadow-lg shadow-indigo-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Credentials Authentication</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in as Admin or Guest</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Enter username (e.g. admin, guest)"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#090D16]/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#090D16]/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Create credential rows (role: admin/guest) in the custom database table `portfolio_users`.
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER TABLE MISSING / SQL SETUP FALLBACK
  // ==========================================
  if (tableMissing) {
    return (
      <div className="min-h-screen bg-[#090D16] p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Database Configuration Required</h1>
                <p className="text-xs text-slate-400">Step needed to persist requests</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-white/5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <div className="bg-[#0F1524] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex gap-4 items-start mb-6">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Missing Table: `contact_requests`</h2>
                <p className="text-sm text-slate-400 mt-1">
                  The admin panel authenticated successfully, but the table `contact_requests` was not found in your Supabase database. You must create this table before visitors can send messages.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <span>How to create the table:</span>
                </h3>
                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2 pl-1 bg-[#090D16] p-4 rounded-xl border border-white/5">
                  <li>Log in to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">Supabase Dashboard <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Select your project: <strong className="text-slate-300">eqrduggxpxfjtkzmoqgm</strong></li>
                  <li>Click on the <strong className="text-slate-300">SQL Editor</strong> icon in the left navigation sidebar.</li>
                  <li>Create a new query, paste the SQL script below, and click <strong className="text-emerald-400">Run</strong>.</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center bg-[#090D16] px-4 py-2 border-t border-x border-white/10 rounded-t-xl">
                  <span className="text-xs font-mono text-indigo-400">schema.sql</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded transition-colors cursor-pointer border border-white/5"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-[#05070d] text-slate-300 font-mono text-xs overflow-x-auto border-b border-x border-white/10 rounded-b-xl max-h-72 leading-relaxed">
                  {SQL_SCRIPT}
                </pre>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => loadRequests(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Table Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER MAIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#090D16] p-4 md:p-8">
      {/* Background glow ornaments */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors border border-white/5 mr-1 cursor-pointer"
              title="Return to Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={onClose}
                  className="logo text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-0.5"
                  title="Return to Portfolio"
                >
                  <span className="logo-accent">&lt;</span>Jivan<span className="logo-highlight">Warankar</span><span className="logo-accent"> /&gt;</span>
                </button>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                  user?.role === 'admin'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {user?.role === 'admin' ? (
                    <>
                      <Shield className="w-3 h-3 text-indigo-400" />
                      <span>Admin Mode</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-amber-400" />
                      <span>Guest (Read-Only)</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Logged in as <strong className="text-slate-200">{user?.username}</strong> • Review and manage user submissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => loadRequests(true)}
              disabled={loading || refreshing}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all border border-white/5 cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all border border-white/5 cursor-pointer"
            >
              Exit View
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-rose-500/20 hover:to-rose-500/15 border border-indigo-500/20 hover:border-rose-500/35 text-slate-300 hover:text-rose-400 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* Guest Read-Only Notice Banner */}
        {user?.role === 'guest' && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-amber-400 text-xs flex gap-3 items-center shadow-lg shadow-amber-500/[0.01]">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <div>
              <h5 className="font-semibold text-white">Guest View Mode (Read-Only)</h5>
              <p className="text-slate-400 mt-0.5">You have read-only access to inquiries. Modifying request status or deleting messages is restricted to Admin accounts.</p>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#0F1524]/60 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</p>
                <h3 className="text-3xl font-extrabold text-white mt-1.5">{totalCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/10">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500/5 to-indigo-500/20"></div>
          </div>

          <div className="bg-[#0F1524]/60 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unread Messages</p>
                <h3 className="text-3xl font-extrabold text-white mt-1.5 flex items-center gap-2">
                  <span>{unreadCount}</span>
                  {unreadCount > 0 && (
                    <span className="inline-flex w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/10">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/5 to-amber-500/20"></div>
          </div>

          <div className="bg-[#0F1524]/60 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reviewed Messages</p>
                <h3 className="text-3xl font-extrabold text-white mt-1.5">{readCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/5 to-emerald-500/20"></div>
          </div>
        </section>

        {/* Filters and List */}
        <div className="bg-[#0F1524]/40 border border-white/10 rounded-2xl p-6 shadow-xl">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 pb-6 border-b border-white/5">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#090D16]/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 text-sm transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#090D16]/90 p-1 rounded-xl border border-white/15 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter('unread')}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'unread'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setStatusFilter('read')}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'read'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Reviewed ({readCount})
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main List Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-slate-400 text-sm mt-3">Loading contact requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-white font-medium text-base">No requests found</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-xs">
                {searchQuery
                  ? 'Try clearing your search query or choosing a different filter.'
                  : 'You do not have any inquiries registered in this status.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRequests.map(req => {
                const isItemActionLoading = actionLoadingId === req.id;
                const showDeleteConfirm = deleteConfirmId === req.id;

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-all duration-200 bg-[#0F1524]/50 hover:bg-[#0F1524]/80 cursor-pointer ${
                      req.status === 'unread'
                        ? 'border-indigo-500/15 hover:border-indigo-500/35'
                        : 'border-white/5 hover:border-white/10 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Left: Status dot & Date */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          req.status === 'unread' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'
                        }`}
                        title={req.status === 'unread' ? 'Unread message' : 'Reviewed message'}
                      />
                      <span className="text-slate-400 text-xs font-mono w-28 flex-shrink-0">
                        {formatDateCompact(req.created_at)}
                      </span>
                    </div>

                    {/* Sender Name & Email */}
                    <div className="w-44 flex-shrink-0 truncate text-left">
                      <span className="text-xs font-semibold text-white block truncate">{req.name}</span>
                      <span className="text-slate-500 text-[10px] block font-mono truncate">{req.email}</span>
                    </div>

                    {/* Subject & snippet message */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs text-slate-300 truncate">
                        {req.subject ? (
                          <strong className="text-slate-200 font-semibold">{req.subject}</strong>
                        ) : (
                          <span className="text-slate-500 italic">No Subject</span>
                        )}
                        <span className="text-slate-500 mx-2">—</span>
                        <span className="text-slate-400">{req.message}</span>
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleStatus(req.id, req.status)}
                        disabled={isItemActionLoading || user?.role !== 'admin'}
                        className={`p-1.5 rounded-lg border transition-all ${
                          user?.role !== 'admin'
                            ? 'bg-transparent text-slate-700 border-transparent cursor-not-allowed opacity-30'
                            : req.status === 'unread'
                            ? 'bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 border-emerald-500/10 cursor-pointer'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10 cursor-pointer'
                        }`}
                        title={user?.role !== 'admin' ? 'Action restricted to Admin' : req.status === 'unread' ? 'Mark Reviewed' : 'Mark Unread'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={`mailto:${req.email}?subject=RE: ${encodeURIComponent(req.subject || 'Portfolio Query')}`}
                        className="p-1.5 bg-[#090D16] border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/35 rounded-lg transition-colors cursor-pointer"
                        title="Reply via Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>

                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-1 bg-rose-950/20 border border-rose-500/25 p-1 rounded-lg">
                          <button
                            onClick={() => handleDelete(req.id)}
                            disabled={isItemActionLoading}
                            className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold rounded cursor-pointer disabled:opacity-50"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-0.5 bg-white/5 hover:bg-white/10 text-slate-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(req.id)}
                          disabled={isItemActionLoading || user?.role !== 'admin'}
                          className={`p-1.5 rounded-lg transition-all ${
                            user?.role !== 'admin'
                              ? 'text-slate-700 cursor-not-allowed border border-transparent opacity-30'
                              : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 cursor-pointer'
                          }`}
                          title={user?.role !== 'admin' ? 'Action restricted to Admin' : 'Delete Request'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Request Details Modal Popup */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-[#090D16]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0F1524] border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-white/5 pb-4 mb-4">
              <div className="flex justify-between items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                  selectedRequest.status === 'unread'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {selectedRequest.status}
                </span>
                <span className="text-slate-400 text-xs font-mono">{formatDate(selectedRequest.created_at)}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2">{selectedRequest.name}</h3>
              <a href={`mailto:${selectedRequest.email}`} className="text-xs text-indigo-400 hover:underline">{selectedRequest.email}</a>
            </div>
            
            <div className="space-y-4">
              {selectedRequest.subject && (
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subject</h4>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedRequest.subject}</p>
                </div>
              )}
              <div>
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Message</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#090D16]/60 p-4 rounded-xl border border-white/5 mt-1 max-h-60 overflow-y-auto font-sans">
                  {selectedRequest.message}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleToggleStatus(selectedRequest.id, selectedRequest.status);
                    setSelectedRequest(prev => prev ? { ...prev, status: prev.status === 'read' ? 'unread' : 'read' } : null);
                  }}
                  disabled={user?.role !== 'admin'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    user?.role !== 'admin'
                      ? 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed opacity-40'
                      : selectedRequest.status === 'unread'
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedRequest.status === 'unread' ? 'Mark Reviewed' : 'Mark Unread'}</span>
                </button>
                <a
                  href={`mailto:${selectedRequest.email}?subject=RE: ${encodeURIComponent(selectedRequest.subject || 'Portfolio Query')}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090D16] border border-white/10 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/35 rounded-lg transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </a>
              </div>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this message?')) {
                    handleDelete(selectedRequest.id);
                    setSelectedRequest(null);
                  }
                }}
                disabled={user?.role !== 'admin'}
                className={`p-2 rounded-lg transition-all ${
                  user?.role !== 'admin'
                    ? 'text-slate-700 cursor-not-allowed opacity-40'
                    : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 cursor-pointer'
                }`}
                title="Delete Message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }
