import { useCallback, useEffect, useMemo, useState } from 'react'
import { cartService } from '../services/cartService'
import { CartContext } from './cart-context'
import { useAuth } from './useAuth'

export function CartProvider({ children }) {
  const { currentUser } = useAuth()
  const isApiMode = cartService.isApiMode()
  const [cartItems, setCartItems] = useState(() => cartService.getCartItems())

  const refreshCart = useCallback(async () => {
    if (isApiMode) {
      if (!currentUser?.id) {
        setCartItems([])
        return []
      }

      const nextItems = await cartService.getCartItemsAsync()
      setCartItems(nextItems)
      return nextItems
    }

    const nextItems = cartService.getCartItems()
    setCartItems(nextItems)
    return nextItems
  }, [currentUser?.id, isApiMode])

  const addItem = useCallback(async (productId, quantity = 1, variantId = undefined) => {
    const nextItems = await cartService.addToCart(productId, quantity, variantId)
    setCartItems(nextItems)
    return nextItems
  }, [])

  const updateSelected = useCallback((productId, selected) => {
    if (isApiMode) {
      setCartItems((items) =>
        items.map((item) =>
          String(item.cartItemId || item.productId) === String(productId) ? { ...item, selected: Boolean(selected) } : item,
        ),
      )
      return
    }

    setCartItems(cartService.updateCartItemSelected(productId, selected))
  }, [isApiMode])

  const updateAllSelected = useCallback((selected) => {
    if (isApiMode) {
      setCartItems((items) => items.map((item) => ({ ...item, selected: Boolean(selected) })))
      return
    }

    setCartItems(cartService.updateAllSelected(selected))
  }, [isApiMode])

  const updateQuantity = useCallback(async (productId, quantity) => {
    const nextItems = await cartService.updateCartItemQuantity(productId, quantity)
    setCartItems((currentItems) =>
      nextItems.map((nextItem) => {
        const currentItem = currentItems.find(
          (item) => String(item.cartItemId || item.productId) === String(nextItem.cartItemId || nextItem.productId),
        )

        return {
          ...nextItem,
          selected: currentItem?.selected !== false,
        }
      }),
    )
    return nextItems
  }, [])

  const removeItem = useCallback(async (productId) => {
    const nextItems = await cartService.removeCartItem(productId)
    setCartItems(nextItems)
    return nextItems
  }, [])

  const removeSelectedItems = useCallback(async () => {
    if (isApiMode) {
      const selectedItems = cartItems.filter((item) => item.selected !== false)

      await Promise.all(
        selectedItems.map((item) => cartService.removeCartItem(item.cartItemId || item.productId)),
      )

      return refreshCart()
    }

    setCartItems(cartService.removeSelectedItems())
    return cartService.getCartItems()
  }, [cartItems, isApiMode, refreshCart])

  const clearCart = useCallback(async () => {
    const nextItems = await cartService.clearCart()
    setCartItems(nextItems)
    return nextItems
  }, [])

  useEffect(() => {
    refreshCart().catch(() => {
      setCartItems([])
    })
  }, [refreshCart])

  useEffect(() => {
    if (isApiMode) {
      return undefined
    }

    const handleStorageChange = (event) => {
      if (event.key && event.key !== cartService.getStorageKey()) {
        return
      }

      refreshCart()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [isApiMode, refreshCart])

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      refreshCart,
      addItem,
      updateQuantity,
      updateSelected,
      updateAllSelected,
      removeItem,
      removeSelectedItems,
      clearCart,
    }),
    [addItem, cartCount, cartItems, clearCart, refreshCart, removeItem, removeSelectedItems, updateAllSelected, updateQuantity, updateSelected],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
