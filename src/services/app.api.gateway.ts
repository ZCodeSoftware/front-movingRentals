import { AppInterceptors } from './interceptors'
import axios from 'axios'

export const AppAlpexApiGateWay = axios.create({
  baseURL: process.env.VITE_APP_API_GATEWAY,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': process.env.VITE_API_KEY
  },
  timeout: 60000
})

AppAlpexApiGateWay.interceptors.request.use(AppInterceptors.req, AppInterceptors.reqErr)

AppAlpexApiGateWay.interceptors.response.use(AppInterceptors.res, AppInterceptors.resErr)
