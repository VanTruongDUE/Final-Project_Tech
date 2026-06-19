const BUYER_PRIVACY_STORAGE_KEY = 'techtonic_buyer_privacy_settings'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const readPrivacyMap = () => {
  if (!canUseStorage()) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(BUYER_PRIVACY_STORAGE_KEY) || '{}')
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
  } catch {
    return {}
  }
}

const writePrivacyMap = (privacyMap) => {
  if (canUseStorage()) {
    window.localStorage.setItem(BUYER_PRIVACY_STORAGE_KEY, JSON.stringify(privacyMap))
  }
}

const defaultSettings = {
  requireCodForHighValue: true,
  publicShoppingActivity: false,
  allowFindByPhone: true,
  hideEmailFromSellers: true,
  hidePhoneUntilShipping: true,
  allowSellerMessagesAfterOrder: true,
  personalizedRecommendations: true,
  requireConfirmForSensitiveChanges: true,
}

export const buyerPrivacyService = {
  getSettings(user) {
    if (!user?.id) {
      return defaultSettings
    }

    const privacyMap = readPrivacyMap()
    return {
      ...defaultSettings,
      ...(privacyMap[user.id] || {}),
    }
  },

  updateSettings(userId, settings) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để lưu thiết lập riêng tư.')
    }

    const privacyMap = readPrivacyMap()
    const nextSettings = {
      ...defaultSettings,
      ...settings,
      updatedAt: new Date().toISOString(),
    }

    writePrivacyMap({
      ...privacyMap,
      [userId]: nextSettings,
    })

    return nextSettings
  },

  getStorageKey() {
    return BUYER_PRIVACY_STORAGE_KEY
  },
}
