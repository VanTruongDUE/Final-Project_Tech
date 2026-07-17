import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import OrderCard from '../../components/buyer/OrderCard'
import { useAuth } from '../../contexts/useAuth'
import { ORDER_STATUS, orderService } from '../../services/orderService'

const statusTabs = [
  { value: 'ALL', label: 'Tất cả', statuses: [] },
  { value: 'WAITING_PAYMENT', label: 'Chờ thanh toán', statuses: [ORDER_STATUS.PENDING] },
  { value: 'SHIPPING_PREPARE', label: 'Vận chuyển', statuses: [ORDER_STATUS.CONFIRMED] },
  { value: 'WAITING_DELIVERY', label: 'Chờ giao hàng', statuses: [ORDER_STATUS.SHIPPING] },
  { value: 'COMPLETED', label: 'Hoàn thành', statuses: [ORDER_STATUS.COMPLETED] },
  { value: 'CANCELLED', label: 'Đã hủy', statuses: [ORDER_STATUS.CANCELLED] },
  { value: 'RETURN_REFUND', label: 'Trả hàng/Hoàn tiền', statuses: ['RETURN_REFUND'] },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export default function OrderHistoryPage() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState('ALL')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    let isMounted = true

    if (!currentUser?.id) {
      setOrders([])
      return
    }

    orderService
      .getOrders(currentUser.id)
      .then((nextOrders) => {
        if (isMounted) {
          setOrders(nextOrders)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setOrders([])
          setFeedback({
            type: 'error',
            message: error.message || 'Không thể tải danh sách đơn hàng.',
          })
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

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
    const activeTab = statusTabs.find((tab) => tab.value === activeStatus) || statusTabs[0]

    return orders.filter((order) => {
      const matchStatus = activeTab.value === 'ALL' || activeTab.statuses.includes(order.status)

      if (!matchStatus) {
        return false
      }

      if (!normalizedKeyword) {
        return true
      }

      const searchableText = [order.id, order.items[0]?.product?.storeName, ...order.items.map((item) => item.product?.name)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedKeyword)
    })
  }, [activeStatus, orders, searchKeyword])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeStatus, searchKeyword])

  const handleCancelOrder = async (orderId) => {
    if (!currentUser?.id) {
      setFeedback({
        type: 'error',
        message: 'Vui lòng đăng nhập để hủy đơn hàng.',
      })
      return
    }

    const response = await orderService.cancelOrder(orderId, currentUser.id)

    if (!response.success) {
      setFeedback({
        type: 'error',
        message: response.message || 'Không thể hủy đơn hàng.',
      })
      return
    }

    setOrders(await orderService.getOrders(currentUser.id))
    setFeedback({
      type: 'success',
      message: `Đơn hàng ${orderId} đã được hủy thành công.`,
    })
  }

  const hasOrders = orders.length > 0
  const ordersPerPage = 4
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage))
  const visibleOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

  return (
    <section className="mx-auto w-full max-w-[1200px] min-w-0 px-3 py-5">
      {feedback.message ? (
        <div
          className={`mb-4 rounded px-4 py-3 text-sm ${
            feedback.type === 'error'
              ? 'border border-rose-200 bg-rose-50 text-rose-700'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded border border-[#e8e8e8] bg-white">
        <div className="border-b border-[#e8e8e8] px-4 py-4">
          <h1 className="text-2xl font-bold text-[#1b1c1c]">Đơn mua</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Theo dõi, tìm kiếm và quản lý các đơn hàng của bạn.</p>
        </div>

        <div className="grid grid-cols-2 overflow-hidden sm:grid-cols-4 lg:grid-cols-7">
          {statusTabs.map((tab) => {
            const isActive = tab.value === activeStatus

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveStatus(tab.value)}
                className={`min-w-0 border-b-2 px-2 py-4 text-center text-sm font-semibold transition ${
                  isActive
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-[#5b403b] hover:text-[#ee4d2d]'
                }`}
              >
                <span className="block truncate">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded border border-[#e8e8e8] bg-[#f7f7f7] px-4 py-2">
        <span className="text-[#8f7069]">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
          className="h-9 w-full border-none bg-transparent text-sm text-[#1b1c1c] outline-none placeholder:text-[#8f7069] focus:ring-0"
        />
      </div>

      {!hasOrders ? (
        <div className="mt-4 rounded border border-[#e8e8e8] bg-white px-6 py-14 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">
            <SearchIcon />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[#1b1c1c]">Bạn chưa có đơn hàng nào</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5b403b]">
            Hãy quay lại danh sách sản phẩm, chọn món đồ phù hợp và hoàn tất thanh toán để đơn hàng của bạn xuất hiện tại đây.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73211]"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-4 rounded border border-[#e8e8e8] bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-[#1b1c1c]">Không tìm thấy đơn hàng phù hợp</h2>
          <p className="mt-3 text-sm text-[#5b403b]">
            Hãy thử đổi trạng thái hoặc từ khóa tìm kiếm để xem lại các đơn hàng đã tạo.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
          ))}

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="grid h-8 w-8 place-items-center rounded border border-[#e8e8e8] bg-white text-sm text-[#5b403b] transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Trang trước"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 min-w-8 rounded border px-2 text-sm font-semibold transition ${
                    currentPage === page
                      ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                      : 'border-[#e8e8e8] bg-white text-[#5b403b] hover:bg-[#f5f3f3]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="grid h-8 w-8 place-items-center rounded border border-[#e8e8e8] bg-white text-sm text-[#5b403b] transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Trang sau"
              >
                ›
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
