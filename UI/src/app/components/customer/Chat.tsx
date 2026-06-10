import { Send, Search, Paperclip, Smile, Phone, Video } from "lucide-react";

const conversations = [
  { id: 1, name: "Coolmate Official", last: "Cảm ơn quý khách đã đặt hàng!", time: "5 phút", unread: 2, online: true },
  { id: 2, name: "Sound Hub Store", last: "Sản phẩm còn hàng nhé bạn", time: "1 giờ", unread: 0, online: true },
  { id: 3, name: "Apple Authorized", last: "Đơn hàng đã được xác nhận", time: "Hôm qua", unread: 0, online: false },
  { id: 4, name: "Beauty Lab", last: "Bạn có thể tham khảo sản phẩm khác", time: "2 ngày", unread: 1, online: false },
];

const msgs = [
  { from: "shop", t: "Chào bạn, T2 Commerce – Coolmate có thể giúp gì cho bạn ạ? 😊", time: "10:20" },
  { from: "me", t: "Cho mình hỏi áo này còn size L không shop?", time: "10:22" },
  { from: "shop", t: "Dạ shop còn đầy đủ size từ S đến XXL nhé bạn. Bạn order thoải mái nha 💙", time: "10:23" },
  { from: "me", t: "Ok mình sẽ đặt 2 cái size L, ship Quận 1 nhé.", time: "10:25" },
  { from: "shop", t: "Dạ vâng, đơn của bạn shop sẽ giao trong hôm nay. Cảm ơn bạn đã ủng hộ!", time: "10:26" },
];

export function Chat() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 grid grid-cols-12 h-[680px] overflow-hidden">
      <aside className="col-span-4 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="mb-3">Tin nhắn</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Tìm shop..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {conversations.map((c, i) => (
            <button key={c.id} className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 ${i === 0 ? "bg-indigo-50/50" : ""}`}>
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400" />
                {c.online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between"><span className="font-semibold text-sm truncate">{c.name}</span><span className="text-xs text-slate-400">{c.time}</span></div>
                <div className="flex items-center justify-between mt-0.5"><span className="text-xs text-slate-500 truncate flex-1">{c.last}</span>{c.unread > 0 && <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">{c.unread}</span>}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="col-span-8 flex flex-col">
        <div className="p-3 border-b border-slate-200 flex items-center gap-3">
          <div className="relative"><div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400" /><div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" /></div>
          <div className="flex-1"><div className="font-semibold">Coolmate Official</div><div className="text-xs text-emerald-600">● Đang hoạt động</div></div>
          <button className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center"><Phone size={18} /></button>
          <button className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center"><Video size={18} /></button>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-3 bg-slate-50/50">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md px-4 py-2.5 rounded-2xl ${m.from === "me" ? "bg-brand-gradient text-white rounded-br-md" : "bg-white border border-slate-200 rounded-bl-md"}`}>
                <p className="text-sm">{m.t}</p>
                <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-slate-400"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 flex items-center gap-2">
          <button className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center"><Paperclip size={18} /></button>
          <input placeholder="Nhập tin nhắn..." className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-indigo-400 outline-none" />
          <button className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center"><Smile size={18} /></button>
          <button className="h-10 w-10 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-pop"><Send size={18} /></button>
        </div>
      </main>
    </div>
  );
}
