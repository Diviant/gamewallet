
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Cpu, 
  Coins, 
  TrendingUp, 
  Users, 
  Target,
  Layers, 
  Rocket, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  Send,
  Share2,
  Briefcase,
  PieChart,
  BarChart3,
  Wallet,
  Building2,
  BadgePercent,
  TrendingDown,
  ArrowRight,
  // Added Star icon to fix 'Cannot find name Star' error
  Star
} from 'lucide-react';

const WhitepaperPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const telegramPostText = `🚀 GameVault — Революция в мире приватных игровых серверов! 🎮

Устали от поиска качественных проектов среди тысяч однотипных серверов? GameVault меняет правила игры! 🔥

💎 Наша экосистема:
🔹 Умный поиск на базе Gemini AI — находим лучшие миры раньше всех!
🔹 Vault Tokens (VT) — реальная валюта за вашу активность.
🔹 Vault Ventures — инвестируйте в любимые сервера и получайте ROI до 20%!
🔹 Глобальный охват — от классики Lineage 2 до GTA 5 RP и Minecraft.

📈 Почему мы?
✅ Прозрачный рейтинг на основе реальных данных.
✅ Система достижений и уровней для игроков.
✅ Маркетплейс эксклюзивных наград.
✅ Защита от накруток и фейковых отзывов.

Станьте частью будущего игровой индустрии вместе с нами! 🌟

🔗 Присоединяйся прямо сейчас: ${window.location.origin}
📣 Следи за обновлениями в нашем канале!

#GameVault #Gaming #AI #Investments #PrivateServers`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(telegramPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'GameVault Project',
      text: telegramPostText,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
        window.open(tgUrl, '_blank');
      }
    } else {
      const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
      window.open(tgUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 pb-20">
      {/* Header / Navigation */}
      <div className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Вернуться
          </Link>
          <div className="flex items-center gap-2 text-amber-500 font-black italic uppercase text-xs tracking-tighter">
            <FileText className="w-4 h-4" /> Whitepaper v1.2
          </div>
          <div className="flex items-center gap-2">
            <a href="#pitch" className="hidden md:block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all">
              Investor Pitch
            </a>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-12">
        {/* Hero */}
        <div className="text-center mb-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
            GameVault <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Technical Paper</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Архитектура, экономика и будущее децентрализованного каталога игровых миров.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-24">
          
          {/* Vision Section */}
          <section id="vision" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">01. Видение и Миссия</h2>
            </div>
            <div className="prose prose-invert prose-amber max-w-none text-slate-400 space-y-4 font-medium leading-relaxed">
              <p>
                GameVault — это интеллектуальный хаб для поиска и монетизации участия в приватных игровых сообществах. Мы решаем проблему "информационного шума", где качественные сервера теряются среди сотен однодневных проектов.
              </p>
            </div>
          </section>

          {/* AI Integration */}
          <section id="ai" className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">02. Интеграция Gemini AI</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AiFeature icon={<Globe />} title="Deep Web Crawling" text="Поиск новых серверов в реальном времени через Google Search Grounding." />
              <AiFeature icon={<Layers />} title="Entity Extraction" text="Автоматический парсинг версий, IP и описаний." />
              <AiFeature icon={<ShieldCheck />} title="Fraud Detection" text="ИИ выявляет накрутки и скам-проекты." />
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="space-y-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <Rocket className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">03. Дорожная карта</h2>
            </div>
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-white/5">
              <RoadmapStep period="Q1 2024" title="Foundation" desc="Запуск ядра платформы и базового каталога." completed />
              <RoadmapStep period="Q3 2024" title="AI Intelligence" desc="Внедрение Gemini Pro для автоматической модерации." current />
              <RoadmapStep period="Q4 2024" title="Mobile App" desc="Запуск мобильного приложения." />
            </div>
          </section>

          {/* INVESTOR PITCH SECTION (NEW) */}
          <section id="pitch" className="pt-24 border-t border-white/5 space-y-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <Briefcase className="w-4 h-4" /> Startup Pitch Deck
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                Почему стоит инвестировать в <span className="text-amber-500">GameVault?</span>
              </h2>
            </div>

            {/* Market Opportunity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-500" /> Проблема рынка
                </h3>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li className="flex gap-4">
                    <TrendingDown className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <span><strong className="text-white">Фрагментация:</strong> Рынок приватных серверов ($2B+) разрознен. Игрокам сложно найти качественные проекты.</span>
                  </li>
                  <li className="flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <span><strong className="text-white">Отсутствие доверия:</strong> 40% серверов — это краткосрочные "скамы" с накрученным онлайном.</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <Zap className="w-6 h-6 text-amber-500" /> Наше решение
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Мы создаем <strong className="text-white">"Bloomberg для геймеров"</strong>. Сочетание AI-аналитики для верификации данных и токенизированной экономики для долгосрочного удержания аудитории.
                </p>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-[#151518] to-emerald-500/10 border border-white/5 rounded-[40px] p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <Metric label="TAM (Market Size)" value="$5.2B" desc="Ежегодный оборот донатов в приватных серверах" />
                <Metric label="SAM (Target)" value="$850M" desc="Доля русскоязычного и европейского сегментов" />
                <Metric label="Target SOM" value="15%" desc="Планируемый охват рынка к концу 2025 года" />
              </div>
            </div>

            {/* Business Model */}
            <div className="space-y-10">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter text-center">Бизнес-модель (Revenue Streams)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RevenueItem icon={<BadgePercent />} title="Commissions" desc="3% комиссия с каждой сделки на внутренней бирже VT." />
                <RevenueItem icon={<Star />} title="Premium Ads" desc="Платное продвижение серверов в ТОП-позиции." />
                <RevenueItem icon={<Wallet />} title="Token Sales" desc="Прямая продажа токенов Vault (VT) пользователям." />
                <RevenueItem icon={<Building2 />} title="B2B API" desc="Доступ к аналитике ИИ для крупных игровых сетей." />
              </div>
            </div>

            {/* Call to Action for Investors */}
            <div className="bg-amber-500 rounded-[40px] p-12 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter mb-4">Round A: Открыто для инвестиций</h3>
              <p className="text-black/70 font-bold max-w-xl mx-auto mb-8">
                Мы ищем стратегических партнеров для масштабирования на рынок Южной Америки и Азии. Объем раунда: $1.2M.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-10 py-5 bg-black text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
                  Получить Pitch Deck <Download className="w-4 h-4" />
                </button>
                <button className="px-10 py-5 bg-white/20 backdrop-blur-md text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-white/30 transition-all">
                  Связаться с CEO
                </button>
              </div>
            </div>
          </section>

          {/* Section 6: Telegram Promo */}
          <section id="promo" className="space-y-10 pb-20 pt-10 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] border border-[#0088cc]/20">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Telegram Promo</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Ready-to-post description</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <button 
                  onClick={copyToClipboard}
                  className={`flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    copied 
                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {copied ? <><Check className="w-4 h-4" /> Скопировано</> : <><Copy className="w-4 h-4" /> Копировать</>}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-[#0088cc] text-white hover:bg-[#0077bb] shadow-[0_0_20px_rgba(0,136,204,0.2)] transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" /> Поделиться
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0088cc]/20 to-[#0088cc]/5 rounded-[32px] blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#151518] border border-white/10 rounded-[32px] p-8 md:p-10 font-sans shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white">
                      <Zap className="w-5 h-5 fill-current" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-sm font-bold text-white leading-none">GameVault Official</p>
                      <p className="text-[10px] text-slate-500">bot, 1.2 MB</p>
                   </div>
                </div>
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-base md:text-lg font-medium selection:bg-[#0088cc]/30">
                  {telegramPostText}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">12:45 PM • GameVault News</span>
                   <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                   </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const AiFeature = ({ icon, title, text }: { icon: any, title: string, text: string }) => (
  <div className="bg-[#151518] border border-white/5 p-8 rounded-[32px] space-y-4 hover:border-cyan-500/30 transition-all">
    <div className="text-cyan-500">{icon}</div>
    <h4 className="text-white font-black uppercase italic tracking-widest text-[10px]">{title}</h4>
    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{text}</p>
  </div>
);

const RoadmapStep = ({ period, title, desc, completed = false, current = false }: { period: string, title: string, desc: string, completed?: boolean, current?: boolean }) => (
  <div className="relative pl-12">
    <div className={`absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
      completed ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
      current ? 'bg-amber-500 border-amber-500 text-black animate-pulse' : 'bg-[#0a0a0c] border-white/10 text-slate-700'
    }`}>
      {completed ? <CheckCircle2 className="w-5 h-5" /> : current ? <Zap className="w-5 h-5 fill-current" /> : <div className="w-2 h-2 rounded-full bg-current" />}
    </div>
    <div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${current ? 'text-amber-500' : 'text-slate-600'}`}>{period}</span>
      <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{title}</h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Metric = ({ label, value, desc }: { label: string, value: string, desc: string }) => (
  <div className="text-center md:text-left">
    <p className="text-amber-500 text-3xl md:text-5xl font-black italic tracking-tighter mb-2">{value}</p>
    <p className="text-white text-sm font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-slate-500 text-xs font-medium">{desc}</p>
  </div>
);

const RevenueItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-[24px] hover:border-amber-500/30 transition-all group">
    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-white text-xs font-black uppercase tracking-widest mb-2">{title}</h4>
    <p className="text-slate-500 text-[10px] font-medium leading-relaxed">{desc}</p>
  </div>
);

export default WhitepaperPage;
