import { apiRequest } from './apiClient'

const normalizeProfile = (profile = {}) => ({
  id: profile.user_id,
  userId: profile.user_id,
  fullName: profile.full_name || '',
  email: profile.email || '',
  phone: profile.phone || '',
  avatarUrl: profile.avatar_url || '',
  gender: profile.gender || '',
  birthDate: profile.birth_date || '',
  roles: Array.isArray(profile.roles) ? profile.roles : [],
})

export const profileService = {
  async getProfile() {
    const result = await apiRequest('/users/me')
    return {
      success: true,
      data: normalizeProfile(result.data),
      message: result.message || 'Lấy thông tin hồ sơ thành công.',
    }
  },

  async updateProfile(profileData) {
    const payload = {
      full_name: profileData.fullName.trim(),
      phone: profileData.phone.trim() || null,
      gender: profileData.gender || null,
      birth_date: profileData.birthDate || null,
    }

    if (profileData.avatarUrl !== undefined) payload.avatar_url = profileData.avatarUrl || null

    const result = await apiRequest('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    const refreshedProfile = await this.getProfile()

    return {
      ...refreshedProfile,
      message: result.message || 'Cập nhật thông tin thành công.',
    }
  },
}
