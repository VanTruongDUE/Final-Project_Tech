export default function ProductImageGallery({ product, activeIndex, onSelect }) {
  const galleryImages = Array.from({ length: 4 }, () => product.imageUrl)

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-square overflow-hidden rounded-sm bg-[#f5f3f3]">
        <img
          src={galleryImages[activeIndex]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.discountPercent > 0 ? (
          <div className="absolute left-0 top-3 flex items-center gap-1 rounded-r-sm bg-[#fbbe00] px-2 py-1 text-xs font-bold text-[#251a00]">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Flash Sale
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {galleryImages.map((imageUrl, index) => (
          <button
            key={`${product.id}-thumb-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-[82px] w-[82px] shrink-0 overflow-hidden rounded-sm bg-[#f5f3f3] transition ${
              activeIndex === index ? 'border-2 border-[#ee4d2d]' : 'border border-transparent hover:border-[#ee4d2d]'
            }`}
            aria-label={`Xem ảnh ${index + 1} của ${product.name}`}
          >
            <img src={imageUrl} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-[#5b403b]">
        <button type="button" className="flex items-center gap-1 transition hover:text-[#ee4d2d]">
          <span className="material-symbols-outlined text-[18px]">share</span>
          Chia sẻ
        </button>
        <span className="h-4 w-px bg-[#e8e8e8]" />
        <button type="button" className="flex items-center gap-1 transition hover:text-[#ee4d2d]">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          Yêu thích ({Math.max(12, Math.round(product.reviewCount / 2))})
        </button>
      </div>
    </div>
  )
}
