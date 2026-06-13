import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import { productService } from '../../services/productService'

const categoryItems = [
  { label: 'Điện tử', icon: '🎧', accent: 'bg-[#eaf3ff]' },
  { label: 'Thời trang', icon: '👕', accent: 'bg-[#fff1ec]' },
  { label: 'Gia dụng', icon: '🏠', accent: 'bg-[#eef8ef]' },
  { label: 'Mỹ phẩm', icon: '✨', accent: 'bg-[#fff4f8]' },
  { label: 'Sách & VPP', icon: '📚', accent: 'bg-[#f4f0ff]' },
  { label: 'Thể thao', icon: '⚽', accent: 'bg-[#eef7ff]' },
  { label: 'Laptop', icon: '💻', accent: 'bg-[#f3f4f6]' },
  { label: 'Xem thêm', icon: '🛍️', accent: 'bg-[#fff8e8]' },
]

function HomeProductCard({ product }) {
  const isAvailable = product.stockQuantity > 0 && product.status === 'ACTIVE'

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#e3e2e2] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#f8f8f8] p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
          />
          <button
            type="button"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-sm text-[#8f7069] shadow-sm transition hover:text-[#ee4d2d]"
            aria-label={`Yêu thích ${product.name}`}
          >
            ♡
          </button>
          {product.discountPercent > 0 ? (
            <span className="absolute left-2 top-2 rounded-full bg-[#ee4d2d] px-2 py-1 text-[10px] font-bold text-white">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
              isAvailable ? 'bg-[#fff1ec] text-[#ee4d2d]' : 'bg-[#f5f3f3] text-[#8f7069]'
            }`}
          >
            {isAvailable ? 'Đang mở bán' : 'Hết hàng'}
          </span>
          <span className="text-[11px] text-[#8f7069]">{product.location}</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-[#1b1c1c] transition hover:text-[#ee4d2d]"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#8f7069]">
          <span>★ {product.rating}</span>
          <span>•</span>
          <span>Đã bán {product.soldQuantity}</span>
        </div>
        <p className="mt-3 text-[18px] font-bold leading-none text-[#d0011b]">{formatCurrency(product.price)}</p>
        {product.originalPrice > product.price ? (
          <p className="mt-1 text-xs text-[#8f7069] line-through">{formatCurrency(product.originalPrice)}</p>
        ) : null}
        <div className="mt-3 rounded-lg bg-[#faf8f8] px-3 py-2">
          <p className="truncate text-xs font-medium text-[#5b403b]">{product.storeName}</p>
          <p className="mt-1 text-[11px] text-[#8f7069]">{product.category}</p>
        </div>
        <button
          type="button"
          onClick={() => window.alert(`Đã thêm tạm thời sản phẩm "${product.name}" vào giỏ hàng mock.`)}
          className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded bg-[#ee4d2d] text-sm font-semibold text-white transition hover:bg-[#d73211]"
        >
          <span aria-hidden="true">+</span>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadHomeData = async () => {
      setIsLoading(true)

      const [featuredResponse, categoriesResponse] = await Promise.all([
        productService.getFeaturedProducts(),
        productService.getCategories(),
      ])

      if (!isMounted) {
        return
      }

      if (featuredResponse.success) {
        setFeaturedProducts(featuredResponse.data)
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data)
      }

      setIsLoading(false)
    }

    loadHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  const heroProduct = featuredProducts[0]
  const secondaryProducts = featuredProducts.slice(1, 3)
  const featuredCategoryLinks = categoryItems.map((item, index) => ({
    ...item,
    category: categories[index] || '',
  }))
  const featuredStores = Object.values(
    featuredProducts.reduce((stores, product) => {
      if (!stores[product.storeId]) {
        stores[product.storeId] = {
          storeId: product.storeId,
          storeName: product.storeName,
          location: product.location,
          category: product.category,
          productCount: 0,
          soldQuantity: 0,
        }
      }

      stores[product.storeId].productCount += 1
      stores[product.storeId].soldQuantity += product.soldQuantity

      return stores
    }, {}),
  ).slice(0, 3)

  return (
    <div>
      <section className="mx-auto max-w-[1200px] px-3 py-6 md:px-4 md:py-8">
        <div className="grid gap-4 md:h-[480px] md:grid-cols-12">
          <Link
            to="/products?sort=best-selling"
            className="relative min-h-[300px] overflow-hidden rounded-xl bg-[#303031] text-white shadow-sm md:col-span-8"
          >
            <img
              src={heroProduct?.imageUrl || 'https://placehold.co/900x520/e3e2e2/1b1c1c?text=TechToShop'}
              alt="Khuyến mãi TechToShop"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="relative flex h-full w-full max-w-2xl flex-col items-start justify-center p-8 text-white md:p-12">
              <span className="mb-4 w-fit rounded-full bg-[#ee4d2d] px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Siêu sale công nghệ
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Giảm giá lên đến 50% cho thiết bị thông minh
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/90 md:text-base">
                Khám phá hàng ngàn sản phẩm công nghệ chính hãng với mức giá ưu đãi nhất năm.
                Miễn phí vận chuyển toàn quốc.
              </p>
              <span className="mt-8 inline-flex w-fit items-center rounded bg-[#ee4d2d] px-5 py-2 text-sm font-semibold">
                Khám phá ngay
              </span>
            </div>
          </Link>

          <div className="grid gap-4 md:col-span-4">
            {secondaryProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="relative min-h-[190px] overflow-hidden rounded-xl bg-[#303031] text-white shadow-sm"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <h2 className="text-2xl font-bold leading-tight">{product.category}</h2>
                  <p className="mt-1 text-sm text-white/90">{product.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-3 pb-8 md:px-4">
        <h2 className="mb-5 text-xl font-semibold">Danh mục nổi bật</h2>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-6">
          {featuredCategoryLinks.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={item.category ? `/products?category=${encodeURIComponent(item.category)}` : '/products'}
              className="group flex flex-col items-center text-center text-xs text-[#5b403b] transition hover:text-[#ee4d2d]"
            >
              <span
                className={`grid h-16 w-16 place-items-center rounded-full border border-[#e3e2e2] text-2xl shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-[#ee4d2d] md:h-20 md:w-20 ${item.accent}`}
              >
                {item.icon}
              </span>
              <span className="mt-3">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-3 pb-12 md:px-4">
        <div className="mb-5 flex items-center justify-between border-b border-[#e3beb6]/60 pb-3">
          <h2 className="text-xl font-semibold">
            <span className="mr-2 text-[#ee4d2d]">★</span>
            Sản phẩm nổi bật
          </h2>
          <Link to="/products" className="text-sm font-medium text-[#ee4d2d]">
            Sản phẩm
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-[#e3beb6]/70 bg-white py-16 text-center text-[#5b403b]">
            Đang tải sản phẩm nổi bật...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <HomeProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#f5f3f3] py-10">
        <div className="mx-auto max-w-[1200px] px-3 md:px-4">
          <div className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
            <span className="text-[#ee4d2d]">▣</span>
            <h2>Cửa hàng nổi bật</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredStores.map((store, index) => (
              <div
                key={store.storeId}
                className="flex items-center gap-4 rounded-xl border border-[#e3e2e2] bg-white p-5 transition hover:shadow-md"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#fff1ec] text-lg font-bold text-[#ee4d2d]">
                  {store.storeName
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{store.storeName}</h3>
                  <p className="mt-1 text-xs text-[#5b403b]">
                    {store.category} • {store.location}
                  </p>
                  <p className="mt-2 text-[11px] text-[#8f7069]">
                    {store.productCount} sản phẩm nổi bật • Đã bán {store.soldQuantity}
                  </p>
                  <p className="mt-2 text-[11px] text-[#8f7069]">
                    {index === 0
                      ? 'Gian hàng bán chạy với nhiều ưu đãi công nghệ.'
                      : index === 1
                        ? 'Nhiều sản phẩm được yêu thích trong tuần.'
                        : 'Danh mục đa dạng, phù hợp mua sắm hằng ngày.'}
                  </p>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(store.category)}`}
                  className="rounded-full bg-[#ee4d2d] px-3 py-2 text-xs font-semibold text-white"
                >
                  Xem sản phẩm
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
