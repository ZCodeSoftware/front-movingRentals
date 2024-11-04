import axios from 'axios'

export const AppApiGateWayNoJWT = axios.create({
  baseURL: import.meta.env.VITE_APP_API_GATEWAY,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY
  },
  timeout: 60000
})
