import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import ProductImageGallery from '../../components/buyer/ProductImageGallery'
import ProductPurchasePanel from '../../components/buyer/ProductPurchasePanel'
import ProductShopInfo from '../../components/buyer/ProductShopInfo'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatCurrency'
import { resolveRoleHome, ROLES } from '../../utils/roles'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('Titan tự nhiên')
  const [selectedStorage, setSelectedStorage] = useState('256GB')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState('')
  const isOutOfStock = product?.status === 'OUT_OF_STOCK'
  const isUnavailable = isOutOfStock || (product?.stockQuantity || 0) <= 0

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
        setErrorMessage(response.message)
        setIsLoading(false)
        return
      }

      setProduct(response.data)
      setErrorMessage('')
      setActiveImageIndex(0)
      setSelectedQuantity(1)
      setSelectedColor('Titan tự nhiên')
      setSelectedStorage('256GB')
      setCartMessage('')

      const relatedResponse = await productService.getProductsByCategory(response.data.category)

      if (isMounted && relatedResponse.success) {
        setRelatedProducts(
          relatedResponse.data.filter((item) => item.id !== response.data.id).slice(0, 2),
        )
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

    if (currentUser && currentUser.role !== ROLES.CUSTOMER) {
      window.alert('Tài khoản hiện tại không thể đi tới thanh toán. Vui lòng dùng tài khoản khách hàng.')
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

  const updateQuantity = (nextValue) => {
    const maxQuantity = product?.stockQuantity || 1
    setSelectedQuantity(Math.min(maxQuantity, Math.max(1, nextValue)))
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-3 py-16 text-center text-[#5b403b] md:px-4">
        Đang tải chi tiết sản phẩm...
      </div>
    )
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-[1200px] px-3 py-16 text-center md:px-4">
        <div className="rounded-xl border border-[#e3beb6]/70 bg-white p-10">
          <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
          <p className="mt-3 text-sm text-[#5b403b]">
            {errorMessage || 'Sản phẩm có thể đã bị ẩn hoặc không tồn tại trong dữ liệu mock.'}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d73211]"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-6 md:px-4">
      <div className="mb-6 flex items-center gap-2 text-sm text-[#5b403b]">
        <Link to="/" className="hover:text-[#ee4d2d]">
          Trang chủ
        </Link>
        <span>›</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#ee4d2d]">
          {product.category}
        </Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      <section className="rounded-lg border border-[#e3e2e2] bg-white p-4 shadow-sm md:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ProductImageGallery
              product={product}
              activeIndex={activeImageIndex}
              onSelect={setActiveImageIndex}
            />
          </div>

          <div className="lg:col-span-7">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="relative border-b border-[#e3e2e2] pb-3 text-xl font-bold text-[#1b1c1c]">
              Mô tả chi tiết sản phẩm
              <span className="absolute bottom-[-1px] left-0 h-1 w-16 bg-[#ee4d2d]" />
            </h2>
            <p className="mt-5 leading-7 text-[#5b403b]">{product.description}</p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[#5b403b]">
              <li>Danh mục: {product.category}</li>
              <li>Địa điểm bán: {product.location}</li>
              <li>Tình trạng: {isOutOfStock ? 'Tạm hết hàng' : 'Đang mở bán'}</li>
            </ul>
          </section>

          <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="relative border-b border-[#e3e2e2] pb-3 text-xl font-bold text-[#1b1c1c]">
              Đánh giá khách hàng
              <span className="absolute bottom-[-1px] left-0 h-1 w-16 bg-[#ee4d2d]" />
            </h2>
            <div className="mt-5 flex flex-col gap-5 md:flex-row">
              <div className="flex min-w-[140px] flex-col items-center justify-center rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-5">
                <p className="text-5xl font-bold text-[#ee4d2d]">{product.rating}</p>
                <p className="mt-2 text-lg text-[#ee4d2d]">★★★★★</p>
                <p className="mt-1 text-xs text-[#5b403b]">{product.reviewCount} đánh giá</p>
              </div>

              <div className="flex-1 space-y-2 text-sm text-[#5b403b]">
                {[85, 10, 3, 1, 1].map((percent, index) => (
                  <div key={percent + index} className="grid grid-cols-[44px_1fr_40px] items-center gap-2">
                    <span>{5 - index} sao</span>
                    <div className="h-2 overflow-hidden rounded-full bg-[#e9e8e7]">
                      <div className="h-full bg-[#eab308]" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-right">{percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#e3e2e2] pt-5">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9e8e7] font-bold text-[#5b403b]">
                  H
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold">Hoàng Nguyễn</p>
                    <p className="text-sm text-[#ee4d2d]">★★★★★</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5b403b]">
                    Sản phẩm đúng mô tả, đóng gói cẩn thận, shop tư vấn nhanh. Mình sẽ tiếp tục
                    ủng hộ trong các đơn hàng sau.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ProductShopInfo product={product} />

          <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1b1c1c]">Sản phẩm liên quan</h2>
            <div className="mt-4 space-y-4">
              {relatedProducts.length ? (
                relatedProducts.map((item) => (
                  <Link key={item.id} to={`/products/${item.id}`} className="group flex gap-3">
                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                    <div>
                      <p className="line-clamp-2 text-sm text-[#1b1c1c] transition group-hover:text-[#ee4d2d]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#d0011b]">{formatCurrency(item.price)}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[#5b403b]">Chưa có thêm sản phẩm liên quan trong dữ liệu mock.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
