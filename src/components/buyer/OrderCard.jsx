import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import { ORDER_STATUS } from '../../services/orderService'

const statusPresentation = {
  [ORDER_STATUS.PENDING]: {
    label: 'CHỜ THANH TOÁN',
    message: 'Đơn hàng đang chờ xác nhận và thanh toán.',
    tone: 'text-[#ee4d2d]',
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'ĐANG CHUẨN BỊ HÀNG',
    message: 'Người bán đang chuẩn bị hàng cho đơn của bạn.',
    tone: 'text-[#b45309]',
  },
  [ORDER_STATUS.SHIPPING]: {
    label: 'ĐANG GIAO',
    message: 'Đơn hàng đang giao đến bạn',
    tone: 'text-[#26aa99]',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'HOÀN THÀNH',
    message: 'Đơn hàng đã được giao thành công',
    tone: 'text-[#26aa99]',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'ĐÃ HỦY',
    message: 'Đơn hàng đã được hủy',
    tone: 'text-[#8f7069]',
  },
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h16l-1-5H5l-1 5z" />
      <path d="M5 10v9h14v-9" />
      <path d="M9 19v-5h6v5" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.5-5A8 8 0 1 1 21 12z" />
    </svg>
  )
}

function ShippingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </svg>
  )
}

function formatDate(value) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export default function OrderCard({ order, onCancel }) {
  const firstItem = order.items[0]
  const primaryStoreName = firstItem?.product?.storeName || 'TechToShop Mall'
  const statusMeta = statusPresentation[order.status] || statusPresentation[ORDER_STATUS.PENDING]
  const canCancel = order.status === ORDER_STATUS.PENDING
  const canReview = order.status === ORDER_STATUS.COMPLETED

  return (
    <article className="overflow-hidden rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#e8e8e8] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1b1c1c]">
            <span className="text-[#ee4d2d]">
              <StoreIcon />
            </span>
            <span>{primaryStoreName}</span>
          </div>
          <Link
            to="/messages"
            className="inline-flex items-center gap-1 rounded border border-[#e8e8e8] px-2 py-1 text-xs font-medium text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#ee4d2d]"
          >
            <ChatIcon />
            Chat
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase">
          <span className={`inline-flex items-center gap-1 ${statusMeta.tone}`}>
            <ShippingIcon />
            {statusMeta.message}
          </span>
          <span className="hidden text-[#e3e2e2] md:inline">|</span>
          <span className={statusMeta.tone}>{statusMeta.label}</span>
        </div>
      </div>

      <Link to={`/orders/${encodeURIComponent(order.id)}`} className="block divide-y divide-[#e8e8e8]">
        {order.items.map((item) => {
          const product = item.product

          return (
            <div key={`${order.id}-${item.productId}`} className="flex gap-4 p-4 transition hover:bg-[#fafafa]">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded border border-[#e8e8e8] bg-[#f5f5f5]">
                {product?.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[#f5f3f3]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium text-[#1b1c1c]">{product?.name || 'Sản phẩm không còn khả dụng'}</h3>
                <p className="mt-1 text-xs text-[#8f7069]">Phân loại: {product?.category || 'Đơn hàng mua sắm'}</p>
                <p className="mt-2 text-sm text-[#5b403b]">x{item.quantity}</p>
              </div>
              <div className="shrink-0 text-right text-sm font-medium text-[#ee4d2d]">
                {formatCurrency(item.price)}
              </div>
            </div>
          )
        })}
      </Link>

      <div className="border-t border-[#e8e8e8] bg-[#fffaf7] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#5b403b]">
            Mã đơn: <span className="font-medium text-[#1b1c1c]">{order.id}</span> · Ngày đặt: {formatDate(order.createdAt)}
          </p>
          <div className="text-right">
            <span className="text-sm text-[#5b403b]">Thành tiền: </span>
            <span className="text-2xl font-bold text-[#ee4d2d]">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {canCancel ? (
            <button
              type="button"
              onClick={() => onCancel(order.id)}
              className="rounded border border-[#e8e8e8] bg-white px-5 py-2 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
            >
              Hủy đơn
            </button>
          ) : null}

          {canReview ? (
            <Link
              to={`/orders/${encodeURIComponent(order.id)}`}
              className="rounded bg-[#ee4d2d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211]"
            >
              Đánh giá
            </Link>
          ) : (
            <Link
              to="/products"
              className="rounded border border-[#ee4d2d] bg-white px-5 py-2 text-sm font-semibold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
            >
              Mua Lại
            </Link>
          )}

          <Link
            to="/messages"
            className="rounded border border-[#e8e8e8] bg-white px-5 py-2 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
          >
            Liên hệ Người bán
          </Link>

          <Link
            to={`/orders/${encodeURIComponent(order.id)}`}
            className="rounded border border-[#e8e8e8] bg-white px-5 py-2 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
          >
            Xem Chi Tiết Đơn Hàng
          </Link>
        </div>
      </div>
    </article>
  )
}
