import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Camera,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Upload,
  Save,
  IdCard,
} from 'lucide-react';
import { api, UserProfile, VerificationStatus } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const statusConfig: Record<VerificationStatus, { label: string; color: string; icon: typeof Shield }> = {
  NONE: { label: 'Chưa xác thực', color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', icon: Shield },
  PENDING: { label: 'Đang chờ duyệt', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', icon: Clock },
  VERIFIED: { label: 'Đã xác thực', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', icon: ShieldCheck },
  REJECTED: { label: 'Bị từ chối', color: 'text-red-400 bg-red-500/20 border-red-500/30', icon: ShieldAlert },
};

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [tab, setTab] = useState<'info' | 'verify'>('info');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingVerify, setSubmittingVerify] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const [info, setInfo] = useState({ name: '', phone: '', address: '', dateOfBirth: '', gender: '', bio: '' });
  const [cccd, setCccd] = useState({
    cccdNumber: '',
    cccdFullName: '',
    cccdDateOfBirth: '',
    cccdGender: '',
    cccdNationality: 'Việt Nam',
    cccdPlaceOfOrigin: '',
    cccdPlaceOfResidence: '',
    cccdIssueDate: '',
    cccdExpiryDate: '',
    cccdFrontImage: '',
    cccdBackImage: '',
  });
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');

  const loadProfile = async () => {
    try {
      const data = await api.profile.get();
      setProfile(data);
      setInfo({
        name: data.name,
        phone: data.phone || '',
        address: data.address || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        bio: data.bio || '',
      });
      setCccd({
        cccdNumber: data.cccdNumber || '',
        cccdFullName: data.cccdFullName || '',
        cccdDateOfBirth: data.cccdDateOfBirth || '',
        cccdGender: data.cccdGender || '',
        cccdNationality: data.cccdNationality || 'Việt Nam',
        cccdPlaceOfOrigin: data.cccdPlaceOfOrigin || '',
        cccdPlaceOfResidence: data.cccdPlaceOfResidence || '',
        cccdIssueDate: data.cccdIssueDate || '',
        cccdExpiryDate: data.cccdExpiryDate || '',
        cccdFrontImage: data.cccdFrontImage || '',
        cccdBackImage: data.cccdBackImage || '',
      });
      setFrontPreview(data.cccdFrontImage || '');
      setBackPreview(data.cccdBackImage || '');
    } catch {
      toast.error('Không thể tải hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [url] = await api.upload([file]);
      const updated = await api.profile.updateAvatar(url);
      setProfile(updated);
      refreshUser();
    } catch {
      toast.error('Upload avatar thất bại');
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.profile.update(info);
      setProfile(updated);
      refreshUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const uploadCccdImage = async (file: File, side: 'front' | 'back') => {
    const [url] = await api.upload([file]);
    if (side === 'front') {
      setCccd((prev) => ({ ...prev, cccdFrontImage: url }));
      setFrontPreview(url);
    } else {
      setCccd((prev) => ({ ...prev, cccdBackImage: url }));
      setBackPreview(url);
    }
  };

  const handleSubmitVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVerify(true);
    try {
      const updated = await api.profile.submitVerification(cccd);
      setProfile(updated);
      refreshUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gửi hồ sơ thất bại');
    } finally {
      setSubmittingVerify(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 flex items-center justify-center text-slate-400">Đang tải...</div>;
  }

  if (!profile) return null;

  const status = statusConfig[profile.verificationStatus];
  const canSubmitVerify = profile.verificationStatus === 'NONE' || profile.verificationStatus === 'REJECTED';

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Hồ sơ cá nhân
        </h1>

        {/* Avatar + status header */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/50" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-navy text-3xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
              <button
                onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-slate-400 text-sm">{profile.email}</p>
              <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-xs font-semibold ${status.color}`}>
                <status.icon className="w-3.5 h-3.5" />
                {status.label}
              </div>
              {profile.verificationStatus === 'REJECTED' && profile.verificationNote && (
                <p className="text-red-400 text-xs mt-2">Lý do: {profile.verificationNote}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'info' as const, label: 'Thông tin', icon: User },
            { key: 'verify' as const, label: 'Xác thực CCCD', icon: IdCard },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold border-2 text-sm transition-all ${
                tab === t.key ? 'bg-emerald-500 text-navy border-emerald-400' : 'bg-white/5 text-slate-300 border-white/10'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'info' ? (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSaveInfo}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4"
          >
            <h3 className="font-bold text-lg mb-2">Thông tin cá nhân</h3>

            {[
              { key: 'name', label: 'Họ và tên', required: true },
              { key: 'phone', label: 'Số điện thoại' },
              { key: 'address', label: 'Địa chỉ' },
              { key: 'dateOfBirth', label: 'Ngày sinh', placeholder: 'DD/MM/YYYY' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold mb-1.5">{field.label}</label>
                <input
                  value={info[field.key as keyof typeof info]}
                  onChange={(e) => setInfo({ ...info, [field.key]: e.target.value })}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-1.5">Giới tính</label>
              <select
                value={info.gender}
                onChange={(e) => setInfo({ ...info, gender: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Giới thiệu</label>
              <textarea
                value={info.bio}
                onChange={(e) => setInfo({ ...info, bio: e.target.value })}
                rows={3}
                placeholder="Giới thiệu về bản thân..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy font-bold rounded-xl border-2 border-emerald-400 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </motion.form>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitVerify}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4"
          >
            <h3 className="font-bold text-lg">Xác thực danh tính (CCCD/CMND)</h3>
            <p className="text-slate-400 text-sm -mt-2">
              Tải ảnh mặt trước và mặt sau CCCD để được xác minh tài khoản, tăng độ tin cậy khi giao dịch.
            </p>

            {profile.verificationStatus === 'VERIFIED' ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Tài khoản đã được xác thực thành công
              </div>
            ) : profile.verificationStatus === 'PENDING' ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hồ sơ đang chờ admin duyệt
              </div>
            ) : null}

            {/* CCCD images */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { ref: frontRef, preview: frontPreview, side: 'front' as const, label: 'Mặt trước CCCD' },
                { ref: backRef, preview: backPreview, side: 'back' as const, label: 'Mặt sau CCCD' },
              ].map((item) => (
                <div key={item.side}>
                  <label className="block text-sm font-semibold mb-2">{item.label}</label>
                  <div
                    onClick={() => canSubmitVerify && item.ref.current?.click()}
                    className={`aspect-[3/2] rounded-xl border-2 border-dashed overflow-hidden transition-all ${
                      canSubmitVerify ? 'border-white/20 hover:border-emerald-500/50 cursor-pointer' : 'border-white/10 opacity-60'
                    }`}
                  >
                    {item.preview ? (
                      <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-slate-400">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs">Tải ảnh lên</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={item.ref}
                    type="file"
                    accept="image/*"
                    disabled={!canSubmitVerify}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadCccdImage(f, item.side).catch(() => toast.error('Upload thất bại'));
                    }}
                    className="hidden"
                  />
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'cccdNumber', label: 'Số CCCD/CMND' },
                { key: 'cccdFullName', label: 'Họ và tên (trên CCCD)' },
                { key: 'cccdDateOfBirth', label: 'Ngày sinh (trên CCCD)', placeholder: 'DD/MM/YYYY' },
                { key: 'cccdGender', label: 'Giới tính (trên CCCD)' },
                { key: 'cccdNationality', label: 'Quốc tịch' },
                { key: 'cccdIssueDate', label: 'Ngày cấp', placeholder: 'DD/MM/YYYY' },
                { key: 'cccdExpiryDate', label: 'Ngày hết hạn', placeholder: 'DD/MM/YYYY hoặc Không thời hạn' },
                { key: 'cccdPlaceOfOrigin', label: 'Quê quán' },
              ].map((field) => (
                <div key={field.key} className={field.key === 'cccdPlaceOfOrigin' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-semibold mb-1.5">{field.label}</label>
                  <input
                    value={cccd[field.key as keyof typeof cccd]}
                    onChange={(e) => setCccd({ ...cccd, [field.key]: e.target.value })}
                    disabled={!canSubmitVerify}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Nơi thường trú</label>
                <input
                  value={cccd.cccdPlaceOfResidence}
                  onChange={(e) => setCccd({ ...cccd, cccdPlaceOfResidence: e.target.value })}
                  disabled={!canSubmitVerify}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
            </div>

            {canSubmitVerify && (
              <button
                type="submit"
                disabled={submittingVerify}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-navy font-bold rounded-xl border-2 border-amber-400 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                {submittingVerify ? 'Đang gửi...' : 'Gửi xác thực danh tính'}
              </button>
            )}
          </motion.form>
        )}
      </div>
    </div>
  );
}
