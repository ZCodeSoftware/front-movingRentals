import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { setLocalStorage } from '../../../../utils/local-storage/setLocalStorage'
import { ILoginInterface } from './models/login.post.interface'

export const login = async (body: ILoginInterface) => {
  try {
    const response = await AppApiGateWayNoJWT.post('/auth/login', body)
    if (response) {
      const data = response.data
      setLocalStorage('user', data)
    }
  } catch (error) {
    throw error
  }
}
