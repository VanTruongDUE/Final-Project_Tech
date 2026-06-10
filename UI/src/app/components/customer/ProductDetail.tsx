import { useState } from "react";
import { Star, Truck, ShieldCheck, RefreshCw, Heart, MessageCircle, Store, ChevronRight, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ProductCard } from "../shared/ProductCard";
import { formatVND, products } from "../../lib/data";

export function ProductDetail({ id, onCart, onBack }: { id: string; onCart: () => void; onBack: () => void }) {
  const p = products.find(x => x.id === id) || products[0];
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const gallery = [p.image, ...products.slice(0, 4).map(x => x.image)];

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-indigo-600">Trang chủ</button><ChevronRight size={14} className="mx-1" />
        <span>Danh mục</span><ChevronRight size={14} className="mx-1" />
        <span className="text-slate-900 line-clamp-1">{p.name}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-12 gap-8">
        {/* Gallery */}
        <div className="col-span-5 space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-50">
            <ImageWithFallback src={gallery[imgIdx]} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`aspect-square rounded-lg overflow-hidden border-2 ${imgIdx === i ? "border-indigo-500" : "border-transparent"}`}>
                <ImageWithFallback src={g} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md text-xs font-semibold uppercase">★ Yêu thích</div>
          <h1 className="text-2xl text-slate-900 leading-tight">{p.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1"><Star size={16} className="fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-900">{p.rating}</span><span className="text-slate-500 underline">(2.4k đánh giá)</span></div>
            <div className="text-slate-300">|</div>
            <div className="text-slate-600"><span className="font-semibold text-slate-900">{p.sold}</span> đã bán</div>
            <div className="text-slate-300">|</div>
            <button className="text-indigo-600 hover:underline">Tố cáo</button>
          </div>

          <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-5 rounded-xl">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-rose-600">{formatVND(p.price)}</span>
              {p.oldPrice && <><span className="text-slate-400 line-through">{formatVND(p.oldPrice)}</span><span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">-{p.discount}%</span></>}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-[120px_1fr] items-center gap-3">
              <span className="text-sm text-slate-500">Vận chuyển</span>
              <div className="flex items-center gap-2 text-sm"><Truck size={16} className="text-emerald-600" /> Miễn phí · Giao 2h nội thành</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-3">
              <span className="text-sm text-slate-500">Màu sắc</span>
              <div className="flex gap-2">{["bg-slate-900", "bg-rose-500", "bg-indigo-500", "bg-emerald-500"].map((c, i) => (<button key={i} className={`h-9 w-9 rounded-lg ${c} ring-2 ring-transparent ${i === 0 ? "ring-indigo-500 ring-offset-2" : ""}`} />))}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-3">
              <span className="text-sm text-slate-500">Kích cỡ</span>
              <div className="flex gap-2">{["S", "M", "L", "XL", "XXL"].map((s, i) => (<button key={s} className={`h-9 px-4 rounded-lg border ${i === 1 ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:border-slate-300"} text-sm font-medium`}>{s}</button>))}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-3">
              <span className="text-sm text-slate-500">Số lượng</span>
              <div className="flex items-center gap-3">
                <div className="flex border border-slate-200 rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center text-slate-600 hover:bg-slate-50"><Minus size={14} /></button>
                  <input value={qty} readOnly className="w-14 text-center border-x border-slate-200 outline-none" />
                  <button onClick={() => setQty(qty + 1)} className="h-10 w-10 flex items-center justify-center text-slate-600 hover:bg-slate-50"><Plus size={14} /></button>
                </div>
                <span className="text-sm text-slate-500">Còn <span className="font-semibold text-slate-900">{p.stock}</span> sản phẩm</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button onClick={onCart} className="flex-1 h-12 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 flex items-center justify-center gap-2"><Plus size={18} /> Thêm vào giỏ</button>
            <button className="flex-1 h-12 bg-brand-gradient text-white rounded-xl font-semibold hover:opacity-95 shadow-pop">Mua ngay</button>
            <button className="h-12 w-12 border border-slate-200 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50"><Heart size={20} /></button>
          </div>
        </div>
      </div>

      {/* Store */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white"><Store size={28} /></div>
        <div className="flex-1">
          <div className="flex items-center gap-2"><h3>{p.store}</h3><span className="bg-rose-50 text-rose-600 text-xs font-semibold px-2 py-0.5 rounded">Mall</span></div>
          <div className="text-sm text-slate-500">Online 5 phút trước · Đánh giá {p.rating} · 12.5k người theo dõi · Tỉ lệ phản hồi 98%</div>
        </div>
        <button className="h-10 px-4 border border-indigo-200 text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 flex items-center gap-2"><MessageCircle size={16} /> Chat</button>
        <button className="h-10 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Xem cửa hàng</button>
      </div>

      {/* Description + Reviews */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="mb-4">Mô tả sản phẩm</h3>
          <div className="prose prose-sm max-w-none text-slate-600 space-y-2">
            <p>{p.name} là sản phẩm thuộc dòng cao cấp, được sản xuất bằng công nghệ tiên tiến với chất liệu thân thiện môi trường. Thiết kế hiện đại, phù hợp với mọi đối tượng người dùng.</p>
            <p>✓ Chất liệu cao cấp, bền đẹp theo thời gian<br />✓ Bảo hành chính hãng 12 tháng<br />✓ Đổi trả miễn phí trong 7 ngày<br />✓ Giao hàng toàn quốc, free ship đơn từ 99K</p>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="mb-4">Đánh giá sản phẩm</h3>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 mb-5 flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600">{p.rating}</div>
                <div className="text-amber-500">★★★★★</div>
                <div className="text-xs text-slate-600 mt-1">2.4k đánh giá</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map(s => (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <span className="w-4">{s}★</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${s === 5 ? 78 : s === 4 ? 15 : s === 3 ? 5 : 1}%` }} /></div>
                    <span className="text-slate-500 w-10">{s === 5 ? "78%" : s === 4 ? "15%" : "1-5%"}</span>
                  </div>
                ))}
              </div>
            </div>
            {[
              { n: "Nguyễn Văn An", t: "Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh. Sẽ ủng hộ shop tiếp!", r: 5, d: "08/06/2026" },
              { n: "Trần Thu Hà", t: "Chất lượng đúng như mô tả, giá cả hợp lý. Recommend!", r: 5, d: "07/06/2026" },
              { n: "Lê Minh Quân", t: "Giao hơi chậm nhưng sản phẩm ok, sẽ mua lại.", r: 4, d: "05/06/2026" },
            ].map((r, i) => (
              <div key={i} className="border-b border-slate-100 py-4 last:border-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400" />
                  <div><div className="font-medium text-sm">{r.n}</div><div className="text-amber-500 text-xs">{"★".repeat(r.r)}<span className="text-slate-300">{"★".repeat(5-r.r)}</span> · {r.d}</div></div>
                </div>
                <p className="text-sm text-slate-600 ml-12">{r.t}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4>Cam kết của shop</h4>
            {[{ i: ShieldCheck, t: "Hàng chính hãng 100%", c: "text-emerald-600" }, { i: Truck, t: "Free ship đơn từ 99K", c: "text-indigo-600" }, { i: RefreshCw, t: "Đổi trả miễn phí 7 ngày", c: "text-amber-600" }].map((x, i) => (
              <div key={i} className="flex items-center gap-3 text-sm"><x.i size={20} className={x.c} /><span className="text-slate-700">{x.t}</span></div>
            ))}
          </div>
        </aside>
      </div>

      <section>
        <h3 className="mb-4">Sản phẩm tương tự</h3>
        <div className="grid grid-cols-6 gap-3">
          {products.slice(0, 6).map(x => <ProductCard key={x.id} p={x} />)}
        </div>
      </section>
    </div>
  );
}
