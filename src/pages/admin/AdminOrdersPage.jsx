import { useEffect, useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const ITEMS_PER_PAGE = 8

const orderStatusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
]

const paymentStatusOptions = [
  { value: 'all', label: 'Tất cả thanh toán' },
  { value: 'UNPAID', label: 'Chưa thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
  { value: 'FAILED', label: 'Thất bại' },
]

const orderStatusMeta = {
  PENDING: { label: 'Chờ xác nhận', className: 'border-[#b22204] bg-[#ffdad3] text-[#b22204]' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'border-[#e3beb6] bg-[#ffdad3]/50 text-[#8d1600]' },
  PROCESSING: { label: 'Đang xử lý', className: 'border-amber-300 bg-amber-100 text-amber-800' },
  PACKING: { label: 'Đang đóng gói', className: 'border-[#e3e2e2] bg-[#f5f3f3] text-[#5b403b]' },
  SHIPPING: { label: 'Đang giao', className: 'border-[#db3514] bg-[#ffdad3] text-[#db3514]' },
  COMPLETED: { label: 'Hoàn thành', className: 'border-[#dbdad9] bg-[#efeded] text-[#1b1c1c]' },
  CANCELLED: { label: 'Đã hủy', className: 'border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]' },
}

const paymentStatusMeta = {
  UNPAID: { label: 'Chưa TT', dotClassName: 'bg-[#8f7069]' },
  PAID: { label: 'Đã TT', dotClassName: 'bg-[#b22204]' },
  REFUNDED: { label: 'Hoàn tiền', dotClassName: 'bg-[#5b403b]' },
  FAILED: { label: 'Thất bại', dotClassName: 'bg-[#ba1a1a]' },
}

function OrderStatusBadge({ status }) {
  const meta = orderStatusMeta[status] || orderStatusMeta.PENDING

  return <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>
}

function PaymentBadge({ status }) {
  const meta = paymentStatusMeta[status] || paymentStatusMeta.UNPAID

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e9e8e7] px-2 py-1 text-xs font-medium text-[#1b1c1c]">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
      {meta.label}
    </span>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

function escapeCsvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function encodeUtf16Le(value) {
  const bytes = new Uint8Array(2 + value.length * 2)
  bytes[0] = 0xFF
  bytes[1] = 0xFE
  for (let index = 0; index < value.length; index += 1) {
    const characterCode = value.charCodeAt(index)
    bytes[2 + index * 2] = characterCode & 0xFF
    bytes[3 + index * 2] = characterCode >> 8
  }
  return bytes
}

function exportOrdersCsv(orders) {
  const rows = [
    ['Mã đơn', 'Khách hàng', 'Cửa hàng', 'Sản phẩm', 'Ngày đặt', 'Tổng tiền (VNĐ)', 'Thanh toán', 'Trạng thái'],
    ...orders.map((order) => [
      order.id,
      order.customerName,
      order.storeName,
      order.summary,
      order.orderedAtLabel,
      order.total,
      paymentStatusMeta[order.paymentStatus]?.label || order.paymentStatus,
      orderStatusMeta[order.status]?.label || order.status,
    ]),
  ]
  const content = rows.map((row) => row.map(escapeCsvCell).join('\t')).join('\r\n')
  const blob = new Blob([encodeUtf16Le(content)], { type: 'text/tab-separated-values;charset=utf-16le' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `don-hang-toan-san-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function AdminConfirmDialog({ action, error, onClose, onConfirm }) {
  if (!action) return null

  const isCancel = action.nextStatus === 'CANCELLED'
  const nextStatusLabel = orderStatusMeta[action.nextStatus]?.label || action.nextStatus

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1b1c1c]/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-2xl">
        <div className={`h-1 ${isCancel ? 'bg-[#ba1a1a]' : 'bg-[#b22204]'}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${isCancel ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ffdad3] text-[#b22204]'}`}><AdminIcon name={isCancel ? 'cancel' : 'published_with_changes'} className="text-[24px]" /></span>
            <div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-[#1b1c1c]">{isCancel ? 'Hủy đơn hàng?' : 'Cập nhật trạng thái?'}</h2><p className="mt-2 text-sm leading-6 text-[#5b403b]">Đơn #{action.order.id} sẽ chuyển sang trạng thái <strong>{nextStatusLabel}</strong>.</p></div>
            <button type="button" onClick={onClose} aria-label="Đóng" className="grid h-8 w-8 place-items-center rounded-lg text-[#8f7069] hover:bg-[#f5f3f3]"><AdminIcon name="close" className="text-[18px]" /></button>
          </div>
          {error ? <p className="mt-4 rounded-lg bg-[#ffdad6] px-3 py-2 text-sm font-medium text-[#93000a]">{error}</p> : null}
          <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#e3beb6] px-5 text-sm font-bold text-[#5b403b]">Quay lại</button><button type="button" onClick={onConfirm} className={`h-10 rounded-lg px-5 text-sm font-bold text-white ${isCancel ? 'bg-[#ba1a1a] hover:bg-[#93000a]' : 'bg-[#b22204] hover:bg-[#d63c1e]'}`}>{isCancel ? 'Hủy đơn' : 'Cập nhật'}</button></div>
        </div>
      </section>
    </div>
  )
}

function OrderDetailModal({ order, onClose, onNextStatus, onCancelOrder }) {
  if (!order) {
    return null
  }

  const statusMeta = orderStatusMeta[order.status] || orderStatusMeta.PENDING
  const paymentMeta = paymentStatusMeta[order.paymentStatus] || paymentStatusMeta.UNPAID

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-3">
      <div className="flex max-h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-xl bg-[#fbf9f9] shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-[#e3e2e2] bg-white p-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
              <span>Đơn hàng</span>
              <AdminIcon name="chevron_right" className="text-[16px]" />
              <span className="text-[#1b1c1c]">Chi tiết</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-[#1b1c1c]">Đơn hàng #{order.id}</h2>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusMeta.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#5b403b]">Đặt lúc: {order.orderedAtLabel}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' ? (
              <>
                <button
                  type="button"
                  onClick={() => onNextStatus(order)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b22204] px-4 text-sm font-semibold text-white transition hover:bg-[#d63c1e]"
                >
                  <AdminIcon name="published_with_changes" className="text-[18px]" />
                  Cập nhật trạng thái
                </button>
                <button
                  type="button"
                  onClick={() => onCancelOrder(order)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ba1a1a] bg-white px-4 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                >
                  <AdminIcon name="cancel" className="text-[18px]" />
                  Hủy đơn
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3e2e2] bg-white text-[#5b403b] transition hover:bg-[#f5f3f3]"
              aria-label="Đóng chi tiết đơn hàng"
            >
              <AdminIcon name="close" className="text-[20px]" />
            </button>
          </div>
        </header>

        <div className="overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-[#1b1c1c]">Tiến trình xử lý</h3>
                <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-2">
                  <div className="absolute left-4 right-4 top-4 h-[2px] bg-[#e3e2e2]" />
                  {order.timeline.map((step) => (
                    <div key={step.status} className="relative z-10 flex min-w-[88px] flex-col items-center gap-2 text-center">
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-full ring-4 ring-white ${
                          step.state === 'done'
                            ? 'bg-[#b22204] text-white'
                            : step.state === 'current'
                              ? 'border-2 border-[#b22204] bg-[#ffdad3] text-[#b22204]'
                              : 'bg-[#e3e2e2] text-[#8f7069]'
                        }`}
                      >
                        <AdminIcon name={step.state === 'done' ? 'check' : step.icon} className="text-[16px]" />
                      </div>
                      <span className={`text-xs font-semibold ${step.state === 'current' ? 'text-[#b22204]' : step.state === 'done' ? 'text-[#1b1c1c]' : 'text-[#8f7069]'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
                <div className="border-b border-[#e3e2e2] bg-[#fbf9f9] p-4">
                  <h3 className="text-lg font-semibold text-[#1b1c1c]">Sản phẩm ({order.items.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead className="border-b border-[#e3e2e2] bg-[#efeded] text-xs text-[#5b403b]">
                      <tr>
                        <th className="p-4 font-semibold">Sản phẩm</th>
                        <th className="p-4 text-center font-semibold">SL</th>
                        <th className="p-4 text-right font-semibold">Đơn giá</th>
                        <th className="p-4 text-right font-semibold">Tổng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e2e2] text-sm">
                      {order.items.map((item) => (
                        <tr key={item.productId} className="hover:bg-[#fbf9f9]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-12 w-12 shrink-0 place-items-center rounded border border-[#e3e2e2] bg-[#f5f3f3] text-[#5b403b]">
                                <AdminIcon name="inventory_2" className="text-[22px]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#1b1c1c]">{item.productName}</p>
                                <p className="mt-1 text-xs text-[#8f7069]">{item.variantLabel}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center text-[#1b1c1c]">{item.quantity}</td>
                          <td className="p-4 text-right text-[#1b1c1c]">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-4 text-right font-semibold text-[#b22204]">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1b1c1c]">Lịch sử đơn hàng</h3>
                <div className="space-y-4">
                  {order.history.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ffdad3] text-[#b22204]">
                        <AdminIcon name={item.icon} className="text-[16px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1c]">{item.label}</p>
                        <p className="mt-0.5 text-xs text-[#8f7069]">{order.orderedAtLabel}</p>
                        <p className="mt-1 text-sm text-[#5b403b]">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="person" className="text-[22px] text-[#b22204]" />
                  Khách hàng
                </h3>
                <div className="space-y-3 text-sm text-[#1b1c1c]">
                  <p className="font-semibold">{order.customer.name}</p>
                  <p className="text-[#5b403b]">{order.customer.phone}</p>
                  <p className="text-[#5b403b]">{order.customer.email}</p>
                  <p className="leading-6 text-[#5b403b]">{order.customer.address}</p>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="storefront" className="text-[22px] text-[#b22204]" />
                  Cửa hàng
                </h3>
                <div className="space-y-2 text-sm text-[#1b1c1c]">
                  <p className="font-semibold">{order.store.name}</p>
                  <p className="text-[#5b403b]">Mã cửa hàng: {order.store.id}</p>
                  <p className="text-[#5b403b]">Hỗ trợ: {order.store.supportPhone}</p>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="receipt_long" className="text-[22px] text-[#b22204]" />
                  Thanh toán
                </h3>
                <div className="space-y-2 text-sm text-[#1b1c1c]">
                  <div className="flex justify-between">
                    <span className="text-[#5b403b]">Tạm tính</span>
                    <span>{formatCurrency(order.payment.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#15803D]">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(order.payment.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5b403b]">Phí vận chuyển</span>
                    <span>{formatCurrency(order.payment.shippingFee)}</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between border-t border-[#e3e2e2] pt-3">
                    <span className="font-semibold">Tổng cộng</span>
                    <div className="text-right">
                      <span className="block text-xl font-bold text-[#b22204]">{formatCurrency(order.payment.total)}</span>
                      <span className="text-xs text-[#8f7069]">{order.payment.method}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e9e8e7] px-2 py-1 text-xs font-medium text-[#1b1c1c]">
                      <span className={`h-1.5 w-1.5 rounded-full ${paymentMeta.dotClassName}`} />
                      {paymentMeta.label}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [paymentStatus, setPaymentStatus] = useState('all')
  const [store, setStore] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [quickRange, setQuickRange] = useState('7d')
  const [page, setPage] = useState(1)
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [actionError, setActionError] = useState('')
  const [exportMessage, setExportMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [statsResponse, setStatsResponse] = useState({ success: false, isLoading: true })
  const [ordersResponse, setOrdersResponse] = useState({ success: false, isLoading: true })
  const [selectedOrderResponse, setSelectedOrderResponse] = useState(null)

  useEffect(() => {
    let isMounted = true

    setOrdersResponse({ success: false, isLoading: true })
    Promise.all([
      Promise.resolve(adminService.getAdminOrderStats()),
      Promise.resolve(adminService.getAdminOrders({ keyword, status, paymentStatus, store, dateFrom, dateTo })),
    ])
      .then(([statsResult, ordersResult]) => {
        if (isMounted) {
          setStatsResponse(statsResult)
          setOrdersResponse(ordersResult)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStatsResponse({ success: false, message: error.message })
          setOrdersResponse({ success: false, message: error.message })
        }
      })

    return () => {
      isMounted = false
    }
  }, [keyword, status, paymentStatus, store, dateFrom, dateTo, refreshKey])

  useEffect(() => {
    let isMounted = true

    if (!selectedOrderId) {
      setSelectedOrderResponse(null)
      return () => {
        isMounted = false
      }
    }

    Promise.resolve(adminService.getAdminOrderById(selectedOrderId))
      .then((response) => {
        if (isMounted) setSelectedOrderResponse(response)
      })
      .catch((error) => {
        if (isMounted) setSelectedOrderResponse({ success: false, message: error.message })
      })

    return () => {
      isMounted = false
    }
  }, [selectedOrderId, refreshKey])

  const stats = statsResponse.success ? statsResponse.data : { pending: 0, shipping: 0, completed: 0, cancelled: 0 }
  const filteredOrders = ordersResponse.success ? ordersResponse.data : []
  const stores = ordersResponse.meta?.stores || []
  const totalCount = ordersResponse.meta?.totalCount || 0
  const allCount = ordersResponse.meta?.allCount || 0
  const selectedOrder = selectedOrderResponse?.success ? selectedOrderResponse.data : null
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const orders = filteredOrders.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [keyword, status, paymentStatus, store, dateFrom, dateTo])

  const handleNextStatus = (order) => {
    const nextStatusByCurrent = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PROCESSING',
      PROCESSING: 'PACKING',
      PACKING: 'SHIPPING',
      SHIPPING: 'COMPLETED',
    }
    const nextStatus = nextStatusByCurrent[order.status]

    if (!nextStatus) return
    setPendingAction({ order, nextStatus })
    setActionError('')
  }

  const handleCancelOrder = (order) => {
    setPendingAction({ order, nextStatus: 'CANCELLED' })
    setActionError('')
  }

  const confirmOrderStatus = async () => {
    if (!pendingAction) return
    const response = await Promise.resolve(adminService.updateAdminOrderStatus(pendingAction.order.id, pendingAction.nextStatus))
    if (!response.success) return setActionError(response.message)
    setPendingAction(null)
    setActionError('')
    setRefreshKey((current) => current + 1)
  }

  const applyQuickRange = (value) => {
    setQuickRange(value)
    if (value === 'all') {
      setDateFrom('')
      setDateTo('')
      return
    }

    const latestDate = new Date(ordersResponse.meta?.latestOrderedAt || new Date())
    const startDate = new Date(latestDate)
    startDate.setDate(latestDate.getDate() - (value === '30d' ? 29 : 6))
    setDateFrom(startDate.toISOString().slice(0, 10))
    setDateTo(latestDate.toISOString().slice(0, 10))
  }

  const handleExport = () => {
    exportOrdersCsv(filteredOrders)
    setExportMessage(`Đã xuất ${filteredOrders.length} đơn hàng.`)
  }

  const kpiCards = [
    { label: 'Chờ xác nhận', value: stats.pending, hint: '+12% hôm nay', icon: 'pending_actions', tone: 'primary' },
    { label: 'Đang giao', value: stats.shipping, hint: 'Bình thường', icon: 'local_shipping', tone: 'secondary' },
    { label: 'Hoàn thành', value: stats.completed, hint: '+5% tuần này', icon: 'check_circle', tone: 'neutral' },
    { label: 'Đã hủy', value: stats.cancelled, hint: 'Cần chú ý', icon: 'cancel', tone: 'error' },
  ]

  const toneClass = {
    primary: 'bg-[#ffdad3] text-[#8d1600]',
    secondary: 'bg-[#db3514] text-white',
    neutral: 'bg-[#dbdad9] text-[#1b1c1c]',
    error: 'bg-[#ffdad6] text-[#93000a]',
  }

  if (ordersResponse.isLoading) {
    return (
      <section className="flex w-full min-w-0 flex-col p-3 md:p-6">
        <div className="rounded-xl border border-[#e3e2e2] bg-white p-5 text-sm text-[#5b403b] shadow-sm">Đang tải đơn hàng Admin...</div>
      </section>
    )
  }

  if (!ordersResponse.success) {
    return (
      <section className="flex w-full min-w-0 flex-col p-3 md:p-6">
        <div className="rounded-xl border border-[#ffdad6] bg-white p-5 text-sm text-[#ba1a1a] shadow-sm">{ordersResponse.message || 'Không thể tải đơn hàng Admin.'}</div>
      </section>
    )
  }

  return (
    <section className="flex w-full min-w-0 flex-col p-3 md:p-6">
      <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Quản lý Đơn hàng</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Theo dõi và xử lý đơn hàng toàn hệ thống.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="relative">
            <AdminIcon name="calendar_today" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
            <select value={quickRange} onChange={(event) => applyQuickRange(event.target.value)} className="h-10 appearance-none rounded-lg border border-[#e3e2e2] bg-white pl-10 pr-9 text-sm text-[#1b1c1c] shadow-sm outline-none focus:border-[#b22204]">
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="all">Tất cả thời gian</option>
              {quickRange === 'custom' ? <option value="custom">Tùy chỉnh</option> : null}
            </select>
            <AdminIcon name="expand_more" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e3e2e2] bg-white px-4 text-xs font-medium text-[#1b1c1c] shadow-sm transition hover:bg-[#f5f3f3]"
          >
            <AdminIcon name="download" className="text-[18px]" />
            Xuất CSV
          </button>
          {exportMessage ? <span role="status" className="text-xs font-medium text-[#15803D] sm:basis-full sm:text-right">{exportMessage}</span> : null}
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="group relative overflow-hidden rounded-xl border border-[#e9e8e7] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#ffdad3] opacity-20 transition-transform group-hover:scale-110" />
            <div className="mb-4 flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${toneClass[card.tone]}`}>
                <AdminIcon name={card.icon} className="text-[18px]" />
              </div>
              <span className="text-xs font-medium text-[#5b403b]">{card.label}</span>
            </div>
            <div>
              <span className={`text-2xl font-bold ${card.tone === 'primary' ? 'text-[#b22204]' : 'text-[#1b1c1c]'}`}>{card.value}</span>
              <span className={`ml-1 text-xs ${card.tone === 'error' ? 'text-[#ba1a1a]' : 'text-[#5b403b]'}`}>{card.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-t-xl border-b border-[#e3e2e2] bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full max-w-sm">
              <AdminIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm mã đơn hàng, tên khách..."
                className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#b22204] focus:ring-1 focus:ring-[#b22204]"
              />
            </div>

            <div className="relative">
              <select
                value={store}
                onChange={(event) => setStore(event.target.value)}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-3 pr-9 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] lg:w-56"
              >
                <option value="all">Cửa hàng: Tất cả</option>
                {stores.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <AdminIcon name="expand_more" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
            </div>

            <div className="relative">
              <select
                value={paymentStatus}
                onChange={(event) => setPaymentStatus(event.target.value)}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-3 pr-9 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] lg:w-44"
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <AdminIcon name="expand_more" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => { setDateFrom(event.target.value); setQuickRange('custom') }}
                className="h-10 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(event) => { setDateTo(event.target.value); setQuickRange('custom') }}
                className="h-10 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {orderStatusOptions.map((option) => {
              const isActive = status === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`rounded-full border px-4 py-1 text-xs font-medium transition ${
                    isActive ? 'border-[#ffdad3] bg-[#ffdad3] text-[#8d1600]' : 'border-[#e3e2e2] bg-[#fbf9f9] text-[#5b403b] hover:bg-[#e9e8e7]'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <thead>
              <tr className="bg-[#e9e8e7] text-xs font-medium uppercase tracking-wide text-[#5b403b]">
                <th className="p-4 font-medium">Mã Đơn</th>
                <th className="p-4 font-medium">Khách Hàng</th>
                <th className="p-4 font-medium">Cửa Hàng</th>
                <th className="p-4 font-medium">Ngày Đặt</th>
                <th className="p-4 text-right font-medium">Tổng Tiền</th>
                <th className="p-4 text-center font-medium">Thanh Toán</th>
                <th className="p-4 text-center font-medium">Trạng Thái</th>
                <th className="p-4 text-right font-medium">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2] text-sm">
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="group transition-colors hover:bg-[#fbf9f9]">
                    <td className="p-4 font-semibold text-[#b22204]">#{order.id}</td>
                    <td className="p-4 text-[#1b1c1c]">{order.customerName}</td>
                    <td className="p-4">
                      <p className="text-[#5b403b]">{order.storeName}</p>
                      <p className="text-xs text-[#8f7069]">{order.summary}</p>
                    </td>
                    <td className="p-4 text-[#5b403b]">{order.orderedAtLabel}</td>
                    <td className="p-4 text-right font-semibold text-[#1b1c1c]">{order.totalLabel}</td>
                    <td className="p-4 text-center">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="p-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-xs font-medium text-[#b22204] transition hover:text-[#d63c1e]"
                        >
                          Chi tiết
                        </button>
                        {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' ? (
                          <button
                            type="button"
                            onClick={() => handleNextStatus(order)}
                            className="rounded p-1 text-[#5b403b] transition hover:bg-[#e9e8e7] hover:text-[#b22204]"
                            title="Cập nhật trạng thái"
                          >
                            <AdminIcon name="published_with_changes" className="text-[18px]" />
                          </button>
                        ) : null}
                        {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' ? (
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order)}
                            className="rounded p-1 text-[#5b403b] transition hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
                            title="Hủy đơn"
                          >
                            <AdminIcon name="cancel" className="text-[18px]" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-sm text-[#5b403b]">
                    Không có đơn hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#e3e2e2] p-4 text-sm text-[#5b403b]">
          <span>
            Hiển thị {orders.length ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(safePage - 1) * ITEMS_PER_PAGE + orders.length} của {totalCount} kết quả ({allCount} đơn toàn hệ thống)
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1} className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_left" className="text-[18px]" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-medium ${pageNumber === safePage ? 'border-[#b22204] bg-[#b22204] text-white' : 'border-[#e3e2e2] text-[#1b1c1c]'}`}>
                {pageNumber}
              </button>
            ))}
            <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages} className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrderId('')}
        onNextStatus={handleNextStatus}
        onCancelOrder={handleCancelOrder}
      />
      <AdminConfirmDialog action={pendingAction} error={actionError} onClose={() => { setPendingAction(null); setActionError('') }} onConfirm={confirmOrderStatus} />
    </section>
  )
}
