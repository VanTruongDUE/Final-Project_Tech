import { resolveManagedStoreIds } from './sellerService'

const CONVERSATION_STORAGE_KEY = 'techtonic_conversations'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const normalizeId = (value) => {
  if (value === undefined || value === null || value === '') {
    return null
  }

  return String(value)
}

const normalizeCustomerId = (value) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

const sanitizeMessage = (message) => {
  const id = normalizeId(message?.id)
  const senderRole = message?.senderRole?.trim() || 'SYSTEM'
  const content = message?.content?.trim()
  const createdAt = message?.createdAt || new Date().toISOString()

  if (!id || !content) {
    return null
  }

  return {
    id,
    senderRole,
    senderId: normalizeId(message?.senderId),
    senderName: message?.senderName?.trim() || 'Hệ thống',
    content,
    createdAt,
  }
}

const sanitizeConversation = (conversation) => {
  const id = normalizeId(conversation?.id)
  const customerId = normalizeCustomerId(conversation?.customerId)
  const storeId = normalizeId(conversation?.storeId)
  const storeName = conversation?.storeName?.trim()
  const createdAt = conversation?.createdAt || new Date().toISOString()
  const updatedAt = conversation?.updatedAt || createdAt
  const messages = Array.isArray(conversation?.messages)
    ? conversation.messages
        .map(sanitizeMessage)
        .filter(Boolean)
        .sort(
          (firstMessage, secondMessage) =>
            new Date(firstMessage.createdAt) - new Date(secondMessage.createdAt),
        )
    : []

  if (!id || !customerId || !storeId || !storeName) {
    return null
  }

  return {
    id,
    customerId,
    customerName: conversation?.customerName?.trim() || 'Khách hàng TechTonic',
    storeId,
    storeName,
    productId: normalizeId(conversation?.productId),
    productName: conversation?.productName?.trim() || '',
    orderId: normalizeId(conversation?.orderId),
    createdAt,
    updatedAt,
    messages,
  }
}

const sortConversations = (conversations) =>
  conversations.sort(
    (firstConversation, secondConversation) =>
      new Date(secondConversation.updatedAt) - new Date(firstConversation.updatedAt),
  )

const readConversations = () => {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawConversations = window.localStorage.getItem(CONVERSATION_STORAGE_KEY)
    const parsedConversations = rawConversations ? JSON.parse(rawConversations) : []
    const sanitizedConversations = sortConversations(
      (Array.isArray(parsedConversations) ? parsedConversations : [])
        .map(sanitizeConversation)
        .filter(Boolean),
    )

    if (
      rawConversations &&
      JSON.stringify(parsedConversations) !== JSON.stringify(sanitizedConversations)
    ) {
      window.localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(sanitizedConversations))
    }

    return sanitizedConversations
  } catch {
    window.localStorage.removeItem(CONVERSATION_STORAGE_KEY)
    return []
  }
}

const saveConversations = (conversations) => {
  const sanitizedConversations = sortConversations(
    conversations.map(sanitizeConversation).filter(Boolean),
  )

  if (canUseStorage()) {
    window.localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(sanitizedConversations))
  }

  return sanitizedConversations
}

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}${month}${day}`
}

const buildConversationId = (conversations) => {
  const dateKey = getDateKey()
  const todayConversationCount = conversations.filter((conversation) =>
    conversation.id.startsWith(`CONV-${dateKey}-`),
  ).length

  return `CONV-${dateKey}-${`${todayConversationCount + 1}`.padStart(4, '0')}`
}

const buildMessageId = (messages) => {
  const dateKey = getDateKey()
  const todayMessageCount = messages.filter((message) =>
    message.id.startsWith(`MSG-${dateKey}-`),
  ).length

  return `MSG-${dateKey}-${`${todayMessageCount + 1}`.padStart(4, '0')}`
}

const buildConversationMeta = (conversation) => {
  const lastMessage = conversation.messages.at(-1)

  return {
    ...conversation,
    lastMessage: lastMessage?.content || '',
    lastMessageSenderRole: lastMessage?.senderRole || '',
    lastMessageAt: lastMessage?.createdAt || conversation.updatedAt,
  }
}

export const conversationService = {
  getStorageKey() {
    return CONVERSATION_STORAGE_KEY
  },

  getConversationsByCustomer(customerId) {
    const normalizedCustomerId = normalizeCustomerId(customerId)

    if (!normalizedCustomerId) {
      return []
    }

    return readConversations()
      .filter((conversation) => conversation.customerId === normalizedCustomerId)
      .map(buildConversationMeta)
  },

  getConversationsByStore(storeId) {
    const normalizedStoreId = normalizeId(storeId)
    const managedStoreIds = resolveManagedStoreIds(normalizedStoreId)

    if (!normalizedStoreId || !managedStoreIds.length) {
      return []
    }

    return readConversations()
      .filter((conversation) => managedStoreIds.includes(conversation.storeId))
      .map(buildConversationMeta)
  },

  getConversationById(conversationId, customerId) {
    const normalizedConversationId = normalizeId(conversationId)
    const normalizedCustomerId = normalizeCustomerId(customerId)

    if (!normalizedConversationId || !normalizedCustomerId) {
      return {
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện.',
      }
    }

    const conversation = readConversations().find(
      (item) => item.id === normalizedConversationId && item.customerId === normalizedCustomerId,
    )

    if (!conversation) {
      return {
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện.',
      }
    }

    return {
      success: true,
      data: buildConversationMeta(conversation),
    }
  },

  getConversationByIdForSeller(conversationId, storeId) {
    const normalizedConversationId = normalizeId(conversationId)
    const normalizedStoreId = normalizeId(storeId)
    const managedStoreIds = resolveManagedStoreIds(normalizedStoreId)

    if (!normalizedConversationId || !normalizedStoreId || !managedStoreIds.length) {
      return {
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện.',
      }
    }

    const conversation = readConversations().find(
      (item) => item.id === normalizedConversationId && managedStoreIds.includes(item.storeId),
    )

    if (!conversation) {
      return {
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện thuộc gian hàng của bạn.',
      }
    }

    return {
      success: true,
      data: buildConversationMeta(conversation),
    }
  },

  findOrCreateConversation(payload) {
    const customerId = normalizeCustomerId(payload?.customerId)
    const storeId = normalizeId(payload?.storeId)
    const productId = normalizeId(payload?.productId)
    const orderId = normalizeId(payload?.orderId)

    if (!customerId || !storeId || (!productId && !orderId)) {
      return {
        success: false,
        message: 'Không thể tạo cuộc trò chuyện khi thiếu thông tin bắt buộc.',
      }
    }

    const existingConversations = readConversations()
    const matchedConversation = existingConversations.find((conversation) => {
      if (conversation.customerId !== customerId || conversation.storeId !== storeId) {
        return false
      }

      if (productId && conversation.productId === productId) {
        return true
      }

      if (orderId && conversation.orderId === orderId) {
        return true
      }

      return false
    })

    if (matchedConversation) {
      return {
        success: true,
        data: buildConversationMeta(matchedConversation),
      }
    }

    const nextConversation = {
      id: buildConversationId(existingConversations),
      customerId,
      customerName: payload?.customerName?.trim() || 'Khách hàng TechTonic',
      storeId,
      storeName: payload?.storeName?.trim() || 'TechTonic Store',
      productId,
      productName: payload?.productName?.trim() || '',
      orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    }

    saveConversations([nextConversation, ...existingConversations])

    return {
      success: true,
      data: buildConversationMeta(nextConversation),
    }
  },

  sendMessage(payload) {
    const conversationId = normalizeId(payload?.conversationId)
    const customerId = normalizeCustomerId(payload?.customerId)
    const senderId = normalizeId(payload?.senderId)
    const senderRole = payload?.senderRole?.trim() || 'CUSTOMER'
    const content = payload?.content?.trim()

    if (!conversationId || !customerId || !senderId || !content) {
      return {
        success: false,
        message: 'Không thể gửi tin nhắn rỗng hoặc thiếu thông tin người gửi.',
      }
    }

    const existingConversations = readConversations()
    const targetConversation = existingConversations.find(
      (conversation) => conversation.id === conversationId && conversation.customerId === customerId,
    )

    if (!targetConversation) {
      return {
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện để gửi tin nhắn.',
      }
    }

    const nextMessage = {
      id: buildMessageId(targetConversation.messages),
      senderRole,
      senderId,
      senderName: payload?.senderName?.trim() || 'Khách hàng',
      content,
      createdAt: new Date().toISOString(),
    }

    const updatedConversation = {
      ...targetConversation,
      updatedAt: nextMessage.createdAt,
      messages: [...targetConversation.messages, nextMessage],
    }

    const savedConversations = saveConversations(
      existingConversations.map((conversation) =>
        conversation.id === conversationId && conversation.customerId === customerId
          ? updatedConversation
          : conversation,
      ),
    )

    const savedConversation = savedConversations.find(
      (conversation) => conversation.id === conversationId && conversation.customerId === customerId,
    )

    return {
      success: true,
      data: buildConversationMeta(savedConversation),
    }
  },

  sendSellerMessage(payload) {
    const conversationId = normalizeId(payload?.conversationId)
    const storeId = normalizeId(payload?.storeId)
    const senderId = normalizeId(payload?.senderId)
    const content = payload?.content?.trim()
    const managedStoreIds = resolveManagedStoreIds(storeId)

    if (!conversationId || !storeId || !senderId || !content || !managedStoreIds.length) {
      return {
        success: false,
        message: 'Không thể gửi tin nhắn rỗng hoặc thiếu thông tin người gửi.',
      }
    }

    const existingConversations = readConversations()
    const targetConversation = existingConversations.find(
      (conversation) => conversation.id === conversationId && managedStoreIds.includes(conversation.storeId),
    )

    if (!targetConversation) {
      return {
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện thuộc gian hàng của bạn.',
      }
    }

    const nextMessage = {
      id: buildMessageId(targetConversation.messages),
      senderRole: 'SELLER',
      senderId,
      senderName: payload?.senderName?.trim() || targetConversation.storeName,
      content,
      createdAt: new Date().toISOString(),
    }

    const updatedConversation = {
      ...targetConversation,
      updatedAt: nextMessage.createdAt,
      messages: [...targetConversation.messages, nextMessage],
    }

    const savedConversations = saveConversations(
      existingConversations.map((conversation) =>
        conversation.id === conversationId && managedStoreIds.includes(conversation.storeId)
          ? updatedConversation
          : conversation,
      ),
    )

    const savedConversation = savedConversations.find(
      (conversation) => conversation.id === conversationId && managedStoreIds.includes(conversation.storeId),
    )

    return {
      success: true,
      data: buildConversationMeta(savedConversation),
    }
  },
}
