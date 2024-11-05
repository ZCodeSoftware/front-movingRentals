import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { setLocalStorage } from '../../../../utils/local-storage/setLocalStorage'
import { useNavigate } from 'react-router-dom'
import { IAuth } from '../../models/auth.interface'

export const login = async (body: IAuth) => {
  const navigate = useNavigate()
  try {
    const response = await AppApiGateWayNoJWT.post('/auth/login', body)
    if (response) {
      const data = response.data
      setLocalStorage('user', data)
      navigate('/home')
    }
  } catch (error) {
    throw error
  }
}
