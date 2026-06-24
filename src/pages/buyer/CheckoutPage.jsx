import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CheckoutAddressForm from '../../components/buyer/CheckoutAddressForm'
import CheckoutOrderSummary from '../../components/buyer/CheckoutOrderSummary'
import CheckoutPaymentMethod from '../../components/buyer/CheckoutPaymentMethod'
import CheckoutShippingMethod from '../../components/buyer/CheckoutShippingMethod'
import { shippingOptions } from '../../components/buyer/checkout-options'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/useCart'
import { orderService } from '../../services/orderService'
import { productService } from '../../services/productService'

const normalizeBuyNowItem = (buyNowItem) => {
  if (!buyNowItem?.productId) {
    return []
  }

  return [
    {
      productId: buyNowItem.productId,
      skuId: buyNowItem.skuId || buyNowItem.skuCode,
      skuCode: buyNowItem.skuCode,
      variantName: buyNowItem.variantName || 'Mặc định',
      price: buyNowItem.price,
      storeId: buyNowItem.storeId,
      product: {
        id: buyNowItem.productId,
        name: buyNowItem.productName,
        imageUrl: buyNowItem.imageUrl,
        storeName: buyNowItem.storeName,
        location: buyNowItem.location,
        price: buyNowItem.price,
        originalPrice: buyNowItem.originalPrice,
        skuId: buyNowItem.skuId || buyNowItem.skuCode,
        skuCode: buyNowItem.skuCode,
        variantName: buyNowItem.variantName || 'Mặc định',
        storeId: buyNowItem.storeId,
      },
      quantity: buyNowItem.quantity || 1,
      selected: true,
      color: buyNowItem.color,
      storage: buyNowItem.storage,
    },
  ]
}

const normalizeCheckoutItems = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((item) => {
      if (!item?.productId && !item?.product?.id) {
        return null
      }

      const product = item.product || null
      const productId = item.productId ?? product?.id

      return {
        productId,
        skuId: item.skuId || product?.skuId || item.skuCode || product?.skuCode,
        skuCode: item.skuCode || product?.skuCode || '',
        variantName: item.variantName || product?.variantName || 'Mặc định',
        price: Number(item.price ?? product?.price) || 0,
        storeId: item.storeId || product?.storeId || '',
        product,
        quantity: Math.max(1, Number(item.quantity) || 1),
        selected: item.selected !== false,
        color: item.color || 'Mặc định',
        storage: item.storage || 'Mặc định',
      }
    })
    .filter(Boolean)
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { cartItems, removeSelectedItems } = useCart()
  const buyNowItem = location.state?.buyNowItem
  const checkoutItemsFromState = location.state?.checkoutItems
  const checkoutSource = location.state?.source
  const [fallbackItems, setFallbackItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [shippingMethodId, setShippingMethodId] = useState('standard')
  const [paymentMethodId, setPaymentMethodId] = useState('cod')
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherMessage, setVoucherMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  })

  useEffect(() => {
    const hasStateItems =
      Boolean(buyNowItem?.productId) ||
      (Array.isArray(checkoutItemsFromState) && checkoutItemsFromState.length > 0)

    if (hasStateItems) {
      setFallbackItems([])
      setIsLoading(false)
      return
    }

    const selectedCartItems = cartItems.filter((item) => item.selected !== false)

    if (!selectedCartItems.length) {
      setFallbackItems([])
      setIsLoading(false)
      return
    }

    let isMounted = true

    const loadFallbackItems = async () => {
      setIsLoading(true)
      const response = await productService.getProducts()

      if (!isMounted) {
        return
      }

      if (!response.success) {
        setFallbackItems([])
        setIsLoading(false)
        return
      }

      const normalizedItems = selectedCartItems
        .map((item) => {
          const product = response.data.find((productItem) => String(productItem.id) === String(item.productId))

          if (!product) {
            return null
          }

          return {
            productId: product.id,
            skuId: item.skuId || product.skuId,
            skuCode: item.skuCode || product.skuCode,
            variantName: item.variantName || product.variantName || 'Mặc định',
            price: item.price ?? product.price,
            storeId: item.storeId || product.storeId,
            product,
            quantity: item.quantity,
            selected: item.selected !== false,
            color: 'Mặc định',
            storage: 'Mặc định',
          }
        })
        .filter(Boolean)

      setFallbackItems(normalizedItems)
      setIsLoading(false)
    }

    loadFallbackItems()

    return () => {
      isMounted = false
    }
  }, [buyNowItem, cartItems, checkoutItemsFromState])

  const checkoutItems = useMemo(() => {
    if (buyNowItem?.productId) {
      return normalizeBuyNowItem(buyNowItem)
    }

    const normalizedStateItems = normalizeCheckoutItems(checkoutItemsFromState)

    if (normalizedStateItems.length) {
      return normalizedStateItems
    }

    return normalizeCheckoutItems(fallbackItems)
  }, [buyNowItem, checkoutItemsFromState, fallbackItems])

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-[#1b1c1c]">Đang tải thông tin thanh toán</h1>
          <p className="mt-3 text-base leading-7 text-[#5b403b]">
            Chúng tôi đang chuẩn bị danh sách sản phẩm đã chọn từ giỏ hàng của bạn.
          </p>
        </div>
      </section>
    )
  }

  if (!checkoutItems.length) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-[#1b1c1c]">Chưa có sản phẩm để thanh toán</h1>
          <p className="mt-3 text-base leading-7 text-[#5b403b]">
            Hãy quay lại giỏ hàng hoặc trang chi tiết sản phẩm để chọn sản phẩm trước khi tiếp tục thanh toán.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/cart"
              className="inline-flex rounded-lg bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73211]"
            >
              Quay lại giỏ hàng
            </Link>
            <Link
              to="/products"
              className="inline-flex rounded-lg border border-[#e3e2e2] px-5 py-3 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]"
            >
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const subtotal = checkoutItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
  const shippingFee = shippingOptions.find((option) => option.id === shippingMethodId)?.fee || 30000
  const total = subtotal + shippingFee
  const isBuyNowFlow = Boolean(buyNowItem?.productId)

  const handleShippingFormChange = (field, value) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: '' }))
    setSubmitError('')
  }

  const handleApplyVoucher = () => {
    setVoucherMessage(
      voucherCode.trim()
        ? 'Mã giảm giá sẽ được hỗ trợ sau trong sprint tiếp theo.'
        : 'Vui lòng nhập mã giảm giá trước khi áp dụng.',
    )
  }

  const handlePlaceOrder = () => {
    const nextErrors = {}

    if (!shippingForm.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên người nhận'
    }

    if (!shippingForm.phone.trim()) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại'
    }

    if (!shippingForm.address.trim()) {
      nextErrors.address = 'Vui lòng nhập địa chỉ nhận hàng'
    }

    if (shippingForm.email.trim() && !/^\S+@\S+\.\S+$/.test(shippingForm.email.trim())) {
      nextErrors.email = 'Vui lòng nhập email hợp lệ'
    }

    setFormErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const normalizedItems = checkoutItems
      .filter((item) => item.product && item.productId)
      .map((item) => ({
        productId: item.productId,
        skuId: item.skuId || item.skuCode || item.product.skuId,
        skuCode: item.skuCode || item.product.skuCode,
        productName: item.product.name,
        variantName: item.variantName || item.product.variantName || 'Mặc định',
        unitPrice: item.price ?? item.product.price ?? 0,
        storeId: item.storeId || item.product.storeId,
        product: item.product,
        quantity: item.quantity,
        price: item.price ?? item.product.price ?? 0,
      }))

    if (!normalizedItems.length) {
      setSubmitError('Không có sản phẩm hợp lệ để tạo đơn hàng.')
      return
    }

    if (!currentUser?.id) {
      setSubmitError('Vui lòng đăng nhập để đặt hàng.')
      return
    }

    const shippingMethod = shippingMethodId === 'express' ? 'EXPRESS' : 'STANDARD'
    const paymentMethod = paymentMethodId === 'bank' ? 'BANK_TRANSFER' : 'COD'

    const response = orderService.createOrder({
      customerId: currentUser.id,
      customerEmail: currentUser.email,
      customerName: currentUser.fullName,
      customerInfo: shippingForm,
      items: normalizedItems,
      shippingMethod,
      shippingFee,
      paymentMethod,
      discountAmount: 0,
      totalAmount: total,
    })

    if (!response.success) {
      setSubmitError(response.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.')
      return
    }

    const isCartFlow = checkoutSource === 'cart' || (!buyNowItem?.productId && cartItems.some((item) => item.selected !== false))

    if (isCartFlow) {
      removeSelectedItems()
    }

    navigate('/orders', {
      replace: true,
      state: {
        createdOrderId: response.data.id,
      },
    })
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[#1b1c1c]">Thanh toán</h1>

      {submitError ? (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
          <CheckoutAddressForm
            formData={shippingForm}
            errors={formErrors}
            onChange={handleShippingFormChange}
          />
          <CheckoutShippingMethod selectedShippingId={shippingMethodId} onChange={setShippingMethodId} />
          <CheckoutPaymentMethod selectedPaymentId={paymentMethodId} onChange={setPaymentMethodId} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <CheckoutOrderSummary
            checkoutItems={checkoutItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            voucherCode={voucherCode}
            voucherMessage={voucherMessage}
            onVoucherChange={setVoucherCode}
            onApplyVoucher={handleApplyVoucher}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>

      <p className="mt-6 text-sm leading-6 text-[#5b403b]">
        {isBuyNowFlow
          ? 'Đây là màn thanh toán mock cho flow "Mua ngay". Chúng ta chưa kết nối cổng thanh toán thật ở bước này.'
          : 'Đây là màn thanh toán mock cho các sản phẩm được chọn từ giỏ hàng. Chúng ta chưa kết nối cổng thanh toán thật ở bước này.'}
      </p>
    </section>
  )
}
