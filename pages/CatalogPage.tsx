
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Copy, Check, Users, ChevronRight, Clock, Eye, Zap, Sparkles, Gamepad2, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { db } from '../services/mockDb';
import { Server, Game, ServerStatus } from '../types';

const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gameParam = searchParams.get('game') || 'all';

  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>(gameParam);
  const [expandPopular, setExpandPopular] = useState(false);
  const [expandRecent, setExpandRecent] = useState(false);
  const [servers, setServers] = useState<Server[]>(() => db.getServers());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServers = async () => {
      setLoading(true);
      try {
        const data = await db.fetchServers();
        if (data && data.length > 0) setServers(data);
      } catch (e) {
        console.error("Sync error");
      } finally {
        setLoading(false);
      }
    };
    loadServers();
    setSelectedGame(gameParam);
  }, [gameParam]);

  const games = db.getGames();

  const filteredServers = useMemo(() => {
    return (servers || []).filter(s => {
      const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase());
      const matchesGame = selectedGame === 'all' || s.gameId === selectedGame;
      return matchesSearch && matchesGame;
    });
  }, [servers, search, selectedGame]);

  const sortedByPlayers = useMemo(() => {
    const sorted = [...filteredServers].sort((a, b) => (b.currentPlayers || 0) - (a.currentPlayers || 0));
    return expandPopular ? sorted : sorted.slice(0, 10);
  }, [filteredServers, expandPopular]);

  const recentServers = useMemo(() => {
    const sorted = [...filteredServers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return expandRecent ? sorted : sorted.slice(0, 10);
  }, [filteredServers, expandRecent]);

  const handleGameChange = (gameId: string) => {
    setSelectedGame(gameId);
    setSearchParams({ game: gameId });
    setExpandPopular(false);
    setExpandRecent(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 pb-20">
      <div className="bg-[#0a0a0c] pt-6 pb-2 border-b border-white/5 sticky top-16 z-40 backdrop-blur-md bg-[#0a0a0c]/80 overflow-x-auto no-scrollbar">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-2 min-w-max">
            <Link 
              to="/games" 
              className="flex items-center gap-2 py-2.5 px-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/20 transition-all shadow-lg"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Все миры</span>
            </Link>
            
            <div className="w-px h-10 bg-white/5 mx-2"></div>

            {games.slice(0, 12).map(game => (
              <button
                key={game.id}
                onClick={() => handleGameChange(game.id)}
                className={`relative group flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl transition-all duration-300 overflow-hidden border ${
                  selectedGame === game.id 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.05)]' 
                  : 'bg-[#151518] border-white/5 hover:border-white/10 hover:bg-[#1a1a1e]'
                }`}
              >
                <span className={`text-base transition-transform duration-300 ${selectedGame === game.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {game.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-[1.5px] whitespace-nowrap ${
                  selectedGame === game.id ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {game.name}
                </span>
                {selectedGame === game.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Поиск по названию, версии или тегам..."
            className="w-full bg-[#151518] border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all font-medium shadow-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && servers.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
             <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Синхронизация данных...</p>
          </div>
        ) : (
          <>
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                      <Activity className="w-5 h-5" />
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">
                     {selectedGame === 'all' ? 'Популярные' : `Каталог: ${games.find(g => g.id === selectedGame)?.name}`}
                   </h2>
                </div>
                <button 
                  onClick={() => setExpandPopular(!expandPopular)}
                  className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg border ${
                    expandPopular ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'
                  }`}
                >
                  {expandPopular ? 'Свернуть' : 'Весь список'} <ChevronRight className={`w-3 h-3 transition-transform ${expandPopular ? 'rotate-90' : ''}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {sortedByPlayers.length > 0 ? sortedByPlayers.map((server) => (
                  <ServerListItem key={server.id} server={server} />
                )) : (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                     <Search className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                     <p className="text-slate-500 font-bold italic uppercase tracking-widest">Проектов не найдено</p>
                  </div>
                )}
              </div>
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                      <Clock className="w-5 h-5" />
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Новые открытия</h2>
                </div>
                <button 
                  onClick={() => setExpandRecent(!expandRecent)}
                  className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg border ${
                    expandRecent ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'
                  }`}
                >
                  {expandRecent ? 'Свернуть' : 'Весь список'} <ChevronRight className={`w-3 h-3 transition-transform ${expandRecent ? 'rotate-90' : ''}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {recentServers.map(server => (
                  <ServerListItem key={server.id} server={server} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const ServerListItem: React.FC<{ server: Server }> = ({ server }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(server.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const capacityPercent = Math.min(100, (server.currentPlayers / server.maxPlayers) * 100);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-indigo-500/0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"></div>
      
      <Link 
        to={`/server/${server.id}`} 
        className="relative flex flex-col md:flex-row items-center gap-5 bg-[#151518] hover:bg-[#1a1a1e] border border-white/5 group-hover:border-white/10 rounded-3xl p-5 transition-all duration-300 shadow-xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-[#0a0a0c] border-2 ${
          server.featured ? 'border-amber-500/30' : 'border-white/5'
        } group-hover:scale-105 transition-transform duration-500 shadow-2xl`}>
          <img 
            src={server.iconUrl || 'https://picsum.photos/120/120'} 
            alt={server.title} 
            className="w-full h-full object-cover group-hover:rotate-1 transition-transform duration-700" 
          />
          {server.featured && (
            <div className="absolute top-1 right-1 bg-amber-500 p-1 rounded-lg">
              <Sparkles className="w-2.5 h-2.5 text-black fill-current" />
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0 w-full md:w-auto">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-black text-white truncate leading-tight group-hover:text-amber-400 transition-colors uppercase italic tracking-tighter">
              {server.title}
            </h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{server.version}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0a0a0c] rounded-xl border border-white/5 group/copy hover:border-amber-500/30 transition-all cursor-pointer" onClick={handleCopy}>
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px] group-hover/copy:text-amber-500 transition-colors">{server.ip}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-600 group-hover/copy:text-amber-500 transition-colors" />}
             </div>
             {server.featured && (
                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-tighter rounded-lg border border-amber-500/20 shadow-lg shadow-amber-500/5">Premium</span>
             )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5 text-slate-600 group-hover:text-slate-400 transition-colors">
              <Clock className="w-3.5 h-3.5" />
              <span>{server.daysOnline}д в сети</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 group-hover:text-slate-400 transition-colors">
              <Eye className="w-3.5 h-3.5" />
              <span>{server.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 flex-grow max-w-[150px] ml-auto md:ml-0">
               <div className="flex-grow h-1.5 bg-[#0a0a0c] rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      capacityPercent > 80 ? 'bg-rose-500' : capacityPercent > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  ></div>
               </div>
               <span className="text-slate-700">{Math.round(capacityPercent)}%</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex md:flex-col items-center justify-between md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
          <div className="flex items-center gap-2 mb-1">
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 relative"></div>
             </div>
             <span className="text-2xl font-black text-white italic tabular-nums">{server.currentPlayers.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[2px]">Игроков</span>
            <span className="text-[8px] font-bold text-slate-800 uppercase tracking-widest">из {server.maxPlayers.toLocaleString()}</span>
          </div>
          
          <div className="md:mt-4 p-2 bg-white/5 rounded-xl group-hover:bg-amber-500 group-hover:text-black transition-all">
             <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CatalogPage;
