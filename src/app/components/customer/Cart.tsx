import { Minus, Plus, Trash2, Tag, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { formatVND, products } from "../../lib/data";

export function Cart({ onCheckout }: { onCheckout: () => void }) {
  const items = products.slice(0, 4).map((p, i) => ({ ...p, qty: i + 1 }));
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
  const ship = 30000;
  const discount = 50000;
  const total = subtotal + ship - discount;
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-4">
        <h1>Giỏ hàng <span className="text-slate-400 font-normal">({items.length} sản phẩm)</span></h1>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_140px_150px_120px_40px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
            <span><input type="checkbox" /></span><span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Thành tiền</span><span /></div>
          {items.map(it => (
            <div key={it.id} className="grid grid-cols-[40px_1fr_140px_150px_120px_40px] gap-4 px-5 py-4 border-b border-slate-100 items-center last:border-0">
              <input type="checkbox" defaultChecked />
              <div className="flex items-center gap-3">
                <ImageWithFallback src={it.image} alt={it.name} className="h-16 w-16 rounded-lg object-cover" />
                <div><div className="line-clamp-2 text-sm">{it.name}</div><div className="text-xs text-slate-500 mt-1">Phân loại: Mặc định</div></div>
              </div>
              <div>
                <div className="text-rose-600 font-semibold text-sm">{formatVND(it.price)}</div>
                {it.oldPrice && <div className="text-xs text-slate-400 line-through">{formatVND(it.oldPrice)}</div>}
              </div>
              <div className="flex border border-slate-200 rounded-lg w-fit">
                <button className="h-8 w-8 hover:bg-slate-50"><Minus size={12} className="mx-auto" /></button>
                <input value={it.qty} readOnly className="w-12 text-center border-x border-slate-200 outline-none text-sm" />
                <button className="h-8 w-8 hover:bg-slate-50"><Plus size={12} className="mx-auto" /></button>
              </div>
              <div className="text-rose-600 font-bold">{formatVND(it.price * it.qty)}</div>
              <button className="text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
          <Tag size={18} className="text-orange-500" />
          <input placeholder="Nhập mã giảm giá" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">Áp dụng</button>
        </div>
      </div>

      <aside className="col-span-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-32 space-y-3">
          <h3>Tóm tắt đơn hàng</h3>
          <Row label="Tạm tính" value={formatVND(subtotal)} />
          <Row label="Phí vận chuyển" value={formatVND(ship)} />
          <Row label="Giảm giá" value={`- ${formatVND(discount)}`} valueClass="text-emerald-600" />
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="font-medium">Tổng cộng</span>
            <span className="text-xl font-bold text-rose-600">{formatVND(total)}</span>
          </div>
          <button onClick={onCheckout} className="w-full h-12 bg-brand-gradient text-white rounded-xl font-semibold hover:opacity-95 shadow-pop">Tiến hành thanh toán</button>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2"><ShieldCheck size={14} className="text-emerald-500" />Thanh toán bảo mật SSL 256-bit</div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-slate-600">{label}</span><span className={valueClass || "text-slate-900 font-medium"}>{value}</span></div>;
}
