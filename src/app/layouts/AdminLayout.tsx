import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router';
import { Shield, LayoutDashboard, Package, Users, IdCard, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, AdminStats } from '../lib/api';

const navItems = [
  { to: '/admin/overview', label: 'Tổng quan', icon: LayoutDashboard, badgeKey: null as keyof AdminStats | null },
  { to: '/admin/listings', label: 'Tin đăng', icon: Package, badgeKey: 'pendingListings' as const },
  { to: '/admin/users', label: 'Người dùng', icon: Users, badgeKey: null },
  { to: '/admin/verifications', label: 'Xác thực CCCD', icon: IdCard, badgeKey: 'pendingVerifications' as const },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.admin.stats().then(setStats).catch(() => {});
    const interval = setInterval(() => api.admin.stats().then(setStats).catch(() => {}), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#0c0c0e] text-zinc-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-zinc-800 bg-[#09090b]">
        <div className="px-5 py-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide">RELOOP</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.badgeKey && stats && (stats[item.badgeKey] ?? 0) > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {stats[item.badgeKey]}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-zinc-800 space-y-1">
          <Link
            to="/marketplace"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Xem website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur flex items-center justify-between px-4 md:px-6">
          {/* Mobile nav */}
          <div className="flex md:hidden gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                    isActive ? 'bg-violet-600 text-white' : 'text-zinc-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="hidden md:block text-xs text-zinc-600">Hệ thống quản trị RELOOP</div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
              <p className="text-[11px] text-zinc-500">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet context={{ stats, refreshStats: () => api.admin.stats().then(setStats) }} />
        </main>
      </div>
    </div>
  );
}
