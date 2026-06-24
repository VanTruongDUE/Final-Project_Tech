import { mockProducts } from '../mocks/products.mock'
import { getStoredSellerProducts } from './sellerService'

const CART_STORAGE_KEY = 'techtonic_cart'

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

  return {
    productId: item.productId,
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

const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  return items.reduce((cartItems, item) => {
    const normalizedItem = normalizeCartItem(item)

    if (!normalizedItem) {
      return cartItems
    }

    const existingItem = cartItems.find(
      (cartItem) => String(cartItem.productId) === String(normalizedItem.productId),
    )

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
  getStorageKey() {
    return CART_STORAGE_KEY
  },

  getCartItems() {
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

  addToCart(productOrId, quantity = 1) {
    const product = typeof productOrId === 'object'
      ? productOrId
      : findProductById(productOrId)
    const productId = product?.id ?? productOrId
    const cartItems = this.getCartItems()
    const existingItem = cartItems.find((item) => String(item.productId) === String(productId))

    if (existingItem) {
      existingItem.quantity += normalizeQuantity(quantity)
      return saveCartItems(cartItems)
    }

    return saveCartItems([
      ...cartItems,
      {
        productId,
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

  updateCartItemQuantity(productId, quantity) {
    const nextQuantity = normalizeQuantity(quantity)
    const cartItems = this.getCartItems().map((item) =>
      String(item.productId) === String(productId) ? { ...item, quantity: nextQuantity } : item,
    )

    return saveCartItems(cartItems)
  },

  updateCartItemSelected(productId, selected) {
    const cartItems = this.getCartItems().map((item) =>
      String(item.productId) === String(productId) ? { ...item, selected: Boolean(selected) } : item,
    )

    return saveCartItems(cartItems)
  },

  updateAllSelected(selected) {
    const nextSelected = Boolean(selected)
    const cartItems = this.getCartItems().map((item) => ({ ...item, selected: nextSelected }))

    return saveCartItems(cartItems)
  },

  removeCartItem(productId) {
    return saveCartItems(
      this.getCartItems().filter((item) => String(item.productId) !== String(productId)),
    )
  },

  removeSelectedItems() {
    return saveCartItems(this.getCartItems().filter((item) => item.selected === false))
  },

  clearCart() {
    return saveCartItems([])
  },

  getCartCount() {
    return this.getCartItems().reduce((total, item) => total + normalizeQuantity(item.quantity), 0)
  },
}
