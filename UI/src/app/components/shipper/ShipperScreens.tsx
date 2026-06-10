import { useState } from "react";
import { Package, MapPin, CheckCircle2, History, Wallet, Phone, Navigation, Camera, Truck, Clock } from "lucide-react";
import { DashboardLayout, NavItem } from "../shared/DashboardLayout";
import { StatCard } from "../shared/StatCard";
import { formatVND, orders, statusLabel } from "../../lib/data";

const NAV: NavItem[] = [
  { k: "queue", label: "Đơn đang giao", icon: Truck, badge: 5, group: "Giao hàng" },
  { k: "available", label: "Đơn có sẵn", icon: Package, badge: 12, group: "Giao hàng" },
  { k: "history", label: "Lịch sử", icon: History, group: "Giao hàng" },
  { k: "earning", label: "Thu nhập", icon: Wallet, group: "Cá nhân" },
];

export function ShipperApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState("queue");
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <DashboardLayout nav={NAV} page={page} setPage={(k) => { setPage(k); setSelected(null); }} role="Shipper" user={{ name: "Lê Quốc Cường", email: "cuong.shipper@t2.vn" }} onLogout={onLogout}>
      {selected ? <OrderDetail id={selected} onBack={() => setSelected(null)} /> :
        page === "queue" ? <Queue onSelect={setSelected} /> :
        page === "available" ? <Available /> :
        page === "history" ? <HistoryPage /> :
        <Earning />
      }
    </DashboardLayout>
  );
}

function Queue({ onSelect }: { onSelect: (id: string) => void }) {
  const my = orders.filter(o => o.status === "shipping" || o.status === "confirmed");
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Truck} label="Đơn đang giao" value="5" color="indigo" />
        <StatCard icon={CheckCircle2} label="Đã giao hôm nay" value="14" delta={12} color="emerald" />
        <StatCard icon={Wallet} label="Thu nhập hôm nay" value={formatVND(385000)} delta={8} color="orange" />
        <StatCard icon={Clock} label="Tỷ lệ đúng giờ" value="98%" delta={2} color="violet" />
      </div>

      <h2>Đơn cần giao</h2>
      <div className="space-y-3">
        {my.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-soft transition cursor-pointer" onClick={() => onSelect(o.id)}>
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3"><span className="font-mono text-sm font-semibold">{o.id}</span><span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusLabel[o.status].color}`}>{statusLabel[o.status].label}</span></div>
              <span className="text-xs text-slate-500">{o.payment === "COD" ? "Thu hộ COD" : "Đã thanh toán"}</span>
            </div>
            <div className="p-5 grid grid-cols-3 gap-5">
              <div>
                <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Người nhận</div>
                <div className="font-semibold">{o.customer}</div>
                <div className="text-sm text-slate-600 mt-1 flex items-start gap-1"><MapPin size={14} className="mt-0.5 text-rose-500 shrink-0" /> {o.address}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Sản phẩm</div>
                <div className="text-sm line-clamp-2">{o.product}</div>
                <div className="text-xs text-slate-500 mt-1">Số lượng: {o.qty}</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-slate-400 font-semibold mb-1">{o.payment === "COD" ? "Thu hộ" : "Giá trị"}</div>
                <div className="text-2xl font-bold text-rose-600">{formatVND(o.total)}</div>
                <div className="flex gap-2 mt-3 justify-end">
                  <button className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50"><Phone size={16} /></button>
                  <button className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50"><Navigation size={16} /></button>
                  <button className="px-4 h-9 bg-brand-gradient text-white rounded-lg text-sm font-medium">Chi tiết →</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const o = orders.find(x => x.id === id) || orders[0];
  const steps = ["Đã nhận đơn", "Đến lấy hàng", "Đang giao", "Đã giao thành công"];
  const currentStep = 2;
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm text-indigo-600 font-medium">← Quay lại danh sách</button>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4"><div><h2>Đơn {o.id}</h2><div className="text-sm text-slate-500 mt-0.5">Đặt ngày {o.date} · {o.payment}</div></div><span className={`text-sm px-3 py-1.5 rounded-full border font-medium ${statusLabel[o.status].color}`}>{statusLabel[o.status].label}</span></div>

            <div className="bg-slate-50 rounded-xl p-5 my-4">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1 flex items-center">
                    <div className={`flex flex-col items-center text-center flex-shrink-0 w-32`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i <= currentStep ? "bg-brand-gradient text-white shadow-pop" : "bg-white border-2 border-slate-200 text-slate-400"}`}>{i <= currentStep ? <CheckCircle2 size={20} /> : i + 1}</div>
                      <div className={`text-xs mt-2 font-medium ${i <= currentStep ? "text-slate-900" : "text-slate-400"}`}>{s}</div>
                    </div>
                    {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-indigo-500" : "bg-slate-200"}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-4">Thông tin nhận hàng</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-slate-500 mb-1">Người nhận</div><div className="font-medium">{o.customer}</div></div>
              <div><div className="text-slate-500 mb-1">SĐT</div><div className="font-medium">0901 234 567</div></div>
              <div className="col-span-2"><div className="text-slate-500 mb-1">Địa chỉ</div><div className="font-medium">123 Lê Lợi, P. Bến Nghé, Q.1, TP. Hồ Chí Minh</div></div>
              <div className="col-span-2"><div className="text-slate-500 mb-1">Ghi chú</div><div className="text-slate-700">Vui lòng gọi trước khi giao 5 phút. Giao giờ hành chính.</div></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-4">Sản phẩm</h3>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div><div className="font-medium">{o.product}</div><div className="text-xs text-slate-500">x{o.qty}</div></div>
              <div className="text-rose-600 font-semibold">{formatVND(o.total)}</div>
            </div>
            <div className="flex items-center justify-between pt-3"><span className="font-semibold">{o.payment === "COD" ? "Thu hộ COD" : "Đã thanh toán"}</span><span className="text-2xl font-bold text-rose-600">{formatVND(o.total)}</span></div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 relative flex items-center justify-center">
              <MapPin size={48} className="text-rose-500" />
              <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-2 text-xs font-mono shadow-soft">10.776, 106.700</div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500 mb-1">Khoảng cách</div>
              <div className="text-2xl font-bold">2.4 km</div>
              <div className="text-xs text-slate-500 mt-1">Ước tính: 12 phút</div>
              <button className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2"><Navigation size={16} /> Mở Google Maps</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <button className="w-full h-12 bg-brand-gradient text-white rounded-xl font-semibold shadow-pop flex items-center justify-center gap-2"><CheckCircle2 size={18} /> Xác nhận đã giao</button>
            <button className="w-full h-11 border-2 border-indigo-200 text-indigo-700 rounded-xl font-medium flex items-center justify-center gap-2"><Camera size={16} /> Chụp ảnh giao hàng</button>
            <button className="w-full h-11 border border-rose-200 text-rose-600 rounded-xl font-medium">Báo cáo sự cố</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Available() {
  return (
    <div className="space-y-5">
      <h1>Đơn có sẵn (12)</h1>
      <p className="text-slate-500">Các đơn hàng trong khu vực của bạn cần shipper nhận. Nhấn "Nhận đơn" để bắt đầu giao.</p>
      <div className="space-y-3">
        {orders.slice(0, 6).map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><Package size={22} /></div>
            <div className="flex-1"><div className="font-semibold">{o.id}</div><div className="text-sm text-slate-600 mt-1 flex items-center gap-1"><MapPin size={12} className="text-rose-500" /> {o.address}</div></div>
            <div className="text-center"><div className="text-xs text-slate-500">Khoảng cách</div><div className="font-bold">3.2 km</div></div>
            <div className="text-center"><div className="text-xs text-slate-500">Phí ship</div><div className="font-bold text-emerald-600">{formatVND(28000)}</div></div>
            <button className="px-5 py-2.5 bg-brand-gradient text-white rounded-xl font-medium shadow-pop">Nhận đơn</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPage() {
  return (
    <div className="space-y-5">
      <h1>Lịch sử giao hàng</h1>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-xs uppercase text-slate-500 bg-slate-50"><th className="py-3 px-4 text-left font-semibold">Mã đơn</th><th className="text-left font-semibold">Khách</th><th className="text-left font-semibold">Địa chỉ</th><th className="text-right font-semibold">Giá trị</th><th className="text-right font-semibold">Phí ship</th><th className="text-left font-semibold">Ngày</th><th className="text-center font-semibold">Trạng thái</th></tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o.id} className="border-t border-slate-100"><td className="py-3 px-4 font-mono text-xs">{o.id}</td><td>{o.customer}</td><td className="line-clamp-1 max-w-xs">{o.address}</td><td className="text-right font-semibold">{formatVND(o.total)}</td><td className="text-right text-emerald-600 font-semibold">{formatVND(28000)}</td><td>{o.date}</td><td className="text-center"><span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusLabel[o.status].color}`}>{statusLabel[o.status].label}</span></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Earning() {
  return (
    <div className="space-y-5">
      <h1>Thu nhập của tôi</h1>
      <div className="bg-brand-gradient rounded-3xl p-6 text-white">
        <div className="text-sm opacity-80">Tổng thu nhập tháng 6/2026</div>
        <div className="text-5xl font-extrabold mt-2">{formatVND(8_540_000)}</div>
        <div className="text-sm opacity-80 mt-2">+ {formatVND(1_240_000)} so với tháng trước (+17%)</div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={CheckCircle2} label="Đơn đã giao" value="320" color="emerald" />
        <StatCard icon={Wallet} label="Thu nhập trung bình/đơn" value={formatVND(26700)} color="indigo" />
        <StatCard icon={Clock} label="Tỷ lệ đúng giờ" value="98%" color="violet" />
      </div>
    </div>
  );
}
