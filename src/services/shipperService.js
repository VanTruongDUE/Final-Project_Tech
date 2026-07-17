import { apiRequest } from './apiClient'

const SHIPPER_SHIPMENTS_STORAGE_KEY = 'techtonic_shipper_shipments'
const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'

const statusMeta = {
  ASSIGNED: {
    label: 'Đã phân công',
    timelineLabel: 'Đã phân công cho shipper',
    className: 'bg-blue-100 text-blue-800',
    icon: 'assignment',
  },
  PICKED_UP: {
    label: 'Đã lấy hàng',
    timelineLabel: 'Đã lấy hàng',
    className: 'bg-violet-100 text-violet-800',
    icon: 'inventory_2',
  },
  IN_TRANSIT: {
    label: 'Đang giao',
    timelineLabel: 'Đang giao',
    className: 'bg-orange-100 text-orange-800',
    icon: 'local_shipping',
  },
  DELIVERED: {
    label: 'Đã giao',
    timelineLabel: 'Đã giao hàng',
    className: 'bg-green-100 text-green-800',
    icon: 'check_circle',
  },
  FAILED: {
    label: 'Giao thất bại',
    timelineLabel: 'Giao thất bại',
    className: 'bg-red-100 text-red-800',
    icon: 'error',
  },
  CANCELLED: {
    label: 'Đã hủy',
    timelineLabel: 'Đã hủy',
    className: 'bg-slate-100 text-slate-700',
    icon: 'cancel',
  },
}

const statusTransitions = {
  ASSIGNED: ['PICKED_UP'],
  PICKED_UP: ['IN_TRANSIT'],
  IN_TRANSIT: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  FAILED: [],
  CANCELLED: [],
}

const statusFlow = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED']

const shipperProfileMap = {
  'shipper@techtonic.vn': {
    shipperId: 'SHIPPER-TECHTONIC-01',
    displayName: 'TechTonic Shipper',
  },
}

const shipperShipments = [
  {
    id: 'SHIP-8823',
    orderId: 'ORD-092A',
    shipperId: 'SHIPPER-TECHTONIC-01',
    receiverName: 'Nguyễn Minh Anh',
    receiverPhone: '090 112 2834',
    receiverAddress: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    estimatedDelivery: '2024-10-24T14:00:00',
    codAmount: 1250000,
    status: 'ASSIGNED',
    updatedAt: '08:30',
    sender: {
      shopName: 'TechTonic Gear',
      contactName: 'Bộ phận vận hành',
      contactPhone: '1800 6688',
      address: 'Kho A, Khu Công Nghệ Cao, TP. Hồ Chí Minh',
    },
    items: [
      { id: 'SKU-K500', name: 'Bàn phím cơ không dây K500', sku: 'TT-056', quantity: 1 },
      { id: 'SKU-M24', name: 'Chuột gaming M24 Pro', sku: 'TT-024', quantity: 1 },
    ],
    deliveryNote: 'Gọi trước khi đến. Khách nhận tại sảnh tòa nhà.',
    history: [
      { status: 'ASSIGNED', time: '24/10/2024 08:30', description: 'Kho A' },
    ],
  },
  {
    id: 'SHIP-8824',
    orderId: 'ORD-093B',
    shipperId: 'SHIPPER-TECHTONIC-01',
    receiverName: 'Trần Gia Huy',
    receiverPhone: '091 837 1120',
    receiverAddress: '45 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
    estimatedDelivery: '2024-10-24T16:30:00',
    codAmount: 0,
    status: 'IN_TRANSIT',
    updatedAt: '09:15',
    sender: {
      shopName: 'Mega Electronics Hub',
      contactName: 'Hỗ trợ giao hàng',
      contactPhone: '1800 9999',
      address: 'Kho Trung tâm, Quận Tân Bình, TP. Hồ Chí Minh',
    },
    items: [
      { id: 'SKU-AIR2', name: 'Tai nghe AirPods Pro 2', sku: 'APP2-GEN', quantity: 1 },
    ],
    deliveryNote: 'Đơn đã thanh toán. Khách yêu cầu giao trong giờ hành chính.',
    history: [
      { status: 'ASSIGNED', time: '24/10/2024 08:00', description: 'Kho Trung tâm' },
      { status: 'PICKED_UP', time: '24/10/2024 09:15', description: 'Đã lấy hàng tại kho' },
      { status: 'IN_TRANSIT', time: '24/10/2024 10:00', description: 'Đang di chuyển đến địa chỉ giao' },
    ],
  },
  {
    id: 'SHIP-8820',
    orderId: 'ORD-089X',
    shipperId: 'SHIPPER-TECHTONIC-01',
    receiverName: 'Lê Hoàng Phúc',
    receiverPhone: '093 443 9099',
    receiverAddress: '18 Trần Phú, Hà Đông, Hà Nội',
    estimatedDelivery: '2024-10-23T11:00:00',
    codAmount: 540000,
    status: 'DELIVERED',
    updatedAt: '10:05',
    sender: {
      shopName: 'Tech Mobile Store',
      contactName: 'Điều phối kho Hà Nội',
      contactPhone: '024 8899 1100',
      address: 'Kho Hà Đông, Hà Nội',
    },
    items: [
      { id: 'SKU-C65', name: 'Sạc nhanh USB-C 65W', sku: 'TT-065', quantity: 2 },
    ],
    deliveryNote: 'Đã thu COD và bàn giao hàng nguyên vẹn.',
    history: [
      { status: 'ASSIGNED', time: '23/10/2024 08:10', description: 'Kho Hà Đông' },
      { status: 'PICKED_UP', time: '23/10/2024 09:00', description: 'Đã lấy hàng' },
      { status: 'IN_TRANSIT', time: '23/10/2024 09:30', description: 'Đang giao đến khách' },
      { status: 'DELIVERED', time: '23/10/2024 10:05', description: 'Khách đã nhận hàng' },
    ],
  },
  {
    id: 'SHIP-8815',
    orderId: 'ORD-085Y',
    shipperId: 'SHIPPER-TECHTONIC-01',
    receiverName: 'Phạm Thanh Mai',
    receiverPhone: '097 221 5543',
    receiverAddress: '76 Bạch Đằng, Hải Châu, Đà Nẵng',
    estimatedDelivery: '2024-10-23T18:00:00',
    codAmount: 690000,
    status: 'FAILED',
    updatedAt: '11:20',
    sender: {
      shopName: 'Sound City',
      contactName: 'Chăm sóc shop',
      contactPhone: '0236 778 6688',
      address: 'Kho Hải Châu, Đà Nẵng',
    },
    items: [
      { id: 'SKU-SPK12', name: 'Loa Bluetooth Soundbar Mini', sku: 'SB-MINI', quantity: 1 },
    ],
    deliveryNote: 'Không liên hệ được người nhận sau 3 cuộc gọi.',
    history: [
      { status: 'ASSIGNED', time: '23/10/2024 08:45', description: 'Kho Hải Châu' },
      { status: 'PICKED_UP', time: '23/10/2024 09:25', description: 'Đã lấy hàng' },
      { status: 'IN_TRANSIT', time: '23/10/2024 10:10', description: 'Đang giao' },
      { status: 'FAILED', time: '23/10/2024 11:20', description: 'Không liên hệ được người nhận' },
    ],
  },
  {
    id: 'SHIP-8809',
    orderId: 'ORD-081C',
    shipperId: 'SHIPPER-TECHTONIC-01',
    receiverName: 'Đỗ Minh Quân',
    receiverPhone: '090 555 7788',
    receiverAddress: '22 Cách Mạng Tháng 8, Cần Thơ',
    estimatedDelivery: '2024-10-25T10:30:00',
    codAmount: 2100000,
    status: 'PICKED_UP',
    updatedAt: '12:10',
    sender: {
      shopName: 'Laptop Center',
      contactName: 'Kho miền Tây',
      contactPhone: '0292 555 7788',
      address: 'Kho Ninh Kiều, Cần Thơ',
    },
    items: [
      { id: 'SKU-LAP14', name: 'Laptop văn phòng 14 inch', sku: 'LAP-14-PRO', quantity: 1 },
    ],
    deliveryNote: 'Hàng giá trị cao, yêu cầu khách ký nhận.',
    history: [
      { status: 'ASSIGNED', time: '25/10/2024 08:00', description: 'Kho Ninh Kiều' },
      { status: 'PICKED_UP', time: '25/10/2024 09:10', description: 'Đã lấy hàng tại kho' },
    ],
  },
  {
    id: 'SHIP-8801',
    orderId: 'ORD-078K',
    shipperId: 'SHIPPER-TECHTONIC-02',
    receiverName: 'Bùi Thu Hà',
    receiverPhone: '094 778 1200',
    receiverAddress: '9 Lê Lợi, Huế',
    estimatedDelivery: '2024-10-25T15:00:00',
    codAmount: 850000,
    status: 'IN_TRANSIT',
    updatedAt: '13:00',
    sender: {
      shopName: 'Hue Camera Shop',
      contactName: 'Điều phối Huế',
      contactPhone: '0234 112 7788',
      address: 'Kho Phú Hội, Huế',
    },
    items: [
      { id: 'SKU-CAM01', name: 'Camera hành trình Mini 4K', sku: 'CAM-4K-MINI', quantity: 1 },
    ],
    deliveryNote: 'Đơn thuộc shipper khác, dùng để kiểm tra phân quyền dữ liệu.',
    history: [
      { status: 'ASSIGNED', time: '25/10/2024 10:00', description: 'Kho Phú Hội' },
      { status: 'PICKED_UP', time: '25/10/2024 11:00', description: 'Đã lấy hàng' },
      { status: 'IN_TRANSIT', time: '25/10/2024 13:00', description: 'Đang giao' },
    ],
  },
]

const vnd = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`

const normalizeText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()

function formatDeliveryDate(value) {
  if (!value) {
    return 'Chưa có dữ liệu'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatUpdateTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function buildAddress(...parts) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(', ')
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function toUiShipmentStatus(status) {
  const normalizedStatus = String(status || '').trim().toUpperCase()

  if (normalizedStatus === 'SHIPPING') return 'IN_TRANSIT'
  if (normalizedStatus === 'DELIVERY_FAILED') return 'FAILED'

  return normalizedStatus || 'ASSIGNED'
}

function toBackendShipmentStatus(status) {
  const normalizedStatus = String(status || '').trim().toUpperCase()

  if (normalizedStatus === 'IN_TRANSIT') return 'SHIPPING'
  if (normalizedStatus === 'FAILED') return 'DELIVERY_FAILED'

  return normalizedStatus
}

function formatApiTime(value) {
  if (!value) {
    return 'Chờ cập nhật'
  }

  try {
    return formatDeliveryDate(value)
  } catch {
    return String(value)
  }
}

function buildApiTimeline(shipment) {
  const events = [
    { status: 'ASSIGNED', time: shipment.assignedAt, description: 'Đã phân công cho shipper' },
    { status: 'PICKED_UP', time: shipment.pickedUpAt, description: 'Đã lấy hàng từ shop' },
    { status: 'IN_TRANSIT', time: shipment.pickedUpAt, description: 'Đang giao đến khách hàng' },
    {
      status: shipment.status === 'FAILED' ? 'FAILED' : 'DELIVERED',
      time: shipment.deliveredAt,
      description: shipment.status === 'FAILED' ? shipment.failedReason || 'Giao hàng thất bại' : 'Giao hàng thành công',
    },
  ]
  const currentIndex = statusFlow.indexOf(shipment.status)

  return events.map((event, index) => {
    const isTerminalFailure = shipment.status === 'FAILED' && event.status === 'FAILED'
    const isCompleted = Boolean(event.time) || index < currentIndex || isTerminalFailure
    const isCurrent = event.status === shipment.status && !['DELIVERED', 'FAILED', 'CANCELLED'].includes(shipment.status)

    return {
      status: event.status,
      label: statusMeta[event.status]?.timelineLabel || statusMeta.ASSIGNED.timelineLabel,
      description: isCompleted || index <= currentIndex ? event.description : 'Đang chờ',
      time: formatApiTime(event.time),
      state: isCompleted ? 'completed' : isCurrent ? 'current' : 'pending',
    }
  })
}

function mapApiShipment(apiShipment = {}) {
  const status = toUiShipmentStatus(apiShipment.shipment_status)
  const receiverAddress = buildAddress(
    apiShipment.shipping_address_line,
    apiShipment.shipping_ward,
    apiShipment.shipping_district,
    apiShipment.shipping_province,
  )
  const senderAddress = buildAddress(
    apiShipment.store_address_line,
    apiShipment.store_ward,
    apiShipment.store_district,
    apiShipment.store_province,
  )
  const totalAmount = Number(apiShipment.total_amount || 0)
  const shipment = {
    id: String(apiShipment.shipment_id || ''),
    shipmentId: apiShipment.shipment_id,
    orderId: apiShipment.order_code || String(apiShipment.order_id || 'Chưa có dữ liệu'),
    orderNumericId: apiShipment.order_id,
    orderStatus: apiShipment.order_status || 'Chưa có dữ liệu',
    trackingCode: apiShipment.tracking_code || 'Chưa có dữ liệu',
    receiverName: apiShipment.recipient_name || 'Chưa có dữ liệu',
    receiverPhone: apiShipment.recipient_phone || 'Chưa có dữ liệu',
    receiverAddress: receiverAddress || 'Chưa có dữ liệu',
    estimatedDelivery: apiShipment.delivered_at || apiShipment.assigned_at || apiShipment.created_at,
    codAmount: apiShipment.payment_method === 'COD' ? totalAmount : 0,
    totalAmount,
    paymentMethod: apiShipment.payment_method || 'Chưa có dữ liệu',
    paymentStatus: apiShipment.payment_status || 'Chưa có dữ liệu',
    status,
    updatedAt: formatApiTime(apiShipment.delivered_at || apiShipment.picked_up_at || apiShipment.assigned_at || apiShipment.created_at),
    assignedAt: apiShipment.assigned_at,
    pickedUpAt: apiShipment.picked_up_at,
    deliveredAt: apiShipment.delivered_at,
    failedReason: apiShipment.failed_reason || '',
    sender: {
      shopName: apiShipment.store_name || 'Chưa có dữ liệu',
      contactName: apiShipment.store_name || 'Chưa có dữ liệu',
      contactPhone: apiShipment.store_phone || 'Chưa có dữ liệu',
      address: senderAddress || 'Chưa có dữ liệu',
    },
    items: [],
    deliveryNote: apiShipment.customer_note || apiShipment.failed_reason || 'Không có ghi chú giao hàng.',
  }

  return {
    ...shipment,
    statusMeta: statusMeta[shipment.status] || statusMeta.ASSIGNED,
    codLabel: shipment.codAmount ? vnd(shipment.codAmount) : 'Đã thanh toán',
    estimatedDeliveryLabel: formatDeliveryDate(shipment.estimatedDelivery),
    timeline: buildApiTimeline(shipment),
    nextStatuses: statusTransitions[shipment.status] || [],
  }
}

function buildApiDashboard(shipments) {
  const delivered = shipments.filter((shipment) => shipment.status === 'DELIVERED').length
  const assigned = shipments.filter((shipment) => shipment.status === 'ASSIGNED' || shipment.status === 'PICKED_UP').length
  const inTransit = shipments.filter((shipment) => shipment.status === 'IN_TRANSIT').length
  const failed = shipments.filter((shipment) => shipment.status === 'FAILED').length
  const total = shipments.length

  return {
    shipper: {
      shipperId: 'API-SHIPPER',
      displayName: 'Shipper TechTonic',
    },
    metrics: [
      { id: 'assigned', label: 'Được giao', value: assigned, icon: 'assignment', iconClassName: 'bg-blue-100 text-blue-800' },
      { id: 'shipping', label: 'Đang giao', value: inTransit, icon: 'local_shipping', iconClassName: 'bg-orange-100 text-orange-800', featured: true },
      { id: 'delivered', label: 'Đã giao', value: delivered, icon: 'check_circle', iconClassName: 'bg-green-100 text-green-800' },
      { id: 'failed', label: 'Cần xử lý', value: failed, icon: 'error', iconClassName: 'bg-red-100 text-red-800', danger: true },
    ],
    distribution: {
      total,
      onTimeRate: total ? Math.round((delivered / total) * 100) : 0,
      successPercent: total ? Math.round((delivered / total) * 100) : 0,
      pendingPercent: total ? Math.round(((assigned + inTransit) / total) * 100) : 0,
      failedPercent: total ? Math.round((failed / total) * 100) : 0,
    },
    recentShipments: shipments.slice(0, 4),
  }
}

async function fetchApiShipments({ keyword = '', status = 'all' } = {}) {
  const query = new URLSearchParams({ page: '1', limit: '100' })
  const backendStatus = status === 'all' ? '' : toBackendShipmentStatus(status)

  if (backendStatus) {
    query.set('status', backendStatus)
  }

  const response = await apiRequest(`/shipper/shipments?${query.toString()}`)
  const shipments = (response.data?.shipments || []).map(mapApiShipment)
  const normalizedKeyword = normalizeSearchText(keyword)
  const filteredShipments = normalizedKeyword
    ? shipments.filter((shipment) =>
        [
          shipment.id,
          shipment.orderId,
          shipment.trackingCode,
          shipment.receiverName,
          shipment.receiverPhone,
          shipment.receiverAddress,
        ].some((value) => normalizeSearchText(value).includes(normalizedKeyword)),
      )
    : shipments
  const counts = shipments.reduce(
    (result, shipment) => ({
      ...result,
      [shipment.status]: (result[shipment.status] || 0) + 1,
    }),
    {},
  )

  return {
    success: true,
    data: filteredShipments,
    meta: {
      shipper: {
        shipperId: 'API-SHIPPER',
        displayName: 'Shipper TechTonic',
      },
      counts,
      totalCount: response.data?.pagination?.total_items ?? shipments.length,
      filteredCount: filteredShipments.length,
      pagination: response.data?.pagination,
    },
  }
}

function readShipmentOverrides() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(window.localStorage.getItem(SHIPPER_SHIPMENTS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeShipmentOverrides(overrides) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SHIPPER_SHIPMENTS_STORAGE_KEY, JSON.stringify(overrides))
}

function resolveShipper(currentUser) {
  if (!currentUser?.email) {
    return null
  }

  return shipperProfileMap[currentUser.email] || {
    shipperId: `SHIPPER-${currentUser.id}`,
    displayName: currentUser.fullName || 'Shipper TechTonic',
  }
}

function getShipmentSnapshot() {
  const overrides = readShipmentOverrides()

  return shipperShipments.map((shipment) => ({
    ...shipment,
    ...(overrides[shipment.id] || {}),
    history: overrides[shipment.id]?.history || shipment.history,
  }))
}

function buildTimeline(shipment) {
  const completedStatuses = new Set(shipment.history.map((event) => event.status))
  const currentIndex = statusFlow.indexOf(shipment.status)

  return statusFlow.map((status, index) => {
    const event = shipment.history.find((item) => item.status === status)
    const isCompleted = completedStatuses.has(status)
    const isCurrent = status === shipment.status && !['DELIVERED', 'FAILED', 'CANCELLED'].includes(shipment.status)

    return {
      status,
      label: statusMeta[status].timelineLabel,
      description: event?.description || (index <= currentIndex ? statusMeta[status].label : 'Đang chờ'),
      time: event?.time || 'Chờ cập nhật',
      state: isCompleted ? 'completed' : isCurrent ? 'current' : 'pending',
    }
  })
}

function buildShipment(shipment) {
  return {
    ...shipment,
    statusMeta: statusMeta[shipment.status] || statusMeta.ASSIGNED,
    codLabel: shipment.codAmount ? vnd(shipment.codAmount) : 'Đã thanh toán',
    estimatedDeliveryLabel: formatDeliveryDate(shipment.estimatedDelivery),
    timeline: buildTimeline(shipment),
    nextStatuses: statusTransitions[shipment.status] || [],
  }
}

function getScopedShipments(currentUser) {
  const shipper = resolveShipper(currentUser)

  if (!shipper) {
    return { shipper: null, shipments: [] }
  }

  return {
    shipper,
    shipments: getShipmentSnapshot()
      .filter((shipment) => shipment.shipperId === shipper.shipperId)
      .map(buildShipment),
  }
}

export const shipperService = {
  async getShipperDashboard(currentUser) {
    if (USE_API) {
      const shipmentsResponse = await fetchApiShipments()

      return {
        success: true,
        data: buildApiDashboard(shipmentsResponse.data),
      }
    }

    const { shipper, shipments } = getScopedShipments(currentUser)

    if (!shipper) {
      return {
        success: false,
        message: 'Không tìm thấy thông tin shipper.',
      }
    }

    const delivered = shipments.filter((shipment) => shipment.status === 'DELIVERED').length
    const assigned = shipments.filter((shipment) => shipment.status === 'ASSIGNED' || shipment.status === 'PICKED_UP').length
    const inTransit = shipments.filter((shipment) => shipment.status === 'IN_TRANSIT').length
    const failed = shipments.filter((shipment) => shipment.status === 'FAILED').length
    const total = shipments.length
    const onTimeRate = total ? Math.round((delivered / total) * 100) : 0

    return {
      success: true,
      data: {
        shipper,
        metrics: [
          { id: 'assigned', label: 'Được giao', value: assigned, icon: 'assignment', iconClassName: 'bg-blue-100 text-blue-800' },
          { id: 'shipping', label: 'Đang giao', value: inTransit, icon: 'local_shipping', iconClassName: 'bg-orange-100 text-orange-800', featured: true },
          { id: 'delivered', label: 'Đã giao', value: delivered, icon: 'check_circle', iconClassName: 'bg-green-100 text-green-800' },
          { id: 'failed', label: 'Cần xử lý', value: failed, icon: 'error', iconClassName: 'bg-red-100 text-red-800', danger: true },
        ],
        distribution: {
          total,
          onTimeRate,
          successPercent: total ? Math.round((delivered / total) * 100) : 0,
          pendingPercent: total ? Math.round(((assigned + inTransit) / total) * 100) : 0,
          failedPercent: total ? Math.round((failed / total) * 100) : 0,
        },
        recentShipments: shipments.slice(0, 4),
      },
    }
  },

  async getShipperShipments(currentUser, { keyword = '', status = 'all', dateFrom = '', dateTo = '' } = {}) {
    if (USE_API) {
      return fetchApiShipments({ keyword, status })
    }

    const { shipper, shipments: shipmentsByShipper } = getScopedShipments(currentUser)

    if (!shipper) {
      return {
        success: false,
        data: [],
        message: 'Không tìm thấy thông tin shipper.',
      }
    }

    const normalizedKeyword = normalizeText(keyword)

    const counts = shipmentsByShipper.reduce(
      (result, shipment) => ({
        ...result,
        [shipment.status]: (result[shipment.status] || 0) + 1,
      }),
      {},
    )

    const shipments = shipmentsByShipper.filter((shipment) => {
      const deliveryDate = shipment.estimatedDelivery.slice(0, 10)
      const matchesKeyword = normalizedKeyword
        ? [shipment.id, shipment.orderId, shipment.receiverName, shipment.receiverPhone, shipment.receiverAddress].some((value) => normalizeText(value).includes(normalizedKeyword))
        : true
      const matchesStatus = status === 'all' ? true : shipment.status === status
      const matchesDateFrom = dateFrom ? deliveryDate >= dateFrom : true
      const matchesDateTo = dateTo ? deliveryDate <= dateTo : true

      return matchesKeyword && matchesStatus && matchesDateFrom && matchesDateTo
    })

    return {
      success: true,
      data: shipments,
      meta: {
        shipper,
        counts,
        totalCount: shipmentsByShipper.length,
        filteredCount: shipments.length,
      },
    }
  },

  async getShipperShipmentById(currentUser, shipmentId) {
    if (USE_API) {
      const shipmentsResponse = await fetchApiShipments()
      const shipment = shipmentsResponse.data.find((item) => String(item.id) === String(shipmentId))

      if (!shipment) {
        return {
          success: false,
          code: 'NOT_FOUND',
          message: 'Không tìm thấy đơn giao trong dữ liệu backend trả về.',
        }
      }

      return {
        success: true,
        data: shipment,
        meta: shipmentsResponse.meta,
      }
    }

    const { shipper, shipments } = getScopedShipments(currentUser)

    if (!shipper) {
      return {
        success: false,
        message: 'Không tìm thấy thông tin shipper.',
      }
    }

    const shipmentExists = getShipmentSnapshot().some((shipment) => shipment.id === shipmentId)
    const shipment = shipments.find((item) => item.id === shipmentId)

    if (!shipment) {
      return {
        success: false,
        code: shipmentExists ? 'FORBIDDEN' : 'NOT_FOUND',
        message: shipmentExists ? 'Đơn giao này không thuộc phạm vi được phân công của bạn.' : 'Không tìm thấy đơn giao.',
      }
    }

    return {
      success: true,
      data: shipment,
      meta: { shipper },
    }
  },

  async updateShipperShipmentStatus(currentUser, shipmentId, nextStatus, { failedReason = '' } = {}) {
    if (USE_API) {
      const backendStatus = toBackendShipmentStatus(nextStatus)
      const body = { new_status: backendStatus }

      if (backendStatus === 'DELIVERY_FAILED') {
        body.failed_reason = failedReason || 'Shipper báo giao hàng thất bại từ giao diện demo.'
      }

      await apiRequest(`/shipper/shipments/${shipmentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })

      return this.getShipperShipmentById(currentUser, shipmentId)
    }

    const current = await this.getShipperShipmentById(currentUser, shipmentId)

    if (!current.success) {
      return current
    }

    const allowedStatuses = statusTransitions[current.data.status] || []

    if (!allowedStatuses.includes(nextStatus)) {
      return {
        success: false,
        message: 'Trạng thái cập nhật không hợp lệ.',
      }
    }

    const overrides = readShipmentOverrides()
    const history = [
      ...current.data.history,
      {
        status: nextStatus,
        time: formatUpdateTime(),
        description: nextStatus === 'FAILED' ? 'Shipper báo giao thất bại' : statusMeta[nextStatus].timelineLabel,
      },
    ]

    overrides[shipmentId] = {
      status: nextStatus,
      updatedAt: formatUpdateTime(),
      history,
    }
    writeShipmentOverrides(overrides)

    return this.getShipperShipmentById(currentUser, shipmentId)
  },
}
