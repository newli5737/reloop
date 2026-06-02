import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      if (loggedIn.role === 'ADMIN') {
        logout();
        toast.error('Tài khoản quản trị — đăng nhập tại /admin/login');
        return;
      }
      navigate('/marketplace');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 rounded-3xl border-2 border-white/10 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Đăng nhập
          </h1>
          <p className="text-slate-400">Chào mừng trở lại RELOOP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
            Đăng ký ngay
          </Link>
        </p>

        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-400">
          <p className="font-semibold text-white mb-2">Tài khoản demo:</p>
          <p>User: user@reloop.vn / user123</p>
        </div>
      </motion.div>
    </div>
  );
}
