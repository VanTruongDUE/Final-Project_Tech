import { apiRequest } from './apiClient'

export const sellerOnboardingService = {
  async getApplication() {
    const result = await apiRequest('/me/store-application')
    return result.data || null
  },

  async submitApplication(payload) {
    const result = await apiRequest('/me/store-application', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return {
      message: result.message || 'Đã gửi hồ sơ đăng ký người bán.',
      application: result.data,
    }
  },
}
