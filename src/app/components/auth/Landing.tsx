import { useState } from "react";
import { ShoppingBag, Store, Shield, Bike, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Logo } from "../shared/Logo";
import { LoginPage, RegisterPage, ForgotPasswordPage, VerifyOtpPage, ResetPasswordPage } from "../customer/AuthFlow";

const roles = [
  { k: "customer", title: "Khách hàng", sub: "Mua sắm trực tuyến trên TechTonic Ecommerce", icon: ShoppingBag, gradient: "from-indigo-500 via-violet-500 to-pink-500", emoji: "🛍️", features: ["Tìm kiếm sản phẩm", "Đặt hàng & thanh toán", "Theo dõi đơn", "Đánh giá & chat shop"] },
  { k: "seller", title: "Người bán", sub: "Mở cửa hàng và quản lý kinh doanh", icon: Store, gradient: "from-orange-500 via-rose-500 to-red-500", emoji: "🏪", features: ["Quản lý sản phẩm", "Xử lý đơn hàng", "Báo cáo doanh thu", "Phản hồi khách hàng"] },
  { k: "admin", title: "Quản trị viên", sub: "Vận hành và giám sát toàn sàn", icon: Shield, gradient: "from-emerald-500 via-teal-500 to-cyan-500", emoji: "🛡️", features: ["Quản lý người dùng", "Duyệt cửa hàng", "Báo cáo tổng quan", "Xử lý khiếu nại"] },
  { k: "shipper", title: "Shipper", sub: "Nhận đơn và giao hàng nhanh", icon: Bike, gradient: "from-amber-500 via-orange-500 to-red-500", emoji: "🛵", features: ["Nhận đơn theo khu vực", "Cập nhật trạng thái", "Theo dõi thu nhập", "Xác nhận giao hàng"] },
];

export function Landing({ onSelect }: { onSelect: (role: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot" | "otp" | "reset">("login");

  if (showAuth) {
    const goLogin = () => setAuthMode("login");
    const detectRole = (email?: string) => {
      const e = (email || "").toLowerCase().trim();
      if (e.startsWith("admin@") || e.startsWith("admin.")) return "admin";
      if (e.startsWith("shop@") || e.startsWith("seller@") || e.includes("@shop") || e.endsWith(".shop")) return "seller";
      if (e.startsWith("shipper@") || e.startsWith("ship@")) return "shipper";
      if (e.startsWith("customer@") || e.startsWith("buyer@")) return "customer";
      return null;
    };
    const finish = (email?: string) => onSelect(detectRole(email) || showAuth);
    if (showAuth !== "customer") {
      return <SimpleAuth role={showAuth} onLogin={() => onSelect(showAuth)} onBack={() => setShowAuth(null)} />;
    }
    if (authMode === "login") return <LoginPage onLogin={finish} goRegister={() => setAuthMode("register")} goForgot={() => setAuthMode("forgot")} />;
    if (authMode === "register") return <RegisterPage onSubmit={finish} goLogin={goLogin} />;
    if (authMode === "forgot") return <ForgotPasswordPage onSent={() => setAuthMode("otp")} goLogin={goLogin} />;
    if (authMode === "otp") return <VerifyOtpPage onVerified={() => setAuthMode("reset")} goBack={() => setAuthMode("forgot")} />;
    if (authMode === "reset") return <ResetPasswordPage onSuccess={goLogin} goLogin={goLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full bg-orange-200/30 blur-3xl" />

      <header className="relative max-w-[1440px] mx-auto px-6 py-5 flex items-center justify-between">
        <Logo size="lg" />
        <div className="flex items-center gap-2 text-sm">
          <button className="px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium">Giới thiệu</button>
          <button className="px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium">Tài liệu</button>
          <button onClick={() => setShowAuth("customer")} className="px-5 py-2 bg-brand-gradient text-white rounded-full font-medium shadow-pop">Đăng nhập</button>
        </div>
      </header>

      <main className="relative max-w-[1440px] mx-auto px-6 pt-12 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-200 rounded-full text-sm text-indigo-700 font-medium shadow-soft mb-5">
            <Sparkles size={16} /> Dự án chuyên môn Nhóm 2 · 2026
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            Sàn thương mại điện tử<br />
            <span className="text-brand-gradient">đa ngành hàng số 1</span> Việt Nam
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            TechTonic Ecommerce kết nối hàng triệu người mua, người bán, shipper và quản trị viên trên một nền tảng duy nhất — nhanh, an toàn và minh bạch.
          </p>
        </div>

        <div className="text-center mb-8">
          <h2>Bạn muốn đăng nhập với vai trò nào?</h2>
          <p className="text-slate-500 mt-1">Chọn vai trò để trải nghiệm giao diện tương ứng</p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {roles.map(r => (
            <button
              key={r.k}
              onMouseEnter={() => setHover(r.k)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setShowAuth(r.k)}
              className={`group relative bg-white rounded-3xl border-2 p-6 text-left transition-all ${hover === r.k ? "border-transparent shadow-pop -translate-y-1" : "border-slate-200 hover:border-indigo-200"}`}
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform`}>
                {r.emoji}
              </div>
              <h3 className="text-xl mb-1">{r.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{r.sub}</p>
              <div className="space-y-1.5 mb-5">
                {r.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <div className={`flex items-center gap-1 font-semibold text-sm bg-gradient-to-r ${r.gradient} bg-clip-text text-transparent`}>
                Vào trang <ArrowRight size={14} className="text-indigo-600 group-hover:translate-x-1 transition" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-4 gap-4 text-center">
          {[
            { v: "1M+", l: "Khách hàng" },
            { v: "1.2K+", l: "Cửa hàng" },
            { v: "320", l: "Shipper" },
            { v: "₫285 tỷ", l: "GMV / năm" },
          ].map(s => (
            <div key={s.l} className="bg-white/70 backdrop-blur rounded-2xl border border-white p-5">
              <div className="text-3xl font-bold text-brand-gradient">{s.v}</div>
              <div className="text-sm text-slate-600 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative text-center py-6 text-sm text-slate-500">© 2026 TechTonic Ecommerce — Nhóm 2 · ReactJS · Node.js · SQL Server</footer>
    </div>
  );
}

function SimpleAuth({ role, onLogin, onBack }: { role: string; onLogin: () => void; onBack: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Mail = (p: any) => <span {...p}>@</span>;
  const Lock = (p: any) => <span {...p}>🔒</span>;
  const [mode, setMode] = useState<"login" | "register">("login");
  const r = roles.find(x => x.k === role)!;
  return (
    <div className="min-h-screen flex">
      <div className={`hidden md:flex flex-1 bg-gradient-to-br ${r.gradient} relative overflow-hidden p-12 text-white items-center`}>
        <div className="relative z-10 max-w-md">
          <div className="text-7xl mb-6">{r.emoji}</div>
          <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">Chào mừng trở lại,<br />{r.title}!</h1>
          <p className="opacity-90 text-lg leading-relaxed">Đăng nhập để tiếp tục với TechTonic Ecommerce — sàn thương mại điện tử đa ngành hàng hàng đầu.</p>
          <div className="mt-8 space-y-2">
            {r.features.map(f => (<div key={f} className="flex items-center gap-2"><CheckCircle2 size={18} /><span>{f}</span></div>))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-white/10" />
      </div>

      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <div className="w-full max-w-md space-y-6">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-indigo-600">← Chọn vai trò khác</button>
          <Logo size="lg" />
          <div>
            <h1>{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h1>
            <p className="text-slate-500 mt-1">{mode === "login" ? "Đăng nhập để tiếp tục mua sắm và quản lý." : "Điền thông tin để bắt đầu sử dụng TechTonic Ecommerce."}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-soft">
            {mode === "register" && (
              <div><label className="block mb-1.5 text-sm">Họ và tên</label><input placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" /></div>
            )}
            <div><label className="block mb-1.5 text-sm">Email / Số điện thoại</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input defaultValue={role + "@techtonic.vn"} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg" /></div>
            </div>
            <div><label className="block mb-1.5 text-sm">Mật khẩu</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" defaultValue="123456" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg" /></div>
            </div>
            {mode === "login" && (
              <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" /> Ghi nhớ đăng nhập</label><button className="text-indigo-600 font-medium">Quên mật khẩu?</button></div>
            )}
            <button onClick={onLogin} className={`w-full h-12 rounded-xl font-semibold text-white shadow-pop bg-gradient-to-r ${r.gradient}`}>{mode === "login" ? "Đăng nhập" : "Đăng ký"}</button>

            <div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><span className="relative bg-white px-3 text-xs text-slate-400 mx-auto block w-fit">HOẶC</span></div>

            <div className="grid grid-cols-2 gap-2">
              <button className="h-11 border border-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50"><span className="text-blue-600 font-bold">f</span> Facebook</button>
              <button className="h-11 border border-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50"><span className="text-rose-500 font-bold">G</span> Google</button>
            </div>
          </div>

          <p className="text-sm text-center text-slate-500">{mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}<button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-indigo-600 font-semibold">{mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}</button></p>
        </div>
      </div>
    </div>
  );
}
