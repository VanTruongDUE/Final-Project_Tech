import { mockProducts } from '../mocks/products.mock'
import { apiRequest } from './apiClient'
import { getStoredSellerProducts } from './sellerService'

const CART_STORAGE_KEY = 'techtonic_cart'
const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const findProductById = (productId) =>
  [...getStoredSellerProducts(), ...mockProducts].find(
    (product) => String(product.id) === String(productId),
  )

const normalizeQuantity = (quantity) => {
  const parsedQuantity = Number(quantity)

  if (!Number.isFinite(parsedQuantity)) {
    return 1
  }

  return Math.max(1, Math.floor(parsedQuantity))
}

const normalizeCartItem = (item) => {
  if (!item || item.productId === undefined || item.productId === null) {
    return null
  }

  const product = findProductById(item.productId)
  const skuCode = item.skuCode || product?.skuCode || ''
  const price = Number(item.price ?? product?.price)
  const variantId = item.variantId || product?.variantId || product?.defaultVariantId || ''

  return {
    cartItemId: item.cartItemId,
    productId: item.productId,
    variantId,
    skuId: item.skuId || product?.skuId || skuCode,
    skuCode,
    variantName: item.variantName || product?.variantName || 'Mặc định',
    quantity: normalizeQuantity(item.quantity),
    price: Number.isFinite(price) ? price : 0,
    storeId: item.storeId || product?.storeId || '',
    selected: item.selected !== false,
    addedAt: item.addedAt || new Date().toISOString(),
  }
}

const normalizeApiCartItem = (item) => {
  if (!item?.product_id) {
    return null
  }

  const price = Number(item.current_price ?? item.price_at_added) || 0
  const stockQuantity = Number(item.stock_quantity) || 0
  const productName = item.product_name || ''

  return {
    cartItemId: item.cart_item_id,
    productId: item.product_id,
    variantId: item.variant_id ?? null,
    skuId: item.sku_id || item.sku_code || '',
    skuCode: item.sku_code || '',
    variantName: item.variant_name || 'Mặc định',
    quantity: normalizeQuantity(item.quantity),
    price,
    storeId: item.store_id || '',
    stockQuantity,
    selected: true,
    addedAt: item.created_at || new Date().toISOString(),
    product: {
      id: item.product_id,
      name: productName,
      imageUrl: item.primary_image,
      price,
      originalPrice: price,
      variantId: item.variant_id ?? null,
      skuId: item.sku_id || item.sku_code || '',
      skuCode: item.sku_code || '',
      variantName: item.variant_name || 'Mặc định',
      storeId: item.store_id || '',
      storeName: item.store_name || 'TechToShop',
      stockQuantity,
      status: item.product_status,
    },
  }
}

const resolveApiCartItemId = async (productOrCartItemId) => {
  const cartItems = await cartService.getCartItemsAsync()
  const targetItem = cartItems.find(
    (item) =>
      String(item.cartItemId) === String(productOrCartItemId) ||
      String(item.variantId) === String(productOrCartItemId) ||
      String(item.productId) === String(productOrCartItemId),
  )

  return targetItem?.cartItemId || productOrCartItemId
}

const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  return items.reduce((cartItems, item) => {
    const normalizedItem = normalizeCartItem(item)

    if (!normalizedItem) {
      return cartItems
    }

    const existingItem = cartItems.find((cartItem) => (
      String(cartItem.productId) === String(normalizedItem.productId)
      && String(cartItem.variantId || cartItem.skuCode || '') === String(normalizedItem.variantId || normalizedItem.skuCode || '')
    ))

    if (existingItem) {
      existingItem.quantity += normalizedItem.quantity
      return cartItems
    }

    return [...cartItems, normalizedItem]
  }, [])
}

const saveCartItems = (items) => {
  const sanitizedItems = sanitizeCartItems(items)

  if (canUseStorage()) {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitizedItems))
  }

  return sanitizedItems
}

export const cartService = {
  isApiMode() {
    return USE_API
  },

  getStorageKey() {
    return CART_STORAGE_KEY
  },

  getCartItems() {
    if (USE_API) {
      return []
    }

    if (!canUseStorage()) {
      return []
    }

    try {
      const rawCart = window.localStorage.getItem(CART_STORAGE_KEY)
      const parsedCart = rawCart ? JSON.parse(rawCart) : []
      const sanitizedItems = sanitizeCartItems(parsedCart)

      if (rawCart && JSON.stringify(parsedCart) !== JSON.stringify(sanitizedItems)) {
        saveCartItems(sanitizedItems)
      }

      return sanitizedItems
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY)
      return []
    }
  },

  async getCartItemsAsync() {
    if (!USE_API) {
      return this.getCartItems()
    }

    const result = await apiRequest('/cart')
    const items = result.data?.items || []

    return items.map(normalizeApiCartItem).filter(Boolean)
  },

  async addToCart(productOrId, quantity = 1, variantId = undefined) {
    if (USE_API) {
      const productId = typeof productOrId === 'object'
        ? productOrId?.id ?? productOrId?.productId
        : productOrId
      const selectedVariantId = variantId ?? (
        typeof productOrId === 'object'
          ? productOrId?.variantId ?? productOrId?.selectedVariantId ?? productOrId?.defaultVariantId
          : undefined
      )

      if (!productId) {
        throw new Error('Không tìm thấy sản phẩm để thêm vào giỏ hàng.')
      }

      const body = {
        product_id: Number(productId),
        quantity: normalizeQuantity(quantity),
      }

      if (selectedVariantId) {
        body.variant_id = Number(selectedVariantId)
      }

      await apiRequest('/cart/items', {
        method: 'POST',
        body: JSON.stringify(body),
      })

      return this.getCartItemsAsync()
    }

    const product = typeof productOrId === 'object'
      ? productOrId
      : findProductById(productOrId)
    const productId = product?.id ?? productOrId
    const selectedVariantId = variantId || product?.variantId || product?.defaultVariantId || ''
    const cartItems = this.getCartItems()
    const existingItem = cartItems.find((item) => (
      String(item.productId) === String(productId)
      && String(item.variantId || item.skuCode || '') === String(selectedVariantId || product?.skuCode || '')
    ))

    if (existingItem) {
      existingItem.quantity += normalizeQuantity(quantity)
      return saveCartItems(cartItems)
    }

    return saveCartItems([
      ...cartItems,
      {
        productId,
        variantId: selectedVariantId,
        skuId: product?.skuId || product?.skuCode || '',
        skuCode: product?.skuCode || '',
        variantName: product?.variantName || 'Mặc định',
        quantity: normalizeQuantity(quantity),
        price: Number(product?.price) || 0,
        storeId: product?.storeId || '',
        selected: true,
        addedAt: new Date().toISOString(),
      },
    ])
  },

  async updateCartItemQuantity(productId, quantity) {
    if (USE_API) {
      const cartItemId = await resolveApiCartItemId(productId)

      await apiRequest(`/cart/items/${cartItemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: normalizeQuantity(quantity) }),
      })

      return this.getCartItemsAsync()
    }

    const nextQuantity = normalizeQuantity(quantity)
    const cartItems = this.getCartItems().map((item) =>
      String(item.productId) === String(productId) ? { ...item, quantity: nextQuantity } : item,
    )

    return saveCartItems(cartItems)
  },

  updateCartItemSelected(productId, selected) {
    if (USE_API) {
      return []
    }

    const cartItems = this.getCartItems().map((item) =>
      String(item.productId) === String(productId) ? { ...item, selected: Boolean(selected) } : item,
    )

    return saveCartItems(cartItems)
  },

  updateAllSelected(selected) {
    if (USE_API) {
      return []
    }

    const nextSelected = Boolean(selected)
    const cartItems = this.getCartItems().map((item) => ({ ...item, selected: nextSelected }))

    return saveCartItems(cartItems)
  },

  async removeCartItem(productId) {
    if (USE_API) {
      const cartItemId = await resolveApiCartItemId(productId)

      await apiRequest(`/cart/items/${cartItemId}`, {
        method: 'DELETE',
      })

      return this.getCartItemsAsync()
    }

    return saveCartItems(
      this.getCartItems().filter((item) => String(item.productId) !== String(productId)),
    )
  },

  removeSelectedItems() {
    if (USE_API) {
      return []
    }

    return saveCartItems(this.getCartItems().filter((item) => item.selected === false))
  },

  async clearCart() {
    if (USE_API) {
      await apiRequest('/cart', { method: 'DELETE' })
      return this.getCartItemsAsync()
    }

    return saveCartItems([])
  },

  getCartCount() {
    return this.getCartItems().reduce((total, item) => total + normalizeQuantity(item.quantity), 0)
  },
}
