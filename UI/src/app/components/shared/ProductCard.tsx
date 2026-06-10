import { Star } from "lucide-react";
import { formatVND, type Product } from "../../lib/data";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function ProductCard({ p, onClick }: { p: Product; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="group text-left bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-pop transition-all">
      <div className="aspect-square overflow-hidden relative bg-slate-50">
        <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {p.discount && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">-{p.discount}%</div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <div className="text-sm text-slate-800 line-clamp-2 leading-snug min-h-[40px]">{p.name}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-rose-600 font-bold">{formatVND(p.price)}</span>
          {p.oldPrice && <span className="text-xs text-slate-400 line-through">{formatVND(p.oldPrice)}</span>}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-0.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {p.rating}
          </span>
          <span>Đã bán {p.sold > 1000 ? `${(p.sold/1000).toFixed(1)}k` : p.sold}</span>
        </div>
      </div>
    </button>
  );
}
