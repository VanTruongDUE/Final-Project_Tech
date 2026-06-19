export default function ReviewStatusBadge({ reviewed }) {
  if (reviewed) {
    return (
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Đã đánh giá
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      Chưa đánh giá
    </span>
  )
}
