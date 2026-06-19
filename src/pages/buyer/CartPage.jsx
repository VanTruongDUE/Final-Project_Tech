import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../../components/buyer/CartItem'
import CartSummary from '../../components/buyer/CartSummary'
import { useCart } from '../../contexts/useCart'
import { productService } from '../../services/productService'

export default function CartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, updateSelected, updateAllSelected, removeItem, removeSelectedItems, clearCart } = useCart()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutMessage, setCheckoutMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)
      const response = await productService.getProducts()

      if (!isMounted) {
        return
      }

      setProducts(response.success ? response.data : [])
      setIsLoading(false)
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (isLoading || !products.length) {
      return
    }

    cartItems.forEach((item) => {
      const product = products.find((productItem) => String(productItem.id) === String(item.productId))

      if (!product) {
        return
      }

      const maxQuantity = Math.max(1, product.stockQuantity || 1)

      if (item.quantity > maxQuantity) {
        updateQuantity(item.productId, maxQuantity)
      }
    })
  }, [cartItems, isLoading, products, updateQuantity])

  const detailedItems = useMemo(
    () =>
      cartItems
        .map((item) => ({
          item,
          product: products.find((product) => String(product.id) === String(item.productId)),
        }))
        .filter(({ product }) => Boolean(product)),
    [cartItems, products],
  )

  const groupedItems = useMemo(() => {
    return detailedItems.reduce((groups, detail) => {
      const groupKey = detail.product.storeId || detail.product.storeName

      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          storeName: detail.product.storeName,
          items: [],
        }
      }

      groups[groupKey].items.push(detail)
      return groups
    }, {})
  }, [detailedItems])

  const invalidItemCount = cartItems.length - detailedItems.length
  const selectedItems = detailedItems.filter(({ item }) => item.selected !== false)
  const totalQuantity = selectedItems.reduce((total, { item }) => total + item.quantity, 0)
  const subtotal = selectedItems.reduce(
    (total, { item, product }) => total + item.quantity * product.price,
    0,
  )
  const selectedItemTypeCount = selectedItems.length
  const allSelected = detailedItems.length > 0 && detailedItems.every(({ item }) => item.selected !== false)
  const selectedCartCount = selectedItems.length

  const handleQuantityChange = (productId, quantity) => {
    const product = products.find((item) => String(item.id) === String(productId))

    if (!product) {
      return
    }

    const maxQuantity = product.stockQuantity || 1
    updateQuantity(productId, Math.min(maxQuantity, Math.max(1, quantity)))
  }

  const handleCheckout = () => {
    if (!selectedItems.length) {
      setCheckoutMessage('Vui lòng chọn sản phẩm để thanh toán')
      return
    }

    setCheckoutMessage('')

    navigate('/checkout', {
      state: {
        source: 'cart',
        checkoutItems: selectedItems.map(({ item, product }) => ({
          productId: product.id,
          product,
          quantity: item.quantity,
          selected: item.selected !== false,
        })),
      },
    })
  }

  const handleToggleStore = (storeItems, checked) => {
    storeItems.forEach(({ product }) => updateSelected(product.id, checked))
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#e3e2e2] bg-white p-10 text-center text-[#5b403b] shadow-sm">
          Đang tải giỏ hàng...
        </div>
      </section>
    )
  }

  if (!detailedItems.length) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#e3e2e2] bg-white p-10 text-center shadow-sm">
          <p className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">
            <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
              shopping_cart
            </span>
          </p>
          <h1 className="mt-5 text-2xl font-bold text-[#1b1c1c]">Giỏ hàng của bạn đang trống</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5b403b]">
            Hãy tiếp tục mua sắm và thêm những sản phẩm yêu thích vào giỏ hàng của bạn.
          </p>
          {invalidItemCount > 0 ? (
            <p className="mt-3 text-sm text-[#8f7069]">
              Một số sản phẩm trong giỏ không còn khả dụng nên đã được ẩn khỏi danh sách.
            </p>
          ) : null}
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73211]"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1b1c1c]">Giỏ hàng của bạn</h1>
          <p className="mt-1 text-sm text-[#5b403b]">{selectedCartCount} sản phẩm đang được chọn</p>
        </div>
        {invalidItemCount > 0 ? (
          <p className="rounded border border-[#e3beb6] bg-[#fff8f6] px-3 py-2 text-sm text-[#8f7069]">
            {invalidItemCount} sản phẩm không còn khả dụng nên không được tính vào giỏ hàng.
          </p>
        ) : null}
      </div>

      {checkoutMessage ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {checkoutMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {Object.values(groupedItems).map((group) => {
            const storeSelected = group.items.every(({ item }) => item.selected !== false)

            return (
              <section key={group.key} className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#e3e2e2] bg-[#f5f3f3] px-6 py-4">
                  <input
                    type="checkbox"
                    checked={storeSelected}
                    onChange={(event) => handleToggleStore(group.items, event.target.checked)}
                    className="h-5 w-5 rounded border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                    aria-label={`Chọn cửa hàng ${group.storeName}`}
                  />
                  <span className="material-symbols-outlined text-[18px] text-[#8f7069]" aria-hidden="true">
                    storefront
                  </span>
                  <h2 className="text-sm font-semibold text-[#1b1c1c]">{group.storeName}</h2>
                </div>

                <div className="space-y-5 p-6">
                  {group.items.map(({ item, product }) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      product={product}
                      onQuantityChange={handleQuantityChange}
                      onToggleSelected={updateSelected}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </section>
            )
          })}

          <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-[#1b1c1c]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => updateAllSelected(event.target.checked)}
                className="h-5 w-5 rounded border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]"
              />
              Chọn tất cả ({detailedItems.length})
            </label>

            <button
              type="button"
              onClick={removeSelectedItems}
              className="flex items-center gap-2 text-sm font-semibold text-[#ba1a1a] transition hover:text-[#93000a]"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                delete
              </span>
              Xóa mục đã chọn
            </button>
          </div>
        </div>

        <div className="lg:col-span-4">
          <CartSummary
            itemTypeCount={selectedItemTypeCount}
            totalQuantity={totalQuantity}
            subtotal={subtotal}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
          />
        </div>
      </div>
    </section>
  )
}
