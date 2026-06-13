import { Link } from 'react-router-dom'

export default function ProductShopInfo({ product }) {
  return (
    <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ee4d2d] text-white">
          <span className="text-lg font-bold">
            {product.storeName
              .split(' ')
              .slice(0, 2)
              .map((word) => word[0])
              .join('')}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1b1c1c]">{product.storeName}</h2>
          <p className="mt-1 text-sm text-emerald-600">Đang hoạt động</p>
          <p className="mt-1 text-xs text-[#8f7069]">{product.location}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 divide-x divide-[#e3e2e2] border-y border-[#e3e2e2] py-4 text-center">
        <div>
          <p className="text-xl font-bold text-[#1b1c1c]">{product.rating}</p>
          <p className="text-xs text-[#5b403b]">Đánh giá Shop</p>
        </div>
        <div>
          <p className="text-xl font-bold text-[#1b1c1c]">{product.soldQuantity}+</p>
          <p className="text-xs text-[#5b403b]">Sản phẩm bán</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="rounded-lg border border-[#ee4d2d] px-4 py-2 text-center text-sm font-semibold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
        >
          Xem Shop
        </Link>
        <button
          type="button"
          className="rounded-lg border border-[#e3e2e2] px-4 py-2 text-sm font-semibold text-[#1b1c1c] transition hover:bg-[#f5f3f3]"
        >
          Nhắn tin
        </button>
      </div>
    </section>
  )
}
