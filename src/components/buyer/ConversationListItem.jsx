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
    }).format(date)
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

export default function ConversationListItem({ conversation, isActive = false }) {
  const initials = conversation.storeName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      to={`/messages/${encodeURIComponent(conversation.id)}`}
      className={`relative flex items-start gap-3 border-b border-[#e3beb6]/10 px-4 py-4 transition ${
        isActive ? 'border-l-4 border-l-[#ee4d2d] bg-[#fff1ec]' : 'hover:bg-[#f5f3f3]'
      }`}
    >
      <div className="relative shrink-0">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-[#e3beb6]/20 bg-[#fff1ec] text-sm font-bold text-[#ee4d2d]">
          {initials}
        </div>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span
            className={`truncate text-sm ${
              isActive ? 'font-bold' : 'font-medium'
            } text-[#1b1c1c]`}
          >
            {conversation.storeName}
          </span>
          <span
            className={`shrink-0 text-[11px] ${
              isActive ? 'font-semibold text-[#ee4d2d]' : 'text-[#8f7069]'
            }`}
          >
            {formatConversationTime(conversation.lastMessageAt)}
          </span>
        </div>

        {conversation.productName ? (
          <p className="mb-1 truncate text-[12px] text-[#8f7069]">{conversation.productName}</p>
        ) : null}

        <p className={`truncate text-sm ${isActive ? 'font-medium text-[#1b1c1c]' : 'text-[#5b403b]'}`}>
          {conversation.lastMessage || 'Bắt đầu trò chuyện với shop này'}
        </p>
      </div>
    </Link>
  )
}
