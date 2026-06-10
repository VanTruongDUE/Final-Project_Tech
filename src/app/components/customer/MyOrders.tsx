import { useState } from "react";
import { Search, Package } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { formatVND, orders, products, statusLabel } from "../../lib/data";

const tabs = [
  { k: "all", label: "Tất cả" },
  { k: "pending", label: "Chờ xác nhận" },
  { k: "confirmed", label: "Đã xác nhận" },
  { k: "shipping", label: "Đang giao" },
  { k: "delivered", label: "Đã giao" },
  { k: "cancelled", label: "Đã huỷ" },
];

export function MyOrders({ onView, onReview }: { onView?: (id: string) => void; onReview?: (id: string) => void } = {}) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);
  return (
    <div className="space-y-4">
      <h1>Đơn hàng của tôi</h1>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`flex-1 py-3.5 font-medium text-sm border-b-2 transition ${tab === t.k ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-600 hover:text-slate-900"}`}>{t.label}</button>
          ))}
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Tìm theo mã đơn, tên sản phẩm, tên shop..." className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Package size={48} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Chưa có đơn hàng nào</p>
        </div>
      ) : filtered.map(o => {
        const p = products[parseInt(o.id.slice(-1)) % products.length];
        const s = statusLabel[o.status];
        return (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{p.store}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${s.color}`}>{s.label}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{o.id}</span>
            </div>
            <div className="p-5 flex items-center gap-4">
              <ImageWithFallback src={p.image} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1"><div className="font-medium">{o.product}</div><div className="text-sm text-slate-500 mt-1">x{o.qty}</div><div className="text-xs text-slate-400 mt-1">Đặt ngày {o.date} · {o.payment}</div></div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Thành tiền</div>
                <div className="text-xl font-bold text-rose-600">{formatVND(o.total)}</div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {o.status === "delivered" && <button onClick={() => onReview?.(o.id)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Đánh giá</button>}
              {o.status === "shipping" && <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Theo dõi đơn</button>}
              {(o.status === "pending" || o.status === "confirmed") && <button className="px-4 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm hover:bg-rose-50">Huỷ đơn</button>}
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Liên hệ shop</button>
              <button onClick={() => onView?.(o.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Xem chi tiết</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
