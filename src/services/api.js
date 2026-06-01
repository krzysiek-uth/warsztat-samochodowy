

import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
})

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd podczas rejestracji'
    }
  }
}

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd podczas logowania'
    }
  }
}

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd podczas wylogowania'
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania danych użytkownika'
    }
  }
}

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd podczas tworzenia rezerwacji'
    }
  }
}

export const getMyBookings = async () => {
  try {
    const response = await api.get('/bookings/my')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania rezerwacji'
    }
  }
}

export const getAllBookings = async () => {
  try {
    const response = await api.get('/bookings')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania rezerwacji'
    }
  }
}

export const updateBookingStatus = async (bookingId, status, cost, estimatedCompletionTime) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status, cost, estimatedCompletionTime })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd zmiany statusu'
    }
  }
}

export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd usuwania rezerwacji'
    }
  }
}

export const getServices = async () => {
  try {
    const response = await api.get('/services')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania usług'
    }
  }
}

export const getUsers = async () => {
  try {
    const response = await api.get('/users')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania użytkowników'
    }
  }
}

export const getReviews = async () => {
  try {
    const response = await api.get('/reviews')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania opinii'
    }
  }
}

export const getMyReviews = async () => {
  try {
    const response = await api.get('/reviews/my')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania opinii'
    }
  }
}

export const getReviewStats = async () => {
  try {
    const response = await api.get('/reviews/stats')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Błąd pobierania statystyk'
    }
  }
}

export default {
  
  register,
  login,
  logout,
  getCurrentUser,

  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,

  getServices,

  getUsers,

  getReviews,
  getMyReviews,
  getReviewStats
}
