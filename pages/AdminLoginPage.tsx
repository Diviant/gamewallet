
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Terminal, ArrowRight, Loader2, Zap } from 'lucide-react';
import { db } from '../services/mockDb';
import { User, UserRole } from '../types';

interface AdminLoginPageProps {
  setUser: (user: User) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // For demo, check if email contains 'admin' and password is 'admin'
      // In production, this would be a real auth check
      const users = db.getUsers();
      const adminUser = users.find(u => u.email === email && u.role === UserRole.ADMIN);

      if (adminUser || (email === 'admin@vault.com' && password === 'admin')) {
        let user = adminUser;
        if (!user) {
          user = db.registerUser(email, 'System Admin');
          user.role = UserRole.ADMIN;
          db.setCurrentUser(user);
        }
        setUser(user);
        navigate('/admin');
      } else {
        setError('ACCESS DENIED: INVALID CREDENTIALS');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden font-mono">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-cyan-500/5 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#0d0d0f] border border-cyan-500/20 rounded-[32px] p-8 md:p-10 shadow-2xl shadow-cyan-500/5 overflow-hidden">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/30 text-cyan-500 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Command Center</h1>
            <p className="text-[10px] text-cyan-500/50 uppercase tracking-[4px]">Administrator Authorization</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="ADMIN_ID"
                  required
                  className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-cyan-500 text-sm focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="SECURE_KEY"
                  required
                  className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-cyan-500 text-sm focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-[10px] font-bold animate-pulse">
                <ShieldAlert className="w-4 h-4" /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Initialize Session <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest">
            <span>Encryption: AES-256</span>
            <span>Vault OS v3.1</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="mt-6 w-full text-center text-[10px] font-black text-slate-700 uppercase tracking-[4px] hover:text-white transition-colors"
        >
          Cancel Login
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
