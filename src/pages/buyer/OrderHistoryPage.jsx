import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import OrderCard from '../../components/buyer/OrderCard'
import { ORDER_STATUS, orderService, orderStatusMeta } from '../../services/orderService'

const statusTabs = [
  { value: 'ALL', label: 'Tất cả' },
  { value: ORDER_STATUS.PENDING, label: orderStatusMeta[ORDER_STATUS.PENDING].label },
  { value: ORDER_STATUS.CONFIRMED, label: orderStatusMeta[ORDER_STATUS.CONFIRMED].label },
  { value: ORDER_STATUS.SHIPPING, label: orderStatusMeta[ORDER_STATUS.SHIPPING].label },
  { value: ORDER_STATUS.COMPLETED, label: orderStatusMeta[ORDER_STATUS.COMPLETED].label },
  { value: ORDER_STATUS.CANCELLED, label: orderStatusMeta[ORDER_STATUS.CANCELLED].label },
]

export default function OrderHistoryPage() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState('ALL')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    setOrders(orderService.getOrders())
  }, [])

  useEffect(() => {
    if (!location.state?.createdOrderId) {
      return
    }

    setFeedback({
      type: 'success',
      message: `Đặt hàng thành công. Mã đơn của bạn là ${location.state.createdOrderId}.`,
    })
  }, [location.state])

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    return orders.filter((order) => {
      const matchStatus = activeStatus === 'ALL' || order.status === activeStatus

      if (!matchStatus) {
        return false
      }

      if (!normalizedKeyword) {
        return true
      }

      const searchableText = [
        order.id,
        order.items[0]?.product?.storeName,
        ...order.items.map((item) => item.product?.name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedKeyword)
    })
  }, [activeStatus, orders, searchKeyword])

  const handleCancelOrder = (orderId) => {
    const response = orderService.cancelOrder(orderId)

    if (!response.success) {
      setFeedback({
        type: 'error',
        message: response.message || 'Không thể hủy đơn hàng.',
      })
      return
    }

    setOrders(orderService.getOrders())
    setFeedback({
      type: 'success',
      message: `Đơn hàng ${orderId} đã được hủy thành công.`,
    })
  }

  const hasOrders = orders.length > 0

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)] md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ee4d2d]">Buyer Center</p>
          <h1 className="mt-2 text-2xl font-bold text-[#1b1c1c] md:text-3xl">Lịch sử đơn hàng</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b403b]">
            Theo dõi trạng thái các đơn hàng mock đã tạo từ trang thanh toán và kiểm tra lại thông tin giao
            hàng của bạn.
          </p>
        </div>

        <div className="mt-4 w-full md:mt-0 md:w-80">
          <div className="relative">
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm theo mã đơn, shop hoặc sản phẩm..."
              className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fbf9f9] pl-11 pr-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f7069]">🔎</span>
          </div>
        </div>
      </div>

      {feedback.message ? (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            feedback.type === 'error'
              ? 'border border-rose-200 bg-rose-50 text-rose-700'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)]">
        <div className="flex overflow-x-auto border-b border-[#e5e7eb]">
          {statusTabs.map((tab) => {
            const isActive = tab.value === activeStatus

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveStatus(tab.value)}
                className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-semibold transition ${
                  isActive
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-[#5b403b] hover:text-[#ee4d2d]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {!hasOrders ? (
        <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white px-6 py-12 text-center shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1ec] text-3xl text-[#ee4d2d]">
            📦
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[#1b1c1c]">Bạn chưa có đơn hàng nào</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5b403b]">
            Hãy quay lại danh sách sản phẩm, chọn món đồ phù hợp và hoàn tất thanh toán để đơn hàng mock của
            bạn xuất hiện tại đây.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73211]"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white px-6 py-10 text-center shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-bold text-[#1b1c1c]">Không tìm thấy đơn hàng phù hợp</h2>
          <p className="mt-3 text-sm text-[#5b403b]">
            Hãy thử đổi trạng thái hoặc từ khóa tìm kiếm để xem lại các đơn hàng mock đã tạo.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
          ))}
        </div>
      )}
    </section>
  )
}
