import { ShoppingBag } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const tx = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <div className={`${sz} rounded-xl bg-brand-gradient flex items-center justify-center shadow-pop`}>
        <ShoppingBag className="text-white" strokeWidth={2.5} size={size === "lg" ? 22 : 18} />
      </div>
      <div className={`font-display font-extrabold ${tx} tracking-tight`}>
        <span className="text-brand-gradient">TechTonic</span>
        <span className="text-slate-900"> Ecommerce</span>
      </div>
    </div>
  );
}
