import { mockUsers } from '../mocks/users.mock'
import { ROLES } from '../utils/roles'

const AUTH_STORAGE_KEY = 'techtonic-commerce-user'
const VALID_ROLES = Object.values(ROLES)

const sanitizeUser = (user) => {
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

const isValidStoredUser = (user) =>
  Boolean(
    user &&
      typeof user === 'object' &&
      typeof user.id === 'number' &&
      typeof user.email === 'string' &&
      typeof user.fullName === 'string' &&
      VALID_ROLES.includes(user.role),
  )

export const authService = {
  login(email, password) {
    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = mockUsers.find(
      (user) => user.email === normalizedEmail && user.password === password,
    )

    if (!matchedUser) {
      throw new Error('Email hoặc mật khẩu không đúng.')
    }

    const safeUser = sanitizeUser(matchedUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser))
    return safeUser
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
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

  getStorageKey() {
    return AUTH_STORAGE_KEY
  },
}
