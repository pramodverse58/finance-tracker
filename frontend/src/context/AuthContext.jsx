import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)

const TOKEN_KEY = 'finance_tracker_token'
const USER_KEY = 'finance_tracker_user'

function isTokenValid(token) {
  if (!token) return false
  try {
    const decoded = jwtDecode(token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (token && isTokenValid(token) && storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    setLoading(false)
  }, [])

  const persistSession = (authResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.token)
    const sessionUser = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    persistSession(res)
    return res
  }, [])

  const signup = useCallback(async (fullName, email, password) => {
    const res = await authApi.signup({ fullName, email, password })
    persistSession(res)
    return res
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
