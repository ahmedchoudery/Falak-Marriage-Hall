"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adminToken')
    }
    return null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(!!adminToken)

  // Sync state if sessionStorage changes (e.g. from login)
  useEffect(() => {
    setIsAuthenticated(!!adminToken)
    if (adminToken) {
      sessionStorage.setItem('adminToken', adminToken)
    } else {
      sessionStorage.removeItem('adminToken')
    }
  }, [adminToken])

  const login = (token) => {
    setAdminToken(token)
  }

  const logout = () => {
    setAdminToken(null)
  }

  return (
    <AuthContext.Provider value={{ adminToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
