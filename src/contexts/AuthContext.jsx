import { useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())

  const login = async (email, password) => {
    const user = await authService.login(email, password)
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    authService.logout()
    setCurrentUser(null)
  }

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

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
    }),
    [currentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
