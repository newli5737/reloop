import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Eye, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { api, formatPrice, Listing } from '../lib/api';
import { toast } from 'sonner';

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  ACTIVE: 'Đang bán',
  SOLD: 'Đã bán',
  REJECTED: 'Từ chối',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  SOLD: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    try {
      const data = await api.listings.getMy();
      setListings(data);
    } catch {
      toast.error('Không thể tải tin đăng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tin đăng này?')) return;
    try {
      await api.listings.delete(id);
      loadListings();
    } catch {
      toast.error('Lỗi xóa tin đăng');
    }
  };

  const handleMarkSold = async (id: string) => {
    try {
      await api.listings.update(id, { status: 'SOLD' });
      loadListings();
    } catch {
      toast.error('Lỗi cập nhật');
    }
  };

  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const activeCount = listings.filter((l) => l.status === 'ACTIVE').length;
  const pendingCount = listings.filter((l) => l.status === 'PENDING').length;
  const soldCount = listings.filter((l) => l.status === 'SOLD').length;

  const stats = [
    { label: 'Tin đang bán', value: activeCount, icon: Package, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Chờ duyệt', value: pendingCount, icon: Clock, color: 'from-amber-500 to-amber-600' },
    { label: 'Đã bán', value: soldCount, icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: 'Tổng lượt xem', value: totalViews.toLocaleString(), icon: Eye, color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 pb-12">
      <div className="max-w-[1600px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Dashboard
              </h1>
              <p className="text-slate-400">Quản lý tin đăng của bạn</p>
            </div>
            <Link
              to="/post"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-navy font-bold rounded-xl border-2 border-amber-400 shadow-lg hover:scale-105 transition-all"
            >
              + Đăng tin mới
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6 shadow-xl"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} border-2 border-white/20 shadow-lg mb-4`}>
                <stat.icon className="w-6 h-6 text-navy" />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Tin đăng của tôi
          </h2>

          {loading ? (
            <div className="text-center text-slate-400 py-12">Đang tải...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Bạn chưa có tin đăng nào</p>
              <Link to="/post" className="text-emerald-400 hover:underline font-semibold">
                Đăng tin đầu tiên →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="backdrop-blur-xl bg-white/5 rounded-xl border-2 border-white/10 p-4 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={listing.images[0] || 'https://via.placeholder.com/96?text=No+Image'}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-lg truncate">{listing.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${statusColors[listing.status]}`}>
                          {statusLabels[listing.status]}
                        </span>
                      </div>

                      <div className="text-2xl font-bold text-emerald-400 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        {formatPrice(listing.price)}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {listing.views.toLocaleString()} lượt xem
                        </div>
                        <span>{listing.category}</span>
                        <span>{listing.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {listing.status === 'ACTIVE' && (
                        <Link
                          to={`/product/${listing.id}`}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border-2 border-white/10 transition-all"
                          title="Xem"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      )}
                      {listing.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleMarkSold(listing.id)}
                          className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-sm font-semibold px-4"
                        >
                          Đã bán
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl border-2 border-white/10 transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
