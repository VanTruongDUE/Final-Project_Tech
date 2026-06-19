import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

const stockStatusOptions = [
  { value: 'all', label: 'Tất cả tình trạng' },
  { value: 'AVAILABLE', label: 'Còn hàng' },
  { value: 'LOW', label: 'Sắp hết' },
  { value: 'OUT', label: 'Đã hết' },
]

const historyRangeOptions = [
  { value: '7d', label: '7 ngày gần đây' },
  { value: '30d', label: '30 ngày gần đây' },
  { value: '90d', label: '90 ngày gần đây' },
  { value: 'all', label: 'Tất cả thời gian' },
]

const stockStateMeta = {
  AVAILABLE: {
    label: 'Còn hàng',
    className: 'bg-[#DCFCE7] text-[#15803D]',
  },
  LOW: {
    label: 'Sắp hết',
    className: 'bg-[#FEF3C7] text-[#B45309]',
  },
  OUT: {
    label: 'Đã hết',
    className: 'bg-[#FEE2E2] text-[#BA1A1A]',
  },
}

function InventoryStatCard({ stat }) {
  return (
    <article className={`rounded-xl border border-[#e3beb6]/60 bg-white p-5 shadow-sm ${stat.accentClassName || ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5b403b]">{stat.title}</p>
          <p className="mt-8 text-[34px] font-bold leading-none text-[#111827]">{stat.value}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-lg ${stat.iconClassName}`}>
          <SellerIcon name={stat.icon} className="text-[24px]" />
        </span>
      </div>
    </article>
  )
}

function InventoryStatusBadge({ status }) {
  const meta = stockStateMeta[status] || stockStateMeta.AVAILABLE

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}

function OrderStatusBadge({ statusMeta }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusMeta.label}
    </span>
  )
}

function InventoryActionButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg text-[#8f7069] transition hover:bg-[#fff1ec] hover:text-[#ee4d2d]"
    >
      <SellerIcon name={icon} className="text-[20px]" />
    </button>
  )
}

export default function SellerInventoryPage() {
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('all')
  const [stockStatus, setStockStatus] = useState('all')
  const [editingProduct, setEditingProduct] = useState(null)
  const [historyProduct, setHistoryProduct] = useState(null)
  const [historyKeyword, setHistoryKeyword] = useState('')
  const [historyRange, setHistoryRange] = useState('30d')
  const [stockInput, setStockInput] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const inventoryResponse = sellerService.getSellerInventoryReport(currentUser, {
    keyword,
    category,
    stockStatus,
    refreshKey,
  })

  const categories = useMemo(() => inventoryResponse.data?.categories || [], [inventoryResponse.data?.categories])
  const historyResponse = historyProduct
    ? sellerService.getSellerProductOrderHistory(currentUser, historyProduct.id, {
        keyword: historyKeyword,
        range: historyRange,
      })
    : null

  const openStockModal = (product = null) => {
    setEditingProduct(product)
    setStockInput(product ? String(product.availableStock) : '')
  }

  const closeStockModal = () => {
    setEditingProduct(null)
    setStockInput('')
  }

  const openHistoryModal = (product) => {
    setHistoryProduct(product)
    setHistoryKeyword('')
    setHistoryRange('30d')
  }

  const closeHistoryModal = () => {
    setHistoryProduct(null)
    setHistoryKeyword('')
    setHistoryRange('30d')
  }

  const handleUpdateStock = (event) => {
    event.preventDefault()

    if (!editingProduct) {
      window.alert('Vui lòng chọn một sản phẩm để nhập kho.')
      return
    }

    const response = sellerService.updateSellerInventoryStock(currentUser, editingProduct.id, stockInput)

    if (!response.success) {
      window.alert(response.message || 'Không thể cập nhật tồn kho.')
      return
    }

    closeStockModal()
    setRefreshKey((currentKey) => currentKey + 1)
  }

  if (!inventoryResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {inventoryResponse.message || 'Không thể tải dữ liệu kho hàng.'}
        </div>
      </section>
    )
  }

  const { stats, rows } = inventoryResponse.data

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f5f3f3] p-4 md:p-6">
      <div className="flex w-full min-w-0 flex-col gap-6 xl:pr-8">
        <header className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#5b403b]">
              <span>Sản phẩm</span>
              <SellerIcon name="chevron_right" className="text-[18px]" />
              <span className="text-[#1b1c1c]">Kho hàng</span>
            </div>
            <h1 className="max-w-[420px] text-[34px] font-bold leading-tight tracking-tight text-[#111827] md:text-[40px]">
              Quản lý kho hàng
            </h1>
          </div>

          <button
            type="button"
            onClick={() => openStockModal(rows[0] || null)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d73211]"
          >
            <SellerIcon name="add_box" className="text-[22px]" />
            Nhập kho
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <InventoryStatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <div className="min-w-0 overflow-hidden rounded-xl border border-[#e3beb6]/60 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#e3beb6]/60 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full min-w-0 lg:max-w-xl">
              <SellerIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[21px] text-[#8f7069]" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm kiếm tên sản phẩm, SKU..."
                className="h-12 w-full rounded-lg border border-[#e3beb6]/80 bg-[#fbf9f9] pl-12 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 rounded-lg border border-[#e3beb6]/80 bg-white px-4 text-sm font-medium text-[#5b403b] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={stockStatus}
                onChange={(event) => setStockStatus(event.target.value)}
                className="h-12 rounded-lg border border-[#e3beb6]/80 bg-white px-4 text-sm font-medium text-[#5b403b] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                {stockStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e3beb6]/60 bg-[#fbf9f9] text-xs font-bold uppercase tracking-[0.08em] text-[#6B7280]">
                  <th className="px-5 py-4">Sản phẩm</th>
                  <th className="px-5 py-4">Danh mục</th>
                  <th className="px-5 py-4">Vị trí kho</th>
                  <th className="px-5 py-4 text-right">Tồn khả dụng</th>
                  <th className="px-5 py-4 text-right">Đã đặt trước</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3beb6]/50">
                {rows.map((product) => (
                  <tr key={product.id} className="transition hover:bg-[#fbf9f9]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e3beb6] bg-[#efeded]">
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[230px] truncate text-sm font-bold text-[#1b1c1c]">{product.name}</p>
                          <p className="mt-1 text-xs text-[#5b403b]">SKU: TT-{String(product.id).padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#1b1c1c]">{product.category}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[#f5f3f3] px-3 py-1.5 text-sm font-semibold text-[#5b403b]">{product.warehouseLocation}</span>
                    </td>
                    <td className={`px-5 py-4 text-right text-sm font-bold ${product.availableStock === 0 ? 'text-[#ba1a1a]' : product.stockState === 'LOW' ? 'text-[#D97706]' : 'text-[#111827]'}`}>
                      {product.availableStock.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-[#5b403b]">{product.reservedStock.toLocaleString('vi-VN')}</td>
                    <td className="px-5 py-4">
                      <InventoryStatusBadge status={product.stockState} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <InventoryActionButton icon="edit_square" label="Cập nhật tồn kho" onClick={() => openStockModal(product)} />
                        <InventoryActionButton icon="history" label="Lịch sử đơn hàng" onClick={() => openHistoryModal(product)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e3beb6]/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#5b403b]">
              Hiển thị 1-{rows.length} trên {inventoryResponse.meta.allCount} sản phẩm
            </p>
            <div className="flex items-center gap-2">
              <button type="button" disabled className="grid h-9 w-9 place-items-center rounded-lg text-[#8f7069] opacity-60">
                <SellerIcon name="chevron_left" className="text-[18px]" />
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-[#ee4d2d] text-sm font-bold text-white">
                1
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3beb6] text-sm font-semibold text-[#5b403b]">
                2
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3beb6] text-sm font-semibold text-[#5b403b]">
                3
              </button>
              <span className="grid h-9 w-9 place-items-center text-sm text-[#8f7069]">...</span>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg text-[#5b403b]">
                <SellerIcon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true" aria-label="Nhập kho">
          <form onSubmit={handleUpdateStock} className="w-full max-w-md overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e3beb6] bg-[#fbf9f9] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#1b1c1c]">Cập nhật tồn kho</h2>
                <p className="mt-1 text-xs text-[#8f7069]">SKU: TT-{String(editingProduct.id).padStart(3, '0')}</p>
              </div>
              <button type="button" onClick={closeStockModal} className="rounded-full p-1.5 text-[#5b403b] transition hover:bg-[#efeded] hover:text-[#b22204]" aria-label="Đóng">
                <SellerIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-lg bg-[#fbf9f9] p-3">
                <img src={editingProduct.imageUrl} alt={editingProduct.name} className="h-12 w-12 rounded-lg border border-[#e3beb6] object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1b1c1c]">{editingProduct.name}</p>
                  <p className="text-xs text-[#5b403b]">{editingProduct.category}</p>
                </div>
              </div>

              <label className="block text-sm font-semibold text-[#5b403b]" htmlFor="stockQuantity">
                Tồn kho khả dụng
              </label>
              <input
                id="stockQuantity"
                type="number"
                min="0"
                value={stockInput}
                onChange={(event) => setStockInput(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e3beb6] px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              />
              <p className="text-xs text-[#8f7069]">Dữ liệu nhập kho được lưu mock bằng localStorage để phục vụ demo frontend.</p>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#e3beb6] px-5 py-4">
              <button type="button" onClick={closeStockModal} className="h-10 rounded-lg border border-[#e3beb6] px-4 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]">
                Hủy
              </button>
              <button type="submit" className="h-10 rounded-lg bg-[#ee4d2d] px-5 text-sm font-bold text-white transition hover:bg-[#d73211]">
                Lưu tồn kho
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {historyProduct ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 md:p-6" role="dialog" aria-modal="true" aria-label="Lịch sử đơn hàng của sản phẩm">
          <div className="w-full max-w-6xl overflow-hidden rounded-xl border border-[#e3beb6] bg-[#fbf9f9] shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e3beb6] bg-white px-5 py-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#8f7069]">
                  <span>Kho hàng</span>
                  <SellerIcon name="chevron_right" className="text-[16px]" />
                  <span className="text-[#1b1c1c]">Lịch sử đơn hàng</span>
                </div>
                <h2 className="text-xl font-bold text-[#1b1c1c]">Lịch sử đơn hàng theo sản phẩm</h2>
              </div>
              <button type="button" onClick={closeHistoryModal} className="rounded-full p-1.5 text-[#5b403b] transition hover:bg-[#efeded] hover:text-[#b22204]" aria-label="Đóng">
                <SellerIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <section className="flex flex-col gap-4 rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#e3beb6] bg-[#efeded]">
                    <img src={historyProduct.imageUrl} alt={historyProduct.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded border border-[#ee4d2d]/30 bg-[#ee4d2d]/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[#b22204]">
                        {historyProduct.category}
                      </span>
                      <span className="text-sm text-[#5b403b]">
                        SKU: <strong className="text-[#1b1c1c]">TT-{String(historyProduct.id).padStart(3, '0')}</strong>
                      </span>
                    </div>
                    <h3 className="truncate text-2xl font-bold text-[#1b1c1c]">{historyProduct.name}</h3>
                  </div>
                </div>

                <div className="rounded-lg border border-[#ee4d2d]/20 bg-[#ee4d2d]/10 px-5 py-4 text-right">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#ee4d2d]">Tồn kho hiện tại</p>
                  <div className="mt-1 flex items-baseline justify-end gap-2 text-[#ee4d2d]">
                    <span className="text-[40px] font-bold leading-none">{historyProduct.availableStock}</span>
                    <span className="text-sm font-semibold">sản phẩm</span>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="grid w-full gap-3 md:max-w-2xl md:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="relative">
                    <SellerIcon name="receipt_long" className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8f7069]" />
                    <input
                      type="search"
                      value={historyKeyword}
                      onChange={(event) => setHistoryKeyword(event.target.value)}
                      placeholder="Tìm mã đơn hoặc khách hàng..."
                      className="h-12 w-full rounded-lg border border-[#e3beb6] bg-white pl-12 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                    />
                  </div>
                  <select
                    value={historyRange}
                    onChange={(event) => setHistoryRange(event.target.value)}
                    className="h-12 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm font-medium text-[#5b403b] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  >
                    {historyRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => window.alert('Xuất CSV đang là thao tác mock cho demo frontend.')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#ee4d2d] bg-white px-5 text-sm font-bold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
                >
                  <SellerIcon name="download" className="text-[18px]" />
                  Xuất CSV
                </button>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#e3beb6]/70 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#e3beb6]/70 bg-[#f5f3f3] text-xs font-bold uppercase tracking-[0.08em] text-[#5b403b]">
                        <th className="px-5 py-4">Mã đơn</th>
                        <th className="px-5 py-4">Ngày đặt</th>
                        <th className="px-5 py-4">Khách hàng</th>
                        <th className="px-5 py-4 text-right">SL</th>
                        <th className="px-5 py-4 text-right">Đơn giá</th>
                        <th className="px-5 py-4 text-right">Thành tiền</th>
                        <th className="px-5 py-4 text-center">Trạng thái</th>
                        <th className="px-5 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3beb6]/50">
                      {historyResponse?.data?.rows?.length ? (
                        historyResponse.data.rows.map((order) => (
                          <tr key={order.id} className="transition hover:bg-[#fbf9f9]">
                            <td className="px-5 py-4 text-sm font-bold text-[#ee4d2d]">{order.id}</td>
                            <td className="px-5 py-4 text-sm text-[#5b403b]">
                              <div>{order.dateMeta.date}</div>
                              <div className="text-xs">{order.dateMeta.time}</div>
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-[#1b1c1c]">{order.customerName}</td>
                            <td className="px-5 py-4 text-right text-sm font-semibold text-[#1b1c1c]">{order.quantity}</td>
                            <td className="px-5 py-4 text-right text-sm font-semibold text-[#5b403b]">{formatCurrency(order.unitPrice)}</td>
                            <td className="px-5 py-4 text-right text-lg font-bold text-[#ee4d2d]">{formatCurrency(order.totalAmount)}</td>
                            <td className="px-5 py-4 text-center">
                              <OrderStatusBadge statusMeta={order.statusMeta} />
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Link to={`/seller/orders/${encodeURIComponent(order.id)}`} className="text-sm font-bold text-[#ee4d2d] transition hover:underline">
                                Xem chi tiết
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-5 py-12 text-center">
                            <p className="text-base font-bold text-[#1b1c1c]">Chưa có đơn hàng phù hợp</p>
                            <p className="mt-1 text-sm text-[#5b403b]">Sản phẩm này chưa phát sinh đơn trong dữ liệu mock hoặc bộ lọc hiện tại không có kết quả.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#e3beb6]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#5b403b]">
                    Hiển thị <strong className="text-[#1b1c1c]">{historyResponse?.data?.rows?.length || 0}</strong> đơn hàng
                  </p>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3beb6] text-[#8f7069] opacity-60">
                      <SellerIcon name="chevron_left" className="text-[18px]" />
                    </button>
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-[#ee4d2d] text-sm font-bold text-white">
                      1
                    </button>
                    <button type="button" disabled className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3beb6] text-[#8f7069] opacity-60">
                      <SellerIcon name="chevron_right" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
