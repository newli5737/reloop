import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  IdCard,
  ExternalLink,
  Ban,
  Unlock,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { api, formatPrice, AdminStats, Listing, UserProfile, timeAgo } from '../lib/api';
import { toast } from 'sonner';

type AdminUser = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  _count: { listings: number };
};

type Section = 'overview' | 'listings' | 'users' | 'verifications';

const sectionMeta: Record<Section, { title: string; description: string }> = {
  overview: { title: 'Tổng quan', description: 'Theo dõi hoạt động và xử lý việc cần làm' },
  listings: { title: 'Tin đăng', description: 'Quản lý tất cả tin đăng trên hệ thống' },
  users: { title: 'Người dùng', description: 'Quản lý tài khoản người dùng' },
  verifications: { title: 'Xác thực CCCD', description: 'Duyệt hồ sơ xác thực CCCD' },
};

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

export default function AdminPage({ section }: { section: Section }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = section === 'listings' ? searchParams.get('status') || '' : '';

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [listings, setListings] = useState<(Listing & { user: { id: string; name: string; email: string } })[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [verifications, setVerifications] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = sectionMeta[section];

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsData, allListings, usersData, verificationsData] = await Promise.all([
        api.admin.stats(),
        api.admin.listings(),
        api.admin.users(),
        api.admin.verifications('PENDING'),
      ]);
      setStats(statsData);
      setListings(allListings);
      setUsers(usersData);
      setVerifications(verificationsData);
    } catch {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredListings = filter ? listings.filter((l) => l.status === filter) : listings;
  const pendingListings = listings.filter((l) => l.status === 'PENDING');

  const goListings = (status?: string) => {
    if (status) navigate(`/admin/listings?status=${status}`);
    else navigate('/admin/listings');
  };

  const setFilter = (status: string) => {
    if (status) setSearchParams({ status });
    else setSearchParams({});
  };

  const handleApprove = async (id: string) => {
    try {
      await api.admin.updateListing(id, 'ACTIVE');
      loadAll();
    } catch {
      toast.error('Lỗi duyệt tin');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.admin.updateListing(id, 'REJECTED');
      loadAll();
    } catch {
      toast.error('Lỗi từ chối tin');
    }
  };

  const handleVerifyUser = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    const note = status === 'REJECTED' ? prompt('Lý do từ chối:') || 'Hồ sơ không hợp lệ' : undefined;
    try {
      await api.admin.verifyUser(id, status, note);
      loadAll();
    } catch {
      toast.error('Lỗi xử lý');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Xóa tin đăng này?')) return;
    try {
      await api.admin.deleteListing(id);
      loadAll();
    } catch {
      toast.error('Lỗi xóa tin');
    }
  };

  const handleToggleUser = async (id: string, isActive: boolean) => {
    try {
      await api.admin.updateUser(id, { isActive: !isActive });
      loadAll();
    } catch {
      toast.error('Lỗi cập nhật user');
    }
  };

  const ListingRow = ({ listing, showActions = true }: { listing: typeof listings[0]; showActions?: boolean }) => (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
      <td className="py-3 pr-3">
        {listing.images[0] ? (
          <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">N/A</div>
        )}
      </td>
      <td className="py-3 pr-4">
        <p className="font-semibold text-sm line-clamp-1 text-zinc-100">{listing.title}</p>
        <p className="text-xs text-zinc-500">{listing.category} · {listing.location}</p>
      </td>
      <td className="py-3 pr-4 text-violet-400 font-semibold text-sm whitespace-nowrap">{formatPrice(listing.price)}</td>
      <td className="py-3 pr-4">
        <p className="text-sm text-zinc-200">{listing.user.name}</p>
        <p className="text-xs text-zinc-500">{listing.user.email}</p>
      </td>
      <td className="py-3 pr-4">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded border whitespace-nowrap ${statusColors[listing.status]}`}>
          {statusLabels[listing.status]}
        </span>
      </td>
      <td className="py-3 pr-4 text-xs text-zinc-500 whitespace-nowrap">{timeAgo(listing.createdAt)}</td>
      {showActions && (
        <td className="py-3">
          <div className="flex items-center gap-1.5">
            {listing.status === 'PENDING' && (
              <>
                <button onClick={() => handleApprove(listing.id)} className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30">
                  Duyệt
                </button>
                <button onClick={() => handleReject(listing.id)} className="px-2.5 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30">
                  Từ chối
                </button>
              </>
            )}
            {listing.status === 'ACTIVE' && (
              <Link to={`/product/${listing.id}`} target="_blank" className="p-1.5 text-zinc-500 hover:text-zinc-200" title="Xem">
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
            <button onClick={() => handleDeleteListing(listing.id)} className="p-1.5 text-zinc-500 hover:text-red-400" title="Xóa">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-xl font-bold text-zinc-100 mb-1">{meta.title}</h1>
      <p className="text-zinc-500 text-sm mb-6">
        {section === 'users' ? `${users.length} người dùng đã đăng ký` : meta.description}
      </p>

      {loading ? (
        <div className="text-center text-zinc-500 py-20">Đang tải...</div>
      ) : section === 'overview' && stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { label: 'Người dùng', value: stats.totalUsers, color: 'text-blue-400', onClick: () => navigate('/admin/users') },
              { label: 'Tổng tin', value: stats.totalListings, color: 'text-purple-400', onClick: () => goListings() },
              { label: 'Chờ duyệt', value: stats.pendingListings, color: 'text-amber-400', onClick: () => goListings('PENDING') },
              { label: 'Xác thực chờ', value: stats.pendingVerifications || 0, color: 'text-orange-400', onClick: () => navigate('/admin/verifications') },
              { label: 'Đang bán', value: stats.activeListings, color: 'text-emerald-400', onClick: () => goListings('ACTIVE') },
              { label: 'Đã bán', value: stats.soldListings, color: 'text-zinc-400', onClick: () => goListings('SOLD') },
            ].map((s) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-left hover:border-violet-500/30 transition-all"
              >
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </button>
            ))}
          </div>

          {(pendingListings.length > 0 || verifications.length > 0) ? (
            <div className="space-y-4">
              {pendingListings.length > 0 && (
                <div className="bg-amber-500/5 rounded-xl border border-amber-500/20 p-5">
                  <h3 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {pendingListings.length} tin chờ duyệt
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                          <th className="pb-2 pr-3 w-16"></th>
                          <th className="pb-2 pr-4">Sản phẩm</th>
                          <th className="pb-2 pr-4">Giá</th>
                          <th className="pb-2 pr-4">Người đăng</th>
                          <th className="pb-2 pr-4">Trạng thái</th>
                          <th className="pb-2 pr-4">Thời gian</th>
                          <th className="pb-2">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingListings.map((l) => <ListingRow key={l.id} listing={l} />)}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {verifications.length > 0 && (
                <div className="bg-orange-500/5 rounded-xl border border-orange-500/20 p-5">
                  <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    {verifications.length} hồ sơ CCCD chờ duyệt
                  </h3>
                  <button onClick={() => navigate('/admin/verifications')} className="text-sm text-orange-300 hover:underline">
                    Xem và xử lý →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="font-semibold text-zinc-200">Không có việc cần xử lý</p>
              <p className="text-sm text-zinc-500 mt-1">Tất cả tin đăng và hồ sơ xác thực đã được xử lý</p>
            </div>
          )}

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-200">Tin đăng gần đây</h3>
              <button onClick={() => goListings()} className="text-sm text-violet-400 hover:underline">
                Xem tất cả →
              </button>
            </div>
            {listings.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-6">Chưa có tin đăng nào</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                      <th className="pb-2 pr-3 w-16"></th>
                      <th className="pb-2 pr-4">Sản phẩm</th>
                      <th className="pb-2 pr-4">Giá</th>
                      <th className="pb-2 pr-4">Người đăng</th>
                      <th className="pb-2 pr-4">Trạng thái</th>
                      <th className="pb-2 pr-4">Thời gian</th>
                      <th className="pb-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.slice(0, 10).map((l) => <ListingRow key={l.id} listing={l} />)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : section === 'listings' ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <div className="flex gap-2 mb-5 flex-wrap">
            {['', 'PENDING', 'ACTIVE', 'SOLD', 'REJECTED'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filter === s ? 'bg-violet-600 text-white border-violet-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {s ? statusLabels[s] : `Tất cả (${listings.length})`}
              </button>
            ))}
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">
                {filter ? `Không có tin "${statusLabels[filter]}"` : 'Chưa có tin đăng nào'}
              </p>
              {filter && (
                <button onClick={() => setFilter('')} className="text-sm text-violet-400 hover:underline mt-2">
                  Xem tất cả tin đăng
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                    <th className="pb-3 pr-3 w-16"></th>
                    <th className="pb-3 pr-4">Sản phẩm</th>
                    <th className="pb-3 pr-4">Giá</th>
                    <th className="pb-3 pr-4">Người đăng</th>
                    <th className="pb-3 pr-4">Trạng thái</th>
                    <th className="pb-3 pr-4">Thời gian</th>
                    <th className="pb-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((l) => <ListingRow key={l.id} listing={l} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : section === 'users' ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800 bg-zinc-900/80">
                <th className="px-5 py-3">Tên</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Tin đăng</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Ngày tạo</th>
                <th className="px-5 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                  <td className="px-5 py-3 font-semibold text-sm text-zinc-200">{user.name}</td>
                  <td className="px-5 py-3 text-sm text-zinc-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                      user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-300">{user._count.listings}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                      user.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>{user.isActive ? 'Hoạt động' : 'Đã khoá'}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-zinc-500">{timeAgo(user.createdAt)}</td>
                  <td className="px-5 py-3">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleUser(user.id, user.isActive)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          user.isActive
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {user.isActive ? <><Ban className="w-3 h-3" /> Khoá</> : <><Unlock className="w-3 h-3" /> Mở khoá</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
              <IdCard className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="font-semibold text-zinc-200">Không có hồ sơ chờ duyệt</p>
              <p className="text-sm text-zinc-500 mt-1">Hồ sơ CCCD mới sẽ hiện tại đây</p>
            </div>
          ) : (
            verifications.map((v) => (
              <div key={v.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">{v.cccdFullName || v.name}</h3>
                    <p className="text-sm text-zinc-500">{v.email} · {v.phone || '—'}</p>
                    <div className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-zinc-300">
                      <p><span className="text-zinc-500">Số CCCD:</span> {v.cccdNumber}</p>
                      <p><span className="text-zinc-500">Ngày sinh:</span> {v.cccdDateOfBirth}</p>
                      <p><span className="text-zinc-500">Giới tính:</span> {v.cccdGender}</p>
                      <p><span className="text-zinc-500">Quốc tịch:</span> {v.cccdNationality}</p>
                      <p className="sm:col-span-2"><span className="text-zinc-500">Quê quán:</span> {v.cccdPlaceOfOrigin}</p>
                      <p className="sm:col-span-2"><span className="text-zinc-500">Thường trú:</span> {v.cccdPlaceOfResidence}</p>
                      <p><span className="text-zinc-500">Ngày cấp:</span> {v.cccdIssueDate}</p>
                      <p><span className="text-zinc-500">Hết hạn:</span> {v.cccdExpiryDate || 'Không thời hạn'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleVerifyUser(v.id, 'VERIFIED')} className="px-4 py-2 text-sm font-semibold bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Duyệt
                    </button>
                    <button onClick={() => handleVerifyUser(v.id, 'REJECTED')} className="px-4 py-2 text-sm font-semibold bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Từ chối
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {v.cccdFrontImage && (
                    <div>
                      <p className="text-xs text-zinc-500 mb-2 font-semibold">Mặt trước CCCD</p>
                      <img src={v.cccdFrontImage} alt="" className="w-full rounded-xl border border-zinc-800" />
                    </div>
                  )}
                  {v.cccdBackImage && (
                    <div>
                      <p className="text-xs text-zinc-500 mb-2 font-semibold">Mặt sau CCCD</p>
                      <img src={v.cccdBackImage} alt="" className="w-full rounded-xl border border-zinc-800" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
