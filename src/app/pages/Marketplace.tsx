import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal, Heart, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { api, formatPrice, timeAgo, Listing } from '../lib/api';

export default function Marketplace() {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', condition: '' });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.category && filters.category !== 'Tất cả') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.condition) params.condition = filters.condition;
      const data = await api.listings.getAll(params);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Marketplace
            </h1>
            <p className="text-slate-400 text-sm">Khám phá {products.length} sản phẩm đang chờ chủ mới</p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`self-start px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 border-2 transition-all text-sm ${
              showFilters
                ? 'bg-emerald-500 text-navy border-emerald-400'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </button>
        </div>

        <div className="flex gap-5">
          {showFilters && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="shrink-0 backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-5 h-fit sticky top-32 hidden md:block"
            >
              <h3 className="font-bold text-base mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Bộ lọc
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Danh mục</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Tất cả</option>
                    <option>Điện tử</option>
                    <option>Thời trang</option>
                    <option>Nội thất</option>
                    <option>Sách</option>
                    <option>Đồ chơi</option>
                    <option>Xe cộ</option>
                    <option>Thể thao</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Khoảng giá</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Từ"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Đến"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Tình trạng</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="NEW">Như mới</option>
                    <option value="GOOD">Tốt</option>
                    <option value="FAIR">Khá</option>
                    <option value="POOR">Cần sửa chữa</option>
                  </select>
                </div>

                <button
                  onClick={loadProducts}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 text-sm hover:scale-105 transition-all"
                >
                  Áp dụng
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center text-slate-400 py-20">Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-slate-400 py-20">Chưa có sản phẩm nào</div>
            ) : (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
              >
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Listing; index: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="h-full backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition-all">
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={product.images[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            />
            {discount > 0 && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-navy text-xs font-bold rounded-md">
                -{discount}%
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold rounded">
                {product.category}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {timeAgo(product.createdAt)}
              </span>
            </div>

            <h3 className="font-semibold text-[15px] mb-2 text-white line-clamp-2 leading-snug">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold text-emerald-400">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>
              <span className="shrink-0 ml-2 px-1.5 py-0.5 bg-white/5 rounded text-slate-400">
                {product.conditionLabel}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-navy text-[10px] font-bold">
                {product.seller.name.charAt(0)}
              </div>
              <span className="text-xs text-slate-400 truncate">{product.seller.name}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
