import { Filter, Grid3x3, List, ChevronDown } from "lucide-react";
import { ProductCard } from "../shared/ProductCard";
import { categories, products } from "../../lib/data";
import { useState } from "react";

export function ProductList({ onProduct }: { onProduct: (id: string) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar filters */}
      <aside className="col-span-3 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4"><Filter size={18} className="text-indigo-600" /><h3>Bộ lọc</h3></div>

          <FilterBlock title="Danh mục">
            <div className="space-y-2">
              {categories.slice(0, 6).map(c => (
                <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-indigo-600">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span>{c.icon} {c.name}</span>
                </label>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Khoảng giá">
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Từ" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              <input placeholder="Đến" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-1.5 mt-3">
              {["Dưới 100K", "100K - 500K", "500K - 1tr", "Trên 1tr"].map(p => (
                <label key={p} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" name="price" className="text-indigo-600" /> {p}
                </label>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Đánh giá">
            {[5, 4, 3].map(r => (
              <label key={r} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mb-1">
                <input type="checkbox" className="text-indigo-600" />
                <span>{"★".repeat(r)}<span className="text-slate-300">{"★".repeat(5-r)}</span> trở lên</span>
              </label>
            ))}
          </FilterBlock>

          <FilterBlock title="Nơi bán">
            {["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Toàn quốc"].map(p => (
              <label key={p} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mb-1">
                <input type="checkbox" className="text-indigo-600" /> {p}
              </label>
            ))}
          </FilterBlock>

          <button className="w-full bg-indigo-50 text-indigo-700 py-2.5 rounded-lg font-medium hover:bg-indigo-100">Áp dụng bộ lọc</button>
        </div>
      </aside>

      {/* Main */}
      <main className="col-span-9 space-y-4">
        <div className="flex items-center text-sm text-slate-500">
          <span>Trang chủ</span><span className="mx-2">/</span><span>Danh mục</span><span className="mx-2">/</span><span className="text-slate-900">Tất cả sản phẩm</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">Tìm thấy <span className="font-semibold text-slate-900">{products.length * 12}</span> sản phẩm</div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Sắp xếp: Liên quan <ChevronDown size={14} /></button>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-500"}`}><Grid3x3 size={16} /></button>
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-indigo-50 text-indigo-600" : "text-slate-500"}`}><List size={16} /></button>
            </div>
          </div>
        </div>

        <div className={view === "grid" ? "grid grid-cols-4 gap-3" : "space-y-3"}>
          {[...products, ...products].map((p, i) => <ProductCard key={i} p={p} onClick={() => onProduct(p.id)} />)}
        </div>

        <div className="flex items-center justify-center gap-2 pt-4">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} className={`h-9 w-9 rounded-lg font-medium text-sm ${n === 1 ? "bg-indigo-600 text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{n}</button>
          ))}
          <span className="text-slate-400">...</span>
          <button className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">Sau →</button>
        </div>
      </main>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-4 mb-4">
      <h4 className="mb-3">{title}</h4>
      {children}
    </div>
  );
}
