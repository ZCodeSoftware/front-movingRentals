import { AppApiGateWayNoJWT } from '../../app.api.gateway-no-jwt'
import { IExchange } from '../models/exchange.interface'

export const getExchange = async (): Promise<IExchange> => {
  const response = await AppApiGateWayNoJWT.get('/exchange-rate/pair/MXN/USD')
  return response.data
}
