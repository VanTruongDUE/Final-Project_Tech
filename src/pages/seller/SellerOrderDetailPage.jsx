import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

const statusActions = {
  PENDING: [
    { nextStatus: 'CONFIRMED', label: 'Xác nhận đơn hàng', icon: 'check_circle' },
    { nextStatus: 'CANCELLED', label: 'Hủy đơn hàng', icon: 'cancel' },
  ],
  CONFIRMED: [{ nextStatus: 'PROCESSING', label: 'Chuyển sang xử lý', icon: 'inventory' }],
  PROCESSING: [{ nextStatus: 'PACKING', label: 'Chuyển sang đóng gói', icon: 'inventory_2' }],
  PACKING: [{ nextStatus: 'SHIPPING', label: 'Chuyển sang giao hàng', icon: 'local_shipping' }],
  SHIPPING: [{ nextStatus: 'COMPLETED', label: 'Hoàn thành đơn hàng', icon: 'task_alt' }],
}

function formatHistoryTime(value) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export default function SellerOrderDetailPage() {
  const { orderId = '' } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [, setVersion] = useState(0)
  const decodedOrderId = decodeURIComponent(orderId)
  const orderResponse = sellerService.getSellerOrderById(currentUser, decodedOrderId)

  const handleStatusChange = (nextStatus, label) => {
    const confirmed = window.confirm(`${label} cho đơn ${decodedOrderId}?`)

    if (!confirmed) {
      return
    }

    const response = sellerService.updateSellerOrderStatus(currentUser, decodedOrderId, nextStatus)

    if (!response.success) {
      window.alert(response.message || 'Không thể cập nhật trạng thái đơn hàng.')
      return
    }

    setVersion((currentVersion) => currentVersion + 1)
  }

  if (!orderResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-[#1b1c1c]">Không tìm thấy đơn hàng</h1>
          <p className="mt-2 text-sm text-[#5b403b]">{orderResponse.message}</p>
          <Link to="/seller/orders" className="mt-5 inline-flex h-10 items-center rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white">
            Quay lại danh sách
          </Link>
        </div>
      </section>
    )
  }

  const order = orderResponse.data
  const availableActions = statusActions[order.status] || []
  const progressIndex = Math.max(0, order.timeline.findIndex((step) => step.state === 'current'))
  const progressWidth = order.status === 'CANCELLED' ? 100 : (progressIndex / Math.max(order.timeline.length - 1, 1)) * 100

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#fbf9f9] p-4 md:p-6 xl:pr-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 border-b border-[#e3e2e2] pb-4 md:flex-row md:items-end">
          <div>
            <nav className="mb-2 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
              <Link to="/seller/orders" className="transition hover:text-[#b22204]">
                Đơn hàng
              </Link>
              <SellerIcon name="chevron_right" className="text-[16px]" />
              <span className="text-[#1b1c1c]">Chi tiết</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Đơn hàng {order.id}</h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${order.statusMeta.className}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {order.statusMeta.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#5b403b]">
              Đặt lúc: {order.dateMeta.date}, {order.dateMeta.time}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.alert('Nhắn tin khách hàng hiện dùng luồng tin nhắn mock riêng của Buyer/Seller.')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#b22204] bg-white px-4 text-sm font-semibold text-[#b22204] transition hover:bg-[#fff1ec]"
            >
              <SellerIcon name="chat" className="text-[18px]" />
              Nhắn tin khách hàng
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/orders')}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b22204] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63c1e]"
            >
              <SellerIcon name="arrow_back" className="text-[18px]" />
              Về danh sách
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-[#1b1c1c]">Tiến trình xử lý</h2>
              <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-2">
                <div className="absolute left-4 right-4 top-4 h-[2px] bg-[#e3e2e2]" />
                <div className="absolute left-4 top-4 h-[2px] bg-[#b22204] transition-all" style={{ width: `calc(${progressWidth}% - 2rem)` }} />
                {order.timeline.map((step) => (
                  <div key={step.status} className="relative z-10 flex min-w-[86px] flex-col items-center gap-2 text-center">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-full ring-4 ring-white ${
                        step.state === 'done'
                          ? 'bg-[#b22204] text-white'
                          : step.state === 'current'
                            ? order.status === 'CANCELLED'
                              ? 'border-2 border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]'
                              : 'border-2 border-[#b22204] bg-[#ffdad3] text-[#b22204]'
                            : 'bg-[#e3e2e2] text-[#8f7069]'
                      }`}
                    >
                      <SellerIcon name={step.state === 'done' ? 'check' : step.icon} className="text-[16px]" />
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
                <h2 className="text-xl font-semibold text-[#1b1c1c]">Sản phẩm ({order.items.length})</h2>
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
                      <tr key={`${item.productId}-${item.productName}`} className="hover:bg-[#fbf9f9]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-[#e3e2e2] bg-[#f5f3f3]">
                              <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
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
              <h2 className="mb-4 text-xl font-semibold text-[#1b1c1c]">Lịch sử đơn hàng</h2>
              <div className="space-y-4">
                {order.history.map((item) => (
                  <div key={`${item.status}-${item.time}`} className="flex gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ffdad3] text-[#b22204]">
                      <SellerIcon name={item.icon} className="text-[16px]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1b1c1c]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[#8f7069]">{formatHistoryTime(item.time)}</p>
                      <p className="mt-1 text-sm text-[#5b403b]">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
                <SellerIcon name="edit_document" className="text-[22px] text-[#b22204]" />
                Cập nhật trạng thái
              </h2>
              {availableActions.length ? (
                <div className="space-y-2">
                  {availableActions.map((action) => (
                    <button
                      key={action.nextStatus}
                      type="button"
                      onClick={() => handleStatusChange(action.nextStatus, action.label)}
                      className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                        action.nextStatus === 'CANCELLED'
                          ? 'border border-[#ba1a1a] bg-white text-[#ba1a1a] hover:bg-[#ffdad6]'
                          : 'bg-[#ee4d2d] text-white hover:bg-[#d63c1e]'
                      }`}
                    >
                      <SellerIcon name={action.icon} className="text-[18px]" />
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-[#f5f3f3] p-3 text-sm text-[#5b403b]">Đơn hàng đã ở trạng thái cuối, không còn thao tác cập nhật.</p>
              )}
            </section>

            <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">
                <SellerIcon name="person" className="text-[22px] text-[#b22204]" />
                Khách hàng
              </h2>
              <div className="space-y-3 text-sm text-[#1b1c1c]">
                <div className="flex items-start gap-3">
                  <SellerIcon name="badge" className="mt-0.5 text-[20px] text-[#8f7069]" />
                  <div>
                    <p className="font-semibold">{order.customer.name}</p>
                    <p className="text-xs text-[#8f7069]">{order.customer.tier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SellerIcon name="call" className="text-[20px] text-[#8f7069]" />
                  <p>{order.customer.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <SellerIcon name="location_on" className="mt-0.5 text-[20px] text-[#8f7069]" />
                  <p className="leading-6">{order.customer.address}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
                <SellerIcon name="receipt_long" className="text-[22px] text-[#b22204]" />
                Thanh toán
              </h2>
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
