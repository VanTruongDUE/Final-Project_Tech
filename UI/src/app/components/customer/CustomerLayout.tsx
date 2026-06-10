import { Bell, Heart, MapPin, MessageCircle, Search, ShoppingCart, User } from "lucide-react";
import { Logo } from "../shared/Logo";
import type { ReactNode } from "react";

export function CustomerLayout({ children, page, setPage, cartCount = 3 }: { children: ReactNode; page: string; setPage: (p: any) => void; cartCount?: number }) {
  const navs = [
    { k: "home", label: "Trang chủ" },
    { k: "list", label: "Danh mục" },
    { k: "orders", label: "Đơn của tôi" },
    { k: "chat", label: "Tin nhắn" },
    { k: "profile", label: "Tài khoản" },
  ];
  return (
    <div className="min-h-full bg-slate-50">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-[1440px] mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5"><MapPin size={12} /> Giao đến: Quận 1, TP. Hồ Chí Minh</div>
          <div className="flex items-center gap-4">
            <span>Tải ứng dụng</span>
            <span>Kết nối: Facebook · Zalo</span>
            <span>Hotline 1900 1234</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-soft">
        <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center gap-6">
          <button onClick={() => setPage("home")}><Logo /></button>
          <div className="flex-1 max-w-2xl relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Tìm kiếm sản phẩm, thương hiệu, cửa hàng..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-28 py-2.5 outline-none focus:border-indigo-400 focus:bg-white transition"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-gradient text-white px-5 py-1.5 rounded-full text-sm font-medium">Tìm kiếm</button>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn icon={Bell} badge={5} />
            <IconBtn icon={MessageCircle} badge={2} onClick={() => setPage("chat")} />
            <IconBtn icon={Heart} />
            <button onClick={() => setPage("cart")} className="relative h-10 px-4 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-2 font-medium text-sm">
              <ShoppingCart size={18} /> Giỏ
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setPage("profile")} className="ml-2 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white"><User size={18} /></button>
          </div>
        </div>
        <nav className="max-w-[1440px] mx-auto px-6 pb-2 flex items-center gap-1 text-sm">
          {navs.map(n => (
            <button key={n.k} onClick={() => setPage(n.k)} className={`px-3 py-2 rounded-lg font-medium transition ${page === n.k ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>{n.label}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-[1440px] mx-auto px-6 py-10 grid grid-cols-5 gap-8">
          <div className="col-span-2"><Logo /><p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-md">Sàn thương mại điện tử đa ngành hàng hàng đầu Việt Nam. Mua sắm an toàn, giao hàng siêu tốc, hoàn tiền 200% nếu hàng giả.</p></div>
          {[
            { t: "Hỗ trợ", l: ["Trung tâm trợ giúp", "Chính sách bảo mật", "Điều khoản dịch vụ", "Liên hệ"] },
            { t: "Mua sắm", l: ["Khuyến mãi", "Hàng mới về", "Top bán chạy", "Phiếu giảm giá"] },
            { t: "Bán hàng", l: ["Đăng ký bán", "Trung tâm người bán", "Quy chế hoạt động", "Tài liệu API"] },
          ].map((c, i) => (
            <div key={i}>
              <h4 className="mb-3">{c.t}</h4>
              <ul className="space-y-2 text-sm text-slate-500">{c.l.map(x => <li key={x} className="hover:text-indigo-600 cursor-pointer">{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">© 2026 T2 Commerce — Dự án chuyên môn Nhóm 2</div>
      </footer>
    </div>
  );
}

function IconBtn({ icon: Icon, badge, onClick }: { icon: any; badge?: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="relative h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600">
      <Icon size={20} />
      {badge && <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{badge}</span>}
    </button>
  );
}
