import { Link, useLocation, useNavigate } from 'react-router';
import { Search, Menu, X, User, LogOut, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.messages.getUnreadCount().then((r) => setUnreadCount(r.count)).catch(() => {});
      const interval = setInterval(() => {
        api.messages.getUnreadCount().then((r) => setUnreadCount(r.count)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
    setUnreadCount(0);
  }, [user]);

  const navLinks = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/collectors', label: 'Thu Mua' },
    ...(user && user.role !== 'ADMIN' ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
    ...(user && user.role !== 'ADMIN' ? [{ path: '/messages', label: 'Tin nhắn' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-[1600px] mx-auto">
        <div
          className="relative backdrop-blur-xl bg-white/5 border-2 border-white/10 rounded-2xl shadow-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl border-2 border-white/20 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-navy" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                    <circle cx="12" cy="14" r="3"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    RELOOP
                  </span>
                </h1>
                <p className="text-xs text-slate-400 -mt-1">Tái sinh giá trị</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-500 text-navy shadow-lg shadow-emerald-500/30 border-2 border-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {link.label === 'Tin nhắn' ? (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      Tin nhắn
                      {unreadCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-white/10 transition-all text-slate-300 hover:text-white">
                <Search className="w-5 h-5" />
              </button>

              {user ? (
                <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-white/10 transition-all text-slate-300 hover:text-white flex items-center gap-2"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-navy text-xs font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-semibold max-w-[100px] truncate hidden lg:inline">{user.name}</span>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-navy/95 rounded-xl border-2 border-white/10 shadow-2xl overflow-hidden z-[60]"
                        >
                          <div className="p-3 border-b border-white/10">
                            <p className="font-semibold text-sm truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                          {user.role !== 'ADMIN' && (
                            <>
                              <Link
                                to="/profile"
                                onClick={() => setShowUserMenu(false)}
                                className="block px-4 py-3 text-sm hover:bg-white/5 transition-all flex items-center gap-2"
                              >
                                <User className="w-4 h-4" />
                                Hồ sơ cá nhân
                              </Link>
                              <Link
                                to="/messages"
                                onClick={() => setShowUserMenu(false)}
                                className="block px-4 py-3 text-sm hover:bg-white/5 transition-all flex items-center gap-2"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Tin nhắn
                                {unreadCount > 0 && (
                                  <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                    {unreadCount}
                                  </span>
                                )}
                              </Link>
                              <Link
                                to="/dashboard"
                                onClick={() => setShowUserMenu(false)}
                                className="block px-4 py-3 text-sm hover:bg-white/5 transition-all"
                              >
                                Dashboard
                              </Link>
                            </>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-sm text-left hover:bg-white/5 transition-all text-red-400 flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-3 rounded-xl bg-white/5 text-white font-semibold border-2 border-white/10 hover:bg-white/10 transition-all"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-white/10 transition-all text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t-2 border-white/10"
              >
                <div className="p-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                        isActive(link.path)
                          ? 'bg-emerald-500 text-navy border-2 border-emerald-400'
                          : 'text-slate-300 hover:bg-white/5 border-2 border-transparent'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user ? (
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 rounded-lg text-red-400 hover:bg-white/5 text-left"
                    >
                      Đăng xuất
                    </button>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-center bg-white/5">
                        Đăng nhập
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg bg-emerald-500 text-navy font-bold text-center">
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
