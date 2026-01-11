
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Plus,
  Heart,
  Settings,
  Flame,
  Star,
  Coins,
  Info,
  Layers,
  Home,
  ClipboardList,
  Trophy,
  ShoppingCart,
  TrendingUp,
  ShieldAlert,
  Server as ServerIcon,
  Sun,
  Moon
} from 'lucide-react';
import { User, UserRole } from './types';
import { db } from './services/mockDb';
import { useTheme } from './ThemeContext';

// Pages
import CatalogPage from './pages/CatalogPage';
import ServerDetailsPage from './pages/ServerDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import TasksPage from './pages/TasksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GamesPage from './pages/GamesPage';
import ShopPage from './pages/ShopPage';
import InvestmentsPage from './pages/InvestmentsPage';
import WhitepaperPage from './pages/WhitepaperPage';

const BottomNav = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isActive = (path: string) => location.pathname === path;

  if (isAdmin) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-t border-[var(--border)] px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        <NavLink to="/" icon={<Home className="w-5 h-5" />} label="Инфо" active={isActive('/')} />
        <NavLink to="/servers" icon={<ServerIcon className="w-5 h-5" />} label="Серверы" active={isActive('/servers')} />
        <NavLink to="/invest" icon={<TrendingUp className="w-5 h-5" />} label="Биржа" active={isActive('/invest')} />
        <NavLink to="/shop" icon={<ShoppingCart className="w-5 h-5" />} label="Магазин" active={isActive('/shop')} />
        <NavLink to="/profile" icon={<UserIcon className="w-5 h-5" />} label="Профиль" active={isActive('/profile')} />
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[60px] ${active ? 'text-amber-400' : 'text-slate-500'}`}>
    <div className={`transition-transform duration-300 ${active ? 'scale-110 -translate-y-0.5' : ''}`}>
      {icon}
    </div>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(() => db.getCurrentUser());

  const syncUser = useCallback(() => {
    const currentUser = db.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const unsubscribe = db.subscribe(syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener('gv_db_update', syncUser);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('gv_db_update', syncUser);
    };
  }, [syncUser]);

  const handleLogout = () => {
    db.setCurrentUser(null);
    setUser(null);
    window.location.href = '#/login';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage setUser={setUser} />} />
          <Route path="/admin/*" element={<AdminDashboard user={user} />} />
          
          <Route path="*" element={
            <>
              <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-5xl mx-auto px-4">
                  <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Link to="/" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-all active:scale-95 group">
                        <div className="p-1.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-xl border border-amber-500/30 group-hover:border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                          <Flame className="w-5 h-5 sm:w-6 h-6 text-amber-500" />
                        </div>
                        <span className="hidden min-[380px]:block text-base sm:text-lg font-black tracking-tighter text-white uppercase italic bg-clip-text">GameVault</span>
                      </Link>
                      <div className="hidden sm:flex items-center gap-1 ml-4">
                        <Link to="/servers" className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                          <ServerIcon className="w-3 h-3 text-cyan-400" /> Серверы
                        </Link>
                        <Link to="/invest" className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 ml-1">
                          <TrendingUp className="w-3 h-3 text-indigo-400" /> Биржа
                        </Link>
                        <Link to="/shop" className="px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 ml-1">
                          <ShoppingCart className="w-3 h-3" /> Магазин
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                        className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5 hover:border-white/10"
                      >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </button>
                      {user ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Link to="/invest" className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.05)] hover:border-amber-400 transition-all">
                             <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                             <span className="text-[11px] sm:text-xs font-black text-white">{user.tokens} <span className="text-[9px] sm:text-[10px] text-amber-500/70">VT</span></span>
                             <Plus className="w-2 h-2 text-amber-500 ml-1" />
                          </Link>

                          {user.role === UserRole.ADMIN && (
                            <Link to="/admin" title="Admin Panel" className="p-2 text-cyan-500 hover:text-cyan-400 transition-colors bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                              <ShieldAlert className="w-5 h-5" />
                            </Link>
                          )}
                          <Link to="/profile" title="My Profile" className="flex items-center ml-1 group">
                            <div className="relative">
                              <img 
                                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                                alt={user.name} 
                                className="w-8 h-8 rounded-full border border-white/10 group-hover:border-amber-500 transition-colors object-cover shadow-[0_0_10px_rgba(255,255,255,0.05)]" 
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 border-2 border-[#0a0a0c] rounded-full"></div>
                            </div>
                          </Link>
                          <button onClick={handleLogout} title="Logout" className="hidden sm:block p-2 text-slate-400 hover:text-white transition-colors ml-1">
                            <LogOut className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <Link to="/login" className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-amber-600/10 to-transparent hover:from-amber-600/20 rounded-xl transition-all border border-amber-500/20 uppercase tracking-widest">
                          Вход
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </nav>

              <main className="flex-grow pb-24 sm:pb-0">
                <Routes>
                  <Route path="/" element={<AboutPage />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/shop" element={<ShopPage user={user} />} />
                  <Route path="/invest" element={<InvestmentsPage user={user} />} />
                  <Route path="/servers" element={<CatalogPage />} />
                  <Route path="/server/:id" element={<ServerDetailsPage />} />
                  <Route path="/login" element={<LoginPage setUser={setUser} />} />
                  <Route path="/favorites" element={<FavoritesPage user={user} />} />
                  <Route path="/tasks" element={<TasksPage user={user} />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/whitepaper" element={<WhitepaperPage />} />
                </Routes>
              </main>

              <BottomNav />

              <footer className="hidden sm:block bg-[var(--bg-primary)] border-t border-[var(--border)] py-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <Link to="/" className="flex items-center justify-center gap-2 text-slate-600 hover:text-amber-500 mb-4 italic font-black text-sm tracking-widest transition-colors uppercase group">
                    <span className="group-hover:text-amber-500 transition-colors">GAMEVAULT PROJECT</span>
                  </Link>
                  <div className="flex justify-center gap-6 mb-6">
                     <Link to="/servers" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-amber-500 transition-colors">Каталог</Link>
                     <Link to="/invest" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-amber-500 transition-colors">Биржа</Link>
                     <Link to="/leaderboard" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-amber-500 transition-colors">Лидеры</Link>
                     <Link to="/about" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-amber-500 transition-colors">О нас</Link>
                  </div>
                  <p className="text-slate-600 text-[11px] uppercase tracking-widest">© 2024 Все права защищены</p>
                </div>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
