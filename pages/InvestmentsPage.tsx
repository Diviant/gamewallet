
import React, { useState, useMemo, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Coins, 
  Zap, 
  ArrowUpRight, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  Activity,
  History,
  Briefcase,
  PieChart,
  ArrowRight,
  Plus
} from 'lucide-react';
import { db } from '../services/mockDb';
import { User, Server, Investment } from '../types';

interface InvestmentsPageProps {
  user: User | null;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');
  const [servers, setServers] = useState<Server[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const loadData = () => {
    setServers(db.getServers());
    if (user) {
      setInvestments(db.getInvestments(user.id));
    }
  };

  const handleWithdraw = async (invId: string) => {
    if (!user) return;
    if (!confirm('Вы уверены, что хотите вывести этот вклад?')) return;
    const res = await db.withdrawInvestment(user.id, invId);
    if (res.success) {
      loadData();
      alert(`Выведено ${res.amountReturned} VT`);
    } else {
      alert(`Не удалось вывести: ${res.error}`);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = db.subscribe(loadData);
    return () => unsubscribe();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const allInvestments = db.getInvestments();
  const totalInvested = allInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalROI = investments.length > 0 
    ? (investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> Vault Ventures
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
            Биржа <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Инвестиций</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
            Вкладывайте свои <span className="text-amber-500 font-bold">VT</span> в перспективные сервера и получайте пассивный доход в зависимости от роста проекта.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <StatCard icon={<Coins className="w-4 h-4 text-amber-500" />} label="Мой Баланс" value={user.tokens} sub="VT" />
          <StatCard icon={<Briefcase className="w-4 h-4 text-indigo-400" />} label="Вложено" value={totalInvested} sub="VT" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#151518] border border-white/5 rounded-2xl w-max mb-8">
         <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} label="Рынок проектов" icon={<PieChart className="w-4 h-4" />} />
         <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} label="Мой портфель" icon={<Briefcase className="w-4 h-4" />} />
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === 'market' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.sort((a, b) => b.investmentTier - a.investmentTier).map((server) => (
              <InvestmentMarketCard key={server.id} server={server} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <SummaryMiniCard label="Средняя доходность" value={`${totalROI}%`} color="text-emerald-400" />
               <SummaryMiniCard label="Активных вкладов" value={investments.length} color="text-indigo-400" />
               <SummaryMiniCard label="Накоплено бонусов" value={0} sub="VT" color="text-amber-400" />
            </div>

            <div className="bg-[#151518] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Проект</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Сумма вклада</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI (Прогноз)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Начислено</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {investments.length > 0 ? investments.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-5">
                            <Link to={`/server/${inv.serverId}`} className="flex items-center gap-3 group">
                               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                  <TrendingUp className="w-5 h-5" />
                               </div>
                               <span className="font-black text-white italic group-hover:text-indigo-400 transition-colors uppercase">{inv.serverTitle}</span>
                            </Link>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-black text-slate-300">{inv.amount} <span className="text-amber-500/50">VT</span></span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black tracking-widest">+{inv.roi}%</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-3">
                               <span className="text-sm font-black text-emerald-400">{(inv.accumulatedDividends||0).toFixed(2)} VT</span>
                               <button onClick={() => handleWithdraw(inv.id)} className="px-3 py-2 bg-rose-600 rounded-xl text-[12px] font-black">Вывести</button>
                             </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-20 text-center opacity-30">
                             <Briefcase className="w-12 h-12 mx-auto mb-4" />
                             <p className="font-black uppercase tracking-widest text-[10px]">Ваш портфель пока пуст</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-20 p-10 bg-gradient-to-br from-[#151518] to-[#0a0a0c] border border-white/5 rounded-[40px] grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
         <InfoBox icon={<Zap className="w-5 h-5 text-amber-500" />} title="Как это работает?" text="Выберите сервер из каталога и инвестируйте VT. Каждые 24 часа вам начисляются дивиденды." />
         <InfoBox icon={<Activity className="w-5 h-5 text-indigo-400" />} title="Риски и профит" text="ROI зависит от онлайна и рейтинга сервера. Чем популярнее проект, тем стабильнее выплаты." />
         <InfoBox icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} title="Вывод средств" text="Дивиденды можно забрать в любой момент в личном профиле в разделе наград." />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: any, label: string, value: number, sub: string }) => (
  <div className="bg-[#151518] border border-white/5 p-6 rounded-[32px] shadow-xl">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white/5 rounded-xl">
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-3xl font-black text-white italic">{value.toLocaleString()}<span className="text-amber-500 text-sm ml-1">{sub}</span></p>
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

const InvestmentMarketCard = ({ server }: { server: Server }) => {
  const roi = (5 + server.investmentTier * 2).toFixed(1);

  return (
    <div className="group bg-[#151518] border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
          <TrendingUp className="w-24 h-24 text-white" />
       </div>
       
       <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0a0a0c] border border-white/10 overflow-hidden shadow-lg">
             <img src={server.iconUrl} className="w-full h-full object-cover" alt="" />
          </div>
          <div>
             <h3 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">{server.title}</h3>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase">{server.currentPlayers} ОНЛАЙН</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-[#0a0a0c] border border-white/5 rounded-2xl">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Доходность</p>
             <p className="text-xl font-black text-emerald-400 italic">+{roi}%</p>
          </div>
          <div className="p-4 bg-[#0a0a0c] border border-white/5 rounded-2xl">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Сложность</p>
             <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1 flex-grow rounded-full ${i <= server.investmentTier ? 'bg-indigo-500' : 'bg-white/5'}`}></div>
                ))}
             </div>
          </div>
       </div>

       <Link to={`/server/${server.id}`} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all group-hover:border-indigo-500/40">
          Инвестировать <ChevronRight className="w-4 h-4" />
       </Link>
    </div>
  );
};

const SummaryMiniCard = ({ label, value, sub, color }: { label: string, value: string | number, sub?: string, color: string }) => (
  <div className="bg-[#151518] border border-white/5 p-6 rounded-3xl text-center">
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color} italic`}>{value}{sub && <span className="text-xs ml-0.5">{sub}</span>}</p>
  </div>
);

const InfoBox = ({ icon, title, text }: { icon: any, title: string, text: string }) => (
  <div className="space-y-3 relative z-10">
     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
        {icon}
     </div>
     <h4 className="text-sm font-black text-white uppercase italic tracking-widest">{title}</h4>
     <p className="text-xs text-slate-500 leading-relaxed font-medium">{text}</p>
  </div>
);

export default InvestmentsPage;
