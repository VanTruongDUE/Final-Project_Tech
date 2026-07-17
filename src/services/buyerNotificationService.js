const BUYER_NOTIFICATION_STORAGE_KEY = 'techtonic_buyer_notifications'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const readNotificationMap = () => {
  if (!canUseStorage()) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(BUYER_NOTIFICATION_STORAGE_KEY) || '{}')
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
  } catch {
    return {}
  }
}

const writeNotificationMap = (notificationMap) => {
  if (canUseStorage()) {
    window.localStorage.setItem(BUYER_NOTIFICATION_STORAGE_KEY, JSON.stringify(notificationMap))
  }
}

const buildDefaultNotifications = (user) => [
  {
    id: `${user?.id || 'customer'}-notification-1`,
    type: 'ORDER',
    title: 'Đơn hàng đang được giao',
    message: 'Đơn hàng TT-2024-001 đang trên đường giao đến bạn. Vui lòng chú ý điện thoại.',
    createdAt: '2026-06-17T08:30:00.000Z',
    isRead: false,
  },
  {
    id: `${user?.id || 'customer'}-notification-2`,
    type: 'PROMOTION',
    title: 'Ưu đãi công nghệ cuối tuần',
    message: 'Nhiều sản phẩm phụ kiện đang giảm giá trong chương trình TechToShop cuối tuần.',
    createdAt: '2026-06-16T14:20:00.000Z',
    isRead: false,
  },
  {
    id: `${user?.id || 'customer'}-notification-3`,
    type: 'ACCOUNT',
    title: 'Hồ sơ đã được cập nhật',
    message: 'Thông tin tài khoản của bạn đã được lưu thành công trên thiết bị hiện tại.',
    createdAt: '2026-06-15T10:10:00.000Z',
    isRead: true,
  },
  {
    id: `${user?.id || 'customer'}-notification-4`,
    type: 'SYSTEM',
    title: 'Nhắc nhở bảo mật',
    message: 'Hãy kiểm tra lại mật khẩu và thông tin liên hệ để bảo vệ tài khoản của bạn.',
    createdAt: '2026-06-14T09:00:00.000Z',
    isRead: true,
  },
]

const normalizeNotification = (notification, index) => ({
  id: notification.id || `notification-${Date.now()}-${index}`,
  type: notification.type || 'SYSTEM',
  title: notification.title?.trim() || 'Thông báo',
  message: notification.message?.trim() || '',
  createdAt: notification.createdAt || new Date().toISOString(),
  isRead: Boolean(notification.isRead),
})

const saveUserNotifications = (userId, notifications) => {
  const notificationMap = readNotificationMap()
  const nextNotifications = notifications.map(normalizeNotification)

  writeNotificationMap({
    ...notificationMap,
    [userId]: nextNotifications,
  })

  return nextNotifications
}

export const buyerNotificationService = {
  getNotifications(user) {
    if (!user?.id) {
      return []
    }

    const notificationMap = readNotificationMap()
    const savedNotifications = notificationMap[user.id]

    if (Array.isArray(savedNotifications) && savedNotifications.length) {
      return savedNotifications.map(normalizeNotification)
    }

    return saveUserNotifications(user.id, buildDefaultNotifications(user))
  },

  markAsRead(userId, notificationId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để cập nhật thông báo.')
    }

    const notificationMap = readNotificationMap()
    const currentNotifications = Array.isArray(notificationMap[userId]) ? notificationMap[userId] : []

    return saveUserNotifications(
      userId,
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: notification.id === notificationId ? true : notification.isRead,
      })),
    )
  },

  markAllAsRead(userId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để cập nhật thông báo.')
    }

    const notificationMap = readNotificationMap()
    const currentNotifications = Array.isArray(notificationMap[userId]) ? notificationMap[userId] : []

    return saveUserNotifications(
      userId,
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  },

  deleteNotification(userId, notificationId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để xóa thông báo.')
    }

    const notificationMap = readNotificationMap()
    const currentNotifications = Array.isArray(notificationMap[userId]) ? notificationMap[userId] : []

    return saveUserNotifications(
      userId,
      currentNotifications.filter((notification) => notification.id !== notificationId),
    )
  },

  getStorageKey() {
    return BUYER_NOTIFICATION_STORAGE_KEY
  },
}
