export default function ProductImageGallery({ product, activeIndex, onSelect }) {
  const galleryImages = Array.from({ length: 4 }, () => product.imageUrl)

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-[#e3e2e2] bg-[#f5f3f3]">
        <img
          src={galleryImages[activeIndex]}
          alt={product.name}
          className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
        {galleryImages.map((imageUrl, index) => (
          <button
            key={`${product.id}-thumb-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`overflow-hidden rounded-md border bg-[#f5f3f3] transition ${
              activeIndex === index ? 'border-2 border-[#ee4d2d]' : 'border-[#e3e2e2] opacity-80 hover:opacity-100'
            }`}
            aria-label={`Xem ảnh ${index + 1} của ${product.name}`}
          >
            <img src={imageUrl} alt={`${product.name} ${index + 1}`} className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
