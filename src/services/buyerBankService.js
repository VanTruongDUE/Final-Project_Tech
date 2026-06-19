const BUYER_BANK_STORAGE_KEY = 'techtonic_buyer_banks'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const readBankMap = () => {
  if (!canUseStorage()) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(BUYER_BANK_STORAGE_KEY) || '{}')
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
  } catch {
    return {}
  }
}

const writeBankMap = (bankMap) => {
  if (canUseStorage()) {
    window.localStorage.setItem(BUYER_BANK_STORAGE_KEY, JSON.stringify(bankMap))
  }
}

const buildDefaultPayment = (user) => ({
  cards: [
    {
      id: `${user?.id || 'customer'}-card-1`,
      cardName: 'TechBank Platinum Rewards',
      cardNumber: '4242',
      brand: 'VISA',
      isPrimary: true,
    },
  ],
  banks: [
    {
      id: `${user?.id || 'customer'}-bank-1`,
      bankName: 'Global Tech Bank',
      accountNumber: '8901',
      accountHolder: user?.fullName || 'TechTonic Customer',
    },
  ],
})

const normalizeCard = (card, index) => ({
  id: card.id || `card-${Date.now()}-${index}`,
  cardName: card.cardName?.trim() || 'Thẻ thanh toán',
  cardNumber: card.cardNumber?.trim().slice(-4) || '0000',
  brand: card.brand?.trim().toUpperCase() || 'VISA',
  isPrimary: Boolean(card.isPrimary),
})

const normalizeBank = (bank, index) => ({
  id: bank.id || `bank-${Date.now()}-${index}`,
  bankName: bank.bankName?.trim() || 'Ngân hàng',
  accountNumber: bank.accountNumber?.trim().slice(-4) || '0000',
  accountHolder: bank.accountHolder?.trim() || 'Chủ tài khoản',
})

const normalizePayment = (payment = {}) => ({
  cards: Array.isArray(payment.cards) ? payment.cards.map(normalizeCard) : [],
  banks: Array.isArray(payment.banks) ? payment.banks.map(normalizeBank) : [],
})

const saveUserPayment = (userId, payment) => {
  const nextPayment = normalizePayment(payment)
  const bankMap = readBankMap()
  writeBankMap({
    ...bankMap,
    [userId]: nextPayment,
  })
  return nextPayment
}

export const buyerBankService = {
  getPaymentMethods(user) {
    if (!user?.id) {
      return { cards: [], banks: [] }
    }

    const bankMap = readBankMap()
    const savedPayment = bankMap[user.id]

    if (savedPayment && typeof savedPayment === 'object') {
      return normalizePayment(savedPayment)
    }

    return saveUserPayment(user.id, buildDefaultPayment(user))
  },

  saveCard(userId, cardData) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để lưu thẻ.')
    }

    const bankMap = readBankMap()
    const currentPayment = normalizePayment(bankMap[userId])
    const nextCard = normalizeCard(
      {
        ...cardData,
        id: cardData.id || `card-${Date.now()}`,
      },
      currentPayment.cards.length,
    )
    const existingIndex = currentPayment.cards.findIndex((card) => card.id === nextCard.id)
    let nextCards =
      existingIndex >= 0
        ? currentPayment.cards.map((card, index) => (index === existingIndex ? nextCard : card))
        : [...currentPayment.cards, nextCard]

    if (nextCard.isPrimary) {
      nextCards = nextCards.map((card) => ({
        ...card,
        isPrimary: card.id === nextCard.id,
      }))
    }

    return saveUserPayment(userId, {
      ...currentPayment,
      cards: nextCards,
    })
  },

  deleteCard(userId, cardId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để xóa thẻ.')
    }

    const bankMap = readBankMap()
    const currentPayment = normalizePayment(bankMap[userId])
    return saveUserPayment(userId, {
      ...currentPayment,
      cards: currentPayment.cards.filter((card) => card.id !== cardId),
    })
  },

  saveBank(userId, bankData) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để lưu tài khoản ngân hàng.')
    }

    const bankMap = readBankMap()
    const currentPayment = normalizePayment(bankMap[userId])
    const nextBank = normalizeBank(
      {
        ...bankData,
        id: bankData.id || `bank-${Date.now()}`,
      },
      currentPayment.banks.length,
    )
    const existingIndex = currentPayment.banks.findIndex((bank) => bank.id === nextBank.id)
    const nextBanks =
      existingIndex >= 0
        ? currentPayment.banks.map((bank, index) => (index === existingIndex ? nextBank : bank))
        : [...currentPayment.banks, nextBank]

    return saveUserPayment(userId, {
      ...currentPayment,
      banks: nextBanks,
    })
  },

  deleteBank(userId, bankId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để xóa tài khoản ngân hàng.')
    }

    const bankMap = readBankMap()
    const currentPayment = normalizePayment(bankMap[userId])
    return saveUserPayment(userId, {
      ...currentPayment,
      banks: currentPayment.banks.filter((bank) => bank.id !== bankId),
    })
  },

  getStorageKey() {
    return BUYER_BANK_STORAGE_KEY
  },
}
