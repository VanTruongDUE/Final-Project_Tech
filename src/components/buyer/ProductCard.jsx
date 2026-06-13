import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

export default function ProductCard({ product, variant = 'compact' }) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK'
  const isHomeCard = variant === 'home'
  const statusLabel = isOutOfStock ? 'Hết hàng' : 'Đang mở bán'

  const handleMockAddToCart = (event) => {
    event.preventDefault()
    event.stopPropagation()

    window.alert(`Đã thêm tạm thời sản phẩm "${product.name}" vào giỏ hàng mock.`)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e3beb6]/70 bg-white transition duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f5f3f3]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {product.discountPercent > 0 ? (
            <span className="absolute left-2 top-2 rounded-full bg-[#d0011b] px-2 py-1 text-[11px] font-semibold text-white">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#1b1c1c] transition group-hover:text-[#ee4d2d]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-xs text-[#8f7069]">
          <span className="text-[#ff9f8a]">★</span>
          <span>{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-3">
          <span className="text-xl font-semibold leading-none text-[#d0011b]">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <span className="mt-1 block text-xs text-[#8f7069] line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${
              isOutOfStock ? 'bg-[#f5f3f3] text-[#8f7069]' : 'bg-[#fff1ec] text-[#ee4d2d]'
            }`}
          >
            {statusLabel}
          </span>
          <span className="text-[11px] text-[#8f7069]">Đã bán {product.soldQuantity}</span>
        </div>

        <div className="mt-3">
          {isHomeCard ? (
            <button
              type="button"
              onClick={handleMockAddToCart}
              className="flex h-10 w-full items-center justify-center gap-2 rounded bg-[#ee4d2d] text-sm font-semibold text-white transition hover:bg-[#d73211]"
            >
              <span aria-hidden="true">+</span>
              Thêm vào giỏ
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 text-xs text-[#5b403b]">
              <span className="truncate text-[#8f7069]">{product.storeName}</span>
              <button
                type="button"
                onClick={handleMockAddToCart}
                className="grid h-9 w-9 shrink-0 place-items-center rounded border border-[#e3beb6] bg-[#fbf9f9] text-[#ee4d2d] transition hover:border-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white"
                aria-label={`Thêm ${product.name} vào giỏ hàng`}
                title="Thêm vào giỏ"
              >
                +
              </button>
            </div>
          )}
        </div>

        {!isHomeCard ? <p className="mt-2 text-[11px] text-[#8f7069]">{product.location}</p> : null}
      </div>
    </article>
  )
}
