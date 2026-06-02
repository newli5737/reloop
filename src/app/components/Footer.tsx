import { Link } from 'react-router';
import { MapPin, Phone, Mail, Recycle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0A0F1C]/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 border border-white/20 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-navy" />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                RELOOP
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nền tảng trao đổi và mua bán đồ cũ — kết nối người mua, người bán và đơn vị thu mua trên toàn quốc.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">
              CÔNG TY TNHH THƯƠNG MẠI &amp; DỊCH VỤ DOSU
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Đối tác công nghệ tin cậy, xây dựng giải pháp toàn diện từ ý tưởng đến sản phẩm hoàn thiện.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white mb-4">Liên hệ</h3>
            <p className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội</span>
            </p>
            <p className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="tel:0346437915" className="hover:text-emerald-400 transition-colors">
                0346 437 915 (Lại Thế Ngọc)
              </a>
            </p>
            <p className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="mailto:support@dosutech.site" className="hover:text-emerald-400 transition-colors">
                support@dosutech.site
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CÔNG TY TNHH THƯƠNG MẠI &amp; DỊCH VỤ DOSU. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
              Marketplace
            </Link>
            <Link to="/collectors" className="hover:text-emerald-400 transition-colors">
              Thu Mua
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
