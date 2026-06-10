import { User, MapPin, Lock, Bell, Heart, Package, CreditCard, LogOut, Camera } from "lucide-react";
import { useState } from "react";

const menu = [
  { k: "info", icon: User, label: "Thông tin tài khoản" },
  { k: "addr", icon: MapPin, label: "Địa chỉ giao hàng" },
  { k: "pwd", icon: Lock, label: "Đổi mật khẩu" },
  { k: "notif", icon: Bell, label: "Thông báo" },
  { k: "wishlist", icon: Heart, label: "Sản phẩm yêu thích" },
  { k: "order", icon: Package, label: "Lịch sử đơn hàng" },
  { k: "payment", icon: CreditCard, label: "Phương thức thanh toán" },
];

export function Profile({ onLogout }: { onLogout?: () => void } = {}) {
  const [tab, setTab] = useState("info");
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-3 bg-white rounded-2xl border border-slate-200 p-5 h-fit">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">A</div>
            <button className="absolute -bottom-1 -right-1 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500"><Camera size={12} /></button>
          </div>
          <div><div className="font-semibold">Nguyễn Văn An</div><div className="text-xs text-slate-500">Thành viên Vàng</div></div>
        </div>
        <div className="space-y-1 mt-4">
          {menu.map(m => (
            <button key={m.k} onClick={() => setTab(m.k)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${tab === m.k ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <m.icon size={16} /> {m.label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 mt-3"><LogOut size={16} /> Đăng xuất</button>
        </div>
      </aside>

      <main className="col-span-9 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="mb-1">Hồ sơ của tôi</h2>
        <p className="text-sm text-slate-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản.</p>

        <div className="grid grid-cols-2 gap-5">
          {[
            { l: "Họ và tên", v: "Nguyễn Văn An" },
            { l: "Email", v: "an.nv@gmail.com" },
            { l: "Số điện thoại", v: "0901 234 567" },
            { l: "Ngày sinh", v: "15/05/1995" },
            { l: "Giới tính", v: "Nam" },
            { l: "Quốc tịch", v: "Việt Nam" },
          ].map(f => (
            <div key={f.l}>
              <label className="block mb-1.5 text-slate-700">{f.l}</label>
              <input defaultValue={f.v} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8">
          <button className="px-6 py-2.5 bg-brand-gradient text-white rounded-lg font-medium shadow-pop">Lưu thay đổi</button>
          <button className="px-6 py-2.5 border border-slate-200 rounded-lg font-medium">Huỷ</button>
        </div>
      </main>
    </div>
  );
}
