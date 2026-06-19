import { formatCurrency } from '../../utils/formatCurrency'

const paymentMethodLabels = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
}

const shippingMethodLabels = {
  STANDARD: 'Giao hàng tiêu chuẩn',
  EXPRESS: 'Giao hàng hỏa tốc',
}

function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2 border-b border-[#e8e8e8] bg-[#f5f3f3] px-4 py-3 text-base font-semibold uppercase tracking-[0.04em] text-[#1b1c1c]">
      <span className="material-symbols-outlined text-[19px] text-[#ee4d2d]">{icon}</span>
      {children}
    </h2>
  )
}

export default function OrderSummaryBox({ order }) {
  return (
    <aside className="space-y-4">
      <section className="border border-[#e8e8e8] bg-white">
        <SectionTitle icon="location_on">Địa chỉ nhận hàng</SectionTitle>
        <div className="space-y-1 px-4 py-4 text-sm text-[#5b403b]">
          <p className="font-semibold text-[#1b1c1c]">{order.customerInfo.fullName || '--'}</p>
          <p>{order.customerInfo.phone || '--'}</p>
          <p>{order.customerInfo.email || 'Chưa cung cấp email'}</p>
          <p className="leading-6">{order.customerInfo.address || '--'}</p>
          {order.customerInfo.note ? <p className="pt-1">Ghi chú: {order.customerInfo.note}</p> : null}
        </div>
      </section>

      <section className="border border-[#e8e8e8] bg-white">
        <SectionTitle icon="receipt_long">Tóm tắt thanh toán</SectionTitle>

        <div className="space-y-3 px-4 py-4 text-sm text-[#5b403b]">
          <div className="flex items-center justify-between gap-4">
            <span>Tạm tính</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Giảm giá</span>
            <span className="text-[#ee4d2d]">- {formatCurrency(order.discountAmount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Phương thức vận chuyển</span>
            <span className="text-right">{shippingMethodLabels[order.shippingMethod] || order.shippingMethod}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Thanh toán</span>
            <span className="text-right">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</span>
          </div>
          <div className="border-t border-[#e8e8e8] pt-4">
            <div className="flex items-end justify-between gap-4">
              <span className="text-base font-semibold text-[#1b1c1c]">Tổng tiền</span>
              <span className="text-2xl font-bold text-[#ee4d2d]">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </section>
    </aside>
  )
}
