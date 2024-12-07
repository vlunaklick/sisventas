'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface AuthContextType {
  user: { username: string; role: 'admin' | 'cocina' } | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, password: string) => {
  if (username === 'admin' && password === 'admin') {
    const userData = { username, role: 'admin' }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return true
  } else if (username === 'cocina' && password === 'cocina') {
    const userData = { username, role: 'cocina' }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return true
  }
  return false
}

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

