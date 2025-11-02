import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // Token is already base64 encoded (email:password)
    config.headers.Authorization = `Basic ${token}`
  }
  
  // If data is FormData, remove Content-Type to let axios set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  return config
})

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

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Jobs API
export const jobsAPI = {
  getAll: async () => {
    const response = await api.get('/jobs/')
    return response.data
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
  getAll: async () => {
    const response = await api.get('/applications/')
    return response.data
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

