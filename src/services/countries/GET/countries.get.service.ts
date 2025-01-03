import { AppApiGateWayNoJWT } from '../../app.api.gateway-no-jwt'
import { ICountries } from '../models/countries.interface'

export const getCountries = async (): Promise<ICountries> => {
  const response = await AppApiGateWayNoJWT.get('/cat-country')
  return response.data
}
