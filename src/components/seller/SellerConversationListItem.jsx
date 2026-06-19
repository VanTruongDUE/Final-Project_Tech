import { Link } from 'react-router-dom'

const formatConversationTime = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const now = new Date()
  const isSameDay =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()

  if (isSameDay) {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

const getInitials = (name) =>
  (name || 'Khách hàng')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

export default function SellerConversationListItem({ conversation, isActive = false }) {
  const initials = getInitials(conversation.customerName)
  const previewText = conversation.lastMessage || 'Bắt đầu trò chuyện với khách hàng'
  const contextText = conversation.productName || conversation.orderId || 'Hỗ trợ khách hàng'

  return (
    <Link
      to={`/seller/messages/${encodeURIComponent(conversation.id)}`}
      className={`relative flex min-h-[78px] items-start gap-3 border-b border-[#ead8d2] px-4 py-4 text-left transition ${
        isActive
          ? 'border-l-4 border-l-[#ee4d2d] bg-[#fff5f1]'
          : 'border-l-4 border-l-transparent bg-white hover:bg-[#fff9f7]'
      }`}
    >
      <div className="relative mt-0.5 shrink-0">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-[#f0cfc5] bg-[#fff8f5] text-[11px] font-semibold text-[#ee4d2d]">
          {initials}
        </div>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#1b1c1c]">
              {conversation.customerName || 'Khách hàng TechTonic'}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[#8f7069]">Đang hỏi: {contextText}</p>
          </div>
          <span className={`shrink-0 text-[10px] ${isActive ? 'text-[#ee4d2d]' : 'text-[#8f7069]'}`}>
            {formatConversationTime(conversation.lastMessageAt)}
          </span>
        </div>

        <p className="mt-2 line-clamp-1 text-[13px] leading-5 text-[#3f312d]">{previewText}</p>
      </div>
    </Link>
  )
}
