import { mockProducts, PRODUCT_STATUSES } from '../mocks/products.mock'

const sellerStoreFallbackMap = {
  'seller@techtonic.vn': {
    storeId: 'STORE-SELLER-TECHTONIC',
    storeName: 'TechToShop',
  },
}

const sellerCatalogSourceIds = [3, 13, 21, 22, 4, 56, 6, 58]
const sellerManagedStoreIdsMap = {
  [sellerStoreFallbackMap['seller@techtonic.vn'].storeId]: [
    sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    ...sellerCatalogSourceIds
      .map((id) => mockProducts.find((product) => product.id === id)?.storeId)
      .filter(Boolean),
  ],
}

const statusMeta = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#D97706]',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    className: 'border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#7C3AED]',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    className: 'border border-[#0284C7]/30 bg-[#0284C7]/10 text-[#0369A1]',
  },
  PACKING: {
    label: 'Đang đóng gói',
    className: 'border border-[#0284C7]/30 bg-[#0284C7]/10 text-[#0369A1]',
  },
  SHIPPING: {
    label: 'Đang giao',
    className: 'border border-[#0D9488]/30 bg-[#0D9488]/10 text-[#0F766E]',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    className: 'border border-[#16A34A]/30 bg-[#16A34A]/10 text-[#15803D]',
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'border border-[#BA1A1A]/25 bg-[#BA1A1A]/10 text-[#BA1A1A]',
  },
}

const SELLER_ORDER_STORAGE_KEY = 'techtonic_seller_order_status_overrides'
const SELLER_PRODUCT_STORAGE_KEY = 'techtonic_seller_products'
const SELLER_DELETED_PRODUCT_STORAGE_KEY = 'techtonic_seller_deleted_product_ids'
const SELLER_SETTINGS_STORAGE_KEY = 'techtonic_seller_settings'
const SELLER_PROMOTIONS_STORAGE_KEY = 'techtonic_seller_promotions'

const sellerOrderStatusTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING'],
  PROCESSING: ['PACKING'],
  PACKING: ['SHIPPING'],
  SHIPPING: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
}

let sellerOrderStatusMemoryOverrides = {}
let sellerProductMemoryItems = []
let sellerDeletedProductMemoryIds = []
let sellerSettingsMemory = {}
let sellerPromotionsMemory = {}

const productStatusMeta = {
  [PRODUCT_STATUSES.ACTIVE]: {
    label: 'Đang hoạt động',
    className: 'bg-[#16A34A]/10 text-[#16A34A]',
  },
  [PRODUCT_STATUSES.OUT_OF_STOCK]: {
    label: 'Hết hàng',
    className: 'border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]',
  },
  [PRODUCT_STATUSES.HIDDEN]: {
    label: 'Tạm ngưng',
    className: 'border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]',
  },
}

// Mock data phục vụ FE demo Seller Orders, chưa gọi API thật.
const rawSellerOrders = [
  {
    id: '#ORD-2024-001',
    customerName: 'Nguyễn Văn A',
    customerInitials: 'NA',
    orderedAt: '2024-10-24T14:30:00',
    totalAmount: 1250000,
    status: 'PENDING',
    paymentLabel: 'COD',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Tai nghe Bluetooth TechToShop Pro',
    items: [
      {
        productId: 3,
        productName: 'Tai nghe Bluetooth TechToShop Pro',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
  {
    id: '#ORD-2024-002',
    customerName: 'Trần Thị B',
    customerInitials: 'TB',
    orderedAt: '2024-10-23T09:15:00',
    totalAmount: 3400000,
    status: 'CONFIRMED',
    paymentLabel: 'Chuyển khoản',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Bộ thiết bị làm việc tại nhà',
    items: [
      {
        productId: 13,
        productName: 'Bộ thiết bị làm việc tại nhà',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
  {
    id: '#ORD-2024-003',
    customerName: 'Lê Văn C',
    customerInitials: 'LC',
    orderedAt: '2024-10-22T16:45:00',
    totalAmount: 850000,
    status: 'PROCESSING',
    paymentLabel: 'Ví điện tử',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Tai nghe in-ear Lite Pods',
    items: [
      {
        productId: 21,
        productName: 'Tai nghe in-ear Lite Pods',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
  {
    id: '#ORD-2024-004',
    customerName: 'Phạm Ngọc D',
    customerInitials: 'PD',
    orderedAt: '2024-10-21T11:00:00',
    totalAmount: 2190000,
    status: 'PACKING',
    paymentLabel: 'COD',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Đồng hồ thông minh FitGo S2',
    items: [
      {
        productId: 22,
        productName: 'Đồng hồ thông minh FitGo S2',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
  {
    id: '#ORD-2024-005',
    customerName: 'Hoàng Mai E',
    customerInitials: 'HE',
    orderedAt: '2024-10-20T18:10:00',
    totalAmount: 1690000,
    status: 'SHIPPING',
    paymentLabel: 'Chuyển khoản',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Máy pha cà phê mini Quick Brew',
    items: [
      {
        productId: 4,
        productName: 'Máy pha cà phê mini Quick Brew',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
  {
    id: '#ORD-2024-006',
    customerName: 'Đỗ Minh Khang',
    customerInitials: 'DK',
    orderedAt: '2024-10-19T10:25:00',
    totalAmount: 4850000,
    status: 'COMPLETED',
    paymentLabel: 'Ví điện tử',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Bàn phím cơ không dây K500',
    items: [
      {
        productId: 56,
        productName: 'Bàn phím cơ không dây K500',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
  {
    id: '#ORD-2024-007',
    customerName: 'Vũ Thanh Lam',
    customerInitials: 'VL',
    orderedAt: '2024-10-18T08:40:00',
    totalAmount: 730000,
    status: 'CANCELLED',
    paymentLabel: 'COD',
    storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
    storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
    productName: 'Chuột gaming TechToShop M2',
    items: [
      {
        productId: 6,
        productName: 'Chuột gaming TechToShop M2',
        storeId: sellerStoreFallbackMap['seller@techtonic.vn'].storeId,
        quantity: 1,
      },
    ],
  },
]

const normalizeText = (value) => String(value || '').trim().toLowerCase()

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

function resolveStoreFromCurrentUser(currentUser) {
  if (!currentUser?.email) {
    return null
  }

  const mappedStore = sellerStoreFallbackMap[currentUser.email]

  if (mappedStore) {
    return mappedStore
  }

  const firstProduct = mockProducts[0]

  if (!firstProduct) {
    return null
  }

  return {
    storeId: firstProduct.storeId,
    storeName: firstProduct.storeName,
  }
}

export function resolveManagedStoreIds(storeId) {
  const normalizedStoreId = String(storeId || '').trim()

  if (!normalizedStoreId) {
    return []
  }

  return Array.from(
    new Set(sellerManagedStoreIdsMap[normalizedStoreId] || [normalizedStoreId]),
  )
}

function getProductsByStore(storeId) {
  const sellerStoredProducts = readSellerProducts().filter((product) => product.storeId === storeId)
  const sellerDeletedProductIds = new Set(readSellerDeletedProductIds().map(String))
  const storedProductMap = new Map(sellerStoredProducts.map((product) => [String(product.id), product]))

  if (storeId === sellerStoreFallbackMap['seller@techtonic.vn'].storeId) {
    const catalogStocks = [45, 12, 51, 37, 0, 26, 19, 24]
    const catalogSold = [128, 54, 840, 1540, 310, 590, 2110, 520]
    const catalogStatuses = [
      PRODUCT_STATUSES.ACTIVE,
      PRODUCT_STATUSES.ACTIVE,
      PRODUCT_STATUSES.ACTIVE,
      PRODUCT_STATUSES.ACTIVE,
      PRODUCT_STATUSES.HIDDEN,
      PRODUCT_STATUSES.ACTIVE,
      PRODUCT_STATUSES.ACTIVE,
      PRODUCT_STATUSES.ACTIVE,
    ]

    const catalogProducts = sellerCatalogSourceIds
      .map((id, index) => {
        const product = mockProducts.find((item) => item.id === id)

        if (!product) {
          return null
        }

        const baseProduct = {
          ...product,
          storeId,
          storeName: sellerStoreFallbackMap['seller@techtonic.vn'].storeName,
          stockQuantity: catalogStocks[index] ?? product.stockQuantity,
          soldQuantity: catalogSold[index] ?? product.soldQuantity,
          status: catalogStatuses[index] ?? product.status,
        }

        return {
          ...baseProduct,
          ...(storedProductMap.get(String(baseProduct.id)) || {}),
        }
      })
      .filter((product) => !sellerDeletedProductIds.has(String(product?.id)))
      .filter(Boolean)

    const addedProducts = sellerStoredProducts.filter(
      (product) => !sellerCatalogSourceIds.includes(Number(product.id)) && !sellerDeletedProductIds.has(String(product.id)),
    )

    return [...addedProducts, ...catalogProducts]
  }

  const catalogProducts = mockProducts
    .filter((product) => product.storeId === storeId && !sellerDeletedProductIds.has(String(product.id)))
    .map((product) => ({
      ...product,
      ...(storedProductMap.get(String(product.id)) || {}),
    }))
  const addedProducts = sellerStoredProducts.filter((product) => !mockProducts.some((mockProduct) => String(mockProduct.id) === String(product.id)))

  return [...addedProducts, ...catalogProducts]
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function readSellerOrderStatusOverrides() {
  if (!canUseLocalStorage()) {
    return sellerOrderStatusMemoryOverrides
  }

  try {
    const storedValue = window.localStorage.getItem(SELLER_ORDER_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : {}
  } catch {
    return {}
  }
}

function writeSellerOrderStatusOverrides(overrides) {
  sellerOrderStatusMemoryOverrides = overrides

  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(SELLER_ORDER_STORAGE_KEY, JSON.stringify(overrides))
}

function readSellerProducts() {
  if (!canUseLocalStorage()) {
    return sellerProductMemoryItems
  }

  try {
    const storedValue = window.localStorage.getItem(SELLER_PRODUCT_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : []
  } catch {
    return []
  }
}

function writeSellerProducts(products) {
  sellerProductMemoryItems = products

  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(SELLER_PRODUCT_STORAGE_KEY, JSON.stringify(products))
}

function readSellerDeletedProductIds() {
  if (!canUseLocalStorage()) {
    return sellerDeletedProductMemoryIds
  }

  try {
    const storedValue = window.localStorage.getItem(SELLER_DELETED_PRODUCT_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : []
  } catch {
    return []
  }
}

function writeSellerDeletedProductIds(productIds) {
  sellerDeletedProductMemoryIds = productIds

  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(SELLER_DELETED_PRODUCT_STORAGE_KEY, JSON.stringify(productIds))
}

function readSellerSettings() {
  if (!canUseLocalStorage()) {
    return sellerSettingsMemory
  }

  try {
    const storedValue = window.localStorage.getItem(SELLER_SETTINGS_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : {}
  } catch {
    return {}
  }
}

function writeSellerSettings(settings) {
  sellerSettingsMemory = settings

  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(SELLER_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

function readSellerPromotions() {
  if (!canUseLocalStorage()) {
    return sellerPromotionsMemory
  }

  try {
    const storedValue = window.localStorage.getItem(SELLER_PROMOTIONS_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : {}
  } catch {
    return {}
  }
}

function writeSellerPromotions(promotions) {
  sellerPromotionsMemory = promotions

  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(SELLER_PROMOTIONS_STORAGE_KEY, JSON.stringify(promotions))
}

function createSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getSellerOrdersSource() {
  const statusOverrides = readSellerOrderStatusOverrides()

  return rawSellerOrders.map((order) => ({
    ...order,
    status: statusOverrides[order.id] || order.status,
  }))
}

function isOrderInStore(order, storeId) {
  return order.storeId === storeId || order.items?.some((item) => item.storeId === storeId)
}

function formatOrderDate(dateValue) {
  const date = new Date(dateValue)

  return {
    date: new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date),
  }
}

const sellerOrderTimelineSteps = [
  { status: 'PENDING', label: 'Chờ xác nhận', icon: 'hourglass_top' },
  { status: 'CONFIRMED', label: 'Đã xác nhận', icon: 'check' },
  { status: 'PROCESSING', label: 'Đang xử lý', icon: 'inventory' },
  { status: 'PACKING', label: 'Đang đóng gói', icon: 'inventory_2' },
  { status: 'SHIPPING', label: 'Đang giao', icon: 'local_shipping' },
  { status: 'COMPLETED', label: 'Hoàn thành', icon: 'task_alt' },
]

function buildOrderDetail(order, store) {
  const orderItems = order.items?.length
    ? order.items
    : [{ productId: order.productId, productName: order.productName, quantity: 1, storeId: order.storeId }]

  const sellerProducts = getProductsByStore(store.storeId)
  const normalizedItems = orderItems.map((item) => {
    const product = sellerProducts.find((productItem) => String(productItem.id) === String(item.productId))
    const quantity = item.quantity || 1
    const unitPrice = product?.price || Math.round(order.totalAmount / quantity)

    return {
      ...item,
      productName: item.productName || product?.name || order.productName,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      imageUrl: product?.imageUrl || 'https://placehold.co/96x96/f5f3f3/1b1c1c?text=Item',
      variantLabel: product?.category || 'Sản phẩm TechToShop',
    }
  })

  const subtotal = normalizedItems.reduce((total, item) => total + item.totalPrice, 0)
  const shippingFee = order.status === 'CANCELLED' ? 0 : 35000
  const discount = order.status === 'CANCELLED' ? 0 : Math.max(0, subtotal + shippingFee - order.totalAmount)
  const activeIndex = sellerOrderTimelineSteps.findIndex((step) => step.status === order.status)
  const timeline =
    order.status === 'CANCELLED'
      ? [
          { status: 'PENDING', label: 'Chờ xác nhận', icon: 'hourglass_top', state: 'done' },
          { status: 'CANCELLED', label: 'Đã hủy', icon: 'cancel', state: 'current' },
        ]
      : sellerOrderTimelineSteps.map((step, index) => ({
          ...step,
          state: index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'pending',
        }))

  const history = timeline
    .filter((step) => step.state === 'done' || step.state === 'current')
    .map((step, index) => ({
      ...step,
      time: new Date(new Date(order.orderedAt).getTime() + index * 60 * 60 * 1000).toISOString(),
      note: step.status === 'CANCELLED' ? 'Seller đã hủy đơn hàng trong demo.' : `Đơn hàng chuyển sang trạng thái ${step.label.toLowerCase()}.`,
    }))

  return {
    ...order,
    dateMeta: formatOrderDate(order.orderedAt),
    statusMeta: statusMeta[order.status] || statusMeta.PENDING,
    items: normalizedItems,
    timeline,
    history,
    customer: {
      name: order.customerName,
      initials: order.customerInitials,
      phone: '0987 654 321',
      tier: 'Thành viên Bạc',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    },
    payment: {
      method: order.paymentLabel,
      subtotal,
      shippingFee,
      discount,
      total: order.totalAmount,
    },
  }
}

const shippingCarrierMap = {
  PENDING: { code: 'GHN', name: 'Giao Hàng Nhanh', colorClassName: 'bg-[#F26522]' },
  CONFIRMED: { code: 'GHN', name: 'Giao Hàng Nhanh', colorClassName: 'bg-[#F26522]' },
  PROCESSING: { code: 'J&T', name: 'J&T Express', colorClassName: 'bg-[#E4002B]' },
  PACKING: { code: 'SPX', name: 'SPX Express', colorClassName: 'bg-[#EE4D2D]' },
  SHIPPING: { code: 'J&T', name: 'J&T Express', colorClassName: 'bg-[#E4002B]' },
  COMPLETED: { code: 'SPX', name: 'SPX Express', colorClassName: 'bg-[#EE4D2D]' },
  CANCELLED: { code: 'GHN', name: 'Giao Hàng Nhanh', colorClassName: 'bg-[#F26522]' },
}

const shippingStatusMeta = {
  WAITING_PICKUP: {
    label: 'Chờ lấy',
    className: 'bg-[#efeded] text-[#5b403b]',
  },
  SHIPPING: {
    label: 'Đang giao',
    className: 'bg-[#DBEAFE] text-[#2563EB]',
  },
  DELIVERED: {
    label: 'Giao thành công',
    className: 'bg-[#DCFCE7] text-[#059669]',
  },
  FAILED: {
    label: 'Giao thất bại',
    className: 'bg-[#ffdad6] text-[#ba1a1a]',
  },
}

function resolveShippingStatus(orderStatus) {
  if (orderStatus === 'COMPLETED') {
    return 'DELIVERED'
  }

  if (orderStatus === 'CANCELLED') {
    return 'FAILED'
  }

  if (orderStatus === 'SHIPPING') {
    return 'SHIPPING'
  }

  return 'WAITING_PICKUP'
}

export const sellerService = {
  getSellerStore(currentUser) {
    const store = resolveStoreFromCurrentUser(currentUser)

    if (!store) {
      return {
        success: false,
        message: 'Không tìm thấy thông tin shop của tài khoản seller hiện tại.',
      }
    }

    return {
      success: true,
      data: {
        ...store,
        description: 'Khu vực vận hành dành cho nhà bán hàng TechToShop.',
      },
    }
  },

  getSellerSettings(currentUser) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy shop để tải cài đặt cửa hàng.',
      }
    }

    const store = storeResponse.data
    const settingsMap = readSellerSettings()
    const storedSettings = settingsMap[store.storeId] || {}

    return {
      success: true,
      data: {
        storeId: store.storeId,
        storeName: storedSettings.storeName || store.storeName || 'TechToShop',
        description:
          storedSettings.description ||
          'Cửa hàng chuyên cung cấp các thiết bị điện tử, phụ kiện công nghệ chính hãng với mức giá cạnh tranh và chế độ bảo hành uy tín.',
        logoUrl: storedSettings.logoUrl || '',
        isActive: typeof storedSettings.isActive === 'boolean' ? storedSettings.isActive : true,
        pickupName: storedSettings.pickupName || 'Kho TechToShop Quận 1',
        pickupAddress:
          storedSettings.pickupAddress ||
          '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        pickupPhone: storedSettings.pickupPhone || '0901234567',
      },
      meta: {
        store,
      },
    }
  },

  updateSellerSettings(currentUser, settingsPayload = {}) {
    const settingsResponse = sellerService.getSellerSettings(currentUser)

    if (!settingsResponse.success) {
      return settingsResponse
    }

    const storeName = String(settingsPayload.storeName || '').trim()
    const description = String(settingsPayload.description || '').trim()
    const pickupName = String(settingsPayload.pickupName || '').trim()
    const pickupAddress = String(settingsPayload.pickupAddress || '').trim()
    const pickupPhone = String(settingsPayload.pickupPhone || '').trim()
    const logoUrl = String(settingsPayload.logoUrl || '').trim()

    if (!storeName || !description || !pickupName || !pickupAddress || !pickupPhone) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ tên shop, mô tả và địa chỉ lấy hàng.',
      }
    }

    const currentSettings = settingsResponse.data
    const settingsMap = readSellerSettings()
    const nextSettings = {
      ...currentSettings,
      storeName,
      description,
      logoUrl,
      pickupName,
      pickupAddress,
      pickupPhone,
      isActive: Boolean(settingsPayload.isActive),
      updatedAt: new Date().toISOString(),
    }

    writeSellerSettings({
      ...settingsMap,
      [currentSettings.storeId]: nextSettings,
    })

    return {
      success: true,
      data: nextSettings,
      message: 'Đã cập nhật cài đặt cửa hàng bằng mock/localStorage.',
    }
  },

  getSellerShippingReport(currentUser, { keyword = '', carrier = 'all' } = {}) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        data: [],
        message: 'Không tìm thấy dữ liệu vận chuyển của seller.',
      }
    }

    const store = storeResponse.data
    const normalizedKeyword = normalizeText(keyword)
    const normalizedCarrier = normalizeText(carrier)
    const rows = getSellerOrdersSource()
      .filter((order) => isOrderInStore(order, store.storeId))
      .map((order, index) => {
        const shippingStatus = resolveShippingStatus(order.status)
        const carrierMeta = shippingCarrierMap[order.status] || shippingCarrierMap.PENDING
        const trackingCode = `${carrierMeta.code.replace('&', '').replace(/\s/g, '')}${String(1234567890 + index * 98173)}VN`

        return {
          ...order,
          dateMeta: formatOrderDate(order.orderedAt),
          carrier: carrierMeta,
          trackingCode,
          shippingStatus,
          shippingStatusMeta: shippingStatusMeta[shippingStatus],
        }
      })
      .filter((order) => {
        const matchesKeyword =
          !normalizedKeyword ||
          [order.id, order.trackingCode, order.customerName, order.carrier.name]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedKeyword)
        const matchesCarrier = normalizedCarrier === 'all' || normalizeText(order.carrier.code) === normalizedCarrier

        return matchesKeyword && matchesCarrier
      })

    const sourceRows = getSellerOrdersSource().filter((order) => isOrderInStore(order, store.storeId))
    const statusCounts = sourceRows.reduce(
      (counts, order) => {
        const shippingStatus = resolveShippingStatus(order.status)
        counts[shippingStatus] += 1
        return counts
      },
      { WAITING_PICKUP: 0, SHIPPING: 0, DELIVERED: 0, FAILED: 0 },
    )

    return {
      success: true,
      data: {
        store,
        stats: [
          { id: 'waiting', title: 'Chờ lấy hàng', value: statusCounts.WAITING_PICKUP, icon: 'inventory_2', iconClassName: 'bg-[#ffdad6] text-[#5b403b]' },
          { id: 'shipping', title: 'Đang giao', value: statusCounts.SHIPPING, icon: 'local_shipping', iconClassName: 'bg-[#DBEAFE] text-[#2563EB]' },
          { id: 'delivered', title: 'Giao thành công', value: statusCounts.DELIVERED, icon: 'check_circle', iconClassName: 'bg-[#DCFCE7] text-[#059669]' },
          { id: 'failed', title: 'Trả hàng/Khiếu nại', value: statusCounts.FAILED, icon: 'assignment_return', iconClassName: 'bg-[#ffdad6] text-[#ba1a1a]', valueClassName: 'text-[#ba1a1a]' },
        ],
        rows,
      },
      meta: {
        store,
        totalCount: rows.length,
        allCount: sourceRows.length,
      },
    }
  },

  createSellerPromotion(currentUser, promotionPayload = {}) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy shop để tạo khuyến mãi.',
      }
    }

    const name = String(promotionPayload.name || '').trim()
    const code = String(promotionPayload.code || '').trim().toUpperCase()
    const discountValue = Number(promotionPayload.discountValue)
    const totalUsageLimit = Number(promotionPayload.totalUsageLimit)
    const perUserLimit = Number(promotionPayload.perUserLimit)
    const startAt = String(promotionPayload.startAt || '').trim()
    const endAt = String(promotionPayload.endAt || '').trim()

    if (!name || !code || !startAt || !endAt || !discountValue || discountValue <= 0 || !totalUsageLimit || totalUsageLimit <= 0 || !perUserLimit || perUserLimit <= 0) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin chương trình, thời gian và giới hạn sử dụng hợp lệ.',
      }
    }

    const store = storeResponse.data
    const promotionsMap = readSellerPromotions()
    const storePromotions = promotionsMap[store.storeId] || []
    const promotion = {
      id: `PROMO-${Date.now()}`,
      storeId: store.storeId,
      name,
      code,
      discountType: promotionPayload.discountType || 'percentage',
      discountValue,
      maxDiscount: Number(promotionPayload.maxDiscount) || 0,
      minOrderValue: Number(promotionPayload.minOrderValue) || 0,
      startAt,
      endAt,
      scope: promotionPayload.scope || 'all',
      totalUsageLimit,
      perUserLimit,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    }

    writeSellerPromotions({
      ...promotionsMap,
      [store.storeId]: [promotion, ...storePromotions],
    })

    return {
      success: true,
      data: promotion,
      message: 'Đã lưu khuyến mãi bằng mock/localStorage.',
    }
  },

  createSellerProduct(currentUser, productPayload = {}) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy shop để đăng sản phẩm mới.',
      }
    }

    const name = String(productPayload.name || '').trim()
    const description = String(productPayload.description || '').trim()
    const category = String(productPayload.category || '').trim()
    const imageUrl = String(productPayload.imageUrl || '').trim()
    const price = Number(productPayload.price)
    const stockQuantity = Number(productPayload.stockQuantity)

    if (!name || !category || !price || price <= 0 || Number.isNaN(price) || stockQuantity < 0 || Number.isNaN(stockQuantity)) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ tên sản phẩm, danh mục, giá bán và số lượng tồn kho hợp lệ.',
      }
    }

    const store = storeResponse.data
    const storedProducts = readSellerProducts()
    const createdAt = new Date().toISOString()
    const id = `SELLER-PRODUCT-${Date.now()}`
    const product = {
      id,
      name,
      slug: createSlug(name) || id.toLowerCase(),
      description,
      price,
      originalPrice: Number(productPayload.originalPrice) || price,
      discountPercent: 0,
      imageUrl: imageUrl || 'https://placehold.co/600x600/fff1ec/1b1c1c?text=New+Product',
      category,
      storeId: store.storeId,
      storeName: store.storeName,
      rating: 0,
      reviewCount: 0,
      soldQuantity: 0,
      stockQuantity,
      location: 'TP. Hồ Chí Minh',
      status: PRODUCT_STATUSES.ACTIVE,
      createdAt,
      updatedAt: createdAt,
    }

    writeSellerProducts([product, ...storedProducts])

    return {
      success: true,
      data: product,
      message: 'Đã lưu sản phẩm mới bằng mock/localStorage.',
    }
  },

  getSellerProductById(currentUser, productId) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy shop để tải sản phẩm.',
      }
    }

    const product = getProductsByStore(storeResponse.data.storeId).find((item) => String(item.id) === String(productId))

    if (!product) {
      return {
        success: false,
        message: 'Không tìm thấy sản phẩm hoặc sản phẩm không thuộc shop hiện tại.',
      }
    }

    return {
      success: true,
      data: product,
      meta: {
        store: storeResponse.data,
      },
    }
  },

  updateSellerProduct(currentUser, productId, productPayload = {}) {
    const productResponse = sellerService.getSellerProductById(currentUser, productId)

    if (!productResponse.success) {
      return productResponse
    }

    const name = String(productPayload.name || '').trim()
    const category = String(productPayload.category || '').trim()
    const price = Number(productPayload.price)
    const stockQuantity = Number(productPayload.stockQuantity)

    if (!name || !category || !price || price <= 0 || Number.isNaN(price) || stockQuantity < 0 || Number.isNaN(stockQuantity)) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ tên sản phẩm, danh mục, giá bán và số lượng tồn kho hợp lệ.',
      }
    }

    const currentProduct = productResponse.data
    const nextProduct = {
      ...currentProduct,
      name,
      slug: createSlug(name) || currentProduct.slug,
      description: String(productPayload.description || '').trim(),
      category,
      price,
      originalPrice: Number(productPayload.originalPrice) || price,
      imageUrl: String(productPayload.imageUrl || '').trim() || currentProduct.imageUrl,
      stockQuantity,
      status: productPayload.status || currentProduct.status,
      updatedAt: new Date().toISOString(),
    }

    const storedProducts = readSellerProducts()
    const nextStoredProducts = storedProducts.some((product) => String(product.id) === String(productId))
      ? storedProducts.map((product) => (String(product.id) === String(productId) ? nextProduct : product))
      : [nextProduct, ...storedProducts]

    writeSellerProducts(nextStoredProducts)

    return {
      success: true,
      data: nextProduct,
      message: 'Đã cập nhật sản phẩm bằng mock/localStorage.',
    }
  },

  deleteSellerProduct(currentUser, productId) {
    const productResponse = sellerService.getSellerProductById(currentUser, productId)

    if (!productResponse.success) {
      return productResponse
    }

    const storedProducts = readSellerProducts().filter((product) => String(product.id) !== String(productId))
    const deletedProductIds = Array.from(new Set([...readSellerDeletedProductIds().map(String), String(productId)]))

    writeSellerProducts(storedProducts)
    writeSellerDeletedProductIds(deletedProductIds)

    return {
      success: true,
      data: productResponse.data,
      message: 'Đã xóa sản phẩm khỏi danh sách seller bằng mock/localStorage.',
    }
  },

  getSellerProducts(currentUser, { keyword, status, category } = {}) {
    const store = resolveStoreFromCurrentUser(currentUser)

    if (!store) {
      return {
        success: false,
        data: [],
        message: 'Không tìm thấy shop để tải danh sách sản phẩm.',
      }
    }

    const normalizedKeyword = normalizeText(keyword)
    const normalizedStatus = normalizeText(status)
    const normalizedCategory = normalizeText(category)
    const storeProducts = getProductsByStore(store.storeId)

    const filteredProducts = storeProducts.filter((product) => {
      const matchesKeyword =
        !normalizedKeyword ||
        [product.name, product.category, product.storeName, product.slug]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword)

      const matchesStatus = !normalizedStatus || normalizeText(product.status) === normalizedStatus
      const matchesCategory = !normalizedCategory || normalizeText(product.category) === normalizedCategory

      return matchesKeyword && matchesStatus && matchesCategory
    })

    return {
      success: true,
      data: filteredProducts,
      meta: {
        store,
        totalCount: filteredProducts.length,
      },
    }
  },

  getSellerInventoryReport(currentUser, { keyword = '', category = 'all', stockStatus = 'all' } = {}) {
    const store = resolveStoreFromCurrentUser(currentUser)

    if (!store) {
      return {
        success: false,
        data: [],
        message: 'Không tìm thấy shop để tải dữ liệu kho hàng.',
      }
    }

    const normalizedKeyword = normalizeText(keyword)
    const normalizedCategory = normalizeText(category)
    const normalizedStockStatus = normalizeText(stockStatus)
    const storeProducts = getProductsByStore(store.storeId)
    const inventoryRows = storeProducts.map((product, index) => {
      const availableStock = Number(product.stockQuantity) || 0
      const reservedStock = Math.min(Math.max(Math.round((Number(product.soldQuantity) || 0) * 0.04), 0), availableStock)
      const stockState = availableStock === 0 ? 'OUT' : availableStock <= 20 ? 'LOW' : 'AVAILABLE'

      return {
        ...product,
        availableStock,
        reservedStock,
        warehouseLocation: product.warehouseLocation || `Khu ${String.fromCharCode(65 + (index % 4))}-${String(index + 1).padStart(2, '0')}`,
        stockState,
      }
    })

    const filteredRows = inventoryRows.filter((product) => {
      const matchesKeyword =
        !normalizedKeyword ||
        [product.name, product.category, product.slug, `TT-${String(product.id).padStart(3, '0')}`]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword)

      const matchesCategory = normalizedCategory === 'all' || normalizeText(product.category) === normalizedCategory
      const matchesStockStatus = normalizedStockStatus === 'all' || normalizeText(product.stockState) === normalizedStockStatus

      return matchesKeyword && matchesCategory && matchesStockStatus
    })

    const categories = Array.from(new Set(inventoryRows.map((product) => product.category).filter(Boolean)))
    const lowStockCount = inventoryRows.filter((product) => product.stockState === 'LOW').length
    const outOfStockCount = inventoryRows.filter((product) => product.stockState === 'OUT').length
    const totalStock = inventoryRows.reduce((total, product) => total + product.availableStock, 0)

    return {
      success: true,
      data: {
        store,
        stats: [
          { id: 'sku', title: 'Tổng số SKU', value: inventoryRows.length, icon: 'inventory_2', accentClassName: 'text-[#5b403b]', iconClassName: 'bg-[#f5f3f3] text-[#5b403b]' },
          { id: 'low', title: 'Sắp hết hàng', value: lowStockCount, icon: 'warning', accentClassName: 'border-l-4 border-[#F59E0B]', iconClassName: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
          { id: 'out', title: 'Đã hết hàng', value: outOfStockCount, icon: 'error', accentClassName: 'border-l-4 border-[#ee4d2d]', iconClassName: 'bg-[#ffdad6] text-[#ba1a1a]' },
          { id: 'stock', title: 'Tổng tồn kho', value: totalStock.toLocaleString('vi-VN'), icon: 'warehouse', accentClassName: 'text-[#b22204]', iconClassName: 'bg-[#ffdad3] text-[#b22204]' },
        ],
        rows: filteredRows,
        categories,
      },
      meta: {
        totalCount: filteredRows.length,
        allCount: inventoryRows.length,
      },
    }
  },

  updateSellerInventoryStock(currentUser, productId, nextStockQuantity) {
    const productResponse = sellerService.getSellerProductById(currentUser, productId)

    if (!productResponse.success) {
      return productResponse
    }

    const stockQuantity = Number(nextStockQuantity)

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      return {
        success: false,
        message: 'Số lượng tồn kho phải là số không âm.',
      }
    }

    const product = productResponse.data

    return sellerService.updateSellerProduct(currentUser, productId, {
      ...product,
      stockQuantity,
      status: stockQuantity === 0 ? PRODUCT_STATUSES.OUT_OF_STOCK : PRODUCT_STATUSES.ACTIVE,
    })
  },

  getSellerProductOrderHistory(currentUser, productId, { keyword = '', range = '30d' } = {}) {
    const productResponse = sellerService.getSellerProductById(currentUser, productId)

    if (!productResponse.success) {
      return productResponse
    }

    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy shop để tải lịch sử đơn hàng.',
      }
    }

    const product = productResponse.data
    const store = storeResponse.data
    const normalizedKeyword = normalizeText(keyword)
    const now = new Date('2024-10-31T00:00:00')
    const rangeDaysMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      all: 3650,
    }
    const rangeDays = rangeDaysMap[range] || rangeDaysMap['30d']
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - rangeDays + 1)

    const rows = getSellerOrdersSource()
      .filter((order) => isOrderInStore(order, store.storeId))
      .flatMap((order) => {
        const items = order.items?.length
          ? order.items
          : [{ productId: order.productId, productName: order.productName, quantity: 1, storeId: order.storeId }]

        return items
          .filter((item) => String(item.productId) === String(productId) && item.storeId === store.storeId)
          .map((item) => {
            const quantity = item.quantity || 1
            const unitPrice = product.price || Math.round(order.totalAmount / quantity)

            return {
              id: order.id,
              orderedAt: order.orderedAt,
              dateMeta: formatOrderDate(order.orderedAt),
              customerName: order.customerName,
              quantity,
              unitPrice,
              totalAmount: unitPrice * quantity,
              status: order.status,
              statusMeta: statusMeta[order.status] || statusMeta.PENDING,
              paymentLabel: order.paymentLabel,
            }
          })
      })
      .filter((order) => {
        const orderDate = new Date(order.orderedAt)
        const matchesRange = range === 'all' || orderDate >= startDate
        const matchesKeyword =
          !normalizedKeyword ||
          [order.id, order.customerName, order.paymentLabel]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedKeyword)

        return matchesRange && matchesKeyword
      })
      .sort((first, second) => new Date(second.orderedAt).getTime() - new Date(first.orderedAt).getTime())

    return {
      success: true,
      data: {
        product,
        rows,
      },
      meta: {
        store,
        totalCount: rows.length,
      },
    }
  },

  getSellerDashboardStats(currentUser) {
    const store = resolveStoreFromCurrentUser(currentUser)

    if (!store) {
      return {
        success: false,
        message: 'Không tìm thấy dữ liệu dashboard của seller.',
      }
    }

    const sellerProducts = getProductsByStore(store.storeId)
    const activeProducts = sellerProducts.filter((product) => product.status === PRODUCT_STATUSES.ACTIVE)
    const lowStockProducts = sellerProducts.filter((product) => product.stockQuantity > 0 && product.stockQuantity <= 20)
    const ratingAverage = sellerProducts.reduce((total, product) => total + product.rating, 0) / Math.max(sellerProducts.length, 1)
    const totalReviews = sellerProducts.reduce((total, product) => total + product.reviewCount, 0)
    const totalRevenue = sellerProducts.reduce((total, product) => total + product.price * product.soldQuantity, 0)
    const weekRevenue = [
      { label: 'Thứ 2', value: 7 },
      { label: 'T3', value: 12.5 },
      { label: 'T4', value: 9.2 },
      { label: 'T5', value: 17.1 },
      { label: 'T6', value: 13.8 },
      { label: 'T7', value: 19.2 },
      { label: 'CN', value: 11.4 },
    ]

    return {
      success: true,
      data: {
        store,
        cards: [
          {
            id: 'revenue',
            title: 'Doanh thu hôm nay',
            value: `${formatCompactCurrency(Math.max(12450000, totalRevenue * 0.02))}đ`,
            icon: 'payments',
            iconClassName: 'bg-primary/10 text-primary',
            trendText: '+15.2% so với hôm qua',
            trendClassName: 'text-[#16A34A]',
            trendIcon: 'trending_up',
          },
          {
            id: 'orders',
            title: 'Đơn hàng mới',
            value: '48',
            icon: 'shopping_cart',
            iconClassName: 'bg-[#0284C7]/10 text-[#0284C7]',
            trendText: '12 đơn chờ xử lý',
            trendClassName: 'text-[#5b403b]',
          },
          {
            id: 'products',
            title: 'Sản phẩm đang bán',
            value: `${Math.max(156, activeProducts.length)}`,
            icon: 'inventory_2',
            iconClassName: 'bg-[#F59E0B]/10 text-[#F59E0B]',
            trendText: `${Math.max(5, lowStockProducts.length)} sản phẩm sắp hết hàng`,
            trendClassName: lowStockProducts.length ? 'text-[#F59E0B]' : 'text-[#5b403b]',
            trendIcon: lowStockProducts.length ? 'warning' : 'check_circle',
          },
          {
            id: 'rating',
            title: 'Đánh giá shop',
            value: ratingAverage.toFixed(1),
            suffix: '/ 5.0',
            icon: 'star',
            iconClassName: 'bg-[#F59E0B]/10 text-[#F59E0B]',
            trendText: `Dựa trên ${Math.max(1240, totalReviews).toLocaleString('vi-VN')} đánh giá`,
            trendClassName: 'text-[#5b403b]',
          },
        ],
        quickActions: [
          { id: 'add', label: 'Đăng sản phẩm', icon: 'add_box', accentClassName: 'bg-primary/10 text-primary' },
          { id: 'ship', label: 'Quản lý vận chuyển', icon: 'local_shipping', accentClassName: 'bg-[#F97316]/10 text-[#F97316]' },
          { id: 'promo', label: 'Tạo khuyến mãi', icon: 'campaign', accentClassName: 'bg-[#16A34A]/10 text-[#16A34A]' },
        ],
        recentOrders: getSellerOrdersSource().slice(0, 5).map((order) => ({
          ...order,
          statusMeta: statusMeta[order.status] || statusMeta.PENDING,
        })),
        weekRevenue,
      },
    }
  },

  getSellerOrders(currentUser, { keyword = '', status = 'all', dateFrom = '', dateTo = '' } = {}) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        data: [],
        message: 'Không tìm thấy dữ liệu đơn hàng của seller.',
      }
    }

    const store = storeResponse.data
    const normalizedKeyword = normalizeText(keyword)

    const storeOrders = getSellerOrdersSource().filter((order) => isOrderInStore(order, store.storeId))

    const filteredOrders = storeOrders
      .filter((order) => {
        const matchesKeyword =
          !normalizedKeyword ||
          [order.id, order.customerName, order.productName].join(' ').toLowerCase().includes(normalizedKeyword)

        const matchesStatus = status === 'all' || order.status === status
        const orderDate = order.orderedAt.slice(0, 10)
        const matchesDateFrom = !dateFrom || orderDate >= dateFrom
        const matchesDateTo = !dateTo || orderDate <= dateTo

        return matchesKeyword && matchesStatus && matchesDateFrom && matchesDateTo
      })
      .map((order) => ({
        ...order,
        dateMeta: formatOrderDate(order.orderedAt),
        statusMeta: statusMeta[order.status] || statusMeta.PENDING,
      }))

    return {
      success: true,
      data: filteredOrders,
      meta: {
        store,
        totalCount: filteredOrders.length,
      },
    }
  },

  getSellerOrderById(currentUser, orderId) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy dữ liệu đơn hàng của seller.',
      }
    }

    const store = storeResponse.data
    const order = getSellerOrdersSource().find((item) => String(item.id) === String(orderId))

    if (!order || !isOrderInStore(order, store.storeId)) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng hoặc đơn hàng không thuộc shop hiện tại.',
      }
    }

    return {
      success: true,
      data: buildOrderDetail(order, store),
      meta: {
        store,
      },
    }
  },

  updateSellerOrderStatus(currentUser, orderId, nextStatus) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy thông tin shop của tài khoản seller hiện tại.',
      }
    }

    const store = storeResponse.data
    const matchedOrder = getSellerOrdersSource().find((order) => String(order.id) === String(orderId))

    if (!matchedOrder) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng cần cập nhật.',
      }
    }

    if (!isOrderInStore(matchedOrder, store.storeId)) {
      return {
        success: false,
        message: 'Bạn không có quyền cập nhật đơn hàng của shop khác.',
      }
    }

    const allowedNextStatuses = sellerOrderStatusTransitions[matchedOrder.status] || []

    if (!allowedNextStatuses.includes(nextStatus)) {
      return {
        success: false,
        message: 'Không thể chuyển đơn hàng sang trạng thái này.',
      }
    }

    const statusOverrides = readSellerOrderStatusOverrides()
    const nextOverrides = {
      ...statusOverrides,
      [matchedOrder.id]: nextStatus,
    }

    writeSellerOrderStatusOverrides(nextOverrides)

    const updatedOrder = {
      ...matchedOrder,
      status: nextStatus,
      dateMeta: formatOrderDate(matchedOrder.orderedAt),
      statusMeta: statusMeta[nextStatus] || statusMeta.PENDING,
    }

    return {
      success: true,
      data: updatedOrder,
      message: 'Đã cập nhật trạng thái đơn hàng mock.',
    }
  },

  getSellerRevenueReport(currentUser, { keyword = '', range = '30d', dateFrom = '', dateTo = '' } = {}) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        message: 'Không tìm thấy dữ liệu doanh thu của seller.',
      }
    }

    const store = storeResponse.data
    const normalizedKeyword = normalizeText(keyword)
    const now = new Date('2024-10-31T00:00:00')
    const rangeStartMap = {
      '7d': 7,
      '30d': 30,
      month: 31,
      year: 365,
    }
    const fallbackDays = rangeStartMap[range] || rangeStartMap['30d']
    const fallbackStart = new Date(now)
    fallbackStart.setDate(now.getDate() - fallbackDays + 1)

    const startDate = dateFrom || fallbackStart.toISOString().slice(0, 10)
    const endDate = dateTo || now.toISOString().slice(0, 10)
    const storeOrders = getSellerOrdersSource().filter((order) => isOrderInStore(order, store.storeId))
    const completedOrders = storeOrders.filter((order) => {
      const orderDate = order.orderedAt.slice(0, 10)
      return order.status === 'COMPLETED' && orderDate >= startDate && orderDate <= endDate
    })

    const getRevenueOrderItems = (order) => {
      const orderItems = order.items?.length
        ? order.items
        : [{ productId: order.productId, productName: order.productName, quantity: 1, storeId: order.storeId }]

      return orderItems.map((item) => ({
        ...item,
        productName: item.productName || order.productName,
        quantity: item.quantity || 1,
        storeId: item.storeId || order.storeId,
      }))
    }

    const getSellerOrderRevenue = (order) => {
      const orderItems = getRevenueOrderItems(order)
      const orderQuantity = orderItems.reduce((total, item) => total + item.quantity, 0) || 1
      const sellerQuantity = orderItems
        .filter((item) => item.storeId === store.storeId)
        .reduce((total, item) => total + item.quantity, 0)

      return (order.totalAmount * sellerQuantity) / orderQuantity
    }

    const totalRevenue = completedOrders.reduce((total, order) => total + getSellerOrderRevenue(order), 0)
    const orderCount = completedOrders.length
    const averageOrderValue = orderCount ? totalRevenue / orderCount : 0
    const productRevenueMap = completedOrders.reduce((map, order) => {
      const orderItems = getRevenueOrderItems(order)
      const orderQuantity = orderItems.reduce((total, item) => total + item.quantity, 0) || 1

      orderItems.forEach((item) => {
        if (item.storeId !== store.storeId) {
          return
        }

        const product = mockProducts.find((productItem) => String(productItem.id) === String(item.productId))
        const revenueShare = (order.totalAmount * item.quantity) / orderQuantity
        const row = map.get(item.productId) || {
          id: String(item.productId),
          name: item.productName || product?.name || order.productName,
          sku: product?.sku || `TT-${String(item.productId).padStart(3, '0')}`,
          quantitySold: 0,
          totalRevenue: 0,
          imageUrl: product?.imageUrl || 'https://placehold.co/96x96/f5f3f3/1b1c1c?text=Demo',
        }

        row.quantitySold += item.quantity
        row.totalRevenue += revenueShare
        map.set(item.productId, row)
      })

      return map
    }, new Map())

    const rows = Array.from(productRevenueMap.values())
      .filter((row) => !normalizedKeyword || normalizeText(row.name).includes(normalizedKeyword) || normalizeText(row.sku).includes(normalizedKeyword))
      .sort((first, second) => second.totalRevenue - first.totalRevenue)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
        unitPrice: row.quantitySold ? row.totalRevenue / row.quantitySold : 0,
      }))

    const chartSeed = range === '7d'
      ? ['25/10', '26/10', '27/10', '28/10', '29/10', '30/10', '31/10']
      : ['01/10', '08/10', '15/10', '22/10', '30/10']
    const chart = chartSeed.map((label) => ({ label, value: 0 }))

    completedOrders.forEach((order) => {
      const day = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(order.orderedAt))
      const matchedPoint = chart.find((point) => point.label === day) || chart[chart.length - 1]
      matchedPoint.value += getSellerOrderRevenue(order)
    })

    const formatCardValue = (value) => formatCompactCurrency(value || 0).replace(' Tr', 'M')

    return {
      success: true,
      data: {
        store,
        cards: [
          {
            id: 'total-revenue',
            title: 'Tổng doanh thu',
            value: formatCardValue(totalRevenue),
            suffix: 'đ',
            icon: 'payments',
            iconWrapClassName: 'bg-[#ffdad3] text-[#b22204]',
            trendText: 'Tính từ đơn hoàn thành',
            trendClassName: 'text-[#16A34A]',
            trendIcon: 'trending_up',
            bgAccentClassName: 'bg-[#ffdad3]/30',
          },
          {
            id: 'success-orders',
            title: 'Đơn hàng thành công',
            value: String(orderCount),
            icon: 'local_mall',
            iconWrapClassName: 'bg-[#ffdad3] text-[#b22204]',
            trendText: 'Thuộc gian hàng seller',
            trendClassName: 'text-[#16A34A]',
            trendIcon: 'trending_up',
            bgAccentClassName: 'bg-[#ffdad3]/25',
          },
          {
            id: 'avg-order',
            title: 'Giá trị trung bình đơn',
            value: formatCardValue(averageOrderValue),
            suffix: 'đ',
            icon: 'receipt_long',
            iconWrapClassName: 'bg-[#e3e2e2] text-[#5b403b]',
            trendText: 'Mock theo đơn đã hoàn thành',
            trendClassName: 'text-[#DC2626]',
            trendIcon: 'trending_flat',
            bgAccentClassName: 'bg-[#e3e2e2]/40',
          },
        ],
        chart,
        rows,
      },
      meta: {
        store,
        totalCount: rows.length,
        orderCount,
        totalRevenue,
        averageOrderValue,
      },
    }
  },

  getProductStatusMeta(status) {
    return productStatusMeta[status] || productStatusMeta[PRODUCT_STATUSES.HIDDEN]
  },
}
