const formatDateTime = (value) => {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

const renderStars = (rating) => {
  return '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating)
}

export default function ProductReviewList({ reviews }) {
  if (!reviews.length) {
    return (
      <p className="mt-5 text-sm text-[#5b403b]">Chưa có đánh giá nào cho sản phẩm này.</p>
    )
  }

  return (
    <div className="mt-6 space-y-5 border-t border-[#e3e2e2] pt-5">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9e8e7] font-bold text-[#5b403b]">
            {(review.customerName || 'K').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-semibold text-[#1b1c1c]">{review.customerName}</p>
              <p className="text-sm text-[#ee4d2d]">{renderStars(review.rating)}</p>
              <p className="text-xs text-[#8f7069]">{formatDateTime(review.createdAt)}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5b403b]">
              {review.content || 'Khách hàng đã để lại đánh giá bằng số sao cho sản phẩm này.'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
