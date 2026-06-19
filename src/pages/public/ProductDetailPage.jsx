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
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(productOptionDefaults.default.color)
  const [selectedStorage, setSelectedStorage] = useState(productOptionDefaults.default.storage)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState('')
  const isOutOfStock = product?.status === 'OUT_OF_STOCK'
  const isUnavailable = isOutOfStock || (product?.stockQuantity || 0) <= 0
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
      setProductReviews(reviewService.getReviewsByProductId(response.data.id))
      setErrorMessage('')
      setActiveImageIndex(0)
      setSelectedQuantity(1)
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

  const handleAddToCart = () => {
    if (!product) {
      return
    }

    if (isUnavailable) {
      window.alert(`Sản phẩm "${product.name}" đang tạm hết hàng.`)
      return
    }

    addItem(product.id, selectedQuantity)
    setCartMessage(`Đã thêm ${selectedQuantity} sản phẩm "${product.name}" vào giỏ hàng.`)
  }

  const handleBuyNow = () => {
    if (!product) {
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

    addItem(product.id, selectedQuantity)

    const buyNowItem = {
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      storeName: product.storeName,
      location: product.location,
      price: product.price,
      originalPrice: product.originalPrice,
      color: selectedColor,
      storage: selectedStorage,
      quantity: selectedQuantity,
      stockQuantity: product.stockQuantity,
    }

    navigate('/checkout', { state: { buyNowItem } })
  }

  const handleMessageShop = () => {
    if (!product) {
      return
    }

    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (!canUseBuyerFlow) {
      window.alert('Tài khoản hiện tại không thể nhắn tin với shop ở bước này.')
      navigate(resolveRoleHome(currentUser.role), { replace: true })
      return
    }

    const response = conversationService.findOrCreateConversation({
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      storeId: product.storeId,
      storeName: product.storeName,
      productId: product.id,
      productName: product.name,
      orderId: null,
    })

    if (!response.success) {
      window.alert(response.message || 'Không thể mở cuộc trò chuyện với shop.')
      return
    }

    navigate(`/messages/${encodeURIComponent(response.data.id)}`)
  }

  const updateQuantity = (nextValue) => {
    const maxQuantity = product?.stockQuantity || 1
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
            {errorMessage || 'Sản phẩm có thể đã bị ẩn hoặc không tồn tại trong dữ liệu mock.'}
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
              product={product}
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
                {[5, 4, 3, 2, 1].map((star, index) => {
                  const width = index === 0 ? 84 : Math.max(4, 16 - index * 3)

                  return (
                    <div key={star} className="grid grid-cols-[44px_1fr_36px] items-center gap-2">
                      <span>{star} sao</span>
                      <div className="h-2 overflow-hidden rounded-full bg-[#e8e8e8]">
                        <div className="h-full bg-[#fbbf24]" style={{ width: `${width}%` }} />
                      </div>
                      <span className="text-right">{width}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <ProductReviewList reviews={productReviews.slice(0, 4)} />
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
