const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

const ACCESS_TOKEN_KEY = 'techtonic_access_token'
const REFRESH_TOKEN_KEY = 'techtonic_refresh_token'

export const AUTH_UNAUTHORIZED_EVENT = 'techtonic-auth-unauthorized'

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('application/json') ? response.json() : null
}

export async function apiRequest(path, options = {}) {
  const token = tokenStorage.getAccessToken()
  const shouldAttachAuth = options.auth !== false
  const fetchOptions = { ...options }
  delete fetchOptions.auth
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: {
        ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...(shouldAttachAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    })
  } catch {
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend đang chạy.')
  }

  const result = await parseResponse(response)

  if (!response.ok) {
    if (response.status === 401 && shouldAttachAuth && token) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }

    throw new Error(result?.message || `Yêu cầu thất bại (${response.status}).`)
  }

  return result
}

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  save({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
