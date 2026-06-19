import { Link, useLocation } from 'react-router-dom'
import { conversationService } from '../../services/conversationService'
import { ROLES } from '../../utils/roles'

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9.2l-4.1 3.1A.7.7 0 0 1 4 17.5v-12Z" />
      <path d="M7 8h8.5a.75.75 0 0 1 0 1.5H7A.75.75 0 0 1 7 8Zm0 3h5.5a.75.75 0 0 1 0 1.5H7A.75.75 0 0 1 7 11Z" fill="white" />
    </svg>
  )
}

export default function FloatingChatButton({ currentUser }) {
  const location = useLocation()
  const canUseBuyerChat = currentUser?.role === ROLES.CUSTOMER || currentUser?.role === ROLES.SELLER
  const conversations = canUseBuyerChat ? conversationService.getConversationsByCustomer(currentUser?.id) : []
  const targetPath = conversations.length ? `/messages/${encodeURIComponent(conversations[0].id)}` : '/messages'

  if (!canUseBuyerChat || location.pathname.startsWith('/messages')) {
    return null
  }

  return (
    <Link
      to={targetPath}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-[#f1d7d0] bg-white px-4 py-3 text-sm font-bold text-[#ee4d2d] shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:border-[#ee4d2d] hover:shadow-[0_12px_28px_rgba(238,77,45,0.22)] focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/40"
      aria-label="Mở lịch sử tin nhắn"
      title="Mở lịch sử tin nhắn"
    >
      <ChatIcon />
      <span>Chat</span>
    </Link>
  )
}
