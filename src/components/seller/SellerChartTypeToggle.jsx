import SellerIcon from './SellerIcon'

const chartTypeOptions = [
  { value: 'bar', label: 'Cột', icon: 'bar_chart' },
  { value: 'line', label: 'Tăng trưởng', icon: 'show_chart' },
  { value: 'pie', label: 'Tròn', icon: 'pie_chart' },
]

export default function SellerChartTypeToggle({ value, onChange }) {
  return (
    <div className="flex items-center rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-1">
      {chartTypeOptions.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium transition ${
              isActive ? 'bg-[#b22204] text-white shadow-sm' : 'text-[#5b403b] hover:bg-[#efeded] hover:text-[#b22204]'
            }`}
            aria-pressed={isActive}
          >
            <SellerIcon name={option.icon} className="text-[18px]" />
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
