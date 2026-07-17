import { formatCurrency } from '../../utils/formatCurrency'

export default function CartSummary({
  itemTypeCount,
  totalQuantity,
  subtotal,
  discount = 0,
  onCheckout,
  onClearCart,
}) {
  const total = subtotal - discount

  return (
    <aside className="h-fit rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm lg:sticky lg:top-20">
      <h2 className="text-xl font-bold text-[#1b1c1c]">Tóm tắt đơn hàng</h2>

      <div className="mt-5 space-y-4 text-sm text-[#5b403b]">
        <div className="flex items-center justify-between">
          <span>Tạm tính ({totalQuantity} sản phẩm)</span>
          <span className="font-medium text-[#1b1c1c]">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Giảm giá sản phẩm</span>
          <span className="font-medium text-[#22c55e]">-{formatCurrency(discount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phí vận chuyển</span>
          <span className="font-medium text-[#1b1c1c]">Chưa tính</span>
        </div>
        <div className="border-t border-[#e3e2e2] pt-4">
          <div className="flex items-end justify-between gap-3">
            <span className="text-base font-semibold text-[#1b1c1c]">Tổng tiền:</span>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#d0011b]">{formatCurrency(total)}</p>
              <p className="mt-1 text-[12px] text-[#8f7069]">({itemTypeCount} loại sản phẩm đã chọn)</p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#d04326]"
      >
        Thanh toán
        <span>→</span>
      </button>

      <button
        type="button"
        onClick={onClearCart}
        className="mt-3 w-full rounded border border-[#e3beb6] px-5 py-3 text-sm font-semibold text-[#5b403b] transition hover:bg-[#fff1ec] hover:text-[#ee4d2d]"
      >
        Xóa toàn bộ giỏ hàng
      </button>

      <p className="mt-4 text-center text-[12px] text-[#8f7069]">Thanh toán an toàn và bảo mật</p>
    </aside>
  )
}
