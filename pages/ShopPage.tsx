
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  Flame, 
  ArrowLeft,
  Sparkles,
  Trophy,
  Coins,
  Gem,
  CheckCircle2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { db } from '../services/mockDb';
import { User } from '../types';

interface ShopPageProps {
  user: User | null;
}

const PACKAGES = [
  { id: 'pkg1', tokens: 100, stars: 50, label: 'Стартовый', icon: <Zap className="w-6 h-6" />, color: 'from-blue-500/20 to-indigo-500/20', borderColor: 'border-blue-500/30' },
  { id: 'pkg2', tokens: 500, stars: 200, label: 'Популярный', icon: <Flame className="w-6 h-6" />, color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/50', popular: true },
  { id: 'pkg3', tokens: 2000, stars: 750, label: 'Выгодный', icon: <Gem className="w-6 h-6" />, color: 'from-purple-500/20 to-pink-500/20', borderColor: 'border-purple-500/40' },
  { id: 'pkg4', tokens: 5000, stars: 1500, label: 'Легендарный', icon: <Trophy className="w-6 h-6" />, color: 'from-rose-500/20 to-amber-500/20', borderColor: 'border-rose-500/60' },
];

const ShopPage: React.FC<ShopPageProps> = ({ user }) => {
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  if (!user) return <Navigate to="/login" />;

  const handlePurchase = (pkg: typeof PACKAGES[0]) => {
    setBuyingId(pkg.id);
    
    // Simulate Telegram Stars payment flow
    setTimeout(() => {
      const result = db.purchaseTokens(user.id, pkg.tokens, pkg.stars);
      if (result.success) {
        setSuccess(pkg.tokens);
        setTimeout(() => setSuccess(null), 4000);
      }
      setBuyingId(null);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Success Notification */}
      {success && (
        <div className="fixed top-24 right-6 z-[100] bg-emerald-500 text-black px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8 duration-300">
           <div className="bg-black/20 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6" />
           </div>
           <div>
              <p className="font-black uppercase text-[10px] tracking-widest">Платеж успешно проведен</p>
              <p className="text-xl font-black italic">+{success} VT начислено</p>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="space-y-4 text-center md:text-left">
          <Link to="/profile" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-2 group">
             <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Назад в профиль
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
            Магазин <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Vault</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
            Пополняйте свой баланс с помощью <span className="text-amber-500 font-bold">Telegram Stars</span> и открывайте премиальные возможности нашего каталога.
          </p>
        </div>

        <div className="bg-[#151518] border border-white/5 rounded-[32px] p-8 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ваш Баланс</p>
            <p className="text-4xl font-black text-white italic">{user.tokens.toLocaleString()}<span className="text-amber-500 text-lg ml-1">VT</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`relative flex flex-col bg-gradient-to-br ${pkg.color} border-2 ${pkg.borderColor} rounded-[40px] p-8 transition-all hover:-translate-y-2 group shadow-xl`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 fill-current" /> Популярный выбор
              </div>
            )}
            
            <div className="mb-8">
              <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                {pkg.icon}
              </div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{pkg.label}</h3>
              <p className="text-3xl font-black text-white italic">{pkg.tokens} <span className="text-amber-500 text-base">VT</span></p>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 space-y-6">
              <div className="flex items-center justify-center gap-2 text-2xl font-black text-white italic">
                <span>{pkg.stars}</span>
                <span className="text-amber-400">⭐️</span>
              </div>
              
              <button 
                onClick={() => handlePurchase(pkg)}
                disabled={!!buyingId}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                  pkg.popular ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                }`}
              >
                {buyingId === pkg.id ? (
                  <span className="flex items-center gap-2 animate-pulse"><CreditCard className="w-4 h-4" /> Обработка...</span>
                ) : (
                  <>Купить за {pkg.stars} ⭐️</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BenefitCard 
          icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
          title="Безопасно"
          description="Все платежи проходят через официальный шлюз Telegram Stars. Мы не храним ваши данные."
        />
        <BenefitCard 
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          title="Мгновенно"
          description="Ваши VT будут начислены на баланс сразу после успешного подтверждения транзакции."
        />
        <BenefitCard 
          icon={<Star className="w-6 h-6 text-indigo-500" />}
          title="Бонусы"
          description="Покупая VT, вы повышаете свой рейтинг активности и открываете эксклюзивные титулы."
        />
      </div>

      <div className="mt-20 p-10 bg-[#151518] border border-white/5 rounded-[40px] text-center relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <CreditCard className="w-32 h-32 text-white" />
         </div>
         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Нужна помощь с оплатой?</h2>
         <p className="text-slate-500 max-w-xl mx-auto mb-8 font-medium">
           Если у вас возникли трудности с приобретением звезд или начислением токенов, наша поддержка работает 24/7.
         </p>
         <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2 mx-auto">
            Связаться с поддержкой <ChevronRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-[#151518] border border-white/5 p-8 rounded-[32px] hover:border-white/10 transition-all group">
     <div className="w-12 h-12 bg-[#0a0a0c] border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">{title}</h3>
     <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
  </div>
);

export default ShopPage;
