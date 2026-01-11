
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Coins, 
  Star, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Target
} from 'lucide-react';
import { User } from '../types';

interface TasksPageProps {
  user: User | null;
}

const TasksPage: React.FC<TasksPageProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-8">
           <ClipboardList className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Авторизация</h2>
        <p className="text-slate-500 mb-8 font-medium">Войдите в систему, чтобы просматривать доступные задания и зарабатывать Vault Tokens (VT).</p>
        <Link to="/login" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
          Войти
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <Zap className="w-3 h-3" /> Система наград
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Задания</h1>
        <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
          Зарабатывайте токены за активность в сообществе GameVault.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-[#151518] border border-white/5 p-6 rounded-2xl text-center">
          <p className="text-3xl font-black text-white">{user.tokens}<span className="text-cyan-400 text-sm ml-1">VT</span></p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Текущий Баланс</p>
        </div>
        <div className="bg-[#151518] border border-white/5 p-6 rounded-2xl text-center">
          <p className="text-3xl font-black text-white">{user.reviewedServerIds.length}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Отзывов оставлено</p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3">
            <Coins className="w-5 h-5 text-amber-500" /> Как заработать VT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskCard 
              icon={<MessageSquare className="w-6 h-6 text-cyan-400" />}
              title="Написать отзыв"
              reward="+20 VT"
              description="Поделитесь своим мнением о сервере. Доступно один раз для каждого проекта."
              link="/servers"
            />
            <TaskCard 
              icon={<Heart className="w-6 h-6 text-rose-500" />}
              title="Лайк проекту"
              reward="+10 VT"
              description="Добавьте сервер в избранное, чтобы быстро заходить на него."
              link="/servers"
            />
            <TaskCard 
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title="Рефералы"
              reward="+100 VT"
              description="Приглашайте друзей по своему коду. Друг получит +50 VT, а вы — +100 VT."
              link="/profile"
            />
            <TaskCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
              title="Первый вход"
              reward="+50 VT"
              description="Зарегистрируйтесь и подтвердите свой аккаунт в системе GameVault."
              completed={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const TaskCard = ({ icon, title, reward, description, link, completed = false }: { icon: any, title: string, reward: string, description: string, link?: string, completed?: boolean }) => (
  <div className={`p-6 bg-[#151518] border rounded-2xl transition-all ${completed ? 'border-emerald-500/20 opacity-60' : 'border-white/5 hover:border-cyan-500/30'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center">
        {icon}
      </div>
      {completed ? (
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">Выполнено</span>
      ) : (
        <span className="text-xs font-black text-white uppercase italic tracking-tighter">{reward}</span>
      )}
    </div>
    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed mb-4">{description}</p>
    {!completed && link && (
      <Link to={link} className="inline-flex items-center gap-1.5 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors">
        Перейти <ArrowRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

export default TasksPage;
