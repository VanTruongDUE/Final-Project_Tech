const BUYER_ADDRESS_STORAGE_KEY = 'techtonic_buyer_addresses'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const readAddressMap = () => {
  if (!canUseStorage()) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(BUYER_ADDRESS_STORAGE_KEY) || '{}')
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
  } catch {
    return {}
  }
}

const writeAddressMap = (addressMap) => {
  if (canUseStorage()) {
    window.localStorage.setItem(BUYER_ADDRESS_STORAGE_KEY, JSON.stringify(addressMap))
  }
}

const buildDefaultAddresses = (user) => [
  {
    id: `${user?.id || 'customer'}-address-1`,
    fullName: user?.fullName || 'TechTonic Customer',
    phone: '0912 345 678',
    street: 'Số 123, Đường Lê Lợi, Phường Bến Thành',
    city: 'Quận 1, TP. Hồ Chí Minh',
    tags: ['Mặc định', 'Địa chỉ lấy hàng', 'Địa chỉ trả hàng'],
    isDefault: true,
  },
  {
    id: `${user?.id || 'customer'}-address-2`,
    fullName: 'Trần Thị B',
    phone: '0987 654 321',
    street: 'Tòa nhà Tech, Khu Công Nghệ Cao',
    city: 'TP. Thủ Đức, TP. Hồ Chí Minh',
    tags: ['Văn phòng'],
    isDefault: false,
  },
]

const normalizeAddress = (address, index) => ({
  id: address.id || `address-${Date.now()}-${index}`,
  fullName: address.fullName?.trim() || 'Người nhận',
  phone: address.phone?.trim() || '',
  street: address.street?.trim() || '',
  city: address.city?.trim() || '',
  tags: Array.isArray(address.tags) ? address.tags : [],
  isDefault: Boolean(address.isDefault),
})

const saveUserAddresses = (userId, addresses) => {
  const normalizedAddresses = addresses.map(normalizeAddress)
  const hasDefault = normalizedAddresses.some((address) => address.isDefault)
  const nextAddresses = hasDefault
    ? normalizedAddresses
    : normalizedAddresses.map((address, index) => ({ ...address, isDefault: index === 0 }))

  const addressMap = readAddressMap()
  writeAddressMap({
    ...addressMap,
    [userId]: nextAddresses,
  })

  return nextAddresses
}

export const buyerAddressService = {
  getAddresses(user) {
    if (!user?.id) {
      return []
    }

    const addressMap = readAddressMap()
    const savedAddresses = addressMap[user.id]

    if (Array.isArray(savedAddresses) && savedAddresses.length) {
      return savedAddresses.map(normalizeAddress)
    }

    return saveUserAddresses(user.id, buildDefaultAddresses(user))
  },

  saveAddress(userId, addressData) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để lưu địa chỉ.')
    }

    const addressMap = readAddressMap()
    const currentAddresses = Array.isArray(addressMap[userId]) ? addressMap[userId] : []
    const existingIndex = currentAddresses.findIndex((address) => address.id === addressData.id)
    const nextAddress = normalizeAddress(
      {
        ...addressData,
        id: addressData.id || `address-${Date.now()}`,
      },
      currentAddresses.length,
    )

    let nextAddresses =
      existingIndex >= 0
        ? currentAddresses.map((address, index) => (index === existingIndex ? nextAddress : address))
        : [...currentAddresses, nextAddress]

    if (nextAddress.isDefault) {
      nextAddresses = nextAddresses.map((address) => ({
        ...address,
        isDefault: address.id === nextAddress.id,
      }))
    }

    return saveUserAddresses(userId, nextAddresses)
  },

  deleteAddress(userId, addressId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để xóa địa chỉ.')
    }

    const addressMap = readAddressMap()
    const currentAddresses = Array.isArray(addressMap[userId]) ? addressMap[userId] : []
    return saveUserAddresses(
      userId,
      currentAddresses.filter((address) => address.id !== addressId),
    )
  },

  setDefaultAddress(userId, addressId) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để thiết lập địa chỉ mặc định.')
    }

    const addressMap = readAddressMap()
    const currentAddresses = Array.isArray(addressMap[userId]) ? addressMap[userId] : []
    return saveUserAddresses(
      userId,
      currentAddresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    )
  },

  getStorageKey() {
    return BUYER_ADDRESS_STORAGE_KEY
  },
}
