import { useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { AUTH_UNAUTHORIZED_EVENT } from '../services/apiClient'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const login = async (email, password) => {
    const user = await authService.login(email, password)
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    setCurrentUser(null)
    return authService.logout()
  }

  const updateCurrentUser = (user) => {
    authService.saveCurrentUser(user)
    setCurrentUser(user)
  }

  const refreshCurrentUser = async () => {
    const user = await authService.restoreCurrentUser()
    setCurrentUser(user)
    return user
  }

  useEffect(() => {
    let isMounted = true

    authService
      .restoreCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user)
        }
      })
      .catch(() => {
        authService.clearSession()
        if (isMounted) {
          setCurrentUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key && event.key !== authService.getStorageKey()) {
        return
      }

      setCurrentUser(authService.getCurrentUser())
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      authService.clearSession()
      setCurrentUser(null)
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAuthLoading,
      login,
      logout,
      updateCurrentUser,
      refreshCurrentUser,
    }),
    [currentUser, isAuthLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
