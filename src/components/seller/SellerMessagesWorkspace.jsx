import { useEffect, useMemo, useState } from 'react'
import SellerConversationHeader from './SellerConversationHeader'
import SellerConversationListItem from './SellerConversationListItem'
import SellerIcon from './SellerIcon'
import SellerMessageBubble from './SellerMessageBubble'
import SellerMessageComposer from './SellerMessageComposer'
import { useAuth } from '../../contexts/useAuth'
import { conversationService } from '../../services/conversationService'

const filterTabs = [
  { value: 'all', label: 'Tất cả' },
]

const quickReplies = [
  'Mình lấy màu đen',
  'Có ship hỏa tốc không?',
  'Bảo hành thế nào?',
]

export default function SellerMessagesWorkspace({ conversationId = null }) {
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [messageInput, setMessageInput] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [conversations, setConversations] = useState([])
  const [conversationResponse, setConversationResponse] = useState({ success: false, message: 'Đang tải hội thoại.' })
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadWorkspace = async () => {
      try {
        const listResponse = await conversationService.getConversations()
        if (!isMounted) return
        setConversations(listResponse.data)
        const targetId = conversationId || listResponse.data[0]?.id
        if (!targetId) {
          setConversationResponse({ success: false, message: 'Chưa có cuộc trò chuyện nào phù hợp.' })
          return
        }
        const detailResponse = await conversationService.getConversation(targetId, currentUser)
        if (isMounted) setConversationResponse(detailResponse)
      } catch (error) {
        if (isMounted) setConversationResponse({ success: false, message: error.message })
      }
    }
    loadWorkspace()
    return () => { isMounted = false }
  }, [conversationId, currentUser, refreshKey])

  const filteredConversations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    let nextConversations = conversations

    if (!normalizedKeyword) {
      return nextConversations
    }

    return nextConversations.filter((conversation) => {
      const searchableText = [
        conversation.customerName,
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

  const selectedConversationId = conversationResponse.success ? conversationResponse.data.id : null
  const isConversationRoute = Boolean(conversationId)

  useEffect(() => {
    setMessageInput('')
    setFeedbackMessage('')
  }, [selectedConversationId])

  const handleSubmitMessage = async (event) => {
    event.preventDefault()

    if (!conversationResponse.success || !conversationResponse.data || isSending) {
      return
    }

    setIsSending(true)
    try {
      await conversationService.sendMessage(conversationResponse.data.id, messageInput)
      setMessageInput('')
      setFeedbackMessage('')
      setRefreshKey((currentKey) => currentKey + 1)
    } catch (error) {
      setFeedbackMessage(error.message || 'Không thể gửi tin nhắn.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="flex h-[calc(100vh-73px)] min-h-[640px] min-w-0 flex-col overflow-hidden bg-[#fbf9f9] md:h-screen md:min-h-screen">
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden border-t border-[#ead8d2] bg-white md:border-t-0">
        <aside
          className={`${
            isConversationRoute ? 'hidden xl:flex' : 'flex'
          } min-h-0 w-full min-w-0 flex-col border-r border-[#ead8d2] bg-white md:w-[360px] md:shrink-0`}
        >
          <div className="shrink-0 border-b border-[#ead8d2] px-4 py-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[18px] font-semibold text-[#1b1c1c]">Tin nhắn</h1>
                <p className="mt-0.5 text-[11px] text-[#8f7069]">Trao đổi với khách hàng</p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-[#8f7069] transition hover:bg-[#f7f3f2] hover:text-[#ee4d2d]"
                aria-label="Tùy chọn tin nhắn"
              >
                <SellerIcon name="more_horiz" className="text-[18px]" />
              </button>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f7069]">
                <SellerIcon name="search" className="text-[18px]" />
              </span>
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm kiếm hội thoại..."
                className="h-11 w-full rounded-xl border border-transparent bg-[#f6f2f1] pl-10 pr-4 text-[13px] text-[#1b1c1c] outline-none transition placeholder:text-[#8f7069] focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d]/25"
              />
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveFilter(tab.value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium transition ${
                    activeFilter === tab.value
                      ? 'bg-[#ee4d2d] text-white shadow-sm'
                      : 'bg-[#efeded] text-[#1b1c1c] hover:bg-[#e4e1e0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.length ? (
              filteredConversations.map((conversation) => (
                <SellerConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === selectedConversationId}
                />
              ))
            ) : (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">
                  <SellerIcon name="chat" className="text-[22px]" filled />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#1b1c1c]">Chưa có hội thoại</p>
                <p className="mt-1 text-xs leading-5 text-[#8f7069]">
                  Không có hội thoại phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            )}
          </div>
        </aside>

        <section
          className={`${
            isConversationRoute ? 'grid' : 'hidden xl:grid'
          } min-h-0 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-[#fbf9f9]`}
        >
          {!conversationResponse.success || !conversationResponse.data ? (
            <div className="row-span-3 flex min-h-0 flex-col bg-[#fffdfd]">
              <div className="shrink-0 border-b border-[#ead8d2] px-5 py-4">
                <h2 className="text-[16px] font-semibold text-[#1b1c1c]">Trung tâm tin nhắn</h2>
                <p className="mt-0.5 text-xs text-[#8f7069]">Chọn hội thoại để xem chi tiết và phản hồi.</p>
              </div>
              <div className="flex flex-1 items-center justify-center px-6 py-10 text-center">
                <div className="max-w-[360px]">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#ffebe5] text-[#ee4d2d]">
                    <SellerIcon name="chat" className="text-[26px]" filled />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#1b1c1c]">
                    {isConversationRoute
                      ? 'Không tìm thấy cuộc trò chuyện'
                      : 'Chọn một hội thoại để bắt đầu'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b403b]">{conversationResponse.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <SellerConversationHeader
                conversation={conversationResponse.data}
                mobileBackLink={isConversationRoute ? '/seller/messages' : null}
              />

              <div className="min-h-0 overflow-y-auto bg-[#fbf9f9] px-5 py-7">
                {conversationResponse.data.messages.length ? (
                  <div className="flex min-h-full flex-col gap-5">
                    <div className="flex justify-center">
                      <span className="rounded-full bg-[#f6f2f1] px-3 py-1 text-[11px] text-[#8f7069]">
                        Hôm nay
                      </span>
                    </div>

                    {conversationResponse.data.messages.map((message) => (
                      <SellerMessageBubble key={message.id} message={message} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    <div className="w-full max-w-[420px] rounded-xl border border-dashed border-[#ead8d2] bg-white px-6 py-8 text-center shadow-sm">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">
                        <SellerIcon name="forum" className="text-[22px]" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#1b1c1c]">Chưa có tin nhắn nào</p>
                      <p className="mt-1 text-xs leading-5 text-[#8f7069]">
                        Gửi lời chào hoặc chọn một câu trả lời nhanh bên dưới.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-[#ead8d2] bg-white">
                {feedbackMessage ? (
                  <div className="border-b border-[#ffdad6] bg-[#fff7f7] px-5 py-3 text-sm text-[#ba1a1a]">
                    {feedbackMessage}
                  </div>
                ) : null}

                <SellerMessageComposer
                  value={messageInput}
                  onChange={setMessageInput}
                  onSubmit={handleSubmitMessage}
                  quickReplies={quickReplies}
                  onQuickReply={setMessageInput}
                  disabled={isSending}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  )
}
