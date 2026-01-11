import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Server as ServerIcon, 
  Users as UsersIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  ShieldAlert,
  Search,
  Settings,
  ArrowRight,
  Zap,
  Loader2,
  Globe,
  Download,
  Filter,
  Eye,
  X,
  Coins,
  TrendingUp,
  Briefcase,
  Star,
  Activity,
  History,
  LayoutDashboard,
  ShieldCheck,
  MoreHorizontal,
  // Added missing Terminal and ArrowUpRight icons
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { db } from '../services/mockDb';
import { discoverServers, parseAiResponseToServers } from '../services/aiService';
import { Server, User, UserRole, ServerStatus, Investment, Transaction } from '../types';

interface AdminDashboardProps {
  user: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If not admin, redirect to admin login
  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row text-slate-300 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Sidebar Overlay for Mobile */}
      <aside className="lg:w-72 bg-[#0a0a0c] border-r border-white/5 flex-shrink-0 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 text-cyan-500 mb-10 group">
             <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
                <ShieldAlert className="w-6 h-6" />
             </div>
             <div>
                <p className="text-lg font-black tracking-tighter text-white uppercase italic">Vault OS</p>
                <p className="text-[8px] font-black text-cyan-500/50 uppercase tracking-[2px]">Admin Console</p>
             </div>
          </Link>

          <nav className="space-y-1.5">
            <NavLink to="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" end />
            <NavLink to="/admin/servers" icon={<ServerIcon className="w-4 h-4" />} label="Servers Base" />
            <NavLink to="/admin/investments" icon={<TrendingUp className="w-4 h-4" />} label="Global Market" />
            <NavLink to="/admin/users" icon={<UsersIcon className="w-4 h-4" />} label="Accounts" />
            <NavLink to="/admin/scanner" icon={<Zap className="w-4 h-4" />} label="AI Discovery" highlight />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5 bg-white/[0.01]">
           <div className="flex items-center gap-3">
              <img src={user.avatarUrl} className="w-10 h-10 rounded-xl border border-white/10" alt="" />
              <div className="min-w-0">
                 <p className="text-sm font-black text-white truncate italic">{user.name}</p>
                 <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Master Key</p>
              </div>
           </div>
           <button onClick={() => { db.setCurrentUser(null); window.location.href = '#/'; }} className="w-full mt-6 py-3 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Terminate Session
           </button>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-12 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/servers" element={<AdminServers />} />
          <Route path="/investments" element={<AdminInvestments />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/scanner" element={<AdminScanner />} />
        </Routes>
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, label, highlight = false, end = false }: { to: string, icon: any, label: string, highlight?: boolean, end?: boolean }) => {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
  
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
      isActive 
        ? 'text-white bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
        : highlight 
          ? 'text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20' 
          : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}>
      <span className={isActive ? 'text-cyan-500' : ''}>{icon}</span> {label}
    </Link>
  );
};

/* --- SUB-PAGES --- */

const AdminHome: React.FC = () => {
  const servers = db.getServers();
  const users = db.getUsers();
  const investments = db.getInvestments();
  
  const totalTokens = users.reduce((a, b) => a + b.tokens, 0);
  const totalInvested = investments.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">System Overview</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mt-1">Live Environment Statistics</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="Total Servers" value={servers.length} icon={<ServerIcon className="w-5 h-5" />} color="text-indigo-500" />
         <StatCard label="Active Accounts" value={users.length} icon={<UsersIcon className="w-5 h-5" />} color="text-cyan-500" />
         <StatCard label="Tokens in Flow" value={totalTokens} sub="VT" icon={<Coins className="w-5 h-5" />} color="text-amber-500" />
         <StatCard label="Invested Pool" value={totalInvested} sub="VT" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#0d0d0f] border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-3">
               <History className="w-4 h-4 text-cyan-500" /> Recent Activity
            </h3>
            <div className="space-y-4">
               {investments.slice(-5).reverse().map(inv => (
                 <div key={inv.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                          <TrendingUp className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white italic uppercase">{inv.serverTitle}</p>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Investment</p>
                       </div>
                    </div>
                    <p className="text-sm font-black text-emerald-400">+{inv.amount} VT</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#0d0d0f] border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-3">
               <Star className="w-4 h-4 text-amber-500" /> High Performance
            </h3>
            <div className="space-y-4">
               {servers.sort((a, b) => b.currentPlayers - a.currentPlayers).slice(0, 5).map(s => (
                 <div key={s.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                       <img src={s.iconUrl} className="w-10 h-10 rounded-xl" alt="" />
                       <div>
                          <p className="text-xs font-black text-white italic uppercase">{s.title}</p>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{s.currentPlayers} Online</p>
                       </div>
                    </div>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className={`w-1 h-3 rounded-full ${i <= s.investmentTier ? 'bg-amber-500' : 'bg-white/5'}`}></div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon, color }: { label: string, value: number, sub?: string, icon: any, color: string }) => (
  <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[32px] shadow-2xl group hover:border-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
       <div className={`p-3 bg-white/5 rounded-xl ${color}`}>
          {icon}
       </div>
       <div className="p-1 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-3 h-3 text-slate-500" />
       </div>
    </div>
    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-white italic tabular-nums">{value.toLocaleString()}{sub && <span className="text-sm ml-1 opacity-40">{sub}</span>}</p>
  </div>
);

const AdminServers: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setServers(db.getServers());
  }, []);

  const filtered = servers.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.ip.includes(search));

  const toggleFeatured = (id: string) => {
    const s = servers.find(sv => sv.id === id);
    if (s) {
      const updated = { ...s, featured: !s.featured };
      db.saveServer(updated);
      setServers(db.getServers());
    }
  };

  const deleteServer = (id: string) => {
    if (confirm('Permanently delete this project?')) {
      db.deleteServer(id);
      setServers(db.getServers());
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
             <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Server Fleet</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mt-1">Direct Database Access</p>
          </div>
          <div className="relative w-full md:w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
             <input 
               type="text" 
               placeholder="Filter ID/Title..." 
               className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:border-cyan-500/50 outline-none transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
       </div>

       <div className="bg-[#0d0d0f] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                   <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Project</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tier</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {filtered.map(s => (
                     <tr key={s.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <img src={s.iconUrl} className="w-10 h-10 rounded-xl" alt="" />
                              <div>
                                 <p className="text-sm font-black text-white italic uppercase tracking-tight">{s.title}</p>
                                 <p className="text-[9px] font-mono text-slate-600">{s.ip}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <button 
                             onClick={() => toggleFeatured(s.id)}
                             className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                               s.featured ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/5 text-slate-600 hover:text-white'
                             }`}
                           >
                              {s.featured ? 'Featured' : 'Standard'}
                           </button>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-1 h-3 rounded-full ${i <= s.investmentTier ? 'bg-cyan-500' : 'bg-white/5'}`}></div>
                              ))}
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => deleteServer(s.id)} className="p-2 bg-white/5 hover:bg-rose-500 hover:text-white rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const adjustTokens = (userId: string, amount: number) => {
     const usersCopy = [...users];
     const user = usersCopy.find(u => u.id === userId);
     if (user) {
        user.tokens += amount;
        user.transactions.push({
           id: Math.random().toString(36).substr(2, 9),
           type: 'BONUS',
           amount: amount,
           description: 'Admin Correction',
           createdAt: new Date().toISOString()
        });
        db.setCurrentUser(user); // Updates DB
        setUsers(db.getUsers());
     }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
       <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">User Accounts</h2>
       <div className="bg-[#0d0d0f] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                   <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Balance</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Adjust</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {users.map(u => (
                     <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <img src={u.avatarUrl} className="w-10 h-10 rounded-xl" alt="" />
                              <div>
                                 <p className="text-sm font-black text-white italic uppercase tracking-tight">{u.name}</p>
                                 <p className="text-[9px] text-slate-600 font-mono">{u.email || u.telegramId}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${u.role === UserRole.ADMIN ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'}`}>
                              {u.role}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-sm font-black text-amber-500 italic">{u.tokens.toLocaleString()} VT</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => adjustTokens(u.id, 100)} className="px-3 py-1 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">+100</button>
                              <button onClick={() => adjustTokens(u.id, -100)} className="px-3 py-1 bg-white/5 hover:bg-rose-500 hover:text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">-100</button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

const AdminInvestments: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  
  useEffect(() => {
    setInvestments(db.getInvestments());
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
       <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Global Investments</h2>
       <div className="bg-[#0d0d0f] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                   <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Project</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">User ID</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ROI</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {investments.map(inv => (
                     <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-5">
                           <p className="text-sm font-black text-white italic uppercase tracking-tight">{inv.serverTitle}</p>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-[10px] font-mono text-slate-600">{inv.userId}</p>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-sm font-black text-amber-500 italic">{inv.amount} VT</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <span className="text-[10px] font-black text-emerald-400">+{inv.roi}%</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

// AdminScanner remains mostly the same but updated to match design
const AdminScanner: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [parsedServers, setParsedServers] = useState<Partial<Server>[]>([]);
  const [importing, setImporting] = useState<string | null>(null);

  const handleScan = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await discoverServers(query);
      setResults(data);
      const servers = await parseAiResponseToServers(data.text);
      setParsedServers(servers);
    } catch (e) {
      alert("Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (tempServer: Partial<Server>, index: number) => {
    setImporting(index.toString());
    const newServer: Server = {
      id: Math.random().toString(36).substr(2, 9),
      title: tempServer.title || 'Found Server',
      shortDescription: tempServer.shortDescription || '',
      description: '# AI Discovered Project\n\nAutomatically imported.',
      ip: tempServer.ip || '0.0.0.0',
      gameId: tempServer.gameId || 'g1',
      version: tempServer.version || 'unknown',
      maxPlayers: 1000,
      currentPlayers: 0,
      status: ServerStatus.APPROVED,
      images: ['https://picsum.photos/seed/scan/800/600'],
      tags: [],
      views: 0,
      daysOnline: 1,
      totalInvested: 0,
      investmentTier: Math.floor(Math.random() * 3) + 1,
      addedById: 'ai-scanner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: false
    };
    db.saveServer(newServer);
    setTimeout(() => {
      setImporting(null);
      setParsedServers(prev => prev.filter((_, i) => i !== index));
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">AI Discovery Scan</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mt-1">Deep Web Server Crawling</p>
      </div>

      <div className="bg-[#0d0d0f] border border-cyan-500/10 p-8 rounded-[40px] shadow-2xl">
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
            <input 
              type="text" 
              placeholder="Ex: Top Minecraft servers opened in the last 48 hours..." 
              className="w-full bg-black border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-cyan-500 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleScan}
            disabled={loading}
            className="px-10 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-black font-black rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-cyan-500/10"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {loading ? 'PROCESSING...' : 'INITIALIZE SCAN'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-24 text-center space-y-6">
           <div className="relative inline-block">
              <div className="w-24 h-24 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
              <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-500 animate-pulse" />
           </div>
           <p className="text-cyan-500 font-black uppercase tracking-[4px] text-[10px] animate-pulse">Analyzing Global Nodes...</p>
        </div>
      )}

      {parsedServers.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parsedServers.map((s, idx) => (
            <div key={idx} className="bg-[#0d0d0f] border border-white/5 rounded-[32px] p-8 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Globe className="w-24 h-24 text-white" />
               </div>
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-white italic uppercase group-hover:text-cyan-400 transition-colors">{s.title}</h3>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.version}</span>
                  </div>
                  <button 
                    onClick={() => handleImport(s, idx)}
                    disabled={importing === idx.toString()}
                    className="p-3 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-xl transition-all"
                  >
                    {importing === idx.toString() ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </button>
               </div>
               <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed">{s.shortDescription}</p>
               <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/50">
                  <Terminal className="w-3.5 h-3.5" /> {s.ip}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Grounding Sources Display as required by Gemini Guidelines */}
      {results?.sources?.length > 0 && !loading && (
        <div className="mt-12 p-8 bg-black/40 border border-white/5 rounded-[32px]">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-500" /> Research Sources
          </h3>
          <div className="flex flex-wrap gap-3">
            {results.sources.map((source: any, idx: number) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-cyan-400/70 hover:text-cyan-400 transition-all flex items-center gap-2"
              >
                {source.title} <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;