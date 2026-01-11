
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  TrendingUp, 
  Coins, 
  User as UserIcon, 
  Medal, 
  Crown, 
  Star,
  ArrowUpRight,
  Zap,
  Calendar,
  ChevronRight,
  Target
} from 'lucide-react';
import { db } from '../services/mockDb';
import { User } from '../types';

const getRankTitle = (level: number) => {
  if (level >= 20) return { name: 'Legend', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  if (level >= 13) return { name: 'Elite', color: 'text-indigo-400', bg: 'bg-indigo-400/10' };
  if (level >= 8) return { name: 'Veteran', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  if (level >= 4) return { name: 'Explorer', color: 'text-amber-400', bg: 'bg-amber-400/10' };
  return { name: 'Wanderer', color: 'text-slate-400', bg: 'bg-slate-400/10' };
};

const LeaderboardPage: React.FC = () => {
  const users = db.getUsers();

  const rankedUsers = useMemo(() => {
    // Priority: Level > XP > Tokens
    return [...users].sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.tokens - a.tokens;
    });
  }, [users]);

  const podium = rankedUsers.slice(0, 3);
  const remaining = rankedUsers.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">
          <Trophy className="w-3 h-3" /> Hall of Fame
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Топ Игроков</h1>
        <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
          Легендарные участники сообщества GameVault, заслужившие признание своей активностью.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end">
        {podium[1] && (
          <PodiumCard user={podium[1]} rank={2} color="text-slate-300" bgColor="from-slate-500/20 to-transparent" borderColor="border-slate-500/30" />
        )}
        {podium[0] && (
          <PodiumCard user={podium[0]} rank={1} color="text-amber-400" bgColor="from-amber-500/30 via-amber-600/5 to-transparent" borderColor="border-amber-500/60 shadow-[0_0_50px_rgba(251,191,36,0.1)]" large />
        )}
        {podium[2] && (
          <PodiumCard user={podium[2]} rank={3} color="text-orange-400" bgColor="from-orange-500/20 to-transparent" borderColor="border-orange-500/30" />
        )}
      </div>

      <div className="bg-[#151518] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Место</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Пользователь</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Уровень / Ранг</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Награды</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {remaining.map((user, idx) => {
                const rankInfo = getRankTitle(user.level);
                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-600">#{idx + 4}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="" />
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">{user.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">XP: {user.xp.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-white italic">LVL {user.level}</span>
                             <span className={`text-[8px] font-black uppercase tracking-widest ${rankInfo.color}`}>{rankInfo.name}</span>
                          </div>
                          <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                             <div className="h-full bg-indigo-500" style={{ width: `${(user.xp % 200) / 2}%` }}></div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <span className="text-lg font-black text-white">{user.tokens.toLocaleString()}</span>
                         <span className="text-[10px] font-black text-amber-500 uppercase">VT</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PodiumCard = ({ user, rank, color, bgColor, borderColor, large = false }: { user: any, rank: number, color: string, bgColor: string, borderColor: string, large?: boolean }) => {
  const rankInfo = getRankTitle(user.level);
  return (
    <div className={`relative bg-gradient-to-t ${bgColor} border-2 ${borderColor} rounded-3xl p-8 text-center transition-all hover:-translate-y-2 group shadow-2xl ${large ? 'md:pb-16 scale-105' : ''}`}>
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-[#0a0a0c] border-2 ${borderColor} flex items-center justify-center ${color} shadow-xl`}>
        {rank === 1 ? <Crown className="w-6 h-6" /> : <Medal className="w-6 h-6" />}
      </div>

      <div className={`relative mx-auto rounded-full border-4 ${borderColor} overflow-hidden mb-6 ${large ? 'w-32 h-32' : 'w-24 h-24'}`}>
        <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" alt="" />
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{user.name}</h3>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${rankInfo.bg}`}>
           <span className={`text-[9px] font-black uppercase tracking-widest ${rankInfo.color}`}>{rankInfo.name}</span>
           <span className="text-white/20">•</span>
           <span className="text-[9px] font-black text-white italic">LVL {user.level}</span>
        </div>
      </div>

      <div className={`bg-[#0a0a0c]/60 backdrop-blur-md rounded-2xl p-4 inline-block border ${rank === 1 ? 'border-amber-500/20' : 'border-white/5'}`}>
         <div className="flex items-center gap-2">
            <Coins className={`w-4 h-4 text-amber-500`} />
            <span className="text-2xl font-black text-white italic">{user.tokens.toLocaleString()}</span>
            <span className={`text-[10px] font-black uppercase text-amber-500`}>VT</span>
         </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
