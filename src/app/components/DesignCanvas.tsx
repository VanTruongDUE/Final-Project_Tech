import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, X, Eye } from "lucide-react";
import { Logo } from "./shared/Logo";

import { Landing } from "./auth/Landing";
import { CustomerLayout } from "./customer/CustomerLayout";
import { CustomerHome } from "./customer/Home";
import { ProductList } from "./customer/ProductList";
import { ProductDetail } from "./customer/ProductDetail";
import { Cart } from "./customer/Cart";
import { Checkout } from "./customer/Checkout";
import { MyOrders } from "./customer/MyOrders";
import { Profile } from "./customer/Profile";
import { Chat } from "./customer/Chat";
import { LoginPage, RegisterPage, ForgotPasswordPage, VerifyOtpPage, ResetPasswordPage } from "./customer/AuthFlow";
import { OrderDetail } from "./customer/OrderDetail";
import { CreateReview } from "./customer/CreateReview";
import { SellerApp } from "./seller/SellerScreens";
import { AdminApp } from "./admin/AdminScreens";
import { ShipperApp } from "./shipper/ShipperScreens";

type Frame = {
  id: string;
  title: string;
  group: string;
  width: number;
  height: number;
  node: React.ReactNode;
};

const noop = () => {};

const CL = (page: string, children: React.ReactNode) => (
  <CustomerLayout page={page} setPage={noop as any}>{children}</CustomerLayout>
);

const FRAMES: Frame[] = [
  { id: "landing", title: "01. Landing - Chọn vai trò", group: "A. Public & Auth", width: 1440, height: 1024, node: <Landing onSelect={noop as any} /> },
  { id: "login", title: "02. /login - Đăng nhập", group: "A. Public & Auth", width: 1440, height: 900, node: <LoginPage /> },
  { id: "register", title: "03. /register - Đăng ký", group: "A. Public & Auth", width: 1440, height: 1000, node: <RegisterPage /> },
  { id: "forgot", title: "04. /forgot-password", group: "A. Public & Auth", width: 1440, height: 900, node: <ForgotPasswordPage /> },
  { id: "otp", title: "05. /verify-otp", group: "A. Public & Auth", width: 1440, height: 900, node: <VerifyOtpPage /> },
  { id: "reset", title: "06. /reset-password", group: "A. Public & Auth", width: 1440, height: 900, node: <ResetPasswordPage /> },

  { id: "c-home", title: "07. Khách - Trang chủ", group: "B. Khách hàng", width: 1440, height: 2400, node: CL("home", <CustomerHome onProduct={noop} onCategory={noop} />) },
  { id: "c-list", title: "08. /products - Danh sách", group: "B. Khách hàng", width: 1440, height: 1400, node: CL("list", <ProductList onProduct={noop} />) },
  { id: "c-detail", title: "09. /products/:id - Chi tiết", group: "B. Khách hàng", width: 1440, height: 2200, node: CL("detail", <ProductDetail id="p1" onCart={noop} onBack={noop} />) },
  { id: "c-cart", title: "10. /cart - Giỏ hàng", group: "B. Khách hàng", width: 1440, height: 900, node: CL("cart", <Cart onCheckout={noop} />) },
  { id: "c-checkout", title: "11. /checkout - Thanh toán", group: "B. Khách hàng", width: 1440, height: 1200, node: CL("checkout", <Checkout onDone={noop} />) },
  { id: "c-orders", title: "12. /my-orders - Đơn của tôi", group: "B. Khách hàng", width: 1440, height: 1600, node: CL("orders", <MyOrders />) },
  { id: "c-order-detail", title: "13. /my-orders/:id - Chi tiết đơn", group: "B. Khách hàng", width: 1440, height: 1500, node: CL("orders", <OrderDetail id="ORD-1003" />) },
  { id: "c-review", title: "14. /reviews/create/:id - Đánh giá", group: "B. Khách hàng", width: 1440, height: 1400, node: CL("orders", <CreateReview id="p1" />) },
  { id: "c-chat", title: "15. /messages - Tin nhắn", group: "B. Khách hàng", width: 1440, height: 850, node: CL("chat", <Chat />) },
  { id: "c-profile", title: "16. /profile - Hồ sơ", group: "B. Khách hàng", width: 1440, height: 800, node: CL("profile", <Profile />) },

  { id: "s-dash", title: "17. Người bán - Dashboard", group: "C. Người bán", width: 1440, height: 1500, node: <SellerApp onLogout={noop} initialPage="dash" /> },
  { id: "s-products", title: "18. Người bán - Sản phẩm", group: "C. Người bán", width: 1440, height: 1400, node: <SellerApp onLogout={noop} initialPage="products" /> },
  { id: "s-orders", title: "19. Người bán - Đơn hàng", group: "C. Người bán", width: 1440, height: 1400, node: <SellerApp onLogout={noop} initialPage="orders" /> },
  { id: "s-order-detail", title: "20. Người bán - Chi tiết đơn", group: "C. Người bán", width: 1440, height: 1500, node: <SellerApp onLogout={noop} initialPage="order-detail" /> },
  { id: "s-revenue", title: "21. Người bán - Doanh thu", group: "C. Người bán", width: 1440, height: 1500, node: <SellerApp onLogout={noop} initialPage="revenue" /> },
  { id: "s-report", title: "22. Người bán - Báo cáo", group: "C. Người bán", width: 1440, height: 900, node: <SellerApp onLogout={noop} initialPage="report" /> },
  { id: "s-reviews", title: "23. Người bán - Đánh giá", group: "C. Người bán", width: 1440, height: 1200, node: <SellerApp onLogout={noop} initialPage="reviews" /> },
  { id: "a-app", title: "24. Admin - Dashboard", group: "D. Quản trị viên", width: 1440, height: 1500, node: <AdminApp onLogout={noop} /> },
  { id: "sh-app", title: "25. Shipper - Dashboard", group: "E. Shipper", width: 1440, height: 1200, node: <ShipperApp onLogout={noop} /> },
];

const groups = Array.from(new Set(FRAMES.map(f => f.group)));
const groupColor: Record<string, string> = {
  "A. Public & Auth": "from-slate-500 to-slate-700",
  "B. Khách hàng": "from-indigo-500 to-pink-500",
  "C. Người bán": "from-orange-500 to-rose-500",
  "D. Quản trị viên": "from-emerald-500 to-teal-500",
  "E. Shipper": "from-amber-500 to-orange-500",
};

export function DesignCanvas({ onExit }: { onExit: () => void }) {
  const [zoom, setZoom] = useState(0.25);
  const [focus, setFocus] = useState<string | null>(null);
  const focusFrame = focus ? FRAMES.find(f => f.id === focus) : null;

  return (
    <div className="min-h-screen bg-slate-200">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-soft h-14 flex items-center px-4 gap-3">
        <Logo size="sm" />
        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold pl-3 border-l border-slate-200">Design Canvas</div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.05))} className="h-8 w-8 hover:bg-slate-200 flex items-center justify-center"><ZoomOut size={14} /></button>
            <span className="px-3 text-xs font-mono w-14 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1, z + 0.05))} className="h-8 w-8 hover:bg-slate-200 flex items-center justify-center"><ZoomIn size={14} /></button>
          </div>
          {[0.15, 0.25, 0.5, 1].map(z => (
            <button key={z} onClick={() => setZoom(z)} className={`text-xs px-2.5 py-1 rounded ${zoom === z ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}>{Math.round(z * 100)}%</button>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button onClick={onExit} className="px-3 py-1.5 bg-brand-gradient text-white rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-pop"><Eye size={14} /> Vào app</button>
        </div>
      </header>

      {focusFrame && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setFocus(null)}>
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium">{focusFrame.title}</span>
            <button onClick={() => setFocus(null)} className="h-9 w-9 bg-white rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} /></button>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ width: 1200, height: 750 }} onClick={e => e.stopPropagation()}>
            <div className="overflow-auto h-full">
              <div style={{ width: focusFrame.width, transform: `scale(${1200 / focusFrame.width})`, transformOrigin: "top left" }}>
                {focusFrame.node}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-20 pb-20 px-12">
        {groups.map(g => {
          const frames = FRAMES.filter(f => f.group === g);
          return (
            <section key={g} className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${groupColor[g]} text-white font-bold text-sm shadow-pop`}>{g}</div>
                <div className="text-sm text-slate-500">{frames.length} màn hình</div>
                <div className="flex-1 h-px bg-slate-300" />
              </div>
              <div className="flex flex-wrap gap-10">
                {frames.map(f => (
                  <div key={f.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-slate-500">{f.title}</div>
                      <button onClick={() => setFocus(f.id)} className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:bg-white px-2 py-1 rounded"><Maximize2 size={11} /> Phóng to</button>
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setFocus(f.id)}
                      className="bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-slate-300 hover:ring-2 hover:ring-indigo-500 transition cursor-pointer relative"
                      style={{ width: f.width * zoom, height: f.height * zoom }}
                    >
                      <div style={{ width: f.width, height: f.height, transform: `scale(${zoom})`, transformOrigin: "top left", pointerEvents: "none" }}>
                        {f.node}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{f.width} × {f.height}px</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex items-center justify-between">
        <div>TechTonic Ecommerce · Design Canvas · {FRAMES.length} frames · Click frame để phóng to</div>
        <div className="flex items-center gap-4 font-mono">
          <span>Inter / Plus Jakarta</span>
          <span>1440px desktop</span>
          <span>Grid 8px</span>
          <span className="text-indigo-600">●</span><span>Primary #4f46e5</span>
        </div>
      </footer>
    </div>
  );
}
