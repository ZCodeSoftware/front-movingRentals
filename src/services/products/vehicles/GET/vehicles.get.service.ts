import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { IVehicles } from '../../models/vehicles.interface'

export const fetchVehicles = async (id: string): Promise<IVehicles[]> => {
  const response = await AppApiGateWayNoJWT.get('/vehicle')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response.data.filter((p: IVehicles) => p.category._id === id))
    }, 1000)
  })
}

export const fetchAllVehicles = async (): Promise<IVehicles[]> => {
  const response = await AppApiGateWayNoJWT.get('/vehicle')
  return response.data
}
