import { ROLES } from './roles'

export const USER_ROLE_OVERRIDES_KEY = 'techtonic_admin_user_roles'
export const ASSIGNABLE_USER_ROLES = Object.values(ROLES)

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

export function getUserRoleOverrides() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(USER_ROLE_OVERRIDES_KEY) || '{}')
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
  } catch {
    return {}
  }
}

export function resolveUserRole(email, fallbackRole) {
  const role = getUserRoleOverrides()[normalizeEmail(email)]
  return ASSIGNABLE_USER_ROLES.includes(role) ? role : fallbackRole
}

export function saveUserRoleOverride(email, role) {
  if (typeof window === 'undefined' || !ASSIGNABLE_USER_ROLES.includes(role)) {
    return false
  }

  const overrides = getUserRoleOverrides()
  overrides[normalizeEmail(email)] = role
  window.localStorage.setItem(USER_ROLE_OVERRIDES_KEY, JSON.stringify(overrides))
  return true
}
