import axios from 'axios'

export const AppApiGateWayNoJWT = axios.create({
    baseURL: process.env.VITE_APP_API_GATEWAY,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_API_KEY
    },
    timeout: 25000
})
