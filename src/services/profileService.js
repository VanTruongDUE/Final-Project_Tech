const PROFILE_STORAGE_KEY = 'techtonic_buyer_profiles'

const readProfiles = () => {
  const rawValue = localStorage.getItem(PROFILE_STORAGE_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
  } catch {
    return {}
  }
}

const writeProfiles = (profiles) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles))
}

const buildDefaultProfile = (user) => ({
  username: user?.email?.split('@')[0] || 'techtonic_user',
  fullName: user?.fullName || '',
  email: user?.email || '',
  phone: '',
  gender: 'male',
  birthDay: '15',
  birthMonth: 'Tháng 8',
  birthYear: '1990',
  avatarInitials: '',
})

export const profileService = {
  getProfile(user) {
    if (!user?.id) {
      return buildDefaultProfile(user)
    }

    const profiles = readProfiles()
    return {
      ...buildDefaultProfile(user),
      ...(profiles[user.id] || {}),
    }
  },

  updateProfile(userId, profileData) {
    if (!userId) {
      throw new Error('Không tìm thấy tài khoản để cập nhật hồ sơ.')
    }

    const profiles = readProfiles()
    const nextProfile = {
      ...(profiles[userId] || {}),
      ...profileData,
      updatedAt: new Date().toISOString(),
    }

    writeProfiles({
      ...profiles,
      [userId]: nextProfile,
    })

    return nextProfile
  },

  getStorageKey() {
    return PROFILE_STORAGE_KEY
  },
}
