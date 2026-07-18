import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout, toggleTheme } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Sparkles,
  Search,
  BookOpen,
  History,
  TrendingUp,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  Activity,
  UserCheck
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: any;
  roles: string[];
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, theme } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const navigationItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['User'] },
    { name: 'Dietitian Portal', path: '/dietitian-dashboard', icon: UserCheck, roles: ['Dietitian', 'Nutritionist'] },
    { name: 'Admin Terminal', path: '/admin-dashboard', icon: Activity, roles: ['Admin'] },
    { name: 'AI Planner', path: '/ai-planner', icon: Sparkles, roles: ['User'] },
    { name: 'Food Database', path: '/food-database', icon: Search, roles: ['User', 'Dietitian', 'Nutritionist', 'Admin'] },
    { name: 'Appointments', path: '/appointments', icon: Calendar, roles: ['User'] },
    { name: 'Consult Room', path: '/chat', icon: MessageSquare, roles: ['User', 'Dietitian', 'Nutritionist'] },
    { name: 'My History', path: '/history', icon: History, roles: ['User'] },
    { name: 'Recipes', path: '/recipes', icon: BookOpen, roles: ['User', 'Dietitian', 'Nutritionist'] }
  ];

  const currentRole = user?.role || 'User';
  const allowedNav = navigationItems.filter(item => item.roles.includes(currentRole));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar for Desktop/Laptops */}
      <aside className="hidden lg:flex flex-col w-64 glass-card m-4 mr-0 p-4 border-slate-200/50 dark:border-slate-800/40 relative z-20">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-2 rounded-xl text-white">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-600 dark:from-white dark:to-green-400">
              NutriMind AI
            </h1>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">PRO EDITION</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1">
          {allowedNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-500'} />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Settings */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-2">
          <div className="flex items-center gap-3 px-2">
            {!user?.profilePicture || imgError ? (
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
              </div>
            ) : (
              <img
                src={user.profilePicture}
                alt={user.name}
                onError={() => setImgError(true)}
                className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-bold inline-block">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            Toggle Theme
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content pane */}
      <div className="flex-1 flex flex-col min-w-0 p-4">
        {/* Top Navbar */}
        <header className="flex items-center justify-between glass-card p-4 mb-4 border-slate-200/50 dark:border-slate-800/40 z-10">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-300"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-extrabold text-lg text-emerald-500">NutriMind</h1>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Welcome back,</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg relative text-slate-500"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>

            {/* Notification drop */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 w-80 glass-card p-4 border-slate-200/50 dark:border-slate-800/50 z-30"
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-2 dark:border-slate-800">
                    <span className="font-bold text-sm">Notifications</span>
                    <button className="text-[10px] text-emerald-500 hover:underline">Clear all</button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs">
                      <p className="font-semibold">Hydration Goal Alert</p>
                      <p className="text-slate-400 text-[10px]">Time to log your water intake! Stay hydrated.</p>
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold">AI Insights Ready</p>
                      <p className="text-slate-400 text-[10px]">Your weekly diet review dashboard is ready.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dashboard Pages Space */}
        <main className="flex-1 overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-slate-900 p-6 z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-extrabold text-xl text-emerald-500">NutriMind</h1>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {allowedNav.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-3">
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  Toggle Theme
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
