import { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // For Basic Auth, we'll store the email:password as token
      const token = btoa(`${email}:${password}`)
      const response = await authAPI.login(email, password)
      
      const userData = {
        id: response.user_id,
        email: response.email,
        role: response.role,
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true, data: response }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please check your credentials.',
      }
    }
  }

  const register = async (email, password, isEmployer = false, isApplicant = true) => {
    try {
      const response = await authAPI.register(email, password, isEmployer, isApplicant)
      
      // Auto-login after registration
      const token = btoa(`${email}:${password}`)
      const userData = {
        id: response.user_id,
        email: response.email,
        role: response.role,
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true, data: response }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.',
      }
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const isEmployer = () => user?.role?.includes('employer') || false
  const isApplicant = () => user?.role?.includes('applicant') || false

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isEmployer,
    isApplicant,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

