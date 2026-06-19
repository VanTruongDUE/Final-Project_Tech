import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

export default function CartItem({ item, product, onQuantityChange, onRemove, onToggleSelected }) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity <= 0
  const canIncrease = !isOutOfStock && item.quantity < product.stockQuantity
  const itemTotal = product.price * item.quantity

  return (
    <article className="group rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[24px_96px_1fr]">
        <div className="pt-1">
          <input
            type="checkbox"
            checked={item.selected !== false}
            onChange={(event) => onToggleSelected(product.id, event.target.checked)}
            className="h-5 w-5 rounded border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]"
            aria-label={`Chọn sản phẩm ${product.name}`}
          />
        </div>

        <Link
          to={`/products/${product.id}`}
          className="block h-24 w-24 overflow-hidden rounded-lg border border-[#e3e2e2] bg-[#f5f3f3]"
        >
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </Link>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <Link
                to={`/products/${product.id}`}
                className="line-clamp-2 text-base font-semibold text-[#1b1c1c] hover:text-[#ee4d2d]"
              >
                {product.name}
              </Link>
              <p className="mt-2 text-sm text-[#5b403b]">{product.storeName}</p>
              <p className="mt-1 text-[12px] text-[#8f7069]">Phân loại: Mặc định</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-[#d0011b]">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price ? (
                  <span className="text-[12px] text-[#8f7069] line-through">{formatCurrency(product.originalPrice)}</span>
                ) : null}
              </div>
              {isOutOfStock ? (
                <p className="mt-2 text-sm text-[#ba1a1a]">Sản phẩm tạm hết hàng.</p>
              ) : null}
              {!isOutOfStock && item.quantity >= product.stockQuantity ? (
                <p className="mt-2 text-sm text-[#8f7069]">Bạn đã chọn tối đa tồn kho hiện có.</p>
              ) : null}
            </div>

            <div className="text-left lg:min-w-[180px] lg:text-right">
              <p className="text-sm text-[#8f7069]">Thành tiền</p>
              <p className="mt-1 text-xl font-bold text-[#d0011b]">{formatCurrency(itemTotal)}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex h-8 w-28 overflow-hidden rounded-md border border-[#e3beb6] bg-white">
              <button
                type="button"
                onClick={() => onQuantityChange(product.id, item.quantity - 1)}
                className="grid h-full w-8 place-items-center text-[#5b403b] transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:text-[#8f7069]"
                disabled={item.quantity <= 1}
                aria-label="Giảm số lượng"
              >
                -
              </button>
              <span className="grid h-full flex-1 place-items-center border-x border-[#e3beb6] text-sm font-medium">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(product.id, item.quantity + 1)}
                className="grid h-full w-8 place-items-center text-[#5b403b] transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:text-[#8f7069]"
                disabled={!canIncrease}
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="flex items-center gap-1 text-sm text-[#8f7069] transition hover:text-[#ba1a1a] lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                delete
              </span>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
