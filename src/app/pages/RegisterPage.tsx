import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, name: form.name, phone: form.phone || undefined });
      navigate('/marketplace');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng ký thất bại');
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
            Đăng ký
          </h1>
          <p className="text-slate-400">Tạo tài khoản RELOOP miễn phí</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Họ tên</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Số điện thoại (tuỳ chọn)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0912345678"
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
            <UserPlus className="w-5 h-5" />
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Đăng nhập
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
