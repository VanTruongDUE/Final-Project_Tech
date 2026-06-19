import { formatCurrency } from '../../utils/formatCurrency'

export default function CheckoutOrderSummary({
  checkoutItems,
  subtotal,
  shippingFee,
  total,
  voucherCode,
  voucherMessage,
  onVoucherChange,
  onApplyVoucher,
  onPlaceOrder,
}) {
  return (
    <aside className="sticky top-24 flex flex-col gap-6 rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
      <h2 className="border-b border-[#e3e2e2] pb-4 text-xl font-semibold text-[#1b1c1c]">
        Đơn hàng của bạn ({checkoutItems.length} sản phẩm)
      </h2>

      <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
        {checkoutItems.map((item, index) => {
          const product = item.product
          if (!product) {
            return null
          }

          const itemTotal = (product.price || 0) * item.quantity

          return (
            <div key={`${item.productId}-${index}`} className="flex gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[#e3e2e2] bg-[#f5f3f3]">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-2 text-sm font-semibold text-[#1b1c1c]">{product.name}</h3>
                  <p className="mt-1 text-sm text-[#8f7069]">{product.storeName}</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[#5b403b]">SL: {item.quantity}</span>
                  <span className="font-semibold text-[#1b1c1c]">{formatCurrency(itemTotal)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 border-y border-[#e3e2e2] py-4">
        <input
          type="text"
          value={voucherCode}
          onChange={(event) => onVoucherChange(event.target.value)}
          placeholder="Nhập mã giảm giá"
          className="h-10 flex-1 rounded border border-[#e3beb6] px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
        />
        <button
          type="button"
          onClick={onApplyVoucher}
          className="h-10 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white transition hover:bg-[#d73211]"
        >
          Áp dụng
        </button>
      </div>

      {voucherMessage ? (
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {voucherMessage}
        </p>
      ) : null}

      <div className="space-y-3 text-sm text-[#5b403b]">
        <div className="flex items-center justify-between">
          <span>Tạm tính</span>
          <span className="font-medium text-[#1b1c1c]">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phí vận chuyển</span>
          <span className="font-medium text-[#1b1c1c]">{formatCurrency(shippingFee)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Giảm giá</span>
          <span className="font-medium text-[#1b1c1c]">0đ</span>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-[#e3e2e2] pt-4">
        <span className="text-xl font-semibold text-[#1b1c1c]">Tổng cộng</span>
        <div className="text-right">
          <span className="block text-3xl font-bold tracking-tight text-[#ee4d2d]">{formatCurrency(total)}</span>
          <span className="mt-1 block text-xs text-[#8f7069]">(Đã bao gồm VAT)</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        className="flex h-10 w-full items-center justify-center gap-2 rounded bg-[#ee4d2d] px-4 text-sm font-bold text-white transition hover:bg-[#d73211]"
      >
        Đặt hàng
        <span aria-hidden="true">→</span>
      </button>
    </aside>
  )
}
