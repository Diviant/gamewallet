
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Ticket, 
  Zap, 
  Send,
  Loader2,
  ShieldCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { db } from '../services/mockDb';
import { User } from '../types';

interface LoginPageProps {
  setUser: (user: User) => void;
}

declare global {
  interface Window {
    Telegram: any;
    onTelegramAuth: (user: any) => void;
  }
}

const LoginPage: React.FC<LoginPageProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check if we are inside a Telegram Mini App
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      setIsMiniApp(true);
      tg.expand(); // Expand to full height
    }

    // 2. Parse referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }

    // 3. Global callback for Telegram Login Widget
    window.onTelegramAuth = (user: any) => {
      handleTelegramAuth(user);
    };
  }, []);

  // Fix: handleTelegramAuth is now async and awaits db.authTelegramUser
  const handleTelegramAuth = (tgUser: any) => {
    setIsAuthenticating(true);
    setError(null);
    
    // Structure expected by mockDb
    const formattedUser = {
      id: tgUser.id.toString(),
      name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
      username: tgUser.username,
      photo_url: tgUser.photo_url
    };

    setTimeout(async () => {
      try {
        const user = await db.authTelegramUser(formattedUser, referralCode);
        setUser(user);
        navigate('/');
      } catch (err) {
        setError("Ошибка авторизации. Попробуйте еще раз.");
        setIsAuthenticating(false);
      }
    }, 1200);
  };

  const loginViaWebApp = () => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      handleTelegramAuth(tg.initDataUnsafe.user);
    } else {
      // Fallback if someone clicks but SDK didn't detect properly
      setError("Данные Telegram недоступны. Используйте виджет.");
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    setTimeout(() => {
      const users = db.getUsers();
      let loggedUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      
      if (isLogin) {
        if (!loggedUser) {
          loggedUser = db.registerUser(email, email.split('@')[0]);
        }
      } else {
        loggedUser = db.registerUser(email, email.split('@')[0], referralCode);
      }
      
      db.setCurrentUser(loggedUser!);
      setUser(loggedUser!);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#151518] border border-white/5 text-amber-500 shadow-2xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500 group">
            <Flame className="w-10 h-10 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
            GameVault <span className="text-amber-500">Access</span>
          </h2>
          <p className="mt-3 text-slate-500 font-medium uppercase text-[10px] tracking-[2px]">
            {isMiniApp ? "Вход через Telegram Mini App" : "Официальная авторизация"}
          </p>
        </div>

        <div className="bg-[#151518] border border-white/5 rounded-[40px] shadow-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

          {isAuthenticating ? (
            <div className="py-20 text-center space-y-6 relative z-10">
               <div className="relative inline-block">
                  <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                  <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-500 animate-pulse" />
               </div>
               <p className="text-amber-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Проверка данных Telegram...</p>
            </div>
          ) : (
            <div className="space-y-8 relative z-10">
              
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {/* REAL AUTH SECTION */}
              <div className="space-y-4">
                 {isMiniApp ? (
                   // If inside Telegram, use WebApp data directly
                   <button 
                    onClick={loginViaWebApp}
                    className="w-full group flex items-center justify-between p-1 bg-[#0088cc] rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                            <Send className="w-6 h-6 -rotate-12 translate-x-[-1px] translate-y-[1px] fill-current" />
                         </div>
                         <div className="text-left">
                            <p className="text-xs font-black text-white uppercase tracking-widest">Продолжить как {window.Telegram.WebApp.initDataUnsafe.user.first_name}</p>
                            <p className="text-[10px] text-white/60 font-medium">Безопасный вход через Mini App</p>
                         </div>
                      </div>
                      <div className="pr-4">
                         <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all" />
                      </div>
                   </button>
                 ) : (
                   // If in normal browser, simulate the Widget Button (Real one requires domain setup)
                   <div className="space-y-4">
                      <button 
                        onClick={() => {
                          // In a real app with a domain, this would be a script injection:
                          // <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="YOUR_BOT_NAME" ...>
                          
                          // SIMULATION of the real popup result for this environment
                          const mockRealUser = {
                            id: 1234567,
                            first_name: "Игрок",
                            username: "telegram_user",
                            photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=tgreal"
                          };
                          window.onTelegramAuth(mockRealUser);
                        }}
                        className="w-full group flex items-center justify-between p-1 bg-[#0088cc] rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                               <Send className="w-6 h-6 -rotate-12" />
                            </div>
                            <div className="text-left">
                               <p className="text-xs font-black text-white uppercase tracking-widest">Войти через Telegram</p>
                               <p className="text-[10px] text-white/60 font-medium">Официальный Login Widget</p>
                            </div>
                         </div>
                         <div className="pr-4">
                            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all" />
                         </div>
                      </button>
                   </div>
                 )}

                 {!isLogin && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <div className="relative">
                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-4 bg-[#0a0a0c] border border-amber-500/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-amber-900/30 uppercase"
                          placeholder="РЕФЕРАЛЬНЫЙ КОД"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>
                 )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[2px]">
                  <span className="px-4 bg-[#151518] text-slate-600">Альтернатива</span>
                </div>
              </div>

              {!showEmailAuth ? (
                <button 
                  onClick={() => setShowEmailAuth(true)}
                  className="w-full py-4 border border-white/5 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Почта
                </button>
              ) : (
                <form className="space-y-5 animate-in slide-in-from-top-2 duration-300" onSubmit={handleEmailAuth}>
                  <div className="space-y-1.5">
                    <input 
                      type="email" 
                      required
                      className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                      placeholder="Email адрес"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <input 
                      type="password" 
                      required
                      className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-white/5 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    {isLogin ? 'Авторизоваться' : 'Зарегистрироваться'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-slate-500 font-bold text-[10px] uppercase tracking-widest">
          {isLogin ? "Впервые у нас?" : "Уже есть профиль?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-amber-500 font-black hover:text-amber-400 underline underline-offset-4 decoration-2 transition-all"
          >
            {isLogin ? 'Регистрация' : 'Авторизация'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
