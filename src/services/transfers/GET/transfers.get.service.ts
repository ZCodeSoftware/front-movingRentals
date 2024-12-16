import { AppApiGateWayNoJWT } from '../../app.api.gateway-no-jwt'
import { ITransfers } from '../models/transfers.interface'

export const fetchTransfers = async (): Promise<ITransfers[]> => {
  const response = await AppApiGateWayNoJWT.get('/transfer')
  return response.data
}
