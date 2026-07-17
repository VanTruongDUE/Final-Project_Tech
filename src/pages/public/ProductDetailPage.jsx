import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ProductImageGallery from '../../components/buyer/ProductImageGallery'
import ProductPurchasePanel from '../../components/buyer/ProductPurchasePanel'
import ProductReviewList from '../../components/buyer/ProductReviewList'
import ProductShopInfo from '../../components/buyer/ProductShopInfo'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import { conversationService } from '../../services/conversationService'
import { productService } from '../../services/productService'
import { reviewService } from '../../services/reviewService'
import { resolveRoleHome, ROLES } from '../../utils/roles'

const productOptionDefaults = {
  'Điện tử': { color: 'Đen', storage: 'Tiêu chuẩn' },
  default: { color: 'Tùy chọn 1', storage: 'Mặc định' },
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [productReviews, setProductReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(productOptionDefaults.default.color)
  const [selectedStorage, setSelectedStorage] = useState(productOptionDefaults.default.storage)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [cartMessage, setCartMessage] = useState('')
  const variants = product?.variants || []
  const selectedVariant =
    variants.find((variant) => String(variant.variantId) === String(selectedVariantId))
    || variants.find((variant) => variant.isDefault)
    || variants[0]
    || null
  const displayProduct = selectedVariant
    ? {
        ...product,
        variantId: selectedVariant.variantId,
        skuId: selectedVariant.skuId || selectedVariant.skuCode,
        skuCode: selectedVariant.skuCode || product.skuCode,
        variantName: selectedVariant.variantName || product.variantName,
        price: selectedVariant.price || product.price,
        originalPrice: selectedVariant.price || product.originalPrice,
        stockQuantity: selectedVariant.stockQuantity,
        status: selectedVariant.status || product.status,
      }
    : product
  const isOutOfStock = displayProduct?.status === 'OUT_OF_STOCK' || displayProduct?.status === 'INACTIVE'
  const isUnavailable = isOutOfStock || (displayProduct?.stockQuantity || 0) <= 0
  const canUseBuyerFlow =
    !currentUser || [ROLES.CUSTOMER, ROLES.SELLER].includes(currentUser.role)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      setIsLoading(true)

      const response = await productService.getProductById(id)

      if (!isMounted) {
        return
      }

      if (!response.success) {
        setProduct(null)
        setRelatedProducts([])
        setProductReviews([])
        setErrorMessage(response.message)
        setIsLoading(false)
        return
      }

      setProduct(response.data)
      setReviewsLoading(true)
      try {
        const reviewResponse = await reviewService.getProductReviews(response.data.id)
        if (isMounted) {
          setProductReviews(reviewResponse.data)
          setReviewsError('')
        }
      } catch (error) {
        if (isMounted) {
          setProductReviews([])
          setReviewsError(error.message)
        }
      } finally {
        if (isMounted) setReviewsLoading(false)
      }
      setErrorMessage('')
      setActiveImageIndex(0)
      setSelectedQuantity(1)
      setSelectedVariantId(
        response.data.defaultVariantId
        || response.data.variants?.find((variant) => variant.isDefault)?.variantId
        || response.data.variants?.[0]?.variantId
        || null,
      )
      const nextDefaults = productOptionDefaults[response.data.category] || productOptionDefaults.default
      setSelectedColor(nextDefaults.color)
      setSelectedStorage(nextDefaults.storage)
      setCartMessage('')

      const relatedResponse = await productService.getProductsByCategory(response.data.category)

      if (isMounted && relatedResponse.success) {
        setRelatedProducts(relatedResponse.data.filter((item) => item.id !== response.data.id).slice(0, 4))
      }

      setIsLoading(false)
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!product) {
      return
    }

    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (isUnavailable) {
      window.alert(`Sản phẩm "${product.name}" đang tạm hết hàng.`)
      return
    }

    try {
      await addItem(displayProduct, selectedQuantity, selectedVariant?.variantId)
      setCartMessage(`Đã thêm ${selectedQuantity} sản phẩm "${product.name}" vào giỏ hàng.`)
    } catch (error) {
      setCartMessage(error.message || 'Không thể thêm sản phẩm vào giỏ hàng.')
    }
  }

  const handleBuyNow = async () => {
    if (!product) {
      return
    }

    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (isUnavailable) {
      window.alert(`Sản phẩm "${product.name}" đang tạm hết hàng.`)
      return
    }

    if (!canUseBuyerFlow) {
      window.alert('Tài khoản hiện tại không thể đi tới thanh toán ở bước này.')
      navigate(resolveRoleHome(currentUser.role), { replace: true })
      return
    }

    try {
      await addItem(displayProduct, selectedQuantity, selectedVariant?.variantId)
    } catch (error) {
      setCartMessage(error.message || 'Không thể thêm sản phẩm vào giỏ hàng.')
      return
    }

    const buyNowItem = {
      productId: product.id,
      variantId: displayProduct.variantId,
      skuId: displayProduct.skuId,
      skuCode: displayProduct.skuCode,
      variantName: displayProduct.variantName,
      productName: product.name,
      imageUrl: product.imageUrl,
      storeId: product.storeId,
      storeName: product.storeName,
      location: product.location,
      price: displayProduct.price,
      originalPrice: displayProduct.originalPrice,
      color: selectedColor,
      storage: selectedStorage,
      quantity: selectedQuantity,
      stockQuantity: displayProduct.stockQuantity,
    }

    navigate('/checkout', { state: { buyNowItem } })
  }

  const handleMessageShop = async () => {
    if (!product) {
      return
    }

    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (currentUser.role !== ROLES.CUSTOMER) {
      window.alert('Tài khoản hiện tại không thể nhắn tin với shop ở bước này.')
      navigate(resolveRoleHome(currentUser.role), { replace: true })
      return
    }

    try {
      const response = await conversationService.createConversation({
      storeId: product.storeId,
      orderId: null,
      })
      navigate(`/messages/${encodeURIComponent(response.data.id)}`)
    } catch (error) {
      window.alert(error.message || 'Không thể mở cuộc trò chuyện với shop.')
    }
  }

  const updateQuantity = (nextValue) => {
    const maxQuantity = displayProduct?.stockQuantity || 1
    setSelectedQuantity(Math.min(maxQuantity, Math.max(1, nextValue)))
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-3 py-16 text-center text-sm text-[#5b403b]">
        Đang tải chi tiết sản phẩm...
      </div>
    )
  }

  if (!product) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-3 py-16 text-center">
        <div className="border border-[#e8e8e8] bg-white p-10">
          <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
          <p className="mt-3 text-sm text-[#5b403b]">
            {errorMessage || 'Sản phẩm có thể đã bị ẩn hoặc không tồn tại trong dữ liệu hiện tại.'}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-sm bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d64124]"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-3 py-6">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[#8f7069]">
        <Link to="/" className="hover:text-[#ee4d2d]">
          TechToShop
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#ee4d2d]">
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="truncate text-[#1b1c1c]">{product.name}</span>
      </nav>

      <section className="mb-4 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="w-full md:w-5/12">
            <ProductImageGallery product={product} activeIndex={activeImageIndex} onSelect={setActiveImageIndex} />
          </div>

          <div className="w-full md:w-7/12">
            <ProductPurchasePanel
              product={displayProduct}
              variants={variants}
              selectedVariantId={selectedVariant?.variantId || null}
              onSelectVariant={setSelectedVariantId}
              selectedColor={selectedColor}
              selectedStorage={selectedStorage}
              selectedQuantity={selectedQuantity}
              onSelectColor={setSelectedColor}
              onSelectStorage={setSelectedStorage}
              onDecrease={() => updateQuantity(selectedQuantity - 1)}
              onIncrease={() => updateQuantity(selectedQuantity + 1)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isUnavailable={isUnavailable}
              cartMessage={cartMessage}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-[#e8e8e8] bg-white p-6 shadow-sm">
            <h2 className="relative mb-4 border-b border-[#e8e8e8] pb-3 text-xl font-bold text-[#1b1c1c]">
              Mô tả chi tiết sản phẩm
              <span className="absolute bottom-[-1px] left-0 h-1 w-16 bg-[#ee4d2d]" />
            </h2>
            <div className="text-sm leading-7 text-[#5b403b]">
              <p>{product.description}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Mã SKU: {displayProduct.skuCode || 'Chưa có SKU'}</li>
                <li>Phân loại: {displayProduct.variantName || 'Mặc định'}</li>
                <li>Sản phẩm thuộc danh mục {product.category}, phù hợp cho nhu cầu mua sắm hằng ngày.</li>
                <li>Được bán bởi {product.storeName}, giao từ {product.location}.</li>
                <li>Tình trạng hiện tại: {isOutOfStock ? 'Tạm hết hàng' : 'Đang mở bán'}.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg border border-[#e8e8e8] bg-white p-6 shadow-sm">
            <h2 className="relative mb-4 border-b border-[#e8e8e8] pb-3 text-xl font-bold text-[#1b1c1c]">
              Đánh giá khách hàng
              <span className="absolute bottom-[-1px] left-0 h-1 w-16 bg-[#ee4d2d]" />
            </h2>
            <div className="mb-5 flex flex-wrap items-center gap-5">
              <div className="flex min-w-[120px] flex-col items-center justify-center rounded border border-[#e8e8e8] bg-[#fff8f6] p-4">
                <span className="text-4xl font-bold text-[#ee4d2d]">{product.rating}</span>
                <span className="my-1 text-[#ee4d2d]">★★★★★</span>
                <span className="text-xs text-[#8f7069]">{productReviews.length || product.reviewCount} đánh giá</span>
              </div>
              <div className="min-w-[220px] flex-1 space-y-2 text-sm text-[#5b403b]">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = Number(product.ratingDistribution?.[star]) || 0
                  const width = product.reviewCount ? Math.round((count / product.reviewCount) * 100) : 0

                  return (
                    <div key={star} className="grid grid-cols-[44px_1fr_36px] items-center gap-2">
                      <span>{star} sao</span>
                      <div className="h-2 overflow-hidden rounded-full bg-[#e8e8e8]">
                        <div className="h-full bg-[#fbbf24]" style={{ width: `${width}%` }} />
                      </div>
                      <span className="text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            {reviewsLoading ? <p className="mt-5 text-sm text-[#5b403b]">Đang tải đánh giá...</p> : null}
            {reviewsError ? <p className="mt-5 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{reviewsError}</p> : null}
            {!reviewsLoading && !reviewsError ? <ProductReviewList reviews={productReviews.slice(0, 4)} /> : null}
          </section>
        </div>

        <aside className="space-y-6">
          <ProductShopInfo product={product} onMessageShop={handleMessageShop} variant="sidebar" />

          <section className="rounded-lg border border-[#e8e8e8] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-[#1b1c1c]">Sản phẩm liên quan</h2>
            <div className="space-y-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/products/${item.id}`} className="group flex gap-3">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 shrink-0 rounded object-cover" />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm text-[#1b1c1c] group-hover:text-[#ee4d2d]">{item.name}</p>
                    <p className="mt-1 font-semibold text-[#d0011b]">
                      {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
