import { useMemo, useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'
import { ORDER_STATUS } from '../../services/orderService'
import OrderStatusBadge from './OrderStatusBadge'

const paymentMethodLabels = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
}

const shippingMethodLabels = {
  STANDARD: 'Giao hàng tiêu chuẩn',
  EXPRESS: 'Giao hàng hỏa tốc',
}

const formatDateTime = (value) => {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const getStatusDescription = (status) => {
  if (status === ORDER_STATUS.CANCELLED) {
    return 'Đơn hàng đã được hủy và không còn tiếp tục xử lý.'
  }

  if (status === ORDER_STATUS.COMPLETED) {
    return 'Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm tại TechToShop.'
  }

  if (status === ORDER_STATUS.SHIPPING) {
    return 'Đơn hàng đang được giao đến địa chỉ nhận hàng của bạn.'
  }

  if (status === ORDER_STATUS.CONFIRMED) {
    return 'Người bán đã xác nhận đơn hàng và đang chuẩn bị đóng gói.'
  }

  return 'Đơn hàng đang chờ người bán xác nhận.'
}

export default function OrderCard({ order, onCancel }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const firstItems = useMemo(() => order.items.slice(0, 2), [order.items])
  const hiddenItemsCount = Math.max(0, order.items.length - firstItems.length)
  const totalQuantity = useMemo(
    () => order.items.reduce((total, item) => total + item.quantity, 0),
    [order.items],
  )
  const primaryStoreName = order.items[0]?.product?.storeName || 'TechToShop Mall'

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-[#faf7f6] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff1ec] text-lg text-[#ee4d2d]">
            🏬
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1b1c1c]">{primaryStoreName}</p>
            <p className="text-xs text-[#8f7069]">
              Mã đơn hàng: <span className="font-medium text-[#5b403b]">{order.id}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-[#8f7069]">{formatDateTime(order.createdAt)}</p>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {firstItems.map((item) => {
          const product = item.product

          return (
            <div key={`${order.id}-${item.productId}`} className="flex gap-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f5f3f3]">
                {product?.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl text-[#c7b7b2]">📦</div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold text-[#1b1c1c]">
                    {product?.name || 'Sản phẩm không còn khả dụng'}
                  </h3>
                  <p className="mt-1 text-sm text-[#8f7069]">
                    {product?.category || 'Đơn hàng mua sắm'} • SL: {item.quantity}
                  </p>
                  <p className="mt-1 text-sm text-[#8f7069]">{product?.location || 'Toàn quốc'}</p>
                </div>
                <p className="text-right text-base font-bold text-[#ee4d2d]">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          )
        })}

        {hiddenItemsCount > 0 ? (
          <p className="rounded-xl bg-[#fff8f6] px-4 py-3 text-sm text-[#8f7069]">
            Và {hiddenItemsCount} sản phẩm khác trong đơn hàng này.
          </p>
        ) : null}
      </div>

      <div className="border-t border-[#e5e7eb] bg-[#fcfbfb] px-5 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-sm text-[#5b403b]">
            <p>{getStatusDescription(order.status)}</p>
            <p>
              {totalQuantity} sản phẩm • {shippingMethodLabels[order.shippingMethod] || order.shippingMethod} •{' '}
              {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-[#8f7069]">Tổng thanh toán</p>
              <p className="text-xl font-bold text-[#ee4d2d]">{formatCurrency(order.totalAmount)}</p>
            </div>

            {order.status === ORDER_STATUS.PENDING ? (
              <button
                type="button"
                onClick={() => onCancel(order.id)}
                className="rounded-xl border border-[#d8d3d2] bg-white px-4 py-2 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
              >
                Hủy đơn
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="rounded-xl border border-[#ee4d2d] bg-white px-4 py-2 text-sm font-semibold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
            >
              {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
            </button>
          </div>
        </div>

        {isExpanded ? (
          <div className="mt-4 grid gap-4 rounded-2xl border border-[#f0e5e1] bg-white p-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7069]">Người nhận</p>
              <p className="mt-2 text-sm font-semibold text-[#1b1c1c]">{order.customerInfo.fullName || '--'}</p>
              <p className="mt-1 text-sm text-[#5b403b]">{order.customerInfo.phone || '--'}</p>
              <p className="mt-1 text-sm text-[#5b403b]">{order.customerInfo.email || 'Chưa cung cấp email'}</p>
              <p className="mt-1 text-sm text-[#5b403b]">{order.customerInfo.address || '--'}</p>
              {order.customerInfo.note ? (
                <p className="mt-2 text-sm text-[#8f7069]">Ghi chú: {order.customerInfo.note}</p>
              ) : null}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7069]">Chi tiết thanh toán</p>
              <div className="mt-2 space-y-2 text-sm text-[#5b403b]">
                <div className="flex items-center justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Giảm giá</span>
                  <span>{formatCurrency(order.discountAmount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#f0e5e1] pt-2 font-semibold text-[#1b1c1c]">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}
