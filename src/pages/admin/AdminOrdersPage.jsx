import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

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
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [, setRefreshKey] = useState(0)

  const statsResponse = adminService.getAdminOrderStats()
  const ordersResponse = adminService.getAdminOrders({ keyword, status, paymentStatus, store, dateFrom, dateTo })
  const stats = statsResponse.success ? statsResponse.data : { pending: 0, shipping: 0, completed: 0, cancelled: 0 }
  const orders = ordersResponse.success ? ordersResponse.data : []
  const stores = ordersResponse.meta?.stores || []
  const totalCount = ordersResponse.meta?.totalCount || 0
  const allCount = ordersResponse.meta?.allCount || 0
  const selectedOrderResponse = selectedOrderId ? adminService.getAdminOrderById(selectedOrderId) : null
  const selectedOrder = selectedOrderResponse?.success ? selectedOrderResponse.data : null

  const handleNextStatus = (order) => {
    const nextStatusByCurrent = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PROCESSING',
      PROCESSING: 'PACKING',
      PACKING: 'SHIPPING',
      SHIPPING: 'COMPLETED',
    }
    const nextStatus = nextStatusByCurrent[order.status]

    if (!nextStatus) {
      window.alert(`${order.id} hiện không có bước cập nhật tiếp theo trong chế độ mock Admin.`)
      return
    }

    adminService.updateAdminOrderStatus(order.id, nextStatus)
    setRefreshKey((current) => current + 1)
  }

  const handleCancelOrder = (order) => {
    adminService.updateAdminOrderStatus(order.id, 'CANCELLED')
    setRefreshKey((current) => current + 1)
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

  return (
    <section className="flex w-full min-w-0 flex-col p-3 md:p-6">
      <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Quản lý Đơn hàng</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Theo dõi và xử lý đơn hàng toàn hệ thống.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-10 items-center rounded-lg border border-[#e3e2e2] bg-white px-3 shadow-sm">
            <AdminIcon name="calendar_today" className="mr-2 text-[18px] text-[#5b403b]" />
            <span className="text-sm text-[#1b1c1c]">7 ngày qua</span>
            <AdminIcon name="arrow_drop_down" className="ml-2 text-[18px] text-[#5b403b]" />
          </div>
          <button
            type="button"
            onClick={() => window.alert('Xuất CSV hiện đang ở chế độ mock Admin.')}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e3e2e2] bg-white px-4 text-xs font-medium text-[#1b1c1c] shadow-sm transition hover:bg-[#f5f3f3]"
          >
            <AdminIcon name="download" className="text-[18px]" />
            Xuất CSV
          </button>
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
                onChange={(event) => setDateFrom(event.target.value)}
                className="h-10 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
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
                        <button
                          type="button"
                          onClick={() => handleNextStatus(order)}
                          className="rounded p-1 text-[#5b403b] transition hover:bg-[#e9e8e7] hover:text-[#b22204]"
                          title="Cập nhật trạng thái"
                        >
                          <AdminIcon name="published_with_changes" className="text-[18px]" />
                        </button>
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
            Hiển thị {orders.length ? 1 : 0}-{totalCount} của {allCount} đơn hàng
          </span>
          <div className="flex items-center gap-2">
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_left" className="text-[18px]" />
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded bg-[#b22204] font-medium text-white">
              1
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#1b1c1c]">
              2
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#1b1c1c]">
              3
            </button>
            <span className="px-1">...</span>
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
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
    </section>
  )
}
