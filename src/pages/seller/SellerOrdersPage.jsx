import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerConfirmDialog from '../../components/seller/SellerConfirmDialog'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { mockProducts } from '../../mocks/products.mock'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

const ORDERS_PAGE_SIZE = 10

const orderStatusActions = {
  PENDING: [
    { nextStatus: 'CONFIRMED', label: 'Xác nhận', icon: 'check_circle', hover: 'hover:text-[#16A34A]' },
    { nextStatus: 'CANCELLED', label: 'Hủy', icon: 'cancel', hover: 'hover:text-[#ba1a1a]' },
  ],
  CONFIRMED: [
    { nextStatus: 'PROCESSING', label: 'Xử lý', icon: 'inventory', hover: 'hover:text-[#0284C7]' },
  ],
  PROCESSING: [
    { nextStatus: 'PACKING', label: 'Đóng gói', icon: 'inventory_2', hover: 'hover:text-[#0284C7]' },
  ],
  PACKING: [
    { nextStatus: 'SHIPPING', label: 'Giao hàng', icon: 'local_shipping', hover: 'hover:text-[#0F766E]' },
  ],
  SHIPPING: [
    { nextStatus: 'COMPLETED', label: 'Hoàn thành', icon: 'task_alt', hover: 'hover:text-[#16A34A]' },
  ],
}

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'PACKING', label: 'Đang đóng gói' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

function OrderSkuSummary({ order }) {
  const firstItem = order.items?.[0]
  const product = mockProducts.find((item) => String(item.id) === String(firstItem?.productId))
  const skuCode = firstItem?.skuCode || firstItem?.product?.skuCode || product?.skuCode

  return skuCode ? <p className="mt-1 max-w-48 break-all text-xs text-[#8f7069]">SKU: {skuCode}</p> : null
}

function ActionButtons({ order, onStatusChange, onViewOrder }) {
  const availableActions = orderStatusActions[order.status] || []

  return (
    <div className="flex items-center justify-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
      <button
        type="button"
        title="Xem chi tiết"
        onClick={() => onViewOrder(order)}
        className="text-[#8f7069] transition hover:text-[#ee4d2d]"
      >
        <SellerIcon name="visibility" className="text-[20px]" />
      </button>
      {availableActions.map((action) => (
        <button
          key={action.nextStatus}
          type="button"
          title={action.label}
          onClick={() => onStatusChange(order, action)}
          className={`text-[#8f7069] transition ${action.hover}`}
        >
          <SellerIcon name={action.icon} className="text-[20px]" />
        </button>
      ))}
    </div>
  )
}

export default function SellerOrdersPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [, setOrdersVersion] = useState(0)
  const [pendingUpdate, setPendingUpdate] = useState(null)
  const [updateError, setUpdateError] = useState('')

  const ordersResponse = sellerService.getSellerOrders(currentUser, { keyword, status, dateFrom, dateTo })

  if (!ordersResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {ordersResponse.message || 'Không thể tải danh sách đơn hàng của seller.'}
        </div>
      </section>
    )
  }

  const { data: orders, meta } = ordersResponse
  const totalPages = Math.max(1, Math.ceil(meta.totalCount / ORDERS_PAGE_SIZE))
  const paginationItems = totalPages <= 1 ? [1] : [1, 2, 3].filter((page) => page <= totalPages)
  const shouldShowPagination = meta.totalCount > ORDERS_PAGE_SIZE

  const resetFilters = () => {
    setKeyword('')
    setStatus('all')
    setDateFrom('')
    setDateTo('')
  }

  const handleViewOrder = (order) => {
    navigate(`/seller/orders/${encodeURIComponent(order.id)}`)
  }

  const handleStatusChange = (order, action) => {
    setUpdateError('')
    setPendingUpdate({ order, action })
  }

  const confirmStatusChange = () => {
    if (!pendingUpdate) return
    const response = sellerService.updateSellerOrderStatus(
      currentUser,
      pendingUpdate.order.id,
      pendingUpdate.action.nextStatus,
    )

    if (!response.success) {
      setUpdateError(response.message || 'Không thể cập nhật trạng thái đơn hàng.')
      return
    }

    setPendingUpdate(null)
    setUpdateError('')
    setOrdersVersion((version) => version + 1)
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f5f3f3] p-4 md:p-6 xl:pr-8">
      <div className="flex w-full min-w-0 flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-[24px] font-semibold leading-[1.4] text-[#1b1c1c]">Danh sách đơn hàng</h1>
            <p className="text-sm leading-5 text-[#5b403b]">Quản lý và theo dõi trạng thái tất cả đơn hàng của bạn.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.alert('Xuất CSV hiện đang ở chế độ mock UI Seller.')}
              className="flex h-10 items-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-4 text-xs font-medium text-[#1b1c1c] shadow-sm transition hover:bg-[#efeded]"
            >
              <SellerIcon name="download" className="text-[18px]" />
              Xuất CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e3beb6] bg-white p-4 shadow-sm">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            <div className="relative w-full max-w-[300px]">
              <SellerIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm mã đơn, tên khách hàng..."
                className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#b22204]"
              />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 min-w-[160px] cursor-pointer appearance-none rounded-lg border border-[#e3beb6] bg-white py-2 pl-4 pr-10 text-sm text-[#1b1c1c] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#b22204]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SellerIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SellerIcon name="calendar_today" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  className="h-10 rounded-lg border border-[#e3beb6] bg-white py-2 pl-10 pr-3 text-sm text-[#1b1c1c] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#b22204]"
                />
              </div>
              <span className="text-[#5b403b]">-</span>
              <div className="relative">
                <SellerIcon name="calendar_today" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  className="h-10 rounded-lg border border-[#e3beb6] bg-white py-2 pl-10 pr-3 text-sm text-[#1b1c1c] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#b22204]"
                />
              </div>
            </div>
          </div>
          <button type="button" onClick={resetFilters} className="bg-transparent text-xs font-medium text-[#ee4d2d] hover:underline">
            Xóa bộ lọc
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'PENDING', label: 'Chờ xác nhận' },
            { value: 'COMPLETED', label: 'Đơn thành công' },
            { value: 'CANCELLED', label: 'Đơn đã hủy' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatus(item.value)}
              className={`h-9 rounded-full border px-4 text-sm font-semibold transition ${
                status === item.value
                  ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                  : 'border-[#e3beb6] bg-white text-[#5b403b] hover:border-[#ee4d2d] hover:text-[#ee4d2d]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="border-b border-[#e3beb6] bg-white text-xs font-medium text-[#5b403b]">
                <tr>
                  <th className="w-12 px-4 py-3 font-medium">
                    <input type="checkbox" className="rounded border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]" />
                  </th>
                  <th className="px-4 py-3 font-medium">Mã đơn</th>
                  <th className="px-4 py-3 font-medium">Người mua</th>
                  <th className="px-4 py-3 font-medium">Ngày đặt</th>
                  <th className="px-4 py-3 text-right font-medium">Tổng tiền</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Thanh toán</th>
                  <th className="px-4 py-3 text-center font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3beb6] text-sm text-[#1b1c1c]">
                {orders.length ? (
                  orders.map((order) => (
                    <tr key={order.id} className="group transition-colors hover:bg-[#efeded]">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]" />
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => handleViewOrder(order)} className="font-medium text-[#ee4d2d] hover:underline">
                          {order.id}
                        </button>
                        <OrderSkuSummary order={order} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3e2e2] text-xs font-bold text-[#5b403b]">
                            {order.customerInitials}
                          </div>
                          <span>{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#5b403b]">
                        {order.dateMeta.date}
                        <br />
                        <span className="text-xs font-normal">{order.dateMeta.time}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${order.statusMeta.className}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {order.statusMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#5b403b]">{order.paymentLabel}</td>
                      <td className="px-4 py-3">
                        <ActionButtons order={order} onStatusChange={handleStatusChange} onViewOrder={handleViewOrder} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-[#5b403b]">
                      Không tìm thấy đơn hàng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#e3beb6] bg-white px-4 py-3 sm:px-6">
            <p className="text-sm text-[#5b403b]">
              Hiển thị <span className="font-medium text-[#1b1c1c]">{orders.length ? 1 : 0}</span> đến{' '}
              <span className="font-medium text-[#1b1c1c]">{orders.length}</span> trong số{' '}
              <span className="font-medium text-[#1b1c1c]">{meta.totalCount}</span> đơn hàng
            </p>
            {shouldShowPagination ? (
              <nav aria-label="Pagination" className="relative z-0 inline-flex gap-1 rounded-md shadow-sm">
                <button type="button" className="relative inline-flex items-center rounded-md border border-[#e3beb6] bg-white px-2 py-2 text-xs font-medium text-[#5b403b] hover:bg-[#efeded]">
                  <SellerIcon name="chevron_left" className="text-[20px]" />
                </button>
                {paginationItems.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={page === 1 ? 'relative inline-flex items-center rounded-md border border-[#ee4d2d] bg-[#ee4d2d] px-4 py-2 text-xs font-medium text-white' : 'relative inline-flex items-center rounded-md border border-[#e3beb6] bg-white px-4 py-2 text-xs font-medium text-[#5b403b] hover:bg-[#efeded]'}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 3 ? (
                  <>
                    <span className="relative inline-flex items-center border border-transparent bg-transparent px-4 py-2 text-xs font-medium text-[#5b403b]">...</span>
                    <button type="button" className="relative inline-flex items-center rounded-md border border-[#e3beb6] bg-white px-4 py-2 text-xs font-medium text-[#5b403b] hover:bg-[#efeded]">
                      {totalPages}
                    </button>
                  </>
                ) : null}
                <button type="button" className="relative inline-flex items-center rounded-md border border-[#e3beb6] bg-white px-2 py-2 text-xs font-medium text-[#5b403b] hover:bg-[#efeded]">
                  <SellerIcon name="chevron_right" className="text-[20px]" />
                </button>
              </nav>
            ) : null}
          </div>
        </div>
      </div>

      <SellerConfirmDialog
        open={Boolean(pendingUpdate)}
        title={pendingUpdate ? `${pendingUpdate.action.label} đơn hàng` : 'Cập nhật trạng thái đơn hàng'}
        description={pendingUpdate ? `Bạn có chắc muốn cập nhật đơn ${pendingUpdate.order.id}? Thao tác sẽ được ghi vào lịch sử đơn hàng.` : ''}
        confirmLabel={pendingUpdate?.action.label || 'Xác nhận'}
        icon={pendingUpdate?.action.icon || 'help'}
        danger={pendingUpdate?.action.nextStatus === 'CANCELLED'}
        error={updateError}
        onCancel={() => { setPendingUpdate(null); setUpdateError('') }}
        onConfirm={confirmStatusChange}
      />
    </section>
  )
}
