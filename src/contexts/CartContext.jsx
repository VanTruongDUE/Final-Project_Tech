import { useCallback, useEffect, useMemo, useState } from 'react'
import { cartService } from '../services/cartService'
import { CartContext } from './cart-context'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => cartService.getCartItems())

  const refreshCart = useCallback(() => {
    setCartItems(cartService.getCartItems())
  }, [])

  const addItem = useCallback((productId, quantity = 1) => {
    setCartItems(cartService.addToCart(productId, quantity))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems(cartService.updateCartItemQuantity(productId, quantity))
  }, [])

  const updateSelected = useCallback((productId, selected) => {
    setCartItems(cartService.updateCartItemSelected(productId, selected))
  }, [])

  const updateAllSelected = useCallback((selected) => {
    setCartItems(cartService.updateAllSelected(selected))
  }, [])

  const removeItem = useCallback((productId) => {
    setCartItems(cartService.removeCartItem(productId))
  }, [])

  const removeSelectedItems = useCallback(() => {
    setCartItems(cartService.removeSelectedItems())
  }, [])

  const clearCart = useCallback(() => {
    setCartItems(cartService.clearCart())
  }, [])

  useEffect(() => {
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
  }, [refreshCart])

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
