import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT access token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // If data is FormData, remove Content-Type to let axios set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

// Auto-refresh expired access tokens using refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          })
          const newAccess = res.data.access
          localStorage.setItem('access_token', newAccess)
          // If server rotates refresh tokens, store the new one
          if (res.data.refresh) {
            localStorage.setItem('refresh_token', res.data.refresh)
          }
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh token also expired — force logout
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/users/login/', { email, password })
    return response.data
  },

  register: async (email, password, is_employer = false, is_applicant = true) => {
    const response = await api.post('/users/register/', {
      email,
      password,
      is_employer,
      is_applicant,
    })
    return response.data
  },
}

// Jobs API
export const jobsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/jobs/', { params })
    // Handle paginated response from DRF
    return response.data.results || response.data
  },

  getById: async (id) => {
    const response = await api.get(`/jobs/${id}/`)
    return response.data
  },

  create: async (jobData) => {
    const response = await api.post('/jobs/', jobData)
    return response.data
  },

  update: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}/`, jobData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/jobs/${id}/`)
    return response.data
  },
}

// Applications API
export const applicationsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/applications/', { params })
    // Handle paginated response from DRF
    return response.data.results || response.data
  },

  getById: async (id) => {
    const response = await api.get(`/applications/${id}/`)
    return response.data
  },

  create: async (applicationData) => {
    const formData = new FormData()
    // Ensure job ID is sent as a number (FormData will convert to string)
    formData.append('job', applicationData.job)
    formData.append('resume', applicationData.resume)
    // Content-Type will be set automatically by axios for FormData
    const response = await api.post('/applications/', formData)
    return response.data
  },

  update: async (id, applicationData) => {
    // Use PATCH for partial updates (only status)
    const response = await api.patch(`/applications/${id}/`, applicationData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/applications/${id}/`)
    return response.data
  },
}

export default api
