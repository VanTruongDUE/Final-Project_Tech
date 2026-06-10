import { useState } from "react";
import { Star, Camera, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { products } from "../../lib/data";

const SUGGESTIONS = ["Sản phẩm chất lượng tốt", "Đóng gói cẩn thận", "Giao hàng nhanh", "Đúng mô tả", "Giá hợp lý", "Sẽ ủng hộ shop tiếp"];

export function CreateReview({ id, onBack, onSubmit }: { id?: string; onBack?: () => void; onSubmit?: () => void }) {
  const p = products.find(x => x.id === id) || products[1];
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string[]>(["Sản phẩm chất lượng tốt", "Giao hàng nhanh"]);

  const togglePick = (s: string) => setPicked(picked.includes(s) ? picked.filter(x => x !== s) : [...picked, s]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"><ArrowLeft size={14} /> Quay lại</button>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div>
          <h1>Đánh giá sản phẩm</h1>
          <p className="text-slate-500 mt-1">Chia sẻ trải nghiệm để giúp khách hàng khác dễ chọn lựa hơn nhé!</p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
          <ImageWithFallback src={p.image} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="text-xs text-slate-500">Sản phẩm</div>
            <div className="font-semibold mt-0.5 line-clamp-1">{p.name}</div>
            <div className="text-sm text-slate-500 mt-1">Cửa hàng: <span className="text-indigo-600 font-medium">{p.store}</span></div>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Đã giao</div>
        </div>

        <div className="text-center py-4">
          <div className="text-sm text-slate-500 mb-3">Bạn cảm thấy sản phẩm này thế nào?</div>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                <Star size={42} className={(hover || rating) >= s ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
              </button>
            ))}
          </div>
          <div className="text-sm font-semibold text-slate-700">{["", "Rất tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"][hover || rating]}</div>
        </div>

        <div>
          <label className="block mb-2">Gợi ý nội dung đánh giá</label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => togglePick(s)} className={`px-3 py-1.5 rounded-full text-sm border transition ${picked.includes(s) ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Nhận xét chi tiết</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Hãy chia sẻ chi tiết về chất lượng, đóng gói, dịch vụ giao hàng..." rows={5} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none" />
          <div className="flex items-center justify-between mt-1.5"><span className="text-xs text-slate-400">Tối thiểu 10 ký tự</span><span className="text-xs text-slate-400">{text.length}/1000</span></div>
        </div>

        <div>
          <label className="block mb-2">Hình ảnh / Video (không bắt buộc)</label>
          <div className="flex gap-3">
            <button className="h-24 w-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 flex flex-col items-center justify-center text-slate-400 transition">
              <Camera size={22} /><span className="text-xs mt-1">Thêm ảnh</span>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          ⓘ Chỉ có thể đánh giá khi đơn hàng ở trạng thái <strong>Hoàn thành</strong>. Đánh giá của bạn sẽ được hiển thị công khai và không thể chỉnh sửa.
        </div>

        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 h-12 border border-slate-200 rounded-xl font-medium">Huỷ</button>
          <button onClick={onSubmit} className="flex-[2] h-12 bg-brand-gradient text-white rounded-xl font-semibold shadow-pop">Gửi đánh giá</button>
        </div>
      </div>
    </div>
  );
}
