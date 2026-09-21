import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',   // '' → uses Vite proxy
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Normalize errors: always expose a .message string
api.interceptors.response.use(
  res => res,
  err => {
    const payload = err.response?.data
    err.friendlyMessage =
      payload?.message ||
      err.message ||
      'Something went wrong'
    console.error('[API]', err.config?.method?.toUpperCase(), err.config?.url, '→', err.friendlyMessage)
    return Promise.reject(err)
  }
)

export default api