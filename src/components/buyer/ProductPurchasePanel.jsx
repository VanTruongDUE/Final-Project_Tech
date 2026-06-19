import { formatCurrency } from '../../utils/formatCurrency'

const optionGroups = {
  'Điện tử': {
    primaryLabel: 'Phiên bản',
    primaryOptions: ['Tiêu chuẩn', 'Cao cấp', 'Giới hạn'],
    secondaryLabel: 'Màu sắc',
    secondaryOptions: [
      { label: 'Đen', value: 'Đen', swatch: '#41454f' },
      { label: 'Trắng', value: 'Trắng', swatch: '#f3f2ee' },
      { label: 'Bạc', value: 'Bạc', swatch: '#b0aba5' },
    ],
  },
  default: {
    primaryLabel: 'Phân loại',
    primaryOptions: ['Mặc định', 'Loại 1', 'Loại 2'],
    secondaryLabel: 'Màu sắc',
    secondaryOptions: [
      { label: 'Tùy chọn 1', value: 'Tùy chọn 1', swatch: '#d6d3d1' },
      { label: 'Tùy chọn 2', value: 'Tùy chọn 2', swatch: '#f59e0b' },
      { label: 'Tùy chọn 3', value: 'Tùy chọn 3', swatch: '#ef4444' },
    ],
  },
}

function RatingStars() {
  return (
    <div className="flex text-[#ee4d2d]">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="material-symbols-outlined text-[18px] leading-none">
          star
        </span>
      ))}
    </div>
  )
}

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
  const optionGroup = optionGroups[product.category] || optionGroups.default

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <div className="mb-2 flex items-start gap-2">
          <span className="mt-1 rounded-sm bg-[#ee4d2d] px-1.5 py-0.5 text-[10px] font-bold text-white">Mall</span>
          <h1 className="text-xl font-semibold leading-tight text-[#1b1c1c] md:text-2xl">{product.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 border-b border-[#ee4d2d] pb-1 text-[#ee4d2d]">
            <span className="font-semibold">{product.rating}</span>
            <RatingStars />
          </div>
          <span className="h-3 w-px bg-[#e8e8e8]" />
          <div>
            <span className="font-semibold text-[#1b1c1c]">{product.reviewCount}</span>
            <span className="ml-1 text-[#8f7069]">Đánh giá</span>
          </div>
          <span className="h-3 w-px bg-[#e8e8e8]" />
          <div>
            <span className="font-semibold text-[#1b1c1c]">{product.soldQuantity}</span>
            <span className="ml-1 text-[#8f7069]">Đã bán</span>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-[#f5f3f3] p-4">
        <div className="flex flex-wrap items-center gap-3">
          {product.originalPrice > product.price ? (
            <span className="text-base text-[#8f7069] line-through">{formatCurrency(product.originalPrice)}</span>
          ) : null}
          <div className="flex items-baseline gap-1 text-[#ee4d2d]">
            <span className="text-lg font-medium">đ</span>
            <span className="text-[32px] font-bold leading-none">
              {new Intl.NumberFormat('vi-VN').format(product.price)}
            </span>
          </div>
          {product.discountPercent > 0 ? (
            <span className="rounded-sm bg-[#ee4d2d]/10 px-2 py-1 text-[10px] font-bold uppercase text-[#ee4d2d]">
              {product.discountPercent}% OFF
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-sm border border-[#26aa99]/30 bg-[#26aa99]/10 px-2 py-1 text-[#26aa99]">
            Đảm bảo giá tốt
          </span>
          <span className="flex items-center gap-1 rounded-sm border border-[#fbbe00]/40 bg-[#fbbe00]/10 px-2 py-1 text-[#b57b00]">
            <span className="material-symbols-outlined text-[13px]">monetization_on</span>
            Nhận xu TechToShop
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-start">
          <span className="mt-1 w-24 shrink-0 text-sm text-[#8f7069]">Vận chuyển</span>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined mt-0.5 text-[18px] text-[#26aa99]">local_shipping</span>
              <div>
                <div className="font-medium text-[#1b1c1c]">Miễn phí vận chuyển</div>
                <div className="text-xs text-[#8f7069]">Áp dụng theo chính sách demo của TechToShop</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined mt-0.5 text-[18px] text-[#8f7069]">airport_shuttle</span>
              <div>
                <div className="text-[#8f7069]">
                  Giao từ <span className="font-medium text-[#1b1c1c]">{product.location}</span>
                </div>
                <div className="mt-1 text-[#8f7069]">
                  Phí vận chuyển <span className="font-medium text-[#1b1c1c]">{formatCurrency(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mt-2 w-24 shrink-0 text-sm text-[#8f7069]">{optionGroup.secondaryLabel}</span>
          <div className="flex flex-wrap gap-2">
            {optionGroup.secondaryOptions.map((choice) => (
              <button
                key={choice.value}
                type="button"
                onClick={() => onSelectColor(choice.value)}
                className={`relative h-9 min-w-[86px] border px-4 text-sm transition ${
                  choice.value === selectedColor
                    ? 'border-2 border-[#ee4d2d] bg-[#fff5f1] font-medium text-[#ee4d2d]'
                    : 'border-[#e8e8e8] bg-white text-[#1b1c1c] hover:border-[#ee4d2d] hover:text-[#ee4d2d]'
                }`}
              >
                {choice.label}
                {choice.value === selectedColor ? (
                  <>
                    <span className="absolute bottom-0 right-0 h-4 w-4 bg-[#ee4d2d] [clip-path:polygon(100%_0,0_100%,100%_100%)]" />
                    <span className="material-symbols-outlined absolute bottom-0 right-0 z-10 text-[10px] leading-none text-white">
                      check
                    </span>
                  </>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start">
          <span className="mt-2 w-24 shrink-0 text-sm text-[#8f7069]">{optionGroup.primaryLabel}</span>
          <div className="flex flex-wrap gap-2">
            {optionGroup.primaryOptions.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => onSelectStorage(choice)}
                className={`relative h-9 min-w-[82px] border px-4 text-sm transition ${
                  choice === selectedStorage
                    ? 'border-2 border-[#ee4d2d] bg-[#fff5f1] font-medium text-[#ee4d2d]'
                    : 'border-[#e8e8e8] bg-white text-[#1b1c1c] hover:border-[#ee4d2d] hover:text-[#ee4d2d]'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <span className="w-24 shrink-0 text-sm text-[#8f7069]">Số lượng</span>
          <div className="flex items-center text-sm">
            <div className="flex h-9 items-center border border-[#e8e8e8]">
              <button
                type="button"
                onClick={onDecrease}
                disabled={selectedQuantity <= 1 || isUnavailable}
                className="grid h-full w-9 place-items-center border-r border-[#e8e8e8] text-[#8f7069] disabled:cursor-not-allowed disabled:text-[#c7b7b2]"
              >
                −
              </button>
              <span className="grid h-full w-12 place-items-center text-[#1b1c1c]">{selectedQuantity}</span>
              <button
                type="button"
                onClick={onIncrease}
                disabled={selectedQuantity >= product.stockQuantity || isUnavailable}
                className="grid h-full w-9 place-items-center border-l border-[#e8e8e8] text-[#8f7069] disabled:cursor-not-allowed disabled:text-[#c7b7b2]"
              >
                +
              </button>
            </div>
            <span className="ml-4 text-[#8f7069]">
              {isUnavailable ? 'Tạm hết hàng' : `${product.stockQuantity} sản phẩm có sẵn`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto grid gap-4 pt-8 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={isUnavailable}
          className="flex h-12 items-center justify-center gap-2 border border-[#ee4d2d] bg-[#fff1ec] px-5 font-medium text-[#ee4d2d] transition hover:bg-[#ffe4db] disabled:cursor-not-allowed disabled:border-[#e8e8e8] disabled:bg-[#f5f3f3] disabled:text-[#8f7069]"
        >
          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          Thêm vào giỏ hàng
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={isUnavailable}
          className="h-12 bg-[#ee4d2d] px-5 font-medium text-white transition hover:bg-[#d64124] disabled:cursor-not-allowed disabled:bg-[#e8e8e8] disabled:text-[#8f7069]"
        >
          Mua ngay
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-[#e8e8e8] pt-4 text-sm text-[#5b403b]">
        <span className="material-symbols-outlined text-[20px] text-[#26aa99]">verified_user</span>
        <span className="font-medium text-[#1b1c1c]">TechToShop Guarantee</span>
        <span>Nhận đúng sản phẩm đã đặt hoặc được hỗ trợ hoàn tiền.</span>
      </div>

      {cartMessage ? (
        <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {cartMessage}
        </div>
      ) : null}
    </div>
  )
}
