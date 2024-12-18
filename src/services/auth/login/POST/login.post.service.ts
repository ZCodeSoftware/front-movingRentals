import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { setLocalStorage } from '../../../../utils/local-storage/setLocalStorage'
import { IAuth } from '../../models/auth.interface'

export const login = async (body: IAuth) => {
  try {
    const response = await AppApiGateWayNoJWT.post('/auth/login', body)
    if (response) {
      const data = response.data
      setLocalStorage('user', data)
    }
    return response
  } catch (error) {
    throw error
  }
}
