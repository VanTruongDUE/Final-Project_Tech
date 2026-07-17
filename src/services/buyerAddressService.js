import { apiRequest } from './apiClient'

const normalizeAddress = (address = {}) => ({
  id: address.address_id,
  addressId: address.address_id,
  fullName: address.recipient_name || '',
  phone: address.recipient_phone || '',
  street: address.address_line || '',
  ward: address.ward || '',
  district: address.district || '',
  province: address.province || '',
  country: address.country || 'Việt Nam',
  city: [address.ward, address.district, address.province].filter(Boolean).join(', '),
  tags: [],
  isDefault: Boolean(address.is_default),
})

const toPayload = (address) => ({
  recipient_name: address.fullName.trim(),
  recipient_phone: address.phone.trim(),
  address_line: address.street.trim(),
  ward: address.ward?.trim() || null,
  district: address.district?.trim() || null,
  province: address.province.trim(),
  country: address.country?.trim() || 'Việt Nam',
  is_default: Boolean(address.isDefault),
})

export const buyerAddressService = {
  async getAddresses() {
    const result = await apiRequest('/me/addresses')
    return {
      success: true,
      data: Array.isArray(result.data) ? result.data.map(normalizeAddress) : [],
      message: result.message || 'Lấy danh sách địa chỉ thành công.',
    }
  },

  async saveAddress(addressData) {
    const isUpdate = Boolean(addressData.id)
    const result = await apiRequest(isUpdate ? `/me/addresses/${addressData.id}` : '/me/addresses', {
      method: isUpdate ? 'PATCH' : 'POST',
      body: JSON.stringify(toPayload(addressData)),
    })
    const refreshed = await this.getAddresses()
    return { ...refreshed, message: result.message || 'Lưu địa chỉ thành công.' }
  },

  async deleteAddress(addressId) {
    const result = await apiRequest(`/me/addresses/${addressId}`, { method: 'DELETE' })
    const refreshed = await this.getAddresses()
    return { ...refreshed, message: result.message || 'Xóa địa chỉ thành công.' }
  },

  async setDefaultAddress(addressId) {
    // The generic PATCH contract supports is_default and is the working Backend path.
    const result = await apiRequest(`/me/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_default: true }),
    })
    const refreshed = await this.getAddresses()
    return { ...refreshed, message: result.message || 'Đã thiết lập địa chỉ mặc định.' }
  },
}
