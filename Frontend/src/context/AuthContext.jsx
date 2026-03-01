import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem('token')
    if (!accessToken) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
        setUser(response.data)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        clearUser()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, []) // Run only once on mount

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('token', userData.token)
    setLoading(false)
  }

  const clearUser = () => {
    setUser(null)
    localStorage.removeItem('token')
    setLoading(false)
  }

  const login = (userData) => {
    updateUser(userData)
  }

  const logout = () => {
    clearUser()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser, 
      clearUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
