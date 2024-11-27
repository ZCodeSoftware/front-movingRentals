import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const AppInterceptors = {
  req: (config: InternalAxiosRequestConfig) => {
    const user = localStorage.getItem('user')
    const parsedUser = user && JSON.parse(user)
    const jwt = parsedUser.token

    if (jwt) {
      config.headers.set('Authorization', `Bearer ${jwt}`)
    }

    return config
  },
  reqErr: (err: AxiosError) => {
    return Promise.reject(err)
  },
  res: (res: AxiosResponse) => {
    return res
  },
  resErr: (err: AxiosError) => {
    if (err.response?.status === 401) {
      console.log('Response error: ', err)
    }

    return Promise.reject(err)
  }
}
