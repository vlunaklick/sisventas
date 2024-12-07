'use client'

import { createUser, getUsers } from '@/app/api/users'
import { User } from '@prisma/client'
import React, { createContext, useState, useContext, useEffect } from 'react'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, password: string, role: 'ADMIN' | 'CAJA' | 'COCINA') => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = await getUsers()
      const user = users.find(u => u.username === username)
      if (user) {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = async (username: string, password: string, role: 'ADMIN' | 'CAJA' | 'COCINA'): Promise<boolean> => {
    try {
      const newUser = await createUser(username, password, role)
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error('Error registering user:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
