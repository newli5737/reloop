import { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
} from 'lucide-react';

const collectors = [
  {
    id: 1,
    name: 'Thu Mua Đồ Cũ Hà Nội',
    rating: 4.9,
    reviews: 342,
    location: 'Hà Nội',
    verified: true,
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    categories: ['Điện tử', 'Nội thất', 'Xe cộ'],
    responseTime: '< 30 phút',
    totalPurchases: 1240,
    description: 'Thu mua đồ cũ uy tín tại Hà Nội. Giá cao, thanh toán nhanh, đến tận nơi.',
  },
  {
    id: 2,
    name: 'Green Recycle',
    rating: 4.8,
    reviews: 287,
    location: 'TP. HCM',
    verified: true,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
    categories: ['Điện tử', 'Thời trang', 'Sách'],
    responseTime: '< 1 giờ',
    totalPurchases: 980,
    description: 'Chuyên thu mua đồ cũ các loại tại TP. HCM với giá tốt nhất thị trường.',
  },
  {
    id: 3,
    name: 'Tech Buyback Center',
    rating: 5.0,
    reviews: 156,
    location: 'Đà Nẵng',
    verified: true,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    categories: ['Điện tử'],
    responseTime: '< 15 phút',
    totalPurchases: 560,
    description: 'Chuyên thu mua thiết bị điện tử, laptop, điện thoại với giá cao nhất.',
  },
];

export default function CollectorPage() {
  const [selectedCollector, setSelectedCollector] = useState<number | null>(null);
  const [estimateData, setEstimateData] = useState({
    category: '',
    brand: '',
    condition: '',
    description: '',
  });
  const [showEstimate, setShowEstimate] = useState(false);

  return (
    <div className="min-h-screen pt-32 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Thu Mua Đồ Cũ
          </h1>
          <p className="text-xl text-slate-400">Kết nối với các đơn vị thu mua uy tín, thanh toán nhanh chóng</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {collectors.map((collector, index) => (
              <motion.div
                key={collector.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 overflow-hidden shadow-xl hover:border-emerald-500/50 transition-all"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img src={collector.image} alt="" className="w-full h-64 md:h-full object-cover" />
                  </div>

                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            {collector.name}
                          </h3>
                          {collector.verified && (
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-navy" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{collector.rating}</span>
                            <span className="text-slate-400">({collector.reviews} đánh giá)</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-4 h-4" />
                            {collector.location}
                          </div>
                        </div>

                        <p className="text-slate-300 mb-4">{collector.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {collector.categories.map((cat) => (
                            <span
                              key={cat}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/30"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>
                              {collector.totalPurchases}
                            </div>
                            <div className="text-xs text-slate-400">Giao dịch</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>
                              {collector.rating}
                            </div>
                            <div className="text-xs text-slate-400">Đánh giá</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-sm font-bold text-emerald-400">
                              {collector.responseTime}
                            </div>
                            <div className="text-xs text-slate-400">Phản hồi</div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5" />
                            Liên hệ
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCollector(collector.id);
                              setShowEstimate(true);
                            }}
                            className="flex-1 px-6 py-3 bg-white/5 text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <DollarSign className="w-5 h-5" />
                            Định giá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6 shadow-xl sticky top-32">
              <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Định giá sơ bộ
              </h3>

              {!showEstimate ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Danh mục</label>
                    <select
                      value={estimateData.category}
                      onChange={(e) => setEstimateData({ ...estimateData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Chọn danh mục</option>
                      <option>Điện tử</option>
                      <option>Thời trang</option>
                      <option>Nội thất</option>
                      <option>Sách</option>
                      <option>Xe cộ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Thương hiệu</label>
                    <input
                      type="text"
                      value={estimateData.brand}
                      onChange={(e) => setEstimateData({ ...estimateData, brand: e.target.value })}
                      placeholder="VD: Apple, Samsung..."
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Tình trạng</label>
                    <select
                      value={estimateData.condition}
                      onChange={(e) => setEstimateData({ ...estimateData, condition: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Chọn tình trạng</option>
                      <option>Như mới</option>
                      <option>Tốt</option>
                      <option>Khá</option>
                      <option>Cần sửa chữa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
                    <textarea
                      value={estimateData.description}
                      onChange={(e) => setEstimateData({ ...estimateData, description: e.target.value })}
                      placeholder="Mô tả chi tiết sản phẩm..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => setShowEstimate(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                  >
                    Nhận định giá
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border-2 border-emerald-500/30 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold">Giá ước tính</h4>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-emerald-400 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        12-15M
                      </div>
                      <div className="text-sm text-slate-400">VNĐ</div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giá thấp nhất:</span>
                        <span className="font-semibold">12,000,000 đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giá trung bình:</span>
                        <span className="font-semibold text-emerald-400">13,500,000 đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giá cao nhất:</span>
                        <span className="font-semibold">15,000,000 đ</span>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 rounded-xl border-2 border-white/10 p-4">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-400" />
                      Đơn vị quan tâm
                    </h4>
                    <div className="space-y-2 text-sm">
                      {collectors.slice(0, 2).map((collector) => (
                        <div key={collector.id} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {collector.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-navy font-bold rounded-xl border-2 border-amber-400 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Đặt lịch thu mua
                  </button>

                  <button
                    onClick={() => setShowEstimate(false)}
                    className="w-full px-6 py-3 bg-white/5 text-white font-semibold rounded-xl border-2 border-white/10 hover:bg-white/10 transition-all"
                  >
                    Định giá lại
                  </button>
                </div>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6 shadow-xl">
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Lợi ích thu mua
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Thanh toán nhanh chóng, an toàn</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Đến tận nơi, không mất phí</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Giá thu mua cạnh tranh nhất</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Xử lý nhanh chóng trong 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
