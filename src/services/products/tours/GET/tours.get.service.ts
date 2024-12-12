import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { ITours } from '../../models/tours.interface'

export const fetchTours = async (id: string): Promise<ITours[]> => {
  const response = await AppApiGateWayNoJWT.get('/tour')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response.data.filter((p: ITours) => p.category._id === id))
    }, 1000)
  })
}

export const fetchAllTours = async (): Promise<ITours[]> => {
  const response = await AppApiGateWayNoJWT.get('/tour')
  return response.data
}
