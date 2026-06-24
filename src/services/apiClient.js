const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

const ACCESS_TOKEN_KEY = 'techtonic_access_token'
const REFRESH_TOKEN_KEY = 'techtonic_refresh_token'

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('application/json') ? response.json() : null
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend đang chạy.')
  }

  const result = await parseResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || `Yêu cầu thất bại (${response.status}).`)
  }

  return result
}

export const tokenStorage = {
  save({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
