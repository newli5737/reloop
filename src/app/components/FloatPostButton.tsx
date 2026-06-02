import { Link, useLocation } from 'react-router';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const HIDDEN_PATHS = ['/admin', '/login', '/register'];

export default function FloatPostButton() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user || user.role === 'ADMIN' || HIDDEN_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        to="/post"
        className="group flex items-center gap-2 pl-5 pr-6 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-navy font-bold border-2 border-amber-400 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105 transition-all"
        style={{ fontFamily: 'var(--font-heading)' }}
        title="Đăng tin bán đồ"
      >
        <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <span className="hidden sm:inline text-base">Đăng tin</span>
      </Link>
    </motion.div>
  );
}
