import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerConfirmDialog from '../../components/seller/SellerConfirmDialog'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

const ITEMS_PER_PAGE = 10

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'ONGOING', label: 'Đang diễn ra' },
  { value: 'PAUSED', label: 'Đã tạm dừng' },
  { value: 'FINISHED', label: 'Đã kết thúc' },
]

const statusMeta = {
  UPCOMING: { label: 'Sắp diễn ra', className: 'border-[#3b82f6]/20 bg-[#3b82f6]/10 text-[#2563eb]' },
  ONGOING: { label: 'Đang diễn ra', className: 'border-[#10b981]/20 bg-[#10b981]/10 text-[#059669]' },
  PAUSED: { label: 'Đã tạm dừng', className: 'border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#b45309]' },
  FINISHED: { label: 'Đã kết thúc', className: 'border-[#e3beb6] bg-[#e3e2e2] text-[#5b403b]' },
}

function formatDate(value) {
  if (!value) return 'Chưa thiết lập'
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value))
}

function StatCard({ title, value, icon, iconClassName }) {
  return (
    <article className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-[0_1px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#5b403b]">{title}</p>
          <p className="mt-5 text-[32px] font-bold leading-none text-[#1b1c1c]">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-full ${iconClassName}`}>
          <SellerIcon name={icon} className="text-[20px]" />
        </span>
      </div>
    </article>
  )
}

function PromotionModal({ promotion, mode, form, error, onClose, onChange, onSave }) {
  if (!promotion) return null

  const isEditing = mode === 'edit'

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center overflow-y-auto bg-[#1b1c1c]/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-2xl">
        <div className="h-1 bg-[#b22204]" />
        <div className="flex items-start justify-between gap-4 border-b border-[#e3e2e2] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b22204]">Khuyến mãi</p>
            <h2 className="mt-1 text-2xl font-bold text-[#1b1c1c]">{isEditing ? 'Chỉnh sửa khuyến mãi' : promotion.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="grid h-9 w-9 place-items-center rounded-lg text-[#8f7069] hover:bg-[#f5f3f3] hover:text-[#b22204]">
            <SellerIcon name="close" className="text-[20px]" />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={onSave} className="grid gap-4 p-6 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Tên chương trình</span>
              <input value={form.name} onChange={(event) => onChange('name', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15" required />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Mã khuyến mãi</span>
              <input value={form.code} onChange={(event) => onChange('code', event.target.value.toUpperCase())} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm font-semibold uppercase outline-none focus:border-[#ee4d2d]" required />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Mức giảm</span>
              <input type="number" min="1" value={form.discountValue} onChange={(event) => onChange('discountValue', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm outline-none focus:border-[#ee4d2d]" required />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Bắt đầu</span>
              <input type="datetime-local" value={form.startAt} onChange={(event) => onChange('startAt', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm outline-none focus:border-[#ee4d2d]" required />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Kết thúc</span>
              <input type="datetime-local" value={form.endAt} onChange={(event) => onChange('endAt', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm outline-none focus:border-[#ee4d2d]" required />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Tổng lượt dùng tối đa</span>
              <input type="number" min="1" value={form.totalUsageLimit} onChange={(event) => onChange('totalUsageLimit', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm outline-none focus:border-[#ee4d2d]" required />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-[#5b403b]">Lượt dùng mỗi khách</span>
              <input type="number" min="1" value={form.perUserLimit} onChange={(event) => onChange('perUserLimit', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm outline-none focus:border-[#ee4d2d]" required />
            </label>
            {error ? <p className="md:col-span-2 rounded-lg bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">{error}</p> : null}
            <div className="flex justify-end gap-3 border-t border-[#e3e2e2] pt-4 md:col-span-2">
              <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#e3beb6] px-5 text-sm font-bold text-[#5b403b]">Hủy</button>
              <button type="submit" className="h-10 rounded-lg bg-[#b22204] px-5 text-sm font-bold text-white hover:bg-[#d63c1e]">Lưu thay đổi</button>
            </div>
          </form>
        ) : (
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-lg bg-[#fff7f5] p-4"><p className="text-xs text-[#8f7069]">Mã khuyến mãi</p><p className="mt-1 font-bold text-[#b22204]">{promotion.code}</p></div>
            <div className="rounded-lg bg-[#fff7f5] p-4"><p className="text-xs text-[#8f7069]">Mức giảm</p><p className="mt-1 font-bold text-[#b22204]">{promotion.discountLabel}</p></div>
            <div><p className="text-xs text-[#8f7069]">Thời gian</p><p className="mt-1 text-sm font-semibold">{formatDate(promotion.startAt)} – {formatDate(promotion.endAt)}</p></div>
            <div><p className="text-xs text-[#8f7069]">Lượt sử dụng</p><p className="mt-1 text-sm font-semibold">{promotion.usedCount}/{promotion.totalUsageLimit}</p></div>
            <div><p className="text-xs text-[#8f7069]">Đơn hàng tối thiểu</p><p className="mt-1 text-sm font-semibold">{formatCurrency(promotion.minOrderValue || 0)}</p></div>
            <div><p className="text-xs text-[#8f7069]">Phạm vi</p><p className="mt-1 text-sm font-semibold">{promotion.scope === 'all' ? 'Toàn cửa hàng' : 'Sản phẩm cụ thể'}</p></div>
          </div>
        )}
      </section>
    </div>
  )
}

export default function SellerPromotionsPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [modalMode, setModalMode] = useState('view')
  const [editForm, setEditForm] = useState({})
  const [modalError, setModalError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [actionError, setActionError] = useState('')
  const response = sellerService.getSellerPromotions(currentUser, { keyword, status, refreshKey })

  const rows = response.data?.rows || []
  const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginatedRows = rows.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  if (!response.success) {
    return <section className="min-h-screen bg-[#fbf9f9] p-6"><div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a]">{response.message}</div></section>
  }

  const { stats } = response.data

  const openView = (promotion) => {
    setSelectedPromotion(promotion)
    setModalMode('view')
    setModalError('')
  }

  const openEdit = (promotion) => {
    setSelectedPromotion(promotion)
    setModalMode('edit')
    setModalError('')
    setEditForm({
      ...promotion,
      startAt: String(promotion.startAt).slice(0, 16),
      endAt: String(promotion.endAt).slice(0, 16),
    })
  }

  const savePromotion = (event) => {
    event.preventDefault()
    const updateResponse = sellerService.updateSellerPromotion(currentUser, selectedPromotion.id, editForm)
    if (!updateResponse.success) return setModalError(updateResponse.message)
    setSelectedPromotion(null)
    setRefreshKey((value) => value + 1)
  }

  const confirmAction = () => {
    if (!pendingAction) return
    const actionResponse = pendingAction.type === 'delete'
      ? sellerService.deleteSellerPromotion(currentUser, pendingAction.promotion.id)
      : sellerService.toggleSellerPromotionStatus(currentUser, pendingAction.promotion.id)

    if (!actionResponse.success) return setActionError(actionResponse.message)
    setPendingAction(null)
    setActionError('')
    setRefreshKey((value) => value + 1)
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#fbf9f9] p-4 md:p-6 xl:p-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-7">
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-[#5b403b]"><span>Marketing</span><SellerIcon name="chevron_right" className="text-[16px]" /><span className="text-[#b22204]">Quản lý khuyến mãi</span></div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1b1c1c] md:text-[34px]">Quản lý khuyến mãi</h1>
        </header>

        <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Tổng khuyến mãi" value={stats.total} icon="local_offer" iconClassName="bg-[#ffdad3] text-[#b22204]" />
          <StatCard title="Đang diễn ra" value={stats.ongoing} icon="play_circle" iconClassName="bg-[#10b981]/15 text-[#059669]" />
          <StatCard title="Đã sử dụng" value={stats.used.toLocaleString('vi-VN')} icon="bookmark" iconClassName="bg-[#ffdad3] text-[#b22204]" />
          <StatCard title="Tổng tiền đã giảm" value={new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(stats.totalDiscount)} icon="payments" iconClassName="bg-[#f59e0b]/15 text-[#d97706]" />
        </div>

        <section className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-[0_1px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#e3e2e2] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative w-full max-w-lg"><SellerIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1) }} placeholder="Tìm kiếm tên/mã khuyến mãi..." className="h-11 w-full rounded-lg border border-[#e3beb6] pl-10 pr-4 text-sm outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15" /></div>
              <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-11 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm outline-none focus:border-[#ee4d2d]">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            </div>
            <button type="button" onClick={() => navigate('/seller/promotions/new')} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#b22204] px-5 text-sm font-bold text-white shadow-sm hover:bg-[#d63c1e]"><SellerIcon name="add" className="text-[18px]" />Tạo khuyến mãi mới</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="border-b border-[#e3e2e2] bg-[#f5f3f3] text-xs font-semibold text-[#5b403b]"><tr><th className="px-5 py-4">Tên & Mã KM</th><th className="px-5 py-4">Loại</th><th className="px-5 py-4">Mức giảm</th><th className="px-5 py-4">Đã dùng / Giới hạn</th><th className="px-5 py-4">Thời gian</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {paginatedRows.length ? paginatedRows.map((promotion) => {
                  const meta = statusMeta[promotion.status] || statusMeta.FINISHED
                  const usagePercent = promotion.totalUsageLimit ? Math.min(100, promotion.usedCount / promotion.totalUsageLimit * 100) : 0
                  return <tr key={promotion.id} className={`group transition hover:bg-[#fbf9f9] ${promotion.status === 'FINISHED' ? 'opacity-75' : ''}`}>
                    <td className="px-5 py-4"><button type="button" onClick={() => openView(promotion)} className="font-bold text-[#1b1c1c] hover:text-[#b22204] hover:underline">{promotion.name}</button><div className="mt-1 inline-block rounded bg-[#efeded] px-2 py-0.5 text-xs text-[#5b403b]">{promotion.code}</div></td>
                    <td className="px-5 py-4">{promotion.promotionType || 'Voucher Shop'}</td>
                    <td className="px-5 py-4 font-bold text-[#b22204]">{promotion.discountLabel}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><span>{promotion.usedCount}/{promotion.totalUsageLimit}</span><div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#efeded]"><div className="h-full bg-[#b22204]" style={{ width: `${usagePercent}%` }} /></div></div></td>
                    <td className="px-5 py-4 text-xs"><div>{formatDate(promotion.startAt)}</div><div className="text-[#5b403b]">{formatDate(promotion.endAt)}</div></td>
                    <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{meta.label}</span></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100"><button type="button" onClick={() => openView(promotion)} title="Xem chi tiết" className="grid h-8 w-8 place-items-center rounded text-[#5b403b] hover:bg-[#fff1ec] hover:text-[#b22204]"><SellerIcon name="visibility" className="text-[18px]" /></button><button type="button" onClick={() => openEdit(promotion)} title="Chỉnh sửa" className="grid h-8 w-8 place-items-center rounded text-[#5b403b] hover:bg-[#fff1ec] hover:text-[#b22204]"><SellerIcon name="edit" className="text-[18px]" /></button>{promotion.status !== 'FINISHED' ? <button type="button" onClick={() => setPendingAction({ type: 'toggle', promotion })} title={promotion.status === 'PAUSED' ? 'Kích hoạt' : 'Tạm dừng'} className="grid h-8 w-8 place-items-center rounded text-[#5b403b] hover:bg-[#fff1ec] hover:text-[#b22204]"><SellerIcon name={promotion.status === 'PAUSED' ? 'play_circle' : 'pause_circle'} className="text-[18px]" /></button> : null}<button type="button" onClick={() => setPendingAction({ type: 'delete', promotion })} title="Xóa" className="grid h-8 w-8 place-items-center rounded text-[#5b403b] hover:bg-[#ffdad6] hover:text-[#ba1a1a]"><SellerIcon name="delete" className="text-[18px]" /></button></div></td>
                  </tr>
                }) : <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-[#5b403b]">Không tìm thấy khuyến mãi phù hợp.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#e3e2e2] px-5 py-4 text-sm text-[#5b403b]"><span>Hiển thị {paginatedRows.length ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(safePage - 1) * ITEMS_PER_PAGE + paginatedRows.length} của {rows.length} khuyến mãi</span><div className="flex gap-1"><button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid h-8 w-8 place-items-center rounded disabled:opacity-40"><SellerIcon name="chevron_left" className="text-[18px]" /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`grid h-8 w-8 place-items-center rounded text-xs font-bold ${pageNumber === safePage ? 'bg-[#b22204] text-white' : 'hover:bg-[#efeded]'}`}>{pageNumber}</button>)}<button type="button" disabled={safePage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="grid h-8 w-8 place-items-center rounded disabled:opacity-40"><SellerIcon name="chevron_right" className="text-[18px]" /></button></div></div>
        </section>
      </div>

      <PromotionModal promotion={selectedPromotion} mode={modalMode} form={editForm} error={modalError} onClose={() => setSelectedPromotion(null)} onChange={(field, value) => { setEditForm((current) => ({ ...current, [field]: value })); setModalError('') }} onSave={savePromotion} />
      <SellerConfirmDialog open={Boolean(pendingAction)} title={pendingAction?.type === 'delete' ? 'Xóa khuyến mãi?' : pendingAction?.promotion.status === 'PAUSED' ? 'Kích hoạt khuyến mãi?' : 'Tạm dừng khuyến mãi?'} description={pendingAction ? `${pendingAction.promotion.name} (${pendingAction.promotion.code}) sẽ được cập nhật trong dữ liệu mock/localStorage.` : ''} confirmLabel={pendingAction?.type === 'delete' ? 'Xóa khuyến mãi' : 'Xác nhận'} icon={pendingAction?.type === 'delete' ? 'delete' : pendingAction?.promotion.status === 'PAUSED' ? 'play_circle' : 'pause_circle'} danger={pendingAction?.type === 'delete'} error={actionError} onCancel={() => { setPendingAction(null); setActionError('') }} onConfirm={confirmAction} />
    </section>
  )
}
