import { ROLES, resolvePrimaryRole } from '../utils/roles'
import { apiRequest, tokenStorage } from './apiClient'

const AUTH_STORAGE_KEY = 'techtonic-commerce-user'
const PROFILE_ENDPOINT = '/users/me'
const VALID_ROLES = Object.values(ROLES)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateRequiredField = (value) => typeof value === 'string' && value.trim().length > 0
const normalizeEmail = (email) => email.trim().toLowerCase()
const isPhoneIdentifier = (value) => /^[0-9+()\-\s]+$/.test(value.trim())

const isValidStoredUser = (user) =>
  Boolean(
    user &&
      typeof user === 'object' &&
      (typeof user.id === 'number' || typeof user.id === 'string') &&
      typeof user.email === 'string' &&
      typeof user.fullName === 'string' &&
      VALID_ROLES.includes(user.role),
  )

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null

  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    )
    return JSON.parse(window.atob(paddedPayload))
  } catch {
    return null
  }
}

const normalizeRole = (role) => {
  const normalizedRole = String(role || '').trim().toUpperCase().replace(/\s+/g, '_')
  return VALID_ROLES.find((validRole) => validRole === normalizedRole) || ''
}

const normalizeRoles = (...roleSources) => [
  ...new Set(roleSources.flat().map(normalizeRole).filter(Boolean)),
]

const buildUserFromApi = (apiUser = {}, accessToken = tokenStorage.getAccessToken()) => {
  const tokenPayload = decodeJwtPayload(accessToken)
  const roles = normalizeRoles(tokenPayload?.roles, apiUser.roles)
  const userId = apiUser.user_id ?? apiUser.id ?? tokenPayload?.user_id
  const email = apiUser.email ?? tokenPayload?.email ?? ''
  const fullName = apiUser.full_name ?? apiUser.fullName ?? email

  return {
    id: userId,
    userId,
    fullName,
    email,
    phone: apiUser.phone || '',
    avatarUrl: apiUser.avatar_url || '',
    role: resolvePrimaryRole(roles),
    roles: roles.length ? roles : [ROLES.CUSTOMER],
  }
}

const identifierPayload = (identifier) => {
  const value = identifier.trim()
  return isPhoneIdentifier(value) ? { phone: value } : { email: normalizeEmail(value) }
}

const validateIdentifier = (identifier) => {
  if (!validateRequiredField(identifier)) {
    throw new Error('Vui lòng nhập email hoặc số điện thoại.')
  }

  if (!isPhoneIdentifier(identifier) && !emailRegex.test(normalizeEmail(identifier))) {
    throw new Error('Email không đúng định dạng.')
  }
}

export const authService = {
  async login(loginId, password) {
    validateIdentifier(loginId)
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ ...identifierPayload(loginId), password }),
    })

    const accessToken = result.data?.access_token
    const refreshToken = result.data?.refresh_token
    if (!accessToken) throw new Error('Backend không trả access_token sau khi đăng nhập.')

    tokenStorage.save({ accessToken, refreshToken })
    const user = buildUserFromApi(result.data?.user, accessToken)
    this.saveCurrentUser(user)
    return user
  },

  async registerUser({ fullName, email, phone, password, confirmPassword }) {
    if (!validateRequiredField(fullName)) throw new Error('Vui lòng nhập họ và tên.')
    if (!validateRequiredField(email) || !emailRegex.test(normalizeEmail(email))) {
      throw new Error('Email không đúng định dạng.')
    }
    if (!validateRequiredField(phone)) throw new Error('Vui lòng nhập số điện thoại.')
    if (!validateRequiredField(password) || password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự.')
    }
    if (password !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp.')

    const result = await apiRequest('/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({
        full_name: fullName.trim(),
        email: normalizeEmail(email),
        phone: phone.trim(),
        password,
      }),
    })

    return { success: true, message: result.message || 'Đăng ký tài khoản thành công.', data: result.data }
  },

  async requestPasswordReset(identifier) {
    validateIdentifier(identifier)
    const payload = identifierPayload(identifier)
    const result = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(payload),
    })

    // Deliberately discard development-only OTP values returned by the Backend.
    return {
      success: true,
      message: result.message || 'Nếu tài khoản tồn tại, mã OTP đã được gửi.',
      data: payload,
    }
  },

  preparePasswordReset({ identifier, otp }) {
    validateIdentifier(identifier)
    if (!/^\d{6}$/.test(otp.trim())) throw new Error('Mã OTP phải gồm 6 chữ số.')

    return { success: true, data: { ...identifierPayload(identifier), otp: otp.trim() } }
  },

  async resetPassword({ email, phone, otp, newPassword, confirmPassword }) {
    const identifier = email || phone || ''
    validateIdentifier(identifier)
    if (!validateRequiredField(otp)) throw new Error('Vui lòng nhập mã OTP.')
    if (!validateRequiredField(newPassword) || newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.')
    }
    if (newPassword !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp.')

    const result = await apiRequest('/auth/reset-password', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ ...identifierPayload(identifier), otp: otp.trim(), new_password: newPassword }),
    })

    return { success: true, message: result.message || 'Đặt lại mật khẩu thành công.' }
  },

  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    if (!validateRequiredField(currentPassword)) throw new Error('Vui lòng nhập mật khẩu hiện tại.')
    if (!validateRequiredField(newPassword) || newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.')
    }
    if (newPassword !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp.')

    const result = await apiRequest('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
    })

    return { success: true, message: result.message || 'Đổi mật khẩu thành công.' }
  },

  getCurrentUser() {
    if (!tokenStorage.getAccessToken()) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    try {
      const parsedUser = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
      if (!isValidStoredUser(parsedUser)) return null
      return parsedUser
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
  },

  saveCurrentUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  },

  async restoreCurrentUser() {
    if (!tokenStorage.getAccessToken()) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    const result = await apiRequest(PROFILE_ENDPOINT)
    const user = buildUserFromApi(result.data)
    this.saveCurrentUser(user)
    return user
  },

  clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    tokenStorage.clear()
  },

  async logout() {
    const accessToken = tokenStorage.getAccessToken()
    const refreshToken = tokenStorage.getRefreshToken()

    try {
      if (accessToken && refreshToken) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          auth: false,
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      }
    } finally {
      this.clearSession()
    }
  },

  getStorageKey() {
    return AUTH_STORAGE_KEY
  },
}
