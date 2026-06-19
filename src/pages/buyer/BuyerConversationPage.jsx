import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConversationHeader from '../../components/buyer/ConversationHeader'
import ConversationListItem from '../../components/buyer/ConversationListItem'
import MessageBubble from '../../components/buyer/MessageBubble'
import MessageComposer from '../../components/buyer/MessageComposer'
import { useAuth } from '../../contexts/useAuth'
import { conversationService } from '../../services/conversationService'

const quickReplies = ['Mình lấy màu đen', 'Có ship hỏa tốc không?', 'Bảo hành thế nào?']

export default function BuyerConversationPage() {
  const { conversationId } = useParams()
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const conversations = conversationService.getConversationsByCustomer(currentUser?.id)

  const filteredConversations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return conversations
    }

    return conversations.filter((conversation) => {
      const searchableText = [
        conversation.storeName,
        conversation.productName,
        conversation.orderId,
        conversation.lastMessage,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedKeyword)
    })
  }, [conversations, keyword])

  const conversationResponse = conversationService.getConversationById(conversationId, currentUser?.id)

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    if (!conversationResponse.success || !conversationResponse.data) {
      return
    }

    const sendResponse = conversationService.sendMessage({
      conversationId: conversationResponse.data.id,
      customerId: currentUser.id,
      senderRole: 'CUSTOMER',
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content: messageInput,
    })

    if (!sendResponse.success) {
      setFeedbackMessage(sendResponse.message || 'Không thể gửi tin nhắn.')
      return
    }

    setMessageInput('')
    setFeedbackMessage('')
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 sm:px-6 lg:h-[calc(100vh-172px)] lg:flex-row lg:px-8">
      <aside className="hidden w-[360px] shrink-0 overflow-hidden rounded-xl border border-[#e3beb6]/30 bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)] lg:flex lg:flex-col xl:w-[400px]">
        <div className="flex items-center justify-between border-b border-[#e3beb6]/30 p-4">
          <h1 className="text-xl font-semibold text-[#1b1c1c]">Tin nhắn</h1>
          <button
            type="button"
            className="rounded-full p-2 text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#ee4d2d]"
          >
            ⋯
          </button>
        </div>

        <div className="border-b border-[#e3beb6]/30 p-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f7069]">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                search
              </span>
            </span>
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm hội thoại..."
              className="h-10 w-full rounded-lg border-none bg-[#f5f3f3] px-10 text-sm outline-none ring-1 ring-transparent transition focus:ring-[#ee4d2d]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === conversationId}
            />
          ))}
        </div>
      </aside>

      <section className="flex min-h-[560px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e3beb6]/30 bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)]">
        {!conversationResponse.success || !conversationResponse.data ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <h2 className="text-2xl font-bold text-[#1b1c1c]">Không tìm thấy cuộc trò chuyện</h2>
            <p className="mt-3 text-sm text-[#5b403b]">
              Cuộc trò chuyện này có thể không tồn tại hoặc không thuộc về tài khoản hiện tại.
            </p>
            <Link
              to="/messages"
              className="mt-6 inline-flex rounded-xl bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73211]"
            >
              Quay lại danh sách tin nhắn
            </Link>
          </div>
        ) : (
          <>
            <ConversationHeader conversation={conversationResponse.data} mobileBackLink="/messages" />

            <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-6">
              <div className="mb-4 text-center">
                <span className="inline-block rounded-full bg-[#f5f3f3] px-3 py-1 text-[11px] text-[#8f7069]">
                  Hôm nay
                </span>
              </div>

              <div className="space-y-4">
                {conversationResponse.data.messages.length ? (
                  conversationResponse.data.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#e3beb6] bg-white px-5 py-10 text-center text-sm text-[#8f7069]">
                    Bạn chưa có tin nhắn nào trong cuộc trò chuyện này. Hãy bắt đầu nhắn tin với
                    shop.
                  </div>
                )}
              </div>
            </div>

            {feedbackMessage ? (
              <div className="border-t border-[#f1d3d3] bg-[#fff7f7] px-4 py-3 text-sm text-[#ba1a1a]">
                {feedbackMessage}
              </div>
            ) : null}

            <MessageComposer
              value={messageInput}
              onChange={setMessageInput}
              onSubmit={handleSubmitMessage}
              quickReplies={quickReplies}
              onQuickReply={setMessageInput}
            />
          </>
        )}
      </section>
    </main>
  )
}
