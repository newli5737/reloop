import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/overview', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      if (loggedIn.role !== 'ADMIN') {
        logout();
        toast.error('Tài khoản không có quyền quản trị');
        return;
      }
      navigate('/admin/overview');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role === 'ADMIN') return null;

  return (
    <div className="min-h-screen flex bg-[#0c0c0e]">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#09090b] border-r border-zinc-800 flex-col justify-center px-16">
        <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">RELOOP Admin</h1>
        <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
          Cổng quản trị hệ thống — duyệt tin đăng, quản lý người dùng và xác thực danh tính.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 max-w-sm">
          {['Quản lý tin đăng', 'Duyệt CCCD', 'Quản lý user', 'Thống kê'].map((t) => (
            <div key={t} className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">RELOOP Admin</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Đăng nhập quản trị</h2>
          <p className="text-zinc-500 text-sm mb-8">Chỉ dành cho tài khoản Admin</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@reloop.vn"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Đang đăng nhập...' : 'Vào Admin Console'}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-xs mt-8">
            Người dùng thường?{' '}
            <a href="/login" className="text-violet-400 hover:underline">
              Đăng nhập tại đây
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
