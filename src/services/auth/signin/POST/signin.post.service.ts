import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { IAuth } from '../../models/auth.interface'

export const signin = async (body: IAuth) => {
  try {
    const res = await AppApiGateWayNoJWT.post('/auth/signin', body)
    return res.data
  } catch (error) {
    throw error
  }
}
