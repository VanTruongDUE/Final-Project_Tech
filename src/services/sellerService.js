import {
  buildDefaultSkuCode,
  buildDefaultSkuId,
  generateSkuCode,
  mockProducts,
  PRODUCT_STATUSES,
} from '../mocks/products.mock'
import { apiRequest } from './apiClient'

const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'
const FALLBACK_IMAGE = '/images/products/headphones.png'

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
  const sellerStoredProducts = getStoredSellerProducts()
    .filter((product) => product.storeId === storeId)
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

const sellerPromotionSeeds = [
  {
    id: 'PROMO-DEMO-TET24',
    name: 'Voucher Tết TechToShop',
    code: 'TET24',
    promotionType: 'Voucher Shop',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 200000,
    minOrderValue: 500000,
    startAt: '2026-06-01T00:00',
    endAt: '2026-07-15T23:59',
    scope: 'all',
    totalUsageLimit: 100,
    perUserLimit: 1,
    usedCount: 45,
    status: 'ONGOING',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'PROMO-DEMO-FSWE',
    name: 'Flash Sale Cuối Tuần',
    code: 'FSWE',
    promotionType: 'Flash Sale',
    discountType: 'fixed',
    discountValue: 50000,
    maxDiscount: 50000,
    minOrderValue: 300000,
    startAt: '2026-07-20T00:00',
    endAt: '2026-07-22T23:59',
    scope: 'all',
    totalUsageLimit: 500,
    perUserLimit: 1,
    usedCount: 0,
    status: 'UPCOMING',
    createdAt: '2026-06-15T00:00:00.000Z',
  },
  {
    id: 'PROMO-DEMO-SUMMER',
    name: 'Combo Mùa Hè',
    code: 'SUMMER23',
    promotionType: 'Combo',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 100000,
    minOrderValue: 400000,
    startAt: '2026-05-01T00:00',
    endAt: '2026-05-31T23:59',
    scope: 'all',
    totalUsageLimit: 200,
    perUserLimit: 1,
    usedCount: 200,
    status: 'FINISHED',
    createdAt: '2026-04-20T00:00:00.000Z',
  },
]

function getPromotionStatus(promotion) {
  if (promotion.status === 'PAUSED') return 'PAUSED'

  const now = new Date()
  const startAt = new Date(promotion.startAt)
  const endAt = new Date(promotion.endAt)

  if (!Number.isNaN(endAt.getTime()) && endAt < now) return 'FINISHED'
  if (!Number.isNaN(startAt.getTime()) && startAt > now) return 'UPCOMING'
  return 'ONGOING'
}

function getStorePromotions(promotionsMap, store) {
  if (Object.prototype.hasOwnProperty.call(promotionsMap, store.storeId)) {
    return promotionsMap[store.storeId]
  }

  return sellerPromotionSeeds.map((promotion) => ({ ...promotion, storeId: store.storeId }))
}

function formatPromotionDiscount(promotion) {
  return promotion.discountType === 'fixed'
    ? `${new Intl.NumberFormat('vi-VN').format(Number(promotion.discountValue) || 0)}đ Off`
    : `${Number(promotion.discountValue) || 0}% Off`
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

function normalizeSellerProductSku(product) {
  const hasValidSkuCode = /^[A-Z0-9-]+$/.test(product?.skuCode || '')

  return {
    ...product,
    skuId: product?.skuId || buildDefaultSkuId(product?.id),
    skuCode: hasValidSkuCode ? product.skuCode : buildDefaultSkuCode(product || {}),
    variantName: product?.variantName || 'Mặc định',
  }
}

export function getStoredSellerProducts() {
  return readSellerProducts().map(normalizeSellerProductSku)
}

function generateSellerProductSku(store, name, category) {
  const storedProducts = readSellerProducts()

  return generateSkuCode({
    storeName: store.storeName,
    category,
    productName: name,
    existingSkuCodes: [...mockProducts, ...storedProducts.map(normalizeSellerProductSku)].map(
      (product) => product.skuCode,
    ),
  })
}

function normalizeVariantSkuSegment(value) {
  return String(value || 'Mặc định')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'D')
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.slice(0, 4))
    .join('-') || 'STD'
}

function generateSellerVariantSkus(store, name, category, requestedSkus, productId) {
  const storedProducts = readSellerProducts()
  const usedSkuCodes = new Set(
    [...mockProducts, ...storedProducts].flatMap((product) => [
      product.skuCode,
      ...(Array.isArray(product.skus) ? product.skus.map((sku) => sku.skuCode) : []),
    ]).filter(Boolean),
  )
  const defaultSku = generateSellerProductSku(store, name, category)
  const prefix = defaultSku.replace(/-STD-\d{3}$/, '')

  return requestedSkus.map((requestedSku, index) => {
    const variantName = String(requestedSku.variantName || `Biến thể ${index + 1}`).trim()
    const variantSegment = normalizeVariantSkuSegment(variantName)
    let sequence = index + 1
    let skuCode = `${prefix}-${variantSegment}-${String(sequence).padStart(3, '0')}`

    while (usedSkuCodes.has(skuCode)) {
      sequence += 1
      skuCode = `${prefix}-${variantSegment}-${String(sequence).padStart(3, '0')}`
    }

    usedSkuCodes.add(skuCode)

    return {
      skuId: `${buildDefaultSkuId(productId)}-${String(index + 1).padStart(3, '0')}`,
      skuCode,
      variantName,
      price: Number(requestedSku.price),
      originalPrice: Number(requestedSku.originalPrice) || Number(requestedSku.price),
      stockQuantity: Number(requestedSku.stockQuantity),
      status: requestedSku.status === PRODUCT_STATUSES.HIDDEN ? PRODUCT_STATUSES.HIDDEN : PRODUCT_STATUSES.ACTIVE,
      imageUrl: String(requestedSku.imageUrl || '').trim() || undefined,
    }
  })
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
      imageUrl: product?.imageUrl || '/images/products/headphones.png',
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

const normalizeApiStatus = (status) => {
  if (status === 'READY_TO_SHIP') return 'PACKING'
  if (status === 'DELIVERED') return 'COMPLETED'
  if (['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKING', 'SHIPPING', 'COMPLETED', 'CANCELLED'].includes(status)) {
    return status
  }
  return status || 'PENDING'
}

const toApiStatus = (status) => {
  if (status === PRODUCT_STATUSES.HIDDEN || status === PRODUCT_STATUSES.OUT_OF_STOCK) return 'INACTIVE'
  return status || 'ACTIVE'
}

const fromApiProductStatus = (status, stockQuantity) => {
  if (status === 'INACTIVE') return PRODUCT_STATUSES.HIDDEN
  if (Number(stockQuantity) <= 0) return PRODUCT_STATUSES.OUT_OF_STOCK
  return PRODUCT_STATUSES.ACTIVE
}

const mapApiStore = (store = {}) => ({
  storeId: store.store_id,
  storeCode: store.store_code || String(store.store_id || ''),
  storeName: store.store_name || 'TechToShop',
  description: store.description || '',
  status: store.status || 'ACTIVE',
  logoUrl: store.logo_url || '',
  contactEmail: store.contact_email || '',
  contactPhone: store.contact_phone || '',
  addressLine: store.address_line || '',
  ward: store.ward || '',
  district: store.district || '',
  province: store.province || '',
  totalProducts: Number(store.total_products) || 0,
  createdAt: store.created_at || '',
  updatedAt: store.updated_at || '',
})

const pickPrimaryImage = (images = []) => {
  const primaryImage = images.find((image) => image.is_primary) || images[0]
  return primaryImage?.image_url || FALLBACK_IMAGE
}

const mapApiSellerVariant = (variant = {}) => ({
  variantId: variant.variant_id ?? variant.variantId ?? null,
  skuId: variant.sku_id || variant.skuId || variant.sku_code || variant.skuCode || '',
  skuCode: variant.sku_code || variant.skuCode || '',
  variantName: variant.variant_name || variant.variantName || 'Mặc định',
  option1Name: variant.option1_name || variant.option1Name || '',
  option1Value: variant.option1_value || variant.option1Value || '',
  option2Name: variant.option2_name || variant.option2Name || '',
  option2Value: variant.option2_value || variant.option2Value || '',
  price: Number(variant.price) || 0,
  originalPrice: Number(variant.original_price ?? variant.originalPrice ?? variant.price) || 0,
  stockQuantity: Number(variant.stock_quantity ?? variant.stockQuantity) || 0,
  status: variant.status || PRODUCT_STATUSES.ACTIVE,
  isDefault: Boolean(variant.is_default ?? variant.isDefault),
})

const mapApiSellerProduct = (product = {}, store = {}) => {
  const variants = Array.isArray(product.variants)
    ? product.variants.map(mapApiSellerVariant).filter((variant) => variant.variantId || variant.skuCode)
    : []
  const defaultVariantId = product.default_variant_id ?? product.defaultVariantId ?? null
  const defaultVariant =
    variants.find((variant) => String(variant.variantId) === String(defaultVariantId))
    || variants.find((variant) => variant.isDefault)
    || variants[0]
  const stockQuantity = Number(defaultVariant?.stockQuantity ?? product.stock_quantity) || 0
  const price = Number(defaultVariant?.price ?? product.price) || 0
  const skuCode = defaultVariant?.skuCode || product.sku || product.sku_code || product.skuCode || ''

  return {
    id: product.product_id,
    name: product.product_name || '',
    slug: product.slug || '',
    defaultVariantId,
    variantId: defaultVariant?.variantId || defaultVariantId || null,
    skuId: product.sku_id || skuCode || buildDefaultSkuId(product.product_id),
    skuCode: skuCode || buildDefaultSkuCode({ id: product.product_id, name: product.product_name }),
    variantName: defaultVariant?.variantName || product.variant_name || 'Mặc định',
    variantCount: Number(product.variant_count ?? variants.length) || variants.length,
    variants,
    skus: variants,
    description: product.description || '',
    price,
    originalPrice: price,
    discountPercent: 0,
    imageUrl: pickPrimaryImage(product.images || []),
    category: product.category?.category_name || product.category_name || product.category || '',
    categoryId: product.category?.category_id || product.category_id || '',
    storeId: store.storeId || product.store_id || '',
    storeName: store.storeName || product.store_name || 'TechToShop',
    rating: Number(product.avg_rating) || 0,
    reviewCount: Number(product.review_count) || 0,
    soldQuantity: Number(product.sold_quantity) || 0,
    stockQuantity,
    location: store.province || 'Việt Nam',
    status: fromApiProductStatus(product.status, stockQuantity),
    createdAt: product.created_at || '',
    updatedAt: product.updated_at || '',
  }
}

const mapApiSellerOrder = (order = {}) => {
  const status = normalizeApiStatus(order.order_status)
  const orderedAt = order.created_at || new Date().toISOString()
  const id = String(order.order_id)

  return {
    id,
    code: order.order_code,
    customerName: order.customer_name || order.recipient_name || 'Khách hàng',
    customerInitials: (order.customer_name || order.recipient_name || 'KH')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    orderedAt,
    totalAmount: Number(order.total_amount) || 0,
    status,
    paymentLabel: order.payment_method || 'COD',
    productName: order.first_item || order.product_name || 'Đơn hàng mua sắm',
    items: Array.isArray(order.items) ? order.items : [],
    dateMeta: formatOrderDate(orderedAt),
    statusMeta: statusMeta[status] || statusMeta.PENDING,
  }
}

const mapApiSellerOrderDetail = (order = {}) => {
  const status = normalizeApiStatus(order.order_status)
  const orderedAt = order.created_at || new Date().toISOString()
  const address = [order.shipping_address_line, order.shipping_ward, order.shipping_district, order.shipping_province]
    .filter(Boolean)
    .join(', ')
  const items = (order.items || []).map((item) => {
    const unitPrice = Number(item.unit_price) || 0
    const quantity = Number(item.quantity) || 1

    return {
      productId: item.product_id,
      productName: item.product_name_snapshot || 'Sản phẩm đã mua',
      imageUrl: item.product_image_url_snapshot || FALLBACK_IMAGE,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      variantLabel: item.variant_name || 'Mặc định',
      skuCode: item.sku_code || '',
    }
  })
  const activeIndex = sellerOrderTimelineSteps.findIndex((step) => step.status === status)
  const timeline = status === 'CANCELLED'
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
      time: new Date(new Date(orderedAt).getTime() + index * 60 * 60 * 1000).toISOString(),
      note: `Đơn hàng chuyển sang trạng thái ${step.label.toLowerCase()}.`,
    }))

  return {
    id: String(order.order_id),
    code: order.order_code,
    orderedAt,
    status,
    dateMeta: formatOrderDate(orderedAt),
    statusMeta: statusMeta[status] || statusMeta.PENDING,
    items,
    timeline,
    history,
    customer: {
      name: order.customer?.full_name || order.recipient_name || 'Khách hàng',
      tier: 'Khách hàng',
      phone: order.customer?.phone || order.recipient_phone || '--',
      address: address || '--',
    },
    payment: {
      subtotal: Number(order.subtotal) || items.reduce((total, item) => total + item.totalPrice, 0),
      discount: Number(order.discount_amount) || 0,
      shippingFee: Number(order.shipping_fee) || 0,
      total: Number(order.total_amount) || 0,
      method: order.payment_method || 'COD',
    },
    shipment: order.shipment,
  }
}

let apiCategoryCache = null

const flattenApiCategories = (categories = []) =>
  categories.flatMap((category) => {
    const current = {
      id: category.category_id,
      name: category.category_name,
    }
    const children = Array.isArray(category.children) ? flattenApiCategories(category.children) : []
    return [current, ...children].filter((item) => item.id && item.name)
  })

const normalizeCategoryText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .trim()
    .toLowerCase()

const getApiCategories = async () => {
  if (apiCategoryCache) return apiCategoryCache
  const result = await apiRequest('/categories')
  apiCategoryCache = flattenApiCategories(result.data?.categories || [])
  return apiCategoryCache
}

const resolveCategoryId = async (category) => {
  if (/^\d+$/.test(String(category || ''))) return Number(category)

  const categories = await getApiCategories()
  const normalizedCategory = normalizeCategoryText(category)
  const matchedCategory = categories.find((item) => normalizeCategoryText(item.name) === normalizedCategory)

  if (matchedCategory) return Number(matchedCategory.id)
  if (categories[0]?.id) return Number(categories[0].id)

  throw new Error('Backend chưa có danh mục hợp lệ để tạo/cập nhật sản phẩm.')
}

const buildApiVariantPayload = (variant = {}, index = 0) => ({
  variant_id: variant.variantId ? Number(variant.variantId) : undefined,
  sku_code: String(variant.sku_code || variant.skuCode || '').trim() || undefined,
  variant_name: String(variant.variant_name || variant.variantName || `Biến thể ${index + 1}`).trim(),
  option1_name: String(variant.option1_name || variant.option1Name || '').trim() || undefined,
  option1_value: String(variant.option1_value || variant.option1Value || '').trim() || undefined,
  option2_name: String(variant.option2_name || variant.option2Name || '').trim() || undefined,
  option2_value: String(variant.option2_value || variant.option2Value || '').trim() || undefined,
  price: Number(variant.price),
  stock_quantity: Math.max(0, Math.floor(Number(variant.stock_quantity ?? variant.stockQuantity) || 0)),
  status: variant.status === PRODUCT_STATUSES.HIDDEN ? 'INACTIVE' : 'ACTIVE',
  is_default: Boolean(variant.is_default ?? variant.isDefault ?? index === 0),
})

const buildApiProductPayload = async (productPayload = {}) => {
  const categoryId = await resolveCategoryId(productPayload.categoryId || productPayload.category)
  const imageUrl = String(productPayload.imageUrl || '').trim()
  const requestedVariants = Array.isArray(productPayload.variants)
    ? productPayload.variants
    : Array.isArray(productPayload.skus)
      ? productPayload.skus
      : []
  const variants = requestedVariants
    .map(buildApiVariantPayload)
    .filter((variant) => variant.variant_name && Number(variant.price) > 0)

  if (variants.length && !variants.some((variant) => variant.is_default)) {
    variants[0].is_default = true
  }

  const payload = {
    category_id: categoryId,
    product_name: String(productPayload.name || '').trim(),
    description: String(productPayload.description || '').trim(),
    price: Number(productPayload.price),
    stock_quantity: Math.max(0, Math.floor(Number(productPayload.stockQuantity) || 0)),
    sku: String(productPayload.sku || productPayload.skuCode || '').trim(),
    status: toApiStatus(productPayload.status),
    image_urls: imageUrl ? [imageUrl] : [],
  }

  if (variants.length) {
    payload.variants = variants
  }

  return payload
}

export const sellerService = {
  isApiMode() {
    return USE_API
  },

  getSellerStore(currentUser) {
    if (USE_API) {
      return apiRequest('/seller/store')
        .then((result) => ({
          success: true,
          data: mapApiStore(result.data),
        }))
        .catch((error) => ({
          success: false,
          message: error.message,
        }))
    }

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

  async getSellerSettings(currentUser) {
    if (!USE_API) {
      return { success: false, message: 'Cài đặt cửa hàng chỉ khả dụng trong chế độ API.' }
    }

    const storeResponse = await sellerService.getSellerStore(currentUser)
    if (!storeResponse.success) return storeResponse

    const store = storeResponse.data
    return {
      success: true,
      data: {
        storeId: store.storeId,
        storeName: store.storeName,
        description: store.description,
        logoUrl: store.logoUrl,
        contactEmail: store.contactEmail,
        contactPhone: store.contactPhone,
        addressLine: store.addressLine,
        ward: store.ward,
        district: store.district,
        province: store.province,
      },
      meta: { store },
    }
  },

  async updateSellerSettings(currentUser, settingsPayload = {}) {
    if (!USE_API) {
      return { success: false, message: 'Cài đặt cửa hàng chỉ khả dụng trong chế độ API.' }
    }

    const storeName = String(settingsPayload.storeName || '').trim()
    if (!storeName) {
      return { success: false, message: 'Vui lòng nhập tên cửa hàng.' }
    }

    try {
      const result = await apiRequest('/seller/store', {
        method: 'PATCH',
        body: JSON.stringify({
          store_name: storeName,
          description: String(settingsPayload.description || '').trim(),
          logo_url: String(settingsPayload.logoUrl || '').trim(),
          contact_email: String(settingsPayload.contactEmail || '').trim(),
          contact_phone: String(settingsPayload.contactPhone || '').trim(),
          address_line: String(settingsPayload.addressLine || '').trim(),
          ward: String(settingsPayload.ward || '').trim(),
          district: String(settingsPayload.district || '').trim(),
          province: String(settingsPayload.province || '').trim(),
        }),
      })
      const store = mapApiStore(result.data)
      return {
        success: true,
        data: {
          storeId: store.storeId,
          storeName: store.storeName,
          description: store.description,
          logoUrl: store.logoUrl,
          contactEmail: store.contactEmail,
          contactPhone: store.contactPhone,
          addressLine: store.addressLine,
          ward: store.ward,
          district: store.district,
          province: store.province,
        },
        message: 'Đã cập nhật thông tin cửa hàng.',
      }
    } catch (error) {
      return { success: false, message: error.message }
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

  getSellerPromotions(currentUser, { keyword = '', status = 'all' } = {}) {
    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return {
        success: false,
        data: [],
        message: 'Không tìm thấy shop để tải danh sách khuyến mãi.',
      }
    }

    const store = storeResponse.data
    const promotionsMap = readSellerPromotions()
    const normalizedKeyword = normalizeText(keyword)
    const normalizedStatus = String(status || 'all').toUpperCase()
    const allRows = getStorePromotions(promotionsMap, store)
      .map((promotion) => ({
        ...promotion,
        status: getPromotionStatus(promotion),
        discountLabel: formatPromotionDiscount(promotion),
        usedCount: Number(promotion.usedCount) || 0,
        totalUsageLimit: Number(promotion.totalUsageLimit) || 0,
      }))
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    const rows = allRows.filter((promotion) => {
      const matchesKeyword = !normalizedKeyword || normalizeText(`${promotion.name} ${promotion.code}`).includes(normalizedKeyword)
      const matchesStatus = normalizedStatus === 'ALL' || promotion.status === normalizedStatus
      return matchesKeyword && matchesStatus
    })
    const totalDiscount = allRows.reduce((total, promotion) => {
      const estimatedDiscount = promotion.discountType === 'fixed'
        ? promotion.discountValue
        : promotion.maxDiscount || promotion.discountValue * 10000
      return total + estimatedDiscount * promotion.usedCount
    }, 0)

    return {
      success: true,
      data: {
        store,
        rows,
        stats: {
          total: allRows.length,
          ongoing: allRows.filter((promotion) => promotion.status === 'ONGOING').length,
          used: allRows.reduce((total, promotion) => total + promotion.usedCount, 0),
          totalDiscount,
        },
      },
      meta: {
        totalCount: rows.length,
        allCount: allRows.length,
      },
    }
  },

  getSellerPromotionById(currentUser, promotionId) {
    const promotionsResponse = sellerService.getSellerPromotions(currentUser)

    if (!promotionsResponse.success) return promotionsResponse

    const promotion = promotionsResponse.data.rows.find((item) => String(item.id) === String(promotionId))

    return promotion
      ? { success: true, data: promotion, meta: { store: promotionsResponse.data.store } }
      : { success: false, message: 'Không tìm thấy khuyến mãi của shop hiện tại.' }
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
    const storePromotions = getStorePromotions(promotionsMap, store)

    if (new Date(endAt) <= new Date(startAt)) {
      return { success: false, message: 'Thời gian kết thúc phải sau thời gian bắt đầu.' }
    }

    if (promotionPayload.discountType !== 'fixed' && discountValue > 100) {
      return { success: false, message: 'Mức giảm theo phần trăm không được vượt quá 100%.' }
    }

    if (storePromotions.some((promotionItem) => normalizeText(promotionItem.code) === normalizeText(code))) {
      return { success: false, message: 'Mã khuyến mãi đã tồn tại trong shop.' }
    }

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
      usedCount: 0,
      promotionType: 'Voucher Shop',
      status: getPromotionStatus({ startAt, endAt }),
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

  updateSellerPromotion(currentUser, promotionId, promotionPayload = {}) {
    const promotionResponse = sellerService.getSellerPromotionById(currentUser, promotionId)

    if (!promotionResponse.success) return promotionResponse

    const currentPromotion = promotionResponse.data
    const store = promotionResponse.meta.store
    const name = String(promotionPayload.name || '').trim()
    const code = String(promotionPayload.code || '').trim().toUpperCase()
    const discountValue = Number(promotionPayload.discountValue)
    const totalUsageLimit = Number(promotionPayload.totalUsageLimit)
    const startAt = String(promotionPayload.startAt || '').trim()
    const endAt = String(promotionPayload.endAt || '').trim()

    if (!name || !code || !startAt || !endAt || discountValue <= 0 || totalUsageLimit <= 0) {
      return { success: false, message: 'Thông tin chỉnh sửa khuyến mãi chưa hợp lệ.' }
    }

    if (new Date(endAt) <= new Date(startAt)) {
      return { success: false, message: 'Thời gian kết thúc phải sau thời gian bắt đầu.' }
    }

    if (promotionPayload.discountType !== 'fixed' && discountValue > 100) {
      return { success: false, message: 'Mức giảm theo phần trăm không được vượt quá 100%.' }
    }

    const promotionsMap = readSellerPromotions()
    const storePromotions = getStorePromotions(promotionsMap, store)

    if (storePromotions.some((promotion) => String(promotion.id) !== String(promotionId) && normalizeText(promotion.code) === normalizeText(code))) {
      return { success: false, message: 'Mã khuyến mãi đã tồn tại trong shop.' }
    }

    const updatedPromotion = {
      ...currentPromotion,
      ...promotionPayload,
      name,
      code,
      discountValue,
      totalUsageLimit,
      maxDiscount: Number(promotionPayload.maxDiscount) || 0,
      minOrderValue: Number(promotionPayload.minOrderValue) || 0,
      perUserLimit: Number(promotionPayload.perUserLimit) || currentPromotion.perUserLimit,
      startAt,
      endAt,
      status: currentPromotion.status === 'PAUSED' ? 'PAUSED' : getPromotionStatus({ startAt, endAt }),
      updatedAt: new Date().toISOString(),
    }

    writeSellerPromotions({
      ...promotionsMap,
      [store.storeId]: storePromotions.map((promotion) => (
        String(promotion.id) === String(promotionId) ? updatedPromotion : promotion
      )),
    })

    return { success: true, data: updatedPromotion, message: 'Đã cập nhật khuyến mãi.' }
  },

  toggleSellerPromotionStatus(currentUser, promotionId) {
    const promotionResponse = sellerService.getSellerPromotionById(currentUser, promotionId)

    if (!promotionResponse.success) return promotionResponse

    const promotion = promotionResponse.data

    if (promotion.status === 'FINISHED') {
      return { success: false, message: 'Khuyến mãi đã kết thúc nên không thể kích hoạt lại.' }
    }

    const store = promotionResponse.meta.store
    const promotionsMap = readSellerPromotions()
    const storePromotions = getStorePromotions(promotionsMap, store)
    const nextStatus = promotion.status === 'PAUSED'
      ? getPromotionStatus({ ...promotion, status: '' })
      : 'PAUSED'
    const updatedPromotion = { ...promotion, status: nextStatus, updatedAt: new Date().toISOString() }

    writeSellerPromotions({
      ...promotionsMap,
      [store.storeId]: storePromotions.map((item) => (
        String(item.id) === String(promotionId) ? updatedPromotion : item
      )),
    })

    return { success: true, data: updatedPromotion, message: nextStatus === 'PAUSED' ? 'Đã tạm dừng khuyến mãi.' : 'Đã kích hoạt khuyến mãi.' }
  },

  deleteSellerPromotion(currentUser, promotionId) {
    const promotionResponse = sellerService.getSellerPromotionById(currentUser, promotionId)

    if (!promotionResponse.success) return promotionResponse

    const store = promotionResponse.meta.store
    const promotionsMap = readSellerPromotions()
    const storePromotions = getStorePromotions(promotionsMap, store)

    writeSellerPromotions({
      ...promotionsMap,
      [store.storeId]: storePromotions.filter((promotion) => String(promotion.id) !== String(promotionId)),
    })

    return { success: true, data: promotionResponse.data, message: 'Đã xóa khuyến mãi.' }
  },

  previewSellerProductSku(currentUser, productPayload = {}) {
    if (USE_API) {
      const name = String(productPayload.name || '').trim()
      const category = String(productPayload.category || '').trim()

      return {
        success: true,
        data: {
          skuCode: name && category ? 'SKU sẽ được backend tự sinh khi lưu' : '',
        },
      }
    }

    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return storeResponse
    }

    const name = String(productPayload.name || '').trim()
    const category = String(productPayload.category || '').trim()

    return {
      success: true,
      data: {
        skuCode: name && category
          ? generateSellerProductSku(storeResponse.data, name, category)
          : '',
      },
    }
  },

  previewSellerProductVariantSkus(currentUser, productPayload = {}) {
    if (USE_API) {
      return {
        success: true,
        data: [],
      }
    }

    const storeResponse = sellerService.getSellerStore(currentUser)

    if (!storeResponse.success) {
      return storeResponse
    }

    const name = String(productPayload.name || '').trim()
    const category = String(productPayload.category || '').trim()
    const requestedSkus = Array.isArray(productPayload.skus) ? productPayload.skus : []

    return {
      success: true,
      data: name && category
        ? generateSellerVariantSkus(storeResponse.data, name, category, requestedSkus, 'PREVIEW')
        : [],
    }
  },

  createSellerProduct(currentUser, productPayload = {}) {
    if (USE_API) {
      return buildApiProductPayload(productPayload)
        .then((payload) => apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        }))
        .then((result) => ({
          success: true,
          data: mapApiSellerProduct(result.data),
          message: 'Đã tạo sản phẩm bằng API thật.',
        }))
        .catch((error) => ({
          success: false,
          message: error.message,
        }))
    }

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
    const requestedSkus = Array.isArray(productPayload.skus) ? productPayload.skus : []

    if (!name || !category || !price || price <= 0 || Number.isNaN(price) || stockQuantity < 0 || Number.isNaN(stockQuantity)) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ tên sản phẩm, danh mục, giá bán và số lượng tồn kho hợp lệ.',
      }
    }

    if (requestedSkus.some((sku) => !String(sku.variantName || '').trim() || Number(sku.price) <= 0 || Number(sku.stockQuantity) < 0)) {
      return {
        success: false,
        message: 'Vui lòng nhập giá bán và tồn kho hợp lệ cho tất cả biến thể.',
      }
    }

    const store = storeResponse.data
    const storedProducts = readSellerProducts()
    const createdAt = new Date().toISOString()
    let productSequence = Date.now()

    while (storedProducts.some((product) => String(product.id) === `SELLER-PRODUCT-${productSequence}`)) {
      productSequence += 1
    }

    const id = `SELLER-PRODUCT-${productSequence}`
    const generatedSkus = requestedSkus.length
      ? generateSellerVariantSkus(store, name, category, requestedSkus, id)
      : []
    const defaultSkuCode = generateSellerProductSku(store, name, category)
    const primarySku = generatedSkus[0]
    const product = {
      id,
      name,
      slug: createSlug(name) || id.toLowerCase(),
      skuId: primarySku?.skuId || buildDefaultSkuId(id),
      skuCode: primarySku?.skuCode || defaultSkuCode,
      variantName: primarySku?.variantName || 'Mặc định',
      skus: generatedSkus.length ? generatedSkus : undefined,
      attributes: Array.isArray(productPayload.attributes) ? productPayload.attributes : undefined,
      variantImages: productPayload.variantImages && typeof productPayload.variantImages === 'object' ? productPayload.variantImages : undefined,
      description,
      price,
      originalPrice: Number(productPayload.originalPrice) || price,
      discountPercent: 0,
      imageUrl: imageUrl || '/images/products/headphones.png',
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
    if (USE_API) {
      return Promise.all([
        sellerService.getSellerStore(currentUser),
        sellerService.getSellerProducts(currentUser, {}),
      ]).then(([storeResponse, productsResponse]) => {
        if (!storeResponse.success) return storeResponse
        if (!productsResponse.success) return productsResponse

        const product = productsResponse.data.find((item) => String(item.id) === String(productId))

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
      }).catch((error) => ({
        success: false,
        message: error.message,
      }))
    }

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
    if (USE_API) {
      return buildApiProductPayload(productPayload)
        .then((payload) => apiRequest(`/products/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            category_id: payload.category_id,
            product_name: payload.product_name,
            description: payload.description,
            price: payload.price,
            stock_quantity: payload.stock_quantity,
            status: payload.status,
            variants: payload.variants,
          }),
        }))
        .then((result) => ({
          success: true,
          data: mapApiSellerProduct(result.data),
          message: 'Đã cập nhật sản phẩm bằng API thật.',
        }))
        .catch((error) => ({
          success: false,
          message: error.message,
        }))
    }

    const productResponse = sellerService.getSellerProductById(currentUser, productId)

    if (!productResponse.success) {
      return productResponse
    }

    const name = String(productPayload.name || '').trim()
    const category = String(productPayload.category || '').trim()
    const price = Number(productPayload.price)
    const stockQuantity = Number(productPayload.stockQuantity)
    const requestedSkus = Array.isArray(productPayload.skus) ? productPayload.skus : []

    if (!name || !category || !price || price <= 0 || Number.isNaN(price) || stockQuantity < 0 || Number.isNaN(stockQuantity)) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ tên sản phẩm, danh mục, giá bán và số lượng tồn kho hợp lệ.',
      }
    }

    if (requestedSkus.some((sku) => (
      !String(sku.variantName || '').trim()
      || !/^[A-Z0-9-]+$/.test(String(sku.skuCode || ''))
      || Number(sku.price) <= 0
      || Number(sku.stockQuantity) < 0
    ))) {
      return {
        success: false,
        message: 'Thông tin SKU biến thể không hợp lệ.',
      }
    }

    if (new Set(requestedSkus.map((sku) => sku.skuCode)).size !== requestedSkus.length) {
      return {
        success: false,
        message: 'Mã SKU biến thể không được trùng nhau.',
      }
    }

    const currentProduct = productResponse.data
    const normalizedSkus = requestedSkus.map((sku, index) => ({
      skuId: sku.skuId || `${buildDefaultSkuId(productId)}-${String(index + 1).padStart(3, '0')}`,
      skuCode: String(sku.skuCode).trim().toUpperCase(),
      variantName: String(sku.variantName).trim(),
      price: Number(sku.price),
      originalPrice: Number(sku.originalPrice) || Number(sku.price),
      stockQuantity: Number(sku.stockQuantity),
      status: Object.values(PRODUCT_STATUSES).includes(sku.status) ? sku.status : PRODUCT_STATUSES.ACTIVE,
      imageUrl: String(sku.imageUrl || '').trim() || currentProduct.imageUrl,
    }))
    const primarySku = normalizedSkus[0]
    const nextProduct = {
      ...currentProduct,
      name,
      slug: createSlug(name) || currentProduct.slug,
      description: String(productPayload.description || '').trim(),
      category,
      skuId: primarySku?.skuId || currentProduct.skuId,
      skuCode: primarySku?.skuCode || currentProduct.skuCode,
      variantName: primarySku?.variantName || currentProduct.variantName || 'Mặc định',
      skus: normalizedSkus.length ? normalizedSkus : currentProduct.skus,
      attributes: normalizedSkus.length && Array.isArray(productPayload.attributes)
        ? productPayload.attributes
        : currentProduct.attributes,
      variantImages: normalizedSkus.length && productPayload.variantImages && typeof productPayload.variantImages === 'object'
        ? productPayload.variantImages
        : currentProduct.variantImages,
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
    if (USE_API) {
      return apiRequest(`/products/${productId}`, { method: 'DELETE' })
        .then((result) => ({
          success: true,
          data: result.data,
          message: result.message || 'Đã ẩn sản phẩm bằng API thật.',
        }))
        .catch((error) => ({
          success: false,
          message: error.message,
        }))
    }

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
    if (USE_API) {
      const params = new URLSearchParams({ limit: '100' })
      if (keyword) params.set('keyword', keyword)
      if (status && status !== 'all') params.set('status', toApiStatus(status))

      return Promise.all([
        sellerService.getSellerStore(currentUser),
        apiRequest(`/seller/products?${params.toString()}`),
      ]).then(([storeResponse, result]) => {
        if (!storeResponse.success) return { ...storeResponse, data: [] }

        const normalizedCategory = normalizeText(category)
        const rows = (result.data?.products || [])
          .map((product) => mapApiSellerProduct(product, storeResponse.data))
          .filter((product) => !normalizedCategory || normalizeText(product.category) === normalizedCategory)

        return {
          success: true,
          data: rows,
          meta: {
            store: storeResponse.data,
            totalCount: result.data?.pagination?.total_items ?? rows.length,
            pagination: result.data?.pagination,
          },
        }
      }).catch((error) => ({
        success: false,
        data: [],
        message: error.message,
      }))
    }

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
    const inventoryRows = storeProducts
      .flatMap((product) => {
        const productSkus = Array.isArray(product.skus) && product.skus.length
          ? product.skus
          : [{
              skuId: product.skuId,
              skuCode: product.skuCode,
              variantName: product.variantName || 'Mặc định',
              price: product.price,
              stockQuantity: product.stockQuantity,
              status: product.status,
              imageUrl: product.imageUrl,
            }]

        return productSkus.map((sku, skuIndex) => {
          const availableStock = Number(sku.stockQuantity) || 0
          const estimatedReservedStock = Math.round((Number(product.soldQuantity) || 0) * 0.04 / productSkus.length)
          const reservedStock = Math.min(Math.max(estimatedReservedStock, 0), availableStock)
          const stockState = availableStock === 0 ? 'OUT' : availableStock <= 20 ? 'LOW' : 'AVAILABLE'

          return {
            ...product,
            id: `${product.id}::${sku.skuId || sku.skuCode || skuIndex + 1}`,
            inventoryRowId: `${product.id}::${sku.skuId || sku.skuCode || skuIndex + 1}`,
            productId: product.id,
            skuId: sku.skuId || product.skuId,
            skuCode: sku.skuCode || product.skuCode,
            variantName: sku.variantName || product.variantName || 'Mặc định',
            price: Number(sku.price ?? product.price),
            imageUrl: sku.imageUrl || product.imageUrl,
            skuStatus: sku.status || product.status,
            hasVariants: Array.isArray(product.skus) && product.skus.length > 0,
            availableStock,
            stockQuantity: availableStock,
            reservedStock,
            stockState,
          }
        })
      })
      .map((row, index) => ({
        ...row,
        warehouseLocation: row.warehouseLocation || `Khu ${String.fromCharCode(65 + (index % 4))}-${String(index + 1).padStart(2, '0')}`,
      }))

    const filteredRows = inventoryRows.filter((product) => {
      const matchesKeyword =
        !normalizedKeyword ||
        [product.name, product.category, product.slug, product.skuCode, product.variantName]
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

  updateSellerInventoryStock(currentUser, productId, skuIdentifier, nextStockQuantity) {
    if (nextStockQuantity === undefined) {
      nextStockQuantity = skuIdentifier
      skuIdentifier = ''
    }

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

    if (Array.isArray(product.skus) && product.skus.length && skuIdentifier) {
      let matchedSku = false
      const nextSkus = product.skus.map((sku) => {
        const isSelectedSku = String(sku.skuId) === String(skuIdentifier) || String(sku.skuCode) === String(skuIdentifier)

        if (!isSelectedSku) return sku

        matchedSku = true
        return {
          ...sku,
          stockQuantity,
          status: stockQuantity === 0
            ? PRODUCT_STATUSES.OUT_OF_STOCK
            : sku.status === PRODUCT_STATUSES.HIDDEN
              ? PRODUCT_STATUSES.HIDDEN
              : PRODUCT_STATUSES.ACTIVE,
        }
      })

      if (!matchedSku) {
        return {
          success: false,
          message: 'Không tìm thấy SKU cần cập nhật tồn kho.',
        }
      }

      const totalStock = nextSkus.reduce((total, sku) => total + Number(sku.stockQuantity || 0), 0)
      const activePrices = nextSkus.map((sku) => Number(sku.price)).filter((price) => price > 0)
      const activeOriginalPrices = nextSkus.map((sku) => Number(sku.originalPrice || sku.price)).filter((price) => price > 0)

      return sellerService.updateSellerProduct(currentUser, productId, {
        ...product,
        skus: nextSkus,
        price: activePrices.length ? Math.min(...activePrices) : product.price,
        originalPrice: activeOriginalPrices.length ? Math.min(...activeOriginalPrices) : product.originalPrice,
        stockQuantity: totalStock,
        status: totalStock === 0
          ? PRODUCT_STATUSES.OUT_OF_STOCK
          : product.status === PRODUCT_STATUSES.HIDDEN
            ? PRODUCT_STATUSES.HIDDEN
            : PRODUCT_STATUSES.ACTIVE,
      })
    }

    return sellerService.updateSellerProduct(currentUser, productId, {
      ...product,
      stockQuantity,
      status: stockQuantity === 0 ? PRODUCT_STATUSES.OUT_OF_STOCK : PRODUCT_STATUSES.ACTIVE,
    })
  },

  getSellerProductOrderHistory(currentUser, productId, { keyword = '', range = '30d', skuCode = '' } = {}) {
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
    const now = new Date()
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
          .filter((item) => (
            String(item.productId) === String(productId)
            && item.storeId === store.storeId
            && (!skuCode || !item.skuCode || String(item.skuCode) === String(skuCode))
          ))
          .map((item) => {
            const quantity = item.quantity || 1
            const unitPrice = item.unitPrice || item.price || product.price || Math.round(order.totalAmount / quantity)

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
    if (USE_API) {
      return Promise.all([
        sellerService.getSellerStore(currentUser),
        sellerService.getSellerProducts(currentUser, {}),
        sellerService.getSellerOrders(currentUser, {}),
        sellerService.getSellerRevenueReport(currentUser, { range: '7d' }),
      ]).then(([storeResponse, productsResponse, ordersResponse, revenueResponse]) => {
        if (!storeResponse.success) return storeResponse
        if (!revenueResponse.success) return revenueResponse

        const sellerProducts = productsResponse.success ? productsResponse.data : []
        const sellerOrders = ordersResponse.success ? ordersResponse.data : []
        const activeProducts = sellerProducts.filter((product) => product.status === PRODUCT_STATUSES.ACTIVE)
        const lowStockProducts = sellerProducts.filter((product) => product.stockQuantity > 0 && product.stockQuantity <= 20)
        const statistics = revenueResponse.meta.orderStatistics
        const pendingOrders = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP']
          .reduce((total, status) => total + Number(statistics[status] || 0), 0)
        const completedRevenue = revenueResponse.meta.totalRevenue

        return {
          success: true,
          data: {
            store: storeResponse.data,
            cards: [
              {
                id: 'revenue',
                title: 'Doanh thu hoàn thành',
                value: `${formatCompactCurrency(completedRevenue)}đ`,
                icon: 'payments',
                iconClassName: 'bg-primary/10 text-primary',
                trendText: 'Tính từ đơn hàng API đã hoàn thành',
                trendClassName: 'text-[#5b403b]',
              },
              {
                id: 'orders',
                title: 'Đơn hàng',
                value: `${revenueResponse.meta.totalOrders}`,
                icon: 'shopping_cart',
                iconClassName: 'bg-[#0284C7]/10 text-[#0284C7]',
                trendText: `${pendingOrders.length} đơn chờ xử lý`,
                trendClassName: pendingOrders.length ? 'text-[#F59E0B]' : 'text-[#5b403b]',
              },
              {
                id: 'products',
                title: 'Sản phẩm đang bán',
                value: `${activeProducts.length}`,
                icon: 'inventory_2',
                iconClassName: 'bg-[#F59E0B]/10 text-[#F59E0B]',
                trendText: `${lowStockProducts.length} sản phẩm sắp hết hàng`,
                trendClassName: lowStockProducts.length ? 'text-[#F59E0B]' : 'text-[#5b403b]',
                trendIcon: lowStockProducts.length ? 'warning' : 'check_circle',
              },
              {
                id: 'rating',
                title: 'Tổng sản phẩm',
                value: `${sellerProducts.length}`,
                icon: 'star',
                iconClassName: 'bg-[#F59E0B]/10 text-[#F59E0B]',
                trendText: 'Dữ liệu từ seller products API',
                trendClassName: 'text-[#5b403b]',
              },
            ],
            quickActions: [
              { id: 'add', label: 'Đăng sản phẩm', icon: 'add_box', accentClassName: 'bg-primary/10 text-primary' },
              { id: 'ship', label: 'Quản lý vận chuyển', icon: 'local_shipping', accentClassName: 'bg-[#F97316]/10 text-[#F97316]' },
              { id: 'promo', label: 'Tạo khuyến mãi', icon: 'campaign', accentClassName: 'bg-[#16A34A]/10 text-[#16A34A]' },
            ],
            recentOrders: sellerOrders.slice(0, 5),
            weekRevenue: revenueResponse.data.chart.map((point) => ({
              label: point.label.slice(0, 5),
              value: Number((point.value / 1000000).toFixed(2)),
            })),
          },
        }
      }).catch((error) => ({
        success: false,
        message: error.message,
      }))
    }

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
    if (USE_API) {
      const params = new URLSearchParams({ limit: '100' })
      if (status && status !== 'all') params.set('status', status === 'PACKING' ? 'READY_TO_SHIP' : status)

      return Promise.all([
        sellerService.getSellerStore(currentUser),
        apiRequest(`/seller/orders?${params.toString()}`),
      ]).then(([storeResponse, result]) => {
        if (!storeResponse.success) return { ...storeResponse, data: [] }

        const normalizedKeyword = normalizeText(keyword)
        const rows = (result.data?.orders || [])
          .map(mapApiSellerOrder)
          .filter((order) => {
            const matchesKeyword =
              !normalizedKeyword ||
              [order.id, order.code, order.customerName, order.productName]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(normalizedKeyword)
            const orderDate = order.orderedAt.slice(0, 10)
            const matchesDateFrom = !dateFrom || orderDate >= dateFrom
            const matchesDateTo = !dateTo || orderDate <= dateTo

            return matchesKeyword && matchesDateFrom && matchesDateTo
          })

        return {
          success: true,
          data: rows,
          meta: {
            store: storeResponse.data,
            totalCount: result.data?.pagination?.total_items ?? rows.length,
            pagination: result.data?.pagination,
          },
        }
      }).catch((error) => ({
        success: false,
        data: [],
        message: error.message,
      }))
    }

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
    if (USE_API) {
      return Promise.all([
        sellerService.getSellerStore(currentUser),
        apiRequest(`/seller/orders/${orderId}`),
      ]).then(([storeResponse, result]) => {
        if (!storeResponse.success) return storeResponse

        return {
          success: true,
          data: mapApiSellerOrderDetail(result.data),
          meta: {
            store: storeResponse.data,
          },
        }
      }).catch((error) => ({
        success: false,
        message: error.message,
      }))
    }

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
    if (USE_API) {
      const apiStatus = nextStatus === 'PACKING' ? 'READY_TO_SHIP' : nextStatus

      return apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          new_status: apiStatus,
          change_note: 'Seller cập nhật trạng thái từ giao diện quản lý.',
        }),
      })
        .then((result) => ({
          success: true,
          data: mapApiSellerOrder(result.data),
          message: 'Đã cập nhật trạng thái đơn hàng bằng API thật.',
        }))
        .catch((error) => ({
          success: false,
          message: error.message,
        }))
    }

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

  async getSellerRevenueReport(currentUser, { keyword = '', range = '30d', dateFrom = '', dateTo = '' } = {}) {
    if (!USE_API) {
      return { success: false, message: 'Báo cáo doanh thu chỉ khả dụng trong chế độ API.' }
    }

    const formatDate = (date) => [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')
    const today = new Date()
    const start = new Date(today)

    if (range === '7d') {
      start.setDate(today.getDate() - 6)
    } else if (range === 'month') {
      start.setDate(1)
    } else if (range === 'year') {
      start.setMonth(0, 1)
    } else {
      start.setDate(today.getDate() - 29)
    }

    const fromDate = dateFrom || formatDate(start)
    const toDate = dateTo || formatDate(today)
    const groupBy = range === 'year' ? 'month' : 'day'
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      group_by: groupBy,
      limit: '100',
    })

    try {
      const result = await apiRequest('/seller/revenue?' + params.toString())
      const report = result.data || {}
      const normalizedKeyword = normalizeText(keyword)
      const totalRevenue = Number(report.total_revenue) || 0
      const orderCount = Number(report.completed_orders) || 0
      const averageOrderValue = orderCount ? totalRevenue / orderCount : 0
      const store = mapApiStore(report.store || {})
      const chart = (report.revenue_by_period || []).map((point) => {
        const parts = String(point.period || '').split('-')
        const label = parts.length === 3
          ? [parts[2], parts[1], parts[0]].join('/')
          : parts.length === 2
            ? [parts[1], parts[0]].join('/')
            : String(point.period || '')
        return { label, period: point.period, value: Number(point.revenue) || 0 }
      })
      const rows = (report.top_products || [])
        .map((product, index) => {
          const quantitySold = Number(product.quantity_sold) || 0
          const rowRevenue = Number(product.revenue) || 0
          return {
            id: String(product.product_id) + '::' + String(product.variant_id || 'default'),
            productId: String(product.product_id),
            skuId: product.variant_id,
            name: product.product_name || 'Sản phẩm',
            sku: product.sku_code || 'Chưa có SKU',
            variantName: product.variant_name || 'Mặc định',
            quantitySold,
            totalRevenue: rowRevenue,
            unitPrice: quantitySold ? rowRevenue / quantitySold : 0,
            imageUrl: FALLBACK_IMAGE,
            rank: index + 1,
          }
        })
        .filter((row) => (
          !normalizedKeyword
          || normalizeText(row.name).includes(normalizedKeyword)
          || normalizeText(row.sku).includes(normalizedKeyword)
          || normalizeText(row.variantName).includes(normalizedKeyword)
        ))

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
              trendText: 'Chỉ tính đơn COMPLETED',
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
              trendText: String(report.cancelled_orders || 0) + ' đơn đã hủy trong kỳ',
              trendClassName: 'text-[#5b403b]',
              trendIcon: 'receipt_long',
              bgAccentClassName: 'bg-[#ffdad3]/25',
            },
            {
              id: 'avg-order',
              title: 'Giá trị trung bình đơn',
              value: formatCardValue(averageOrderValue),
              suffix: 'đ',
              icon: 'receipt_long',
              iconWrapClassName: 'bg-[#e3e2e2] text-[#5b403b]',
              trendText: 'Từ dữ liệu đơn hoàn thành',
              trendClassName: 'text-[#5b403b]',
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
          totalOrders: Number(report.total_orders) || 0,
          totalRevenue,
          averageOrderValue,
          orderStatistics: report.order_statistics || {},
          fromDate,
          toDate,
        },
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
  getProductStatusMeta(status) {
    return productStatusMeta[status] || productStatusMeta[PRODUCT_STATUSES.HIDDEN]
  },
}
