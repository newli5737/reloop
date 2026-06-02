import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Users, Package, Sparkles, Search, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Sản phẩm giao dịch', value: '1.2M', icon: Package },
    { label: 'Người dùng', value: '300K', icon: Users },
    { label: 'Đơn vị thu mua', value: '50K', icon: TrendingUp },
  ];

  const categories = [
    { name: 'Điện tử', icon: '📱', color: 'from-blue-500 to-blue-600' },
    { name: 'Thời trang', icon: '👔', color: 'from-purple-500 to-purple-600' },
    { name: 'Nội thất', icon: '🪑', color: 'from-amber-500 to-amber-600' },
    { name: 'Sách', icon: '📚', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Đồ chơi', icon: '🎮', color: 'from-pink-500 to-pink-600' },
    { name: 'Xe cộ', icon: '🚗', color: 'from-red-500 to-red-600' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Định giá thông minh',
      description: 'Công nghệ AI đánh giá chính xác giá trị sản phẩm của bạn',
    },
    {
      icon: Shield,
      title: 'Giao dịch an toàn',
      description: 'Bảo vệ 100% quyền lợi người mua và người bán',
    },
    {
      icon: Zap,
      title: 'Trao đổi nhanh chóng',
      description: 'Kết nối tức thì với hàng nghìn người dùng mỗi ngày',
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <div className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border-2 border-emerald-500/30 backdrop-blur-xl">
                <p className="text-emerald-400 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Nền tảng marketplace đồ cũ #1 Việt Nam
                </p>
              </div>
            </div>

            <h1
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Tái sinh
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
                Giá trị mới
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Kết nối người mua, người bán và đơn vị thu mua chuyên nghiệp.
              <br />
              Biến đồ cũ thành cơ hội mới.
            </p>

            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-3 shadow-2xl">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm, danh mục..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <Link
                    to={`/marketplace?q=${searchQuery}`}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Tìm kiếm
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6 shadow-xl hover:scale-105 transition-transform"
                >
                  <stat.icon className="w-8 h-8 text-emerald-400 mb-3 mx-auto" />
                  <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {stat.value}+
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Khám phá danh mục
            </h2>
            <p className="text-xl text-slate-400">Tìm kiếm sản phẩm theo sở thích của bạn</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6 text-center hover:border-emerald-500/50 transition-all shadow-xl">
                  <div className={`text-5xl mb-3 bg-gradient-to-r ${category.color} p-4 rounded-xl inline-block border-2 border-white/20`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-navy/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Vì sao chọn RELOOP?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-8 shadow-xl hover:border-emerald-500/50 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl border-2 border-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                  <feature.icon className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-3xl border-2 border-emerald-500/30 p-12 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Tham gia cộng đồng hơn 300,000 người đang tái sinh giá trị mỗi ngày
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Khám phá ngay
              </Link>
              <Link
                to="/post"
                className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Đăng tin miễn phí
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
