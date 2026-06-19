import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

function StarRow({ rating }) {
  const fullStars = Math.max(1, Math.round(rating))

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-[#ee4d2d]">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="text-[14px] leading-none">
            {index < fullStars ? '★' : '☆'}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ProductCard({ product, variant = 'compact' }) {
  const isHomeCard = variant === 'home'

  const handleMockAddToCart = (event) => {
    event.preventDefault()
    event.stopPropagation()
    window.alert(`Đã thêm tạm thời sản phẩm "${product.name}" vào giỏ hàng mock.`)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#e3e2e2] bg-white transition-shadow duration-300 hover:shadow-md">
      <Link to={`/products/${product.id}`} className="relative block">
        <div className={`relative aspect-square overflow-hidden ${isHomeCard ? 'bg-white p-5' : 'bg-[#f5f3f3]'}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full transition duration-500 group-hover:scale-105 ${isHomeCard ? 'object-contain' : 'object-cover'}`}
          />

          {product.discountPercent > 0 ? (
            <span className="absolute left-2 top-2 rounded-full bg-[#ee4d2d] px-2 py-1 text-[10px] font-bold text-white">
              -{product.discountPercent}%
            </span>
          ) : null}

          {isHomeCard ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-[#8f7069] opacity-0 shadow-sm transition duration-200 group-hover:opacity-100"
              aria-label={`Yêu thích ${product.name}`}
            >
              ♥
            </button>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {isHomeCard ? (
          <p className="mb-1 text-[12px] text-[#8f7069]">{product.storeName}</p>
        ) : null}

        <Link to={`/products/${product.id}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm leading-5 text-[#1b1c1c] transition-colors group-hover:text-[#ee4d2d]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <StarRow rating={product.rating} />
          <span className="text-[12px] text-[#8f7069]">
            {isHomeCard ? `(${product.reviewCount})` : `${product.rating} (${product.reviewCount})`}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-[20px] font-semibold leading-none text-[#d0011b]">{formatCurrency(product.price)}</p>
          {product.originalPrice > product.price ? (
            <p className="mt-1 text-[12px] text-[#8f7069] line-through">{formatCurrency(product.originalPrice)}</p>
          ) : null}
        </div>

        {isHomeCard ? (
          <button
            type="button"
            onClick={handleMockAddToCart}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded bg-[#ee4d2d] text-sm font-semibold text-white transition hover:bg-[#d73211]"
          >
            <span aria-hidden="true">🛒</span>
            Thêm vào giỏ
          </button>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1 text-[12px] text-[#8f7069]">
              <span className="text-[13px]">🏬</span>
              <span className="truncate">{product.storeName}</span>
            </span>
            <button
              type="button"
              onClick={handleMockAddToCart}
              className="grid h-9 w-9 shrink-0 place-items-center rounded border border-[#e3e2e2] bg-[#fbf9f9] text-[#ee4d2d] transition group-hover:border-[#ee4d2d] group-hover:bg-[#ee4d2d] group-hover:text-white"
              title="Thêm vào giỏ"
              aria-label={`Thêm ${product.name} vào giỏ hàng`}
            >
              🛒
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
