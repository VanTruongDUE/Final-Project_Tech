import { mockUsers } from '../mocks/users.mock'
import { ROLES } from '../utils/roles'
import { resolveUserRole } from '../utils/userRoleOverrides'
import { apiRequest, tokenStorage } from './apiClient'

const AUTH_STORAGE_KEY = 'techtonic-commerce-user'
const REGISTERED_USERS_KEY = 'techtonic_registered_users'
const PASSWORD_RESET_KEY = 'techtonic_password_reset_requests'
const PASSWORD_OVERRIDES_KEY = 'techtonic_password_overrides'
const VALID_ROLES = Object.values(ROLES)
const DEMO_RESET_OTP = '123456'
const OTP_EXPIRES_IN_MS = 10 * 60 * 1000
const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sanitizeUser = (user) => {
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

const isValidStoredUser = (user) =>
  Boolean(
    user &&
      typeof user === 'object' &&
      (typeof user.id === 'number' || typeof user.id === 'string') &&
      typeof user.email === 'string' &&
      typeof user.fullName === 'string' &&
      VALID_ROLES.includes(user.role),
  )

const readJson = (key, fallback) => {
  const rawValue = localStorage.getItem(key)

  if (!rawValue) {
    return fallback
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return parsedValue ?? fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getRegisteredUsers = () => {
  const users = readJson(REGISTERED_USERS_KEY, [])
  return Array.isArray(users) ? users : []
}

const saveRegisteredUsers = (users) => {
  writeJson(REGISTERED_USERS_KEY, users)
}

const getPasswordOverrides = () => {
  const overrides = readJson(PASSWORD_OVERRIDES_KEY, {})
  return overrides && typeof overrides === 'object' && !Array.isArray(overrides) ? overrides : {}
}

const savePasswordOverrides = (overrides) => {
  writeJson(PASSWORD_OVERRIDES_KEY, overrides)
}

const getPasswordResetRequests = () => {
  const requests = readJson(PASSWORD_RESET_KEY, [])
  return Array.isArray(requests) ? requests : []
}

const savePasswordResetRequests = (requests) => {
  writeJson(PASSWORD_RESET_KEY, requests)
}

const normalizeEmail = (email) => email.trim().toLowerCase()

const validateEmail = (email) => emailRegex.test(email)

const resolveMockUserPassword = (user, overrides) => overrides[user.email] || user.password

const buildLoginUsers = () => {
  const passwordOverrides = getPasswordOverrides()
  const registeredUsers = getRegisteredUsers()
  const registeredList = registeredUsers.filter(
    (user) => user && typeof user.email === 'string' && typeof user.password === 'string',
  )

  const applyRoleOverride = (user) => ({
    ...user,
    role: resolveUserRole(user.email, user.role),
  })

  const mockUserList = mockUsers.map((user) => ({
    ...user,
    password: resolveMockUserPassword(user, passwordOverrides),
  })).map(applyRoleOverride)

  return [...mockUserList, ...registeredList.map(applyRoleOverride)]
}

const findLoginUserByEmail = (email) =>
  buildLoginUsers().find((user) => user.email === normalizeEmail(email))

const getLatestResetRequest = (email) => {
  const normalizedEmail = normalizeEmail(email)
  const requests = getPasswordResetRequests()
  return requests
    .filter((request) => request.email === normalizedEmail)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0]
}

const createResetRequest = (email) => {
  const normalizedEmail = normalizeEmail(email)
  const now = Date.now()
  const request = {
    email: normalizedEmail,
    otp: DEMO_RESET_OTP,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + OTP_EXPIRES_IN_MS).toISOString(),
    verified: false,
  }

  const otherRequests = getPasswordResetRequests().filter(
    (item) => item.email !== normalizedEmail,
  )

  savePasswordResetRequests([...otherRequests, request])
  return request
}

const validateRequiredField = (value) => typeof value === 'string' && value.trim().length > 0

export const authService = {
  async login(loginId, password) {
    if (!USE_API) {
      const normalizedEmail = normalizeEmail(loginId)
      const matchedUser = buildLoginUsers().find(
        (user) => user.email === normalizedEmail && user.password === password,
      )

      if (!matchedUser) {
        throw new Error('Email hoặc mật khẩu không đúng.')
      }

      const safeUser = sanitizeUser(matchedUser)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser))
      return safeUser
    }

    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login_id: loginId.trim(), password }),
    })

    const roles = Array.isArray(result.data?.roles) ? result.data.roles : []
    const user = {
      id: result.data?.user_id,
      fullName: result.data?.full_name,
      email: result.data?.email,
      phone: result.data?.phone || '',
      role: roles[0] || ROLES.CUSTOMER,
      roles,
    }

    tokenStorage.save(result.tokens || {})
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    return user
  },

  async registerUser({ fullName, email, phone, password, confirmPassword }) {
    if (!validateRequiredField(fullName)) {
      throw new Error('Vui lòng nhập họ và tên.')
    }

    if (!validateRequiredField(email)) {
      throw new Error('Vui lòng nhập email.')
    }

    const normalizedEmail = normalizeEmail(email)

    if (!validateEmail(normalizedEmail)) {
      throw new Error('Email không đúng định dạng.')
    }

    if (!validateRequiredField(phone)) {
      throw new Error('Vui lòng nhập số điện thoại.')
    }

    if (!validateRequiredField(password)) {
      throw new Error('Vui lòng nhập mật khẩu.')
    }

    if (password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự.')
    }

    if (password !== confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp.')
    }

    if (!USE_API) {
      if (findLoginUserByEmail(normalizedEmail)) {
        throw new Error('Email này đã được sử dụng.')
      }

      const newUser = {
        id: `CUSTOMER-LOCAL-${Date.now()}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        role: ROLES.CUSTOMER,
        createdAt: new Date().toISOString(),
      }

      saveRegisteredUsers([...getRegisteredUsers(), newUser])

      return {
        success: true,
        message: 'Đăng ký tài khoản thành công.',
        data: sanitizeUser(newUser),
      }
    }

    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
      }),
    })

    return {
      success: true,
      message: result.message || 'Đăng ký tài khoản thành công.',
    }
  },

  requestPasswordReset(email) {
    if (!validateRequiredField(email)) {
      throw new Error('Vui lòng nhập email.')
    }

    const normalizedEmail = normalizeEmail(email)

    if (!validateEmail(normalizedEmail)) {
      throw new Error('Email không đúng định dạng.')
    }

    const matchedUser = findLoginUserByEmail(normalizedEmail)

    if (!matchedUser) {
      throw new Error('Không tìm thấy tài khoản với email này.')
    }

    const request = createResetRequest(normalizedEmail)

    return {
      success: true,
      message: 'Mã OTP đã được tạo thành công.',
      data: {
        email: normalizedEmail,
        otp: request.otp,
        expiresAt: request.expiresAt,
      },
    }
  },

  verifyResetOtp({ email, otp }) {
    if (!validateRequiredField(email) || !validateRequiredField(otp)) {
      throw new Error('Vui lòng nhập email và mã OTP.')
    }

    const latestRequest = getLatestResetRequest(email)

    if (!latestRequest) {
      throw new Error('Không tìm thấy yêu cầu đặt lại mật khẩu.')
    }

    if (new Date(latestRequest.expiresAt).getTime() < Date.now()) {
      throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.')
    }

    if (latestRequest.otp !== otp.trim()) {
      throw new Error('Mã OTP không chính xác.')
    }

    const requests = getPasswordResetRequests().map((request) =>
      request.email === latestRequest.email
        ? { ...request, verified: true, verifiedAt: new Date().toISOString() }
        : request,
    )

    savePasswordResetRequests(requests)

    return {
      success: true,
      message: 'Xác minh OTP thành công.',
      data: {
        email: latestRequest.email,
        otp: latestRequest.otp,
      },
    }
  },

  resetPassword({ email, otp, newPassword, confirmPassword }) {
    if (!validateRequiredField(email)) {
      throw new Error('Vui lòng nhập email.')
    }

    if (!validateRequiredField(otp)) {
      throw new Error('Vui lòng nhập mã OTP.')
    }

    if (!validateRequiredField(newPassword)) {
      throw new Error('Vui lòng nhập mật khẩu mới.')
    }

    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.')
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp.')
    }

    const verificationResult = this.verifyResetOtp({ email, otp })
    const normalizedEmail = verificationResult.data.email
    const requests = getPasswordResetRequests()
    const matchedRequest = requests.find((request) => request.email === normalizedEmail)

    if (!matchedRequest?.verified) {
      throw new Error('Vui lòng xác minh OTP trước khi đặt lại mật khẩu.')
    }

    const registeredUsers = getRegisteredUsers()
    const registeredUserIndex = registeredUsers.findIndex(
      (user) => user.email === normalizedEmail,
    )

    if (registeredUserIndex >= 0) {
      const nextUsers = [...registeredUsers]
      nextUsers[registeredUserIndex] = {
        ...nextUsers[registeredUserIndex],
        password: newPassword,
        updatedAt: new Date().toISOString(),
      }
      saveRegisteredUsers(nextUsers)
    } else {
      const overrides = getPasswordOverrides()
      savePasswordOverrides({
        ...overrides,
        [normalizedEmail]: newPassword,
      })
    }

    savePasswordResetRequests(
      requests.filter((request) => request.email !== normalizedEmail),
    )

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công.',
    }
  },

  changePassword({ email, currentPassword, newPassword, confirmPassword }) {
    if (!validateRequiredField(email)) {
      throw new Error('Không tìm thấy email tài khoản.')
    }

    if (!validateRequiredField(currentPassword)) {
      throw new Error('Vui lòng nhập mật khẩu hiện tại.')
    }

    if (!validateRequiredField(newPassword)) {
      throw new Error('Vui lòng nhập mật khẩu mới.')
    }

    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.')
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp.')
    }

    const normalizedEmail = normalizeEmail(email)
    const matchedUser = findLoginUserByEmail(normalizedEmail)

    if (!matchedUser) {
      throw new Error('Không tìm thấy tài khoản.')
    }

    if (matchedUser.password !== currentPassword) {
      throw new Error('Mật khẩu hiện tại không đúng.')
    }

    const registeredUsers = getRegisteredUsers()
    const registeredUserIndex = registeredUsers.findIndex(
      (user) => user.email === normalizedEmail,
    )

    if (registeredUserIndex >= 0) {
      const nextUsers = [...registeredUsers]
      nextUsers[registeredUserIndex] = {
        ...nextUsers[registeredUserIndex],
        password: newPassword,
        updatedAt: new Date().toISOString(),
      }
      saveRegisteredUsers(nextUsers)
    } else {
      const overrides = getPasswordOverrides()
      savePasswordOverrides({
        ...overrides,
        [normalizedEmail]: newPassword,
      })
    }

    return {
      success: true,
      message: 'Đổi mật khẩu thành công.',
    }
  },

  getCurrentUser() {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawUser) {
      return null
    }

    try {
      const parsedUser = JSON.parse(rawUser)

      if (!isValidStoredUser(parsedUser)) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        return null
      }

      return parsedUser
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    tokenStorage.clear()
  },

  getStorageKey() {
    return AUTH_STORAGE_KEY
  },

  getRegisteredUsersKey() {
    return REGISTERED_USERS_KEY
  },

  getPasswordResetKey() {
    return PASSWORD_RESET_KEY
  },

  getPasswordOverridesKey() {
    return PASSWORD_OVERRIDES_KEY
  },
}
