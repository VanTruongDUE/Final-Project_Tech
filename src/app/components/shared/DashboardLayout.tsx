import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

export type NavItem = { k: string; label: string; icon: LucideIcon; badge?: number; group?: string };

export function DashboardLayout({ children, nav, page, setPage, role, user, onLogout }: { children: ReactNode; nav: NavItem[]; page: string; setPage: (k: string) => void; role: string; user: { name: string; email: string }; onLogout?: () => void; }) {
  const grouped: Record<string, NavItem[]> = {};
  nav.forEach(n => { (grouped[n.group || "Tổng quan"] = grouped[n.group || "Tổng quan"] || []).push(n); });

  return (
    <div className="min-h-full bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-200"><Logo size="sm" /><div className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold mt-1">{role}</div></div>
        <div className="flex-1 overflow-auto p-3">
          {Object.entries(grouped).map(([g, items]) => (
            <div key={g} className="mb-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-1.5">{g}</div>
              {items.map(n => (
                <button key={n.k} onClick={() => setPage(n.k)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${page === n.k ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <n.icon size={18} />
                  <span className="flex-1 text-left">{n.label}</span>
                  {n.badge && <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">{n.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600"><LogOut size={16} /> Quay về & Đăng xuất</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="px-6 py-3 flex items-center gap-4">
            <div className="flex-1 max-w-xl relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Tìm kiếm nhanh..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm" />
            </div>
            <button className="relative h-9 w-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">{user.name.charAt(0)}</div>
              <div className="text-sm"><div className="font-semibold leading-tight">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
