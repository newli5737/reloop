import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { toast } from 'sonner';

export default function PostListing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    description: '',
    location: '',
    images: [] as string[],
  });

  const steps = [
    { number: 1, title: 'Hình ảnh', description: 'Tải lên ảnh sản phẩm' },
    { number: 2, title: 'Thông tin', description: 'Mô tả sản phẩm' },
    { number: 3, title: 'Giá cả', description: 'Định giá sản phẩm' },
    { number: 4, title: 'Xác nhận', description: 'Kiểm tra và đăng' },
  ];

  const categories = ['Điện tử', 'Thời trang', 'Nội thất', 'Sách', 'Đồ chơi', 'Xe cộ', 'Thể thao', 'Khác'];

  const conditions = [
    { value: 'NEW', label: 'Như mới', description: 'Chưa qua sử dụng hoặc dùng rất ít' },
    { value: 'GOOD', label: 'Tốt', description: 'Đã qua sử dụng nhưng còn tốt' },
    { value: 'FAIR', label: 'Khá', description: 'Có dấu hiệu sử dụng rõ ràng' },
    { value: 'POOR', label: 'Cần sửa chữa', description: 'Cần bảo trì hoặc sửa chữa' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles([...imageFiles, ...newFiles]);
      const previews = newFiles.map((file) => URL.createObjectURL(file));
      setFormData({ ...formData, images: [...formData.images, ...previews] });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.condition || !formData.price || !formData.location) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await api.upload(imageFiles);
      }

      await api.listings.create({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price.replace(/\D/g, '')),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice.replace(/\D/g, '')) : undefined,
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images: imageUrls,
      });

      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng tin thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Đăng tin bán đồ
          </h1>
          <p className="text-xl text-slate-400">Tìm chủ mới cho sản phẩm của bạn</p>
        </motion.div>

        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {steps.map((step) => (
              <div key={step.number} className="relative z-10 flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                    currentStep >= step.number
                      ? 'bg-emerald-500 border-emerald-400 text-navy'
                      : 'bg-navy border-white/20 text-slate-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
                </motion.div>
                <div className="absolute top-14 text-center w-32">
                  <div className={`font-semibold text-sm ${currentStep >= step.number ? 'text-white' : 'text-slate-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 hidden md:block">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="backdrop-blur-xl bg-white/5 rounded-3xl border-2 border-white/10 p-8 shadow-2xl"
          >
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Tải lên hình ảnh sản phẩm
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/10">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-500 text-navy text-xs font-bold rounded">
                          Ảnh chính
                        </div>
                      )}
                    </div>
                  ))}

                  {formData.images.length < 8 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col items-center justify-center bg-white/5 hover:bg-white/10">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-400">Tải ảnh lên</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4 text-sm text-slate-300">
                  <strong>Mẹo:</strong> Tải lên ít nhất 1 ảnh rõ nét để tăng độ tin cậy
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Thông tin sản phẩm
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tiêu đề</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: iPhone 13 Pro Max 256GB"
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Danh mục</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Vị trí</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="VD: Quận Ba Đình, Hà Nội"
                        className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Tình trạng</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {conditions.map((cond) => (
                        <button
                          key={cond.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, condition: cond.value })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.condition === cond.value
                              ? 'bg-emerald-500/20 border-emerald-500'
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="font-semibold mb-1">{cond.label}</div>
                          <div className="text-sm text-slate-400">{cond.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Định giá sản phẩm
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Giá bán (VNĐ)</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="18500000"
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-2xl font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Giá gốc (tuỳ chọn)</label>
                    <input
                      type="text"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="32000000"
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Xác nhận thông tin
                </h2>

                <div className="space-y-6">
                  {formData.images.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-4">
                      {formData.images.slice(0, 3).map((img, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-white/10">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="backdrop-blur-xl bg-white/5 rounded-xl border-2 border-white/10 p-6 space-y-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Tiêu đề</div>
                      <div className="font-semibold text-lg">{formData.title || '—'}</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Danh mục</div>
                        <div className="font-semibold">{formData.category || '—'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Tình trạng</div>
                        <div className="font-semibold">
                          {conditions.find((c) => c.value === formData.condition)?.label || '—'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Giá bán</div>
                      <div className="text-3xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>
                        {formData.price ? `${Number(formData.price.replace(/\D/g, '')).toLocaleString('vi-VN')} đ` : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 text-sm text-amber-200">
                    Tin đăng sẽ được admin duyệt trước khi hiển thị trên Marketplace.
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                    {submitting ? 'Đang đăng...' : 'Đăng tin ngay'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-white/5 text-white font-semibold rounded-xl border-2 border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
          )}

          {currentStep < steps.length && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
            >
              Tiếp theo
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
