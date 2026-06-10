import { ArrowDown, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, delta, color = "indigo" }: { icon: LucideIcon; label: string; value: string; delta?: number; color?: "indigo" | "orange" | "emerald" | "rose" | "amber" | "violet"; }) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-600",
    orange: "bg-orange-100 text-orange-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
    amber: "bg-amber-100 text-amber-600",
    violet: "bg-violet-100 text-violet-600",
  };
  const up = (delta ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <Icon size={22} />
        </div>
        {delta !== undefined && (
          <div className={`text-xs font-medium flex items-center gap-0.5 px-2 py-1 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
