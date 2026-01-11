
import React, { useState, useMemo, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  Heart, 
  Save, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Coins,
  Copy,
  Users,
  Share2,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  TrendingUp,
  BarChart3,
  Server as ServerIcon,
  MessageSquare,
  ArrowDownCircle,
  Zap,
  Ticket,
  Trophy,
  ChevronRight,
  Settings as SettingsIcon,
  Star,
  Activity,
  Plus,
  ShoppingCart,
  FileText,
  Info
} from 'lucide-react';
import { db } from '../services/mockDb';
import { User, UserRole, Transaction, Server } from '../types';

const getRankTitle = (level: number) => {
  if (level >= 20) return { name: 'Legend', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  if (level >= 13) return { name: 'Elite', color: 'text-indigo-400', bg: 'bg-indigo-400/10' };
  if (level >= 8) return { name: 'Veteran', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  if (level >= 4) return { name: 'Explorer', color: 'text-amber-400', bg: 'bg-amber-400/10' };
  return { name: 'Wanderer', color: 'text-slate-400', bg: 'bg-slate-400/10' };
};

interface ProfilePageProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  if (!user) return <Navigate to="/login" />;

  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      const freshUser = db.getCurrentUser();
      if (freshUser) setUser(freshUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  const favoritesCount = db.getFavorites(user.id).length;
  const transactions = [...(user.transactions || [])].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const xpStats = db.getXpProgress(user);
  const rankInfo = getRankTitle(user.level);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const updatedUser = { ...user, name, avatarUrl };
      db.setCurrentUser(updatedUser);
      setUser(updatedUser);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="relative bg-[#151518] border border-white/5 rounded-[40px] p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full -mr-40 -mt-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl bg-[#0a0a0c] p-1.5 transition-transform duration-500 group-hover:scale-105`}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-3 bg-amber-500 rounded-2xl shadow-xl border-4 border-[#151518] text-[#0a0a0c] hover:bg-amber-400 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <div className={`px-4 py-1 rounded-xl border border-white/10 ${rankInfo.bg} flex items-center gap-2`}>
                <Star className={`w-3.5 h-3.5 ${rankInfo.color} fill-current`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${rankInfo.color}`}>{rankInfo.name}</span>
              </div>
              <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest italic">
                Уровень {user.level}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">{user.name}</h1>
            
            {/* XP Progress Bar */}
            <div className="max-w-md mx-auto md:mx-0 pt-2">
               <div className="flex justify-between items-end mb-2 px-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Прогресс XP</span>
                  <span className="text-[10px] font-black text-white italic">{xpStats.xpIntoLevel} / {xpStats.xpNeededForNext}</span>
               </div>
               <div className="h-2.5 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    style={{ width: `${xpStats.progress}%` }}
                  ></div>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
               <div className="px-4 py-2 bg-[#0a0a0c] border border-white/5 rounded-xl flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-400">{user.email}</span>
               </div>
               <div className="px-4 py-2 bg-[#0a0a0c] border border-white/5 rounded-xl flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-400">С нами с {new Date(user.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-[#151518] to-[#1a1a20] border border-amber-500/20 rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
             <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                   <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Баланс</h3>
             </div>
             <p className="text-4xl font-black text-white italic mb-4">{user.tokens.toLocaleString()}<span className="text-amber-500 text-lg ml-1">VT</span></p>
             <Link to="/shop" className="w-full py-3 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all">
                <Plus className="w-4 h-4" /> Пополнить VT
             </Link>
          </div>

          <div className="bg-gradient-to-br from-[#151518] to-[#1a1a20] border border-indigo-500/20 rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-500" /> Реферальный код
             </h3>
             <div className="bg-[#0a0a0c] border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                <span className="text-sm font-black text-white italic tracking-widest">{user.referralCode}</span>
                <button onClick={copyReferral} className="p-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-all active:scale-90">
                   {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
             </div>
          </div>

          <div className="bg-[#151518] border border-white/5 rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400" /> Документация
             </h3>
             <Link to="/whitepaper" className="w-full py-4 bg-white/5 border border-white/5 hover:border-amber-500/30 rounded-2xl flex flex-col items-center gap-2 transition-all group">
                <FileText className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Project Whitepaper</span>
             </Link>
          </div>

          <StatMiniCard label="Общий Опыт" value={user.xp} sub="XP" icon={<Activity className="w-4 h-4" />} color="text-indigo-400" />
          <StatMiniCard label="Избранное" value={favoritesCount} sub="ПР" icon={<Heart className="w-4 h-4" />} color="text-rose-500" />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 p-1.5 bg-[#151518] border border-white/5 rounded-2xl w-max">
             <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="История" icon={<History className="w-4 h-4" />} />
             <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Профиль" icon={<UserIcon className="w-4 h-4" />} />
          </div>

          <div className="animate-in fade-in duration-500">
             {activeTab === 'history' && (
               <div className="bg-[#151518] border border-white/5 rounded-[32px] p-8 shadow-xl min-h-[400px]">
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                     <History className="w-6 h-6 text-indigo-500" /> История транзакций
                  </h2>
                  <div className="space-y-4">
                    {transactions.length > 0 ? transactions.map((tx) => (
                       <div key={tx.id} className="flex items-center justify-between p-5 bg-[#0a0a0c] border border-white/5 rounded-3xl hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-5">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                                tx.type === 'PURCHASE' ? 'bg-amber-500/10 text-amber-500' : 
                                tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                             }`}>
                                {tx.type === 'PURCHASE' ? <ShoppingCart className="w-5 h-5" /> :
                                 tx.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                             </div>
                             <div>
                                <p className="text-sm font-black text-white uppercase italic">{tx.description}</p>
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className={`text-base font-black italic ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {tx.amount > 0 ? '+' : ''}{tx.amount} VT
                          </div>
                       </div>
                    )) : (
                      <div className="py-20 text-center opacity-30">
                        <History className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-black uppercase tracking-widest text-[10px]">История пуста</p>
                      </div>
                    )}
                  </div>
               </div>
             )}

             {activeTab === 'settings' && (
               <div className="bg-[#151518] border border-white/5 rounded-[32px] p-8 shadow-xl min-h-[400px]">
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                     <SettingsIcon className="w-6 h-6 text-slate-400" /> Настройки аккаунта
                  </h2>
                  
                  <form onSubmit={handleSave} className="max-w-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Твой Никнейм</label>
                        <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl py-4 px-5 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Ссылка на аватар</label>
                        <input 
                          type="text" 
                          value={avatarUrl} 
                          onChange={(e) => setAvatarUrl(e.target.value)} 
                          className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl py-4 px-5 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none transition-all" 
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    
                    <button type="submit" disabled={isSaving} className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-[#0a0a0c] font-black rounded-2xl uppercase tracking-widest text-xs transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-amber-500/20">
                      {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                  </form>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatMiniCard = ({ label, value, sub, icon, color }: { label: string, value: number, sub: string, icon: any, color: string }) => (
  <div className="bg-[#151518] border border-white/5 rounded-[24px] p-6 hover:bg-white/[0.02] transition-colors shadow-lg group">
    <div className="flex justify-between items-center mb-3">
      <div className={`p-2 bg-white/5 rounded-xl ${color}`}>
        {icon}
      </div>
      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
    </div>
    <p className="text-2xl font-black text-white italic">{value.toLocaleString()}<span className="text-slate-600 text-[10px] ml-1 uppercase">{sub}</span></p>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] mt-1">{label}</p>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: any }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
      active ? 'bg-white text-[#0a0a0c] shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

export default ProfilePage;
