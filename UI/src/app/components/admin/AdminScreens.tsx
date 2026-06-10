import { useState } from "react";
import { LayoutDashboard, Users, Store, Package, ShoppingCart, BarChart3, Wallet, Shield, Bell, Settings, FileText, MessageSquare, Search, MoreVertical, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DashboardLayout, NavItem } from "../shared/DashboardLayout";
import { StatCard } from "../shared/StatCard";
import { formatVND, orders, products, statusLabel, revenueData, users, stores, categoryShare } from "../../lib/data";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

const NAV: NavItem[] = [
  { k: "dash", label: "Tổng quan", icon: LayoutDashboard, group: "Tổng quan" },
  { k: "users", label: "Tài khoản", icon: Users, group: "Quản lý" },
  { k: "stores", label: "Cửa hàng", icon: Store, badge: 5, group: "Quản lý" },
  { k: "products", label: "Sản phẩm", icon: Package, group: "Quản lý" },
  { k: "orders", label: "Đơn hàng", icon: ShoppingCart, group: "Quản lý" },
  { k: "roles", label: "Vai trò & Phân quyền", icon: Shield, group: "Hệ thống" },
  { k: "report", label: "Báo cáo", icon: BarChart3, group: "Phân tích" },
  { k: "revenue", label: "Doanh thu sàn", icon: Wallet, group: "Phân tích" },
  { k: "complaint", label: "Khiếu nại", icon: MessageSquare, badge: 12, group: "Phân tích" },
  { k: "notif", label: "Thông báo", icon: Bell, group: "Hệ thống" },
  { k: "logs", label: "Nhật ký hệ thống", icon: FileText, group: "Hệ thống" },
  { k: "settings", label: "Cấu hình", icon: Settings, group: "Hệ thống" },
];

export function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState("dash");
  return (
    <DashboardLayout nav={NAV} page={page} setPage={setPage} role="Quản trị viên" user={{ name: "Admin Master", email: "admin@t2commerce.vn" }} onLogout={onLogout}>
      {page === "dash" && <AdminDashboard />}
      {page === "users" && <AdminUsers />}
      {page === "stores" && <AdminStores />}
      {page === "products" && <AdminProducts />}
      {page === "orders" && <AdminOrders />}
      {page === "roles" && <AdminRoles />}
      {page === "report" && <AdminReport />}
      {page === "revenue" && <AdminRevenue />}
      {page === "complaint" && <AdminComplaint />}
      {(page === "notif" || page === "logs" || page === "settings") && <Placeholder title={NAV.find(n=>n.k===page)!.label} />}
    </DashboardLayout>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-5">
      <div className="bg-brand-gradient rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-white">Bảng điều khiển hệ thống</h1>
          <p className="opacity-90 mt-1">Theo dõi và quản lý toàn bộ hoạt động sàn T2 Commerce</p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute right-20 -top-10 h-32 w-32 rounded-full bg-white/10" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} label="Tổng người dùng" value="48,290" delta={18} color="indigo" />
        <StatCard icon={Store} label="Cửa hàng hoạt động" value="1,245" delta={8} color="orange" />
        <StatCard icon={Wallet} label="GMV tháng này" value={formatVND(28_500_000_000)} delta={24} color="emerald" />
        <StatCard icon={ShoppingCart} label="Đơn thành công" value="124,580" delta={15} color="violet" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4">Tăng trưởng giao dịch (triệu VND)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: "#6366f1" }} />
              <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{ r: 5, fill: "#f97316" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4">Phân bổ doanh thu theo ngành</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={categoryShare} dataKey="value" outerRadius={90} label={(e: any) => `${e.value}%`}>{categoryShare.map((_, i) => <Cell key={i} fill={["#6366f1","#f97316","#10b981","#f59e0b","#ec4899"][i]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4"><h3>Cửa hàng chờ duyệt</h3><span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">5 yêu cầu</span></div>
          {stores.filter(s => s.status === "pending").concat(stores.slice(0,2)).slice(0,4).map(s => (
            <div key={s.id} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold">{s.name.charAt(0)}</div>
              <div className="flex-1"><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-slate-500">{s.owner}</div></div>
              <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium">Duyệt</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium">Từ chối</button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4">Cảnh báo hệ thống</h3>
          {[
            { i: AlertTriangle, c: "bg-amber-100 text-amber-600", t: "12 sản phẩm bị tố cáo cần xử lý", time: "2 giờ trước" },
            { i: AlertTriangle, c: "bg-rose-100 text-rose-600", t: "Cửa hàng \"Fake Brand\" bị báo cáo lừa đảo", time: "4 giờ trước" },
            { i: CheckCircle2, c: "bg-emerald-100 text-emerald-600", t: "Backup dữ liệu hàng ngày hoàn tất", time: "6 giờ trước" },
            { i: TrendingUp, c: "bg-indigo-100 text-indigo-600", t: "Lưu lượng tăng 32% so với cùng kỳ", time: "1 ngày trước" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${a.c}`}><a.i size={18} /></div>
              <div className="flex-1"><div className="text-sm">{a.t}</div><div className="text-xs text-slate-400">{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? users : users.filter(u => (tab === "buyer" ? u.role === "Khách hàng" : tab === "seller" ? u.role === "Người bán" : tab === "shipper" ? u.role === "Shipper" : true));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1>Quản lý tài khoản</h1><button className="bg-brand-gradient text-white px-5 py-2.5 rounded-xl font-medium shadow-pop">+ Tạo tài khoản</button></div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {[{k:"all",l:"Tất cả"},{k:"buyer",l:"Khách hàng"},{k:"seller",l:"Người bán"},{k:"shipper",l:"Shipper"}].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`px-5 py-3 text-sm font-medium border-b-2 ${tab === t.k ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-600"}`}>{t.l}</button>
          ))}
        </div>
        <div className="p-4 border-b border-slate-100"><div className="relative max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input placeholder="Tìm tên, email..." className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div></div>
        <table className="w-full text-sm">
          <thead><tr className="text-xs uppercase text-slate-500 bg-slate-50"><th className="py-3 px-4 text-left font-semibold">ID</th><th className="text-left font-semibold">Tài khoản</th><th className="text-left font-semibold">Vai trò</th><th className="text-right font-semibold">Đơn hàng</th><th className="text-left font-semibold">Ngày tham gia</th><th className="text-center font-semibold">Trạng thái</th><th className="px-4"></th></tr></thead>
          <tbody>{filtered.map(u => (
            <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-4 font-mono text-xs">{u.id}</td>
              <td><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div><div><div className="font-medium">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></div></div></td>
              <td><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "Khách hàng" ? "bg-blue-100 text-blue-700" : u.role === "Người bán" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>{u.role}</span></td>
              <td className="text-right">{u.orders}</td>
              <td className="text-slate-600">{u.joined}</td>
              <td className="text-center"><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : u.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{u.status === "active" ? "Hoạt động" : u.status === "pending" ? "Chờ duyệt" : "Đã khoá"}</span></td>
              <td className="px-4"><button className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center mx-auto"><MoreVertical size={16} /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminStores() {
  return (
    <div className="space-y-5">
      <h1>Quản lý cửa hàng</h1>
      <div className="grid grid-cols-3 gap-4">
        {stores.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-3 mb-4"><div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">{s.name.charAt(0)}</div>
              <div className="flex-1"><div className="font-semibold">{s.name}</div><div className="text-xs text-slate-500">{s.owner}</div></div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{s.status === "active" ? "Hoạt động" : "Chờ duyệt"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-slate-100">
              <div><div className="font-bold">{s.products}</div><div className="text-xs text-slate-500">Sản phẩm</div></div>
              <div><div className="font-bold">{s.orders}</div><div className="text-xs text-slate-500">Đơn hàng</div></div>
              <div><div className="font-bold text-amber-500">★ {s.rating || "—"}</div><div className="text-xs text-slate-500">Đánh giá</div></div>
            </div>
            <div className="text-sm text-slate-500 mt-3">Doanh thu: <span className="font-semibold text-rose-600">{formatVND(s.revenue * 1_000_000)}</span></div>
            <div className="mt-3 flex gap-2"><button className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm">Xem</button><button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Quản lý</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProducts() {
  return (
    <div className="space-y-5">
      <h1>Quản lý sản phẩm toàn sàn</h1>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Package} label="Tổng sản phẩm" value="124,890" delta={5} color="indigo" />
        <StatCard icon={CheckCircle2} label="Đã duyệt" value="121,200" color="emerald" />
        <StatCard icon={AlertTriangle} label="Chờ duyệt" value="3,420" color="amber" />
        <StatCard icon={MessageSquare} label="Bị báo cáo" value="270" color="rose" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-xs uppercase text-slate-500 bg-slate-50"><th className="py-3 px-4 text-left font-semibold">Sản phẩm</th><th className="text-left font-semibold">Cửa hàng</th><th className="text-left font-semibold">Danh mục</th><th className="text-right font-semibold">Giá</th><th className="text-right font-semibold">Đã bán</th><th className="text-right font-semibold">Đánh giá</th><th className="px-4"></th></tr></thead>
          <tbody>{products.map(p => (
            <tr key={p.id} className="border-t border-slate-100">
              <td className="py-3 px-4"><div className="flex items-center gap-3"><ImageWithFallback src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" /><div className="line-clamp-1 max-w-xs">{p.name}</div></div></td>
              <td className="text-slate-600">{p.store}</td><td className="capitalize text-slate-600">{p.category}</td>
              <td className="text-right font-semibold">{formatVND(p.price)}</td>
              <td className="text-right">{p.sold}</td>
              <td className="text-right text-amber-500">★ {p.rating}</td>
              <td className="px-4 text-right"><button className="text-indigo-600 text-sm">Chi tiết</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminOrders() {
  return (
    <div className="space-y-5">
      <h1>Đơn hàng toàn sàn</h1>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-xs uppercase text-slate-500 bg-slate-50"><th className="py-3 px-4 text-left font-semibold">Mã đơn</th><th className="text-left font-semibold">Khách</th><th className="text-left font-semibold">Sản phẩm</th><th className="text-right font-semibold">Giá trị</th><th className="text-left font-semibold">Ngày</th><th className="text-center font-semibold">Trạng thái</th></tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o.id} className="border-t border-slate-100"><td className="py-3 px-4 font-mono text-xs">{o.id}</td><td>{o.customer}</td><td className="line-clamp-1 max-w-sm">{o.product}</td><td className="text-right font-semibold text-rose-600">{formatVND(o.total)}</td><td>{o.date}</td><td className="text-center"><span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusLabel[o.status].color}`}>{statusLabel[o.status].label}</span></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminRoles() {
  const roles = [
    { name: "Super Admin", count: 2, perms: ["Toàn quyền hệ thống", "Quản lý admin", "Cấu hình core"] },
    { name: "Admin", count: 8, perms: ["Quản lý người dùng", "Quản lý cửa hàng", "Xử lý khiếu nại"] },
    { name: "Người bán", count: 1245, perms: ["Quản lý sản phẩm shop", "Đơn hàng shop", "Doanh thu shop"] },
    { name: "Khách hàng", count: 47000, perms: ["Mua hàng", "Đánh giá", "Chat shop"] },
    { name: "Shipper", count: 320, perms: ["Nhận đơn", "Cập nhật trạng thái", "Xác nhận giao hàng"] },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1>Vai trò & Phân quyền</h1><button className="bg-brand-gradient text-white px-5 py-2.5 rounded-xl font-medium shadow-pop">+ Tạo vai trò</button></div>
      <div className="grid grid-cols-2 gap-4">
        {roles.map(r => (
          <div key={r.name} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><Shield size={20} /></div><div><div className="font-semibold">{r.name}</div><div className="text-xs text-slate-500">{r.count.toLocaleString("vi-VN")} tài khoản</div></div></div><button className="text-sm text-indigo-600 font-medium">Chỉnh sửa</button></div>
            <div className="space-y-1.5 mt-3">{r.perms.map(p => (<div key={p} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={14} className="text-emerald-500" /> {p}</div>))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReport() {
  return (
    <div className="space-y-5">
      <h1>Báo cáo tổng quan</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4">Top sản phẩm bán chạy toàn sàn</h3>
          <ResponsiveContainer width="100%" height={320}><BarChart data={products.slice(0, 8).map(p => ({ name: p.name.slice(0, 14) + "...", sold: p.sold }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis type="number" stroke="#94a3b8" /><YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} fontSize={11} /><Tooltip /><Bar dataKey="sold" fill="#6366f1" radius={[0,8,8,0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4">Đơn hàng theo tháng</h3>
          <ResponsiveContainer width="100%" height={320}><AreaChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Area type="monotone" dataKey="orders" stroke="#f97316" fill="#fed7aa" /></AreaChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AdminRevenue() {
  return (
    <div className="space-y-5">
      <h1>Doanh thu sàn</h1>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="GMV năm 2026" value={formatVND(285_000_000_000)} delta={32} color="indigo" />
        <StatCard icon={TrendingUp} label="Phí dịch vụ" value={formatVND(14_250_000_000)} delta={28} color="emerald" />
        <StatCard icon={ShoppingCart} label="Đơn thành công" value="1.24M" delta={18} color="orange" />
        <StatCard icon={Users} label="Khách hoạt động" value="320K" delta={11} color="violet" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="mb-4">Doanh thu vs Phí dịch vụ (tỷ VND)</h3>
        <ResponsiveContainer width="100%" height={350}><BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Legend /><Bar dataKey="revenue" fill="#6366f1" name="GMV" radius={[8,8,0,0]} /><Bar dataKey="orders" fill="#f97316" name="Phí dịch vụ" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminComplaint() {
  return (
    <div className="space-y-5">
      <h1>Quản lý khiếu nại</h1>
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center"><AlertTriangle size={22} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className="font-semibold">Khiếu nại #KN-2026{1000+i}</span><span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Chờ xử lý</span><span className="text-xs text-slate-500">· 08/06/2026</span></div>
              <div className="text-sm text-slate-700">Khách hàng <strong>Nguyễn Văn A</strong> tố cáo cửa hàng <strong>Fake Shop</strong> bán hàng giả thương hiệu Nike. Đã đính kèm 3 hình ảnh và biên lai mua hàng.</div>
              <div className="mt-3 flex gap-2"><button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium">Xem chi tiết</button><button className="px-4 py-1.5 border border-slate-200 rounded-lg text-sm">Liên hệ</button><button className="px-4 py-1.5 border border-rose-200 text-rose-600 rounded-lg text-sm">Khoá shop</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return <div className="space-y-4"><h1>{title}</h1><div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">Màn hình đang phát triển - hiển thị giao diện cơ bản theo yêu cầu nhóm.</div></div>;
}
