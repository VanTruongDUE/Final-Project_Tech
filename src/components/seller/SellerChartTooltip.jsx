export default function SellerChartTooltip({ item, className = '' }) {
  if (!item) {
    return null
  }

  return (
    <div className={`pointer-events-none z-30 min-w-[150px] rounded-lg border border-[#e3beb6] bg-white px-3 py-2 text-xs shadow-lg ${className}`}>
      <p className="font-semibold text-[#1b1c1c]">{item.title}</p>
      {item.subtitle ? <p className="mt-1 text-[#5b403b]">{item.subtitle}</p> : null}
      <p className="mt-1 font-semibold text-[#b22204]">{item.value}</p>
    </div>
  )
}
