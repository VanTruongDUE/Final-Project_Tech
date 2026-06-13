const ORDER_STORAGE_KEY = 'techtonic_orders'

const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export const orderStatusMeta = {
  [ORDER_STATUS.PENDING]: {
    label: 'Chờ xác nhận',
    tone: 'amber',
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Đã xác nhận',
    tone: 'blue',
  },
  [ORDER_STATUS.SHIPPING]: {
    label: 'Đang giao',
    tone: 'sky',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'Hoàn thành',
    tone: 'emerald',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Đã hủy',
    tone: 'slate',
  },
}

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const normalizeNumber = (value, fallback = 0) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const normalizeOrderItem = (item) => {
  const product = item?.product
  const productId = item?.productId ?? product?.id

  if (!productId || !product) {
    return null
  }

  const quantity = Math.max(1, normalizeNumber(item.quantity, 1))
  const price = normalizeNumber(item.price ?? product.price, 0)

  return {
    productId,
    product,
    quantity,
    price,
  }
}

const sanitizeOrders = (orders) => {
  if (!Array.isArray(orders)) {
    return []
  }

  return orders
    .map((order) => {
      const items = Array.isArray(order?.items) ? order.items.map(normalizeOrderItem).filter(Boolean) : []

      if (!order?.id || !items.length) {
        return null
      }

      const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
      const shippingFee = Math.max(0, normalizeNumber(order.shippingFee, 0))
      const discountAmount = Math.max(0, normalizeNumber(order.discountAmount, 0))
      const totalAmount = Math.max(0, normalizeNumber(order.totalAmount, subtotal + shippingFee - discountAmount))

      return {
        id: order.id,
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || ORDER_STATUS.PENDING,
        customerInfo: {
          fullName: order.customerInfo?.fullName?.trim() || '',
          phone: order.customerInfo?.phone?.trim() || '',
          email: order.customerInfo?.email?.trim() || '',
          address: order.customerInfo?.address?.trim() || '',
          note: order.customerInfo?.note?.trim() || '',
        },
        items,
        subtotal,
        shippingMethod: order.shippingMethod || 'STANDARD',
        shippingFee,
        paymentMethod: order.paymentMethod || 'COD',
        discountAmount,
        totalAmount,
      }
    })
    .filter(Boolean)
    .sort((firstOrder, secondOrder) => new Date(secondOrder.createdAt) - new Date(firstOrder.createdAt))
}

const saveOrders = (orders) => {
  const sanitizedOrders = sanitizeOrders(orders)

  if (canUseStorage()) {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(sanitizedOrders))
  }

  return sanitizedOrders
}

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}${month}${day}`
}

const buildOrderId = (orders) => {
  const dateKey = getDateKey()
  const todayOrderCount = orders.filter((order) => order.id.startsWith(`ORD-${dateKey}-`)).length
  const sequence = `${todayOrderCount + 1}`.padStart(4, '0')
  return `ORD-${dateKey}-${sequence}`
}

export const orderService = {
  getStorageKey() {
    return ORDER_STORAGE_KEY
  },

  getOrders() {
    if (!canUseStorage()) {
      return []
    }

    try {
      const rawOrders = window.localStorage.getItem(ORDER_STORAGE_KEY)
      const parsedOrders = rawOrders ? JSON.parse(rawOrders) : []
      const sanitizedOrders = sanitizeOrders(parsedOrders)

      if (rawOrders && JSON.stringify(parsedOrders) !== JSON.stringify(sanitizedOrders)) {
        saveOrders(sanitizedOrders)
      }

      return sanitizedOrders
    } catch {
      window.localStorage.removeItem(ORDER_STORAGE_KEY)
      return []
    }
  },

  getOrderById(orderId) {
    const order = this.getOrders().find((item) => item.id === orderId)

    if (!order) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng',
      }
    }

    return {
      success: true,
      data: order,
    }
  },

  createOrder(orderPayload) {
    const existingOrders = this.getOrders()
    const normalizedItems = Array.isArray(orderPayload?.items)
      ? orderPayload.items.map(normalizeOrderItem).filter(Boolean)
      : []

    if (!normalizedItems.length) {
      return {
        success: false,
        message: 'Không có sản phẩm hợp lệ để tạo đơn hàng',
      }
    }

    const subtotal = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shippingFee = Math.max(0, normalizeNumber(orderPayload.shippingFee, 0))
    const discountAmount = Math.max(0, normalizeNumber(orderPayload.discountAmount, 0))
    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount)

    const nextOrder = {
      id: buildOrderId(existingOrders),
      createdAt: new Date().toISOString(),
      status: ORDER_STATUS.PENDING,
      customerInfo: {
        fullName: orderPayload.customerInfo?.fullName?.trim() || '',
        phone: orderPayload.customerInfo?.phone?.trim() || '',
        email: orderPayload.customerInfo?.email?.trim() || '',
        address: orderPayload.customerInfo?.address?.trim() || '',
        note: orderPayload.customerInfo?.note?.trim() || '',
      },
      items: normalizedItems,
      subtotal,
      shippingMethod: orderPayload.shippingMethod || 'STANDARD',
      shippingFee,
      paymentMethod: orderPayload.paymentMethod || 'COD',
      discountAmount,
      totalAmount,
    }

    saveOrders([nextOrder, ...existingOrders])

    return {
      success: true,
      data: nextOrder,
    }
  },

  cancelOrder(orderId) {
    const orders = this.getOrders()
    const targetOrder = orders.find((order) => order.id === orderId)

    if (!targetOrder) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng',
      }
    }

    if (targetOrder.status !== ORDER_STATUS.PENDING) {
      return {
        success: false,
        message: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận',
      }
    }

    const nextOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: ORDER_STATUS.CANCELLED } : order,
    )

    const savedOrders = saveOrders(nextOrders)
    const cancelledOrder = savedOrders.find((order) => order.id === orderId)

    return {
      success: true,
      data: cancelledOrder,
    }
  },

  clearOrders() {
    return saveOrders([])
  },
}

export { ORDER_STATUS }
