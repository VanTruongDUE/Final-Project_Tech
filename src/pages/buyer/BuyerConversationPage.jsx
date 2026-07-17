import { useEffect, useMemo, useState } from 'react'
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
  const [conversations, setConversations] = useState([])
  const [conversation, setConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const loadConversation = async () => {
    const [listResponse, detailResponse] = await Promise.all([
      conversationService.getConversations(),
      conversationService.getConversation(conversationId, currentUser),
    ])
    setConversations(listResponse.data)
    setConversation(detailResponse.data)
  }

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    Promise.all([
      conversationService.getConversations(),
      conversationService.getConversation(conversationId, currentUser),
    ])
      .then(([listResponse, detailResponse]) => {
        if (!isMounted) return
        setConversations(listResponse.data)
        setConversation(detailResponse.data)
        conversationService.markAsRead(conversationId).catch((error) => {
          if (isMounted) setFeedbackMessage(error.message)
        })
      })
      .catch((error) => {
        if (isMounted) {
          setConversation(null)
          setFeedbackMessage(error.message)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [conversationId, currentUser])

  const filteredConversations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword) return conversations
    return conversations.filter((item) =>
      [item.storeName, item.orderId, item.lastMessage].filter(Boolean).join(' ').toLowerCase().includes(normalizedKeyword),
    )
  }, [conversations, keyword])

  const handleSubmitMessage = async (event) => {
    event.preventDefault()
    if (!conversation || !messageInput.trim() || isSending) return
    setIsSending(true)
    setFeedbackMessage('')
    try {
      await conversationService.sendMessage(conversation.id, messageInput)
      setMessageInput('')
      await loadConversation()
    } catch (error) {
      setFeedbackMessage(error.message || 'Không thể gửi tin nhắn.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 sm:px-6 lg:h-[calc(100vh-172px)] lg:flex-row lg:px-8">
      <aside className="hidden w-[360px] shrink-0 overflow-hidden rounded-xl border bg-white lg:flex lg:flex-col xl:w-[400px]">
        <div className="border-b p-4"><h1 className="text-xl font-semibold">Tin nhắn</h1></div>
        <div className="border-b p-3"><input type="search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm kiếm hội thoại..." className="h-10 w-full rounded-lg bg-[#f5f3f3] px-4 text-sm outline-none" /></div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((item) => <ConversationListItem key={item.id} conversation={item} isActive={String(item.id) === String(conversationId)} />)}
        </div>
      </aside>

      <section className="flex min-h-[560px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-white">
        {isLoading ? <div className="grid h-full place-items-center text-sm text-[#5b403b]">Đang tải cuộc trò chuyện...</div> : null}
        {!isLoading && !conversation ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <h2 className="text-2xl font-bold">Không tìm thấy cuộc trò chuyện</h2>
            <p className="mt-3 text-sm text-[#5b403b]">{feedbackMessage}</p>
            <Link to="/messages" className="mt-6 rounded-xl bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white">Quay lại tin nhắn</Link>
          </div>
        ) : null}
        {!isLoading && conversation ? (
          <>
            <ConversationHeader conversation={conversation} mobileBackLink="/messages" />
            <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-6">
              <div className="space-y-4">
                {conversation.messages.length ? conversation.messages.map((message) => <MessageBubble key={message.id} message={message} />) : <div className="rounded-2xl border border-dashed bg-white px-5 py-10 text-center text-sm text-[#8f7069]">Chưa có tin nhắn. Hãy bắt đầu trao đổi với shop.</div>}
              </div>
            </div>
            {feedbackMessage ? <div className="border-t bg-rose-50 px-4 py-3 text-sm text-rose-700">{feedbackMessage}</div> : null}
            <MessageComposer value={messageInput} onChange={setMessageInput} onSubmit={handleSubmitMessage} quickReplies={quickReplies} onQuickReply={setMessageInput} disabled={isSending} />
          </>
        ) : null}
      </section>
    </main>
  )
}
