import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import OrderItemList from '../../components/buyer/OrderItemList'
import OrderSummaryBox from '../../components/buyer/OrderSummaryBox'
import OrderTimeline from '../../components/buyer/OrderTimeline'
import ReviewModal from '../../components/buyer/ReviewModal'
import ReviewStatusBadge from '../../components/buyer/ReviewStatusBadge'
import { useAuth } from '../../contexts/useAuth'
import { conversationService } from '../../services/conversationService'
import { ORDER_STATUS, orderService } from '../../services/orderService'
import { reviewService } from '../../services/reviewService'

const formatDateTime = (value) => {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const getReviewedOrderItemIds = async (order, customerId) => {
  const items = order?.items || []
  const productIds = [...new Set(items.map((item) => item.productId).filter(Boolean))]
  const responses = await Promise.all(productIds.map((productId) => reviewService.getProductReviews(productId)))
  const orderItemIds = new Set(items.map((item) => String(item.orderItemId)))

  return responses
    .flatMap((response) => response.data)
    .filter(
      (review) =>
        String(review.reviewerId) === String(customerId) &&
        orderItemIds.has(String(review.orderItemId)),
    )
    .map((review) => String(review.orderItemId))
}

const statusMetaMap = {
  [ORDER_STATUS.PENDING]: {
    label: 'Chờ xác nhận',
    icon: 'receipt_long',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Đã xác nhận',
    icon: 'verified',
    badgeClass: 'bg-[#fff1ec] text-[#b22204]',
  },
  [ORDER_STATUS.SHIPPING]: {
    label: 'Đang giao hàng',
    icon: 'local_shipping',
    badgeClass: 'bg-[#ee4d2d] text-white',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'Hoàn thành',
    icon: 'check_circle',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Đã hủy',
    icon: 'cancel',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
}

function Card({ children, className = '' }) {
  return (
    <section className={`rounded-lg border border-[#e8e8e8] bg-white shadow-[0_1px_20px_0_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </section>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [selectedReviewItem, setSelectedReviewItem] = useState(null)
  const [reviewedOrderItemIds, setReviewedOrderItemIds] = useState([])
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!currentUser?.id) {
      setOrder(null)
      setErrorMessage('Không tìm thấy đơn hàng')
      setReviewedOrderItemIds([])
      setIsLoading(false)
      return undefined
    }

    setIsLoading(true)

    const loadOrder = async () => {
      const response = await orderService.getOrderById(id, currentUser.id)
      if (!isMounted) return

      if (!response.success) {
        setOrder(null)
        setErrorMessage(response.message || 'Không tìm thấy đơn hàng')
        setReviewedOrderItemIds([])
        setIsLoading(false)
        return
      }

      setOrder(response.data)
      setErrorMessage('')
      try {
        const reviewedIds = await getReviewedOrderItemIds(response.data, currentUser.id)
        if (isMounted) setReviewedOrderItemIds(reviewedIds)
      } catch (error) {
        if (isMounted) {
          setReviewedOrderItemIds([])
          setSubmitError(error.message)
        }
      }
      if (isMounted) setIsLoading(false)
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id, id])

  const reloadOrder = async () => {
    if (!currentUser?.id) {
      return
    }

    const response = await orderService.getOrderById(id, currentUser.id)

    if (!response.success) {
      setOrder(null)
      setErrorMessage(response.message || 'Không tìm thấy đơn hàng')
      setReviewedOrderItemIds([])
      return
    }

    setOrder(response.data)
    setErrorMessage('')
    setReviewedOrderItemIds(await getReviewedOrderItemIds(response.data, currentUser.id))
  }

  const handleCancelOrder = async () => {
    if (!order || !currentUser?.id) {
      return
    }

    const confirmed = window.confirm(`Bạn có chắc muốn hủy đơn hàng ${order.id}?`)

    if (!confirmed) {
      return
    }

    const response = await orderService.cancelOrder(order.id, currentUser.id)

    if (!response.success) {
      setFeedbackMessage(response.message || 'Không thể hủy đơn hàng.')
      return
    }

    setFeedbackMessage(`Đơn hàng ${order.id} đã được hủy thành công.`)
    await reloadOrder()
  }

  const handleOpenReview = (item) => {
    setSelectedReviewItem(item)
    setSubmitError('')
  }

  const handleCloseReview = () => {
    setSelectedReviewItem(null)
    setSubmitError('')
  }

  const handleSubmitReview = async ({ rating, content }) => {
    if (!order || !selectedReviewItem || !currentUser?.id) {
      setSubmitError('Không thể tạo đánh giá cho sản phẩm này.')
      return
    }

    setIsSubmittingReview(true)

    try {
      await reviewService.createReview({
        orderItemId: selectedReviewItem.orderItemId,
        rating,
        content,
      })
      setReviewedOrderItemIds((current) => [...new Set([...current, String(selectedReviewItem.orderItemId)])])
      setFeedbackMessage(`Bạn đã đánh giá sản phẩm "${selectedReviewItem.product?.name || 'đã mua'}" thành công.`)
      handleCloseReview()
    } catch (error) {
      setSubmitError(error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleContactShop = async () => {
    const firstOrderItem = order?.items?.[0]
    const firstProduct = firstOrderItem?.product

    if (!order || !currentUser?.id || !firstProduct) {
      return
    }

    try {
      const response = await conversationService.createConversation({
        storeId: firstProduct.storeId,
        orderId: order.id,
      })
      navigate(`/messages/${encodeURIComponent(response.data.id)}`)
    } catch (error) {
      setFeedbackMessage(error.message || 'Không thể mở cuộc trò chuyện với shop.')
    }
  }

  const orderItems = useMemo(() => order?.items || [], [order])
  const firstProduct = orderItems[0]?.product
  const shopName = firstProduct?.storeName || 'TechToShop Mall'
  const statusMeta = statusMetaMap[order?.status] || statusMetaMap[ORDER_STATUS.PENDING]
  const reviewableItem = useMemo(
    () => orderItems.find((item) => !reviewedOrderItemIds.includes(String(item.orderItemId))),
    [orderItems, reviewedOrderItemIds],
  )

  const shopInitials = shopName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-3 py-10">
        <Card className="px-6 py-12 text-center text-sm text-[#5b403b]">Đang tải chi tiết đơn hàng...</Card>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-3 py-10">
        <Card className="px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-[#1b1c1c]">Không tìm thấy đơn hàng</h1>
          <p className="mt-3 text-sm text-[#5b403b]">
            {errorMessage || 'Đơn hàng có thể không tồn tại hoặc bạn không có quyền xem đơn hàng này.'}
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-lg bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d64124]"
          >
            Quay lại lịch sử đơn hàng
          </Link>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto grid w-full max-w-[1200px] gap-3 px-3 py-6">
      <nav className="flex items-center gap-2 text-sm text-[#8f7069]">
        <Link to="/" className="hover:text-[#ee4d2d]">
          TechToShop
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/orders" className="hover:text-[#ee4d2d]">
          Lịch sử đơn hàng
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="truncate text-[#1b1c1c]">Chi tiết #{order.id}</span>
      </nav>

      <Card className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c]">Đơn hàng #{order.id}</h1>
          <p className="mt-2 text-sm text-[#8f7069]">Đặt lúc: {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${statusMeta.badgeClass}`}>
          <span className="material-symbols-outlined text-[18px]">{statusMeta.icon}</span>
          {statusMeta.label}
        </span>
      </Card>

      <Card className="p-4">
        <h2 className="mb-5 text-lg font-semibold text-[#1b1c1c]">Tiến trình đơn hàng</h2>
        <OrderTimeline status={order.status} />
      </Card>

      {feedbackMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedbackMessage}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_380px]">
        <div className="space-y-3">
          <Card className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff1ec] font-bold text-[#ee4d2d]">
                {shopInitials || 'TS'}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-[#1b1c1c]">{shopName}</h2>
                <p className="text-xs text-[#8f7069]">Mall</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleContactShop}
              className="inline-flex shrink-0 items-center gap-1 rounded border border-[#ee4d2d] px-3 py-2 text-sm font-medium text-[#ee4d2d] transition hover:bg-[#fff1ec]"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              Nhắn tin shop
            </button>
          </Card>

          <OrderItemList
            items={order.items}
            renderExtra={(item) => {
              const hasReviewed = reviewedOrderItemIds.includes(String(item.orderItemId))

              if (order.status !== ORDER_STATUS.COMPLETED) {
                return null
              }

              if (hasReviewed) {
                return (
                  <div className="flex flex-wrap items-center gap-3 bg-[#f6fbf8] px-4 py-3">
                    <ReviewStatusBadge reviewed />
                    <p className="text-sm text-[#5b403b]">Sản phẩm này đã được bạn đánh giá.</p>
                  </div>
                )
              }

              return (
                <div className="flex flex-wrap items-center gap-3 bg-[#fff8f6] px-4 py-3">
                  <ReviewStatusBadge reviewed={false} />
                  <button
                    type="button"
                    onClick={() => handleOpenReview(item)}
                    className="rounded bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211]"
                  >
                    Đánh giá
                  </button>
                </div>
              )
            }}
          />
        </div>

        <div className="space-y-3">
          <OrderSummaryBox order={order} />

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/products"
              className="rounded-lg border border-[#8f7069] bg-white px-4 py-3 text-center text-sm font-medium text-[#1b1c1c] transition hover:bg-[#f5f3f3]"
            >
              Mua lại
            </Link>

            {order.status === ORDER_STATUS.PENDING ? (
              <button
                type="button"
                onClick={handleCancelOrder}
                className="rounded-lg bg-[#ee4d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d64124]"
              >
                Hủy đơn
              </button>
            ) : order.status === ORDER_STATUS.COMPLETED ? (
              <button
                type="button"
                disabled={!reviewableItem}
                onClick={() => {
                  if (reviewableItem) {
                    handleOpenReview(reviewableItem)
                  }
                }}
                className="rounded-lg bg-[#ee4d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d64124] disabled:cursor-not-allowed disabled:bg-[#e8e8e8] disabled:text-[#8f7069]"
              >
                {reviewableItem ? 'Đánh giá' : 'Đã đánh giá'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContactShop}
                className="rounded-lg bg-[#ee4d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d64124]"
              >
                Liên hệ shop
              </button>
            )}
          </div>
        </div>
      </div>

      <ReviewModal
        item={selectedReviewItem}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmittingReview}
        submitError={submitError}
      />
    </section>
  )
}
