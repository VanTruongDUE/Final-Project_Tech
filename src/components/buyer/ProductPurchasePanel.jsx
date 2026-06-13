import { formatCurrency } from '../../utils/formatCurrency'

const colorChoices = [
  { label: 'Titan tự nhiên', value: 'Titan tự nhiên', swatch: '#b0aba5' },
  { label: 'Titan đen', value: 'Titan đen', swatch: '#41454f' },
  { label: 'Titan trắng', value: 'Titan trắng', swatch: '#f3f2ee' },
  { label: 'Titan xanh', value: 'Titan xanh', swatch: '#2f3642' },
]

const storageChoices = ['128GB', '256GB', '512GB', '1TB']

export default function ProductPurchasePanel({
  product,
  selectedColor,
  selectedStorage,
  selectedQuantity,
  onSelectColor,
  onSelectStorage,
  onDecrease,
  onIncrease,
  onAddToCart,
  onBuyNow,
  isUnavailable,
  cartMessage,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-[#1b1c1c]">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5b403b]">
          <div className="flex items-center gap-1 text-[#eab308]">
            <span>★</span>
            <span className="font-semibold text-[#1b1c1c]">{product.rating}</span>
            <span className="text-[#8f7069]">({product.reviewCount} đánh giá)</span>
          </div>
          <span className="hidden h-4 w-px bg-[#e3e2e2] md:block" />
          <span>Đã bán: <strong className="text-[#1b1c1c]">{product.soldQuantity}</strong></span>
        </div>
      </div>

      <div className="rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl font-bold leading-none text-[#d0011b]">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price ? (
            <span className="text-sm text-[#8f7069] line-through">{formatCurrency(product.originalPrice)}</span>
          ) : null}
          {product.discountPercent > 0 ? (
            <span className="rounded-full bg-[#d0011b] px-3 py-1 text-xs font-bold text-white">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 border-y border-[#e3e2e2] py-5">
        <div className="grid gap-3 sm:grid-cols-[110px_1fr] sm:items-start">
          <span className="pt-1 text-sm text-[#5b403b]">Màu sắc</span>
          <div className="flex flex-wrap gap-3">
            {colorChoices.map((choice) => {
              const isActive = choice.value === selectedColor

              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => onSelectColor(choice.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    isActive
                      ? 'border-[#ee4d2d] bg-[#fff1ec] text-[#ee4d2d]'
                      : 'border-[#e3e2e2] bg-white text-[#1b1c1c] hover:border-[#ee4d2d]'
                  }`}
                >
                  <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: choice.swatch }} />
                  {choice.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[110px_1fr] sm:items-start">
          <span className="pt-1 text-sm text-[#5b403b]">Dung lượng</span>
          <div className="flex flex-wrap gap-3">
            {storageChoices.map((choice) => {
              const isActive = choice === selectedStorage

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onSelectStorage(choice)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    isActive
                      ? 'border-[#ee4d2d] bg-[#fff1ec] font-semibold text-[#ee4d2d]'
                      : 'border-[#e3e2e2] bg-white text-[#1b1c1c] hover:border-[#ee4d2d]'
                  }`}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[110px_1fr] sm:items-center">
          <span className="text-sm text-[#5b403b]">Số lượng</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex overflow-hidden rounded-md border border-[#e3e2e2] bg-white">
              <button
                type="button"
                onClick={onDecrease}
                disabled={selectedQuantity <= 1 || isUnavailable}
                className="grid h-10 w-10 place-items-center text-lg transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:text-[#8f7069]"
                aria-label="Giảm số lượng"
              >
                -
              </button>
              <span className="grid h-10 w-12 place-items-center border-x border-[#e3e2e2] text-sm font-medium">
                {selectedQuantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                disabled={selectedQuantity >= product.stockQuantity || isUnavailable}
                className="grid h-10 w-10 place-items-center text-lg transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:text-[#8f7069]"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
            <span className="text-sm text-[#5b403b]">
              {isUnavailable ? 'Tạm hết hàng' : `${product.stockQuantity} sản phẩm có sẵn`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-[#5b403b] sm:grid-cols-2">
        <div>
          <p className="font-medium text-[#1b1c1c]">Cửa hàng</p>
          <p className="mt-1">{product.storeName}</p>
        </div>
        <div>
          <p className="font-medium text-[#1b1c1c]">Khu vực</p>
          <p className="mt-1">{product.location}</p>
        </div>
      </div>

      {cartMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {cartMessage}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={isUnavailable}
          className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#ee4d2d] bg-[#fff1ec] px-5 font-semibold text-[#ee4d2d] transition hover:bg-[#ffe4db] disabled:cursor-not-allowed disabled:border-[#e3e2e2] disabled:bg-[#f5f3f3] disabled:text-[#8f7069]"
        >
          <span>+</span>
          Thêm vào giỏ hàng
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={isUnavailable}
          className="h-12 rounded-lg bg-[#ee4d2d] px-5 font-semibold text-white transition hover:bg-[#d73211] disabled:cursor-not-allowed disabled:bg-[#e3e2e2] disabled:text-[#8f7069]"
        >
          Mua ngay
        </button>
      </div>
    </div>
  )
}
