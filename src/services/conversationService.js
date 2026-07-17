import { apiRequest } from './apiClient'

const mapConversation = (conversation = {}) => ({
  id: String(conversation.conversation_id),
  conversationId: conversation.conversation_id,
  customerId: conversation.customer?.customer_id ?? conversation.customer_id,
  customerName: conversation.customer?.customer_name || '',
  customerAvatar: conversation.customer?.customer_avatar || '',
  storeId: String(conversation.store?.store_id ?? conversation.store_id ?? ''),
  storeName: conversation.store?.store_name || 'TechTonic Store',
  storeLogo: conversation.store?.logo_url || '',
  orderId: conversation.order_id ? String(conversation.order_id) : null,
  productId: null,
  productName: '',
  status: conversation.status || 'OPEN',
  createdAt: conversation.created_at,
  updatedAt: conversation.updated_at || conversation.last_message_at || conversation.created_at,
  lastMessage: conversation.last_message_preview || '',
  lastMessageAt: conversation.last_message_at || conversation.updated_at || conversation.created_at,
  messages: [],
})

const mapMessage = (message = {}, currentUser = {}) => {
  const senderId = message.sender?.user_id ?? message.sender_user_id
  const ownRole = currentUser.role === 'SELLER' ? 'SELLER' : 'CUSTOMER'
  const otherRole = ownRole === 'SELLER' ? 'CUSTOMER' : 'SELLER'
  return {
    id: String(message.message_id),
    messageId: message.message_id,
    senderId,
    senderName: message.sender?.full_name || (String(senderId) === String(currentUser.id) ? currentUser.fullName : 'Người gửi'),
    senderRole: String(senderId) === String(currentUser.id) ? ownRole : otherRole,
    content: message.message_content || '',
    isRead: Boolean(message.is_read),
    createdAt: message.created_at,
  }
}

export const conversationService = {
  async getConversations() {
    const result = await apiRequest('/conversations')
    return { success: true, data: (result.data?.conversations || []).map(mapConversation) }
  },

  async createConversation({ storeId, orderId = null }) {
    const result = await apiRequest('/conversations', {
      method: 'POST',
      body: JSON.stringify({
        store_id: Number(storeId),
        order_id: orderId ? Number(orderId) : undefined,
      }),
    })
    return { success: true, data: mapConversation(result.data) }
  },

  async getConversation(conversationId, currentUser) {
    const [conversationResult, messageResult] = await Promise.all([
      this.getConversations(),
      apiRequest(`/conversations/${conversationId}/messages?limit=100`),
    ])
    const conversation = conversationResult.data.find((item) => String(item.id) === String(conversationId))
    if (!conversation) throw new Error('Không tìm thấy cuộc trò chuyện trong tài khoản hiện tại.')

    return {
      success: true,
      data: {
        ...conversation,
        messages: (messageResult.data?.messages || [])
          .map((message) => mapMessage(message, currentUser))
          .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt)),
      },
    }
  },

  async sendMessage(conversationId, content) {
    const normalizedContent = content?.trim()
    if (!normalizedContent) throw new Error('Nội dung tin nhắn không được để trống.')
    const result = await apiRequest(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message_content: normalizedContent }),
    })
    return { success: true, data: result.data }
  },

  async markAsRead(conversationId) {
    const result = await apiRequest(`/conversations/${conversationId}/read`, { method: 'PATCH' })
    return { success: true, message: result.message }
  },
}
