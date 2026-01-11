
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Copy, 
  CheckCircle2, 
  Globe, 
  MessageCircle, 
  Clock, 
  Users, 
  ShieldCheck, 
  ArrowLeft,
  Heart,
  Eye,
  Calendar,
  Layers,
  ExternalLink,
  Share2,
  Zap,
  Star,
  Send,
  Gamepad2,
  Terminal,
  Activity,
  ChevronRight,
  Shield,
  MessageSquare,
  TrendingUp,
  Coins
} from 'lucide-react';
import { db } from '../services/mockDb';
import { Server, User, Review } from '../types';

const ServerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [server, setServer] = useState<Server | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser());
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [investAmount, setInvestAmount] = useState<number>(100);
  const [isInvesting, setIsInvesting] = useState(false);

  const loadData = () => {
    if (id) {
      const data = db.getServers().find(s => s.id === id);
      const user = db.getCurrentUser();
      setCurrentUser(user);
      if (data) {
        setServer(data);
        setReviews(db.getReviews(id));
        if (user) {
          const favs = db.getFavorites(user.id);
          setIsFavorite(favs.some(f => f.serverId === id));
        }
      }
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = db.subscribe(loadData);
    return () => unsubscribe();
  }, [id]);

  const triggerToast = (message: string) => {
    setShowToast({ message, visible: true });
    setTimeout(() => setShowToast({ message: '', visible: false }), 3000);
  };

  const copyToClipboard = () => {
    if (!server) return;
    const addr = server.ip + (server.port ? `:${server.port}` : '');
    navigator.clipboard.writeText(addr);
    setCopied(true);
    triggerToast("IP адрес скопирован!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = () => {
    if (!currentUser || !id) return;
    db.toggleFavorite(currentUser.id, id);
    const newFavState = !isFavorite;
    setIsFavorite(newFavState);
    if (newFavState) triggerToast("+10 VT: Сохранено");
  };

  // Fix: handleInvest now correctly awaits the promise from db.investInServer
  const handleInvest = () => {
    if (!currentUser || !server) return;
    if (currentUser.tokens < investAmount) {
      triggerToast("Недостаточно VT для вклада");
      return;
    }
    
    setIsInvesting(true);
    setTimeout(async () => {
      const res = await db.investInServer(currentUser.id, server.id, investAmount);
      if (res.success) {
        triggerToast(`Инвестировано ${investAmount} VT!`);
      } else {
        triggerToast(res.error || "Ошибка");
      }
      setIsInvesting(false);
    }, 1000);
  };

  // Fix: handleSubmitReview is now async and awaits the db.addReview call
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !id || !reviewText.trim()) return;
    const result = await db.addReview(currentUser.id, id, reviewText, reviewRating);
    if (result.success) {
      triggerToast("+20 VT за отзыв!");
      setReviewText('');
      loadData();
    }
  };

  if (!server) return null;

  const game = db.getGames().find(g => g.id === server.gameId);
  const hasReviewed = currentUser?.reviewedServerIds.includes(server.id);
  const capacityPercent = Math.min(100, (server.currentPlayers / server.maxPlayers) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Dynamic Notifications */}
      {showToast.visible && (
        <div className="fixed top-24 right-6 z-[100] bg-amber-500 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300 font-black uppercase text-[10px] tracking-widest">
           <Zap className="w-4 h-4 fill-current" />
           {showToast.message}
        </div>
      )}

      <Link to="/servers" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-all mb-10 font-black uppercase text-[10px] tracking-[3px] group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Назад в список миров
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Main Info */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Premium Header */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-amber-500/20 rounded-[42px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative bg-[#151518] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="h-80 relative overflow-hidden">
                <img src={server.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-[#151518]/60 to-transparent"></div>
                
                {/* Floating Tags */}
                <div className="absolute top-8 left-8 flex gap-2">
                  <span className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                    {game?.name}
                  </span>
                  <span className="px-4 py-2 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    v{server.version}
                  </span>
                </div>
              </div>

              <div className="px-8 pb-10 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-6">
                  <div className="flex gap-6 items-end">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-32 h-32 rounded-[32px] border-4 border-[#151518] shadow-2xl bg-[#0a0a0c] overflow-hidden relative">
                        <img src={server.iconUrl} className="w-full h-full object-cover" alt="Icon" />
                      </div>
                    </div>
                    <div className="pb-2">
                      <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                        {server.title}
                      </h1>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Проект активен</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow flex justify-end gap-3 pb-2 w-full md:w-auto">
                    {currentUser && (
                      <button 
                        onClick={handleToggleFavorite}
                        className={`p-4 rounded-2xl transition-all border shadow-xl active:scale-95 ${
                          isFavorite 
                            ? 'bg-amber-500 text-black border-amber-400' 
                            : 'bg-white/5 text-white border-white/10 hover:border-amber-500/50'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    <button className="p-4 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 shadow-xl">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Information Tabs Style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <DetailCard icon={<Users className="w-5 h-5" />} label="Игроки" value={`${server.currentPlayers}/${server.maxPlayers}`} color="text-indigo-400" />
             <DetailCard icon={<Clock className="w-5 h-5" />} label="Аптайм" value={`${server.daysOnline} дней`} color="text-emerald-400" />
             <DetailCard icon={<Eye className="w-5 h-5" />} label="Просмотры" value={server.views.toLocaleString()} color="text-amber-400" />
             <DetailCard icon={<Activity className="w-5 h-5" />} label="Нагрузка" value={`${Math.round(capacityPercent)}%`} color="text-rose-400" />
          </div>

          {/* Description Block */}
          <div className="bg-[#151518] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
               <Layers className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <Shield className="w-6 h-6 text-amber-500" /> Описание мира
            </h2>
            <div className="prose prose-invert max-w-none text-slate-400 whitespace-pre-wrap leading-relaxed font-medium text-lg">
              {server.description}
            </div>
          </div>

          {/* Reviews Area */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
              <MessageSquare className="w-8 h-8 text-indigo-500" /> Отзывы сообщества
            </h2>
            
            {currentUser && !hasReviewed && (
              <div className="bg-gradient-to-br from-[#151518] to-[#1a1a20] border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <Star className="w-6 h-6 fill-amber-500/20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Поделитесь опытом</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Вы получите <span className="text-amber-500">20 VT</span> за активность</p>
                  </div>
                </div>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className={`transition-all ${star <= reviewRating ? 'text-amber-400 scale-125' : 'text-slate-800'}`}>
                        <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Напишите, что вам понравилось на этом сервере..."
                    className="w-full bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 text-white placeholder:text-slate-700 focus:ring-1 focus:ring-amber-500 outline-none transition-all min-h-[140px] resize-none"
                  />
                  <button type="submit" disabled={!reviewText.trim()} className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black rounded-2xl uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-amber-500/10 active:scale-95 flex items-center gap-3">
                    <Send className="w-4 h-4" /> Отправить отзыв
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="bg-[#151518] border border-white/5 rounded-[28px] p-8 hover:bg-[#1a1a1e] transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <img src={review.userAvatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg" alt="" />
                      <div>
                        <p className="text-lg font-black text-white italic">{review.userName}</p>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[2px]">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-medium italic text-lg">"{review.text}"</p>
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                   <MessageCircle className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                   <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Отзывов пока нет. Будьте первым!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Console-style Entry Widget */}
          <div className="sticky top-28 space-y-6">

            {/* Investment Box (NEW) */}
            {currentUser && (
               <div className="bg-gradient-to-br from-amber-500/20 via-[#151518] to-amber-900/10 border border-amber-500/30 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                     <TrendingUp className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4 flex items-center gap-3">
                     <TrendingUp className="w-6 h-6 text-amber-500" /> Инвест-вклад
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">
                    Инвестируйте VT в этот проект. Доходность: <span className="text-emerald-400 font-black">+{5 + server.investmentTier * 2}% / сутки</span>
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                        {[100, 500, 1000].map(val => (
                           <button 
                             key={val}
                             onClick={() => setInvestAmount(val)}
                             className={`flex-grow py-2 rounded-xl text-[10px] font-black uppercase transition-all ${investAmount === val ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
                           >
                              {val}
                           </button>
                        ))}
                     </div>
                     <button 
                        onClick={handleInvest}
                        disabled={isInvesting}
                        className="w-full py-4 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10 active:scale-95"
                     >
                        {isInvesting ? 'Обработка...' : <>Вложить {investAmount} VT <Coins className="w-3 h-3" /></>}
                     </button>
                  </div>
               </div>
            )}

            <div className="bg-gradient-to-br from-indigo-900 via-[#151518] to-[#0a0a0c] border border-white/5 rounded-[40px] p-1 shadow-2xl overflow-hidden group">
              <div className="bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[38px] p-8 space-y-8 relative">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Terminal className="w-32 h-32 text-indigo-500" />
                 </div>
                 
                 <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2 flex items-center gap-3">
                       <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Консоль подключения
                    </h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Connect and start playing</p>
                 </div>

                 <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-[2px] px-1">Host / Address</label>
                       <div className={`flex items-center justify-between p-4 bg-black border rounded-2xl transition-all duration-300 ${copied ? 'border-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                          <code className={`text-sm font-mono transition-colors truncate mr-4 ${copied ? 'text-amber-400' : 'text-slate-300'}`}>
                             {server.ip}{server.port ? `:${server.port}` : ''}
                          </code>
                          <button 
                             onClick={copyToClipboard} 
                             className={`p-3 rounded-xl transition-all active:scale-90 ${
                                copied ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-400 hover:text-white'
                             }`}
                          >
                             {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>

                    <a 
                      href={server.websiteUrl || `https://${server.ip}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full group/btn flex items-center justify-between p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-amber-500/10"
                    >
                      <span className="text-[10px] uppercase tracking-widest">Открыть сайт</span>
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <SocialButton icon={<MessageCircle className="w-4 h-4" />} label="Discord" color="bg-indigo-600" />
                      <SocialButton icon={<Globe className="w-4 h-4" />} label="Wiki" color="bg-slate-800" />
                    </div>
                 </div>

                 <div className="pt-6 flex items-center justify-center gap-6 border-t border-white/5">
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Share this world</span>
                    <button className="text-slate-600 hover:text-amber-500 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                    <button className="text-slate-600 hover:text-amber-500 transition-colors"><Globe className="w-4 h-4" /></button>
                    <button className="text-slate-600 hover:text-amber-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>

            {/* Live Monitoring Info Card */}
            <div className="bg-[#151518] border border-white/5 p-8 rounded-[40px] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                     <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Статус проекта</h3>
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-tighter">Live & Online</p>
                  </div>
               </div>
               
               <div className="space-y-5">
                  <div className="flex justify-between items-end">
                     <p className="text-3xl font-black text-white italic">{server.currentPlayers.toLocaleString()}</p>
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Активных игроков</p>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        style={{ width: `${capacityPercent}%` }}
                     ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest px-1">
                     <span>Capacity</span>
                     <span>Limit: {server.maxPlayers}</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-[#151518] border border-white/5 p-6 rounded-[28px] hover:border-white/10 transition-all group hover:-translate-y-1 shadow-xl">
    <div className={`p-2.5 bg-white/5 rounded-xl ${color} mb-4 w-fit group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[2px] mb-1">{label}</p>
    <p className="text-xl font-black text-white italic uppercase tracking-tighter">{value}</p>
  </div>
);

const SocialButton = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
  <button className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 ${color} shadow-lg`}>
    {icon} {label}
  </button>
);

export default ServerDetailsPage;
