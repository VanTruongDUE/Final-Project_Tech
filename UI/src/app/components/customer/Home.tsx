import { useState } from "react";
import { ChevronRight, Flame, Truck, ShieldCheck, Headphones, Tag } from "lucide-react";
import { ProductCard } from "../shared/ProductCard";
import { banners, categories, products } from "../../lib/data";

export function CustomerHome({ onProduct, onCategory }: { onProduct: (id: string) => void; onCategory: () => void }) {
  const [bIdx, setBIdx] = useState(0);
  const banner = banners[bIdx];
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className={`relative rounded-3xl overflow-hidden h-[340px] bg-gradient-to-br ${banner.color} p-10 text-white flex flex-col justify-center`}>
            <div className="text-sm font-medium uppercase tracking-wider opacity-90 mb-2">Hot Deal · Hôm nay</div>
            <h1 className="text-5xl font-extrabold leading-tight mb-3 max-w-md">{banner.title}</h1>
            <p className="text-lg opacity-95 max-w-md mb-6">{banner.sub}</p>
            <div className="flex gap-3">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-slate-100">Mua ngay</button>
              <button className="border-2 border-white/70 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10">Xem ưu đãi</button>
            </div>
            <div className="absolute bottom-4 left-10 flex gap-2">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setBIdx(i)} className={`h-2 rounded-full transition-all ${i === bIdx ? "bg-white w-8" : "bg-white/50 w-2"}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4 grid grid-rows-2 gap-4">
          {[{ t: "Voucher 100K", s: "Cho đơn từ 500K", c: "from-amber-400 to-orange-500" }, { t: "Free ship", s: "Toàn quốc", c: "from-emerald-400 to-teal-500" }].map((x, i) => (
            <div key={i} className={`rounded-2xl p-6 bg-gradient-to-br ${x.c} text-white flex flex-col justify-center`}>
              <Tag size={28} className="mb-2 opacity-90" />
              <div className="text-2xl font-bold">{x.t}</div>
              <div className="text-sm opacity-90">{x.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-4 gap-4">
        {[
          { i: Truck, t: "Giao hàng siêu tốc", s: "2h nội thành" },
          { i: ShieldCheck, t: "Hàng chính hãng", s: "Cam kết 100%" },
          { i: Tag, t: "Hoàn tiền 200%", s: "Nếu phát hiện hàng giả" },
          { i: Headphones, t: "Hỗ trợ 24/7", s: "Hotline 1900 1234" },
        ].map((x, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><x.i size={22} /></div>
            <div><div className="font-medium text-slate-900">{x.t}</div><div className="text-xs text-slate-500">{x.s}</div></div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section>
        <SectionHeader title="Danh mục nổi bật" onAll={onCategory} />
        <div className="grid grid-cols-10 gap-3">
          {categories.map(c => (
            <button key={c.id} onClick={onCategory} className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-soft transition flex flex-col items-center gap-2">
              <div className="text-3xl">{c.icon}</div>
              <div className="text-xs text-slate-700 text-center font-medium">{c.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Flash sale */}
      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"><Flame size={26} /></div>
            <div>
              <div className="text-2xl font-bold">FLASH SALE</div>
              <div className="text-sm opacity-90">Kết thúc trong: <span className="bg-black/30 px-2 py-0.5 rounded ml-1 font-mono">02:34:18</span></div>
            </div>
          </div>
          <button className="bg-white text-rose-600 px-5 py-2 rounded-full font-semibold">Xem tất cả <ChevronRight size={16} className="inline" /></button>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {products.slice(0, 6).map(p => (
            <div key={p.id} onClick={() => onProduct(p.id)} className="cursor-pointer">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Top products */}
      <section>
        <SectionHeader title="Gợi ý cho bạn" sub="Dành riêng cho sở thích của bạn" />
        <div className="grid grid-cols-6 gap-3">
          {products.map(p => <ProductCard key={p.id} p={p} onClick={() => onProduct(p.id)} />)}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, sub, onAll }: { title: string; sub?: string; onAll?: () => void }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-slate-900">{title}</h2>
        {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {onAll && <button onClick={onAll} className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">Xem tất cả <ChevronRight size={16} /></button>}
    </div>
  );
}
