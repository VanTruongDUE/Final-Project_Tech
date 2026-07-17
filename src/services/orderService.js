import { mockProducts } from '../mocks/products.mock'
import { apiRequest } from './apiClient'
import { getStoredSellerProducts } from './sellerService'

const ORDER_STORAGE_KEY = 'techtonic_orders'
const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'

const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export const orderStatusMeta = {
  [ORDER_STATUS.PENDING]: {
    label: 'Chá» xÃ¡c nháº­n',
    tone: 'amber',
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'ÄÃ£ xÃ¡c nháº­n',
    tone: 'blue',
  },
  [ORDER_STATUS.SHIPPING]: {
    label: 'Äang giao',
    tone: 'sky',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'HoÃ n thÃ nh',
    tone: 'emerald',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'ÄÃ£ há»§y',
    tone: 'slate',
  },
}

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const normalizeNumber = (value, fallback = 0) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const normalizeCustomerId = (customerId) => {
  if (customerId === undefined || customerId === null || customerId === '') {
    return null
  }

  return String(customerId)
}

const findProductById = (productId) =>
  [...getStoredSellerProducts(), ...mockProducts].find(
    (product) => String(product.id) === String(productId),
  )

const normalizeOrderItem = (item) => {
  const embeddedProduct = item?.product
  const productId = item?.productId ?? embeddedProduct?.id
  const catalogProduct = findProductById(productId)
  const product = embeddedProduct || catalogProduct

  if (!productId || !product) {
    return null
  }

  const quantity = Math.max(1, normalizeNumber(item.quantity, 1))
  const unitPrice = normalizeNumber(item.unitPrice ?? item.price ?? product.price, 0)
  const skuCode = item.skuCode || product.skuCode || catalogProduct?.skuCode || ''

  return {
    productId,
    variantId: item.variantId || product.variantId || catalogProduct?.variantId || null,
    skuId: item.skuId || product.skuId || catalogProduct?.skuId || skuCode,
    skuCode,
    productName: item.productName || product.name || '',
    variantName: item.variantName || product.variantName || catalogProduct?.variantName || 'Máº·c Ä‘á»‹nh',
    unitPrice,
    product,
    quantity,
    price: unitPrice,
    storeId: item.storeId || product.storeId || catalogProduct?.storeId || '',
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
      const customerId = normalizeCustomerId(order.customerId)

      return {
        id: order.id,
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || ORDER_STATUS.PENDING,
        customerId,
        customerEmail: order.customerEmail?.trim() || '',
        customerName: order.customerName?.trim() || '',
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

const readOrders = () => {
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

const normalizeApiStatus = (status) => {
  if (status === 'PROCESSING' || status === 'PACKING') {
    return ORDER_STATUS.CONFIRMED
  }

  if (status === 'SHIPPING' || status === 'COMPLETED' || status === 'CANCELLED' || status === 'PENDING') {
    return status
  }

  if (status === 'CONFIRMED') {
    return ORDER_STATUS.CONFIRMED
  }

  return ORDER_STATUS.PENDING
}

const normalizePaymentMethod = (method) => (method === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : 'COD')

const buildApiProduct = ({ productId, name, imageUrl, storeName, storeId, price }) => ({
  id: productId,
  name: name || 'Sáº£n pháº©m Ä‘Ã£ mua',
  imageUrl,
  storeName: storeName || 'TechToShop',
  storeId,
  price: normalizeNumber(price, 0),
  category: 'ÄÆ¡n hÃ ng mua sáº¯m',
})

const mapApiOrderSummary = (order) => {
  const productName = order.first_item || 'Sáº£n pháº©m Ä‘Ã£ mua'
  const totalAmount = normalizeNumber(order.total_amount, 0)

  return {
    id: String(order.order_id),
    code: order.order_code,
    createdAt: order.created_at,
    status: normalizeApiStatus(order.order_status),
    customerId: null,
    customerEmail: '',
    customerName: '',
    customerInfo: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      note: '',
    },
    items: [
      {
        productId: '',
        variantId: null,
        skuId: '',
        skuCode: '',
        productName,
        variantName: 'Máº·c Ä‘á»‹nh',
        unitPrice: totalAmount,
        product: buildApiProduct({
          productId: '',
          name: productName,
          storeName: order.store_name,
          price: totalAmount,
        }),
        quantity: 1,
        price: totalAmount,
        storeId: order.store_id || '',
      },
    ],
    subtotal: totalAmount,
    shippingMethod: 'STANDARD',
    shippingFee: 0,
    paymentMethod: 'COD',
    discountAmount: 0,
    totalAmount,
  }
}

const mapApiOrderDetail = (order) => {
  const storeName = order.store?.store_name || 'TechToShop'
  const storeId = order.store_id || ''
  const items = (order.items || []).map((item) => {
    const unitPrice = normalizeNumber(item.unit_price, 0)
    const skuCode = item.sku_code || item.sku_code_snapshot || ''
    const variantName = item.variant_name || item.variant_name_snapshot || 'Mặc định'
    const productName = item.product_name_snapshot || item.product_name || 'Sản phẩm đã mua'

    return {
      orderItemId: item.order_item_id,
      productId: item.product_id,
      variantId: item.variant_id ?? null,
      skuId: item.sku_id || skuCode,
      skuCode,
      productName,
      variantName,
      unitPrice,
      product: buildApiProduct({
        productId: item.product_id,
        variantId: item.variant_id ?? null,
        name: productName,
        imageUrl: item.product_image_url_snapshot,
        storeName,
        storeId,
        price: unitPrice,
      }),
      quantity: normalizeNumber(item.quantity, 1),
      price: unitPrice,
      storeId,
    }
  })

  return {
    id: String(order.order_id),
    code: order.order_code,
    createdAt: order.created_at,
    status: normalizeApiStatus(order.order_status),
    customerId: null,
    customerEmail: '',
    customerName: order.recipient_name || '',
    customerInfo: {
      fullName: order.recipient_name || '',
      phone: order.recipient_phone || '',
      email: '',
      address: [
        order.shipping_address_line,
        order.shipping_ward,
        order.shipping_district,
        order.shipping_province,
      ]
        .filter(Boolean)
        .join(', '),
      note: order.customer_note || '',
    },
    items,
    subtotal: normalizeNumber(order.subtotal, 0),
    shippingMethod: 'STANDARD',
    shippingFee: normalizeNumber(order.shipping_fee, 0),
    paymentMethod: normalizePaymentMethod(order.payment_method),
    discountAmount: normalizeNumber(order.discount_amount, 0),
    totalAmount: normalizeNumber(order.total_amount, 0),
    vouchers: (order.vouchers || []).map((voucher) => ({
      id: voucher.voucher_id,
      code: voucher.voucher_code,
      discountType: voucher.discount_type,
      discountValue: normalizeNumber(voucher.discount_value, 0),
      discountAmount: normalizeNumber(voucher.discount_amount, 0),
      applicationStatus: voucher.application_status,
      appliedAt: voucher.applied_at,
      reversedAt: voucher.reversed_at,
    })),
  }
}

const groupItemsByStore = (items) =>
  items.reduce((groups, item) => {
    const storeId = item.storeId || item.product?.storeId

    if (!storeId) {
      return groups
    }

    const key = String(storeId)
    groups[key] = groups[key] || []
    groups[key].push(item)
    return groups
  }, {})

const getShippingProvince = (customerInfo = {}) => {
  const addressParts = String(customerInfo.address || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  return customerInfo.province || addressParts.at(-1) || 'Viá»‡t Nam'
}

export const orderService = {
  isApiMode() {
    return USE_API
  },

  getStorageKey() {
    return ORDER_STORAGE_KEY
  },

  async getOrders(customerId) {
    if (USE_API) {
      const result = await apiRequest('/orders?limit=100')
      return (result.data?.orders || []).map(mapApiOrderSummary)
    }

    const orders = readOrders()
    const normalizedCustomerId = normalizeCustomerId(customerId)

    if (!normalizedCustomerId) {
      return orders
    }

    return orders.filter((order) => order.customerId === normalizedCustomerId)
  },

  async getOrderById(orderId, customerId) {
    if (USE_API) {
      try {
        const result = await apiRequest(`/orders/${orderId}`)

        return {
          success: true,
          data: mapApiOrderDetail(result.data),
        }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        }
      }
    }

    const normalizedCustomerId = normalizeCustomerId(customerId)

    if (!orderId || !normalizedCustomerId) {
      return {
        success: false,
        message: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng',
      }
    }

    const order = readOrders().find(
      (item) => item.id === orderId && item.customerId === normalizedCustomerId,
    )

    if (!order) {
      return {
        success: false,
        message: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng',
      }
    }

    return {
      success: true,
      data: order,
    }
  },

  async createOrder(orderPayload) {
    if (USE_API) {
      const normalizedItems = Array.isArray(orderPayload?.items)
        ? orderPayload.items.map(normalizeOrderItem).filter(Boolean)
        : []
      const itemsByStore = groupItemsByStore(normalizedItems)
      const storeEntries = Object.entries(itemsByStore)

      if (!storeEntries.length) {
        return {
          success: false,
          message: 'KhÃ´ng cÃ³ sáº£n pháº©m há»£p lá»‡ Ä‘á»ƒ táº¡o Ä‘Æ¡n hÃ ng.',
        }
      }

      try {
        const createdOrders = []

        for (const [storeId, storeItems] of storeEntries) {
          const result = await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({
              store_id: Number(storeId),
              items: storeItems.map((item) => ({
                product_id: Number(item.productId),
                variant_id: item.variantId ? Number(item.variantId) : undefined,
                quantity: normalizeNumber(item.quantity, 1),
              })),
              recipient_name: orderPayload.customerInfo?.fullName?.trim(),
              recipient_phone: orderPayload.customerInfo?.phone?.trim(),
              shipping_address_line: orderPayload.customerInfo?.addressLine?.trim() || orderPayload.customerInfo?.address?.trim(),
              shipping_ward: orderPayload.customerInfo?.ward?.trim() || undefined,
              shipping_district: orderPayload.customerInfo?.district?.trim() || undefined,
              shipping_province: orderPayload.customerInfo?.province?.trim() || getShippingProvince(orderPayload.customerInfo),
              address_id: orderPayload.customerInfo?.addressId ? Number(orderPayload.customerInfo.addressId) : undefined,
              payment_method: normalizePaymentMethod(orderPayload.paymentMethod),
              customer_note: orderPayload.customerInfo?.note?.trim() || undefined,
              voucher_code: orderPayload.voucherCode?.trim() || undefined,
            }),
          })

          createdOrders.push(result.data)
        }

        const firstOrder = createdOrders[0]

        return {
          success: true,
          data: {
            id: String(firstOrder.order_id),
            code: firstOrder.order_code,
            orders: createdOrders,
            orderIds: createdOrders.map((order) => order.order_id),
            totalAmount: createdOrders.reduce(
              (total, order) => total + normalizeNumber(order.total_amount, 0),
              0,
            ),
          },
        }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        }
      }
    }

    const customerId = normalizeCustomerId(orderPayload?.customerId)

    if (!customerId) {
      return {
        success: false,
        message: 'KhÃ´ng thá»ƒ táº¡o Ä‘Æ¡n hÃ ng khi thiáº¿u thÃ´ng tin ngÆ°á»i mua',
      }
    }

    const existingOrders = readOrders()
    const normalizedItems = Array.isArray(orderPayload?.items)
      ? orderPayload.items.map(normalizeOrderItem).filter(Boolean)
      : []

    if (!normalizedItems.length) {
      return {
        success: false,
        message: 'KhÃ´ng cÃ³ sáº£n pháº©m há»£p lá»‡ Ä‘á»ƒ táº¡o Ä‘Æ¡n hÃ ng',
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
      customerId,
      customerEmail: orderPayload.customerEmail?.trim() || '',
      customerName: orderPayload.customerName?.trim() || '',
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

  async cancelOrder(orderId, customerId) {
    if (USE_API) {
      try {
        await apiRequest(`/orders/${orderId}/cancel`, {
          method: 'POST',
          body: JSON.stringify({
            cancel_reason: 'KhÃ¡ch hÃ ng há»§y Ä‘Æ¡n tá»« giao diá»‡n mua hÃ ng.',
          }),
        })

        return this.getOrderById(orderId, customerId)
      } catch (error) {
        return {
          success: false,
          message: error.message,
        }
      }
    }

    const normalizedCustomerId = normalizeCustomerId(customerId)

    if (!normalizedCustomerId) {
      return {
        success: false,
        message: 'KhÃ´ng thá»ƒ há»§y Ä‘Æ¡n hÃ ng khi thiáº¿u thÃ´ng tin ngÆ°á»i mua',
      }
    }

    const orders = readOrders()
    const targetOrder = orders.find((order) => order.id === orderId && order.customerId === normalizedCustomerId)

    if (!targetOrder) {
      return {
        success: false,
        message: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng',
      }
    }

    if (targetOrder.status !== ORDER_STATUS.PENDING) {
      return {
        success: false,
        message: 'Chá»‰ cÃ³ thá»ƒ há»§y Ä‘Æ¡n hÃ ng Ä‘ang chá» xÃ¡c nháº­n',
      }
    }

    const nextOrders = orders.map((order) =>
      order.id === orderId && order.customerId === normalizedCustomerId
        ? { ...order, status: ORDER_STATUS.CANCELLED }
        : order,
    )

    const savedOrders = saveOrders(nextOrders)
    const cancelledOrder = savedOrders.find(
      (order) => order.id === orderId && order.customerId === normalizedCustomerId,
    )

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
