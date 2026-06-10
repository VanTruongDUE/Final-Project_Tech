import { MapPin, CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { formatVND, products } from "../../lib/data";

export function Checkout({ onDone }: { onDone: () => void }) {
  const [pay, setPay] = useState("cod");
  const [ship, setShip] = useState("standard");
  const [done, setDone] = useState(false);
  const items = products.slice(0, 3).map((p, i) => ({ ...p, qty: i + 1 }));
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
  const shipFee = ship === "express" ? 50000 : 30000;
  const total = subtotal + shipFee - 50000;

  if (done) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-12 text-center my-12">
        <div className="h-20 w-20 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-5"><CheckCircle2 size={48} className="text-emerald-600" /></div>
        <h1 className="mb-2">Đặt hàng thành công!</h1>
        <p className="text-slate-500 mb-1">Mã đơn: <span className="font-mono text-slate-900">DH-20260609-{Math.floor(Math.random() * 9000 + 1000)}</span></p>
        <p className="text-slate-500 mb-8">Tổng giá trị: <span className="font-semibold text-rose-600">{formatVND(total)}</span></p>
        <div className="flex gap-3 justify-center">
          <button onClick={onDone} className="px-6 py-3 border border-slate-200 rounded-xl font-medium">Tiếp tục mua sắm</button>
          <button onClick={onDone} className="px-6 py-3 bg-brand-gradient text-white rounded-xl font-medium shadow-pop">Xem đơn hàng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-4">
        <h1>Thanh toán</h1>

        <Section title="Địa chỉ giao hàng" icon={<MapPin className="text-indigo-600" size={20} />}>
          <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-600"><MapPin size={20} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Nguyễn Văn An</span><span className="text-slate-300">|</span><span className="text-slate-600 text-sm">0901 234 567</span>
                <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-0.5 rounded">Mặc định</span>
              </div>
              <div className="text-sm text-slate-600 mt-1">123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</div>
            </div>
            <button className="text-indigo-600 text-sm font-medium">Thay đổi</button>
          </div>
        </Section>

        <Section title={`Sản phẩm (${items.length})`}>
          {items.map(it => (
            <div key={it.id} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
              <ImageWithFallback src={it.image} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1"><div className="text-sm line-clamp-1">{it.name}</div><div className="text-xs text-slate-500">x{it.qty}</div></div>
              <div className="text-rose-600 font-semibold">{formatVND(it.price * it.qty)}</div>
            </div>
          ))}
        </Section>

        <Section title="Phương thức vận chuyển">
          {[{ k: "standard", t: "Giao hàng tiêu chuẩn", s: "Nhận trong 3-5 ngày", f: 30000 }, { k: "express", t: "Giao hàng siêu tốc", s: "Nhận trong 2 giờ (nội thành)", f: 50000 }].map(s => (
            <label key={s.k} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer mb-2 ${ship === s.k ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200"}`}>
              <input type="radio" checked={ship === s.k} onChange={() => setShip(s.k)} className="text-indigo-600" />
              <div className="flex-1"><div className="font-medium">{s.t}</div><div className="text-xs text-slate-500">{s.s}</div></div>
              <div className="font-semibold">{formatVND(s.f)}</div>
            </label>
          ))}
        </Section>

        <Section title="Phương thức thanh toán">
          {[{ k: "cod", t: "Thanh toán khi nhận hàng (COD)", i: Banknote }, { k: "bank", t: "Chuyển khoản ngân hàng", i: CreditCard }, { k: "momo", t: "Ví Momo / VNPay / ZaloPay", i: Wallet }].map(p => (
            <label key={p.k} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer mb-2 ${pay === p.k ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200"}`}>
              <input type="radio" checked={pay === p.k} onChange={() => setPay(p.k)} className="text-indigo-600" />
              <p.i size={20} className="text-indigo-600" />
              <div className="font-medium">{p.t}</div>
            </label>
          ))}
        </Section>
      </div>

      <aside className="col-span-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-32 space-y-3">
          <h3>Tổng đơn hàng</h3>
          <Row label="Tạm tính" value={formatVND(subtotal)} />
          <Row label="Vận chuyển" value={formatVND(shipFee)} />
          <Row label="Voucher" value={`- ${formatVND(50000)}`} cls="text-emerald-600" />
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-medium">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-rose-600">{formatVND(total)}</span>
          </div>
          <button onClick={() => setDone(true)} className="w-full h-12 bg-brand-gradient text-white rounded-xl font-semibold shadow-pop">Đặt hàng</button>
          <p className="text-xs text-slate-500 text-center">Khi nhấn "Đặt hàng" bạn đã đồng ý với <span className="text-indigo-600">Điều khoản dịch vụ</span> của T2 Commerce.</p>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-3">{icon}<h3>{title}</h3></div>
      {children}
    </div>
  );
}
function Row({ label, value, cls = "" }: any) {
  return <div className="flex items-center justify-between text-sm"><span className="text-slate-600">{label}</span><span className={cls || "font-medium"}>{value}</span></div>;
}
