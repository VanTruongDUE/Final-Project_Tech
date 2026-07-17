import SellerIcon from './SellerIcon'

export default function SellerStatCard({ card }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-[#e3beb6]/30 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b403b]">{card.title}</h3>
        <div className={`rounded-lg p-2 ${card.iconClassName}`}>
          <SellerIcon name={card.icon} className="text-[20px]" />
        </div>
      </div>

      <div>
        <div className="flex items-end gap-2">
          <p className="text-[20px] font-semibold text-[#b22204] md:text-[22px]">{card.value}</p>
          {card.suffix ? <p className="text-sm text-[#8f7069]">{card.suffix}</p> : null}
        </div>

        <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${card.trendClassName}`}>
          {card.trendIcon ? <SellerIcon name={card.trendIcon} className="text-[16px]" /> : null}
          <span>{card.trendText}</span>
        </div>
      </div>
    </div>
  )
}
