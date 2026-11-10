import { createContext, useContext, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const persistSession = useCallback((data) => {
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials)
    persistSession(data)
  }, [persistSession])

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload)
    persistSession(data)
  }, [persistSession])

  // Cuenta temporal con proyectos de ejemplo: probar la app sin registrarse
  const loginAsGuest = useCallback(async () => {
    const { data } = await authApi.guest()
    persistSession(data)
  }, [persistSession])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.clear()
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
