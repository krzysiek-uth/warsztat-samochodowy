

import React, { createContext, useState, useContext, useEffect } from 'react'
import * as api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    const result = await api.getCurrentUser()

    if (result.success) {
      setUser(result.data.user)
    } else {
      setUser(null)
    }

    setLoading(false)
  }

  const login = async (credentials) => {
    setError(null)
    const result = await api.login(credentials)

    if (result.success) {
      setUser(result.data.user)
      return { success: true, user: result.data.user }
    } else {
      setError(result.error)
      return { success: false, error: result.error }
    }
  }

  const register = async (userData) => {
    setError(null)
    const result = await api.register(userData)

    if (result.success) {
      setUser(result.data.user)
      return { success: true }
    } else {
      setError(result.error)
      return { success: false, error: result.error }
    }
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  const value = {
    user,           
    setUser,        
    loading,        
    error,          
    login,          
    register,       
    logout,         
    isAuthenticated: !!user,  
    isAdmin: user?.role === 'admin'  
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
