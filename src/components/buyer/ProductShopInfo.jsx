import { Link } from 'react-router-dom'

export default function ProductShopInfo({ product, onMessageShop, variant = 'band' }) {
  const initials = product.storeName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  if (variant === 'sidebar') {
    return (
      <section className="rounded-lg border border-[#e8e8e8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#ee4d2d] text-white">
            <span className="material-symbols-outlined">storefront</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1b1c1c]">{product.storeName}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Đang hoạt động
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-[#e8e8e8] py-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#1b1c1c]">{product.rating}</p>
            <p className="text-xs text-[#8f7069]">Đánh giá Shop</p>
          </div>
          <div className="border-l border-[#e8e8e8]">
            <p className="text-2xl font-bold text-[#1b1c1c]">{Math.max(15, Math.round(product.soldQuantity / 100))}k+</p>
            <p className="text-xs text-[#8f7069]">Sản phẩm bán</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="rounded border border-[#ee4d2d] px-4 py-2 text-center text-sm font-semibold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
          >
            Xem Shop
          </Link>
          <button
            type="button"
            onClick={onMessageShop}
            className="rounded border border-[#e8e8e8] px-4 py-2 text-sm font-semibold text-[#1b1c1c] transition hover:bg-[#f5f3f3]"
          >
            Nhắn tin shop
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-4 flex flex-col gap-6 bg-white p-4 shadow-sm md:flex-row md:items-center md:p-6">
      <div className="flex items-center gap-4 md:w-1/3 md:border-r md:border-[#e8e8e8] md:pr-6">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[#e8e8e8] bg-[#fff1ec] text-lg font-bold text-[#ee4d2d]">
          {initials || 'TS'}
          <span className="absolute bottom-0 left-0 w-full bg-[#ee4d2d] py-0.5 text-center text-[8px] font-bold uppercase text-white">
            Preferred
          </span>
        </div>

        <div>
          <h2 className="text-base font-semibold text-[#1b1c1c]">{product.storeName}</h2>
          <p className="text-xs text-[#8f7069]">Đang hoạt động</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onMessageShop}
              className="flex items-center gap-1 border border-[#ee4d2d] bg-[#fff1ec] px-3 py-1.5 text-xs font-medium text-[#ee4d2d]"
            >
              <span className="material-symbols-outlined text-[14px]">chat</span>
              Chat ngay
            </button>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="flex items-center gap-1 border border-[#e8e8e8] px-3 py-1.5 text-xs font-medium text-[#1b1c1c]"
            >
              <span className="material-symbols-outlined text-[14px]">storefront</span>
              Xem Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:w-2/3 md:grid-cols-3">
        <div className="flex max-w-[180px] justify-between gap-4">
          <span className="text-[#8f7069]">Đánh giá</span>
          <span className="font-medium text-[#ee4d2d]">{product.reviewCount}</span>
        </div>
        <div className="flex max-w-[180px] justify-between gap-4">
          <span className="text-[#8f7069]">Phản hồi</span>
          <span className="font-medium text-[#ee4d2d]">98%</span>
        </div>
        <div className="flex max-w-[180px] justify-between gap-4">
          <span className="text-[#8f7069]">Tham gia</span>
          <span className="font-medium text-[#ee4d2d]">4 năm</span>
        </div>
        <div className="flex max-w-[180px] justify-between gap-4">
          <span className="text-[#8f7069]">Sản phẩm</span>
          <span className="font-medium text-[#ee4d2d]">{Math.max(24, Math.round(product.soldQuantity / 20))}</span>
        </div>
        <div className="flex max-w-[180px] justify-between gap-4">
          <span className="text-[#8f7069]">Phản hồi</span>
          <span className="font-medium text-[#ee4d2d]">trong vài giờ</span>
        </div>
        <div className="flex max-w-[180px] justify-between gap-4">
          <span className="text-[#8f7069]">Theo dõi</span>
          <span className="font-medium text-[#ee4d2d]">{Math.max(1200, product.soldQuantity)}+</span>
        </div>
      </div>
    </section>
  )
}
