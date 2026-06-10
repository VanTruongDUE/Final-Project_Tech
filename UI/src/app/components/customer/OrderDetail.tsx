import { ArrowLeft, MessageCircle, MapPin, Receipt, Wallet, Clock, Check, Cog, Truck, PackageCheck } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { formatVND, orders, products, statusLabel, type Order } from "../../lib/data";

const PRIMARY = "#EE4D2D";
const PRIMARY_DARK = "#b22204";
const BORDER = "#e3beb6";

const STEPS: { key: Order["status"] | "processing"; label: string; icon: any; time?: string }[] = [
  { key: "pending", label: "Chờ xác nhận", icon: Clock, time: "14:30 24/10" },
  { key: "confirmed", label: "Đã xác nhận", icon: Check, time: "15:00 24/10" },
  { key: "processing" as any, label: "Đang xử lý", icon: Cog, time: "08:00 25/10" },
  { key: "shipping", label: "Đang giao", icon: Truck, time: "10:30 25/10" },
  { key: "delivered", label: "Hoàn thành", icon: PackageCheck },
];

export function OrderDetail({ id, onBack, onReview, onCancel }: { id?: string; onBack?: () => void; onReview?: () => void; onCancel?: () => void }) {
  const o = orders.find(x => x.id === id) || orders[2];
  const p = products[2];
  const idx = STEPS.findIndex(s => s.key === o.status);
  const currentIdx = idx === -1 ? 2 : idx;
  const items = [p, products[5]];
  const subtotal = items.reduce((s, x, i) => s + x.price * (i + 1), 0);
  const shipping = 35000;
  const shopDiscount = 200000;
  const voucher = 35000;
  const total = subtotal + shipping - shopDiscount - voucher;

  return (
    <div className="space-y-5 font-['Inter']">
      <button onClick={onBack} className="text-sm flex items-center gap-1 hover:underline" style={{ color: PRIMARY }}>
        <ArrowLeft size={14} /> Quay lại đơn hàng của tôi
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[#1b1c1c]">Đơn hàng #{o.id}</h1>
            <div className="text-sm text-[#5b403b] mt-1 flex items-center gap-1.5">
              <Clock size={14} /> Đặt lúc: 14:30 - {o.date}
            </div>
          </div>
          <span className="px-4 py-2 rounded-full text-white text-sm font-semibold inline-flex items-center gap-1.5" style={{ backgroundColor: PRIMARY }}>
            <Truck size={14} /> {statusLabel[o.status].label.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: BORDER }}>
        <h3 className="mb-5 text-[#1b1c1c]">Tiến trình đơn hàng</h3>
        <div className="flex items-start justify-between relative">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i <= currentIdx;
            return (
              <div key={s.key as string} className="flex-1 flex flex-col items-center text-center relative z-10">
                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: active ? PRIMARY : "#f5f3f3",
                    color: active ? "#fff" : "#8f7069",
                    boxShadow: active ? "0 4px 12px rgba(238,77,45,0.25)" : undefined,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className={`text-xs mt-2 font-medium ${active ? "text-[#1b1c1c]" : "text-[#8f7069]"}`}>{s.label}</div>
                {s.time && <div className="text-[11px] text-[#8f7069] mt-0.5">{s.time}</div>}
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute top-[22px] left-1/2 w-full h-[2px]"
                    style={{ backgroundColor: i < currentIdx ? PRIMARY : "#e3e2e2" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Shop */}
          <div className="bg-white rounded-xl border p-5 flex items-center gap-3" style={{ borderColor: BORDER }}>
            <div className="h-11 w-11 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: PRIMARY }}>
              {p.store.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[#1b1c1c]">{p.store}</div>
              <div className="text-xs text-[#5b403b] mt-0.5">Mall</div>
            </div>
            <button className="h-9 px-4 rounded-lg border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-[#fff8f5] transition" style={{ borderColor: BORDER, color: PRIMARY }}>
              <MessageCircle size={14} /> Nhắn tin shop
            </button>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-4 text-[#1b1c1c]">Sản phẩm</h3>
            <div className="space-y-4">
              {items.map((x, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: "#f0e6e2" }}>
                  <ImageWithFallback src={x.image} alt={x.name} className="h-16 w-16 rounded-lg object-cover bg-[#f5f3f3]" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#1b1c1c]">{x.name}</div>
                    <div className="text-xs text-[#5b403b] mt-1">Phân loại: Mặc định</div>
                    <div className="text-xs text-[#5b403b]">x{i + 1}</div>
                  </div>
                  <div className="font-semibold" style={{ color: PRIMARY }}>{formatVND(x.price * (i + 1))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          {/* Address */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-3 flex items-center gap-2 text-[#1b1c1c]"><MapPin size={16} style={{ color: PRIMARY }} /> Địa chỉ nhận hàng</h3>
            <div className="text-sm space-y-1">
              <div className="font-semibold text-[#1b1c1c]">{o.customer}</div>
              <div className="text-[#5b403b]">(+84) 901 234 567</div>
              <div className="text-[#5b403b]">Toà nhà E-Town, 364 Cộng Hoà, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: BORDER }}>
            <h3 className="mb-3 flex items-center gap-2 text-[#1b1c1c]"><Receipt size={16} style={{ color: PRIMARY }} /> Tóm tắt thanh toán</h3>
            <div className="space-y-2 text-sm">
              <Row label="Tạm tính" value={formatVND(subtotal)} />
              <Row label="Phí vận chuyển" value={formatVND(shipping)} />
              <Row label="Giảm giá Shop" value={`- ${formatVND(shopDiscount)}`} cls="text-emerald-600" />
              <Row label="Voucher Miễn phí VC" value={`- ${formatVND(voucher)}`} cls="text-emerald-600" />
            </div>
            <div className="border-t mt-3 pt-3 flex items-center justify-between" style={{ borderColor: "#f0e6e2" }}>
              <span className="font-semibold text-[#1b1c1c]">Tổng tiền</span>
              <span className="text-xl font-bold" style={{ color: PRIMARY }}>{formatVND(total)}</span>
            </div>
            <div className="mt-3 text-xs text-[#5b403b] flex items-center gap-1.5">
              <Wallet size={12} /> Thanh toán qua Ví ShopeePay
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {(o.status === "pending" || o.status === "confirmed") ? (
              <button onClick={onCancel} className="flex-1 h-11 border rounded-lg font-medium hover:bg-rose-50 text-rose-600" style={{ borderColor: "#fecaca" }}>
                Huỷ đơn
              </button>
            ) : (
              <button className="flex-1 h-11 border rounded-lg font-medium hover:bg-[#fff8f5] text-[#1b1c1c]" style={{ borderColor: BORDER }}>
                Mua lại
              </button>
            )}
            {o.status === "delivered" ? (
              <button onClick={onReview} className="flex-1 h-11 rounded-lg text-white font-semibold transition" style={{ backgroundColor: PRIMARY }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_DARK)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
                Đánh giá
              </button>
            ) : (
              <button className="flex-1 h-11 rounded-lg text-white font-semibold transition" style={{ backgroundColor: PRIMARY }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_DARK)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
                Liên hệ shop
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, cls = "" }: { label: string; value: string; cls?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#5b403b]">{label}</span>
      <span className={cls || "text-[#1b1c1c] font-medium"}>{value}</span>
    </div>
  );
}
