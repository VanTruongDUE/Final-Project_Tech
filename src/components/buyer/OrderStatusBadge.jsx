import { orderStatusMeta } from '../../services/orderService'

const toneClasses = {
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  slate: 'border-slate-200 bg-slate-100 text-slate-700',
}

export default function OrderStatusBadge({ status }) {
  const meta = orderStatusMeta[status] || orderStatusMeta.PENDING

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[meta.tone]}`}
    >
      {meta.label}
    </span>
  )
}
