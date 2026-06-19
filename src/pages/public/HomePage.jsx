import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/buyer/ProductCard'
import { productService } from '../../services/productService'

const categoryItems = [
  { label: 'Điện thoại', icon: 'smartphone', categoryMatch: 'Điện tử' },
  { label: 'Laptop', icon: 'laptop_mac', categoryMatch: 'Điện tử' },
  { label: 'Thời trang', icon: 'checkroom', categoryMatch: 'Thời trang' },
  { label: 'Đồng hồ', icon: 'watch', categoryMatch: 'Điện tử' },
  { label: 'Phụ kiện', icon: 'headphones', categoryMatch: 'Điện tử' },
  { label: 'Nội thất', icon: 'chair', categoryMatch: 'Gia dụng' },
  { label: 'Gaming', icon: 'sports_esports', categoryMatch: 'Điện tử' },
  { label: 'Gia dụng', icon: 'home', categoryMatch: 'Gia dụng' },
  { label: 'Mỹ phẩm', icon: 'spa', categoryMatch: 'Mỹ phẩm' },
  { label: 'Sách', icon: 'menu_book', categoryMatch: 'Sách - Văn phòng phẩm' },
  { label: 'Văn phòng phẩm', icon: 'edit_square', categoryMatch: 'Sách - Văn phòng phẩm' },
  { label: 'Thể thao', icon: 'sports_soccer', categoryMatch: 'Thể thao' },
  { label: 'Làm đẹp', icon: 'face_retouching_natural', categoryMatch: 'Mỹ phẩm' },
  { label: 'Nhà bếp', icon: 'skillet', categoryMatch: 'Gia dụng' },
  { label: 'Âm thanh', icon: 'volume_up', categoryMatch: 'Điện tử' },
  { label: 'Xem thêm', icon: 'more_horiz', categoryMatch: '' },
]

const topSearchSoldLabels = ['177k+', '171k+', '148k+', '139k+', '133k+', '119k+']

const saleCampaigns = [
  {
    badge: 'Siêu sale công nghệ',
    title: 'Giảm giá lên đến 50%\nCho thiết bị thông minh',
    description:
      'Khám phá hàng ngàn sản phẩm công nghệ chính hãng với mức giá ưu đãi nhất năm. Miễn phí vận chuyển toàn quốc.',
    to: '/products?category=Điện tử&sort=best-selling',
    productIndex: 0,
  },
  {
    badge: 'Deal thời trang',
    title: 'Lên đồ mùa mới\nƯu đãi đến 40%',
    description:
      'Các bộ sưu tập thời trang nổi bật, phụ kiện hot trend và nhiều lựa chọn phù hợp cho mọi phong cách.',
    to: '/products?category=Thời trang&sort=best-selling',
    productIndex: 3,
  },
  {
    badge: 'Nhà cửa tiện nghi',
    title: 'Sắm đồ gia dụng\nGiá tốt mỗi ngày',
    description:
      'Tìm nhanh những sản phẩm gia dụng, nhà bếp và nội thất bán chạy cho không gian sống hiện đại.',
    to: '/products?category=Gia dụng&sort=best-selling',
    productIndex: 5,
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [featuredPage, setFeaturedPage] = useState(1)
  const [saleCampaignIndex, setSaleCampaignIndex] = useState(0)
  const [saleTouchStart, setSaleTouchStart] = useState(null)

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

  useEffect(() => {
    const autoSlideTimer = window.setInterval(() => {
      setSaleCampaignIndex((currentIndex) =>
        currentIndex === saleCampaigns.length - 1 ? 0 : currentIndex + 1,
      )
    }, 4000)

    return () => {
      window.clearInterval(autoSlideTimer)
    }
  }, [])

  const heroProduct = featuredProducts[0]
  const secondaryProducts = featuredProducts.slice(1, 3)
  const featuredProductsPerPage = 16
  const totalFeaturedPages = Math.max(1, Math.ceil(featuredProducts.length / featuredProductsPerPage))
  const featuredPageProducts = featuredProducts.slice(
    (featuredPage - 1) * featuredProductsPerPage,
    featuredPage * featuredProductsPerPage,
  )
  const featuredStores = Object.values(
    featuredProducts.reduce((stores, product) => {
      if (!stores[product.storeId]) {
        stores[product.storeId] = {
          storeId: product.storeId,
          storeName: product.storeName,
          category: product.category,
          rating: product.rating,
          followers: 4000 + product.soldQuantity,
        }
      }

      return stores
    }, {}),
  ).slice(0, 3)

  const featuredCategoryLinks = categoryItems.map((item) => {
    const matchedCategory = categories.find((category) => category === item.categoryMatch) || ''
    return {
      ...item,
      category: matchedCategory,
    }
  })
  const topSearchItems = featuredProducts.slice(0, 6).map((product, index) => ({
    ...product,
    soldLabel: `Bán ${topSearchSoldLabels[index] || `${Math.max(1, product.soldQuantity)}+`} / tháng`,
  }))
  const showPreviousSaleCampaign = () => {
    setSaleCampaignIndex((currentIndex) =>
      currentIndex === 0 ? saleCampaigns.length - 1 : currentIndex - 1,
    )
  }
  const showNextSaleCampaign = () => {
    setSaleCampaignIndex((currentIndex) =>
      currentIndex === saleCampaigns.length - 1 ? 0 : currentIndex + 1,
    )
  }
  const handleSaleTouchEnd = (event) => {
    if (saleTouchStart === null) {
      return
    }

    const touchDistance = saleTouchStart - event.changedTouches[0].clientX

    if (touchDistance > 40) {
      showNextSaleCampaign()
    }

    if (touchDistance < -40) {
      showPreviousSaleCampaign()
    }

    setSaleTouchStart(null)
  }

  return (
    <div>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-3 py-6 md:py-8">
        <section className="grid grid-cols-1 gap-4 md:h-[500px] md:grid-cols-12">
          <div
            className="group relative min-h-[320px] overflow-hidden rounded-xl bg-[#303031] shadow-sm md:col-span-8 md:h-full"
            onTouchStart={(event) => setSaleTouchStart(event.touches[0].clientX)}
            onTouchEnd={handleSaleTouchEnd}
          >
            <div
              className="flex h-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${saleCampaignIndex * 100}%)` }}
            >
              {saleCampaigns.map((campaign) => {
                const campaignProduct = featuredProducts[campaign.productIndex] || heroProduct

                return (
                  <div key={campaign.badge} className="relative min-h-[320px] w-full shrink-0 md:h-full">
                    <img
                      src={campaignProduct?.imageUrl || 'https://placehold.co/900x520/e3e2e2/1b1c1c?text=TechToShop'}
                      alt={campaign.badge}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="relative flex h-full w-full max-w-2xl flex-col items-start justify-center p-8 text-white md:p-12">
                      <span className="mb-4 rounded-full bg-[#ee4d2d] px-3 py-1 text-xs font-bold uppercase tracking-wide">
                        {campaign.badge}
                      </span>
                      <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                        {campaign.title.split('\n').map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h1>
                      <p className="mt-4 max-w-md text-sm leading-6 text-white/90 md:text-base">
                        {campaign.description}
                      </p>
                      <Link
                        to={campaign.to}
                        className="mt-8 inline-flex items-center gap-2 rounded bg-[#ee4d2d] px-5 py-3 text-sm font-semibold transition hover:bg-[#d73211]"
                      >
                        Khám phá ngay
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={showPreviousSaleCampaign}
              aria-label="Chương trình sale trước"
              className="absolute left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#5b403b] shadow-md transition hover:bg-white hover:text-[#ee4d2d] md:grid"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={showNextSaleCampaign}
              aria-label="Chương trình sale tiếp theo"
              className="absolute right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#5b403b] shadow-md transition hover:bg-white hover:text-[#ee4d2d] md:grid"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <div className="absolute bottom-5 left-8 z-10 flex items-center gap-2 md:left-12">
              {saleCampaigns.map((campaign, index) => (
                <button
                  key={campaign.badge}
                  type="button"
                  onClick={() => setSaleCampaignIndex(index)}
                  aria-label={`Chọn ${campaign.badge}`}
                  className={`h-2.5 rounded-full transition ${
                    index === saleCampaignIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:col-span-4 md:h-full">
            {secondaryProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group relative min-h-[210px] overflow-hidden rounded-xl shadow-sm md:flex-1 md:min-h-0"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="max-w-[85%]">
                    <h2 className="text-2xl font-bold leading-tight">{product.category}</h2>
                    <p className="mt-1 text-sm leading-5 text-white/90">{product.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1b1c1c]">Danh mục nổi bật</h2>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 md:grid-cols-8 md:gap-x-6 md:gap-y-7">
            {featuredCategoryLinks.map((item) => (
              <Link
                key={item.label}
                to={item.category ? `/products?category=${encodeURIComponent(item.category)}` : '/products'}
                className="group flex flex-col items-center gap-3"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e3e2e2] bg-white text-[24px] shadow-sm transition-all duration-300 group-hover:border-[#ee4d2d] group-hover:shadow-md md:h-[68px] md:w-[68px] md:text-[28px]">
                  <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
                <span className="text-center text-[12px] font-medium text-[#1b1c1c] md:text-[13px]">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="overflow-hidden border border-[#e3e2e2] bg-white">
          <div className="flex items-center justify-between border-b border-[#e3e2e2] px-4 py-4 md:px-5">
            <h2 className="text-sm font-medium uppercase text-[#ee4d2d] md:text-base">Tìm kiếm hàng đầu</h2>
            <Link
              to="/products?sort=best-selling"
              className="flex items-center gap-1 text-sm font-medium text-[#ee4d2d] hover:underline"
            >
              Xem Tất Cả
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-[#5b403b]">Đang tải tìm kiếm hàng đầu...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {topSearchItems.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group flex min-w-0 flex-col px-3 pb-5 pt-5 transition hover:bg-[#fbf9f9]"
                  >
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white">
                      <span className="absolute left-0 top-0 z-10 rounded-b-sm bg-[#ee4d2d] px-2 py-2 text-[11px] font-bold leading-none text-white">
                        TOP
                      </span>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/30 px-2 py-1 text-center text-sm text-white">
                        {product.soldLabel}
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 min-h-[48px] text-base font-medium leading-6 text-[#3a2b28] transition group-hover:text-[#ee4d2d]">
                      {product.name}
                    </h3>
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/products?sort=best-selling"
              aria-label="Xem tất cả tìm kiếm hàng đầu"
              className="absolute right-[-14px] top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#8f7069] shadow-md transition hover:text-[#ee4d2d] lg:flex"
            >
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between border-b border-[#e3e2e2] pb-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
              <span className="text-[#ee4d2d]">★</span>
              Sản phẩm nổi bật
            </h2>
            <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-[#ee4d2d] hover:underline">
              Xem tất cả
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-[#e3e2e2] bg-white py-16 text-center text-[#5b403b]">
              Đang tải sản phẩm nổi bật...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {featuredPageProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="home" />
                ))}
              </div>

              {totalFeaturedPages > 1 ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFeaturedPage((currentPage) => Math.max(1, currentPage - 1))}
                    disabled={featuredPage === 1}
                    className="h-10 rounded border border-[#e3e2e2] bg-white px-4 text-sm font-semibold text-[#5b403b] transition hover:border-[#ee4d2d] hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalFeaturedPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setFeaturedPage(pageNumber)}
                      className={`h-10 min-w-10 rounded border px-3 text-sm font-semibold transition ${
                        pageNumber === featuredPage
                          ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                          : 'border-[#e3e2e2] bg-white text-[#5b403b] hover:border-[#ee4d2d] hover:text-[#ee4d2d]'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFeaturedPage((currentPage) => Math.min(totalFeaturedPages, currentPage + 1))}
                    disabled={featuredPage === totalFeaturedPages}
                    className="h-10 rounded border border-[#e3e2e2] bg-white px-4 text-sm font-semibold text-[#5b403b] transition hover:border-[#ee4d2d] hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="bg-[#f5f3f3] px-5 py-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
              <span className="material-symbols-outlined text-[22px] text-[#ee4d2d]" aria-hidden="true">
                storefront
              </span>
              Cửa hàng nổi bật
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {featuredStores.map((store) => (
              <div
                key={store.storeId}
                className="flex min-h-[132px] items-center gap-5 rounded-xl border border-[#e3e2e2] bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#fff1ec] text-2xl font-bold text-[#ee4d2d]">
                  {store.storeName
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-semibold text-[#1b1c1c]">{store.storeName}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#8f7069]">
                    <span className="flex items-center gap-1 text-[#ee4d2d]">
                      <span>★</span>
                      {store.rating}
                    </span>
                    <span>•</span>
                    <span>{store.followers.toLocaleString('vi-VN')}+ người theo dõi</span>
                  </div>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(store.category)}`}
                  className="shrink-0 rounded-full bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211]"
                >
                  Xem Shop
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
