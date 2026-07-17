import { useCallback, useEffect, useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

export default function AdminReviewsPage() {
  const [status, setStatus] = useState('all')
  const [response, setResponse] = useState({ success: false, isLoading: true, data: [] })
  const [actionError, setActionError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  const loadReviews = useCallback(async () => {
    setResponse({ success: false, isLoading: true, data: [] })
    const result = await adminService.getAdminReviews({ status, limit: 100 })
    setResponse(result)
  }, [status])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleHide = async (review) => {
    if (!window.confirm(`Ẩn đánh giá #${review.id}? Hành động này không có chức năng hoàn tác trên Backend hiện tại.`)) return
    const reason = window.prompt('Lý do ẩn đánh giá (không bắt buộc):', '')
    if (reason === null) return

    setPendingId(review.id)
    setActionError('')
    const result = await adminService.hideReview(review.id, reason)
    setPendingId(null)
    if (!result.success) {
      setActionError(result.message || 'Không thể ẩn đánh giá.')
      return
    }
    await loadReviews()
  }

  return (
    <section className="flex w-full flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-[32px]">Kiểm duyệt đánh giá</h1>
          <p className="mt-1 text-sm text-slate-500">Admin có thể ẩn review vi phạm. Backend hiện không hỗ trợ unhide.</p>
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded border border-slate-300 bg-white px-3 text-sm">
          <option value="all">Tất cả trạng thái</option>
          <option value="VISIBLE">Đang hiển thị</option>
          <option value="HIDDEN">Đã ẩn</option>
        </select>
      </header>

      {actionError ? <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div> : null}
      {response.isLoading ? <div className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">Đang tải danh sách đánh giá...</div> : null}
      {!response.isLoading && !response.success ? <div className="rounded border border-red-200 bg-white p-5 text-sm text-red-700">{response.message || 'Không thể tải đánh giá.'}</div> : null}

      {!response.isLoading && response.success ? (
        <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
          {response.data.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr><th className="px-4 py-3">Review</th><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Sản phẩm / SKU</th><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {response.data.map((review) => (
                    <tr key={review.id} className="align-top hover:bg-slate-50">
                      <td className="px-4 py-3"><p className="font-semibold">#{review.id}</p><p className="mt-1 text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p><p className="mt-1 text-xs text-slate-500">{review.createdAt ? new Date(review.createdAt).toLocaleString('vi-VN') : ''}</p></td>
                      <td className="px-4 py-3"><p className="font-medium">{review.customerName}</p><p className="text-xs text-slate-500">{review.customerEmail}</p></td>
                      <td className="px-4 py-3"><p className="font-medium">{review.productName}</p><p className="text-xs text-slate-500">Item #{review.orderItemId} · {review.skuCode || 'Chưa có SKU'} {review.variantName ? `· ${review.variantName}` : ''}</p></td>
                      <td className="max-w-sm px-4 py-3 text-slate-700">{review.comment || 'Không có nhận xét.'}</td>
                      <td className="px-4 py-3"><span className={'rounded-full px-2.5 py-1 text-xs font-semibold ' + (review.status === 'VISIBLE' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700')}>{review.status}</span></td>
                      <td className="px-4 py-3 text-right">
                        {review.status === 'VISIBLE' ? <button type="button" disabled={pendingId === review.id} onClick={() => handleHide(review)} className="inline-flex items-center gap-1 rounded bg-[#b22204] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"><AdminIcon name="visibility_off" className="text-[16px]" />{pendingId === review.id ? 'Đang ẩn...' : 'Ẩn review'}</button> : <span className="text-xs text-slate-500">Không có unhide</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="p-8 text-center text-sm text-slate-500">Không có đánh giá trong bộ lọc này.</p>}
        </div>
      ) : null}
    </section>
  )
}
