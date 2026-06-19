import { mockProducts } from '../mocks/products.mock'
import { mockUsers } from '../mocks/users.mock'

const vnd = (value) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'

const storeIds = new Set(mockProducts.map((product) => product.storeId))
const totalProducts = mockProducts.length
const totalStores = storeIds.size
const totalUsers = mockUsers.length + 1248
const totalOrders = 8240
const totalRevenue = 1245000000
const ADMIN_USER_STATUS_KEY = 'techtonic_admin_user_status'
const ADMIN_STORE_STATUS_KEY = 'techtonic_admin_store_status'
const ADMIN_ORDER_STATUS_KEY = 'techtonic_admin_order_status'
const ADMIN_STORE_APPROVAL_STATUS_KEY = 'techtonic_admin_store_approval_status'
const ADMIN_PRODUCT_REPORT_STATUS_KEY = 'techtonic_admin_product_report_status'

const adminUsers = [
  {
    id: 'USR-001',
    fullName: 'Nguyễn Thị Hằng',
    email: 'admin@techtonic.vn',
    phone: '090 123 4567',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '12/10/2023',
    activityCount: 328,
  },
  {
    id: 'USR-002',
    fullName: 'Trần Văn Bình',
    email: 'seller@techtonic.vn',
    phone: '098 765 4321',
    role: 'SELLER',
    status: 'ACTIVE',
    createdAt: '05/11/2023',
    activityCount: 156,
  },
  {
    id: 'USR-003',
    fullName: 'Lê Minh Tuấn',
    email: 'tuan.le@gmail.com',
    phone: '091 234 5678',
    role: 'CUSTOMER',
    status: 'LOCKED',
    createdAt: '20/01/2024',
    activityCount: 18,
  },
  {
    id: 'USR-004',
    fullName: 'Phạm Mai Phương',
    email: 'customer@techtonic.vn',
    phone: 'Chưa cập nhật',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    createdAt: '02/03/2024',
    activityCount: 42,
  },
  {
    id: 'USR-005',
    fullName: 'Đỗ Hoàng Nam',
    email: 'shipper@techtonic.vn',
    phone: '093 222 6789',
    role: 'SHIPPER',
    status: 'ACTIVE',
    createdAt: '18/03/2024',
    activityCount: 74,
  },
  {
    id: 'USR-006',
    fullName: 'Mai Anh Store',
    email: 'maianh.store@techtonic.vn',
    phone: '097 111 8899',
    role: 'SELLER',
    status: 'PENDING',
    createdAt: '21/04/2024',
    activityCount: 0,
  },
]

const adminStores = [
  {
    id: 'SHP-9921',
    name: 'TechToShop Official',
    location: 'Hà Nội',
    ownerName: 'Nguyễn Văn A',
    email: 'seller@techtonic.vn',
    phone: '098 765 4321',
    category: 'Điện tử',
    productCount: 342,
    orderCount: 12540,
    revenue: 428000000,
    status: 'ACTIVE',
    createdAt: '12/05/2022',
  },
  {
    id: 'SHP-8843',
    name: 'Bella Cosmetics',
    location: 'TP.HCM',
    ownerName: 'Trần Thị B',
    email: 'bella@techtonic.vn',
    phone: '091 222 3344',
    category: 'Làm đẹp',
    productCount: 128,
    orderCount: 4210,
    revenue: 186500000,
    status: 'ACTIVE',
    createdAt: '08/11/2023',
  },
  {
    id: 'SHP-7712',
    name: 'V&A Fashion',
    location: 'Vi phạm CS',
    ownerName: 'Lê Hoàng C',
    email: 'fashion.va@techtonic.vn',
    phone: '093 888 1122',
    category: 'Thời trang',
    productCount: 56,
    orderCount: 890,
    revenue: 39200000,
    status: 'LOCKED',
    createdAt: '22/01/2024',
  },
  {
    id: 'SHP-9005',
    name: 'Gia Dụng Thông Minh',
    location: 'Đà Nẵng',
    ownerName: 'Phạm Thị D',
    email: 'giadungsmart@techtonic.vn',
    phone: '097 444 5566',
    category: 'Gia dụng',
    productCount: 215,
    orderCount: 1450,
    revenue: 84500000,
    status: 'PENDING',
    createdAt: '05/04/2024',
  },
  {
    id: 'SHP-6310',
    name: 'Âm Thanh Số',
    location: 'Cần Thơ',
    ownerName: 'Đỗ Minh Quân',
    email: 'amthanhso@techtonic.vn',
    phone: '090 555 7788',
    category: 'Điện tử',
    productCount: 64,
    orderCount: 530,
    revenue: 22100000,
    status: 'REJECTED',
    createdAt: '14/04/2024',
  },
]

const adminOrders = [
  {
    id: 'ORD-8821',
    customerName: 'Nguyễn Văn A',
    storeName: 'TechToShop Official Store',
    storeId: 'SHP-9921',
    summary: 'Bàn phím cơ không dây K500',
    orderedAt: '2024-10-24T14:30:00',
    total: 1250000,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
  },
  {
    id: 'ORD-8820',
    customerName: 'Trần Thị B',
    storeName: 'TechToShop Electronics',
    storeId: 'SHP-9921',
    summary: 'Màn hình Gaming 27 inch, Chuột X8',
    orderedAt: '2024-10-24T10:15:00',
    total: 5400000,
    status: 'SHIPPING',
    paymentStatus: 'PAID',
  },
  {
    id: 'ORD-8819',
    customerName: 'Lê Hoàng C',
    storeName: 'TechToShop Official Store',
    storeId: 'SHP-9921',
    summary: 'Tai nghe Bluetooth T9',
    orderedAt: '2024-10-23T16:45:00',
    total: 320000,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
  },
  {
    id: 'ORD-8818',
    customerName: 'Phạm Thị D',
    storeName: 'TechToShop Fashion',
    storeId: 'SHP-7712',
    summary: 'Áo khoác chống nắng cao cấp',
    orderedAt: '2024-10-23T09:20:00',
    total: 850000,
    status: 'CANCELLED',
    paymentStatus: 'UNPAID',
  },
  {
    id: 'ORD-8817',
    customerName: 'Đỗ Minh Quân',
    storeName: 'Bella Cosmetics',
    storeId: 'SHP-8843',
    summary: 'Serum dưỡng da, Kem chống nắng',
    orderedAt: '2024-10-22T18:05:00',
    total: 690000,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
  },
  {
    id: 'ORD-8816',
    customerName: 'Mai Anh',
    storeName: 'Gia Dụng Thông Minh',
    storeId: 'SHP-9005',
    summary: 'Máy hút bụi mini',
    orderedAt: '2024-10-22T08:40:00',
    total: 1180000,
    status: 'CONFIRMED',
    paymentStatus: 'FAILED',
  },
  {
    id: 'ORD-8815',
    customerName: 'Hoàng Nam',
    storeName: 'Âm Thanh Số',
    storeId: 'SHP-6310',
    summary: 'Loa bluetooth Soundbar S1',
    orderedAt: '2024-10-21T11:10:00',
    total: 2100000,
    status: 'PACKING',
    paymentStatus: 'PAID',
  },
  {
    id: 'ORD-8814',
    customerName: 'Bùi Thu Hà',
    storeName: 'TechToShop Electronics',
    storeId: 'SHP-9921',
    summary: 'SSD 1TB tốc độ cao',
    orderedAt: '2024-10-20T15:25:00',
    total: 1640000,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
  },
]

const adminStoreApprovals = [
  {
    id: 'APR-001',
    storeName: 'TechGear Store',
    representative: 'Nguyễn Văn A',
    email: 'techgear@techtonic.vn',
    phone: '090 112 3344',
    registeredAt: '24/10/2023',
    category: 'Điện tử',
    status: 'PENDING',
  },
  {
    id: 'APR-002',
    storeName: 'Beauty Care Official',
    representative: 'Trần Thị B',
    email: 'beautycare@techtonic.vn',
    phone: '091 222 7788',
    registeredAt: '23/10/2023',
    category: 'Làm đẹp',
    status: 'PENDING',
  },
  {
    id: 'APR-003',
    storeName: 'Home Living Plus',
    representative: 'Lê Minh C',
    email: 'homeliving@techtonic.vn',
    phone: '093 456 7890',
    registeredAt: '22/10/2023',
    category: 'Gia dụng',
    status: 'APPROVED',
  },
  {
    id: 'APR-004',
    storeName: 'SportMax Việt Nam',
    representative: 'Phạm Ngọc D',
    email: 'sportmax@techtonic.vn',
    phone: '097 765 4321',
    registeredAt: '21/10/2023',
    category: 'Thể thao',
    status: 'REJECTED',
  },
  {
    id: 'APR-005',
    storeName: 'Mini Gadget Hub',
    representative: 'Đỗ Minh Khang',
    email: 'gadgethub@techtonic.vn',
    phone: '096 555 8899',
    registeredAt: '20/10/2023',
    category: 'Phụ kiện',
    status: 'PENDING',
  },
]

const adminProductReports = [
  {
    id: 'RPT-001',
    productId: 'PRD-901',
    productName: 'Tai nghe Bluetooth X9 Pro',
    sellerName: 'TechGear Store',
    reportCount: 45,
    reason: 'Hàng giả',
    reportedAt: '24/10/2023',
    status: 'PENDING',
  },
  {
    id: 'RPT-002',
    productId: 'PRD-902',
    productName: 'Kem dưỡng trắng da cấp tốc',
    sellerName: 'Beauty Care Official',
    reportCount: 28,
    reason: 'Mô tả sai sự thật',
    reportedAt: '23/10/2023',
    status: 'PENDING',
  },
  {
    id: 'RPT-003',
    productId: 'PRD-903',
    productName: 'Sạc nhanh 120W không rõ nguồn gốc',
    sellerName: 'Mini Gadget Hub',
    reportCount: 12,
    reason: 'Sản phẩm nguy hiểm',
    reportedAt: '22/10/2023',
    status: 'WARNED',
  },
  {
    id: 'RPT-004',
    productId: 'PRD-904',
    productName: 'Áo khoác chống nắng cao cấp',
    sellerName: 'Fashion Home',
    reportCount: 8,
    reason: 'Vi phạm hình ảnh',
    reportedAt: '21/10/2023',
    status: 'IGNORED',
  },
  {
    id: 'RPT-005',
    productId: 'PRD-905',
    productName: 'Bình giữ nhiệt Smart Cup',
    sellerName: 'Home Living Plus',
    reportCount: 19,
    reason: 'Hàng giả',
    reportedAt: '20/10/2023',
    status: 'REMOVED',
  },
]

function getStoredUserStatuses() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(window.localStorage.getItem(ADMIN_USER_STATUS_KEY) || '{}')
  } catch {
    return {}
  }
}

function setStoredUserStatuses(statuses) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_USER_STATUS_KEY, JSON.stringify(statuses))
}

function getStoredStoreStatuses() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(window.localStorage.getItem(ADMIN_STORE_STATUS_KEY) || '{}')
  } catch {
    return {}
  }
}

function setStoredStoreStatuses(statuses) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_STORE_STATUS_KEY, JSON.stringify(statuses))
}

function getStoredOrderStatuses() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(window.localStorage.getItem(ADMIN_ORDER_STATUS_KEY) || '{}')
  } catch {
    return {}
  }
}

function setStoredOrderStatuses(statuses) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_ORDER_STATUS_KEY, JSON.stringify(statuses))
}

function getStoredStoreApprovalStatuses() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(window.localStorage.getItem(ADMIN_STORE_APPROVAL_STATUS_KEY) || '{}')
  } catch {
    return {}
  }
}

function setStoredStoreApprovalStatuses(statuses) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_STORE_APPROVAL_STATUS_KEY, JSON.stringify(statuses))
}

function getStoredProductReportStatuses() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(window.localStorage.getItem(ADMIN_PRODUCT_REPORT_STATUS_KEY) || '{}')
  } catch {
    return {}
  }
}

function setStoredProductReportStatuses(statuses) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_PRODUCT_REPORT_STATUS_KEY, JSON.stringify(statuses))
}

function normalizeText(value) {
  return value.toString().trim().toLowerCase()
}

const adminOrderTimeline = [
  { status: 'PENDING', label: 'Chờ xác nhận', icon: 'receipt_long' },
  { status: 'CONFIRMED', label: 'Đã xác nhận', icon: 'verified' },
  { status: 'PROCESSING', label: 'Đang xử lý', icon: 'inventory' },
  { status: 'PACKING', label: 'Đang đóng gói', icon: 'inventory_2' },
  { status: 'SHIPPING', label: 'Đang giao', icon: 'local_shipping' },
  { status: 'COMPLETED', label: 'Hoàn thành', icon: 'task_alt' },
]

function buildAdminOrderDetail(order) {
  const itemNames = order.summary.split(',').map((item) => item.trim()).filter(Boolean)
  const items = itemNames.map((name, index) => {
    const quantity = index === 0 ? 1 : 2
    const unitPrice = Math.max(120000, Math.round(order.total / itemNames.length / quantity / 10000) * 10000)

    return {
      productId: `${order.id}-PRD-${index + 1}`,
      productName: name,
      variantLabel: index === 0 ? 'Phân loại: Tiêu chuẩn' : 'Phân loại: Bản mở rộng',
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    }
  })
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const discount = Math.max(0, subtotal - order.total)
  const shippingFee = order.total >= 1000000 ? 0 : 30000
  const orderStatusIndex = adminOrderTimeline.findIndex((step) => step.status === order.status)
  const progressIndex = order.status === 'CANCELLED' ? 0 : Math.max(orderStatusIndex, 0)

  return {
    ...order,
    orderedAtLabel: new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(order.orderedAt)),
    customer: {
      name: order.customerName,
      phone: '09' + order.id.replace(/\D/g, '').slice(-8).padStart(8, '0'),
      email: `${normalizeText(order.customerName).replace(/\s+/g, '.')}@techtonic.vn`,
      address: 'Số 12 đường Công Nghệ, phường Tân Phú, TP. Hồ Chí Minh',
    },
    store: {
      id: order.storeId,
      name: order.storeName,
      supportPhone: '1900 2024',
    },
    items,
    payment: {
      subtotal,
      discount,
      shippingFee,
      total: order.total,
      method: order.paymentStatus === 'PAID' ? 'Đã thanh toán qua ví điện tử' : order.paymentStatus === 'REFUNDED' ? 'Đã hoàn tiền' : 'Thanh toán COD',
    },
    timeline: adminOrderTimeline.map((step, index) => ({
      ...step,
      state: order.status === 'CANCELLED' ? (step.status === 'PENDING' ? 'done' : 'todo') : index < progressIndex ? 'done' : index === progressIndex ? 'current' : 'todo',
    })),
    history: [
      {
        id: `${order.id}-created`,
        label: 'Đơn hàng được tạo',
        time: order.orderedAt,
        note: `${order.customerName} đã đặt đơn tại ${order.storeName}.`,
        icon: 'receipt_long',
      },
      {
        id: `${order.id}-status`,
        label: order.status === 'CANCELLED' ? 'Đơn hàng đã hủy' : 'Trạng thái hiện tại được cập nhật',
        time: order.orderedAt,
        note: `Hệ thống ghi nhận trạng thái ${order.status}.`,
        icon: order.status === 'CANCELLED' ? 'cancel' : 'published_with_changes',
      },
    ],
  }
}

export const adminService = {
  getDashboardStats() {
    return {
      success: true,
      data: {
        lastUpdated: 'Vừa cập nhật',
        metrics: [
          {
            id: 'users',
            label: 'Tổng người dùng',
            value: '1.2k',
            trend: '+5.2%',
            icon: 'group',
            iconClassName: 'text-blue-600',
          },
          {
            id: 'stores',
            label: 'Tổng cửa hàng',
            value: totalStores.toString(),
            trend: '+12 mới',
            icon: 'store',
            iconClassName: 'text-blue-600',
          },
          {
            id: 'products',
            label: 'Tổng sản phẩm',
            value: totalProducts.toString(),
            trend: '+300',
            icon: 'inventory',
            iconClassName: 'text-blue-600',
          },
          {
            id: 'orders',
            label: 'Tổng đơn hàng',
            value: '8.2k',
            trend: '+1.5%',
            icon: 'local_shipping',
            iconClassName: 'text-blue-600',
          },
          {
            id: 'revenue',
            label: 'Doanh thu toàn sàn',
            value: vnd(totalRevenue),
            trend: '+15.3% so với tháng trước',
            icon: 'account_balance_wallet',
            featured: true,
          },
        ],
        revenueTrend: [
          { label: '01/10', value: 280000000 },
          { label: '07/10', value: 340000000 },
          { label: '14/10', value: 310000000 },
          { label: '21/10', value: 470000000 },
          { label: '28/10', value: 520000000 },
          { label: '31/10', value: 490000000 },
        ],
        recentActivity: [
          {
            id: 'ACT-001',
            entity: 'Mega Electronics',
            action: 'Đăng ký cửa hàng mới',
            time: '2 phút trước',
            status: 'Chờ duyệt',
            statusClassName: 'bg-amber-100 text-amber-800',
            icon: 'storefront',
            iconClassName: 'bg-purple-100 text-purple-600',
          },
          {
            id: 'ACT-002',
            entity: 'Nguyễn Văn A',
            action: 'Đặt đơn hàng #8821',
            time: '15 phút trước',
            status: 'Hoàn thành',
            statusClassName: 'bg-green-100 text-green-800',
            icon: 'person',
            iconClassName: 'bg-blue-100 text-blue-600',
          },
          {
            id: 'ACT-003',
            entity: 'iPhone 15 Pro Max',
            action: 'Bị báo cáo bởi 5 người dùng',
            time: '1 giờ trước',
            status: 'Cần kiểm tra',
            statusClassName: 'bg-red-100 text-red-800',
            icon: 'inventory_2',
            iconClassName: 'bg-red-100 text-red-600',
          },
        ],
        alerts: [
          {
            id: 'store-approvals',
            title: 'Duyệt cửa hàng',
            description: '24 cửa hàng đang chờ xét duyệt',
            actionLabel: 'Duyệt',
            to: '/admin/store-approvals',
            tone: 'red',
          },
          {
            id: 'reported-products',
            title: 'Sản phẩm bị báo cáo',
            description: '12 sản phẩm cần kiểm tra',
            actionLabel: 'Kiểm tra',
            to: '/admin/reported-products',
            tone: 'amber',
          },
        ],
        orderStatus: {
          total: totalOrders,
          segments: [
            { id: 'completed', label: 'Hoàn thành', value: 75, colorClassName: 'bg-blue-600', textClassName: 'text-blue-600' },
            { id: 'processing', label: 'Đang xử lý', value: 15, colorClassName: 'bg-amber-400', textClassName: 'text-amber-500' },
            { id: 'cancelled', label: 'Đã hủy', value: 10, colorClassName: 'bg-slate-200', textClassName: 'text-slate-400' },
          ],
        },
        totals: {
          users: totalUsers,
          stores: totalStores,
          products: totalProducts,
          orders: totalOrders,
          revenue: totalRevenue,
        },
      },
    }
  },

  getAdminUsers({ keyword = '', role = 'all', status = 'all' } = {}) {
    const storedStatuses = getStoredUserStatuses()
    const normalizedKeyword = normalizeText(keyword)

    const users = adminUsers
      .map((user) => ({
        ...user,
        status: storedStatuses[user.id] || user.status,
      }))
      .filter((user) => {
        const matchesKeyword = normalizedKeyword
          ? [user.id, user.fullName, user.email, user.phone].some((value) => normalizeText(value).includes(normalizedKeyword))
          : true
        const matchesRole = role === 'all' ? true : user.role === role
        const matchesStatus = status === 'all' ? true : user.status === status

        return matchesKeyword && matchesRole && matchesStatus
      })

    return {
      success: true,
      data: users,
      meta: {
        totalCount: users.length,
        allCount: adminUsers.length,
      },
    }
  },

  getAdminUserById(userId) {
    const storedStatuses = getStoredUserStatuses()
    const user = adminUsers.find((item) => item.id === userId)

    if (!user) {
      return {
        success: false,
        message: 'Không tìm thấy tài khoản.',
      }
    }

    const status = storedStatuses[user.id] || user.status
    const roleActivity = {
      ADMIN: ['Đăng nhập bảng điều khiển Admin', 'Cập nhật cấu hình hệ thống', 'Kiểm tra báo cáo toàn sàn'],
      SELLER: ['Quản lý sản phẩm', 'Xử lý đơn hàng từ cửa hàng', 'Theo dõi doanh thu cửa hàng'],
      CUSTOMER: ['Mua hàng trên marketplace', 'Theo dõi đơn hàng', 'Nhắn tin với shop'],
      SHIPPER: ['Nhận đơn giao hàng', 'Cập nhật trạng thái vận chuyển', 'Hoàn tất giao hàng'],
    }
    const rolePermissions = {
      ADMIN: ['Quản trị toàn sàn', 'Quản lý người dùng', 'Duyệt cửa hàng', 'Xem báo cáo'],
      SELLER: ['Quản lý cửa hàng', 'Quản lý sản phẩm', 'Quản lý đơn hàng', 'Nhắn tin buyer'],
      CUSTOMER: ['Mua hàng', 'Quản lý hồ sơ', 'Lịch sử đơn hàng', 'Nhắn tin shop'],
      SHIPPER: ['Xem đơn được giao', 'Cập nhật vận chuyển', 'Xem chi tiết giao hàng'],
    }

    return {
      success: true,
      data: {
        ...user,
        status,
        username: user.email.split('@')[0],
        lastLogin: user.status === 'PENDING' ? 'Chưa đăng nhập' : '24/10/2024 09:30',
        verified: status !== 'PENDING',
        source: user.role === 'ADMIN' ? 'Tài khoản hệ thống' : 'Đăng ký mock/localStorage',
        permissions: rolePermissions[user.role] || rolePermissions.CUSTOMER,
        activity: (roleActivity[user.role] || roleActivity.CUSTOMER).map((label, index) => ({
          id: `${user.id}-activity-${index}`,
          label,
          time: index === 0 ? 'Gần đây' : 'Dữ liệu mock',
          icon: index === 0 ? 'history' : 'task_alt',
        })),
        stats: [
          { label: 'Hoạt động', value: user.activityCount.toLocaleString('vi-VN'), icon: 'monitoring' },
          { label: 'Phiên đăng nhập', value: Math.max(1, Math.round(user.activityCount / 8)).toLocaleString('vi-VN'), icon: 'login' },
          { label: 'Mức tin cậy', value: status === 'LOCKED' ? 'Thấp' : status === 'PENDING' ? 'Chờ duyệt' : 'Tốt', icon: 'verified_user' },
        ],
      },
    }
  },

  updateUserStatus(userId, status) {
    const user = adminUsers.find((item) => item.id === userId)

    if (!user) {
      return {
        success: false,
        message: 'Không tìm thấy tài khoản.',
      }
    }

    const storedStatuses = getStoredUserStatuses()
    storedStatuses[userId] = status
    setStoredUserStatuses(storedStatuses)

    return {
      success: true,
      data: {
        ...user,
        status,
      },
    }
  },

  getAdminStores({ keyword = '', status = 'all', category = 'all' } = {}) {
    const storedStatuses = getStoredStoreStatuses()
    const normalizedKeyword = normalizeText(keyword)

    const storesWithStatus = adminStores.map((store) => ({
      ...store,
      status: storedStatuses[store.id] || store.status,
      revenueLabel: vnd(store.revenue),
    }))

    const stores = storesWithStatus.filter((store) => {
      const matchesKeyword = normalizedKeyword
        ? [store.id, store.name, store.location, store.ownerName, store.email, store.phone, store.category].some((value) => normalizeText(value).includes(normalizedKeyword))
        : true
      const matchesStatus = status === 'all' ? true : store.status === status
      const matchesCategory = category === 'all' ? true : store.category === category

      return matchesKeyword && matchesStatus && matchesCategory
    })

    const summary = storesWithStatus.reduce(
      (result, store) => {
        result.total += 1

        if (store.status === 'ACTIVE') {
          result.active += 1
        }

        if (store.status === 'LOCKED' || store.status === 'REJECTED') {
          result.locked += 1
        }

        if (store.status === 'PENDING') {
          result.pending += 1
        }

        return result
      },
      { total: 0, active: 0, locked: 0, pending: 0 },
    )

    const categories = Array.from(new Set(adminStores.map((store) => store.category)))

    return {
      success: true,
      data: stores,
      meta: {
        totalCount: stores.length,
        allCount: adminStores.length,
        summary,
        categories,
      },
    }
  },

  getAdminStoreById(storeId) {
    const storedStatuses = getStoredStoreStatuses()
    const store = adminStores.find((item) => item.id === storeId)

    if (!store) {
      return {
        success: false,
        message: 'Không tìm thấy cửa hàng.',
      }
    }

    const status = storedStatuses[store.id] || store.status
    const completedOrders = Math.round(store.orderCount * 0.78)
    const cancelledOrders = Math.max(0, Math.round(store.orderCount * 0.04))
    const rating = Math.min(5, Math.max(3.8, 4 + (store.productCount % 10) / 10))

    return {
      success: true,
      data: {
        ...store,
        status,
        revenueLabel: vnd(store.revenue),
        completedOrders,
        cancelledOrders,
        rating: rating.toFixed(1),
        averageOrderValueLabel: vnd(Math.round(store.revenue / Math.max(store.orderCount, 1))),
        address: `${store.location}, Việt Nam`,
        description: `${store.name} là cửa hàng thuộc ngành ${store.category}, đang được quản lý trong phạm vi toàn sàn TechToShop.`,
        documents: [
          { id: 'business-license', label: 'Giấy phép kinh doanh', status: status === 'REJECTED' ? 'Cần kiểm tra' : 'Đã xác minh' },
          { id: 'owner-identity', label: 'Thông tin chủ cửa hàng', status: 'Đã xác minh' },
          { id: 'tax-code', label: 'Mã số thuế', status: status === 'PENDING' ? 'Chờ bổ sung' : 'Đã cập nhật' },
        ],
        activity: [
          { id: 'created', label: 'Tạo hồ sơ cửa hàng', time: store.createdAt, icon: 'storefront' },
          { id: 'products', label: `Đang quản lý ${store.productCount} sản phẩm`, time: 'Dữ liệu mock', icon: 'inventory_2' },
          { id: 'orders', label: `Đã phát sinh ${store.orderCount.toLocaleString('vi-VN')} đơn hàng`, time: 'Dữ liệu mock', icon: 'shopping_bag' },
        ],
      },
    }
  },

  updateStoreStatus(storeId, status) {
    const store = adminStores.find((item) => item.id === storeId)

    if (!store) {
      return {
        success: false,
        message: 'Không tìm thấy cửa hàng.',
      }
    }

    const storedStatuses = getStoredStoreStatuses()
    storedStatuses[storeId] = status
    setStoredStoreStatuses(storedStatuses)

    return {
      success: true,
      data: {
        ...store,
        status,
      },
    }
  },

  getAdminStoreApprovals({ keyword = '', status = 'all', category = 'all' } = {}) {
    const storedStatuses = getStoredStoreApprovalStatuses()
    const normalizedKeyword = normalizeText(keyword)

    const approvalsWithStatus = adminStoreApprovals.map((approval) => ({
      ...approval,
      status: storedStatuses[approval.id] || approval.status,
    }))

    const approvals = approvalsWithStatus.filter((approval) => {
      const matchesKeyword = normalizedKeyword
        ? [approval.id, approval.storeName, approval.representative, approval.email, approval.phone, approval.category].some((value) => normalizeText(value).includes(normalizedKeyword))
        : true
      const matchesStatus = status === 'all' ? true : approval.status === status
      const matchesCategory = category === 'all' ? true : approval.category === category

      return matchesKeyword && matchesStatus && matchesCategory
    })

    const summary = approvalsWithStatus.reduce(
      (result, approval) => {
        if (approval.status === 'PENDING') {
          result.pending += 1
        }

        if (approval.status === 'APPROVED') {
          result.approved += 1
        }

        if (approval.status === 'REJECTED') {
          result.rejected += 1
        }

        return result
      },
      { pending: 0, approved: 0, rejected: 0 },
    )

    const categories = Array.from(new Set(adminStoreApprovals.map((approval) => approval.category)))

    return {
      success: true,
      data: approvals,
      meta: {
        totalCount: approvals.length,
        allCount: adminStoreApprovals.length,
        summary,
        categories,
      },
    }
  },

  updateStoreApprovalStatus(approvalId, status) {
    const approval = adminStoreApprovals.find((item) => item.id === approvalId)

    if (!approval) {
      return {
        success: false,
        message: 'Không tìm thấy hồ sơ cửa hàng.',
      }
    }

    const storedStatuses = getStoredStoreApprovalStatuses()
    storedStatuses[approvalId] = status
    setStoredStoreApprovalStatuses(storedStatuses)

    return {
      success: true,
      data: {
        ...approval,
        status,
      },
    }
  },

  getAdminReportedProducts({ keyword = '', status = 'all', reason = 'all' } = {}) {
    const storedStatuses = getStoredProductReportStatuses()
    const normalizedKeyword = normalizeText(keyword)

    const reportsWithStatus = adminProductReports.map((report) => ({
      ...report,
      status: storedStatuses[report.id] || report.status,
    }))

    const reports = reportsWithStatus.filter((report) => {
      const matchesKeyword = normalizedKeyword
        ? [report.id, report.productId, report.productName, report.sellerName, report.reason].some((value) => normalizeText(value).includes(normalizedKeyword))
        : true
      const matchesStatus = status === 'all' ? true : report.status === status
      const matchesReason = reason === 'all' ? true : report.reason === reason

      return matchesKeyword && matchesStatus && matchesReason
    })

    const summary = reportsWithStatus.reduce(
      (result, report) => {
        result.totalReports += report.reportCount

        if (report.status === 'PENDING') {
          result.pending += report.reportCount
        }

        if (report.status === 'REMOVED') {
          result.removed += 1
        }

        return result
      },
      { totalReports: 0, pending: 0, removed: 0 },
    )

    const reasons = Array.from(new Set(adminProductReports.map((report) => report.reason)))

    return {
      success: true,
      data: reports,
      meta: {
        totalCount: reports.length,
        allCount: adminProductReports.length,
        summary,
        reasons,
      },
    }
  },

  updateReportedProductStatus(reportId, status) {
    const report = adminProductReports.find((item) => item.id === reportId)

    if (!report) {
      return {
        success: false,
        message: 'Không tìm thấy báo cáo sản phẩm.',
      }
    }

    const storedStatuses = getStoredProductReportStatuses()
    storedStatuses[reportId] = status
    setStoredProductReportStatuses(storedStatuses)

    return {
      success: true,
      data: {
        ...report,
        status,
      },
    }
  },

  getAdminOrderStats() {
    const storedStatuses = getStoredOrderStatuses()
    const orders = adminOrders.map((order) => ({
      ...order,
      status: storedStatuses[order.id] || order.status,
    }))

    return {
      success: true,
      data: {
        pending: orders.filter((order) => order.status === 'PENDING').length,
        shipping: orders.filter((order) => order.status === 'SHIPPING').length,
        completed: orders.filter((order) => order.status === 'COMPLETED').length,
        cancelled: orders.filter((order) => order.status === 'CANCELLED').length,
      },
    }
  },

  getAdminOrders({ keyword = '', status = 'all', paymentStatus = 'all', store = 'all', dateFrom = '', dateTo = '' } = {}) {
    const storedStatuses = getStoredOrderStatuses()
    const normalizedKeyword = normalizeText(keyword)
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null

    const ordersWithStatus = adminOrders.map((order) => ({
      ...order,
      status: storedStatuses[order.id] || order.status,
      totalLabel: vnd(order.total),
      orderedAtLabel: new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(order.orderedAt)),
    }))

    const orders = ordersWithStatus.filter((order) => {
      const orderedTime = new Date(order.orderedAt).getTime()
      const matchesKeyword = normalizedKeyword
        ? [order.id, order.customerName, order.storeName, order.summary].some((value) => normalizeText(value).includes(normalizedKeyword))
        : true
      const matchesStatus = status === 'all' ? true : order.status === status
      const matchesPaymentStatus = paymentStatus === 'all' ? true : order.paymentStatus === paymentStatus
      const matchesStore = store === 'all' ? true : order.storeId === store
      const matchesDateFrom = fromTime ? orderedTime >= fromTime : true
      const matchesDateTo = toTime ? orderedTime <= toTime : true

      return matchesKeyword && matchesStatus && matchesPaymentStatus && matchesStore && matchesDateFrom && matchesDateTo
    })

    const stores = Array.from(new Map(adminOrders.map((order) => [order.storeId, { id: order.storeId, name: order.storeName }])).values())

    return {
      success: true,
      data: orders,
      meta: {
        totalCount: orders.length,
        allCount: adminOrders.length,
        stores,
      },
    }
  },

  getAdminOrderById(orderId) {
    const storedStatuses = getStoredOrderStatuses()
    const order = adminOrders.find((item) => item.id === orderId)

    if (!order) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng.',
      }
    }

    return {
      success: true,
      data: buildAdminOrderDetail({
        ...order,
        status: storedStatuses[order.id] || order.status,
        totalLabel: vnd(order.total),
      }),
    }
  },

  updateAdminOrderStatus(orderId, status) {
    const order = adminOrders.find((item) => item.id === orderId)

    if (!order) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng.',
      }
    }

    const storedStatuses = getStoredOrderStatuses()
    storedStatuses[orderId] = status
    setStoredOrderStatuses(storedStatuses)

    return {
      success: true,
      data: {
        ...order,
        status,
      },
    }
  },

  getAdminStatisticsReport({ range = 'today', dateFrom = '', dateTo = '' } = {}) {
    const rangeConfig = {
      today: {
        totalRevenue: 452800000,
        completedOrders: 3492,
        avgDailyRevenue: 4150000,
        storesWithRevenue: 142,
        totalStores: 150,
        revenueGrowth: '+12.5%',
        orderGrowth: '+5.2%',
      },
      '7days': {
        totalRevenue: 982400000,
        completedOrders: 6840,
        avgDailyRevenue: 140342857,
        storesWithRevenue: 146,
        totalStores: 150,
        revenueGrowth: '+9.4%',
        orderGrowth: '+6.8%',
      },
      '30days': {
        totalRevenue: 2456000000,
        completedOrders: 18432,
        avgDailyRevenue: 81866667,
        storesWithRevenue: 148,
        totalStores: 150,
        revenueGrowth: '+15.3%',
        orderGrowth: '+8.2%',
      },
    }
    const metrics = rangeConfig[range] || rangeConfig.today
    const revenueTrend = [
      { label: '01/10', value: 32000000 },
      { label: '05/10', value: 48000000 },
      { label: '10/10', value: 28500000 },
      { label: '15/10', value: 69000000 },
      { label: '20/10', value: 94000000 },
      { label: '25/10', value: 58500000 },
      { label: '30/10', value: 78000000 },
    ]
    const storePerformance = [
      { id: 'ST-001', name: 'MegaElectronics Store', shortName: 'M1', completedOrders: 1245, itemsSold: 3102, revenue: 45210000, change: '+15.2%', changeType: 'up' },
      { id: 'ST-002', name: 'Fashion Hub Official', shortName: 'F2', completedOrders: 892, itemsSold: 1540, revenue: 28450000, change: '+8.4%', changeType: 'up' },
      { id: 'ST-003', name: 'Home Essentials Co.', shortName: 'H3', completedOrders: 654, itemsSold: 890, revenue: 15890000, change: '-2.1%', changeType: 'down' },
      { id: 'ST-004', name: 'Beauty Haven', shortName: 'B4', completedOrders: 1023, itemsSold: 2450, revenue: 12400000, change: '+22.5%', changeType: 'up' },
      { id: 'ST-005', name: 'Sports Gear Plus', shortName: 'S5', completedOrders: 412, itemsSold: 605, revenue: 9850000, change: '0.0%', changeType: 'flat' },
    ]

    return {
      success: true,
      data: {
        range,
        dateFrom,
        dateTo,
        metrics: {
          ...metrics,
          totalRevenueLabel: vnd(metrics.totalRevenue),
          avgDailyRevenueLabel: vnd(metrics.avgDailyRevenue),
        },
        revenueTrend: revenueTrend.map((item) => ({
          ...item,
          valueLabel: vnd(item.value),
        })),
        storePerformance: storePerformance.map((store) => ({
          ...store,
          revenueLabel: vnd(store.revenue),
        })),
      },
    }
  },

  getAdminBestSellingProducts({ range = 'today' } = {}) {
    return {
      success: true,
      data: {
        range,
        products: [
          { id: 'PRD-001', name: 'Tai nghe Bluetooth Sony WH-1000XM5', storeName: 'MegaElectronics Store', category: 'Điện tử', sold: 1240, revenue: 8600000000 },
          { id: 'PRD-002', name: 'Đồng hồ thông minh Samsung Galaxy Watch 6', storeName: 'TechZone VN', category: 'Thiết bị đeo', sold: 985, revenue: 5800000000 },
          { id: 'PRD-003', name: 'Giày Chạy Bộ Nam Nike Air Zoom Pegasus 40', storeName: 'Fashion Hub Official', category: 'Thời trang', sold: 1450, revenue: 4300000000 },
        ],
      },
    }
  },
}
