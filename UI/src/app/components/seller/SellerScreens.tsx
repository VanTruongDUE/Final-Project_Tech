import { LayoutDashboard, Package, ShoppingCart, BarChart3, Star, MessageCircle, Settings, Store, TrendingUp, Wallet, Users, Plus, Search, Filter, Eye, Edit, Trash2, Download, ArrowLeft, FileText, Phone, MapPin, ClipboardCheck } from "lucide-react";
import { DashboardLayout, NavItem } from "../shared/DashboardLayout";
import { formatVND, orders, products, statusLabel, revenueData, categoryShare, type Order } from "../../lib/data";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useState } from "react";

const PRIMARY = "#EE4D2D";
const PRIMARY_DARK = "#b22204";
const PRIMARY_SOFT = "#fff3ee";
const BORDER = "#e3beb6";

const NAV: NavItem[] = [
  { k: "dash", label: "Tổng quan", icon: LayoutDashboard, group: "Tổng quan" },
  { k: "products", label: "Sản phẩm", icon: Package, group: "Quản lý" },
  { k: "orders", label: "Đơn hàng", icon: ShoppingCart, badge: 8, group: "Quản lý" },
  { k: "reviews", label: "Đánh giá", icon: Star, group: "Quản lý" },
  { k: "chat", label: "Tin nhắn", icon: MessageCircle, badge: 3, group: "Quản lý" },
  { k: "revenue", label: "Doanh thu", icon: Wallet, group: "Phân tích" },
  { k: "report", label: "Báo cáo", icon: BarChart3, group: "Phân tích" },
  { k: "store", label: "Cửa hàng", icon: Store, group: "Cài đặt" },
  { k: "settings", label: "Cấu hình", icon: Settings, group: "Cài đặt" },
];

export function SellerApp({ onLogout, initialPage = "dash" }: { onLogout: () => void; initialPage?: string }) {
  const [page, setPage] = useState(initialPage);
  const [orderId, setOrderId] = useState<string | undefined>();
  const goOrder = (id: string) => { setOrderId(id); setPage("order-detail"); };
  return (
    <DashboardLayout nav={NAV} page={page === "order-detail" ? "orders" : page} setPage={setPage} role="Người bán" user={{ name: "TechZone Official", email: "shop@techzone.vn" }} onLogout={onLogout}>
      <div className="font-['Inter']">
        {page === "dash" && <SellerDashboard onOrder={goOrder} />}
        {page === "products" && <SellerProducts />}
        {page === "orders" && <SellerOrders onOrder={goOrder} />}
        {page === "order-detail" && <SellerOrderDetail id={orderId} onBack={() => setPage("orders")} />}
        {page === "revenue" && <SellerRevenue />}
        {page === "report" && <SellerReport />}
        {page === "reviews" && <SellerReviews />}
        {page === "chat" && <Placeholder title="Tin nhắn người mua" desc="Trò chuyện trực tiếp với khách hàng tại đây." />}
        {page === "store" && <Placeholder title="Hồ sơ cửa hàng" desc="Cập nhật logo, banner, mô tả, chính sách của shop." />}
        {page === "settings" && <Placeholder title="Cấu hình bán hàng" desc="Vận chuyển, phương thức thanh toán, thông báo..." />}
      </div>
    </DashboardLayout>
  );
}

function Kpi({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta?: number }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="bg-white rounded-xl border p-5 relative overflow-hidden" style={{ borderColor: BORDER }}>
      <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full" style={{ background: `radial-gradient(circle, ${PRIMARY_SOFT} 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between relative">
        <div className="text-xs uppercase tracking-wider text-[#5b403b] font-medium">{label}</div>
        <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY_SOFT, color: PRIMARY }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-bold mt-3" style={{ color: "#1b1c1c" }}>{value}</div>
      {delta !== undefined && (
        <div className="text-xs mt-1.5 flex items-center gap-1" style={{ color: up ? "#16a34a" : "#dc2626" }}>
          <TrendingUp size={12} className={up ? "" : "rotate-180"} />
          {up ? "+" : ""}{delta}% so với kỳ trước
        </div>
      )}
    </div>
  );
}

function SellerDashboard({ onOrder }: { onOrder: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 style={{ color: "#1b1c1c" }}>Tổng quan hôm nay</h1>
        <p className="text-[#5b403b] mt-1">Chào mừng trở lại, đây là tổng quan TechToShop của bạn.</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Kpi icon={Wallet} label="Doanh thu hôm nay" value={formatVND(12500000)} delta={12} />
        <Kpi icon={ShoppingCart} label="Đơn hàng mới" value="48" delta={8} />
        <Kpi icon={Package} label="Sản phẩm đang bán" value="234" delta={3} />
        <Kpi icon={Star} label="Đánh giá TB" value="4.9 / 5" delta={2} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#1b1c1c" }}>Doanh thu 7 ngày qua</h3>
            <div className="flex gap-1 text-xs">
              {["7 ngày", "30 ngày", "6 tháng", "1 năm"].map((x, i) => (
                <button key={x} className="px-3 py-1.5 rounded-lg font-medium" style={i === 0 ? { backgroundColor: PRIMARY_SOFT, color: PRIMARY } : { color: "#5b403b" }}>{x}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5e9e5" />
              <XAxis dataKey="month" stroke="#8f7069" fontSize={12} />
              <YAxis stroke="#8f7069" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BORDER}` }} />
              <Bar dataKey="revenue" fill={PRIMARY} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="mb-4" style={{ color: "#1b1c1c" }}>Hoạt động nhanh</h3>
          <div className="space-y-2.5">
            {[
              { icon: Plus, label: "Đăng sản phẩm" },
              { icon: ClipboardCheck, label: "Xử lý đơn mới" },
              { icon: FileText, label: "Tạo khuyến mãi" },
              { icon: BarChart3, label: "Xem báo cáo" },
            ].map(a => (
              <button key={a.label} className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-[#fff8f5] transition" style={{ borderColor: BORDER }}>
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY_SOFT, color: PRIMARY }}>
                  <a.icon size={16} />
                </div>
                <span className="text-sm font-medium text-[#1b1c1c]">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: "#1b1c1c" }}>Đơn hàng mới nhất cần xử lý</h3>
          <button className="text-sm font-medium hover:underline" style={{ color: PRIMARY }}>Xem tất cả →</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-[#5b403b] border-b" style={{ borderColor: "#f0e6e2" }}>
              <th className="text-left py-3 font-semibold">Mã đơn</th>
              <th className="text-left font-semibold">Khách hàng</th>
              <th className="text-left font-semibold">Sản phẩm</th>
              <th className="text-right font-semibold">Tổng tiền</th>
              <th className="text-center font-semibold">Trạng thái</th>
              <th className="text-right pr-2 font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map(o => (
              <tr key={o.id} className="border-b last:border-0" style={{ borderColor: "#f5ece8" }}>
                <td className="py-3 font-mono text-xs" style={{ color: PRIMARY }}>#{o.id}</td>
                <td>{o.customer}</td>
                <td className="line-clamp-1 max-w-[200px]">{o.product}</td>
                <td className="text-right font-semibold" style={{ color: PRIMARY }}>{formatVND(o.total)}</td>
                <td className="text-center"><StatusPill s={o.status} /></td>
                <td className="text-right pr-2">
                  <button onClick={() => onOrder(o.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-[#fff8f5]" style={{ borderColor: BORDER, color: PRIMARY }}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ s }: { s: Order["status"] }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    pending: { bg: "#fef3c7", fg: "#a16207", label: "Chờ xác nhận" },
    confirmed: { bg: "#dbeafe", fg: "#1d4ed8", label: "Đã xác nhận" },
    shipping: { bg: PRIMARY_SOFT, fg: PRIMARY, label: "Đang xử lý" },
    delivered: { bg: "#dcfce7", fg: "#15803d", label: "Hoàn thành" },
    cancelled: { bg: "#fee2e2", fg: "#dc2626", label: "Đã huỷ" },
  };
  const m = map[s] || { bg: "#f5f3f3", fg: "#5b403b", label: statusLabel[s].label };
  return <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: m.bg, color: m.fg }}>{m.label}</span>;
}

function SellerProducts() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#1b1c1c" }}>Danh sách sản phẩm</h1>
          <p className="text-[#5b403b] mt-1">Quản lý kho hàng và thông tin sản phẩm của bạn.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f7069]" />
            <input placeholder="Tìm kiếm sản phẩm..." className="h-10 pl-10 pr-3 bg-white border rounded-lg text-sm w-64" style={{ borderColor: BORDER }} />
          </div>
          <button className="h-10 px-4 rounded-lg text-white font-medium flex items-center gap-2 transition" style={{ backgroundColor: PRIMARY }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_DARK)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
            <Plus size={16} /> Thêm sản phẩm mới
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-[#5b403b]" style={{ backgroundColor: "#fbf9f9" }}>
              <th className="py-3 px-5 text-left font-semibold">Ảnh</th>
              <th className="py-3 text-left font-semibold">Tên sản phẩm</th>
              <th className="py-3 text-left font-semibold">Danh mục</th>
              <th className="py-3 text-right font-semibold">Giá</th>
              <th className="py-3 text-right font-semibold">Tồn kho</th>
              <th className="py-3 text-right font-semibold">Đã bán</th>
              <th className="py-3 text-center font-semibold">Trạng thái</th>
              <th className="py-3 px-5 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-[#fff8f5]" style={{ borderColor: "#f5ece8" }}>
                <td className="py-4 px-5">
                  <ImageWithFallback src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover bg-[#f5f3f3]" />
                </td>
                <td>
                  <div className="font-medium line-clamp-1 max-w-xs text-[#1b1c1c]">{p.name}</div>
                  <div className="text-xs text-[#8f7069] mt-0.5 font-mono">SKU: {p.id.toUpperCase()}</div>
                </td>
                <td className="text-[#5b403b] capitalize">{p.category}</td>
                <td className="text-right font-semibold" style={{ color: PRIMARY }}>{formatVND(p.price)}</td>
                <td className="text-right">{p.stock}</td>
                <td className="text-right text-[#5b403b]">{p.sold}</td>
                <td className="text-center">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: p.stock > 0 ? "#dcfce7" : "#fee2e2", color: p.stock > 0 ? "#15803d" : "#dc2626" }}>
                    {p.stock > 0 ? "Đang hoạt động" : "Tạm ngưng"}
                  </span>
                </td>
                <td className="px-5">
                  <div className="flex items-center gap-1 justify-end">
                    <button className="h-8 w-8 rounded-lg hover:bg-[#fff8f5] text-[#5b403b] flex items-center justify-center"><Eye size={15} /></button>
                    <button className="h-8 w-8 rounded-lg hover:bg-[#fff8f5] text-[#5b403b] flex items-center justify-center"><Edit size={15} /></button>
                    <button className="h-8 w-8 rounded-lg hover:bg-rose-50 text-rose-500 flex items-center justify-center"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex items-center justify-between border-t" style={{ borderColor: "#f5ece8" }}>
          <span className="text-sm text-[#5b403b]">Hiển thị 1-{products.length} của {products.length + 117} sản phẩm</span>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 10].map((p, i) => (
              <button key={i} className="h-8 w-8 rounded-lg text-sm font-medium" style={p === 1 ? { backgroundColor: PRIMARY, color: "#fff" } : { color: "#5b403b" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SellerOrders({ onOrder }: { onOrder: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#1b1c1c" }}>Danh sách đơn hàng</h1>
          <p className="text-[#5b403b] mt-1">Quản lý và theo dõi trạng thái tất cả đơn hàng của bạn.</p>
        </div>
        <button className="h-10 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 hover:bg-[#fff8f5]" style={{ borderColor: BORDER, color: "#1b1c1c" }}>
          <Download size={16} /> Xuất CSV
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { t: "Tổng đơn", v: "1,240" },
          { t: "Chờ xác nhận", v: "8" },
          { t: "Đang giao", v: "23" },
          { t: "Đã giao", v: "1,180" },
          { t: "Đã huỷ", v: "29" },
        ].map(s => (
          <div key={s.t} className="bg-white rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="text-xs uppercase tracking-wider text-[#5b403b] font-medium">{s.t}</div>
            <div className="text-2xl font-bold mt-1.5 text-[#1b1c1c]">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-5 flex items-center gap-3" style={{ borderColor: BORDER }}>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f7069]" />
          <input placeholder="Tìm mã đơn, tên khách hàng..." className="w-full h-10 pl-10 pr-3 bg-[#fbf9f9] border rounded-lg text-sm" style={{ borderColor: BORDER }} />
        </div>
        <select className="h-10 px-3 bg-[#fbf9f9] border rounded-lg text-sm" style={{ borderColor: BORDER }}>
          <option>Tất cả trạng thái</option>
          <option>Chờ xác nhận</option>
          <option>Đang giao</option>
          <option>Hoàn thành</option>
        </select>
        <input type="date" className="h-10 px-3 bg-[#fbf9f9] border rounded-lg text-sm" style={{ borderColor: BORDER }} />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-[#5b403b]" style={{ backgroundColor: "#fbf9f9" }}>
              <th className="py-3 px-5 text-left font-semibold w-10"><input type="checkbox" /></th>
              <th className="py-3 text-left font-semibold">Mã đơn</th>
              <th className="py-3 text-left font-semibold">Người mua</th>
              <th className="py-3 text-left font-semibold">Ngày đặt</th>
              <th className="py-3 text-right font-semibold">Tổng tiền</th>
              <th className="py-3 text-center font-semibold">Trạng thái</th>
              <th className="py-3 text-left font-semibold">Thanh toán</th>
              <th className="py-3 px-5 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t hover:bg-[#fff8f5]" style={{ borderColor: "#f5ece8" }}>
                <td className="py-3 px-5"><input type="checkbox" /></td>
                <td className="font-mono text-xs font-semibold" style={{ color: PRIMARY }}>#{o.id}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PRIMARY }}>
                      {o.customer.split(" ").pop()?.[0]}
                    </div>
                    <span>{o.customer}</span>
                  </div>
                </td>
                <td className="text-[#5b403b]">{o.date}</td>
                <td className="text-right font-semibold" style={{ color: PRIMARY }}>{formatVND(o.total)}</td>
                <td className="text-center"><StatusPill s={o.status} /></td>
                <td className="text-[#5b403b]">{o.payment}</td>
                <td className="px-5 text-right">
                  <button onClick={() => onOrder(o.id)} className="text-sm font-medium hover:underline" style={{ color: PRIMARY }}>Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STEPS: { key: Order["status"] | "processing" | "ready"; label: string }[] = [
  { key: "pending", label: "PENDING" },
  { key: "confirmed", label: "CONFIRMED" },
  { key: "processing" as any, label: "PROCESSING" },
  { key: "ready" as any, label: "READY" },
  { key: "shipping", label: "SHIPPING" },
  { key: "delivered", label: "DONE" },
];

function SellerOrderDetail({ id, onBack }: { id?: string; onBack: () => void }) {
  const o = orders.find(x => x.id === id) || orders[0];
  const items = products.slice(0, 2);
  const subtotal = items.reduce((s, p, i) => s + p.price * (i + 1), 0);
  const voucher = 150000;
  const ship = 35000;
  const total = subtotal - voucher + ship;
  const idx = Math.min(2, STEPS.findIndex(s => s.key === o.status));
  const currentIdx = idx === -1 ? 2 : idx;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm flex items-center gap-1 hover:underline" style={{ color: PRIMARY }}>
        <ArrowLeft size={14} /> Quay lại danh sách đơn hàng
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-[#5b403b] mb-1">Đơn hàng / Chi tiết</div>
          <div className="flex items-center gap-3">
            <h1 style={{ color: "#1b1c1c" }}>Đơn hàng #{o.id}</h1>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ backgroundColor: "#fff7ed", borderColor: "#fdba74", color: "#c2410c" }}>
              ⏱ PROCESSING
            </span>
          </div>
          <div className="text-sm text-[#5b403b] mt-1">Đặt lúc: {o.date}, 14:30</div>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 hover:bg-[#fff8f5]" style={{ borderColor: BORDER, color: "#1b1c1c" }}>
            <MessageCircle size={14} /> Nhắn tin khách hàng
          </button>
          <button className="h-10 px-4 rounded-lg text-white text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: PRIMARY }}>
            <ClipboardCheck size={14} /> Lưu cập nhật
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Timeline */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-5" style={{ color: "#1b1c1c" }}>Tiến trình xử lý</h3>
            <div className="flex items-center justify-between relative">
              {STEPS.map((s, i) => {
                const active = i <= currentIdx;
                return (
                  <div key={s.key as string} className="flex-1 flex flex-col items-center relative">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: active ? PRIMARY : "#f5f3f3", color: active ? "#fff" : "#8f7069" }}>
                      {i <= currentIdx - 1 ? "✓" : i + 1}
                    </div>
                    <div className="text-xs mt-2 font-semibold" style={{ color: active ? "#1b1c1c" : "#8f7069" }}>{s.label}</div>
                    {i < STEPS.length - 1 && <div className="absolute top-5 left-1/2 w-full h-[2px]" style={{ backgroundColor: i < currentIdx ? PRIMARY : "#e3e2e2" }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-4" style={{ color: "#1b1c1c" }}>Sản phẩm ({items.length})</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#5b403b] border-b" style={{ borderColor: "#f0e6e2" }}>
                  <th className="py-2 text-left font-semibold">Sản phẩm</th>
                  <th className="py-2 text-center font-semibold">SL</th>
                  <th className="py-2 text-right font-semibold">Đơn giá</th>
                  <th className="py-2 text-right font-semibold">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p, i) => (
                  <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "#f5ece8" }}>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover bg-[#f5f3f3]" />
                        <div>
                          <div className="font-medium text-[#1b1c1c]">{p.name}</div>
                          <div className="text-xs text-[#8f7069]">Phân loại: Mặc định</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{i + 1}</td>
                    <td className="text-right">{formatVND(p.price)}</td>
                    <td className="text-right font-semibold" style={{ color: PRIMARY }}>{formatVND(p.price * (i + 1))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-3 flex items-center gap-2" style={{ color: "#1b1c1c" }}>
              <Edit size={16} style={{ color: PRIMARY }} /> Cập nhật trạng thái
            </h3>
            <div className="text-xs text-[#5b403b] mb-1.5">Trạng thái hiện tại</div>
            <select className="w-full h-10 px-3 border rounded-lg text-sm bg-white mb-3" style={{ borderColor: BORDER }}>
              <option>PROCESSING - Đang xử lý</option>
              <option>READY - Sẵn sàng giao</option>
              <option>SHIPPING - Đang giao</option>
              <option>DONE - Hoàn thành</option>
            </select>
            <div className="text-xs text-[#5b403b] mb-1.5">Ghi chú xử lý (Nội bộ)</div>
            <textarea placeholder="Nhập ghi chú..." className="w-full h-20 px-3 py-2 border rounded-lg text-sm bg-white resize-none" style={{ borderColor: BORDER }} />
          </div>

          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-3 flex items-center gap-2" style={{ color: "#1b1c1c" }}>
              <Users size={16} style={{ color: PRIMARY }} /> Khách hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-[#1b1c1c]">{o.customer}</div>
              <div className="text-xs px-2 py-0.5 rounded inline-block" style={{ backgroundColor: PRIMARY_SOFT, color: PRIMARY }}>Thành viên Bạc</div>
              <div className="flex items-center gap-2 text-[#5b403b] mt-2"><Phone size={13} /> 0987 654 321</div>
              <div className="flex items-start gap-2 text-[#5b403b]"><MapPin size={13} className="mt-0.5 shrink-0" /><span>{o.address}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-3 flex items-center gap-2" style={{ color: "#1b1c1c" }}>
              <FileText size={16} style={{ color: PRIMARY }} /> Thanh toán
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#5b403b]">Tạm tính ({items.length} sản phẩm)</span><span className="font-medium">{formatVND(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-emerald-600">Giảm giá (Voucher)</span><span className="text-emerald-600">- {formatVND(voucher)}</span></div>
              <div className="flex justify-between"><span className="text-[#5b403b]">Phí vận chuyển</span><span className="font-medium">{formatVND(ship)}</span></div>
            </div>
            <div className="border-t mt-3 pt-3 flex items-end justify-between" style={{ borderColor: "#f0e6e2" }}>
              <div>
                <div className="font-semibold text-[#1b1c1c]">Tổng cộng</div>
                <div className="text-xs text-[#5b403b] mt-0.5">Đã thanh toán ({o.payment})</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: PRIMARY }}>{formatVND(total)}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SellerRevenue() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#1b1c1c" }}>Báo cáo doanh thu</h1>
          <p className="text-[#5b403b] mt-1">Tổng quan hiệu suất bán hàng của bạn.</p>
        </div>
        <div className="flex gap-3">
          <select className="h-10 px-3 bg-white border rounded-lg text-sm" style={{ borderColor: BORDER }}>
            <option>30 ngày qua</option>
            <option>7 ngày qua</option>
            <option>6 tháng qua</option>
          </select>
          <button className="h-10 px-4 rounded-lg text-white font-medium flex items-center gap-2" style={{ backgroundColor: PRIMARY }}>
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Kpi icon={Wallet} label="Tổng doanh thu" value="124.5M ₫" delta={12} />
        <Kpi icon={ShoppingCart} label="Đơn hàng thành công" value="842" delta={5} />
        <Kpi icon={TrendingUp} label="Giá trị TB đơn" value="148K ₫" delta={-1} />
      </div>

      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        <h3 className="mb-4" style={{ color: "#1b1c1c" }}>Biểu đồ doanh thu (30 ngày qua)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.3} />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5e9e5" />
            <XAxis dataKey="month" stroke="#8f7069" />
            <YAxis stroke="#8f7069" />
            <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BORDER}` }} />
            <Area type="monotone" dataKey="revenue" stroke={PRIMARY} strokeWidth={2.5} fill="url(#rev-grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: "#1b1c1c" }}>Chi tiết doanh thu theo sản phẩm</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f7069]" />
            <input placeholder="Tìm kiếm sản phẩm..." className="h-9 pl-9 pr-3 bg-[#fbf9f9] border rounded-lg text-sm" style={{ borderColor: BORDER }} />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-[#5b403b] border-b" style={{ borderColor: "#f0e6e2" }}>
              <th className="py-3 text-left font-semibold w-12">STT</th>
              <th className="py-3 text-left font-semibold">Sản phẩm</th>
              <th className="py-3 text-right font-semibold">Số lượng bán</th>
              <th className="py-3 text-right font-semibold">Đơn giá</th>
              <th className="py-3 text-right font-semibold">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 6).map((p, i) => (
              <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "#f5ece8" }}>
                <td className="py-3 text-[#5b403b]">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <ImageWithFallback src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-[#f5f3f3]" />
                    <div>
                      <div className="font-medium text-[#1b1c1c]">{p.name}</div>
                      <div className="text-xs text-[#8f7069] font-mono">Mã SP: {p.id.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right">{p.sold}</td>
                <td className="text-right">{formatVND(p.price)}</td>
                <td className="text-right font-semibold" style={{ color: PRIMARY }}>{formatVND(p.price * p.sold)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SellerReport() {
  return (
    <div className="space-y-5">
      <h1 style={{ color: "#1b1c1c" }}>Báo cáo & Thống kê</h1>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="mb-4" style={{ color: "#1b1c1c" }}>Sản phẩm bán chạy</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={products.slice(0, 6).map((p, i) => ({ name: `${p.name.slice(0, 12)}…#${i + 1}`, sold: p.sold }))} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5e9e5" />
              <XAxis type="number" stroke="#8f7069" />
              <YAxis dataKey="name" type="category" stroke="#8f7069" width={110} fontSize={11} />
              <Tooltip />
              <Bar dataKey="sold" fill={PRIMARY} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
          <h3 className="mb-4" style={{ color: "#1b1c1c" }}>Cơ cấu danh mục</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryShare} dataKey="value" nameKey="name" outerRadius={100} label>
                {categoryShare.map((c, i) => <Cell key={c.name} fill={["#EE4D2D", "#f97316", "#fbbf24", "#fb923c", "#fdba74"][i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SellerReviews() {
  return (
    <div className="space-y-5">
      <h1 style={{ color: "#1b1c1c" }}>Đánh giá khách hàng</h1>
      <div className="rounded-xl p-6 flex items-center gap-8 border" style={{ backgroundColor: PRIMARY_SOFT, borderColor: BORDER }}>
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: PRIMARY }}>4.9</div>
          <div className="text-amber-500 text-xl">★★★★★</div>
          <div className="text-sm text-[#5b403b] mt-1">2,453 đánh giá</div>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(s => (
            <div key={s} className="flex items-center gap-2 text-sm">
              <span className="w-6">{s}★</span>
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${[78, 15, 4, 2, 1][5 - s]}%`, backgroundColor: PRIMARY }} />
              </div>
              <span className="w-12 text-[#5b403b]">{[78, 15, 4, 2, 1][5 - s]}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: PRIMARY }}>K{i}</div>
              <div>
                <div className="font-medium text-[#1b1c1c]">Khách hàng {i}</div>
                <div className="text-amber-500 text-sm">★★★★★ · 08/06/2026</div>
              </div>
              <span className="ml-auto text-xs text-[#5b403b]">Sản phẩm: {products[i].name}</span>
            </div>
            <p className="text-sm text-[#5b403b]">Sản phẩm chất lượng tốt, giao hàng nhanh. Đóng gói cẩn thận, đáng tiền!</p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs font-medium hover:underline" style={{ color: PRIMARY }}>Phản hồi</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-4">
      <h1 style={{ color: "#1b1c1c" }}>{title}</h1>
      <div className="bg-white rounded-xl border p-12 text-center text-[#5b403b]" style={{ borderColor: BORDER }}>
        {desc}
        <div className="mt-2 text-xs">(Màn hình demo - đang phát triển)</div>
      </div>
    </div>
  );
}
