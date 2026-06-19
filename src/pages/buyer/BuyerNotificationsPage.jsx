import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { buyerNotificationService } from '../../services/buyerNotificationService'

const notificationTabs = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'UNREAD', label: 'Chưa đọc' },
  { value: 'ORDER', label: 'Đơn hàng' },
  { value: 'PROMOTION', label: 'Khuyến mãi' },
  { value: 'ACCOUNT', label: 'Tài khoản' },
  { value: 'SYSTEM', label: 'Hệ thống' },
]

const typeMeta = {
  ORDER: {
    label: 'Đơn hàng',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  },
  PROMOTION: {
    label: 'Khuyến mãi',
    tone: 'border-orange-200 bg-orange-50 text-orange-600',
  },
  ACCOUNT: {
    label: 'Tài khoản',
    tone: 'border-blue-200 bg-blue-50 text-blue-600',
  },
  SYSTEM: {
    label: 'Hệ thống',
    tone: 'border-slate-200 bg-slate-50 text-slate-600',
  },
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h7" />
    </svg>
  )
}

function formatDateTime(value) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function BuyerNotificationsPage() {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('ALL')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setNotifications(buyerNotificationService.getNotifications(currentUser))
  }, [currentUser])

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'ALL') {
      return notifications
    }

    if (activeTab === 'UNREAD') {
      return notifications.filter((notification) => !notification.isRead)
    }

    return notifications.filter((notification) => notification.type === activeTab)
  }, [activeTab, notifications])

  const handleMarkAsRead = (notificationId) => {
    setNotifications(buyerNotificationService.markAsRead(currentUser.id, notificationId))
    setFeedback('Đã đánh dấu thông báo là đã đọc.')
  }

  const handleMarkAllAsRead = () => {
    setNotifications(buyerNotificationService.markAllAsRead(currentUser.id))
    setFeedback('Đã đánh dấu tất cả thông báo là đã đọc.')
  }

  const handleDelete = (notificationId) => {
    setNotifications(buyerNotificationService.deleteNotification(currentUser.id, notificationId))
    setFeedback('Đã xóa thông báo khỏi localStorage.')
  }

  return (
    <section className="min-w-0 rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#e8e8e8] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1b1c1c]">Thông Báo Của Tôi</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Theo dõi cập nhật đơn hàng, ưu đãi và bảo mật tài khoản</p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={!unreadCount}
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white transition hover:bg-[#d73211] disabled:cursor-not-allowed disabled:bg-[#e3e2e2] disabled:text-[#8f7069]"
        >
          <BellIcon />
          Đánh dấu đã đọc
        </button>
      </div>

      {feedback ? <div className="border-b border-[#e8e8e8] bg-[#fff8f6] px-6 py-3 text-sm text-[#8f4e43]">{feedback}</div> : null}

      <div className="border-b border-[#e8e8e8] px-6 pt-4">
        <div className="grid grid-cols-2 overflow-hidden sm:grid-cols-3 lg:grid-cols-6">
          {notificationTabs.map((tab) => {
            const isActive = tab.value === activeTab

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`min-w-0 border-b-2 px-2 py-3 text-center text-sm font-semibold transition ${
                  isActive ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-[#5b403b] hover:text-[#ee4d2d]'
                }`}
              >
                <span className="block truncate">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col p-6">
        {filteredNotifications.length ? (
          filteredNotifications.map((notification, index) => {
            const meta = typeMeta[notification.type] || typeMeta.SYSTEM

            return (
              <article
                key={notification.id}
                className={`flex flex-col gap-4 py-5 md:flex-row md:items-start md:justify-between ${
                  index < filteredNotifications.length - 1 ? 'border-b border-[#e8e8e8]' : ''
                } ${notification.isRead ? '' : 'bg-[#fffaf7] -mx-3 px-3'}`}
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  <div
                    className={`mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border ${
                      notification.isRead ? 'border-[#e8e8e8] bg-white text-[#8f7069]' : 'border-[#ffd6cb] bg-[#fff1ec] text-[#ee4d2d]'
                    }`}
                  >
                    <BellIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#1b1c1c]">{notification.title}</span>
                      {!notification.isRead ? <span className="h-2 w-2 rounded-full bg-[#ee4d2d]" aria-label="Chưa đọc" /> : null}
                      <span className={`rounded border px-2 py-0.5 text-xs font-medium ${meta.tone}`}>{meta.label}</span>
                    </div>
                    <p className="text-sm leading-6 text-[#5b403b]">{notification.message}</p>
                    <p className="mt-2 text-xs text-[#8f7069]">{formatDateTime(notification.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-4 md:justify-end">
                  {!notification.isRead ? (
                    <button type="button" onClick={() => handleMarkAsRead(notification.id)} className="text-sm text-[#05a] transition hover:underline">
                      Đã đọc
                    </button>
                  ) : null}
                  <button type="button" onClick={() => handleDelete(notification.id)} className="text-sm text-[#ba1a1a] transition hover:underline">
                    Xóa
                  </button>
                </div>
              </article>
            )
          })
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">
              <EmptyIcon />
            </div>
            <h2 className="mt-5 text-base font-bold text-[#1b1c1c]">Không có thông báo phù hợp</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5b403b]">
              Hãy đổi bộ lọc hoặc quay lại sau khi tài khoản có cập nhật mới.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
