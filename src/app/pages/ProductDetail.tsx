import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Share2,
  MapPin,
  Clock,
  MessageCircle,
  ShoppingCart,
  CheckCircle2,
  ArrowLeft,
  Send,
  Trash2,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';
import { api, formatPrice, timeAgo, Listing, Comment } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [product, setProduct] = useState<Listing | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([api.listings.getById(id), api.comments.getByListing(id)])
      .then(([listing, cmts]) => {
        setProduct(listing);
        setComments(cmts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim() || !id) return;
    setSubmittingComment(true);
    try {
      const comment = await api.comments.create(id, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gửi bình luận thất bại');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.comments.delete(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      toast.error('Không thể xóa bình luận');
    }
  };

  const handleMessage = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!id) return;
    setMessaging(true);
    try {
      const conv = await api.messages.startConversation(id);
      navigate(`/messages?id=${conv.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể bắt đầu trò chuyện');
    } finally {
      setMessaging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center text-slate-400">
        Đang tải...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">{error || 'Không tìm thấy sản phẩm'}</p>
        <Link to="/marketplace" className="text-emerald-400 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại Marketplace
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOwner = user?.id === product.seller.id;

  return (
    <div className="min-h-screen pt-32 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-32">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl mb-4">
                <div className="relative aspect-square">
                  <img
                    src={product.images[selectedImage] || 'https://via.placeholder.com/800?text=No+Image'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <div className="px-4 py-2 bg-amber-500 text-navy font-bold rounded-full border-2 border-amber-400 shadow-lg">
                        -{discount}%
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="p-3 bg-black/50 backdrop-blur-xl rounded-full hover:bg-black/70 transition-all border-2 border-white/20"
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <button className="p-3 bg-black/50 backdrop-blur-xl rounded-full hover:bg-black/70 transition-all border-2 border-white/20">
                      <Share2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-emerald-500 scale-105' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-semibold rounded-full border border-emerald-500/30">
                    {product.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {timeAgo(product.createdAt)}
                  </span>
                  <span className="text-slate-400">{product.views.toLocaleString()} lượt xem</span>
                </div>

                <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {product.location}
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">{product.conditionLabel}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 col-span-2">
                  <ShoppingCart className="w-5 h-5" />
                  Mua ngay
                </button>
                {!isOwner && (
                  <button
                    onClick={handleMessage}
                    disabled={messaging}
                    className="px-6 py-4 bg-white/5 text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-50"
                    title="Nhắn tin người bán"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6">
                <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Mô tả</h3>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">{product.description}</p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6">
                <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Thông tin người bán</h3>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {product.seller.avatar ? (
                      <img src={product.seller.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-navy text-2xl font-bold">
                        {product.seller.name.charAt(0)}
                      </div>
                    )}
                    {product.seller.verificationStatus === 'VERIFIED' && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-navy flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-navy" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{product.seller.name}</h4>
                      {product.seller.verificationStatus === 'VERIFIED' && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded border border-emerald-500/30">
                          Đã xác thực
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      {product.seller.phone && <div>SĐT: {product.seller.phone}</div>}
                    </div>
                    {!isOwner && (
                      <button
                        onClick={handleMessage}
                        disabled={messaging}
                        className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 text-sm font-semibold hover:bg-emerald-500/30 transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {messaging ? 'Đang mở...' : 'Nhắn tin người bán'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-white/10 p-6"
        >
          <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Bình luận ({comments.length})
          </h3>

          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
              disabled={!user}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!user || submittingComment || !newComment.trim()}
              className="px-4 py-2.5 bg-emerald-500 text-navy rounded-xl font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Chưa có bình luận nào</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-navy text-xs font-bold shrink-0">
                    {comment.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm">{comment.user.name}</span>
                      <span className="text-xs text-slate-500">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{comment.content}</p>
                  </div>
                  {(user?.id === comment.userId || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
