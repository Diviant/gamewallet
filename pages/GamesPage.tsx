
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Search, 
  ChevronRight, 
  Zap, 
  Trophy, 
  Users, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { db } from '../services/mockDb';

const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const games = db.getGames();
  const servers = db.getServers();

  const getGameStats = (gameId: string) => {
    const gameServers = servers.filter(s => gameId === 'all' ? true : s.gameId === gameId);
    const online = gameServers.reduce((sum, s) => sum + s.currentPlayers, 0);
    return { count: gameServers.length, online };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] pb-20 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/10 via-amber-500/5 to-transparent blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 pt-12 relative">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <Gamepad2 className="w-3 h-3" /> Game Universe
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
             Выберите <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Вселенную</span>
           </h1>
           <p className="text-slate-500 font-medium max-w-xl mx-auto">
             Тысячи серверов, разделенных по жанрам и играм. Найди свое идеальное сообщество прямо сейчас.
           </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => {
            const stats = getGameStats(game.id);
            return (
              <button
                key={game.id}
                onClick={() => navigate(`/servers?game=${game.id}`)}
                className="group relative bg-[#151518] border border-white/5 rounded-[32px] p-8 text-left transition-all duration-500 hover:border-amber-500/30 hover:-translate-y-2 overflow-hidden shadow-2xl"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                   <div className="w-16 h-16 rounded-2xl bg-[#0a0a0c] border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl">
                      {game.icon}
                   </div>
                   
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-amber-400 transition-colors">
                     {game.name}
                   </h3>
                   
                   <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center gap-1.5">
                         <Layers className="w-3 h-3 text-slate-600" />
                         <span className="text-[10px] font-black text-slate-500 uppercase">{stats.count} Проектов</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] font-black text-slate-500 uppercase">{stats.online.toLocaleString()} Онлайн</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Перейти в каталог</span>
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Stats Footer */}
        <div className="mt-20 p-10 bg-gradient-to-br from-[#151518] to-[#1a1a20] border border-white/5 rounded-[40px] flex flex-wrap justify-around items-center gap-8 shadow-2xl relative">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
           <GlobalStat icon={<Trophy className="w-6 h-6 text-amber-500" />} label="Проектов в базе" value={servers.length} />
           <div className="w-px h-12 bg-white/5 hidden md:block"></div>
           <GlobalStat icon={<Users className="w-6 h-6 text-indigo-400" />} label="Игроков онлайн" value={servers.reduce((a, b) => a + b.currentPlayers, 0)} />
           <div className="w-px h-12 bg-white/5 hidden md:block"></div>
           <GlobalStat icon={<Zap className="w-6 h-6 text-emerald-400" />} label="Новых за неделю" value={14} />
        </div>
      </div>
    </div>
  );
};

const GlobalStat = ({ icon, label, value }: { icon: any, label: string, value: number }) => (
  <div className="text-center space-y-2 relative z-10">
    <div className="w-12 h-12 mx-auto bg-[#0a0a0c] rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
       {icon}
    </div>
    <p className="text-2xl font-black text-white italic">{value.toLocaleString()}</p>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

export default GamesPage;
