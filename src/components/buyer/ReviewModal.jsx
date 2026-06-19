import { useEffect, useState } from 'react'

const stars = [1, 2, 3, 4, 5]

export default function ReviewModal({ item, onClose, onSubmit, isSubmitting, submitError }) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')

  useEffect(() => {
    setRating(5)
    setContent('')
  }, [item])

  if (!item) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      rating,
      content,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c1c]/45 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ee4d2d]">Đánh giá sản phẩm</p>
            <h2 className="mt-2 text-xl font-bold text-[#1b1c1c]">{item.product?.name || 'Sản phẩm đã mua'}</h2>
            <p className="mt-1 text-sm text-[#5b403b]">{item.product?.storeName || 'TechToShop Mall'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e5e7eb] px-3 py-1 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
          >
            Đóng
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-semibold text-[#1b1c1c]">Số sao</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {stars.map((star) => {
                const isActive = star <= rating

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`rounded-xl border px-3 py-2 text-2xl transition ${
                      isActive
                        ? 'border-[#ee4d2d] bg-[#fff1ec] text-[#ee4d2d]'
                        : 'border-[#e5e7eb] bg-white text-[#c7b7b2] hover:border-[#e3beb6]'
                    }`}
                    aria-label={`${star} sao`}
                  >
                    ★
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="review-content" className="text-sm font-semibold text-[#1b1c1c]">
              Nội dung đánh giá
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
              className="mt-3 w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
          </div>

          {submitError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#d8d3d2] bg-white px-4 py-2 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
