
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Cpu, 
  Users, 
  Coins, 
  ChevronRight,
  Gamepad2,
  Lock,
  BarChart3,
  Send,
  Database,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const sqlSchema = `-- SQL Schema for Supabase
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  tokens INTEGER DEFAULT 50
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-amber-500/5 via-indigo-600/5 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

      <section className="relative pt-10 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest">
            <Database className="w-3.5 h-3.5" /> Real Database Active
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
            GameVault <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500">Live Infrastructure</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Мы перешли на реальную архитектуру. Теперь ваши данные хранятся в 
            децентрализованном облаке Supabase с защитой корпоративного уровня.
          </p>
        </div>
      </section>

      {/* Tech Details */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-[#151518] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500 border border-cyan-500/20">
                 <Terminal className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Backend Architecture</h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">PostgreSQL Engine</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                       <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                       <h4 className="text-white font-black uppercase italic tracking-widest text-xs mb-1">Row Level Security</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">Каждый пользователь имеет доступ только к своим данным через политики RLS в Postgres.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                       <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                       <h4 className="text-white font-black uppercase italic tracking-widest text-xs mb-1">Edge Functions</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">Обработка сложной логики (транзакции, ROI) происходит на Edge-серверах с минимальной задержкой.</p>
                    </div>
                 </div>
              </div>

              <div className="relative group">
                 <div className="absolute top-2 right-4 z-10">
                    <button 
                      onClick={copySql}
                      className="p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                       {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                 </div>
                 <pre className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 text-[10px] text-cyan-500/70 font-mono overflow-x-auto selection:bg-cyan-500/20">
                    {sqlSchema}
                    <br />-- ... Full schema in documentation
                 </pre>
              </div>
           </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Link to="/whitepaper" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
          Полная документация <ChevronRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
